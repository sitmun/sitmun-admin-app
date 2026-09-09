/**
 * Builds a WMS GetCapabilities URL via the WHATWG URL API (preserves existing query params).
 *
 * WMS-only: always sets `service=WMS`. Do not reuse for WFS/WMTS/etc. without a service
 * argument — callers must already gate on WMS (service form `isWMS()`, tree-nodes WMS filter).
 * The backend capabilities extractor also accepts only WMS capability documents.
 */
export function appendGetCapabilitiesParams(url: string): string {
  const parsed = new URL(url);
  // Use forEach — @types/node can shadow DOM URLSearchParams and omit iterators/.keys().
  let hasGetCapabilities = false;
  parsed.searchParams.forEach((value, key) => {
    if (key.toLowerCase() === 'request' && value === 'GetCapabilities') {
      hasGetCapabilities = true;
    }
  });
  if (hasGetCapabilities) {
    return url;
  }
  parsed.searchParams.set('request', 'GetCapabilities');
  parsed.searchParams.set('service', 'WMS');
  return parsed.toString();
}
