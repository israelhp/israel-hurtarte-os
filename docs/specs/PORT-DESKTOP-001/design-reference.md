# Design reference — PORT-DESKTOP-001

Prototype lines (extracted template): wall/topbar 151-165, settings 174-185, shortcuts 186-191, markup 513-524 + 1006-1044, logic 1678 (isDark), 1853-1854 (theme/accent), 1924.

## Deviations from the prototype

- Settings popover is a dialog with focus moved in, Escape to close and focus returned to its trigger (prototype had none).
- Logo button keeps the visible text in its accessible name (WCAG 2.5.3) and adds a hidden "— Inicio".
- `<h1>` (visually hidden) for the page; the wall-mark stays decorative.
- Blur dropped at <=760px (decision D6).
- Theme "auto" renders dark on the server/first paint (like the prototype's default), then follows the system: light-mode visitors may see a flash. Planned fix in Phase 5/8 (inline script).
