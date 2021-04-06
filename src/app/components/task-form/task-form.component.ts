import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService, TaskService, TaskGroupService, CartographyService, ConnectionService, HalOptions, HalParam, TaskUIService, RoleService } from 'dist/sitmun-frontend-core/';
import { config } from 'src/config';
import { MatDialog } from '@angular/material/dialog';
import { DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

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

  //Events data grid
  addelements= [];

  //Selector tables
  taskGroups: Array<any> = [];
  taskGroupsNeeded: boolean = false;
  taskUIs: Array<any> = [];
  taskUIsNeeded: boolean = false;
  documentTypes: Array<any> = [];
  documentTypesNeeded: boolean = false;
  wfsServices: Array<any> = [];
  wfsServicesNeeded: boolean = false;
  fmeServices: Array<any> = [];
  fmeServicesNeeded: boolean = false;
  accessTypes: Array<any> = [];
  accessTypesNeeded: boolean = false;
  locators: Array<any> = [];
  locatorsNeeded: boolean = false;
  cartographies: Array<any> = [];
  cartographiesNeeded: boolean = false;
  connections: Array<any> = [];
  connectionsNeeded: boolean = false;



  properties = { 
    "form":{
      "label": "tasksEntity.generalData",
      "elements": {
        "type": { 
          "hidden": true, 
          "value": 1,
          "required":true
        },
        "name": { 
          "label": "tasksEntity.name", 
          "control": "input", 
          "required":true
        }, 
        // "checkbox": { 
        //   "label": "tasksEntity.checkbox", 
        //   "control": "checkbox", 
        // }, 
        // "provaRadio": { 
        //   "label": "tasksEntity.type", 
        //   "control": "enum", 
        //   "enum": 
        //     { 
        //       "list": "tasksEntity.type", 
        //       "elements": [ 
        //         {
        //           "label": "tasksEntity.fix",
        //           "value": "VALOR"
        //         }, 
        //         {
        //           "label": "tasksEntity.user",
        //           "value": "FITRO"
        //         }, 
        //         {
        //           "label": "tasksEntity.dataInput",
        //           "value": "DATATYPE"
        //         }
        //       ] 
        //     }
        // },
        // "provaGon": {
        //   "condition": "name",
        //   "label": [
        //     {
        //     "name": "VALOR",
        //     "text": "tasksEntity.value"
        //     },	
        //     {
        //     "name": "FITRO",	
        //     "text": "tasksEntity.filterText"
        //     },			
        //     {
        //     "name": "DATATYPE",	
        //     "text": "tasksEntity.formatDataInput"
        //     }
        //   ],							
        //   "control": "input",
        //   "required": true
        // }, 
        "group": { 
          "label": "tasksEntity.group", 
          "control": "selector", 
          "selector":{
            "data":"taskGroup",
            "name": "name",
            "value": "id",
          },
          "required":true
        }, 
        "ui": { 
          "label": "tasksEntity.ui", 
          "control": "selector",
          "selector":{
            "data":"taskUi",
            "name": "name",
            "value": "id",
          },
          "required":true
        }, 
        "cartography": { 
          "label": "tasksEntity.cartography", 
          "control": "selectorPopup", 
          "selectorPopup":{
            "data":"cartography",
            "value":"name",
            "columns":{
              "id": {
                "label":"tasksEntity.id",
                "editable": "false",
              },
              "name": {
                "label":"tasksEntity.name",
                "editable": "false"
              }
            }
          },
          "required":true
        }
      },
    },
    "tables":
      [
        { 
          "link":"roles",
          "label": "tasksEntity.roles", 
          "controlAdd": {
            "control":"selectorPopup",
            "data":"roles", 
            "columns":{
              "id": {
                "label":"tasksEntity.id",
                "editable": "false",
              },
              "name": { 
                "label": "tasksEntity.name", 
                "editable": "false,"
              },
            }
          },
          "columns" : {
            "id": {
              "label":"tasksEntity.id",
              "editable":"true"
            },
            "name": { 
              "label": "tasksEntity.name", 
              "editable": "false,"
            },
          }
        },	
        // { 
        //   "link":"roles",
        //   "label": "tasksEntity.roles", 
        //   "controlAdd": {
        //     "control":"selectorPopup",
        //     "data":"availabilities", 
        //     "columns":{
        //       "id": {
        //         "label":"tasksEntity.id",
        //         "editable":"true"
        //       }
        //     }
        //   } ,
        //   "columns" : {
        //     "id": {
        //       "label":"tasksEntity.id",
        //       "editable": "false",
        //     },            
        //     "name": { 
        //       "label": "tasksEntity.parameter", 
        //       "editable": "false,"
        //     },
        //   }					
        // }, 
        // {
        //   "link":"roles",
        //   "label": "tasksEntity.parameters",
        //   "columns" : {
        //     "id": {
        //       "label":"tasksEntity.id",
        //       "editable": "false",
        //     },            
        //     "name": { 
        //       "label": "tasksEntity.parameter", 
        //       "editable": "false,"
        //     },
        //   },
        //   "controlAdd": {
        //     "control":"formPopup",
        //     "label": "tasksEntity.paramData",			
        //     "elements":{
        //       "type": { 
        //         "label": "tasksEntity.type", 
        //         "control": "enum", 
        //         "enum": 
        //           { 
        //             "list": "tasksEntity.type", 
        //             "elements": [ 
        //               {
        //                 "label": "tasksEntity.fix",
        //                 "value": "VALOR"
        //               }, 
        //               {
        //                 "label": "tasksEntity.user",
        //                 "value": "FITRO"
        //               }, 
        //               {
        //                 "label": "tasksEntity.dataInput",
        //                 "value": "DATATYPE"
        //               }
        //             ] 
        //           }
        //       },
        //       "name": { 
        //         "label":"tasksEntity.paramURL", 
        //         "control": "input",
        //         "required":true,
        //       },
        //       "value": {
        //         "condition": "type",
        //         "label": [
        //           {
        //           "type": "VALOR",
        //           "text": "tasksEntity.value"
        //           },	
        //           {
        //           "type": "FITRO",	
        //           "text": "tasksEntity.filterText"
        //           },			
        //           {
        //           "type": "DATATYPE",	
        //           "text": "tasksEntity.formatDataInput"
        //           }
        //         ],							
        //         "control": "input",
        //         "required": true
        //       }, 
        //       "order": { 
        //         "label": "tasksEntity.order", 
        //         "control": "input"
        //       }
        //     }	
        //   }
        // } 
      ]
    }

  

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
        ) {

  }

  ngOnInit(): void {
    if(this.properties.form){

      let keys= Object.keys(this.properties.form.elements);
      let values= Object.values(this.properties.form.elements);
      for(let i=0; i< keys.length; i++){
        this.formElements.push({fieldName:keys[i], values:values[i]})
        if(values[i][`control`] === "selector") this.setSelectorToNeeded(values[i][`selector`][`data`])
      }
      this.initializeForm(keys,values);
      let getAll;
      this.properties.tables.forEach(table => {
        getAll= () => this.getDataTableByLink(table.link)
        this.getAlls.push(getAll)  
         let addElementsEvent: Subject<any[]> = new Subject<any[]>();
         this.addelements.push(addElementsEvent);
         let columnDefs= this.generateColumnDefs(table.columns,true,true);
         this.columnDefsTables.push(columnDefs);
      });

      
      const promises: Promise<any>[] = [];

      if(this.taskGroupsNeeded)
      {
        promises.push(new Promise((resolve, reject) => {
          this.taskGroupService.getAll().subscribe(
            resp => {
              this.taskGroups.push(...resp);
              resolve(true);
            }
          );
        }));
  
      }

      if(this.taskUIsNeeded)
      {
        promises.push(new Promise((resolve, reject) => {
          this.taskUIService.getAll().subscribe(
            resp => {
              this.taskUIs.push(...resp);
              resolve(true);
            }
          );
        }));
      }

      if(this.documentTypesNeeded){

        promises.push(new Promise((resolve, reject) => {
          this.utils.getCodeListValues('downloadTask.scope').subscribe(
            resp => {
              this.documentTypes.push(...resp);
              resolve(true);
            }
          );
        }));

      }

      if(this.wfsServicesNeeded)
      {
        promises.push(new Promise((resolve, reject) => {
          this.serviceService.getAll().map((resp) => {
            let wfsServices = [];
            resp.forEach(service => {
              if(service.type==='WFS') {wfsServices.push(service)}
            });  
            this.wfsServices.push(...wfsServices)
            resolve(true);
          }).subscribe()
          }));
      }

      if(this.cartographiesNeeded){
        promises.push(new Promise((resolve, reject) => {
          this.cartographyService.getAll().subscribe(
            resp => {
              this.cartographies.push(...resp);
              resolve(true);
            }
          );
        }));
      }

      if(this.fmeServicesNeeded)
      {
        promises.push(new Promise((resolve, reject) => {
          this.serviceService.getAll().map((resp) => {
            let fmeServices = [];
            resp.forEach(service => {
              if(service.type==='FME') {fmeServices.push(service)}
            });  
            console.log(this.fmeServices);
            this.fmeServices.push(...fmeServices)
            resolve(true);
          }).subscribe()
        }));
      }

      if(this.connectionsNeeded)
      {
        promises.push(new Promise((resolve, reject) => {
          this.connectionService.getAll().subscribe(
            resp => {
              this.connections.push(...resp);
              resolve(true);
            }
          );
        }));
      }

      if(this.accessTypesNeeded){
        promises.push(new Promise((resolve, reject) => {
          this.utils.getCodeListValues('queryTask.scope').subscribe(
            resp => {
              this.accessTypes.push(...resp);
              resolve(true);
            }
          );
        }));
      }

      if(this.locatorsNeeded){
        promises.push(new Promise((resolve, reject) => {
          let taskTypeID=config.tasksTypes['report'];
          let params2:HalParam[]=[];
          let param:HalParam={key:'type.id', value:taskTypeID}
          params2.push(param);
          let query:HalOptions={ params:params2};
          this.taskService.getAll(query,undefined,"tasks").subscribe(
            resp => {
              this.locators.push(...resp);
              resolve(true);
            }
          );;
        }));
      }

      Promise.all(promises).then(() => {

        this.taskService.get(1).subscribe(
          resp => {
            console.log(resp);
            this.taskToEdit = resp;
            this.dataLoaded=true;
          })


      });






    }

    console.log(this.properties.form)
  }

  initializeForm(keys: Array<any>, values: Array<any>){
    this.taskForm=new FormGroup({})
    for(let i=0; i< keys.length; i++){
      const key= keys[i];
      let value = null;
      if(values[i].hidden) { value=values[i].value }
      else if(values[i].control==="checkbox") {value=false}
  
      if(values[i].required){
        this.taskForm.addControl(key,new FormControl(value,[Validators.required]));
      }
      else{
        this.taskForm.addControl(key,new FormControl(value,[]));
      }

  
    }


  }

  setSelectorToNeeded(selector){
    if(selector=="taskGroup"){ this.taskGroupsNeeded = true}
    else if(selector=="taskUi") { this.taskUIsNeeded = true }
    else if(selector=="documentTypes") { this.documentTypesNeeded = true }
    else if(selector=="wfsServices") { this.wfsServicesNeeded = true }
    else if(selector=="fmeServices") { this.fmeServicesNeeded = true }
    else if(selector=="accessTypes") { this.accessTypesNeeded = true }
    else if(selector=="this.locators") { this.locatorsNeeded = true }
    else if(selector=="cartographies") { this.cartographiesNeeded = true }
    else if(selector=="connections") { this.connectionsNeeded = true }
  }

  getFieldWithCondition(condition, table, fieldResult){

    let findResult= table.find(element => element[condition] === this.taskForm.value[condition])

    if(findResult != undefined) { 
      findResult=findResult[fieldResult] 
    }
    
    return findResult;
  }
 

  onSaveButtonClicked(){
    console.log(this.taskForm.value);
  }

  getDataSelector(data){

        
        if(data=="taskGroup"){ return this.taskGroups }
        else if(data=="taskUi") { return this.taskUIs }
        else if(data=="documentTypes") { return this.documentTypes }
        else if(data=="wfsServices") { return this.wfsServices }
        else if(data=="fmeServices") { return this.fmeServices }
        else if(data=="accessTypes") { return this.accessTypes }
        else if(data=="this.locators") { return this.locators }
        else if(data=="cartographies") { return this.cartographies }
        else if(data=="connections") { return this.connections }
        

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



  getDataTable(field)
  {
    if(field == "cartography") return this.cartographyService.getAll()
    if(field == "service") return this.serviceService.getAll()
    if(field == "roles") return this.roleService.getAll()
    if(field == "connection") return this.connectionService.getAll()
  }

  getDataTableByLink= (link): Observable<any> =>{
    
    if (this.taskID == -1 || this.taskToEdit._links[link] == undefined) {
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
