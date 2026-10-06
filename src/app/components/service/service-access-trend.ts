import type {ServiceAccessHour, ServiceAccessObservation} from '@app/domain/service/models/service-access.model';

const HOUR_COUNT = 24;
const TEN_MINUTE_COUNT = 144;
const TEN_MINUTE_MS = 10 * 60 * 1000;
const CURRENT_HOUR_INDEX = HOUR_COUNT - 1;

export type AccessTrendResolution = 'hour' | 'tenMinute';

const GOOD_HOUR = '#2e7d32';
const BAD_HOUR = '#c62828';
const UNKNOWN_HOUR = '#c4c4c4';
const GOOD_STATUSES = new Set(['up', 'reached']);
const NO_SAMPLE_KEY = 'entity.service.access.noSample';

export function accessObserverLabel(
  observer: string | null | undefined,
  lookup: (key: string) => string,
): string {
  if (!observer) {
    return '';
  }
  const key = `entity.service.access.observer.${observer}`;
  const translated = lookup(key);
  return translated === key ? observer : translated;
}

export function accessStatusLabel(
  code: string | null | undefined,
  lookup: (key: string) => string,
): string {
  if (!code) {
    return '';
  }
  const key = `entity.service.access.status.${code}`;
  const translated = lookup(key);
  return translated === key ? code : translated;
}

/** Oldest bucket at index 0. A missing slot stays empty. Backend and proxy samples both paint. */
export function accessTrendSlots(
  hours: Array<ServiceAccessHour | null> | null | undefined,
  resolution: AccessTrendResolution = 'hour',
): Array<ServiceAccessHour | null> {
  const count = bucketCount(resolution);
  const slots: Array<ServiceAccessHour | null> = Array.from({length: count}, () => null);
  hours?.forEach((hour, index) => {
    if (index >= count) {
      return;
    }
    slots[index] = paintableHour(hour);
  });
  return slots;
}

export function healthyAccessStatus(status: string | null | undefined): boolean {
  return !!status && GOOD_STATUSES.has(status);
}

export function hourColor(hour: ServiceAccessHour | null | undefined): string {
  const status = paintableHour(hour)?.status;
  if (!status) {
    return UNKNOWN_HOUR;
  }
  return GOOD_STATUSES.has(status) ? GOOD_HOUR : BAD_HOUR;
}

/**
 * Paints a backend check into the current bucket when its rank is at least the sample already there.
 * Proxy observations leave the strip unchanged.
 */
export function mergeBackendObservation(
  hours: Array<ServiceAccessHour | null>,
  observation: Pick<ServiceAccessObservation, 'status' | 'statusRank' | 'observer'> | null | undefined,
  resolution: AccessTrendResolution = 'hour',
): Array<ServiceAccessHour | null> {
  if (!observation || observation.observer !== 'backend' || !observation.status) {
    return hours;
  }
  const next = hours.slice();
  const incoming: ServiceAccessHour = {
    status: observation.status,
    statusRank: observation.statusRank ?? 0,
    observer: 'backend',
  };
  const currentIndex = bucketCount(resolution) - 1;
  const current = next[currentIndex];
  if (current?.status && (current.statusRank ?? 0) > (incoming.statusRank ?? 0)) {
    return next;
  }
  next[currentIndex] = incoming;
  return next;
}

export function accessHourTooltip(
  hour: ServiceAccessHour | null | undefined,
  index: number,
  lookup: (key: string) => string,
  now: Date = new Date(),
  timeZone?: string,
  resolution: AccessTrendResolution = 'hour',
): string {
  const painted = paintableHour(hour);
  const text = painted?.status ? accessStatusLabel(painted.status, lookup) : noSampleLabel(lookup);
  const sources = painted?.observers?.length
    ? painted.observers
    : painted?.observer ? [painted.observer] : [];
  const source = sources.map((observer) => accessObserverLabel(observer, lookup)).join(', ');
  const clock = bucketClock(index, now, timeZone, resolution);
  return source ? `${clock} · ${text} · ${source}` : `${clock} · ${text}`;
}

