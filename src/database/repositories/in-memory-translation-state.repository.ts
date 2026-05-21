import { CacheNamespace } from "../../cache/namespaces.js";
import type { CacheService } from "../../services/cache/cache.service.js";
import type { TranslationStateRepository } from "./translation-state.repository.js";

const LOCK_VALUE = "1";
const COOLDOWN_VALUE = "1";

export class InMemoryTranslationStateRepository implements TranslationStateRepository {
  constructor(private readonly cache: CacheService) {}

  async tryAcquireReactionDedupeLock(key: string, ttlSec: number): Promise<boolean> {
    return this.tryAcquireLock(CacheNamespace.TranslationDedupe, key, ttlSec);
  }

  async tryAcquireSlashDedupeLock(key: string, ttlSec: number): Promise<boolean> {
    return this.tryAcquireLock(CacheNamespace.TranslationSlashDedupe, key, ttlSec);
  }

  private async tryAcquireLock(
    namespace:
      | typeof CacheNamespace.TranslationDedupe
      | typeof CacheNamespace.TranslationSlashDedupe,
    key: string,
    ttlSec: number,
  ): Promise<boolean> {
    const exists = await this.cache.has(namespace, key);
    if (exists) {
      return false;
    }
    await this.cache.set(namespace, key, LOCK_VALUE, ttlSec);
    return true;
  }

  async isOnCooldown(key: string): Promise<boolean> {
    return this.cache.has(CacheNamespace.TranslationCooldown, key);
  }

  async setCooldown(key: string, ttlSec: number): Promise<void> {
    await this.cache.set(CacheNamespace.TranslationCooldown, key, COOLDOWN_VALUE, ttlSec);
  }
}
