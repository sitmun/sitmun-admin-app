import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, map, of, startWith } from 'rxjs';

import { BaseFormComponent } from '@app/components/base-form.component';
import { Configuration } from '@app/core/config/configuration';
import { MessagesInterceptorStateService } from '@app/core/interceptors/messages.interceptor';
import {
  CodeListService,
  Task,
  TaskGroup,
  TaskGroupService,
  TaskRelation,
  TaskRelationService,
  TaskProjection,
  TaskPropertiesBuilder,
  TaskPropertiesContract,
  TaskService,
  TaskTemplatePreviewService,
  TemplateTaskExecutionResponse,
  TaskType,
  TaskTypeService,
  TranslationService,
} from '@app/domain';
import { ErrorHandlerService } from '@app/services/error-handler.service';
import { LoadingOverlayService } from '@app/services/loading-overlay.service';
import { LoggerService } from '@app/services/logger.service';
import { UtilsService } from '@app/services/utils.service';
import { environment } from '@environments/environment';
import { magic } from '@environments/constants';

interface LinkedTemplateTask {
  relationId: number | null;
  relationType: string;
  taskId: number;
  name: string;
  typeLabel: string;
}

interface LinkableTemplateTask {
  relationType: string;
  taskId: number;
  name: string;
  typeLabel: string;
}

@Component({
  selector: 'app-task-template-form',
  templateUrl: './task-template-form.component.html',
  styleUrl: './task-template-form.component.scss',
  standalone: false,
})
export class TaskTemplateFormComponent extends BaseFormComponent<TaskProjection> {
  readonly config = Configuration.TASK_TEMPLATE;

  public override entityForm: FormGroup;

  protected taskGroupList: TaskGroup[] = [];
  protected taskTypeNameTranslated: string = null;
  protected linkedTasks: LinkedTemplateTask[] = [];
  protected linkableTasks: LinkableTemplateTask[] = [];
  protected excludedAuthenticatedApiTasks = 0;
  protected taskLookup = new Map<number, TaskProjection>();
  protected previewHtml = '';
  protected previewPlaceholders: string[] = [];
  protected previewError = '';
  protected previewDirty = true;
  protected systemVariables = new Map<string, string>();
  protected linkTaskSearchControl = new FormControl<string | LinkableTemplateTask>('', { nonNullable: true });
  protected filteredLinkableTasks = of<LinkableTemplateTask[]>([]);
  protected validationFieldLabels: Record<string, string> = {
    name: 'entity.task.template.label',
    taskGroupId: 'entity.taskGroup.label',
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
    protected taskRelationService: TaskRelationService,
    protected taskTemplatePreviewService: TaskTemplatePreviewService,
    protected utils: UtilsService,
    protected http: HttpClient,
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
  }

  override async preFetchData() {
    const typeId = magic.taskTemplateTypeId;
    this.initTranslations('Task', ['name']);

    try {
      const variables = await firstValueFrom(
        this.http.get<Record<string, string>>(`${environment.apiBaseURL}/api/config/system/variables`),
      );
      this.systemVariables = new Map(Object.entries(variables));
    } catch (error) {
      console.warn('Failed to load system variables:', error);
    }

    const [taskTypes, taskGroups] = await Promise.all([
      firstValueFrom(this.taskTypeService.getAllEx()),
      firstValueFrom(this.taskGroupService.getAllEx()),
    ]);

    this.taskType = taskTypes.find((taskType) => taskType.id === typeId) ?? null;
    if (!this.taskType) {
      this.loggerService.warn(`Template task type ${typeId} not found yet in backend catalog`);
    }

    this.taskGroupList = taskGroups;
    this.taskTypeNameTranslated = this.translateService.instant('entity.task.template.label');

    const queryTaskOptions = { params: [{ key: 'type.id', value: magic.taskQueryTypeId }] };
    const templateTaskOptions = { params: [{ key: 'type.id', value: magic.taskTemplateTypeId }] };
    const [queryTasks, templateTasks] = await Promise.all([
      firstValueFrom(this.taskService.getAllProjection(TaskProjection, queryTaskOptions, undefined, 'tasks')),
      firstValueFrom(this.taskService.getAllProjection(TaskProjection, templateTaskOptions, undefined, 'tasks')),
    ]);

    [...queryTasks, ...templateTasks].forEach((task) => this.taskLookup.set(task.id, task));

    const validQueryTasks = this.filterLinkableQueryTasks(queryTasks);
    const nestedTemplates = templateTasks
      .filter((task) => task.id !== this.entityID && task.id !== this.duplicateID)
      .map((task) => this.toLinkableTask(task, 'template-nested', this.translateService.instant('entity.task.template.label')));

    this.linkableTasks = [
      ...validQueryTasks,
      ...nestedTemplates,
    ].sort((left, right) => left.name.localeCompare(right.name));
  }

