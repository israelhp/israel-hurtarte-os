import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import {
  certifications,
  certsIn,
  demoProjects,
  education,
  experience,
  profile,
  placeholderCerts,
  projectUsing,
  projects,
  projectsIn,
  skills,
  skillsIn,
} from "./content";

const win = (p: Page, id: string) => p.locator(`[data-win="${id}"]`);
const openApp = async (p: Page, id: string) => {
  await p.locator(`[data-dock-app="${id}"]`).click();
  await expect(win(p, id)).toBeVisible();
  return win(p, id);
};

/** "Demo" for demo projects and for links the owner calls a demo; "Sitio web" otherwise. */
const linkLabel = (p: { status: string; linkKind?: string }) =>
  (p.linkKind ?? (p.status === "verified" ? "website" : "demo")) === "demo" ? "Demo" : "Sitio web";

test.beforeEach(async ({ page }) => {
  // The guided tour auto-starts on a first visit; these tests are about the rest of the UI.
  await page.addInitScript(() => localStorage.setItem("ihos:tour-done", "1"));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es");
});

test.describe("Home", () => {
  test("shows the identity and its buttons open the matching windows", async ({ page }) => {
    const home = win(page, "home");
    await expect(home.getByRole("heading", { name: "ISRAEL HURTARTE.OS" })).toBeVisible();
    await expect(home).toContainText("Desarrollador Full Stack");
    await expect(home).toContainText("Guatemala");
    await home.getByRole("button", { name: "Explorar proyectos" }).click();
    await expect(win(page, "projects")).toBeVisible();
    await win(page, "home").getByRole("button", { name: "Ver habilidades" }).dispatchEvent("click");
    await expect(win(page, "stack")).toBeVisible();
    await win(page, "home").getByRole("button", { name: "Sobre mí" }).dispatchEvent("click");
    await expect(win(page, "about")).toBeVisible();
  });
});

