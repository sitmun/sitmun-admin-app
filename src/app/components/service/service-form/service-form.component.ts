import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
  CapabilitiesService,
  Cartography,
  CartographyService,
  CartographyStyleService,
  Service,
  ServiceParameterService,
  ServiceService,
  Translation,
  TranslationService
} from '@app/domain';
import {HttpClient} from '@angular/common/http';
import {UtilsService} from '@app/services/utils.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {map} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';
import {MatChipInputEvent} from '@angular/material/chips';
import {config} from '@config';
import {DialogFormComponent, DialogGridComponent, DialogMessageComponent} from '@app/frontend-gui/src/lib/public_api';
import {MatDialog} from '@angular/material/dialog';
import {constants} from '@environments/constants';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { LoggerService } from '@app/services/logger.service';
@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styles: []
})
export class ServiceFormComponent implements OnInit {

  //Translations
  translationMap: Map<string, Translation>;

  translationsModified = false;
  //form
  dataLoaded = false;
  tableLoadButtonDisabled = true;
  capabilitiesLoaded = true;
  serviceForm: UntypedFormGroup;
  serviceToEdit: Service;
  serviceID = -1;
  duplicateID = -1;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  projections: string[];
  serviceTypes: any[] = [];
  requestTypes: any[] = [];
  authenticationModes: any[] = [];
  serviceCapabilitiesData: any = {};
  getCapabilitiesLayers = [];
  //Grids
  themeGrid: any = config.agGridTheme;
  columnDefsParameters: any[];
  getAllElementsEventParameters: Subject<string> = new Subject<string>();
  dataUpdatedEventParameters: Subject<boolean> = new Subject<boolean>();

  columnDefsLayers: any[];
  getAllElementsEventLayers: Subject<string> = new Subject<string>();
  dataUpdatedEventLayers: Subject<boolean> = new Subject<boolean>();

  //Dialogs

  public parameterForm: UntypedFormGroup;
  addElementsEventParameters: Subject<any[]> = new Subject<any[]>();
  @ViewChild('newParameterDialog', {
    static: true
  }) private newParameterDialog: TemplateRef<any>;


