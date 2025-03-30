import {Component, OnDestroy, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
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

class SitmunBase {
}

const TranslatableSitmunBase = translatableMixin(activeTabMixin(SitmunBase));

/**
 * Component for creating, editing, and duplicating Background entities.
 *
 * This component manages the background layer form with multiple tabs for:
 * - Main background properties (name, description, image, etc.)
 * - Cartographies configuration (map layers associated with this background)
 * - Role associations (user roles that can access this background)
 * - Application associations (applications that use this background)
 *
 * The form supports three modes:
 * - Create: Creates a new background from scratch
 * - Edit: Modifies an existing background's properties and relationships
 * - Duplicate: Creates a new background based on an existing one, copying its properties and relationships
 *
 * Each background is associated with a CartographyGroup that manages the relationship
 * with cartographies, roles, and applications.
 */
@Component({
  selector: 'app-background-layers-form',
  templateUrl: './background-layers-form.component.html',
})
export class BackgroundLayersFormComponent extends TranslatableSitmunBase implements OnInit, OnDestroy {

  themeGrid: any = config.agGridTheme;


  /**
   * Creates an instance of the BackgroundLayersFormComponent.
   * Injects all required services for background layer management, including:
   * - UI services (dialog, utils, translation)
   * - Data services (background, cartography, role, application)
   * - Support services (logger, codelist)
   *
   * @param {MatDialog} dialog - Dialog service for displaying modal dialogs
   * @param {ActivatedRoute} activatedRoute - Route service to access URL parameters
   * @param {BackgroundService} backgroundService - Service for background CRUD operations
   * @param {TranslationService} translationService - Service for handling entity translations
   * @param {UtilsService} utils - Utility service for common UI operations
   * @param {CartographyService} cartographyService - Service for cartography CRUD operations
   * @param {RoleService} roleService - Service for role CRUD operations
   * @param {CartographyGroupService} cartographyGroupService - Service for cartography group operations
   * @param {ApplicationService} applicationService - Service for application CRUD operations
   * @param {ApplicationBackgroundService} applicationBackgroundService - Service for application-background relations
   * @param {LoggerService} loggerService - Logging service
   * @param {TranslateService} translateService - Translation service for UI elements
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
    private translateService: TranslateService
  ) {
    super()
  }

  /**
   * Reference to the cartography group associated with this background layer.
   * Manages relationships between cartographies, roles, and applications.
   */
  cartographyGroupOfThisLayer = null;

  /**
   * Indicates whether all required data has been loaded.
   * Used to control the rendering of form elements and prevent premature operations.
   */
  dataLoaded = false;

  /**
   * The main form group containing all background properties.
   * Manages form validation and provides access to form controls.
   */
  backgroundForm: UntypedFormGroup;

  /**
   * Reference to the background being edited.
   * Contains all background data including relationships.
   */
  backgroundToEdit: Background;

  /**
   * ID of the background being edited, or -1 if creating a new background.
   * Determined from route parameters.
   */
  backgroundID = -1;

  /**
   * ID of the background being duplicated, or -1 if not duplicating.
   * Determined from route parameters.
   */
  duplicateID = -1;

  /**
   * Initializes the component by:
   * 1. Setting up translations
   * 2. Initializing form sections and tabs
   * 3. Loading background data or setting defaults
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
    this.fetchData().catch((reason) => this.loggerService.error('Error in ngOnInit:', reason));
  }

  // ==================================================
  //                     Utilities
  // ==================================================

  /**
   * Checks if the background is in creation mode (not editing or duplicating).
   * @returns {boolean} True if the background is new, false otherwise
   */
  isNew(): boolean {
    return this.backgroundID == -1 && this.duplicateID == -1
  }

  /**
   * Checks if the background is in duplication mode.
   * @returns {boolean} True if the background is being duplicated, false otherwise
   */
  isDuplicated() {
    return this.backgroundID == -1 && this.duplicateID != -1;
  }

  // ==================================================
  //                 Load Application
  // ==================================================

  /**
   * Fetches and loads all necessary data for the background form.
   * This includes retrieving the background entity and its associated cartography group if editing or duplicating.
   * Sets up the form with appropriate initial values based on the background state.
   *
   * For new backgrounds, initializes the form with default values.
   * For existing backgrounds, populates the form with data from the server.
   * For duplicated backgrounds, copies values from the source background.
   */
  async fetchData() {
    const params = await firstValueFrom(this.activatedRoute.params)

    this.backgroundID = params.id;

    if (params.idDuplicate) {
      this.duplicateID = params.idDuplicate;
    } else {
      this.duplicateID = -1;
    }

    if (this.backgroundID != -1 || this.duplicateID != -1) {
      const editMode = this.backgroundID != -1;
      const idToGet = editMode ? this.backgroundID : this.duplicateID;

      this.backgroundToEdit = await firstValueFrom(this.backgroundService.get(idToGet))
      this.cartographyGroupOfThisLayer = await firstValueFrom(this.cartographyGroupService.get(this.backgroundToEdit.cartographyGroupId))

      const formData: Record<string, any> = {
        description: this.backgroundToEdit.description,
        image: this.backgroundToEdit.image,
        cartographyGroup: constants.codeValue.cartographyPermissionType.backgroundMap,
        active: this.backgroundToEdit.active,
        _links: this.backgroundToEdit._links,
        name: editMode
          ? this.backgroundToEdit.name
          : this.translateService.instant('copy_').concat(this.backgroundToEdit.name),
      }

      // Add ID and
      if (editMode) {
        formData.id = this.backgroundID;
      }

      // Set all values at once
      this.backgroundForm.patchValue(formData);

      if (editMode) {
        await this.loadTranslations(this.backgroundToEdit)
      }

      this.loggerService.debug('background to edit loaded', {
        backgroundToEdit: this.backgroundToEdit,
        cartographyGroupOfThisLayer: this.cartographyGroupOfThisLayer,
      });
    } else {
      this.backgroundForm.patchValue({
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
   * Event subject for triggering application background data refresh on save.
   * Used to notify the applications grid to reload or update its data.
   */
  readonly getAllElementsEventApplicationsBackground: Subject<string> = new Subject<string>();

  /**
   * Event subject for triggering roles data refresh on save.
   * Used to notify the roles grid to reload or update its data.
   */
  readonly getAllElementsEventRoles: Subject<string> = new Subject<string>();

  /**
   * Event subject for triggering cartographies data refresh on save.
   * Used to notify the cartographies grid to reload or update its data.
   */
  readonly getAllElementsEventCartographies: Subject<string> = new Subject<string>();

  /**
   * Collection of all grid refresh event subjects for centralized management.
   * Used for batch operations on all subjects, such as emitting save events
   * or completing subjects on component destruction.
   */
  readonly subjects = [
    this.getAllElementsEventApplicationsBackground,
    this.getAllElementsEventRoles,
    this.getAllElementsEventCartographies
  ]

  /**
   * Validates the form and initiates the save process if valid.
   * This method:
   * 1. Checks if the form is valid
   * 2. If valid, saves the cartography group first
   * 3. Then saves the background with a reference to the cartography group
   * 4. If invalid, displays an error message
   */
  async onSaveButtonClicked() {
    if (this.backgroundForm.valid) {
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
   * Saves the cartography group associated with this background.
   * Creates a new cartography group or updates an existing one based on the current state.
   *
   * @returns {Observable<CartographyGroup | Observable<never>>} An observable containing the saved cartography group
   */
  saveCartographyGroup(): Observable<CartographyGroup | Observable<never>> {
    if (this.isDuplicated()) {
      this.cartographyGroupOfThisLayer = null;
    }

    const cartographyGroupObj = this.cartographyGroupOfThisLayer == null
      ? new CartographyGroup()
      : Object.assign(new CartographyGroup(), this.cartographyGroupOfThisLayer);

    cartographyGroupObj.name = this.backgroundForm.value.name;
    cartographyGroupObj.type = this.backgroundForm.value.cartographyGroup;

    if (this.cartographyGroupOfThisLayer == null) {
      return this.cartographyGroupService.create(cartographyGroupObj);
    } else {
      return this.cartographyGroupService.update(cartographyGroupObj);
    }
  }

  /**
   * Updates the background with the form values and associates it with the cartography group.
   * Handles both creation and update operations based on the background state.
   * After saving, updates the component state and related entity relations.
   *
   * @param {CartographyGroup} cartographyGroup - The cartography group to associate with this background
   * @throws Error if any of the background operations fail
   */
  async updateBackground(cartographyGroup: CartographyGroup) {
    try {
      // Copy form values to background object
      const backgroundObj: Background = Object.assign(new Background(), this.backgroundForm.value);

      // Handle special case
      backgroundObj.cartographyGroup = cartographyGroup;

      // Set ID based on application state
      let resp: Background | Observable<never>;
      if (this.backgroundID == -1) {
        backgroundObj.id = null;
        resp = await firstValueFrom(this.backgroundService.create(backgroundObj));
      } else {
        resp = await firstValueFrom(this.backgroundService.update(backgroundObj));
      }

      if (resp instanceof Background) {
        this.backgroundToEdit = resp;
        this.backgroundID = resp.id;
        this.backgroundForm.patchValue({
          id: resp.id,
          _links: resp._links
        });

        await this.saveTranslations(this.backgroundToEdit)
        this.subjects.forEach(subject => subject.next('save'))
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
   * Initializes the main background form.
   * Creates a form group with controls for all background properties:
   * - Basic information (id, name, description)
   * - Display settings (image)
   * - Configuration settings (cartographyGroup, active)
   * - Links (_links)
   */
  ngOnInitMainForm() {
    this.backgroundForm = new UntypedFormGroup({
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
   * Initializes the cartographies tab configuration.
   * Sets up column definitions for the cartographies grid:
   * - Checkbox column for selection
   * - ID column for identification
   * - Name column (editable)
   * - Service name column (non-editable)
   * - Status column to track changes
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
   * Fetches all cartographies associated with this background's cartography group.
   * If the cartography group is not yet created or this is a new background, returns an empty array.
   * Otherwise, retrieves the cartographies through the cartography group's relation array.
   *
   * @returns {Observable<Cartography[]>} An observable containing the cartographies
   */
  fetchCartographies = (): Observable<Cartography[]> => {
    if (this.cartographyGroupOfThisLayer == null && this.isNew()) {
      return of([]);
    }
    return this.cartographyGroupOfThisLayer.getRelationArrayEx(Cartography, 'members', {projection: 'view'})
  };

  /**
   * Handles events from the cartographies grid.
   * When a save event is received, triggers the update of cartographies.
   *
   * @param {GridEvent<Cartography & Status>} event - The grid event containing the event type and data
   */
  handleCartographiesEvent(event: GridEvent<Cartography & Status>) {
    if (isSave(event)) {
      this.updateCartographies(event.data).catch((reason) => this.loggerService.error('Error in handleCartographiesEvent:', reason));
    }
  }

  /**
   * Updates the cartographies by handling modifications and relation updates.
   * This method processes two types of changes:
   * 1. Cartography updates: Updates existing cartographies through the cartography service
   * 2. Relation updates: Updates the cartography group's relation with all cartographies
   *
   * @param {(Cartography & Status)[]} cartographies - Array of cartographies with their current status
   * @throws Error if any of the cartography operations fail
   */
  async updateCartographies(cartographies: (Cartography & Status)[]) {
    await onUpdate(cartographies).forEach(item => this.cartographyService.update(item));
    await onUpdatedRelation(cartographies).forAll(items => this.cartographyGroupOfThisLayer.substituteAllRelation('members', items));
    this.dataUpdatedEventCartographies.next(true);
  }

  /**
   * Opens a dialog for selecting cartographies to associate with this background.
   * This method:
   * 1. Opens a grid dialog with cartography selection options
   * 2. Configures the dialog with appropriate columns and data sources
   * 3. Processes the result when dialog is closed
   *
   * When the user confirms by selecting cartographies, the selected cartographies are added to the
   * background's cartography group through the addElementsEventCartographies Subject.
   *
   * @param {Cartography[]} data - Current cartographies associated with the background
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
    return this.backgroundToEdit.getRelationArrayEx(ApplicationBackground, 'applications', {projection: 'view'})
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
        background: this.backgroundToEdit
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
   * Handles cleanup when the component is destroyed.
   * Completes all subjects to prevent memory leaks.
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
