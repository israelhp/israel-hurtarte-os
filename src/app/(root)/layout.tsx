import { fontVariables } from "../fonts";
import "../globals.css";

// Root layout for the few pages outside `/[lang]`: the language redirect at `/` and the internal catalog.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
