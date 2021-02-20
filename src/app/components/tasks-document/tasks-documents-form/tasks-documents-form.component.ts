import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, TerritoryService, RoleService, TaskAvailabilityService, TaskGroupService, Task, Territory, Role } from 'dist/sitmun-frontend-core/';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tasks-documents-form',
  templateUrl: './tasks-documents-form.component.html',
  styleUrls: ['./tasks-documents-form.component.scss']
})
export class TasksDocumentsFormComponent implements OnInit {

  //Form
  taskGroups: Array<any> = [];
  documentTypes: Array<any> = [];
  formTasksDocument: FormGroup;
  taskDocumentToEdit;
  taskDocumentID = -1;
  dataLoaded: Boolean = false;
  
  //Grids
  themeGrid: any = config.agGridTheme;
  columnDefsRoles: any[];
  getAllElementsEventRoles: Subject<boolean> = new Subject <boolean>();
  dataUpdatedEventRoles: Subject<boolean> = new Subject<boolean>();

  columnDefsTerritories: any[];
  getAllElementsEventTerritories: Subject<boolean> = new Subject <boolean>();
  dataUpdatedEventTerritories: Subject<boolean> = new Subject<boolean>();


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
    private taskGroupService: TaskGroupService,
    private taskAvailabilityService: TaskAvailabilityService,
    private http: HttpClient,
    public utils: UtilsService
  ) {
    this.initializeTasksDocumentForm();
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
      this.utils.getCodeListValues('downloadTask.scope').subscribe(
        resp => {
          this.documentTypes.push(...resp);
          resolve(true);
        }
      );
    }));


    Promise.all(promises).then(() => {
      this.activatedRoute.params.subscribe(params => {
        this.taskDocumentID = +params.id;
        if (this.taskDocumentID !== -1) {
          console.log(this.taskDocumentID);
  
          this.taskService.get(this.taskDocumentID).subscribe(
            resp => {
              console.log(resp);
              this.taskDocumentToEdit = resp;
              this.formTasksDocument.setValue({
                id: this.taskDocumentID,
                name: this.taskDocumentToEdit.name,
                documentType: this.documentTypes[0].id,
                taskGroup: this.taskDocumentToEdit.groupId,
                path:  '',
                extent: '',
                _links: this.taskDocumentToEdit._links
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
    });


    this.columnDefsRoles = [
      this.utils.getSelCheckboxColumnDef(),
        this.utils.getIdColumnDef(),
        { headerName: this.utils.getTranslate('tasksDownloadEntity.name'), field: 'name' },  
        { headerName: this.utils.getTranslate('tasksDownloadEntity.status'), field: 'status', editable:false },  
      ];
  
  
      this.columnDefsTerritories = [
        this.utils.getSelCheckboxColumnDef(),
        { headerName: 'Id', field: 'territoryId', editable: false },
        { headerName: this.utils.getTranslate('tasksDocumentEntity.name'), field: 'territoryName' },
        { headerName: this.utils.getTranslate('tasksDocumentEntity.status'), field: 'status', editable:false },  
  
      ];

      this.columnDefsRolesDialog = [
        this.utils.getSelCheckboxColumnDef(),
        { headerName: 'ID', field: 'id', editable: false },
        { headerName: this.utils.getTranslate('tasksDownloadEntity.name'), field: 'name', editable: false },
        { headerName: this.utils.getTranslate('tasksDownloadEntity.note'), field: 'description', editable: false, },
      ];
      this.columnDefsTerritoriesDialog = [
        this.utils.getSelCheckboxColumnDef(),
        { headerName: 'ID', field: 'id', editable: false },
        { headerName: this.utils.getTranslate('tasksDocumentEntity.name'), field: 'name',  editable: false  },
        { headerName: this.utils.getTranslate('tasksDocumentEntity.code'), field: 'code',  editable: false  },
      ];



  }


  initializeTasksDocumentForm(): void {

    this.formTasksDocument = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl(null, []),
      taskGroup: new FormControl(null, []),
      documentType: new FormControl(null, []),
      path: new FormControl(null, []),
      extent: new FormControl(null, []),
      _links: new FormControl(null, []),
    })
  }

  
 
  
  // ******** Roles ******** //
  getAllRoles = () => {

    if(this.taskDocumentID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }
    
    return (this.http.get(`${this.taskDocumentToEdit._links.roles.href}`))
    .pipe( map( data =>  data['_embedded']['roles']) );

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
      promises.push(new Promise((resolve, reject) => { this.taskDocumentToEdit.update(role).subscribe((resp) => { resolve(true) }) }));
    });
    Promise.all(promises).then(() => {
      let url=this.taskDocumentToEdit._links.roles.href.split('{', 1)[0];
      this.utils.updateUriList(url,rolesToPut, this.dataUpdatedEventRoles)
    });
  }


  // ******** Territories  ******** //
  getAllTerritories = () => {


    if(this.taskDocumentID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq=`${this.taskDocumentToEdit._links.availabilities.href}`
    if(this.taskDocumentToEdit._links.availabilities.templated){
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

      if(this.formTasksDocument.valid)
      {
    
        //TODO Update cartography when save works
        console.log(this.formTasksDocument.value)
        let taskGroup= this.taskGroups.find(x => x.id===this.formTasksDocument.value.taskGroup )
        let documentType= this.documentTypes.find(x => x.id===this.formTasksDocument.value.documentType )
        // this.updateCartography(this.currentCartography)
        var taskObj: Task= new Task();
        taskObj.name= this.formTasksDocument.value.name;
        taskObj.id= this.formTasksDocument.value.id;
        taskObj.group= taskGroup;
        // taskObj.documentType= documentType;
        // taskObj.path= taskGroup;
        // taskObj.extent= taskGroup;
        taskObj._links= this.formTasksDocument.value._links;
    
        this.taskService.save(this.formTasksDocument.value)
        .subscribe(resp => {
          this.taskDocumentToEdit= resp;
          this.taskDocumentID=this.taskDocumentToEdit.id;
          this.formTasksDocument.patchValue({
            id: resp.id,
            _links: resp._links
          })
          this.getAllElementsEventRoles.next(true);
          this.getAllElementsEventTerritories.next(true);
      
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
