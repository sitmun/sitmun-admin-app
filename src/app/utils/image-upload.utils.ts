/** Matches backend `sitmun.ui.image` defaults (application.yml). */
export const TREE_IMAGE_SUPPORTED_MIME_TYPES = ['image/png', 'image/jpeg'] as const;

export const TREE_IMAGE_MAX_BYTES = 2 * 1024 * 1024;

export const TREE_IMAGE_RECOMMENDED_WIDTH = 125;

export const TREE_IMAGE_RECOMMENDED_HEIGHT = 125;

export type ImageUploadValidationError = 'invalidType' | 'tooLarge';

export interface ImageUploadValidationResult {
  valid: boolean;
  error?: ImageUploadValidationError;
}

const SUPPORTED_EXTENSIONS = /\.(png|jpe?g)$/i;

/** Validates tree or tree-node image file before reading as data URL. */
export function validateImageUpload(file: File): ImageUploadValidationResult {
  const mimeOk =
    (file.type && TREE_IMAGE_SUPPORTED_MIME_TYPES.includes(file.type as typeof TREE_IMAGE_SUPPORTED_MIME_TYPES[number]))
    || SUPPORTED_EXTENSIONS.test(file.name);
  if (!mimeOk) {
    return { valid: false, error: 'invalidType' };
  }
  if (file.size > TREE_IMAGE_MAX_BYTES) {
    return { valid: false, error: 'tooLarge' };
  }
  return { valid: true };
}

export function getImageUploadErrorKey(error: ImageUploadValidationError): string {
  switch (error) {
    case 'invalidType':
      return 'entity.tree.image.error.invalidType';
    case 'tooLarge':
      return 'entity.tree.image.error.tooLarge';
  }
}
