# Accessibility audit (WCAG 2.2 AA target) — Phase 8

Status vocabulary as in `quality-gates.md`. "Automated" = Playwright + axe-core 4.x or a purpose-built test;
"manual" = needs a person with assistive technology. **No claim of full conformance is made.**

| WCAG criterion                                    | Status                                 | Evidence                                                                                                                                                                           |
| ------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1.1 Non-text content                            | PASS (automated)                       | decorative icons are `aria-hidden`; informative ones have names (axe `image-alt`, `svg-img-alt`)                                                                                   |
| 1.3.1 Info and relationships / 2.4.6 Headings     | PASS (automated)                       | one `h1` per page, no skipped levels (axe `heading-order`), landmarks (`main`, `nav`, `header`)                                                                                    |
| 1.4.1/1.4.3 Contrast (min)                        | PASS (automated)                       | axe `color-contrast`: catalog 2 themes × 8 accents, shell, 9 apps, tour, settings, Portfolio View 2 themes × 8 accents. Palette deviations for AA are listed in design-fidelity.md |
| 1.4.4 Resize text / 1.4.10 Reflow                 | PASS (automated)                       | no horizontal scroll at 320 px wide for all 9 windows and Portfolio View                                                                                                           |
| 1.4.11 Non-text contrast, 1.4.12 Text spacing     | NOT_VERIFIED                           | not tested beyond axe defaults                                                                                                                                                     |
| 2.1.1 Keyboard / 2.1.2 No keyboard trap           | PASS (automated)                       | Dock, menu bar, windows (arrows move, Enter maximizes, Esc closes), settings, tour, terminal; the tour is non-modal on purpose so the highlighted control stays reachable          |
| 2.4.1 Bypass blocks                               | PASS (automated)                       | skip link is the first Tab stop on the desktop and on Portfolio View, becomes visible on focus and moves focus into `main`                                                         |
| 2.4.2 Page titled                                 | PASS (automated)                       | 4 distinct titles (language × page)                                                                                                                                                |
| 2.4.3 Focus order / 2.4.7 Focus visible           | PASS (automated) / NEEDS_MANUAL_REVIEW | every control reached with 40 Tab presses has a ≥2 px outline; order checked by tests, not by a person                                                                             |
| 2.4.11 Focus not obscured (min)                   | NOT_VERIFIED                           | the tour's dim layer blocks the mouse outside the highlight by design; keyboard and "Next" always work                                                                             |
| 2.5.1 Pointer gestures / 2.5.7 Dragging movements | PASS (automated)                       | windows can be moved with the keyboard instead of dragging; no multi-point gestures                                                                                                |
| 2.5.8 Target size (min)                           | PASS (automated)                       | all interactive targets ≥ 24 px or with no other target inside a 24 px circle, at 7 viewports × every window                                                                       |
| 3.1.1/3.1.2 Language                              | PASS (automated)                       | `html[lang]` per route; names of technologies are not translated                                                                                                                   |
| 3.3.1/3.3.2 Error identification, labels          | PASS (automated)                       | contact form: labels, `aria-invalid`, `role=alert`, focus to the first invalid field                                                                                               |
| 4.1.2 Name, role, value                           | PASS (automated)                       | axe `button-name`, `link-name`, `aria-*`; windows are labelled sections                                                                                                            |
| 4.1.3 Status messages                             | PASS (automated)                       | terminal output is a log region (the typing animation is outside it), success banner is `role=status`                                                                              |
| `prefers-reduced-motion`                          | PASS (automated)                       | computed `animation-name: none` and zero transition durations                                                                                                                      |

## Not verified (needs a person)

Screen readers (VoiceOver/NVDA/TalkBack), voice control, switch access, real touch devices, high-contrast mode and
forced colors, zoom to 200 % on a real browser, cognitive review of the guided tour.

## Known limits

- The tour dim layer intercepts the pointer outside the spotlight (intentional, documented).
- The Portfolio View section links scroll horizontally on phones (reachable by keyboard: focus scrolls them into view).
