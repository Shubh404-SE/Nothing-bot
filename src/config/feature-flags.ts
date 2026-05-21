import type { EnvSchema } from "./env.schema.js";

export type FeatureFlagKey = "translationSlash" | "translationReaction";

export type FeatureFlags = Record<FeatureFlagKey, boolean>;

export function buildFeatureFlags(env: EnvSchema): FeatureFlags {
  return {
    translationSlash: env.FEATURE_TRANSLATION_SLASH,
    translationReaction: env.FEATURE_TRANSLATION_REACTION,
  };
}
