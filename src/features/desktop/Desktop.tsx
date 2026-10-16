"use client";

import { useEffect } from "react";
import { SITE } from "@/lib/site";
import { Dock } from "@/features/dock/Dock";
import { trackInteraction } from "@/features/window-manager/interaction";
import { useWm } from "@/features/window-manager/store";
import { WindowLayer } from "@/features/window-manager/WindowLayer";
import { MenuBar } from "./MenuBar";
import { SkipLink } from "./SkipLink";
import { SettingsPopover } from "./SettingsPopover";
import { Shortcuts } from "./Shortcuts";

export function Desktop() {
  useEffect(() => {
    const untrack = trackInteraction();
    const { open, syncViewport } = useWm.getState();
    useWm.getState().syncViewport();
    // The Welcome window opens on load, like the prototype (it does not take focus until the visitor interacts).
    const anyOpen = Object.values(useWm.getState().wins).some((w) => w.open);
    if (!anyOpen) open("home");
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
    <div className="os">
      <SkipLink target="desktop" />
      <main className="desk" id="desktop" tabIndex={-1}>
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
