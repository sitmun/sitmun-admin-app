import {Component} from '@angular/core';
import {AbstractControl, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSelectChange} from '@angular/material/select';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from "@ngx-translate/core";
import { firstValueFrom, of} from 'rxjs';
import {map} from 'rxjs/operators';

import {BaseFormComponent} from "@app/components/base-form.component";
import {DataTable2Definition, DataTableDefinition} from '@app/components/data-tables.util';
import {Configuration} from "@app/core/config/configuration";
import {MessagesInterceptorStateService} from "@app/core/interceptors/messages.interceptor";
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
import {onCreate, onDelete, onUpdate, onUpdatedRelation, Status} from '@app/frontend-gui/src/lib/public_api';
import {ErrorHandlerService} from "@app/services/error-handler.service";
import {LoadingOverlayService} from "@app/services/loading-overlay.service";
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import { compareNullableString } from '@app/utils/compare-nullable-string';

function httpUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    try {
      const url = new URL(value);
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        return null;
      }
      return { invalidUrl: true };
    } catch {
      return { invalidUrl: true };
    }
  };
}

function srsPatternValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const pattern = /^[A-Z-]+:\d+$/;
    return pattern.test(value) ? null : { invalidSrs: true };
  };
}

function integerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const num = Number(value);
    if (isNaN(num) || !Number.isInteger(num)) {
      return { pattern: true };
    }
    return null;
  };
}

