# Design reference — PORT-RESPONSIVE-001

Prototype responsive rules (extracted template): `@media (max-width:1100px)` line 485; `@media (max-width:760px)` 486–507; container queries 281, 299–310, 388, 425; `.light` 34px on mobile line 493.

## Deviations (all in `src/shared/theme/responsive.css`, plus the media condition in shell/apps/a11y-overrides)

1. Compact also applies to short viewports (landscape phones).
2. Menu bar never wraps; role text hidden <=900px, clock <=820px (the prototype hid them only at 760px, so tablets wrapped text onto two lines).
3. Coarse pointers get 34px window buttons at any width; the title handle fills the bar; link rows keep a 24px target.
4. Hover effects off on `hover: none` tablets.
5. Safe-area insets and `viewport-fit=cover`; keyboard-aware viewport.
6. Landscape-phone Dock without labels and a taller window.
7. Portfolio View nav compaction (phones) and static nav on short screens.
