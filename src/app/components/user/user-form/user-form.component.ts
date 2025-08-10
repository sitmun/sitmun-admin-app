import {ActivatedRoute, Router} from '@angular/router';
import {
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
import {DataTable2Definition, DataTableDefinition} from "@app/components/data-tables.util";
import {EMPTY, firstValueFrom, Subject} from 'rxjs';
import {onCreate, onDelete, onUpdate, Status,} from '@app/frontend-gui/src/lib/public_api';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {BaseFormComponent} from "@app/components/base-form.component";
import {Component} from '@angular/core';
import {Configuration} from "@app/core/config/configuration";
import {ErrorHandlerService} from "@app/services/error-handler.service";
import {LoggerService} from '@app/services/logger.service';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from "@ngx-translate/core";
import {UtilsService} from '@app/services/utils.service';
import {constants} from '@environments/constants';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styles: []
})
export class UserFormComponent extends BaseFormComponent<UserProjection> {
  readonly config = Configuration.USER;

  readonly userConfigurationsTable: DataTable2Definition<UserConfigurationProjection, Role, TerritoryProjection>

  readonly userPositionsTable: DataTableDefinition<UserPositionProjection, UserPositionProjection>

  //Dialog
  getAllElementsEventPermits: Subject<string> = new Subject<string>();

  getAllElementsEventTerritoryData: Subject<"save"> = new Subject<"save">();

  /** Flag indicating if the password is set */
  passwordSet = false;

  /** Flag indicating if the password is being edited */
  isPasswordBeingEdited = false;

  /** Flag indicating if the password has been modified */
  passwordModified = false;

  /** The actual password value */
  actualPassword: string = null;

