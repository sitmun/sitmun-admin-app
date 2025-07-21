import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
  Role,
  RoleService,
  Territory,
  TerritoryProjection,
  TerritoryService,
  User,
  UserConfiguration,
  UserConfigurationProjection,
  UserConfigurationService,
  UserPosition,
  UserPositionService,
  UserService
} from '@app/domain';
import {HalOptions, HalParam} from '@app/core/hal/rest/rest.service';
import {HttpClient} from '@angular/common/http';
import {UtilsService} from '@app/services/utils.service';
import {map} from 'rxjs/operators';
import {EMPTY, Observable, Subject, of} from 'rxjs';
import {DialogGridComponent, DialogMessageComponent} from '@app/frontend-gui/src/lib/public_api';
import {MatDialog} from '@angular/material/dialog';
import {constants} from '@environments/constants';
import {LoggerService} from '@app/services/logger.service';
import {Configuration} from "@app/core/config/configuration";
import {BaseFormComponent} from "@app/components/base-form.component";
import {TranslateService} from "@ngx-translate/core";
import {TranslationService} from "@app/domain";
import {CodeListService} from "@app/domain";
import {ErrorHandlerService} from "@app/services/error-handler.service";
import {DataTable2Definition, DataTableDefinition} from "@app/components/data-tables.util";
import {firstValueFrom} from "rxjs";
import {Status, onCreate, onDelete, onUpdate} from '@app/frontend-gui/src/lib/public_api';
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styles: []
})
export class UserFormComponent extends BaseFormComponent<User> {
  readonly config = Configuration.USER;

  readonly userConfigurationsTable: DataTable2Definition<UserConfigurationProjection, Role, TerritoryProjection>


  //Grids
  columnDefsPermits: any[];
  addElementsEventPermits: Subject<any[]> = new Subject<any[]>();
  dataUpdatedEventPermits: Subject<boolean> = new Subject<boolean>();

  columnDefsData: any[];
  addElementsEventTerritoryData: Subject<any[]> = new Subject<any[]>();
  dataUpdatedEventTerritoryData: Subject<boolean> = new Subject<boolean>();

  //Dialog
  columnDefsTerritoryDialog: any[];
  columnDefsRolesDialog: any[];
  getAllElementsEventPermits: Subject<string> = new Subject<string>();
  columnDefsTerritoryDataDialog: any[];
  getAllElementsEventTerritoryData: Subject<string> = new Subject<string>();

  //Save button
  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();

  /** Flag indicating if the password is set */
  passwordSet = false;

  /** Flag indicating if the password is being edited */
  isPasswordBeingEdited = false;

  /** Flag indicating if the password has been modified */
  passwordModified = false;

  /** The actual password value */
  actualPassword: string = null;

