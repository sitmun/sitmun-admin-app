import { mapWfsCapabilities, wfsCapabilityNodes } from './wfs-capabilities';

describe('mapWfsCapabilities', () => {
  it('maps a prefixed WFS 2.0 document, including a single FeatureType object', () => {
    const mapped = mapWfsCapabilities({
      'wfs:WFS_Capabilities': {
        'ows:ServiceIdentification': {
          'ows:Title': 'Parcel service',
          'ows:Abstract': 'Parcels and roads',
        },
        'wfs:FeatureTypeList': {
          'wfs:FeatureType': {
            'wfs:Name': 'app:roads',
            'wfs:Title': 'Roads',
            'wfs:Abstract': 'Road centerlines',
            'wfs:DefaultCRS': 'urn:ogc:def:crs:EPSG::25831',
            'wfs:OtherCRS': ['urn:ogc:def:crs:EPSG::4326', 'EPSG:3857'],
          },
        },
      },
    });

    expect(mapped).toEqual({
      title: 'Parcel service',
      abstract: 'Parcels and roads',
      supportedSRS: [
        'urn:ogc:def:crs:EPSG::25831',
        'urn:ogc:def:crs:EPSG::4326',
        'EPSG:3857',
      ],
      layers: [
        {
          name: 'Roads',
          description: 'Road centerlines',
          layers: ['app:roads'],
        },
      ],
    });
    expect(wfsCapabilityNodes({
      'wfs:WFS_Capabilities': {
        'wfs:FeatureTypeList': {
          'wfs:FeatureType': {
            'wfs:Name': 'app:roads',
            'wfs:Title': 'Roads',
            'wfs:Abstract': 'Road centerlines',
          },
        },
      },
    })).toEqual([
      { Name: 'app:roads', Title: 'Roads', Abstract: 'Road centerlines' },
    ]);
  });

  it('reads unprefixed WFS 1.0 Service metadata and a FeatureType list', () => {
    const mapped = mapWfsCapabilities({
      WFS_Capabilities: {
        Service: {
          Title: 'Legacy',
          Abstract: 'Version 1.0',
        },
        FeatureTypeList: {
          FeatureType: [
            {
              Name: 'roads',
              Title: 'Roads',
              DefaultSRS: 'EPSG:4326',
              OtherSRS: 'EPSG:25831',
            },
            {
              Name: 'parcels',
              Title: 'Parcels',
              SRS: 'EPSG:3857',
            },
          ],
        },
      },
    });

    expect(mapped?.title).toBe('Legacy');
    expect(mapped?.abstract).toBe('Version 1.0');
    expect(mapped?.layers.map((layer) => layer.layers[0])).toEqual(['roads', 'parcels']);
    expect(mapped?.layers.map((layer) => layer.name)).toEqual(['Roads', 'Parcels']);
    expect(mapped?.supportedSRS).toEqual(['EPSG:4326', 'EPSG:25831', 'EPSG:3857']);
  });

  it('returns null for a WMS capabilities document', () => {
    expect(mapWfsCapabilities({ WMS_Capabilities: { Service: { Title: 'WMS' } } })).toBeNull();
  });
});
