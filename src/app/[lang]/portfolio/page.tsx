import type { Metadata } from "next";
import { DICTIONARIES, LANGS, type Lang } from "@/i18n";
import { PortfolioView } from "@/features/portfolio/PortfolioView";
import { languageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/portfolio">): Promise<Metadata> {
  const { lang } = await params;
  if (!(LANGS as readonly string[]).includes(lang)) return {};
  const t = DICTIONARIES[lang as Lang];
  return {
    title: t.meta_title_portfolio,
    description: t.meta_desc_portfolio,
    ...languageAlternates(lang as Lang, "/portfolio"),
    openGraph: { title: t.meta_title_portfolio, description: t.meta_desc_portfolio },
  };
}

export default function PortfolioPage() {
  return <PortfolioView />;
}
