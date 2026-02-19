/**
 * Utility functions for handling RFC 9457 Problem Detail error responses
 */

/**
 * Extracts the problem type slug from a problem detail URI
 *
 * @param error The HTTP error response
 * @returns The problem type slug (e.g., "unauthorized") or null if not found
 *
 * @example
 * extractProblemType(error) // error.error.type = "https://sitmun.org/problems/unauthorized"
 * // Returns: "unauthorized"
 */
export function extractProblemType(error: any): string | null {
  const problemType = error?.error?.type;
  
  if (!problemType || typeof problemType !== 'string') {
    return null;
  }
  
  // Extract last segment from URI: https://sitmun.org/problems/unauthorized → unauthorized
  const match = problemType.match(/\/problems\/([a-z-]+)$/);
  return match ? match[1] : null;
}

/**
 * Gets the i18n translation key for a problem detail error
 *
 * @param error The HTTP error response
 * @returns The translation key (e.g., "backend.error.unauthorized")
 *
 * @example
 * getProblemTranslationKey(error)
 * // Returns: "backend.error.unauthorized"
 */
export function getProblemTranslationKey(error: any): string {
  const problemType = extractProblemType(error);
  if (!problemType) {
    return 'common.error.generic';
  }
  
  // Provide specific translation for 409 Conflict (duplicate key)
  // 422 constraint errors are handled by MessagesInterceptor with more context
  if (problemType === 'data-integrity-violation' && error.status === 409) {
    return 'backend.error.data-integrity-violation.conflict';
  }
  
  return `backend.error.${problemType}`;
}

/**
 * Checks if an error response is in RFC 9457 Problem Detail format
 *
 * @param error The HTTP error response
 * @returns true if the error is a Problem Detail, false otherwise
 *
 * @example
 * if (isProblemDetail(error)) {
 *   const key = getProblemTranslationKey(error);
 *   const message = translate.instant(key);
 * }
 */
export function isProblemDetail(error: any): boolean {
  return error?.error?.type?.includes('/problems/') === true;
}

/**
 * Gets a human-readable error message from a problem detail or falls back to legacy format
 *
 * @param error The HTTP error response
 * @returns The error message to display
 *
 * @example
 * const message = getErrorMessage(error);
 * snackBar.open(message, 'Close');
 */
export function getErrorMessage(error: any): string {
  if (isProblemDetail(error)) {
    // RFC 9457 format
    return error.error.detail || error.error.title || 'An error occurred';
  } else {
    // Legacy format
    return error.error?.message || error.message || 'An error occurred';
  }
}

