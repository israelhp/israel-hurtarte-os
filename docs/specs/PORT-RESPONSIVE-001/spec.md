# PORT-RESPONSIVE-001 — Responsive behaviour (desktop, laptop, tablet, phone)

Status: In Review (Phase 6) · Branch: `feature/phase-6-responsive`

## Layout tiers

| Tier             | Condition                                                    | Behaviour                                                                                                                            |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Desktop / laptop | width > 1100                                                 | full desktop: shortcuts, menu-bar links, draggable windows, hover Dock magnification                                                 |
| Tablet           | 761–1100 wide and > 500 tall                                 | draggable windows (mouse or finger), no shortcuts/links; menu bar drops the role text (<=900) and the clock (<=820) so nothing wraps |
| Compact          | width <= 760 **or** height <= 500 (phones, landscape phones) | full-screen windows (no dragging), Dock becomes a bottom bar with labels; blur dropped (D6)                                          |
| Short compact    | height <= 500                                                | Dock labels hidden, window gets the freed room (~294px instead of ~190px on a 390px-high screen)                                     |

`isCompact()` in the window-manager model mirrors the CSS condition; a unit test pins it.

## Touch

- `pointer: coarse` → 34px window buttons (the prototype only did this at <=760px, so tablets had 22px).
- Title-bar handle fills the bar (was 20px tall).
- Hover-only effects (Dock magnification, tooltip, card lift) are disabled on `hover: none` devices at tablet size so they do not stick after a tap.
- Window drag works with a finger (pointer events + `touch-action: none`), verified with real touch events over CDP.
- `viewport-fit=cover` + safe-area insets for notches; `interactive-widget=resizes-content` so the on-screen keyboard resizes the page (Terminal prompt, contact form stay visible on Android Chrome).

## Portfolio View on small screens

Logo short form (`IH.OS`), one-row nav with a horizontally scrolling link strip (~80px instead of ~175px), smaller hero/section paddings, nav not sticky on landscape phones. Two-column grids collapse (fixed in Phase 5).

## Not changed on purpose

Window resizing (the prototype has none), a "try the portfolio view" suggestion for phones (not in the prototype; the menu-bar button is always visible), and any layout >= 1100px.
