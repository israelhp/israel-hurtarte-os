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
