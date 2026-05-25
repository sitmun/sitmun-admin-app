import {Component, OnInit} from "@angular/core";
import {FormArray, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {ErrorStateMatcher} from "@angular/material/core";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";

import {TranslateService} from "@ngx-translate/core";
import {firstValueFrom, map, of, startWith} from "rxjs";

import {BaseFormComponent} from "@app/components/base-form.component";
import {DataTableDefinition} from "@app/components/data-tables.util";
import {Configuration} from "@app/core/config/configuration";
import {MessagesInterceptorStateService} from "@app/core/interceptors/messages.interceptor";
import {
  CodeListService,
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
  TaskRelation,
  TaskRelationService,
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
  selector: 'app-task-locator-form',
  templateUrl: './task-locator-form.component.html',
  styleUrl: './task-locator-form.component.scss',
  standalone: false
})
export class TaskLocatorFormComponent extends BaseFormComponent<TaskProjection> implements OnInit {
  readonly config = Configuration.TASK_LOCATOR;
  private readonly queryTaskRelationType = 'query-task';

  /** Available territory field tokens for the municipality filter dropdown. */
  readonly territoryFieldOptions: {value: string; labelKey: string}[] = [
    { value: 'territory_code',              labelKey: 'entity.task.locator.parameters.municipalityCodeFilters.territoryField.option.territory_code' },
    { value: 'territory_idescat_code',      labelKey: 'entity.task.locator.parameters.municipalityCodeFilters.territoryField.option.territory_idescat_code' },
    { value: 'territory_name',              labelKey: 'entity.task.locator.parameters.municipalityCodeFilters.territoryField.option.territory_name' },
    { value: 'territory_description',       labelKey: 'entity.task.locator.parameters.municipalityCodeFilters.territoryField.option.territory_description' },
    { value: 'territory_authority_name',    labelKey: 'entity.task.locator.parameters.municipalityCodeFilters.territoryField.option.territory_authority_name' },
    { value: 'territory_authority_address', labelKey: 'entity.task.locator.parameters.municipalityCodeFilters.territoryField.option.territory_authority_address' },
    { value: 'territory_type_name',         labelKey: 'entity.task.locator.parameters.municipalityCodeFilters.territoryField.option.territory_type_name' },
    { value: 'territory_center_x',          labelKey: 'entity.task.locator.parameters.municipalityCodeFilters.territoryField.option.territory_center_x' },
    { value: 'territory_center_y',          labelKey: 'entity.task.locator.parameters.municipalityCodeFilters.territoryField.option.territory_center_y' },
  ];

  public override entityForm: FormGroup;

  protected readonly rolesTable: DataTableDefinition<Role, Role>;
  protected readonly availabilitiesTable: DataTableDefinition<TaskAvailabilityProjection, TerritoryProjection>;

  private taskTypeName: string = null;
  protected taskTypeNameTranslated: string = null;
  private taskType: TaskType = null;

  protected taskGroupList: TaskGroup[] = [];
  protected queryTasks: TaskProjection[] = [];
  protected locatorUI: TaskUI = null;
  private selectedQueryTaskId: number | null = null;
  private selectedQueryTaskRelation: TaskRelation | null = null;

  protected queryTaskSearchControl = new FormControl<string | TaskProjection>('', {
    validators: [Validators.required, this.queryTaskValidator.bind(this)],
    nonNullable: true
  });
  protected filteredQueryTasks = of<TaskProjection[]>([]);
  protected queryTaskErrorMatcher = new QueryTaskErrorStateMatcher();

