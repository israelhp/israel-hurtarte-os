import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { findPhoneLike } from "../../src/lib/pii";
import { profile } from "./content";

/**
 * Phase 8 quality gates that need a real browser, run against the static export served with the exact headers of
 * vercel.json (see tools/serve-with-headers.mjs): performance guards, security, accessibility and SEO.
 */

const win = (p: Page, id: string) => p.locator(`[data-win="${id}"]`);
const dock = (p: Page, id: string) => p.locator(`[data-dock-app="${id}"]`);
const APPS = [
  "about",
  "stack",
  "projects",
  "experience",
  "education",
  "certs",
  "terminal",
  "contact",
];
const ROUTES = ["/es", "/en", "/es/portfolio", "/en/portfolio"];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("ihos:tour-done", "1"));
  await page.emulateMedia({ reducedMotion: "reduce" });
});

/** Open every app window so all content is in the DOM. */
async function openAll(page: Page) {
  await expect(win(page, "home")).toBeVisible();
  for (const id of APPS) await dock(page, id).click();
}

// ───────────────────────────── performance ─────────────────────────────
test.describe("performance guards", () => {
  for (const route of ROUTES) {
    test(`${route}: a largest contentful paint is reported and nothing shifts`, async ({
      page,
    }) => {
      await page.addInitScript(() => {
        const w = window as unknown as { __lcp: number[]; __cls: number };
        w.__lcp = [];
        w.__cls = 0;
        new PerformanceObserver((l) =>
          l.getEntries().forEach((e) => w.__lcp.push(e.startTime)),
        ).observe({
          type: "largest-contentful-paint",
          buffered: true,
        });
        new PerformanceObserver((l) =>
          l.getEntries().forEach((e) => {
            const s = e as PerformanceEntry & { value: number; hadRecentInput: boolean };
            if (!s.hadRecentInput) w.__cls += s.value;
          }),
        ).observe({ type: "layout-shift", buffered: true });
      });
      await page.goto(route);
      await page.waitForTimeout(1200);
      const m = await page.evaluate(() => {
        const w = window as unknown as { __lcp: number[]; __cls: number };
        return { lcp: w.__lcp[w.__lcp.length - 1], cls: w.__cls, count: w.__lcp.length };
      });
      // Regression guard: a page-level fade-in once made Chrome report NO LCP at all on the Portfolio View.
      expect(m.count, "an LCP entry must exist").toBeGreaterThan(0);
      expect(m.lcp, "LCP (unthrottled, local)").toBeLessThan(2500);
      expect(m.cls, "cumulative layout shift").toBeLessThan(0.1);
    });
  }

  test("dragging one window does not touch the DOM of any other window", async ({ page }, info) => {
    test.skip(info.project.name === "mobile", "windows are not draggable on compact screens");
    await page.goto("/es");
    await expect(win(page, "home")).toBeVisible();
    for (const id of ["about", "stack", "projects"]) await dock(page, id).click();
    // wait until the lazily loaded app contents are in place, so only the drag is measured
    await expect(win(page, "stack").locator(".tcard").first()).toBeVisible();
    await expect(win(page, "projects").locator(".pcard").first()).toBeVisible();
    await page.waitForTimeout(300);
    const observed = ["home", "about", "stack"];
    await page.evaluate((ids) => {
      const w = window as unknown as { __mut: Record<string, number> };
      w.__mut = {};
      for (const id of ids) {
        const el = document.querySelector(`[data-win="${id}"] .wbody`)!;
        new MutationObserver((r) => (w.__mut[id] = (w.__mut[id] ?? 0) + r.length)).observe(el, {
          subtree: true,
          childList: true,
          attributes: true,
          characterData: true,
        });
      }
    }, observed);
    // positive control: the observers must fire when something really changes
    await page.evaluate((ids) => {
      for (const id of ids)
        document
          .querySelector(`[data-win="${id}"] .wbody`)!
          .appendChild(document.createElement("i"));
    }, observed);
    const control = await page.evaluate(
      () => (window as unknown as { __mut: Record<string, number> }).__mut,
    );
    expect(Object.keys(control).sort(), "observer sanity check").toEqual([...observed].sort());
    await page.evaluate(
      () => ((window as unknown as { __mut: Record<string, number> }).__mut = {}),
    );

    const before = (await win(page, "projects").boundingBox())!;
    const bar = (await win(page, "projects").locator(".titlebar").boundingBox())!;
    await page.mouse.move(bar.x + 300, bar.y + 20);
    await page.mouse.down();
    for (let i = 1; i <= 20; i++) await page.mouse.move(bar.x + 300 - i * 6, bar.y + 20 - i); // up and to the left: away from the Dock clamp
    await page.mouse.up();
    const after = (await win(page, "projects").boundingBox())!;
    expect(Math.round(after.x - before.x), "the dragged window really moved").toBe(-120);
    expect(Math.round(after.y - before.y)).toBe(-20);
    const mut = await page.evaluate(
      () => (window as unknown as { __mut: Record<string, number> }).__mut,
    );
    expect(mut, "other windows' content must not re-render while a window is dragged").toEqual({});
  });
});

