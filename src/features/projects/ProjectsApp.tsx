"use client";

import { Fragment } from "react";
import {
  Button,
  Chip,
  Chips,
  DemoTag,
  Main,
  Note,
  SectionCard,
  Side,
  SideButton,
  Split,
  Status,
} from "@/shared/components";
import { Icon } from "@/shared/icons/Icon";
import { projects } from "@/content/projects";
import { safeHref } from "@/lib/safe-href";
import { useLang, useT } from "@/features/settings/hooks";
import { useApps, type ProjectFilter } from "../apps/store";
import { ProjectCover } from "./ProjectCover";
import { CardStack } from "./CardStack";
import { ProjectLinks } from "./ProjectLinks";
import { ProjectVideo } from "./ProjectVideo";

const FOLDERS: ProjectFilter[] = [
  "all",
  "featured",
  "personal",
  "professional",
  "web",
  "mobile",
  "backend",
  "databases",
  "devops",
];

export function ProjectsApp() {
  const t = useT();
  const lang = useLang();
  const { projectFilter, projectSel, setProjectFilter, setProjectSel } = useApps();
  const folderLabel = (f: ProjectFilter) => t[`f_${f}` as const];
  const items = projects.filter((p) => projectFilter === "all" || p.tags.includes(projectFilter));
  const hasDemo = projects.some((p) => p.status === "demo");
  const sel = projects.find((p) => p.id === projectSel) ?? null;

  return (
    <Split>
      <Side label={t.folders}>
        {/* only folders that contain projects: no dead folders once the demo projects are gone */}
        {FOLDERS.filter((f) => f === "all" || projects.some((p) => p.tags.includes(f))).map((f) => (
          <SideButton
            key={f}
            active={projectFilter === f}
            count={
              f === "all" ? projects.length : projects.filter((p) => p.tags.includes(f)).length
            }
            onClick={() => setProjectFilter(f)}
          >
            <Icon name="folder" />
            {folderLabel(f)}
          </SideButton>
        ))}
      </Side>
      <Main>
        {!sel ? (
          <>
            <div className="toolbar">
              <div className="crumb">
                {t.app_projects} / <b>{folderLabel(projectFilter)}</b>
              </div>
              {hasDemo && <DemoTag>DEMO DATA</DemoTag>}
            </div>
            <div className="pgrid">
              {items.map((p, i) => (
                <article
                  key={p.id}
                  className="pcard"
                  style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                >
                  <ProjectCover cover={p.cover} />
                  <div className="pc-body">
                    <div className="pc-head">
                      <div>
                        <h3 className="pc-name">{p.name}</h3>
                        <div className="pc-cat">{folderLabel(p.primary)}</div>
                      </div>
                      {p.status === "demo" && <DemoTag />}
                    </div>
                    <p className="pc-desc">{p.desc[lang]}</p>
                    <CardStack p={p} />
                    <div className="pc-foot">
                      <Status>{p.statusLabel[lang]}</Status>
                      {/* the buttons stay together; if the card is narrow only the status label drops to its own line */}
                      <div className="pc-actions">
                        <ProjectLinks p={p} size="sm" />
                        <Button variant="primary" size="sm" onClick={() => setProjectSel(p.id)}>
                          {t.view_details}
                          <span className="sr-only"> — {p.name}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {items.length === 0 && <div className="empty">{t.proj_empty}</div>}
            {hasDemo && <Note className="mt-4">{t.demo_note}</Note>}
          </>
        ) : (
          <div className="pd">
            <div>
              <Button size="sm" onClick={() => setProjectSel(null)}>
                <Icon name="arrow-left" />
                {t.back}
              </Button>
            </div>
            <ProjectCover cover={sel.cover} big />
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h2>{sel.name}</h2>
              {sel.status === "demo" && <DemoTag />}
              <Status>{sel.statusLabel[lang]}</Status>
            </div>
            <p>{sel.desc[lang]}</p>
            {sel.video && (
              <ProjectVideo src={sel.video.src} title={t.proj_video} label={t.proj_video_label} />
            )}
            <div className="grid2">
              <SectionCard title={t.objective} headingLevel={3}>
                <p>{sel.objective[lang]}</p>
              </SectionCard>
              <SectionCard title={t.stack} headingLevel={3}>
                <Chips>
                  {sel.stack.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </Chips>
              </SectionCard>
            </div>
            <SectionCard title={t.features} headingLevel={3}>
              <ul>
                {sel.features[lang].map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </SectionCard>
            <div>
              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  color: "var(--label2)",
                }}
              >
                {t.architecture}
              </h3>
              {sel.archNote && <p style={{ margin: "0 0 10px" }}>{sel.archNote[lang]}</p>}
              <div className="arch">{sel.arch}</div>
            </div>
            <SectionCard title={t.challenges} headingLevel={3}>
              <ul>
                {sel.challenges[lang].map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </SectionCard>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <ProjectLinks p={sel} />
              {!safeHref(sel.demoUrl) && !safeHref(sel.repoUrl) && (
                <div className="note">{t.no_links}</div>
              )}
            </div>
          </div>
        )}
      </Main>
    </Split>
  );
}
