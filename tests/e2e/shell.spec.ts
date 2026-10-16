import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const win = (p: Page, id: string) => p.locator(`[data-win="${id}"]`);
const dock = (p: Page, id: string) => p.locator(`[data-dock-app="${id}"]`);
const box = async (p: Page, id: string) => (await win(p, id).boundingBox())!;
const z = (p: Page, id: string) => win(p, id).evaluate((el) => Number(getComputedStyle(el).zIndex));

test.beforeEach(async ({ page }) => {
  // The guided tour auto-starts on a first visit; these tests are about the rest of the UI.
  await page.addInitScript(() => localStorage.setItem("ihos:tour-done", "1"));
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("loads in Spanish with the Welcome window and a 9-app Dock, without console errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/es");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByRole("heading", { level: 1, name: "ISRAEL HURTARTE.OS" })).toBeAttached();
  await expect(win(page, "home")).toBeVisible();
  await expect(page.locator("[data-dock-app]")).toHaveCount(9);
  await expect(page).toHaveTitle(/ISRAEL HURTARTE\.OS/);
  expect(errors).toEqual([]);
});

test("Dock opens a window, marks it running/current, and a second click only refocuses", async ({
  page,
}) => {
  await page.goto("/es");
  await dock(page, "projects").click();
  await expect(win(page, "projects")).toBeVisible();
  await expect(dock(page, "projects")).toHaveClass(/running/);
  await expect(dock(page, "projects")).toHaveAttribute("aria-current", "true");
  await expect(dock(page, "home")).not.toHaveAttribute("aria-current", "true");
  await dock(page, "projects").click();
  await expect(page.locator('[data-win="projects"]')).toHaveCount(1);
});

test("clicking a window brings it to the front", async ({ page }, info) => {
  test.skip(info.project.name === "mobile", "compact windows overlap completely");
  await page.goto("/es");
  await dock(page, "about").click();
  await dock(page, "stack").click();
  expect(await z(page, "stack")).toBeGreaterThan(await z(page, "about"));
  // "stack" is larger and cascaded, so only a thin strip of the "about" title bar stays uncovered
  await win(page, "about").click({ position: { x: 300, y: 3 } });
  expect(await z(page, "about")).toBeGreaterThan(await z(page, "stack"));
  await expect(win(page, "about")).toHaveClass(/active/);
  await expect(win(page, "stack")).not.toHaveClass(/active/);
});

test("minimize hides the window, Dock shows it minimized, Dock click restores it", async ({
  page,
}) => {
  await page.goto("/es");
  await win(page, "home").getByRole("button", { name: "Minimizar" }).click();
  await expect(win(page, "home")).toHaveCount(0);
  await expect(dock(page, "home")).toHaveClass(/minimized/);
  await expect(dock(page, "home")).toContainText("minimizada");
  await dock(page, "home").click();
  await expect(win(page, "home")).toBeVisible();
  await expect(dock(page, "home")).not.toHaveClass(/minimized/);
});

test("maximize fills the work area and restore returns to the previous size", async ({
  page,
}, info) => {
  test.skip(info.project.name === "mobile", "windows are already full-screen on compact screens");
  await page.goto("/es");
  const before = await box(page, "home");
  await win(page, "home").getByRole("button", { name: "Maximizar" }).click();
  await expect(win(page, "home")).toHaveClass(/max/);
  const max = await box(page, "home");
  expect(max.width).toBeGreaterThan(before.width);
  const vp = page.viewportSize()!;
  expect(max.y).toBeGreaterThanOrEqual(40);
  expect(max.y + max.height).toBeLessThanOrEqual(vp.height);
  await win(page, "home").getByRole("button", { name: "Restaurar" }).click();
  expect(await box(page, "home")).toEqual(before);
});

test("closing returns focus to the Dock icon", async ({ page }) => {
  await page.goto("/es");
  await dock(page, "about").click();
  await win(page, "about").getByRole("button", { name: "Cerrar" }).focus();
  await win(page, "about").getByRole("button", { name: "Cerrar" }).press("Enter");
  await expect(win(page, "about")).toHaveCount(0);
  await expect(dock(page, "about")).toBeFocused();
  await expect(dock(page, "about")).not.toHaveClass(/running/);
});

