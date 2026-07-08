import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { FormToolbarComponent } from '@app/components/shared/form-toolbar/form-toolbar.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';
import { CodeListService, TaskType, TaskTypeService, TranslationService } from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { LoggerService } from '@app/services/logger.service';
import { configureLoggerForTests, provideErrorHandlerForTests } from '@app/testing/test-helpers';

import { TaskTypeFormComponent } from './task-type-form.component';

describe('TaskTypeFormComponent', () => {
  let component: TaskTypeFormComponent;
  let fixture: ComponentFixture<TaskTypeFormComponent>;
  let taskTypeService: TaskTypeService;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [TaskTypeFormComponent, FormToolbarComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([], {}),
        SitmunFrontendGuiModule,
        MaterialModule,
        MatIconTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({}),
            }),
          },
        }),
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideErrorHandlerForTests(),
        TaskTypeService,
        CodeListService,
        TranslationService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTypeFormComponent);
    component = fixture.componentInstance;
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    taskTypeService = TestBed.inject(TaskTypeService);

    component.entityID = 5;
    component.entityToEdit = Object.assign(new TaskType(), {
      id: 5,
      name: 'consulta',
      title: 'Query',
      enabled: true,
      order: 4,
      parentId: null,
    });
    component.postFetchData();
  });

  afterEach(() => fixture?.destroy());
  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requires title in the form', () => {
    component.entityForm.get('title')?.setValue('');
    expect(component.entityForm.valid).toBe(false);
    component.entityForm.get('title')?.setValue('Query');
    expect(component.entityForm.valid).toBe(true);
  });

  it('keeps save disabled until the form is loaded and changed', () => {
    component.dataLoaded = false;
    expect(component.canSaveEntity).toBe(false);

    component.dataLoaded = true;
    expect(component.canSaveEntity).toBe(false);

    component.entityForm.get('title')?.setValue('Updated title');
    component.entityForm.markAsDirty();
    expect(component.canSaveEntity).toBe(true);
  });

  it('keeps save disabled for new task types', () => {
    component.entityID = -1;
    component.dataLoaded = true;
    component.entityForm.get('title')?.setValue('New title');
    component.entityForm.markAsDirty();
    expect(component.canSaveEntity).toBe(false);
  });

  it('loads translations for existing task types', async () => {
    const loadTranslationsSpy = jest.spyOn(component as any, 'loadTranslations').mockResolvedValue(undefined);

    await component.fetchRelatedData();

    expect(loadTranslationsSpy).toHaveBeenCalledWith(component.entityToEdit);
  });

  it('update preserves hidden system fields and only changes title', async () => {
    component.entityForm.get('title')?.setValue('Consulta');
    const updateSpy = jest.spyOn(taskTypeService, 'update').mockReturnValue(of(component.entityToEdit));

    await component.updateEntity();

    expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({
      id: 5,
      name: 'consulta',
      title: 'Consulta',
      enabled: true,
      order: 4,
      parentId: null,
    }));
  });

  it('persists translations on save via updateDataRelated', async () => {
    const saveTranslationsSpy = jest.spyOn(component, 'saveTranslations').mockResolvedValue([]);

    await component.updateDataRelated(false);

    expect(saveTranslationsSpy).toHaveBeenCalledWith(expect.objectContaining({
      id: 5,
      name: 'consulta',
      title: 'Query',
    }));
  });

  it('initializes TaskType.title translations via preFetchData', async () => {
    const initTranslationsSpy = jest.spyOn(component as any, 'initTranslations');

    await component.preFetchData();

    expect(initTranslationsSpy).toHaveBeenCalledWith('TaskType', ['title']);
  });

  it('uses title as item name in the toolbar', () => {
    expect(component.itemName('')).toBe('Query');
  });
});
