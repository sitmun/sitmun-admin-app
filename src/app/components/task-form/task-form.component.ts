import { Component, ElementRef, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService, TaskService, TaskTypeService, TaskGroupService, CartographyService, ConnectionService, HalOptions, HalParam, TaskUIService, RoleService, CodeListService, TerritoryService } from 'dist/sitmun-frontend-core/';
import { config } from 'src/config';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent, DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { Observable, of, pipe, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { NgTemplateNameDirective } from './ng-template-name.directive';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {



  // properties = { 
  //   "form":{
  //     "label": "tasksEntity.generalData",
  //     "elements": {
  //       "type": { 
  //         "hidden": true, 
  //         "value": 1,
  //         "required":true
  //       },
  //       "name": { 
  //         "label": "tasksEntity.name", 
  //         "control": "input", 
  //         "required":false
  //       }, 
  //       "scope": {
  //         "label": "tasksEntity.typeDocument",
  //         "control": "selector",
  //         "selector":{
  //             "data":"codelist-values",
  //             "queryParams": {
  //                 "codeListName":"downloadTask.scope",
  //                 "projection": "view"
  //             },
  //             "name": "description",
  //             "value": "value",
  //         },
  //         "required":true
  //       },
  //       // "checkbox": { 
  //       //   "label": "tasksEntity.checkbox", 
  //       //   "control": "checkbox", 
  //       // }, 
  //       // "provaRadio": { 
  //       //   "label": "tasksEntity.type", 
  //       //   "control": "enum", 
  //       //   "enum": 
  //       //     { 
  //       //       "list": "tasksEntity.type", 
  //       //       "elements": [ 
  //       //         {
  //       //           "label": "tasksEntity.fix",
  //       //           "value": "VALOR"
  //       //         }, 
  //       //         {
  //       //           "label": "tasksEntity.user",
  //       //           "value": "FITRO"
  //       //         }, 
  //       //         {
  //       //           "label": "tasksEntity.dataInput",
  //       //           "value": "DATATYPE"
  //       //         }
  //       //       ] 
  //       //     }
  //       // },
  //       "provaGon": {
  //         "condition": "name",
  //         "label": [
  //           {
  //           "name": "VALOR",
  //           "text": "tasksEntity.value"
  //           },	
  //           {
  //           "name": "FITRO",	
  //           "text": "tasksEntity.filterText"
  //           },			
  //           {
  //           "name": "DATATYPE",	
  //           "text": "tasksEntity.formatDataInput"
  //           }
  //         ],							
  //         "control": "input",
  //         "required": true
  //       }, 
  //       "group": { 
  //         "label": "tasksEntity.group", 
  //         "control": "selector", 
  //         "selector":{
  //           "data":"taskGroup",
  //           "name": "name",
  //           "value": "id",
  //         },
  //         "required":true
  //       }, 
  //       "ui": { 
  //         "label": "tasksEntity.ui", 
  //         "control": "selector",
  //         "selector":{
  //           "data":"taskUi",
  //           "name": "name",
  //           "value": "id",
  //         },
  //         "required":true
  //       }, 
  //       "cartography": { 
  //         "label": "tasksEntity.cartography", 
  //         "control": "selectorPopup", 
  //         "selectorPopup":{
  //           "data":"cartography",
  //           "value":"name",
  //           "columns":{
  //             "id": {
  //               "label":"tasksEntity.id",
  //               "editable": "false",
  //             },
  //             "name": {
  //               "label":"tasksEntity.name",
  //               "editable": "false"
  //             }
  //           }
  //         },
  //         "required":true
  //       }
  //     },
  //   },
  //   "tables":
  //     [
  //       {
  //         "link":"roles",
  //         "label": "tasksEntity.parameters",
  //         "columns" : {
  //           "id": {
  //             "label":"tasksEntity.id",
  //             "editable": "false",
  //           },            
  //           "name": { 
  //             "label": "tasksEntity.parameter", 
  //             "editable": "false,"
  //           },
  //         },
  //         "controlAdd": {
  //           "control":"formPopup",
  //           "label": "tasksEntity.paramData",			
  //           "elements":{
  //             "scope": {
  //               "label": "tasksEntity.typeDocument",
  //               "control": "selector",
  //               "selector":{
  //                   "data":"codelist-values",
  //                   "queryParams": {
  //                       "codeListName":"queryTask.scope",
  //                       "projection": "view"
  //                   },
  //                   "name": "description",
  //                   "value": "value",
  //               },
  //               "required":true
  //             },
  //             "type": { 
  //               "label": "tasksEntity.type", 
  //               "control": "enum", 
  //               "enum": 
  //                 { 
  //                   "list": "tasksEntity.type", 
  //                   "elements": [ 
  //                     {
  //                       "label": "tasksEntity.fix",
  //                       "value": "VALOR"
  //                     }, 
  //                     {
  //                       "label": "tasksEntity.user",
  //                       "value": "FITRO"
  //                     }, 
  //                     {
  //                       "label": "tasksEntity.dataInput",
  //                       "value": "DATATYPE"
  //                     }
  //                   ] 
  //                 }
  //             },
  //             "name": { 
  //               "label":"tasksEntity.paramURL", 
  //               "control": "input",
  //               "required":true,
  //             },
  //             "value": {
  //               "condition": "type",
  //               "label": [
  //                 {
  //                 "type": "VALOR",
  //                 "text": "tasksEntity.value"
  //                 },	
  //                 {
  //                 "type": "FITRO",	
  //                 "text": "tasksEntity.filterText"
  //                 },			
  //                 {
  //                 "type": "DATATYPE",	
  //                 "text": "tasksEntity.formatDataInput"
  //                 }
  //               ],							
  //               "control": "input",
  //               "required": true
  //             }, 
  //             "order": { 
  //               "label": "tasksEntity.order", 
  //               "control": "input"
  //             }
  //           }	
  //         }
  //       },
  //       { 
  //         "link":"roles",
  //         "label": "tasksEntity.roles", 
  //         "controlAdd": {
  //           "control":"selectorPopup",
  //           "data":"roles", 
  //           "columns":{
  //             "id": {
  //               "label":"tasksEntity.id",
  //               "editable": "false",
  //             },
  //             "name": { 
  //               "label": "tasksEntity.name", 
  //               "editable": "false,"
  //             },
  //           }
  //         },
  //         "columns" : {
  //           "id": {
  //             "label":"tasksEntity.id",
  //             "editable":"true"
  //           },
  //           "name": { 
  //             "label": "tasksEntity.name", 
  //             "editable": "false,"
  //           },
  //         }
  //       },	
  //       { 
  //         "link":"roles",
  //         "label": "tasksEntity.roles", 
  //         "controlAdd": {
  //           "control":"selectorPopup",
  //           "data":"availabilities", 
  //           "columns":{
  //             "id": {
  //               "label":"tasksEntity.id",
  //               "editable":"true"
  //             }
  //           }
  //         } ,
  //         "columns" : {
  //           "id": {
  //             "label":"tasksEntity.id",
  //             "editable": "false",
  //           },            
  //           "name": { 
  //             "label": "tasksEntity.parameter", 
  //             "editable": "false,"
  //           },
  //         }					
  //       }, 
  //       {
  //         "link":"roles",
  //         "label": "tasksEntity.parameters",
  //         "columns" : {
  //           "id": {
  //             "label":"tasksEntity.id",
  //             "editable": "false",
  //           },            
  //           "name": { 
  //             "label": "tasksEntity.parameter", 
  //             "editable": "false,"
  //           },
  //         },
  //         "controlAdd": {
  //           "control":"formPopup",
  //           "label": "tasksEntity.paramData",			
  //           "elements":{
  //             "type": { 
  //               "label": "tasksEntity.type", 
  //               "control": "enum", 
  //               "enum": 
  //                 { 
  //                   "list": "tasksEntity.type", 
  //                   "elements": [ 
  //                     {
  //                       "label": "tasksEntity.fix",
  //                       "value": "VALOR"
  //                     }, 
  //                     {
  //                       "label": "tasksEntity.user",
  //                       "value": "FITRO"
  //                     }, 
  //                     {
  //                       "label": "tasksEntity.dataInput",
  //                       "value": "DATATYPE"
  //                     }
  //                   ] 
  //                 }
  //             },
  //             "name": { 
  //               "label":"tasksEntity.paramURL", 
  //               "control": "input",
  //               "required":true,
  //             },
  //             "value": {
  //               "condition": "type",
  //               "label": [
  //                 {
  //                 "type": "VALOR",
  //                 "text": "tasksEntity.value"
  //                 },	
  //                 {
  //                 "type": "FITRO",	
  //                 "text": "tasksEntity.filterText"
  //                 },			
  //                 {
  //                 "type": "DATATYPE",	
  //                 "text": "tasksEntity.formatDataInput"
  //                 }
  //               ],							
  //               "control": "input",
  //               "required": true
  //             }, 
  //             "scope": {
  //               "label": "tasksEntity.typeDocument",
  //               "control": "selector",
  //               "selector":{
  //                   "data":"codelist-values",
  //                   "queryParams": {
  //                       "codeListName":"downloadTask.scope",
  //                       "projection": "view"
  //                   },
  //                   "name": "description",
  //                   "value": "value",
  //               },
  //               "required":true
  //             },
  //           }	
  //         }
  //       },
      
  //     ]
  //   }

  

  taskForm: FormGroup;
  taskToEdit;
  formElements = [];
  dataLoaded = false;
  taskID = 1;
  themeGrid: any = config.agGridTheme;
  getAlls = [];
  columnDefsTables = [];
  taskTypeName;
  taskTypeNameTranslated;
  taskType
  properties;
  //codeLists
  codeListsMap: Map<string, Array<any>> = new Map<string, Array<any>>();
  tasksMap: Map<string, Array<any>> = new Map<string, Array<any>>();

  //Events data grid
  addelements= [];

  //Form tables
  forms = [];
  tableFormElements = [];
  keysForms = [];
  valuesForms = [];
  templateRefs = [];
  @ViewChildren(NgTemplateNameDirective) templates!: QueryList<NgTemplateNameDirective>;
  // @ViewChild('newPopupFormDialog',{
  //   static: true
  // }) private newPopupFormDialog: TemplateRef <any>;

  //Selector tables
  taskGroups: Array<any> = [];
  taskGroupsNeeded: boolean = false;
  taskUIs: Array<any> = [];
  taskUIsNeeded: boolean = false;
  wfsServices: Array<any> = [];
  wfsServicesNeeded: boolean = false;
  fmeServices: Array<any> = [];
  fmeServicesNeeded: boolean = false;
  locators: Array<any> = [];
  locatorsNeeded: boolean = false;
  cartographies: Array<any> = [];
  cartographiesNeeded: boolean = false;
  connections: Array<any> = [];
  connectionsNeeded: boolean = false;


  constructor(
        public dialog: MatDialog,
        public utils: UtilsService,
        public taskGroupService: TaskGroupService,
        public serviceService: ServiceService,
        public cartographyService: CartographyService,
        public connectionService: ConnectionService,
        public roleService: RoleService,
        public taskService: TaskService,
        public taskUIService: TaskUIService,
        private http: HttpClient,
        private codeListService: CodeListService,
        private territoryService: TerritoryService,
        private taskTypeService: TaskTypeService,
        public activatedRoute:ActivatedRoute,
        public router: Router,
        ) {

          this.activatedRoute.params.subscribe(params => {
            this.taskID = +params.id;
            this.taskTypeName= params.type
            this.taskTypeNameTranslated= this.utils.getTranslate(`tasksEntity.${this.taskTypeName}`)
          })


  }

  ngAfterViewInit() {
    setTimeout(() => { 
      console.log(this.templates)
      this.templateRefs = this.templates.toArray()
    });
  }

  async setDynamicSelectorValue(queryParams, data, mapKey){
    let params2: HalParam[] = [];
    let keys= Object.keys(queryParams);
    keys.forEach(key => {
      let param: HalParam = { key: key, value: queryParams[key] }
      params2.push(param);
    });

    let query: HalOptions = { params: params2 };
    let result;
    if(data=="codelist-values"){
      result = await this.codeListService.getAll(query).toPromise();
      this.codeListsMap.set(mapKey, result);
    }
    else if(data=="tasks"){
      result = await this.taskService.getAll(query).toPromise();
      this.tasksMap.set(mapKey, result);
    }

  }

  async initializeNonCodelistSelectors(){

    let tmpTable;

    if(this.taskGroupsNeeded && this.taskGroups.length < 1){
      tmpTable = await  this.taskGroupService.getAll().toPromise()
      this.taskGroups.push(...tmpTable)
    }

    if(this.taskUIsNeeded && this.taskUIs.length < 1){
      tmpTable = await  this.taskUIService.getAll().toPromise()
      this.taskUIs.push(...tmpTable)
    }

    if(this.cartographiesNeeded  && this.cartographies.length < 1){
      tmpTable = await  this.cartographyService.getAll().toPromise()
      this.cartographies.push(...tmpTable)   
    }

    if(this.connectionsNeeded  && this.connections.length < 1){
      tmpTable = await  this.connectionService.getAll().toPromise()
      this.connections.push(...tmpTable)   
    }

    if(this.wfsServicesNeeded && this.wfsServices.length < 1){
      await this.serviceService.getAll().map((resp) => {
        let wfsServices = [];
        resp.forEach(service => {
          if(service.type==='WFS') {wfsServices.push(service)}
        });  
        this.wfsServices.push(...wfsServices)
      }).toPromise();
    }

    if(this.fmeServicesNeeded  && this.fmeServices.length < 1){
      await this.serviceService.getAll().map((resp) => {
        let fmeServices = [];
        resp.forEach(service => {
          if(service.type==='FME') {fmeServices.push(service)}
        });  
        console.log(this.fmeServices);
        this.fmeServices.push(...fmeServices)
      }).toPromise()
    }

    if(this.locatorsNeeded && this.locators.length < 1){
      let taskTypeID=config.tasksTypes['report'];
      let params2:HalParam[]=[];
      let param:HalParam={key:'type.id', value:taskTypeID}
      params2.push(param);
      let query:HalOptions={ params:params2};
      tmpTable = await this.taskService.getAll(query,undefined,"tasks").toPromise()
      this.locators.push(...tmpTable);
    }

  }

  async ngOnInit() {


    this.taskType= await this.taskTypeService.getAll().pipe(map((data: any[]) => data.filter(elem => elem.title==this.taskTypeName))).toPromise();
    this.properties=this.taskType[0].specification;
    this.taskType=this.taskType[0];




    // this.taskType= await this.taskTypeService.getAll().pipe(map((data: any[]) => data.filter(elem => elem.title==this.taskTypeName))).toPromise();
    // console.log(this.taskType);
    // this.properties=this.taskType[0].specification;


    


    if(this.properties){

      let keys= Object.keys(this.properties.form.elements);
      let values= Object.values(this.properties.form.elements);
      for(let i=0; i< keys.length; i++){
        this.formElements.push({fieldName:keys[i], values:values[i]})
        if(values[i][`control`] === "selector"){
          if(values[i][`selector`][`queryParams`])
          {
            await this.setDynamicSelectorValue(values[i][`selector`][`queryParams`], values[i][`selector`][`data`], values[i][`label`])
          }
          else{
            console.log(values[i][`selector`][`data`])
            this.setSelectorToNeeded(values[i][`selector`][`data`])
          }
        }
      }



      let getAll;
      for(const table of this.properties.tables){
        getAll= () => this.getDataTableByLink(table.link)
        this.getAlls.push(getAll)  
        let addElementsEvent: Subject<any[]> = new Subject<any[]>();
        this.addelements.push(addElementsEvent);
        let columnDefs= this.generateColumnDefs(table.columns,true,true);
        this.columnDefsTables.push(columnDefs);

        if(table.controlAdd.control =="formPopup")
        {
          let formPopup;
          let keysFormPopup= Object.keys(table.controlAdd.elements);
          this.keysForms.push(keysFormPopup);
          let valuesFormPopup= Object.values(table.controlAdd.elements);
          this.valuesForms.push(valuesFormPopup);

          let currentFormElements = [];
          for(let i=0; i< keysFormPopup.length; i++){
            currentFormElements.push({fieldName:keysFormPopup[i], values:valuesFormPopup[i]})
            if(valuesFormPopup[i][`control`] === "selector")
            {
              if(valuesFormPopup[i][`selector`][`queryParams`])
              {
                await this.setDynamicSelectorValue(valuesFormPopup[i][`selector`][`queryParams`], valuesFormPopup[i][`selector`][`data`], values[i][`label`])
              }
              else{
                this.setSelectorToNeeded(valuesFormPopup[i][`selector`][`data`]);
                await this.initializeNonCodelistSelectors();
              }

            } 
          }
          this.tableFormElements.push(currentFormElements)
          formPopup=this.initializeForm(keysFormPopup,valuesFormPopup, true);
          console.log(formPopup);
          this.forms.push(formPopup);
        }
        else {
          this.keysForms.push(null);
          this.valuesForms.push(null);
          this.tableFormElements.push(null)
          this.forms.push(null)
        }

      };
      await this.initializeNonCodelistSelectors();
      this.taskForm=this.initializeForm(keys,values);

      if(this.taskID!= -1){   
        this.taskService.get(this.taskID).subscribe(result => {
          this.taskToEdit=result;
          this.setTaskValues();        
        });
      }
      this.dataLoaded=true;


    }
  }

  getAllRowsTable(data: any[], index )
  {
      console.log(data);
  }


  initializeForm(keys: Array<any>, values: Array<any>, popupForm?:boolean){
    let form=new FormGroup({})
    for(let i=0; i< keys.length; i++){
      const key= keys[i];
      let value = null;
      if(values[i].control==="selector"){
        if(values[i].selector.queryParams){
            value=this.getDataDynamicSelectors(values[i].selector.data, values[i].label)[0][values[i].selector.value];        
        }
        else{
          value=this.getDataFixedSelectors(values[i].selector.data)[0][values[i].selector.value]
        } //[values[i].selector.value]
      }
      else if(values[i].hidden) { value=values[i].value }
      else if(values[i].control==="checkbox") {value=false}
      else if(values[i].control==="enum" && popupForm) { value=values[i].enum.elements[0].value  }

  
      // if(values[i].required){
      //   form.addControl(key,new FormControl(value,[Validators.required]));
      // }
      form.addControl(key,new FormControl(value,[]));


  
    }
    return form;


  }

  setTaskValues(){
    let taskKeys=Object.keys( this.taskToEdit);
    taskKeys.forEach(key => {

      if(this.taskForm.get(key) == null){
        this.taskForm.addControl(key,new FormControl( this.taskToEdit[key],[]));
      }
      else{
        // if(!this.keyIsFromSelector(key)){
          this.taskForm.get(key).setValue( this.taskToEdit[key])
        // }
      }
    });

  }

  keyIsFromSelector(key){
    if(key == "groupId") {
      if(this.taskForm.get("group") != null){
        this.taskForm.get("group").setValue( this.taskToEdit[key])
      }
    }
    else{
      return false;
    }

    return true;


  }


  setSelectorToNeeded(selector){
    if(selector=="taskGroup"){ this.taskGroupsNeeded = true}
    else if(selector=="taskUi") { this.taskUIsNeeded = true }
    else if(selector=="wfsServices") { this.wfsServicesNeeded = true }
    else if(selector=="fmeServices") { this.fmeServicesNeeded = true }
    else if(selector=="this.locators") { this.locatorsNeeded = true }
    else if(selector=="cartographies") { this.cartographiesNeeded = true }
    else if(selector=="connection") { this.connectionsNeeded = true }
  }


  getFieldWithCondition(condition, table, fieldResult, form){
    if(table == undefined) { return false; }

    if(condition == undefined || !Array.isArray(table)) {
       return table;
    }

    let findResult= table.find(element => element[condition] === form.value[condition])

    if(findResult != undefined) { 
      findResult=findResult[fieldResult] 
    }
    else{
      if(fieldResult == "hidden" || fieldResult == "required" ) { findResult = false }
    }
    
    return findResult;
  }


 

  onSaveButtonClicked(){
    console.log(this.taskForm.value);
  }


  getDataSQLElement(value, pattern){
    if(!this.taskForm.get(value).value) { return [] };
    let regex=new RegExp("[${]+[\\w\\d]+[}]", "g")
    let sentence: string=this.taskForm.get(value).value;
    return sentence.match(regex);
  }


  getDataSelector(data, queryParams, label){
    if(queryParams){
        return this.getDataDynamicSelectors(data, label)
    }
    else{
        return this.getDataFixedSelectors(data);
    }
        

  }

  getDataFixedSelectors(data){
    if(data=="taskGroup"){ return this.taskGroups }
    else if(data=="taskUi") { return this.taskUIs }
    else if(data=="wfsServices") { return this.wfsServices }
    else if(data=="fmeServices") { return this.fmeServices }
    else if(data=="this.locators") { return this.locators }
    else if(data=="cartographies") { return this.cartographies }
    else if(data=="connection") { return this.connections }
  }

  getDataDynamicSelectors(data, field){
    if(data=='codelist-values'){
      return this.codeListsMap.get(field);
    }
    if(data=='tasks'){
      return this.tasksMap.get(field);
    }
  }

  onPopupDeleteButtonClicked(field){
      
    this.taskForm.get(field).setValue(null);

  }

  openPopupDialog(field, data, columns, label, checkbox, status, singleSelection, index ){

    let getAllfunction = this.getDataTable(data)

    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [() => getAllfunction];
    dialogRef.componentInstance.singleSelectionTable = [singleSelection];
    dialogRef.componentInstance.columnDefsTable = [this.generateColumnDefs(columns,checkbox, status)];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate(label);
    dialogRef.componentInstance.titlesTable = [""];

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          console.log(result.data)
          if(index < 0){
            this.taskForm.get(field).setValue(result.data[0][0]);
          }
          else{
            this.addelements[index].next(result.data[0])
          }

          //TODO SAVE ALL ELEMENT
        }
      }

    });


  }

  openPopupFormDialog(index, label){
    console.log(this.templateRefs)
    console.log( this.templates.find(dir => dir.name === index))
    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived=this.templates.find(dir => dir.name === index).template;
    dialogRef.componentInstance.title=this.utils.getTranslate(label);
    dialogRef.componentInstance.form=this.forms[index]

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Add') {
          // let item= this.parameterForm.value;
          // this.addElementsEventParameters.next([item])
          // console.log(this.parameterForm.value)

          this.addelements[index].next([this.forms[index].value])
          
        }
      }
      this.forms[index].reset();
      this.forms[index]= this.initializeForm(this.keysForms[index], this.valuesForms[index], true)

    });
  }



  getDataTable(field)
  {
    if(field == "cartography") return this.cartographyService.getAll()
    if(field == "service") return this.serviceService.getAll()
    if(field == "roles") return this.roleService.getAll()
    if(field == "connection") return this.connectionService.getAll()
    if(field == "availabilities") return this.territoryService.getAll()
  }

  getDataTableByLink= (link): Observable<any> =>{
    if (this.taskID == -1 || !this.taskToEdit._links[link]) {
      const aux: Array<any> = [];
      return of(aux);
    }


    var urlReq = `${this.taskToEdit._links[link].href}`
    if (this.taskToEdit._links[link].templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }
    return (this.http.get(urlReq)).pipe(map(data => data['_embedded'][link]));

  }





  generateColumnDefs(columns, checkbox, status){

    let columnResults = [];
    if(checkbox) {columnResults.push(this.utils.getSelCheckboxColumnDef())}

    let keys= Object.keys(columns);
    let values= Object.values(columns);
    for(let i=0; i< keys.length; i++){
      columnResults.push({headerName: this.utils.getTranslate(values[i]['label']), field: keys[i], editable: values[i]['editable'] })
    }
    if(status) {columnResults.push(this.utils.getStatusColumnDef())}

    return columnResults;

  }

}
