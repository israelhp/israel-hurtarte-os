# PORT-TERMINAL-001 — Developer Terminal

Status: In Review (Phase 4) · Branch: `feature/phase-4-apps`

## Files

src/features/terminal/{commands.ts,store.ts,TerminalApp.tsx}

## Behaviour

Allowlist of 10 commands (pure `runCommand`), typed welcome line, Tab completion, history (↑/↓, capped at 100), chips, `clear`, 500-line cap, 200-char input cap, `role=log`. Input is never evaluated or sent anywhere; output is rendered as text nodes.

## Content status

n/a
