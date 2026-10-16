# Phase 5 notes

Prototype sources (extracted template lines): tour 453–483 CSS, 1479–1511 steps/copy, 1572–1663 logic; portfolio view 435–452 CSS, 886–1004 markup; theme/accent/language 1853–1854, 1924, 1935–1939.

## Deviations from the prototype

1. **Portfolio View is a route** (`/es/portfolio`, `/en/portfolio`), not a mode switch inside one page: it gives crawlers and shared links the full content. Windows and settings survive the navigation.
2. **Language lives in the URL.** The prototype kept it in component state (default English).
3. **Theme/accent are applied by an inline script + `html[data-theme]/[data-accent]`** instead of classes on `.os`, to avoid flash and hydration mismatch.
4. **Tour**: non-modal (no focus trap) so the highlighted control stays keyboard-operable; Esc yields to the settings dialog and text fields; focus moves to the card each step; storage key renamed `ihos:tour-done`; in-memory dismissal when storage is blocked; mounted in the layout so it spans both views; `done` step shown on the portfolio page when it is reached from there.
5. **Responsive fixes on Portfolio View** (prototype bugs): `.pf` becomes a size container so two-column grids collapse on narrow screens, and the clipped hero glow no longer forces horizontal scroll.
6. Menu-bar "Portfolio View" link keeps an accessible name on mobile (the visible label is hidden there by the prototype CSS).
7. Prototype strings kept as decided (D9): "Interactive portfolio prototype" footer, DEMO/PLACEHOLDER labels and notes.

## Decisions and constraints worth remembering

- Static export has no redirects/proxy: `/` is a client redirect page (stored language, else Spanish); `vercel.json` redirects are intentionally NOT used because they would ignore the stored language.
- `/` is `noindex` for now; the real entry points are `/es` and `/en`. Revisit with hreflang/x-default in Phase 8 (owner decision pending on whether `/` should be indexable).
- `experimental.globalNotFound` is required for a 404 page with a dynamic `[lang]` root layout; it produces `404.html`.
- Incremental builds occasionally missed newly imported CSS; CI builds from a clean checkout, and local checks should use a clean `.next`/`out` before trusting visual results.
- The inline scripts need `'unsafe-inline'` in `script-src` (already allowed in `vercel.json`; Next's own bootstrap needs it too). Hashes/nonces are a Phase 8 hardening item.

## Independent review (code-reviewer subagent, 2026-10-15) and what changed

Fixed: Esc ending the tour while the settings dialog or a text field had it; tour re-appearing on every page load when storage is blocked (now remembered in memory); step preparation emitting events that could advance the tour (events during `go()` are ignored); viewport state re-rendering every 250 ms; unused i18n keys and an event without subscribers; footer year hydration risk; no-JS tests now assert the app chunks were really blocked and nothing hydrated.
Not changed: focus moving to the tour card after each auto-advance (by design, it announces the step); Tab can reach the page behind the dim layer (needed so highlighted controls work); `/` noindex (owner decision).
