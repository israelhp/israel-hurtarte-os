---
name: prepare-release
description: "Prepare a release candidate: all gates, changelog, rollback notes. Never deploys to production."
disable-model-invocation: true
---

# Prepare release

Run every gate in docs/engineering/quality-gates.md; list any not PASS. Update CHANGELOG.md, confirm env vars in .env.example, write rollback notes (promote previous Vercel deployment). Stop and ask the owner before any deploy; production deploys require explicit approval.
