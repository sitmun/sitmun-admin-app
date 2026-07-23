import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { FormToolbarComponent } from '@app/components/shared/form-toolbar/form-toolbar.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';
import {
  CodeListService, RoleService, TaskAvailabilityService, TaskService,
  TerritoryService, TranslationService, TaskUIService, TaskTypeService,
  TaskGroupService, ConnectionService, CartographyService, TaskProjection
} from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { LoggerService } from '@app/services/logger.service';
import { configureLoggerForTests, provideErrorHandlerForTests } from '@app/testing/test-helpers';

import { TaskQueryFormComponent } from './task-query-form.component';

describe('TaskQueryFormComponent', () => {
  let component: TaskQueryFormComponent;
  let fixture: ComponentFixture<TaskQueryFormComponent>;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [TaskQueryFormComponent, FormToolbarComponent],
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
              getTranslation: () => of({})
            })
          }
        })
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideErrorHandlerForTests(),
        TaskService,
        TaskUIService,
        TaskTypeService,
        TaskGroupService,
        ConnectionService,
        CartographyService,
        RoleService,
        TerritoryService,
        TaskAvailabilityService,
        CodeListService,
        TranslationService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskQueryFormComponent);
    component = fixture.componentInstance;
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    component.entityToEdit = component.empty();
    component.postFetchData();
    fixture.detectChanges();
  });

  const createComponent = () => {
    const translateService = (component as any).translateService;
    jest.spyOn(translateService, 'instant').mockImplementation((key: string, params?: Record<string, unknown>) => {
      const firstParam = Object.values(params || {})[0];
      return typeof firstParam === 'string' ? `${key}|${firstParam}` : key;
    });
    return component;
  };

  afterEach(() => fixture?.destroy());
  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Grid capability classification', () => {
    it('rolesTable should have picker, updater, and status capabilities', () => {
      const table = component['rolesTable'];
      expect(table.hasPickerAdd()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.hasTemplateDialogs()).toBe(false);
    });

    it('availabilitiesTable should have picker, updater, and status capabilities', () => {
      const table = component['availabilitiesTable'];
      expect(table.hasPickerAdd()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.hasTemplateDialogs()).toBe(false);
    });

    it('parametersTable should have template-dialog, updater, status, and duplicate capabilities', () => {
      const table = component['parametersTable'];
      expect(table.hasTemplateDialogs()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.supportsDuplicate()).toBe(true);
      expect(table.hasPickerAdd()).toBe(false);
    });
  });

  it('blocks save and shows deterministic warning when command placeholders are undeclared', () => {
    const component = createComponent();
    component.entityToEdit = TaskProjection.fromObject({
      id: 10,
      name: 'query',
      properties: {
        command: 'https://example.com/${zeta}?layer={alpha}&app=#{APP_ID}&territory=#{territory.id}&repeat={alpha}',
        parameters: [],
      },
    });
    component.entityForm = new FormGroup({
      name: new FormControl('query'),
      scope: new FormControl('web-api-query'),
      command: new FormControl('https://example.com/${zeta}?layer={alpha}&app=#{APP_ID}&territory=#{territory.id}&repeat={alpha}'),
      connectionId: new FormControl(null),
      cartographyId: new FormControl(null),
      taskGroupId: new FormControl(1),
    });
    component.entityForm.markAsDirty();

    expect((component as any).customWarningMessage).toBe('entity.task.query.missingDeclaredParameters|alpha, zeta');
    expect(component.canSaveEntity).toBe(false);
    expect(component.canSave()).toBe(false);
  });

  it('uses pending parameter grid rows to validate command placeholders', () => {
    const component = createComponent();
    component.entityToEdit = TaskProjection.fromObject({
      id: 10,
      name: 'query',
      properties: {
        command: 'https://example.com/{layerid}/${featureid}',
        parameters: [],
      },
    });
    component.entityForm = new FormGroup({
      name: new FormControl('query'),
      scope: new FormControl('URL'),
      command: new FormControl('https://example.com/{layerid}/${featureid}'),
      connectionId: new FormControl(null),
      cartographyId: new FormControl(null),
      taskGroupId: new FormControl(1),
    });
    component.entityForm.markAsDirty();
    (component as any).parametersGrid = {
      rowData: [
        { name: 'featureid' },
        { name: 'layerid', status: 'pendingRegistration' },
      ],
    };

    expect((component as any).customWarningMessage).toBe('');
    expect(component.canSave()).toBe(true);
    expect(component.canSaveEntity).toBe(true);
  });

  it('ignores parameters pending delete when validating command placeholders', () => {
    const component = createComponent();
    component.entityToEdit = TaskProjection.fromObject({
      id: 10,
      name: 'query',
      properties: {
        command: 'https://example.com/{layerid}',
        parameters: [],
      },
    });
    component.entityForm = new FormGroup({
      name: new FormControl('query'),
      scope: new FormControl('URL'),
      command: new FormControl('https://example.com/{layerid}'),
      connectionId: new FormControl(null),
      cartographyId: new FormControl(null),
      taskGroupId: new FormControl(1),
    });
    component.entityForm.markAsDirty();
    (component as any).parametersGrid = {
      rowData: [
        { name: 'layerid', status: 'pendingDelete' },
      ],
    };

    expect((component as any).customWarningMessage).toBe('entity.task.query.missingDeclaredParameters|layerid');
    expect(component.canSave()).toBe(false);
  });

  it('treats loaded but empty parameter grid as empty instead of falling back to persisted properties', () => {
    const component = createComponent();
    component.entityToEdit = TaskProjection.fromObject({
      id: 10,
      name: 'query',
      properties: {
        command: 'https://example.com/{layerid}',
        parameters: [
          { name: 'layerid' },
        ],
      },
    });
    component.entityForm = new FormGroup({
      name: new FormControl('query'),
      scope: new FormControl('web-api-query'),
      command: new FormControl('https://example.com/{layerid}'),
      connectionId: new FormControl(null),
      cartographyId: new FormControl(null),
      taskGroupId: new FormControl(1),
    });
    component.entityForm.markAsDirty();
    (component as any).parametersGrid = {
      rowData: [],
    };

    expect((component as any).customWarningMessage).toBe('entity.task.query.missingDeclaredParameters|layerid');
    expect(component.canSaveEntity).toBe(false);
  });

  it('rejects save click path when command placeholders are missing', async () => {
    const component = createComponent();
    component.entityToEdit = TaskProjection.fromObject({
      id: 10,
      name: 'query',
      properties: {
        command: 'https://example.com/{layerid}',
        parameters: [],
      },
    });
    component.entityForm = new FormGroup({
      name: new FormControl('query'),
      scope: new FormControl('web-api-query-no-proxy'),
      command: new FormControl('https://example.com/{layerid}'),
      connectionId: new FormControl(null),
      cartographyId: new FormControl(null),
      taskGroupId: new FormControl(1),
    });
    component.entityForm.markAsDirty();
    const saveEntitySpy = jest.spyOn(component, 'saveEntity').mockResolvedValue(undefined);
    jest.spyOn(component, 'fetchOriginal').mockResolvedValue(component.entityToEdit);

    const result = await component.onSaveButtonClicked();

    expect(result).toBe(false);
    expect(saveEntitySpy).not.toHaveBeenCalled();
  });
});
