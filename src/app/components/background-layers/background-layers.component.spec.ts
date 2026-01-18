import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';

import {EntityListComponent} from '@app/components/shared/entity-list/entity-list.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import { BackgroundService, CodeListService } from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';

import { BackgroundLayersComponent } from './background-layers.component';




describe('BackgroundLayersComponent', () => {
  let component: BackgroundLayersComponent;
  let fixture: ComponentFixture<BackgroundLayersComponent>;
  let backgroundService: BackgroundService;
  let codeListService: CodeListService;
  let resourceService: ResourceService;
  let externalService: ExternalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundLayersComponent, EntityListComponent ],
      imports : [HttpClientTestingModule, SitmunFrontendGuiModule, MatIconTestingModule, RouterTestingModule, MaterialModule, RouterModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })],
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
