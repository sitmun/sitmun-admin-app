import {Component, TemplateRef, ViewChild} from "@angular/core";
import {BaseFormComponent} from "@app/components/base-form.component";
import {
  Cartography,
  CartographyService,
  CodeListService,
  Connection,
  ConnectionService,
  Role,
  RoleService,
  Task,
  TaskAvailability,
  TaskAvailabilityProjection,
  TaskAvailabilityService,
  TaskGroup,
  TaskGroupService,
  TaskProjection,
  TaskPropertiesBuilder,
  TaskService,
  TaskType,
  TaskTypeService,
  TaskUIService,
  TerritoryProjection,
  TerritoryService,
  TranslationService
} from "@app/domain";
import {MatDialog} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {UtilsService} from "@app/services/utils.service";
import {LoggerService} from "@app/services/logger.service";
import {ErrorHandlerService} from "@app/services/error-handler.service";
import {DataTableDefinition, TemplateDialog} from "@app/components/data-tables.util";
import {firstValueFrom, map, of} from "rxjs";
import {
  canKeepOrUpdate,
  onCreate,
  onDelete,
  onUpdatedRelation,
  Status
} from "@app/frontend-gui/src/lib/data-grid/data-grid.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSelectChange} from "@angular/material/select";
import {TaskQueryParameter, TaskParameterType} from "@app/domain/task/models/task-query-parameter.model";
import assert from 'assert';

/**
 * Component for managing query tasks in the SITMUN application.
 * Provides a form interface for creating, editing, and duplicating query tasks.
 *
 * This component handles:
 * - Task metadata (name, scope, command)
 * - Connection or cartography selection based on query scope
 * - Task role assignments
 * - Task availability per territory
 * - Task parameters configuration
 *
 * Each query task is associated with a specific task type and task group.
 *
 * @extends BaseFormComponent<TaskProjection>
 */
@Component({
  selector: 'app-task-query-form',
  templateUrl: './task-query-form.component.html',
  styles: []
})
export class TaskQueryFormComponent extends BaseFormComponent<TaskProjection> {

  /**
   * Data table definition for managing role assignments to the task.
   * Configures the roles grid with columns, data fetching, and update operations.
   */
  protected readonly rolesTable: DataTableDefinition<Role, Role>;

  /**
   * Data table definition for managing task availabilities per territory.
   * Configures the availability grid with columns, data fetching, and update operations.
   */
  protected readonly availabilitiesTable: DataTableDefinition<TaskAvailabilityProjection, TerritoryProjection>;

  /**
   * Data table definition for managing task parameters.
   * Configures the parameters grid with columns, data fetching, and update operations.
   */
  protected readonly parametersTable: DataTableDefinition<TaskQueryParameter, TaskQueryParameter>;

  /**
   * The name of the task type associated with this task.
   * Determined from route parameters.
   */
  private taskTypeName: string = null;

  /**
   * The translated name of the task type.
   * Used for display in the UI.
   */
  protected taskTypeNameTranslated: string = null;

  /**
   * The task type entity associated with this task.
   * Retrieved during initialization.
   */
  private taskType: TaskType = null;

  protected taskGroupList: TaskGroup[] = [];

  /**
   * Reference to the dialog template for adding new parameters.
   * Used by the parameters table for creating new task parameters.
   */
  @ViewChild('newParameterDialog', {static: true})
  private readonly newParameterDialog: TemplateRef<any>;

  /**
   * The TaskParameterType enum exposed to the template
   */
  protected readonly TaskParameterType = TaskParameterType;

  /**
   * Gets the name of a cartography by its ID
   * @param cartographyId - The ID of the cartography
   * @returns The name of the cartography or empty string if not found
   */
  getCartographyName(cartographyId: number): string {
    const cartography = this.cartographies.find(cart => cart.id === cartographyId);
    return cartography?.name || '';
  }

  /**
   * Gets the name of a connection by its ID
   * @param connectionId - The ID of the connection
   * @returns The name of the connection or empty string if not found
   */
  getConnectionName(connectionId: number): string {
    const connection = this.connections.find(conn => conn.id === connectionId);
    return connection?.name || '';
  }

  /**
   * Checks if the parameter type is QUERY
   * @returns boolean indicating if parameter type is QUERY
   */
  isQueryParameterType(): boolean {
    return this.parametersTable.templateDialog('newParameterDialog').form.get('type')?.value === TaskParameterType.QUERY;
  }

