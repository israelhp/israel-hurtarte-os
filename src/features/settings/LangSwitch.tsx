"use client";

import { Segmented } from "@/shared/components";
import { LANGS } from "@/i18n";
import { useLang, useT } from "./hooks";
import { useSwitchLang } from "./useSwitchLang";

/** ES/EN segmented control; switching navigates to the same page under the other language prefix. */
export function LangSwitch({ className }: { className?: string }) {
  const t = useT();
  return (
    <Segmented
      className={className}
      label={t.language}
      value={useLang()}
      onChange={useSwitchLang()}
      options={LANGS.map((l) => ({ value: l, label: l.toUpperCase() }))}
    />
  );
}
