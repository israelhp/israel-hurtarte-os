import AxeBuilder from "@axe-core/playwright";
import { findPhoneLike, REFERENCE_WORDS } from "../../src/lib/pii";
import {
  certifications,
  demoProjects,
  education,
  experience,
  placeholderCerts,
  projects,
  skills,
} from "./content";
import { expect, test, type Page } from "@playwright/test";

const win = (p: Page, id: string) => p.locator(`[data-win="${id}"]`);
const dock = (p: Page, id: string) => p.locator(`[data-dock-app="${id}"]`);
const tour = (p: Page) => p.locator('[role="dialog"].tour');
const skipTour = (p: Page) => p.addInitScript(() => localStorage.setItem("ihos:tour-done", "1"));
const storedSettings = (p: Page) =>
  p.evaluate(() => JSON.parse(localStorage.getItem("ihos:settings:v1") ?? "null"));

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test.describe("routes and languages", () => {
  test("/ redirects to Spanish by default and to the stored language afterwards", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/es$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await page.evaluate(() => localStorage.setItem("ihos:lang", "en"));
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.evaluate(() => localStorage.setItem("ihos:lang", "fr"));
    await page.goto("/");
    await expect(page).toHaveURL(/\/es$/);
  });

  test("each language is rendered on the server with its own title, description and lang", async ({
    page,
  }) => {
    // Block all JavaScript chunks: what remains is the static HTML crawlers and no-JS visitors get.
    let blocked = 0;
    await page.route("**/_next/static/**/*.js", (r) => (blocked++, r.abort()));
    await page.goto("/en");
    expect(blocked).toBeGreaterThan(0); // the glob really matched the app's chunks
    await expect(win(page, "home")).toHaveCount(0); // so nothing hydrated: this is the raw server HTML
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle("ISRAEL HURTARTE.OS — Israel Hurtarte, Full Stack Developer");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /Interactive portfolio/,
    );
    await page.goto("/es");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page).toHaveTitle(
      "ISRAEL HURTARTE.OS — Israel Hurtarte, Desarrollador Full Stack",
    );
  });

  test("unknown URLs get the 404 page with links to both languages", async ({ page }) => {
    const res = await page.goto("/no-existe");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Español" })).toHaveAttribute("href", "/es");
    await expect(page.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en");
  });

  test("switching language navigates to the other prefix, keeps windows and stores the choice", async ({
    page,
  }) => {
    await skipTour(page);
    await page.goto("/es");
    await dock(page, "stack").click();
    await page.getByRole("button", { name: "EN", exact: true }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(win(page, "stack")).toBeVisible();
    await expect(win(page, "stack")).toHaveAttribute("aria-label", "Tech Stack Explorer");
    expect(await page.evaluate(() => localStorage.getItem("ihos:lang"))).toBe("en");
    // focus returns to the (now English) language control
    await expect(page.getByRole("button", { name: "EN", exact: true })).toBeFocused();
  });
});

test.describe("persisted preferences", () => {
  test("theme and accent survive a reload", async ({ page }) => {
    await skipTour(page);
    await page.goto("/es");
    const html = page.locator("html");
    await page.getByRole("button", { name: "Configuración" }).click();
    const dialog = page.getByRole("dialog", { name: "Configuración" });
    await dialog.getByRole("button", { name: "Claro", exact: true }).click();
    await dialog.getByRole("button", { name: "Rosado" }).click();
    await expect(html).toHaveAttribute("data-theme", "light");
    await expect(html).toHaveAttribute("data-accent", "pink");
    await expect.poll(() => storedSettings(page)).toEqual({ theme: "light", accent: "pink" });
    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "light");
    await expect(html).toHaveAttribute("data-accent", "pink");
    // the stored choice is also what the settings dialog shows
    await page.getByRole("button", { name: "Configuración" }).click();
    await expect(
      page
        .getByRole("dialog", { name: "Configuración" })
        .getByRole("button", { name: "Claro", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("stored preferences are applied before any JavaScript runs (no flash)", async ({ page }) => {
    await skipTour(page);
    await page.addInitScript(() =>
      localStorage.setItem(
        "ihos:settings:v1",
        JSON.stringify({ theme: "light", accent: "orange" }),
      ),
    );
    let blocked = 0;
    await page.route("**/_next/static/**/*.js", (r) => (blocked++, r.abort())); // nothing can hydrate
    await page.goto("/es");
    expect(blocked).toBeGreaterThan(0);
    await expect(win(page, "home")).toHaveCount(0);
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "light");
    await expect(html).toHaveAttribute("data-accent", "orange");
    const label = await page
      .locator(".os")
      .first()
      .evaluate((el) => getComputedStyle(el).getPropertyValue("--label").trim());
    // Chrome serializes the same color either way: rgba(0,0,0,.85) or #000000d9
    expect(label).toMatch(/^(rgba\(0, ?0, ?0, ?0?\.85\)|#000000d9)$/);
  });

  test("system 'auto' follows prefers-color-scheme, and corrupt storage falls back to defaults", async ({
    page,
  }) => {
    await skipTour(page);
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await page.goto("/es");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.evaluate(() =>
      localStorage.setItem("ihos:settings:v1", '{"theme":"neon","accent":"<x>"}'),
    );
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator("html")).toHaveAttribute("data-accent", "blue");
  });

  test("works when localStorage is blocked", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("blocked");
        },
      });
    });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/es");
    await expect(win(page, "home")).toBeVisible();
    await page.getByRole("button", { name: /Cambiar a tema/ }).click();
    expect(errors).toEqual([]);
    // the tour still appears once, and once dismissed it stays dismissed for this visit
    await expect(tour(page)).toBeVisible();
    await tour(page).getByRole("button", { name: "Quizás luego" }).click();
    await page.getByRole("button", { name: "EN", exact: true }).click();
    await page.waitForTimeout(1500);
    await expect(tour(page)).toHaveCount(0);
  });
});

