import {ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatDialog} from '@angular/material/dialog';
import {MatAccordion} from '@angular/material/expansion';
import {MatTabChangeEvent} from '@angular/material/tabs';

import {TranslateService} from '@ngx-translate/core';
import {XMLParser} from 'fast-xml-parser';
import {firstValueFrom, Observable, of, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

import {HalOptions, HalParam} from '@app/core';
import {ResourceHelper} from '@app/core/hal/resource/resource-helper';
import {
  CapabilitiesService,
  CartographyProjection,
  CartographyService,
  CartographyStyle,
  CodeList,
  CodeListService,
  ServiceService,
  TaskProjection,
  TaskService,
  Translation,
  TranslationService,
  Tree,
  TreeNode,
  TreeNodeProjection,
  TreeNodeService
} from '@app/domain';
import {openDialogGridWithPreload} from '@app/frontend-gui/src/lib/dialog-grid/dialog-grid.component';
import {
  DataTreeComponent,
  DialogFormComponent,
  DialogMessageComponent,
  FileNode
} from '@app/frontend-gui/src/lib/public_api';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {Configuration} from '@app/core/config/configuration';
import {config} from '@config';
import {constants} from '@environments/constants';


/**
 * Component for managing tree nodes associated with a tree entity.
 * Handles displaying, creating, editing, and saving tree nodes.
 */
@Component({
    selector: 'app-tree-nodes',
    templateUrl: './tree-nodes.component.html',
    styleUrls: ['./tree-nodes.component.scss'],
    standalone: false
})
export class TreeNodesComponent implements OnInit, OnDestroy {
  @Input() tree: Tree;
  @Input() entityID = -1;
  @Input() duplicateID = -1;
  @Input() dataLoaded = false;
  @Input() currentTreeType: string;
  @Input() loadDataButton$: Observable<boolean> = of(true);

  @Output() saveRequested: EventEmitter<TreeNode[]> = new EventEmitter<TreeNode[]>();

  treeNodeForm: UntypedFormGroup;
  public fieldsConfigForm: UntypedFormGroup;
  idFictitiousCounter = -1;
  /** Computed: whether current node type can have children (derived from config). */
  get currentNodeIsFolder(): boolean {
    return canNodeTypeHaveChildren(this.currentTreeType, this.currentNodeType);
  }
  /** True when a node is selected for edit or we are creating a new node. */
  get hasNodeSelection(): boolean {
    return this.currentNodeId != null || this.newElement;
  }
  currentNodeName: string;
  currentNodeDescription: string;
  currentNodeType: string;
  currentNodeHasParent: boolean;
  currentParentNodeName: string;
  currentViewMode: string;
  currentNodeTask: any;
  currentNodeCartography: any;
  availableNodeTypes: CodeList[] = []; // Cache for available node types
  fieldsConfigTreeGenerated = false;
  
  // Cartography autocomplete properties
  filteredCartographies: any[] = [];
  allCartographies: any[] = [];
  cartographiesLoaded = false;
  cartographiesLoading = false;
  
  // Task autocomplete properties
  filteredTasks: any[] = [];
  allTasks: any[] = [];
  tasksLoaded = false;
  tasksLoading = false;
  
  // Style dropdown properties
  availableStyles: CartographyStyle[] = [];
  defaultStyleSentinel = 'null'; // Sentinel value for null/default style (only used when no default style exists)
  currentCartographyStyles: CartographyStyle[] = [];
  hasDefaultStyle = false;
  selectedXPath: string;
  newElement = false;
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
  @ViewChild('fieldsConfigDialog', {
    static: true
  }) private fieldsConfigDialog: TemplateRef<any>;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  
  // Track current node ID for panel state management
  currentNodeId: number | null = null;
  /** True when the folder being edited has children (type cannot be changed to cartography). */
  currentFolderHasChildren = false;
  
  // Per-node expansion state storage
  private nodeExpansionStates: Map<number, Set<string>> = new Map();
  private allPanelIds = ['basic-info', 'description-metadata', 'cartography-config',
    'filters', 'appearance', 'task-config', 'display-options'];
  /** Only basic-info expanded by default in the detail. */
  private defaultExpandedPanelIds = ['basic-info'] as const;

  filterOptions = [{value: 'UNDEFINED', description: 'UNDEFINED'}, {value: true, description: 'YES'}, {value: false, description: 'NO'}];
  codeValues = constants.codeValue;
  defaultLang = config.defaultLang;
  servicesList = [];
  layersList = [];
  nodeInputsControls = [];
  nodeNamespacesControls = [];
  noNamespaces = true;
  parsedData = {
    data: {},
    dataType: 'json'
  };
  nodeOutputsControls = constants.nodeMapping.nodeOutputControls;
  mappingAppOptions = constants.nodeMapping.appOptions;
  mappingbtnLabelOptions = constants.nodeMapping.btnlabelOptions;
  mappingParentTaskOptions = [];
  namespaces = [];
  /** Map of code list names with their associated values */
  private readonly codelists: Map<string, CodeList[]> = new Map();
  /** Flag to track if code lists have been initialized */
  private codeListsInitialized = false;
  savingNode = false;
  nameTranslations: Map<number, Map<string, Translation>> = new Map<number, Map<string, Translation>>();
  descriptionTranslations: Map<number, Map<string, Translation>> = new Map<number, Map<string, Translation>>();

  // Resizable layout properties
  treePanelWidth = 45; // Percentage
  isResizing = false;
  minTreeWidth = 20; // Minimum width percentage
  maxTreeWidth = 70; // Maximum width percentage

  constructor(
    private treeNodeService: TreeNodeService,
    private translationService: TranslationService,
    private codeListService: CodeListService,
    private cartographyService: CartographyService,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    public utils: UtilsService,
    public dialog: MatDialog,
    public serviceService: ServiceService,
    public capabilitiesService: CapabilitiesService,
    private loggerService: LoggerService,
    private translateService: TranslateService,
    private loadingService: LoadingOverlayService
  ) {
    this.initializeTreesNodeForm();
    this.initializeFieldsConfigForm();
  }

  async ngOnInit(): Promise<void> {
    // Load saved preferences from localStorage
    if (typeof localStorage !== 'undefined') {
      const savedWidth = localStorage.getItem('treePanelWidth');
      if (savedWidth !== null) {
        this.treePanelWidth = parseFloat(savedWidth);
      }
    }

    await this.initCodeLists([
      'treenode.folder.type',
      'treenode.leaf.type',
      'treenode.viewmode'
    ]);

    this.layersList = await firstValueFrom(this.getAllCartographies());
    
    // Load and cache cartographies for autocomplete
    await this.loadCartographies();
    
    // Set up cartography autocomplete filtering
    this.treeNodeForm.get(constants.treeDomainKey.cartography)?.valueChanges.subscribe(value => {
      // Only filter if value is a string (user typing)
      // Skip if value is object (autocomplete set it)
      if (typeof value === 'string') {
        this.filterCartographies(value.toLowerCase());
      } else if (value && typeof value === 'object') {
        // Reset to show all when an object is selected
        this.filteredCartographies = [...this.allCartographies];
      }
    });

    // Load and cache tasks for autocomplete
    await this.loadTasks();

    // Set up task autocomplete filtering
    this.treeNodeForm.get(constants.treeDomainKey.task)?.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        this.filterTasks(value.toLowerCase());
      } else if (value && typeof value === 'object') {
        this.filteredTasks = [...this.allTasks];
      }
    });

    this.columnDefsServices = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('serviceEntity.name', 'name'),
      this.utils.getNonEditableColumnDef('serviceEntity.type', 'type'),
      this.utils.getEditableColumnDef('serviceEntity.serviceURL', 'serviceURL'),
      this.utils.getEditableColumnDef('serviceEntity.supportedSRS', 'supportedSRS'),
      this.utils.getDateColumnDef('serviceEntity.createdDate', 'createdDate')
    ];

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

    // Load node-level translations if editing
    if (this.isEdition() && this.tree) {
      this.translationService.getAll()
        .pipe(map((data: any[]) => data.filter(elem => elem.element == this.entityID || elem.column == config.translationColumns.treeNodeName ||
          elem.column == config.translationColumns.treeNodeDescription)
        )).subscribe(result => {
          result.forEach(translation => {
            if (translation.column == config.translationColumns.treeNodeDescription || translation.column == config.translationColumns.treeNodeName) {
              this.saveTreeNodeTranslation(translation, translation.column);
            }
          });
        });
    }

    // Subscribe to save requests
    this.getAllElementsNodes.subscribe(event => {
      if (event === "save") {
        const nodes = (this.dataTree?.dataSource?.data || []) as unknown as TreeNode[];
        this.saveRequested.emit(nodes);
      }
    });
  }

  /**
   * Handles emitAllNodes event from data tree.
   */
  receiveAllNodes(event) {
    if (event?.event == "save") {
      const nodes = (this.dataTree?.dataSource?.data || []) as unknown as TreeNode[];
      this.saveRequested.emit(nodes);
    }
  }

  /**
   * Fetches code list values from the service with appropriate parameters.
   */
  private getCodeListValues(valueList: string, notTraduction?: boolean): Observable<CodeList[]> {
    const query: HalOptions = {
      params: [
        {key: 'codeListName', value: valueList}
      ]
    };
    if (!notTraduction) {
      let codelistLangValue = config.defaultLang;
      if (localStorage.lang) {
        codelistLangValue = localStorage.lang;
      }
      const param: HalParam = {key: 'lang', value: codelistLangValue};
      query.params.push(param);
    }
    return this.codeListService.getAll(query);
  }

  /**
   * Initializes multiple code lists by fetching their values from the service.
   */
  async initCodeLists(codeList: string[]): Promise<void[]> {
    const result = await Promise.all(codeList.map(async code => {
      const list: CodeList[] = await firstValueFrom(this.getCodeListValues(code));
      this.codelists.set(code, [...list].sort((a, b) => a.description.localeCompare(b.description)));
    }));
    this.codeListsInitialized = true;
    return result;
  }

  /**
   * Gets a code list by name.
   */
  codeList(code: string): CodeList[] {
    if (!this.codelists.has(code)) {
      if (this.codeListsInitialized) {
        this.loggerService.error(`Code list ${code} not initialized`);
      }
    }
    return this.codelists.get(code) || [];
  }

  /**
   * Node types that can have children (for folder codelist). No folder/leaf distinction; both are nodes.
   */
  getAvailableFolderTypes(): CodeList[] {
    const allTypes = this.codeList('treenode.folder.type');
    if (!this.currentTreeType) return allTypes;
    const allowed = getNodeTypesForTree(this.currentTreeType).filter(nt => canNodeTypeHaveChildren(this.currentTreeType, nt));
    return allTypes.filter(type => allowed.includes(type.value));
  }

  /**
   * Node types that cannot have children (for leaf codelist). No folder/leaf distinction; both are nodes.
   */
  getAvailableLeafTypes(): CodeList[] {
    const allTypes = this.codeList('treenode.leaf.type');
    if (!this.currentTreeType) return allTypes;
    const allowed = getNodeTypesForTree(this.currentTreeType).filter(nt => !canNodeTypeHaveChildren(this.currentTreeType, nt));
    return allTypes.filter(type => allowed.includes(type.value));
  }

  /** True if this node type cannot have children. */
  isNodeTypeALeaf(nodeType: string | null): boolean {
    return !canNodeTypeHaveChildren(this.currentTreeType, nodeType);
  }

  /** Allowed child node types for a given parent type. */
  getAllowedChildrenForParent(parentNodeType: string | null): string[] {
    if (!parentNodeType || !this.currentTreeType) return [];
    return getAllowedChildrenForNodeType(this.currentTreeType, parentNodeType);
  }

  /**
   * Allowed node types for a parent (null = root). Used by data-tree to render one add button per type.
   */
  getAllowedTypesForParent(parent: FileNode | null): string[] {
    if (!parent) return getAllowedRootTypes(this.currentTreeType);
    return this.getAllowedChildrenForParent(parent.nodeType);
  }

  /**
   * Display label for a node type. Uses i18n when a key exists (e.g. entity.task.label), else codelist description.
   */
  getNodeTypeLabel(nodeType: string): string {
    if (!nodeType) return '';
    const typeKey = `treesEntity.nodeType.${nodeType}`;
    const translated = this.translateService.instant(typeKey);
    if (translated !== typeKey) return translated;
    const folderTypes = this.getAvailableFolderTypes();
    const leafTypes = this.getAvailableLeafTypes();
    const found = folderTypes.find(t => t.value === nodeType) || leafTypes.find(t => t.value === nodeType);
    return found ? found.description : nodeType;
  }

  /**
   * Checks if a node can have children based on its type.
   * Returns false if the node type is classified as a leaf.
   * @param nodeType The node type to check
   * @returns true if the node can have children, false otherwise
   */
  canNodeHaveChildren(nodeType: string | null): boolean {
    // Handle null/undefined - default to allowing children (will be fixed by validation)
    if (!nodeType) {
      return true;
    }
    // Check if this node type is a leaf (cannot have children)
    return !this.isNodeTypeALeaf(nodeType);
  }

  /**
   * Get available node types based on whether the node can have children.
   * Returns folder types if currentNodeIsFolder is true, otherwise returns leaf types.
   * This method updates the cached availableNodeTypes array.
   */
  getAvailableNodeTypes(): CodeList[] {
    if (this.currentNodeIsFolder) {
      this.availableNodeTypes = this.getAvailableFolderTypes();
    } else {
      this.availableNodeTypes = this.getAvailableLeafTypes();
    }
    return this.availableNodeTypes;
  }


  /**
   * Effective node type for behavior/UI. Folder is the container type (replacement for cartography as container).
   */
  getEffectiveNodeType(): string {
    return this.currentNodeType ?? (this.currentNodeIsFolder
      ? constants.treeRenderType.folder
      : constants.treeDomainKey.cartography);
  }

  /** True when config enables metadata fields (tooltip, metadataURL, datasetURL) in description panel. */
  get isContainerFolderType(): boolean {
    return !!this.treeNodeForm?.get('nodeType')?.value &&
      getNodePanelConfig(this.currentTreeType, this.effectiveNodeType, 'showMetadataFieldsInDescriptionPanel');
  }

  /**
   * Getter for effective node type to use in templates.
   */
  get effectiveNodeType(): string {
    return this.getEffectiveNodeType();
  }

  /**
   * Determines if the filters panel should be displayed.
   * Config-driven; also requires at least one applicable filter on the cartography.
   */
  get showFiltersPanel(): boolean {
    if (!getNodePanelConfig(this.currentTreeType, this.effectiveNodeType, 'showFiltersPanel')) return false;
    const hasApplicableFilter = this.currentNodeCartography && (
      this.currentNodeCartography?.applyFilterToGetFeatureInfo ||
      this.currentNodeCartography?.applyFilterToGetMap ||
      this.currentNodeCartography?.applyFilterToSpatialSelection
    );
    return !!hasApplicableFilter;
  }

  /**
   * Determines if the description & metadata panel should be displayed.
   * Driven by configuration based on node type.
   */
  get showDescriptionMetadataPanel(): boolean {
    return getNodePanelConfig(this.currentTreeType, this.effectiveNodeType, 'showDescriptionPanel');
  }

  /**
   * Determines if the cartography configuration panel should be displayed.
   * Driven by configuration based on node type.
   */
  get showCartographyConfigurationPanel(): boolean {
    return !!this.treeNodeForm?.get('nodeType')?.value && 
      getNodePanelConfig(this.currentTreeType, this.effectiveNodeType, 'showCartographyPanel');
  }

  /** Parent node type of the current node (from tree data). Null if root or parent not found. */
  get currentParentNodeType(): string | null {
    const parentId = this.treeNodeForm?.get('parent')?.value;
    if (parentId == null) return null;
    const flat = this.getFlatNodesFromDataTree();
    const parent = flat.find((n: any) => n.id === parentId);
    return parent?.nodeType ?? null;
  }

  /**
   * Determines if the appearance panel should be displayed.
   * Driven by configuration based on node type (unconditional and/or when parent is in showAppearancePanelWhenParentIs).
   */
  get showAppearancePanel(): boolean {
    if (!this.treeNodeForm?.get('nodeType')?.value || !this.effectiveNodeType) return false;
    const unconditional = getNodePanelConfig(this.currentTreeType, this.effectiveNodeType, 'showAppearancePanel');
    if (unconditional) return true;
    const whenParentIs = getShowAppearancePanelWhenParentIs(this.currentTreeType, this.effectiveNodeType);
    const parentType = this.currentParentNodeType;
    return !!(whenParentIs?.length && parentType && whenParentIs.includes(parentType));
  }

  /**
   * Determines if the task configuration panel should be displayed.
   * Driven by configuration based on node type.
   */
  get showTaskConfigurationPanel(): boolean {
    return !!this.treeNodeForm?.get('nodeType')?.value && 
      getNodePanelConfig(this.currentTreeType, this.effectiveNodeType, 'showTaskPanel');
  }

  /**
   * Determines if the display options panel should be displayed.
   * Driven by configuration based on node type.
   */
  get showDisplayOptionsPanel(): boolean {
    return !!this.treeNodeForm?.get('nodeType')?.value &&
      getNodePanelConfig(this.currentTreeType, this.effectiveNodeType, 'showDisplayOptionsPanel');
  }

  /** i18n key for appearance panel field label (image vs icon), from config. */
  get appearanceFieldLabelI18nKey(): string {
    const key = getNodeTypeAppearanceLabelKey(this.currentTreeType, this.effectiveNodeType);
    return `treesEntity.${key}`;
  }

  /** True when config shows filterable checkbox and fields config in task panel. */
  get showFilterableInTaskPanel(): boolean {
    return !!this.treeNodeForm?.get('nodeType')?.value &&
      getNodePanelConfig(this.currentTreeType, this.effectiveNodeType, 'showFilterableInTaskPanel');
  }

  /** Icon for the task panel header (same as nav sidebar Task menu). */
  get taskPanelIcon(): string {
    return Configuration.TASK.icon;
  }

  /** Icon font for task panel icon (same as nav sidebar). */
  get taskPanelIconFont(): string {
    return Configuration.TASK.font;
  }

  /** True when a task is selected in the task panel (enables Field Configuration button). */
  get hasTaskSelected(): boolean {
    const value = this.treeNodeForm?.get('task')?.value;
    return value != null && (typeof value === 'object' ? (value as any).id != null : true);
  }

  /**
   * Determines if the tree is new.
   */
  isNew(): boolean {
    return this.entityID === -1 && this.duplicateID === -1;
  }

  /**
   * Determines if the tree is being edited.
   */
  isEdition(): boolean {
    return this.entityID !== -1;
  }

  /**
   * Gets all tree nodes for the tree.
   */
  getAllTreeNodes = (): Observable<TreeNodeProjection[]> => {
    if (this.isNew() || !this.tree) {
      return of([]);
    } else {
      return this.tree.getRelationArrayEx(TreeNodeProjection, 'allNodes', {
        projection: 'view'
      });
    }
  };

  /**
   * Gets nodes for validation (used by parent).
   */
  getNodesForValidation(): TreeNodeProjection[] {
    return (this.dataTree?.dataSource?.data || []) as unknown as TreeNodeProjection[];
  }

  /**
   * Requests save operation (called by parent).
   */
  requestSave(): void {
    this.getAllElementsNodes.next("save");
  }

  /**
   * Checks if there are any unsaved changes in the tree nodes.
   * A node has unsaved changes if it has any of these statuses:
   * - pendingCreation: newly created node
   * - pendingDelete: node marked for deletion
   * - Modified: existing node that was modified
   *
   * @returns True if any node has unsaved changes, false otherwise
   */
  hasUnsavedChanges(): boolean {
    if (!this.dataTree || !this.dataTree.dataSource) {
      return false;
    }

    const dataSourceData = this.dataTree.dataSource.data || [];
    const rootNode = dataSourceData[0];
    const allNodes = this.getAllTreeNodesRecursive(rootNode?.children || []);

    return allNodes.some(node => 
      node.status === constants.entityStatus.pendingCreation ||
      node.status === constants.entityStatus.pendingDelete ||
      node.status === constants.entityStatus.modified
    );
  }

  /**
   * Saves nodes after tree is saved (called by parent).
   */
  async saveNodes(tree: Tree, entityID: number): Promise<void> {
    if (!this.dataTree) {
      this.loggerService.warn('TreeNodesComponent.saveNodes - dataTree is not initialized. Nodes will not be saved.');
      return;
    }
    
    if (!this.dataTree.dataSource) {
      this.loggerService.warn('TreeNodesComponent.saveNodes - dataTree.dataSource is not initialized. Nodes will not be saved.');
      return;
    }
    
    const dataSourceData = this.dataTree.dataSource.data || [];
    // dataSource.data is an array with a single root node: [rootNode]
    // Actual tree nodes are in rootNode.children
    const rootNode = dataSourceData[0];
    const allNodes = this.getAllTreeNodesRecursive(rootNode?.children || []);
    
    this.loggerService.debug('TreeNodesComponent.saveNodes - Reading nodes from dataTree', {
      hasDataTree: !!this.dataTree,
      hasDataSource: !!this.dataTree.dataSource,
      dataSourceDataLength: dataSourceData.length,
      rootNodeId: rootNode?.id,
      rootNodeName: rootNode?.name,
      rootChildrenCount: rootNode?.children?.length || 0,
      allNodesCount: allNodes.length,
      firstNode: allNodes.length > 0 ? {
        id: allNodes[0]?.id,
        name: allNodes[0]?.name,
        nodeType: (allNodes[0] as any)?.nodeType
      } : null,
      allNodes: allNodes.map(n => ({ id: n?.id, name: n?.name }))
    });
    
    if (allNodes.length === 0) {
      this.loggerService.debug('TreeNodesComponent.saveNodes - No nodes to save');
      return;
    }
    
    await this.updateAllTreeNodes(allNodes, 0, new Map<number, TreeNodeProjection[]>(), [], null, null, tree, entityID);
    if (this.dataTree?.refreshTree) {
      await this.dataTree.refreshTree();
    } else {
      this.refreshTreeEvent.next(true);
    }
  }

  /**
   * Recursively gets all tree nodes from children array, excluding root node.
   */
  private getAllTreeNodesRecursive(children: any[]): any[] {
    const result: any[] = [];
    if (!children || children.length === 0) {
      return result;
    }
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      result.push(node);
      if (node.children && node.children.length > 0) {
        result.push(...this.getAllTreeNodesRecursive(node.children));
      }
    }
    return result;
  }

  /** Flat list of tree nodes (excluding root) from dataTree. Empty if no data. */
  private getFlatNodesFromDataTree(): any[] {
    if (!this.dataTree?.dataSource?.data?.length) return [];
    const root = this.dataTree.dataSource.data[0];
    return this.getAllTreeNodesRecursive(root?.children || []);
  }

  initializeTreesNodeForm(): void {
    this.treeNodeForm = new UntypedFormGroup({
      id: new UntypedFormControl(null, []),
      name: new UntypedFormControl(null, [Validators.required]),
      tooltip: new UntypedFormControl(null, []),
      nodeType: new UntypedFormControl(null, []), // Optional for folders, will be validated conditionally
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
      children: new UntypedFormControl(null, []),
      parent: new UntypedFormControl(null, []),
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
    });
  }

  initializeFieldsConfigForm() {
    const outputGroup = {};
    this.nodeOutputsControls.forEach(f => {
      const booleanCalculated = f.key.includes('Label');
      const defaultValue = f.key.includes('Label') ? 'Extra info' : null;
      outputGroup[f.key] = new UntypedFormGroup({
        value: new UntypedFormControl(defaultValue, []),
        calculated: new UntypedFormControl(booleanCalculated, []),
        multilanguage: new UntypedFormControl(false, [])
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

  async nodeReceived(emitedObj) {
    const node = emitedObj.nodeClicked;
    const nodeParent = emitedObj.nodeParent;
    this.newElement = false;

    const nodeType = (node.nodeType && (typeof node.nodeType !== 'string' || node.nodeType.trim() !== ''))
      ? node.nodeType
      : null;
    this.currentNodeType = nodeType;
    const currentType = this.currentNodeIsFolder ? constants.treeRenderType.folder : constants.treeRenderType.node;

    this.currentFolderHasChildren = !!(this.currentNodeIsFolder && node.children?.length);
    this.getAvailableNodeTypes();

    // Set current node ID for panel state management
    this.currentNodeId = node.id;

    this.currentNodeType = nodeType;
    
    this.mappingParentTaskOptions = this.createMappingParentTaskOptions(nodeParent);
    this.currentViewMode = node.viewMode;
    this.currentNodeHasParent = nodeParent !== null;
    let status = "Modified";
    const nameTranslationsModified = node.nameTranslationsModified ? true : false;
    const descriptionTranslationsModified = node.descriptionTranslationsModified ? true : false;
    const nameFormModified = node.nameFormModified ? true : false;
    const descriptionFormModified = node.descriptionFormModified ? true : false;
    if (node.id < 0) {
      status = "pendingCreation";
    }
    const formNodeType = nodeType ?? (this.currentNodeIsFolder
      ? (getDefaultContainerTypeFromRules(this.currentTreeType, this.getAvailableFolderTypes())
          ?? this.getAvailableFolderTypes()[0]?.value ?? constants.treeRenderType.folder)
      : (getDefaultLeafTypeFromRules(this.currentTreeType, this.getAvailableLeafTypes())
          ?? this.getAvailableLeafTypes()[0]?.value ?? constants.treeDomainKey.cartography));
    // Find cartography object from cache if cartographyId is available
    let cartographyObj = null;
    if (node.cartographyId && this.allCartographies.length > 0) {
      cartographyObj = this.allCartographies.find(c => c.id === node.cartographyId);
    }
    
    // Find task object from cache if taskId is available
    let taskObj = null;
    if (node.taskId && this.allTasks.length > 0) {
      taskObj = this.allTasks.find(t => t.id === node.taskId);
    }
    
    this.treeNodeForm.patchValue({
      id: node.id,
      name: node.name,
      tooltip: node.tooltip,
      nodeType: formNodeType,
      image: node.image,
      imageName: node.imageName,
      task: taskObj,
      taskName: node.taskName,
      taskId: node.taskId,
      oldTask: node.taskId ? this.taskService.createProxy(node.taskId) : null,
      viewMode: node.viewMode,
      filterable: node.filterable,
      order: node.order,
      cartography: cartographyObj,
      cartographyName: node.cartographyName,
      cartographyId: node.cartographyId,
      oldCartography: node.cartographyId ? this.cartographyService.createProxy(node.cartographyId) : null,
      radio: node.radio,
      description: node.description,
      datasetURL: node.datasetURL,
      metadataURL: node.metadataURL,
      active: node.active !== null && node.active !== undefined ? node.active : true,
      children: node.children,
      parent: node.parent,
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
    
    // If cartography not found in cache yet, load cartographies and then set it
    if (node.cartographyId && !cartographyObj) {
      this.loadCartographies().then(async () => {
        const loadedCartography = this.allCartographies.find(c => c.id === node.cartographyId);
        if (loadedCartography) {
          this.treeNodeForm.patchValue({
            cartography: loadedCartography,
            cartographyName: loadedCartography.name,
            cartographyId: loadedCartography.id
          });
          this.currentNodeCartography = loadedCartography;
          // Load styles for the cartography
          await this.updateAvailableStyles(loadedCartography.id);
        }
      });
    } else if (cartographyObj) {
      this.currentNodeCartography = cartographyObj;
      // Load styles for the cartography
      await this.updateAvailableStyles(cartographyObj.id);
    } else if (node.cartographyId) {
      // Cartography ID exists but not in cache - load styles directly
      await this.updateAvailableStyles(node.cartographyId);
    } else {
      // No cartography - clear styles
      await this.updateAvailableStyles(null);
    }
    
    // Convert null style to sentinel value for form display (if no default style exists)
    const currentStyle = this.treeNodeForm.get('style')?.value;
    if (!currentStyle && !this.hasDefaultStyle) {
      this.treeNodeForm.patchValue({ style: this.defaultStyleSentinel });
    } else if (currentStyle === null) {
      // If style is null and no default exists, use sentinel
      if (!this.hasDefaultStyle) {
        this.treeNodeForm.patchValue({ style: this.defaultStyleSentinel });
      }
    }
    
    // If task not found in cache yet, load tasks and then set it
    if (node.taskId && !taskObj) {
      this.loadTasks().then(() => {
        const loadedTask = this.allTasks.find(t => t.id === node.taskId);
        if (loadedTask) {
          this.treeNodeForm.patchValue({
            task: loadedTask,
            taskName: loadedTask.name,
            taskId: loadedTask.id
          });
          this.currentNodeTask = loadedTask;
        }
      });
    } else if (taskObj) {
      this.currentNodeTask = taskObj;
    }
    
    // Image preview is now handled by the ImagePreviewComponent via imageSource input
    
    // Load translations for this node if it's an existing node (has real ID) and translations aren't already loaded
    if (node.id >= 0 && (!this.nameTranslations.has(node.id) || !this.descriptionTranslations.has(node.id))) {
      await this.loadNodeTranslations(node.id);
    }
    
    if (this.nameTranslations.has(node.id)) {
      const translations = this.nameTranslations.get(node.id);
      this.treeNodeForm.patchValue({
        nameTranslations: translations
      });
    }

    if (this.descriptionTranslations.has(node.id)) {
      const translations = this.descriptionTranslations.get(node.id);
      this.treeNodeForm.patchValue({
        descriptionTranslations: translations
      });
    }
    
    // Store original values for change detection
    this.currentNodeName = node.name || '';
    this.currentNodeDescription = node.description || '';
    
    // Mark form as pristine after loading node data (so dirty state only reflects user changes)
    this.treeNodeForm.markAsPristine();
    
    // Trigger change detection to update panel visibility conditions
    this.cdr.detectChanges();
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
    this.currentNodeType = parent.nodeType
      ?? getDefaultContainerTypeFromRules(this.currentTreeType, this.getAvailableFolderTypes())
      ?? constants.treeRenderType.folder;
    
    // Set current node ID and default panel state (only basic-info expanded)
    this.currentNodeId = this.idFictitiousCounter;
    this.nodeExpansionStates.set(this.currentNodeId, new Set(this.defaultExpandedPanelIds));
    
    // Update available node types cache
    this.getAvailableNodeTypes();
    
    this.currentViewMode = '';
    this.currentNodeHasParent = parent.id !== null;
    this.currentParentNodeName = parent.name || '';
    let parentId = parent.id;
    if (parent.name === "") {
      parentId = null;
      this.currentParentNodeName = '';
    }
    this.treeNodeForm.patchValue({
      parent: parentId,
      order: null,
      children: [],
      status: "pendingCreation",
      filterGetFeatureInfo: "UNDEFINED",
      filterGetMap: "UNDEFINED",
      filterSelectable: "UNDEFINED",
      active: true
    });
    
    // Reset original values for new nodes
    this.currentNodeName = '';
    this.currentNodeDescription = '';
    
    // Trigger change detection to update panel visibility conditions
    this.cdr.detectChanges();
  }

  createFolder(parent) {
    const nodeType = parent?.nodeType
      ?? getDefaultContainerTypeFromRules(this.currentTreeType, this.getAvailableFolderTypes())
      ?? constants.treeRenderType.folder;
    this.addNodeWithType(parent ?? null, nodeType);
  }

  /**
   * Opens the form to create a new node of the given type under parent (null = root).
   * Type is chosen in the tree; form shows type as read-only.
   */
  addNodeWithType(parent: FileNode | null, nodeType: string): void {
    this.treeNodeForm.reset();
    this.newElement = true;
    this.currentNodeType = nodeType;
    this.currentFolderHasChildren = false;

    this.currentNodeId = this.idFictitiousCounter;
    this.nodeExpansionStates.set(this.currentNodeId, new Set(this.defaultExpandedPanelIds));
    this.getAvailableNodeTypes();

    this.currentViewMode = '';
    const isRoot = !parent || parent.id == null || parent.name === '';
    this.currentNodeHasParent = !isRoot;
    this.currentParentNodeName = parent && parent.name ? parent.name : '';
    const parentId = isRoot ? null : parent.id;

    this.treeNodeForm.patchValue({
      id: this.currentNodeId,
      parent: parentId,
      order: null,
      children: [],
      status: 'pendingCreation',
      nodeType,
      filterGetFeatureInfo: 'UNDEFINED',
      filterGetMap: 'UNDEFINED',
      filterSelectable: 'UNDEFINED',
      active: true
    });

    this.currentNodeName = '';
    this.currentNodeDescription = '';
    this.cdr.detectChanges();
  }

  onTreeNodeTypeChange(type) {
    // Validate that type is not empty
    if (!type || type.trim() === '') {
      return;
    }

    // Validate that the selected type matches the folder/leaf status
    const correctCodeList = this.currentNodeIsFolder 
      ? this.getAvailableFolderTypes() 
      : this.getAvailableLeafTypes();
    
    const isValidType = correctCodeList.some(codeListItem => 
      codeListItem.value === type
    );

    if (!isValidType) {
      const defaultType = this.currentNodeIsFolder
        ? (getDefaultContainerTypeFromRules(this.currentTreeType, this.getAvailableFolderTypes())
            ?? correctCodeList[0]?.value)
        : (getDefaultLeafTypeFromRules(this.currentTreeType, this.getAvailableLeafTypes())
            ?? correctCodeList[0]?.value);

      if (defaultType) {
        this.treeNodeForm.patchValue({ nodeType: defaultType });
        this.currentNodeType = defaultType;
      }
      this.cdr.detectChanges();
      return;
    }

    this.currentNodeType = type;
    this.updateNode();
    this.cdr.detectChanges();
  }

  /**
   * Extracts the maxLength value from a form control's validator.
   * 
   * @param property - The form control property name
   * @returns The maxLength value, or 4000 as default fallback
   * @private
   */
  private getMaxLengthForProperty(property: string): number {
    const control = this.treeNodeForm?.get(property);
    if (!control) {
      return 4000; // Default fallback
    }
    
    // Extract from maxLength validator
    const validator = control.validator;
    if (validator) {
      const errors = validator(new FormControl({ length: Infinity }));
      if (errors?.['maxlength']) {
        return errors['maxlength']['requiredLength'];
      }
    }
    
    // Fallback: check HTML attribute (for tree-nodes, we know name=80, description=250)
    if (property === 'name') {
      return 80;
    } else if (property === 'description') {
      return 250;
    }
    
    return 4000; // Default fallback
  }

  /**
   * Determines if a form field uses textarea or input by inspecting the DOM.
   * This is a non-heuristic approach that checks the actual rendered element.
   * 
   * @param property - The form control property name
   * @returns true if the field uses textarea, false if it uses input (or not found)
   * @private
   */
  private getUseTextareaForProperty(property: string): boolean {
    // Query the DOM to find the actual form field element
    const formFieldElement = document.querySelector(
      `[formControlName="${property}"]`
    )?.closest('mat-form-field');
    
    if (!formFieldElement) {
      return false; // Default to input if element not found
    }
    
    // Check if the element inside mat-form-field is a textarea
    const inputElement = formFieldElement.querySelector('textarea, input');
    return inputElement?.tagName === 'TEXTAREA';
  }

  async onTreeNodeNameTranslationButtonClicked() {
    const nodeId = this.treeNodeForm.get('id')?.value;
    
    // Load translations if this is an existing node and translations aren't loaded yet
    if (nodeId >= 0 && !this.nameTranslations.has(nodeId)) {
      await this.loadNodeTranslations(nodeId);
      // Update form with loaded translations
      if (this.nameTranslations.has(nodeId)) {
        this.treeNodeForm.patchValue({
          nameTranslations: this.nameTranslations.get(nodeId)
        });
      }
    }
    
    let dialogResult = null;
    const maxLength = this.getMaxLengthForProperty('name');
    const useTextarea = this.getUseTextareaForProperty('name');
    const defaultLanguageValue = this.treeNodeForm.get('name')?.value || '';
    // Ensure translationsMap is always a Map (create empty one if null/undefined)
    const translationsMap = this.treeNodeForm.value.nameTranslations || this.utils.createTranslationsList(config.translationColumns.treeNodeName);
    dialogResult = await this.utils.openTranslationDialog(
      translationsMap,
      defaultLanguageValue,
      maxLength,
      useTextarea
    );
    if (dialogResult && dialogResult.event == "Accept") {
      this.treeNodeForm.patchValue({
        nameTranslations: dialogResult.data,
        nameTranslationsModified: true
      });
    }
  }

  async onTreeNodeDescriptionTranslationButtonClicked() {
    const nodeId = this.treeNodeForm.get('id')?.value;
    
    // Load translations if this is an existing node and translations aren't loaded yet
    if (nodeId >= 0 && !this.descriptionTranslations.has(nodeId)) {
      await this.loadNodeTranslations(nodeId);
      // Update form with loaded translations
      if (this.descriptionTranslations.has(nodeId)) {
        this.treeNodeForm.patchValue({
          descriptionTranslations: this.descriptionTranslations.get(nodeId)
        });
      }
    }
    
    let dialogResult = null;
    const maxLength = this.getMaxLengthForProperty('description');
    const useTextarea = this.getUseTextareaForProperty('description');
    const defaultLanguageValue = this.treeNodeForm.get('description')?.value || '';
    // Ensure translationsMap is always a Map (create empty one if null/undefined)
    const translationsMap = this.treeNodeForm.value.descriptionTranslations || this.utils.createTranslationsList(config.translationColumns.treeNodeDescription);
    dialogResult = await this.utils.openTranslationDialog(
      translationsMap,
      defaultLanguageValue,
      maxLength,
      useTextarea
    );
    if (dialogResult && dialogResult.event == "Accept") {
      this.treeNodeForm.patchValue({
        descriptionTranslations: dialogResult.data,
        descriptionTranslationsModified: true
      });
    }
  }

  getAllCartographies = (): Observable<any> => {
    return this.cartographyService.getAll();
  };

  getAllTasks = (): Observable<any> => {
    return this.taskService.getAll();
  };

  getAllServices = (): Observable<any> => {
    return this.serviceService.getAll().pipe(
      map((resp) => {
        const wmsServices = [];
        resp.forEach(service => {
          if (service.type === 'WMS') {
            wmsServices.push(service);
          }
        });
        return wmsServices;
      })
    );
  };

  async loadGroupLayersButtonClicked(data) {
    const dialogRef = await openDialogGridWithPreload(
      this.dialog,
      this.loadingService,
      {
        panelClass: 'gridDialogs',
        data: {
          orderTable: ['name'],
          getAllsTable: [this.getAllServices],
          singleSelectionTable: [true],
          columnDefsTable: [this.columnDefsServices],
          title: this.utils.getTranslate('treesEntity.services'),
          titlesTable: [''],
          nonEditable: false,
          currentData: []
        }
      }
    );

    let url, service;

    const dialogResult = await firstValueFrom(dialogRef.afterClosed());
    if (dialogResult) {
      if (dialogResult.event === 'Add' && dialogResult.data && dialogResult.data[0].length > 0) {
        service = dialogResult.data[0][0];
        url = service.serviceURL;
        if (url) {
          if (!url.includes(config.capabilitiesRequest.simpleRequest)) {
            if (url[url.length - 1] != '?') {
              url += "?";
            }
            url += config.capabilitiesRequest.requestWithWMS;
          }

          const capabilitiesResult = await firstValueFrom(this.capabilitiesService.getInfo(url));
          if (capabilitiesResult.success) {
            const groupLayersResult = this.changeServiceDataByCapabilities(capabilitiesResult.asJson);
            this.createNodesWithCapabilities(groupLayersResult, data, null);
          }
        }
      }
    }
  }

  private createNodesWithCapabilities(groupLayersResult: Array<any>, existingNodes: Array<any>, parentId?) {
    groupLayersResult.forEach(element => {
      let newNode: any = {};
      let name = element.Title;
      if (name && name.length > 250) {
        name = name.substring(0, 249);
      }
      const disallowNodeCreation = existingNodes.some(element => element.name == name);
      if (!disallowNodeCreation) {
        if (element.Layer) {
          newNode = this.createNewFolderWithCapabilities(element);
        } else {
          newNode = this.createNewNodeWithCapabilities(element);
        }

        if (newNode) {
          newNode.name = name;
          newNode.tooltip = name;
          newNode.type = constants.treeRenderType.folder;
          newNode.parent = parentId;
          newNode.id = this.idFictitiousCounter;
          newNode.children = [];
          newNode.order = null;
          newNode.status = "pendingCreation";
          this.idFictitiousCounter--;
          this.createNodeEvent.next(newNode);

          let childrenLayers = element.Layer;
          if (childrenLayers) {
            if (!Array.isArray(childrenLayers)) {
              childrenLayers = [element.Layer];
            }
          }

          if (childrenLayers) {
            this.createNodesWithCapabilities(childrenLayers, existingNodes, newNode.id);
          }
        }
      }
    });
  }

  private createNewFolderWithCapabilities(capability) {
    const newFolder: any = {};
    newFolder.description = capability.Abstract;
    newFolder.radio = false;

    if (newFolder.description && newFolder.description.length > 250) {
      newFolder.description = newFolder.description.substring(0, 249);
    }

    if (capability.MetadataURL != undefined) {
      const metadataURL = Array.isArray(capability.MetadataURL) ? capability.MetadataURL[0] : capability.MetadataURL;
      newFolder.metadataURL = metadataURL.OnlineResource['xlink:href'];
    }

    if (capability.DataURL != undefined) {
      const DataURL = Array.isArray(capability.DataURL) ? capability.DataURL[0] : capability.DataURL;
      newFolder.datasetURL = DataURL.OnlineResource['xlink:href'];
    }

    return newFolder;
  }

  private createNewNodeWithCapabilities(capability) {
    const newNode: any = {};

    let layersLyr;
    if (Array.isArray(capability.Name)) {
      layersLyr = capability.Name;
    } else {
      if (!isNaN(capability.Name)) {
        capability.Name = capability.Name.toString();
      }
      layersLyr = capability.Name.split(",");
    }

    if (!layersLyr) {
      return null;
    }
    const cartography = this.layersList.find(element => element.layers.join() == layersLyr.join());
    if (!cartography) {
      return null;
    }

    newNode.cartography = cartography;
    newNode.cartographyName = cartography.name;
    newNode.active = true;
    return newNode;
  }

  changeServiceDataByCapabilities(serviceCapabilitiesData, _refresh?): Array<any> {
    const capabilitiesLayers = [];
    const data = serviceCapabilitiesData.WMT_MS_Capabilities != undefined ? serviceCapabilitiesData.WMT_MS_Capabilities : serviceCapabilitiesData.WMS_Capabilities;
    if (data != undefined) {
      let capability = data.Capability.Layer;
      while (capability.Layer != null && capability.Layer != undefined) {
        capability = capability.Layer;
      }
      capabilitiesLayers.push(...capability);
    }
    return capabilitiesLayers;
  }

  activeImageNameInput(formtype, input) {
    const form = this.getFormByType(formtype);
    form.patchValue({
      image: null,
      imageName: null,
    });
    input.readOnly = false;
    input.focus();
  }

  removeImage(formtype) {
    const form = this.getFormByType(formtype);
    form.patchValue({
      image: null,
      imageName: null,
    });
  }

  onImageChange(formtype, event) {
    const input = event.target;
    if (!input.readOnly) {
      const form = this.getFormByType(formtype);
      form.patchValue({
        image: input.value
      });
    }
  }

  onImageSelected(formtype, event) {
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      if (!file.type.startsWith('image/')) {
        return;
      }
      const form = this.getFormByType(formtype);
      const reader = new FileReader();
      reader.onload = () => {
        form.patchValue({
          image: reader.result,
          imageName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  }

  // Image preview and download functionality is now handled by ImagePreviewComponent

  async openFieldsConfigDialog() {
    this.namespaces = [];
    const origMapping = this.treeNodeForm.getRawValue().mapping;
    let formValues = {
      output: {},
      input: {},
      namespaces: {},
    };
    if (origMapping) {
      // Deep clone to avoid mutating original data
      formValues = JSON.parse(JSON.stringify(origMapping));
      
      Object.entries(formValues.output).forEach(([clave, valor]: [string, any]) => {
        if (clave.includes('Label')) {
          valor.calculated = true;
        } else if (valor.calculated === null) {
          valor.calculated = false;
        }
      });
      this.unParseNamespaces(formValues);
      // Convert null values to empty strings for mat-select compatibility
      if (formValues.input) {
        Object.keys(formValues.input).forEach(key => {
          if (formValues.input[key] && formValues.input[key].value === null) {
            formValues.input[key].value = '';
          }
        });
      }
    }
    await this.addTaskInput();
    this.addNamespacesControl(formValues);
    this.fieldsConfigForm.patchValue({viewMode: this.currentViewMode});
    this.fieldsConfigForm.get('output')?.patchValue(formValues.output);
    this.fieldsConfigForm.get('input')?.patchValue(formValues.input);
    this.fieldsConfigForm.get('namespaces')?.patchValue(formValues.namespaces);

    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived = this.fieldsConfigDialog;
    dialogRef.componentInstance.title = this.utils.getTranslate('treesEntity.fieldsConfig');
    dialogRef.componentInstance.form = this.fieldsConfigForm;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          const mapping = this.getMappingByViewMode();
          this.treeNodeForm.patchValue({
            mapping
          });
          this.treeNodeForm.markAsDirty();
        }
      }
      this.fieldsConfigTreeGenerated = false;
      this.fieldsConfigForm.reset();
      this.clearTaskInputFormControls();
      this.clearNamespacesFormControls();
    });
  }

  async addTaskInput() {
    this.getAllElementsEventTasks.next(this.treeNodeForm.value);
    let task = null;
    if (this.currentNodeTask && this.currentNodeTask.id !== this.treeNodeForm.value.taskId) {
      task = this.currentNodeTask;
    } else {
      task = await firstValueFrom(this.taskService.get(this.treeNodeForm.value.taskId));
    }
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
          value: new UntypedFormControl('', []),
          calculated: new UntypedFormControl(false, [])
        });
        inputFormGroup.addControl(String(control.name), newGroup);
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
    const mapping = {
      output: {},
      input: {},
      namespaces: this.parseNamespaces(item.namespaces)
    };
    
    // Convert empty strings back to null for input values
    if (item.input) {
      Object.keys(item.input).forEach(key => {
        mapping.input[key] = {
          value: item.input[key].value === '' ? null : item.input[key].value,
          calculated: item.input[key].calculated
        };
      });
    }
    
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
    let form = this.treeNodeForm;
    if (formtype === constants.treeRenderType.node) {
      form = this.treeNodeForm;
    }
    return form;
  }

  updateNode() {
    const formValue = this.treeNodeForm.value;
    const nodeUpdate = {
      ...formValue,
      nodeType: formValue.nodeType
    };
    // Only push to tree when the user has actually changed the form; avoids tree showing "Modified" when e.g. opening the mapping dialog
    if (!this.treeNodeForm.dirty) {
      return;
    }
    this.loggerService.debug('TreeNodesComponent.updateNode - Sending node update', {
      nodeId: nodeUpdate.id,
      nodeName: nodeUpdate.name,
      nodeType: nodeUpdate.nodeType,
      formValue: formValue
    });
    this.sendNodeUpdated.next(nodeUpdate);
  }

  async onSaveFormButtonClicked() {
    if (this.treeNodeForm.valid) {
      if (!this.currentNodeIsFolder) {
        this.savingNode = true;
        const effectiveType = this.getEffectiveNodeType();
        if (effectiveType === constants.treeDomainKey.task
          || this.currentTreeType === this.codeValues.treeType.edition) {
          const taskId = this.treeNodeForm.get('taskId').value;
          this.currentNodeTask = taskId ? await firstValueFrom(this.taskService.get(taskId)) : null;
          this.getAllElementsEventTasks.next(this.treeNodeForm.value);
        }
        if ([constants.treeDomainKey.cartography, constants.treeDomainKey.task].includes(effectiveType)) {
          const cartographyId = this.treeNodeForm.get('cartographyId').value;
          this.currentNodeCartography = cartographyId ? await firstValueFrom(this.cartographyService.get(cartographyId)) : cartographyId;
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

  /**
   * Calculate the depth of a node in the tree structure by counting ancestors
   * Returns the maximum depth (how many levels deep this node is)
   */
  private calculateNodeDepth(node: any, allNodes: any[]): number {
    if (!node.parent || node.parent === null || node.parent < 0) {
      return 0; // Root level or new node without parent
    }
    const parent = allNodes.find(n => n.id === node.parent);
    if (!parent) {
      return 0; // Parent not found (might be root or already deleted)
    }
    // Recursively calculate parent depth and add 1
    return 1 + this.calculateNodeDepth(parent, allNodes);
  }

  async updateAllTreeNodes(
    treesNodesToUpdate: any[],
    depth: number,
    mapNewIdentificators: Map<number, TreeNodeProjection[]>,
    promises: Promise<any>[],
    newId: number | null,
    newParent: TreeNode | null,
    tree: Tree,
    entityID: number
  ) {
    // Separate deletions from updates/creates
    const nodesToDelete: any[] = [];
    const nodesToUpdateOrCreate: any[] = [];

    for (let i = 0; i < treesNodesToUpdate.length; i++) {
      const treeNode = treesNodesToUpdate[i];
      if (treeNode.status === "pendingDelete" && treeNode.id >= 0) {
        nodesToDelete.push(treeNode);
      } else if (treeNode.status) {
        nodesToUpdateOrCreate.push(treeNode);
      }
    }

    // Sort deletions by depth (deepest first) to ensure children are deleted before parents
    nodesToDelete.sort((a, b) => {
      const depthA = this.calculateNodeDepth(a, treesNodesToUpdate);
      const depthB = this.calculateNodeDepth(b, treesNodesToUpdate);
      return depthB - depthA; // Descending order (deepest first)
    });

    // Process updates and creates first
    for (let i = 0; i < nodesToUpdateOrCreate.length; i++) {
      const treeNode = nodesToUpdateOrCreate[i];

      this.loggerService.debug('TreeNodesComponent.updateAllTreeNodes - Processing node', {
        index: i,
        nodeId: treeNode.id,
        nodeName: treeNode.name,
        nodeType: treeNode.nodeType,
        status: treeNode.status,
        hasName: !!treeNode.name
      });
      const treeNodeObj: TreeNode = new TreeNode();

      // For new entities, don't send the fictitious ID to the backend
      // The backend will generate a real ID on creation
      if (treeNode.status === "pendingCreation" && !ResourceHelper.canBeUpdated(treeNode)) {
        treeNodeObj.id = null;
      } else {
        treeNodeObj.id = treeNode.id;
      }
      treeNodeObj.name = treeNode.name;
      treeNodeObj.type = treeNode.nodeType;
      treeNodeObj.tooltip = treeNode.tooltip;
      treeNodeObj.order = treeNode.order;
      treeNodeObj.active = treeNode.active;
      treeNodeObj.radio = treeNode.radio;
      treeNodeObj.datasetURL = treeNode.datasetURL;
      treeNodeObj.metadataURL = treeNode.metadataURL;
      treeNodeObj.description = treeNode.description;
      treeNodeObj.tree = tree;
      treeNodeObj.filterGetFeatureInfo = treeNode.filterGetFeatureInfo == "UNDEFINED" ? null : treeNode.filterGetFeatureInfo;
      treeNodeObj.filterGetMap = treeNode.filterGetMap == "UNDEFINED" ? null : treeNode.filterGetMap;
      treeNodeObj.filterSelectable = treeNode.filterSelectable == "UNDEFINED" ? null : treeNode.filterSelectable;
      // Convert sentinel value back to null before saving
      if (treeNode.style === this.defaultStyleSentinel) {
        treeNodeObj.style = null;
      } else {
        treeNodeObj.style = treeNode.style;
      }
      treeNodeObj.image = treeNode.image;
      treeNodeObj.imageName = treeNode.imageName;
      treeNodeObj.viewMode = treeNode.viewMode;
      treeNodeObj.filterable = treeNode.filterable;
      treeNodeObj.mapping = treeNode.mapping;

      if (treeNode.status === "pendingCreation"
          && ResourceHelper.canBeUpdated(treeNode)
          && !canNodeTypeHaveChildren(this.currentTreeType, treeNode.nodeType)
          && (!treeNode.cartographyId || !treeNode.taskId)) {
        const cartographyProjection = await firstValueFrom(
          treeNode.getRelationEx(CartographyProjection, constants.treeDomainKey.cartography, {projection: 'view'})
        ) as CartographyProjection | null;
        const taskProjection = await firstValueFrom(
          treeNode.getRelationEx(TaskProjection, constants.treeDomainKey.task, {projection: 'view'})
        ) as TaskProjection | null;
        treeNodeObj.cartography = cartographyProjection ? this.cartographyService.createProxy(cartographyProjection.id) : null;
        treeNodeObj.task = taskProjection ? this.taskService.createProxy(taskProjection.id) : null;
      } else {
        if (treeNode.cartographyId) {
          treeNodeObj.cartography = this.cartographyService.createProxy(treeNode.cartographyId);
        }
        if (treeNode.taskId) {
          treeNodeObj.task = this.taskService.createProxy(treeNode.taskId);
        }
      }

      if (treeNode.status !== "pendingDelete") {
          let currentParent;
          if (treeNode.parent !== null) {
            if (treeNode.parent >= 0) {
              currentParent = treesNodesToUpdate.find(element => element.id === treeNode.parent);
              currentParent.tree = tree;
            } else {
              if (newId == null) {
                if (mapNewIdentificators.has(treeNode.parent)) {
                  mapNewIdentificators.get(treeNode.parent).push(treeNode);
                } else {
                  mapNewIdentificators.set(treeNode.parent, [treeNode]);
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
            if (treeNode.status === "pendingCreation" && currentParent != null) {
              treeNodeObj.parent = currentParent;
            } else if (treeNode.status === "Modified" && currentParent != null) {
              treeNodeObj.parent = currentParent;
            }

            this.loggerService.debug('TreeNodesComponent.updateAllTreeNodes - Saving TreeNode', {
              nodeId: treeNodeObj.id,
              nodeName: treeNodeObj.name,
              nodeType: treeNodeObj.type,
              status: treeNode.status,
              hasSelfLink: ResourceHelper.canBeUpdated(treeNodeObj),
              treeNodeObj: {
                id: treeNodeObj.id,
                name: treeNodeObj.name,
                type: treeNodeObj.type,
                tooltip: treeNodeObj.tooltip,
                description: treeNodeObj.description
              }
            });
            promises.push(
              (async () => {
                try {
                  const result = await firstValueFrom(this.treeNodeService.save(treeNodeObj));
                  this.loggerService.debug('TreeNodesComponent.updateAllTreeNodes - TreeNode saved successfully', {
                    originalId: treeNode.id,
                    savedId: result.id,
                    savedName: result.name
                  });
                  const oldId = treeNode.id;
                  
                  // Handle name translations
                  const nameTranslationMap = this.nameTranslations.get(oldId);
                  if (nameTranslationMap) {
                    // Save translations with the new real ID
                    await this.utils.saveTranslation(result.id, nameTranslationMap, result.name, treeNode.nameTranslationsModified);
                    // Update the map to use the new real ID instead of the fictitious ID
                    this.nameTranslations.delete(oldId);
                    this.nameTranslations.set(result.id, nameTranslationMap);
                    treeNode.nameTranslationsModified = false;
                  } else if (treeNode.nameTranslationsModified || treeNode.nameFormModified) {
                    // If translations were modified but not in the map, create and save them
                    const map = this.utils.createTranslationsList(config.translationColumns.treeNodeName);
                    await this.utils.saveTranslation(result.id, map, treeNode.name, false);
                    this.nameTranslations.set(result.id, map);
                  }
                  
                  // Handle description translations
                  const descriptionTranslationMap = this.descriptionTranslations.get(oldId);
                  if (descriptionTranslationMap) {
                    // Save translations with the new real ID
                    await this.utils.saveTranslation(result.id, descriptionTranslationMap, result.description, treeNode.descriptionTranslationsModified);
                    // Update the map to use the new real ID instead of the fictitious ID
                    this.descriptionTranslations.delete(oldId);
                    this.descriptionTranslations.set(result.id, descriptionTranslationMap);
                    treeNode.descriptionTranslationsModified = false;
                  } else if (treeNode.descriptionTranslationsModified || treeNode.descriptionFormModified) {
                    // If translations were modified but not in the map, create and save them
                    const map = this.utils.createTranslationsList(config.translationColumns.treeNodeDescription);
                    await this.utils.saveTranslation(result.id, map, treeNode.description, false);
                    this.descriptionTranslations.set(result.id, map);
                  }
                  treesNodesToUpdate.splice(i, 1);
                  treesNodesToUpdate.splice(0, 0, result);
                  if (mapNewIdentificators.has(oldId)) {
                    this.updateAllTreeNodes(mapNewIdentificators.get(oldId), depth++, mapNewIdentificators, promises, result.id, result, tree, entityID);
                  }
                  return true;
                } catch (error) {
                  this.loggerService.error('Error saving tree node', error);
                  throw error;
                }
              })()
            );
          }
        }
    }

    // Process deletions after all updates/creates, in depth order (children first)
    for (const treeNode of nodesToDelete) {
      this.loggerService.debug('TreeNodesComponent.updateAllTreeNodes - Deleting node', {
        nodeId: treeNode.id,
        nodeName: treeNode.name,
        depth: this.calculateNodeDepth(treeNode, treesNodesToUpdate)
      });

      await firstValueFrom(this.treeNodeService.deleteById(treeNode.id));
    }

    await Promise.all(promises);
  }

  private showStyleError() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate("Error");
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.componentInstance.message = this.utils.getTranslate("treesEntity.styleError");
    dialogRef.afterClosed().subscribe();
  }

  private checkIfStyleIsInvalid(currentStyle: string, cartographyStyles: Array<string> | CartographyStyle[]): boolean {
    // Handle sentinel value - it's valid if no styles exist or if styles exist but no default
    if (currentStyle === this.defaultStyleSentinel) {
      return false; // Sentinel is always valid
    }
    
    if (!currentStyle || !cartographyStyles || cartographyStyles.length === 0) {
      return false; // No style or no styles available is valid
    }
    
    // Check if currentStyle exists in styles array
    // Handle both string array (stylesNames) and CartographyStyle array
    if (cartographyStyles.length > 0) {
      if (typeof cartographyStyles[0] === 'string') {
        // String array (stylesNames)
        return !(cartographyStyles as string[]).includes(currentStyle);
      } else {
        // CartographyStyle array
        return !(cartographyStyles as CartographyStyle[]).some(style => style.name === currentStyle);
      }
    }
    
    return false;
  }

  public async getSelectedRowsCartographies(data: any[]) {
    let cartography = null;
    if (!this.currentNodeIsFolder && (!data || data.length == 0)) {
      cartography = this.currentNodeCartography;
    }
    if ((data.length <= 0 && this.treeNodeForm.value.cartographyName == null)
      && !this.currentNodeIsFolder && this.currentTreeType !== this.codeValues.treeType.edition
      && this.getEffectiveNodeType() !== constants.treeDomainKey.task) {
      const dialogRef = this.dialog.open(DialogMessageComponent);
      dialogRef.componentInstance.title = this.utils.getTranslate("Error");
      dialogRef.componentInstance.hideCancelButton = true;
      dialogRef.componentInstance.message = this.utils.getTranslate("cartographyNonSelectedMessage");
      dialogRef.afterClosed().subscribe();
    } else if (!this.currentNodeIsFolder && data.length > 0 && this.checkIfStyleIsInvalid(this.treeNodeForm.get('style').value, data[0].stylesNames)) {
      this.showStyleError();
    } else if (cartography && this.checkIfStyleIsInvalid(this.treeNodeForm.get('style').value, cartography.stylesNames)) {
      this.showStyleError();
    } else {
      if (this.treeNodeForm.value.cartographyName !== null && data.length <= 0) {
        await this.updateCartographyTreeLeft(null);
      } else {
        await this.updateCartographyTreeLeft(data[0]);
      }
    }
  }

  public getSelectedRowsTasks(data: any[]) {
    if (!this.currentNodeIsFolder && (data && data.length > 0)) {
      this.currentNodeTask = data[data.length - 1];
    }
    if (this.savingNode) {
      if ((data.length <= 0 && this.treeNodeForm.value.taskName == null) && !this.currentNodeIsFolder) {
        const dialogRef = this.dialog.open(DialogMessageComponent);
        dialogRef.componentInstance.title = this.utils.getTranslate("Error");
        dialogRef.componentInstance.hideCancelButton = true;
        dialogRef.componentInstance.message = this.utils.getTranslate("taskNonSelectedMessage");
        dialogRef.afterClosed().subscribe();
      } else {
        if (this.treeNodeForm.value.taskName !== null && data.length <= 0) {
          this.updateTaskTreeLeft(null);
        } else {
          this.updateTaskTreeLeft(data[0]);
        }
      }
      this.currentNodeTask = null;
    }
  }

  updateTaskTreeLeft(task) {
    this.treeNodeForm.patchValue({
      task: task
    });
    if (task != null) {
      this.treeNodeForm.patchValue({
        taskName: task.name,
        taskId: task.id
      });
    } else {
      if (!this.currentNodeIsFolder) {
        const oldTask = this.treeNodeForm.get('oldTask').value;
        if (oldTask) {
          this.treeNodeForm.patchValue({
            task: oldTask,
            taskName: oldTask.name,
            taskId: oldTask.id
          });
        }
      }
    }
    
    // Ensure status is set to "Modified" for existing nodes
    if (!this.newElement && this.treeNodeForm.get('id')?.value >= 0) {
      this.treeNodeForm.patchValue({
        status: "Modified"
      });
    }

    if (!this.currentNodeIsFolder) {
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
      newNameTranslation = this.treeNodeForm.value.nameTranslations;
    }

    if (this.treeNodeForm.value.descriptionTranslationsModified) {
      newDescriptionTranslation = this.treeNodeForm.value.descriptionTranslations;
    }

    if (this.newElement) {
      this.treeNodeForm.patchValue({
        id: this.idFictitiousCounter
      });
      if (newNameTranslation) {
        this.nameTranslations.set(this.idFictitiousCounter, newNameTranslation);
      } else {
        if (this.treeNodeForm.value.description && this.treeNodeForm.value.description != this.currentNodeDescription) {
          this.treeNodeForm.patchValue({
            descriptionFormModified: true
          });
        }
      }
      if (newDescriptionTranslation) {
        this.descriptionTranslations.set(this.idFictitiousCounter, newDescriptionTranslation);
      } else {
        if (this.treeNodeForm.value.name && this.treeNodeForm.value.name != this.currentNodeName) {
          this.treeNodeForm.patchValue({
            nameFormModified: true
          });
        }
      }
    } else {
      if (newNameTranslation) {
        this.nameTranslations.set(this.treeNodeForm.value.id, newNameTranslation);
      } else {
        if (this.treeNodeForm.value.description && this.treeNodeForm.value.description != this.currentNodeDescription) {
          this.treeNodeForm.patchValue({
            descriptionFormModified: true
          });
        }
      }
      if (newDescriptionTranslation) {
        this.descriptionTranslations.set(this.treeNodeForm.value.id, newDescriptionTranslation);
      } else {
        if (this.treeNodeForm.value.name && this.treeNodeForm.value.name != this.currentNodeName) {
          this.treeNodeForm.patchValue({
            nameFormModified: true
          });
        }
      }
    }
  }

  async updateCartographyTreeLeft(cartography) {
    this.treeNodeForm.patchValue({
      cartography: cartography
    });
    if (cartography != null) {
      this.treeNodeForm.patchValue({
        cartographyName: cartography.name,
        cartographyId: cartography.id
      });
      // Load and process styles for the cartography
      await this.updateAvailableStyles(cartography.id);
    } else {
      // Clear styles when cartography is null
      await this.updateAvailableStyles(null);
      if (!this.currentNodeIsFolder) {
        const oldCartography = this.treeNodeForm.get('oldCartography').value;
        if (oldCartography) {
          this.treeNodeForm.patchValue({
            cartography: oldCartography,
            cartographyName: oldCartography.name,
            cartographyId: oldCartography.id
          });
          // Load styles for old cartography
          await this.updateAvailableStyles(oldCartography.id);
        }
      }
    }
    
    // Ensure status is set to "Modified" for existing nodes
    if (!this.newElement && this.treeNodeForm.get('id')?.value >= 0) {
      this.treeNodeForm.patchValue({
        status: "Modified"
      });
    }

    if (!this.currentNodeIsFolder) {
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
      newNameTranslation = this.treeNodeForm.value.nameTranslations;
    }

    if (this.treeNodeForm.value.descriptionTranslationsModified) {
      newDescriptionTranslation = this.treeNodeForm.value.descriptionTranslations;
    }

    if (this.newElement) {
      this.treeNodeForm.patchValue({
        id: this.idFictitiousCounter
      });
      if (newNameTranslation) {
        this.nameTranslations.set(this.idFictitiousCounter, newNameTranslation);
      } else {
        if (this.treeNodeForm.value.description && this.treeNodeForm.value.description != this.currentNodeDescription) {
          this.treeNodeForm.patchValue({
            descriptionFormModified: true
          });
        }
      }
      if (newDescriptionTranslation) {
        this.descriptionTranslations.set(this.idFictitiousCounter, newDescriptionTranslation);
      } else {
        if (this.treeNodeForm.value.name && this.treeNodeForm.value.name != this.currentNodeName) {
          this.treeNodeForm.patchValue({
            nameFormModified: true
          });
        }
      }
    } else {
      if (newNameTranslation) {
        this.nameTranslations.set(this.treeNodeForm.value.id, newNameTranslation);
      } else {
        if (this.treeNodeForm.value.description && this.treeNodeForm.value.description != this.currentNodeDescription) {
          this.treeNodeForm.patchValue({
            descriptionFormModified: true
          });
        }
      }
      if (newDescriptionTranslation) {
        this.descriptionTranslations.set(this.treeNodeForm.value.id, newDescriptionTranslation);
      } else {
        if (this.treeNodeForm.value.name && this.treeNodeForm.value.name != this.currentNodeName) {
          this.treeNodeForm.patchValue({
            nameFormModified: true
          });
        }
      }
    }
  }

  updateTreeLeft() {
    if (this.newElement) {
      this.idFictitiousCounter--;
      const value = {
        ...this.treeNodeForm.value,
        parent: this.treeNodeForm.value.parent ?? null
      };
      this.createNodeEvent.next(value);
      // Reset form only when creating a new element
      this.savingNode = false;
      this.newElement = false;
      this.currentNodeType = null;
      this.currentNodeId = null;  // clear selection so form hides
      this.treeNodeForm.reset();
    } else {
      // When updating an existing node, keep the form visible with updated data
      this.updateNode();
      this.savingNode = false;
      // Reset form state after saving to disable update button
      this.treeNodeForm.markAsPristine();
      // Reset modification flags
      this.treeNodeForm.patchValue({
        nameTranslationsModified: false,
        descriptionTranslationsModified: false,
        nameFormModified: false,
        descriptionFormModified: false
      });
      // Update current values to match saved values
      this.currentNodeName = this.treeNodeForm.get('name')?.value || '';
      this.currentNodeDescription = this.treeNodeForm.get('description')?.value || '';
      // Trigger change detection to update button state
      this.cdr.detectChanges();
      // Don't reset currentNodeIsFolder or form - keep the node selected and form visible
    }
  }

  /**
   * Determines if the update button should be enabled.
   * Button is enabled when:
   * - Form is valid
   * - AND (form is dirty OR translations were modified OR form fields were modified)
   * 
   * @returns True if update button should be enabled, false otherwise
   */
  canUpdateNode(): boolean {
    if (!this.treeNodeForm) {
      return false;
    }

    const isFormValid = this.treeNodeForm.valid ?? false;
    const isFormDirty = this.treeNodeForm.dirty ?? false;
    const hasTranslationChanges = 
      this.treeNodeForm.get('nameTranslationsModified')?.value === true ||
      this.treeNodeForm.get('descriptionTranslationsModified')?.value === true;
    const hasFormFieldChanges =
      this.treeNodeForm.get('nameFormModified')?.value === true ||
      this.treeNodeForm.get('descriptionFormModified')?.value === true;

    return isFormValid && (isFormDirty || hasTranslationChanges || hasFormFieldChanges);
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
  };

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
    } catch (_) {
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

  /**
   * Checks if a label should be translated.
   * Translation keys typically contain dots (e.g., 'nodeMapping.price'),
   * while literal strings don't (e.g., 'Extra info').
   * @param label The label to check
   * @returns true if the label should be translated, false otherwise
   */
  shouldTranslateLabel(label: string): boolean {
    return label && label.includes('.');
  }

  saveTreeNodeTranslation(translation, column) {
    if (translation.column == config.translationColumns.treeNodeName) {
      this.storeTranslationInMap(translation, this.nameTranslations, column);
    } else if (translation.column == config.translationColumns.treeNodeDescription) {
      this.storeTranslationInMap(translation, this.descriptionTranslations, column);
    }
  }

  /**
   * Loads translations for a specific node ID.
   * Fetches translations from the service and stores them in the component's translation maps.
   * 
   * @param nodeId - The ID of the node to load translations for
   * @returns Promise that resolves when translations are loaded
   */
  async loadNodeTranslations(nodeId: number): Promise<void> {
    try {
      const allTranslations = await firstValueFrom(
        this.translationService.getAll().pipe(
          map((data: any[]) => data.filter(elem => 
            elem.element === nodeId && 
            (elem.column === config.translationColumns.treeNodeName || 
             elem.column === config.translationColumns.treeNodeDescription)
          ))
        )
      );

      allTranslations.forEach(translation => {
        this.saveTreeNodeTranslation(translation, translation.column);
      });
    } catch (error) {
      this.loggerService.error('TreeNodesComponent.loadNodeTranslations - Error loading translations', error);
    }
  }

  private storeTranslationInMap(translation, map: Map<number, Map<string, Translation>>, column: string) {
    const currentTranslation = map.get(translation.element);
    if (currentTranslation != undefined) {
      this.utils.updateTranslations(currentTranslation, [translation]);
    } else {
      const newMap: Map<string, Translation> = this.utils.createTranslationsList(column);
      this.utils.updateTranslations(newMap, [translation]);
      map.set(translation.element, newMap);
    }
  }

  // Resizable layout methods
  onResizeStart(event: MouseEvent): void {
    event.preventDefault();
    this.isResizing = true;
  }

  @HostListener('document:mousemove', ['$event'])
  onResize(event: MouseEvent): void {
    if (!this.isResizing) {
      return;
    }

    // Find the resizable container
    const containers = document.querySelectorAll('.resizable-container');
    if (containers.length === 0) {
      return;
    }

    // Use the first container (should be the one we're working with)
    const container = containers[0] as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    const mouseX = event.clientX - containerRect.left;
    const percentage = (mouseX / containerRect.width) * 100;

    // Constrain to min/max bounds
    this.treePanelWidth = Math.max(
      this.minTreeWidth,
      Math.min(this.maxTreeWidth, percentage)
    );

    // Optionally save to localStorage for persistence
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('treePanelWidth', String(this.treePanelWidth));
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onResizeEnd(_event: MouseEvent): void {
    if (this.isResizing) {
      this.isResizing = false;
    }
  }

  /**
   * Loads and caches cartographies for autocomplete.
   * Only loads once per component lifecycle.
   */
  async loadCartographies(): Promise<void> {
    if (this.cartographiesLoaded) {
      // Cartographies already loaded, but check if we need to set cartography for current node
      const cartographyId = this.treeNodeForm.get('cartographyId')?.value;
      if (cartographyId && !this.treeNodeForm.get(constants.treeDomainKey.cartography)?.value) {
        const cartographyObj = this.allCartographies.find(c => c.id === cartographyId);
        if (cartographyObj) {
          this.treeNodeForm.patchValue({ 
            cartography: cartographyObj,
            cartographyName: cartographyObj.name,
            cartographyId: cartographyObj.id
          });
          this.currentNodeCartography = cartographyObj;
        }
      }
      return;
    }

    // Set loading state
    this.cartographiesLoading = true;

    try {
      const cartographies = await firstValueFrom(this.getAllCartographies());
      this.allCartographies = cartographies || [];
      this.filteredCartographies = [...this.allCartographies];
      this.cartographiesLoaded = true;
      
      // If a node is already loaded with a cartographyId, set the cartography object
      const cartographyId = this.treeNodeForm.get('cartographyId')?.value;
      if (cartographyId && !this.treeNodeForm.get(constants.treeDomainKey.cartography)?.value) {
        const cartographyObj = this.allCartographies.find(c => c.id === cartographyId);
        if (cartographyObj) {
          this.treeNodeForm.patchValue({ 
            cartography: cartographyObj,
            cartographyName: cartographyObj.name,
            cartographyId: cartographyObj.id
          });
          this.currentNodeCartography = cartographyObj;
        }
      }
    } catch (error) {
      this.loggerService.error('TreeNodesComponent.loadCartographies - Error loading cartographies', error);
      this.allCartographies = [];
      this.filteredCartographies = [];
    } finally {
      // Always clear loading state
      this.cartographiesLoading = false;
    }
  }

  /**
   * Loads and caches tasks for autocomplete.
   * Only loads once per component lifecycle.
   */
  async loadTasks(): Promise<void> {
    if (this.tasksLoaded) {
      const taskId = this.treeNodeForm.get('taskId')?.value;
      if (taskId && !this.treeNodeForm.get(constants.treeDomainKey.task)?.value) {
        const taskObj = this.allTasks.find(t => t.id === taskId);
        if (taskObj) {
          this.treeNodeForm.patchValue({ 
            task: taskObj,
            taskName: taskObj.name,
            taskId: taskObj.id
          });
          this.currentNodeTask = taskObj;
        }
      }
      return;
    }

    this.tasksLoading = true;

    try {
      const tasks = await firstValueFrom(this.getAllTasks());
      this.allTasks = tasks || [];
      this.filteredTasks = [...this.allTasks];
      this.tasksLoaded = true;
      
      const taskId = this.treeNodeForm.get('taskId')?.value;
      if (taskId && !this.treeNodeForm.get(constants.treeDomainKey.task)?.value) {
        const taskObj = this.allTasks.find(t => t.id === taskId);
        if (taskObj) {
          this.treeNodeForm.patchValue({ 
            task: taskObj,
            taskName: taskObj.name,
            taskId: taskObj.id
          });
          this.currentNodeTask = taskObj;
        }
      }
    } catch (error) {
      this.loggerService.error('TreeNodesComponent.loadTasks - Error', error);
      this.allTasks = [];
      this.filteredTasks = [];
    } finally {
      this.tasksLoading = false;
    }
  }

  /**
   * Filters cartographies by name, service name, and layer names.
   * Case-insensitive search.
   * Note: Cartography names are data values (layer names), not UI labels, so they are not translated.
   */
  filterCartographies(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredCartographies = [...this.allCartographies];
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredCartographies = this.allCartographies.filter(cartography => {
      // Check cartography name (not translated - it's data)
      const name = (cartography.name || '').toLowerCase();
      if (name.includes(term)) {
        return true;
      }

      // Check service name
      if (cartography.serviceName && cartography.serviceName.toLowerCase().includes(term)) {
        return true;
      }

      // Check layer names
      if (cartography.layers && Array.isArray(cartography.layers)) {
        const matchingLayer = cartography.layers.some(layer => 
          layer && layer.toLowerCase().includes(term)
        );
        if (matchingLayer) {
          return true;
        }
      }

      return false;
    });
  }

  /**
   * Filters tasks by name, type name, and group name.
   * Case-insensitive search.
   */
  filterTasks(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredTasks = [...this.allTasks];
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredTasks = this.allTasks.filter(task => {
      const name = (task.name || '').toLowerCase();
      if (name.includes(term)) return true;
      
      if (task.typeName && task.typeName.toLowerCase().includes(term)) {
        return true;
      }
      
      if (task.groupName && task.groupName.toLowerCase().includes(term)) {
        return true;
      }
      
      return false;
    });
  }

  /**
   * Display function for autocomplete.
   * Returns the cartography name to display in the input field.
   * Note: Cartography names are data values (layer names), not UI labels, so they are not translated.
   */
  displayCartography = (cartography: any): string | null => {
    if (!cartography) {
      return null;
    }
    return cartography.name || null;
  };

  /**
   * Display function for task autocomplete.
   * Returns the task name to display in the input field.
   */
  displayTask = (task: any): string | null => {
    if (!task) return null;
    return task.name || null;
  };

  /**
   * Handles cartography selection from autocomplete.
   * Replaces the logic from getSelectedRowsCartographies.
   */
  async onCartographySelected(event: MatAutocompleteSelectedEvent): Promise<void> {
    const cartography = event.option.value;
    
    if (!cartography) {
      // Clear selection
      if (this.treeNodeForm.value.cartographyName !== null) {
        await this.updateCartographyTreeLeft(null);
      }
      return;
    }

    // Validate cartography selection (required for non-folder nodes in certain tree types)
    if ((!this.treeNodeForm.value.cartography && cartography == null)
        && !this.currentNodeIsFolder 
        && this.currentTreeType !== this.codeValues.treeType.edition
        && this.getEffectiveNodeType() !== constants.treeDomainKey.task) {
      const dialogRef = this.dialog.open(DialogMessageComponent);
      dialogRef.componentInstance.title = this.utils.getTranslate("Error");
      dialogRef.componentInstance.hideCancelButton = true;
      dialogRef.componentInstance.message = this.utils.getTranslate("cartographyNonSelectedMessage");
      dialogRef.afterClosed().subscribe();
      return;
    }

    // Material autocomplete has already set the form control to the cartography object
    // Just update related fields (cartographyName, cartographyId) and other logic
    await this.updateCartographyTreeLeft(cartography);
    
    // Validate style after loading styles
    if (!this.currentNodeIsFolder) {
      const styleValue = this.treeNodeForm.get('style')?.value;
      if (this.availableStyles.length > 0) {
        // Use CartographyStyle array for validation
        if (this.checkIfStyleIsInvalid(styleValue, this.availableStyles)) {
          this.showStyleError();
          return;
        }
      } else if (cartography.stylesNames) {
        // Fall back to stylesNames if styles not loaded yet
        if (this.checkIfStyleIsInvalid(styleValue, cartography.stylesNames)) {
          this.showStyleError();
          return;
        }
      }
    }
  }

  /**
   * Handles task selection from autocomplete.
   */
  async onTaskSelected(event: MatAutocompleteSelectedEvent): Promise<void> {
    const task = event.option.value;
    
    if (!task) {
      if (this.treeNodeForm.value.taskName !== null) {
        this.updateTaskTreeLeft(null);
      }
      return;
    }

    // Material autocomplete has already set the form control
    this.updateTaskTreeLeft(task);
  }

  /**
   * Loads and processes styles for the given cartography.
   * Fetches styles via proxy and link following.
   */
  async updateAvailableStyles(cartographyId: number | null): Promise<void> {
    if (cartographyId === null) {
      // Clear styles and set to sentinel
      this.availableStyles = [];
      this.currentCartographyStyles = [];
      this.hasDefaultStyle = false;
      const currentStyle = this.treeNodeForm.get('style')?.value;
      if (!currentStyle || currentStyle === this.defaultStyleSentinel) {
        this.treeNodeForm.patchValue({ style: this.defaultStyleSentinel });
      }
      return;
    }

    try {
      // Create cartography proxy and fetch styles
      const cartographyProxy = this.cartographyService.createProxy(cartographyId);
      const styles = await firstValueFrom(
        cartographyProxy.getRelationArray(CartographyStyle, 'styles')
      );

      // Store styles
      this.currentCartographyStyles = styles || [];
      this.availableStyles = [...this.currentCartographyStyles];

      // Find default style
      const defaultStyle = this.availableStyles.find(style => style.defaultStyle === true);
      this.hasDefaultStyle = !!defaultStyle;

      const currentStyle = this.treeNodeForm.get('style')?.value;

      if (this.availableStyles.length === 0) {
        // No styles exist - set to sentinel
        this.hasDefaultStyle = false;
        this.treeNodeForm.patchValue({ style: this.defaultStyleSentinel });
      } else if (defaultStyle) {
        // Default style exists - use it if current style is null/empty/sentinel
        if (!currentStyle || currentStyle === this.defaultStyleSentinel || currentStyle.trim() === '') {
          this.treeNodeForm.patchValue({ style: defaultStyle.name });
        }
      } else {
        // No default style - keep current style or set to sentinel if null/empty
        if (!currentStyle || currentStyle.trim() === '') {
          this.treeNodeForm.patchValue({ style: this.defaultStyleSentinel });
        }
      }
    } catch (error) {
      this.loggerService.error('TreeNodesComponent.updateAvailableStyles - Error loading styles', error);
      this.availableStyles = [];
      this.currentCartographyStyles = [];
      this.hasDefaultStyle = false;
      this.treeNodeForm.patchValue({ style: this.defaultStyleSentinel });
    }
  }

  /**
   * Check if a panel should be expanded for a given node.
   * Only basic-info is expanded by default.
   */
  isPanelExpanded(panelId: string, nodeId: number | null): boolean {
    if (nodeId === null) {
      return this.defaultExpandedPanelIds.includes(panelId as any);
    }
    if (!this.nodeExpansionStates.has(nodeId)) {
      return this.defaultExpandedPanelIds.includes(panelId as any);
    }
    const expansionState = this.nodeExpansionStates.get(nodeId);
    return expansionState ? expansionState.has(panelId) : this.defaultExpandedPanelIds.includes(panelId as any);
  }

  /**
   * Save expansion state when panel opens/closes.
   */
  onPanelStateChange(panelId: string, nodeId: number | null, isExpanded: boolean): void {
    if (nodeId === null) {
      // Don't save state for null IDs (shouldn't happen in practice)
      return;
    }
    if (!this.nodeExpansionStates.has(nodeId)) {
      this.nodeExpansionStates.set(nodeId, new Set(this.defaultExpandedPanelIds));
    }
    const state = this.nodeExpansionStates.get(nodeId);
    if (!state) {
      return;
    }
    if (isExpanded) {
      state.add(panelId);
    } else {
      state.delete(panelId);
    }
  }

  /**
   * Clears both cartography and task caches.
   * Called when component is destroyed.
   */
  clearCaches(): void {
    this.allCartographies = [];
    this.filteredCartographies = [];
    this.cartographiesLoaded = false;
    this.cartographiesLoading = false;
    
    this.allTasks = [];
    this.filteredTasks = [];
    this.tasksLoaded = false;
    this.tasksLoading = false;
  }

  /**
   * Lifecycle hook called when component is destroyed.
   * Clears caches to ensure fresh data on next initialization.
   */
  ngOnDestroy(): void {
    this.clearCaches();
  }
}

/** Allowed node types for root level of a tree type. */
function getAllowedRootTypes(treeType: string): string[] {
  const c = config.treeTypeNodeTypes?.[treeType];
  return (c && (c as any).allowedRootTypes) ? [...(c as any).allowedRootTypes] : [];
}

/** Whether this node type can have children (container). No folder/leaf distinction; both are nodes. */
function canNodeTypeHaveChildren(treeType: string, nodeType: string | null): boolean {
  if (!treeType || !nodeType) return false;
  const c = config.treeTypeNodeTypes?.[treeType];
  const nodeTypes = (c as any)?.nodeTypes;
  const allowed = nodeTypes?.[nodeType]?.allowedChildren;
  return Array.isArray(allowed) && allowed.length > 0;
}

/** All node types for a tree type (keys of nodeTypes). */
function getNodeTypesForTree(treeType: string): string[] {
  const c = config.treeTypeNodeTypes?.[treeType];
  const nodeTypes = (c as any)?.nodeTypes;
  return nodeTypes ? Object.keys(nodeTypes) : [];
}

/** Allowed child node types for a parent type. */
function getAllowedChildrenForNodeType(treeType: string, parentNodeType: string): string[] {
  const c = config.treeTypeNodeTypes?.[treeType];
  const nodeTypes = (c as any)?.nodeTypes;
  const allowed = nodeTypes?.[parentNodeType]?.allowedChildren;
  return Array.isArray(allowed) ? [...allowed] : [];
}

/** Get panel visibility for a node type. */
function getNodePanelConfig(treeType: string, nodeType: string | null, panelName: string): boolean {
  if (!treeType || !nodeType) return false;
  const c = config.treeTypeNodeTypes?.[treeType];
  const nodeTypes = (c as any)?.nodeTypes;
  return nodeTypes?.[nodeType]?.[panelName] ?? false;
}

/** Parent types for which appearance panel is shown (optional). When set, panel is shown if parent is in this list. */
function getShowAppearancePanelWhenParentIs(treeType: string, nodeType: string | null): string[] | undefined {
  if (!treeType || !nodeType) return undefined;
  const c = config.treeTypeNodeTypes?.[treeType];
  const nodeTypes = (c as any)?.nodeTypes;
  const value = nodeTypes?.[nodeType]?.showAppearancePanelWhenParentIs;
  return Array.isArray(value) ? value : undefined;
}

/** Appearance field label kind from config: 'image' (custom image) or 'icon' (Material icon). Default 'icon'. */
function getNodeTypeAppearanceLabelKey(treeType: string, nodeType: string | null): 'image' | 'icon' {
  if (!treeType || !nodeType) return 'icon';
  const c = config.treeTypeNodeTypes?.[treeType];
  const nodeTypes = (c as any)?.nodeTypes;
  const key = nodeTypes?.[nodeType]?.appearanceLabelKey;
  return key === 'image' ? 'image' : 'icon';
}

/** First candidate that appears in available codelist (by value). */
function pickFirstAllowedFromCodeList(candidates: string[], available: CodeList[]): string | null {
  const values = new Set(available.map(a => a.value));
  for (const c of candidates) {
    if (values.has(c)) return c;
  }
  return available.length ? available[0].value : null;
}

/** Default container type from config rules, constrained by available codelist. */
function getDefaultContainerTypeFromRules(treeType: string, available: CodeList[]): string | null {
  if (!treeType || !available?.length) return null;
  const candidates = getNodeTypesForTree(treeType).filter(nt => canNodeTypeHaveChildren(treeType, nt));
  return pickFirstAllowedFromCodeList(candidates, available);
}

/** Default leaf type from config rules, constrained by available codelist. */
function getDefaultLeafTypeFromRules(treeType: string, available: CodeList[]): string | null {
  if (!treeType || !available?.length) return null;
  const candidates = getNodeTypesForTree(treeType).filter(nt => !canNodeTypeHaveChildren(treeType, nt));
  return pickFirstAllowedFromCodeList(candidates, available);
}

