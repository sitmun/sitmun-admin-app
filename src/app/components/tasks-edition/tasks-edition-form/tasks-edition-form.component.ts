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
   getAllElementsEventColumns: Subject<any[]> = new Subject <any[]>();
   columnDefsRoles: any[];
   getAllElementsEventRoles: Subject<any[]> = new Subject <any[]>();
   columnDefsTerritories: any[];
   getAllElementsEventTerritories: Subject<any[]> = new Subject <any[]>();
 
   //Dialog
   columnDefsColumnsDialog: any[];
   addElementsEventColumns: Subject<any[]> = new Subject <any[]>();
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
     public utils: UtilsService
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
               editionType: '',
               taskGroup: this.taskEditionToEdit.groupName,
               service: '',
               layerName: '',
               emptyGeometryParameter: '',
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
        environment.selCheckboxColumnDef,
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
         { headerName: this.utils.getTranslate('tasksEditionEntity.status'), field: 'status', editable:false },  
       ];


       this.columnDefsRoles = [
        environment.selCheckboxColumnDef,
         { headerName: 'Id', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksEditionEntity.name'), field: 'name' },  
         { headerName: this.utils.getTranslate('tasksEditionEntity.status'), field: 'status', editable:false },
       ];
   
       this.columnDefsTerritories = [
        environment.selCheckboxColumnDef,
         { headerName: 'Id', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksEditionEntity.name'), field: 'name' },
         { headerName: this.utils.getTranslate('tasksEditionEntity.status'), field: 'status', editable:false },
   
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
        environment.selCheckboxColumnDef,
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksEditionEntity.name'), field: 'name', editable: false },
       ];
 
       this.columnDefsTerritoriesDialog = [
        environment.selCheckboxColumnDef,
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
       _links: new FormControl(null, []),
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


   getAllRowsColumns(data: any[] )
   {
     console.log(data);
   }
   
   
   // ******** Roles ******** //
   getAllRoles = () => {
     console.log(this.taskEditionToEdit);
     return (this.http.get(`${this.taskEditionToEdit._links.roles.href}`))
     .pipe( map( data =>  data['_embedded']['roles']) );

 
   }

 
   getAllRowsRoles(data: any[] )
   {
     console.log(data);
   }
 
   // ******** Territories  ******** //
   getAllTerritories = () => {
    var urlReq=`${this.taskEditionToEdit._links.availabilities.href}`
    if(this.taskEditionToEdit._links.availabilities.templated){
      var url=new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection","view")
      urlReq=url.toString();
    }
    return (this.http.get(urlReq))
    .pipe( map( data =>  data['_embedded']['task-availabilities']) );
    
     
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

   getAllRowsTerritories(data: any[] )
   {
     console.log(data);
   }

   // ******** Columns Dialog  ******** //
 
   getAllColumnsDialog = () => {
    //  return this.roleService.getAll();
    const aux: Array<any> = [];
    return of(aux);
   }
 
   openColumnsDialog(data: any) {
 
     const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'gridDialogs'});
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
          if(result.event==='Add') {
            this.addElementsEventRoles.next(result.data[0])
          }
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
 
