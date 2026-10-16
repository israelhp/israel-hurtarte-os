import { expect, test, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

/**
 * DESIGN_FIDELITY_GATE: render the ORIGINAL Claude Design prototype and the app under identical conditions
 * (viewport, theme, language, no tour, no animation) and compare them pixel by pixel.
 *
 * Differences are expected and listed in docs/engineering/design-fidelity.md (darker primary-button fill and link
 * colors for WCAG AA, 2 extra skills and 3 extra specialties from the CV, the honest contact-form banner, extra
 * menu-bar controls). Each region has a tolerance calibrated from real measurements; anything beyond it fails and
 * writes a diff image to test-results/visual/.
 */
test.beforeEach(({}, info) => {
  test.skip(info.project.name !== "desktop", "creates its own contexts");
});

const PROTOTYPE = join(
  process.cwd(),
  "design/source/claude-design/DEV.OS — Interactive Portfolio – DEV.OS Desktop.html",
);
const OUT = join(process.cwd(), "test-results", "visual");

type Scheme = "dark" | "light";
const APPS = [
  "home",
  "about",
  "stack",
  "projects",
  "experience",
  "education",
  "certs",
  "terminal",
  "contact",
] as const;
/** Max share of differing pixels per window (see docs/engineering/design-fidelity.md for why each one differs). */
const WINDOW_TOLERANCE: Record<(typeof APPS)[number], number> = {
  home: 0.005, // primary button fill darkened 15% (a11y)
  about: 0.03, // +3 specialties and the enabled CV button
  stack: 0.02, // 31 skills instead of 29: counters and "technologies" label
  projects: 0.005,
  experience: 0.005,
  education: 0.01,
  certs: 0.6, // content intentionally replaced by the owner's 15 real certifications (layout matched 0.13% with the placeholders)
  terminal: 0.01,
  contact: 0.12, // honest mailto banner (longer text pushes the form down) and the enabled CV button
};

async function prepare(
  page: Page,
  kind: "prototype" | "app",
  scheme: Scheme,
  w: number,
  h: number,
) {
  await page.setViewportSize({ width: w, height: h });
  await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
  await page.addInitScript(() => {
    localStorage.setItem("devos-tour-done", "1"); // prototype key
    localStorage.setItem("ihos:tour-done", "1");
  });
  if (kind === "prototype") await page.goto("file://" + PROTOTYPE.replace(/ /g, "%20"));
  else await page.goto("/en");
  const win = page.locator(kind === "prototype" ? "section.win" : '[data-win="home"]');
  await expect(win.first()).toBeVisible({ timeout: 15_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
}

const dockItem = (page: Page, kind: "prototype" | "app", i: number) =>
  kind === "prototype" ? page.locator(".dock-item").nth(i) : page.locator("[data-dock-app]").nth(i);
const winOf = (page: Page, kind: "prototype" | "app", i: number) =>
  kind === "prototype"
    ? page.locator("section.win").nth(0)
    : page.locator(`[data-win="${APPS[i]}"]`);

const results: string[] = [];

/**
 * Compare two PNG buffers pixel by pixel and return the ratio of differing pixels. The two images must have the same
 * size: a window that grew or shrank is a regression, so a size mismatch is reported (and counted as a full diff).
 */
function diff(
  name: string,
  a: Buffer,
  b: Buffer,
): { ratio: number; w: number; h: number; sameSize: boolean } {
  const A = PNG.sync.read(a);
  const B = PNG.sync.read(b);
  const sameSize = A.width === B.width && A.height === B.height;
  const w = Math.min(A.width, B.width);
  const h = Math.min(A.height, B.height);
  const crop = (p: PNG) => {
    const out = new PNG({ width: w, height: h });
    PNG.bitblt(p, out, 0, 0, w, h, 0, 0);
    return out;
  };
  const a2 = crop(A);
  const b2 = crop(B);
  const d = new PNG({ width: w, height: h });
  const n = pixelmatch(a2.data, b2.data, d.data, w, h, { threshold: 0.12 });
  const ratio = sameSize ? n / (w * h) : 1;
  mkdirSync(OUT, { recursive: true });
  if (ratio > 0.001) writeFileSync(join(OUT, `${name}.diff.png`), PNG.sync.write(d));
  if (!sameSize)
    results.push(
      `  SIZE MISMATCH ${name}: prototype ${A.width}x${A.height} vs app ${B.width}x${B.height}`,
    );
  return { ratio, w, h, sameSize };
}

/** True only when the prototype really loaded a Geist web font (`document.fonts.check` is true when none is declared). */
const geistLoaded = (page: Page) =>
  page.evaluate(() =>
    [...document.fonts].some((f) => /^"?Geist"?$/.test(f.family) && f.status === "loaded"),
  );

test.afterAll(() => {
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, "report.txt"), results.join("\n") + "\n");
  console.log("\nVISUAL FIDELITY (share of differing pixels)\n" + results.join("\n"));
});

for (const scheme of ["dark", "light"] as const) {
  test.describe(`${scheme} 1440x900`, () => {
    test("wallpaper, menu bar (left part) and Dock match the prototype", async ({ browser }) => {
      const ctx1 = await browser.newContext();
      const ctx2 = await browser.newContext();
      const proto = await ctx1.newPage();
      const app = await ctx2.newPage();
      await prepare(proto, "prototype", scheme, 1440, 900);
      await prepare(app, "app", scheme, 1440, 900);
      // the guard: the prototype must really have loaded its web font, otherwise the comparison means nothing
      if (!(await geistLoaded(proto))) {
        await ctx1.close();
        await ctx2.close();
        test.skip(
          true,
          "the prototype could not load Geist (offline?): comparison would be meaningless",
        );
      }

      const shot = (p: Page, clip: { x: number; y: number; width: number; height: number }) =>
        p.screenshot({ clip });
      // wallpaper area with nothing on top (below-left of the Welcome window, above the Dock)
      const wall = { x: 0, y: 640, width: 440, height: 140 };
      const w = diff(`${scheme}-wallpaper`, await shot(proto, wall), await shot(app, wall));
      // menu bar: logo, role and nav links (the right side differs by design: Portfolio View and tour buttons, clock)
      const bar = { x: 0, y: 0, width: 760, height: 40 };
      const b = diff(`${scheme}-menubar`, await shot(proto, bar), await shot(app, bar));
      const dock = proto.locator(".dock");
      const dd = diff(
        `${scheme}-dock`,
        await dock.screenshot(),
        await app.locator(".dock").screenshot(),
      );
      results.push(
        `${scheme}  wallpaper ${(w.ratio * 100).toFixed(2)}%  menubar-left ${(b.ratio * 100).toFixed(2)}%  dock ${(dd.ratio * 100).toFixed(2)}%`,
      );
      expect(w.ratio, "wallpaper gradient").toBeLessThan(0.01);
      expect(b.ratio, "menu bar (left)").toBeLessThan(0.02);
      expect(dd.ratio, "Dock").toBeLessThan(0.02);
      await ctx1.close();
      await ctx2.close();
    });

    test("interactive states match: details, expanded entries, terminal output, settings and the tour card", async ({
      browser,
    }) => {
      test.setTimeout(240_000);
      type Step = {
        name: string;
        tol: number;
        noTour?: boolean;
        run: (p: Page, kind: "prototype" | "app") => Promise<void>;
        target: (p: Page, kind: "prototype" | "app") => ReturnType<Page["locator"]>;
      };
      const lastWin = (p: Page, kind: "prototype" | "app", id: string) =>
        kind === "prototype" ? p.locator("section.win").last() : p.locator(`[data-win="${id}"]`);
      const openApp = async (p: Page, kind: "prototype" | "app", i: number) => {
        await dockItem(p, kind, i).click();
        await p.waitForTimeout(350);
      };
      const STEPS: Step[] = [
        {
          name: "stack-selected",
          tol: 0.02,
          run: async (p, k) => {
            await openApp(p, k, 2);
            // DevOps holds exactly the same technologies in the prototype and the app (the app has extra skills elsewhere)
            await lastWin(p, k, "stack")
              .locator(".side-btn", { hasText: /DevOps/ })
              .click();
            await lastWin(p, k, "stack")
              .locator(".tcard", { has: p.locator(".tc-name", { hasText: /^Docker$/ }) })
              .click();
            await p.waitForTimeout(300);
          },
          target: (p, k) => lastWin(p, k, "stack"),
        },
        {
          name: "experience-second-open",
          tol: 0.01,
          run: async (p, k) => {
            await openApp(p, k, 4);
            await lastWin(p, k, "experience").locator(".tl-head").nth(1).click();
            await p.waitForTimeout(300);
          },
          target: (p, k) => lastWin(p, k, "experience"),
        },
        {
          name: "terminal-help",
          tol: 0.01,
          run: async (p, k) => {
            await openApp(p, k, 7);
            const input = lastWin(p, k, "terminal").locator("input");
            await input.fill("help");
            await input.press("Enter");
            await p.waitForTimeout(300);
          },
          target: (p, k) => lastWin(p, k, "terminal"),
        },
        {
          name: "settings-popover",
          tol: 0.01,
          run: async (p, k) => {
            await (
              k === "prototype"
                ? p.getByRole("button", { name: "Settings" })
                : p.getByRole("button", { name: "Settings" })
            ).click();
            await p.waitForTimeout(300);
          },
          target: (p) => p.locator(".pop"),
        },
        {
          name: "tour-card",
          tol: 0.01,
          noTour: true,
          run: async (p) => {
            await p.waitForTimeout(1600);
          },
          target: (p) => p.locator(".tour-card"),
        },
      ];
      const failures: string[] = [];
      for (const step of STEPS) {
        const ctx1 = await browser.newContext();
        const ctx2 = await browser.newContext();
        const proto = await ctx1.newPage();
        const app = await ctx2.newPage();
        for (const [page, kind] of [
          [proto, "prototype"],
          [app, "app"],
        ] as const) {
          await page.setViewportSize({ width: 1440, height: 900 });
          await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
          if (!step.noTour)
            await page.addInitScript(() => {
              localStorage.setItem("devos-tour-done", "1");
              localStorage.setItem("ihos:tour-done", "1");
            });
          await page.goto(
            kind === "prototype" ? "file://" + PROTOTYPE.replace(/ /g, "%20") : "/en",
          );
          await expect(
            (kind === "prototype"
              ? page.locator("section.win")
              : page.locator('[data-win="home"]')
            ).first(),
          ).toBeVisible({ timeout: 15_000 });
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(400);
          await step.run(page, kind);
        }
        const a = await step.target(proto, "prototype").screenshot();
        const b = await step.target(app, "app").screenshot();
        const r = diff(`${scheme}-state-${step.name}`, a, b);
        results.push(
          `${scheme}  state  ${step.name.padEnd(22)} ${(r.ratio * 100).toFixed(2)}%  (tolerance ${(step.tol * 100).toFixed(0)}%)  ${r.w}x${r.h}`,
        );
        if (r.ratio >= step.tol)
          failures.push(
            `${step.name}: ${(r.ratio * 100).toFixed(2)}% >= ${(step.tol * 100).toFixed(0)}%`,
          );
        await ctx1.close();
        await ctx2.close();
      }
      expect(
        failures,
        "states that drifted from the prototype (diff images in test-results/visual)",
      ).toEqual([]);
    });

    test("every app window matches the prototype's window", async ({ browser }) => {
      test.setTimeout(180_000);
      const ctx1 = await browser.newContext();
      const ctx2 = await browser.newContext();
      const proto = await ctx1.newPage();
      const app = await ctx2.newPage();
      await prepare(proto, "prototype", scheme, 1440, 900);
      await prepare(app, "app", scheme, 1440, 900);
      if (!(await geistLoaded(proto))) {
        await ctx1.close();
        await ctx2.close();
        test.skip(true, "prototype font not loaded");
      }
      const failures: string[] = [];
      for (let i = 0; i < APPS.length; i++) {
        const id = APPS[i];
        if (id !== "home") {
          // open the same window in both: it lands at the same cascade position
          await dockItem(proto, "prototype", i).click();
          await dockItem(app, "app", i).click();
        }
        // The prototype's fictional projects no longer exist (the owner's real ones replaced them): for Projects only the
        // window frame (title bar and sidebar header) is compared, see docs/engineering/design-fidelity.md.
        // Content that must be identical for the comparison to make sense: the prototype's Projects/Stack/etc.
        await proto.waitForTimeout(150);
        await app.waitForTimeout(250);
        const pw = proto.locator("section.win").last();
        const aw = winOf(app, "app", i);
        await expect(aw).toBeVisible();
        // Projects: only the title bar (Locator.screenshot has no clip, so use the window's box on the page)
        const grab = async (page: Page, win: ReturnType<Page["locator"]>) => {
          if (id !== "projects") return win.screenshot();
          const box = (await win.boundingBox())!;
          return page.screenshot({
            clip: { x: box.x, y: box.y, width: Math.min(box.width, 704), height: 48 },
          });
        };
        const r = diff(`${scheme}-${id}`, await grab(proto, pw), await grab(app, aw));
        results.push(
          `${scheme}  window ${id.padEnd(10)} ${(r.ratio * 100).toFixed(2)}%  (tolerance ${(WINDOW_TOLERANCE[id] * 100).toFixed(0)}%)  ${r.w}x${r.h}`,
        );
        if (r.ratio >= WINDOW_TOLERANCE[id])
          failures.push(
            `${id}: ${(r.ratio * 100).toFixed(2)}% >= ${(WINDOW_TOLERANCE[id] * 100).toFixed(0)}%`,
          );
      }
      expect(
        failures,
        "windows that drifted from the prototype (diff images in test-results/visual)",
      ).toEqual([]);
      await ctx1.close();
      await ctx2.close();
    });
  });
}

// ── other viewports ────────────────────────────────────────────────────────────────────────
const VIEWPORTS = [
  { n: "tablet 1024x768", w: 1024, h: 768, bar: 0.02, home: 0.01, dock: 0.01 },
  // <=760px: the app replaces the blur with solid surfaces on purpose (decision D6). The same rule is injected into
  // the prototype below, so everything ELSE is compared tightly.
  { n: "phone 390x844", w: 390, h: 844, bar: 0.02, home: 0.02, dock: 0.02 },
] as const;

for (const v of VIEWPORTS) {
  test(`${v.n} (dark): menu bar, Welcome window and Dock follow the prototype`, async ({
    browser,
  }) => {
    // No `isMobile`: the prototype has no <meta viewport>, so a mobile browser would lay it out at 980px wide.
    // A narrow desktop window exercises the same CSS breakpoints on both sides.
    const ctx1 = await browser.newContext();
    const ctx2 = await browser.newContext();
    const proto = await ctx1.newPage();
    const app = await ctx2.newPage();
    await prepare(proto, "prototype", "dark", v.w, v.h);
    await prepare(app, "app", "dark", v.w, v.h);
    if (v.w <= 760)
      // decision D6 applies to the prototype too, so everything else is compared tightly
      await proto.addStyleTag({
        content:
          ".topbar,.dock,.win,.pop{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;background:var(--sheet)!important}",
      });
    if (!(await geistLoaded(proto))) {
      await ctx1.close();
      await ctx2.close();
      test.skip(true, "prototype font not loaded");
    }
    const bar = diff(
      `${v.n}-bar`,
      await proto.locator(".topbar").screenshot(),
      await app.locator(".topbar").screenshot(),
    );
    const home = diff(
      `${v.n}-home`,
      await proto.locator("section.win").first().screenshot(),
      await app.locator('[data-win="home"]').screenshot(),
    );
    const dock = diff(
      `${v.n}-dock`,
      await proto.locator(".dock").screenshot(),
      await app.locator(".dock").screenshot(),
    );
    results.push(
      `dark  ${v.n}  menubar ${(bar.ratio * 100).toFixed(2)}%  home ${(home.ratio * 100).toFixed(2)}%  dock ${(dock.ratio * 100).toFixed(2)}%`,
    );
    for (const r of [bar, home, dock]) expect(r.sameSize, "same size as the prototype").toBe(true);
    expect(bar.ratio, "menu bar").toBeLessThan(v.bar);
    expect(home.ratio, "Welcome window").toBeLessThan(v.home);
    expect(dock.ratio, "Dock").toBeLessThan(v.dock);
    await ctx1.close();
    await ctx2.close();
  });
}
