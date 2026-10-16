"use client";

import { useDeferredValue } from "react";
import {
  DemoTag,
  Detail,
  Main,
  Mono,
  SearchField,
  Side,
  SideButton,
  Split,
} from "@/shared/components";
import { Icon } from "@/shared/icons/Icon";
import { categories, categoryDescriptions, skills } from "@/content/skills";
import { projects } from "@/content/projects";
import type { CategoryId } from "@/content/types";
import { useLang, useT } from "@/features/settings/hooks";
import { cn } from "@/lib/cn";
import { useApps } from "../store";

type StackNavItem = { id: "all" | CategoryId; short: string; label: string; count: number };

export function StackApp() {
  const t = useT();
  const lang = useLang();
  const { stackCat, stackQuery, stackSel, setStackCat, setStackQuery, setStackSel, openProject } =
    useApps();

  const catName = (id: string) => categories.find((c) => c.id === id)?.label[lang] ?? "";
  // Typing stays instant; the 30+ cards re-filter at lower priority (keeps keystrokes well under 200ms on slow CPUs).
  const q = useDeferredValue(stackQuery).trim().toLowerCase();
  const items = skills.filter(
    (k) =>
      (stackCat === "all" || k.cat === stackCat) &&
      (!q || k.name.toLowerCase().includes(q) || k.desc[lang].toLowerCase().includes(q)),
  );
  // The prototype wording says "demo projects"; once real projects replace them the neutral wording is used.
  const hasDemo = projects.some((p) => p.status === "demo");
  const sel = skills.find((k) => k.name === stackSel) ?? null;
  const related = sel ? projects.filter((p) => p.stack.includes(sel.name)) : [];

  return (
    <Split>
      <Side label={t.categories}>
        {([{ id: "all", short: "∗", label: t.all, count: skills.length }] as StackNavItem[])
          .concat(
            categories.map((c) => ({
              id: c.id,
              short: c.short,
              label: c.label[lang],
              count: skills.filter((k) => k.cat === c.id).length,
            })),
          )
          .map((c) => (
            <SideButton
              key={c.id}
              active={stackCat === c.id}
              count={c.count}
              onClick={() => setStackCat(c.id)}
            >
              <Mono category={c.id} className="side-mono">
                {c.short}
              </Mono>
              {c.label}
            </SideButton>
          ))}
      </Side>
      <Main>
        <SearchField
          label={t.stack_search}
          value={stackQuery}
          onChange={(e) => setStackQuery(e.target.value)}
        />
        <div className="toolbar">
          <div className="crumb">
            {t.app_stack} / <b>{stackCat === "all" ? t.all : catName(stackCat)}</b>
          </div>
          <span className="muted" style={{ fontSize: 12 }}>
            {items.length} {t.techs}
          </span>
        </div>
        <div className="tgrid">
          {items.map((k, i) => (
            <button
              key={k.name}
              type="button"
              className={cn("tcard", stackSel === k.name && "on")}
              aria-pressed={stackSel === k.name}
              style={{ animationDelay: `${Math.min(i, 12) * 25}ms` }}
              onClick={() => setStackSel(k.name)}
            >
              <div className="tc-top">
                <Mono category={k.cat}>{k.mono}</Mono>
                <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span className="tc-name">{k.name}</span>
                  <span className="tc-cat">{catName(k.cat)}</span>
                </div>
              </div>
              <p className="tc-desc">{k.desc[lang]}</p>
            </button>
          ))}
        </div>
        {items.length === 0 && <div className="empty">{t.stack_empty}</div>}
      </Main>
      <Detail has={Boolean(sel)} aria-label={sel?.name}>
        {sel ? (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="icon-btn detail-x"
                onClick={() => setStackSel(null)}
                aria-label={t.close}
              >
                <Icon name="x" />
              </button>
            </div>
            <div className="dt-h">
              <Mono category={sel.cat} large>
                {sel.mono}
              </Mono>
              <div>
                <h3>{sel.name}</h3>
                <span className="tc-cat">{catName(sel.cat)}</span>
              </div>
            </div>
            <p className="dt-p">{sel.desc[lang]}</p>
            <div className="h-eyebrow" style={{ marginBottom: 8 }}>
              {t.stack_where}
            </div>
            <p className="dt-p">{categoryDescriptions[sel.cat][lang]}</p>
            <div className="h-eyebrow" style={{ marginBottom: 8 }}>
              {hasDemo ? t.stack_related : t.stack_related_real}
            </div>
            {related.map((p) => (
              <button key={p.id} type="button" className="rel" onClick={() => openProject(p.id)}>
                <span
                  className={`cover cv-${p.cover}`}
                  style={{ width: 28, height: 28, borderRadius: 7 }}
                />
                <span style={{ flex: 1 }}>{p.name}</span>
                {p.status === "demo" && <DemoTag />}
              </button>
            ))}
            {related.length === 0 && (
              <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>
                {hasDemo ? t.stack_none : t.stack_none_real}
              </p>
            )}
          </>
        ) : (
          <div className="empty" style={{ paddingTop: 80 }}>
            <Icon
              name="layers"
              style={{ width: 32, height: 32, color: "var(--label3)", marginBottom: 10 }}
            />
            <div>{t.stack_select}</div>
          </div>
        )}
      </Detail>
    </Split>
  );
}
