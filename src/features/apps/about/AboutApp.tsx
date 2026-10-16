"use client";

import { Chip, Chips, SectionCard } from "@/shared/components";
import { Icon } from "@/shared/icons/Icon";
import { profile } from "@/content/profile";
import { useLang, useT } from "@/features/settings/hooks";
import { CvButton, LinkList } from "../LinkList";

export function AboutApp() {
  const t = useT();
  const lang = useLang();
  return (
    <div className="about">
      <div className="prof">
        <div className="avatar" aria-hidden="true">
          {profile.initials}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 200 }}>
          <h2>{profile.name}</h2>
          <div className="body-txt" style={{ fontSize: 15 }}>
            {profile.role[lang]}
          </div>
          <div className="w-meta">
            <Icon name="map-pin" />
            {profile.location}
          </div>
        </div>
        <CvButton primary />
      </div>
      <SectionCard title={t.about_bio} headingLevel={3}>
        <p className="body-txt" style={{ margin: 0, whiteSpace: "pre-line" }}>
          {profile.bio[lang]}
        </p>
      </SectionCard>
      <div className="grid2">
        <SectionCard title={t.about_spec} headingLevel={3}>
          <Chips>
            {profile.specialties[lang].map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </Chips>
        </SectionCard>
        <SectionCard title={t.about_links} headingLevel={3}>
          <LinkList />
        </SectionCard>
      </div>
    </div>
  );
}
