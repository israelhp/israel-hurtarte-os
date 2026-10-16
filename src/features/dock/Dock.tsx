"use client";

import { Fragment } from "react";
import { APP_IDS, type AppId } from "@/shared/app-ids";
import { AppTile } from "@/shared/components";
import { cn } from "@/lib/cn";
import { useT } from "@/features/settings/hooks";
import { DOCK_SEPARATOR_BEFORE, appName } from "@/features/desktop/apps";
import { useWm } from "@/features/window-manager/store";

function DockItem({ id }: { id: AppId }) {
  const t = useT();
  const w = useWm((s) => s.wins[id]);
  const active = useWm((s) => s.active === id);
  const open = useWm((s) => s.open);
  return (
    <button
      type="button"
      data-dock-app={id}
      data-tour={id === "terminal" ? "dock-terminal" : undefined}
      className={cn("dock-item", w.open && "running", w.open && w.min && "minimized")}
      aria-current={active ? "true" : undefined}
      onClick={() => open(id)}
    >
      <AppTile app={id} size="dock" />
      <span className="dock-tip">{appName(t, id)}</span>
      <span className="dock-dot" />
      {w.open && <span className="sr-only">{w.min ? t.state_minimized : t.state_open}</span>}
    </button>
  );
}

export function Dock() {
  const t = useT();
  return (
    <nav className="dock" aria-label={t.dock}>
      {APP_IDS.map((id) => (
        <Fragment key={id}>
          {id === DOCK_SEPARATOR_BEFORE && <span className="dock-sep" aria-hidden="true" />}
          <DockItem id={id} />
        </Fragment>
      ))}
    </nav>
  );
}
