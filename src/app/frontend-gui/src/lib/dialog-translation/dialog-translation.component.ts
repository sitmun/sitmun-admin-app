import {Component, OnInit} from '@angular/core';
import {AbstractControl, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

import {Translation} from '@app/domain';
import {AppConfigService} from '@app/services/app-config.service';

@Component({
  selector: 'app-dialog-translation',
  templateUrl: './dialog-translation.component.html',
  styleUrls: ['./dialog-translation.component.scss']
})
export class DialogTranslationComponent implements OnInit {

  translationForm: UntypedFormGroup;
  translationsMap: Map<string, any>;
  languageByDefault: string;
  languagesAvailables: any[];
  defaultLanguageValue: string;
  maxLength: number;
  useTextarea: boolean;

  constructor(
    private dialogRef: MatDialogRef<DialogTranslationComponent>,
    private appConfigService: AppConfigService
  ) {
    this.initializeTranslationForm();
  }

  ngOnInit(): void {
    this.initializeDynamicFormControls();
    this.checkTranslationsAlreadyDone();
  }

  /**
   * Get available languages (excluding the default language), sorted alphabetically by name
   */
  get availableLanguages(): any[] {
    if (!this.languagesAvailables) {
      return [];
    }
    return this.languagesAvailables
      .filter(lang => lang.shortname !== this.languageByDefault)
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  /**
   * Get the name of the default language
   */
  getDefaultLanguageName(): string {
    if (!this.languagesAvailables) {
      return '';
    }
    const defaultLang = this.languagesAvailables.find(
      lang => lang.shortname === this.languageByDefault
    );
    return defaultLang?.name || this.languageByDefault;
  }

  /**
   * Get language icon path from AppConfigService
   */
  getLanguageIcon(shortname: string): string {
    return this.appConfigService.getLanguageIcon(shortname);
  }

  /**
   * Get language icon name for mat-icon svgIcon attribute
   * Converts path like "assets/flags/spain.svg" to "flag-spain"
   */
  getLanguageIconName(shortname: string): string {
    const iconPath = this.appConfigService.getLanguageIcon(shortname);
    if (!iconPath) return '';
    
    // Extract filename from path: "assets/flags/spain.svg" -> "spain"
    const filename = iconPath.split('/').pop()?.replace('.svg', '') || '';
    return filename ? `flag-${filename}` : '';
  }

  /**
   * Check if language has an icon
   */
  hasLanguageIcon(shortname: string): boolean {
    return !!this.getLanguageIcon(shortname);
  }

  /**
   * Get form control name for a language shortname
   */
  getFormControlName(shortname: string): string {
    return `${shortname}Value`;
  }

  /**
   * Get form control for a language shortname (for character count pipe)
   */
  getFormControl(shortname: string): AbstractControl | null {
    const controlName = this.getFormControlName(shortname);
    return this.translationForm.get(controlName);
  }

  /**
   * Initialize the translation form with dynamic controls
   */
  private initializeDynamicFormControls(): void {
    const controls: { [key: string]: UntypedFormControl } = {};

    // Create form controls dynamically for each available language
    // Add maxLength validator if maxLength is provided
    const validators = this.maxLength ? [Validators.maxLength(this.maxLength)] : [];
    
    this.availableLanguages.forEach(lang => {
      const controlName = this.getFormControlName(lang.shortname);
      controls[controlName] = new UntypedFormControl(null, validators);
    });

    // Update form with new controls
    Object.keys(controls).forEach(key => {
      this.translationForm.addControl(key, controls[key]);
    });
  }

  /**
   * Initialize the base translation form
   */
  private initializeTranslationForm(): void {
    this.translationForm = new UntypedFormGroup({});
  }

  /**
   * Check and populate existing translations
   */
  checkTranslationsAlreadyDone(): void {
    if (!this.translationsMap) {
      return;
    }

    this.translationsMap.forEach((value: any, key: string) => {
      // Skip default language
      if (key === this.languageByDefault) {
        return;
      }

      // Check if this language is in available languages
      const lang = this.availableLanguages.find(l => l.shortname === key);
      if (lang && value && value.translation) {
        const controlName = this.getFormControlName(key);
        const control = this.translationForm.get(controlName);
        if (control) {
          control.setValue(value.translation);
        }
      }
    });
  }

  /**
   * Accept and save translations
   */
  doAccept(): void {
    if (!this.translationForm.valid) {
      return;
    }

    // Ensure translationsMap is initialized
    if (!this.translationsMap) {
      this.translationsMap = new Map<string, Translation>();
    }

    // Get column name from an existing translation (if any) to create new ones
    let columnName: string | null = null;
    if (this.translationsMap && this.translationsMap.size > 0) {
      const firstTranslation = Array.from(this.translationsMap.values())[0];
      columnName = firstTranslation?.column || null;
    }

    // Update translations map with form values
    this.availableLanguages.forEach(lang => {
      const controlName = this.getFormControlName(lang.shortname);
      const control = this.translationForm.get(controlName);
      const value = control?.value || null; // Allow null/empty values

      if (this.translationsMap.has(lang.shortname)) {
        // Update existing translation
        const translation = this.translationsMap.get(lang.shortname);
        translation.translation = value;
      } else {
        // Create new translation entry if it doesn't exist
        if (columnName) {
          const newTranslation = new Translation();
          newTranslation.translation = value;
          newTranslation.column = columnName;
          newTranslation.language = lang;
          this.translationsMap.set(lang.shortname, newTranslation);
        }
      }
    });

    this.dialogRef.close({event: 'Accept', data: this.translationsMap});
  }

  /**
   * Close dialog without saving
   */
  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }
}
