import { expect, test, type Browser, type Page } from "@playwright/test";

/**
 * Phase 6: the layout must hold at every size the owner cares about. Each test opens its own browser
 * context with the viewport/touch settings under test, so it only runs once (desktop project).
 */
test.beforeEach(({}, info) => {
  test.skip(info.project.name !== "desktop", "creates its own contexts per viewport");
});

const SIZES = [
  { n: "laptop 1280x720", w: 1280, h: 720, touch: false },
  { n: "tablet landscape 1024x768", w: 1024, h: 768, touch: true },
  { n: "tablet portrait 768x1024", w: 768, h: 1024, touch: true },
  { n: "phone 390x844", w: 390, h: 844, touch: true },
  { n: "small phone 360x640", w: 360, h: 640, touch: true },
  { n: "tiny phone 320x568 (≈400% zoom)", w: 320, h: 568, touch: true },
  { n: "phone landscape 844x390", w: 844, h: 390, touch: true },
] as const;
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
];

async function open(
  browser: Browser,
  w: number,
  h: number,
  touch: boolean,
  path = "/es",
): Promise<Page> {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    hasTouch: touch,
    isMobile: touch && w < 900,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.addInitScript(() => localStorage.setItem("ihos:tour-done", "1"));
  await page.goto(path);
  // the Welcome window opens right after hydration; wait for it so measurements never race the app
  if (path === "/es") await expect(page.locator('[data-win="home"]')).toBeVisible();
  return page;
}

/** Layout problems visible right now (empty array = layout is sound). */
async function layoutProblems(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const out: string[] = [];
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (document.documentElement.scrollWidth > vw)
      out.push(`page scrolls sideways (${document.documentElement.scrollWidth} > ${vw})`);

    const bar = document.querySelector<HTMLElement>(".topbar");
    if (bar) {
      if (bar.scrollWidth > bar.clientWidth + 1)
        out.push(`menu bar overflows (${bar.scrollWidth} > ${bar.clientWidth})`);
      bar
        .querySelectorAll<HTMLElement>(".logo, .tb-role, .pv-btn, .tb-clock, .seg")
        .forEach((el) => {
          if (getComputedStyle(el).display === "none") return;
          if (el.getBoundingClientRect().height > 36)
            out.push(`menu bar item wraps: ${el.className}`);
        });
    }
    const dock = document.querySelector<HTMLElement>(".dock");
    const dockTop = dock ? dock.getBoundingClientRect().top : vh;
    if (dock) {
      const b = dock.getBoundingClientRect();
      if (b.left < -1 || b.right > vw + 1)
        out.push(`dock outside the screen (${Math.round(b.left)}..${Math.round(b.right)})`);
    }
    document.querySelectorAll<HTMLElement>("[data-win]").forEach((win) => {
      const id = win.dataset.win;
      const b = win.getBoundingClientRect();
      if (b.left < -1 || b.right > vw + 1) out.push(`window ${id} outside horizontally`);
      if (b.top < 39 || b.bottom > dockTop + 1)
        out.push(
          `window ${id} overlaps the menu bar or the Dock (${Math.round(b.top)}..${Math.round(b.bottom)}, dock ${Math.round(dockTop)})`,
        );
      const body = win.querySelector<HTMLElement>(".wbody");
      if (!body) return;
      const br = body.getBoundingClientRect();
      body.querySelectorAll<HTMLElement>("*").forEach((el) => {
        const r = el.getBoundingClientRect();
        // scrolling regions (terminal output, side bars) may extend beyond; everything else must fit
        if (
          r.width > 0 &&
          r.right > br.right + 2 &&
          !el.closest(".term-out, .side, .tgrid, .pf-links")
        ) {
          out.push(
            `  ${id}: ${el.tagName.toLowerCase()}.${String(el.className).slice(0, 24)} sticks out (${Math.round(r.right)} > ${Math.round(br.right)})`,
          );
        }
      });
    });
    return out;
  });
}

/**
 * WCAG 2.2 AA 2.5.8 (target size, minimum): a target under 24x24 CSS px is fine only if a 24px circle
 * centred on it touches no other target. Returns the offenders.
 */
