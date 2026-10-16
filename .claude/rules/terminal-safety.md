# Terminal safety

- The terminal is a visual simulation. Input is matched against an explicit allowlist (help, about, skills, projects, experience, education, certifications, contact, whoami, clear).
- Never use eval, `new Function`, dynamic import of user text, child processes, or any server endpoint to interpret input. Unknown input prints "command not found".
- Render output as text nodes only, never as HTML.
