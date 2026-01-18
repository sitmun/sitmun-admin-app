import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';

import {FormToolbarComponent} from '@app/components/shared/form-toolbar/form-toolbar.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {
  CodeListService, RoleService, TerritoryService, TranslationService,
  UserConfigurationService, UserPositionService, UserService
} from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import {LoggerService} from '@app/services/logger.service';
import {configureLoggerForTests} from '@app/testing/test-helpers';

import { UserFormComponent } from './user-form.component';




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
      declarations: [ UserFormComponent, FormToolbarComponent ],
      imports: [FormsModule, ReactiveFormsModule,HttpClientTestingModule, SitmunFrontendGuiModule, RouterTestingModule,
         RouterModule.forRoot([], {}), MaterialModule, MatIconTestingModule, BrowserAnimationsModule,
         TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })],
      providers: [UserService,RoleService, TerritoryService, UserPositionService,
        CodeListService,UserConfigurationService,TranslationService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    // Suppress debug logs in tests to reduce console noise
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    roleService= TestBed.inject(RoleService);
    userService= TestBed.inject(UserService);
    territoryService= TestBed.inject(TerritoryService);
    codeListService= TestBed.inject(CodeListService);
    userPositionService= TestBed.inject(UserPositionService);
    userConfigurationService= TestBed.inject(UserConfigurationService);
    translationService= TestBed.inject(TranslationService);
    resourceService= TestBed.inject(ResourceService);
    externalService= TestBed.inject(ExternalService);
    // Initialize form before detectChanges to prevent afterFetch from failing
    // This prevents ngOnInit -> fetchData -> afterFetch from calling subscribeToFormChanges with null
    component.entityToEdit = component.empty();
    component.postFetchData();
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
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form invalid when mid-empty', () => {
    component.entityForm.patchValue({
      firstName: 'Name',
      lastName: 'lastname',
      passwordSet: true,
      password: false,
      confirmPassword: false,
      administrator: true,
      blocked: true,
    })
    //Miss name
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form valid', () => {
    component.entityForm.patchValue({
      username: 'username',
      firstName: 'Name',
      lastName: 'lastname',
      passwordSet: true,
      password: false,
      confirmPassword: false,
      administrator: true,
      blocked: true,
    })
    expect(component.entityForm.valid).toBeTruthy();
  });

  it('User form fields', () => {
    expect(component.entityForm.get('username')).toBeTruthy();
    expect(component.entityForm.get('firstName')).toBeTruthy();
    expect(component.entityForm.get('lastName')).toBeTruthy();
    expect(component.entityForm.get('newPassword')).toBeTruthy();
    expect(component.entityForm.get('administrator')).toBeTruthy();
    expect(component.entityForm.get('blocked')).toBeTruthy();
  });
});
