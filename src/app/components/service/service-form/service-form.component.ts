import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService, CartographyService, Translation, TranslationService, Connection, Cartography, ServiceParameterService } from 'dist/sitmun-frontend-core/';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { DialogGridComponent, DialogFormComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';
import * as xml2js from 'xml2js';
@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent implements OnInit {

  //Translations
  translationsModified: boolean = false;
  catalanTranslation: Translation = null;
  spanishTranslation: Translation = null;
  englishTranslation: Translation = null;
  araneseTranslation: Translation = null;

  //form
  dataLoaded: Boolean = false;
  private parametersUrl: string;
  serviceForm: FormGroup;
  serviceToEdit;
  serviceID = -1;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  projections: Array<string>;
  serviceTypes: Array<any> = [];
  requestTypes: Array<any> = [];
  serviceCapabilitiesData:any={};

  //Grids
  themeGrid: any = config.agGridTheme;
  columnDefsParameters: any[];
  getAllElementsEventParameters: Subject<boolean> = new Subject <boolean>();
  dataUpdatedEventParameters: Subject<boolean> = new Subject<boolean>();

  columnDefsLayers: any[];
  getAllElementsEventLayers: Subject<boolean> = new Subject <boolean>();
  dataUpdatedEventLayers: Subject<boolean> = new Subject<boolean>();

  //Dialogs

  public parameterForm: FormGroup;
  addElementsEventParameters: Subject<any[]> = new Subject <any[]>();
  @ViewChild('newParameterDialog',{
    static: true
  }) private newParameterDialog: TemplateRef <any>;


  columnDefsLayersDialog: any[];
  addElementsEventLayers: Subject<any[]> = new Subject <any[]>();




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

  ) {
    this.initializeServiceForm();
    this.initializeParameterForm();
    this.projections = [];

  }

  ngOnInit(): void {


    let serviceTypeByDefault = {
      value: -1,
      description: '-------'
    }
    this.serviceTypes.push(serviceTypeByDefault);

    const promises: Promise<any>[] = [];

    promises.push(new Promise((resolve, reject) => {
      this.utils.getCodeListValues('service.type').subscribe(
        resp => {
          this.serviceTypes.push(...resp);
          resolve(true);
        }
      );
    }));


    promises.push(new Promise((resolve, reject) => {
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
        if (this.serviceID !== -1) {
          this.serviceService.get(this.serviceID).subscribe(
            resp => {
              console.log(resp);
              this.serviceToEdit = resp;
              if (this.serviceToEdit.supportedSRS !== null) {
                this.serviceToEdit.supportedSRS.forEach((projection) => {
                  this.projections.push(projection);
                });
              }
              // this.projections = this.serviceToEdit.supportedSRS.split(';');
              this.parametersUrl = this.serviceToEdit._links.parameters.href;
              this.serviceForm.setValue({
                id: this.serviceID,
                name: this.serviceToEdit.name,
                type: this.serviceToEdit.type,
                description: this.serviceToEdit.description,
                serviceURL: this.serviceToEdit.serviceURL,
                proxyUrl: this.serviceToEdit.proxyUrl,
                supportedSRS: this.serviceToEdit.supportedSRS,
                getInformationURL: this.serviceToEdit.getInformationURL,
                blocked: this.serviceToEdit.blocked,
                _links: this.serviceToEdit._links
              });

                            
              this.translationService.getAll()
              .pipe(map((data: any[]) => data.filter(elem => elem.element == this.serviceID && elem.column == config.translationColumns.serviceDescription)
              )).subscribe( result => {
                console.log(result);
                this.saveTranslations(result);
              });;
  
              this.dataLoaded = true;
            },
            error => {
  
            }
          );
        }
        else{
          this.serviceForm.patchValue({
            blocked: false,
            type: this.serviceTypes[0].value
          })
          this.dataLoaded = true;
        }
  
      },
      error => {
  
      });

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
      this.utils.getEditableColumnDef('serviceEntity.name', 'name'),
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

    this.serviceForm = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl(null, [
        Validators.required,
      ]),
      description: new FormControl(null,[]),
      type: new FormControl(null, [
        Validators.required,
      ]),
      serviceURL: new FormControl(null, [
        Validators.required,
      ]),
      proxyUrl: new FormControl(null,),
      supportedSRS: new FormControl(null),
      getInformationURL: new FormControl(null,),
      _links: new FormControl(null, []),
      blocked: new FormControl(null, []), 
    });

  }

  initializeParameterForm(): void {
    this.parameterForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      value: new FormControl(null, []),

    })
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

  getCapabilitiesDataService(){
    this.http.get(`${this.serviceForm.value.serviceURL}?request=GetCapabilities`, { responseType: 'text' }).subscribe(resp => {
      debugger;

      console.log(resp);
      // this.router.navigate(["/company", resp.id, "formConnection"]);
      const parser = new xml2js.Parser({ explicitArray:false,strict: false, trim: true });
      parser.parseString(resp, (err, result) => {
        this.serviceCapabilitiesData=result;
        this.changeServiceDataByCapabilities();
   
      });
    },
    (err) => {
      this.utils.showErrorMessage ("ERROR")

    });
  }

  changeServiceDataByCapabilities(){
    debugger;
    if (this.serviceCapabilitiesData.WMT_MS_CAPABILITIES.CAPABILITY.LAYER.SRS !== null) {
      this.projections=[];
      this.serviceCapabilitiesData.WMT_MS_CAPABILITIES.CAPABILITY.LAYER.SRS.forEach((projection) => {
        this.projections.push(projection);
      });
    }
    this.serviceForm.patchValue({
      description: this.serviceCapabilitiesData.WMT_MS_CAPABILITIES.SERVICE.ABSTRACT,
    })
  }

  async onTranslationButtonClicked()
  {
    let dialogResult = null
    dialogResult = await this.utils.openTranslationDialog(this.catalanTranslation, this.spanishTranslation, this.englishTranslation, this.araneseTranslation, config.translationColumns.serviceDescription);
    if(dialogResult!=null){
      this.translationsModified=true;
      this.catalanTranslation=dialogResult[0];
      this.spanishTranslation=dialogResult[1];
      this.englishTranslation=dialogResult[2];
      this.araneseTranslation=dialogResult[3];
    }
  }

  // AG-GRID

  // ******** Parameters configuration ******** //
  getAllParameters = (): Observable<any> => {
    
    if(this.serviceID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.serviceToEdit._links.parameters.href}`
    if (this.serviceToEdit._links.parameters.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }


    return (this.http.get(urlReq))
      .pipe(map(data => data[`_embedded`][`service-parameters`]));
  }



  getAllRowsParameters(data: any[] )
  {
    let parameterToSave = [];
    let parameterToDelete = [];
    data.forEach(parameter => {
      if (parameter.status === 'pendingCreation' || parameter.status === 'pendingModify') {
        if(! parameter._links) {
          parameter.service=this.serviceToEdit} //If is new, you need the service link
          parameterToSave.push(parameter)
      }
      if(parameter.status === 'pendingDelete' && parameter._links) {parameterToDelete.push(parameter) }
    });
    const promises: Promise<any>[] = [];
    parameterToSave.forEach(saveElement => {
      promises.push(new Promise((resolve, reject) => {  this.serviceParameterService.save(saveElement).subscribe((resp) => { resolve(true) }) }));
    });

    parameterToDelete.forEach(deletedElement => {
      promises.push(new Promise((resolve, reject) => {  this.serviceParameterService.remove(deletedElement).subscribe((resp) => { resolve(true) }) }));    
    });

    Promise.all(promises).then(() => {
      this.dataUpdatedEventParameters.next(true);
    });
	
  }

  duplicateParameters(data)
  {
    let parametersToDuplicate= []
    data.forEach(parameter => {
      let newParameter={
        name: this.utils.getTranslate('copy_').concat(parameter.name),
        type: parameter.type,
        value: parameter.value
      }
      
      
      parametersToDuplicate.push(newParameter);
    });
    this.addElementsEventParameters.next(parametersToDuplicate);
  }

  // ******** Layers ******** //
  getAllLayers = (): Observable<any> => {

    if(this.serviceID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.serviceToEdit._links.layers.href}`
    if (this.serviceToEdit._links.layers.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }
    return (this.http.get(urlReq))
    .pipe(map(data => data['_embedded']['cartographies']));
    

  }




  getAllRowsLayers(data: any[] )
  {
    let dataChanged = false;
    let layersModified = [];
    let layersToPut = [];
    data.forEach(cartography => {
      if(cartography.status!== 'pendingDelete') {
        if (cartography.status === 'pendingModify') {layersModified.push(cartography) }
        else if (cartography.status === 'pendingCreation') {dataChanged = true }
        layersToPut.push(cartography._links.self.href)
      }
      else {dataChanged = true}
    });

    this.updateLayers(layersModified, layersToPut, dataChanged );
  }

  updateLayers(layersModified: Cartography[], layersToPut: Cartography[], dataChanged: boolean)
  {
    const promises: Promise<any>[] = [];
    layersModified.forEach(cartography => {
      promises.push(new Promise((resolve, reject) => { this.cartographyService.update(cartography).subscribe((resp) => { resolve(true) }) }));
    });
    Promise.all(promises).then(() => {
      if(dataChanged){
        let url=this.serviceToEdit._links.layers.href.split('{', 1)[0];
        this.utils.updateUriList(url,layersToPut, this.dataUpdatedEventLayers)
      }
      else { this.dataUpdatedEventLayers.next(true)}
    });
  }

  // ******** Parameters Dialog  ******** //


  openParametersDialog(data: any) {

    this.parameterForm.patchValue({
      type:  this.requestTypes[0].value
    })
  
    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived=this.newParameterDialog;
    dialogRef.componentInstance.title=this.utils.getTranslate('serviceEntity.configurationParameters');
    dialogRef.componentInstance.form=this.parameterForm;

    


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Add') {
          let item= this.parameterForm.value;
          this.addElementsEventParameters.next([item])
          console.log(this.parameterForm.value)
          this.parameterForm.reset();
          
        }
      }

    });

  }

        

  // ******** Layers Dialog  ******** //

  getAllLayersDialog = () => {
    return this.cartographyService.getAll();
  }

  openCartographyDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'gridDialogs'});
    dialogRef.componentInstance.getAllsTable=[this.getAllLayersDialog];
    dialogRef.componentInstance.singleSelectionTable=[false];
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.columnDefsTable=[this.columnDefsLayersDialog];
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title=this.utils.getTranslate('serviceEntity.layersToRegister');
    dialogRef.componentInstance.titlesTable=[''];
    dialogRef.componentInstance.nonEditable=false;
    


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Add') {
          this.addElementsEventLayers.next(result.data[0])
        }
      }

    });

  }

   onSaveButtonClicked(){
    // this.serviceForm.patchValue({
    //   supportedSRS: this.projections.join(';')
    // })
    if(this.serviceForm.valid)
    {
      this.serviceForm.patchValue({
        supportedSRS: this.projections
      })
    console.log(this.serviceForm.value);
      this.serviceService.save(this.serviceForm.value)
      .subscribe(async resp => {
        console.log(resp);
        this.serviceToEdit=resp;
        this.serviceID=resp.id;
        this.serviceForm.patchValue({
          id: resp.id,
          _links: resp._links
        })
        
        if(this.translationsModified){
          this.catalanTranslation = await this.utils.saveTranslation(resp.id,this.catalanTranslation);
          this.spanishTranslation = await this.utils.saveTranslation(resp.id,this.spanishTranslation);
          this.englishTranslation = await this.utils.saveTranslation(resp.id,this.englishTranslation);
          this.araneseTranslation = await this.utils.saveTranslation(resp.id,this.araneseTranslation);
          this.translationsModified = false;
        }
        this.getAllElementsEventParameters.next(true);
        this.getAllElementsEventLayers.next(true);
      },
      error=> {
        console.log(error);
      });
    }
  	else{
      this.utils.showRequiredFieldsError();
    }



  }

  saveTranslations(translations){
        translations.forEach(translation => {
        if(translation.languageName == config.languagesObjects.catalan.name){
          this.catalanTranslation=translation
        }
        if(translation.languageName == config.languagesObjects.spanish.name){
          this.spanishTranslation=translation
        }
        if(translation.languageName == config.languagesObjects.english.name){
          this.englishTranslation=translation
        }
        if(translation.languageName == config.languagesObjects.aranese.name){
          this.araneseTranslation=translation
        }
      });
      console.log(this.catalanTranslation);

  }



}