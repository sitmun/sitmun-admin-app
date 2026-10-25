// Trimmed copies of real DescribeFeatureType responses and INSPIRE schemas, as the backend
// feature-type helper returns them (org.json XML.toJSONObject), fetched on 24-25 October 2026.

const XSD = 'http://www.w3.org/2001/XMLSchema';
const GML32 = 'http://www.opengis.net/gml/3.2';
const NET = 'http://inspire.ec.europa.eu/schemas/net/4.0';
const TN = 'http://inspire.ec.europa.eu/schemas/tn/4.0';
const TN_RO = 'http://inspire.ec.europa.eu/schemas/tn-ro/4.0';
const GN = 'http://inspire.ec.europa.eu/schemas/gn/4.0';
const BASE = 'http://inspire.ec.europa.eu/schemas/base/3.3';
const APP_SCHEMAS = 'http://servicios.idee.es/wfs-inspire/appschemas';

const nilDateTime = (name: string) => ({
  name,
  nillable: true,
  complexType: {
    simpleContent: {
      extension: { base: 'dateTime', attribute: { name: 'nilReason', type: 'gml:NilReasonType' } }
    }
  }
});

export const IDENA_DESCRIBE_URL =
  'https://idena.navarra.es/ogc/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=IDENA%3AINFOTU_Pol_IndDensiPob';

export const IDENA_DESCRIBE = {
  'xsd:schema': {
    'xmlns:xsd': XSD,
    'xmlns:gml': 'http://www.opengis.net/gml',
    elementFormDefault: 'qualified',
    targetNamespace: 'https://idena.navarra.es/',
    'xmlns:IDENA': 'https://idena.navarra.es/',
    'xsd:import': {
      namespace: 'http://www.opengis.net/gml',
      schemaLocation: 'http://schemas.opengis.net/gml/3.1.1/base/gml.xsd'
    },
    'xsd:complexType': {
      name: 'INFOTU_Pol_IndDensiPobType',
      'xsd:complexContent': {
        'xsd:extension': {
          base: 'gml:AbstractFeatureType',
          'xsd:sequence': {
            'xsd:element': [
              { name: 'Geometría', nillable: true, type: 'gml:MultiPolygonPropertyType' },
              { name: 'FEATURE', nillable: true, type: 'xsd:int' },
              { name: 'Código_municipio', nillable: true, type: 'xsd:long' },
              { name: 'Municipio', nillable: true, type: 'xsd:string' },
              { name: 'Población', nillable: true, type: 'xsd:long' }
            ]
          }
        }
      }
    },
    'xsd:element': {
      name: 'INFOTU_Pol_IndDensiPob',
      substitutionGroup: 'gml:_Feature',
      type: 'IDENA:INFOTU_Pol_IndDensiPobType'
    }
  }
};

export const ROAD_LINK_DESCRIBE_URL =
  'https://servicios.idee.es/wfs-inspire/transportes?service=WFS&request=DescribeFeatureType&version=2.0.0&typeNames=tn-ro%3ARoadLink';
export const ROAD_SCHEMA_URL = `${APP_SCHEMAS}/RoadTransportNetwork.xsd`;
export const TRANSPORT_SCHEMA_URL = `${APP_SCHEMAS}/CommonTransportElements.xsd`;
export const NETWORK_SCHEMA_URL = `${APP_SCHEMAS}/Network.xsd`;

export const ROAD_LINK_DESCRIBE = {
  schema: {
    attributeFormDefault: 'unqualified',
    xmlns: XSD,
    elementFormDefault: 'qualified',
    targetNamespace: TN_RO,
    import: [
      { namespace: BASE, schemaLocation: `${APP_SCHEMAS}/BaseTypes.xsd` },
      { namespace: GN, schemaLocation: `${APP_SCHEMAS}/GeographicalNames.xsd` },
      { namespace: NET, schemaLocation: NETWORK_SCHEMA_URL },
      { namespace: TN, schemaLocation: TRANSPORT_SCHEMA_URL }
    ],
    include: { schemaLocation: ROAD_SCHEMA_URL }
  }
};

