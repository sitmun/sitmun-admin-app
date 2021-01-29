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
     public utils: UtilsService
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
               cartography: '',
               taskGroup: this.taskExtractionFMEToEdit.groupName,
               service: '',
               layer: '',
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
        environment.selCheckboxColumnDef,
         { headerName: 'Id', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.name'), field: 'name' },  
         { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.status'), field: 'status', editable:false },
       ];
   
       this.columnDefsTerritories = [
        environment.selCheckboxColumnDef,
         { headerName: 'Id', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.name'), field: 'name' },
         { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.status'), field: 'status', editable:false },
   
       ];

       this.columnDefsRolesDialog = [
        environment.selCheckboxColumnDef,
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.name'), field: 'name', editable: false },
         { headerName: this.utils.getTranslate('tasksExtractionFMEEntity.description'), field: 'description' },
       ];
 
       this.columnDefsTerritoriesDialog = [
        environment.selCheckboxColumnDef,
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
     
    return (this.http.get(`${this.taskExtractionFMEToEdit._links.roles.href}`))
    .pipe( map( data =>  data['_embedded']['roles']) );
 
   }


   getAllRowsRoles(data: any[] )
   {
     console.log(data);
   }
 
 
   // ******** Territories  ******** //
   getAllTerritories = () => {
    var urlReq=`${this.taskExtractionFMEToEdit._links.availabilities.href}`
    if(this.taskExtractionFMEToEdit._links.availabilities.templated){
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
 
