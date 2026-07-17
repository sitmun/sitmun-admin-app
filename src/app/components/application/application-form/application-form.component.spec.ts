import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconTestingModule} from '@angular/material/icon/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {} from '@angular/router/testing';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';

import {EntityFormAlertsComponent} from '@app/components/shared/entity-form-alerts/entity-form-alerts.component';
import {FormToolbarComponent} from '@app/components/shared/form-toolbar/form-toolbar.component';
import {CoreModule} from '@app/core';
import {ExternalConfigurationService} from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {
  ApplicationBackgroundService, ApplicationParameterService, ApplicationService, BackgroundService,
  CartographyGroupService, CodeListService, RoleService, TranslationService, TreeService, UserService
} from '@app/domain';
import {DataGridComponent} from '@app/frontend-gui/src/lib/data-grid/data-grid.component';
import {SitmunFrontendGuiModule} from '@app/frontend-gui/src/lib/public_api';
import {MaterialModule} from '@app/material-module';
import {LoggerService} from '@app/services/logger.service';
import {
  configureLoggerForTests,
  provideErrorHandlerForTests,
  suppressAgGridConsoleWarnings,
} from '@app/testing/test-helpers';
import {constants} from '@environments/constants';

import {ApplicationFormComponent} from './application-form.component';

function seedApplicationFormCodeLists(component: ApplicationFormComponent): void {
  const {internalApp, externalApp} = constants.codeValue.applicationType;
  (component as unknown as {codelists: Map<string, {value: string; description: string; defaultCode?: boolean}[]>})
    .codelists.set('application.type', [
      {value: internalApp, description: 'Internal', defaultCode: true},
      {value: externalApp, description: 'External', defaultCode: false},
    ]);
  (component as unknown as {codelists: Map<string, unknown[]>}).codelists.set('applicationParameter.type', []);
  (component as unknown as {situationMapList: {id: number; name: string}[]}).situationMapList = [
    {id: 1, name: 'Default map'},
  ];
  (component as unknown as {usersList: unknown[]}).usersList = [];
}

