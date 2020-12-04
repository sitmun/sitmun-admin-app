import { Component, OnInit } from '@angular/core';
import { Connection } from 'dist/sitmun-frontend-core/connection/connection.model';
import { ConnectionService } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';
import { Router } from '@angular/router';


@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  columnDefs: any[];
  public frameworkComponents = {
    btnEditRendererComponent: BtnEditRenderedComponent
  };

    constructor(public connectionService: ConnectionService,
                private utils: UtilsService,
                private router: Router,
                ) {

    }

     ngOnInit()  {
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
          width: 55,
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
