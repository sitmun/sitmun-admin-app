import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { tick } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, TaskGroupService, CartographyService, TaskParameterService, TaskAvailabilityService, TaskUIService, RoleService, TerritoryService, Task, Territory, Role } from 'dist/sitmun-frontend-core/';

import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { map } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { DialogFormComponent, DialogGridComponent, DialogMessageComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-tasks-form',
  templateUrl: './tasks-form.component.html',
  styleUrls: ['./tasks-form.component.scss']
})
export class TasksFormComponent implements OnInit {

  taskGroups: Array<any> = [];
  taskUIs: Array<any> = [];
  currentTaskUI;
  initialCartography;
  currentCartography;

  //Form
  taskForm: FormGroup;
  taskToEdit;
  taskID = -1;
  dataLoaded: Boolean = false;
  themeGrid: any = config.agGridTheme;
  columnDefsCartographiesDialog: any[];

  //Grids
  columnDefsParameters: any[];
  addElementsEventParameters: Subject<any[]> = new Subject <any[]>();
  dataUpdatedEventParameters: Subject<boolean> = new Subject<boolean>();

  columnDefsTerritories: any[];
  getAllElementsEventTerritories: Subject<boolean> = new Subject <boolean>();
  dataUpdatedEventTerritories: Subject<boolean> = new Subject<boolean>();

  columnDefsRoles: any[];
  getAllElementsEventRoles: Subject<boolean> = new Subject <boolean>();
  dataUpdatedEventRoles: Subject<boolean> = new Subject<boolean>();


  //Dialogs
  columnDefsParametersDialog: any[];
  public parameterForm: FormGroup;
  getAllElementsEventParameters: Subject<boolean> = new Subject <boolean>();
  @ViewChild('newParameterDialog',{
    static: true
  }) private newParameterDialog: TemplateRef <any>;

  columnDefsTerritoriesDialog: any[];
  addElementsEventTerritories: Subject<any[]> = new Subject <any[]>();

