import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {
  Application,
  ApplicationBackground,
  ApplicationBackgroundService,
  ApplicationParameter,
  ApplicationParameterService,
  ApplicationService,
  Background,
  BackgroundService,
  CartographyGroup,
  CartographyGroupService,
  CodeListService,
  Role,
  RoleService,
  TranslationService,
  Tree,
  TreeService
} from '@app/domain';
import {HalOptions, HalParam} from '@app/core/hal/rest/rest.service';

import {UtilsService} from '@app/services/utils.service';
import {LoggerService} from '@app/services/logger.service';

import {map} from 'rxjs/operators';
import {firstValueFrom, Observable, of, Subject} from 'rxjs';
import {config} from '@config';
import {
  DataGridComponent,
  DIALOG_FORM_EVENTS,
  DialogFormComponent,
  DialogFormData,
  DialogFormResult,
  DialogGridComponent,
  DialogGridData,
  DialogGridResult,
  GridEventType,
  isDialogGridAddEvent,
  onCreate,
  onDelete,
  onUpdate,
  onUpdatedRelation,
  Status,
  isSave,
  GridEvent
} from '@app/frontend-gui/src/lib/public_api';
import {MatDialog} from '@angular/material/dialog';
import {constants} from '@environments/constants';
import {TranslateService} from "@ngx-translate/core";
import {translatableMixin} from '@app/mixins/translatable.mixin';
import {activeTabMixin} from "@app/mixins/activetab.mixin";
import {codeListMixin} from "@app/mixins/codelist.mixin";


class SitmunBase {
}

const TranslatableSitmunBase = codeListMixin(translatableMixin(activeTabMixin(SitmunBase)));

/**
 * Component for creating, editing, and duplicating Application entities.
 *
 * This component manages the application form with multiple tabs for:
 * - Main application properties
 * - Parameters configuration
 * - Role associations
 * - Background settings
 * - Tree relationships
 *
 * The form supports three modes:
 * - Create: Creates a new application
 * - Edit: Modifies an existing application
 * - Duplicate: Creates a new application based on an existing one
 */
