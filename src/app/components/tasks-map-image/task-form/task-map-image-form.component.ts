import { Component, TemplateRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { catchError, combineLatest, firstValueFrom, map, Observable, of, startWith, Subject } from 'rxjs';

import { BaseFormComponent } from '@app/components/base-form.component';
import { DataTableDefinition, TemplateDialog } from '@app/components/data-tables.util';
import { Configuration } from '@app/core/config/configuration';
import { MessagesInterceptorStateService } from '@app/core/interceptors/messages.interceptor';
import {
  CartographyService,
  CodeListService,
  Role,
  RoleService,
  Service,
  ServiceService,
  Task,
  TaskAvailabilityProjection,
  TaskAvailabilityService,
  TaskGroup,
  TaskGroupService,
  TaskProjection,
  TaskPropertiesContract,
  TaskService,
  TaskType,
  TaskTypeService,
  TerritoryProjection,
  TerritoryService,
  TranslationService,
} from '@app/domain';
import { TaskParameterType, TaskQueryParameter } from '@app/domain/task/models/task-query-parameter.model';
import { canKeepOrUpdate, Status } from '@app/frontend-gui/src/lib/data-grid/data-grid.component';
import { ErrorHandlerService } from '@app/services/error-handler.service';
import { LoadingOverlayService } from '@app/services/loading-overlay.service';
import { LoggerService } from '@app/services/logger.service';
import { UtilsService } from '@app/services/utils.service';
import { magic } from '@environments/constants';

import { MapImageLayerCatalogService, MapImageLayerOption } from './map-image-layer-catalog.service';
import { MapImageSourcesAdapter, MapImageSource } from './map-image-sources.adapter';
import { createTaskAvailabilitiesTable, createTaskRolesTable, updateTaskGroupRelation } from '../../tasks-shared/task-relation-tables';

type MapImageSourceProperties = MapImageSource;

interface MapImageSelectedLayerRow {
  serviceId: number | null;
  serviceName: string;
  layerId: string;
  layerIdLabel: string;
  layerName: string;
  missing: boolean;
}

interface MapImageSelectedLayerGridRow extends MapImageSelectedLayerRow, Status {}

@Component({
  selector: 'app-task-map-image-form',
  templateUrl: './task-map-image-form.component.html',
  styles: [
    '.map-source-filters { display: grid; grid-template-columns: minmax(220px, 300px) minmax(260px, 1fr) auto; gap: 12px; align-items: start; margin-bottom: 16px; }',
    '.map-source-section { margin-top: 16px; }',
    '.map-source-empty { margin: 12px 0; opacity: 0.8; }',
    '.map-source-title { margin: 0 0 12px; font: inherit; font-weight: 600; }',
    '.map-source-filter-action { display: flex; align-items: center; min-height: 56px; }',
    ':host ::ng-deep app-data-grid.selected-layers-grid mat-toolbar #deleteChangesButton { margin-left: auto; }',
    '.row-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }',
    '.row-fields > mat-form-field { width: 100%; min-width: 0; }',
    '.half { width: 100%; }',
    '.full { width: 100%; }',
    '@media (max-width: 959px) { .map-source-filters { grid-template-columns: 1fr; } .map-source-filter-action { min-height: auto; } .row-fields { grid-template-columns: 1fr; gap: 0; } }'
  ],
  standalone: false,
})
export class TaskMapImageFormComponent extends BaseFormComponent<TaskProjection> {
  private readonly mapSourcesAdapter = new MapImageSourcesAdapter();
  readonly config = Configuration.TASK_MAP_IMAGE;
  private static readonly FEATURE_BBOX_PARAMETER_NAMES = [
    'featureBboxMinX',
    'featureBboxMinY',
    'featureBboxMaxX',
    'featureBboxMaxY',
    '__featureBboxSize',
  ];
  private static readonly DEFAULT_FORMAT = 'png';
  private static readonly DEFAULT_SRS = '';
  private static readonly DEFAULT_WIDTH = 1024;
  private static readonly DEFAULT_HEIGHT = 768;
  private static readonly DEFAULT_BBOX_MARGIN_PERCENT = 0;

  public override entityForm: FormGroup;

  protected readonly imageFormats = ['png'];
  protected readonly rolesTable: DataTableDefinition<Role, Role>;
  protected readonly availabilitiesTable: DataTableDefinition<TaskAvailabilityProjection, TerritoryProjection>;
  protected readonly selectedLayersColumnDefs: any[];
  protected readonly parametersTable: DataTableDefinition<TaskQueryParameter, TaskQueryParameter>;
  protected readonly layerSearchControl = new FormControl<string | MapImageLayerOption>('', { nonNullable: true });
  protected filteredLayerOptions$: Observable<MapImageLayerOption[]> = of([]);

  protected taskGroupList: TaskGroup[] = [];
  protected services: Service[] = [];
  protected availableLayerOptions: MapImageLayerOption[] = [];
  protected selectedLayerRows: MapImageSelectedLayerRow[] = [];
  protected selectedServiceFilter: number | null = null;
  protected loadingSelectedServiceLayers = false;

  private readonly layerOptionsByServiceId = new Map<number, MapImageLayerOption[]>();
  private readonly loadingLayerServiceIds = new Set<number>();
  protected readonly selectedLayersRefresh$ = new Subject<boolean>();
  private readonly layerOptionsRefresh$ = new Subject<void>();

  @ViewChild('newParameterDialog', { static: true })
  private readonly newParameterDialog: TemplateRef<unknown>;

  protected validationFieldLabels: Record<string, string> = {
    name: 'common.form.name',
    taskGroupId: 'entity.taskGroup.label',
    format: 'entity.task.mapImage.format',
    width: 'entity.task.mapImage.width',
    height: 'entity.task.mapImage.height',
    srs: 'entity.task.mapImage.srs',
    bboxMarginPercent: 'entity.task.mapImage.bboxMarginPercent',
  };

  private taskType: TaskType = null;

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
    protected roleService: RoleService,
    protected territoryService: TerritoryService,
    protected taskAvailabilityService: TaskAvailabilityService,
    protected cartographyService: CartographyService,
    protected serviceService: ServiceService,
    private readonly layerCatalog: MapImageLayerCatalogService,
    protected utils: UtilsService,
  ) {
    super(
      dialog,
      translateService,
      translationService,
      codeListService,
      loggerService,
      errorHandler,
      activatedRoute,
      router,
      loadingService,
      messagesInterceptorState,
    );

    this.rolesTable = this.defineRolesTable();
    this.availabilitiesTable = this.defineAvailabilitiesTable();
    this.selectedLayersColumnDefs = this.defineSelectedLayersColumnDefs();
    this.parametersTable = this.defineParametersTable();
  }

  override async preFetchData(): Promise<void> {
    this.dataTables.register(this.rolesTable).register(this.availabilitiesTable).register(this.parametersTable);
    await this.initCodeLists(['queryTask.parameterType']);
    this.initTranslations('Task', ['name']);

    const [taskTypes, taskGroups, services] = await Promise.all([
      firstValueFrom(this.taskTypeService.fetchAllItems()),
      firstValueFrom(this.taskGroupService.fetchAllItems()),
      firstValueFrom(this.serviceService.fetchWmsItems()),
    ]);

    this.taskType = taskTypes.find((taskType) => taskType.id === magic.taskMapImageTypeId) ?? null;
    if (!this.taskType) {
      this.loggerService.warn(`Map image task type ${magic.taskMapImageTypeId} not found yet in backend catalog`);
    }

    this.taskGroupList = taskGroups;
    this.services = [...services].sort((left, right) => String(left.name || '').localeCompare(String(right.name || '')));
  }

  override async fetchRelatedData(): Promise<void> {
    return this.loadTranslations(this.entityToEdit);
  }

  override fetchOriginal(): Promise<TaskProjection> {
    return firstValueFrom(this.taskService.fetchProjectionById(TaskProjection, this.entityID));
  }

  override fetchCopy(): Promise<TaskProjection> {
    return firstValueFrom(
      this.taskService.fetchProjectionById(TaskProjection, this.duplicateID).pipe(
        map((copy: TaskProjection) => {
          copy.name = this.translateService.instant('copy_') + copy.name;
          return copy;
        }),
      ),
    );
  }

  override empty(): TaskProjection {
    return new TaskProjection();
  }

  override postFetchData(): void {
    if (this.isNew()) {
      this.entityToEdit.properties = TaskPropertiesContract.withParameters(
        this.entityToEdit.properties,
        TaskMapImageFormComponent.FEATURE_BBOX_PARAMETER_NAMES.map((name) => ({
          name,
          label: name,
          type: TaskParameterType.TEMPLATE,
          value: name,
        })),
      );
    }
    const properties = TaskPropertiesContract.fromRaw(this.entityToEdit?.properties);
    this.entityForm = new FormGroup({
      name: new FormControl(this.entityToEdit?.name ?? '', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      taskGroupId: new FormControl(this.entityToEdit?.groupId ?? null, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      format: new FormControl(TaskPropertiesContract.getFormat(properties) ?? TaskMapImageFormComponent.DEFAULT_FORMAT, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      width: new FormControl(TaskPropertiesContract.getWidth(properties) ?? TaskMapImageFormComponent.DEFAULT_WIDTH, {
        validators: [Validators.required, Validators.min(1)],
        nonNullable: true,
      }),
      height: new FormControl(TaskPropertiesContract.getHeight(properties) ?? TaskMapImageFormComponent.DEFAULT_HEIGHT, {
        validators: [Validators.required, Validators.min(1)],
        nonNullable: true,
      }),
      srs: new FormControl(TaskPropertiesContract.getSrs(properties) ?? TaskMapImageFormComponent.DEFAULT_SRS, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      bboxMarginPercent: new FormControl(
        TaskPropertiesContract.getBboxMarginPercent(properties) ?? TaskMapImageFormComponent.DEFAULT_BBOX_MARGIN_PERCENT,
        {
          validators: [Validators.required, Validators.min(0)],
          nonNullable: true,
        },
      ),
      mapSources: new FormArray(TaskPropertiesContract.getMapSources(properties).map((source) => this.createMapSourceGroup(source))),
    });
    this.filteredLayerOptions$ = combineLatest([
      this.layerSearchControl.valueChanges.pipe(startWith(this.layerSearchControl.value)),
      this.layerOptionsRefresh$.pipe(startWith(undefined)),
    ]).pipe(
      map(([value]) => {
        const searchValue = typeof value === 'string' ? value : value?.layerName || '';
        return this.filterLayerOptions(searchValue);
      }),
    );
    this.layerSearchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const searchValue = typeof value === 'string' ? value : value?.layerName || '';
        void this.ensureLayerOptionsForSearch(searchValue);
      });
    this.syncSelectedLayerRows();
    void this.ensureLayerOptionsForSelectedRows();
  }

  get mapSourcesArray(): FormArray {
    return this.entityForm.get('mapSources') as FormArray;
  }

  protected get layerSearchText(): string {
    return this.getLayerSearchText();
  }

  protected get hasActiveLayerSearch(): boolean {
    return this.selectedServiceFilter != null || this.normalizeSearchValue(this.getLayerSearchText()).length > 0;
  }

  protected get filteredLayerOptions(): MapImageLayerOption[] {
    return this.filterLayerOptions(this.getLayerSearchText());
  }

  private buildSelectedLayerRows(): MapImageSelectedLayerRow[] {
    const rows: MapImageSelectedLayerRow[] = [];

    this.readMapSourcesFromForm().forEach((source) => {
      source.layerNames.forEach((layerId) => {
          const option = this.layerCatalog.find(this.availableLayerOptions, source.serviceId, layerId);
          rows.push({
            serviceId: source.serviceId,
            serviceName: option?.serviceName ?? this.getServiceName(source.serviceId),
            layerId,
            layerIdLabel: layerId,
            layerName: option?.layerName ?? layerId,
            missing: !option,
          });
        });
    });

    return rows;
  }

  protected onServiceFilterChange(value: number | null): void {
    this.selectedServiceFilter = typeof value === 'number' ? value : null;
    if (this.selectedServiceFilter != null) {
      void this.ensureLayerOptionsForService(this.selectedServiceFilter);
    } else {
      this.loadingSelectedServiceLayers = false;
    }
  }

  protected onLayerSearchTextChange(value: string): void {
    this.layerSearchControl.setValue(value);
  }

  protected clearLayerFilters(): void {
    this.layerSearchControl.setValue('');
    this.selectedServiceFilter = null;
    this.loadingSelectedServiceLayers = false;
  }

  protected onLayerOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const option = event.option.value as MapImageLayerOption;
    if (!option) {
      return;
    }
    const currentSearchText = this.getLayerSearchText();
    this.addLayer(option);
    this.layerSearchControl.setValue(currentSearchText);
  }

  protected displayLayerOption(option: MapImageLayerOption | string): string {
    if (typeof option === 'string') {
      return option;
    }
    return option?.layerName || '';
  }

  protected addLayer(option: MapImageLayerOption): void {
    this.replaceMapSources(this.mapSourcesAdapter.add(this.readMapSourcesFromForm(), option));
  }

  protected removeLayer(index: number): void {
    const row = this.selectedLayerRows[index];
    if (!row) {
      return;
    }

    const serviceId = row.serviceId;
    const layerId = row.layerId;
    if (serviceId == null) {
      return;
    }

    this.replaceMapSources(this.mapSourcesAdapter.remove(this.readMapSourcesFromForm(), { serviceId, layerId }));
  }

  protected removeSelectedLayerRows(rows: MapImageSelectedLayerGridRow[]): void {
    if (!Array.isArray(rows) || rows.length === 0) {
      return;
    }

    this.replaceMapSources(this.mapSourcesAdapter.removeRows(this.readMapSourcesFromForm(), rows));
  }

  protected onSelectedLayerOrderChanged(rows: MapImageSelectedLayerGridRow[]): void {
    if (!Array.isArray(rows) || rows.length === 0) {
      return;
    }

    this.replaceMapSources(this.mapSourcesAdapter.reorder(rows));
  }

  protected isLayerOptionSelected(option: MapImageLayerOption): boolean {
    const selectedIds = new Set(
      this.readMapSourcesFromForm()
        .filter((item) => item.serviceId === option.serviceId)
        .flatMap((source) => source.layerNames),
    );
    return option.layerIds.every((layerId) => selectedIds.has(layerId));
  }

  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const entityCreated = await firstValueFrom(this.taskService.create(entityToCreate));

    if (this.taskType) {
      await firstValueFrom(entityCreated.updateRelationEx('type', this.taskType));
    }

    const groupId = this.entityForm.get('taskGroupId')?.value;
    if (typeof groupId === 'number') {
      await updateTaskGroupRelation(entityCreated, groupId, this.taskGroupService);
    }

    return entityCreated.id;
  }

  override async updateEntity(): Promise<void> {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.taskService.update(entityToUpdate));

    const groupId = this.entityForm.get('taskGroupId')?.value;
    if (typeof groupId === 'number') {
      await updateTaskGroupRelation(this.entityToEdit, groupId, this.taskGroupService);
    }
  }

  override async updateDataRelated(_isDuplicated: boolean): Promise<void> {
    await this.saveTranslations(this.entityToEdit);
  }

  createObject(id: number = null): Task {
    let safeToEdit = TaskProjection.fromObject(this.entityToEdit);
    const values = this.entityForm.getRawValue();
    let properties = TaskPropertiesContract.fromRaw(this.entityToEdit?.properties);
    properties = TaskPropertiesContract.withFormat(properties, values.format ?? TaskMapImageFormComponent.DEFAULT_FORMAT);
    properties = TaskPropertiesContract.withWidth(properties, values.width ?? TaskMapImageFormComponent.DEFAULT_WIDTH);
    properties = TaskPropertiesContract.withHeight(properties, values.height ?? TaskMapImageFormComponent.DEFAULT_HEIGHT);
    properties = TaskPropertiesContract.withSrs(properties, values.srs ?? TaskMapImageFormComponent.DEFAULT_SRS);
    properties = TaskPropertiesContract.withBboxMarginPercent(
      properties,
      typeof values.bboxMarginPercent === 'number' && Number.isFinite(values.bboxMarginPercent)
        ? values.bboxMarginPercent
        : TaskMapImageFormComponent.DEFAULT_BBOX_MARGIN_PERCENT,
    );
    properties = TaskPropertiesContract.withMapSources(properties, this.buildMapSourcesPayload());

    safeToEdit = Object.assign(safeToEdit, {
      id,
      name: values.name,
      properties,
    });

    return Task.fromObject(safeToEdit);
  }

  private createMapSourceGroup(source?: Record<string, unknown>): FormGroup {
    const serviceId = typeof source?.['serviceId'] === 'number' ? source['serviceId'] as number : null;
    const layerNames = this.normalizeLayerNames(source?.['layerNames']);
    return new FormGroup({
      serviceId: new FormControl(serviceId, { validators: [Validators.required] }),
      layerNames: new FormControl(layerNames, { validators: [Validators.required], nonNullable: true }),
    });
  }

  private buildMapSourcesPayload(): MapImageSourceProperties[] {
    return this.mapSourcesAdapter.payload(this.readMapSourcesFromForm());
  }

  private async ensureLayerOptionsForSelectedRows(): Promise<void> {
    const serviceIds = Array.from(new Set(this.readMapSourcesFromForm().map((source) => source.serviceId)));
    await Promise.all(serviceIds.map((serviceId) => this.ensureLayerOptionsForService(serviceId, false)));
    this.syncSelectedLayerRows();
  }

  private async ensureLayerOptionsForSearch(searchValue: string): Promise<void> {
    const normalizedSearch = this.normalizeSearchValue(searchValue);
    if (this.selectedServiceFilter != null) {
      await this.ensureLayerOptionsForService(this.selectedServiceFilter);
      return;
    }
    if (!normalizedSearch) {
      return;
    }
    await Promise.all(this.services.map((service) => this.ensureLayerOptionsForService(service.id, false)));
  }

  private async ensureLayerOptionsForService(serviceId: number, trackLoading: boolean = true): Promise<void> {
    if (this.layerOptionsByServiceId.has(serviceId) || this.loadingLayerServiceIds.has(serviceId)) {
      this.refreshAvailableLayerOptions();
      return;
    }

    const service = this.services.find((item) => item.id === serviceId);
    if (!service) {
      return;
    }

    if (trackLoading && this.selectedServiceFilter === serviceId) {
      this.loadingSelectedServiceLayers = true;
    }
    this.loadingLayerServiceIds.add(serviceId);

    try {
      const cartographies = await firstValueFrom(
        this.cartographyService.fetchProjectionItemsByService(service.id).pipe(catchError(() => of([]))),
      );
      const options = cartographies
        .map((cartography) => this.layerCatalog.toOption(cartography, service))
        .filter((option): option is MapImageLayerOption => option !== null);
      this.layerOptionsByServiceId.set(serviceId, this.layerCatalog.sort(options));
      this.refreshAvailableLayerOptions();
      this.syncSelectedLayerRows();
    } finally {
      this.loadingLayerServiceIds.delete(serviceId);
      if (trackLoading) {
        this.loadingSelectedServiceLayers = false;
      }
    }
  }

  private refreshAvailableLayerOptions(): void {
    this.availableLayerOptions = this.layerCatalog.sortByService(Array.from(this.layerOptionsByServiceId.values()).flat());
    this.layerOptionsRefresh$.next();
  }

  private filterLayerOptions(searchValue: string): MapImageLayerOption[] {
    const normalizedSearch = this.normalizeSearchValue(searchValue);
    if (!this.selectedServiceFilter && !normalizedSearch) {
      return [];
    }

    return this.availableLayerOptions.filter((option) => {
      if (this.isLayerOptionSelected(option)) {
        return false;
      }
      if (this.selectedServiceFilter != null && option.serviceId !== this.selectedServiceFilter) {
        return false;
      }
      if (!normalizedSearch) {
        return true;
      }
      return this.normalizeSearchValue(option.layerIdLabel).includes(normalizedSearch)
        || this.normalizeSearchValue(option.layerName).includes(normalizedSearch)
        || this.normalizeSearchValue(option.serviceName).includes(normalizedSearch);
    });
  }

  private readMapSourcesFromForm(): MapImageSourceProperties[] {
    return this.mapSourcesArray.controls
      .map((control) => ({ serviceId: control.get('serviceId')?.value, layerNames: control.get('layerNames')?.value }))
      .map((source) => this.mapSourcesAdapter.normalize([source])[0])
      .filter((source): source is MapImageSourceProperties => source !== undefined);
  }

  private replaceMapSources(sources: MapImageSourceProperties[]): void {
    this.mapSourcesArray.clear();
    sources.forEach((source) => this.mapSourcesArray.push(this.createMapSourceGroup(source)));
    this.syncSelectedLayerRows();
    this.selectedLayersRefresh$.next(true);
    this.layerOptionsRefresh$.next();
    this.mapSourcesArray.markAsDirty();
    this.entityForm.markAsDirty();
    this.mapSourcesArray.updateValueAndValidity({ emitEvent: true });
    this.entityForm.updateValueAndValidity({ emitEvent: true });
  }

  private syncSelectedLayerRows(): void {
    this.selectedLayerRows = this.buildSelectedLayerRows();
  }

  private normalizeLayerNames(rawLayerNames: unknown): string[] {
    return this.layerCatalog.normalizeLayerNames(rawLayerNames);
  }

  private defineParametersTable(): DataTableDefinition<TaskQueryParameter, TaskQueryParameter> {
    return DataTableDefinition.builder<TaskQueryParameter, TaskQueryParameter>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getEditableColumnDef('common.form.name', 'name'),
        this.utils.getEditableColumnDef('common.form.label', 'label'),
        this.utils.getEditableColumnDef('common.form.value', 'value'),
        this.utils.getNonEditableColumnWithCodeListDef('common.form.type', 'type', () => this.codeList('queryTask.parameterType')),
        this.utils.addConditionToColumnDef(
          this.utils.getBooleanColumnDef('common.form.required', 'required', true),
          (params) => params.data.type === TaskParameterType.QUERY,
        ),
        this.utils.addConditionToColumnDef(
          this.utils.getBooleanColumnDef('entity.task.parameters.provided', 'provided', false),
          (params) => params.data.type === TaskParameterType.QUERY,
        ),
        this.utils.getStatusColumnDef(),
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        const originalParameters = TaskPropertiesContract.getParameters(this.entityToEdit?.properties);
        return of(originalParameters.map((parameter) => TaskQueryParameter.fromObject(parameter)));
      })
      .withRelationsUpdater(async (parameters: (TaskQueryParameter & Status)[]) => {
        const parametersToSave = parameters
          .filter(canKeepOrUpdate)
          .map((parameter) => TaskQueryParameter.fromObject(parameter));
        this.entityToEdit.properties = TaskPropertiesContract.withParameters(
          this.entityToEdit.properties,
          parametersToSave,
        );
        await firstValueFrom(this.taskService.update(this.entityToEdit));
      })
      .withFieldRestriction('name')
      .withTemplateDialog('newParameterDialog', () => TemplateDialog.builder()
        .withReference(this.newParameterDialog)
        .withTitle('entity.task.parameters.title')
        .withForm(new FormGroup({
          name: new FormControl('', { validators: [Validators.required], nonNullable: true }),
          label: new FormControl('', { validators: [Validators.required], nonNullable: true }),
          value: new FormControl('', { nonNullable: false }),
          type: new FormControl(null, { validators: [Validators.required], nonNullable: true }),
          required: new FormControl(false, { validators: [Validators.required], nonNullable: true }),
          provided: new FormControl(false, { nonNullable: true }),
        }))
        .withPreOpenFunction((form: FormGroup) => {
          const defaultType = this.defaultValueOrNull('queryTask.parameterType');
          form.reset({ type: defaultType?.value || TaskParameterType.TEMPLATE, provided: false });
        })
        .build())
      .withTargetToRelation((items: TaskQueryParameter[]) => items.map((item) => TaskQueryParameter.fromObject(item)))
      .withRelationsDuplicate((item) => TaskQueryParameter.fromObject(item))
      .build();
  }

  private normalizeSearchValue(value: string | null | undefined): string {
    return String(value || '').trim().toLocaleLowerCase();
  }

  private getLayerSearchText(): string {
    const value = this.layerSearchControl.value;
    return typeof value === 'string' ? value : value?.layerName || '';
  }

  private getServiceName(serviceId: number): string {
    return this.services.find((service) => service.id === serviceId)?.name ?? '-';
  }

  private defineSelectedLayersColumnDefs(): any[] {
    const dragCol: any = {
      headerName: '',
      field: 'order',
      rowDrag: true,
      sortable: false,
      editable: false,
      filter: false,
      width: 70,
      minWidth: 70,
      maxWidth: 70,
      suppressHeaderMenuButton: true,
      suppressMenu: true,
      cellClass: 'sitmun-centered-cell',
      headerClass: 'sitmun-centered-header',
      valueGetter: () => 'drag_indicator',
      cellRenderer: () => '<span class="material-icons-round">drag_indicator</span>'
    };

    const layerIdCol: any = Object.assign(this.utils.getNonEditableColumnDef('entity.task.mapImage.layers.id', 'layerIdLabel'), { flex: 2, minWidth: 180, tooltipField: 'layerIdLabel' });
    const layerNameCol: any = Object.assign(this.utils.getNonEditableColumnDef('entity.task.mapImage.layers.name', 'layerName'), { flex: 3, minWidth: 240, tooltipField: 'layerName' });
    const serviceNameCol: any = Object.assign(this.utils.getNonEditableColumnDef('entity.task.mapImage.layers.serviceName', 'serviceName'), { flex: 2, minWidth: 180, tooltipField: 'serviceName' });
    [layerIdCol, layerNameCol, serviceNameCol].forEach((column: any) => {
      column.sortable = false;
      column.filter = false;
    });

    return [
      this.utils.getSelCheckboxColumnDef(),
      dragCol,
      layerIdCol,
      layerNameCol,
      serviceNameCol,
    ];
  }

  protected fetchSelectedLayersGridRows = (): Observable<MapImageSelectedLayerGridRow[]> => {
    return of(this.selectedLayerRows.map((row) => ({
      ...row,
      status: 'statusOK' as const,
      newItem: false,
    })));
  };

  private defineRolesTable(): DataTableDefinition<Role, Role> {
    return createTaskRolesTable(this.relationTableContext());
  }

  private defineAvailabilitiesTable(): DataTableDefinition<TaskAvailabilityProjection, TerritoryProjection> {
    return createTaskAvailabilitiesTable(this.relationTableContext());
  }

  private relationTableContext() {
    return {
      dialog: this.dialog,
      errorHandler: this.errorHandler,
      loadingService: this.loadingService,
      translateService: this.translateService,
      utils: this.utils,
      roleService: this.roleService,
      territoryService: this.territoryService,
      taskAvailabilityService: this.taskAvailabilityService,
      taskService: this.taskService,
      isNew: () => this.isNew(),
      entity: this.entityToEdit,
      entityId: this.entityID,
    };
  }

}