  override async fetchRelatedData() {
    await this.loadTranslations(this.entityToEdit);
    await this.loadLinkedTasks();
  }

  override fetchOriginal(): Promise<TaskProjection> {
    return firstValueFrom(this.taskService.getProjection(TaskProjection, this.entityID));
  }

  override fetchCopy(): Promise<TaskProjection> {
    return firstValueFrom(
      this.taskService.getProjection(TaskProjection, this.duplicateID).pipe(
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

  override postFetchData() {
    this.entityForm = new FormGroup({
      name: new FormControl(this.entityToEdit?.name ?? '', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      taskGroupId: new FormControl(this.entityToEdit?.groupId ?? null, {
        validators: [Validators.required],
      }),
      templateHtml: new FormControl(TaskPropertiesContract.getTemplateHtml(this.entityToEdit?.properties) ?? '', {
        nonNullable: true,
      }),
    });

    this.filteredLinkableTasks = this.linkTaskSearchControl.valueChanges.pipe(
      startWith(this.linkTaskSearchControl.value),
      map((value) => {
        const searchValue = typeof value === 'string' ? value : value?.name || '';
        return this.filterLinkableTasksByText(searchValue);
      }),
    );

    this.previewHtml = '';
    this.previewPlaceholders = [];
    this.previewError = '';
    this.previewDirty = true;

    this.entityForm
      .get('templateHtml')
      ?.valueChanges.subscribe(() => {
        this.markPreviewDirty();
      });
  }

  override createEntity(): Promise<number> {
    return (async () => {
      const entityToCreate = this.createObject();
      const entityCreated = await firstValueFrom(this.taskService.create(entityToCreate));

      if (this.taskType) {
        await firstValueFrom(entityCreated.updateRelationEx('type', this.taskType));
      }

      const taskGroupId = this.entityForm.get('taskGroupId')?.value;
      if (typeof taskGroupId === 'number') {
        await firstValueFrom(entityCreated.updateRelationEx('group', this.taskGroupService.createProxy(taskGroupId)));
      }

      return entityCreated.id;
    })();
  }

  override updateEntity(): Promise<void> {
    return (async () => {
      const entityToUpdate = this.createObject(this.entityID);
      await firstValueFrom(this.taskService.update(entityToUpdate));

      const taskGroupId = this.entityForm.get('taskGroupId')?.value;
      if (typeof taskGroupId === 'number') {
        await firstValueFrom(entityToUpdate.updateRelationEx('group', this.taskGroupService.createProxy(taskGroupId)));
      }
    })();
  }

  override updateDataRelated(_isDuplicated: boolean): Promise<void> {
    return (async () => {
      await this.saveTranslations(this.entityToEdit);
      await this.syncLinkedTaskRelations();
    })();
  }

  protected getTaskGroupName(taskGroupId: number): string {
    return this.taskGroupList.find((group) => group.id === taskGroupId)?.name || '';
  }

  protected displayLinkableTask(task: LinkableTemplateTask | string): string {
    if (typeof task === 'string') {
      return task;
    }
    return task ? `${task.name} (ID: ${task.taskId})` : '';
  }

  protected onLinkableTaskSelected(event: MatAutocompleteSelectedEvent) {
    const task = event.option.value as LinkableTemplateTask;
    if (!task || this.linkedTasks.some((linkedTask) => linkedTask.taskId === task.taskId && linkedTask.relationType === task.relationType)) {
      this.linkTaskSearchControl.setValue('');
      return;
    }

    this.linkedTasks = [
      ...this.linkedTasks,
      {
        relationId: null,
        relationType: task.relationType,
        taskId: task.taskId,
        name: task.name,
        typeLabel: task.typeLabel,
      },
    ];
    this.entityForm.markAsDirty();
    this.linkTaskSearchControl.setValue('');
  }

  protected removeLinkedTask(taskId: number, relationType: string) {
    this.linkedTasks = this.linkedTasks.filter((task) => !(task.taskId === taskId && task.relationType === relationType));
    this.entityForm.markAsDirty();
    this.markPreviewDirty();
  }

  protected resolveTask(taskId: number): TaskProjection | undefined {
    return this.taskLookup.get(taskId);
  }

  protected onTaskExecuted(response: TemplateTaskExecutionResponse) {
    this.entityToEdit.properties = this.entityToEdit.properties || {};
    const previewContext = ((this.entityToEdit.properties as Record<string, unknown>)['previewContext'] as Record<string, unknown> | undefined) || {};
    previewContext[`task_${response.taskId}`] = response.context;
    (this.entityToEdit.properties as Record<string, unknown>)['previewContext'] = previewContext;
    this.markPreviewDirty();
  }

  protected onPlaceholderSelected(placeholder: string) {
    this.appendPlaceholderToTemplate(placeholder);
  }

  protected getSystemVariablesHelp(): string {
    return Array.from(this.systemVariables.keys())
      .sort((left, right) => left.localeCompare(right))
      .map((key) => `{{#${key}}}`)
      .join(', ');
  }

  protected onTemplateHtmlChanged(html: string) {
    this.entityForm.get('templateHtml')?.setValue(html);
  }

  protected renderPreview() {
    if (!this.entityForm) {
      return;
    }

    const previewContext = ((this.entityToEdit?.properties as Record<string, unknown> | undefined)?.['previewContext'] as Record<string, unknown> | undefined) || {};
    const templateHtml = String(this.entityForm.get('templateHtml')?.value || '');

    this.taskTemplatePreviewService.previewTemplate(templateHtml, previewContext).subscribe({
      next: (response) => {
        this.previewHtml = response.html;
        this.previewPlaceholders = response.placeholders;
        this.previewError = '';
        this.previewDirty = false;
      },
      error: (error) => {
        this.previewHtml = '';
        this.previewPlaceholders = [];
        this.previewError = this.resolvePreviewError(error);
        this.previewDirty = false;
      },
    });
  }

  private createObject(id: number | null = null): Task {
    const safeToEdit = TaskProjection.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();
    const properties = TaskPropertiesBuilder.from(this.entityToEdit?.properties)
      .withTemplateHtml(formValues.templateHtml || null)
      .withTemplateEditorState(TaskPropertiesContract.getTemplateEditorState(this.entityToEdit?.properties))
      .build();

    return Task.fromObject(
      Object.assign(safeToEdit, formValues, {
        id,
        properties,
      }),
    );
  }

  private filterLinkableQueryTasks(tasks: TaskProjection[]): LinkableTemplateTask[] {
    this.excludedAuthenticatedApiTasks = 0;

    return tasks.flatMap((task) => {
      if (task.typeId !== magic.taskQueryTypeId) {
        return [];
      }

      const scope = String(TaskPropertiesContract.getScope(task.properties) || '');
      if (!['sql-query', 'web-api-query', 'URL', 'resource'].includes(scope)) {
        return [];
      }

      if (scope === 'web-api-query' && this.hasAuthentication(task)) {
        this.excludedAuthenticatedApiTasks += 1;
        return [];
      }

      return [this.toLinkableTask(task, 'template-task', this.getScopeLabel(scope))];
    });
  }

  private hasAuthentication(task: TaskProjection): boolean {
    const authenticationMode = (task.properties as Record<string, unknown> | null)?.['authenticationMode'];
    return typeof authenticationMode === 'string' && authenticationMode.trim().length > 0;
  }

  private getScopeLabel(scope: string): string {
    return this.translateService.instant(`entity.task.query.scope.${scope}`);
  }

  private toLinkableTask(task: TaskProjection, relationType: string, typeLabel: string): LinkableTemplateTask {
    return {
      relationType,
      taskId: task.id,
      name: task.name,
      typeLabel,
    };
  }

  private filterLinkableTasksByText(value?: string): LinkableTemplateTask[] {
    const filterValue = (value || '').toLowerCase();
    return this.linkableTasks.filter((task) => `${task.name} ${task.taskId} ${task.typeLabel}`.toLowerCase().includes(filterValue));
  }

  private async loadLinkedTasks() {
    this.linkedTasks = [];

    if (this.isNew() || !this.entityToEdit) {
      return;
    }

    const relations = await firstValueFrom(this.entityToEdit.getRelationArrayEx(TaskRelation, 'relations'));
    const templateRelations = relations.filter((relation) => ['template-task', 'template-nested'].includes(relation.relationType));

    const linkedTasks = await Promise.all(templateRelations.map(async (relation) => {
      const relatedTask = await firstValueFrom(relation.getRelationEx(Task, 'relatedTask'));
      const typeLabel = relation.relationType === 'template-nested'
        ? this.translateService.instant('entity.task.template.label')
        : this.getScopeLabel(String(TaskPropertiesContract.getScope(relatedTask.properties) || ''));

      return {
        relationId: relation.id ?? null,
        relationType: relation.relationType,
        taskId: relatedTask.id,
        name: relatedTask.name,
        typeLabel,
      } satisfies LinkedTemplateTask;
    }));

    this.linkedTasks = linkedTasks.sort((left, right) => left.name.localeCompare(right.name));
  }

  private async syncLinkedTaskRelations() {
    const existingRelations = await firstValueFrom(this.entityToEdit.getRelationArrayEx(TaskRelation, 'relations'));
    const matchingRelations = existingRelations.filter((relation) => ['template-task', 'template-nested'].includes(relation.relationType));
    const existingKeys = new Set<string>();

    for (const relation of matchingRelations) {
      const relatedTask = await firstValueFrom(relation.getRelationEx(Task, 'relatedTask'));
      existingKeys.add(`${relation.relationType}:${relatedTask.id}`);
    }

    const desiredKeys = new Set(this.linkedTasks.map((task) => `${task.relationType}:${task.taskId}`));

    for (const relation of matchingRelations) {
      const relatedTask = await firstValueFrom(relation.getRelationEx(Task, 'relatedTask'));
      const relationKey = `${relation.relationType}:${relatedTask.id}`;
      if (!desiredKeys.has(relationKey)) {
        await firstValueFrom(this.taskRelationService.delete(relation));
      }
    }

    for (const linkedTask of this.linkedTasks) {
      if (existingKeys.has(`${linkedTask.relationType}:${linkedTask.taskId}`)) {
        continue;
      }

      await firstValueFrom(this.taskRelationService.create(Object.assign(new TaskRelation(), {
        relationType: linkedTask.relationType,
        task: this.taskService.createProxy(this.entityID),
        relatedTask: this.taskService.createProxy(linkedTask.taskId),
      })));
    }
  }

  private markPreviewDirty() {
    this.previewError = '';
    this.previewDirty = true;
  }

  private appendPlaceholderToTemplate(placeholder: string) {
    const currentHtml = String(this.entityForm.get('templateHtml')?.value || '');
    const nextHtml = !currentHtml || currentHtml === '<p><br></p>'
      ? `<p>${placeholder}</p>`
      : `${currentHtml}<p>${placeholder}</p>`;

    this.entityForm.get('templateHtml')?.setValue(nextHtml);
    this.entityForm.markAsDirty();
  }

  private resolvePreviewError(error: unknown): string {
    const detail = (error as { error?: { detail?: unknown } } | undefined)?.error?.detail;
    if (typeof detail === 'string' && detail.trim().length > 0) {
      return detail;
    }

    return this.translateService.instant('entity.task.template.previewError');
  }
}
