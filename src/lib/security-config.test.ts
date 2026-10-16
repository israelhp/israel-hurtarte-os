// @vitest-environment node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8")) as {
  headers: { source: string; headers: { key: string; value: string }[] }[];
};
const headers = Object.fromEntries(
  vercel.headers[0].headers.map((h) => [h.key.toLowerCase(), h.value]),
);

describe("vercel.json security headers", () => {
  it("applies to every path", () => {
    expect(vercel.headers[0].source).toBe("/(.*)");
  });

  it("sets the standard hardening headers", () => {
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["strict-transport-security"]).toMatch(/max-age=\d{7,}/);
    expect(headers["permissions-policy"]).toBe(
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
    );
    expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
    expect(headers["cross-origin-resource-policy"]).toBe("same-origin");
  });

  it("has a strict CSP: same-origin only, no eval, no wildcards, no remote origins, no framing", () => {
    const csp = headers["content-security-policy"];
    const d = Object.fromEntries(
      csp
        .split(";")
        .map((p) => p.trim().split(/\s+/))
        .map(([k, ...v]) => [k, v]),
    );
    expect(d["default-src"]).toEqual(["'self'"]);
    for (const dir of [
      "connect-src",
      "font-src",
      "manifest-src",
      "worker-src",
      "base-uri",
      "form-action",
    ])
      expect(d[dir], dir).toEqual(["'self'"]);
    for (const dir of ["object-src", "frame-src", "frame-ancestors"])
      expect(d[dir], dir).toEqual(["'none'"]);
    expect(d["img-src"]).toEqual(["'self'", "data:"]);
    expect(csp).not.toMatch(/unsafe-eval|\*|https?:|wasm-unsafe/);
    // inline scripts/styles are required today (Next bootstrap, the pre-paint theme script); documented as a risk
    expect(d["upgrade-insecure-requests"]).toEqual([]);
    expect(d["script-src"]).toEqual(["'self'", "'unsafe-inline'"]);
  });
});

describe("repository hygiene", () => {
  const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" })
    .split("\0")
    .filter(
      (f) =>
        f && !/\.(pdf|woff2?|png|jpe?g|ico|svg|lock)$|package-lock\.json$|design\/source\//.test(f),
    );

  it("contains no obvious secrets or private keys in tracked files", () => {
    const patterns: [string, RegExp][] = [
      ["private key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
      ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
      ["GitHub token", /\bgh[pousr]_[A-Za-z0-9]{30,}\b/],
      ["Slack token", /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/],
      [
        "generic secret assignment",
        /(?:api[_-]?key|secret|passwd|password|token)\s*[:=]\s*["'][A-Za-z0-9/+_-]{16,}["']/i,
      ],
    ];
    const hits: string[] = [];
    for (const file of tracked) {
      let text = "";
      try {
        text = readFileSync(join(root, file), "utf8");
      } catch {
        continue;
      }
      for (const [name, re] of patterns) if (re.test(text)) hits.push(`${file}: ${name}`);
    }
    expect(hits).toEqual([]);
  });

  it("does not track environment files other than the example", () => {
    const envs = execFileSync("git", ["ls-files", ".env*"], { cwd: root, encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);
    expect(envs.filter((f) => f !== ".env.example")).toEqual([]);
  });

  it("has only four runtime dependencies (small supply-chain surface)", () => {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    expect(Object.keys(pkg.dependencies).sort()).toEqual(["next", "react", "react-dom", "zustand"]);
  });
});
