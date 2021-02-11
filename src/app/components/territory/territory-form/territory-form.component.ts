import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Territory, TerritoryService, TaskAvailabilityService, TerritoryGroupTypeService, CartographyAvailabilityService, UserService, RoleService, CartographyService, TaskService, UserConfigurationService, HalOptions, HalParam, User, Role, Cartography, Task, TaskAvailability } from 'dist/sitmun-frontend-core/';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DialogGridComponent, DialogMessageComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';
import { UserConfiguration } from '@sitmun/frontend-core';


@Component({
  selector: 'app-territory-form',
  templateUrl: './territory-form.component.html',
  styleUrls: ['./territory-form.component.scss']
})
export class TerritoryFormComponent implements OnInit {

  //Form
  themeGrid: any = environment.agGridTheme;
  scopeTypes: Array<any> = [];
  groupTypeOfThisTerritory:any;
  territoryForm: FormGroup;
  territoryToEdit:any;
  territoryID = -1;
  territoryGroups: Array<any> = [];
  extensions: Array<string>;
  dataLoaded: Boolean = false;
  idGroupType:any;
  terrritoryObj:any;

  //Grids
  columnDefsPermits: any[];
  getAllElementsEventPermits: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEventPermits: Subject<boolean> = new Subject<boolean>();

  columnDefsPermitsChild: any[];
  getAllElementsEventPermitsChild: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEventPermitsChild: Subject<boolean> = new Subject<boolean>();

  columnDefsMemberOf: any[];
  getAllElementsEventTerritoriesMemberOf: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEventMemberOf: Subject<boolean> = new Subject<boolean>();

  columnDefsMembers: any[];
  getAllElementsEventTerritoriesMembers: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEventMembers: Subject<boolean> = new Subject<boolean>();

  columnDefsCartographies: any[];
  getAllElementsEventCartographies: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEventCartographies: Subject<boolean> = new Subject<boolean>();

  columnDefsTasks: any[];
  getAllElementsEventTasks: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEventTasks: Subject<boolean> = new Subject<boolean>();

  //Dialog
  columnDefsTasksDialog: any[];
  addElementsEventTasks: Subject<any[]> = new Subject<any[]>();
  columnDefsCartographiesDialog: any[];
  addElementsEventCartographies: Subject<any[]> = new Subject<any[]>();
  columnDefsTerritoriesDialog: any[];
  addElementsEventTerritoriesMembers: Subject<any[]> = new Subject<any[]>();
  addElementsEventTerritoriesMemberOf: Subject<any[]> = new Subject<any[]>();
  columnDefsUsersDialog: any[];
  columnDefsRolesDialog: any[];
  addElementsEventPermits: Subject<any[]> = new Subject<any[]>();
  addElementsEventChildrenPermits: Subject<any[]> = new Subject<any[]>();

