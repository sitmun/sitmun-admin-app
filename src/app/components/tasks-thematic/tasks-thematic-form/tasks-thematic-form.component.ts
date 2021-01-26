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
  selector: 'app-tasks-thematic-form',
  templateUrl: './tasks-thematic-form.component.html',
  styleUrls: ['./tasks-thematic-form.component.scss']
})
export class TasksThematicFormComponent implements OnInit {

   //Form
   formTasksThematic: FormGroup;
   taskThematicToEdit;
   taskThematicID = -1;
   dataLoaded: Boolean = false;
   
   //Grids
   themeGrid: any = environment.agGridTheme;
   columnDefsRoles: any[];
   getAllElementsEventRoles: Subject<any[]> = new Subject <any[]>();
   columnDefsTerritories: any[];
   getAllElementsEventTerritories: Subject<any[]> = new Subject <any[]>();
 
 
   //Dialog
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
     this.initializeTasksThematicForm();
   }
 
   ngOnInit(): void {
     this.activatedRoute.params.subscribe(params => {
       this.taskThematicID = +params.id;
       if (this.taskThematicID !== -1) {
         console.log(this.taskThematicID);
 
         this.taskService.get(this.taskThematicID).subscribe(
           resp => {
             console.log(resp);
             this.taskThematicToEdit = resp;
             this.formTasksThematic.setValue({
               id: this.taskThematicID,
               name: this.taskThematicToEdit.name,
               description: '',
               _links: this.taskThematicToEdit._links
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
        environment.selCheckboxColumnDef,
         { headerName: 'Id', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksThematicEntity.name'), field: 'name' },  
         { headerName: this.utils.getTranslate('tasksThematicEntity.status'), field: 'status' },
       ];
   
       this.columnDefsTerritories = [
        environment.selCheckboxColumnDef,
         { headerName: 'Id', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksThematicEntity.name'), field: 'name' },
         { headerName: this.utils.getTranslate('tasksThematicEntity.status'), field: 'status' },
   
       ];

       this.columnDefsRolesDialog = [
        environment.selCheckboxColumnDef,
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksThematicEntity.name'), field: 'name', editable: false },
         { headerName: this.utils.getTranslate('tasksThematicEntity.description'), field: 'description' },
       ];
 
       this.columnDefsTerritoriesDialog = [
        environment.selCheckboxColumnDef,
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksThematicEntity.name'), field: 'name',  editable: false  },
         { headerName: this.utils.getTranslate('tasksThematicEntity.code'), field: 'code',  editable: false  },
       ];
 
 
 
   }
 
 
   initializeTasksThematicForm(): void {
 
     this.formTasksThematic = new FormGroup({
       id: new FormControl(null, []),
       name: new FormControl(null, []),
       description: new FormControl(null, []),
       _links: new FormControl(null, []),
     })
   }
 
   addNewTasksThematic() {
     console.log(this.formTasksThematic.value);
     this.taskService.create(this.formTasksThematic.value)
       .subscribe(resp => {
         console.log(resp);
         // this.router.navigate(["/company", resp.id, "formConnection"]);
       });
   }
 
   updateConnection() {
     console.log(this.formTasksThematic.value);
 
     this.taskService.update(this.formTasksThematic.value)
       .subscribe(resp => {
         console.log(resp);
       });
   }
   
   // ******** Roles ******** //
   getAllRoles = () => {
     
    return (this.http.get(`${this.taskThematicToEdit._links.roles.href}`))
    .pipe( map( data =>  data['_embedded']['roles']) );
 
   }


   getAllRowsRoles(data: any[] )
   {
     console.log(data);
   }
 
 
   // ******** Territories  ******** //
   getAllTerritories = () => {
    var urlReq=`${this.taskThematicToEdit._links.availabilities.href}`
    if(this.taskThematicToEdit._links.availabilities.templated){
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
 