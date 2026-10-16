# Verification — PORT-WINDOWS-001 (2026-10-15)

| Gate                 | Status                                                              | Evidence                                                                                                                                                                                                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FUNCTIONAL_GATE      | PASS                                                                | e2e: open from Dock, refocus, minimize/restore, maximize/restore, close, reset                                                                                                                                                                                                                                                                        |
| WINDOW_MANAGER_GATE  | PASS (desktop, mouse+keyboard) · NOT_VERIFIED (real touch)          | 21 model unit tests + 6 store tests with fake timers (close/minimize delays, reopen during animation, close→reopen→close race, reset cancels timers) (open/focus/z/min/max/close/clamp/viewport/z-normalization); e2e drag moves by exact delta and cannot leave viewport (clamped on all edges); keyboard arrows/Enter/Escape; focus returns to Dock |
| DESIGN_FIDELITY_GATE | NEEDS_MANUAL_REVIEW                                                 | Visual check of dark/light screenshots; no pixel diff yet                                                                                                                                                                                                                                                                                             |
| ACCESSIBILITY_GATE   | PASS (axe, 2 themes, desktop+mobile) · NOT_VERIFIED (screen reader) | e2e axe with windows open                                                                                                                                                                                                                                                                                                                             |

Commands: `npm run check`, `npm run build && npx playwright test`.

## Independent review (code-reviewer subagent, 2026-10-15)

Findings fixed: per-window animation timers (a stale timer could end a second close early); double-click bubbling from traffic-light buttons; keyboard focus on re-opening an already-open window; focus return to the Dock on minimize/close even when the button was not focused (Safari); focus after Reset; Space on the title handle; `lostpointercapture`; z renormalization keeps top window == zTop; clock refresh 10s. Added e2e: real-motion close/minimize, focus flows, dblclick bubbling, axe with the settings dialog open (both themes).

Not changed / known limits:

- Settings popover is a **non-modal** dialog (no focus trap, no aria-modal) by design; Escape and scrim close it.
- `isEditable` (Escape/arrow handling inside inputs) has no test yet: Phase 3 has no inputs in windows. Add one with the Terminal/Projects search in Phase 4.
- Real touch dragging NOT_VERIFIED. Screen-reader behaviour NOT_VERIFIED.
