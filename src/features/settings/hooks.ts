"use client";

import { useSyncExternalStore } from "react";
import { DICTIONARIES, type Dictionary } from "@/i18n";
import { useLang } from "./LangProvider";
import { useSettings } from "./store";

export { useLang };

/** Translation dictionary for the language in the URL. */
export function useT(): Dictionary {
  return DICTIONARIES[useLang()];
}

const DARK_QUERY = "(prefers-color-scheme: dark)";
const subscribeScheme = (cb: () => void) => {
  const mq = window.matchMedia(DARK_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** Resolved light/dark theme. The server and the hydration pass use dark, like the prototype. */
export function useResolvedTheme(): "light" | "dark" {
  const choice = useSettings((s) => s.theme);
  const systemDark = useSyncExternalStore(
    subscribeScheme,
    () => window.matchMedia(DARK_QUERY).matches,
    () => true,
  );
  return choice === "auto" ? (systemDark ? "dark" : "light") : choice;
}
