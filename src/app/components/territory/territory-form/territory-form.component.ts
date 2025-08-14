import {ActivatedRoute, Router} from '@angular/router';
import {
  CartographyAvailability,
  CartographyAvailabilityProjection,
  CartographyAvailabilityService,
  CartographyProjection,
  CartographyService,
  CodeList,
  CodeListService,
  Envelope,
  Point,
  Role,
  RoleService,
  Task,
  TaskAvailability,
  TaskAvailabilityProjection,
  TaskAvailabilityService,
  TaskProjection,
  TaskService,
  Territory,
  TerritoryGroupType,
  TerritoryGroupTypeService,
  TerritoryProjection,
  TerritoryService,
  TerritoryType,
  TerritoryTypeService,
  TranslationService,
  User,
  UserConfiguration,
  UserConfigurationProjection,
  UserConfigurationService,
  UserService,
} from '@app/domain';
import {DataTable2Definition, DataTableDefinition} from '@app/components/data-tables.util';
import {EMPTY, firstValueFrom} from 'rxjs';
import {onCreate, onDelete, onUpdate, onUpdatedRelation, Status} from '@app/frontend-gui/src/lib/public_api';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {BaseFormComponent} from "@app/components/base-form.component";
import {Component} from '@angular/core';
import {Configuration} from "@app/core/config/configuration";
import {ErrorHandlerService} from "@app/services/error-handler.service";
import {LoggerService} from '@app/services/logger.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSelectChange} from '@angular/material/select';
import {TranslateService} from "@ngx-translate/core";
import {UtilsService} from '@app/services/utils.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-territory-form',
  templateUrl: './territory-form.component.html',
  styleUrls: ['./territory-form.component.scss'],
})
export class TerritoryFormComponent extends BaseFormComponent<TerritoryProjection> {
  readonly config = Configuration.TERRITORY;

  /**
   * DataTables
   */
  /**
   * Data table definition for managing user configuration projections (permits) related to a territory.
   */
  readonly permitsTable: DataTable2Definition<UserConfigurationProjection, User, Role>;

  /**
   * Data table definition for managing the "members of" relationship between territory projections.
   */
  readonly membersOfTable: DataTableDefinition<TerritoryProjection, TerritoryProjection>;

  /**
   * Data table definition for managing the "members" relationship between territory projections.
   */
  readonly membersTable: DataTableDefinition<TerritoryProjection, TerritoryProjection>;

  /**
   * Data table definition for managing cartography availabilities related to a territory.
   */
  readonly cartographiesTable: DataTableDefinition<CartographyAvailabilityProjection, CartographyProjection>;

  /**
   * Data table definition for managing task availabilities related to a territory.
   */
  readonly tasksTable: DataTableDefinition<TaskAvailabilityProjection, Task>;

  /**
   * List of available scope types for a territory.
   * Populated during data prefetch.
   */
  scopeTypes: Array<CodeList> = [];

  /**
   * List of available territory group types.
   * Populated during data prefetch.
   */
  territoryGroups: Array<TerritoryGroupType> = [];

  /**
   * List of available territory types.
   * Populated during data prefetch.
   */
  territoryTypes: Array<TerritoryType> = [];

  /**
   * Indicates if the current territory type is a top type.
   * Set during form initialization.
   */
  currentTypeTop: boolean;

  /**
   * Indicates if the current territory type is a bottom type.
   * Set during form initialization.
   */
  currentTypeBottom: boolean;

  /**
   * The currently selected territory type.
   * Set during form initialization and when the type changes.
   */
  currentTerritoryType: TerritoryType;