test.describe("About", () => {
  test("renders real profile data, safe links and the CV state", async ({ page }) => {
    const w = await openApp(page, "about");
    await expect(w.getByRole("heading", { name: "Israel Hurtarte" })).toBeVisible();
    await expect(w.locator(".chips .chip")).toHaveCount(profile.specialties.es.length);
    // specialties follow the language (no English labels in the Spanish view)
    await expect(w).toContainText("Desarrollo de APIs REST");
    await expect(w).not.toContainText("REST API Development");
    await expect(w.getByRole("link", { name: "israelhurtarte@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:israelhurtarte@gmail.com",
    );
    const gh = w.getByRole("link", { name: "github.com/israelhp" });
    await expect(gh).toHaveAttribute("href", "https://github.com/israelhp");
    await expect(gh).toHaveAttribute("rel", "noopener noreferrer");
    await expect(w.getByRole("link", { name: "in/israel-hurtarte" })).toHaveAttribute(
      "href",
      /^https:\/\/www\.linkedin\.com\/in\/israel-hurtarte-/,
    );
    await expect(w.locator(".nc")).toContainText("No configurado");
    if (profile.cvUrl) {
      // a CV shipped with the site is a real download link
      const cv = w.getByRole("link", { name: /Descargar CV/ });
      await expect(cv).toHaveAttribute("href", profile.cvUrl);
      await expect(cv).toHaveAttribute("download", /\.pdf$/);
    } else {
      await expect(w.getByRole("button", { name: /Descargar CV/ })).toBeDisabled();
    }
  });
});

test.describe("Tech Stack", () => {
  test("filters by category, searches, and shows an empty state", async ({ page }) => {
    const w = await openApp(page, "stack");
    await expect(w.locator(".tcard")).toHaveCount(skills.length);
    await w.getByRole("button", { name: /^Frontend/ }).click();
    await expect(w.locator(".tcard")).toHaveCount(skillsIn("frontend").length);
    await w.getByRole("button", { name: /^Todas/ }).click();
    await w.getByRole("textbox", { name: "Buscar tecnologías…" }).fill("postgresql");
    await expect(w.locator(".tcard")).toHaveCount(1);
    await expect(w.locator(".tcard")).toContainText("PostgreSQL");
    await w.getByRole("textbox", { name: "Buscar tecnologías…" }).fill("zzzz");
    await expect(w.getByText("Ninguna tecnología coincide con tu búsqueda.")).toBeVisible();
  });

  test("detail pane links related projects and opens them in Projects", async ({ page }, info) => {
    test.skip(info.project.name === "mobile", "detail pane is a bottom sheet on compact screens");
    // pick a technology that the first project really uses, so the test follows the content
    const tech = projects[0].stack[0];
    const related = projectUsing(tech)!;
    const w = await openApp(page, "stack");
    await w
      .locator(".tcard")
      .filter({
        has: page.locator(".tc-name", {
          // relative to each card
          hasText: new RegExp(`^${tech.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}$`),
        }),
      })
      .click();
    await expect(w.locator(".detail")).toContainText(related.name);
    await w.getByRole("button", { name: new RegExp(related.name) }).click();
    const projectsWin = win(page, "projects");
    await expect(projectsWin).toBeVisible();
    await expect(projectsWin.getByRole("heading", { name: related.name, level: 2 })).toBeVisible();
  });
});

test.describe("Projects", () => {
  test("lists the projects, labels demo ones and offers only folders that have projects", async ({
    page,
  }) => {
    expect(projects.length, "the portfolio needs at least one project").toBeGreaterThan(0);
    const w = await openApp(page, "projects");
    await expect(w.locator(".pcard")).toHaveCount(projects.length);
    await expect(w.locator(".pcard .demo-tag")).toHaveCount(demoProjects.length);
    // the "DEMO DATA" banner only exists while demo projects do
    await expect(w.locator(".toolbar .demo-tag")).toHaveCount(demoProjects.length ? 1 : 0);
    const FOLDERS = {
      featured: "Destacados",
      personal: "Personales",
      professional: "Profesionales",
      web: "Web",
      mobile: "Móvil",
      backend: "Backend",
      databases: "Bases de datos",
      devops: "DevOps",
    } as const;
    for (const [id, label] of Object.entries(FOLDERS)) {
      const inFolder = projectsIn(id as keyof typeof FOLDERS);
      const button = w.getByRole("button", { name: new RegExp(`^${label}`) });
      if (inFolder.length === 0) {
        await expect(button, `${label}: empty folders are not offered`).toHaveCount(0);
        continue;
      }
      await button.click();
      await expect(w.locator(".pcard")).toHaveCount(inFolder.length);
      await expect(w.locator(".pcard").first()).toContainText(inFolder[0].name);
    }
  });

  test("a project with a website shows the button beside 'Ver detalles' on its card", async ({
    page,
  }) => {
    const w = await openApp(page, "projects");
    for (const p of projects.filter((x) => x.demoUrl)) {
      const card = w.locator(".pcard", { hasText: p.name });
      const site = card.getByRole("link", { name: linkLabel(p) });
      const details = card.getByRole("button", { name: /Ver detalles/ });
      await expect(site).toHaveAttribute("href", p.demoUrl);
      const a = (await site.boundingBox())!;
      const b = (await details.boundingBox())!;
      expect(Math.abs(a.y - b.y), `${p.name}: same row`).toBeLessThan(4);
      expect(a.x + a.width).toBeLessThanOrEqual(b.x + 1);
    }
    // "professional" folder now includes the real project
    await w.getByRole("button", { name: /^Profesionales/ }).click();
    for (const p of projectsIn("professional"))
      await expect(w.locator(".pcard", { hasText: p.name })).toHaveCount(1);
  });

  test("detail view shows every section, only real links, and goes back", async ({ page }) => {
    const first = projects[0];
    const w = await openApp(page, "projects");
    await w.getByRole("button", { name: new RegExp(`Ver detalles — ${first.name}`) }).click();
    for (const h of ["Objetivo", "Stack", "Funcionalidades", "Arquitectura", "Desafíos técnicos"])
      await expect(w.getByRole("heading", { name: h })).toBeVisible();
    await expect(w.locator(".arch")).toContainText(first.arch.trim().split(/\s+/)[0]);
    const links = [first.demoUrl, first.repoUrl].filter(Boolean);
    if (links.length === 0) {
      await expect(w.getByText("No hay demo ni repositorio público configurado.")).toBeVisible();
      await expect(w.locator("a[href]")).toHaveCount(0);
    } else {
      // every configured URL is rendered as a safe external link, and nothing else is
      await expect(w.locator("a[href]")).toHaveCount(links.length);
      for (const url of links)
        await expect(w.locator(`a[href="${url}"]`)).toHaveAttribute("rel", "noopener noreferrer");
    }
    await w.getByRole("button", { name: "Volver a proyectos" }).click();
    await expect(w.locator(".pcard")).toHaveCount(projects.length);
  });
});

test.describe("Experience", () => {
  test("shows the owner-approved roles; entries expand and collapse accessibly", async ({
    page,
  }) => {
    const w = await openApp(page, "experience");
    await expect(w).toContainText("Ingeniero de Desarrollo Middle");
    await expect(w).toContainText("Banco G&T Continental · Marzo 2024 – Actualidad");
    await expect(w).toContainText("Ingeniero de Desarrollo Junior");
    await expect(w).toContainText("Marzo 2021 – Marzo 2024");
    await expect(w).toContainText("VisionBitt · Enero 2025 – Actualidad");
    const toggles = w.locator(".tl-head");
    await expect(toggles).toHaveCount(experience.length);
    await expect(toggles.nth(0)).toHaveAttribute("aria-expanded", "true");
    await expect(w.getByText("Responsabilidades")).toHaveCount(1);
    await toggles.nth(1).click();
    await expect(toggles.nth(1)).toHaveAttribute("aria-expanded", "true");
    await expect(w.getByText("Responsabilidades")).toHaveCount(2);
    await toggles.nth(0).click();
    await expect(toggles.nth(0)).toHaveAttribute("aria-expanded", "false");
    await expect(w.getByText("Responsabilidades")).toHaveCount(1);
  });
});

test.describe("Education and Certifications", () => {
  test("education lists the three real entries", async ({ page }) => {
    const w = await openApp(page, "education");
    await expect(w.locator(".ecard")).toHaveCount(education.length);
    await expect(w).toContainText("Maestría en Seguridad Informática");
    await expect(w).toContainText("Ingeniería en Sistemas");
    await expect(w).toContainText("Colegio Verbo No. 4");
  });

  test("certifications: every real course links to its own public EDteam certificate page", async ({
    page,
  }) => {
    const w = await openApp(page, "certs");
    const real = certifications.filter((c) => c.status === "verified" && c.link);
    expect(real.length).toBeGreaterThan(0);
    for (const c of real) {
      const link = w.getByRole("link", { name: `Credencial — ${c.name}` });
      await expect(link, c.name).toHaveAttribute("href", c.link);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    // the source shows no issue date, so no date row is rendered for them
    await expect(w.locator(".ecard .kv", { hasText: "Fecha" })).toHaveCount(
      certifications.filter((c) => c.date).length,
    );
    // no placeholder notice once nothing is a placeholder
    if (placeholderCerts.length === 0) await expect(w.locator(".note")).toHaveCount(0);
  });

  test("certification filters only offer categories that have certifications", async ({ page }) => {
    const w = await openApp(page, "certs");
    const used = new Set(certifications.map((c) => c.cat));
    const labels: Record<string, string> = {
      cloud: "Nube",
      dev: "Desarrollo",
      data: "Datos",
      security: "Seguridad",
    };
    await expect(w.getByRole("button", { name: "Todas" })).toBeVisible();
    for (const [id, label] of Object.entries(labels)) {
      await expect(w.getByRole("button", { name: label, exact: true }), id).toHaveCount(
        used.has(id as never) ? 1 : 0,
      );
    }
  });

  test("certifications: placeholders are labelled, real ones are not, and the filter works", async ({
    page,
  }) => {
    const w = await openApp(page, "certs");
    await expect(w.locator(".ecard")).toHaveCount(certifications.length);
    await expect(w.locator(".demo-tag")).toHaveCount(placeholderCerts.length);
    if (placeholderCerts.length)
      await expect(w.locator(".demo-tag").first()).toHaveText("PLACEHOLDER");
    const cloud = certsIn("cloud");
    await w.getByRole("button", { name: "Nube" }).click();
    await expect(w.locator(".ecard")).toHaveCount(cloud.length);
    await expect(w.getByRole("button", { name: "Nube" })).toHaveAttribute("aria-pressed", "true");
    const withLink = cloud.filter((c) => c.link).length;
    await expect(w.locator(".ecard a[href]")).toHaveCount(withLink);
  });
});

test.describe("Terminal (allowlisted simulation)", () => {
  test("welcomes, runs allowed commands, navigates, history and completion work", async ({
    page,
  }) => {
    const w = await openApp(page, "terminal");
    const log = w.getByRole("log", { name: "Salida de la terminal" });
    const input = w.getByRole("textbox", { name: "Comando de terminal" });
    await expect(log).toContainText("Terminal v1.0");

    await input.fill("help");
    await input.press("Enter");
    await expect(log).toContainText("Comandos disponibles:");
    await expect(log).toContainText("certifications");

    await input.fill("whoami");
    await input.press("Enter");
    await expect(log).toContainText("Full Stack Developer — Guatemala");

    await input.press("ArrowUp");
    await expect(input).toHaveValue("whoami");
    await input.press("ArrowUp");
    await expect(input).toHaveValue("help");
    await input.press("ArrowDown");
    await input.press("ArrowDown");
    await expect(input).toHaveValue("");

    await input.fill("wh");
    await input.press("Tab");
    await expect(input).toHaveValue("whoami");

    await input.fill("foo");
    await input.press("Enter");
    await expect(log).toContainText("zsh: comando no encontrado: foo");

    await input.fill("projects");
    await input.press("Enter");
    await expect(log).toContainText("Abriendo Explorador de proyectos…");
    await expect(win(page, "projects")).toBeVisible();

    await input.fill("clear");
    await input.press("Enter");
    await expect(log.locator(".tline")).toHaveCount(0);
  });

  test("hostile input is shown as text only and never executes or injects markup", async ({
    page,
  }) => {
    const dialogs: string[] = [];
    page.on("dialog", (d) => {
      dialogs.push(d.message());
      void d.dismiss();
    });
    const w = await openApp(page, "terminal");
    const input = w.getByRole("textbox", { name: "Comando de terminal" });
    for (const evil of [
      "<img src=x onerror=alert(1)>",
      "<script>alert(2)</script>",
      "javascript:alert(3)",
      "$(id)",
    ]) {
      await input.fill(evil);
      await input.press("Enter");
    }
    const log = w.getByRole("log");
    await expect(log).toContainText("<img src=x onerror=alert(1)>");
    await expect(log.locator("img, script, iframe")).toHaveCount(0);
    expect(dialogs).toEqual([]);
    await expect(win(page, "projects")).toHaveCount(0);
    await expect(input).toHaveAttribute("maxlength", "200");
  });

  test("Escape inside the prompt does not close the window", async ({ page }) => {
    const w = await openApp(page, "terminal");
    await w.getByRole("textbox", { name: "Comando de terminal" }).press("Escape");
    await expect(w).toBeVisible();
  });
});

test.describe("Contact (mailto, honest)", () => {
  test("validates fields with accessible errors", async ({ page }) => {
    const w = await openApp(page, "contact");
    await w.getByRole("button", { name: "Enviar mensaje" }).click();
    await expect(w.getByRole("alert")).toHaveCount(3);
    await expect(w.getByLabel("Nombre")).toHaveAttribute("aria-invalid", "true");
    await expect(w.getByLabel("Correo", { exact: true })).toHaveAttribute("aria-invalid", "true");
    await expect(w.locator(".banner.ok")).toHaveCount(0);
  });

  test("builds the mailto draft for the mail client and never claims the message was sent", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      (window as unknown as { __mailto: string[] }).__mailto = [];
      const original = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function () {
        if (this.href.startsWith("mailto:"))
          (window as unknown as { __mailto: string[] }).__mailto.push(this.href);
        else original.call(this);
      };
    });
    await page.goto("/es");
    const requests: string[] = [];
    // Next may HEAD-prefetch linked pages; anything that could carry data (POST/PUT/…) must never happen.
    page.on(
      "request",
      (r) => !["GET", "HEAD"].includes(r.method()) && requests.push(`${r.method()} ${r.url()}`),
    );
    const w = await openApp(page, "contact");
    await w.getByLabel("Nombre").fill("Ana Prueba");
    await w.getByLabel("Correo", { exact: true }).fill("ana@example.com");
    await w.getByLabel("Mensaje").fill("Hola, me gustaría conversar.");
    await w.getByRole("button", { name: "Enviar mensaje" }).click();
    const drafts = await page.evaluate(
      () => (window as unknown as { __mailto: string[] }).__mailto,
    );
    expect(drafts).toHaveLength(1);
    expect(drafts[0]).toMatch(
      /^mailto:israelhurtarte@gmail\.com\?subject=Contacto%20desde%20ISRAEL%20HURTARTE\.OS&body=/,
    );
    expect(decodeURIComponent(drafts[0].split("body=")[1])).toContain(
      "Hola, me gustaría conversar.",
    );
    await expect(w.locator(".banner.ok")).toContainText(
      "Se preparó el mensaje en tu cliente de correo",
    );
    expect(requests).toEqual([]);
    await expect(w.getByText("no se envía desde esta página")).toBeVisible();
  });
});

