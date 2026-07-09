import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';

import {BaseFormComponent} from '@app/components/base-form.component';
import {Resource} from '@app/core';
import {MessagesInterceptorStateService} from '@app/core/interceptors/messages.interceptor';
import {CodeListService, TranslationService} from '@app/domain';
import {DIALOG_EVENTS, DialogMessageComponent} from '@app/frontend-gui/src/lib/public_api';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {configureLoggerForTests, provideErrorHandlerForTests} from '@app/testing/test-helpers';

@Component({ template: '', standalone: false })
class TestFormComponent extends BaseFormComponent<Resource> {
  constructor(
    dialog: MatDialog,
    translateService: TranslateService,
    translationService: TranslationService,
    codeListService: CodeListService,
    loggerService: LoggerService,
    errorHandler: ErrorHandlerService,
    activatedRoute: ActivatedRoute,
    router: Router,
    loadingService: LoadingOverlayService,
    messagesInterceptorState: MessagesInterceptorStateService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router, loadingService, messagesInterceptorState);
    this.entityForm = new UntypedFormGroup({
      name: new UntypedFormControl('', Validators.required),
    });
  }

  override empty(): Resource {
    return {} as Resource;
  }
}

describe('BaseFormComponent canDeactivate', () => {
  let component: TestFormComponent;
  let dialogOpenSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestFormComponent],
      providers: [
        provideErrorHandlerForTests(),
        {
          provide: TranslateService,
          useValue: { instant: (key: string) => key },
        },
        {
          provide: TranslationService,
          useValue: {},
        },
        {
          provide: CodeListService,
          useValue: {},
        },
        {
          provide: ActivatedRoute,
          useValue: { params: of({}) },
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: LoadingOverlayService,
          useValue: { wrap: (_label: string, fn: () => Promise<unknown>) => fn() },
        },
        {
          provide: MessagesInterceptorStateService,
          useValue: { isEnabled: () => true, enable: jest.fn(), disable: jest.fn() },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestFormComponent);
    component = fixture.componentInstance;
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    dialogOpenSpy = jest.spyOn(TestBed.inject(MatDialog), 'open').mockReturnValue({
      afterClosed: () => of({ event: DIALOG_EVENTS.CANCEL }),
    } as MatDialogRef<DialogMessageComponent>);
  });

  it('allows navigation when pristine', async () => {
    await expect(component.canDeactivate()).resolves.toBe(true);
    expect(dialogOpenSpy).not.toHaveBeenCalled();
  });

  it('blocks navigation when dirty and user keeps editing', async () => {
    component.entityForm.markAsDirty();
    await expect(component.canDeactivate()).resolves.toBe(false);
    expect(dialogOpenSpy).toHaveBeenCalled();
  });

  it('allows navigation when dirty and user discards changes', async () => {
    dialogOpenSpy.mockReturnValue({
      afterClosed: () => of({ event: DIALOG_EVENTS.ACCEPT }),
    } as MatDialogRef<DialogMessageComponent>);
    component.entityForm.markAsDirty();
    await expect(component.canDeactivate()).resolves.toBe(true);
  });
});
