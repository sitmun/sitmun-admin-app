import {Component, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
  Application,
  ApplicationBackground,
  ApplicationBackgroundProjection,
  ApplicationBackgroundService,
  ApplicationParameter,
  ApplicationParameterService,
  ApplicationProjection,
  ApplicationService,
  BackgroundProjection,
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
import {HalOptions} from '@app/core/hal/rest/rest.service';

import {UtilsService} from '@app/services/utils.service';

import {map} from 'rxjs/operators';
import {firstValueFrom, Observable, of} from 'rxjs';
import {
  DataGridComponent,
  isActive,
  onCreate,
  onDelete,
  onUpdate,
  onUpdatedRelation,
  Status
} from '@app/frontend-gui/src/lib/public_api';
import {MatDialog} from '@angular/material/dialog';
import {constants} from '@environments/constants';
import {TranslateService} from "@ngx-translate/core";
import {BaseFormComponent} from "@app/components/base-form.component";
import {DataTableDefinition, TemplateDialog} from '@app/components/data-tables.util';
import {ErrorHandlerService} from "@app/services/error-handler.service";


/**
 * Angular component that provides a form interface for managing SITMUN applications.
 * Supports creating, editing, and duplicating applications through a multi-tab interface.
 *
 * @extends BaseFormComponent<ApplicationProjection>
 */
@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent extends BaseFormComponent<ApplicationProjection> {
  /**
   * Data table configuration for managing application parameters.
   * Provides CRUD operations for parameters with validation and type management.
   * Columns: checkbox, name (editable), value (editable), type (non-editable), status
   */
  readonly parametersTable: DataTableDefinition<ApplicationParameter, ApplicationParameter>

  /**
   * Data table configuration for managing application trees.
   * Handles navigation tree associations with special validation for turistic applications.
   * Columns: checkbox, ID, name (editable), status
   */
  protected readonly treesTable: DataTableDefinition<Tree, Tree>;

  /**
   * Data table configuration for managing application roles.
   * Handles role assignments and permissions with bulk operations support.
   * Columns: checkbox, name (non-editable), description (non-editable), status
   */
  protected readonly rolesTable: DataTableDefinition<Role, Role>;

  /**
   * Data table configuration for managing application backgrounds.
   * Handles map background configurations with ordering and visibility settings.
   * Columns: checkbox, ID, name (non-editable), description (non-editable), order (editable), status
   */
  protected readonly applicationBackgroundsTable: DataTableDefinition<ApplicationBackgroundProjection, BackgroundProjection>;

  /**
   * Stores the current application type.
   * Used to control form behavior and validation rules based on application type.
   */
  private currentAppType: string = null;

  /**
   * List of available situation maps for selection.
   * Includes a default empty option and all cartography groups of type location map.
   */
  protected situationMapList: CartographyGroup[] = [];

  /**
   * Default situation map when none is selected.
   * Represents a null option in the situation map dropdown.
   */
  private situationMapByDefault: CartographyGroup = null;

  /**
   * Reference to the dialog template used for creating new parameters.
   * Used by the parameters table for adding new application parameters.
   */
  @ViewChild('newParameterDialog', {static: true})
  private newParameterDialog: TemplateRef<any>;

  /**
   * Reference to the trees data grid component.
   * Used to access grid data for tree-specific validation rules.
   */
  @ViewChild('treesDataGrid')
  private treesDataGrid: DataGridComponent;

  /**
   * Creates an instance of ApplicationFormComponent.
   *
   * @param dialog - Material dialog service for modal interactions
   * @param translateService - Service for handling translations
   * @param translationService - Service for managing entity translations
   * @param codeListService - Service for managing code lists
   * @param errorHandler - Service for handling errors
   * @param activatedRoute - Angular route service
   * @param router - Angular router for navigation
   * @param applicationService - Service for application CRUD operations
   * @param applicationParameterService - Service for parameter operations
   * @param applicationBackgroundService - Service for background relations
   * @param cartographyGroupService - Service for cartography operations
   * @param backgroundService - Service for background management
   * @param roleService - Service for role management
   * @param treeService - Service for tree management
   * @param utils - Utility service for common operations
   */
  constructor(
    dialog: MatDialog,
    translateService: TranslateService,
    translationService: TranslationService,
    codeListService: CodeListService,
    errorHandler: ErrorHandlerService,
    activatedRoute: ActivatedRoute,
    router: Router,
    protected applicationService: ApplicationService,
    protected applicationParameterService: ApplicationParameterService,
    protected applicationBackgroundService: ApplicationBackgroundService,
    protected cartographyGroupService: CartographyGroupService,
    protected backgroundService: BackgroundService,
    protected roleService: RoleService,
    protected treeService: TreeService,
    protected utils: UtilsService,
  ) {
    super(dialog, translateService, translationService, codeListService, errorHandler, activatedRoute, router);
    this.parametersTable = this.defineParametersTable();
    this.treesTable = this.defineTreesTable();
    this.rolesTable = this.defineRolesTable();
    this.applicationBackgroundsTable = this.defineApplicationBackgroundsTable();
  }

  /**
   * Initializes component data before fetching.
   * Sets up data tables, translations, and situation map list.
   */
  override async preFetchData() {
    this.dataTables.register(this.parametersTable).register(this.treesTable).register(this.rolesTable).register(this.applicationBackgroundsTable);
    this.initTranslations('Application', ['name', 'description', 'title'])
    await this.initCodeLists(['application.type', 'applicationParameter.type'])
    const list = await firstValueFrom(this.fetchSituationMapList())
    list.sort((a, b) => a.name.localeCompare(b.name));
    this.situationMapByDefault = Object.assign(new CartographyGroup(), {
      id: -1,
      name: this.translateService.instant('(None)')
    })
    this.situationMapList.push(this.situationMapByDefault);
    this.situationMapList.push(...list);
  }

  /**
   * Fetches the original entity by ID.
   * @returns Promise of Application entity with projection
   */
  override fetchOriginal(): Promise<ApplicationProjection> {
    return firstValueFrom(this.applicationService.getProjection(ApplicationProjection, this.entityID));
  }

  /**
   * Creates a copy of an existing entity for duplication.
   * @returns Promise of duplicated Application entity
   */
  override fetchCopy(): Promise<ApplicationProjection> {
    return firstValueFrom(this.applicationService.getProjection(ApplicationProjection, this.duplicateID).pipe(map((copy: ApplicationProjection) => {
      copy.name = this.translateService.instant("copy_") + copy.name;
      return copy;
    })));
  }

  /**
   * Creates an empty entity with default values.
   * @returns New Application instance with default type and situation map
   */
  override empty(): ApplicationProjection {
    return Object.assign(new ApplicationProjection(), {
      type: this.firstInCodeList('application.type').value,
      situationMap: this.situationMapList[0].id
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
   * Initializes form data after entity is fetched.
   * Sets up reactive form with entity values and validation rules.
   * @throws Error if entity is undefined
   */
  override postFetchData() {
    if (!this.entityToEdit) {
      throw new Error('Cannot initialize form: entity is undefined');
    }

    this.currentAppType = this.entityToEdit.type;
    this.entityForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.entityToEdit.name, [Validators.required,]),
      description: new UntypedFormControl(this.entityToEdit.description),
      type: new UntypedFormControl(this.entityToEdit.type, [Validators.required,]),
      title: new UntypedFormControl(this.entityToEdit.title),
      jspTemplate: new UntypedFormControl(this.entityToEdit.jspTemplate), // URL or path to external application template
      theme: new UntypedFormControl(this.entityToEdit.theme),
      situationMapId: new UntypedFormControl(this.entityToEdit.situationMapId ?
        this.entityToEdit.situationMapId : this.situationMapByDefault.id, []),
      srs: new UntypedFormControl(this.entityToEdit.srs),
      scales: new UntypedFormControl(this.entityToEdit.scales?.join(',')),
      treeAutoRefresh: new UntypedFormControl(this.entityToEdit.treeAutoRefresh),
      accessParentTerritory: new UntypedFormControl(this.entityToEdit.accessParentTerritory),
      accessChildrenTerritory: new UntypedFormControl(this.entityToEdit.accessChildrenTerritory),
      logo: new UntypedFormControl(this.entityToEdit.logo, []),
    });
  }

  /**
   * Creates an Application object from the current form values.
   *
   * @param id - Optional ID for the new object, used when updating
   * @returns New Application instance populated with form values
   */
  createObject(id: number = null): Application {
    let safeToEdit = ApplicationProjection.fromObject(this.entityToEdit);
    safeToEdit = Object.assign(safeToEdit,
      this.entityForm.value,
      {
        id: id,
        scales: this.entityForm.value.scales != null ? this.entityForm.value.scales.toString().split(',') : null,
        situationMap: this.situationMapList.find(item => item.id !== this.situationMapByDefault.id
            && item.id === this.entityForm.value.situationMapId)
          || null,
      }
    );
    return Application.fromObject(safeToEdit)
  }

  /**
   * Creates a new entity or duplicates an existing one.
   * @returns Promise of created entity ID
   */
  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const response = await firstValueFrom(this.applicationService.create(entityToCreate));
    return response.id;
  }

  /**
   * Updates an existing entity with form values.
   */
  override async updateEntity() {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.applicationService.update(entityToUpdate));
  }

  /**
   * Updates related data after entity save.
   * @param isDuplicated - Whether this is a duplication operation
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override async updateDataRelated(isDuplicated: boolean) {
    const entityToUpdate = this.createObject(this.entityID);
    await this.saveTranslations(entityToUpdate);
    await firstValueFrom(entityToUpdate.updateRelationEx("situationMap", entityToUpdate.situationMap));
  }

  /**
   * Checks form validity and application-specific rules.
   * @returns boolean indicating if save is allowed
   */
  override canSave(): boolean {
    const trees = this.treesDataGrid?.rowData ?? [];
    const filterTrees = trees.filter(isActive);
    const validations = [{
      fn: this.validForm,
      param: null,
      msg: this.utils.showRequiredFieldsError
    }, {
      fn: this.validTuristicAppTrees,
      param: filterTrees,
      msg: this.utils.showTuristicAppTreeError
    }, {
      fn: this.validNoTouristicAppTrees,
      param: filterTrees,
      msg: this.utils.showNoTuristicAppTreeError
    }];
    const error = validations.find(v => {
      return v.fn.bind(this)(v.param) === false
    });
    if (error) {
      error.msg.bind(this.utils)();
      return false;
    }
    return true;
  }

  /**
   * Validates if the form is valid.
   * @returns boolean indicating form validity
   */
  validForm(): boolean {
    return this.entityForm.valid;
  }

  /**
   * Ensures turistic apps have exactly one turistic tree.
   * @param trees - Array of trees to validate
   * @returns boolean indicating validation result
   */
  validTuristicAppTrees(trees: Tree[]): boolean {
    if (this.currentAppType === constants.codeValue.applicationType.touristicApp) {
      return trees.length === 0 || (trees.length === 1 && trees[0].type === constants.codeValue.treeType.touristicTree);
    }
    return true;
  }

  /**
   * Ensures non-turistic apps don't have turistic trees.
   * @param trees - Array of trees to validate
   * @returns boolean indicating validation result
   */
  validNoTouristicAppTrees(trees: Tree[]): boolean {
    if (this.currentAppType !== constants.codeValue.applicationType.touristicApp) {
      return !trees.some(tree => tree.type === constants.codeValue.treeType.touristicTree);
    }
    return true;
  }

  /**
   * Enables/disables form controls based on selected application type.
   * @param value - The new application type value from selection event
   */
  onSelectionTypeAppChanged({value}): void {
    this.currentAppType = value;
    if (value === this.codeValues.applicationType.externalApp) {
      this.entityForm.get('title').disable();
      this.entityForm.get('scales').disable();
      this.entityForm.get('situationMapId').disable();
      this.entityForm.get('treeAutoRefresh').disable();
      this.entityForm.get('theme').disable();
      this.entityForm.get('accessParentTerritory').disable();
      this.entityForm.get('accessChildrenTerritory').disable();
      this.entityForm.get('srs').disable();
    } else {
      this.entityForm.get('title').enable();
      this.entityForm.get('scales').enable();
      this.entityForm.get('situationMapId').enable();
      this.entityForm.get('treeAutoRefresh').enable();
      this.entityForm.get('theme').enable();
      this.entityForm.get('accessParentTerritory').enable();
      this.entityForm.get('accessChildrenTerritory').enable();
      this.entityForm.get('srs').enable();
    }
  }

  /**
   * Defines the data table for application parameters.
   * Configures columns, fetching, updating, and dialog template.
   *
   * @returns Configured data table definition for parameters
   */
  private defineParametersTable(): DataTableDefinition<ApplicationParameter, ApplicationParameter> {
    return DataTableDefinition.builder<ApplicationParameter, ApplicationParameter>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getEditableColumnDef('applicationEntity.name', 'name'),
        this.utils.getEditableColumnDef('applicationEntity.value', 'value'),
        this.utils.getNonEditableColumnDef('applicationEntity.type', 'typeDescription'),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(ApplicationParameter, 'parameters', {projection: 'view'})
          .pipe(map((data: ApplicationParameter[]) => data.map(element => {
            element.typeDescription = this.findInCodeList('applicationParameter.type', element.type)?.description;
            return element;
          })));
      })
      .withRelationsUpdater(async (applicationParameters: (ApplicationParameter & Status)[]) => {
        await onCreate(applicationParameters).forEach(item => {
          const newItem = ApplicationParameter.fromObject(item);
          newItem.application = this.applicationService.createProxy(this.entityID);
          return this.applicationParameterService.create(newItem);
        })
        await onUpdate(applicationParameters).forEach(this.applicationParameterService.update);
        await onDelete(applicationParameters).forEach(this.applicationParameterService.delete);
      })
      .withTemplateDialog('newParameterDialog', () => TemplateDialog.builder()
        .withReference(this.newParameterDialog)
        .withTitle(this.translateService.instant('applicationEntity.newParameter'))
        .withForm(
          new FormGroup({
            name: new FormControl('', {
              validators: [Validators.required],
              nonNullable: true
            }),
            type: new FormControl('', {
              validators: [Validators.required],
              nonNullable: true
            }),
            value: new FormControl('', {
              nonNullable: true
            }),
          })
        ).withPreOpenFunction((form: FormGroup) => {
          form.reset({type: this.firstInCodeList('applicationParameter.type').value});
        }).build())
      .build();
  }

  /**
   * Defines the data table for application trees.
   * Configures columns, fetching, updating, and target selection.
   *
   * @returns Configured data table definition for trees
   */
  private defineTreesTable(): DataTableDefinition<Tree, Tree> {
    return DataTableDefinition.builder<Tree, Tree>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getIdColumnDef(),
        this.utils.getEditableColumnDef('applicationEntity.name', 'name'),
        this.utils.getStatusColumnDef(),
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(Tree, 'trees')
      })
      .withRelationsUpdater(async (trees: (Tree & Status)[]) => {
        await onUpdate(trees).forEach(item => this.treeService.update(item));
        await onUpdatedRelation(trees).forAll(items => this.entityToEdit.substituteAllRelation('trees', items));
      })
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getIdColumnDef(),
        this.utils.getNonEditableColumnDef('applicationEntity.name', 'name'),
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.treeService.getAll())
      .withTargetsTitle(this.translateService.instant('backgroundEntity.roles'))
      .build();
  }

  /**
   * Defines the data table for application roles.
   * Configures columns, fetching, updating, and target selection.
   *
   * @returns Configured data table definition for roles
   */
  private defineRolesTable(): DataTableDefinition<Role, Role> {
    return DataTableDefinition.builder<Role, Role>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('layersPermitsEntity.name', 'name'),
        this.utils.getNonEditableColumnDef('backgroundEntity.description', 'description'),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(Role, 'availableRoles', {projection: 'view'})
      })
      .withRelationsUpdater(async (roles: (Role & Status)[]) => {
        await onUpdatedRelation(roles).forAll(item => this.entityToEdit.substituteAllRelation('availableRoles', item));
      })
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('layersPermitsEntity.name', 'name'),
        this.utils.getNonEditableColumnDef('backgroundEntity.description', 'description'),
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.roleService.getAll())
      .withTargetsTitle(this.translateService.instant('backgroundEntity.roles'))
      .build();
  }

  /**
   * Defines the data table for application backgrounds.
   * Configures columns, fetching, updating, and target selection.
   *
   * @returns Configured data table definition for backgrounds
   */
  private defineApplicationBackgroundsTable(): DataTableDefinition<ApplicationBackgroundProjection, BackgroundProjection> {
    return DataTableDefinition.builder<ApplicationBackgroundProjection, BackgroundProjection>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getIdColumnDef(),
        this.utils.getNonEditableColumnDef('applicationEntity.name', 'backgroundName'),
        this.utils.getNonEditableColumnDef('applicationEntity.description', 'backgroundDescription'),
        this.utils.getEditableColumnDef('applicationEntity.order', 'order'),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('backgroundName')
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx<ApplicationBackground>(ApplicationBackground, 'backgrounds', {projection: 'view'})
      })
      .withRelationsUpdater(async (applicationBackgrounds: (ApplicationBackgroundProjection & Status)[]) => {
        await onCreate(applicationBackgrounds).forEach(item => {
          const newItem = ApplicationBackground.of(
            this.applicationService.createProxy(this.entityID),
            this.backgroundService.createProxy(item.backgroundId),
            item.order);
          return this.applicationBackgroundService.create(newItem)
        });
        await onUpdate(applicationBackgrounds).forEach(item => {
          const newItem = ApplicationBackground.of(
            this.applicationService.createProxy(this.entityID),
            this.backgroundService.createProxy(item.backgroundId),
            item.order);
          newItem.id = item.id;
          return this.applicationBackgroundService.update(newItem);
        });
        await onDelete(applicationBackgrounds).forEach(item => {
          const newItem = this.applicationBackgroundService.createProxy(item.id);
          return this.applicationBackgroundService.delete(newItem)
        });
      })
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getIdColumnDef(),
        this.utils.getNonEditableColumnDef('applicationEntity.name', 'name'),
        this.utils.getNonEditableColumnDef('layersPermitsEntity.description', 'description'),
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.backgroundService.getAllProjection(BackgroundProjection))
      .withTargetInclude((applicationBackgrounds: (ApplicationBackgroundProjection)[]) => (item: BackgroundProjection) => {
        return !applicationBackgrounds.some((applicationBackground) => applicationBackground.backgroundId === item.id);
      })
      .withTargetToRelation((items: BackgroundProjection[]) => {
        return items.map(item => ApplicationBackgroundProjection.of(this.entityToEdit, item, 0));
      })
      .withTargetsTitle(this.translateService.instant('applicationEntity.background'))
      .withTargetsOrder('name')
      .build();
  }

  /**
   * Fetches the list of available situation maps.
   * Filters cartography groups by location map type.
   *
   * @returns Observable of CartographyGroup array filtered by location map type
   */
  private fetchSituationMapList(): Observable<CartographyGroup[]> {
    const query: HalOptions = {
      params: [
        {key: 'type', value: this.codeValues.cartographyPermissionType.locationMap}
      ]
    };
    return this.cartographyGroupService.getAll(query);
  }
}
