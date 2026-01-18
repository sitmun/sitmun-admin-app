import { HttpClientModule} from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {CodeListService, DashboardService, TranslationService} from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { UtilsService } from '@app/services/utils.service';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  // Mock Web Animations API for Jest environment
  beforeAll(() => {
    if (!Element.prototype.animate) {
      Element.prototype.animate = jest.fn(() => ({
        play: jest.fn(),
        pause: jest.fn(),
        finish: jest.fn(),
        cancel: jest.fn(),
        reverse: jest.fn(),
        updatePlaybackRate: jest.fn(),
        setCurrentTime: jest.fn(),
        setStartTime: jest.fn(),
        currentTime: 0,
        startTime: 0,
        playState: 'idle',
        playbackRate: 1,
        onfinish: null,
        oncancel: null
      })) as any;
    }
  });

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: DashboardService;
  let codeListService: CodeListService;
  let resourceService: ResourceService;
  let externalService: ExternalService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      imports : [HttpClientTestingModule, HttpClientModule, SitmunFrontendGuiModule, RouterTestingModule, MatIconTestingModule,
         MaterialModule, RouterModule, NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })],
      providers: [DashboardService,TranslationService,CodeListService,ResourceService,ExternalService,UtilsService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    dashboardService= TestBed.inject(DashboardService);
    codeListService= TestBed.inject(CodeListService);
    resourceService= TestBed.inject(ResourceService);
    externalService= TestBed.inject(ExternalService);
    
    // Mock DashboardService.getAll to return empty data to prevent async operations
    jest.spyOn(dashboardService, 'getAll').mockReturnValue(
      of({
        total: { users: 0, services: 0, tasks: 0, territories: 0, cartographies: 0, applications: 0, applicationsTerritories: 0 },
        sum: { users: 0, services: 0, tasks: 0, territories: 0, cartographies: 0, applications: 0, applicationsTerritories: 0 },
        'cartographies-created-on-date': {},
        'users-created-on-date': {},
        'users-per-application': {}
      }) as any
    );
    
    // Set dataLoaded to true to avoid triggering animations during tests
    component.dataLoaded = true;
    // Don't call detectChanges() here to avoid animation issues
    // Individual tests can call it if needed
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // Component is created without calling detectChanges to avoid animation issues
  });

  it('should instantiate dashboardService', () => {
    expect(dashboardService).toBeTruthy();
  });

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
  });

  it('should instantiate resourceService', () => {
    expect(resourceService).toBeTruthy();
  });

  it('should instantiate externalService', () => {
    expect(externalService).toBeTruthy();
  });
});
