import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideRouter, RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { EntityListComponent } from '@app/components/shared/entity-list/entity-list.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';
import { CodeListService, TaskService, TranslationService } from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { config } from '@config';

import { TasksTemplateComponent } from './tasks-template.component';

describe('TasksTemplateComponent', () => {
  let component: TasksTemplateComponent;
  let fixture: ComponentFixture<TasksTemplateComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksTemplateComponent, EntityListComponent],
      imports: [
        SitmunFrontendGuiModule,
        MaterialModule,
        RouterModule,
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
        TaskService,
        TranslationService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TasksTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    httpMock.match((req) => req.url.includes('tasks')).forEach((req) =>
      req.flush({ _embedded: { tasks: [] } }),
    );
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to template creation route', async () => {
    const navigateSpy = jest.spyOn((component as any).router, 'navigate').mockResolvedValue(true);

    await component.newData();

    expect(navigateSpy).toHaveBeenCalledWith(['taskTemplate', -1, config.tasksTypes.template]);
  });
});
