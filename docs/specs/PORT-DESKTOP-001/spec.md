# PORT-DESKTOP-001 — Desktop shell: wallpaper, menu bar, shortcuts, settings

Status: In Review (Phase 3) · Branch: `feature/phase-3-desktop-shell`

## Goal

The desktop surface that hosts windows and the Dock, with language/theme/accent settings.

## Scope

- `Desktop.tsx`, `MenuBar.tsx` (logo, role, 4 links, clock, ES/EN, theme toggle, settings), `Shortcuts.tsx` (Projects, README.md→About, Terminal), `SettingsPopover.tsx` (appearance light/dark/auto, 8 accents, language, reset windows).
- Welcome window opens on load; apps show a labelled Phase 4 placeholder (not "done" apps).
- ES default, EN complete; shell strings in `src/i18n` with a parity test.
- Settings store (Zustand): lang, theme, accent.
- Deferred to Phase 5: Portfolio View button/shortcut, tour button/entry, persistence of preferences.

## Content status

Shell labels only; app contents are Phase 4 placeholders (no personal data shown).
