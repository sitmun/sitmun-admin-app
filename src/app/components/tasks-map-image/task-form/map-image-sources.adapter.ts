export interface MapImageSource extends Record<string, unknown> {
  serviceId: number;
  layerNames: string[];
}

export interface MapImageLayerSelection {
  serviceId: number | null;
  layerId: string;
}

export interface MapImageLayerGroup {
  serviceId: number;
  layerIds: string[];
}

/** Pure transformations for the map-image form's persisted mapSources value. */
export class MapImageSourcesAdapter {
  normalize(raw: unknown): MapImageSource[] {
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw
      .map((source) => this.normalizeSource(source))
      .filter((source): source is MapImageSource => source !== null);
  }

  add(sources: readonly MapImageSource[], option: MapImageLayerGroup): MapImageSource[] {
    const next = this.normalize(sources);
    const selected = new Set(
      next.filter((source) => source.serviceId === option.serviceId).flatMap((source) => source.layerNames),
    );
    const layerNames = option.layerIds.filter((layerId) => !selected.has(layerId));
    if (layerNames.length === 0) {
      return next;
    }

    const last = next[next.length - 1];
    if (last?.serviceId === option.serviceId) {
      last.layerNames = this.unique([...last.layerNames, ...layerNames]);
    } else {
      next.push({ serviceId: option.serviceId, layerNames: this.unique(layerNames) });
    }
    return next;
  }

  remove(sources: readonly MapImageSource[], row: MapImageLayerSelection): MapImageSource[] {
    if (row.serviceId == null || !row.layerId) {
      return this.normalize(sources);
    }
    return this.removeRows(sources, [row]);
  }

  removeRows(sources: readonly MapImageSource[], rows: readonly MapImageLayerSelection[]): MapImageSource[] {
    const selected = new Map<number, Set<string>>();
    rows.forEach((row) => {
      if (row.serviceId == null || !row.layerId) {
        return;
      }
      const layerIds = selected.get(row.serviceId) ?? new Set<string>();
      layerIds.add(row.layerId);
      selected.set(row.serviceId, layerIds);
    });

    return this.normalize(sources)
      .map((source) => ({
        serviceId: source.serviceId,
        layerNames: source.layerNames.filter((layerName) => !selected.get(source.serviceId)?.has(layerName)),
      }))
      .filter((source) => source.layerNames.length > 0);
  }

  reorder(rows: readonly MapImageLayerSelection[]): MapImageSource[] {
    return rows.reduce((sources, row) => {
      if (row.serviceId == null || !row.layerId) {
        return sources;
      }
      const last = sources[sources.length - 1];
      if (last?.serviceId === row.serviceId) {
        last.layerNames = this.unique([...last.layerNames, row.layerId]);
      } else {
        sources.push({ serviceId: row.serviceId, layerNames: [row.layerId] });
      }
      return sources;
    }, [] as MapImageSource[]);
  }

  payload(sources: readonly MapImageSource[]): MapImageSource[] {
    return this.normalize(sources);
  }

  private normalizeSource(raw: unknown): MapImageSource | null {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return null;
    }
    const source = raw as Record<string, unknown>;
    if (typeof source['serviceId'] !== 'number') {
      return null;
    }
    const layerNames = this.normalizeLayerNames(source['layerNames']);
    return layerNames.length > 0 ? { serviceId: source['serviceId'], layerNames } : null;
  }

  private normalizeLayerNames(raw: unknown): string[] {
    return Array.isArray(raw)
      ? this.unique(raw.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean))
      : [];
  }

  private unique(values: readonly string[]): string[] {
    return Array.from(new Set(values));
  }
}
