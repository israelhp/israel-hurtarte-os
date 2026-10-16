"use client";

import { Icon } from "@/shared/icons/Icon";
import { Segmented } from "@/shared/components";
import { LANGS } from "@/i18n";
import { SITE } from "@/lib/site";
import { useResolvedTheme, useT } from "@/features/settings/hooks";
import { useSettings } from "@/features/settings/store";
import { useWm } from "@/features/window-manager/store";
import { appName } from "./apps";
import { useClock } from "./useClock";

const NAV = ["projects", "stack", "terminal", "contact"] as const;
const ROLE: Record<string, string> = { es: "Desarrollador Full Stack", en: SITE.role };

export function MenuBar() {
  const t = useT();
  const lang = useSettings((s) => s.lang);
  const setLang = useSettings((s) => s.setLang);
  const setTheme = useSettings((s) => s.setTheme);
  const settingsOpen = useSettings((s) => s.settingsOpen);
  const setSettingsOpen = useSettings((s) => s.setSettingsOpen);
  const open = useWm((s) => s.open);
  const dark = useResolvedTheme() === "dark";
  const clock = useClock(lang);

  return (
    <header className="topbar">
      <button type="button" className="logo" onClick={() => open("home")}>
        <span className="logo-dot" />
        <span className="logo-full">{SITE.name}</span>
        <span className="logo-short">IH.OS</span>
        <span className="sr-only"> — {appName(t, "home")}</span>
      </button>
      <span className="tb-sep" />
      <span className="tb-role">{ROLE[lang]}</span>
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
      <Segmented
        label={t.language}
        value={lang}
        onChange={setLang}
        options={LANGS.map((l) => ({ value: l, label: l.toUpperCase() }))}
      />
      <button
        type="button"
        className="icon-btn"
        aria-label={dark ? t.to_light : t.to_dark}
        title={dark ? t.to_light : t.to_dark}
        onClick={() => setTheme(dark ? "light" : "dark")}
      >
        <Icon name={dark ? "sun" : "moon"} />
      </button>
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
    </header>
  );
}
