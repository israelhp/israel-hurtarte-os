"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LANG, type Lang } from "@/i18n";

const LangContext = createContext<Lang>(DEFAULT_LANG);

/** Provides the language taken from the URL (`/es`, `/en`), known at build time for every static page. */
export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
