import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {
  ApplicationService,
  CapabilitiesService,
  CartographyService,
  RoleService,
  ServiceService,
  TaskService,
  Translation,
  TranslationService,
  Tree,
  TreeNode,
  TreeNodeService,
  TreeService
} from '@app/domain';
import {HttpClient} from '@angular/common/http';
import {UtilsService} from '@app/services/utils.service';
import {map} from 'rxjs/operators';
import {config} from '@config';
import {Observable, of, Subject} from 'rxjs';
import {
  DataGridComponent,
  DataTreeComponent,
  DialogFormComponent,
  DialogGridComponent,
  DialogMessageComponent
} from '@app/frontend-gui/src/lib/public_api';
import {MatDialog} from '@angular/material/dialog';
import {constants} from '@environments/constants';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {LoggerService} from '@app/services/logger.service';
import {Configuration} from "@app/core/config/configuration";
import {XMLParser} from 'fast-xml-parser';

@Component({
  selector: 'app-trees-form',
  templateUrl: './trees-form.component.html',
  styleUrls: ['./trees-form.component.scss']
})
export class TreesFormComponent implements OnInit {
  readonly config = Configuration.TREE;

  loadDataButton$ = of(true);

  //Translations
  nameTranslationsModified = false;

  descriptionTranslationsModified = false;
  nameTranslations: Map<number, Map<string, Translation>> = new Map<number, Map<string, Translation>>();
  descriptionTranslations: Map<number, Map<string, Translation>> = new Map<number, Map<string, Translation>>();

  treeNameTranslationMap: Map<string, Translation>;
  treeDescriptionTranslationMap: Map<string, Translation>;

  columnDefsApplication: any[];
  addElementsEventApplication: Subject<any[]> = new Subject<any[]>();
  dataUpdatedEventApplication: Subject<boolean> = new Subject<boolean>();

  columnDefsApplicationDialog: any[];

  getAllElementsEventApplication: Subject<"save"> = new Subject<"save">();

  themeGrid: any = config.agGridTheme;

  treeID = -1;
  duplicateID = -1;
  treeForm: UntypedFormGroup;
  treeNodeForm: UntypedFormGroup;
  public fieldsConfigForm: UntypedFormGroup;
  idFictitiousCounter = -1;
  treeToEdit: Tree;

  dataLoaded = false;

  currentNodeIsFolder: boolean;
  currentNodeName: string;
  currentNodeDescription: string;
  currentNodeType: string;
  currentTreeType: string;

  currentNodeHasParent: boolean;
  currentViewMode: string;
  currentNodeTask: any;
  currentNodeCartography: any;

  fieldsConfigTreeGenerated = false;
  selectedXPath: string;

  newElement = false;
  duplicateToDo = false;
  sendNodeUpdated: Subject<any> = new Subject<any>();
  getAllElementsNodes: Subject<string> = new Subject<string>();
  refreshTreeEvent: Subject<boolean> = new Subject<boolean>();
  refreshFieldConfigTreeEvent: Subject<boolean> = new Subject<boolean>();
  createNodeEvent: Subject<boolean> = new Subject<boolean>();
  createConfigTreeEvent: Subject<boolean> = new Subject<boolean>();
  getAllElementsEventCartographies: Subject<boolean> = new Subject<boolean>();
  getAllElementsEventTasks: Subject<boolean> = new Subject<boolean>();
  columnDefsCartographies: any[];
  columnDefsTasks: any[];
  columnDefsServices: any[];
  @ViewChild(DataTreeComponent) dataTree: DataTreeComponent;
  @ViewChild('applicationsDataGrid') appDataGrid: DataGridComponent;
  @ViewChild('fieldsConfigDialog', {
      static: true
    }) private fieldsConfigDialog: TemplateRef<any>;

  filterOptions = [{value:'UNDEFINED', description: 'UNDEFINED'}, {value:true, description: 'YES'},{value:false, description: 'NO'}]
  defaultLabel = 'Extra info'
  codeValues = constants.codeValue;
  servicesList = [];
  layersList = [];
  treetypesList = [];
  folderNodeTypesList = [];
  leafNodeTypesList = [];
  nodeInputsControls = [];
  nodeNamespacesControls = [];
  noNamespaces = true;
  parsedData = {
    data: {},
    dataType: 'json'
  };
  nodeOutputsControls = constants.nodeMapping.nodeOutputControls;
  taskviewsList = [];
  mappingAppOptions = constants.nodeMapping.appOptions;
  mappingbtnLabelOptions = constants.nodeMapping.btnlabelOptions;
  mappingParentTaskOptions = [];
  namespaces = [];
  // Roles grid
  columnDefsRoles: any[];

