import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {
  Application,
  CapabilitiesService,
  Cartography,
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
import {firstValueFrom, Observable, of, Subject} from 'rxjs';
import {MatChipInputEvent} from '@angular/material/chips';
import {config} from '@config';
import {
  DIALOG_FORM_EVENTS,
  DialogFormComponent,
  DialogFormData,
  DialogFormResult,
  DialogMessageComponent,
  GridEvent,
  isSave,
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
import {codeListMixin} from "@app/mixins/codelist.mixin";
import {PropertyTranslations, translatableMixin} from "@app/mixins/translatable.mixin";
import {activeTabMixin} from "@app/mixins/activetab.mixin";
import {TranslateService} from "@ngx-translate/core";
import {sitmunMixedBase} from "@app/components/sitmun.base";
import {detectchangeMixin} from "@app/mixins/detectchange.mixin";

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
  public override entityForm: UntypedFormGroup;

  /**
   * Creates an instance of ServiceFormComponent.
   * @param activatedRoute - Service for accessing route parameters
   * @param serviceService - Service for managing service entities
   * @param translationService - Service for handling translations
   * @param utils - Utility service for common functions
   * @param dialog - Service for managing Material dialogs
   * @param cartographyService - Service for managing cartography entities
   * @param serviceParameterService - Service for managing service parameters
   * @param cartographyStyleService - Service for managing cartography styles
   * @param capabilitiesService - Service for retrieving WMS capabilities
   * @param loggerService - Service for logging
   * @param codeListService - Service for managing code lists
   * @param translateService - Service for translation functionality
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private serviceService: ServiceService,
    protected override translationService: TranslationService,
    public utils: UtilsService,
    public override dialog: MatDialog,
    public cartographyService: CartographyService,
    public serviceParameterService: ServiceParameterService,
    public cartographyStyleService: CartographyStyleService,
    public capabilitiesService: CapabilitiesService,
    private loggerService: LoggerService,
    protected override codeListService: CodeListService,
    translateService: TranslateService,
  ) {
    super(translateService)
  }

  /**
   * Initializes the component.
   * Sets up translations, forms, and loads initial data.
   *
   * Initialization sequence:
   * 1. Sets up translations for 'Service' entity
   * 2. Initializes the main form
   * 3. Sets up cartographies tab
   * 4. Initializes parameters tab
   * 5. Fetches and loads service data
   */
  ngOnInit(): void {
    this.initTranslations(
      'Service',
      ['description', 'name']
    )

    this.ngInitMainForm()
    this.ngInitCartographiesTab()
    this.ngOnInitParametersTab()
    this.fetchData().then(() => this.subscribeToFormChanges(this.entityForm)).catch((reason) => this.loggerService.error('Error in ngOnInit:', reason));
  }

  // ==================================================
  //                 Load Service
  // ==================================================

  /**
   * Fetches and loads service data based on route parameters.
   * Handles both new service creation and editing/duplicating existing services.
   *
   * Data loading process:
   * 1. Initializes code lists for service types and parameters
   * 2. Retrieves service ID from route parameters
   * 3. For existing services:
   *    - Loads service data and projections
   *    - Sets up form with service data
   *    - Loads translations if in edit mode
   * 4. For new services:
   *    - Initializes with default values
   *
   * @throws {Error} When there's an error loading service data
   */
  async fetchData() {
    await this.initCodeLists(['service.type', 'service.authenticationMode', 'serviceParameter.type'])

    const params = await firstValueFrom(this.activatedRoute.params)

    this.entityID = params.id;

    if (params.idDuplicate) {
      this.duplicateID = params.idDuplicate;
    }

    if (!this.isNew()) {
      const idToGet = this.isEdition() ? this.entityID : this.duplicateID;

      this.entityToEdit = await firstValueFrom(this.serviceService.get(idToGet))

      const formData: Record<string, any> = {
        type: this.entityToEdit.type,
        description: this.entityToEdit.description,
        proxyUrl: this.entityToEdit.proxyUrl,
        blocked: this.entityToEdit.blocked,
        serviceURL: this.entityToEdit.serviceURL,
        getInformationURL: this.entityToEdit.getInformationURL,
        user: this.entityToEdit.user,
        password: this.entityToEdit.password,
        authenticationMode: this.entityToEdit.authenticationMode,
        isProxied: this.entityToEdit.isProxied,
        supportedSRS: this.entityToEdit.supportedSRS,
        name: this.isEdition()
          ? this.entityToEdit.name
          : this.translateService.instant('copy_').concat(this.entityToEdit.name),
        _links: this.entityToEdit._links,
      }

      if (this.isEdition()) {
        formData.id = this.entityID
        await this.loadTranslations(this.entityToEdit)
      }

      this.entityForm.patchValue(formData);
      const currentType = this.findInCodeList('service.type', this.entityToEdit.type);
      this.tableLoadButtonDisabled = currentType ? currentType.value !== config.capabilitiesRequest.WMSIdentificator : false;

      this.loggerService.debug('Service to edit loaded', {
        entityToEdit: this.entityToEdit,
        type: this.entityToEdit.constructor.name
      });
    } else {
      const formData: Record<string, any> = {
        blocked: false,
        isProxied: false,
        type: null,
        authenticationMode: this.firstInCodeList('service.authenticationMode').value,
      }
      this.entityForm.patchValue(formData);
    }
    this.dataLoaded = true;
  }

  // ==================================================
  //                 Save Application
  // ==================================================

  /**
   * Subject for triggering retrieval of all parameter elements.
   * Used to notify when parameters need to be refreshed or reloaded.
   */
  getAllElementsEventParameters: Subject<string> = new Subject<string>();

  /**
   * Subject for triggering retrieval of all layer elements.
   * Used to notify when layers need to be refreshed or reloaded.
   */
  getAllElementsEventLayers: Subject<string> = new Subject<string>();

  /**
   * Array of all subjects used in the component for cleanup.
   * These subjects must be completed in ngOnDestroy to prevent memory leaks.
   */
  readonly subjects = [
    this.getAllElementsEventLayers,
    this.getAllElementsEventParameters
  ]


  onSaveButtonClicked() {
    if (this.entityForm.valid) {
      this.saveService().catch((reason) => this.loggerService.error('Error in onSaveButtonClicked:', reason));
    } else {
      this.utils.showRequiredFieldsError();
    }
  }

  /**
   * Saves the service data to the backend.
   * Handles both creation of new services and updates to existing ones.
   *
   * Save process:
   * 1. Creates a new Service instance with form values
   * 2. Handles special cases (e.g., supported SRS)
   * 3. Creates new service or updates existing one
   * 4. Updates translations
   * 5. Triggers refresh of related components
   *
   * @throws {Error} When there's an error saving the service
   */
  async saveService() {
    try {
      // Copy form values to service object
      const service: Service = Object.assign(new Service(), this.entityForm.value);

      // Set ID based on application state
      let response: Service | Observable<never>;
      if (this.isNewOrDuplicated()) {
        service.id = null;
        response = await firstValueFrom(this.serviceService.create(service));
      } else {
        response = await firstValueFrom(this.serviceService.update(service));
      }

      if (response instanceof Service) {
        this.entityToEdit = response;
        this.entityID = response.id;
        this.entityForm.patchValue({
          id: response.id,
          _links: response._links
        });
        await this.saveTranslations(this.entityToEdit);
        this.subjects.forEach(subject => subject.next('save'));
        this.resetToFormModifiedState(this.entityForm);
      }
    } catch (error) {
      this.loggerService.error('Error saving application:', error);
      throw error;
    }
  }

  // ==================================================
  //                    Main form
  // ==================================================

  /**
   * Main form configuration and management section.
   * Handles the primary service configuration interface including:
   *
   * Form Controls:
   * - id: Service identifier (auto-generated)
   * - name: Service name (required, max 60 chars)
   * - description: Service description (required, max 250 chars)
   * - type: Service type (required, e.g., WMS)
   * - serviceURL: Endpoint URL (required)
   * - proxyUrl: Optional proxy configuration
   * - supportedSRS: Coordinate reference systems
   * - getInformationURL: Metadata URL
   * - authenticationMode: Authentication type (required)
   * - user/password: Credentials (conditional)
   * - blocked: Service availability flag
   * - isProxied: Proxy usage flag
   *
   * Features:
   * - Real-time validation
   * - Dynamic field visibility based on service type
   * - Projection management through chip input
   * - WMS capabilities integration
   * - Multi-language support for name/description
   */

  /**
   * Flag indicating if the WMS capabilities table load button is disabled.
   * True when service type is not WMS, false otherwise.
   * Used to control the visibility of WMS-specific functionality.
   */
  tableLoadButtonDisabled = true;

  /**
   * Flag indicating if projections can be removed from the service.
   * Always true as projections are user-manageable.
   * Controls the display of remove buttons in projection chips.
   */
  readonly canRemoveProjections = true;

  /**
   * Flag indicating if projections should be added when input loses focus.
   * Always true to support both manual entry and chip-based input.
   * Enhances user experience by allowing flexible input methods.
   */
  readonly addProjectionsOnBlur = true;

  /**
   * Array of key codes that trigger projection separation in the input.
   * Includes ENTER and COMMA for flexible input options.
   * Allows users to add projections using keyboard shortcuts.
   */
  readonly separatorKeysCodesForProjections: number[] = [ENTER, COMMA];

  ngInitMainForm(): void {
    this.entityForm = new UntypedFormGroup({
      id: new UntypedFormControl(null, []),
      name: new UntypedFormControl(null, [Validators.required,]),
      user: new UntypedFormControl(null),
      password: new UntypedFormControl(null),
      authenticationMode: new UntypedFormControl(null, [Validators.required]),
      description: new UntypedFormControl(null, [Validators.required]),
      type: new UntypedFormControl(null, [
        Validators.required,
      ]),
      serviceURL: new UntypedFormControl(null, [
        Validators.required,
      ]),
      proxyUrl: new UntypedFormControl(null,),
      supportedSRS: new UntypedFormControl(null),
      getInformationURL: new UntypedFormControl(null,),
      _links: new UntypedFormControl(null, []),
      blocked: new UntypedFormControl(null, []),
      isProxied: new UntypedFormControl(null, []),
    });

  }

  /**
   * Adds a new projection to the service.
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
   * Removes a projection from the service.
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
   * Checks if the current authentication mode is not 'none'.
   * @returns True if authentication mode requires credentials, false otherwise
   */
  isAuthenticationModeNode(): boolean {
    return this.entityForm.get('authenticationMode').value !== constants.codeValue.serviceAuthenticationMode.none;
  }

  /**
   * Checks if the service type is WMS.
   * @returns True if service type is WMS, false otherwise
   */
  isWMS() {
    return this.entityForm.value.type === constants.codeValue.serviceType.wms
  }

  /**
   * Handles service type changes and updates UI state accordingly.
   * @param event - The change event containing the new service type value
   */
  onTypeChange(event: { value: string; }): void {
    this.tableLoadButtonDisabled = event.value != config.capabilitiesRequest.WMSIdentificator;
  }

  // ==================================================
  //                   Cartographies
  // ==================================================

  /**
   * Column definitions for the layers grid.
   * Includes columns for selection, name, layers, description, and status.
   */
  columnDefsLayers: any[];

  /**
   * Subject for adding new elements to the layers grid.
   * Emits arrays of new layer entries to be added to the grid.
   */
  addElementsEventLayers: Subject<any[]> = new Subject<any[]>();

  /**
   * Subject for notifying when layers data has been updated.
   * Triggers grid refresh after layer operations.
   */
  dataUpdatedEventLayers: Subject<boolean> = new Subject<boolean>();

  ngInitCartographiesTab() {
    this.columnDefsLayers = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getEditableColumnDef('serviceEntity.name', 'name', 150, 300),
      this.utils.getNonEditableColumnDef('layersEntity.layers', 'layers', 150, 300),
      this.utils.getEditableColumnDef('serviceEntity.description', 'description', 150, 450),
      this.utils.getStatusColumnDef()
    ];
  }

  /**
   * Fetches cartographies for the service.
   * @returns An Observable of cartography data
   */
  fetchCartographies = (): Observable<any> => {
    if (this.getCapabilitiesLayers.length <= 0) {
      if (this.isEdition()) {
        return this.entityToEdit.getRelationArrayEx(Cartography, 'layers', {projection: 'view'})
      } else {
        return of([]);
      }
    }
    if (this.isEdition()) {
      return this.entityToEdit.getRelationArrayEx(Cartography, 'layers', {projection: 'view'})
        .pipe(map(data => {
          const finalCartographies = [];
          const cartographies = data as (Cartography & Status & {
            alreadySearched: boolean
          })[];
          this.getCapabilitiesLayers.forEach(capabilityLayer => {
            const index = cartographies.findIndex(element => this.normalize(element.layers) === this.normalize(capabilityLayer.layers) && !element.alreadySearched);
            if (index != -1) {
              if (cartographies[index].blocked) {
                cartographies[index].status = 'notAvailable';
              }
              cartographies[index].alreadySearched = true;
              finalCartographies.push(cartographies[index]);
            } else {
              capabilityLayer.status = 'unregisteredLayer';
              capabilityLayer.newItem = true;
              finalCartographies.push(capabilityLayer);
            }
          });
          cartographies.forEach(cartography => {
            if (!cartography.alreadySearched) {
              cartography.status = 'notAvailable';
              finalCartographies.push(cartography);
            }
          });
          return finalCartographies;
        }));
    } else {
      const finalCartographies = [];
      this.getCapabilitiesLayers.forEach(capabilityLayer => {
        capabilityLayer.status = 'unregisteredLayer';
        finalCartographies.push(capabilityLayer);
      });
      return of(finalCartographies);
    }
  };

  /**
   * Normalizes a value by joining array elements or returning the value as is.
   * @param value - The value to normalize
   * @returns The normalized string value
   */
  normalize(value: string | string[]) {
    if (Array.isArray(value)) {
      return value.join();
    }
    return value
  }

  /**
   * Handles events from the cartographies grid.
   * @param event - The grid event containing cartography data and type
   */
  handleCartographiesEvent(event: GridEvent<Cartography & Status>) {
    if (isSave(event)) {
      this.updateCartographies(event.data).catch((reason) => this.loggerService.error('Error in handleCartographiesEvent:', reason));
    }
  }

  /**
   * Updates cartographies in the backend.
   * Handles creation, updates, and deletions of cartography entries.
   *
   * Process flow:
   * 1. Updates blocked status for unavailable cartographies
   * 2. Creates new cartographies with service association
   * 3. Creates associated styles for new cartographies
   * 4. Updates existing cartographies
   * 5. Deletes marked cartographies
   * 6. Triggers grid refresh
   *
   * @param cartographies - Array of cartographies with their current status
   * @throws {Error} When there's an error in cartography operations
   */
  async updateCartographies(cartographies: (Cartography & Status)[]) {
    await onNotAvailable(cartographies).forEach(item => {
      item.blocked = true;
      return this.cartographyService.update(item)
    })
    const newCartographies = await onPendingRegistration(cartographies).forEach(item => {
      const newItem = Object.assign(new Cartography(), item);
      newItem.service = this.entityToEdit;
      newItem.blocked = false;
      newItem.queryableFeatureAvailable = false;
      newItem.queryableFeatureEnabled = false;
      delete newItem.styles;
      return this.cartographyService.create(newItem);
    });

    await Promise.all(onPendingRegistration(cartographies).data.flatMap(async (item, index) => {
      const newStyles = Object.assign({}, item.styles) as { [key: number]: any; }
      const observables = [];
      this.identifyDefaultStyle(newStyles);
      for (const property in newStyles) {
        const cartography = newCartographies[index]
        if (cartography instanceof Cartography) {
          const newStyle = this.createStyle(newStyles[property], cartography);
          observables.push(await firstValueFrom(this.cartographyStyleService.create(newStyle)));
        }
      }
      return observables
    }))
    await onUpdate(cartographies).forEach(item => this.cartographyService.update(item));
    await onDelete(cartographies).forEach(item => this.cartographyService.delete(item));
    this.dataUpdatedEventLayers.next(true);
  }

  /**
   * Identifies and sets the default style in a collection of styles.
   * @param styles - Object containing style definitions
   */
  private identifyDefaultStyle(styles: { [key: number]: any; }) {
    let styleByDefaultFound = false;
    for (const property in styles) {
      const style = styles[property];
      if (style.defaultStyle) {
        if (styleByDefaultFound) {
          style.defaultStyle = false;
        } else {
          styleByDefaultFound = true;
        }
      } else {
        style.defaultStyle = false;
      }
    }
    if (!styleByDefaultFound && styles?.[0]) {
      styles[0].defaultStyle = true;
    }
  }

  /**
   * Creates a new CartographyStyle instance from style data.
   * @param style - The style data to transform
   * @param cartography - The associated cartography
   * @returns A new CartographyStyle instance
   */
  private createStyle(style: any, cartography: Cartography): CartographyStyle {
    const newStyle = Object.assign(new CartographyStyle(), style);

    newStyle.cartography = cartography;
    if (style.Name) {
      newStyle.name = style.Name;
    }

    if (style.Abstract) {
      newStyle.description = style.Abstract;
    }

    if (style.Title) {
      newStyle.title = style.Title.substring(0, 50);
    }
    if (style.LegendURL) {
      let onlineResource: any;
      if (style.LegendURL.OnlineResource) {
        if (style.LegendURL.OnlineResource['xlink:href']) {
          onlineResource = style.LegendURL.OnlineResource['xlink:href'];
        } else if (style.LegendURL.OnlineResource['xlink:link']) {
          onlineResource = style.LegendURL.OnlineResource['xlink:link'];
        } else if (style.LegendURL.OnlineResource['xlink:type']) {
          onlineResource = style.LegendURL.OnlineResource['xlink:type'];
        }
      }

      newStyle.legendURL = {
        format: style.LegendURL.Format,
        onlineResource: onlineResource,
        height: style.LegendURL.height,
        width: style.LegendURL.width
      };
    }
    return newStyle;
  }

  // ==================================================
  //                    Parameters
  // ==================================================

  /**
   * Service parameters management section.
   * Provides a grid-based interface for managing service parameters with:
   *
   * Parameter Properties:
   * - name: Parameter identifier (required)
   * - type: Parameter type from predefined list (required)
   * - value: Parameter value
   * - typeDescription: Human-readable type description
   *
   * Features:
   * - CRUD operations through grid interface
   * - Parameter duplication support
   * - Real-time validation
   * - Type-based configuration
   * - Dialog-based parameter creation
   * - Status tracking for changes
   *
   * Grid Functionality:
   * - Inline editing
   * - Multi-select operations
   * - Sort and filter
   * - Change tracking
   * - Undo/redo support
   */

  /**
   * Column definitions for the parameters grid.
   * Configures the display and behavior of the grid columns:
   * - Selection checkbox for multi-select operations
   * - Name (editable) for parameter identification
   * - Value (editable) for parameter configuration
   * - Type description (non-editable) for parameter categorization
   * - Status indicator for tracking changes
   */
  columnDefsParameters: any[];

  /**
   * Subject for adding new parameters to the grid.
   * Emits arrays of parameters to be added to the grid.
   * Used by both the dialog-based creation and duplication features.
   */
  addElementsEventParameters: Subject<ServiceParameter[]> = new Subject<ServiceParameter[]>();

  /**
   * Subject for notifying when parameters data has been updated.
   * Used to trigger grid refresh after data operations.
   * Ensures grid stays in sync with backend state.
   */
  dataUpdatedEventParameters: Subject<boolean> = new Subject<boolean>();

  /**
   * Form group for creating new service parameters.
   * Contains controls for:
   * - name: Parameter identifier (required)
   * - type: Parameter type (required)
   * - value: Parameter value
   */
  public parameterForm: UntypedFormGroup;

  /**
   * Reference to the parameter dialog template.
   * Used when opening the dialog for adding new parameters.
   * Provides a user-friendly interface for parameter creation.
   */
  @ViewChild('newParameterDialog', {static: true}) private newParameterDialog: TemplateRef<any>;

  /**
   * Initializes the parameters tab configuration.
   * Sets up column definitions for the parameters grid and dialog:
   * - Defines editable and non-editable columns for parameters
   * - Creates a form group for adding new parameters
   */
  ngOnInitParametersTab() {
    this.columnDefsParameters = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getEditableColumnDef('serviceEntity.parameter', 'name'),
      this.utils.getEditableColumnDef('serviceEntity.value', 'value'),
      this.utils.getNonEditableColumnDef('serviceEntity.type', 'typeDescription'),
      this.utils.getStatusColumnDef()
    ];
    this.parameterForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required]),
      type: new UntypedFormControl(null, [Validators.required]),
      value: new UntypedFormControl(null, []),
    });
  }

  /**
   * Fetches all parameters associated with the service.
   * If the service is new (not yet saved), returns an empty array.
   * Otherwise, retrieves the parameters through the service's relation array
   * and enriches each parameter with its type description.
   *
   * @returns {Observable<ServiceParameter[]>} An observable containing the service parameters
   * with their type descriptions
   */

  fetchParameters = (): Observable<ServiceParameter[]> => {
    if (this.isNew()) {
      return of([]);
    }
    return this.entityToEdit.getRelationArrayEx(ServiceParameter, 'parameters', {projection: 'view'})
      .pipe(map((data: ServiceParameter[]) =>
        data.map(element => Object.assign(new ServiceParameter(), {
          ...element,
          typeDescription: this.findInCodeList('serviceParameter.type', element.type)?.description
        }))
      ))
  };

  /**
   * Handles events from the parameters grid.
   * When a save event is received, triggers the update of service parameters.
   *
   * @param {GridEvent<ServiceParameter>} event - The grid event containing the event type and data
   */
  handleParametersEvent(event: GridEvent<ServiceParameter>) {
    if (isSave(event)) {
      this.updateParameters(event.data).catch((reason) => this.loggerService.error('Error in handleParametersEvent:', reason));
    }
  }

  /**
   * Updates the service parameters by handling creation, updates, and deletions.
   * This method processes three types of changes:
   * 1. New parameters: Creates new ServiceParameter instances and associates them with the service
   * 2. Updated parameters: Updates existing parameters
   * 3. Deleted parameters: Removes parameters marked for deletion
   *
   * @param {(ServiceParameter & Status)[]} serviceParameters - Array of parameters with their current status
   * @throws Error if any of the parameter operations fail
   */
  async updateParameters(serviceParameters: (ServiceParameter & Status)[]) {
    await onCreate(serviceParameters).forEach(item =>
      this.serviceParameterService.create(Object.assign(new ServiceParameter(), {
        ...item,
        service: this.entityToEdit
      }))
    );
    await onUpdate(serviceParameters).forEach(item => this.serviceParameterService.update(item));
    await onDelete(serviceParameters).forEach(item => this.serviceParameterService.delete(item));
    this.dataUpdatedEventParameters.next(true);
  }

  /**
   * Creates a duplicate of the selected parameters with modified names.
   * Each duplicated parameter will have:
   * - A new ID (undefined)
   * - No links (_links: undefined)
   * - A name prefixed with the translation of 'copy_'
   *
   * @param {ServiceParameter[]} parameters - Array of parameters to duplicate
   */
  duplicateParameters(parameters: ServiceParameter[]) {
    this.duplicate(ServiceParameter, parameters, this.addElementsEventParameters);
  }

  /**
   * Opens a dialog for adding new service parameters.
   * This method:
   * 1. Resets the parameter form with default type value
   * 2. Opens a dialog with the parameter form template
   * 3. Processes the result when dialog is closed
   *
   * When the user confirms by clicking Add, the new parameter is added to the grid
   * through the addElementsEventParameters Subject.
   */
  openParametersDialog() {
    this.parameterForm.reset({type: this.firstInCodeList('serviceParameter.type').value});
    const dialogRef = this.dialog.open<DialogFormComponent, DialogFormData, DialogFormResult>(
      DialogFormComponent, {
        data: {
          HTMLReceived: this.newParameterDialog,
          title: this.translateService.instant('serviceEntity.configurationParameters'),
          form: this.parameterForm
        }
      }
    );
    dialogRef.afterClosed().subscribe(next => {
      if (next === DIALOG_FORM_EVENTS.ADD) {
        this.addElementsEventParameters.next([this.parameterForm.value]);
      }
    });
  }

  // ==================================================
  //             Process WMS Capabilities
  // ==================================================

  /**
   * WMS Capabilities integration section.
   * Handles the retrieval and processing of WMS GetCapabilities responses.
   *
   * Capabilities Processing:
   * 1. Service Metadata
   *    - Service title and abstract
   *    - Supported projections (SRS/CRS)
   *    - Contact information
   *
   * 2. Layer Management
   *    - Layer discovery and hierarchy
   *    - Style configuration
   *    - Legend URLs
   *    - Metadata URLs
   *
   * 3. Integration Features
   *    - Automatic form population
   *    - Layer registration
   *    - Style association
   *    - Multi-language support
   *
   * The capabilities processing is triggered either:
   * - On initial service creation
   * - When updating an existing service
   * - Through manual refresh
   */

  /**
   * Object storing raw WMS capabilities response data.
   * Contains the complete GetCapabilities response including:
   * - Service information
   * - Layer definitions
   * - Style configurations
   * - Supported features
   */
  serviceCapabilitiesData: any = {};

  /**
   * Array of cartography layers extracted from WMS capabilities.
   * Each entry represents a layer with:
   * - Layer name and title
   * - Layer description
   * - Style information
   * - Metadata URLs
   * - Current status (new/existing/modified)
   */
  getCapabilitiesLayers: (Cartography & Status)[] = [];

  onUpdateServiceMetadata() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('caution');
    dialogRef.componentInstance.message = this.utils.getTranslate('getCapabilitiesMessage');
    dialogRef.afterClosed().subscribe(next => {
      if (next?.event === 'Accept') {
        switch (this.entityForm.get('type').value) {
          case constants.codeValue.serviceType.wms:
            this.processWMSServiceMetadata().catch((reason) => this.loggerService.error('Error in onUpdateGeneralServiceData:', reason));
        }
      }
    });
  }

  /**
   * Processes the WMS service capabilities.
   * Retrieves capabilities data and updates the service information.
   */
  async processWMSServiceMetadata() {
    const result = await this.wmsGetCapabilitiesRequest();

    if (result.success) {
      this.getCapabilitiesLayers = [];
      this.serviceCapabilitiesData = result.asJson;
      this.updateName()
      this.updateDescription()
      this.updateSupportedSRS()
    }
  }

  private async wmsGetCapabilitiesRequest() {
    let url: string = this.entityForm.value.serviceURL;
    if (!url.includes(config.capabilitiesRequest.simpleRequest)) {
      if (url[url.length - 1] != '?') {
        url += '?';
      }
      url += config.capabilitiesRequest.requestWithWMS;
    }
    return await firstValueFrom(this.capabilitiesService.getInfo(url)).catch((error) => {
      this.loggerService.error('Error getting capabilities data', error);
      this.utils.showSimpleErrorMessage(error.error.reason);
      return {
        success: false,
        asJson: null
      }
    });
  }

  /**
   * Updates the service title based on WMS capabilities.
   * Sets the name field in the form with the service title.
   */
  updateName() {
    const data = this.serviceCapabilitiesData.WMT_MS_Capabilities != undefined ? this.serviceCapabilitiesData.WMT_MS_Capabilities : this.serviceCapabilitiesData.WMS_Capabilities;
    if (data?.Service?.Title?.length > 0) {
      this.entityForm.patchValue({
        name: data.Service.Title.substring(0, 60),
      });
    }
  }

  updateDescription() {
    const data = this.serviceCapabilitiesData.WMT_MS_Capabilities != undefined ? this.serviceCapabilitiesData.WMT_MS_Capabilities : this.serviceCapabilitiesData.WMS_Capabilities;
    if (data?.Service?.Abstract?.length > 0) {
      const auxDescription = this.extractServiceAbstract(data);
      const newDescription = auxDescription.length > 250 ? auxDescription.substring(0, 250) : auxDescription;
      this.entityForm.patchValue({
        description: newDescription,
      });
    }
  }

  updateSupportedSRS() {
    const data = this.serviceCapabilitiesData.WMT_MS_Capabilities != undefined ? this.serviceCapabilitiesData.WMT_MS_Capabilities : this.serviceCapabilitiesData.WMS_Capabilities;
    if (data?.Capability) {
      this.entityForm.patchValue({
        supportedSRS: this.extractProjections(data),
      })
    }
  }

  /**
   * Handles the data capabilities button click event.
   * Shows confirmation dialog before retrieving capabilities data.
   */
  onUpdateServiceCapabilities() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('caution');
    dialogRef.componentInstance.message = this.utils.getTranslate('getCapabilitiesMessage');
    dialogRef.afterClosed().subscribe(next => {
      if (next?.event === 'Accept') {
        switch (this.entityForm.get('type').value) {
          case constants.codeValue.serviceType.wms:
            this.processWMSServiceCapabilities().catch((reason) => this.loggerService.error('Error in onUpdateGeneralServiceData:', reason));
        }
      }
    });
  }

  /**
   * Retrieves capabilities data from the service URL.
   * Processes WMS GetCapabilities request and updates service information.
   *
   * Process:
   * 1. Constructs proper WMS capabilities URL
   * 2. Makes request to capabilities service
   * 3. On success:
   *    - Clears existing layers
   *    - Updates service capabilities data
   *    - Triggers service data update
   *
   * @param refresh - Whether to refresh the data
   * @throws {Error} When there's an error retrieving capabilities
   */
  async processWMSServiceCapabilities() {
    const result = await this.wmsGetCapabilitiesRequest();

    if (result.success) {
      this.serviceCapabilitiesData = result.asJson;
      this.extractLayers()
    }

  }

  /**
   * Updates service data based on capabilities information.
   * @param refresh - Whether to refresh the data
   */
  extractLayers(): void {
    const data = this.serviceCapabilitiesData.WMT_MS_Capabilities != undefined ? this.serviceCapabilitiesData.WMT_MS_Capabilities : this.serviceCapabilitiesData.WMS_Capabilities;
    if (data?.Capability) {
      const layerCapability = this.getRootLayer(data);
      const layersTable: any[] = [];
      this.flatMapLayers(layerCapability, layersTable);
      this.loggerService.debug('layersTable', {
        rootLayer: layerCapability,
        layersTable: layersTable,
      });
      layersTable.forEach(lyr => {
        let layersLyr: string[];
        const styles: any[] = [];
        if (Array.isArray(lyr.Name)) {
          layersLyr = lyr.Name;
        } else {
          if (!isNaN(lyr.Name)) {
            lyr.Name = lyr.Name.toString();
          }
          if (!lyr.Name) {
            return;
          }
          layersLyr = lyr.Name.split(',');
        }
        const cartography = this.extractCartography(lyr, layersLyr, styles);

        const discard = this.getCapabilitiesLayers.find(
          value => value.layers.length == 1 && value.layers[0] === cartography.layers[0]
        );
        if (!discard) {
          this.getCapabilitiesLayers.push(cartography);
        } else {
          this.loggerService.debug('discarded cartography', {
            discarded: cartography,
            reason: discard
          });
        }
      });
    }
    this.dataUpdatedEventLayers.next(true);
  }

  /**
   * Extracts service abstract information from capabilities data.
   * @param data - The capabilities data
   * @returns The extracted abstract description
   */
  private extractServiceAbstract(data): string {
    let auxDescription: string;
    if (Array.isArray(data.Service.Abstract)) {
      const descriptionTranslations: PropertyTranslations = this.propertyTranslations.get('description')
      data.Service.Abstract.forEach((translation: { [x: string]: string; content: string; }) => {
        let languageShortname: string = translation['xml:lang'];
        const index = languageShortname.indexOf('-');
        if (index != -1) {
          languageShortname = languageShortname.substring(0, index);
        }
        if (languageShortname == config.defaultLang) {
          auxDescription = translation.content;
        } else if (descriptionTranslations.map.has(languageShortname)) {
          const currentTranslation = descriptionTranslations.map.get(languageShortname);
          const translationReduced = translation.content.substring(0, 249);
          if (currentTranslation.translation != translationReduced) {
            currentTranslation.translation = translationReduced;
            descriptionTranslations.modified = true;
          }
        }
      });
      auxDescription = data.Service.Abstract.find(element => element['xml:lang'].includes(config.defaultLang));
      if (!auxDescription) {
        return data.Service.Abstract[0].content;
      } else {
        return auxDescription;
      }
    } else {
      return data.Service.Abstract;
    }
  }

  /**
   * Creates a cartography instance from layer data.
   * @param layer - The layer data
   * @param layerNames - The layer names
   * @param styles - Array to store style information
   * @returns A new cartography instance
   */
  private extractCartography(layer: any, layerNames: string[], styles: any[]): Cartography & Status {
    this.loggerService.debug("prepare to extract cartography", {layer: layer, layersLyr: layerNames, styles: styles})
    const cartography = new Cartography() as (Cartography & Status);
    cartography.name = layer.Title?.substring(0, 100);
    cartography.description = layer.Abstract?.substring(0, 250);
    cartography.layers = layerNames;

    if (layer.Style) {
      styles.push(...(Array.isArray(layer.Style) ? layer.Style : [layer.Style]));
      cartography.styles = styles;
    }

    const metadataURL = Array.isArray(layer.MetadataURL) ? layer.MetadataURL[0] : layer.MetadataURL;
    cartography.metadataURL = metadataURL?.OnlineResource?.['xlink:href'];

    const dataURL = Array.isArray(layer.DataURL) ? layer.DataURL[0] : layer.DataURL;
    cartography.datasetURL = dataURL?.OnlineResource?.['xlink:href'];

    const style = Array.isArray(layer.Style) ? layer.Style[0] : layer.Style;
    cartography.legendURL = style?.LEGENDURL?.OnlineResource?.['xlink:href'];

    this.loggerService.debug('cartography extracted', {})
    return cartography;
  }

  /**
   * Gets the root layer from capabilities data.
   * @param data - The capabilities data
   * @returns The root layer object
   */
  private getRootLayer(data: { Capability: { Layer: any; }; }): any {
    let layerCapability = data.Capability.Layer;
    while (layerCapability?.Layer != null) {
      layerCapability = layerCapability.Layer;
    }
    return layerCapability;
  }

  /**
   * Extracts projection information from capabilities data.
   * @param data - The capabilities data
   */
  private extractProjections(data: { Capability: { Layer: any; }; }): string[] {
    const layer = data.Capability.Layer;
    const capabilitiesList = layer.SRS ?? layer.CRS;
    const supportedSRS: string[] = [];
    if (capabilitiesList) {
      supportedSRS.push(...capabilitiesList);
    }
    return supportedSRS;
  }

  /**
   * Recursively extracts layer information from capabilities data.
   * @param lyrTable - The layer table to process
   * @param tableToSave - Array to store extracted layer information
   */
  private flatMapLayers(lyrTable: any, tableToSave: any[]): void {
    if (Array.isArray(lyrTable)) {
      lyrTable.forEach(layer => {
        tableToSave.push(layer);
        if (layer.Layer !== null) {
          this.flatMapLayers(layer.Layer, tableToSave);
        }
      });
    } else if (lyrTable) {
      tableToSave.push(lyrTable);
    }
  }

  // ==================================================
  //                    Cleanup
  // ==================================================

  /**
   * Performs cleanup when component is destroyed.
   * Completes all subjects to prevent memory leaks.
   */
  ngOnDestroy(): void {
    // Complete all subjects to prevent memory leaks
    this.subjects?.forEach(subject => {
      subject.complete();
    });

    this.addElementsEventLayers?.complete();
    this.addElementsEventParameters?.complete();

    this.dataUpdatedEventLayers?.complete();
    this.dataUpdatedEventParameters?.complete();
  }
}
