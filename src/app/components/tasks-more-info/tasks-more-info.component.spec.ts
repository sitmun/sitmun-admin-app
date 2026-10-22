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
import { CodeListService, TaskService, TranslationService } from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { magic } from '@environments/constants';

import { TasksMoreInfoComponent } from './tasks-more-info.component';

describe('TasksMoreInfoComponent', () => {
  let component: TasksMoreInfoComponent;
  let fixture: ComponentFixture<TasksMoreInfoComponent>;

  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksMoreInfoComponent, EntityListComponent ],
      imports : [SitmunFrontendGuiModule, MaterialModule, RouterModule, MatIconTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })],
      providers: [
        CodeListService,
        TaskService,
        TranslationService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    })
    .compileComponents();
  });

  beforeEach(async () => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TasksMoreInfoComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    httpMock.match((req) => req.url.includes('tasks')).forEach((req) =>
      req.flush({ _embedded: { tasks: [] } })
    );
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists more-info tasks and opens a new more-info task form', async () => {
    expect(component.entityListConfig.entityLabel).toBe(Configuration.TASK_MORE_INFO.labelPlural);
    const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    await component.newData();
    expect(navigate).toHaveBeenCalledWith(['tasksMoreInfo', -1, magic.taskMoreInfoTypeId]);
  });

});