  /**
   * Constructs a new instance of the TerritoryFormComponent.
   * Injects all required Angular services and application-specific services.
   *
   * @param dialog - Material dialog service for opening dialogs
   * @param translateService - ngx-translate service for translations
   * @param translationService - Service for managing translations
   * @param codeListService - Service for retrieving code lists
   * @param loggerService - Service for logging
   * @param errorHandler - Service for handling errors
   * @param activatedRoute - Activated route for accessing route parameters
   * @param router - Angular router for navigation
   * @param territoryService - Service for managing territories
   * @param userService - Service for managing users
   * @param roleService - Service for managing roles
   * @param territoryGroupTypeService - Service for managing territory group types
   * @param territoryTypeService - Service for managing territory types
   * @param cartographyService - Service for managing cartographies
   * @param taskService - Service for managing tasks
   * @param userConfigurationService - Service for managing user configurations
   * @param taskAvailabilityService - Service for managing task availabilities
   * @param cartographyAvailabilityService - Service for managing cartography availabilities
   * @param utils - Utility service
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
    private territoryService: TerritoryService,
    private userService: UserService,
    private roleService: RoleService,
    private territoryGroupTypeService: TerritoryGroupTypeService,
    private territoryTypeService: TerritoryTypeService,
    private cartographyService: CartographyService,
    private taskService: TaskService,
    private userConfigurationService: UserConfigurationService,
    private taskAvailabilityService: TaskAvailabilityService,
    private cartographyAvailabilityService: CartographyAvailabilityService,
    public utils: UtilsService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router);
    this.permitsTable = this.definePermitsTable();
    this.membersOfTable = this.defineMemberOfTable();
    this.membersTable = this.defineMembersTable();
    this.cartographiesTable = this.defineCartographiesTable();
    this.tasksTable = this.defineTasksTable();
  }

  /**
   * Prefetches required data for the territory form.
   *
   * Registers all data tables, initializes translations, and loads code lists.
   * Fetches territory groups, territory types, and scope types in parallel,
   * then populates the corresponding arrays and sorts territory types by name.
   *
   * @override
   * @returns {Promise<void>} A promise that resolves when all data is prefetched.
   */
  override async preFetchData(): Promise<void> {
    this.dataTables.register(this.permitsTable)
      .register(this.membersOfTable)
      .register(this.membersTable)
      .register(this.cartographiesTable)
      .register(this.tasksTable);
    this.initTranslations('Territory', ['name', 'description'])
    await this.initCodeLists(['territory.scope']);
    const [territoryGroups, territoryTypes, scopeTypes] = await Promise.all([
      firstValueFrom(this.territoryGroupTypeService.getAll()),
      firstValueFrom(this.territoryTypeService.getAll()),
      firstValueFrom(this.utils.getCodeListValues('territory.scope'))
    ]);

    this.territoryGroups.push(...territoryGroups);
    this.territoryTypes.push(...territoryTypes);
    this.territoryTypes.sort((a, b) => a.name.localeCompare(b.name));
    this.scopeTypes.push(...scopeTypes);
  }

  /**
   * Fetches the original entity by ID.
   * @returns Promise of a Territory entity with projection
   */
  override async fetchOriginal(): Promise<TerritoryProjection> {
    return firstValueFrom(this.territoryService.getProjection(TerritoryProjection, this.entityID));
  }

  /**
   * Creates a copy of an existing entity for duplication.
   * @returns Promise of a duplicated Territory entity with projection
   */
  override async fetchCopy(): Promise<TerritoryProjection> {
    return firstValueFrom(this.territoryService.getProjection(TerritoryProjection, this.duplicateID).pipe(
      map((copy: TerritoryProjection) => {
        copy.name = this.translateService.instant("copy_") + copy.name;
        return copy;
      })
    ));
  }

  /**
   * Creates an empty entity with default values.
   * @returns New Territory entity with projection with default values
   */
  override empty(): TerritoryProjection {
    return Object.assign(new TerritoryProjection(), {
      blocked: true,
    });
  }

  /**
   * Fetches related data for the entity.
   * Loads translations for the current entity.
   */
  override async fetchRelatedData(): Promise<void> {
    return this.loadTranslations(this.entityToEdit);
  }

