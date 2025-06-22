import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
  CodeListService,
  TaskGroup,
  TaskGroupService,
  TaskService,
  TaskProjection,
  TranslationService
} from '@app/domain';
import {LoggerService} from '@app/services/logger.service';
import {BaseFormComponent} from '@app/components/base-form.component';
import {MatDialog} from '@angular/material/dialog';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom, map} from 'rxjs';
import {UtilsService} from '@app/services/utils.service';
import {DataTableDefinition} from "@app/components/data-tables.util";

@Component({
  selector: 'app-task-group-form',
  templateUrl: './task-group-form.component.html',
  styles: []
})
export class TaskGroupFormComponent extends BaseFormComponent<TaskGroup> {


  /**
   * Data table definition for managing role assignments to the task.
   * Configures the roles grid with columns, data fetching, and update operations.
   */
  protected readonly tasksTable: DataTableDefinition<TaskProjection, TaskProjection>;

  constructor(
    dialog: MatDialog,
    translateService: TranslateService,
    translationService: TranslationService,
    codeListService: CodeListService,
    loggerService: LoggerService,
    errorHandler: ErrorHandlerService,
    activatedRoute: ActivatedRoute,
    router: Router,
    protected taskGroupService: TaskGroupService,
    protected taskService: TaskService,
    protected utils: UtilsService
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router);
    this.tasksTable = this.createTasksTableDefinition();
  }

  /**
   * Initializes component data before fetching.
   */
  override async preFetchData() {
    this.initTranslations('TaskGroup', ['name'])
  }

  /**
   * Fetches the original entity by ID.
   *
   * @returns Promise that resolves to the task group
   */
  override fetchOriginal(): Promise<TaskGroup> {
    return firstValueFrom(this.taskGroupService.get(this.entityID));
  }

  /**
   * Creates a copy of an existing entity for duplication.
   * Prefixes the name with "copy_" to distinguish from the original.
   *
   * @returns Promise that resolves to the duplicated task group
   */
  override fetchCopy(): Promise<TaskGroup> {
    return firstValueFrom(this.taskGroupService.getProjection(TaskGroup, this.duplicateID).pipe(map((copy: TaskGroup) => {
      copy.name = this.translateService.instant("copy_") + copy.name;
      return copy;
    })));
  }

  /**
   * Creates an empty task entity with default values.
   *
   * @returns New empty task group
   */
  override empty(): TaskGroup {
    return new TaskGroup()
  }

  /**
   * Fetches related data for the entity.
   * Loads translations for the current entity.
   *
   * @returns Promise that resolves when translations are loaded
   */
  override async fetchRelatedData() {
    this.dataTables.register(this.tasksTable)
    return this.loadTranslations(this.entityToEdit);
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
        validators: [Validators.required],
        nonNullable: true
      }),
    });
  }


  /**
   * Creates a Task  object from the current form values.
   * Applies the form values to a copy of the current entity and converts it to a Task  domain object.
   * This method ensures that entity data is not directly modified until explicitly saved.
   *
   * @param id - Optional ID for the new object, used when updating
   * @returns New Task instance populated with form values
   */
  createObject(id: number = null): TaskGroup {
    let safeToEdit = TaskGroup.fromObject(this.entityToEdit);
    safeToEdit = Object.assign(safeToEdit,
      this.entityForm.value,
      {
        id: id
      }
    );
    return TaskGroup.fromObject(safeToEdit);
  }


  /**
   * Creates a new task group entity in the database.
   *
   * @returns Promise resolving to the ID of the created entity
   */
  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const entityCreated = await firstValueFrom(this.taskGroupService.create(entityToCreate));
    return entityCreated.id;
  }

  /**
   * Updates an existing task entity with form values.
   *
   * @returns Promise that resolves when the update is complete
   */
  override async updateEntity() {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.taskGroupService.update(entityToUpdate));
  }

  /**
   * Updates related data after the task group is saved.
   *
   * @param isDuplicated - Whether this is a duplication operation
   * @returns Promise that resolves when related data is updated
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override async updateDataRelated(isDuplicated: boolean) {
    const entityToUpdate = this.createObject(this.entityID);
    await this.saveTranslations(entityToUpdate);
  }

  private createTasksTableDefinition() : DataTableDefinition<TaskProjection, TaskProjection> {
     return DataTableDefinition.builder<TaskProjection, TaskProjection>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef('common.form.name', 'name', '/tasks/:id/:typeId',
          {
            typeId: 'typeId',
            id: 'id',
          }),
        this.utils.getEditableColumnDef('common.form.type', 'typeName'),
        this.utils.getStatusColumnDef()])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        return this.taskService.customQueryProjection(TaskProjection, "group.id=" + this.entityID)
      })
       .build()
  }
}
