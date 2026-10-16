"use client";

import { useEffect } from "react";
import { readSettings, writeSettings } from "./persistence";
import { useResolvedTheme } from "./hooks";
import { useSettings } from "./store";

/**
 * Keeps the settings store, <html data-theme/data-accent> and localStorage in sync.
 * The inline boot script already applied the stored values before paint; here we load them into
 * React state (after hydration, so there is no mismatch) and mirror later changes.
 */
export function SettingsSync() {
  const theme = useSettings((s) => s.theme);
  const accent = useSettings((s) => s.accent);
  const hydrated = useSettings((s) => s.hydrated);
  const resolved = useResolvedTheme();

  useEffect(() => {
    useSettings.setState({ ...readSettings(), hydrated: true });
  }, []);

  useEffect(() => {
    if (!hydrated) return; // never overwrite what the boot script applied with the defaults
    const root = document.documentElement;
    root.setAttribute("data-theme", resolved);
    root.setAttribute("data-accent", accent);
  }, [hydrated, resolved, accent]);

  useEffect(() => {
    if (hydrated) writeSettings({ theme, accent });
  }, [hydrated, theme, accent]);

  return null;
}
