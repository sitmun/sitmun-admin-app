import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, TerritoryService,  RoleService, TaskGroupService,  TaskAvailabilityService, Role, Territory, Task, HalParam, HalOptions } from 'dist/sitmun-frontend-core/';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-tasks-report-form',
  templateUrl: './tasks-report-form.component.html',
  styleUrls: ['./tasks-report-form.component.scss']
})
export class TasksReportFormComponent implements OnInit {

  taskGroups: Array<any> = [];
  locators: Array<any> = [];

   //Form
   formTasksReport: FormGroup;
   taskReportToEdit;
   taskReportID = -1;
   dataLoaded: Boolean = false;
   
   //Grids
   themeGrid: any = config.agGridTheme;
   columnDefsMaps: any[];
   getAllElementsEventMaps: Subject<any[]> = new Subject <any[]>();
   columnDefsQueries: any[];
   getAllElementsEventQueries: Subject<any[]> = new Subject <any[]>();

   columnDefsTerritories: any[];
   getAllElementsEventTerritories: Subject<boolean> = new Subject <boolean>();
   dataUpdatedEventTerritories: Subject<boolean> = new Subject<boolean>();
 
   columnDefsRoles: any[];
   getAllElementsEventRoles: Subject<boolean> = new Subject <boolean>();
   dataUpdatedEventRoles: Subject<boolean> = new Subject<boolean>();
 
 
   //Dialog
   columnDefsMapsDialog: any[];
   addElementsEventMaps: Subject<any[]> = new Subject <any[]>();
   columnDefsQueriesDialog: any[];
   addElementsEventQueries: Subject<any[]> = new Subject <any[]>();
   columnDefsRolesDialog: any[];
   addElementsEventRoles: Subject<any[]> = new Subject <any[]>();
   columnDefsTerritoriesDialog: any[];
   addElementsEventTerritories: Subject<any[]> = new Subject <any[]>();
 
 
 
 
   constructor(
     public dialog: MatDialog,
     private activatedRoute: ActivatedRoute,
     private router: Router,
     public taskService: TaskService,
     public roleService: RoleService,
     public territoryService: TerritoryService,
     public taskGroupService: TaskGroupService,
     public taskAvailabilityService: TaskAvailabilityService,
     private http: HttpClient,
     public utils: UtilsService
   ) {
     this.initializeTasksReportForm();
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
          let taskTypeID=config.tasksTypes['report'];
          let params2:HalParam[]=[];
          let param:HalParam={key:'type.id', value:taskTypeID}
          params2.push(param);
          let query:HalOptions={ params:params2};
          this.taskService.getAll(query,undefined,"tasks").subscribe(
            resp => {
              this.locators.push(...resp);
              resolve(true);
            }
          );;
        }));

    Promise.all(promises).then(() => {
     this.activatedRoute.params.subscribe(params => {
       this.taskReportID = +params.id;
       if (this.taskReportID !== -1) {
         console.log(this.taskReportID);
 
         this.taskService.get(this.taskReportID).subscribe(
           resp => {
             console.log(resp);
             this.taskReportToEdit = resp;
             this.formTasksReport.setValue({
               id: this.taskReportID,
               task: this.taskReportToEdit.name,
               taskGroup: this.taskReportToEdit.groupId,
               locator: '',
               template: this.taskReportToEdit.description,
               _links: this.taskReportToEdit._links
             });
 
             this.dataLoaded=true;
           },
           error => {
 
           }
         );
       }
       else{
        this.dataLoaded=true;
        this.formTasksReport.patchValue({
          taskGroup: this.taskGroups[0].id,
          // locator: this.locators[0].id,
         })
       }
 
     },
       error => {
 
       });
    });

       this.columnDefsMaps = [
        this.utils.getSelCheckboxColumnDef(),
         this.utils.getIdColumnDef(),
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name' },  
         { headerName: this.utils.getTranslate('tasksReportEntity.reportID'), field: 'reportID' },
         { headerName: this.utils.getTranslate('tasksReportEntity.status'), field: 'status', editable:false },
           
       ];

       this.columnDefsQueries = [
        this.utils.getSelCheckboxColumnDef(),
         this.utils.getIdColumnDef(),
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name' },  
         { headerName: this.utils.getTranslate('tasksReportEntity.reportID'), field: 'reportID' },  
         { headerName: this.utils.getTranslate('tasksReportEntity.status'), field: 'status', editable:false },
       ];

       this.columnDefsRoles = [
        this.utils.getSelCheckboxColumnDef(),
         { headerName: 'Id', field: 'territoryId', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'territoryName' },  
         { headerName: this.utils.getTranslate('tasksReportEntity.status'), field: 'status', editable:false },
       ];
   
       this.columnDefsTerritories = [
        this.utils.getSelCheckboxColumnDef(),
         this.utils.getIdColumnDef(),
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name' },
         { headerName: this.utils.getTranslate('tasksReportEntity.status'), field: 'status', editable:false },
   
       ];

       this.columnDefsMapsDialog = [
        this.utils.getSelCheckboxColumnDef(),
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.reportID'), field: 'reportID' },  

       ];

       this.columnDefsQueriesDialog = [
        this.utils.getSelCheckboxColumnDef(),
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.reportID'), field: 'reportID' },  
       ];

       this.columnDefsRolesDialog = [
        this.utils.getSelCheckboxColumnDef(),
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name', editable: false },
       ];
 
       this.columnDefsTerritoriesDialog = [
        this.utils.getSelCheckboxColumnDef(),
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name',  editable: false  },
       ];
 
 
 
   }
 
 
   initializeTasksReportForm(): void {
 
     this.formTasksReport = new FormGroup({
       id: new FormControl(null, []),
       task: new FormControl(null, []),
       taskGroup: new FormControl(null, []),
       locator: new FormControl(null, []),
       template: new FormControl(null, []),
       _links: new FormControl(null, []),
     })
   }
 

   
   // ******** Maps ******** //
   getAllMaps = () => {


    if(this.taskReportID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }
     
     // return (this.http.get(`${this.formTasksReport.value._links.cartographies.href}`))
     // .pipe( map( data =>  data['_embedded']['cartographies']) );

 
   }


   getAllRowsMaps(data: any[] )
   {
     console.log(data);
   }
   
   // ******** Queries ******** //
   getAllQueries = () => {

    if(this.taskReportID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }
     
     // return (this.http.get(`${this.formTasksReport.value._links.cartographies.href}`))
     // .pipe( map( data =>  data['_embedded']['cartographies']) );

 
   }
 

  
   getAllRowsQueries(data: any[] )
   {
     console.log(data);
   } 
    // ******** Roles  ******** //
  getAllRoles = () => {

    if(this.taskReportID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.taskReportToEdit._links.roles.href}`
    if (this.taskReportToEdit._links.roles.templated) {
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
      if (role.status === 'pendingModify') {rolesModified.push(role) }
      if(role.status!== 'pendingDelete') {rolesToPut.push(role._links.self.href) }
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
      let url=this.taskReportToEdit._links.roles.href.split('{', 1)[0];
      this.utils.updateUriList(url,rolesToPut, this.dataUpdatedEventRoles)
    });
  }

 
    // ******** Territories ******** //
  getAllTerritories = (): Observable<any> => {
    if(this.taskReportID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.taskReportToEdit._links.availabilities.href}`
    if (this.taskReportToEdit._links.availabilities.templated) {
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
      territory.task= this.taskReportToEdit;
      if (territory.status === 'pendingCreation') {
        let index= data.findIndex(element => element.territoryId === territory.territoryId && !element.new)
        if(index === -1)
        {
          territoriesToCreate.push(territory)
          territory.new=false;
        }
       }
      if(territory.status === 'pendingDelete' && territory._links) {territoriesToDelete.push(territory) }
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
   // ******** Maps Dialog  ******** //
 
   getAllMapsDialog = () => {
    //  return this.roleService.getAll();
    const aux: Array<any> = [];
    return of(aux);
   }
 
   openMapsDialog(data: any) {
 
     const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'gridDialogs'});
     dialogRef.componentInstance.getAllsTable=[this.getAllMapsDialog];
     dialogRef.componentInstance.singleSelectionTable=[false];
     dialogRef.componentInstance.columnDefsTable=[this.columnDefsMapsDialog];
     dialogRef.componentInstance.themeGrid=this.themeGrid;
     dialogRef.componentInstance.title='Maps';
     dialogRef.componentInstance.titlesTable=['Maps'];
     dialogRef.componentInstance.nonEditable=false;
     
 
 
     dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Add') {
          this.addElementsEventMaps.next(result.data[0])
        }
      }
     });
 
   }

   // ******** Queries Dialog  ******** //
 
   getAllQueriesDialog = () => {
    //  return this.roleService.getAll();
    const aux: Array<any> = [];
    return of(aux);
   }
 
   openQueriesDialog(data: any) {
 
     const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'gridDialogs'});
     dialogRef.componentInstance.getAllsTable=[this.getAllQueriesDialog];
     dialogRef.componentInstance.singleSelectionTable=[false];
     dialogRef.componentInstance.columnDefsTable=[this.columnDefsQueriesDialog];
     dialogRef.componentInstance.themeGrid=this.themeGrid;
     dialogRef.componentInstance.title='Queries';
     dialogRef.componentInstance.titlesTable=['Queries'];
     dialogRef.componentInstance.nonEditable=false;
     
 
 
     dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Add') {
          this.addElementsEventQueries.next(result.data[0])
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

     if(this.formTasksReport.valid)
     {
 
       //TODO Update cartography when save works
       console.log(this.formTasksReport.value)
       let taskGroup= this.taskGroups.find(x => x.id===this.formTasksReport.value.taskGroup )
       let locator= this.locators.find(x => x.id===this.formTasksReport.value.locators )


       var taskObj: Task= new Task();
       taskObj.name= this.formTasksReport.value.name;
       taskObj.id= this.formTasksReport.value.id;
       taskObj.group= taskGroup;
       taskObj._links= this.formTasksReport.value._links;
   
       this.taskService.save(this.formTasksReport.value)
       .subscribe(resp => {
         this.taskReportToEdit= resp;
         this.taskReportID=this.taskReportToEdit.id;
         this.formTasksReport.patchValue({
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
