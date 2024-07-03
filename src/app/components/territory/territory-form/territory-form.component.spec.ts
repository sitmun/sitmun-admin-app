import { TerritoryFormComponent } from './territory-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material-module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TerritoryService, TerritoryGroupTypeService, CartographyAvailabilityService, TaskAvailabilityService , CartographyService, UserService,
   RoleService, TaskService,UserConfigurationService, CodeListService, TranslationService, ResourceService, ExternalService, UserPositionService,
   TerritoryTypeService  } from '../../../frontend-core/src/lib/public_api';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SitmunFrontendGuiModule } from '../../../frontend-gui/src/lib/public_api';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('TerritoryFormComponent', () => {
  let component: TerritoryFormComponent;
  let fixture: ComponentFixture<TerritoryFormComponent>;
  let roleService: RoleService;
  let userService: UserService;
  let territoryService: TerritoryService;
  let codeListService: CodeListService;
  let territoryGroupTypeService: TerritoryGroupTypeService;
  let cartographyService: CartographyService;
  let taskAvailabilityService: TaskAvailabilityService;
  let territoryTypeService: TerritoryTypeService;
  let taskService: TaskService;
  let userPositionService: UserPositionService;
  let cartographyAvailabilityService: CartographyAvailabilityService;
  let userConfigurationService: UserConfigurationService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerritoryFormComponent ],
      imports: [FormsModule, ReactiveFormsModule,HttpClientTestingModule, SitmunFrontendGuiModule, RouterTestingModule,
        RouterModule.forRoot([]), MaterialModule, MatIconTestingModule],
     providers: [TerritoryService, UserService, RoleService,  TerritoryGroupTypeService, CartographyService, TaskAvailabilityService,
       TaskService, UserPositionService, TerritoryTypeService, CartographyAvailabilityService, CodeListService,UserConfigurationService,TranslationService, ResourceService, ExternalService,
       { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
   })
   .compileComponents();
 });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryFormComponent);
    component = fixture.componentInstance;
    roleService= TestBed.inject(RoleService);
    userService= TestBed.inject(UserService);
    territoryService= TestBed.inject(TerritoryService);
    codeListService= TestBed.inject(CodeListService);
    territoryGroupTypeService= TestBed.inject(TerritoryGroupTypeService);
    cartographyService= TestBed.inject(CartographyService);
    taskAvailabilityService= TestBed.inject(TaskAvailabilityService);
    territoryTypeService= TestBed.inject(TerritoryTypeService);
    taskService= TestBed.inject(TaskService);
    userPositionService= TestBed.inject(UserPositionService);
    cartographyAvailabilityService= TestBed.inject(CartographyAvailabilityService);
    userConfigurationService= TestBed.inject(UserConfigurationService);
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

  it('should instantiate userService', () => {
    expect(userService).toBeTruthy();
  });

  it('should instantiate territoryService', () => {
    expect(territoryService).toBeTruthy();
  });

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
  });

  it('should instantiate territoryGroupTypeService', () => {
    expect(territoryGroupTypeService).toBeTruthy();
  });

  it('should instantiate cartographyService', () => {
    expect(cartographyService).toBeTruthy();
  });

  it('should instantiate taskAvailabilityService', () => {
    expect(taskAvailabilityService).toBeTruthy();
  });

  it('should instantiate territoryTypeService', () => {
    expect(territoryTypeService).toBeTruthy();
  });

  it('should instantiate taskService', () => {
    expect(taskService).toBeTruthy();
  });

  it('should instantiate userPositionService', () => {
    expect(userPositionService).toBeTruthy();
  });

  it('should instantiate cartographyAvailabilityService', () => {
    expect(cartographyAvailabilityService).toBeTruthy();
  });

  it('should instantiate userConfigurationService', () => {
    expect(userConfigurationService).toBeTruthy();
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
    expect(component.territoryForm.valid).toBeFalsy();
  }); 

  it('form invalid when mid-empty', () => {
    component.territoryForm.patchValue({
      code: 1,
      territorialAuthorityAddress: 'address',
      territorialAuthorityLogo: 'urlLogo',
      type: 1,
      extensionX0: 1,
      extensionX1: 2,
      extensionY0: 3,
      extensionY1: 4,
      extent: 12,
      note: 'observations',
      blocked: false,
      defaultZoomLevel: 2,
      centerPointX:  5,
      centerPointY:  5,
    })
    //Miss name
    expect(component.territoryForm.valid).toBeFalsy();
  }); 

  it('form valid', () => {
    component.territoryForm.patchValue({
      code: 1,
      name: 'name',
      territorialAuthorityAddress: 'address',
      territorialAuthorityLogo: 'urlLogo',
      type: 1,
      extensionX0: 1,
      extensionX1: 2,
      extensionY0: 3,
      extensionY1: 4,
      extent: 12,
      note: 'observations',
      blocked: false,
      defaultZoomLevel: 2,
      centerPointX:  5,
      centerPointY:  5,
    })
    expect(component.territoryForm.valid).toBeTruthy();
  }); 

  it('Territory form fields', () => {
    expect(component.territoryForm.get('code')).toBeTruthy();
    expect(component.territoryForm.get('name')).toBeTruthy();
    expect(component.territoryForm.get('territorialAuthorityAddress')).toBeTruthy();
    expect(component.territoryForm.get('territorialAuthorityLogo')).toBeTruthy();
    expect(component.territoryForm.get('type')).toBeTruthy();
    expect(component.territoryForm.get('extensionX0')).toBeTruthy();
    expect(component.territoryForm.get('extensionX1')).toBeTruthy();
    expect(component.territoryForm.get('extensionY0')).toBeTruthy();
    expect(component.territoryForm.get('extensionY1')).toBeTruthy();
    expect(component.territoryForm.get('extent')).toBeTruthy();
    expect(component.territoryForm.get('note')).toBeTruthy();
    expect(component.territoryForm.get('blocked')).toBeTruthy();
    expect(component.territoryForm.get('defaultZoomLevel')).toBeTruthy();
    expect(component.territoryForm.get('centerPointX')).toBeTruthy();
    expect(component.territoryForm.get('centerPointY')).toBeTruthy();
  }); 

  it('Validate extent all null', () => {
    expect(component.validateExtent(null,null,null,null)).toBeTruthy();
  }); 

  it('Validate extent all with value', () => {
    expect(component.validateExtent(1,2,3,4)).toBeTruthy();
  }); 

  it('Validate extent with invalid values', () => {
    expect(component.validateExtent(1,null,3,4)).toBeFalsy();
  }); 

  it('Update extent', () => {

    component.territoryForm.patchValue({
      extensionX0: 1,
      extensionX1: 2,
      extensionY0: 3,
      extensionY1: 4,
    })

    component.updateExtent();

    expect(component.territoryForm.get('extent').value).toEqual({
      minX: 1,
      maxX: 2,
      minY: 3,
      maxY: 4,
    });
  }); 

  it('defineAppliesToChildrenColumns bottom true', () => {

    component.defineAppliesToChildrenColumns(false,true);
    //If bottom true, columndefsPermits[4] -> appliesToChildren must not be editable
    expect(component.columnDefsPermits[4].editable).toBeFalse();
    //If bottom true, columndefsRolesDialog only has 3 columns
    expect(component.columnDefsRolesDialog.length).toEqual(3);
  }); 

  it('defineAppliesToChildrenColumns bottom false', () => {

    component.defineAppliesToChildrenColumns(false,false);
    //If bottom false, columndefsPermits[4] -> appliesToChildren must not be editable
    expect(component.columnDefsPermits[4].editable).toBeTrue();
    //If bottom false, columndefsRolesDialog has 4 columns
    expect(component.columnDefsRolesDialog.length).toEqual(4);
  }); 




});
