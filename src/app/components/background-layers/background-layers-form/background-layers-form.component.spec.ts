import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BackgroundService,CartographyGroupService, CartographyService, CodeListService,RoleService,TranslationService,ResourceService,ExternalService, ApplicationService, ApplicationBackgroundService } from '../../../frontend-core/src/lib/public_api';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { HttpClientModule } from '@angular/common/http';
import { SitmunFrontendGuiModule } from '../../../frontend-gui/src/lib/public_api';
import { RouterTestingModule } from '@angular/router/testing';
import { BackgroundLayersFormComponent } from './background-layers-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
      imports: [FormsModule, ReactiveFormsModule,HttpClientTestingModule, RouterModule.forRoot([]), HttpClientModule,
      SitmunFrontendGuiModule, RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule],
      providers: [BackgroundService, RoleService, ApplicationBackgroundService, ApplicationService, CartographyService, CodeListService,CartographyGroupService,TranslationService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
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
    expect(component.backgroundForm.valid).toBeFalsy();
  }); 

  it('form invalid when mid-empty', () => {
    component.backgroundForm.patchValue({
      description: 'desc',
      image: 'image',
      active: true
    })
    //Miss name
    expect(component.backgroundForm.valid).toBeFalsy();
  }); 

  it('form valid', () => {
    component.backgroundForm.patchValue({
      name: 'name',
      description: 'desc',
      image: 'image',
      active: true
    })
    expect(component.backgroundForm.valid).toBeTruthy();
  }); 

  it('Background layers form fields', () => {
    expect(component.backgroundForm.get('name')).toBeTruthy();
    expect(component.backgroundForm.get('description')).toBeTruthy();
    expect(component.backgroundForm.get('image')).toBeTruthy();
    expect(component.backgroundForm.get('active')).toBeTruthy();
  }); 


});
