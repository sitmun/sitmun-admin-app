import { allowedParameterTypeCodes, parameterLeadProtocol, PARAMETER_TYPES_BY_SERVICE_TYPE } from './parameter-scopes';

describe('parameter scopes', () => {
  it('lists the codes each protocol may store, in table order', () => {
    expect(PARAMETER_TYPES_BY_SERVICE_TYPE.WMS).toEqual(['WMS', 'GETMAP', 'INFO', 'OLPARAM', 'VARY']);
    expect(PARAMETER_TYPES_BY_SERVICE_TYPE.WMTS).toEqual(['WMTS', 'OLPARAM', 'VARY']);
    expect(PARAMETER_TYPES_BY_SERVICE_TYPE.WFS).toEqual(['WFS', 'OLPARAM', 'VARY']);
  });

  it('names the protocol the parameter help text follows', () => {
    expect(parameterLeadProtocol('wms')).toBe('WMS');
    expect(parameterLeadProtocol(' WMTS ')).toBe('WMTS');
    expect(parameterLeadProtocol('WFS')).toBe('WFS');
    expect(parameterLeadProtocol('AIMS')).toBeNull();
    expect(parameterLeadProtocol(null)).toBeNull();
  });

  it('returns no codes for a protocol outside the table', () => {
    expect(allowedParameterTypeCodes('AIMS')).toEqual([]);
    expect(allowedParameterTypeCodes(null)).toEqual([]);
    expect(allowedParameterTypeCodes(' wms ')).toEqual(PARAMETER_TYPES_BY_SERVICE_TYPE.WMS);
  });
});
