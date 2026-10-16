import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findPhoneLike, REFERENCE_WORDS } from "@/lib/pii";
import { safeHref, safeLocalPath } from "@/lib/safe-href";
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

  it("projects: demo ones carry no invented URLs, real ones have usable content, every URL is safe", () => {
    expect(projects.length).toBeGreaterThan(0);
    for (const p of projects) {
      expect(["demo", "verified"], p.id).toContain(p.status);
      if (p.status === "demo") {
        expect(p.demoUrl, `${p.id} demo`).toBe("");
        expect(p.repoUrl, `${p.id} demo`).toBe("");
      }
      for (const url of [p.demoUrl, p.repoUrl])
        if (url) expect(safeHref(url), `${p.id}: ${url}`).not.toBeNull();
      expect(p.name.trim() && p.desc.en.trim() && p.desc.es.trim(), p.id).toBeTruthy();
    }
  });

  it("certifications: placeholders have no link and keep their template text, real ones are fully filled in", () => {
    for (const c of certifications) {
      expect(["placeholder", "verified"], c.name).toContain(c.status);
      if (c.status === "placeholder") {
        expect(c.link).toBe("");
      } else {
        // a "verified" certification must not still contain template text
        expect(`${c.name} ${c.org} ${c.date ?? ""}`).not.toMatch(
          /Certification Name|Issuing Organization|\[Month YYYY\]/,
        );
        expect(c.name.trim() && c.org.trim()).toBeTruthy();
        if (c.date !== undefined) expect(c.date.trim(), `${c.name} date`).not.toBe(""); // omit instead of leaving blank
      }
      if (c.link) expect(safeHref(c.link), c.name).not.toBeNull();
    }
  });

  it("EDteam certifications: 15 distinct real courses, each linking to its own public certificate page", () => {
    const real = certifications.filter((c) => c.status === "verified");
    expect(real).toHaveLength(15);
    expect(new Set(real.map((c) => c.name)).size).toBe(15);
    expect(new Set(real.map((c) => c.link)).size).toBe(15);
    for (const c of real) {
      expect(c.org, c.name).toBe("EDteam");
      expect(c.link, c.name).toMatch(
        /^https:\/\/ed\.team\/u\/israelhurtartepinto\/curso\/[a-z0-9-]+$/,
      );
      expect(
        c.date,
        `${c.name}: the source shows no issue date, so none may be invented`,
      ).toBeUndefined();
    }
    // Docker is the only non-development course
    expect(real.filter((c) => c.cat !== "dev").map((c) => c.name)).toEqual(["Docker desde cero"]);
  });

  it("Zona de Ventas GT: the owner's real project, labelled as such and linking to its live site", () => {
    const z = projects.find((p) => p.id === "zona-de-ventas-gt")!;
    expect(z.status).toBe("verified");
    expect(z.demoUrl).toBe("https://www.zonadeventasgt.com/");
    expect(z.stack).toEqual(["React", "TypeScript", "Node.js", "Supabase", "PostgreSQL", "SQL"]);
    expect(z.features.es).toHaveLength(5);
    expect(z.challenges.en).toHaveLength(4);
    // the owner confirmed it is a professional project; "personal" and "featured" are not claimed
    expect(z.tags).toEqual(expect.arrayContaining(["professional", "web", "backend", "databases"]));
    expect(z.tags).not.toEqual(expect.arrayContaining(["personal"]));
    expect(z.tags).not.toEqual(expect.arrayContaining(["featured"]));
  });

  it("Learn English: the owner's personal frontend project, linking to its live demo", () => {
    const l = projects.find((p) => p.id === "learn-english")!;
    expect(l.status).toBe("verified");
    expect(l.demoUrl).toBe("https://learn-english-ivory.vercel.app/");
    expect(l.linkKind).toBe("demo"); // the owner calls the link a Demo
    expect(l.stack).toEqual(["React", "JavaScript", "Node.js", "HTML5", "CSS3", "Vercel"]);
    expect(l.features.es).toHaveLength(5);
    expect(l.challenges.es).toHaveLength(5);
    expect(l.tags).toEqual(["personal", "web"]); // personal, not professional or featured
  });

  it("VisionBitt: professional web project linking to its live site", () => {
    const v = projects.find((p) => p.id === "visionbitt")!;
    expect(v.status).toBe("verified");
    expect(v.tags).toContain("professional");
    expect(v.demoUrl).toBe("https://www.visionbitt.net/");
    expect(v.linkKind).toBeUndefined(); // verified => "Sitio web"
    expect(v.features.es).toHaveLength(7);
  });

  it("Quetxal TV: academic, unpublished, with its demo video under public/videos", () => {
    const q = projects.find((p) => p.id === "quetxal-tv")!;
    expect(q.status).toBe("verified");
    expect(q.demoUrl).toBe(""); // not published: no invented URL
    expect(q.tags).not.toContain("personal");
    expect(q.tags).not.toContain("professional");
    expect(q.video?.src).toBe("/videos/quetxal-tv.mp4");
    expect(q.stack).toHaveLength(21);
    expect(q.features.es).toHaveLength(10);
  });

  it("VetCare: verified personal web project", () => {
    const v = projects.find((p) => p.id === "vetcare")!;
    expect(v.status).toBe("verified");
    expect(v.tags).toEqual(["personal", "web"]);
    expect(v.demoUrl).toBe("https://pg-veterinaria.vercel.app/");
    expect(v.stack).toEqual(["JavaScript", "HTML5", "CSS3", "Vercel"]);
  });

  it("the prototype's five fictional demo projects are gone", () => {
    const gone = ["commerce", "fitness", "api", "dblab", "cicd"];
    expect(projects.map((p) => p.id).filter((id) => gone.includes(id))).toEqual([]);
    expect(projects.filter((p) => p.status === "demo")).toEqual([]);
  });

  it("project ids are unique and every project technology exists in the skills list", () => {
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length);
    const names = new Set(skills.map((s) => s.name));
    // Quetxal TV lists its own (academic) technologies, which the owner has not added to the Tech Stack window
    for (const p of projects.filter((p) => p.id !== "quetxal-tv"))
      for (const s of p.stack) expect(names.has(s), `${p.id}: ${s}`).toBe(true);
  });

  it("the skills list is the owner's technology list plus the technologies from the owner's CV", () => {
    // Source 1: owner's master prompt, section 6 "Tecnologías" (confirmed by the owner, 2026-10-15).
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
    // Source 2: owner's CV, "Habilidades" (Java - Spring Boot, C# - .NetCore, SQL), added in Phases 7-8.
    const cv = ["Java / Spring Boot", "C# / .NET Core", "SQL"];
    expect(skills.map((s) => s.name).sort()).toEqual([...owner, ...cv].sort());
  });

  it("matches the owner's CV: roles, dates, education and skills", () => {
    // CV: "Ingeniero de Desarrollo Junior … Marzo 2021 - Marzo 2024", "Middle … Marzo 2024 - Presente"
    const by = Object.fromEntries(experience.map((e) => [e.id, e]));
    expect(by.e2.role.es).toBe("Ingeniero de Desarrollo Junior");
    expect(by.e2.dates.es).toBe("Marzo 2021 – Marzo 2024");
    expect(by.e1.role.es).toBe("Ingeniero de Desarrollo Middle");
    expect(by.e1.dates.es).toBe("Marzo 2024 – Actualidad");
    expect(by.e1.company).toBe(by.e2.company);
    // CV education, in order
    expect(education.map((e) => [e.program.es, e.dates.es])).toEqual([
      ["Maestría en Seguridad Informática", "Enero 2025 – Presente"],
      ["Ingeniería en Sistemas", "Enero 2018 – Enero 2024"],
      [
        "Bachillerato en Ciencias y Letras con Orientación en Computación",
        "Enero 2015 – Enero 2018",
      ],
    ]);
    expect(education[1].progress.es).toBe("Cierre de pensum");
    // CV skills that are technologies or concepts must be visible somewhere on the site
    const names = skills.map((s) => s.name).join("|");
    for (const t of [
      "Node.js",
      "React",
      "Git",
      "C++",
      "MongoDB",
      "SQL Server",
      "Java / Spring Boot",
      "C# / .NET Core",
    ])
      expect(names, t).toContain(t);
    expect(profile.specialties.es).toEqual(
      expect.arrayContaining([
        "Diseño guiado por el dominio (DDD)",
        "Programación orientada a objetos (POO)",
        "Principios ágiles",
      ]),
    );
  });

  it("specialties exist in both languages with the same count", () => {
    expect(profile.specialties.es).toHaveLength(profile.specialties.en.length);
    expect(profile.specialties.en.length).toBe(13);
  });

  it("publishes no phone-like numbers and no reference headings (the CV has them; the site must not)", () => {
    const text = JSON.stringify(everything, null, 1); // keep line breaks so digits in different fields never join
    expect(
      findPhoneLike(text),
      "looks like a phone number; write year ranges with an en dash (2018 – 2024)",
    ).toEqual([]);
    expect(text).not.toMatch(REFERENCE_WORDS);
  });

  it("the CV link is either empty or points to a file that really exists", () => {
    if (!profile.cvUrl) return;
    if (/^https?:\/\//.test(profile.cvUrl)) return; // external URL: nothing to check locally
    const file = join(process.cwd(), "public", profile.cvUrl.replace(/^\//, ""));
    expect(existsSync(file), `${profile.cvUrl} must exist under public/`).toBe(true);
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
    expect(socialLinks.find((l) => l.id === "website")).toMatchObject({
      value: "israel-hurtarte-os.site",
      href: "https://israel-hurtarte-os.site",
    });
    // the CV is a same-site file or a safe https link (or empty when not configured)
    if (profile.cvUrl)
      expect(safeLocalPath(profile.cvUrl) ?? safeHref(profile.cvUrl)).not.toBeNull();
  });
});
