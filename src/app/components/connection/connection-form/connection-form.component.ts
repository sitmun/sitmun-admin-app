import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectionService, CartographyService, TaskService, Cartography, Task } from 'dist/sitmun-frontend-core/';
import { Connection } from 'dist/sitmun-frontend-core/connection/connection.model';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-connection-form',
  templateUrl: './connection-form.component.html',
  styleUrls: ['./connection-form.component.scss']
})
export class ConnectionFormComponent implements OnInit {

  
  //Form
  formConnection: FormGroup;
  connectionToEdit;
  connectionID = -1;
  dataLoaded: Boolean = false;
  
  //Grids
  themeGrid: any = environment.agGridTheme;
  columnDefsCartographies: any[];
  columnDefsTasks: any[];

  //Dialog
  columnDefsCartographiesDialog: any[];
  columnDefsTasksDialog: any[];

  //Save Button
  dataUpdatedEvent: Subject<boolean> = new Subject <boolean>();
  getAllRowsEvent: Subject<boolean> = new Subject <boolean>();
  newCartographies: Cartography[] = [];
  newtasks: Task[] = [];
  addElementsEventCartographies: Subject<any[]> = new Subject <any[]>();




  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private connectionService: ConnectionService,
    public cartographyService: CartographyService,
    public tasksService: TaskService,
    private http: HttpClient,
    private utils: UtilsService
  ) {
    this.initializeConnectionForm();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.connectionID = +params.id;
      if (this.connectionID !== -1) {
        console.log(this.connectionID);

        this.connectionService.get(this.connectionID).subscribe(
          resp => {
            console.log(resp);
            this.connectionToEdit = resp;
            this.formConnection.setValue({
              id: this.connectionID,
              name: this.connectionToEdit.name,
              driver: this.connectionToEdit.driver,
              user: this.connectionToEdit.user,
              password: this.connectionToEdit.password,
              url: this.connectionToEdit.url,
              _links: this.connectionToEdit._links
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


      this.columnDefsCartographies = [
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
        { headerName: this.utils.getTranslate('connectionEntity.name'), field: 'name' },
        { headerName: this.utils.getTranslate('connectionEntity.layers'), field: 'layers' },
  
      ];
  
      this.columnDefsTasks = [
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
        { headerName: this.utils.getTranslate('connectionEntity.code'), field: 'name' },
        { headerName: this.utils.getTranslate('connectionEntity.taskGroup'), field: 'groupName' },
  
      ];

      this.columnDefsCartographiesDialog = [
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
        { headerName: this.utils.getTranslate('connectionEntity.name'), field: 'name', editable: false },
      ];

      this.columnDefsTasksDialog = [
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
        { headerName: this.utils.getTranslate('connectionEntity.name'), field: 'name',  editable: false  },
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
      url: new FormControl(null, []),
      _links: new FormControl(null, []),
    })
  }

  addNewConnection() {
    console.log(this.formConnection.value);
    this.connectionService.create(this.formConnection.value)
      .subscribe(resp => {
        console.log(resp);
        // this.router.navigate(["/company", resp.id, "formConnection"]);
      });
  }

  updateConnection() {
    console.log(this.formConnection.value);

    this.connectionService.update(this.formConnection.value)
      .subscribe(resp => {
        console.log(resp);
      });
  }
  
  // ******** Cartographies ******** //
  getAllCartographies = () => {
    
    return (this.http.get(`${this.connectionToEdit._links.cartographies.href}`))
    .pipe( map( data =>  data['_embedded']['cartographies']) );

  }

  removeDataCartographies(data: any[]) {
    console.log(data);
  }

  newDataCartographies(id: any) {
    // this.router.navigate(['role', id, 'roleForm']);
  }

  applyChangesCartographies(data: any[]) {
    console.log(data);
  }


  // ******** Tasks  ******** //
  getAllTasks = () => {
    var urlReq=`${this.connectionToEdit._links.tasks.href}`
    if(this.connectionToEdit._links.tasks.templated){
      var url=new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection","view")
      urlReq=url.toString();
    }

    return (this.http.get(urlReq))
    .pipe( map( data =>  data['_embedded']['tasks']) );
    
    
  }

  removeDataTasks(data: any[]) {
    console.log(data);
  }
  
  newDataTasks(id: any) {
    // this.router.navigate(['role', id, 'roleForm']);
  }

  applyChangesTasks(data: any[]) {
    console.log(data);
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
    const dialogRef = this.dialog.open(DialogGridComponent, {panelClass: 'gridDialogs'});
    dialogRef.componentInstance.getAllsTable=[this.getAllCartographiesDialog];
    dialogRef.componentInstance.singleSelectionTable=[false];
    dialogRef.componentInstance.columnDefsTable=[this.columnDefsCartographiesDialog];
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title='Cartographies';
    dialogRef.componentInstance.titlesTable=['Cartographies'];
    dialogRef.componentInstance.nonEditable=false;
    


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Add') {
          console.log(result.data);
          this.newCartographies.push(...result.data[0]) 
          this.addElementsEventCartographies.next(result.data[0])
          this.getAllRowsEvent.next(true);
        }
      }

    });


  }

  getAllRowsCartographies(data: any[] )
  {
    console.log("hey");
    console.log(data);
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
      const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'dialogsGrid'});
      dialogRef.componentInstance.getAllsTable=[this.getAllTasksDialog];
      dialogRef.componentInstance.singleSelectionTable=[false];
      dialogRef.componentInstance.columnDefsTable=[this.columnDefsTasksDialog];
      dialogRef.componentInstance.themeGrid=this.themeGrid;
      dialogRef.componentInstance.title='Tasks';
      dialogRef.componentInstance.titlesTable=['Tasks'];
      dialogRef.componentInstance.nonEditable=false;
      
  
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if(result){
          if( result.event==='Add') {      console.log(result.data); }
        }
      });
  
    }

    updateCartographies(cartographies: Cartography[])
    {
      const promises: Promise<any>[] = [];
      cartographies.forEach(cartography => {
        
        promises.push(new Promise((resolve, reject) => {​​​​​​​ this.http.put(`${this.connectionToEdit._links.cartographies.href}`,cartography).toPromise().then((resp) =>{​​​​​​​resolve()}​​​​​​​)}​​​​​​​));
        Promise.all(promises).then(() => {
          this.dataUpdatedEvent.next(true);
        });
       
      });
    }


    onSaveButtonClicked(){

      this.updateCartographies(this.newCartographies);
      this.dataUpdatedEvent.next(true);
  
      }

}
