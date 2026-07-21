import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of, firstValueFrom } from 'rxjs';

import { FormToolbarComponent } from '@app/components/shared/form-toolbar/form-toolbar.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';
import {
  ApplicationService,
  CodeListService,
  RoleService,
  TerritoryService,
  TranslationService,
  UserConfigurationService,
  UserPositionService,
  UserService
} from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { LoggerService } from '@app/services/logger.service';
import { configureLoggerForTests, provideErrorHandlerForTests } from '@app/testing/test-helpers';

import { UserFormComponent } from './user-form.component';

function typePassword(component: UserFormComponent, value: string): void {
  component.onPasswordFocus();
  component.entityForm.get('newPassword')!.setValue(value);
  component.onPasswordChange();
  component.onPasswordBlur();
}

function refocusBlur(component: UserFormComponent): void {
  component.onPasswordFocus();
  component.onPasswordBlur();
}

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let applicationService: ApplicationService;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [UserFormComponent, FormToolbarComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([], {}),
        SitmunFrontendGuiModule,
        MaterialModule,
        MatIconTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideErrorHandlerForTests(),
        UserService,
        UserConfigurationService,
        UserPositionService,
        RoleService,
        TerritoryService,
        ApplicationService,
        CodeListService,
        TranslationService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    applicationService = TestBed.inject(ApplicationService);
    component.entityToEdit = component.empty();
    component.postFetchData();
    fixture.detectChanges();
  });

  afterEach(() => fixture?.destroy());
  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('password session (#260)', () => {
    it('keeps typed password on create after refocus/blur', () => {
      const typed = 'secret-create-260';
      typePassword(component, typed);
      refocusBlur(component);

      expect(component.createObject().password).toBe(typed);
    });

    it('omits password on edit when focus/blur leaves persisted password unchanged', () => {
      component.entityID = 42;
      component.entityToEdit = Object.assign(component.empty(), {
        id: 42,
        username: 'alice',
        passwordSet: true,
      });
      component.postFetchData();

      component.onPasswordFocus();
      component.onPasswordBlur();

      expect(component.createObject(42).password).toBeUndefined();
    });

    it('keeps pending password change on edit after refocus/blur', () => {
      component.entityID = 42;
      component.entityToEdit = Object.assign(component.empty(), {
        id: 42,
        username: 'alice',
        passwordSet: true,
      });
      component.postFetchData();

      const typed = 'secret-edit-260';
      typePassword(component, typed);
      refocusBlur(component);

      expect(component.createObject(42).password).toBe(typed);
    });
  });

  describe('Grid capability classification', () => {
    it('userConfigurationsTable should have picker, updater, and status capabilities (dual-target)', () => {
      const table = component['userConfigurationsTable'];
      expect(table.hasPickerAdd()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.hasTemplateDialogs()).toBe(false);
    });

    it('userPositionsTable should have picker, updater, and status capabilities', () => {
      const table = component['userPositionsTable'];
      expect(table.hasPickerAdd()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.hasTemplateDialogs()).toBe(false);
    });

    it('applicationsAsContactTable should be read-only display grid with no edit capabilities', () => {
      const table = component['applicationsAsContactTable'];
      expect(table.hasPickerAdd()).toBe(false);
      expect(table.hasRelationsUpdater()).toBe(false);
      expect(table.hasStatusColumn()).toBe(false);
      expect(table.hasTemplateDialogs()).toBe(false);
      expect(table.supportsDuplicate()).toBe(false);
    });
  });

  describe('userPositionsTable column types', () => {
    it('territoryName links to territory form via territoryId', () => {
      const columns = component['userPositionsTable'].relationsColumnsDefs;
      const col = columns.find((c: any) => c.field === 'territoryName');
      expect(col?.cellRenderer).toBe('routerLinkRenderer');
      expect(col?.cellRendererParams?.paramFields).toEqual({ id: 'territoryId' });
    });
  });

  describe('applicationsAsContactTable fetcher', () => {
    it('returns empty when not in edition mode', async () => {
      jest.spyOn(component, 'isEdition').mockReturnValue(false);
      const apps = await firstValueFrom(component['applicationsAsContactTable'].relationsFetchFn());
      expect(apps).toEqual([]);
    });

    it('returns cached applications without a second findByCreatorId call', async () => {
      component.entityID = 99;
      component.entityToEdit = Object.assign(component.empty(), { id: 99, username: 'alice' });
      component.isBuiltInAdmin = false;
      component.isBuiltInPublic = false;
      jest.spyOn(component, 'isEdition').mockReturnValue(true);
      const expected = [{ id: 1, name: 'App A' }];
      component.applicationsAsPointOfContact = expected as any;
      const findSpy = jest.spyOn(applicationService, 'findByCreatorId');

      const apps = await firstValueFrom(component['applicationsAsContactTable'].relationsFetchFn());

      expect(findSpy).not.toHaveBeenCalled();
      expect(apps).toEqual(expected);
    });
  });

  describe('canShowApplicationsAsPointOfContact', () => {
    it('shows tab for existing normal user', () => {
      component.entityID = 5;
      component.isBuiltInAdmin = false;
      component.isBuiltInPublic = false;
      expect(component.canShowApplicationsAsPointOfContact()).toBe(true);
    });

    it('shows tab for non-built-in administrator', () => {
      component.entityID = 5;
      component.isBuiltInAdmin = false;
      component.isBuiltInPublic = false;
      component.entityToEdit = Object.assign(component.empty(), {
        username: 'ops-admin',
        administrator: true,
      });
      expect(component.canShowApplicationsAsPointOfContact()).toBe(true);
    });

    it('hides tab for built-in public and admin', () => {
      component.entityID = 5;
      component.isBuiltInPublic = true;
      component.isBuiltInAdmin = false;
      expect(component.canShowApplicationsAsPointOfContact()).toBe(false);

      component.isBuiltInPublic = false;
      component.isBuiltInAdmin = true;
      expect(component.canShowApplicationsAsPointOfContact()).toBe(false);
    });

    it('hides tab for new unsaved user', () => {
      component.entityID = -1;
      component.isBuiltInAdmin = false;
      component.isBuiltInPublic = false;
      expect(component.canShowApplicationsAsPointOfContact()).toBe(false);
    });

    it('fetcher skips findByCreatorId for built-in accounts', async () => {
      component.entityID = 1;
      component.isBuiltInAdmin = true;
      component.isBuiltInPublic = false;
      const findSpy = jest.spyOn(applicationService, 'findByCreatorId');
      const apps = await firstValueFrom(component['applicationsAsContactTable'].relationsFetchFn());
      expect(apps).toEqual([]);
      expect(findSpy).not.toHaveBeenCalled();
    });
  });

  describe('point of contact impact warnings', () => {
    let translateInstant: jest.SpyInstance;

    beforeEach(() => {
      component.entityID = 10;
      component.entityToEdit = Object.assign(component.empty(), {
        id: 10,
        username: 'alice',
        email: 'alice@example.com',
        blocked: false,
      });
      component.postFetchData();
      component.applicationsAsPointOfContact = [{ id: 1 }, { id: 2 }] as any;
      translateInstant = jest
        .spyOn(component['translateService'], 'instant')
        .mockImplementation((key: string, params?: { count?: number }) =>
          `${key}:${params?.count ?? ''}`
        );
    });

    it('warns when assigned user is blocked with application count', () => {
      component.entityForm.patchValue({ blocked: true });
      const message = component.getPointOfContactImpactMessage();
      expect(translateInstant).toHaveBeenCalledWith(
        'entity.user.warning.point-of-contact-blocked-impact',
        { count: 2 }
      );
      expect(message).toContain('2');
    });

    it('warns when assigned user email is cleared with application count', () => {
      component.entityForm.patchValue({ email: '', blocked: false });
      const message = component.getPointOfContactImpactMessage();
      expect(translateInstant).toHaveBeenCalledWith(
        'entity.user.warning.point-of-contact-email-missing-impact',
        { count: 2 }
      );
      expect(message).toContain('2');
    });

    it('does not warn for emailed eligible user or user with no apps', () => {
      component.entityForm.patchValue({ email: 'alice@example.com', blocked: false });
      expect(component.getPointOfContactImpactMessage()).toBeNull();

      component.applicationsAsPointOfContact = [];
      component.entityForm.patchValue({ blocked: true });
      expect(component.getPointOfContactImpactMessage()).toBeNull();
    });

    it('fetchRelatedData caches apps for normal users and skips built-ins', async () => {
      const expected = [{ id: 3, name: 'App' }];
      const findSpy = jest
        .spyOn(applicationService, 'findByCreatorId')
        .mockReturnValue(of(expected as any));

      component.entityToEdit = Object.assign(component.empty(), { username: 'alice' });
      component.entityID = 10;
      await component.fetchRelatedData();
      expect(findSpy).toHaveBeenCalledWith(10);
      expect(component.applicationsAsPointOfContact).toEqual(expected);

      findSpy.mockClear();
      component.entityToEdit = Object.assign(component.empty(), { username: 'admin' });
      await component.fetchRelatedData();
      expect(findSpy).not.toHaveBeenCalled();
      expect(component.applicationsAsPointOfContact).toEqual([]);
    });
  });
});
