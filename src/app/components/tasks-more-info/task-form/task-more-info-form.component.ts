import {HttpClient} from "@angular/common/http";
import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {ErrorStateMatcher} from "@angular/material/core";
import {MatDialog} from "@angular/material/dialog";
import {MatSelectChange} from "@angular/material/select";
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
  TaskMoreInfoParameter,
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
import {environment} from "@environments/environment";

@Component({
  selector: 'app-task-more-info-form',
  templateUrl: './task-more-info-form.component.html',
  styleUrl: './task-more-info-form.component.scss',
  standalone: false
})
export class TaskMoreInfoFormComponent extends BaseFormComponent<TaskProjection> implements OnInit {
  readonly config = Configuration.TASK_MORE_INFO;
  private readonly apiParameterPattern = /\{(\w+)\}/g;

  public override entityForm: FormGroup;

  protected readonly rolesTable: DataTableDefinition<Role, Role>;
  protected readonly availabilitiesTable: DataTableDefinition<TaskAvailabilityProjection, TerritoryProjection>;
  protected readonly parametersTable: DataTableDefinition<TaskMoreInfoParameter, TaskMoreInfoParameter>;

  private taskTypeName: string = null;
  protected taskTypeNameTranslated: string = null;
  private taskType: TaskType = null;

  protected taskGroupList: TaskGroup[] = [];
  protected cartographies: Cartography[] = [];
  protected connections: Connection[] = [];
  protected moreInfoUI: TaskUI = null;
  protected systemVariables: Map<string, string> = new Map();

  protected cartographySearchControl = new FormControl<string | Cartography>('', {
    validators: [Validators.required, this.cartographyValidator.bind(this)],
    nonNullable: true
  });
  protected filteredCartographies = of<Cartography[]>([]);
  protected cartographyErrorMatcher = new CartographyErrorStateMatcher();

  // Map form control names to their i18n label keys for validation banner
  protected validationFieldLabels: Record<string, string> = {
    'name': 'entity.task.label',
    'taskGroupId': 'entity.taskGroup.label',
    'cartographyId': 'tasksMoreInfoEntity.cartography',
    'scope': 'tasksMoreInfoEntity.dataAccessType',
    'command': 'common.form.command',
    'connectionId': 'tasksMoreInfoEntity.connection'
  };

  private readonly moreInfoScope = {
    sql: 'SQL',
    api: 'API',
    url: 'URL'
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
    protected taskTypeService: TaskTypeService,
    protected taskGroupService: TaskGroupService,
    protected cartographyService: CartographyService,
    protected taskUIService: TaskUIService,
    protected utils: UtilsService,
    protected roleService: RoleService,
    protected territoryService: TerritoryService,
    protected taskAvailabilityService: TaskAvailabilityService,
    protected connectionService: ConnectionService,
    protected http: HttpClient,
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

    this.dataTables.register(this.rolesTable)
      .register(this.availabilitiesTable)
      .register(this.parametersTable);

    // Fetch system variables from backend
    try {
      const variables = await firstValueFrom(
        this.http.get<Record<string, string>>(`${environment.apiBaseURL}/api/config/system/variables`)
      );
      this.systemVariables = new Map(Object.entries(variables));
    } catch (error) {
      console.warn('Failed to load system variables:', error);
      // Continue without system variables
    }

    await this.initCodeLists(['tasksEntity.type', 'moreInfo.type', 'service.authenticationMode'])
    this.initTranslations('Task', ['name'])

    const [taskTypes, taskGroups, cartographies, connections, uiList] = await Promise.all([
      firstValueFrom(this.taskTypeService.getAllEx()),
      firstValueFrom(this.taskGroupService.getAllEx()),
      firstValueFrom(this.cartographyService.getAll()),
      firstValueFrom(this.connectionService.getAll()),
      firstValueFrom(this.taskUIService.getAll())
    ]);

    this.taskType = taskTypes.find(taskType => taskType.id === type);
    if (!this.taskType) {
      this.loggerService.error(`Task type ${type} not found`);
    }
    this.taskTypeName = this.taskType.name;
    this.taskTypeNameTranslated = this.translateService.instant(`entity.task.moreInfo.label`);

    this.taskGroupList = taskGroups;
    this.cartographies = cartographies;
    this.connections = connections;
    this.moreInfoUI = uiList.find(ui => ui.name === 'sitna.moreInfo');
    if (!this.moreInfoUI) {
      this.loggerService.error('UI control "sitna.moreInfo" not found in database - task will not be identified correctly');
    } else {
      this.loggerService.info(`UI control "sitna.moreInfo" loaded with ID: ${this.moreInfoUI.id}`);
    }
  }

