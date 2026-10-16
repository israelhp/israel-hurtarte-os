import { describe, expect, it } from "vitest";
import { APP_IDS } from "@/shared/app-ids";
import {
  DOCK_SPACE,
  EDGE,
  SIZES,
  TOP,
  beginClose,
  beginMinimize,
  clampGeo,
  finishClose,
  finishMinimize,
  focusWindow,
  initialState,
  isVisible,
  moveWindow,
  openWindow,
  resetWindows,
  toggleMax,
  topmost,
  viewportChanged,
  type Viewport,
  type WmState,
} from "./model";

const VP: Viewport = { w: 1440, h: 900 };
const open = (s: WmState, ...ids: (typeof APP_IDS)[number][]) =>
  ids.reduce((acc, id) => openWindow(acc, id, VP), s);

describe("initial state", () => {
  it("has every app closed with prototype default sizes", () => {
    const s = initialState();
    for (const id of APP_IDS) {
      expect(s.wins[id].open).toBe(false);
      expect([s.wins[id].w, s.wins[id].h]).toEqual([...SIZES[id]]);
    }
    expect(s.active).toBeNull();
  });
});

describe("open + focus + z-order", () => {
  it("opens and activates a window on top", () => {
    const s = open(initialState(), "home");
    expect(s.wins.home).toMatchObject({ open: true, min: false, max: false });
    expect(s.active).toBe("home");
  });

  it("stacks windows in opening order and focus moves a window to the front", () => {
    let s = open(initialState(), "home", "about", "projects");
    expect(topmost(s.wins)).toBe("projects");
    s = focusWindow(s, "home");
    expect(s.active).toBe("home");
    expect(topmost(s.wins)).toBe("home");
    expect(s.wins.home.z).toBeGreaterThan(s.wins.projects.z);
  });

  it("opening an already open window only refocuses it (no re-place)", () => {
    let s = open(initialState(), "home", "about");
    const geo = { x: s.wins.home.x, y: s.wins.home.y };
    s = openWindow(s, "home", VP);
    expect(s.active).toBe("home");
    expect({ x: s.wins.home.x, y: s.wins.home.y }).toEqual(geo);
  });

  it("cascades newly opened windows so they do not overlap exactly", () => {
    const s = open(initialState(), "home", "about");
    expect(s.wins.about.x).not.toBe(s.wins.home.x);
    expect(s.wins.about.y).not.toBe(s.wins.home.y);
  });

  it("ignores focus on closed or minimized windows", () => {
    const s = initialState();
    expect(focusWindow(s, "home")).toBe(s);
  });

  it("keeps z-indices bounded by renormalizing", () => {
    let s = open(initialState(), "home", "about");
    for (let i = 0; i < 6000; i++) s = focusWindow(s, i % 2 ? "home" : "about");
    expect(s.zTop).toBeLessThan(5100);
    expect(s.wins.home.z).not.toBe(s.wins.about.z);
  });

  it("after renormalizing, the top window's z equals zTop so refocusing it is a no-op", () => {
    let s = open(initialState(), "home", "about");
    for (let i = 0; i < 6000; i++) s = focusWindow(s, i % 2 ? "home" : "about");
    const top = topmost(s.wins)!;
    expect(s.wins[top].z).toBe(s.zTop);
    expect(focusWindow(s, top)).toBe(s);
  });
});

describe("minimize / restore", () => {
  it("minimizing hands focus to the next visible window", () => {
    let s = open(initialState(), "home", "about");
    s = finishMinimize(beginMinimize(s, "about"), "about");
    expect(s.wins.about.min).toBe(true);
    expect(isVisible(s.wins.about)).toBe(false);
    expect(s.active).toBe("home");
  });

  it("minimizing the last window leaves nothing active", () => {
    let s = open(initialState(), "home");
    s = finishMinimize(beginMinimize(s, "home"), "home");
    expect(s.active).toBeNull();
  });

  it("opening a minimized window restores and focuses it", () => {
    let s = open(initialState(), "home", "about");
    s = finishMinimize(beginMinimize(s, "about"), "about");
    s = openWindow(s, "about", VP);
    expect(s.wins.about.min).toBe(false);
    expect(s.active).toBe("about");
  });
});

