import { ApplicationFormComponent } from './application-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { CodeListService, ApplicationBackgroundService, ApplicationService,ApplicationParameterService,
   RoleService, CartographyGroupService, TreeService,BackgroundService,TranslationService, ResourceService,ExternalService } from '../../../frontend-core/src/lib/public_api';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { HttpClientModule } from '@angular/common/http';
import { SitmunFrontendGuiModule } from '../../../frontend-gui/src/lib/public_api';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
      declarations: [ ApplicationFormComponent ],
      imports: [FormsModule, ReactiveFormsModule,HttpClientTestingModule, RouterModule.forRoot([]), HttpClientModule,
      SitmunFrontendGuiModule, RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule],
      providers: [ApplicationService, ApplicationBackgroundService, RoleService, ApplicationParameterService, TreeService, 
        BackgroundService, CodeListService, CartographyGroupService,TranslationService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationFormComponent);
    component = fixture.componentInstance;
    roleService= TestBed.inject(RoleService);
    applicationBackgroundService= TestBed.inject(ApplicationBackgroundService);
    applicationService= TestBed.inject(ApplicationService);
    codeListService= TestBed.inject(CodeListService);
    cartographyGroupService= TestBed.inject(CartographyGroupService);
    applicationParameterService= TestBed.inject(ApplicationParameterService);
    treeService= TestBed.inject(TreeService);
    backgroundService= TestBed.inject(BackgroundService);
    translationService= TestBed.inject(TranslationService);
    resourceService= TestBed.inject(ResourceService);
    externalService= TestBed.inject(ExternalService);
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
    expect(component.applicationForm.valid).toBeFalsy();
  }); 

  it('form invalid when mid-empty', () => {
    component.applicationForm.patchValue({
      name: 'nameTest',
      type: 1,
    })
    //Miss url
    expect(component.applicationForm.valid).toBeFalsy();
  }); 

  it('form valid', () => {
    component.applicationForm.patchValue({
      name: 'name',
      type: 1,
      title: 'title',
      jspTemplate: 'url',
      theme: 'theme',
      situationMap: 1,
      scales: '1',
      srs: 'EPSG:4326',
      treeAutoRefresh: true
    })
    expect(component.applicationForm.valid).toBeTruthy();
  }); 

  it('Application form fields', () => {
    expect(component.applicationForm.get('name')).toBeTruthy();
    expect(component.applicationForm.get('type')).toBeTruthy();
    expect(component.applicationForm.get('title')).toBeTruthy();
    expect(component.applicationForm.get('jspTemplate')).toBeTruthy();
    expect(component.applicationForm.get('theme')).toBeTruthy();
    expect(component.applicationForm.get('situationMap')).toBeTruthy();
    expect(component.applicationForm.get('scales')).toBeTruthy();
    expect(component.applicationForm.get('srs')).toBeTruthy();
    expect(component.applicationForm.get('treeAutoRefresh')).toBeTruthy();
  }); 


});
