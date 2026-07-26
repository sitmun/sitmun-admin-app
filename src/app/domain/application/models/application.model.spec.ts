import {constants} from '@environments/constants';

import {Application, ApplicationProjection} from './application.model';

describe('Application model', () => {
  it('fromObject retains responsibleInstitutionName', () => {
    const app = Application.fromObject({
      type: constants.codeValue.applicationType.internalApp,
      name: 'App',
      responsibleInstitutionName: "Servei d'Informació Geogràfica",
    });
    expect(app.responsibleInstitutionName).toBe("Servei d'Informació Geogràfica");
  });

  it('every type whitelist includes responsibleInstitutionName and warnings', () => {
    for (const whitelist of [
      Application.allProperties,
      Application.internalApp,
      Application.externalApp,
      Application.touristicApp,
    ]) {
      expect(whitelist).toContain('responsibleInstitutionName');
      expect(whitelist).toContain('warnings');
    }
  });

  it('fromObject retains warnings for list hydration', () => {
    const app = Application.fromObject({
      type: constants.codeValue.applicationType.externalApp,
      warnings: ['entity.application.warning.invalid-point-of-contact'],
    });
    expect(app.warnings).toEqual(['entity.application.warning.invalid-point-of-contact']);
  });
});

describe('ApplicationProjection model', () => {
  it('fromObject retains responsibleInstitutionName', () => {
    const projection = ApplicationProjection.fromObject({
      name: 'App',
      responsibleInstitutionName: 'Institution',
    });
    expect(projection.responsibleInstitutionName).toBe('Institution');
  });

  it('fromObject retains warnings', () => {
    const projection = ApplicationProjection.fromObject({
      warnings: ['entity.application.warning.point-of-contact-email-missing'],
    });
    expect(projection.warnings).toEqual([
      'entity.application.warning.point-of-contact-email-missing',
    ]);
  });
});
