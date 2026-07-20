import {Component, OnInit} from '@angular/core';
import {AbstractControl, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

import {TranslateService} from '@ngx-translate/core';

import {Translation} from '@app/domain';
import {filterEnabledLanguages, sortByLanguageOrder} from '@app/services/ui-language.resolver';

@Component({
    selector: 'app-dialog-translation',
    templateUrl: './dialog-translation.component.html',
    styleUrls: ['./dialog-translation.component.scss'],
    standalone: false
})
export class DialogTranslationComponent implements OnInit {

  translationForm: UntypedFormGroup;
  translationsMap: Map<string, any>;
  languageByDefault: string;
  languagesAvailables: any[];
  defaultLanguageValue: string;
  maxLength: number;
  useTextarea: boolean;
  private readonly initialValues = new Map<string, string | null>();

  constructor(
    private dialogRef: MatDialogRef<DialogTranslationComponent>,
    private translateService: TranslateService,
  ) {
    this.initializeTranslationForm();
  }

  ngOnInit(): void {
    this.initializeDynamicFormControls();
    this.checkTranslationsAlreadyDone();
    this.captureInitialValues();
    this.translationForm.markAsPristine();
  }

  get availableLanguages(): any[] {
    if (!this.languagesAvailables) {
      return [];
    }
    return sortByLanguageOrder(
      filterEnabledLanguages(this.languagesAvailables).filter(
        (lang) => lang.shortname !== this.languageByDefault
      )
    );
  }

  /** Accept only when the dialog is valid and at least one translation differs from load. */
  get canAccept(): boolean {
    if (!this.translationForm?.valid) {
      return false;
    }
    return Object.keys(this.translationForm.controls).some((key) =>
      this.normalize(this.translationForm.get(key)?.value) !== (this.initialValues.get(key) ?? null)
    );
  }

  getDefaultLanguageName(): string {
    return this.languageLabel(this.languageByDefault);
  }

  languageLabel(shortname: string): string {
    if (!shortname) {
      return '';
    }
    const key = `lang.${shortname}`;
    const label = this.translateService.instant(key);
    if (label && label !== key) {
      return label;
    }
    const lang = this.languagesAvailables?.find(l => l.shortname === shortname);
    return lang?.name || shortname;
  }

  getFormControlName(shortname: string): string {
    return `${shortname}Value`;
  }

  getFormControl(shortname: string): AbstractControl | null {
    const controlName = this.getFormControlName(shortname);
    return this.translationForm.get(controlName);
  }

  private initializeDynamicFormControls(): void {
    const controls: { [key: string]: UntypedFormControl } = {};
    const validators = this.maxLength ? [Validators.maxLength(this.maxLength)] : [];

    this.availableLanguages.forEach(lang => {
      const controlName = this.getFormControlName(lang.shortname);
      controls[controlName] = new UntypedFormControl(null, validators);
    });

    Object.keys(controls).forEach(key => {
      this.translationForm.addControl(key, controls[key]);
    });
  }

  private initializeTranslationForm(): void {
    this.translationForm = new UntypedFormGroup({});
  }

  checkTranslationsAlreadyDone(): void {
    if (!this.translationsMap) {
      return;
    }

    this.translationsMap.forEach((value: any, key: string) => {
      if (key === this.languageByDefault) {
        return;
      }

      const lang = this.availableLanguages.find(l => l.shortname === key);
      if (lang && value && value.translation) {
        const controlName = this.getFormControlName(key);
        const control = this.translationForm.get(controlName);
        if (control) {
          control.setValue(value.translation, {emitEvent: false});
        }
      }
    });
  }

  doAccept(): void {
    if (!this.canAccept) {
      return;
    }

    if (!this.translationsMap) {
      this.translationsMap = new Map<string, Translation>();
    }

    let columnName: string | null = null;
    if (this.translationsMap && this.translationsMap.size > 0) {
      const firstTranslation = Array.from(this.translationsMap.values())[0];
      columnName = firstTranslation?.column || null;
    }

    this.availableLanguages.forEach(lang => {
      const controlName = this.getFormControlName(lang.shortname);
      const control = this.translationForm.get(controlName);
      const value = control?.value || null;

      if (this.translationsMap.has(lang.shortname)) {
        const translation = this.translationsMap.get(lang.shortname);
        translation.translation = value;
      } else if (columnName) {
        const newTranslation = new Translation();
        newTranslation.translation = value;
        newTranslation.column = columnName;
        newTranslation.language = lang;
        this.translationsMap.set(lang.shortname, newTranslation);
      }
    });

    this.dialogRef.close({event: 'Accept', data: this.translationsMap});
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }

  private captureInitialValues(): void {
    this.initialValues.clear();
    Object.keys(this.translationForm.controls).forEach((key) => {
      this.initialValues.set(key, this.normalize(this.translationForm.get(key)?.value));
    });
  }

  private normalize(value: unknown): string | null {
    if (value == null || value === '') {
      return null;
    }
    return String(value);
  }
}
