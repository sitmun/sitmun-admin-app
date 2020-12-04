import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import {  ActivatedRoute, Router } from '@angular/router';
import { CartographyService, TerritoryService, Territory } from 'dist/sitmun-frontend-core/';
import { Connection } from 'dist/sitmun-frontend-core/connection/connection.model';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-layers-form',
  templateUrl: './layers-form.component.html',
  styleUrls: ['./layers-form.component.scss']
})
export class LayersFormComponent implements OnInit {

  columnDefs: any[];
  public frameworkComponents = {
    btnEditRendererComponent: BtnEditRenderedComponent
  };
  private parametersUrl: string;

  layerForm: FormGroup;
  layerToEdit;
  layerID = -1;


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cartographyService: CartographyService,
    private territoryService: TerritoryService,
    private http: HttpClient,
    private utils: UtilsService,
    ) {
        this.initializeConnectionForm();

        this.activatedRoute.params.subscribe(params => {
          this.layerID = +params.id;
          if (this.layerID !== -1){
            this.cartographyService.get(this.layerID).subscribe(
              resp => {
                console.log(resp);
                this.layerToEdit = resp;
                this.parametersUrl = this.layerToEdit._links.parameters.href;
                this.layerForm.setValue({
                    id:       this.layerID,
                    name:     this.layerToEdit.name,
                    source:   this.layerToEdit.source,
                    minimumScale:     this.layerToEdit.minimumScale,
                    maximumScale: this.layerToEdit.maximumScale,
                    geometryType:      this.layerToEdit.geometryType,
                    order:      this.layerToEdit.order,
                    transparency:      this.layerToEdit.transparency,
                    metadataURL:      this.layerToEdit.metadataURL,
                    legendType:      this.layerToEdit.legendType,
                    description:      this.layerToEdit.description,
                    datasetURL:      this.layerToEdit.datasetURL,
                    _links:   this.layerToEdit._links
                  });


              },
              error => {

              }
            );
          }

        },
        error => {

        });


    }

  ngOnInit(): void {



    this.columnDefs = [

      { headerName: 'ID',  field: 'id', editable: false},
      { headerName: this.utils.getTranslate('layersEntity.code'),  field: 'code' },
      { headerName: this.utils.getTranslate('layersEntity.name'),  field: 'name'},
      { headerName: this.utils.getTranslate('layersEntity.createdDate'),  field: 'format', },
      { headerName: this.utils.getTranslate('layersEntity.administrator'),  field: 'order'},

    ];

  }

  initializeConnectionForm(): void {

    this.layerForm = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl(null, [
        Validators.required,
      ]),
      source: new FormControl(null),
      minimumScale: new FormControl(null, []),
      maximumScale: new FormControl(null, []),
      geometryType: new FormControl(null, []),
      order: new FormControl(null, []),
      transparency: new FormControl(null, []),
      metadataURL: new FormControl(null, []),
      legendType: new FormControl(null, []),
      description: new FormControl(null, []),
      datasetURL: new FormControl(null, []),
      _links: new FormControl(null, []),
    });

  }



  addNewLayer() {
    this.cartographyService.create(this.layerForm.value)
      .subscribe(resp => {
        console.log(resp);
        // this.router.navigate(["/company", resp.id, "formConnection"]);
      });


  }

  updateLayer() {
    this.cartographyService.update(this.layerForm.value)
      .subscribe(resp => {
        console.log(resp);

      });

  }


  // AG-GRID

      /*
    Important! Aquesta és la funció que li passarem al data grid a través de l'html per obtenir les files de la taula,
    de moment no he trobat cap altre manera de que funcioni sense posar la nomenclatura = () =>,
    pel que de moment hem dit de deixar-ho així!
  */
   getAllParameters = (): Observable<any> => {
    return (this.http.get(`http://localhost:8080/api/cartographies/${this.layerID}/parameters`))
    .pipe( map( data =>  data['_embedded']['cartography-parameters']) );
  }

  /*Les dues funcions que venen ara s'activaran quan es cliqui el botó de remove o el de new a la taula,
    si volguessim canviar el nom de la funció o qualsevol cosa, cal mirar l'html, allà es on es crida la funció
    corresponent!
  */

  removeDataParameters( data: Territory[])
  {
  console.log(data);
  }

  newDataParameters(id: any)
  {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }

}




