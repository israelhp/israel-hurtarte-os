import { afterEach, describe, expect, it, vi } from "vitest";
import { languageAlternates, siteUrl } from "./seo";

afterEach(() => vi.unstubAllEnvs());

describe("language alternates", () => {
  it("emits nothing until the owner configures a site URL (no invented domain)", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(siteUrl()).toBeNull();
    expect(languageAlternates("es", "")).toEqual({});
  });
  it("builds canonical and hreflang URLs from the configured site URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.test/");
    expect(languageAlternates("en", "/portfolio")).toEqual({
      alternates: {
        canonical: "https://example.test/en/portfolio",
        languages: {
          es: "https://example.test/es/portfolio",
          en: "https://example.test/en/portfolio",
          "x-default": "https://example.test/es/portfolio",
        },
      },
    });
  });
});
