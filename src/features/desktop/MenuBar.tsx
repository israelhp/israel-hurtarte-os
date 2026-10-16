"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Icon } from "@/shared/icons/Icon";
import { emit } from "@/lib/events";
import { SITE } from "@/lib/site";
import { profile } from "@/content/profile";
import { useLang, useT } from "@/features/settings/hooks";
import { LangSwitch } from "@/features/settings/LangSwitch";
import { ThemeToggle } from "@/features/settings/ThemeToggle";
import { takeLangRefocus } from "@/features/settings/useSwitchLang";
import { useSettings } from "@/features/settings/store";
import { useTour } from "@/features/tour/store";
import { useWm } from "@/features/window-manager/store";
import { appName } from "./apps";
import { useClock } from "./useClock";

const NAV = ["projects", "stack", "terminal", "contact"] as const;

export function MenuBar() {
  const t = useT();
  const lang = useLang();
  const settingsOpen = useSettings((s) => s.settingsOpen);
  const setSettingsOpen = useSettings((s) => s.setSettingsOpen);
  const open = useWm((s) => s.open);
  const clock = useClock(lang);

  // After a language switch the page re-renders under the new route: give focus back to the language control.
  useEffect(() => {
    if (takeLangRefocus())
      document.querySelector<HTMLElement>('.topbar .seg button[aria-pressed="true"]')?.focus();
  }, []);

  return (
    <header className="topbar">
      <button type="button" className="logo" onClick={() => open("home")}>
        <span className="logo-dot" />
        <span className="logo-full">{SITE.name}</span>
        <span className="logo-short">IH.OS</span>
        <span className="sr-only"> — {appName(t, "home")}</span>
      </button>
      <span className="tb-sep" />
      <span className="tb-role">{profile.role[lang]}</span>
      <nav className="tb-nav" aria-label={t.main_nav}>
        {NAV.map((id) => (
          <button key={id} type="button" className="tb-link" onClick={() => open(id)}>
            {appName(t, id)}
          </button>
        ))}
      </nav>
      <span className="tb-spacer" />
      <span className="tb-clock" suppressHydrationWarning>
        {clock}
      </span>
      <Link
        href={`/${lang}/portfolio`}
        className="pv-btn"
        aria-label={t.nav_portfolio}
        data-tour="pv"
        onClick={() => emit("portfolio")}
      >
        <Icon name="layout" />
        <span>{t.nav_portfolio}</span>
      </Link>
      <div data-tour="prefs" style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <LangSwitch />
        <ThemeToggle />
        <button
          type="button"
          id="settings-trigger"
          className="icon-btn"
          aria-label={t.settings}
          aria-haspopup="dialog"
          aria-expanded={settingsOpen}
          onClick={() => setSettingsOpen(!settingsOpen)}
        >
          <Icon name="sliders" />
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label={t.tour_btn}
          title={t.tour_btn}
          onClick={() => useTour.getState().start()}
        >
          <Icon name="help" />
        </button>
      </div>
    </header>
  );
}