test("dragging moves a window and can never push it out of reach", async ({ page }, info) => {
  test.skip(info.project.name === "mobile", "windows are full-screen on compact screens");
  await page.goto("/es");
  const vp = page.viewportSize()!;
  const bar = win(page, "home").locator(".titlebar");
  const start = await box(page, "home");
  const b = (await bar.boundingBox())!;
  await page.mouse.move(b.x + b.width / 2, b.y + 20);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2 + 120, b.y + 20 + 60, { steps: 5 });
  await page.mouse.up();
  const moved = await box(page, "home");
  expect(Math.round(moved.x - start.x)).toBe(120);
  expect(Math.round(moved.y - start.y)).toBe(60);

  const b2 = (await bar.boundingBox())!;
  await page.mouse.move(b2.x + 100, b2.y + 20);
  await page.mouse.down();
  await page.mouse.move(vp.width + 500, vp.height + 500, { steps: 4 });
  await page.mouse.up();
  const far = await box(page, "home");
  expect(far.x + far.width).toBeLessThanOrEqual(vp.width);
  expect(far.y + far.height).toBeLessThanOrEqual(vp.height - 92 + 1);
  await page.mouse.move(far.x + 100, far.y + 20);
  await page.mouse.down();
  await page.mouse.move(-500, -500, { steps: 4 });
  await page.mouse.up();
  const near = await box(page, "home");
  expect(near.x).toBeGreaterThanOrEqual(0);
  expect(near.y).toBeGreaterThanOrEqual(40);
});

test("keyboard: arrows move a window, Enter maximizes, Escape closes", async ({ page }, info) => {
  await page.goto("/es");
  await dock(page, "about").click();
  const handle = win(page, "about").locator(".wtitle");
  await handle.focus();
  if (info.project.name !== "mobile") {
    const before = await box(page, "about");
    await handle.press("ArrowRight");
    await handle.press("ArrowDown");
    const after = await box(page, "about");
    expect(Math.round(after.x - before.x)).toBe(16);
    expect(Math.round(after.y - before.y)).toBe(16);
  }
  await handle.press("Enter");
  await expect(win(page, "about")).toHaveClass(/max/);
  await handle.press("Escape");
  await expect(win(page, "about")).toHaveCount(0);
  await expect(dock(page, "about")).toBeFocused();
});

test("language switch re-labels the shell and the document language", async ({ page }) => {
  await page.goto("/es");
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(win(page, "home")).toHaveAttribute("aria-label", "Welcome");
  await expect(dock(page, "projects")).toContainText("Projects");
  await page.getByRole("button", { name: "ES", exact: true }).click();
  await expect(win(page, "home")).toHaveAttribute("aria-label", "Bienvenida");
});

