import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Pipe({
  name: 'characterCount',
  pure: false
})
export class CharacterCountPipe implements PipeTransform {
  transform(control: AbstractControl | null, maxLength?: number): string {
    if (!control) {
      return '0/0';
    }
    
    const currentLength = control.value?.length || 0;
    let maxLengthValue = maxLength;
    
    if (!maxLengthValue && this.hasMaxLengthValidator(control)) {
      maxLengthValue = this.getMaxLengthFromValidator(control);
    }
    
    return maxLengthValue ? `${currentLength}/${maxLengthValue}` : `${currentLength}`;
  }
  
  private hasMaxLengthValidator(control: AbstractControl): boolean {
    const validator = control.validator;

    if (validator === null) {
      return false;
    }

    const errors = validator(new FormControl({ length: Infinity })) ?? {};
    return "maxlength" in errors;
  }

  private getMaxLengthFromValidator(control: AbstractControl, fallback?: number): number | undefined {
    const validatorFn = control.validator;

    if (validatorFn === null) {
      return fallback;
    }

    const errors = validatorFn(new FormControl({ length: Infinity }));
    return errors?.["maxlength"]["requiredLength"] ?? fallback;
  }
} 