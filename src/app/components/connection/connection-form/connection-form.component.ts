import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectionService } from 'dist/sitmun-frontend-core/';
import { Connection } from 'dist/sitmun-frontend-core/connection/connection.model';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-connection-form',
  templateUrl: './connection-form.component.html',
  styleUrls: ['./connection-form.component.scss']
})
export class ConnectionFormComponent implements OnInit {

  themeGrid: any = environment.agGridTheme;
  columnDefsCartographies: any[];
  columnDefsTasks: any[];
  formConnection: FormGroup;
  connectionToEdit;
  connectionID = -1;
  dataLoaded: Boolean = false;s

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private connectionService: ConnectionService,
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
        { headerName: this.utils.getTranslate('connectionEntity.taskGroup'), field: 'taskGroup' },
  
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
    
    return (this.http.get(`${this.formConnection.value._links.cartographies.href}`))
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
    var urlReq=`${this.formConnection.value._links.tasks.href}`
    if(this.formConnection.value._links.tasks.templated){
      var url=new URL(urlReq.split("{")[0]);
      url.searchParams.append("projecction","view")
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

}
