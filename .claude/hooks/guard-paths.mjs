#!/usr/bin/env node
// PreToolUse(Write|Edit): protect the original design export and secrets. Exit 2 = block.
let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let p = "";
  try {
    p = JSON.parse(raw).tool_input?.file_path ?? "";
  } catch {
    process.exit(0);
  }
  if (/\/design\/source\//.test(p)) {
    console.error("Blocked: design/source/** is the immutable original export.");
    process.exit(2);
  }
  if (/(^|\/)\.env(\.|$)/.test(p) && !/\.env\.example$/.test(p)) {
    console.error("Blocked: do not write .env files; use .env.example for documented variables.");
    process.exit(2);
  }
  process.exit(0);
});
