export type ImageUploadValidationError = 'invalidType' | 'tooLarge';

export interface ImageUploadValidationResult {
  valid: boolean;
  error?: ImageUploadValidationError;
  errorParams?: Record<string, string | number>;
}

export function formatImageAccept(supportedExtensions: string[]): string {
  return supportedExtensions.map(extension => `.${extension}`).join(',');
}

/** Validates a file against caller-supplied constraints before reading as data URL. */
export function validateImageUpload(
  file: File,
  supportedExtensions: string[],
  maxBytes: number,
): ImageUploadValidationResult {
  const pattern = new RegExp(`\\.(${supportedExtensions.join('|')})$`, 'i');
  if (!pattern.test(file.name)) {
    return {
      valid: false,
      error: 'invalidType',
      errorParams: { formats: supportedExtensions.map(e => e.toUpperCase()).join(', ') },
    };
  }
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: 'tooLarge',
      errorParams: { maxSizeMb: Math.round(maxBytes / (1024 * 1024)) },
    };
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
