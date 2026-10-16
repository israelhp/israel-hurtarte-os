import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { LANGS, DICTIONARIES, type Lang } from "@/i18n";
import { BOOT_SCRIPT } from "@/features/settings/boot-script";
import { LangProvider } from "@/features/settings/LangProvider";
import { SettingsSync } from "@/features/settings/SettingsSync";
import { TourHost } from "@/features/tour/TourHost";
import { languageAlternates } from "@/lib/seo";
import { fontVariables } from "../fonts";
import "../globals.css";

// Root layout for every localized page. All `/es/*` and `/en/*` pages are pre-rendered at build time.
export const dynamicParams = false;

// Notch-safe layout and a window that shrinks with the on-screen keyboard (Android Chrome), so the Terminal prompt
// and the contact form stay visible while typing.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

const isLang = (v: string): v is Lang => (LANGS as readonly string[]).includes(v);

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = DICTIONARIES[lang];
  return {
    title: t.meta_title,
    description: t.meta_desc,
    ...languageAlternates(lang, ""),
    openGraph: {
      title: t.meta_title,
      description: t.meta_desc,
      locale: lang === "es" ? "es_GT" : "en_US",
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    // data-theme/data-accent hold the defaults; the inline script below swaps in the stored ones before paint.
    <html
      lang={lang}
      data-theme="dark"
      data-accent="blue"
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>
        <LangProvider lang={lang}>
          <SettingsSync />
          {children}
          <TourHost />
        </LangProvider>
      </body>
    </html>
  );
}
