import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideRouter, RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { EntityListComponent } from '@app/components/shared/entity-list/entity-list.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';
import { CodeListService, LanguageService, TranslationService } from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';

import { LanguageComponent } from './language.component';

describe('LanguageComponent', () => {
  let component: LanguageComponent;
  let fixture: ComponentFixture<LanguageComponent>;
  let httpMock: HttpTestingController;
  let translateService: TranslateService;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [LanguageComponent, EntityListComponent],
      imports: [
        SitmunFrontendGuiModule,
        MaterialModule,
        RouterModule,
        MatIconTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({
                'lang.ca': 'Català',
                'entity.language.endonym': 'Endonym',
                'entity.language.label': 'Language',
                'entity.language.order': 'Order',
              }),
            }),
          },
        }),
      ],
      providers: [
        LanguageService,
        CodeListService,
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
    translateService = TestBed.inject(TranslateService);
    translateService.use('en');
    fixture = TestBed.createComponent(LanguageComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.languageService, 'getCurrentDefaultLanguage').mockReturnValue(of('en'));
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    httpMock.match((req) => req.url.includes('languages')).forEach((req) =>
      req.flush({ _embedded: { languages: [] } })
    );
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture?.destroy();
    httpMock.verify();
  });

  afterAll(() => TestBed.resetTestingModule());

  it('lists endonym, UI-locale name, enabled, then order', async () => {
    await component.postFetchData();
    const fields = component.entityListConfig.columnDefs
      .slice(1)
      .map((col: { field?: string }) => col.field);
    expect(fields).toEqual(['name', 'translatedName', 'enabled', 'order']);

    const uiLocaleCol = component.entityListConfig.columnDefs[2] as {
      valueGetter: (params: { data: { shortname: string } }) => string;
    };
    expect(uiLocaleCol.valueGetter({ data: { shortname: 'ca' } })).toBe('Català');
  });
});
