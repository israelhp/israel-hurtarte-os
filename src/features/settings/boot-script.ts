/**
 * Runs synchronously in <head>, before the first paint, so the stored theme/accent are applied to <html>
 * without a flash (technique from the Next.js "preventing flash before hydration" guide).
 *
 * It is serialized with `toString()` and inlined, so it must stay self-contained, free of imports and
 * in sync with `persistence.ts` (a unit test checks both against the same inputs).
 */
export function bootSettings() {
  let theme = "auto";
  let accent = "blue";
  const accents = ["blue", "purple", "pink", "red", "orange", "yellow", "green", "graphite"];
  try {
    const s = JSON.parse(localStorage.getItem("ihos:settings:v1") || "{}");
    if (s && (s.theme === "light" || s.theme === "dark" || s.theme === "auto")) theme = s.theme;
    if (s && accents.indexOf(s.accent) > -1) accent = s.accent;
  } catch {
    /* storage unavailable: keep defaults */
  }
  let dark = true;
  try {
    dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    /* keep dark */
  }
  const root = document.documentElement;
  root.setAttribute("data-theme", theme === "auto" ? (dark ? "dark" : "light") : theme);
  root.setAttribute("data-accent", accent);
}

export const BOOT_SCRIPT = `(${bootSettings.toString()})()`;
