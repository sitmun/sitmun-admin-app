import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, ServiceService, TerritoryService, RoleService, Role, TaskAvailability, TaskAvailabilityService, Task, TaskGroupService, Territory } from 'dist/sitmun-frontend-core/';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tasks-edition-form',
  templateUrl: './tasks-edition-form.component.html',
  styleUrls: ['./tasks-edition-form.component.scss']
})
export class TasksEditionFormComponent implements OnInit {

  taskGroups: Array<any> = [];
  services: Array<any> = [];

   //Form
   formTasksEdition: FormGroup;
   filterForm: FormGroup;
   taskEditionToEdit;
   taskEditionID = -1;
   dataLoaded: Boolean = false;
   
   //Grids
   themeGrid: any = config.agGridTheme;
   columnDefsColumns: any[];
   getAllElementsEventColumns: Subject<any[]> = new Subject <any[]>();

   columnDefsTerritories: any[];
   getAllElementsEventTerritories: Subject<boolean> = new Subject <boolean>();
   dataUpdatedEventTerritories: Subject<boolean> = new Subject<boolean>();
 
   columnDefsRoles: any[];
   getAllElementsEventRoles: Subject<boolean> = new Subject <boolean>();
   dataUpdatedEventRoles: Subject<boolean> = new Subject<boolean>();
 
 
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
     public taskAvailabilityService: TaskAvailabilityService,
     public taskGroupService: TaskGroupService,
     public serviceService: ServiceService,
     private http: HttpClient,
     public utils: UtilsService
   ) {
     this.initializeTasksEditionForm();
     this.initializeFilterForm();
   }
 
   ngOnInit(): void {

    const promises: Promise<any>[] = [];

    promises.push(new Promise((resolve, reject) => {
      this.taskGroupService.getAll().subscribe(
        resp => {
          this.taskGroups.push(...resp);
          resolve(true);
        }
      );
    }));

    promises.push(new Promise((resolve, reject) => {
      this.serviceService.getAll().map((resp) => {
        let wfsServices = [];
        resp.forEach(service => {
          if(service.type==='WFS') {wfsServices.push(service)}
        });  
        console.log(this.services);
        this.services.push(...wfsServices)
        resolve(true);
      }).subscribe()
      }));

    Promise.all(promises).then(() => {
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
               taskGroup: this.taskEditionToEdit.groupId,
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
       else{
        this.dataLoaded = true;
        this.formTasksEdition.patchValue({
          taskGroup: this.taskGroups[0].id,
          service: this.services[0].id,
        });
       }
 
     },
       error => {
 
       });
      });

       this.columnDefsColumns = [
        this.utils.getSelCheckboxColumnDef(),
         this.utils.getIdColumnDef(),
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
        this.utils.getSelCheckboxColumnDef(),
         this.utils.getIdColumnDef(),
         { headerName: this.utils.getTranslate('tasksEditionEntity.name'), field: 'name' },  
         { headerName: this.utils.getTranslate('tasksEditionEntity.status'), field: 'status', editable:false },
       ];
   
       this.columnDefsTerritories = [
        this.utils.getSelCheckboxColumnDef(),
         { headerName: 'Id', field: 'territoryId', editable: false },
         { headerName: this.utils.getTranslate('tasksEditionEntity.name'), field: 'territoryName' },
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
        this.utils.getSelCheckboxColumnDef(),
         { headerName: 'ID', field: 'id', editable: false },
         { headerName: this.utils.getTranslate('tasksEditionEntity.name'), field: 'name', editable: false },
       ];
 
       this.columnDefsTerritoriesDialog = [
        this.utils.getSelCheckboxColumnDef(),
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

    if(this.taskEditionID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }
     
     // return (this.http.get(`${this.formTasksEdition.value._links.cartographies.href}`))
     // .pipe( map( data =>  data['_embedded']['cartographies']) );
     const aux: Array<any> = [];
     return of(aux);
 
   }


   getAllRowsColumns(data: any[] )
   {
     console.log(data);
   }
   
   
   // ******** Territories ******** //
  getAllTerritories = (): Observable<any> => {
    if(this.taskEditionID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.taskEditionToEdit._links.availabilities.href}`
    if (this.taskEditionToEdit._links.availabilities.templated) {
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
      territory.task= this.taskEditionToEdit;
      if (territory.status === 'pendingCreation') {
        let index= data.findIndex(element => element.territoryId === territory.territoryId && !element.new)
        if(index === -1)
        {
          territoriesToCreate.push(territory)
          territory.new=false;
        }
       }
      if(territory.status === 'pendingDelete' && territory._links) {territoriesToDelete.push(territory) }
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

  
  // ******** Roles  ******** //
  getAllRoles = () => {

    if(this.taskEditionID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.taskEditionToEdit._links.roles.href}`
    if (this.taskEditionToEdit._links.roles.templated) {
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
      if (role.status === 'pendingModify') {rolesModified.push(role) }
      if(role.status!== 'pendingDelete') {rolesToPut.push(role._links.self.href) }
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
      let url=this.taskEditionToEdit._links.roles.href.split('{', 1)[0];
      this.utils.updateUriList(url,rolesToPut, this.dataUpdatedEventRoles)
    });
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

      if(this.formTasksEdition.valid)
      {
  
        //TODO Update cartography when save works
        console.log(this.formTasksEdition.value)
        let taskGroup= this.taskGroups.find(x => x.id===this.formTasksEdition.value.taskGroup )
        // this.updateCartography(this.currentCartography)
        var taskObj: Task= new Task();
        taskObj.name= this.formTasksEdition.value.name;
        taskObj.id= this.formTasksEdition.value.id;
        taskObj.group= taskGroup;
        taskObj._links= this.formTasksEdition.value._links;
    
        this.taskService.save(this.formTasksEdition.value)
        .subscribe(resp => {
          this.taskEditionToEdit= resp;
          this.taskEditionID=this.taskEditionToEdit.id;
          this.formTasksEdition.patchValue({
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
 
