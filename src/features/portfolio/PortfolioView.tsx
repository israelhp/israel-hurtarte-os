"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { Button, Chip, Chips, DemoTag, Mono, SectionCard, Status } from "@/shared/components";
import { Icon } from "@/shared/icons/Icon";
import { SITE } from "@/lib/site";
import { certifications } from "@/content/certifications";
import { education } from "@/content/education";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { categories, skills } from "@/content/skills";
import { CvButton, LinkList } from "@/features/apps/LinkList";
import { useApps } from "@/features/apps/store";
import { ProjectCover } from "@/features/projects/ProjectCover";
import { useLang, useT } from "@/features/settings/hooks";
import { LangSwitch } from "@/features/settings/LangSwitch";
import { ThemeToggle } from "@/features/settings/ThemeToggle";
import { useWm } from "@/features/window-manager/store";
import type { AppId } from "@/shared/app-ids";

/** Classic scrolling version of the portfolio: the same content as the desktop windows, one section after another. */
export function PortfolioView() {
  const t = useT();
  const lang = useLang();
  const router = useRouter();
  const desktopHref = `/${lang}`;

  /** Jump to the desktop with a window already open. */
  const openOnDesktop = (id: AppId, project?: string) => {
    if (project) useApps.getState().openProject(project);
    else useWm.getState().open(id);
    router.push(desktopHref);
  };

  const sections: { id: string; label: string }[] = [
    { id: "p-about", label: t.app_about },
    { id: "p-skills", label: t.app_stack },
    { id: "p-projects", label: t.app_projects },
    { id: "p-experience", label: t.app_experience },
    { id: "p-education", label: t.app_education },
    { id: "p-certs", label: t.app_certs },
    { id: "p-contact", label: t.app_contact },
  ];
  const groups = [
    { label: t.exp_work, items: experience.filter((e) => e.type === "work") },
    { label: t.exp_indep, items: experience.filter((e) => e.type !== "work") },
  ];
  const eyebrow = (n: number, label: string) => `${String(n).padStart(2, "0")} · ${label}`;

  return (
    <div className="os">
      <div className="pf">
        <header className="pf-nav">
          <Link href={desktopHref} className="logo">
            <span className="logo-dot" />
            <span className="logo-full">{SITE.name}</span>
            <span className="logo-short">IH.OS</span>
            <span className="sr-only"> — {t.desktop_mode}</span>
          </Link>
          <nav className="pf-links" aria-label={t.portfolio_nav}>
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.label}
              </a>
            ))}
          </nav>
          <span className="tb-spacer" />
          <LangSwitch />
          <ThemeToggle />
          <Link href={desktopHref} className="pv-btn" aria-label={t.desktop_mode}>
            <Icon name="monitor" />
            <span>{t.desktop_mode}</span>
          </Link>
        </header>

        <div className="pf-wrap">
          <main>
            <div className="hero">
              <div className="h-eyebrow" style={{ position: "relative" }}>
                {SITE.name} · {profile.location}
              </div>
              <h1>
                {profile.name}
                <br />
                <span
                  style={{
                    background: "linear-gradient(120deg, var(--label) 20%, var(--acc))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {profile.role[lang]}
                </span>
              </h1>
              <p>{profile.tagline[lang]}</p>
              <div className="w-btns">
                <Button href="#p-projects" variant="primary">
                  {t.btn_explore}
                </Button>
                <Button href="#p-contact">{t.get_in_touch}</Button>
                <Link href={desktopHref} className="btn">
                  {t.desktop_mode}
                </Link>
              </div>
            </div>

            <section className="pf-sec" id="p-about" aria-labelledby="h-about">
              <div className="h-eyebrow">{eyebrow(1, t.app_about)}</div>
              <h2 id="h-about">{t.w_about}</h2>
              <div className="grid2" style={{ alignItems: "start" }}>
                <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                  <div className="avatar" aria-hidden="true" style={{ flex: "none" }}>
                    {profile.initials}
                  </div>
                  <p
                    className="body-txt"
                    style={{ margin: 0, fontSize: 15, whiteSpace: "pre-line" }}
                  >
                    {profile.bio[lang]}
                  </p>
                </div>
                <SectionCard title={t.about_spec} headingLevel={3}>
                  <Chips>
                    {profile.specialties[lang].map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </Chips>
                </SectionCard>
              </div>
            </section>

            <section className="pf-sec" id="p-skills" aria-labelledby="h-skills">
              <div className="h-eyebrow">{eyebrow(2, t.app_stack)}</div>
              <h2 id="h-skills">{t.w_stack}</h2>
              {categories.map((c) => (
                <div key={c.id} className="sk-group">
                  <h3>{c.label[lang]}</h3>
                  <Chips>
                    {skills
                      .filter((k) => k.cat === c.id)
                      .map((k) => (
                        <Chip key={k.name}>
                          <Mono category={c.id} className="chip-mono">
                            {k.mono}
                          </Mono>
                          {k.name}
                        </Chip>
                      ))}
                  </Chips>
                </div>
              ))}
            </section>

            <section className="pf-sec" id="p-projects" aria-labelledby="h-projects">
              <div className="h-eyebrow">{eyebrow(3, t.app_projects)}</div>
              <h2 id="h-projects">
                {t.w_projects}{" "}
                {projects.some((p) => p.status === "demo") && <DemoTag>DEMO</DemoTag>}
              </h2>
              <div className="pgrid">
                {projects.map((p) => (
                  <article key={p.id} className="pcard">
                    <ProjectCover cover={p.cover} />
                    <div className="pc-body">
                      <div className="pc-head">
                        <div>
                          <h3 className="pc-name">{p.name}</h3>
                          <div className="pc-cat">{t[`f_${p.primary}` as const]}</div>
                        </div>
                        <Status>{p.statusLabel[lang]}</Status>
                      </div>
                      <p className="pc-desc">{p.desc[lang]}</p>
                      <Chips>
                        {p.stack.map((s) => (
                          <Chip key={s}>{s}</Chip>
                        ))}
                      </Chips>
                      <div className="pc-foot">
                        <Button size="sm" onClick={() => openOnDesktop("projects", p.id)}>
                          {t.view_details}
                          <span className="sr-only"> — {p.name}</span>
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="pf-sec" id="p-experience" aria-labelledby="h-experience">
              <div className="h-eyebrow">{eyebrow(4, t.app_experience)}</div>
              <h2 id="h-experience">{t.w_experience}</h2>
              {groups.map((g) => (
                <Fragment key={g.label}>
                  <div className="grp-h">
                    <h3>{g.label}</h3>
                  </div>
                  <div className="tl">
                    {g.items.map((e) => {
                      const tech = [...new Set(e.techGroups.flatMap((tg) => tg.items))];
                      return (
                        <div key={e.id} className="tl-item card" style={{ padding: 16 }}>
                          <span className="tl-dot" />
                          <h4 style={{ margin: 0, fontSize: 16 }}>{e.role[lang]}</h4>
                          <div className="tl-meta" style={{ marginBottom: 8 }}>
                            {e.company} · {e.dates[lang]}
                          </div>
                          <p className="body-txt" style={{ margin: "0 0 10px", fontSize: 13.5 }}>
                            {e.desc[lang]}
                          </p>
                          <Chips>
                            {tech.map((x) => (
                              <Chip key={x}>{x}</Chip>
                            ))}
                          </Chips>
                        </div>
                      );
                    })}
                  </div>
                </Fragment>
              ))}
            </section>

            <section className="pf-sec" id="p-education" aria-labelledby="h-education">
              <div className="h-eyebrow">{eyebrow(5, t.app_education)}</div>
              <h2 id="h-education">{t.w_education}</h2>
              <div className="egrid">
                {education.map((e) => (
                  <div key={`${e.school}-${e.program.en}`} className="card ecard">
                    <Status style={{ alignSelf: "flex-start" }}>{e.progress[lang]}</Status>
                    <h3>{e.program[lang]}</h3>
                    <div className="muted">
                      {e.school} · {e.dates[lang]}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="pf-sec" id="p-certs" aria-labelledby="h-certs">
              <div className="h-eyebrow">{eyebrow(6, t.app_certs)}</div>
              <h2 id="h-certs">{t.w_certs}</h2>
              <div className="egrid">
                {certifications.map((c) => (
                  <div key={`${c.cat}-${c.name}`} className="card ecard cert">
                    {c.status === "placeholder" && (
                      <DemoTag style={{ alignSelf: "flex-start" }}>PLACEHOLDER</DemoTag>
                    )}
                    <h3>{c.name}</h3>
                    <div className="muted">
                      {c.org} · {c.date}
                    </div>
                    <div className="kv">
                      <span>{t.cert_link}</span>
                      <span className="nc">{t.not_configured}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="pf-sec" id="p-contact" aria-labelledby="h-contact">
              <div className="h-eyebrow">{eyebrow(7, t.app_contact)}</div>
              <h2 id="h-contact">{t.contact_lead}</h2>
              <div className="grid2">
                <div className="card sect">
                  <LinkList withLocation />
                </div>
                <div
                  className="card sect"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    justifyContent: "center",
                  }}
                >
                  <p className="muted" style={{ margin: 0 }}>
                    {t.contact_sub}
                  </p>
                  <div className="w-btns">
                    <Button variant="primary" onClick={() => openOnDesktop("contact")}>
                      {t.w_contact}
                    </Button>
                    <Button onClick={() => openOnDesktop("terminal")}>{t.app_terminal}</Button>
                    <CvButton />
                  </div>
                </div>
              </div>
            </section>
          </main>

          <footer className="pf-foot" suppressHydrationWarning>
            © {new Date().getFullYear()} {profile.name} · {SITE.name} — {t.footer}
          </footer>
        </div>
      </div>
    </div>
  );
}
