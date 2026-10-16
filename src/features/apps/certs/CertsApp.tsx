"use client";

import { Card, DemoTag, FilterPills, Note } from "@/shared/components";
import { Icon } from "@/shared/icons/Icon";
import { certCategories, certifications } from "@/content/certifications";
import { safeHref } from "@/lib/safe-href";
import { useLang, useT } from "@/features/settings/hooks";
import { useApps } from "../store";

export function CertsApp() {
  const t = useT();
  const lang = useLang();
  const { certCat, setCertCat } = useApps();
  const items = certifications.filter((c) => certCat === "all" || c.cat === certCat);
  const catLabel = (id: string) => certCategories.find((c) => c.id === id)?.label[lang] ?? id;

  return (
    <div className="pad">
      <FilterPills
        label={t.categories}
        value={certCat}
        onChange={setCertCat}
        options={certCategories.map((c) => ({ value: c.id, label: c.label[lang] }))}
      />
      <div className="egrid">
        {items.map((c, i) => {
          const link = safeHref(c.link);
          return (
            <Card
              key={`${c.cat}-${c.name}`}
              className="ecard cert"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <span className="e-ico">
                  <Icon name="award" />
                </span>
                {c.status === "placeholder" && <DemoTag>PLACEHOLDER</DemoTag>}
              </div>
              <h2 style={{ margin: 0, fontSize: 16 }}>{c.name}</h2>
              <div className="muted" style={{ fontSize: 13 }}>
                {c.org}
              </div>
              <div>
                <div className="kv">
                  <span>{t.cert_cat}</span>
                  <span>{catLabel(c.cat)}</span>
                </div>
                <div className="kv">
                  <span>{t.cert_date}</span>
                  <span>{c.date}</span>
                </div>
                <div className="kv">
                  <span>{t.cert_link}</span>
                  {link ? (
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {t.cert_link}
                    </a>
                  ) : (
                    <span className="nc">{t.not_configured}</span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {certifications.some((c) => c.status === "placeholder") && (
        <Note className="mt-4">{t.cert_note}</Note>
      )}
    </div>
  );
}
