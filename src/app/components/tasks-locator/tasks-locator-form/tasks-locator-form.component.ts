import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, TerritoryService, RoleService } from '@sitmun/frontend-core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tasks-locator-form',
  templateUrl: './tasks-locator-form.component.html',
  styleUrls: ['./tasks-locator-form.component.scss']
})
export class TasksLocatorFormComponent implements OnInit {

   //Form
   formTasksLocator: FormGroup;
   taskLocatorToEdit;
   taskLocatorID = -1;
   dataLoaded: Boolean = false;
   
   //Grids
   themeGrid: any = environment.agGridTheme;
   columnDefsRoles: any[];
   getAllElementsEventRoles: Subject<any[]> = new Subject <any[]>();
   columnDefsTerritories: any[];
   getAllElementsEventTerritories: Subject<any[]> = new Subject <any[]>();
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
     private http: HttpClient,
     public utils: UtilsService
   ) {
     this.initializeTasksLocatorForm();
   }
 
   ngOnInit(): void {
     this.activatedRoute.params.subscribe(params => {
       this.taskLocatorID = +params.id;
       if (this.taskLocatorID !== -1) {
         console.log(this.taskLocatorID);
 
         this.taskService.get(this.taskLocatorID).subscribe(
           resp => {
             console.log(resp);
             this.taskLocatorToEdit = resp;
             this.formTasksLocator.setValue({
               id: this.taskLocatorID,
               task: this.taskLocatorToEdit.name,
               groupTask: this.taskLocatorToEdit.groupName,
               accessType: '',
               command: this.taskLocatorToEdit.order,
               connection: '',
               associatedLayer: '',
               _links: this.taskLocatorToEdit._links
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

       this.columnDefsParameters = [
        environment.selCheckboxColumnDef,
        { headerName: this.utils.getTranslate('tasksLocatorEntity.key'), field: 'key' },
        { headerName: this.utils.getTranslate('tasksLocatorEntity.type'), field: 'type', },
        { headerName: this.utils.getTranslate('tasksLocatorEntity.tag'), field: 'tag' },
        { headerName: this.utils.getTranslate('tasksLocatorEntity.select'), field: 'select' },
        { headerName: this.utils.getTranslate('tasksLocatorEntity.order'), field: 'order' },
        { headerName: this.utils.getTranslate('tasksLocatorEntity.status'), field: 'status', editable:false },
  
      ];
 
 
       this.columnDefsRoles = [
        environment.selCheckboxColumnDef,
         { headerName: 'Id', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksLocatorEntity.name'), field: 'name' },  
         { headerName: this.utils.getTranslate('tasksLocatorEntity.status'), field: 'status', editable:false },
       ];
   
       this.columnDefsTerritories = [
        environment.selCheckboxColumnDef,
         { headerName: 'Id', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksLocatorEntity.name'), field: 'name' },
         { headerName: this.utils.getTranslate('tasksLocatorEntity.status'), field: 'status', editable:false },
   
       ];

       this.columnDefsParametersDialog = [
        environment.selCheckboxColumnDef,
        { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name',  editable: false  },
        { headerName: this.utils.getTranslate('applicationEntity.value'), field: 'value',  editable: false  },
        { headerName: this.utils.getTranslate('applicationEntity.type'), field: 'type',  editable: false  },
      ];
 
       this.columnDefsRolesDialog = [
        environment.selCheckboxColumnDef,
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksLocatorEntity.name'), field: 'name', editable: false },
         { headerName: this.utils.getTranslate('tasksLocatorEntity.description'), field: 'description' },
       ];
 
       this.columnDefsTerritoriesDialog = [
        environment.selCheckboxColumnDef,
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksLocatorEntity.name'), field: 'name',  editable: false  },
         { headerName: this.utils.getTranslate('tasksLocatorEntity.code'), field: 'code',  editable: false  },
       ];
 
 
 
   }
 
 
   initializeTasksLocatorForm(): void {
 
     this.formTasksLocator = new FormGroup({
       id: new FormControl(null, []),
       task: new FormControl(null, []),
       groupTask: new FormControl(null, []),
       accessType: new FormControl(null, []),
       command: new FormControl(null, []),
       connection: new FormControl(null, []),
       associatedLayer: new FormControl(null, []),
       _links: new FormControl(null, []),
     })
   }
 
   addNewTasksLocator() {
     console.log(this.formTasksLocator.value);
     this.taskService.create(this.formTasksLocator.value)
       .subscribe(resp => {
         console.log(resp);
         // this.router.navigate(["/company", resp.id, "formConnection"]);
       });
   }
 
   updateConnection() {
     console.log(this.formTasksLocator.value);
 
     this.taskService.update(this.formTasksLocator.value)
       .subscribe(resp => {
         console.log(resp);
       });
   }

     // ******** Parameters configuration ******** //
  getAllParameters = (): Observable<any> => {
    return (this.http.get(`${this.taskLocatorToEdit._links.parameters.href}`))
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
   
   // ******** Roles ******** //
   getAllRoles = () => {
     
     return (this.http.get(`${this.taskLocatorToEdit._links.roles.href}`))
     .pipe( map( data =>  data['_embedded']['roles']) );

 
   }
 

   getAllRowsRoles(data: any[] )
   {
     console.log(data);
   }
    
 
 
   // ******** Territories  ******** //
   getAllTerritories = () => {
    var urlReq=`${this.taskLocatorToEdit._links.availabilities.href}`
    if(this.taskLocatorToEdit._links.availabilities.templated){
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
            this.addElementsEventTerritories.next(result.data[0])
          }
        }
   
       });
   
     }
 
 }
 
