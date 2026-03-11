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
import {CodeListService, Language, LanguageService, TranslationService} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from "@app/services/loading-overlay.service";
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

@Component({
    selector: 'app-language-form',
    templateUrl: './language-form.component.html',
    styles: [],
    standalone: false
})
export class LanguageFormComponent extends BaseFormComponent<Language> {
  readonly config = Configuration.LANGUAGE;

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
  }

  override fetchOriginal(): Promise<Language> {
    return firstValueFrom(this.languageService.get(this.entityID));
  }

  override fetchCopy(): Promise<Language> {
    return firstValueFrom(this.languageService.get(this.duplicateID).pipe(map((copy: Language) => {
      copy.shortname = this.translateService.instant("common.copyPrefix") + copy.shortname;
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
      shortname: new UntypedFormControl(this.entityToEdit.shortname, [Validators.required]),
      name: new UntypedFormControl(this.entityToEdit.name, [Validators.required]),
    });
  }

  createObject(id: number = null): Language {
    let safeToEdit = Language.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();
    safeToEdit = Object.assign(safeToEdit,
      formValues,
      {
        id: id,
      }
    );
    return Language.fromObject(safeToEdit);
  }

  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const response = await firstValueFrom(this.languageService.create(entityToCreate));
    return response.id;
  }

  override async updateEntity(): Promise<void> {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.languageService.update(entityToUpdate));
  }

  override itemName(_field: string): string {
    if (!this.entityToEdit) {
      return '';
    }
    const name = this.entityToEdit.name || '';
    const shortname = this.entityToEdit.shortname || '';
    return shortname ? `${name} (${shortname})` : name;
  }
}
