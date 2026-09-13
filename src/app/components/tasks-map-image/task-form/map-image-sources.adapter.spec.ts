import { MapImageSourcesAdapter } from './map-image-sources.adapter';

describe('MapImageSourcesAdapter', () => {
  const adapter = new MapImageSourcesAdapter();

  it('normalizes persisted sources without changing source order', () => {
    expect(adapter.payload([
      { serviceId: 1, layerNames: [' b ', 'a', 'b', ''] },
      { serviceId: null, layerNames: ['ignored'] },
    ])).toEqual([{ serviceId: 1, layerNames: ['b', 'a'] }]);
  });

  it('adds layers to last matching service and keeps separated groups', () => {
    expect(adapter.add([
      { serviceId: 1, layerNames: ['a'] },
      { serviceId: 2, layerNames: ['b'] },
    ], { serviceId: 1, layerIds: ['a', 'c'] })).toEqual([
      { serviceId: 1, layerNames: ['a'] },
      { serviceId: 2, layerNames: ['b'] },
      { serviceId: 1, layerNames: ['c'] },
    ]);
  });

  it('removes rows and rebuilds consecutive groups when reordered', () => {
    const sources = [
      { serviceId: 1, layerNames: ['a', 'b'] },
      { serviceId: 2, layerNames: ['c'] },
    ];
    expect(adapter.removeRows(sources, [{ serviceId: 1, layerId: 'a' }])).toEqual([
      { serviceId: 1, layerNames: ['b'] },
      { serviceId: 2, layerNames: ['c'] },
    ]);
    expect(adapter.reorder([
      { serviceId: 2, layerId: 'c' },
      { serviceId: 1, layerId: 'b' },
      { serviceId: 1, layerId: 'a' },
    ])).toEqual([
      { serviceId: 2, layerNames: ['c'] },
      { serviceId: 1, layerNames: ['b', 'a'] },
    ]);
  });
});
