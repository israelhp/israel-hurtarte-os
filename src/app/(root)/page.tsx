import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

// Static export cannot send HTTP redirects, so `/` redirects on the client (stored language, else Spanish)
// and falls back to plain links without JavaScript.
export const metadata: Metadata = {
  title: SITE.name,
  robots: { index: false, follow: true },
};

const REDIRECT = `(function(){var l="es";try{var s=localStorage.getItem("ihos:lang");if(s==="en"||s==="es")l=s}catch(e){}location.replace("/"+l)})()`;

export default function RootRedirect() {
  return (
    <main
      style={{ minHeight: "100vh", display: "grid", placeItems: "center", textAlign: "center" }}
    >
      <script dangerouslySetInnerHTML={{ __html: REDIRECT }} />
      <div>
        <h1 style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 24 }}>
          {SITE.name}
        </h1>
        <p>
          <Link href="/es">Español</Link> · <Link href="/en">English</Link>
        </p>
      </div>
    </main>
  );
}
