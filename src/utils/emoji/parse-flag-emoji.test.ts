import { describe, expect, it } from "vitest";

import { parseFlagEmoji } from "./parse-flag-emoji.js";

describe("parseFlagEmoji", () => {
  it("parses India flag to IN", () => {
    expect(parseFlagEmoji("🇮🇳")).toBe("IN");
  });

  it("parses US flag to US", () => {
    expect(parseFlagEmoji("🇺🇸")).toBe("US");
  });

  it("returns null for non-flag emoji", () => {
    expect(parseFlagEmoji("😀")).toBeNull();
    expect(parseFlagEmoji("a")).toBeNull();
  });
});
