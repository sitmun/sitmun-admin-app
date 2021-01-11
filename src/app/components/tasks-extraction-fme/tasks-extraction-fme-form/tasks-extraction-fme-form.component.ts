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
  selector: 'app-tasks-extraction-fme-form',
  templateUrl: './tasks-extraction-fme-form.component.html',
  styleUrls: ['./tasks-extraction-fme-form.component.scss']
})
export class TasksExtractionFmeFormComponent implements OnInit {


   //Form
   formTasksExtractionFME: FormGroup;
   taskExtractionFMEToEdit;
   taskExtractionFMEID = -1;
   dataLoaded: Boolean = false;
   
   //Grids
   themeGrid: any = environment.agGridTheme;
   columnDefsRoles: any[];
   columnDefsTerritories: any[];
 
   //Dialog
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
     this.initializeTasksExtractionFMEForm();
   }
 
   ngOnInit(): void {
     this.activatedRoute.params.subscribe(params => {
       this.taskExtractionFMEID = +params.id;
       if (this.taskExtractionFMEID !== -1) {
         console.log(this.taskExtractionFMEID);
 
         this.taskService.get(this.taskExtractionFMEID).subscribe(
           resp => {
             console.log(resp);
             this.taskExtractionFMEToEdit = resp;
             this.formTasksExtractionFME.setValue({
               id: this.taskExtractionFMEID,
               cartography: this.taskExtractionFMEToEdit.name,
               taskGroup: this.taskExtractionFMEToEdit.description,
               service: this.taskExtractionFMEToEdit.description,
               layer: this.taskExtractionFMEToEdit.description,
               _links: this.taskExtractionFMEToEdit._links
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
         { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.name'), field: 'name' },  
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
         { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.name'), field: 'name' },
   
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
         { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.name'), field: 'name', editable: false },
         { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.description'), field: 'description' },
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
         { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.name'), field: 'name',  editable: false  },
         { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.code'), field: 'code',  editable: false  },
       ];
 
 
 
   }
 
 
   initializeTasksExtractionFMEForm(): void {
 
     this.formTasksExtractionFME = new FormGroup({
       id: new FormControl(null, []),
       cartography: new FormControl(null, []),
       taskGroup: new FormControl(null, []),
       service: new FormControl(null, []),
       layer: new FormControl(null, []),
       _links: new FormControl(null, []),
     })
   }
 
   addNewTasksExtractionFME() {
     console.log(this.formTasksExtractionFME.value);
     this.taskService.create(this.formTasksExtractionFME.value)
       .subscribe(resp => {
         console.log(resp);
         // this.router.navigate(["/company", resp.id, "formConnection"]);
       });
   }
 
   updateConnection() {
     console.log(this.formTasksExtractionFME.value);
 
     this.taskService.update(this.formTasksExtractionFME.value)
       .subscribe(resp => {
         console.log(resp);
       });
   }
   
   // ******** Roles ******** //
   getAllRoles = () => {
     
     // return (this.http.get(`${this.formTasksExtractionFME.value._links.cartographies.href}`))
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
     // var urlReq=`${this.formTasksExtractionFME.value._links.tasks.href}`
     // if(this.formTasksExtractionFME.value._links.tasks.templated){
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
 
