import { describe, expect, it } from "vitest";

import { resolveReactionFlag } from "./resolve-reaction-flag.js";

describe("resolveReactionFlag", () => {
  it("parses unicode flag emoji", () => {
    expect(resolveReactionFlag({ name: "🇮🇳", id: null })).toEqual({ countryCode: "IN" });
  });

  it("parses Discord custom flag_in emoji", () => {
    expect(resolveReactionFlag({ name: "flag_in", id: "123" })).toEqual({ countryCode: "IN" });
  });

  it("rejects plain us custom emoji name (no false US default)", () => {
    expect(resolveReactionFlag({ name: "us", id: "123" })).toBeNull();
  });

  it("rejects non-flag emoji", () => {
    expect(resolveReactionFlag({ name: "👍", id: null })).toBeNull();
  });
});
