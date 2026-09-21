import pino from "pino";
import { describe, expect, it, vi } from "vitest";

import { buildFeatureFlags } from "../../config/feature-flags.js";
import { envSchema } from "../../config/env.schema.js";
import type {
  CachedTranslationValue,
  TranslationCacheRepository,
} from "../../database/repositories/translation-cache.repository.js";
import type { TranslationStateRepository } from "../../database/repositories/translation-state.repository.js";
import type {
  TranslateParams,
  TranslateResult,
  TranslationProvider,
} from "../../providers/translation/translation-provider.interface.js";
import type { Metrics } from "../../telemetry/metrics.interface.js";
import { TranslationConcurrencyLimiter } from "./translation-concurrency-limiter.js";
import { TranslationService } from "./translation.service.js";

const silentLogger = pino({ level: "silent" });

function fakeConfig() {
  const env = envSchema.parse({ DISCORD_TOKEN: "token", DISCORD_CLIENT_ID: "client" });
  return { env, featureFlags: buildFeatureFlags(env) };
}

function fakeMetrics(): Metrics {
  return { increment: vi.fn(), histogram: vi.fn() };
}

function fakeStateRepository(
  overrides: Partial<TranslationStateRepository> = {},
): TranslationStateRepository {
  return {
    tryAcquireReactionDedupeLock: async () => true,
    tryAcquireSlashDedupeLock: async () => true,
    isOnCooldown: async () => false,
    setCooldown: async () => {},
    ...overrides,
  };
}

function fakeCacheRepository(): TranslationCacheRepository & {
  store: Map<string, CachedTranslationValue>;
} {
  const store = new Map<string, CachedTranslationValue>();
  return {
    store,
    getCachedTranslation: async (textHash, targetLang) =>
      store.get(`${textHash}:${targetLang}`) ?? null,
    setCachedTranslation: async (textHash, targetLang, value) => {
      store.set(`${textHash}:${targetLang}`, value);
    },
  };
}

function fakeProvider(
  translate: (params: TranslateParams) => Promise<TranslateResult>,
): TranslationProvider {
  return { translate };
}

describe("TranslationService", () => {
  it("calls the provider on a cache miss and caches the result", async () => {
    const translateSpy = vi.fn(
      async (): Promise<TranslateResult> => ({
        translatedText: "hola",
        detectedSourceLang: "en",
      }),
    );
    const cache = fakeCacheRepository();
    const service = new TranslationService(
      fakeProvider(translateSpy),
      fakeStateRepository(),
      cache,
      new TranslationConcurrencyLimiter(5),
      fakeMetrics(),
      silentLogger,
      fakeConfig(),
    );

    const result = await service.translateSlash({
      userId: "u1",
      guildId: null,
      interactionId: "i1",
      text: "hello",
      targetLang: "es",
      applyCooldown: false,
      applyDedupe: false,
    });

    expect(result.translatedText).toBe("hola");
    expect(translateSpy).toHaveBeenCalledTimes(1);
    expect(cache.store.size).toBe(1);
  });

  it("serves a repeat translation from the cache without calling the provider again", async () => {
    const translateSpy = vi.fn(
      async (): Promise<TranslateResult> => ({
        translatedText: "hola",
        detectedSourceLang: "en",
      }),
    );
    const cache = fakeCacheRepository();
    const service = new TranslationService(
      fakeProvider(translateSpy),
      fakeStateRepository(),
      cache,
      new TranslationConcurrencyLimiter(5),
      fakeMetrics(),
      silentLogger,
      fakeConfig(),
    );

    const ctx = {
      userId: "u1",
      guildId: null,
      interactionId: "i1",
      text: "hello",
      targetLang: "es",
      applyCooldown: false,
      applyDedupe: false,
    } as const;

    await service.translateSlash(ctx);
    const second = await service.translateSlash({ ...ctx, interactionId: "i2" });

    expect(second.translatedText).toBe("hola");
    expect(translateSpy).toHaveBeenCalledTimes(1);
  });

  it("rejects with a rate-limit error when on cooldown and applyCooldown is true", async () => {
    const service = new TranslationService(
      fakeProvider(async () => ({ translatedText: "hola" })),
      fakeStateRepository({ isOnCooldown: async () => true }),
      fakeCacheRepository(),
      new TranslationConcurrencyLimiter(5),
      fakeMetrics(),
      silentLogger,
      fakeConfig(),
    );

    await expect(
      service.translateSlash({
        userId: "u1",
        guildId: "g1",
        interactionId: "i1",
        text: "hello",
        targetLang: "es",
        applyCooldown: true,
        applyDedupe: false,
      }),
    ).rejects.toMatchObject({ code: "RATE_LIMITED" });
  });

  it("bypasses the cooldown check entirely when applyCooldown is false", async () => {
    const isOnCooldown = vi.fn(async () => true);
    const service = new TranslationService(
      fakeProvider(async () => ({ translatedText: "hola" })),
      fakeStateRepository({ isOnCooldown }),
      fakeCacheRepository(),
      new TranslationConcurrencyLimiter(5),
      fakeMetrics(),
      silentLogger,
      fakeConfig(),
    );

    const result = await service.translateSlash({
      userId: "u1",
      guildId: "g1",
      interactionId: "i1",
      text: "hello",
      targetLang: "es",
      applyCooldown: false,
      applyDedupe: false,
    });

    expect(result.translatedText).toBe("hola");
  });
});
