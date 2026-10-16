import type { ReactNode } from "react";
import { Icon } from "../icons/Icon";
import { cn } from "@/lib/cn";

/** Neutral informational note (prototype `.note`). */
export function Note({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("note", className)}>
      <Icon name="info" />
      <span>{children}</span>
    </div>
  );
}

/** Colored banner; `ok` switches to the success tone. Announces to assistive tech. */
export function Banner({
  children,
  ok,
  className,
}: {
  children: ReactNode;
  ok?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("banner", ok && "ok", className)} role={ok ? "status" : undefined}>
      <Icon name="info" />
      <span>{children}</span>
    </div>
  );
}
