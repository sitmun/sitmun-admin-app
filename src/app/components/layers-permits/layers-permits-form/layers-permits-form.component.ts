import { Component } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationProjection,
  ApplicationService,
  CartographyGroup,
  CartographyGroupProjection,
  CartographyGroupService,
  CartographyProjection,
  CartographyService,
  CodeList,
  CodeListService,
  Role,
  RoleService,
  TranslationService,
} from '@app/domain';
import { UtilsService } from '@app/services/utils.service';
import { firstValueFrom, of } from 'rxjs';
import {
  onUpdate,
  onUpdatedRelation,
  Status,
} from '@app/frontend-gui/src/lib/public_api';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BaseFormComponent } from '@app/components/base-form.component';
import { DataTableDefinition } from '@app/components/data-tables.util';
import { ErrorHandlerService } from '@app/services/error-handler.service';
import { constants } from '@environments/constants';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'app-layers-permits-form',
  templateUrl: './layers-permits-form.component.html',
  styles: [],
})
/**
 * Form component for managing layer permissions (cartography groups).
 * Extends BaseFormComponent to provide CRUD operations for CartographyGroupProjection entities.
 * Handles three main aspects:
 * 1. Basic cartography group information (name and type)
 * 2. Role assignments for access control
 * 3. Layer membership management
 * 4. Application relationships
 */
export class LayersPermitsFormComponent extends BaseFormComponent<CartographyGroupProjection> {
  /**
   * Types of permission groups available.
   * Filtered to only show relevant types for this form.
   */
  private permissionGroupTypes: CodeList[] = [];

  /**
   * Data table definition for managing roles associated with this cartography group.
   * Manages access permissions for the cartography group through role assignments.
   */
  protected readonly rolesTable: DataTableDefinition<Role, Role>;

  /**
   * Data table definition for managing application relationships.
   * Controls which applications can use this cartography group as situation map.
   */
  protected readonly applicationsTable: DataTableDefinition<
    ApplicationProjection,
    ApplicationProjection
  >;

