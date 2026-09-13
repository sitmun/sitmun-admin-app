import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, map } from 'rxjs';

import { BaseFormComponent } from '@app/components/base-form.component';
import { DataTableDefinition } from '@app/components/data-tables.util';
import { Configuration } from '@app/core/config/configuration';
import { MessagesInterceptorStateService } from '@app/core/interceptors/messages.interceptor';
import {
  CodeListService,
  Role,
  RoleService,
  Task,
  TaskAvailabilityProjection,
  TaskAvailabilityService,
  TaskGroup,
  TaskGroupService,
  TaskProjection,
  TaskService,
  TaskType,
  TaskTypeService,
  TerritoryProjection,
  TerritoryService,
  TranslationService,
} from '@app/domain';
import { ErrorHandlerService } from '@app/services/error-handler.service';
import { LoadingOverlayService } from '@app/services/loading-overlay.service';
import { LoggerService } from '@app/services/logger.service';
import { UtilsService } from '@app/services/utils.service';
import { magic } from '@environments/constants';

import { createTaskAvailabilitiesTable, createTaskRolesTable, updateTaskGroupRelation } from '../../tasks-shared/task-relation-tables';

interface DocumentExportTaskProperties {
  [key: string]: unknown;
  exportEngine?: string;
  downloadFormat?: string;
  downloadSource?: string;
  pageSize?: string;
  pageOrientation?: string;
}

@Component({
  selector: 'app-task-document-export-form',
  templateUrl: './task-document-export-form.component.html',
  styles: ['.pdf-config-row { margin-top: 16px; }'],
  standalone: false,
})
export class TaskDocumentExportFormComponent extends BaseFormComponent<TaskProjection> {
  readonly config = Configuration.TASK_DOCUMENT_EXPORT;
  private static readonly DEFAULT_PAGE_SIZE = 'A4';
  private static readonly DEFAULT_PAGE_ORIENTATION = 'portrait';

  public override entityForm: FormGroup;

  protected readonly pdfPageSizes = ['A4', 'A3'];
  protected readonly pdfPageOrientations = ['portrait', 'landscape'];

  protected readonly rolesTable: DataTableDefinition<Role, Role>;
  protected readonly availabilitiesTable: DataTableDefinition<TaskAvailabilityProjection, TerritoryProjection>;

  protected taskGroupList: TaskGroup[] = [];

  protected validationFieldLabels: Record<string, string> = {
    name: 'common.form.name',
    taskGroupId: 'entity.taskGroup.label',
    exportEngine: 'entity.task.documentExport.engine',
    output: 'entity.task.documentExport.output',
    pageSize: 'entity.task.documentExport.pageSize',
    pageOrientation: 'entity.task.documentExport.pageOrientation',
  };

