import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, TerritoryService, RoleService } from 'dist/sitmun-frontend-core/';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';


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
   columnDefsQueries: any[];
   columnDefsRoles: any[];
   columnDefsTerritories: any[];
 
   //Dialog
   columnDefsMapsDialog: any[];
   columnDefsQueriesDialog: any[];
   columnDefsRolesDialog: any[];
   columnDefsTerritoriesDialog: any[];
 
 
 
 
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
         {
           headerName: '',
           checkboxSelection: true,
           headerCheckboxSelection: true,
           editable: false,
           filter: false,
           width: 25,
           lockPosition: true,
         },
         { headerName: 'Id', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name' },  
         { headerName: this.utils.getTranslate('tasksReportEntity.reportID'), field: 'reportID' },  
       ];

       this.columnDefsQueries = [
         {
           headerName: '',
           checkboxSelection: true,
           headerCheckboxSelection: true,
           editable: false,
           filter: false,
           width: 25,
           lockPosition: true,
         },
         { headerName: 'Id', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name' },  
         { headerName: this.utils.getTranslate('tasksReportEntity.reportID'), field: 'reportID' },  
       ];

       this.columnDefsRoles = [
         {
           headerName: '',
           checkboxSelection: true,
           headerCheckboxSelection: true,
           editable: false,
           filter: false,
           width: 25,
           lockPosition: true,
         },
         { headerName: 'Id', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name' },  
       ];
   
       this.columnDefsTerritories = [
         {
           headerName: '',
           checkboxSelection: true,
           headerCheckboxSelection: true,
           editable: false,
           filter: false,
           width: 25,
           lockPosition: true,
         },
         { headerName: 'Id', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name' },
   
       ];

       this.columnDefsMapsDialog = [
         {
           headerName: '',
           checkboxSelection: true,
           headerCheckboxSelection: true,
           editable: false,
           filter: false,
           width: 50,
           lockPosition:true,
         },
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.reportID'), field: 'reportID' },  

       ];

       this.columnDefsQueriesDialog = [
         {
           headerName: '',
           checkboxSelection: true,
           headerCheckboxSelection: true,
           editable: false,
           filter: false,
           width: 50,
           lockPosition:true,
         },
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.reportID'), field: 'reportID' },  
       ];

       this.columnDefsRolesDialog = [
         {
           headerName: '',
           checkboxSelection: true,
           headerCheckboxSelection: true,
           editable: false,
           filter: false,
           width: 50,
           lockPosition:true,
         },
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksReportEntity.name'), field: 'name', editable: false },
       ];
 
       this.columnDefsTerritoriesDialog = [
         {
           headerName: '',
           checkboxSelection: true,
           headerCheckboxSelection: true,
           editable: false,
           filter: false,
           width: 50,
           lockPosition:true,
         },
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
 
   removeDataMaps(data: any[]) {
     console.log(data);
   }
 
   newDataMaps(id: any) {
     // this.router.navigate(['role', id, 'roleForm']);
   }
 
   applyChangesMaps(data: any[]) {
     console.log(data);
   }
   
   // ******** Queries ******** //
   getAllQueries = () => {
     
     // return (this.http.get(`${this.formTasksReport.value._links.cartographies.href}`))
     // .pipe( map( data =>  data['_embedded']['cartographies']) );
     const aux: Array<any> = [];
     return of(aux);
 
   }
 
   removeDataQueries(data: any[]) {
     console.log(data);
   }
 
   newDataQueries(id: any) {
     // this.router.navigate(['role', id, 'roleForm']);
   }
 
   applyChangesQueries(data: any[]) {
     console.log(data);
   }
   
   // ******** Roles ******** //
   getAllRoles = () => {
     
     // return (this.http.get(`${this.formTasksReport.value._links.cartographies.href}`))
     // .pipe( map( data =>  data['_embedded']['cartographies']) );
     const aux: Array<any> = [];
     return of(aux);
 
   }
 
   removeDataRoles(data: any[]) {
     console.log(data);
   }
 
   newDataRoles(id: any) {
     // this.router.navigate(['role', id, 'roleForm']);
   }
 
   applyChangesRoles(data: any[]) {
     console.log(data);
   }
 
 
   // ******** Territories  ******** //
   getAllTerritories = () => {
     // var urlReq=`${this.formTasksReport.value._links.tasks.href}`
     // if(this.formTasksReport.value._links.tasks.templated){
     //   var url=new URL(urlReq.split("{")[0]);
     //   url.searchParams.append("projection","view")
     //   urlReq=url.toString();
     // }
 
     // return (this.http.get(urlReq))
     // .pipe( map( data =>  data['_embedded']['tasks']) );
     
     const aux: Array<any> = [];
     return of(aux);
     
   }
 
   removeDataTerritories(data: any[]) {
     console.log(data);
   }
   
   newDataTerritories(id: any) {
     // this.router.navigate(['role', id, 'roleForm']);
   }
 
   applyChangesTerritories(data: any[]) {
     console.log(data);
   }

   // ******** Maps Dialog  ******** //
 
   getAllMapsDialog = () => {
    //  return this.roleService.getAll();
    const aux: Array<any> = [];
    return of(aux);
   }
 
   openMapsDialog(data: any) {
 
     const dialogRef = this.dialog.open(DialogGridComponent);
     dialogRef.componentInstance.getAllsTable=[this.getAllMapsDialog];
     dialogRef.componentInstance.singleSelectionTable=[false];
     dialogRef.componentInstance.columnDefsTable=[this.columnDefsMapsDialog];
     dialogRef.componentInstance.themeGrid=this.themeGrid;
     dialogRef.componentInstance.title='Maps';
     dialogRef.componentInstance.titlesTable=['Maps'];
     dialogRef.componentInstance.nonEditable=false;
     
 
 
     dialogRef.afterClosed().subscribe(result => {
      if(result){
        if( result.event==='Add') {console.log(result.data); }
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
 
     const dialogRef = this.dialog.open(DialogGridComponent);
     dialogRef.componentInstance.getAllsTable=[this.getAllQueriesDialog];
     dialogRef.componentInstance.singleSelectionTable=[false];
     dialogRef.componentInstance.columnDefsTable=[this.columnDefsQueriesDialog];
     dialogRef.componentInstance.themeGrid=this.themeGrid;
     dialogRef.componentInstance.title='Queries';
     dialogRef.componentInstance.titlesTable=['Queries'];
     dialogRef.componentInstance.nonEditable=false;
     
 
 
     dialogRef.afterClosed().subscribe(result => {
      if(result){
        if( result.event==='Add') {console.log(result.data); }
      }
 
     });
 
   }

   // ******** Roles Dialog  ******** //
 
   getAllRolesDialog = () => {
     return this.roleService.getAll();
   }
 
   openRolesDialog(data: any) {
 
     const dialogRef = this.dialog.open(DialogGridComponent);
     dialogRef.componentInstance.getAllsTable=[this.getAllRolesDialog];
     dialogRef.componentInstance.singleSelectionTable=[false];
     dialogRef.componentInstance.columnDefsTable=[this.columnDefsRolesDialog];
     dialogRef.componentInstance.themeGrid=this.themeGrid;
     dialogRef.componentInstance.title='Roles';
     dialogRef.componentInstance.titlesTable=['Roles'];
     dialogRef.componentInstance.nonEditable=false;
     
 
 
     dialogRef.afterClosed().subscribe(result => {
      if(result){
        if( result.event==='Add') {console.log(result.data); }
      }
 
     });
 
   }
 
     // ******** Territories Dialog  ******** //
 
     getAllTerritoriesDialog = () => {
       return this.territoryService.getAll();
     }
 
     openTerritoriesDialog(data: any) {
 
       const dialogRef = this.dialog.open(DialogGridComponent);
       dialogRef.componentInstance.getAllsTable=[this.getAllTerritoriesDialog];
       dialogRef.componentInstance.singleSelectionTable=[false];
       dialogRef.componentInstance.columnDefsTable=[this.columnDefsTerritoriesDialog];
       dialogRef.componentInstance.themeGrid=this.themeGrid;
       dialogRef.componentInstance.title='Territories';
       dialogRef.componentInstance.titlesTable=['Territories'];
       dialogRef.componentInstance.nonEditable=false;
       
   
   
       dialogRef.afterClosed().subscribe(result => {
        if(result){
          if( result.event==='Add') {console.log(result.data); }
        }
       });
   
     }
 
 }
 