async function undersizedTargets(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const els = [
      ...document.querySelectorAll<HTMLElement>(
        "button, a[href], input, textarea, select, [role=button]",
      ),
    ].filter((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (!(r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"))
        return false;
      if (el.closest("[aria-hidden=true]") || el.classList.contains("scrim")) return false; // click-away layer
      // controls hidden under another window are not targets the visitor can hit
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      // off-screen only counts as fine inside a deliberate scrolling strip (Dock, link row, side bar)
      if (top === null)
        return Boolean(el.closest(".dock, .pf-links, .side, .tgrid")) ? false : true;
      return top === el || el.contains(top);
    });
    const rects = els.map((el) => el.getBoundingClientRect());
    const center = (r: DOMRect) => [r.left + r.width / 2, r.top + r.height / 2];
    const bad: string[] = [];
    els.forEach((el, i) => {
      const r = rects[i];
      if (r.width >= 24 && r.height >= 24) return;
      const [cx, cy] = center(r);
      const crowded = rects.some((o, j) => {
        if (j === i || els[j].contains(el) || el.contains(els[j])) return false;
        // distance from this target's centre to the other target's box
        const dx = Math.max(o.left - cx, 0, cx - o.right);
        const dy = Math.max(o.top - cy, 0, cy - o.bottom);
        return Math.hypot(dx, dy) < 12;
      });
      if (crowded)
        bad.push(
          `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 20)} "${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 20)}" ${Math.round(r.width)}x${Math.round(r.height)}`,
        );
    });
    return bad;
  });
}

for (const s of SIZES) {
  test(`${s.n}: every app window fits and every target is big enough`, async ({ browser }) => {
    test.setTimeout(120_000);
    const page = await open(browser, s.w, s.h, s.touch);
    const problems: string[] = [];
    const small: string[] = [];
    const record = async (label: string) => {
      problems.push(...(await layoutProblems(page)).map((p) => `[${label}] ${p}`));
      small.push(...(await undersizedTargets(page)).map((p) => `[${label}] ${p}`));
    };
    await record("home");
    for (const id of APPS) {
      await page.locator(`[data-dock-app="${id}"]`).click(); // real click: also proves the Dock item is reachable
      await record(id);
    }
    await page.getByRole("button", { name: "Configuración" }).click();
    await record("settings");
    expect([...new Set(problems)]).toEqual([]);
    expect([...new Set(small)]).toEqual([]);
    await page.context().close();
  });

  test(`${s.n}: Portfolio View fits`, async ({ browser }) => {
    const page = await open(browser, s.w, s.h, s.touch, "/es/portfolio");
    const r = await page.evaluate(() => {
      const pf = document.querySelector<HTMLElement>(".pf")!;
      const nav = document.querySelector<HTMLElement>(".pf-nav")!;
      const sticky = getComputedStyle(nav).position === "sticky";
      const overflowing: string[] = [];
      pf.querySelectorAll("*").forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.width > 0 && b.right > pf.clientWidth + 1 && !el.closest(".pf-links"))
          overflowing.push(
            `${el.tagName.toLowerCase()}.${String((el as HTMLElement).className).slice(0, 24)}`,
          );
      });
      return {
        navHeight: nav.getBoundingClientRect().height,
        sticky,
        viewport: window.innerHeight,
        overflowing,
        overflowX: getComputedStyle(pf).overflowX,
        doc: document.documentElement.scrollWidth,
        vw: window.innerWidth,
      };
    });
    expect(r.overflowing).toEqual([]);
    expect(r.doc).toBeLessThanOrEqual(r.vw);
    // the sticky nav must not eat the screen (it was ~175px of 844 on a phone)
    if (r.sticky) expect(r.navHeight).toBeLessThanOrEqual(Math.max(96, r.viewport * 0.14));
    else expect(r.viewport).toBeLessThanOrEqual(500); // only short landscape screens let the nav scroll away
    expect(await undersizedTargets(page)).toEqual([]);
    await page.context().close();
  });
}

test("tablet (touch): windows drag with a finger and stay inside the screen", async ({
  browser,
}) => {
  const page = await open(browser, 1024, 768, true);
  const cdp = await page.context().newCDPSession(page);
  const win = page.locator('[data-win="home"]');
  const bar = win.locator(".titlebar");
  const before = (await win.boundingBox())!;
  const b = (await bar.boundingBox())!;
  const touch = async (type: "touchStart" | "touchMove" | "touchEnd", x: number, y: number) =>
    cdp.send("Input.dispatchTouchEvent", {
      type,
      touchPoints: type === "touchEnd" ? [] : [{ x, y }],
    });
  const x0 = b.x + b.width / 2;
  const y0 = b.y + 20;
  await touch("touchStart", x0, y0);
  for (let i = 1; i <= 6; i++) await touch("touchMove", x0 + 25 * i, y0 + 15 * i);
  await touch("touchEnd", x0 + 150, y0 + 90);
  await expect.poll(async () => Math.round((await win.boundingBox())!.x - before.x)).toBe(150);
  expect(Math.round((await win.boundingBox())!.y - before.y)).toBe(90);

  // flung far off-screen it is clamped, never lost
  const b2 = (await bar.boundingBox())!;
  const x1 = b2.x + 100;
  const y1 = b2.y + 20;
  await touch("touchStart", x1, y1);
  for (let i = 1; i <= 5; i++) await touch("touchMove", x1 + 400 * i, y1 + 400 * i);
  await touch("touchEnd", x1 + 2000, y1 + 2000);
  const far = (await win.boundingBox())!;
  expect(far.x + far.width).toBeLessThanOrEqual(1024);
  expect(far.y + far.height).toBeLessThanOrEqual(768 - 92 + 1);
  await page.context().close();
});