  /**
   * Initializes form data after the entity is fetched.
   * Sets up reactive form with entity values and validation rules.
   * @throws Error if entity is undefined
   */
  override postFetchData(): void {
    if (!this.entityToEdit) {
      throw new Error('Cannot initialize form: entity is undefined');
    }

    this.currentTerritoryType = this.territoryTypes.find((element) => element.id == this.entityToEdit.typeId) || this.territoryTypes[0];
    this.currentTypeBottom = this.currentTerritoryType.bottomType;
    this.currentTypeTop = this.currentTerritoryType.topType;

    this.entityForm = new UntypedFormGroup({
      code: new UntypedFormControl(this.entityToEdit.code, [Validators.required]),
      name: new UntypedFormControl(this.entityToEdit.name, [Validators.required]),
      description: new UntypedFormControl(this.entityToEdit.description, []),
      territorialAuthorityAddress: new UntypedFormControl(this.entityToEdit.territorialAuthorityAddress, []),
      territorialAuthorityLogo: new UntypedFormControl(this.entityToEdit.territorialAuthorityLogo, []),
      groupTypeId: new UntypedFormControl(this.entityToEdit.groupTypeId, []),
      typeId: new UntypedFormControl(this.entityToEdit.typeId, [Validators.required]),
      extentMinX: new UntypedFormControl(this.entityToEdit.extent?.minX, []),
      extentMaxX: new UntypedFormControl(this.entityToEdit.extent?.maxX, []),
      extentMinY: new UntypedFormControl(this.entityToEdit.extent?.minY, []),
      extentMaxY: new UntypedFormControl(this.entityToEdit.extent?.maxX, []),
      note: new UntypedFormControl(this.entityToEdit.note, []),
      srs: new UntypedFormControl(this.entityToEdit.srs, []),
      blocked: new UntypedFormControl(this.entityToEdit.blocked ?? true, [Validators.required]),
      defaultZoomLevel: new UntypedFormControl(this.entityToEdit.defaultZoomLevel, []),
      centerPointX: new UntypedFormControl(this.entityToEdit.center?.x, []),
      centerPointY: new UntypedFormControl(this.entityToEdit.center?.y),
    });
  }

  /**
   * Creates a new entity or duplicates an existing one.
   * @returns Promise of created entity ID
   */
  override async createEntity(): Promise<number> {
    const territory = this.createObject();
    const response = await firstValueFrom(this.territoryService.create(territory));
    return response.id;
  }

