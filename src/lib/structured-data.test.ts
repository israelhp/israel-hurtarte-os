import { afterEach, describe, expect, it, vi } from "vitest";
import { findPhoneLike } from "./pii";
import { jsonLdString, personJsonLd } from "./structured-data";

afterEach(() => vi.unstubAllEnvs());

describe("Person JSON-LD", () => {
  it("is built from confirmed content only, per language", () => {
    const es = personJsonLd("es", "");
    const en = personJsonLd("en", "/portfolio");
    expect(es).toMatchObject({
      "@type": "Person",
      name: "Israel Hurtarte",
      jobTitle: "Desarrollador Full Stack",
      inLanguage: "es",
    });
    expect(en).toMatchObject({ jobTitle: "Full Stack Developer", inLanguage: "en" });
    expect(es.worksFor).toEqual({ "@type": "Organization", name: "Banco G&T Continental" });
    expect((es.alumniOf as { name: string }[]).map((o) => o.name)).toEqual([
      "Universidad Mariano Gálvez de Guatemala",
      "Colegio Verbo No. 4",
    ]);
    expect(es.sameAs).toEqual([
      "https://github.com/israelhp",
      "https://www.linkedin.com/in/israel-hurtarte-738245218/",
    ]);
  });

  it("has no url until a domain is configured, then uses the page URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(personJsonLd("es", "")).not.toHaveProperty("url");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.test");
    expect(personJsonLd("en", "/portfolio").url).toBe("https://example.test/en/portfolio");
  });

  it("never carries a phone number, e-mail address or the CV link", () => {
    const text = JSON.stringify([personJsonLd("es", ""), personJsonLd("en", "/portfolio")]);
    expect(findPhoneLike(text)).toEqual([]);
    expect(text).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+|mailto:|tel:|\.pdf/);
  });

  it("serialization cannot close the script tag", () => {
    expect(jsonLdString({ x: "</script><script>alert(1)</script>" })).not.toContain("<");
    expect(JSON.parse(jsonLdString({ x: "</script>" }))).toEqual({ x: "</script>" });
  });
});
