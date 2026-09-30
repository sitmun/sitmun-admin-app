export type DescribeLayerSeed =
  | { kind: 'featureType'; url: string }
  | { kind: 'unavailable' }
  | { kind: 'notFeatureType' };

export function describeLayerRequestUrl(
  serviceUrl: string | null | undefined,
  serviceType: string | null | undefined,
  layerName: string
): string | null {
  if (!serviceUrl) {
    return null;
  }
  if (/[?&]request=DescribeLayer(?:&|$)/i.test(serviceUrl)) {
    return serviceUrl;
  }
  if ((serviceType ?? '').toUpperCase() !== 'WMS' || !layerName) {
    return null;
  }
  let url: URL;
  try {
    url = new URL(serviceUrl);
  } catch {
    return null;
  }
  url.searchParams.set('service', 'WMS');
  url.searchParams.set('request', 'DescribeLayer');
  url.searchParams.set('version', '1.1.1');
  url.searchParams.set('layers', layerName);
  return url.toString();
}

export function describeLayerFeatureTypeUrl(asJson: unknown, layerName: string): DescribeLayerSeed {
  const descriptions = layerDescriptions(asJson);
  const named = descriptions.find((item) => item.name === layerName);
  const selected = named ?? (descriptions.length === 1 ? descriptions[0] : undefined);
  if (!selected?.wfsUrl || !selected.typeName) {
    return { kind: 'unavailable' };
  }
  if ((selected.owsType ?? 'WFS').toUpperCase() !== 'WFS') {
    return { kind: 'notFeatureType' };
  }
  const url = describeFeatureTypeRequestUrl(selected.wfsUrl, 'WFS', selected.typeName);
  return url ? { kind: 'featureType', url } : { kind: 'unavailable' };
}

type LayerDescription = {
  name?: string;
  owsType?: string;
  wfsUrl?: string;
  typeName?: string;
};

function layerDescriptions(node: unknown, found: LayerDescription[] = []): LayerDescription[] {
  if (!node || typeof node !== 'object') {
    return found;
  }
  if (Array.isArray(node)) {
    node.forEach((child) => layerDescriptions(child, found));
    return found;
  }
  const record = node as Record<string, unknown>;
  const wfsUrl = textValue(record['wfs']) ?? textValue(record['owsURL']);
  if (wfsUrl) {
    found.push({
      name: textValue(record['name']),
      owsType: textValue(record['owsType']),
      wfsUrl,
      typeName: queryTypeName(namedChild(record, 'Query') ?? namedChild(record, 'query'))
    });
  }
  Object.values(record).forEach((value) => layerDescriptions(value, found));
  return found;
}

function namedChild(record: Record<string, unknown>, localName: string): unknown {
  return Object.entries(record).find(([key]) => key === localName || key.endsWith(`:${localName}`))?.[1];
}

function queryTypeName(query: unknown): string | undefined {
  if (Array.isArray(query)) {
    return query.map((item) => queryTypeName(item)).find((name) => name !== undefined);
  }
  if (!query || typeof query !== 'object') {
    return undefined;
  }
  return textValue((query as Record<string, unknown>)['typeName']);
}

function textValue(value: unknown): string | undefined {
  return typeof value === 'string' && value !== '' ? value : undefined;
}

export function describeFeatureTypeRequestUrl(
  serviceUrl: string | null | undefined,
  serviceType: string | null | undefined,
  typeName: string
): string | null {
  if (!serviceUrl) {
    return null;
  }
  if (/[?&]request=DescribeFeatureType(?:&|$)/i.test(serviceUrl)) {
    return serviceUrl;
  }
  if ((serviceType ?? '').toUpperCase() !== 'WFS') {
    return null;
  }
  let url: URL;
  try {
    url = new URL(serviceUrl);
  } catch {
    return null;
  }
  url.searchParams.set('service', 'WFS');
  url.searchParams.set('request', 'DescribeFeatureType');
  if (!url.searchParams.get('version')) {
    url.searchParams.set('version', '1.1.0');
  }
  if (typeName) {
    url.searchParams.set('typeName', typeName);
  }
  return url.toString();
}

export function featureTypeElementNames(asJson: unknown): string[] {
  const names: string[] = [];
  const extensions: Record<string, unknown>[] = [];
  findFeatureExtensions(asJson, extensions);
  extensions.forEach((extension) => collectElementNames(extension, names));
  return names;
}

function findFeatureExtensions(node: unknown, found: Record<string, unknown>[]): void {
  if (!node || typeof node !== 'object') {
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((child) => findFeatureExtensions(child, found));
    return;
  }
  const record = node as Record<string, unknown>;
  if (typeof record['base'] === 'string' && record['base'].includes('AbstractFeatureType')) {
    found.push(record);
  }
  Object.values(record).forEach((value) => findFeatureExtensions(value, found));
}

function collectElementNames(node: unknown, names: string[]): void {
  if (!node || typeof node !== 'object') {
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((child) => collectElementNames(child, names));
    return;
  }
  const record = node as Record<string, unknown>;
  Object.entries(record).forEach(([key, value]) => {
    if (isElementKey(key)) {
      const elements = Array.isArray(value) ? value : [value];
      elements.forEach((element) => {
        if (!element || typeof element !== 'object') {
          return;
        }
        const name = (element as { name?: unknown }).name;
        const type = (element as { type?: unknown }).type;
        if (typeof name === 'string' && !isGeometryElement(name, type)) {
          names.push(name);
        }
      });
      return;
    }
    if (isContainerKey(key)) {
      collectElementNames(value, names);
    }
  });
}

function isElementKey(key: string): boolean {
  return key === 'element' || key.endsWith(':element');
}

function localName(qualifiedName: string): string {
  const separator = qualifiedName.lastIndexOf(':');
  return separator === -1 ? qualifiedName : qualifiedName.slice(separator + 1);
}

function isGeometryElement(name: string, type: unknown): boolean {
  if (/^(geometry|geom|the_geom|shape)$/i.test(localName(name))) {
    return true;
  }
  if (typeof type !== 'string') {
    return false;
  }
  return /^(?:Multi)?(?:Point|LineString|Polygon|Curve|Surface|Geometry)PropertyType$/i.test(localName(type));
}

function isContainerKey(key: string): boolean {
  return (
    key === 'sequence' ||
    key.endsWith(':sequence') ||
    key === 'complexContent' ||
    key.endsWith(':complexContent') ||
    key === 'extension' ||
    key.endsWith(':extension')
  );
}
