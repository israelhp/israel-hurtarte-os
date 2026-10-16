// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ACCENTS } from "./options";

const root = process.cwd();
const tokensCss = readFileSync(join(root, "src/shared/theme/tokens.css"), "utf8");

/** Unpack the prototype's template (plain JSON string inside a script tag) without executing it. */
function prototypeTemplate(): string {
  const file = join(
    root,
    "design/source/claude-design/DEV.OS — Interactive Portfolio – DEV.OS Desktop.html",
  );
  const html = readFileSync(file, "utf8");
  const m = /<script type="__bundler\/template">([\s\S]*?)<\/script>/.exec(html);
  if (!m) throw new Error("template script not found in prototype");
  return JSON.parse(m[1]) as string;
}

function vars(css: string, selector: string): Record<string, string> {
  const re = new RegExp(selector.replace(/\./g, "\\.") + "\\s*\\{");
  const m = re.exec(css);
  if (!m) throw new Error(`selector not found: ${selector}`);
  const from = m.index + m[0].length;
  const body = css.slice(from, css.indexOf("}", from));
  const out: Record<string, string> = {};
  for (const decl of body.split(/;(?![^(]*\))/)) {
    const i = decl.indexOf(":");
    if (i > 0 && decl.trim().startsWith("--"))
      out[decl.slice(0, i).trim()] = decl.slice(i + 1).trim();
  }
  return out;
}

/** Whitespace, hex case and decimal formatting (.5 vs 0.50) introduced by Prettier are not real differences. */
const compact = (s: string) =>
  s
    .toLowerCase()
    .replace(/(?<![\d])\.(\d)/g, "0.$1")
    .replace(/(\.\d*?)0+(?=\D|$)/g, "$1")
    .replace(/\s+/g, "");

describe("design tokens match the Claude Design prototype", () => {
  const proto = prototypeTemplate();

  for (const theme of ["dark", "light"] as const) {
    it(`.os.theme-${theme} defines exactly the prototype's custom properties`, () => {
      const sel = `.os.theme-${theme}`;
      const expected = vars(proto, sel);
      const actual = vars(tokensCss, sel);
      expect(Object.keys(expected).length).toBeGreaterThan(40);
      expect(Object.keys(actual).sort()).toEqual(Object.keys(expected).sort());
      for (const [k, v] of Object.entries(expected)) {
        expect(compact(actual[k]), k).toBe(compact(v));
      }
    });
  }

  it("dark and light themes expose the same variable names", () => {
    expect(Object.keys(vars(tokensCss, ".os.theme-dark")).sort()).toEqual(
      Object.keys(vars(tokensCss, ".os.theme-light")).sort(),
    );
  });

  it("defines every accent from the prototype", () => {
    for (const a of ACCENTS) {
      expect(compact(tokensCss), a).toContain(
        compact(`.os.acc-${a}{--acc:var(--${a === "graphite" ? "gray" : a})`),
      );
      expect(compact(proto), a).toContain(
        compact(`.os.acc-${a}{--acc:var(--${a === "graphite" ? "gray" : a})`),
      );
    }
  });
});
