import { Component, OnInit } from '@angular/core';
import { Connection } from 'dist/sitmun-frontend-core/connection/connection.model';
import { CartographyGroupService } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';
import { Router } from '@angular/router';


@Component({
  selector: 'app-layers-permits',
  templateUrl: './layers-permits.component.html',
  styleUrls: ['./layers-permits.component.scss']
})
export class LayersPermitsComponent implements OnInit {


  columnDefs: any[];
  public frameworkComponents = {
    btnEditRendererComponent: BtnEditRenderedComponent
  };

    constructor(public cartographyGroupService: CartographyGroupService,
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
          width: 30,
          lockPosition:true,
        }, 
        {
          headerName: '',
          field: 'id',
          editable: false,
          filter: false,
          width: 35,
          lockPosition:true,
          cellRenderer: 'btnEditRendererComponent',
          cellRendererParams: {
            clicked: this.newData.bind(this)
          }, 
        },
        { headerName: 'ID', field: 'id', editable: false },
        { headerName: this.utils.getTranslate('layersPermitsEntity.name'), field: 'name' },
        { headerName: this.utils.getTranslate('layersPermitsEntity.type'), field: 'type'},
      ];

    }



    /*
    Important! Aquesta és la funció que li passarem al data grid a través de l'html per obtenir les files de la taula,
    de moment no he trobat cap altre manera de que funcioni sense posar la nomenclatura = () =>,
    pel que de moment hem dit de deixar-ho així!
    */
    getAllLayersPermits = () => {

      return this.cartographyGroupService.getAll();
    }

    /*Les dues funcions que venen ara s'activaran quan es cliqui el botó de remove o el de new a la taula,
      si volguessim canviar el nom de la funció o qualsevol cosa, cal mirar l'html, allà es on es crida la funció
      corresponent!
    */

    removeData( data: Connection[])
    {
      console.log(data);
    }

    newData(id: any)
    {
      this.router.navigate(['layersPermits', id, 'layersPermitsForm']);
    }

    applyChanges( data: Connection[])
    {
      console.log(data);
    }

  }
