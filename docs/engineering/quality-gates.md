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

## Current status (after Phase 3: shell)

| Gate                        | Status                                                  | Note                                                                    |
| --------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------- |
| DESIGN_FIDELITY_GATE        | PASS (tokens) / NEEDS_MANUAL_REVIEW (shell, components) | token test vs original bundle; shell compared by eye, no pixel diff yet |
| FUNCTIONAL_GATE             | PASS (design system, shell)                             | app contents are Phase 4 placeholders                                   |
| WINDOW_MANAGER_GATE         | PASS (mouse + keyboard) / NOT_VERIFIED (real touch)     | 20 model tests + e2e                                                    |
| ACCESSIBILITY_GATE          | PASS (axe) / NOT_VERIFIED (manual, screen reader)       | axe: catalog 2 themes × 8 accents; shell 2 themes × desktop/mobile      |
| I18N_GATE                   | PASS (shell strings)                                    | parity test; full content in Phase 4–5                                  |
| SECURITY_GATE               | NOT_VERIFIED                                            | `audit:prod` clean; full review in Phase 8                              |
| SEO_GATE / PERFORMANCE_GATE | NOT_VERIFIED                                            | Phase 8                                                                 |
| CI_BUILD_GATE               | PASS (local)                                            | Actions not yet run (no remote)                                         |
