import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { RoleFormComponent } from './role-form.component';
import { RouterModule } from '@angular/router';
import { RoleService, UserService, CodeListService, CartographyGroupService, TerritoryService, 
  CartographyService, TaskService, UserConfigurationService, ApplicationService,ResourceService,ExternalService } from '../../../frontend-core/src/lib/public_api';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SitmunFrontendGuiModule } from '../../../frontend-gui/src/lib/public_api';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../material-module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


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
  let service: RoleService;
  let httpMock: HttpClient;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleFormComponent ],
      imports: [FormsModule, ReactiveFormsModule,HttpClientTestingModule, RouterModule.forRoot([]), HttpClientModule,
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
    expect(component.formRole.valid).toBeFalsy();
  }); 

  it('form invalid when mid-empty', () => {
    component.formRole.patchValue({
      name: 'missDescription',
    })
    //Miss name
    expect(component.formRole.valid).toBeFalsy();
  }); 

  it('form valid', () => {
    component.formRole.patchValue({
      name: 'name',
      description: 'description'
    })
    expect(component.formRole.valid).toBeTruthy();
  }); 

  it('Role form fields', () => {
    expect(component.formRole.get('description')).toBeTruthy();
    expect(component.formRole.get('name')).toBeTruthy();
  }); 



});

