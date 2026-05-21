import type { CacheProvider } from "../../cache/cache-provider.interface.js";

type CacheEntry = {
  value: unknown;
  expiresAt: number;
};

export class MemoryCacheProvider implements CacheProvider {
  private readonly store = new Map<string, CacheEntry>();
  private readonly maxEntries: number;

  constructor(maxEntries: number) {
    this.maxEntries = maxEntries;
  }

  async get<T>(key: string): Promise<T | undefined> {
    const entry = this.store.get(key);
    if (!entry) {
      return undefined;
    }
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSec: number): Promise<void> {
    this.evictIfNeeded();
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSec * 1000,
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== undefined;
  }

  private evictIfNeeded(): void {
    if (this.store.size < this.maxEntries) {
      return;
    }
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (entry.expiresAt <= now) {
        this.store.delete(key);
      }
    }
    if (this.store.size >= this.maxEntries) {
      const firstKey = this.store.keys().next().value;
      if (firstKey !== undefined) {
        this.store.delete(firstKey);
      }
    }
  }
}
