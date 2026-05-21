import { loadConfig } from "../config/index.js";
import { InMemoryTranslationStateRepository } from "../database/repositories/in-memory-translation-state.repository.js";
import { MemoryCacheProvider } from "../providers/cache/memory-cache.provider.js";
import { GoogleTranslateProvider } from "../providers/translation/google-translate.provider.js";
import { TimeoutTranslationProvider } from "../providers/translation/timeout-translation.provider.js";
import { CacheService } from "../services/cache/cache.service.js";
import { FeatureFlagService } from "../services/feature-flags/feature-flag.service.js";
import { TranslationConcurrencyLimiter } from "../services/translation/translation-concurrency-limiter.js";
import { TranslationService } from "../services/translation/translation.service.js";
import { NoopMetrics } from "../telemetry/noop-metrics.js";
import { createLogger } from "./logger.js";
import type { AppServices } from "./app-context.js";

export type { AppContext, AppServices } from "./app-context.js";

export function createServices(): AppServices {
  const config = loadConfig();
  const logger = createLogger(config);
  const metrics = new NoopMetrics();
  const featureFlags = new FeatureFlagService(config.featureFlags);

  const cacheProvider = new MemoryCacheProvider(config.env.CACHE_MAX_ENTRIES);
  const cacheService = new CacheService(cacheProvider);
  const translationStateRepository = new InMemoryTranslationStateRepository(cacheService);

  const innerProvider = new GoogleTranslateProvider();
  const translationProvider = new TimeoutTranslationProvider(
    innerProvider,
    config.env.TRANSLATION_TIMEOUT_MS,
  );

  const limiter = new TranslationConcurrencyLimiter(config.env.TRANSLATION_MAX_CONCURRENT);

  const translationService = new TranslationService(
    translationProvider,
    translationStateRepository,
    limiter,
    metrics,
    logger,
    config,
  );

  return {
    config,
    logger,
    metrics,
    featureFlags,
    translationService,
  };
}
