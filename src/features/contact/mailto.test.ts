import { describe, expect, it } from "vitest";
import { buildMailto, validateContact } from "./mailto";

const ok = { name: "Ana", email: "ana@example.com", message: "Hola" };

describe("validateContact", () => {
  it("accepts a complete, valid message", () => {
    expect(validateContact(ok)).toEqual({});
  });
  it("flags each missing or invalid field", () => {
    expect(validateContact({ name: " ", email: "x", message: "" })).toEqual({
      name: true,
      email: true,
      message: true,
    });
    expect(validateContact({ ...ok, email: "a b@c.de" }).email).toBe(true);
    expect(validateContact({ ...ok, email: "ana@example" }).email).toBe(true);
  });
});

describe("buildMailto", () => {
  it("encodes subject and body into a mailto URL", () => {
    const url = buildMailto("me@example.com", "Contacto desde X", ok);
    expect(url.startsWith("mailto:me@example.com?subject=")).toBe(true);
    expect(decodeURIComponent(url.split("body=")[1])).toBe("Hola\n\n— Ana (ana@example.com)");
  });

  it("cannot inject extra recipients or headers through name, email or subject", () => {
    const url = buildMailto("me@example.com", "Hi\r\nBcc: evil@x.com", {
      name: "Ana\r\nBcc: evil@x.com",
      email: "ana@example.com\nCc: evil@x.com",
      message: "m",
    });
    const subject = url.split("subject=")[1].split("&body=")[0];
    expect(subject).not.toMatch(/%0A|%0D/i); // no line breaks in the subject
    const body = decodeURIComponent(url.split("&body=")[1]);
    // name and email are flattened onto the single signature line, so no line can start with a header
    expect(body.split("\n").filter((l) => /^(bcc|cc):/i.test(l))).toEqual([]);
    expect(url.split("?")[0]).toBe("mailto:me@example.com");
  });

  it("limits the message length", () => {
    const url = buildMailto("me@example.com", "s", { ...ok, message: "x".repeat(10_000) });
    expect(decodeURIComponent(url.split("body=")[1]).length).toBeLessThan(1700);
  });
});
