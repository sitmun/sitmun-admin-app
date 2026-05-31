import {
  getImageUploadErrorKey,
  TREE_IMAGE_MAX_BYTES,
  validateImageUpload,
} from './image-upload.utils';

describe('validateImageUpload', () => {
  it('accepts PNG by MIME type', () => {
    const file = new File(['x'], 'icon.png', { type: 'image/png' });
    expect(validateImageUpload(file)).toEqual({ valid: true });
  });

  it('accepts JPEG by MIME type', () => {
    const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' });
    expect(validateImageUpload(file)).toEqual({ valid: true });
  });

  it('accepts PNG by extension when MIME is empty', () => {
    const file = new File(['x'], 'icon.png', { type: '' });
    expect(validateImageUpload(file)).toEqual({ valid: true });
  });

  it('rejects non-image files', () => {
    const file = new File(['x'], 'notes.txt', { type: 'text/plain' });
    expect(validateImageUpload(file)).toEqual({ valid: false, error: 'invalidType' });
  });

  it('rejects files larger than the limit', () => {
    const bytes = new Uint8Array(TREE_IMAGE_MAX_BYTES + 1);
    const file = new File([bytes], 'large.png', { type: 'image/png' });
    expect(validateImageUpload(file)).toEqual({ valid: false, error: 'tooLarge' });
  });
});

describe('getImageUploadErrorKey', () => {
  it('maps validation errors to i18n keys', () => {
    expect(getImageUploadErrorKey('invalidType')).toBe('entity.tree.image.error.invalidType');
    expect(getImageUploadErrorKey('tooLarge')).toBe('entity.tree.image.error.tooLarge');
  });
});
