import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '@environments/environment';

import {
  DEV_FEATURE_FLAGS,
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
  private static readonly STORAGE_KEY = 'sitmun_feature_flags';
  private featureFlags: Record<FeatureFlagKeys, FeatureFlagConfig>;
  private featureFlagsSubject: BehaviorSubject<Record<FeatureFlagKeys, FeatureFlagConfig>>;

  /**
   * Observable for feature flag changes
   */
  get featureFlags$(): Observable<Record<FeatureFlagKeys, FeatureFlagConfig>> {
    return this.featureFlagsSubject.asObservable();
  }

  constructor() {
    if (environment.production) {
      this.featureFlags = PROD_FEATURE_FLAGS;
    } else {
      // Load persisted flags or use defaults
      this.featureFlags = this.loadPersistedFlags();
    }
    this.featureFlagsSubject = new BehaviorSubject(this.featureFlags);
  }

  /**
   * Load persisted feature flags from localStorage
   */
  private loadPersistedFlags(): Record<FeatureFlagKeys, FeatureFlagConfig> {
    try {
      const stored = localStorage.getItem(FeatureFlagService.STORAGE_KEY);
      if (stored !== null) {
        const parsedFlags = JSON.parse(stored);
        // Validate and merge with defaults
        const mergedFlags = { ...DEV_FEATURE_FLAGS };
        Object.keys(DEV_FEATURE_FLAGS).forEach((key) => {
          const flagKey = key as FeatureFlagKeys;
          if (parsedFlags[flagKey] && typeof parsedFlags[flagKey].enabled === 'boolean') {
            mergedFlags[flagKey] = {
              ...DEV_FEATURE_FLAGS[flagKey],
              enabled: parsedFlags[flagKey].enabled
            };
          }
        });
        return mergedFlags;
      }
    } catch (_) {
      // localStorage not available or error reading - use defaults
    }
    // Fall back to development defaults
    return { ...DEV_FEATURE_FLAGS };
  }

  /**
   * Persist feature flags to localStorage
   */
  private persistFlags(): void {
    try {
      // Only persist enabled state for each flag
      const flagsToStore: Record<string, { enabled: boolean }> = {};
      Object.keys(this.featureFlags).forEach((key) => {
        const flagKey = key as FeatureFlagKeys;
        flagsToStore[flagKey] = { enabled: this.featureFlags[flagKey].enabled };
      });
      localStorage.setItem(FeatureFlagService.STORAGE_KEY, JSON.stringify(flagsToStore));
    } catch (_) {
      // localStorage not available or error writing - ignore silently
    }
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
   * Gets feature flags grouped by category
   * @returns Map of category name to array of feature flag entries
   */
  getCategoriesMap(): Map<string, Array<{ key: FeatureFlagKeys; config: FeatureFlagConfig }>> {
    const categoriesMap = new Map<string, Array<{ key: FeatureFlagKeys; config: FeatureFlagConfig }>>();
    
    Object.keys(this.featureFlags).forEach((key) => {
      const flagKey = key as FeatureFlagKeys;
      const config = this.featureFlags[flagKey];
      const category = config.category;
      
      if (!categoriesMap.has(category)) {
        categoriesMap.set(category, []);
      }
      
      const categoryArray = categoriesMap.get(category);
      if (categoryArray) {
        categoryArray.push({ key: flagKey, config });
      }
    });
    
    // Sort flags within each category by key
    categoriesMap.forEach((flags) => {
      flags.sort((a, b) => a.config.key.localeCompare(b.config.key));
    });
    
    return categoriesMap;
  }

  /**
   * Gets list of category names
   * @returns Array of category names, sorted alphabetically
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    Object.values(this.featureFlags).forEach((config) => {
      categories.add(config.category);
    });
    return Array.from(categories).sort();
  }

  /**
   * Gets feature flags for a specific category
   * @param category - The category name
   * @returns Array of feature flag entries for the category
   */
  getFeaturesByCategory(category: string): Array<{ key: FeatureFlagKeys; config: FeatureFlagConfig }> {
    const categoriesMap = this.getCategoriesMap();
    const flags = categoriesMap.get(category) || [];
    // Return a new array with fresh config references to ensure we always get the latest state
    // This ensures Angular change detection picks up the changes
    return flags.map(flag => ({
      key: flag.key,
      config: this.featureFlags[flag.key] // Get fresh reference from current state
    }));
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
      this.persistFlags();
      this.featureFlagsSubject.next(this.featureFlags);
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
    this.featureFlags = { ...DEV_FEATURE_FLAGS };
    // Clear persisted flags
    try {
      localStorage.removeItem(FeatureFlagService.STORAGE_KEY);
    } catch (_) {
      // localStorage not available - ignore silently
    }
    this.featureFlagsSubject.next(this.featureFlags);
  }
}