describe('ApplicationFormComponent', () => {
  let component: ApplicationFormComponent;
  let fixture: ComponentFixture<ApplicationFormComponent>;
  let roleService: RoleService;
  let applicationBackgroundService: ApplicationBackgroundService;
  let applicationService: ApplicationService;
  let codeListService: CodeListService;
  let cartographyGroupService: CartographyGroupService;
  let applicationParameterService: ApplicationParameterService;
  let treeService: TreeService;
  let backgroundService: BackgroundService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;
  let restoreConsoleWarn: () => void;

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [ApplicationFormComponent, FormToolbarComponent],
      imports: [FormsModule, ReactiveFormsModule, RouterModule.forRoot([], {}), SitmunFrontendGuiModule, DataGridComponent, MaterialModule, MatIconTestingModule, BrowserAnimationsModule, CoreModule, EntityFormAlertsComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideErrorHandlerForTests(), ApplicationService, ApplicationBackgroundService, RoleService, ApplicationParameterService, TreeService,
        BackgroundService, CodeListService, CartographyGroupService, TranslationService, ResourceService, ExternalService, UserService,
        {provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService},]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationFormComponent);
    component = fixture.componentInstance;
    roleService = TestBed.inject(RoleService);
    applicationBackgroundService = TestBed.inject(ApplicationBackgroundService);
    applicationService = TestBed.inject(ApplicationService);
    codeListService = TestBed.inject(CodeListService);
    cartographyGroupService = TestBed.inject(CartographyGroupService);
    applicationParameterService = TestBed.inject(ApplicationParameterService);
    treeService = TestBed.inject(TreeService);
    backgroundService = TestBed.inject(BackgroundService);
    translationService = TestBed.inject(TranslationService);
    resourceService = TestBed.inject(ResourceService);
    externalService = TestBed.inject(ExternalService);
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    restoreConsoleWarn = suppressAgGridConsoleWarnings();
    seedApplicationFormCodeLists(component);
    component.entityToEdit = component.empty();
    component.postFetchData();
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
    restoreConsoleWarn?.();
  });

  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should instantiate roleService', () => {
    expect(roleService).toBeTruthy();
  });

  it('should instantiate applicationBackgroundService ', () => {
    expect(applicationBackgroundService).toBeTruthy();
  });

  it('should instantiate applicationService', () => {
    expect(applicationService).toBeTruthy();
  });

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
  });

  it('should instantiate cartographyGroupService', () => {
    expect(cartographyGroupService).toBeTruthy();
  });

  it('should instantiate applicationParameterService', () => {
    expect(applicationParameterService).toBeTruthy();
  });

  it('should instantiate treeService', () => {
    expect(treeService).toBeTruthy();
  });

  it('should instantiate backgroundService', () => {
    expect(backgroundService).toBeTruthy();
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
      logo: 'logo',
      title: 'title',
      jspTemplate: 'url',
      theme: 'theme',
      situationMap: 1,
      scales: '1',
      srs: 'EPSG:4326',
      treeAutoRefresh: true
    });
    //Miss url
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form valid', () => {
    component.entityForm.patchValue({
      name: 'name',
      description: 'description',
      logo: 'https://example.com/logo.png',
      type: 1,
      title: 'title',
      jspTemplate: 'https://example.com/external-app',
      theme: 'theme',
      situationMap: 1,
      scales: '1',
      srs: 'EPSG:4326',
      treeAutoRefresh: true
    });
    expect(component.entityForm.valid).toBeTruthy();
  });

  it('Application form fields', () => {
    expect(component.entityForm.get('name')).toBeTruthy();
    expect(component.entityForm.get('type')).toBeTruthy();
    expect(component.entityForm.get('title')).toBeTruthy();
    expect(component.entityForm.get('jspTemplate')).toBeTruthy();
    expect(component.entityForm.get('accessParentTerritory')).toBeTruthy();
    expect(component.entityForm.get('accessChildrenTerritory')).toBeTruthy();
    expect(component.entityForm.get('theme')).toBeTruthy();
    expect(component.entityForm.get('situationMapId')).toBeTruthy();
    expect(component.entityForm.get('scales')).toBeTruthy();
    expect(component.entityForm.get('treeAutoRefresh')).toBeTruthy();
  });

  it('requires external URL when type is external', () => {
    component.onSelectionTypeAppChanged({ value: constants.codeValue.applicationType.externalApp });
    component.entityForm.patchValue({
      name: 'External',
      description: 'desc',
      jspTemplate: '',
    });
    expect(component.entityForm.get('jspTemplate')?.valid).toBe(false);
    component.entityForm.patchValue({ jspTemplate: 'https://www.idee.es' });
    expect(component.entityForm.get('jspTemplate')?.valid).toBe(true);
  });

  it('does not require external URL when type is internal', () => {
    component.onSelectionTypeAppChanged({ value: constants.codeValue.applicationType.internalApp });
    component.entityForm.patchValue({ jspTemplate: '' });
    expect(component.entityForm.get('jspTemplate')?.disabled).toBe(true);
  });

  describe('entity form alerts integration', () => {
    it('rolesTabHasWarning when private-app warning is present', () => {
      component.entityToEdit = Object.assign(component.empty(), {
        warnings: ['entity.application.warning.private-application-with-public-user'],
      });
      expect(component.rolesTabHasWarning()).toBe(true);
    });

    it('detailsTabHasRequiredAlert when name is missing', () => {
      component.entityForm.patchValue({ name: '', type: 1 });
      expect(component.detailsTabHasRequiredAlert()).toBe(true);
    });

    it('canSave follows canSaveEntity including tree rules', () => {
      component.dataLoaded = true;
      component.entityForm.patchValue({
        name: 'name',
        description: 'desc',
        type: constants.codeValue.applicationType.internalApp,
      });
      component.entityForm.markAsDirty();
      (component as any).currentAppType = constants.codeValue.applicationType.internalApp;
      (component as any).treesDataGrid = {
        rowData: [{ type: constants.codeValue.treeType.touristicTree, status: constants.entityStatus.statusOK }],
      };
      expect(component.canSave()).toBe(false);
      expect(component.applicationTreeValidationWarningMessage).toBeTruthy();
    });

    it('does not render toolbar form-validation-banner', () => {
      component.dataLoaded = true;
      component.entityForm.get('name')?.setValue('');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-form-validation-banner')).toBeFalsy();
      expect(fixture.nativeElement.querySelector('app-entity-form-alerts')).toBeTruthy();
    });
  });

  describe('Grid capability classification', () => {
    it('rolesTable should have picker-add, updater, status column, no template dialogs', () => {
      expect(component['rolesTable'].hasPickerAdd()).toBe(true);
      expect(component['rolesTable'].hasRelationsUpdater()).toBe(true);
      expect(component['rolesTable'].hasStatusColumn()).toBe(true);
      expect(component['rolesTable'].hasTemplateDialogs()).toBe(false);
    });

    it('rolesTable name column uses the registered role form route', () => {
      const nameColumn = component['rolesTable'].relationsColumnsDefs
        .find(col => col.field === 'name');

      expect(nameColumn?.cellRendererParams?.route).toBe('/role/:id/roleForm');
      expect(nameColumn?.cellRendererParams?.route).not.toBe('/roles/:id/rolesForm');
    });

    it('applicationBackgroundsTable should have picker-add, updater, status column, no template dialogs', () => {
      expect(component['applicationBackgroundsTable'].hasPickerAdd()).toBe(true);
      expect(component['applicationBackgroundsTable'].hasRelationsUpdater()).toBe(true);
      expect(component['applicationBackgroundsTable'].hasStatusColumn()).toBe(true);
      expect(component['applicationBackgroundsTable'].hasTemplateDialogs()).toBe(false);
    });

    it('applicationBackgroundsTable should sort relations by order', () => {
      expect(component['applicationBackgroundsTable'].defaultRelationsSorting()).toEqual(['order']);
    });

    it('applicationBackgroundsTable updater should preserve HAL links when updating order', async () => {
      const updateSpy = jest
        .spyOn(applicationBackgroundService, 'update')
        .mockReturnValue(of({} as any));
      component.entityID = 99;
      const row = {
        id: 1,
        backgroundId: 2,
        order: 5,
        status: 'pendingModify',
        _links: { self: { href: '/api/application-backgrounds/1' } }
      } as any;

      await component['applicationBackgroundsTable']['relationsUpdateFn']([row]);

      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          order: 5,
          _links: {
            self: { href: expect.stringContaining('/application-backgrounds/1') }
          }
        })
      );
      const updatedEntity = updateSpy.mock.calls[0][0];
      expect(updatedEntity.application).toBeDefined();
      expect(updatedEntity.background).toBeDefined();
    });

    it('parametersTable should have template-dialog, updater, and status capabilities', () => {
      const table = component['parametersTable'];
      expect(table.hasTemplateDialogs()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.supportsDuplicate()).toBe(false);
      expect(table.hasPickerAdd()).toBe(false);
    });

    it('headerParamsTable should have template-dialog, updater, and status capabilities', () => {
      const table = component['headerParamsTable'];
      expect(table.hasTemplateDialogs()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.supportsDuplicate()).toBe(false);
      expect(table.hasPickerAdd()).toBe(false);
    });

    it('treesTable should have picker-add, updater, status column, no template dialogs', () => {
      expect(component['treesTable'].hasPickerAdd()).toBe(true);
      expect(component['treesTable'].hasRelationsUpdater()).toBe(true);
      expect(component['treesTable'].hasStatusColumn()).toBe(true);
      expect(component['treesTable'].hasTemplateDialogs()).toBe(false);
    });
  });

  describe('headerParamsTable updater', () => {
    it('calls applicationService.update exactly once after creating a new header param', async () => {
      const updateSpy = jest.spyOn(applicationService, 'update').mockReturnValue(of({} as any));
      component.entityToEdit = Object.assign(component.empty(), {
        id: 5,
        headerParams: { headerLeftSection: {}, headerRightSection: {} }
      });
      (component as any).entityID = 5;

      const newRow = {
        name: 'myParam',
        url: 'http://example.com',
        visible: true,
        section: 'headerLeftSection',
        status: 'pendingCreation',
        newItem: true,
      } as any;

      await component['headerParamsTable']['relationsUpdateFn']([newRow]);

      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(component.entityToEdit.headerParams.headerLeftSection['myParam']).toEqual({
        url: 'http://example.com',
        visible: true,
      });
    });

    it('calls applicationService.update exactly once when deleting a header param', async () => {
      const updateSpy = jest.spyOn(applicationService, 'update').mockReturnValue(of({} as any));
      component.entityToEdit = Object.assign(component.empty(), {
        id: 5,
        headerParams: {
          headerLeftSection: { myParam: { url: 'http://old.com', visible: false } },
          headerRightSection: {}
        }
      });

      const deletedRow = {
        name: 'myParam',
        section: 'headerLeftSection',
        status: 'pendingDelete',
      } as any;

      await component['headerParamsTable']['relationsUpdateFn']([deletedRow]);

      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(component.entityToEdit.headerParams.headerLeftSection['myParam']).toBeUndefined();
    });

    it('getAllHeaderParams uses stable section keys', () => {
      component.entityToEdit = Object.assign(component.empty(), {
        id: 5,
        headerParams: {
          headerLeftSection: { customLeft: { url: 'http://left.com', visible: true } },
          headerRightSection: { customRight: { url: 'http://right.com', visible: false } },
        }
      });
      (component as any).headerParams = component.entityToEdit.headerParams;
      (component as any).headerBaseLeft = Object.keys((component as any).headerParams.headerLeftSection).filter(() => false);
      (component as any).headerBaseRight = Object.keys((component as any).headerParams.headerRightSection).filter(() => false);

      const result: any[] = [];
      (component as any).getAllHeaderParams().subscribe((params: any[]) => result.push(...params));

      const leftParam = result.find(p => p.name === 'customLeft');
      const rightParam = result.find(p => p.name === 'customRight');
      expect(leftParam?.section).toBe('headerLeftSection');
      expect(rightParam?.section).toBe('headerRightSection');
    });
  });

  describe('Picker deduplication', () => {
    it('treesTable excludes already-added trees from the picker', () => {
      const relations = [{ id: 1 }, { id: 2 }] as any;
      const predicate = (component['treesTable'] as any).targetIncludeFn(relations);
      expect(predicate({ id: 1 })).toBe(false);
      expect(predicate({ id: 3 })).toBe(true);
    });

    it('rolesTable excludes already-added roles from the picker', () => {
      const relations = [{ id: 10 }, { id: 20 }] as any;
      const predicate = (component['rolesTable'] as any).targetIncludeFn(relations);
      expect(predicate({ id: 10 })).toBe(false);
      expect(predicate({ id: 30 })).toBe(true);
    });
  });

  describe('responsibleInstitutionName', () => {
    it('postFetchData creates optional control with loaded value', () => {
      component.entityToEdit = Object.assign(component.empty(), {
        responsibleInstitutionName: 'Institution',
      });
      component.postFetchData();
      const control = component.entityForm.get('responsibleInstitutionName');
      expect(control).toBeTruthy();
      expect(control?.value).toBe('Institution');
      expect(control?.valid).toBe(true);
    });

    it('accepts empty value and rejects more than 250 characters', () => {
      const control = component.entityForm.get('responsibleInstitutionName');
      control?.setValue('');
      expect(control?.valid).toBe(true);
      control?.setValue('x'.repeat(251));
      expect(control?.hasError('maxlength')).toBe(true);
      control?.setValue('x'.repeat(250));
      expect(control?.valid).toBe(true);
    });

    it('createObject includes trimmed institution and maps blank to null', () => {
      component.entityForm.patchValue({
        name: 'name',
        description: 'description',
        type: constants.codeValue.applicationType.internalApp,
        responsibleInstitutionName: '  Servei  ',
      });
      expect(component.createObject().responsibleInstitutionName).toBe('Servei');

      component.entityForm.patchValue({ responsibleInstitutionName: '   ' });
      expect(component.createObject().responsibleInstitutionName).toBeNull();

      component.entityForm.patchValue({ responsibleInstitutionName: '' });
      expect(component.createObject().responsibleInstitutionName).toBeNull();
    });
  });

  describe('point of contact eligibility', () => {
    const users = [
      { id: 1, username: 'alice', blocked: false, email: 'a@example.com', administrator: false },
      { id: 2, username: 'bob', blocked: false, email: null, administrator: false },
      { id: 3, username: 'carol', blocked: false, email: '', administrator: false },
      { id: 4, username: 'dave', blocked: false, email: '   ', administrator: false },
      { id: 5, username: 'admin2', blocked: false, email: 'a2@example.com', administrator: true },
      { id: 6, username: 'admin3', blocked: false, email: null, administrator: true },
      { id: 7, username: 'public', blocked: false, email: 'p@example.com', administrator: false },
      { id: 8, username: 'admin', blocked: false, email: 'admin@example.com', administrator: true },
      { id: 9, username: 'blocked', blocked: true, email: 'b@example.com', administrator: false },
    ] as any[];

    beforeEach(() => {
      (component as any).usersList = users;
    });

    it('eligibleUsersList includes ordinary and non-built-in admins with or without email', () => {
      const usernames = component.eligibleUsersList.map(u => u.username);
      expect(usernames).toEqual(['alice', 'bob', 'carol', 'dave', 'admin2', 'admin3']);
    });

    it('excludes public, built-in admin, and blocked users', () => {
      const usernames = component.eligibleUsersList.map(u => u.username);
      expect(usernames).not.toContain('public');
      expect(usernames).not.toContain('admin');
      expect(usernames).not.toContain('blocked');
    });

    it('exposes current ineligible creator for disabled option', () => {
      component.entityToEdit = Object.assign(component.empty(), { creatorId: 9 });
      component.postFetchData();
      expect(component.currentIneligibleCreator?.username).toBe('blocked');
      expect(component.isEligiblePointOfContact(users[0])).toBe(true);
      expect(component.isEligiblePointOfContact(users[8])).toBe(false);
    });

    it('updateDataRelated skips creator relation when unchanged', async () => {
      const entity = {
        updateRelationEx: jest.fn().mockReturnValue(of(null)),
        situationMap: null,
        creator: { id: 9 },
      };
      jest.spyOn(component, 'createObject').mockReturnValue(entity as any);
      jest.spyOn(component as any, 'saveTranslations').mockResolvedValue(undefined);
      component.entityToEdit = Object.assign(component.empty(), { creatorId: 9 });
      component.postFetchData();
      component.entityID = 1;

      await component.updateDataRelated(false);

      expect(entity.updateRelationEx).toHaveBeenCalledWith('situationMap', null);
      expect(entity.updateRelationEx).not.toHaveBeenCalledWith('creator', expect.anything());
    });

    it('updateDataRelated updates creator relation when changed', async () => {
      const entity = {
        updateRelationEx: jest.fn().mockReturnValue(of(null)),
        situationMap: null,
        creator: { id: 1 },
      };
      jest.spyOn(component, 'createObject').mockReturnValue(entity as any);
      jest.spyOn(component as any, 'saveTranslations').mockResolvedValue(undefined);
      component.entityToEdit = Object.assign(component.empty(), { creatorId: 9 });
      component.postFetchData();
      component.entityForm.patchValue({ creatorId: 1 });
      component.entityID = 1;

      await component.updateDataRelated(false);

      expect(entity.updateRelationEx).toHaveBeenCalledWith('creator', entity.creator);
    });
  });

  describe('point of contact warnings classification', () => {
    it('passes email-missing as infoMessageKeys', () => {
      expect(component.pointOfContactInfoMessageKeys).toContain(
        'entity.application.warning.point-of-contact-email-missing'
      );
    });

    it('keeps invalid-point-of-contact as a warning key', () => {
      component.entityToEdit = Object.assign(component.empty(), {
        warnings: ['entity.application.warning.invalid-point-of-contact'],
      });
      component.dataLoaded = true;
      fixture.detectChanges();
      expect(component.entityToEdit.warnings).toContain(
        'entity.application.warning.invalid-point-of-contact'
      );
      expect(component.pointOfContactInfoMessageKeys).not.toContain(
        'entity.application.warning.invalid-point-of-contact'
      );
    });
  });

});
