import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';

import {MessagesInterceptorStateService} from '@app/core/interceptors/messages.interceptor';
import {CodeListService} from '@app/domain/codelist/services/codelist.service';
import {Language} from '@app/domain/translation/models/language.model';
import {LanguageService} from '@app/domain/translation/services/language.service';
import {TranslationService} from '@app/domain/translation/services/translation.service';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {config} from '@config';

import {LanguageFormComponent} from './language-form.component';
import {DefaultLanguageChangeDialogComponent} from '../default-language-change-dialog/default-language-change-dialog.component';

describe('LanguageFormComponent', () => {
  let component: LanguageFormComponent;
  let fixture: ComponentFixture<LanguageFormComponent>;
  let languageService: jest.Mocked<LanguageService>;
  let translateService: jest.Mocked<TranslateService>;
  let dialog: jest.Mocked<MatDialog>;
  let originalDefaultLang: string;

  const english = {id: 1, shortname: 'en', name: 'English'} as Language;
  const catalan = {id: 2, shortname: 'ca', name: 'Catalan'} as Language;

  beforeEach(async () => {
    languageService = {
      getCurrentDefaultLanguage: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      get: jest.fn(),
      fetchAllRawItems: jest.fn()
    } as any;
    translateService = {
      instant: jest.fn(),
      setDefaultLang: jest.fn(),
      use: jest.fn()
    } as any;
    dialog = {
      open: jest.fn()
    } as any;

    languageService.getCurrentDefaultLanguage.mockReturnValue(of('en'));
    languageService.fetchAllRawItems.mockReturnValue(of([english, catalan]));
    translateService.instant.mockImplementation((key: string) => key);
    translateService.use.mockReturnValue(of({}));
    originalDefaultLang = config.defaultLang;

    await TestBed.configureTestingModule({
      declarations: [LanguageFormComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        {provide: LanguageService, useValue: languageService},
        {provide: TranslateService, useValue: translateService},
        {provide: MatDialog, useValue: dialog},
        {provide: TranslationService, useValue: {}},
        {provide: CodeListService, useValue: {}},
        {provide: LoggerService, useValue: {}},
        {provide: ErrorHandlerService, useValue: {handleError: jest.fn()}},
        {provide: ActivatedRoute, useValue: {params: of({})}},
        {provide: Router, useValue: {navigate: jest.fn()}},
        {provide: LoadingOverlayService, useValue: {}},
        {provide: MessagesInterceptorStateService, useValue: {}},
        {provide: UtilsService, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageFormComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    config.defaultLang = originalDefaultLang;
  });

  function loadLanguage(language: Language): void {
    component.entityID = language.id;
    component.entityToEdit = language;
    component.currentDefaultLanguage = 'en';
    component.currentDefaultLanguageName = 'English';
    component.postFetchData();
    component.dataLoaded = true;
  }

  it('marks the current default language in the form title', () => {
    loadLanguage(english);

    expect(component.isDefaultLanguage).toBe(true);
    expect(component.itemName('')).toBe('English (en) ★');
  });

  it('disables the language code for existing languages', () => {
    loadLanguage(catalan);

    expect(component.entityForm.get('shortname')?.disabled).toBe(true);
  });

  it('keeps the language code editable for new languages', () => {
    component.entityID = -1;
    component.entityToEdit = new Language();
    component.currentDefaultLanguage = 'en';

    component.postFetchData();

    expect(component.entityForm.get('shortname')?.enabled).toBe(true);
  });

  it('enables set-as-default for saved non-default languages without pending changes', () => {
    loadLanguage(catalan);

    expect(component.isDefaultLanguage).toBe(false);
    expect(component.canSetAsDefault).toBe(true);
  });

  it('does not allow setting the current default language as default again', () => {
    loadLanguage(english);

    expect(component.canSetAsDefault).toBe(false);
  });

  it('does not allow changing default language with unsaved edits', () => {
    loadLanguage(catalan);

    component.entityForm.get('name')?.setValue('Català');
    component.entityForm.markAsDirty();

    expect(component.canSetAsDefault).toBe(false);
  });

  it('opens the migration dialog from the language form', async () => {
    const dialogRef = {
      afterClosed: () => of({success: false})
    } as MatDialogRef<DefaultLanguageChangeDialogComponent>;
    dialog.open.mockReturnValue(dialogRef);
    loadLanguage(catalan);

    await component.setAsDefault();

    expect(dialog.open).toHaveBeenCalledWith(DefaultLanguageChangeDialogComponent, {
      width: '600px',
      data: {
        from: 'en',
        fromName: 'English',
        to: 'ca',
        toName: 'Catalan',
        languageService
      }
    });
  });

  it('does not save the language when opening the default-change dialog', async () => {
    const dialogRef = {
      afterClosed: () => of({success: false})
    } as MatDialogRef<DefaultLanguageChangeDialogComponent>;
    dialog.open.mockReturnValue(dialogRef);
    loadLanguage(catalan);

    await component.setAsDefault();

    expect(languageService.update).not.toHaveBeenCalled();
    expect(languageService.create).not.toHaveBeenCalled();
  });

  it('prevents default click behavior when opening the default-change dialog', async () => {
    const dialogRef = {
      afterClosed: () => of({success: false})
    } as MatDialogRef<DefaultLanguageChangeDialogComponent>;
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn()
    } as unknown as Event;
    dialog.open.mockReturnValue(dialogRef);
    loadLanguage(catalan);

    await component.setAsDefault(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('updates the database default language state without changing the client locale', async () => {
    const dialogRef = {
      afterClosed: () => of({success: true, newDefault: 'ca'})
    } as MatDialogRef<DefaultLanguageChangeDialogComponent>;
    dialog.open.mockReturnValue(dialogRef);
    localStorage.setItem('lang', 'en');
    loadLanguage(catalan);

    await component.setAsDefault();

    expect(component.currentDefaultLanguage).toBe('ca');
    expect(component.currentDefaultLanguageName).toBe('Catalan');
    expect(component.defaultLang).toBe('ca');
    expect(config.defaultLang).toBe('ca');
    expect(localStorage.getItem('lang')).toBe('en');
    expect(translateService.setDefaultLang).not.toHaveBeenCalled();
    expect(translateService.use).not.toHaveBeenCalled();
  });
});
