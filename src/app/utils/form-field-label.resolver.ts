import {AbstractControl, UntypedFormGroup} from '@angular/forms';

import {TranslateService} from '@ngx-translate/core';

export const MAX_DISPLAYED_REQUIRED_FIELDS = 3;

export type RequiredFieldsEntityFormAlert = {
  kind: 'requiredFields';
  labels: string[];
  additionalCount: number;
};

/** Classified alert row for entity form alerts panel. */
export type EntityFormAlert =
  | RequiredFieldsEntityFormAlert
  | { kind: 'warningKey'; key: string }
  | { kind: 'infoKey'; key: string }
  | { kind: 'plainInfo'; message: string };

/**
 * Resolves human-readable labels for form controls (same chain as legacy form-validation-banner).
 */
export function resolveFormFieldLabel(
  fieldName: string,
  entityLabelPrefix: string,
  translateService: TranslateService,
  fieldLabelKeys?: Record<string, string>
): string {
  const customKey = fieldLabelKeys?.[fieldName];
  if (customKey) {
    const label = translateService.instant(customKey);
    if (label !== customKey) {
      return label;
    }
  }

  const entityKey = `${entityLabelPrefix}.${fieldName}`;
  let label = translateService.instant(entityKey);
  if (label !== entityKey) {
    return label;
  }

  const commonKey = `common.form.${fieldName}`;
  label = translateService.instant(commonKey);
  if (label !== commonKey) {
    return label;
  }

  return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
}

/** Enabled controls invalid with `required` error. */
export function getInvalidRequiredControlNames(form: UntypedFormGroup | null | undefined): string[] {
  if (!form) {
    return [];
  }

  const invalidFields: string[] = [];
  const formControls = form.controls;

  for (const controlName in formControls) {
    if (Object.prototype.hasOwnProperty.call(formControls, controlName)) {
      const control: AbstractControl = formControls[controlName];
      if (control.enabled && control.invalid && control.hasError('required')) {
        invalidFields.push(controlName);
      }
    }
  }

  return invalidFields;
}

export function buildRequiredFieldsAlert(
  form: UntypedFormGroup | null | undefined,
  entityLabelPrefix: string | undefined,
  translateService: TranslateService,
  fieldLabelKeys?: Record<string, string>
): EntityFormAlert | null {
  if (!form || !entityLabelPrefix) {
    return null;
  }

  const invalidFields = getInvalidRequiredControlNames(form);
  if (invalidFields.length === 0) {
    return null;
  }

  const displayed = invalidFields.slice(0, MAX_DISPLAYED_REQUIRED_FIELDS);
  const labels = displayed.map(name =>
    resolveFormFieldLabel(name, entityLabelPrefix, translateService, fieldLabelKeys)
  );
  const additionalCount = Math.max(0, invalidFields.length - MAX_DISPLAYED_REQUIRED_FIELDS);

  return { kind: 'requiredFields', labels, additionalCount };
}

export function buildEntityFormAlerts(options: {
  form?: UntypedFormGroup | null;
  entityLabelPrefix?: string;
  fieldLabelKeys?: Record<string, string>;
  translateService: TranslateService;
  warnings?: string[] | null;
  infoMessageKeys?: readonly string[];
  customAlertMessage?: string | null;
}): EntityFormAlert[] {
  const alerts: EntityFormAlert[] = [];

  const required = buildRequiredFieldsAlert(
    options.form,
    options.entityLabelPrefix,
    options.translateService,
    options.fieldLabelKeys
  );
  if (required) {
    alerts.push(required);
  }

  if (options.customAlertMessage?.trim()) {
    alerts.push({ kind: 'plainInfo', message: options.customAlertMessage.trim() });
  }

  const warningKeys = options.warnings ?? [];
  const infoKeys = new Set(options.infoMessageKeys ?? []);

  for (const key of warningKeys) {
    if (!key) {
      continue;
    }
    if (infoKeys.has(key)) {
      alerts.push({ kind: 'infoKey', key });
    } else {
      alerts.push({ kind: 'warningKey', key });
    }
  }

  return alerts;
}

export function hasEntityFormAlerts(alerts: EntityFormAlert[] | null | undefined): boolean {
  return (alerts?.length ?? 0) > 0;
}
