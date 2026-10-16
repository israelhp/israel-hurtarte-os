"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/shared/icons/Icon";
import { AccentPicker, Segmented } from "@/shared/components";
import { ACCENTS, type Accent } from "@/shared/theme/options";
import { LANGS } from "@/i18n";
import { useLang, useT } from "@/features/settings/hooks";
import { useSwitchLang } from "@/features/settings/useSwitchLang";
import { THEME_CHOICES } from "@/features/settings/persistence";
import { useSettings } from "@/features/settings/store";
import { useTour } from "@/features/tour/store";
import { useWm } from "@/features/window-manager/store";

export function SettingsPopover() {
  const t = useT();
  const { theme, accent, settingsOpen, setTheme, setAccent, setSettingsOpen } = useSettings();
  const lang = useLang();
  const setLang = useSwitchLang();
  const ref = useRef<HTMLDivElement>(null);

  const close = () => {
    setSettingsOpen(false);
    document.getElementById("settings-trigger")?.focus();
  };

  useEffect(() => {
    if (!settingsOpen) return;
    ref.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsOpen]);

  if (!settingsOpen) return null;

  const accentLabels = Object.fromEntries(
    ACCENTS.map((a) => [a, t[`acc_${a}` as const]]),
  ) as Record<Accent, string>;

  return (
    <>
      <button type="button" className="scrim" tabIndex={-1} aria-label={t.close} onClick={close} />
      <div ref={ref} className="pop" role="dialog" aria-label={t.settings}>
        <h3>{t.settings}</h3>
        <div className="pop-row">
          {t.appearance}
          <Segmented
            label={t.appearance}
            value={theme}
            onChange={setTheme}
            options={THEME_CHOICES.map((c) => ({ value: c, label: t[`th_${c}` as const] }))}
          />
        </div>
        <div className="pop-col">
          {t.accent}
          <AccentPicker
            label={t.accent}
            value={accent}
            onChange={setAccent}
            labels={accentLabels}
          />
        </div>
        <div className="pop-row">
          {t.language}
          <Segmented
            label={t.language}
            value={lang}
            onChange={setLang}
            options={LANGS.map((l) => ({ value: l, label: l.toUpperCase() }))}
          />
        </div>
        <button
          type="button"
          className="pop-btn"
          onClick={() => {
            close();
            useTour.getState().start();
          }}
        >
          <Icon name="help" />
          {t.tour_btn}
        </button>
        <button
          type="button"
          className="pop-btn"
          onClick={() => {
            const { reset, open } = useWm.getState();
            reset();
            open("home");
            close();
          }}
        >
          <Icon name="reset" />
          {t.reset}
        </button>
      </div>
    </>
  );
}
