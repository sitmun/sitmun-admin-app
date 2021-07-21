import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService, UserService, CartographyGroupService, TaskService, UserConfigurationService, TerritoryService, HalOptions, HalParam, User, Territory, Role, ApplicationService, Task, CartographyGroup, Application } from 'dist/sitmun-frontend-core/';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit {

  //Form
  formRole: FormGroup;
  roleToEdit;
  roleSaved: Role;
  roleID: number = -1;
  duplicateID = -1;
  dataLoaded: Boolean = false;

  //Grids
  columnDefsUsers: any[];
  getAllElementsEventUsers: Subject<string> = new Subject<string>();
  dataUpdatedEventUsers: Subject<boolean> = new Subject<boolean>();

  columnDefsTasks: any[];
  getAllElementsEventTasks: Subject<string> = new Subject <string>();
  dataUpdatedEventTasks: Subject<boolean> = new Subject<boolean>();

  columnDefsCartography: any[];
  getAllElementsEventCartographies: Subject<string> = new Subject <string>();
  dataUpdatedEventCartographies: Subject<boolean> = new Subject<boolean>();

  columnDefsApplications: any[];
  getAllElementsEventApplications: Subject<string> = new Subject <string>();
  dataUpdatedEventApplications: Subject<boolean> = new Subject<boolean>();

  themeGrid: any = config.agGridTheme;
  
  //Dialogs
  columnDefsUsersDialog: any[];
  columnDefsTerritoriesDialog: any[];
  addElementsEventUsers: Subject<any[]> = new Subject<any[]>();
  columnDefsTasksDialog: any[];
  addElementsEventTasks: Subject<any[]> = new Subject <any[]>();
  columnDefsCartographiesDialog: any[];
  addElementsEventCartographies: Subject<any[]> = new Subject <any[]>();
  columnDefsApplicationsDialog: any[];
  addElementsEventApplications: Subject<any[]> = new Subject <any[]>();

  //Save button
  territorisToUpdate: Territory[] = [];
  usersToUpdate: User[] = [];
  dataUpdatedEvent: Subject<boolean> = new Subject <boolean>();


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
      if(params.idDuplicate) { this.duplicateID = +params.idDuplicate; }
      
      if (this.roleID !== -1 || this.duplicateID != -1) {
        let idToGet = this.roleID !== -1? this.roleID: this.duplicateID 
        console.log(this.roleID);

        this.roleService.get(idToGet).subscribe(
          resp => {
            console.log(resp);
            this.roleToEdit = resp;
            this.formRole.patchValue({
              description: this.roleToEdit.description,
              _links: this.roleToEdit._links
            });

            if(this.roleID !== -1){
              this.formRole.patchValue({
              id: this.roleID,
              name: this.roleToEdit.name,
              });
                }
            else{
              this.formRole.patchValue({
              name: this.utils.getTranslate('copy_').concat(this.roleToEdit.name),
              });
            }

            this.dataLoaded = true;
          },
          error => {

          }
        );
      }
      else { this.dataLoaded = true; }
    },
      error => {
      });


    this.columnDefsUsers = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('roleEntity.username', 'username'),
      this.utils.getEditableColumnDef('roleEntity.territory', 'territory'),
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

    this.formRole = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl(null, [
        Validators.required,
      ]),
      description: new FormControl(null, [
        Validators.required,
      ]),
      _links: new FormControl(null, []),

    })

  }


  //AG GRID


  // ******** Users ******** //
  getAllUsers = (): Observable<any> => {

    if (this.roleID == -1 && this.duplicateID == -1) 
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    let params2: HalParam[] = [];
    let param: HalParam = { key: 'role.id', value: this.roleID }
    params2.push(param);
    let query: HalOptions = { params: params2 };

    return this.userConfigurationService.getAll(query);

  }

  getAllRowsUsers(event){
    if(event.event == "save"){
      this.saveUsers(event.data);
    }
  }

  saveUsers(data: any[] )
  {
    let usersConfToCreate = [];
    let usersConfDelete = [];
    data.forEach(userConf => {
      let item = {
        role: this.roleToEdit,
        territory: userConf.territoryComplete,
        user:  userConf.userComplete,
      }
      if (userConf.status === 'pendingCreation') {usersConfToCreate.push(item) }
      if(userConf.status === 'pendingDelete' && userConf._links) {usersConfDelete.push(userConf) }
    });

    usersConfToCreate.forEach(newElement => {

      this.userConfigurationService.save(newElement).subscribe(
        result => {
          console.log(result)
        })

      
    });

    usersConfDelete.forEach(deletedElement => {
    
      if(deletedElement._links)
      {
        this.userConfigurationService.remove(deletedElement).subscribe(
          result => {
            console.log(result)
          })
      }
      
    });
  }

  // ******** Task ******** //
  getAllTasks = (): Observable<any> => {

    if (this.roleID == -1 && this.duplicateID == -1) 
    {
      const aux: Array<any> = [];
      return of(aux);
    }
    else {
      var urlReq = `${this.roleToEdit._links.tasks.href}`
      if (this.roleToEdit._links.tasks.templated) {
        var url = new URL(urlReq.split("{")[0]);
        url.searchParams.append("projection", "view")
        urlReq = url.toString();
      }
      return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['tasks']));

    }


  }

  getAllRowsTasks(event){
    if(event.event == "save"){
      this.saveTasks(event.data);
    }
  }

  saveTasks(data: any[] )
  {
    let dataChanged = false;
    const promises: Promise<any>[] = [];
    let tasksToPut = [];
    data.forEach(task => {
      if(task.status!== 'pendingDelete') {
        if (task.status === 'pendingModify') {
          if(task.new){ dataChanged = true; }
          promises.push(new Promise((resolve, reject) => { this.tasksService.update(task).subscribe((resp) => { resolve(true) }) }));
        }
        else if(task.status === 'pendingCreation'){
          dataChanged = true;
        }
        tasksToPut.push(task._links.self.href) 
      }
      else {
        dataChanged = true;
      }
    });
    Promise.all(promises).then(() => {
      if(dataChanged)
      {
        let url=this.roleToEdit._links.tasks.href.split('{', 1)[0];
        this.utils.updateUriList(url,tasksToPut, this.dataUpdatedEventTasks)
      }
      else { this.dataUpdatedEventTasks.next(true) }
      });

  }

  // ******** Cartography Groups ******** //
  getAllCartographiesGroups = (): Observable<any> => {
    if (this.roleID == -1 && this.duplicateID == -1) 
    {
      const aux: Array<any> = [];
      return of(aux);

    }
    else {
      var urlReq = `${this.roleToEdit._links.permissions.href}`
      if (this.roleToEdit._links.permissions.templated) {
        var url = new URL(urlReq.split("{")[0]);
        url.searchParams.append("projection", "view")
        urlReq = url.toString();
      }
      return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['cartography-groups']));
    }
    

  }

  getAllRowsCartographiesGroups(event){
    if(event.event == "save"){
      this.saveCartographiesGroups(event.data);
    }
  }

  saveCartographiesGroups(data: any[] )
  {
    let dataChanged = false;
    const promises: Promise<any>[] = [];
    let cartographiesGroupToPut = [];
    data.forEach(cartographyGroup => {
      if(cartographyGroup.status!== 'pendingDelete') {
        if (cartographyGroup.status === 'pendingModify') {
          if(cartographyGroup.new){ dataChanged = true; }
          promises.push(new Promise((resolve, reject) => { this.cartographyGroupService.update(cartographyGroup).subscribe((resp) => { resolve(true) }) }));

          }
        else if (cartographyGroup.status === 'pendingCreation') { dataChanged = true };
        cartographiesGroupToPut.push(cartographyGroup._links.self.href) 
      }
      else { dataChanged = true }
    });
    Promise.all(promises).then(() => {
      if(dataChanged){
        let url=this.roleToEdit._links.permissions.href.split('{', 1)[0];
        this.utils.updateUriList(url,cartographiesGroupToPut, this.dataUpdatedEventCartographies)
      }
      else { this.dataUpdatedEventCartographies.next(true) }
    });
  }

    // ******** Applications ******** //
    getAllApplications = (): Observable<any> => {
      // //TODO Change the link when available
      if (this.roleID == -1 && this.duplicateID == -1) 
      {
        const aux: Array<any> = [];
        return of(aux);

      }
      else {
        var urlReq = `${this.roleToEdit._links.applications.href}`
        if (this.roleToEdit._links.applications.templated) {
          var url = new URL(urlReq.split("{")[0]);
          url.searchParams.append("projection", "view")
          urlReq = url.toString();
        }
        return (this.http.get(urlReq))
        .pipe(map(data => data['_embedded']['applications']));
      }

    }

    getAllRowsApplications(event){
      if(event.event == "save"){
        this.saveApplications(event.data);
      }
    }
  
  
    saveApplications(data: any[] )
    {
      let dataChanged = false;
      const promises: Promise<any>[] = [];
      let applicationsToPut = [];
      data.forEach(application => {
        if(application.status!== 'pendingDelete') {
          if (application.status === 'pendingModify') {
            if(application.new){ dataChanged = true; }
            promises.push(new Promise((resolve, reject) => { this.applicationService.update(application).subscribe((resp) => { resolve(true) }) }));
          }
          else if( application.status === 'pendingCreation') {dataChanged = true}
          applicationsToPut.push(application._links.self.href) 
        }
        else {dataChanged = true}
      });
      Promise.all(promises).then(() => {
        if(dataChanged){
          let url=this.roleToEdit._links.applications.href.split('{', 1)[0];
          this.utils.updateUriList(url,applicationsToPut, this.dataUpdatedEventApplications)
        }
        else {this.dataUpdatedEventApplications.next(true)}
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

    const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'gridDialogs'});
    dialogRef.componentInstance.getAllsTable=[this.getAllUsersDialog,this.getAllTerritoriesDialog];
    dialogRef.componentInstance.singleSelectionTable=[false,false];
    dialogRef.componentInstance.columnDefsTable=[this.columnDefsUsersDialog,this.columnDefsTerritoriesDialog];
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title=this.utils.getTranslate('roleEntity.users');
    dialogRef.componentInstance.titlesTable=[this.utils.getTranslate('roleEntity.users'),this.utils.getTranslate('roleEntity.territories')];
    dialogRef.componentInstance.nonEditable=false;
    


    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        if(result.event==='Add') {  
          console.log(result.data); 
          let rowsToAdd = this.getRowsToAddPermits(result.data[1],result.data[0])
          console.log(rowsToAdd);
          this.addElementsEventUsers.next(rowsToAdd);
         }
      }

    });

  }
  // ******** Cartography Dialog  ******** //

  getAllCartographiesGroupsDialog = () => {
    let params2:HalParam[]=[];
    let param:HalParam={key:'type', value:'C'}
    params2.push(param);
    let query:HalOptions={ params:params2};
    return this.cartographyGroupService.getAll(query,undefined);
  }

  openCartographyDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'gridDialogs'});
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable=[this.getAllCartographiesGroupsDialog];
    dialogRef.componentInstance.singleSelectionTable=[false];
    dialogRef.componentInstance.columnDefsTable=[this.columnDefsCartographiesDialog];
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title=this.utils.getTranslate('roleEntity.permissiongroupLayersConfiguration');
    dialogRef.componentInstance.titlesTable=[''];
    dialogRef.componentInstance.currentData=[data];
    dialogRef.componentInstance.nonEditable=false;
    


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if( result.event==='Add') { 
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

      const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'gridDialogs'});
      dialogRef.componentInstance.orderTable = ['name'];
      dialogRef.componentInstance.getAllsTable=[this.getAllTasksDialog];
      dialogRef.componentInstance.singleSelectionTable=[false];
      dialogRef.componentInstance.columnDefsTable=[this.columnDefsTasksDialog];
      dialogRef.componentInstance.themeGrid=this.themeGrid;
      dialogRef.componentInstance.title=this.utils.getTranslate('roleEntity.tasks');
      dialogRef.componentInstance.titlesTable=[''];
      dialogRef.componentInstance.currentData=[data];
      dialogRef.componentInstance.nonEditable=false;
      
  
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          if( result.event==='Add') { 
            this.addElementsEventTasks.next(result.data[0])
          }
        }
  
      });
  
    }

    getRowsToAddPermits(territories: Territory[], users: User[] )
    {
      let itemsToAdd: any[] = [];
      territories.forEach(territory => {

          users.forEach(user => {
            let item = {
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

      const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'gridDialogs'});
      dialogRef.componentInstance.orderTable = ['name'];
      dialogRef.componentInstance.getAllsTable=[this.getAllApplicationsDialog];
      dialogRef.componentInstance.singleSelectionTable=[false];
      dialogRef.componentInstance.columnDefsTable=[this.columnDefsApplicationsDialog];
      dialogRef.componentInstance.themeGrid=this.themeGrid;
      dialogRef.componentInstance.title=this.utils.getTranslate('roleEntity.applications');
      dialogRef.componentInstance.titlesTable=[''];
      dialogRef.componentInstance.currentData=[data];
      dialogRef.componentInstance.nonEditable=false;
      
  
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          if( result.event==='Add') { 
            this.addElementsEventApplications.next(result.data[0])
          }
        }
  
      });
  
    }



  onSaveButtonClicked() {

    this.roleService.save( this.formRole.value)
    .subscribe(resp => {

      if (this.roleID == -1 && this.duplicateID != -1) {
        this.formRole.patchValue({
          _links: null
        })
      }

      this.roleToEdit=resp;
      this.roleID=resp.id
      this.formRole.patchValue({
        id: resp.id,
        _links: resp._links
      })
      // this.getAllElementsEventUsers.next(true);
      this.getAllElementsEventApplications.next('save');
      this.getAllElementsEventCartographies.next('save');
      this.getAllElementsEventTasks.next('save');
    },
    error=>{
      console.log(error);
    });


  }


}