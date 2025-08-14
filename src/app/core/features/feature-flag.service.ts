import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import {
  DEV_FEATURE_FLAGS,
  FEATURE_FLAGS,
  FeatureFlagConfig,
  FeatureFlagKeys,
  PROD_FEATURE_FLAGS
} from './feature-flag.config';

/**
 * Service for managing feature flags in the application.
 * Provides type-safe access to feature flags and their states.
 *
 * In development mode, features can be toggled for testing purposes.
 * In production, feature states are fixed based on the PROD_FEATURE_FLAGS configuration.
 */
@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private featureFlags: Record<FeatureFlagKeys, FeatureFlagConfig>;

  constructor() {
    this.featureFlags = environment.production ? PROD_FEATURE_FLAGS : DEV_FEATURE_FLAGS;
  }

  /**
   * Checks if a feature flag is enabled
   * @param flag - The feature flag to check
   * @returns boolean indicating if the feature is enabled
   */
  isFeatureEnabled(flag: FeatureFlagKeys): boolean {
    return this.featureFlags[flag]?.enabled ?? false;
  }

  /**
   * Checks if a feature flag is experimental
   * @param flag - The feature flag to check
   * @returns boolean indicating if the feature is experimental
   */
  isFeatureExperimental(flag: FeatureFlagKeys): boolean {
    return this.featureFlags[flag]?.experimental ?? false;
  }

  /**
   * Gets the configuration for a feature flag
   * @param flag - The feature flag to get configuration for
   * @returns The feature flag configuration or undefined if not found
   */
  getFeatureConfig(flag: FeatureFlagKeys): FeatureFlagConfig | undefined {
    return this.featureFlags[flag];
  }

  /**
   * Gets all feature flag configurations
   * @returns Record of all feature flag configurations
   */
  getAllFeatureConfigs(): Record<FeatureFlagKeys, FeatureFlagConfig> {
    return this.featureFlags;
  }

  /**
   * Toggles a feature flag state (development mode only)
   * @param flag - The feature flag to toggle
   * @throws Error if called in production mode
   */
  toggleFeature(flag: FeatureFlagKeys): void {
    if (environment.production) {
      throw new Error('Feature flags cannot be toggled in production mode');
    }

    const config = this.featureFlags[flag];
    if (config) {
      this.featureFlags = {
        ...this.featureFlags,
        [flag]: {
          ...config,
          enabled: !config.enabled
        }
      };
    }
  }

  /**
   * Resets all feature flags to their default state
   * @throws Error if called in production mode
   */
  resetFeatures(): void {
    if (environment.production) {
      throw new Error('Feature flags cannot be reset in production mode');
    }
    this.featureFlags = DEV_FEATURE_FLAGS;
  }
}
