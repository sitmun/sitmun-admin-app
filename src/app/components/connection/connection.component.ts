import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Connection } from 'dist/sitmun-frontend-core/connection/connection.model';
import { ConnectionService } from 'dist/sitmun-frontend-core/';


@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent {

  columnDefs = [
    { field: 'id', checkboxSelection: true, },
    { field: 'name' },
    { field: 'user'},
    { field: 'driver'},
    { field: 'url'},
    { field: 'estat'},
  ];

    constructor(private http: HttpClient,
                public connectionService: ConnectionService,
                ) {

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
      console.log(data);
    }

    newData()
    {
      console.log('Crear nou objecte!');
    }

    applyChanges( data: Connection[])
    {
      console.log(data);
    }

  }
