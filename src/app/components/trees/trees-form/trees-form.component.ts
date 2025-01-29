import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TreeService, TreeNodeService, Translation, TranslationService, TaskService,
  CartographyService, Tree, TreeNode, Cartography, ServiceService, CapabilitiesService, ApplicationService, 
} from '../../../frontend-core/src/lib/public_api';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { Observable, of, Subject } from 'rxjs';
import { DataTreeComponent, DialogGridComponent, DialogMessageComponent, DataGridComponent } from '../../../frontend-gui/src/lib/public_api';
import { MatDialog } from '@angular/material/dialog';
import { isArray } from 'rxjs/internal-compatibility';
import { constants } from 'src/environments/constants';



@Component({
  selector: 'app-trees-form',
  templateUrl: './trees-form.component.html',
  styleUrls: ['./trees-form.component.scss']
})
export class TreesFormComponent implements OnInit {


  //Translations
  nameTranslationsModified: boolean = false;
  descriptionTranslationsModified: boolean = false;
  nameTranslations: Map<number, Map<string, Translation>> = new Map<number, Map<string, Translation>>();
  descriptionTranslations: Map<number, Map<string, Translation>> = new Map<number, Map<string, Translation>>();

  treeNameTranslationMap: Map<string, Translation>;
  treeDescriptionTranslationMap: Map<string, Translation>;

  columnDefsApplication: any[];
  addElementsEventApplication: Subject<any[]> = new Subject<any[]>();
  dataUpdatedEventApplication: Subject<boolean> = new Subject<boolean>();

  columnDefsApplicationDialog: any[];
  getAllElementsEventApplication: Subject<string> = new Subject<string>();

  themeGrid: any = config.agGridTheme;
  treeID: number = -1;
  duplicateID = -1;
  treeForm: UntypedFormGroup;
  treeNodeForm: UntypedFormGroup;
  idFictitiousCounter = -1;
  treeToEdit: Tree;
  dataLoaded: Boolean = false;
  currentNodeIsFolder: Boolean;
  currentNodeName: string;
  currentNodeDescription: string;
  currentNodeType: string;
  currentTreeType: string;
  newElement: Boolean = false;
  duplicateToDo = false;
  sendNodeUpdated: Subject<any> = new Subject<any>();
  getAllElementsNodes: Subject<string> = new Subject<string>();
  refreshTreeEvent: Subject<boolean> = new Subject<boolean>();
  createNodeEvent: Subject<boolean> = new Subject<boolean>();
  getAllElementsEventCartographies: Subject<boolean> = new Subject<boolean>();
  getAllElementsEventTasks: Subject<boolean> = new Subject<boolean>();
  columnDefsCartographies: any[];
  columnDefsTasks: any[];
  columnDefsServices: any[];
  @ViewChild(DataTreeComponent) dataTree: DataTreeComponent;
  @ViewChild('applicationsDataGrid') appDataGrid: DataGridComponent;

  filterOptions = [{value:'UNDEFINED', description: 'UNDEFINED'}, {value:true, description: 'YES'},{value:false, description: 'NO'}]
  
