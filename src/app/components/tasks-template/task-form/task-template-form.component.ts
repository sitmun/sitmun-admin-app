import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, map, of, startWith } from 'rxjs';

import { BaseFormComponent } from '@app/components/base-form.component';
import { DataTableDefinition } from '@app/components/data-tables.util';
import { Configuration } from '@app/core/config/configuration';
import { MessagesInterceptorStateService } from '@app/core/interceptors/messages.interceptor';
import {
  CodeListService,
  Role,
  RoleService,
  Task,
  TaskAvailability,
  TaskAvailabilityProjection,
  TaskAvailabilityService,
  TaskGroup,
  TaskGroupService,
  TaskRelation,
  TaskRelationService,
  TaskProjection,
  TaskPropertiesBuilder,
  TaskPropertiesContract,
  TaskService,
  TaskTemplatePreviewService,
  TemplateTaskExecutionEvent,
  TaskType,
  TaskTypeService,
  TerritoryProjection,
  TerritoryService,
  TranslationService,
} from '@app/domain';
import { ErrorHandlerService } from '@app/services/error-handler.service';
import { LoadingOverlayService } from '@app/services/loading-overlay.service';
import { LoggerService } from '@app/services/logger.service';
import { NotificationService } from '@app/services/notification.service';
import { UtilsService } from '@app/services/utils.service';
import { onCreate, onDelete, onUpdatedRelation, Status } from '@app/frontend-gui/src/lib/data-grid/data-grid.component';
import { environment } from '@environments/environment';
import { magic } from '@environments/constants';
import { TemplateChildTaskLink } from '../query-execution-card/query-execution-card.component';

interface LinkedTemplateTask {
  relationId: number | null;
  relationType: string;
  taskId: number;
  referenceAlias: string;
  draftReferenceAlias: string;
  name: string;
  typeLabel: string;
}

interface LinkableTemplateTask {
  relationType: string;
  taskId: number;
  name: string;
  typeLabel: string;
}

interface PendingReferenceAliasChange {
  linkedTask: LinkedTemplateTask;
  previousReferenceAlias: string;
  nextReferenceAlias: string;
}

@Component({
  selector: 'app-task-template-form',
  templateUrl: './task-template-form.component.html',
  styleUrl: './task-template-form.component.scss',
  standalone: false,
})
export class TaskTemplateFormComponent extends BaseFormComponent<TaskProjection> {
  private static readonly MAX_TEMPLATE_NESTING_LEVEL = 3;
  private static readonly REFERENCE_ALIAS_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;

  readonly config = Configuration.TASK_TEMPLATE;

  public override entityForm: FormGroup;
  protected readonly rolesTable: DataTableDefinition<Role, Role>;
  protected readonly availabilitiesTable: DataTableDefinition<TaskAvailabilityProjection, TerritoryProjection>;

  protected taskGroupList: TaskGroup[] = [];
  protected taskTypeNameTranslated: string = null;
  protected linkedTasks: LinkedTemplateTask[] = [];
  protected linkableTasks: LinkableTemplateTask[] = [];
  protected excludedAuthenticatedApiTasks = 0;
  protected nestingLimitWarning = '';
  protected taskLookup = new Map<number, TaskProjection>();
  protected templateChildTasks = new Map<number, TemplateChildTaskLink[]>();
  protected previewHtml = '';
  protected trustedPreviewHtml: SafeHtml = '';
  protected previewPlaceholders: string[] = [];
  protected previewError = '';
  protected previewDirty = true;
  protected systemVariables = new Map<string, string>();
  protected pendingReferenceAliasChange: PendingReferenceAliasChange | null = null;
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
    protected roleService: RoleService,
    protected territoryService: TerritoryService,
    protected taskAvailabilityService: TaskAvailabilityService,
    protected taskTemplatePreviewService: TaskTemplatePreviewService,
    protected notificationService: NotificationService,
    protected utils: UtilsService,
    protected http: HttpClient,
    protected domSanitizer: DomSanitizer,
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

