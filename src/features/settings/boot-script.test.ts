import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ACCENTS } from "@/shared/theme/options";
import { BOOT_SCRIPT, bootSettings } from "./boot-script";
import { SETTINGS_KEY, readSettings } from "./persistence";

const root = () => document.documentElement;
const setSystemDark = (dark: boolean) =>
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (q: string) => ({ matches: q.includes("dark") ? dark : false }),
  });

beforeEach(() => {
  localStorage.clear();
  root().removeAttribute("data-theme");
  root().removeAttribute("data-accent");
  setSystemDark(true);
});
afterEach(() => localStorage.clear());

describe("boot script", () => {
  it("applies defaults (follows the system, blue) when nothing is stored", () => {
    bootSettings();
    expect(root().dataset.theme).toBe("dark");
    expect(root().dataset.accent).toBe("blue");
    setSystemDark(false);
    bootSettings();
    expect(root().dataset.theme).toBe("light");
  });

  it("applies stored theme and accent before React runs", () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ theme: "light", accent: "orange" }));
    bootSettings();
    expect([root().dataset.theme, root().dataset.accent]).toEqual(["light", "orange"]);
  });

  it("an explicit theme wins over the system preference, 'auto' follows it", () => {
    setSystemDark(false);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ theme: "dark" }));
    bootSettings();
    expect(root().dataset.theme).toBe("dark");
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ theme: "auto" }));
    bootSettings();
    expect(root().dataset.theme).toBe("light");
  });

  it("ignores invalid stored values", () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ theme: "x", accent: "<b>" }));
    bootSettings();
    expect([root().dataset.theme, root().dataset.accent]).toEqual(["dark", "blue"]);
    localStorage.setItem(SETTINGS_KEY, "{broken");
    expect(() => bootSettings()).not.toThrow();
  });

  it("the serialized inline script behaves exactly like the function", () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ theme: "light", accent: "pink" }));
    (0, eval)(BOOT_SCRIPT);
    expect([root().dataset.theme, root().dataset.accent]).toEqual(["light", "pink"]);
  });

  it("agrees with persistence.ts for every accent and theme", () => {
    for (const accent of ACCENTS)
      for (const theme of ["light", "dark"] as const) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({ theme, accent }));
        bootSettings();
        expect(readSettings()).toEqual({ theme, accent });
        expect([root().dataset.theme, root().dataset.accent]).toEqual([theme, accent]);
      }
  });

  it("does not depend on imports (it is inlined into the HTML)", () => {
    expect(BOOT_SCRIPT).not.toMatch(/\bimport\b|\brequire\b/);
    expect(BOOT_SCRIPT.startsWith("(")).toBe(true);
  });
});
