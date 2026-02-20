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
import {CodeList, CodeListService, TranslationService} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from "@app/services/loading-overlay.service";
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

@Component({
    selector: 'app-codelist-value-form',
    templateUrl: './codelist-value-form.component.html',
    styles: [],
    standalone: false
})
export class CodelistValueFormComponent extends BaseFormComponent<CodeList> {
  readonly config = Configuration.CODELIST_VALUE;
  isSystemRecord = false;

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
    public utils: UtilsService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router, loadingService, messagesInterceptorState);
  }

  override async preFetchData() {
    this.initTranslations('CodeList', ['description']);
  }

  override fetchOriginal(): Promise<CodeList> {
    return firstValueFrom(this.codeListService.get(this.entityID));
  }

  override fetchCopy(): Promise<CodeList> {
    return firstValueFrom(this.codeListService.get(this.duplicateID).pipe(map((copy: CodeList) => {
      copy.value = this.translateService.instant("copy_") + copy.value;
      copy.system = false; // Duplicated records are never system records
      return copy;
    })));
  }

  override empty(): CodeList {
    const codeList = new CodeList();
    codeList.system = false;
    codeList.defaultCode = false;
    return codeList;
  }

  override postFetchData() {
    if (!this.entityToEdit) {
      throw new Error('Cannot initialize form: entity is undefined');
    }
    
    this.isSystemRecord = this.entityToEdit.system === true;
    
    this.entityForm = new UntypedFormGroup({
      codeListName: new UntypedFormControl(
        {value: this.entityToEdit.codeListName, disabled: this.isSystemRecord}, 
        [Validators.required]
      ),
      value: new UntypedFormControl(
        {value: this.entityToEdit.value, disabled: this.isSystemRecord}, 
        [Validators.required]
      ),
      description: new UntypedFormControl(this.entityToEdit.description, []),
      defaultCode: new UntypedFormControl(
        {value: this.entityToEdit.defaultCode || false, disabled: this.isSystemRecord}, 
        []
      ),
    });
  }

  createObject(id: number = null): CodeList {
    let safeToEdit = CodeList.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();
    safeToEdit = Object.assign(safeToEdit,
      formValues,
      {
        id: id,
        system: this.entityToEdit.system || false, // Preserve system flag
      }
    );
    return CodeList.fromObject(safeToEdit);
  }

  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const response = await firstValueFrom(this.codeListService.create(entityToCreate));
    return response.id;
  }

  override async updateEntity(): Promise<void> {
    // System records can be updated (only description field is editable)
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.codeListService.update(entityToUpdate));
  }

  override itemName(_field: string): string {
    if (!this.entityToEdit) {
      return '';
    }
    const description = this.entityToEdit.description || '';
    const value = this.entityToEdit.value || '';
    return value ? `${description} (${value})` : description;
  }
}
