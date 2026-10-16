import { ACCENTS, type Accent } from "@/shared/theme/options";
import { LANGS, type Lang } from "@/i18n";

export type ThemeChoice = "light" | "dark" | "auto";
export const THEME_CHOICES: readonly ThemeChoice[] = ["light", "dark", "auto"];

export const SETTINGS_KEY = "ihos:settings:v1";
export const LANG_KEY = "ihos:lang";
export const TOUR_KEY = "ihos:tour-done";

export type StoredSettings = { theme?: ThemeChoice; accent?: Accent };

const storage = (): Storage | null => {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null; // blocked (private mode, disabled cookies, …)
  }
};

/** Parse stored settings, keeping only whitelisted values. Anything else is ignored. */
export function parseSettings(raw: string | null): StoredSettings {
  if (!raw) return {};
  try {
    const v: unknown = JSON.parse(raw);
    if (!v || typeof v !== "object") return {};
    const { theme, accent } = v as Record<string, unknown>;
    return {
      ...(THEME_CHOICES.includes(theme as ThemeChoice) ? { theme: theme as ThemeChoice } : {}),
      ...(ACCENTS.includes(accent as Accent) ? { accent: accent as Accent } : {}),
    };
  } catch {
    return {};
  }
}

export function readSettings(): StoredSettings {
  try {
    return parseSettings(storage()?.getItem(SETTINGS_KEY) ?? null);
  } catch {
    return {};
  }
}

export function writeSettings(s: Required<StoredSettings>): void {
  try {
    storage()?.setItem(SETTINGS_KEY, JSON.stringify({ theme: s.theme, accent: s.accent }));
  } catch {
    /* storage unavailable: preferences just won't persist */
  }
}

export function readLang(): Lang | null {
  try {
    const v = storage()?.getItem(LANG_KEY);
    return LANGS.includes(v as Lang) ? (v as Lang) : null;
  } catch {
    return null;
  }
}

export function writeLang(lang: Lang): void {
  try {
    storage()?.setItem(LANG_KEY, lang);
  } catch {
    /* ignore */
  }
}

export function readTourDone(): boolean {
  try {
    return storage()?.getItem(TOUR_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeTourDone(): void {
  try {
    storage()?.setItem(TOUR_KEY, "1");
  } catch {
    /* ignore */
  }
}
