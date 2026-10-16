#!/usr/bin/env node
// PostToolUse(Write|Edit): format the touched file with Prettier. Never blocks.
import { execFileSync } from "node:child_process";
let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  try {
    const p = JSON.parse(raw).tool_input?.file_path ?? "";
    if (/\.(tsx?|jsx?|mjs|css|json|md)$/.test(p) && !/node_modules|design\/source/.test(p)) {
      execFileSync("npx", ["--no-install", "prettier", "--write", p], { stdio: "ignore" });
    }
  } catch {
    /* formatting is best-effort */
  }
  process.exit(0);
});
