import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, TerritoryService, RoleService } from 'dist/sitmun-frontend-core/';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';

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
              task: this.taskDownloadToEdit.task,
              groupTask: this.taskDownloadToEdit.groupTask,
              path: this.taskDownloadToEdit.path,
              extent: this.taskDownloadToEdit.extent,
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
        { headerName: this.utils.getTranslate('tasksDownloadEntity.name'), field: 'name' },  
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
        { headerName: this.utils.getTranslate('tasksDownloadEntity.code'), field: 'name' },
  
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
        { headerName: this.utils.getTranslate('tasksDownloadEntity.name'), field: 'name', editable: false },
        { headerName: this.utils.getTranslate('tasksDownloadEntity.note'), field: 'description' },
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
    
    return (this.http.get(`${this.formTasksDownload.value._links.cartographies.href}`))
    .pipe( map( data =>  data['_embedded']['cartographies']) );

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
    var urlReq=`${this.formTasksDownload.value._links.tasks.href}`
    if(this.formTasksDownload.value._links.tasks.templated){
      var url=new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection","view")
      urlReq=url.toString();
    }

    return (this.http.get(urlReq))
    .pipe( map( data =>  data['_embedded']['tasks']) );
    
    
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
