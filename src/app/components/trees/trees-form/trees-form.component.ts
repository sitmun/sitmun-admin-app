import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TreeService, TreeNodeService, Translation, TranslationService, 
  CartographyService, Tree, TreeNode, Cartography, ServiceService, CapabilitiesService, ApplicationService } from '../../../frontend-core/src/lib/public_api';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { config } from 'src/config';
import { Observable, of, Subject } from 'rxjs';
import { DialogGridComponent, DialogMessageComponent } from '../../../frontend-gui/src/lib/public_api';
import { MatDialog } from '@angular/material/dialog';
import { isArray } from 'rxjs/internal-compatibility';



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
  treeForm: FormGroup;
  treeNodeForm: FormGroup;
  idFictitiousCounter = -1;
  treeToEdit: Tree;
  dataLoaded: Boolean = false;
  currentNodeIsFolder: Boolean;
  currentNodeName: string;
  currentNodeDescription: string;
  newElement: Boolean = false;
  duplicateToDo = false;
  sendNodeUpdated: Subject<any> = new Subject<any>();
  getAllElementsNodes: Subject<string> = new Subject<string>();
  refreshTreeEvent: Subject<boolean> = new Subject<boolean>();
  createNodeEvent: Subject<boolean> = new Subject<boolean>();
  getAllElementsEventCartographies: Subject<boolean> = new Subject<boolean>();
  columnDefsCartographies: any[];
  columnDefsServices: any[];

  filterOptions = [{value:'UNDEFINED', description: 'UNDEFINED'}, {value:true, description: 'YES'},{value:false, description: 'NO'}]
  

  servicesList = [];
  layersList = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private treeService: TreeService,
    private treeNodeService: TreeNodeService,
    private translationService: TranslationService,
    private cartographyService: CartographyService,
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
              image: this.treeToEdit.image,
              _links: this.treeToEdit._links
            });

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
    this.treeForm = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, []),
      image: new FormControl(null, []),
      _links: new FormControl(null, [])
    })
  }

  initializeTreesNodeForm(): void {
    this.treeNodeForm = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl(null, [Validators.required]),
      tooltip: new FormControl(null, []),
      cartography: new FormControl(null, []),
      radio: new FormControl(null, []),
      datasetURL: new FormControl(null, []),
      metadataURL: new FormControl(null, []),
      description: new FormControl(null, []),
      active: new FormControl(true, []),
      _links: new FormControl(null, []),
      children: new FormControl(null, []),
      parent: new FormControl(null, []),
      isFolder: new FormControl(null, []),
      type: new FormControl(null, []),
      order: new FormControl(null, []),
      filterGetFeatureInfo: new FormControl("UNDEFINED", []),
      filterGetMap: new FormControl("UNDEFINED", []),
      filterSelectable: new FormControl("UNDEFINED", []),
      nameTranslations: new FormControl(null, []),
      descriptionTranslations: new FormControl(null, []),
      nameTranslationsModified: new FormControl(null, []),
      descriptionTranslationsModified: new FormControl(null, []),
      nameFormModified: new FormControl(null, []),
      descriptionFormModified: new FormControl(null, []),
      status: new FormControl(null, []),
      cartographyName: new FormControl(null, []),
      cartographyId: new FormControl(null, []),
      cartographyStyles: new FormControl(null, []),
      oldCartography: new FormControl(null, []),
      style: new FormControl(null, []),
      

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
      return (this.http.get(urlReq))
        .pipe(map(data => data['_embedded']['tree-nodes']));
    }
  }

  nodeReceived(node) {
    console.log(node);
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
    })

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
    this.currentNodeIsFolder = false
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
    this.currentNodeIsFolder = true
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




  onSaveButtonClicked() {
    if (this.treeForm.valid) {
      this.getAllElementsNodes.next("save");
    }
    else {
      this.utils.showRequiredFieldsError();
    }
  }

  updateNode() {
    this.sendNodeUpdated.next(this.treeNodeForm.value)
  }

  onSaveFormButtonClicked() {
    if (this.treeNodeForm.valid) {
      if (!this.currentNodeIsFolder) { this.getAllElementsEventCartographies.next(this.treeNodeForm.value) }
      else { this.updateTreeLeft(null) }
    }
    else {
      this.utils.showRequiredFieldsError();
    }

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
        treeNodeObj.tooltip = tree.tooltip;
        treeNodeObj.order = tree.order;
        treeNodeObj.active = tree.active;
        treeNodeObj.datasetURL = tree.datasetURL;
        treeNodeObj.metadataURL = tree.metadataURL;
        treeNodeObj.description = tree.description;
        treeNodeObj.tree = this.treeToEdit;
        treeNodeObj.filterGetFeatureInfo = tree.filterGetFeatureInfo;
        treeNodeObj.filterGetMap = tree.filterGetMap;
        treeNodeObj.filterSelectable = tree.filterSelectable;
        treeNodeObj.style = tree.style;



        if (tree.status === "pendingCreation" && tree._links && !tree.isFolder && !tree.cartography) {

          let urlReqCartography = `${tree._links.cartography.href}`
          if (tree._links.cartography.href) {
            let url = new URL(urlReqCartography.split("{")[0]);
            url.searchParams.append("projection", "view")
            urlReqCartography = url.toString();
          }
          tree.cartography = await this.http.get(urlReqCartography).toPromise();

        }
        else {
          if (tree.status !== "pendingCreation") { treeNodeObj._links = tree._links; }

        }
        treeNodeObj.cartography = tree.cartography;


        if (tree.status !== "pendingDelete") {

          let currentParent;
          if (tree.parent !== null) {
            if (tree.parent >= 0) {
              currentParent = treesToUpdate.find(element => element.id === tree.parent)
              currentParent.tree = this.treeToEdit;
            }
            else {
              if (newId == null) {
                if (mapNewIdentificators.has(tree.parent)) { mapNewIdentificators.get(tree.parent).push(tree) }
                else {
                  mapNewIdentificators.set(tree.parent, [tree])
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

      console.log(urlReq);
  
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
          if (application.newItem) { dataChanged = true; }
          promises.push(new Promise((resolve, reject) => { this.applicationService.update(application).subscribe((resp) => { resolve(true) }) }));
        }
        else if (application.status === 'pendingCreation') {
          dataChanged = true;
        }
        applicationsToPut.push(application._links.self.href)
      }
      else { dataChanged = true }
    });


    Promise.all(promises).then(() => {
      if (dataChanged) {
        let url = this.treeToEdit._links.availableApplications.href.split('{', 1)[0];
        this.utils.updateUriList(url, applicationsToPut, this.dataUpdatedEventApplication)
      }
      else { this.dataUpdatedEventApplication.next(true); }
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