  private taskType: TaskType = null;

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
    protected taskService: TaskService,
    protected taskTypeService: TaskTypeService,
    protected taskGroupService: TaskGroupService,
    protected roleService: RoleService,
    protected territoryService: TerritoryService,
    protected taskAvailabilityService: TaskAvailabilityService,
    protected utils: UtilsService,
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
      messagesInterceptorState,
    );

    this.rolesTable = this.defineRolesTable();
    this.availabilitiesTable = this.defineAvailabilitiesTable();
  }

  override async preFetchData(): Promise<void> {
    this.dataTables.register(this.rolesTable).register(this.availabilitiesTable);
    this.initTranslations('Task', ['name']);
    await this.initCodeLists(['documentExport.engine', 'documentExport.output']);

    const [taskTypes, taskGroups] = await Promise.all([
      firstValueFrom(this.taskTypeService.fetchAllItems()),
      firstValueFrom(this.taskGroupService.fetchAllItems()),
    ]);

    this.taskType = taskTypes.find((taskType) => taskType.id === magic.taskDocumentExportTypeId) ?? null;
    if (!this.taskType) {
      this.loggerService.warn(`Document export task type ${magic.taskDocumentExportTypeId} not found yet in backend catalog`);
    }

    this.taskGroupList = taskGroups;
  }

  override async fetchRelatedData(): Promise<void> {
    return this.loadTranslations(this.entityToEdit);
  }

  override fetchOriginal(): Promise<TaskProjection> {
    return firstValueFrom(this.taskService.fetchProjectionById(TaskProjection, this.entityID));
  }

  override fetchCopy(): Promise<TaskProjection> {
    return firstValueFrom(
      this.taskService.fetchProjectionById(TaskProjection, this.duplicateID).pipe(
        map((copy: TaskProjection) => {
          copy.name = this.translateService.instant('copy_') + copy.name;
          return copy;
        }),
      ),
    );
  }

  override empty(): TaskProjection {
    return new TaskProjection();
  }

  override postFetchData(): void {
    const properties = this.getDocumentExportProperties(this.entityToEdit?.properties);

    this.entityForm = new FormGroup({
      name: new FormControl(this.entityToEdit.name, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      taskGroupId: new FormControl(this.entityToEdit.groupId, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      exportEngine: new FormControl(properties.exportEngine ?? null, {
        validators: [Validators.required],
      }),
      output: new FormControl(properties.downloadFormat ?? null, {
        validators: [Validators.required, Validators.pattern(/^pdf$/)],
      }),
      pageSize: new FormControl(properties.pageSize ?? TaskDocumentExportFormComponent.DEFAULT_PAGE_SIZE, {
        nonNullable: true,
      }),
      pageOrientation: new FormControl(
        properties.pageOrientation ?? TaskDocumentExportFormComponent.DEFAULT_PAGE_ORIENTATION,
        {
          nonNullable: true,
        },
      ),
    });
  }

  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const entityCreated = await firstValueFrom(this.taskService.create(entityToCreate));

    if (this.taskType) {
      await firstValueFrom(entityCreated.updateRelationEx('type', this.taskType));
    }

    const groupId = this.entityForm.get('taskGroupId')?.value;
    if (typeof groupId === 'number') {
      await updateTaskGroupRelation(entityCreated, groupId, this.taskGroupService);
    }

    return entityCreated.id;
  }

  override async updateEntity(): Promise<void> {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.taskService.update(entityToUpdate));

    const groupId = this.entityForm.get('taskGroupId')?.value;
    if (typeof groupId === 'number') {
      await updateTaskGroupRelation(this.entityToEdit, groupId, this.taskGroupService);
    }
  }

  override async updateDataRelated(_isDuplicated: boolean): Promise<void> {
    await this.saveTranslations(this.entityToEdit);
  }

  protected documentExportOutputOptions() {
    return this.codeList('documentExport.output').filter((option) => option.value === 'pdf');
  }

  createObject(id: number = null): Task {
    let safeToEdit = TaskProjection.fromObject(this.entityToEdit);
    const values = this.entityForm.getRawValue();
    const properties = this.getDocumentExportProperties(this.entityToEdit?.properties);
    properties.exportEngine = values.exportEngine ?? undefined;
    properties.downloadFormat = values.output ?? undefined;
    properties.pageSize = values.pageSize ?? TaskDocumentExportFormComponent.DEFAULT_PAGE_SIZE;
    properties.pageOrientation = values.pageOrientation ?? TaskDocumentExportFormComponent.DEFAULT_PAGE_ORIENTATION;
    delete properties.downloadSource;

    safeToEdit = Object.assign(safeToEdit, {
      id,
      name: values.name,
      properties,
    });

    return Task.fromObject(safeToEdit);
  }

  private getDocumentExportProperties(raw: unknown): DocumentExportTaskProperties {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return {};
    }
    return { ...(raw as DocumentExportTaskProperties) };
  }

  private defineRolesTable(): DataTableDefinition<Role, Role> {
    return createTaskRolesTable(this.relationTableContext());
  }

  private defineAvailabilitiesTable(): DataTableDefinition<TaskAvailabilityProjection, TerritoryProjection> {
    return createTaskAvailabilitiesTable(this.relationTableContext());
  }

  private relationTableContext() {
    return {
      dialog: this.dialog,
      errorHandler: this.errorHandler,
      loadingService: this.loadingService,
      utils: this.utils,
      roleService: this.roleService,
      territoryService: this.territoryService,
      taskAvailabilityService: this.taskAvailabilityService,
      taskService: this.taskService,
      isNew: () => this.isNew(),
      entity: this.entityToEdit,
      entityId: this.entityID,
    };
  }
}
