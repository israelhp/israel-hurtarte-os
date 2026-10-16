---
name: audit-security
description: "Run the security audit and report SECURITY_GATE."
---

# Audit security

Delegate to security-engineer. Run `npm run audit:prod`. Check CSP/headers (vercel.json), XSS sinks, terminal allowlist, external links, secrets, dependencies. Report findings by severity; set SECURITY_GATE.
