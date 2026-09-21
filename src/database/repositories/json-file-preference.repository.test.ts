import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import pino from "pino";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { JsonFilePreferenceRepository } from "./json-file-preference.repository.js";

const silentLogger = pino({ level: "silent" });

describe("JsonFilePreferenceRepository", () => {
  let dir: string;
  let filePath: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "nothing-bot-prefs-"));
    filePath = path.join(dir, "preferences.json");
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("returns null for unset preferences", async () => {
    const repo = new JsonFilePreferenceRepository(filePath, silentLogger);
    expect(await repo.getUserLanguage("u1")).toBeNull();
    expect(await repo.getGuildLanguage("g1")).toBeNull();
  });

  it("round-trips user and guild languages", async () => {
    const repo = new JsonFilePreferenceRepository(filePath, silentLogger);
    await repo.setUserLanguage("u1", "hi");
    await repo.setGuildLanguage("g1", "fr");

    expect(await repo.getUserLanguage("u1")).toBe("hi");
    expect(await repo.getGuildLanguage("g1")).toBe("fr");
  });

  it("persists to disk and reloads from a fresh instance", async () => {
    const repo1 = new JsonFilePreferenceRepository(filePath, silentLogger);
    await repo1.setUserLanguage("u1", "ja");

    const repo2 = new JsonFilePreferenceRepository(filePath, silentLogger);
    expect(await repo2.getUserLanguage("u1")).toBe("ja");
  });

  it("starts from empty state if the file does not exist yet", async () => {
    const repo = new JsonFilePreferenceRepository(path.join(dir, "missing.json"), silentLogger);
    expect(await repo.getUserLanguage("u1")).toBeNull();
  });
});
