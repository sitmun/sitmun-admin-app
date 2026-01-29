import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";

import {TranslateService} from "@ngx-translate/core";
import {firstValueFrom, map, of} from "rxjs";

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
  TaskParameter,
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
  styles: []
})
export class TaskMoreInfoFormComponent extends BaseFormComponent<TaskProjection> implements OnInit {
  readonly config = Configuration.TASK_MORE_INFO;
  
  public override entityForm: FormGroup;
  
  protected readonly rolesTable: DataTableDefinition<Role, Role>;
  protected readonly availabilitiesTable: DataTableDefinition<TaskAvailabilityProjection, TerritoryProjection>;
  protected readonly parametersTable: DataTableDefinition<TaskParameter, TaskParameter>;
  
  private taskTypeName: string = null;
  protected taskTypeNameTranslated: string = null;
  private taskType: TaskType = null;
  
  protected taskGroupList: TaskGroup[] = [];
  protected cartographies: Cartography[] = [];
  protected connections: Connection[] = [];
  protected moreInfoUI: TaskUI = null;

  /** Data access type options */
  protected dataAccessTypes = [
    {value: 'api', label: 'tasksMoreInfoEntity.dataAccessTypeApi'},
    {value: 'sql', label: 'tasksMoreInfoEntity.dataAccessTypeSql'},
    {value: 'url-redirect', label: 'tasksMoreInfoEntity.dataAccessTypeUrlRedirect'}
  ];

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

    await this.initCodeLists(['tasksEntity.type', 'taskEntity.jsonParamType'])
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
    this.taskTypeNameTranslated = await firstValueFrom(this.translateService.get(`codelist.${this.taskTypeName}`));

    this.taskGroupList = taskGroups;
    this.cartographies = cartographies;
    this.connections = connections;
    this.moreInfoUI = uiList.find(ui => ui.name === 'sitna.moreInfo');
    if (!this.moreInfoUI) {
      this.loggerService.warn('UI control "sitna.moreInfo" not found in database');
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

    // Extract dataAccessType from properties or infer from scope
    let dataAccessType = properties.dataAccessType;
    if (!dataAccessType) {
      // Infer from scope if not explicitly stored
      if (properties.scope === 'sql-query') {
        dataAccessType = 'sql';
      } else if (properties.scope === 'web-api-query') {
        dataAccessType = 'api'; // default, could be url-redirect
      }
    }

    // Extract values based on dataAccessType
    let sqlQuery = null;
    let url = null;

    if (dataAccessType === 'sql') {
      sqlQuery = properties.command;
    } else {
      url = properties.command;
    }

    this.entityForm = new FormGroup({
      name: new FormControl(this.entityToEdit.name, {
        validators: [Validators.required],
        nonNullable: true
      }),
      uiId: new FormControl(this.moreInfoUI?.id || this.entityToEdit.uiId, {
        nonNullable: true
      }),
      uiName: new FormControl({value: this.moreInfoUI?.name || 'sitna.moreInfo', disabled: true}, {
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
      dataAccessType: new FormControl(dataAccessType, {
        validators: [Validators.required],
        nonNullable: true
      }),
      connectionId: new FormControl(this.entityToEdit.connectionId, {
        nonNullable: true
      }),
      sqlQuery: new FormControl(sqlQuery, {
        nonNullable: true
      }),
      url: new FormControl(url, {
        nonNullable: true
      })
    });
  }
  createObject(id: number = null): Task {
    let safeToEdit = TaskProjection.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();
    
    // Map dataAccessType to scope and set command appropriately
    let scope = null;
    let command = null;

    if (formValues.dataAccessType === 'sql') {
      scope = 'sql-query';
      command = formValues.sqlQuery;
    } else if (formValues.dataAccessType === 'api') {
      scope = 'web-api-query';
      command = formValues.url;
    } else if (formValues.dataAccessType === 'url-redirect') {
      //URL NEW SCOPE OR USING SAME AS API?
      scope = 'web-api-query';
      command = formValues.url;
    }

    // Get existing properties to preserve fields and parameters
    const existingProps: any = this.entityToEdit.properties || {};
    const properties: any = TaskPropertiesBuilder.create()
      .withScope(scope)
      .withCommand(command)
      .withParameters(existingProps.parameters || [])
      .withFields(existingProps.fields || [])
      .build();

    // Add dataAccessType to properties (not a standard Task field)
    properties.dataAccessType = formValues.dataAccessType;

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

    const uiId = this.entityForm.get('uiId')?.value;
    if (typeof uiId === 'number') {
      await firstValueFrom(entityCreated.updateRelationEx("ui", this.taskUIService.createProxy(uiId)));
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
  }

  override async updateDataRelated(_isDuplicated: boolean) {
    await this.saveTranslations(this.entityToEdit);

    const uiId = this.entityForm.get('uiId')?.value;
    if (typeof uiId === 'number') {
      await firstValueFrom(this.entityToEdit.updateRelationEx("ui", this.taskUIService.createProxy(uiId)));
    } else {
      await firstValueFrom(this.entityToEdit.deleteAllRelation("ui"));
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
    return this.entityForm?.value?.dataAccessType === 'sql';
  }

  isApiAccessType(): boolean {
    return this.entityForm?.value?.dataAccessType === 'api';
  }

  isUrlRedirectAccessType(): boolean {
    return this.entityForm?.value?.dataAccessType === 'url-redirect';
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

  private defineParametersTable(): DataTableDefinition<TaskParameter, TaskParameter> {
    return DataTableDefinition.builder<TaskParameter, TaskParameter>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getEditableColumnDef('common.form.name', 'name'),
        this.utils.getNonEditableColumnDef('common.form.type', 'type'),
        this.utils.getEditableColumnDef('common.form.value', 'value', 300, 500),
        this.utils.getStatusColumnDef()])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.entityToEdit?.properties?.parameters) {
          const originalParameters = this.entityToEdit.properties.parameters;
          const parameters = originalParameters.map((parameter: any) => TaskParameter.fromObject(parameter));
          return of(parameters);
        }
        return of<TaskParameter[]>([])
      })
      .withRelationsUpdater(async (parameters: (TaskParameter & Status)[]) => {
        const parametersToSave = parameters.filter(canKeepOrUpdate).map(value => TaskParameter.fromObject(value))
        this.entityToEdit.properties = TaskPropertiesBuilder.from(this.entityToEdit.properties)
          .withParameters(parametersToSave).build();
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
          type: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true
          }),
          value: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true
          })
        })).withPreOpenFunction((form: FormGroup) => {
          const defaultType = this.defaultValueOrNull('taskEntity.jsonParamType');
          form.reset({type: defaultType?.value || null});
        }).build())
      .withTargetToRelation((items: TaskParameter[]) => items.map(item => TaskParameter.fromObject(item)))
      .withRelationsDuplicate(item => TaskParameter.fromObject(item))
      .build();
  }
}
