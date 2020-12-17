import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartographyService, TerritoryService, Territory } from 'dist/sitmun-frontend-core/';
import { Connection } from 'dist/sitmun-frontend-core/connection/connection.model';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-layers-form',
  templateUrl: './layers-form.component.html',
  styleUrls: ['./layers-form.component.scss']
})
export class LayersFormComponent implements OnInit {

  themeGrid: any = environment.agGridTheme;
  columnDefsParameters: any[];
  columnDefsSpatialConfigurations: any[];
  columnDefsTerritories: any[];
  columnDefsLayersConfiguration: any[];
  columnDefsNodes: any[];
  dataLoaded: Boolean = false;


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
    this.initializeLayersForm();

    this.activatedRoute.params.subscribe(params => {
      this.layerID = +params.id;
      if (this.layerID !== -1) {
        this.cartographyService.get(this.layerID).subscribe(
          resp => {
            console.log(resp);
            this.layerToEdit = resp;
            this.parametersUrl = this.layerToEdit._links.parameters.href;
            this.layerForm.setValue({
              id: this.layerID,
              name: this.layerToEdit.name,
              source: this.layerToEdit.source,
              minimumScale: this.layerToEdit.minimumScale,
              maximumScale: this.layerToEdit.maximumScale,
              geometryType: this.layerToEdit.geometryType,
              order: this.layerToEdit.order,
              transparency: this.layerToEdit.transparency,
              metadataURL: this.layerToEdit.metadataURL,
              legendType: this.layerToEdit.legendType,
              description: this.layerToEdit.description,
              datasetURL: this.layerToEdit.datasetURL,
              _links: this.layerToEdit._links
            });

            this.dataLoaded = true;

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



    this.columnDefsParameters = [

      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 45,
        lockPosition: true,
      },
      { headerName: this.utils.getTranslate('layersEntity.field'), field: 'field' },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('layersEntity.format'), field: 'format', },
      { headerName: this.utils.getTranslate('layersEntity.order'), field: 'order' },
      { headerName: this.utils.getTranslate('layersEntity.type'), field: 'type' },

    ];

    this.columnDefsSpatialConfigurations = [

      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 45,
        lockPosition: true,
      },
      { headerName: this.utils.getTranslate('layersEntity.column'), field: 'column' },
      { headerName: this.utils.getTranslate('layersEntity.label'), field: 'label' },
      { headerName: this.utils.getTranslate('layersEntity.type'), field: 'type', },
      { headerName: this.utils.getTranslate('layersEntity.help'), field: 'help' },
      { headerName: this.utils.getTranslate('layersEntity.selectPath'), field: 'selectPath' },

    ];

    this.columnDefsTerritories = [

      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 25,
        lockPosition: true,
      },
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.code'), field: 'code' },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'name' },

    ];

    this.columnDefsLayersConfiguration = [

      {
        headerName: '',
    
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 25,
        lockPosition: true,
      },
      { headerName: this.utils.getTranslate('layersEntity.code'), field: 'code' },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'name' },

    ];

    this.columnDefsNodes = [

      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        editable: false,
        filter: false,
        width: 45,
        lockPosition: true,
      },
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.code'), field: 'nodeName' },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'description' },
      { headerName: this.utils.getTranslate('layersEntity.createdDate'), field: 'tree', },
    ];

  }

  initializeLayersForm(): void {

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


  // ******** Parameters configuration ******** //
  getAllParameters = (): Observable<any> => {
    return (this.http.get(`${this.layerForm.value._links.parameters.href}`))
      .pipe(map(data => data['_embedded']['cartography-parameters']));
  }

  removeDataParameters(data: Territory[]) {
    console.log(data);
  }

  newDataParameters(id: any) {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }

  // ******** Spatial configuration ******** //
  getAllSpatialConfigurations = (): Observable<any> => {
    //TODO Change the link when available
    // return (this.http.get(`${this.layerForm.value._links.parameters.href}`))
    // .pipe( map( data =>  data['_embedded']['cartography-parameters']) );
    const aux: Array<any> = [];
    return of(aux);
  }

  removeDataSpatialConfigurations(data: Territory[]) {
    console.log(data);
  }

  newDataSpatialConfigurations(id: any) {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }

  // ******** Territories ******** //
  getAllTerritories = (): Observable<any> => {
    //TODO Change the link when available
    // return (this.http.get(`${this.layerForm.value._links.parameters.href}`))
    // .pipe( map( data =>  data['_embedded']['cartography-parameters']) );
    const aux: Array<any> = [];
    return of(aux);
  }

  removeDataTerritories(data: Territory[]) {
    console.log(data);
  }

  newDataTerritories(id: any) {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }

  // ******** Layers configuration ******** //
  getAllLayersConfiguration = (): Observable<any> => {
    //TODO Change the link when available
    // return (this.http.get(`${this.layerForm.value._links.parameters.href}`))
    // .pipe( map( data =>  data['_embedded']['cartography-parameters']) );
    const aux: Array<any> = [];
    return of(aux);
  }

  removeDataLayersConfiguration(data: Territory[]) {
    console.log(data);
  }

  newDataLayersConfiguration(id: any) {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }

  // ******** Nodes configuration ******** //
  getAllNodes = (): Observable<any> => {
    //TODO Change the link when available
    // return (this.http.get(`${this.layerForm.value._links.parameters.href}`))
    // .pipe( map( data =>  data['_embedded']['cartography-parameters']) );
    const aux: Array<any> = [];
    return of(aux);
  }

  removeDataNodes(data: Territory[]) {
    console.log(data);
  }

  newDataNodes(id: any) {
    // this.router.navigate(['territory', id, 'territoryForm']);
    console.log('screen in progress');
  }

}