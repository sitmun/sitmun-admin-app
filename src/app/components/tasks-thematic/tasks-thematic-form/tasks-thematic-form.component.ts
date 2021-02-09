import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, TerritoryService, TaskAvailabilityService, RoleService, Task, Territory, Role } from 'dist/sitmun-frontend-core/';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { Observable, of, Subject } from 'rxjs';
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
 
   columnDefsTerritories: any[];
   getAllElementsEventTerritories: Subject<boolean> = new Subject <boolean>();
   dataUpdatedEventTerritories: Subject<boolean> = new Subject<boolean>();
 
   columnDefsRoles: any[];
   getAllElementsEventRoles: Subject<boolean> = new Subject <boolean>();
   dataUpdatedEventRoles: Subject<boolean> = new Subject<boolean>();
 
 
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
     public taskAvailabilityService: TaskAvailabilityService,
     private http: HttpClient,
     public utils: UtilsService
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
       else{
        this.dataLoaded=true;
       }
 
     },
       error => {
 
       });

       this.columnDefsRoles = [
        environment.selCheckboxColumnDef,
         { headerName: 'Id', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksThematicEntity.name'), field: 'name' },  
         { headerName: this.utils.getTranslate('tasksThematicEntity.status'), field: 'status', editable:false },
       ];
   
       this.columnDefsTerritories = [
        environment.selCheckboxColumnDef,
         { headerName: 'Id', field: 'territoryId', editable: false },
         { headerName: this.utils.getTranslate('tasksThematicEntity.name'), field: 'territoryName' },
         { headerName: this.utils.getTranslate('tasksThematicEntity.status'), field: 'status', editable:false },
   
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
   
     // ******** Roles  ******** //
  getAllRoles = () => {

    if(this.taskThematicID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.taskThematicToEdit._links.roles.href}`
    if (this.taskThematicToEdit._links.roles.templated) {
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
      if (role.status === 'Modified') {rolesModified.push(role) }
      if(role.status!== 'Deleted') {rolesToPut.push(role._links.self.href) }
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
      let url=this.taskThematicToEdit._links.roles.href.split('{', 1)[0];
      this.utils.updateUriList(url,rolesToPut, this.dataUpdatedEventRoles)
    });
  }

 
    // ******** Territories ******** //
  getAllTerritories = (): Observable<any> => {
    if(this.taskThematicID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.taskThematicToEdit._links.availabilities.href}`
    if (this.taskThematicToEdit._links.availabilities.templated) {
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
      territory.task= this.taskThematicToEdit;
      if (territory.status === 'Pending creation') {
        let index= data.findIndex(element => element.territoryId === territory.territoryId && !element.new)
        if(index === -1)
        {
          territoriesToCreate.push(territory)
          territory.new=false;
        }
       }
      if(territory.status === 'Deleted' && territory._links) {territoriesToDelete.push(territory) }
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

     if(this.formTasksThematic.valid)
     {
 
       //TODO Update cartography when save works

       var taskObj: Task= new Task();
       taskObj.name= this.formTasksThematic.value.name;
       taskObj.id= this.formTasksThematic.value.id;
      //  taskObj.description= this.formTasksThematic.value.id;
       taskObj._links= this.formTasksThematic.value._links;
   
       this.taskService.save(this.formTasksThematic.value)
       .subscribe(resp => {
         this.taskThematicToEdit= resp;
         this.taskThematicID=this.taskThematicToEdit.id;
         this.formTasksThematic.patchValue({
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
