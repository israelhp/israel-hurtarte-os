import { describe, expect, it } from "vitest";
import { LANGS } from ".";
import { TOUR_STEPS, TOUR_TEXT } from "./tour";

describe("tour copy", () => {
  it("has a title and body for every step in every language", () => {
    for (const lang of LANGS)
      for (const step of TOUR_STEPS) {
        const t = TOUR_TEXT[lang][step.id];
        expect(t.title.trim(), `${lang}.${step.id}.title`).not.toBe("");
        expect(t.body.trim(), `${lang}.${step.id}.body`).not.toBe("");
      }
  });

  it("steps that wait for an action have a hint in both languages", () => {
    for (const step of TOUR_STEPS.filter((s) => s.on))
      for (const lang of LANGS)
        expect(TOUR_TEXT[lang][step.id].hint?.trim(), `${lang}.${step.id}`).toBeTruthy();
  });

  it("uses the official product name and never DEV.OS", () => {
    for (const lang of LANGS) {
      expect(TOUR_TEXT[lang].intro.title).toContain("ISRAEL HURTARTE.OS");
      expect(JSON.stringify(TOUR_TEXT[lang])).not.toMatch(/DEV\.OS/);
    }
  });
});
