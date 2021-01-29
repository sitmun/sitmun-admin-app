import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, TerritoryService, RoleService } from '@sitmun/frontend-core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';

@Component({
  selector: 'app-tasks-download-form',
  templateUrl: './tasks-download-form.component.html',
  styleUrls: ['./tasks-download-form.component.scss']
})
export class TasksDownloadFormComponent implements OnInit {
 
  //Form
  formTasksDownload: FormGroup;
  taskDownloadToEdit;
  taskDownloadID = -1;
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
    this.initializeTasksDownloadForm();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.taskDownloadID = +params.id;
      if (this.taskDownloadID !== -1) {
        console.log(this.taskDownloadID);

        this.taskService.get(this.taskDownloadID).subscribe(
          resp => {
            console.log(resp);
            this.taskDownloadToEdit = resp;
            this.formTasksDownload.setValue({
              id: this.taskDownloadID,
              task: this.taskDownloadToEdit.name,
              groupTask: this.taskDownloadToEdit.groupName,
              path: ' ',
              extent: '',
              _links: this.taskDownloadToEdit._links
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
        { headerName: this.utils.getTranslate('tasksDownloadEntity.name'), field: 'name' },  
        { headerName: this.utils.getTranslate('tasksDownloadEntity.status'), field: 'status', editable:false },  
      ];
  
      this.columnDefsTerritories = [
        environment.selCheckboxColumnDef,
        { headerName: 'Id', field: 'id', editable: false },
        { headerName: this.utils.getTranslate('tasksDownloadEntity.code'), field: 'name' },
        { headerName: this.utils.getTranslate('tasksDownloadEntity.status'), field: 'status', editable:false },  

  
      ];

      this.columnDefsRolesDialog = [
        environment.selCheckboxColumnDef,
        { headerName: 'ID', field: 'id', editable: false },
        { headerName: this.utils.getTranslate('tasksDownloadEntity.name'), field: 'name', editable: false },
        { headerName: this.utils.getTranslate('tasksDownloadEntity.note'), field: 'description', editable: false, },
      ];

      this.columnDefsTerritoriesDialog = [
        environment.selCheckboxColumnDef,
        { headerName: 'ID', field: 'id', editable: false },
        { headerName: this.utils.getTranslate('tasksDownloadEntity.name'), field: 'name',  editable: false  },
        { headerName: this.utils.getTranslate('tasksDownloadEntity.code'), field: 'code',  editable: false  },
      ];



  }


  initializeTasksDownloadForm(): void {

    this.formTasksDownload = new FormGroup({
      id: new FormControl(null, []),
      task: new FormControl(null, []),
      groupTask: new FormControl(null, []),
      path: new FormControl(null, []),
      extent: new FormControl(null, []),
      _links: new FormControl(null, []),
    })
  }

  addNewTasksDownload() {
    console.log(this.formTasksDownload.value);
    this.taskService.create(this.formTasksDownload.value)
      .subscribe(resp => {
        console.log(resp);
        // this.router.navigate(["/company", resp.id, "formConnection"]);
      });
  }

  updateConnection() {
    console.log(this.formTasksDownload.value);

    this.taskService.update(this.formTasksDownload.value)
      .subscribe(resp => {
        console.log(resp);
      });
  }
  
  // ******** Roles ******** //
  getAllRoles = () => {
    
    return (this.http.get(`${this.taskDownloadToEdit._links.roles.href}`))
    .pipe( map( data =>  data['_embedded']['roles']) );

  }


  getAllRowsRoles(data: any[] )
  {
    console.log(data);
  }


  // ******** Territories  ******** //
  getAllTerritories = () => {
    var urlReq=`${this.taskDownloadToEdit._links.availabilities.href}`
    if(this.taskDownloadToEdit._links.availabilities.templated){
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
