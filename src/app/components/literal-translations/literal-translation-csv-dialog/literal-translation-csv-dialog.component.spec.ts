import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { Language } from '@app/domain/translation/models/language.model';

import {
  LiteralTranslationCsvDialogComponent,
  LiteralTranslationCsvDialogResult,
} from './literal-translation-csv-dialog.component';

describe('LiteralTranslationCsvDialogComponent', () => {
  let component: LiteralTranslationCsvDialogComponent;
  let fixture: ComponentFixture<LiteralTranslationCsvDialogComponent>;
  let dialogRef: { close: jest.Mock };

  const languages: Language[] = [
    { shortname: 'ca', name: 'Catalan' } as Language,
    { shortname: 'es', name: 'Spanish' } as Language,
  ];

  async function createComponent(data: Record<string, unknown>): Promise<void> {
    TestBed.resetTestingModule();
    dialogRef = { close: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [
        LiteralTranslationCsvDialogComponent,
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({ getTranslation: () => of({}) }),
          },
        }),
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LiteralTranslationCsvDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await createComponent({
      mode: 'import',
      languages,
      language: 'es',
    });
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('rejects save without a file in import mode', () => {
    component.save();

    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('closes with the selected file in import mode', () => {
    const file = new File(['source_language,literal,translation'], 'literal-translations-es.csv', { type: 'text/csv' });

    component.onFileSelected({ target: { files: [file] } } as unknown as Event);
    component.targetLanguageControl.setValue('es', { emitEvent: false });
    component.fileNameControl.setValue('literal-translations-es.csv', { emitEvent: false });
    component.save();

    expect(dialogRef.close).toHaveBeenCalledWith({
      language: 'es',
      fileName: 'literal-translations-es.csv',
      literalIds: undefined,
      file,
    } satisfies LiteralTranslationCsvDialogResult);
  });

  it('clears the file selection', () => {
    component.selectedFile = new File(['x'], 'literal-translations-es.csv', { type: 'text/csv' });
    (component as any).fileInput = { nativeElement: { value: 'picked-file' } };

    component.clearFile();

    expect(component.selectedFile).toBeNull();
    expect((component as any).fileInput.nativeElement.value).toBe('');
  });

  it('defaults export language from the viewed language', async () => {
    await createComponent({
      mode: 'export',
      languages,
      language: 'es',
      fileName: 'literal-translations-es.csv',
    });

    expect(component.targetLanguageControl.value).toBe('es');
    expect(component.fileNameControl.value).toBe('literal-translations-es.csv');
  });
});
