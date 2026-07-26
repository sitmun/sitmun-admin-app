import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { Language } from '@app/domain/translation/models/language.model';
import { LanguageService } from '@app/domain/translation/services/language.service';
import { DIALOG_EVENTS } from '@app/frontend-gui/src/lib/public_api';
import { LiteralTranslationsAdminService } from '@app/services/literal-translations-admin.service';

import { LiteralTranslationsComponent } from './literal-translations.component';

describe('LiteralTranslationsComponent', () => {
  let component: LiteralTranslationsComponent;
  let fixture: ComponentFixture<LiteralTranslationsComponent>;
  let literalTranslationsService: jest.Mocked<LiteralTranslationsAdminService>;
  let languageService: { fetchAllItems: jest.Mock };
  let dialog: { open: jest.Mock };
  let snackBar: { open: jest.Mock };

  const languages: Language[] = [
    { id: 2, shortname: 'es', name: 'Spanish', order: 2 } as Language,
    { id: 1, shortname: 'ca', name: 'Catalan', order: 1 } as Language,
  ];

  beforeEach(async () => {
    localStorage.setItem('lang', 'es');
    literalTranslationsService = {
      fetchCompletionPct: jest.fn(() => of(42)),
      fetchPage: jest.fn(() => of({ rows: [], totalElements: 0, pageNumber: 0, pageSize: 100, totalPages: 0 })),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exportCsv: jest.fn(),
      importCsv: jest.fn(),
    } as unknown as jest.Mocked<LiteralTranslationsAdminService>;
    languageService = { fetchAllItems: jest.fn(() => of(languages)) };
    dialog = { open: jest.fn() };
    snackBar = { open: jest.fn() };

    TestBed.configureTestingModule({
      imports: [
        LiteralTranslationsComponent,
        NoopAnimationsModule,
        MatIconTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({ getTranslation: () => of({}) }),
          },
        }),
      ],
      providers: [
        { provide: LiteralTranslationsAdminService, useValue: literalTranslationsService },
        { provide: LanguageService, useValue: languageService },
        { provide: MatDialog, useValue: dialog },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    });
    TestBed.overrideComponent(LiteralTranslationsComponent, { set: { template: '' } });
    TestBed.overrideProvider(MatDialog, { useValue: dialog });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(LiteralTranslationsComponent);
    component = fixture.componentInstance;
    (component as any).dialog = dialog;
    (component as any).snackBar = snackBar;
    fixture.detectChanges();
  });

  it('loads languages preserving administrator order', () => {
    expect(component).toBeTruthy();
    expect(languageService.fetchAllItems).toHaveBeenCalled();
    expect(component.orderedLanguages.map((language) => language.shortname)).toEqual(['ca', 'es']);
  });

  it('opens the import dialog and imports the selected file', () => {
    const file = new File(['source_language,literal,translation'], 'literal-translations-es.csv', { type: 'text/csv' });
    dialog.open.mockReturnValue({ afterClosed: () => of({ language: 'es', file }) });
    literalTranslationsService.importCsv.mockReturnValue(of({
      targetLanguage: 'es',
      totalRows: 1,
      createdLiterals: 0,
      createdTranslations: 0,
      updatedTranslations: 1,
      emptiedTranslations: 0,
      unchangedRows: 0,
      existingKeysNotInCsv: 0,
      emptyValueRows: 0,
      sourceLanguageMismatchRows: 0,
      failedRows: 0,
      sourceLanguages: ['ca'],
      errors: [],
    }));

    component.importCsv();

    expect(dialog.open).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({
      data: expect.objectContaining({
        mode: 'import',
        language: 'es',
      }),
    }));
    expect(literalTranslationsService.importCsv).toHaveBeenCalledWith('es', file);
    expect(dialog.open).toHaveBeenCalledTimes(2);
    expect((dialog.open.mock.calls[1][1] as any).data.title).toBe('entity.literalTranslation.csv.summary.title');
  });

  it('opens the export dialog and downloads the returned blob', async () => {
    component.selectedRows = [{ id: 7 } as any];
    dialog.open.mockReturnValue({ afterClosed: () => of({ language: 'es', literalIds: [7], fileName: 'literal-translations-es-partial.csv' }) });
    literalTranslationsService.exportCsv.mockReturnValue(of(new HttpResponse({
      body: new Blob(['literal,translation']),
      headers: new HttpHeaders({ 'content-disposition': "attachment; filename*=UTF-8''literal-translations-es.csv" }),
      status: 200,
      statusText: 'OK',
    })));
    const anchor = { click: jest.fn(), download: '', href: '' } as unknown as HTMLAnchorElement;
    const originalCreateObjectURL = window.URL.createObjectURL;
    const originalRevokeObjectURL = window.URL.revokeObjectURL;
    const originalCreateElement = document.createElement;
    Object.defineProperty(window.URL, 'createObjectURL', { configurable: true, value: jest.fn(() => 'blob:mock') });
    Object.defineProperty(window.URL, 'revokeObjectURL', { configurable: true, value: jest.fn() });
    Object.defineProperty(document, 'createElement', { configurable: true, value: jest.fn(() => anchor) });

    component.exportCsv();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(dialog.open).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({
      data: expect.objectContaining({
        mode: 'export',
        literalIds: [7],
        fileName: 'literal-translations-es-partial.csv',
      }),
    }));
    expect(literalTranslationsService.exportCsv).toHaveBeenCalledWith({
      targetLanguage: 'es',
      literalIds: [7],
      fileName: 'literal-translations-es-partial.csv',
    });
    expect(window.URL.createObjectURL).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(anchor.click).toHaveBeenCalled();
    expect(anchor.download).toBe('literal-translations-es.csv');

    Object.defineProperty(window.URL, 'createObjectURL', { configurable: true, value: originalCreateObjectURL });
    Object.defineProperty(window.URL, 'revokeObjectURL', { configurable: true, value: originalRevokeObjectURL });
    Object.defineProperty(document, 'createElement', { configurable: true, value: originalCreateElement });
  });

  it('deletes selected rows after confirmation', () => {
    const row = { id: 7 } as any;
    component.gridApi = null;
    component.selectedRows = [row];
    dialog.open.mockReturnValue({ afterClosed: () => of({ event: DIALOG_EVENTS.ACCEPT }) });
    literalTranslationsService.delete.mockReturnValue(of(undefined));

    component.deleteSelected();

    expect(literalTranslationsService.delete).toHaveBeenCalledWith(7);
    expect(snackBar.open).toHaveBeenCalledWith('entity.literalTranslation.deleteSuccess', undefined, { duration: 2500 });
  });
});
