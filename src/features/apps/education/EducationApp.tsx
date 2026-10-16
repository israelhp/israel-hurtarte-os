"use client";

import { Card, DemoTag, Status } from "@/shared/components";
import { Icon } from "@/shared/icons/Icon";
import { education } from "@/content/education";
import { useLang, useT } from "@/features/settings/hooks";

export function EducationApp() {
  const t = useT();
  const lang = useLang();
  return (
    <div className="pad">
      <div className="egrid">
        {education.map((e) => (
          <Card key={`${e.school}-${e.program.en}`} className="ecard">
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
            >
              <span className="e-ico">
                <Icon name="graduation" />
              </span>
              {e.status === "verified" ? <Status>{e.progress[lang]}</Status> : <DemoTag />}
            </div>
            <h2 style={{ margin: 0, fontSize: 16 }}>{e.program[lang]}</h2>
            <div className="muted" style={{ fontSize: 13 }}>
              {e.school}
            </div>
            {e.desc && (
              <p className="body-txt" style={{ margin: 0, fontSize: 13 }}>
                {e.desc[lang]}
              </p>
            )}
            <div style={{ marginTop: "auto" }}>
              <div className="kv">
                <span>{t.edu_degree}</span>
                <span>{e.degree[lang]}</span>
              </div>
              <div className="kv">
                <span>{t.edu_dates}</span>
                <span>{e.dates[lang]}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
