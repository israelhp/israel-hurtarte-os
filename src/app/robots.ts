import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

/** Allow the two language trees; keep the internal catalog and the redirect page out of search results. */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: { userAgent: "*", allow: ["/es", "/en"], disallow: ["/design-system"] },
    ...(base ? { sitemap: `${base}/sitemap.xml` } : {}),
  };
}
