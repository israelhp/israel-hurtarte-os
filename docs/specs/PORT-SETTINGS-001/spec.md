# PORT-SETTINGS-001 — Persisted preferences and no-flash theming

Status: In Review (Phase 5) · Branch: `feature/phase-5-advanced`

## Behaviour

- Theme (light/dark/auto), accent (8) are stored in `localStorage` (`ihos:settings:v1`), validated against whitelists on read.
- An inline script in `<head>` (`boot-script.ts`) applies them to `<html data-theme data-accent>` before first paint (technique from the Next.js "preventing flash before hydration" guide). All theme CSS selects on those attributes (`[data-theme="dark"] .os`), so React state and hydration cannot cause a flash or mismatch.
- `SettingsSync` loads stored values into the store after hydration, mirrors changes to `<html>` and storage, and never writes before it has read (no overwrite with defaults).
- Blocked or throwing storage never breaks the page; the tour is remembered in memory too.

## Files

src/features/settings/{persistence,boot-script,SettingsSync,store,hooks}.ts*, src/shared/theme/*.css (selectors)
