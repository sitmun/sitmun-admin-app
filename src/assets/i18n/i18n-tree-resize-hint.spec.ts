/**
 * Lock the wording of entity.tree.image.* strings across all locale files.
 *
 * resizeHint requirements:
 *  - Must NOT contain "recommended" (or locale equivalents). Backend enforces resizing, it is not a suggestion.
 *  - Must contain {{width}}, {{height}}, {{maxSizeMb}} for runtime binding.
 *
 * error.invalidType requirements:
 *  - Must contain {{formats}} so the backend-provided extension list is shown.
 *
 * error.tooLarge requirements:
 *  - Must contain {{maxSizeMb}} so the backend-provided limit is shown.
 *
 * image preview requirements:
 *  - Uploaded and stored image labels must contain dimensions, and format when available.
 *  - Uploaded image resize hint must contain target dimensions.
 */

import * as fs from 'fs';
import * as path from 'path';

const I18N_DIR = path.join(__dirname);
const LOCALES = ['ca', 'en', 'es', 'fr', 'oc-aranes'];

/** Words that must not appear in resizeHint in any locale (case-insensitive). */
const FORBIDDEN_WORDS = ['recommended', 'recomanad', 'recomendad', 'recommandé', 'recomandad'];

function loadKey(locale: string, key: string): string {
  const filePath = path.join(I18N_DIR, `${locale}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))[key];
}

describe('i18n: entity.tree.image.resizeHint', () => {
  for (const locale of LOCALES) {
    describe(`locale: ${locale}`, () => {
      let value: string;
      beforeAll(() => { value = loadKey(locale, 'entity.tree.image.resizeHint'); });

      it('has the key defined', () => {
        expect(value).toBeDefined();
        expect(value.length).toBeGreaterThan(0);
      });
      it('contains {{width}}, {{height}}, {{maxSizeMb}}', () => {
        expect(value).toContain('{{width}}');
        expect(value).toContain('{{height}}');
        expect(value).toContain('{{maxSizeMb}}');
      });
      it('does not use "recommended" wording', () => {
        const lower = value.toLowerCase();
        for (const word of FORBIDDEN_WORDS) {
          expect(lower).not.toContain(word.toLowerCase());
        }
      });
    });
  }
});

describe('i18n: entity.tree.image.error.invalidType', () => {
  for (const locale of LOCALES) {
    describe(`locale: ${locale}`, () => {
      let value: string;
      beforeAll(() => { value = loadKey(locale, 'entity.tree.image.error.invalidType'); });

      it('has the key defined', () => {
        expect(value).toBeDefined();
        expect(value.length).toBeGreaterThan(0);
      });
      it('contains {{formats}} interpolation param', () => {
        expect(value).toContain('{{formats}}');
      });
    });
  }
});

describe('i18n: entity.tree.image.error.tooLarge', () => {
  for (const locale of LOCALES) {
    describe(`locale: ${locale}`, () => {
      let value: string;
      beforeAll(() => { value = loadKey(locale, 'entity.tree.image.error.tooLarge'); });

      it('has the key defined', () => {
        expect(value).toBeDefined();
        expect(value.length).toBeGreaterThan(0);
      });
      it('contains {{maxSizeMb}} interpolation param', () => {
        expect(value).toContain('{{maxSizeMb}}');
      });
    });
  }
});

describe.each([
  'entity.tree.uploadedImageInfo',
  'entity.tree.storedImageInfo',
])('i18n: %s', (key) => {
  for (const locale of LOCALES) {
    describe(`locale: ${locale}`, () => {
      let value: string;
      beforeAll(() => { value = loadKey(locale, key); });

      it('has the key defined', () => {
        expect(value).toBeDefined();
        expect(value.length).toBeGreaterThan(0);
      });
      it('contains {{format}}, {{width}}, {{height}} interpolation params', () => {
        expect(value).toContain('{{format}}');
        expect(value).toContain('{{width}}');
        expect(value).toContain('{{height}}');
      });
    });
  }
});

describe.each([
  'entity.tree.uploadedImageDimensions',
  'entity.tree.storedImageDimensions',
])('i18n: %s', (key) => {
  for (const locale of LOCALES) {
    describe(`locale: ${locale}`, () => {
      let value: string;
      beforeAll(() => { value = loadKey(locale, key); });

      it('has the key defined', () => {
        expect(value).toBeDefined();
        expect(value.length).toBeGreaterThan(0);
      });
      it('contains {{width}}, {{height}} interpolation params', () => {
        expect(value).toContain('{{width}}');
        expect(value).toContain('{{height}}');
      });
    });
  }
});

describe('i18n: entity.tree.uploadedImageWillBeResized', () => {
  for (const locale of LOCALES) {
    describe(`locale: ${locale}`, () => {
      let value: string;
      beforeAll(() => { value = loadKey(locale, 'entity.tree.uploadedImageWillBeResized'); });

      it('has the key defined', () => {
        expect(value).toBeDefined();
        expect(value.length).toBeGreaterThan(0);
      });
      it('contains {{width}}, {{height}} interpolation params', () => {
        expect(value).toContain('{{width}}');
        expect(value).toContain('{{height}}');
      });
    });
  }
});

describe('i18n: entity.tree.uploadedImageMatchesTarget', () => {
  for (const locale of LOCALES) {
    describe(`locale: ${locale}`, () => {
      let value: string;
      beforeAll(() => { value = loadKey(locale, 'entity.tree.uploadedImageMatchesTarget'); });

      it('has the key defined', () => {
        expect(value).toBeDefined();
        expect(value.length).toBeGreaterThan(0);
      });
    });
  }
});
