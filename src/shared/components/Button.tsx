import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Common = { variant?: "default" | "primary"; size?: "md" | "sm"; children: ReactNode };
type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: AsButton | AsLink) {
  const { variant = "default", size = "md", className, children, ...rest } = props;
  const cls = cn("btn", variant === "primary" && "primary", size === "sm" && "sm", className);
  if ("href" in props && props.href !== undefined) {
    const { href, ...anchor } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    const external = /^https?:/.test(href ?? "");
    return (
      <a
        className={cls}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...anchor}
      >
        {children}
      </a>
    );
  }
  const { type = "button", ...button } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={cls} type={type} {...button}>
      {children}
    </button>
  );
}
