import {Component} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom, map, of, startWith} from 'rxjs';

import {BaseFormComponent} from '@app/components/base-form.component';
import {DataTableDefinition} from '@app/components/data-tables.util';
import {Configuration} from '@app/core/config/configuration';
import {MessagesInterceptorStateService} from '@app/core/interceptors/messages.interceptor';
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
  TaskProjection,
  TaskService,
  TaskType,
  TaskTypeService,
  TaskUI,
  TaskUIService,
  TaskMoreInfoParameter,
  TaskPropertiesBuilder,
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

type AdvancedTaskKind = 'parent' | 'child' | 'independent';

interface AdvancedTaskProperties extends Record<string, unknown> {
  advancedTaskKind?: AdvancedTaskKind;
  responseFormat?: string;
  htmlTemplate?: string;
  parentLayout?: string;
  relatedTable?: string;
  childPresentationOrder?: string;
  parentTaskIds?: number[];
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

  protected readonly rolesTable: DataTableDefinition<Role, Role>;
  protected readonly availabilitiesTable: DataTableDefinition<TaskAvailabilityProjection, TerritoryProjection>;
  protected readonly parametersTable: DataTableDefinition<TaskMoreInfoParameter, TaskMoreInfoParameter>;

  private taskType: TaskType = null;
  private readonly taskTypeId = magic.taskMoreInfoTypeId;

  protected taskTypeNameTranslated: string = null;
  protected cartographies: Cartography[] = [];
  protected connections: Connection[] = [];
  protected allMoreInfoTasks: TaskProjection[] = [];
  protected advancedUI: TaskUI = null;

  protected cartographySearchControl = new FormControl<string | Cartography>('', {
    validators: [Validators.required, this.cartographyValidator.bind(this)],
    nonNullable: true
  });
  protected filteredCartographies = of<Cartography[]>([]);
  protected cartographyErrorMatcher = new CartographyErrorStateMatcher();

  protected readonly advancedKinds: Array<{ value: AdvancedTaskKind, key: string }> = [
    {value: 'parent', key: 'tasksMoreInfoAdvancedEntity.kind.parent'},
    {value: 'child', key: 'tasksMoreInfoAdvancedEntity.kind.child'},
    {value: 'independent', key: 'tasksMoreInfoAdvancedEntity.kind.independent'}
  ];

  protected readonly responseFormats: Array<{ value: string, key: string }> = [
    {value: 'table', key: 'tasksMoreInfoAdvancedEntity.responseFormat.table'},
    {value: 'images', key: 'tasksMoreInfoAdvancedEntity.responseFormat.images'},
    {value: 'html', key: 'tasksMoreInfoAdvancedEntity.responseFormat.html'}
  ];

  protected readonly parentLayouts: Array<{ value: string, key: string }> = [
    {value: 'scroll', key: 'tasksMoreInfoAdvancedEntity.parentLayout.scroll'},
    {value: 'tabs', key: 'tasksMoreInfoAdvancedEntity.parentLayout.tabs'}
  ];

  protected readonly childPresentationOrders: Array<{ value: string, key: string }> = [
    {value: 'manual', key: 'tasksMoreInfoAdvancedEntity.childOrder.manual'},
    {value: 'nameAsc', key: 'tasksMoreInfoAdvancedEntity.childOrder.nameAsc'},
    {value: 'nameDesc', key: 'tasksMoreInfoAdvancedEntity.childOrder.nameDesc'}
  ];

  protected readonly moreInfoScope = {
    sql: 'SQL',
    api: 'API',
    url: 'URL'
  };

