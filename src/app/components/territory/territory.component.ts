import { Component, OnInit } from '@angular/core';
import { Territory } from 'dist/sitmun-frontend-core/territory/territory.model';
import { TerritoryService } from 'dist/sitmun-frontend-core/';
import { UtilsService } from '../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';
import { Router } from '@angular/router';


@Component({
  selector: 'app-territory',
  templateUrl: './territory.component.html',
  styleUrls: ['./territory.component.scss']
})
export class TerritoryComponent implements OnInit {

  columnDefs: any[];
  public frameworkComponents = {
    btnEditRendererComponent: BtnEditRenderedComponent
  };


  constructor(public territoryService: TerritoryService,
              private utils: UtilsService,
              private router: Router,
              )
              { }


  ngOnInit()  {

    this.columnDefs = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 105,
        lockPosition:true,
      },
      {
        headerName: '',
        field: 'id',
        editable: false,
        filter: false,
        width: 120,
        lockPosition:true,
        cellRenderer: 'btnEditRendererComponent',
        cellRendererParams: {
          clicked: this.newData.bind(this)
        },
      },
      { headerName: 'ID',  field: 'id', editable: false},
      { headerName: this.utils.getTranslate('territoryEntity.code'),  field: 'code' },
      { headerName: this.utils.getTranslate('territoryEntity.name'),  field: 'name'},
      { headerName: this.utils.getTranslate('territoryEntity.scope'),  field: 'scope'},
      { headerName: this.utils.getTranslate('territoryEntity.createdDate'),  field: 'createdDate', }, // type: 'dateColumn'
      { headerName: this.utils.getTranslate('territoryEntity.administrator'),  field: 'territorialAuthorityName'},
      { headerName: this.utils.getTranslate('territoryEntity.email'),  field: 'territorialAuthorityEmail'},
      { headerName: this.utils.getTranslate('territoryEntity.address'),  field: 'territorialAuthorityAddress'},
      { headerName: this.utils.getTranslate('territoryEntity.extent'),  field: 'extent'},
      { headerName: this.utils.getTranslate('territoryEntity.note'),  field: 'note'},
      { headerName: this.utils.getTranslate('territoryEntity.blocked'),  field: 'blocked'},
    ];
  }


    /*
    Important! Aquesta és la funció que li passarem al data grid a través de l'html per obtenir les files de la taula,
    de moment no he trobat cap altre manera de que funcioni sense posar la nomenclatura = () =>,
    pel que de moment hem dit de deixar-ho així!
  */
  getAllTerritories = () => {
    return this.territoryService.getAll();
  }

  /*Les dues funcions que venen ara s'activaran quan es cliqui el botó de remove o el de new a la taula,
    si volguessim canviar el nom de la funció o qualsevol cosa, cal mirar l'html, allà es on es crida la funció
    corresponent!
  */

removeData( data: Territory[])
{
  console.log(data);
}

newData(id: any)
{
  this.router.navigate(['territory', id, 'territoryForm']);
}

applyChanges( data: Territory[])
{
      console.log(data);
}

}
