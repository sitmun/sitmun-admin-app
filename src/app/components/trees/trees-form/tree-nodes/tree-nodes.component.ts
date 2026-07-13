import {ChangeDetectorRef, Component, DestroyRef, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatDialog} from '@angular/material/dialog';
import {MatAccordion} from '@angular/material/expansion';

import {TranslateService} from '@ngx-translate/core';
import {XMLParser} from 'fast-xml-parser';
import {firstValueFrom, forkJoin, Observable, of, Subject} from 'rxjs';
import {map, timeout} from 'rxjs/operators';

import {HalOptions, HalParam} from '@app/core';
import {Configuration} from '@app/core/config/configuration';
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
  TreeNodeService,
  TreeRulesService
} from '@app/domain';
import {AdminRuntimeConfigurationService} from '@app/domain/admin-configuration/services/admin-runtime-configuration.service';
import { TaskPropertiesContract } from '@app/domain/task/models/task-properties';
import {openDialogGridWithPreload} from '@app/frontend-gui/src/lib/dialog-grid/dialog-grid.component';
import {
  DataTreeComponent,
  DialogFormComponent,
  DialogMessageComponent,
  DIALOG_EVENTS,
  FileNode
} from '@app/frontend-gui/src/lib/public_api';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {NotificationService} from '@app/services/notification.service';
import {UtilsService} from '@app/services/utils.service';
import {
  formatImageAccept,
  getImageUploadErrorKey,
  validateImageUpload,
} from '@app/utils/image-upload.utils';
import {config} from '@config';
import {constants} from '@environments/constants';

interface TreeNodeTaskInputParameter {
  name: string;
  label: string;
  value: unknown;
}


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
export class TreeNodesComponent implements OnInit, OnDestroy, OnChanges {
  private readonly destroyRef = inject(DestroyRef);
  private readonly adminConfigService = inject(AdminRuntimeConfigurationService);

  /** Params for `entity.tree.image.resizeHint`. Emits on each node selection; hint hidden until config loads. */
  get nodeImageResizeHintParams$(): Observable<{ width: number; height: number; maxSizeMb: number }> {
    return this.adminConfigService.getTreeImageUploadConfiguration().pipe(
      map(({ defaultSize, sizesByType, maxBytes }) => {
        const type = this.currentParentNodeType;
        const size = (type && sizesByType[type]) ?? defaultSize;
        return { width: size.width, height: size.height, maxSizeMb: Math.round(maxBytes / (1024 * 1024)) };
      })
    );
  }

  readonly nodeImageAccept$: Observable<string> = this.adminConfigService.getTreeImageUploadConfiguration().pipe(
    map(({ supportedFormats }) => formatImageAccept(supportedFormats))
  );

  nodeImagePreviewState: 'uploaded' | 'stored' = 'stored';

  @Input() tree: Tree;
  @Input() entityID = -1;
  @Input() duplicateID = -1;
  @Input() dataLoaded = false;
  @Input() currentTreeType: string;
  @Input() loadDataButton$: Observable<boolean> = of(true);

  @Output() saveRequested = new EventEmitter<void>();

  /**
   * After duplicating, cloned nodes are pendingCreation until first save; that must not enable Save until the user edits structure.
   */
  private duplicateStructureUserTouched = false;

