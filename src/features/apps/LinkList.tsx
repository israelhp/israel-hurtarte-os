"use client";

import { Button, LinkRow } from "@/shared/components";
import { Icon } from "@/shared/icons/Icon";
import { profile } from "@/content/profile";
import { socialLinks } from "@/content/social-links";
import { safeHref } from "@/lib/safe-href";
import type { Dictionary } from "@/i18n";
import { useT } from "@/features/settings/hooks";

const linkLabel = (id: string, fallback: string, t: Dictionary) =>
  id === "email" ? t.form_email : id === "website" ? t.link_website : fallback;

/** Contact links from `src/content/social-links.ts`. Unconfigured entries show "Not configured". */
export function LinkList({ withLocation }: { withLocation?: boolean }) {
  const t = useT();
  return (
    <>
      {socialLinks.map((l) => {
        const href = safeHref(l.href);
        const ok = Boolean(l.value && href);
        const external = ok && !href!.startsWith("mailto:");
        return (
          <LinkRow key={l.id} label={linkLabel(l.id, l.label, t)}>
            {ok ? (
              <a
                href={href!}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {l.value}
              </a>
            ) : (
              <span className="nc">{t.not_configured}</span>
            )}
          </LinkRow>
        );
      })}
      {withLocation && (
        <LinkRow label={t.location}>
          <span>{profile.location}</span>
        </LinkRow>
      )}
    </>
  );
}

/** Download-CV button; disabled with an honest label while no CV URL is configured. */
export function CvButton({ primary }: { primary?: boolean }) {
  const t = useT();
  const href = safeHref(profile.cvUrl);
  if (href)
    return (
      <Button href={href} variant={primary ? "primary" : "default"}>
        <Icon name="download" />
        {t.cv}
      </Button>
    );
  return (
    <Button disabled title={t.not_configured}>
      <Icon name="download" />
      {t.cv} · {t.not_configured}
    </Button>
  );
}
