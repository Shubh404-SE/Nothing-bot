import type { Logger } from "pino";

import type { CommandRegistry } from "../commands/registry.js";
import type { AppConfig } from "../config/index.js";
import type { FeatureFlagService } from "../services/feature-flags/feature-flag.service.js";
import type { PreferenceService } from "../services/preferences/preference.service.js";
import type { TranslationService } from "../services/translation/translation.service.js";
import type { Metrics } from "../telemetry/metrics.interface.js";

export type AppContext = {
  config: AppConfig;
  logger: Logger;
  metrics: Metrics;
  featureFlags: FeatureFlagService;
  translationService: TranslationService;
  preferenceService: PreferenceService;
  commandRegistry: CommandRegistry;
};

export type AppServices = Omit<AppContext, "commandRegistry">;
