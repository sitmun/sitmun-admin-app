import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {ErrorStateMatcher} from "@angular/material/core";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";

import {TranslateService} from "@ngx-translate/core";
import {firstValueFrom, map, of, startWith} from "rxjs";

import {BaseFormComponent} from "@app/components/base-form.component";
import {DataTableDefinition, TemplateDialog} from "@app/components/data-tables.util";
import {Configuration} from "@app/core/config/configuration";
import {MessagesInterceptorStateService} from "@app/core/interceptors/messages.interceptor";
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
  TaskRelation,
  TaskRelationService,
  TaskProjection,
  TaskPropertiesBuilder,
  TaskService,
  TaskType,
  TaskTypeService,
  TaskUI,
  TaskUIService,
  TerritoryProjection,
  TerritoryService,
  TranslationService
} from "@app/domain";
import {
  canKeepOrUpdate,
  onCreate,
  onDelete,
  onUpdatedRelation,
  Status
} from "@app/frontend-gui/src/lib/data-grid/data-grid.component";
import {ErrorHandlerService} from "@app/services/error-handler.service";
import {LoadingOverlayService} from "@app/services/loading-overlay.service";
import {LoggerService} from "@app/services/logger.service";
import {UtilsService} from "@app/services/utils.service";
import {magic} from "@environments/constants";

@Component({
  selector: 'app-task-more-info-form',
  templateUrl: './task-more-info-form.component.html',
  styleUrl: './task-more-info-form.component.scss',
  standalone: false
})
export class TaskMoreInfoFormComponent extends BaseFormComponent<TaskProjection> implements OnInit {
  readonly config = Configuration.TASK_MORE_INFO;
  private readonly apiParameterPattern = /\{(\w+)\}/g;
  private readonly queryTaskRelationType = 'query-task';

  public override entityForm: FormGroup;

  protected readonly rolesTable: DataTableDefinition<Role, Role>;
  protected readonly availabilitiesTable: DataTableDefinition<TaskAvailabilityProjection, TerritoryProjection>;
  protected readonly parametersTable: DataTableDefinition<TaskMoreInfoParameter, TaskMoreInfoParameter>;

  private taskTypeName: string = null;
  protected taskTypeNameTranslated: string = null;
  private taskType: TaskType = null;

  protected taskGroupList: TaskGroup[] = [];
  protected cartographies: Cartography[] = [];
  protected queryTasks: TaskProjection[] = [];
  protected moreInfoUI: TaskUI = null;
  private selectedQueryTaskId: number | null = null;
  private selectedQueryTaskRelation: TaskRelation | null = null;

  protected cartographySearchControl = new FormControl<string | Cartography>('', {
    validators: [Validators.required, this.cartographyValidator.bind(this)],
    nonNullable: true
  });
  protected filteredCartographies = of<Cartography[]>([]);
  protected cartographyErrorMatcher = new CartographyErrorStateMatcher();

  protected queryTaskSearchControl = new FormControl<string | TaskProjection>('', {
    validators: [Validators.required, this.queryTaskValidator.bind(this)],
    nonNullable: true
  });
  protected filteredQueryTasks = of<TaskProjection[]>([]);
  protected queryTaskErrorMatcher = new QueryTaskErrorStateMatcher();

  // Map form control names to their i18n label keys for validation banner
  protected validationFieldLabels: Record<string, string> = {
    'name': 'entity.task.moreInfo.taskName',
    'taskGroupId': 'entity.taskGroup.label',
    'cartographyId': 'entity.task.moreInfo.cartography',
    'queryTaskId': 'entity.task.moreInfo.queryTask'
  };

