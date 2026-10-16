"use client";

import { useState } from "react";
import { SectionCard } from "@/shared/components";

/**
 * Screen recording of an unpublished project. The file lives in public/videos/; if it is not there (yet) the whole
 * section is hidden instead of showing a broken player. Never autoplays; only metadata is fetched until the visitor
 * presses play.
 */
export function ProjectVideo({ src, title, label }: { src: string; title: string; label: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <SectionCard title={title} headingLevel={3}>
      <video
        className="pd-video"
        src={src}
        controls
        playsInline
        preload="metadata"
        aria-label={label}
        onError={() => setFailed(true)}
      />
    </SectionCard>
  );
}
