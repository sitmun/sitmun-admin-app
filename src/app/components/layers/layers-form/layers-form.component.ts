import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartographyService, GetInfoService, ServiceService, CartographyFilterService, TerritoryTypeService, ConnectionService, TreeNodeService, 
  CartographyGroupService, TerritoryService, Territory, CartographyGroup, CartographyAvailabilityService, CartographyParameterService, HalParam, 
  HalOptions, Cartography, TreeNode, TranslationService, Translation, CartographyStyleService, CartographySpatialSelectionParameterService } 
  from '../../../frontend-core/src/lib/public_api';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { map } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { DialogFormComponent, DialogGridComponent, DialogMessageComponent } from '../../../frontend-gui/src/lib/public_api';
import { MatDialog } from '@angular/material/dialog';
import { iterateExtend } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-layers-form',
  templateUrl: './layers-form.component.html',
  styleUrls: ['./layers-form.component.scss']
})
export class LayersFormComponent implements OnInit {

  //Translations
  translationMap: Map<string, Translation>;
  translationsModified: boolean = false;

  parametersPendingDelete = [];

  disableLoadButton = true;


  //Form
  private parametersUrl: string;
  parameteApplyFilterToGetMap;
  layerForm: FormGroup;
  layerToEdit;
  layerID = -1;
  duplicateID = -1;
  firstSaveDone: Boolean = false;
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
  parameterFormatTypesDescription: Array<any> = [];

  spatialSelectionParameterFormatTypes: Array<any> = [];
  spatialSelectionParameterFormatTypesDescription: Array<any> = [];

  parameterTypes: Array<any> = [];
  parameterTypesDescription: Array<any> = [];
  spatialSelectionParameterTypes: Array<any> = [];
  spatialSelectionParameterTypesDescription: Array<any> = [];



  //Grids
  themeGrid: any = config.agGridTheme;
  columnDefsParameters: any[];
  getAllElementsEventParameters: Subject<string> = new Subject<string>();
  dataUpdatedEventParameters: Subject<boolean> = new Subject<boolean>();

  columnDefsSpatialConfigurations: any[];
  getAllElementsEventSpatialConfigurations: Subject<string> = new Subject<string>();
  dataUpdatedEventSpatialConfigurations: Subject<boolean> = new Subject<boolean>();

  columnDefsTerritorialFilter: any[];
  getAllElementsTerritorialFilter: Subject<string> = new Subject<string>();
  dataUpdatedEventTerritorialFilter: Subject<boolean> = new Subject<boolean>();

  columnDefsStyles: any[];
  getAllElementsEventStyles: Subject<string> = new Subject<string>();
  dataUpdatedEventStyles: Subject<boolean> = new Subject<boolean>();


  columnDefsTerritories: any[];
  getAllElementsEventTerritories: Subject<string> = new Subject<string>();
  dataUpdatedEventTerritories: Subject<boolean> = new Subject<boolean>();

  columnDefsLayersConfiguration: any[];
  getAllElementsEventLayersConfigurations: Subject<string> = new Subject<string>();
  dataUpdatedEventLayersConfiguration: Subject<boolean> = new Subject<boolean>();

  columnDefsNodes: any[];
  getAllElementsEventNodes: Subject<string> = new Subject<string>();
  dataUpdatedEventNodes: Subject<boolean> = new Subject<boolean>();


  //Dialog
  columnDefsParametersDialog: any[];
  public parameterForm: FormGroup;
  public styleForm: FormGroup;
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

  @ViewChild('newStyleDialog', {
    static: true
  }) private newStyleDialog: TemplateRef<any>;

  columnDefsCartographyGroupsDialog: any[];
  addElementsEventCartographyGroups: Subject<any[]> = new Subject<any[]>();

  addElementsEventSpatialConfigurations: Subject<any> = new Subject<any>();
  replaceAllElementsEventSpatialConfigurations: Subject<any> = new Subject<any>();

  public territorialFilterForm: FormGroup;
  addElementsTerritorialFilter: Subject<any[]> = new Subject<any[]>();

