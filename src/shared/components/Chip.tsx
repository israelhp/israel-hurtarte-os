import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Chip({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("chip", className)} {...rest} />;
}

export function Chips({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("chips", className)}>{children}</div>;
}
