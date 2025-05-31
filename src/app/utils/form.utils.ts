import { UntypedFormGroup } from '@angular/forms';

/**
 * Provides detailed explanation of form validity status.
 * Examines each control's validation status and error messages.
 * 
 * @param form - The form group to analyze
 * @returns A string with detailed validation information
 */
export function explainFormValidity(form: UntypedFormGroup): string {
  if (!form) {
    return 'Form is not initialized';
  }

  let explanation = `Form valid: ${form.valid}\n`;
  explanation += 'Field validation details:\n';

  // Check each control in the form
  Object.keys(form.controls).forEach(key => {
    const control = form.get(key);
    explanation += `- ${key}: ${control.valid ? 'Valid' : 'Invalid'}`;

    if (!control.valid) {
      explanation += ', Errors: ';
      if (control.errors) {
        Object.keys(control.errors).forEach(errorKey => {
          explanation += `${errorKey}`;

          // Add details for specific validation errors
          if (errorKey === 'required') {
            explanation += ' (Field is required)';
          } else if (errorKey === 'maxlength') {
            explanation += ` (Max length: ${control.errors.maxlength.requiredLength}, Current length: ${control.errors.maxlength.actualLength})`;
          }
          explanation += ', ';
        });
      }

      // Show the current value if it might help debugging
      explanation += `Current value: "${control.value}"`;
    }

    explanation += '\n';
  });

  // Explain form pristine state
  explanation += `Form pristine: ${form.pristine}\n`;
  explanation += `Form touched: ${form.touched}\n`;

  return explanation;
} 