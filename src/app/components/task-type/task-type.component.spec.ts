import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';
import { CodeListService, TaskTypeService, TranslationService } from '@app/domain';
import { LoggerService } from '@app/services/logger.service';
import { UtilsService } from '@app/services/utils.service';
import { configureLoggerForTests, provideErrorHandlerForTests } from '@app/testing/test-helpers';

import { TaskTypeComponent } from './task-type.component';

describe('TaskTypeComponent', () => {
  let component: TaskTypeComponent;
  let fixture: ComponentFixture<TaskTypeComponent>;
  let taskTypeService: TaskTypeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskTypeComponent],
      imports: [
        MatDialogModule,
        MatIconTestingModule,
        RouterModule.forRoot([]),
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
        UtilsService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskTypeComponent);
    component = fixture.componentInstance;
    configureLoggerForTests(TestBed.inject(LoggerService));
    taskTypeService = TestBed.inject(TaskTypeService);
  });

  afterEach(() => fixture?.destroy());

  it('infinite list requests task type titles with UI lang so backend @I18n applies', (done) => {
    jest.spyOn(taskTypeService, 'fetchPage').mockReturnValue(of({
      rows: [],
      pageNumber: 0,
      pageSize: 100,
      totalElements: 0,
      totalPages: 0,
    }));

    component.entityListConfig.infiniteBlockFetcher!({
      page: 0,
      size: 100,
      sort: [],
    }).subscribe(() => {
      expect(taskTypeService.fetchPage).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.arrayContaining([
            expect.objectContaining({key: 'lang', value: expect.any(String)}),
          ]),
        })
      );
      done();
    });
  });
});
