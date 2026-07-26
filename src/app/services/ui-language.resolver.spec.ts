import {
  filterEnabledLanguages,
  resolveUiLanguage,
  sortByLanguageOrder,
} from './ui-language.resolver';

describe('resolveUiLanguage', () => {
  const available = ['ca', 'en', 'es'];

  it('prefers stored when available', () => {
    expect(
      resolveUiLanguage({
        stored: 'ca',
        backendDefault: 'en',
        availableShortnames: available,
        staticFallback: 'ca',
      })
    ).toBe('ca');
  });

  it('uses backendDefault when stored is missing', () => {
    expect(
      resolveUiLanguage({
        stored: null,
        backendDefault: 'en',
        availableShortnames: available,
        staticFallback: 'ca',
      })
    ).toBe('en');
  });

  it('uses backendDefault ca over static es', () => {
    expect(
      resolveUiLanguage({
        stored: null,
        backendDefault: 'ca',
        availableShortnames: available,
        staticFallback: 'es',
      })
    ).toBe('ca');
  });

  it('ignores stored when not in available', () => {
    expect(
      resolveUiLanguage({
        stored: 'xx',
        backendDefault: 'ca',
        availableShortnames: ['ca', 'en'],
        staticFallback: 'en',
      })
    ).toBe('ca');
  });

  it('uses staticFallback when backend missing', () => {
    expect(
      resolveUiLanguage({
        stored: null,
        backendDefault: null,
        availableShortnames: ['ca', 'en'],
        staticFallback: 'ca',
      })
    ).toBe('ca');
  });

  it('uses staticFallback when backendDefault not available', () => {
    expect(
      resolveUiLanguage({
        stored: null,
        backendDefault: 'de',
        availableShortnames: ['ca', 'en'],
        staticFallback: 'en',
      })
    ).toBe('en');
  });
});

describe('sortByLanguageOrder', () => {
  it('sorts by order then shortname', () => {
    const sorted = sortByLanguageOrder([
      { shortname: 'en', order: 3 },
      { shortname: 'ca', order: 1 },
      { shortname: 'es', order: 2 },
    ]);
    expect(sorted.map((l) => l.shortname)).toEqual(['ca', 'es', 'en']);
  });

  it('puts null order last', () => {
    const sorted = sortByLanguageOrder([
      { shortname: 'zz', order: null },
      { shortname: 'ca', order: 1 },
    ]);
    expect(sorted.map((l) => l.shortname)).toEqual(['ca', 'zz']);
  });
});

describe('filterEnabledLanguages', () => {
  it('keeps enabled and treats missing enabled as true', () => {
    const filtered = filterEnabledLanguages([
      { shortname: 'ca', enabled: true },
      { shortname: 'es', enabled: false },
      { shortname: 'en' },
    ]);
    expect(filtered.map((l) => l.shortname)).toEqual(['ca', 'en']);
  });
});
