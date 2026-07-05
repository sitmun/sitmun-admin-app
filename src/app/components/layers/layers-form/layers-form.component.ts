import { HttpClient } from "@angular/common/http";
import {Component, TemplateRef, ViewChild} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import { firstValueFrom, of, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

import {BaseFormComponent} from '@app/components/base-form.component';
import {DataTableDefinition, TemplateDialog} from '@app/components/data-tables.util';
import {Configuration} from "@app/core/config/configuration";
import {MessagesInterceptorStateService} from '@app/core/interceptors/messages.interceptor';
import {
  Cartography,
  CartographyAvailability,
  CartographyAvailabilityProjection,
  CartographyAvailabilityService,
  CartographyFilter,
  CartographyFilterProjection,
  CartographyFilterService,
  CartographyGroupProjection,
  CartographyGroupService,
  CartographyParameter,
  CartographyParameterService,
  CartographyProjection,
  CartographyService,
  CartographyStyle,
  CartographyStyleService,
  CodeListService,
  ServiceService,
  TerritoryProjection,
  TerritoryService,
  TerritoryTypeService,
  TranslationService,
  TreeNodeProjection,
} from '@app/domain';
import {onCreate, onDelete, onUpdate, Status} from '@app/frontend-gui/src/lib/public_api';
import {ErrorHandlerService} from "@app/services/error-handler.service";
import {LoadingOverlayService} from "@app/services/loading-overlay.service";
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {constants} from '@environments/constants';

type StyleDialogValue = CartographyStyle & {
  url?: string | null;
  format?: string | null;
  width?: number | null;
  height?: number | null;
};

@Component({
    selector: 'app-layers-form',
    templateUrl: './layers-form.component.html',
    styleUrls: ['./layers-form.component.scss'],
    standalone: false
})
export class LayersFormComponent extends BaseFormComponent<CartographyProjection> {
  readonly config = Configuration.LAYER;

  protected readonly treesNodesTable: DataTableDefinition<TreeNodeProjection, TreeNodeProjection>;
  protected readonly cartographyPermissionsTable: DataTableDefinition<CartographyGroupProjection, CartographyGroupProjection>;
  protected readonly territoryAvailabilitiesTable: DataTableDefinition<CartographyAvailabilityProjection, TerritoryProjection>;
  protected readonly stylesTable: DataTableDefinition<CartographyStyle, CartographyStyle>;
  protected readonly territorialFiltersTable: DataTableDefinition<CartographyFilterProjection, CartographyFilterProjection>;
  protected readonly parametersTable: DataTableDefinition<CartographyParameter, CartographyParameter>;

  services: any[] = [];

  territorialTypes: any[] = [];

  private joinedLayersValidationSub?: Subscription;

  @ViewChild('newParameterDialog', {
    static: true
  }) private readonly newParameterDialog: TemplateRef<any>;

  @ViewChild('newTerritorialFilterDialog', {
    static: true
  }) private readonly newTerritorialFilterDialog: TemplateRef<any>;

  @ViewChild('newStyleDialog', { static: true})
  private readonly newStyleDialog: TemplateRef<any>;

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
    protected cartographyService: CartographyService,
    protected cartographyFilterService: CartographyFilterService,
    protected cartographyAvailabilityService: CartographyAvailabilityService,
    protected serviceService: ServiceService,
    protected territoryTypeService: TerritoryTypeService,
    protected territoryService: TerritoryService,
    protected cartographyGroupService: CartographyGroupService,
    protected cartographyParameterService: CartographyParameterService,
    protected cartographyStyleService: CartographyStyleService,
    protected http: HttpClient,
    protected utils: UtilsService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router, loadingService, messagesInterceptorState);
    this.treesNodesTable = this.defineTreesNodesTable();
    this.cartographyPermissionsTable = this.defineCartographyPermissionsTable();
    this.territoryAvailabilitiesTable = this.defineTerritoryAvailabilitiesTable();
    this.stylesTable = this.defineStylesTable();
    this.territorialFiltersTable = this.defineTerritorialFiltersTable();
    this.parametersTable = this.defineParametersTable();
    this.destroyRef.onDestroy(() => this.joinedLayersValidationSub?.unsubscribe());
  }

  /**
   * Initializes component data before fetching.
   * Sets up data tables, translations, and situation map list.
   */
  override async preFetchData() {
    this.dataTables.register(this.treesNodesTable).register(this.cartographyPermissionsTable)
      .register(this.territoryAvailabilitiesTable).register(this.stylesTable)
      .register(this.territorialFiltersTable).register(this.parametersTable);
    this.initTranslations('Cartography', ['name', 'description'])
    await this.initCodeLists([
      'cartography.geometryType', 'cartography.legendType','cartographyParameter.type',
      'cartographyFilter.type','cartographyFilter.valueType', 'cartographyParameter.format',
    ]);
    this.territorialTypes = await firstValueFrom(this.territoryTypeService.fetchAllItems())
    this.territorialTypes.sort((a, b) => a.name.localeCompare(b.name));
    this.services = await firstValueFrom(this.serviceService.fetchAllItems());
    this.services.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Fetches the original entity by ID.
   * @returns Promise of Cartography entity with projection
   */
  override fetchOriginal(): Promise<CartographyProjection> {
    return firstValueFrom(this.cartographyService.fetchProjectionById(CartographyProjection, this.entityID));
  }

  /**
   * Creates a copy of an existing entity for duplication.
   * @returns Promise of duplicated Cartography entity
   */
  override fetchCopy(): Promise<CartographyProjection> {
    return firstValueFrom(this.cartographyService.fetchProjectionById(CartographyProjection, this.duplicateID).pipe(map((copy: CartographyProjection) => {
      copy.name = this.translateService.instant("common.copyPrefix") + copy.name;
      return copy;
    })));
  }

  /**
   * Creates an empty entity with default values.
   * @returns New Cartography instance with default type and situation map
   */
  override empty(): CartographyProjection {
    return Object.assign(new CartographyProjection(), {
    })
  }

  /**
   * Fetches related data for the entity.
   * Loads translations for the current entity.
   */
  override async fetchRelatedData() {
    return this.loadTranslations(this.entityToEdit);
  }

  /**
   * Initializes form data after an entity is fetched.
   * Sets up reactive form with entity values and validation rules.
   * @throws Error if entity is undefined
   */
  override postFetchData() {
    if (!this.entityToEdit) {
      throw new Error('Cannot initialize form: entity is undefined');
    }

    const nonNegativeIntegerValidator: ValidatorFn = (
      control: AbstractControl
    ): ValidationErrors | null => {
      const raw = control.value;
      if (raw === null || raw === undefined || raw === '') {
        return null;
      }
      const n = typeof raw === 'number' ? raw : Number(raw);
      if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0) {
        return { scaleInteger: true };
      }
      return null;
    };

    const scaleRangeValidator: ValidatorFn = (
      group: AbstractControl
    ): ValidationErrors | null => {
      if (!group) {
        return null;
      }
      const minRaw = group.get('minimumScale')?.value;
      const maxRaw = group.get('maximumScale')?.value;
      if (minRaw == null || maxRaw == null || minRaw === '' || maxRaw === '') {
        return null;
      }
      const min = Number(minRaw);
      const max = Number(maxRaw);
      if (!Number.isFinite(min) || !Number.isFinite(max)) {
        return null;
      }
      if (min === 0 || max === 0) {
        return null;
      }
      return max > min ? null : { scaleRange: true };
    };

    // Custom validator to ensure queryable layers are subset of joined layers
    const queryableLayersValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const queryableLayers = this.parseLayerList(control.value);
      const joinedLayers = this.parseLayerList(this.entityForm?.get('joinedLayers')?.value);

      // Only validate if there are actual entries
      if (queryableLayers.length === 0) return null;

      // Check for duplicates
      const uniqueLayers = new Set(queryableLayers);
      if (uniqueLayers.size !== queryableLayers.length) {
        const duplicates = queryableLayers.filter((layer, index) => queryableLayers.indexOf(layer) !== index);
        return { duplicateLayers: [...new Set(duplicates)] };
      }

      // Check for invalid layers
      const invalidLayers = queryableLayers.filter(layer => !joinedLayers.includes(layer));
      return invalidLayers.length > 0 ? { invalidLayers: invalidLayers } : null;
    };

    this.entityForm = new UntypedFormGroup(
      {
      name: new UntypedFormControl(this.entityToEdit.name, [Validators.required]),
      serviceId: new UntypedFormControl(this.entityToEdit.serviceId, [Validators.required]),
      joinedLayers: new UntypedFormControl(this.entityToEdit.layers?.join(','), [Validators.required]),
      minimumScale: new UntypedFormControl(this.entityToEdit.minimumScale, [
        nonNegativeIntegerValidator
      ]),
      maximumScale: new UntypedFormControl(this.entityToEdit.maximumScale, [
        nonNegativeIntegerValidator
      ]),
      order: new UntypedFormControl(this.entityToEdit.order, []),
      transparency: new UntypedFormControl(this.entityToEdit.transparency ?? 0, [Validators.min(0), Validators.max(100)]),
      metadataURL: new UntypedFormControl(this.entityToEdit.metadataURL, []),
      legendType: new UntypedFormControl(this.entityToEdit.legendType || null, []),
      legendURL: new UntypedFormControl(this.entityToEdit.legendURL, []),
      source: new UntypedFormControl(this.entityToEdit.source, []),
      description: new UntypedFormControl(this.entityToEdit.description, []),
      datasetURL: new UntypedFormControl(this.entityToEdit.datasetURL, []),
      applyFilterToGetMap: new UntypedFormControl(this.entityToEdit.applyFilterToGetMap, []),
      applyFilterToGetFeatureInfo: new UntypedFormControl(this.entityToEdit.applyFilterToGetFeatureInfo, []),
      applyFilterToSpatialSelection: new UntypedFormControl(this.entityToEdit.applyFilterToSpatialSelection, []),
      queryableFeatureEnabled: new UntypedFormControl(this.entityToEdit.queryableFeatureEnabled || false, []),
      queryableFeatureAvailable: new UntypedFormControl(this.entityToEdit.queryableFeatureAvailable || false, []),
      joinedQueryableLayers: new UntypedFormControl(this.entityToEdit.queryableLayers?.join(','), [queryableLayersValidator]),
      thematic: new UntypedFormControl(this.entityToEdit.thematic, []),
      /** True when the layer may be used by viewers (inverse of API `blocked`). */
      availableForClients: new UntypedFormControl(
        this.isNewOrDuplicated()
          ? false
          : this.entityToEdit.blocked !== true,
        []
      ),
      selectableFeatureEnabled: new UntypedFormControl(this.entityToEdit.selectableFeatureEnabled, [],),
      joinedSelectableLayers: new UntypedFormControl(this.entityToEdit.selectableLayers?.join(','), []),
      spatialSelectionServiceId: new UntypedFormControl(this.entityToEdit.spatialSelectionServiceId, []),
      useAllStyles: new UntypedFormControl(this.entityToEdit.useAllStyles || false, []),
      },
      { validators: [scaleRangeValidator] }
    );

    if (this.isNew()) {
      this.entityForm.get('spatialSelectionServiceId').setValue(null);
      this.entityForm.get('spatialSelectionServiceId').disable();
      this.entityForm.get('joinedSelectableLayers').setValue(null);
      this.entityForm.get('joinedSelectableLayers').disable();
      this.entityForm.get('joinedQueryableLayers').setValue(null);
      this.entityForm.get('joinedQueryableLayers').disable();
    }

    this.joinedLayersValidationSub?.unsubscribe();
    this.joinedLayersValidationSub = this.entityForm.get('joinedLayers')?.valueChanges.subscribe(() => {
      this.entityForm.get('joinedQueryableLayers')?.updateValueAndValidity({ emitEvent: false });
    });
  }

  /**
   * Creates a Cartography object from the current form values.
   *
   * @param id - Optional ID for the new object, used when updating
   * @returns New Cartography instance populated with form values
   */
  createObject(id: number = null): Cartography {
    let safeToEdit = CartographyProjection.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();
    const { availableForClients, ...formValuesWithoutAvail } = formValues;
    safeToEdit = Object.assign(safeToEdit, formValuesWithoutAvail, {
      id: id,
      blocked: availableForClients !== true,
      layers: this.parseLayerList(formValues.joinedLayers),
      queryableLayers: this.parseLayerList(formValues.joinedQueryableLayers),
      selectableLayers: this.parseLayerList(formValues.joinedSelectableLayers),
      service: this.serviceService.createProxy(formValues.serviceId),
      spatialSelectionService: this.serviceService.createProxy(formValues.spatialSelectionServiceId),
    });
    return Cartography.fromObject(safeToEdit);
  }

  /**
   * Creates a new entity or duplicates an existing one.
   * @returns Promise of created entity ID
   */
  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const response = await firstValueFrom(this.cartographyService.create(entityToCreate));
    return response.id;
  }

  /**
   * Updates an existing entity with form values.
   */
  override async updateEntity() {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.cartographyService.update(entityToUpdate));
  }

  /**
   * Updates related data after entity save.
   * @param _isDuplicated - Whether this is a duplication operation
   */
  override async updateDataRelated(_isDuplicated: boolean) {
    const entityToUpdate = this.createObject(this.entityID);
    await this.saveTranslations(entityToUpdate);

    const newServiceId = this.entityForm.get('serviceId').value;

    if (newServiceId === null) {
      await firstValueFrom(entityToUpdate.updateRelationEx("service"))
    } else {
      const newRelation = this.serviceService.createProxy(newServiceId);
      await firstValueFrom(entityToUpdate.updateRelationEx("service", newRelation));
    }
  }

  /**
   * Validates if the form can be saved.
   * Checks if all required form fields are valid.
   *
   * @returns True if the form is valid, false otherwise
   */
  override canSave(): boolean {
    return this.entityForm.valid;
  }

  private defineParametersTable(): DataTableDefinition<CartographyParameter, CartographyParameter> {
    return DataTableDefinition.builder<CartographyParameter, CartographyParameter>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getEditableColumnDef('entity.cartography.parameters.name', 'name'),
        this.utils.getNonEditableColumnWithProviderDef('entity.cartography.parameters.type', 'type', (x) => {
          return this.codeList('cartographyParameter.type').find(item => item.value === x)?.description || '';
        }),
        this.utils.getEditableColumnDef('entity.cartography.parameters.value', 'value'),
        this.utils.getNonEditableColumnWithProviderDef('entity.cartography.parameters.format', 'format', (x) => {
          return this.codeList('cartographyParameter.format').find(item => item.value === x)?.description || '';
        }),
        this.utils.getEditableColumnDef('entity.cartography.parameters.order', 'order'),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(CartographyParameter, 'parameters', {projection: 'view'});
      })
      .withRelationsOrder('name')
      .withRelationsUpdater(async (cartographyParameters: (CartographyParameter & Status)[]) => {
        this.loggerService.debug('cartographyParameters', cartographyParameters);
        await onCreate(cartographyParameters).forEach(item => {
          item.cartography = this.cartographyService.createProxy(this.entityID);
          return this.cartographyParameterService.create(item);
        });
        await onUpdate(cartographyParameters).forEach(item => {
          item.cartography = this.cartographyService.createProxy(this.entityID);
          return this.cartographyParameterService.update(item);
        });
        await onDelete(cartographyParameters).forEach(item => {
          const proxy = this.cartographyParameterService.createProxy(item.id);
          return this.cartographyParameterService.delete(proxy)
        });
      })
      .withTemplateDialog('newParameterDialog', () => TemplateDialog.builder()
        .withReference(this.newParameterDialog)
        .withTitle('entity.cartography.parameters.title')
        .withForm(new FormGroup({
          name: new FormControl(null, [Validators.required]),
          type: new FormControl(null, [Validators.required]),
          value: new FormControl(null, [Validators.required]),
          format: new FormControl(null, []),
          order: new FormControl(null, []),
        })).withPreOpenFunction((form: FormGroup) => {
          const defaultType = this.defaultValueOrNull('cartographyParameter.type');
          const defaultFormat = this.defaultValueOrNull('cartographyParameter.format');
          form.reset({
            type: defaultType?.value || null,
            format: defaultFormat?.value || null
          });
        }).build())
        .build();
  }

  private defineTerritorialFiltersTable(): DataTableDefinition<CartographyFilterProjection, CartographyFilterProjection> {
    return DataTableDefinition.builder<CartographyFilterProjection, CartographyFilterProjection>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getEditableColumnDef('entity.cartography.filters.parameters.name', 'name'),
        this.utils.getNonEditableColumnWithProviderDef('entity.cartography.filters.parameters.type', 'type', (x) => {
          return this.codeList('cartographyFilter.type').find(item => item.value === x)?.description || '';
        }),
        this.utils.getEditableColumnDef('entity.cartography.filters.parameters.column', 'column'),
        this.utils.getEditableColumnDef('entity.cartography.filters.parameters.values', 'values'),
        this.utils.getNonEditableColumnWithProviderDef('entity.cartography.filters.parameters.valueType', 'valueType',(x) => {
          return this.codeList('cartographyFilter.valueType').find(item => item.value === x)?.description || '';
        }),
        this.utils.getNonEditableColumnWithProviderDef('entity.cartography.filters.parameters.territorialLevel', 'territorialLevelId', (x) => {
          this.loggerService.debug('territorialLevelId', x);
          return this.territorialTypes.find(item => item.id === x)?.name ?? '';
        }),
        this.utils.getBooleanColumnDef('entity.cartography.filters.parameters.required', 'required', true),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(CartographyFilterProjection, 'filters', {projection: 'view'});
      })
      .withRelationsOrder('name')
      .withRelationsUpdater(async (cartographyFilters: (CartographyFilterProjection & Status)[]) => {
        await onCreate(cartographyFilters).forEach(item => {
          this.loggerService.debug('Creating cartography filter', item);
          const newItem = CartographyFilter.fromObject(item);
          newItem.cartography = this.cartographyService.createProxy(this.entityID);
          if (item.territorialLevelId) {
            newItem.territorialLevel = this.territoryTypeService.createProxy(item.territorialLevelId);
          }
          newItem.values = typeof item.values === 'string' ? (item.values as string).split(',') : (Array.isArray(item.values) ? item.values : null);
          return this.cartographyFilterService.create(newItem)
        });
        await onUpdate(cartographyFilters).forEach(item => {
          const updatedItem = CartographyFilter.fromObject(item);
          updatedItem.cartography = this.cartographyService.createProxy(this.entityID);
          if (item.territorialLevelId) {
            updatedItem.territorialLevel = this.territoryTypeService.createProxy(item.territorialLevelId);
          }
          updatedItem.values = typeof item.values === 'string' ? (item.values as string).split(',') : (Array.isArray(item.values) ? item.values : null);
          return this.cartographyFilterService.update(updatedItem);
        });
        await onDelete(cartographyFilters).forEach(item => {
          const proxy = this.cartographyFilterService.createProxy(item.id);
          return this.cartographyFilterService.delete(proxy)
        });
      })
      .withTemplateDialog('newTerritorialFilterDialog', () => TemplateDialog.builder()
        .withReference(this.newTerritorialFilterDialog)
        .withTitle('entity.cartography.filters.parameters.title')
        .withForm(new FormGroup({
          name: new FormControl(null, [Validators.required]),
          required: new FormControl(false),
          type: new FormControl(null, [Validators.required]),
          territorialLevelId: new FormControl(null),
          column: new FormControl(null),
          values: new FormControl(null),
          valueType: new FormControl(null, []),
        })).withPreOpenFunction((form: FormGroup) => {
          const defaultType = this.defaultValueOrNull('cartographyFilter.type');
          const defaultValueType = this.defaultValueOrNull('cartographyFilter.valueType');
          form.reset({
            type: defaultType?.value || null,
            valueType: defaultValueType?.value || null
          });
        }).build())
      .build();
  }

  private defineStylesTable(): DataTableDefinition<CartographyStyle, CartographyStyle> {
    return DataTableDefinition.builder<CartographyStyle, CartographyStyle>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getEditableColumnDef('entity.cartography.styles.parameters.name', 'name'),
        this.utils.getBooleanColumnDef('entity.cartography.styles.parameters.defaultStyle', 'defaultStyle', true, null, null, true),
        this.utils.getEditableColumnDef('entity.cartography.styles.parameters.title', 'title'),
        this.utils.getEditableColumnDef('entity.cartography.styles.parameters.description', 'description'),
        this.utils.getEditableColumnWithLinkDef('entity.cartography.styles.parameters.url', 'legendURL.onlineResource'),
        this.utils.getEditableColumnDef('entity.cartography.styles.parameters.format', 'legendURL.format'),
        this.utils.getEditableColumnDef('entity.cartography.styles.parameters.width', 'legendURL.width'),
        this.utils.getEditableColumnDef('entity.cartography.styles.parameters.height', 'legendURL.height'),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(CartographyStyle, 'styles', {projection: 'view'});
      })
      .withRelationsOrder('name')
      .withRelationsUpdater(async (cartographyStyles: (CartographyStyle & Status)[]) => {
        await onCreate(cartographyStyles).forEach(item => {
          item.cartography = this.cartographyService.createProxy(this.entityID);
          return this.cartographyStyleService.create(item)
        });
        await onDelete(cartographyStyles).forEach(item => this.cartographyStyleService.delete(item));
        await onUpdate(cartographyStyles).forEach(item => this.cartographyStyleService.update(item));
      })
      .withTemplateDialog('newStyleDialog', () => TemplateDialog.builder()
        .withReference(this.newStyleDialog)
        .withTitle('entity.cartography.styles.parameters.header')
        .withForm(new FormGroup({
          name: new FormControl(null, [Validators.required]),
          title: new FormControl(null, [Validators.required]),
          description: new FormControl(null, []),
          format: new FormControl(null, []),
          width: new FormControl(null, []),
          height: new FormControl(null, []),
          url: new FormControl(null, []),
          defaultStyle: new FormControl(false, []),
        })).withPreOpenFunction((form: FormGroup) => {
          form.reset({
            name: null,
            title: null,
            description: null,
            format: null,
            width: null,
            height: null,
            url: null,
            defaultStyle: false,
          });
        }).build())
      .withTargetToRelation((items) => items.map(item => this.toCartographyStyle(item as StyleDialogValue)))
      .build()
  }


  private defineTerritoryAvailabilitiesTable(): DataTableDefinition<CartographyAvailabilityProjection, TerritoryProjection> {
    return DataTableDefinition.builder<CartographyAvailabilityProjection, TerritoryProjection>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef('entity.cartography.territories.parameters.name', 'territoryName', '/territory/:id/territoryForm', {id: 'territoryId'}),
        this.utils.getNonEditableColumnDef('entity.cartography.territories.parameters.type', 'territoryType'),
        this.utils.getNonEditableColumnDef('entity.cartography.territories.parameters.code', 'territoryCode'),
        this.utils.getStatusColumnDef()
        ])
        .withRelationsFetcher(() => {
          if (this.isNew()) {
            return of([]);
          }
          return this.entityToEdit.getRelationArrayEx(CartographyAvailabilityProjection, 'availabilities', {projection: 'view'});
        })
        .withRelationsOrder('territoryName')
        .withRelationsUpdater(async (cartographyAvailability: (CartographyAvailabilityProjection & Status)[]) => {
          await onCreate(cartographyAvailability).forEach(item => {
              const newItem = new CartographyAvailability()
              newItem.territory = this.territoryService.createProxy(item.territoryId)
              newItem.cartography = this.cartographyService.createProxy(this.entityID)
              return this.cartographyAvailabilityService.create(newItem)
          });
          await onDelete(cartographyAvailability).forEach(item => {
            const proxy = this.cartographyAvailabilityService.createProxy(item.id)
            return this.cartographyAvailabilityService.delete(proxy)
          });
        })
        .withTargetsColumns([
          this.utils.getSelCheckboxColumnDef(),
          this.utils.getNonEditableColumnDef('entity.cartography.territories.parameters.name', 'name'),
          this.utils.getNonEditableColumnDef('entity.cartography.territories.parameters.type', 'typeName'),
          this.utils.getNonEditableColumnDef('entity.cartography.territories.parameters.code', 'code'),
        ])
        .withTargetsFetcher(() => {
          return this.territoryService.fetchProjectionItems(TerritoryProjection)
        })
        .withTargetInclude((availabilities: (CartographyAvailabilityProjection)[]) => (item: TerritoryProjection) => {
          return !availabilities.some((availability) => availability.territoryId === item.id);
        })
        .withTargetToRelation((items: TerritoryProjection[]) => {
          const newItems: CartographyAvailabilityProjection[] = []
          items.forEach(item => {
            const newItem = new CartographyAvailabilityProjection()
            newItem.territoryId = item.id
            newItem.territoryName = item.name
            newItem.territoryType = item.typeName
            newItem.territoryCode = item.code
            newItems.push(newItem)
          })
          return newItems
        })
        .withTargetsTitle('entity.cartography.territories.parameters.title')
        .withTargetsOrder('name')
        .build();
  }

  private defineCartographyPermissionsTable(): DataTableDefinition<CartographyGroupProjection, CartographyGroupProjection> {
    return DataTableDefinition.builder<CartographyGroupProjection, CartographyGroupProjection>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef('entity.cartography.permissions.parameters.name', 'name', '/layersPermits/:id/layersPermitsForm', {id: 'id'}),
        {...this.utils.getNonEditableColumnDef('entity.cartography.permissions.parameters.roles', 'roleNames'), ...this.utils.getArrayValueParser()},
        this.utils.getStatusColumnDef()
      ])
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(CartographyGroupProjection, 'permissions', {projection: 'view'});
      })
      .withRelationsOrder('name')
      .withRelationsUpdater(async (cartographyGroups: (CartographyGroupProjection & Status)[]) => {
        const cartography = this.cartographyService.createProxy(this.entityID);
        await onCreate(cartographyGroups).forEach(item => {
          return item.addRelationEx("members", cartography);
        });
        await onDelete(cartographyGroups).forEach(item => {
          return item.deleteRelationById("members", this.entityID);
        });
      })
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('entity.cartography.permissions.parameters.name', 'name'),
        {...this.utils.getNonEditableColumnDef('entity.cartography.permissions.parameters.roles', 'roleNames'), ...this.utils.getArrayValueParser()},
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => {
        const filter = {
          params: [
            {key: 'type', value: constants.codeValue.cartographyPermissionType.cartographyGroup}
          ]
        };
        return this.cartographyGroupService.fetchProjectionItems(CartographyGroupProjection, filter)
      })
      .withTargetInclude((cartographyGroups: (CartographyGroupProjection)[]) => (item: CartographyGroupProjection) => {
        return !cartographyGroups.some((cartographyGroup) => cartographyGroup.id === item.id);
      })
      .withTargetToRelation((items: CartographyGroupProjection[]) => items)
      .withTargetsTitle('entity.cartography.permissions.parameters.title')
      .withTargetsOrder('name')
      .build();
  }

  /**
   * Defines the data table structure for tree nodes.
   * @returns DataTableDefinition for tree nodes with columns for tree name and node name
   */
  private defineTreesNodesTable(): DataTableDefinition<TreeNodeProjection, TreeNodeProjection> {
    return DataTableDefinition.builder<TreeNodeProjection, TreeNodeProjection>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getRouterLinkColumnDef('entity.cartography.trees.name', 'treeName', '/trees/:id/treesForm', {id: 'treeId'}),
        this.utils.getNonEditableColumnDef('entity.cartography.trees.node', 'name')
      ])
      .withRelationsFetcher(() =>  {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(TreeNodeProjection, 'treeNodes', {projection: 'view'})
      })
      .withRelationsOrder('treeName')
      .build();
  }

  getAvailableLayers(): string {
    const joinedLayers = this.parseLayerList(this.entityForm?.get('joinedLayers')?.value);
    const queryableLayers = this.parseLayerList(this.entityForm?.get('joinedQueryableLayers')?.value);

    const availableLayers = joinedLayers.filter(layer => !queryableLayers.includes(layer));
    return availableLayers.join(', ');
  }

  getServiceName(serviceId: number): string {
    const service = this.services.find(s => s.id === serviceId);
    return service ? service.name : '';
  }

  private parseLayerList(raw: string | null | undefined): string[] {
    if (raw == null || raw === '') {
      return [];
    }
    return raw.split(',').map(value => value.trim()).filter(Boolean);
  }

  private toCartographyStyle(item: StyleDialogValue): CartographyStyle {
    const style = Object.assign(new CartographyStyle(), item);
    style.legendURL = {
      format: item.format ?? null,
      width: item.width ?? null,
      height: item.height ?? null,
      onlineResource: item.url ?? item.legendURL?.onlineResource ?? null,
    };
    return style;
  }
}
