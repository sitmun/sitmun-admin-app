import {AbstractControl, ValidationErrors} from '@angular/forms';

/** Form error key; use with {@link optionalHttpOrHttpsUrlValidator}. */
export const OPTIONAL_HTTP_OR_HTTPS_URL_ERROR = 'optionalHttpUrl';

/**
 * Same semantics as backend {@code @Http}: empty or whitespace is valid; otherwise the value
 * must parse as an absolute URL with protocol {@code http} or {@code https}.
 */
export function optionalHttpOrHttpsUrlValidator(
  control: AbstractControl
): ValidationErrors | null {
  const raw = control.value;
  if (raw == null) {
    return null;
  }
  if (typeof raw !== 'string') {
    return {[OPTIONAL_HTTP_OR_HTTPS_URL_ERROR]: true};
  }
  const v = raw.trim();
  if (v === '') {
    return null;
  }
  try {
    const parsed = new URL(v);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {[OPTIONAL_HTTP_OR_HTTPS_URL_ERROR]: true};
    }
    return null;
  } catch {
    return {[OPTIONAL_HTTP_OR_HTTPS_URL_ERROR]: true};
  }
}
