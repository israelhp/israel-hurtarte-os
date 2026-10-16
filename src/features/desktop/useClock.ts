"use client";

import { useSyncExternalStore } from "react";
import type { Lang } from "@/i18n";

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 10_000);
  return () => clearInterval(id);
};

/** Menu-bar clock (weekday, day, month, time). Empty on the server to avoid hydration mismatches. */
export function useClock(lang: Lang): string {
  return useSyncExternalStore(
    subscribe,
    () =>
      new Intl.DateTimeFormat(lang === "es" ? "es-GT" : "en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
    () => "",
  );
}
