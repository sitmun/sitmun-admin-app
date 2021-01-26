import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartographyService, CartographyGroupService, TerritoryService, Territory,Connection,ApplicationService, CartographyGroup, CartographyAvailabilityService,CartographyParameterService } from '@sitmun/frontend-core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { map } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DialogFormComponent, DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-layers-form',
  templateUrl: './layers-form.component.html',
  styleUrls: ['./layers-form.component.scss']
})
export class LayersFormComponent implements OnInit {

  //Form
  private parametersUrl: string;
  layerForm: FormGroup;
  layerToEdit;
  layerID = -1;
  dataLoaded: Boolean = false;
  geometryTypes: Array<any> = [];
  legendTypes: Array<any> = [];

  parameterFormatTypes: Array<any> = [];
  parameterTypes: Array<any> = [];

  //Grids
  themeGrid: any = environment.agGridTheme;
  columnDefsParameters: any[];
  getAllElementsEventParameters: Subject<boolean> = new Subject <boolean>();

  columnDefsSpatialConfigurations: any[];
  getAllElementsEventSpatialConfigurations: Subject<boolean> = new Subject <boolean>();

  columnDefsTerritories: any[];
  getAllElementsEventTerritories: Subject<boolean> = new Subject <boolean>();


  columnDefsLayersConfiguration: any[];
  getAllElementsEventLayersConfigurations: Subject<boolean> = new Subject <boolean>();

  columnDefsNodes: any[];
  getAllElementsEventNodes: Subject<boolean> = new Subject <boolean>();


  //Dialog
  columnDefsParametersDialog: any[];
  public parameterForm: FormGroup;
  addElementsEventParameters: Subject<any[]> = new Subject <any[]>();
  @ViewChild('newParameterDialog',{
    static: true
  }) private newParameterDialog: TemplateRef <any>;

  columnDefsCartographyGroupsDialog: any[];
  addElementsEventCartographyGroups: Subject<any[]> = new Subject <any[]>();

  columnDefsSpatialSelectionDialog: any[];  
  addElementsEventSpatialConfigurations: Subject<any[]> = new Subject <any[]>();

  columnDefsTerritoriesDialog: any[];
  addElementsEventTerritories: Subject<any[]> = new Subject <any[]>();

