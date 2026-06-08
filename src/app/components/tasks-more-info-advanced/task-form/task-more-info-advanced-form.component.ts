import {Component, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom, map, Observable, of, startWith} from 'rxjs';

import {BaseFormComponent} from '@app/components/base-form.component';
import {DataTableDefinition, TemplateDialog} from '@app/components/data-tables.util';
import {Configuration} from '@app/core/config/configuration';
import {MessagesInterceptorStateService} from '@app/core/interceptors/messages.interceptor';
import {
  Cartography,
  CartographyService,
  CodeListService,
  Role,
  RoleService,
  Task,
  TaskAvailability,
  TaskAvailabilityProjection,
  TaskAvailabilityService,
  TaskGroup,
  TaskGroupService,
  TaskMoreInfoParameter,
  TaskProjection,
  TaskRelation,
  TaskPropertiesBuilder,
  TaskService,
  TaskType,
  TaskTypeService,
  TerritoryProjection,
  TerritoryService,
  TranslationService
} from '@app/domain';
import {
  canKeepOrUpdate,
  onCreate,
  onDelete,
  onUpdatedRelation,
  Status
} from '@app/frontend-gui/src/lib/data-grid/data-grid.component';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {magic} from '@environments/constants';
import {constants} from '@environments/constants';

/**
 * Properties stored in task.properties for an MIA task.
 * An MIA task is always a container/grouper.
 */
interface MiaTaskProperties {
  parentLayout?: string;
  childTaskOrderIds?: number[];
  moreInfoAdvanced?: boolean;
  parameters?: unknown[];
  childTaskParameters?: Record<string, Record<string, string>>;
  templateChildTaskParameters?: Record<string, Record<string, Record<string, string>>>;
}

interface ChildParamMapping {
  miaParam: string;
  childParam: string;
}

interface TemplateChildTaskLink {
  task: TaskProjection;
  referenceAlias: string;
}

interface MappingRowView {
  mapping: ChildParamMapping;
  availableMiaParams: TaskMoreInfoParameter[];
}

interface TemplateChildMappingView {
  key: string;
  rootTemplateTaskId: number;
  task: TaskProjection;
  referenceAlias: string;
  depth: number;
  isTemplate: boolean;
  renderAsAccordion: boolean;
  expandedByDefault: boolean;
  expanded: boolean;
  mappings: ChildParamMapping[];
  mappingRows: MappingRowView[];
  childParameters: TaskMoreInfoParameter[];
  canAddMapping: boolean;
  childNodes: TemplateChildMappingView[];
}

interface IncludedTaskMappingView {
  task: TaskProjection;
  mappings: ChildParamMapping[];
  mappingRows: MappingRowView[];
  childParameters: TaskMoreInfoParameter[];
  canAddMapping: boolean;
  isTemplate: boolean;
  templateChildViews: TemplateChildMappingView[];
}

@Component({
  selector: 'app-task-more-info-advanced-form',
  templateUrl: './task-more-info-advanced-form.component.html',
  styleUrl: './task-more-info-advanced-form.component.scss',
  standalone: false
})
export class TaskMoreInfoAdvancedFormComponent extends BaseFormComponent<TaskProjection> {
  readonly config = Configuration.TASK_MORE_INFO_ADVANCED;

  public override entityForm: FormGroup;

  @ViewChild('newParameterDialog', {static: true})
  private readonly newParameterDialog: TemplateRef<any>;

  protected readonly rolesTable: DataTableDefinition<Role, Role>;
  protected readonly availabilitiesTable: DataTableDefinition<TaskAvailabilityProjection, TerritoryProjection>;
  protected readonly parametersTable: DataTableDefinition<TaskMoreInfoParameter, TaskMoreInfoParameter>;

  /** Per-child-task parameter mappings: taskId -> array of mappings */
  protected childTaskParameterMappings: Map<number, ChildParamMapping[]> = new Map();

  /** Nested mappings: templateTaskId -> innerTaskId -> array of mappings */
  protected templateChildTaskParameterMappings: Map<number, Map<number, ChildParamMapping[]>> = new Map();

  /** Linked child tasks for each included Template task */
  protected templateChildTasks: Map<number, TemplateChildTaskLink[]> = new Map();

  protected templateExpansionState: Map<string, boolean> = new Map();

  protected miaParameters: TaskMoreInfoParameter[] = [];
  protected includedTaskMappingViews: IncludedTaskMappingView[] = [];

  private taskType: TaskType = null;
  private readonly taskTypeId = magic.taskMoreInfoAdvancedTypeId;

  /** Task type IDs allowed as children of an MIA task: query (5) + template (15) */
  private readonly allowedChildTypeIds = [magic.taskQueryTypeId, magic.taskTemplateTypeId]; // 5, 15

  /** Scope to exclude within query tasks: cartography queries cannot be included */
  private readonly excludedScope = constants.codeValue.queryTaskScope.cartographyQuery;

  protected taskTypeNameTranslated: string = null;
  protected taskGroups: TaskGroup[] = [];
  protected cartographies: Cartography[] = [];

  /** All candidate tasks that can be included as children */
  private allCandidateTasks: TaskProjection[] = [];

  /** Currently included tasks in display order */
  protected includedTasks: TaskProjection[] = [];

  // Cartography autocomplete
  protected cartographySearchControl = new FormControl<string | Cartography>('', {
    validators: [Validators.required, this.cartographyValidator.bind(this)],
    nonNullable: true
  });
  protected filteredCartographies: Observable<Cartography[]> = of([]);
  protected cartographyErrorMatcher = new CartographyErrorStateMatcher();

