# Quality gates

Status values: `PASS` · `FAIL` · `NOT_VERIFIED` · `NOT_APPLICABLE` · `NEEDS_MANUAL_REVIEW`. A task cannot be Done while a required gate is not PASS (or justified NOT_APPLICABLE). Evidence = command + real output, or screenshots, recorded in the task's `verification.md`.

| Gate                 | Passes when                                                                                     | Evidence / tool                      |
| -------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------ |
| DESIGN_FIDELITY_GATE | Matches prototype at 1440, 1024, 768, 390 in light/dark; deviations listed and justified        | `/verify-design` screenshots         |
| FUNCTIONAL_GATE      | Acceptance criteria met; content of the window actually works                                   | unit + e2e results                   |
| WINDOW_MANAGER_GATE  | open/close/focus/z-order/min/max/drag-clamp/Esc behave; no leaks                                | reducer tests + `/test-interactions` |
| ACCESSIBILITY_GATE   | axe clean on key views; keyboard and focus flows checked; reduced motion                        | `/audit-accessibility`               |
| I18N_GATE            | ES/EN key parity test green; no mixed-language views; metadata per language                     | unit test + manual                   |
| SECURITY_GATE        | `npm run audit:prod` ok; headers/CSP set; no unsafe sinks; terminal allowlist                   | `/audit-security`                    |
| SEO_GATE             | title, description, OG, canonical, hreflang, sitemap, robots                                    | `/audit-performance`                 |
| PERFORMANCE_GATE     | Measured LCP/INP/CLS and bundle size recorded and within targets (LCP<2.5s, INP<200ms, CLS<0.1) | Lighthouse                           |
| CI_BUILD_GATE        | typecheck, lint, unit, build, e2e green in GitHub Actions                                       | CI run                               |
| RELEASE_GATE         | All above PASS, changelog, rollback notes, owner approval                                       | `/prepare-release`                   |

## Current status (Phase 1)

| Gate          | Status              | Note                                                                                |
| ------------- | ------------------- | ----------------------------------------------------------------------------------- |
| CI_BUILD_GATE | NEEDS_MANUAL_REVIEW | Passes locally (`npm run check`, e2e smoke); GitHub Actions not yet run (no remote) |
| All others    | NOT_VERIFIED        | No product code yet                                                                 |
