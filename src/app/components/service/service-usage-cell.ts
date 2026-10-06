import type {ServiceUsageWindow} from '@app/domain/service/models/service-access.model';

const BAR_HEIGHT = 14;

export function formatUsageTotal(total: number, locale = 'es'): string {
  if (locale.toLowerCase().startsWith('en')) {
    return new Intl.NumberFormat('en', {notation: 'compact', maximumFractionDigits: 1}).format(total);
  }
  const grouped = new Intl.NumberFormat('es-ES');
  if (Math.abs(total) < 1000) {
    return grouped.format(total);
  }
  const thousands = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(total / 1000);
  return `${thousands} mil`;
}

export function renderServiceUsage(
  usage: ServiceUsageWindow | null | undefined,
  lookup: (key: string) => string,
  locale = 'es',
): HTMLElement {
  const root = document.createElement('span');
  root.className = 'service-usage-30';
  if (!usage?.measured) {
    const label = document.createElement('span');
    label.className = 'service-usage-label';
    label.textContent = lookup('entity.service.usage.notMeasured');
    root.appendChild(label);
    if (usage?.viewerLoads) {
      root.title = `${lookup('entity.service.usage.viewerLoads')}: ${usage.viewerLoads}`;
    }
    return root;
  }

  const days = usage.days ?? [];
  const total = usage.total ?? 0;
  const bars = document.createElement('span');
  bars.className = 'service-usage-bars';
  const max = days.reduce((peak, value) => Math.max(peak, value ?? 0), 0);
  const count = days.length > 0 ? days.length : 30;
  for (let index = 0; index < count; index++) {
    const value = days[index] ?? 0;
    const bar = document.createElement('i');
    bar.className = 'service-usage-bar';
    bar.style.height = max === 0 ? '0px' : `${Math.round((value / max) * BAR_HEIGHT)}px`;
    bars.appendChild(bar);
  }
  root.appendChild(bars);

  const label = document.createElement('span');
  label.className = 'service-usage-label';
  if (total === 0) {
    label.textContent = lookup('entity.service.usage.unused');
    root.title = usage.lastUsedDay || lookup('entity.service.usage.unused');
  } else {
    label.textContent = formatUsageTotal(total, locale);
    const failedPercent = Math.round(((usage.failed ?? 0) / total) * 100);
    if (failedPercent >= 1) {
      const fail = document.createElement('span');
      fail.className = 'service-usage-fail';
      fail.textContent = `· ${failedPercent} %`;
      label.appendChild(fail);
    }
    if (usage.lastUsedDay) {
      root.title = usage.lastUsedDay;
    }
  }
  root.appendChild(label);
  return root;
}