  // Add task autocomplete
  protected addTaskControl = new FormControl<string | TaskProjection>('');
  protected filteredAvailableTasks: Observable<TaskProjection[]> = of([]);

  protected readonly parentLayouts: Array<{ value: string, key: string }> = [
    {value: 'tabs', key: 'tasksMoreInfoAdvancedEntity.parentLayout.tabs'},
    {value: 'scroll', key: 'tasksMoreInfoAdvancedEntity.parentLayout.scroll'}
  ];

  protected readonly trackTaskById = (_index: number, task: TaskProjection): number => task.id;
  protected readonly trackIncludedTaskMappingView = (_index: number, view: IncludedTaskMappingView): number => view.task.id;
  protected readonly trackMappingRow = (_index: number, row: MappingRowView): ChildParamMapping => row.mapping;
  protected readonly trackTemplateChildMappingView = (_index: number, view: TemplateChildMappingView): string => view.key;

  private readonly maxTemplateNestingDepth = 6;

  protected validationFieldLabels: Record<string, string> = {
    'name': 'entity.task.label',
    'taskGroupId': 'tasksMoreInfoAdvancedEntity.taskGroup',
    'cartographyId': 'tasksMoreInfoAdvancedEntity.cartography'
  };

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
    protected cartographyService: CartographyService,
    protected utils: UtilsService,
    protected roleService: RoleService,
    protected territoryService: TerritoryService,
    protected taskAvailabilityService: TaskAvailabilityService
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router, loadingService, messagesInterceptorState);
    this.rolesTable = this.defineRolesTable();
    this.availabilitiesTable = this.defineAvailabilitiesTable();
    this.parametersTable = this.defineParametersTable();
  }

  override async preFetchData(): Promise<void> {
    this.dataTables.register(this.rolesTable)
      .register(this.availabilitiesTable)
      .register(this.parametersTable);

    this.initTranslations('Task', ['name']);

    const [taskTypes, taskGroups, cartographies, candidateTasks] = await Promise.all([
      firstValueFrom(this.taskTypeService.getAllEx()),
      firstValueFrom(this.taskGroupService.getAllEx()),
      firstValueFrom(this.cartographyService.getAll()),
      this.fetchCandidateChildTasks()
    ]);

    this.taskType = taskTypes.find(t => t.id === this.taskTypeId);
    if (!this.taskType) {
      this.loggerService.error(`Task type ${this.taskTypeId} not found`);
    }

    this.taskTypeNameTranslated = this.translateService.instant('entity.task.moreInfoAdvanced.label');
    this.taskGroups = (taskGroups || []).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    this.cartographies = cartographies;
    this.allCandidateTasks = candidateTasks;
    await this.loadTemplateChildTasks(candidateTasks);
  }

  override async fetchRelatedData(): Promise<void> {
    return this.loadTranslations(this.entityToEdit);
  }

  override fetchOriginal(): Promise<TaskProjection> {
    return firstValueFrom(this.taskService.getProjection(TaskProjection, this.entityID));
  }

  override fetchCopy(): Promise<TaskProjection> {
    return firstValueFrom(this.taskService.getProjection(TaskProjection, this.duplicateID).pipe(map((copy: TaskProjection) => {
      copy.name = this.translateService.instant('copy_') + copy.name;
      return copy;
    })));
  }

  override empty(): TaskProjection {
    return new TaskProjection();
  }

  override postFetchData(): void {
    const properties = this.getMiaProperties(this.entityToEdit?.properties);

    this.entityForm = new FormGroup({
      name: new FormControl(this.entityToEdit.name, {
        validators: [Validators.required],
        nonNullable: true
      }),
      taskGroupId: new FormControl(this.entityToEdit.groupId, {
        validators: [Validators.required],
        nonNullable: true
      }),
      cartographyId: new FormControl(this.entityToEdit.cartographyId, {
        validators: [Validators.required],
        nonNullable: true
      }),
      parentLayout: new FormControl(properties.parentLayout || 'tabs', {
        nonNullable: true
      })
    });

    // Restore included tasks from stored order
    this.restoreIncludedTasks(properties);

    // Restore child task parameter mappings
    this.restoreChildTaskParameterMappings(properties);
    this.restoreTemplateChildTaskParameterMappings(properties);
    this.rebuildIncludedTaskMappingViews();

    // Cartography autocomplete setup
    const selectedCartography = this.cartographies.find(c => c.id === this.entityToEdit.cartographyId);
    this.cartographySearchControl.setValue(selectedCartography || '');
    this.filteredCartographies = this.cartographySearchControl.valueChanges.pipe(
      startWith(this.cartographySearchControl.value),
      map(value => {
        const searchValue = typeof value === 'string' ? value : value?.name || '';
        return this.filterCartographies(searchValue);
      })
    );

    // Add task autocomplete setup
    this.filteredAvailableTasks = this.addTaskControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const searchValue = typeof value === 'string' ? value : '';
        return this.filterAvailableTasks(searchValue);
      })
    );
  }

  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const entityCreated = await firstValueFrom(this.taskService.create(entityToCreate));

    await firstValueFrom(entityCreated.updateRelationEx('type', this.taskType));

    const groupId = this.entityForm.get('taskGroupId')?.value;
    if (typeof groupId === 'number') {
      const proxyGroup = this.taskGroupService.createProxy(groupId);
      await firstValueFrom(entityCreated.updateRelationEx('group', proxyGroup));
    }

    return entityCreated.id;
  }

  override async updateEntity(): Promise<void> {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.taskService.update(entityToUpdate));

    const groupId = this.entityForm.get('taskGroupId')?.value;
    if (typeof groupId === 'number') {
      const proxyGroup = this.taskGroupService.createProxy(groupId);
      await firstValueFrom(this.entityToEdit.updateRelationEx('group', proxyGroup));
    }
  }

  override async updateDataRelated(_isDuplicated: boolean): Promise<void> {
    await this.saveTranslations(this.entityToEdit);

    const cartographyId = this.entityForm.get('cartographyId')?.value;
    if (typeof cartographyId === 'number') {
      await firstValueFrom(this.entityToEdit.updateRelationEx('cartography', this.cartographyService.createProxy(cartographyId)));
    } else {
      await firstValueFrom(this.entityToEdit.deleteAllRelation('cartography'));
    }
  }

  createObject(id: number = null): Task {
    let safeToEdit = TaskProjection.fromObject(this.entityToEdit);
    const values = this.entityForm.getRawValue();

    const childTaskParameters: Record<string, Record<string, string>> = {};
    const templateChildTaskParameters: Record<string, Record<string, Record<string, string>>> = {};
    const miaParams: unknown[] = Array.isArray(this.entityToEdit?.properties?.parameters)
      ? this.entityToEdit.properties.parameters : [];
    this.childTaskParameterMappings.forEach((mappings, taskId) => {
      const map = this.serializeMappings(mappings, miaParams);
      if (Object.keys(map).length > 0) {
        childTaskParameters[String(taskId)] = map;
      }
    });
    this.templateChildTaskParameterMappings.forEach((innerMappings, templateTaskId) => {
      const serializedInnerMappings: Record<string, Record<string, string>> = {};
      innerMappings.forEach((mappings, innerTaskId) => {
        const map = this.serializeMappings(mappings, miaParams);
        if (Object.keys(map).length > 0) {
          serializedInnerMappings[String(innerTaskId)] = map;
        }
      });
      if (Object.keys(serializedInnerMappings).length > 0) {
        templateChildTaskParameters[String(templateTaskId)] = serializedInnerMappings;
      }
    });

    const properties: MiaTaskProperties = {
      parentLayout: values.parentLayout,
      childTaskOrderIds: this.includedTasks.map(t => t.id),
      moreInfoAdvanced: true,
      parameters: Array.isArray(this.entityToEdit?.properties?.parameters) ? this.entityToEdit.properties.parameters : [],
      childTaskParameters,
      templateChildTaskParameters
    };

    safeToEdit = Object.assign(safeToEdit, {
      id,
      name: values.name,
      cartographyId: values.cartographyId,
      properties
    });

    return Task.fromObject(safeToEdit);
  }

  // --- Cartography helpers ---

  onCartographySelected(event: MatAutocompleteSelectedEvent): void {
    const cartography = event.option.value as Cartography;
    if (cartography?.id) {
      this.entityForm.get('cartographyId')?.setValue(cartography.id);
      this.entityForm.markAsDirty();
      this.cartographySearchControl.updateValueAndValidity();
    }
  }

  displayCartography(cartography: Cartography | string): string {
    if (typeof cartography === 'string') {
      return cartography;
    }
    return cartography?.name || '';
  }

  clearCartography(): void {
    this.cartographySearchControl.setValue('');
    this.entityForm.get('cartographyId')?.setValue(null);
    this.entityForm.markAsDirty();
  }

  // --- Included tasks management ---

  onTaskSelected(event: MatAutocompleteSelectedEvent): void {
    const task = event.option.value as TaskProjection;
    if (task?.id && !this.includedTasks.some(t => t.id === task.id)) {
      this.includedTasks = [...this.includedTasks, task];
      this.initializeMappingArraysForTask(task);
      this.rebuildIncludedTaskMappingViews();
      this.entityForm.markAsDirty();
    }
    // Clear the input after selection
    this.addTaskControl.setValue('');
  }

  displayTask(task: TaskProjection | string): string {
    if (typeof task === 'string') {
      return task;
    }
    return '';
  }

  moveTaskUp(index: number): void {
    if (index <= 0) return;
    const tasks = [...this.includedTasks];
    [tasks[index - 1], tasks[index]] = [tasks[index], tasks[index - 1]];
    this.includedTasks = tasks;
    this.rebuildIncludedTaskMappingViews();
    this.entityForm.markAsDirty();
  }

  moveTaskDown(index: number): void {
    if (index >= this.includedTasks.length - 1) return;
    const tasks = [...this.includedTasks];
    [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
    this.includedTasks = tasks;
    this.rebuildIncludedTaskMappingViews();
    this.entityForm.markAsDirty();
  }

  removeTask(index: number): void {
    const removed = this.includedTasks[index];
    this.includedTasks = this.includedTasks.filter((_, i) => i !== index);
    if (removed) {
      this.childTaskParameterMappings.delete(removed.id);
      this.templateChildTaskParameterMappings.delete(removed.id);
    }
    this.rebuildIncludedTaskMappingViews();
    this.entityForm.markAsDirty();
  }

  // --- Child task parameter mapping helpers ---

  getMiaParameters(): TaskMoreInfoParameter[] {
    return this.miaParameters;
  }

  getChildParameters(task: TaskProjection): TaskMoreInfoParameter[] {
    const raw = (task as any)?.properties?.parameters;
    return Array.isArray(raw)
      ? raw
        .map(parameter => this.normalizeChildParameter(parameter))
        .filter((parameter): parameter is TaskMoreInfoParameter => !!parameter)
      : [];
  }

  isTemplateTask(task: TaskProjection): boolean {
    return task?.typeId === magic.taskTemplateTypeId;
  }

  getTemplateChildLinks(task: TaskProjection): TemplateChildTaskLink[] {
    if (!this.isTemplateTask(task)) {
      return [];
    }
    return this.templateChildTasks.get(task.id) || [];
  }

  getChildMappings(taskId: number): ChildParamMapping[] {
    return this.childTaskParameterMappings.get(taskId) || [];
  }

  addChildMapping(taskId: number): void {
    const mappings = this.ensureChildMappings(taskId);
    mappings.push({miaParam: '', childParam: ''});
    this.rebuildIncludedTaskMappingViews();
    this.entityForm.markAsDirty();
  }

  removeChildMapping(taskId: number, index: number): void {
    const mappings = this.ensureChildMappings(taskId);
    mappings.splice(index, 1);
    this.rebuildIncludedTaskMappingViews();
    this.entityForm.markAsDirty();
  }

  getTemplateChildMappings(templateTaskId: number, innerTaskId: number): ChildParamMapping[] {
    return this.templateChildTaskParameterMappings.get(templateTaskId)?.get(innerTaskId) || [];
  }

  addTemplateChildMapping(templateTaskId: number, innerTaskId: number): void {
    const mappings = this.ensureTemplateChildMappings(templateTaskId, innerTaskId);
    mappings.push({miaParam: '', childParam: ''});
    this.rebuildIncludedTaskMappingViews();
    this.entityForm.markAsDirty();
  }

  removeTemplateChildMapping(templateTaskId: number, innerTaskId: number, index: number): void {
    const mappings = this.ensureTemplateChildMappings(templateTaskId, innerTaskId);
    mappings.splice(index, 1);
    this.rebuildIncludedTaskMappingViews();
    this.entityForm.markAsDirty();
  }

  addMapping(taskId: number, rootTemplateTaskId?: number): void {
    if (typeof rootTemplateTaskId === 'number') {
      this.addTemplateChildMapping(rootTemplateTaskId, taskId);
      return;
    }
    this.addChildMapping(taskId);
  }

  removeMapping(taskId: number, index: number, rootTemplateTaskId?: number): void {
    if (typeof rootTemplateTaskId === 'number') {
      this.removeTemplateChildMapping(rootTemplateTaskId, taskId, index);
      return;
    }
    this.removeChildMapping(taskId, index);
  }

  setTemplateNodeExpanded(key: string, expanded: boolean): void {
    this.templateExpansionState.set(key, expanded);
  }

  getAvailableMiaParams(taskId: number, currentIndex: number): TaskMoreInfoParameter[] {
    const allMia = this.getMiaParameters();
    const mappings = this.getChildMappings(taskId);
    const usedParams = new Set(
      mappings
        .filter((_, i) => i !== currentIndex)
        .map(m => m.miaParam)
        .filter(p => !!p)
    );
    return allMia.filter(p => !usedParams.has(p.label));
  }

  getAvailableMiaParamsForTemplateChild(templateTaskId: number, innerTaskId: number, currentIndex: number): TaskMoreInfoParameter[] {
    const allMia = this.getMiaParameters();
    const mappings = this.getTemplateChildMappings(templateTaskId, innerTaskId);
    const usedParams = new Set(
      mappings
        .filter((_, i) => i !== currentIndex)
        .map(m => m.miaParam)
        .filter(p => !!p)
    );
    return allMia.filter(p => !usedParams.has(p.label));
  }

  onMappingChanged(): void {
    this.rebuildIncludedTaskMappingViews();
    this.entityForm.markAsDirty();
  }

  getTaskTypeName(task: TaskProjection): string {
    return task.typeName || this.translateService.instant('common.form.unknown');
  }

  // --- Private helpers ---

  private async fetchCandidateChildTasks(): Promise<TaskProjection[]> {
    const allTasks = await firstValueFrom(
      this.taskService.getAllProjection(TaskProjection)
    );
    return (allTasks || []).filter(task =>
      this.allowedChildTypeIds.includes(task.typeId) &&
      !(task.typeId === magic.taskQueryTypeId && task.properties?.['scope'] === this.excludedScope) &&
      task.id !== this.entityID
    );
  }

  private getMiaProperties(raw: unknown): MiaTaskProperties {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return {};
    }
    return {...(raw as MiaTaskProperties)};
  }

  private restoreIncludedTasks(properties: MiaTaskProperties): void {
    const storedIds = this.normalizeIds(properties.childTaskOrderIds);
    const byId = new Map(this.allCandidateTasks.map(t => [t.id, t]));
    this.includedTasks = storedIds
      .map(id => byId.get(id))
      .filter((t): t is TaskProjection => !!t);
  }

  private restoreChildTaskParameterMappings(properties: MiaTaskProperties): void {
    this.childTaskParameterMappings = new Map();
    const raw = properties.childTaskParameters;
    const miaParams: any[] = Array.isArray(properties.parameters) ? properties.parameters as any[] : [];
    if (raw && typeof raw === 'object') {
      Object.entries(raw).forEach(([taskIdStr, mappingObj]) => {
        const taskId = Number(taskIdStr);
        if (!isNaN(taskId) && mappingObj && typeof mappingObj === 'object') {
          this.childTaskParameterMappings.set(taskId, this.deserializeMappings(mappingObj as Record<string, unknown>, miaParams));
        }
      });
    }
  }

  private restoreTemplateChildTaskParameterMappings(properties: MiaTaskProperties): void {
    this.templateChildTaskParameterMappings = new Map();
    const raw = properties.templateChildTaskParameters;
    const miaParams: any[] = Array.isArray(properties.parameters) ? properties.parameters as any[] : [];
    if (!raw || typeof raw !== 'object') {
      return;
    }
    Object.entries(raw).forEach(([templateTaskIdStr, innerMappingsObj]) => {
      const templateTaskId = Number(templateTaskIdStr);
      if (isNaN(templateTaskId) || !innerMappingsObj || typeof innerMappingsObj !== 'object') {
        return;
      }
      const innerMappings = new Map<number, ChildParamMapping[]>();
      Object.entries(innerMappingsObj).forEach(([innerTaskIdStr, mappingObj]) => {
        const innerTaskId = Number(innerTaskIdStr);
        if (!isNaN(innerTaskId) && mappingObj && typeof mappingObj === 'object') {
          innerMappings.set(innerTaskId, this.deserializeMappings(mappingObj as Record<string, unknown>, miaParams));
        }
      });
      this.templateChildTaskParameterMappings.set(templateTaskId, innerMappings);
    });
  }

  private serializeMappings(mappings: ChildParamMapping[], miaParams: unknown[]): Record<string, string> {
    const map: Record<string, string> = {};
    mappings
      .filter(m => m.miaParam && m.childParam)
      .forEach(m => {
        const miaParamObj = miaParams.find((p: any) => p.label === m.miaParam) as any;
        if (!miaParamObj) {
          return;
        }
        const featureField = miaParamObj?.value || m.miaParam;
        map[m.childParam] = featureField;
      });
    return map;
  }

  private deserializeMappings(mappingObj: Record<string, unknown>, miaParams: any[]): ChildParamMapping[] {
    return Object.entries(mappingObj)
      .map(([childParam, featureField]) => {
        const miaParamObj = miaParams.find(p => p.value === featureField);
        const miaParam = miaParamObj?.label || String(featureField);
        return {miaParam, childParam};
      });
  }

  private pruneStoredChildTaskParameters(
    raw: unknown,
    parametersToSave: TaskMoreInfoParameter[]
  ): Record<string, Record<string, string>> {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return {};
    }
    const declaredFeatureFields = this.getDeclaredFeatureFields(parametersToSave);
    const pruned: Record<string, Record<string, string>> = {};
    Object.entries(raw as Record<string, unknown>).forEach(([taskId, mappingObj]) => {
      if (!mappingObj || typeof mappingObj !== 'object' || Array.isArray(mappingObj)) {
        return;
      }
      const validMappings = this.pruneStoredMappings(mappingObj as Record<string, unknown>, declaredFeatureFields);
      if (Object.keys(validMappings).length > 0) {
        pruned[taskId] = validMappings;
      }
    });
    return pruned;
  }

  private pruneStoredTemplateChildTaskParameters(
    raw: unknown,
    parametersToSave: TaskMoreInfoParameter[]
  ): Record<string, Record<string, Record<string, string>>> {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return {};
    }
    const declaredFeatureFields = this.getDeclaredFeatureFields(parametersToSave);
    const pruned: Record<string, Record<string, Record<string, string>>> = {};
    Object.entries(raw as Record<string, unknown>).forEach(([templateTaskId, innerMappingsObj]) => {
      if (!innerMappingsObj || typeof innerMappingsObj !== 'object' || Array.isArray(innerMappingsObj)) {
        return;
      }
      const prunedInnerMappings: Record<string, Record<string, string>> = {};
      Object.entries(innerMappingsObj as Record<string, unknown>).forEach(([innerTaskId, mappingObj]) => {
        if (!mappingObj || typeof mappingObj !== 'object' || Array.isArray(mappingObj)) {
          return;
        }
        const validMappings = this.pruneStoredMappings(mappingObj as Record<string, unknown>, declaredFeatureFields);
        if (Object.keys(validMappings).length > 0) {
          prunedInnerMappings[innerTaskId] = validMappings;
        }
      });
      if (Object.keys(prunedInnerMappings).length > 0) {
        pruned[templateTaskId] = prunedInnerMappings;
      }
    });
    return pruned;
  }

  private pruneStoredMappings(mappingObj: Record<string, unknown>, declaredFeatureFields: Set<string>): Record<string, string> {
    const pruned: Record<string, string> = {};
    Object.entries(mappingObj).forEach(([childParam, featureField]) => {
      if (typeof featureField === 'string' && declaredFeatureFields.has(featureField)) {
        pruned[childParam] = featureField;
      }
    });
    return pruned;
  }

  private getDeclaredFeatureFields(parametersToSave: TaskMoreInfoParameter[]): Set<string> {
    return new Set(parametersToSave
      .map(parameter => parameter.value || parameter.label)
      .filter((value): value is string => typeof value === 'string' && value.length > 0));
  }

  private async loadTemplateChildTasks(candidateTasks: TaskProjection[]): Promise<void> {
    this.templateChildTasks = new Map();
    const byId = new Map(candidateTasks.map(t => [t.id, t]));
    const templateTasks = candidateTasks.filter(task => task.typeId === magic.taskTemplateTypeId);

    const visited = new Set<number>();
    const loading = new Set<number>();

    for (const templateTask of templateTasks) {
      await this.loadTemplateChildTasksRecursively(templateTask, byId, visited, loading, 0);
    }
  }

  private async loadTemplateChildTasksRecursively(
    templateTask: TaskProjection,
    byId: Map<number, TaskProjection>,
    visited: Set<number>,
    loading: Set<number>,
    depth: number
  ): Promise<void> {
    if (!templateTask?.id || templateTask.typeId !== magic.taskTemplateTypeId) {
      return;
    }
    if (visited.has(templateTask.id)) {
      return;
    }
    if (loading.has(templateTask.id)) {
      this.loggerService.warn(`Detected recursive template relation for template ${templateTask.id}`);
      this.templateChildTasks.set(templateTask.id, this.templateChildTasks.get(templateTask.id) || []);
      return;
    }
    if (depth >= this.maxTemplateNestingDepth) {
      this.loggerService.warn(`Template nesting depth exceeded for template ${templateTask.id}`);
      this.templateChildTasks.set(templateTask.id, this.templateChildTasks.get(templateTask.id) || []);
      return;
    }

    loading.add(templateTask.id);
    const childLinks: TemplateChildTaskLink[] = [];
    let relations: TaskRelation[] = [];
    try {
      relations = await firstValueFrom(templateTask.getRelationArrayEx(TaskRelation, 'relations'));
    } catch (error) {
      this.loggerService.warn(`Unable to load child tasks for template ${templateTask.id}`, error);
      this.templateChildTasks.set(templateTask.id, childLinks);
      loading.delete(templateTask.id);
      visited.add(templateTask.id);
      return;
    }

    for (const relation of relations.filter(r => ['template-task', 'template-nested'].includes(r.relationType))) {
      try {
        const relatedTask = await firstValueFrom(relation.getRelationEx(Task, 'relatedTask'));
        if (!relatedTask?.id) {
          continue;
        }
        const cachedTask = byId.get(relatedTask.id);
        const relatedProjection = cachedTask
          || (typeof (relatedTask as any).getRelationArrayEx === 'function'
            ? relatedTask as unknown as TaskProjection
            : TaskProjection.fromObject(relatedTask as unknown as TaskProjection));
        byId.set(relatedProjection.id, relatedProjection);
        childLinks.push({
          task: relatedProjection,
          referenceAlias: relation.referenceAlias || `task_${relatedProjection.id}`
        });
        if (relatedProjection.typeId === magic.taskTemplateTypeId) {
          await this.loadTemplateChildTasksRecursively(relatedProjection, byId, visited, loading, depth + 1);
        }
      } catch (error) {
        this.loggerService.warn(`Unable to load related task for template ${templateTask.id}`, error);
      }
    }

    this.templateChildTasks.set(templateTask.id, childLinks);
    loading.delete(templateTask.id);
    visited.add(templateTask.id);
  }

  private rebuildIncludedTaskMappingViews(): void {
    this.miaParameters = this.readMiaParameters();
    this.includedTasks.forEach(task => this.initializeMappingArraysForTask(task));
    this.includedTaskMappingViews = this.includedTasks.map(task => {
      const mappings = this.ensureChildMappings(task.id);
      const childParameters = this.getChildParameters(task);
      const templateChildViews = this.isTemplateTask(task)
        ? this.buildTemplateChildViews(task.id, task.id, 1, new Set([task.id]))
        : [];
      return {
        task,
        mappings,
        mappingRows: this.buildMappingRows(mappings),
        childParameters,
        canAddMapping: mappings.length < this.miaParameters.length,
        isTemplate: this.isTemplateTask(task),
        templateChildViews
      };
    });
  }

  private initializeMappingArraysForTask(task: TaskProjection): void {
    this.ensureChildMappings(task.id);
    if (!this.isTemplateTask(task)) {
      return;
    }
    this.initializeTemplateDescendantMappings(task.id, task.id, new Set([task.id]), 1);
  }

  private initializeTemplateDescendantMappings(
    rootTemplateTaskId: number,
    templateTaskId: number,
    path: Set<number>,
    depth: number
  ): void {
    if (depth > this.maxTemplateNestingDepth) {
      return;
    }
    const innerMappings = this.ensureTemplateChildMappingMap(rootTemplateTaskId);
    (this.templateChildTasks.get(templateTaskId) || []).forEach(childLink => {
      if (!innerMappings.has(childLink.task.id)) {
        innerMappings.set(childLink.task.id, []);
      }
      if (childLink.task.typeId === magic.taskTemplateTypeId && !path.has(childLink.task.id)) {
        const nextPath = new Set(path);
        nextPath.add(childLink.task.id);
        this.initializeTemplateDescendantMappings(rootTemplateTaskId, childLink.task.id, nextPath, depth + 1);
      }
    });
  }

  private ensureChildMappings(taskId: number): ChildParamMapping[] {
    if (!this.childTaskParameterMappings.has(taskId)) {
      this.childTaskParameterMappings.set(taskId, []);
    }
    return this.childTaskParameterMappings.get(taskId);
  }

  private ensureTemplateChildMappingMap(templateTaskId: number): Map<number, ChildParamMapping[]> {
    if (!this.templateChildTaskParameterMappings.has(templateTaskId)) {
      this.templateChildTaskParameterMappings.set(templateTaskId, new Map());
    }
    return this.templateChildTaskParameterMappings.get(templateTaskId);
  }

  private ensureTemplateChildMappings(templateTaskId: number, innerTaskId: number): ChildParamMapping[] {
    const innerMappings = this.ensureTemplateChildMappingMap(templateTaskId);
    if (!innerMappings.has(innerTaskId)) {
      innerMappings.set(innerTaskId, []);
    }
    return innerMappings.get(innerTaskId);
  }

  private buildMappingRows(mappings: ChildParamMapping[]): MappingRowView[] {
    return mappings.map((mapping, index) => ({
      mapping,
      availableMiaParams: this.getAvailableMiaParamsForMappings(mappings, index)
    }));
  }

  private buildTemplateChildViews(
    rootTemplateTaskId: number,
    parentTemplateTaskId: number,
    depth: number,
    path: Set<number>
  ): TemplateChildMappingView[] {
    if (depth > this.maxTemplateNestingDepth) {
      return [];
    }

    return (this.templateChildTasks.get(parentTemplateTaskId) || []).map(childLink => {
      const childTask = childLink.task;
      const mappings = this.ensureTemplateChildMappings(rootTemplateTaskId, childTask.id);
      const childParameters = this.getChildParameters(childTask);
      const isTemplate = this.isTemplateTask(childTask);
      const nextPath = new Set(path);
      const canTraverseChildren = isTemplate && !path.has(childTask.id);
      nextPath.add(childTask.id);

      const nodeKey = `${rootTemplateTaskId}:${childTask.id}:${childLink.referenceAlias}:${depth}`;

      return {
        key: nodeKey,
        rootTemplateTaskId,
        task: childTask,
        referenceAlias: childLink.referenceAlias,
        depth,
        isTemplate,
        renderAsAccordion: isTemplate,
        expandedByDefault: depth === 1,
        expanded: this.getTemplateNodeExpandedState(nodeKey, depth === 1),
        mappings,
        mappingRows: this.buildMappingRows(mappings),
        childParameters,
        canAddMapping: mappings.length < this.miaParameters.length && childParameters.length > 0,
        childNodes: canTraverseChildren
          ? this.buildTemplateChildViews(rootTemplateTaskId, childTask.id, depth + 1, nextPath)
          : []
      };
    });
  }

  private getTemplateNodeExpandedState(key: string, defaultExpanded: boolean): boolean {
    return this.templateExpansionState.has(key)
      ? this.templateExpansionState.get(key)
      : defaultExpanded;
  }

  private getAvailableMiaParamsForMappings(mappings: ChildParamMapping[], currentIndex: number): TaskMoreInfoParameter[] {
    const usedParams = new Set(
      mappings
        .filter((_, i) => i !== currentIndex)
        .map(m => m.miaParam)
        .filter(p => !!p)
    );
    return this.miaParameters.filter(p => !usedParams.has(p.label));
  }

  private readMiaParameters(): TaskMoreInfoParameter[] {
    const raw = this.entityToEdit?.properties?.parameters;
    return Array.isArray(raw) ? raw as TaskMoreInfoParameter[] : [];
  }

  private normalizeChildParameter(raw: unknown): TaskMoreInfoParameter | null {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return null;
    }
    const parameter = raw as Record<string, unknown>;
    const label = typeof parameter['label'] === 'string' && parameter['label'].length > 0
      ? parameter['label']
      : (typeof parameter['name'] === 'string' && parameter['name'].length > 0 ? parameter['name'] : null);
    if (!label) {
      return null;
    }
    return {
      ...(parameter as unknown as Partial<TaskMoreInfoParameter>),
      label
    } as TaskMoreInfoParameter;
  }

  private normalizeIds(ids: unknown): number[] {
    if (!Array.isArray(ids)) {
      return [];
    }
    return ids
      .filter(id => typeof id === 'number')
      .filter((id, index, arr) => arr.indexOf(id) === index);
  }

  private filterCartographies(value?: string): Cartography[] {
    const filterValue = (value || '').toLowerCase();
    return this.cartographies.filter(c => (c.name || '').toLowerCase().includes(filterValue));
  }

  private filterAvailableTasks(searchValue: string): TaskProjection[] {
    const includedIds = new Set(this.includedTasks.map(t => t.id));
    const available = this.allCandidateTasks.filter(t => !includedIds.has(t.id));

    if (!searchValue || searchValue.trim().length === 0) {
      return available.slice(0, 50); // Limit initial display
    }

    const filter = searchValue.toLowerCase();
    return available.filter(t =>
      (t.name || '').toLowerCase().includes(filter) ||
      String(t.id).includes(filter)
    ).slice(0, 50);
  }

  private cartographyValidator(control: FormControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    if (typeof value === 'object' && value?.id) {
      setTimeout(() => {
        if (this.entityForm) {
          this.entityForm.get('cartographyId')?.setValue(value.id, {emitEvent: false});
          this.entityForm.markAsDirty();
        }
      });
      return null;
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      const match = this.cartographies.find(
        c => c.name?.toLowerCase() === value.trim().toLowerCase()
      );
      if (match) {
        setTimeout(() => {
          if (this.entityForm) {
            this.entityForm.get('cartographyId')?.setValue(match.id, {emitEvent: false});
            this.entityForm.markAsDirty();
          }
        });
        return null;
      }
      return {invalidCartography: true};
    }

    return null;
  }

  // --- Table definitions (parameters, roles & territories) ---

  private defineParametersTable(): DataTableDefinition<TaskMoreInfoParameter, TaskMoreInfoParameter> {
    return DataTableDefinition.builder<TaskMoreInfoParameter, TaskMoreInfoParameter>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getEditableColumnDef('entity.task.moreInfo.parameters.referenceParameter', 'label'),
        this.utils.getEditableColumnDef('entity.task.parameters.field', 'value', 300, 500),
        this.utils.getEditableColumnDef('common.form.description', 'description', 250, 500),
        this.utils.getStatusColumnDef()])
      .withRelationsOrder('label')
      .withRelationsFetcher(() => {
        const raw = this.entityToEdit?.properties?.parameters;
        if (Array.isArray(raw)) {
          return of(raw.map((p: any) => TaskMoreInfoParameter.fromObject(p)));
        }
        return of<TaskMoreInfoParameter[]>([]);
      })
      .withRelationsUpdater(async (parameters: (TaskMoreInfoParameter & Status)[]) => {
        const parametersToSave = parameters
          .filter(canKeepOrUpdate)
          .map(value => TaskMoreInfoParameter.fromObject(value));
        // Preserve MIA-specific keys that TaskPropertiesBuilder.build() does not know about
        const miaKeys: Record<string, unknown> = {};
        const currentProps = this.entityToEdit.properties || {};
        for (const k of ['childTaskOrderIds', 'moreInfoAdvanced', 'parentLayout']) {
          if (currentProps[k] !== undefined) {
            miaKeys[k] = currentProps[k];
          }
        }
        if (currentProps['childTaskParameters'] !== undefined) {
          miaKeys['childTaskParameters'] = this.pruneStoredChildTaskParameters(currentProps['childTaskParameters'], parametersToSave);
        }
        if (currentProps['templateChildTaskParameters'] !== undefined) {
          miaKeys['templateChildTaskParameters'] = this.pruneStoredTemplateChildTaskParameters(currentProps['templateChildTaskParameters'], parametersToSave);
        }
        this.entityToEdit.properties = {
          ...TaskPropertiesBuilder.from(this.entityToEdit.properties)
            .withParameters(parametersToSave).build(),
          ...miaKeys
        };
        this.restoreChildTaskParameterMappings(this.entityToEdit.properties as MiaTaskProperties);
        this.restoreTemplateChildTaskParameterMappings(this.entityToEdit.properties as MiaTaskProperties);
        this.rebuildIncludedTaskMappingViews();
        await firstValueFrom(this.taskService.update(this.entityToEdit));
      })
      .withTemplateDialog('newParameterDialog', () => TemplateDialog.builder()
        .withReference(this.newParameterDialog)
        .withTitle(this.translateService.instant('entity.task.parameters.title'))
        .withForm(new FormGroup({
          label: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true
          }),
          value: new FormControl('', {
            validators: [Validators.required],
            nonNullable: false
          }),
          description: new FormControl('', {
            validators: [],
            nonNullable: false
          })
        })).withPreOpenFunction((form: FormGroup) => {
          form.reset({label: '', value: '', description: ''});
        }).build())
      .withTargetToRelation((items: TaskMoreInfoParameter[]) => items.map(item => TaskMoreInfoParameter.fromObject(item)))
      .withRelationsDuplicate(item => TaskMoreInfoParameter.fromObject(item))
      .build();
  }

  private defineRolesTable(): DataTableDefinition<Role, Role> {
    return DataTableDefinition.builder<Role, Role>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef(
          'common.form.name',
          'name',
          '/role/:id/roleForm',
          {id: 'id'}
        ),
        this.utils.getNonEditableColumnDef('common.form.description', 'description'),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(Role, 'roles', {projection: 'view'});
      })
      .withRelationsUpdater(async (roles: (Role & Status)[]) => {
        await onUpdatedRelation(roles).forAll(item => this.entityToEdit.substituteAllRelation('roles', item));
      })
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
        this.utils.getNonEditableColumnDef('common.form.description', 'description')
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
          {id: 'territoryId'}
        ),
        this.utils.getNonEditableColumnDef('common.form.code', 'territoryCode'),
        this.utils.getNonEditableColumnDef('common.form.type', 'territoryTypeName'),
        this.utils.getNonEditableDateColumnDef('common.form.created', 'createdDate'),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('territoryName')
      .withRelationsFetcher(() => {
        if (!this.isNew()) {
          return this.entityToEdit.getRelationArrayEx(TaskAvailabilityProjection, 'availabilities', {projection: 'view'});
        }
        return of([]);
      })
      .withRelationsUpdater(async (availabilities: (TaskAvailabilityProjection & Status)[]) => {
        await onDelete(availabilities).forEach(item => this.taskAvailabilityService.delete(this.taskAvailabilityService.createProxy(item.id)));
        await onCreate(availabilities)
          .map(item => TaskAvailability.of(this.taskService.createProxy(this.entityID), this.territoryService.createProxy(item.territoryId)))
          .forEach(item => this.taskAvailabilityService.create(item));
        availabilities.forEach(item => item.newItem = false);
      })
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
        this.utils.getNonEditableColumnDef('common.form.code', 'code'),
        this.utils.getNonEditableColumnDef('common.form.type', 'typeName')
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.territoryService.getAllProjection(TerritoryProjection))
      .withTargetInclude((availabilities: (TaskAvailabilityProjection)[]) => (item: TerritoryProjection) => {
        return !availabilities.some((availability) => availability.territoryId === item.id);
      })
      .withTargetToRelation((items: TerritoryProjection[]) => {
        return items.map(item => TaskAvailabilityProjection.of(this.entityToEdit, item));
      })
      .withTargetsTitle(this.translateService.instant('entity.task.territories.title'))
      .build();
  }
}

class CartographyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, _form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
