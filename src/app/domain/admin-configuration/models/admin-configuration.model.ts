export interface ImageSize {
  width: number;
  height: number;
}

export interface TreeImageUploadConfiguration {
  supportedFormats: string[];
  maxBytes: number;
  defaultSize: ImageSize;
  /** Keyed by node parent type (e.g. 'menu', 'list'). */
  sizesByType: Record<string, ImageSize>;
}

export interface AdminImageUploadConfiguration {
  tree: TreeImageUploadConfiguration;
}

/**
 * Runtime configuration contract for the SITMUN admin app, served by GET /api/config/admin.
 * Designed to be extensible: future sections of config.ts (e.g. treeTypeNodeTypes)
 * may be added here without changing the endpoint URL.
 */
export interface AdminConfiguration {
  imageUpload: AdminImageUploadConfiguration;
}