// ───────────────────────────── security ─────────────────────────────
test.describe("security", () => {
  test("security headers from vercel.json are served and the CSP is strict", async ({
    request,
  }) => {
    const res = await request.get("/es");
    const h = res.headers();
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["strict-transport-security"]).toContain("max-age=");
    expect(h["permissions-policy"]).toContain("camera=()");
    expect(h["permissions-policy"]).toContain("payment=()");
    expect(h["cross-origin-opener-policy"]).toBe("same-origin");
    const csp = h["content-security-policy"];
    for (const d of [
      "default-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "frame-src 'none'",
      "connect-src 'self'",
    ])
      expect(csp, d).toContain(d);
    expect(csp).not.toMatch(/unsafe-eval|\*|https?:/); // no wildcards, no remote origins, no eval
  });

  test("nothing in the app violates the CSP across every route, window, dialog and the tour", async ({
    page,
  }, info) => {
    const violations: string[] = [];
    await page.exposeFunction("__reportCsp", (v: string) => violations.push(v)); // survives full page loads
    await page.addInitScript(() => {
      document.addEventListener("securitypolicyviolation", (e) =>
        (window as unknown as { __reportCsp: (v: string) => void }).__reportCsp(
          `${e.violatedDirective} ← ${e.blockedURI}`,
        ),
      );
    });
    const consoleCsp: string[] = [];
    page.on(
      "console",
      (m) => /Content Security Policy|Refused to/i.test(m.text()) && consoleCsp.push(m.text()),
    );
    await page.goto("/es");
    await openAll(page);
    await win(page, "terminal").getByRole("textbox").fill("help");
    await win(page, "terminal").getByRole("textbox").press("Enter");
    await page.getByRole("button", { name: "Configuración" }).click();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "EN", exact: true }).click(); // client-side language navigation
    await expect(page).toHaveURL(/\/en$/);
    await page.getByRole("button", { name: "Guided tour" }).click();
    await expect(page.locator('[role="dialog"].tour')).toBeVisible();
    await page.keyboard.press("Escape");
    await page.getByRole("link", { name: "Portfolio View" }).first().click();
    await expect(page).toHaveURL(/\/en\/portfolio/);
    expect(violations, `${info.project.name} CSP violations`).toEqual([]);
    expect(consoleCsp).toEqual([]);
  });

  for (const route of ROUTES) {
    test(`${route}: zero third-party requests and every new-tab link is protected`, async ({
      page,
    }) => {
      const origin = new URL(page.url() === "about:blank" ? "http://localhost:3100" : page.url())
        .origin;
      const foreign: string[] = [];
      page.on("request", (r) => {
        const u = new URL(r.url());
        if (!["localhost", "127.0.0.1"].includes(u.hostname) && u.protocol.startsWith("http"))
          foreign.push(r.url());
      });
      await page.goto(route);
      if (!route.endsWith("portfolio")) await openAll(page);
      const bad = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')]
          .filter((a) => !/\bnoopener\b/.test(a.rel) || !/\bnoreferrer\b/.test(a.rel))
          .map((a) => a.href),
      );
      expect(foreign, `third-party requests (${origin})`).toEqual([]);
      expect(bad, "target=_blank links without rel=noopener noreferrer").toEqual([]);
    });
  }

  test("untrusted values never end up executed: stored preferences and the language path are whitelisted", async ({
    page,
  }) => {
    await page.addInitScript(() =>
      localStorage.setItem(
        "ihos:settings:v1",
        '{"theme":"dark\\"><img src=x onerror=alert(1)>","accent":"x\' onload=\'alert(1)"}',
      ),
    );
    await page.addInitScript(() =>
      localStorage.setItem("ihos:lang", '"><script>alert(1)</script>'),
    );
    const dialogs: string[] = [];
    page.on("dialog", (d) => (dialogs.push(d.message()), void d.dismiss()));
    await page.goto("/");
    await expect(page).toHaveURL(/\/es$/); // an invalid stored language falls back to Spanish
    await expect(page.locator("html")).toHaveAttribute("data-accent", "blue");
    expect(dialogs).toEqual([]);
  });
});

