import { CodeList } from '@app/domain/codelist/models/codelist.model';

/** Same codes as ParameterScopes, in dropdown order. */
export const PARAMETER_TYPES_BY_SERVICE_TYPE: Readonly<Record<string, readonly string[]>> = {
  WMS: ['WMS', 'GETMAP', 'INFO', 'OLPARAM', 'VARY'],
  WMTS: ['WMTS', 'OLPARAM', 'VARY'],
  WFS: ['WFS', 'OLPARAM', 'VARY'],
};

export type ParameterLeadProtocol = 'WMS' | 'WMTS' | 'WFS';

export function parameterLeadProtocol(
  serviceType: string | null | undefined,
): ParameterLeadProtocol | null {
  const type = serviceType?.trim().toUpperCase();
  if (type === 'WMS' || type === 'WMTS' || type === 'WFS') {
    return type;
  }
  return null;
}

export function allowedParameterTypeCodes(
  serviceType: string | null | undefined,
): readonly string[] {
  if (serviceType == null || serviceType.trim() === '') {
    return [];
  }
  return PARAMETER_TYPES_BY_SERVICE_TYPE[serviceType.trim().toUpperCase()] ?? [];
}

export function codesInScope(
  codeList: CodeList[],
  serviceType: string | null | undefined,
  selected: string | null | undefined,
): CodeList[] {
  const byValue = new Map(codeList.map((item) => [item.value, item]));
  const ordered = allowedParameterTypeCodes(serviceType)
    .map((value) => byValue.get(value))
    .filter((item): item is CodeList => item != null);
  if (selected && !ordered.some((item) => item.value === selected)) {
    const current = byValue.get(selected);
    if (current) {
      ordered.push(current);
    }
  }
  return ordered;
}