  treeNodeForm: UntypedFormGroup;
  public fieldsConfigForm: UntypedFormGroup;
  idFictitiousCounter = -1;
  viewModeOptions: CodeList[] = [];
  private nodeTypeOptions: CodeList[] = [];
  private nodeTypeDescriptionMap = new Map<string, string>();
  private viewModeDescriptionMap = new Map<string, string>();
  readonly canNodeHaveChildrenFn = (nodeType: string | null) => this.canNodeHaveChildren(nodeType);
  readonly getAllowedTypesForParentFn = (parent: FileNode | null) => this.getAllowedTypesForParent(parent);
  readonly getNodeTypeLabelFn = (nodeType: string) => this.getNodeTypeLabel(nodeType);
  readonly getViewModeLabelForTreeFn = (viewMode: string) => this.getViewModeLabelForTree(viewMode);
  /** Computed: whether current node type can have children (derived from config). */
  get currentNodeIsFolder(): boolean {
    return this.treeRulesService.canNodeTypeHaveChildren(this.currentTreeType, this.currentNodeType);
  }
  /** True when a node is selected for edit or we are creating a new node. */
  get hasNodeSelection(): boolean {
    return this.currentNodeId != null || this.newElement;
  }
  /** Full width when detail pane is hidden; otherwise the user-resized split ratio. */
  get effectiveTreePanelWidth(): number {
    return this.hasNodeSelection ? this.treePanelWidth : 100;
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
  cartographyFieldEditing = false;
  private cartographyFieldBlurTimeout: ReturnType<typeof setTimeout> | null = null;

  // Task autocomplete properties
  filteredTasks: any[] = [];
  allTasks: any[] = [];
  tasksLoaded = false;
  tasksLoading = false;
  taskFieldEditing = false;
  private taskFieldBlurTimeout: ReturnType<typeof setTimeout> | null = null;

  @ViewChild('cartographyInput') cartographyInputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('cartographyInput', { read: MatAutocompleteTrigger })
  cartographyAutocompleteTrigger?: MatAutocompleteTrigger;
  @ViewChild('taskInput') taskInputRef?: ElementRef<HTMLInputElement>;

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
  /** Last tree row id focused before detail close (accessibility return focus). */
  private lastFocusedNodeId: number | null = null;
  /** True when the folder being edited has children (type cannot be changed to cartography). */
  currentFolderHasChildren = false;

  /** Session-global expansion state: a panel is expanded for all nodes once opened. */
  private expandedPanelIds = new Set<string>(['basic-info']);

  /** True during a node switch to suppress spurious Material `(closed)` events. */
  private suppressPanelStateUpdates = false;

  filterOptions = [{value: 'UNDEFINED', description: 'common.boolean.undefined'}, {value: true, description: 'common.boolean.yes'}, {value: false, description: 'common.boolean.no'}];
  codeValues = constants.codeValue;
  defaultLang = config.defaultLang;

  layersList = [];
  nodeInputsControls: TreeNodeTaskInputParameter[] = [];
  nodeNamespacesControls = [];
  noNamespaces = true;
  parsedData = {
    data: {},
    dataType: 'json'
  };
  nodeOutputsControls = config.nodeMapping.nodeOutputControls;
  /** Map output key -> label control (e.g. leftbtn -> leftbtnLabel). Built once from static config. */
  private readonly outputLabelControlMap: Map<string, any> = new Map(
    config.nodeMapping.nodeOutputControls
      .filter((c: { key: string }) => c.key.endsWith('Label'))
      .map((c: { key: string }) => [c.key.slice(0, -'Label'.length), c])
  );
  mappingAppOptions = config.nodeMapping.appOptions;
  mappingbtnLabelOptions = config.nodeMapping.btnlabelOptions;
  mappingParentTaskOptions = [];
  namespaces = [];
  /** Map of code list names with their associated values */
  private readonly codelists: Map<string, CodeList[]> = new Map();
  /** Flag to track if code lists have been initialized */
  codeListsInitialized = false;
  savingNode = false;
  nameTranslations: Map<number, Map<string, Translation>> = new Map<number, Map<string, Translation>>();
  descriptionTranslations: Map<number, Map<string, Translation>> = new Map<number, Map<string, Translation>>();
  private translationLoadsCompleted: Set<number> = new Set<number>();
  private translationLoadsInFlight: Map<number, Promise<void>> = new Map<number, Promise<void>>();
  private fullTaskLoadsInFlight: Set<number> = new Set<number>();
  private cachedTaskInputLabels: string[] = [];
  private cachedTaskInputTaskId: number | null = null;
  private cachedTaskInputPropertiesRef: unknown = undefined;
  private cachedTaskOutputParameters: { key: string; label: string }[] = [];
  private cachedTaskOutputMode = '';

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
    private loadingService: LoadingOverlayService,
    private errorHandler: ErrorHandlerService,
    private treeRulesService: TreeRulesService,
    private notificationService: NotificationService
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
      'treenode.node.type',
      'treenode.viewmode'
    ]);

    this.layersList = await firstValueFrom(this.getAllCartographies());

    // Load and cache cartographies for autocomplete
    await this.loadCartographies();

    // Set up cartography autocomplete filtering
    this.treeNodeForm.get(constants.treeDomainKey.cartography)?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
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
    this.treeNodeForm.get(constants.treeDomainKey.task)?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
      if (typeof value === 'string') {
        this.filterTasks(value.toLowerCase());
      } else if (value && typeof value === 'object') {
        this.filteredTasks = [...this.allTasks];
      }
    });

    this.columnDefsServices = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('entity.service.name', 'name'),
      this.utils.getNonEditableColumnDef('entity.service.type', 'type'),
      this.utils.getEditableColumnDef('entity.service.serviceURL', 'serviceURL'),
      this.utils.getEditableColumnDef('entity.service.supportedSRS', 'supportedSRS'),
      this.utils.getDateColumnDef('entity.service.createdDate', 'createdDate')
    ];

    this.columnDefsCartographies = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('entity.tree.name', 'name'),
      this.utils.getNonEditableColumnDef('entity.tree.serviceName', 'serviceName'),
      this.utils.getNonEditableColumnDef('entity.tree.styles', 'stylesNames')
    ];

    this.columnDefsTasks = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getNonEditableColumnDef('entity.tree.name', 'name'),
      this.utils.getNonEditableColumnDef('entity.tree.groupTask', 'groupName'),
      this.utils.getNonEditableColumnDef('entity.tree.typeName', 'typeTitle'),
      this.utils.getStatusColumnDef()
    ];

    // Load node-level translations if editing
    if (this.isEdition() && this.tree) {
      this.translationService.fetchAllItems()
        .pipe(
          map((data: any[]) => data.filter(elem => elem.element == this.entityID || elem.column == config.translationColumns.treeNodeName ||
            elem.column == config.translationColumns.treeNodeDescription)
          ),
          takeUntilDestroyed(this.destroyRef),
        ).subscribe(result => {
          result.forEach(translation => {
            if (translation.column == config.translationColumns.treeNodeDescription || translation.column == config.translationColumns.treeNodeName) {
              this.saveTreeNodeTranslation(translation, translation.column);
            }
          });
        });
    }

    // Subscribe to save requests
    this.getAllElementsNodes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
      if (event === "save") {
        this.saveRequested.emit();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['duplicateID'] && !changes['duplicateID'].firstChange) ||
      (changes['entityID'] && !changes['entityID'].firstChange)
    ) {
      this.duplicateStructureUserTouched = false;
    }
  }

  /** Data-tree notifies real user mutations (edit payload, DnD, delete, etc.). */
  onStructureMutatedFromDataTree(): void {
    this.markDuplicateStructureUserTouched();
  }

  private markDuplicateStructureUserTouched(): void {
    if (this.entityID === -1 && this.duplicateID !== -1) {
      this.duplicateStructureUserTouched = true;
    }
  }

  /**
   * Same as {@link hasUnsavedChanges} except duplicate sessions ignore imported pendingCreation until the user mutates the tree.
   */
  hasUnsavedChangesForToolbar(): boolean {
    const isDup = this.entityID === -1 && this.duplicateID !== -1;
    const raw = this.hasUnsavedChanges();
    return raw && (!isDup || this.duplicateStructureUserTouched);
  }

  /**
   * Handles emitAllNodes event from data tree.
   */
  receiveAllNodes(event) {
    if (event?.event == "save") {
      this.saveRequested.emit();
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
    return this.codeListService.fetchAllItems(query);
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
    this.rebuildCodeListCaches();
    return result;
  }

  private rebuildCodeListCaches(): void {
    this.nodeTypeOptions = this.codelists.get('treenode.node.type') || [];
    this.viewModeOptions = this.codelists.get('treenode.viewmode') || [];
    this.nodeTypeDescriptionMap = new Map(this.nodeTypeOptions.map(item => [item.value, item.description]));
    this.viewModeDescriptionMap = new Map(this.viewModeOptions.map(item => [item.value, item.description]));
  }

  /** Label for a view mode code from treenode.viewmode codelist; fallback to raw code. */
  getViewModeLabelForTree(viewMode: string): string {
    if (!viewMode) return '';
    return this.viewModeDescriptionMap.get(viewMode) ?? viewMode;
  }

  /** Node types from codelist filtered by tree type; predicate = can have children (true) or cannot (false). */
  private getAvailableNodeTypesByPredicate(canHaveChildren: boolean): CodeList[] {
    const allTypes = this.nodeTypeOptions;
    if (!this.currentTreeType) return allTypes;
    const allowed = this.treeRulesService.getNodeTypesForTree(this.currentTreeType).filter(nt =>
      this.treeRulesService.canNodeTypeHaveChildren(this.currentTreeType, nt) === canHaveChildren
    );
    return allTypes.filter(type => allowed.includes(type.value));
  }

  /** Node types that can have children (for folder codelist). */
  getAvailableFolderTypes(): CodeList[] {
    return this.getAvailableNodeTypesByPredicate(true);
  }

  /** Node types that cannot have children (for leaf codelist). */
  getAvailableLeafTypes(): CodeList[] {
    return this.getAvailableNodeTypesByPredicate(false);
  }

  /** True if this node type cannot have children. */
  isNodeTypeALeaf(nodeType: string | null): boolean {
    return !this.treeRulesService.canNodeTypeHaveChildren(this.currentTreeType, nodeType);
  }

  /** Allowed child node types for a given parent type. */
  getAllowedChildrenForParent(parentNodeType: string | null): string[] {
    if (!parentNodeType || !this.currentTreeType) return [];
    return this.treeRulesService.getAllowedChildrenForNodeType(this.currentTreeType, parentNodeType);
  }

  /**
   * Allowed node types for a parent (null = root). Used by data-tree to render one add button per type.
   */
  getAllowedTypesForParent(parent: FileNode | null): string[] {
    if (!parent) return this.treeRulesService.getAllowedRootTypes(this.currentTreeType);
    return this.getAllowedChildrenForParent(parent.nodeType);
  }

  /** Display label for a node type from backend codelist description. */
  getNodeTypeLabel(nodeType: string): string {
    if (!nodeType) return '';
    return this.nodeTypeDescriptionMap.get(nodeType) ?? nodeType;
  }

  /** Material icon name for the current node type (from config). Used in form. */
  getNodeIconForType(nodeType: string): string {
    if (!nodeType) return 'description';
    const c = config.treeTypeNodeTypes?.[this.currentTreeType];
    const nodeTypes = (c as any)?.nodeTypes;
    const icon = nodeTypes?.[nodeType]?.icon;
    if (icon != null && icon !== '') return icon;
    return this.treeRulesService.canNodeTypeHaveChildren(this.currentTreeType, nodeType) ? 'folder' : 'description';
  }

  /** Icon font for node type (e.g. material-symbols-outlined); undefined for default. */
  getNodeIconFontForType(nodeType: string): string | undefined {
    if (!this.currentTreeType || !nodeType) return undefined;
    const c = config.treeTypeNodeTypes?.[this.currentTreeType];
    const nodeTypes = (c as any)?.nodeTypes;
    return nodeTypes?.[nodeType]?.iconFont;
  }

  /** Material icon name for a view mode code (from config.nodeViewModes). */
  getViewModeIcon(viewMode: string): string {
    if (!viewMode) return config.nodeViewModeFallbackIcon;
    return config.nodeViewModes?.[viewMode]?.icon ?? config.nodeViewModeFallbackIcon;
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
      this.treeRulesService.getNodePanelConfig(this.currentTreeType, this.effectiveNodeType, 'showMetadataFieldsInDescriptionPanel');
  }

  /** i18n key for description panel title: 'descriptionMetadata' when metadata fields shown, else 'description'. */
  get descriptionPanelTitleKey(): string {
    return this.treeRulesService.getNodePanelConfig(this.currentTreeType, this.effectiveNodeType, 'showMetadataFieldsInDescriptionPanel')
      ? 'entity.tree.descriptionMetadata'
      : 'entity.tree.description';
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
    if (!this.treeRulesService.getNodePanelConfig(this.currentTreeType, this.effectiveNodeType, 'showFiltersPanel')) return false;
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
    return this.treeRulesService.getNodePanelConfig(this.currentTreeType, this.effectiveNodeType, 'showDescriptionPanel');
  }

  /**
   * Determines if the cartography configuration panel should be displayed.
   * Driven by configuration based on node type.
   */
  get showCartographyConfigurationPanel(): boolean {
    return !!this.treeNodeForm?.get('nodeType')?.value &&
      this.treeRulesService.getNodePanelConfig(this.currentTreeType, this.effectiveNodeType, 'showCartographyPanel');
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
    const unconditional = this.treeRulesService.getNodePanelConfig(this.currentTreeType, this.effectiveNodeType, 'showAppearancePanel');
    if (unconditional) return true;
    const whenParentIs = this.treeRulesService.getShowAppearancePanelWhenParentIs(this.currentTreeType, this.effectiveNodeType);
    const parentType = this.currentParentNodeType;
    return !!(whenParentIs?.length && parentType && whenParentIs.includes(parentType));
  }

  /**
   * Determines if the task configuration panel should be displayed.
   * Driven by configuration based on node type.
   */
  get showTaskConfigurationPanel(): boolean {
    return !!this.treeNodeForm?.get('nodeType')?.value &&
      this.treeRulesService.getNodePanelConfig(this.currentTreeType, this.effectiveNodeType, 'showTaskPanel');
  }

  /**
   * Determines if the display options panel should be displayed.
   * Driven by configuration based on node type.
   */
  get showDisplayOptionsPanel(): boolean {
    return !!this.treeNodeForm?.get('nodeType')?.value &&
      this.treeRulesService.getNodePanelConfig(this.currentTreeType, this.effectiveNodeType, 'showDisplayOptionsPanel');
  }

  get showLoadByDefaultToggle(): boolean {
    return !this.currentNodeIsFolder
      && this.effectiveNodeType === constants.treeDomainKey.cartography;
  }

  get showRadioToggle(): boolean {
    return this.currentNodeIsFolder
      && this.treeRulesService.supportsNodeCapability(this.currentTreeType, 'folder', 'radio');
  }

  /** i18n key for appearance panel field label (image vs icon), from config. */
  get appearanceFieldLabelI18nKey(): string {
    const key = this.treeRulesService.getNodeTypeAppearanceLabelKey(this.currentTreeType, this.effectiveNodeType);
    return `entity.tree.${key}`;
  }

  /** True when config shows filterable checkbox and fields config in task panel. */
  get showFilterableInTaskPanel(): boolean {
    return !!this.treeNodeForm?.get('nodeType')?.value &&
      this.treeRulesService.getNodePanelConfig(this.currentTreeType, this.effectiveNodeType, 'showFilterableInTaskPanel');
  }

  /** True when config shows mapping UI (Task view dropdown + Field configuration button) in task panel. */
  get showMappingInTaskPanel(): boolean {
    return !!this.treeNodeForm?.get('nodeType')?.value &&
      this.treeRulesService.getNodePanelConfig(this.currentTreeType, this.effectiveNodeType, 'showMappingInTaskPanel');
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
    if (value != null && (typeof value === 'object' ? (value as any).id != null : true)) {
      return true;
    }
    const taskId = this.treeNodeForm?.get('taskId')?.value;
    const loaded = this.currentNodeTask as { id?: number } | null;
    return taskId != null && loaded != null && loaded.id === taskId;

  }

  /** True when a cartography is selected in the cartography panel. */
  get hasCartographySelected(): boolean {
    const value = this.treeNodeForm?.get('cartography')?.value;
    if (value != null && typeof value === 'object') {
      return (value as { id?: number }).id != null;
    }
    const cartographyId = this.treeNodeForm?.get('cartographyId')?.value;
    const loaded = this.currentNodeCartography as { id?: number } | null;
    return cartographyId != null && loaded != null && loaded.id === cartographyId;
  }

  /** Task whose parameters are shown (prefer full task in currentNodeTask when same id). */
  private get selectedTaskForParams(): { id?: number; properties?: unknown } | null {
    const formTask = this.treeNodeForm?.get('task')?.value as { id?: number; properties?: unknown } | null;
    const formTaskId = formTask != null && typeof formTask === 'object' ? formTask.id : undefined;
    if (this.currentNodeTask && (this.currentNodeTask as any).id === formTaskId) {
      return this.currentNodeTask as { id?: number; properties?: unknown };
    }
    if (formTask != null && typeof formTask === 'object') {
      return formTask;
    }
    return this.currentNodeTask ?? null;
  }

  /** Loads full task (with properties) for parameter guidance and sets currentNodeTask. */
  private loadFullTaskForParameterGuidance(taskId: number): void {
    if (!taskId) return;
    if (this.fullTaskLoadsInFlight.has(taskId)) {
      return;
    }
    this.fullTaskLoadsInFlight.add(taskId);
    firstValueFrom(this.taskService.get(taskId).pipe(timeout(5000))).then((fullTask) => {
      if (this.treeNodeForm?.get('taskId')?.value !== taskId) {
        this.fullTaskLoadsInFlight.delete(taskId);
        return;
      }
      this.currentNodeTask = fullTask;
      const currentTask = this.treeNodeForm?.get('task')?.value;
      if (currentTask == null && fullTask) {
        this.treeNodeForm.patchValue(
          {
            task: fullTask,
            taskName: fullTask.name,
            taskId: fullTask.id
          },
          { emitEvent: false }
        );
      }
      this.cdr.markForCheck();
      this.fullTaskLoadsInFlight.delete(taskId);
    }).catch(() => {
      // Keep existing currentNodeTask on error
      this.fullTaskLoadsInFlight.delete(taskId);
    });
  }

  /** Input parameter labels for the selected task (for panel guidance). */
  get taskInputParameterLabels(): string[] {
    const task = this.selectedTaskForParams;
    if (!task) {
      this.cachedTaskInputTaskId = null;
      this.cachedTaskInputPropertiesRef = undefined;
      this.cachedTaskInputLabels = [];
      return this.cachedTaskInputLabels;
    }
    const taskId = typeof task.id === 'number' ? task.id : null;
    const propertiesRef = task.properties;
    if (this.cachedTaskInputTaskId === taskId && this.cachedTaskInputPropertiesRef === propertiesRef) {
      return this.cachedTaskInputLabels;
    }
    const parameters = TaskPropertiesContract.getParameters(
      TaskPropertiesContract.fromRaw(task.properties)
    );
    this.cachedTaskInputLabels = parameters
      .map(p => (typeof p.label === 'string' && p.label.trim() ? p.label : p.name))
      .filter((name): name is string => typeof name === 'string' && name.trim().length > 0);
    this.cachedTaskInputTaskId = taskId;
    this.cachedTaskInputPropertiesRef = propertiesRef;
    return this.cachedTaskInputLabels;
  }

  /** Output parameter descriptors for the current view mode (key + i18n label key). */
  get taskOutputParametersForCurrentMode(): { key: string; label: string }[] {
    const mode = this.currentViewMode;
    if (!mode) return [];
    if (this.cachedTaskOutputMode === mode) {
      return this.cachedTaskOutputParameters;
    }
    this.cachedTaskOutputParameters = this.nodeOutputsControls
      .filter(noc => noc.views.includes(mode))
      .map(noc => ({ key: noc.key, label: noc.label }));
    this.cachedTaskOutputMode = mode;
    return this.cachedTaskOutputParameters;
  }

  /** Non-Label output controls visible for the current view mode (for Output Mapping tab). */
  get visibleOutputControls(): any[] {
    return this.nodeOutputsControls.filter(
      c => !c.key.includes('Label') && c.views.includes(this.currentViewMode)
    );
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
    this.normalizeSiblingOrderForSave(rootNode?.children || []);
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
  private normalizeSiblingOrderForSave(children: any[]): void {
    if (!Array.isArray(children) || children.length === 0) {
      return;
    }

    let nextOrder = 0;
    children.forEach((node) => {
      if (node?.status !== constants.entityStatus.pendingDelete) {
        node.order = nextOrder++;
      }
      this.normalizeSiblingOrderForSave(node?.children || []);
    });
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

  private getTreeNodeById(nodeId: string | number | null | undefined): FileNode | null {
    if (nodeId == null) {
      return null;
    }
    return this.getFlatNodesFromDataTree().find((node) => String(node.id) === String(nodeId)) ?? null;
  }

  /** Syncs disabled state of cartography/task/style controls with loading and availability flags (reactive-forms best practice). */
  private syncFormControlsDisabledState(): void {
    const cartography = this.treeNodeForm?.get('cartography');
    const task = this.treeNodeForm?.get('task');
    const style = this.treeNodeForm?.get('style');
    if (cartography) (this.cartographiesLoading ? cartography.disable : cartography.enable).call(cartography, { emitEvent: false });
    if (task) (this.tasksLoading ? task.disable : task.enable).call(task, { emitEvent: false });
    if (style) (this.availableStyles.length === 0 ? style.disable : style.enable).call(style, { emitEvent: false });
    this.syncActiveControlState();
    this.syncRadioControlState();
  }

  private syncActiveControlState(): void {
    const active = this.treeNodeForm?.get('active');
    const visible = this.treeNodeForm?.get('visible');
    if (!active || !visible) {
      return;
    }
    if (!visible.value && active.value) {
      active.setValue(false, { emitEvent: false });
    }
    const isCartographyLeaf = this.isCartographyLeaf({
      nodeType: this.effectiveNodeType,
      cartographyId: this.treeNodeForm?.get('cartographyId')?.value,
      taskId: this.treeNodeForm?.get('taskId')?.value,
    });
    const shouldDisable = !visible.value || !this.showLoadByDefaultToggle || !isCartographyLeaf;
    (shouldDisable ? active.disable : active.enable).call(active, { emitEvent: false });
    if (!isCartographyLeaf && active.value) {
      active.setValue(false, { emitEvent: false });
    }
  }

  private syncRadioControlState(): void {
    const radio = this.treeNodeForm?.get('radio');
    if (!radio) {
      return;
    }
    if (!this.showRadioToggle) {
      if (radio.value) {
        radio.setValue(false, { emitEvent: false });
      }
      radio.disable({ emitEvent: false });
      return;
    }
    const canEnable = this.canEnableRadioForCurrentNode();
    if (!canEnable && radio.value) {
      radio.setValue(false, { emitEvent: false });
    }
    (canEnable ? radio.enable : radio.disable).call(radio, { emitEvent: false });
  }

  private wireVisibleActiveSync(): void {
    this.treeNodeForm.get('visible')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.syncFormControlsDisabledState();
        if (!this.newElement && this.currentNodeId != null && this.treeNodeForm.dirty) {
          this.updateNode();
          this.cdr.markForCheck();
        }
      });

    this.treeNodeForm.get('active')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((active) => {
        if (active) {
          this.enforceRadioSiblingExclusivity();
        }
        this.syncActiveControlState();
        if (!this.newElement && this.currentNodeId != null && this.treeNodeForm.dirty) {
          this.updateNode();
          this.cdr.markForCheck();
        }
      });

    this.treeNodeForm.get('radio')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((radio) => {
        if (radio && !this.canEnableRadioForCurrentNode()) {
          this.treeNodeForm.get('radio')?.setValue(false, { emitEvent: false });
          return;
        }
        if (radio && this.currentNodeId != null) {
          this.clearExcessRadioDefaultsOnEnable(this.currentNodeId);
        }
        this.syncRadioControlState();
        if (!this.newElement && this.currentNodeId != null && this.treeNodeForm.dirty) {
          this.updateNode();
          this.cdr.markForCheck();
        }
      });
  }

  private enforceRadioSiblingExclusivity(): void {
    const parentId = this.treeNodeForm.get('parent')?.value;
    const currentId = this.treeNodeForm.get('id')?.value;
    if (parentId == null || currentId == null) {
      return;
    }
    const parentNode = this.enrichNodeWithTreeChildren(this.getTreeNodeById(parentId));
    if (!parentNode || !this.resolvePersistedRadio(parentNode)) {
      return;
    }
    this.getFlatNodesFromDataTree()
      .filter((node) => node.parent === parentId && node.id !== currentId && node.active === true)
      .forEach((sibling) => {
        this.sendNodeUpdated.next({
          ...sibling,
          active: false,
          status: sibling.status || constants.entityStatus.modified,
        });
      });
  }

  private clearExcessRadioDefaultsOnEnable(folderId: number | string): void {
    const defaultChildren = this.getFlatNodesFromDataTree()
      .filter((node) => node.parent === folderId && this.resolvePersistedActive(node));
    if (defaultChildren.length <= 1) {
      return;
    }
    defaultChildren.forEach((child) => {
      this.sendNodeUpdated.next({
        ...child,
        active: false,
        status: child.status || constants.entityStatus.modified,
      });
    });
  }

  initializeTreesNodeForm(): void {
    this.treeNodeForm = new UntypedFormGroup({
      id: new UntypedFormControl(null, []),
      name: new UntypedFormControl(null, [Validators.required]),
      tooltip: new UntypedFormControl(null, []),
      nodeType: new UntypedFormControl(null, []), // Optional for folders, will be validated conditionally
      cartography: new UntypedFormControl({ value: null, disabled: false }, []),
      radio: new UntypedFormControl(null, []),
      datasetURL: new UntypedFormControl(null, []),
      metadataURL: new UntypedFormControl(null, []),
      description: new UntypedFormControl(null, []),
      image: new UntypedFormControl(null, []),
      imageName: new UntypedFormControl(null, []),
      task: new UntypedFormControl({ value: null, disabled: false }, []),
      viewMode: new UntypedFormControl(null, []),
      filterable: new UntypedFormControl(null, []),
      visible: new UntypedFormControl(true, []),
      active: new UntypedFormControl(false, []),
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
      style: new UntypedFormControl({ value: null, disabled: true }, []),
      mapping: new UntypedFormControl(null, []),
    });
    this.wireVisibleActiveSync();
    this.syncFormControlsDisabledState();
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
      selectedMappingTarget: new UntypedFormControl(null, []),
      output: new UntypedFormGroup(outputGroup),
      input: new UntypedFormGroup({}),
      namespaces: new UntypedFormGroup({}),
    });
  }

  private deferUntilDialogOverlaySettled(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  private isCurrentNodeDetail(nodeId: string | number | null | undefined): boolean {
    return nodeId != null && this.currentNodeId != null && String(nodeId) === String(this.currentNodeId);
  }

  async nodeReceived(emitedObj) {
    const node = emitedObj.nodeClicked;
    this.lastFocusedNodeId = node.id;

    if (this.isSameNodeSelected(node.id)) {
      if (this.hasUnsavedDetailChanges()) {
        this.notificationService.showInfo('entity.tree.saveBeforeDeselect', '');
      } else {
        this.clearNodeSelection();
      }
      return;
    }

    if (this.hasNodeSelection && this.hasUnsavedDetailChanges()) {
      const discard = await this.confirmDiscardDetailChanges();
      if (!discard) {
        this.dataTree?.setSelectionHighlight(this.currentNodeId);
        return;
      }
      await this.deferUntilDialogOverlaySettled();
    }

    await this.loadNodeDetail(emitedObj);
  }

  private async loadNodeDetail(emitedObj) {
    const node = emitedObj.nodeClicked;
    const nodeParent = emitedObj.nodeParent;
    this.suppressPanelStateUpdates = true;
    this.newElement = false;
    this.cartographyFieldEditing = false;
    this.taskFieldEditing = false;
    this.treeNodeForm.reset({ emitEvent: false });

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
    const nameTranslationsModified = !!node.nameTranslationsModified;
    const descriptionTranslationsModified = !!node.descriptionTranslationsModified;
    const nameFormModified = !!node.nameFormModified;
    const descriptionFormModified = !!node.descriptionFormModified;
    if (node.id < 0) {
      status = "pendingCreation";
    }
    const formNodeType = nodeType ?? (this.currentNodeIsFolder
      ? (this.treeRulesService.getDefaultContainerTypeFromRules(this.currentTreeType, this.getAvailableFolderTypes())
          ?? this.getAvailableFolderTypes()[0]?.value ?? constants.treeRenderType.folder)
      : (this.treeRulesService.getDefaultLeafTypeFromRules(this.currentTreeType, this.getAvailableLeafTypes())
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
      visible: node.visible !== null && node.visible !== undefined ? node.visible : true,
      active: node.active === true,
      children: node.children,
      parent: node.parent,
      nameTranslationsModified: nameTranslationsModified,
      descriptionTranslationsModified: descriptionTranslationsModified,
      nameFormModified: nameFormModified,
      descriptionFormModified: descriptionFormModified,
      nameTranslations: node.nameTranslations,
      descriptionTranslations: node.descriptionTranslations,
      filterGetFeatureInfo: (node.filterGetFeatureInfo == null || false) ? "UNDEFINED" : node.filterGetFeatureInfo,
      filterGetMap: (node.filterGetMap == null || false) ? "UNDEFINED" : node.filterGetMap,
      filterSelectable: (node.filterSelectable == null || false) ? "UNDEFINED" : node.filterSelectable,
      style: node.style,
      status: status,
      type: currentType,
      mapping: node.mapping
    }, { emitEvent: false });
    this.syncFormControlsDisabledState();
    this.nodeImagePreviewState = 'stored';

    // If cartography not found in cache yet, load cartographies and then set it
    if (node.cartographyId && !cartographyObj) {
      this.loadCartographies().then(async () => {
        if (!this.isCurrentNodeDetail(node.id)) {
          return;
        }
        const loadedCartography = this.allCartographies.find(c => c.id === node.cartographyId);
        if (loadedCartography) {
          this.treeNodeForm.patchValue({
            cartography: loadedCartography,
            cartographyName: loadedCartography.name,
            cartographyId: loadedCartography.id
          }, { emitEvent: false });
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
      this.treeNodeForm.patchValue({ style: this.defaultStyleSentinel }, { emitEvent: false });
    } else if (currentStyle === null) {
      // If style is null and no default exists, use sentinel
      if (!this.hasDefaultStyle) {
        this.treeNodeForm.patchValue({ style: this.defaultStyleSentinel }, { emitEvent: false });
      }
    }

    // If task not found in cache yet, load tasks and then set it
    if (node.taskId && !taskObj) {
      this.loadTasks().then(async () => {
        if (!this.isCurrentNodeDetail(node.id)) {
          return;
        }
        let loadedTask = this.allTasks.find(t => t.id === node.taskId);
        if (loadedTask) {
          this.treeNodeForm.patchValue({
            task: loadedTask,
            taskName: loadedTask.name,
            taskId: loadedTask.id
          }, { emitEvent: false });
          this.currentNodeTask = loadedTask;
          this.loadFullTaskForParameterGuidance(node.taskId);
        } else {
          // Task not in getAll response (e.g. wrong type or pagination). Fetch by ID.
          try {
            loadedTask = await firstValueFrom(this.taskService.get(node.taskId));
            if (loadedTask) {
              if (!this.isAllowedTreeNodeTaskType(loadedTask)) {
                this.loggerService.warn(
                  'TreeNodesComponent.nodeReceived - Task type not allowed for tree node; clearing selection',
                  { taskId: node.taskId, typeId: this.resolveTaskTypeId(loadedTask) }
                );
                this.clearTaskSelection();
              } else {
                this.treeNodeForm.patchValue({
                  task: loadedTask,
                  taskName: loadedTask.name,
                  taskId: loadedTask.id
                }, { emitEvent: false });
                this.currentNodeTask = loadedTask;
                this.loadFullTaskForParameterGuidance(node.taskId);
              }
            }
          } catch {
            this.loggerService.error('TreeNodesComponent.nodeReceived - Failed to load task by ID', { taskId: node.taskId });
          }
        }
      });
    } else if (taskObj) {
      this.currentNodeTask = taskObj;
      this.loadFullTaskForParameterGuidance(node.taskId);
    }

    // Image preview is now handled by the ImagePreviewComponent via imageSource input

    // Load translations lazily without blocking selection rendering.
    const shouldLoadNodeTranslations = node.id >= 0 &&
      !this.translationLoadsCompleted.has(node.id) &&
      (!this.nameTranslations.has(node.id) || !this.descriptionTranslations.has(node.id));
    if (shouldLoadNodeTranslations) {
      this.ensureNodeTranslationsLoaded(node.id);
    }

    if (this.nameTranslations.has(node.id)) {
      const translations = this.nameTranslations.get(node.id);
      this.treeNodeForm.patchValue({
        nameTranslations: translations
      }, { emitEvent: false });
    }

    if (this.descriptionTranslations.has(node.id)) {
      const translations = this.descriptionTranslations.get(node.id);
      this.treeNodeForm.patchValue({
        descriptionTranslations: translations
      }, { emitEvent: false });
    }

    // Store original values for change detection
    this.currentNodeName = node.name || '';
    this.currentNodeDescription = node.description || '';

    // Mark form as pristine after loading node data (so dirty state only reflects user changes)
    this.treeNodeForm.markAsPristine();

    setTimeout(() => {
      this.suppressPanelStateUpdates = false;
      if (!this.isCurrentNodeDetail(node.id)) {
        return;
      }
      this.cdr.detectChanges();
      this.focusNameField();
    }, 0);
  }

  private ensureNodeTranslationsLoaded(nodeId: number): void {
    if (this.translationLoadsCompleted.has(nodeId) || this.translationLoadsInFlight.has(nodeId)) {
      return;
    }
    const inFlight = this.loadNodeTranslations(nodeId).finally(() => {
      this.translationLoadsInFlight.delete(nodeId);
      this.translationLoadsCompleted.add(nodeId);
    });
    this.translationLoadsInFlight.set(nodeId, inFlight);
  }

  createMappingParentTaskOptions(nodeParent) {
    const options = [];
    if (nodeParent && nodeParent.mapping) {
      const output = nodeParent.mapping.output;
      Object.keys(output).forEach(k => options.push({label: k, value: '${' + k + '}'}));
    }
    return options;
  }

  /**
   * Opens the form to create a new node of the given type under parent (null = root).
   * Type is chosen in the tree; form shows type as read-only.
   */
  async addNodeWithType(parent: FileNode | null, nodeType: string): Promise<void> {
    if (this.hasNodeSelection && this.hasUnsavedDetailChanges()) {
      const discard = await this.confirmDiscardDetailChanges();
      if (!discard) {
        return;
      }
      await this.deferUntilDialogOverlaySettled();
      this.clearNodeSelection();
    }

    this.suppressPanelStateUpdates = true;
    this.treeNodeForm.reset();
    this.newElement = true;
    this.currentNodeType = nodeType;
    this.currentFolderHasChildren = false;

    this.currentNodeId = this.idFictitiousCounter;
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
      visible: true,
      active: false
    });

    this.currentNodeName = '';
    this.currentNodeDescription = '';
    this.syncFormControlsDisabledState();
    this.cdr.detectChanges();
    this.suppressPanelStateUpdates = false;
    this.focusNameField();
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
        ? (this.treeRulesService.getDefaultContainerTypeFromRules(this.currentTreeType, this.getAvailableFolderTypes())
            ?? correctCodeList[0]?.value)
        : (this.treeRulesService.getDefaultLeafTypeFromRules(this.currentTreeType, this.getAvailableLeafTypes())
            ?? correctCodeList[0]?.value);

      if (defaultType) {
        this.treeNodeForm.patchValue({ nodeType: defaultType });
        this.currentNodeType = defaultType;
      }
      this.syncFormControlsDisabledState();
      this.cdr.detectChanges();
      return;
    }

    this.currentNodeType = type;
    this.syncFormControlsDisabledState();
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

    const maxLength = this.getMaxLengthForProperty('name');
    const useTextarea = this.getUseTextareaForProperty('name');
    const defaultLanguageValue = this.treeNodeForm.get('name')?.value || '';
    // Ensure translationsMap is always a Map (create empty one if null/undefined)
    const translationsMap = this.treeNodeForm.value.nameTranslations || this.utils.createTranslationsList(config.translationColumns.treeNodeName);
    const dialogResult = await this.utils.openTranslationDialog(
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

    const maxLength = this.getMaxLengthForProperty('description');
    const useTextarea = this.getUseTextareaForProperty('description');
    const defaultLanguageValue = this.treeNodeForm.get('description')?.value || '';
    // Ensure translationsMap is always a Map (create empty one if null/undefined)
    const translationsMap = this.treeNodeForm.value.descriptionTranslations || this.utils.createTranslationsList(config.translationColumns.treeNodeDescription);
    const dialogResult = await this.utils.openTranslationDialog(
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
    return this.cartographyService.fetchAllItems();
  };

  getAllTasks = (): Observable<any> => {
    const queryOpts: HalOptions = {
      params: [{ key: 'type.id', value: config.tasksTypes.query } as HalParam]
    };
    const editOpts: HalOptions = {
      params: [{ key: 'type.id', value: config.tasksTypes.edit } as HalParam]
    };
    return forkJoin({
      queryTasks: this.taskService.fetchAllItems(queryOpts, undefined, 'tasks'),
      editTasks: this.taskService.fetchAllItems(editOpts, undefined, 'tasks')
    }).pipe(
      map(({ queryTasks, editTasks }) =>
        this.mergeQueryAndEditTasks(queryTasks || [], editTasks || [])
      )
    );
  };

  /**
   * Merges query- and edit-type task lists from two API calls (single type.id filter per request).
   * Sorts each segment by name, then concatenates query tasks before edit tasks (deduped by id).
   */
  private mergeQueryAndEditTasks(queryTasks: any[], editTasks: any[]): any[] {
    const byName = (a: any, b: any): number =>
      String(a?.name ?? '').localeCompare(String(b?.name ?? ''), undefined, { sensitivity: 'base' });
    const q = [...(queryTasks || [])].sort(byName);
    const e = [...(editTasks || [])].sort(byName);
    const seen = new Set<number>();
    const out: any[] = [];
    for (const t of [...q, ...e]) {
      if (t?.id == null || seen.has(t.id)) {
        continue;
      }
      seen.add(t.id);
      out.push(t);
    }
    return out;
  }

  /** Stable keys for task autocomplete options (preserves list order in the overlay). */
  trackTaskOptionById(_index: number, task: { id?: number }): number {
    return task?.id ?? _index;
  }

  /** Resolves task type id from projection or full task shapes. */
  private resolveTaskTypeId(task: unknown): number | null {
    if (task == null || typeof task !== 'object') {
      return null;
    }
    const o = task as Record<string, unknown>;
    if (typeof o.typeId === 'number') {
      return o.typeId;
    }
    const type = o.type;
    if (type != null && typeof type === 'object' && 'id' in type) {
      const id = (type as { id?: unknown }).id;
      if (typeof id === 'number') {
        return id;
      }
    }
    return null;
  }

  /**
   * Tree nodes may only reference Query- or Edit-type tasks.
   * Tasks already present in {@link allTasks} are treated as allowed.
   */
  private isAllowedTreeNodeTaskType(task: unknown): boolean {
    if (task == null || typeof task !== 'object') {
      return false;
    }
    const id = (task as { id?: number }).id;
    if (id != null && this.allTasks.some((t) => t.id === id)) {
      return true;
    }
    const tid = this.resolveTaskTypeId(task);
    return tid === config.tasksTypes.query || tid === config.tasksTypes.edit;
  }

  private translateQueryScopeCode(scope: string | null): string | null {
    if (!scope) {
      return null;
    }
    const qs = constants.codeValue.queryTaskScope;
    if (scope === qs.sqlQuery) {
      return this.translateService.instant('entity.tree.taskQueryScopeSql');
    }
    if (scope === qs.webApiQuery) {
      return this.translateService.instant('entity.tree.taskQueryScopeWebApi');
    }
    if (scope === qs.cartographyQuery) {
      return this.translateService.instant('entity.tree.taskQueryScopeCartography');
    }
    return null;
  }

  private translateEditScopeCode(scope: string | null): string | null {
    if (!scope) {
      return null;
    }
    const es = constants.codeValue.editionTaskScope;
    if (scope === es.dbEdition) {
      return this.translateService.instant('entity.tree.taskEditScopeDatabase');
    }
    if (scope === es.cartographyEdition) {
      return this.translateService.instant('entity.tree.taskEditScopeCartography');
    }
    return null;
  }

  /**
   * Label shown next to the task name in the autocomplete (e.g. "Query (SQL)", "Edit (Cartography)").
   */
  getTaskKindDisplayForListItem(task: any): string {
    if (task == null || typeof task !== 'object') {
      return '';
    }
    const typeId = this.resolveTaskTypeId(task);
    const props = TaskPropertiesContract.fromRaw(task.properties);
    const scope = TaskPropertiesContract.getScope(props);
    if (typeId === config.tasksTypes.query) {
      const base = this.translateService.instant('entity.tree.taskKindQuery');
      const sc = this.translateQueryScopeCode(scope);
      return sc ? `${base} (${sc})` : base;
    }
    if (typeId === config.tasksTypes.edit) {
      const base = this.translateService.instant('entity.tree.taskKindEdit');
      const sc = this.translateEditScopeCode(scope);
      return sc ? `${base} (${sc})` : base;
    }
    return typeof task.typeTitle === 'string' ? task.typeTitle : '';
  }

  /** Kind + scope line for the currently selected task (below the task field). */
  get selectedTaskKindSummary(): string {
    const task = this.selectedTaskForParams as Record<string, unknown> | null;
    if (!task) {
      return '';
    }
    return this.getTaskKindDisplayForListItem(task);
  }

  /** Task group name for the selected task (full task or projection). */
  get selectedTaskGroupLabel(): string | null {
    const task = this.selectedTaskForParams as any;
    if (!task) {
      return null;
    }
    if (typeof task.groupName === 'string' && task.groupName.trim()) {
      return task.groupName;
    }
    const g = task.group;
    if (g != null && typeof g === 'object' && typeof (g as { name?: string }).name === 'string') {
      return (g as { name: string }).name;
    }
    return null;
  }

  /** One-line mat-hint: kind/scope and group separated by · */
  get selectedTaskHintLine(): string {
    const kind = this.selectedTaskKindSummary;
    const group = this.selectedTaskGroupLabel;
    const groupPart = group
      ? `${this.translateService.instant('entity.tree.groupTask')}: ${group}`
      : '';
    if (kind && groupPart) {
      return `${kind} · ${groupPart}`;
    }
    return kind || groupPart;
  }

  getAllServices = (): Observable<any> => {
    return this.serviceService.fetchAllItems().pipe(
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
          title: this.utils.getTranslate('entity.tree.services'),
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

    // Tree node stores a single URL; WMS may repeat MetadataURL/DataURL — keep first only.
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
    newNode.visible = true;
    newNode.active = false;
    return newNode;
  }

  changeServiceDataByCapabilities(serviceCapabilitiesData, _refresh?): Array<any> {
    const capabilitiesLayers = [];
    const data = serviceCapabilitiesData.WMT_MS_Capabilities != undefined ? serviceCapabilitiesData.WMT_MS_Capabilities : serviceCapabilitiesData.WMS_Capabilities;
    if (data != undefined) {
      let capability = data.Capability.Layer;
      while (capability.Layer != null) {
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
    this.markImageChangeAsModified(form);
    input.readOnly = false;
    input.focus();
  }

  removeImage(formtype) {
    const form = this.getFormByType(formtype);
    form.patchValue({
      image: null,
      imageName: null,
    });
    this.markImageChangeAsModified(form);
  }

  onImageChange(formtype, event) {
    const input = event.target;
    if (!input.readOnly) {
      const form = this.getFormByType(formtype);
      form.patchValue({
        image: input.value
      });
      this.markImageChangeAsModified(form);
    }
  }

  async onImageSelected(formtype, event): Promise<void> {
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const { supportedFormats, maxBytes } = await firstValueFrom(this.adminConfigService.getTreeImageUploadConfiguration());
      const validation = validateImageUpload(file, supportedFormats, maxBytes);
      if (!validation.valid) {
        this.errorHandler.handleError(null, getImageUploadErrorKey(validation.error!), validation.errorParams);
        fileInput.value = '';
        return;
      }
      const form = this.getFormByType(formtype);
      const reader = new FileReader();
      reader.onload = () => {
        form.patchValue({
          image: reader.result,
          imageName: file.name
        });
        this.nodeImagePreviewState = 'uploaded';
        this.markImageChangeAsModified(form);
        if (!this.newElement) {
          this.updateNode();
        }
      };
      reader.readAsDataURL(file);
    }
    // Allow selecting the same filename again in subsequent uploads.
    fileInput.value = '';
  }

  private markImageChangeAsModified(form: UntypedFormGroup): void {
    form.markAsDirty();
    if (!this.newElement && form.get('id')?.value >= 0) {
      form.patchValue({
        status: "Modified"
      });
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
    this.applyTaskInputDefaultsFromMetadata(origMapping);
    const firstNonLabelKey = this.nodeOutputsControls
      .filter(c => c.views.includes(this.currentViewMode) && !c.key.includes('Label'))
      .map(c => c.key)[0] ?? null;
    this.fieldsConfigForm.patchValue({ selectedMappingTarget: firstNonLabelKey });

    const dialogRef = this.dialog.open(DialogFormComponent);
    dialogRef.componentInstance.HTMLReceived = this.fieldsConfigDialog;
    dialogRef.componentInstance.title = this.utils.getTranslate('entity.tree.fieldsConfig');
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
    this.clearTaskInputFormControls();
    this.getAllElementsEventTasks.next(this.treeNodeForm.value);
    const task =
      this.currentNodeTask && this.currentNodeTask.id !== this.treeNodeForm.value.taskId
        ? this.currentNodeTask
        : await firstValueFrom(this.taskService.get(this.treeNodeForm.value.taskId));
    if (!task) {
      return;
    }
    const inputFormGroup = this.fieldsConfigForm.get('input') as UntypedFormGroup;
    const parameters = TaskPropertiesContract.getParameters(task.properties);
    if (parameters.length > 0) {
      parameters.forEach(par => {
        const control = this.toTreeNodeTaskInputParameter(par);
        if (!control) {
          return;
        }
        this.nodeInputsControls.push(control);
        const newGroup = new UntypedFormGroup({
          value: new UntypedFormControl('', []),
          calculated: new UntypedFormControl(false, [])
        });
        inputFormGroup.addControl(String(control.name), newGroup);
      });
    }
  }

  private toTreeNodeTaskInputParameter(raw: Record<string, unknown>): TreeNodeTaskInputParameter | null {
    if (typeof raw.name !== 'string' || raw.name.trim().length === 0) {
      return null;
    }
    const label = typeof raw.label === 'string' && raw.label.trim().length > 0
      ? raw.label
      : raw.name;
    return {
      name: raw.name,
      label,
      value: raw.value ?? null
    };
  }

  /**
   * Formats a task parameter default for display, autocomplete options, and form prefill.
   */
  formatTaskParameterDefaultForInput(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  }

  /**
   * When opening field configuration, prefill input mapping from task metadata only if
   * the node has no saved entry for that parameter key (unset vs explicit null in saved input).
   */
  private applyTaskInputDefaultsFromMetadata(origMapping: { input?: Record<string, { value?: unknown }> } | null): void {
    const inputGroup = this.fieldsConfigForm.get('input') as UntypedFormGroup | null;
    if (!inputGroup) {
      return;
    }
    const savedInput = origMapping?.input;
    this.nodeInputsControls.forEach((param) => {
      const key = param.name;
      if (savedInput && Object.prototype.hasOwnProperty.call(savedInput, key)) {
        return;
      }
      const formatted = this.formatTaskParameterDefaultForInput(param.value);
      if (formatted === '') {
        return;
      }
      const group = inputGroup.get(key) as UntypedFormGroup | null;
      group?.patchValue({ value: formatted }, { emitEvent: false });
    });
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
    const formValue = this.treeNodeForm.getRawValue();
    const cartography = formValue.cartography;
    const task = formValue.task;
    const directChildren = this.getDirectChildrenForNode(formValue.id);
    const normalizedActive = this.resolvePersistedActive({
      visible: formValue.visible,
      active: formValue.active,
      nodeType: formValue.nodeType,
      cartographyId: formValue.cartographyId,
      taskId: formValue.taskId,
    });
    const normalizedRadio = this.resolvePersistedRadio({
      nodeType: formValue.nodeType,
      radio: formValue.radio,
      children: directChildren,
    });
    const nodeUpdate = {
      ...formValue,
      nodeType: formValue.nodeType,
      cartography: cartography != null && typeof cartography === 'object' ? cartography : null,
      task: task != null && typeof task === 'object' ? task : null,
      active: normalizedActive,
      radio: normalizedRadio,
    };
    // Only push to tree when the user has actually changed the form; avoids tree showing "Modified" when e.g. opening the mapping dialog
    if (!this.treeNodeForm.dirty) {
      return;
    }
    if (formValue.id == null) {
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
          this.getAllElementsEventTasks.next(this.treeNodeForm.getRawValue());
        }
        if ([constants.treeDomainKey.cartography, constants.treeDomainKey.task].includes(effectiveType)) {
          const cartographyId = this.treeNodeForm.get('cartographyId').value;
          this.currentNodeCartography = cartographyId ? await firstValueFrom(this.cartographyService.get(cartographyId)) : cartographyId;
          this.getAllElementsEventCartographies.next(this.treeNodeForm.getRawValue());
        }
      } else {
        await this.updateCartographyTreeLeft(null);
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
    if (!node.parent || node.parent < 0) {
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
    type SaveOutcome = { oldId: number; result: TreeNode };
    type RadioActivationTask = { parentId: number | null; run: () => Promise<SaveOutcome> };
    const radioDeactivationTasks: Array<() => Promise<SaveOutcome>> = [];
    const radioActivationTasks: RadioActivationTask[] = [];
    const otherSaveTasks: Array<() => Promise<SaveOutcome>> = [];

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
      treeNodeObj.visible = treeNode.visible !== false;
      treeNodeObj.active = this.resolvePersistedActive(treeNode);
      treeNodeObj.radio = this.resolvePersistedRadio(treeNode);
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
          && !this.treeRulesService.canNodeTypeHaveChildren(this.currentTreeType, treeNode.nodeType)
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
        } else {
          treeNodeObj.cartography = null;
        }
        if (treeNode.taskId) {
          treeNodeObj.task = this.taskService.createProxy(treeNode.taskId);
        } else {
          treeNodeObj.task = null;
        }
      }

      if (treeNode.status !== "pendingDelete") {
          let currentParent;
          if (treeNode.parent !== null) {
            if (treeNode.parent >= 0) {
              const parentNode = treesNodesToUpdate.find(element => element.id === treeNode.parent)
                ?? this.getTreeNodeById(treeNode.parent);
              if (parentNode) {
                currentParent = parentNode;
                currentParent.tree = tree;
              } else {
                currentParent = undefined;
              }
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
            const saveTask = async (): Promise<SaveOutcome> => {
              try {
                const result = await firstValueFrom(this.treeNodeService.save(treeNodeObj));
                this.loggerService.debug('TreeNodesComponent.updateAllTreeNodes - TreeNode saved successfully', {
                  originalId: treeNode.id,
                  savedId: result.id,
                  savedName: result.name
                });
                const oldId = treeNode.id;
                this.patchCurrentNodeImageFromSavedResult(oldId, result);

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
                if (mapNewIdentificators.has(oldId)) {
                  await this.updateAllTreeNodes(mapNewIdentificators.get(oldId), depth + 1, mapNewIdentificators, [], result.id, result, tree, entityID);
                }
                return { oldId, result };
              } catch (error) {
                this.loggerService.error('Error saving tree node', error);
                throw error;
              }
            };
            const radioPhase = this.classifyRadioSiblingSavePhase(treeNode, treesNodesToUpdate);
            if (radioPhase === 'deactivate') {
              radioDeactivationTasks.push(saveTask);
            } else if (radioPhase === 'activate') {
              radioActivationTasks.push({
                parentId: treeNode.parent ?? null,
                run: saveTask,
              });
            } else {
              otherSaveTasks.push(saveTask);
            }
          }
        }
    }

    const deactivationOutcomes = await Promise.all(radioDeactivationTasks.map((task) => task()));
    this.reconcileSavedNodes(treesNodesToUpdate, deactivationOutcomes);

    const activationGroups = new Map<number | null, Array<() => Promise<SaveOutcome>>>();
    radioActivationTasks.forEach(({ parentId, run }) => {
      const group = activationGroups.get(parentId) ?? [];
      group.push(run);
      activationGroups.set(parentId, group);
    });
    const activationOutcomes = await Promise.all(
      [...activationGroups.values()].map(async (group) => {
        const outcomes: SaveOutcome[] = [];
        for (const run of group) {
          outcomes.push(await run());
        }
        return outcomes;
      })
    );
    this.reconcileSavedNodes(treesNodesToUpdate, activationOutcomes.flat());

    const otherOutcomes = await Promise.all(otherSaveTasks.map((task) => task()));
    this.reconcileSavedNodes(treesNodesToUpdate, otherOutcomes);
    for (const treeNode of nodesToDelete) {
      this.loggerService.debug('TreeNodesComponent.updateAllTreeNodes - Deleting node', {
        nodeId: treeNode.id,
        nodeName: treeNode.name,
        depth: this.calculateNodeDepth(treeNode, treesNodesToUpdate)
      });

      await firstValueFrom(this.treeNodeService.deleteById(treeNode.id));
    }
  }

  private reconcileSavedNodes(
    treesNodesToUpdate: any[],
    outcomes: Array<{ oldId: number; result: TreeNode }>
  ): void {
    outcomes.forEach(({ oldId, result }) => {
      const index = treesNodesToUpdate.findIndex((node) => node.id === oldId);
      if (index >= 0) {
        treesNodesToUpdate[index] = result;
      }
    });
  }

  private enrichNodeWithTreeChildren(node: any | null): any | null {
    if (!node) {
      return null;
    }
    const fromTree = this.getTreeNodeById(node.id);
    if (!fromTree) {
      return node;
    }
    return {
      ...node,
      children: fromTree.children ?? node.children ?? [],
    };
  }

  private getPersistedActiveBeforeEdit(treeNode: { id?: number; active?: boolean }): boolean {
    if (treeNode.id == null) {
      return false;
    }
    const original = this.dataTree?.originalNodeStates?.get(treeNode.id);
    if (original) {
      return original.active === true;
    }
    return false;
  }

  private patchCurrentNodeImageFromSavedResult(previousId: number, savedNode: TreeNode): void {
    const selectedId = this.treeNodeForm?.get('id')?.value;
    if (selectedId !== previousId && selectedId !== savedNode.id) {
      return;
    }
    this.treeNodeForm.patchValue({
      id: savedNode.id,
      image: savedNode.image ?? null,
      imageName: savedNode.imageName ?? null,
    }, { emitEvent: false });
    this.currentNodeId = savedNode.id;
    this.nodeImagePreviewState = 'stored';
  }

  private isCartographyLeaf(node: {
    nodeType?: string;
    cartographyId?: number | null;
    taskId?: number | null;
  }): boolean {
    return node.nodeType === constants.treeDomainKey.cartography
      && !!node.cartographyId
      && !node.taskId;
  }

  private folderHasOnlyCartographyLeafChildren(folder: { children?: any[] }): boolean {
    const children = folder.children ?? [];
    return children.every((child) => this.isCartographyLeaf(child));
  }

  private getDirectChildrenForNode(nodeId: string | number | null | undefined): any[] {
    if (nodeId == null) {
      return [];
    }
    return this.getTreeNodeById(nodeId)?.children ?? [];
  }

  private canEnableRadioForCurrentNode(): boolean {
    const nodeId = this.treeNodeForm?.get('id')?.value;
    const directChildren = this.getDirectChildrenForNode(nodeId);
    return this.folderHasOnlyCartographyLeafChildren({ children: directChildren });
  }

  private findParentInNodeList(treeNode: { parent?: number | null }, nodes: any[]): any | null {
    if (treeNode.parent == null) {
      return null;
    }
    return nodes.find((node) => node.id === treeNode.parent)
      ?? this.getTreeNodeById(treeNode.parent);
  }

  private classifyRadioSiblingSavePhase(
    treeNode: {
      id?: number;
      parent?: number | null;
      visible?: boolean;
      active?: boolean;
      nodeType?: string;
      cartographyId?: number | null;
      taskId?: number | null;
    },
    nodes: any[]
  ): 'deactivate' | 'activate' | null {
    const parent = this.enrichNodeWithTreeChildren(this.findParentInNodeList(treeNode, nodes));
    if (!parent || !this.resolvePersistedRadio(parent)) {
      return null;
    }
    const originalActive = this.getPersistedActiveBeforeEdit(treeNode);
    const intendedActive = this.resolvePersistedActive(treeNode);
    if (originalActive && !intendedActive) {
      return 'deactivate';
    }
    if (intendedActive) {
      return 'activate';
    }
    return null;
  }

  private resolvePersistedRadio(treeNode: {
    nodeType?: string;
    radio?: boolean;
    children?: any[];
  }): boolean {
    const isFolder = this.treeRulesService.canNodeTypeHaveChildren(this.currentTreeType, treeNode.nodeType ?? null);
    if (!isFolder
      || !this.treeRulesService.supportsNodeCapability(this.currentTreeType, 'folder', 'radio')
      || treeNode.radio !== true) {
      return false;
    }
    return this.folderHasOnlyCartographyLeafChildren(treeNode);
  }

  private showStyleError() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate("Error");
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.componentInstance.message = this.utils.getTranslate("entity.tree.styleError");
    dialogRef.afterClosed().subscribe();
  }

  private resolvePersistedActive(treeNode: {
    visible?: boolean;
    active?: boolean;
    nodeType?: string;
    cartographyId?: number | null;
    taskId?: number | null;
  }): boolean {
    const visible = treeNode.visible !== false;
    return visible && this.isCartographyLeaf(treeNode) && treeNode.active === true;
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

  private showCartographyRequiredError(): void {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('Error');
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.componentInstance.message = this.utils.getTranslate('entity.tree.cartographyNonSelectedMessage');
    dialogRef.afterClosed().subscribe();
  }

  /** Leaf nodes in cartography trees must pick a layer; edition and task nodes do not. */
  private requiresCartographySelection(): boolean {
    return !this.currentNodeIsFolder
      && this.currentTreeType !== this.codeValues.treeType.edition
      && this.getEffectiveNodeType() !== constants.treeDomainKey.task;
  }

  public async getSelectedRowsCartographies(data: any[]) {
    let cartography = null;
    if (!this.currentNodeIsFolder && (!data || data.length == 0)) {
      cartography = this.currentNodeCartography;
    }
    if ((data.length <= 0 && this.treeNodeForm.value.cartographyName == null)
      && this.requiresCartographySelection()) {
      this.showCartographyRequiredError();
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
      await this.updateAvailableStyles(cartography.id);
    } else {
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
    this.syncFormControlsDisabledState();
  }

  updateTreeLeft() {
    if (this.newElement) {
      this.idFictitiousCounter--;
      const value = {
        ...this.treeNodeForm.value,
        parent: this.treeNodeForm.value.parent ?? null
      };
      this.createNodeEvent.next(value);
      this.savingNode = false;
      this.newElement = false;
      this.currentNodeType = null;
      this.currentNodeId = null;
      this.treeNodeForm.reset({ emitEvent: false });
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

  isSameNodeSelected(id: string | number | null | undefined): boolean {
    if (id == null || this.currentNodeId == null) {
      return false;
    }
    return String(id) === String(this.currentNodeId);
  }

  /**
   * True when switching away from the detail panel should confirm discard.
   * Uses the tree node status (pendingCreation) and unapplied form edits (dirty),
   * not persisted tree metadata copied into form controls (nameFormModified, etc.).
   */
  hasUnsavedDetailChanges(): boolean {
    if (!this.treeNodeForm) {
      return false;
    }
    if (this.newElement) {
      const name = this.treeNodeForm.get('name')?.value;
      return this.treeNodeForm.dirty || (typeof name === 'string' && name.trim() !== '');
    }
    if (this.currentNodeId == null) {
      return false;
    }
    const treeNode = this.getTreeNodeById(this.currentNodeId);
    if (treeNode?.status === constants.entityStatus.pendingCreation) {
      return true;
    }
    return this.treeNodeForm.dirty;
  }

  /** Save is enabled only when there are valid, unapplied changes for the current node. */
  get canSaveNodeDetail(): boolean {
    if (!this.treeNodeForm) {
      return false;
    }
    if (this.newElement) {
      return this.hasUnsavedDetailChanges() && this.treeNodeForm.valid;
    }
    return this.canUpdateNode();
  }

  /** Node name shown in the detail toolbar title (falls back to unnamed). */
  get detailHeaderName(): string {
    const name = this.treeNodeForm?.get('name')?.value;
    if (typeof name === 'string' && name.trim() !== '') {
      return name.trim();
    }
    return this.translateService.instant('entity.tree.unnamedNode');
  }

  clearNodeSelection(): void {
    const focusId = this.lastFocusedNodeId;
    this.currentNodeId = null;
    this.newElement = false;
    this.currentNodeType = null;
    this.treeNodeForm.reset({ emitEvent: false });
    this.dataTree?.clearSelection();
    this.cdr.detectChanges();
    if (focusId != null) {
      setTimeout(() => this.focusTreeNodeRow(focusId), 0);
    }
  }

  tryCloseDetail(): boolean {
    if (this.hasUnsavedDetailChanges()) {
      this.notificationService.showInfo('entity.tree.saveBeforeDeselect', '');
      return false;
    }
    this.clearNodeSelection();
    return true;
  }

  async confirmDiscardDetailChanges(): Promise<boolean> {
    const dialogRef = this.dialog.open(DialogMessageComponent, {
      width: '400px',
      data: {
        title: 'entity.tree.discardNodeChanges.title',
        message: 'entity.tree.discardNodeChanges.message',
        acceptLabel: 'entity.tree.discardNodeChanges.discard',
        cancelLabel: 'entity.tree.discardNodeChanges.keepEditing',
        destructive: true,
      },
    });
    const result = await firstValueFrom(dialogRef.afterClosed());
    return result?.event === DIALOG_EVENTS.ACCEPT;
  }

  async onCloseDetailClicked(): Promise<void> {
    if (!this.hasUnsavedDetailChanges()) {
      this.tryCloseDetail();
      return;
    }
    const discard = await this.confirmDiscardDetailChanges();
    if (discard) {
      await this.deferUntilDialogOverlaySettled();
      this.clearNodeSelection();
    }
  }


  private focusNameField(): void {
    setTimeout(() => {
      const input = document.querySelector(
        '.detail-panel input[formcontrolname="name"]'
      ) as HTMLInputElement | null;
      input?.focus();
    }, 0);
  }

  private focusTreeNodeRow(nodeId: number | string): void {
    const row = document.querySelector(
      `[data-node-id="${nodeId}"] .node-name`
    ) as HTMLElement | null;
    row?.focus();
  }

  generateFieldsConfigTree(): void {
    if (this.parseInput(this.fieldsConfigForm.value.taskResponse)) {
      this.fieldsConfigTreeGenerated = true;
    }
  }

  hideFieldsConfigTree(): void {
    this.fieldsConfigTreeGenerated = false;
  }

  getFieldConfigInput = (): Observable<any> => {
    return of(this.parsedData);
  };

  /** Parses pasted task response text into {@link parsedData}. Returns false when input is invalid. */
  parseInput(inputText: string | null | undefined): boolean {
    this.parsedData = {
      data: {},
      dataType: 'json'
    };
    const trimmed = inputText?.trim();
    if (!trimmed) {
      this.showFieldsConfigParseError('nodeMapping.treeParseEmpty');
      return false;
    }
    try {
      const parsed = this.parseResponseStructure(trimmed);
      if (!this.isTreeParseRoot(parsed.data)) {
        this.showFieldsConfigParseError('nodeMapping.treeParseInvalid');
        return false;
      }
      this.parsedData = parsed;
      this.namespaces = this.getNamespacesKeys(this.parsedData.data);
      this.clearNamespacesFormControls();
      this.addNamespacesControl(null);
      return true;
    } catch (error) {
      this.loggerService.error('TreeNodesComponent.parseInput - Failed to parse task response', error);
      this.showFieldsConfigParseError('nodeMapping.treeParseInvalid');
      return false;
    }
  }

  private parseResponseStructure(text: string): { data: unknown; dataType: 'json' | 'xml' } {
    if (this.looksLikeJson(text)) {
      return { data: JSON.parse(text), dataType: 'json' };
    }
    if (!this.looksLikeXml(text)) {
      throw new Error('Unsupported response format');
    }
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@'
    });
    return { data: parser.parse(text), dataType: 'xml' };
  }

  private looksLikeJson(text: string): boolean {
    const first = text.trimStart()[0];
    return first === '{' || first === '[';
  }

  private looksLikeXml(text: string): boolean {
    return text.trimStart().startsWith('<');
  }

  private isTreeParseRoot(data: unknown): boolean {
    return data !== null && (Array.isArray(data) || typeof data === 'object');
  }

  private showFieldsConfigParseError(messageKey: string): void {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('common.atention');
    dialogRef.componentInstance.message = this.utils.getTranslate(messageKey);
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
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

  fieldTreeNode(node) {
    let path = node.path ?? '/';
    if (path.includes('@/')) {
      path = path.replace('@/', '@');
    }
    this.selectedXPath = path;
    const attribute = this.fieldsConfigForm.get('selectedMappingTarget')?.value;
    if (attribute) {
      const formValue = { value: this.selectedXPath };
      this.fieldsConfigForm.get('output')?.get(attribute)?.patchValue(formValue);
    }
  }

  onViewModeChange(value) {
    this.currentViewMode = value;
    this.treeNodeForm.patchValue({
      viewMode: value,
    });
  }

  /** Lookup label control for a given output key (e.g. leftbtn -> leftbtnLabel). */
  getLabelControlForOutput(key: string): any | null {
    const c = this.outputLabelControlMap.get(key);
    return c && c.views.includes(this.currentViewMode) ? c : null;
  }

  trackByControlKey(_index: number, control: any): string {
    return control.key;
  }

  /** Stable identity for input-mapping autocomplete app/parent options (string `value` is unique per option). */
  trackByMappingOptionValue(_index: number, opt: { value: string }): string {
    return opt.value;
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
        this.translationService.fetchAllItems().pipe(
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
      // Keep current detail form in sync when async translations arrive after selection.
      if (this.currentNodeId === nodeId) {
        const patch: any = {};
        if (this.nameTranslations.has(nodeId)) {
          patch.nameTranslations = this.nameTranslations.get(nodeId);
        }
        if (this.descriptionTranslations.has(nodeId)) {
          patch.descriptionTranslations = this.descriptionTranslations.get(nodeId);
        }
        if (Object.keys(patch).length > 0) {
          this.treeNodeForm.patchValue(patch);
          this.cdr.markForCheck();
        }
      }
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
    if (!this.hasNodeSelection) {
      return;
    }
    event.preventDefault();
    this.isResizing = true;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onDocumentEscape(event: KeyboardEvent): void {
    if (!this.hasNodeSelection || this.dialog.openDialogs.length > 0) {
      return;
    }
    event.preventDefault();
    this.tryCloseDetail();
  }

  @HostListener('document:mousemove', ['$event'])
  onResize(event: MouseEvent): void {
    if (!this.isResizing || !this.hasNodeSelection) {
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
      this.syncFormControlsDisabledState();
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
      this.syncFormControlsDisabledState();
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

      if (task.typeTitle && task.typeTitle.toLowerCase().includes(term)) {
        return true;
      }

      return !!(task.groupName && task.groupName.toLowerCase().includes(term));


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
    const taskNameFallback = this.treeNodeForm?.get('taskName')?.value ?? null;
    if (!task) {
      return taskNameFallback;
    }
    if (typeof task === 'object') {
      const n = task.name;
      if (n != null && String(n).trim().length > 0) {
        return n;
      }
      return taskNameFallback;
    }
    return null;
  };

  /**
   * Handles cartography selection from autocomplete.
   * Replaces the logic from getSelectedRowsCartographies.
   */
  async onCartographySelected(event: MatAutocompleteSelectedEvent): Promise<void> {
    const cartography = event.option.value;

    if (!cartography) {
      if (this.treeNodeForm.value.cartographyName !== null) {
        if (this.requiresCartographySelection()) {
          this.showCartographyRequiredError();
          const previous =
            this.treeNodeForm.get('oldCartography')?.value
            ?? this.treeNodeForm.get('cartography')?.value
            ?? this.currentNodeCartography;
          if (previous) {
            this.treeNodeForm.patchValue({ cartography: previous });
          }
          return;
        }
        await this.updateCartographyTreeLeft(null);
      }
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
    this.cartographyFieldEditing = false;
    this.cdr.markForCheck();
  }

  /** Selected cartography shown as an in-field link (mat-select-trigger style). */
  get showCartographyAsLink(): boolean {
    return !this.cartographyFieldEditing && this.getCartographyFormLink() != null;
  }

  /** Selected task shown as an in-field link (mat-select-trigger style). */
  get showTaskAsLink(): boolean {
    return !this.taskFieldEditing && this.getTaskFormLink() != null;
  }

  startCartographyEdit(): void {
    this.cancelCartographyFieldBlur();
    this.cartographyFieldEditing = true;
    this.cdr.markForCheck();
    setTimeout(() => this.cartographyInputRef?.nativeElement?.focus());
  }

  startTaskEdit(): void {
    this.cancelTaskFieldBlur();
    this.taskFieldEditing = true;
    this.cdr.markForCheck();
    setTimeout(() => this.taskInputRef?.nativeElement?.focus());
  }

  private cancelCartographyFieldBlur(): void {
    if (this.cartographyFieldBlurTimeout != null) {
      clearTimeout(this.cartographyFieldBlurTimeout);
      this.cartographyFieldBlurTimeout = null;
    }
  }

  private cancelTaskFieldBlur(): void {
    if (this.taskFieldBlurTimeout != null) {
      clearTimeout(this.taskFieldBlurTimeout);
      this.taskFieldBlurTimeout = null;
    }
  }

  onCartographyFieldBlur(event: FocusEvent): void {
    const related = event.relatedTarget as HTMLElement | null;
    if (related?.closest('.entity-field-clear-button')) {
      return;
    }
    this.cancelCartographyFieldBlur();
    this.cartographyFieldBlurTimeout = setTimeout(() => {
      this.cartographyFieldBlurTimeout = null;
      this.cartographyFieldEditing = false;
      this.cdr.markForCheck();
    }, 150);
  }

  onCartographyFieldContainerClick(event: MouseEvent): void {
    if (!this.showCartographyAsLink) {
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest('.entity-field-link-overlay a.router-link')) {
      return;
    }
    this.startCartographyEdit();
  }

  onCartographyFieldInputPointerDown(event: MouseEvent): void {
    if (!this.showCartographyAsLink) {
      return;
    }
    event.preventDefault();
    this.startCartographyEdit();
  }

  /**
   * Clears the selected cartography so the user can pick another (same UX as task clear).
   */
  clearCartographySelection(event?: MouseEvent): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.cancelCartographyFieldBlur();

    this.treeNodeForm.patchValue({
      cartography: '',
      cartographyName: null,
      cartographyId: null
    });
    this.filteredCartographies = [...this.allCartographies];
    this.currentNodeCartography = null;
    this.cartographyFieldEditing = true;
    void this.updateAvailableStyles(null);
    if (!this.newElement && this.treeNodeForm.get('id')?.value >= 0) {
      this.treeNodeForm.patchValue({ status: 'Modified' });
    }
    this.treeNodeForm.markAsDirty();
    this.cdr.markForCheck();

    requestAnimationFrame(() => {
      this.cartographyInputRef?.nativeElement?.focus();
      this.cartographyAutocompleteTrigger?.openPanel();
      this.updateNode();
    });
  }

  onTaskFieldBlur(event: FocusEvent): void {
    const related = event.relatedTarget as HTMLElement | null;
    if (related?.closest('.entity-field-clear-button')) {
      return;
    }
    this.cancelTaskFieldBlur();
    this.taskFieldBlurTimeout = setTimeout(() => {
      this.taskFieldBlurTimeout = null;
      this.taskFieldEditing = false;
      this.cdr.markForCheck();
    }, 150);
  }

  onTaskFieldContainerClick(event: MouseEvent): void {
    if (!this.showTaskAsLink) {
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest('.entity-field-link-overlay a.router-link')) {
      return;
    }
    this.startTaskEdit();
  }

  onTaskFieldInputPointerDown(event: MouseEvent): void {
    if (!this.showTaskAsLink) {
      return;
    }
    event.preventDefault();
    this.startTaskEdit();
  }

  /**
   * Clears the selected task (user-initiated unset).
   */
  clearTaskSelection(event?: MouseEvent): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.cancelTaskFieldBlur();
    this.treeNodeForm.patchValue({
      task: null,
      taskName: null,
      taskId: null
    });
    this.currentNodeTask = null;
    this.taskFieldEditing = false;
    if (!this.newElement && this.treeNodeForm.get('id')?.value >= 0) {
      this.treeNodeForm.patchValue({ status: 'Modified' });
    }
    this.treeNodeForm.markAsDirty();
    this.updateNode();
    this.cdr.markForCheck();
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

    if (!this.isAllowedTreeNodeTaskType(task)) {
      this.loggerService.warn('TreeNodesComponent.onTaskSelected - Task type not allowed for tree node', {
        taskId: (task as { id?: number })?.id,
        typeId: this.resolveTaskTypeId(task)
      });
      this.treeNodeForm.get('task')?.setValue(null, { emitEvent: false });
      this.clearTaskSelection();
      return;
    }

    // Material autocomplete has already set the form control
    this.updateTaskTreeLeft(task);
    if (task?.id) {
      this.loadFullTaskForParameterGuidance(task.id);
    }
    this.taskFieldEditing = false;
    this.cdr.markForCheck();
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
      this.syncFormControlsDisabledState();
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
      this.syncFormControlsDisabledState();
    } catch (error) {
      this.loggerService.error('TreeNodesComponent.updateAvailableStyles - Error loading styles', error);
      this.availableStyles = [];
      this.currentCartographyStyles = [];
      this.hasDefaultStyle = false;
      this.treeNodeForm.patchValue({ style: this.defaultStyleSentinel });
      this.syncFormControlsDisabledState();
    }
  }

  isPanelExpanded(panelId: string): boolean {
    return this.expandedPanelIds.has(panelId);
  }

  onPanelStateChange(panelId: string, isExpanded: boolean): void {
    if (this.suppressPanelStateUpdates) {
      return;
    }
    if (isExpanded) {
      this.expandedPanelIds.add(panelId);
    } else {
      this.expandedPanelIds.delete(panelId);
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
    this.syncFormControlsDisabledState();
  }

  /**
   * Lifecycle hook called when component is destroyed.
   * Clears caches to ensure fresh data on next initialization.
   */
  ngOnDestroy(): void {
    this.clearCaches();
  }

  /** Router link to a cartography form by id. */
  getCartographyFormLinkForId(cartographyId: number | null | undefined): (string | number)[] | null {
    if (typeof cartographyId !== 'number' || cartographyId <= 0) {
      return null;
    }
    return ['/layers', cartographyId, 'layersForm'];
  }

  /** Router link to the cartography form for the selected node, if any. */
  getCartographyFormLink(): (string | number)[] | null {
    return this.getCartographyFormLinkForId(this.treeNodeForm?.get('cartographyId')?.value);
  }

  /** Router link to a task form for a list/selection item (query or edit tasks only). */
  getTaskFormLinkForTask(task: unknown): (string | number)[] | null {
    if (task == null || typeof task !== 'object') {
      return null;
    }
    const taskId = (task as { id?: number }).id;
    if (typeof taskId !== 'number' || taskId <= 0) {
      return null;
    }
    const typeId = this.resolveTaskTypeId(task);
    if (typeId === config.tasksTypes.query) {
      return ['/taskQuery', taskId, config.tasksTypes.query];
    }
    if (typeId === config.tasksTypes.edit) {
      return ['/taskEdit', taskId, config.tasksTypes.edit];
    }
    return null;
  }

  /** Router link to the task form for the selected node (query or edit tasks only). */
  getTaskFormLink(): (string | number)[] | null {
    const task = this.treeNodeForm?.get(constants.treeDomainKey.task)?.value;
    if (task != null && typeof task === 'object') {
      return this.getTaskFormLinkForTask(task);
    }
    const taskId = this.treeNodeForm?.get('taskId')?.value;
    if (typeof taskId === 'number' && taskId > 0) {
      return this.getTaskFormLinkForTask({ id: taskId });
    }
    return null;
  }
}
