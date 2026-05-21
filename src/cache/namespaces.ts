export const CacheNamespace = {
  TranslationDedupe: "translation:dedupe",
  TranslationCooldown: "translation:cooldown",
  TranslationSlashDedupe: "translation:slash-dedupe",
} as const;

export type CacheNamespaceValue = (typeof CacheNamespace)[keyof typeof CacheNamespace];

export function buildCacheKey(namespace: CacheNamespaceValue, stableId: string): string {
  return `${namespace}:${stableId}`;
}
