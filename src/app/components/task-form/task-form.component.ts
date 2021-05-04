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
  getAllElementsEvent = [];
  //Table's arrays
  sqlElementModification = [];


  //Form tables
  forms = [];
  formHasSqlElementSelector = [];
  tableFormElements = [];
  keysForms = [];
  valuesForms = [];
  templateRefs = [];
  formSQLElement = [];
  @ViewChildren(NgTemplateNameDirective) templates!: QueryList<NgTemplateNameDirective>;


  //Save
  saveButtonClicked = false;
  savedTask;
 

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
      let index= -1;
      for(const table of this.properties.tables){
        index++;
        getAll= () => this.getDataTableByLink(table.link)
        this.getAlls.push(getAll)  
        let addElementsEvent: Subject<any[]> = new Subject<any[]>();
        let getAllElements: Subject<boolean> = new Subject <boolean>();
        this.addelements.push(addElementsEvent);
        this.getAllElementsEvent.push(getAllElements)
        this.sqlElementModification.push({modifications: false, toSave: false, element: null, mainFormElement:null, tableElements: []});
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

  getAllRowsTable(data: any[], index )
  {
    let sqlElement = this.sqlElementModification[index];
    sqlElement.tableElements=[];
    let toSave: boolean = sqlElement.toSave;
    if(sqlElement.modifications || sqlElement.toSave){
      let result = [];
      for (const element of data) {
        if(element.status!= "pendingDelete"){
          result.push(element[sqlElement.element])
          if(toSave){
            this.savedTask[sqlElement.mainFormElement]= this.savedTask[sqlElement.mainFormElement].replace(element[sqlElement.element], element["value"]);
          }
        }
      }
      sqlElement.tableElements=result;
      sqlElement.modifications=false;
      sqlElement.toSave=false;
      if(toSave){
        this.saveTask();
      }
      console.log(this.savedTask);

    }
    else{

    }
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
            value=this.getDataDynamicSelectors(values[i].selector.data, values[i].label)[0][values[i].selector.value];        
        }
        else{
          value=this.getDataFixedSelectors(values[i].selector.data)[0][values[i].selector.value]
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
      if(keySpecification.control==="selectorPopup"){
        var urlReq = `${this.taskToEdit._links[key].href}`
        if (this.taskToEdit._links[key].templated) {
          var url = new URL(urlReq.split("{")[0]);
          url.searchParams.append("projection", "view")
          urlReq = url.toString();
        }
        urlReq="http://localhost:8080/api/cartographies/1228?projection=view"
        let value= await (this.http.get(urlReq)).toPromise();
        // let value= await (this.http.get(urlReq)).pipe(map(data => data['_embedded'][key])).toPromise();
        this.taskForm.get(key).setValue(value)
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

  }

  // setSelectorValueWithProjection(key, keySpecification){
  //   let data = null;
  //   let formField = config.taskSelectorFieldsData[key];
  //   data= this.getDataSelector(formField, keySpecification.selector.queryParams, keySpecification.label)
  //   let value=data.find(element => element[keySpecification.selector.value] === this.taskToEdit[key])
  //   this.taskForm.get(config.taskSelectorFieldsForm[key]).setValue(value[keySpecification.selector.value]) 
    
    
  //   // this.taskForm.get(key).setValue(this.taskToEdit[key])
  // }


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
    if(this.taskForm.valid)
    {
      this.savedTask = {...this.taskForm.value}
      this.savedTaskTreatment(this.savedTask)
      let keysTextAreaNotNull = this.getControlsModified("textArea");
      if(keysTextAreaNotNull.length>0){
        let markResult = this.markIndexSqlElementToBeSaved(this.properties.tables, keysTextAreaNotNull)
        console.log(markResult)
        markResult.forEach(tableIndex => {
          this.getAllElementsEvent[tableIndex].next(true)
        });
      }
      else{
        this.saveTask();
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
      this.taskService.save(this.savedTask).subscribe( result =>{
        console.log(result);
        if(this.taskForm.get("id")) { this.taskForm.get("id").setValue(result.id); }
        else { this.taskForm.addControl("id",new FormControl(result.id,[])); }

        if(this.taskForm.get("_links")) { this.taskForm.get("_links").setValue(result.id); }
        else { this.taskForm.addControl("_links",new FormControl(result._links,[])); }
        
        
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
          taskSaved[key]=data.find(element => element[keySpecification.selector.value] === taskSaved[key])
        }

      }
      
    });
  }


  getDataSQLElement(value, pattern, index){
    if(!this.taskForm.get(value).value) { return [] };
    let regex=new RegExp("[${]+[\\w\\d]+[}]", "g")
    let sentence: string=this.taskForm.get(value).value;
    let coincidences=sentence.match(regex)
    let coincidencesNotUsed= [];
    let tableWithUsedElements= [...this.sqlElementModification[index].tableElements]
    if(coincidences.length>0){
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
            this.getAllElementsEvent[index].next(true)
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





  generateColumnDefs(columns, checkbox, status){

    let columnResults = [];
    if(checkbox) {columnResults.push(this.utils.getSelCheckboxColumnDef())}

    let keys= Object.keys(columns);
    let values= Object.values(columns);
    for(let i=0; i< keys.length; i++){
      if(values[i]['editable'] === "true"){
        columnResults.push(this.utils.getEditableColumnDef(values[i]['label'], keys[i]))
      }
      else{
        columnResults.push(this.utils.getNonEditableColumnDef(values[i]['label'], keys[i]))    
      }
      // columnResults.push({headerName: this.utils.getTranslate(values[i]['label']), field: keys[i], editable: values[i]['editable'] })
    }
    if(status) {columnResults.push(this.utils.getStatusColumnDef())}

    return columnResults;

  }

}
