import type { FeatureFlagKey, FeatureFlags } from "../../config/feature-flags.js";

export class FeatureFlagService {
  constructor(private readonly flags: FeatureFlags) {}

  isEnabled(key: FeatureFlagKey): boolean {
    return this.flags[key];
  }
}
