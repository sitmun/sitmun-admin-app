import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, TerritoryService, RoleService, TaskGroupService, TaskAvailabilityService, ConnectionService, Role, Task, Territory } from 'dist/sitmun-frontend-core/';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tasks-more-info-form',
  templateUrl: './tasks-more-info-form.component.html',
  styleUrls: ['./tasks-more-info-form.component.scss']
})
export class TasksMoreInfoFormComponent implements OnInit {

  taskGroups: Array<any> = [];
  accessTypes: Array<any> = [];
  connections: Array<any> = [];

   //Form
   formTasksMoreInfo: FormGroup;
   taskMoreInfoToEdit;
   taskMoreInfoID = -1;
   dataLoaded: Boolean = false;
   
   //Grids
   themeGrid: any = config.agGridTheme;

   columnDefsTerritories: any[];
   getAllElementsEventTerritories: Subject<boolean> = new Subject <boolean>();
   dataUpdatedEventTerritories: Subject<boolean> = new Subject<boolean>();
 
   columnDefsRoles: any[];
   getAllElementsEventRoles: Subject<boolean> = new Subject <boolean>();
   dataUpdatedEventRoles: Subject<boolean> = new Subject<boolean>();
 
   columnDefsParameters: any[];
   getAllElementsEventParameters: Subject<any[]> = new Subject <any[]>();
 
   //Dialog
   columnDefsRolesDialog: any[];
   addElementsEventRoles: Subject<any[]> = new Subject <any[]>();
   columnDefsTerritoriesDialog: any[];
   addElementsEventTerritories: Subject<any[]> = new Subject <any[]>();
   columnDefsParametersDialog: any[];   
   addElementsEventParameters: Subject<any[]> = new Subject <any[]>();

 

 
 
