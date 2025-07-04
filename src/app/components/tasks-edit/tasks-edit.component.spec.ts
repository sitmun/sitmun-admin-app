import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TasksEditComponent} from './tasks-edit.component';
import {CodeListService, TaskGroupService, TaskService, TranslationService} from '@app/domain';
import {ExternalService, ResourceService} from '@app/core/hal';
import {SitmunFrontendGuiModule} from '@app/frontend-gui/src/lib/public_api';
import {ExternalConfigurationService} from '@app/core/config/external-configuration.service';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialModule} from '@app/material-module';
import {RouterModule} from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatIconTestingModule} from '@angular/material/icon/testing';

describe('TasksEditComponent', () => {
  let component: TasksEditComponent;
  let fixture: ComponentFixture<TasksEditComponent>;
  let taskService: TaskService;
  let taskGroupService: TaskGroupService;
  let codeListService: CodeListService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksEditComponent],
      imports: [HttpClientTestingModule, SitmunFrontendGuiModule, RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule],
      providers: [TaskService, TaskGroupService, CodeListService, TranslationService, ResourceService, ExternalService,
        {provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService},]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksEditComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    taskGroupService = TestBed.inject(TaskGroupService);
    codeListService = TestBed.inject(CodeListService);
    translationService = TestBed.inject(TranslationService);
    resourceService = TestBed.inject(ResourceService);
    externalService = TestBed.inject(ExternalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should instantiate taskService', () => {
    expect(taskService).toBeTruthy();
  });

  it('should instantiate taskGroupService', () => {
    expect(taskGroupService).toBeTruthy();
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
});
