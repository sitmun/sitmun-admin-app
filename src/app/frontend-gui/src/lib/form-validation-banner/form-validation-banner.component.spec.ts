import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, UntypedFormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {TranslateModule, TranslateService} from '@ngx-translate/core';

import {FormValidationBannerComponent} from './form-validation-banner.component';
import {MaterialModule} from '../material-module';

describe('FormValidationBannerComponent', () => {
  let component: FormValidationBannerComponent;
  let fixture: ComponentFixture<FormValidationBannerComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormValidationBannerComponent],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        TranslateModule.forRoot()
      ],
      providers: [TranslateService]
    }).compileComponents();

    fixture = TestBed.createComponent(FormValidationBannerComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display when form is valid', () => {
    const form = new UntypedFormGroup({
      name: new FormControl('test', [Validators.required])
    });
    component.form = form;
    component.entityType = 'tree';
    fixture.detectChanges();

    expect(component.isVisible).toBe(false);
    const banner = fixture.nativeElement.querySelector('.form-validation-banner');
    expect(banner).toBeNull();
  });

  it('should display when form has invalid required fields', () => {
    const form = new UntypedFormGroup({
      name: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required])
    });
    component.form = form;
    component.entityType = 'tree';
    fixture.detectChanges();

    expect(component.isVisible).toBe(true);
    const banner = fixture.nativeElement.querySelector('.form-validation-banner');
    expect(banner).not.toBeNull();
  });

  it('should list up to 3 field labels', () => {
    const form = new UntypedFormGroup({
      field1: new FormControl('', [Validators.required]),
      field2: new FormControl('', [Validators.required]),
      field3: new FormControl('', [Validators.required])
    });
    component.form = form;
    component.entityType = 'test';
    fixture.detectChanges();

    expect(component.invalidFieldLabels.length).toBe(3);
    expect(component.additionalFieldsCount).toBe(0);
  });

  it('should show "+ X more" when more than 3 fields are invalid', () => {
    const form = new UntypedFormGroup({
      field1: new FormControl('', [Validators.required]),
      field2: new FormControl('', [Validators.required]),
      field3: new FormControl('', [Validators.required]),
      field4: new FormControl('', [Validators.required]),
      field5: new FormControl('', [Validators.required])
    });
    component.form = form;
    component.entityType = 'test';
    fixture.detectChanges();

    expect(component.invalidFieldLabels.length).toBe(3);
    expect(component.additionalFieldsCount).toBe(2);
  });

  it('should have accessibility attributes', () => {
    const form = new UntypedFormGroup({
      name: new FormControl('', [Validators.required])
    });
    component.form = form;
    component.entityType = 'tree';
    fixture.detectChanges();

    const banner = fixture.nativeElement.querySelector('.form-validation-banner');
    expect(banner.getAttribute('role')).toBe('alert');
    expect(banner.getAttribute('aria-live')).toBe('polite');
  });

  it('should resolve labels using entity-specific translation first', () => {
    spyOn(translateService, 'instant').and.callFake((key: string) => {
      if (key === 'tree.name') return 'Tree Name';
      return key;
    });

    const form = new UntypedFormGroup({
      name: new FormControl('', [Validators.required])
    });
    component.form = form;
    component.entityType = 'tree';
    fixture.detectChanges();

    expect(component.invalidFieldLabels[0]).toBe('Tree Name');
  });

  it('should fallback to common.form translation', () => {
    spyOn(translateService, 'instant').and.callFake((key: string) => {
      if (key === 'common.form.name') return 'Name';
      return key;
    });

    const form = new UntypedFormGroup({
      name: new FormControl('', [Validators.required])
    });
    component.form = form;
    component.entityType = 'unknown';
    fixture.detectChanges();

    expect(component.invalidFieldLabels[0]).toBe('Name');
  });

  it('should hide when form becomes valid', () => {
    const form = new UntypedFormGroup({
      name: new FormControl('', [Validators.required])
    });
    component.form = form;
    component.entityType = 'tree';
    fixture.detectChanges();

    expect(component.isVisible).toBe(true);

    form.get('name')?.setValue('test');
    fixture.detectChanges();

    expect(component.isVisible).toBe(false);
  });
});

