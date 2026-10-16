"use client";

import { useEffect } from "react";
import { SITE } from "@/lib/site";
import { Dock } from "@/features/dock/Dock";
import { useResolvedTheme } from "@/features/settings/hooks";
import { useSettings } from "@/features/settings/store";
import { trackInteraction } from "@/features/window-manager/interaction";
import { useWm } from "@/features/window-manager/store";
import { WindowLayer } from "@/features/window-manager/WindowLayer";
import { MenuBar } from "./MenuBar";
import { SettingsPopover } from "./SettingsPopover";
import { Shortcuts } from "./Shortcuts";

export function Desktop() {
  const theme = useResolvedTheme();
  const accent = useSettings((s) => s.accent);
  const lang = useSettings((s) => s.lang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const untrack = trackInteraction();
    const { open, syncViewport } = useWm.getState();
    useWm.getState().syncViewport();
    // The Welcome window opens on load, like the prototype (it does not take focus until the visitor interacts).
    if (!useWm.getState().wins.home.open) open("home");
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncViewport);
    };
    window.addEventListener("resize", onResize);
    return () => {
      untrack();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className={`os theme-${theme} acc-${accent}`}>
      <main className="desk">
        <h1 className="sr-only">{SITE.name}</h1>
        <div className="wall" />
        <div className="wall-mark" aria-hidden="true">
          {SITE.name}
        </div>
        <Shortcuts />
        <WindowLayer />
        <Dock />
      </main>
      <MenuBar />
      <SettingsPopover />
    </div>
  );
}
