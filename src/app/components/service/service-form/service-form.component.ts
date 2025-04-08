import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
  Cartography,
  CartographyProjection,
  CartographyService,
  CartographyStyle,
  CartographyStyleService,
  CodeListService,
  Service,
  ServiceParameter,
  ServiceParameterService,
  ServiceService,
  TranslationService,
} from '@app/domain';
import {UtilsService} from '@app/services/utils.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {map} from 'rxjs/operators';
import {firstValueFrom, of} from 'rxjs';
import {MatChipInputEvent} from '@angular/material/chips';
import {config} from '@config';
import {
  DialogMessageComponent,
  onCreate,
  onDelete,
  onNotAvailable,
  onPendingRegistration,
  onUpdate,
  Status
} from '@app/frontend-gui/src/lib/public_api';
import {MatDialog} from '@angular/material/dialog';
import {constants} from '@environments/constants';
import {LoggerService} from '@app/services/logger.service';
import {TranslateService} from "@ngx-translate/core";
import {sitmunMixedBase} from "@app/components/sitmun-base.component";
import {ErrorHandlerService} from "@app/services/error-handler.service";
import {DataTableDefinition, TemplateDialog} from "@app/components/data-tables.util";
import {
  WMSCapabilitiesService,
  WMSLayersCapabilities
} from "@app/services/wms-capabilities.service";

/**
 * Component for managing service forms in the application.
 * Extends SitmunMixedBase to provide base functionality for service management.
 *
 * This component provides a comprehensive interface for:
 * 1. Service Management
 *    - Creating new services
 *    - Editing existing services
 *    - Duplicating services with modified attributes
 *    - Form validation and submission
 *
 * 2. Service Configuration
 *    - Basic service information (name, description, URL)
 *    - Authentication settings (mode, credentials)
 *    - Service type configuration (WMS, etc.)
 *    - Proxy settings
 *    - Projection management (SRS)
 *
 * 3. WMS Integration
 *    - Automatic metadata retrieval from WMS GetCapabilities
 *    - Layer discovery and management
 *    - Style configuration
 *    - Projection support detection
 *
 * 4. Parameter Management
 *    - CRUD operations for service parameters
 *    - Parameter type configuration
 *    - Value validation
 *
 * 5. Cartography Integration
 *    - Layer management and configuration
 *    - Style association
 *    - Legend configuration
 *    - Metadata URL management
 *
 * The component uses a tabbed interface to organize:
 * - General Data: Basic service configuration
 * - Parameters: Service parameter management
 * - Cartographies: Layer and style management
 *
 * Key Features:
 * - Multi-language support through translations
 * - Real-time form validation
 * - Automatic WMS capabilities integration
 * - Grid-based parameter and layer management
 * - Support for various service types and authentication modes
 *
 * @example
 * // Route configuration
 * { path: 'service/:id/serviceForm', component: ServiceFormComponent }
 * { path: 'service/:id/serviceForm/:idDuplicate', component: ServiceFormComponent }
 */
@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styles: []
})
export class ServiceFormComponent extends sitmunMixedBase<Service>() implements OnInit, OnDestroy {

  /**
   * Flag indicating if the WMS capabilities table load button is disabled.
   * True when service type is not WMS, false otherwise.
   * Used to control the visibility of WMS-specific functionality.
   */
  private tableLoadButtonDisabled = true;

  /**
   * Flag indicating if projections can be removed from the service.
   * Always true as projections are user-manageable.
   * Controls the display of remove buttons in projection chips.
   */
  private readonly canRemoveProjections = true;

  /**
   * Flag indicating if projections should be added when input loses focus.
   * Always true to support both manual entry and chip-based input.
   * Enhances user experience by allowing flexible input methods.
   */
  private readonly addProjectionsOnBlur = true;

  /**
   * Array of key codes that trigger projection separation in the input.
   * Includes ENTER and COMMA for flexible input options.
   * Allows users to add projections using keyboard shortcuts.
   */
  private readonly separatorKeysCodesForProjections: number[] = [ENTER, COMMA];

  /**
   * Stores the WMS layers capabilities data retrieved from the service.
   * Contains layer information, styles, and other metadata for WMS services.
   * Used to populate the layers data table and synchronize with the backend.
   */
  private wmsLayersCapabilities: WMSLayersCapabilities = new WMSLayersCapabilities();

  /**
   * Data table configuration for managing service layers.
   * Handles WMS layer configurations and capabilities.
   */
  private readonly layersTable: DataTableDefinition<CartographyProjection, CartographyProjection>;

