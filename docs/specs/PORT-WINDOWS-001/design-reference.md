# Design reference — PORT-WINDOWS-001

Prototype lines (extracted template): windows CSS 220-241, keyframes 242-244; logic 1680-1761 (patchWin, clampGeo, place, openApp, focusApp, closeApp, minApp, maxApp, startDrag, onMove, resetWindows); markup per window e.g. 528-550.

## Deviations from the prototype

- Closing/minimizing the active window hands focus to the next visible window (prototype left `active` on the closed one).
- z-indices are renormalized before 5000 (prototype grew unbounded).
- Dragging uses transform+rAF and commits once (prototype called setState on every pointermove, re-rendering the whole app).
- Title bar is a focusable control (`role=button`) with keyboard move/maximize; windows are focusable sections that take focus when opened by the visitor (not on page load).
- Compact maximized windows use the same geometry as non-maximized ones.
