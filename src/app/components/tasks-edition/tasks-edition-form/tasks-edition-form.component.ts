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
  selector: 'app-tasks-edition-form',
  templateUrl: './tasks-edition-form.component.html',
  styleUrls: ['./tasks-edition-form.component.scss']
})
export class TasksEditionFormComponent implements OnInit {


   //Form
   formTasksEdition: FormGroup;
   filterForm: FormGroup;
   taskEditionToEdit;
   taskEditionID = -1;
   dataLoaded: Boolean = false;
   
   //Grids
   themeGrid: any = environment.agGridTheme;
   columnDefsColumns: any[];
   columnDefsRoles: any[];
   columnDefsTerritories: any[];
 
   //Dialog
   columnDefsColumnsDialog: any[];
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
     this.initializeTasksEditionForm();
     this.initializeFilterForm();
   }
 
   ngOnInit(): void {
     this.activatedRoute.params.subscribe(params => {
       this.taskEditionID = +params.id;
       if (this.taskEditionID !== -1) {
         console.log(this.taskEditionID);
 
         this.taskService.get(this.taskEditionID).subscribe(
           resp => {
             console.log(resp);
             this.taskEditionToEdit = resp;
             this.formTasksEdition.setValue({
               id: this.taskEditionID,
               name: this.taskEditionToEdit.name,
               editionType: this.taskEditionToEdit.editionType,
               taskGroup: this.taskEditionToEdit.taskGrop,
               service: this.taskEditionToEdit.service,
               layerName: this.taskEditionToEdit.layerName,
               emptyGeometryParameter: this.taskEditionToEdit.emptyGeometryParameter,
               _links: this.taskEditionToEdit._links
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

       this.columnDefsColumns = [
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
         { headerName: this.utils.getTranslate('tasksEditionEntity.selectable'), field: 'selectable' },  
         { headerName: this.utils.getTranslate('tasksEditionEntity.editable'), field: 'editable' },  
         { headerName: this.utils.getTranslate('tasksEditionEntity.tag'), field: 'tag' },  
         { headerName: this.utils.getTranslate('tasksEditionEntity.type'), field: 'type' },  
         { headerName: this.utils.getTranslate('tasksEditionEntity.maxSize'), field: 'maxSize' },  
         { headerName: this.utils.getTranslate('tasksEditionEntity.defectValue'), field: 'defectValue' },  
         { headerName: this.utils.getTranslate('tasksEditionEntity.obligatory'), field: 'obligatory' },  
         { headerName: this.utils.getTranslate('tasksEditionEntity.help'), field: 'help' },  
         { headerName: this.utils.getTranslate('tasksEditionEntity.selectPath'), field: 'selectPath' },  
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
         { headerName: this.utils.getTranslate('tasksEditionEntity.name'), field: 'name' },  
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
         { headerName: this.utils.getTranslate('tasksEditionEntity.name'), field: 'name' },
   
       ];

       this.columnDefsColumnsDialog = [
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
         { headerName: this.utils.getTranslate('tasksEditionEntity.name'), field: 'name', editable: false },
         { headerName: this.utils.getTranslate('tasksEditionEntity.reportID'), field: 'reportID' },  

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
         { headerName: this.utils.getTranslate('tasksEditionEntity.name'), field: 'name', editable: false },
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
         { headerName: this.utils.getTranslate('tasksEditionEntity.name'), field: 'name',  editable: false  },
       ];
 
 
 
   }
 
 
   initializeTasksEditionForm(): void {
 
     this.formTasksEdition = new FormGroup({
       id: new FormControl(null, []),
       name: new FormControl(null, []),
       editionType: new FormControl(null, []),
       taskGroup: new FormControl(null, []),
       service: new FormControl(null, []),
       layerName: new FormControl(null, []),
       emptyGeometryParameter: new FormControl(null, []),
     })
   }
 
   initializeFilterForm(): void {
 
     this.filterForm = new FormGroup({
       associatedCartography: new FormControl(null, []),
       searchView: new FormControl(null, []),
       municipalityFilter: new FormControl(null, []),
       fieldName: new FormControl(null, []),
     })
   }
 
   addNewTasksEdition() {
     console.log(this.formTasksEdition.value);
     this.taskService.create(this.formTasksEdition.value)
       .subscribe(resp => {
         console.log(resp);
         // this.router.navigate(["/company", resp.id, "formConnection"]);
       });
   }
 
   updateConnection() {
     console.log(this.formTasksEdition.value);
 
     this.taskService.update(this.formTasksEdition.value)
       .subscribe(resp => {
         console.log(resp);
       });
   }
   
   // ******** Columns ******** //
   getAllColumns = () => {
     
     // return (this.http.get(`${this.formTasksEdition.value._links.cartographies.href}`))
     // .pipe( map( data =>  data['_embedded']['cartographies']) );
     const aux: Array<any> = [];
     return of(aux);
 
   }
 
   removeDataColumns(data: any[]) {
     console.log(data);
   }
 
   newDataColumns(id: any) {
     // this.router.navigate(['role', id, 'roleForm']);
   }
 
   applyChangesColumns(data: any[]) {
     console.log(data);
   }
   
   
   // ******** Roles ******** //
   getAllRoles = () => {
     
     // return (this.http.get(`${this.formTasksEdition.value._links.cartographies.href}`))
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
     // var urlReq=`${this.formTasksEdition.value._links.tasks.href}`
     // if(this.formTasksEdition.value._links.tasks.templated){
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

   // ******** Columns Dialog  ******** //
 
   getAllColumnsDialog = () => {
    //  return this.roleService.getAll();
    const aux: Array<any> = [];
    return of(aux);
   }
 
   openColumnsDialog(data: any) {
 
     const dialogRef = this.dialog.open(DialogGridComponent);
     dialogRef.componentInstance.getAllsTable=[this.getAllColumnsDialog];
     dialogRef.componentInstance.singleSelectionTable=[false];
     dialogRef.componentInstance.columnDefsTable=[this.columnDefsColumnsDialog];
     dialogRef.componentInstance.themeGrid=this.themeGrid;
     dialogRef.componentInstance.title='Columns';
     dialogRef.componentInstance.titlesTable=['Columns'];
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
 
