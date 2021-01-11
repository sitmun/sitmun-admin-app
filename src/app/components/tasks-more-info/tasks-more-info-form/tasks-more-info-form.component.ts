import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, TerritoryService, RoleService } from 'dist/sitmun-frontend-core/';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tasks-more-info-form',
  templateUrl: './tasks-more-info-form.component.html',
  styleUrls: ['./tasks-more-info-form.component.scss']
})
export class TasksMoreInfoFormComponent implements OnInit {


   //Form
   formTasksMoreInfo: FormGroup;
   taskMoreInfoToEdit;
   taskMoreInfoID = -1;
   dataLoaded: Boolean = false;
   
   //Grids
   themeGrid: any = environment.agGridTheme;
   columnDefsRoles: any[];
   columnDefsTerritories: any[];
   columnDefsParameters: any[];
 
   //Dialog
   columnDefsRolesDialog: any[];
   columnDefsTerritoriesDialog: any[];
   columnDefsParametersDialog: any[];
 

 
 
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
     this.initializeTasksMoreInfoForm();
   }
 
   ngOnInit(): void {
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
               task: this.taskMoreInfoToEdit.task,
               groupTask: this.taskMoreInfoToEdit.groupTask,
               accessType: this.taskMoreInfoToEdit.documentType,
               command: this.taskMoreInfoToEdit.path,
               connection: this.taskMoreInfoToEdit.extent,
               associatedLayer: this.taskMoreInfoToEdit.extent,
               _links: this.taskMoreInfoToEdit._links
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

        {
          headerName: '',
          checkboxSelection: true,
          headerCheckboxSelection: true,
          editable: false,
          filter: false,
          width: 40,
          lockPosition: true,
        },
        { headerName: this.utils.getTranslate('tasksMoreInfoEntity.key'), field: 'key' },
        { headerName: this.utils.getTranslate('tasksMoreInfoEntity.value'), field: 'value', },
        { headerName: this.utils.getTranslate('tasksMoreInfoEntity.order'), field: 'order' },
  
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
         { headerName: this.utils.getTranslate('tasksMoreInfoEntity.name'), field: 'name' },  
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
         { headerName: this.utils.getTranslate('tasksMoreInfoEntity.name'), field: 'name' },
   
       ];

       this.columnDefsParametersDialog = [
        {
          headerName: '',
          checkboxSelection: true,
          headerCheckboxSelection: true,
          editable: false,
          filter: false,
          width: 50,
          lockPosition:true,
        },
        { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name',  editable: false  },
        { headerName: this.utils.getTranslate('applicationEntity.value'), field: 'value',  editable: false  },
        { headerName: this.utils.getTranslate('applicationEntity.type'), field: 'type',  editable: false  },
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
         { headerName: this.utils.getTranslate('tasksMoreInfoEntity.name'), field: 'name', editable: false },
         { headerName: this.utils.getTranslate('tasksMoreInfoEntity.description'), field: 'description' },
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
         { headerName: this.utils.getTranslate('tasksMoreInfoEntity.name'), field: 'name',  editable: false  },
         { headerName: this.utils.getTranslate('tasksMoreInfoEntity.code'), field: 'code',  editable: false  },
       ];
 
 
 
   }
 
 
   initializeTasksMoreInfoForm(): void {
 
     this.formTasksMoreInfo = new FormGroup({
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
 
   addNewTasksMoreInfo() {
     console.log(this.formTasksMoreInfo.value);
     this.taskService.create(this.formTasksMoreInfo.value)
       .subscribe(resp => {
         console.log(resp);
         // this.router.navigate(["/company", resp.id, "formConnection"]);
       });
   }
 
   updateConnection() {
     console.log(this.formTasksMoreInfo.value);
 
     this.taskService.update(this.formTasksMoreInfo.value)
       .subscribe(resp => {
         console.log(resp);
       });
   }

     // ******** Parameters configuration ******** //
  getAllParameters = (): Observable<any> => {
    // return (this.http.get(`${this.formTasksMoreInfo.value._links.parameters.href}`))
    //   .pipe(map(data => data[`_embedded`][`service-parameters`]));
    const aux: Array<any> = [];
    return of(aux);
  }

  removeParameters(data: any[]) {
    console.log(data);
  }

  newDataParameters(id: any) {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }
   
   // ******** Roles ******** //
   getAllRoles = () => {
     
     // return (this.http.get(`${this.formTasksMoreInfo.value._links.cartographies.href}`))
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
     // var urlReq=`${this.formTasksMoreInfo.value._links.tasks.href}`
     // if(this.formTasksMoreInfo.value._links.tasks.templated){
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

     // ******** Parameters Dialog  ******** //

  getAllParametersDialog = () => {
    const aux: Array<any> = [];
    return of(aux);
    // return this.cartographyService.getAll();
  }

  openParametersDialog(data: any) {
  
    const dialogRef = this.dialog.open(DialogGridComponent);
    dialogRef.componentInstance.getAllsTable=[this.getAllParametersDialog];
    dialogRef.componentInstance.singleSelectionTable=[false];
    dialogRef.componentInstance.columnDefsTable=[this.columnDefsParametersDialog];
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title='Parameters';
    dialogRef.componentInstance.titlesTable=['Parameters'];
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
 