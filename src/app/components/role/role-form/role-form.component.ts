import { Component, OnInit } from '@angular/core';

import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService, UserService, CartographyGroupService, TaskService, UserConfigurationService, TerritoryService, HalOptions, HalParam,
  User, Territory, Role, ApplicationService } from '@app/domain';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '@app/services/utils.service';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { config } from '@config';
import { DialogGridComponent, DialogMessageComponent } from '@app/frontend-gui/src/lib/public_api';
import { MatDialog } from '@angular/material/dialog';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {constants} from '../../../../environments/constants';


@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styles: []
})
export class RoleFormComponent implements OnInit {

  //Form
  formRole: UntypedFormGroup;
  roleToEdit;
  roleSaved: Role;
  roleID = -1;
  duplicateID = -1;
  dataLoaded = false;

  //Grids
  columnDefsUsers: any[];
  getAllElementsEventUsers: Subject<string> = new Subject<string>();
  dataUpdatedEventUsers: Subject<boolean> = new Subject<boolean>();

  columnDefsTasks: any[];
  getAllElementsEventTasks: Subject<string> = new Subject<string>();
  dataUpdatedEventTasks: Subject<boolean> = new Subject<boolean>();

  columnDefsCartography: any[];
  getAllElementsEventCartographies: Subject<string> = new Subject<string>();
  dataUpdatedEventCartographies: Subject<boolean> = new Subject<boolean>();

  columnDefsApplications: any[];
  getAllElementsEventApplications: Subject<string> = new Subject<string>();
  dataUpdatedEventApplications: Subject<boolean> = new Subject<boolean>();

  themeGrid: any = config.agGridTheme;

  //Dialogs
  columnDefsUsersDialog: any[];
  columnDefsTerritoriesDialog: any[];
  addElementsEventUsers: Subject<any[]> = new Subject<any[]>();
  columnDefsTasksDialog: any[];
  addElementsEventTasks: Subject<any[]> = new Subject<any[]>();
  columnDefsCartographiesDialog: any[];
  addElementsEventCartographies: Subject<any[]> = new Subject<any[]>();
  columnDefsApplicationsDialog: any[];
  addElementsEventApplications: Subject<any[]> = new Subject<any[]>();

