// Content-derived expectations for the e2e tests: counts and names come from `src/content`, so replacing the
// demo projects or placeholder certifications with real ones never requires editing the tests.
import { certifications } from "../../src/content/certifications";
import { education } from "../../src/content/education";
import { experience } from "../../src/content/experience";
import { profile } from "../../src/content/profile";
import type { ProjectFolder } from "../../src/content/types";
import { projects } from "../../src/content/projects";
import { categories, skills } from "../../src/content/skills";

export { certifications, projects, skills, categories, education, experience, profile };
export const demoProjects = projects.filter((p) => p.status === "demo");
export const projectsIn = (folder: ProjectFolder) =>
  projects.filter((p) => p.tags.includes(folder));
export const placeholderCerts = certifications.filter((c) => c.status === "placeholder");
export const certsIn = (cat: string) => certifications.filter((c) => c.cat === cat);
export const skillsIn = (cat: string) => skills.filter((s) => s.cat === cat);
/** First project that uses a technology, if any. */
export const projectUsing = (tech: string) => projects.find((p) => p.stack.includes(tech));
