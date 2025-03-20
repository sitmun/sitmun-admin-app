import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ApplicationService, ApplicationParameterService, RoleService,
  CartographyGroupService, TreeService, BackgroundService,
  ApplicationBackgroundService, TranslationService, Translation, Application, CodeList
} from '@app/domain';
import { HalOptions, HalParam } from '@app/core/hal/rest/rest.service';

import {HttpClient} from '@angular/common/http';
import {UtilsService} from '@app/services/utils.service';
import {LoggerService} from '@app/services/logger.service';
import {LogLevel} from '@app/services/log-level.enum';

import {map, catchError} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';
import {config} from '@config';
import {DataGridComponent, DialogFormComponent, DialogGridComponent} from '@app/frontend-gui/src/lib/public_api';
import {MatDialog} from '@angular/material/dialog';
import {constants} from '@environments/constants';
import {MatTabChangeEvent} from '@angular/material/tabs';
import * as UriTemplate from 'uri-templates';


@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent implements OnInit {

  //Translations
  nameTranslationsModified = false;
  descriptionTranslationsModified = false;
  titleTranslationsModified = false;

  nameTranslationMap: Map<string, Translation>;
  descriptionTranslationMap: Map<string, Translation>;
  titleTranslationMap: Map<string, Translation>;

  situationMapList: any[] = [];
  parametersTypes: any[] = [];
  //Dialog
  applicationForm: UntypedFormGroup;
  applicationToEdit: Application;
  applicationSaved: Application;
  applicationID = -1;
  duplicateID = -1;
  dataLoaded = false;
  themeGrid: any = config.agGridTheme;

  //Grids
  columnDefsParameters: any[];
  addElementsEventParameters: Subject<any[]> = new Subject<any[]>();
  dataUpdatedEventParameters: Subject<boolean> = new Subject<boolean>();

  columnDefsTemplates: any[];
  addElementsEventTemplateConfiguration: Subject<any[]> = new Subject<any[]>();
  // dataUpdatedEventTemplateConfiguration: Subject<boolean> = new Subject<boolean>();

  columnDefsRoles: any[];
  addElementsEventRoles: Subject<any[]> = new Subject<any[]>();
  dataUpdatedEventRoles: Subject<boolean> = new Subject<boolean>();

  columnDefsBackgrounds: any[];
  addElementsEventBackground: Subject<any[]> = new Subject<any[]>();
  dataUpdatedEventBackground: Subject<boolean> = new Subject<boolean>();

  columnDefsTrees: any[];
  addElementsEventTree: Subject<any[]> = new Subject<any[]>();
  dataUpdatedEventTree: Subject<boolean> = new Subject<boolean>();

  applicationTypes: any[] = [];

  //Dialogs

  columnDefsParametersDialog: any[];
  public parameterForm: UntypedFormGroup;
  getAllElementsEventParameters: Subject<string> = new Subject<string>();
  @ViewChild('newParameterDialog', {
    static: true
  }) private newParameterDialog: TemplateRef<any>;
  @ViewChild('newTemplateDialog', {
    static: true
  }) private newTemplateDialog: TemplateRef<any>;
  columnDefsTemplateConfigurationDialog: any[];
  getAllElementsEventTemplateConfiguration: Subject<string> = new Subject<string>();

  @ViewChild('treesDataGrid') treesDataGrid: DataGridComponent;

  columnDefsRolesDialog: any[];
  getAllElementsEventRoles: Subject<string> = new Subject<string>();

  columnDefsBackgroundDialog: any[];
  getAllElementsEventBackground: Subject<string> = new Subject<string>();

  columnDefsTreeDialog: any[];
  getAllElementsEventTree: Subject<string> = new Subject<string>();

  currentAppType: string;

  codeValues = constants.codeValue;

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
    private loggerService: LoggerService
  ) {
    this.initializeApplicationForm();
    this.initializeParameterForm();
  }

  ngOnInit(): void {
    this.nameTranslationMap = this.utils.createTranslationsList(config.translationColumns.applicationName);
    this.descriptionTranslationMap = this.utils.createTranslationsList(config.translationColumns.applicationDescription);
    this.titleTranslationMap = this.utils.createTranslationsList(config.translationColumns.applicationTitle);

    const promises: Promise<any>[] = [];

    promises.push(new Promise((resolve, ) => {
      this.utils.getCodeListValues('application.type').subscribe(
        resp => {
          this.applicationTypes.push(...resp);
          this.applicationTypes.sort((a, b) => a.description.localeCompare(b.description));
          resolve(true);
        }
      );
    }));

    promises.push(new Promise((resolve, ) => {
      this.utils.getCodeListValues('applicationParameter.type').pipe(
        map((resp: any) => {
          const newTable: CodeList[] = [];
          resp.forEach((element: CodeList) => {
            if (element.value !== config.applicationTemplateIdentificator) {
              newTable.push(element);
            }
          });
          newTable.sort((a, b) => a.description.localeCompare(b.description));
          return newTable;
        })
      ).subscribe(
        resp => {
          this.parametersTypes.push(...resp);
          resolve(true);
        }
      );
    }));

    const situationMapByDefault = {
      id: -1,
      name: '-------'
    };
    this.situationMapList.push(situationMapByDefault);

    promises.push(new Promise((resolve, ) => {
      this.getSituationMapList().subscribe(
        resp => {
          this.situationMapList.push(...resp);
          this.situationMapList.sort((a, b) => a.name.localeCompare(b.name));
          resolve(true);
        }
      );
    }));

    Promise.all(promises).then(() => {
      this.activatedRoute.params.subscribe(params => {
          this.applicationID = +params.id;
          if (params.idDuplicate) {
            this.duplicateID = +params.idDuplicate;
          }

          if (this.applicationID !== -1 || this.duplicateID != -1) {

            const idToGet = this.applicationID !== -1 ? this.applicationID : this.duplicateID;


            this.applicationService.get(idToGet).subscribe(
              resp => {

                this.applicationToEdit = resp;
                this.currentAppType = this.applicationToEdit.type;
                this.applicationForm.patchValue({
                  type: this.applicationToEdit.type,
                  title: this.applicationToEdit.title,
                  description: this.applicationToEdit.description,
                  jspTemplate: this.applicationToEdit.jspTemplate,
                  accessParentTerritory: this.applicationToEdit.accessParentTerritory,
                  accessChildrenTerritory: this.applicationToEdit.accessChildrenTerritory,
                  theme: this.applicationToEdit.theme,
                  situationMap: this.applicationToEdit.situationMapId ? this.applicationToEdit.situationMapId : this.situationMapList[0].id,
                  srs: this.applicationToEdit.srs,
                  scales: this.applicationToEdit.scales,
                  treeAutoRefresh: this.applicationToEdit.treeAutoRefresh,
                  logo: this.applicationToEdit.logo,
                  _links: this.applicationToEdit._links
                });

                if (this.applicationID !== -1) {
                  this.applicationForm.patchValue({
                    id: this.applicationID,
                    name: this.applicationToEdit.name,
                    passwordSet: this.applicationToEdit.passwordSet,
                  });
                } else {
                  this.applicationForm.patchValue({
                    name: this.utils.getTranslate('copy_').concat(this.applicationToEdit.name),
                  });
                }


                if (this.applicationID != -1) {
                  this.translationService.getAll()
                    .pipe(map((data: any[]) => data.filter(elem => elem.element == this.applicationID)
                    )).subscribe(result => {

                      const nameTranslations = [];
                      const descriptionTranslations = [];
                      const titleTranslations = [];
                      result.forEach(translation => {
                        if (translation.column == config.translationColumns.applicationName) {
                          nameTranslations.push(translation);
                        } else if (translation.column == config.translationColumns.applicationDescription) {
                          descriptionTranslations.push(translation);
                        } else if (translation.column == config.translationColumns.applicationTitle) {
                          titleTranslations.push(translation);
                        }
                      });
                      this.utils.updateTranslations(this.nameTranslationMap, nameTranslations);
                      this.utils.updateTranslations(this.descriptionTranslationMap, descriptionTranslations);
                      this.utils.updateTranslations(this.titleTranslationMap, titleTranslations);
                    }
                  );

                }
                this.dataLoaded = true;
              },
            );
          } else {
            this.dataLoaded = true;
            this.applicationForm.patchValue({
              moveSupramunicipal: false,
              treeAutorefresh: false,
              accessParentTerritory: false,
              accessChildrenTerritory: false,
              type: this.applicationTypes[0].value,
              situationMap: this.situationMapList[0].id
            });
            this.applicationForm.get('title').disable();
            this.applicationForm.get('scales').disable();
            this.applicationForm.get('situationMap').disable();
            this.applicationForm.get('treeAutoRefresh').disable();
            this.applicationForm.get('accessParentTerritory').disable();
            this.applicationForm.get('accessChildrenTerritory').disable();
            this.applicationForm.get('theme').disable();
            this.applicationForm.get('srs').disable();
          }

        },
        );
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
    const params2: HalParam[] = [];
    const param: HalParam = {key: 'type', value: this.codeValues.cartographyPermissionType.locationMap};
    params2.push(param);
    const query: HalOptions = {params: params2};

    return this.cartographyGroupService.getAll(query);
  }


  onSelectionTypeAppChanged({value}) {
    this.currentAppType = value;
    if (value === this.codeValues.applicationType.externalApp) {
      this.applicationForm.get('title').disable();
      this.applicationForm.get('scales').disable();
      this.applicationForm.get('situationMap').disable();
      this.applicationForm.get('treeAutoRefresh').disable();
      this.applicationForm.get('theme').disable();
      this.applicationForm.get('accessParentTerritory').disable();
      this.applicationForm.get('accessChildrenTerritory').disable();
      this.applicationForm.get('srs').disable();
    } else {
      this.applicationForm.get('title').enable();
      this.applicationForm.get('scales').enable();
      this.applicationForm.get('situationMap').enable();
      this.applicationForm.get('treeAutoRefresh').enable();
      this.applicationForm.get('theme').enable();
      this.applicationForm.get('accessParentTerritory').enable();
      this.applicationForm.get('accessChildrenTerritory').enable();
      this.applicationForm.get('srs').enable();
    }
  }

  initializeApplicationForm(): void {

    this.applicationForm = new UntypedFormGroup({
      id: new UntypedFormControl(null, []),
      name: new UntypedFormControl(null, [
        Validators.required,
      ]),
      description: new UntypedFormControl(null),
      type: new UntypedFormControl(null, [
        Validators.required,
      ]),
      title: new UntypedFormControl(null),
      jspTemplate: new UntypedFormControl(null, []),
      theme: new UntypedFormControl(null),

      situationMap: new UntypedFormControl(null, []),
      srs: new UntypedFormControl(null),
      scales: new UntypedFormControl(null),
      treeAutoRefresh: new UntypedFormControl(null),
      app: new UntypedFormControl(null),
      accessParentTerritory: new UntypedFormControl(null),
      accessChildrenTerritory: new UntypedFormControl(null),
      _links: new UntypedFormControl(null, []),
      logo: new UntypedFormControl(null, []),

    });

  }

  initializeParameterForm(): void {
    this.parameterForm = new UntypedFormGroup({
      name: new UntypedFormControl(null),
      type: new UntypedFormControl(null),
      value: new UntypedFormControl(null),

    });
  }

  async onNameTranslationButtonClicked() {
    const dialogResult = await this.utils.openTranslationDialog(this.nameTranslationMap);
    if (dialogResult && dialogResult.event == 'Accept') {
      this.nameTranslationsModified = true;
    }
  }

  async onDescriptionTranslationButtonClicked() {
    const dialogResult = await this.utils.openTranslationDialog(this.descriptionTranslationMap);
    if (dialogResult && dialogResult.event == 'Accept') {
      this.descriptionTranslationsModified = true;
    }
  }

  async onTitleTranslationButtonClicked() {
    const dialogResult = await this.utils.openTranslationDialog(this.titleTranslationMap);
    if (dialogResult && dialogResult.event == 'Accept') {
      this.titleTranslationsModified = true;
    }
  }


  // AG-GRID


  // ******** Parameters configuration ******** //

  getAllParameters = (): Observable<any> => {
    if (this.applicationID == -1 && this.duplicateID == -1) {
      return of([]);
    }

    // Check if the parameters link exists
    if (!this.applicationToEdit._links || !this.applicationToEdit._links.parameters) {
      this.loggerService.error('Parameters link not found in application');
      return of([]);
    }

    // Expand the URI template using uri-templates library
    let resourceLink = this.applicationToEdit._links.parameters.href;
    if (this.applicationToEdit._links.parameters.templated) {
      const template = new UriTemplate(resourceLink);
      resourceLink = template.fill({ projection: 'view' });
    }

    // Use applicationParameterService to get parameters for the application
    // and filter out templates (type != config.applicationTemplateIdentificator)
    return this.applicationParameterService.getByRelationArray(resourceLink)
      .pipe(
        map(parameters => parameters.filter(param => param.type !== config.applicationTemplateIdentificator)),
        catchError(error => {
          this.loggerService.error('Error fetching parameters:', error);
          return of([]);
        })
      );
  };

  getAllRowsParameters(event: { event: string; data: any[]; }) {
    if (event.event == 'save') {
      this.saveParameters(event.data);
    }
  }


  saveParameters(data: any[]) {
    const promises: Promise<any>[] = [];
    // const parameterToSave = [];
    // const parameterToDelete = [];

    data.forEach(parameter => {
      if (parameter.status === 'pendingCreation' || parameter.status === 'pendingModify') {
        parameter.application = this.applicationToEdit;
      } //If is new, you need the application link
      if (parameter.status === 'pendingCreation' || parameter.newItem) {
        parameter._links = null;
        parameter.id = null;
      }
      // parameterToSave.push(parameter)
      promises.push(new Promise((resolve, reject) => {
        this.applicationParameterService.save(parameter).subscribe(
          () => {
            resolve(true);
          },
          (error) => {
            this.loggerService.error('Error saving parameter:', error);
            reject(error);
          }
        );
      }));


      if (parameter.status === 'pendingDelete' && parameter._links && !parameter.newItem) {
        // parameterToDelete.push(parameter)
        promises.push(new Promise((resolve, reject) => {
          this.applicationParameterService.remove(parameter).subscribe(
            () => {
              resolve(true);
            },
            (error) => {
              this.loggerService.error('Error removing parameter:', error);
              reject(error);
            }
          );
        }));
      }
    });

    // parameterToSave.forEach(saveElement => {
    //   promises.push(new Promise((resolve, reject) => { this.applicationParameterService.save(saveElement).subscribe((resp) => { resolve(true) }) }));
    // });

    // parameterToDelete.forEach(deletedElement => {
    //   promises.push(new Promise((resolve, reject) => { this.applicationParameterService.remove(deletedElement).subscribe((resp) => { resolve(true) }) }));

    // });

    Promise.all(promises)
      .then(() => {
        this.dataUpdatedEventParameters.next(true);
      })
      .catch((error) => {
        this.loggerService.error('Error in saveParameters:', error);
      });
  }

  duplicateParameters(data: any) {
    const parametersToDuplicate = this.utils.duplicateParameter(data, 'name');
    this.addElementsEventParameters.next(parametersToDuplicate);
  }

  // ******** Template configuration ******** //

  getAllTemplates = (): Observable<any> => {
    if (this.applicationID == -1 && this.duplicateID == -1) {
      return of([]);
    }

    // Check if the parameters link exists
    if (!this.applicationToEdit._links || !this.applicationToEdit._links.parameters) {
      this.loggerService.error('Parameters link not found in application');
      return of([]);
    }

    // Expand the URI template using uri-templates library
    let resourceLink = this.applicationToEdit._links.parameters.href;
    if (this.applicationToEdit._links.parameters.templated) {
      const template = new UriTemplate(resourceLink);
      resourceLink = template.fill({ projection: 'view' });
    } 

    // Use applicationParameterService to get parameters for the application
    // and filter for templates (type == config.applicationTemplateIdentificator)
    return this.applicationParameterService.getByRelationArray(resourceLink)
      .pipe(
        map(parameters => parameters.filter(param => param.type === config.applicationTemplateIdentificator)),
        catchError(error => {
          this.loggerService.error('Error fetching templates:', error);
          return of([]);
        })
      );
  };

  //To update templates we use getAllRowsParameters!


  duplicateTemplates(data: any) {
    const templatesToDuplicate = this.utils.duplicateParameter(data, 'name');
    this.addElementsEventTemplateConfiguration.next(templatesToDuplicate);
  }


  // ******** Roles ******** //

  getAllRoles = (): Observable<any> => {
    if (this.applicationID == -1 && this.duplicateID == -1) {
      const aux: any[] = [];
      return of(aux);
    }

    // Check if the availableRoles link exists
    if (!this.applicationToEdit._links || !this.applicationToEdit._links.availableRoles) {
      this.loggerService.error('AvailableRoles link not found in application');
      return of([]);
    }

    // Expand the URI template using uri-templates library
    let resourceLink = this.applicationToEdit._links.availableRoles.href;
    if (this.applicationToEdit._links.availableRoles.templated) {
      const template = new UriTemplate(resourceLink);
      resourceLink = template.fill({ projection: 'view' });
    } 

    // Use roleService to get roles for the application
    return this.roleService.getByRelationArray(resourceLink)
      .pipe(
        catchError(error => {
          this.loggerService.error('Error fetching roles:', error);
          return of([]);
        })
      );
  };

  getAllRowsRoles(event: { event: string; data: any[]; }) {
    if (event.event == 'save') {
      this.saveRoles(event.data);
    }
  }

  saveRoles(data: any[]) {
    let dataChanged = false;
    // const rolesModified = [];
    const rolesToPut = [];
    const promises: Promise<any>[] = [];

    data.forEach(role => {
      if (role.status !== 'pendingDelete') {
        if (role.status === 'pendingModify') {
          // rolesModified.push(role);
          if (role._links) {
            promises.push(new Promise((resolve, reject) => {
              this.roleService.save(role).subscribe(
                () => {
                  resolve(true);
                },
                (error) => {
                  this.loggerService.error('Error saving role:', error);
                  reject(error);
                }
              );
            }));
            dataChanged = true;
          }
        } else if (role.status === 'pendingCreation') {
          dataChanged = true;
        }
        rolesToPut.push(role._links.self.href);
      } else {
        dataChanged = true;
      }
    });

    Promise.all(promises)
      .then(() => {
        if (dataChanged) {
          const url = this.applicationToEdit._links.availableRoles.href.split('{', 1)[0];
          try {
            this.utils.updateUriList(url, rolesToPut, this.dataUpdatedEventRoles);
          } catch (error) {
            this.loggerService.error('Error updating URI list for roles:', error);
          }
        } else {
          this.dataUpdatedEventRoles.next(true);
        }
      })
      .catch((error) => {
        this.loggerService.error('Error in saveRoles:', error);
      });
  }

  // ******** Background ******** //

  getAllBackgrounds = (): Observable<any> => {
    if (this.applicationID == -1 && this.duplicateID == -1) {
      const aux: any[] = [];
      return of(aux);
    }

    // Check if the backgrounds link exists
    if (!this.applicationToEdit._links || !this.applicationToEdit._links.backgrounds) {
      this.loggerService.error('Backgrounds link not found in application');
      return of([]);
    }

    // Expand the URI template using uri-templates library
    let resourceLink = this.applicationToEdit._links.backgrounds.href;
    if (this.applicationToEdit._links.backgrounds.templated) {
      const template = new UriTemplate(resourceLink);
      resourceLink = template.fill({ projection: 'view' });
    } 

    // Use applicationBackgroundService to get backgrounds for the application
    return this.applicationBackgroundService.getByRelationArray(resourceLink)
      .pipe(
        catchError(error => {
          this.loggerService.error('Error fetching backgrounds:', error);
          return of([]);
        })
      );
  };

  getAllRowsBackgrounds(event: { event: string; data: any[]; }) {
    if (event.event == 'save') {
      this.saveBackgrounds(event.data);
    }
  }

  saveBackgrounds(data: any[]) {
    const promises: Promise<any>[] = [];
    // const backgroundsToCreate = [];
    // const backgroundsToDelete = [];

    data.forEach(background => {
      if (background.status === 'pendingCreation') {
        if (background.background) {
          if (background.background._links) {
            background.background = background.background._links.self.href;
            promises.push(new Promise((resolve, reject) => {
              this.applicationBackgroundService.save(background).subscribe(
                () => {
                  resolve(true);
                },
                (error) => {
                  this.loggerService.error('Error saving background:', error);
                  reject(error);
                }
              );
            }));
          } else {
            promises.push(new Promise((resolve, reject) => {
              this.backgroundService.save(background.background).subscribe(
                (resp) => {
                  background.background = resp._links.self.href;
                  this.applicationBackgroundService.save(background).subscribe(
                    () => {
                      resolve(true);
                    },
                    (error) => {
                      this.loggerService.error('Error saving application background:', error);
                      reject(error);
                    }
                  );
                },
                (error) => {
                  this.loggerService.error('Error saving background:', error);
                  reject(error);
                }
              );
            }));
          }
        }
      } else if (background.status === 'pendingModify') {
        promises.push(new Promise((resolve, reject) => {
          this.applicationBackgroundService.save(background).subscribe(
            () => {
              resolve(true);
            },
            (error) => {
              this.loggerService.error('Error updating background:', error);
              reject(error);
            }
          );
        }));
      } else if (background.status === 'pendingDelete' && !background.newItem) {
        promises.push(new Promise((resolve, reject) => {
          this.applicationBackgroundService.remove(background).subscribe(
            () => {
              resolve(true);
            },
            (error) => {
              this.loggerService.error('Error removing background:', error);
              reject(error);
            }
          );
        }));
      }
    });

    Promise.all(promises)
      .then(() => {
        this.dataUpdatedEventBackground.next(true);
      })
      .catch((error) => {
        this.loggerService.error('Error in saveBackgrounds:', error);
      });
  }


  // ******** Trees ******** //

  getAllTrees = (): Observable<any> => {
    if (this.applicationID == -1 && this.duplicateID == -1) {
      const aux: any[] = [];
      return of(aux);
    }

    // Check if the trees link exists
    if (!this.applicationToEdit._links || !this.applicationToEdit._links.trees) {
      this.loggerService.error('Trees link not found in application');
      return of([]);
    }

    // Expand the URI template using uri-templates library
    let resourceLink = this.applicationToEdit._links.trees.href;
    if (this.applicationToEdit._links.trees.templated) {
      const template = new UriTemplate(resourceLink);
      resourceLink = template.fill({ projection: 'view' });
    } 
    
    // Use treeService to get trees for the application
    return this.treeService.getByRelationArray(resourceLink)
      .pipe(
        catchError(error => {
          this.loggerService.error('Error fetching trees:', error);
          return of([]);
        })
      );
  };

  getAllRowsTrees(event: { event: string; data: any[]; }) {
    if (event.event == 'save') {
      this.saveTrees(event.data);
    }
  }

  saveTrees(data: any[]) {
    let dataChanged = false;
    // const treesModified = [];
    const treesToPut = [];
    const promises: Promise<any>[] = [];

    data.forEach(tree => {
      if (tree.status !== 'pendingDelete') {
        if (tree.status === 'pendingModify') {
          // treesModified.push(tree);
          if (tree.newItem) {
            dataChanged = true;
          }
          promises.push(new Promise((resolve, ) => {
            this.treeService.update(tree).subscribe(() => {
              resolve(true);
            });
          }));
        } else if (tree.status === 'pendingCreation') {
          dataChanged = true;
        }
        treesToPut.push(tree._links.self.href);
      } else {
        dataChanged = true;
      }
    });


    Promise.all(promises).then(() => {
      if (dataChanged) {
        const url = this.applicationToEdit._links.trees.href.split('{', 1)[0];
        this.utils.updateUriList(url, treesToPut, this.dataUpdatedEventTree);
      } else {
        this.dataUpdatedEventTree.next(true);
      }
    });

  }


  // ******** Parameters Dialog  ******** //


  openParametersDialog() {

    this.parameterForm.patchValue({
      type: this.parametersTypes[0].value
    });

    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived = this.newParameterDialog;
    dialogRef.componentInstance.title = this.utils.getTranslate('applicationEntity.configurationParameters');
    dialogRef.componentInstance.form = this.parameterForm;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          const item = this.parameterForm.value;
          this.addElementsEventParameters.next([item]);


        }
      }
      this.parameterForm.reset();

    });

  }

  // ******** TemplatesConfiguration Dialog  ******** //

  // getAllTemplatesConfigurationDialog = () => {
  //   const aux: any[] = [];
  //  return of(aux);
  //  // return this.cartographyService.getAll();
  //};

  openTemplateConfigurationDialog() {
    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived = this.newTemplateDialog;
    dialogRef.componentInstance.title = this.utils.getTranslate('applicationEntity.configurationParameters');
    dialogRef.componentInstance.form = this.parameterForm;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          const item = this.parameterForm.value;
          item.type = config.applicationTemplateIdentificator;
          this.addElementsEventTemplateConfiguration.next([item]);
        }

      }
      this.parameterForm.reset();
    });

  }

  // ******** Roles Dialog  ******** //

  getAllRolesDialog = () => {
    return this.roleService.getAll();
  };


  openRolesDialog(data: any) {

    const dialogRef = this.dialog.open(DialogGridComponent, {panelClass: 'gridDialogs'});
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable = [this.getAllRolesDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsRolesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('applicationEntity.roles');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.currentData = [data];
    dialogRef.componentInstance.nonEditable = false;


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventRoles.next(result.data[0]);
        }
      }

    });

  }

  // ******** Background Dialog  ******** //

  getAllBackgroundDialog = () => {
    return this.backgroundService.getAll();
  };

  openBackgroundDialog(data: any) {
    const dialogRef = this.dialog.open(DialogGridComponent, {panelClass: 'gridDialogs'});
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable = [this.getAllBackgroundDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsBackgroundDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('applicationEntity.background');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.currentData = [data];
    dialogRef.componentInstance.fieldRestrictionWithDifferentName = ['backgroundName'];
    dialogRef.componentInstance.addFieldRestriction = ['name'];
    dialogRef.componentInstance.nonEditable = false;


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          result.data[0].forEach((element: { id: null; newItem: boolean; }) => {
            element.id = null;
            element.newItem = true;
          });
          this.addElementsEventBackground.next(this.adaptNewBackgrounds(result.data[0]));
        }
      }

    });

  }


  adaptNewBackgrounds(data: any[]) {
    const newBackgrounds = [];
    data.forEach(background => {
      const newBackground = {
        background: background,
        backgroundDescription: background.description,
        backgroundName: background.name,
        new: true
      };
      newBackgrounds.push(newBackground);
    });
    return newBackgrounds;


  }

  // ******** Tree Dialog  ******** //

  getAllTreeDialog = () => {

    return this.treeService.getAll();
  };

  openTreeDialog(data: any) {
    const dialogRef = this.dialog.open(DialogGridComponent, {panelClass: 'gridDialogs'});
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable = [this.getAllTreeDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsTreeDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('applicationEntity.tree');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.currentData = [data];
    dialogRef.componentInstance.nonEditable = false;


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventTree.next(result.data[0]);
        }
      }

    });

  }


  // Save button

  onSaveButtonClicked() {
    if (this.appValidations()) {
      this.saveApp();
    }
  }

  saveApp() {
    let situationMap = this.situationMapList.find(x => x.id === this.applicationForm.value.situationMap);
    if (situationMap == undefined || situationMap.id == -1) {
      situationMap = null;
    }

    if (this.applicationID == -1 && this.duplicateID != -1) {
      this.applicationForm.patchValue({
        _links: null
      });
    }

    const appObj: Application = new Application();

    appObj.name = this.applicationForm.value.name;
    appObj.description = this.applicationForm.value.description;
    appObj.type = this.applicationForm.value.type;
    appObj.title = this.applicationForm.value.title;
    appObj.jspTemplate = this.applicationForm.value.jspTemplate;
    appObj.accessParentTerritory = this.applicationForm.value.accessParentTerritory;
    appObj.accessChildrenTerritory = this.applicationForm.value.accessChildrenTerritory;
    appObj.logo = this.applicationForm.value.logo;
    appObj.theme = this.applicationForm.value.theme;
    appObj.scales = this.applicationForm.value.scales != null ? this.applicationForm.value.scales.toString().split(',') : null;
    appObj.treeAutoRefresh = this.applicationForm.value.treeAutoRefresh;
    appObj._links = this.applicationForm.value._links;
    appObj.srs = this.applicationForm.value.srs;
    appObj.situationMap = situationMap;
    if (this.applicationID == -1) {
      appObj.id = null;
    } else {
      appObj.id = this.applicationForm.value.id;
      appObj.createdDate = this.applicationToEdit.createdDate;
    }


    this.applicationService.save(appObj)
      .subscribe(async resp => {

          this.applicationToEdit = resp;
          this.applicationSaved = resp;
          this.applicationID = this.applicationToEdit.id;
          this.applicationForm.patchValue({
            id: resp.id,
            _links: resp._links
          });

          await this.utils.saveTranslation(resp.id, this.nameTranslationMap, this.applicationToEdit.name, this.nameTranslationsModified);
          this.nameTranslationsModified = false;
          await this.utils.saveTranslation(resp.id, this.descriptionTranslationMap, this.applicationToEdit.description, this.descriptionTranslationsModified);
          this.descriptionTranslationsModified = false;
          await this.utils.saveTranslation(resp.id, this.titleTranslationMap, this.applicationToEdit.title, this.titleTranslationsModified);
          this.titleTranslationsModified = false;

          this.getAllElementsEventParameters.next('save');
          this.getAllElementsEventTemplateConfiguration.next('save');
          this.getAllElementsEventRoles.next('save');
          this.getAllElementsEventBackground.next('save');
          this.getAllElementsEventTree.next('save');
        },
        error => {
          this.loggerService.error(error);
        });
  }

  appValidations() {
    let valid = true;
    const trees = this.treesDataGrid?.rowData;
    const filterTrees = trees?.filter(a => a.status !== 'pendingDelete') ?? [];
    const validations = [{
      fn: this.validForm,
      param: null,
      msg: this.utils.showRequiredFieldsError
    }, {
      fn: this.validTuristicAppTrees,
      param: filterTrees,
      msg: this.utils.showTuristicAppTreeError
    }, {
      fn: this.validNoTuristicAppTrees,
      param: filterTrees,
      msg: this.utils.showNoTuristicAppTreeError
    }];
    const error = validations.find(v => !v.fn.bind(this)(v.param));
    if (error) {
      valid = false;
      error.msg.bind(this.utils)();
    }
    return valid;
  }

  validForm() {
    return this.applicationForm.valid;
  }

  validTuristicAppTrees(trees: string | any[]) {
    let valid = true;
    if (this.currentAppType === constants.codeValue.applicationType.turisticApp) {
      valid = trees.length == 0 || (trees.length == 1 && trees[0].type === constants.codeValue.treeType.turisticTree);
    }
    return valid;
  }

  validNoTuristicAppTrees(trees: any[]) {
    let valid = true;
    if (this.currentAppType !== constants.codeValue.applicationType.turisticApp) {
      valid = !trees.some(a => a.type === constants.codeValue.treeType.turisticTree);
    }
    return valid;
  }

  activeTabIndex = 0;

  onTabChange(event: MatTabChangeEvent) {
    this.activeTabIndex = event.index;
  }
}
