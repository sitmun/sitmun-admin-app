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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      providers: [provideErrorHandlerForTests(), ApplicationService, ApplicationBackgroundService, RoleService, ApplicationParameterService, TreeService,
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

});
