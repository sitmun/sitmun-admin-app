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

/** Some servers return a broken WFS 1.1.0 schema but a usable 2.0.0 one for the same feature type. */
export function describeFeatureTypeRetryUrl(requestUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(requestUrl);
  } catch {
    return null;
  }
  const request = paramKey(url, 'request');
  const version = paramKey(url, 'version');
  if (
    !request || url.searchParams.get(request)?.toLowerCase() !== 'describefeaturetype' ||
    !version || url.searchParams.get(version) !== '1.1.0'
  ) {
    return null;
  }
  url.searchParams.set(version, '2.0.0');
  const typeName = paramKey(url, 'typeName');
  if (typeName) {
    const value = url.searchParams.get(typeName) ?? '';
    url.searchParams.delete(typeName);
    url.searchParams.set('typeNames', value);
  }
  return url.toString();
}

function paramKey(url: URL, name: string): string | undefined {
  return [...url.searchParams.keys()].find((key) => key.toLowerCase() === name.toLowerCase());
}

export type FeatureTypeGeometryProperty = {
  name: string;
  kind: string;
};

export type FeatureTypeDocument = {
  url: string;
  asJson: unknown;
};

export type FeatureTypeResolution = {
  names: string[];
  geometryProperties: FeatureTypeGeometryProperty[];
  /** Schemas still needed to finish the requested feature type, resolved against the document that cites them. */
  pendingSchemas: string[];
};

type Schema = {
  url: string;
  record: Record<string, unknown>;
  targetNamespace?: string;
};

type QualifiedName = {
  prefix?: string;
  namespace?: string;
  local: string;
};

type Declaration = {
  record: Record<string, unknown>;
  schema: Schema;
};

const GML_NAMESPACE = /^http:\/\/www\.opengis\.net\/gml(?:\/|$)/;

/**
 * Reads the feature type named in the first document's request URL. The type and its parent
 * types may be declared in included or imported schemas; those are reported in `pendingSchemas`
 * until the caller adds them to `documents`. GML schemas are never requested.
 */
export function resolveFeatureType(documents: FeatureTypeDocument[]): FeatureTypeResolution {
  const first = documents[0];
  const fallback = (): FeatureTypeResolution => {
    const { names, geometryProperties } = readFeatureTypeElements(first?.asJson);
    return { names, geometryProperties, pendingSchemas: [] };
  };
  const schemas = documents.flatMap((document): Schema[] => {
    const record = schemaRecord(document.asJson);
    return record ? [{ url: document.url, record, targetNamespace: textValue(record['targetNamespace']) }] : [];
  });
  const typeName = requestedTypeName(first?.url);
  const rootSchema = schemas.find((schema) => schema.url === first?.url);
  if (!typeName || !rootSchema) {
    return fallback();
  }
  const loaded = new Set(documents.map((document) => document.url));
  const pendingFor = (name: QualifiedName) => schemaLocations(schemas, name.namespace, loaded);

  const rootName = qualifiedName(typeName, rootSchema);
  const element = findDeclaration(schemas, 'element', rootName);
  if (!element) {
    const pendingSchemas = pendingFor(rootName);
    return pendingSchemas.length > 0 ? { names: [], geometryProperties: [], pendingSchemas } : fallback();
  }

  const levels: Declaration[] = [];
  const seen = new Set<string>();
  let pendingSchemas: string[] = [];
  const inline = children(element.record, 'complexType')[0];
  let next: QualifiedName | null = null;
  if (inline) {
    levels.unshift({ record: inline, schema: element.schema });
    next = baseName(levels[0]);
  } else if (typeof element.record['type'] === 'string') {
    next = qualifiedName(element.record['type'], element.schema);
  }
  while (next && !isGml(next) && !seen.has(`${next.namespace} ${next.local}`)) {
    seen.add(`${next.namespace} ${next.local}`);
    const type = findDeclaration(schemas, 'complexType', next);
    if (!type) {
      pendingSchemas = pendingFor(next);
      break;
    }
    levels.unshift(type);
    next = baseName(type);
  }

  const names: string[] = [];
  const geometryKinds: string[] = [];
  const geometryProperties: FeatureTypeGeometryProperty[] = [];
  levels.forEach((level) => collectElementNames(level.record, names, geometryKinds, geometryProperties));
  return { names, geometryProperties, pendingSchemas };
}

function requestedTypeName(requestUrl: string | undefined): string | undefined {
  if (!requestUrl) {
    return undefined;
  }
  let url: URL;
  try {
    url = new URL(requestUrl);
  } catch {
    return undefined;
  }
  const key = paramKey(url, 'typeNames') ?? paramKey(url, 'typeName');
  return key ? textValue(url.searchParams.get(key)?.split(',')[0].trim()) : undefined;
}

