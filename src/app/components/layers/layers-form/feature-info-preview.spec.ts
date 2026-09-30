import { previewFeatureInfoFormat } from './feature-info-preview';

describe('feature info preview', () => {
  it('previews number, percent, and date in the administrator locale', () => {
    expect(previewFeatureInfoFormat('N', 2, false, null, 'es')).toBe('1.234,5');
    expect(previewFeatureInfoFormat('N', 2, true, null, 'en')).toBe('1,234.50');
    expect(previewFeatureInfoFormat('P', 2, false, null, 'es')).toBe('15,6\u00a0%');
    expect(previewFeatureInfoFormat('P', 2, true, null, 'en')).toBe('15.60%');
    expect(previewFeatureInfoFormat('F', null, false, null, 'es')).toBe('02/01/2024, 15:04:05');
    expect(previewFeatureInfoFormat('F', null, false, 'date', 'en')).toBe('01/02/2024');
  });

  it('shows no pattern for formats without an extra control', () => {
    expect(previewFeatureInfoFormat('T', null, false, null, 'es')).toBe('');
    expect(previewFeatureInfoFormat('AUTO', null, false, null, 'es')).toBe('');
    expect(previewFeatureInfoFormat(null, null, false, null, 'es')).toBe('');
  });
});