  override async preFetchData() {
    const typeId = magic.taskTemplateTypeId;
    this.initTranslations('Task', ['name']);
    this.dataTables.register(this.rolesTable).register(this.availabilitiesTable);

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

    await this.loadTemplateChildTasks(templateTasks);
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
    this.nestingLimitWarning = '';

    if (!task || this.linkedTasks.some((linkedTask) => linkedTask.taskId === task.taskId && linkedTask.relationType === task.relationType)) {
      this.linkTaskSearchControl.setValue('');
      return;
    }

    if (task.relationType === 'template-nested' && this.exceedsTemplateNestingLimit(task.taskId)) {
      this.nestingLimitWarning = this.translateService.instant('entity.task.template.maxNestingWarning', {
        max: TaskTemplateFormComponent.MAX_TEMPLATE_NESTING_LEVEL,
      });
      this.linkTaskSearchControl.setValue('');
      return;
    }

    const referenceAlias = this.buildNextReferenceAlias();

    this.linkedTasks = [
      ...this.linkedTasks,
      {
        relationId: null,
        relationType: task.relationType,
        taskId: task.taskId,
        referenceAlias,
        draftReferenceAlias: referenceAlias,
        name: task.name,
        typeLabel: task.typeLabel,
      },
    ];
    this.entityForm.markAsDirty();
    this.linkTaskSearchControl.setValue('');
    this.markPreviewDirty();
  }

  protected removeLinkedTask(taskId: number, relationType: string) {
    this.linkedTasks = this.linkedTasks.filter((task) => !(task.taskId === taskId && task.relationType === relationType));
    this.entityForm.markAsDirty();
    this.markPreviewDirty();
  }

  protected resolveTask(taskId: number): TaskProjection | undefined {
    return this.taskLookup.get(taskId);
  }

  protected onTaskExecuted(response: TemplateTaskExecutionEvent) {
    this.entityToEdit.properties = this.entityToEdit.properties || {};
    const previewContext = ((this.entityToEdit.properties as Record<string, unknown>)['previewContext'] as Record<string, unknown> | undefined) || {};
    previewContext[response.referenceAlias] = response.context;
    previewContext[response.legacyReferenceAlias] = response.context;
    (this.entityToEdit.properties as Record<string, unknown>)['previewContext'] = previewContext;
    this.markPreviewDirty();
  }

  protected onReferenceAliasDraftChanged(linkedTask: LinkedTemplateTask, rawReferenceAlias: string) {
    linkedTask.draftReferenceAlias = rawReferenceAlias;
    if (this.pendingReferenceAliasChange?.linkedTask === linkedTask) {
      this.pendingReferenceAliasChange = null;
    }
  }

  protected async applyReferenceAliasChange(linkedTask: LinkedTemplateTask) {
    const nextReferenceAlias = linkedTask.draftReferenceAlias.trim();
    const previousReferenceAlias = linkedTask.referenceAlias;

    if (!nextReferenceAlias || nextReferenceAlias === previousReferenceAlias) {
      linkedTask.draftReferenceAlias = previousReferenceAlias;
      return;
    }

    if (!TaskTemplateFormComponent.REFERENCE_ALIAS_PATTERN.test(nextReferenceAlias)) {
      linkedTask.draftReferenceAlias = previousReferenceAlias;
      this.notificationService.showWarning('common.warnings.title', 'entity.task.template.invalidReferenceAlias');
      return;
    }

    if (this.linkedTasks.some((task) => task !== linkedTask && task.referenceAlias === nextReferenceAlias)) {
      linkedTask.draftReferenceAlias = previousReferenceAlias;
      this.notificationService.showWarning('common.warnings.title', 'entity.task.template.duplicateReferenceAlias');
      return;
    }

    const templateHtml = String(this.entityForm.get('templateHtml')?.value || '');
    if (this.templateContainsReferenceAlias(templateHtml, previousReferenceAlias)) {
      this.pendingReferenceAliasChange = {
        linkedTask,
        previousReferenceAlias,
        nextReferenceAlias,
      };
      return;
    }

    this.commitReferenceAliasChange(linkedTask, previousReferenceAlias, nextReferenceAlias, false);
  }

  protected confirmPendingReferenceAliasChange(replaceTemplateReferences: boolean) {
    const pendingChange = this.pendingReferenceAliasChange;
    if (!pendingChange) {
      return;
    }

    this.pendingReferenceAliasChange = null;
    this.commitReferenceAliasChange(
      pendingChange.linkedTask,
      pendingChange.previousReferenceAlias,
      pendingChange.nextReferenceAlias,
      replaceTemplateReferences,
    );
  }