test("tablet (touch): tapping a Dock icon opens the window and leaves no stuck hover state", async ({
  browser,
}) => {
  const page = await open(browser, 1024, 768, true);
  expect(await page.evaluate(() => matchMedia("(hover: none)").matches)).toBe(true);
  await page.locator('[data-dock-app="projects"]').tap();
  await expect(page.locator('[data-win="projects"]')).toBeVisible();
  const item = page.locator('[data-dock-app="projects"]');
  const [tip, transform] = await Promise.all([
    item.locator(".dock-tip").evaluate((el) => getComputedStyle(el).opacity),
    item.evaluate((el) => getComputedStyle(el).transform),
  ]);
  expect(tip).toBe("0");
  expect(transform).toBe("none");
  await page.context().close();
});

test("touch screens get 34px window buttons (also on tablets); mouse screens keep 22px", async ({
  browser,
}) => {
  const touch = await open(browser, 1024, 768, true);
  const size = (p: Page) =>
    p.locator('[data-win="home"] .l-close').evaluate((el) => el.getBoundingClientRect().width);
  expect(await size(touch)).toBe(34);
  await touch.context().close();
  const mouse = await open(browser, 1280, 720, false);
  expect(await size(mouse)).toBe(22);
  await mouse.context().close();
});

test("rotating the device re-fits windows both ways", async ({ browser }) => {
  const page = await open(browser, 1024, 768, true);
  await page.locator('[data-dock-app="projects"]').tap();
  await page.locator('[data-dock-app="stack"]').tap();
  expect(await layoutProblems(page)).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 }); // to a phone in portrait
  await page.waitForTimeout(150);
  expect(await layoutProblems(page)).toEqual([]);
  await page.setViewportSize({ width: 844, height: 390 }); // phone landscape (compact by height)
  await page.waitForTimeout(150);
  expect(await layoutProblems(page)).toEqual([]);
  await page.setViewportSize({ width: 1280, height: 720 }); // back to a laptop
  await page.waitForTimeout(150);
  expect(await layoutProblems(page)).toEqual([]);
  await page.context().close();
});

test("phone landscape: the window gets real room and the Dock drops its labels", async ({
  browser,
}) => {
  const page = await open(browser, 844, 390, true);
  const r = await page.evaluate(() => {
    const win = document.querySelector('[data-win="home"]')!.getBoundingClientRect();
    return {
      winHeight: win.height,
      tipDisplay: getComputedStyle(document.querySelector(".dock-tip")!).display,
      role: getComputedStyle(document.querySelector(".tb-role")!).display,
    };
  });
  expect(r.winHeight).toBeGreaterThanOrEqual(270); // was ~190 before
  expect(r.tipDisplay).toBe("none");
  expect(r.role).toBe("none");
  // windows cannot be dragged in compact mode
  const before = (await page.locator('[data-win="home"]').boundingBox())!;
  const bar = (await page.locator('[data-win="home"] .titlebar').boundingBox())!;
  await page.mouse.move(bar.x + 300, bar.y + 20);
  await page.mouse.down();
  await page.mouse.move(bar.x + 400, bar.y + 60, { steps: 4 });
  await page.mouse.up();
  expect(await page.locator('[data-win="home"]').boundingBox()).toEqual(before);
  await page.context().close();
});

