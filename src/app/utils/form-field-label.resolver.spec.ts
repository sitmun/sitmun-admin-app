import {FormControl, FormGroup, Validators} from '@angular/forms';

import {TranslateService} from '@ngx-translate/core';

import {
  buildEntityFormAlerts,
  buildRequiredFieldsAlert,
  getInvalidRequiredControlNames,
  resolveFormFieldLabel,
} from './form-field-label.resolver';

describe('form-field-label.resolver', () => {
  const translateService = {
    instant: (key: string) => key,
  } as TranslateService;

  it('resolveFormFieldLabel uses custom key', () => {
    const label = resolveFormFieldLabel(
      'serviceURL',
      'entity.service',
      translateService,
      { serviceURL: 'entity.service.endpoint' }
    );
    expect(label).toBe('entity.service.endpoint');
  });

  it('getInvalidRequiredControlNames skips disabled controls', () => {
    const form = new FormGroup({
      name: new FormControl('', Validators.required),
      hidden: new FormControl('', Validators.required),
    });
    form.get('hidden')?.disable();
    expect(getInvalidRequiredControlNames(form)).toEqual(['name']);
  });

  it('buildRequiredFieldsAlert caps displayed labels and counts remainder', () => {
    const form = new FormGroup({
      a: new FormControl('', Validators.required),
      b: new FormControl('', Validators.required),
      c: new FormControl('', Validators.required),
      d: new FormControl('', Validators.required),
    });
    const alert = buildRequiredFieldsAlert(form, 'entity.test', translateService);
    expect(alert?.kind).toBe('requiredFields');
    if (alert?.kind === 'requiredFields') {
      expect(alert.labels).toHaveLength(3);
      expect(alert.additionalCount).toBe(1);
    }
  });

  it('buildEntityFormAlerts orders required, plain info, then warning keys', () => {
    const form = new FormGroup({
      name: new FormControl('', Validators.required),
    });
    const alerts = buildEntityFormAlerts({
      form,
      entityLabelPrefix: 'entity.test',
      translateService,
      customAlertMessage: 'Tree rule',
      warnings: ['entity.test.warning'],
    });
    expect(alerts[0].kind).toBe('requiredFields');
    expect(alerts[1]).toEqual({ kind: 'plainInfo', message: 'Tree rule' });
    expect(alerts[2]).toEqual({ kind: 'warningKey', key: 'entity.test.warning' });
  });
});
