import { describe, expect, it } from "vitest";
import { safeHref, safeLocalPath } from "./safe-href";

describe("safeHref", () => {
  it("accepts http, https and mailto", () => {
    expect(safeHref("https://github.com/israelhp")).toBe("https://github.com/israelhp");
    expect(safeHref("http://example.com")).toBe("http://example.com");
    expect(safeHref("mailto:a@b.co")).toBe("mailto:a@b.co");
  });
  it("rejects empty values and dangerous or malformed schemes", () => {
    for (const bad of [
      "",
      "   ",
      "javascript:alert(1)",
      "data:text/html,x",
      "vbscript:x",
      "//evil.com",
      "not a url",
      "file:///etc/passwd",
    ])
      expect(safeHref(bad), bad).toBeNull();
  });
});

describe("safeLocalPath", () => {
  it("accepts same-site file paths", () => {
    expect(safeLocalPath("/cv/Israel-Hurtarte-CV.pdf")).toBe("/cv/Israel-Hurtarte-CV.pdf");
    expect(safeLocalPath("  /cv/a_b.pdf ")).toBe("/cv/a_b.pdf");
  });
  it("rejects anything that could leave the site or climb directories", () => {
    for (const bad of [
      "",
      "cv/a.pdf",
      "//evil.com/a.pdf",
      "/../etc/passwd",
      "/cv/../a.pdf",
      "/a b.pdf",
      "/a.pdf?x=1",
      "\\evil",
      "https://x.test/a.pdf",
      "javascript:alert(1)",
      "/cv/\u0000.pdf",
    ])
      expect(safeLocalPath(bad), bad).toBeNull();
  });
});
