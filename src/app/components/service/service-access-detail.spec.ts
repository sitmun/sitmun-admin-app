import {accessDetailSentence, availabilityPercent, elapsedPercentile, monitoringFacts, operationErrorPercent, recentAccessChanges, usageAsOfClock, usageFacts} from './service-access-detail';
import {bucketStart} from './service-access-trend';

const phrases: Record<string, string> = {
  'entity.service.access.none': 'None',
  'entity.service.access.returns': 'returns',
  'entity.service.access.unknownHost': 'could not resolve the host',
  'entity.service.access.connectionRefused': 'connection refused',
  'entity.service.access.timedOut': 'timed out',
  'entity.service.access.tlsHandshake': 'TLS handshake failed',
};

function shown(detail: string | null): string {
  return accessDetailSentence(detail, (key) => phrases[key] ?? key);
}

describe('access detail sentence', () => {
  it('shows UnknownHostException as could not resolve the host', () => {
    const line = shown('GetCapabilities blocked.example.com/wms | UnknownHostException blocked.example.com');

    expect(line).toBe('GetCapabilities could not resolve the host');
    expect(line).not.toContain('UnknownHostException');
    expect(line).not.toContain('blocked.example.com');
  });

  it('shows HTTP 404 as returns HTTP 404', () => {
    const line = shown('GetCapabilities geoserveis.icgc.cat/icc_bt25m/wms/service | HTTP 404');

    expect(line).toBe('GetCapabilities returns HTTP 404');
    expect(line).not.toContain('geoserveis');
  });

  it('maps the other transport evidence to a phrase and keeps OGC words', () => {
    expect(shown('GetCapabilities host.example/wms | ConnectException host.example')).toBe('GetCapabilities connection refused');
    expect(shown('GetCapabilities host.example/wms | SocketTimeoutException')).toBe('GetCapabilities timed out');
    expect(shown('GetCapabilities host.example/wms | InterruptedIOException')).toBe('GetCapabilities timed out');
    expect(shown('GetCapabilities host.example/wms | TimeoutException')).toBe('GetCapabilities timed out');
    expect(shown('GetCapabilities host.example/wms | SSLHandshakeException PKIX path building failed')).toBe(
      'GetCapabilities TLS handshake failed',
    );
    expect(shown('GetCapabilities host.example/wms | HTTP 500')).toBe('GetCapabilities returns HTTP 500');
    expect(shown('GetCapabilities host.example/wms | HTTP 200, LayerNotDefined, missing on blocked.example.com')).toBe(
      'GetCapabilities returns HTTP 200, LayerNotDefined, missing on',
    );
  });

  it('keeps None for a blank detail and the request when evidence is empty', () => {
    expect(shown('')).toBe('None');
    expect(shown('   ')).toBe('None');
    expect(shown(null)).toBe('None');
    expect(shown('GetCapabilities geoserveis.icgc.cat/wms | ')).toBe('GetCapabilities');
    expect(shown(' | HTTP 404')).toBe('HTTP 404');
  });

  it('measures availability, percentiles, and status changes', () => {
    expect(availabilityPercent([
      {status: 'up'},
      null,
      {status: 'timeout'},
    ])).toBe(50);
    expect(availabilityPercent([null])).toBeNull();
    expect(elapsedPercentile([10, 30, 20, 40], 50)).toBe(25);
    expect(elapsedPercentile([10, 20, 30, 40], 95)).toBe(39);
    expect(recentAccessChanges([
      {status: 'up'},
      {status: 'timeout'},
      {status: 'up'},
    ])).toEqual([
      {from: 'timeout', to: 'up', index: 2, observers: []},
      {from: 'up', to: 'timeout', index: 1, observers: []},
    ]);
  });

  it('keeps who observed each change', () => {
    expect(recentAccessChanges([
      {status: 'up', observers: ['backend']},
      {status: 'timeout', observers: ['backend', 'proxy']},
      {status: 'up', observer: 'backend'},
    ])).toEqual([
      {from: 'timeout', to: 'up', index: 2, observers: ['backend']},
      {from: 'up', to: 'timeout', index: 1, observers: ['backend', 'proxy']},
    ]);
  });
});

