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
import { BackgroundService, CodeListService } from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';

import { BackgroundLayersComponent } from './background-layers.component';

describe('BackgroundLayersComponent', () => {
  let component: BackgroundLayersComponent;
  let fixture: ComponentFixture<BackgroundLayersComponent>;

  let httpMock: HttpTestingController;

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [ BackgroundLayersComponent, EntityListComponent ],
      imports : [SitmunFrontendGuiModule, MatIconTestingModule, MaterialModule, RouterModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })],
      providers: [BackgroundService,CodeListService,ResourceService,ExternalService,
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
    fixture = TestBed.createComponent(BackgroundLayersComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    httpMock.match((req) => req.url.includes('backgrounds')).forEach((req) =>
      req.flush({ _embedded: { backgrounds: [] } })
    );
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture?.destroy();
    httpMock.verify();
  });

  afterAll(() => TestBed.resetTestingModule());

  it('lists background layers and opens a new background layer form', async () => {
    expect(component.entityListConfig.entityLabel).toBe(Configuration.BACKGROUND_LAYER.labelPlural);
    const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    await component.newData();
    expect(navigate).toHaveBeenCalledWith(['backgroundLayers', -1, 'backgroundLayersForm']);
  });

});
