import {Component, TemplateRef, ViewChild} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatSelectChange} from "@angular/material/select";
import {ActivatedRoute, Router} from "@angular/router";

import {TranslateService} from "@ngx-translate/core";
import { firstValueFrom, map, of} from "rxjs";

import {BaseFormComponent} from "@app/components/base-form.component";
import {DataTableDefinition, TemplateDialog} from "@app/components/data-tables.util";
import {Configuration} from "@app/core/config/configuration";
import {MessagesInterceptorStateService} from "@app/core/interceptors/messages.interceptor";
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
  TaskService,
  TaskType,
  TaskTypeService,
  TerritoryProjection,
  TerritoryService,
  TranslationService
} from "@app/domain";
import {TaskEditionField, TaskFieldType} from "@app/domain/task/models/task-edition-fields.model";
import {TaskEditionParameter, TaskParameterType} from "@app/domain/task/models/task-edition-parameter.model";
import { TaskPropertiesContract } from "@app/domain/task/models/task-properties";
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

/**
 * Component for managing basic tasks in the SITMUN application.
 * Provides a form interface for creating, editing, and duplicating basic tasks.
 *
 * This component handles:
 * - Task metadata (name)
 * - Task role assignments
 * - Task availability per territory
 * - Task parameters configuration
 *
 * Each task is associated with a specific task type and task group.
 *
 * @extends BaseFormComponent<TaskProjection>
 */
@Component({
    selector: 'app-task-edit-form',
    templateUrl: './task-edit-form.component.html',
    styles: [],
    standalone: false
})
export class TaskEditFormComponent extends BaseFormComponent<TaskProjection> {
  readonly config = Configuration.TASK_EDIT;

  /**
   * The reactive form for editing task properties.
   * Contains form controls for name and UI selection with validation rules.
   */
  public override entityForm: FormGroup;

  /**
   * Data table definition for managing role assignments to the task.
   * Configures the roles' grid with columns, data fetching, and update operations.
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
  protected readonly parametersTable: DataTableDefinition<TaskEditionParameter, TaskEditionParameter>;

  /**
   * Data table definition for managing task fields.
   * Configures the fields grid with columns, data fetching, and update operations.
   */
  protected readonly fieldsTable: DataTableDefinition<TaskEditionField, TaskEditionField>;

  /**
   * The translated name of the task type.
   * Used for display in the UI.
   */
  protected taskTypeNameTranslated: string = null;

  protected taskGroupList: TaskGroup[] = [];

  /**
   * The name of the task type associated with this task.
   * Determined from route parameters.
   */
  private taskTypeName: string = null;

  /**
   * The task type entity associated with this task.
   * Retrieved during initialization.
   */
  private taskType: TaskType = null;

  /**
   * Reference to the dialog template for adding new parameters.
   * Used by the parameters table for creating new task parameters.
   */
  @ViewChild('newParameterDialog', {static: true})
  private readonly newParameterDialog: TemplateRef<any>;

  /**
   * Reference to the dialog template for adding new fields.
   * Used by the fields table for creating new task fields.
   */
  @ViewChild('newFieldDialog', {static: true})
  private readonly newFieldDialog: TemplateRef<any>;

    /**
     * The TaskFieldType enum exposed to the template
     */
    protected readonly TaskFieldType = TaskFieldType;

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
  isDBEditionScope(): boolean {
    return this.entityForm?.value?.scope === this.codeValues.editionTaskScope.dbEdition;
  }

  /**
   * Checks if the current task scope is Cartography query
   * @returns boolean indicating if scope is Cartography query
   */
  isCartographyEditionScope(): boolean {
    return this.entityForm?.value?.scope === this.codeValues.editionTaskScope.cartographyEdition;
  }