@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent extends TranslatableSitmunBase implements OnInit, OnDestroy {

  themeGrid: any = config.agGridTheme;
  codeValues = constants.codeValue;

  readonly getAllElementsEventBackground = new Subject<GridEventType>();
  readonly getAllElementsEventRoles = new Subject<GridEventType>();
  readonly getAllElementsEventTree = new Subject<GridEventType>();
  readonly getAllElementsEventParameters = new Subject<GridEventType>();

  readonly subjects = [
    this.getAllElementsEventBackground,
    this.getAllElementsEventRoles,
    this.getAllElementsEventTree,
    this.getAllElementsEventParameters
  ]

  constructor(
    protected override dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private applicationService: ApplicationService,
    protected override translationService: TranslationService,
    private backgroundService: BackgroundService,
    private applicationParameterService: ApplicationParameterService,
    private applicationBackgroundService: ApplicationBackgroundService,
    private roleService: RoleService,
    private treeService: TreeService,
    public utils: UtilsService,
    private cartographyGroupService: CartographyGroupService,
    private loggerService: LoggerService,
    private translateService: TranslateService,
    protected override codeListService: CodeListService
  ) {
    super();
  }

  /**
   * Initializes the component by:
   * 1. Setting up translations
   * 2. Initializing form sections and tabs
   * 3. Loading application data or setting defaults
   */
  ngOnInit(): void {

    this.initTranslations(
      'Application',
      [
        config.translationColumns.applicationName,
        config.translationColumns.applicationDescription,
        config.translationColumns.applicationTitle
      ]
    )

    this.ngOnInitMainForm()
    this.ngOnInitParametersTab()
    this.ngOnInitRolesTab()
    this.ngOnInitBackgroundTab()
    this.ngOnInitTreesTab()
    this.fetchData().catch((reason) => this.loggerService.error('Error in ngOnInitMainForm:', reason));
  }

  // ==================================================
  //                     Utilities
  // ==================================================

  /**
   * Checks if the application is in creation mode (not editing or duplicating).
   * @returns {boolean} True if the application is new, false otherwise
   */
  isNew(): boolean {
    return this.applicationID == -1 && this.duplicateID == -1
  }

  /**
   * Creates duplicates of items with new names and cleared IDs.
   * Used to duplicate various entities associated with an application.
   *
   * @template T The type of items to duplicate
   * @param {new() => T} type Constructor for the item type
   * @param {(T & { name: string })[]} items Array of items to duplicate
   * @param {Subject<T[]>} subject Subject to emit the duplicated items
   */
  duplicate<T>(type: { new(): T; }, items: (T & { name: string }) [], subject: Subject<T[]>): void {
    subject.next(items.map(item => Object.assign(new type(), {
      ...item,
      id: undefined,
      _links: undefined,
      name: this.translateService.instant('copy_').concat(item.name)
    })));
  }

  // ==================================================
  //                 Load Application
  // ==================================================

  dataLoaded = false;
  currentAppType: string;
  applicationForm: UntypedFormGroup;
  situationMapList: CartographyGroup[] = [];
  applicationToEdit: Application;
  applicationID = -1;
  duplicateID = -1;

  /**
   * Fetches and loads all necessary data for the application form.
   * This includes code lists, situation maps, and application data if editing or duplicating.
   * Sets up the form with appropriate initial values based on the application state.
   */
  async fetchData() {
    await this.initCodeLists(['application.type', 'applicationParameter.type'])

    const situationMapByDefault = Object.assign(new CartographyGroup(), {
      id: -1,
      name: '-------'
    });
    const list = await firstValueFrom(this.fetchSituationMapList())
    list.sort((a, b) => a.name.localeCompare(b.name));
    this.situationMapList.push(situationMapByDefault);
    this.situationMapList.push(...list);

    const params = await firstValueFrom(this.activatedRoute.params)

    this.applicationID = params.id;

    if (params.idDuplicate) {
      this.duplicateID = params.idDuplicate;
    } else {
      this.duplicateID = -1;
    }
    if (this.applicationID != -1 || this.duplicateID != -1) {
      const editMode = this.applicationID != -1;
      const idToGet = editMode ? this.applicationID : this.duplicateID;

      this.applicationToEdit = await firstValueFrom(this.applicationService.get(idToGet))
      this.currentAppType = this.applicationToEdit.type;

      // Prepare form data with common values
      const formData: Record<string, any> = {
        type: this.applicationToEdit.type,
        title: this.applicationToEdit.title,
        description: this.applicationToEdit.description,
        jspTemplate: this.applicationToEdit.jspTemplate,
        accessParentTerritory: this.applicationToEdit.accessParentTerritory,
        accessChildrenTerritory: this.applicationToEdit.accessChildrenTerritory,
        theme: this.applicationToEdit.theme,
        situationMap: this.applicationToEdit.situationMapId ? this.applicationToEdit.situationMapId : this.situationMapList[0].id,
        srs: this.applicationToEdit.srs,
        scales: this.applicationToEdit.scales,
        treeAutoRefresh: this.applicationToEdit.treeAutoRefresh,
        logo: this.applicationToEdit.logo,
        name: editMode
          ? this.applicationToEdit.name
          : this.utils.getTranslate('copy_').concat(this.applicationToEdit.name),
        _links: this.applicationToEdit._links,
      };

      // Add ID and passwordSet for edit mode
      if (editMode) {
        formData.id = this.applicationID;
        formData.passwordSet = this.applicationToEdit.passwordSet;
      }

      // Set all values at once
      this.applicationForm.patchValue(formData);

      if (editMode) {
        await this.loadTranslations(this.applicationToEdit)
      }
      this.loggerService.debug('application to edit loaded', {
        applicationToEdit: this.applicationToEdit,
        type: this.applicationToEdit.constructor.name
      });
    } else {
      this.applicationForm.patchValue({
        moveSupramunicipal: false,
        treeAutorefresh: false,
        accessParentTerritory: false,
        accessChildrenTerritory: false,
        type: this.firstInCodeList('application.type').value,
        situationMap: this.situationMapList[0].id
      });
      this.applicationForm.get('title').disable();
      this.applicationForm.get('scales').disable();
      this.applicationForm.get('situationMap').disable();
      this.applicationForm.get('treeAutoRefresh').disable();
      this.applicationForm.get('accessParentTerritory').disable();
      this.applicationForm.get('accessChildrenTerritory').disable();
      this.applicationForm.get('theme').disable();
      this.applicationForm.get('srs').disable();
    }
    this.dataLoaded = true;
  }

  /**
   * Retrieves the situation map list with appropriate filtering.
   * Uses a more concise approach for creating query parameters.
   *
   * @returns {Observable<CartographyGroup[]>} Observable of CartographyGroup items
   */
  private fetchSituationMapList(): Observable<CartographyGroup[]> {
    const query: HalOptions = {
      params: [
        {key: 'type', value: this.codeValues.cartographyPermissionType.locationMap}
      ]
    };
    return this.cartographyGroupService.getAll(query);
  }

  // ==================================================
  //                 Save Application
  // ==================================================

  /**
   * Validates the form and initiates the save process if valid.
   * Triggers validation rules before saving.
   */
  onSaveButtonClicked() {
    if (this.appValidations()) {
      this.saveApp().catch((reason) => this.loggerService.error('Error in onSaveButtonClicked:', reason));
    }
  }

  /**
   * Saves the application with all its properties and relationships.
   * Handles both creation and update operations based on the application state.
   * After saving, updates the component state and related entity relations.
   */
  async saveApp() {
    try {
      // Copy form values to application object
      const appObj: Application = Object.assign(new Application(), this.applicationForm.value);

      // Handle special cases
      appObj.scales = this.applicationForm.value.scales != null ?
        this.applicationForm.value.scales.toString().split(',') : null;
      delete appObj.situationMap

      // Set ID based on application state
      let resp: Application | Observable<never>;
      if (this.applicationID == -1) {
        appObj.id = null;
        resp = await firstValueFrom(this.applicationService.create(appObj));
      } else {
        appObj.createdDate = this.applicationToEdit.createdDate;
        resp = await firstValueFrom(this.applicationService.update(appObj));
      }

      if (resp instanceof Application) {
        const situationMap = this.situationMapList.find(item => item.id !== -1 && item.id === this.applicationForm.value.situationMap) || null;
        await firstValueFrom(resp.updateRelationship("situationMap", situationMap));

        this.applicationToEdit = resp;
        this.applicationID = this.applicationToEdit.id;
        this.applicationForm.patchValue({
          id: resp.id,
          _links: resp._links
        });
        await this.saveTranslations(this.applicationToEdit);
        this.subjects.forEach(subject => subject.next('save'));
      }
    } catch (error) {
      this.loggerService.error('Error saving application:', error);
      throw error;
    }
  }

  // ==================================================
  //            Application Validation
  // ==================================================

  /**
   * Reference to the trees data grid component.
   */
  @ViewChild('treesDataGrid') treesDataGrid: DataGridComponent;

  /**
   * Validates the application form and relationships.
   * Performs various validation checks including:
   * - Form field validation
   * - Trees validation for turistic applications
   * - Trees validation for non-turistic applications
   *
   * @returns {boolean} True if all validations pass, false otherwise
   */
  appValidations(): boolean {
    let valid = true;
    const trees = this.treesDataGrid?.rowData;
    const filterTrees = trees?.filter(a => a.status !== 'pendingDelete') ?? [];
    const validations = [{
      fn: this.validForm,
      param: null,
      msg: this.utils.showRequiredFieldsError
    }, {
      fn: this.validTuristicAppTrees,
      param: filterTrees,
      msg: this.utils.showTuristicAppTreeError
    }, {
      fn: this.validNoTuristicAppTrees,
      param: filterTrees,
      msg: this.utils.showNoTuristicAppTreeError
    }];
    const error = validations.find(v => {
      return v.fn.bind(this)(v.param) === false
    });
    if (error) {
      valid = false;
      error.msg.bind(this.utils)();
    }
    return valid;
  }

  /**
   * Validates the application form is valid.
   * @returns {boolean} True if the form is valid, false otherwise
   */
  validForm(): boolean {
    return this.applicationForm.valid;
  }

  /**
   * Validates trees for turistic applications.
   * @param {Tree[]} trees - Array of trees to validate
   * @returns {boolean} True if validation passes, false otherwise
   */
  validTuristicAppTrees(trees: Tree[]): boolean {
    if (this.currentAppType === constants.codeValue.applicationType.turisticApp) {
      return trees.length === 0 || (trees.length === 1 && trees[0].type === constants.codeValue.treeType.turisticTree);
    }
    return true;
  }

  /**
   * Validates trees for non-turistic applications.
   * @param {Tree[]} trees - Array of trees to validate
   * @returns {boolean} True if validation passes, false otherwise
   */
  validNoTuristicAppTrees(trees: Tree[]): boolean {
    if (this.currentAppType !== constants.codeValue.applicationType.turisticApp) {
      return !trees.some(tree => tree.type === constants.codeValue.treeType.turisticTree);
    }
    return true;
  }

  // ==================================================
  //                    Main form
  // ==================================================

  ngOnInitMainForm() {
    // Initialize form synchronously first
    this.applicationForm = new UntypedFormGroup({
      id: new UntypedFormControl(null, []),
      name: new UntypedFormControl(null, [Validators.required,]),
      description: new UntypedFormControl(null),
      type: new UntypedFormControl(null, [Validators.required,]),
      title: new UntypedFormControl(null),
      jspTemplate: new UntypedFormControl(null, []),
      theme: new UntypedFormControl(null),
      situationMap: new UntypedFormControl(null, []),
      srs: new UntypedFormControl(null),
      scales: new UntypedFormControl(null),
      treeAutoRefresh: new UntypedFormControl(null),
      app: new UntypedFormControl(null),
      accessParentTerritory: new UntypedFormControl(null),
      accessChildrenTerritory: new UntypedFormControl(null),
      _links: new UntypedFormControl(null, []),
      logo: new UntypedFormControl(null, []),
    });
  }

  onSelectionTypeAppChanged({value}) {
    this.currentAppType = value;
    if (value === this.codeValues.applicationType.externalApp) {
      this.applicationForm.get('title').disable();
      this.applicationForm.get('scales').disable();
      this.applicationForm.get('situationMap').disable();
      this.applicationForm.get('treeAutoRefresh').disable();
      this.applicationForm.get('theme').disable();
      this.applicationForm.get('accessParentTerritory').disable();
      this.applicationForm.get('accessChildrenTerritory').disable();
      this.applicationForm.get('srs').disable();
    } else {
      this.applicationForm.get('title').enable();
      this.applicationForm.get('scales').enable();
      this.applicationForm.get('situationMap').enable();
      this.applicationForm.get('treeAutoRefresh').enable();
      this.applicationForm.get('theme').enable();
      this.applicationForm.get('accessParentTerritory').enable();
      this.applicationForm.get('accessChildrenTerritory').enable();
      this.applicationForm.get('srs').enable();
    }
  }

  // ==================================================
  //                    Parameters
  // ==================================================

  columnDefsParameters: any[];
  columnDefsParametersDialog: any[];
  addElementsEventParameters: Subject<ApplicationParameter[]> = new Subject<ApplicationParameter[]>();
  dataUpdatedEventParameters: Subject<boolean> = new Subject<boolean>();

  public parameterForm: UntypedFormGroup;
  @ViewChild('newParameterDialog', {static: true}) private newParameterDialog: TemplateRef<any>;

  ngOnInitParametersTab() {
    this.columnDefsParameters = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getEditableColumnDef('applicationEntity.name', 'name'),
      this.utils.getEditableColumnDef('applicationEntity.value', 'value'),
      this.utils.getNonEditableColumnDef('applicationEntity.type', 'typeDescription'),
      this.utils.getStatusColumnDef(),
    ];
    this.columnDefsParametersDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getNonEditableColumnDef('applicationEntity.name', 'name'),
      this.utils.getNonEditableColumnDef('applicationEntity.value', 'value'),
      this.utils.getNonEditableColumnDef('applicationEntity.type', 'type'),
    ];
    this.parameterForm = new UntypedFormGroup({
      name: new UntypedFormControl(null),
      type: new UntypedFormControl(null),
      value: new UntypedFormControl(null),
    });
  }

  /**
   * Fetches all parameters associated with the application.
   * If the application is new (not yet saved), returns an empty array.
   * Otherwise, retrieves the parameters through the application's relation array
   * and enriches each parameter with its type description.
   *
   * @returns {Observable<ApplicationParameter[]>} An observable containing the application parameters
   * with their type descriptions
   */
  fetchParameters = (): Observable<ApplicationParameter[]> => {
    if (this.isNew()) {
      return of([]);
    }
    return this.applicationToEdit.getRelationArrayEx(ApplicationParameter, 'parameters', {projection: 'view'})
      .pipe(map((data: ApplicationParameter[]) =>
        data.map(element => Object.assign(new ApplicationParameter(), {
          ...element,
          typeDescription: this.findInCodeList('applicationParameter.type', element.type)?.description
        }))
      ))
  };

  /**
   * Handles events from the parameters grid.
   * When a save event is received, triggers the update of application parameters.
   *
   * @param {GridEvent<ApplicationParameter>} event - The grid event containing the event type and data
   */
  handleParametersEvent(event: GridEvent<ApplicationParameter>) {
    if (isSave(event)) {
      this.updateParameters(event.data).catch((reason) => this.loggerService.error('Error in getAllRowsParameters:', reason));
    }
  }

  /**
   * Updates the application parameters by handling creation, updates, and deletions.
   * This method processes three types of changes:
   * 1. New parameters: Creates new ApplicationParameter instances and associates them with the application
   * 2. Updated parameters: Updates existing parameters
   * 3. Deleted parameters: Removes parameters marked for deletion
   *
   * @param {(ApplicationParameter & Status)[]} applicationParameters - Array of parameters with their current status
   * @throws Error if any of the parameter operations fail
   */
  async updateParameters(applicationParameters: (ApplicationParameter & Status)[]) {
    await onCreate(applicationParameters).forEach(item =>
      this.applicationParameterService.create(Object.assign(new ApplicationParameter(), {
        ...item,
        application: this.applicationToEdit
      }))
    );
    await onUpdate(applicationParameters).forEach(item => this.applicationParameterService.update(item));
    await onDelete(applicationParameters).forEach(item => this.applicationParameterService.delete(item));
    this.dataUpdatedEventParameters.next(true);
  }

  /**
   * Creates a duplicate of the selected parameters with modified names.
   * Each duplicated parameter will have:
   * - A new ID (undefined)
   * - No links (_links: undefined)
   * - A name prefixed with the translation of 'copy_'
   *
   * @param {ApplicationParameter[]} parameters - Array of parameters to duplicate
   */
  duplicateParameters(parameters: ApplicationParameter[]) {
    this.duplicate(ApplicationParameter, parameters, this.addElementsEventParameters);
  }

  /**
   * Opens a dialog for adding new application parameters.
   * This method:
   * 1. Resets the parameter form with default type value
   * 2. Opens a dialog with the parameter form template
   * 3. Processes the result when dialog is closed
   *
   * When the user confirms by clicking Add, the new parameter is added to the grid
   * through the addElementsEventParameters Subject.
   */
  openParametersDialog() {
    this.parameterForm.reset({type: this.firstInCodeList('applicationParameter.type').value});
    const dialogRef = this.dialog.open<DialogFormComponent, DialogFormData, DialogFormResult>(
      DialogFormComponent, {
        data: {
          HTMLReceived: this.newParameterDialog,
          title: this.translateService.instant('applicationEntity.configurationParameters'),
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
  //                     Role
  // ==================================================

  columnDefsRoles: any[];
  addElementsEventRoles: Subject<any[]> = new Subject<any[]>();
  dataUpdatedEventRoles: Subject<boolean> = new Subject<boolean>();

  ngOnInitRolesTab() {
    this.columnDefsRoles = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('applicationEntity.name', 'name'),
      this.utils.getStatusColumnDef(),
    ];
  }

  /**
   * Retrieves all roles associated with the application.
   * If the application is new or duplicated, returns an empty observable.
   * Otherwise, fetches the roles through the application's relation array.
   *
   * @returns {Observable<Role[]>} An observable containing the application roles
   */
  fetchRoles = (): Observable<Role[]> => {
    if (this.isNew()) {
      return of([]);
    }
    return this.applicationToEdit.getRelationArrayEx(Role, 'availableRoles', {projection: 'view'})
  };

  /**
   * Handles events from the roles grid.
   * When a save event is received, triggers the update of application roles.
   *
   * @param {GridEvent<Role>} event - The grid event containing the event type and data
   */
  handleRolesEvent(event: GridEvent<Role>) {
    if (isSave(event)) {
      this.updateRoles(event.data).catch((reason) => this.loggerService.error('Error in handleRolesEvent:', reason));
    }
  }

  /**
   * Updates the application roles by handling modifications and relation updates.
   * This method processes two types of changes:
   * 1. Role updates: Updates existing roles through the role service
   * 2. Relation updates: Updates the application's relation with all roles
   *
   * @param {(Role & Status)[]} roles - Array of roles with their current status
   * @throws Error if any of the role operations fail
   */
  async updateRoles(roles: (Role & Status)[]) {
    await onUpdate(roles).forEach(item => this.roleService.update(item));
    await onUpdatedRelation(roles).forAll(item => this.applicationToEdit.substituteAllRelation('availableRoles', item));
    this.dataUpdatedEventRoles.next(true);
  }

  /**
   * Opens a dialog for managing application roles.
   * This dialog allows users to select roles from a grid and associate them with the application.
   *
   * The dialog displays a grid with checkboxes for selection, showing role IDs, names, and descriptions.
   * The description field is editable, while other fields are read-only.
   *
   * @param {Role[]} roles - The current roles associated with the application
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
          this.utils.getNonEditableColumnDef('applicationEntity.name', 'name'),
          this.utils.getEditableColumnDef('applicationEntity.note', 'description'),
        ]],
        themeGrid: this.themeGrid,
        title: this.translateService.instant('applicationEntity.roles'),
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

  columnDefsBackgrounds: any[];
  columnDefsBackgroundDialog = []
  addElementsEventBackground: Subject<any[]> = new Subject<any[]>();
  dataUpdatedEventBackground: Subject<boolean> = new Subject<boolean>();

  ngOnInitBackgroundTab() {
    this.columnDefsBackgrounds = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('applicationEntity.name', 'backgroundName'),
      this.utils.getNonEditableColumnDef('applicationEntity.description', 'backgroundDescription'),
      this.utils.getEditableColumnDef('applicationEntity.order', 'order'),
      this.utils.getStatusColumnDef()
    ];
    this.columnDefsBackgroundDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('applicationEntity.name', 'name'),
    ];
  }

  /**
   * Fetches all backgrounds associated with the application.
   * If the application is new (not yet saved), returns an empty array.
   * Otherwise, retrieves the backgrounds through the application's relation array.
   *
   * @returns {Observable<ApplicationBackground[]>} An observable containing the application backgrounds
   */
  fetchApplicationBackgrounds = (): Observable<ApplicationBackground[]> => {
    if (this.isNew()) {
      return of([]);
    }
    return this.applicationToEdit.getRelationArrayEx(ApplicationBackground, 'backgrounds', {projection: 'view'})
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
   * 1. New backgrounds: Creates new ApplicationBackground instances and associates them with the application
   * 2. Updated backgrounds: Updates existing backgrounds
   * 3. Deleted backgrounds: Removes backgrounds marked for deletion
   *
   * @param {(ApplicationBackground & Status)[]} applicationBackgrounds - Array of backgrounds with their current status
   * @throws Error if any of the background operations fail
   */
  async updateApplicationBackgrounds(applicationBackgrounds: (ApplicationBackground & Status)[]) {
    await onCreate(applicationBackgrounds).forEach(item =>
      this.applicationBackgroundService.create(Object.assign(new ApplicationBackground(), {
        ...item,
        application: this.applicationToEdit
      }))
    );
    await onUpdate(applicationBackgrounds).forEach(item => this.applicationBackgroundService.update(item));
    await onDelete(applicationBackgrounds).forEach(item => this.applicationBackgroundService.delete(item));
    this.dataUpdatedEventBackground.next(true);
  }

  /**
   * Opens a dialog for selecting backgrounds to add to the application.
   *
   * This method displays a grid dialog that allows users to select from available backgrounds.
   * When backgrounds are selected and added, they are converted to ApplicationBackground objects
   * and emitted through the addElementsEventBackground subject.
   *
   * @param {Background[]} data - Array of existing backgrounds to display in the dialog
   */
  openBackgroundDialog(data: Background[]) {
    const dialogRef = this.dialog.open<DialogGridComponent, DialogGridData, DialogGridResult>(DialogGridComponent, {
      panelClass: 'gridDialogs',
      data: {
        orderTable: ['name'],
        getAllsTable: [() => {
          return this.backgroundService.getAll();
        }],
        singleSelectionTable: [false],
        columnDefsTable: [[
          this.utils.getSelCheckboxColumnDef(),
          this.utils.getIdColumnDef(),
          this.utils.getNonEditableColumnDef('applicationEntity.name', 'name')
        ]],
        themeGrid: this.themeGrid,
        title: this.translateService.instant('applicationEntity.background'),
        titlesTable: [''],
        currentData: [data],
        fieldRestrictionWithDifferentName: ['backgroundName'],
        addFieldRestriction: ['name'],
        nonEditable: false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (isDialogGridAddEvent(result)) {
        const newItems = result.data[0].map((item: Background) => Object.assign(new ApplicationBackground(), {
          background: item,
          backgroundDescription: item.description,
          backgroundName: item.name,
        }));
        this.addElementsEventBackground.next(newItems);
      }
    });
  }

  // ==================================================
  //                    Trees
  // ==================================================

  columnDefsTrees: any[];
  dataUpdatedEventTrees: Subject<boolean> = new Subject<boolean>();
  addElementsEventTree: Subject<any[]> = new Subject<any[]>();

  ngOnInitTreesTab() {
    this.columnDefsTrees = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('applicationEntity.name', 'name'),
      this.utils.getStatusColumnDef(),
    ];
  }

  /**
   * Fetches all trees associated with the application.
   * If the application is new (not yet saved), returns an empty array.
   * Otherwise, retrieves the trees through the application's relation array.
   *
   * @returns {Observable<Tree[]>} An observable containing the application trees
   */
  fetchTrees = (): Observable<Tree[]> => {
    if (this.isNew()) {
      return of([]);
    }
    return this.applicationToEdit.getRelationArrayEx(Tree, 'trees', {projection: 'view'})
  };

  /**
   * Handles events from the application trees grid.
   * When a save event is received, triggers the update of application trees.
   *
   * @param {GridEvent<Tree & Status>} event - The grid event containing the event type and data
   */
  handleTreesEvent(event: GridEvent<Tree & Status>) {
    if (isSave(event)) {
      this.updateTrees(event.data).catch((reason) => this.loggerService.error('Error in handleTreesEvent:', reason));
    }
  }

  /**
   * Updates the application trees by handling modifications and relation updates.
   * This method processes two types of changes:
   * 1. Trees updates: Updates existing trees through the tree service
   * 2. Relation updates: Updates the application's relation with all trees
   *
   * @param {(Tree & Status)[]} trees - Array of trees with their current status
   * @throws Error if any of the tree operations fail
   */
  async updateTrees(trees: (Tree & Status)[]) {
    await onUpdate(trees).forEach(item => this.treeService.update(item));
    await onUpdatedRelation(trees).forAll(item => this.applicationToEdit.substituteAllRelation('trees', item));
    this.dataUpdatedEventTrees.next(true);
  }

  /**
   * Opens a dialog for selecting trees to associate with the application.
   * This method:
   * 1. Opens a grid dialog with tree selection options
   * 2. Configures the dialog with appropriate columns and data sources
   * 3. Processes the result when dialog is closed
   *
   * When the user confirms by selecting trees, the selected trees are added to the application
   * through the addElementsEventTree Subject.
   *
   * @param {Tree[]} data - Current trees associated with the application
   */
  openTreeDialog(data: Tree[]) {
    const dialogRef = this.dialog.open<DialogGridComponent, DialogGridData, DialogGridResult>(DialogGridComponent, {
      panelClass: 'gridDialogs',
      data: {
        orderTable: ['name'],
        getAllsTable: [() => {
          return this.treeService.getAll();
        }],
        singleSelectionTable: [false],
        columnDefsTable: [[
          this.utils.getSelCheckboxColumnDef(),
          this.utils.getIdColumnDef(),
          this.utils.getNonEditableColumnDef('applicationEntity.name', 'name'),
        ]],
        themeGrid: this.themeGrid,
        title: this.translateService.instant('applicationEntity.tree'),
        titlesTable: [''],
        currentData: [data],
        nonEditable: false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (isDialogGridAddEvent(result)) {
        this.addElementsEventTree.next(result.data[0]);
      }
    })
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
    this.dataUpdatedEventParameters?.complete();
    this.dataUpdatedEventRoles?.complete();
    this.dataUpdatedEventBackground?.complete();
    this.dataUpdatedEventTrees?.complete();

    // Complete add elements event subjects
    this.addElementsEventParameters?.complete();
    this.addElementsEventRoles?.complete();
    this.addElementsEventBackground?.complete();
    this.addElementsEventTree?.complete();
  }
}
