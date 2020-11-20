import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Role } from 'dist/sitmun-frontend-core/role/role.model';
import { RoleService } from 'dist/sitmun-frontend-core/';


@Component({
  selector: 'app-proves',
  templateUrl: './proves.component.html',
  styleUrls: ['./proves.component.scss']
})
export class ProvesComponent implements OnInit {

  /*
    Important, perque funcioni s'ha de tenir el backend-core engegat, per defecte està posat al port 8080,
    que és en el que s'engega normalment, si pel que fos el tens a un altre, has de canviar-ho al fitxer
    ExternalConfigurationService.ts!
    La comanda per engegar el backend-core és: SPRING_PROFILES_ACTIVE=dev ./gradlew bootRun
    (Tal cual després de fer el git clone, recomanació, fer el clone directament del de sitmun, ja que van fent canvis)
  */


  /*
    El columnDefs correspon a les columnes que tindrà la taula (a cada component serà diferent suposo).
    El checkboxSelection es necessari que ho posem al primer element de la columna, per tal de poder seleccionar més d'una fila,
    això serà necessari pel remove! No ho puc posar des del component pqe em posa un check a cada columna
    El passarem al component del dataGrid a través de l'html!
  */
  
 columnDefs = [
  { field: 'id', checkboxSelection: true,},
  { field: 'description' },
  { field: 'name'},
  { field: 'estat'},
];

  constructor(private http: HttpClient,
              public roleService: RoleService,
              ) {

  }
  
  ngOnInit(): void {
    
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
    console.log("Crear nou objecte!");
  }

  applyChanges( data: Role[])
  {
    console.log(data);
  }

}