  protected cancelPendingReferenceAliasChange() {
    const pendingChange = this.pendingReferenceAliasChange;
    if (!pendingChange) {
      return;
    }

    pendingChange.linkedTask.draftReferenceAlias = pendingChange.previousReferenceAlias;
    this.pendingReferenceAliasChange = null;
  }

  protected formatPendingReferenceAliasMessage(): string {
    if (!this.pendingReferenceAliasChange) {
      return '';
    }

    return this.translateService.instant('entity.task.template.replaceReferenceAliasConfirm', {
      previousReferenceAlias: this.pendingReferenceAliasChange.previousReferenceAlias,
      nextReferenceAlias: this.pendingReferenceAliasChange.nextReferenceAlias,
    });
  }

  private commitReferenceAliasChange(
    linkedTask: LinkedTemplateTask,
    previousReferenceAlias: string,
    nextReferenceAlias: string,
    replaceTemplateReferences: boolean,
  ) {
    if (replaceTemplateReferences) {
      this.replaceReferenceAliasInTemplate(previousReferenceAlias, nextReferenceAlias);
      this.replaceReferenceAliasInPreviewContext(previousReferenceAlias, nextReferenceAlias);
    }

    linkedTask.referenceAlias = nextReferenceAlias;
    linkedTask.draftReferenceAlias = nextReferenceAlias;

    this.entityForm.markAsDirty();
    this.markPreviewDirty();
  }

  protected hasPendingReferenceAliasChange(linkedTask: LinkedTemplateTask): boolean {
    return linkedTask.draftReferenceAlias.trim() !== linkedTask.referenceAlias;
  }

  protected resetReferenceAliasDraft(linkedTask: LinkedTemplateTask) {
    linkedTask.draftReferenceAlias = linkedTask.referenceAlias;
    if (this.pendingReferenceAliasChange?.linkedTask === linkedTask) {
      this.pendingReferenceAliasChange = null;
    }
  }

  protected getTaskTypeLabel(task: TaskProjection): string {
    if (task.typeId === magic.taskTemplateTypeId) {
      return this.translateService.instant('entity.task.template.label');
    }

    const scope = String(TaskPropertiesContract.getScope(task.properties) || '');
    return this.getScopeLabel(scope);
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
    const templateHtmlControl = this.entityForm.get('templateHtml');
    if (!templateHtmlControl) {
      return;
    }

    if (templateHtmlControl.value === html) {
      return;
    }

    templateHtmlControl.setValue(html, { emitEvent: false });
    templateHtmlControl.markAsDirty();
    this.entityForm.markAsDirty();
    this.markPreviewDirty();
  }

  protected renderPreview() {
    if (!this.entityForm) {
      return;
    }

    const previewContext = ((this.entityToEdit?.properties as Record<string, unknown> | undefined)?.['previewContext'] as Record<string, unknown> | undefined) || {};
    const templateHtml = String(this.entityForm.get('templateHtml')?.value || '');

    this.taskTemplatePreviewService.previewTemplate(
      templateHtml,
      previewContext,
      this.entityToEdit?.id ?? null,
      this.buildKnownTaskReferences(),
    ).subscribe({
      next: (response) => {
        this.previewHtml = response.html;
        this.trustedPreviewHtml = this.domSanitizer.bypassSecurityTrustHtml(this.previewHtml || '');
        this.previewPlaceholders = response.placeholders;
        this.previewError = '';
        this.previewDirty = false;
      },
      error: (error) => {
        this.previewHtml = '';
        this.trustedPreviewHtml = this.domSanitizer.bypassSecurityTrustHtml('');
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

  private buildNextReferenceAlias(): string {
    const usedAliases = new Set(this.linkedTasks.map((task) => task.referenceAlias));
    let index = 1;
    while (usedAliases.has(`task_${index}`)) {
      index += 1;
    }
    return `task_${index}`;
  }

  private buildLegacyReferenceAlias(taskId: number): string {
    return `task_${taskId}`;
  }

  private buildKnownTaskReferences(): string[] {
    return Array.from(new Set(this.linkedTasks.flatMap((linkedTask) => [
      linkedTask.referenceAlias,
      this.buildLegacyReferenceAlias(linkedTask.taskId),
    ])));
  }

  private exceedsTemplateNestingLimit(templateTaskId: number): boolean {
    const candidateDepth = this.calculateTemplateDepth(templateTaskId, new Set<number>());
    const resultingDepth = candidateDepth + 1;
    return resultingDepth > TaskTemplateFormComponent.MAX_TEMPLATE_NESTING_LEVEL;
  }

  private calculateTemplateDepth(templateTaskId: number, visited: Set<number>): number {
    if (visited.has(templateTaskId)) {
      return TaskTemplateFormComponent.MAX_TEMPLATE_NESTING_LEVEL + 1;
    }

    visited.add(templateTaskId);

    const children = this.templateChildTasks.get(templateTaskId) || [];
    let maxChildDepth = 0;
    for (const child of children) {
      if (child.task.typeId !== magic.taskTemplateTypeId) {
        continue;
      }

      const childDepth = this.calculateTemplateDepth(child.task.id, visited);
      maxChildDepth = Math.max(maxChildDepth, childDepth);
    }

    visited.delete(templateTaskId);
    return maxChildDepth + 1;
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
        referenceAlias: relation.referenceAlias || this.buildLegacyReferenceAlias(relatedTask.id),
        draftReferenceAlias: relation.referenceAlias || this.buildLegacyReferenceAlias(relatedTask.id),
        name: relatedTask.name,
        typeLabel,
      } satisfies LinkedTemplateTask;
    }));

    this.linkedTasks = linkedTasks;
  }

