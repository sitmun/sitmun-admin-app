import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom, map} from 'rxjs';

import {BaseFormComponent} from '@app/components/base-form.component';
import {Configuration} from "@app/core/config/configuration";
import {MessagesInterceptorStateService} from "@app/core/interceptors/messages.interceptor";
import {
  CodeListService,
  TaskUI,
  TaskUIService,
  TranslationService
} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from "@app/services/loading-overlay.service";
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

@Component({
    selector: 'app-task-ui-form',
    templateUrl: './task-ui-form.component.html',
    styles: [],
    standalone: false
})
export class TaskUIFormComponent extends BaseFormComponent<TaskUI> {
  readonly config = Configuration.TASK_UI;

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
    protected taskUIService: TaskUIService,
    public utils: UtilsService
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router, loadingService, messagesInterceptorState);
  }

  /**
   * Initializes component data before fetching.
   */
  override async preFetchData() {
    // TaskUI doesn't have translations
  }

  /**
   * Fetches the original entity by ID.
   *
   * @returns Promise that resolves to the task UI
   */
  override fetchOriginal(): Promise<TaskUI> {
    return firstValueFrom(this.taskUIService.get(this.entityID));
  }

  /**
   * Creates a copy of an existing entity for duplication.
   * Prefixes the name with "copy_" to distinguish from the original.
   *
   * @returns Promise that resolves to the duplicated task UI
   */
  override fetchCopy(): Promise<TaskUI> {
    return firstValueFrom(this.taskUIService.get(this.duplicateID).pipe(map((copy: TaskUI) => {
      copy.name = this.translateService.instant("common.copyPrefix") + copy.name;
      return copy;
    })));
  }

  /**
   * Creates an empty task UI entity with default values.
   *
   * @returns New empty task UI
   */
  override empty(): TaskUI {
    const taskUI = new TaskUI();
    taskUI.order = 0;
    taskUI.type = null;
    return taskUI;
  }

  /**
   * Initializes the form after entity data is fetched.
   * Sets up reactive form with entity values and validation rules.
   *
   * @throws Error if entity is undefined
   */
  override postFetchData() {
    if (!this.entityToEdit) {
      throw new Error('Cannot initialize form: entity is undefined');
    }

    this.entityForm = new FormGroup({
      name: new FormControl(this.entityToEdit.name, {
        validators: [Validators.required, Validators.maxLength(50)],
        nonNullable: true
      }),
      tooltip: new FormControl(this.entityToEdit.tooltip, {
        validators: [Validators.maxLength(100)],
        nonNullable: false
      }),
      type: new FormControl(this.entityToEdit.type, {
        validators: [Validators.maxLength(30)],
        nonNullable: false
      }),
      order: new FormControl(this.entityToEdit.order ?? 0, {
        validators: [Validators.required, Validators.min(0)],
        nonNullable: true
      }),
    });
  }


  /**
   * Creates a TaskUI object from the current form values.
   * Applies the form values to a copy of the current entity and converts it to a TaskUI domain object.
   * This method ensures that entity data is not directly modified until explicitly saved.
   *
   * @param id - Optional ID for the new object, used when updating
   * @returns New TaskUI instance populated with form values
   */
  createObject(id: number = null): TaskUI {
    let safeToEdit = TaskUI.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();
    safeToEdit = Object.assign(safeToEdit,
      formValues,
      {
        id: id
      }
    );
    return TaskUI.fromObject(safeToEdit);
  }


  /**
   * Creates a new task UI entity in the database.
   *
   * @returns Promise resolving to the ID of the created entity
   */
  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const entityCreated = await firstValueFrom(this.taskUIService.create(entityToCreate));
    return entityCreated.id;
  }

  /**
   * Updates an existing task UI entity with form values.
   *
   * @returns Promise that resolves when the update is complete
   */
  override async updateEntity() {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.taskUIService.update(entityToUpdate));
  }
}