  //Save button
  rolesToUpdate: Role[] = [];
  usersToUpdate: User[] = [];
  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();


  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private territoryService: TerritoryService,
    private userService: UserService,
    private roleService: RoleService,
    private territoryGroupTypeService: TerritoryGroupTypeService,
    private cartographyService: CartographyService,
    private cartographyAvailabilityService: CartographyAvailabilityService,
    private taskAvailabilityService: TaskAvailabilityService,
    private taskService: TaskService,
    private userConfigurationService: UserConfigurationService,
    private http: HttpClient,
    public utils: UtilsService,
  ) {
    this.initializeTerritoryForm();
  }

  ngOnInit(): void {

    let territoryByDefault = {
      id: -1,
      name: '-------'
    }
    this.territoryGroups.push(territoryByDefault);
    this.groupTypeOfThisTerritory = territoryByDefault;

    const promises: Promise<any>[] = [];
    promises.push(new Promise((resolve, reject) => {
      this.getTerritoryGroups().subscribe(
        resp => {
          this.territoryGroups.push(...resp);
          resolve(true);
        }
      )
    }));
    promises.push(new Promise((resolve, reject) => {
      this.utils.getCodeListValues('territory.scope').subscribe(
        resp => {
          this.scopeTypes.push(...resp);
          resolve(true);
        }
      )
    }));

    Promise.all(promises).then(() => {
      this.activatedRoute.params.subscribe(params => {
        this.territoryID = +params.id;
        if (this.territoryID !== -1) {
          this.territoryService.get(this.territoryID).subscribe(
            resp => {
              console.log(resp);
              this.territoryToEdit = resp;

              this.extensions = this.territoryToEdit.extent.split(' ');

              this.territoryForm.setValue({
                id: this.territoryID,
                code: this.territoryToEdit.code,
                name: this.territoryToEdit.name,
                territorialAuthorityAddress: this.territoryToEdit.territorialAuthorityAddress,
                territorialAuthorityLogo: this.territoryToEdit.territorialAuthorityLogo,
                scope: this.territoryToEdit.scope,
                groupType: this.territoryToEdit.groupTypeId,
                extent: this.territoryToEdit.extent,
                extensionX0: this.extensions[0],
                extensionX1: this.extensions[1],
                extensionY0: this.extensions[2],
                extensionY1: this.extensions[3],
                note: this.territoryToEdit.note,
                blocked: this.territoryToEdit.blocked,
                _links: this.territoryToEdit._links
              });
              if( !this.territoryToEdit.groupTypeId) {
                this.territoryForm.patchValue({
                  groupType: this.territoryGroups[0].id,
                })
              }
              this.dataLoaded = true;
            },
            error => {

            }
          );
        }
        else {
          this.territoryForm.patchValue({
            blocked: false,
            groupType: this.territoryGroups[0].id,
            scope: this.scopeTypes[0].value
          });
          this.dataLoaded = true;
        }

      },
        error => {

        });
    });


    this.columnDefsPermits = [
      environment.selCheckboxColumnDef,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.user'), field: 'user', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.role'), field: 'role', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.status'), field: 'status', editable: false },
    ];

    this.columnDefsPermitsChild = [
      environment.selCheckboxColumnDef,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.user'), field: 'user', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.role'), field: 'roleChildren', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.status'), field: 'status', editable: false },
    ];

    this.columnDefsMemberOf = [
      environment.selCheckboxColumnDef,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.code'), field: 'code', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('territoryEntity.status'), field: 'status', editable: false },
    ];

    this.columnDefsMembers = [
      environment.selCheckboxColumnDef,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.code'), field: 'code', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('territoryEntity.status'), field: 'status', editable: false },
    ];

    this.columnDefsCartographies = [
      environment.selCheckboxColumnDef,
      { headerName: 'Id', field: 'cartographyId', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.name'), field: 'cartographyName', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.layers'), field: 'cartographyLayers', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.status'), field: 'status', editable: false },
    ];

    this.columnDefsTasks = [
      environment.selCheckboxColumnDef,
      { headerName: 'Id', field: 'taskId', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.taskGroup'), field: 'taskGroupName', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.status'), field: 'status', editable: false },
    ];

    this.columnDefsTerritoriesDialog = [
      environment.selCheckboxColumnDef,
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.name'), field: 'name', editable: false },
    ];

    this.columnDefsCartographiesDialog = [
      environment.selCheckboxColumnDef,
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.name'), field: 'name', editable: false },
    ];

    this.columnDefsTasksDialog = [
      environment.selCheckboxColumnDef,
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.name'), field: 'name', editable: false },
    ];

    this.columnDefsUsersDialog = [
      environment.selCheckboxColumnDef,
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('roleEntity.username'), field: 'username', editable: false },
    ];

    this.columnDefsRolesDialog = [
      environment.selCheckboxColumnDef,
      { headerName: this.utils.getTranslate('territoryEntity.id'), field: 'id', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.name'), field: 'name', editable: false },
    ];

    this.columnDefsTerritoriesDialog = [
      environment.selCheckboxColumnDef,
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.code'), field: 'code', editable: false },
      { headerName: this.utils.getTranslate('territoryEntity.name'), field: 'name', editable: false },
    ];



  }


  initializeTerritoryForm(): void {

    this.territoryForm = new FormGroup({
      id: new FormControl(null, []),
      code: new FormControl(null, [Validators.required,]),
      name: new FormControl(null, [Validators.required,]),
      territorialAuthorityAddress: new FormControl(null),
      territorialAuthorityLogo: new FormControl(null),
      scope: new FormControl(null),
      groupType: new FormControl(null),
      extensionX0: new FormControl(null),
      extensionX1: new FormControl(null),
      extensionY0: new FormControl(null),
      extensionY1: new FormControl(null),
      extent: new FormControl(null),
      note: new FormControl(null),
      blocked: new FormControl(null),
      _links: new FormControl(null),

    })

  }

  getTerritoryGroups() {
    return this.territoryGroupTypeService.getAll();
  }

  getTerritoryGroupOfThisTerritory() {
    return this.territoryGroupTypeService.get(this.territoryID);
  }

  updateExtent() {
    let extensionToUpdate = `${this.territoryForm.get('extensionX0').value} ${this.territoryForm.get('extensionX1').value} ${this.territoryForm.get('extensionY0').value} ${this.territoryForm.get('extensionY1').value}`;
    this.territoryForm.patchValue({
      extent: extensionToUpdate
    });
  }


  // AG-GRID
  // ******** Permits ******** //
  getAllPermits = (): Observable<any> => {

    if (this.territoryID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    let params2: HalParam[] = [];
    let param: HalParam = { key: 'territory.id', value: this.territoryID }
    params2.push(param);
    let query: HalOptions = { params: params2 };

    return this.userConfigurationService.getAll(query)
      .pipe(map((data: any[]) => data.filter(elem => elem.roleChildren == null)
      ));;
  }

  // ******** Permits Children ******** //
  getAllPermitsChild = (): Observable<any> => {

    if (this.territoryID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    let params2: HalParam[] = [];
    let param: HalParam = { key: 'territory.id', value: this.territoryID }
    params2.push(param);
    let query: HalOptions = { params: params2 };

    return this.userConfigurationService.getAll(query)
      .pipe(map((data: any[]) => data.filter(elem => elem.roleChildren != null)
      ));;
  }

  getAllRowsPermits(data: any[]) {

    let usersConfToCreate = [];
    let usersConfDelete = [];
    console.log(data);
    data.forEach(userConf => {
      if (userConf.status === 'Pending creation') {
        let item = {
          role: userConf.roleComplete,
          roleChildren: userConf.roleChildrenComplete,
          territory: this.territoryToEdit,
          user: userConf.userComplete,
        }
        console.log(item);
        let index;
        if(userConf.roleChildren == null){
          index = data.findIndex(element => element.roleId === item.role.id && element.userId === item.user.id && !element.new)
        }
        else{
          index = data.findIndex(element => element.roleChildrenId === item.roleChildren.id && element.userId === item.user.id && !element.new)
        }
        if (index === -1) {
          userConf.new = false;
          usersConfToCreate.push(item)
        }
      }
      if (userConf.status === 'Deleted' && userConf._links) { usersConfDelete.push(userConf) }
    });
    const promises: Promise<any>[] = [];
    usersConfToCreate.forEach(newElement => {
      promises.push(new Promise((resolve, reject) => { this.userConfigurationService.save(newElement).subscribe((resp) => { resolve(true) }) }));
    });

    usersConfDelete.forEach(deletedElement => {
      if (deletedElement._links) {
        promises.push(new Promise((resolve, reject) => { this.userConfigurationService.remove(deletedElement).subscribe((resp) => { resolve(true) }) }));
      }

    });

    Promise.all(promises).then(() => {
      this.dataUpdatedEventPermits.next(true);
    });

  }

  // ******** MembersOf ******** //
  getAllMembersOf = (): Observable<any> => {
    if (this.territoryID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.territoryToEdit._links.memberOf.href}`
    if (this.territoryToEdit._links.memberOf.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['territories']));

  }



  getAllRowsMembersOf(data: any[]) {
    let territoriesModified = [];
    let territoriesToPut = [];
    data.forEach(territory => {
      if (territory.status === 'Modified') { territoriesModified.push(territory) }
      if (territory.status !== 'Deleted') { territoriesToPut.push(territory._links.self.href) }
    });

    console.log(territoriesModified);
    this.updateTerritoriesMembersOf(territoriesModified, territoriesToPut);
  }

  updateTerritoriesMembersOf(territoriesModified: Territory[], territoriesToPut: Territory[]) {
    const promises: Promise<any>[] = [];
    territoriesModified.forEach(territory => {
      promises.push(new Promise((resolve, reject) => { this.territoryService.update(territory).subscribe((resp) => { resolve(true) }) }));
    });
    Promise.all(promises).then(() => {
      let url = this.territoryToEdit._links.memberOf.href.split('{', 1)[0];
      this.utils.updateUriList(url, territoriesToPut, this.dataUpdatedEventMemberOf)
    });
  }


  // ******** Members ******** //
  getAllMembers = (): Observable<any> => {

    if (this.territoryID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.territoryToEdit._links.members.href}`
    if (this.territoryToEdit._links.members.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['territories']));

  }

  getAllRowsMembers(data: any[]) {

    if (this.territoryID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    let territoriesModified = [];
    let territoriesToPut = [];
    data.forEach(territory => {
      if (territory.status === 'Modified') { territoriesModified.push(territory) }
      if (territory.status !== 'Deleted') { territoriesToPut.push(territory._links.self.href) }
    });
    console.log(territoriesModified);
    this.updateTerritoriesMembers(territoriesModified, territoriesToPut);

  }

  updateTerritoriesMembers(territoriesModified: Territory[], territoriesToPut: Territory[]) {
    const promises: Promise<any>[] = [];
    territoriesModified.forEach(territory => {
      promises.push(new Promise((resolve, reject) => { this.territoryService.update(territory).subscribe((resp) => { resolve(true) }) }));
    });
    Promise.all(promises).then(() => {
      let url = this.territoryToEdit._links.members.href.split('{', 1)[0];
      this.utils.updateUriList(url, territoriesToPut, this.dataUpdatedEventMembers)
    });
  }

  // ******** Cartography ******** //
  getAllCartographies = (): Observable<any> => {

    if (this.territoryID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.territoryToEdit._links.cartographyAvailabilities.href}`
    if (this.territoryToEdit._links.cartographyAvailabilities.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['cartography-availabilities']));

  }

  getAllRowsCartographies(data: any[]) {
    let cartographiesToCreate = [];
    let cartographiesToDelete = [];
    data.forEach(cartography => {
      cartography.territory = this.territoryToEdit;
      if (cartography.status === 'Pending creation') {
        let index = data.findIndex(element => element.cartographyId === cartography.cartographyId && !element.new)
        if (index === -1) {
          cartographiesToCreate.push(cartography)
          cartography.new = false;
        }

      }
      if (cartography.status === 'Deleted' && cartography._links) { cartographiesToDelete.push(cartography) }
    });
    const promises: Promise<any>[] = [];
    cartographiesToCreate.forEach(newElement => {
      promises.push(new Promise((resolve, reject) => { this.cartographyAvailabilityService.save(newElement).subscribe((resp) => { resolve(true) }) }));
    });

    cartographiesToDelete.forEach(deletedElement => {
      promises.push(new Promise((resolve, reject) => { this.cartographyAvailabilityService.remove(deletedElement).subscribe((resp) => { resolve(true) }) }));
    });

    Promise.all(promises).then(() => {
      this.dataUpdatedEventCartographies.next(true);
    });
  }

  // ******** Task ******** //
  getAllTasks = (): Observable<any> => {

    if (this.territoryID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.territoryToEdit._links.taskAvailabilities.href}`
    if (this.territoryToEdit._links.taskAvailabilities.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['task-availabilities']));
  }

  getAllRowsTasks(data: any[]) {
    let tasksToDelete = [];
    let tasksToCreate = [];
    data.forEach(task => {
      if (task.status === 'Deleted' && task._links) { tasksToDelete.push(task) }
      if (task.status === 'Pending creation') {

        let index = data.findIndex(element => element.taskId === task.taskId && !element.new)
        if (index === -1) {
          task.new = false;
          let taskToCreate: TaskAvailability = new TaskAvailability();
          taskToCreate.territory = this.territoryToEdit;
          taskToCreate.task = task;
          tasksToCreate.push(taskToCreate)
        }
      }
    });
    const promises: Promise<any>[] = [];

    tasksToCreate.forEach(task => {
      promises.push(new Promise((resolve, reject) => { this.taskAvailabilityService.save(task).subscribe((resp) => { resolve(true) }) }));

    })

    tasksToDelete.forEach(task => {
      promises.push(new Promise((resolve, reject) => { this.taskAvailabilityService.remove(task).subscribe((resp) => { resolve(true) }) }));
    })

    Promise.all(promises).then(() => {
      this.dataUpdatedEventTasks.next(true);
    });
  }

  updateTasks(tasksModified: Task[], tasksToPut: TaskAvailability[]) {
    const promises: Promise<any>[] = [];
    tasksModified.forEach(task => {
      promises.push(new Promise((resolve, reject) => { this.taskService.update(task).subscribe((resp) => { resolve(true) }) }));
    });
    Promise.all(promises).then(() => {
      // let url=this.territoryToEdit._links.taskAvailabilities.href.split('{', 1)[0];
      // this.utils.updateUriList(url,tasksToPut)
      tasksToPut.forEach(task => {
        this.taskAvailabilityService.save(task).subscribe(result => {
          console.log(result)
        })
      })

    });
  }


  // ******** Permits Dialog  ******** //

  getAllUsersDialog = () => {
    return this.userService.getAll();
  }

  getAllRolesDialog = () => {
    return this.roleService.getAll();
  }

  openPermitsDialog(data: any, childrenTable: boolean) {

    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [this.getAllUsersDialog, this.getAllRolesDialog];
    dialogRef.componentInstance.singleSelectionTable = [false, false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsUsersDialog, this.columnDefsRolesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    if(childrenTable){
      dialogRef.componentInstance.title = this.utils.getTranslate('territoryEntity.permissionsChildren');
    }
    else {
      dialogRef.componentInstance.title = this.utils.getTranslate('territoryEntity.permits');
    }
    dialogRef.componentInstance.titlesTable = [this.utils.getTranslate('territoryEntity.users'), this.utils.getTranslate('territoryEntity.roles')];
    dialogRef.componentInstance.nonEditable = false;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          console.log(result.data);
          let rowsToAdd = this.getRowsToAddPermits(this.territoryToEdit, result.data[1], result.data[0], childrenTable)
          console.log(rowsToAdd);
          if(!childrenTable) {this.addElementsEventPermits.next(rowsToAdd) }
          else { this.addElementsEventChildrenPermits.next(rowsToAdd)}

        }
      }

    });

  }

  // ******** Permits Children Dialog  ******** //

  

  // ******** Territory Member Of Dialog  ******** //
  getAllTerritoriesMemberOfDialog = () => {
    return this.territoryService.getAll().
      pipe(
        map((resp: any) => {
          let newTable: Territory[] = [];
          resp.forEach(element => {
            if (element.scope == 'R') { newTable.push(element) }
          });
          return newTable;
        })
      );
  }

  openTerritoryMemberOfDialog(data: any) {
    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [this.getAllTerritoriesMemberOfDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTerritoriesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('territoryEntity.territories');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          if (result.event === 'Add') {
            this.addElementsEventTerritoriesMemberOf.next(result.data[0])
          }
        }
      }
    });
  }

  // ******** Territory Members Dialog  ******** //
  getAllTerritoriesMembersDialog = () => {
    return this.territoryService.getAll().
      pipe(
        map((resp: any) => {
          let newTable: Territory[] = [];
          resp.forEach(element => {
            if (element.scope == 'M') { newTable.push(element) }
          });
          return newTable;
        })
      );;
  }

  openTerritoryMembersDialog(data: any) {
    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [this.getAllTerritoriesMembersDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTerritoriesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = 'Territories';
    dialogRef.componentInstance.titlesTable = ['Territories'];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventTerritoriesMembers.next(result.data[0])
        }
      }
    });
  }

  // ******** Cartography Dialog  ******** //
  getAllCartographiesDialog = () => {
    return this.cartographyService.getAll();
  }

  openCartographyDialog(data: any) {
    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [this.getAllCartographiesDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsCartographiesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('territoryEntity.layers');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.nonEditable = false;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventCartographies.next(this.adaptFormatCartography(result.data[0]))
        }
      }

    });

  }

  adaptFormatCartography(dataToAdapt: Cartography[]) {
    let newData: any[] = [];

    dataToAdapt.forEach(element => {
      let item = {
        //TODO Put fields when backend return them
        id: null,
        cartography: element,
        cartographyId: element.id,
        cartographyLayers: element.layers,
        cartographyName: element.name,
        new: true,
      }
      newData.push(item);

    });

    return newData;
  }

  // ******** Tasks Dialog  ******** //
  getAllTasksDialog = () => {
    return this.taskService.getAll();
  }

  openTasksDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [this.getAllTasksDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTasksDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('territoryEntity.tasks');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.nonEditable = false;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventTasks.next(this.adaptFormatTask(result.data[0]))
        }
      }
    });
  }

  adaptFormatTask(dataToAdapt: any[]) {
    let newData: any[] = [];

    dataToAdapt.forEach(element => {
      let item: any = { ...element }
      item.id = null;
      item.taskGroupName = element.groupName
      item.taskId = element.id
      item.new = true
      newData.push(item);
    });

    return newData;
  }

  getRowsToAddPermits(territory: Territory, roles: Role[], users: any[], childrenTable: boolean) {
    let itemsToAdd: any[] = [];
    roles.forEach(role => {
      let item;
      users.forEach(user => {
        if(!childrenTable)
        {
          item = {
            user: user.username,
            userId: user.id,
            userComplete: user,
            role: role.name,
            roleId: role.id,
            roleComplete: role,
            roleChildrenComplete: null,
            territoryId: this.territoryID,
            new: true
          }
        }
        else {
          item = {
            user: user.username,
            userId: user.id,
            userComplete: user,
            roleId: null,
            roleChildren: role.name,
            roleMId: role.id,
            roleComplete: null,
            roleChildrenComplete: role,
            territoryId: this.territoryID,
            new: true
          }
        }
        itemsToAdd.push(item);
      })
    })
    return itemsToAdd;
  }

  //Save button
  onSaveButtonClicked() {

    if (this.territoryForm.valid) {
      console.log(this.territoryForm.value)

      if(this.validateExtent(this.territoryForm.value.extensionX0, this.territoryForm.value.extensionX1,this.territoryForm.value.extensionY0,
         this.territoryForm.value.extensionY1)) 
         {
          this.updateExtent();
          let groupType = this.territoryGroups.find(element => element.id == this.territoryForm.value.groupType)
          if (groupType == undefined || groupType.id=== -1) {
            groupType = null;
          }
    
          this.terrritoryObj = new Territory();
          this.terrritoryObj.id = this.territoryID,
          this.terrritoryObj.code = this.territoryForm.value.code,
          this.terrritoryObj.name = this.territoryForm.value.name,
          this.terrritoryObj.territorialAuthorityAddress = this.territoryForm.value.territorialAuthorityAddress,
          this.terrritoryObj.territorialAuthorityLogo = this.territoryForm.value.territorialAuthorityLogo,
          this.terrritoryObj.scope = this.territoryForm.value.scope,
          this.terrritoryObj.groupType = groupType,
          this.terrritoryObj.extent = this.territoryForm.value.extent,
          this.terrritoryObj.note = this.territoryForm.value.note,
          this.terrritoryObj.blocked = this.territoryForm.value.blocked,
          this.terrritoryObj._links = this.territoryForm.value._links
    
          if (this.territoryID == -1) {
            this.terrritoryObj.createdDate = new Date();
          } else {
            this.terrritoryObj.id = this.territoryForm.value.id;
            this.terrritoryObj.createdDate = this.territoryToEdit.createdDate
          }
          this.territoryService.save(this.terrritoryObj)
            .subscribe(resp => {
              console.log(resp);
              this.territoryToEdit = resp;
              this.territoryID = resp.id;
              this.territoryForm.patchValue({
                id: resp.id,
                _links: resp._links
              })
              this.getAllElementsEventPermits.next(true);
              this.getAllElementsEventCartographies.next(true);
              this.getAllElementsEventTasks.next(true);
              this.getAllElementsEventTerritoriesMemberOf.next(true);
              this.getAllElementsEventTerritoriesMembers.next(true);
            },
              error => {
                console.log(error);
              });


         }
         else{
           this.showExtentError();
         }

    }
    else {
      this.utils.showRequiredFieldsError();
    }
  }


  validateExtent(x0, x1, y0, y1) {

    let nullCounter = 0;
    if (x0 == null || x0.length<1 || x0=== "null") {nullCounter++};
    if (x1 == null || x1.length<1 || x1=== "null") {nullCounter++};
    if (y0 == null || y0.length<1 || y0=== "null") {nullCounter++};
    if (y1 == null || y1.length<1 || y1=== "null") {nullCounter++};

    return (nullCounter === 0 || nullCounter === 4) ? true : false;

  }

  showExtentError(){
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = "Error"
    dialogRef.componentInstance.message = this.utils.getTranslate("extentError")
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
  }
}