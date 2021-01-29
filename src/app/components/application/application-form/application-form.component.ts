import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { tick } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService, ApplicationParameterService, RoleService,
   HalOptions, HalParam, CartographyGroupService, TreeService, BackgroundService,
   ApplicationBackgroundService, Role, Background, Tree, Application, CodeList } from '@sitmun/frontend-core';

import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';

import { map } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DialogFormComponent, DialogGridComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent implements OnInit {

  situationMapList: Array<any> = [];
  parametersTypes: Array<any> = [];
  //Dialog
  applicationForm: FormGroup;
  applicationToEdit;
  applicationID = -1;
  dataLoaded: Boolean = false;
  themeGrid: any = environment.agGridTheme;

  //Grids
  columnDefsParameters: any[];
  addElementsEventParameters: Subject<any[]> = new Subject <any[]>();
  dataUpdatedEventParameters: Subject<boolean> = new Subject<boolean>();

  columnDefsTemplates: any[];
  addElementsEventTemplateConfiguration: Subject<any[]> = new Subject <any[]>();
  dataUpdatedEventTemplateConfiguration: Subject<boolean> = new Subject<boolean>();

  columnDefsRoles: any[];
  addElementsEventRoles: Subject<any[]> = new Subject <any[]>();
  dataUpdatedEventRoles: Subject<boolean> = new Subject<boolean>();

  columnDefsBackgrounds: any[];
  addElementsEventBackground: Subject<any[]> = new Subject <any[]>();
  dataUpdatedEventBackground: Subject<boolean> = new Subject<boolean>();

  columnDefsTrees: any[];
  addElementsEventTree: Subject<any[]> = new Subject <any[]>();
  dataUpdatedEventTree: Subject<boolean> = new Subject<boolean>();


  applicationTypes: Array<any> = [];

  //Dialogs

  columnDefsParametersDialog: any[];
  public parameterForm: FormGroup;
  getAllElementsEventParameters: Subject<boolean> = new Subject <boolean>();
  @ViewChild('newParameterDialog',{
    static: true
  }) private newParameterDialog: TemplateRef <any>;
  @ViewChild('newTemplateDialog',{
    static: true
  }) private newTemplateDialog: TemplateRef <any>;
  columnDefsTemplateConfigurationDialog: any[];
  getAllElementsEventTemplateConfiguration: Subject<boolean> = new Subject <boolean>();
  
  columnDefsRolesDialog: any[];
  getAllElementsEventRoles: Subject<boolean> = new Subject <boolean>();
 
  columnDefsBackgroundDialog: any[];
  getAllElementsEventBackground: Subject<boolean> = new Subject <boolean>();
  
  columnDefsTreeDialog: any[];
  getAllElementsEventTree: Subject<boolean> = new Subject <boolean>();

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private backgroundService: BackgroundService,
    private applicationParameterService:ApplicationParameterService,
    private applicationBackgroundService:ApplicationBackgroundService,
    private roleService: RoleService,
    private treeService: TreeService,
    private http: HttpClient,
    public utils: UtilsService,
    private cartographyGroupService: CartographyGroupService,
  ) {
    this.initializeApplicationForm();
    this.initializeParameterForm();
  }



  ngOnInit(): void {

    this.utils.getCodeListValues('application.type').subscribe(
      resp => {
        this.applicationTypes.push(...resp);
      }
    );

    this.utils.getCodeListValues('applicationParameter.type').
    pipe(
      map( (resp: any) => {
        let newTable: CodeList[]= [];
        resp.forEach(element => {
            if( element.value !== 'PRINT_TEMPLATE') {newTable.push(element)}
        });
        return newTable;
      })
    ).subscribe(
      resp => {
        this.parametersTypes.push(...resp);
      }
    );

    let situationMapByDefault = {
      id: -1,
      name: '-------'
    }
    this.situationMapList.push(situationMapByDefault);

    this.getSituationMapList().subscribe(
      resp => {
        this.situationMapList.push(...resp);
      }
    );

    this.activatedRoute.params.subscribe(params => {
      this.applicationID = +params.id;
      if (this.applicationID !== -1) {
        console.log(this.applicationID);

        this.applicationService.get(this.applicationID).subscribe(
          resp => {
            console.log(resp);
            this.applicationToEdit = resp;


            this.applicationForm.setValue({
              id: this.applicationID,
              name: this.applicationToEdit.name,
              type: this.applicationToEdit.type,
              title: this.applicationToEdit.title,
              tree: ' ',
              jspTemplate: this.applicationToEdit.jspTemplate,
              theme: this.applicationToEdit.theme,
              situationMap: this.applicationToEdit.situationMapId,
              scales: this.applicationToEdit.scales,
              srs: this.applicationToEdit.srs,
              treeAutoRefresh: this.applicationToEdit.treeAutoRefresh,
              _links: this.applicationToEdit._links
            });

            this.dataLoaded = true;
          },
          error => {

          }
        );
      }
      else {
        this.applicationForm.patchValue({
          moveSupramunicipal: false,
          treeAutorefresh: false,
          situationMap: -1
        });
      }

    },
      error => {

      });
 

    this.columnDefsParameters = [
      environment.selCheckboxColumnDef,
      { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('applicationEntity.value'), field: 'value', },
      { headerName: this.utils.getTranslate('applicationEntity.type'), field: 'type' },
      { headerName: this.utils.getTranslate('applicationEntity.status'), field: 'status', editable:false },


    ];

    this.columnDefsTemplates = [

      environment.selCheckboxColumnDef,
      { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('applicationEntity.value'), field: 'value', },
      { headerName: this.utils.getTranslate('applicationEntity.status'), field: 'status', editable:false },

    ];

    this.columnDefsRoles = [

      environment.selCheckboxColumnDef,
      { headerName: "ID", field: 'id' },
      { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('applicationEntity.status'), field: 'status', editable:false },


    ];

    this.columnDefsBackgrounds = [

      environment.selCheckboxColumnDef,
      { headerName: "ID", field: 'id' },
      { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name', description:false },
      { headerName: this.utils.getTranslate('applicationEntity.description'), field: 'description', editable:false },
      { headerName: this.utils.getTranslate('applicationEntity.status'), field: 'status', editable:false },


    ];

    this.columnDefsTrees = [

      environment.selCheckboxColumnDef,
      { headerName: "Id", field: 'id' },
      { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name' },
      { headerName: this.utils.getTranslate('applicationEntity.status'), field: 'status', editable:false },


    ];

    this.columnDefsParametersDialog = [

      environment.selCheckboxColumnDef,
      { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name', editable: false },
      { headerName: this.utils.getTranslate('applicationEntity.value'), field: 'value', editable: false },
      { headerName: this.utils.getTranslate('applicationEntity.type'), field: 'type', editable: false },
    ];

    this.columnDefsTemplateConfigurationDialog = [

      environment.selCheckboxColumnDef,
      { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name', editable: false },
      { headerName: this.utils.getTranslate('applicationEntity.value'), field: 'value', editable: false },
    ];

    this.columnDefsRolesDialog = [

      environment.selCheckboxColumnDef,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name', editable: false },
      { headerName: this.utils.getTranslate('applicationEntity.note'), field: 'description' },
      { headerName: this.utils.getTranslate('applicationEntity.application'), field: 'application' },

    ];

    this.columnDefsBackgroundDialog = [

      environment.selCheckboxColumnDef,
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name', editable: false },
    ];

    
    this.columnDefsTreeDialog = [

      environment.selCheckboxColumnDef,
      { headerName: "Id", field: 'id' },
      { headerName: this.utils.getTranslate('applicationEntity.name'), field: 'name' },

    ];

  }
  getSituationMapList() {
    let params2: HalParam[] = [];
    let param: HalParam = { key: 'type', value: 'M' }
    params2.push(param);
    let query: HalOptions = { params: params2 };

    return this.cartographyGroupService.getAll(query);
  }


  onSelectionTypeAppChanged({ value }) {
    debugger;
    if (value === 'E') {
      this.applicationForm.get('title').disable();
      this.applicationForm.get('tree').disable();
      this.applicationForm.get('scales').disable();
      this.applicationForm.get('srs').disable();
      this.applicationForm.get('situationMap').disable();
      this.applicationForm.get('treeAutoRefresh').disable();
      this.applicationForm.get('theme').disable();
    } else {
      this.applicationForm.get('title').enable();
      this.applicationForm.get('tree').enable();
      this.applicationForm.get('scales').enable();
      this.applicationForm.get('srs').enable();
      this.applicationForm.get('situationMap').enable();
      this.applicationForm.get('treeAutoRefresh').enable();
      this.applicationForm.get('theme').enable();
    }
  }

  initializeApplicationForm(): void {

    this.applicationForm = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl(null, [
        Validators.required,
      ]),
      type: new FormControl(null, [
        Validators.required,
      ]),
      title: new FormControl(null, [
        Validators.required,
      ]),
      tree: new FormControl(null, [
        Validators.required,
      ]),
      jspTemplate: new FormControl(null, [
        Validators.required,
      ]),
      theme: new FormControl(null, [
        Validators.required,
      ]),
      /*mobileUrl: new FormControl(null, [
        Validators.required,
      ]),
      mobileCSS: new FormControl(null, [
        Validators.required,
      ]),
      defaultTool: new FormControl(null, [
        Validators.required,
      ]),
      moveSupramunicipal: new FormControl(null, [
        Validators.required,
      ]),*/
      situationMap: new FormControl(null, [
        Validators.required,
      ]),
      scales: new FormControl(null, [
        Validators.required,
      ]),
      srs: new FormControl(null, [
        Validators.required,
      ]),
      treeAutoRefresh: new FormControl(null, [
        Validators.required,
      ]),
      _links: new FormControl(null, []),

    });

  }

  initializeParameterForm(): void {
    this.parameterForm = new FormGroup({
      name: new FormControl(null, []),
      type: new FormControl(null, []),
      value: new FormControl(null, []),

    })
  }



  // AG-GRID


  // ******** Parameters configuration ******** //

  getAllParameters = (): Observable<any> => {

    if(this.applicationID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    return (this.http.get(`${this.applicationForm.value._links.parameters.href}`))
      .pipe(map(data =>  data[`_embedded`][`application-parameters`].filter(elem=> elem.type!="PRINT_TEMPLATE")
      ));
  } 


  getAllRowsParameters(data: any[] )
  {
    let parameterToSave = [];
    let parameterToDelete = [];
    data.forEach(parameter => {
      if (parameter.status === 'Pending creation' || parameter.status === 'Modified') {
        if(! parameter._links) {
          parameter.application=this.applicationToEdit} //If is new, you need the application link
          parameterToSave.push(parameter)
      }
      if(parameter.status === 'Deleted' && parameter._links) {parameterToDelete.push(parameter) }
    });
    const promises: Promise<any>[] = [];
    parameterToSave.forEach(saveElement => {
      promises.push(new Promise((resolve, reject) => { this.applicationParameterService.save(saveElement).toPromise().then((resp) => { resolve() }) }));
    });

    parameterToDelete.forEach(deletedElement => {
      promises.push(new Promise((resolve, reject) => { this.applicationParameterService.remove(deletedElement).toPromise().then((resp) => { resolve() }) }));
      
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
        name: 'copia_'.concat(parameter.name),
        type: parameter.type,
        value: parameter.value
      }
      
      
      parametersToDuplicate.push(newParameter);
    });
    this.addElementsEventParameters.next(parametersToDuplicate);
  }

  // ******** Template configuration ******** //

  getAllTemplates = (): Observable<any> => {
    if(this.applicationID == -1)
    { 
      const aux: Array<any> = [];
      return of(aux);
    }

    return (this.http.get(`${this.applicationForm.value._links.parameters.href}`))
    .pipe(map(data =>  data[`_embedded`][`application-parameters`].filter(elem=> elem.type=="PRINT_TEMPLATE")
      ));
  }

  //To update templates we use getAllRowsParameters!

  
  duplicateTemplates(data)
  {
    let templatesToDuplicate= []
    data.forEach(template => {
      let newTemplate={
        name: 'copia_'.concat(template.name),
        type: template.type,
        value: template.value
      }
      
      
      templatesToDuplicate.push(newTemplate);
    });
    this.addElementsEventTemplateConfiguration.next(templatesToDuplicate);
  }
  
  


  // ******** Roles ******** //

  getAllRoles = (): Observable<any> => {
    if(this.applicationID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }
    return (this.http.get(`${this.applicationForm.value._links.availableRoles.href}`))
      .pipe(map(data => data[`_embedded`][`roles`]));
  }

  getAllRowsRoles(data: any[] )
  {
    let rolesModified = [];
    let rolesToPut = [];
    data.forEach(role => {
      if (role.status === 'Modified') {rolesModified.push(role) }
      if(role.status!== 'Deleted') {rolesToPut.push(role._links.self.href) }
    });

    console.log(rolesModified);
    this.updateRoles(rolesModified, rolesToPut);

  }

  updateRoles(rolesModified: Role[], rolesToPut: Role[])
  {
    const promises: Promise<any>[] = [];
    rolesModified.forEach(role => {
      promises.push(new Promise((resolve, reject) => { this.roleService.update(role).toPromise().then((resp) => { resolve() }) }));
    });
    Promise.all(promises).then(() => {
        let url=this.applicationToEdit._links.availableRoles.href.split('{', 1)[0];
        this.utils.updateUriList(url,rolesToPut, this.dataUpdatedEventRoles);
    });
  }
  
 

  // ******** Background ******** //

  getAllBackgrounds = (): Observable<any> => {

    if(this.applicationID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.applicationForm.value._links.backgrounds.href}`
    if (this.applicationForm.value._links.backgrounds.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['application-backgrounds']));


  }


  getAllRowsBackgrounds(data: any[] )
  {
    let backgroundsToCreate = [];
    let backgroundsToDelete = [];
    const promises: Promise<any>[] = [];
    data.forEach(background => {

      if (background.status === 'Pending creation') {
        let backgroundToCreate= {
          application: this.applicationToEdit,
          background: background
        }
        backgroundsToCreate.push(backgroundToCreate) 
      }
      if(background.status === 'Deleted' ) {backgroundsToDelete.push(background) }
    });

    backgroundsToCreate.forEach(newElement => {
      promises.push(new Promise((resolve, reject) => { this.applicationBackgroundService.save(newElement).toPromise().then((resp) => { resolve() }) }));
    });

    backgroundsToDelete.forEach(deletedElement => {
      promises.push(new Promise((resolve, reject) => { this.applicationBackgroundService.remove(deletedElement).toPromise().then((resp) => { resolve() }) }));
    });

    Promise.all(promises).then(() => {
      this.dataUpdatedEventBackground.next(true);
    });
    // console.log(backgroundsModified);
    // this.updateBackgrounds(backgroundsModified, backgroundsToPut);
  }

  updateBackgrounds(backgroundsModified: Background[], backgroundsToPut: Background[])
  {
    const promises: Promise<any>[] = [];
    backgroundsModified.forEach(background => {
      promises.push(new Promise((resolve, reject) => { this.backgroundService.update(background).toPromise().then((resp) => { resolve() }) }));
    });
    Promise.all(promises).then(() => {
      let url=this.applicationToEdit._links.backgrounds.href.split('{', 1)[0];
      this.utils.updateUriList(url,backgroundsToPut)
    });
  }
  

  // ******** Trees ******** //

  getAllTrees = (): Observable<any> => {

    if(this.applicationID == -1)
    {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.applicationForm.value._links.trees.href}`
    if (this.applicationForm.value._links.trees.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['trees']));


  }


  getAllRowsTrees(data: any[] )
  {
    let treesModified = [];
    let treesToPut = [];
    data.forEach(tree => {
      if (tree.status === 'Modified') {treesModified.push(tree) }
      if(tree.status!== 'Deleted') {treesToPut.push(tree._links.self.href) }
    });

    console.log(treesModified);
    this.updateTrees(treesModified, treesToPut);
  }

  updateTrees(treesModified: Tree[], treesToPut: Tree[],)
  {
    const promises: Promise<any>[] = [];
    treesModified.forEach(tree => {
      promises.push(new Promise((resolve, reject) => { this.treeService.update(tree).toPromise().then((resp) => { resolve() }) }));
    });
    Promise.all(promises).then(() => {
      let url=this.applicationToEdit._links.trees.href.split('{', 1)[0];
      this.utils.updateUriList(url,treesToPut,this.dataUpdatedEventTree)
    });
  }


  // ******** Parameters Dialog  ******** //


  openParametersDialog(data: any) {
  
    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived=this.newParameterDialog;
    dialogRef.componentInstance.title=this.utils.getTranslate('serviceEntity.configurationParameters');

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Add') {
          let item= this.parameterForm.value;
          this.addElementsEventParameters.next([item])
          console.log(this.parameterForm.value)

          
        }
      }
      this.parameterForm.reset();

    });

  }

  // ******** TemplatesConfiguration Dialog  ******** //

  getAllTemplatesConfigurationDialog = () => {
    const aux: Array<any> = [];
    return of(aux);
    // return this.cartographyService.getAll();
  }

  openTemplateConfigurationDialog(data: any) {
    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived=this.newTemplateDialog;
    dialogRef.componentInstance.title=this.utils.getTranslate('serviceEntity.configurationParameters');

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Add') {
          let item= this.parameterForm.value;
          item.type='PRINT_TEMPLATE';
          this.addElementsEventTemplateConfiguration.next([item])         
        }

      }
      this.parameterForm.reset();
    });

  }
    // ******** Roles Dialog  ******** //

    getAllRolesDialog = () => {
      return this.roleService.getAll();
    }

  
    openRolesDialog(data: any) {

      const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'gridDialogs'});
      dialogRef.componentInstance.getAllsTable=[this.getAllRolesDialog];
      dialogRef.componentInstance.singleSelectionTable=[false];
      dialogRef.componentInstance.columnDefsTable=[this.columnDefsRolesDialog];
      dialogRef.componentInstance.themeGrid=this.themeGrid;
      dialogRef.componentInstance.title = this.utils.getTranslate("applicationEntity.roles");
      dialogRef.componentInstance.titlesTable=[''];
      dialogRef.componentInstance.nonEditable=false;
      
  
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          if(result.event==='Add') {
            this.addElementsEventRoles.next(result.data[0])
          }         
        }
  
      });
  
    }

  // ******** Background Dialog  ******** //

  getAllBackgroundDialog = () => {
    return this.backgroundService.getAll();
  }
  
  openBackgroundDialog(data: any) {
    const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'gridDialogs'});
    dialogRef.componentInstance.getAllsTable=[this.getAllBackgroundDialog];
    dialogRef.componentInstance.singleSelectionTable=[false];
    dialogRef.componentInstance.columnDefsTable=[this.columnDefsBackgroundDialog];
    dialogRef.componentInstance.themeGrid=this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate("applicationEntity.background");
    dialogRef.componentInstance.titlesTable=[''];
    dialogRef.componentInstance.nonEditable=false;
    


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.event==='Add') {
          result.data[0].forEach(element => {
            element.id=null;
          });
          this.addElementsEventBackground.next(result.data[0])
        }         
      }

    });

  }

    // ******** Tree Dialog  ******** //

    getAllTreeDialog = () => {

      return this.treeService.getAll();
    }
  
    openTreeDialog(data: any) {
      const dialogRef = this.dialog.open(DialogGridComponent, {panelClass:'gridDialogs'});
      dialogRef.componentInstance.getAllsTable=[this.getAllTreeDialog];
      dialogRef.componentInstance.singleSelectionTable=[false];
      dialogRef.componentInstance.columnDefsTable=[this.columnDefsTreeDialog];
      dialogRef.componentInstance.themeGrid=this.themeGrid;
      dialogRef.componentInstance.title=this.utils.getTranslate("applicationEntity.tree");
      dialogRef.componentInstance.titlesTable=[''];
      dialogRef.componentInstance.nonEditable=false;
      
  
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          if(result.event==='Add') {
            this.addElementsEventTree.next(result.data[0])
          }                 
        }
  
      });
  
    }


    // Save button

    onSaveButtonClicked(){


      let situationMap= this.situationMapList.find(x => x.id===this.applicationForm.value.situationMap )
      if(situationMap==undefined){
        situationMap=""
      }
  
      var appObj: Application=new Application();
     
      appObj.name= this.applicationForm.value.name;
      appObj.type= this.applicationForm.value.type;
      appObj.title= this.applicationForm.value.title;
      appObj.jspTemplate= this.applicationForm.value.jspTemplate;
      appObj.theme= this.applicationForm.value.theme;
      appObj.scales= this.applicationForm.value.scales;
      appObj.srs= this.applicationForm.value.srs;
      appObj.treeAutoRefresh= this.applicationForm.value.treeAutoRefresh;
      appObj._links= this.applicationForm.value._links;
      appObj.situationMap=situationMap;
      if(this.applicationID==-1){
        appObj.createdDate=new Date();
      }else{
        appObj.id=this.applicationForm.value.id;
        appObj.createdDate=this.applicationToEdit.createdDate
      }
  
 
      this.applicationService.save(appObj)
      .subscribe(resp => {
        this.applicationToEdit = resp;
        this.getAllElementsEventParameters.next(true);
        this.getAllElementsEventTemplateConfiguration.next(true);
        this.getAllElementsEventRoles.next(true);
        this.getAllElementsEventBackground.next(true);
        this.getAllElementsEventTree.next(true);
      },
      error => {
        console.log(error)
      });


  
    }


}