  /**
   * The list of connections
   */
  protected connections: Connection[] = [];

  /**
   * The list of cartographies
   */
  protected cartographies: Cartography[] = [];

  /**
   * Checks if the current task scope is SQL query
   * @returns boolean indicating if scope is SQL query
   */
  isSqlQueryScope(): boolean {
    return this.entityForm?.value?.scope === this.codeValues.queryTaskScope.sqlQuery;
  }

  /**
   * Checks if the current task scope is Web API query
   * @returns boolean indicating if scope is Web API query
   */
  isWebApiQueryScope(): boolean {
    return this.entityForm?.value?.scope === this.codeValues.queryTaskScope.webApiQuery;
  }

  /**
   * Checks if the current task scope is Cartography query
   * @returns boolean indicating if scope is Cartography query
   */
  isCartographyQueryScope(): boolean {
    return this.entityForm?.value?.scope === this.codeValues.queryTaskScope.cartographyQuery;
  }

  /**
   * Constructor for the TaskQueryFormComponent.
   * Initializes the component with necessary services and sets up the form.
   *
   * @param dialog - Material dialog service for modal dialogs
   * @param translateService - Service for handling translations
   * @param translationService - Service for managing entity translations
   * @param codeListService - Service for accessing code lists
   * @param errorHandler - Service for handling errors
   * @param activatedRoute - Service for accessing route parameters
   * @param router - Angular router service for navigation
   * @param taskService - Service for task CRUD operations
   * @param taskUIService - Service for managing task UIs
   * @param utils - Utility service with common functions
   * @param loggerService - Service for logging
   * @param taskTypeService - Service for managing task types
   * @param roleService - Service for managing roles
   * @param taskGroupService - Service for managing task groups
   * @param territoryService - Service for accessing territories
   * @param taskAvailabilityService - Service for managing task availabilities
   * @param connectionService - Service for database connections
   * @param cartographyService - Service for cartography management
   */
  constructor(
    dialog: MatDialog,
    translateService: TranslateService,
    translationService: TranslationService,
    codeListService: CodeListService,
    loggerService: LoggerService,
    errorHandler: ErrorHandlerService,
    activatedRoute: ActivatedRoute,
    router: Router,
    protected taskService: TaskService,
    protected taskUIService: TaskUIService,
    protected utils: UtilsService,
    protected taskTypeService: TaskTypeService,
    protected roleService: RoleService,
    protected taskGroupService: TaskGroupService,
    protected territoryService: TerritoryService,
    protected taskAvailabilityService: TaskAvailabilityService,
    protected connectionService: ConnectionService,
    protected cartographyService: CartographyService
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router);
    this.rolesTable = this.defineRolesTable();
    this.availabilitiesTable = this.defineAvailabilitiesTable();
    this.parametersTable = this.defineParametersTable();
  }

  /**
   * Initializes component data before fetching.
   * Extracts task type from route, registers data tables, and loads required data.
   *
   * @returns Promise that resolves when initialization is complete
   * @throws Error if task type or group is not found
   */
  override async preFetchData() {
    const params = await firstValueFrom(this.activatedRoute.params);

    const type = Number(params.type ?? 5);
    assert(type == 5, `Task type must be 5 for query tasks but was ${params.type}`);

    this.dataTables.register(this.rolesTable)
      .register(this.availabilitiesTable)
      .register(this.parametersTable);
    await this.initCodeLists(['tasksEntity.type', 'queryTask.scope', 'taskEntity.queryType', 'queryTask.parameterType'])

    const [taskTypes, taskGroups, connections, cartographies] = await Promise.all([
      firstValueFrom(this.taskTypeService.getAllEx()),
      firstValueFrom(this.taskGroupService.getAllEx()),
      firstValueFrom(this.connectionService.getAllEx()),
      firstValueFrom(this.cartographyService.getAllEx()),
    ]);

    this.connections = connections;
    this.cartographies = cartographies;

    this.taskType = taskTypes.find(taskType => taskType.id === type);
    this.taskTypeName = this.taskType.title;
    this.taskTypeNameTranslated = this.translateService.instant(`entity.task.query.label`);
    if (!this.taskType) {
      throw new Error(`Task type ${this.taskTypeName} not found`);
    }

    taskGroups.sort((a, b) => a.name.localeCompare(b.name));
    this.taskGroupList = taskGroups;
  }

  /**
   * Fetches the original entity by ID.
   *
   * @returns Promise that resolves to the task projection
   */
  override fetchOriginal(): Promise<TaskProjection> {
    return firstValueFrom(this.taskService.getProjection(TaskProjection, this.entityID));
  }

  /**
   * Creates a copy of an existing entity for duplication.
   * Prefixes the name with "copy_" to distinguish from the original.
   *
   * @returns Promise that resolves to the duplicated task projection
   */
  override fetchCopy(): Promise<TaskProjection> {
    return firstValueFrom(this.taskService.getProjection(TaskProjection, this.duplicateID).pipe(map((copy: TaskProjection) => {
      copy.name = this.translateService.instant("copy_") + copy.name;
      return copy;
    })));
  }

  /**
   * Creates an empty task entity with default values.
   *
   * @returns New empty task projection
   */
  override empty(): TaskProjection {
    return new TaskProjection()
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
      scope: new FormControl(this.entityToEdit.properties.scope, {
        validators: [Validators.required],
        nonNullable: true
      }),
      command: new FormControl(this.entityToEdit.properties.command, {
        validators: [Validators.required],
        nonNullable: true
      }),
      connectionId: new FormControl(this.entityToEdit.connectionId, {
        validators: [Validators.required],
        nonNullable: true
      }),
      cartographyId: new FormControl(this.entityToEdit.cartographyId, {
        validators: [Validators.required],
        nonNullable: true
      }),
      taskGroupId: new FormControl(this.entityToEdit.groupId, {
        validators: [Validators.required],
        nonNullable: true
      })
    });
    this.configureForm(this.entityToEdit.properties.scope)
  }

  /**
   * Creates a Task object from the current form values.
   *
   * @param id - Optional ID for the new object, used when updating
   * @returns New Task instance populated with form values
   */
  createObject(id: number = null): Task {
    let safeToEdit = TaskProjection.fromObject(this.entityToEdit);
    safeToEdit = Object.assign(safeToEdit,
      this.entityForm.value,
      {
        id: id,
        properties: TaskPropertiesBuilder.create()
          .withScope(this.entityForm.get('scope')?.value)
          .withCommand(this.entityForm.get('command')?.value)
          .build()
      }
    );
    return Task.fromObject(safeToEdit);
  }

  /**
   * Handles scope type change events from the dropdown selection.
   * Updates form field availability based on the selected scope.
   *
   * @param event - Select change event containing the new scope value
   */
  onTypeChange(event: MatSelectChange) {
    this.configureForm(event.value)
  }

  /**
   * Configures form field availability based on the selected query scope.
   * - SQL Query: Enables command and connection, disables cartography
   * - Cartography Query: Enables cartography, disables command and connection
   * - Web API Query: Enables command, disables connection and cartography
   *
   * @param value - The selected scope value
   */
  configureForm(value: string) {
    if (value === this.codeValues.queryTaskScope.sqlQuery) {
      this.entityForm.get('command').enable();
      this.entityForm.get('connectionId').enable();
      this.entityForm.get('cartographyId').disable();
    }
    if (value === this.codeValues.queryTaskScope.cartographyQuery) {
      this.entityForm.get('command').disable();
      this.entityForm.get('connectionId').disable();
      this.entityForm.get('cartographyId').enable();
    }
    if (value === this.codeValues.queryTaskScope.webApiQuery) {
      this.entityForm.get('command').enable();
      this.entityForm.get('connectionId').disable();
      this.entityForm.get('cartographyId').disable();
    }
  }

  /**
   * Creates a new task entity in the database.
   * Also sets immutable relationships to task type and group.
   *
   * @returns Promise resolving to the ID of the created entity
   */
  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const entityCreated = await firstValueFrom(this.taskService.create(entityToCreate));
    // Set immutable relationship
    await firstValueFrom(entityCreated.updateRelationEx("type", this.taskType));
    const proxyGroup = this.taskGroupService.createProxy(this.entityForm.get('taskGroupId')?.value);
    await firstValueFrom(entityCreated.updateRelationEx("group", proxyGroup));
    return entityCreated.id;
  }

  /**
   * Updates an existing task entity with form values.
   *
   * @returns Promise that resolves when the update is complete
   */
  override async updateEntity() {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.taskService.update(entityToUpdate));
    if (this.entityForm.get('taskGroupId')?.dirty) {
      const proxyGroup = this.taskGroupService.createProxy(this.entityForm.get('taskGroupId')?.value);
      await firstValueFrom(entityToUpdate.updateRelationEx("group", proxyGroup));
    }
  }

  /**
   * Updates related data after the task is saved.
   * Updates translations and manages connection and cartography relationships.
   *
   * @param isDuplicated - Whether this is a duplication operation
   * @returns Promise that resolves when related data is updated
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override async updateDataRelated(isDuplicated: boolean) {
    await this.saveTranslations(this.entityToEdit);
    const connectionId = this.entityForm.get('connectionId')?.value
    if (typeof connectionId === 'number') {
      await firstValueFrom(this.entityToEdit.updateRelationEx("connection", this.connectionService.createProxy(connectionId)));
    } else {
      await firstValueFrom(this.entityToEdit.deleteAllRelation("connection"));
    }
    const cartographyId = this.entityForm.get('cartographyId')?.value
    if (typeof cartographyId === 'number') {
      await firstValueFrom(this.entityToEdit.updateRelationEx("cartography", this.cartographyService.createProxy(cartographyId)));
    } else {
      await firstValueFrom(this.entityToEdit.deleteAllRelation("cartography"));
    }
  }

  /**
   * Defines the data table configuration for managing roles.
   * Sets up columns, data fetching, updating logic, and target selection.
   *
   * @returns Configured data table definition for roles
   */
  private defineRolesTable(): DataTableDefinition<Role, Role> {
    return DataTableDefinition.builder<Role, Role>(this.dialog, this.errorHandler)
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
      .withTargetsFetcher(() => this.roleService.getAll())
      .withTargetsTitle(this.translateService.instant('entity.task.roles.title'))
      .build();
  }

  /**
   * Defines the data table configuration for managing task availabilities.
   * Sets up columns, data fetching, updating logic, and target selection.
   *
   * @returns Configured data table definition for availabilities
   */
  private defineAvailabilitiesTable(): DataTableDefinition<TaskAvailabilityProjection, TerritoryProjection> {
    return DataTableDefinition.builder<TaskAvailabilityProjection, TerritoryProjection>(this.dialog, this.errorHandler)
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
      .withTargetsFetcher(() => this.territoryService.getAllProjection(TerritoryProjection))
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

  /**
   * Defines the data table configuration for managing task parameters.
   * Sets up columns, data fetching, updating logic, and dialog templates.
   *
   * @returns Configured data table definition for parameters
   */
  private defineParametersTable(): DataTableDefinition<TaskQueryParameter, TaskQueryParameter> {
    return DataTableDefinition.builder<TaskQueryParameter, TaskQueryParameter>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getEditableColumnDef('common.form.name', 'name'),
        this.utils.getEditableColumnDef('common.form.label', 'label'),
        this.utils.getNonEditableColumnWithCodeListDef('common.form.type', 'type', () => this.codeList('queryTask.parameterType')),
        this.utils.addConditionToColumnDef(this.utils.getBooleanColumnDef('common.form.required', 'required', true), (params) => params.data.type === TaskParameterType.QUERY),
        this.utils.getStatusColumnDef()])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.entityToEdit?.properties?.parameters) {
          const originalParameters = this.entityToEdit.properties.parameters;
          const parameters = originalParameters.map((parameter: any) => TaskQueryParameter.fromObject(parameter));
          return of(parameters);
        }
        return of<TaskQueryParameter[]>([])
      })
      .withRelationsUpdater(async (parameters: (TaskQueryParameter & Status)[]) => {
        this.entityToEdit.properties.parameters = parameters.filter(canKeepOrUpdate)
          .map(value => TaskQueryParameter.fromObject(value));
        await firstValueFrom(this.taskService.update(this.entityToEdit));
      })
      .withFieldRestriction('name')
      .withTemplateDialog('newParameterDialog', () => TemplateDialog.builder()
        .withReference(this.newParameterDialog)
        .withTitle(this.translateService.instant('entity.task.parameters.title'))
        .withForm(new FormGroup({
          name: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true
          }),
          label: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true
          }),
          type: new FormControl(null, {
            validators: [Validators.required],
            nonNullable: true
          }),
          required: new FormControl(false, {
            validators: [Validators.required],
            nonNullable: true
          }),
        })).build())
      .withTargetToRelation((items: TaskQueryParameter[]) => items.map(item => TaskQueryParameter.fromObject(item)))
      .withRelationsDuplicate(item => TaskQueryParameter.fromObject(item))
      .build();
  }

  getTaskGroupName(taskGroupId: number): string {
      return this.taskGroupList.find(group => group.id === taskGroupId)?.name || '';
  }
}
