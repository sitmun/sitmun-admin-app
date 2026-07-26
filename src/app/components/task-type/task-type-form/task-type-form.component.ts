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
import {CodeListService, TaskType, TaskTypeService, TranslationService} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

@Component({
    selector: 'app-task-type-form',
    templateUrl: './task-type-form.component.html',
    styles: [],
    standalone: false
})
export class TaskTypeFormComponent extends BaseFormComponent<TaskType> {
  readonly config = Configuration.TASK_TYPE;

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
    private readonly taskTypeService: TaskTypeService,
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
    this.initTranslations('TaskType', ['title']);
  }

  override fetchOriginal(): Promise<TaskType> {
    return firstValueFrom(this.taskTypeService.get(this.entityID));
  }

  override fetchCopy(): Promise<TaskType> {
    return firstValueFrom(
      this.taskTypeService.get(this.duplicateID).pipe(
        map((copy: TaskType) => {
          copy.title = this.translateService.instant('common.copyPrefix') + copy.title;
          return copy;
        })
      )
    );
  }

  override async fetchRelatedData(): Promise<void> {
    if (this.entityToEdit?.id == null) {
      return;
    }

    await this.loadTranslations(this.entityToEdit);
  }

  override afterFetch(): void {
    super.afterFetch();
    this.entityForm?.markAsPristine();
  }

  override get canSaveEntity(): boolean {
    if (!this.dataLoaded || this.entityID < 0) {
      return false;
    }
    return super.canSaveEntity;
  }

  override empty(): TaskType {
    const taskType = new TaskType();
    taskType.title = '';
    return taskType;
  }

  override postFetchData() {
    if (!this.entityToEdit) {
      throw new Error('Cannot initialize form: entity is undefined');
    }

    this.entityForm = new UntypedFormGroup({
      title: new UntypedFormControl(this.entityToEdit.title, [Validators.required]),
    });
  }

  createObject(id: number = null): TaskType {
    let safeToEdit = TaskType.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();
    safeToEdit = Object.assign(safeToEdit, formValues, {id: id});
    return TaskType.fromObject(safeToEdit);
  }

  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const response = await firstValueFrom(this.taskTypeService.create(entityToCreate));
    return response.id;
  }

  override async updateEntity(): Promise<void> {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.taskTypeService.update(entityToUpdate));
  }

  override async updateDataRelated(_isDuplicated: boolean): Promise<void> {
    const entityToUpdate = this.createObject(this.entityID);
    await this.saveTranslations(entityToUpdate);
  }

  override itemName(_field: string): string {
    return this.entityToEdit?.title || '';
  }
}
