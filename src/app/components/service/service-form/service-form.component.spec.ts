import { ServiceFormComponent } from '../service-form/service-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ServiceService, ServiceParameterService, CartographyService, CodeListService, 
  TranslationService, ResourceService, ExternalService, CapabilitiesService, CartographyStyleService } from '../../../frontend-core/src/lib/public_api';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { HttpClientModule } from '@angular/common/http';
import { SitmunFrontendGuiModule } from '../../../frontend-gui/src/lib/public_api';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('ServiceFormComponent', () => {
  let component: ServiceFormComponent;
  let fixture: ComponentFixture<ServiceFormComponent>;
  let serviceService: ServiceService;
  let capabilitiesService: CapabilitiesService;
  let serviceParameterService: ServiceParameterService;
  let codeListService: CodeListService;
  let cartographyService: CartographyService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;
  let cartographyStyleService: CartographyStyleService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceFormComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterModule.forRoot([]), HttpClientModule,
        SitmunFrontendGuiModule, RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule],
      providers: [ServiceService, CapabilitiesService, CartographyStyleService, ServiceParameterService, CartographyService, CodeListService, TranslationService, ResourceService, ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceFormComponent);
    component = fixture.componentInstance;
    serviceService = TestBed.inject(ServiceService);
    capabilitiesService = TestBed.inject(CapabilitiesService);
    serviceParameterService = TestBed.inject(ServiceParameterService);
    codeListService = TestBed.inject(CodeListService);
    cartographyService = TestBed.inject(CartographyService);
    cartographyStyleService = TestBed.inject(CartographyStyleService);
    translationService = TestBed.inject(TranslationService);
    resourceService = TestBed.inject(ResourceService);
    externalService = TestBed.inject(ExternalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should instantiate serviceService', () => {
    expect(serviceService).toBeTruthy();
  });

  it('should instantiate capabilitiesService', () => {
    expect(capabilitiesService).toBeTruthy();
  });

  it('should instantiate serviceParameterService', () => {
    expect(serviceParameterService).toBeTruthy();
  });

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
  });

  it('should instantiate cartographyService', () => {
    expect(cartographyService).toBeTruthy();
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
    expect(component.serviceForm.valid).toBeFalsy();
  });

  it('form invalid when mid-empty', () => {
    component.serviceForm.patchValue({
      user: 'user',
      password: 'password',
      passwordSet: true,
      authenticationMode: 1,
      description: 'description',
      type: 1,
      serviceURL: 'urltest',
      proxyUrl: 'urltest',
      supportedSRS: ['EPSG:2831'],
      getInformationURL: 'urltest',
      blocked: true
    })
    //Miss name
    expect(component.serviceForm.valid).toBeFalsy();
  });

  it('form valid', () => {
    component.serviceForm.patchValue({
      name: 'name',
      user: 'user',
      password: 'password',
      passwordSet: true,
      authenticationMode: 1,
      description: 'description',
      type: 1,
      serviceURL: 'urltest',
      proxyUrl: 'urltest',
      supportedSRS: ['EPSG:2831'],
      getInformationURL: 'urltest',
      blocked: true
    })
    expect(component.serviceForm.valid).toBeTruthy();
  });

  it('Service form fields', () => {
    expect(component.serviceForm.get('name')).toBeTruthy();
    expect(component.serviceForm.get('user')).toBeTruthy();
    expect(component.serviceForm.get('password')).toBeTruthy();
    expect(component.serviceForm.get('passwordSet')).toBeTruthy();
    expect(component.serviceForm.get('authenticationMode')).toBeTruthy();
    expect(component.serviceForm.get('description')).toBeTruthy();
    expect(component.serviceForm.get('type')).toBeTruthy();
    expect(component.serviceForm.get('serviceURL')).toBeTruthy();
    expect(component.serviceForm.get('proxyUrl')).toBeTruthy();
    expect(component.serviceForm.get('supportedSRS')).toBeTruthy();
    expect(component.serviceForm.get('getInformationURL')).toBeTruthy();
    expect(component.serviceForm.get('blocked')).toBeTruthy();
  });

  it('Update data button available with type WMS', () => {
    component.serviceForm.patchValue({
      type: 'WMS'
    })

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#capabilitiesButton'))).toBeTruthy();
  });

  it('Update data button unavailable with type different to WMS', () => {
    component.serviceForm.patchValue({
      type: 'WFS'
    })

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#capabilitiesButton'))).toBeFalsy();
  })

  it('Capabilities format invalid', () => {
    //When we click on load button, data to be processed is stored on serviceCapabilitiesData
    component.serviceCapabilitiesData = null;

    expect(component.getCapabilitiesLayers.length).toEqual(0);
  })

  it('Capabilities format valid with WMS_CAPABILITIES', () => {
    //When we click on load button, data to be processed is stored on serviceCapabilitiesData
    component.serviceCapabilitiesData = {
      "WMS_Capabilities": {
        "xmlns:inspire_common": "http://inspire.ec.europa.eu/schemas/common/1.0",
        "xmlns:srv": "http://schemas.opengis.net/iso/19139/20060504/srv/srv.xsd",
        "updateSequence": 1211,
        "Capability": {
          "inspire_vs:ExtendedCapabilities": {
            "inspire_common:MetadataUrl": {
              "inspire_common:MediaType": "application/vnd.ogc.csw.GetRecordByIdResponse_xml",
              "xsi:type": "inspire_common:resourceLocatorType",
              "inspire_common:URL": "http://ideadif.adif.es/catalog/srv/spa/csw-inspire?SERVICE=CSW"
            },
            "inspire_common:SupportedLanguages": {
              "xsi:type": "inspire_common:supportedLanguagesType",
              "inspire_common:DefaultLanguage": {
                "inspire_common:Language": "spa"
              },
              "inspire_common:SupportedLanguage": {
                "inspire_common:Language": "spa"
              }
            },
            "inspire_common:ResponseLanguage": {
              "inspire_common:Language": "spa"
            }
          },
          "Request": {
            "GetFeatureInfo": {
              "DCPType": {
                "HTTP": {
                  "Get": {
                    "OnlineResource": {
                      "xlink:type": "simple",
                      "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?SERVICE=WMS&"
                    }
                  }
                }
              },
              "Format": ["text/plain", "application/vnd.ogc.gml", "text/xml", "application/vnd.ogc.gml/3.1.1", "text/xml; subtype=gml/3.1.1", "text/html", "application/json"]
            },
            "GetCapabilities": {
              "DCPType": {
                "HTTP": {
                  "Post": {
                    "OnlineResource": {
                      "xlink:type": "simple",
                      "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?SERVICE=WMS&"
                    }
                  },
                  "Get": {
                    "OnlineResource": {
                      "xlink:type": "simple",
                      "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?SERVICE=WMS&"
                    }
                  }
                }
              },
              "Format": "text/xml"
            },
            "GetMap": {
              "DCPType": {
                "HTTP": {
                  "Get": {
                    "OnlineResource": {
                      "xlink:type": "simple",
                      "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?SERVICE=WMS&"
                    }
                  }
                }
              },
              "Format": ["image/png", "application/atom+xml", "application/pdf", "application/rss+xml", "application/vnd.google-earth.kml+xml", "application/vnd.google-earth.kml+xml;mode=networklink", "application/vnd.google-earth.kmz", "image/geotiff", "image/geotiff8", "image/gif", "image/jpeg", "image/png; mode=8bit", "image/svg+xml", "image/tiff", "image/tiff8", "text/html; subtype=openlayers"]
            }
          },
          "Layer": {
            "CRS": ["AUTO:42001", "AUTO:42002", "AUTO:42003", "AUTO:42004", "EPSG:WGS84(DD)", "EPSG:2000", "EPSG:2001", "EPSG:2002", "EPSG:2003", "EPSG:42305", "EPSG:42304", "EPSG:42303", "EPSG:404000", "CRS:84"],
            "Abstract": "A compliant implementation of WMS plus most of the SLD extension (dynamic styling). Can also generate PDF, SVG, KML, GeoRSS",
            "EX_GeographicBoundingBox": {
              "northBoundLatitude": 46.44896581305109,
              "southBoundLatitude": 33.40424290324293,
              "westBoundLongitude": -9.31296168027681,
              "eastBoundLongitude": 3.731761229531348
            },
            "BoundingBox": {
              "miny": 33.40424290324293,
              "CRS": "CRS:84",
              "minx": -9.31296168027681,
              "maxy": 46.44896581305109,
              "maxx": 3.731761229531348
            },
            "Title": "IDEADIF - GeoServer WMS",
            "Layer": [{
              "queryable": 1,
              "CRS": "EPSG:25830",
              "Abstract": "Layer-Group type layer: TramificacionComun",
              "EX_GeographicBoundingBox": {
                "northBoundLatitude": 43.84151042654228,
                "southBoundLatitude": 36.01411970122112,
                "westBoundLongitude": -8.872469825313877,
                "eastBoundLongitude": 3.291076542431359
              },
              "BoundingBox": {
                "miny": 4000184.9189999998,
                "CRS": "EPSG:25830",
                "minx": 26701.903500000015,
                "maxy": 4854291.6436,
                "maxx": 1007231.0502000004
              },
              "Title": "Tramificacion Comun",
              "MetadataURL": [{
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/7b6a0fdc-bcc4-40e9-a913-74fc6ef10914"
                },
                "Format": "text/plain",
                "type": 19139
              }, {
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/8385b48c-2bac-42ea-a319-054d6755af12"
                },
                "Format": "text/plain",
                "type": 19139
              }],
              "Name": "TramificacionComun"
            }, {
              "queryable": 1,
              "opaque": 1,
              "CRS": ["EPSG:25830", "CRS:84"],
              "Abstract": "",
              "EX_GeographicBoundingBox": {
                "northBoundLatitude": 43.87073628057826,
                "southBoundLatitude": 35.976683871739915,
                "westBoundLongitude": -8.933871794285512,
                "eastBoundLongitude": 3.3513063935021052
              },
              "BoundingBox": [{
                "miny": 35.976683871739915,
                "CRS": "CRS:84",
                "minx": -8.933871794285512,
                "maxy": 43.87073628057826,
                "maxx": 3.3513063935021052
              }, {
                "miny": 3996282.0,
                "CRS": "EPSG:25830",
                "minx": 21960.076171875,
                "maxy": 4857537.5,
                "maxx": 1011867.125
              }],
              "KeywordList": {
                "Keyword": ["features", "dependencias", "Adif", "IDEADIF", "Tramificación Común"]
              },
              "Title": "Dependencias",
              "Style": [{
                "Title": "IDEADIF Node Style",
                "LegendURL": {
                  "OnlineResource": {
                    "xlink:type": "simple",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=Dependencias"
                  },
                  "Format": "image/png",
                  "width": 20,
                  "height": 20
                },
                "Name": "Tramificacion:IDEADIF Node"
              }, {
                "Title": "IDEADIF Node Style",
                "LegendURL": {
                  "OnlineResource": {
                    "xlink:type": "simple",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=Dependencias&style=IDEADIF+Node"
                  },
                  "Format": "image/png",
                  "width": 20,
                  "height": 20
                },
                "Name": "Tramificacion:IDEADIF Node"
              }],
              "MetadataURL": [{
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/8385b48c-2bac-42ea-a319-054d6755af12"
                },
                "Format": "text/plain",
                "type": 19139
              }, {
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/7b6a0fdc-bcc4-40e9-a913-74fc6ef10914"
                },
                "Format": "text/plain",
                "type": 19139
              }],
              "Name": "Dependencias"
            }, {
              "queryable": 1,
              "opaque": 0,
              "CRS": ["EPSG:25830", "CRS:84"],
              "Abstract": "",
              "EX_GeographicBoundingBox": {
                "northBoundLatitude": 43.87774788312506,
                "southBoundLatitude": 35.976282037081944,
                "westBoundLongitude": -8.93544441522613,
                "eastBoundLongitude": 3.3553277464618696
              },
              "BoundingBox": [{
                "miny": 35.976282037081944,
                "CRS": "CRS:84",
                "minx": -8.93544441522613,
                "maxy": 43.87774788312506,
                "maxx": 3.3553277464618696
              }, {
                "miny": 3996252.75,
                "CRS": "EPSG:25830",
                "minx": 21888.685546875,
                "maxy": 4858316.5,
                "maxx": 1012133.25
              }],
              "KeywordList": {
                "Keyword": ["features", "pks", "Tramificación Común", "Tramificación", "Pk", "Puntos kilométricos", "IDEADIF", "Adif"]
              },
              "Title": "Puntos kilometricos teoricos",
              "Style": {
                "Abstract": "A sample style that draws a point",
                "Title": "Default Point",
                "LegendURL": {
                  "OnlineResource": {
                    "xlink:type": "simple",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=PKTeoricos"
                  },
                  "Format": "image/png",
                  "width": 20,
                  "height": 20
                },
                "Name": "point"
              },
              "MetadataURL": [{
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/8385b48c-2bac-42ea-a319-054d6755af12"
                },
                "Format": "text/plain",
                "type": 19139
              }, {
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/7b6a0fdc-bcc4-40e9-a913-74fc6ef10914"
                },
                "Format": "text/plain",
                "type": 19139
              }],
              "Name": "PKTeoricos"
            }, {
              "queryable": 1,
              "opaque": 0,
              "CRS": ["EPSG:25830", "CRS:84"],
              "Abstract": "",
              "EX_GeographicBoundingBox": {
                "northBoundLatitude": 43.65437766927871,
                "southBoundLatitude": 36.53235585913574,
                "westBoundLongitude": -8.914655683594248,
                "eastBoundLongitude": 3.3319200917149243
              },
              "BoundingBox": [{
                "miny": 36.53235585913574,
                "CRS": "CRS:84",
                "minx": -8.914655683594248,
                "maxy": 43.65437766927871,
                "maxx": 3.3319200917149243
              }, {
                "miny": 4058239.25,
                "CRS": "EPSG:25830",
                "minx": 21799.255859375,
                "maxy": 4833508.0,
                "maxx": 1012133.6875
              }],
              "KeywordList": {
                "Keyword": ["Fuera_Servicio", "features", "Tramos", "Fuera de servicio", "IDEADIF", "Adif", "Tramificación común", "Tramificación"]
              },
              "Title": "Tramos fuera de servicio",
              "Style": {
                "Title": "IDEADIF Link Style",
                "LegendURL": {
                  "OnlineResource": {
                    "xlink:type": "simple",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=TramosFueraServicio"
                  },
                  "Format": "image/png",
                  "width": 20,
                  "height": 20
                },
                "Name": "Tramificacion:IDEADIF Link"
              },
              "MetadataURL": [{
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/8385b48c-2bac-42ea-a319-054d6755af12"
                },
                "Format": "text/plain",
                "type": 19139
              }, {
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/7b6a0fdc-bcc4-40e9-a913-74fc6ef10914"
                },
                "Format": "text/plain",
                "type": 19139
              }],
              "Name": "TramosFueraServicio"
            }, {
              "queryable": 1,
              "opaque": 0,
              "CRS": ["EPSG:25830", "CRS:84"],
              "Abstract": "",
              "EX_GeographicBoundingBox": {
                "northBoundLatitude": 46.44896581305109,
                "southBoundLatitude": 33.40424290324293,
                "westBoundLongitude": -9.31296168027681,
                "eastBoundLongitude": 3.731761229531348
              },
              "BoundingBox": [{
                "miny": 33.40424290324293,
                "CRS": "CRS:84",
                "minx": -9.31296168027681,
                "maxy": 46.44896581305109,
                "maxx": 3.731761229531348
              }, {
                "miny": 3995914.25,
                "CRS": "EPSG:25830",
                "minx": 21799.255859375,
                "maxy": 4858562.5,
                "maxx": 1012133.6875
              }],
              "KeywordList": {
                "Keyword": ["Tramificacion", "features", "Tramos", "Tramos en servicio", "IDEADIF", "Adif"]
              },
              "Title": "Tramos en servicio",
              "Style": {
                "Title": "IDEADIF Link Style",
                "LegendURL": {
                  "OnlineResource": {
                    "xlink:type": "simple",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=TramosServicio"
                  },
                  "Format": "image/png",
                  "width": 20,
                  "height": 20
                },
                "Name": "Tramificacion:IDEADIF Link"
              },
              "MetadataURL": [{
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/8385b48c-2bac-42ea-a319-054d6755af12"
                },
                "Format": "text/plain",
                "type": 19139
              }, {
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/7b6a0fdc-bcc4-40e9-a913-74fc6ef10914"
                },
                "Format": "text/plain",
                "type": 19139
              }],
              "Name": "TramosServicio"
            }]
          },
          "Exception": {
            "Format": ["XML", "INIMAGE", "BLANK"]
          }
        },
        "xsi:schemaLocation": "http://www.opengis.net/wms http://ideadif.adif.es:80/gservices/schemas/wms/1.3.0/capabilities_1_3_0.xsd http://inspire.ec.europa.eu/schemas/inspire_vs/1.0 http://ideadif.adif.es:80/gservices/www/inspire/inspire_vs.xsd",
        "Service": {
          "OnlineResource": {
            "xlink:type": "simple",
            "xlink:href": "http://geoserver.sourceforge.net/html/index.php"
          },
          "AccessConstraints": "NONE",
          "Abstract": "A compliant implementation of WMS plus most of the SLD extension (dynamic styling). Can also generate PDF, SVG, KML, GeoRSS",
          "KeywordList": {
            "Keyword": ["WFS", "WMS", "GEOSERVER"]
          },
          "Title": "IDEADIF - GeoServer WMS",
          "Fees": "NONE",
          "ContactInformation": {
            "ContactAddress": {
              "Address": "C/Paseo de las Delicias, 61",
              "StateOrProvince": "",
              "Country": "España",
              "City": "Madrid",
              "AddressType": "Dirección de Sistemas y Tecnologías de la Información",
              "PostCode": 28045
            },
            "ContactVoiceTelephone": "",
            "ContactFacsimileTelephone": "",
            "ContactPosition": "Responsable de SIG IDEADIF",
            "ContactElectronicMailAddress": "ideadif@adif.es",
            "ContactPersonPrimary": {
              "ContactOrganization": "Adif",
              "ContactPerson": "Adm."
            }
          },
          "Name": "WMS"
        },
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "version": "1.3.0",
        "xmlns:gco": "http://schemas.opengis.net/iso/19139/20060504/gco/gco.xsd",
        "xmlns:inspire_vs": "http://inspire.ec.europa.eu/schemas/inspire_vs/1.0",
        "xmlns:gml": "http://schemas.opengis.net/gml",
        "xmlns": "http://www.opengis.net/wms",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        "xmlns:gmd": "http://schemas.opengis.net/iso/19139/20060504/gmd/gmd.xsd"
      }
    };

    component.changeServiceDataByCapabilities(true, false);

    expect(component.getCapabilitiesLayers.length).toEqual(5);

  })

  it('Capabilities format valid with WMT_MS_Capabilities', () => {
    //When we click on load button, data to be processed is stored on serviceCapabilitiesData
    component.serviceCapabilitiesData = {
      "WMT_MS_Capabilities": {
        "xmlns:inspire_common": "http://inspire.ec.europa.eu/schemas/common/1.0",
        "xmlns:srv": "http://schemas.opengis.net/iso/19139/20060504/srv/srv.xsd",
        "updateSequence": 1211,
        "Capability": {
          "inspire_vs:ExtendedCapabilities": {
            "inspire_common:MetadataUrl": {
              "inspire_common:MediaType": "application/vnd.ogc.csw.GetRecordByIdResponse_xml",
              "xsi:type": "inspire_common:resourceLocatorType",
              "inspire_common:URL": "http://ideadif.adif.es/catalog/srv/spa/csw-inspire?SERVICE=CSW"
            },
            "inspire_common:SupportedLanguages": {
              "xsi:type": "inspire_common:supportedLanguagesType",
              "inspire_common:DefaultLanguage": {
                "inspire_common:Language": "spa"
              },
              "inspire_common:SupportedLanguage": {
                "inspire_common:Language": "spa"
              }
            },
            "inspire_common:ResponseLanguage": {
              "inspire_common:Language": "spa"
            }
          },
          "Request": {
            "GetFeatureInfo": {
              "DCPType": {
                "HTTP": {
                  "Get": {
                    "OnlineResource": {
                      "xlink:type": "simple",
                      "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?SERVICE=WMS&"
                    }
                  }
                }
              },
              "Format": ["text/plain", "application/vnd.ogc.gml", "text/xml", "application/vnd.ogc.gml/3.1.1", "text/xml; subtype=gml/3.1.1", "text/html", "application/json"]
            },
            "GetCapabilities": {
              "DCPType": {
                "HTTP": {
                  "Post": {
                    "OnlineResource": {
                      "xlink:type": "simple",
                      "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?SERVICE=WMS&"
                    }
                  },
                  "Get": {
                    "OnlineResource": {
                      "xlink:type": "simple",
                      "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?SERVICE=WMS&"
                    }
                  }
                }
              },
              "Format": "text/xml"
            },
            "GetMap": {
              "DCPType": {
                "HTTP": {
                  "Get": {
                    "OnlineResource": {
                      "xlink:type": "simple",
                      "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?SERVICE=WMS&"
                    }
                  }
                }
              },
              "Format": ["image/png", "application/atom+xml", "application/pdf", "application/rss+xml", "application/vnd.google-earth.kml+xml", "application/vnd.google-earth.kml+xml;mode=networklink", "application/vnd.google-earth.kmz", "image/geotiff", "image/geotiff8", "image/gif", "image/jpeg", "image/png; mode=8bit", "image/svg+xml", "image/tiff", "image/tiff8", "text/html; subtype=openlayers"]
            }
          },
          "Layer": {
            "CRS": ["AUTO:42001", "AUTO:42002", "AUTO:42003", "AUTO:42004", "EPSG:WGS84(DD)", "EPSG:2000", "EPSG:2001", "EPSG:2002", "EPSG:2003", "EPSG:42305", "EPSG:42304", "EPSG:42303", "EPSG:404000", "CRS:84"],
            "Abstract": "A compliant implementation of WMS plus most of the SLD extension (dynamic styling). Can also generate PDF, SVG, KML, GeoRSS",
            "EX_GeographicBoundingBox": {
              "northBoundLatitude": 46.44896581305109,
              "southBoundLatitude": 33.40424290324293,
              "westBoundLongitude": -9.31296168027681,
              "eastBoundLongitude": 3.731761229531348
            },
            "BoundingBox": {
              "miny": 33.40424290324293,
              "CRS": "CRS:84",
              "minx": -9.31296168027681,
              "maxy": 46.44896581305109,
              "maxx": 3.731761229531348
            },
            "Title": "IDEADIF - GeoServer WMS",
            "Layer": [{
              "queryable": 1,
              "CRS": "EPSG:25830",
              "Abstract": "Layer-Group type layer: TramificacionComun",
              "EX_GeographicBoundingBox": {
                "northBoundLatitude": 43.84151042654228,
                "southBoundLatitude": 36.01411970122112,
                "westBoundLongitude": -8.872469825313877,
                "eastBoundLongitude": 3.291076542431359
              },
              "BoundingBox": {
                "miny": 4000184.9189999998,
                "CRS": "EPSG:25830",
                "minx": 26701.903500000015,
                "maxy": 4854291.6436,
                "maxx": 1007231.0502000004
              },
              "Title": "Tramificacion Comun",
              "MetadataURL": [{
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/7b6a0fdc-bcc4-40e9-a913-74fc6ef10914"
                },
                "Format": "text/plain",
                "type": 19139
              }, {
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/8385b48c-2bac-42ea-a319-054d6755af12"
                },
                "Format": "text/plain",
                "type": 19139
              }],
              "Name": "TramificacionComun"
            }, {
              "queryable": 1,
              "opaque": 1,
              "CRS": ["EPSG:25830", "CRS:84"],
              "Abstract": "",
              "EX_GeographicBoundingBox": {
                "northBoundLatitude": 43.87073628057826,
                "southBoundLatitude": 35.976683871739915,
                "westBoundLongitude": -8.933871794285512,
                "eastBoundLongitude": 3.3513063935021052
              },
              "BoundingBox": [{
                "miny": 35.976683871739915,
                "CRS": "CRS:84",
                "minx": -8.933871794285512,
                "maxy": 43.87073628057826,
                "maxx": 3.3513063935021052
              }, {
                "miny": 3996282.0,
                "CRS": "EPSG:25830",
                "minx": 21960.076171875,
                "maxy": 4857537.5,
                "maxx": 1011867.125
              }],
              "KeywordList": {
                "Keyword": ["features", "dependencias", "Adif", "IDEADIF", "Tramificación Común"]
              },
              "Title": "Dependencias",
              "Style": [{
                "Title": "IDEADIF Node Style",
                "LegendURL": {
                  "OnlineResource": {
                    "xlink:type": "simple",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=Dependencias"
                  },
                  "Format": "image/png",
                  "width": 20,
                  "height": 20
                },
                "Name": "Tramificacion:IDEADIF Node"
              }, {
                "Title": "IDEADIF Node Style",
                "LegendURL": {
                  "OnlineResource": {
                    "xlink:type": "simple",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=Dependencias&style=IDEADIF+Node"
                  },
                  "Format": "image/png",
                  "width": 20,
                  "height": 20
                },
                "Name": "Tramificacion:IDEADIF Node"
              }],
              "MetadataURL": [{
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/8385b48c-2bac-42ea-a319-054d6755af12"
                },
                "Format": "text/plain",
                "type": 19139
              }, {
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/7b6a0fdc-bcc4-40e9-a913-74fc6ef10914"
                },
                "Format": "text/plain",
                "type": 19139
              }],
              "Name": "Dependencias"
            }, {
              "queryable": 1,
              "opaque": 0,
              "CRS": ["EPSG:25830", "CRS:84"],
              "Abstract": "",
              "EX_GeographicBoundingBox": {
                "northBoundLatitude": 43.87774788312506,
                "southBoundLatitude": 35.976282037081944,
                "westBoundLongitude": -8.93544441522613,
                "eastBoundLongitude": 3.3553277464618696
              },
              "BoundingBox": [{
                "miny": 35.976282037081944,
                "CRS": "CRS:84",
                "minx": -8.93544441522613,
                "maxy": 43.87774788312506,
                "maxx": 3.3553277464618696
              }, {
                "miny": 3996252.75,
                "CRS": "EPSG:25830",
                "minx": 21888.685546875,
                "maxy": 4858316.5,
                "maxx": 1012133.25
              }],
              "KeywordList": {
                "Keyword": ["features", "pks", "Tramificación Común", "Tramificación", "Pk", "Puntos kilométricos", "IDEADIF", "Adif"]
              },
              "Title": "Puntos kilometricos teoricos",
              "Style": {
                "Abstract": "A sample style that draws a point",
                "Title": "Default Point",
                "LegendURL": {
                  "OnlineResource": {
                    "xlink:type": "simple",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=PKTeoricos"
                  },
                  "Format": "image/png",
                  "width": 20,
                  "height": 20
                },
                "Name": "point"
              },
              "MetadataURL": [{
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/8385b48c-2bac-42ea-a319-054d6755af12"
                },
                "Format": "text/plain",
                "type": 19139
              }, {
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/7b6a0fdc-bcc4-40e9-a913-74fc6ef10914"
                },
                "Format": "text/plain",
                "type": 19139
              }],
              "Name": "PKTeoricos"
            }, {
              "queryable": 1,
              "opaque": 0,
              "CRS": ["EPSG:25830", "CRS:84"],
              "Abstract": "",
              "EX_GeographicBoundingBox": {
                "northBoundLatitude": 43.65437766927871,
                "southBoundLatitude": 36.53235585913574,
                "westBoundLongitude": -8.914655683594248,
                "eastBoundLongitude": 3.3319200917149243
              },
              "BoundingBox": [{
                "miny": 36.53235585913574,
                "CRS": "CRS:84",
                "minx": -8.914655683594248,
                "maxy": 43.65437766927871,
                "maxx": 3.3319200917149243
              }, {
                "miny": 4058239.25,
                "CRS": "EPSG:25830",
                "minx": 21799.255859375,
                "maxy": 4833508.0,
                "maxx": 1012133.6875
              }],
              "KeywordList": {
                "Keyword": ["Fuera_Servicio", "features", "Tramos", "Fuera de servicio", "IDEADIF", "Adif", "Tramificación común", "Tramificación"]
              },
              "Title": "Tramos fuera de servicio",
              "Style": {
                "Title": "IDEADIF Link Style",
                "LegendURL": {
                  "OnlineResource": {
                    "xlink:type": "simple",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=TramosFueraServicio"
                  },
                  "Format": "image/png",
                  "width": 20,
                  "height": 20
                },
                "Name": "Tramificacion:IDEADIF Link"
              },
              "MetadataURL": [{
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/8385b48c-2bac-42ea-a319-054d6755af12"
                },
                "Format": "text/plain",
                "type": 19139
              }, {
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/7b6a0fdc-bcc4-40e9-a913-74fc6ef10914"
                },
                "Format": "text/plain",
                "type": 19139
              }],
              "Name": "TramosFueraServicio"
            }, {
              "queryable": 1,
              "opaque": 0,
              "CRS": ["EPSG:25830", "CRS:84"],
              "Abstract": "",
              "EX_GeographicBoundingBox": {
                "northBoundLatitude": 46.44896581305109,
                "southBoundLatitude": 33.40424290324293,
                "westBoundLongitude": -9.31296168027681,
                "eastBoundLongitude": 3.731761229531348
              },
              "BoundingBox": [{
                "miny": 33.40424290324293,
                "CRS": "CRS:84",
                "minx": -9.31296168027681,
                "maxy": 46.44896581305109,
                "maxx": 3.731761229531348
              }, {
                "miny": 3995914.25,
                "CRS": "EPSG:25830",
                "minx": 21799.255859375,
                "maxy": 4858562.5,
                "maxx": 1012133.6875
              }],
              "KeywordList": {
                "Keyword": ["Tramificacion", "features", "Tramos", "Tramos en servicio", "IDEADIF", "Adif"]
              },
              "Title": "Tramos en servicio",
              "Style": {
                "Title": "IDEADIF Link Style",
                "LegendURL": {
                  "OnlineResource": {
                    "xlink:type": "simple",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=TramosServicio"
                  },
                  "Format": "image/png",
                  "width": 20,
                  "height": 20
                },
                "Name": "Tramificacion:IDEADIF Link"
              },
              "MetadataURL": [{
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/8385b48c-2bac-42ea-a319-054d6755af12"
                },
                "Format": "text/plain",
                "type": 19139
              }, {
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/7b6a0fdc-bcc4-40e9-a913-74fc6ef10914"
                },
                "Format": "text/plain",
                "type": 19139
              }],
              "Name": "TramosServicio"
            }]
          },
          "Exception": {
            "Format": ["XML", "INIMAGE", "BLANK"]
          }
        },
        "xsi:schemaLocation": "http://www.opengis.net/wms http://ideadif.adif.es:80/gservices/schemas/wms/1.3.0/capabilities_1_3_0.xsd http://inspire.ec.europa.eu/schemas/inspire_vs/1.0 http://ideadif.adif.es:80/gservices/www/inspire/inspire_vs.xsd",
        "Service": {
          "OnlineResource": {
            "xlink:type": "simple",
            "xlink:href": "http://geoserver.sourceforge.net/html/index.php"
          },
          "AccessConstraints": "NONE",
          "Abstract": "A compliant implementation of WMS plus most of the SLD extension (dynamic styling). Can also generate PDF, SVG, KML, GeoRSS",
          "KeywordList": {
            "Keyword": ["WFS", "WMS", "GEOSERVER"]
          },
          "Title": "IDEADIF - GeoServer WMS",
          "Fees": "NONE",
          "ContactInformation": {
            "ContactAddress": {
              "Address": "C/Paseo de las Delicias, 61",
              "StateOrProvince": "",
              "Country": "España",
              "City": "Madrid",
              "AddressType": "Dirección de Sistemas y Tecnologías de la Información",
              "PostCode": 28045
            },
            "ContactVoiceTelephone": "",
            "ContactFacsimileTelephone": "",
            "ContactPosition": "Responsable de SIG IDEADIF",
            "ContactElectronicMailAddress": "ideadif@adif.es",
            "ContactPersonPrimary": {
              "ContactOrganization": "Adif",
              "ContactPerson": "Adm."
            }
          },
          "Name": "WMS"
        },
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "version": "1.3.0",
        "xmlns:gco": "http://schemas.opengis.net/iso/19139/20060504/gco/gco.xsd",
        "xmlns:inspire_vs": "http://inspire.ec.europa.eu/schemas/inspire_vs/1.0",
        "xmlns:gml": "http://schemas.opengis.net/gml",
        "xmlns": "http://www.opengis.net/wms",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        "xmlns:gmd": "http://schemas.opengis.net/iso/19139/20060504/gmd/gmd.xsd"
      }
    };

    component.changeServiceDataByCapabilities(true, false);

    expect(component.getCapabilitiesLayers.length).toEqual(5);
  })

  it('Capabilities format invalid with random name', () => {
    //When we click on load button, data to be processed is stored on serviceCapabilitiesData
    component.serviceCapabilitiesData = {
      "randomName": {
        "xmlns:inspire_common": "http://inspire.ec.europa.eu/schemas/common/1.0",
        "xmlns:srv": "http://schemas.opengis.net/iso/19139/20060504/srv/srv.xsd",
        "updateSequence": 1211,
        "Capability": {
          "inspire_vs:ExtendedCapabilities": {
            "inspire_common:MetadataUrl": {
              "inspire_common:MediaType": "application/vnd.ogc.csw.GetRecordByIdResponse_xml",
              "xsi:type": "inspire_common:resourceLocatorType",
              "inspire_common:URL": "http://ideadif.adif.es/catalog/srv/spa/csw-inspire?SERVICE=CSW"
            },
            "inspire_common:SupportedLanguages": {
              "xsi:type": "inspire_common:supportedLanguagesType",
              "inspire_common:DefaultLanguage": {
                "inspire_common:Language": "spa"
              },
              "inspire_common:SupportedLanguage": {
                "inspire_common:Language": "spa"
              }
            },
            "inspire_common:ResponseLanguage": {
              "inspire_common:Language": "spa"
            }
          },
          "Request": {
            "GetFeatureInfo": {
              "DCPType": {
                "HTTP": {
                  "Get": {
                    "OnlineResource": {
                      "xlink:type": "simple",
                      "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?SERVICE=WMS&"
                    }
                  }
                }
              },
              "Format": ["text/plain", "application/vnd.ogc.gml", "text/xml", "application/vnd.ogc.gml/3.1.1", "text/xml; subtype=gml/3.1.1", "text/html", "application/json"]
            },
            "GetCapabilities": {
              "DCPType": {
                "HTTP": {
                  "Post": {
                    "OnlineResource": {
                      "xlink:type": "simple",
                      "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?SERVICE=WMS&"
                    }
                  },
                  "Get": {
                    "OnlineResource": {
                      "xlink:type": "simple",
                      "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?SERVICE=WMS&"
                    }
                  }
                }
              },
              "Format": "text/xml"
            },
            "GetMap": {
              "DCPType": {
                "HTTP": {
                  "Get": {
                    "OnlineResource": {
                      "xlink:type": "simple",
                      "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?SERVICE=WMS&"
                    }
                  }
                }
              },
              "Format": ["image/png", "application/atom+xml", "application/pdf", "application/rss+xml", "application/vnd.google-earth.kml+xml", "application/vnd.google-earth.kml+xml;mode=networklink", "application/vnd.google-earth.kmz", "image/geotiff", "image/geotiff8", "image/gif", "image/jpeg", "image/png; mode=8bit", "image/svg+xml", "image/tiff", "image/tiff8", "text/html; subtype=openlayers"]
            }
          },
          "Layer": {
            "CRS": ["AUTO:42001", "AUTO:42002", "AUTO:42003", "AUTO:42004", "EPSG:WGS84(DD)", "EPSG:2000", "EPSG:2001", "EPSG:2002", "EPSG:2003", "EPSG:42305", "EPSG:42304", "EPSG:42303", "EPSG:404000", "CRS:84"],
            "Abstract": "A compliant implementation of WMS plus most of the SLD extension (dynamic styling). Can also generate PDF, SVG, KML, GeoRSS",
            "EX_GeographicBoundingBox": {
              "northBoundLatitude": 46.44896581305109,
              "southBoundLatitude": 33.40424290324293,
              "westBoundLongitude": -9.31296168027681,
              "eastBoundLongitude": 3.731761229531348
            },
            "BoundingBox": {
              "miny": 33.40424290324293,
              "CRS": "CRS:84",
              "minx": -9.31296168027681,
              "maxy": 46.44896581305109,
              "maxx": 3.731761229531348
            },
            "Title": "IDEADIF - GeoServer WMS",
            "Layer": [{
              "queryable": 1,
              "CRS": "EPSG:25830",
              "Abstract": "Layer-Group type layer: TramificacionComun",
              "EX_GeographicBoundingBox": {
                "northBoundLatitude": 43.84151042654228,
                "southBoundLatitude": 36.01411970122112,
                "westBoundLongitude": -8.872469825313877,
                "eastBoundLongitude": 3.291076542431359
              },
              "BoundingBox": {
                "miny": 4000184.9189999998,
                "CRS": "EPSG:25830",
                "minx": 26701.903500000015,
                "maxy": 4854291.6436,
                "maxx": 1007231.0502000004
              },
              "Title": "Tramificacion Comun",
              "MetadataURL": [{
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/7b6a0fdc-bcc4-40e9-a913-74fc6ef10914"
                },
                "Format": "text/plain",
                "type": 19139
              }, {
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/8385b48c-2bac-42ea-a319-054d6755af12"
                },
                "Format": "text/plain",
                "type": 19139
              }],
              "Name": "TramificacionComun"
            }, {
              "queryable": 1,
              "opaque": 1,
              "CRS": ["EPSG:25830", "CRS:84"],
              "Abstract": "",
              "EX_GeographicBoundingBox": {
                "northBoundLatitude": 43.87073628057826,
                "southBoundLatitude": 35.976683871739915,
                "westBoundLongitude": -8.933871794285512,
                "eastBoundLongitude": 3.3513063935021052
              },
              "BoundingBox": [{
                "miny": 35.976683871739915,
                "CRS": "CRS:84",
                "minx": -8.933871794285512,
                "maxy": 43.87073628057826,
                "maxx": 3.3513063935021052
              }, {
                "miny": 3996282.0,
                "CRS": "EPSG:25830",
                "minx": 21960.076171875,
                "maxy": 4857537.5,
                "maxx": 1011867.125
              }],
              "KeywordList": {
                "Keyword": ["features", "dependencias", "Adif", "IDEADIF", "Tramificación Común"]
              },
              "Title": "Dependencias",
              "Style": [{
                "Title": "IDEADIF Node Style",
                "LegendURL": {
                  "OnlineResource": {
                    "xlink:type": "simple",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=Dependencias"
                  },
                  "Format": "image/png",
                  "width": 20,
                  "height": 20
                },
                "Name": "Tramificacion:IDEADIF Node"
              }, {
                "Title": "IDEADIF Node Style",
                "LegendURL": {
                  "OnlineResource": {
                    "xlink:type": "simple",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=Dependencias&style=IDEADIF+Node"
                  },
                  "Format": "image/png",
                  "width": 20,
                  "height": 20
                },
                "Name": "Tramificacion:IDEADIF Node"
              }],
              "MetadataURL": [{
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/8385b48c-2bac-42ea-a319-054d6755af12"
                },
                "Format": "text/plain",
                "type": 19139
              }, {
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/7b6a0fdc-bcc4-40e9-a913-74fc6ef10914"
                },
                "Format": "text/plain",
                "type": 19139
              }],
              "Name": "Dependencias"
            }, {
              "queryable": 1,
              "opaque": 0,
              "CRS": ["EPSG:25830", "CRS:84"],
              "Abstract": "",
              "EX_GeographicBoundingBox": {
                "northBoundLatitude": 43.87774788312506,
                "southBoundLatitude": 35.976282037081944,
                "westBoundLongitude": -8.93544441522613,
                "eastBoundLongitude": 3.3553277464618696
              },
              "BoundingBox": [{
                "miny": 35.976282037081944,
                "CRS": "CRS:84",
                "minx": -8.93544441522613,
                "maxy": 43.87774788312506,
                "maxx": 3.3553277464618696
              }, {
                "miny": 3996252.75,
                "CRS": "EPSG:25830",
                "minx": 21888.685546875,
                "maxy": 4858316.5,
                "maxx": 1012133.25
              }],
              "KeywordList": {
                "Keyword": ["features", "pks", "Tramificación Común", "Tramificación", "Pk", "Puntos kilométricos", "IDEADIF", "Adif"]
              },
              "Title": "Puntos kilometricos teoricos",
              "Style": {
                "Abstract": "A sample style that draws a point",
                "Title": "Default Point",
                "LegendURL": {
                  "OnlineResource": {
                    "xlink:type": "simple",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=PKTeoricos"
                  },
                  "Format": "image/png",
                  "width": 20,
                  "height": 20
                },
                "Name": "point"
              },
              "MetadataURL": [{
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/8385b48c-2bac-42ea-a319-054d6755af12"
                },
                "Format": "text/plain",
                "type": 19139
              }, {
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/7b6a0fdc-bcc4-40e9-a913-74fc6ef10914"
                },
                "Format": "text/plain",
                "type": 19139
              }],
              "Name": "PKTeoricos"
            }, {
              "queryable": 1,
              "opaque": 0,
              "CRS": ["EPSG:25830", "CRS:84"],
              "Abstract": "",
              "EX_GeographicBoundingBox": {
                "northBoundLatitude": 43.65437766927871,
                "southBoundLatitude": 36.53235585913574,
                "westBoundLongitude": -8.914655683594248,
                "eastBoundLongitude": 3.3319200917149243
              },
              "BoundingBox": [{
                "miny": 36.53235585913574,
                "CRS": "CRS:84",
                "minx": -8.914655683594248,
                "maxy": 43.65437766927871,
                "maxx": 3.3319200917149243
              }, {
                "miny": 4058239.25,
                "CRS": "EPSG:25830",
                "minx": 21799.255859375,
                "maxy": 4833508.0,
                "maxx": 1012133.6875
              }],
              "KeywordList": {
                "Keyword": ["Fuera_Servicio", "features", "Tramos", "Fuera de servicio", "IDEADIF", "Adif", "Tramificación común", "Tramificación"]
              },
              "Title": "Tramos fuera de servicio",
              "Style": {
                "Title": "IDEADIF Link Style",
                "LegendURL": {
                  "OnlineResource": {
                    "xlink:type": "simple",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=TramosFueraServicio"
                  },
                  "Format": "image/png",
                  "width": 20,
                  "height": 20
                },
                "Name": "Tramificacion:IDEADIF Link"
              },
              "MetadataURL": [{
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/8385b48c-2bac-42ea-a319-054d6755af12"
                },
                "Format": "text/plain",
                "type": 19139
              }, {
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/7b6a0fdc-bcc4-40e9-a913-74fc6ef10914"
                },
                "Format": "text/plain",
                "type": 19139
              }],
              "Name": "TramosFueraServicio"
            }, {
              "queryable": 1,
              "opaque": 0,
              "CRS": ["EPSG:25830", "CRS:84"],
              "Abstract": "",
              "EX_GeographicBoundingBox": {
                "northBoundLatitude": 46.44896581305109,
                "southBoundLatitude": 33.40424290324293,
                "westBoundLongitude": -9.31296168027681,
                "eastBoundLongitude": 3.731761229531348
              },
              "BoundingBox": [{
                "miny": 33.40424290324293,
                "CRS": "CRS:84",
                "minx": -9.31296168027681,
                "maxy": 46.44896581305109,
                "maxx": 3.731761229531348
              }, {
                "miny": 3995914.25,
                "CRS": "EPSG:25830",
                "minx": 21799.255859375,
                "maxy": 4858562.5,
                "maxx": 1012133.6875
              }],
              "KeywordList": {
                "Keyword": ["Tramificacion", "features", "Tramos", "Tramos en servicio", "IDEADIF", "Adif"]
              },
              "Title": "Tramos en servicio",
              "Style": {
                "Title": "IDEADIF Link Style",
                "LegendURL": {
                  "OnlineResource": {
                    "xlink:type": "simple",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                    "xlink:href": "http://ideadif.adif.es:80/gservices/Tramificacion/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=TramosServicio"
                  },
                  "Format": "image/png",
                  "width": 20,
                  "height": 20
                },
                "Name": "Tramificacion:IDEADIF Link"
              },
              "MetadataURL": [{
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/8385b48c-2bac-42ea-a319-054d6755af12"
                },
                "Format": "text/plain",
                "type": 19139
              }, {
                "OnlineResource": {
                  "xlink:type": "simple",
                  "xlink:href": "http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/7b6a0fdc-bcc4-40e9-a913-74fc6ef10914"
                },
                "Format": "text/plain",
                "type": 19139
              }],
              "Name": "TramosServicio"
            }]
          },
          "Exception": {
            "Format": ["XML", "INIMAGE", "BLANK"]
          }
        },
        "xsi:schemaLocation": "http://www.opengis.net/wms http://ideadif.adif.es:80/gservices/schemas/wms/1.3.0/capabilities_1_3_0.xsd http://inspire.ec.europa.eu/schemas/inspire_vs/1.0 http://ideadif.adif.es:80/gservices/www/inspire/inspire_vs.xsd",
        "Service": {
          "OnlineResource": {
            "xlink:type": "simple",
            "xlink:href": "http://geoserver.sourceforge.net/html/index.php"
          },
          "AccessConstraints": "NONE",
          "Abstract": "A compliant implementation of WMS plus most of the SLD extension (dynamic styling). Can also generate PDF, SVG, KML, GeoRSS",
          "KeywordList": {
            "Keyword": ["WFS", "WMS", "GEOSERVER"]
          },
          "Title": "IDEADIF - GeoServer WMS",
          "Fees": "NONE",
          "ContactInformation": {
            "ContactAddress": {
              "Address": "C/Paseo de las Delicias, 61",
              "StateOrProvince": "",
              "Country": "España",
              "City": "Madrid",
              "AddressType": "Dirección de Sistemas y Tecnologías de la Información",
              "PostCode": 28045
            },
            "ContactVoiceTelephone": "",
            "ContactFacsimileTelephone": "",
            "ContactPosition": "Responsable de SIG IDEADIF",
            "ContactElectronicMailAddress": "ideadif@adif.es",
            "ContactPersonPrimary": {
              "ContactOrganization": "Adif",
              "ContactPerson": "Adm."
            }
          },
          "Name": "WMS"
        },
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "version": "1.3.0",
        "xmlns:gco": "http://schemas.opengis.net/iso/19139/20060504/gco/gco.xsd",
        "xmlns:inspire_vs": "http://inspire.ec.europa.eu/schemas/inspire_vs/1.0",
        "xmlns:gml": "http://schemas.opengis.net/gml",
        "xmlns": "http://www.opengis.net/wms",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        "xmlns:gmd": "http://schemas.opengis.net/iso/19139/20060504/gmd/gmd.xsd"
      }
    };

    component.changeServiceDataByCapabilities(true, false);

    expect(component.getCapabilitiesLayers.length).toEqual(0);
  })


})


