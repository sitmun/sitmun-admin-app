import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import {CodeListService} from '@app/domain/codelist/services/codelist.service';
import {Language} from '@app/domain/translation/models/language.model';
import {LanguageService} from '@app/domain/translation/services/language.service';
import {TranslationService} from '@app/domain/translation/services/translation.service';
import { ErrorHandlerService } from '@app/services/error-handler.service';
import { LoadingOverlayService } from '@app/services/loading-overlay.service';
import { LoggerService } from '@app/services/logger.service';
import { UtilsService } from '@app/services/utils.service';

import { LanguageComponent } from './language.component';

describe('LanguageComponent', () => {
  let component: LanguageComponent;
  let fixture: ComponentFixture<LanguageComponent>;
  let mockLanguageService: jest.Mocked<LanguageService>;
  let mockTranslateService: jest.Mocked<TranslateService>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockErrorHandler: jest.Mocked<ErrorHandlerService>;
  let mockRouter: jest.Mocked<Router>;
  let mockUtils: jest.Mocked<UtilsService>;

  const mockEnglish: Language = {
    id: 1,
    shortname: 'en',
    name: 'English',
    _links: { self: { href: 'http://localhost/api/languages/1' } }
  } as Language;

  const mockCatalan: Language = {
    id: 2,
    shortname: 'ca',
    name: 'Catalan',
    _links: { self: { href: 'http://localhost/api/languages/2' } }
  } as Language;

  beforeEach(async () => {
    mockLanguageService = {
      getCurrentDefaultLanguage: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn()
    } as any;
    mockTranslateService = {
      get: jest.fn(),
      use: jest.fn()
    } as any;
    mockDialog = {
      open: jest.fn()
    } as any;
    mockErrorHandler = {
      handleError: jest.fn()
    } as any;
    mockRouter = {
      navigate: jest.fn()
    } as any;
    mockUtils = {
      getRouterLinkColumnDef: jest.fn(),
      getRowCheckboxColumnDef: jest.fn()
    } as any;

    // Setup default spy returns
    mockLanguageService.getCurrentDefaultLanguage.mockReturnValue(of('en'));
    mockTranslateService.get.mockReturnValue(of('Translated') as any);
    mockUtils.getRouterLinkColumnDef.mockReturnValue({
      field: 'name',
      headerName: 'Name'
    } as any);
    mockUtils.getRowCheckboxColumnDef.mockReturnValue({
      field: 'checkbox',
      headerName: ''
    } as any);

    await TestBed.configureTestingModule({
      declarations: [LanguageComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: LanguageService, useValue: mockLanguageService },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ErrorHandlerService, useValue: mockErrorHandler },
        { provide: Router, useValue: mockRouter },
        { provide: UtilsService, useValue: mockUtils },
        { provide: TranslationService, useValue: {} },
        { provide: CodeListService, useValue: {} },
        { provide: LoggerService, useValue: {} },
        { provide: LoadingOverlayService, useValue: {} },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageComponent);
    component = fixture.componentInstance;
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load default language before configuring columns', async () => {
      mockLanguageService.getCurrentDefaultLanguage.mockReturnValue(of('en'));

      await component.preFetchData();

      expect(mockLanguageService.getCurrentDefaultLanguage).toHaveBeenCalled();
      expect(component.currentDefaultLanguage).toBe('en');
    });

    it('should handle error when loading default language', async () => {
      const error = new Error('Failed to load');
      mockLanguageService.getCurrentDefaultLanguage.mockReturnValue(throwError(() => error));

      await component.preFetchData();

      expect(mockErrorHandler.handleError).toHaveBeenCalledWith(error);
    });
  });

  describe('column configuration', () => {
    beforeEach((done) => {
      component.currentDefaultLanguage = 'en';
      component.postFetchData().then(() => done());
    });

    it('should configure name column with default marker', () => {
      const nameCol = component.entityListConfig.columnDefs.find((col: any) => col.field === 'name');
      expect(nameCol).toBeDefined();

      const defaultLangValue = nameCol.valueGetter({ data: mockEnglish });
      expect(defaultLangValue).toContain('★');

      const nonDefaultLangValue = nameCol.valueGetter({ data: mockCatalan });
      expect(nonDefaultLangValue).not.toContain('★');
    });

    it('should show tooltip for default language', () => {
      const nameCol = component.entityListConfig.columnDefs.find((col: any) => col.field === 'name');
      
      const defaultTooltip = nameCol.tooltipValueGetter({ 
        data: mockEnglish,
        value: 'English (en) ★'
      });
      expect(defaultTooltip).toContain('Default database language');

      const nonDefaultTooltip = nameCol.tooltipValueGetter({ 
        data: mockCatalan,
        value: 'Catalan (ca)'
      });
      expect(nonDefaultTooltip).toBe('Catalan (ca)');
    });

    it('should not configure an unsupported actions column', () => {
      const actionsCol = component.entityListConfig.columnDefs.find((col: any) => col.field === 'actions');
      expect(actionsCol).toBeUndefined();
    });
  });

  describe('navigation methods', () => {
    it('should navigate to new language form', async () => {
      await component.newData();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['language', -1, 'languageForm']);
    });

    it('should navigate to duplicate language form', async () => {
      await component.duplicateItem(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['language', -1, 'languageForm', 1]);
    });
  });

  describe('data operations', () => {
    it('should call languageService.update on dataUpdateFn', async () => {
      mockLanguageService.update.mockReturnValue(of(mockEnglish));

      const result = await component.dataUpdateFn(mockEnglish);

      expect(mockLanguageService.update).toHaveBeenCalledWith(mockEnglish);
      expect(result).toEqual(mockEnglish);
    });

    it('should call languageService.delete on dataDeleteFn', async () => {
      mockLanguageService.delete.mockReturnValue(of(undefined));

      await component.dataDeleteFn(mockEnglish);

      expect(mockLanguageService.delete).toHaveBeenCalledWith(mockEnglish);
    });
  });
});
