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
import {CartographyService, CodeListService, ConnectionService, TaskService, TranslationService} from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import {LoggerService} from '@app/services/logger.service';
import {configureLoggerForTests} from '@app/testing/test-helpers';

import { ConnectionFormComponent } from './connection-form.component';


describe('ConnectionFormComponent', () => {
  let component: ConnectionFormComponent;
  let fixture: ComponentFixture<ConnectionFormComponent>;
  let connectionService: ConnectionService;
  let cartographyService: CartographyService;
  let taskService: TaskService;
  let codeListService: CodeListService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    // Mock console.error to prevent console output during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    await TestBed.configureTestingModule({
      declarations: [ ConnectionFormComponent, FormToolbarComponent ],
      imports : [HttpClientTestingModule, FormsModule, ReactiveFormsModule, SitmunFrontendGuiModule, MatIconTestingModule, RouterTestingModule, MaterialModule, RouterModule, BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })],
      providers: [ConnectionService, CartographyService, TaskService, CodeListService,TranslationService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionFormComponent);
    component = fixture.componentInstance;
    // Suppress debug logs in tests to reduce console noise
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    connectionService= TestBed.inject(ConnectionService);
    cartographyService= TestBed.inject(CartographyService);
    taskService= TestBed.inject(TaskService);
    codeListService= TestBed.inject(CodeListService);
    translationService= TestBed.inject(TranslationService);
    resourceService= TestBed.inject(ResourceService);
    externalService= TestBed.inject(ExternalService);
    // Initialize form if not already initialized
    if (!component.entityForm) {
      component.entityToEdit = component.empty();
      component.postFetchData();
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should instantiate connectionService', () => {
    expect(connectionService).toBeTruthy();
  });

  it('should instantiate cartographyService', () => {
    expect(cartographyService).toBeTruthy();
  });

  it('should instantiate taskService', () => {
    expect(taskService).toBeTruthy();
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

  it('form invalid when empty', () => {
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form invalid when mid-empty', () => {
    component.entityForm.patchValue({
      name:'testName',
      user: 'user',
      newPassword: 'password',
      url: 'url'
    })
    //Miss driver
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form valid', () => {
    component.entityForm.patchValue({
      name:'testName',
      user: 'user',
      newPassword: 'password',
      url: 'url',
      driver: 5
    })
    expect(component.entityForm.valid).toBeTruthy();
  });

  it('Connection form fields', () => {
    expect(component.entityForm.get('name')).toBeTruthy();
    expect(component.entityForm.get('user')).toBeTruthy();
    expect(component.entityForm.get('newPassword')).toBeTruthy();
    expect(component.entityForm.get('url')).toBeTruthy();
    expect(component.entityForm.get('driver')).toBeTruthy();
  });

});
