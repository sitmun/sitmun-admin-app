import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationService, ApplicationParameterService, RoleService,
  HalOptions, HalParam, CartographyGroupService, TreeService, BackgroundService,
  ApplicationBackgroundService, TranslationService, Translation, Role, Background, Tree, Application, CodeList
} from '../../../frontend-core/src/lib/public_api';

import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';

import { map } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { DialogFormComponent, DialogGridComponent } from '../../../frontend-gui/src/lib/public_api';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent implements OnInit {

  //Translations
  nameTranslationsModified: boolean = false;
  titleTranslationsModified: boolean = false;

  nameTranslationMap: Map<string, Translation>;
  titleTranslationMap: Map<string, Translation>;

  situationMapList: Array<any> = [];
  parametersTypes: Array<any> = [];
  //Dialog
  applicationForm: FormGroup;
  applicationToEdit;
  applicationSaved: Application;
  applicationID = -1;
  duplicateID = -1;
  dataLoaded: Boolean = false;
  themeGrid: any = config.agGridTheme;

  //Grids
  columnDefsParameters: any[];
  addElementsEventParameters: Subject<any[]> = new Subject<any[]>();
  dataUpdatedEventParameters: Subject<boolean> = new Subject<boolean>();

  columnDefsTemplates: any[];
  addElementsEventTemplateConfiguration: Subject<any[]> = new Subject<any[]>();
  dataUpdatedEventTemplateConfiguration: Subject<boolean> = new Subject<boolean>();

  columnDefsRoles: any[];
  addElementsEventRoles: Subject<any[]> = new Subject<any[]>();
  dataUpdatedEventRoles: Subject<boolean> = new Subject<boolean>();

  columnDefsBackgrounds: any[];
  addElementsEventBackground: Subject<any[]> = new Subject<any[]>();
  dataUpdatedEventBackground: Subject<boolean> = new Subject<boolean>();

  columnDefsTrees: any[];
  addElementsEventTree: Subject<any[]> = new Subject<any[]>();
  dataUpdatedEventTree: Subject<boolean> = new Subject<boolean>();

  applicationTypes: Array<any> = [];

  //Dialogs

  columnDefsParametersDialog: any[];
  public parameterForm: FormGroup;
  getAllElementsEventParameters: Subject<string> = new Subject<string>();
  @ViewChild('newParameterDialog', {
    static: true
  }) private newParameterDialog: TemplateRef<any>;
  @ViewChild('newTemplateDialog', {
    static: true
  }) private newTemplateDialog: TemplateRef<any>;
  columnDefsTemplateConfigurationDialog: any[];
  getAllElementsEventTemplateConfiguration: Subject<string> = new Subject<string>();

  columnDefsRolesDialog: any[];
  getAllElementsEventRoles: Subject<string> = new Subject<string>();

  columnDefsBackgroundDialog: any[];
  getAllElementsEventBackground: Subject<string> = new Subject<string>();

  columnDefsTreeDialog: any[];
  getAllElementsEventTree: Subject<string> = new Subject<string>();

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private translationService: TranslationService,
    private backgroundService: BackgroundService,
    private applicationParameterService: ApplicationParameterService,
    private applicationBackgroundService: ApplicationBackgroundService,
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
    this.nameTranslationMap = this.utils.createTranslationsList(config.translationColumns.applicationName);
    this.titleTranslationMap = this.utils.createTranslationsList(config.translationColumns.applicationTitle);

    const promises: Promise<any>[] = [];

    promises.push(new Promise((resolve, reject) => {
      this.utils.getCodeListValues('application.type').subscribe(
        resp => {
          this.applicationTypes.push(...resp);
          resolve(true);
        }
      );
    }));

    promises.push(new Promise((resolve, reject) => {
      this.utils.getCodeListValues('applicationParameter.type').
        pipe(
          map((resp: any) => {
            let newTable: CodeList[] = [];
            resp.forEach(element => {
              if (element.value !== config.applicationTemplateIdentificator) { newTable.push(element) }
            });
            return newTable;
          })
        ).subscribe(
          resp => {
            this.parametersTypes.push(...resp);
            resolve(true);
          }
        );
    }));

    let situationMapByDefault = {
      id: -1,
      name: '-------'
    }
    this.situationMapList.push(situationMapByDefault);

    promises.push(new Promise((resolve, reject) => {
      this.getSituationMapList().subscribe(
        resp => {
          this.situationMapList.push(...resp);
          resolve(true);
        }
      );
    }));

    Promise.all(promises).then(() => {
      this.activatedRoute.params.subscribe(params => {
        this.applicationID = +params.id;
        if (params.idDuplicate) { this.duplicateID = +params.idDuplicate; }

        if (this.applicationID !== -1 || this.duplicateID != -1) {

          let idToGet = this.applicationID !== -1 ? this.applicationID : this.duplicateID


          this.applicationService.get(idToGet).subscribe(
            resp => {
              console.log(resp);
              this.applicationToEdit = resp;

              this.applicationForm.patchValue({
                type: this.applicationToEdit.type,
                title: this.applicationToEdit.title,
                jspTemplate: this.applicationToEdit.jspTemplate,
                theme: this.applicationToEdit.theme,
                situationMap: this.applicationToEdit.situationMapId ? this.applicationToEdit.situationMapId : this.situationMapList[0].id,
                scales: this.applicationToEdit.scales,
                srs: this.applicationToEdit.srs,
                treeAutoRefresh: this.applicationToEdit.treeAutoRefresh,
                _links: this.applicationToEdit._links
              });

              if (this.applicationID !== -1) {
                this.applicationForm.patchValue({
                  id: this.applicationID,
                  name: this.applicationToEdit.name,
                  passwordSet: this.applicationToEdit.passwordSet,
                });
              }
              else {
                this.applicationForm.patchValue({
                  name: this.utils.getTranslate('copy_').concat(this.applicationToEdit.name),
                });
              }


              if (this.applicationID != -1) {
                this.translationService.getAll()
                  .pipe(map((data: any[]) => data.filter(elem => elem.element == this.applicationID)
                  )).subscribe(result => {
                    console.log(result);
                    let nameTranslations = [];
                    let titleTranslations = [];
                    result.forEach(translation => {
                      if (translation.column == config.translationColumns.applicationName) {
                        nameTranslations.push(translation)
                      }
                      else if (translation.column == config.translationColumns.applicationTitle) {
                        titleTranslations.push(translation)
                      }
                    });
                    this.utils.updateTranslations(this.nameTranslationMap, nameTranslations)
                    this.utils.updateTranslations(this.titleTranslationMap, titleTranslations)
                  }

                  );;

              }
              this.dataLoaded = true;
            },
            error => {

            }
          );
        }
        else {
          this.dataLoaded = true;
          this.applicationForm.patchValue({
            moveSupramunicipal: false,
            treeAutorefresh: false,
            type: this.applicationTypes[0].value,
            situationMap: this.situationMapList[0].id
          });
          this.applicationForm.get('title').disable();
          this.applicationForm.get('scales').disable();
          this.applicationForm.get('srs').disable();
          this.applicationForm.get('situationMap').disable();
          this.applicationForm.get('treeAutoRefresh').disable();
          this.applicationForm.get('theme').disable();
        }

      },
        error => {

        });
    });

    this.columnDefsParameters = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getEditableColumnDef('applicationEntity.name', 'name'),
      this.utils.getEditableColumnDef('applicationEntity.value', 'value'),
      this.utils.getNonEditableColumnDef('applicationEntity.type', 'type'),
      this.utils.getStatusColumnDef(),

    ];

    this.columnDefsTemplates = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getEditableColumnDef('applicationEntity.name', 'name'),
      this.utils.getEditableColumnDef('applicationEntity.value', 'value'),
      this.utils.getStatusColumnDef(),
    ];

    this.columnDefsRoles = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('applicationEntity.name', 'name'),
      this.utils.getStatusColumnDef(),
    ];

    this.columnDefsBackgrounds = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('applicationEntity.name', 'backgroundName'),
      this.utils.getNonEditableColumnDef('applicationEntity.description', 'description'),
      this.utils.getEditableColumnDef('applicationEntity.order', 'order'),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsTrees = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('applicationEntity.name', 'name'),
      this.utils.getStatusColumnDef(),
    ];

    this.columnDefsParametersDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getNonEditableColumnDef('applicationEntity.name', 'name'),
      this.utils.getNonEditableColumnDef('applicationEntity.value', 'value'),
      this.utils.getNonEditableColumnDef('applicationEntity.type', 'type'),
    ];

    this.columnDefsTemplateConfigurationDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getNonEditableColumnDef('applicationEntity.name', 'name'),
      this.utils.getNonEditableColumnDef('applicationEntity.value', 'value'),
    ];

    this.columnDefsRolesDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('applicationEntity.name', 'name'),
      this.utils.getEditableColumnDef('applicationEntity.note', 'description'),
    ];

    this.columnDefsBackgroundDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('applicationEntity.name', 'name'),
    ];


    this.columnDefsTreeDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('applicationEntity.name', 'name'),
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

    if (value === 'E') {
      this.applicationForm.get('title').disable();
      this.applicationForm.get('scales').disable();
      this.applicationForm.get('srs').disable();
      this.applicationForm.get('situationMap').disable();
      this.applicationForm.get('treeAutoRefresh').disable();
      this.applicationForm.get('theme').disable();
    } else {
      this.applicationForm.get('title').enable();
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
      title: new FormControl(null),
      jspTemplate: new FormControl(null,[Validators.required]),
      theme: new FormControl(null),

      situationMap: new FormControl(null, []),
      scales: new FormControl(null),
      srs: new FormControl(null),
      treeAutoRefresh: new FormControl(null),
      _links: new FormControl(null, []),

    });

  }

  initializeParameterForm(): void {
    this.parameterForm = new FormGroup({
      name: new FormControl(null),
      type: new FormControl(null),
      value: new FormControl(null),

    })
  }

  async onNameTranslationButtonClicked() {
    let dialogResult = null
    dialogResult = await this.utils.openTranslationDialog(this.nameTranslationMap);
    if (dialogResult && dialogResult.event == "Accept") {
      this.nameTranslationsModified = true;
    }
  }

  async onTitleTranslationButtonClicked() {
    let dialogResult = null
    dialogResult = await this.utils.openTranslationDialog(this.titleTranslationMap);
    if (dialogResult && dialogResult.event == "Accept") {
      this.titleTranslationsModified = true;
    }
  }



  // AG-GRID


  // ******** Parameters configuration ******** //

  getAllParameters = (): Observable<any> => {

    if (this.applicationID == -1 && this.duplicateID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.applicationToEdit._links.parameters.href}`
    if (this.applicationToEdit._links.parameters.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data[`_embedded`][`application-parameters`].filter(elem => elem.type != config.applicationTemplateIdentificator)
      ));
  }

  getAllRowsParameters(event) {
    if (event.event == "save") {
      this.saveParameters(event.data);
    }
  }


  saveParameters(data: any[]) {
    let parameterToSave = [];
    let parameterToDelete = [];
    const promises: Promise<any>[] = [];
    data.forEach(parameter => {
      if (parameter.status === 'pendingCreation' || parameter.status === 'pendingModify') {
        parameter.application = this.applicationToEdit
      } //If is new, you need the application link
      if (parameter.status === 'pendingCreation' || parameter.newItem) {
        parameter._links = null;
        parameter.id = null;
      }
      // parameterToSave.push(parameter)
      promises.push(new Promise((resolve, reject) => { this.applicationParameterService.save(parameter).subscribe((resp) => { resolve(true) }) }));


      if (parameter.status === 'pendingDelete' && parameter._links && !parameter.newItem) {
        // parameterToDelete.push(parameter) 
        promises.push(new Promise((resolve, reject) => { this.applicationParameterService.remove(parameter).subscribe((resp) => { resolve(true) }) }));

      }
    });

    // parameterToSave.forEach(saveElement => {
    //   promises.push(new Promise((resolve, reject) => { this.applicationParameterService.save(saveElement).subscribe((resp) => { resolve(true) }) }));
    // });

    // parameterToDelete.forEach(deletedElement => {
    //   promises.push(new Promise((resolve, reject) => { this.applicationParameterService.remove(deletedElement).subscribe((resp) => { resolve(true) }) }));

    // });

    Promise.all(promises).then(() => {
      this.dataUpdatedEventParameters.next(true);
    });
  }

  duplicateParameters(data) {
    let parametersToDuplicate = this.utils.duplicateParameter(data, 'name');
    this.addElementsEventParameters.next(parametersToDuplicate);
  }

  // ******** Template configuration ******** //

  getAllTemplates = (): Observable<any> => {
    if (this.applicationID == -1 && this.duplicateID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.applicationToEdit._links.parameters.href}`
    if (this.applicationToEdit._links.parameters.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data[`_embedded`][`application-parameters`].filter(elem => elem.type == config.applicationTemplateIdentificator)
      ));
  }

  //To update templates we use getAllRowsParameters!


  duplicateTemplates(data) {
    let templatesToDuplicate = this.utils.duplicateParameter(data, 'name');
    this.addElementsEventTemplateConfiguration.next(templatesToDuplicate);
  }




  // ******** Roles ******** //

  getAllRoles = (): Observable<any> => {
    if (this.applicationID == -1 && this.duplicateID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.applicationToEdit._links.availableRoles.href}`
    if (this.applicationToEdit._links.availableRoles.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data[`_embedded`][`roles`]));
  }

  getAllRowsRoles(event) {
    if (event.event == "save") {
      this.saveRoles(event.data);
    }
  }

  saveRoles(data: any[]) {
    const promises: Promise<any>[] = [];

    let dataChanged = false;
    let rolesModified = [];
    let rolesToPut = [];
    data.forEach(role => {

      if (role.status !== 'pendingDelete') {
        if (role.status === 'pendingModify') {
          promises.push(new Promise((resolve, reject) => { this.roleService.update(role).subscribe((resp) => { resolve(true) }) }));
          if (role.newItem) { dataChanged = true; }
        }
        else if (role.status === 'pendingCreation') {
          dataChanged = true;
        }
        rolesToPut.push(role._links.self.href)
      }
      else { dataChanged = true }

    });

    Promise.all(promises).then(() => {
      if (dataChanged) {
        let url = this.applicationToEdit._links.availableRoles.href.split('{', 1)[0];
        this.utils.updateUriList(url, rolesToPut, this.dataUpdatedEventRoles);
      }
      else { this.dataUpdatedEventRoles.next(true) }
    });

  }

  // ******** Background ******** //

  getAllBackgrounds = (): Observable<any> => {

    if (this.applicationID == -1 && this.duplicateID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.applicationToEdit._links.backgrounds.href}`
    if (this.applicationToEdit._links.backgrounds.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['application-backgrounds']));


  }

  getAllRowsBackgrounds(event) {
    if (event.event == "save") {
      this.saveBackgrounds(event.data);
    }
  }

  saveBackgrounds(data: any[]) {
    let backgroundsToCreate = [];
    let backgroundsToDelete = [];
    const promises: Promise<any>[] = [];
    const promisesBackground: Promise<any>[] = [];
    data.forEach(background => {
      if (background.status === 'pendingCreation' || (background.status === 'pendingModify') && (background.new)) {

        let index = data.findIndex(element => element.backgroundDescription === background.backgroundDescription && element.backgroundName === background.backgroundName && !element.newItem)
        if (index === -1) {
          background.newItem = false;
          background.application = this.applicationToEdit;
          if (background._links) { //Duplicate
            let urlReqBackground = `${background._links.background.href}`
            background.id = null;
            if (background._links.background.href) {
              let url = new URL(urlReqBackground.split("{")[0]);
              url.searchParams.append("projection", "view")
              urlReqBackground = url.toString();
            }
            background._links = null;
            promises.push(new Promise((resolve, reject) => {
              this.http.get(urlReqBackground).subscribe(result => {
                background.background = result;
                this.applicationBackgroundService.save(background).subscribe((resp) => { resolve(true) });
                // backgroundsToCreate.push(background) 
                // resolve(true);
              })
            }))
          }
          else {
            // backgroundsToCreate.push(background) 
            promises.push(new Promise((resolve, reject) => { this.applicationBackgroundService.save(background).subscribe((resp) => { resolve(true) }) }));
          }
        }
      }
      else if (background.status === 'pendingModify') {
        promises.push(new Promise((resolve, reject) => { this.applicationBackgroundService.save(background).subscribe((resp) => { resolve(true) }) }));
      }
      else if (background.status === 'pendingDelete' && !background.newItem) {
        // backgroundsToDelete.push(background) 
        promises.push(new Promise((resolve, reject) => { this.applicationBackgroundService.remove(background).subscribe((resp) => { resolve(true) }) }));

      }
    });


    // backgroundsToCreate.forEach(newElement => {
    //   promises.push(new Promise((resolve, reject) => { this.applicationBackgroundService.save(newElement).subscribe((resp) => { resolve(true) }) }));
    // });

    // backgroundsToDelete.forEach(deletedElement => {
    //   promises.push(new Promise((resolve, reject) => { this.applicationBackgroundService.remove(deletedElement).subscribe((resp) => { resolve(true) }) }));
    // });


    Promise.all(promises).then(() => {
      this.dataUpdatedEventBackground.next(true);
    });







  }




  // ******** Trees ******** //

  getAllTrees = (): Observable<any> => {

    if (this.applicationID == -1 && this.duplicateID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    var urlReq = `${this.applicationToEdit._links.trees.href}`
    if (this.applicationToEdit._links.trees.templated) {
      var url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }

    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['trees']));


  }

  getAllRowsTrees(event) {
    if (event.event == "save") {
      this.saveTrees(event.data);
    }
  }

  saveTrees(data: any[]) {
    let dataChanged = false;
    let treesModified = [];
    let treesToPut = [];
    const promises: Promise<any>[] = [];

    data.forEach(tree => {
      if (tree.status !== 'pendingDelete') {
        if (tree.status === 'pendingModify') {
          // treesModified.push(tree);
          if (tree.newItem) { dataChanged = true; }
          promises.push(new Promise((resolve, reject) => { this.treeService.update(tree).subscribe((resp) => { resolve(true) }) }));
        }
        else if (tree.status === 'pendingCreation') {
          dataChanged = true;
        }
        treesToPut.push(tree._links.self.href)
      }
      else { dataChanged = true }
    });

    console.log(treesModified);

    Promise.all(promises).then(() => {
      if (dataChanged) {
        let url = this.applicationToEdit._links.trees.href.split('{', 1)[0];
        this.utils.updateUriList(url, treesToPut, this.dataUpdatedEventTree)
      }
      else { this.dataUpdatedEventTree.next(true); }
    });

  }


  // ******** Parameters Dialog  ******** //


  openParametersDialog(data: any) {

    this.parameterForm.patchValue({
      type: this.parametersTypes[0].value
    })

    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived = this.newParameterDialog;
    dialogRef.componentInstance.title = this.utils.getTranslate('applicationEntity.configurationParameters');
    dialogRef.componentInstance.form = this.parameterForm;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          let item = this.parameterForm.value;
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
    dialogRef.componentInstance.HTMLReceived = this.newTemplateDialog;
    dialogRef.componentInstance.title = this.utils.getTranslate('applicationEntity.configurationParameters');
    dialogRef.componentInstance.form = this.parameterForm;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          let item = this.parameterForm.value;
          item.type = config.applicationTemplateIdentificator;
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

    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable = [this.getAllRolesDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsRolesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate("applicationEntity.roles");
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.currentData = [data];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
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
    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable = [this.getAllBackgroundDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsBackgroundDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate("applicationEntity.background");
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.currentData = [data];
    dialogRef.componentInstance.fieldRestrictionWithDifferentName = ['backgroundName'];
    dialogRef.componentInstance.addFieldRestriction = ['name'];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          result.data[0].forEach(element => {
            element.id = null;
            element.newItem = true;
          });
          this.addElementsEventBackground.next(this.adaptNewBackgrounds(result.data[0]))
        }
      }

    });

  }


  adaptNewBackgrounds(data: any[]) {
    let newBackgrounds = [];
    data.forEach(background => {
      let newBackground = {
        background: background,
        backgroundDescription: background.description,
        backgroundName: background.name,
        new: true
      }
      newBackgrounds.push(newBackground);
    });
    return newBackgrounds;


  }

  // ******** Tree Dialog  ******** //

  getAllTreeDialog = () => {

    return this.treeService.getAll();
  }

  openTreeDialog(data: any) {
    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable = [this.getAllTreeDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTreeDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate("applicationEntity.tree");
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.currentData = [data];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventTree.next(result.data[0])
        }
      }

    });

  }


  // Save button

  onSaveButtonClicked() {

    if (this.applicationForm.valid) {
      let situationMap = this.situationMapList.find(x => x.id === this.applicationForm.value.situationMap)
      if (situationMap == undefined || situationMap.id == -1) {
        situationMap = null
      }

      if (this.applicationID == -1 && this.duplicateID != -1) {
        this.applicationForm.patchValue({
          _links: null
        })
      }

      var appObj: Application = new Application();

      appObj.name = this.applicationForm.value.name;
      appObj.type = this.applicationForm.value.type;
      appObj.title = this.applicationForm.value.title;
      appObj.jspTemplate = this.applicationForm.value.jspTemplate;
      appObj.theme = this.applicationForm.value.theme;
      appObj.scales = this.applicationForm.value.scales != null ? this.applicationForm.value.scales.toString().split(",") : null;
      appObj.srs = this.applicationForm.value.srs;
      appObj.treeAutoRefresh = this.applicationForm.value.treeAutoRefresh;
      appObj._links = this.applicationForm.value._links;
      appObj.situationMap = situationMap;
      if (this.applicationID == -1) {
        appObj.id = null;
      } else {
        appObj.id = this.applicationForm.value.id;
        appObj.createdDate = this.applicationToEdit.createdDate
      }


      this.applicationService.save(appObj)
        .subscribe(async resp => {
          console.log(resp);
          this.applicationToEdit = resp;
          this.applicationSaved = resp;
          this.applicationID = this.applicationToEdit.id;
          this.applicationForm.patchValue({
            id: resp.id,
            _links: resp._links
          })

          this.utils.saveTranslation(resp.id, this.nameTranslationMap, this.applicationToEdit.name, this.nameTranslationsModified);
          this.nameTranslationsModified = false;
          this.utils.saveTranslation(resp.id, this.titleTranslationMap, this.applicationToEdit.title, this.titleTranslationsModified);
          this.titleTranslationsModified = false;

          this.getAllElementsEventParameters.next("save");
          this.getAllElementsEventTemplateConfiguration.next("save");
          this.getAllElementsEventRoles.next("save");
          this.getAllElementsEventBackground.next("save");
          this.getAllElementsEventTree.next("save");
        },
          error => {
            console.log(error)
          });
    }
    else {
      this.utils.showRequiredFieldsError();
    }


  }


}
