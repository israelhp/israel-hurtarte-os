import { APP_IDS, type AppId } from "@/shared/app-ids";

/** Pure window-manager model: every function returns a new state and never touches the DOM or timers. */

export const TOP = 40; // menu bar height
export const DOCK_SPACE = 92; // space reserved for the dock
export const EDGE = 8;
export const MIN_W = 280;
export const MIN_H = 220;
// Compact screens (phones, and landscape phones where the height is the limit): windows are full-screen and
// cannot be dragged. Must mirror the `@media (max-width: 760px), (max-height: 500px)` rules in the theme CSS.
export const COMPACT_MAX_WIDTH = 760;
export const COMPACT_MAX_HEIGHT = 500;
/** Renormalize z-indices before they grow without bound. */
const Z_LIMIT = 5000;

/** Default window sizes from the prototype (template line 1519). */
export const SIZES: Record<AppId, readonly [number, number]> = {
  home: [600, 480],
  about: [760, 580],
  stack: [1000, 620],
  projects: [1040, 650],
  experience: [860, 660],
  education: [760, 660],
  certs: [880, 580],
  terminal: [720, 460],
  contact: [860, 600],
};

export type Viewport = { w: number; h: number };
export type Anim = "" | "closing" | "minimizing";
export type Geo = { x: number; y: number; w: number; h: number };
export type WinState = Geo & { open: boolean; min: boolean; max: boolean; anim: Anim; z: number };
export type WmState = {
  wins: Record<AppId, WinState>;
  /** Highest z handed out so far. */
  zTop: number;
  /** Focused window, or null when none is visible. */
  active: AppId | null;
  /** Counter used to cascade newly opened windows. */
  cascade: number;
};

const closedWin = (id: AppId): WinState => ({
  open: false,
  min: false,
  max: false,
  anim: "",
  x: 80,
  y: 80,
  w: SIZES[id][0],
  h: SIZES[id][1],
  z: 1,
});

export function initialState(): WmState {
  const wins = {} as Record<AppId, WinState>;
  for (const id of APP_IDS) wins[id] = closedWin(id);
  return { wins, zTop: 10, active: null, cascade: 0 };
}

export const isVisible = (w: WinState) => w.open && !w.min;
export const isCompact = (vp: Viewport) => vp.w <= COMPACT_MAX_WIDTH || vp.h <= COMPACT_MAX_HEIGHT;

/** Keep a window fully reachable: inside the viewport, below the menu bar and above the dock. */
export function clampGeo(g: Geo, vp: Viewport): Geo {
  const w = Math.max(MIN_W, Math.min(g.w, vp.w - 2 * EDGE));
  const h = Math.max(MIN_H, Math.min(g.h, vp.h - TOP - DOCK_SPACE - EDGE));
  const x = Math.max(EDGE, Math.min(g.x, vp.w - w - EDGE));
  const y = Math.max(TOP + EDGE, Math.min(g.y, vp.h - DOCK_SPACE - h));
  return { x, y, w, h };
}

function place(id: AppId, vp: Viewport, cascade: number): Geo {
  const [w0, h0] = SIZES[id];
  const w = Math.min(w0, vp.w - 32);
  const h = Math.min(h0, vp.h - TOP - DOCK_SPACE - 16);
  const off = (cascade % 6) * 26;
  return clampGeo(
    {
      x: (vp.w - w) / 2 - 70 + off,
      y: TOP + (vp.h - TOP - DOCK_SPACE - h) / 2 - 40 + off,
      w,
      h,
    },
    vp,
  );
}

/** Topmost window that is open and not minimized (closing windows excluded), if any. */
export function topmost(wins: WmState["wins"], except?: AppId): AppId | null {
  let best: AppId | null = null;
  for (const id of APP_IDS) {
    const w = wins[id];
    if (id === except || !isVisible(w) || w.anim === "closing") continue;
    if (best === null || w.z > wins[best].z) best = id;
  }
  return best;
}