  getAllElementsEventRoles: Subject<"save"> = new Subject<"save">();
  dataUpdatedEventRoles: Subject<boolean> = new Subject<boolean>();
  addElementsEventRoles: Subject<any[]> = new Subject<any[]>();
  columnDefsRolesDialog: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private treeService: TreeService,
    private treeNodeService: TreeNodeService,
    private translationService: TranslationService,
    private cartographyService: CartographyService,
    private taskService: TaskService,
    private http: HttpClient,
    public utils: UtilsService,
    public dialog: MatDialog,
    public serviceService: ServiceService,
    public capabilitiesService: CapabilitiesService,
    public applicationService: ApplicationService,
    private loggerService: LoggerService,
    private roleService: RoleService
  ) {

    this.initializeTreesForm();
    this.initializeTreesNodeForm();
    this.initializeFieldsConfigForm();
  }



  async ngOnInit() {

    this.getAllTreeTypes().then((resp) => {
      this.treetypesList.push(...resp);
    });

    this.getFolderNodeTypes().then((resp) => {
      this.folderNodeTypesList.push(...resp);
    });

    this.getLeafNodeTypes().then((resp) => {
      this.leafNodeTypesList.push(...resp);
    });

    this.getTaskViewModes().then((resp) => {
      this.taskviewsList.push(...resp)
    });

    this.layersList = await this.getAllCartographies().toPromise();


    this.columnDefsServices = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('serviceEntity.name', 'name'),
      this.utils.getNonEditableColumnDef('serviceEntity.type', 'type'),
      this.utils.getEditableColumnDef('serviceEntity.serviceURL', 'serviceURL'),
      this.utils.getEditableColumnDef('serviceEntity.supportedSRS', 'supportedSRS'),
      this.utils.getDateColumnDef('serviceEntity.createdDate', 'createdDate')
    ];

    this.columnDefsApplication = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('treesEntity.name', 'name'),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsApplicationDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('layersPermitsEntity.name', 'name'),
    ];

    this.treeNameTranslationMap = this.utils.createTranslationsList(config.translationColumns.treeName);
    this.treeDescriptionTranslationMap = this.utils.createTranslationsList(config.translationColumns.treeDescription);

    this.activatedRoute.params.subscribe(params => {
      this.treeID = +params.id;
      if (params.idDuplicate) { this.duplicateID = +params.idDuplicate; }

      if (this.treeID !== -1 || this.duplicateID != -1) {
        const idToGet = this.treeID !== -1 ? this.treeID : this.duplicateID

        this.treeService.get(idToGet).subscribe(
          resp => {
            this.treeToEdit = resp;
            this.treeForm.patchValue({
              description: this.treeToEdit.description,
              type: this.treeToEdit.type,
              image: this.treeToEdit.image,
              imageName: this.treeToEdit.imageName,
              _links: this.treeToEdit._links
            });
            this.currentTreeType = this.treeToEdit.type;
            this.showImgPreview('tree', this.treeToEdit.image);
            if (this.treeID !== -1) {
              this.treeForm.patchValue({
                id: this.treeID,
                name: this.treeToEdit.name,
              });
            }
            else {
              this.treeForm.patchValue({
                name: this.utils.getTranslate('copy_').concat(this.treeToEdit.name),
              });
              this.duplicateToDo = true;
            }

            if (this.treeID != -1) {
              this.translationService.getAll()
                .pipe(map((data: any[]) => data.filter(elem => elem.element == this.treeID || elem.column == config.translationColumns.treeNodeName ||
                  elem.column == config.translationColumns.treeNodeDescription)
                )).subscribe(result => {
                const treeNameTranslations = [];
                const treeDescriptionTranslations = [];
                  result.forEach(translation => {
                    if (translation.column == config.translationColumns.treeName) {
                      treeNameTranslations.push(translation)
                    }
                    else if (translation.column == config.translationColumns.treeDescription) {
                      treeDescriptionTranslations.push(translation)
                    }
                    else if (translation.column == config.translationColumns.treeNodeDescription || translation.column == config.translationColumns.treeNodeName) {
                      this.saveTreeNodeTranslation(translation, translation.column);
                    }

                  });
                  this.utils.updateTranslations(this.treeNameTranslationMap, treeNameTranslations)
                  this.utils.updateTranslations(this.treeDescriptionTranslationMap, treeDescriptionTranslations)
                });
            }


            this.dataLoaded = true;
          },
          error => {

          }
        );
      } else {
        this.dataLoaded = true;
      }
    });


    this.columnDefsCartographies = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('treesEntity.name', 'name'),
      this.utils.getNonEditableColumnDef('treesEntity.serviceName', 'serviceName'),
      this.utils.getNonEditableColumnDef('treesEntity.styles', 'stylesNames')
    ];

    this.columnDefsTasks = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('treesEntity.name', 'name'),
      this.utils.getNonEditableColumnDef('treesEntity.groupTask', 'groupName'),
      this.utils.getNonEditableColumnDef('treesEntity.typeName', 'typeName'),
      this.utils.getStatusColumnDef()
    ];

    // Initialize roles grid columns
    this.columnDefsRoles = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('roleEntity.name', 'name'),
      this.utils.getStatusColumnDef()
    ];

    this.columnDefsRolesDialog = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('roleEntity.name', 'name'),
    ];
  }

  saveTreeNodeTranslation(translation, column) {
    if (translation.column == config.translationColumns.treeNodeName) {
      this.storeTranslationInMap(translation, this.nameTranslations, column)
    }
    else if (translation.column == config.translationColumns.treeNodeDescription) {
      this.storeTranslationInMap(translation, this.descriptionTranslations, column)
    }
  }

  async loadGroupLayersButtonClicked(data) {


    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable = [this.getAllServices];
    dialogRef.componentInstance.singleSelectionTable = [true];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsServices];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('treesEntity.services');
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.nonEditable = false;


    let url, service;


    const dialogResult = await dialogRef.afterClosed().toPromise()
    if (dialogResult) {
      if (dialogResult.event === 'Add' && dialogResult.data && dialogResult.data[0].length > 0) {
        service = dialogResult.data[0][0];
        url = service.serviceURL;
        if (url) {
          if (!url.includes(config.capabilitiesRequest.simpleRequest)) {
            if (url[url.length - 1] != '?') { url += "?" }

            url += config.capabilitiesRequest.requestWithWMS
          }

          const capabilitiesResult = await this.capabilitiesService.getInfo(url).toPromise();
          if (capabilitiesResult.success) {
            const groupLayersResult = this.changeServiceDataByCapabilities(capabilitiesResult.asJson)
            this.createNodesWithCapabilities(groupLayersResult, data, null)
          }
        }
      }
    }
  }

  changeServiceDataByCapabilities(serviceCapabilitiesData, refresh?): Array<any> {
    const capabilitiesLayers = [];
    const data = serviceCapabilitiesData.WMT_MS_Capabilities != undefined ? serviceCapabilitiesData.WMT_MS_Capabilities : serviceCapabilitiesData.WMS_Capabilities
    if (data != undefined) {
      let capability = data.Capability.Layer;
      while (capability.Layer != null && capability.Layer != undefined) {
        capability = capability.Layer;
      }
      capabilitiesLayers.push(...capability);

    }

    return capabilitiesLayers;

  }

  getAllServices = (): Observable<any> => {
    return this.serviceService.getAll().pipe(
      map((resp) => {
        const wmsServices = [];
        resp.forEach(service => {
          if (service.type === 'WMS') {
            wmsServices.push(service)
          }
        });
        return wmsServices;
      })
    );
  }

  getAllTreeNodes = (): Observable<any> => {
    if (this.treeID == -1 && this.duplicateID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    } else {
      let urlReq = `${this.treeForm.value._links.allNodes.href}`
      if (this.treeForm.value._links.allNodes.templated) {
        const url = new URL(urlReq.split("{")[0]);
        url.searchParams.append("projection", "view")
        urlReq = url.toString();
      }
      const response = (this.http.get(urlReq)).pipe(map(data => data['_embedded']['tree-nodes']))
      return response;
    }
  }

  nodeReceived(emitedObj) {
    const node = emitedObj.nodeClicked;
    const nodeParent = emitedObj.nodeParent;
    this.newElement = false;
    let currentType;
    if (node.isFolder) {
      this.currentNodeIsFolder = true;
      currentType = 'folder'
    } else {
      this.currentNodeIsFolder = false;
      currentType = 'node'
    }
    this.currentNodeType = nodeParent &&
    ![this.codeValues.treenodeFolderType.nearme, this.codeValues.treenodeFolderType.map].includes(nodeParent.nodeType)
      ? nodeParent.nodeType : node.nodeType;
    this.mappingParentTaskOptions = this.createMappingParentTaskOptions(nodeParent);
    this.currentViewMode = node.viewMode;
    this.currentNodeHasParent = nodeParent !== null;
    let status = "Modified"
    const nameTranslationsModified = node.nameTranslationsModified ? true : false;
    const descriptionTranslationsModified = node.descriptionTranslationsModified ? true : false;
    const nameFormModified = node.nameFormModified ? true : false;
    const descriptionFormModified = node.descriptionFormModified ? true : false;
    if (node.id < 0) {
      status = "pendingCreation"
    }
    this.treeNodeForm.patchValue({
      id: node.id,
      name: node.name,
      tooltip: node.tooltip,
      nodeType: node.nodeType,
      image: node.image,
      imageName: node.imageName,
      task: node.task,
      taskName: node.taskName,
      taskId: node.taskId,
      oldTask: node.task,
      viewMode: node.viewMode,
      filterable: node.filterable,
      order: node.order,
      cartography: node.cartographyName,
      cartographyName: node.cartographyName,
      cartographyId: node.cartographyId,
      // cartographyStyles: node.cartographyStyles,
      oldCartography: node.cartography,
      radio: node.radio,
      description: node.description,
      datasetURL: node.datasetURL,
      metadataURL: node.metadataURL,
      active: node.active,
      _links: node._links,
      children: node.children,
      parent: node.parent,
      isFolder: node.isFolder,
      nameTranslationsModified: nameTranslationsModified,
      descriptionTranslationsModified: descriptionTranslationsModified,
      nameFormModified: nameFormModified,
      descriptionFormModified: descriptionFormModified,
      nameTranslations: node.nameTranslations,
      descriptionTranslations: node.descriptionTranslations,
      filterGetFeatureInfo: (node.filterGetFeatureInfo == null || node.filterGetFeatureInfo == undefined) ? "UNDEFINED" : node.filterGetFeatureInfo,
      filterGetMap: (node.filterGetMap == null || node.filterGetMap == undefined) ? "UNDEFINED" : node.filterGetMap,
      filterSelectable: (node.filterSelectable == null || node.filterSelectable == undefined) ? "UNDEFINED" : node.filterSelectable,
      style: node.style,
      status: status,
      type: currentType,
      mapping: node.mapping
    });
    setTimeout(() => {
      this.showImgPreview('node', node.image);
    });
    if (this.nameTranslations.has(node.id)) {
      const translations = this.nameTranslations.get(node.id);
      this.treeNodeForm.patchValue({
        nameTranslations: translations
      })
    }

    if (this.descriptionTranslations.has(node.id)) {
      const translations = this.descriptionTranslations.get(node.id);
      this.treeNodeForm.patchValue({
        descriptionTranslations: translations
      })
    }

  }

  saveAll(data: TreeNode[]) {

    if (this.treeID == -1 && this.duplicateID != -1) {
      this.treeForm.patchValue({
        _links: null
      })
    }


    this.treeService.save(this.treeForm.value)
      .subscribe(async resp => {
          this.treeToEdit = resp;
          this.treeID = resp.id;

          this.treeForm.patchValue({
            _links: resp._links,
            id: resp.id
          })

          this.utils.saveTranslation(resp.id, this.treeNameTranslationMap, this.treeToEdit.name, this.nameTranslationsModified);
          this.nameTranslationsModified = false;
          this.utils.saveTranslation(resp.id, this.treeDescriptionTranslationMap, this.treeToEdit.description, this.descriptionTranslationsModified);
          this.descriptionTranslationsModified = false;

          const mapNewIdentificators: Map<number, any[]> = new Map<number, any[]>();
          const promises: Promise<any>[] = [];
          this.getAllElementsEventApplication.next('save');
          this.getAllElementsEventRoles.next('save');
          this.updateAllTrees(data, 0, mapNewIdentificators, promises, null, null);
          this.refreshTreeEvent.next(true)
        },
        error => {
          this.loggerService.error('Error saving tree', error);
        });

  }


  initializeTreesForm(): void {
    this.treeForm = new UntypedFormGroup({
      id: new UntypedFormControl(null, []),
      name: new UntypedFormControl(null, [Validators.required]),
      description: new UntypedFormControl(null, []),
      type: new UntypedFormControl(null, []),
      image: new UntypedFormControl(null, []),
      imageName: new UntypedFormControl(null, []),
      _links: new UntypedFormControl(null, [])
    })
  }

  initializeTreesNodeForm(): void {
    this.treeNodeForm = new UntypedFormGroup({
      id: new UntypedFormControl(null, []),
      name: new UntypedFormControl(null, [Validators.required]),
      tooltip: new UntypedFormControl(null, []),
      nodeType: new UntypedFormControl(null, []),
      cartography: new UntypedFormControl(null, []),
      radio: new UntypedFormControl(null, []),
      datasetURL: new UntypedFormControl(null, []),
      metadataURL: new UntypedFormControl(null, []),
      description: new UntypedFormControl(null, []),
      image: new UntypedFormControl(null, []),
      imageName: new UntypedFormControl(null, []),
      task: new UntypedFormControl(null, []),
      viewMode: new UntypedFormControl(null, []),
      filterable: new UntypedFormControl(null, []),
      active: new UntypedFormControl(true, []),
      _links: new UntypedFormControl(null, []),
      children: new UntypedFormControl(null, []),
      parent: new UntypedFormControl(null, []),
      isFolder: new UntypedFormControl(null, []),
      type: new UntypedFormControl(null, []),
      order: new UntypedFormControl(null, []),
      filterGetFeatureInfo: new UntypedFormControl("UNDEFINED", []),
      filterGetMap: new UntypedFormControl("UNDEFINED", []),
      filterSelectable: new UntypedFormControl("UNDEFINED", []),
      nameTranslations: new UntypedFormControl(null, []),
      descriptionTranslations: new UntypedFormControl(null, []),
      nameTranslationsModified: new UntypedFormControl(null, []),
      descriptionTranslationsModified: new UntypedFormControl(null, []),
      nameFormModified: new UntypedFormControl(null, []),
      descriptionFormModified: new UntypedFormControl(null, []),
      status: new UntypedFormControl(null, []),
      cartographyName: new UntypedFormControl(null, []),
      cartographyId: new UntypedFormControl(null, []),
      cartographyStyles: new UntypedFormControl(null, []),
      oldCartography: new UntypedFormControl(null, []),
      taskName: new UntypedFormControl(null, []),
      taskId: new UntypedFormControl(null, []),
      oldTask: new UntypedFormControl(null, []),
      style: new UntypedFormControl(null, []),
      mapping: new UntypedFormControl(null, []),

    })
  }

  initializeFieldsConfigForm() {
    const outputGroup = {};
    this.nodeOutputsControls.forEach(f => {
      // inputs boton labels deben ser calculated = true y valor por defecto
      let booleanCalculated = false;
      let defaultValue = null;
      f.key.includes('Label') ? booleanCalculated = true : booleanCalculated = false;
      f.key.includes('Label') ? defaultValue = 'Extra info' : defaultValue = null;
      outputGroup[f.key] = new UntypedFormGroup({
        value: new UntypedFormControl(defaultValue, []),
        calculated: new UntypedFormControl(booleanCalculated, [])
      });
    });
    this.fieldsConfigForm = new UntypedFormGroup({
      taskResponse: new UntypedFormControl(null, []),
      viewMode: new UntypedFormControl(null, []),
      output: new UntypedFormGroup(outputGroup),
      input: new UntypedFormGroup({}),
      namespaces: new UntypedFormGroup({}),
    });
  }

  async onNameTranslationButtonClicked() {
    let dialogResult = null
    dialogResult = await this.utils.openTranslationDialog(this.treeNameTranslationMap);
    if (dialogResult && dialogResult.event == "Accept") {
      this.nameTranslationsModified = true;
    }
  }

  async onTreeNodeNameTranslationButtonClicked() {

    let dialogResult = null
    dialogResult = await this.utils.openTranslationDialog(this.treeNodeForm.value.nameTranslations);
    if (dialogResult && dialogResult.event == "Accept") {
      this.treeNodeForm.patchValue({ nameTranslationsModified: true })
    }

  }

  async onDescriptionTranslationButtonClicked() {
    let dialogResult = null
    dialogResult = await this.utils.openTranslationDialog(this.treeDescriptionTranslationMap);
    if (dialogResult && dialogResult.event == "Accept") {
      this.descriptionTranslationsModified = true;
    }
  }


  async onTreeNodeDescriptionTranslationButtonClicked() {

    let dialogResult = null
    dialogResult = await this.utils.openTranslationDialog(this.treeNodeForm.value.descriptionTranslations);
    if (dialogResult && dialogResult.event == "Accept") {
      this.treeNodeForm.patchValue({ descriptionTranslationsModified: true })
    }

  }

  getAllCartographies = (): Observable<any> => {

    return this.cartographyService.getAll();

  }

  getAllTasks = (): Observable<any> => {

    return this.taskService.getAll();

  }

  getAllTreeTypes = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.utils.getCodeListValues('tree.type').subscribe(
        resp => {
          resolve(resp);
        }
      )
    });
  }

  getFolderNodeTypes = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.utils.getCodeListValues('treenode.folder.type').subscribe(
        resp => {
          resolve(resp);
        }
      )
    });
  }

  getLeafNodeTypes = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.utils.getCodeListValues('treenode.leaf.type').subscribe(
        resp => {
          resolve(resp);
        }
      )
    });
  }

  getTaskViewModes = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.utils.getCodeListValues('treenode.viewmode').subscribe(
        resp => {
          resolve(resp);
        }
      )
    });
  }

  async updateAllTrees(treesToUpdate: any[], depth: number, mapNewIdentificators: Map<number, any[]>, promises: Promise<any>[], newId, newParent) {
    for (let i = 0; i < treesToUpdate.length; i++) {
      const tree = treesToUpdate[i];

      if (tree.status) {
        var treeNodeObj: TreeNode = new TreeNode();

        treeNodeObj.name = tree.name;
        treeNodeObj.type = tree.nodeType;
        treeNodeObj.tooltip = tree.tooltip;
        treeNodeObj.order = tree.order;
        treeNodeObj.active = tree.active;
        treeNodeObj.datasetURL = tree.datasetURL;
        treeNodeObj.metadataURL = tree.metadataURL;
        treeNodeObj.description = tree.description;
        treeNodeObj.tree = this.treeToEdit;
        treeNodeObj.filterGetFeatureInfo = tree.filterGetFeatureInfo == "UNDEFINED" ? null : tree.filterGetFeatureInfo;
        treeNodeObj.filterGetMap = tree.filterGetMap == "UNDEFINED" ? null : tree.filterGetMap;
        treeNodeObj.filterSelectable = tree.filterSelectable == "UNDEFINED" ? null : tree.filterSelectable;
        treeNodeObj.style = tree.style;
        treeNodeObj.image = tree.image;
        treeNodeObj.imageName = tree.imageName;
        treeNodeObj.viewMode = tree.viewMode;
        treeNodeObj.filterable = tree.filterable;
        treeNodeObj.mapping = tree.mapping;


        if (tree.status === "pendingCreation" && tree._links && !tree.isFolder && (!tree.cartography || !tree.task)) {

          let urlReqCartography = `${tree._links.cartography.href}`
          if (tree._links.cartography.href) {
            const url = new URL(urlReqCartography.split("{")[0]);
            url.searchParams.append("projection", "view")
            urlReqCartography = url.toString();
          }
          tree.cartography = await this.http.get(urlReqCartography).toPromise();

          let urlReqTask = `${tree._links.task.href}`
          if (tree._links.task.href) {
            const url = new URL(urlReqTask.split("{")[0]);
            url.searchParams.append("projection", "view")
            urlReqTask = url.toString();
          }
          tree.task = await this.http.get(urlReqTask).toPromise();

        } else {
          if (tree.status !== "pendingCreation") {
            treeNodeObj._links = tree._links;
          }
        }
        treeNodeObj.cartography = tree.cartography;
        treeNodeObj.task = tree.task;


        if (tree.status !== "pendingDelete") {

          let currentParent;
          if (tree.parent !== null) {
            if (tree.parent >= 0) {
              currentParent = treesToUpdate.find(element => element.id === tree.parent);
              currentParent.tree = this.treeToEdit;
            } else {
              if (newId == null) {
                if (mapNewIdentificators.has(tree.parent)) {
                  mapNewIdentificators.get(tree.parent).push(tree);
                } else {
                  mapNewIdentificators.set(tree.parent, [tree]);
                }
                currentParent = undefined;
              } else {
                currentParent = newParent;
              }
            }

          } else {
            currentParent = null;
            treeNodeObj.parent = null;
          }

          if (currentParent !== undefined) {

            if (tree.status === "pendingCreation" && currentParent != null) {
              treeNodeObj.parent = currentParent._links.self.href;
            } else if (tree.status === "Modified" && currentParent != null) {
              treeNodeObj.parent = currentParent;
            }

            if (treeNodeObj._links) {
              treeNodeObj._links.cartography.href = treeNodeObj._links.cartography.href.split("{")[0];
              treeNodeObj._links.parent.href = treeNodeObj._links.parent.href.split("{")[0];
              treeNodeObj._links.treeNode.href = treeNodeObj._links.treeNode.href.split("{")[0];
              treeNodeObj.tree._links.allNodes.href = treeNodeObj.tree._links.allNodes.href.split("{")[0];
              treeNodeObj._links.task.href = treeNodeObj._links.task.href.split("{")[0];
            }

            promises.push(new Promise((resolve, reject) => {
              this.treeNodeService.save(treeNodeObj).subscribe(
                async result => {
                  const nameTranslationMap = this.nameTranslations.get(tree.id);
                  if (nameTranslationMap) {
                    this.utils.saveTranslation(result.id, nameTranslationMap, result.name, tree.nameTranslationsModified);
                    tree.nameTranslationModified = false;
                  } else if (tree.nameFormModified) {
                    const map = this.utils.createTranslationsList(config.translationColumns.treeNodeName);
                    this.utils.saveTranslation(result.id, map, tree.name, false);
                    this.nameTranslations.set(result.id, map);
                  }
                  const descriptionTranslationMap = this.descriptionTranslations.get(tree.id);
                  if (descriptionTranslationMap) {
                    this.utils.saveTranslation(result.id, descriptionTranslationMap, result.description, tree.nameTranslationsModified);
                    tree.descriptionTranslationsModified = false;
                  } else if (tree.descriptionFormModified) {
                    const map = this.utils.createTranslationsList(config.translationColumns.treeNodeDescription);
                    this.utils.saveTranslation(result.id, map, tree.description, false);
                    this.descriptionTranslations.set(result.id, map);
                  }
                  const oldId = tree.id;
                  treesToUpdate.splice(i, 1);
                  treesToUpdate.splice(0, 0, result)
                  if (mapNewIdentificators.has(oldId)) {
                    this.updateAllTrees(mapNewIdentificators.get(oldId), depth++, mapNewIdentificators, promises, result.id, result)
                  }

                  resolve(true);
                },
                error => {
                  this.loggerService.error('Error saving tree node', error);
                }
              )
            }));


          }


        } else {
          if (tree.id >= 0) {
            const idDeletedElement = tree.id;
            await this.treeNodeService.delete(treeNodeObj).toPromise();

          }
        }


      }


    }
    Promise.all(promises).then(() => {
      this.refreshTreeEvent.next(true);
    });

  }

  updateTaskTreeLeft(task) {

    this.treeNodeForm.patchValue({
      task: task
    })
    if (task != null) {
      this.treeNodeForm.patchValue({
        taskName: task.name,
        taskId: task.id
      })

    } else {
      if (!this.treeNodeForm.get('isFolder').value) {
        const oldTask = this.treeNodeForm.get('oldTask').value;
        if (oldTask) {
          this.treeNodeForm.patchValue({
            task: oldTask,
            taskName: oldTask.name,
            taskId: oldTask.id
          })
        }
      }
    }

    if (!this.treeNodeForm.get('isFolder').value) {
      if (this.treeNodeForm.get('filterGetFeatureInfo').value == "UNDEFINED") {
        this.treeNodeForm.get('filterGetFeatureInfo').patchValue(null);
      }
      if (this.treeNodeForm.get('filterGetMap').value == "UNDEFINED") {
        this.treeNodeForm.get('filterGetMap').patchValue(null);
      }
      if (this.treeNodeForm.get('filterSelectable').value == "UNDEFINED") {
        this.treeNodeForm.get('filterSelectable').patchValue(null);
      }
    }


    let newNameTranslation: Map<string, Translation> = null;
    let newDescriptionTranslation: Map<string, Translation> = null;

    if (this.treeNodeForm.value.nameTranslationsModified) {
      newNameTranslation = this.treeNodeForm.value.nameTranslations
    }

    if (this.treeNodeForm.value.descriptionTranslationsModified) {
      newDescriptionTranslation = this.treeNodeForm.value.descriptionTranslations
    }

    if (this.newElement) {
      this.treeNodeForm.patchValue({
        id: this.idFictitiousCounter
      })
      if (newNameTranslation) {
        this.nameTranslations.set(this.idFictitiousCounter, newNameTranslation)
      } else {
        if (this.treeNodeForm.value.description && this.treeNodeForm.value.description != this.currentNodeDescription) {
          this.treeNodeForm.patchValue({
            descriptionFormModified: true
          })
        }
      }
      if (newDescriptionTranslation) {
        this.descriptionTranslations.set(this.idFictitiousCounter, newDescriptionTranslation)
      } else {
        if (this.treeNodeForm.value.name && this.treeNodeForm.value.name != this.currentNodeName) {
          this.treeNodeForm.patchValue({
            nameFormModified: true
          })
        }
      }
    } else {
      if (newNameTranslation) {
        this.nameTranslations.set(this.treeNodeForm.value.id, newNameTranslation)
      } else {
        if (this.treeNodeForm.value.description && this.treeNodeForm.value.description != this.currentNodeDescription) {
          this.treeNodeForm.patchValue({
            descriptionFormModified: true
          })
        }
      }
      if (newDescriptionTranslation) {
        this.descriptionTranslations.set(this.treeNodeForm.value.id, newDescriptionTranslation)
      } else {
        if (this.treeNodeForm.value.name && this.treeNodeForm.value.name != this.currentNodeName) {
          this.treeNodeForm.patchValue({
            nameFormModified: true
          })
        }
      }
    }
  }

  updateCartographyTreeLeft(cartography) {

    this.treeNodeForm.patchValue({
      cartography: cartography
    })
    if (cartography != null) {
      this.treeNodeForm.patchValue({
        cartographyName: cartography.name,
        cartographyId: cartography.id
      })

    } else {
      if (!this.treeNodeForm.get('isFolder').value) {
        const oldCartography = this.treeNodeForm.get('oldCartography').value;
        if (oldCartography) {
          this.treeNodeForm.patchValue({
            cartography: oldCartography,
            cartographyName: oldCartography.name,
            cartographyId: oldCartography.id
          })
        }
      }
    }

    if (!this.treeNodeForm.get('isFolder').value) {
      if (this.treeNodeForm.get('filterGetFeatureInfo').value == "UNDEFINED") {
        this.treeNodeForm.get('filterGetFeatureInfo').patchValue(null);
      }
      if (this.treeNodeForm.get('filterGetMap').value == "UNDEFINED") {
        this.treeNodeForm.get('filterGetMap').patchValue(null);
      }
      if (this.treeNodeForm.get('filterSelectable').value == "UNDEFINED") {
        this.treeNodeForm.get('filterSelectable').patchValue(null);
      }
    }


    let newNameTranslation: Map<string, Translation> = null;
    let newDescriptionTranslation: Map<string, Translation> = null;

    if (this.treeNodeForm.value.nameTranslationsModified) {
      newNameTranslation = this.treeNodeForm.value.nameTranslations
    }

    if (this.treeNodeForm.value.descriptionTranslationsModified) {
      newDescriptionTranslation = this.treeNodeForm.value.descriptionTranslations
    }

    if (this.newElement) {
      this.treeNodeForm.patchValue({
        id: this.idFictitiousCounter
      })
      if (newNameTranslation) {
        this.nameTranslations.set(this.idFictitiousCounter, newNameTranslation)
      } else {
        if (this.treeNodeForm.value.description && this.treeNodeForm.value.description != this.currentNodeDescription) {
          this.treeNodeForm.patchValue({
            descriptionFormModified: true
          })
        }
      }
      if (newDescriptionTranslation) {
        this.descriptionTranslations.set(this.idFictitiousCounter, newDescriptionTranslation)
      } else {
        if (this.treeNodeForm.value.name && this.treeNodeForm.value.name != this.currentNodeName) {
          this.treeNodeForm.patchValue({
            nameFormModified: true
          })
        }
      }
    } else {
      if (newNameTranslation) {
        this.nameTranslations.set(this.treeNodeForm.value.id, newNameTranslation)
      } else {
        if (this.treeNodeForm.value.description && this.treeNodeForm.value.description != this.currentNodeDescription) {
          this.treeNodeForm.patchValue({
            descriptionFormModified: true
          })
        }
      }
      if (newDescriptionTranslation) {
        this.descriptionTranslations.set(this.treeNodeForm.value.id, newDescriptionTranslation)
      } else {
        if (this.treeNodeForm.value.name && this.treeNodeForm.value.name != this.currentNodeName) {
          this.treeNodeForm.patchValue({
            nameFormModified: true
          })
        }
      }
    }
  }

  createMappingParentTaskOptions(nodeParent) {
    const options = [];
    if (nodeParent && nodeParent.mapping) {
      const output = nodeParent.mapping.output;
      Object.keys(output).forEach(k => options.push({label: k, value: '${' + k + '}'}));
    }
    return options;
  }

  createNode(parent) {
    this.treeNodeForm.reset();
    this.newElement = true;
    this.currentNodeIsFolder = false;
    this.currentNodeType = parent.nodeType || this.codeValues.treenodeFolderType.cartography;
    this.currentViewMode = '';
    this.currentNodeHasParent = parent.id !== null;
    let parentId = parent.id;
    if (parent.name === "") {
      parentId = null;
    }
    this.treeNodeForm.patchValue({
      parent: parentId,
      isFolder: false,
      order: null,
      children: [],
      status: "pendingCreation",
      filterGetFeatureInfo: "UNDEFINED",
      filterGetMap: "UNDEFINED",
      filterSelectable: "UNDEFINED",
      active:true
    })

  }

  createFolder(parent) {
    this.treeNodeForm.reset();
    this.newElement = true;
    this.currentNodeIsFolder = true;
    this.currentNodeType = parent.nodeType || this.codeValues.treenodeFolderType.cartography;
    this.currentViewMode = '';
    this.currentNodeHasParent = parent.id !== null;
    let parentId = parent.id;
    if (parent.name === "") {
      parentId = null;
    }
    this.treeNodeForm.patchValue({
      parent: parentId,
      isFolder: true,
      order: null,
      children: [],
      status: "pendingCreation"
    })

  }

  onTreeNodeTypeChange(type) {
    if (!this.currentNodeHasParent || !this.currentNodeIsFolder) {
      this.currentNodeType = type;
    }
  }

  onTreeTypeChange(type) {
    this.currentTreeType = type;
  }

  activeImageNameInput(formtype, input) {
    const form = this.getFormByType(formtype);
    form.patchValue({
      image: null,
      imageName: null,
    });
    this.showImgPreview(formtype, null);
    input.readOnly = false;
    input.focus();
  }

  removeImage(formtype) {
    const form = this.getFormByType(formtype);
    form.patchValue({
      image: null,
      imageName: null,
    });
    this.showImgPreview(formtype, null);
  }

  onImageChange(formtype, event) {
    const input = event.target;
    if (!input.readOnly) {
      const form = this.getFormByType(formtype);
      form.patchValue({
        image: input.value
      });
      this.showImgPreview(formtype, input.value);
    }
  }

  onImageSelected(formtype, event) {
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      if (!file.type.startsWith('image/')) {
        //mensaje de error
        return;
      }
      const form = this.getFormByType(formtype);
      const reader = new FileReader();
      reader.onload = () => {
        form.patchValue({
          image: reader.result,
          imageName: file.name
        });
        this.showImgPreview(formtype, reader.result);
      }
      reader.readAsDataURL(file);
    }
  }

  showImgPreview(formtype, source) {
    let imgPreview : HTMLImageElement = document.querySelector('#treeImgPreview');
    if (formtype === 'node') {
      imgPreview = document.querySelector('#treeNodeImgPreview');
    }
    if (imgPreview) {
      const elem = formtype === 'node' ? imgPreview : imgPreview.parentElement;
      if (source) {
        imgPreview.src = source;
        elem.hidden = false;
      } else {
        elem.hidden = true;
      }
    }
  }

  async openFieldsConfigDialog() {
    this.namespaces = [];
    const origMapping = this.treeNodeForm.value.mapping;
    let formValues = {
      output: {},
      input: {},
      namespaces: {},
    };
    if (origMapping) {
      //modfica mapping btnLabel sea true, resto false
      Object.entries(origMapping.output).forEach(([clave, valor]: [string, any]) => {
        if (clave.includes('Label')) {
          valor.calculated = true;
        }else if (valor.calculated === null) {
          valor.calculated = false;
        }
      });
      formValues = origMapping;
      this.unParseNamespaces(formValues);
    }
    await this.addTaskInput();
    this.addNamespacesControl(formValues);
    this.fieldsConfigForm.patchValue({viewMode: this.currentViewMode});
    this.fieldsConfigForm.get('output')?.patchValue(formValues.output);
    this.fieldsConfigForm.get('input')?.patchValue(formValues.input);
    this.fieldsConfigForm.get('namespaces')?.patchValue(formValues.namespaces);
    console.log(this.fieldsConfigForm.value);

    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived = this.fieldsConfigDialog;
    dialogRef.componentInstance.title = this.utils.getTranslate('applicationEntity.configurationParameters');
    dialogRef.componentInstance.form = this.fieldsConfigForm;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          const mapping = this.getMappingByViewMode();
          this.treeNodeForm.patchValue({
            mapping
          });
        }
      }
      this.fieldsConfigTreeGenerated = false;
      this.fieldsConfigForm.reset();
      this.clearTaskInputFormControls();
      this.clearNamespacesFormControls();
    });
  }

  async addTaskInput() {
    const task = await this.taskService.get(this.treeNodeForm.value.taskId).toPromise();
    const inputFormGroup = this.fieldsConfigForm.get('input') as UntypedFormGroup;
    if (task.properties && task.properties.parameters) {
      task.properties.parameters.forEach(par => {
        const control = {
          name: par.name,
          label: par.label,
          value: par.value
        };
        this.nodeInputsControls.push(control);
        const newGroup = new UntypedFormGroup({
          value: new UntypedFormControl(null, []),
          calculated: new UntypedFormControl(null, [])
        });
        inputFormGroup.addControl(String(control.name), newGroup);
        const formValue = {
          value: control.value,
          calculated: true
        };
        newGroup.patchValue(formValue);
      });
    }
  }

  addNamespacesControl(origMapping) {
    const namespacesFormGroup = this.fieldsConfigForm.get('namespaces') as UntypedFormGroup;
    if (origMapping && origMapping.namespaces) {
      const keys = Object.keys(origMapping.namespaces);
      if (keys.length > 0) {
        this.namespaces = keys;
      }
    }
    this.noNamespaces = this.namespaces.length === 0;
    if (!this.noNamespaces) {
      this.namespaces.forEach(nm => {
        const control = {
          name: nm,
          value: ''
        };
        this.nodeNamespacesControls.push(control);
        const newGroup = new UntypedFormGroup({
          value: new UntypedFormControl(null, []),
        });
        namespacesFormGroup.addControl(String(control.name), newGroup);
        const formValue = {
          value: control.value,
        };
        newGroup.patchValue(formValue);
      });
    }
  }

  clearTaskInputFormControls() {
    const inputFormGroup = this.fieldsConfigForm.get('input') as UntypedFormGroup;
    Object.keys(inputFormGroup.controls).forEach(key => {
      inputFormGroup.removeControl(key);
    });
    this.nodeInputsControls = [];
  }

  clearNamespacesFormControls() {
    const namespacesFormGroup = this.fieldsConfigForm.get('namespaces') as UntypedFormGroup;
    Object.keys(namespacesFormGroup.controls).forEach(key => {
      namespacesFormGroup.removeControl(key);
    });
    this.nodeNamespacesControls = [];
  }

  getMappingByViewMode() {
    const item = this.fieldsConfigForm.value;
    console.log(item);
    const mapping = {
      output: {},
      input: item.input,
      namespaces: this.parseNamespaces(item.namespaces)
    };
    const outputsKeys = this.nodeOutputsControls.filter(noc => noc.views.includes(this.currentViewMode)).map(c => c.key);
    outputsKeys.forEach(k => {
      mapping.output[k] = item.output[k];
    });

    return mapping;
  }

  parseNamespaces(namespaces: any) {
    const result: Record<string, string> = {};
    if (namespaces) {
      const keys = Object.keys(namespaces);
      keys.forEach(k => {
        result[k] = namespaces[k].value;
      });
    }
    return result;
  }

  unParseNamespaces(formValues) {
    const newNamespaces = {};
    if (formValues.namespaces) {
      const keys = Object.keys(formValues.namespaces);
      keys.forEach(k => {
        this.namespaces.push(k);
        newNamespaces[k] = {value: formValues.namespaces[k]};
      });
    }
    formValues.namespaces = newNamespaces;
  }

  getFormByType(formtype) {
    let form = this.treeForm;
    if (formtype === 'node') {
      form = this.treeNodeForm;
    }
    return form;
  }

  onSaveButtonClicked() {
    if (this.treeValidations()) {
      this.getAllElementsNodes.next("save");
    }
  }

  updateNode() {
    this.sendNodeUpdated.next(this.treeNodeForm.value)
  }

  async onSaveFormButtonClicked() {
    if (this.treeNodeForm.valid) {
      if (!this.currentNodeIsFolder) {
        if (this.currentNodeType === this.codeValues.treenodeLeafType.task
          || this.currentTreeType === this.codeValues.treeType.edition) {
          const taskId = this.treeNodeForm.get('taskId').value;
          this.currentNodeTask = taskId ? await this.taskService.get(taskId).toPromise() : null;
          this.getAllElementsEventTasks.next(this.treeNodeForm.value);
        }
        if ([this.codeValues.treenodeLeafType.cartography, this.codeValues.treenodeLeafType.task].includes(this.currentNodeType)) {
          const cartographyId = this.treeNodeForm.get('cartographyId').value;
          this.currentNodeCartography = cartographyId ? await this.cartographyService.get(cartographyId).toPromise() : cartographyId;
          this.getAllElementsEventCartographies.next(this.treeNodeForm.value);
        }
      } else {
        this.updateCartographyTreeLeft(null);
        this.updateTaskTreeLeft(null);
      }
      this.updateTreeLeft();
    } else {
      this.utils.showRequiredFieldsError();
    }

  }

  treeValidations() {
    let valid = true;
    const nodes = this.dataTree.dataSource.data;
    const filterNodes = nodes.filter(a => a.status !== 'pendingDelete');
    const apps = this.appDataGrid.rowData;
    const filterApps = apps.filter(a => a.status !== 'pendingDelete')
    const validations = [{
      fn: this.validTreeForm,
      param: null,
      msg: this.utils.showRequiredFieldsError
    }, {
      fn: this.validTreeStructure,
      param: filterNodes,
      msg: this.utils.showTreeStructureError
    }/*, {
      fn: this.validTuristicTreeApp,
      param: filterApps,
      msg: this.utils.showTuristicTreeAppError
    }, {
      fn: this.validNoTuristicTreeApp,
      param: filterApps,
      msg: this.utils.showNoTuristicTreeAppError
    }*/];
    const error = validations.find(v => !v.fn.bind(this)(v.param));
    if (error) {
      valid = false;
      error.msg.bind(this.utils)();
    }
    return valid;
  }

  validTreeForm() {
    return this.treeForm.valid;
  }

  validTreeStructure(treeNodes) {
    let valid = true;
    if (this.currentTreeType === this.codeValues.treeType.touristicTree) {
      const rootNodes = treeNodes[0].children.filter(n => n.status !== 'pendingDelete');
      valid = rootNodes.length === 0 || (rootNodes.length === 1 && rootNodes[0].children.length > 0);
    }
    return valid;
  }

  validTuristicTreeApp(apps) {
    let valid = true;
    if (this.currentTreeType === this.codeValues.treeType.touristicTree) {
      valid = apps.length == 0 || (apps.length == 1 && apps[0].type === this.codeValues.applicationType.touristicApp);
    }
    return valid;
  }

  validNoTuristicTreeApp(apps) {
    let valid = true;
    if (this.currentTreeType !== this.codeValues.treeType.touristicTree) {
      valid = apps.every(a => this.validAppTrees(a));
    }
    return valid;
  }

  validAppTrees(app) {
    let valid = app.type !== this.codeValues.applicationType.touristicApp;
    if (!valid) {
      this.http.get(app._links.trees.href).pipe(map(data => data['_embedded']['trees']))
      .subscribe(trees => {
        valid = trees.length === 1;
      });
    }
    return valid;
  }

  receiveAllNodes(event) {
    if (event?.event == "save") {
      this.saveAll(event.data);
    }
  }

  getAllApplications = (): Observable<any> => {

    if (this.treeID == -1 && this.duplicateID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    }

    let urlReq = `${this.treeToEdit._links.availableApplications.href}`
    if (this.treeToEdit._links.availableApplications.templated) {
      const url = new URL(urlReq.split("{")[0]);
      url.searchParams.append("projection", "view")
      urlReq = url.toString();
    }


    return (this.http.get(urlReq))
      .pipe(map(data => data['_embedded']['applications']));


  }

  saveApplications(data: any[]) {
    let dataChanged = false;
    const applicationsToPut = [];
    const promises: Promise<any>[] = [];

    data.forEach(application => {
      if (application.status !== 'pendingDelete') {
        if (application.status === 'pendingModify') {
          if (application.newItem) {
            dataChanged = true;
          }
          promises.push(new Promise((resolve, reject) => {
            this.applicationService.update(application).subscribe((resp) => {
              resolve(true);
            });
          }));
        } else if (application.status === 'pendingCreation') {
          dataChanged = true;
        }
        applicationsToPut.push(application._links.self.href)
      } else {
        dataChanged = true;
      }
    });


    Promise.all(promises).then(() => {
      if (dataChanged) {
        const url = this.treeToEdit._links.availableApplications.href.split('{', 1)[0];
        this.utils.updateUriList(url, applicationsToPut, this.dataUpdatedEventApplication)
      } else {
        this.dataUpdatedEventApplication.next(true);
      }
    });

  }

  private showStyleError(){
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate("Error");
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.componentInstance.message = this.utils.getTranslate("treesEntity.styleError");
    dialogRef.afterClosed().subscribe();
  }

  private checkIfStyleIsInvalid(currentStyle:string, cartographyStyles: Array<string>):boolean{
    //True if cartographyStyles is empty and currentStyle is not null, or if cartography styles is not empty but not includes currentStyle
    if( ((!cartographyStyles || cartographyStyles.length == 0) && currentStyle) ||
    (cartographyStyles && cartographyStyles.length > 0 && (currentStyle && !cartographyStyles.includes(currentStyle)))){
      return true;
    }
    else{
      return false;
    }
  }


  public getSelectedRowsCartographies(data: any[]) {
    let cartography = null;
    if(!this.currentNodeIsFolder && (!data || data.length == 0)){
      cartography = this.currentNodeCartography;
    }
    if ((data.length <= 0 && this.treeNodeForm.value.cartographyName == null) && !this.currentNodeIsFolder) {
      const dialogRef = this.dialog.open(DialogMessageComponent);
      dialogRef.componentInstance.title = this.utils.getTranslate("Error");
      dialogRef.componentInstance.hideCancelButton = true;
      dialogRef.componentInstance.message = this.utils.getTranslate("cartographyNonSelectedMessage");
      dialogRef.afterClosed().subscribe();
    }
    else if( !this.currentNodeIsFolder && data.length >0 && this.checkIfStyleIsInvalid(this.treeNodeForm.get('style').value, data[0].stylesNames)){
      this.showStyleError();
    }
    else if(cartography && this.checkIfStyleIsInvalid(this.treeNodeForm.get('style').value, cartography.stylesNames)){
        this.showStyleError();
    }
    else {
      if (this.treeNodeForm.value.cartographyName !== null && data.length <= 0) {
        this.updateCartographyTreeLeft(null)
      }
      else {
        this.updateCartographyTreeLeft(data[0])
      }
    }

  }

  public getSelectedRowsTasks(data: any[]) {
    let task = null;
    if(!this.currentNodeIsFolder && (!data || data.length == 0)){
      task = this.currentNodeTask;
    }
    if ((data.length <= 0 && this.treeNodeForm.value.taskName == null) && !this.currentNodeIsFolder) {
      const dialogRef = this.dialog.open(DialogMessageComponent);
      dialogRef.componentInstance.title = this.utils.getTranslate("Error");
      dialogRef.componentInstance.hideCancelButton = true;
      dialogRef.componentInstance.message = this.utils.getTranslate("taskNonSelectedMessage");
      dialogRef.afterClosed().subscribe();
    }
    else {
      if (this.treeNodeForm.value.taskName !== null && data.length <= 0) {
        this.updateTaskTreeLeft(null)
      }
      else {
        this.updateTaskTreeLeft(data[0])
      }
    }

  }

  private storeTranslationInMap(translation, map: Map<number, Map<string, Translation>>, column: string) {
    const currentTranslation = map.get(translation.element)
    if (currentTranslation != undefined) {
      this.utils.updateTranslations(currentTranslation, [translation])
    } else {
      const newMap: Map<string, Translation> = this.utils.createTranslationsList(column)
      this.utils.updateTranslations(newMap, [translation]);
      map.set(translation.element, newMap);
    }
  }

  private createNodesWithCapabilities(groupLayersResult: Array<any>, existingNodes: Array<any>, parentId?) {
    groupLayersResult.forEach(element => {
      let newNode: any = {};
      let name = element.Title;
      if (name && name.length > 250) {
        name = name.substring(0, 249)
      }
      const disallowNodeCreation = existingNodes.some(element => element.name == name);
      if (!disallowNodeCreation) {
        if (element.Layer) {  //Is folder
          newNode = this.createNewFolderWithCapabilities(element)
        } else { //Is node
          newNode = this.createNewNodeWithCapabilities(element)
        }


        if (newNode) {
          newNode.name = name;
          newNode.tooltip = name;
          newNode.type = this.codeValues.treenodeFolderType.cartography;
          newNode.parent = parentId;
          newNode.id = this.idFictitiousCounter;
          newNode.children = [];
          newNode.order = null;
          newNode.status = "pendingCreation";
          this.idFictitiousCounter--;
          this.createNodeEvent.next(newNode);

          //If only have one layer, we have to put it in an Array
          let childrenLayers = element.Layer;
          if (childrenLayers) {
            if (!Array.isArray(childrenLayers)) {
              childrenLayers = [element.Layer];
            }
          }

          if (childrenLayers) {
            this.createNodesWithCapabilities(childrenLayers, existingNodes, newNode.id)
          }


        }


      }


    });
  }

  updateTreeLeft() {
    if (this.newElement) {
      this.idFictitiousCounter--;
      this.createNodeEvent.next(this.treeNodeForm.value);
    } else {
      this.updateNode();
    }
    this.newElement = false;
    this.currentNodeIsFolder = undefined;
    this.treeNodeForm.reset();
  }

    // ******** Applications ******** //

  private createNewFolderWithCapabilities(capability) {
    const newFolder: any = {};
    newFolder.description = capability.Abstract;
    newFolder.radio = false;
    newFolder.isFolder = true;

    if (newFolder.description && newFolder.description.length > 250) {
      newFolder.description = newFolder.description.substring(0, 249)
    }


    if (capability.MetadataURL != undefined) {
      const metadataURL = Array.isArray(capability.MetadataURL) ? capability.MetadataURL[0] : capability.MetadataURL
      newFolder.metadataURL = metadataURL.OnlineResource['xlink:href']
    }

    if (capability.DataURL != undefined) {
      const DataURL = Array.isArray(capability.DataURL) ? capability.DataURL[0] : capability.DataURL
      newFolder.datasetURL = DataURL.OnlineResource['xlink:href']
    }

    return newFolder;

  }

    getAllRowsApplication(event) {
      if (event.event == "save") {
        this.saveApplications(event.data);
      }
    }

  private createNewNodeWithCapabilities(capability) {
    const newNode: any = {};

    let layersLyr; //Layers field to compare with cartographies
    if (Array.isArray(capability.Name)) {
      layersLyr = capability.Name;
    } else {
      if (!isNaN(capability.Name)) {
        capability.Name = capability.Name.toString()
      }
      layersLyr = capability.Name.split(",");
    }


    if (!layersLyr) {
      return null
    }
    const cartography = this.layersList.find(element => element.layers.join() == layersLyr.join())
    if (!cartography) {
      return null
    }

    newNode.cartography = cartography;
    newNode.cartographyName = cartography.name;
    newNode.active = true;
    newNode.isFolder = false;
    return newNode;
  }

  openApplicationsDialog(data: any) {
    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable = [this.getAllApplicationDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsApplicationDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate("layersPermitsEntity.applications");
    dialogRef.componentInstance.titlesTable = [''];
    dialogRef.componentInstance.currentData = [data];
    dialogRef.componentInstance.fieldRestrictionWithDifferentName = ['applicationName'];
    dialogRef.componentInstance.addFieldRestriction = ['name'];
    dialogRef.componentInstance.nonEditable = false;



    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.addElementsEventApplication.next(result.data[0])
        }
      }
    });

  }

  getAllApplicationDialog = () => {

    return this.applicationService.getAll();
  }

  activeTabIndex = 0;

  onTabChange(event: MatTabChangeEvent) {
    this.activeTabIndex = event.index;
  }

  activeNodeTabIndex = 0;

  onNodeTabChange(event: MatTabChangeEvent) {
    this.activeNodeTabIndex = event.index;
  }

  generateFieldsConfigTree() {
    this.parseInput(this.fieldsConfigForm.value.taskResponse);
    this.fieldsConfigTreeGenerated = true;
  }

  hideFieldsConfigTree() {
    this.fieldsConfigTreeGenerated = false;
  }

  getFieldConfigInput = (): Observable<any> => {
    return of(this.parsedData);
  }

  async parseInput(inputText) {
    this.parsedData = {
      data: {},
      dataType: 'json'
    };
    try {
      if (inputText) {
        if (this.isJson(inputText)) {
          this.parsedData.data = JSON.parse(inputText);
          this.parsedData.dataType = 'json';
        } else {
          const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@'
          });
          this.parsedData.data = parser.parse(inputText);
          this.parsedData.dataType = 'xml';
        }
        this.namespaces = this.getNamespacesKeys(this.parsedData.data);
        console.log(this.namespaces);
        this.clearNamespacesFormControls();
        this.addNamespacesControl(null);
      }
    } catch (error) {
      console.error(error);
      alert('Error al procesar el JSON/XML. Verifique el formato.');
    }
  }

  getNamespacesKeys(obj) {
    const result = new Set<string>();
    this.recurseNamespaceSearch(obj, result);
    return Array.from(result);
  }

  recurseNamespaceSearch(current: any, result: Set<string>) {
    if (Array.isArray(current)) {
      current.forEach(item => this.recurseNamespaceSearch(item, result));
    } else if (typeof current === 'object' && current !== null) {
      for (const key in current) {
        if (key.includes(':')) {
          const [prefix] = key.split(':');
          result.add(prefix);
        }
        if (key !== '@') {
          this.recurseNamespaceSearch(current[key], result);
        }
      }
    }
  }

  isJson(text: string): boolean {
    try {
      JSON.parse(text);
      return true;
    } catch (e) {
      return false;
    }
  }

  fieldTreeNode(node) {
    let path = node.path ?? '/';
    if (path.includes('@/')) {
      path = path.replace('@/', '@');
    }
    this.selectedXPath = path;
    const radioBtns = document.querySelectorAll('.mapping-radio');
    const radioChecked = Array.from(radioBtns).find(i => document.querySelector<HTMLInputElement>(`#${i.id}-input`).checked);
    const attribute = radioChecked?.id.split('-')[0];
    const formValue = {
      value: this.selectedXPath
    };
    this.fieldsConfigForm.get('output')?.get(attribute)?.patchValue(formValue);
  }

  onViewModeChange(value) {
    this.currentViewMode = value;
    this.treeNodeForm.patchValue({
      viewMode: value,
    });
  }

  // ******** Roles ******** //
  getAllRoles = (): Observable<any> => {
    if (this.treeID === -1) {
      return of([]);
    } else {
      let urlReq = `${this.treeToEdit._links.availableRoles.href}`;
      if (this.treeToEdit._links.availableRoles.templated) {
        const url = new URL(urlReq.split("{")[0]);
        url.searchParams.append("projection", "view");
        urlReq = url.toString();
      }
      return this.http.get(urlReq).pipe(map(data => data['_embedded']['roles']));
    }
  };

  getAllRowsRoles(event) {
    if (event.event === "save") {
      this.saveRoles(event.data);
    }
  }

  saveRoles(data: any[]) {
    let dataChanged = false;
    const promises: Promise<any>[] = [];
    const rolesToPut = [];

    data.forEach(role => {
      if (role.status !== 'pendingDelete') {
        if (role.status === 'pendingModify') {
          if (role.newItem) { dataChanged = true; }
          promises.push(new Promise((resolve) => {
            this.roleService.update(role).subscribe(() => { resolve(true); });
          }));
        } else if (role.status === 'pendingCreation') {
          dataChanged = true;
        }
        rolesToPut.push(role._links.self.href);
      } else {
        dataChanged = true;
      }
    });

    Promise.all(promises).then(() => {
      if (dataChanged) {
        const url = this.treeToEdit._links.availableRoles.href.split('{', 1)[0];
        this.utils.updateUriList(url, rolesToPut, this.dataUpdatedEventRoles);
      } else {
        this.dataUpdatedEventRoles.next(true);
      }
    });
  }

  // ******** Roles Dialog ******** //
  getAllRolesDialog = () => {
    return this.roleService.getAll();
  };

  openRolesDialog(data: any) {
    const dialogRef = this.dialog.open(DialogGridComponent, { panelClass: 'gridDialogs' });
    dialogRef.componentInstance.orderTable = ['name'];
    dialogRef.componentInstance.getAllsTable = [this.getAllRolesDialog];
    dialogRef.componentInstance.singleSelectionTable = [false];
    dialogRef.componentInstance.columnDefsTable = [this.columnDefsRolesDialog];
    dialogRef.componentInstance.themeGrid = this.themeGrid;
    dialogRef.componentInstance.title = this.utils.getTranslate('treesEntity.roles');
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
}

