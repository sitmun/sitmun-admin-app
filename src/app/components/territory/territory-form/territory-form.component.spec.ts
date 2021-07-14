import { TerritoryFormComponent } from './territory-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material-module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TerritoryService, TerritoryGroupTypeService, CartographyAvailabilityService, TaskAvailabilityService , CartographyService, UserService,
   RoleService, TaskService,UserConfigurationService, CodeListService, TranslationService, ResourceService, ExternalService, UserPositionService  } from 'dist/sitmun-frontend-core/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { RouterTestingModule } from '@angular/router/testing';
import { TerritoryTypeService } from 'dist/sitmun-frontend-core/';

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
      imports: [HttpClientTestingModule, SitmunFrontendGuiModule, RouterTestingModule,
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
});
