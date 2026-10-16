import type { Lang } from "@/i18n";

export type Localized<T> = Record<Lang, T>;

/**
 * verified    real information confirmed by the owner
 * demo        fictional sample shown with a visible DEMO label until replaced
 * placeholder empty slot shown with a visible PLACEHOLDER label
 */
export type ContentStatus = "verified" | "demo" | "placeholder";

export type Profile = {
  status: ContentStatus;
  name: string;
  initials: string;
  role: Localized<string>;
  location: string;
  tagline: Localized<string>;
  bio: Localized<string>;
  specialties: string[];
  /** Empty string = not configured (the UI shows "Not configured"). */
  cvUrl: string;
};

export type SocialLink = {
  id: "email" | "github" | "linkedin" | "website";
  label: string;
  /** Display text. Empty string = not configured. */
  value: string;
  href: string;
};

export type CategoryId = "frontend" | "backend" | "mobile" | "databases" | "devops";
export type Category = { id: CategoryId; short: string; label: Localized<string> };
export type Skill = { name: string; mono: string; cat: CategoryId; desc: Localized<string> };

export type ProjectFolder =
  "featured" | "personal" | "professional" | "web" | "mobile" | "backend" | "databases" | "devops";
export type Project = {
  id: string;
  status: ContentStatus;
  cover: 1 | 2 | 3 | 4 | 5;
  name: string;
  tags: ProjectFolder[];
  primary: ProjectFolder;
  statusLabel: Localized<string>;
  desc: Localized<string>;
  objective: Localized<string>;
  features: Localized<string[]>;
  stack: string[];
  /** ASCII architecture sketch, shown in a monospaced block. */
  arch: string;
  challenges: Localized<string[]>;
  /** Empty string = no public URL. */
  demoUrl: string;
  repoUrl: string;
};

export type ExperienceEntry = {
  id: string;
  status: ContentStatus;
  type: "work" | "freelance";
  current?: boolean;
  company: string;
  role: Localized<string>;
  dates: Localized<string>;
  desc: Localized<string>;
  resp: Localized<string[]>;
  achLabel?: Localized<string>;
  ach: Localized<string[]>;
  techGroups: { label: Localized<string>; items: string[] }[];
};

export type EducationEntry = {
  status: ContentStatus;
  school: string;
  program: Localized<string>;
  degree: Localized<string>;
  dates: Localized<string>;
  progress: Localized<string>;
  desc?: Localized<string>;
};

export type CertCategory = {
  id: "all" | "cloud" | "dev" | "data" | "security";
  label: Localized<string>;
};
export type Certification = {
  status: ContentStatus;
  name: string;
  org: string;
  date: string;
  cat: Exclude<CertCategory["id"], "all">;
  /** Empty string = no credential link. */
  link: string;
};
