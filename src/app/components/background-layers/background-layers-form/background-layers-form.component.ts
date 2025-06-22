import {Component} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ApplicationBackground,
  ApplicationBackgroundProjection,
  ApplicationBackgroundService,
  ApplicationProjection,
  ApplicationService,
  Background,
  BackgroundProjection,
  BackgroundService,
  CartographyGroup,
  CartographyGroupService,
  CartographyProjection,
  CartographyService,
  CodeListService,
  Role,
  RoleService,
  TranslationService,
} from '@app/domain';
import {UtilsService} from '@app/services/utils.service';
import {firstValueFrom, of} from 'rxjs';
import {onCreate, onDelete, onUpdate, onUpdatedRelation, Status} from '@app/frontend-gui/src/lib/public_api';
import {map} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from "@ngx-translate/core";
import {BaseFormComponent} from "@app/components/base-form.component";
import {DataTableDefinition} from "@app/components/data-tables.util";
import {ErrorHandlerService} from "@app/services/error-handler.service";
import {constants} from "@environments/constants";
import {LoggerService} from "@app/services/logger.service";

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
 *
 * TODO: remove the linked cartography group when the background is deleted if this is not already done by the backend
 */
@Component({
  selector: 'app-background-layers-form',
  templateUrl: './background-layers-form.component.html',
})
export class BackgroundLayersFormComponent extends BaseFormComponent<BackgroundProjection> {

  /**
   * Cartography group associated with this background.
   * Each background has exactly one cartography group that contains the layers
   * displayed in the background.
   */
  private cartographyGroup: CartographyGroup = null

  /**
   * Data table definition for managing roles associated with this background.
   * Manages access permissions for the background through role assignments.
   */
  protected readonly rolesTable: DataTableDefinition<Role, Role>

  /**
   * Data table definition for managing application-background relationships.
   * Controls which applications can use this background and their display order.
   */
  protected readonly applicationBackgroundsTable: DataTableDefinition<ApplicationBackgroundProjection, ApplicationProjection>

  /**
   * Data table definition for managing cartography members in the background's group.
   * Controls which layers are included in the background's cartography group.
   */
  protected readonly membersTable: DataTableDefinition<CartographyProjection, CartographyProjection>

