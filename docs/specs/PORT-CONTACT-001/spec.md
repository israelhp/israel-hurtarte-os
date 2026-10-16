# PORT-CONTACT-001 — Contact Center

Status: In Review (Phase 4) · Branch: `feature/phase-4-apps`

## Files

src/features/contact/{ContactApp.tsx,mailto.ts}

## Behaviour

Links, CV state, location and a form that opens the visitor's mail client via `mailto:` (decision D5). Validation with `aria-invalid` + `role=alert`, field length limits, control characters flattened so no header injection. The UI says explicitly that nothing is sent from the page.

## Content status

social-links (verified)
