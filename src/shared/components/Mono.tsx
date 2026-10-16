import { cn } from "@/lib/cn";

export type Category = "all" | "frontend" | "backend" | "mobile" | "databases" | "devops";

/** Two-letter technology monogram tinted by category. */
export function Mono({
  children,
  category,
  large,
  className,
}: {
  children: string;
  category: Category;
  large?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("mono", `c-${category}`, large && "lg", className)} aria-hidden="true">
      {children}
    </span>
  );
}