export const ROAD_SCHEMA = {
  schema: {
    xmlns: XSD,
    'xmlns:gml': GML32,
    'xmlns:net': NET,
    'xmlns:tn': TN,
    'xmlns:tn-ro': TN_RO,
    elementFormDefault: 'qualified',
    targetNamespace: TN_RO,
    import: [
      { namespace: GN, schemaLocation: 'GeographicalNames.xsd' },
      { namespace: NET, schemaLocation: 'Network.xsd' },
      { namespace: TN, schemaLocation: 'CommonTransportElements.xsd' },
      { namespace: GML32, schemaLocation: 'http://schemas.opengis.net/gml/3.2.1/gml.xsd' }
    ],
    element: [
      { name: 'ERoad', substitutionGroup: 'net:NetworkElement', type: 'tn-ro:ERoadType' },
      { name: 'RoadLink', substitutionGroup: 'tn:TransportLink', type: 'tn-ro:RoadLinkType' }
    ],
    complexType: [
      {
        name: 'ERoadType',
        complexContent: {
          extension: {
            base: 'tn:TransportLinkSetType',
            sequence: { element: { name: 'europeanRouteNumber', type: 'string' } }
          }
        }
      },
      {
        name: 'RoadLinkType',
        complexContent: { extension: { base: 'tn:TransportLinkType', sequence: '' } }
      }
    ]
  }
};

export const TRANSPORT_SCHEMA = {
  schema: {
    xmlns: XSD,
    'xmlns:gml': GML32,
    'xmlns:net': NET,
    'xmlns:tn': TN,
    'xmlns:gn': GN,
    elementFormDefault: 'qualified',
    targetNamespace: TN,
    import: [
      { namespace: BASE, schemaLocation: 'BaseTypes.xsd' },
      { namespace: GN, schemaLocation: 'GeographicalNames.xsd' },
      { namespace: NET, schemaLocation: 'Network.xsd' },
      { namespace: GML32, schemaLocation: 'http://schemas.opengis.net/gml/3.2.1/gml.xsd' }
    ],
    element: { name: 'TransportLink', abstract: true, substitutionGroup: 'net:Link', type: 'tn:TransportLinkType' },
    complexType: {
      name: 'TransportLinkType',
      abstract: true,
      complexContent: {
        extension: {
          base: 'net:LinkType',
          sequence: {
            element: [
              { name: 'geographicalName', nillable: true, type: 'gn:GeographicalNamePropertyType' },
              nilDateTime('validFrom'),
              nilDateTime('validTo')
            ]
          }
        }
      }
    }
  }
};

export const NETWORK_SCHEMA = {
  schema: {
    xmlns: XSD,
    'xmlns:gml': GML32,
    'xmlns:net': NET,
    'xmlns:base': BASE,
    'xmlns:gn': GN,
    elementFormDefault: 'qualified',
    targetNamespace: NET,
    import: [
      { namespace: BASE, schemaLocation: 'BaseTypes.xsd' },
      { namespace: GN, schemaLocation: 'GeographicalNames.xsd' },
      { namespace: GML32, schemaLocation: 'http://schemas.opengis.net/gml/3.2.1/gml.xsd' }
    ],
    complexType: [
      {
        name: 'GeneralisedLinkType',
        abstract: true,
        complexContent: { extension: { base: 'net:NetworkElementType', sequence: '' } }
      },
      {
        name: 'LinkType',
        abstract: true,
        complexContent: {
          extension: {
            base: 'net:GeneralisedLinkType',
            sequence: {
              element: [
                { name: 'centrelineGeometry', type: 'gml:CurvePropertyType' },
                { name: 'fictitious', type: 'boolean' },
                { name: 'endNode', type: 'gml:ReferenceType' },
                { name: 'startNode', type: 'gml:ReferenceType' }
              ]
            }
          }
        }
      },
      {
        name: 'NetworkAreaType',
        abstract: true,
        complexContent: {
          extension: {
            base: 'net:NetworkElementType',
            sequence: { element: { name: 'geometry', type: 'gml:SurfacePropertyType' } }
          }
        }
      },
      {
        name: 'NetworkElementType',
        abstract: true,
        complexContent: {
          extension: {
            base: 'gml:AbstractFeatureType',
            sequence: {
              element: [
                nilDateTime('beginLifespanVersion'),
                { name: 'inspireId', type: 'base:IdentifierPropertyType' },
                nilDateTime('endLifespanVersion'),
                { name: 'inNetwork', nillable: true, type: 'gml:ReferenceType' }
              ]
            }
          }
        }
      }
    ]
  }
};
