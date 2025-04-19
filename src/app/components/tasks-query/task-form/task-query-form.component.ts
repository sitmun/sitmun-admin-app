import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { sitmunMixedBase } from "@app/components/sitmun-base.component";
import {
  Cartography,
  CodeListService,
  Connection,
  ConnectionService,
  Role,
  RoleService,
  Service,
  ServiceService,
  Task,
  TaskAvailability,
  TaskAvailabilityProjection,
  TaskAvailabilityService,
  TaskGroup,
  TaskGroupService,
  TaskParameter,
  TaskProjection,
  TaskService,
  TaskType,
  TaskTypeService,
  TaskUIService,
  TerritoryProjection,
  TerritoryService,
  TranslationService,
  CartographyService, TaskPropertiesBuilder
} from "@app/domain";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UtilsService } from "@app/services/utils.service";
import { LoggerService } from "@app/services/logger.service";
import { ErrorHandlerService } from "@app/services/error-handler.service";
import { DataTableDefinition, TemplateDialog } from "@app/components/data-tables.util";
import { firstValueFrom, map, of } from "rxjs";
import {
  canKeepOrUpdate,
  onCreate,
  onDelete,
  onUpdatedRelation,
  Status
} from "@app/frontend-gui/src/lib/data-grid/data-grid.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";

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
 * @extends sitmunMixedBase<TaskProjection>
 * @implements OnInit, OnDestroy
 */
@Component({
  selector: 'app-service-form',
  templateUrl: './task-query-form.component.html',
  styles: []
})
export class TaskQueryFormComponent extends sitmunMixedBase<TaskProjection>() implements OnInit, OnDestroy {

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
  protected readonly parametersTable: DataTableDefinition<TaskParameter, TaskParameter>;

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

  /**
   * The task group entity associated with this task.
   * Retrieved during initialization.
   */
  private taskGroup: TaskGroup = null;

  /**
   * List of available connections that can be assigned to this task.
   * Retrieved during initialization.
   */
  private connections: Connection[] = [];

  /**
   * List of available services that can be assigned to this task.
   * Retrieved during initialization.
   */
  private services: Service[] = [];

  /**
   * List of available cartographies that can be assigned to cartography query tasks.
   * Retrieved during initialization.
   */
  private cartographies: Cartography[] = [];

