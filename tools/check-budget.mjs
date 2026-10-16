#!/usr/bin/env node
// Bundle budget: gzip size of everything the browser must download to show a page (JS, CSS, fonts), read from the
// static export in out/. Run after `npm run build`. Exits 1 when a budget is exceeded.
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const OUT = "out";
// Current measurements (2026-10-16): see docs/engineering/performance.md. Budgets leave ~15% headroom.
const BUDGET_KB = { js: 220, css: 16, fonts: 60 };
const PAGES = ["es.html", "en.html", join("es", "portfolio.html"), join("en", "portfolio.html")];

const kb = (n) => Math.round((n / 1024) * 10) / 10;
let failed = false;
for (const page of PAGES) {
  const html = readFileSync(join(OUT, page), "utf8");
  const assets = new Set(
    [...html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)].map((m) => m[1]),
  );
  const total = { js: 0, css: 0, fonts: 0 };
  for (const url of assets) {
    const file = join(OUT, url.split("?")[0]);
    let buf;
    try {
      buf = readFileSync(file);
    } catch {
      continue; // prefetch hints for files that are not part of the export tree
    }
    const size = /\.woff2$/.test(url) ? buf.length : gzipSync(buf).length; // woff2 is already compressed
    if (url.endsWith(".js")) total.js += size;
    else if (url.endsWith(".css")) total.css += size;
    else if (url.endsWith(".woff2")) total.fonts += size;
  }
  const line = Object.entries(total)
    .map(([k, v]) => `${k} ${kb(v)}KB/${BUDGET_KB[k]}KB`)
    .join("  ");
  const over = Object.entries(total)
    .filter(([k, v]) => kb(v) > BUDGET_KB[k])
    .map(([k]) => k);
  console.log(`${over.length ? "FAIL" : "ok  "} ${page.padEnd(22)} ${line}`);
  if (over.length) failed = true;
}
process.exit(failed ? 1 : 0);
