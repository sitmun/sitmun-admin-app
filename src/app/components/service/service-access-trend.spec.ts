import {accessHourTooltip, accessStatusLabel, accessTrendSlots, bucketStart, mergeBackendObservation, renderAccessTrend} from './service-access-trend';

describe('service access trend', () => {
  it('paints the buckets it is given with the oldest hour on the left', () => {
    const strip = renderAccessTrend([
      {status: 'timeout', statusRank: 70},
      null,
      {status: 'server_error', statusRank: 50},
      {status: 'up', statusRank: 0},
      {status: 'auth_failed', statusRank: 40},
      {status: 'maintenance', statusRank: 55},
      {status: 'reached', statusRank: 10},
    ]);
    const cells = Array.from(strip.querySelectorAll('.service-access-hour')) as HTMLElement[];

    const colors = cells.map((cell) => cell.style.backgroundColor);
    expect(colors).toHaveLength(24);
    expect(colors.slice(0, 7)).toEqual([
      'rgb(198, 40, 40)',
      'rgb(196, 196, 196)',
      'rgb(198, 40, 40)',
      'rgb(46, 125, 50)',
      'rgb(198, 40, 40)',
      'rgb(198, 40, 40)',
      'rgb(46, 125, 50)',
    ]);
    expect(colors.slice(7).every((color) => color === 'rgb(196, 196, 196)')).toBe(true);
  });

  it('leaves a proxy sample grey and keeps the backend sample with the higher rank', () => {
    const slots = accessTrendSlots([
      {status: 'server_error', statusRank: 50, observer: 'proxy'},
      {status: 'up', statusRank: 0, observer: 'backend'},
    ]);
    const kept = mergeBackendObservation(slots, {
      status: 'timeout',
      statusRank: 70,
      observer: 'proxy',
    });
    const painted = mergeBackendObservation(kept, {
      status: 'auth_failed',
      statusRank: 40,
      observer: 'backend',
    });
    const worseKept = mergeBackendObservation(painted, {
      status: 'up',
      statusRank: 0,
      observer: 'backend',
    });

    const colors = (hours: Array<{status?: string | null} | null>) =>
      Array.from(renderAccessTrend(hours).querySelectorAll('.service-access-hour')).map((cell) => (cell as HTMLElement).style.backgroundColor);

    expect(colors(slots)[0]).toBe('rgb(198, 40, 40)');
    expect(colors(slots)[1]).toBe('rgb(46, 125, 50)');
    expect(colors(kept)[23]).toBe('rgb(196, 196, 196)');
    expect(colors(painted)[23]).toBe('rgb(198, 40, 40)');
    expect(colors(worseKept)[23]).toBe('rgb(198, 40, 40)');
  });

  it('renders twenty four grey hours when the service has no summary', () => {
    const cells = Array.from(renderAccessTrend(undefined).querySelectorAll('.service-access-hour')) as HTMLElement[];

    expect(cells).toHaveLength(24);
    expect(cells.every((cell) => cell.style.backgroundColor === 'rgb(196, 196, 196)')).toBe(true);
  });

  it('formats a UTC instant in Europe/Madrid and keeps a zoneless clock', () => {
    const observedAt = '2026-10-05T21:14:00Z';
    const hours = Array.from({length: 24}, () => null);
    hours[23] = {status: 'client_error', statusRank: 30};
    const strip = renderAccessTrend(hours, (key) => {
      if (key === 'entity.service.access.status.client_error') {
        return 'Request error';
      }
      return key;
    }, new Date(observedAt), 'Europe/Madrid');
    const cells = Array.from(strip.querySelectorAll('.service-access-hour')) as HTMLElement[];

    expect(cells[23].title).toBe('23:00 · Request error');
  });

  it('uses a translated status and otherwise shows the code', () => {
    expect(accessStatusLabel('up', () => 'Operativo')).toBe('Operativo');
    expect(accessStatusLabel('maintenance', (key) => key)).toBe('maintenance');
    expect(accessStatusLabel('', () => 'Operativo')).toBe('');
  });

  it('explains each hour in its own tooltip', () => {
    const now = new Date(2026, 9, 5, 21, 15, 0);
    const lookup = (key: string) => {
      if (key === 'entity.service.access.status.client_error') {
        return 'Request error';
      }
      if (key === 'entity.service.access.noSample') {
        return 'No sample';
      }
      return key;
    };
    const hours = Array.from({length: 24}, () => null);
    hours[0] = {status: 'maintenance', statusRank: 55};
    hours[23] = {status: 'client_error', statusRank: 30};
    const strip = renderAccessTrend(hours, lookup, now);
    const cells = Array.from(strip.querySelectorAll('.service-access-hour')) as HTMLElement[];

    expect(strip.getAttribute('title')).toBeNull();
    expect(cells[23].title).toBe('21:00 · Request error');
    expect(cells[16].title).toBe('14:00 · No sample');
    expect(cells[0].title).toBe('22:00 · maintenance');
  });

  it('splits the last 24 hours into 144 local 10-minute cells', () => {
    const now = new Date(2026, 9, 5, 23, 17, 0);
    const lookup = (key: string) => {
      if (key === 'entity.service.access.status.up') {
        return 'Up';
      }
      if (key === 'entity.service.access.noSample') {
        return 'No sample';
      }
      return key;
    };
    const buckets = Array.from({length: 144}, () => null);
    buckets[143] = {status: 'up', statusRank: 0, observer: 'backend'};
    buckets[142] = {status: 'timeout', statusRank: 70, observer: 'proxy'};
    const strip = renderAccessTrend(buckets, lookup, now, undefined, 'tenMinute');
    const cells = Array.from(strip.querySelectorAll('.service-access-hour')) as HTMLElement[];

    expect(cells).toHaveLength(144);
    expect(cells[143].style.backgroundColor).toBe('rgb(46, 125, 50)');
    expect(cells[142].style.backgroundColor).toBe('rgb(198, 40, 40)');
    expect(cells[143].title).toBe('23:10 · Up · backend');
    expect(cells[142].title).toBe('23:00 · timeout · proxy');
  });

  it('starts the current 10-minute bucket on the tooltip clock', () => {
    const now = new Date(2026, 9, 5, 23, 17, 0);
    const tooltip = accessHourTooltip(null, 143, (key) => key, now, undefined, 'tenMinute');
    const start = bucketStart(143, now, 'tenMinute');
    const parts = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(start);
    const clock = `${parts.find((part) => part.type === 'hour')?.value}:${parts.find((part) => part.type === 'minute')?.value}`;

    expect(tooltip.slice(0, 5)).toBe('23:10');
    expect(clock).toBe(tooltip.slice(0, 5));
    expect(bucketStart(0, now, 'tenMinute').getTime()).toBe(start.getTime() - 1430 * 60 * 1000);
  });
});
