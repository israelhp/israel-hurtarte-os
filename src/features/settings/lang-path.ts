import { LANGS, type Lang } from "@/i18n";

/** `/es/portfolio` + `en` → `/en/portfolio`. Paths without a language prefix get one. */
export function swapLangPath(pathname: string, next: Lang): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length && (LANGS as readonly string[]).includes(parts[0])) parts[0] = next;
  else parts.unshift(next);
  return "/" + parts.join("/");
}
