import {readFileSync} from 'fs';
import {join} from 'path';

const LANGS = ['ca', 'en', 'es', 'fr', 'oc-aranes'] as const;
const TASK_KEY_PREFIXES = [
  'entity.task.mapImage.',
  'entity.task.documentExport.',
  'tasksDocumentExportEntity.',
  'common.orientation.'
] as const;

const readLocale = (lang: typeof LANGS[number]): Record<string, string> =>
  JSON.parse(
    readFileSync(join(__dirname, `../../assets/i18n/${lang}.json`), 'utf8')
  ) as Record<string, string>;

describe('Map image and document export task i18n', () => {
  it('defines every affected key in every locale', () => {
    const locales = Object.fromEntries(LANGS.map((lang) => [lang, readLocale(lang)]));
    const keys = Object.keys(locales.en).filter((key) =>
      TASK_KEY_PREFIXES.some((prefix) => key.startsWith(prefix))
    );

    expect(keys.length).toBeGreaterThan(0);
    for (const lang of LANGS) {
      for (const key of keys) {
        expect(locales[lang][key]).toBeDefined();
        expect(String(locales[lang][key]).length).toBeGreaterThan(0);
      }
    }
  });
});
