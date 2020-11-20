import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Role } from 'dist/sitmun-frontend-core/role/role.model';
import { RoleService } from 'dist/sitmun-frontend-core/';


@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent {

  columnDefs = [
    { field: 'id', checkboxSelection: true, },
    { field: 'description' },
    { field: 'name'},
    { field: 'estat'},
  ];

    constructor(private http: HttpClient,
                public roleService: RoleService,
                ) {

    }



      /*
      Important! Aquesta és la funció que li passarem al data grid a través de l'html per obtenir les files de la taula,
      de moment no he trobat cap altre manera de que funcioni sense posar la nomenclatura = () =>,
      pel que de moment hem dit de deixar-ho així!
    */
    getAllRoles = () => {
      return this.roleService.getAll();
    }

    /*Les dues funcions que venen ara s'activaran quan es cliqui el botó de remove o el de new a la taula,
      si volguessim canviar el nom de la funció o qualsevol cosa, cal mirar l'html, allà es on es crida la funció
      corresponent!
    */

    removeData( data: Role[])
    {
      console.log(data);
    }

    newData()
    {
      console.log('Crear nou objecte!');
    }

    applyChanges( data: Role[])
    {
      console.log(data);
    }

  }
