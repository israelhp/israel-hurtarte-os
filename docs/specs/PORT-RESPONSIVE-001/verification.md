# Verification — PORT-RESPONSIVE-001 (2026-10-15)

| Gate                 | Status                                                                                                                                                    | Evidence                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| FUNCTIONAL_GATE      | PASS                                                                                                                                                      | `tests/e2e/responsive.spec.ts` (23 tests)                                                        |
| ACCESSIBILITY_GATE   | PASS (automated target-size check per WCAG 2.2 2.5.8 incl. the spacing exception, occluded controls ignored) / NOT_VERIFIED (real devices, screen reader) | each of 6 viewports × 9 apps × Settings dialog                                                   |
| DESIGN_FIDELITY_GATE | NEEDS_MANUAL_REVIEW                                                                                                                                       | screenshots of phone portrait/landscape, tablet portrait/landscape and portfolio reviewed by eye |

## What the suite proves, per viewport (laptop 1280×720, tablet 1024×768 and 768×1024, phone 390×844, small phone 360×640, phone landscape 844×390)

No horizontal page scroll; menu bar neither overflows nor wraps; Dock inside the screen; every window inside the screen, below the menu bar and above the Dock; no window content sticking out of its window; every interactive target is >=24px or has no other target within a 24px circle; Portfolio View has no overflow and a nav that does not eat the screen.
Plus: finger drag moves a window by the exact distance and clamps it (CDP touch events); tapping the Dock opens a window and leaves no stuck hover; 34px buttons on touch vs 22px on mouse; rotating 1024×768 → 390×844 → 844×390 → 1280×720 keeps windows fitting; landscape phone window >=270px tall, labels hidden, drag disabled; the tour card stays on screen on all 6 steps on a phone; viewport meta contains `viewport-fit=cover`, `interactive-widget=resizes-content`.
Unit: `isCompact` boundaries, no movement on compact screens, and re-clamping after shrinking then growing the viewport.

## Not verified

Real phones/tablets (iOS Safari viewport quirks, on-screen keyboard, notch rendering, `interactive-widget` support outside Chromium), pixel-level comparison, screen reader on touch devices.

## Independent review (code-reviewer subagent, 2026-10-15) and what changed

- **Fixed (real regression):** the coarse-pointer rule that widened `.lights`/`.tb-pad` to 110px also applied on phones, overriding the prototype's compact rules and stealing ~110px from the window title. It is now limited to tablets; a test pins pad = 0 and title >= 200px at 360px wide.
- **Fixed:** "maximize" on a portrait phone gave a different geometry than the normal window (prototype `.win.max` kept `top:48px`/other height). Compact and landscape now match exactly; a test taps Maximize at 390×844 and 844×390 and asserts nothing moves. (Pre-existing; the earlier comment claimed otherwise.)
- **Fixed:** `.pf-links` (`overflow-x:auto`) clipped the focus ring; added a 4px buffer and a test that the last link, when focused, is scrolled into view with room for the outline.
- **Test hardening:** the overflow check had an escape hatch that skipped the very check (removed; nothing new failed); off-screen targets are no longer silently ignored unless inside a deliberate scroll strip (Dock, link row, side bar); Dock items are now really clicked (no `force`), which also proves they are reachable; new test for drag → compact → large; helper waits for the Welcome window so measurements never race hydration.
- **Documented, not changed:** the role text hidden at <=900px is duplicated in the Welcome and About windows (the menu-bar copy is decorative); `isCompact` uses integer `innerWidth/innerHeight` while media queries use fractional CSS px, so browser zoom can differ by 1px exactly at 760/500 (low); the `(hover:none)` rules and `dock-tip` rules cannot affect >=1100px desktops.
