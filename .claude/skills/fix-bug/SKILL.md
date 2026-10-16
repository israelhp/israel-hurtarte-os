---
name: fix-bug
description: "Diagnose and fix a defect with a regression test."
argument-hint: <description or PORT-ID>
---

# Fix bug

Reproduce first (test that fails). Find root cause, fix minimally on branch fix/<ID>, make the test pass, run `npm run check`. Record cause and evidence; no unrelated refactors.
