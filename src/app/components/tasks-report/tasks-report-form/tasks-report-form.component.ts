import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, TerritoryService, RoleService } from '@sitmun/frontend-core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-tasks-report-form',
  templateUrl: './tasks-report-form.component.html',
  styleUrls: ['./tasks-report-form.component.scss']
})
export class TasksReportFormComponent implements OnInit {

   //Form
   formTasksReport: FormGroup;
   taskReportToEdit;
   taskReportID = -1;
   dataLoaded: Boolean = false;
   
   //Grids
   themeGrid: any = environment.agGridTheme;
   columnDefsMaps: any[];
   getAllElementsEventMaps: Subject<any[]> = new Subject <any[]>();
   columnDefsQueries: any[];
   getAllElementsEventQueries: Subject<any[]> = new Subject <any[]>();
   columnDefsRoles: any[];
   getAllElementsEventRoles: Subject<any[]> = new Subject <any[]>();
   columnDefsTerritories: any[];
   getAllElementsEventTerritories: Subject<any[]> = new Subject <any[]>();
 
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
     private http: HttpClient,
     private utils: UtilsService
   ) {
     this.initializeTasksReportForm();
   }
 
   ngOnInit(): void {
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
               taskGroup: this.taskReportToEdit.description,
               locator: this.taskReportToEdit.description,
               template: this.taskReportToEdit.description,
               _links: this.taskReportToEdit._links
             });
 
             this.dataLoaded=true;
           },
           error => {
 
           }
         );
       }
 
     },
       error => {
 
       });

       this.columnDefsMaps = [
        environment.selCheckboxColumnDef,
         { headerName: 'Id', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name' },  
         { headerName: this.utils.getTranslate('tasksReportEntity.reportID'), field: 'reportID' },
         { headerName: this.utils.getTranslate('tasksReportEntity.status'), field: 'status' },
           
       ];

       this.columnDefsQueries = [
        environment.selCheckboxColumnDef,
         { headerName: 'Id', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name' },  
         { headerName: this.utils.getTranslate('tasksReportEntity.reportID'), field: 'reportID' },  
         { headerName: this.utils.getTranslate('tasksReportEntity.status'), field: 'status' },
       ];

       this.columnDefsRoles = [
        environment.selCheckboxColumnDef,
         { headerName: 'Id', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name' },  
         { headerName: this.utils.getTranslate('tasksReportEntity.status'), field: 'status' },
       ];
   
       this.columnDefsTerritories = [
        environment.selCheckboxColumnDef,
         { headerName: 'Id', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name' },
         { headerName: this.utils.getTranslate('tasksReportEntity.status'), field: 'status' },
   
       ];

       this.columnDefsMapsDialog = [
        environment.selCheckboxColumnDef,
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.reportID'), field: 'reportID' },  

       ];

       this.columnDefsQueriesDialog = [
        environment.selCheckboxColumnDef,
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.reportID'), field: 'reportID' },  
       ];

       this.columnDefsRolesDialog = [
        environment.selCheckboxColumnDef,
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name', editable: false },
       ];
 
       this.columnDefsTerritoriesDialog = [
        environment.selCheckboxColumnDef,
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
 
   addNewTasksReport() {
     console.log(this.formTasksReport.value);
     this.taskService.create(this.formTasksReport.value)
       .subscribe(resp => {
         console.log(resp);
         // this.router.navigate(["/company", resp.id, "formConnection"]);
       });
   }
 
   updateConnection() {
     console.log(this.formTasksReport.value);
 
     this.taskService.update(this.formTasksReport.value)
       .subscribe(resp => {
         console.log(resp);
       });
   }
   
   // ******** Maps ******** //
   getAllMaps = () => {
     
     // return (this.http.get(`${this.formTasksReport.value._links.cartographies.href}`))
     // .pipe( map( data =>  data['_embedded']['cartographies']) );
     const aux: Array<any> = [];
     return of(aux);
 
   }


   getAllRowsMaps(data: any[] )
   {
     console.log(data);
   }
   
   // ******** Queries ******** //
   getAllQueries = () => {
     
     // return (this.http.get(`${this.formTasksReport.value._links.cartographies.href}`))
     // .pipe( map( data =>  data['_embedded']['cartographies']) );
     const aux: Array<any> = [];
     return of(aux);
 
   }
 

  
   getAllRowsQueries(data: any[] )
   {
     console.log(data);
   } 
   // ******** Roles ******** //
   getAllRoles = () => {
    var urlReq=`${this.taskReportToEdit._links.roles.href}`
    if(this.taskReportToEdit._links.roles.templated){
      var url=new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection","view")
      urlReq=url.toString();
    }
    return (this.http.get(urlReq))
    .pipe( map( data =>  data['_embedded']['roles']) );
     const aux: Array<any> = [];
     return of(aux);
 
   }
 
 
   getAllRowsRoles(data: any[] )
   {
     console.log(data);
   }
 
   // ******** Territories  ******** //
   getAllTerritories = () => {
    var urlReq=`${this.taskReportToEdit._links.availabilities.href}`
    if(this.taskReportToEdit._links.availabilities.templated){
      var url=new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection","view")
      urlReq=url.toString();
    }
    return (this.http.get(urlReq))
    .pipe( map( data =>  data['_embedded']['task-availabilities']) );
    
    
     
   }


   getAllRowsTerritories(data: any[] )
   {
     console.log(data);
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
            this.addElementsEventTerritories.next(result.data[0])
          }
        }
       });
   
     }
 
 }
 
