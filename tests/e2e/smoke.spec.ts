import { expect, test } from "@playwright/test";

test("home renders the official product name in Spanish", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByRole("heading", { level: 1, name: "ISRAEL HURTARTE.OS" })).toBeVisible();
  await expect(page).toHaveTitle(/ISRAEL HURTARTE\.OS/);
});
