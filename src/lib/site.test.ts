import { describe, expect, it } from "vitest";
import { SITE } from "./site";

describe("SITE identity", () => {
  it("uses the official product name, never the legacy prototype name", () => {
    expect(SITE.name).toBe("ISRAEL HURTARTE.OS");
    expect(SITE.name).not.toContain("DEV.OS");
  });

  it("defaults to Spanish", () => {
    expect(SITE.defaultLang).toBe("es");
  });
});