function patch(s: WmState, id: AppId, p: Partial<WinState>): WmState {
  return { ...s, wins: { ...s.wins, [id]: { ...s.wins[id], ...p } } };
}

/** Compact z-indices to 11..n+10 (keeping order, top window == zTop) when they approach the limit. */
function normalizeZ(s: WmState): WmState {
  if (s.zTop < Z_LIMIT) return s;
  const order = APP_IDS.filter((id) => s.wins[id].open).sort((a, b) => s.wins[a].z - s.wins[b].z);
  const wins = { ...s.wins };
  order.forEach((id, i) => (wins[id] = { ...wins[id], z: i + 11 }));
  return { ...s, wins, zTop: order.length + 10 };
}

/** Open a window (placing it with a cascade offset) or bring an open one to the front, restoring it if minimized. */
export function openWindow(s: WmState, id: AppId, vp: Viewport): WmState {
  const z = s.zTop + 1;
  const w = s.wins[id];
  const next = w.open
    ? patch(s, id, { min: false, anim: "", z })
    : patch(s, id, {
        ...place(id, vp, s.cascade),
        open: true,
        min: false,
        max: false,
        anim: "",
        z,
      });
  return normalizeZ({
    ...next,
    zTop: z,
    active: id,
    cascade: w.open ? s.cascade : s.cascade + 1,
  });
}

export function focusWindow(s: WmState, id: AppId): WmState {
  const w = s.wins[id];
  if (!isVisible(w) || w.anim === "closing") return s;
  if (s.active === id && w.z === s.zTop) return s;
  const z = s.zTop + 1;
  return normalizeZ({ ...patch(s, id, { z }), zTop: z, active: id });
}

export const beginClose = (s: WmState, id: AppId): WmState =>
  s.wins[id].open ? patch(s, id, { anim: "closing" }) : s;

export function finishClose(s: WmState, id: AppId): WmState {
  const next = patch(s, id, { open: false, min: false, max: false, anim: "" });
  return { ...next, active: s.active === id ? topmost(next.wins) : s.active };
}

export const beginMinimize = (s: WmState, id: AppId): WmState =>
  isVisible(s.wins[id]) ? patch(s, id, { anim: "minimizing" }) : s;

export function finishMinimize(s: WmState, id: AppId): WmState {
  const next = patch(s, id, { min: true, anim: "" });
  return { ...next, active: s.active === id ? topmost(next.wins) : s.active };
}

export const toggleMax = (s: WmState, id: AppId): WmState =>
  isVisible(s.wins[id]) ? patch(s, id, { max: !s.wins[id].max }) : s;

/** Move a window; the result is clamped so it can never leave the visible area. */
export function moveWindow(s: WmState, id: AppId, x: number, y: number, vp: Viewport): WmState {
  const w = s.wins[id];
  if (!isVisible(w) || w.max || isCompact(vp)) return s;
  const g = clampGeo({ x, y, w: w.w, h: w.h }, vp);
  return g.x === w.x && g.y === w.y ? s : patch(s, id, { x: g.x, y: g.y });
}

/** Re-clamp every open window after the viewport changed (never shrinks below its default size when room allows). */
export function viewportChanged(s: WmState, vp: Viewport): WmState {
  const wins = { ...s.wins };
  for (const id of APP_IDS) {
    const w = wins[id];
    if (!w.open) continue;
    const want = {
      x: w.x,
      y: w.y,
      w: Math.max(w.w, Math.min(SIZES[id][0], vp.w - 32)),
      h: Math.max(w.h, Math.min(SIZES[id][1], vp.h - TOP - DOCK_SPACE - 16)),
    };
    wins[id] = { ...w, ...clampGeo(want, vp) };
  }
  return { ...s, wins };
}

/** Close everything (used by "Reset windows"). */
export const resetWindows = (): WmState => initialState();
