import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

/**
 * A pipe that displays the current character count and optional maximum length for form controls.
 *
 * This pipe can be used to show character count information in the format "current/max" or just "current"
 * if no maximum length is specified. It works with both single values and arrays (where it counts the total
 * length of the joined array values).
 *
 * The maximum length can be provided either:
 * 1. Directly as a parameter to the pipe
 * 2. Through a maxLength validator on the form control
 *
 * @example
 * <!-- With explicit max length -->
 * <span>{{ formControl | characterCount:50 }}</span>
 *
 * <!-- Using maxLength from form validator -->
 * <span>{{ formControl | characterCount }}</span>
 */
@Pipe({
  name: 'characterCount',
  pure: false
})
export class CharacterCountPipe implements PipeTransform {
  /**
   * Transforms a form control into a character count display string.
   *
   * @param control - The form control to count characters from
   * @param maxLength - Optional maximum length. If not provided, attempts to get from control's validators
   * @returns A string in the format "current/max" or "current" if no max length is available
   */
  transform(control: AbstractControl | null, maxLength?: number): string {
    if (!control) {
      return '0/0';
    }

    let currentLength: number;
    if (Array.isArray(control.value)) {
      currentLength = control.value.join().length;
    } else {
      currentLength = control.value?.length || 0;
    }
    let maxLengthValue = maxLength;

    if (!maxLengthValue && this.hasMaxLengthValidator(control)) {
      maxLengthValue = this.getMaxLengthFromValidator(control);
    }

    return maxLengthValue ? `${currentLength}/${maxLengthValue}` : `${currentLength}`;
  }

  /**
   * Checks if the control has a maxLength validator.
   *
   * @param control - The form control to check
   * @returns True if the control has a maxLength validator, false otherwise
   * @private
   */
  private hasMaxLengthValidator(control: AbstractControl): boolean {
    const validator = control.validator;

    if (validator === null) {
      return false;
    }

    const errors = validator(new FormControl({ length: Infinity })) ?? {};
    return "maxlength" in errors;
  }

  /**
   * Extracts the maximum length value from a control's validator.
   *
   * @param control - The form control to extract the max length from
   * @param fallback - Optional fallback value if no maxLength validator is found
   * @returns The maximum length value from the validator or the fallback value
   * @private
   */
  private getMaxLengthFromValidator(control: AbstractControl, fallback?: number): number | undefined {
    const validatorFn = control.validator;

    if (validatorFn === null) {
      return fallback;
    }

    const errors = validatorFn(new FormControl({ length: Infinity }));
    return errors?.["maxlength"]["requiredLength"] ?? fallback;
  }
}
