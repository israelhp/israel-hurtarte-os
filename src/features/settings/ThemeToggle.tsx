"use client";

import { Icon } from "@/shared/icons/Icon";
import { emit } from "@/lib/events";
import { useResolvedTheme, useT } from "./hooks";
import { useSettings } from "./store";

/** Sun/moon button that flips between light and dark. */
export function ThemeToggle() {
  const t = useT();
  const setTheme = useSettings((s) => s.setTheme);
  const dark = useResolvedTheme() === "dark";
  const label = dark ? t.to_light : t.to_dark;
  return (
    <button
      type="button"
      className="icon-btn"
      aria-label={label}
      title={label}
      onClick={() => {
        setTheme(dark ? "light" : "dark");
        emit("theme");
      }}
    >
      <Icon name={dark ? "sun" : "moon"} />
    </button>
  );
}
