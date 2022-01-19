import { ServiceFormComponent } from '../service-form/service-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ServiceService, ServiceParameterService, CartographyService, CodeListService,TranslationService,ResourceService,ExternalService, CapabilitiesService, CartographyStyleService } from 'dist/sitmun-frontend-core/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { HttpClientModule } from '@angular/common/http';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ServiceFormComponent', () => {
  let component: ServiceFormComponent;
  let fixture: ComponentFixture<ServiceFormComponent>;
  let serviceService: ServiceService;
  let capabilitiesService: CapabilitiesService;
  let serviceParameterService: ServiceParameterService;
  let codeListService: CodeListService;
  let cartographyService: CartographyService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;
  let cartographyStyleService: CartographyStyleService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceFormComponent ],
      imports: [FormsModule, ReactiveFormsModule,HttpClientTestingModule, RouterModule.forRoot([]), HttpClientModule,
      SitmunFrontendGuiModule, RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule],
      providers: [ServiceService, CapabilitiesService, CartographyStyleService, ServiceParameterService, CartographyService, CodeListService,TranslationService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceFormComponent);
    component = fixture.componentInstance;
    serviceService= TestBed.inject(ServiceService);
    capabilitiesService= TestBed.inject(CapabilitiesService);
    serviceParameterService= TestBed.inject(ServiceParameterService);
    codeListService= TestBed.inject(CodeListService);
    cartographyService= TestBed.inject(CartographyService);
    cartographyStyleService= TestBed.inject(CartographyStyleService);
    translationService= TestBed.inject(TranslationService);
    resourceService= TestBed.inject(ResourceService);
    externalService= TestBed.inject(ExternalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should instantiate serviceService', () => {
    expect(serviceService).toBeTruthy();
  });

  it('should instantiate capabilitiesService', () => {
    expect(capabilitiesService).toBeTruthy();
  });

  it('should instantiate serviceParameterService', () => {
    expect(serviceParameterService).toBeTruthy();
  });

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
  });

  it('should instantiate cartographyService', () => {
    expect(cartographyService).toBeTruthy();
  });

  it('should instantiate cartographyStyleService', () => {
    expect(cartographyStyleService).toBeTruthy();
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
    expect(component.serviceForm.valid).toBeFalsy();
  }); 

  it('form invalid when mid-empty', () => {
    component.serviceForm.patchValue({
      user: 'user',
      password: 'password',
      passwordSet: true,
      authenticationMode: 1,

      description: 'description',
      type: 1,
      serviceURL:  'urltest',
      proxyUrl: 'urltest',
      supportedSRS: ['EPSG:2831'],
      getInformationURL: 'urltest',
      blocked: true
    })
    //Miss name
    expect(component.serviceForm.valid).toBeFalsy();
  }); 

  it('form valid', () => {
    component.serviceForm.patchValue({
      name: 'name',
      user: 'user',
      password: 'password',
      passwordSet: true,
      authenticationMode: 1,

      description: 'description',
      type: 1,
      serviceURL:  'urltest',
      proxyUrl: 'urltest',
      supportedSRS: ['EPSG:2831'],
      getInformationURL: 'urltest',
      blocked: true
    })
    expect(component.serviceForm.valid).toBeTruthy();
  }); 
});
