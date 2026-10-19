export interface WfsCartographyRow {
  name: string;
  description: string;
  layers: string[];
}

export interface WfsCapabilitiesMapping {
  title: string;
  abstract: string;
  supportedSRS: string[];
  layers: WfsCartographyRow[];
}

export interface WfsCapabilityNode {
  Name: string;
  Title: string;
  Abstract: string;
}

const SRS_LOCAL_NAMES = ['DefaultSRS', 'DefaultCRS', 'OtherSRS', 'OtherCRS', 'SRS'] as const;

export function mapWfsCapabilities(document: unknown): WfsCapabilitiesMapping | null {
  const root = recordOf(child(recordOf(document), 'WFS_Capabilities'));
  if (!root) {
    return null;
  }

  const identification = recordOf(child(root, 'ServiceIdentification')) ?? recordOf(child(root, 'Service'));
  const featureTypes = asList(child(recordOf(child(root, 'FeatureTypeList')), 'FeatureType'));
  const supportedSRS: string[] = [];
  const layers: WfsCartographyRow[] = [];

  featureTypes.forEach((featureTypeValue) => {
    const featureType = recordOf(featureTypeValue);
    if (!featureType) {
      return;
    }
    const typeName = textOf(child(featureType, 'Name'));
    if (!typeName) {
      return;
    }
    srsValues(featureType).forEach((value) => {
      if (!supportedSRS.includes(value)) {
        supportedSRS.push(value);
      }
    });
    layers.push({
      name: textOf(child(featureType, 'Title')),
      description: textOf(child(featureType, 'Abstract')),
      layers: [typeName],
    });
  });

  return {
    title: textOf(child(identification, 'Title')),
    abstract: textOf(child(identification, 'Abstract')),
    supportedSRS,
    layers,
  };
}

export function wfsCapabilityNodes(document: unknown): WfsCapabilityNode[] | null {
  const mapped = mapWfsCapabilities(document);
  if (!mapped) {
    return null;
  }
  return mapped.layers.map((layer) => ({
    Name: layer.layers[0],
    Title: layer.name,
    Abstract: layer.description,
  }));
}

function recordOf(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function child(record: Record<string, unknown> | null, localName: string): unknown {
  if (!record) {
    return undefined;
  }
  if (Object.prototype.hasOwnProperty.call(record, localName)) {
    return record[localName];
  }
  const suffix = `:${localName}`;
  const key = Object.keys(record).find((candidate) => candidate.endsWith(suffix));
  return key ? record[key] : undefined;
}

function asList(value: unknown): unknown[] {
  if (value == null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function textOf(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const text = textOf(item);
      if (text) {
        return text;
      }
    }
    return '';
  }
  const record = recordOf(value);
  if (!record) {
    return '';
  }
  for (const key of ['content', '_', '#text'] as const) {
    const candidate = record[key];
    if (typeof candidate === 'string' || typeof candidate === 'number') {
      return String(candidate).trim();
    }
  }
  return '';
}

function srsValues(featureType: Record<string, unknown>): string[] {
  const values: string[] = [];
  SRS_LOCAL_NAMES.forEach((localName) => {
    asList(child(featureType, localName)).forEach((item) => {
      const text = textOf(item);
      if (text && !values.includes(text)) {
        values.push(text);
      }
    });
  });
  return values;
}