  /**
   * Data table definition for managing cartography members in the cartography group.
   * Controls which layers are included in the cartography group.
   */
  protected readonly membersTable: DataTableDefinition<
    CartographyProjection,
    CartographyProjection
  >;

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
    protected cartographyService: CartographyService,
    protected roleService: RoleService,
    protected cartographyGroupService: CartographyGroupService,
    protected applicationService: ApplicationService
  ) {
    super(
      dialog,
      translateService,
      translationService,
      codeListService,
      loggerService,
      errorHandler,
      activatedRoute,
      router
    );
    this.membersTable = this.defineMembersTable();
    this.rolesTable = this.defineRolesTable();
    this.applicationsTable = this.defineApplicationTable();
  }

  /**
   * Prepares component data before fetching the entity.
   * Initializes data tables and loads permission group types from code lists.
   * Filters and sorts the permission types to show only relevant options.
   */
  override async preFetchData() {
    this.dataTables
      .register(this.rolesTable)
      .register(this.applicationsTable)
      .register(this.membersTable);
    await this.initCodeLists(['cartographyPermission.type']);
    this.permissionGroupTypes = this.codeList(
      'cartographyPermission.type'
    ).filter(
      (item) =>
        item.value === constants.codeValue.cartographyPermissionType.report ||
        item.value ===
          constants.codeValue.cartographyPermissionType.cartographyGroup ||
        item.value === constants.codeValue.cartographyPermissionType.locationMap
    );
    this.permissionGroupTypes.sort((a, b) =>
      a.description.localeCompare(b.description)
    );
  }

  /**
   * Fetches the original entity by ID for editing.
   * @returns Promise resolving to the background entity with projection
   */
  override fetchOriginal(): Promise<CartographyGroupProjection> {
    return firstValueFrom(
      this.cartographyGroupService.getProjection(
        CartographyGroupProjection,
        this.entityID
      )
    );
  }

  /**
   * Creates a copy of an existing entity for duplication.
   * Prefixes the name with "copy_" to distinguish it from the original.
   * @returns Promise resolving to the duplicated background entity
   */
  override fetchCopy(): Promise<CartographyGroupProjection> {
    return firstValueFrom(
      this.cartographyGroupService
        .getProjection(CartographyGroupProjection, this.duplicateID)
        .pipe(
          map((copy: CartographyGroupProjection) => {
            copy.name = this.translateService.instant('copy_') + copy.name;
            return copy;
          })
        )
    );
  }

  /**
   * Creates an empty CartographyGroupProjection instance.
   * Used when creating a new cartography group.
   * @returns New empty CartographyGroupProjection instance
   */
  override empty(): CartographyGroupProjection {
    return new CartographyGroupProjection();
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
      name: new UntypedFormControl(this.entityToEdit.name, [
        Validators.required,
      ]),
      type: new UntypedFormControl(this.entityToEdit.type, [
        Validators.required,
      ]),
    });
  }

  /**
   * Creates a new cartography group entity in the database.
   * @returns Promise resolving to the ID of the created entity
   */
  override async createEntity(): Promise<number> {
    const entityToUpdate = this.createObject();
    const entitySaved = await firstValueFrom(
      this.cartographyGroupService.create(entityToUpdate)
    );
    return entitySaved.id;
  }

  /**
   * Updates an existing cartography group entity with form values.
   * @returns Promise that resolves when the update is complete
   */
  override async updateEntity(): Promise<void> {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.cartographyGroupService.update(entityToUpdate));
  }

  /**
   * Defines the data table configuration for managing roles.
   * Sets up columns, data fetching, updating logic, and target selection.
   *
   * @returns Configured data table definition for roles
   */
  private defineRolesTable(): DataTableDefinition<Role, Role> {
    return DataTableDefinition.builder<Role, Role>(
      this.dialog,
      this.errorHandler
    )
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef(
          'common.form.name',
          'name',
          '/role/:id/roleForm',
          {
            id: 'id',
          }
        ),
        this.utils.getNonEditableColumnDef(
          'common.form.description',
          'description'
        ),
        this.utils.getStatusColumnDef(),
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(Role, 'roles', {
          projection: 'view',
        });
      })
      .withRelationsUpdater(async (roles: (Role & Status)[]) => {
        await onUpdate(roles).forEach((item) => this.roleService.update(item));
        await onUpdatedRelation(roles).forAll((item) =>
          this.entityToEdit.substituteAllRelation('roles', item)
        );
      })
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef(
          'common.form.name',
          'name',
          100,
          300
        ),
        this.utils.getNonEditableColumnDef(
          'common.form.description',
          'description',
          100,
          300
        ),
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.roleService.getAll())
      .withTargetsTitle(
        this.translateService.instant('entity.permissiongroup.roles.title')
      )
      .build();
  }

  /**
   * Defines the data table configuration for managing application-background relationships.
   * Sets up columns, data fetching, updating logic, and target selection.
   *
   * @returns Configured data table definition for application backgrounds
   */
  private defineApplicationTable(): DataTableDefinition<
    ApplicationProjection,
    ApplicationProjection
  > {
    return DataTableDefinition.builder<
      ApplicationProjection,
      ApplicationProjection
    >(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef(
          'common.form.name',
          'name',
          '/application/:id/applicationForm',
          {
            id: 'id',
          }
        ),
        this.utils.getEditableColumnDef(
          'common.form.description',
          'description'
        ),
        this.utils.getStatusColumnDef(),
      ])
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(Role, 'applications', {
          projection: 'view',
        });
      })
      .withRelationsOrder('applicationName')
      .build();
  }

  /**
   * Defines the data table configuration for managing cartography members.
   * Sets up columns, data fetching, updating logic, and target selection.
   *
   * @returns Configured data table definition for cartography members
   */
  private defineMembersTable(): DataTableDefinition<
    CartographyProjection,
    CartographyProjection
  > {
    return DataTableDefinition.builder<
      CartographyProjection,
      CartographyProjection
    >(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef(
          'common.form.name',
          'name',
          '/layers/:id/layersForm',
          {
            id: 'id',
          },
          100,
          300
        ),
        this.utils.getNonEditableColumnDef(
          'entity.permissiongroup.layers.layerslist',
          'layers',
          100,
          300
        ),
        this.utils.getRouterLinkColumnDef(
          'entity.permissiongroup.layers.service',
          'serviceName',
          '/service/:id/serviceForm',
          {
            id: 'serviceId',
          },
          100,
          300
        ),
        this.utils.getStatusColumnDef(),
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(
          CartographyProjection,
          'members',
          { projection: 'view' }
        );
      })
      .withRelationsUpdater(
        async (cartographies: (CartographyProjection & Status)[]) => {
          await onUpdatedRelation(cartographies)
            .map((item) => this.cartographyService.createProxy(item.id))
            .forAll((item) =>
              this.entityToEdit.substituteAllRelation('members', item)
            );
        }
      )
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef(
          'common.form.name',
          'name',
          100,
          300
        ),
        this.utils.getNonEditableColumnDef(
          'entity.permissiongroup.layers.layerslist',
          'layers',
          100,
          300
        ),
        this.utils.getNonEditableColumnDef(
          'entity.permissiongroup.layers.service',
          'serviceName',
          100,
          300
        ),
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() =>
        this.cartographyService.getAllProjection(CartographyProjection)
      )
      .withTargetInclude(
        (cartographies: (CartographyProjection & Status)[]) =>
          (item: CartographyProjection) => {
            return !cartographies.some(
              (cartography) => cartography.id === item.id
            );
          }
      )
      .withTargetsTitle(
        this.translateService.instant('entity.permissiongroup.layers.title')
      )
      .build();
  }

  /**
   * Creates a CartographyGroup object from the current form values.
   * Used when saving or updating the entity.
   * @param id - Optional ID for the new object. If provided, indicates an update operation
   * @returns New CartographyGroup instance populated with form values
   */
  private createObject(id: number = null): CartographyGroup {
    let safeToEdit = CartographyGroupProjection.fromObject(this.entityToEdit);
    safeToEdit = Object.assign(safeToEdit, this.entityForm.value, {
      id: id,
    });
    return CartographyGroup.fromObject(safeToEdit);
  }

  /**
   * Getter that checks if the current permission group is of type locationMap.
   * Used to conditionally render UI elements specific to location maps.
   * @returns boolean indicating if the current type is locationMap
   */
  get isLocationMap(): boolean {
    return (
      this.entityForm?.get('type')?.value ===
      constants.codeValue.cartographyPermissionType.locationMap
    );
  }
}
