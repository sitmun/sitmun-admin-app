import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { Language } from '@app/domain';
import { MaterialModule } from '@app/material-module';

export interface LiteralTranslationCreateDialogData {
  languages: Language[];
  defaultLanguage: string;
}

export interface LiteralTranslationCreateDialogResult {
  literal: string;
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
  readonly translationControls = new Map<string, FormControl<string>>();
  readonly form = new UntypedFormGroup({
    literal: this.literalControl,
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

    this.activeLanguage = data.defaultLanguage;

    this.literalControl.valueChanges.subscribe((literal) => {
      const defaultControl = this.translationControls.get(this.data.defaultLanguage);
      defaultControl?.setValue(literal, { emitEvent: false });
    });

    this.translationControls.get(this.data.defaultLanguage)?.disable({ emitEvent: false });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const translations: Record<string, string> = {};
    for (const language of this.data.languages) {
      const value = language.shortname === this.data.defaultLanguage
        ? this.literalControl.value
        : (this.translationControls.get(language.shortname)?.value ?? '').trim();
      if (value) {
        translations[language.shortname] = value;
      }
    }

    this.dialogRef.close({
      literal: this.literalControl.value.trim(),
      translations,
    });
  }

  close(): void {
    this.dialogRef.close(null);
  }

  isDefaultLanguage(language: Language): boolean {
    return language.shortname === this.data.defaultLanguage;
  }

  setActiveLanguage(shortname: string): void {
    this.activeLanguage = shortname;
  }

  getActiveLanguage(): Language | undefined {
    return this.data.languages.find(l => l.shortname === this.activeLanguage);
  }

  isActiveLanguage(language: Language): boolean {
    return this.activeLanguage === language.shortname;
  }

  hasTranslation(language: Language): boolean {
    const value = this.isDefaultLanguage(language)
      ? this.literalControl.value
      : this.controlFor(language).value;
    return value.trim().length > 0;
  }

  controlFor(language: Language): FormControl<string> {
    return this.translationControls.get(language.shortname)!;
  }
}
