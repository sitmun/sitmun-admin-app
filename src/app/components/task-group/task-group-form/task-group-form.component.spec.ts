import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import {FormToolbarComponent} from '@app/components/shared/form-toolbar/form-toolbar.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {CodeListService, TaskGroupService, TaskProjection, TaskService, TranslationService} from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import {LoggerService} from '@app/services/logger.service';
import {configureLoggerForTests, provideErrorHandlerForTests} from '@app/testing/test-helpers';
import {constants} from '@environments/constants';

import { TaskGroupFormComponent } from './task-group-form.component';

describe('TaskGroupFormComponent', () => {
  let component: TaskGroupFormComponent;
  let fixture: ComponentFixture<TaskGroupFormComponent>;
  let taskGroupService: TaskGroupService;
  let taskService: TaskService;
  let codeListService: CodeListService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [ TaskGroupFormComponent, FormToolbarComponent ],
      imports: [FormsModule, ReactiveFormsModule,RouterModule.forRoot([], {}), SitmunFrontendGuiModule, MaterialModule, RouterModule, MatIconTestingModule, BrowserAnimationsModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: () => ({
            getTranslation: () => of({})
          })
        }
      })],
      providers: [provideErrorHandlerForTests(), TaskGroupService, TaskService, CodeListService,TranslationService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskGroupFormComponent);
    component = fixture.componentInstance;
    // Suppress debug logs in tests to reduce console noise
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    taskGroupService= TestBed.inject(TaskGroupService);
    taskService = TestBed.inject(TaskService);
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

  afterEach(() => fixture?.destroy());
  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('form invalid when empty', () => {
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form valid', () => {
    component.entityForm.patchValue({
      name: 'name'
    })
    expect(component.entityForm.valid).toBeTruthy();
  });

  it('Task group form fields', () => {
    expect(component.entityForm.get('name')).toBeTruthy();
  });

  describe('Grid capability classification', () => {
    it('tasksTable should have picker-add, updater, and status capabilities', () => {
      const table = component['tasksTable'];
      expect(table.hasPickerAdd()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.hasTemplateDialogs()).toBe(false);
      expect(table.supportsDuplicate()).toBe(false);
    });
  });

  describe('tasks relation updater', () => {
    it('assigns group on create and clears group on delete', async () => {
      component.entityID = 42;
      const groupProxy = { id: 42 };
      jest.spyOn(taskGroupService, 'createProxy').mockReturnValue(groupProxy as any);

      const updateRelationEx = jest.fn().mockReturnValue(of(null));
      jest.spyOn(taskService, 'get').mockReturnValue(of({ updateRelationEx } as any));

      const pendingTask = Object.assign(new TaskProjection(), {
        id: 7,
        name: 'Task A',
        status: constants.entityStatus.pendingCreation,
      });
      const removedTask = Object.assign(new TaskProjection(), {
        id: 8,
        name: 'Task B',
        status: constants.entityStatus.pendingDelete,
      });

      await component['tasksTable'].handleSaveRelations({
        event: 'save',
        data: [pendingTask as any, removedTask as any],
      });

      expect(taskGroupService.createProxy).toHaveBeenCalledWith(42);
      expect(taskService.get).toHaveBeenCalledWith(7);
      expect(taskService.get).toHaveBeenCalledWith(8);
      expect(updateRelationEx).toHaveBeenCalledWith('group', groupProxy);
      expect(updateRelationEx).toHaveBeenCalledWith('group', null);
    });
  });
});