export function renderAccessTrend(
  hours: Array<ServiceAccessHour | null> | null | undefined,
  lookup: (key: string) => string = (key) => key,
  now: Date = new Date(),
  timeZone?: string,
  resolution: AccessTrendResolution = 'hour',
): HTMLElement {
  const strip = document.createElement('span');
  strip.className = 'service-access-trend';
  accessTrendSlots(hours, resolution).forEach((hour, index) => {
    const cell = document.createElement('i');
    cell.className = 'service-access-hour';
    cell.style.backgroundColor = hourColor(hour);
    cell.title = accessHourTooltip(hour, index, lookup, now, timeZone, resolution);
    strip.appendChild(cell);
  });
  return strip;
}

function bucketCount(resolution: AccessTrendResolution): number {
  switch (resolution) {
    case 'hour':
      return HOUR_COUNT;
    case 'tenMinute':
      return TEN_MINUTE_COUNT;
    default: {
      const unexpected: never = resolution;
      return unexpected;
    }
  }
}

export function hourMinute(date: Date): string {
  const {hour, minute} = clockParts(date);
  return `${pad(hour)}:${pad(minute)}`;
}

export function bucketStart(index: number, now: Date, resolution: AccessTrendResolution): Date {
  switch (resolution) {
    case 'hour': {
      const hourMs = 60 * 60 * 1000;
      const current = Math.floor(now.getTime() / hourMs) * hourMs;
      return new Date(current - (HOUR_COUNT - 1 - index) * hourMs);
    }
    case 'tenMinute': {
      const current = Math.floor(now.getTime() / TEN_MINUTE_MS) * TEN_MINUTE_MS;
      return new Date(current - (TEN_MINUTE_COUNT - 1 - index) * TEN_MINUTE_MS);
    }
    default: {
      const unexpected: never = resolution;
      return unexpected;
    }
  }
}

function bucketClock(
  index: number,
  now: Date,
  timeZone: string | undefined,
  resolution: AccessTrendResolution,
): string {
  switch (resolution) {
    case 'hour': {
      const hour = (clockParts(now, timeZone).hour - (CURRENT_HOUR_INDEX - index) + HOUR_COUNT) % HOUR_COUNT;
      return `${pad(hour)}:00`;
    }
    case 'tenMinute': {
      const {hour, minute} = clockParts(now, timeZone);
      const currentStart = hour * 60 + Math.floor(minute / 10) * 10;
      const start = currentStart - (TEN_MINUTE_COUNT - 1 - index) * 10;
      const minutesInDay = 24 * 60;
      const wrapped = ((start % minutesInDay) + minutesInDay) % minutesInDay;
      return `${pad(Math.floor(wrapped / 60))}:${pad(wrapped % 60)}`;
    }
    default: {
      const unexpected: never = resolution;
      return unexpected;
    }
  }
}

function clockParts(date: Date, timeZone?: string): {hour: number; minute: number} {
  const parts = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone,
  }).formatToParts(date);
  return {
    hour: Number(parts.find((part) => part.type === 'hour')?.value),
    minute: Number(parts.find((part) => part.type === 'minute')?.value),
  };
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function noSampleLabel(lookup: (key: string) => string): string {
  const translated = lookup(NO_SAMPLE_KEY);
  return translated === NO_SAMPLE_KEY ? NO_SAMPLE_KEY : translated;
}

function paintableHour(hour: ServiceAccessHour | null | undefined): ServiceAccessHour | null {
  if (!hour?.status) {
    return null;
  }
  return hour;
}

export function renderAccessStatus(status: string | null | undefined, label: string): HTMLElement {
  const root = document.createElement('span');
  root.className = 'service-access-status';
  const dot = document.createElement('i');
  dot.className = 'service-access-status-dot service-access-status-halo';
  dot.style.color = hourColor(status ? {status} : null);
  dot.style.backgroundColor = dot.style.color;
  root.appendChild(dot);
  const text = document.createElement('span');
  text.textContent = label;
  root.appendChild(text);
  return root;
}
