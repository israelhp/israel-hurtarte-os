import { expect, test, type Page } from "@playwright/test";

/**
 * Latency guard. It lives in its own Playwright project ("perf") that runs ALONE, after every other project has
 * finished: with 4x CPU throttling, any other worker competing for the CPU inflates event durations (800ms measured
 * in parallel versus ~100-260ms alone), which would make the guard meaningless.
 */
const win = (p: Page, id: string) => p.locator(`[data-win="${id}"]`);
const dock = (p: Page, id: string) => p.locator(`[data-dock-app="${id}"]`);

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("ihos:tour-done", "1"));
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test.describe("performance (isolated)", () => {
  test("interactions stay responsive on a 4x slower CPU (INP guard)", async ({ page }) => {
    const cdp = await page.context().newCDPSession(page);
    await page.goto("/es");
    await expect(win(page, "home")).toBeVisible();
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.evaluate(() => {
      const w = window as unknown as { __inp: number[] };
      w.__inp = [];
      new PerformanceObserver((l) =>
        l.getEntries().forEach((e) => {
          const ev = e as PerformanceEntry & { interactionId: number };
          if (ev.interactionId) w.__inp.push(ev.duration);
        }),
      ).observe({
        type: "event",
        durationThreshold: 16,
        buffered: true,
      } as PerformanceObserverInit);
    });
    await dock(page, "projects").click();
    await win(page, "projects").getByRole("button", { name: "Maximizar" }).click();
    await win(page, "projects").getByRole("button", { name: /^Web/ }).click();
    await dock(page, "stack").click();
    await win(page, "stack").getByRole("textbox").pressSequentially("react");
    await dock(page, "terminal").click();
    await page.getByRole("button", { name: /Cambiar a tema/ }).click();
    await page.waitForTimeout(300);
    const durations = await page.evaluate(() => (window as unknown as { __inp: number[] }).__inp);
    const worst = Math.max(0, ...durations);
    console.log(
      `INP-style worst interaction at 4x CPU slowdown: ${Math.round(worst)}ms over ${durations.length} interactions`,
    );
    expect(durations.length, "interactions that Event Timing could measure").toBeGreaterThanOrEqual(
      6,
    );
    expect(worst, "worst interaction duration with 4x CPU throttling").toBeLessThan(400);
  });
});
