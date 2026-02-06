import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';
import {
  CapabilitiesService,
  CartographyService,
  CodeListService,
  ServiceService,
  TaskService,
  TranslationService,
  TreeNodeService
} from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { ErrorHandlerService } from '@app/services/error-handler.service';
import { LoadingOverlayService } from '@app/services/loading-overlay.service';
import { LoggerService } from '@app/services/logger.service';
import { UtilsService } from '@app/services/utils.service';

import { TreeNodesComponent } from './tree-nodes.component';

describe('TreeNodesComponent', () => {
  let component: TreeNodesComponent;
  let fixture: ComponentFixture<TreeNodesComponent>;
  let httpMock: HttpTestingController;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    await TestBed.configureTestingModule({
      declarations: [TreeNodesComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatCardModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        }),
        SitmunFrontendGuiModule
      ],
      providers: [
        TreeNodeService,
        TranslationService,
        CodeListService,
        CartographyService,
        TaskService,
        ServiceService,
        CapabilitiesService,
        ResourceService,
        ExternalService,
        LoggerService,
        LoadingOverlayService,
        UtilsService,
        ErrorHandlerService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
      .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TreeNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    const flushPending = (): void => {
      httpMock.match((req) => req.url.includes('codelist-values')).forEach((req) =>
        req.flush({ _embedded: { 'codelist-values': [] } })
      );
      httpMock.match((req) => req.url.includes('cartographies')).forEach((req) =>
        req.flush({ _embedded: { cartographies: [] } })
      );
      httpMock.match((req) => req.url.includes('tasks')).forEach((req) =>
        req.flush({ _embedded: { tasks: [] } })
      );
    };
    flushPending();
    await new Promise((r) => setTimeout(r, 0));
    flushPending();
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.match((req) => req.url.includes('codelist-values')).forEach((req) =>
      req.flush({ _embedded: { 'codelist-values': [] } })
    );
    httpMock.match((req) => req.url.includes('cartographies')).forEach((req) =>
      req.flush({ _embedded: { cartographies: [] } })
    );
    httpMock.match((req) => req.url.includes('tasks')).forEach((req) =>
      req.flush({ _embedded: { tasks: [] } })
    );
    httpMock.verify();
    consoleErrorSpy.mockRestore();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

