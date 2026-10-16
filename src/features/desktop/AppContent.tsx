"use client";

import type { AppId } from "@/shared/app-ids";
import { Note } from "@/shared/components";
import { useT } from "@/features/settings/hooks";
import { appName } from "./apps";

/** Phase 3 placeholder. Each app's real content replaces this in Phase 4 (PORT-<APP>-001). */
export function AppContent({ id }: { id: AppId }) {
  const t = useT();
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 style={{ margin: 0, fontSize: 20 }}>{appName(t, id)}</h2>
      <Note>
        <strong>{t.placeholder_title}.</strong> {t.placeholder_body}
      </Note>
    </div>
  );
}
