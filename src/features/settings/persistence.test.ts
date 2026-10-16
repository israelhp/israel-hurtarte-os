import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  LANG_KEY,
  SETTINGS_KEY,
  TOUR_KEY,
  parseSettings,
  readLang,
  readSettings,
  readTourDone,
  writeLang,
  writeSettings,
  writeTourDone,
} from "./persistence";

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe("parseSettings", () => {
  it("keeps whitelisted values", () => {
    expect(parseSettings('{"theme":"light","accent":"purple"}')).toEqual({
      theme: "light",
      accent: "purple",
    });
  });
  it("ignores unknown or malicious values and malformed JSON", () => {
    expect(parseSettings('{"theme":"neon","accent":"<script>"}')).toEqual({});
    expect(parseSettings('{"theme":"dark","accent":1}')).toEqual({ theme: "dark" });
    for (const bad of [null, "", "not json", "[]", "null", "42", '"light"'])
      expect(parseSettings(bad as string | null), String(bad)).toEqual({});
  });
});

describe("storage round trips", () => {
  it("settings", () => {
    writeSettings({ theme: "auto", accent: "green" });
    expect(JSON.parse(localStorage.getItem(SETTINGS_KEY)!)).toEqual({
      theme: "auto",
      accent: "green",
    });
    expect(readSettings()).toEqual({ theme: "auto", accent: "green" });
  });
  it("language only accepts es/en", () => {
    expect(readLang()).toBeNull();
    writeLang("en");
    expect(readLang()).toBe("en");
    localStorage.setItem(LANG_KEY, "fr");
    expect(readLang()).toBeNull();
  });
  it("tour flag", () => {
    expect(readTourDone()).toBe(false);
    writeTourDone();
    expect(localStorage.getItem(TOUR_KEY)).toBe("1");
    expect(readTourDone()).toBe(true);
  });
});

describe("when storage is unavailable", () => {
  it("never throws and falls back to defaults", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(readSettings()).toEqual({});
    expect(readLang()).toBeNull();
    expect(readTourDone()).toBe(false);
    expect(() => writeSettings({ theme: "dark", accent: "blue" })).not.toThrow();
    expect(() => writeLang("es")).not.toThrow();
    expect(() => writeTourDone()).not.toThrow();
  });
});
