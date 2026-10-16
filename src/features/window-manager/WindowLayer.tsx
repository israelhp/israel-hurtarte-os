"use client";

import { APP_IDS, type AppId } from "@/shared/app-ids";
import { AppContent } from "@/features/desktop/AppContent";
import { isVisible } from "./model";
import { Window } from "./Window";
import { useWm } from "./store";

function Host({ id }: { id: AppId }) {
  const visible = useWm((s) => isVisible(s.wins[id]));
  return visible ? (
    <Window id={id}>
      <AppContent id={id} />
    </Window>
  ) : null;
}

export function WindowLayer() {
  return (
    <>
      {APP_IDS.map((id) => (
        <Host key={id} id={id} />
      ))}
    </>
  );
}
