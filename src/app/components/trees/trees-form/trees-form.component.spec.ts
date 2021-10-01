import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreesFormComponent } from './trees-form.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material-module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TreeService, TreeNodeService, CartographyService, CodeListService,TranslationService, ResourceService, ExternalService, ServiceService, CapabilitiesService, ApplicationService  } from 'dist/sitmun-frontend-core/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { RouterTestingModule } from '@angular/router/testing';

describe('TreesFormComponent', () => {
  let component: TreesFormComponent;
  let fixture: ComponentFixture<TreesFormComponent>;
  let treeService: TreeService;
  let treeNodeService: TreeNodeService;
  let cartographyService: CartographyService;
  let applicationService: ApplicationService;
  let serviceService: ServiceService;
  let capabilitiesService: CapabilitiesService;
  let codeListService: CodeListService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreesFormComponent ],
      imports: [HttpClientTestingModule, SitmunFrontendGuiModule, RouterTestingModule,
         RouterModule.forRoot([]), MaterialModule, MatIconTestingModule],
      providers: [TreeService,TreeNodeService, ApplicationService, ServiceService, CapabilitiesService, CartographyService, CodeListService,TranslationService, ResourceService, ExternalService ,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreesFormComponent);
    component = fixture.componentInstance;
    treeService= TestBed.inject(TreeService);
    treeNodeService= TestBed.inject(TreeNodeService);
    cartographyService= TestBed.inject(CartographyService);
    applicationService= TestBed.inject(ApplicationService);
    serviceService= TestBed.inject(ServiceService);
    capabilitiesService= TestBed.inject(CapabilitiesService);
    codeListService= TestBed.inject(CodeListService);
    translationService= TestBed.inject(TranslationService);
    resourceService= TestBed.inject(ResourceService);
    externalService= TestBed.inject(ExternalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should instantiate treeService', () => {
    expect(treeService).toBeTruthy();
  });
  
  it('should instantiate capabilitiesService', () => {
    expect(capabilitiesService).toBeTruthy();
  });
  
  it('should instantiate serviceService', () => {
    expect(serviceService).toBeTruthy();
  });
  
  it('should instantiate applicationService', () => {
    expect(applicationService).toBeTruthy();
  });

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
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

  
});
