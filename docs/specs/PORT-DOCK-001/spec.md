# PORT-DOCK-001 — Dock

Status: In Review (Phase 3) · Branch: `feature/phase-3-desktop-shell`

## Goal

Dock with the 9 apps, hover magnification, tooltips, running/minimized indicators and mobile bar.

## Scope

- `src/features/dock/Dock.tsx`: 9 items, separator before Terminal, `aria-current` on the active window, sr-only state ("abierta"/"minimizada").
- Hover magnification via CSS only (prototype `:has()` rules).
- <=760px: bottom bar with visible labels, scrollable, no magnification (prototype responsive rules).

## Content status

Shell labels only; app contents are Phase 4 placeholders (no personal data shown).
