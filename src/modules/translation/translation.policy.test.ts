import { describe, expect, it } from "vitest";

import {
  buildReactionDedupeKey,
  buildSlashCooldownKey,
  buildSlashDedupeKey,
  sha1TextHash,
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

  it("builds slash cooldown keys, keying DMs distinctly from guilds", () => {
    expect(buildSlashCooldownKey("u1", "g1")).toBe("g1:u1:slash-translate");
    expect(buildSlashCooldownKey("u1", null)).toBe("dm:u1:slash-translate");
  });

  it("produces a stable, deterministic sha1 hash", () => {
    const first = sha1TextHash("hello world");
    const second = sha1TextHash("hello world");
    expect(first).toBe(second);
    expect(first).toMatch(/^[0-9a-f]{40}$/);
  });

  it("produces different hashes for different text", () => {
    expect(sha1TextHash("hello")).not.toBe(sha1TextHash("hello!"));
  });
});