test("project cards: status, website/demo and details sit on one line", async ({ page }, info) => {
  test.skip(info.project.name === "mobile", "narrow screens may wrap the status label by design");
  for (const lang of ["ES", "EN"]) {
    await page.getByRole("button", { name: lang, exact: true }).click();
    const w = await openApp(page, "projects");
    const cards = w.locator(".pcard");
    await expect(cards).toHaveCount(projects.length);
    for (let i = 0; i < projects.length; i++) {
      const tops = await cards
        .nth(i)
        .locator(".pc-foot")
        .evaluate((foot) =>
          [...foot.querySelectorAll(".status, .pc-actions a, .pc-actions button")].map((e) => {
            const r = e.getBoundingClientRect();
            return Math.round(r.top + r.height / 2);
          }),
        );
      expect(tops.length).toBeGreaterThanOrEqual(2);
      expect(
        Math.max(...tops) - Math.min(...tops),
        `${lang} card ${i}: ${tops}`,
      ).toBeLessThanOrEqual(2);
    }
  }
});

test.describe("project demo video", () => {
  const withVideo = projects.find((p) => p.video)!;
  const openDetail = async (page: Page) => {
    const w = await openApp(page, "projects");
    await w
      .locator(".pcard", { hasText: withVideo.name })
      .getByRole("button", { name: /Ver detalles/ })
      .click();
    return w;
  };

  test("shows a controllable, non-autoplaying player when the file exists", async ({ page }) => {
    await page.route(`**${withVideo.video!.src}`, (route) =>
      route.fulfill({ contentType: "video/mp4", body: readFileSync("tests/fixtures/tiny.mp4") }),
    );
    const w = await openDetail(page);
    const video = w.locator("video");
    await expect(video).toHaveAttribute("src", withVideo.video!.src);
    await expect(video).toHaveAttribute("controls", "");
    await expect(video).not.toHaveAttribute("autoplay", /.*/);
    await expect(video).toHaveAccessibleName("Video de demostración del proyecto");
    await expect(w.getByRole("heading", { name: "Video de demostración" })).toBeVisible();
  });

  test("hides the section instead of showing a broken player when the file is missing", async ({
    page,
  }) => {
    await page.route(`**${withVideo.video!.src}`, (route) =>
      route.fulfill({ status: 404, body: "" }),
    );
    const w = await openDetail(page);
    await expect(w.getByRole("heading", { name: withVideo.name })).toBeVisible();
    await expect(w.locator("video")).toHaveCount(0);
  });
});

