import { en } from "./en";
import { es, type Dictionary } from "./es";

export const LANGS = ["es", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "es";

export const DICTIONARIES: Record<Lang, Dictionary> = { es, en };
export type { Dictionary };
