import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = { title: `404 — ${SITE.name}` };

// Used for any URL that matches no route (static hosting serves it as 404.html). It bypasses the layouts.
export default function GlobalNotFound() {
  return (
    <html lang="es" className={fontVariables}>
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            padding: 16,
          }}
        >
          <div>
            <h1 style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 24 }}>404</h1>
            <p>Página no encontrada · Page not found</p>
            <p>
              <Link href="/es">Español</Link> · <Link href="/en">English</Link>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
