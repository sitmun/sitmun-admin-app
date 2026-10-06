import {ServiceUsageView} from '@app/domain/service/models/service-access.model';

import {accessTrendSlots, bucketStart, healthyAccessStatus} from './service-access-trend';

const NONE_KEY = 'entity.service.access.none';
const RETURNS_KEY = 'entity.service.access.returns';
const UNKNOWN_HOST_KEY = 'entity.service.access.unknownHost';
const CONNECTION_REFUSED_KEY = 'entity.service.access.connectionRefused';
const TIMED_OUT_KEY = 'entity.service.access.timedOut';
const TLS_KEY = 'entity.service.access.tlsHandshake';

const TIMEOUT_CLASS = new Set([
  'SocketTimeoutException',
  'InterruptedIOException',
  'ClosedByInterruptException',
  'TimeoutException',
]);

/**
 * Stored detail is `request host/path | evidence`.
 * The sentence keeps the request and replaces machine evidence with a phrase.
 */
export function accessDetailSentence(
  detail: string | null | undefined,
  lookup: (key: string) => string,
): string {
  if (detail == null || detail.trim() === '') {
    return lookup(NONE_KEY);
  }
  const splitAt = detail.indexOf(' | ');
  const evidence = splitAt < 0 ? '' : detail.slice(splitAt + ' | '.length).trim();
  const request = accessDetailRequest(detail);
  const phrase = evidencePhrase(evidence, lookup);
  if (request === '') {
    return phrase.alone;
  }
  if (phrase.withRequest === '') {
    return request;
  }
  return `${request} ${phrase.withRequest}`;
}

/** The leading request token of a stored detail: an OGC operation for backend probes, the HTTP method for proxy forwards. */
export function accessDetailRequest(detail: string | null | undefined): string {
  return (detail ?? '').split(' | ', 1)[0].trim().split(/\s+/, 1)[0] ?? '';
}

function evidencePhrase(
  evidence: string,
  lookup: (key: string) => string,
): {alone: string; withRequest: string} {
  if (evidence === '') {
    return {alone: '', withRequest: ''};
  }
  const mapped = mappedEvidence(evidence, lookup);
  if (mapped != null) {
    return {alone: mapped, withRequest: mapped};
  }
  const http = /^HTTP\s+(\d{3})$/i.exec(evidence);
  if (http) {
    const status = `HTTP ${http[1]}`;
    return {alone: status, withRequest: `${lookup(RETURNS_KEY)} ${status}`};
  }
  const words = readableEvidence(evidence);
  if (words === '') {
    return {alone: '', withRequest: ''};
  }
  return {alone: words, withRequest: `${lookup(RETURNS_KEY)} ${words}`};
}

function mappedEvidence(evidence: string, lookup: (key: string) => string): string | null {
  const name = simpleClass(evidence);
  if (name === 'UnknownHostException') {
    return lookup(UNKNOWN_HOST_KEY);
  }
  if (name === 'ConnectException') {
    return lookup(CONNECTION_REFUSED_KEY);
  }
  if (TIMEOUT_CLASS.has(name) || (!isHttpSentence(evidence) && /\btimeout\b/i.test(evidence))) {
    return lookup(TIMED_OUT_KEY);
  }
  if (isTlsClass(name) || (!isHttpSentence(evidence) && /\btls\b/i.test(evidence))) {
    return lookup(TLS_KEY);
  }
  return null;
}

function simpleClass(evidence: string): string {
  const token = (evidence.split(/[\s,]+/, 1)[0] ?? '').replace(/[.:]+$/g, '');
  const dot = token.lastIndexOf('.');
  return dot < 0 ? token : token.slice(dot + 1);
}

function isTlsClass(name: string): boolean {
  return name === 'SSLHandshakeException' || (name.startsWith('SSL') && name.endsWith('Exception'));
}

function isHttpSentence(evidence: string): boolean {
  return /^HTTP\s+\d{3}\b/i.test(evidence);
}

