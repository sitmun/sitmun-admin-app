import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideRouter, RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { EntityListComponent } from '@app/components/shared/entity-list/entity-list.component';
import { Configuration } from '@app/core/config/configuration';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';
import { CodeListService, TaskService, TranslationService } from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { magic } from '@environments/constants';

import { TasksLocatorComponent } from './tasks-locator.component';

describe('TasksLocatorComponent', () => {
  let component: TasksLocatorComponent;
  let fixture: ComponentFixture<TasksLocatorComponent>;
  let taskService: TaskService;
  let codeListService: CodeListService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;
  let httpMock: HttpTestingController;

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [TasksLocatorComponent, EntityListComponent],
      imports: [
        SitmunFrontendGuiModule,
        MaterialModule,
        RouterModule,
        MatIconTestingModule,
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
        CodeListService,
        TaskService,
        TranslationService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();
  });

  beforeEach(async () => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TasksLocatorComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    codeListService = TestBed.inject(CodeListService);
    translationService = TestBed.inject(TranslationService);
    resourceService = TestBed.inject(ResourceService);
    externalService = TestBed.inject(ExternalService);
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    httpMock.match((req) => req.url.includes('codelist-values')).forEach((req) =>
      req.flush({ _embedded: { 'codelist-values': [] } })
    );
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture?.destroy();
    httpMock.verify();
  });

  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('uses locator task configuration and type id 4 filter', () => {
    expect(component.entityListConfig.entityLabel).toBe(Configuration.TASK_LOCATOR.labelPlural);
    expect(component.entityListConfig.iconName).toBe(Configuration.TASK_LOCATOR.icon);
    expect(component.entityListConfig.font).toBe(Configuration.TASK_LOCATOR.font);

    const fetchSpy = jest.spyOn(taskService, 'fetchAllItems').mockReturnValue(of([]));
    component.entityListConfig.dataFetchFn?.();

    expect(fetchSpy).toHaveBeenCalledWith(
      { params: [{ key: 'type.id', value: magic.taskLocatorTypeId }] },
      undefined,
      'tasks'
    );
  });

  it('postFetchData configures name column with locator route', async () => {
    await component.postFetchData();

    expect(component.entityListConfig.columnDefs).toHaveLength(2);
    expect((component.entityListConfig.columnDefs[1] as { field?: string }).field).toBe('name');
  });
});
