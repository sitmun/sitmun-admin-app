import {Component} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom} from 'rxjs';
import {map} from 'rxjs/operators';

import {BaseFormComponent} from '@app/components/base-form.component';
import {Configuration} from '@app/core/config/configuration';
import {MessagesInterceptorStateService} from '@app/core/interceptors/messages.interceptor';
import {CodeListService, TerritoryType, TerritoryTypeService, TranslationService} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

@Component({
    selector: 'app-territory-type-form',
    templateUrl: './territory-type-form.component.html',
    styles: [],
    standalone: false
})
export class TerritoryTypeFormComponent extends BaseFormComponent<TerritoryType> {
  readonly config = Configuration.TERRITORY_TYPE;

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
    private readonly territoryTypeService: TerritoryTypeService,
    public utils: UtilsService,
  ) {
    super(
      dialog,
      translateService,
      translationService,
      codeListService,
      loggerService,
      errorHandler,
      activatedRoute,
      router,
      loadingService,
      messagesInterceptorState
    );
  }

  override async preFetchData() {
    this.initTranslations('TerritoryType', ['name']);
  }

  override fetchOriginal(): Promise<TerritoryType> {
    return firstValueFrom(this.territoryTypeService.get(this.entityID));
  }

  override fetchCopy(): Promise<TerritoryType> {
    return firstValueFrom(
      this.territoryTypeService.get(this.duplicateID).pipe(
        map((copy: TerritoryType) => {
          copy.name = this.translateService.instant('common.copyPrefix') + copy.name;
          return copy;
        })
      )
    );
  }

  override empty(): TerritoryType {
    const territoryType = new TerritoryType();
    territoryType.official = false;
    territoryType.topType = false;
    territoryType.bottomType = false;
    return territoryType;
  }

  override postFetchData() {
    if (!this.entityToEdit) {
      throw new Error('Cannot initialize form: entity is undefined');
    }
    this.entityForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.entityToEdit.name, [Validators.required]),
      official: new UntypedFormControl(this.entityToEdit.official ?? false),
      topType: new UntypedFormControl(this.entityToEdit.topType ?? false),
      bottomType: new UntypedFormControl(this.entityToEdit.bottomType ?? false),
    });
  }

  createObject(id: number = null): TerritoryType {
    let safeToEdit = TerritoryType.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();
    safeToEdit = Object.assign(safeToEdit, formValues, {id: id});
    return TerritoryType.fromObject(safeToEdit);
  }

  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const response = await firstValueFrom(this.territoryTypeService.create(entityToCreate));
    return response.id;
  }

  override async updateEntity(): Promise<void> {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.territoryTypeService.update(entityToUpdate));
  }

  override itemName(_field: string): string {
    return this.entityToEdit?.name || '';
  }
}
