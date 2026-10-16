import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type Tone = "green" | "blue" | "orange" | "red" | "purple" | "teal" | "indigo" | "gray";

const tone = (t?: Tone): CSSProperties | undefined =>
  t ? ({ "--cc": `var(--${t})` } as CSSProperties) : undefined;

/** Pill status label (prototype `.status`, green by default). */
export function Status({
  tone: t,
  style,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return <span className="status" style={{ ...tone(t), ...style }} {...rest} />;
}

/** DEMO / PLACEHOLDER marker that keeps unverified content honest. */
export function DemoTag({ children = "DEMO", ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className="demo-tag" {...rest}>
      {children}
    </span>
  );
}

export function Kbd(props: HTMLAttributes<HTMLElement>) {
  return <kbd className="kbd" {...props} />;
}

export function Eyebrow({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-eyebrow", className)} {...rest} />;
}
