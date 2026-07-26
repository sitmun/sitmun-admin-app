import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, Resource, ResourceService } from '@app/core/hal';
import { MessagesInterceptorStateService } from '@app/core/interceptors/messages.interceptor';
import { CodeListService, TranslationService } from '@app/domain';
import { LoadingOverlayService } from '@app/services/loading-overlay.service';
import { LoggerService } from '@app/services/logger.service';
import { configureLoggerForTests, provideErrorHandlerForTests } from '@app/testing/test-helpers';

import { BaseFormComponent } from './base-form.component';

class StubResource extends Resource {}

@Component({
  template: '',
  standalone: false,
})
class BaseFormStubComponent extends BaseFormComponent<StubResource> {
  override postFetchData(): void {
    this.entityForm = new UntypedFormGroup({
      name: new FormControl('', Validators.required),
    });
  }
}

describe('BaseFormComponent (duplicate save #384)', () => {
  let component: BaseFormStubComponent;
  let fixture: ComponentFixture<BaseFormStubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseFormStubComponent],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({}),
            }),
          },
        }),
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideErrorHandlerForTests(),
        TranslationService,
        CodeListService,
        ResourceService,
        ExternalService,
        LoggerService,
        LoadingOverlayService,
        MessagesInterceptorStateService,
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseFormStubComponent);
    component = fixture.componentInstance;
    configureLoggerForTests(TestBed.inject(LoggerService));
    component.postFetchData();
  });

  function setValidPristineForm(): void {
    component.entityForm.patchValue({ name: 'Example' });
    component.entityForm.markAsPristine();
  }

  it('enables save and pending changes for a valid pristine duplicate', () => {
    component.entityID = -1;
    component.duplicateID = 42;
    setValidPristineForm();

    expect(component.canSaveEntity).toBe(true);
    expect((component as any).hasPendingChanges()).toBe(true);
  });

  it('keeps save disabled for an invalid duplicate but still reports pending changes', () => {
    component.entityID = -1;
    component.duplicateID = 42;
    component.entityForm.patchValue({ name: '' });
    component.entityForm.markAsPristine();

    expect(component.canSaveEntity).toBe(false);
    expect((component as any).hasPendingChanges()).toBe(true);
  });

  it('keeps save disabled and no pending changes for a valid pristine edit', () => {
    component.entityID = 7;
    component.duplicateID = -1;
    setValidPristineForm();

    expect(component.canSaveEntity).toBe(false);
    expect((component as any).hasPendingChanges()).toBe(false);
  });

  it('enables save for a valid dirty new form', () => {
    component.entityID = -1;
    component.duplicateID = -1;
    component.entityForm.patchValue({ name: 'Example' });
    component.entityForm.markAsDirty();

    expect(component.canSaveEntity).toBe(true);
  });
});
