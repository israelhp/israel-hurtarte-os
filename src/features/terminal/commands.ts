import type { AppId } from "@/shared/app-ids";
import type { Dictionary } from "@/i18n";
import { windowTitle } from "@/features/desktop/apps";

/**
 * The terminal is a visual simulation. Input is only ever compared against this fixed allowlist;
 * it is never evaluated, executed or sent anywhere. Output is plain text.
 */
export const COMMANDS = [
  "help",
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "certifications",
  "contact",
  "whoami",
  "clear",
] as const;
export type Command = (typeof COMMANDS)[number];

/** Commands that open a window. */
export const COMMAND_APP: Partial<Record<Command, AppId>> = {
  about: "about",
  skills: "stack",
  projects: "projects",
  experience: "experience",
  education: "education",
  certifications: "certs",
  contact: "contact",
};

/** Chips shown under the prompt (prototype line 1922). */
export const CHIP_COMMANDS: Command[] = [
  "help",
  "about",
  "skills",
  "projects",
  "whoami",
  "contact",
  "clear",
];

export const MAX_INPUT = 200;
const MAX_ECHO = 80;

export type LineKind = "cmd" | "out" | "sys" | "ok" | "err";
export type TermLine = { kind: LineKind; text: string };
export type CommandResult = { lines: TermLine[]; open?: AppId; clear?: boolean };

const isCommand = (v: string): v is Command => (COMMANDS as readonly string[]).includes(v);

export function runCommand(raw: string, t: Dictionary): CommandResult {
  const input = raw.slice(0, MAX_INPUT);
  const cmd = input.trim().toLowerCase();
  if (cmd === "clear") return { lines: [], clear: true };
  const echo: TermLine = { kind: "cmd", text: input };
  if (!cmd) return { lines: [echo] };
  if (!isCommand(cmd)) {
    const shown = cmd.length > MAX_ECHO ? `${cmd.slice(0, MAX_ECHO)}…` : cmd;
    return {
      lines: [echo, { kind: "err", text: `${t.term_not_found} ${shown} ${t.term_try_help}` }],
    };
  }
  if (cmd === "help") return { lines: [echo, { kind: "out", text: t.term_help }] };
  if (cmd === "whoami") return { lines: [echo, { kind: "ok", text: t.term_whoami }] };
  const app = COMMAND_APP[cmd]!;
  return {
    lines: [echo, { kind: "ok", text: `${t.term_opening} ${windowTitle(t, app)}…` }],
    open: app,
  };
}

/** Tab completion: commands starting with the typed prefix. */
export function complete(prefix: string): Command[] {
  const p = prefix.trim().toLowerCase();
  return p ? COMMANDS.filter((c) => c.startsWith(p)) : [];
}