  /** Password placeholder text */
  passwordPlaceholder = '••••••••';
  
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
    private http: HttpClient,
    public utils: UtilsService,
    private userConfigurationService: UserConfigurationService,
    private roleService: RoleService,
    private userPositionService: UserPositionService,
    private territoryService: TerritoryService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router);
    this.userConfigurationsTable = this.defineUserConfigurationsTable();
  }

  override async preFetchData(): Promise<void> {
    await this.initCodeLists(['userPosition.type']);
    this.dataTables.register(this.userConfigurationsTable);

    this.columnDefsPermits = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('userEntity.territory', 'territory'),
      this.utils.getNonEditableColumnDef('userEntity.role', 'role'),
      this.utils.getBooleanColumnDef('userEntity.appliesToChildrenTerritories', 'appliesToChildrenTerritories', true),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsData = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getNonEditableColumnDef('userEntity.territory', 'territoryName'),
      this.utils.getEditableColumnDef('userEntity.position', 'name'),
      this.utils.getEditableColumnDef('userEntity.organization', 'organization'),
      this.utils.getEditableColumnDef('userEntity.mail', 'email'),
      this.utils.getSelectColumnDef('userEntity.type', 'type', true, 
        () => this.codeList('userPosition.type').map(item => item.description), 
        true, 
        () => this.codeList('userPosition.type')),
      this.utils.getDateColumnDef('userEntity.expirationDate', 'expirationDate', true),
      this.utils.getDateColumnDef('userEntity.dataCreated', 'createdDate'),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsTerritoryDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('userEntity.code', 'code'),
      this.utils.getNonEditableColumnDef('userEntity.name', 'name'),
    ];

    this.columnDefsRolesDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('userEntity.name', 'name'),
      this.utils.getBooleanColumnDef('userEntity.appliesToChildrenTerritories', 'appliesToChildrenTerritories', true),
    ];
  }

  override async fetchOriginal(): Promise<User> {
    return firstValueFrom(this.userService.get(this.entityID));
  }

  override async fetchCopy(): Promise<User> {
    return firstValueFrom(this.userService.get(this.duplicateID).pipe(map((copy: User) => {
      copy.username = this.translateService.instant("copy_") + copy.username;
      return copy;
    })));
  }

  override empty(): User {
    const user = new User();
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

  private defineUserConfigurationsTable(): DataTable2Definition<UserConfigurationProjection, Role, TerritoryProjection> {
    return DataTable2Definition.builder<UserConfigurationProjection, Role, TerritoryProjection>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef('entity.role.label', 'role', '/role/:id/roleForm', {id: 'roleId'}),
        this.utils.getRouterLinkColumnDef('entity.territory.label', 'territory', '/territory/:id/territoryForm', {id: 'territoryId'}),
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


  // AG-GRID

  // ******** Permits ******** //
  getAllPermits = (): Observable<any> => {
    if (this.isNew()) {
      const aux: any[] = [];
      return of(aux);
    }

    const params2: HalParam[] = [];
    const param: HalParam = {key: 'user.id', value: this.entityID != -1 ? this.entityID : this.duplicateID};
    params2.push(param);
    const query: HalOptions = {params: params2};

    return this.userConfigurationService.getAll(query);
  };

  getAllRowsPermits(event) {
    if (event.event == 'save') {
      this.savePermits(event.data);
    }
  }

  async savePermits(data: any[]) {
    const territoriesToDelete = [];
    const territoriesToAdd = [];
    const promises: Promise<any>[] = [];
    const promisesDuplicate: Promise<any>[] = [];
    const promisesCurrentUserConf: Promise<any>[] = [];
    const promisesCheckTerritories: Promise<any>[] = [];
    const promisesTerritories: Promise<any>[] = [];
    let showDialog = false;

    for (const userConf of data) {
      if (userConf.status === 'pendingCreation' || (userConf.status === 'pendingModify' && !userConf._links)) {
        let item;
        let itemTerritory;

        if (userConf._links) {
          const index = data.findIndex(element => (element.roleId === userConf.roleId && element.territoryId === userConf.territoryId &&
            element.appliesToChildrenTerritories === userConf.appliesToChildrenTerritories && !element.newItem));
          if (index === -1) {
            const indexTerritory = data.findIndex(element => element.territoryId === userConf.territoryId && !element.newItem);
            userConf.newItem = false;

            let roleComplete;
            let territoryComplete;

            let urlReqRole = `${userConf._links.role.href}`;
            if (userConf._links.role.href) {
              const url = new URL(urlReqRole.split('{')[0]);
              url.searchParams.append('projection', 'view');
              urlReqRole = url.toString();
            }

            let urlReqTerritory = `${userConf._links.territory.href}`;
            if (userConf._links.territory.href) {
              const url = new URL(urlReqTerritory.split('{')[0]);
              url.searchParams.append('projection', 'view');
              urlReqTerritory = url.toString();
            }

            promisesDuplicate.push(new Promise((resolve,) => {
              promisesCurrentUserConf.push(new Promise((resolve,) => {
                this.http.get(urlReqRole).subscribe(result => {
                  roleComplete = result;
                  resolve(true);
                });
              }));

              promisesCurrentUserConf.push(new Promise((resolve,) => {
                this.http.get(urlReqTerritory).subscribe(result => {
                  territoryComplete = result;
                  resolve(true);
                });
              }));

              Promise.all(promisesCurrentUserConf).then(() => {
                item = {
                  role: roleComplete,
                  appliesToChildrenTerritories: userConf.appliesToChildrenTerritories,
                  territory: territoryComplete,
                  user: this.entityToEdit
                };
                promises.push(new Promise((resolve,) => {
                  this.userConfigurationService.save(item).subscribe(() => {
                    resolve(true);
                  });
                }));

                if (indexTerritory === -1 && !territoriesToAdd.includes(userConf.territoryId)) {
                  territoriesToAdd.push(userConf.territoryId);
                  itemTerritory = {
                    territory: territoryComplete,
                    user: this.entityToEdit,
                    id: null,
                    _links: null,
                  };
                  promisesTerritories.push(new Promise((resolve,) => {
                    this.userPositionService.save(itemTerritory).subscribe(() => {
                      resolve(true);
                    });
                  }));
                }
                resolve(true);
              });
            }));
          }
        } else {
          item = {
            role: userConf.roleComplete,
            appliesToChildrenTerritories: userConf.appliesToChildrenTerritories,
            territory: userConf.territoryComplete,
            user: this.entityToEdit
          };

          const index = data.findIndex(element => element.roleId === item.role.id && element.territoryId === item.territory.id &&
            element.appliesToChildrenTerritories === item.appliesToChildrenTerritories && !element.newItem);

          const indexTerritory = data.findIndex(element => element.territoryId === userConf.territoryComplete.id && !element.newItem && element.status == 'pendingCreation' && !element._links);

          if (index === -1) {
            userConf.newItem = false;
            promises.push(new Promise((resolve,) => {
              this.userConfigurationService.save(item).subscribe(() => {
                resolve(true);
              });
            }));
          }

          if (indexTerritory === -1 && !territoriesToAdd.includes(userConf.territoryId)) {
            userConf.newItem = false;
            promisesCheckTerritories.push(new Promise((resolve,) => {
              this.userPositionService.getAll()
                .pipe(map((data: any[]) => data.filter(elem => elem.territoryName === userConf.territory && elem.userId === this.entityID)
                )).subscribe(data => {
                if (data.length == 0) {
                  if (!territoriesToAdd.includes(userConf.territoryId)) {
                    territoriesToAdd.push(userConf.territoryId);
                    itemTerritory = {
                      territory: userConf.territoryComplete,
                      user: this.entityToEdit,
                      id: null,
                      _links: null,
                    };
                    promisesTerritories.push(new Promise((resolve,) => {
                      this.userPositionService.save(itemTerritory).subscribe(() => {
                        resolve(true);
                      });
                    }));
                  }
                }
                resolve(true);
              });
            }));
            territoriesToAdd.push(userConf.territoryId);
            itemTerritory = {
              territory: userConf.territoryComplete,
              user: this.entityToEdit,
            };

            promisesTerritories.push(new Promise((resolve,) => {
              this.userPositionService.save(itemTerritory).subscribe(() => {
                resolve(true);
              });
            }));
          }
        }
      }
      if (userConf.status === 'pendingModify' && userConf._links) {
        let roleComplete;
        let territoryComplete;

        let urlReqRole = `${userConf._links.role.href}`;
        if (userConf._links.role.href) {
          const url = new URL(urlReqRole.split('{')[0]);
          url.searchParams.append('projection', 'view');
          urlReqRole = url.toString();
        }

        let urlReqTerritory = `${userConf._links.territory.href}`;
        if (userConf._links.territory.href) {
          const url = new URL(urlReqTerritory.split('{')[0]);
          url.searchParams.append('projection', 'view');
          urlReqTerritory = url.toString();
        }

        promisesDuplicate.push(new Promise((resolve,) => {
          promisesCurrentUserConf.push(new Promise((resolve,) => {
            this.http.get(urlReqRole).subscribe(result => {
              roleComplete = result;
              resolve(true);
            });
          }));

          promisesCurrentUserConf.push(new Promise((resolve,) => {
            this.http.get(urlReqTerritory).subscribe(result => {
              territoryComplete = result;
              resolve(true);
            });
          }));

          Promise.all(promisesCurrentUserConf).then(() => {
            const item = {
              appliesToChildrenTerritories: userConf.appliesToChildrenTerritories,
              role: roleComplete,
              territory: territoryComplete,
              user: userConf._links.user.href,
              _links: userConf._links
            };
            promises.push(new Promise((resolve,) => {
              this.userConfigurationService.save(item).subscribe(() => {
                resolve(true);
              });
            }));
            resolve(true);
          });
        }));
      }
      if (userConf.status === 'pendingDelete' && userConf._links && !userConf.newItem) {
        const indexTerritory = data.findIndex(element => element.territoryId === userConf.territoryId && element.status !== 'pendingDelete');
        if (indexTerritory === -1 && !territoriesToDelete.includes(userConf.territoryId)) {
          showDialog = true;
          territoriesToDelete.push(userConf.territoryId);
        }

        promises.push(new Promise((resolve,) => {
          this.userConfigurationService.delete(userConf).subscribe(() => {
            resolve(true);
          });
        }));
      }
    }

    Promise.all([...promises, ...promisesDuplicate]).then(() => {
      Promise.all(promises).then(() => {
        this.dataUpdatedEventPermits.next(true);
      });
    });

    Promise.all([...promisesTerritories, ...promisesDuplicate, ...promisesCheckTerritories]).then(() => {
      Promise.all(promisesTerritories).then(() => {
        this.dataUpdatedEventTerritoryData.next(true);
        if (showDialog) {
          this.showNoRelationshipwithPermissions();
        }
      });
    });
  }

  // ******** Data of Territory ******** //
  getAllDataTerritory = (): Observable<any> => {
    if (this.isNew()) {
      const aux: any[] = [];
      return of(aux);
    }

    let urlReq = `${this.entityToEdit._links.positions.href}`;
    if (this.entityToEdit._links.positions.templated) {
      const url = new URL(urlReq.split('{')[0]);
      url.searchParams.append('projection', 'view');
      urlReq = url.toString();
    }
    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['user-positions']));
  };

  getAllRowsDataTerritories(event) {
    if (event.event == 'save') {
      this.saveTerritories(event.data);
    }
  }

  saveTerritories(data: any[]) {
    const promises: Promise<any>[] = [];
    data.forEach(territory => {
      if (territory.status === 'pendingModify' || territory.status === 'pendingCreation') {
        if (territory.expirationDate != null) {
          const date = new Date(territory.expirationDate);
          territory.expirationDate = date.toISOString();
        }

        if (territory.type) {
          const currentType = this.findInCodeList('userPosition.type', territory.type);
          if (currentType) {
            territory.type = currentType.value;
          }
        }

        promises.push(new Promise((resolve,) => {
          this.userPositionService.save(territory).subscribe(() => {
            resolve(true);
          });
        }));
      } else if (territory.status === 'pendingDelete') {
        promises.push(new Promise((resolve,) => {
          this.userPositionService.delete(territory).subscribe(() => {
            resolve(true);
          });
        }));
      }
    });

    Promise.all(promises).then(() => {
      this.dataUpdatedEventTerritoryData.next(true);
    });
  }

  // ******** Permits Dialog  ******** //
  getAllTerritoriesDialog = () => {
    return this.territoryService.getAll();
  };

  getAllRolesDialog = () => {
    return this.roleService.getAll();
  };

  openPermitsDialog() {
    const dialogRef = this.dialog.open(DialogGridComponent, {panelClass: 'gridDialogs'});
    dialogRef.componentInstance.orderTable = ['name', 'name'];
    dialogRef.componentInstance.getAllsTable = [this.getAllTerritoriesDialog, this.getAllRolesDialog];
    dialogRef.componentInstance.singleSelectionTable = [true, false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTerritoryDialog, this.columnDefsRolesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.changeHeightButton = true;
    dialogRef.componentInstance.heightByDefault = '10';
    dialogRef.componentInstance.title = this.utils.getTranslate('userEntity.permissions');
    dialogRef.componentInstance.titlesTable = [this.utils.getTranslate('userEntity.territories'), this.utils.getTranslate('userEntity.roles')];
    dialogRef.componentInstance.nonEditable = false;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          if (result.data[0].length > 0 && result.data[1].length > 0) {
            for (const territory of result.data[0]) {
              this.addElementsEventPermits.next(this.getRowsToAddPermits(territory, result.data[1]));
            }
          } else {
            const dialogRef = this.dialog.open(DialogMessageComponent);
            dialogRef.componentInstance.title = this.utils.getTranslate('atention');
            dialogRef.componentInstance.message = this.utils.getTranslate('doubleSelectionMessage');
            dialogRef.componentInstance.hideCancelButton = true;
            dialogRef.afterClosed().subscribe();
          }
        }
      }
    });
  }

  getRowsToAddPermits(territory: Territory, roles: Role[]) {
    const itemsToAdd: any[] = [];
    roles.forEach(role => {
      const appliesToChildrenTerritories = role['appliesToChildrenTerritories'] === true;
      const newRole = {...role};
      delete newRole['appliesToChildrenTerritories'];

      const item = {
        role: newRole.name,
        roleComplete: newRole,
        roleId: newRole.id,
        territory: territory.name,
        territoryComplete: territory,
        territoryName: territory.name,
        territoryId: territory.id,
        userId: this.entityID,
        appliesToChildrenTerritories: appliesToChildrenTerritories,
        new: true,
      };
      if (this.entityToEdit) {
        item.userId = this.entityToEdit.id;
      }
      itemsToAdd.push(item);
    });

    return itemsToAdd;
  }

  // ******** Territory Data Dialog  ******** //
  getAllTerritoryDataDialog = () => {
    const aux: any[] = [];
    return of(aux);
  };

  openTerritoryDataDialog() {
    const dialogRef = this.dialog.open(DialogGridComponent, {panelClass: 'gridDialogs'});
    dialogRef.componentInstance.getAllsTable = [this.getAllTerritoryDataDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTerritoryDataDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('userEntity.dataOfTerritory');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.nonEditable = false;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventTerritoryData.next(this.adaptFormatTerritory(result.data[0]));
        }
      }
    });
  }

  adaptFormatTerritory(dataToAdapt: Territory[]) {
    const newData: any[] = [];

    dataToAdapt.forEach(element => {
      const item = {
        id: null,
        territory: element,
        user: this.entityToEdit,
      };
      newData.push(item);
    });

    return newData;
  }

  showNoRelationshipwithPermissions() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('atention');
    dialogRef.componentInstance.message = this.utils.getTranslate('permissionsNoRelationship');
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
  }

  onPasswordChange() {
    const passwordValue = this.entityForm.get('newPassword')?.value;
    
    // Handle new password field
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

  resetPasswordField() {
    this.entityForm.get('newPassword').setValue(this.passwordSet ? this.passwordPlaceholder : '');
  }

  isUsernamePublic(): boolean {
    return this.entityForm.get('username').value === constants.codeValue.systemUser.public;
  }
}
