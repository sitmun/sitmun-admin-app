import { FormControl, ValidatorFn } from '@angular/forms';

import { CharacterCountPipe } from './character-count.pipe';

describe('CharacterCountPipe', () => {
  const pipe = new CharacterCountPipe();

  const stringAssumingValidator: ValidatorFn = (control) => {
    const raw = control.value as string;
    raw.split(',');
    return null;
  };

  it('does not throw when probing maxLength beside a string-assuming custom validator', () => {
    const control = new FormControl('layer-a', [stringAssumingValidator]);
    expect(() => pipe.transform(control)).not.toThrow();
    expect(pipe.transform(control)).toBe('7');
  });

  it('returns explicit maxLength without probing validators', () => {
    const control = new FormControl('layer-a', [stringAssumingValidator]);
    expect(() => pipe.transform(control, 500)).not.toThrow();
    expect(pipe.transform(control, 500)).toBe('7/500');
  });
});
