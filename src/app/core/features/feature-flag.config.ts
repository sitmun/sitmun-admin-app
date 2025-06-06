/**
 * Configuration interface for feature flags
 */
export interface FeatureFlagConfig {
  key: string;
  enabled: boolean;
  experimental?: boolean;
  description: string;
  category: string;
}

/**
 * Available feature flags in the application
 */
export const FEATURE_FLAGS = {
  LAYERS_QUERYABLE_FEATURE: 'layers-queryable-feature',
  LAYERS_SOURCE_FEATURE: 'layers-source-feature',
} as const;

export type FeatureFlagKeys = keyof typeof FEATURE_FLAGS;

/**
 * Production environment feature flag configuration
 */
export const PROD_FEATURE_FLAGS: Record<FeatureFlagKeys, FeatureFlagConfig> = {
  LAYERS_QUERYABLE_FEATURE: {
    key: FEATURE_FLAGS.LAYERS_QUERYABLE_FEATURE,
    enabled: false,
    description: 'Enable queryable feature functionality for layers',
    category: 'Layers'
  },
  LAYERS_SOURCE_FEATURE: {
    key: FEATURE_FLAGS.LAYERS_SOURCE_FEATURE,
    enabled: false,
    description: 'Enable source feature functionality for layers',
    category: 'Layers'
  }
};

/**
 * Development environment feature flag configuration
 */
export const DEV_FEATURE_FLAGS: Record<FeatureFlagKeys, FeatureFlagConfig> = {
  LAYERS_QUERYABLE_FEATURE: {
    key: FEATURE_FLAGS.LAYERS_QUERYABLE_FEATURE,
    enabled: true,
    experimental: true,
    description: 'Enable queryable feature functionality for layers',
    category: 'Layers'
  },
  LAYERS_SOURCE_FEATURE: {
    key: FEATURE_FLAGS.LAYERS_SOURCE_FEATURE,
    enabled: true,
    experimental: true,
    description: 'Enable source feature functionality for layers',
    category: 'Layers'
  }
}; 