const DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/;

export function previewFeatureInfoFormat(
  format: string | null | undefined,
  fractionDigits: number | null | undefined,
  padFractionDigits: boolean | null | undefined,
  dateStyle: string | null | undefined,
  locale: string
): string {
  if (format === 'N') {
    return formatNumber(1234.5, locale, fractionDigits, padFractionDigits, false);
  }
  if (format === 'P') {
    return formatNumber(0.156, locale, fractionDigits, padFractionDigits, true);
  }
  if (format === 'F') {
    return formatDate('2024-01-02T15:04:05', locale, dateStyle);
  }
  return '';
}

function fractionCount(digits: number | null | undefined): number {
  if (typeof digits === 'number' && Number.isInteger(digits) && digits >= 0) {
    return digits;
  }
  return 7;
}

function formatNumber(
  value: number,
  locale: string,
  digits: number | null | undefined,
  pad: boolean | null | undefined,
  percent: boolean
): string {
  const count = fractionCount(digits);
  const options: Intl.NumberFormatOptions = {
    maximumFractionDigits: count,
    useGrouping: true
  };
  if (pad === true) {
    options.minimumFractionDigits = count;
  }
  if (percent) {
    options.style = 'percent';
  }
  return new Intl.NumberFormat(locale, options).format(value);
}

function formatDate(value: string, locale: string, dateStyle: string | null | undefined): string {
  const match = DATE_TIME.exec(value);
  if (!match) {
    return value;
  }
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
    Number(match[6])
  );
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
  if (dateStyle !== 'date') {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
    options.hour12 = false;
  }
  return new Intl.DateTimeFormat(locale, options).format(date);
}
