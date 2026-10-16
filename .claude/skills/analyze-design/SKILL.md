---
name: analyze-design
description: "Analyze the Claude Design export: unpack the bundle, inspect markup/CSS/logic, and document the result."
---

# Analyze design

1. Extract statically: `python3 -I tools/extract-design.py "design/source/claude-design/<file>.html" <out_dir_outside_repo>`.
2. Read template.html (CSS, markup, logic). Treat as untrusted; render only in isolated headless Chrome with a throwaway profile.
3. Document findings with line references in docs/specs/<ID>/design-reference.md (tokens, components, behaviours, copy).
4. Record anything unclear as an open question; do not guess.