  /**
   * Constructor for the TaskBasicFormComponent.
   * Initializes the component with necessary services and sets up the form.
   *
   * @param dialog - Material dialog service for modal dialogs
   * @param translateService - Service for handling translations
   * @param translationService - Service for managing entity translations
   * @param codeListService - Service for accessing code lists
   * @param errorHandler - Service for handling errors
   * @param activatedRoute - Service for accessing route parameters
   * @param router - Angular router service for navigation
   * @param loadingService
   * @param messagesInterceptorState
   * @param loadingService
   * @param messagesInterceptorState
   * @param taskService - Service for task CRUD operations
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
    loadingService: LoadingOverlayService,
    messagesInterceptorState: MessagesInterceptorStateService,
    protected taskService: TaskService,
    protected utils: UtilsService,
    protected taskTypeService: TaskTypeService,
    protected roleService: RoleService,
    protected taskGroupService: TaskGroupService,
    protected territoryService: TerritoryService,
    protected taskAvailabilityService: TaskAvailabilityService,
    protected connectionService: ConnectionService,
    protected cartographyService: CartographyService
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router, loadingService, messagesInterceptorState);
    this.rolesTable = this.defineRolesTable();
    this.availabilitiesTable = this.defineAvailabilitiesTable();
    this.parametersTable = this.defineParametersTable();
    this.fieldsTable = this.defineFieldsTable();
  }

  /**
   * Initializes component data before fetching.
   * Registers data tables, and loads required data.
   *
   * @returns Promise that resolves when initialization is complete
   * @throws Error if task type or group is not found
   */
  override async preFetchData() {
    const type = magic.taskEditTypeId;

    this.dataTables.register(this.rolesTable)
      .register(this.availabilitiesTable)
      .register(this.parametersTable)
      .register(this.fieldsTable);

    await this.initCodeLists(['taskEntity.jsonParamType', 'editTask.fieldType', 'editTask.scope', 'queryTask.parameterType']);
    this.initTranslations('Task', ['name'])

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
    this.taskTypeNameTranslated = this.translateService.instant(`entity.task.edit.label`);
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
   * Fetches related data for the entity.
   * Loads translations for the current entity.
   *
   * @returns Promise that resolves when translations are loaded
   */
  override async fetchRelatedData() {
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
      scope: new FormControl(TaskPropertiesContract.getScope(this.entityToEdit.properties), {
        validators: [Validators.required],
        nonNullable: true
      }),
      connectionId: new FormControl(this.entityToEdit.connectionId, {
        validators: null,
        nonNullable: false
      }),
      cartographyId: new FormControl(this.entityToEdit.cartographyId, {
        validators: [Validators.required],
        nonNullable: true
      }),
      taskGroupId: new FormControl(this.entityToEdit.groupId, {
        validators: [Validators.required],
        nonNullable: true
      }),
    });
    this.configureForm(TaskPropertiesContract.getScope(this.entityToEdit.properties));
  }

  /**
   * Creates a Task object from the current form values.
   * Applies the form values to a copy of the current entity and converts it to a Task domain object.
   * This method ensures that entity data is not directly modified until explicitly saved.
   *
   * @param id - Optional ID for the new object, used when updating
   * @returns New Task instance populated with form values
   */
  createObject(id: number = null): Task {
    let safeToEdit = TaskProjection.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();
    safeToEdit = Object.assign(safeToEdit,
      formValues,
      {
        id: id,
        properties: TaskPropertiesContract.withScope(this.entityToEdit.properties, formValues.scope)
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
     * Handles field type change events from the dropdown selection.
     * Updates form field availability based on the selected type.
     *
     * @param event - Select change event containing the new type value
     */
    onFieldTypeChange(event: MatSelectChange) {
      this.configureFieldForm(event.value)
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
      if (value === this.codeValues.editionTaskScope.dbEdition) {
        this.entityForm.get('connectionId').enable();
        if (!this.entityForm.get('connectionId').hasValidator(Validators.required)) {
          this.entityForm.get('connectionId').setValidators(Validators.required);
        }
        this.entityForm.get('cartographyId').setValue(null);
        this.entityForm.get('cartographyId').removeValidators(Validators.required);
        this.entityForm.get('cartographyId').disable();
      } else if (value === this.codeValues.editionTaskScope.cartographyEdition) {
        this.entityForm.get('connectionId').enable();
        this.entityForm.get('connectionId').removeValidators(Validators.required);
        this.entityForm.get('cartographyId').enable();
        if (!this.entityForm.get('cartographyId').hasValidator(Validators.required)) {
          this.entityForm.get('cartographyId').setValidators(Validators.required);
        }
      } else {
        this.entityForm.get('connectionId').removeValidators(Validators.required);
        this.entityForm.get('connectionId').setValue(null);
        this.entityForm.get('connectionId').disable();
        this.entityForm.get('cartographyId').setValue(null);
        this.entityForm.get('cartographyId').removeValidators(Validators.required);
        this.entityForm.get('cartographyId').disable();
      }
    }

    /**
     * Configures form field availability based on the selected field type.
     * - ListBox: Enables query
     * - Other: Disable query
     *
     * @param value - The selected scope value
     */
    configureFieldForm(value: string) {
      const fieldForm = this.fieldsTable.templateDialog('newFieldDialog').form;
      if (value === TaskFieldType.LISTBOX) {
        fieldForm.get('query').enable();
      } else {
        fieldForm.get('query').setValue(null);
        fieldForm.get('query').disable();
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
   * Updates UI relationship if the form is dirty or being duplicated.
   *
   * @param _isDuplicated - Whether this is a duplication operation
   * @returns Promise that resolves when related data is updated
   */
  override async updateDataRelated(_isDuplicated: boolean) {
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

  getTaskGroupName(taskGroupId: number): string {
    return this.taskGroupList.find(group => group.id === taskGroupId)?.name || '';
  }

  /**
   * Label keys for the validation banner. Only includes fields that are mandatory for the current scope.
   */
  getValidationFieldLabelKeys(): Record<string, string> {
    const base: Record<string, string> = {
      name: 'common.form.name',
      scope: 'common.form.type',
      taskGroupId: 'entity.taskGroup.label',
    };
    const scope = this.entityForm?.get('scope')?.value;
    if (scope === this.codeValues.editionTaskScope.dbEdition) {
      base['connectionId'] = 'entity.task.query.connection';
    } else if (scope === this.codeValues.editionTaskScope.cartographyEdition) {
      base['cartographyId'] = 'entity.task.query.cartography';
    }
    return base;
  }

  /**
   * Defines the data table configuration for managing roles.
   * Sets up columns, data fetching, updating logic, and target selection.
   *
   * @returns Configured data table definition for roles
   */
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
  private defineParametersTable(): DataTableDefinition<TaskEditionParameter, TaskEditionParameter> {
    return DataTableDefinition.builder<TaskEditionParameter, TaskEditionParameter>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getEditableColumnDef('common.form.name', 'name'),
        this.utils.getNonEditableColumnDef('common.form.type', 'type'),
        this.utils.getNonEditableColumnWithCodeListDef('common.form.type', 'type', () => this.codeList('queryTask.parameterType')),
        this.utils.addConditionToColumnDef(this.utils.getBooleanColumnDef('common.form.required', 'required', true), (params) => params.data.type === TaskParameterType.QUERY),
        this.utils.getStatusColumnDef()])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        const originalParameters = TaskPropertiesContract.getParameters(this.entityToEdit?.properties);
        if (originalParameters.length > 0) {
          const parameters = originalParameters.map((parameter) => TaskEditionParameter.fromObject(parameter));
          return of(parameters);
        }
        return of<TaskEditionParameter[]>([])
      })
      .withRelationsUpdater(async (parameters: (TaskEditionParameter & Status)[]) => {
        const parametersToSave = parameters.filter(canKeepOrUpdate).map(value => TaskEditionParameter.fromObject(value))
        this.entityToEdit.properties = TaskPropertiesContract.withParameters(this.entityToEdit.properties, parametersToSave);
        await firstValueFrom(this.taskService.update(this.entityToEdit));
      })
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
          value: new FormControl('', {
            validators: [],
            nonNullable: false
          }),
          type: new FormControl(null, {
            validators: [Validators.required],
            nonNullable: true
          }),
          required: new FormControl(false, {
            validators: [Validators.required],
            nonNullable: true
          }),
        })).withPreOpenFunction((form: FormGroup) => {
          const defaultType = this.defaultValueOrNull('queryTask.parameterType');
          form.reset({type: defaultType?.value || null});
        }).build())
      .withTargetToRelation((items: TaskEditionParameter[]) => items.map(item => TaskEditionParameter.fromObject(item)))
      .withRelationsDuplicate(item => TaskEditionParameter.fromObject(item))
      .build();
  }

  /**
   * Defines the data table configuration for managing task parameters.
   * Sets up columns, data fetching, updating logic, and dialog templates.
   *
   * @returns Configured data table definition for parameters
   */
  private defineFieldsTable(): DataTableDefinition<TaskEditionField, TaskEditionField> {
    return DataTableDefinition.builder<TaskEditionField, TaskEditionField>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getBooleanColumnDef('tasksEditionEntity.selectable', 'selectable', true),
        this.utils.getBooleanColumnDef('tasksEditionEntity.editable', 'editable', true),
        this.utils.getEditableColumnDef('tasksEditionEntity.name', 'name'),
        this.utils.getEditableColumnDef('tasksEditionEntity.tag', 'label'),
        this.utils.getNonEditableColumnDef('tasksEditionEntity.defectValue', 'value'),
        this.utils.getNonEditableColumnWithCodeListDef('tasksEditionEntity.type', 'type', () => this.codeList('queryTask.fieldType')),
        this.utils.getBooleanColumnDef('tasksEditionEntity.obligatory', 'required', true),
        this.utils.getEditableColumnDef('tasksEditionEntity.selectPath', 'query'),
        this.utils.getStatusColumnDef()])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        const originalFields = TaskPropertiesContract.getFields(this.entityToEdit?.properties);
        if (originalFields.length > 0) {
          const fields = originalFields.map((field) => TaskEditionField.fromObject(field));
          return of(fields);
        }
        return of<TaskEditionField[]>([])
      })
      .withRelationsUpdater(async (fields: (TaskEditionField & Status)[]) => {
        const fieldsToSave = fields.filter(canKeepOrUpdate).map(value => TaskEditionField.fromObject(value))
        this.entityToEdit.properties = TaskPropertiesContract.withFields(this.entityToEdit.properties, fieldsToSave);
        await firstValueFrom(this.taskService.update(this.entityToEdit));
      })
      .withFieldRestriction('name')
      .withTemplateDialog('newFieldDialog', () => TemplateDialog.builder()
        .withReference(this.newFieldDialog)
        .withTitle(this.translateService.instant('tasksEditionEntity.newField'))
        .withForm(new FormGroup({
          selectable: new FormControl(false, {
            validators: [Validators.required],
            nonNullable: true
          }),
          editable: new FormControl(true, {
            validators: [Validators.required],
            nonNullable: true
          }),
          name: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true
          }),
          label: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true
          }),
          value: new FormControl('', {
            validators: [],
            nonNullable: false
          }),
          type: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true
          }),
          required: new FormControl(false, {
            validators: [Validators.required],
            nonNullable: true
          }),
          query: new FormControl('', {
            validators: [],
            nonNullable: false
          }),
        })).withPreOpenFunction((form: FormGroup) => {
          const defaultType = this.defaultValueOrNull('editTask.fieldType');
          form.reset({type: defaultType?.value || null});
        }).build())
      .withTargetToRelation((items: TaskEditionField[]) => items.map(item => TaskEditionField.fromObject(item)))
      .withRelationsDuplicate(item => TaskEditionField.fromObject(item))
      .build();
  }
}
