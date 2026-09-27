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
        if (element && typeof element === 'object' && typeof (element as { name?: unknown }).name === 'string') {
          names.push((element as { name: string }).name);
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