// ───────────────────────────── accessibility ─────────────────────────────
test.describe("accessibility", () => {
  test("keyboard: the skip link is the first stop, shows on focus and jumps into the content", async ({
    page,
  }) => {
    await page.goto("/es");
    await expect(win(page, "home")).toBeVisible();
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Saltar al contenido" });
    await expect(skip).toBeFocused();
    const box = (await skip.boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(0); // on screen while focused
    await page.keyboard.press("Enter");
    await expect(page.locator("#desktop")).toBeFocused();
  });

  test("keyboard: Portfolio View has a working skip link too", async ({ page }) => {
    await page.goto("/es/portfolio");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Saltar al contenido" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#portfolio-main")).toBeFocused();
  });

  test("keyboard: every control reached by Tab shows a visible focus indicator", async ({
    page,
  }) => {
    await page.goto("/es");
    await expect(win(page, "home")).toBeVisible();
    const missing: string[] = [];
    let visited = 0;
    const seen = new Set<string>();
    for (let i = 0; i < 150; i++) {
      await page.keyboard.press("Tab");
      const r = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const alpha = (cs.outlineColor.match(/rgba?\([^)]*?,\s*([\d.]+)\)$/)?.[1] ?? "1") as string;
        const visible =
          cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2 && parseFloat(alpha) > 0.3;
        const id = `${el.tagName.toLowerCase()}|${el.getAttribute("aria-label") || el.textContent?.trim().slice(0, 20)}|${Math.round(el.getBoundingClientRect().x)}`;
        return {
          visible,
          id,
          name: `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 24)} ${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 20)}`,
        };
      });
      if (!r) continue;
      if (seen.has(r.id)) break; // focus came back to a control already visited: the whole page was covered
      seen.add(r.id);
      visited++;
      if (!r.visible) missing.push(r.name);
    }
    expect(visited, "the tab sequence covered the page").toBeGreaterThan(15);
    expect(
      missing,
      "controls reached by Tab without a visible outline (>= 2px, not transparent)",
    ).toEqual([]);
  });

  test("keyboard: Dock items open windows with Enter and Space", async ({ page }) => {
    await page.goto("/es");
    await expect(win(page, "home")).toBeVisible();
    await dock(page, "about").focus();
    await page.keyboard.press("Enter");
    await expect(win(page, "about")).toBeVisible();
    await dock(page, "stack").focus();
    await page.keyboard.press("Space");
    await expect(win(page, "stack")).toBeVisible();
  });

  test("reduced motion: animations and transitions are switched off", async ({ page }) => {
    await page.goto("/es");
    await expect(win(page, "home")).toBeVisible();
    await dock(page, "projects").click();
    const m = await page.evaluate(() => {
      const w = getComputedStyle(document.querySelector('[data-win="projects"]')!);
      const d = getComputedStyle(document.querySelector('[data-dock-app="home"]')!);
      return { anim: w.animationName, trans: d.transitionDuration, wTrans: w.transitionDuration };
    });
    expect(m.anim).toBe("none");
    expect(m.trans.split(",").every((t) => parseFloat(t) === 0)).toBe(true);
  });

  test("structure: one h1, a unique title and the right lang on every page", async ({ page }) => {
    const titles = new Set<string>();
    for (const route of ROUTES) {
      await page.goto(route);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        route.startsWith("/en") ? "en" : "es",
      );
      titles.add(await page.title());
      await expect(page.locator("main")).toHaveCount(1);
    }
    expect(titles.size, "titles differ per language and page").toBe(4);
  });

  test("axe: Portfolio View in every accent and both themes", async ({ page }) => {
    test.setTimeout(180_000);
    const failures: string[] = [];
    await page.goto("/es/portfolio");
    for (const theme of ["dark", "light"] as const) {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      for (const accent of [
        "blue",
        "purple",
        "pink",
        "red",
        "orange",
        "yellow",
        "green",
        "graphite",
      ]) {
        await page.evaluate(
          ([t, a]) => {
            document.documentElement.setAttribute("data-theme", t);
            document.documentElement.setAttribute("data-accent", a);
          },
          [theme, accent],
        );
        const { violations } = await new AxeBuilder({ page }).analyze();
        for (const v of violations.filter((x) => x.impact === "serious" || x.impact === "critical"))
          failures.push(
            `${theme}/${accent}: ${v.id} ${v.nodes
              .map((n) => n.target.join(" "))
              .slice(0, 2)
              .join(" | ")}`,
          );
      }
    }
    expect(failures).toEqual([]);
  });
});

