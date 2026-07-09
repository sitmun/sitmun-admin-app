import {Component} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom} from 'rxjs';
import {map} from 'rxjs/operators';

import {BaseFormComponent} from '@app/components/base-form.component';
import {Configuration} from "@app/core/config/configuration";
import {MessagesInterceptorStateService} from '@app/core/interceptors/messages.interceptor';
import {CodeListService} from '@app/domain/codelist/services/codelist.service';
import {Language} from '@app/domain/translation/models/language.model';
import {LanguageService} from '@app/domain/translation/services/language.service';
import {TranslationService} from '@app/domain/translation/services/translation.service';
import {DialogMessageComponent} from '@app/frontend-gui/src/lib/public_api';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from "@app/services/loading-overlay.service";
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {config} from '@config';

import {DefaultLanguageChangeDialogComponent} from '../default-language-change-dialog/default-language-change-dialog.component';

@Component({
    selector: 'app-language-form',
    templateUrl: './language-form.component.html',
    styles: [],
    standalone: false
})
export class LanguageFormComponent extends BaseFormComponent<Language> {
  readonly config = Configuration.LANGUAGE;
  currentDefaultLanguage: string | null = null;
  currentDefaultLanguageName: string | null = null;

  constructor(
    dialog: MatDialog,
    translateService: TranslateService,
    translationService: TranslationService,
    codeListService: CodeListService,
    loggerService: LoggerService,
    errorHandler: ErrorHandlerService,
    activatedRoute: ActivatedRoute,
    router: Router,
    loadingService: LoadingOverlayService,
    messagesInterceptorState: MessagesInterceptorStateService,
    private readonly languageService: LanguageService,
    public utils: UtilsService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router, loadingService, messagesInterceptorState);
  }

  override async preFetchData() {
    this.initTranslations('Language', ['name']);
    await this.loadCurrentDefaultLanguage();
  }

  override fetchOriginal(): Promise<Language> {
    return firstValueFrom(this.languageService.get(this.entityID));
  }

  override fetchCopy(): Promise<Language> {
    return firstValueFrom(this.languageService.get(this.duplicateID).pipe(map((copy: Language) => {
      copy.shortname = this.translateService.instant("common.copyPrefix") + copy.shortname;
      copy.defaultLanguage = false;
      copy.order = null;
      return copy;
    })));
  }

  override empty(): Language {
    return new Language();
  }

  override postFetchData() {
    if (!this.entityToEdit) {
      throw new Error('Cannot initialize form: entity is undefined');
    }
    this.entityForm = new UntypedFormGroup({
      shortname: new UntypedFormControl(
        {value: this.entityToEdit.shortname, disabled: !this.isNewOrDuplicated()},
        [Validators.required]
      ),
      name: new UntypedFormControl(this.entityToEdit.name, [Validators.required]),
      defaultLanguage: new UntypedFormControl(this.entityToEdit.defaultLanguage ?? false),
    });
  }

  createObject(id: number = null): Language {
    let safeToEdit = Language.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();
    safeToEdit = Object.assign(safeToEdit,
      formValues,
      {
        id: id,
        order: id == null ? (safeToEdit.order ?? config.languagesToUse?.length ?? 0) : safeToEdit.order,
        defaultLanguage: id == null ? false : (this.entityToEdit?.defaultLanguage ?? false),
      }
    );
    return Language.fromObject(safeToEdit);
  }

  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const response = await firstValueFrom(this.languageService.create(entityToCreate));
    if (this.shouldSetAsDefault()) {
      await firstValueFrom(this.languageService.setDefault(response.id));
      this.updateCachedDefaultLanguage(response.id);
    }
    return response.id;
  }

  override async updateEntity(): Promise<void> {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.languageService.update(entityToUpdate));
    if (this.shouldSetAsDefault()) {
      await firstValueFrom(this.languageService.setDefault(this.entityID));
      this.updateCachedDefaultLanguage(this.entityID);
    }
  }

  override async onSaveButtonClicked(): Promise<boolean> {
    if (this.isTryingToUnsetCurrentDefault()) {
      const dialogRef = this.dialog.open(DialogMessageComponent, {
        width: '420px',
        data: {
          title: 'common.atention',
          message: 'entity.language.defaultUnsetWarning',
          hideCancelButton: true,
        },
      });
      dialogRef.afterClosed().subscribe();
      return false;
    }
    return super.onSaveButtonClicked();
  }

  override itemName(_field: string): string {
    if (!this.entityToEdit) {
      return '';
    }
    const name = this.entityToEdit.name || '';
    const shortname = this.entityToEdit.shortname || '';
    const defaultMarker = this.isDefaultLanguage ? ' ★' : '';
    return shortname ? `${name} (${shortname})${defaultMarker}` : name;
  }

  get isDefaultLanguage(): boolean {
    return !!this.entityToEdit?.shortname && this.entityToEdit.shortname === this.currentDefaultLanguage;
  }

  get canSetAsDefault(): boolean {
    return this.dataLoaded
      && !this.isNewOrDuplicated()
      && !!this.currentDefaultLanguage
      && !!this.entityToEdit?.shortname
      && !this.isDefaultLanguage
      && (this.entityForm?.valid ?? false)
      && !this.canSaveEntity;
  }

  async setAsDefault(event?: Event): Promise<void> {
    event?.preventDefault();
    event?.stopPropagation();

    if (!this.canSetAsDefault || !this.currentDefaultLanguage || !this.entityToEdit?.shortname) {
      return;
    }

    const dialogRef = this.dialog.open(DefaultLanguageChangeDialogComponent, {
      width: '600px',
      data: {
        from: this.currentDefaultLanguage,
        fromName: this.currentDefaultLanguageName ?? this.currentDefaultLanguage,
        to: this.entityToEdit.shortname,
        toName: this.entityToEdit.name,
        languageService: this.languageService
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        const newDefaultLanguage = result.newDefault;
        this.currentDefaultLanguage = newDefaultLanguage;
        this.currentDefaultLanguageName =
          this.entityToEdit?.shortname === newDefaultLanguage
            ? this.entityToEdit.name
            : newDefaultLanguage;

        if (newDefaultLanguage) {
          config.defaultLang = newDefaultLanguage;
          this.defaultLang = newDefaultLanguage;
        }
      }
    });
  }

  private async loadCurrentDefaultLanguage(): Promise<void> {
    try {
      this.currentDefaultLanguage = await firstValueFrom(this.languageService.getCurrentDefaultLanguage());
      const languages = await firstValueFrom(this.languageService.fetchAllRawItems());
      this.currentDefaultLanguageName =
        languages.find((language) => language.shortname === this.currentDefaultLanguage)?.name
        ?? this.currentDefaultLanguage;
    } catch (err) {
      this.errorHandler.handleError(err);
    }
  }

  private shouldSetAsDefault(): boolean {
    return this.entityForm?.get('defaultLanguage')?.value === true
      && this.entityToEdit?.defaultLanguage !== true;
  }

  private isTryingToUnsetCurrentDefault(): boolean {
    return this.entityToEdit?.defaultLanguage === true
      && this.entityForm?.get('defaultLanguage')?.value !== true;
  }

  private updateCachedDefaultLanguage(languageId: number): void {
    if (!Array.isArray(config.languagesToUse)) {
      return;
    }

    config.languagesToUse = config.languagesToUse.map((language) => Language.fromObject({
      ...language,
      defaultLanguage: language.id === languageId,
    }));
    localStorage.setItem('languages', JSON.stringify(config.languagesToUse));
    const selected = config.languagesToUse.find((language) => language.id === languageId);
    config.defaultLang = selected?.shortname ?? this.entityForm?.get('shortname')?.value ?? config.defaultLang;
  }
}
