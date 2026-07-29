import { compareNullableString } from './compare-nullable-string';

describe('compareNullableString', () => {
  it('treats null and undefined as empty', () => {
    expect(compareNullableString(null, 'a')).toBeLessThan(0);
    expect(compareNullableString('a', undefined)).toBeGreaterThan(0);
    expect(compareNullableString(null, undefined)).toBe(0);
  });

  it('compares non-null strings', () => {
    expect(compareNullableString('a', 'b')).toBeLessThan(0);
    expect(compareNullableString('b', 'a')).toBeGreaterThan(0);
  });

  it('forwards locale options', () => {
    expect(compareNullableString('A', 'a', undefined, { sensitivity: 'base' })).toBe(0);
  });
});
