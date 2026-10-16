import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card", className)} {...rest} />;
}

/** Padded card with an uppercase section heading (prototype `.card.sect`). */
export function SectionCard({
  title,
  children,
  className,
  headingLevel = 4,
}: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  /** Pick the level that follows the parent heading (avoids skipped levels). */
  headingLevel?: 2 | 3 | 4;
}) {
  const Heading = `h${headingLevel}` as const;
  return (
    <section className={cn("card sect", className)}>
      <Heading>{title}</Heading>
      {children}
    </section>
  );
}

export function LinkRow({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="link-row">
      <span className="lbl">{label}</span>
      {children}
    </div>
  );
}
