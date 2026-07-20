import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { FormToolbarComponent } from '@app/components/shared/form-toolbar/form-toolbar.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';
import { CodeListService, LanguageService, TranslationService } from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { LoggerService } from '@app/services/logger.service';
import { configureLoggerForTests, provideErrorHandlerForTests } from '@app/testing/test-helpers';

import { LanguageFormComponent } from './language-form.component';

describe('LanguageFormComponent', () => {
  let component: LanguageFormComponent;
  let fixture: ComponentFixture<LanguageFormComponent>;
  let translationService: TranslationService;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [LanguageFormComponent, FormToolbarComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([], {}),
        SitmunFrontendGuiModule,
        MaterialModule,
        MatIconTestingModule,
        BrowserAnimationsModule,
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
        provideHttpClient(),
        provideHttpClientTesting(),
        provideErrorHandlerForTests(),
        LanguageService,
        CodeListService,
        TranslationService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageFormComponent);
    component = fixture.componentInstance;
    configureLoggerForTests(TestBed.inject(LoggerService));
    translationService = TestBed.inject(TranslationService);
    if (!component.entityForm) {
      component.entityToEdit = component.empty();
      component.postFetchData();
    }
    fixture.detectChanges();
  });

  afterEach(() => fixture?.destroy());
  afterAll(() => TestBed.resetTestingModule());

  it('loads Language.name translations for the dialog', async () => {
    component.entityToEdit = Object.assign(component.empty(), { id: 3, name: 'Català', shortname: 'ca' });
    component.initTranslations('Language', ['name']);
    const searchSpy = jest.spyOn(translationService, 'search').mockReturnValue(of([
      {
        id: 1,
        element: 3,
        column: 'Language.name',
        translation: 'Catalan',
        languageShortname: 'en',
      } as any,
    ]));

    await component.fetchRelatedData();

    expect(searchSpy).toHaveBeenCalledWith(
      'byElement',
      expect.objectContaining({
        params: expect.arrayContaining([
          expect.objectContaining({ key: 'element', value: '3' }),
          expect.objectContaining({ key: 'column', value: 'Language' }),
        ]),
      })
    );
  });

  it('saves Language.name translations after entity save', async () => {
    component.entityID = 3;
    component.entityToEdit = Object.assign(component.empty(), { id: 3, name: 'Català', shortname: 'ca', order: 1 });
    component.postFetchData();
    component.initTranslations('Language', ['name']);
    const saveSpy = jest.spyOn(component, 'saveTranslations').mockResolvedValue([]);

    await component.updateDataRelated(false);

    expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ id: 3, name: 'Català' }));
  });

  it('titles the form as endonym - UI locale name', () => {
    jest.spyOn(component['translateService'], 'instant').mockImplementation((key: string) => {
      if (key === 'lang.ca') {
        return 'Catalan';
      }
      return key;
    });
    component.entityToEdit = Object.assign(component.empty(), {
      id: 3,
      name: 'Català',
      shortname: 'ca',
      order: 1,
    });
    component.postFetchData();

    expect(component.itemName('')).toBe('Català - Catalan');
  });

  it('locks enabled on and blocks set-as-default when language is disabled', () => {
    component.dataLoaded = true;
    component.entityID = 3;
    component.currentDefaultLanguage = 'en';
    component.entityToEdit = Object.assign(component.empty(), {
      id: 3,
      name: 'Català',
      shortname: 'ca',
      order: 1,
      enabled: false,
    });
    component.postFetchData();

    expect(component.entityForm.get('enabled')?.value).toBe(false);
    expect(component.canSetAsDefault).toBe(false);

    component.currentDefaultLanguage = 'ca';
    component.entityToEdit.shortname = 'ca';
    component.postFetchData();
    expect(component.entityForm.get('enabled')?.value).toBe(true);
    expect(component.entityForm.get('enabled')?.disabled).toBe(true);
  });

  it('stays pristine after render so navigate-back does not prompt', async () => {
    component.dataLoaded = true;
    component.entityID = 3;
    component.currentDefaultLanguage = 'en';
    component.entityToEdit = Object.assign(component.empty(), {
      id: 3,
      name: 'Català',
      shortname: 'ca',
      order: 1,
      enabled: true,
    });
    component.postFetchData();
    component.initTranslations('Language', ['name']);
    jest.spyOn(translationService, 'search').mockReturnValue(of([]));
    await component.fetchRelatedData();
    component.afterFetch();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.entityForm.dirty).toBe(false);
    expect(component['hasPendingChanges']()).toBe(false);
    await expect(component.canDeactivate()).resolves.toBe(true);
  });
});
