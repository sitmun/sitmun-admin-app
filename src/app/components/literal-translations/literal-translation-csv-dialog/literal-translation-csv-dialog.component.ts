import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TranslateModule } from '@ngx-translate/core';

import { Language } from '@app/domain';
import { MaterialModule } from '@app/material-module';

export type LiteralTranslationCsvDialogMode = 'import' | 'export';

export interface LiteralTranslationCsvDialogData {
  mode: LiteralTranslationCsvDialogMode;
  languages: Language[];
  language: string;
  literalIds?: number[];
  fileName?: string;
}

export interface LiteralTranslationCsvDialogResult {
  language: string;
  literalIds?: number[];
  fileName?: string;
  file?: File;
}

@Component({
  selector: 'app-literal-translation-csv-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, TranslateModule],
  templateUrl: './literal-translation-csv-dialog.component.html',
  styleUrls: ['./literal-translation-csv-dialog.component.scss'],
})
export class LiteralTranslationCsvDialogComponent {
  @ViewChild('fileInput') private readonly fileInput?: ElementRef<HTMLInputElement>;

  readonly targetLanguageControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly fileNameControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly form = new FormGroup({
    targetLanguage: this.targetLanguageControl,
    fileName: this.fileNameControl,
  });

  selectedFile: File | null = null;

  constructor(
    private readonly dialogRef: MatDialogRef<LiteralTranslationCsvDialogComponent, LiteralTranslationCsvDialogResult | null>,
    @Inject(MAT_DIALOG_DATA) readonly data: LiteralTranslationCsvDialogData,
  ) {
    this.targetLanguageControl.setValue(this.data.language || this.defaultLanguage(), { emitEvent: false });
    this.fileNameControl.setValue(this.data.fileName || this.defaultFileName(this.targetLanguageControl.value), { emitEvent: false });

    this.targetLanguageControl.valueChanges.subscribe((targetLanguage) => {
      if (!this.fileNameControl.value || this.fileNameControl.value === this.defaultFileName(this.data.language)) {
        this.fileNameControl.setValue(this.defaultFileName(targetLanguage), { emitEvent: false });
      }
    });
  }

  get isImport(): boolean {
    return this.data.mode === 'import';
  }

  get isExport(): boolean {
    return this.data.mode === 'export';
  }

  get titleKey(): string {
    return this.isImport ? 'entity.literalTranslation.csv.importTitle' : 'entity.literalTranslation.csv.exportTitle';
  }

  get actionKey(): string {
    return this.isImport ? 'entity.literalTranslation.csv.importButton' : 'entity.literalTranslation.csv.exportButton';
  }

  get descriptionKey(): string {
    return this.isImport ? 'entity.literalTranslation.csv.importDescription' : 'entity.literalTranslation.csv.exportDescription';
  }

  get selectionInfoKey(): string {
    return this.data.literalIds && this.data.literalIds.length > 0
      ? 'entity.literalTranslation.csv.exportSelection'
      : 'entity.literalTranslation.csv.exportAll';
  }

  get importHintKey(): string {
    return 'entity.literalTranslation.csv.importHint';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile = file;
  }

  clearFile(): void {
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  close(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    if (this.form.invalid || (this.isImport && !this.selectedFile)) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      language: this.targetLanguageControl.value,
      fileName: this.fileNameControl.value,
      literalIds: this.data.literalIds,
      file: this.selectedFile ?? undefined,
    });
  }

  private defaultLanguage(): string {
    return this.data.languages[0]?.shortname ?? '';
  }

  private defaultFileName(targetLanguage: string): string {
    const suffix = this.data.literalIds && this.data.literalIds.length > 0 ? '-partial' : '';
    return `literal-translations-${targetLanguage}${suffix}.csv`;
  }
}
