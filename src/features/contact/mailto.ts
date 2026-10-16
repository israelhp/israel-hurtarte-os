export const FIELD_LIMITS = { name: 80, email: 120, message: 1500 } as const;

export type ContactInput = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactInput, true>>;

// Pragmatic check: something@something.tld without spaces. The mail client does the real validation.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Collapse line breaks and control characters so a field can never inject extra mail headers. */
const oneLine = (s: string) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();

export function validateContact(v: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  if (!oneLine(v.name)) errors.name = true;
  if (!EMAIL.test(oneLine(v.email))) errors.email = true;
  if (!v.message.trim()) errors.message = true;
  return errors;
}

/** Build a mailto: URL. Nothing is sent from the page; the visitor's mail client opens with the draft. */
export function buildMailto(to: string, subject: string, v: ContactInput): string {
  const name = oneLine(v.name).slice(0, FIELD_LIMITS.name);
  const email = oneLine(v.email).slice(0, FIELD_LIMITS.email);
  const message = v.message.slice(0, FIELD_LIMITS.message);
  const body = `${message}\n\n— ${name} (${email})`;
  return `mailto:${to}?subject=${encodeURIComponent(oneLine(subject))}&body=${encodeURIComponent(body)}`;
}
