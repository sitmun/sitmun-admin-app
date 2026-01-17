
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {
  ApplicationService, CartographyGroupService, CartographyService, CodeListService, RoleService,
  TaskService, TerritoryService, UserConfigurationService, UserService
} from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';


import { RoleFormComponent } from './role-form.component';


describe('RoleFormComponent', () => {
  let component: RoleFormComponent;
  let fixture: ComponentFixture<RoleFormComponent>;
  let roleService: RoleService;
  let userService: UserService;
  let applicationService: ApplicationService;
  let codeListService: CodeListService;
  let cartographyGroupService: CartographyGroupService;
  let userConfigurationService: UserConfigurationService;
  let cartographyService: CartographyService;
  let taskService: TaskService;
  let resourceService: ResourceService;
  let externalService: ExternalService;

  let injector: TestBed;
  let _service: RoleService;
  let httpMock: HttpClient;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleFormComponent ],
      imports: [FormsModule, ReactiveFormsModule,HttpClientTestingModule, RouterModule.forRoot([], {}), HttpClientModule,
      SitmunFrontendGuiModule, RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule],
      providers: [RoleService, UserService, TerritoryService, ApplicationService, CodeListService,
        CartographyGroupService,UserConfigurationService, CartographyService, TaskService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFormComponent);
    component = fixture.componentInstance;
    roleService= TestBed.inject(RoleService);
    userService= TestBed.inject(UserService);
    applicationService= TestBed.inject(ApplicationService);
    codeListService= TestBed.inject(CodeListService);
    cartographyGroupService= TestBed.inject(CartographyGroupService);
    userConfigurationService= TestBed.inject(UserConfigurationService);
    cartographyService= TestBed.inject(CartographyService);
    taskService= TestBed.inject(TaskService);
    resourceService= TestBed.inject(ResourceService);
    externalService= TestBed.inject(ExternalService);

    injector = getTestBed();
    // service= TestBed.inject(RoleService);
    // service= injector.get(RoleService);
    httpMock= TestBed.inject(HttpClient);
    service = new RoleService(injector,httpMock)
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

  it('should instantiate applicationService', () => {
    expect(applicationService).toBeTruthy();
  });

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
  });

  it('should instantiate cartographyGroupService', () => {
    expect(cartographyGroupService).toBeTruthy();
  });

  it('should instantiate userConfigurationService', () => {
    expect(userConfigurationService).toBeTruthy();
  });

  it('should instantiate cartographyService', () => {
    expect(cartographyService).toBeTruthy();
  });

  it('should instantiate taskService', () => {
    expect(taskService).toBeTruthy();
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
      description: 'missDescription',
    })
    //Miss name
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form valid', () => {
    component.entityForm.patchValue({
      name: 'name',
      description: 'description'
    })
    expect(component.entityForm.valid).toBeTruthy();
  });

  it('Role form fields', () => {
    expect(component.entityForm.get('description')).toBeTruthy();
    expect(component.entityForm.get('name')).toBeTruthy();
  });



});

