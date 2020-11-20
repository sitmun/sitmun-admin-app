import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { User } from 'dist/sitmun-frontend-core/user/user.model';
import { UserService } from 'dist/sitmun-frontend-core/';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent  {


  columnDefs = [
    { field: 'username', checkboxSelection: true, },
    { field: 'firstName' },
    { field: 'lastName'},
    { field: 'estat'},
  ];

    constructor(private http: HttpClient,
                public userService: UserService,
                ) {

    }



      /*
      Important! Aquesta és la funció que li passarem al data grid a través de l'html per obtenir les files de la taula,
      de moment no he trobat cap altre manera de que funcioni sense posar la nomenclatura = () =>,
      pel que de moment hem dit de deixar-ho així!
    */
    getAllUsers = () => {

      return this.userService.getAll();
    }

    /*Les dues funcions que venen ara s'activaran quan es cliqui el botó de remove o el de new a la taula,
      si volguessim canviar el nom de la funció o qualsevol cosa, cal mirar l'html, allà es on es crida la funció
      corresponent!
    */

    removeData( data: User[])
    {
      console.log(data);
    }

    newData()
    {
      console.log('Crear nou objecte!');
    }

    applyChanges( data: User[])
    {
      console.log(data);
    }

  }