test("phone: the guided tour card stays on screen on every step", async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto("/es");
  const tour = page.locator('[role="dialog"].tour');
  await expect(tour).toBeVisible();
  await tour.getByRole("button", { name: "Comenzar tutorial" }).click();
  for (let i = 0; i < 6; i++) {
    const card = tour.locator(".tour-card");
    await expect(card).toBeVisible();
    await page.waitForTimeout(450); // let the card settle after the spotlight moves
    const b = (await card.boundingBox())!;
    expect(b.x, `step ${i + 1}`).toBeGreaterThanOrEqual(0);
    expect(b.x + b.width, `step ${i + 1}`).toBeLessThanOrEqual(390);
    expect(b.y, `step ${i + 1}`).toBeGreaterThanOrEqual(0);
    expect(b.y + b.height, `step ${i + 1}`).toBeLessThanOrEqual(844);
    await card.getByRole("button", { name: "Siguiente" }).tap();
  }
  await expect(tour.getByRole("heading", { name: "¡Listo!" })).toBeVisible();
  await ctx.close();
});

test("the page asks for notch-safe layout and keyboard-aware resizing", async ({ page }) => {
  await page.goto("/es");
  const content = await page.locator('meta[name="viewport"]').getAttribute("content");
  expect(content).toContain("viewport-fit=cover");
  expect(content).toContain("interactive-widget=resizes-content");
  expect(content).toContain("width=device-width");
});

test("phone: the title bar keeps its room (the coarse-pointer button size must not widen the spacer)", async ({
  browser,
}) => {
  const page = await open(browser, 360, 640, true);
  await expect(page.locator('[data-win="home"]')).toBeVisible();
  const m = await page.evaluate(() => ({
    pad: document.querySelector<HTMLElement>('[data-win="home"] .tb-pad')!.getBoundingClientRect()
      .width,
    title: document.querySelector<HTMLElement>('[data-win="home"] .wtitle')!.getBoundingClientRect()
      .width,
    light: document
      .querySelector<HTMLElement>('[data-win="home"] .l-close')!
      .getBoundingClientRect().width,
  }));
  expect(m.pad).toBe(0);
  expect(m.light).toBe(34);
  expect(m.title).toBeGreaterThanOrEqual(200);
  await page.context().close();
  const tablet = await open(browser, 1024, 768, true);
  await expect(tablet.locator('[data-win="home"]')).toBeVisible();
  expect(
    await tablet.evaluate(
      () =>
        document.querySelector<HTMLElement>('[data-win="home"] .tb-pad')!.getBoundingClientRect()
          .width,
    ),
  ).toBe(110); // tablets keep the title centred between wider buttons
  await tablet.context().close();
});

test("phone: 'maximize' changes nothing because the window is already full-screen", async ({
  browser,
}) => {
  for (const [w, h] of [
    [390, 844],
    [844, 390],
  ]) {
    const page = await open(browser, w, h, true);
    const win = page.locator('[data-win="home"]');
    const before = await win.boundingBox();
    await win.getByRole("button", { name: "Maximizar" }).tap();
    await expect(win).toHaveClass(/max/);
    expect(await win.boundingBox(), `${w}x${h}`).toEqual(before);
    await page.context().close();
  }
});

test("phone: a Portfolio View section link scrolled into view keeps its focus ring unclipped", async ({
  browser,
}) => {
  const page = await open(browser, 390, 844, true, "/es/portfolio");
  const last = page.locator(".pf-links a").last();
  await last.focus();
  const m = await page.evaluate(() => {
    const strip = document.querySelector<HTMLElement>(".pf-links")!.getBoundingClientRect();
    const a = document.activeElement!.getBoundingClientRect();
    return {
      top: a.top - strip.top,
      bottom: strip.bottom - a.bottom,
      right: a.right,
      vw: window.innerWidth,
    };
  });
  expect(m.right).toBeLessThanOrEqual(m.vw); // it scrolled into view
  expect(m.top).toBeGreaterThanOrEqual(3); // room for the 3px outline above and below
  expect(m.bottom).toBeGreaterThanOrEqual(3);
  await page.context().close();
});

test("a window dragged on a big screen is still reachable after a compact screen and back", async ({
  browser,
}) => {
  const page = await open(browser, 1440, 900, false);
  const bar = (await page.locator('[data-win="home"] .titlebar').boundingBox())!;
  await page.mouse.move(bar.x + 200, bar.y + 20);
  await page.mouse.down();
  await page.mouse.move(bar.x + 600, bar.y + 200, { steps: 5 }); // drag far to the lower right
  await page.mouse.up();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(150);
  expect(await layoutProblems(page)).toEqual([]);
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForTimeout(150);
  expect(await layoutProblems(page)).toEqual([]);
  const b = (await page.locator('[data-win="home"]').boundingBox())!;
  expect(b.x).toBeGreaterThanOrEqual(0);
  expect(b.x + b.width).toBeLessThanOrEqual(1024);
  expect(b.y + b.height).toBeLessThanOrEqual(768 - 92 + 1);
  await page.context().close();
});
