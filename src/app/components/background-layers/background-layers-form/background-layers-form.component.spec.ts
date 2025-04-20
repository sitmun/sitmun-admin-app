import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/material-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BackgroundService,CartographyGroupService, CartographyService, CodeListService,RoleService,TranslationService,ApplicationService, ApplicationBackgroundService } from '@app/domain';
import { ResourceService, ExternalService } from '@app/core/hal';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { HttpClientModule } from '@angular/common/http';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { RouterTestingModule } from '@angular/router/testing';
import { BackgroundLayersFormComponent } from './background-layers-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('BackgroundLayersFormComponent', () => {
  let component: BackgroundLayersFormComponent;
  let fixture: ComponentFixture<BackgroundLayersFormComponent>;
  let roleService: RoleService;
  let cartographyService: CartographyService;
  let codeListService: CodeListService;
  let cartographyGroupService: CartographyGroupService;
  let backgroundService: BackgroundService;
  let applicationService: ApplicationService;
  let applicationBackgroundService: ApplicationBackgroundService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundLayersFormComponent ],
      imports: [FormsModule, ReactiveFormsModule,HttpClientTestingModule, RouterModule.forRoot([], {}), HttpClientModule,
      SitmunFrontendGuiModule, RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule, TranslateModule.forRoot()],
      providers: [BackgroundService, RoleService, ApplicationBackgroundService, ApplicationService, CartographyService, CodeListService,CartographyGroupService,TranslationService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundLayersFormComponent);
    component = fixture.componentInstance;
    roleService= TestBed.inject(RoleService);
    cartographyService= TestBed.inject(CartographyService);
    codeListService= TestBed.inject(CodeListService);
    cartographyGroupService= TestBed.inject(CartographyGroupService);
    backgroundService= TestBed.inject(BackgroundService);
    applicationService= TestBed.inject(ApplicationService);
    applicationBackgroundService= TestBed.inject(ApplicationBackgroundService);
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

  it('should instantiate cartographyService', () => {
    expect(cartographyService).toBeTruthy();
  });

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
  });

  it('should instantiate cartographyGroupService', () => {
    expect(cartographyGroupService).toBeTruthy();
  });

  it('should instantiate backgroundService', () => {
    expect(backgroundService).toBeTruthy();
  });

  it('should instantiate applicationService', () => {
    expect(applicationService).toBeTruthy();
  });

  it('should instantiate applicationBackgroundService', () => {
    expect(applicationBackgroundService).toBeTruthy();
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
      description: 'desc',
      image: 'image',
      active: true
    })
    //Miss name
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form valid', () => {
    component.entityForm.patchValue({
      name: 'name',
      description: 'desc',
      image: 'image',
      active: true
    })
    expect(component.entityForm.valid).toBeTruthy();
  });

  it('Background layers form fields', () => {
    expect(component.entityForm.get('name')).toBeTruthy();
    expect(component.entityForm.get('description')).toBeTruthy();
    expect(component.entityForm.get('image')).toBeTruthy();
    expect(component.entityForm.get('active')).toBeTruthy();
  });


});