test("theme toggle and settings popover (accent, Esc, focus return, reset)", async ({ page }) => {
  await page.goto("/es");
  const root = page.locator("html");
  const start = (await root.getAttribute("data-theme")) === "dark" ? "dark" : "light";
  await page
    .getByRole("button", {
      name: start === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro",
    })
    .click();
  await expect(root).toHaveAttribute("data-theme", start === "dark" ? "light" : "dark");

  const trigger = page.getByRole("button", { name: "Configuración" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Configuración" });
  await expect(dialog).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await dialog.getByRole("button", { name: "Morado" }).click();
  await expect(root).toHaveAttribute("data-accent", "purple");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();

  await dock(page, "stack").click();
  await dock(page, "contact").click();
  await trigger.click();
  await page.getByRole("button", { name: "Restablecer ventanas" }).click();
  await expect(page.locator("[data-win]")).toHaveCount(1);
  await expect(win(page, "home")).toBeVisible();
});

test("window surfaces keep the prototype's backdrop blur on desktop", async ({ page }, info) => {
  test.skip(info.project.name === "mobile", "blur is intentionally dropped at <=760px (D6)");
  await page.goto("/es");
  const blur = await win(page, "home").evaluate((el) => getComputedStyle(el).backdropFilter);
  expect(blur).toContain("blur(40px)");
});

test("compact screens: windows are full-width, no horizontal scroll, blur dropped", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile", "mobile viewport only");
  await page.goto("/es");
  const vp = page.viewportSize()!;
  const b = await box(page, "home");
  expect(Math.round(b.width)).toBe(vp.width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    vp.width,
  );
  expect(await win(page, "home").evaluate((el) => getComputedStyle(el).backdropFilter)).toBe(
    "none",
  );
  await expect(page.locator(".shortcuts")).toBeHidden();
});

for (const theme of ["dark", "light"] as const) {
  test(`axe: shell with open windows has no serious/critical violations (${theme})`, async ({
    page,
  }) => {
    await page.goto("/es");
    await win(page, "home").getByRole("button", { name: "Minimizar" }).click();
    await dock(page, "projects").click();
    await dock(page, "terminal").click();
    const root = page.locator("html");
    if ((await root.getAttribute("data-theme")) !== theme)
      await page.getByRole("button", { name: /Cambiar a tema/ }).click();
    await expect(root).toHaveAttribute("data-theme", theme);
    const { violations } = await new AxeBuilder({ page }).analyze();
    const blocking = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(
      blocking.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`),
    ).toEqual([]);
  });
}

test("with real motion, close and minimize animate and then finish", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // The animation classes last ~150-190ms, so record them with an observer instead of polling.
  await page.addInitScript(() => {
    const seen = new Set<string>();
    (window as unknown as { __anim: Set<string> }).__anim = seen;
    new MutationObserver(() => {
      if (document.querySelector(".win.closing")) seen.add("closing");
      if (document.querySelector(".win.minimizing")) seen.add("minimizing");
    }).observe(document, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class"],
    });
  });
  await page.goto("/es");
  await dock(page, "about").click();
  await win(page, "about").getByRole("button", { name: "Cerrar" }).click();
  await expect(win(page, "about")).toHaveCount(0);
  await win(page, "home").getByRole("button", { name: "Minimizar" }).click();
  await expect(win(page, "home")).toHaveCount(0);
  await expect(dock(page, "home")).toHaveClass(/minimized/);
  const seen = await page.evaluate(() => [
    ...(window as unknown as { __anim: Set<string> }).__anim,
  ]);
  expect(seen.sort()).toEqual(["closing", "minimizing"]);
});

test("a dblclick that bubbles from a traffic-light button does not toggle maximize", async ({
  page,
}, info) => {
  test.skip(info.project.name === "mobile", "compact windows ignore maximize");
  await page.goto("/es");
  await win(page, "home").getByRole("button", { name: "Minimizar" }).dispatchEvent("dblclick");
  await expect(win(page, "home")).not.toHaveClass(/max/);
  // while a dblclick on the bare title bar still toggles it
  await win(page, "home")
    .locator(".titlebar")
    .dblclick({ position: { x: 300, y: 20 } });
  await expect(win(page, "home")).toHaveClass(/max/);
});

test("re-opening an open window from the Dock moves keyboard focus into it", async ({ page }) => {
  await page.goto("/es");
  await dock(page, "home").click();
  await expect(win(page, "home")).toBeFocused();
  await dock(page, "about").click();
  await expect(win(page, "about")).toBeFocused();
  await dock(page, "home").click(); // home is open but not on top
  await expect(win(page, "home")).toBeFocused();
});

test("minimize and close return focus to the Dock icon", async ({ page }) => {
  await page.goto("/es");
  await dock(page, "about").click();
  await win(page, "about").getByRole("button", { name: "Minimizar" }).click();
  await expect(dock(page, "about")).toBeFocused();
  await dock(page, "about").click();
  await win(page, "about").getByRole("button", { name: "Cerrar" }).click();
  await expect(dock(page, "about")).toBeFocused();
});

test("after Reset windows, keyboard focus lands in the Welcome window", async ({ page }) => {
  await page.goto("/es");
  await dock(page, "stack").click();
  await page.getByRole("button", { name: "Configuración" }).click();
  await page.getByRole("button", { name: "Restablecer ventanas" }).click();
  await expect(win(page, "home")).toBeFocused();
});

for (const theme of ["dark", "light"] as const) {
  test(`axe: settings dialog open has no serious/critical violations (${theme})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
    await page.goto("/es");
    await page.getByRole("button", { name: "Configuración" }).click();
    await expect(page.getByRole("dialog", { name: "Configuración" })).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).analyze();
    const blocking = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(
      blocking.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`),
    ).toEqual([]);
  });
}

test("navigation controls that are links never underline on hover", async ({ page }, info) => {
  test.skip(info.project.name === "mobile", "needs a pointer that can hover");
  await page.goto("/es");
  await expect(win(page, "home")).toBeVisible();
  const underline = (loc: ReturnType<Page["locator"]>) =>
    loc.evaluate((el) => getComputedStyle(el).textDecorationLine);
  for (const loc of [
    page.locator("header.topbar a.pv-btn"), // menu-bar "Portfolio View"
    page.locator(".shortcuts a.sc"), // desktop icon "Portfolio View"
  ]) {
    await loc.hover();
    expect(await underline(loc)).toBe("none");
  }
  await page.getByRole("button", { name: "Configuración" }).click();
  const entry = page.locator("a.pop-btn");
  await entry.hover();
  expect(await underline(entry)).toBe("none");
  await page.keyboard.press("Escape");
  await page.goto("/es/portfolio");
  for (const loc of [
    page.locator("a.logo"),
    page.locator("a.pv-btn"),
    page.locator(".hero a.btn").first(),
  ]) {
    await loc.hover();
    expect(await underline(loc)).toBe("none");
  }
  // ordinary text links still underline on hover (the prototype's rule is kept for them)
  await page.goto("/es");
  await dock(page, "about").click();
  const mail = win(page, "about").getByRole("link", { name: "israelhurtarte@gmail.com" });
  await mail.hover();
  expect(await underline(mail)).toBe("underline");
});
