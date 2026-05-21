import { z } from "zod";

import {
  DEFAULT_CACHE_MAX_ENTRIES,
  DEFAULT_MAX_TRANSLATION_INPUT_LENGTH,
  DEFAULT_MAX_TRANSLATION_OUTPUT_LENGTH,
  DEFAULT_TRANSLATION_COOLDOWN_TTL_SEC,
  DEFAULT_TRANSLATION_DEDUPE_TTL_SEC,
  DEFAULT_TRANSLATION_MAX_CONCURRENT,
  DEFAULT_TRANSLATION_SLASH_DEDUPE_TTL_SEC,
  DEFAULT_TRANSLATION_TIMEOUT_MS,
} from "./constants.js";

function booleanFromEnv(defaultValue: boolean) {
  return z
    .union([z.boolean(), z.enum(["true", "false", "1", "0"])])
    .optional()
    .transform((value) => {
      if (value === undefined) {
        return defaultValue;
      }
      if (typeof value === "boolean") {
        return value;
      }
      return value === "true" || value === "1";
    });
}

export const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_GUILD_ID: z.string().optional(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  FEATURE_TRANSLATION_SLASH: booleanFromEnv(true),
  FEATURE_TRANSLATION_REACTION: booleanFromEnv(true),
  TRANSLATION_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(DEFAULT_TRANSLATION_TIMEOUT_MS),
  TRANSLATION_MAX_CONCURRENT: z.coerce
    .number()
    .int()
    .positive()
    .default(DEFAULT_TRANSLATION_MAX_CONCURRENT),
  MAX_TRANSLATION_INPUT_LENGTH: z.coerce
    .number()
    .int()
    .positive()
    .default(DEFAULT_MAX_TRANSLATION_INPUT_LENGTH),
  MAX_TRANSLATION_OUTPUT_LENGTH: z.coerce
    .number()
    .int()
    .positive()
    .default(DEFAULT_MAX_TRANSLATION_OUTPUT_LENGTH),
  TRANSLATION_DEDUPE_TTL_SEC: z.coerce
    .number()
    .int()
    .positive()
    .default(DEFAULT_TRANSLATION_DEDUPE_TTL_SEC),
  TRANSLATION_COOLDOWN_TTL_SEC: z.coerce
    .number()
    .int()
    .positive()
    .default(DEFAULT_TRANSLATION_COOLDOWN_TTL_SEC),
  TRANSLATION_SLASH_DEDUPE_TTL_SEC: z.coerce
    .number()
    .int()
    .positive()
    .default(DEFAULT_TRANSLATION_SLASH_DEDUPE_TTL_SEC),
  CACHE_MAX_ENTRIES: z.coerce.number().int().positive().default(DEFAULT_CACHE_MAX_ENTRIES),
});

export type EnvSchema = z.infer<typeof envSchema>;
