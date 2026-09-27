import {
  describeFeatureTypeRequestUrl,
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
});
