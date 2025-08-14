import {
  CartographyAvailabilityService,
  CartographyService,
  CodeListService,
  RoleService,
  TaskAvailabilityService,
  TaskService,
  TerritoryGroupTypeService,
  TerritoryService,
  TerritoryTypeService,
  TranslationService,
  UserConfigurationService,
  UserPositionService,
  UserService,
} from '@app/domain';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ExternalService, ResourceService} from '@app/core/hal';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ExternalConfigurationService} from '@app/core/config/external-configuration.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatIconTestingModule} from '@angular/material/icon/testing';
import {MaterialModule} from '@app/material-module';
import {RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {SitmunFrontendGuiModule} from '@app/frontend-gui/src/lib/public_api';
import {TerritoryFormComponent} from './territory-form.component';

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
      declarations: [TerritoryFormComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        SitmunFrontendGuiModule,
        RouterTestingModule,
        RouterModule.forRoot([], {}),
        MaterialModule,
        MatIconTestingModule,
      ],
      providers: [
        TerritoryService,
        UserService,
        RoleService,
        TerritoryGroupTypeService,
        CartographyService,
        TaskAvailabilityService,
        TaskService,
        UserPositionService,
        TerritoryTypeService,
        CartographyAvailabilityService,
        CodeListService,
        UserConfigurationService,
        TranslationService,
        ResourceService,
        ExternalService,
        {
          provide: 'ExternalConfigurationService',
          useClass: ExternalConfigurationService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryFormComponent);
    component = fixture.componentInstance;
    roleService = TestBed.inject(RoleService);
    userService = TestBed.inject(UserService);
    territoryService = TestBed.inject(TerritoryService);
    codeListService = TestBed.inject(CodeListService);
    territoryGroupTypeService = TestBed.inject(TerritoryGroupTypeService);
    cartographyService = TestBed.inject(CartographyService);
    taskAvailabilityService = TestBed.inject(TaskAvailabilityService);
    territoryTypeService = TestBed.inject(TerritoryTypeService);
    taskService = TestBed.inject(TaskService);
    userPositionService = TestBed.inject(UserPositionService);
    cartographyAvailabilityService = TestBed.inject(
      CartographyAvailabilityService
    );
    userConfigurationService = TestBed.inject(UserConfigurationService);
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
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form invalid when mid-empty', () => {
    component.entityForm.patchValue({
      code: 1,
      territorialAuthorityAddress: 'address',
      territorialAuthorityLogo: 'urlLogo',
      type: 1,
      extentMinX: 1,
      extentMaxX: 2,
      extentMinY: 3,
      extentMaxY: 4,
      extent: 12,
      note: 'observations',
      blocked: false,
      defaultZoomLevel: 2,
      centerPointX: 5,
      centerPointY: 5,
    });
    //Miss name
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form valid', () => {
    component.entityForm.patchValue({
      code: 1,
      name: 'name',
      territorialAuthorityAddress: 'address',
      territorialAuthorityLogo: 'urlLogo',
      type: 1,
      extentMinX: 1,
      extentMaxX: 2,
      extentMinY: 3,
      extentMaxY: 4,
      extent: 12,
      note: 'observations',
      blocked: false,
      defaultZoomLevel: 2,
      centerPointX: 5,
      centerPointY: 5,
      srs: 'EPSG:4326',
    });
    expect(component.entityForm.valid).toBeTruthy();
  });

  it('Territory form fields', () => {
    expect(component.entityForm.get('code')).toBeTruthy();
    expect(component.entityForm.get('name')).toBeTruthy();
    expect(
      component.entityForm.get('territorialAuthorityAddress')
    ).toBeTruthy();
    expect(
      component.entityForm.get('territorialAuthorityLogo')
    ).toBeTruthy();
    expect(component.entityForm.get('type')).toBeTruthy();
    expect(component.entityForm.get('extentMinX')).toBeTruthy();
    expect(component.entityForm.get('extentMaxX')).toBeTruthy();
    expect(component.entityForm.get('extentMinY')).toBeTruthy();
    expect(component.entityForm.get('extentMaxY')).toBeTruthy();
    expect(component.entityForm.get('extent')).toBeTruthy();
    expect(component.entityForm.get('note')).toBeTruthy();
    expect(component.entityForm.get('blocked')).toBeTruthy();
    expect(component.entityForm.get('defaultZoomLevel')).toBeTruthy();
    expect(component.entityForm.get('centerPointX')).toBeTruthy();
    expect(component.entityForm.get('centerPointY')).toBeTruthy();
    expect(component.entityForm.get('srs')).toBeTruthy();
  });

  it('Validate extent all null', () => {
    expect(component.validateEnvelope(null, null, null, null)).toBeTruthy();
  });

  it('Validate extent all with value', () => {
    expect(component.validateEnvelope(1, 2, 3, 4)).toBeTruthy();
  });

  it('Validate extent with invalid values', () => {
    expect(component.validateEnvelope(1, null, 3, 4)).toBeFalsy();
  });
});
