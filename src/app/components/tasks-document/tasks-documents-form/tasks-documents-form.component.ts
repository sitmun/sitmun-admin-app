import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, TerritoryService, CartographyService, Cartography } from '@sitmun/frontend-core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
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
  formTasksDocument: FormGroup;
  taskDocumentToEdit;
  taskDocumentID = -1;
  dataLoaded: Boolean = false;
  
  //Grids
  themeGrid: any = environment.agGridTheme;
  columnDefsCartography: any[];
  getAllElementsEventCartographies: Subject<any[]> = new Subject <any[]>();
  columnDefsTerritories: any[];
  getAllElementsEventTerritories: Subject<any[]> = new Subject <any[]>();

  //Dialog
  columnDefsCartographyDialog: any[];
  addElementsEventCartographies: Subject<any[]> = new Subject <any[]>();
  columnDefsTerritoriesDialog: any[];  
  addElementsEventTerritories: Subject<any[]> = new Subject <any[]>();





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
              task: this.taskDocumentToEdit.name,
              documentType: '',
              groupTask: this.taskDocumentToEdit.groupName,
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

    },
      error => {

      });


      this.columnDefsCartography = [
        environment.selCheckboxColumnDef,
        { headerName: 'Id', field: 'id', editable: false },
        { headerName: this.utils.getTranslate('tasksDocumentEntity.name'), field: 'name' },  
        { headerName: this.utils.getTranslate('tasksDocumentEntity.status'), field: 'status' },  

      ];
  
      this.columnDefsTerritories = [
        environment.selCheckboxColumnDef,
        { headerName: 'Id', field: 'id', editable: false },
        { headerName: this.utils.getTranslate('tasksDocumentEntity.name'), field: 'name' },
        { headerName: this.utils.getTranslate('tasksDocumentEntity.status'), field: 'status' },  
  
      ];

      this.columnDefsCartographyDialog = [
        environment.selCheckboxColumnDef,
        { headerName: 'ID', field: 'id', editable: false },
        { headerName: this.utils.getTranslate('tasksDocumentEntity.name'), field: 'name', editable: false },
        { headerName: this.utils.getTranslate('tasksDocumentEntity.note'), field: 'description' },
      ];

      this.columnDefsTerritoriesDialog = [
        environment.selCheckboxColumnDef,
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
    
    // var urlReq = `${this.taskDocumentToEdit._links.cartography.href}`
    // if (this.taskDocumentToEdit._links.cartography.templated) {
    //   var url = new URL(urlReq.split("{")[0]);
    //   url.searchParams.append("projection", "view")
    //   urlReq = url.toString();
    // }
    // return (this.http.get(urlReq))
    // .pipe(map(data => data['_embedded']['cartographies']));

    const aux: Array<any> = [];
    return of(aux);

  }


  getAllRowsCartographies(data: any[] )
  {
    console.log(data);
  }


  // ******** Territories  ******** //
  getAllTerritories = () => {
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
  
  // ******** Cartography Dialog  ******** //

  getAllCartographyDialog = () => {
    return this.cartographyService.getAll();
  }

  openCartographyDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'gridDialogs'});
    dialogRef.componentInstance.getAllsTable=[this.getAllCartographyDialog];
    dialogRef.componentInstance.singleSelectionTable=[false];
    dialogRef.componentInstance.columnDefsTable=[this.columnDefsCartographyDialog];
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title='Cartography';
    dialogRef.componentInstance.titlesTable=['Cartography'];
    dialogRef.componentInstance.nonEditable=false;
    


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Add') {
          this.addElementsEventCartographies.next(result.data[0])
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
