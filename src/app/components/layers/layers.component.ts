import { Component, OnInit } from '@angular/core';
import { Connection } from 'dist/sitmun-frontend-core/connection/connection.model';
import { CartographyService } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit {


  columnDefs: any[];
  public frameworkComponents = {
    btnEditRendererComponent: BtnEditRenderedComponent
  };

    constructor(public cartographyService: CartographyService,
                private utils: UtilsService,
                private router: Router,
                ) {

    }

     ngOnInit()  {
      this.columnDefs = [
        {
          headerName: '',
          field: 'id',
          checkboxSelection: true,
          headerCheckboxSelection: true,
          editable: false,
          filter: false,
          width: 65,
          lockPosition:true,
        },
        {
          headerName: '',
          field: 'id',
          editable: false,
          filter: false,
          width: 100,
          lockPosition:true,
          cellRenderer: 'btnEditRendererComponent',
          cellRendererParams: {
            clicked: this.newData.bind(this)
          },
        },
        { headerName: 'ID', field: 'id', editable: false },
        { headerName: this.utils.getTranslate('layersEntity.name'), field: 'name' },
        { headerName: this.utils.getTranslate('layersEntity.source'), field: 'source'}, //service
        { headerName: this.utils.getTranslate('layersEntity.order'), field: 'order'},
        { headerName: this.utils.getTranslate('layersEntity.layers'), field: 'layers'},
        { headerName: this.utils.getTranslate('layersEntity.createdDate'), field: 'createdDate'}, // type: 'dateColumn'
        { headerName: this.utils.getTranslate('layersEntity.minimumScale'), field: 'minimumScale'},
        { headerName: this.utils.getTranslate('layersEntity.maximumScale'), field: 'maximumScale'},
        { headerName: this.utils.getTranslate('layersEntity.metadataURL'), field: 'metadataURL'},
      ];

    }



    /*
    Important! Aquesta és la funció que li passarem al data grid a través de l'html per obtenir les files de la taula,
    de moment no he trobat cap altre manera de que funcioni sense posar la nomenclatura = () =>,
    pel que de moment hem dit de deixar-ho així!
    */
    getAllLayers = () => {

      return this.cartographyService.getAll();
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
      this.router.navigate(['layers', id, 'layersForm']);
    }

    applyChanges( data: Connection[])
    {
      console.log(data);
    }

  }
