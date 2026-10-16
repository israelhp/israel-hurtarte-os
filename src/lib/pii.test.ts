import { describe, expect, it } from "vitest";
import { REFERENCE_WORDS, findPhoneLike } from "./pii";

// All numbers below are made up.
describe("findPhoneLike", () => {
  it.each([
    "(502) 12345678",
    "+502 1234-5678",
    "1234 5678",
    "12345678",
    "55 12 34 56",
    "55.12.34.56",
    "+502 55 12 34 56",
    "+50255123456",
    "55-123-456",
    "5512 34 56",
    "(502) 5512-3456",
    "Call me: 5512 3456 any time",
    "tel:+50255123456",
    "https://wa.me/50255123456",
    "Escríbeme por WhatsApp",
  ])("flags %s", (sample) => {
    expect(findPhoneLike(sample), sample).not.toEqual([]);
  });

  it.each([
    "Marzo 2021 – Marzo 2024",
    "Enero 2018 – Enero 2024",
    "March 2021 - March 2024",
    "31 tecnologías",
    "ISO 27001",
    "v1.0 · 12 fotos",
    "jue, 15 oct, 11:08 p. m.",
    "Next.js 16 y React 19",
    "© 2026 Israel Hurtarte",
    "Paso 1 / 6",
    "https://www.linkedin.com/in/someone-123456789/",
    "github.com/user · mailto:someone@example.com",
  ])("ignores %s", (sample) => {
    expect(findPhoneLike(sample), sample).toEqual([]);
  });

  it("flags a plain-hyphen year range on purpose (privacy first); the en-dash form is accepted", () => {
    expect(findPhoneLike("2018-2024")).not.toEqual([]);
    expect(findPhoneLike("2018 – 2024")).toEqual([]);
  });
});

describe("REFERENCE_WORDS", () => {
  it("matches reference headings in Spanish and English only", () => {
    for (const s of [
      "Referencias personales",
      "REFERENCIAS LABORALES",
      "Work references",
      "personal references",
    ])
      expect(s).toMatch(REFERENCE_WORDS);
    for (const s of ["Experiencia", "reference to a project", "Proyectos de referencia"])
      expect(s).not.toMatch(REFERENCE_WORDS);
  });
});
