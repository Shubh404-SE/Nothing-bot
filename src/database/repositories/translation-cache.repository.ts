export type CachedTranslationValue = {
  translatedText: string;
  detectedSourceLang?: string;
};

export interface TranslationCacheRepository {
  getCachedTranslation(
    textHash: string,
    targetLang: string,
  ): Promise<CachedTranslationValue | null>;
  setCachedTranslation(
    textHash: string,
    targetLang: string,
    value: CachedTranslationValue,
    ttlSec: number,
  ): Promise<void>;
}