  columnDefsLayersDialog: any[];
  addElementsEventLayers: Subject<any[]> = new Subject<any[]>();


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService,
    private translationService: TranslationService,
    private http: HttpClient,
    public utils: UtilsService,
    public dialog: MatDialog,
    public cartographyService: CartographyService,
    public serviceParameterService: ServiceParameterService,
    public cartographyStyleService: CartographyStyleService,
    public capabilitiesService: CapabilitiesService,
    private loggerService: LoggerService
  ) {
    this.initializeServiceForm();
    this.initializeParameterForm();
    this.projections = [];

  }

  ngOnInit(): void {
    this.translationMap = this.utils.createTranslationsList(config.translationColumns.serviceDescription);
    const promises: Promise<any>[] = [];

    promises.push(new Promise((resolve,) => {
      this.utils.getCodeListValues('service.type').subscribe(
        resp => {
          this.serviceTypes.push(...resp);
          resolve(true);
        }
      );
    }));

    promises.push(new Promise((resolve,) => {
      this.utils.getCodeListValues('service.authenticationMode').subscribe(
        resp => {
          this.authenticationModes.push(...resp);
          resolve(true);
        }
      );
    }));


    promises.push(new Promise((resolve,) => {
      this.utils.getCodeListValues('serviceParameter.type').subscribe(
        resp => {
          this.requestTypes.push(...resp);
          resolve(true);
        }
      );
    }));

    Promise.all(promises).then(() => {

      this.activatedRoute.params.subscribe(params => {
          this.serviceID = +params.id;
          if (params.idDuplicate) {
            this.duplicateID = +params.idDuplicate;
          }

          if (this.serviceID !== -1 || this.duplicateID != -1) {
            const idToGet = this.serviceID !== -1 ? this.serviceID : this.duplicateID;
            this.serviceService.get(idToGet).subscribe(
              resp => {

                this.serviceToEdit = resp;
                if (this.serviceToEdit.supportedSRS !== null) {
                  this.serviceToEdit.supportedSRS.forEach((projection) => {
                    this.projections.push(projection);
                  });
                }
                // this.projections = this.serviceToEdit.supportedSRS.split(';');
                // this.parametersUrl = this.serviceToEdit._links.parameters.href;
                this.serviceForm.patchValue({
                  type: this.serviceToEdit.type,
                  description: this.serviceToEdit.description,
                  proxyUrl: this.serviceToEdit.proxyUrl,
                  supportedSRS: this.serviceToEdit.supportedSRS,
                  blocked: this.serviceToEdit.blocked,
                  isProxied: this.serviceToEdit.isProxied,
                  _links: this.serviceToEdit._links
                });

                const currentType = this.serviceTypes.find(element => element.value == this.serviceToEdit.type);
                if (currentType) {
                  this.tableLoadButtonDisabled = currentType.value != config.capabilitiesRequest.WMSIdentificator;
                }


                if (this.serviceID != -1) {
                  this.serviceForm.patchValue({
                    id: this.serviceID,
                    name: this.serviceToEdit.name,
                    serviceURL: this.serviceToEdit.serviceURL,
                    getInformationURL: this.serviceToEdit.getInformationURL,
                    user: this.serviceToEdit.user,
                    password: this.serviceToEdit.password,
                    authenticationMode: this.serviceToEdit.authenticationMode,
                  });
                  this.translationService.getAll()
                    .pipe(map((data: any[]) => data.filter(elem => elem.element == this.serviceID && elem.column == config.translationColumns.serviceDescription)
                    )).subscribe(result => {
                    this.utils.updateTranslations(this.translationMap, result);
                  });
                } else {
                  this.serviceForm.patchValue({
                    name: this.utils.getTranslate('copy_').concat(this.serviceToEdit.name),
                  });
                }


                this.dataLoaded = true;
              },
            );
          } else {
            this.serviceForm.patchValue({
              blocked: false,
              isProxied: false,
              type: null,
              authenticationMode: this.authenticationModes[0].value,
            });
            this.dataLoaded = true;
          }

        },
      );

    });

    this.columnDefsParameters = [

      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('serviceEntity.request', 'type'),
      this.utils.getEditableColumnDef('serviceEntity.parameter', 'name'),
      this.utils.getEditableColumnDef('serviceEntity.value', 'value'),
      this.utils.getStatusColumnDef()

    ];

    this.columnDefsLayers = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('serviceEntity.name', 'name', 300),
      this.utils.getEditableColumnDef('serviceEntity.description', 'description'),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsLayersDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('serviceEntity.name', 'name'),
    ];

  }

  initializeServiceForm(): void {

    this.serviceForm = new UntypedFormGroup({
      id: new UntypedFormControl(null, []),
      name: new UntypedFormControl(null, [Validators.required,]),
      user: new UntypedFormControl(null),
      password: new UntypedFormControl(null),
      authenticationMode: new UntypedFormControl(null, [Validators.required]),
      description: new UntypedFormControl(null, [Validators.required]),
      type: new UntypedFormControl(null, [
        Validators.required,
      ]),
      serviceURL: new UntypedFormControl(null, [
        Validators.required,
      ]),
      proxyUrl: new UntypedFormControl(null,),
      supportedSRS: new UntypedFormControl(null),
      getInformationURL: new UntypedFormControl(null,),
      _links: new UntypedFormControl(null, []),
      blocked: new UntypedFormControl(null, []),
      isProxied: new UntypedFormControl(null, []),
    });

  }

  initializeParameterForm(): void {
    this.parameterForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required]),
      type: new UntypedFormControl(null, [Validators.required]),
      value: new UntypedFormControl(null, []),

    });
  }

  onTypeChange(event: { value: string; }): void {
    this.tableLoadButtonDisabled = event.value != config.capabilitiesRequest.WMSIdentificator;
  }

  addProjection(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.projections.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeProjection(projection: string): void {
    const index = this.projections.indexOf(projection);

    if (index >= 0) {
      this.projections.splice(index, 1);
    }
  }

  onTableLoadButtonClicked() {
    this.getCapabilitiesDataService(true, true);
  }

  getCapabilitiesDataService(refresh?: boolean, ignoreForm?: boolean) {
    try {
      let url: string = this.serviceForm.value.serviceURL;
      if (!url.includes(config.capabilitiesRequest.simpleRequest)) {
        if (url[url.length - 1] != '?') {
          url += '?';
        }

        url += config.capabilitiesRequest.requestWithWMS;
      }
      this.capabilitiesService.getInfo(url).subscribe(result => {

        if (result.success) {
          this.getCapabilitiesLayers = [];
          this.serviceCapabilitiesData = result.asJson;
          this.changeServiceDataByCapabilities(refresh, ignoreForm);
        }
      }, error => {
        this.loggerService.error('Error getting capabilities data', error);
        this.capabilitiesLoaded = true;
      });
    } catch (error) {
      this.loggerService.error('Error getting capabilities data', error);
      this.utils.showErrorMessage('ERROR');
      this.capabilitiesLoaded = true;

    }
  }

  changeServiceDataByCapabilities(refresh?: boolean, ignoreForm?: boolean) {
    const data = this.serviceCapabilitiesData.WMT_MS_Capabilities != undefined ? this.serviceCapabilitiesData.WMT_MS_Capabilities : this.serviceCapabilitiesData.WMS_Capabilities;

    if (data != undefined) {
      if (data.Capability) {
        let capabilitiesList = null;
        if (data.Capability.Layer.SRS !== null && data.Capability.Layer.SRS !== undefined) {
          capabilitiesList = data.Capability.Layer.SRS;
        } else if (data.Capability.Layer.CRS !== null && data.Capability.Layer.CRS !== undefined) {
          capabilitiesList = data.Capability.Layer.CRS;
        }
        this.projections = [];
        if (capabilitiesList && !ignoreForm) {
          this.projections.push(...capabilitiesList);
        }
        // this.serviceCapabilitiesData.WMT_MS_Capabilities.Capability.Layer.SRS.forEach((projection) => {
        //   this.projections.push(projection);
        // });
      }
      let capability = data.Capability.Layer;
      while (capability.Layer != null) {
        capability = capability.Layer;
      }
      const layersTable = [];
      this.getLayersCapabilities(capability, layersTable);
      if (layersTable.length > 0) {
        layersTable.forEach(lyr => {
          let layersLyr: string;
          const styles = [];
          if (Array.isArray(lyr.Name)) {
            layersLyr = lyr.Name;
          } else {
            if (!isNaN(lyr.Name)) {
              lyr.Name = lyr.Name.toString();
            }
            if (!lyr.Name) {
              return;
            }
            layersLyr = lyr.Name.split(',');
          }
          // if (!layersLyr) { layersLyr = [] }
          const cartography = new Cartography();
          cartography.name = lyr.Title;
          if (cartography.name && cartography.name.length > 250) {
            cartography.name = cartography.name.substring(0, 249);
          }
          cartography.description = lyr.Abstract;
          if (cartography.description && cartography.description.length > 250) {
            cartography.description = cartography.description.substring(0, 249);
          }
          cartography.layers = layersLyr;
          if (lyr.Style) {
            if (Array.isArray(lyr.Style)) {
              styles.push(...lyr.Style);
            } else {
              styles.push(lyr.Style);
            }
            cartography.styles = styles;
          }
          if (lyr) {
            if (lyr.MetadataURL != undefined) {
              const metadataURL = Array.isArray(lyr.MetadataURL) ? lyr.MetadataURL[0] : lyr.MetadataURL;
              cartography.metadataURL = metadataURL.OnlineResource['xlink:href'];
            }

            if (lyr.DataURL != undefined) {
              const DataURL = Array.isArray(lyr.DataURL) ? lyr.DataURL[0] : lyr.DataURL;
              cartography.datasetURL = DataURL.OnlineResource['xlink:href'];
            }

            if (lyr.Style && lyr.Style[0] && lyr.Style[0].LEGENDURL != undefined) {
              const style = Array.isArray(lyr.STYLE) ? lyr.STYLE[0] : lyr.STYLE;
              cartography.legendURL = style.legendURL.OnlineResource['xlink:href'];
            }
          }

          this.getCapabilitiesLayers.push(cartography);
        });
      }
      if (data.Service && data.Service.Abstract && data.Service.Abstract.length > 0) {
        let auxDescription: string;
        if (Array.isArray(data.Service.Abstract)) {

          // for(let i=0; i<data.Service.Abstract.length; i++){
          data.Service.Abstract.forEach((translation: { [x: string]: string; content: string; }) => {
            let languageShortname: string = translation['xml:lang'];
            const index = languageShortname.indexOf('-');
            if (index != -1) {
              languageShortname = languageShortname.substring(0, index);
            }
            if (languageShortname == config.defaultLang) {
              auxDescription = translation.content;
            } else {
              if ((this.translationMap.has(languageShortname))) {
                const currentTranslation = this.translationMap.get(languageShortname);
                const translationReduced = translation.content.substring(0, 249);
                if (currentTranslation.translation != translationReduced) {
                  currentTranslation.translation = translationReduced;
                  this.translationsModified = true;
                }
              }
            }

          });


          auxDescription = data.Service.Abstract.find(element => element['xml:lang'].includes(config.defaultLang));
          if (!auxDescription) {
            auxDescription = data.Service.Abstract[0].content;
          }
        } else {
          auxDescription = data.Service.Abstract;
        }
        if (!ignoreForm) {
          const newDescription = auxDescription.length > 250 ? auxDescription.substring(0, 249) : auxDescription;
          this.serviceForm.patchValue({
            description: newDescription,
          });
        }

      }

    }


    this.capabilitiesLoaded = true;
    if (refresh) {
      this.dataUpdatedEventLayers.next(true);
    }
  }

  private getLayersCapabilities(lyrTable, tableToSave) {
    if (Array.isArray(lyrTable)) {
      lyrTable.forEach(layer => {
        if (layer.Layer != null) {
          this.getLayersCapabilities(layer.Layer, tableToSave);
        } else {
          tableToSave.push(layer);
        }
      });
    } else {
      tableToSave.push(lyrTable);
    }

  }

  async onTranslationButtonClicked() {
    const dialogResult = await this.utils.openTranslationDialog(this.translationMap);
    if (dialogResult && dialogResult.event == 'Accept') {
      this.translationsModified = true;
    }
  }

  // AG-GRID

  // ******** Parameters configuration ******** //
  getAllParameters = (): Observable<any> => {

    if (this.serviceID == -1 && this.duplicateID == -1) {
      const aux: any[] = [];
      return of(aux);
    }

    let urlReq = `${this.serviceToEdit._links.parameters.href}`;
    if (this.serviceToEdit._links.parameters.templated) {
      const url = new URL(urlReq.split('{')[0]);
      url.searchParams.append('projection', 'view');
      urlReq = url.toString();
    }
    return this.http.get(urlReq).pipe(
      map(data => data[`_embedded`][`service-parameters`]),
      map(serviceParameters =>
        serviceParameters.map(serviceParam => {
          const newType = this.requestTypes.find(
            element => element.value == serviceParam['type'].toUpperCase()
          ).description;
          return {
            ...serviceParam,
            type: newType
          };
        })
      )
    );
  };

  getAllRowsParameters(event) {
    if (event.event == 'save') {
      this.saveParameters(event.data);
    }
  }


  saveParameters(data: any[]) {
    // let parameterToSave = [];
    // let parameterToDelete = [];
    const promises: Promise<any>[] = [];
    data.forEach(parameter => {
      if (parameter.status === 'pendingCreation' || parameter.status === 'pendingModify') {
        if (parameter.status === 'pendingCreation' || parameter.newItem) {
          parameter.id = null;
          parameter._links = null;
          parameter.service = this.serviceToEdit;
        } //If is new, you need the service link
        promises.push(new Promise((resolve,) => {
          this.serviceParameterService.save(parameter, this.requestTypes).subscribe(() => {
            resolve(true);
          });
        }));
      }
      if (parameter.status === 'pendingDelete' && parameter._links && !parameter.newItem) {
        promises.push(new Promise((resolve,) => {
          this.serviceParameterService.remove(parameter).subscribe(() => {
            resolve(true);
          });
        }));
        // parameterToDelete.push(parameter)
      }
    });

    // parameterToSave.forEach(saveElement => {
    //   promises.push(new Promise((resolve, reject) => {  this.serviceParameterService.save(saveElement).subscribe((resp) => { resolve(true) }) }));
    // });

    // parameterToDelete.forEach(deletedElement => {
    //   promises.push(new Promise((resolve, reject) => {  this.serviceParameterService.remove(deletedElement).subscribe((resp) => { resolve(true) }) }));
    // });

    Promise.all(promises).then(() => {
      this.dataUpdatedEventParameters.next(true);
    });

  }

  duplicateParameters(data) {
    const parametersToDuplicate = this.utils.duplicateParameter(data, 'name');
    this.addElementsEventParameters.next(parametersToDuplicate);
  }

  // ******** Layers ******** //
  getAllLayers = (): Observable<any> => {

    if (this.getCapabilitiesLayers.length <= 0) {
      if (this.serviceID != -1) {
        let urlReq = `${this.serviceToEdit._links.layers.href}`;
        if (this.serviceToEdit._links.layers.templated) {
          const url = new URL(urlReq.split('{')[0]);
          url.searchParams.append('projection', 'view');
          urlReq = url.toString();
        }
        return (this.http.get(urlReq))
          .pipe(map(data => data[`_embedded`][`cartographies`]));
      } else {
        return of([]);
      }
    }

    if (this.serviceID != -1) {

      let urlReq = `${this.serviceToEdit._links.layers.href}`;
      if (this.serviceToEdit._links.layers.templated) {
        const url = new URL(urlReq.split('{')[0]);
        url.searchParams.append('projection', 'view');
        urlReq = url.toString();
      }
      return (this.http.get(urlReq))
        .pipe(map(data => {
          const finalCartographies = [];
          const cartographies = data['_embedded']['cartographies'];
          this.getCapabilitiesLayers.forEach(capabilityLayer => {
            const index = cartographies.findIndex(element => element.layers && capabilityLayer.layers && element.layers.join() == capabilityLayer.layers.join() && !element.alreadySearched);
            if (index != -1) {
              if (cartographies[index].blocked) {
                cartographies[index].status = 'notAvailable';
              }
              cartographies[index].alreadySearched = true;
              finalCartographies.push(cartographies[index]);
            } else {
              capabilityLayer.status = 'unregisteredLayer';
              capabilityLayer.newRegister = true;
              finalCartographies.push(capabilityLayer);
            }
          });

          cartographies.forEach(cartography => {

            if (!cartography.alreadySearched) {
              cartography.status = 'notAvailable';
              finalCartographies.push(cartography);
            }

          });

          return finalCartographies;

        }));

    } else {
      const finalCartographies = [];
      this.getCapabilitiesLayers.forEach(capabilityLayer => {
        capabilityLayer.status = 'unregisteredLayer';
        finalCartographies.push(capabilityLayer);
      });
      return of(finalCartographies);
    }

  };

  onDataCapabilitiesButtonClicked() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('caution');
    dialogRef.componentInstance.message = this.utils.getTranslate('getCapabilitiesMessage');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Accept') {
          this.getCapabilitiesDataService(true);
        }
      }
    });

  }


  getAllRowsLayers(event) {
    if (event.event == 'save') {
      this.saveLayers(event.data);
    }
  }

  saveLayers(data: any[]) {
    const promises: Promise<any>[] = [];
    const promisesStyles: Promise<any>[] = [];
    data.forEach(cartography => {
      if (cartography.status === 'notAvailable' && !cartography.blocked) {
        cartography.blocked = true;
        promises.push(new Promise((resolve,) => {
          this.cartographyService.update(cartography).subscribe(() => {
            resolve(true);
          });
        }));
      } else if (cartography.status === 'pendingRegistration' && !cartography._links) {
        cartography.service = this.serviceToEdit;
        cartography.blocked = false;
        cartography.queryableFeatureAvailable = false;
        cartography.queryableFeatureEnabled = false;
        const styles = cartography.styles;
        delete cartography.styles;
        promises.push(new Promise((resolve,) => {
          this.cartographyService.save(cartography).subscribe((resp) => {
            if (styles && styles.length > 0) {
              this.setStyleByDefault(styles);
              styles.forEach(style => {

                style = this.styleTreactment(style, resp);
                promisesStyles.push(new Promise((resolve,) => {
                  this.cartographyStyleService.save(style).subscribe(() => {
                    resolve(true);
                  });
                }));
              });
            }
            resolve(true);
          });
        }));
      } else if (cartography.status === 'pendingDelete' && cartography._links) {
        promises.push(new Promise((resolve,) => {
          this.cartographyService.remove(cartography).subscribe(() => {
            resolve(true);
          });
        }));
      } else if (cartography.status === 'pendingModify' && cartography._links) {
        promises.push(new Promise((resolve,) => {
          this.cartographyService.update(cartography).subscribe(() => {
            resolve(true);
          });
        }));

      }


    });

    Promise.all(promises).then(() => {
      Promise.all(promisesStyles).then(() => {
        this.dataUpdatedEventLayers.next(true);
      });
    });
  }

  private setStyleByDefault(styles) {
    let styleByDefaultFound = false;
    styles.forEach(style => {
      if (style.defaultStyle) {
        if (styleByDefaultFound) {
          style.defaultStyle = false;
        } else {
          styleByDefaultFound = true;
        }
      } else {
        style.defaultStyle = false;
      }

    });
    if (!styleByDefaultFound) {
      styles[0].defaultStyle = true;
    }

    // return styles;
  }

  private styleTreactment(style, cartography) {
    style.cartography = cartography;
    if (style.Name) {
      style.name = style.Name;
      delete style.Name;
    }

    if (style.Abstract) {
      style.description = style.Abstract;
      delete style.Abstract;
    }

    if (style.Title) {
      style.title = style.Title;
      delete style.Title;
    }
    if (style.LegendURL) {
      let onlineResource;
      if (style.LegendURL.OnlineResource) {
        if (style.LegendURL.OnlineResource['xlink:href']) {
          onlineResource = style.LegendURL.OnlineResource['xlink:href'];
        } else if (style.LegendURL.OnlineResource['xlink:link']) {
          onlineResource = style.LegendURL.OnlineResource['xlink:link'];
        } else if (style.LegendURL.OnlineResource['xlink:type']) {
          onlineResource = style.LegendURL.OnlineResource['xlink:type'];
        }
      }

      style.legendURL = {
        format: style.LegendURL.Format,
        onlineResource: onlineResource,
        height: style.LegendURL.height,
        width: style.LegendURL.width
      };
      delete style.LegendURL;
    }

    return style;
  }

  // ******** Parameters Dialog  ******** //


  openParametersDialog() {
    this.parameterForm.patchValue({
      type: this.requestTypes[0].value,
      description: this.requestTypes[0].description
    });

    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived = this.newParameterDialog;
    dialogRef.componentInstance.title = this.utils.getTranslate('serviceEntity.configurationParameters');
    dialogRef.componentInstance.form = this.parameterForm;


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          const item = this.parameterForm.value;

          item.type = this.requestTypes.find(
            element => element.value == item.type.toUpperCase()
          ).description;

          this.addElementsEventParameters.next([item]);

          this.parameterForm.reset();

        }
      }

    });

  }


  // ******** Layers Dialog  ******** //

  getAllLayersDialog = () => {
    return this.cartographyService.getAll();
  };

  openCartographyDialog() {

    const dialogRef = this.dialog.open(DialogGridComponent, {panelClass: 'gridDialogs'});
    dialogRef.componentInstance.getAllsTable = [this.getAllLayersDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsLayersDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('serviceEntity.layersToRegister');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.nonEditable = false;


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventLayers.next(result.data[0]);
        }
      }

    });

  }

  onSaveButtonClicked() {
    if (this.serviceForm.valid) {

      if (this.serviceID == -1 && this.duplicateID != -1) {
        this.serviceForm.patchValue({
          _links: null
        });
      }

      this.serviceForm.patchValue({
        supportedSRS: this.projections
      });

      this.serviceService.save(this.serviceForm.value)
        .subscribe(async resp => {

            this.serviceToEdit = resp;
            this.serviceID = resp.id;
            this.serviceForm.patchValue({
              id: resp.id,
              _links: resp._links
            });

            await this.utils.saveTranslation(resp.id, this.translationMap, this.serviceToEdit.description, this.translationsModified);
            this.translationsModified = false;
            this.getAllElementsEventParameters.next('save');
            this.getAllElementsEventLayers.next('save');
          },
          error => {
            this.loggerService.error('Error saving service', error);
          }
        );
    } else {
      this.utils.showRequiredFieldsError();
    }
  }

  isAuthenticationModeNode(): boolean {
    return this.serviceForm.get('authenticationMode').value !== constants.codeValue.serviceAuthenticationMode.none;
  }

  isWMS() {
    return this.serviceForm.value.type === constants.codeValue.serviceType.wms
  }

  activeTabIndex = 0;

  onTabChange(event: MatTabChangeEvent) {
    this.activeTabIndex = event.index;
  }
}
