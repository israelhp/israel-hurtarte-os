# Git workflow

- Never commit to `main` directly once the first commit exists. Branches: `feature/PORT-XXX-NNN`, `fix/PORT-XXX-NNN`, `chore/...`. Small, focused commits (Conventional Commits).
- Commit/push only when the owner asks. Never force push, reset --hard, or push to `main`. Production deploys require explicit approval.
- A task is Done only with gate evidence recorded in its `verification.md`.
- Task states: Backlog, Ready, In Progress, In Review, Testing, Blocked, Done (docs/tasks/BACKLOG.md).