   constructor(
     public dialog: MatDialog,
     private activatedRoute: ActivatedRoute,
     private router: Router,
     public taskService: TaskService,
     public roleService: RoleService,
     public territoryService: TerritoryService,
     public taskGroupService: TaskGroupService,
     public taskAvailabilityService: TaskAvailabilityService,
     public connectionService: ConnectionService,
     private http: HttpClient,
     public utils: UtilsService
   ) {
     this.initializeTasksMoreInfoForm();
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

    let connectionByDefault = {
      id: -1,
      name: '-------'
    }

    this.connections.push(connectionByDefault);
    promises.push(new Promise((resolve, reject) => {
      this.connectionService.getAll().subscribe(
        resp => {
          this.connections.push(...resp);
          resolve(true);
        }
      );
    }));

    promises.push(new Promise((resolve, reject) => {
      this.utils.getCodeListValues('queryTask.scope').subscribe(
        resp => {
          this.accessTypes.push(...resp);
          resolve(true);
        }
      );
    }));

    Promise.all(promises).then(() => {
     this.activatedRoute.params.subscribe(params => {
       this.taskMoreInfoID = +params.id;
       if (this.taskMoreInfoID !== -1) {
         console.log(this.taskMoreInfoID);
 
         this.taskService.get(this.taskMoreInfoID).subscribe(
           resp => {
             console.log(resp);
             this.taskMoreInfoToEdit = resp;
             this.formTasksMoreInfo.setValue({
               id: this.taskMoreInfoID,
               task: this.taskMoreInfoToEdit.name,
               taskGroup: this.taskMoreInfoToEdit.groupId,
               accessType: this.accessTypes[0].id,
               command: this.taskMoreInfoToEdit.order,
               connection: this.connections[0].id,
               associatedLayer: '',
               _links: this.taskMoreInfoToEdit._links
             });
 
             this.dataLoaded=true;
           },
           error => {
 
           }
         );
       }
       else{
        this.dataLoaded=true;
        this.formTasksMoreInfo.patchValue({
         taskGroup: this.taskGroups[0].id,
         accessType: this.accessTypes[0].id,
         connection: this.connections[0].id,
        })
      }
 
     },
       error => {
 
       });
    });

       this.columnDefsParameters = [

        config.selCheckboxColumnDef,
        { headerName: this.utils.getTranslate('tasksMoreInfoEntity.key'), field: 'key' },
        { headerName: this.utils.getTranslate('tasksMoreInfoEntity.value'), field: 'value', },
        { headerName: this.utils.getTranslate('tasksMoreInfoEntity.order'), field: 'order' },
        { headerName: this.utils.getTranslate('tasksMoreInfoEntity.status'), field: 'status', editable:false },
  
      ];
 
 
       this.columnDefsRoles = [
        config.selCheckboxColumnDef,
         { headerName: 'Id', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksMoreInfoEntity.name'), field: 'name' },  
         { headerName: this.utils.getTranslate('tasksMoreInfoEntity.status'), field: 'status', editable:false },
       ];
   
       this.columnDefsTerritories = [
        config.selCheckboxColumnDef,
         { headerName: 'Id', field: 'territoryId', editable: false },
         { headerName: this.utils.getTranslate('tasksMoreInfoEntity.name'), field: 'territoryName' },
         { headerName: this.utils.getTranslate('tasksMoreInfoEntity.status'), field: 'status', editable:false },
   
       ];

       this.columnDefsParametersDialog = [
        config.selCheckboxColumnDef,
        { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name',  editable: false  },
        { headerName: this.utils.getTranslate('applicationEntity.value'), field: 'value',  editable: false  },
        { headerName: this.utils.getTranslate('applicationEntity.type'), field: 'type',  editable: false  },
      ];
 
       this.columnDefsRolesDialog = [
        config.selCheckboxColumnDef,
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksMoreInfoEntity.name'), field: 'name', editable: false },
         { headerName: this.utils.getTranslate('tasksMoreInfoEntity.description'), field: 'description' },
       ];
 
       this.columnDefsTerritoriesDialog = [
        config.selCheckboxColumnDef,
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksMoreInfoEntity.name'), field: 'name',  editable: false  },
         { headerName: this.utils.getTranslate('tasksMoreInfoEntity.code'), field: 'code',  editable: false  },
       ];
 
 
 
   }
 
 
   initializeTasksMoreInfoForm(): void {
 
     this.formTasksMoreInfo = new FormGroup({
       id: new FormControl(null, []),
       task: new FormControl(null, []),
       taskGroup: new FormControl(null, []),
       accessType: new FormControl(null, []),
       command: new FormControl(null, []),
       connection: new FormControl(null, []),
       associatedLayer: new FormControl(null, []),
       _links: new FormControl(null, []),
     })
   }

     // ******** Parameters configuration ******** //
  getAllParameters = (): Observable<any> => {

    if(this.taskMoreInfoID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    return (this.http.get(`${this.taskMoreInfoToEdit._links.parameters.href}`))
      .pipe(map(data => data[`_embedded`][`task-parameters`]));

  }

  removeParameters(data: any[]) {
    console.log(data);
  }

  newDataParameters(id: any) {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }

  getAllRowsParameters(data: any[] )
  {
    console.log(data);
  }
   
    
   // ******** Roles  ******** //
   getAllRoles = () => {

    if(this.taskMoreInfoID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }
    var urlReq = `${this.taskMoreInfoToEdit._links.roles.href}`
    if (this.taskMoreInfoToEdit._links.roles.templated) {
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
      let url=this.taskMoreInfoToEdit._links.roles.href.split('{', 1)[0];
      this.utils.updateUriList(url,rolesToPut, this.dataUpdatedEventRoles)
    });
  }

 
    // ******** Territories ******** //
  getAllTerritories = (): Observable<any> => {
    if(this.taskMoreInfoID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.taskMoreInfoToEdit._links.availabilities.href}`
    if (this.taskMoreInfoToEdit._links.availabilities.templated) {
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
      territory.task= this.taskMoreInfoToEdit;
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
	
     // ******** Parameters Dialog  ******** //

  getAllParametersDialog = () => {
    const aux: Array<any> = [];
    return of(aux);
    // return this.cartographyService.getAll();
  }

  openParametersDialog(data: any) {
  
    const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'gridDialogs'});
    dialogRef.componentInstance.getAllsTable=[this.getAllParametersDialog];
    dialogRef.componentInstance.singleSelectionTable=[false];
    dialogRef.componentInstance.columnDefsTable=[this.columnDefsParametersDialog];
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title='Parameters';
    dialogRef.componentInstance.titlesTable=['Parameters'];
    dialogRef.componentInstance.nonEditable=false;
    


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Add') {
          this.addElementsEventParameters.next(result.data[0])
        }
      }

    });

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
    dialogRef.componentInstance.title='Roles';
    dialogRef.componentInstance.titlesTable=['Roles'];
    dialogRef.componentInstance.nonEditable=false;
    


    dialogRef.afterClosed().subscribe(result => {
     if(result){
       if(result.event==='Add') {
         this.addElementsEventRoles.next(result.data[0])
       }
     }
    });

  }

    // ******** Territories Dialog  ******** //

    getAllTerritoriesDialog = () => {
      return this.territoryService.getAll();
    }

    openTerritoriesDialog(data: any) {

      const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'gridDialogs'});
      dialogRef.componentInstance.getAllsTable=[this.getAllTerritoriesDialog];
      dialogRef.componentInstance.singleSelectionTable=[false];
      dialogRef.componentInstance.columnDefsTable=[this.columnDefsTerritoriesDialog];
      dialogRef.componentInstance.themeGrid=this.themeGrid;
      dialogRef.componentInstance.title='Territories';
      dialogRef.componentInstance.titlesTable=['Territories'];
      dialogRef.componentInstance.nonEditable=false;
      
  
  
      dialogRef.afterClosed().subscribe(result => {
       if(result){
         if(result.event==='Add') {
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

   onSaveButtonClicked(): void {

     if(this.formTasksMoreInfo.valid)
     {
 
       //TODO Update cartography when save works
       console.log(this.formTasksMoreInfo.value)
       let taskGroup= this.taskGroups.find(x => x.id===this.formTasksMoreInfo.value.taskGroup )
       let access= this.accessTypes.find(x => x.id===this.formTasksMoreInfo.value.accessType )
       let connection= this.taskGroups.find(x => x.id===this.formTasksMoreInfo.value.associatedLayer )
       if (connection == undefined) {connection=null;}

       var taskObj: Task= new Task();
       taskObj.name= this.formTasksMoreInfo.value.name;
       taskObj.id= this.formTasksMoreInfo.value.id;
       taskObj.group= taskGroup;
       taskObj._links= this.formTasksMoreInfo.value._links;
   
       this.taskService.save(this.formTasksMoreInfo.value)
       .subscribe(resp => {
         this.taskMoreInfoToEdit= resp;
         this.taskMoreInfoID=this.taskMoreInfoToEdit.id;
         this.formTasksMoreInfo.patchValue({
           id: resp.id,
           _links: resp._links
         })

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

}
