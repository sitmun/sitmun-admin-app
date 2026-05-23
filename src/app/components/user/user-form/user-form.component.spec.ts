import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';

import {EntityFormAlertsComponent} from '@app/components/shared/entity-form-alerts/entity-form-alerts.component';
import {FormToolbarComponent} from '@app/components/shared/form-toolbar/form-toolbar.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {
  ApplicationService, CodeListService, RoleService, TerritoryService, TranslationService,
  UserConfigurationService, UserPositionService, UserService
} from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import {LoggerService} from '@app/services/logger.service';
import {configureLoggerForTests, provideErrorHandlerForTests} from '@app/testing/test-helpers';

import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let roleService: RoleService;
  let userService: UserService;
  let territoryService: TerritoryService;
  let codeListService: CodeListService;
  let userPositionService: UserPositionService;
  let userConfigurationService: UserConfigurationService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFormComponent, FormToolbarComponent ],
      imports: [FormsModule, ReactiveFormsModule, SitmunFrontendGuiModule, EntityFormAlertsComponent, RouterModule.forRoot([], {}), MaterialModule, MatIconTestingModule, BrowserAnimationsModule,
         TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })],
      providers: [provideErrorHandlerForTests(), UserService, RoleService, TerritoryService, UserPositionService,
        CodeListService, UserConfigurationService, TranslationService, ResourceService, ExternalService,
        ApplicationService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    // Suppress debug logs in tests to reduce console noise
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    roleService= TestBed.inject(RoleService);
    userService= TestBed.inject(UserService);
    territoryService= TestBed.inject(TerritoryService);
    codeListService= TestBed.inject(CodeListService);
    userPositionService= TestBed.inject(UserPositionService);
    userConfigurationService= TestBed.inject(UserConfigurationService);
    translationService= TestBed.inject(TranslationService);
    resourceService= TestBed.inject(ResourceService);
    externalService= TestBed.inject(ExternalService);
    // Initialize form before detectChanges to prevent afterFetch from failing
    // This prevents ngOnInit -> fetchData -> afterFetch from calling subscribeToFormChanges with null
    component.entityToEdit = component.empty();
    component.postFetchData();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should instantiate roleService', () => {
    expect(roleService).toBeTruthy();
  });

  it('should instantiate userService', () => {
    expect(userService).toBeTruthy();
  });

  it('should instantiate territoryService', () => {
    expect(territoryService).toBeTruthy();
  });

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
  });

  it('should instantiate userPositionService', () => {
    expect(userPositionService).toBeTruthy();
  });

  it('should instantiate userConfigurationService', () => {
    expect(userConfigurationService).toBeTruthy();
  });

  it('should instantiate translationService', () => {
    expect(translationService).toBeTruthy();
  });

  it('should instantiate resourceService', () => {
    expect(resourceService).toBeTruthy();
  });

  it('should instantiate externalService', () => {
    expect(externalService).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form invalid when mid-empty', () => {
    component.entityForm.patchValue({
      firstName: 'Name',
      lastName: 'lastname',
      passwordSet: true,
      password: false,
      confirmPassword: false,
      administrator: true,
      blocked: true,
    })
    //Miss name
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form valid', () => {
    component.entityForm.patchValue({
      username: 'username',
      firstName: 'Name',
      lastName: 'lastname',
      passwordSet: true,
      password: false,
      confirmPassword: false,
      administrator: true,
      blocked: true,
    })
    expect(component.entityForm.valid).toBeTruthy();
  });

  it('User form fields', () => {
    expect(component.entityForm.get('username')).toBeTruthy();
    expect(component.entityForm.get('firstName')).toBeTruthy();
    expect(component.entityForm.get('lastName')).toBeTruthy();
    expect(component.entityForm.get('newPassword')).toBeTruthy();
    expect(component.entityForm.get('administrator')).toBeTruthy();
    expect(component.entityForm.get('blocked')).toBeTruthy();
  });

  it('username has maxLength validator', () => {
    const control = component.entityForm.get('username');
    control.setValue('a'.repeat(51));
    expect(control.hasError('maxlength')).toBeTruthy();
    control.setValue('a'.repeat(50));
    expect(control.hasError('maxlength')).toBeFalsy();
  });

  it('email has maxLength validator', () => {
    const control = component.entityForm.get('email');
    control.setValue('a'.repeat(51));
    expect(control.hasError('maxlength')).toBeTruthy();
  });

  it('itemName returns username value', () => {
    component.entityForm.patchValue({ username: 'testuser' });
    expect(component.itemName('username')).toBe('testuser');
  });

  it('roles table column defs include role and territory', () => {
    const table = (component as any).userConfigurationsTable;
    const colFields = table.relationsColumnsDefs.map((c: any) => c.field);
    expect(colFields).toContain('role');
    expect(colFields).toContain('territory');
  });

  it('positions table column defs include territoryName, name, and email', () => {
    const table = (component as any).userPositionsTable;
    const colFields = table.relationsColumnsDefs.map((c: any) => c.field);
    expect(colFields).toContain('territoryName');
    expect(colFields).toContain('name');
    expect(colFields).toContain('email');
  });

  describe('warning tab indicators and resolve hint', () => {
    it('hasUserWarnings is false when warnings are empty', () => {
      component.entityToEdit.warnings = [];
      component.isBuiltInAdmin = false;
      component.isBuiltInPublic = false;
      expect(component.hasUserWarnings()).toBe(false);
    });

    it('hasUserWarnings is true for built-in public user', () => {
      component.entityToEdit.warnings = [];
      component.isBuiltInPublic = true;
      expect(component.hasUserWarnings()).toBe(true);
      expect(component.getUserDisplayWarnings()).toContain('entity.user.builtInPublicWarning');
      expect(component.useInfoWarningsCardStyle()).toBe(true);
    });

    it('useInfoWarningsCardStyle is false when backend warnings are present', () => {
      component.entityToEdit.warnings = ['entity.user.warning.no-password'];
      component.isBuiltInAdmin = true;
      expect(component.useInfoWarningsCardStyle()).toBe(false);
      expect(component.getBuiltInInfoWarningKeys()).toEqual(['entity.user.builtInAdminWarning']);
    });

    it('rolesTabHasWarning when no-roles warning is present', () => {
      component.entityToEdit.warnings = ['entity.user.warning.no-roles'];
      expect(component.rolesTabHasWarning()).toBe(true);
      expect(component.positionsTabHasWarning()).toBe(false);
    });

    it('rolesTabHasWarning is false for built-in admin', () => {
      component.isBuiltInAdmin = true;
      component.entityToEdit.warnings = ['entity.user.warning.role-without-position'];
      expect(component.rolesTabHasWarning()).toBe(false);
    });

    it('positionsTabHasWarning when position-without-details warning is present', () => {
      component.entityToEdit.warnings = ['entity.user.warning.position-without-details'];
      expect(component.positionsTabHasWarning()).toBe(true);
    });

    it('role-without-position flags both tabs', () => {
      component.entityToEdit.warnings = ['entity.user.warning.role-without-position'];
      expect(component.rolesTabHasWarning()).toBe(true);
      expect(component.positionsTabHasWarning()).toBe(true);
    });

    it('positionsTabHasWarning is false for built-in users', () => {
      component.isBuiltInPublic = true;
      component.entityToEdit.warnings = ['entity.user.warning.position-without-details'];
      expect(component.positionsTabHasWarning()).toBe(false);
    });

    it('hasRequiredFieldAlerts when username is empty', () => {
      component.entityForm.get('username')?.setValue('');
      expect(component.hasRequiredFieldAlerts()).toBe(true);
      expect(component.detailsTabHasRequiredAlert()).toBe(true);
    });

    it('does not render toolbar form-validation-banner', () => {
      component.dataLoaded = true;
      component.entityForm.get('username')?.setValue('');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-form-validation-banner')).toBeFalsy();
      expect(fixture.nativeElement.querySelector('app-entity-form-alerts')).toBeTruthy();
    });
  });

  describe('password field edit session', () => {
    const PASSWORD_PLACEHOLDER = '••••••••';

    const setupUserWithExistingPassword = (): void => {
      component.entityToEdit = Object.assign(component.empty(), {
        id: 42,
        username: 'existing',
        passwordSet: true,
      });
      component.postFetchData();
    };

    it('initializes with placeholder when passwordSet is true', () => {
      setupUserWithExistingPassword();
      expect(component.passwordSet).toBe(true);
      expect(component.entityForm.get('newPassword').value).toBe(PASSWORD_PLACEHOLDER);
      expect(component.isPasswordBeingEdited).toBe(false);
    });

    it('clears placeholder on focus', () => {
      setupUserWithExistingPassword();
      component.onPasswordFocus();
      expect(component.entityForm.get('newPassword').value).toBe('');
    });

    it('restores placeholder and pristine state on blur when unchanged', () => {
      setupUserWithExistingPassword();
      const control = component.entityForm.get('newPassword');
      component.onPasswordFocus();
      component.onPasswordBlur();

      expect(control.value).toBe(PASSWORD_PLACEHOLDER);
      expect(component.isPasswordBeingEdited).toBe(false);
      expect(component.passwordModified).toBe(false);
      expect(component.passwordSet).toBe(true);
      expect(control.pristine).toBe(true);
      expect(control.untouched).toBe(true);
    });

    it('does not send password on save after focus and blur without editing', () => {
      setupUserWithExistingPassword();
      component.onPasswordFocus();
      component.onPasswordBlur();

      const user = component.createObject(42);
      expect(component.isPasswordBeingEdited).toBe(false);
      expect(user.password).toBeUndefined();
    });

    it('keeps typed password after blur and includes it on save', () => {
      setupUserWithExistingPassword();
      component.onPasswordFocus();
      component.entityForm.get('newPassword').setValue('newSecret1');
      component.onPasswordChange();
      component.onPasswordBlur();

      expect(component.entityForm.get('newPassword').value).toBe('newSecret1');
      expect(component.isPasswordBeingEdited).toBe(true);
      expect(component.passwordModified).toBe(true);

      const user = component.createObject(42);
      expect(user.password).toBe('newSecret1');
    });

    it('strips accidental placeholder prefix when typing before focus clears', () => {
      setupUserWithExistingPassword();
      component.entityForm.get('newPassword').setValue(`${PASSWORD_PLACEHOLDER}x`);
      component.onPasswordChange();

      expect(component.entityForm.get('newPassword').value).toBe('x');
      expect(component.isPasswordBeingEdited).toBe(true);
    });

    it('restores placeholder when user clears field after typing (empty means not modified)', () => {
      setupUserWithExistingPassword();
      const control = component.entityForm.get('newPassword');

      component.onPasswordFocus();
      control.setValue('temp');
      component.onPasswordChange();
      control.setValue('');
      component.onPasswordChange();
      component.onPasswordBlur();

      expect(control.value).toBe(PASSWORD_PLACEHOLDER);
      expect(component.isPasswordBeingEdited).toBe(false);
      expect(component.passwordModified).toBe(false);
    });

    it('does not send password when cleared before save', () => {
      setupUserWithExistingPassword();
      component.onPasswordFocus();
      component.entityForm.get('newPassword').setValue('temp');
      component.onPasswordChange();
      component.entityForm.get('newPassword').setValue('');
      component.onPasswordChange();
      component.onPasswordBlur();

      const user = component.createObject(42);
      expect(user.password).toBeUndefined();
    });

    it('leaves field empty on blur when user had no password', () => {
      component.entityToEdit = component.empty();
      component.entityToEdit.passwordSet = false;
      component.postFetchData();

      component.onPasswordFocus();
      component.onPasswordBlur();

      expect(component.entityForm.get('newPassword').value).toBe('');
      expect(component.isPasswordBeingEdited).toBe(false);
    });
  });
});
