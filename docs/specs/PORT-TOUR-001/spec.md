# PORT-TOUR-001 — Guided tour

Status: In Review (Phase 5) · Branch: `feature/phase-5-advanced`

## Behaviour

- 8 steps (intro, dock, controls, folders, terminal, prefs, pv, done) with the prototype copy in ES/EN (`src/i18n/tour.ts`).
- Spotlight (`clip-path` hole + ring), card placement above/below the target, progress dots, hint, Next/Back/Skip.
- Steps wait for the real action (open Projects, maximize, "View details", open Terminal, change theme/language, click Portfolio View) via a tiny event bus (`lib/events`); advancing is delayed 550 ms. Events caused by the tour preparing a step are ignored.
- Mounted once in the language layout so it survives Desktop ⇄ Portfolio View; the last step shows on the portfolio page and finishing returns to the desktop.
- Auto-starts 900 ms after the first desktop visit; completing or skipping stores `ihos:tour-done` (renamed from the prototype's `devos-tour-done`) and an in-memory flag; replay from the `?` button or Settings. Finishing leaves only the Welcome window.
- Accessibility: non-modal dialog (`aria-labelledby` the step title) so the highlighted control stays usable by keyboard; focus moves to the card on every step; Esc skips unless the settings dialog or a text field has it.

## Files

src/features/tour/*, src/i18n/tour.ts, src/lib/events.ts, src/shared/theme/tour.css
