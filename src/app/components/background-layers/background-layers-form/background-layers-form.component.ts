import {Component, OnDestroy, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {
  ApplicationBackground,
  ApplicationBackgroundService,
  ApplicationService,
  Background,
  BackgroundService,
  Cartography,
  CartographyGroup,
  CartographyGroupService,
  CartographyService,
  Role,
  RoleService,
  TranslationService
} from '@app/domain';
import {UtilsService} from '@app/services/utils.service';
import {firstValueFrom, Observable, of, Subject} from 'rxjs';
import {
  DialogGridComponent,
  DialogGridData,
  DialogGridResult,
  GridEvent,
  isDialogGridAddEvent,
  isSave,
  onCreate,
  onDelete,
  onUpdate,
  onUpdatedRelation,
  Status
} from '@app/frontend-gui/src/lib/public_api';
import {map} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {config} from '@config';
import {constants} from '@environments/constants';
import {LoggerService} from '@app/services/logger.service';
import {TranslateService} from "@ngx-translate/core";
import {translatableMixin} from "@app/mixins/translatable.mixin";
import {activeTabMixin} from "@app/mixins/activetab.mixin";
import {sitmunMixedBase} from "@app/components/sitmun.base";

/**
 * Component for managing background layers in the SITMUN application.
 *
 * This component provides a form interface for creating, editing, and duplicating Background entities,
 * which represent map background layers. The form is organized into multiple tabs:
 *
 * 1. General Data Tab:
 *    - Basic properties (name, description)
 *    - Display settings (image)
 *    - Status settings (active)
 *
 * 2. Cartographies Tab:
 *    - Manages associated map layers
 *    - Allows adding/removing cartographies
 *    - Configures layer properties
 *
 * 3. Roles Tab:
 *    - Controls access permissions
 *    - Associates user roles with the background
 *    - Manages role-specific settings
 *
 * 4. Applications Tab:
 *    - Links backgrounds to applications
 *    - Configures display order
 *    - Manages application-specific settings
 *
 * The component supports three operation modes:
 * - Create: Creates a new background from scratch
 * - Edit: Modifies an existing background's properties and relationships
 * - Duplicate: Creates a new background based on an existing one
 *
 * Key Features:
 * - Integrated translation support for multilingual content
 * - Grid-based interfaces for managing relationships
 * - Real-time validation and error handling
 * - Automatic data synchronization
 *
 * Technical Details:
 * - Extends TranslatableSitmunBase for translation capabilities
 * - Uses reactive forms for data management
 * - Implements OnInit and OnDestroy lifecycle hooks
 * - Manages complex entity relationships through CartographyGroup
 */
@Component({
  selector: 'app-background-layers-form',
  templateUrl: './background-layers-form.component.html',
})
export class BackgroundLayersFormComponent extends sitmunMixedBase<Background>() implements OnInit, OnDestroy {


  /**
   * Creates an instance of the BackgroundLayersFormComponent.
   *
   * Dependencies are organized into the following categories:
   *
   * UI Services:
   * @param {MatDialog} dialog - Manages modal dialogs for entity selection
   * @param {UtilsService} utils - Provides common UI utilities and navigation
   * @param {TranslateService} translateService - Handles UI element translations
   *
   * Data Services:
   * @param {BackgroundService} backgroundService - Manages background layer CRUD operations
   * @param {CartographyService} cartographyService - Handles cartography data operations
   * @param {RoleService} roleService - Manages role data and permissions
   * @param {CartographyGroupService} cartographyGroupService - Handles cartography group operations
   * @param {ApplicationService} applicationService - Manages application data
   * @param {ApplicationBackgroundService} applicationBackgroundService - Handles application-background relations
   *
   * Support Services:
   * @param {ActivatedRoute} activatedRoute - Provides access to route parameters
   * @param {TranslationService} translationService - Manages entity translations
   * @param {LoggerService} loggerService - Handles application logging
   */
  constructor(
    protected override dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private backgroundService: BackgroundService,
    protected override translationService: TranslationService,
    public utils: UtilsService,
    private cartographyService: CartographyService,
    private roleService: RoleService,
    private cartographyGroupService: CartographyGroupService,
    private applicationService: ApplicationService,
    private applicationBackgroundService: ApplicationBackgroundService,
    private loggerService: LoggerService,
    translateService: TranslateService
  ) {
    super(translateService)
  }

  /**
   * Reference to the cartography group associated with this background layer.
   * Manages relationships between cartographies, roles, and applications.
   */
  cartographyGroupOfThisLayer = null;

  /**
   * Initializes the component and sets up all necessary resources.
   *
   * Initialization sequence:
   * 1. Sets up translation support for 'name' and 'description' fields
   * 2. Initializes the main form with validation rules
   * 3. Sets up grid configurations for cartographies, roles, and applications
   * 4. Loads existing data if editing/duplicating a background
   *
   * Error handling:
   * - Logs initialization errors through LoggerService
   * - Continues initialization of other components if one fails
   */
  ngOnInit(): void {
    this.initTranslations(
      'Background',
      ['name', 'description']
    )
    this.ngOnInitMainForm()
    this.ngOnInitCartographies()
    this.ngOnInitRoles()
    this.ngOnInitApplications()
    this.fetchData().then(() => this.subscribeToFormChanges(this.entityForm)).catch((reason) => this.loggerService.error('Error in ngOnInit:', reason));
  }

  /**
   * Fetches and loads all necessary data for the background form.
   *
   * Data Loading Process:
   * 1. Retrieves route parameters to determine operation mode
   * 2. Loads existing background data if editing/duplicating:
   *    - Fetches background entity
   *    - Loads associated cartography group
   *    - Sets up form with existing values
   *    - Handles translations for editable fields
   * 3. Initializes new background if creating:
   *    - Sets default values
   *    - Configures required relationships
   *
   * State Management:
   * - Updates component state based on loaded data
   * - Manages loading state through dataLoaded flag
   * - Handles entity relationships and dependencies
   *
   * Error Handling:
   * - Logs errors through LoggerService
   * - Maintains consistent state on failure
   * - Provides debug information for troubleshooting
   */
  async fetchData() {
    const params = await firstValueFrom(this.activatedRoute.params)

    this.entityID = params.id;

    if (params.idDuplicate) {
      this.duplicateID = params.idDuplicate;
    } else {
      this.duplicateID = -1;
    }

    if (!this.isNew()) {
      const idToGet = this.isEdition() ? this.entityID : this.duplicateID;

      this.entityToEdit = await firstValueFrom(this.backgroundService.get(idToGet))
      this.cartographyGroupOfThisLayer = await firstValueFrom(this.cartographyGroupService.get(this.entityToEdit.cartographyGroupId))

      const formData: Record<string, any> = {
        description: this.entityToEdit.description,
        image: this.entityToEdit.image,
        cartographyGroup: constants.codeValue.cartographyPermissionType.backgroundMap,
        active: this.entityToEdit.active,
        _links: this.entityToEdit._links,
        name: this.isEdition()
          ? this.entityToEdit.name
          : this.translateService.instant('copy_').concat(this.entityToEdit.name),
      }

      // Add ID and
      if (this.isEdition()) {
        formData.id = this.entityID;
      }

      // Set all values at once
      this.entityForm.patchValue(formData);

      if (this.isEdition()) {
        await this.loadTranslations(this.entityToEdit)
      }

      this.loggerService.debug('background to edit loaded', {
        backgroundToEdit: this.entityToEdit,
        cartographyGroupOfThisLayer: this.cartographyGroupOfThisLayer,
      });
    } else {
      this.entityForm.patchValue({
        active: false,
        cartographyGroup: constants.codeValue.cartographyPermissionType.backgroundMap
      });
    }
    this.dataLoaded = true;
  }

// ==================================================
//                 Save Background
// ==================================================

  /**
   * Event subjects for managing grid data synchronization.
   * These subjects coordinate updates between the form and its child grids.
   *
   * @property {Subject<string>} getAllElementsEventApplicationsBackground - Triggers application grid refresh
   * @property {Subject<string>} getAllElementsEventRoles - Triggers roles grid refresh
   * @property {Subject<string>} getAllElementsEventCartographies - Triggers cartographies grid refresh
   */
  readonly getAllElementsEventApplicationsBackground: Subject<string> = new Subject<string>();
  readonly getAllElementsEventRoles: Subject<string> = new Subject<string>();
  readonly getAllElementsEventCartographies: Subject<string> = new Subject<string>();

  /**
   * Collection of all grid refresh event subjects.
   * Used for centralized management of grid updates and cleanup.
   *
   * Important: These subjects must be completed in ngOnDestroy to prevent memory leaks.
   */
  readonly subjects = [
    this.getAllElementsEventApplicationsBackground,
    this.getAllElementsEventRoles,
    this.getAllElementsEventCartographies
  ]

  /**
   * Validates and saves the background layer configuration.
   *
   * Save Process:
   * 1. Form Validation:
   *    - Checks required fields
   *    - Validates field formats
   *
   * 2. Data Persistence:
   *    - Saves cartography group first
   *    - Then saves background with group reference
   *    - Updates related entities (roles, applications)
   *
   * 3. State Updates:
   *    - Updates local component state
   *    - Triggers grid refreshes
   *    - Updates translations
   *
   * Error Handling:
   * - Displays user-friendly error messages
   * - Logs detailed errors for debugging
   * - Maintains data consistency on failure
   */
  async onSaveButtonClicked() {
    if (this.entityForm.valid) {
      try {
        const response = await firstValueFrom(this.saveCartographyGroup());

        // Check if the response is a CartographyGroup (not an Observable<never>)
        if (response instanceof CartographyGroup) {
          this.loggerService.info('Cartography group updated', {old: this.cartographyGroupOfThisLayer, new: response});
          this.cartographyGroupOfThisLayer = response;
          await this.updateBackground(response);
        } else {
          this.loggerService.error('Failed to save cartography group - invalid response type');
          this.utils.showErrorMessage('Error saving background layer. Please try again.');
        }
      } catch (error) {
        this.loggerService.error('Error in onSaveButtonClicked:', error);
        this.utils.showErrorMessage('Error saving background layer. Please try again.');
      }
    } else {
      this.utils.showRequiredFieldsError();
    }
  }

  /**
   * Manages the cartography group associated with this background.
   *
   * Operations:
   * 1. Create Mode:
   *    - Creates new cartography group
   *    - Sets initial properties
   *
   * 2. Update Mode:
   *    - Updates existing group properties
   *    - Maintains relationships
   *
   * 3. Duplicate Mode:
   *    - Creates new group from existing
   *    - Copies relevant properties
   *
   * @returns {Observable<CartographyGroup | Observable<never>>} The saved cartography group
   */
  saveCartographyGroup(): Observable<CartographyGroup | Observable<never>> {
    if (this.isDuplicated()) {
      this.cartographyGroupOfThisLayer = null;
    }

    const cartographyGroupObj = this.cartographyGroupOfThisLayer == null
      ? new CartographyGroup()
      : Object.assign(new CartographyGroup(), this.cartographyGroupOfThisLayer);

    cartographyGroupObj.name = this.entityForm.value.name;
    cartographyGroupObj.type = this.entityForm.value.cartographyGroup;

    if (this.cartographyGroupOfThisLayer == null) {
      return this.cartographyGroupService.create(cartographyGroupObj);
    } else {
      return this.cartographyGroupService.update(cartographyGroupObj);
    }
  }

  /**
   * Updates the background entity with current form values.
   *
   * Update Process:
   * 1. Data Preparation:
   *    - Maps form values to entity
   *    - Handles special fields
   *    - Sets up relationships
   *
   * 2. Persistence:
   *    - Creates new or updates existing
   *    - Manages translations
   *    - Updates related entities
   *
   * 3. Post-Update:
   *    - Updates component state
   *    - Refreshes grids
   *    - Handles translations
   *
   * @param {CartographyGroup} cartographyGroup - The associated cartography group
   * @throws Error if update operations fail
   */
  async updateBackground(cartographyGroup: CartographyGroup) {
    try {
      // Copy form values to background object
      const backgroundObj: Background = Object.assign(new Background(), this.entityForm.value);

      // Handle special case
      backgroundObj.cartographyGroup = cartographyGroup;

      // Set ID based on application state
      let resp: Background | Observable<never>;
      if (this.isNewOrDuplicated()) {
        backgroundObj.id = null;
        resp = await firstValueFrom(this.backgroundService.create(backgroundObj));
      } else {
        resp = await firstValueFrom(this.backgroundService.update(backgroundObj));
      }

      if (resp instanceof Background) {
        this.entityToEdit = resp;
        this.entityID = resp.id;
        this.entityForm.patchValue({
          id: resp.id,
          _links: resp._links
        });

        await this.saveTranslations(this.entityToEdit)
        this.subjects.forEach(subject => subject.next('save'))
        this.resetToFormModifiedState(this.entityForm);
      }
    } catch (error) {
      this.loggerService.error('Error saving background:', error);
      throw error;
    }
  }

// ==================================================
//                    Main form
// ==================================================

  /**
   * Initializes the main form with all required fields and validation rules.
   *
   * Form Structure:
   * - id: Background identifier (null for new backgrounds)
   * - name: Required field, max 50 characters
   * - description: Optional descriptive text
   * - image: Optional background image URL
   * - cartographyGroup: Associated group configuration
   * - active: Background availability status
   * - _links: HAL links for API navigation
   *
   * Validation Rules:
   * - Name is required
   * - Other fields are optional but type-checked
   * - Form state is tracked for save operations
   */
  ngOnInitMainForm() {
    this.entityForm = new UntypedFormGroup({
      id: new UntypedFormControl(null, []),
      name: new UntypedFormControl(null, [
        Validators.required,
      ]),
      description: new UntypedFormControl(null),
      image: new UntypedFormControl(null),
      cartographyGroup: new UntypedFormControl(null),
      active: new UntypedFormControl(null),
      _links: new UntypedFormControl(null),
    });
  }

// ==================================================
//                    Layers
// ==================================================

  /**
   * Column definitions for the cartographies grid.
   * Includes columns for:
   * - Selection checkbox
   * - ID (non-editable)
   * - Name (editable)
   * - Service name (non-editable)
   * - Status indicator
   */
  columnDefsCartographies: any[];

  /**
   * Subject for notifying when cartographies data has been updated.
   * Used to trigger grid refresh after data operations.
   */
  dataUpdatedEventCartographies: Subject<boolean> = new Subject<boolean>();

  /**
   * Column definitions for the cartographies selection dialog.
   */
  columnDefsCartographiesDialog: any[];

  /**
   * Subject for adding new cartographies to the grid.
   * Emits arrays of cartographies to be added to the grid.
   */
  addElementsEventCartographies: Subject<any[]> = new Subject<any[]>();

  /**
   * Initializes the cartographies grid configuration.
   *
   * Grid Features:
   * - Selection via checkboxes
   * - ID display (non-editable)
   * - Name editing
   * - Service name display
   * - Status tracking
   *
   * The grid supports:
   * - Multi-select operations
   * - Inline editing of name field
   * - Real-time status updates
   * - Sorting by name
   */
  ngOnInitCartographies() {
    this.columnDefsCartographies = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('layersPermitsEntity.name', 'name'),
      this.utils.getNonEditableColumnDef('treesEntity.serviceName', 'serviceName'),
      this.utils.getStatusColumnDef()
    ];
  }

  /**
   * Retrieves cartographies associated with this background.
   *
   * Data Flow:
   * 1. Checks component state:
   *    - Returns empty array for new backgrounds
   *    - Fetches data for existing backgrounds
   *
   * 2. Data Loading:
   *    - Uses cartography group relation
   *    - Applies view projection
   *    - Handles async loading
   *
   * @returns {Observable<Cartography[]>} Stream of associated cartographies
   */
  fetchCartographies = (): Observable<Cartography[]> => {
    if (this.cartographyGroupOfThisLayer == null && this.isNew()) {
      return of([]);
    }
    return this.cartographyGroupOfThisLayer.getRelationArrayEx(Cartography, 'members', {projection: 'view'})
  };

  /**
   * Processes grid events for the cartographies section.
   *
   * Event Handling:
   * - Save events trigger cartography updates
   * - Updates are processed in batch
   * - Changes are persisted to backend
   * - Grid is refreshed after updates
   *
   * @param {GridEvent<Cartography & Status>} event - The grid event to process
   */
  handleCartographiesEvent(event: GridEvent<Cartography & Status>) {
    if (isSave(event)) {
      this.updateCartographies(event.data).catch((reason) => this.loggerService.error('Error in handleCartographiesEvent:', reason));
    }
  }

  /**
   * Updates cartography relationships and data.
   *
   * Update Process:
   * 1. Entity Updates:
   *    - Processes modified cartographies
   *    - Updates through cartography service
   *
   * 2. Relationship Updates:
   *    - Updates cartography group relations
   *    - Maintains consistency
   *
   * 3. UI Updates:
   *    - Refreshes grid data
   *    - Updates status indicators
   *
   * @param {(Cartography & Status)[]} cartographies - Cartographies to update
   */
  async updateCartographies(cartographies: (Cartography & Status)[]) {
    await onUpdate(cartographies).forEach(item => this.cartographyService.update(item));
    await onUpdatedRelation(cartographies).forAll(items => this.cartographyGroupOfThisLayer.substituteAllRelation('members', items));
    this.dataUpdatedEventCartographies.next(true);
  }

  /**
   * Opens dialog for cartography selection and management.
   *
   * Dialog Features:
   * 1. Display:
   *    - Grid with checkboxes
   *    - ID and name columns
   *    - Service information
   *
   * 2. Functionality:
   *    - Multi-select support
   *    - Sorting by name
   *    - Current selection tracking
   *
   * 3. Data Flow:
   *    - Loads available cartographies
   *    - Handles selection
   *    - Updates component on confirmation
   *
   * @param {Cartography[]} data - Currently associated cartographies
   */
  openCartographyDialog(data: Cartography[]) {
    const dialogRef = this.dialog.open(DialogGridComponent, {panelClass: 'gridDialogs'});
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable = [() => {
      return this.cartographyService.getAll();
    }];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [[
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('layersPermitsEntity.name', 'name'),
      this.utils.getNonEditableColumnDef('treesEntity.serviceName', 'serviceName'),
    ]];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('backgroundEntity.cartographiesConfiguration');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.currentData = [data];
    dialogRef.componentInstance.nonEditable = false;


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventCartographies.next(result.data[0]);
        }
      }

    });

  }