  protected validationFieldLabels: Record<string, string> = {
    'name': 'entity.task.label',
    'cartographyId': 'tasksMoreInfoAdvancedEntity.cartography',
    'advancedTaskKind': 'tasksMoreInfoAdvancedEntity.taskKind'
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
    protected cartographyService: CartographyService,
    protected taskUIService: TaskUIService,
    protected utils: UtilsService,
    protected roleService: RoleService,
    protected territoryService: TerritoryService,
    protected taskAvailabilityService: TaskAvailabilityService,
    protected connectionService: ConnectionService
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

    await this.initCodeLists(['tasksEntity.type', 'moreInfo.type', 'service.authenticationMode']);
    this.initTranslations('Task', ['name']);

    const [taskTypes, cartographies, connections, uiList, allMoreInfoTasks] = await Promise.all([
      firstValueFrom(this.taskTypeService.getAllEx()),
      firstValueFrom(this.cartographyService.getAll()),
      firstValueFrom(this.connectionService.getAll()),
      firstValueFrom(this.taskUIService.getAll()),
      firstValueFrom(this.taskService.getAllProjection(TaskProjection, {
        params: [{key: 'type.id', value: this.taskTypeId}]
      }))
    ]);

    this.taskType = taskTypes.find(taskType => taskType.id === this.taskTypeId);
    if (!this.taskType) {
      this.loggerService.error(`Task type ${this.taskTypeId} not found`);
    }

    this.taskTypeNameTranslated = this.translateService.instant('entity.task.moreInfoAdvanced.label');
    this.cartographies = cartographies;
    this.connections = connections;
    this.advancedUI = uiList.find(ui => ui.name === 'sitna.moreInfoAdvanced') || uiList.find(ui => ui.name === 'sitna.moreInfo') || null;

    this.allMoreInfoTasks = (allMoreInfoTasks || []).filter(task => task.id !== this.entityID);
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
    const properties = this.getAdvancedProperties(this.entityToEdit?.properties);
    const kind = this.normalizeKind(properties.advancedTaskKind);
    const scope = this.normalizeScope(properties.scope as string | null);

    this.entityForm = new FormGroup({
      name: new FormControl(this.entityToEdit.name, {
        validators: [Validators.required],
        nonNullable: true
      }),
      cartographyId: new FormControl(this.entityToEdit.cartographyId, {
        validators: [Validators.required],
        nonNullable: true
      }),
      advancedTaskKind: new FormControl(kind, {
        validators: [Validators.required],
        nonNullable: true
      }),
      scope: new FormControl(scope, {
        nonNullable: false
      }),
      connectionId: new FormControl(this.entityToEdit.connectionId, {
        nonNullable: false
      }),
      command: new FormControl(typeof properties.command === 'string' ? properties.command : null, {
        nonNullable: false
      }),
      responseFormat: new FormControl(typeof properties.responseFormat === 'string' ? properties.responseFormat : 'table', {
        nonNullable: true
      }),
      htmlTemplate: new FormControl(typeof properties.htmlTemplate === 'string' ? properties.htmlTemplate : '', {
        nonNullable: true
      }),
      parentLayout: new FormControl(typeof properties.parentLayout === 'string' ? properties.parentLayout : 'tabs', {
        nonNullable: true
      }),
      relatedTable: new FormControl(typeof properties.relatedTable === 'string' ? properties.relatedTable : '', {
        nonNullable: true
      }),
      childPresentationOrder: new FormControl(typeof properties.childPresentationOrder === 'string' ? properties.childPresentationOrder : 'manual', {
        nonNullable: true
      }),
      selectedChildTaskIds: new FormControl(this.getSelectedChildIdsForParent(), {
        nonNullable: true
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

    this.entityForm.get('advancedTaskKind')?.valueChanges.subscribe(() => this.updateDynamicValidations());
    this.updateDynamicValidations();
  }

  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const entityCreated = await firstValueFrom(this.taskService.create(entityToCreate));

    await firstValueFrom(entityCreated.updateRelationEx('type', this.taskType));

    if (this.advancedUI?.id) {
      await firstValueFrom(entityCreated.updateRelationEx('ui', this.taskUIService.createProxy(this.advancedUI.id)));
    }

    return entityCreated.id;
  }

  override async updateEntity(): Promise<void> {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.taskService.update(entityToUpdate));

    if (this.advancedUI?.id) {
      await firstValueFrom(this.entityToEdit.updateRelationEx('ui', this.taskUIService.createProxy(this.advancedUI.id)));
    }
  }

  override async updateDataRelated(_isDuplicated: boolean): Promise<void> {
    await this.saveTranslations(this.entityToEdit);

    const connectionId = this.entityForm.get('connectionId')?.value;
    if (typeof connectionId === 'number') {
      await firstValueFrom(this.entityToEdit.updateRelationEx('connection', this.connectionService.createProxy(connectionId)));
    } else {
      await firstValueFrom(this.entityToEdit.deleteAllRelation('connection'));
    }

    const cartographyId = this.entityForm.get('cartographyId')?.value;
    if (typeof cartographyId === 'number') {
      await firstValueFrom(this.entityToEdit.updateRelationEx('cartography', this.cartographyService.createProxy(cartographyId)));
    } else {
      await firstValueFrom(this.entityToEdit.deleteAllRelation('cartography'));
    }

    await this.syncParentChildAssociations();
  }

  createObject(id: number = null): Task {
    let safeToEdit = TaskProjection.fromObject(this.entityToEdit);
    const values = this.entityForm.getRawValue();
    const kind = this.normalizeKind(values.advancedTaskKind);

    const connectionId = this.shouldShowDataAccessFields() ? values.connectionId : null;
    const properties = TaskPropertiesBuilder.from(this.entityToEdit.properties)
      .withScope(this.shouldShowDataAccessFields() ? values.scope : null)
      .withCommand(this.shouldShowDataAccessFields() ? values.command : null)
      .withParameters(this.entityToEdit?.properties?.parameters as any[] || [])
      .withFields(this.entityToEdit?.properties?.fields as any[] || [])
      .build() as AdvancedTaskProperties;

    properties.advancedTaskKind = kind;
    properties.responseFormat = this.shouldShowDataAccessFields() ? values.responseFormat : null;
    properties.htmlTemplate = this.shouldShowDataAccessFields() ? values.htmlTemplate : null;
    properties.parentLayout = this.isParentTask() ? values.parentLayout : null;
    properties.relatedTable = this.isParentTask() ? values.relatedTable : null;
    properties.childPresentationOrder = this.isParentTask() ? values.childPresentationOrder : null;
    properties.parentTaskIds = this.isParentTask() ? [] : this.normalizeParentIds(properties.parentTaskIds);
    properties.moreInfoAdvanced = true;

    safeToEdit = Object.assign(safeToEdit, values, {
      id,
      connectionId,
      properties
    });

    return Task.fromObject(safeToEdit);
  }

  getCartographyName(cartographyId: number): string {
    return this.cartographies.find(cartography => cartography.id === cartographyId)?.name || '';
  }

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

  getConnectionName(connectionId: number): string {
    return this.connections.find(conn => conn.id === connectionId)?.name || '';
  }

  getTaskName(taskId: number): string {
    return this.allMoreInfoTasks.find(task => task.id === taskId)?.name || '';
  }

  getAvailableChildTasks(): TaskProjection[] {
    return this.allMoreInfoTasks.filter(task => {
      const kind = this.readKind(task);
      return kind === 'child' || kind === 'independent';
    });
  }

  isParentTask(): boolean {
    return this.entityForm?.get('advancedTaskKind')?.value === 'parent';
  }

  shouldShowDataAccessFields(): boolean {
    const kind = this.entityForm?.get('advancedTaskKind')?.value;
    return kind === 'child' || kind === 'independent';
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

  private updateDynamicValidations(): void {
    const scopeControl = this.entityForm.get('scope');
    const commandControl = this.entityForm.get('command');
    const connectionControl = this.entityForm.get('connectionId');
    const responseFormatControl = this.entityForm.get('responseFormat');

    if (this.shouldShowDataAccessFields()) {
      scopeControl?.setValidators([Validators.required]);
      commandControl?.setValidators([Validators.required]);
      responseFormatControl?.setValidators([Validators.required]);
      if (this.entityForm.get('scope')?.value === this.moreInfoScope.sql) {
        connectionControl?.setValidators([Validators.required]);
      } else {
        connectionControl?.clearValidators();
      }
    } else {
      scopeControl?.clearValidators();
      commandControl?.clearValidators();
      connectionControl?.clearValidators();
      responseFormatControl?.clearValidators();
    }

    scopeControl?.updateValueAndValidity({emitEvent: false});
    commandControl?.updateValueAndValidity({emitEvent: false});
    connectionControl?.updateValueAndValidity({emitEvent: false});
    responseFormatControl?.updateValueAndValidity({emitEvent: false});
  }

  private normalizeKind(kind: unknown): AdvancedTaskKind {
    return kind === 'parent' || kind === 'child' || kind === 'independent' ? kind : 'independent';
  }

  private normalizeScope(scope: string | null): string | null {
    if (!scope) {
      return this.moreInfoScope.sql;
    }
    if (scope === 'sql-query') {
      return this.moreInfoScope.sql;
    }
    if (scope === 'web-api-query') {
      return this.moreInfoScope.api;
    }
    if (scope === 'url-redirect') {
      return this.moreInfoScope.url;
    }
    return scope;
  }

  private normalizeParentIds(parentIds: unknown): number[] {
    if (!Array.isArray(parentIds)) {
      return [];
    }
    return parentIds
      .filter(id => typeof id === 'number')
      .filter((id, index, arr) => arr.indexOf(id) === index);
  }

  private getAdvancedProperties(raw: unknown): AdvancedTaskProperties {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return {};
    }
    return {...(raw as AdvancedTaskProperties)};
  }

  private readKind(task: TaskProjection): AdvancedTaskKind {
    const properties = this.getAdvancedProperties(task?.properties);
    return this.normalizeKind(properties.advancedTaskKind);
  }

  private isAdvancedTask(task: TaskProjection): boolean {
    const properties = this.getAdvancedProperties(task?.properties);
    return properties.moreInfoAdvanced === true;
  }

  private async syncParentChildAssociations(): Promise<void> {
    if (this.isNew()) {
      return;
    }

    if (!this.isParentTask()) {
      return;
    }

    const selectedChildIds = this.normalizeParentIds(this.entityForm.get('selectedChildTaskIds')?.value);
    const candidates = this.getAvailableChildTasks();

    for (const child of candidates) {
      if (!this.isAdvancedTask(child)) {
        continue;
      }
      const childEntity = await firstValueFrom(this.taskService.getProjection(TaskProjection, child.id));
      const childProps = this.getAdvancedProperties(childEntity.properties);
      const parentIds = this.normalizeParentIds(childProps.parentTaskIds);
      const shouldBeLinked = selectedChildIds.includes(child.id);

      const hasLink = parentIds.includes(this.entityID);
      if (shouldBeLinked && !hasLink) {
        childProps.parentTaskIds = [...parentIds, this.entityID];
      }
      if (!shouldBeLinked && hasLink) {
        childProps.parentTaskIds = parentIds.filter(id => id !== this.entityID);
      }

      if (shouldBeLinked !== hasLink) {
        childEntity.properties = childProps;
        await firstValueFrom(this.taskService.update(Task.fromObject(childEntity)));
      }
    }
  }

  private getSelectedChildIdsForParent(): number[] {
    if (this.isNewOrDuplicated() || this.entityID < 0) {
      return [];
    }

    return this.getAvailableChildTasks()
      .filter(child => {
        const childProps = this.getAdvancedProperties(child.properties);
        const parentIds = this.normalizeParentIds(childProps.parentTaskIds);
        return parentIds.includes(this.entityID);
      })
      .map(child => child.id);
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
      const matchingCartography = this.cartographies.find(
        c => c.name?.toLowerCase() === value.trim().toLowerCase()
      );
      if (matchingCartography) {
        setTimeout(() => {
          if (this.entityForm) {
            this.entityForm.get('cartographyId')?.setValue(matchingCartography.id, {emitEvent: false});
            this.entityForm.markAsDirty();
          }
        });
        return null;
      }
      return {invalidCartography: true};
    }

    return null;
  }

  private filterCartographies(value?: string): Cartography[] {
    const filterValue = (value || '').toLowerCase();
    return this.cartographies.filter(cartography => (cartography.name || '').toLowerCase().includes(filterValue));
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

  private defineParametersTable(): DataTableDefinition<TaskMoreInfoParameter, TaskMoreInfoParameter> {
    return DataTableDefinition.builder<TaskMoreInfoParameter, TaskMoreInfoParameter>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getEditableColumnDef('entity.task.parameters.variable', 'label'),
        this.utils.getEditableColumnDef('entity.task.parameters.field', 'value', 300, 500),
        this.utils.getEditableColumnDef('common.form.description', 'description', 250, 500),
        this.utils.getBooleanColumnDef('entity.task.parameters.provided', 'provided', true),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('label')
      .withRelationsFetcher(() => {
        const raw = this.entityToEdit?.properties?.parameters;
        if (Array.isArray(raw)) {
          return of(raw.map((parameter: any) => TaskMoreInfoParameter.fromObject(parameter)));
        }
        return of<TaskMoreInfoParameter[]>([]);
      })
      .withRelationsUpdater(async (parameters: (TaskMoreInfoParameter & Status)[]) => {
        const parametersToSave = parameters
          .filter(canKeepOrUpdate)
          .map(value => {
            const p = TaskMoreInfoParameter.fromObject(value);
            if (p.provided) {
              p.value = '';
            }
            return p;
          });

        this.entityToEdit.properties = TaskPropertiesBuilder.from(this.entityToEdit.properties)
          .withParameters(parametersToSave)
          .build();

        await firstValueFrom(this.taskService.update(this.entityToEdit));
      })
      .withTargetToRelation((items: TaskMoreInfoParameter[]) => items.map(item => TaskMoreInfoParameter.fromObject(item)))
      .withRelationsDuplicate(item => TaskMoreInfoParameter.fromObject(item))
      .build();
  }
}

class CartographyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, _form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