  columnDefsNodesDialog: any[];
  addElementsEventNodes: Subject<any[]> = new Subject <any[]>();

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cartographyService: CartographyService,
    private cartographyGroupService: CartographyGroupService,
    private cartograhyAvailabilityService: CartographyAvailabilityService,
    private cartographyParameterService: CartographyParameterService,
    private territoryService: TerritoryService,
    private http: HttpClient,
    private utils: UtilsService
  ) {
    this.initializeLayersForm();
    this.initializeParameterForm();

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
              serviceName: this.layerToEdit.serviceName,
              layers: this.layerToEdit.layers,
              minimumScale: this.layerToEdit.minimumScale,
              maximumScale: this.layerToEdit.maximumScale,
              geometryType: this.layerToEdit.geometryType,
              order: this.layerToEdit.order,
              transparency: this.layerToEdit.transparency,
              metadataURL: this.layerToEdit.metadataURL,
              legendType: this.layerToEdit.legendType,
              description: this.layerToEdit.description,
              datasetURL: this.layerToEdit.datasetURL, //here
              municipalFilterFields: "",
              filterInfoByMunicipality: false,
              filterSpatialSeleciontByMunicipality: false,
              information: false,
              defaultInformation: false,
              informationLayer: "",
              thematic: false,
              blocked: this.layerToEdit.blocked,
              //force to false
              queryableFeatureEnabled: false,
              queryableFeatureAvailable: false,
              _links: this.layerToEdit._links
            });


            this.dataLoaded = true;

          },
          error => {

          }
        );
      }
      else{
        this.layerForm.patchValue({
          blocked: false,
        })
      }

    },
      error => {

      });


  }

  ngOnInit(): void {

    let geometryTypeByDefault = {
      value: null,
      description: '-------'
    }
    this.geometryTypes.push(geometryTypeByDefault);

    this.utils.getCodeListValues('cartography.geometryType').subscribe(
      resp => {
        this.geometryTypes.push(...resp);
      }
    );

    let legendTypeByDefault = {
      value: null,
      description: '-------'
    }
    this.legendTypes.push(legendTypeByDefault);

    this.utils.getCodeListValues('cartography.legendType').subscribe(
      resp => {
        this.legendTypes.push(...resp);
      }
    );

    this.utils.getCodeListValues('cartographyParameter.type').subscribe(
      resp => {
        this.parameterTypes.push(...resp);
      }
    );

    this.utils.getCodeListValues('cartographyParameter.format').subscribe(
      resp => {
        this.parameterFormatTypes.push(...resp);
      }
    );


    this.columnDefsParameters = [

      environment.selCheckboxColumnDef,
      { headerName: this.utils.getTranslate('layersEntity.field'), field: 'value' },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('layersEntity.format'), field: 'format', },
      { headerName: this.utils.getTranslate('layersEntity.order'), field: 'order' },
      { headerName: this.utils.getTranslate('layersEntity.type'), field: 'type' },
      { headerName: this.utils.getTranslate('layersEntity.status'), field: 'status' },

    ];

    this.columnDefsSpatialConfigurations = [

      environment.selCheckboxColumnDef,
      { headerName: this.utils.getTranslate('layersEntity.column'), field: 'column' },
      { headerName: this.utils.getTranslate('layersEntity.label'), field: 'label' },
      { headerName: this.utils.getTranslate('layersEntity.type'), field: 'type', },
      { headerName: this.utils.getTranslate('layersEntity.help'), field: 'help' },
      { headerName: this.utils.getTranslate('layersEntity.selectPath'), field: 'selectPath' },
      { headerName: this.utils.getTranslate('layersEntity.status'), field: 'status' },

    ];

    this.columnDefsTerritories = [

      environment.selCheckboxColumnDef,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.code'), field: 'territoryCode', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'territoryName', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.status'), field: 'status', editable: false },

    ];

    this.columnDefsLayersConfiguration = [

      environment.selCheckboxColumnDef,
      { headerName: this.utils.getTranslate('layersEntity.code'), field: 'code' },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('layersEntity.status'), field: 'status' },

    ];

    this.columnDefsNodes = [

      environment.selCheckboxColumnDef,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.code'), field: 'nodeName' },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'description' },
      { headerName: this.utils.getTranslate('layersEntity.createdDate'), field: 'tree', },
      { headerName: this.utils.getTranslate('layersEntity.status'), field: 'status', editable: false },
    ];

    this.columnDefsParametersDialog = [
      environment.selCheckboxColumnDef,
      { headerName: this.utils.getTranslate('layersEntity.field'), field: 'field', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.alias'), field: 'alias', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.format'), field: 'format', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.type'), field: 'type', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.order'), field: 'order', editable: false },
    ];


    this.columnDefsTerritoriesDialog = [
      environment.selCheckboxColumnDef,
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.code'), field: 'code', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'name', editable: false },
    ];

    this.columnDefsSpatialSelectionDialog = [
      environment.selCheckboxColumnDef,
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'name', editable: false },
    ];

    this.columnDefsCartographyGroupsDialog = [
      environment.selCheckboxColumnDef,
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'name', editable: false },
    ];

    this.columnDefsNodesDialog = [
      environment.selCheckboxColumnDef,
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'name', editable: false },
    ];


  }


  getGeometryTypes() {

  }



  initializeLayersForm(): void {

    this.layerForm = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl(null, [
        Validators.required,
      ]),
      serviceName: new FormControl(null),
      layers: new FormControl(null),
      minimumScale: new FormControl(null, []),
      maximumScale: new FormControl(null, []),
      geometryType: new FormControl(null, []),
      order: new FormControl(null, []),
      transparency: new FormControl(null, []),
      metadataURL: new FormControl(null, []),
      legendType: new FormControl(null, []),
      description: new FormControl(null, []),
      datasetURL: new FormControl(null, []),//here
      municipalFilterFields: new FormControl(null, []),
      filterInfoByMunicipality: new FormControl(null, []),
      filterSpatialSeleciontByMunicipality: new FormControl(null, []),
      information: new FormControl(null, []),
      defaultInformation: new FormControl(null, []),
      informationLayer: new FormControl(null, []),
      thematic: new FormControl(null, []),
      blocked: new FormControl(null, []),
      queryableFeatureEnabled: new FormControl(null, []),
      queryableFeatureAvailable: new FormControl(null, []),
      _links: new FormControl(null, []),
    });
  }


  initializeParameterForm(): void {
    this.parameterForm = new FormGroup({
      value: new FormControl(null, []),
      name: new FormControl(null, []),
      format: new FormControl(null, []),
      type: new FormControl(null, []),
      order: new FormControl(null, []),
    })
  }




  // AG-GRID


  // ******** Parameters configuration ******** //
  getAllParameters = (): Observable<any> => {
    if(this.layerID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }
    var urlReq=`${this.layerForm.value._links.parameters.href}`
    if(this.layerForm.value._links.parameters.templated){
      var url=new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection","view")
      urlReq=url.toString();
    }

    return (this.http.get(urlReq))
    .pipe( map( data =>  data['_embedded']['cartography-parameters']));
    
  }

  getAllRowsParameters(data: any[] )
  {
    console.log(data);
    let parameterToSave = [];
    let parameterToDelete = [];
    data.forEach(parameter => {
      if (parameter.status === 'Pending creation' || parameter.status === 'Modified') {
        if(! parameter._links) {
          console.log(this.layerToEdit);
          parameter.cartography=this.layerToEdit;
        } //If is new, you need the service link
          parameterToSave.push(parameter)
      }
      if(parameter.status === 'Deleted') {parameterToDelete.push(parameter) }
    });

    parameterToSave.forEach(saveElement => {

      console.log(saveElement);
      this.cartographyParameterService.save(saveElement).subscribe(
        result => {
          console.log(result)
        }
      )

    });

    parameterToDelete.forEach(deletedElement => {

      this.cartographyParameterService.remove(deletedElement).subscribe(
        result => {
          console.log(result)
        }
      )
      
    });
  }

  // ******** Spatial configuration ******** //
  getAllSpatialConfigurations = (): Observable<any> => {

    // var urlReq=`${this.layerForm.value._links.spatialSelectionConnection.href}`
    // if(this.layerForm.value._links.spatialSelectionConnection.templated){
    //   var url=new URL(urlReq.split("{")[0]);
    //   url.searchParams.append("projection","view")
    //   urlReq=url.toString();
    // }

    // return (this.http.get(urlReq))
    // .pipe( map( data =>  data['_embedded']['cartography-parameters']));

    const aux: Array<any> = [];
    return of(aux);

  }

  getAllRowsSpatialConfiguration(data: any[] )
  {
    let spatialSelectionsModified = [];
    let spatialSelectionsToPut = [];
    data.forEach(spatialSelection => {
      if (spatialSelection.status === 'Modified') {spatialSelectionsModified.push(spatialSelection) }
      if(spatialSelection.status!== 'Deleted') {spatialSelectionsToPut.push(spatialSelection._links.self.href) }
    });

    this.updateSpatialConfiguration(spatialSelectionsModified, spatialSelectionsToPut);
  }

  updateSpatialConfiguration(spatialConfigurationsModified: any[], spatialSelectionsToPut: any[] )
  {
    // const promises: Promise<any>[] = [];
    // spatialConfigurationsModified.forEach(spatialSelection => {
    //   promises.push(new Promise((resolve, reject) => { this.tasksService.update(spatialSelection).toPromise().then((resp) => { resolve() }) }));
    // });
    // Promise.all(promises).then(() => {
      // let url=this.layerToEdit._links.spatialSelectionConnection.href.split('{', 1)[0];
      // this.utils.updateUriList(url,spatialSelectionsToPut)
    // });
  }

  // ******** Territories ******** //
  getAllTerritories = (): Observable<any> => {
    if(this.layerID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.layerForm.value._links.availabilities.href}`
    if (this.layerForm.value._links.availabilities.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['cartography-availabilities']));


  }

  getAllRowsTerritories(data: any[] )
  {
    let territoriesToCreate = [];
    let territoriesToDelete = [];
    data.forEach(territory => {
      territory.cartography= this.layerToEdit;
      if (territory.status === 'Pending creation') {territoriesToCreate.push(territory) }
      if(territory.status === 'Deleted') {territoriesToDelete.push(territory) }
    });

    territoriesToCreate.forEach(newElement => {

      this.cartograhyAvailabilityService.save(newElement).subscribe(
        result => {
          console.log(result)
        }
      )

    });

    territoriesToDelete.forEach(deletedElement => {

      this.cartograhyAvailabilityService.remove(deletedElement).subscribe(
        result => {
          console.log(result)
        }
      )
      
    });
      //  console.log(territoriesModified);
      //  this.updateTerritories(territoriesModified, territoriesToPut);
  }

  updateTerritories(territoriesModified: Territory[], territoriesToPut: Territory[])
  {
    const promises: Promise<any>[] = [];
    territoriesModified.forEach(territory => {
      promises.push(new Promise((resolve, reject) => { this.territoryService.update(territory).toPromise().then((resp) => { resolve() }) }));
    });
    Promise.all(promises).then(() => {
      let url=this.layerToEdit._links.availabilities.href.split('{', 1)[0];
      this.utils.updateUriList(url,territoriesToPut)
    });
  }
  

  // ******** Layers configuration ******** //
  getAllLayersConfiguration = (): Observable<any> => {
    const aux: Array<any> = [];
    return of(aux);

  //   var urlReq = `${this.layerForm.value._links.availabilities.href}`
  //   if (this.layerForm.value._links.availabilities.templated) {
  //     var url = new URL(urlReq.split("{")[0]);
  //     url.searchParams.append("projection", "view")
  //     urlReq = url.toString();
  //   }

  //   return (this.http.get(urlReq))
  //     .pipe(map(data => data['_embedded']['cartography-availabilities']));
  }

  getAllRowsLayersConfiguration(data: any[] )
  {
    let layersConfigurationModified = [];
    let layersConfigurationToPut = [];
    data.forEach(layer => {
      if (layer.status === 'Modified') {layersConfigurationModified.push(layer) }
      if(layer.status!== 'Deleted') {layersConfigurationToPut.push(layer._links.self.href) }
    });
    console.log(layersConfigurationModified);
    // this.updateLayersConfigurations(layersConfigurationModified, layersConfigurationToPut);
  }

  updateLayersConfigurations(layersConfigurationModified: CartographyGroup[], layersConfigurationToPut: CartographyGroup[])
  {
    const promises: Promise<any>[] = [];
    layersConfigurationModified.forEach(cartography => {
      promises.push(new Promise((resolve, reject) => { this.cartographyGroupService.update(cartography).toPromise().then((resp) => { resolve() }) }));
    });
    Promise.all(promises).then(() => {
      let url=this.layerToEdit._links.availabilities.href.split('{', 1)[0];
      this.utils.updateUriList(url,layersConfigurationToPut)
    });
  }

  // ******** Nodes configuration ******** //
  getAllNodes = (): Observable<any> => {

    //TODO Change the link when available
    // return (this.http.get(`${this.layerForm.value._links.parameters.href}`))
    // .pipe( map( data =>  data['_embedded']['cartography-parameters']) );
    const aux: Array<any> = [];
    return of(aux);
  }

  getAllRowsNodes(data: any[] )
  {
    let nodesModified = [];
    let nodesToPut = [];
    data.forEach(node => {
      if (node.status === 'Modified') {nodesModified.push(node) }
      if(node.status!== 'Deleted') {nodesToPut.push(node._links.self.href) }
    });
    console.log(nodesModified);
    this.updateNodes(nodesModified, nodesToPut);
  }

  updateNodes(nodesModified: any[], nodesToPut: any[])
  {
    // const promises: Promise<any>[] = [];
    // nodesModified.forEach(territory => {
    //   promises.push(new Promise((resolve, reject) => { this.territoryService.update(territory).toPromise().then((resp) => { resolve() }) }));
    // });
    // Promise.all(promises).then(() => {
    //   let url=this.layerToEdit._links.availabilities.href.split('{', 1)[0];
    //   this.utils.updateUriList(url,nodesToPut)
    // });
  }

  // ******** Parameters Dialog  ******** //

  getAllParametersDialog = () => {
    const aux: Array<any> = [];
    return of(aux);
    // return this.cartographyService.getAll();
  }

  openParametersDialog(data: any) {

    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived=this.newParameterDialog;
    dialogRef.componentInstance.title=this.utils.getTranslate('layersEntity.parametersConfiguration');



    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if( result.event==='Add') { 
          let item= this.parameterForm.value;
          this.addElementsEventParameters.next([item])
          console.log(this.parameterForm.value)
          this.parameterForm.reset();
        }
      }
    });

  }

  // ******** Spatial Selection Dialog  ******** //

  getAllSpatialSelectionDialog = () => {
    const aux: Array<any> = [];
    return of(aux);
    // return this.cartographyService.getAll();
  }

  openSpatialSelectionDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [this.getAllSpatialSelectionDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsSpatialSelectionDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('layersEntity.spatialSelection');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.nonEditable = false;



  dialogRef.afterClosed().subscribe(result => {
    if(result){
      if( result.event==='Add') { 
        this.addElementsEventSpatialConfigurations.next(result.data[0])
      }
    }

    });

  }

  // ******** Territory Dialog  ******** //

  getAllTerritoriesDialog = () => {
    return this.territoryService.getAll();
  }

  openTerritoriesDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [this.getAllTerritoriesDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTerritoriesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('layersEntity.territory');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if( result.event==='Add') { 
          this.addElementsEventTerritories.next(this.adaptFormatTerritories(result.data[0]))
        }
      }

    });

  }

  adaptFormatTerritories(dataToAdapt: Territory[])
  {
    let newData: any[] = [];
    
    dataToAdapt.forEach(element => {
      let item = {
        id: null,
        territoryCode: element.code,
        territoryName: element.name,
        createdDate: element.createdDate,
        owner: null,
        territory: element,
      }
      newData.push(item);
      
    });

    return newData;
  }

  // ******** Cartography Groups Dialog  ******** //

  getAllCartographyGroupsDialog = () => {
    return this.cartographyGroupService.getAll();
  }

  openCartographyGroupsDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [this.getAllCartographyGroupsDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsCartographyGroupsDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('layersEntity.permissiongroupLayersConfiguration');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if( result.event==='Add') { 
          console.log('result.data[0]');
          this.addElementsEventCartographyGroups.next(result.data[0])
        }
      }

    });

  }

  // ******** Nodes Dialog  ******** //

  getAllNodesDialog = () => {
    const aux: Array<any> = [];
    return of(aux);
    // return this.cartographyService.getAll();
  }

  openNodesDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [this.getAllNodesDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsNodesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('layersEntity.nodes');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if( result.event==='Add') { 
          this.addElementsEventNodes.next(result.data[0])
        }
      }

    });

  }

    //Save Button
  
    onSaveButtonClicked(){
  
      this.cartographyService.save(this.layerForm.value)
      .subscribe(resp => {
        console.log(resp);
        this.layerToEdit=resp;
        this.getAllElementsEventParameters.next(true);
        // this.getAllElementsEventSpatialConfigurations.next(true);
        this.getAllElementsEventTerritories.next(true);
        // this.getAllElementsEventLayersConfigurations.next(true);
        // this.getAllElementsEventNodes.next(true);

      });

  
    }
}