import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import {  ActivatedRoute,  Router} from '@angular/router';
import { ConnectionService } from 'dist/sitmun-frontend-core/';
import { Connection } from 'dist/sitmun-frontend-core/connection/connection.model';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';

@Component({
  selector: 'app-connection-form',
  templateUrl: './connection-form.component.html',
  styleUrls: ['./connection-form.component.scss']
})
export class ConnectionFormComponent implements OnInit {

  formConnection: FormGroup;
  connectionToEdit;
  connectionID = -1;

  columnDefs: any[];
  public frameworkComponents = {
    btnEditRendererComponent: BtnEditRenderedComponent
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private connectionService: ConnectionService,
    private http: HttpClient,
    private utils: UtilsService,
    ) {
        this.initializeConnectionForm();
    }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.connectionID = +params.id;
      if (this.connectionID !== -1){
        console.log(this.connectionID);

        this.connectionService.get(this.connectionID).subscribe(
          resp => {
            console.log(resp);
            this.connectionToEdit=resp;
            this.formConnection.setValue({
                id:       this.connectionID,
                name:     this.connectionToEdit.name,
                driver:   this.connectionToEdit.driver,
                user:     this.connectionToEdit.user,
                password: this.connectionToEdit.password,
                url:      this.connectionToEdit.url,
                _links:   this.connectionToEdit._links
              });


          },
          error => {

          }
        );
      }

    },
    error => {

    });



    this.columnDefs = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 50,
        lockPosition:true,
      },
      {
        headerName: '',
        field: 'id',
        editable: false,
        filter: false,
        width: 65,
        lockPosition:true,
        cellRenderer: 'btnEditRendererComponent',
        cellRendererParams: {
          clicked: this.newData.bind(this)
        },
      },
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('connectionEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('connectionEntity.user'), field: 'user'},
      { headerName: this.utils.getTranslate('connectionEntity.driver'), field: 'driver'},
      { headerName: this.utils.getTranslate('connectionEntity.connection'), field: 'url'}
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



  //Ag grid

  
      /*
      Important! Aquesta és la funció que li passarem al data grid a través de l'html per obtenir les files de la taula,
      de moment no he trobat cap altre manera de que funcioni sense posar la nomenclatura = () =>,
      pel que de moment hem dit de deixar-ho així!
    */
   getAllConnections = () => {

    return this.connectionService.getAll();
  }

  /*Les dues funcions que venen ara s'activaran quan es cliqui el botó de remove o el de new a la taula,
    si volguessim canviar el nom de la funció o qualsevol cosa, cal mirar l'html, allà es on es crida la funció
    corresponent!
  */

  removeData( data: Connection[])
  {
    data.forEach(connection => {
      this.connectionService.delete(connection);
    });
  }

  newData(id: any)
  {
    this.router.navigate(['connection', id, 'connectionForm']);
  }

  applyChanges( data: Connection[])
  {
    console.log(data);
  }




}
