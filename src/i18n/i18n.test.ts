import { describe, expect, it } from "vitest";
import { DEFAULT_LANG, DICTIONARIES, LANGS } from ".";

describe("i18n dictionaries", () => {
  it("defaults to Spanish", () => {
    expect(DEFAULT_LANG).toBe("es");
  });

  it("has identical key sets in every language", () => {
    const keys = (l: (typeof LANGS)[number]) => Object.keys(DICTIONARIES[l]).sort();
    expect(keys("en")).toEqual(keys("es"));
  });

  it("has no empty strings", () => {
    for (const lang of LANGS)
      for (const [k, v] of Object.entries(DICTIONARIES[lang]))
        expect(v.trim(), `${lang}.${k}`).not.toBe("");
  });

  it("never rebrands the product as DEV.OS", () => {
    for (const lang of LANGS)
      for (const v of Object.values(DICTIONARIES[lang])) expect(v).not.toMatch(/DEV\.OS/);
  });
});
