import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideRouter, Router } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { EntityListComponent } from '@app/components/shared/entity-list/entity-list.component';
import { Configuration } from '@app/core/config/configuration';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';
import { CodeListService, TaskType, TaskTypeService, TranslationService } from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { UtilsService } from '@app/services/utils.service';

import { TaskTypeComponent } from './task-type.component';
import { formatTaskTypeIdentifier } from './task-type.util';

describe('TaskTypeComponent', () => {
  let component: TaskTypeComponent;
  let fixture: ComponentFixture<TaskTypeComponent>;
  let router: Router;
  let taskTypeService: TaskTypeService;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [TaskTypeComponent, EntityListComponent],
      imports: [
        SitmunFrontendGuiModule,
        MaterialModule,
        MatIconTestingModule,
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
        CodeListService,
        TaskTypeService,
        TranslationService,
        ResourceService,
        ExternalService,
        UtilsService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTypeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    taskTypeService = TestBed.inject(TaskTypeService);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    fixture?.destroy();
    jest.restoreAllMocks();
  });

  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses TASK_TYPE configuration and default order sorting', () => {
    expect(component.entityListConfig.entityLabel).toBe(Configuration.TASK_TYPE.labelPlural);
    expect(component.entityListConfig.iconName).toBe(Configuration.TASK_TYPE.icon);
    expect(component.entityListConfig.defaultColumnSorting).toEqual(['order']);
    expect(component.entityListConfig.gridOptions.newButton).toBe(false);
    expect(component.entityListConfig.gridOptions.deleteButton).toBe(false);
    expect(component.entityListConfig.gridOptions.hideDuplicateButton).toBe(true);
    expect(component.entityListConfig.gridOptions.applyChangesButton).toBe(false);
  });

  it('postFetchData builds checkbox, identifier link, and title columns', async () => {
    await component.postFetchData();

    expect(component.entityListConfig.columnDefs).toHaveLength(3);
    expect(component.entityListConfig.columnDefs[0].field).toBe('__loadingSelection');
    expect(component.entityListConfig.columnDefs[1].field).toBe('id');
    expect(component.entityListConfig.columnDefs[2].field).toBe('title');
  });

  it('formats identifier values as 0 and 5 (consulta)', async () => {
    await component.postFetchData();
    const idCol = component.entityListConfig.columnDefs[1];

    expect(idCol.valueGetter({ data: { id: 0, name: null } })).toBe(formatTaskTypeIdentifier(0));
    expect(idCol.valueGetter({ data: { id: 5, name: 'consulta' } })).toBe(formatTaskTypeIdentifier(5, 'consulta'));
  });

  it('delegates update and delete to TaskTypeService', async () => {
    const entity = { id: 5, name: 'consulta', title: 'Query' } as TaskType;
    const updateSpy = jest.spyOn(taskTypeService, 'update').mockReturnValue(of(entity));
    const deleteSpy = jest.spyOn(taskTypeService, 'delete').mockReturnValue(of(undefined));

    await component.dataUpdateFn(entity);
    await component.dataDeleteFn(entity);

    expect(updateSpy).toHaveBeenCalledWith(entity);
    expect(deleteSpy).toHaveBeenCalledWith(entity);
  });
});
