import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreesFormComponent } from './trees-form.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material-module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TreeService, TreeNodeService, CartographyService, CodeListService,TranslationService, ResourceService, 
  ExternalService, ServiceService, CapabilitiesService, ApplicationService  } from '../../../frontend-core/src/lib/public_api';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SitmunFrontendGuiModule } from '../../../frontend-gui/src/lib/public_api';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
      imports: [FormsModule, ReactiveFormsModule,HttpClientTestingModule, SitmunFrontendGuiModule, RouterTestingModule,
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

  it('form tree invalid when empty', () => {
    expect(component.treeForm.valid).toBeFalsy();
  }); 

  it('form tree invalid when mid-empty', () => {
    component.treeForm.patchValue({
      description: 'description',
      image: 'www.image.com'
    })
    //Miss name
    expect(component.treeForm.valid).toBeFalsy();
  }); 

  it('form tree valid', () => {
    component.treeForm.patchValue({
      name: 'name',
      description: 'description',
      image: 'www.image.com'
    })
    expect(component.treeForm.valid).toBeTruthy();
  }); 

  it('form tree node invalid when empty', () => {
    expect(component.treeNodeForm.valid).toBeFalsy();
  }); 

  it('form tree node invalid when mid-empty', () => {
    component.treeNodeForm.patchValue({
      tooltip: true,
      cartography: null,
      radio: true,
      datasetURL: 'url',
      metadataURL: 'url',
      description: 'descript',
      active: true,
      order: 1,
      filterGetFeatureInfo: null,
      filterGetMap: null,
      filterSelectable: null,
      style: null,
    })
    //Miss name
    expect(component.treeNodeForm.valid).toBeFalsy();
  }); 

  it('form tree node valid', () => {
    component.treeNodeForm.patchValue({
      name: 'name',
      tooltip: true,
      cartography: null,
      radio: true,
      datasetURL: 'url',
      metadataURL: 'url',
      description: 'descript',
      active: true,
      order: 1,
      filterGetFeatureInfo: null,
      filterGetMap: null,
      filterSelectable: null,
      style: null,
    })
    expect(component.treeNodeForm.valid).toBeTruthy();
  }); 

  it('Tree form fields', () => {
    expect(component.treeForm.get('name')).toBeTruthy();
    expect(component.treeForm.get('description')).toBeTruthy();
    expect(component.treeForm.get('image')).toBeTruthy();
  }); 

  it('Tree node form fields', () => {
    expect(component.treeNodeForm.get('name')).toBeTruthy();
    expect(component.treeNodeForm.get('tooltip')).toBeTruthy();
    expect(component.treeNodeForm.get('cartography')).toBeTruthy();
    expect(component.treeNodeForm.get('radio')).toBeTruthy();
    expect(component.treeNodeForm.get('datasetURL')).toBeTruthy();
    expect(component.treeNodeForm.get('metadataURL')).toBeTruthy();
    expect(component.treeNodeForm.get('description')).toBeTruthy();
    expect(component.treeNodeForm.get('active')).toBeTruthy();
    expect(component.treeNodeForm.get('order')).toBeTruthy();
    expect(component.treeNodeForm.get('filterGetFeatureInfo')).toBeTruthy();
    expect(component.treeNodeForm.get('filterGetMap')).toBeTruthy();
    expect(component.treeNodeForm.get('filterSelectable')).toBeTruthy();
    expect(component.treeNodeForm.get('style')).toBeTruthy();
  }); 

  
});