  @ViewChild('newParameterDialog', {static: true})
  private readonly newParameterDialog: TemplateRef<any>;

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
    protected taskRelationService: TaskRelationService,
    protected taskTypeService: TaskTypeService,
    protected taskGroupService: TaskGroupService,
    protected cartographyService: CartographyService,
    protected taskUIService: TaskUIService,
    protected utils: UtilsService,
    protected roleService: RoleService,
    protected territoryService: TerritoryService,
    protected taskAvailabilityService: TaskAvailabilityService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router, loadingService, messagesInterceptorState);
    this.rolesTable = this.defineRolesTable();
    this.availabilitiesTable = this.defineAvailabilitiesTable();
    this.parametersTable = this.defineParametersTable();
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override async preFetchData() {
    const type = magic.taskMoreInfoTypeId;
    const queryTaskOptions = {
      params: [{key: 'type.id', value: magic.taskQueryTypeId}]
    };

    this.dataTables.register(this.rolesTable)
      .register(this.availabilitiesTable)
      .register(this.parametersTable);

    await this.initCodeLists(['tasksEntity.type'])
    this.initTranslations('Task', ['name'])

    const [taskTypes, taskGroups, cartographies, queryTasks, uiList] = await Promise.all([
      firstValueFrom(this.taskTypeService.fetchAllRawItems()),
      firstValueFrom(this.taskGroupService.fetchAllRawItems()),
      firstValueFrom(this.cartographyService.fetchAllItems()),
      firstValueFrom(this.taskService.fetchProjectionItems(TaskProjection, queryTaskOptions, undefined, 'tasks')),
      firstValueFrom(this.taskUIService.fetchAllItems())
    ]);

    this.taskType = taskTypes.find(taskType => taskType.id === type);
    if (!this.taskType) {
      this.loggerService.error(`Task type ${type} not found`);
    }
    this.taskTypeName = this.taskType.name;
    this.taskTypeNameTranslated = this.translateService.instant(`entity.task.moreInfo.label`);

    this.taskGroupList = taskGroups;
    this.cartographies = cartographies;
    this.queryTasks = this.filterSelectableQueryTasks(queryTasks)
      .sort((left, right) => (left.name || '').localeCompare(right.name || ''));
    this.moreInfoUI = uiList.find(ui => ui.name === 'sitmun.moreInfo');
    if (!this.moreInfoUI) {
      this.loggerService.error('UI control "sitmun.moreInfo" not found in database - task will not be identified correctly');
    } else {
      this.loggerService.info(`UI control "sitmun.moreInfo" loaded with ID: ${this.moreInfoUI.id}`);
    }
  }

  override async fetchRelatedData() {
    await this.loadTranslations(this.entityToEdit);
    await this.loadSelectedQueryTaskRelation();
  }

  override fetchOriginal(): Promise<TaskProjection> {
    return firstValueFrom(this.taskService.fetchProjectionById(TaskProjection, this.entityID));
  }

  override fetchCopy(): Promise<TaskProjection> {
    return firstValueFrom(this.taskService.fetchProjectionById(TaskProjection, this.duplicateID).pipe(map((copy: TaskProjection) => {
      copy.name = this.translateService.instant("copy_") + copy.name;
      return copy;
    })));
  }

  override empty(): TaskProjection {
    return new TaskProjection()
  }

  override postFetchData() {
    if (!this.entityToEdit) {
      this.loggerService.error('Cannot initialize form: entity is undefined');
    }

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
      queryTaskId: new FormControl(this.selectedQueryTaskId, {
        validators: [Validators.required]
      })
    });

    const selectedCartography = this.cartographies.find(cartography => cartography.id === this.entityToEdit.cartographyId);
    this.cartographySearchControl.setValue(selectedCartography || '');
    this.filteredCartographies = this.cartographySearchControl.valueChanges.pipe(
      startWith(this.cartographySearchControl.value),
      map(value => {
        const searchValue = typeof value === 'string' ? value : value?.name || '';
        return this.filterCartographies(searchValue);
      })
    );

    const selectedQueryTask = this.queryTasks.find(task => task.id === this.selectedQueryTaskId);
    this.queryTaskSearchControl.setValue(selectedQueryTask || '');
    this.filteredQueryTasks = this.queryTaskSearchControl.valueChanges.pipe(
      startWith(this.queryTaskSearchControl.value),
      map(value => {
        const searchValue = typeof value === 'string' ? value : value?.name || '';
        return this.filterQueryTasksByText(searchValue);
      })
    );
  }

  createObject(id: number = null): Task {
    let safeToEdit = TaskProjection.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();
    const existingProps: any = this.entityToEdit.properties || {};
    const properties: any = TaskPropertiesBuilder.from(existingProps)
      .withParameters(existingProps.parameters || [])
      .withFields(existingProps.fields || [])
      .build();

    safeToEdit = Object.assign(safeToEdit,
      formValues,
      {
        id: id,
        properties: properties
      }
    );
    return Task.fromObject(safeToEdit);
  }

  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const entityCreated = await firstValueFrom(this.taskService.create(entityToCreate));
    // Set immutable relationship
    await firstValueFrom(entityCreated.updateRelationEx("type", this.taskType));
    const proxyGroup = this.taskGroupService.createProxy(this.entityForm.get('taskGroupId')?.value);
    await firstValueFrom(entityCreated.updateRelationEx("group", proxyGroup));

    if (this.moreInfoUI?.id) {
      await firstValueFrom(entityCreated.updateRelationEx("ui", this.taskUIService.createProxy(this.moreInfoUI.id)));
    }
    return entityCreated.id;
  }

  override async updateEntity() {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.taskService.update(entityToUpdate));
    if (this.entityForm.get('taskGroupId')?.dirty) {
      const proxyGroup = this.taskGroupService.createProxy(this.entityForm.get('taskGroupId')?.value);
      await firstValueFrom(entityToUpdate.updateRelationEx("group", proxyGroup));
    }

    // Ensure UI control is set (needed for proper task identification)
    if (this.moreInfoUI?.id) {
      this.loggerService.info(`Updating UI relationship to ID: ${this.moreInfoUI.id}`);
      await firstValueFrom(this.entityToEdit.updateRelationEx("ui", this.taskUIService.createProxy(this.moreInfoUI.id)));
    } else {
      this.loggerService.error('Cannot set UI relationship - moreInfoUI is not loaded');
    }
  }

  override async updateDataRelated(_isDuplicated: boolean) {
    await this.saveTranslations(this.entityToEdit);

    if (this.moreInfoUI?.id) {
      await firstValueFrom(this.entityToEdit.updateRelationEx("ui", this.taskUIService.createProxy(this.moreInfoUI.id)));
    }

    // Update cartography relationship
    const cartographyId = this.entityForm.get('cartographyId')?.value
    if (typeof cartographyId === 'number') {
      await firstValueFrom(this.entityToEdit.updateRelationEx("cartography", this.cartographyService.createProxy(cartographyId)));
    } else {
      await firstValueFrom(this.entityToEdit.deleteAllRelation("cartography"));
    }

    await this.syncQueryTaskRelation();
  }

  getTaskGroupName(taskGroupId: number): string {
    return this.taskGroupList.find(group => group.id === taskGroupId)?.name || '';
  }



  protected shouldShowCommandAlertHint(): boolean {
    const command = this.entityForm?.get('command')?.value ?? '';
    const declaredParameters = this.entityToEdit?.properties?.parameters || [];

    if (!Array.isArray(declaredParameters) || declaredParameters.length === 0) {
      return command.match(this.apiParameterPattern) !== null;
    }

    // Extract all {variable} patterns from the command
    const matches = command.matchAll(this.apiParameterPattern);
    const urlVariables = new Set<string>();
    for (const match of matches) {
      if (match[1]) {
        urlVariables.add(match[1]);
      }
    }

    // Extract all declared parameter labels
    const declaredLabels = new Set<string>(
      declaredParameters.map((p: any) => p.label).filter(Boolean)
    );

    // Check for mismatches:
    // 1. URL variables not declared in parameters
    // 2. Declared parameters not used in URL
    const unmatchedUrlVars = [...urlVariables].filter(v => !declaredLabels.has(v));
    const unusedParameters = [...declaredLabels].filter(l => !urlVariables.has(l));

    return unmatchedUrlVars.length > 0 || unusedParameters.length > 0;
  }

  protected getDeclaredParametersList(): string {
    const declaredParameters = this.entityToEdit?.properties?.parameters || [];
    if (!Array.isArray(declaredParameters) || declaredParameters.length === 0) {
      return '';
    }

    const labels = declaredParameters
      .map((p: any) => p.label)
      .filter(Boolean)
      .map(label => `{${label}}`)
      .join(', ');

    return labels ? `Available parameters: ${labels}` : '';
  }

  onCartographySelected(event: MatAutocompleteSelectedEvent) {
    const cartography = event.option.value as Cartography;
    if (cartography?.id) {
      this.entityForm.get('cartographyId')?.setValue(cartography.id);
      // Mark form as dirty to enable save button
      this.entityForm.markAsDirty();
      // Force validation update
      this.cartographySearchControl.updateValueAndValidity();
    }
  }

  displayCartography(cartography: Cartography | string): string {
    if (typeof cartography === 'string') {
      return cartography;
    }
    return cartography?.name || '';
  }

  clearCartography() {
    this.cartographySearchControl.setValue('');
    this.entityForm.get('cartographyId')?.setValue(null);
    // Mark form as dirty when clearing
    this.entityForm.markAsDirty();
  }

  onQueryTaskSelected(event: MatAutocompleteSelectedEvent) {
    const task = event.option.value as TaskProjection;
    if (task?.id) {
      this.entityForm.get('queryTaskId')?.setValue(task.id);
      this.entityForm.markAsDirty();
      this.queryTaskSearchControl.updateValueAndValidity();
    }
  }

  displayQueryTask(task: TaskProjection | string): string {
    if (typeof task === 'string') {
      return task;
    }
    return task?.name || '';
  }

  clearQueryTask() {
    this.queryTaskSearchControl.setValue('');
    this.entityForm.get('queryTaskId')?.setValue(null);
    this.entityForm.markAsDirty();
  }

  private queryTaskValidator(control: FormControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    if (typeof value === 'object' && value?.id) {
      setTimeout(() => {
        if (this.entityForm) {
          this.entityForm.get('queryTaskId')?.setValue(value.id, {emitEvent: false});
          this.entityForm.markAsDirty();
        }
      });
      return null;
    }
    if (typeof value === 'string' && value.trim().length > 0) {
      const matchingTask = this.queryTasks.find(
        t => t.name?.toLowerCase() === value.trim().toLowerCase()
      );
      if (matchingTask) {
        setTimeout(() => {
          if (this.entityForm) {
            this.entityForm.get('queryTaskId')?.setValue(matchingTask.id, {emitEvent: false});
            this.entityForm.markAsDirty();
          }
        });
        return null;
      }
      return { invalidQueryTask: true };
    }
    return null;
  }

  private filterQueryTasksByText(value?: string): TaskProjection[] {
    const filterValue = (value || '').toLowerCase();
    return this.queryTasks.filter(task => (task.name || '').toLowerCase().includes(filterValue));
  }

  private cartographyValidator(control: FormControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) {
      return null; // Let required validator handle empty
    }

    // If value is an object with id, it's valid - update the form
    if (typeof value === 'object' && value?.id) {
      // Defer the update to avoid timing issues during validation
      setTimeout(() => {
        if (this.entityForm) {
          this.entityForm.get('cartographyId')?.setValue(value.id, {emitEvent: false});
          this.entityForm.markAsDirty();
        }
      });
      return null; // Valid selection
    }

    // If value is a string, check if it matches an existing cartography name exactly
    if (typeof value === 'string' && value.trim().length > 0) {
      const matchingCartography = this.cartographies.find(
        c => c.name?.toLowerCase() === value.trim().toLowerCase()
      );
      if (matchingCartography) {
        // Auto-select the matching cartography
        setTimeout(() => {
          if (this.entityForm) {
            this.entityForm.get('cartographyId')?.setValue(matchingCartography.id, {emitEvent: false});
            this.entityForm.markAsDirty();
          }
        });
        return null; // Valid if exact match found
      }
      // Invalid if it's a string that doesn't match
      return { invalidCartography: true };
    }

    return null;
  }

  private filterCartographies(value?: string): Cartography[] {
    const filterValue = (value || '').toLowerCase();
    return this.cartographies.filter(cartography => (cartography.name || '').toLowerCase().includes(filterValue));
  }

  protected filterSelectableQueryTasks(tasks: TaskProjection[]): TaskProjection[] {
    return tasks.filter(task => {
      if (task.typeId !== magic.taskQueryTypeId) {
        return false;
      }
      const scope = String(task.properties?.scope || '').toLowerCase();
      return scope !== this.codeValues.queryTaskScope.cartographyQuery
        && !task.cartographyId;
    });
  }

  protected buildQueryTaskRelation(taskId: number, queryTaskId: number): TaskRelation {
    return Object.assign(new TaskRelation(), {
      relationType: this.queryTaskRelationType,
      task: this.taskService.createProxy(taskId),
      relatedTask: this.taskService.createProxy(queryTaskId)
    });
  }

  private async loadSelectedQueryTaskRelation() {
    this.selectedQueryTaskId = null;
    this.selectedQueryTaskRelation = null;

    if (this.isNew() || !this.entityToEdit) {
      return;
    }

    const relations = await firstValueFrom(this.entityToEdit.getRelationArrayEx(TaskRelation, 'relations'));
    const queryRelation = relations.find(relation => relation.relationType === this.queryTaskRelationType) || null;
    if (!queryRelation) {
      return;
    }

    this.selectedQueryTaskRelation = queryRelation;
    const relatedTask = await firstValueFrom(queryRelation.getRelationEx(Task, 'relatedTask'));
    this.selectedQueryTaskId = relatedTask?.id ?? null;
  }

  private async syncQueryTaskRelation() {
    const queryTaskId = this.entityForm.get('queryTaskId')?.value;
    if (typeof queryTaskId !== 'number') {
      return;
    }

    const relations = await firstValueFrom(this.entityToEdit.getRelationArrayEx(TaskRelation, 'relations'));
    const matchingRelations = relations.filter(relation => relation.relationType === this.queryTaskRelationType);

    // Locate the current relation by ID inside the freshly-fetched list to avoid
    // reference-equality mismatches that would cause all relations to be deleted.
    const currentRelationId = this.selectedQueryTaskRelation?.id ?? null;
    const matchById = currentRelationId === null ? undefined : matchingRelations.find(r => r.id === currentRelationId);
    const currentRelation = matchById ?? matchingRelations[0] ?? null;

    for (const relation of matchingRelations.filter(relation => relation !== currentRelation)) {
      await firstValueFrom(this.taskRelationService.delete(relation));
    }

    if (!currentRelation) {
      await firstValueFrom(this.taskRelationService.create(this.buildQueryTaskRelation(this.entityID, queryTaskId)));
      return;
    }

    // Use the stored selectedQueryTaskId to avoid an extra API round-trip.
    if (this.selectedQueryTaskId === queryTaskId) {
      return;
    }

    const relationToUpdate = Object.assign(currentRelation, {
      task: this.taskService.createProxy(this.entityID),
      relatedTask: this.taskService.createProxy(queryTaskId),
      relationType: this.queryTaskRelationType
    });
    await firstValueFrom(this.taskRelationService.update(relationToUpdate));
  }

  private defineRolesTable(): DataTableDefinition<Role, Role> {
    return DataTableDefinition.builder<Role, Role>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef(
          'common.form.name',
          'name',
          '/role/:id/roleForm',
          {
            id: 'id',
          }
        ),
        this.utils.getNonEditableColumnDef('common.form.description', 'description'),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(Role, 'roles', {projection: 'view'})
      })
      .withRelationsUpdater(async (roles: (Role & Status)[]) => {
        await onUpdatedRelation(roles).forAll(item => this.entityToEdit.substituteAllRelation('roles', item));
      })
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
        this.utils.getNonEditableColumnDef('common.form.description', 'description'),
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.roleService.fetchAllItems())
      .withTargetToRelation((items) => items)
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
          {
            id: 'territoryId',
          }
        ),
        this.utils.getNonEditableColumnDef('common.form.code', 'territoryCode'),
        this.utils.getNonEditableColumnDef('common.form.type', 'territoryTypeName'),
        this.utils.getNonEditableDateColumnDef('common.form.created', 'createdDate'),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('territoryName')
      .withRelationsFetcher(() => {
        if (!this.isNew()) {
          return this.entityToEdit.getRelationArrayEx(TaskAvailabilityProjection, 'availabilities', {projection: 'view'})
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
        this.utils.getNonEditableColumnDef('common.form.type', 'typeName'),
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.territoryService.fetchProjectionItems(TerritoryProjection))
      .withTargetInclude((availabilities: (TaskAvailabilityProjection)[]) => (item: TerritoryProjection) => {
        return !availabilities.some((availability) => availability.territoryId === item.id);
      })
      .withTargetToRelation((items: TerritoryProjection[]) => {
        return items.map(item => TaskAvailabilityProjection.of(this.entityToEdit, item));
      })
      .withTargetsTitle(this.translateService.instant('entity.task.territories.title'))
      .withTargetsOrder('name')
      .build();
  }

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
          const parameters = raw.map((parameter: any) => TaskMoreInfoParameter.fromObject(parameter));
          return of(parameters);
        }
        return of<TaskMoreInfoParameter[]>([])
      })
      .withRelationsUpdater(async (parameters: (TaskMoreInfoParameter & Status)[]) => {
        const parametersToSave = parameters
          .filter(canKeepOrUpdate)
          .map(value => TaskMoreInfoParameter.fromObject(value));
        this.entityToEdit.properties = TaskPropertiesBuilder.from(this.entityToEdit.properties)
          .withParameters(parametersToSave).build();
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
          form.reset({
            label: '',
            value: '',
            description: ''
          });
        }).build())
      .withTargetToRelation((items: TaskMoreInfoParameter[]) => items.map(item => TaskMoreInfoParameter.fromObject(item)))
      .withRelationsDuplicate(item => TaskMoreInfoParameter.fromObject(item))
      .build();
  }
}

/**
 * Custom error state matcher for cartography autocomplete.
 * Shows errors when the control is invalid and (dirty or touched).
 */
class CartographyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, _form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

/**
 * Custom error state matcher for query task autocomplete.
 * Shows errors when the control is invalid and (dirty or touched).
 */
class QueryTaskErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, _form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