test("project cards are all the same size and show only the main technologies", async ({
  page,
}, info) => {
  test.skip(info.project.name === "mobile", "one column on phones: heights are independent");
  const w = await openApp(page, "projects");
  const cards = w.locator(".pcard");
  await expect(cards).toHaveCount(projects.length);
  const heights = await cards.evaluateAll((els) =>
    els.map((e) => Math.round(e.getBoundingClientRect().height)),
  );
  expect(new Set(heights).size, `card heights: ${heights}`).toBe(1);
  for (const p of projects) {
    const card = cards.filter({ hasText: p.name });
    const shown = Math.min(p.cardStack?.length ?? p.stack.length, 4);
    await expect(card.locator(".chip")).toHaveCount(p.stack.length > shown ? shown + 1 : shown);
    if (p.stack.length > shown)
      await expect(card.locator(".chip").last()).toHaveText(`+${p.stack.length - shown}`);
    // the detail lists every technology
    await card.getByRole("button", { name: /Ver detalles/ }).click();
    await expect(w.locator(".pd .chip")).toHaveCount(p.stack.length);
    await w.getByRole("button", { name: /^Volver/ }).click();
  }
});

test("switching to English translates app content", async ({ page }) => {
  const w = await openApp(page, "projects");
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(w.getByRole("button", { name: /^All Projects/ })).toBeVisible();
  await expect(w.getByRole("button", { name: /^Professional/ })).toBeVisible();
  await expect(win(page, "projects")).toHaveAttribute("aria-label", "Projects Explorer");
  await expect(w.locator(".pcard").first()).toContainText("View Details");
});

