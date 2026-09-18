import { MapImageLayerCatalogService } from './map-image-layer-catalog.service';

describe('MapImageLayerCatalogService', () => {
  const service = new MapImageLayerCatalogService();

  it('normalizes and deduplicates layer names', () => {
    expect(service.normalizeLayerNames([' roads ', 'roads', '', 4])).toEqual(['roads']);
  });

  it('prefers exact layer options when resolving selected layers', () => {
    const grouped = { serviceId: 1, serviceName: 'S', layerIds: ['a', 'b'], layerIdLabel: 'a, b', layerName: 'Group' };
    const exact = { serviceId: 1, serviceName: 'S', layerIds: ['a'], layerIdLabel: 'a', layerName: 'A' };
    expect(service.find([grouped, exact], 1, 'a')).toBe(exact);
  });
});