  override async fetchRelatedData() {
    return this.loadTranslations(this.entityToEdit);
  }

  override fetchOriginal(): Promise<TaskProjection> {
    return firstValueFrom(this.taskService.getProjection(TaskProjection, this.entityID));
  }

  override fetchCopy(): Promise<TaskProjection> {
    return firstValueFrom(this.taskService.getProjection(TaskProjection, this.duplicateID).pipe(map((copy: TaskProjection) => {
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

    const properties: any = this.entityToEdit.properties || {};

    // Extract scope/command (fallback to legacy dataAccessType values)
    let scope = properties.scope;
    if (!scope && properties.dataAccessType) {
      if (properties.dataAccessType === 'sql') {
        scope = this.moreInfoScope.sql;
      } else if (properties.dataAccessType === 'api') {
        scope = this.moreInfoScope.api;
      } else if (properties.dataAccessType === 'url-redirect') {
        scope = this.moreInfoScope.url;
      }
    }
    if (scope === 'sql-query') {
      scope = this.moreInfoScope.sql;
    }
    if (scope === 'web-api-query') {
      scope = this.moreInfoScope.api;
    }
    const command = properties.command || null;
    const defaultAuthMode = this.defaultValueOrNull('service.authenticationMode');
    const authenticationMode = properties.authenticationMode ?? defaultAuthMode?.value ?? null;
    const user = properties.user || null;
    const password = properties.password || null;
    const apiKey = properties?.headers?.['X-API-Key'] || null;
    const addApiKey = scope === this.moreInfoScope.api && !!apiKey;

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
      scope: new FormControl(scope, {
        validators: [Validators.required],
        nonNullable: true
      }),
      connectionId: new FormControl(this.entityToEdit.connectionId, {
        nonNullable: true
      }),
      command: new FormControl(command, {
        validators: [Validators.required],
        nonNullable: true
      }),
      authenticationMode: new FormControl(authenticationMode),
      user: new FormControl(user),
      password: new FormControl(password),
      addApiKey: new FormControl(addApiKey, {
        nonNullable: true
      }),
      apiKey: new FormControl(apiKey)
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

    this.updateApiKeyValidation();
    this.entityForm.get('addApiKey')?.valueChanges.subscribe(() => this.updateApiKeyValidation());
    this.entityForm.get('scope')?.valueChanges.subscribe(() => this.updateApiKeyValidation());
  }
  createObject(id: number = null): Task {
    let safeToEdit = TaskProjection.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();

    const scope = formValues.scope;
    const command = formValues.command;
    const authenticationMode = scope === this.moreInfoScope.api ? formValues.authenticationMode : null;
    const user = scope === this.moreInfoScope.api ? formValues.user : null;
    const password = scope === this.moreInfoScope.api ? formValues.password : null;
    const addApiKey = scope === this.moreInfoScope.api && !!formValues.addApiKey;
    const apiKey = addApiKey && typeof formValues.apiKey === 'string' ? formValues.apiKey.trim() : null;

    // Get existing properties to preserve fields and parameters
    const existingProps: any = this.entityToEdit.properties || {};
    const headers = this.buildHeaders(existingProps.headers, apiKey);
    const properties: any = TaskPropertiesBuilder.create()
      .withScope(scope)
      .withCommand(command)
      .withAuthenticationMode(authenticationMode)
      .withUser(user)
      .withPassword(password)
      .withHeaders(headers)
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

    // Update connection relationship
    const connectionId = this.entityForm.get('connectionId')?.value
    if (typeof connectionId === 'number') {
      await firstValueFrom(this.entityToEdit.updateRelationEx("connection", this.connectionService.createProxy(connectionId)));
    } else {
      await firstValueFrom(this.entityToEdit.deleteAllRelation("connection"));
    }

    // Update cartography relationship
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

  getConnectionName(connectionId: number): string {
    return this.connections.find(conn => conn.id === connectionId)?.name || '';
  }

  isSqlAccessType(): boolean {
    return this.entityForm?.value?.scope === this.moreInfoScope.sql;
  }

  isApiAccessType(): boolean {
    return this.entityForm?.value?.scope === this.moreInfoScope.api;
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

  protected getSystemVariablesHelp(): string {
    if (this.systemVariables.size === 0) {
      return 'Loading...';
    }
    
    const vars = Array.from(this.systemVariables.keys())
      .map(key => `#{${key}}`)
      .join(', ');
    
    return vars;
  }

  isUrlRedirectAccessType(): boolean {
    return this.entityForm?.value?.scope === this.moreInfoScope.url;
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

  onScopeChange(event: MatSelectChange) {
    if (event.value !== this.moreInfoScope.sql) {
      this.entityForm.get('connectionId')?.setValue(null);
    }
    if (event.value !== this.moreInfoScope.api) {
      this.entityForm.get('authenticationMode')?.setValue(null);
      this.entityForm.get('user')?.setValue(null);
      this.entityForm.get('password')?.setValue(null);
      this.entityForm.get('addApiKey')?.setValue(false);
      this.entityForm.get('apiKey')?.setValue(null);
    } else if (!this.entityForm.get('authenticationMode')?.value) {
      const defaultAuthMode = this.defaultValueOrNull('service.authenticationMode');
      this.entityForm.get('authenticationMode')?.setValue(defaultAuthMode?.value ?? null);
    }
  }

  onAddApiKeyChange() {
    this.updateApiKeyValidation();
  }

  private updateApiKeyValidation() {
    const shouldRequireApiKey = this.isApiAccessType() && !!this.entityForm.get('addApiKey')?.value;
    const apiKeyControl = this.entityForm.get('apiKey');

    if (!apiKeyControl) {
      return;
    }

    if (shouldRequireApiKey) {
      apiKeyControl.setValidators([Validators.required]);
    } else {
      apiKeyControl.clearValidators();
    }
    apiKeyControl.updateValueAndValidity({emitEvent: false});
  }

  private buildHeaders(existingHeaders: Record<string, string> | null | undefined, apiKey: string | null): Record<string, string> | null {
    const headers = existingHeaders && existingHeaders instanceof Object ? {...existingHeaders} : {};

    if (apiKey) {
      headers['X-API-Key'] = apiKey;
      return headers;
    }

    delete headers['X-API-Key'];
    return Object.keys(headers).length > 0 ? headers : null;
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

  private defineParametersTable(): DataTableDefinition<TaskMoreInfoParameter, TaskMoreInfoParameter> {
    return DataTableDefinition.builder<TaskMoreInfoParameter, TaskMoreInfoParameter>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getEditableColumnDef('entity.task.parameters.variable', 'label'),
        this.utils.getEditableColumnDef('entity.task.parameters.field', 'value', 300, 500),
        this.utils.getEditableColumnDef('common.form.description', 'description', 250, 500),
        this.utils.getBooleanColumnDef('entity.task.parameters.provided', 'provided', true),
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
          .map(value => {
            const p = TaskMoreInfoParameter.fromObject(value);
            // If provided=true, Field must be empty (backend-only variable)
            if (p.provided) {
              p.value = '';
            }
            return p;
          });
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
            validators: [],
            nonNullable: false
          }),
          description: new FormControl('', {
            validators: [],
            nonNullable: false
          }),
          provided: new FormControl(false, {
            validators: [],
            nonNullable: true
          })
        })).withPreOpenFunction((form: FormGroup) => {
          form.reset({
            label: '',
            value: '',
            description: '',
            provided: false
          });
          
          // Auto-detect system variables and mark as provided
          const valueControl = form.get('value');
          const providedControl = form.get('provided');
          
          if (valueControl && providedControl) {
            // When provided=true, Field must be empty (not applicable for backend-provided variables)
            providedControl.valueChanges.subscribe(isProvided => {
              if (isProvided) {
                valueControl.clearValidators();
                valueControl.setValue('');
                valueControl.disable({ emitEvent: false });
              } else {
                valueControl.enable({ emitEvent: false });
                valueControl.setValidators([Validators.required]);
              }
              valueControl.updateValueAndValidity();
            });

            // Initial state: provided=false -> Field required/enabled
            valueControl.enable({ emitEvent: false });
            valueControl.setValidators([Validators.required]);
            valueControl.updateValueAndValidity({ emitEvent: false });
          }
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
