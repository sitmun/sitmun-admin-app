import { TerritoryType } from './territory-type.model';

describe('TerritoryType', () => {
  describe('fromObject', () => {
    it('copies Resource and TerritoryType fields', () => {
      const source = {
        proxyUrl: '/proxy',
        rootUrl: '/root',
        _links: { self: { href: '/api/territory-types/1' } },
        _subtypes: new Map(),
        id: 1,
        name: 'Municipality',
        official: true,
        topType: false,
        bottomType: true,
        extraField: 'ignored',
      };

      const result = TerritoryType.fromObject(source);

      expect(result.proxyUrl).toBe('/proxy');
      expect(result.rootUrl).toBe('/root');
      expect(result._links).toEqual(source._links);
      expect(result.id).toBe(1);
      expect(result.name).toBe('Municipality');
      expect(result.official).toBe(true);
      expect(result.topType).toBe(false);
      expect(result.bottomType).toBe(true);
      expect((result as { extraField?: string }).extraField).toBeUndefined();
    });

    it('leaves undefined properties unset on the instance', () => {
      const result = TerritoryType.fromObject({ id: 2 });

      expect(result.id).toBe(2);
      expect(result.name).toBeUndefined();
      expect(result.official).toBeUndefined();
    });
  });
});
