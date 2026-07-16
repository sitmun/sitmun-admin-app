/**
 * Returns a safe http(s) URL string, or null when the value is not a navigable HTTP URL.
 */
export function toSafeHttpUrl(value: string | null | undefined): string | null {
  if (value == null || typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    return trimmed;
  } catch {
    return null;
  }
}
