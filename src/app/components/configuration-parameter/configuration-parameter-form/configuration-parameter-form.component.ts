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
import {CodeListService, ConfigurationParameter, ConfigurationParametersService, TranslationService} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from "@app/services/loading-overlay.service";
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

@Component({
    selector: 'app-configuration-parameter-form',
    templateUrl: './configuration-parameter-form.component.html',
    styles: [],
    standalone: false
})
export class ConfigurationParameterFormComponent extends BaseFormComponent<ConfigurationParameter> {
  readonly config = Configuration.CONFIGURATION_PARAMETER;
  isProtectedParameter = false;

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
    private readonly configurationParametersService: ConfigurationParametersService,
    public utils: UtilsService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router, loadingService, messagesInterceptorState);
  }

  override async preFetchData() {
    // No special initialization needed
  }

  override fetchOriginal(): Promise<ConfigurationParameter> {
    return firstValueFrom(this.configurationParametersService.get(this.entityID));
  }

  override fetchCopy(): Promise<ConfigurationParameter> {
    return firstValueFrom(this.configurationParametersService.get(this.duplicateID).pipe(map((copy: ConfigurationParameter) => {
      copy.name = this.translateService.instant("common.copyPrefix") + copy.name;
      return copy;
    })));
  }

  override empty(): ConfigurationParameter {
    return new ConfigurationParameter();
  }

  override postFetchData() {
    if (!this.entityToEdit) {
      throw new Error('Cannot initialize form: entity is undefined');
    }

    // Check if this is the protected language.default parameter
    this.isProtectedParameter = this.entityToEdit.name === 'language.default';

    this.entityForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.entityToEdit.name, [Validators.required]),
      value: new UntypedFormControl(this.entityToEdit.value, []),
    });

    // Disable form fields for protected parameters
    if (this.isProtectedParameter) {
      this.entityForm.disable();
    }
  }

  createObject(id: number = null): ConfigurationParameter {
    let safeToEdit = ConfigurationParameter.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();
    safeToEdit = Object.assign(safeToEdit,
      formValues,
      {
        id: id,
      }
    );
    return ConfigurationParameter.fromObject(safeToEdit);
  }

  override get canSaveEntity(): boolean {
    // Cannot save protected parameters
    if (this.isProtectedParameter) {
      return false;
    }
    return super.canSaveEntity;
  }

  override async createEntity(): Promise<number> {
    if (this.isProtectedParameter) {
      const message = this.translateService.instant('entity.configurationParameter.languageDefaultProtection');
      throw new Error(message);
    }
    const entityToCreate = this.createObject();
    const response = await firstValueFrom(this.configurationParametersService.create(entityToCreate));
    return response.id;
  }

  override async updateEntity(): Promise<void> {
    if (this.isProtectedParameter) {
      const message = this.translateService.instant('entity.configurationParameter.languageDefaultProtection');
      throw new Error(message);
    }
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.configurationParametersService.update(entityToUpdate));
  }
}
