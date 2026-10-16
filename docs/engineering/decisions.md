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

## Accepted risks

- R1 `npm audit` reports 5 high advisories (braces → micromatch → fast-glob → @next/eslint-plugin-next → eslint-config-next) in **dev-only lint tooling**, not shipped. `npm run audit:prod` (production deps) is the release gate. The suggested fix downgrades eslint-config-next to 14: rejected. Revisit when upstream updates.
