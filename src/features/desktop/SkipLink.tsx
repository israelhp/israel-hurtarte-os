"use client";

import { useT } from "@/features/settings/hooks";

/** First focusable element: lets keyboard users jump past the menu bar / navigation (WCAG 2.4.1). */
export function SkipLink({ target }: { target: string }) {
  const t = useT();
  return (
    <a className="skip-link" href={`#${target}`}>
      {t.skip_to_content}
    </a>
  );
}