for (const theme of ["dark", "light"] as const) {
  test(`axe: every app window has no serious/critical violations (${theme})`, async ({
    page,
  }, info) => {
    test.skip(
      info.project.name === "mobile",
      "covered on desktop; compact layout checked separately",
    );
    test.setTimeout(120_000); // 9 windows, one axe pass each
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
    await page.goto("/es");
    const failures: string[] = [];
    for (const id of [
      "home",
      "about",
      "stack",
      "projects",
      "experience",
      "education",
      "certs",
      "terminal",
      "contact",
    ]) {
      await page.locator(`[data-dock-app="${id}"]`).click();
      await win(page, id).getByRole("button", { name: "Maximizar" }).click();
      if (id === "stack") await win(page, id).locator(".tcard").first().click();
      if (id === "projects")
        await win(page, id)
          .getByRole("button", { name: /Ver detalles/ })
          .first()
          .click();
      const { violations } = await new AxeBuilder({ page }).include(`[data-win="${id}"]`).analyze();
      for (const v of violations.filter((x) => x.impact === "serious" || x.impact === "critical"))
        failures.push(
          `${id}: ${v.id} ${v.nodes
            .map((n) => n.target.join(" "))
            .slice(0, 3)
            .join(" | ")}`,
        );
    }
    expect(failures).toEqual([]);
  });
}

