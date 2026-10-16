# Accessibility (target WCAG 2.2 AA)

- Everything operable by keyboard: dock, windows (focus, close with Esc, move/resize alternatives), menus, tour, terminal.
- Visible focus (`:focus-visible`), accessible names on icon buttons, real buttons/links, labelled form fields, 24px+ touch targets (44px on mobile where possible).
- Modals (tour, settings) manage focus: move in, return on close, Esc closes where applicable.
- Respect `prefers-reduced-motion`. Check contrast in light and dark. Do not claim compliance without a recorded audit.
