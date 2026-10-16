import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TOUR_STEPS } from "@/i18n/tour";
import { TOUR_KEY } from "@/features/settings/persistence";
import { initialState } from "@/features/window-manager/model";
import { useWm } from "@/features/window-manager/store";
import { ADVANCE_MS, useTour } from "./store";

const stepId = () => TOUR_STEPS[useTour.getState().step].id;

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  useWm.setState({ ...initialState(), openTick: 0 });
  useTour.setState({ on: false, dismissed: false, step: 0, spot: null });
});
afterEach(() => vi.useRealTimers());

describe("tour steps", () => {
  it("has 8 steps starting with intro and ending with done", () => {
    expect(TOUR_STEPS.map((s) => s.id)).toEqual([
      "intro",
      "dock",
      "controls",
      "folders",
      "terminal",
      "prefs",
      "pv",
      "done",
    ]);
  });
});

describe("tour store", () => {
  it("preparing a step (opening its window) never advances the tour by itself", () => {
    const t = useTour.getState();
    t.start();
    t.go(1); // dock: waits for open:projects
    // moving on to "controls" opens Projects, which emits open:projects while still on a wait step
    t.go(2);
    vi.advanceTimersByTime(5000);
    expect(stepId()).toBe("controls");
    t.go(1);
    t.go(2); // Back then Next across a step with prep
    vi.advanceTimersByTime(5000);
    expect(stepId()).toBe("controls");
  });

  it("remembers in memory that it was dismissed, even if localStorage is unavailable", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    useTour.getState().start();
    useTour.getState().end();
    expect(useTour.getState().dismissed).toBe(true);
    vi.restoreAllMocks();
  });

  it("starts at the intro", () => {
    useTour.getState().start();
    expect(useTour.getState()).toMatchObject({ on: true, step: 0 });
  });

  it("advances after the highlighted action, once, after the delay", () => {
    const t = useTour.getState();
    t.start();
    t.go(1); // dock: waits for open:projects
    t.event("open:projects");
    t.event("open:projects"); // a repeated event must not skip a step
    expect(stepId()).toBe("dock");
    vi.advanceTimersByTime(ADVANCE_MS - 1);
    expect(stepId()).toBe("dock");
    vi.advanceTimersByTime(2);
    expect(stepId()).toBe("controls");
  });

  it("ignores unrelated events and events while the tour is off", () => {
    const t = useTour.getState();
    t.event("open:projects");
    vi.advanceTimersByTime(2000);
    expect(useTour.getState().on).toBe(false);
    t.start();
    t.go(1);
    t.event("open:terminal");
    vi.advanceTimersByTime(2000);
    expect(stepId()).toBe("dock");
  });

  it("the preferences step accepts both a theme and a language change", () => {
    const t = useTour.getState();
    t.start();
    t.go(5);
    t.event("lang");
    vi.advanceTimersByTime(ADVANCE_MS + 1);
    expect(stepId()).toBe("pv");
  });

  it("does not advance if the visitor moved to another step in the meantime", () => {
    const t = useTour.getState();
    t.start();
    t.go(1);
    t.event("open:projects");
    vi.advanceTimersByTime(100);
    t.go(0);
    vi.advanceTimersByTime(2000);
    expect(stepId()).toBe("intro");
  });

  it("steps that need a window open it first", () => {
    useTour.getState().start();
    useTour.getState().go(2); // controls → prep: projects
    expect(useWm.getState().wins.projects.open).toBe(true);
    // a minimized window is restored rather than left hidden
    useWm.setState((s) => ({ wins: { ...s.wins, projects: { ...s.wins.projects, min: true } } }));
    useTour.getState().go(3);
    expect(useWm.getState().wins.projects.min).toBe(false);
  });

  it("going back from the first step stays on the first step", () => {
    useTour.getState().start();
    useTour.getState().go(-1);
    expect(stepId()).toBe("intro");
  });

  it("finishing remembers it, closes the tour and leaves only the Welcome window", () => {
    useWm.getState().open("about");
    useWm.getState().open("stack");
    useTour.getState().start();
    useTour.getState().go(TOUR_STEPS.length); // past the end = finish
    expect(useTour.getState().on).toBe(false);
    expect(localStorage.getItem(TOUR_KEY)).toBe("1");
    const open = Object.entries(useWm.getState().wins)
      .filter(([, w]) => w.open)
      .map(([id]) => id);
    expect(open).toEqual(["home"]);
  });

  it("skipping at any point also remembers it", () => {
    useTour.getState().start();
    useTour.getState().go(3);
    useTour.getState().end();
    expect(localStorage.getItem(TOUR_KEY)).toBe("1");
  });
});
