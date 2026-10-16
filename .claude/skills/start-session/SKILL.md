---
name: start-session
description: "Recover project context at the start of a work session: CLAUDE.md, git state, active tasks, last handoff, blockers."
---

# Start session

1. Read CLAUDE.md and the latest file in docs/sessions/ (handoff).
2. Run `git status`, `git branch --show-current`, `git log --oneline -10`.
3. Read docs/tasks/BACKLOG.md; list tasks In Progress / Blocked.
4. Report: current phase, branch, active task, blockers, proposed next step. Do not start work until the owner confirms.
