import { describe, expect, it } from "vitest";
import { safeHref } from "./safe-href";

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
