"use client";

import Link from "next/link";
import { AppTile } from "@/shared/components";
import { emit } from "@/lib/events";
import { useLang, useT } from "@/features/settings/hooks";
import { useWm } from "@/features/window-manager/store";
import { appName } from "./apps";

/** Desktop icons (hidden below 1100px by the prototype's responsive rules). */
export function Shortcuts() {
  const t = useT();
  const lang = useLang();
  const open = useWm((s) => s.open);
  return (
    <nav className="shortcuts" aria-label={t.desktop_shortcuts}>
      <button type="button" className="sc" onClick={() => open("projects")}>
        <AppTile app="projects" size="shortcut" />
        {appName(t, "projects")}
      </button>
      <button type="button" className="sc" onClick={() => open("about")}>
        <AppTile app="about" size="shortcut" icon="file" />
        README.md
      </button>
      <button type="button" className="sc" onClick={() => open("terminal")}>
        <AppTile app="terminal" size="shortcut" />
        {appName(t, "terminal")}
      </button>
      <Link href={`/${lang}/portfolio`} className="sc" onClick={() => emit("portfolio")}>
        <AppTile app="stack" size="shortcut" icon="layout" />
        {t.nav_portfolio}
      </Link>
    </nav>
  );
}
