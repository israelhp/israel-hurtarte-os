import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Finder-like layout: sidebar, main, optional detail pane. Adapts via container queries. */
export function Split({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("split", className)} {...rest} />;
}

export function Side({ label, children }: { label: string; children: ReactNode }) {
  return (
    <nav className="side" aria-label={label}>
      <div className="side-h">{label}</div>
      {children}
    </nav>
  );
}

export function SideButton({
  active,
  count,
  children,
  ...rest
}: { active?: boolean; count?: number } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn("side-btn", active && "on")}
      aria-current={active ? "true" : undefined}
      {...rest}
    >
      {children}
      {count !== undefined && <span className="cnt">{count}</span>}
    </button>
  );
}

export function Main({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("main", className)} {...rest} />;
}

export function Detail({
  has,
  className,
  ...rest
}: { has?: boolean } & HTMLAttributes<HTMLElement>) {
  return <aside className={cn("detail", has && "has", className)} {...rest} />;
}
