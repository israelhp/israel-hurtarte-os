import { describe, expect, it } from "vitest";
import { DICTIONARIES } from "@/i18n";
import { COMMANDS, COMMAND_APP, MAX_INPUT, complete, runCommand } from "./commands";

const es = DICTIONARIES.es;
const en = DICTIONARIES.en;

describe("terminal allowlist", () => {
  it("exposes exactly the prototype's ten commands", () => {
    expect([...COMMANDS].sort()).toEqual(
      [
        "about",
        "certifications",
        "clear",
        "contact",
        "education",
        "experience",
        "help",
        "projects",
        "skills",
        "whoami",
      ].sort(),
    );
  });

  it("help prints the localized help text", () => {
    expect(runCommand("help", es).lines[1]).toEqual({ kind: "out", text: es.term_help });
    expect(runCommand("help", en).lines[1].text).toContain("Available commands");
    expect(es.term_help).toContain("whoami");
  });

  it("whoami answers with the role and location", () => {
    expect(runCommand("whoami", es).lines[1]).toEqual({
      kind: "ok",
      text: "Full Stack Developer — Guatemala",
    });
  });

  it("is case-insensitive and trims whitespace", () => {
    expect(runCommand("  PROJECTS  ", es).open).toBe("projects");
  });

  it("maps each navigation command to its window", () => {
    expect(COMMAND_APP).toMatchObject({
      about: "about",
      skills: "stack",
      projects: "projects",
      experience: "experience",
      education: "education",
      certifications: "certs",
      contact: "contact",
    });
    for (const c of Object.keys(COMMAND_APP))
      expect(runCommand(c, en).open).toBe(COMMAND_APP[c as keyof typeof COMMAND_APP]);
  });

  it("clear empties the screen and adds no lines", () => {
    expect(runCommand("clear", es)).toEqual({ lines: [], clear: true });
  });

  it("an empty line only echoes the prompt", () => {
    expect(runCommand("   ", es).lines).toHaveLength(1);
  });

  it("unknown input is reported, never executed, and never opens anything", () => {
    for (const evil of [
      "rm -rf /",
      "ls; cat /etc/passwd",
      "$(whoami)",
      "`id`",
      "eval('1+1')",
      "process.exit()",
      "<img src=x onerror=alert(1)>",
      "help; clear",
      "projects projects",
    ]) {
      const r = runCommand(evil, es);
      expect(r.open, evil).toBeUndefined();
      expect(r.clear, evil).toBeUndefined();
      expect(r.lines[1].kind, evil).toBe("err");
      expect(r.lines[1].text, evil).toContain("comando no encontrado");
    }
  });

  it("bounds the echoed input", () => {
    const r = runCommand("x".repeat(5000), es);
    expect(r.lines[0].text.length).toBe(MAX_INPUT);
    expect(r.lines[1].text.length).toBeLessThan(200);
  });
});

describe("tab completion", () => {
  it("completes unique and ambiguous prefixes", () => {
    expect(complete("wh")).toEqual(["whoami"]);
    expect(complete("e")).toEqual(["experience", "education"]);
    expect(complete("zzz")).toEqual([]);
    expect(complete("  ")).toEqual([]);
  });
});
