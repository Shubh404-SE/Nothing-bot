import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import type { Logger } from "pino";

import type { PreferenceRepository } from "./preference.repository.js";

type PreferenceFileShape = {
  version: 1;
  users: Record<string, { language: string }>;
  guilds: Record<string, { language: string }>;
};

function emptyState(): PreferenceFileShape {
  return { version: 1, users: {}, guilds: {} };
}

export class JsonFilePreferenceRepository implements PreferenceRepository {
  private state: PreferenceFileShape | null = null;
  private loadPromise: Promise<PreferenceFileShape> | null = null;
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(
    private readonly filePath: string,
    private readonly logger: Logger,
  ) {}

  async getUserLanguage(userId: string): Promise<string | null> {
    const state = await this.ensureLoaded();
    return state.users[userId]?.language ?? null;
  }

  async setUserLanguage(userId: string, lang: string): Promise<void> {
    const state = await this.ensureLoaded();
    state.users[userId] = { language: lang };
    await this.enqueuePersist(state);
  }

  async getGuildLanguage(guildId: string): Promise<string | null> {
    const state = await this.ensureLoaded();
    return state.guilds[guildId]?.language ?? null;
  }

  async setGuildLanguage(guildId: string, lang: string): Promise<void> {
    const state = await this.ensureLoaded();
    state.guilds[guildId] = { language: lang };
    await this.enqueuePersist(state);
  }

  private async ensureLoaded(): Promise<PreferenceFileShape> {
    if (this.state) {
      return this.state;
    }
    if (!this.loadPromise) {
      this.loadPromise = this.load();
    }
    this.state = await this.loadPromise;
    return this.state;
  }

  private async load(): Promise<PreferenceFileShape> {
    try {
      const raw = await readFile(this.filePath, "utf8");
      const parsed = JSON.parse(raw) as Partial<PreferenceFileShape>;
      return {
        version: 1,
        users: parsed.users ?? {},
        guilds: parsed.guilds ?? {},
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        this.logger.warn(
          { err: error, filePath: this.filePath },
          "Failed to read preference file, starting from empty state",
        );
      }
      return emptyState();
    }
  }

  private enqueuePersist(state: PreferenceFileShape): Promise<void> {
    this.writeQueue = this.writeQueue.then(() => this.persist(state));
    return this.writeQueue;
  }

  private async persist(state: PreferenceFileShape): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    const tmpPath = `${this.filePath}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(tmpPath, JSON.stringify(state, null, 2), "utf8");
    await rename(tmpPath, this.filePath);
  }
}