  /**
   * Data table configuration for managing service parameters.
   * Handles parameter CRUD operations and validation.
   */
  private readonly parametersTable: DataTableDefinition<ServiceParameter, ServiceParameter>;

  /**
   * Reference to the parameter dialog template.
   * Used when opening the dialog for adding new parameters.
   * Provides a user-friendly interface for parameter creation.
   */
  @ViewChild('newParameterDialog', {static: true})
  private newParameterDialog: TemplateRef<any>;

  /**
   * Creates an instance of ServiceFormComponent.
   * @param dialog - Service for managing Material dialogs
   * @param translateService - Service for translation functionality
   * @param translationService - Service for entity translation management
   * @param codeListService - Service for managing code lists
   * @param errorHandler - Service for error handling and display
   * @param activatedRoute - Service for accessing route parameters
   * @param router - Angular router service for navigation
   * @param utils - Utility service for common functions
   * @param cartographyService - Service for managing cartography entities
   * @param serviceParameterService - Service for managing service parameters
   * @param cartographyStyleService - Service for managing cartography styles
   * @param wmsCapabilitiesService - Service for retrieving WMS capabilities
   * @param loggerService - Service for logging
   * @param serviceService - Service for managing service entities
   */
  constructor(
    protected override dialog: MatDialog,
    protected override translateService: TranslateService,
    protected override translationService: TranslationService,
    protected override codeListService: CodeListService,
    protected override errorHandler: ErrorHandlerService,
    protected override activatedRoute: ActivatedRoute,
    protected override router: Router,
    public utils: UtilsService,
    public cartographyService: CartographyService,
    public serviceParameterService: ServiceParameterService,
    public cartographyStyleService: CartographyStyleService,
    public wmsCapabilitiesService: WMSCapabilitiesService,
    private loggerService: LoggerService,
    private serviceService: ServiceService,
  ) {
    super(translateService, translationService, errorHandler, activatedRoute, router);
    this.layersTable = this.defineLayersTable();
    this.parametersTable = this.defineParametersTable();
  }

  /**
   * Lifecycle hook called after entity data is fetched.
   * Sets up form change subscriptions to track modifications.
   */
  override afterFetch() {
    this.subscribeToFormChanges(this.entityForm)
  }

  /**
   * Lifecycle hook called after the entity is successfully saved.
   * Resets the form to a clean state with the current values.
   */
  override afterSave() {
    this.resetToFormModifiedState(this.entityForm);
  }

  /**
   * Prepares component data before fetching the entity.
   * Initializes translations, registers data tables, and loads code lists.
   *
   * @returns Promise that resolves when initialization is complete
   */
  override async preFetchData() {
    this.dataTables.register(this.layersTable).register(this.parametersTable);
    this.initTranslations('Service', ['description', 'name'])
    await this.initCodeLists(['service.type', 'service.authenticationMode', 'serviceParameter.type'])
  }

  /**
   * Fetches the original entity by ID for editing.
   *
   * @returns Promise resolving to the service entity
   */
  override async fetchOriginal(): Promise<Service> {
    return firstValueFrom(this.serviceService.get(this.entityID));
  }

  /**
   * Creates a copy of an existing entity for duplication.
   * Prefixes the name with "copy_" to distinguish it from the original.
   *
   * @returns Promise resolving to the duplicated service entity
   */
  override async fetchCopy(): Promise<Service> {
    return firstValueFrom(this.serviceService.get(this.duplicateID).pipe(map((copy: Service) => {
      copy.name = this.translateService.instant("copy_") + copy.name;
      return copy;
    })));
  }

  /**
   * Creates an empty service entity with default values.
   * Sets default authentication mode from code list.
   *
   * @returns New empty service entity
   */
  override empty(): Service {
    return Object.assign(new Service(), {
      authenticationMode: this.firstInCodeList('service.authenticationMode').value,
    })
  }

  /**
   * Fetches related data for the service entity.
   * Loads translations for the current entity.
   *
   * @returns Promise that resolves when related data is loaded
   */
  override async fetchRelatedData(): Promise<void> {
    await this.loadTranslations(this.entityToEdit)
  }

