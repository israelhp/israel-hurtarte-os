# ISRAEL HURTARTE.OS

Interactive desktop-OS style portfolio (macOS look) for Israel Hurtarte, Full Stack Developer, Guatemala. Built from a Claude Design prototype: **translate it, do not redesign it.**

## Source of truth

- Visual/behaviour: `design/source/claude-design/*.html` (read-only bundle; unpack with `tools/extract-design.py`). Audit: `docs/phase-0-audit.md`.
- Content: `src/content/` (status `verified | demo | placeholder`). Never invent data.
- Specs: `docs/specs/<PORT-ID>/`. Tasks: `docs/tasks/BACKLOG.md`. Gates: `docs/engineering/quality-gates.md`. Decisions: `docs/engineering/decisions.md`.

## Stack and commands

Next.js 16 (App Router, static export) · React 19 · TypeScript strict · Tailwind 4 · Zustand · Vitest · Playwright · Vercel.
`npm run check` (typecheck + lint + unit + build) · `npm run test:e2e` (needs a prior `npm run build`) · `npm run format` · `npm run audit:prod`.
Next.js here may differ from training data; read `node_modules/next/dist/docs/` before using unfamiliar APIs.

## Non-negotiables

- Official name `ISRAEL HURTARTE.OS`; `DEV.OS` is never a brand. Default language Spanish (`/es`), English complete (`/en`).
- Terminal = allowlisted simulation, no eval/exec. Contact = `mailto:`; never fake a successful send.
- No backend/DB/microservices without a real requirement. No new dependency without justification.
- Work in phases (docs/phase-0-audit.md §10). **Stop at the end of each phase and ask for authorization.** Commit/push/deploy only when the owner asks; production deploys need explicit approval.
- Never mark work Done without gate evidence; report unchecked things as NOT_VERIFIED.

## Layout

`src/app` routes · `src/features/{desktop,window-manager,dock,portfolio,terminal,tour,settings,contact,projects}` · `src/shared/{components,theme}` · `src/content` · `src/i18n` · `src/lib`. Create folders when first needed.

## Claude Code setup

Main agent: `portfolio-engineering-orchestrator` (12 agents in `.claude/agents/`, delegate one or few at a time). Skills in `.claude/skills/` (`/start-session` first, `/end-session` last). Rules in `.claude/rules/`. Hooks in `.claude/hooks/` (tested: `node --test .claude/hooks/guard-bash.test.mjs`).
