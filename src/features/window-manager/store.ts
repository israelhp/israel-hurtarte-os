import { create } from "zustand";
import type { AppId } from "@/shared/app-ids";
import { emit } from "@/lib/events";
import * as wm from "./model";

type Extra = {
  /** Incremented on every explicit open request so windows can take keyboard focus. */ openTick: number;
};
type Actions = {
  open: (id: AppId) => void;
  focus: (id: AppId) => void;
  close: (id: AppId) => void;
  minimize: (id: AppId) => void;
  toggleMax: (id: AppId) => void;
  move: (id: AppId, x: number, y: number) => void;
  syncViewport: () => void;
  reset: () => void;
};

export const getViewport = (): wm.Viewport =>
  typeof window === "undefined"
    ? { w: 1280, h: 800 }
    : { w: window.innerWidth || 1280, h: window.innerHeight || 800 };

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const CLOSE_MS = 150; // winOut .16s
const MINIMIZE_MS = 190; // winMin .2s

/**
 * Window-manager store. Windows subscribe to their own slice (`s.wins[id]`), so changing one
 * window does not re-render the others. All logic lives in the pure `model`.
 */
export const useWm = create<wm.WmState & Extra & Actions>()((set, get) => {
  const timers: Partial<Record<AppId, ReturnType<typeof setTimeout>>> = {};
  const clearTimer = (id: AppId) => {
    clearTimeout(timers[id]);
    delete timers[id];
  };
  const finishLater = (id: AppId, anim: "closing" | "minimizing", ms: number) => {
    clearTimer(id);
    const run = () => {
      delete timers[id];
      // The window may have been reopened while it animated: only finish what is still pending.
      if (get().wins[id].anim !== anim) return;
      set((s) => (anim === "closing" ? wm.finishClose(s, id) : wm.finishMinimize(s, id)));
    };
    if (reducedMotion()) run();
    else timers[id] = setTimeout(run, ms);
  };

  return {
    ...wm.initialState(),
    openTick: 0,
    open: (id) => {
      clearTimer(id);
      set((s) => ({ ...wm.openWindow(s, id, getViewport()), openTick: s.openTick + 1 }));
      emit(`open:${id}`);
    },
    focus: (id) => set((s) => wm.focusWindow(s, id)),
    close: (id) => {
      set((s) => wm.beginClose(s, id));
      finishLater(id, "closing", CLOSE_MS);
    },
    minimize: (id) => {
      set((s) => wm.beginMinimize(s, id));
      finishLater(id, "minimizing", MINIMIZE_MS);
    },
    toggleMax: (id) => {
      set((s) => wm.toggleMax(s, id));
      emit(`max:${id}`);
    },
    move: (id, x, y) => set((s) => wm.moveWindow(s, id, x, y, getViewport())),
    syncViewport: () => set((s) => wm.viewportChanged(s, getViewport())),
    reset: () => {
      (Object.keys(timers) as AppId[]).forEach(clearTimer);
      set(wm.resetWindows());
    },
  };
});
