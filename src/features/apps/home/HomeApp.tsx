"use client";

import { Button, Kbd } from "@/shared/components";
import { Icon } from "@/shared/icons/Icon";
import { SITE } from "@/lib/site";
import { profile } from "@/content/profile";
import { useLang, useT } from "@/features/settings/hooks";
import { useWm } from "@/features/window-manager/store";

export function HomeApp() {
  const t = useT();
  const lang = useLang();
  const open = useWm((s) => s.open);
  return (
    <div className="welcome">
      <div className="h-eyebrow">{t.welcome_eyebrow}</div>
      <h2 className="wm">{SITE.name}</h2>
      <p className="w-role">{profile.role[lang]}</p>
      <blockquote className="w-quote">“{profile.tagline[lang]}”</blockquote>
      <div className="w-meta">
        <Icon name="map-pin" />
        <span>
          {t.location}: {profile.location}
        </span>
      </div>
      <p className="w-intro">{t.welcome_intro}</p>
      <div className="w-btns">
        <Button variant="primary" onClick={() => open("projects")}>
          <Icon name="folder" />
          {t.btn_explore}
        </Button>
        <Button onClick={() => open("stack")}>
          <Icon name="layers" />
          {t.btn_skills}
        </Button>
        <Button onClick={() => open("about")}>
          <Icon name="user" />
          {t.btn_about}
        </Button>
      </div>
      <div className="w-meta">
        {t.tip_a} <Kbd>help</Kbd> {t.tip_b}
      </div>
    </div>
  );
}
