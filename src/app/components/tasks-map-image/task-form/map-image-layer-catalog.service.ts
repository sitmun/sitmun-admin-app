import { Injectable } from '@angular/core';

import { CartographyProjection, Service } from '@app/domain';

export interface MapImageLayerOption {
  serviceId: number;
  serviceName: string;
  layerIds: string[];
  layerIdLabel: string;
  layerName: string;
}

@Injectable({ providedIn: 'root' })
export class MapImageLayerCatalogService {
  toOption(cartography: CartographyProjection, service: Service): MapImageLayerOption | null {
    const layerIds = this.normalizeLayerNames(cartography.layers);
    if (layerIds.length === 0) return null;
    return {
      serviceId: typeof cartography.serviceId === 'number' ? cartography.serviceId : service.id,
      serviceName: String(cartography.serviceName || service.name || ''),
      layerIds,
      layerIdLabel: layerIds.join(', '),
      layerName: String(cartography.name || layerIds.join(', ')),
    };
  }

  sort(options: MapImageLayerOption[]): MapImageLayerOption[] {
    return [...options].sort((left, right) => {
      const nameComparison = left.layerName.localeCompare(right.layerName);
      return nameComparison !== 0 ? nameComparison : left.layerIdLabel.localeCompare(right.layerIdLabel);
    });
  }

  sortByService(options: MapImageLayerOption[]): MapImageLayerOption[] {
    return [...options].sort((left, right) => {
      const serviceComparison = left.serviceName.localeCompare(right.serviceName);
      if (serviceComparison !== 0) return serviceComparison;
      const nameComparison = left.layerName.localeCompare(right.layerName);
      return nameComparison !== 0 ? nameComparison : left.layerIdLabel.localeCompare(right.layerIdLabel);
    });
  }

  normalizeLayerNames(raw: unknown): string[] {
    const names = Array.isArray(raw)
      ? raw.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
      : [];
    return Array.from(new Set(names));
  }

  find(options: MapImageLayerOption[], serviceId: number, layerId: string): MapImageLayerOption | null {
    return options.find((option) => option.serviceId === serviceId && option.layerIds.length === 1 && option.layerIds.includes(layerId))
      ?? options.find((option) => option.serviceId === serviceId && option.layerIds.includes(layerId))
      ?? null;
  }
}
