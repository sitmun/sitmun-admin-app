import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormComponent } from './user-form.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material-module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { UserService, RoleService, TerritoryService, UserConfigurationService, 
  CodeListService, UserPositionService,TranslationService,ResourceService,ExternalService } from '../../../frontend-core/src/lib/public_api';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SitmunFrontendGuiModule } from '../../../frontend-gui/src/lib/public_api';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let roleService: RoleService;
  let userService: UserService;
  let territoryService: TerritoryService;
  let codeListService: CodeListService;
  let userPositionService: UserPositionService;
  let userConfigurationService: UserConfigurationService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFormComponent ],
      imports: [FormsModule, ReactiveFormsModule,HttpClientTestingModule, SitmunFrontendGuiModule, RouterTestingModule,
         RouterModule.forRoot([]), MaterialModule, MatIconTestingModule],
      providers: [UserService,RoleService, TerritoryService, UserPositionService, 
        CodeListService,UserConfigurationService,TranslationService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    roleService= TestBed.inject(RoleService);
    userService= TestBed.inject(UserService);
    territoryService= TestBed.inject(TerritoryService);
    codeListService= TestBed.inject(CodeListService);
    userPositionService= TestBed.inject(UserPositionService);
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

  it('should instantiate userPositionService', () => {
    expect(userPositionService).toBeTruthy();
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
    expect(component.userForm.valid).toBeFalsy();
  }); 

  it('form invalid when mid-empty', () => {
    component.userForm.patchValue({
      firstName: 'Name',
      lastName: 'lastname',
      passwordSet: true,
      password: false,
      confirmPassword: false,
      administrator: true,
      blocked: true,
    })
    //Miss name
    expect(component.userForm.valid).toBeFalsy();
  }); 

  it('form valid', () => {
    component.userForm.patchValue({
      username: 'username',
      firstName: 'Name',
      lastName: 'lastname',
      passwordSet: true,
      password: false,
      confirmPassword: false,
      administrator: true,
      blocked: true,
    })
    expect(component.userForm.valid).toBeTruthy();
  }); 

  it('User form fields', () => {
    expect(component.userForm.get('username')).toBeTruthy();
    expect(component.userForm.get('firstName')).toBeTruthy();
    expect(component.userForm.get('lastName')).toBeTruthy();
    expect(component.userForm.get('passwordSet')).toBeTruthy();
    expect(component.userForm.get('confirmPassword')).toBeTruthy();
    expect(component.userForm.get('administrator')).toBeTruthy();
    expect(component.userForm.get('blocked')).toBeTruthy();
  }); 
});
