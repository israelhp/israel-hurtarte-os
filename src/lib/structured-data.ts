import { education } from "@/content/education";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { skills } from "@/content/skills";
import { socialLinks } from "@/content/social-links";
import type { Lang } from "@/i18n";
import { safeHref } from "./safe-href";
import { siteUrl } from "./seo";

/**
 * schema.org `Person` JSON-LD built only from confirmed content: name, role, country, employer, schools,
 * skills and the public profile links. No phone, no e-mail, no invented URLs.
 */
export function personJsonLd(lang: Lang, path: string): Record<string, unknown> {
  const base = siteUrl();
  const current = experience.find((e) => e.current && e.type === "work");
  const sameAs = socialLinks
    .filter((l) => l.id === "github" || l.id === "linkedin" || l.id === "website")
    .map((l) => safeHref(l.href))
    .filter((h): h is string => Boolean(h));
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role[lang],
    description: profile.bio[lang],
    inLanguage: lang,
    address: { "@type": "PostalAddress", addressCountry: "GT" },
    ...(current ? { worksFor: { "@type": "Organization", name: current.company } } : {}),
    alumniOf: [...new Set(education.map((e) => e.school))].map((name) => ({
      "@type": "EducationalOrganization",
      name,
    })),
    knowsAbout: skills.map((s) => s.name),
    ...(sameAs.length ? { sameAs } : {}),
    ...(base ? { url: `${base}/${lang}${path}` } : {}),
  };
}

/** Serialize for an inline `<script type="application/ld+json">`; `<` is escaped so content can never close the tag. */
export const jsonLdString = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