  columnDefsRolesDialog: any[];
  addElementsEventRoles: Subject<any[]> = new Subject <any[]>();

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private taskGroupService: TaskGroupService,
    private taskUIService: TaskUIService,
    private roleService: RoleService,
    private territoryService: TerritoryService,
    private taskAvailabilityService: TaskAvailabilityService,
    private taskParameterService: TaskParameterService,
    private cartographyService: CartographyService,
    private http: HttpClient,
    public utils: UtilsService,
  ) {
    this.initializeTasksForm();
    this.initializeParameterForm();
  }

  ngOnInit(): void {


    const promises: Promise<any>[] = [];

    promises.push(new Promise((resolve, reject) => {
      this.taskGroupService.getAll().subscribe(
        resp => {
          this.taskGroups.push(...resp);
          resolve(true);
        }
      );
    }));

    promises.push(new Promise((resolve, reject) => {
      this.taskUIService.getAll().subscribe(
        resp => {
          this.taskUIs.push(...resp);
          resolve(true);
        }
      );
    }));


    Promise.all(promises).then(() => {

      this.activatedRoute.params.subscribe(params => {
        this.taskID = +params.id;
        if (this.taskID !== -1) {
          console.log(this.taskID);
  
          this.taskService.get(this.taskID).subscribe(
            resp => {
              console.log(resp);
              this.taskToEdit = resp;
  
  
              this.taskForm.setValue({
                id: this.taskID,
                name: this.taskToEdit.name,
                taskGroup: this.taskToEdit.groupId,
                ui: this.taskToEdit.uiId,
                cartography: null,
                _links: this.taskToEdit._links
              });
  
              this.dataLoaded = true;
            },
            error => {
  
            }
          );
        }
        else {
          this.dataLoaded = true;
          this.taskForm.patchValue({
            taskGroup: this.taskGroups[0].id,
            ui: this.taskUIs[0].id
          });
        }
  
      },
      error => {
  
      });


    });


    this.columnDefsCartographiesDialog = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: false,
        editable: false,
        filter: false,
        minWidth: 45,
        maxWidth: 45,
        lockPosition: true
      },
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('tasksEntity.name'), field: 'name', editable: false },
    ];

    this.columnDefsParameters = [
      config.selCheckboxColumnDef,
      { headerName: this.utils.getTranslate('tasksEntity.type'), field: 'type' },
      { headerName: this.utils.getTranslate('tasksEntity.parameter'), field: 'name', },
      { headerName: this.utils.getTranslate('tasksEntity.value'), field: 'value' },
      { headerName: this.utils.getTranslate('tasksEntity.order'), field: 'order', editable:false },
      { headerName: this.utils.getTranslate('tasksEntity.status'), field: 'status', editable: false },

    ];

    this.columnDefsTerritories = [

      config.selCheckboxColumnDef,
      { headerName: 'Id', field: 'territoryId', editable: false },
      { headerName: this.utils.getTranslate('tasksEntity.name'), field: 'territoryName', editable: false },
      { headerName: this.utils.getTranslate('tasksEntity.status'), field: 'status', editable: false },

    ];

    this.columnDefsRoles = [
      config.selCheckboxColumnDef,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('tasksEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('tasksEntity.status'), field: 'status', editable:false },
    ];


    this.columnDefsTerritoriesDialog = [
      config.selCheckboxColumnDef,
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('tasksEntity.code'), field: 'code', editable: false },
      { headerName: this.utils.getTranslate('tasksEntity.name'), field: 'name', editable: false },
    ];

    this.columnDefsRolesDialog = [
      config.selCheckboxColumnDef,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('tasksEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('tasksEntity.description'), field: 'description' },
      { headerName: this.utils.getTranslate('tasksEntity.status'), field: 'status', editable:false },
    ];

  }

  initializeTasksForm(): void {
  this.taskForm = new FormGroup({
    id: new FormControl(null),
    name: new FormControl(null, Validators.required),
    taskGroup: new FormControl(null),
    ui: new FormControl(null),
    cartography: new FormControl(null),
    _links: new FormControl(null),

  })}
  

  initializeParameterForm(): void {

  this.parameterForm = new FormGroup({
    type: new FormControl(null, []),
    name: new FormControl(null, [Validators.required]),
    value: new FormControl(null, [Validators.required]),
    order: new FormControl(null, []),

  })}

  // Cartography Field Dialog

    // ******** Cartography Dialog  ******** //

    getAllCartographiesDialog = () => {
      return this.cartographyService.getAll();
    }
  
  
    openCartographyDialog() {
      const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
      dialogRef.componentInstance.getAllsTable = [this.getAllCartographiesDialog];
      dialogRef.componentInstance.singleSelectionTable = [true];
      dialogRef.componentInstance.columnDefsTable = [this.columnDefsCartographiesDialog];
      dialogRef.componentInstance.themeGrid = this.themeGrid;
      dialogRef.componentInstance.title = this.utils.getTranslate("tasksEntity.cartography");
      dialogRef.componentInstance.titlesTable = [""];
      dialogRef.componentInstance.nonEditable = false;
  
  
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.event === 'Add') {
            console.log(result.data)
            this.currentCartography= result.data[0][0];
            this.taskForm.patchValue({
              cartography:this.currentCartography.name
            })
            console.log(this.currentCartography);
            console.log(this.taskForm.value.cartography);
          }
        }
  
      });
  
  
    }


  onDeleteButtonClicked(){

    this.taskForm.patchValue({
      cartography: null
    })
    this.currentCartography=null;

  }

  // AG-GRID


  // ******** Parameters configuration ******** //

  getAllParameters = (): Observable<any> => {

    if(this.taskID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.taskToEdit._links.parameters.href}`
    if (this.taskToEdit._links.parameters.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data =>  data[`_embedded`][`task-parameters`]));
  } 


  getAllRowsParameters(data: any[] )
  {
    let parameterToSave = [];
    let parameterToDelete = [];
    data.forEach(parameter => {
      if (parameter.status === 'Pending creation' || parameter.status === 'Modified') {
        if(! parameter._links) {
          parameter.task=this.taskToEdit} //If is new, you need the application link
          parameterToSave.push(parameter)
      }
      if(parameter.status === 'Deleted' && parameter._links) {parameterToDelete.push(parameter) }
    });
    const promises: Promise<any>[] = [];
    parameterToSave.forEach(saveElement => {
      promises.push(new Promise((resolve, reject) => { this.taskParameterService.save(saveElement).subscribe((resp) => { resolve(true) }) }));
    });

    parameterToDelete.forEach(deletedElement => {
      promises.push(new Promise((resolve, reject) => { this.taskParameterService.remove(deletedElement).subscribe((resp) => { resolve(true) }) }));
      
    });

    Promise.all(promises).then(() => {
      this.dataUpdatedEventParameters.next(true);
    });
  }

  duplicateParameters(data)
  {
    let parametersToDuplicate= []
    data.forEach(parameter => {
      let newParameter={...parameter}
      newParameter.name= 'copia_'.concat(newParameter.name),
      
      
      parametersToDuplicate.push(newParameter);
    });
    this.addElementsEventParameters.next(parametersToDuplicate);
  }

  // ******** Territories ******** //
  getAllTerritories = (): Observable<any> => {
    if(this.taskID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.taskToEdit._links.availabilities.href}`
    if (this.taskToEdit._links.availabilities.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['task-availabilities']));


  }

  getAllRowsTerritories(data: any[] )
  {
    let territoriesToCreate = [];
    let territoriesToDelete = [];
    data.forEach(territory => {
      territory.task= this.taskToEdit;
      if (territory.status === 'Pending creation') {
        let index= data.findIndex(element => element.territoryId === territory.territoryId && !element.new)
        if(index === -1)
        {
          territoriesToCreate.push(territory)
          territory.new=false;
        }
       }
      if(territory.status === 'Deleted' && territory._links) {territoriesToDelete.push(territory) }
    });
    const promises: Promise<any>[] = [];
    territoriesToCreate.forEach(newElement => {
      promises.push(new Promise((resolve, reject) => { this.taskAvailabilityService.save(newElement).subscribe((resp) => { resolve(true) }) }));
    });

    territoriesToDelete.forEach(deletedElement => {
      promises.push(new Promise((resolve, reject) => {this.taskAvailabilityService.remove(deletedElement).subscribe((resp) => { resolve(true) }) }));
      
    });

    Promise.all(promises).then(() => {
      this.dataUpdatedEventTerritories.next(true);
    });
	

  }

  
  // ******** Roles  ******** //
  getAllRoles = () => {

    if(this.taskID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.taskToEdit._links.roles.href}`
    if (this.taskToEdit._links.roles.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }
   
    return (this.http.get(urlReq))
       .pipe(map(data => data['_embedded']['roles']));

  }

  getAllRowsRoles(data: any[] )
  {
    let rolesModified = [];
    let rolesToPut = [];
    data.forEach(role => {
      if (role.status === 'Modified') {rolesModified.push(role) }
      if(role.status!== 'Deleted') {rolesToPut.push(role._links.self.href) }
    });
    console.log(rolesModified);
    this.updateRoles(rolesModified, rolesToPut);
  }

  updateRoles(rolesModified: Role[], rolesToPut: Role[])
  {
    const promises: Promise<any>[] = [];
    rolesModified.forEach(role => {
      promises.push(new Promise((resolve, reject) => { this.roleService.update(role).subscribe((resp) => { resolve(true) }) }));
    });
    Promise.all(promises).then(() => {
      let url=this.taskToEdit._links.roles.href.split('{', 1)[0];
      this.utils.updateUriList(url,rolesToPut, this.dataUpdatedEventRoles)
    });
  }



  // ******** Parameters Dialog  ******** //


  openParametersDialog(data: any) {


    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived=this.newParameterDialog;
    dialogRef.componentInstance.title=this.utils.getTranslate('tasksEntity.parameters');
    dialogRef.componentInstance.form=this.parameterForm;

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Add') {
          let item= this.parameterForm.value;
          this.addElementsEventParameters.next([item])
          console.log(this.parameterForm.value)

          
        }
      }
      this.parameterForm.reset();

    });

  }


   // ******** Territory Dialog  ******** //

   getAllTerritoriesDialog = () => {
    return this.territoryService.getAll();
  }

  openTerritoriesDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [this.getAllTerritoriesDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTerritoriesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('layersEntity.territory');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if( result.event==='Add') { 
          this.addElementsEventTerritories.next(this.adaptFormatTerritories(result.data[0]))
        }
      }

    });

  }

  
  adaptFormatTerritories(dataToAdapt: Territory[])
  {
    let newData: any[] = [];
    
    dataToAdapt.forEach(element => {
      let item = {
        id: null,
        territoryCode: element.code,
        territoryName: element.name,
        territoryId: element.id,
        createdDate: element.createdDate,
        owner: null,
        territory: element,
        new: true
      }
      newData.push(item);
      
    });

    return newData;
  }

   // ******** Roles Dialog  ******** //

   getAllRolesDialog = () => {
    return this.roleService.getAll();
  }

  openRolesDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'gridDialogs'});
    dialogRef.componentInstance.getAllsTable=[this.getAllRolesDialog];
    dialogRef.componentInstance.singleSelectionTable=[false];
    dialogRef.componentInstance.columnDefsTable=[this.columnDefsRolesDialog];
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title=this.utils.getTranslate('layersPermitsEntity.roles');
    dialogRef.componentInstance.titlesTable=[''];
    dialogRef.componentInstance.nonEditable=false;
    


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if( result.event==='Add') { 
          this.addElementsEventRoles.next(result.data[0])
        }
      }

    });
  }


  

  onSaveButtonClicked(): void {

    if(this.taskForm.valid)
    {

      //TODO Update cartography when save works
      console.log(this.taskForm.value)
      let taskGroup= this.taskGroups.find(x => x.id===this.taskForm.value.taskGroup )
      let ui= this.taskUIs.find(x => x.id===this.taskForm.value.ui )
      // this.updateCartography(this.currentCartography)
      var taskObj: Task= new Task();
      taskObj.name= this.taskForm.value.name;
      taskObj.id= this.taskForm.value.id;
      taskObj.group= taskGroup;
      taskObj.ui= ui;
      taskObj._links= this.taskForm.value._links;
  
      this.taskService.save(this.taskForm.value)
      .subscribe(resp => {
        this.taskToEdit= resp;
        this.taskID=this.taskToEdit.id;
        this.taskForm.patchValue({
          id: resp.id,
          _links: resp._links
        })
        this.getAllElementsEventParameters.next(true);
        this.getAllElementsEventTerritories.next(true);
        this.getAllElementsEventRoles.next(true);
    
      },
      error => {
        console.log(error);
      })
    }

    else {
      this.utils.showRequiredFieldsError();
    }

  }


  updateCartography(cartography)
  {
    let url=this.taskToEdit._links.cartography.href.split('{', 1)[0];
    this.utils.updateUriList(url,[cartography._links.self.href]);
    this.initialCartography= this.currentCartography
  }

}
