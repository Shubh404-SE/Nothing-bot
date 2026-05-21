import "dotenv/config";

import { buildFeatureFlags, type FeatureFlags } from "./feature-flags.js";
import { envSchema } from "./env.schema.js";

export type AppConfig = {
  env: ReturnType<typeof envSchema.parse>;
  featureFlags: FeatureFlags;
};

export function loadConfig(): AppConfig {
  const env = envSchema.parse(process.env);
  return {
    env,
    featureFlags: buildFeatureFlags(env),
  };
}

export { buildFeatureFlags, type FeatureFlags, type FeatureFlagKey } from "./feature-flags.js";
