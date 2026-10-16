import { create } from "zustand";
import { TOUR_STEPS } from "@/i18n/tour";
import { writeTourDone } from "@/features/settings/persistence";
import { useWm } from "@/features/window-manager/store";
import type { Spot } from "./geometry";

/** Delay between the visitor doing the highlighted action and the tour moving on. */
export const ADVANCE_MS = 550;

type TourState = {
  on: boolean;
  /** True once the visitor finished or skipped it in this page session (works even if localStorage is blocked). */
  dismissed: boolean;
  step: number;
  spot: Spot | null;
  start: () => void;
  go: (n: number) => void;
  end: () => void;
  setSpot: (s: Spot | null) => void;
  /** Called with app events ("open:projects", "max:projects", "detail", "theme", "lang", "portfolio"). */
  event: (name: string) => void;
};

let pendingStep: number | null = null;
/** Events caused by the tour itself (preparing a step opens a window) must not advance the tour. */
let preparing = false;
let advanceTimer: ReturnType<typeof setTimeout> | undefined;

const same = (a: Spot | null, b: Spot | null) =>
  a === b || (!!a && !!b && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h);

export const useTour = create<TourState>()((set, get) => ({
  on: false,
  dismissed: false,
  step: 0,
  spot: null,
  start: () => {
    clearTimeout(advanceTimer);
    pendingStep = null;
    set({ on: true, step: 0, spot: null });
  },
  go: (n) => {
    clearTimeout(advanceTimer);
    pendingStep = null;
    const target = Math.max(0, n);
    if (target >= TOUR_STEPS.length) return get().end();
    set({ on: true, step: target, spot: null });
    const prep = TOUR_STEPS[target].prep;
    if (prep) {
      const wm = useWm.getState();
      const w = wm.wins[prep as keyof typeof wm.wins];
      preparing = true;
      try {
        if (!w.open || w.min) wm.open(prep as Parameters<typeof wm.open>[0]);
        else wm.focus(prep as Parameters<typeof wm.focus>[0]);
      } finally {
        preparing = false;
      }
    }
  },
  end: () => {
    clearTimeout(advanceTimer);
    pendingStep = null;
    writeTourDone();
    set({ on: false, dismissed: true, step: 0, spot: null });
    // Leave only the Welcome window open after the tour (prototype behaviour).
    const wm = useWm.getState();
    wm.reset();
    wm.open("home");
  },
  setSpot: (spot) => set((s) => (same(s.spot, spot) ? s : { spot })),
  event: (name) => {
    const { on, step } = get();
    if (!on || preparing) return;
    const def = TOUR_STEPS[step];
    const match = def.on === name || (def.id === "prefs" && name === "lang");
    if (!match || pendingStep === step) return;
    pendingStep = step;
    clearTimeout(advanceTimer);
    advanceTimer = setTimeout(() => {
      const s = get();
      if (s.on && s.step === step) s.go(step + 1);
    }, ADVANCE_MS);
  },
}));
