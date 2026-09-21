import { describe, expect, it } from "vitest";

import {
  buildChangeLanguageCustomId,
  isChangeLanguageCustomId,
  parseChangeLanguageCustomId,
} from "./translation-component.js";

describe("translation-component", () => {
  it("builds and parses a round-trip customId", () => {
    const customId = buildChangeLanguageCustomId("123456789012345678", "hi");
    expect(isChangeLanguageCustomId(customId)).toBe(true);
    expect(parseChangeLanguageCustomId(customId)).toEqual({
      messageId: "123456789012345678",
      currentLang: "hi",
    });
  });

  it("round-trips a hyphenated language code", () => {
    const customId = buildChangeLanguageCustomId("1", "zh-CN");
    expect(parseChangeLanguageCustomId(customId)).toEqual({
      messageId: "1",
      currentLang: "zh-CN",
    });
  });

  it("rejects unrelated customIds", () => {
    expect(isChangeLanguageCustomId("some:other:id")).toBe(false);
    expect(parseChangeLanguageCustomId("some:other:id")).toBeNull();
  });

  it("rejects malformed change-language customIds", () => {
    expect(parseChangeLanguageCustomId("translate:change-lang:")).toBeNull();
    expect(parseChangeLanguageCustomId("translate:change-lang:onlyid")).toBeNull();
    expect(parseChangeLanguageCustomId("translate:change-lang::hi")).toBeNull();
  });
});
