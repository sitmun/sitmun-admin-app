import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectionService, CartographyService, TaskService, Cartography, Task, Connection } from '../../../frontend-core/src/lib/public_api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { map } from 'rxjs/operators';
import { DialogGridComponent } from '../../../frontend-gui/src/lib/public_api';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common'


@Component({
  selector: 'app-connection-form',
  templateUrl: './connection-form.component.html',
  styleUrls: ['./connection-form.component.scss']
})
export class ConnectionFormComponent implements OnInit {
  
  hidePassword = true;

  //Form
  formConnection: FormGroup;
  connectionToEdit;
  connectionID = -1;
  duplicateID = -1;
  dataLoaded: Boolean = false;

  //Grids
  themeGrid: any = config.agGridTheme;

  columnDefsCartographies: any[];
  getAllElementsEventCartographies: Subject<boolean> = new Subject<boolean>();

  columnDefsTasks: any[];
  getAllElementsEventTasks: Subject<string> = new Subject<string>();
  dataUpdatedEventTasks: Subject<boolean> = new Subject<boolean>();
  //Dialog
  columnDefsCartographiesDialog: any[];
  addElementsEventCartographies: Subject<any[]> = new Subject<any[]>();
  columnDefsTasksDialog: any[];
  addElementsEventTasks: Subject<any[]> = new Subject<any[]>();

  //Save Button
  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();

  newCartographies: Cartography[] = [];
  newtasks: Task[] = [];

  public driversList = [];



  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private connectionService: ConnectionService,
    public cartographyService: CartographyService,
    public tasksService: TaskService,

