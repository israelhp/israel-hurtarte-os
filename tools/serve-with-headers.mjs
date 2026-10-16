#!/usr/bin/env node
// Tiny static server for `out/` that sends the exact response headers declared in vercel.json (CSP, HSTS, …), so the
// e2e tests run under the same policy as production. No dependencies. Usage: node tools/serve-with-headers.mjs [port]
//
// Mimics what Vercel does for a static export: `/es` → `es.html`, `/` → `index.html`, unknown paths → `404.html`
// with status 404. Only used locally and in CI; never deployed.
import { createServer } from "node:http";
import { readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const port = Number(process.argv[2] ?? 3100);
const root = resolve("out");
const vercel = JSON.parse(readFileSync("vercel.json", "utf8"));
const extra = Object.fromEntries(
  (vercel.headers ?? []).flatMap((h) => h.headers.map((x) => [x.key, x.value])),
);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
};

const isFile = (p) => {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
};

function resolveFile(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  const base = join(root, clean);
  if (!base.startsWith(root)) return null; // never leave out/
  for (const candidate of [base, `${base}.html`, join(base, "index.html")])
    if (isFile(candidate)) return candidate;
  return null;
}

createServer((req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  const file = resolveFile(pathname);
  const target = file ?? join(root, "404.html");
  const status = file ? 200 : 404;
  try {
    const body = readFileSync(target);
    res.writeHead(status, {
      ...extra,
      "Content-Type": TYPES[extname(target)] ?? "application/octet-stream",
      "Content-Length": body.length,
    });
    res.end(req.method === "HEAD" ? undefined : body);
  } catch {
    res.writeHead(500).end("server error");
  }
}).listen(port, () =>
  console.log(`serving out/ with vercel.json headers on http://localhost:${port}`),
);
