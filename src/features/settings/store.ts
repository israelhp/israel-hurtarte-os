import { create } from "zustand";
import type { Accent } from "@/shared/theme/options";
import { DEFAULT_LANG, type Lang } from "@/i18n";

export type ThemeChoice = "light" | "dark" | "auto";

type SettingsState = {
  lang: Lang;
  theme: ThemeChoice;
  accent: Accent;
  settingsOpen: boolean;
  setLang: (l: Lang) => void;
  setTheme: (t: ThemeChoice) => void;
  setAccent: (a: Accent) => void;
  setSettingsOpen: (open: boolean) => void;
};

// Defaults follow the prototype (theme auto, blue accent) with Spanish as default language.
// Persistence across visits is added in Phase 5.
export const useSettings = create<SettingsState>()((set) => ({
  lang: DEFAULT_LANG,
  theme: "auto",
  accent: "blue",
  settingsOpen: false,
  setLang: (lang) => set({ lang }),
  setTheme: (theme) => set({ theme }),
  setAccent: (accent) => set({ accent }),
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
}));
