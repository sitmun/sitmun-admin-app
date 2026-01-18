import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';

import {ExternalConfigurationService} from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {
  CapabilitiesService,
  CartographyService,
  CodeListService,
  ServiceService,
  TaskService,
  TranslationService,
  TreeNodeService
} from '@app/domain';
import {SitmunFrontendGuiModule} from '@app/frontend-gui/src/lib/public_api';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

import {TreeNodesComponent} from './tree-nodes.component';

describe('TreeNodesComponent', () => {
  let component: TreeNodesComponent;
  let fixture: ComponentFixture<TreeNodesComponent>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    // Mock console.error to prevent console output during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    await TestBed.configureTestingModule({
      declarations: [TreeNodesComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
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
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TreeNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

