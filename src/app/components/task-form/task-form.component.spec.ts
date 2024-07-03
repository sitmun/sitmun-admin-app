import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFormComponent } from './task-form.component';
import { ServiceService, TerritoryService, TaskTypeService, CartographyService, ConnectionService, CodeListService, ResourceService, 
  ExternalService, TaskService, TaskUIService, RoleService, TaskGroupService, TaskAvailabilityService } from '../../frontend-core/src/lib/public_api';
import { SitmunFrontendGuiModule } from '../../frontend-gui/src/lib/public_api';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../material-module';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';


describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let roleService: RoleService;
  let serviceService: ServiceService;
  let territoryService: TerritoryService;
  let codeListService: CodeListService;
  let taskTypeService: TaskTypeService;
  let taskAvailabilityService: TaskAvailabilityService;
  let cartographyService: CartographyService;
  let connectionService: ConnectionService;
  let taskService: TaskService;
  let taskUIService: TaskUIService;
  let taskGroupService: TaskGroupService;
  let resourceService: ResourceService;
  let externalService: ExternalService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskFormComponent ],
      imports : [HttpClientTestingModule, SitmunFrontendGuiModule, RouterTestingModule,MaterialModule, MatIconTestingModule, RouterModule],
      providers: [ServiceService, TerritoryService, CodeListService,TaskTypeService,TaskAvailabilityService ,CartographyService,ResourceService,ExternalService,ConnectionService,TaskService,TaskUIService,RoleService,TaskGroupService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    roleService= TestBed.inject(RoleService);
    serviceService= TestBed.inject(ServiceService);
    territoryService= TestBed.inject(TerritoryService);
    codeListService= TestBed.inject(CodeListService);
    taskTypeService= TestBed.inject(TaskTypeService);
    taskAvailabilityService= TestBed.inject(TaskAvailabilityService);
    cartographyService= TestBed.inject(CartographyService);
    connectionService= TestBed.inject(ConnectionService);
    taskService= TestBed.inject(TaskService);
    taskUIService= TestBed.inject(TaskUIService);
    taskGroupService= TestBed.inject(TaskGroupService);
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

  it('should instantiate serviceService', () => {
    expect(serviceService).toBeTruthy();
  });

  it('should instantiate territoryService', () => {
    expect(territoryService).toBeTruthy();
  });

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
  });

  it('should instantiate taskTypeService', () => {
    expect(taskTypeService).toBeTruthy();
  });

  it('should instantiate taskAvailabilityService', () => {
    expect(taskAvailabilityService).toBeTruthy();
  });

  it('should instantiate cartographyService', () => {
    expect(cartographyService).toBeTruthy();
  });

  it('should instantiate connectionService', () => {
    expect(connectionService).toBeTruthy();
  });

  it('should instantiate taskService', () => {
    expect(taskService).toBeTruthy();
  });

  it('should instantiate taskUIService', () => {
    expect(taskUIService).toBeTruthy();
  });

  it('should instantiate taskGroupService', () => {
    expect(taskGroupService).toBeTruthy();
  });

  it('should instantiate resourceService', () => {
    expect(resourceService).toBeTruthy();
  });

  it('should instantiate externalService', () => {
    expect(externalService).toBeTruthy();
  });
});
