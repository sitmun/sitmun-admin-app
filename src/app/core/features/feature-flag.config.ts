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
  /** Service CRS lists in the profile; pairs with STM_CONF viewer.useCrsListForServiceCrs on the platform. */
  SERVICES_CRS_LIST: 'services-crs-list',
  /** Service-level HTTP/query parameters (viewer + proxy); admin UI tab on the service form. */
  SERVICES_PARAMETERS_FEATURE: 'services-parameters-feature',
  /** Layers form: legend type / legend URL tab (not in SITNA client profile yet). */
  LAYERS_LEGEND_TAB_FEATURE: 'layers-legend-tab',
  /** Layers form: OGC style names grid and use-all-styles (not in SITNA client profile yet). */
  LAYERS_CARTOGRAPHY_STYLES_TAB_FEATURE: 'layers-cartography-styles-tab',
  /** Layers form: territorial filters and apply-filter toggles (not in viewer client profile yet). */
  LAYERS_FILTERS_TAB_FEATURE: 'layers-filters-tab',
  /** Layers form: GetFeatureInfo / queryable layer subset and optional cartography parameters (not in SITNA client profile yet). */
  LAYERS_FEATURE_INFORMATION_TAB_FEATURE: 'layers-feature-information-tab',
  /** Application form: comma-separated scale denominators (not in viewer client profile yet). */
  APPLICATION_SCALES_FEATURE: 'application-scales',
  /** Application form: tree auto-refresh toggle (not in viewer client profile yet). */
  APPLICATION_TREE_AUTO_REFRESH_FEATURE: 'application-tree-auto-refresh',
} as const;

export type FeatureFlagKeys = keyof typeof FEATURE_FLAGS;

/**
 * Production environment feature flag configuration
 */
export const PROD_FEATURE_FLAGS: Record<FeatureFlagKeys, FeatureFlagConfig> = {
  LAYERS_QUERYABLE_FEATURE: {
    key: FEATURE_FLAGS.LAYERS_QUERYABLE_FEATURE,
    enabled: false,
    description: 'featureFlags.layersQueryableFeature.description',
    category: 'Layers'
  },
  LAYERS_SOURCE_FEATURE: {
    key: FEATURE_FLAGS.LAYERS_SOURCE_FEATURE,
    enabled: false,
    description: 'featureFlags.layersSourceFeature.description',
    category: 'Layers'
  },
  SERVICES_CRS_LIST: {
    key: FEATURE_FLAGS.SERVICES_CRS_LIST,
    enabled: false,
    description: 'featureFlags.servicesCrsList.description',
    category: 'Services'
  },
  SERVICES_PARAMETERS_FEATURE: {
    key: FEATURE_FLAGS.SERVICES_PARAMETERS_FEATURE,
    enabled: true,
    description: 'featureFlags.servicesParametersFeature.description',
    category: 'Services'
  },
  LAYERS_LEGEND_TAB_FEATURE: {
    key: FEATURE_FLAGS.LAYERS_LEGEND_TAB_FEATURE,
    enabled: false,
    experimental: true,
    description: 'featureFlags.layersLegendTab.description',
    category: 'Layers'
  },
  LAYERS_CARTOGRAPHY_STYLES_TAB_FEATURE: {
    key: FEATURE_FLAGS.LAYERS_CARTOGRAPHY_STYLES_TAB_FEATURE,
    enabled: false,
    experimental: true,
    description: 'featureFlags.layersCartographyStylesTab.description',
    category: 'Layers'
  },
  LAYERS_FILTERS_TAB_FEATURE: {
    key: FEATURE_FLAGS.LAYERS_FILTERS_TAB_FEATURE,
    enabled: false,
    experimental: true,
    description: 'featureFlags.layersFiltersTab.description',
    category: 'Layers'
  },
  LAYERS_FEATURE_INFORMATION_TAB_FEATURE: {
    key: FEATURE_FLAGS.LAYERS_FEATURE_INFORMATION_TAB_FEATURE,
    enabled: false,
    experimental: true,
    description: 'featureFlags.layersFeatureInformationTab.description',
    category: 'Layers'
  },
  APPLICATION_SCALES_FEATURE: {
    key: FEATURE_FLAGS.APPLICATION_SCALES_FEATURE,
    enabled: false,
    experimental: true,
    description: 'featureFlags.applicationScales.description',
    category: 'Applications'
  },
  APPLICATION_TREE_AUTO_REFRESH_FEATURE: {
    key: FEATURE_FLAGS.APPLICATION_TREE_AUTO_REFRESH_FEATURE,
    enabled: false,
    experimental: true,
    description: 'featureFlags.applicationTreeAutoRefresh.description',
    category: 'Applications'
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
    description: 'featureFlags.layersQueryableFeature.description',
    category: 'Layers'
  },
  LAYERS_SOURCE_FEATURE: {
    key: FEATURE_FLAGS.LAYERS_SOURCE_FEATURE,
    enabled: true,
    experimental: true,
    description: 'featureFlags.layersSourceFeature.description',
    category: 'Layers'
  },
  SERVICES_CRS_LIST: {
    key: FEATURE_FLAGS.SERVICES_CRS_LIST,
    enabled: true,
    experimental: true,
    description: 'featureFlags.servicesCrsList.description',
    category: 'Services'
  },
  SERVICES_PARAMETERS_FEATURE: {
    key: FEATURE_FLAGS.SERVICES_PARAMETERS_FEATURE,
    enabled: true,
    experimental: false,
    description: 'featureFlags.servicesParametersFeature.description',
    category: 'Services'
  },
  LAYERS_LEGEND_TAB_FEATURE: {
    key: FEATURE_FLAGS.LAYERS_LEGEND_TAB_FEATURE,
    enabled: true,
    experimental: true,
    description: 'featureFlags.layersLegendTab.description',
    category: 'Layers'
  },
  LAYERS_CARTOGRAPHY_STYLES_TAB_FEATURE: {
    key: FEATURE_FLAGS.LAYERS_CARTOGRAPHY_STYLES_TAB_FEATURE,
    enabled: true,
    experimental: true,
    description: 'featureFlags.layersCartographyStylesTab.description',
    category: 'Layers'
  },
  LAYERS_FILTERS_TAB_FEATURE: {
    key: FEATURE_FLAGS.LAYERS_FILTERS_TAB_FEATURE,
    enabled: true,
    experimental: true,
    description: 'featureFlags.layersFiltersTab.description',
    category: 'Layers'
  },
  LAYERS_FEATURE_INFORMATION_TAB_FEATURE: {
    key: FEATURE_FLAGS.LAYERS_FEATURE_INFORMATION_TAB_FEATURE,
    enabled: true,
    experimental: true,
    description: 'featureFlags.layersFeatureInformationTab.description',
    category: 'Layers'
  },
  APPLICATION_SCALES_FEATURE: {
    key: FEATURE_FLAGS.APPLICATION_SCALES_FEATURE,
    enabled: true,
    experimental: true,
    description: 'featureFlags.applicationScales.description',
    category: 'Applications'
  },
  APPLICATION_TREE_AUTO_REFRESH_FEATURE: {
    key: FEATURE_FLAGS.APPLICATION_TREE_AUTO_REFRESH_FEATURE,
    enabled: true,
    experimental: true,
    description: 'featureFlags.applicationTreeAutoRefresh.description',
    category: 'Applications'
  }
}; 