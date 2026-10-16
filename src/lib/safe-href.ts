/** Only http(s) and mailto links are rendered as links; anything else (javascript:, data:, …) is dropped. */
export function safeHref(href: string): string | null {
  const value = href.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? value : null;
  } catch {
    return null;
  }
}

/**
 * Same-site file path such as `/cv/file.pdf`: starts with a single `/`, only URL-safe characters, no `..`.
 * (`safeHref` rejects these because they are not absolute URLs.)
 */
export function safeLocalPath(path: string): string | null {
  const value = path.trim();
  return /^\/(?!\/)[\w\-./]+$/.test(value) && !value.includes("..") ? value : null;
}
