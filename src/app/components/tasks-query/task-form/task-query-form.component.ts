import {HttpClient} from "@angular/common/http";
import {Component, TemplateRef, ViewChild} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatSelectChange} from "@angular/material/select";
import {ActivatedRoute, Router} from "@angular/router";

import {TranslateService} from "@ngx-translate/core";
import { firstValueFrom, map, of} from "rxjs";

import {BaseFormComponent} from "@app/components/base-form.component";
import {DataTableDefinition, TemplateDialog} from "@app/components/data-tables.util";
import {DataGridComponent} from "@app/frontend-gui/src/lib/data-grid/data-grid.component";
import {Configuration} from "@app/core/config/configuration";
import {MessagesInterceptorStateService} from "@app/core/interceptors/messages.interceptor";
import {
  Cartography,
  CartographyService,
  CodeList,
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
  TaskUIService,
  TerritoryProjection,
  TerritoryService,
  TranslationService
} from "@app/domain";
import { TaskPropertiesContract } from "@app/domain/task/models/task-properties";
import { TaskPropertiesBuilder } from "@app/domain/task/models/task-properties.builder";
import {TaskParameterType, TaskQueryParameter} from "@app/domain/task/models/task-query-parameter.model";
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
import {environment} from "@environments/environment";

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
    styles: [],
    standalone: false
})
export class TaskQueryFormComponent extends BaseFormComponent<TaskProjection> {
  private static readonly COMMAND_PLACEHOLDER_PATTERN = /([#$]?)\{([A-Za-z_][A-Za-z0-9_]*)\}/g;

  readonly config = Configuration.TASK_QUERY;

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

  @ViewChild('parametersGrid')
  private readonly parametersGrid?: DataGridComponent;

  /**
   * The TaskParameterType enum exposed to the template
   */
  protected readonly TaskParameterType = TaskParameterType;
  protected systemVariables: Map<string, string> = new Map();

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

  isWebApiQueryNoProxyScope(): boolean {
    return this.entityForm?.value?.scope === this.codeValues.queryTaskScope.webApiQueryNoProxy;
  }

  /**
   * Checks if the current task scope is Cartography query
   * @returns boolean indicating if scope is Cartography query
   */
  isCartographyQueryScope(): boolean {
    return this.entityForm?.value?.scope === this.codeValues.queryTaskScope.cartographyQuery;
  }

  isUrlQueryScope(): boolean {
    return this.entityForm?.value?.scope === this.codeValues.queryTaskScope.urlQuery;
  }

  /**
   * Returns the codelist entries for the API key name selector,
   * depending on the currently selected API key type.
   */
  get currentApiKeyCodeList(): CodeList[] {
    const type = this.entityForm?.get('apiKeyType')?.value;
    if (type === 'X-API-Key') return this.codeList('apiKey.header');
    if (type === 'Cookie') return this.codeList('apiKey.cookie');
    if (type === 'QueryParam') return this.codeList('apiKey.queryParam');
    return [];
  }

  protected getSystemVariablesHelp(): string {
    if (this.systemVariables.size === 0) {
      return 'Loading...';
    }

    return Array.from(this.systemVariables.keys())
      .map(key => `#{${key}}`)
      .join(', ');
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
   * @param loadingService
   * @param messagesInterceptorState
   * @param loadingService
   * @param messagesInterceptorState
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
    loadingService: LoadingOverlayService,
    messagesInterceptorState: MessagesInterceptorStateService,
    protected taskService: TaskService,
    protected taskUIService: TaskUIService,
    protected utils: UtilsService,
    protected taskTypeService: TaskTypeService,
    protected roleService: RoleService,
    protected taskGroupService: TaskGroupService,
    protected territoryService: TerritoryService,
    protected taskAvailabilityService: TaskAvailabilityService,
    protected connectionService: ConnectionService,
    protected cartographyService: CartographyService,
    protected http: HttpClient
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router, loadingService, messagesInterceptorState);
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
    const type = magic.taskQueryTypeId;

    try {
      const variables = await firstValueFrom(
        this.http.get<Record<string, string>>(`${environment.apiBaseURL}/api/config/system/variables`)
      );
      this.systemVariables = new Map(Object.entries(variables));
    } catch (error) {
      console.warn('Failed to load system variables:', error);
    }

    // Register data tables for roles, availabilities, and parameters
    this.dataTables.register(this.rolesTable)
      .register(this.availabilitiesTable)
      .register(this.parametersTable);
    await this.initCodeLists(['tasksEntity.type', 'queryTask.scope', 'queryTask.parameterType', 'service.authenticationMode', 'queryTask.mimeType', 'apiKey.header', 'apiKey.cookie', 'apiKey.queryParam']);
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
    this.taskTypeNameTranslated = this.translateService.instant(`entity.task.query.label`);
    if (!this.taskType) {
      throw new Error(`Task type ${this.taskTypeName} not found`);
    }

    taskGroups.sort((a, b) => a.name.localeCompare(b.name));
    this.taskGroupList = taskGroups;
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
      copy.name = this.translateService.instant("common.copyPrefix") + copy.name;
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
      scope: new FormControl(TaskPropertiesContract.getScope(this.entityToEdit.properties), {
        validators: [Validators.required],
        nonNullable: true
      }),
      command: new FormControl(TaskPropertiesContract.getCommand(this.entityToEdit.properties), {
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
      }),
      authenticationMode: new FormControl(
        TaskPropertiesContract.getAuthenticationMode(this.entityToEdit.properties),
        { validators: [], nonNullable: false }
      ),
      user: new FormControl(
        TaskPropertiesContract.getUser(this.entityToEdit.properties),
        { validators: [], nonNullable: false }
      ),
      password: new FormControl(
        TaskPropertiesContract.getPassword(this.entityToEdit.properties),
        { validators: [], nonNullable: false }
      ),
      apiKeyType: new FormControl(
        TaskPropertiesContract.getApiKeyType(this.entityToEdit.properties),
        { validators: [], nonNullable: false }
      ),
      apiKeyKeyName: new FormControl(
        TaskPropertiesContract.getApiKeyKeyName(this.entityToEdit.properties),
        { validators: [], nonNullable: false }
      ),
      apiKeyHeaderValue: new FormControl(
        TaskPropertiesContract.getApiKeyHeaderValue(this.entityToEdit.properties),
        { validators: [], nonNullable: false }
      ),
      mimeType: new FormControl(
        TaskPropertiesContract.getMimeType(this.entityToEdit.properties),
        { validators: [], nonNullable: false }
      ),
      filename: new FormControl(
        TaskPropertiesContract.getFilename(this.entityToEdit.properties),
        { validators: [], nonNullable: false }
      )
    });
    // Backward compat: if API key data exists in headers/queryParams but authMode is not set
    const legacyApiKeyType = TaskPropertiesContract.getApiKeyType(this.entityToEdit.properties);
    const authMode = TaskPropertiesContract.getAuthenticationMode(this.entityToEdit.properties);
    if (legacyApiKeyType && authMode !== 'API key') {
      this.entityForm.get('authenticationMode')?.setValue('API key');
      this.entityForm.get('apiKeyType')?.setValue(legacyApiKeyType);
      this.entityForm.get('apiKeyKeyName')?.setValue(TaskPropertiesContract.getApiKeyKeyName(this.entityToEdit.properties));
      this.entityForm.get('apiKeyHeaderValue')?.setValue(TaskPropertiesContract.getApiKeyHeaderValue(this.entityToEdit.properties));
    }
    // Single subscription: clear dependent fields when auth mode changes
    this.entityForm.get('authenticationMode')?.valueChanges.subscribe(mode => {
      if (mode !== 'API key') {
        this.entityForm.get('apiKeyType')?.setValue(null);
        this.entityForm.get('apiKeyKeyName')?.setValue(null);
        this.entityForm.get('apiKeyHeaderValue')?.setValue(null);
      }
      if (mode !== 'HTTP Basic authentication') {
        this.entityForm.get('user')?.setValue(null);
        this.entityForm.get('password')?.setValue(null);
      }
    });
    // Clear key name when type changes (different codelist per type)
    this.entityForm.get('apiKeyType')?.valueChanges.subscribe(() => {
      this.entityForm.get('apiKeyKeyName')?.setValue(null);
    });
    this.configureForm(TaskPropertiesContract.getScope(this.entityToEdit.properties))
  }

  /**
   * Creates a Task object from the current form values.
   *
   * @param id - Optional ID for the new object, used when updating
   * @returns New Task instance populated with form values
   */
  createObject(id: number = null): Task {
    let safeToEdit = TaskProjection.fromObject(this.entityToEdit);
    const { authenticationMode, user, password, apiKeyType, apiKeyKeyName, apiKeyHeaderValue, scope, command, mimeType, filename, ...mainFormValues } = this.entityForm.getRawValue();
    const isHeader = apiKeyType === 'X-API-Key' && apiKeyKeyName && apiKeyHeaderValue;
    const isCookie = apiKeyType === 'Cookie' && apiKeyKeyName && apiKeyHeaderValue;
    const isQueryParam = apiKeyType === 'QueryParam' && apiKeyKeyName && apiKeyHeaderValue;
    let headers: Record<string, string> | null = null;
    if (isHeader) {
      headers = { [apiKeyKeyName]: apiKeyHeaderValue };
    } else if (isCookie) {
      headers = { 'Cookie': `${apiKeyKeyName}=${apiKeyHeaderValue}` };
    }
    const queryParams = isQueryParam ? { [apiKeyKeyName]: apiKeyHeaderValue } : null;
    safeToEdit = Object.assign(safeToEdit,
      mainFormValues,
      {
        id: id,
        properties: {
          ...(this.entityToEdit?.properties || {}),
          ...TaskPropertiesBuilder.from(this.entityToEdit.properties)
          .withScope(scope)
          .withCommand(command)
          .withMimeType(mimeType || null)
          .withFilename(filename || null)
          .withAuthenticationMode(authenticationMode || null)
          .withUser(user || null)
          .withPassword(password || null)
          .withApiKeyType(apiKeyType || null)
          .withHeaders(headers)
          .withQueryParams(queryParams)
          .build(),
        }
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
    const scope = this.codeValues?.queryTaskScope;

    // Sweep and reset provided flags when changing to non-proxied scopes
    const isDirectScope = value === scope?.webApiQueryNoProxy || value === scope?.urlQuery;
    if (isDirectScope) {
      const parameters = this.entityForm.get('properties')?.get('parameters')?.value;
      if (parameters && Array.isArray(parameters)) {
        let hadProvidedParams = false;
        parameters.forEach((param: any) => {
          if (param.provided === true) {
            param.provided = false;
            hadProvidedParams = true;
          }
        });
        if (hadProvidedParams) {
          console.warn(`Scope changed to ${value}. All provided parameters have been reset to false (direct-execution scopes do not support backend variables).`);
        }
      }
    }
    if (value === scope?.sqlQuery) {
      this.entityForm.get('command').enable({ emitEvent: false });
      this.entityForm.get('connectionId').enable({ emitEvent: false });
      this.entityForm.get('cartographyId').setValue(null);
      this.entityForm.get('cartographyId').disable({ emitEvent: false });
      this.entityForm.get('authenticationMode')?.setValue(null);
      this.entityForm.get('authenticationMode')?.disable({ emitEvent: false });
      this.entityForm.get('user')?.setValue(null);
      this.entityForm.get('user')?.disable({ emitEvent: false });
      this.entityForm.get('password')?.setValue(null);
      this.entityForm.get('password')?.disable({ emitEvent: false });
      this.entityForm.get('apiKeyType')?.setValue(null);
      this.entityForm.get('apiKeyType')?.disable({ emitEvent: false });
      this.entityForm.get('apiKeyKeyName')?.setValue(null);
      this.entityForm.get('apiKeyKeyName')?.disable({ emitEvent: false });
      this.entityForm.get('apiKeyHeaderValue')?.setValue(null);
      this.entityForm.get('apiKeyHeaderValue')?.disable({ emitEvent: false });
      this.entityForm.get('mimeType')?.setValue(null);
      this.entityForm.get('mimeType')?.disable({ emitEvent: false });
      this.entityForm.get('filename')?.setValue(null);
      this.entityForm.get('filename')?.disable({ emitEvent: false });
    } else if (value === scope?.cartographyQuery) {
      this.entityForm.get('command').setValue(null);
      this.entityForm.get('command').disable({ emitEvent: false });
      this.entityForm.get('connectionId').setValue(null);
      this.entityForm.get('connectionId').disable({ emitEvent: false });
      this.entityForm.get('cartographyId').enable({ emitEvent: false });
      this.entityForm.get('authenticationMode')?.setValue(null);
      this.entityForm.get('authenticationMode')?.disable({ emitEvent: false });
      this.entityForm.get('user')?.setValue(null);
      this.entityForm.get('user')?.disable({ emitEvent: false });
      this.entityForm.get('password')?.setValue(null);
      this.entityForm.get('password')?.disable({ emitEvent: false });
      this.entityForm.get('apiKeyType')?.setValue(null);
      this.entityForm.get('apiKeyType')?.disable({ emitEvent: false });
      this.entityForm.get('apiKeyKeyName')?.setValue(null);
      this.entityForm.get('apiKeyKeyName')?.disable({ emitEvent: false });
      this.entityForm.get('apiKeyHeaderValue')?.setValue(null);
      this.entityForm.get('apiKeyHeaderValue')?.disable({ emitEvent: false });
      this.entityForm.get('mimeType')?.setValue(null);
      this.entityForm.get('mimeType')?.disable({ emitEvent: false });
      this.entityForm.get('filename')?.setValue(null);
      this.entityForm.get('filename')?.disable({ emitEvent: false });
    } else if (value === scope?.webApiQuery) {
      this.entityForm.get('command').enable({ emitEvent: false });
      this.entityForm.get('connectionId').setValue(null);
      this.entityForm.get('connectionId').disable({ emitEvent: false });
      this.entityForm.get('cartographyId').setValue(null);
      this.entityForm.get('cartographyId').disable({ emitEvent: false });
      this.entityForm.get('authenticationMode')?.enable({ emitEvent: false });
      this.entityForm.get('user')?.enable({ emitEvent: false });
      this.entityForm.get('password')?.enable({ emitEvent: false });
      this.entityForm.get('apiKeyType')?.enable({ emitEvent: false });
      this.entityForm.get('apiKeyKeyName')?.enable({ emitEvent: false });
      this.entityForm.get('apiKeyHeaderValue')?.enable({ emitEvent: false });
      this.entityForm.get('mimeType')?.enable({ emitEvent: false });
      this.entityForm.get('filename')?.enable({ emitEvent: false });
    } else if (value === scope?.webApiQueryNoProxy) {
      this.entityForm.get('command').enable({ emitEvent: false });
      this.entityForm.get('connectionId').setValue(null);
      this.entityForm.get('connectionId').disable({ emitEvent: false });
      this.entityForm.get('cartographyId').setValue(null);
      this.entityForm.get('cartographyId').disable({ emitEvent: false });
      this.entityForm.get('authenticationMode')?.setValue(null);
      this.entityForm.get('authenticationMode')?.disable({ emitEvent: false });
      this.entityForm.get('user')?.setValue(null);
      this.entityForm.get('user')?.disable({ emitEvent: false });
      this.entityForm.get('password')?.setValue(null);
      this.entityForm.get('password')?.disable({ emitEvent: false });
      this.entityForm.get('apiKeyType')?.setValue(null);
      this.entityForm.get('apiKeyType')?.disable({ emitEvent: false });
      this.entityForm.get('apiKeyKeyName')?.setValue(null);
      this.entityForm.get('apiKeyKeyName')?.disable({ emitEvent: false });
      this.entityForm.get('apiKeyHeaderValue')?.setValue(null);
      this.entityForm.get('apiKeyHeaderValue')?.disable({ emitEvent: false });
      this.entityForm.get('mimeType')?.enable({ emitEvent: false });
      this.entityForm.get('filename')?.enable({ emitEvent: false });
    } else if (value === scope?.urlQuery) {
      this.entityForm.get('command').enable({ emitEvent: false });
      this.entityForm.get('connectionId').setValue(null);
      this.entityForm.get('connectionId').disable({ emitEvent: false });
      this.entityForm.get('cartographyId').setValue(null);
      this.entityForm.get('cartographyId').disable({ emitEvent: false });
      this.entityForm.get('authenticationMode')?.setValue(null);
      this.entityForm.get('authenticationMode')?.disable({ emitEvent: false });
      this.entityForm.get('user')?.setValue(null);
      this.entityForm.get('user')?.disable({ emitEvent: false });
      this.entityForm.get('password')?.setValue(null);
      this.entityForm.get('password')?.disable({ emitEvent: false });
      this.entityForm.get('apiKeyType')?.setValue(null);
      this.entityForm.get('apiKeyType')?.disable({ emitEvent: false });
      this.entityForm.get('apiKeyKeyName')?.setValue(null);
      this.entityForm.get('apiKeyKeyName')?.disable({ emitEvent: false });
      this.entityForm.get('apiKeyHeaderValue')?.setValue(null);
      this.entityForm.get('apiKeyHeaderValue')?.disable({ emitEvent: false });
      this.entityForm.get('mimeType')?.setValue(null);
      this.entityForm.get('mimeType')?.disable({ emitEvent: false });
      this.entityForm.get('filename')?.setValue(null);
      this.entityForm.get('filename')?.disable({ emitEvent: false });
    } else {
      console.error(`Unknown task query scope type: ${value}. Expected one of: sql-query, cartography-query, web-api-query, web-api-query-no-proxy, external-link`);
      this.entityForm.get('command').setValue(null);
      this.entityForm.get('command').disable({ emitEvent: false });
      this.entityForm.get('connectionId').setValue(null);
      this.entityForm.get('connectionId').disable({ emitEvent: false });
      this.entityForm.get('cartographyId').setValue(null);
      this.entityForm.get('cartographyId').disable({ emitEvent: false });
      this.entityForm.get('authenticationMode')?.setValue(null);
      this.entityForm.get('authenticationMode')?.disable({ emitEvent: false });
      this.entityForm.get('user')?.setValue(null);
      this.entityForm.get('user')?.disable({ emitEvent: false });
      this.entityForm.get('password')?.setValue(null);
      this.entityForm.get('password')?.disable({ emitEvent: false });
      this.entityForm.get('apiKeyType')?.setValue(null);
      this.entityForm.get('apiKeyType')?.disable({ emitEvent: false });
      this.entityForm.get('apiKeyKeyName')?.setValue(null);
      this.entityForm.get('apiKeyKeyName')?.disable({ emitEvent: false });
      this.entityForm.get('apiKeyHeaderValue')?.setValue(null);
      this.entityForm.get('apiKeyHeaderValue')?.disable({ emitEvent: false });
      this.entityForm.get('mimeType')?.setValue(null);
      this.entityForm.get('mimeType')?.disable({ emitEvent: false });
      this.entityForm.get('filename')?.setValue(null);
      this.entityForm.get('filename')?.disable({ emitEvent: false });
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

  override canSave(): boolean {
    return super.canSave() && this.getMissingCommandParameterNames().length === 0;
  }

  override get canSaveEntity(): boolean {
    return super.canSaveEntity && this.getMissingCommandParameterNames().length === 0;
  }

  protected get customWarningMessage(): string {
    const missingParameters = this.getMissingCommandParameterNames();
    if (missingParameters.length === 0) {
      return '';
    }

    return this.translateService.instant('entity.task.query.missingDeclaredParameters', {
      parameters: missingParameters.join(', '),
    });
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
      .withTargetsTitle('entity.task.roles.title')
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
      .withTargetsTitle('entity.task.territories.title')
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
    return DataTableDefinition.builder<TaskQueryParameter, TaskQueryParameter>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getEditableColumnDef('common.form.name', 'name'),
        this.utils.getEditableColumnDef('common.form.label', 'label'),
        this.utils.getNonEditableColumnDef('common.form.value', 'value'),
        this.utils.getNonEditableColumnWithCodeListDef('common.form.type', 'type', () => this.codeList('queryTask.parameterType')),
        this.utils.addConditionToColumnDef(this.utils.getBooleanColumnDef('common.form.required', 'required', true), (params) => params.data.type === TaskParameterType.QUERY),
        this.utils.addConditionToColumnDef(this.utils.getBooleanColumnDef('entity.task.parameters.provided', 'provided', false), (params) => params.data.type === TaskParameterType.QUERY),
        this.utils.getStatusColumnDef()])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        const originalParameters = TaskPropertiesContract.getParameters(this.entityToEdit?.properties);
        if (originalParameters.length > 0) {
          const parameters = originalParameters.map((parameter) => TaskQueryParameter.fromObject(parameter));
          return of(parameters);
        }
        return of<TaskQueryParameter[]>([])
      })
      .withRelationsUpdater(async (parameters: (TaskQueryParameter & Status)[]) => {
        const parametersToSave = parameters
          .filter(canKeepOrUpdate)
          .map(value => TaskQueryParameter.fromObject(value));
        this.entityToEdit.properties = TaskPropertiesContract.withParameters(this.entityToEdit.properties, parametersToSave);
        await firstValueFrom(this.taskService.update(this.entityToEdit));
      })
      .withFieldRestriction('name')
      .withTemplateDialog('newParameterDialog', () => TemplateDialog.builder()
        .withReference(this.newParameterDialog)
        .withTitle('entity.task.parameters.title')
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
          provided: new FormControl(false, {
            validators: [],
            nonNullable: true
          }),
        })).withPreOpenFunction((form: FormGroup) => {
          const defaultType = this.defaultValueOrNull('queryTask.parameterType');
          form.reset({type: defaultType?.value || null, provided: false});
        }).build())
      .withTargetToRelation((items: TaskQueryParameter[]) => items.map(item => TaskQueryParameter.fromObject(item)))
      .withRelationsDuplicate(item => TaskQueryParameter.fromObject(item))
      .build();
  }

  getTaskGroupName(taskGroupId: number): string {
      return this.taskGroupList.find(group => group.id === taskGroupId)?.name || '';
  }

  /**
   * Checks if the current task scope allows provided parameters.
   * Provided parameters (backend-only variables) are only supported for proxied scopes.
   * @returns true if scope is sql-query, web-api-query, or cartography-query; false otherwise
   */
  protected canHaveProvidedParameters(): boolean {
    const scope = this.entityForm?.get('scope')?.value;
    if (!scope) {
      return false;
    }
    const scopeValues = this.codeValues?.queryTaskScope;
    return scope === scopeValues?.sqlQuery
      || scope === scopeValues?.webApiQuery
      || scope === scopeValues?.cartographyQuery;
  }

  private getMissingCommandParameterNames(): string[] {
    const declaredParameters = new Set(this.getCurrentParameters()
      .map((parameter) => this.parameterName(parameter))
      .filter((parameterName) => parameterName.length > 0));

    return Array.from(this.extractCommandPlaceholders())
      .filter((parameterName) => !declaredParameters.has(parameterName))
      .sort((left, right) => left.localeCompare(right));
  }

  private extractCommandPlaceholders(): Set<string> {
    const command = String(this.entityForm?.get('command')?.value || '');
    const placeholders = new Set<string>();

    for (const match of command.matchAll(TaskQueryFormComponent.COMMAND_PLACEHOLDER_PATTERN)) {
      const prefix = match[1];
      const parameterName = match[2]?.trim();
      if (prefix === '#' || !parameterName) {
        continue;
      }
      placeholders.add(parameterName);
    }

    return placeholders;
  }

  private getCurrentParameters(): Record<string, unknown>[] {
    const gridRows = this.parametersGrid?.rowData;
    if (Array.isArray(gridRows)) {
      return gridRows.filter((parameter) => parameter?.status !== 'pendingDelete');
    }

    return TaskPropertiesContract.getParameters(this.entityToEdit?.properties);
  }

  private parameterName(parameter: Record<string, unknown>): string {
    const value = parameter['name'] ?? parameter['variable'] ?? parameter['label'];
    return typeof value === 'string' ? value.trim() : '';
  }
}
