import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';

import {EntityFormAlertsComponent} from './entity-form-alerts.component';

describe('EntityFormAlertsComponent', () => {
  let fixture: ComponentFixture<EntityFormAlertsComponent>;
  let component: EntityFormAlertsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EntityFormAlertsComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () =>
                of({
                  'common.validation.saveDisabledTitle': 'Cannot save yet',
                  'common.validation.fixRequiredFields': 'Complete:',
                  'entity.test.name': 'Name',
                }),
            }),
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EntityFormAlertsComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      name: new FormControl('', Validators.required),
    });
    component.entityLabelPrefix = 'entity.test';
    fixture.detectChanges();
  });

  it('shows card when required field is invalid', () => {
    expect(component.visible).toBe(true);
    expect(fixture.nativeElement.querySelector('.sitmun-entity-warnings-card')).toBeTruthy();
    expect(component.alerts.some(a => a.kind === 'requiredFields')).toBe(true);
  });

  it('hides card when form becomes valid', () => {
    component.form.get('name')?.setValue('ok');
    fixture.detectChanges();
    expect(component.visible).toBe(false);
    expect(fixture.nativeElement.querySelector('.sitmun-entity-warnings-card')).toBeFalsy();
  });

  it('includes custom alert message and backend warnings', () => {
    component.form.get('name')?.setValue('ok');
    component.customAlertMessage = 'Tree rule';
    component.warnings = ['entity.test.warning'];
    component.ngOnChanges({
      customAlertMessage: {
        currentValue: 'Tree rule',
        previousValue: null,
        firstChange: false,
        isFirstChange: () => false,
      },
      warnings: {
        currentValue: ['entity.test.warning'],
        previousValue: null,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    fixture.detectChanges();
    expect(component.visible).toBe(true);
    expect(component.alerts.some(a => a.kind === 'plainInfo')).toBe(true);
    expect(component.alerts.some(a => a.kind === 'warningKey')).toBe(true);
  });
});
