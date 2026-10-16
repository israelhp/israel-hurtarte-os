"use client";

import { AppTile } from "@/shared/components";
import { useT } from "@/features/settings/hooks";
import { useWm } from "@/features/window-manager/store";
import { appName } from "./apps";

/** Desktop icons (hidden below 1100px by the prototype's responsive rules). */
export function Shortcuts() {
  const t = useT();
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
    </nav>
  );
}