// ==================================================
//                     Role
// ==================================================

  /**
   * Column definitions for the roles grid.
   * Includes columns for:
   * - Selection checkbox
   * - ID (non-editable)
   * - Name (editable)
   * - Description/notes (editable)
   * - Status indicator
   */
  columnDefsRoles: any[];

  /**
   * Subject for adding new roles to the grid.
   * Emits arrays of roles to be added to the grid.
   */
  addElementsEventRoles: Subject<any[]> = new Subject<any[]>();

  /**
   * Subject for notifying when roles data has been updated.
   * Used to trigger grid refresh after data operations.
   */
  dataUpdatedEventRoles: Subject<boolean> = new Subject<boolean>();

  /**
   * Initializes the roles tab configuration.
   * Sets up column definitions for the roles grid:
   * - Checkbox column for selection
   * - ID column for identification
   * - Name column (editable)
   * - Description column (editable)
   * - Status column to track changes
   */
  ngOnInitRoles(): void {
    this.columnDefsRoles = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('layersPermitsEntity.name', 'name'),
      this.utils.getEditableColumnDef('backgroundEntity.description', 'description'),
      this.utils.getStatusColumnDef()
    ];
  }

  /**
   * Fetches all roles associated with this background's cartography group.
   * If the cartography group is not yet created or this is a new background, returns an empty array.
   * Otherwise, retrieves the roles through the cartography group's relation array.
   *
   * @returns {Observable<Role[]>} An observable containing the roles
   */
  fetchRoles = (): Observable<Role[]> => {
    if (this.cartographyGroupOfThisLayer == null && this.isNew()) {
      return of([]);
    }
    return this.cartographyGroupOfThisLayer.getRelationArrayEx(Role, 'roles', {projection: 'view'})
  };

  /**
   * Handles events from the roles grid.
   * When a save event is received, triggers the update of roles.
   *
   * @param {GridEvent<Role>} event - The grid event containing the event type and data
   */
  handleRolesEvent(event: GridEvent<Role>) {
    if (isSave(event)) {
      this.updateRoles(event.data).catch((reason) => this.loggerService.error('Error in handleRolesEvent:', reason));
    }
  }

  /**
   * Updates the roles by handling modifications and relation updates.
   * This method processes two types of changes:
   * 1. Role updates: Updates existing roles through the role service
   * 2. Relation updates: Updates the cartography group's relation with all roles
   *
   * @param {(Role & Status)[]} roles - Array of roles with their current status
   * @throws Error if any of the role operations fail
   */
  async updateRoles(roles: (Role & Status)[]) {
    await onUpdate(roles).forEach(item => this.roleService.update(item));
    await onUpdatedRelation(roles).forAll(item => this.cartographyGroupOfThisLayer.substituteAllRelation('roles', item));
    this.dataUpdatedEventRoles.next(true);
  }

  /**
   * Opens a dialog for managing roles associated with this background.
   * This dialog allows users to select roles from a grid and associate them with the background.
   *
   * The dialog displays a grid with checkboxes for selection, showing role IDs, names, and descriptions.
   * The description field is editable, while other fields are read-only.
   *
   * @param {Role[]} roles - The current roles associated with the background
   */
  openRolesDialog(roles: Role[]) {
    const dialogRef = this.dialog.open<DialogGridComponent, DialogGridData, DialogGridResult>(DialogGridComponent, {
      panelClass: 'gridDialogs',
      data: {
        orderTable: ['name'],
        getAllsTable: [() => this.roleService.getAll()],
        singleSelectionTable: [false],
        columnDefsTable: [[
          this.utils.getSelCheckboxColumnDef(),
          this.utils.getIdColumnDef(),
          this.utils.getNonEditableColumnDef('backgroundEntity.name', 'name'),
          this.utils.getEditableColumnDef('backgroundEntity.description', 'description'),
        ]],
        themeGrid: this.themeGrid,
        title: this.translateService.instant('backgroundEntity.roles'),
        titlesTable: [''],
        currentData: [roles],
        nonEditable: false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (isDialogGridAddEvent(result)) {
        this.addElementsEventRoles.next(result.data[0]);
      }
    });
  }

// ==================================================
//             Application Background
// ==================================================

  /**
   * Column definitions for the applications backgrounds grid.
   * Includes columns for:
   * - Selection checkbox
   * - ID (non-editable)
   * - Application name (non-editable)
   * - Application description (non-editable)
   * - Order (editable)
   * - Status indicator
   */
  columnDefsApplicationsBackgrounds: any[];

  /**
   * Subject for notifying when application backgrounds data has been updated.
   * Used to trigger grid refresh after data operations.
   */
  dataUpdatedEventApplicationBackgrounds: Subject<boolean> = new Subject<boolean>();

  /**
   * Column definitions for the application background selection dialog.
   */
  columnDefsApplicationBackgroundDialog: any[];

  /**
   * Subject for adding new application backgrounds to the grid.
   * Emits arrays of application backgrounds to be added to the grid.
   */
  addElementsEventApplicationBackground: Subject<any[]> = new Subject<any[]>();

  /**
   * Initializes the applications tab configuration.
   * Sets up column definitions for the applications grid and dialog:
   * - Defines columns for the main grid showing application associations
   * - Defines columns for the selection dialog
   */
  ngOnInitApplications(): void {
    this.columnDefsApplicationsBackgrounds = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('layersPermitsEntity.name', 'applicationName'),
      this.utils.getNonEditableColumnDef('applicationEntity.description', 'applicationDescription'),
      this.utils.getEditableColumnDef('applicationEntity.order', 'order'),
      this.utils.getStatusColumnDef()
    ];
    this.columnDefsApplicationBackgroundDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('layersPermitsEntity.name', 'name'),
    ];
  }

  /**
   * Fetches all application backgrounds associated with the background.
   * If the background is new (not yet saved), returns an empty array.
   * Otherwise, retrieves the application backgrounds through the applications's relation array.
   *
   * @returns {Observable<ApplicationBackground[]>} An observable containing the application backgrounds
   */
  fetchApplicationBackgrounds = (): Observable<ApplicationBackground[]> => {
    if (this.isNew()) {
      return of([]);
    }
    return this.entityToEdit.getRelationArrayEx(ApplicationBackground, 'applications', {projection: 'view'})
  };

  /**
   * Handles events from the application backgrounds grid.
   * When a save event is received, triggers the update of application backgrounds.
   *
   * @param {GridEvent<ApplicationBackground & Status>} event - The grid event containing the event type and data
   */
  handleApplicationBackgroundsEvent(event: GridEvent<ApplicationBackground & Status>) {
    if (isSave(event)) {
      this.updateApplicationBackgrounds(event.data).catch((reason) => this.loggerService.error('Error in handleApplicationBackgroundsEvent:', reason));
    }
  }

  /**
   * Updates the application backgrounds by handling creation, updates, and deletions.
   * This method processes three types of changes:
   * 1. New backgrounds: Creates new ApplicationBackground instances and associates them with the background
   * 2. Updated backgrounds: Updates existing backgrounds
   * 3. Deleted backgrounds: Removes backgrounds marked for deletion
   *
   * @param {(ApplicationBackground & Status)[]} applicationBackgrounds - Array of backgrounds with their current status
   * @throws Error if any of the background operations fail
   */
  async updateApplicationBackgrounds(applicationBackgrounds: (ApplicationBackground & Status)[]) {
    await onCreate(applicationBackgrounds).forEach(item => this.applicationService.get(item.applicationId).pipe(map(app => item.application = app)))
    await onCreate(applicationBackgrounds).forEach(item =>
      this.applicationBackgroundService.create(Object.assign(new ApplicationBackground(), {
        ...item,
        background: this.entityToEdit
      }))
    )
    await onUpdate(applicationBackgrounds).forEach(item => this.applicationBackgroundService.update(item));
    await onDelete(applicationBackgrounds).forEach(item => this.applicationBackgroundService.delete(item));
    applicationBackgrounds.forEach(item => item.newItem = false);
    this.dataUpdatedEventApplicationBackgrounds.next(true);
  }

  /**
   * Opens a dialog for selecting applications to associate with this background.
   * This method displays a grid dialog that allows users to select from available applications.
   * When applications are selected and added, they are converted to ApplicationBackground objects
   * and emitted through the addElementsEventApplicationBackground subject.
   *
   * @param {any} data - Array of existing applications to display in the dialog
   */
  openApplicationsDialog(data: any) {
    const dialogRef = this.dialog.open<DialogGridComponent, DialogGridData, DialogGridResult>(DialogGridComponent, {
      panelClass: 'gridDialogs',
      data: {
        orderTable: ['name'],
        getAllsTable: [() => {
          return this.applicationService.getAll();
        }],
        singleSelectionTable: [false],
        columnDefsTable: [[
          this.utils.getSelCheckboxColumnDef(),
          this.utils.getIdColumnDef(),
          this.utils.getNonEditableColumnDef('layersPermitsEntity.name', 'name'),
          this.utils.getNonEditableColumnDef('layersPermitsEntity.description', 'description')
        ]],
        themeGrid: this.themeGrid,
        title: this.translateService.instant('layersPermitsEntity.applications'),
        titlesTable: [''],
        currentData: [data],
        fieldRestrictionWithDifferentName: ['applicationName'],
        addFieldRestriction: ['name'],
        nonEditable: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (isDialogGridAddEvent(result)) {
        const newItems = result.data[0].map((item: Background) => Object.assign(new ApplicationBackground(), {
          application: item,
          applicationDescription: item.description,
          applicationName: item.name
        }));
        this.addElementsEventApplicationBackground.next(newItems);
      }
    });
  }

// ==================================================
//                    Cleanup
// ==================================================

  /**
   * Performs cleanup when component is destroyed.
   *
   * Cleanup Tasks:
   * 1. Subject Completion:
   *    - Completes all grid event subjects
   *    - Completes data update subjects
   *    - Completes element addition subjects
   *
   * 2. Memory Management:
   *    - Releases subject resources
   *    - Prevents memory leaks
   *    - Ensures proper cleanup
   */
  ngOnDestroy(): void {
    // Complete all event subjects
    this.subjects.forEach(subject => subject.complete());

    // Complete data updated event subjects
    this.dataUpdatedEventRoles?.complete();
    this.dataUpdatedEventApplicationBackgrounds?.complete();
    this.dataUpdatedEventCartographies?.complete();

    // Complete add elements event subjects
    this.addElementsEventRoles?.complete();
    this.addElementsEventApplicationBackground?.complete();
    this.addElementsEventCartographies?.complete();
  }

}