@Component({
    selector: 'app-territory-form',
    templateUrl: './territory-form.component.html',
    styleUrls: ['./territory-form.component.scss'],
    standalone: false
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
   * @param loadingService
   * @param messagesInterceptorState
   * @param loadingService
   * @param messagesInterceptorState
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
    loadingService: LoadingOverlayService,
    messagesInterceptorState: MessagesInterceptorStateService,
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
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router, loadingService, messagesInterceptorState);
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
      firstValueFrom(this.territoryGroupTypeService.fetchAllItems()),
      firstValueFrom(this.territoryTypeService.fetchAllItems()),
      firstValueFrom(this.utils.getCodeListValues('territory.scope'))
    ]);

    this.territoryGroups = [...territoryGroups];
    this.territoryTypes = [...territoryTypes].sort((a, b) => compareNullableString(a.name, b.name));
    this.scopeTypes = [...scopeTypes];
  }

  /**
   * Fetches the original entity by ID.
   * @returns Promise of a Territory entity with projection
   */
  override async fetchOriginal(): Promise<TerritoryProjection> {
    return firstValueFrom(this.territoryService.fetchProjectionById(TerritoryProjection, this.entityID));
  }

  /**
   * Creates a copy of an existing entity for duplication.
   * @returns Promise of a duplicated Territory entity with projection
   */
  override async fetchCopy(): Promise<TerritoryProjection> {
    return firstValueFrom(this.territoryService.fetchProjectionById(TerritoryProjection, this.duplicateID).pipe(
      map((copy: TerritoryProjection) => {
        copy.name = this.translateService.instant("common.copyPrefix") + copy.name;
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
      code: new UntypedFormControl(this.entityToEdit.code, [Validators.required, Validators.maxLength(50)]),
      name: new UntypedFormControl(this.entityToEdit.name, [Validators.required, Validators.maxLength(250)]),
      description: new UntypedFormControl(this.entityToEdit.description, [Validators.maxLength(4000)]),
      territorialAuthorityAddress: new UntypedFormControl(this.entityToEdit.territorialAuthorityAddress, [Validators.maxLength(250)]),
      territorialAuthorityLogo: new UntypedFormControl(this.entityToEdit.territorialAuthorityLogo, [Validators.maxLength(4000), httpUrlValidator()]),
      groupTypeId: new UntypedFormControl(this.entityToEdit.groupTypeId, []),
      typeId: new UntypedFormControl(this.entityToEdit.typeId, [Validators.required]),
      extentMinX: new UntypedFormControl(this.entityToEdit.extent?.minX, []),
      extentMaxX: new UntypedFormControl(this.entityToEdit.extent?.maxX, []),
      extentMinY: new UntypedFormControl(this.entityToEdit.extent?.minY, []),
      extentMaxY: new UntypedFormControl(this.entityToEdit.extent?.maxY, []),
      note: new UntypedFormControl(this.entityToEdit.note, [Validators.maxLength(250)]),
      srs: new UntypedFormControl(this.entityToEdit.srs, [Validators.maxLength(50), srsPatternValidator()]),
      blocked: new UntypedFormControl(this.entityToEdit.blocked ?? true, [Validators.required]),
      defaultZoomLevel: new UntypedFormControl(this.entityToEdit.defaultZoomLevel, [integerValidator()]),
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
   * @param _isDuplicated - Whether this is a duplication operation
   */
  override async updateDataRelated(_isDuplicated: boolean): Promise<void> {
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
    const formValues = this.entityForm.getRawValue();
    return this.entityForm.valid && this.validateEnvelope(
      formValues.extentMinX,
      formValues.extentMaxX,
      formValues.extentMinY,
      formValues.extentMaxY
    ) && this.validatePoint(
      formValues.centerPointX,
      formValues.centerPointY
    );
  }

  public validateEnvelope(minX: any, maxX: any, minY: any, maxY: any): boolean {
    const isNull = [minX, maxX, minY, maxY].every(element => element == null);
    if (isNull) {
      return true
    } else {
      return this.normalizeEnvelope(minX, maxX, minY, maxY) !== null;
    }
  }

  async onTerritoryTypeChanged(event: MatSelectChange): Promise<void> {
    const previousTypeId = this.currentTerritoryType?.id ?? Number(this.entityForm.get('typeId')?.value);
    const previousTerritoryType = this.currentTerritoryType;
    const selectedTypeId = Number(event.value);
    const territoryType = this.territoryTypes.find((element) => element.id === selectedTypeId);

    if (!territoryType) {
      this.restoreTerritoryTypeSelection(previousTypeId, previousTerritoryType);
      return;
    }

    const blockingErrorKey = await this.getTypeChangeBlockingErrorKey(territoryType);
    if (blockingErrorKey) {
      this.restoreTerritoryTypeSelection(previousTypeId, previousTerritoryType);
      this.setTypeIdRelationError(blockingErrorKey);
      return;
    }

    this.clearTypeIdRelationErrors();
    this.applyTerritoryType(territoryType);
  }

  private applyTerritoryType(territoryType: TerritoryType): void {
    this.currentTerritoryType = territoryType;
    this.currentTypeBottom = territoryType.bottomType;
    this.currentTypeTop = territoryType.topType;
  }

  private restoreTerritoryTypeSelection(previousTypeId: number, previousTerritoryType: TerritoryType): void {
    this.entityForm.get('typeId')?.setValue(previousTypeId, {emitEvent: false});
    if (previousTerritoryType) {
      this.applyTerritoryType(previousTerritoryType);
    }
  }

  private setTypeIdRelationError(errorKey: 'topTypeWithParents' | 'bottomTypeWithChildren'): void {
    const control = this.entityForm.get('typeId');
    if (!control) {
      return;
    }
    control.setErrors({...(control.errors ?? {}), [errorKey]: true});
    control.markAsTouched();
  }

  private clearTypeIdRelationErrors(): void {
    const control = this.entityForm.get('typeId');
    if (!control?.errors) {
      return;
    }
    const {topTypeWithParents: _topTypeWithParents, bottomTypeWithChildren: _bottomTypeWithChildren, ...remainingErrors} = control.errors;
    control.setErrors(Object.keys(remainingErrors).length > 0 ? remainingErrors : null);
  }

  private async getTypeChangeBlockingErrorKey(
    territoryType: TerritoryType
  ): Promise<'topTypeWithParents' | 'bottomTypeWithChildren' | null> {
    if (this.isNew()) {
      return null;
    }
    if (territoryType.topType) {
      const parents = await firstValueFrom(
        this.entityToEdit.getRelationArrayEx(TerritoryProjection, 'memberOf', {projection: 'view'})
      );
      if (parents.length > 0) {
        return 'topTypeWithParents';
      }
    }
    if (territoryType.bottomType) {
      const children = await firstValueFrom(
        this.entityToEdit.getRelationArrayEx(TerritoryProjection, 'members', {projection: 'view'})
      );
      if (children.length > 0) {
        return 'bottomTypeWithChildren';
      }
    }
    return null;
  }

  private filterParentTargetTerritories(territories: TerritoryProjection[]): TerritoryProjection[] {
    const currentTypeId = this.currentTerritoryType?.id;
    if (currentTypeId == null) {
      return [];
    }
    return territories.filter((territory) => this.isParentTerritoryCandidate(territory, currentTypeId));
  }

  private filterChildTargetTerritories(territories: TerritoryProjection[]): TerritoryProjection[] {
    const currentTypeId = this.currentTerritoryType?.id;
    if (currentTypeId == null) {
      return [];
    }
    return territories.filter((territory) => this.isChildTerritoryCandidate(territory, currentTypeId));
  }

  private isParentTerritoryCandidate(territory: TerritoryProjection, currentTypeId: number): boolean {
    return territory.typeId !== currentTypeId && !territory.typeBottomType;
  }

  private isChildTerritoryCandidate(territory: TerritoryProjection, currentTypeId: number): boolean {
    return territory.typeId !== currentTypeId && !territory.typeTopType;
  }

  /**
   * Creates a Territory object from the current form values.
   *
   * @param id - Optional ID for the new object, used when updating
   * @returns New Territory instance populated with form values
   */
  private createObject(id: number = null): Territory {
    let safeToEdit = TerritoryProjection.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();
    safeToEdit = Object.assign(safeToEdit, formValues, {
      id: id,
      groupType: this.territoryGroupTypeService.createProxy(formValues.groupTypeId),
      type: this.territoryTypeService.createProxy(formValues.typeId),
      extent: this.normalizeEnvelope(
        formValues.extentMinX,
        formValues.extentMaxX,
        formValues.extentMinY,
        formValues.extentMaxY,
      ),
      center: this.normalizePoint(
        formValues.centerPointX,
        formValues.centerPointY
      )
    });
    return Territory.fromObject(safeToEdit);
  }

  /**
   * Normalizes extent values by parsing them as floats.
   * Returns an object with minX, maxX, minY, and maxY if all values are valid numbers
   * and maxX > minX and maxY > minY, otherwise returns null.
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
    }
    if (newMaxX <= newMinX || newMaxY <= newMinY) {
      return null;
    }
    return {
      minX: newMinX,
      maxX: newMaxX,
      minY: newMinY,
      maxY: newMaxY,
    } as Envelope
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
    return DataTable2Definition.builder<UserConfigurationProjection, User, Role>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        Object.assign(
          this.utils.getRouterLinkColumnDef('entity.territory.permissions.user', 'user', '/user/:id/userForm', {
            id: 'userId',
          }),
          {flex: 2, minWidth: 140, tooltipField: 'user'}
        ),
        Object.assign(
          this.utils.getRouterLinkColumnDef('entity.territory.permissions.role', 'role', '/role/:id/roleForm', {
            id: 'roleId',
          }),
          {flex: 3, minWidth: 160, tooltipField: 'role'}
        ),
        Object.assign(
          this.utils.getBooleanColumnDef(
            'entity.territory.permissions.appliesToChildrenTerritories',
            'appliesToChildrenTerritories',
            true,
            180,
            220
          ),
          {flex: 0}
        ),
        Object.assign(this.utils.getStatusColumnDef(), {flex: 0}),
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
          return of([]);
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
        return this.userConfigurationService.fetchProjectionItems(UserConfigurationProjection, query);
      })
      .withTargetsLeftFetcher(() => this.userService.fetchAllItems())
      .withTargetsRightFetcher(() => this.roleService.fetchAllItems())
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
      .withFieldRestrictions(['userId', 'roleId', 'appliesToChildrenTerritories'])
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
    return DataTableDefinition.builder<TerritoryProjection, TerritoryProjection>(this.dialog, this.errorHandler, this.loadingService)
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
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(TerritoryProjection, 'memberOf', {projection: 'view'})
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
      .withTargetsFetcher(() => this.territoryService.fetchProjectionItems(TerritoryProjection).pipe(
        map((territories: TerritoryProjection[]) => this.filterParentTargetTerritories(territories))
      ))
      .withTargetInclude((relations) => (target) =>
        !relations.some((relation) => relation.id === target.id)
      )
      .withTargetToRelation((items) => items)
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
    return DataTableDefinition.builder<TerritoryProjection, TerritoryProjection>(this.dialog, this.errorHandler, this.loadingService)
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
          return of([]);
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
      .withTargetsFetcher(() => this.territoryService.fetchProjectionItems(TerritoryProjection).pipe(
        map((territories: TerritoryProjection[]) => this.filterChildTargetTerritories(territories))
      ))
      .withTargetInclude((relations) => (target) =>
        !relations.some((relation) => relation.id === target.id)
      )
      .withTargetToRelation((items) => items)
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
    return DataTableDefinition.builder<CartographyAvailabilityProjection, CartographyProjection>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef(
          'common.form.name',
          'cartographyName',
          '/layers/:id/layersForm',
          {
            id: 'cartographyId',
          }
        ),
        {
          ...this.utils.getNonEditableColumnDef('entity.cartography.plural', 'cartographyLayers'),
          ...this.utils.getArrayValueParser(),
        },
        this.utils.getRouterLinkColumnDef(
          'entity.service.label',
          'cartographyServiceName',
          '/service/:id/serviceForm',
          {
            id: 'cartographyServiceId',
          }
        ),
        this.utils.getStatusColumnDef(),
      ])
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(CartographyAvailabilityProjection, 'cartographyAvailabilities', {projection: 'view'})
      })
      .withRelationsOrder('cartographyName')
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
      .withTargetsFetcher(() => this.cartographyService.fetchProjectionItems(CartographyProjection))
      .withTargetsTitle('entity.territory.cartography.title')
      .withTargetsOrder(['name'])
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
        {
          ...this.utils.getNonEditableColumnDef('entity.cartography.plural', 'layers'),
          ...this.utils.getArrayValueParser(),
        },
        this.utils.getNonEditableColumnDef('entity.service.label', 'serviceName'),
      ])
      .withTargetInclude((relations) => (target) =>
        !relations.some((relation) => relation.cartographyId === target.id)
      )
      .withTargetToRelation((items) => {
        return items.map(item => CartographyAvailabilityProjection.of(this.entityToEdit, item))
      })
      .withFieldRestriction('cartographyId')
      .build();
  }

  private defineTasksTable(): DataTableDefinition<TaskAvailabilityProjection, TaskProjection> {
    return DataTableDefinition.builder<TaskAvailabilityProjection, TaskProjection>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef('common.form.name', 'taskName', '/tasks/:id/:typeId', {
          id: 'taskId',
          typeId: 'taskTypeId',
        }),
        this.utils.getNonEditableColumnDef('entity.taskType.label', 'taskTypeTitle', 300),
        this.utils.getStatusColumnDef(),
      ])
      .withRelationsOrder(['taskTypeTitle'])
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(TaskAvailabilityProjection, 'taskAvailabilities', {
          projection: 'view',
          lang: this.requestLang(),
        })
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
        this.utils.getNonEditableColumnDef('entity.taskType.label', 'typeTitle', 300),
        this.utils.getStatusColumnDef()
      ])
      .withTargetsFetcher(() => this.taskService.fetchProjectionItems(TaskProjection, {
        params: [{key: 'lang', value: this.requestLang()}],
      }))
      .withTargetInclude((relations) => (target) =>
        !relations.some((relation) => relation.taskId === target.id)
      )
      .withFieldRestriction('taskId')
      .withTargetsOrder(['typeTitle'])
      .withTargetToRelation((tasks) => tasks.map(task => TaskAvailabilityProjection.of(task, this.entityToEdit)))
      .build();
  }
}
