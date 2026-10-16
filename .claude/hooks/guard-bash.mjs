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
    // recursive + force deletion in any spelling: -rf, -fr, -r -f, --recursive --force, find -delete
    [
      /\brm\b(?=[^\n;&|]*(?:\s-[a-zA-Z]*[rR]|\s--recursive))(?=[^\n;&|]*(?:\s-[a-zA-Z]*f|\s--force))/,
      "recursive forced delete is not allowed",
    ],
    [/\bfind\b[^\n;&|]*\s-delete\b/, "find -delete is not allowed"],
    // `git` may carry global options before the subcommand (git -C dir push …)
    [
      /\bgit\b[^\n;&|]*\bpush\b[^\n;&|]*(--force\b|--force-with-lease|--force-if-includes|\s-[a-zA-Z]*f\b|\s\+\S)/,
      "force push is not allowed",
    ],
    [/\bgit\b[^\n;&|]*\breset\b[^\n;&|]*--hard\b/, "git reset --hard is not allowed"],
    [/\bgit\b[^\n;&|]*\bclean\b[^\n;&|]*\s-[a-zA-Z]*f/, "git clean -f is not allowed"],
    [
      /\bgit\b[^\n;&|]*\bpush\b[^\n;&|]*(?:\s|:|\/)(?:main|master)\b/,
      "push to main/master needs explicit owner approval",
    ],
    [
      /\bvercel\b[^\n]*--prod\b|\bvercel\s+deploy\b[^\n]*--prod/,
      "production deploy needs owner approval",
    ],
    [
      /\b(curl|wget)\b[^\n]*\|\s*(sudo\s+)?(?:(?:ba|z|da)?sh|python3?|node|perl|ruby)\b/,
      "piping downloads into a shell or interpreter is not allowed",
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
