import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, TerritoryService, CartographyService, Cartography } from 'dist/sitmun-frontend-core/';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tasks-documents-form',
  templateUrl: './tasks-documents-form.component.html',
  styleUrls: ['./tasks-documents-form.component.scss']
})
export class TasksDocumentsFormComponent implements OnInit {

  //Form
  formTasksDocument: FormGroup;
  taskDocumentToEdit;
  taskDocumentID = -1;
  dataLoaded: Boolean = false;
  
  //Grids
  themeGrid: any = environment.agGridTheme;
  columnDefsCartography: any[];
  columnDefsTerritories: any[];

  //Dialog
  columnDefsCartographyDialog: any[];
  columnDefsTerritoriesDialog: any[];




  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public taskService: TaskService,
    public cartographyService: CartographyService,
    public territoryService: TerritoryService,
    private http: HttpClient,
    private utils: UtilsService
  ) {
    this.initializeTasksDocumentForm();
  }

  ngOnInit(): void {
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
              task: this.taskDocumentToEdit.task,
              documentType: this.taskDocumentToEdit.documentType,
              groupTask: this.taskDocumentToEdit.groupTask,
              path: this.taskDocumentToEdit.path,
              extent: this.taskDocumentToEdit.extent,
              _links: this.taskDocumentToEdit._links
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


      this.columnDefsCartography = [
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
        { headerName: this.utils.getTranslate('tasksDocumentEntity.name'), field: 'name' },  
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
        { headerName: this.utils.getTranslate('tasksDocumentEntity.name'), field: 'name' },
  
      ];

      this.columnDefsCartographyDialog = [
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
        { headerName: this.utils.getTranslate('tasksDocumentEntity.name'), field: 'name', editable: false },
        { headerName: this.utils.getTranslate('tasksDocumentEntity.note'), field: 'description' },
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
        { headerName: this.utils.getTranslate('tasksDocumentEntity.name'), field: 'name',  editable: false  },
        { headerName: this.utils.getTranslate('tasksDocumentEntity.code'), field: 'code',  editable: false  },
      ];



  }


  initializeTasksDocumentForm(): void {

    this.formTasksDocument = new FormGroup({
      id: new FormControl(null, []),
      task: new FormControl(null, []),
      groupTask: new FormControl(null, []),
      documentType: new FormControl(null, []),
      path: new FormControl(null, []),
      extent: new FormControl(null, []),
      _links: new FormControl(null, []),
    })
  }

  addNewTasksDocument() {
    console.log(this.formTasksDocument.value);
    this.taskService.create(this.formTasksDocument.value)
      .subscribe(resp => {
        console.log(resp);
        // this.router.navigate(["/company", resp.id, "formConnection"]);
      });
  }

  updateConnection() {
    console.log(this.formTasksDocument.value);

    this.taskService.update(this.formTasksDocument.value)
      .subscribe(resp => {
        console.log(resp);
      });
  }
  
  // ******** Cartography ******** //
  getAllCartography = () => {
    
    // return (this.http.get(`${this.formTasksDocument.value._links.cartographies.href}`))
    // .pipe( map( data =>  data['_embedded']['cartographies']) );
    const aux: Array<any> = [];
    return of(aux);

  }

  removeDataCartography(data: any[]) {
    console.log(data);
  }

  newDataCartography(id: any) {
    // this.router.navigate(['role', id, 'roleForm']);
  }

  applyChangesCartography(data: any[]) {
    console.log(data);
  }


  // ******** Territories  ******** //
  getAllTerritories = () => {
    // var urlReq=`${this.formTasksDocument.value._links.tasks.href}`
    // if(this.formTasksDocument.value._links.tasks.templated){
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
  
  // ******** Cartography Dialog  ******** //

  getAllCartographyDialog = () => {
    return this.cartographyService.getAll();
  }

  openCartographyDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent);
    dialogRef.componentInstance.getAllsTable=[this.getAllCartographyDialog];
    dialogRef.componentInstance.singleSelectionTable=[false];
    dialogRef.componentInstance.columnDefsTable=[this.columnDefsCartographyDialog];
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title='Cartography';
    dialogRef.componentInstance.titlesTable=['Cartography'];
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
