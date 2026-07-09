import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TranslateModule } from '@ngx-translate/core';

import { Language, sortLanguagesByOrder } from '@app/domain/translation/models/language.model';
import { MaterialModule } from '@app/material-module';

export interface LiteralTranslationCreateDialogData {
  languages: Language[];
  defaultLanguage: string;
}

export interface LiteralTranslationCreateDialogResult {
  literal: string;
  sourceLanguage: string;
  translations: Record<string, string>;
}

@Component({
  selector: 'app-literal-translation-create-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, TranslateModule],
  templateUrl: './literal-translation-create-dialog.component.html',
  styleUrls: ['./literal-translation-create-dialog.component.scss'],
})
export class LiteralTranslationCreateDialogComponent {
  readonly literalControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly sourceLanguageControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly translationControls = new Map<string, FormControl<string>>();
  readonly form = new UntypedFormGroup({
    literal: this.literalControl,
    sourceLanguage: this.sourceLanguageControl,
  });
  activeLanguage = '';

  constructor(
    private readonly dialogRef: MatDialogRef<LiteralTranslationCreateDialogComponent, LiteralTranslationCreateDialogResult | null>,
    @Inject(MAT_DIALOG_DATA) readonly data: LiteralTranslationCreateDialogData,
  ) {
    for (const language of data.languages) {
      const control = new FormControl('', { nonNullable: true });
      this.translationControls.set(language.shortname, control);
      this.form.addControl(`translation_${language.shortname}`, control);
    }

    this.sourceLanguageControl.setValue(data.defaultLanguage, { emitEvent: false });
    this.activeLanguage = this.sourceLanguageControl.value;

    this.literalControl.valueChanges.subscribe((literal) => {
      this.controlForShortname(this.sourceLanguageControl.value)?.setValue(literal, { emitEvent: false });
    });

    this.sourceLanguageControl.valueChanges.subscribe((sourceLanguage) => {
      this.syncSourceLanguageControl(sourceLanguage);
      this.activeLanguage = sourceLanguage;
    });

    this.syncSourceLanguageControl(this.sourceLanguageControl.value);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const translations: Record<string, string> = {};
    for (const language of this.orderedLanguages) {
      const value = language.shortname === this.sourceLanguageControl.value
        ? this.literalControl.value
        : (this.translationControls.get(language.shortname)?.value ?? '').trim();
      if (value) {
        translations[language.shortname] = value;
      }
    }

    this.dialogRef.close({
      literal: this.literalControl.value.trim(),
      sourceLanguage: this.sourceLanguageControl.value,
      translations,
    });
  }

  close(): void {
    this.dialogRef.close(null);
  }

  isSourceLanguage(language: Language): boolean {
    return language.shortname === this.sourceLanguageControl.value;
  }

  get orderedLanguages(): Language[] {
    return sortLanguagesByOrder(this.data.languages);
  }

  setActiveLanguage(shortname: string): void {
    this.activeLanguage = shortname;
  }

  getActiveLanguage(): Language | undefined {
    return this.orderedLanguages.find(l => l.shortname === this.activeLanguage);
  }

  isActiveLanguage(language: Language): boolean {
    return this.activeLanguage === language.shortname;
  }

  hasTranslation(language: Language): boolean {
    const value = this.isSourceLanguage(language)
      ? this.literalControl.value
      : this.controlFor(language).value;
    return value.trim().length > 0;
  }

  controlFor(language: Language): FormControl<string> {
    return this.controlForShortname(language.shortname)!;
  }

  private syncSourceLanguageControl(sourceLanguage: string): void {
    for (const [shortname, control] of this.translationControls.entries()) {
      if (shortname === sourceLanguage) {
        control.setValue(this.literalControl.value, { emitEvent: false });
        control.disable({ emitEvent: false });
        continue;
      }
      control.enable({ emitEvent: false });
    }
  }

  private controlForShortname(shortname: string): FormControl<string> | undefined {
    return this.translationControls.get(shortname);
  }
}
