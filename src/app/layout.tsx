import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.person}, ${SITE.role}`,
  description: `Portafolio interactivo de ${SITE.person}, ${SITE.role} en ${SITE.location}.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE.defaultLang} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
