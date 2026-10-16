# DS-001 — Design system (tokens, fonts, icons, base components)

Status: In Review (Phase 2) · Branch: `feature/DS-design-system`

## Goal

Port the prototype's visual language into reusable, accessible building blocks so later phases (shell, windows, apps) never re-derive styles.

## In scope

- Tokens: dark/light palettes, 8 accents, desktop gradients (`src/shared/theme/tokens.css`), motion keyframes and reduced-motion rule (`base.css`).
- Fonts: Geist and Geist Mono via `next/font` (self-hosted at build time).
- Icons: 27 stroke icons in `src/shared/icons/Icon.tsx`.
- Components (`src/shared/components`): Button, Chip/Chips, Status/DemoTag/Kbd/Eyebrow, Card/SectionCard/LinkRow, Segmented, FilterPills, Banner/Note, Field, SearchField, Split/Side/SideButton/Main/Detail, AppTile, Mono, AccentPicker.
- Internal catalog at `/design-system` (noindex; exempt from i18n because it is not product UI).

## Out of scope

Window, TitleBar, Dock, Tour, Terminal (Phase 3+), real content, i18n dictionaries, theme persistence/`auto` mode (Phase 5).

## Acceptance criteria

- [x] Token values equal the prototype (automated test against the original bundle).
- [x] Both themes and all 8 accents render; catalog switches them.
- [x] Components expose roles/names (aria-pressed, aria-current, labelled fields, decorative icons hidden).
- [x] axe: no serious/critical violations for 2 themes × 8 accents.
- [x] No new runtime dependency.
- [ ] Side-by-side visual comparison with the prototype's own windows → deferred to Phase 3 (needs real windows). NEEDS_MANUAL_REVIEW.

## Content status

No personal content. Demo labels (`DemoTag`) only shown as component samples.
