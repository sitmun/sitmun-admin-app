import {Component, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {UntypedFormGroup, AbstractControl} from '@angular/forms';

import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

/**
 * Component that displays a Material-compliant banner when a form has invalid
 * required fields, preventing the save action. Shows up to 3 field labels with
 * a "+ X more" indicator if additional fields are invalid.
 */
@Component({
    selector: 'app-form-validation-banner',
    templateUrl: './form-validation-banner.component.html',
    styleUrls: ['./form-validation-banner.component.scss'],
    standalone: false
})
export class FormValidationBannerComponent implements OnChanges, OnDestroy {
  /** The form group to validate */
  @Input() form: UntypedFormGroup;

  /** Entity type for label resolution (e.g., 'tree', 'service') */
  @Input() entityType: string;

  /** Optional map of form control name → i18n key for labels (e.g. { uiId: 'entity.task.basic.ui' }) */
  @Input() fieldLabelKeys: Record<string, string> | undefined;

  /** Array of invalid required field labels to display */
  invalidFieldLabels: string[] = [];

  /** Number of additional invalid fields beyond the displayed ones */
  additionalFieldsCount = 0;

  /** Whether the banner should be visible */
  isVisible = false;

  private readonly MAX_DISPLAYED_FIELDS = 3;
  private formStatusSubscription?: Subscription;

  constructor(private translateService: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form']) {
      if (this.formStatusSubscription) {
        this.formStatusSubscription.unsubscribe();
      }
      if (this.form) {
        this.formStatusSubscription = this.form.statusChanges.subscribe(() => {
          this.updateInvalidFields();
        });
      }
    }
    if (changes['form'] || changes['entityType'] || changes['fieldLabelKeys']) {
      this.updateInvalidFields();
    }
  }

  ngOnDestroy(): void {
    if (this.formStatusSubscription) {
      this.formStatusSubscription.unsubscribe();
    }
  }

  /**
   * Updates the list of invalid required fields and their labels.
   */
  private updateInvalidFields(): void {
    this.invalidFieldLabels = [];
    this.additionalFieldsCount = 0;
    this.isVisible = false;

    if (!this.form || !this.entityType) {
      return;
    }

    const invalidFields: string[] = [];
    const formControls = this.form.controls;

    for (const controlName in formControls) {
      if (Object.prototype.hasOwnProperty.call(formControls, controlName)) {
        const control: AbstractControl = formControls[controlName];
        if (control.enabled && control.invalid && control.hasError('required')) {
          invalidFields.push(controlName);
        }
      }
    }

    if (invalidFields.length === 0) {
      this.isVisible = false;
      return;
    }

    this.isVisible = true;
    const displayedFields = invalidFields.slice(0, this.MAX_DISPLAYED_FIELDS);
    this.invalidFieldLabels = displayedFields.map(fieldName =>
      this.resolveFieldLabel(fieldName)
    );
    this.additionalFieldsCount = Math.max(0, invalidFields.length - this.MAX_DISPLAYED_FIELDS);
  }

  /**
   * Resolves the human-readable label for a field name using i18n.
   * Uses fieldLabelKeys if provided, then entityType.fieldName, then common.form.fieldName, then raw name.
   *
   * @param fieldName - The form control name
   * @returns The translated label or the field name if no translation found
   */
  private resolveFieldLabel(fieldName: string): string {
    const customKey = this.fieldLabelKeys?.[fieldName];
    if (customKey) {
      const label = this.translateService.instant(customKey);
      if (label !== customKey) {
        return label;
      }
    }

    const entityKey = `${this.entityType}.${fieldName}`;
    let label = this.translateService.instant(entityKey);
    if (label !== entityKey) {
      return label;
    }

    const commonKey = `common.form.${fieldName}`;
    label = this.translateService.instant(commonKey);
    if (label !== commonKey) {
      return label;
    }

    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  }
}

