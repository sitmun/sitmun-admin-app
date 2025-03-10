import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BackgroundLayersComponent } from './background-layers.component';
import { BackgroundService,CartographyGroupService, CodeListService,TranslationService,ResourceService,ExternalService } from '@app/domain';
import { MaterialModule } from '@app/material-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('BackgroundLayersComponent', () => {
  let component: BackgroundLayersComponent;
  let fixture: ComponentFixture<BackgroundLayersComponent>;
  let backgroundService: BackgroundService;
  let codeListService: CodeListService;
  let resourceService: ResourceService;
  let externalService: ExternalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundLayersComponent ],
      imports : [HttpClientTestingModule, SitmunFrontendGuiModule, MatIconTestingModule, RouterTestingModule, MaterialModule, RouterModule],
      providers: [BackgroundService,CodeListService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundLayersComponent);
    component = fixture.componentInstance;
    backgroundService= TestBed.inject(BackgroundService);
    codeListService= TestBed.inject(CodeListService);
    resourceService= TestBed.inject(ResourceService);
    externalService= TestBed.inject(ExternalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should instantiate backgroundService', () => {
    expect(backgroundService).toBeTruthy();
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