describe("close", () => {
  it("marks closing, then closes and activates the next window", () => {
    let s = open(initialState(), "home", "about");
    s = beginClose(s, "about");
    expect(s.wins.about.anim).toBe("closing");
    s = finishClose(s, "about");
    expect(s.wins.about).toMatchObject({ open: false, min: false, max: false, anim: "" });
    expect(s.active).toBe("home");
  });

  it("does not hand focus to a window that is itself closing", () => {
    let s = open(initialState(), "home", "about", "stack");
    s = beginClose(s, "about");
    s = finishClose(beginClose(s, "stack"), "stack");
    expect(s.active).toBe("home");
  });

  it("a closed window reopens at default size, not maximized", () => {
    let s = open(initialState(), "home");
    s = toggleMax(s, "home");
    s = finishClose(beginClose(s, "home"), "home");
    s = openWindow(s, "home", VP);
    expect(s.wins.home.max).toBe(false);
  });
});

describe("maximize", () => {
  it("toggles only visible windows", () => {
    let s = open(initialState(), "home");
    s = toggleMax(s, "home");
    expect(s.wins.home.max).toBe(true);
    s = toggleMax(s, "home");
    expect(s.wins.home.max).toBe(false);
    const closed = initialState();
    expect(toggleMax(closed, "about")).toBe(closed);
  });
});

describe("move + clamp", () => {
  it("clamps a window inside the viewport, below the menu bar and above the dock", () => {
    const g = clampGeo({ x: -500, y: -500, w: 600, h: 400 }, VP);
    expect(g.x).toBe(EDGE);
    expect(g.y).toBe(TOP + EDGE);
    const far = clampGeo({ x: 9999, y: 9999, w: 600, h: 400 }, VP);
    expect(far.x + far.w).toBeLessThanOrEqual(VP.w - EDGE);
    expect(far.y + far.h).toBeLessThanOrEqual(VP.h - DOCK_SPACE);
  });

  it("never lets a drag push a window out of reach", () => {
    let s = open(initialState(), "home");
    s = moveWindow(s, "home", -4000, 9000, VP);
    const w = s.wins.home;
    expect(w.x).toBeGreaterThanOrEqual(EDGE);
    expect(w.y + w.h).toBeLessThanOrEqual(VP.h - DOCK_SPACE);
    expect(w.y).toBeGreaterThanOrEqual(TOP + EDGE);
  });

  it("does not move maximized windows or any window on compact screens", () => {
    let s = open(initialState(), "home");
    const before = { ...s.wins.home };
    expect(moveWindow(s, "home", 10, 10, { w: 700, h: 900 })).toBe(s);
    s = toggleMax(s, "home");
    expect(moveWindow(s, "home", 10, 10, VP)).toBe(s);
    expect(s.wins.home.x).toBe(before.x);
  });
});

describe("viewport changes", () => {
  it("re-clamps open windows when the viewport shrinks", () => {
    let s = open(initialState(), "projects", "stack");
    const small: Viewport = { w: 900, h: 600 };
    s = viewportChanged(s, small);
    for (const id of ["projects", "stack"] as const) {
      const w = s.wins[id];
      expect(w.x + w.w).toBeLessThanOrEqual(small.w - EDGE);
      expect(w.y + w.h).toBeLessThanOrEqual(small.h - DOCK_SPACE);
      expect(w.y).toBeGreaterThanOrEqual(TOP + EDGE);
    }
  });

  it("leaves closed windows untouched", () => {
    const s = initialState();
    expect(viewportChanged(s, { w: 500, h: 500 }).wins.home).toEqual(s.wins.home);
  });
});

describe("reset", () => {
  it("closes everything", () => {
    const s = resetWindows();
    expect(APP_IDS.every((id) => !s.wins[id].open)).toBe(true);
    expect(s.active).toBeNull();
  });
});
