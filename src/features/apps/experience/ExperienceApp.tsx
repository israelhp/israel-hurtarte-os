"use client";

import { Fragment } from "react";
import { Chip, Chips, DemoTag, Eyebrow, Status } from "@/shared/components";
import { Icon } from "@/shared/icons/Icon";
import { experience } from "@/content/experience";
import { useLang, useT } from "@/features/settings/hooks";
import { cn } from "@/lib/cn";
import { useApps } from "../store";

export function ExperienceApp() {
  const t = useT();
  const lang = useLang();
  const { expOpen, toggleExp } = useApps();
  const groups = [
    { label: t.exp_work, items: experience.filter((e) => e.type === "work") },
    { label: t.exp_indep, items: experience.filter((e) => e.type !== "work") },
  ];
  const hasDemo = experience.some((e) => e.status === "demo");

  return (
    <div className="pad">
      {hasDemo && (
        <div className="note" style={{ marginBottom: 20 }}>
          <DemoTag />
          {t.demo_entries}
        </div>
      )}
      {groups.map((g) => (
        <Fragment key={g.label}>
          <div className="grp-h">
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{g.label}</h2>
            <Chip>{g.items.length}</Chip>
          </div>
          <div className="tl">
            {g.items.map((e) => {
              const open = Boolean(expOpen[e.id]);
              const bodyId = `exp-${e.id}`;
              return (
                <div key={e.id} className="tl-item card">
                  <span className="tl-dot" />
                  <button
                    type="button"
                    className="tl-head"
                    aria-expanded={open}
                    aria-controls={open ? bodyId : undefined}
                    onClick={() => toggleExp(e.id)}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                      <div
                        style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}
                      >
                        <h3>{e.role[lang]}</h3>
                        {e.current && <Status>{t.exp_current}</Status>}
                        {e.status === "demo" && <DemoTag />}
                      </div>
                      <span className="tl-meta">
                        {e.company} · {e.dates[lang]}
                      </span>
                    </div>
                    <Icon name="chevron-down" className={cn("chev", open && "open")} />
                  </button>
                  {open && (
                    <div className="tl-body" id={bodyId}>
                      <p>{e.desc[lang]}</p>
                      <div>
                        <Eyebrow style={{ marginBottom: 6 }}>{t.exp_resp}</Eyebrow>
                        <ul>
                          {e.resp[lang].map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                      </div>
                      {e.ach[lang].length > 0 && (
                        <div className="ach">
                          <Eyebrow style={{ marginBottom: 6 }}>
                            {e.achLabel ? e.achLabel[lang] : t.exp_ach}
                          </Eyebrow>
                          <ul>
                            {e.ach[lang].map((a) => (
                              <li key={a}>{a}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div>
                        <Eyebrow style={{ marginBottom: 8 }}>{t.exp_tech}</Eyebrow>
                        <div className="tech-groups">
                          {e.techGroups.map((tg) => (
                            <div key={tg.label.en} className="tech-g">
                              <span className="tech-gl">{tg.label[lang]}</span>
                              <Chips>
                                {tg.items.map((i) => (
                                  <Chip key={i}>{i}</Chip>
                                ))}
                              </Chips>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
