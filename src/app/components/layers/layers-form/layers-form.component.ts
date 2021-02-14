import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartographyService, ServiceService, CartographyFilterService, TerritoryTypeService, ConnectionService, TreeNodeService, CartographyGroupService, TerritoryService, Territory, Connection, ApplicationService, CartographyGroup, CartographyAvailabilityService, CartographyParameterService, HalParam, HalOptions, Cartography } from 'dist/sitmun-frontend-core/';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { map } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { DialogFormComponent, DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';
import { iterateExtend } from '@syncfusion/ej2-angular-grids';

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
  services: Array<any> = [];
  spatialConfigurationServices: Array<any> = [];
  spatialConfigurationConnections: Array<any> = [];
  filterTypes: Array<any> = [];
  filterValueTypes: Array<any> = [];
  filterTypeIds: Array<any> = [];
  currentService;

  parameterFormatTypes: Array<any> = [];
  parameterTypes: Array<any> = [];



  //Grids
  themeGrid: any = config.agGridTheme;
  columnDefsParameters: any[];
  getAllElementsEventParameters: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEventParameters: Subject<boolean> = new Subject<boolean>();

  columnDefsSpatialConfigurations: any[];
  getAllElementsEventSpatialConfigurations: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEventSpatialConfigurations: Subject<boolean> = new Subject<boolean>();

  columnDefsTerritorialFilter: any[];
  getAllElementsTerritorialFilter: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEventTerritorialFilter: Subject<boolean> = new Subject<boolean>();


  columnDefsTerritories: any[];
  getAllElementsEventTerritories: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEventTerritories: Subject<boolean> = new Subject<boolean>();

  columnDefsLayersConfiguration: any[];
  getAllElementsEventLayersConfigurations: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEventLayersConfiguration: Subject<boolean> = new Subject<boolean>();

  columnDefsNodes: any[];
  getAllElementsEventNodes: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEventNodes: Subject<boolean> = new Subject<boolean>();


  //Dialog
  columnDefsParametersDialog: any[];
  public parameterForm: FormGroup;
  addElementsEventParameters: Subject<any[]> = new Subject<any[]>();
  @ViewChild('newParameterDialog', {
    static: true
  }) private newParameterDialog: TemplateRef<any>;

  @ViewChild('newSpatialConfigurationDialog', {
    static: true
  }) private newSpatialConfigurationDialog: TemplateRef<any>;

  @ViewChild('newTerritorialFilterDialog', {
    static: true
  }) private newTerritorialFilterDialog: TemplateRef<any>;

  columnDefsCartographyGroupsDialog: any[];
  addElementsEventCartographyGroups: Subject<any[]> = new Subject<any[]>();

  addElementsEventSpatialConfigurations: Subject<any[]> = new Subject<any[]>();

  public territorialFilterForm: FormGroup;
  addElementsTerritorialFilter: Subject<any[]> = new Subject<any[]>();

  columnDefsTerritoriesDialog: any[];
  addElementsEventTerritories: Subject<any[]> = new Subject<any[]>();

  columnDefsNodesDialog: any[];
  addElementsEventNodes: Subject<any[]> = new Subject<any[]>();

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cartographyService: CartographyService,
    private connectionService: ConnectionService,
    private serviceService: ServiceService,
    private cartographyGroupService: CartographyGroupService,
    private cartograhyAvailabilityService: CartographyAvailabilityService,
    private cartographyParameterService: CartographyParameterService,
    private cartographyFilterService: CartographyFilterService,
    private treeNodeService: TreeNodeService,
    private territoryService: TerritoryService,
    private territoryTypeService: TerritoryTypeService,
    private http: HttpClient,
    public utils: UtilsService
  ) {
    this.initializeLayersForm();
    this.initializeParameterForm();
    this.initializeTerritorialFilterForm();

  }

  ngOnInit(): void {

    let geometryTypeByDefault = {
      value: -1,
      description: '-------'
    }
    this.geometryTypes.push(geometryTypeByDefault);

    const promises: Promise<any>[] = [];

    promises.push(new Promise((resolve, reject) => {
      this.utils.getCodeListValues('cartography.geometryType').subscribe(
        resp => {
          this.geometryTypes.push(...resp);
          resolve(true);
        }
      )
    }));

    let legendTypeByDefault = {
      value: -1,
      description: '-------'
    }
    this.legendTypes.push(legendTypeByDefault);

    promises.push(new Promise((resolve, reject) => {
      this.utils.getCodeListValues('cartography.legendType').subscribe(
        resp => {
          this.legendTypes.push(...resp);
          resolve(true);
        }
      )
    }));


    promises.push(new Promise((resolve, reject) => {
      this.utils.getCodeListValues('cartographyParameter.type').subscribe(
        resp => {
          this.parameterTypes.push(...resp);
          resolve(true);
        }
      )
    }));

    promises.push(new Promise((resolve, reject) => {
      this.utils.getCodeListValues('cartographyFilter.type').subscribe(
        resp => {
          this.filterTypes.push(...resp);
          resolve(true);
        }
      )
    }));

    let valueTypeByDefault = {
      value: null,
      description: '-------'
    }
    this.filterValueTypes.push(valueTypeByDefault);

    promises.push(new Promise((resolve, reject) => {
      this.utils.getCodeListValues('cartographyFilter.valueType').subscribe(
        resp => {
          this.filterValueTypes.push(...resp);
          resolve(true);
        }
      )
    }));

    let typeIdByDefault = {
      id: -1,
      name: '-------'
    }
    this.filterTypeIds.push(typeIdByDefault);

    promises.push(new Promise((resolve, reject) => {
      this.territoryTypeService.getAll().subscribe(
        resp => {
          this.filterTypeIds.push(...resp);
          resolve(true);
        }
      )
    }));


    promises.push(new Promise((resolve, reject) => {
      this.utils.getCodeListValues('cartographyParameter.format').subscribe(
        resp => {
          this.parameterFormatTypes.push(...resp);
          resolve(true);
        }
      )
    }));

    let connectionByDefault = {
      value: null,
      name: '-------'
    }

    this.spatialConfigurationConnections.push(connectionByDefault);

    promises.push(new Promise((resolve, reject) => {
      this.connectionService.getAll().subscribe(
        resp => {
          this.spatialConfigurationConnections.push(...resp)
          resolve(true);
        }
      )
    }));

    let serviceByDefault = {
      id: -1,
      name: '-------'
    }

    this.spatialConfigurationServices.push(serviceByDefault);

    promises.push(new Promise((resolve, reject) => {
      this.serviceService.getAll().map((resp) => {
        let wfsServices = [];
        this.services.push(...resp);
        resp.forEach(service => {
          if (service.type === 'WFS') { wfsServices.push(service) }
        });
        console.log(this.services);
        this.spatialConfigurationServices.push(...wfsServices)
        resolve(true);
      }).subscribe()
    }));

    Promise.all(promises).then(() => {
      console.log(this.spatialConfigurationServices);
      this.activatedRoute.params.subscribe(params => {
        this.layerID = +params.id;
        if (this.layerID !== -1) {

          //getCartography Entity
          this.cartographyService.get(this.layerID).subscribe(
            resp => {
              console.log(resp);
              this.layerToEdit = resp;
              this.parametersUrl = this.layerToEdit._links.parameters.href;
              this.layerForm.setValue({
                id: this.layerID,
                name: this.layerToEdit.name,
                service: this.layerToEdit.serviceId,
                layers: this.layerToEdit.layers,
                minimumScale: this.layerToEdit.minimumScale,
                maximumScale: this.layerToEdit.maximumScale,
                geometryType: this.layerToEdit.geometryType,
                order: this.layerToEdit.order,
                transparency: this.layerToEdit.transparency,
                metadataURL: this.layerToEdit.metadataURL,
                legendType: this.layerToEdit.legendType,
                legendUrl: this.layerToEdit.legendURL,
                description: this.layerToEdit.description,
                datasetURL: this.layerToEdit.datasetURL, //here
                applyFilterToGetMap: this.layerToEdit.applyFilterToGetMap,
                applyFilterToGetFeatureInfo: this.layerToEdit.applyFilterToGetFeatureInfo,
                applyFilterToSpatialSelection: this.layerToEdit.applyFilterToSpatialSelection,
                queryableFeatureEnabled: this.layerToEdit.queryableFeatureEnabled,
                queryableFeatureAvailable: this.layerToEdit.queryableFeatureAvailable,
                queryableLayers: this.layerToEdit.queryableLayers,
                thematic: this.layerToEdit.thematic,
                blocked: this.layerToEdit.blocked,
                selectableFeatureEnabled: this.layerToEdit.selectableFeatureEnabled,
                spatialSelectionService: this.layerToEdit.spatialSelectionServiceId,
                selectableLayers: this.layerToEdit.selectableLayers,
                spatialSelectionConnection: "",
                _links: this.layerToEdit._links
              });

              if (this.layerToEdit.spatialSelectionServiceId == null) {
                this.layerForm.patchValue({
                  spatialSelectionService: this.spatialConfigurationServices[0].id
                })
              }
              if (this.layerToEdit.legendType == null) {
                this.layerForm.patchValue({
                  legendType: this.legendTypes[0].value
                })
              }
              if (this.layerToEdit.geometryType == null) {
                this.layerForm.patchValue({
                  geometryType: this.geometryTypes[0].value
                })
              }


              var urlReq = `${this.layerToEdit._links.parameters.href}`
              if (this.layerToEdit._links.parameters.templated) {
                var url = new URL(urlReq.split("{")[0]);
                url.searchParams.append("projection", "view")
                urlReq = url.toString();
              }


              this.http.get(urlReq).pipe(
                map(data => data['_embedded']['cartography-parameters'].filter(elem => elem.type == "FILTRO" || elem.type == "FILTRO_INFO" || elem.type == "FILTRO_ESPACIAL")
                ))
                .subscribe(result => {
                  console.log(result)
                  result.forEach(element => {

                    if (element.type === 'FILTRO') {
                      this.layerForm.patchValue({
                        applyFilterToGetMap: element.value
                      })
                    }
                    else if (element.type === 'FILTRO_INFO') {
                      this.layerForm.patchValue({
                        applyFilterToGetFeatureInfo: element.value
                      })
                    }
                    else if (element.type === 'FILTRO_ESPACIAl') {
                      this.layerForm.patchValue({
                        applyFilterToSpatialSelection: element.value
                      })
                    }
                  });


                  if ((!this.layerForm.value.applyFilterToGetFeatureInfo && !this.layerForm.value.applyFilterToSpatialSelection)) {
                    { this.layerForm.get('applyFilterToGetMap').disable(); }
                  }
                });

              if (!this.layerToEdit.thematic) { this.layerForm.get('geometryType').disable(); }

              if (!this.layerToEdit.selectableFeatureEnabled) {
                this.layerForm.get('spatialSelectionService').disable();
                this.layerForm.get('selectableLayers').disable();
              }

              this.dataLoaded = true;

            },
            error => {

            }
          );
          //Get cartography parameters, we need to put on municipally filter for example


        }
        else {
          this.layerForm.patchValue({
            blocked: false,
            thematic: false,
            service: this.services[0].id,
            spatialSelectionService: this.spatialConfigurationServices[0].id,
            geometryType: this.geometryTypes[0].value,
            legendType: this.legendTypes[0].value,
          })
          this.layerForm.get('geometryType').disable();
          this.layerForm.get('applyFilterToGetMap').disable();
          this.layerForm.get('spatialSelectionService').disable();
          this.layerForm.get('selectableLayers').disable();
          this.dataLoaded = true;
        }

      },
        error => {

        });


    });


    this.columnDefsParameters = [

      config.selCheckboxColumnDef,
      { headerName: this.utils.getTranslate('layersEntity.field'), field: 'value' },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'name' },
      {
        headerName: this.utils.getTranslate('layersEntity.format'), editable: false,
        valueGetter: (params) => {
          var alias = this.parameterFormatTypes.filter((format) => format.value == params.data.format)[0];
          return alias != undefined ? alias.description : params.data.format
        }
      },
      { headerName: this.utils.getTranslate('layersEntity.order'), field: 'order' },
      { headerName: this.utils.getTranslate('layersEntity.type'), field: 'type' },
      { headerName: this.utils.getTranslate('layersEntity.status'), field: 'status', editable: false },

    ];


    this.columnDefsSpatialConfigurations = [

      config.selCheckboxColumnDef,
      { headerName: this.utils.getTranslate('layersEntity.column'), field: 'name' },
      { headerName: this.utils.getTranslate('layersEntity.label'), field: 'value' },
      {
        headerName: this.utils.getTranslate('layersEntity.format'), editable: false,
        valueGetter: (params) => {
          var alias = this.parameterFormatTypes.filter((format) => format.value == params.data.format)[0];
          return alias != undefined ? alias.description : params.data.format
        }
      },
      { headerName: this.utils.getTranslate('layersEntity.status'), field: 'status', editable: false },

    ];

    this.columnDefsTerritorialFilter = [

      config.selCheckboxColumnDef,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('layersEntity.type'), field: 'type' },
      { headerName: this.utils.getTranslate('layersEntity.valueType'), field: 'valueType' },
      { headerName: this.utils.getTranslate('layersEntity.column'), field: 'column' },
      { headerName: this.utils.getTranslate('layersEntity.status'), field: 'status', editable: false },

    ];

    this.columnDefsTerritories = [

      config.selCheckboxColumnDef,
      { headerName: 'Id', field: 'territoryId', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.code'), field: 'territoryCode', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'territoryName', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.status'), field: 'status', editable: false },

    ];

    this.columnDefsLayersConfiguration = [

      config.selCheckboxColumnDef,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('layersEntity.status'), field: 'status', editable: false },

    ];

    this.columnDefsNodes = [

      config.selCheckboxColumnDef,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.code'), field: 'nodeName' },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('layersEntity.createdDate'), field: 'tree', },
      { headerName: this.utils.getTranslate('layersEntity.status'), field: 'status', editable: false },
    ];

    this.columnDefsParametersDialog = [
      config.selCheckboxColumnDef,
      { headerName: this.utils.getTranslate('layersEntity.field'), field: 'field', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.alias'), field: 'alias', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.format'), field: 'format', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.type'), field: 'type', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.order'), field: 'order', editable: false },
    ];


    this.columnDefsTerritoriesDialog = [
      config.selCheckboxColumnDef,
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.code'), field: 'code', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'name', editable: false },
    ];


    this.columnDefsCartographyGroupsDialog = [
      config.selCheckboxColumnDef,
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'name', editable: false },
    ];

    this.columnDefsNodesDialog = [
      config.selCheckboxColumnDef,
      { headerName: 'ID', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('layersEntity.name'), field: 'name', editable: false },
    ];


  }


  onSelectionThematicChanged(value) {
    if (value.checked) {
      this.layerForm.get('geometryType').enable();
    } else {
      this.layerForm.get('geometryType').disable();
    }
  }

  onMunicipalityFilterChange(value) {
    if (value.checked) {
      this.layerForm.get('applyFilterToGetMap').enable();
    } else if ((!this.layerForm.value.applyFilterToGetFeatureInfo && !this.layerForm.value.applyFilterToSpatialSelection)) {
      this.layerForm.get('applyFilterToGetMap').disable();
    }
  }

  onSelectableFeatureEnabledChange(value) {
    if (value.checked) {
      this.layerForm.get('spatialSelectionService').enable();
      this.layerForm.get('selectableLayers').enable();
    } else {
      this.layerForm.get('spatialSelectionService').disable();
      this.layerForm.get('selectableLayers').disable();
    }
  }

  initializeLayersForm(): void {

    this.layerForm = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl(null, [Validators.required]),
      service: new FormControl(null, [Validators.required]),
      layers: new FormControl(null, [Validators.required]),
      minimumScale: new FormControl(null, []),
      maximumScale: new FormControl(null, []),
      geometryType: new FormControl(null, []),
      order: new FormControl(null, []),
      transparency: new FormControl(null, []),
      metadataURL: new FormControl(null, []),
      legendType: new FormControl(null, []),
      legendUrl: new FormControl(null, []),
      description: new FormControl(null, []),
      datasetURL: new FormControl(null, []),//here
      applyFilterToGetMap: new FormControl(null, [Validators.required]),
      applyFilterToGetFeatureInfo: new FormControl(null, []),
      applyFilterToSpatialSelection: new FormControl(null, []),
      queryableFeatureEnabled: new FormControl(null, []),
      queryableFeatureAvailable: new FormControl(null, []),
      queryableLayers: new FormControl(null, [Validators.required]),
      thematic: new FormControl(null, []),
      blocked: new FormControl(null, []),
      selectableFeatureEnabled: new FormControl(null, [],),
      spatialSelectionService: new FormControl(null, [Validators.required]),
      selectableLayers: new FormControl(null, [Validators.required]),
      spatialSelectionConnection: new FormControl(null, []),
      _links: new FormControl(null, []),
    });
  }


  initializeParameterForm(): void {
    this.parameterForm = new FormGroup({
      value: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      format: new FormControl(null, []),
      order: new FormControl(null, []),
    })
  }


  initializeTerritorialFilterForm(): void {
    this.territorialFilterForm = new FormGroup({
      id: new FormControl(null,),
      name: new FormControl(null, [Validators.required]),
      required: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      typeId: new FormControl(null),
      column: new FormControl(null),
      value: new FormControl(null, []),
      valueType: new FormControl(null, []),
      _links: new FormControl(null, []),
    })
  }
  // AG-GRID


  // ******** Parameters configuration ******** //
  getAllParameters = (): Observable<any> => {

    if (this.layerID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }
    var urlReq = `${this.layerToEdit._links.parameters.href}`
    if (this.layerToEdit._links.parameters.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['cartography-parameters'].filter(elem => elem.type == "INFO")
      ));

  }
  getAllRowsParameters(data: any[]) {
    console.log(data);
    let parameterToSave = [];
    let parameterToDelete = [];
    const promises: Promise<any>[] = [];
    data.forEach(parameter => {
      if (parameter.status === 'Pending creation' || parameter.status === 'Modified') {
        if (!parameter._links) {
          console.log(this.layerToEdit);
          parameter.cartography = this.layerToEdit;
        } //If is new, you need the service link
        parameterToSave.push(parameter)
      }
      if (parameter.status === 'Deleted' && parameter._links) { parameterToDelete.push(parameter) }
    });

    parameterToSave.forEach(saveElement => {
      promises.push(new Promise((resolve, reject) => { this.cartographyParameterService.save(saveElement).subscribe((resp) => { resolve(true) }) }));
    });

    parameterToDelete.forEach(deletedElement => {
      promises.push(new Promise((resolve, reject) => { this.cartographyParameterService.remove(deletedElement).subscribe((resp) => { resolve(true) }) }));
    });

    Promise.all(promises).then(() => {
      this.dataUpdatedEventParameters.next(true);
    });


  }

  duplicateParameters(data) {
    let parametersToDuplicate = []
    data.forEach(parameter => {
      let newParameter = { ...parameter };
      newParameter.name = 'copia_'.concat(newParameter.name),
        newParameter.id = null,
        parametersToDuplicate.push(newParameter);
    });

    this.addElementsEventParameters.next(parametersToDuplicate);

  }

  duplicateSpatialSelections(data) {
    let spatialSelectionsToDuplicate = []
    data.forEach(spatialSelection => {
      let newSpatialSelection = { ...spatialSelection };
      newSpatialSelection.name = 'copia_'.concat(newSpatialSelection.name),
        newSpatialSelection.id = null,
        spatialSelectionsToDuplicate.push(newSpatialSelection);
    });

    this.addElementsEventSpatialConfigurations.next(spatialSelectionsToDuplicate);

  }

  // ******** Spatial configuration ******** //
  getAllSpatialConfigurations = (): Observable<any> => {

    if (this.layerID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }
    var urlReq = `${this.layerToEdit._links.parameters.href}`
    if (this.layerToEdit._links.parameters.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['cartography-parameters'].filter(elem => elem.type == "INFOSELECT")
      ));

  }
  // We use getAllRowsParameters To update spatial configrurations


  // getAllRowsSpatialConfiguration(data: any[] )
  // {
  //   let spatialSelectionsModified = [];
  //   let spatialSelectionsToPut = [];
  //   data.forEach(spatialSelection => {
  //     if (spatialSelection.status === 'Modified') {spatialSelectionsModified.push(spatialSelection) }
  //     if(spatialSelection.status!== 'Deleted') {spatialSelectionsToPut.push(spatialSelection._links.self.href) }
  //   });
  //   this.updateSpatialConfiguration(spatialSelectionsModified, spatialSelectionsToPut);
  // }

  // updateSpatialConfiguration(spatialConfigurationsModified: any[], spatialSelectionsToPut: any[] )
  // {
  // const promises: Promise<any>[] = [];
  // spatialConfigurationsModified.forEach(spatialSelection => {
  //   promises.push(new Promise((resolve, reject) => { this.tasksService.update(spatialSelection).subscribe((resp) => { resolve(true) }) }));
  // });
  // Promise.all(promises).then(() => {
  // let url=this.layerToEdit._links.spatialSelectionConnection.href.split('{', 1)[0];
  // this.utils.updateUriList(url,spatialSelectionsToPut, this.dataUpdatedEventSpatialConfigurations)
  // });
  // }


  // ******** Territorial Filters  ******** //
  getAllTerritorialFilters = (): Observable<any> => {

    if (this.layerID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }
    var urlReq = `${this.layerToEdit._links.filters.href}`
    if (this.layerToEdit._links.filters.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['cartography-filters']));

  }
  getAllRowsTerritorialFilters(data: any[]) {
    console.log(data);
    let territorialFilterToSave = [];
    let territorialFilterToDelete = [];
    const promises: Promise<any>[] = [];
    data.forEach(territoryFilter => {
      if (territoryFilter.status === 'Pending creation' || territoryFilter.status === 'Modified') {
        if (!territoryFilter._links) {
          territoryFilter.cartography = this.layerToEdit;
        } //If is new, you need the service link
        territorialFilterToSave.push(territoryFilter)
      }
      if (territoryFilter.status === 'Deleted' && territoryFilter._links) { territorialFilterToDelete.push(territoryFilter) }
    });

    territorialFilterToSave.forEach(saveElement => {
      promises.push(new Promise((resolve, reject) => { this.cartographyFilterService.save(saveElement).subscribe((resp) => { resolve(true) }) }));
    });

    territorialFilterToDelete.forEach(deletedElement => {
      promises.push(new Promise((resolve, reject) => { this.cartographyFilterService.remove(deletedElement).subscribe((resp) => { resolve(true) }) }));
    });

    Promise.all(promises).then(() => {
      this.dataUpdatedEventTerritorialFilter.next(true);
    });


  }

  duplicateTerritorialFilters(data) {
    let territorialFiltersToDuplicate = []
    data.forEach(territorialFilter => {
      let newTerritorialFilter = { ...territorialFilter };
      newTerritorialFilter.name = 'copia_'.concat(newTerritorialFilter.name),
        newTerritorialFilter.id = null,
        territorialFiltersToDuplicate.push(newTerritorialFilter);
    });

    this.addElementsEventParameters.next(territorialFiltersToDuplicate);

  }

  // ******** Territories ******** //
  getAllTerritories = (): Observable<any> => {
    if (this.layerID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.layerToEdit._links.availabilities.href}`
    if (this.layerToEdit._links.availabilities.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['cartography-availabilities']));


  }

  getAllRowsTerritories(data: any[]) {
    let territoriesToCreate = [];
    let territoriesToDelete = [];
    data.forEach(territory => {
      territory.cartography = this.layerToEdit;
      if (territory.status === 'Pending creation') {
        let index = data.findIndex(element => element.territoryCode === territory.territoryCode && !element.new)
        if (index === -1) {
          territoriesToCreate.push(territory)
          territory.new = false;
        }
      }
      if (territory.status === 'Deleted' && territory._links) { territoriesToDelete.push(territory) }
    });
    const promises: Promise<any>[] = [];
    territoriesToCreate.forEach(newElement => {
      promises.push(new Promise((resolve, reject) => { this.cartograhyAvailabilityService.save(newElement).subscribe((resp) => { resolve(true) }) }));
    });

    territoriesToDelete.forEach(deletedElement => {
      promises.push(new Promise((resolve, reject) => { this.cartograhyAvailabilityService.remove(deletedElement).subscribe((resp) => { resolve(true) }) }));

    });

    Promise.all(promises).then(() => {
      this.dataUpdatedEventTerritories.next(true);
    });


  }




  // ******** Layers configuration ******** //
  getAllLayersConfiguration = (): Observable<any> => {


    if (this.layerID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.layerToEdit._links.permissions.href}`
    if (this.layerToEdit._links.permissions.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['cartography-groups']));
  }



  getAllRowsLayersConfiguration(data: any[]) {
    let layersConfigurationModified = [];
    let layersConfigurationToPut = [];
    data.forEach(layer => {
      if (layer.status === 'Modified') { layersConfigurationModified.push(layer) }
      if (layer.status !== 'Deleted') { layersConfigurationToPut.push(layer._links.self.href) }
    });
    console.log(layersConfigurationModified);
    this.updateLayersConfigurations(layersConfigurationModified, layersConfigurationToPut);
  }

  updateLayersConfigurations(layersConfigurationModified: CartographyGroup[], layersConfigurationToPut: CartographyGroup[]) {
    const promises: Promise<any>[] = [];
    layersConfigurationModified.forEach(cartography => {
      promises.push(new Promise((resolve, reject) => { this.cartographyGroupService.update(cartography).subscribe((resp) => { resolve(true) }) }));
    });
    Promise.all(promises).then(() => {
      let url = this.layerToEdit._links.permissions.href.split('{', 1)[0];
      this.utils.updateUriList(url, layersConfigurationToPut, this.dataUpdatedEventLayersConfiguration)
    });
  }

  // ******** Nodes configuration ******** //
  getAllNodes = (): Observable<any> => {

    if (this.layerID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.layerToEdit._links.treeNodes.href}`
    if (this.layerToEdit._links.treeNodes.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['tree-nodes']));
  }

  getAllRowsNodes(data: any[]) {
    let nodesModified = [];
    let nodesToPut = [];
    data.forEach(node => {
      if (node.status === 'Modified') { nodesModified.push(node) }
      if (node.status !== 'Deleted') { nodesToPut.push(node._links.self.href) }
    });
    console.log(nodesModified);
    this.updateNodes(nodesModified, nodesToPut);
  }

  updateNodes(nodesModified: any[], nodesToPut: any[]) {
    const promises: Promise<any>[] = [];
    nodesModified.forEach(node => {
      promises.push(new Promise((resolve, reject) => { this.treeNodeService.update(node).subscribe((resp) => { resolve(true) }) }));
    });
    Promise.all(promises).then(() => {
      let url = this.layerToEdit._links.treeNodes.href.split('{', 1)[0];
      this.utils.updateUriList(url, nodesToPut, this.dataUpdatedEventNodes)
    });
  }

  // ******** Parameters Dialog  ******** //

  openParametersDialog(data: any) {

    this.parameterForm.patchValue({
      format: this.parameterFormatTypes[0].value
    })
    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived = this.newParameterDialog;
    dialogRef.componentInstance.title = this.utils.getTranslate('layersEntity.parametersConfiguration');
    dialogRef.componentInstance.form = this.parameterForm;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          let item = this.parameterForm.value;
          item.type = "INFO"
          this.addElementsEventParameters.next([item])
          console.log(this.parameterForm.value)
          this.parameterForm.reset();
        }
      }
      this.parameterForm.reset();
    });

  }

  // ******** Spatial Selection Dialog  ******** //


  openSpatialSelectionDialog(data: any) {

    this.parameterForm.patchValue({
      format: this.parameterFormatTypes[0].value
    })

    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived = this.newSpatialConfigurationDialog;
    dialogRef.componentInstance.title = this.utils.getTranslate('layersEntity.spatialSelection');
    dialogRef.componentInstance.form = this.parameterForm;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          let item = this.parameterForm.value;
          item.type = "INFOSELECT"
          this.addElementsEventSpatialConfigurations.next([item])
          console.log(this.parameterForm.value)
        }
      }
      this.parameterForm.reset();
    });


  }

  // ******** Territorial Filter Dialog  ******** //

  openTerritorialFilterDialog(data: any) {

    this.territorialFilterForm.patchValue({
      type: this.filterTypes[0].value,
      valueType: this.filterValueTypes[0].value,
      typeId: this.filterTypeIds[0].id,
      required: false
    })

    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived = this.newTerritorialFilterDialog;
    dialogRef.componentInstance.title = this.utils.getTranslate('layersEntity.territorialFilter');
    dialogRef.componentInstance.form = this.territorialFilterForm;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          let item = this.territorialFilterForm.value;
          item.giid = this.layerToEdit.id
          this.addElementsTerritorialFilter.next([item])
          console.log(this.territorialFilterForm.value)
        }
      }
      this.territorialFilterForm.reset();
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
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventTerritories.next(this.adaptFormatTerritories(result.data[0]))
        }
      }

    });

  }

  adaptFormatTerritories(dataToAdapt: Territory[]) {
    let newData: any[] = [];

    dataToAdapt.forEach(element => {
      let item = {
        id: null,
        territoryId: element.id,
        territoryCode: element.code,
        territoryName: element.name,
        createdDate: element.createdDate,
        owner: null,
        territory: element,
        new: true
      }
      newData.push(item);

    });

    return newData;
  }

  // ******** Cartography Groups Dialog  ******** //

  getAllCartographyGroupsDialog = () => {
    let params2: HalParam[] = [];
    let param: HalParam = { key: 'type', value: 'C' }
    params2.push(param);
    let query: HalOptions = { params: params2 };
    return this.cartographyGroupService.getAll(query, undefined);
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
      if (result) {
        if (result.event === 'Add') {
          console.log('result.data[0]');
          this.addElementsEventCartographyGroups.next(result.data[0])
        }
      }

    });

  }

  // ******** Nodes Dialog  ******** //

  getAllNodesDialog = () => {
    return this.treeNodeService.getAll();
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
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventNodes.next(result.data[0])
        }
      }

    });

  }

  //Save Button

  onSaveButtonClicked() {

    if (this.layerForm.valid) {

      let service = this.services.find(x => x.id === this.layerForm.value.service)
      if (service == undefined) {
        service = null
      }

      let selectService = this.spatialConfigurationServices.find(x => x.id === this.layerForm.value.spatialSelectionService)
      if (selectService == undefined || selectService.id == -1) {
        selectService = null
      }

      // let legendType = this.legendTypes.find(x => x.id === this.layerForm.value.legendType)
      let geometryType = null;
      if(this.layerForm.value.geometryType !== -1)
      {
        geometryType=this.layerForm.value.geometryType
      }

      let legendType = null;
      if(this.layerForm.value.legendType !== -1)
      {
        legendType=this.layerForm.value.legendType
      }
  
  debugger;
      let cartography = new Cartography();
      cartography.name = this.layerForm.value.name,
        cartography.service = service,
        cartography.layers = this.layerForm.value.layers,
        cartography.minimumScale = this.layerForm.value.minimumScale,
        cartography.maximumScale = this.layerForm.value.maximumScale,
        cartography.geometryType = geometryType
        cartography.order = this.layerForm.value.order,
        cartography.transparency = this.layerForm.value.transparency,
        cartography.metadataURL = this.layerForm.value.metadataURL,
        cartography.legendType= legendType
        cartography.legendURL = this.layerForm.value.legendUrl,
        cartography.description = this.layerForm.value.description,
        // cartography.datasetURL= this.layerForm.value.datasetURL, 
        // cartography.applyFilterToGetMap= this.layerForm.value.applyFilterToGetMap,
        // cartography.applyFilterToGetFeatureInfo= this.layerForm.value.applyFilterToGetFeatureInfo,
        // cartography.applyFilterToSpatialSelection= this.layerForm.value.applyFilterToSpatialSelection
        cartography.queryableFeatureEnabled = this.layerForm.value.queryableFeatureEnabled,
        cartography.queryableFeatureAvailable = this.layerForm.value.queryableFeatureAvailable,
        cartography.queryableLayers = this.layerForm.value.queryableLayers,
        cartography.thematic = this.layerForm.value.thematic,
        cartography.blocked = this.layerForm.value.blocked,
        cartography.selectableFeatureEnabled = this.layerForm.value.selectableFeatureEnabled,
        cartography.selectionService = selectService,
        // cartography.selectionLayer= this.layerForm.value.selectableLayers,
        cartography.connection = null,
        cartography._links = this.layerForm.value._links

      this.cartographyService.save(cartography)
        .subscribe(resp => {
          console.log(resp);
          this.layerToEdit = resp;
          this.layerID = resp.id;
          this.layerForm.patchValue({
            id: resp.id,
            _links: resp._links
          })
          this.getAllElementsEventParameters.next(true);
          this.getAllElementsEventSpatialConfigurations.next(true);
          this.getAllElementsTerritorialFilter.next(true);
          this.getAllElementsEventTerritories.next(true);
          this.getAllElementsEventLayersConfigurations.next(true);
          this.getAllElementsEventNodes.next(true);

        });
    }
    else {
      this.utils.showRequiredFieldsError();
    }

  }
}