  protected validationFieldLabels: Record<string, string> = {
    'name': 'entity.task.locator.name',
    'taskGroupId': 'entity.taskGroup.label',
    'queryTaskId': 'entity.task.locator.queryTask'
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
    protected taskRelationService: TaskRelationService,
    protected taskTypeService: TaskTypeService,
    protected taskGroupService: TaskGroupService,
    protected taskUIService: TaskUIService,
    protected utils: UtilsService,
    protected roleService: RoleService,
    protected territoryService: TerritoryService,
    protected taskAvailabilityService: TaskAvailabilityService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router, loadingService, messagesInterceptorState);
    this.rolesTable = this.defineRolesTable();
    this.availabilitiesTable = this.defineAvailabilitiesTable();
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override async preFetchData() {
    const type = magic.taskLocatorTypeId;
    const queryTaskOptions = {
      params: [{key: 'type.id', value: magic.taskQueryTypeId}]
    };

    this.dataTables.register(this.rolesTable)
      .register(this.availabilitiesTable);

    await this.initCodeLists(['tasksEntity.type'])
    this.initTranslations('Task', ['name'])

    const [taskTypes, taskGroups, queryTasks, uiList] = await Promise.all([
      firstValueFrom(this.taskTypeService.fetchAllRawItems()),
      firstValueFrom(this.taskGroupService.fetchAllRawItems()),
      firstValueFrom(this.taskService.fetchAllProjectionItems(TaskProjection, queryTaskOptions, undefined, 'tasks')),
      firstValueFrom(this.taskUIService.fetchAllRawItems())
    ]);

    this.taskType = taskTypes.find(taskType => taskType.id === type);
    if (!this.taskType) {
      this.loggerService.error(`Task type ${type} not found`);
    }
    this.taskTypeName = this.taskType?.name;
    this.taskTypeNameTranslated = this.translateService.instant(`entity.task.locator.label`);

    this.taskGroupList = taskGroups;
    this.queryTasks = queryTasks
      .filter(task => task.typeId === magic.taskQueryTypeId)
      .sort((left, right) => (left.name || '').localeCompare(right.name || ''));

    this.locatorUI = uiList.find(ui => ui.name === 'sitmun.locator') ?? null;
    if (!this.locatorUI) {
      this.loggerService.warn('UI control "sitmun.locator" not found in database');
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
      queryTaskId: new FormControl(this.selectedQueryTaskId, {
        validators: [Validators.required]
      }),
      // Geocoder configuration fields (saved as task parameters)
      geocoderLabelField:     new FormControl(this.getGeocoderParam('labelField'),     {nonNullable: true}),
      geocoderResultsPath:    new FormControl(this.getGeocoderParam('resultsPath'),    {nonNullable: true}),
      geocoderGeometryField:  new FormControl(this.getGeocoderParam('geometryField'),  {nonNullable: true}),
      geocoderSrs:            new FormControl(this.getGeocoderParam('srs'),            {nonNullable: true}),
      geocoderLatField:       new FormControl(this.getGeocoderParam('latField'),       {nonNullable: true}),
      geocoderLonField:       new FormControl(this.getGeocoderParam('lonField'),       {nonNullable: true}),
      geocoderFilterByExtent: new FormControl(this.getGeocoderParam('filterByExtent') === 'true', {nonNullable: true}),
      geocoderFilterByTerritoryCode: new FormControl(this.getGeocoderParam('filterByTerritoryCode') === 'true', {nonNullable: true}),
      geocoderTerritoryCodeResponseField: new FormControl(this.getGeocoderParam('territoryCodeResponseField') ?? '', {nonNullable: true}),
      geocoderFilterByMunicipalityCode: new FormControl(this.getGeocoderParam('filterByMunicipalityCode') === 'true', {nonNullable: true}),
      geocoderMunicipalityCodeFilters: new FormArray(
        this.parseGeocoderMunicipalityCodeFilters().map(f => new FormGroup({
          requestParam: new FormControl(f.requestParam, {nonNullable: true}),
          territoryField: new FormControl(f.territoryField, {nonNullable: true}),
          responseField: new FormControl(f.responseField, {nonNullable: true}),
          convertProjection: new FormControl(f.convertProjection, {nonNullable: true}),
          targetCrs: new FormControl(f.targetCrs, {nonNullable: true})
        }))
      ),
    });

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

  /** Returns the stored value of a geocoder parameter, or empty string if not set. */
  private getGeocoderParam(name: string): string {
    const params: any[] = (this.entityToEdit?.properties as any)?.parameters ?? [];
    const found = params.find(p => (p.variable ?? p.name) === name);
    return found?.value ?? '';
  }

