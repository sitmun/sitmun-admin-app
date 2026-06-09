import {
  formatImageAccept,
  getImageUploadErrorKey,
  validateImageUpload,
} from './image-upload.utils';

const EXTENSIONS = ['png', 'jpg', 'jpeg'];
const MAX_BYTES = 2 * 1024 * 1024;

describe('formatImageAccept', () => {
  it('formats backend extensions for the file input accept attribute', () => {
    expect(formatImageAccept(EXTENSIONS)).toBe('.png,.jpg,.jpeg');
  });
});

describe('validateImageUpload', () => {
  it('accepts a PNG file', () => {
    const file = new File(['x'], 'icon.png', { type: 'image/png' });
    expect(validateImageUpload(file, EXTENSIONS, MAX_BYTES)).toEqual({ valid: true });
  });

  it('accepts a JPEG file (.jpg)', () => {
    const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' });
    expect(validateImageUpload(file, EXTENSIONS, MAX_BYTES)).toEqual({ valid: true });
  });

  it('accepts a JPEG file (.jpeg)', () => {
    const file = new File(['x'], 'photo.jpeg', { type: 'image/jpeg' });
    expect(validateImageUpload(file, EXTENSIONS, MAX_BYTES)).toEqual({ valid: true });
  });

  it('rejects a file with an unsupported extension and provides formats param', () => {
    const file = new File(['x'], 'notes.txt', { type: 'text/plain' });
    expect(validateImageUpload(file, EXTENSIONS, MAX_BYTES)).toEqual({
      valid: false,
      error: 'invalidType',
      errorParams: { formats: 'PNG, JPG, JPEG' },
    });
  });

  it('rejects files larger than the limit and provides maxSizeMb param', () => {
    const bytes = new Uint8Array(MAX_BYTES + 1);
    const file = new File([bytes], 'large.png', { type: 'image/png' });
    expect(validateImageUpload(file, EXTENSIONS, MAX_BYTES)).toEqual({
      valid: false,
      error: 'tooLarge',
      errorParams: { maxSizeMb: 2 },
    });
  });
});

describe('getImageUploadErrorKey', () => {
  it('maps validation errors to i18n keys', () => {
    expect(getImageUploadErrorKey('invalidType')).toBe('entity.tree.image.error.invalidType');
    expect(getImageUploadErrorKey('tooLarge')).toBe('entity.tree.image.error.tooLarge');
  });
});
