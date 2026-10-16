import { jsonLdString } from "@/lib/structured-data";

/** Inline structured data. Content comes from `src/content`, never from visitors. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />
  );
}