describe('monitoring facts', () => {
  const now = new Date('2026-10-06T13:07:00');

  function hoursWithTail(): Array<{status: string} | null> {
    const hours: Array<{status: string} | null> = Array.from({length: 144}, () => null);
    hours[140] = {status: 'client_error'};
    hours[141] = {status: 'client_error'};
    hours[142] = {status: 'client_error'};
    hours[143] = {status: 'up'};
    return hours;
  }

  const observation = {
    status: 'up',
    observer: 'backend',
    elapsedMs: 109,
    observedAt: '2026-10-06T13:07:00',
  };

  const completed = (...elapsed: number[]) => elapsed.map((elapsedMs) => ({elapsedMs, status: 'up'}));

  it('summarizes the current run, availability, and latency', () => {
    const facts = monitoringFacts(observation, hoursWithTail(), completed(100, 112, 340), now);

    expect(facts).toEqual({
      status: 'up',
      since: bucketStart(143, now, 'tenMinute'),
      observer: 'backend',
      elapsedMs: 109,
      good: 1,
      checked: 4,
      missing: 140,
      availabilityPercent: 25,
      belowTarget: true,
      p50: 112,
      p95: 317,
      timedOut: 0,
    });
  });

  it('keeps the current status across slots with no sample', () => {
    const hours: Array<{status: string} | null> = Array.from({length: 144}, () => null);
    hours[133] = {status: 'up'};
    hours[140] = {status: 'up'};
    hours[142] = {status: 'up'};

    const facts = monitoringFacts(observation, hours, [], now);

    expect(facts?.since).toEqual(bucketStart(133, now, 'tenMinute'));
  });

  it('leaves since empty when the trailing painted status differs', () => {
    const hours: Array<{status: string} | null> = Array.from({length: 144}, () => null);
    hours[10] = {status: 'client_error'};

    const facts = monitoringFacts(observation, hours, completed(100, 112, 340), now);

    expect(facts?.since).toBeNull();
  });

  it('returns null without an observation and leaves percentiles empty without samples', () => {
    expect(monitoringFacts(null, hoursWithTail(), completed(100), now)).toBeNull();

    const facts = monitoringFacts(observation, hoursWithTail(), [], now);

    expect(facts?.p50).toBeNull();
    expect(facts?.p95).toBeNull();
  });

  it('measures latency only over checks that completed and counts the timeouts', () => {
    const samples = [
      {elapsedMs: 500, status: 'up'},
      {elapsedMs: 10008, status: 'timeout'},
      {elapsedMs: 700, status: 'server_error'},
      {elapsedMs: 10004, status: 'timeout'},
    ];

    const facts = monitoringFacts(observation, hoursWithTail(), samples, now);

    expect(facts?.p50).toBe(600);
    expect(facts?.p95).toBe(690);
    expect(facts?.timedOut).toBe(2);
  });

  it('keeps timeouts from inflating the median', () => {
    const samples = [
      {elapsedMs: 700, status: 'up'},
      {elapsedMs: 720, status: 'up'},
      {elapsedMs: 10008, status: 'timeout'},
      {elapsedMs: 10004, status: 'timeout'},
      {elapsedMs: 730, status: 'up'},
    ];

    const facts = monitoringFacts(observation, hoursWithTail(), samples, now);

    expect(facts?.p50).toBe(720);
    expect(facts?.p95).toBe(729);
    expect(facts?.timedOut).toBe(2);
  });

  it('leaves latency empty when every check timed out', () => {
    const samples = [{elapsedMs: 10008, status: 'timeout'}, {elapsedMs: 10004, status: 'timeout'}];

    const facts = monitoringFacts(observation, hoursWithTail(), samples, now);

    expect(facts?.p50).toBeNull();
    expect(facts?.p95).toBeNull();
    expect(facts?.timedOut).toBe(2);
  });
});

describe('usage facts', () => {
  it('summarizes a measured window and the operation error rate', () => {
    const series = Array.from({length: 30}, (_, index) => ({
      index: `day-${index}`,
      value: index < 8 ? index + 1 : 0,
    }));
    const facts = usageFacts({
      measured: true,
      total: 57,
      failed: 11,
      previousTotal: 46,
      previousFailed: 2,
      lastUsedDay: '2026-10-06',
      viewerLoads: 23,
      series,
      operations: [{operation: 'Other', requests: 19, failed: 11}],
    });

    expect(facts).toEqual({
      requests: 57,
      previousRequests: 46,
      deltaPercent: 24,
      failed: 11,
      failedPercent: 19,
      previousFailed: 2,
      lastUsedDay: '2026-10-06',
      daysWithUse: 8,
      periodSlots: 30,
      viewerLoads: 23,
    });
    expect(operationErrorPercent(19, 11)).toBe(58);
    expect(operationErrorPercent(0, 0)).toBeNull();
  });

  it('formats asOf as a local time and hides a missing instant', () => {
    const local = new Date(2026, 9, 6, 13, 0, 0);

    expect(usageAsOfClock(local.toISOString(), 'ca')).toBe('13:00');
    expect(usageAsOfClock(null, 'ca')).toBeNull();
    expect(usageAsOfClock('  ', 'es')).toBeNull();
    expect(usageAsOfClock('not-a-date', 'es')).toBeNull();
  });
});