// ───────────────────────────── SEO ─────────────────────────────
test.describe("SEO", () => {
  for (const route of ["/es", "/en", "/es/portfolio", "/en/portfolio"]) {
    test(`${route}: valid Person JSON-LD built only from confirmed content`, async ({ page }) => {
      await page.goto(route);
      const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
      const data = JSON.parse(raw!);
      expect(data["@type"]).toBe("Person");
      expect(data.name).toBe(profile.name);
      expect(data.address.addressCountry).toBe("GT");
      expect(data.inLanguage).toBe(route.startsWith("/en") ? "en" : "es");
      expect(data.sameAs).toEqual(expect.arrayContaining(["https://github.com/israelhp"]));
      // privacy: no phone, no e-mail, no CV link in structured data
      expect(JSON.stringify(data)).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+|mailto:|tel:|\.pdf/);
      expect(findPhoneLike(JSON.stringify(data))).toEqual([]);
    });
  }

  test("head: favicon, theme colors, viewport and robots meta", async ({ page, request }) => {
    await page.goto("/es");
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", /icon\.svg/);
    await expect(page.locator('meta[name="theme-color"]')).toHaveCount(2);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0); // indexable: no noindex
    const icon = await request.get(
      (await page.locator('link[rel="icon"]').getAttribute("href")) as string,
    );
    expect(icon.status()).toBe(200);
    expect(icon.headers()["content-type"]).toContain("svg");
  });

  test("the redirect page and the internal catalog are not indexable", async ({ page }) => {
    for (const route of ["/design-system"]) {
      await page.goto(route);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    }
    // the redirect page is noindex too (it is only a doorway); read its HTML without following the redirect
    const html = await (await page.request.get("/")).text();
    expect(html).toMatch(/<meta name="robots" content="noindex/);
  });

  test("robots.txt and sitemap.xml are served and consistent with the (not yet configured) domain", async ({
    request,
  }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    const text = await robots.text();
    expect(text).toContain("Allow: /es");
    expect(text).toContain("Disallow: /design-system");
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(sitemap.headers()["content-type"]).toContain("xml");
    // no domain configured → no invented absolute URLs
    expect(await sitemap.text()).not.toMatch(/<loc>/);
    expect(text).not.toMatch(/Sitemap:/);
  });
});
