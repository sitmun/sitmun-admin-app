import {ApplicationFormComponent} from './application-form.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '@app/material-module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatIconTestingModule} from '@angular/material/icon/testing';
import {
  CodeListService, ApplicationBackgroundService, ApplicationService, ApplicationParameterService,
  RoleService, CartographyGroupService, TreeService, BackgroundService, TranslationService
} from '@app/domain';
import { ResourceService, ExternalService } from '@app/core/hal';
import {ExternalConfigurationService} from '@app/core/config/external-configuration.service';
import {HttpClientModule} from '@angular/common/http';
import {SitmunFrontendGuiModule} from '@app/frontend-gui/src/lib/public_api';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
      declarations: [ApplicationFormComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterModule.forRoot([], {}), HttpClientModule,
        SitmunFrontendGuiModule, RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule],
      providers: [ApplicationService, ApplicationBackgroundService, RoleService, ApplicationParameterService, TreeService,
        BackgroundService, CodeListService, CartographyGroupService, TranslationService, ResourceService, ExternalService,
        {provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService},],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
    expect(component.entityForm.get('situationMap')).toBeTruthy();
    expect(component.entityForm.get('scales')).toBeTruthy();
    expect(component.entityForm.get('treeAutoRefresh')).toBeTruthy();
  });

});