  private async loadTemplateChildTasks(templateTasks: TaskProjection[]) {
    this.templateChildTasks = new Map<number, TemplateChildTaskLink[]>();

    for (const templateTask of templateTasks) {
      const relations = await firstValueFrom(templateTask.getRelationArrayEx(TaskRelation, 'relations'));
      const templateRelations = relations.filter((relation) => ['template-task', 'template-nested'].includes(relation.relationType));

      const childTasks: TemplateChildTaskLink[] = [];
      for (const relation of templateRelations) {
        const relatedTask = await firstValueFrom(relation.getRelationEx(Task, 'relatedTask'));
        const relatedProjection = this.taskLookup.get(relatedTask.id) || TaskProjection.fromObject(relatedTask as unknown as TaskProjection);
        this.taskLookup.set(relatedProjection.id, relatedProjection);
        childTasks.push({
          task: relatedProjection,
          referenceAlias: relation.referenceAlias || this.buildLegacyReferenceAlias(relatedProjection.id),
        });
      }

      this.templateChildTasks.set(templateTask.id, childTasks);
    }
  }

  private async syncLinkedTaskRelations() {
    const existingRelations = await firstValueFrom(this.entityToEdit.getRelationArrayEx(TaskRelation, 'relations'));
    const matchingRelations = existingRelations.filter((relation) => ['template-task', 'template-nested'].includes(relation.relationType));
    const existingByKey = new Map<string, TaskRelation>();

    for (const relation of matchingRelations) {
      const relatedTask = await firstValueFrom(relation.getRelationEx(Task, 'relatedTask'));
      existingByKey.set(`${relation.relationType}:${relatedTask.id}`, relation);
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
      const relationKey = `${linkedTask.relationType}:${linkedTask.taskId}`;
      const existingRelation = existingByKey.get(relationKey);
      if (!existingRelation) {
        await firstValueFrom(this.taskRelationService.create(Object.assign(new TaskRelation(), {
          relationType: linkedTask.relationType,
          referenceAlias: linkedTask.referenceAlias,
          task: this.taskService.createProxy(this.entityID),
          relatedTask: this.taskService.createProxy(linkedTask.taskId),
        })));
        continue;
      }

      if (existingRelation.referenceAlias === linkedTask.referenceAlias) {
        continue;
      }

      await firstValueFrom(this.taskRelationService.update(Object.assign(existingRelation, {
        relationType: linkedTask.relationType,
        referenceAlias: linkedTask.referenceAlias,
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

  private templateContainsReferenceAlias(templateHtml: string, referenceAlias: string): boolean {
    const referencePattern = new RegExp(`\\{\\{\\{?\\s*${this.escapeRegExp(referenceAlias)}(?=[.\\s}\\[])`, 'g');
    return referencePattern.test(templateHtml);
  }

  private replaceReferenceAliasInTemplate(previousReferenceAlias: string, nextReferenceAlias: string) {
    const templateHtmlControl = this.entityForm.get('templateHtml');
    const currentHtml = String(templateHtmlControl?.value || '');
    const referencePattern = new RegExp(`(\\{\\{\\{?\\s*)${this.escapeRegExp(previousReferenceAlias)}(?=[.\\s}\\[])`, 'g');
    const nextHtml = currentHtml.replace(referencePattern, `$1${nextReferenceAlias}`);
    if (nextHtml === currentHtml) {
      return;
    }

    templateHtmlControl?.setValue(nextHtml, { emitEvent: false });
  }

  private replaceReferenceAliasInPreviewContext(previousReferenceAlias: string, nextReferenceAlias: string) {
    this.entityToEdit.properties = this.entityToEdit.properties || {};
    const previewContext = ((this.entityToEdit.properties as Record<string, unknown>)['previewContext'] as Record<string, unknown> | undefined) || {};
    if (!(previousReferenceAlias in previewContext)) {
      return;
    }

    previewContext[nextReferenceAlias] = previewContext[previousReferenceAlias];
    delete previewContext[previousReferenceAlias];
    (this.entityToEdit.properties as Record<string, unknown>)['previewContext'] = previewContext;
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private resolvePreviewError(error: unknown): string {
    const detail = (error as { error?: { detail?: unknown } } | undefined)?.error?.detail;
    if (typeof detail === 'string' && detail.trim().length > 0) {
      return detail;
    }

    return this.translateService.instant('entity.task.template.previewError');
  }

  private defineRolesTable(): DataTableDefinition<Role, Role> {
    return DataTableDefinition.builder<Role, Role>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef(
          'common.form.name',
          'name',
          '/role/:id/roleForm',
          { id: 'id' },
        ),
        this.utils.getNonEditableColumnDef('common.form.description', 'description'),
        this.utils.getStatusColumnDef(),
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(Role, 'roles', { projection: 'view' });
      })
      .withRelationsUpdater(async (roles: (Role & Status)[]) => {
        await onUpdatedRelation(roles).forAll((item) => this.entityToEdit.substituteAllRelation('roles', item));
      })
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
        this.utils.getNonEditableColumnDef('common.form.description', 'description'),
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.roleService.getAll())
      .withTargetsTitle(this.translateService.instant('entity.task.roles.title'))
      .build();
  }

  private defineAvailabilitiesTable(): DataTableDefinition<TaskAvailabilityProjection, TerritoryProjection> {
    return DataTableDefinition.builder<TaskAvailabilityProjection, TerritoryProjection>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef(
          'common.form.name',
          'territoryName',
          '/territory/:id/territoryForm',
          { id: 'territoryId' },
        ),
        this.utils.getNonEditableColumnDef('common.form.code', 'territoryCode'),
        this.utils.getNonEditableColumnDef('common.form.type', 'territoryTypeName'),
        this.utils.getNonEditableDateColumnDef('common.form.created', 'createdDate'),
        this.utils.getStatusColumnDef(),
      ])
      .withRelationsOrder('territoryName')
      .withRelationsFetcher(() => {
        if (!this.isNew()) {
          return this.entityToEdit.getRelationArrayEx(TaskAvailabilityProjection, 'availabilities', { projection: 'view' });
        }
        return of([]);
      })
      .withRelationsUpdater(async (availabilities: (TaskAvailabilityProjection & Status)[]) => {
        await onDelete(availabilities).forEach((item) => this.taskAvailabilityService.delete(this.taskAvailabilityService.createProxy(item.id)));
        await onCreate(availabilities)
          .map((item) => TaskAvailability.of(this.taskService.createProxy(this.entityID), this.territoryService.createProxy(item.territoryId)))
          .forEach((item) => this.taskAvailabilityService.create(item));
        availabilities.forEach((item) => item.newItem = false);
      })
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
        this.utils.getNonEditableColumnDef('common.form.code', 'code'),
        this.utils.getNonEditableColumnDef('common.form.type', 'typeName'),
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.territoryService.getAllProjection(TerritoryProjection))
      .withTargetInclude((availabilities: TaskAvailabilityProjection[]) => (item: TerritoryProjection) => {
        return !availabilities.some((availability) => availability.territoryId === item.id);
      })
      .withTargetToRelation((items: TerritoryProjection[]) => items.map((item) => TaskAvailabilityProjection.of(this.entityToEdit, item)))
      .withTargetsTitle(this.translateService.instant('entity.task.territories.title'))
      .withTargetsOrder('name')
      .build();
  }
}
