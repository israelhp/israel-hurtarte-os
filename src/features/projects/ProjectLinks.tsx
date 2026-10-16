"use client";

import { Button } from "@/shared/components";
import type { Project } from "@/content/types";
import { safeHref } from "@/lib/safe-href";
import { useT } from "@/features/settings/hooks";

/**
 * Website / repository buttons of a project. Only safe URLs are rendered. Demo projects have a "Demo" link; a
 * published project's link is simply its website.
 */
export function ProjectLinks({ p, size }: { p: Project; size?: "sm" }) {
  const t = useT();
  const demo = safeHref(p.demoUrl);
  const repo = safeHref(p.repoUrl);
  return (
    <>
      {demo && (
        <Button href={demo} size={size}>
          {(p.linkKind ?? (p.status === "verified" ? "website" : "demo")) === "website"
            ? t.link_website
            : t.demo}
        </Button>
      )}
      {repo && (
        <Button href={repo} size={size}>
          {t.github}
        </Button>
      )}
    </>
  );
}
