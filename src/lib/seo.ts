import type { Metadata } from "next";
import { LANGS, type Lang } from "@/i18n";

/** Absolute site URL, only when the owner configured one (no invented domain). */
export const siteUrl = (): string | null => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return raw ? raw.replace(/\/+$/, "") : null;
};

/**
 * Canonical + hreflang alternates for a page that exists in every language. They need absolute URLs,
 * so they are only emitted once NEXT_PUBLIC_SITE_URL is set (SEO phase finalizes this).
 */
export function languageAlternates(lang: Lang, path: string): Pick<Metadata, "alternates"> {
  const base = siteUrl();
  if (!base) return {};
  const languages = Object.fromEntries(LANGS.map((l) => [l, `${base}/${l}${path}`]));
  return {
    alternates: {
      canonical: `${base}/${lang}${path}`,
      languages: { ...languages, "x-default": `${base}/es${path}` },
    },
  };
}