  /**
   * Reference to the dialog template for adding new parameters.
   * Used by the parameters table for creating new task parameters.
   */
  @ViewChild('newParameterDialog', { static: true })
  private readonly newParameterDialog: TemplateRef<any>;

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
    protected override dialog: MatDialog,
    protected override translateService: TranslateService,
    protected override translationService: TranslationService,
    protected override codeListService: CodeListService,
    protected override errorHandler: ErrorHandlerService,
    protected override activatedRoute: ActivatedRoute,
    protected override router: Router,
    protected taskService: TaskService,
    protected taskUIService: TaskUIService,
    protected utils: UtilsService,
    protected loggerService: LoggerService,
    protected taskTypeService: TaskTypeService,
    protected roleService: RoleService,
    protected taskGroupService: TaskGroupService,
    protected territoryService: TerritoryService,
    protected taskAvailabilityService: TaskAvailabilityService,
    protected connectionService: ConnectionService,
    protected cartographyService: CartographyService
  ) {
    super(translateService, translationService, errorHandler, activatedRoute, router);
    this.rolesTable = this.defineRolesTable();
    this.availabilitiesTable = this.defineAvailabilitiesTable();
    this.parametersTable = this.defineParametersTable();
  }

  /**
   * Lifecycle hook called after data is fetched.
   * Sets up form change subscriptions.
   */
  override afterFetch() {
    this.subscribeToFormChanges(this.entityForm)
  }

  /**
   * Lifecycle hook called after entity is saved.
   * Resets form to initial modified state.
   */
  override afterSave() {
    this.resetToFormModifiedState(this.entityForm);
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
    this.dataTables.register(this.rolesTable)
      .register(this.availabilitiesTable)
      .register(this.parametersTable);
    await this.initCodeLists(['tasksEntity.type', 'queryTask.scope'])

    this.taskTypeName = params.type ?? 'Query';
    this.taskTypeNameTranslated = this.translateService.instant(`tasksEntity.${this.taskTypeName}`);
    const [taskTypes, taskGroups, connections, cartographies] = await Promise.all([
      firstValueFrom(this.taskTypeService.getAllEx()),
      firstValueFrom(this.taskGroupService.getAllEx()),
      firstValueFrom(this.connectionService.getAll()),
      firstValueFrom(this.cartographyService.getAll())
    ]);

    this.taskType = taskTypes.find(taskType => taskType.title === this.taskTypeName);
    if (!this.taskType) {
      throw new Error(`Task type ${this.taskTypeName} not found`);
    }

    this.taskGroup = taskGroups.find(taskGroup => taskGroup.name === this.taskTypeName);
    if (!this.taskGroup) {
      throw new Error(`Task group ${this.taskTypeName} not found`);
    }

    this.connections = connections
    this.cartographies = cartographies
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
    await firstValueFrom(entityCreated.updateRelationEx("group", this.taskGroup));
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
  }

  /**
   * Updates related data after the task is saved.
   * Updates translations and manages connection and cartography relationships.
   *
   * @param isDuplicated - Whether this is a duplication operation
   * @returns Promise that resolves when related data is updated
   */
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
        this.utils.getNonEditableColumnDef('layersPermitsEntity.name', 'name'),
        this.utils.getNonEditableColumnDef('backgroundEntity.description', 'description'),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(Role, 'roles', { projection: 'view' })
      })
      .withRelationsUpdater(async (roles: (Role & Status)[]) => {
        await onUpdatedRelation(roles).forAll(item => this.entityToEdit.substituteAllRelation('roles', item));
      })
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('layersPermitsEntity.name', 'name'),
        this.utils.getNonEditableColumnDef('backgroundEntity.description', 'description'),
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.roleService.getAll())
      .withTargetsTitle(this.translateService.instant('backgroundEntity.roles'))
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
        this.utils.getNonEditableColumnDef('territoryEntity.name', 'territoryName'),
        this.utils.getNonEditableColumnDef('territoryEntity.code', 'territoryCode'),
        this.utils.getNonEditableColumnDef('territoryEntity.type', 'territoryTypeName'),
        this.utils.getNonEditableDateColumnDef('territoryEntity.createdDate', 'createdDate'),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('territoryName')
      .withRelationsFetcher(() => {
        if (!this.isNew()) {
          return this.entityToEdit.getRelationArrayEx(TaskAvailabilityProjection, 'availabilities', { projection: 'view' })
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
        this.utils.getNonEditableColumnDef('territoryEntity.name', 'name'),
        this.utils.getNonEditableColumnDef('territoryEntity.code', 'code'),
        this.utils.getNonEditableColumnDef('territoryEntity.type', 'typeName'),
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.territoryService.getAllProjection(TerritoryProjection))
      .withTargetInclude((availabilities: (TaskAvailabilityProjection)[]) => (item: TerritoryProjection) => {
        return !availabilities.some((availability) => availability.territoryId === item.id);
      })
      .withTargetToRelation((items: TerritoryProjection[]) => {
        return items.map(item => TaskAvailabilityProjection.of(this.entityToEdit, item));
      })
      .withTargetsTitle(this.translateService.instant('backgroundEntity.roles'))
      .withTargetsOrder('name')
      .build();
  }

  /**
   * Defines the data table configuration for managing task parameters.
   * Sets up columns, data fetching, updating logic, and dialog templates.
   *
   * @returns Configured data table definition for parameters
   */
  private defineParametersTable(): DataTableDefinition<TaskParameter, TaskParameter> {
    return DataTableDefinition.builder<TaskParameter, TaskParameter>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getEditableColumnDef('applicationEntity.name', 'name'),
        this.utils.getNonEditableColumnDef('applicationEntity.type', 'type'),
        this.utils.getEditableColumnDef('applicationEntity.value', 'value', 300, 500),
        this.utils.getStatusColumnDef()])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.entityToEdit?.properties?.parameters) {
          const originalParameters = this.entityToEdit.properties.parameters as TaskParameter[];
          const parameters = originalParameters.map((parameter: TaskParameter) => new TaskParameter(parameter.name, parameter.type, parameter.value));
          return of(parameters);
        }
        return of<TaskParameter[]>([])
      })
      .withRelationsUpdater(async (parameters: (TaskParameter & Status)[]) => {
        const parametersToSave = parameters.filter(canKeepOrUpdate).map(value => TaskParameter.fromObject(value))
        this.entityToEdit.properties.parameters = parametersToSave;
        await firstValueFrom(this.taskService.update(this.entityToEdit));
      })
      .withTemplateDialog('newParameterDialog', () => TemplateDialog.builder()
        .withReference(this.newParameterDialog)
        .withTitle(this.translateService.instant('taskEntity.newParameter'))
        .withForm(new FormGroup({
          name: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true
          }),
          type: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true
          }),
          value: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true
          })
        })).build())
      .withTargetToRelation((items: TaskParameter[]) => items.map(item => TaskParameter.fromObject(item)))
      .withRelationsDuplicate(item => TaskParameter.fromObject(item))
      .build();
  }
}