function readableEvidence(evidence: string): string {
  const words = evidence
    .replace(/https?:\/\/\S+/gi, ' ')
    .split(/\s+/)
    .filter((token) => !isMachineToken(token))
    .join(' ')
    .replace(/\s+([,.;:])/g, '$1')
    .replace(/\(\s*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return words.replace(/^[,.;:\s]+|[,.;:\s]+$/g, '').trim();
}

export const AVAILABILITY_TARGET_PERCENT = 95;

export interface MonitoringFacts {
  status: string;
  since: Date | null;
  observer: string | null;
  elapsedMs: number | null;
  good: number;
  checked: number;
  missing: number;
  availabilityPercent: number | null;
  belowTarget: boolean;
  p50: number | null;
  p95: number | null;
  timedOut: number;
}

export const TIMEOUT_STATUS = 'timeout';

export function monitoringFacts(
  observation: {
    status: string;
    observer?: string | null;
    elapsedMs?: number | null;
  } | null,
  hours: Array<{status?: string | null} | null> | null | undefined,
  samples: Array<{elapsedMs: number; status: string}>,
  now: Date,
): MonitoringFacts | null {
  if (observation == null) {
    return null;
  }
  // A timeout measures the limit, not a response, so it stays out of the percentiles.
  const completed = samples.filter((sample) => sample.status !== TIMEOUT_STATUS).map((sample) => sample.elapsedMs);
  const slots = accessTrendSlots(hours, 'tenMinute');
  const painted = slots.filter((slot) => slot?.status);
  const percent = availabilityPercent(slots);
  return {
    status: observation.status,
    since: statusSince(slots, observation.status, now),
    observer: observation.observer ?? null,
    elapsedMs: observation.elapsedMs ?? null,
    good: painted.filter((slot) => healthyAccessStatus(slot?.status)).length,
    checked: painted.length,
    missing: slots.length - painted.length,
    availabilityPercent: percent,
    belowTarget: typeof percent === 'number' && percent < AVAILABILITY_TARGET_PERCENT,
    p50: elapsedPercentile(completed, 50),
    p95: elapsedPercentile(completed, 95),
    timedOut: samples.length - completed.length,
  };
}

function statusSince(
  slots: Array<{status?: string | null} | null>,
  status: string,
  now: Date,
): Date | null {
  let index = slots.length - 1;
  while (index >= 0 && !slots[index]?.status) {
    index -= 1;
  }
  if (index < 0 || slots[index]?.status !== status) {
    return null;
  }
  let start = index;
  while (index > 0) {
    const previous = slots[index - 1]?.status ?? null;
    if (previous == null) {
      index -= 1;
      continue;
    }
    if (previous !== status) {
      break;
    }
    index -= 1;
    start = index;
  }
  return bucketStart(start, now, 'tenMinute');
}

export function availabilityPercent(
  hours: Array<{status?: string | null} | null> | null | undefined,
): number | null {
  const checked = (hours ?? []).filter((hour) => hour?.status);
  if (checked.length === 0) {
    return null;
  }
  const good = checked.filter((hour) => healthyAccessStatus(hour?.status)).length;
  return Math.round((good / checked.length) * 100);
}

export interface UsageFacts {
  requests: number;
  previousRequests: number | null;
  deltaPercent: number | null;
  failed: number;
  failedPercent: number | null;
  previousFailed: number | null;
  lastUsedDay: string | null;
  daysWithUse: number;
  periodSlots: number;
  viewerLoads: number;
}

export function operationErrorPercent(
  requests: number | null | undefined,
  failed: number | null | undefined,
): number | null {
  if (requests == null || requests === 0) {
    return null;
  }
  return Math.round(((failed ?? 0) / requests) * 100);
}

export function usageFacts(view: ServiceUsageView | null): UsageFacts | null {
  if (view == null || !view.measured) {
    return null;
  }
  const requests = view.total ?? 0;
  const previousRequests = view.previousTotal ?? null;
  const failed = view.failed ?? 0;
  const series = view.series ?? [];
  return {
    requests,
    previousRequests,
    deltaPercent: previousRequests == null || previousRequests === 0
      ? null
      : Math.round(((requests - previousRequests) / previousRequests) * 100),
    failed,
    failedPercent: requests === 0 ? null : Math.round((failed / requests) * 100),
    previousFailed: view.previousFailed ?? null,
    lastUsedDay: view.lastUsedDay ?? null,
    daysWithUse: series.filter((point) => typeof point.value === 'number' && point.value > 0).length,
    periodSlots: series.length,
    viewerLoads: view.viewerLoads,
  };
}

export function usageAsOfClock(asOf: string | null | undefined, locale: string): string | null {
  if (asOf == null || asOf.trim() === '') {
    return null;
  }
  const date = new Date(asOf);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const tag = locale.trim() || 'es';
  try {
    return new Intl.DateTimeFormat(tag, {hour: '2-digit', minute: '2-digit'}).format(date);
  } catch {
    return new Intl.DateTimeFormat('es', {hour: '2-digit', minute: '2-digit'}).format(date);
  }
}

export function elapsedPercentile(values: number[], percentile: number): number | null {
  const sorted = values.filter((value) => Number.isFinite(value)).slice().sort((left, right) => left - right);
  if (sorted.length === 0) {
    return null;
  }
  const rank = (percentile / 100) * (sorted.length - 1);
  const low = Math.floor(rank);
  const high = Math.ceil(rank);
  if (low === high) {
    return sorted[low];
  }
  return Math.round(sorted[low] + (sorted[high] - sorted[low]) * (rank - low));
}

export interface AccessChange {
  from: string;
  to: string;
  index: number;
  observers: string[];
}

export function recentAccessChanges(
  hours: Array<{status?: string | null; observer?: string | null; observers?: string[] | null} | null> | null | undefined,
  limit = 5,
): AccessChange[] {
  const changes: AccessChange[] = [];
  let previous: string | null = null;
  (hours ?? []).forEach((hour, index) => {
    const status = hour?.status ?? null;
    if (status == null) {
      return;
    }
    if (previous != null && status !== previous) {
      changes.push({
        from: previous,
        to: status,
        index,
        observers: hour?.observers?.length ? hour.observers : hour?.observer ? [hour.observer] : [],
      });
    }
    previous = status;
  });
  return changes.slice(-limit).reverse();
}

export function accessSinceLabel(observedAt: string | null | undefined, locale = 'es'): string {
  if (!observedAt) {
    return '';
  }
  const date = new Date(observedAt);
  if (Number.isNaN(date.getTime())) {
    return observedAt;
  }
  return new Intl.DateTimeFormat(locale, {dateStyle: 'medium', timeStyle: 'short'}).format(date);
}

function isMachineToken(token: string): boolean {
  const bare = token.replace(/^[,.;:()]+|[,.;:()]+$/g, '');
  if (bare === '') {
    return true;
  }
  if (/(?:^|\.)[A-Za-z_][\w]*Exception$/.test(bare)) {
    return true;
  }
  if (/^localhost(?:[:/]\S*)?$/i.test(bare)) {
    return true;
  }
  if (/^(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:\/\S*)?$/.test(bare)) {
    return true;
  }
  if (/^(?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?(?:\/\S*)?$/i.test(bare)) {
    return true;
  }
  return bare.startsWith('/');
}
