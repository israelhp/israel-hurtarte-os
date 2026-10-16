import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";

const BARS = [40, 75, 55, 90, 65, 80, 50];

/** Decorative project cover (prototype `.cover` mock UI). */
export function ProjectCover({ cover, big }: { cover: Project["cover"]; big?: boolean }) {
  const bars = big ? BARS : BARS.slice(0, 5);
  return (
    <div className={cn("cover", big && "big", `cv-${cover}`)} aria-hidden="true">
      <div className="cv-ui">
        <div className="cv-dots">
          <i />
          <i />
          <i />
        </div>
        <div className="cv-row">
          <i className="a" />
          <i />
          {big && <i />}
        </div>
        <div className="cv-bars" style={big ? { height: 54 } : undefined}>
          {bars.map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="cv-row">
          <i />
          <i className="a" />
          {!big && <i />}
        </div>
      </div>
    </div>
  );
}
