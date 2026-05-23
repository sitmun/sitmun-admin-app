import {Component} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from "@ngx-translate/core";
import { firstValueFrom, map, of, ReplaySubject} from 'rxjs';

import {BaseFormComponent} from "@app/components/base-form.component";
import {DataTable2Definition, DataTableDefinition} from "@app/components/data-tables.util";
import {Configuration} from "@app/core/config/configuration";
import {MessagesInterceptorStateService} from "@app/core/interceptors/messages.interceptor";
import {
  Application,
  ApplicationService,
  CodeList,
  CodeListService,
  Role,
  RoleService,
  TerritoryProjection,
  TerritoryService,
  TranslationService,
  User,
  UserConfiguration,
  UserConfigurationProjection,
  UserConfigurationService,
  UserPosition,
  UserPositionProjection,
  UserPositionService,
  UserProjection,
  UserService
} from '@app/domain';
import {onCreate, onDelete, onUpdate, Status,} from '@app/frontend-gui/src/lib/public_api';
import {ErrorHandlerService} from "@app/services/error-handler.service";
import {LoadingOverlayService} from "@app/services/loading-overlay.service";
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';


@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss'],
    standalone: false
})
export class UserFormComponent extends BaseFormComponent<UserProjection> {
  private static readonly PASSWORD_PLACEHOLDER = '••••••••';

  private static readonly WARNING_NO_ROLES = 'entity.user.warning.no-roles';

  private static readonly WARNING_POSITION_WITHOUT_DETAILS =
    'entity.user.warning.position-without-details';

  private static readonly WARNING_ROLE_WITHOUT_POSITION =
    'entity.user.warning.role-without-position';

  private static readonly BUILT_IN_ADMIN_WARNING = 'entity.user.builtInAdminWarning';

  private static readonly BUILT_IN_PUBLIC_WARNING = 'entity.user.builtInPublicWarning';

  readonly config = Configuration.USER;

  protected readonly userConfigurationsTable: DataTable2Definition<UserConfigurationProjection, Role, TerritoryProjection>

  protected readonly userPositionsTable: DataTableDefinition<UserPositionProjection, TerritoryProjection>

  /** Flag indicating if the password is set */
  passwordSet = false;

  /** Flag indicating if the password is being edited */
  isPasswordBeingEdited = false;

  /** Flag indicating if the password has been modified */
  passwordModified = false;

  /** The actual password value */
  actualPassword: string = null;

  /** True after the user changes the password field during the current focus session. */
  private passwordDirtyInSession = false;

  /** Whether the account had a password when the current password focus session started. */
  private hadPasswordBeforeFocusSession = false;

  /** Flag indicating if this is the built-in admin user */
  isBuiltInAdmin = false;

  /** Flag indicating if this is the built-in public user */
  isBuiltInPublic = false;

  /** Applications where this user is the point of contact */
  applicationsAsContact: Application[] = [];

  private readonly applicationsAsContactRefresh$ = new ReplaySubject<boolean>(1);

  readonly applicationsAsContactFetchFn = () => of(this.applicationsAsContact);

  readonly applicationsAsContactRefresh = this.applicationsAsContactRefresh$.asObservable();

