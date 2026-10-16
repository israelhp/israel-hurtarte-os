import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("design system catalog", () => {
  test.beforeEach(async ({ page }) => {
    // Transitions would make axe sample intermediate colors; reduced motion disables them (prototype rule).
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/design-system");
  });

  test("is not indexable and starts dark/blue", async ({ page }) => {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator(".os")).toHaveClass(/theme-dark/);
    await expect(page.locator(".os")).toHaveClass(/acc-blue/);
  });

  test("theme and accent controls change the root classes and computed tokens", async ({
    page,
  }) => {
    const os = page.locator(".os");
    const label = () =>
      os.evaluate((el) => getComputedStyle(el).getPropertyValue("--label").trim());
    const dark = await label();
    await page.getByRole("button", { name: "light", exact: true }).click();
    await expect(os).toHaveClass(/theme-light/);
    expect(await label()).not.toBe(dark);
    await page.getByRole("button", { name: "purple" }).click();
    await expect(os).toHaveClass(/acc-purple/);
    const vars = await os.evaluate((el) => {
      const cs = getComputedStyle(el);
      return [cs.getPropertyValue("--acc").trim(), cs.getPropertyValue("--purple").trim()];
    });
    expect(vars[0]).toBe(vars[1]);
  });

  for (const theme of ["dark", "light"]) {
    test(`axe: no serious/critical violations (${theme})`, async ({ page }) => {
      await page.getByRole("button", { name: theme, exact: true }).click();
      const { violations } = await new AxeBuilder({ page }).analyze();
      const blocking = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(
        blocking.map((v) => `${v.id}: ${v.nodes.length} node(s) — ${v.nodes[0]?.target}`),
      ).toEqual([]);
    });
  }
});

test("axe: every accent in both themes has no serious/critical violations", async ({ page }) => {
  test.setTimeout(120_000); // 16 axe passes in one test
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/design-system");
  const failures: string[] = [];
  for (const theme of ["dark", "light"]) {
    await page.getByRole("button", { name: theme, exact: true }).click();
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
      await page.getByRole("button", { name: accent, exact: true }).click();
      const { violations } = await new AxeBuilder({ page }).analyze();
      for (const v of violations.filter((x) => x.impact === "serious" || x.impact === "critical"))
        failures.push(
          `${theme}/${accent}: ${v.id} ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
        );
    }
  }
  expect(failures).toEqual([]);
});
