import type { Logger } from "pino";

import type { AppConfig } from "../../config/index.js";
import type { TranslationCacheRepository } from "../../database/repositories/translation-cache.repository.js";
import type { TranslationStateRepository } from "../../database/repositories/translation-state.repository.js";
import { ProviderError } from "../../shared/errors/provider.error.js";
import { UserFacingError } from "../../shared/errors/user-facing.error.js";
import type { Metrics } from "../../telemetry/metrics.interface.js";
import type {
  ReactionTranslationContext,
  SlashTranslationContext,
  TranslationResponse,
} from "../../types/translation.types.js";
import { truncateForDiscord } from "../../utils/text/truncate-for-discord.js";
import {
  isSupportedSlashLanguage,
  normalizeSlashLanguageCode,
} from "../../modules/translation/language-map.js";
import {
  buildReactionCooldownKey,
  buildReactionDedupeKey,
  buildSlashCooldownKey,
  buildSlashDedupeKey,
  sha1TextHash,
  simpleTextHash,
} from "../../modules/translation/translation.policy.js";
import type { TranslationProvider } from "../../providers/translation/translation-provider.interface.js";
import { type TranslationConcurrencyLimiter } from "./translation-concurrency-limiter.js";

export class TranslationService {
  constructor(
    private readonly provider: TranslationProvider,
    private readonly repository: TranslationStateRepository,
    private readonly translationCache: TranslationCacheRepository,
    private readonly limiter: TranslationConcurrencyLimiter,
    private readonly metrics: Metrics,
    private readonly logger: Logger,
    private readonly config: AppConfig,
  ) {}

  async translateSlash(ctx: SlashTranslationContext): Promise<TranslationResponse> {
    const targetLang = normalizeSlashLanguageCode(ctx.targetLang);
    if (!isSupportedSlashLanguage(targetLang)) {
      throw new UserFacingError(
        `Language \`${targetLang}\` is not supported. Use a supported ISO code (e.g. en, hi, es).`,
        "UNSUPPORTED_LANGUAGE",
      );
    }

    const cooldownKey = buildSlashCooldownKey(ctx.userId, ctx.guildId);
    if (ctx.applyCooldown && (await this.repository.isOnCooldown(cooldownKey))) {
      throw new UserFacingError(
        "You're translating too quickly. Please wait a moment before trying again.",
        "RATE_LIMITED",
      );
    }

    const input = this.validateInput(ctx.text);

    if (ctx.applyDedupe) {
      const dedupeKey = buildSlashDedupeKey(ctx.userId, simpleTextHash(input), targetLang);
      const acquired = await this.repository.tryAcquireSlashDedupeLock(
        dedupeKey,
        this.config.env.TRANSLATION_SLASH_DEDUPE_TTL_SEC,
      );
      if (!acquired) {
        throw new UserFacingError(
          "You recently requested this translation. Please wait a moment.",
          "DUPLICATE_REQUEST",
        );
      }
    }

    if (ctx.applyCooldown) {
      await this.repository.setCooldown(
        cooldownKey,
        this.config.env.TRANSLATION_SLASH_COOLDOWN_TTL_SEC,
      );
    }

    return this.executeTranslation(input, targetLang);
  }

  async translateReaction(ctx: ReactionTranslationContext): Promise<TranslationResponse | null> {
    const cooldownKey = buildReactionCooldownKey(ctx.guildId, ctx.userId);
    if (await this.repository.isOnCooldown(cooldownKey)) {
      return null;
    }

    const dedupeKey = buildReactionDedupeKey(
      ctx.guildId,
      ctx.channelId,
      ctx.messageId,
      ctx.targetLang,
    );
    const acquired = await this.repository.tryAcquireReactionDedupeLock(
      dedupeKey,
      this.config.env.TRANSLATION_DEDUPE_TTL_SEC,
    );
    if (!acquired) {
      return null;
    }

    await this.repository.setCooldown(cooldownKey, this.config.env.TRANSLATION_COOLDOWN_TTL_SEC);

    const input = this.validateInput(ctx.text);
    return this.executeTranslation(input, ctx.targetLang);
  }

  private validateInput(text: string): string {
    const trimmed = text.trim();
    if (!trimmed) {
      throw new UserFacingError("Cannot translate empty text.", "EMPTY_TEXT");
    }
    if (trimmed.length > this.config.env.MAX_TRANSLATION_INPUT_LENGTH) {
      throw new UserFacingError(
        `Text exceeds maximum length of ${this.config.env.MAX_TRANSLATION_INPUT_LENGTH} characters.`,
        "TEXT_TOO_LONG",
      );
    }
    return trimmed;
  }

  private async executeTranslation(text: string, targetLang: string): Promise<TranslationResponse> {
    const start = Date.now();
    this.metrics.increment("translation.requests", { targetLang });

    try {
      const textHash = sha1TextHash(text);
      const cached = await this.translationCache.getCachedTranslation(textHash, targetLang);

      const rawResult = cached
        ? { translatedText: cached.translatedText, detectedSourceLang: cached.detectedSourceLang }
        : await this.limiter.run(() => this.provider.translate({ text, targetLang }));

      if (cached) {
        this.metrics.increment("translation.cache_hits", { targetLang });
      } else {
        this.metrics.increment("translation.cache_misses", { targetLang });
        await this.translationCache.setCachedTranslation(
          textHash,
          targetLang,
          rawResult,
          this.config.env.TRANSLATION_RESULT_CACHE_TTL_SEC,
        );
      }

      const truncatedOutput = truncateForDiscord(
        rawResult.translatedText,
        this.config.env.MAX_TRANSLATION_OUTPUT_LENGTH,
      );

      this.metrics.histogram("translation.latency_ms", Date.now() - start, {
        targetLang,
        success: true,
        cacheHit: Boolean(cached),
      });

      return {
        originalText: text,
        translatedText: truncatedOutput.text,
        targetLang,
        detectedSourceLang: rawResult.detectedSourceLang,
        truncated: truncatedOutput.truncated,
      };
    } catch (error) {
      this.metrics.increment("translation.failures", { targetLang });
      this.metrics.histogram("translation.latency_ms", Date.now() - start, {
        targetLang,
        success: false,
      });

      if (error instanceof UserFacingError) {
        throw error;
      }

      this.logger.warn({ err: error, targetLang }, "Translation failed");
      if (error instanceof ProviderError) {
        throw new UserFacingError(
          "Translation is temporarily unavailable. Please try again later.",
          "PROVIDER_UNAVAILABLE",
        );
      }

      throw new UserFacingError(
        "Something went wrong while translating. Please try again.",
        "TRANSLATION_FAILED",
      );
    }
  }
}
