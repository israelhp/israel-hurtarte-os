"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { subscribe } from "@/lib/events";
import { useLang } from "@/features/settings/hooks";
import { readTourDone } from "@/features/settings/persistence";
import { Tour } from "./Tour";
import { useTour } from "./store";

const AUTO_START_MS = 900;

/** Mounted once in the language layout so the tour survives moving between Desktop and Portfolio View. */
export function TourHost() {
  const lang = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const onDesktop = pathname === `/${lang}` || pathname === `/${lang}/`;

  // App events (opening windows, maximizing, language/theme changes…) can advance the current step.
  useEffect(() => subscribe((name) => useTour.getState().event(name)), []);

  // First visit: offer the tour on the desktop. Completing or skipping it stores a flag so it never returns.
  useEffect(() => {
    if (!onDesktop || readTourDone() || useTour.getState().on || useTour.getState().dismissed)
      return;
    const id = setTimeout(() => {
      const t = useTour.getState();
      if (!readTourDone() && !t.on && !t.dismissed) t.start();
    }, AUTO_START_MS);
    return () => clearTimeout(id);
  }, [onDesktop]);

  // When the tour ends on Portfolio View, return to the desktop (where the Welcome window is reopened).
  const onFinish = useCallback(() => {
    if (!onDesktop) router.push(`/${lang}`);
  }, [onDesktop, router, lang]);

  return <Tour onFinish={onFinish} />;
}
