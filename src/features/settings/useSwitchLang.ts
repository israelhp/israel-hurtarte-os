"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import type { Lang } from "@/i18n";
import { emit } from "@/lib/events";
import { useLang } from "./LangProvider";
import { swapLangPath } from "./lang-path";
import { writeLang } from "./persistence";

/** Language whose switch button should receive focus after the page re-renders in the new language. */
let refocus: Lang | null = null;
export const takeLangRefocus = () => {
  const l = refocus;
  refocus = null;
  return l;
};

/** Switch language by navigating to the same page under the other prefix; windows and settings survive. */
export function useSwitchLang() {
  const router = useRouter();
  const pathname = usePathname();
  const current = useLang();
  return useCallback(
    (next: Lang) => {
      if (next === current) return;
      writeLang(next);
      refocus = next;
      emit("lang");
      router.replace(swapLangPath(pathname, next));
    },
    [current, pathname, router],
  );
}