    private http: HttpClient,
    public utils: UtilsService
  ) {
    this.initializeConnectionForm();
  }

  ngOnInit(): void {

    const promises: Promise<any>[] = [];

    promises.push(new Promise((resolve, reject) => {
      this.utils.getCodeListValues('databaseConnection.driver').subscribe(
        resp => {
          this.driversList.push(...resp);
          resolve(true);
        }
      )
    }));

    Promise.all(promises).then(() => {  

      this.activatedRoute.params.subscribe(params => {
        this.connectionID = +params.id;
        if(params.idDuplicate) { this.duplicateID = +params.idDuplicate; }
        
        if (this.connectionID !== -1 || this.duplicateID != -1) {
          let idToGet = this.connectionID !== -1? this.connectionID: this.duplicateID
          console.log(this.connectionID);
          console.log(this.duplicateID);
  
          this.connectionService.get(idToGet).subscribe(
            resp => {
              console.log(resp);
              this.connectionToEdit = resp;
              this.formConnection.patchValue({
                driver: this.connectionToEdit.driver,
                user: this.connectionToEdit.user,
                password: this.connectionToEdit.password,
                url: this.connectionToEdit.url,
                _links: this.connectionToEdit._links
              });
  
              if(this.connectionID !== -1){
                this.formConnection.patchValue({
                  id: this.connectionID,
                  name: this.connectionToEdit.name,
                  passwordSet: this.connectionToEdit.passwordSet,
                });
              }
              else{
                this.formConnection.patchValue({
                  name: this.utils.getTranslate('copy_').concat(this.connectionToEdit.name),
                });
              }
  
              this.dataLoaded = true;
            },
            error => {
  
            }
          );
        }

        else { 
          this.dataLoaded = true;
          this.formConnection.patchValue({
            driver: this.driversList[0].value
          })
         }
  
      },
        error => {
  
        });
  
      })

    this.columnDefsCartographies = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('connectionEntity.name', 'name'),
      this.utils.getEditableColumnDef('connectionEntity.layers', 'layers'),
      this.utils.getStatusColumnDef(),
    ];

    this.columnDefsTasks = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('connectionEntity.name', 'name'),
      this.utils.getNonEditableColumnDef('connectionEntity.taskGroup', 'groupName'),
      this.utils.getNonEditableColumnDef('connectionEntity.typeName', 'typeName'),
      // this.utils.getStatusColumnDef(),
    ];

    this.columnDefsCartographiesDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('connectionEntity.name', 'name'),
    ];

    this.columnDefsTasksDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('connectionEntity.name', 'name'),
    ];



  }


  initializeConnectionForm(): void {

    this.formConnection = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl(null, [
        Validators.required,
      ]),
      driver: new FormControl(null, [
        Validators.required,
      ]),
      user: new FormControl(null, []),
      password: new FormControl(null, []),
      passwordSet: new FormControl(null, []),
      url: new FormControl(null, []),
      _links: new FormControl(null, []),
    })
  }


  // ******** Cartographies ******** //
  getAllCartographies = () => {

    if (this.connectionID == -1 && this.duplicateID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.connectionToEdit._links.cartographies.href}`
    if (this.connectionToEdit._links.cartographies.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }
    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['cartographies']));
  }

  /*getAllRowsCartographies(data: any[] )
  {
    let cartographiesModified = [];
    let cartographiesToPut = [];
    data.forEach(cartography => {
      cartography.connection=this.connectionToEdit;
      if (cartography.status === 'pendingModify') {cartographiesModified.push(cartography) }
      if(cartography.status!== 'pendingDelete') {cartographiesToPut.push(cartography._links.self.href) }
    });

    this.updateCartographies(cartographiesModified, cartographiesToPut );
  }*/

  /* updateCartographies(cartographiesModified: Cartography[], cartographiesToPut: Cartography[])
   {
     const promises: Promise<any>[] = [];
     cartographiesModified.forEach(cartography => {
       promises.push(new Promise((resolve, reject) => { this.cartographyService.save(cartography).subscribe((resp) => { resolve(true) }) }));
     });
     Promise.all(promises).then(() => {
       let url=this.connectionToEdit._links.cartographies.href.split('{', 1)[0];
       this.utils.updateUriList(url,cartographiesToPut)
      // this.connectionToEdit.cartographies=this.utils.createUriList(cartographiesToPut);
 
     });
   }*/



  // ******** Tasks  ******** //
  getAllTasks = () => {

    if (this.connectionID == -1 ) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.connectionToEdit._links.tasks.href}`
    if (this.connectionToEdit._links.tasks.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }
    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['tasks']));

  }

  getAllRowsTasks(event){
    if(event.event == "save"){
      this.saveTasks(event.data);
    }
  }


  saveTasks(data: any[]) {
    let dataChanged = false;
    let tasksToPut = [];
    const promises: Promise<any>[] = [];
    data.forEach(task => {

      if (task.status !== 'pendingDelete') { 
        if (task.status === 'pendingModify') {
          if(task.newItem){ dataChanged = true; }
          promises.push(new Promise((resolve, reject) => { this.tasksService.update(task).subscribe((resp) => { resolve(true) }) }));
        }
        else if (task.status === 'pendingCreation'){
          dataChanged = true;
        }
        tasksToPut.push(task._links.self.href)
      }
      else {
        dataChanged = true;
      }
    });
    Promise.all(promises).then(() => {
      if(dataChanged){
        let url = this.connectionToEdit._links.tasks.href.split('{', 1)[0];
        this.utils.updateUriList(url, tasksToPut, this.dataUpdatedEventTasks)
      }
      else{ this.dataUpdatedEventTasks.next(true) }
    });

  }

  // ******** Cartography Dialog  ******** //

  getAllCartographiesDialog = () => {
    return this.cartographyService.getAll();
  }


  openCartographyDialog(data: any) {
    // const getAlls: Array<() => Observable<any>> = [this.getAllCartographiesDialog];
    // const colDefsTable: Array<any[]> = [this.columnDefsCartographiesDialog];
    // const singleSelectionTable: Array<boolean> = [false];
    // const titlesTable: Array<string> = ['Cartographies'];
    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [this.getAllCartographiesDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsCartographiesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate("connectionEntity.cartography");
    dialogRef.componentInstance.titlesTable = [""];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventCartographies.next(result.data[0])
        }
      }

    });


  }



  // ******** Tasks Dialog  ******** //

  getAllTasksDialog = () => {
    return this.tasksService.getAll();
  }

  openTasksDialog(data: any) {
    // const getAlls: Array<() => Observable<any>> = [this.getAllCartographiesDialog];
    // const colDefsTable: Array<any[]> = [this.columnDefsCartographiesDialog];
    // const singleSelectionTable: Array<boolean> = [false];
    // const titlesTable: Array<string> = ['Cartographies'];
    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [this.getAllTasksDialog];
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTasksDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate("connectionEntity.tasks");
    dialogRef.componentInstance.titlesTable = [""];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventTasks.next(result.data[0])
        }
      }
    });

  }



  //Save Button

  onSaveButtonClicked() {

    if (this.formConnection.valid) {

      if (this.connectionID == -1 && this.duplicateID != -1) {
        this.formConnection.patchValue({
          _links: null
        })
      }

      this.connectionService.save(this.formConnection.value).subscribe(
        result => {
          console.log(result);
          this.connectionToEdit = result;
          this.connectionID = result.id
          this.formConnection.patchValue({
            id: result.id,
            passwordSet: result.passwordSet,
            _links: result._links
          })
          //this.getAllElementsEventCartographies.next(true);
          this.getAllElementsEventTasks.next('save');
        },
        error => {
          console.log(error);
        });
    }
    else {
      this.utils.showRequiredFieldsError();
    }
  }

  validateConnection() {
    let connection = {
      driver: this.formConnection.value.driver,
      url: this.formConnection.value.url,
      user: this.formConnection.value.user,
      password: this.formConnection.value.password
    }
    this.connectionService.testConnection(connection).subscribe(
      result => {

      },
      error => {
        console.log(error);
      });
  }

}
