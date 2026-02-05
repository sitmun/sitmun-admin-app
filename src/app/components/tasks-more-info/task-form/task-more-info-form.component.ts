import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {MatSelectChange} from "@angular/material/select";
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
  protected readonly parametersTable: DataTableDefinition<TaskMoreInfoParameter, TaskMoreInfoParameter>;
  
  private taskTypeName: string = null;
  protected taskTypeNameTranslated: string = null;
  private taskType: TaskType = null;
  
  protected taskGroupList: TaskGroup[] = [];
  protected cartographies: Cartography[] = [];
  protected connections: Connection[] = [];
  protected moreInfoUI: TaskUI = null;

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

    await this.initCodeLists(['tasksEntity.type', 'moreInfo.scope'])
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
      })
    });
  }
  createObject(id: number = null): Task {
    let safeToEdit = TaskProjection.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();

    const scope = formValues.scope;
    const command = formValues.command;

    // Get existing properties to preserve fields and parameters
    const existingProps: any = this.entityToEdit.properties || {};
    const properties: any = TaskPropertiesBuilder.create()
      .withScope(scope)
      .withCommand(command)
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

  isUrlRedirectAccessType(): boolean {
    return this.entityForm?.value?.scope === this.moreInfoScope.url;
  }

  onScopeChange(event: MatSelectChange) {
    if (event.value !== this.moreInfoScope.sql) {
      this.entityForm.get('connectionId')?.setValue(null);
    }
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
        this.utils.getEditableColumnDef('common.form.label', 'label'),
        this.utils.getEditableColumnDef('common.form.order', 'order'),
        this.utils.getEditableColumnDef('common.form.value', 'value', 300, 500),
        this.utils.getStatusColumnDef()])
      .withRelationsOrder('label')
      .withRelationsFetcher(() => {
        if (this.entityToEdit?.properties?.parameters) {
          const originalParameters = this.entityToEdit.properties.parameters;
          const parameters = originalParameters.map((parameter: any) => TaskMoreInfoParameter.fromObject(parameter));
          return of(parameters);
        }
        return of<TaskMoreInfoParameter[]>([])
      })
      .withRelationsUpdater(async (parameters: (TaskMoreInfoParameter & Status)[]) => {
        const parametersToSave = parameters.filter(canKeepOrUpdate).map(value => TaskMoreInfoParameter.fromObject(value))
        this.entityToEdit.properties = TaskPropertiesBuilder.from(this.entityToEdit.properties)
          .withParameters(parametersToSave).build();
        await firstValueFrom(this.taskService.update(this.entityToEdit));
      })
      .withTemplateDialog('newParameterDialog', () => TemplateDialog.builder()
        .withReference(this.newParameterDialog)
        .withTitle(this.translateService.instant('entity.task.parameters.title'))
        .withForm(new FormGroup({
          key: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true
          }),
          label: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true
          }),
          value: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true
          }),
          order: new FormControl(null, {
            validators: [],
            nonNullable: false
          })
        })).build())
      .withTargetToRelation((items: TaskMoreInfoParameter[]) => items.map(item => TaskMoreInfoParameter.fromObject(item)))
      .withRelationsDuplicate(item => TaskMoreInfoParameter.fromObject(item))
      .build();
  }
}
