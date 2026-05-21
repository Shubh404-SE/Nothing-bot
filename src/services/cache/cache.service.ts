import { buildCacheKey, type CacheNamespaceValue } from "../../cache/namespaces.js";
import type { CacheProvider } from "../../cache/cache-provider.interface.js";

export class CacheService {
  constructor(private readonly provider: CacheProvider) {}

  async get<T>(namespace: CacheNamespaceValue, stableId: string): Promise<T | undefined> {
    return this.provider.get<T>(buildCacheKey(namespace, stableId));
  }

  async set<T>(
    namespace: CacheNamespaceValue,
    stableId: string,
    value: T,
    ttlSec: number,
  ): Promise<void> {
    await this.provider.set(buildCacheKey(namespace, stableId), value, ttlSec);
  }

  async has(namespace: CacheNamespaceValue, stableId: string): Promise<boolean> {
    return this.provider.has(buildCacheKey(namespace, stableId));
  }

  async delete(namespace: CacheNamespaceValue, stableId: string): Promise<void> {
    await this.provider.delete(buildCacheKey(namespace, stableId));
  }
}
