import { describe, expect, it } from "vitest";

import {
  buildReactionDedupeKey,
  buildSlashDedupeKey,
  shouldIgnoreMessageForTranslation,
  simpleTextHash,
} from "./translation.policy.js";

describe("translation.policy", () => {
  it("ignores bot messages", () => {
    expect(shouldIgnoreMessageForTranslation({ content: "hello", authorIsBot: true })).toBe(true);
  });

  it("ignores empty content", () => {
    expect(shouldIgnoreMessageForTranslation({ content: "   ", authorIsBot: false })).toBe(true);
  });

  it("builds stable dedupe keys", () => {
    expect(buildReactionDedupeKey("g1", "c1", "m1", "hi")).toBe("g1:c1:m1:hi");
    expect(buildSlashDedupeKey("u1", simpleTextHash("hello"), "en")).toContain("u1:");
  });
});