test("compact screens: app windows fit without horizontal scroll", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "mobile viewport only");
  const vp = page.viewportSize()!;
  for (const id of ["stack", "projects", "experience", "certs", "terminal", "contact"]) {
    await openApp(page, id);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), id).toBeLessThanOrEqual(
      vp.width,
    );
    const box = (await win(page, id).boundingBox())!;
    expect(Math.round(box.width), id).toBe(vp.width);
  }
});

test("terminal welcome line is typed with real motion and ends up in the log", async ({ page }) => {
  // The welcome line is typed with a 16ms interval (~1s). Stretch only that interval so the test cannot
  // miss the animation when the machine is busy; nothing else in the page is affected.
  await page.addInitScript(() => {
    const original = window.setInterval.bind(window);
    window.setInterval = ((fn: TimerHandler, ms?: number, ...args: unknown[]) =>
      original(fn, ms === 16 ? 160 : ms, ...args)) as typeof window.setInterval;
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/es");
  const w = await openApp(page, "terminal");
  const log = w.getByRole("log", { name: "Salida de la terminal" });
  // while typing, the partial text lives outside the live region
  await expect(w.locator(".tline[aria-hidden='true']")).toBeVisible();
  await expect(log).toContainText("Terminal v1.0", { timeout: 20_000 });
  await expect(w.locator(".tline[aria-hidden='true']")).toHaveCount(0);
});

test("closing the terminal mid-typing keeps the full welcome line", async ({ page }) => {
  // The welcome line is typed with a 16ms interval (~1s). Stretch only that interval so the test cannot
  // miss the animation when the machine is busy; nothing else in the page is affected.
  await page.addInitScript(() => {
    const original = window.setInterval.bind(window);
    window.setInterval = ((fn: TimerHandler, ms?: number, ...args: unknown[]) =>
      original(fn, ms === 16 ? 160 : ms, ...args)) as typeof window.setInterval;
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/es");
  const w = await openApp(page, "terminal");
  await expect(w.locator(".tline[aria-hidden='true']")).toBeVisible();
  await w.getByRole("button", { name: "Cerrar" }).click();
  await expect(win(page, "terminal")).toHaveCount(0);
  const again = await openApp(page, "terminal");
  await expect(again.getByRole("log")).toContainText("Terminal v1.0");
});

test("a failed submit moves focus to the first invalid field", async ({ page }) => {
  const w = await openApp(page, "contact");
  await w.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(w.getByLabel("Nombre")).toBeFocused();
  await w.getByLabel("Nombre").fill("Ana");
  await w.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(w.getByLabel("Correo", { exact: true })).toBeFocused();
});

test.describe("CV download", () => {
  test.skip(!profile.cvUrl, "no CV configured");

  test("the CV file is served as a real PDF", async ({ request }) => {
    const res = await request.get(profile.cvUrl);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("pdf");
    const body = await res.body();
    expect(body.subarray(0, 5).toString()).toBe("%PDF-");
    expect(body.length).toBeGreaterThan(10_000);
  });

  test("the download is offered in About, Contact and Portfolio View", async ({ page }) => {
    for (const id of ["about", "contact"]) {
      const w = await openApp(page, id);
      await expect(w.getByRole("link", { name: /Descargar CV/ })).toHaveAttribute(
        "href",
        profile.cvUrl,
      );
    }
    await page.goto("/en/portfolio");
    await expect(page.getByRole("link", { name: /Download CV/ })).toHaveAttribute(
      "href",
      profile.cvUrl,
    );
  });
});
