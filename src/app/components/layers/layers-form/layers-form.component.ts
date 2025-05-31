import {Component, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
  CartographyService,
  ServiceService,
  CartographyFilterService,
  TerritoryTypeService,
  ConnectionService,
  TreeNodeService,
  TerritoryService,
  CartographyAvailabilityService,
  TranslationService,
  Translation,
  CartographyProjection,
  CodeListService,
  CartographyGroupService,
  TreeNodeProjection,
  Connection,
  Cartography,
  GetInfoService,
  CartographySpatialSelectionParameterService,
  CartographyParameterService,
  CartographyStyleService,
  CartographyGroupProjection, TerritoryProjection,
  CartographyAvailabilityProjection,
  CartographyAvailability,
  CartographyStyle,
  CartographyFilterProjection,
  CartographyFilter,
  CartographyParameter
}
  from '@app/domain';
import {UtilsService} from '@app/services/utils.service';
import {map} from 'rxjs/operators';
import {firstValueFrom, Observable, of, Subject} from 'rxjs';
import {config} from '@config';
import {
  DialogFormComponent,
  DialogMessageComponent, onCreate, onDelete,
  onUpdate,
  Status
} from '@app/frontend-gui/src/lib/public_api';
import {MatDialog} from '@angular/material/dialog';
import {constants} from '@environments/constants';
import {LoggerService} from '@app/services/logger.service';
import {BaseFormComponent} from '@app/components/base-form.component';
import { TranslateService } from '@ngx-translate/core';
import {ErrorHandlerService} from "@app/services/error-handler.service";
import { DataTableDefinition, TemplateDialog } from '@app/components/data-tables.util';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-layers-form',
  templateUrl: './layers-form.component.html',
  styles: []
})
export class LayersFormComponent extends BaseFormComponent<CartographyProjection> {

  protected readonly treesNodesTable: DataTableDefinition<TreeNodeProjection, TreeNodeProjection>;
  protected readonly cartographyPermissionsTable: DataTableDefinition<CartographyGroupProjection, CartographyGroupProjection>;
  protected readonly territoryAvailabilitiesTable: DataTableDefinition<CartographyAvailabilityProjection, TerritoryProjection>;
  protected readonly stylesTable: DataTableDefinition<CartographyStyle, CartographyStyle>;
  protected readonly territorialFiltersTable: DataTableDefinition<CartographyFilterProjection, CartographyFilterProjection>;
  protected readonly parametersTable: DataTableDefinition<CartographyParameter, CartographyParameter>;
  //Translations
  translationMap: Map<string, Translation>;

  translationsModified = false;

  parametersPendingDelete = [];

  disableLoadButton = true;


  //Form
  geometryTypes: any[] = [];

  legendTypes: any[] = [];

  services: any[] = [];

  territorialTypes: any[] = [];

  parameterFormatTypes: any[] = [];

  parameterFormatTypesDescription: any[] = [];

  parameterTypes: any[] = [];

  parameterTypesDescription: any[] = [];

  columnDefsParameters: any[];

  getAllElementsEventParameters: Subject<"save"> = new Subject<"save">();

  dataUpdatedEventParameters: Subject<boolean> = new Subject<boolean>();

  //Dialog
  columnDefsParametersDialog: any[];

  public parameterForm: UntypedFormGroup;

  addElementsEventParameters: Subject<any[]> = new Subject<any[]>();

  @ViewChild('newParameterDialog', {
    static: true
  }) private newParameterDialog: TemplateRef<any>;

  @ViewChild('newTerritorialFilterDialog', {
    static: true
  }) private newTerritorialFilterDialog: TemplateRef<any>;

  @ViewChild('newStyleDialog', { static: true})
  private newStyleDialog: TemplateRef<any>;

  columnDefsCartographyGroupsDialog: any[];

  columnDefsTerritoriesDialog: any[];

  columnDefsNodesDialog: any[];

