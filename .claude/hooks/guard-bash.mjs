#!/usr/bin/env node
// PreToolUse(Bash): block destructive or outward-facing commands. Exit 2 = block.
let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let cmd = "";
  try {
    cmd = JSON.parse(raw).tool_input?.command ?? "";
  } catch {
    process.exit(0);
  }
  const rules = [
    [/\brm\s+(-[a-zA-Z]*r[a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*r)\b/, "rm -rf is not allowed"],
    [/\bgit\s+push\b[^\n]*(--force|-f\b|--force-with-lease)/, "force push is not allowed"],
    [/\bgit\s+reset\s+--hard\b/, "git reset --hard is not allowed"],
    [/\bgit\s+clean\s+-[a-zA-Z]*f/, "git clean -f is not allowed"],
    [/\bgit\s+push\b[^\n]*\b(main|master)\b/, "push to main/master needs explicit owner approval"],
    [
      /\bvercel\b[^\n]*--prod\b|\bvercel\s+deploy\b[^\n]*--prod/,
      "production deploy needs owner approval",
    ],
    [
      /\b(curl|wget)\b[^\n]*\|\s*(sudo\s+)?(ba|z)?sh\b/,
      "piping downloads into a shell is not allowed",
    ],
    [/\bsudo\b/, "sudo is not allowed"],
    [
      /(^|[;&|]\s*)(rm|mv|tee|truncate)\b[^\n;&|]*design\/source\b|(^|[;&|]\s*)sed\s+-i[^\n;&|]*design\/source\b|>>?\s*\S*design\/source\//,
      "design/source is read-only",
    ],
  ];
  for (const [re, msg] of rules) {
    if (re.test(cmd)) {
      console.error(`Blocked by .claude/hooks/guard-bash.mjs: ${msg}`);
      process.exit(2);
    }
  }
  process.exit(0);
});
