import { appendGetCapabilitiesParams } from './wms-get-capabilities-url';

function searchParamsOf(url: string): URLSearchParams {
  return new URL(url).searchParams;
}

describe('appendGetCapabilitiesParams', () => {
  it('preserves existing query params and sets request/service for MapServer-style URLs', () => {
    const url =
      'https://pcivil.icgc.cat/ogc/geoservei?map=/opt/idec/dades/pcivil/risc_quimic.map';
    const result = appendGetCapabilitiesParams(url);
    const params = searchParamsOf(result);

    expect(result.split('?').length - 1).toBe(1);
    expect(params.get('map')).toBe('/opt/idec/dades/pcivil/risc_quimic.map');
    expect(params.get('request')).toBe('GetCapabilities');
    expect(params.get('service')).toBe('WMS');
  });

  it('sets request and service when the URL has no query string', () => {
    const result = appendGetCapabilitiesParams('https://example.com/wms');
    const params = searchParamsOf(result);

    expect(params.get('request')).toBe('GetCapabilities');
    expect(params.get('service')).toBe('WMS');
  });

  it('sets request and service when the URL ends with ?', () => {
    const result = appendGetCapabilitiesParams('https://example.com/wms?');
    const params = searchParamsOf(result);

    expect(result.split('?').length - 1).toBe(1);
    expect(params.get('request')).toBe('GetCapabilities');
    expect(params.get('service')).toBe('WMS');
  });

  it('leaves the URL unchanged when it already has request=GetCapabilities', () => {
    const url =
      'https://example.com/wms?request=GetCapabilities&service=WMS';
    expect(appendGetCapabilitiesParams(url)).toBe(url);
  });

  it('leaves the URL unchanged when it only has request=GetCapabilities', () => {
    const url = 'https://example.com/wms?request=GetCapabilities';
    expect(appendGetCapabilitiesParams(url)).toBe(url);
  });

  it('adds request when the URL only has service=WMS', () => {
    const result = appendGetCapabilitiesParams(
      'https://example.com/wms?service=WMS'
    );
    const params = searchParamsOf(result);

    expect(params.get('request')).toBe('GetCapabilities');
    expect(params.get('service')).toBe('WMS');
  });
});
