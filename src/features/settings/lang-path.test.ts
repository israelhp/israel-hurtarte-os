import { describe, expect, it } from "vitest";
import { swapLangPath } from "./lang-path";

describe("swapLangPath", () => {
  it("swaps the language prefix and keeps the rest", () => {
    expect(swapLangPath("/es", "en")).toBe("/en");
    expect(swapLangPath("/en/portfolio", "es")).toBe("/es/portfolio");
    expect(swapLangPath("/es/portfolio/", "en")).toBe("/en/portfolio");
  });
  it("adds a prefix when the path has none", () => {
    expect(swapLangPath("/", "es")).toBe("/es");
    expect(swapLangPath("/design-system", "en")).toBe("/en/design-system");
  });
});