test.describe("Portfolio View", () => {
  test.beforeEach(async ({ page }) => {
    await skipTour(page);
  });

  test("is a real indexable page with every section, real data and honest labels", async ({
    page,
  }) => {
    await page.goto("/es/portfolio");
    await expect(page).toHaveTitle(/^Portafolio — Israel Hurtarte/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Israel Hurtarte");
    for (const h of [
      "Perfil del desarrollador",
      "Explorador de tecnologías",
      "Explorador de proyectos",
      "Línea de carrera",
      "Educación",
      "Bóveda de certificaciones",
      "Construyamos algo juntos.",
    ])
      await expect(page.getByRole("heading", { name: h, level: 2 })).toBeVisible();
    await expect(page.locator("#p-skills .chip")).toHaveCount(skills.length);
    await expect(page.locator("#p-projects .pcard")).toHaveCount(projects.length);
    await expect(page.locator("#p-projects h2 .demo-tag")).toHaveCount(demoProjects.length ? 1 : 0);
    await expect(page.locator("#p-experience .tl-item")).toHaveCount(experience.length);
    await expect(page.locator("#p-experience")).toContainText(
      "Banco G&T Continental · Marzo 2024 – Actualidad",
    );
    await expect(page.locator("#p-certs .ecard")).toHaveCount(certifications.length);
    await expect(page.locator("#p-certs .demo-tag")).toHaveCount(placeholderCerts.length);
    await expect(page.locator("#p-education .ecard")).toHaveCount(education.length);
    await expect(page.getByRole("link", { name: "israelhurtarte@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:israelhurtarte@gmail.com",
    );
  });

  test("navigation: sections anchor, desktop mode link, language and theme keep you on the page", async ({
    page,
  }) => {
    await page.goto("/es/portfolio");
    await page
      .getByRole("navigation", { name: "Secciones del portafolio" })
      .getByRole("link", { name: "Proyectos" })
      .click();
    await expect(page).toHaveURL(/#p-projects$/);
    await page.getByRole("button", { name: "EN", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/portfolio/);
    await expect(page.getByRole("heading", { level: 2, name: "Projects Explorer" })).toBeVisible();
    await expect(page).toHaveTitle(/^Portfolio — Israel Hurtarte/);
    await page.getByRole("button", { name: /Switch to (light|dark) theme/ }).click();
    await page.getByRole("link", { name: "Desktop Mode" }).first().click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(win(page, "home")).toBeVisible();
  });

  test("a project's 'View details' opens it on the desktop and 'Contact' opens that window", async ({
    page,
  }) => {
    await page.goto("/es/portfolio");
    const target = projects[projects.length - 1]; // any project works; the last one proves the right one opens
    await page.getByRole("button", { name: new RegExp(`Ver detalles — ${target.name}`) }).click();
    await expect(page).toHaveURL(/\/es$/);
    await expect(
      win(page, "projects").getByRole("heading", { level: 2, name: target.name }),
    ).toBeVisible();
    await expect(win(page, "home")).toHaveCount(0); // desktop does not pile a Welcome window on top
    await page.getByRole("link", { name: "Vista portafolio" }).first().click();
    await expect(page).toHaveURL(/\/es\/portfolio/);
    await page.locator("#p-contact").getByRole("button", { name: "Centro de contacto" }).click();
    await expect(win(page, "contact")).toBeVisible();
  });

  for (const theme of ["dark", "light"] as const) {
    test(`axe: no serious/critical violations (${theme})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
      await page.goto("/es/portfolio");
      const { violations } = await new AxeBuilder({ page }).analyze();
      const blocking = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(
        blocking.map(
          (v) =>
            `${v.id}: ${v.nodes
              .map((n) => n.target.join(" "))
              .slice(0, 3)
              .join(" | ")}`,
        ),
      ).toEqual([]);
    });
  }

  test("fits narrow screens: nothing scrolls sideways and no real element overflows", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "mobile", "mobile viewport only");
    await page.goto("/es/portfolio");
    const result = await page.evaluate(() => {
      const pf = document.querySelector(".pf") as HTMLElement;
      const overflowing: string[] = [];
      document.querySelectorAll(".pf *").forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.width > 0 && b.right > pf.clientWidth + 1 && !el.closest(".pf-links"))
          overflowing.push(`${el.tagName}.${el.className}`);
      });
      return {
        overflowX: getComputedStyle(pf).overflowX,
        docWidth: document.documentElement.scrollWidth,
        overflowing,
      };
    });
    expect(result.overflowX).toBe("hidden"); // the decorative hero glow is clipped, never user-scrollable
    expect(result.docWidth).toBeLessThanOrEqual(page.viewportSize()!.width);
    expect(result.overflowing).toEqual([]);
  });
});

test.describe("Guided tour", () => {
  test("is offered on the first visit and 'Maybe later' means it never comes back", async ({
    page,
  }) => {
    await page.goto("/es");
    await expect(tour(page)).toBeVisible();
    await expect(tour(page).locator(".tour-card")).toBeFocused();
    await expect(
      tour(page).getByRole("heading", { name: "Bienvenido a ISRAEL HURTARTE.OS" }),
    ).toBeVisible();
    await tour(page).getByRole("button", { name: "Quizás luego" }).click();
    await expect(tour(page)).toHaveCount(0);
    expect(await page.evaluate(() => localStorage.getItem("ihos:tour-done"))).toBe("1");
    await page.reload();
    await page.waitForTimeout(1500);
    await expect(tour(page)).toHaveCount(0);
  });

  test("the tour card is actually styled with the theme (background and readable text)", async ({
    page,
  }) => {
    for (const scheme of ["dark", "light"] as const) {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
      await page.goto("/es");
      const card = tour(page).locator(".tour-card");
      await expect(card).toBeVisible();
      const style = await card.evaluate((el) => {
        const cs = getComputedStyle(el);
        const [r, g, b] = cs.color.match(/\d+(\.\d+)?/g)!.map(Number);
        return {
          bg: cs.backgroundColor,
          radius: cs.borderRadius,
          textLightness: (r + g + b) / 3 / 255,
        };
      });
      expect(style.bg, scheme).not.toBe("rgba(0, 0, 0, 0)");
      expect(style.radius, scheme).toBe("14px");
      // readable text: light on the dark theme, dark on the light theme (unstyled text would be black on both)
      if (scheme === "dark") expect(style.textLightness).toBeGreaterThan(0.5);
      else expect(style.textLightness).toBeLessThan(0.5);
      await page.evaluate(() => localStorage.clear());
    }
  });

  test("a returning visitor is not interrupted, and can replay it from the menu bar", async ({
    page,
  }) => {
    await skipTour(page);
    await page.goto("/es");
    await page.waitForTimeout(1500);
    await expect(tour(page)).toHaveCount(0);
    await page.getByRole("button", { name: "Tutorial guiado" }).click();
    await expect(tour(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(tour(page)).toHaveCount(0);
  });

  test("Next / Back walk through all steps and finishing leaves only the Welcome window", async ({
    page,
  }, info) => {
    test.skip(info.project.name === "mobile", "spotlight steps target desktop-only controls");
    await skipTour(page);
    await page.goto("/es");
    await dock(page, "about").click();
    await page.getByRole("button", { name: "Tutorial guiado" }).click();
    const card = tour(page);
    await card.getByRole("button", { name: "Comenzar tutorial" }).click();
    const titles = [
      "El Dock",
      "Controles de ventana",
      "Explora el contenido",
      "Terminal de desarrollador",
      "Idioma y apariencia",
      "Vista portafolio",
    ];
    for (const [i, title] of titles.entries()) {
      await expect(card.getByRole("heading", { name: title })).toBeVisible();
      await expect(card.locator(".tour-step")).toHaveText(`PASO ${i + 1} / 6`);
      await expect(page.locator(".tour-ring")).toHaveCount(1);
      if (i === 1) {
        // Back then Next lands on the same step again
        await card.getByRole("button", { name: "Atrás" }).click();
        await card.getByRole("button", { name: "Siguiente" }).click();
        await expect(card.getByRole("heading", { name: title })).toBeVisible();
      }
      await card.getByRole("button", { name: "Siguiente" }).click();
    }
    await expect(card.getByRole("heading", { name: "¡Listo!" })).toBeVisible();
    await card.getByRole("button", { name: "Empezar a explorar" }).click();
    await expect(tour(page)).toHaveCount(0);
    await expect(page.locator("[data-win]")).toHaveCount(1);
    await expect(win(page, "home")).toBeVisible();
  });

  test("doing the highlighted actions advances the tour by itself, across Portfolio View", async ({
    page,
  }, info) => {
    test.skip(info.project.name === "mobile", "spotlight steps target desktop-only controls");
    await page.goto("/es");
    const card = tour(page);
    await card.getByRole("button", { name: "Comenzar tutorial" }).click();
    await expect(card.getByRole("heading", { name: "El Dock" })).toBeVisible();
    await dock(page, "projects").click(); // step 1 → 2
    await expect(card.getByRole("heading", { name: "Controles de ventana" })).toBeVisible();
    await win(page, "projects").getByRole("button", { name: "Maximizar" }).click(); // → 3
    await expect(card.getByRole("heading", { name: "Explora el contenido" })).toBeVisible();
    await win(page, "projects")
      .getByRole("button", { name: /Ver detalles/ })
      .first()
      .click(); // → 4
    await expect(card.getByRole("heading", { name: "Terminal de desarrollador" })).toBeVisible();
    await dock(page, "terminal").click(); // → 5
    await expect(card.getByRole("heading", { name: "Idioma y apariencia" })).toBeVisible();
    await page.getByRole("button", { name: /Cambiar a tema/ }).click(); // → 6
    await expect(card.getByRole("heading", { name: "Vista portafolio" })).toBeVisible();
    await page.locator('[data-tour="pv"]').click(); // → navigates and shows the last step there
    await expect(page).toHaveURL(/\/es\/portfolio/);
    await expect(tour(page).getByRole("heading", { name: "¡Listo!" })).toBeVisible();
    await tour(page).getByRole("button", { name: "Empezar a explorar" }).click();
    await expect(page).toHaveURL(/\/es$/);
    await expect(page.locator("[data-win]")).toHaveCount(1);
    await expect(win(page, "home")).toBeVisible();
    await expect(tour(page)).toHaveCount(0);
  });

  test("copy follows the language, and the highlighted control stays clickable through the dim layer", async ({
    page,
  }, info) => {
    test.skip(info.project.name === "mobile", "desktop spotlight geometry");
    await page.goto("/en");
    await expect(page.locator('[role="dialog"].tour')).toBeVisible();
    await page.getByRole("button", { name: "Start tour" }).click();
    await expect(page.getByRole("heading", { name: "The Dock" })).toBeVisible();
    // the dim layer must not swallow clicks aimed at the highlighted Dock
    await dock(page, "projects").click({ timeout: 3000 });
    await expect(win(page, "projects")).toBeVisible();
  });

  test("Escape closes the settings dialog without ending the tour; a bare Escape skips it", async ({
    page,
  }, info) => {
    test.skip(info.project.name === "mobile", "desktop spotlight geometry");
    await skipTour(page);
    await page.goto("/es");
    await page.getByRole("button", { name: "Tutorial guiado" }).click();
    await tour(page).getByRole("button", { name: "Comenzar tutorial" }).click();
    // the dim layer blocks the mouse outside the highlighted Dock, but the keyboard still reaches the menu bar
    const settings = page.getByRole("button", { name: "Configuración" });
    await settings.focus();
    await settings.press("Enter");
    await expect(page.getByRole("dialog", { name: "Configuración" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Configuración" })).toHaveCount(0);
    await expect(tour(page)).toBeVisible(); // still running
    await page.keyboard.press("Escape");
    await expect(tour(page)).toHaveCount(0);
  });

  test("Escape inside a text field does not skip the tour", async ({ page }, info) => {
    test.skip(info.project.name === "mobile", "desktop spotlight geometry");
    await skipTour(page);
    await page.goto("/es");
    await dock(page, "terminal").click();
    await page.getByRole("button", { name: "Tutorial guiado" }).click();
    await win(page, "terminal")
      .getByRole("textbox", { name: "Comando de terminal" })
      .press("Escape");
    await expect(tour(page)).toBeVisible();
  });

  test("Skip tour is available on every middle step", async ({ page }, info) => {
    test.skip(info.project.name === "mobile", "desktop spotlight geometry");
    await page.goto("/es");
    await tour(page).getByRole("button", { name: "Comenzar tutorial" }).click();
    await tour(page).getByRole("button", { name: "Saltar tutorial" }).click();
    await expect(tour(page)).toHaveCount(0);
    expect(await page.evaluate(() => localStorage.getItem("ihos:tour-done"))).toBe("1");
  });

  for (const theme of ["dark", "light"] as const) {
    test(`axe: tour dialog has no serious/critical violations (${theme})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
      await page.goto("/es");
      await expect(tour(page)).toBeVisible();
      const intro = await new AxeBuilder({ page }).analyze();
      await tour(page).getByRole("button", { name: "Comenzar tutorial" }).click();
      const step = await new AxeBuilder({ page }).analyze();
      const blocking = [...intro.violations, ...step.violations].filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(
        blocking.map(
          (v) =>
            `${v.id}: ${v.nodes
              .map((n) => n.target.join(" "))
              .slice(0, 3)
              .join(" | ")}`,
        ),
      ).toEqual([]);
    });
  }
});

test("Portfolio View project cards show the website button next to 'Ver detalles'", async ({
  page,
}) => {
  await skipTour(page);
  await page.goto("/es/portfolio");
  const withSite = projects.filter((p) => p.demoUrl);
  expect(withSite.length).toBeGreaterThan(0);
  for (const p of withSite) {
    const card = page.locator("#p-projects .pcard", { hasText: p.name });
    const site = card.getByRole("link", {
      name:
        (p.linkKind ?? (p.status === "verified" ? "website" : "demo")) === "demo"
          ? "Demo"
          : "Sitio web",
    });
    const details = card.getByRole("button", { name: /Ver detalles/ });
    await expect(site).toHaveAttribute("href", p.demoUrl);
    await expect(site).toHaveAttribute("rel", "noopener noreferrer");
    // side by side on the same row of the card footer
    const a = (await site.boundingBox())!;
    const b = (await details.boundingBox())!;
    expect(Math.abs(a.y - b.y), `${p.name}: buttons share a row`).toBeLessThan(4);
    expect(a.x + a.width, "website button is left of Ver detalles").toBeLessThanOrEqual(b.x + 1);
  }
});

test.describe("privacy", () => {
  // The owner's CV contains a phone number and references with phone numbers. None of that may reach the site.
  // Heuristic: no phone-shaped digit runs in visible text, link targets or meta content, and no reference headings.
  const ROUTES = ["/es", "/en", "/es/portfolio", "/en/portfolio"];

  for (const route of ROUTES) {
    test(`no phone-like numbers or reference headings are rendered on ${route}`, async ({
      page,
    }) => {
      await skipTour(page);
      await page.goto(route);
      if (!route.endsWith("portfolio")) {
        await expect(win(page, "home")).toBeVisible();
        // open every window so all app content is in the DOM
        for (const id of [
          "about",
          "stack",
          "projects",
          "experience",
          "education",
          "certs",
          "terminal",
          "contact",
        ])
          await page.locator(`[data-dock-app="${id}"]`).click();
      }
      const text = await page.evaluate(() => {
        const attrs = [
          ...document.querySelectorAll("a[href], [title], [aria-label], meta[content]"),
        ].map((el) =>
          ["href", "title", "aria-label", "content"]
            .map((a) => el.getAttribute(a) ?? "")
            .join("\n"),
        );
        return [document.body.innerText, document.title, ...attrs].join("\n");
      });
      expect(findPhoneLike(text), "phone-like number rendered").toEqual([]);
      expect(text).not.toMatch(REFERENCE_WORDS);
      await expect(
        page.locator('a[href^="tel:"], a[href*="wa.me"], a[href*="whatsapp"]'),
      ).toHaveCount(0);
    });
  }
});