  types = constants.type;
  servicesList = [];
  layersList = [];
  treetypesList = [];
  folderNodeTypesList = [];
  finalNodeTypesList = [];
  taskviewsList = [{
    value: 'ld',
    description: 'Lista detallada'
  }, {
    value: 'lep',
    description: 'Lista elementos proximos'
  }, {
    value: 'it',
    description: 'Itinerario'
  }, {
    value: 'map',
    description: 'Mapa'
  }];

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
    public applicationService: ApplicationService
  ) {

    this.initializeTreesForm();
    this.initializeTreesNodeForm();
  }



  async ngOnInit() {

    this.getAllTreeTypes().then((resp) => {
      this.treetypesList.push(...resp);
    });

    this.getFolderNodeTypes().then((resp) => {
      this.folderNodeTypesList.push(...resp);
    });

    this.getFinalNodeTypes().then((resp) => {
      this.finalNodeTypesList.push(...resp);
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
        let idToGet = this.treeID !== -1 ? this.treeID : this.duplicateID

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
                  let treeNameTranslations = [];
                  let treeDescriptionTranslations = [];
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
  }

  saveTreeNodeTranslation(translation, column) {
    if (translation.column == config.translationColumns.treeNodeName) {
      this.storeTranslationInMap(translation, this.nameTranslations, column)
    }
    else if (translation.column == config.translationColumns.treeNodeDescription) {
      this.storeTranslationInMap(translation, this.descriptionTranslations, column)
    }
  }

  private storeTranslationInMap(translation, map: Map<Number, Map<string, Translation>>, column: string) {
    let currentTranslation = map.get(translation.element)
    if (currentTranslation != undefined) {
      this.utils.updateTranslations(currentTranslation, [translation])
    }
    else {
      let newMap: Map<string, Translation> = this.utils.createTranslationsList(column)
      this.utils.updateTranslations(newMap, [translation]);
      map.set(translation.element, newMap);
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


    let dialogResult = await dialogRef.afterClosed().toPromise()
    if (dialogResult) {
      if (dialogResult.event === 'Add' && dialogResult.data && dialogResult.data[0].length > 0) {
        service = dialogResult.data[0][0];
        url = service.serviceURL;
        if (url) {
          if (!url.includes(config.capabilitiesRequest.simpleRequest)) {
            if (url[url.length - 1] != '?') { url += "?" }

            url += config.capabilitiesRequest.requestWithWMS
          }

          let capabilitiesResult = await this.capabilitiesService.getInfo(url).toPromise();
          if (capabilitiesResult.success) {
            let groupLayersResult = this.changeServiceDataByCapabilities(capabilitiesResult.asJson)
            this.createNodesWithCapabilities(groupLayersResult, data, null)
          }
        }
      }
    }
  }

  private createNodesWithCapabilities(groupLayersResult: Array<any>, existingNodes: Array<any>, parentId?) {
    groupLayersResult.forEach(element => {
      let newNode: any = {};
      let name = element.Title;
      if (name && name.length > 250) { name = name.substring(0, 249) }
      let disallowNodeCreation = existingNodes.some(element => element.name == name);
      if (!disallowNodeCreation) {
        if (element.Layer) {  //Is folder
          newNode = this.createNewFolderWithCapabilities(element)
        }
        else { //Is node
          newNode = this.createNewNodeWithCapabilities(element)
        }


        if (newNode) {
          newNode.name = name;
          newNode.tooltip = name;
          newNode.type = 'cartography';
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
            if (!isArray(childrenLayers)) {
              childrenLayers = [element.Layer];
            }
          }

          if (childrenLayers) { this.createNodesWithCapabilities(childrenLayers, existingNodes, newNode.id) }


        }



      }




    });
  }

  private createNewFolderWithCapabilities(capability) {
    let newFolder: any = {};
    newFolder.description = capability.Abstract;
    newFolder.radio = false;
    newFolder.isFolder = true;

    if (newFolder.description && newFolder.description.length > 250) { newFolder.description = newFolder.description.substring(0, 249) }


    if (capability.MetadataURL != undefined) {
      let metadataURL = Array.isArray(capability.MetadataURL) ? capability.MetadataURL[0] : capability.MetadataURL
      newFolder.metadataURL = metadataURL.OnlineResource['xlink:href']
    }

    if (capability.DataURL != undefined) {
      let DataURL = Array.isArray(capability.DataURL) ? capability.DataURL[0] : capability.DataURL
      newFolder.datasetURL = DataURL.OnlineResource['xlink:href']
    }

    return newFolder;

  }

  private createNewNodeWithCapabilities(capability) {
    let newNode: any = {};

    let layersLyr; //Layers field to compare with cartographies
    if (Array.isArray(capability.Name)) {
      layersLyr = capability.Name;
    }
    else {
      if (!isNaN(capability.Name)) { capability.Name = capability.Name.toString() }
      layersLyr = capability.Name.split(",");
    }


    if (!layersLyr) { return null }
    let cartography = this.layersList.find(element => element.layers.join() == layersLyr.join())
    if (!cartography) { return null }

    newNode.cartography = cartography;
    newNode.cartographyName = cartography.name;
    newNode.active = true;
    newNode.isFolder = false;
    return newNode;
  }

  changeServiceDataByCapabilities(serviceCapabilitiesData, refresh?): Array<any> {
    let capabilitiesLayers = [];
    let data = serviceCapabilitiesData.WMT_MS_Capabilities != undefined ? serviceCapabilitiesData.WMT_MS_Capabilities : serviceCapabilitiesData.WMS_Capabilities
    if (data != undefined) {
      let capability = data.Capability.Layer;
      while (capability.Layer != null && capability.Layer != undefined) {
        capability = capability.Layer;
      }
      capabilitiesLayers.push(...capability);

    }

    return capabilitiesLayers;

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
      nodetype: new UntypedFormControl(null, []),
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
      

    })
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
    })

  }

  getFolderNodeTypes = (): Promise<any> => {

    return new Promise((resolve, reject) => {
      this.utils.getCodeListValues('treenode.folder.type').subscribe(
        resp => {
          resolve(resp);
        }
      )
    })

  }

  getFinalNodeTypes = (): Promise<any> => {

    return new Promise((resolve, reject) => {
      this.utils.getCodeListValues('treenode.final.type').subscribe(
        resp => {
          resolve(resp);
        }
      )
    })

  }

  getAllServices = (): Observable<any> => {

    return this.serviceService.getAll().map((resp) => {
      let wmsServices = [];
      resp.forEach(service => {
        if (service.type === 'WMS') { wmsServices.push(service) }
      });
      return wmsServices;
    })

  }

  getAllTreeNodes = (): Observable<any> => {
    if (this.treeID == -1 && this.duplicateID == -1) {
      const aux: Array<any> = [];
      return of(aux);
    } else {
      var urlReq = `${this.treeForm.value._links.allNodes.href}`
      if (this.treeForm.value._links.allNodes.templated) {
        var url = new URL(urlReq.split("{")[0]);
        url.searchParams.append("projection", "view")
        urlReq = url.toString();
      }
      let response = (this.http.get(urlReq)).pipe(map(data => data['_embedded']['tree-nodes']))
      return response;
    }
  }

  nodeReceived(node) {

    this.newElement = false;
    let currentType;
    if (node.isFolder) {
      this.currentNodeIsFolder = true;
      currentType = 'folder'
    }
    else {
      this.currentNodeIsFolder = false;
      currentType = 'node'
    }
    this.currentNodeType = node.nodetype;
    let status = "Modified"
    let nameTranslationsModified = node.nameTranslationsModified ? true : false;
    let descriptionTranslationsModified = node.descriptionTranslationsModified ? true : false;
    let nameFormModified = node.nameFormModified ? true : false;
    let descriptionFormModified = node.descriptionFormModified ? true : false;
    if (node.id < 0) { status = "pendingCreation" }
    this.treeNodeForm.patchValue({
      id: node.id,
      name: node.name,
      tooltip: node.tooltip,
      nodetype: node.nodetype,
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
      filterGetFeatureInfo: (node.filterGetFeatureInfo == null || node.filterGetFeatureInfo == undefined)?"UNDEFINED":node.filterGetFeatureInfo,
      filterGetMap: (node.filterGetMap == null || node.filterGetMap == undefined)?"UNDEFINED":node.filterGetMap,
      filterSelectable: (node.filterSelectable == null || node.filterSelectable == undefined)?"UNDEFINED":node.filterSelectable,
      style: node.style,
      status: status,
      type: currentType
    });
    setTimeout(() => {
      this.showImgPreview('node', node.image);
    });
    if (this.nameTranslations.has(node.id)) {
      let translations = this.nameTranslations.get(node.id);
      this.treeNodeForm.patchValue({
        nameTranslations: translations
      })
    }

    if (this.descriptionTranslations.has(node.id)) {
      let translations = this.descriptionTranslations.get(node.id);
      this.treeNodeForm.patchValue({
        descriptionTranslations: translations
      })
    }

  }

  createNode(parent) {
    this.treeNodeForm.reset();
    this.newElement = true;
    this.currentNodeIsFolder = false;
    this.currentNodeType = 'cartography';
    let parentId = parent.id;
    if (parent.name === "Root") { parentId = null }
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
    this.currentNodeType = 'cartography';
    let parentId = parent.id;
    if (parent.name === "Root") { parentId = null }
    this.treeNodeForm.patchValue({
      parent: parentId,
      isFolder: true,
      order: null,
      children: [],
      status: "pendingCreation"
    })

  }

  onTreeNodeTypeChange(type) {
    this.currentNodeType = type;
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

  onSaveFormButtonClicked() {
    let error = false;
    if (this.treeNodeForm.valid) {
      if (!this.currentNodeIsFolder) {
        if (this.currentNodeType === this.types.cartography) {
          this.getAllElementsEventCartographies.next(this.treeNodeForm.value);
        } else if (this.currentNodeType === this.types.task) {
          this.getAllElementsEventTasks.next(this.treeNodeForm.value);
        }
      } else {
        this.updateTreeLeft(null);
      }
    } else {
      this.utils.showRequiredFieldsError();
    }

  }

  treeValidations() {
    let valid = true;
    let nodes = this.dataTree.dataSource.data;
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
    }, {
      fn: this.validTuristicTreeApp,
      param: filterApps,
      msg: this.utils.showTuristicTreeAppError
    }, {
      fn: this.validNoTuristicTreeApp,
      param: filterApps,
      msg: this.utils.showNoTuristicTreeAppError
    }];
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
    return this.validNodeTypes(treeNodes[0].children);
  }

  validNodeTypes(nodes) {
    let valid = true;
    let baseType = this.types.cartography;
    if (this.currentTreeType === this.types.cartography) {
      for (let i = 0; i < nodes.length; i++) {
        if ((!nodes[i].status || nodes[i].status !== 'pendingDelete') &&
          (nodes[i].nodetype !== baseType || !this.validNodeTypes(nodes[i].children))) {
          valid = false;
          break;
        }
      }
    } else {
      if (nodes.length > 1) {
        baseType = nodes[0].nodetype;
        for (let i = 0; i < nodes.length; i++) {
          if ((!nodes[i].status || nodes[i].status !== 'pendingDelete') &&
            (nodes[i].nodetype !== baseType || !this.validNodeTypes(nodes[i].children))) {
            valid = false;
            break;
          }
        }
      }
    }
    return valid;
  }

  validTuristicTreeApp(apps) {
    let valid = true;
    if (this.currentTreeType === constants.type.appTuristic) {
      valid = apps.length == 0 || (apps.length == 1 && apps[0].type === constants.type.appTuristic);
    }
    return valid;
  }

  validNoTuristicTreeApp(apps) {
    let valid = true;
    if (this.currentTreeType !== constants.type.appTuristic) {
      valid = !apps.some(a => a.type === constants.type.appTuristic);
    }
    return valid;
  }

  receiveAllNodes(event) {
    if (event?.event == "save") {
      this.saveAll(event.data);
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

        let mapNewIdentificators: Map<number, any[]> = new Map<number, any[]>();
        const promises: Promise<any>[] = [];
        this.getAllElementsEventApplication.next('save');
        this.updateAllTrees(data, 0, mapNewIdentificators, promises, null, null);
        this.refreshTreeEvent.next(true)
      },
        error => {
          console.log(error);
        });

  }

  async updateAllTrees(treesToUpdate: any[], depth: number, mapNewIdentificators: Map<number, any[]>, promises: Promise<any>[], newId, newParent) {
    for (let i = 0; i < treesToUpdate.length; i++) {
      let tree = treesToUpdate[i];

      if (tree.status) {
        var treeNodeObj: TreeNode = new TreeNode();

        treeNodeObj.name = tree.name;
        treeNodeObj.type = tree.nodetype;
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



        if (tree.status === "pendingCreation" && tree._links && !tree.isFolder && (!tree.cartography || !tree.task)) {

          let urlReqCartography = `${tree._links.cartography.href}`
          if (tree._links.cartography.href) {
            let url = new URL(urlReqCartography.split("{")[0]);
            url.searchParams.append("projection", "view")
            urlReqCartography = url.toString();
          }
          tree.cartography = await this.http.get(urlReqCartography).toPromise();

          let urlReqTask = `${tree._links.task.href}`
          if (tree._links.task.href) {
            let url = new URL(urlReqTask.split("{")[0]);
            url.searchParams.append("projection", "view")
            urlReqTask = url.toString();
          }
          tree.task = await this.http.get(urlReqTask).toPromise();

        }
        else {
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
            }
            else {
              if (newId == null) {
                if (mapNewIdentificators.has(tree.parent)) {
                  mapNewIdentificators.get(tree.parent).push(tree);
                }
                else {
                  mapNewIdentificators.set(tree.parent, [tree]);
                }
                currentParent = undefined;
              }
              else {
                currentParent = newParent;
              }
            }

          }
          else {
            currentParent = null;
            treeNodeObj.parent = null;
          }

          if (currentParent !== undefined) {

            if (tree.status === "pendingCreation" && currentParent != null) {
              treeNodeObj.parent = currentParent._links.self.href;
            }
            else if (tree.status === "Modified" && currentParent != null) {
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
                  let nameTranslationMap = this.nameTranslations.get(tree.id);
                  if (nameTranslationMap) {
                    this.utils.saveTranslation(result.id, nameTranslationMap, result.name, tree.nameTranslationsModified);
                    tree.nameTranslationModified = false;
                  }
                  else if (tree.nameFormModified) {
                    let map = this.utils.createTranslationsList(config.translationColumns.treeNodeName);
                    this.utils.saveTranslation(result.id, map, tree.name, false);
                    this.nameTranslations.set(result.id, map);
                  }
                  let descriptionTranslationMap = this.descriptionTranslations.get(tree.id);
                  if (descriptionTranslationMap) {
                    this.utils.saveTranslation(result.id, descriptionTranslationMap, result.description, tree.nameTranslationsModified);
                    tree.descriptionTranslationsModified = false;
                  }
                  else if (tree.descriptionFormModified) {
                    let map = this.utils.createTranslationsList(config.translationColumns.treeNodeDescription);
                    this.utils.saveTranslation(result.id, map, tree.description, false);
                    this.descriptionTranslations.set(result.id, map);
                  }
                  let oldId = tree.id;
                  treesToUpdate.splice(i, 1);
                  treesToUpdate.splice(0, 0, result)
                  if (mapNewIdentificators.has(oldId)) {
                    this.updateAllTrees(mapNewIdentificators.get(oldId), depth++, mapNewIdentificators, promises, result.id, result)
                  }

                  resolve(true);
                },
                error => {
                  console.log(error);
                }
              )
            }));



          }


        }
        else {
          if (tree.id >= 0) {
            let idDeletedElement = tree.id;
            await this.treeNodeService.remove(treeNodeObj).toPromise();

          }
        }


      }


    };
    Promise.all(promises).then(() => {
      this.refreshTreeEvent.next(true);
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


  public async getSelectedRowsCartographies(data: any[]) {
    let cartography = null;
    if(!this.currentNodeIsFolder && (!data || data.length == 0)){
      cartography = await this.cartographyService.get(this.treeNodeForm.get('cartographyId').value).toPromise()
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
        this.updateTreeLeft(null)
      }
      else {
        this.updateTreeLeft(data[0])
      }
    }

  }

  public async getSelectedRowsTasks(data: any[]) {
    let task = null;
    if(!this.currentNodeIsFolder && (!data || data.length == 0)){
      task = await this.taskService.get(this.treeNodeForm.get('taskId').value).toPromise()
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
        this.updateTreeLeft(null)
      }
      else {
        this.updateTaskTreeLeft(data[0])
      }
    }

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

    }
    else{
      if(!this.treeNodeForm.get('isFolder').value){
        let oldTask = this.treeNodeForm.get('oldTask').value;
        if(oldTask){
          this.treeNodeForm.patchValue({
            task: oldTask,
            taskName: oldTask.name,
            taskId: oldTask.id
          })
        }
      }
    }

    if(!this.treeNodeForm.get('isFolder').value){
      if(this.treeNodeForm.get('filterGetFeatureInfo').value == "UNDEFINED"){
        this.treeNodeForm.get('filterGetFeatureInfo').patchValue(null);
      }
      if(this.treeNodeForm.get('filterGetMap').value == "UNDEFINED"){
        this.treeNodeForm.get('filterGetMap').patchValue(null);
      }
      if(this.treeNodeForm.get('filterSelectable').value == "UNDEFINED"){
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
      if (newNameTranslation) { this.nameTranslations.set(this.idFictitiousCounter, newNameTranslation) }
      else {
        if (this.treeNodeForm.value.description && this.treeNodeForm.value.description != this.currentNodeDescription) {
          this.treeNodeForm.patchValue({
            descriptionFormModified: true
          })
        }
      }
      if (newDescriptionTranslation) { this.descriptionTranslations.set(this.idFictitiousCounter, newDescriptionTranslation) }
      else {
        if (this.treeNodeForm.value.name && this.treeNodeForm.value.name != this.currentNodeName) {
          this.treeNodeForm.patchValue({
            nameFormModified: true
          })
        }
      }

      this.idFictitiousCounter--;
      this.createNodeEvent.next(this.treeNodeForm.value);
    }
    else {
      if (newNameTranslation) { this.nameTranslations.set(this.treeNodeForm.value.id, newNameTranslation) }
      else {
        if (this.treeNodeForm.value.description && this.treeNodeForm.value.description != this.currentNodeDescription) {
          this.treeNodeForm.patchValue({
            descriptionFormModified: true
          })
        }
      }
      if (newDescriptionTranslation) { this.descriptionTranslations.set(this.treeNodeForm.value.id, newDescriptionTranslation) }
      else {
        if (this.treeNodeForm.value.name && this.treeNodeForm.value.name != this.currentNodeName) {
          this.treeNodeForm.patchValue({
            nameFormModified: true
          })
        }
      }
      this.updateNode()
    }

    this.newElement = false;
    this.currentNodeIsFolder = undefined;
    this.treeNodeForm.reset();
  }

  updateTreeLeft(cartography) {

    this.treeNodeForm.patchValue({
      cartography: cartography
    })
    if (cartography != null) {
      this.treeNodeForm.patchValue({
        cartographyName: cartography.name,
        cartographyId: cartography.id
      })

    }
    else{
      if(!this.treeNodeForm.get('isFolder').value){
        let oldCartography = this.treeNodeForm.get('oldCartography').value;
        if(oldCartography){
          this.treeNodeForm.patchValue({
            cartography: oldCartography,
            cartographyName: oldCartography.name,
            cartographyId: oldCartography.id
          })
        }
      }
    }

    if(!this.treeNodeForm.get('isFolder').value){
      if(this.treeNodeForm.get('filterGetFeatureInfo').value == "UNDEFINED"){
        this.treeNodeForm.get('filterGetFeatureInfo').patchValue(null);
      }
      if(this.treeNodeForm.get('filterGetMap').value == "UNDEFINED"){
        this.treeNodeForm.get('filterGetMap').patchValue(null);
      }
      if(this.treeNodeForm.get('filterSelectable').value == "UNDEFINED"){
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
      if (newNameTranslation) { this.nameTranslations.set(this.idFictitiousCounter, newNameTranslation) }
      else {
        if (this.treeNodeForm.value.description && this.treeNodeForm.value.description != this.currentNodeDescription) {
          this.treeNodeForm.patchValue({
            descriptionFormModified: true
          })
        }
      }
      if (newDescriptionTranslation) { this.descriptionTranslations.set(this.idFictitiousCounter, newDescriptionTranslation) }
      else {
        if (this.treeNodeForm.value.name && this.treeNodeForm.value.name != this.currentNodeName) {
          this.treeNodeForm.patchValue({
            nameFormModified: true
          })
        }
      }

      this.idFictitiousCounter--;
      this.createNodeEvent.next(this.treeNodeForm.value);
    }
    else {
      if (newNameTranslation) { this.nameTranslations.set(this.treeNodeForm.value.id, newNameTranslation) }
      else {
        if (this.treeNodeForm.value.description && this.treeNodeForm.value.description != this.currentNodeDescription) {
          this.treeNodeForm.patchValue({
            descriptionFormModified: true
          })
        }
      }
      if (newDescriptionTranslation) { this.descriptionTranslations.set(this.treeNodeForm.value.id, newDescriptionTranslation) }
      else {
        if (this.treeNodeForm.value.name && this.treeNodeForm.value.name != this.currentNodeName) {
          this.treeNodeForm.patchValue({
            nameFormModified: true
          })
        }
      }
      this.updateNode()
    }

    this.newElement = false;
    this.currentNodeIsFolder = undefined;
    this.treeNodeForm.reset();
  }

    // ******** Applications ******** //

    getAllApplications = (): Observable<any> => {

      if (this.treeID == -1 && this.duplicateID == -1) {
        const aux: Array<any> = [];
        return of(aux);
      }
  
      var urlReq = `${this.treeToEdit._links.availableApplications.href}`
      if (this.treeToEdit._links.availableApplications.templated) {
        var url = new URL(urlReq.split("{")[0]);
        url.searchParams.append("projection", "view")
        urlReq = url.toString();
      }

  
      return (this.http.get(urlReq))
        .pipe(map(data => data['_embedded']['applications']));
  
  
    }
  
    getAllRowsApplication(event) {
      if (event.event == "save") {
        this.saveApplications(event.data);
      }
    }


  saveApplications(data: any[]) {
    let dataChanged = false;
    let applicationsToPut = [];
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
        let url = this.treeToEdit._links.availableApplications.href.split('{', 1)[0];
        this.utils.updateUriList(url, applicationsToPut, this.dataUpdatedEventApplication)
      }
      else {
        this.dataUpdatedEventApplication.next(true);
      }
    });

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


}