  constructor(
    dialog: MatDialog,
    translateService: TranslateService,
    translationService: TranslationService,
    codeListService: CodeListService,
    loggerService: LoggerService,
    errorHandler: ErrorHandlerService,
    activatedRoute: ActivatedRoute,
    router: Router,
    protected cartographyService: CartographyService,
    protected cartographyFilterService: CartographyFilterService,
    protected cartographyAvailabilityService: CartographyAvailabilityService,
    protected serviceService: ServiceService,
    protected connectionService: ConnectionService,
    protected territoryTypeService: TerritoryTypeService,
    protected territoryService: TerritoryService,
    protected treeNodeService: TreeNodeService,
    protected cartographyGroupService: CartographyGroupService,
    protected cartographySpatialSelectionParameterService: CartographySpatialSelectionParameterService,
    protected cartographyParameterService: CartographyParameterService,
    protected cartographyStyleService: CartographyStyleService,
    protected http: HttpClient,
    protected utils: UtilsService,
    protected getInfoService: GetInfoService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router);
    this.treesNodesTable = this.defineTreesNodesTable();
    this.cartographyPermissionsTable = this.defineCartographyPermissionsTable();
    this.territoryAvailabilitiesTable = this.defineTerritoryAvailabilitiesTable();
    this.stylesTable = this.defineStylesTable();
    this.territorialFiltersTable = this.defineTerritorialFiltersTable();
    this.parametersTable = this.defineParametersTable();
  }

  /**
   * Initializes component data before fetching.
   * Sets up data tables, translations, and situation map list.
   */
  override async preFetchData() {
    this.dataTables.register(this.treesNodesTable).register(this.cartographyPermissionsTable)
      .register(this.territoryAvailabilitiesTable).register(this.stylesTable)
      .register(this.territorialFiltersTable).register(this.parametersTable);
    this.initTranslations('Cartography', ['description'])
    await this.initCodeLists([
      'cartography.geometryType', 'cartography.legendType','cartographyParameter.type',
      'cartographyFilter.type','cartographyFilter.valueType', 'cartographyParameter.format',
    ]);
    this.territorialTypes = await firstValueFrom(this.territoryTypeService.getAll())
    this.territorialTypes.sort((a, b) => a.name.localeCompare(b.name));
    this.services = await firstValueFrom(this.serviceService.getAll());
    this.services.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Fetches the original entity by ID.
   * @returns Promise of Cartography entity with projection
   */
  override fetchOriginal(): Promise<CartographyProjection> {
    return firstValueFrom(this.cartographyService.getProjection(CartographyProjection, this.entityID));
  }

  /**
   * Creates a copy of an existing entity for duplication.
   * @returns Promise of duplicated Cartography entity
   */
  override fetchCopy(): Promise<CartographyProjection> {
    return firstValueFrom(this.cartographyService.getProjection(CartographyProjection, this.duplicateID).pipe(map((copy: CartographyProjection) => {
      copy.name = this.translateService.instant("copy_") + copy.name;
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

    // Custom validator to ensure queryable layers are subset of joined layers
    const queryableLayersValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const queryableLayers = control.value?.split(',').map(layer => layer.trim()) || [];
      const joinedLayers = this.entityForm?.get('joinedLayers')?.value?.split(',').map(layer => layer.trim()) || [];

      // Only validate if there are actual entries
      if (queryableLayers.length === 0 || !control.value) return null;

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

    this.entityForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.entityToEdit.name, [Validators.required]),
      serviceId: new UntypedFormControl(this.entityToEdit.serviceId, [Validators.required]),
      joinedLayers: new UntypedFormControl(this.entityToEdit.layers?.join(','), [Validators.required]),
      minimumScale: new UntypedFormControl(this.entityToEdit.minimumScale, []),
      maximumScale: new UntypedFormControl(this.entityToEdit.maximumScale, []),
      order: new UntypedFormControl(this.entityToEdit.order, []),
      transparency: new UntypedFormControl(this.entityToEdit.transparency, []),
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
      blocked: new UntypedFormControl(this.entityToEdit.blocked || true, []),
      selectableFeatureEnabled: new UntypedFormControl(this.entityToEdit.selectableFeatureEnabled, [],),
      joinedSelectableLayers: new UntypedFormControl(this.entityToEdit.selectableLayers?.join(','), []),
      spatialSelectionConnectionId: new UntypedFormControl(this.entityToEdit.spatialSelectionConnectionId, []),
      useAllStyles: new UntypedFormControl(this.entityToEdit.useAllStyles || false, []),
    });

    if (this.isNew()) {
      // this.entityForm.get('applyFilterToGetMap').disable();
      this.entityForm.get('spatialSelectionServiceId').disable();
      this.entityForm.get('joinedSelectableLayers').disable();
      // this.entityForm.get('queryableFeatureAvailable').disable();
      this.entityForm.get('joinedQueryableLayers').disable();
    } else {
      if (!this.entityToEdit.queryableFeatureEnabled) {
        // this.entityForm.get('queryableFeatureAvailable').disable();
        this.entityForm.get('joinedQueryableLayers').disable();
      }
    }
  }

  /**
   * Creates a Cartography object from the current form values.
   *
   * @param id - Optional ID for the new object, used when updating
   * @returns New Cartography instance populated with form values
   */
  createObject(id: number = null): Cartography {
    let safeToEdit = CartographyProjection.fromObject(this.entityToEdit);
    safeToEdit = Object.assign(safeToEdit,
      this.entityForm.value,
      {
        id: id,
        layers: this.entityForm.get('joinedLayers')?.value ? this.entityForm.get('joinedLayers').value.split(',') : [],
        queryableLayers: this.entityForm.get('queryableLayers')?.value ? this.entityForm.get('queryableLayers').value.split(',') : [],
        selectableLayers: this.entityForm.get('selectableLayers')?.value ? this.entityForm.get('selectableLayers').value.split(',') : [],
        service: this.serviceService.createProxy(this.entityForm.get('serviceId').value),
      }
    );
    return Cartography.fromObject(safeToEdit)
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
   * @param isDuplicated - Whether this is a duplication operation
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override async updateDataRelated(isDuplicated: boolean) {
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
    return DataTableDefinition.builder<CartographyParameter, CartographyParameter>(this.dialog, this.errorHandler)
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
        console.log('cartographyParameters', cartographyParameters);
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
        .withTitle(this.translateService.instant('entity.cartography.parameters.title'))
        .withForm(new FormGroup({
          name: new FormControl(null, [Validators.required]),
          type: new FormControl(null, [Validators.required]),
          value: new FormControl(null, [Validators.required]),
          format: new FormControl(null, []),
          order: new FormControl(null, []),
        })).build())
        .build();
  }

  private defineTerritorialFiltersTable(): DataTableDefinition<CartographyFilterProjection, CartographyFilterProjection> {
    return DataTableDefinition.builder<CartographyFilterProjection, CartographyFilterProjection>(this.dialog, this.errorHandler)
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
          console.log('territorialLevelId', x);
          return this.territorialTypes.find(item => item.id === x)?.name || '';
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
          console.log('Creating cartography filter', item);
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
        .withTitle(this.translateService.instant('entity.cartography.filters.parameters.title'))
        .withForm(new FormGroup({
          name: new FormControl(null, [Validators.required]),
          required: new FormControl(false),
          type: new FormControl(null, [Validators.required]),
          territorialLevelId: new FormControl(null),
          column: new FormControl(null),
          values: new FormControl(null),
          valueType: new FormControl(null, []),
        })).build())
      .build();
  }

  private defineStylesTable(): DataTableDefinition<CartographyStyle, CartographyStyle> {
    return DataTableDefinition.builder<CartographyStyle, CartographyStyle>(this.dialog, this.errorHandler)
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
        .withTitle(this.translateService.instant('entity.cartography.styles.parameters.title'))
        .withForm(new FormGroup({
          name: new FormControl(null, [Validators.required]),
          title: new FormControl(null, [Validators.required]),
          description: new FormControl(null, []),
          format: new FormControl(null, []),
          width: new FormControl(null, []),
          height: new FormControl(null, []),
          url: new FormControl(null, []),
          defaultStyle: new FormControl(false, []),
        })).build())
      .build()
  }


  private defineTerritoryAvailabilitiesTable(): DataTableDefinition<CartographyAvailabilityProjection, TerritoryProjection> {
    return DataTableDefinition.builder<CartographyAvailabilityProjection, TerritoryProjection>(this.dialog, this.errorHandler)
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
          return this.territoryService.getAllProjection(TerritoryProjection)
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
        .withTargetsTitle(this.translateService.instant('entity.cartography.territories.parameters.title'))
        .withTargetsOrder('name')
        .build();
  }

  private defineCartographyPermissionsTable(): DataTableDefinition<CartographyGroupProjection, CartographyGroupProjection> {
    return DataTableDefinition.builder<CartographyGroupProjection, CartographyGroupProjection>(this.dialog, this.errorHandler)
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
        await onCreate(cartographyGroups).forEach(item => {
          return item.addRelationEx("members", this.entityToEdit);
        });
        await onDelete(cartographyGroups).forEach(item => {
          return item.deleteRelationById("members", this.entityToEdit.id);
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
        return this.cartographyGroupService.getAllProjection(CartographyGroupProjection, filter)
      })
      .withTargetInclude((cartographyGroups: (CartographyGroupProjection)[]) => (item: CartographyGroupProjection) => {
        return !cartographyGroups.some((cartographyGroup) => cartographyGroup.id === item.id);
      })
      .withTargetToRelation((items: CartographyGroupProjection[]) => items)
      .withTargetsTitle(this.translateService.instant('entity.cartography.permissions.parameters.title'))
      .withTargetsOrder('name')
      .build();
  }

  /**
   * Defines the data table structure for tree nodes.
   * @returns DataTableDefinition for tree nodes with columns for tree name and node name
   */
  private defineTreesNodesTable(): DataTableDefinition<TreeNodeProjection, TreeNodeProjection> {
    return DataTableDefinition.builder<TreeNodeProjection, TreeNodeProjection>(this.dialog, this.errorHandler)
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
    const joinedLayers = this.entityForm?.get('joinedLayers')?.value?.split(',').map(layer => layer.trim()) || [];
    const queryableLayers = this.entityForm?.get('joinedQueryableLayers')?.value?.split(',').map(layer => layer.trim()) || [];

    const availableLayers = joinedLayers.filter(layer => !queryableLayers.includes(layer));
    return availableLayers.join(', ');
  }
}


