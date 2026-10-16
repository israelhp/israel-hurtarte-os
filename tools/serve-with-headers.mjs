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
  ".mp4": "video/mp4",
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
    const headers = {
      ...extra,
      "Content-Type": TYPES[extname(target)] ?? "application/octet-stream",
      "Accept-Ranges": "bytes",
    };
    // byte ranges, as Vercel serves them: browsers need them to seek inside a video
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? "");
    if (file && range && (range[1] || range[2])) {
      const start = range[1] ? Number(range[1]) : Math.max(body.length - Number(range[2]), 0);
      const end =
        range[1] && range[2] ? Math.min(Number(range[2]), body.length - 1) : body.length - 1;
      if (start > end || start >= body.length) {
        res.writeHead(416, { ...headers, "Content-Range": `bytes */${body.length}` }).end();
        return;
      }
      res.writeHead(206, {
        ...headers,
        "Content-Range": `bytes ${start}-${end}/${body.length}`,
        "Content-Length": end - start + 1,
      });
      res.end(req.method === "HEAD" ? undefined : body.subarray(start, end + 1));
      return;
    }
    res.writeHead(status, { ...headers, "Content-Length": body.length });
    res.end(req.method === "HEAD" ? undefined : body);
  } catch {
    res.writeHead(500).end("server error");
  }
}).listen(port, () =>
  console.log(`serving out/ with vercel.json headers on http://localhost:${port}`),
);