  constructor(
    dialog: MatDialog,
    translateService: TranslateService,
    translationService: TranslationService,
    codeListService: CodeListService,
    loggerService: LoggerService,
    errorHandler: ErrorHandlerService,
    activatedRoute: ActivatedRoute,
    router: Router,
    private userService: UserService,
    public utils: UtilsService,
    private userConfigurationService: UserConfigurationService,
    private roleService: RoleService,
    private userPositionService: UserPositionService,
    private territoryService: TerritoryService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router);
    this.userConfigurationsTable = this.defineUserConfigurationsTable();
    this.userPositionsTable = this.defineUserPositionsTable();
  }

  override async preFetchData(): Promise<void> {
    await this.initCodeLists(['userPosition.type']);
    this.dataTables.register(this.userConfigurationsTable).register(this.userPositionsTable);
  }

  override async fetchOriginal(): Promise<UserProjection> {
    return firstValueFrom(this.userService.getProjection(UserProjection, this.entityID));
  }

  override async fetchCopy(): Promise<UserProjection> {
    return firstValueFrom(this.userService.getProjection(UserProjection, this.duplicateID).pipe(map((copy: UserProjection) => {
      copy.username = this.translateService.instant("copy_") + copy.username;
      return copy;
    })));
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

    this.entityForm = new UntypedFormGroup({
      username: new UntypedFormControl(this.entityToEdit.username,[Validators.required]),
      firstName: new UntypedFormControl(this.entityToEdit.firstName, []),
      lastName: new UntypedFormControl(this.entityToEdit.lastName, []),
      email: new UntypedFormControl(this.entityToEdit.email, [Validators.email]),
      newPassword: new UntypedFormControl(this.passwordSet ? '••••••••' : '', []),
      administrator: new UntypedFormControl(this.entityToEdit.administrator, []),
      blocked: new UntypedFormControl(this.entityToEdit.blocked, []),
    });
  }

 /**
   * Creates a User object from the current form values.
   * Handles the password field specially based on passwordSet flag.
   *
   * @param id - User ID for the new object, used when updating
   * @returns New Connection instance populated with form values
   */
 createObject(id: number = null): User {
  let safeToEdit = User.fromObject(this.entityToEdit);
  safeToEdit = Object.assign(safeToEdit,
    this.entityForm.value,
    {
      id: id,
    }
  );
  if (this.isPasswordBeingEdited) {
    safeToEdit.password = this.entityForm.get('newPassword').value;
  }
  return User.fromObject(safeToEdit);
}

  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const response = await firstValueFrom(this.userService.create(entityToCreate));

    this.getAllElementsEventTerritoryData.next('save');
    this.getAllElementsEventPermits.next('save');

    return response.id;
  }

  override async updateEntity(): Promise<void> {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.userService.update(entityToUpdate));

    this.getAllElementsEventTerritoryData.next('save');
    this.getAllElementsEventPermits.next('save');
  }

  onPasswordChange() {
    const passwordValue = this.entityForm.get('newPassword')?.value;

    // Handle a new password field
    if (passwordValue && passwordValue !== '••••••••') {
      this.isPasswordBeingEdited = true;
      this.passwordSet = true;
      this.actualPassword = passwordValue;
      this.passwordModified = true;
    } else if (passwordValue === '') {
      this.passwordSet = false;
      this.actualPassword = null;
      this.passwordModified = true;
    }
  }

  private defineUserConfigurationsTable(): DataTable2Definition<UserConfigurationProjection, Role, TerritoryProjection> {
    return DataTable2Definition.builder<UserConfigurationProjection, Role, TerritoryProjection>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef('entity.role.label', 'role', '/role/:id/roleForm', {id: 'roleId'}),
        this.utils.getRouterLinkColumnDef('entity.territory.plural', 'territory', '/territory/:id/territoryForm', {id: 'territoryId'}),
        this.utils.getNonEditableColumnDef('entity.role.users.appliesToChildrenTerritories', 'appliesToChildrenTerritories'),
        this.utils.getDateColumnDef('entity.role.users.createdDate', 'createdDate', false),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return EMPTY;
        }
        return this.entityToEdit.getRelationArrayEx(UserConfigurationProjection, 'permissions', {projection: 'view'})
      })
      .withFieldRestrictions(['roleId', 'territoryId'])
      .withRelationsUpdater(async (userConfigurations: (UserConfigurationProjection & Status)[]) => {
        await onCreate(userConfigurations).forEach(item => {
          const newItem = UserConfiguration.fromObject(item);
          newItem.user = this.userService.createProxy(item.userId);
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
        }
        );
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
      .withTargetsLeftFetcher(() => this.roleService.getAll())
      .withTargetsRightColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
        this.utils.getNonEditableColumnDef('common.form.code', 'code'),
        this.utils.getNonEditableColumnDef('common.form.type', 'typeName'),
      ])
      .withTargetsRightTitle('entity.role.users.territory.title')
      .withTargetsRightFetcher(() => this.territoryService.getAllProjection(TerritoryProjection))
      .build();
  }

  private defineUserPositionsTable(): DataTableDefinition<UserPositionProjection, UserPositionProjection> {
    return DataTableDefinition.builder<UserPositionProjection, UserPositionProjection>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('entity.territory.label', 'territoryName'),
        this.utils.getEditableColumnDef('entity.user.position.name', 'name'),
        this.utils.getEditableColumnDef('entity.user.position.organization', 'organization'),
        this.utils.getEditableColumnDef('common.form.email', 'email'),
        this.utils.getSelectColumnDef<CodeList, string>('common.form.type', 'type', true,
          () => this.codeList('userPosition.type').map(item => item.description),
          () => this.codeList('userPosition.type'),
          'value',
          'description'),
        this.utils.getDateColumnDef('common.form.expirationDate', 'expirationDate', true),
        this.utils.getDateColumnDef('entity.user.dataCreated', 'createdDate'),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder(['territoryName', 'createdDate'])
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return EMPTY;
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
      .build();
  }

  isUsernamePublic(): boolean {
    return this.entityForm.get('username').value === constants.codeValue.systemUser.public;
  }
}
