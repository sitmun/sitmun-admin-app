import { Component, ElementRef, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService, TaskService, TaskTypeService, TaskGroupService, CartographyService, ConnectionService, HalOptions, HalParam, 
  TaskUIService, RoleService, CodeListService, TerritoryService, Task, TaskAvailabilityService, TaskAvailability } from '../../frontend-core/src/lib/public_api';
import { config } from 'src/config';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent, DialogGridComponent } from '../../frontend-gui/src/lib/public_api';
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
  servicesMap: Map<string, Array<any>> = new Map<string, Array<any>>();

  //Events data grid
  addelements= [];
  getAllElementsEvent = [];
  refreshElements = [];
  //Table's arrays
  sqlElementModification = [];
  defaultColumnsSorting = [];

  parametersTable = [];


  indexParameter = -1;

  //Form tables
  forms = [];
  formHasSqlElementSelector = [];
  tableFormElements = [];
  keysForms = [];
  valuesForms = [];
  templateRefs = [];
  formSQLElement = [];
  tableCounter= 0;
  currentTablesSaved= 0;
  @ViewChildren(NgTemplateNameDirective) templates!: QueryList<NgTemplateNameDirective>;


  //Save
  saveButtonClicked = false;
  savedTask: Task = new Task;
 

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
        private taskAvailabilityService: TaskAvailabilityService,
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
    else if (data="service"){
      result = await this.serviceService.getAll(query).toPromise();
      this.servicesMap.set(mapKey, result);
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
            this.setSelectorToNeeded(values[i][`selector`][`data`])
          }
        }
      }



      let getAll;
      let index= -1;
      for(const table of this.properties.tables){
        this.tableCounter++;
        index++;
        if(table.link== 'parameters'){
          this.indexParameter=index;
          getAll= () =>  of(this.parametersTable);
        }
        else{
          getAll= () => this.getDataTableByLink(table.link)
        }
        this.getAlls.push(getAll)  
        let addElementsEvent: Subject<any[]> = new Subject<any[]>();
        let getAllElements: Subject<boolean> = new Subject <boolean>();
        let refreshElements: Subject<boolean> = new Subject <boolean>();
        this.addelements.push(addElementsEvent);
        this.getAllElementsEvent.push(getAllElements)
        this.refreshElements.push(refreshElements)
        this.sqlElementModification.push({modifications: false, toSave: false, element: null, mainFormElement:null, tableElements: []});
        let columnDefs= this.generateColumnDefs(table.columns,table.link,true,true, true);
        this.columnDefsTables.push(columnDefs);

        if(table.controlAdd.control =="formPopup")
        {
          let formPopup;
          let keysFormPopup= Object.keys(table.controlAdd.elements);
          this.keysForms.push(keysFormPopup);
          let valuesFormPopup= Object.values(table.controlAdd.elements);
          this.valuesForms.push(valuesFormPopup);

          let currentFormElements = [];
          let currentlySqlElement = null;
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
            if(valuesFormPopup[i][`control`] === "enumBySQLElement") {
               currentlySqlElement=valuesFormPopup[i][`element`] 
               this.sqlElementModification[index].element=keysFormPopup[i];
              }


          }
          this.formSQLElement.push(currentlySqlElement)
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
          this.formSQLElement.push(null)
          this.formHasSqlElementSelector.push(false);
        }

      };
      await this.initializeNonCodelistSelectors();
      this.taskForm=this.initializeForm(keys,values);

      if(this.taskID!= -1){   
        this.taskService.get(this.taskID).subscribe(result => {
          console.log(result)
          this.taskToEdit=result;
          this.initializeSelectorsPopups();
          this.setTaskValues();    
          this.dataLoaded=true;    
        });
      }
      else{
        this.dataLoaded=true;    
      }
      


    }
  }

  duplicate(data, index){
    let elementsToDuplicate= this.utils.duplicateParameter(data,'name', true, true);
    this.addelements[index].next(elementsToDuplicate)
  } 

  getAllRowsTable(event, index, linkName ){
    let saveParameters= event.event == "saveParameters";

    if(event.event == "saveParameters" || event.event == "addParameter"){
      this.manageParameters(event.data, index, linkName, saveParameters);
    }


    if(event.event == "save" ){
      this.saveTable(event.data, index, linkName);
    }
  }

  manageParameters(data: any[], index, linkName, saveParameters?){
    let sqlElement = this.sqlElementModification[index];
    sqlElement.tableElements=[];
    let toSave: boolean = sqlElement.toSave;
    if(sqlElement.modifications || sqlElement.toSave || saveParameters){
      let result = [];
      for (const element of data) {
        if(element.status!= "pendingDelete"){
          result.push(element[sqlElement.element])
          if(toSave){
            // this.savedTask[sqlElement.mainFormElement]= this.savedTask[sqlElement.mainFormElement].replace(element[sqlElement.element], element["value"]);
          }
        }
      }

      if(!this.savedTask.properties){
        this.savedTask.properties={};
        this.savedTask.properties[sqlElement.mainFormElement]=this.savedTask[sqlElement.mainFormElement]; 
      }
      else{
        this.savedTask.properties[sqlElement.mainFormElement]=this.savedTask[sqlElement.mainFormElement]; 
      }

      sqlElement.tableElements=result;
      sqlElement.modifications=false;
      sqlElement.toSave=false;
      if(saveParameters){
        this.putParametersOnProperties(data);
      }
      if(toSave || saveParameters){
        this.saveTask();
      }
      

    }
  }

  saveTable(data: any[], index, linkName )
  {

    //We are saving
    if(linkName=='parameters'){
      this.putParametersOnProperties(data);
      this.currentTablesSaved++;
      this.saveTask();
    }
    else{
      if(linkName=='roles'){
        this.saveWithUri(data, index, linkName )
      }
      else if(linkName='availabilities'){
        this.saveAvailabilities(data,index);
      }
    }



    
  }

  putParametersOnProperties(data){
    if(data.length>0){
      let newData = [];
      data.forEach(element => {
        if(element.status!= 'pendingDelete'){
          delete element.status;
          delete element.newItem;
          if(element.order){ element.order=parseInt(element.order) }
          newData.push((element));

        }
      });
      if(!this.savedTask.properties){
        this.savedTask.properties={
          parameters:newData
        }      
      }
      else{
        this.savedTask.properties.parameters=newData;
      }
      this.parametersTable = [];
      this.parametersTable.push(...newData);
    }
  }

  saveWithUri(data: any[], index, linkName ){
    let dataToSave = [];
    data.forEach(element => {
      if(element.status != 'pendingDelete'){
        dataToSave.push(element._links.self.href);
      }
    });
    let url = this.taskForm.get('_links').value[linkName].href.split('{', 1)[0];
    this.utils.updateUriList(url,dataToSave, this.refreshElements[index])
  }

  saveAvailabilities(data: any[], index){
    const promises: Promise<any>[] = [];
    data.forEach(territory => {
      if (territory.status === 'pendingDelete' && territory._links  && !territory.newItem ) {
        promises.push(new Promise((resolve, reject) => { this.taskAvailabilityService.remove(territory).subscribe((resp) => { resolve(true) }) }));
        //  tasksToDelete.push(task) 
        }
      if (territory.status === 'pendingCreation') {
        territory.task=this.taskToEdit;
        let index = data.findIndex(element => element.territoryId === territory.id && !element.newItem)
        if (index === -1) {
          territory.newItem = false;
          let taskToCreate: TaskAvailability = new TaskAvailability();
          taskToCreate.task = this.taskToEdit;
          taskToCreate.territory = territory;
          promises.push(new Promise((resolve, reject) => { this.taskAvailabilityService.save(taskToCreate).subscribe((resp) => { resolve(true) }) }));
        }
      }
    });
    Promise.all(promises).then(() => {
      this.refreshElements[index].next(true);
    });
  }

  restoreElementsSqlSelector(data:any[], index){
    let sqlElement = this.sqlElementModification[index];
    data.forEach(element => {
      let elementIndex=sqlElement.tableElements.findIndex(tableElement => tableElement === element[sqlElement.element])
      if(elementIndex != -1){
        sqlElement.tableElements.splice(elementIndex,1)
      }
    });
  }

  removeElementsSqlSelector(data:any[], index){
    let sqlElement = this.sqlElementModification[index];
    data.forEach(element => {
      sqlElement.tableElements.push(element[sqlElement.element])
    });
  }


  initializeForm(keys: Array<any>, values: Array<any>, popupForm?:boolean){
    let form=new FormGroup({})
    let hasEnumBySQLElement = false;
    for(let i=0; i< keys.length; i++){
      const key= keys[i];
      let value = null;
      if(values[i].control==="selector" && (this.taskID== -1 || popupForm) ){
        if(values[i].selector.queryParams){
          let result = this.getDataDynamicSelectors(values[i].selector.data, values[i].label);
          value = (result && result.length>0)?result[0][values[i].selector.value]:null;
        }
        else{
          let result = this.getDataFixedSelectors(values[i].selector.data);
          value=(result && result.length>0)?result[0][values[i].selector.value]:null;
        } //[values[i].selector.value]
      }
      else if(values[i].hidden) { value=values[i].value }
      else if(values[i].control==="checkbox") {value=false}
      else if(values[i].control==="enum" && popupForm) { value=values[i].enum.elements[0].value  }

      if(values[i].control==="enumBySQLElement" && popupForm ){
        hasEnumBySQLElement= true;
      }
  
      // if(values[i].required){
      //   form.addControl(key,new FormControl(value,[Validators.required]));
      // }
      form.addControl(key,new FormControl(value,[]));


  
    }
    if(popupForm){
      this.formHasSqlElementSelector.push(hasEnumBySQLElement);
    }
    return form;


  }

  async initializeSelectorsPopups(){
    let formKeys=Object.keys(this.properties.form.elements)
    for (const key of formKeys) {
      let keySpecification = this.properties.form.elements[key]
      if(keySpecification.control==="selectorPopup" || (keySpecification.control==="selector" && this.taskToEdit._links[key])){
        var urlReq = `${this.taskToEdit._links[key].href}`
        if (this.taskToEdit._links[key].templated) {
          var url = new URL(urlReq.split("{")[0]);
          url.searchParams.append("projection", "view")
          urlReq = url.toString();
        }
        let value= await (this.http.get(urlReq)).toPromise();
        // let value= await (this.http.get(urlReq)).pipe(map(data => data['_embedded'][key])).toPromise();
        if(value){
          if(keySpecification.control==="selectorPopup"){
            this.taskForm.get(key).setValue(value)
          }
          else{
            this.taskForm.get(key).setValue(value[keySpecification.selector.value]);
          }
        }


      }


    }

  }

  async setTaskValues(){
    let taskKeys=Object.keys( this.taskToEdit);
    for (const key of taskKeys) {
      let keySpecification = this.properties.form.elements[key]
      if(!keySpecification){
        if(!config.taskSelectorFieldsForm[key] || !this.properties.form.elements[config.taskSelectorFieldsForm[key]] ){
          this.taskForm.addControl(key,new FormControl( this.taskToEdit[key],[]));
        }
        else{
          keySpecification = this.properties.form.elements[config.taskSelectorFieldsForm[key]]
          if(keySpecification.control==="selector"){
            this.taskForm.get(config.taskSelectorFieldsForm[key]).setValue( this.taskToEdit[key])
          }
        }
      }
      else{
        let value=this.taskToEdit[key]
        this.taskForm.get(key).setValue(value)
      }
    };
    if(this.taskToEdit.properties){
      this.loadProperties(this.taskToEdit.properties);
    }

  }

  private async loadProperties(properties){
    let keys= Object.keys(properties);

    keys.forEach(key => {

      if(key=='parameters'){
        this.parametersTable.push(...properties[key]);
      }

      if(!this.taskForm.get(key)){
        this.taskForm.addControl(key,new FormControl( properties[key],[]));
        if(key == 'layers' && properties[key]){
           this.taskForm.patchValue({
             layers: properties[key].join()
           });
        }
      }
      else{
        this.taskForm.get(key).setValue(properties[key])
      }
    });

  }







  setSelectorToNeeded(selector){
    if(selector==config.tasksSelectorsIdentifiers.taskGroup){ this.taskGroupsNeeded = true}
    else if(selector==config.tasksSelectorsIdentifiers.taskUI) { this.taskUIsNeeded = true }
    else if(selector==config.tasksSelectorsIdentifiers.wfsServices) { this.wfsServicesNeeded = true }
    else if(config.tasksSelectorsIdentifiers.fmeServices) { this.fmeServicesNeeded = true }
    else if(selector==config.tasksSelectorsIdentifiers.locators) { this.locatorsNeeded = true }
    else if(selector==config.tasksSelectorsIdentifiers.cartographies) { this.cartographiesNeeded = true }
    else if(selector==config.tasksSelectorsIdentifiers.connection) { this.connectionsNeeded = true }
  }


  getFieldWithCondition(condition, table, fieldResult, form, fieldName?){
    if(table == undefined) { return false; }

    if(condition == undefined || !Array.isArray(table)) {
       return table;
    }

    let findResult= table.find(element => element[condition] === form.value[condition])

    if(findResult != undefined) { 
      findResult=findResult[fieldResult] 
      if(fieldResult=="hidden" && table.length>0 && table[0].ignore){
        form.get(fieldName).reset();
        form.get(fieldName).disable();
      }
    }
    else{
      if(fieldResult == "hidden"){
        findResult = false;
        if(table.length>0 && table[0].ignore){
          form.get(fieldName).enable();
        }
      }
      if(fieldResult == "required" || fieldResult == "disabled" ) { findResult = false }
    }
    if(findResult === "INPUT") { findResult="input" }
    return findResult;
  }

  parseLinksSavedTask(){
    let linksKeys = Object.keys(this.savedTask._links);
    linksKeys.forEach(link => {
      if(this.savedTask._links[link].templated){
        this.savedTask._links[link].href=this.savedTask._links[link].href.split("{")[0]
      }
    });
  }
 

  onSaveButtonClicked(){
    if(this.taskForm.valid)
    {
      let formkeys= Object.keys(this.taskForm.value);
      formkeys.forEach(key => {
        this.savedTask[key] = this.taskForm.get(key).value;
      });
      this.savedTaskTreatment(this.savedTask)
      this.savedTask.type= this.taskType;
      if(this.savedTask._links){
        this.parseLinksSavedTask();
      }
      let keysTextAreaNotNull = this.getControlsModified("textArea");
      if(keysTextAreaNotNull.length>0){
        let markResult = this.markIndexSqlElementToBeSaved(this.properties.tables, keysTextAreaNotNull)
        console.log(markResult)

        markResult.forEach(tableIndex => {
          let event = tableIndex == this.indexParameter?'saveParameters':'save'
          this.getAllElementsEvent[tableIndex].next(event)
        });
      }
      else{
        if(this.indexParameter < 0){
          this.saveTask()
        }
        else{
          this.getAllElementsEvent[this.indexParameter].next('saveParameters');
        }
      }
      console.log(this.savedTask);
    }
    else {
      this.utils.showRequiredFieldsError();
    }
  }

  getControlsModified(control){
    let keys= Object.keys(this.properties.form.elements);
    let i = -1;
    let keysNotNull = [];
    for (const key of keys) {
      i++;
      if( this.properties.form.elements[key].control  && Array.isArray(this.properties.form.elements[key].control)){
        for (const element of this.properties.form.elements[key].control) {
          if(element.control==control && this.taskForm.get(key).value ) {
            keysNotNull.push(key) 
         }
        }
      }
      else if(this.properties.form.elements[key].control===control  && this.taskForm.get(key).value ){
           keysNotNull.push(key);
      }
    };
    return keysNotNull;
  }

  markIndexSqlElementToBeSaved(tables, keysNotNull){
    let tablesMarked = [];
    tables.forEach((table, index) => {
      if(table.controlAdd.control=="formPopup"){
        let keys= Object.keys(table.controlAdd.elements)
        for(let i =0; i< keys.length; i++){
          if(table.controlAdd.elements[keys[i]].control=="enumBySQLElement"){
            if(keysNotNull.includes(table.controlAdd.elements[keys[i]].element))
            {
              tablesMarked.push(index);
              this.sqlElementModification[index].toSave= true;
              this.sqlElementModification[index].mainFormElement= table.controlAdd.elements[keys[i]].element;
              break;
            }
          }
        };
      }
    });

    return tablesMarked;

  }

  saveTask(){
      let allChangesSaved = true;
      //Verify that all SqlElements are saved
      this.sqlElementModification.forEach(element => {
        if(element.toSave || element.modifications) { allChangesSaved = false }
      });
      if(allChangesSaved){
        this.currentTablesSaved=0;
        console.log(this.savedTask);
        this.taskService.save(this.savedTask).subscribe( result =>{
          console.log(result);
          if(this.taskForm.get("id")) { this.taskForm.get("id").setValue(result.id); }
          else { this.taskForm.addControl("id",new FormControl(result.id,[])); }
  
          if(this.taskForm.get("_links")) { this.taskForm.get("_links").setValue(result._links); }
          else { this.taskForm.addControl("_links",new FormControl(result._links,[])); }

          this.taskToEdit=result;
          this.taskID = result.id;
          if(this.indexParameter >= 0){
            this.refreshElements[this.indexParameter].next(true);
          }

          this.getAllElementsEvent.forEach((element, index) => {
            if(index != this.indexParameter)element.next('save');
          });
          
          
        })
      }

  }

  savedTaskTreatment(taskSaved){
    let keys= Object.keys(taskSaved)

    keys.forEach(key => {
      let keySpecification = this.properties.form.elements[key]
      if(keySpecification){

        if(keySpecification.control == "selector"){
          let data=this.getDataSelector(keySpecification.selector.data, keySpecification.selector.queryParams, keySpecification.label)
          taskSaved[key]=data.find(element => element[keySpecification.selector.value] == taskSaved[key])
        }

      }
      
    });

    this.savePropertiesTreatment();

  }

  savePropertiesTreatment(){
    
    if(this.taskTypeName ==  config.tasksTypesNames.document || this.taskTypeName == config.tasksTypesNames.download ){
      this.savedTask.properties={
        format: this.savedTask['format'],
        scope: this.taskTypeName == config.tasksTypesNames.document?this.savedTask['scope'].value:this.taskForm.get('scope').value,
        path: this.savedTask['path'],
      }
      delete this.savedTask['format'];
      delete this.savedTask['scope'];
      delete this.savedTask['path'];
    }
    else if(this.taskTypeName == config.tasksTypesNames.query || this.taskTypeName== config.tasksTypesNames.moreInfo || this.taskTypeName==  config.tasksTypesNames.locator ){
      this.savedTask.properties={
        command: this.savedTask['value'],
        scope: this.savedTask['scope'].value,
      }
      delete this.savedTask['value'];
      delete this.savedTask['scope'];
    
    }
    else if(this.taskTypeName == config.tasksTypesNames.extraction || this.taskTypeName == config.tasksTypesNames.report  ){
      let key =this.taskTypeName == config.tasksTypesNames.extraction ?'layers':'layer'
      if(!Array.isArray(this.savedTask[key])){
        let layers = this.savedTask[key]?this.savedTask[key].split(','):null;
        this.savedTask.properties={};
        this.savedTask.properties[key]=layers;
      }

    }

  }


  getDataSQLElement(value, pattern, index){
    if(!this.taskForm.get(value).value) { return [] };
    let regex=new RegExp("[${]+[\\w\\d]+[}]", "g")
    let sentence: string=this.taskForm.get(value).value;
    let coincidences=sentence.match(regex)
    let coincidencesNotUsed= [];
    let tableWithUsedElements= [...this.sqlElementModification[index].tableElements]
    if(coincidences && coincidences.length>0){
      for (const coincidence of coincidences) {
        let indexElement= tableWithUsedElements.findIndex(element => element === coincidence)
        if(indexElement < 0) { coincidencesNotUsed.push(coincidence)  }
        else{
          tableWithUsedElements.splice(indexElement,1)
        }
      }
    }
    // if(this.sqlElementModification[index].tableElements.length>0)
    // {
    //   let indexElement = tableWithUsedElements.findIndex(element => )
    //   coincidences = coincidences.filter(element =>  !this.sqlElementModification[index].tableElements.includes(element) )
    // }
    return coincidencesNotUsed;
    
  }


  getDataSelector(data, queryParams, label){
    let dataToReturn = []
    if(queryParams){
      dataToReturn = this.getDataDynamicSelectors(data, label)
    }
    else{
      dataToReturn = this.getDataFixedSelectors(data);
    }

    let fieldToSort = config.taskSelectorSortField[data];
    if(fieldToSort){
      dataToReturn.sort((a,b) => a[fieldToSort].localeCompare(b[fieldToSort]));
    }

    return dataToReturn;
        

  }

  getDataFixedSelectors(data){
    if(data==config.tasksSelectorsIdentifiers.taskGroup){ return this.taskGroups }
    else if(config.tasksSelectorsIdentifiers.fmeServices) { return this.taskUIs }
    else if(data==config.tasksSelectorsIdentifiers.wfsServices) { return this.wfsServices }
    else if(data==config.tasksSelectorsIdentifiers.fmeServices) { return this.fmeServices }
    else if(data==config.tasksSelectorsIdentifiers.locators) { return this.locators }
    else if(data==config.tasksSelectorsIdentifiers.cartographies) { return this.cartographies }
    else if(data==config.tasksSelectorsIdentifiers.connection) { return this.connections }
  }

  getDataDynamicSelectors(data, field){
    if(data=='codelist-values'){
      return this.codeListsMap.get(field);
    }
    if(data=='tasks'){
      return this.tasksMap.get(field);
    }
    if(data=='service'){
      return this.servicesMap.get(field)
    }
  }

  onPopupDeleteButtonClicked(field){
      
    this.taskForm.get(field).setValue(null);

  }

  openPopupDialog(field, data, columns, label, checkbox, status, singleSelection, index, currentData, ignoreCurrentData? ){

    let getAllfunction = this.getDataTable(data)
    let orderField = this.getOrderField(columns,data,false);
    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.getAllsTable = [() => getAllfunction];
    dialogRef.componentInstance.singleSelectionTable = [singleSelection];
    dialogRef.componentInstance.orderTable = [orderField];
    dialogRef.componentInstance.columnDefsTable = [this.generateColumnDefs(columns,data,checkbox, status)];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.currentData = ignoreCurrentData?[]:[currentData];
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
    console.log( this.templates.find(dir => dir.name === index))
    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived=this.templates.find(dir => dir.name === index).template;
    dialogRef.componentInstance.title=this.utils.getTranslate(label);
    dialogRef.componentInstance.form=this.forms[index]

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Add') {
          this.addelements[index].next([this.forms[index].value])
          if(this.formSQLElement[index] !== null ){
            this.sqlElementModification[index].modifications=true;
            // this.sqlElementModification[index].tableElements.splice(this.forms[index].get(this.sqlElementModification[index].element).value,1)
            this.getAllElementsEvent[index].next('addParameter')
          }
          
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
    if (this.taskID == -1 || !this.taskToEdit ||!this.taskToEdit._links[link]) {
      const aux: Array<any> = [];
      return of(aux);
    }


    var urlReq = `${this.taskToEdit._links[link].href}`
    if (this.taskToEdit._links[link].templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }
    let embeddedKey = link;
    if(link == "availabilities") { embeddedKey="task-availabilities" }
    return (this.http.get(urlReq)).pipe(map(data => data['_embedded'][embeddedKey]));

  }

  private getOrderField(columns,link, notDialog, hasName?, hasOrder?){
    let field = null;
    field = (notDialog)?config.taskTablesSortField[link]:config.taskTablesDialogsSortField[link];
    if(!field){
      if(!notDialog){
        let keys = Object.keys(columns);
        for(let i=0; i< keys.length; i++){
  
          if(keys[i]== 'order'){
            field = 'order';
            break;
          }
          else if(keys[i]=='name'){
            field = 'name';
          }
  
        }
      }
      else{
        if(hasOrder) { field = 'order' }
        else if(hasName) { field = 'name' }
      }

    }

    return field;
  }





  generateColumnDefs(columns,link, checkbox, status, notDialog?){

    let columnResults = [];
    if(checkbox) {columnResults.push(this.utils.getSelCheckboxColumnDef())}

    let keys= Object.keys(columns);
    let values= Object.values(columns);
    let hasOrderField = false;
    let hasNameField = false;
    for(let i=0; i< keys.length; i++){
      
      if(keys[i]=='order' && notDialog) { hasOrderField = true }
      if(keys[i]=='name' && notDialog) { hasNameField = true }
      let currentColumnDef;
      if(values[i]['editable'] === "true"){
        currentColumnDef=this.utils.getEditableColumnDef(values[i]['label'], keys[i]);
      }
      else{
        currentColumnDef=this.utils.getNonEditableColumnDef(values[i]['label'], keys[i]);
      }
      if(values[i]['textAreaSelector']){
        currentColumnDef.cellEditor='agLargeTextCellEditor';
        currentColumnDef.cellEditorParams= {
          maxLength: 900000
        }
      }
      columnResults.push(currentColumnDef);
    }
    if(status) {columnResults.push(this.utils.getStatusColumnDef())}

    this.defaultColumnsSorting.push(this.getOrderField(columns,link,true,hasNameField,hasOrderField));

    return columnResults;

  }

}
