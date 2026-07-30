/**
 * Null-safe localeCompare for admin list/form sorts.
 */
export function compareNullableString(
  a: string | null | undefined,
  b: string | null | undefined,
  locales?: string | string[],
  options?: Intl.CollatorOptions,
): number {
  return (a ?? '').localeCompare(b ?? '', locales, options);
}
