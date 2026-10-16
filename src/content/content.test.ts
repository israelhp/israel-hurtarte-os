import { describe, expect, it } from "vitest";
import { safeHref } from "@/lib/safe-href";
import { certifications } from "./certifications";
import { education } from "./education";
import { experience } from "./experience";
import { profile } from "./profile";
import { projects } from "./projects";
import { categories, skills } from "./skills";
import { socialLinks } from "./social-links";

const everything = {
  profile,
  socialLinks,
  skills,
  projects,
  experience,
  education,
  certifications,
};

/** Collect every {es, en} pair so we can assert both languages exist and are non-empty. */
function localizedPairs(
  node: unknown,
  path: string,
  out: [string, Record<string, unknown>][] = [],
) {
  if (Array.isArray(node)) node.forEach((n, i) => localizedPairs(n, `${path}[${i}]`, out));
  else if (node && typeof node === "object") {
    const o = node as Record<string, unknown>;
    if ("es" in o && "en" in o && Object.keys(o).length === 2) out.push([path, o]);
    else for (const [k, v] of Object.entries(o)) localizedPairs(v, `${path}.${k}`, out);
  }
  return out;
}

describe("content integrity", () => {
  it("every localized value has both Spanish and English", () => {
    const pairs = localizedPairs(everything, "content");
    expect(pairs.length).toBeGreaterThan(50);
    for (const [path, v] of pairs) {
      for (const lang of ["es", "en"]) {
        const val = v[lang];
        const empty = Array.isArray(val)
          ? val.length === 0 || val.some((x) => !String(x).trim())
          : !String(val).trim();
        expect(empty, `${path}.${lang}`).toBe(false);
      }
    }
  });

  it("never brands anything as DEV.OS", () => {
    expect(JSON.stringify(everything)).not.toMatch(/DEV\.OS/);
  });

  it("keeps the owner-approved career facts", () => {
    const byId = Object.fromEntries(experience.map((e) => [e.id, e]));
    expect(byId.e1).toMatchObject({
      company: "Banco G&T Continental",
      current: true,
      status: "verified",
    });
    expect(byId.e1.role.en).toBe("Mid-Level Development Engineer");
    expect(byId.e1.dates.en).toBe("March 2024 – Present");
    expect(byId.e2.role.en).toBe("Junior Development Engineer");
    expect(byId.e2.dates.en).toBe("March 2021 – March 2024");
    expect(byId.e3).toMatchObject({ company: "VisionBitt", type: "freelance", current: true });
    expect(byId.e3.dates.en).toBe("January 2025 – Present");
  });

  it("lists the three education entries as verified", () => {
    expect(education.map((e) => e.school)).toEqual([
      "Universidad Mariano Gálvez de Guatemala",
      "Universidad Mariano Gálvez de Guatemala",
      "Colegio Verbo No. 4",
    ]);
    expect(education.every((e) => e.status === "verified")).toBe(true);
  });

  it("flags sample projects as demo and certifications as placeholder, with no invented URLs", () => {
    expect(projects.length).toBe(5);
    for (const p of projects) {
      expect(p.status, p.id).toBe("demo");
      expect(p.demoUrl, p.id).toBe("");
      expect(p.repoUrl, p.id).toBe("");
    }
    expect(certifications.length).toBeGreaterThan(0);
    for (const c of certifications) {
      expect(c.status).toBe("placeholder");
      expect(c.link).toBe("");
    }
  });

  it("project ids are unique and every project technology exists in the skills list", () => {
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length);
    const names = new Set(skills.map((s) => s.name));
    for (const p of projects)
      for (const s of p.stack) expect(names.has(s), `${p.id}: ${s}`).toBe(true);
  });

  it("the skills list is exactly the technology list the owner provided", () => {
    // Source: owner's master prompt, section 6 "Tecnologías" (confirmed by the owner, 2026-10-15).
    const owner = [
      "React",
      "React Native",
      "JavaScript",
      "TypeScript",
      "Node.js",
      "Express",
      "Next.js",
      "NestJS",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Redux",
      "Vite",
      "SQL Server",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Supabase",
      "Prisma",
      "Docker",
      "Git",
      "GitHub",
      "GitHub Actions",
      "REST APIs",
      "C++",
      "Expo",
      "Linux",
      "Vercel",
      "CI/CD",
    ];
    expect(skills.map((s) => s.name).sort()).toEqual([...owner].sort());
  });

  it("every skill belongs to a known category", () => {
    const ids = new Set(categories.map((c) => c.id));
    for (const s of skills) expect(ids.has(s.cat), s.name).toBe(true);
    expect(new Set(skills.map((s) => s.name)).size).toBe(skills.length);
  });

  it("configured contact links are safe and unconfigured ones are empty", () => {
    for (const l of socialLinks) {
      if (l.value || l.href) expect(safeHref(l.href), l.id).not.toBeNull();
      else expect(l.href).toBe("");
    }
    expect(socialLinks.find((l) => l.id === "email")?.href).toBe("mailto:israelhurtarte@gmail.com");
    expect(socialLinks.find((l) => l.id === "website")?.value).toBe("");
    expect(profile.cvUrl).toBe("");
  });
});
