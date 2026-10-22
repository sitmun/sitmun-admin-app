import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import {EntityFormAlertsComponent} from '@app/components/shared/entity-form-alerts/entity-form-alerts.component';
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

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [ TaskGroupFormComponent, FormToolbarComponent ],
      imports: [FormsModule, ReactiveFormsModule,RouterModule.forRoot([], {}), SitmunFrontendGuiModule, EntityFormAlertsComponent, MaterialModule, RouterModule, MatIconTestingModule, BrowserAnimationsModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: () => ({
            getTranslation: () => of({})
          })
        }
      })],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideErrorHandlerForTests(), TaskGroupService, TaskService, CodeListService,TranslationService,ResourceService,ExternalService,
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

    if (!component.entityForm) {
      component.entityToEdit = component.empty();
      component.postFetchData();
    }
    fixture.detectChanges();
  });

  afterEach(() => fixture?.destroy());
  afterAll(() => TestBed.resetTestingModule());

  

  it('tasksTable relations request typeTitle with UI lang so backend @I18n applies', () => {
    component.entityID = 5;
    jest.spyOn(component, 'isNewOrDuplicated').mockReturnValue(false);
    const spy = jest.spyOn(taskService, 'fetchProjectionItemsByQueryString').mockReturnValue(of([]));

    component['tasksTable'].relationsFetchFn();

    expect(spy).toHaveBeenCalledWith(
      TaskProjection,
      'group.id=5',
      expect.objectContaining({
        params: expect.arrayContaining([
          expect.objectContaining({key: 'lang', value: expect.any(String)}),
        ]),
      })
    );
  });

  it('tasksTable targets request typeTitle with UI lang so backend @I18n applies', () => {
    const spy = jest.spyOn(taskService, 'fetchProjectionItems').mockReturnValue(of([]));

    (component['tasksTable'] as unknown as {targetsFetchFn: () => unknown}).targetsFetchFn();

    expect(spy).toHaveBeenCalledWith(
      TaskProjection,
      expect.objectContaining({
        params: expect.arrayContaining([
          expect.objectContaining({key: 'lang', value: expect.any(String)}),
        ]),
      })
    );
  });

  it('requires a name', () => {
    expect(component.entityForm.get('name')?.hasError('required')).toBe(true);
  });

  it('accepts a name', () => {
    component.entityForm.patchValue({
      name: 'name',
    });
    expect(component.entityForm.valid).toBe(true);
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
