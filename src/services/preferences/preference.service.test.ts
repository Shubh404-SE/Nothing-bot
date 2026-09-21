import { describe, expect, it } from "vitest";

import type { PreferenceRepository } from "../../database/repositories/preference.repository.js";
import { PreferenceService } from "./preference.service.js";

function fakeRepository(overrides: Partial<PreferenceRepository> = {}): PreferenceRepository {
  return {
    getUserLanguage: async () => null,
    setUserLanguage: async () => {},
    getGuildLanguage: async () => null,
    setGuildLanguage: async () => {},
    ...overrides,
  };
}

describe("PreferenceService.resolveTargetLanguage", () => {
  it("uses the user preference when set and supported", async () => {
    const service = new PreferenceService(
      fakeRepository({ getUserLanguage: async () => "hi", getGuildLanguage: async () => "fr" }),
    );
    expect(await service.resolveTargetLanguage("u1", "g1")).toBe("hi");
  });

  it("falls back to the guild preference when the user has none", async () => {
    const service = new PreferenceService(
      fakeRepository({ getUserLanguage: async () => null, getGuildLanguage: async () => "fr" }),
    );
    expect(await service.resolveTargetLanguage("u1", "g1")).toBe("fr");
  });

  it("falls back to English when neither is set", async () => {
    const service = new PreferenceService(fakeRepository());
    expect(await service.resolveTargetLanguage("u1", "g1")).toBe("en");
  });

  it("falls back to English when guildId is null and no user preference exists", async () => {
    const service = new PreferenceService(fakeRepository());
    expect(await service.resolveTargetLanguage("u1", null)).toBe("en");
  });

  it("skips an unsupported stored user preference and falls through", async () => {
    const service = new PreferenceService(
      fakeRepository({
        getUserLanguage: async () => "xx-not-real",
        getGuildLanguage: async () => "fr",
      }),
    );
    expect(await service.resolveTargetLanguage("u1", "g1")).toBe("fr");
  });
});