  //Save button
  territorisToUpdate: Territory[] = [];
  usersToUpdate: User[] = [];
  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();


  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private userService: UserService,
    public cartographyGroupService: CartographyGroupService,
    public tasksService: TaskService,
    public applicationService: ApplicationService,
    private http: HttpClient,
    public utils: UtilsService,
    private userConfigurationService: UserConfigurationService,
    private territoryService: TerritoryService
  ) {
    this.initializeRoleForm();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.roleID = +params.id;
      if (params.idDuplicate) { this.duplicateID = +params.idDuplicate; }

      if (this.roleID !== -1 || this.duplicateID != -1) {
        const idToGet = this.roleID !== -1 ? this.roleID : this.duplicateID


        this.roleService.get(idToGet).subscribe(
          resp => {

            this.roleToEdit = resp;
            this.formRole.patchValue({
              description: this.roleToEdit.description,
              _links: this.roleToEdit._links
            });

            if (this.roleID !== -1) {
              this.formRole.patchValue({
                id: this.roleID,
                name: this.roleToEdit.name,
              });
            }
            else {
              this.formRole.patchValue({
                name: this.utils.getTranslate('copy_').concat(this.roleToEdit.name),
              });
            }

            this.dataLoaded = true;
          },

        );
      }
      else { this.dataLoaded = true; }
    },
      );


    this.columnDefsUsers = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('roleEntity.username', 'user'),
      this.utils.getEditableColumnDef('roleEntity.territory', 'territory'),
      this.utils.getBooleanColumnDef('userEntity.appliesToChildrenTerritories', 'appliesToChildrenTerritories', true),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsTasks = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('roleEntity.name', 'name'),
      this.utils.getNonEditableColumnDef('roleEntity.groupTask', 'groupName'),
      this.utils.getNonEditableColumnDef('roleEntity.typeName', 'typeName'),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsCartography = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('roleEntity.name', 'name'),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsApplications = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('roleEntity.name', 'name'),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsUsersDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('roleEntity.username', 'username'),
    ];

    this.columnDefsTerritoriesDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('roleEntity.code', 'code'),
      this.utils.getNonEditableColumnDef('roleEntity.name', 'name'),
      this.utils.getBooleanColumnDef('userEntity.appliesToChildrenTerritories', 'appliesToChildrenTerritories', true),
    ];
    this.columnDefsCartographiesDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('roleEntity.name', 'name'),
    ];

    this.columnDefsTasksDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('roleEntity.name', 'name'),
      this.utils.getNonEditableColumnDef('roleEntity.groupTask', 'groupName'),
      this.utils.getNonEditableColumnDef('roleEntity.typeName', 'typeName'),
    ];

    this.columnDefsApplicationsDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('roleEntity.name', 'name'),
    ];

  }


  initializeRoleForm(): void {

    this.formRole = new UntypedFormGroup({
      id: new UntypedFormControl(null, []),
      name: new UntypedFormControl(null, [
        Validators.required,
      ]),
      description: new UntypedFormControl(null, []),
      _links: new UntypedFormControl(null, []),

    })

  }


  //AG GRID


  // ******** Users ******** //
  getAllUsers = (): Observable<any> => {

    if (this.roleID == -1 && this.duplicateID == -1) {
      const aux: any[] = [];
      return of(aux);
    }

    const params2: HalParam[] = [];
    const param: HalParam = { key: 'role.id', value: this.roleID }
    params2.push(param);
    const query: HalOptions = { params: params2 };

    return this.userConfigurationService.getAll(query);

  }

  getAllRowsUsers(event) {
    if (event.event == "save") {
      this.saveUsers(event.data);
    }
  }

  saveUsers(data: any[]) {
    const promisesDuplicate: Promise<any>[] = [];
    const promisesCurrentUserConf: Promise<any>[] = [];
    const promises: Promise<any>[] = [];

    for (const userConf of data) {
      if (userConf.status === 'pendingCreation' || (userConf.status === 'pendingModify' && !userConf._links)) {
        let item;
        if (userConf._links) {

          let urlReqTerritory = `${userConf._links.territory.href}`
          if (userConf._links.territory.href) {
            const url = new URL(urlReqTerritory.split("{")[0]);
            url.searchParams.append("projection", "view")
            urlReqTerritory = url.toString();
          }

          let urlReqUser = `${userConf._links.user.href}`
          if (userConf._links.user.href) {
            const url = new URL(urlReqUser.split("{")[0]);
            url.searchParams.append("projection", "view")
            urlReqUser = url.toString();
          }
          let territoryComplete;
          let userComplete;

          promisesDuplicate.push(new Promise((resolve, ) => {

            promisesCurrentUserConf.push(new Promise((resolve, ) => {
              this.http.get(urlReqTerritory).subscribe(result => {
                territoryComplete = result;
                resolve(true);
              })

            }))

            promisesCurrentUserConf.push(new Promise((resolve, ) => {
              this.http.get(urlReqUser).subscribe(result => {
                userComplete = result;
                resolve(true);
              })

            }))


            Promise.all(promisesCurrentUserConf).then(() => {

              item = {
                role: this.roleToEdit,
                appliesToChildrenTerritories: userConf.appliesToChildrenTerritories,
                territory: territoryComplete,
                user: userComplete,
              }
                userConf.new = false;
                promises.push(new Promise((resolve, ) => { this.userConfigurationService.save(item).subscribe(() => { resolve(true) }) }));

              // }
              resolve(true);
            })

          }))



        }
        else {
          item = {
            role: this.roleToEdit,
            appliesToChildrenTerritories: userConf.appliesToChildrenTerritories,
            territory: userConf.territoryComplete,
            user: userConf.userComplete,
          }


          let index;
          if (userConf.roleChildren == null) {
            index = data.findIndex(element => element.territoryId === item.territory.id && element.userId === item.user.id &&
              element.appliesToChildrenTerritories === item.appliesToChildrenTerritories && !element.new)
          }
          else {
            index = data.findIndex(element => element.territoryId === item.territory.id && element.userId === item.user.id && element.appliesToChildrenTerritories && !element.new)
          }
          if (index === -1) {
            userConf.new = false;
            promises.push(new Promise((resolve, ) => { this.userConfigurationService.save(item).subscribe(() => { resolve(true) }) }));

          }
        }

      }
      if (userConf.status === 'pendingModify' && userConf._links) {

        let urlReqTerritory = `${userConf._links.territory.href}`
        if (userConf._links.territory.href) {
          const url = new URL(urlReqTerritory.split("{")[0]);
          url.searchParams.append("projection", "view")
          urlReqTerritory = url.toString();
        }

        let urlReqUser = `${userConf._links.user.href}`
        if (userConf._links.user.href) {
          const url = new URL(urlReqUser.split("{")[0]);
          url.searchParams.append("projection", "view")
          urlReqUser = url.toString();
        }
        let territoryComplete;
        let userComplete;

        promisesDuplicate.push(new Promise((resolve, ) => {

          promisesCurrentUserConf.push(new Promise((resolve, ) => {
            this.http.get(urlReqTerritory).subscribe(result => {
              territoryComplete = result;
              resolve(true);
            })

          }))

          promisesCurrentUserConf.push(new Promise((resolve, ) => {
            this.http.get(urlReqUser).subscribe(result => {
              userComplete = result;
              resolve(true);
            })

          }))


          Promise.all(promisesCurrentUserConf).then(() => {

            const item = {
              id: userConf.id,
              role: this.roleToEdit._links.self.href.split("{")[0],
              appliesToChildrenTerritories: userConf.appliesToChildrenTerritories,
              territory: territoryComplete._links.self.href.split("{")[0],
              user: userComplete._links.self.href.split("{")[0],
              _links: userConf._links
            }
            promises.push(new Promise((resolve, ) => { this.userConfigurationService.save(item).subscribe(() => { resolve(true) }) }));
            resolve(true);
          })

        }))
      }
      if (userConf.status === 'pendingDelete' && userConf._links && !userConf.new) {
        promises.push(new Promise((resolve, ) => { this.userConfigurationService.remove(userConf).subscribe(() => { resolve(true) }) }));
      }
    }
    ;
    Promise.all([...promises,...promisesDuplicate]).then(() => {
      Promise.all(promises).then(() => {
        this.dataUpdatedEventUsers.next(true);
      })
    });
  }




  // ******** Task ******** //
  getAllTasks = (): Observable<any> => {

    if (this.roleID == -1 && this.duplicateID == -1) {
      const aux: any[] = [];
      return of(aux);
    }
    else {
      let urlReq = `${this.roleToEdit._links.tasks.href}`
      if (this.roleToEdit._links.tasks.templated) {
        const url = new URL(urlReq.split("{")[0]);
        url.searchParams.append("projection", "view")
        urlReq = url.toString();
      }
      return (this.http.get(urlReq))
        .pipe(map(data => data['_embedded']['tasks']));

    }


  }

  getAllRowsTasks(event) {
    if (event.event == "save") {
      this.saveTasks(event.data);
    }
  }

  saveTasks(data: any[]) {
    let dataChanged = false;
    const promises: Promise<any>[] = [];
    const tasksToPut = [];
    data.forEach(task => {
      if (task.status !== 'pendingDelete') {
        if (task.status === 'pendingModify') {
          if (task.newItem) { dataChanged = true; }
          promises.push(new Promise((resolve, ) => { this.tasksService.update(task).subscribe(() => { resolve(true) }) }));
        }
        else if (task.status === 'pendingCreation') {
          dataChanged = true;
        }
        tasksToPut.push(task._links.self.href)
      }
      else {
        dataChanged = true;
      }
    });
    Promise.all(promises).then(() => {
      if (dataChanged) {
        const url = this.roleToEdit._links.tasks.href.split('{', 1)[0];
        this.utils.updateUriList(url, tasksToPut, this.dataUpdatedEventTasks)
      }
      else { this.dataUpdatedEventTasks.next(true) }
    });

  }

  // ******** Cartography Groups ******** //
  getAllCartographiesGroups = (): Observable<any> => {
    if (this.roleID == -1 && this.duplicateID == -1) {
      const aux: any[] = [];
      return of(aux);

    }
    else {
      let urlReq = `${this.roleToEdit._links.permissions.href}`
      if (this.roleToEdit._links.permissions.templated) {
        const url = new URL(urlReq.split("{")[0]);
        url.searchParams.append("projection", "view")
        urlReq = url.toString();
      }
      return (this.http.get(urlReq))
        .pipe(map(data => data['_embedded']['cartography-groups']));
    }


  }

  getAllRowsCartographiesGroups(event) {
    if (event.event == "save") {
      this.saveCartographiesGroups(event.data);
    }
  }

  saveCartographiesGroups(data: any[]) {
    let dataChanged = false;
    const promises: Promise<any>[] = [];
    const cartographiesGroupToPut = [];
    data.forEach(cartographyGroup => {
      if (cartographyGroup.status !== 'pendingDelete') {
        if (cartographyGroup.status === 'pendingModify') {
          if (cartographyGroup.newItem) { dataChanged = true; }
          promises.push(new Promise((resolve, ) => { this.cartographyGroupService.update(cartographyGroup).subscribe(() => { resolve(true) }) }));

        }
        else if (cartographyGroup.status === 'pendingCreation') { dataChanged = true };
        cartographiesGroupToPut.push(cartographyGroup._links.self.href)
      }
      else { dataChanged = true }
    });
    Promise.all(promises).then(() => {
      if (dataChanged) {
        const url = this.roleToEdit._links.permissions.href.split('{', 1)[0];
        this.utils.updateUriList(url, cartographiesGroupToPut, this.dataUpdatedEventCartographies)
      }
      else { this.dataUpdatedEventCartographies.next(true) }
    });
  }

  // ******** Applications ******** //
  getAllApplications = (): Observable<any> => {
    // //TODO Change the link when available
    if (this.roleID == -1 && this.duplicateID == -1) {
      const aux: any[] = [];
      return of(aux);

    }
    else {
      let urlReq = `${this.roleToEdit._links.applications.href}`
      if (this.roleToEdit._links.applications.templated) {
        const url = new URL(urlReq.split("{")[0]);
        url.searchParams.append("projection", "view")
        urlReq = url.toString();
      }
      return (this.http.get(urlReq))
        .pipe(map(data => data['_embedded']['applications']));
    }

  }

  getAllRowsApplications(event) {
    if (event.event == "save") {
      this.saveApplications(event.data);
    }
  }


  saveApplications(data: any[]) {
    let dataChanged = false;
    const promises: Promise<any>[] = [];
    const applicationsToPut = [];
    data.forEach(application => {
      if (application.status !== 'pendingDelete') {
        if (application.status === 'pendingModify') {
          if (application.newItem) { dataChanged = true; }
          promises.push(new Promise((resolve, ) => { this.applicationService.update(application).subscribe(() => { resolve(true) }) }));
        }
        else if (application.status === 'pendingCreation') { dataChanged = true }
        applicationsToPut.push(application._links.self.href)
      }
      else { dataChanged = true }
    });
    Promise.all(promises).then(() => {
      if (dataChanged) {
        const url = this.roleToEdit._links.applications.href.split('{', 1)[0];
        this.utils.updateUriList(url, applicationsToPut, this.dataUpdatedEventApplications)
      }
      else { this.dataUpdatedEventApplications.next(true) }
    });

  }

  // ******** Users Dialog  ******** //

  getAllUsersDialog = () => {
    return this.userService.getAll();
  }

  getAllTerritoriesDialog = () => {
    return this.territoryService.getAll();
  }

  openUsersDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [this.getAllUsersDialog, this.getAllTerritoriesDialog];
    dialogRef.componentInstance.singleSelectionTable = [false, false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsUsersDialog, this.columnDefsTerritoriesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('roleEntity.permissions');
    dialogRef.componentInstance.titlesTable = [this.utils.getTranslate('roleEntity.users'), this.utils.getTranslate('roleEntity.territories')];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result) {
          if (result.event === 'Add') {
            if(result.data[0].length>0 && result.data[1].length>0){
              const rowsToAdd = this.adaptRowsToAddPermits(this.roleToEdit, result.data[1], result.data[0])

              this.addElementsEventUsers.next(rowsToAdd);
            }
            else{
              const dialogRef = this.dialog.open(DialogMessageComponent);
              dialogRef.componentInstance.title = this.utils.getTranslate("atention");
              dialogRef.componentInstance.message = this.utils.getTranslate("doubleSelectionMessage");
              dialogRef.componentInstance.hideCancelButton = true;
              dialogRef.afterClosed().subscribe();
            }
          }
        }
      }

    });

  }

  adaptRowsToAddPermits(role: Role, territories: Territory[], users: any[]) {
    const itemsToAdd: any[] = [];

    territories.forEach(territory => {
      let item;

      users.forEach(user => {

        item = {
          user: user.username,
          userId: user.id,
          userComplete: user,
          roleComplete: role,
          roleId: this.roleID,
          role: this.roleToEdit ? this.roleToEdit.name : "",
          territoryId: territory.id,
          territory: territory.name,
          territoryComplete: territory,
          appliesToChildrenTerritories: territory['appliesToChildrenTerritories']?true:false,
          new: true
        }


        itemsToAdd.push(item);
      })
      if(territory['appliesToChildrenTerritories']) { delete territory['appliesToChildrenTerritories'] }
    })
    return itemsToAdd;
  }

  // ******** Cartography Dialog  ******** //

  getAllCartographiesGroupsDialog = () => {
    const params2: HalParam[] = [];
    const param: HalParam = { key: 'type', value: constants.codeValue.cartographyPermissionType.cartographyGroup }
    params2.push(param);
    const query: HalOptions = { params: params2 };
    return this.cartographyGroupService.getAll(query, undefined);
  }

  openCartographyDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable = [this.getAllCartographiesGroupsDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsCartographiesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('roleEntity.permissiongroupLayersConfiguration');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.currentData = [data];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventCartographies.next(result.data[0])
        }
      }

    });

  }

  // ******** Tasks Dialog  ******** //

  getAllTasksDialog = () => {
    return this.tasksService.getAll();
  }

  openTasksDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable = [this.getAllTasksDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTasksDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('roleEntity.tasks');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.currentData = [data];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventTasks.next(result.data[0])
        }
      }

    });

  }

  getRowsToAddPermits(territories: Territory[], users: User[]) {
    const itemsToAdd: any[] = [];
    territories.forEach(territory => {

      users.forEach(user => {
        const item = {
          user: user.username,
          userComplete: user,
          territory: territory.name,
          territoryComplete: territory,
        }
        itemsToAdd.push(item);
      })
    })
    return itemsToAdd;
  }


  // ******** Applications Dialog  ******** //

  getAllApplicationsDialog = () => {
    return this.applicationService.getAll();
  }

  openApplicationsDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable = [this.getAllApplicationsDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsApplicationsDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('roleEntity.applications');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.currentData = [data];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventApplications.next(result.data[0])
        }
      }

    });

  }



  onSaveButtonClicked() {


    if(this.formRole.valid)
    {

    this.roleService.save(this.formRole.value)
      .subscribe(resp => {

        if (this.roleID == -1 && this.duplicateID != -1) {
          this.formRole.patchValue({
            _links: null
          })
        }

        this.roleToEdit = resp;
        this.roleID = resp.id
        this.formRole.patchValue({
          id: resp.id,
          _links: resp._links
        })
        this.getAllElementsEventUsers.next('save');
        this.getAllElementsEventApplications.next('save');
        this.getAllElementsEventCartographies.next('save');
        this.getAllElementsEventTasks.next('save');
      },
        error => {
          console.log(error);
        });

      }
      else {
        this.utils.showRequiredFieldsError();
      }


  }

  activeTabIndex = 0;

  onTabChange(event: MatTabChangeEvent) {
    this.activeTabIndex = event.index;
  }
}
