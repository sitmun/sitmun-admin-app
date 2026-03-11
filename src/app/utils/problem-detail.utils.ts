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

const MAX_FIELD_ERRORS = 5;

/**
 * Formats field-level validation errors from a Problem Detail response into
 * a bullet list string. Tries to resolve each error's messageCode via an
 * optional translate function before falling back to the raw message.
 *
 * @param error The HTTP error response (expects error.error.errors array)
 * @param translateFn Optional function that receives a messageCode and returns
 *   the translated string, or the code itself if no translation is found.
 * @returns Formatted bullet list string joined by '\n', or null if no errors
 */
export function formatValidationErrors(
  error: any,
  translateFn?: (code: string) => string
): string | null {
  const errors = error?.error?.errors;
  if (!Array.isArray(errors) || errors.length === 0) {
    return null;
  }

  const lines = errors.slice(0, MAX_FIELD_ERRORS).map((e: any) => {
    const message = resolveFieldMessage(e, translateFn);
    if (!message) {
      return null;
    }
    return e.field ? `\u2022 ${e.field}: ${message}` : `\u2022 ${message}`;
  }).filter((line: string | null): line is string => line !== null);

  if (lines.length === 0) {
    return null;
  }

  return lines.join('\n');
}

/**
 * Returns the number of extra validation errors beyond the displayed limit.
 * Useful for appending a translated "+ N more" suffix.
 *
 * @param error The HTTP error response
 * @returns Number of extra errors, or 0 if within the limit
 */
export function getExtraValidationErrorCount(error: any): number {
  const errors = error?.error?.errors;
  if (!Array.isArray(errors)) {
    return 0;
  }
  return Math.max(0, errors.length - MAX_FIELD_ERRORS);
}

/**
 * Resolves the display message for a single field error.
 * Prefers a translated messageCode over the raw backend message.
 */
function resolveFieldMessage(
  fieldError: any,
  translateFn?: (code: string) => string
): string | null {
  if (translateFn && fieldError.messageCode) {
    const key = `validation.${fieldError.messageCode}`;
    const translated = translateFn(key);
    if (translated !== key) {
      return translated;
    }
  }
  return fieldError.message || null;
}