function schemaRecord(asJson: unknown): Record<string, unknown> | undefined {
  if (!asJson || typeof asJson !== 'object' || Array.isArray(asJson)) {
    return undefined;
  }
  const value = Object.entries(asJson).find(([key]) => key === 'schema' || key.endsWith(':schema'))?.[1];
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function children(record: Record<string, unknown>, local: string): Record<string, unknown>[] {
  const value = namedChild(record, local);
  return (Array.isArray(value) ? value : [value]).filter(
    (child): child is Record<string, unknown> => !!child && typeof child === 'object' && !Array.isArray(child)
  );
}

function qualifiedName(name: string, schema: Schema): QualifiedName {
  const separator = name.indexOf(':');
  if (separator === -1) {
    return { namespace: schema.targetNamespace, local: name };
  }
  const prefix = name.slice(0, separator);
  return {
    prefix,
    namespace: textValue(schema.record[`xmlns:${prefix}`]) ?? (prefix === 'gml' ? undefined : schema.targetNamespace),
    local: name.slice(separator + 1)
  };
}

function isGml(name: QualifiedName): boolean {
  return name.namespace ? GML_NAMESPACE.test(name.namespace) : name.prefix === 'gml';
}

function findDeclaration(schemas: Schema[], kind: string, name: QualifiedName): Declaration | undefined {
  for (const schema of schemas) {
    if (name.namespace !== undefined && schema.targetNamespace !== undefined && schema.targetNamespace !== name.namespace) {
      continue;
    }
    const record = children(schema.record, kind).find((child) => child['name'] === name.local);
    if (record) {
      return { record, schema };
    }
  }
  return undefined;
}

function baseName(type: Declaration): QualifiedName | null {
  const complexContent = children(type.record, 'complexContent')[0];
  const base = complexContent ? children(complexContent, 'extension')[0]?.['base'] : undefined;
  return typeof base === 'string' ? qualifiedName(base, type.schema) : null;
}

function schemaLocations(schemas: Schema[], namespace: string | undefined, loaded: Set<string>): string[] {
  const urls = new Set<string>();
  schemas.forEach((schema) => {
    const cited = [
      ...children(schema.record, 'import').filter((item) => textValue(item['namespace']) === namespace),
      ...(schema.targetNamespace === namespace ? children(schema.record, 'include') : [])
    ];
    cited.forEach((item) => {
      const location = resolvedLocation(item['schemaLocation'], schema.url);
      if (location && !loaded.has(location)) {
        urls.add(location);
      }
    });
  });
  return [...urls];
}

function resolvedLocation(location: unknown, base: string): string | undefined {
  if (typeof location !== 'string' || location === '') {
    return undefined;
  }
  try {
    return new URL(location, base).toString();
  } catch {
    return undefined;
  }
}

export function featureTypeElementNames(asJson: unknown): string[] {
  return readFeatureTypeElements(asJson).names;
}

export function featureTypeGeometryKinds(asJson: unknown): string[] {
  return readFeatureTypeElements(asJson).geometryKinds;
}

export function featureTypeGeometryProperties(asJson: unknown): FeatureTypeGeometryProperty[] {
  return readFeatureTypeElements(asJson).geometryProperties;
}

function readFeatureTypeElements(asJson: unknown): {
  names: string[];
  geometryKinds: string[];
  geometryProperties: FeatureTypeGeometryProperty[];
} {
  const names: string[] = [];
  const geometryKinds: string[] = [];
  const geometryProperties: FeatureTypeGeometryProperty[] = [];
  const extensions: Record<string, unknown>[] = [];
  findFeatureExtensions(asJson, extensions);
  extensions.forEach((extension) =>
    collectElementNames(extension, names, geometryKinds, geometryProperties)
  );
  return { names, geometryKinds, geometryProperties };
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

function collectElementNames(
  node: unknown,
  names: string[],
  geometryKinds: string[],
  geometryProperties: FeatureTypeGeometryProperty[]
): void {
  if (!node || typeof node !== 'object') {
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((child) => collectElementNames(child, names, geometryKinds, geometryProperties));
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
        const kind = geometryKind(type);
        if (typeof name !== 'string') {
          return;
        }
        if (kind) {
          geometryKinds.push(kind);
          geometryProperties.push({ name, kind });
          return;
        }
        names.push(name);
      });
      return;
    }
    if (isContainerKey(key)) {
      collectElementNames(value, names, geometryKinds, geometryProperties);
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

const GEOMETRY_PROPERTY_TYPE = /^((?:Multi)?(?:Point|LineString|Polygon|Curve|Surface|Geometry))PropertyType$/i;

function geometryKind(type: unknown): string | null {
  if (typeof type !== 'string') {
    return null;
  }
  return localName(type).match(GEOMETRY_PROPERTY_TYPE)?.[1] ?? null;
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