//
// CODE THAT CAN BE REMOVED
//

/*

  onSelectionThematicChanged(value) {
    if (value.checked) {
      this.entityForm.get('geometryType').enable();
    } else {
      this.entityForm.get('geometryType').disable();
    }
  }

  onSelectableFeatureEnabledChange(value) {
    if (value.checked) {
      this.entityForm.get('spatialSelectionServiceId').enable();
      this.entityForm.get('joinedSelectableLayers').enable();
      this.loadButtonDisabled();
    } else {
      this.entityForm.get('spatialSelectionServiceId').disable();
      this.entityForm.get('joinedSelectableLayers').disable();
      this.disableLoadButton = true;
    }
  }

  onQueryableFeatureEnabledChange(value) {
    if (value.checked) {
      this.entityForm.get('queryableFeatureAvailable').enable();
      this.entityForm.get('joinedQueryableLayers').enable();
    } else {
      this.entityForm.get('queryableFeatureAvailable').disable();
      this.entityForm.get('joinedQueryableLayers').disable();
    }
  }

  async onTranslationButtonClicked() {
    const dialogResult = await this.utils.openTranslationDialog(this.translationMap);
    if (dialogResult && dialogResult.event == 'Accept') {
      this.translationsModified = true;
    }
  }



  onLoadButtonClicked(): void {
    try {

      const dialogRef = this.dialog.open(DialogMessageComponent);
      dialogRef.componentInstance.title = this.utils.getTranslate('caution');
      dialogRef.componentInstance.message = this.utils.getTranslate('getInfoMessage');
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const replaceAll = result.event === 'Accept';
          const service = this.spatialConfigurationServices.find(element => element.id == this.entityForm.get('spatialSelectionServiceId').value);
          const layersName = this.entityForm.get('joinedSelectableLayers').value;
          if (service && service.serviceURL && layersName) {
            let url: string = service.serviceURL;
            if (!url.includes('request=DescribeFeatureType')) {
              if (url[url.length - 1] != '?') {
                url += '?';
              }

              url += `request=DescribeFeatureType%26service=WFS%26typeName=${layersName}`;
            }
            this.getInfoService.getInfo(url).subscribe(result => {
              if (result.success) {
                this.manageGetInfoResults(result.asJson, replaceAll);
              }
            }, error => {
              this.loggerService.error('Error getting info service', error);
            });
          }


        }
      });


    } catch (err) {
      this.utils.showErrorMessage(err);
    }

  }

  manageGetInfoResults(results, replaceAll: boolean) {
    const elementsToAdd = [];
    const elements = [];
    const type = this.spatialSelectionParameterTypes.find(element => element.value == 'SELECT');

    if (results['xsd:schema'] && results['xsd:schema']['xsd:element']) {
      elements.push(results['xsd:schema']['xsd:element']);
    }

    if (results['xsd:schema'] && results['xsd:schema']['xsd:complexType'] && results['xsd:schema']['xsd:complexType']['xsd:complexContent']) {
      const complexContent = results['xsd:schema']['xsd:complexType']['xsd:complexContent'];
      if (complexContent['xsd:extension'] && complexContent['xsd:extension']['xsd:sequence'] && complexContent['xsd:extension']['xsd:sequence']['xsd:element']) {
        elements.push(...complexContent['xsd:extension']['xsd:sequence']['xsd:element']);
        if (elements) {
          elements.forEach(element => {
            const newParameter = {
              name: element.name,
              value: element.name,
              type: type ? type.value : null,
              format: this.getFormatFromGetInfo(element.type),
            };
            elementsToAdd.push(newParameter);
          });
          if (elementsToAdd) {
            if (replaceAll) {
              this.getAllElementsEventSpatialConfigurations.next('pendingDelete');
              this.replaceAllElementsEventSpatialConfigurations.next(elementsToAdd);
            } else {
              this.addElementsEventSpatialConfigurations.next(elementsToAdd);
            }

          }
        }
      }
    }

    return elementsToAdd;
  }

  private getFormatFromGetInfo(format) {
    if (format == 'xsd:int') {
      return 'N';
    } else if (format == 'xsd:string') {
      return 'T';
    } else if (format == 'xsd:img') {
      return 'I';
    } else if (format == 'gml:PointPropertyType') {
      return 'N';
    } else if (format == 'xsd:url') {
      return 'U';
    } else if (format == 'xsd:date') {
      return 'F';
    } else {
      return 'T';
    }
  }

  // AG-GRID



  loadButtonDisabled() {
    const formValues = this.entityForm.value;
    this.disableLoadButton = !(formValues.selectableFeatureEnabled &&
      formValues.spatialSelectionService &&
      formValues.spatialSelectionService > 0 &&
      formValues.selectableLayers);

  }

  // ******** Spatial configuration ******** //
  getAllSpatialConfigurations = (): Observable<any> => {

    if (this.entityID == -1 && this.duplicateID == -1) {
      const aux: any[] = [];
      return of(aux);
    }
    let urlReq = `${this.entityToEdit._links.spatialSelectionParameters.href}`;
    if (this.entityToEdit._links.spatialSelectionParameters.templated) {
      const url = new URL(urlReq.split('{')[0]);
      url.searchParams.append('projection', 'view');
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['cartography-spatial-selection-parameters'] //.filter(elem => elem.type == "EDIT")
      ));

  };




  // ******** Spatial Selection Dialog  ******** //


  openSpatialSelectionDialog(data: any) {

    this.parameterForm.patchValue({
      format: this.parameterFormatTypes[0].value
    });

    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived = this.newSpatialConfigurationDialog;
    dialogRef.componentInstance.title = this.utils.getTranslate('entity.cartography.spatialSelection.parameters.title');
    dialogRef.componentInstance.form = this.parameterForm;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          const item = this.parameterForm.value;
          this.addElementsEventSpatialConfigurations.next([item]);

        }
      }
      this.parameterForm.reset();
    });


  }

*/
