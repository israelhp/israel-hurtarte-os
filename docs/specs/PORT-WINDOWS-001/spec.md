# PORT-WINDOWS-001 — Window manager and window chrome

Status: In Review (Phase 3) · Branch: `feature/phase-3-desktop-shell`

## Goal

Shared window system for all apps: open, close, focus, z-order, minimize, maximize, drag with clamping, keyboard, restore.

## Scope

- Pure model `src/features/window-manager/model.ts` (20 unit tests) + Zustand store `store.ts` with per-window selectors.
- `Window.tsx` (title bar, traffic lights, drag via pointer capture + rAF transform, commit on release), `WindowLayer.tsx`.
- Keyboard: Tab to the title handle, arrows move 16px (Shift 64px), Enter maximizes, Escape closes (not inside inputs). Focus returns to the Dock icon on close/minimize.
- Compact (<=760px): windows are full-screen, dragging disabled.
- No resizing (the prototype has none).

## Content status

Shell labels only; app contents are Phase 4 placeholders (no personal data shown).
