import { Desktop } from "@/features/desktop/Desktop";
import { JsonLd } from "@/features/seo/JsonLd";
import { personJsonLd } from "@/lib/structured-data";
import type { Lang } from "@/i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  return (
    <>
      <JsonLd data={personJsonLd(lang as Lang, "")} />
      <Desktop />
    </>
  );
}