  /** Parses the stored municipalityCodeFilters JSON parameter. */
  private parseGeocoderMunicipalityCodeFilters(): {requestParam: string; territoryField: string; responseField: string; convertProjection: boolean; targetCrs: string}[] {
    try {
      const raw = this.getGeocoderParam('municipalityCodeFilters');
      if (raw) {
        const parsed = JSON.parse(raw) as {requestParam?: string; territoryField?: string; requestValue?: string; responseField?: string; convertProjection?: boolean; convertToWgs84?: boolean; targetCrs?: string}[];
        // Normalise legacy data: requestValue → territoryField, convertToWgs84 → convertProjection
        return parsed.map(f => ({
          requestParam: f.requestParam ?? '',
          territoryField: f.territoryField ?? f.requestValue ?? 'territory_code',
          responseField: f.responseField ?? '',
          convertProjection: f.convertProjection ?? f.convertToWgs84 ?? false,
          targetCrs: f.targetCrs ?? (f.convertToWgs84 ? 'EPSG:4326' : '')
        }));
      }
    } catch {}
    return [];
  }

  get municipalityCodeFiltersArray(): FormArray {
    return this.entityForm.get('geocoderMunicipalityCodeFilters') as FormArray;
  }

  addMunicipalityCodeFilter(): void {
    this.municipalityCodeFiltersArray.push(new FormGroup({
      requestParam: new FormControl('', {nonNullable: true}),
      territoryField: new FormControl('territory_code', {nonNullable: true}),
      responseField: new FormControl('', {nonNullable: true}),
      convertProjection: new FormControl(false, {nonNullable: true}),
      targetCrs: new FormControl('', {nonNullable: true})
    }));
  }

  removeMunicipalityCodeFilter(index: number): void {
    this.municipalityCodeFiltersArray.removeAt(index);
  }

  /** Converts geocoder form values to the {variable, value}[] format stored in task properties. */
  private buildGeocoderParams(formValues: any): {variable: string; value: string}[] {
    const params: {variable: string; value: string}[] = [];
    const add = (variable: string, value: string) => {
      if (value !== null && value !== undefined && value !== '') {
        params.push({variable, value});
      }
    };
    add('labelField',    formValues.geocoderLabelField);
    add('resultsPath',   formValues.geocoderResultsPath);
    add('geometryField', formValues.geocoderGeometryField);
    add('srs',           formValues.geocoderSrs);
    add('latField',      formValues.geocoderLatField);
    add('lonField',      formValues.geocoderLonField);
    if (formValues.geocoderFilterByExtent) {
      params.push({variable: 'filterByExtent', value: 'true'});
    }
    if (formValues.geocoderFilterByTerritoryCode) {
      params.push({variable: 'filterByTerritoryCode', value: 'true'});
    }
    add('territoryCodeResponseField', formValues.geocoderTerritoryCodeResponseField);
    if (formValues.geocoderFilterByMunicipalityCode) {
      params.push({variable: 'filterByMunicipalityCode', value: 'true'});
    }
    const filters = (formValues.geocoderMunicipalityCodeFilters as {requestParam: string; territoryField: string; responseField: string; convertProjection: boolean; targetCrs: string}[])
      .filter(f => f.requestParam || f.responseField);
    if (filters.length > 0) {
      add('municipalityCodeFilters', JSON.stringify(filters));
    }
    return params;
  }

  createObject(id: number = null): Task {
    let safeToEdit = TaskProjection.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();
    const existingProps: any = this.entityToEdit.properties || {};
    const properties: any = TaskPropertiesBuilder.from(existingProps)
      .withFields(existingProps.fields || [])
      .withParameters(this.buildGeocoderParams(formValues))
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
    await firstValueFrom(entityCreated.updateRelationEx("type", this.taskType));
    const proxyGroup = this.taskGroupService.createProxy(this.entityForm.get('taskGroupId')?.value);
    await firstValueFrom(entityCreated.updateRelationEx("group", proxyGroup));

    if (this.locatorUI?.id) {
      await firstValueFrom(entityCreated.updateRelationEx("ui", this.taskUIService.createProxy(this.locatorUI.id)));
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

    if (this.locatorUI?.id) {
      await firstValueFrom(this.entityToEdit.updateRelationEx("ui", this.taskUIService.createProxy(this.locatorUI.id)));
    }
  }

  override async updateDataRelated(_isDuplicated: boolean) {
    await this.saveTranslations(this.entityToEdit);

    if (this.locatorUI?.id) {
      await firstValueFrom(this.entityToEdit.updateRelationEx("ui", this.taskUIService.createProxy(this.locatorUI.id)));
    }

    await this.syncQueryTaskRelation();
  }

  getTaskGroupName(taskGroupId: number): string {
    return this.taskGroupList.find(group => group.id === taskGroupId)?.name || '';
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
}

class QueryTaskErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, _form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
