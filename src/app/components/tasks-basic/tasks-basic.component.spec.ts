import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideRouter, Router, RouterModule } from '@angular/router';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';

import {EntityListComponent} from '@app/components/shared/entity-list/entity-list.component';
import { Configuration } from '@app/core/config/configuration';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {CodeListService, TaskGroupService, TaskService, TranslationService} from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { config } from '@config';

import { TasksBasicComponent } from './tasks-basic.component';

describe('TasksBasicComponent', () => {
  let component: TasksBasicComponent;
  let fixture: ComponentFixture<TasksBasicComponent>;

  let httpMock: HttpTestingController;

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [ TasksBasicComponent, EntityListComponent ],
      imports : [SitmunFrontendGuiModule, MaterialModule, RouterModule, MatIconTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })],
      providers: [TaskService,TaskGroupService, CodeListService,TranslationService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ]
    })
    .compileComponents();
  });

  beforeEach(async () => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TasksBasicComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    httpMock.match((req) => req.url.includes('tasks')).forEach((req) =>
      req.flush({ _embedded: { tasks: [] } })
    );
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture?.destroy();
    httpMock.verify();
  });

  afterAll(() => TestBed.resetTestingModule());

  it('lists basic tasks and opens a new basic task form', async () => {
    expect(component.entityListConfig.entityLabel).toBe(Configuration.TASK_BASIC.labelPlural);
    const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    await component.newData();
    expect(navigate).toHaveBeenCalledWith(['taskBasic', -1, config.tasksTypes.basic]);
  });

});
