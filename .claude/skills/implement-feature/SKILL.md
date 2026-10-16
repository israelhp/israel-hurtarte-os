---
name: implement-feature
description: "Implement one planned feature end to end on its own branch with tests."
argument-hint: <PORT-ID>
---

# Implement feature

1. Confirm the spec is Ready; create branch feature/<ID>.
2. Implement in small steps following .claude/rules/*. Strings in src/i18n (ES+EN), content in src/content.
3. Write unit tests, then e2e for the flow.
4. Run `npm run check` and relevant e2e; record real output in verification.md.
5. Request code-reviewer; move the task to In Review. Never mark Done without gate evidence.
