import { CacheNamespace } from "../../cache/namespaces.js";
import type { CacheService } from "../../services/cache/cache.service.js";
import type {
  CachedTranslationValue,
  TranslationCacheRepository,
} from "./translation-cache.repository.js";

function buildStableId(textHash: string, targetLang: string): string {
  return `${textHash}:${targetLang}`;
}

export class InMemoryTranslationCacheRepository implements TranslationCacheRepository {
  constructor(private readonly cache: CacheService) {}

  async getCachedTranslation(
    textHash: string,
    targetLang: string,
  ): Promise<CachedTranslationValue | null> {
    const value = await this.cache.get<CachedTranslationValue>(
      CacheNamespace.TranslationResult,
      buildStableId(textHash, targetLang),
    );
    return value ?? null;
  }

  async setCachedTranslation(
    textHash: string,
    targetLang: string,
    value: CachedTranslationValue,
    ttlSec: number,
  ): Promise<void> {
    await this.cache.set(
      CacheNamespace.TranslationResult,
      buildStableId(textHash, targetLang),
      value,
      ttlSec,
    );
  }
}
