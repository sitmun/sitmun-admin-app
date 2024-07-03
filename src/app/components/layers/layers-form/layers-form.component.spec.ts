import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayersFormComponent } from './layers-form.component';
import { RouterModule } from '@angular/router';
import {
  CartographyService, ServiceService, TerritoryTypeService, ConnectionService, TreeNodeService,
  TerritoryService, CartographyGroupService, CartographyAvailabilityService, CartographyParameterService, TranslationService,
  CodeListService, CartographyFilterService, GetInfoService, ResourceService, ExternalService, CartographyStyleService, CartographySpatialSelectionParameterService
} from '../../../frontend-core/src/lib/public_api';
import { SitmunFrontendGuiModule } from '../../../frontend-gui/src/lib/public_api';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../material-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('LayersFormComponent', () => {
  let component: LayersFormComponent;
  let fixture: ComponentFixture<LayersFormComponent>;
  let cartographyService: CartographyService;
  let serviceService: ServiceService;
  let connectionService: ConnectionService;
  let codeListService: CodeListService;
  let cartographyGroupService: CartographyGroupService;
  let territoryTypeService: TerritoryTypeService;
  let treeNodeService: TreeNodeService;
  let territoryService: TerritoryService;
  let getInfoService: GetInfoService;
  let cartographyAvailabilityService: CartographyAvailabilityService;
  let cartographyParameterService: CartographyParameterService;
  let cartographySpatialSelectionParameterService: CartographySpatialSelectionParameterService;
  let cartographyFilterService: CartographyFilterService;
  let cartographyStyleService: CartographyStyleService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayersFormComponent],
      imports: [FormsModule, ReactiveFormsModule, RouterModule.forRoot([]), HttpClientTestingModule, SitmunFrontendGuiModule,
        RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule],
      providers: [CartographyService, ServiceService, ConnectionService, TerritoryTypeService,
        TreeNodeService, GetInfoService, CartographyStyleService, TerritoryService, CartographyGroupService, CartographyAvailabilityService,
        CartographyParameterService, CartographySpatialSelectionParameterService, CodeListService, CartographyFilterService, TranslationService, ResourceService, ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayersFormComponent);
    component = fixture.componentInstance;
    cartographyService = TestBed.inject(CartographyService);
    serviceService = TestBed.inject(ServiceService);
    connectionService = TestBed.inject(ConnectionService);
    codeListService = TestBed.inject(CodeListService);
    cartographyGroupService = TestBed.inject(CartographyGroupService);
    territoryTypeService = TestBed.inject(TerritoryTypeService);
    treeNodeService = TestBed.inject(TreeNodeService);
    territoryService = TestBed.inject(TerritoryService);
    getInfoService = TestBed.inject(GetInfoService);
    cartographyAvailabilityService = TestBed.inject(CartographyAvailabilityService);
    cartographyParameterService = TestBed.inject(CartographyParameterService);
    cartographySpatialSelectionParameterService = TestBed.inject(CartographySpatialSelectionParameterService);
    cartographyFilterService = TestBed.inject(CartographyFilterService);
    cartographyStyleService = TestBed.inject(CartographyStyleService);
    translationService = TestBed.inject(TranslationService);
    resourceService = TestBed.inject(ResourceService);
    externalService = TestBed.inject(ExternalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should instantiate cartographyService', () => {
    expect(cartographyService).toBeTruthy();
  });

  it('should instantiate serviceService', () => {
    expect(serviceService).toBeTruthy();
  });

  it('should instantiate connectionService', () => {
    expect(connectionService).toBeTruthy();
  });

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
  });

  it('should instantiate cartographyGroupService', () => {
    expect(cartographyGroupService).toBeTruthy();
  });

  it('should instantiate territoryTypeService', () => {
    expect(territoryTypeService).toBeTruthy();
  });

  it('should instantiate treeNodeService', () => {
    expect(treeNodeService).toBeTruthy();
  });

  it('should instantiate territoryService', () => {
    expect(territoryService).toBeTruthy();
  });

  it('should instantiate getInfoService', () => {
    expect(getInfoService).toBeTruthy();
  });

  it('should instantiate cartographyAvailabilityService', () => {
    expect(cartographyAvailabilityService).toBeTruthy();
  });

  it('should instantiate cartographyParameterService', () => {
    expect(cartographyParameterService).toBeTruthy();
  });

  it('should instantiate cartographySpatialSelectionParameterService', () => {
    expect(cartographySpatialSelectionParameterService).toBeTruthy();
  });

  it('should instantiate cartographyFilterService', () => {
    expect(cartographyFilterService).toBeTruthy();
  });

  it('should instantiate cartographyStyleService', () => {
    expect(cartographyStyleService).toBeTruthy();
  });

  it('should instantiate translationService', () => {
    expect(translationService).toBeTruthy();
  });

  it('should instantiate resourceService', () => {
    expect(resourceService).toBeTruthy();
  });

  it('should instantiate externalService', () => {
    expect(externalService).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.layerForm.valid).toBeFalsy();
  });

  it('form invalid when mid-empty', () => {
    component.layerForm.patchValue({
      service: 1,
      layers: ['layer'],
      minimumScale: 10,
      maximumScale: 20,
      geometryType: 30,
      order: 1,
      transparency: '50',
      metadataURL: 'url',
      legendType: 1,
      legendUrl: 'url',
      source: 'source',
      description: 'description',
      datasetURL: 'dataset',
      applyFilterToGetMap: true,
      applyFilterToGetFeatureInfo: true,
      applyFilterToSpatialSelection: true,
      queryableFeatureEnabled: true,
      queryableFeatureAvailable: true,
      queryableLayers: true,
      thematic: true,
      blocked: true,
      selectableFeatureEnabled: true,
      spatialSelectionService: 1,
      selectableLayers: 'layerSelected',
      spatialSelectionConnection: 'connection',
      useAllStyles: true,
    })
    //Miss name
    expect(component.layerForm.valid).toBeFalsy();
  });

  it('form valid', () => {
    component.layerForm.patchValue({
      name: 'name',
      service: 1,
      layers: ['layer'],
      minimumScale: 10,
      maximumScale: 20,
      geometryType: 30,
      order: 1,
      transparency: '50',
      metadataURL: 'url',
      legendType: 1,
      legendUrl: 'url',
      source: 'source',
      description: 'description',
      datasetURL: 'dataset',
      applyFilterToGetMap: true,
      applyFilterToGetFeatureInfo: true,
      applyFilterToSpatialSelection: true,
      queryableFeatureEnabled: true,
      queryableFeatureAvailable: true,
      queryableLayers: true,
      thematic: true,
      blocked: true,
      selectableFeatureEnabled: true,
      spatialSelectionService: 1,
      selectableLayers: 'layerSelected',
      spatialSelectionConnection: 'connection',
      useAllStyles: true,
    })
    expect(component.layerForm.valid).toBeTruthy();
  });


  it('Layer form fields', () => {
    expect(component.layerForm.get('name')).toBeTruthy();
    expect(component.layerForm.get('service')).toBeTruthy();
    expect(component.layerForm.get('layers')).toBeTruthy();
    expect(component.layerForm.get('minimumScale')).toBeTruthy();
    expect(component.layerForm.get('maximumScale')).toBeTruthy();
    expect(component.layerForm.get('geometryType')).toBeTruthy();
    expect(component.layerForm.get('order')).toBeTruthy();
    expect(component.layerForm.get('transparency')).toBeTruthy();
    expect(component.layerForm.get('metadataURL')).toBeTruthy();
    expect(component.layerForm.get('legendType')).toBeTruthy();
    expect(component.layerForm.get('legendUrl')).toBeTruthy();
    expect(component.layerForm.get('source')).toBeTruthy();
    expect(component.layerForm.get('description')).toBeTruthy();
    expect(component.layerForm.get('datasetURL')).toBeTruthy();
    expect(component.layerForm.get('applyFilterToGetMap')).toBeTruthy();
    expect(component.layerForm.get('applyFilterToGetFeatureInfo')).toBeTruthy();
    expect(component.layerForm.get('applyFilterToSpatialSelection')).toBeTruthy();
    expect(component.layerForm.get('queryableFeatureEnabled')).toBeTruthy();
    expect(component.layerForm.get('queryableFeatureAvailable')).toBeTruthy();
    expect(component.layerForm.get('queryableLayers')).toBeTruthy();
    expect(component.layerForm.get('thematic')).toBeTruthy();
    expect(component.layerForm.get('blocked')).toBeTruthy();
    expect(component.layerForm.get('selectableFeatureEnabled')).toBeTruthy();
    expect(component.layerForm.get('spatialSelectionService')).toBeTruthy();
    expect(component.layerForm.get('selectableLayers')).toBeTruthy();
    expect(component.layerForm.get('spatialSelectionConnection')).toBeTruthy();
    expect(component.layerForm.get('useAllStyles')).toBeTruthy();
  });

  it('Load button disabled', () => {
    component.layerForm.patchValue({
      selectableFeatureEnabled: false,
      spatialSelectionService: 1,
      selectableLayers: 'layer test'
    })

    fixture.detectChanges();

    component.loadButtonDisabled();

    expect(component.disableLoadButton).toBeTrue();
  })

  it('Load button enabled', () => {
    component.layerForm.patchValue({
      selectableFeatureEnabled: true,
      spatialSelectionService: 1,
      selectableLayers: 'layer test'
    })

    fixture.detectChanges();

    component.loadButtonDisabled();

    expect(component.disableLoadButton).toBeFalse();
  })

  it('getFeature valid', () => {
    let requestResult =
    {
      "xsd:schema": {
        "elementFormDefault": "qualified",
        "xmlns:patrimoni": "patrimoni",
        "xmlns:produccio_energia": "produccio_energia",
        "xmlns:arbrat": "http://www.diputaciolleida.cat/arbrat",
        "xsd:complexType": {
          "name": "ADRECESVIA_VWType",
          "xsd:complexContent": {
            "xsd:extension": {
              "xsd:sequence": {
                "xsd:element": [{
                  "minOccurs": 1,
                  "name": "FID",
                  "maxOccurs": 1,
                  "type": "xsd:decimal",
                  "nillable": false
                }, {
                  "minOccurs": 1,
                  "name": "ID",
                  "maxOccurs": 1,
                  "type": "xsd:decimal",
                  "nillable": false
                }, {
                  "minOccurs": 1,
                  "name": "COD_MUNI",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": false
                }, {
                  "minOccurs": 1,
                  "name": "COD_VIA",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": false
                }, {
                  "minOccurs": 0,
                  "name": "GEOM",
                  "maxOccurs": 1,
                  "type": "gml:GeometryPropertyType",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "COD_VIA_INE",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "NOM_VIA",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "NOM_VIA_COMPOSAT",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "NUM_INI",
                  "maxOccurs": 1,
                  "type": "xsd:decimal",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "NUM_FI",
                  "maxOccurs": 1,
                  "type": "xsd:decimal",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "COM_INI",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "COM_FI",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "COD_POSTAL",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "REF_CAD",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "PQ",
                  "maxOccurs": 1,
                  "type": "xsd:decimal",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "DATA_CREA",
                  "maxOccurs": 1,
                  "type": "xsd:dateTime",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "DATA_MODIF",
                  "maxOccurs": 1,
                  "type": "xsd:dateTime",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "COD_UP",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "NOM_UP",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "COD_UNIT_P",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 1,
                  "name": "COD_ADR_VIA",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": false
                }]
              },
              "base": "gml:AbstractFeatureType"
            }
          }
        },
        "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
        "xmlns:gml": "http://www.opengis.net/gml/3.2",
        "xmlns:se": "http://www.diputaciolleida.cat/se",
        "xmlns:carrerer": "http://www.diputaciolleida.cat/carrerer",
        "xmlns:duprocim": "http://www.diputaciolleida.cat/duprocim",
        "targetNamespace": "http://www.diputaciolleida.cat/carrerer",
        "xmlns:vespa": "http://www.diputaciolleida.cat/vespa",
        "xmlns:wfs": "http://www.opengis.net/wfs/2.0",
        "xsd:import": {
          "schemaLocation": "https://oden.diputaciolleida.cat/geoserver/schemas/gml/3.2.1/gml.xsd",
          "namespace": "http://www.opengis.net/gml/3.2"
        },
        "xsd:element": {
          "name": "ADRECESVIA_VW",
          "substitutionGroup": "gml:AbstractFeature",
          "type": "carrerer:ADRECESVIA_VWType"
        },
        "xmlns:Oracle": "http://www.opengeospatial.net/",
        "xmlns:xa": "http://www.diputaciolleida.cat",
        "xmlns:mobiliari": "http://www.diputaciolleida.cat/mobiliari",
        "xmlns:topo1m": "http://www.diputaciolleida.cat/topo1m",
        "xmlns:xc": "http://www.diputaciolleida.cat/xc",
        "xmlns:exp_ramaderes": "exp_ramaderes",
        "xmlns:geoparc": "http://www.diputaciolleida.cat/geoparc",
        "xmlns:pc": "http://www.diputaciolleida.cat/pc",
        "xmlns:parceles": "http://www.diputaciolleida.cat/parceles",
        "xmlns:fibraoptica": "sitmun/fibraoptica",
        "xmlns:planejament": "http://www.diputaciolleida.cat/planejament",
        "xmlns:xarxa_camins_public": "https://oden.diputaciolleoda.cat/xarxa_camins_public"
      }
    }

    expect(component.manageGetInfoResults(requestResult,true).length).toEqual(22);

  })

  it('getFeature with non valid format', () => {
    let requestResult =
    {
      "INCORRECT_FORMAT": {
        "elementFormDefault": "qualified",
        "xmlns:patrimoni": "patrimoni",
        "xmlns:produccio_energia": "produccio_energia",
        "xmlns:arbrat": "http://www.diputaciolleida.cat/arbrat",
        "xsd:complexType": {
          "name": "ADRECESVIA_VWType",
          "xsd:complexContent": {
            "xsd:extension": {
              "xsd:sequence": {
                "xsd:element": [{
                  "minOccurs": 1,
                  "name": "FID",
                  "maxOccurs": 1,
                  "type": "xsd:decimal",
                  "nillable": false
                }, {
                  "minOccurs": 1,
                  "name": "ID",
                  "maxOccurs": 1,
                  "type": "xsd:decimal",
                  "nillable": false
                }, {
                  "minOccurs": 1,
                  "name": "COD_MUNI",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": false
                }, {
                  "minOccurs": 1,
                  "name": "COD_VIA",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": false
                }, {
                  "minOccurs": 0,
                  "name": "GEOM",
                  "maxOccurs": 1,
                  "type": "gml:GeometryPropertyType",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "COD_VIA_INE",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "NOM_VIA",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "NOM_VIA_COMPOSAT",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "NUM_INI",
                  "maxOccurs": 1,
                  "type": "xsd:decimal",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "NUM_FI",
                  "maxOccurs": 1,
                  "type": "xsd:decimal",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "COM_INI",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "COM_FI",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "COD_POSTAL",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "REF_CAD",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "PQ",
                  "maxOccurs": 1,
                  "type": "xsd:decimal",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "DATA_CREA",
                  "maxOccurs": 1,
                  "type": "xsd:dateTime",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "DATA_MODIF",
                  "maxOccurs": 1,
                  "type": "xsd:dateTime",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "COD_UP",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "NOM_UP",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 0,
                  "name": "COD_UNIT_P",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": true
                }, {
                  "minOccurs": 1,
                  "name": "COD_ADR_VIA",
                  "maxOccurs": 1,
                  "type": "xsd:string",
                  "nillable": false
                }]
              },
              "base": "gml:AbstractFeatureType"
            }
          }
        },
        "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
        "xmlns:gml": "http://www.opengis.net/gml/3.2",
        "xmlns:se": "http://www.diputaciolleida.cat/se",
        "xmlns:carrerer": "http://www.diputaciolleida.cat/carrerer",
        "xmlns:duprocim": "http://www.diputaciolleida.cat/duprocim",
        "targetNamespace": "http://www.diputaciolleida.cat/carrerer",
        "xmlns:vespa": "http://www.diputaciolleida.cat/vespa",
        "xmlns:wfs": "http://www.opengis.net/wfs/2.0",
        "xsd:import": {
          "schemaLocation": "https://oden.diputaciolleida.cat/geoserver/schemas/gml/3.2.1/gml.xsd",
          "namespace": "http://www.opengis.net/gml/3.2"
        },
        "xsd:element": {
          "name": "ADRECESVIA_VW",
          "substitutionGroup": "gml:AbstractFeature",
          "type": "carrerer:ADRECESVIA_VWType"
        },
        "xmlns:Oracle": "http://www.opengeospatial.net/",
        "xmlns:xa": "http://www.diputaciolleida.cat",
        "xmlns:mobiliari": "http://www.diputaciolleida.cat/mobiliari",
        "xmlns:topo1m": "http://www.diputaciolleida.cat/topo1m",
        "xmlns:xc": "http://www.diputaciolleida.cat/xc",
        "xmlns:exp_ramaderes": "exp_ramaderes",
        "xmlns:geoparc": "http://www.diputaciolleida.cat/geoparc",
        "xmlns:pc": "http://www.diputaciolleida.cat/pc",
        "xmlns:parceles": "http://www.diputaciolleida.cat/parceles",
        "xmlns:fibraoptica": "sitmun/fibraoptica",
        "xmlns:planejament": "http://www.diputaciolleida.cat/planejament",
        "xmlns:xarxa_camins_public": "https://oden.diputaciolleoda.cat/xarxa_camins_public"
      }
    }

    expect(component.manageGetInfoResults(requestResult,true).length).toEqual(0);

  })

});
