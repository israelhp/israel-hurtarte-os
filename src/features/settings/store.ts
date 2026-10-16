import { create } from "zustand";
import type { Accent } from "@/shared/theme/options";
import type { ThemeChoice } from "./persistence";

export type { ThemeChoice };

type SettingsState = {
  theme: ThemeChoice;
  accent: Accent;
  settingsOpen: boolean;
  /** True once stored preferences were read on the client (persisting before that would overwrite them). */
  hydrated: boolean;
  setTheme: (t: ThemeChoice) => void;
  setAccent: (a: Accent) => void;
  setSettingsOpen: (open: boolean) => void;
};

// Defaults follow the prototype (theme auto, blue accent). The language is not here: it comes from the route.
export const useSettings = create<SettingsState>()((set) => ({
  theme: "auto",
  accent: "blue",
  settingsOpen: false,
  hydrated: false,
  setTheme: (theme) => set({ theme }),
  setAccent: (accent) => set({ accent }),
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
}));