  /**
   * Creates an instance of the BackgroundLayersFormComponent.
   *
   * Dependencies are organized into the following categories:
   *
   * UI Services:
   * @param {MatDialog} dialog - Manages modal dialogs for entity selection
   * @param {TranslateService} translateService - Handles UI element translations
   * @param {TranslationService} translationService - Handles entity translation data
   * @param {CodeListService} codeListService - Provides access to code lists for dropdown options
   * @param {ErrorHandlerService} errorHandler - Handles error reporting and display
   * @param {UtilsService} utils - Provides common UI utilities and navigation
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
   * @param {Router} router - Handles navigation within the application
   */
  constructor(
    dialog: MatDialog,
    translateService: TranslateService,
    translationService: TranslationService,
    codeListService: CodeListService,
    loggerService: LoggerService,
    errorHandler: ErrorHandlerService,
    activatedRoute: ActivatedRoute,
    router: Router,
    protected utils: UtilsService,
    protected backgroundService: BackgroundService,
    protected cartographyService: CartographyService,
    protected roleService: RoleService,
    protected cartographyGroupService: CartographyGroupService,
    protected applicationService: ApplicationService,
    protected applicationBackgroundService: ApplicationBackgroundService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router);
    this.membersTable = this.defineMembersTable()
    this.applicationBackgroundsTable = this.defineApplicationBackgroundsTable()
    this.rolesTable = this.defineRolesTable()
  }

  /**
   * Prepares component data before fetching the entity.
   * Initializes translations, registers data tables, and resets relationships.
   */
  override async preFetchData() {
    this.initTranslations('Background', ['name', 'description'])
    this.dataTables.register(this.membersTable)
      .register(this.applicationBackgroundsTable)
      .register(this.rolesTable)
    this.cartographyGroup = null;
  }

  /**
   * Fetches the original entity by ID for editing.
   * @returns Promise resolving to the background entity with projection
   */
  override fetchOriginal(): Promise<BackgroundProjection> {
    return firstValueFrom(this.backgroundService.getProjection(BackgroundProjection, this.entityID));
  }

  /**
   * Creates a copy of an existing entity for duplication.
   * Prefixes the name with "copy_" to distinguish it from the original.
   * @returns Promise resolving to the duplicated background entity
   */
  override fetchCopy(): Promise<BackgroundProjection> {
    return firstValueFrom(this.backgroundService.getProjection(BackgroundProjection, this.duplicateID).pipe(map((copy: BackgroundProjection) => {
      copy.name = this.translateService.instant("copy_") + copy.name;
      return copy;
    })));
  }

  /**
   * Creates an empty background entity with default values.
   * @returns New empty background projection
   */
  override empty(): BackgroundProjection {
    return new BackgroundProjection()
  }

  /**
   * Fetches related data for the background entity.
   * Loads the associated cartography group.
   */
  override async fetchRelatedData() {
    this.cartographyGroup = await firstValueFrom(this.cartographyGroupService.getOriginal(this.entityToEdit.cartographyGroupId))
  }

  /**
   * Initializes the form after entity data is fetched.
   * Sets up reactive form with entity values and validation rules.
   * @throws Error if entity is undefined
   */
  override postFetchData() {
    if (!this.entityToEdit) {
      throw new Error('Cannot initialize form: entity is undefined');
    }

    this.entityForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.entityToEdit.name, [Validators.required]),
      description: new UntypedFormControl(this.entityToEdit.description),
      image: new UntypedFormControl(this.entityToEdit.image),
      active: new UntypedFormControl(this.entityToEdit.active),
    });
  }

  /**
   * Creates a new background entity in the database.
   * @returns Promise resolving to the ID of the created entity
   */
  override async createEntity(): Promise<number> {
    const entityToUpdate = this.createObject();
    const entitySaved = await firstValueFrom(this.backgroundService.create(entityToUpdate));
    return entitySaved.id;
  }

  /**
   * Updates an existing background entity with form values.
   * @returns Promise that resolves when the update is complete
   */
  override async updateEntity(): Promise<void> {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.backgroundService.update(entityToUpdate));
  }

  /**
   * Updates related data after the main entity is saved.
   * Creates or updates the associated cartography group and translations.
   *
   * @param isDuplicated - Whether this is a duplication operation
   * @returns Promise that resolves when all related updates are complete
   */
  override async updateDataRelated(isDuplicated: boolean): Promise<void> {
    if (!this.cartographyGroup || isDuplicated) {
      // The cartography group associated with this new background must have the same name
      const newCartographyGroup = Object.assign(new CartographyGroup(), {
        name: this.entityForm.value.name,
        type: constants.codeValue.cartographyPermissionType.backgroundMap,
      })
      this.cartographyGroup = await firstValueFrom(this.cartographyGroupService.create(newCartographyGroup))
      await firstValueFrom(this.entityToEdit.updateRelationEx('cartographyGroup', this.cartographyGroup))
    } else {
      const existingCartographyGroup = CartographyGroup.fromObject(this.cartographyGroup);
      existingCartographyGroup.name = this.entityForm.value.name;
      this.cartographyGroup = await firstValueFrom(this.cartographyGroupService.update(existingCartographyGroup))
    }
    await this.saveTranslations(this.entityToEdit)
  }

  /**
   * Defines the data table configuration for managing roles.
   * Sets up columns, data fetching, updating logic, and target selection.
   *
   * @returns Configured data table definition for roles
   */
  private defineRolesTable(): DataTableDefinition<Role, Role> {
    return DataTableDefinition.builder<Role, Role>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef('common.form.name', 'name', '/role/:id/roleForm', {
          id: 'id',
        }),
        this.utils.getNonEditableColumnDef('common.form.description', 'description'),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isNew() || this.cartographyGroup == null) {
          return of([]);
        }
        return this.cartographyGroup.getRelationArrayEx(Role, 'roles', {projection: 'view'})
      })
      .withRelationsUpdater(async (roles: (Role & Status)[]) => {
        await onUpdate(roles).forEach(item => this.roleService.update(item));
        await onUpdatedRelation(roles).forAll(item => this.cartographyGroup.substituteAllRelation('roles', item));
      })
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name', 100, 300),
        this.utils.getNonEditableColumnDef('common.form.description', 'description', 100, 300),
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.roleService.getAll())
      .withTargetsTitle(this.translateService.instant('entity.permissionGroup.roles.title'))
      .build();
  }

  /**
   * Defines the data table configuration for managing application-background relationships.
   * Sets up columns, data fetching, updating logic, and target selection.
   *
   * @returns Configured data table definition for application backgrounds
   */
  private defineApplicationBackgroundsTable(): DataTableDefinition<ApplicationBackgroundProjection, ApplicationProjection> {
    return DataTableDefinition.builder<ApplicationBackgroundProjection, ApplicationProjection>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef('common.form.name', 'applicationName', '/application/:id/applicationForm', {
          id: 'applicationId',
        }),
        this.utils.getEditableColumnDef('common.form.order', 'order'),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('applicationName')
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(ApplicationBackgroundProjection, 'applications', {projection: 'view'})
      })
      .withRelationsUpdater(async (applicationBackgrounds: (ApplicationBackgroundProjection & Status)[]) => {
        await onCreate(applicationBackgrounds)
          .map(item => ApplicationBackground.of(this.applicationService.createProxy(item.applicationId), this.backgroundService.createProxy(this.entityToEdit.id), item.order))
          .forEach(item => this.applicationBackgroundService.create(item));
        await onUpdate(applicationBackgrounds)
          .map(item => ApplicationBackground.of(this.applicationService.createProxy(item.applicationId), this.backgroundService.createProxy(this.entityToEdit.id), item.order))
          .forEach(item => this.applicationBackgroundService.update(item));
        await onDelete(applicationBackgrounds)
          .map(item => this.applicationBackgroundService.createProxy(item.id))
          .forEach(item => this.applicationBackgroundService.delete(item));
        applicationBackgrounds.forEach(item => item.newItem = false);
      })
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name', 100, 400),
        this.utils.getNonEditableColumnDef('common.form.description', 'description', 100, 600),
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.applicationService.getAllProjection(ApplicationProjection))
      .withTargetInclude((applicationBackgrounds: (ApplicationBackgroundProjection)[]) =>
        (item: ApplicationProjection) => !applicationBackgrounds.some((applicationBackground) => applicationBackground.applicationId === item.id))
      .withTargetToRelation((items: ApplicationProjection[]) => items.map(item => ApplicationBackgroundProjection.of(item, this.entityToEdit, 0)))
      .withTargetsTitle(this.translateService.instant('entity.permissionGroup.applications.title'))
      .withTargetsOrder('name')
      .build();
  }

  /**
   * Defines the data table configuration for managing cartography members.
   * Sets up columns, data fetching, updating logic, and target selection.
   *
   * @returns Configured data table definition for cartography members
   */
  private defineMembersTable(): DataTableDefinition<CartographyProjection, CartographyProjection> {
    return DataTableDefinition.builder<CartographyProjection, CartographyProjection>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef('common.form.name', 'name', '/layers/:id/layersForm', {
          id: 'id',
        }),
        this.utils.getNonEditableColumnDef('entity.permissionGroup.layers.layerslist', 'layers'),
        this.utils.getRouterLinkColumnDef('entity.permissionGroup.layers.service', 'serviceName', '/service/:id/serviceForm', {
          id: 'serviceId',
        }),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isNew() || this.cartographyGroup == null) {
          return of([]);
        }
        return this.cartographyGroup.getRelationArrayEx(CartographyProjection, 'members', {projection: 'view'})
      })
      .withRelationsUpdater(async (cartographies: (CartographyProjection & Status)[]) => {
        await onUpdatedRelation(cartographies)
          .map(item => this.cartographyService.createProxy(item.id))
          .forAll(item => this.cartographyGroup.substituteAllRelation('members', item));
      })
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name', 100, 300),
        this.utils.getNonEditableColumnDef('entity.permissionGroup.layers.layerslist', 'layers', 100, 300),
        this.utils.getNonEditableColumnDef('entity.permissionGroup.layers.service', 'serviceName', 100, 300),
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.cartographyService.getAllProjection(CartographyProjection))
      .withTargetInclude((cartographies: (CartographyProjection & Status)[]) => (item: CartographyProjection) => {
        return !cartographies.some((cartography) => cartography.id === item.id);
      })
      .withTargetsTitle(this.translateService.instant('entity.permissionGroup.layers.title'))
      .build();
  }

  /**
   * Creates a Background object from the current form values.
   *
   * @param id - Optional ID for the new object, used when updating
   * @returns New Background instance populated with form values
   */
  private createObject(id: number = null): Background {
    let safeToEdit = BackgroundProjection.fromObject(this.entityToEdit);
    safeToEdit = Object.assign(safeToEdit,
      this.entityForm.value,
      {
        id: id,
      }
    );
    return Background.fromObject(safeToEdit);
  }
}
