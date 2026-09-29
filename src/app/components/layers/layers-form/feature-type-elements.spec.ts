import {
  describeFeatureTypeRequestUrl,
  describeLayerFeatureTypeUrl,
  describeLayerRequestUrl,
  featureTypeElementNames
} from './feature-type-elements';

describe('feature type seed', () => {
  const schema = {
    'xsd:schema': {
      'xsd:complexType': [
        {
          name: 'parcelType',
          'xsd:complexContent': {
            'xsd:extension': {
              base: 'gml:AbstractFeatureType',
              'xsd:sequence': {
                'xsd:element': [
                  { name: 'season', type: 'xsd:string' },
                  { name: 'address', type: 'app:addressType' }
                ]
              }
            }
          }
        },
        {
          name: 'addressType',
          'xsd:sequence': {
            'xsd:element': { name: 'city', type: 'xsd:string' }
          }
        }
      ]
    }
  };

  it('lists top-level feature elements and skips nested types', () => {
    expect(featureTypeElementNames(schema)).toEqual(['season', 'address']);
  });

  it('omits geometry properties when loading fields from the feature type', () => {
    const withGeometry = {
      'xsd:schema': {
        'xsd:complexType': {
          name: 'routeType',
          'xsd:complexContent': {
            'xsd:extension': {
              base: 'gml:AbstractFeatureType',
              'xsd:sequence': {
                'xsd:element': [
                  { name: 'the_geom', type: 'gml:MultiLineStringPropertyType' },
                  { name: 'location', type: 'gml:PointPropertyType' },
                  { name: 'longitud', type: 'xsd:double' },
                  { name: 'nomruta', type: 'xsd:string' }
                ]
              }
            }
          }
        }
      }
    };
    expect(featureTypeElementNames(withGeometry)).toEqual(['longitud', 'nomruta']);
  });

  it('builds a DescribeFeatureType URL only for WFS', () => {
    expect(
      describeFeatureTypeRequestUrl('https://example.test/wfs', 'WFS', 'parcel')
    ).toBe(
      'https://example.test/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=parcel'
    );
    expect(describeFeatureTypeRequestUrl('https://example.test/wms', 'WMS', 'parcel')).toBeNull();
    expect(
      describeFeatureTypeRequestUrl(
        'https://example.test/wfs?request=DescribeFeatureType&typeName=parcel',
        'WMS',
        'other'
      )
    ).toBe('https://example.test/wfs?request=DescribeFeatureType&typeName=parcel');
  });

  it('builds a DescribeLayer URL for a WMS layer', () => {
    expect(describeLayerRequestUrl('https://example.test/wms', 'WMS', 'roads')).toBe(
      'https://example.test/wms?service=WMS&request=DescribeLayer&version=1.1.1&layers=roads'
    );
    expect(describeLayerRequestUrl('https://example.test/wfs', 'WFS', 'roads')).toBeNull();
    expect(describeLayerRequestUrl('https://example.test/wms', 'WMS', '')).toBeNull();
    expect(
      describeLayerRequestUrl('https://example.test/wms?request=DescribeLayer&layers=roads', 'WFS', 'other')
    ).toBe('https://example.test/wms?request=DescribeLayer&layers=roads');
  });

  it('turns a DescribeLayer document into a WFS DescribeFeatureType URL', () => {
    expect(
      describeLayerFeatureTypeUrl(
        {
          DescribeLayerResponse: {
            LayerDescription: [
              {
                name: 'other',
                owsURL: 'https://example.test/other',
                owsType: 'WFS',
                Query: { typeName: 'app:other' }
              },
              {
                name: 'roads',
                wfs: 'https://example.test/wfs',
                owsType: 'WFS',
                Query: { typeName: 'app:roads' }
              }
            ]
          }
        },
        'roads'
      )
    ).toEqual({
      kind: 'featureType',
      url: 'https://example.test/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=app%3Aroads'
    });
  });

  it('explains when DescribeLayer is missing or is not a WFS feature type', () => {
    expect(describeLayerFeatureTypeUrl({ 'ows:ExceptionReport': {} }, 'roads')).toEqual({
      kind: 'unavailable'
    });
    expect(
      describeLayerFeatureTypeUrl(
        {
          DescribeLayerResponse: {
            LayerDescription: {
              name: 'cover',
              owsURL: 'https://example.test/wcs',
              owsType: 'WCS',
              Query: { typeName: 'cover' }
            }
          }
        },
        'cover'
      )
    ).toEqual({ kind: 'notFeatureType' });
  });
});