  readonly applicationsAsContactColumnDefs: any[] = [];


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
    private userService: UserService,
    public utils: UtilsService,
    private userConfigurationService: UserConfigurationService,
    private roleService: RoleService,
    private userPositionService: UserPositionService,
    private territoryService: TerritoryService,
    private applicationService: ApplicationService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router, loadingService, messagesInterceptorState);
    this.userConfigurationsTable = this.defineUserConfigurationsTable();
    this.userPositionsTable = this.defineUserPositionsTable();
    (this.applicationsAsContactColumnDefs as any[]).push(
      Object.assign(this.utils.getRouterLinkColumnDef('common.form.name', 'name', '/application/:id/applicationForm', {id: 'id'}), {flex: 3, minWidth: 160, tooltipField: 'name'}),
      Object.assign(this.utils.getNonEditableColumnDef('entity.application.type.generic.title', 'title'), {flex: 3, minWidth: 160, tooltipField: 'title'}),
      Object.assign(this.utils.getNonEditableColumnDef('common.form.type', 'type'), {flex: 1, minWidth: 80}),
    );
  }

  override async preFetchData(): Promise<void> {
    await this.initCodeLists(['userPosition.type']);
    this.dataTables.register(this.userConfigurationsTable).register(this.userPositionsTable);
  }

  override async fetchOriginal(): Promise<UserProjection> {
    return firstValueFrom(this.userService.fetchProjectionById(UserProjection, this.entityID));
  }

  override async fetchCopy(): Promise<UserProjection> {
    return firstValueFrom(this.userService.fetchProjectionById(UserProjection, this.duplicateID).pipe(
      map((copy: UserProjection) => {
        copy.username = this.translateService.instant("common.copyPrefix") + copy.username;
        return copy;
      })
    ));
  }

  override empty(): UserProjection {
    const user = new UserProjection();
    user.administrator = false;
    user.blocked = false;
    return user;
  }

  override postFetchData(): void {
    if (!this.entityToEdit) {
      throw new Error('Cannot initialize form: entity is undefined');
    }
    if (this.isDuplicated()) {
      this.passwordSet = false;
    } else {
      this.passwordSet = this.entityToEdit.passwordSet ?? false;
    }
    this.isPasswordBeingEdited = false;
    this.passwordDirtyInSession = false;
    this.hadPasswordBeforeFocusSession = false;

    this.isBuiltInAdmin = this.entityToEdit.username === 'admin' && !this.isNew();
    this.isBuiltInPublic = this.entityToEdit.username === 'public' && !this.isNew();

    this.entityForm = new UntypedFormGroup({
      username: new UntypedFormControl(
        {value: this.entityToEdit.username, disabled: this.isBuiltInAdmin || this.isBuiltInPublic},
        [Validators.required, Validators.maxLength(50)]
      ),
      firstName: new UntypedFormControl(this.entityToEdit.firstName, [Validators.maxLength(50)]),
      lastName: new UntypedFormControl(this.entityToEdit.lastName, [Validators.maxLength(50)]),
      email: new UntypedFormControl(this.entityToEdit.email, [Validators.email, Validators.maxLength(50)]),
      newPassword: new UntypedFormControl(
        this.passwordSet ? UserFormComponent.PASSWORD_PLACEHOLDER : '',
        []
      ),
      administrator: new UntypedFormControl(
        {value: this.entityToEdit.administrator, disabled: this.isBuiltInAdmin || this.isBuiltInPublic},
        []
      ),
      blocked: new UntypedFormControl(
        {value: this.entityToEdit.blocked, disabled: this.isBuiltInAdmin},
        []
      ),
    });

    if (this.isEdition()) {
      firstValueFrom(this.applicationService.findByCreatorId(this.entityID))
        .then(apps => {
          this.applicationsAsContact = apps;
          this.applicationsAsContactRefresh$.next(true);
        })
        .catch(() => {
          this.applicationsAsContact = [];
          this.applicationsAsContactRefresh$.next(true);
        });
    }
  }

  /**
   * Creates a User object from the current form values.
   * Handles the password field specially based on passwordSet flag.
   *
   * @param id - User ID for the new object, used when updating
   * @returns New User instance populated with form values
   */
  createObject(id: number = null): User {
    let safeToEdit = User.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();
    safeToEdit = Object.assign(safeToEdit,
      formValues,
      {
        id: id,
      }
    );
    if (this.isPasswordBeingEdited) {
      safeToEdit.password = formValues.newPassword;
    }
    return User.fromObject(safeToEdit);
  }

  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const response = await firstValueFrom(this.userService.create(entityToCreate));
    return response.id;
  }

  override async updateEntity(): Promise<void> {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.userService.update(entityToUpdate));
  }

  onPasswordFocus(): void {
    this.passwordDirtyInSession = false;
    this.hadPasswordBeforeFocusSession = this.passwordSet;
    this.clearPasswordPlaceholder();
  }

  onPasswordBlur(): void {
    if (this.shouldRestorePasswordPlaceholder()) {
      this.restorePasswordPlaceholder();
    }
  }

  onPasswordChange(): void {
    this.clearPasswordPlaceholder();
    const passwordValue = this.entityForm.get('newPassword')?.value ?? '';

    if (passwordValue !== '') {
      this.passwordDirtyInSession = true;
      this.isPasswordBeingEdited = true;
      this.passwordSet = true;
      this.actualPassword = passwordValue;
      this.passwordModified = true;
    } else if (this.hadPasswordBeforeFocusSession) {
      this.revertPasswordEditSession();
    } else {
      this.passwordDirtyInSession = true;
      this.passwordSet = false;
      this.actualPassword = null;
      this.passwordModified = true;
    }
  }

  private shouldRestorePasswordPlaceholder(): boolean {
    if (!this.hadPasswordBeforeFocusSession) {
      return false;
    }
    const value = this.entityForm?.get('newPassword')?.value ?? '';
    const isEmpty = value === '' || value === UserFormComponent.PASSWORD_PLACEHOLDER;
    return isEmpty || !this.passwordDirtyInSession;
  }

  private revertPasswordEditSession(): void {
    this.passwordDirtyInSession = false;
    this.isPasswordBeingEdited = false;
    this.passwordModified = false;
    this.passwordSet = true;
    this.actualPassword = null;
  }

  private restorePasswordPlaceholder(): void {
    const control = this.entityForm?.get('newPassword');
    control?.setValue(UserFormComponent.PASSWORD_PLACEHOLDER);
    control?.markAsPristine();
    control?.markAsUntouched();
    this.isPasswordBeingEdited = false;
    this.passwordModified = false;
    this.passwordSet = true;
    this.actualPassword = null;
  }

  private clearPasswordPlaceholder(): void {
    const control = this.entityForm?.get('newPassword');
    const value = control?.value ?? '';
    if (value === UserFormComponent.PASSWORD_PLACEHOLDER) {
      control.setValue('');
    } else if (value.includes(UserFormComponent.PASSWORD_PLACEHOLDER)) {
      control.setValue(value.replaceAll(UserFormComponent.PASSWORD_PLACEHOLDER, ''));
    }
  }

  private defineUserConfigurationsTable(): DataTable2Definition<UserConfigurationProjection, Role, TerritoryProjection> {
    return DataTable2Definition.builder<UserConfigurationProjection, Role, TerritoryProjection>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        Object.assign(this.utils.getRouterLinkColumnDef('entity.role.label', 'role', '/role/:id/roleForm', {id: 'roleId'}), {flex: 2, minWidth: 140, tooltipField: 'role'}),
        Object.assign(this.utils.getRouterLinkColumnDef('entity.territory.plural', 'territory', '/territory/:id/territoryForm', {id: 'territoryId'}), {flex: 3, minWidth: 160, tooltipField: 'territory'}),
        Object.assign(this.utils.getBooleanColumnDef('entity.role.users.appliesToChildrenTerritories', 'appliesToChildrenTerritories', true, 150), {flex: 0, maxWidth: 180}),
        Object.assign(this.utils.getDateColumnDef('entity.role.users.createdDate', 'createdDate', false), {flex: 0, minWidth: 140}),
        Object.assign(this.utils.getStatusColumnDef(), {flex: 0})
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(UserConfigurationProjection, 'permissions', {projection: 'view'})
      })
      .withFieldRestrictions(['roleId', 'territoryId'])
      .withRelationsUpdater(async (userConfigurations: (UserConfigurationProjection & Status)[]) => {
        await onCreate(userConfigurations).forEach(item => {
          const newItem = UserConfiguration.fromObject(item);
          newItem.user = this.userService.createProxy(this.entityID);
          newItem.territory = this.territoryService.createProxy(item.territoryId);
          newItem.role = this.roleService.createProxy(item.roleId);
          return this.userConfigurationService.create(newItem);
        });
        await onUpdate(userConfigurations).forEach(item => {
          const newItem = UserConfiguration.fromObject(item);
          delete newItem.user;
          delete newItem.territory;
          delete newItem.role;
          return this.userConfigurationService.update(newItem);
        });
        await onDelete(userConfigurations).forEach(item => {
          const newItem = this.userConfigurationService.createProxy(item.id)
          return this.userConfigurationService.delete(newItem);
        });
      })
      .withTargetToRelation((roles: Role[], territories: TerritoryProjection[]) => {
        const relations: UserConfigurationProjection[] = [];
        territories.forEach(territory => {
          roles.forEach(role => {
            relations.push(Object.assign(new UserConfigurationProjection(), {
              user: this.entityToEdit.username,
              userId: this.entityToEdit.id,
              territory: territory.name,
              territoryId: territory.id,
              role: role.name,
              roleId: role.id,
              appliesToChildrenTerritories: false,
              createdDate: new Date().toISOString()
            }));
          });
        });
        return relations;
      })
      .withTargetsTitle('entity.user.roles.title')
      .withTargetsLeftColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
      ])
      .withTargetsLeftTitle('entity.role.label')
      .withTargetsLeftFetcher(() => this.roleService.fetchAllItems())
      .withTargetsRightColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
        this.utils.getNonEditableColumnDef('common.form.code', 'code'),
        this.utils.getNonEditableColumnDef('common.form.type', 'typeName'),
      ])
      .withTargetsRightTitle('entity.role.users.territory.title')
      .withTargetsRightFetcher(() => this.territoryService.fetchProjectionItems(TerritoryProjection))
      .build();
  }

  private defineUserPositionsTable(): DataTableDefinition<UserPositionProjection, TerritoryProjection> {
    return DataTableDefinition.builder<UserPositionProjection, TerritoryProjection>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        Object.assign(this.utils.getNonEditableColumnDef('entity.territory.label', 'territoryName'), {flex: 2, minWidth: 140, tooltipField: 'territoryName'}),
        Object.assign(this.utils.getEditableColumnDef('entity.user.position.name', 'name'), {flex: 2, minWidth: 120, tooltipField: 'name'}),
        Object.assign(this.utils.getEditableColumnDef('entity.user.position.organization', 'organization'), {flex: 2, minWidth: 120, tooltipField: 'organization'}),
        Object.assign(this.utils.getEditableColumnDef('common.form.email', 'email'), {flex: 2, minWidth: 160, tooltipField: 'email'}),
        Object.assign(this.utils.getSelectColumnDef<CodeList, string>('common.form.type', 'type', true,
          () => this.codeList('userPosition.type').map(item => item.description),
          () => this.codeList('userPosition.type'),
          'value',
          'description'), {flex: 0, minWidth: 120}),
        Object.assign(this.utils.getDateColumnDef('common.form.expirationDate', 'expirationDate', true), {flex: 0, minWidth: 120}),
        Object.assign(this.utils.getDateColumnDef('entity.user.dataCreated', 'createdDate'), {flex: 0, minWidth: 120}),
        Object.assign(this.utils.getStatusColumnDef(), {flex: 0})
      ])
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(UserPositionProjection, 'positions', {projection: 'view'})
      })
      .withRelationsDuplicate(item => {
        const newItem = UserPositionProjection.fromObject(item)
        delete newItem.id;
        delete newItem.createdDate;
        delete newItem.expirationDate;
        return newItem;
      })
      .withRelationsUpdater(async (userPositions: (UserPositionProjection & Status)[]) => {
        await onCreate(userPositions).forEach(item => {
          const newItem = UserPosition.fromObject(item);
          newItem.user = this.userService.createProxy(item.userId);
          newItem.territory = this.territoryService.createProxy(item.territoryId);
          return this.userPositionService.create(newItem);
        });
        await onUpdate(userPositions).forEach(item => {
            const newItem = UserPosition.fromObject(item);
            delete newItem.user;
            delete newItem.territory;
            return this.userPositionService.update(newItem);
          }
        );
        await onDelete(userPositions).forEach(item => {
          const newItem = this.userPositionService.createProxy(item.id)
          return this.userPositionService.delete(newItem);
        });
      })
      .withTargetsTitle('entity.user.positions.add.title')
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
        this.utils.getNonEditableColumnDef('common.form.code', 'code'),
      ])
      .withTargetsFetcher(() => this.territoryService.fetchProjectionItems(TerritoryProjection))
      .withTargetToRelation((territories: TerritoryProjection[]) => {
        return territories.map(t => {
          const p = new UserPositionProjection();
          p.userId = this.entityID;
          p.territoryId = t.id;
          p.territoryName = t.name;
          return p;
        });
      })
      .build();
  }

  isUsernamePublic(): boolean {
    return this.entityForm.get('username').value === 'public';
  }

  getBuiltInUserWarningKey(): string | null {
    if (this.isBuiltInAdmin) {
      return UserFormComponent.BUILT_IN_ADMIN_WARNING;
    }
    if (this.isBuiltInPublic) {
      return UserFormComponent.BUILT_IN_PUBLIC_WARNING;
    }
    return null;
  }

  getUserDisplayWarnings(): string[] {
    const warnings = [...(this.entityToEdit?.warnings ?? [])];
    const builtInWarning = this.getBuiltInUserWarningKey();
    if (builtInWarning) {
      warnings.unshift(builtInWarning);
    }
    return warnings;
  }

  getBuiltInInfoWarningKeys(): string[] {
    const builtInWarning = this.getBuiltInUserWarningKey();
    return builtInWarning ? [builtInWarning] : [];
  }

  hasBackendUserWarnings(): boolean {
    return (this.entityToEdit?.warnings?.length ?? 0) > 0;
  }

  useInfoWarningsCardStyle(): boolean {
    return !!this.getBuiltInUserWarningKey() && !this.hasBackendUserWarnings();
  }

  hasUserWarnings(): boolean {
    return this.getUserDisplayWarnings().length > 0;
  }

  rolesTabHasWarning(): boolean {
    if (this.isBuiltInAdmin || this.isBuiltInPublic) {
      return false;
    }
    return this.warningsInclude(
      UserFormComponent.WARNING_NO_ROLES,
      UserFormComponent.WARNING_ROLE_WITHOUT_POSITION
    );
  }

  positionsTabHasWarning(): boolean {
    if (this.isBuiltInAdmin || this.isBuiltInPublic) {
      return false;
    }
    return this.warningsInclude(
      UserFormComponent.WARNING_POSITION_WITHOUT_DETAILS,
      UserFormComponent.WARNING_ROLE_WITHOUT_POSITION
    );
  }

  private warningsInclude(...keys: string[]): boolean {
    const warnings = this.entityToEdit?.warnings ?? [];
    return keys.some(key => warnings.includes(key));
  }
}