  /**
   * Updates an existing entity with form values.
   */
  override async updateEntity(): Promise<void> {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.territoryService.update(entityToUpdate));
  }

  /**
   * Updates related data after entity save.
   * @param isDuplicated - Whether this is a duplication operation
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override async updateDataRelated(isDuplicated: boolean): Promise<void> {
    const entityToUpdate = this.createObject(this.entityID);
    await this.saveTranslations(entityToUpdate);
    await firstValueFrom(entityToUpdate.updateRelationEx("type", entityToUpdate.type));
    await firstValueFrom(entityToUpdate.updateRelationEx("groupType", entityToUpdate.groupType));
  }

  /**
   * Checks form validity and application-specific rules.
   * @returns boolean indicating if save is allowed
   */
  override canSave(): boolean {
    return this.entityForm.valid && this.validateEnvelope(
      this.entityForm.value.extentMinX,
      this.entityForm.value.extentMaxX,
      this.entityForm.value.extentMinY,
      this.entityForm.value.extentMaxY
    ) && this.validatePoint(
      this.entityForm.value.centerPointX,
      this.entityForm.value.centerPointY
    );
  }

  public validateEnvelope(minX: any, maxX: any, minY: any, maxY: any): boolean {
    const isNull = [minX, maxX, minY, maxY].every(element => element == null);
    if (isNull) {
      return true
    } else {
      console.log("validate envelope:", this.normalizeEnvelope(minX, maxX, minY, maxY))
      return this.normalizeEnvelope(minX, maxX, minY, maxY) !== null;
    }
  }

  onTerritoryTypeChanged(event: MatSelectChange) {
    const territoryType = this.territoryTypes.find(
      (element) => element.id == event.value
    );
    this.currentTypeBottom = territoryType.bottomType;
    this.currentTypeTop = territoryType.topType;
  }

  /**
   * Creates a Territory object from the current form values.
   *
   * @param id - Optional ID for the new object, used when updating
   * @returns New Territory instance populated with form values
   */
  private createObject(id: number = null): Territory {
    let safeToEdit = TerritoryProjection.fromObject(this.entityToEdit);
    safeToEdit = Object.assign(safeToEdit, this.entityForm.value, {
      id: id,
      groupType: this.territoryGroupTypeService.createProxy(this.entityForm.value.groupTypeId),
      type: this.territoryTypeService.createProxy(this.entityForm.value.typeId),
      extent: this.normalizeEnvelope(
        this.entityForm.value.extentMinX,
        this.entityForm.value.extentMaxX,
        this.entityForm.value.extentMinY,
        this.entityForm.value.extentMaxY,
      ),
      center: this.normalizePoint(
        this.entityForm.value.centerPointX,
        this.entityForm.value.centerPointY
      )
    });
    return Territory.fromObject(safeToEdit);
  }

  /**
   * Normalizes extent values by parsing them as floats.
   * Returns an object with minX, maxX, minY, and maxY if all values are valid numbers,
   * otherwise returns null if any value is NaN.
   *
   * @param minX - The minimum X value (can be any type, will be parsed as float)
   * @param maxX - The maximum X value (can be any type, will be parsed as float)
   * @param minY - The minimum Y value (can be any type, will be parsed as float)
   * @param maxY - The maximum Y value (can be any type, will be parsed as float)
   * @returns An Envelope with normalized extent values or null if any value is invalid
   */
  private normalizeEnvelope(minX: any, maxX: any, minY: any, maxY: any): Envelope | null {
    const newMinX = parseFloat(minX);
    const newMaxX = parseFloat(maxX);
    const newMinY = parseFloat(minY);
    const newMaxY = parseFloat(maxY);
    const isNan = [newMinX, newMaxX, newMinY, newMaxY].some(element => Number.isNaN(element));
    if (isNan) {
      return null;
    } else {
      return {
        minX: newMinX,
        maxX: newMaxX,
        minY: newMinY,
        maxY: newMaxY,
      } as Envelope
    }
  }

  /**
   * Normalizes point coordinates by parsing x and y as floats.
   * Returns an object with x and y if both are valid numbers, otherwise returns null.
   *
   * @param x - The x coordinate (can be any type, will be parsed as float)
   * @param y - The y coordinate (can be any type, will be parsed as float)
   * @returns A Point with normalized x and y values or null if any value is invalid
   */
  private normalizePoint(x: any, y: any): Point | null {
    const newX = parseFloat(x);
    const newY = parseFloat(y);
    const isNan = [newX, newY].some(element => Number.isNaN(element));
    if (isNan) {
      return null;
    } else {
      return {
        x: newX,
        y: newY
      } as Point
    }
  }

  private validatePoint(x: any, y: any): boolean {
    const isNull = [x, y].every(element => element == null);
    if (isNull) {
      return true
    } else {
      console.log("validate point:", this.normalizePoint(x, y))
      return this.normalizePoint(x, y) !== null;
    }
  }

  /**
   * Defines the data table for managing user configuration projections (permits) related to a territory.
   * Sets up columns, fetchers, updaters, and relation/target mapping for the permits' table.
   *
   * @returns {DataTable2Definition<UserConfigurationProjection, User, Role>} The configured permits data table definition.
   */
  private definePermitsTable(): DataTable2Definition<UserConfigurationProjection, User, Role> {
    return DataTable2Definition.builder<UserConfigurationProjection, User, Role>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('entity.territory.permissions.user', 'user'),
        this.utils.getNonEditableColumnDef('entity.territory.permissions.role', 'role'),
        this.utils.getBooleanColumnDef(
          'entity.territory.permissions.appliesToChildrenTerritories',
          'appliesToChildrenTerritories',
          true
        ),
        this.utils.getStatusColumnDef(),
      ])
      .withTargetsLeftColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'username'),
      ])
      .withTargetsRightColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
      ])
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return EMPTY;
        }
        const idToUse = this.entityID == -1 ? this.duplicateID : this.entityID;
        const query = {
          params: [
            {
              key: 'territory.id',
              value: idToUse
            }
          ]
        };
        return this.userConfigurationService.getAllProjection(UserConfigurationProjection, query);
      })
      .withTargetsLeftFetcher(() => this.userService.getAll())
      .withTargetsRightFetcher(() => this.roleService.getAll())
      .withRelationsDuplicate((relation) => UserConfigurationProjection.fromObject(relation))
      .withRelationsUpdater(async (userConfigurations: (UserConfigurationProjection & Status)[]) => {
        await onCreate(userConfigurations).forEach(userConfiguration => this.userConfigurationService.create(
          Object.assign(UserConfiguration.fromObject(userConfiguration), {
            user: this.userService.createProxy(userConfiguration.userId),
            territory: this.territoryService.createProxy(this.entityToEdit.id),
            role: this.roleService.createProxy(userConfiguration.roleId)
          })));
        await onUpdate(userConfigurations).forEach(userConfiguration => this.userConfigurationService.update(
          Object.assign(UserConfiguration.fromObject(userConfiguration), {
            user: this.userService.createProxy(userConfiguration.userId),
            territory: this.territoryService.createProxy(this.entityToEdit.id),
            role: this.roleService.createProxy(userConfiguration.roleId)
          })));
        await onDelete(userConfigurations).forEach(userConfiguration => {
          const newItem = this.userConfigurationService.createProxy(userConfiguration.id);
          return this.userConfigurationService.delete(newItem);
        })
      })
      .withTargetsTitle('entity.territory.permissions.title')
      .withTargetsLeftTitle('entity.territory.users')
      .withTargetsRightTitle('entity.territory.roles')
      .withTargetsOrder(['username', 'name'])
      .withRelationsOrder(['user', 'role'])
      .withTargetToRelation((users, roles) => {
        const itemsToAdd: UserConfigurationProjection[] = [];
        roles.forEach(role => {
          users.forEach(user => {
            itemsToAdd.push(
              Object.assign(new UserConfigurationProjection(), {
                role: role.name,
                roleId: role.id,
                userId: user.id,
                user: user.username,
                appliesToChildrenTerritories: false,
              }))
          })
        })
        return itemsToAdd;
      })
      .build();
  }

  /**
   * Defines the data table for managing the "members of" relationship between territory projections.
   * Configures columns, fetchers, updaters, and ordering for the memberOf table.
   *
   * @returns {DataTableDefinition<TerritoryProjection, TerritoryProjection>} The configured memberOf data table definition.
   */
  private defineMemberOfTable(): DataTableDefinition<TerritoryProjection, TerritoryProjection> {
    return DataTableDefinition.builder<TerritoryProjection, TerritoryProjection>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef(
          'common.form.name',
          'name',
          '/territory/:id/territoryForm',
          {
            id: 'id',
          }
        ),
        this.utils.getNonEditableColumnDef('common.form.type', 'typeName'),
        this.utils.getNonEditableColumnDef('common.form.code', 'code'),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return EMPTY;
        }
        return this.entityToEdit.getRelationArrayEx(TerritoryProjection, 'members', {projection: 'view'})
      })
      .withRelationsOrder('name')
      .withTargetsTitle('entity.territory.memberOf.title')
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
        this.utils.getNonEditableColumnDef('common.form.type', 'typeName'),
        this.utils.getNonEditableColumnDef('common.form.code', 'code'),
        this.utils.getStatusColumnDef()
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.territoryService.getAllProjection(TerritoryProjection).pipe(
        map((territories: TerritoryProjection[]) => territories.filter(territory => !territory.typeTopType && territory.typeId !== this.currentTerritoryType.id))
      ))
      .withRelationsUpdater(async (territories: (TerritoryProjection & Status)[]) => {
        await onUpdatedRelation(territories)
          .map((item) => this.territoryService.createProxy(item.id))
          .forAll((items) => this.entityToEdit.substituteAllRelation('memberOf', items));
      })
      .build();
  }

  /**
   * Defines the data table for managing the "members" relationship between territory projections.
   * Configures columns, fetchers, updaters, and ordering for the members' table.
   *
   * @returns {DataTableDefinition<TerritoryProjection, TerritoryProjection>} The configured members' data table definition.
   */
  private defineMembersTable(): DataTableDefinition<TerritoryProjection, TerritoryProjection> {
    return DataTableDefinition.builder<TerritoryProjection, TerritoryProjection>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef(
          'common.form.name',
          'name',
          '/territory/:id/territoryForm',
          {
            id: 'id',
          }
        ),
        this.utils.getNonEditableColumnDef('common.form.type', 'typeName'),
        this.utils.getNonEditableColumnDef('common.form.code', 'code'),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return EMPTY;
        }
        return this.entityToEdit.getRelationArrayEx(TerritoryProjection, 'members', {projection: 'view'})
      })
      .withRelationsOrder('name')
      .withTargetsTitle('entity.territory.members.title')
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
        this.utils.getNonEditableColumnDef('common.form.type', 'typeName'),
        this.utils.getNonEditableColumnDef('common.form.code', 'code'),
        this.utils.getStatusColumnDef()
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.territoryService.getAllProjection(TerritoryProjection).pipe(
        map((territories: TerritoryProjection[]) => territories.filter(territory => !territory.typeTopType && territory.typeId !== this.currentTerritoryType.id))
      ))
      .withRelationsUpdater(async (territories: (TerritoryProjection & Status)[]) => {
        await onUpdatedRelation(territories)
          .map((item) => this.territoryService.createProxy(item.id))
          .forAll((items) => this.entityToEdit.substituteAllRelation('members', items));
      })
      .build()
  }

  /**
   * Defines the data table for managing cartographies related to a territory.
   * Configures columns, fetchers, updaters, and ordering for the cartographies table.
   *
   * @returns {DataTableDefinition<Cartography, Cartography>} The configured cartographies data table definition.
   */
  private defineCartographiesTable(): DataTableDefinition<CartographyAvailabilityProjection, CartographyProjection> {
    return DataTableDefinition.builder<CartographyAvailabilityProjection, CartographyProjection>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'cartographyName'),
        this.utils.getNonEditableColumnDef('entity.service.label', 'cartographyServiceName'),
        {
          ...this.utils.getNonEditableColumnDef('entity.cartography.plural', 'cartographyLayers'),
          ...this.utils.getArrayValueParser(),
        },
        this.utils.getStatusColumnDef(),
      ])
      .withRelationsFetcher(() => {
        if (this.isEdition()) {
          return this.entityToEdit.getRelationArrayEx(CartographyAvailabilityProjection, 'cartographyAvailabilities', {projection: 'view'})
        } else {
          return EMPTY;
        }
      })
      .withRelationsOrder(['name'])
      .withRelationsUpdater(async (cartographies: (CartographyAvailabilityProjection & Status)[]) => {
        await onDelete(cartographies).forEach(availability => {
          const itemToDelete = this.cartographyAvailabilityService.createProxy(availability.id);
          return this.cartographyAvailabilityService.delete(itemToDelete);
        })
        await onCreate(cartographies).forEach(availability => {
          return this.cartographyAvailabilityService.create(
            CartographyAvailability.of(
              this.territoryService.createProxy(this.entityToEdit.id),
              this.cartographyService.createProxy(availability.cartographyId)
            )
          );
        })
      })
      .withTargetsFetcher(() => this.cartographyService.getAllProjection(CartographyProjection))
      .withTargetsTitle('entity.territory.cartography.title')
      .withTargetsOrder(['name'])
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
        this.utils.getNonEditableColumnDef('entity.service.label', 'serviceName'),
        {
          ...this.utils.getNonEditableColumnDef('entity.cartography.plural', 'layers'),
          ...this.utils.getArrayValueParser(),
        },
      ])
      .withTargetToRelation((items) => {
        return items.map(item => CartographyAvailabilityProjection.of(this.entityToEdit, item))
      })
      .withFieldRestriction('id')
      .build();
  }

  private defineTasksTable(): DataTableDefinition<TaskAvailabilityProjection, TaskProjection> {
    return DataTableDefinition.builder<TaskAvailabilityProjection, TaskProjection>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'taskName'),
        this.utils.getNonEditableColumnDef('common.form.type', 'taskTypeName', 300),
        this.utils.getStatusColumnDef(),
      ])
      .withRelationsOrder(['taskTypeName'])
      .withRelationsFetcher(() => {
        if (this.isEdition()) {
          return this.entityToEdit.getRelationArrayEx(TaskAvailabilityProjection, 'taskAvailabilities', {projection: 'view'})
        } else {
          return EMPTY;
        }
      })
      .withRelationsUpdater(async (tasks: (TaskAvailabilityProjection & Status)[]) => {
        await onDelete(tasks).forEach(task => {
          const deletedItem = this.taskAvailabilityService.createProxy(task.id);
          return this.taskAvailabilityService.delete(deletedItem);
        })
        await onCreate(tasks).forEach(task => {
          return this.taskAvailabilityService.create(
            TaskAvailability.of(
              this.taskService.createProxy(task.taskId),
              this.territoryService.createProxy(this.entityToEdit.id)
            )
          );
        })
      })
      .withTargetsTitle('entity.territory.tasks.title')
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
        this.utils.getNonEditableColumnDef('common.form.type', 'typeName', 300),
        this.utils.getStatusColumnDef()
      ])
      .withTargetsFetcher(() => this.taskService.getAllProjection(TaskProjection))
      .withFieldRestriction('taskId')
      .withTargetsOrder(['typeName'])
      .withTargetToRelation((tasks) => tasks.map(task => TaskAvailabilityProjection.of(task, this.entityToEdit)))
      .build();
  }
}
