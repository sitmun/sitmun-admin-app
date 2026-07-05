import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, RouterModule } from '@angular/router';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';

import {FormToolbarComponent} from '@app/components/shared/form-toolbar/form-toolbar.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {CodeListService, Connection, ConnectionService, TaskService, TranslationService} from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import {LoggerService} from '@app/services/logger.service';
import {NotificationService} from '@app/services/notification.service';
import {configureLoggerForTests, provideErrorHandlerForTests} from '@app/testing/test-helpers';

import { ConnectionFormComponent } from './connection-form.component';

describe('ConnectionFormComponent', () => {
  let component: ConnectionFormComponent;
  let fixture: ComponentFixture<ConnectionFormComponent>;
  let httpMock: HttpTestingController;
  let notificationService: NotificationService;
  let _consoleErrorSpy: jest.SpyInstance;

  const PASSWORD_PLACEHOLDER = '••••••••';

  const flushCodeListRequests = (): void => {
    httpMock.match((req) => req.url.includes('codelist-values')).forEach((req) =>
      req.flush({ _embedded: { 'codelist-values': [] } })
    );
  };

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [ ConnectionFormComponent, FormToolbarComponent ],
      imports : [FormsModule, ReactiveFormsModule, SitmunFrontendGuiModule, MatIconTestingModule, MaterialModule, RouterModule, BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideErrorHandlerForTests(),
        ConnectionService,
        TaskService,
        CodeListService,
        TranslationService,
        ResourceService,
        ExternalService,
        NotificationService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    })
    .compileComponents();
  });

  beforeEach(async () => {
    _consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ConnectionFormComponent);
    component = fixture.componentInstance;
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    notificationService = TestBed.inject(NotificationService);
    if (!component.entityForm) {
      component.entityToEdit = component.empty();
      component.postFetchData();
    }
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    flushCodeListRequests();
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
    fixture?.destroy();
  });
  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form valid when required fields are set', () => {
    component.entityForm.patchValue({
      name:'testName',
      user: 'user',
      newPassword: 'password',
      url: 'url',
      driver: 'org.h2.Driver'
    })
    expect(component.entityForm.valid).toBeTruthy();
  });

  it('canSave respects form validity', () => {
    expect(component.canSave()).toBe(false);
    component.entityForm.patchValue({
      name:'testName',
      url: 'jdbc:h2:mem:test',
      driver: 'org.h2.Driver'
    });
    expect(component.canSave()).toBe(true);
  });

  describe('password field edit session', () => {
    const setupConnectionWithExistingPassword = (): void => {
      component.entityID = 2;
      component.entityToEdit = Object.assign(component.empty(), {
        id: 2,
        name: 'Connection 2',
        driver: 'org.h2.Driver',
        url: 'jdbc:h2:mem:test',
        user: 'sa',
        passwordSet: true,
      });
      component.postFetchData();
      flushCodeListRequests();
    };

    it('initializes with placeholder when passwordSet is true', () => {
      setupConnectionWithExistingPassword();
      expect(component.passwordSet).toBe(true);
      expect(component.entityForm.get('newPassword').value).toBe(PASSWORD_PLACEHOLDER);
      expect(component.isPasswordBeingEdited).toBe(false);
    });

    it('initializes empty password for new connection even when entity carries passwordSet', () => {
      component.entityID = -1;
      component.duplicateID = -1;
      component.entityToEdit = Object.assign(component.empty(), { passwordSet: true });
      component.postFetchData();
      flushCodeListRequests();

      expect(component.passwordSet).toBe(false);
      expect(component.entityForm.get('newPassword').value).toBe('');
    });

    it('does not send password on save after focus and blur without editing', () => {
      setupConnectionWithExistingPassword();
      component.onPasswordFocus();
      component.onPasswordBlur();

      const connection = component.createObject(2);
      expect(component.isPasswordBeingEdited).toBe(false);
      expect(connection.password).toBeUndefined();
    });

    it('includes typed password on save after edit', () => {
      setupConnectionWithExistingPassword();
      component.onPasswordFocus();
      component.entityForm.get('newPassword').setValue('newSecret1');
      component.onPasswordChange();

      const connection = component.createObject(2);
      expect(connection.password).toBe('newSecret1');
    });
  });

  describe('connection validation', () => {
    const setupSavedConnection = (): void => {
      component.entityID = 2;
      component.entityToEdit = Object.assign(new Connection(), {
        id: 2,
        name: 'Connection 2',
        driver: 'org.h2.Driver',
        url: 'jdbc:h2:mem:test',
        user: 'sa',
        passwordSet: true,
      });
      component.postFetchData();
      flushCodeListRequests();
    };

    it('enables validate for unchanged saved connection', () => {
      setupSavedConnection();
      expect(component.canValidateConnection()).toBe(true);
    });

    it('uses GET stored test for unchanged saved connection', () => {
      setupSavedConnection();
      jest.spyOn(notificationService, 'showSuccess');

      component.validateConnection();

      const req = httpMock.expectOne((request) => request.url.includes('/connections/2/test') && request.method === 'GET');
      req.flush({ isValid: true });
      expect(notificationService.showSuccess).toHaveBeenCalled();
    });

    it('disables validate when driver changed without password edit', () => {
      setupSavedConnection();
      component.entityForm.get('url')?.setValue('jdbc:h2:mem:changed');
      component.entityForm.markAsDirty();

      expect(component.canValidateConnection()).toBe(false);
    });

    it('POSTs edited password instead of placeholder', () => {
      setupSavedConnection();
      component.onPasswordFocus();
      component.entityForm.get('newPassword')?.setValue('edited-password');
      component.onPasswordChange();

      component.validateConnection();

      const req = httpMock.expectOne((request) => request.url.includes('/connections/test') && request.method === 'POST');
      expect(req.request.body.password).toBe('edited-password');
      req.flush({ isValid: true });
    });
  });

  describe('tasks table routing', () => {
    it('links tasks by type-aware route', () => {
      const nameColumn = component.tasksTable.relationsColumnsDefs.find(
        (col: { cellRendererParams?: { route?: string } }) => col.cellRendererParams?.route != null
      ) as { cellRendererParams: { route: string } };
      expect(nameColumn.cellRendererParams.route).toBe('/tasks/:id/:typeId');
    });
  });

  describe('Grid capability classification', () => {
    it('tasksTable should be read-only display grid with no edit capabilities', () => {
      const table = component['tasksTable'];
      expect(table.hasPickerAdd()).toBe(false);
      expect(table.hasRelationsUpdater()).toBe(false);
      expect(table.hasStatusColumn()).toBe(false);
      expect(table.hasTemplateDialogs()).toBe(false);
      expect(table.supportsDuplicate()).toBe(false);
    });
  });
});
