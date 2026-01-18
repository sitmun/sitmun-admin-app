import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconTestingModule} from '@angular/material/icon/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';

import {FormToolbarComponent} from '@app/components/shared/form-toolbar/form-toolbar.component';
import {ExternalConfigurationService} from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {
  ApplicationBackgroundService, ApplicationParameterService, ApplicationService, BackgroundService,
  CartographyGroupService, CodeListService, RoleService, TranslationService, TreeService, UserService
} from '@app/domain';
import {SitmunFrontendGuiModule} from '@app/frontend-gui/src/lib/public_api';
import {MaterialModule} from '@app/material-module';
import {LoggerService} from '@app/services/logger.service';
import {configureLoggerForTests} from '@app/testing/test-helpers';

import {ApplicationFormComponent} from './application-form.component';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationFormComponent, FormToolbarComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterModule.forRoot([], {}), HttpClientModule,
        SitmunFrontendGuiModule, RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule, BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })],
      providers: [ApplicationService, ApplicationBackgroundService, RoleService, ApplicationParameterService, TreeService,
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
    // Suppress debug logs in tests to reduce console noise
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    // Initialize form if not already initialized
    // Mock the empty() method to avoid accessing protected situationMapList
    if (!component.entityForm) {
      const mockEmpty = jest.spyOn(component, 'empty');
      mockEmpty.mockReturnValue({
        id: -1,
        type: null,
        situationMap: null,
        appPrivate: false
      } as any);
      component.entityToEdit = component.empty();
      component.postFetchData();
      mockEmpty.mockRestore();
    }
    fixture.detectChanges();
  });

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
      logo: 'logo',
      type: 1,
      title: 'title',
      jspTemplate: 'url',
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

});
