import {
  describeFeatureTypeRequestUrl,
  describeLayerFeatureTypeUrl,
  describeLayerRequestUrl,
  featureTypeElementNames,
  featureTypeGeometryKinds,
  describeFeatureTypeRetryUrl,
  FeatureTypeDocument,
  featureTypeGeometryProperties,
  resolveFeatureType
} from './feature-type-elements';
import {
  IDENA_DESCRIBE,
  IDENA_DESCRIBE_URL,
  NETWORK_SCHEMA,
  NETWORK_SCHEMA_URL,
  ROAD_LINK_DESCRIBE,
  ROAD_LINK_DESCRIBE_URL,
  ROAD_SCHEMA,
  ROAD_SCHEMA_URL,
  TRANSPORT_SCHEMA,
  TRANSPORT_SCHEMA_URL
} from './feature-type-schemas.fixture';

function featureType(sequence: Record<string, unknown>) {
  return {
    'xsd:schema': {
      'xsd:complexType': {
        name: 'featureType',
        'xsd:complexContent': {
          'xsd:extension': {
            base: 'gml:AbstractFeatureType',
            'xsd:sequence': sequence
          }
        }
      }
    }
  };
}

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
    expect(featureTypeGeometryKinds(withGeometry)).toEqual(['MultiLineString', 'Point']);
    expect(featureTypeGeometryProperties(withGeometry)).toEqual([
      { name: 'the_geom', kind: 'MultiLineString' },
      { name: 'location', kind: 'Point' }
    ]);
  });

  it('keeps a kind for each GML geometry property, including a generic Geometry', () => {
    const several = featureType({
      'xsd:element': [
        { name: 'the_geom', type: 'gml:PointPropertyType' },
        { name: 'sites', type: 'gml:MultiPointPropertyType' },
        { name: 'route', type: 'gml:MultiLineStringPropertyType' },
        { name: 'area', type: 'gml:MultiPolygonPropertyType' },
        { name: 'path', type: 'gml:MultiCurvePropertyType' },
        { name: 'cover', type: 'gml:MultiSurfacePropertyType' },
        { name: 'geom', type: 'gml:GeometryPropertyType' },
        { name: 'season', type: 'xsd:string' }
      ]
    });
    expect(featureTypeGeometryKinds(several)).toEqual([
      'Point',
      'MultiPoint',
      'MultiLineString',
      'MultiPolygon',
      'MultiCurve',
      'MultiSurface',
      'Geometry'
    ]);
    expect(featureTypeElementNames(several)).toEqual(['season']);
  });

  it('does not invent a kind when the property matches only by name', () => {
    const namedOnly = featureType({
      'xsd:element': [
        { name: 'the_geom', type: 'xsd:string' },
        { name: 'geom' },
        { name: 'shape', type: 'xsd:string' },
        { name: 'geometry' },
        { name: 'season', type: 'xsd:string' }
      ]
    });
    expect(featureTypeGeometryKinds(namedOnly)).toEqual([]);
    expect(featureTypeElementNames(namedOnly)).toEqual([
      'the_geom',
      'geom',
      'shape',
      'geometry',
      'season'
    ]);
    expect(featureTypeGeometryProperties(namedOnly)).toEqual([]);
  });

  it('classifies a geometry property from its XSD type, including names outside the old list', () => {
    const typed = featureType({
      'xsd:element': [
        { name: 'Geometría', type: 'gml:MultiPolygonPropertyType' },
        { name: 'centrelineGeometry', type: 'gml:CurvePropertyType' },
        { name: 'geometry', type: 'gml:GeometryPropertyType' },
        { name: 'season', type: 'xsd:string' }
      ]
    });
    expect(featureTypeGeometryProperties(typed)).toEqual([
      { name: 'Geometría', kind: 'MultiPolygon' },
      { name: 'centrelineGeometry', kind: 'Curve' },
      { name: 'geometry', kind: 'Geometry' }
    ]);
    expect(featureTypeGeometryKinds(typed)).toEqual(['MultiPolygon', 'Curve', 'Geometry']);
    expect(featureTypeElementNames(typed)).toEqual(['season']);
  });

  it('does not treat GeometryCollectionPropertyType as a geometry kind', () => {
    const collection = featureType({
      'xsd:element': [
        { name: 'parts', type: 'gml:GeometryCollectionPropertyType' },
        { name: 'season', type: 'xsd:string' }
      ]
    });
    expect(featureTypeGeometryKinds(collection)).toEqual([]);
    expect(featureTypeElementNames(collection)).toEqual(['parts', 'season']);
  });

  it('reads the requested IDENA feature type from its own DescribeFeatureType document', () => {
    expect(resolveFeatureType([{ url: IDENA_DESCRIBE_URL, asJson: IDENA_DESCRIBE }])).toEqual({
      names: ['FEATURE', 'Código_municipio', 'Municipio', 'Población'],
      geometryProperties: [{ name: 'Geometría', kind: 'MultiPolygon' }],
      pendingSchemas: []
    });
  });

  it('asks for the schema that defines an imported feature type, then for each schema on its parent chain', () => {
    const documents: FeatureTypeDocument[] = [{ url: ROAD_LINK_DESCRIBE_URL, asJson: ROAD_LINK_DESCRIBE }];
    expect(resolveFeatureType(documents).pendingSchemas).toEqual([ROAD_SCHEMA_URL]);

    documents.push({ url: ROAD_SCHEMA_URL, asJson: ROAD_SCHEMA });
    expect(resolveFeatureType(documents).pendingSchemas).toEqual([TRANSPORT_SCHEMA_URL]);

    documents.push({ url: TRANSPORT_SCHEMA_URL, asJson: TRANSPORT_SCHEMA });
    expect(resolveFeatureType(documents).pendingSchemas).toEqual([NETWORK_SCHEMA_URL]);

    documents.push({ url: NETWORK_SCHEMA_URL, asJson: NETWORK_SCHEMA });
    expect(resolveFeatureType(documents)).toEqual({
      names: [
        'beginLifespanVersion',
        'inspireId',
        'endLifespanVersion',
        'inNetwork',
        'fictitious',
        'endNode',
        'startNode',
        'geographicalName',
        'validFrom',
        'validTo'
      ],
      geometryProperties: [{ name: 'centrelineGeometry', kind: 'Curve' }],
      pendingSchemas: []
    });
  });

  it('stops asking for a schema that could not be read', () => {
    expect(
      resolveFeatureType([
        { url: ROAD_LINK_DESCRIBE_URL, asJson: ROAD_LINK_DESCRIBE },
        { url: ROAD_SCHEMA_URL, asJson: null }
      ])
    ).toEqual({ names: [], geometryProperties: [], pendingSchemas: [] });
  });

  it('keeps reading every feature type in the document when the requested one is not declared', () => {
    expect(
      resolveFeatureType([
        {
          url: 'https://example.test/wfs?service=WFS&request=DescribeFeatureType&typeName=app:other',
          asJson: featureType({
            'xsd:element': [
              { name: 'the_geom', type: 'gml:PointPropertyType' },
              { name: 'season', type: 'xsd:string' }
            ]
          })
        }
      ])
    ).toEqual({
      names: ['season'],
      geometryProperties: [{ name: 'the_geom', kind: 'Point' }],
      pendingSchemas: []
    });
  });

  it('retries a WFS 1.1.0 DescribeFeatureType request as WFS 2.0.0', () => {
    expect(
      describeFeatureTypeRetryUrl(
        'https://example.test/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=tn-ro%3ARoadLink'
      )
    ).toBe(
      'https://example.test/wfs?service=WFS&request=DescribeFeatureType&version=2.0.0&typeNames=tn-ro%3ARoadLink'
    );
    expect(
      describeFeatureTypeRetryUrl(
        'https://example.test/wfs?service=WFS&request=DescribeFeatureType&version=2.0.0&typeNames=app%3Aroads'
      )
    ).toBeNull();
    expect(describeFeatureTypeRetryUrl('https://example.test/wms?request=DescribeLayer&version=1.1.0')).toBeNull();
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
