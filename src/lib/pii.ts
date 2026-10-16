/**
 * Privacy guard helpers (used by tests, never by the shipped UI).
 *
 * The owner's CV contains a phone number and the contact data of third-party references. The site must publish
 * none of it. This is a heuristic safety net, not proof: it looks for anything shaped like a phone number and for
 * the words "references"; it cannot recognise a person's name.
 */

/**
 * Phone-like runs: digit groups separated by spaces, dots, dashes or parentheses (optionally with a leading `+`)
 * whose digits add up to 7 or more. Catches 4+4, 2+2+2+2, 3+3+2, `+50255123456`, `(502) 5512-3456`…
 *
 * Web addresses are skipped (they can hold long numeric ids), but `tel:`, `sms:`, `wa.me` and WhatsApp links are
 * always flagged. It is intentionally strict, so it also flags a year range written with a plain hyphen (`2018-2024`).
 * Write ranges with an en dash (`2018 – 2024`) or words, which the detector ignores.
 */
export function findPhoneLike(text: string): string[] {
  const hits: string[] = [];
  // Phone-bearing links are never acceptable, whatever digits they hold.
  for (const m of text.match(/\b(?:tel:|sms:)\S*|\S*(?:wa\.me|whatsapp)\S*/gi) ?? [])
    hits.push(m.trim());
  // Ordinary web addresses legitimately contain long numeric ids (a LinkedIn profile slug); look at the rest.
  const rest = text.replace(/https?:\/\/[^\s"'<>]+/gi, " ");
  const runs = rest.match(/\+?\(?\d[\d\s.\-()]{5,}\d/g) ?? [];
  return [...hits, ...runs.map((r) => r.trim()).filter((r) => r.replace(/\D/g, "").length >= 7)];
}

/** Headings or labels that would introduce a list of references. */
export const REFERENCE_WORDS =
  /referencias (personales|laborales)|(personal|work|professional) references/i;
