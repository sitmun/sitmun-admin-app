import {
  extractProblemType,
  getProblemTranslationKey,
  isProblemDetail,
  getErrorMessage,
  formatValidationErrors,
  getExtraValidationErrorCount
} from './problem-detail.utils';

function makeError(body: any, status = 400) {
  return { error: body, status };
}

describe('extractProblemType', () => {
  it('should extract slug from a valid problem type URI', () => {
    const error = makeError({ type: 'https://sitmun.org/problems/unauthorized' });
    expect(extractProblemType(error)).toBe('unauthorized');
  });

  it('should return null when type is missing', () => {
    expect(extractProblemType(makeError({}))).toBeNull();
    expect(extractProblemType(makeError(null))).toBeNull();
    expect(extractProblemType(null)).toBeNull();
  });

  it('should return null for non-problem URIs', () => {
    expect(extractProblemType(makeError({ type: 'https://example.com/foo' }))).toBeNull();
  });
});

describe('getProblemTranslationKey', () => {
  it('should return backend.error.<slug> for standard problem types', () => {
    const error = makeError({ type: 'https://sitmun.org/problems/validation-error' });
    expect(getProblemTranslationKey(error)).toBe('backend.error.validation-error');
  });

  it('should return conflict key for 409 data-integrity-violation', () => {
    const error = makeError(
      { type: 'https://sitmun.org/problems/data-integrity-violation' },
      409
    );
    expect(getProblemTranslationKey(error)).toBe('backend.error.data-integrity-violation.conflict');
  });

  it('should return generic key when type is missing', () => {
    expect(getProblemTranslationKey(makeError({}))).toBe('common.error.generic');
  });
});

describe('isProblemDetail', () => {
  it('should return true for problem detail responses', () => {
    expect(isProblemDetail(makeError({ type: 'https://sitmun.org/problems/unauthorized' }))).toBe(true);
  });

  it('should return false for non-problem responses', () => {
    expect(isProblemDetail(makeError({ message: 'some error' }))).toBe(false);
    expect(isProblemDetail(null)).toBe(false);
  });
});

describe('getErrorMessage', () => {
  it('should return detail from problem detail', () => {
    const error = makeError({
      type: 'https://sitmun.org/problems/validation-error',
      detail: 'Validation failed',
      title: 'Error'
    });
    expect(getErrorMessage(error)).toBe('Validation failed');
  });

  it('should fall back to title when detail is missing', () => {
    const error = makeError({
      type: 'https://sitmun.org/problems/validation-error',
      title: 'Error'
    });
    expect(getErrorMessage(error)).toBe('Error');
  });

  it('should return legacy message for non-problem errors', () => {
    const error = makeError({ message: 'Legacy error' });
    expect(getErrorMessage(error)).toBe('Legacy error');
  });

  it('should return default when nothing is available', () => {
    expect(getErrorMessage(makeError(null))).toBe('An error occurred');
  });
});

describe('formatValidationErrors', () => {
  it('should return null when error is null', () => {
    expect(formatValidationErrors(null)).toBeNull();
  });

  it('should return null when error.error is missing', () => {
    expect(formatValidationErrors({})).toBeNull();
  });

  it('should return null when errors is not an array', () => {
    expect(formatValidationErrors(makeError({ errors: 'not array' }))).toBeNull();
  });

  it('should return null when errors is empty', () => {
    expect(formatValidationErrors(makeError({ errors: [] }))).toBeNull();
  });

  it('should format a single error with field and message', () => {
    const error = makeError({
      errors: [{ field: 'extent', message: 'maxY must be greater than minY' }]
    });
    expect(formatValidationErrors(error)).toBe('\u2022 extent: maxY must be greater than minY');
  });

  it('should format an error with only message (no field)', () => {
    const error = makeError({
      errors: [{ message: 'Something went wrong' }]
    });
    expect(formatValidationErrors(error)).toBe('\u2022 Something went wrong');
  });

  it('should skip items with no message', () => {
    const error = makeError({
      errors: [{ field: 'name' }, { field: 'code', message: 'required' }]
    });
    expect(formatValidationErrors(error)).toBe('\u2022 code: required');
  });

  it('should format multiple errors joined by newlines', () => {
    const error = makeError({
      errors: [
        { field: 'name', message: 'must not be blank' },
        { field: 'code', message: 'must not be blank' }
      ]
    });
    expect(formatValidationErrors(error)).toBe(
      '\u2022 name: must not be blank\n\u2022 code: must not be blank'
    );
  });

  it('should cap at 5 errors', () => {
    const errors = Array.from({ length: 7 }, (_, i) => ({
      field: `field${i}`,
      message: `error ${i}`
    }));
    const error = makeError({ errors });
    const result = formatValidationErrors(error)!;
    const lines = result.split('\n');
    expect(lines).toHaveLength(5);
  });

  it('should use translateFn with messageCode when available', () => {
    const error = makeError({
      errors: [{ field: 'name', message: 'must not be blank', messageCode: 'NotBlank' }]
    });
    const translateFn = (key: string) =>
      key === 'validation.NotBlank' ? 'No pot estar en blanc' : key;

    expect(formatValidationErrors(error, translateFn)).toBe(
      '\u2022 name: No pot estar en blanc'
    );
  });

  it('should fall back to message when translateFn returns the key', () => {
    const error = makeError({
      errors: [{ field: 'extent', message: 'maxY must be greater than minY', messageCode: 'BoundingBox' }]
    });
    const translateFn = (key: string) => key;

    expect(formatValidationErrors(error, translateFn)).toBe(
      '\u2022 extent: maxY must be greater than minY'
    );
  });

  it('should fall back to message when messageCode is absent', () => {
    const error = makeError({
      errors: [{ field: 'extent', message: 'maxY must be greater than minY' }]
    });
    const translateFn = (_key: string) => 'Translated';

    expect(formatValidationErrors(error, translateFn)).toBe(
      '\u2022 extent: maxY must be greater than minY'
    );
  });
});

describe('getExtraValidationErrorCount', () => {
  it('should return 0 when errors is not an array', () => {
    expect(getExtraValidationErrorCount(null)).toBe(0);
    expect(getExtraValidationErrorCount(makeError({}))).toBe(0);
  });

  it('should return 0 when errors has 5 or fewer items', () => {
    const errors = Array.from({ length: 5 }, (_, i) => ({ field: `f${i}`, message: `m${i}` }));
    expect(getExtraValidationErrorCount(makeError({ errors }))).toBe(0);
  });

  it('should return extra count beyond 5', () => {
    const errors = Array.from({ length: 8 }, (_, i) => ({ field: `f${i}`, message: `m${i}` }));
    expect(getExtraValidationErrorCount(makeError({ errors }))).toBe(3);
  });
});