  /**
   * Initializes the form after entity data is fetched.
   * Sets up reactive form with entity values and validation rules.
   * Configures the table load button state based on service type.
   *
   * @throws Error if entity is undefined
   */
  override postFetchData() {
    if (!this.entityToEdit) {
      throw new Error('Cannot initialize form: entity is undefined');
    }

    this.entityForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.entityToEdit.name, [Validators.required, Validators.maxLength(60)]),
      user: new UntypedFormControl(this.entityToEdit.user),
      password: new UntypedFormControl(this.entityToEdit.password),
      authenticationMode: new UntypedFormControl(this.entityToEdit.authenticationMode, [Validators.required]),
      description: new UntypedFormControl(this.entityToEdit.description, [Validators.required, Validators.maxLength(4000)]),
      type: new UntypedFormControl(this.entityToEdit.type, [
        Validators.required,
      ]),
      serviceURL: new UntypedFormControl(this.entityToEdit.serviceURL, [
        Validators.required,
      ]),
      proxyUrl: new UntypedFormControl(this.entityToEdit.proxyUrl,),
      supportedSRS: new UntypedFormControl(this.entityToEdit.supportedSRS),
      getInformationURL: new UntypedFormControl(this.entityToEdit.getInformationURL,),
      blocked: new UntypedFormControl(this.entityToEdit.blocked, []),
      isProxied: new UntypedFormControl(this.entityToEdit.isProxied, []),
    });

    const currentType = this.findInCodeList('service.type', this.entityToEdit.type);
    this.tableLoadButtonDisabled = currentType ? currentType.value !== config.capabilitiesRequest.WMSIdentificator : false;
  }

  /**
   * Creates a Service object from the current form values.
   *
   * @param id - Optional ID for the new object, used when updating
   * @returns New Service instance populated with form values
   */
  createObject(id: number = null): Service {
    let safeToEdit = Service.fromObject(this.entityToEdit);
    safeToEdit = Object.assign(safeToEdit,
      this.entityForm.value,
      {
        id: id,
      });
    return safeToEdit;
  }

  /**
   * Creates a new service entity in the database.
   *
   * @returns Promise resolving to the ID of the created entity
   */
  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const entityCreated = await firstValueFrom(this.serviceService.create(entityToCreate));
    return entityCreated.id;
  }

  /**
   * Updates an existing service entity with form values.
   *
   * @returns Promise that resolves when the update is complete
   */
  override async updateEntity() {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.serviceService.update(entityToUpdate));
  }

  /**
   * Updates related data after the main entity is saved.
   * Saves translations for the service entity.
   *
   * @param isDuplicated - Whether this is a duplication operation
   * @returns Promise that resolves when all related updates are complete
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override async updateDataRelated(isDuplicated: boolean): Promise<void> {
    const entityToUpdate = this.createObject(this.entityID);
    await this.saveTranslations(entityToUpdate);
  }

  /**
   * Validates if the form can be saved.
   *
   * @returns True if the form is valid, false otherwise
   */
  override canSave(): boolean {
    return this.entityForm.valid
  }

  /**
   * Appends the new projection to the existing list of supported SRS values.
   *
   * @param event - The chip input event containing the new projection value
   */
  addProjection(event: MatChipInputEvent): void {
    const value = event.value;
    if ((value || '').trim()) {
      const srs = this.entityForm.get('supportedSRS').value;
      const newSrs = [...srs]
      newSrs.push(value.trim());
      this.entityForm.get('supportedSRS').setValue(newSrs)
    }
  }

  /**
   * Filters out the specified projection from the list of supported SRS values.
   *
   * @param projection - The projection string to remove
   */
  removeProjection(projection: string): void {
    const srs = this.entityForm.get('supportedSRS').value;
    const index = srs.indexOf(projection);
    if (index >= 0) {
      const newSrs = [...srs]
      newSrs.splice(index, 1);
      this.entityForm.get('supportedSRS').setValue(newSrs)
    }
  }

  /**
   * Used to show/hide credential fields based on authentication mode.
   *
   * @returns True if authentication mode requires credentials, false otherwise
   */
  isAuthenticationModeNode(): boolean {
    return this.entityForm.get('authenticationMode').value !== constants.codeValue.serviceAuthenticationMode.none;
  }

  /**
   * Used to enable/disable WMS-specific functionality.
   *
   * @returns True if service type is WMS, false otherwise
   */
  isWMS() {
    return this.entityForm?.value.type === constants.codeValue.serviceType.wms
  }

  /**
   * Enables/disables capabilities button based on service type.
   *
   * @param event - The change event containing the new service type value
   */
  onTypeChange(event: { value: string; }): void {
    this.tableLoadButtonDisabled = event.value != config.capabilitiesRequest.WMSIdentificator;
  }

  /**
   * Creates a duplicate of the selected parameters with modified names.
   * Each duplicated parameter will have:
   * - A new ID (undefined)
   * - No links (_links: undefined)
   * - A name prefixed with the translation of 'copy_'
   *
   * @param {ServiceParameter[]} parameters - Array of parameters to duplicate
   * @throws Error as this method is not yet implemented
   */
  duplicateParameters(parameters: ServiceParameter[]) {
    throw new Error("Not implemented")
    //this.duplicate(ServiceParameter, parameters, this.addElementsEventParameters);
  }

  /**
   * Updates service metadata from WMS capabilities.
   * Opens a confirmation dialog before retrieving metadata.
   * Updates name, description, and supported projections after confirmation.
   */
  onUpdateServiceMetadata() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('caution');
    dialogRef.componentInstance.message = this.utils.getTranslate('getCapabilitiesMessage');
    dialogRef.afterClosed().subscribe(next => {
      if (next?.event === 'Accept') {
        if (this.entityForm.get('type').value === constants.codeValue.serviceType.wms) {
          this.wmsCapabilitiesService.processWMSServiceMetadata(this.entityForm.value.serviceURL)
            .then((capabilities) => {
              this.entityForm.patchValue({
                name: capabilities.title?.substring(0, 60),
                description: capabilities.abstract?.substring(0, 4000),
                supportedSRS: capabilities.supportedSRS
              });
            })
            .catch((reason) => this.errorHandler.handleError(reason, `Error in GetCapabilities: ${reason}`));
        }
      }
    });
  }

  /**
   * Updates the service layers from WMS capabilities.
   * Opens a confirmation dialog before retrieving layer information.
   * Refreshes the layers table with the retrieved capabilities data.
   */
  onUpdateServiceCapabilities() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('caution');
    dialogRef.componentInstance.message = this.utils.getTranslate('getCapabilitiesMessage');
    dialogRef.afterClosed().subscribe(next => {
      if (next?.event === 'Accept') {
        if (this.entityForm.get('type').value === constants.codeValue.serviceType.wms) {
          this.wmsCapabilitiesService.processWMSServiceCapabilities(this.entityForm.value.serviceURL)
            .then((response: WMSLayersCapabilities) => {
              this.wmsLayersCapabilities = response
              this.layersTable.saveCommandEvent$.next("save")
            })
            .catch((reason) => this.errorHandler.handleError(reason, `Error in GetCapabilities: ${reason}`));
        }
      }
    });
  }

  /**
   * Defines the data table configuration for managing layers.
   * Sets up columns, data fetching, updating logic, and synchronization with WMS capabilities.
   *
   * @returns Configured data table definition for layers
   */
  private defineLayersTable(): DataTableDefinition<CartographyProjection, CartographyProjection> {
    return DataTableDefinition.builder<CartographyProjection, CartographyProjection>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getEditableColumnDef('serviceEntity.name', 'name', 150, 300),
        this.utils.getNonEditableColumnDef('layersEntity.layers', 'layers', 150, 300),
        this.utils.getEditableColumnDef('serviceEntity.description', 'description', 150, 450),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.wmsLayersCapabilities?.layers?.length === 0) {
          if (this.isNewOrDuplicated()) {
            return of([]);
          } else {
            return this.entityToEdit.getRelationArrayEx(CartographyProjection, 'layers', {projection: 'view'});
          }
        } else if (this.isNewOrDuplicated()) {
          // For new services, just return capabilities layers as unregistered
          return of(this.wmsLayersCapabilities.layers.map(capabilityLayer =>
            Object.assign(new CartographyProjection(), capabilityLayer, {
              status: 'unregisteredLayer',
              newItem: true
            }) as CartographyProjection & Status
          ));
        } else {
          return this.entityToEdit.getRelationArrayEx(CartographyProjection, 'layers', {projection: 'view'})
            .pipe(map((currentLayers: (CartographyProjection & Status)[]) => {
              const finalCartographies: (CartographyProjection & Status)[] = [];
              const serviceLayers = new Set<string>();
              this.wmsLayersCapabilities.layers.forEach(capabilityLayer => {
                const layerName = capabilityLayer.layers[0];
                serviceLayers.add(layerName);

                const matchingLayers = currentLayers.some(layer =>
                  layer.layers.length == 1 && layer.layers.includes(layerName));
                if (!matchingLayers) {
                  // Layer from capabilities not found in current layers - mark as unregistered
                  const newLayer = Object.assign(new CartographyProjection(), capabilityLayer, {
                    status: 'unregisteredLayer',
                    newItem: true
                  }) as CartographyProjection & Status;
                  finalCartographies.push(newLayer);
                }
              });

              // Add any remaining layers that weren't found in capabilities as not available
              currentLayers.forEach(layer => {
                const allAvailable = layer.layers.every(layer => serviceLayers.has(layer))
                if (allAvailable) {
                  finalCartographies.push(layer)
                } else {
                  const unavailableLayer = Object.assign(new CartographyProjection(), layer, {
                    status: 'notAvailable'
                  }) as CartographyProjection & Status;
                  finalCartographies.push(unavailableLayer);
                }
              });
              return finalCartographies;
            }));
        }
      })
      .withRelationsUpdater(async (cartographies: (CartographyProjection & Status)[]) => {
        await onNotAvailable(cartographies).forEach(item => {
          item.blocked = true;
          return this.cartographyService.update(Cartography.fromObject(item))
        })
        const newCartographies = await onPendingRegistration(cartographies).forEach(item => {
          const newItem = Cartography.fromObject(item);
          newItem.service = this.entityToEdit;
          newItem.blocked = false;
          newItem.queryableFeatureAvailable = false;
          newItem.queryableFeatureEnabled = false;
          return this.cartographyService.create(newItem);
        }) as Cartography[];
        await Promise.all(newCartographies.flatMap(cartography => {
          if (this.wmsLayersCapabilities.styles.has(cartography.layers[0])) {
            const styles = this.wmsLayersCapabilities.styles.get(cartography.layers[0]);
            return styles.map(style => {
              const newStyle = Object.assign(new CartographyStyle(), style);
              newStyle.cartography = cartography;
              return newStyle;
            });
          } else {
            return []
          }
        }).map(async item => {
          const style = await firstValueFrom(this.cartographyStyleService.create(item))
          style.updateRelationEx("cartography", item.cartography)
        }))
        await onUpdate(cartographies).forEach(item => this.cartographyService.update(Cartography.fromObject(item)));
        await onDelete(cartographies).forEach(item => this.cartographyService.delete(Cartography.fromObject(item)));
      })
      .build();
  }

  /**
   * Defines the data table configuration for managing service parameters.
   * Sets up columns, data fetching, updating logic, and dialog templates.
   *
   * @returns Configured data table definition for parameters
   */
  private defineParametersTable(): DataTableDefinition<ServiceParameter, ServiceParameter> {
    return DataTableDefinition.builder<ServiceParameter, ServiceParameter>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getEditableColumnDef('serviceEntity.parameter', 'name', 150, 300),
        this.utils.getEditableColumnDef('serviceEntity.value', 'value', 150, 300),
        this.utils.getNonEditableColumnDef('serviceEntity.type', 'typeDescription', 150, 300),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isEdition()) {
          return this.entityToEdit.getRelationArrayEx(ServiceParameter, 'parameters')
            .pipe(map(data => data.map(element => Object.assign(new ServiceParameter(), {
              ...element,
              typeDescription: this.findInCodeList('serviceParameter.type', element.type)?.description
            }))))
        } else {
          return of([]);
        }
      })
      .withRelationsUpdater(async (parameters: (ServiceParameter & Status)[]) => {
        await onCreate(parameters).forEach(item => this.serviceParameterService.create(Object.assign(new ServiceParameter(), {
          ...item,
          service: this.entityToEdit
        })))
        await onUpdate(parameters).forEach(item => this.serviceParameterService.update(Object.assign(new ServiceParameter(), {
          ...item,
          service: this.entityToEdit
        })))
        await onDelete(parameters).forEach(item => this.serviceParameterService.delete(item))
      })
      .withTemplateDialog('newParameterDialog', () => TemplateDialog.builder()
        .withReference(this.newParameterDialog)
        .withTitle(this.translateService.instant('serviceEntity.newParameter'))
        .withForm(
          new UntypedFormGroup({
            name: new UntypedFormControl('', [Validators.required,]),
            type: new UntypedFormControl('', [Validators.required,]),
            value: new UntypedFormControl(''),
          })
        ).withPreOpenFunction((form: UntypedFormGroup) => {
          form.reset({type: this.firstInCodeList('serviceParameter.type').value});
        }).build())
      .build();
  }
}
