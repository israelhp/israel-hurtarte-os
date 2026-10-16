# Decisions (ADR log)

## Owner decisions (Phase 0 review, 2026-10-15)

- D1 Folder renamed to `design/source/claude-design/` (moved, not copied).
- D2 Experience per prototype: Mid-Level (Mar 2024–present), Junior (Mar 2021–Mar 2024) at Banco G&T Continental; VisionBitt independent (Jan 2025–present).
- D3 Spanish default; routes `/es` and `/en`.
- D4 Demo projects and placeholder certifications stay visible with their DEMO/PLACEHOLDER labels until replaced.
- D5 Contact via `mailto:`. D6 Solid background instead of blur at <=760px. D7 All 12 agents. D8 Zustand (acceptable if everything works correctly). D9 "Prototype/DEMO" copy kept as is. D10 Missing data (CV, website, screenshots, domain) added later by the owner.

## Technical decisions

- T1 Scaffold from `create-next-app` 16.4.2 (Tailwind 4 via `@tailwindcss/turbopack`, ESLint 9). Dropped scaffold's `cacheComponents`, `partialPrefetching`, React Compiler: incompatible/unneeded with `output: "export"`.
- T2 Static export (`output: "export"`, `images.unoptimized`) for Vercel free tier. E2E serves `out/` with `serve`.
- T3 `@types/node@22` to satisfy vitest 5 peer deps and match Node 22 runtime.
- T4 TypeScript 5.9 (scaffold default) rather than the newest major, for tooling compatibility.

- T5 Prototype CSS is ported as plain CSS (tokens/base/components) with class names preserved, not re-expressed as Tailwind utilities, to keep fidelity verifiable line by line. Tailwind is used for new layout. Accessibility deviations are isolated in `a11y-overrides.css` (see docs/specs/DS-001/design-reference.md).
- T6 `/design-system` catalog ships in the static export with `noindex`; revisit excluding it from production builds in Phase 8.

- T7 Window drag uses pointer capture on the title bar, a rAF-throttled `transform`, and one store commit on release. Only the dragged window re-renders; the pure model clamps every move.
- T8 Prototype CSS lists `backdrop-filter` before `-webkit-backdrop-filter`; the production CSS minifier then kept only the prefixed one (no blur in Chromium). Source order is now prefixed first. Guarded by an e2e that asserts the computed `backdrop-filter` of a window.
- T9 Shell i18n is a typed dictionary (`Dictionary` = keys of `es`, `en` must match) plus a Zustand `lang`; `/es` `/en` routes and persistence arrive in Phase 5.

## Accepted risks

- R1 `npm audit` reports 5 high advisories (braces → micromatch → fast-glob → @next/eslint-plugin-next → eslint-config-next) in **dev-only lint tooling**, not shipped. `npm run audit:prod` (production deps) is the release gate. The suggested fix downgrades eslint-config-next to 14: rejected. Revisit when upstream updates.
