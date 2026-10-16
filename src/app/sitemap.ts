import type { MetadataRoute } from "next";
import { LANGS } from "@/i18n";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const PAGES = ["", "/portfolio"] as const;

/**
 * Sitemap with hreflang alternates. It needs absolute URLs, so it stays empty until the owner sets
 * NEXT_PUBLIC_SITE_URL (no invented domain).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  if (!base) return [];
  return LANGS.flatMap((lang) =>
    PAGES.map((page) => ({
      url: `${base}/${lang}${page}`,
      changeFrequency: "monthly" as const,
      priority: page === "" ? 1 : 0.8,
      alternates: {
        languages: {
          ...Object.fromEntries(LANGS.map((l) => [l, `${base}/${l}${page}`])),
          "x-default": `${base}/es${page}`,
        },
      },
    })),
  );
}
