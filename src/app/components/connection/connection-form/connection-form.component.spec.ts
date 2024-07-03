import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SitmunFrontendGuiModule } from '../../../frontend-gui/src/lib/public_api';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { ConnectionService, CartographyService, TaskService, CodeListService,TranslationService,ResourceService,ExternalService } from '../../../frontend-core/src/lib/public_api';
import { ConnectionFormComponent } from '../connection-form/connection-form.component';
import { MaterialModule } from '../../../material-module';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectionFormComponent ],
      imports : [HttpClientTestingModule, FormsModule, ReactiveFormsModule, SitmunFrontendGuiModule, MatIconTestingModule, RouterTestingModule, MaterialModule, RouterModule],
      providers: [ConnectionService, CartographyService, TaskService, CodeListService,TranslationService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionFormComponent);
    component = fixture.componentInstance;
    connectionService= TestBed.inject(ConnectionService);
    cartographyService= TestBed.inject(CartographyService);
    taskService= TestBed.inject(TaskService);
    codeListService= TestBed.inject(CodeListService);
    translationService= TestBed.inject(TranslationService);
    resourceService= TestBed.inject(ResourceService);
    externalService= TestBed.inject(ExternalService);
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
    expect(component.formConnection.valid).toBeFalsy();
  }); 

  it('form invalid when mid-empty', () => {
    component.formConnection.patchValue({
      name:'testName',
      user: 'user',
      password: 'password',
      url: 'url'
    })
    //Miss driver
    expect(component.formConnection.valid).toBeFalsy();
  }); 

  it('form valid', () => {
    component.formConnection.patchValue({
      name:'testName',
      user: 'user',
      password: 'password',
      url: 'url',
      driver: 5
    })
    expect(component.formConnection.valid).toBeTruthy();
  }); 

  it('Connection form fields', () => {
    expect(component.formConnection.get('name')).toBeTruthy();
    expect(component.formConnection.get('user')).toBeTruthy();
    expect(component.formConnection.get('password')).toBeTruthy();
    expect(component.formConnection.get('url')).toBeTruthy();
    expect(component.formConnection.get('driver')).toBeTruthy();
  }); 

});
