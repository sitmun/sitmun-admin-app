import { UntypedFormGroup } from "@angular/forms";
import { Constructor } from "./common";

/**
 * Interface defining the contract for form change detection functionality.
 */
interface DetectchangeMixin {
  subscribeToFormChanges(form: UntypedFormGroup): void
  resetToFormModifiedState(form: UntypedFormGroup): void
}

/**
 * A mixin that adds form change detection capabilities to a class.
 * This mixin tracks modifications in form fields and provides visual feedback for modified fields.
 *
 * @template TBase - The type of the base class to extend
 * @param {TBase} Base - The base class to extend
 * @returns A new class that extends the base class with form change detection functionality
 *
 * @example
 * ```typescript
 * class YourComponent extends detectchangeMixin(BaseClass) {
 *   form: UntypedFormGroup;
 *
 *   ngOnInit() {
 *     this.form = new UntypedFormGroup({...});
 *     this.subscribeToFormChanges(this.form);
 *   }
 *
 *   onReset() {
 *     this.resetToFormModifiedState(this.form);
 *   }
 * }
 * ```
 */
export function detectchangeMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements DetectchangeMixin {
    /** Stores the initial values of form controls for comparison */
    private initialFormValues: { [key: string]: any } = {};

    /**
     * Initializes form change detection by storing initial values and setting up change subscriptions.
     * Adds visual indicators when form fields are modified.
     *
     * @param {UntypedFormGroup} form - The Angular form group to monitor for changes
     */
    public subscribeToFormChanges(form: UntypedFormGroup) {
      // Store initial form values after data is loaded
      for (const key in form.controls) {
        this.initialFormValues[key] = form.get(key).value
      }

      // Subscribe to form changes
      Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        if (control) {
          control.valueChanges.subscribe(() => {
            this.checkControlModified(form, key);
          });
        }
      });
    }

    /**
     * Checks if a form control's current value differs from its initial value.
     * Handles both primitive values and arrays.
     *
     * @param {UntypedFormGroup} form - The form group containing the control
     * @param {string} controlName - The name of the control to check
     * @returns {boolean} True if the control value has been modified, false otherwise
     * @private
     */
    private isControlModified(form: UntypedFormGroup, controlName: string): boolean {
      const control = form.get(controlName);
      if (!control) return false;

      const currentValue = control.value;
      const initialValue = this.initialFormValues[controlName];

      // Handle arrays (like supportedSRS)
      if (Array.isArray(currentValue) && Array.isArray(initialValue)) {
        return JSON.stringify(currentValue) !== JSON.stringify(initialValue);
      }

      return currentValue !== initialValue;
    }

    /**
     * Updates the visual state of a form control to indicate modification.
     * Adds or removes the 'input-modified' class based on whether the field has been modified.
     * Works with both Material form fields and regular form controls.
     *
     * @param {UntypedFormGroup} form - The form group containing the control
     * @param {string} controlName - The name of the control to update
     * @private
     */
    private checkControlModified(form, controlName: string): void {
      const isModified = this.isControlModified(form, controlName);
      let element = document.querySelector(`[formControlName="${controlName}"]`)?.closest('mat-form-field');
      if (!element) {
        element = document.querySelector(`[formControlName="${controlName}"]`);
      }

      if (element) {
        if (isModified) {
          element.classList.add('input-modified');
        } else {
          element.classList.remove('input-modified');
        }
      }
    }

    /**
     * Resets the form's modification tracking state.
     * Updates the stored initial values to the current form values and removes all modification indicators.
     *
     * @param {UntypedFormGroup} form - The form group to reset
     */
    public resetToFormModifiedState(form): void {
      // Update initial form values to reset modified state
      this.initialFormValues = form.getRawValue();

      // Remove modified styling from all form fields
      Object.keys(form.controls).forEach(key => {
        const element = document.querySelector(`[formControlName="${key}"]`)?.closest('mat-form-field');
        if (element) {
          element.classList.remove('input-modified');
        }
      });
    }

  }
}