  public stylesForm: FormGroup;
  addElementsEventStyles: Subject<any[]> = new Subject<any[]>();

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
    private translationService: TranslationService,
    private serviceService: ServiceService,
    private cartographyGroupService: CartographyGroupService,
    private cartograhyAvailabilityService: CartographyAvailabilityService,
    private cartographyParameterService: CartographyParameterService,
    private cartographySpatialSelectionParameterService: CartographySpatialSelectionParameterService,
    private cartographyStyleService: CartographyStyleService,
    private cartographyFilterService: CartographyFilterService,
    private treeNodeService: TreeNodeService,
    private territoryService: TerritoryService,
    private territoryTypeService: TerritoryTypeService,
    private http: HttpClient,
    public utils: UtilsService,
    private getInfoService: GetInfoService
  ) {
    this.initializeLayersForm();
    this.initializeParameterForm();
    this.initializeStyleForm();
    this.initializeTerritorialFilterForm();

  }

  ngOnInit(): void {

    this.translationMap = this.utils.createTranslationsList(config.translationColumns.cartographyDescription);

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
          resp.forEach(element => {
            this.parameterTypes.push(element);
            this.parameterTypesDescription.push(element.description)
          });
          resolve(true);
        }
      )
    }));

    promises.push(new Promise((resolve, reject) => {
      this.utils.getCodeListValues('cartographySpatialSelectionParameter.type').subscribe(
        resp => {
          resp.forEach(element => {
            this.spatialSelectionParameterTypes.push(element);
            this.spatialSelectionParameterTypesDescription.push(element.description)
          });
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



    promises.push(new Promise((resolve, reject) => {
      this.utils.getCodeListValues('cartographyFilter.valueType').subscribe(
        resp => {
          this.filterValueTypes.push(...resp);
          resolve(true);
        }
      )
    }));

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
          resp.forEach(element => {
            this.parameterFormatTypes.push(element);
            this.parameterFormatTypesDescription.push(element.description);
          });
          resolve(true);
        }
      )
    }));

    promises.push(new Promise((resolve, reject) => {
      this.utils.getCodeListValues('cartographySpatialSelectionParameter.format').subscribe(
        resp => {
          resp.forEach(element => {
            this.spatialSelectionParameterFormatTypes.push(element);
            this.spatialSelectionParameterFormatTypesDescription.push(element.description);
          });
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
          if (service.type === config.capabilitiesRequest.WFSIdentificator) { wfsServices.push(service) }
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
        if (params.idDuplicate) { this.duplicateID = +params.idDuplicate; }

        if (this.layerID !== -1 || this.duplicateID != -1) {
          let idToGet = this.layerID !== -1 ? this.layerID : this.duplicateID

          //getCartography Entity
          this.cartographyService.get(idToGet).subscribe(
            resp => {
              console.log(resp);
              this.layerToEdit = resp;
              let layers = this.layerToEdit.layers.join(',');
              let queryableLayers = null
              if (this.layerToEdit.queryableLayers != null) { queryableLayers = this.layerToEdit.queryableLayers.join(',') };
              let selectableLayers = null;
              if (this.layerToEdit.selectableLayers != null && this.layerToEdit.selectableLayers != undefined) { selectableLayers = this.layerToEdit.selectableLayers.join(',') };
              this.parametersUrl = this.layerToEdit._links.parameters.href;
              this.layerForm.patchValue({
                service: this.layerToEdit.serviceId,
                layers: layers,
                minimumScale: this.layerToEdit.minimumScale,
                maximumScale: this.layerToEdit.maximumScale,
                geometryType: this.layerToEdit.geometryType,
                order: this.layerToEdit.order,
                transparency: this.layerToEdit.transparency,
                metadataURL: this.layerToEdit.metadataURL,
                legendType: this.layerToEdit.legendType,
                legendUrl: this.layerToEdit.legendURL,
                source: this.layerToEdit.source,
                description: this.layerToEdit.description,
                datasetURL: this.layerToEdit.datasetURL, //here
                applyFilterToGetMap: this.layerToEdit.applyFilterToGetMap,
                applyFilterToGetFeatureInfo: this.layerToEdit.applyFilterToGetFeatureInfo,
                applyFilterToSpatialSelection: this.layerToEdit.applyFilterToSpatialSelection,
                queryableFeatureEnabled: this.layerToEdit.queryableFeatureEnabled,
                queryableFeatureAvailable: this.layerToEdit.queryableFeatureAvailable,
                queryableLayers: queryableLayers,
                thematic: this.layerToEdit.thematic,
                blocked: !this.layerToEdit.blocked,
                selectableFeatureEnabled: this.layerToEdit.selectableFeatureEnabled,
                spatialSelectionService: this.layerToEdit.spatialSelectionServiceId,
                selectableLayers: selectableLayers,
                spatialSelectionConnection: "",
                useAllStyles: this.layerToEdit.useAllStyles,
                _links: this.layerToEdit._links
              });

              if (this.layerID !== -1) {
                this.layerForm.patchValue({
                  id: this.layerID,
                  name: this.layerToEdit.name,
                });
              }
              else {
                this.layerForm.patchValue({
                  name: this.utils.getTranslate('copy_').concat(this.layerToEdit.name),
                });
              }

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


              if (this.layerID != -1) {
                this.translationService.getAll()
                  .pipe(map((data: any[]) => data.filter(elem => elem.element == this.layerID && elem.column == config.translationColumns.cartographyDescription)
                  )).subscribe(result => {
                    console.log(result);
                    this.utils.updateTranslations(this.translationMap, result)
                  }

                  );;

              }




              var urlReq = `${this.layerToEdit._links.parameters.href}`
              if (this.layerToEdit._links.parameters.templated) {
                var url = new URL(urlReq.split("{")[0]);
                url.searchParams.append("projection", "view")
                urlReq = url.toString();
              }

              if (!this.layerToEdit.thematic) { this.layerForm.get('geometryType').disable(); }
              if (!this.layerToEdit.queryableFeatureEnabled) {
                this.layerForm.get('queryableFeatureAvailable').disable();
                this.layerForm.get('queryableLayers').disable();
              }

              if (!this.layerToEdit.selectableFeatureEnabled) {
                this.layerForm.get('spatialSelectionService').disable();
                this.layerForm.get('selectableLayers').disable();
              }

              this.loadButtonDisabled();

              this.dataLoaded = true;

            },
            error => {

            }
          );



        }
        else {
          this.layerForm.patchValue({
            blocked: true,
            thematic: false,
            applyFilterToGetMap: false,
            service: this.services[0].id,
            spatialSelectionService: this.spatialConfigurationServices[0].id,
            geometryType: this.geometryTypes[0].value,
            legendType: this.legendTypes[0].value,
            queryableFeatureEnabled: false,
            useAllStyles: false,
          })
          this.layerForm.get('geometryType').disable();
          // this.layerForm.get('applyFilterToGetMap').disable();
          this.layerForm.get('spatialSelectionService').disable();
          this.layerForm.get('selectableLayers').disable();
          this.layerForm.get('queryableFeatureAvailable').disable();
          this.layerForm.get('queryableLayers').disable();
          this.dataLoaded = true;
        }

      },
        error => {

        });


    });


    this.columnDefsParameters = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getEditableColumnDef('layersEntity.column', 'name'),
      this.utils.getEditableColumnDef('layersEntity.label', 'value'),
      this.utils.getSelectColumnDef('layersEntity.format', 'format', true, this.parameterFormatTypesDescription, true, this.parameterFormatTypes),
      this.utils.getEditableColumnDef('layersEntity.order', 'order'),
      this.utils.getSelectColumnDef('layersEntity.type', 'type', true, this.parameterTypesDescription),
      this.utils.getStatusColumnDef()
    ];


    this.columnDefsSpatialConfigurations = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getEditableColumnDef('layersEntity.column', 'name'),
      this.utils.getEditableColumnDef('layersEntity.label', 'value'),
      // this.utils.getFormattedColumnDef('layersEntity.format', this.parameterFormatTypes, 'format'),
      this.utils.getSelectColumnDef('layersEntity.format', 'format', true, this.spatialSelectionParameterFormatTypesDescription, true, this.spatialSelectionParameterFormatTypes),
      this.utils.getSelectColumnDef('layersEntity.type', 'type', true, this.spatialSelectionParameterTypesDescription, true, this.spatialSelectionParameterTypes),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsTerritorialFilter = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('layersEntity.name', 'name'),
      this.utils.getEditableColumnDef('layersEntity.type', 'type'),
      this.utils.getEditableColumnDef('layersEntity.valueType', 'valueType'),
      this.utils.getEditableColumnDef('layersEntity.column', 'column'),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsStyles = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getEditableColumnDef('layersEntity.name', 'name'),
      this.utils.getEditableColumnDef('layersEntity.title', 'title'),
      this.utils.getEditableColumnDef('layersEntity.description', 'description'),
      this.utils.getEditableColumnDef('layersEntity.format', 'legendURL.format'),
      // this.utils.getSelectColumnDef('layersEntity.format', 'legendURL.format',true,this.parameterFormatTypesDescription, true, this.parameterFormatTypes),
      // this.utils.getFormattedColumnDef('layersEntity.format', this.parameterFormatTypes, 'format'),
      // this.utils.getSelectColumnDef('layersEntity.format', 'format',true,this.parameterFormatTypesDescription, true, this.parameterFormatTypes),
      this.utils.getEditableColumnDef('layersEntity.width', 'legendURL.width'),
      this.utils.getEditableColumnDef('layersEntity.height', 'legendURL.height'),
      this.utils.getEditableColumnDef('layersEntity.url', 'legendURL.onlineResource'),
      this.utils.getBooleanColumnDef('layersEntity.defaultStyle', 'defaultStyle', true),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsTerritories = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef('territoryId'),
      this.utils.getNonEditableColumnDef('layersEntity.code', 'territoryCode'),
      this.utils.getNonEditableColumnDef('layersEntity.name', 'territoryName'),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsLayersConfiguration = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('layersEntity.name', 'name'),
      this.utils.getNonEditableColumnDef('layersEntity.roles', 'roleNames'),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsNodes = [
      // this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('layersEntity.name', 'name'),
      this.utils.getNonEditableColumnDef('layersEntity.treeName', 'treeName'),
    ];

    this.columnDefsParametersDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getNonEditableColumnDef('layersEntity.field', 'field'),
      this.utils.getNonEditableColumnDef('layersEntity.alias', 'alias'),
      this.utils.getNonEditableColumnDef('layersEntity.format', 'format'),
      this.utils.getNonEditableColumnDef('layersEntity.type', 'type'),
      this.utils.getNonEditableColumnDef('layersEntity.order', 'order'),
    ];

    this.columnDefsTerritoriesDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('layersEntity.code', 'code'),
      this.utils.getNonEditableColumnDef('layersEntity.name', 'name'),
    ];


    this.columnDefsCartographyGroupsDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('layersEntity.name', 'name'),
    ];

    this.columnDefsNodesDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('layersEntity.name', 'name'),
      this.utils.getNonEditableColumnDef('layersEntity.treeName', 'treeName'),
    ];


  }


  onSelectionThematicChanged(value) {
    if (value.checked) {
      this.layerForm.get('geometryType').enable();
    } else {
      this.layerForm.get('geometryType').disable();
    }
  }


  onSelectableFeatureEnabledChange(value) {
    if (value.checked) {
      this.layerForm.get('spatialSelectionService').enable();
      this.layerForm.get('selectableLayers').enable();
      this.loadButtonDisabled();
    } else {
      this.layerForm.get('spatialSelectionService').disable();
      this.layerForm.get('selectableLayers').disable();
      this.disableLoadButton = true;
    }
  }

  onQueryableFeatureEnabledChange(value) {
    if (value.checked) {
      this.layerForm.get('queryableFeatureAvailable').enable();
      this.layerForm.get('queryableLayers').enable();
    } else {
      this.layerForm.get('queryableFeatureAvailable').disable();
      this.layerForm.get('queryableLayers').disable();
    }
  }

  async onTranslationButtonClicked() {
    let dialogResult = null
    dialogResult = await this.utils.openTranslationDialog(this.translationMap);
    if (dialogResult && dialogResult.event == "Accept") {
      this.translationsModified = true;
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
      source: new FormControl(null, []),
      description: new FormControl(null, []),
      datasetURL: new FormControl(null, []),//here
      applyFilterToGetMap: new FormControl(null, []),
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
      useAllStyles: new FormControl(null, []),
      _links: new FormControl(null, []),
    });
  }


  initializeParameterForm(): void {
    this.parameterForm = new FormGroup({
      value: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      format: new FormControl(null, []),
      order: new FormControl(null, []),
      type: new FormControl(null, []),
    })
  }

  initializeStyleForm(): void {
    this.styleForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, []),
      format: new FormControl(null, []),
      width: new FormControl(null, []),
      height: new FormControl(null, []),
      url: new FormControl(null, []),
      defaultStyle: new FormControl(null, []),

    })
  }


  initializeTerritorialFilterForm(): void {
    this.territorialFilterForm = new FormGroup({
      id: new FormControl(null,),
      name: new FormControl(null, [Validators.required]),
      required: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      territorialLevel: new FormControl(null),
      column: new FormControl(null),
      values: new FormControl(null, []),
      valueType: new FormControl(null, []),
      _links: new FormControl(null, []),
    })
  }

  onLoadButtonClicked(): void {
    try {

      const dialogRef = this.dialog.open(DialogMessageComponent);
      dialogRef.componentInstance.title = this.utils.getTranslate("caution");
      dialogRef.componentInstance.message = this.utils.getTranslate("getInfoMessage");
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let replaceAll = result.event === 'Accept';
          let service = this.spatialConfigurationServices.find(element => element.id == this.layerForm.get('spatialSelectionService').value);
          let layersName = this.layerForm.get('selectableLayers').value
          if (service && service.serviceURL && layersName) {
            let url: string = service.serviceURL;
            if (!url.includes('request=DescribeFeatureType')) {
              if (url[url.length - 1] != '?') { url += "?" }

              url += `request=DescribeFeatureType%26service=WFS%26typeName=${layersName}`
            }
            this.getInfoService.getInfo(url).subscribe(result => {
              if (result.success) {
                this.manageGetInfoResults(result.asJson, replaceAll);
              }
            }, error => {
              console.log(error)
            })
          }


        }
      });



    }
    catch (err) {
      this.utils.showErrorMessage(err)
    };
  }

  manageGetInfoResults(results, replaceAll: boolean) {
    let elementsToAdd = [];
    let elements = []
    let type = this.spatialSelectionParameterTypes.find(element => element.value == "SELECT")

    if (results['xsd:schema'] && results['xsd:schema']['xsd:element']) {
      elements.push(results['xsd:schema']['xsd:element'])
    }

    if (results['xsd:schema'] && results['xsd:schema']['xsd:complexType'] && results['xsd:schema']['xsd:complexType']['xsd:complexContent']) {
      let complexContent = results['xsd:schema']['xsd:complexType']['xsd:complexContent'];
      if (complexContent['xsd:extension'] && complexContent['xsd:extension']['xsd:sequence'] && complexContent['xsd:extension']['xsd:sequence']['xsd:element']) {
        elements.push(...complexContent['xsd:extension']['xsd:sequence']['xsd:element']);
        if (elements) {
          elements.forEach(element => {
            let newParameter = {
              name: element.name,
              value: element.name,
              type: type?type.value:null,
              format: this.getFormatFromGetInfo(element.type),
            }
            elementsToAdd.push(newParameter);
          });
          if (elementsToAdd) {
            if (replaceAll) {
              this.getAllElementsEventSpatialConfigurations.next('pendingDelete');
              this.replaceAllElementsEventSpatialConfigurations.next(elementsToAdd);
            }
            else {
              this.addElementsEventSpatialConfigurations.next(elementsToAdd);
            }

          }
        }
      }
    }

    return elementsToAdd;
  }

  private getFormatFromGetInfo(format) {
    if (format == 'xsd:int') { return 'N' }
    else if (format == 'xsd:string') { return 'T' }
    else if (format == 'xsd:img') { return 'I' }
    else if (format == 'gml:PointPropertyType') { return 'N' }
    else if (format == 'xsd:url') { return 'U' }
    else if (format == 'xsd:date') { return 'F' }
    else { return 'T' }
  }

  // AG-GRID


  // ******** Parameters configuration ******** //
  getAllParameters = (): Observable<any> => {

    if (this.layerID == -1 && this.duplicateID == -1) {
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
      .pipe(map(data => data['_embedded']['cartography-parameters'] //.filter(elem => elem.type == "INFO")
      ));

  }

  getAllRowsParameters(event, spatialSelection: boolean) {
    if (event.event == "save") {
      this.saveParameters(event.data, spatialSelection);
    }
    if (event.event == 'pendingDelete') {
      this.parametersPendingDelete.push(...event.data)
    }
  }

  saveParameters(data: any[], spatialSelection: boolean) {
    console.log(data);
    const promises: Promise<any>[] = [];
    let formatsList, typesList, service, event;
    if (spatialSelection) {
      formatsList = this.spatialSelectionParameterFormatTypes;
      typesList = this.spatialSelectionParameterTypes
      service = this.cartographySpatialSelectionParameterService;
      event = this.dataUpdatedEventSpatialConfigurations;
    }
    else {
      formatsList = this.parameterFormatTypes;
      typesList = this.parameterTypes
      service = this.cartographyParameterService;
      event = this.dataUpdatedEventParameters;
    }
    data.forEach(parameter => {
      if (parameter.status === 'pendingCreation' || parameter.status === 'pendingModify') {
        if (parameter.status === 'pendingCreation' || parameter.newItem) {
          parameter.cartography = this.layerToEdit;
          parameter._links = null;
          parameter.id = null;
        }
        if (parameter.status === 'pendingModify') {

          if (parameter.format) {
            let currentFormat = formatsList.find(element => element.description == parameter.format);
            if (currentFormat) { parameter.format = currentFormat.value }
          }

          if (parameter.type) {
            let currentType = typesList.find(element => element.description == parameter.type);
            if (currentType) { parameter.type = currentType.value }
          }

        }
        promises.push(new Promise((resolve, reject) => { service.save(parameter).subscribe((resp) => { resolve(true) }) }));
      }
      if (parameter.status === 'pendingDelete' && parameter._links && !parameter.newItem) {
        promises.push(new Promise((resolve, reject) => { service.remove(parameter).subscribe((resp) => { resolve(true) }) }));
      }
    });

    if (this.parametersPendingDelete.length > 0) {
      this.parametersPendingDelete.forEach(parameter => {
        if (parameter._links && !parameter.newItem) {
          promises.push(new Promise((resolve, reject) => { service.remove(parameter).subscribe((resp) => { resolve(true) }) }));
        }
      });
      this.parametersPendingDelete = [];
    }

    Promise.all(promises).then(() => {
      event.next(true);
    });


  }

  duplicateParameters(data, spatialSelection: boolean) {
    let parametersToDuplicate = this.utils.duplicateParameter(data, 'name');
    if (spatialSelection) { this.addElementsEventSpatialConfigurations.next(parametersToDuplicate); }
    else { this.addElementsEventParameters.next(parametersToDuplicate); }
  }

  loadButtonDisabled() {
    let formValues = this.layerForm.value;
    if (formValues.selectableFeatureEnabled && formValues.spatialSelectionService && formValues.spatialSelectionService > 0 && formValues.selectableLayers) {
      this.disableLoadButton = false;
    }
    else {
      this.disableLoadButton = true;
    }

  }

  // ******** Spatial configuration ******** //
  getAllSpatialConfigurations = (): Observable<any> => {

    if (this.layerID == -1 && this.duplicateID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }
    var urlReq = `${this.layerToEdit._links.spatialSelectionParameters.href}`
    if (this.layerToEdit._links.spatialSelectionParameters.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['cartography-spatial-selection-parameters'] //.filter(elem => elem.type == "EDIT")
      ));

  }


  // ******** Styles ******** //

  getAllStyles = () => {

    if (this.layerID == -1 && this.duplicateID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.layerToEdit._links.styles.href}`
    if (this.layerToEdit._links.styles.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['cartography-styles']));

  }

  getAllRowsStyles(event) {
    if (event.event == "save") {
      let stylesByDefault = event.data.filter(d => d.defaultStyle).length;
      if (stylesByDefault > 1) {
        this.showStylesError();
      }
      else {
        this.saveStyles(event.data)
      }
    }
  }

  saveStyles(data: any[]) {
    console.log(data);
    let index = data.findIndex(element => (element.status === 'pendingModify' ||
      element.status === 'pendingCreation') && element.defaultStyle);
    let styleToModifyTheLast = null;
    if (index != -1) {
      styleToModifyTheLast = data[index];
      data.splice(index, 1)

    }
    const promises: Promise<any>[] = [];
    data.forEach(style => {
      if (style.status === 'pendingCreation' || style.status === 'pendingModify') {
        if (!style._links) {
          style.cartography = this.layerToEdit;
        }
        if (style.status === 'pendingCreation' || style.newItem) {
          style._links = null;
          style.id = null;
        }
        if (style.status === 'pendingModify') {

          if (style.format) {
            let currentFormat = this.parameterFormatTypes.find(element => element.description == style.format);
            if (currentFormat) { style.format = currentFormat.value }
          }

        }
        promises.push(new Promise((resolve, reject) => { this.cartographyStyleService.save(style).subscribe((resp) => { resolve(true) }) }));
      }
      if (style.status === 'pendingDelete' && style._links && !style.newItem) {
        promises.push(new Promise((resolve, reject) => { this.cartographyStyleService.remove(style).subscribe((resp) => { resolve(true) }) }));

      }
    });

    Promise.all(promises).then(() => {
      if (index == -1) {
        this.dataUpdatedEventStyles.next(true);
      }
      else {
        if (!styleToModifyTheLast._links) {
          styleToModifyTheLast.cartography = this.layerToEdit;
        }

        if (styleToModifyTheLast.newItem) {
          styleToModifyTheLast._links = null;
          styleToModifyTheLast.id = null;
          if (styleToModifyTheLast.format) {
            let currentFormat = this.parameterFormatTypes.find(element => element.description == styleToModifyTheLast.format);
            if (currentFormat) { styleToModifyTheLast.format = currentFormat.value }
          }
        }
        this.cartographyStyleService.save(styleToModifyTheLast).subscribe((resp) => {
          this.dataUpdatedEventStyles.next(true);
        })
      }
    });


  }

  duplicateStyles(data) {
    let stylesToDuplicate = this.utils.duplicateParameter(data, 'name');
    this.addElementsEventStyles.next(stylesToDuplicate);
  }



  // ******** Territorial Filters  ******** //
  getAllTerritorialFilters = (): Observable<any> => {

    if (this.layerID == -1 && this.duplicateID == -1) {
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

  getAllRowsTerritorialFilters(event) {
    if (event.event == "save") {
      this.saveTerritorialFilters(event.data);
    }
  }

  saveTerritorialFilters(data: any[]) {
    console.log(data);
    let territorialFilterToSave = [];
    let territorialFilterToDelete = [];
    const promises: Promise<any>[] = [];
    data.forEach(territoryFilter => {
      if (territoryFilter.status === 'pendingCreation' || territoryFilter.status === 'pendingModify') {
        if (territoryFilter.status === 'pendingCreation' || territoryFilter.newItem) {
          territoryFilter.cartography = this.layerToEdit;
          if (!territoryFilter.territorialLevel) {
            let territorialLevel = this.filterTypeIds.find(x => x.id === territoryFilter.terrorialLevelId)
            if (territorialLevel == undefined || territorialLevel.id == -1) {
              territorialLevel = null
            }
            territoryFilter.territorialLevel = territorialLevel
            territoryFilter.id = null;
            territoryFilter._links = null;
          }
        }
        // territorialFilterToSave.push(territoryFilter)
        promises.push(new Promise((resolve, reject) => { this.cartographyFilterService.save(territoryFilter).subscribe((resp) => { resolve(true) }) }));

      }
      if (territoryFilter.status === 'pendingDelete' && territoryFilter._links && !territoryFilter.newItem) {
        //  territorialFilterToDelete.push(territoryFilter) 
        promises.push(new Promise((resolve, reject) => { this.cartographyFilterService.remove(territoryFilter).subscribe((resp) => { resolve(true) }) }));

      }
    });

    Promise.all(promises).then(() => {
      this.dataUpdatedEventTerritorialFilter.next(true);
    });


  }

  duplicateTerritorialFilters(data) {
    let territorialFiltersToDuplicate = this.utils.duplicateParameter(data, 'name')
    this.addElementsTerritorialFilter.next(territorialFiltersToDuplicate);

  }

  // ******** Territories ******** //
  getAllTerritories = (): Observable<any> => {
    if (this.layerID == -1 && this.duplicateID == -1) {
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

  getAllRowsTerritories(event) {
    if (event.event == "save") {
      this.saveTerritories(event.data);
    }
  }

  saveTerritories(data: any[]) {
    const promises: Promise<any>[] = [];
    data.forEach(territory => {
      territory.cartography = this.layerToEdit;
      if (territory.status === 'pendingCreation') {
        let index = data.findIndex(element => element.territoryCode === territory.territoryCode && !element.newItem)
        territory.newItem = false;
        if (index === -1) {
          if (territory._links) {
            territory.id = null;
            territory.cartographyId = this.layerToEdit.id;
            territory.cartographyName = this.layerToEdit.name;
            let urlReqTerritory = `${territory._links.territory.href}`
            let url = new URL(urlReqTerritory.split("{")[0]);
            url.searchParams.append("projection", "view")
            urlReqTerritory = url.toString();
            territory._links = null
            promises.push(new Promise((resolve, reject) => {
              this.http.get(urlReqTerritory).subscribe(result => {
                territory.territory = result;
                this.cartograhyAvailabilityService.save(territory).subscribe((resp) => { resolve(true) });
              })
            }))

          }
          else {
            promises.push(new Promise((resolve, reject) => { this.cartograhyAvailabilityService.save(territory).subscribe((resp) => { resolve(true) }) }));
            // territoriesToCreate.push(territory)
          }

        }
      }
      if (territory.status === 'pendingDelete' && territory._links && !territory.newItem) {
        promises.push(new Promise((resolve, reject) => { this.cartograhyAvailabilityService.remove(territory).subscribe((resp) => { resolve(true) }) }));

        //  territoriesToDelete.push(territory) 
      }
    });

    // territoriesToCreate.forEach(newElement => {
    //   promises.push(new Promise((resolve, reject) => { this.cartograhyAvailabilityService.save(newElement).subscribe((resp) => { resolve(true) }) }));
    // });

    // territoriesToDelete.forEach(deletedElement => {
    //   promises.push(new Promise((resolve, reject) => { this.cartograhyAvailabilityService.remove(deletedElement).subscribe((resp) => { resolve(true) }) }));

    // });

    Promise.all(promises).then(() => {
      this.dataUpdatedEventTerritories.next(true);
    });


  }




  // ******** Layers configuration ******** //
  getAllLayersConfiguration = (): Observable<any> => {


    if (this.layerID == -1 && this.duplicateID == -1) {
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

  getAllRowsLayersConfiguration(event) {
    if (event.event == "save") {
      this.saveLayersConfiguration(event.data);
    }
  }

  saveLayersConfiguration(data: any[]) {
    let dataChanged = false;
    const promises: Promise<any>[] = [];
    let layersConfigurationToPut = [];
    data.forEach(layer => {

      if (layer.status !== 'pendingDelete') {
        if (layer.status === 'pendingModify') {
          if (layer.newItem) { dataChanged = true; }
          promises.push(new Promise((resolve, reject) => { this.cartographyGroupService.update(layer).subscribe((resp) => { resolve(true) }) }));

        }
        else if (layer.status === 'pendingCreation') {
          dataChanged = true;
        }
        layersConfigurationToPut.push(layer._links.self.href)
      }
      else { dataChanged = true }
    });
    Promise.all(promises).then(() => {
      if (dataChanged) {
        let url = this.layerToEdit._links.permissions.href.split('{', 1)[0];
        this.utils.updateUriList(url, layersConfigurationToPut, this.dataUpdatedEventLayersConfiguration)
      }
      else {
        this.dataUpdatedEventLayersConfiguration.next(true);
      }
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

  getAllRowsNodes(event) {
    if (event.event == "save") {
      this.saveNodes(event.data);
    }
  }


  saveNodes(data: any[]) {

    const promises: Promise<any>[] = [];
    data.forEach(node => {

      let nodeAct = new TreeNode();
      var urlReq = `${node._links.cartography.href}`
      if (node._links.cartography.templated) {
        var url = new URL(urlReq.split("{")[0]);
        url.searchParams.append("projection", "view")
        urlReq = url.toString();
      }
      nodeAct.name = node.name
      node._links.cartography.href = urlReq
      nodeAct._links = node._links
      nodeAct.cartography = this.layerToEdit;
      if (node.status === 'pendingModify' || node.status === 'pendingCreation') {
        // if(node.status==='pendingCreation') { node._links=null; }
        promises.push(new Promise((resolve, reject) => { this.treeNodeService.save(nodeAct).subscribe((resp) => { resolve(true) }) }));

        //  nodesToPut.push(nodeAct) 
      }
      else if (node.status === 'pendingDelete' && !node.newItem) {
        //  nodesToDelete.push(nodeAct) 
        promises.push(new Promise((resolve, reject) => { this.treeNodeService.remove(node).subscribe((resp) => { resolve(true) }) }));

      }
    });


    // nodesToPut.forEach(node => {
    //   promises.push(new Promise((resolve, reject) => { this.treeNodeService.save(node).subscribe((resp) => { resolve(true) }) }));
    // });
    // nodesToDelete.forEach(node => {
    //   promises.push(new Promise((resolve, reject) => { this.treeNodeService.remove(node).subscribe((resp) => { resolve(true) }) }));
    // });
    Promise.all(promises).then(() => {
      this.dataUpdatedEventNodes.next(true);
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
      territorialLevel: this.filterTypeIds[0].id,
      required: false
    })

    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived = this.newTerritorialFilterDialog;
    dialogRef.componentInstance.title = this.utils.getTranslate('layersEntity.filters');
    dialogRef.componentInstance.form = this.territorialFilterForm;


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          let territorialLevel = this.filterTypeIds.find(x => x.id === this.territorialFilterForm.value.territorialLevel)
          if (territorialLevel == undefined || territorialLevel.id == -1) {
            territorialLevel = null
          }
          this.territorialFilterForm.patchValue({
            territorialLevel: territorialLevel
          })
          let item = this.territorialFilterForm.value;
          if (item.values != null) { item.values = item.values.split(",") }
          item.giid = this.layerToEdit.id
          // if(this.territorialFilterForm.value.typeId === -1)
          // {
          //   this.territorialFilterForm.patchValue({
          //     typeId: null
          //   })
          // }
          this.addElementsTerritorialFilter.next([item])
          console.log(this.territorialFilterForm.value)
        }
      }
      this.territorialFilterForm.reset();
    });


  }


  // ******** Style Dialog  ******** //

  openStylesDialog(data: any) {



    // this.styleForm.patchValue({
    //   format: this.parameterFormatTypes[0].value
    // })
    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived = this.newStyleDialog;
    dialogRef.componentInstance.title = this.utils.getTranslate('layersEntity.styles');
    dialogRef.componentInstance.form = this.styleForm;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {

          let item = this.styleForm.value;
          this.addElementsEventStyles.next([this.adaptCreatedStyle(item)])
          console.log(this.parameterForm.value)
          this.styleForm.reset();
        }
      }
      this.styleForm.reset();
    });

  }

  private adaptCreatedStyle(style) {
    style.legendURL = {
      width: style.width,
      height: style.height,
      onlineResource: style.url,
      format: style.format
    }
    style.defaultStyle = style.defaultStyle ? true : false;
    delete style.width;
    delete style.height;
    delete style.url;
    delete style.format;

    return style

  }

  // ******** Territory Dialog  ******** //

  getAllTerritoriesDialog = () => {
    return this.territoryService.getAll();
  }

  openTerritoriesDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [this.getAllTerritoriesDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTerritoriesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('layersEntity.territory');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.fieldRestrictionWithDifferentName = ['territoryId'];
    dialogRef.componentInstance.currentData = [data];
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
        code: element.code,
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
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.title = this.utils.getTranslate('layersEntity.permissiongroupLayersConfiguration');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.currentData = [data];
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
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsNodesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('layersEntity.nodes');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.currentData = [data];
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

      if (this.layerID == -1 && this.duplicateID != -1) {
        this.layerForm.patchValue({
          _links: null
        })
      }

      let service = this.services.find(x => x.id === this.layerForm.value.service)
      if (service == undefined) {
        service = null
      }

      let spatialService = this.spatialConfigurationServices.find(x => x.id === this.layerForm.value.spatialSelectionService)
      if (spatialService == undefined || spatialService.id == -1) {
        spatialService = null
      }

      // let legendType = this.legendTypes.find(x => x.id === this.layerForm.value.legendType)
      let geometryType = null;
      if (this.layerForm.value.geometryType !== -1) {
        geometryType = this.layerForm.value.geometryType
      }

      let legendType = null;
      if (this.layerForm.value.legendType !== -1) {
        legendType = this.layerForm.value.legendType
      }

      let cartography = new Cartography();
      cartography.name = this.layerForm.value.name;
      cartography.service = service;
      cartography.layers = this.layerForm.value.layers.split(",");
      cartography.minimumScale = this.layerForm.value.minimumScale;
      cartography.maximumScale = this.layerForm.value.maximumScale;
      cartography.geometryType = geometryType;
      cartography.order = this.layerForm.value.order;
      cartography.transparency = this.layerForm.value.transparency;
      cartography.metadataURL = this.layerForm.value.metadataURL;
      cartography.legendType = legendType
      cartography.source = this.layerForm.value.source
      cartography.legendURL = this.layerForm.value.legendUrl;
      cartography.description = this.layerForm.value.description;
      cartography.datasetURL = this.layerForm.value.datasetURL; //
      cartography.applyFilterToGetMap = (this.layerForm.value.applyFilterToGetMap) ? true : false;
      cartography.applyFilterToGetFeatureInfo = (this.layerForm.value.applyFilterToGetFeatureInfo) ? true : false;
      cartography.applyFilterToSpatialSelection = (this.layerForm.value.applyFilterToSpatialSelection) ? true : false;
      cartography.queryableFeatureEnabled = this.layerForm.value.queryableFeatureEnabled;
      cartography.useAllStyles = this.layerForm.value.useAllStyles;

      if (cartography.queryableFeatureAvailable == null) { cartography.queryableFeatureAvailable = false }
      else { cartography.queryableFeatureAvailable = this.layerForm.value.queryableFeatureAvailable };//


      cartography.selectionService = spatialService
      if (this.layerForm.value.queryableLayers != null) { cartography.queryableLayers = this.layerForm.value.queryableLayers.split(",") };
      cartography.thematic = this.layerForm.value.thematic,
        cartography.blocked = !this.layerForm.value.blocked;
      cartography.selectableFeatureEnabled = this.layerForm.value.selectableFeatureEnabled;
      if (this.layerForm.value.selectableLayers != null) { cartography.selectableLayers = this.layerForm.value.selectableLayers.split(",") };
      //
      cartography.connection = null;
      cartography._links = this.layerForm.value._links

      this.cartographyService.save(cartography)
        .subscribe(async resp => {

          this.layerToEdit = resp;
          this.layerID = resp.id;
          this.layerForm.patchValue({
            id: resp.id,
            _links: resp._links
          })
          this.firstSaveDone = true;
          this.utils.saveTranslation(resp.id, this.translationMap, this.layerToEdit.description, this.translationsModified);
          this.translationsModified = false;

          this.getAllElementsEventParameters.next('save');
          this.getAllElementsEventSpatialConfigurations.next('save');
          this.getAllElementsTerritorialFilter.next('save');
          this.getAllElementsEventTerritories.next('save');
          this.getAllElementsEventLayersConfigurations.next('save');
          this.getAllElementsEventStyles.next('save');
          // this.getAllElementsEventNodes.next(true);
          this.dataUpdatedEventNodes.next(true);

        },
          error => { console.log(error) });
    }
    else {
      this.utils.showRequiredFieldsError();
    }

  }


  showStylesError() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = "Error"
    dialogRef.componentInstance.message = this.utils.getTranslate("errorMoreThanOneStyleByDefault")
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
  }

}