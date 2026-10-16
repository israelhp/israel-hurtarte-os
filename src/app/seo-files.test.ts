import { afterEach, describe, expect, it, vi } from "vitest";
import robots from "./robots";
import sitemap from "./sitemap";

afterEach(() => vi.unstubAllEnvs());

describe("sitemap.xml", () => {
  it("stays empty until a domain is configured (no invented URLs)", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(sitemap()).toEqual([]);
  });

  it("lists every language × page with hreflang alternates once a domain is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.test/");
    const entries = sitemap();
    expect(entries.map((e) => e.url).sort()).toEqual([
      "https://example.test/en",
      "https://example.test/en/portfolio",
      "https://example.test/es",
      "https://example.test/es/portfolio",
    ]);
    for (const e of entries) {
      expect(Object.keys(e.alternates!.languages!).sort()).toEqual(["en", "es", "x-default"]);
      expect(e.alternates!.languages!["x-default"]).toBe(e.url.replace(/\/(en|es)/, "/es"));
      expect(e.url.endsWith("//")).toBe(false);
    }
  });
});

describe("robots.txt", () => {
  it("allows the language trees and hides the internal catalog", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    const r = robots();
    expect(r.rules).toMatchObject({ allow: ["/es", "/en"], disallow: ["/design-system"] });
    expect(r.sitemap).toBeUndefined();
  });

  it("points to the sitemap once a domain is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.test");
    expect(robots().sitemap).toBe("https://example.test/sitemap.xml");
  });
});
