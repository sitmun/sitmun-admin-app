import {CdkDragDrop, CdkDragEnd, CdkDragSortEvent, CdkDragStart} from '@angular/cdk/drag-drop';
import {Component, DestroyRef, EventEmitter, inject, Injectable, Input, OnInit, Output, ViewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatTree} from '@angular/material/tree';

import {BehaviorSubject, firstValueFrom, Observable, Subscription} from 'rxjs';

import {config} from '@config';
import {constants} from '@environments/constants';

/**
 * Build the file structure tree from flat array. type is derived from nodeType + treeType (config).
 * isFolder not stored; use canNodeTypeHaveChildren(treeType, nodeType) to check.
 */
type TreeNodeInput = {
  id?: string | number | null;
  parent?: string | number | null;
  name?: string;
  nodeType?: string;
  order?: number;
  children?: any[];
  [key: string]: any;
};

type TreeMutationRoot = {
  children: any[];
  [key: string]: any;
};

type OrderedNodeLike = {
  id?: string | number | null;
  order?: number;
  status?: any;
  [key: string]: any;
};

function buildFileTree(arrayTreeNodes: TreeNodeInput[], level: number, allNewElements: boolean, treeType?: string): FileNode {
  const map: Record<string, any> = {};
  if(arrayTreeNodes.length===0)
  {
    map['root'] = {
      name: '',
      type: constants.treeRenderType.folder,
      isRoot: true,
      order: 0,
      children: [],
      id: null
    };
  }
  else{
    arrayTreeNodes.forEach((treeNode) => {
      const obj = treeNode;
      obj.children = [];
      const canHaveChildren = treeType ? canNodeTypeHaveChildren(treeType, treeNode.nodeType) : false;
      obj.type = canHaveChildren ? constants.treeRenderType.folder : constants.treeRenderType.node;
      // isFolder removed - use canNodeTypeHaveChildren(treeType, nodeType) to check
      obj.nodeType = treeNode.nodeType;
      if(allNewElements) {
        obj.status = constants.entityStatus.pendingCreation;
        if(obj.id) { (obj as any).id = Number(obj.id) * -1; }
        if(obj.parent) { (obj as any).parent = Number(obj.parent) * -1; }
        delete obj._links;
      }

      if(!map[obj.id]) {map[obj.id] = obj;}
      else{
        const previousChildren = map[obj.id].children
        map[obj.id] = obj;
        map[obj.id].children=previousChildren
      }
      const parent = obj.parent || 'root';
      if (!map[parent]) {
        map[parent] = {
          children: []
        };
      }
      map[parent].children.push(obj);
    });
    map['root'].type = constants.treeRenderType.folder;
    map['root'].name='';
    map['root'].order=0;
    map['root'].isRoot=true;
    map['root'].id=null;
  }

  return map['root'];
}

/** Exported for testing */
export { buildFileTree as buildFileTreeForTesting };

/**
 * File node data with nested structure.
 * Each node has a name, and a type or a list of children.
 */
export class FileNode {
  id: string;
  children: FileNode[];
  name: string;
  nodeType: string;
  type: any;
  active: any;
  cartography: any;
  cartographyId: any;
  cartographyName: any;
  datasetURL: any;
  description: any;
  filterGetFeatureInfo: any;
  filterGetMap: any;
  filterSelectable: any;
  isRoot: any;
  metadataURL: any;
  order: any;
  parent: any;
  queryableActive: any;
  radio: any;
  tooltip: any;
  image: any;
  taskName: any;
  viewMode: any;
  filterable: any;
  _links: any;
  status: any;
}

/** Flat node with expandable and level information */
export class FileFlatNode {
  constructor(
    public expandable: boolean,
    public name: string,
    public level: number,
    public type: any,
    public id: string,
    public status: string,
    public nodeType: string
  ) { }
}

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has name and type.
 * For a directory, it has name and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<FileNode[]>([]);
  get data(): FileNode | undefined { return this.dataChange.value[0]; }

  /** Emit a mutated root snapshot in the array shape expected by dataChange. */
  private emitRootSnapshot(changedData: TreeMutationRoot): void {
    this.dataChange.next([changedData as FileNode]);
  }

  /** Initialize the mutable tree root from backend flat rows. */
  initialize(dataObj: TreeNodeInput[], allNewElements: boolean, treeType?: string): void {
    const data = buildFileTree(dataObj, 0, allNewElements, treeType);
    this.dataChange.next([data]);
  }

  /**
   * Build the file structure tree. type is derived from nodeType + treeType (config).
   * isFolder not stored; use canNodeTypeHaveChildren(treeType, nodeType) to check.
   */
  buildFileTree(arrayTreeNodes: TreeNodeInput[], level: number, allNewElements: boolean, treeType?: string): FileNode {
    return buildFileTree(arrayTreeNodes, level, allNewElements, treeType);
  }

  /** Remove a node from a mutated root snapshot and emit. */
  deleteItem(node: FileNode, changedData: TreeMutationRoot): void {
    this.deleteNode(changedData.children as FileNode[], node);
    this.emitRootSnapshot(changedData);
  }

  /** Recursively delete a node reference from a nested branch list. */
  deleteNode(nodes: FileNode[], nodeToDelete: FileNode): void {
    const index = nodes.indexOf(nodeToDelete, 0);
    if (index > -1) {
      nodes.splice(index, 1);
    } else {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          this.deleteNode(node.children, nodeToDelete);
        }
      });
    }
  }

  /** Recompute sibling order and default status markers after mutations. */
  setOrder(data: OrderedNodeLike[]): OrderedNodeLike[] {
    for(let i=0; i< data.length; i++){
      data[i].order=i;
      if(data[i].id && Number(data[i].id) < 0){
        data[i].status = constants.entityStatus.pendingCreation;
      }
      if(!data[i].status && !data[i]['status']) {
        data[i].status = constants.entityStatus.modified;
      }
    }
    return data;
   }

  /** DnD: paste node as child of target node. */
  copyPasteItem(from: FileNode, to: FileNode, changedData: TreeMutationRoot): FileNode {
    return this.insertItem(to, from, changedData);
  }

  /** DnD: paste node above target node in same parent branch. */
  copyPasteItemAbove(from: FileNode, to: FileNode,changedData: TreeMutationRoot): FileNode {
    return this.insertItemAbove(to, from, changedData);
  }

  /** DnD: paste node below target node in same parent branch. */
  copyPasteItemBelow(from: FileNode, to: FileNode,changedData: TreeMutationRoot): FileNode {
    return this.insertItemBelow(to, from, changedData);
  }

  /** Clone only persisted node fields used by current tree/domain flows. */
  getNewItem(node: FileNode): FileNode {
    return {
      name: node.name,
      children: node.children,
      nodeType: node.nodeType,
      type: node.type,
      id: node.id,
      active: node.active,
      cartography: node.cartography,
      cartographyId: node.cartographyId,
      cartographyName: node.cartographyName,
      datasetURL: node.datasetURL,
      description: node.description,
      filterGetFeatureInfo: node.filterGetFeatureInfo,
      filterGetMap: node.filterGetMap,
      filterSelectable: node.filterSelectable,
      metadataURL: node.metadataURL,
      order: node.order,
      parent: node.parent,
      queryableActive: node.queryableActive,
      radio: node.radio,
      status: node.status,
      tooltip: node.tooltip,
      image: node.image,
      taskName: node.taskName,
      viewMode: node.viewMode,
      filterable: node.filterable,
      _links: node._links
    } as FileNode;
  }

  /** Insert node as child of parent and emit updated root snapshot. */
  insertItem(parent: FileNode, node: FileNode,changedData: TreeMutationRoot): FileNode {
    if (!parent.children) {
      parent.children = [];
    }
    const newItem = this.getNewItem(node)
    newItem.parent = parent.id == undefined ? null : parent.id;
    parent.children.push(newItem);
    this.setOrder(parent.children)
    this.emitRootSnapshot(changedData);
    return newItem;
  }

  /** Insert node above target sibling and emit updated root snapshot. */
  insertItemAbove(node: FileNode, nodeDrag: FileNode,changedData: TreeMutationRoot): FileNode {
    const parentNode = this.getParentFromNodes(node,changedData);
    const newItem = this.getNewItem(nodeDrag)
    newItem.parent = parentNode==null || parentNode.id==undefined?null:parentNode.id;

    if (parentNode != null) {
      parentNode.children.splice(parentNode.children.indexOf(node), 0, newItem);
      this.setOrder(parentNode.children)
    } else {
      changedData.children.splice(changedData.children.indexOf(node), 0, newItem);
      this.setOrder(changedData.children)
    }
    this.emitRootSnapshot(changedData);
    return newItem;
  }

  /** Insert node below target sibling and emit updated root snapshot. */
  insertItemBelow(node: FileNode, nodeDrag: FileNode,changedData: TreeMutationRoot): FileNode {
    const parentNode = this.getParentFromNodes(node,changedData);

    const newItem = this.getNewItem(nodeDrag)
    newItem.parent = parentNode==null || parentNode.id==undefined?null:parentNode.id;

    if (parentNode != null) {
      parentNode.children.splice(parentNode.children.indexOf(node) + 1, 0, newItem);
      this.setOrder(parentNode.children)
    } else {
      changedData.children.splice(changedData.children.indexOf(node) + 1, 0, newItem);
      this.setOrder(changedData.children)
    }
    this.emitRootSnapshot(changedData);
    return newItem;
  }

  /** Locate parent branch of node within current mutated root snapshot. */
  getParentFromNodes(node: FileNode,changedData: TreeMutationRoot): FileNode | null {
    for (let i = 0; i < changedData.children.length; ++i) {
      const currentRoot =  changedData.children[i];
      const parent = this.getParent(currentRoot, node);
      if (parent != null) {
        return parent;
      }
    }
    return null;
  }

  /** Recursive parent search helper used by DnD insertion methods. */
  getParent(currentRoot: FileNode, node: FileNode): FileNode | null {
    if (currentRoot.children && currentRoot.children.length > 0) {
      for (let i = 0; i < currentRoot.children.length; ++i) {
        const child = currentRoot.children[i];
        if (child === node) {
          return currentRoot;
        } else if (child.children && child.children.length > 0) {
          const parent = this.getParent(child, node);
          if (parent != null) {
            return parent;
          }
        }
      }
    }
    return null;
  }

}

type DragOverArea = '' | 'above' | 'below' | 'center';
type NodeAction = 'edit' | 'delete' | 'restore' | 'revert' | 'remove';
type DndNodeLike = {
  id: string | number | null | undefined;
  status?: string | null;
};
type ResolvedDropContext = {
  rootNode: FileNode;
  targetNodeId: string | number | undefined;
  targetNode: FileNode;
  sourceNode: FileNode;
};
interface EmitAllRowsPayload {
  event: string;
  data: FileNode[];
}

interface EmitNodePayload {
  nodeClicked: FileNode;
  nodeParent: FileNode | null;
}

interface ActionContext {
  changedData: FileNode[];
  nodeClicked: FileNode;
}

interface NodeLookupContext {
  siblings: FileNode[];
  index: number;
  node: FileNode;
}

type NodeUpdatePayload = Partial<Omit<FileNode, 'id' | 'children'>> & {
  id: string | number;
  children?: FileNode[];
  [key: string]: any;
};

/**
 * @title Tree with nested nodes
 */
@Component({
    selector: 'app-data-tree',
    templateUrl: 'data-tree.component.html',
    styleUrls: ['data-tree.component.scss'],
    providers: [FileDatabase],
    standalone: false
})
export class DataTreeComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  @Output() addNode: EventEmitter<{ parent: FileNode | null; nodeType: string }>;
  @Output() emitNode: EventEmitter<EmitNodePayload>;
  @Output() emitAllNodes: EventEmitter<EmitAllRowsPayload>;
  @Output() loadButtonClicked: EventEmitter<FileNode[]>;
  @Input() eventNodeUpdatedSubscription: Observable<unknown>;
  @Input() eventCreateNodeSubscription: Observable<unknown>;
  @Input() eventGetAllRowsSubscription: Observable<string>;
  @Input() eventRefreshSubscription: Observable<unknown>;
  @Input() loadDataButton: Observable<unknown>;
  /**
   * Nested tree snapshot store.
   * Kept as `{ data }` shape for existing component/spec compatibility.
   */
  dataSource: { data: FileNode[] } = { data: [] };
  /** Canonical expansion ids (adapter-neutral) used by expansion wrappers. */
  private expandedNodeIdsState = new Set<string>();
  /** One-shot ids that must be re-expanded on next render after action-driven rebuilds. */
  private pendingReexpandNodeIds = new Set<string>();
  /** Temporary pin to guarantee visibility of a freshly inserted node during next filter pass. */
  private newlyInsertedNodeId: string | number | null = null;
  treeData: TreeNodeInput[];
  filterValue = '';
  originalData: FileNode[] = [];
  selectedNodeId: string | number | null = null;

  @Input() getAll?: () => Observable<TreeNodeInput[]>;
  @Input() allNewElements: boolean;
  @Input() currentTreeType: string;
  @Input() canNodeHaveChildren: (nodeType: string | null) => boolean;
  /** Returns allowed node types for a parent (null = root). Used to render one add button per type. */
  @Input() getAllowedTypesForParent: (parent: FileNode | null) => string[] = () => [];
  /** Returns display label for a node type (tooltips and form). */
  @Input() getNodeTypeLabel: (nodeType: string) => string = (t) => t;
  /** Returns display label for a view mode code (tooltip on view-mode hint icon). */
  @Input() getViewModeLabel: (viewMode: string) => string;


  /* Drag and drop */
  dragNodeId: string | number | undefined;
  dragNodeStatus: string | null = null;
  isDragging = false;
  dragNodeExpandOverWaitTimeMs = 1500;
  dragNodeExpandOverNodeId: string | null = null;
  dragNodeExpandOverTime: number = 0;
  dragNodeExpandOverArea: DragOverArea = '';
  @ViewChild(MatTree) tree?: MatTree<FileNode>;

    /** Map to store original node states for revert functionality */
    originalNodeStates = new Map<string | number, any>();


  constructor(public database: FileDatabase) {
    this.addNode = new EventEmitter();
    this.emitNode = new EventEmitter<EmitNodePayload>();
    this.emitAllNodes = new EventEmitter<EmitAllRowsPayload>();
    this.loadButtonClicked = new EventEmitter<FileNode[]>();
  }

  /** Subscribe optional input observable with destroy-aware lifecycle handling. */
  private subscribeInput<T>(source: Observable<T> | undefined, handler: (value: T) => void): Subscription | undefined {
    if (!source) return undefined;
    return source.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(handler);
  }

  ngOnInit(): void {
    this.subscribeInput(this.eventNodeUpdatedSubscription, (node) => {
      if (!node || typeof node !== 'object' || !('id' in (node as Record<string, unknown>))) {
        return;
      }
      this.updateNode(node as NodeUpdatePayload);
    });
    this.subscribeInput(this.eventCreateNodeSubscription, (node) => {
      if (!node || typeof node !== 'object') {
        return;
      }
      this.addNodeToTree(node as FileNode);
    });
    this.subscribeInput(this.eventGetAllRowsSubscription, (event: string) => {
      this.emitAllRows(event);
    });
    this.subscribeInput(this.eventRefreshSubscription, () => {
      this.getElements();
    });

    this.getElements();
  }

  loadDataButtonClicked(): void {
    const dataToEmit = this.cloneTreeDataSnapshot();
    const allRows = this.getAllChildren(dataToEmit);
    this.loadButtonClicked.emit(allRows)
  }

  /** Rebuild tree using current FileDatabase root snapshot (if present). */
  private rebuildFromDatabaseRoot(): void {
    const root = this.database.data;
    this.rebuildTreeForData(root ? [root] : []);
  }

  /** Apply fetched rows into database and rebuild current tree snapshot. */
  private applyFetchedTreeData(items: TreeNodeInput[]): void {
    this.treeData = items;
    this.database.initialize(this.treeData, this.allNewElements, this.currentTreeType);
    this.rebuildFromDatabaseRoot();
  }

  getElements(): void {
    if (!this.getAll) return;
    this.getAll().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((items) => {
      this.applyFetchedTreeData(items);
    });
  }

  /** Refetches tree nodes and rebuilds the tree. Returns a promise that resolves when the tree is updated. */
  refreshTree(): Promise<void> {
    if (!this.getAll) return Promise.resolve();
    return firstValueFrom(this.getAll()).then((items) => {
      this.applyFetchedTreeData(items);
    });
  }

  /** Active childrenAccessor for nested mat-tree mode. */
  readonly childrenAccessorCompat = (node: FileNode): FileNode[] => {
    const nested = this.resolveNode(node);
    return this.getNodeChildren(nested);
  };
  /** Active childrenAccessor binding for template. */
  get childrenAccessorBindingCompat(): ((node: FileNode) => FileNode[]) {
    return this.childrenAccessorCompat;
  }
  /** Tree template predicate for nested nodes. */
  hasChild = (_: number, nodeData: FileNode): boolean => {
    return this.getNodeChildren(this.resolveNode(nodeData)).length > 0;
  };

  /** Canonical source for current nested tree data. */
  private getTreeData(): FileNode[] {
    return this.dataSource.data ?? [];
  }

  /**
   * Transitional nested-children accessor seam.
   * Keeps traversal logic independent from direct `node.children` reads.
   */
  private getNodeChildren(node: FileNode | null | undefined): FileNode[] {
    return node?.children ?? [];
  }

  /** Safe accessor for children of the first root snapshot node. */
  private getRootChildren(nodes: FileNode[]): FileNode[] {
    return this.getNodeChildren(nodes?.[0]);
  }

  /** Active [dataSource] binding for nested tree. */
  get treeDataSourceBindingCompat(): FileNode[] {
    return this.getTreeData();
  }

  /** Compare ids defensively because runtime mixes string/number ids. */
  private isSameId(a: string | number | null | undefined, b: string | number | null | undefined): boolean {
    return String(a) === String(b);
  }

  /** Normalize nullable/mixed ids to a numeric form for comparisons. */
  private toNumericId(id: string | number | null | undefined): number {
    return Number(id);
  }

  /** Persisted backend nodes have non-negative numeric ids. */
  private isPersistedNodeId(id: string | number | null | undefined): boolean {
    return this.toNumericId(id) >= 0;
  }

  /** Build default synthetic root used when tree data starts empty. */
  private createSyntheticRootNode(): FileNode {
    return {
      name: '',
      type: constants.treeRenderType.folder,
      isRoot: true,
      order: 0,
      children: [] as FileNode[],
      id: null
    } as unknown as FileNode;
  }

  /** Generic deep clone for plain data objects/arrays used in tree state. */
  private cloneValue<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }

  /**
   * Returns a deep-cloned snapshot of current tree data so callers can safely mutate
   * without affecting live UI state until rebuildTreeForData is called.
   */
  private cloneTreeDataSnapshot(): FileNode[] {
    return this.cloneValue(this.getTreeData());
  }

  /** Replace tree data with a fresh array reference to trigger refresh. */
  private setTreeData(data: FileNode[]): void {
    this.dataSource.data = [...(data ?? [])];
  }

  /** Expand a node id in persisted expansion ids. */
  private expandFlatNode(node: { id: string | number | null | undefined } | undefined | null): void {
    if (!node) return;
    this.expandedNodeIdsState.add(String(node.id));
  }

  /** Collapse a node id from persisted expansion ids. */
  private collapseFlatNode(node: { id: string | number | null | undefined } | undefined | null): void {
    if (!node) return;
    this.expandedNodeIdsState.delete(String(node.id));
  }

  /** Expand all descendants for DnD and restore flows. */
  private expandFlatDescendants(node: { id: string | number | null | undefined } | undefined | null): void {
    if (!node) return;
    const nested = this.findNodeById(node.id);
    if (!nested) return;
    this.collectDescendantIds(nested).forEach((id) => this.expandedNodeIdsState.add(id));
  }

  /** Expand full tree when data exists. */
  private expandAllFlatNodes(): void {
    if (!this.getTreeData().length) return;
    this.collectAllNodeIds(this.getTreeData()).forEach((id) => this.expandedNodeIdsState.add(id));
  }

  /** Collapse full tree and clear persisted expanded ids. */
  private collapseAllFlatNodes(): void {
    this.expandedNodeIdsState.clear();
  }

  /** Collect descendant ids (excluding root node itself) from nested tree node. */
  private collectDescendantIds(node: FileNode): string[] {
    const result: string[] = [];
    const visit = (current: FileNode): void => {
      this.getNodeChildren(current).forEach((child) => {
        result.push(String(child.id));
        visit(child);
      });
    };
    visit(node);
    return result;
  }

  /** Collect every node id in nested tree snapshot. */
  private collectAllNodeIds(nodes: FileNode[]): string[] {
    const result: string[] = [];
    const visit = (currentNodes: FileNode[]): void => {
      currentNodes.forEach((node) => {
        result.push(String(node.id));
        visit(this.getNodeChildren(node));
      });
    };
    visit(nodes);
    return result;
  }

  /** Collect all nested nodes in DFS order. */
  private collectAllNodes(nodes: FileNode[]): FileNode[] {
    const result: FileNode[] = [];
    const visit = (currentNodes: FileNode[]): void => {
      currentNodes.forEach((node) => {
        result.push(node);
        visit(this.getNodeChildren(node));
      });
    };
    visit(nodes);
    return result;
  }

  /** Expanded ids tracked in component state for persistence/restore. */
  private getExpandedNodeIds(): string[] {
    return Array.from(this.expandedNodeIdsState);
  }

  /** Expanded ids normalized as string set for fast mixed-id lookups. */
  private getExpandedNodeIdSet(): Set<string> {
    return new Set(this.getExpandedNodeIds());
  }

  /** Toggle adapter-neutral expansion id state (UI toggle handled by matTreeNodeToggle). */
  private toggleExpandedNodeId(node: FileFlatNode | undefined | null): void {
    if (!node) return;
    const normalizedId = String(node.id);
    if (this.expandedNodeIdsState.has(normalizedId)) {
      this.expandedNodeIdsState.delete(normalizedId);
      return;
    }
    this.expandedNodeIdsState.add(normalizedId);
  }

  /** Check expansion by id with mixed string/number safety. */
  private isExpandedNodeId(id: string | number): boolean {
    return this.getExpandedNodeIdSet().has(String(id));
  }

  /**
   * Snapshot currently expanded flat-node ids from the live tree-control state.
   * Used before tree rebuilds triggered by row actions (delete/restore/etc.).
   */
  private captureExpandedNodeIdsFromTree(): string[] {
    // Expansion state is now tracked canonically in id-state across both modes.
    return Array.from(this.expandedNodeIdsState);
  }

  /** Merge a pre-rebuild expansion snapshot into persisted expansion state. */
  private preserveExpandedStateFromTreeSnapshot(): void {
    this.captureExpandedNodeIdsFromTree().forEach((id) => this.expandedNodeIdsState.add(id));
  }

  /** Queue a node id to force re-expand after next tree render pass. */
  private queueNodeForReexpand(id: string | number | null | undefined): void {
    if (id === null || id === undefined) return;
    this.pendingReexpandNodeIds.add(String(id));
  }

  /** Apply and clear one-shot forced re-expansion queue after tree render. */
  private flushPendingReexpandNodes(): void {
    this.pendingReexpandNodeIds.forEach((id) => {
      this.expandedNodeIdsState.add(String(id));
    });
    this.pendingReexpandNodeIds.clear();
  }

  /** Normalize level reads for nested nodes. */
  private getNodeLevel(node: FileFlatNode | FileNode | undefined | null): number {
    if (!node) return -1;
    const maybeFlat = node as FileFlatNode;
    if (typeof maybeFlat.level === 'number') {
      return maybeFlat.level;
    }
    const nested = this.resolveNode(node as FileNode);
    if (!nested) return -1;
    if (this.isRootNestedNode(nested)) return 0;
    if (nested.parent === null || nested.parent === undefined) return 1;
    let level = 1;
    let currentParentId = nested.parent;
    while (currentParentId !== null && currentParentId !== undefined) {
      const parent = this.findNodeById(currentParentId);
      if (!parent) break;
      if (this.isRootNestedNode(parent)) break;
      level += 1;
      currentParentId = parent.parent;
    }
    return level;
  }

  /** Visible content starts at level 1 (root row is level 0 synthetic). */
  private isVisibleRootDescendant(node: FileFlatNode | FileNode | undefined | null): boolean {
    return this.getNodeLevel(node) >= 1;
  }

  /** Reset all transient drag-hover state between DnD operations. */
  private resetDragState(): void {
    this.dragNodeId = undefined;
    this.dragNodeStatus = null;
    this.isDragging = false;
    this.dragNodeExpandOverNodeId = null;
    this.dragNodeExpandOverTime = 0;
    this.dragNodeExpandOverArea = '';
  }

  /** Resolve drop target node from cloned snapshot by id. */
  private resolveDropNodeFromSnapshot(snapshot: FileNode[], nodeId: string | number | null | undefined): FileNode | undefined {
    if (!snapshot || snapshot.length === 0) return undefined;
    if (nodeId === null || nodeId === undefined) return snapshot[0];
    return this.findNodeContext(this.getNodeChildren(snapshot[0]), nodeId)?.node;
  }

  /** Extract a comparable drag/drop id, skipping null/undefined ids. */
  private getDndComparableId(node: DndNodeLike | null | undefined): string | number | undefined {
    if (!node) return undefined;
    if (node.id === null || node.id === undefined) return undefined;
    return node.id;
  }

  /** Snapshot root accessor to keep null/empty handling centralized. */
  private getSnapshotRoot(snapshot: FileNode[]): FileNode | undefined {
    if (!snapshot || snapshot.length === 0) return undefined;
    return snapshot[0];
  }

  /** Expand/collapse material tree rows to match persisted id-state. */
  private syncTreeExpansionFromIdState(): void {
    if (!this.tree) return;
    const expandedIds = this.getExpandedNodeIdSet();
    this.collectAllNodes(this.getTreeData()).forEach((node) => {
      const id = String(node.id);
      if (expandedIds.has(id)) {
        this.tree?.expand(node);
      } else {
        this.tree?.collapse(node);
      }
    });
  }

  /** Validate DnD operation against status, identity and node type rules. */
  private canProcessDrop(targetNodeId: string | number | null | undefined, targetSnapshotNode: FileNode): boolean {
    if (!this.isDragging) return false;
    if (this.dragNodeStatus === constants.entityStatus.pendingDelete) return false;
    if (this.isSameId(this.dragNodeId, targetNodeId)) return false;
    if (!this.isCenterDropArea()) return true;
    return canNodeTypeHaveChildren(this.currentTreeType, targetSnapshotNode.nodeType);
  }

  private isCenterDropArea(): boolean {
    return this.dragNodeExpandOverArea === 'center';
  }

  private isAboveDropArea(): boolean {
    return this.dragNodeExpandOverArea === 'above';
  }

  private isBelowDropArea(): boolean {
    return this.dragNodeExpandOverArea === 'below';
  }

  /** Insert dropped node according to hovered drop area. */
  private insertDroppedNode(fromNode: FileNode, toNode: FileNode, changedRoot: FileNode): FileNode {
    if (this.isAboveDropArea()) {
      return this.database.copyPasteItemAbove(fromNode, toNode, changedRoot);
    }
    if (this.isBelowDropArea()) {
      return this.database.copyPasteItemBelow(fromNode, toNode, changedRoot);
    }
    return this.database.copyPasteItem(fromNode, toNode, changedRoot);
  }

  /** Build normalized drop context from current snapshot and drag state. */
  private resolveDropContext(snapshot: FileNode[], targetNode: DndNodeLike): ResolvedDropContext | undefined {
    const rootNode = this.getSnapshotRoot(snapshot);
    const targetNodeId = this.getDndComparableId(targetNode);
    const targetSnapshotNode = this.resolveDropNodeFromSnapshot(snapshot, targetNodeId);
    const sourceSnapshotNode = this.resolveDropNodeFromSnapshot(snapshot, this.dragNodeId);
    if (!rootNode || !targetSnapshotNode || !sourceSnapshotNode) return undefined;
    return {
      rootNode,
      targetNodeId,
      targetNode: targetSnapshotNode,
      sourceNode: sourceSnapshotNode
    };
  }

  /** Execute one validated DnD operation. Returns true only when mutation is applied. */
  private executeDropOperation(context: ResolvedDropContext): boolean {
    const canProcess = this.canProcessDrop(context.targetNodeId, context.targetNode);
    if (!canProcess) return false;
    const newItem = this.insertDroppedNode(context.sourceNode, context.targetNode, context.rootNode);
    this.finalizeDrop(context.sourceNode, newItem, context.rootNode);
    return true;
  }

  /** Nested DnD post-mutation behavior (no flat projection dependency). */
  private finalizeDropNested(newItem: FileNode): void {
    this.expandedNodeIdsState.add(String(newItem.id));
    this.collectDescendantIds(newItem).forEach((id) => this.expandedNodeIdsState.add(id));
  }

  /** Finalize DnD by deleting origin node and restoring expansion visibility. */
  private finalizeDrop(fromNode: FileNode, newItem: FileNode, changedRoot: FileNode): void {
    this.database.deleteItem(fromNode, changedRoot);
    this.finalizeDropNested(newItem);
  }

  /** Compute DnD area from pointer vertical position in target row. */
  private calculateDragOverAreaFromClientY(clientY: number, row: HTMLElement): Exclude<DragOverArea, ''> {
    const rect = row.getBoundingClientRect();
    const targetHeight = rect.height || 1;
    const offsetY = clientY - rect.top;
    const percentageY = offsetY / targetHeight;
    if (percentageY < 0.25) return 'above';
    if (percentageY > 0.75) return 'below';
    return 'center';
  }

  /** Resolve hovered node id from CDK sorted/drop list index. */
  private getTargetNodeIdFromDropListData(listData: DndNodeLike[] | undefined, index: number): string | null {
    if (!listData || listData.length === 0) return null;
    if (index < 0 || index >= listData.length) return null;
    const candidateId = listData[index]?.id;
    return candidateId === null || candidateId === undefined ? null : String(candidateId);
  }

  /** Approximate drop area from list movement when pointer data is unavailable. */
  private getDropAreaFromIndexDelta(previousIndex: number, currentIndex: number): Exclude<DragOverArea, ''> {
    if (currentIndex > previousIndex) return 'below';
    if (currentIndex < previousIndex) return 'above';
    return 'center';
  }

  /** Find current DOM row for node id to compute center/edge placement from pointer. */
  private getTreeRowElementByNodeId(nodeId: string | null): HTMLElement | null {
    if (!nodeId) return null;
    const safeNodeId = nodeId.replace(/"/g, '\\"');
    return document.querySelector(`.tree-node-row[data-node-id="${safeNodeId}"]`) as HTMLElement | null;
  }

  /** Resolve target node id directly from pointer at drop time. */
  private getTargetNodeIdFromDropPoint(dropPoint: { x: number; y: number } | undefined): string | null {
    if (!dropPoint) return null;
    const viewportX = dropPoint.x - window.scrollX;
    const viewportY = dropPoint.y - window.scrollY;
    const element = document.elementFromPoint(viewportX, viewportY) as HTMLElement | null;
    const row = element?.closest('.tree-node-row') as HTMLElement | null;
    const nodeId = row?.getAttribute('data-node-id');
    return nodeId == null ? null : String(nodeId);
  }

  /** Auto-expand on hover after configured delay. */
  private shouldAutoExpandOnHover(node: DndNodeLike): boolean {
    if (!this.isDragging) return false;
    if (this.isSameId(this.dragNodeId, node.id)) return false;
    if (this.isNodeExpandedById(node.id)) return false;
    return (Date.now() - this.dragNodeExpandOverTime) > this.dragNodeExpandOverWaitTimeMs;
  }

  /** Expand hovered node according to active adapter mode. */
  private expandHoveredNode(node: DndNodeLike, hoveredNodeId: string): void {
    this.expandedNodeIdsState.add(hoveredNodeId);
  }

  /** Track hovered node and trigger delayed auto-expand when applicable. */
  private processDragHoverExpansion(node: DndNodeLike): void {
    const hoveredNodeId = String(node.id);
    if (this.dragNodeExpandOverNodeId === hoveredNodeId) {
      if (this.shouldAutoExpandOnHover(node)) {
        this.expandHoveredNode(node, hoveredNodeId);
      }
      return;
    }
    this.dragNodeExpandOverNodeId = hoveredNodeId;
    this.dragNodeExpandOverTime = Date.now();
  }

  /** Template-friendly DnD class resolver based on id + area. */
  isDropAreaActiveForNode(nodeId: string | number | null | undefined, area: Exclude<DragOverArea, ''>): boolean {
    if (nodeId === null || nodeId === undefined) return false;
    return this.dragNodeExpandOverArea === area && this.dragNodeExpandOverNodeId === String(nodeId);
  }

  /** Collapse dragged node in expansion-id state. */
  private collapseDraggedNode(node: DndNodeLike): void {
    this.expandedNodeIdsState.delete(String(node.id));
  }

  /** Id-based nested resolver fallback used when map links are missing/stale. */
  private findNestedNodeById(nodes: FileNode[], id: string | number | null | undefined): FileNode | undefined {
    if (!nodes || nodes.length === 0) return undefined;
    for (const candidate of nodes) {
      if (this.isSameId(candidate.id, id)) return candidate;
      const inChildren = this.findNestedNodeById(this.getNodeChildren(candidate), id);
      if (inChildren) return inChildren;
    }
    return undefined;
  }

  /** Id-based nested lookup scoped to an arbitrary tree snapshot. */
  private findNodeByIdInTree(nodes: FileNode[], id: string | number | null | undefined): FileNode | undefined {
    if (!nodes || nodes.length === 0) return undefined;
    for (const node of nodes) {
      if (this.isSameId(node.id, id)) return node;
      const found = this.findNodeByIdInTree(this.getNodeChildren(node), id);
      if (found) return found;
    }
    return undefined;
  }

  /** Collect ancestor ids for a node id within provided tree snapshot. */
  private collectAncestorIdsInTree(nodes: FileNode[], id: string | number): string[] {
    const ancestorIds: string[] = [];
    let current = this.findNodeByIdInTree(nodes, id);
    while (current && current.parent !== null && current.parent !== undefined) {
      ancestorIds.push(String(current.parent));
      current = this.findNodeByIdInTree(nodes, current.parent);
    }
    return ancestorIds;
  }

  /** Root detection supporting both legacy and synthetic root markers. */
  private isRootNestedNode(node: FileNode | undefined | null): boolean {
    return !!node && (node.isRoot === true || (node.name === '' && node.id === null));
  }

  /** Resolve root node from nested tree snapshot. */
  private getRootNestedNode(nodes: FileNode[] = this.getTreeData()): FileNode | undefined {
    return nodes.find((node) => this.isRootNestedNode(node));
  }

  private restoreExpansionState(): void {
    const expandedNodeIds = this.getExpandedNodeIds();
    expandedNodeIds.forEach((expandedNodeId) => {
      const nested = this.findNodeById(expandedNodeId);
      if (!nested) return;
      if (this.isRootNestedNode(nested)) return;
      this.expandedNodeIdsState.add(String(nested.id));
    });
    this.syncTreeExpansionFromIdState();
  }

  /** Toggle expansion tracking by node id (flat/nested compatible entrypoint). */
  onToggleNodeById(nodeId: string | number | null | undefined): void {
    if (nodeId === null || nodeId === undefined) return;
    const normalizedId = String(nodeId);
    if (this.expandedNodeIdsState.has(normalizedId)) {
      this.expandedNodeIdsState.delete(normalizedId);
      return;
    }
    this.expandedNodeIdsState.add(normalizedId);
  }

  /** Expansion status by id (flat/nested compatible entrypoint). */
  isNodeExpandedById(nodeId: string | number | null | undefined): boolean {
    if (nodeId === null || nodeId === undefined) return false;
    return this.isExpandedNodeId(nodeId);
  }

  /** Backward-compatible wrapper for previous template call sites. */
  onToggleNode(node: FileFlatNode): void {
    this.onToggleNodeById(node?.id);
  }

  /** Backward-compatible wrapper for previous template call sites. */
  isNodeExpanded(node: FileFlatNode): boolean {
    return this.isNodeExpandedById(node?.id);
  }


  /**
   * This constructs an array of nodes that matches the DOM
   */
  visibleNodes(): FileNode[] {
    const result = [];

    const addExpandedChildren = (node: FileNode) => {
      result.push(node);
      if (this.isExpandedNodeId(node.id)) {
        this.getNodeChildren(node).map((child) => addExpandedChildren(child));
      }
    };
    this.getTreeData().forEach((node) => {
      addExpandedChildren(node);
    });
    return result;
  }


  /** Compatibility wrapper kept for tests/legacy callers; prefer findNodeContext(...). */
  findNodeSiblings(arr: FileNode[], id: string | number): FileNode[] | undefined {
    return this.findNodeContext(arr, id)?.siblings;
  }

  /** Resolve node + owning siblings/index in one recursive pass. */
  private findNodeContext(arr: FileNode[], id: string | number): NodeLookupContext | undefined {
    if (!arr || arr.length === 0) return undefined;
    for (let i = 0; i < arr.length; i++) {
      const node = arr[i];
      if (this.isSameId(node.id, id)) {
        return { siblings: arr, index: i, node };
      }
      const nested = this.findNodeContext(this.getNodeChildren(node), id);
      if (nested) return nested;
    }
    return undefined;
  }


  handleDragStart(event: CdkDragStart<DndNodeLike>, fallbackNode?: DndNodeLike): void {
    const node = fallbackNode ?? event?.source?.data;
    if (!node) return;
    this.dragNodeId = this.getDndComparableId(node);
    this.dragNodeStatus = node.status ?? null;
    this.isDragging = true;
    this.collapseDraggedNode(node);
  }

  handleDragSort(event: CdkDragSortEvent<DndNodeLike[]>): void {
    const targetNodeId = this.getTargetNodeIdFromDropListData(event.container?.data as DndNodeLike[] | undefined, event.currentIndex);
    if (!targetNodeId) return;
    const hoveredNode = this.findNodeById(targetNodeId);
    if (!hoveredNode) return;
    this.processDragHoverExpansion(hoveredNode);
    this.dragNodeExpandOverArea = this.getDropAreaFromIndexDelta(event.previousIndex, event.currentIndex);
  }

  handleDrop(event: CdkDragDrop<FileNode[]>, node?: DndNodeLike): void {
    const sourceNodeFromEvent = (event?.item?.data as DndNodeLike | undefined) ?? undefined;
    this.dragNodeId = this.getDndComparableId(sourceNodeFromEvent) ?? this.dragNodeId;
    if (sourceNodeFromEvent?.status !== undefined) {
      this.dragNodeStatus = sourceNodeFromEvent.status;
    }
    // CDK may emit drag-end before drop; reconstruct drag state from drop event.
    this.isDragging = true;
    const dropPoint = (event as unknown as { dropPoint?: { x: number; y: number } }).dropPoint;
    const targetNodeIdFromList = this.getTargetNodeIdFromDropListData(event?.container?.data as DndNodeLike[] | undefined, event.currentIndex);
    const targetNodeIdFromPoint = this.getTargetNodeIdFromDropPoint(dropPoint);
    const sameAsSourceFromList = this.isSameId(targetNodeIdFromList, this.dragNodeId);
    this.dragNodeExpandOverNodeId = sameAsSourceFromList ? targetNodeIdFromPoint : targetNodeIdFromList;
    this.dragNodeExpandOverArea = this.getDropAreaFromIndexDelta(event.previousIndex, event.currentIndex);
    const targetRow = this.getTreeRowElementByNodeId(this.dragNodeExpandOverNodeId);
    if (dropPoint && targetRow) {
      const viewportY = dropPoint.y - window.scrollY;
      this.dragNodeExpandOverArea = this.calculateDragOverAreaFromClientY(viewportY, targetRow);
    }
    const targetNodeId = this.dragNodeExpandOverNodeId;
    if (targetNodeId == null) {
      this.resetDragState();
      return;
    }
    const targetNode: DndNodeLike = node ?? { id: targetNodeId };
    const changedData = this.cloneTreeDataSnapshot();
    const dropContext = this.resolveDropContext(changedData, targetNode);
    if (!dropContext) {
      this.resetDragState();
      return;
    }
    const applied = this.executeDropOperation(dropContext);
    if (applied) {
      this.rebuildTreeForData([dropContext.rootNode]);
    }

    this.resetDragState();
  }

  handleDragEnd(_event: CdkDragEnd<DndNodeLike>): void {
    this.resetDragState();
  }

  /**
   * The following methods are for persisting the tree expand state
   * after being rebuilt
   */

   sortByOrder(data: FileNode[]): void {
    // data.sort((a,b) => a.order.toString().localeCompare( b.order.toString()));
    data.sort((a,b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0));
    data.forEach((item) => {
      if (this.getNodeChildren(item).length>0) {
        this.sortByOrder(this.getNodeChildren(item));
      }

    });
   }

   setOrder(data: FileNode[]): FileNode[] {
    for(let i=0; i< data.length; i++){
      data[i].order=i;
      if(! data[i].status) {
        data[i].status = constants.entityStatus.modified;
      }
    }
    return data;
   }

  rebuildTreeForData(data: FileNode[]): void {
    this.sortByOrder(data);
    this.originalData = data; // Store original data for filtering
    // Store original states of nodes for revert functionality
    this.storeOriginalStates(data);
    this.applyFilter();
  }

  /**
   * Recursively store original node states for revert functionality
   * Only stores state for nodes that don't have Modified or pendingCreation status
   * (i.e., nodes that are in their original saved state)
   */
  private storeOriginalStates(nodes: FileNode[]): void {
    if (!nodes || nodes.length === 0) {
      return;
    }
    nodes.forEach(node => {
      if (node.id !== null && node.id !== undefined && this.isPersistedNodeId(node.id)) {
        // Only store original state if:
        // 1. Not already stored (to preserve original state)
        // 2. Node doesn't have Modified or pendingCreation status (it's in saved state)
        if (!this.originalNodeStates.has(node.id) && 
            node.status !== constants.entityStatus.modified && 
            node.status !== constants.entityStatus.pendingCreation) {
          // Deep clone to store original state
          const originalState = this.cloneValue(node);
          // Remove status from original state so we can restore to clean state
          delete originalState.status;
          this.originalNodeStates.set(node.id, originalState);
        }
      }
      // Recursively store children
      if (this.getNodeChildren(node).length > 0) {
        this.storeOriginalStates(this.getNodeChildren(node));
      }
    });
  }

  /** Ensure root branch stays expanded after filtering. */
  private ensureRootExpandedAfterFilter(filteredData: FileNode[]): void {
    if (!(filteredData.length === 1 && this.isRootNestedNode(filteredData[0]) && this.getNodeChildren(filteredData[0]).length > 0)) {
      return;
    }
    this.expandedNodeIdsState.add(String(filteredData[0].id));
    this.tree?.expand(filteredData[0]);
  }

  applyFilter(): void {
    let filteredData = this.originalData;
    
    if (this.filterValue && this.filterValue.trim() !== '') {
      const filter = this.filterValue.toLowerCase().trim();
      filteredData = this.filterTree(this.originalData, filter);
    }
    
    this.setTreeData(filteredData);
    
    // Auto-expand only root node (first level) - do not expand nested children
    setTimeout(() => {
      this.ensureRootExpandedAfterFilter(filteredData);
      this.restoreExpansionState();
      this.flushPendingReexpandNodes();
      // Clear one-shot visibility pin after tree has been rendered once.
      this.newlyInsertedNodeId = null;
    }, 0);
  }

  filterTree(nodes: FileNode[], filter: string): FileNode[] {
    if (!nodes || nodes.length === 0) {
      return [];
    }

    return nodes.map(node => {
      const nodeMatches = node.name && node.name.toLowerCase().includes(filter);
      const isNewlyInsertedPinned = this.newlyInsertedNodeId !== null && this.isSameId(node.id, this.newlyInsertedNodeId);
      const filteredChildren = this.filterTree(this.getNodeChildren(node), filter);
      const hasMatchingChildren = filteredChildren.length > 0;

      // Include node if it matches or has matching children
      if (nodeMatches || hasMatchingChildren || isNewlyInsertedPinned) {
        const filteredNode = { ...node };
        filteredNode.children = filteredChildren;
        return filteredNode;
      }
      return null;
    }).filter(node => node !== null) as FileNode[];
  }

  onFilterChange(filterValue: string): void {
    this.filterValue = filterValue;
    this.applyFilter();
  }

  onFilterKeyup(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    this.filterValue = input.value;
    this.applyFilter();
  }

  /** True when config requests folder hint: node is container of a task group (no task, no viewMode). Shown as secondary icon. */
  showFolderHintForTaskGroupContainer(node: FileNode | null): boolean {
    if (!node || !this.currentTreeType || node.nodeType == null) return false;
    const nodeCfg = config.treeTypeNodeTypes?.[this.currentTreeType]?.nodeTypes?.[node.nodeType];
    if (!nodeCfg?.folderHintForTaskGroupContainer) return false;
    const taskId = (node as any).taskId;
    const viewMode = (node as any).viewMode;
    return (taskId == null || taskId === '') && (viewMode == null || viewMode === '');
  }

  /** Icon for tree row from config (nodeType); fallback by node.type when no treeType. */
  getNodeIcon(node: FileNode): string {
    if (!node || node.status === constants.entityStatus.pendingDelete) return 'close';
    if (this.currentTreeType && node.nodeType != null) {
      return getNodeTypeIcon(this.currentTreeType, node.nodeType);
    }
    if (node.type === constants.treeRenderType.folder) return constants.treeRenderType.folder;
    return 'description';
  }

  /** Icon for a node type from config (for add buttons). */
  getNodeIconForType(nodeType: string): string {
    if (this.currentTreeType) {
      return getNodeTypeIcon(this.currentTreeType, nodeType);
    }
    if (nodeType === constants.treeRenderType.folder) return constants.treeRenderType.folder;
    return 'description';
  }

  /** Icon font for tree row (from config); undefined for default font. */
  getNodeIconFont(node: FileNode): string | undefined {
    if (!node || !this.currentTreeType || node.nodeType == null) return undefined;
    return getNodeTypeIconFont(this.currentTreeType, node.nodeType);
  }

  /** Icon font for a node type (for add buttons); undefined for default font. */
  getNodeIconFontForType(nodeType: string): string | undefined {
    return this.currentTreeType ? getNodeTypeIconFont(this.currentTreeType, nodeType) : undefined;
  }

  /** True when config enables mapping UI (and view-mode hint) for this node type. */
  showMappingInTaskPanelForNodeType(nodeType: string): boolean {
    return !!(this.currentTreeType && config.treeTypeNodeTypes?.[this.currentTreeType]?.nodeTypes?.[nodeType]?.showMappingInTaskPanel);
  }

  /** Material icon name for a node view mode code (from config.nodeViewModes). */
  getViewModeIcon(viewMode: string): string {
    if (!viewMode) return config.nodeViewModeFallbackIcon;
    return config.nodeViewModes?.[viewMode]?.icon ?? config.nodeViewModeFallbackIcon;
  }

  /** Merge external node updates into a mutable tree snapshot and rebuild. */
  updateNode(nodeUpdated: NodeUpdatePayload): void {
    const dataToChange = this.cloneTreeDataSnapshot();
    const context = this.findNodeContext(dataToChange, nodeUpdated.id);
    if (!context) {
      console.warn('DataTreeComponent.updateNode - Node not found in tree', {
        nodeId: nodeUpdated.id
      });
      return;
    }
    const originalNode = context.node;
    const updatedNode = {
      ...originalNode,
      ...nodeUpdated,
      children: nodeUpdated.children || originalNode.children,
      id: originalNode.id
    };
    if (this.currentTreeType && updatedNode.nodeType != null) {
      const canHaveChildren = canNodeTypeHaveChildren(this.currentTreeType, updatedNode.nodeType);
      updatedNode.type = canHaveChildren ? constants.treeRenderType.folder : constants.treeRenderType.node;
      // isFolder removed - computed on demand from nodeType
    }
    context.siblings[context.index] = updatedNode;
    this.rebuildTreeForData(dataToChange);

  }

  /** 
   * Add a new node to the tree. Type/isFolder derived from nodeType + treeType config (not stored).
   */
  addNodeToTree(newNode: FileNode): void {
    // Set type for icon display (folder vs node)
    const canHaveChildren = this.currentTreeType ? canNodeTypeHaveChildren(this.currentTreeType, newNode.nodeType) : false;
    newNode.type = canHaveChildren ? constants.treeRenderType.folder : constants.treeRenderType.node;
    // Note: isFolder not stored; computed on demand from nodeType
    
    let dataToChange: FileNode[];
    const raw = this.getTreeData();
    if (!raw || !Array.isArray(raw) || raw.length === 0) {
      dataToChange = [this.createSyntheticRootNode()];
    } else {
      dataToChange = this.cloneValue(raw);
    }
    
    if(newNode.parent == null) {
      const rootChildren = this.getRootChildren(dataToChange);
      newNode.order = rootChildren.length;
      rootChildren.push(newNode);
    }
    else {
      const parentContext = this.findNodeContext(dataToChange, newNode.parent);
      if (!parentContext) {
        console.warn('DataTreeComponent.addNodeToTree - Parent not found in tree', {
          parentId: newNode.parent
        });
        return;
      }
      newNode.order = parentContext.node.children.length;
      parentContext.node.children.push(newNode);
    }
    if (newNode.id !== undefined && newNode.id !== null) {
      this.newlyInsertedNodeId = newNode.id;
      this.collectAncestorIdsInTree(dataToChange, newNode.id).forEach((ancestorId) => {
        this.expandedNodeIdsState.add(ancestorId);
      });
    }
    this.rebuildTreeForData(dataToChange);
  }

  private getNodeParent(treeData: FileNode[], node: FileNode): FileNode | null {
    if (node.parent === null || node.parent === undefined) {
      return null;
    }
    return this.findNodeContext(treeData, node.parent)?.node ?? null;
  }

  private emitSelectedNode(nodeClicked: FileNode, treeData: FileNode[]): void {
    const nodeParent = this.getNodeParent(treeData, nodeClicked);
    this.emitNode.emit({ nodeClicked, nodeParent });
  }

  /** Restore a pending-delete branch, recovering original state when available. */
  private handleRestoreAction(changedData: FileNode[], nodeClicked: FileNode): void {
    this.preserveExpandedStateFromTreeSnapshot();
    // Keep the clicked branch open across rebuild even if adapter snapshot is stale.
    this.expandedNodeIdsState.add(String(nodeClicked.id));
    this.queueNodeForReexpand(nodeClicked.id);
    this.restoreChildren(this.getNodeChildren(nodeClicked), changedData);
    if (this.isPersistedNodeId(nodeClicked.id) && this.originalNodeStates.has(nodeClicked.id)) {
      this.revertNodeToOriginal(changedData, nodeClicked);
    } else {
      nodeClicked.status = constants.entityStatus.pendingCreation;
    }
    this.restoreAncestors(changedData, nodeClicked);
    this.rebuildTreeForData(changedData);
  }

  /** Revert a modified persisted node and re-emit selection when still selected. */
  private handleRevertAction(changedData: FileNode[], nodeClicked: FileNode, id: string | number): void {
    this.revertNodeToOriginal(changedData, nodeClicked);
    this.rebuildTreeForData(changedData);
    if (this.isSameId(this.selectedNodeId, id)) {
      this.emitSelectedNode(nodeClicked, changedData);
    }
  }

  /** Mark node and descendants as pending-delete. */
  private handleDeleteAction(changedData: FileNode[], nodeClicked: FileNode): void {
    this.preserveExpandedStateFromTreeSnapshot();
    // Keep the clicked branch open across rebuild even if adapter snapshot is stale.
    this.expandedNodeIdsState.add(String(nodeClicked.id));
    this.queueNodeForReexpand(nodeClicked.id);
    this.deleteChildren(this.getNodeChildren(nodeClicked));
    nodeClicked.status = constants.entityStatus.pendingDelete;
    this.rebuildTreeForData(changedData);
  }

  /** Remove unsaved node (pending-creation) from tree. */
  private handleRemoveAction(changedData: FileNode[], nodeClicked: FileNode): void {
    this.removePendingCreationNode(changedData, nodeClicked);
    this.rebuildTreeForData(changedData);
  }

  /** Select node for edition and emit current parent context. */
  private handleEditAction(id: string | number, changedData: FileNode[], nodeClicked: FileNode): void {
    this.selectedNodeId = id;
    this.emitSelectedNode(nodeClicked, changedData);
  }

  /** Resolve mutable snapshot + clicked node for button actions. */
  private resolveActionContext(id: string | number): ActionContext | null {
    const changedData = this.cloneTreeDataSnapshot();
    const context = this.findNodeContext(changedData, id);
    if (!context) return null;
    return { changedData, nodeClicked: context.node };
  }
  /** Route row-button actions through isolated handlers using a cloned snapshot. */
  onButtonClicked(id: string | number, button: NodeAction): void {
    const actionContext = this.resolveActionContext(id);
    if (!actionContext) {
      return;
    }
    const { changedData, nodeClicked } = actionContext;
    switch (button) {
      case 'edit':
        this.handleEditAction(id, changedData, nodeClicked);
        break;
      case 'delete':
        this.handleDeleteAction(changedData, nodeClicked);
        break;
      case 'restore':
        this.handleRestoreAction(changedData, nodeClicked);
        break;
      case 'revert':
        this.handleRevertAction(changedData, nodeClicked, id);
        break;
      case 'remove':
        this.handleRemoveAction(changedData, nodeClicked);
        break;
      default:
        return;
    }

  }

  emitAllRows(event: string): void
  {
    const dataToEmit = this.cloneTreeDataSnapshot();
    const allRows = this.getAllChildren(dataToEmit);
    this.emitAllNodes.emit({ event, data: allRows });
  }

  getAllChildren(arr: FileNode[]): FileNode[]
  {
    const result: FileNode[] = [];
    let subResult: FileNode[] | undefined;
    arr.forEach((item, _i) => {
      if (this.getNodeChildren(item).length>0) {
        subResult = this.getAllChildren(this.getNodeChildren(item));
        if (subResult) result.push(...subResult);
      }
      result.push(item);

    });
    return result;
  }

  deleteChildren(arr: FileNode[]): void
  {
    arr.forEach((item, _i) => {
      if (this.getNodeChildren(item).length>0) {
        this.deleteChildren(this.getNodeChildren(item));
      }
      item.status = constants.entityStatus.pendingDelete

    });
  }

  restoreChildren(arr: FileNode[], changedData?: FileNode[]): void
  {
    arr.forEach((item, _i) => {
      if (this.getNodeChildren(item).length>0) {
        this.restoreChildren(this.getNodeChildren(item), changedData);
      }
      
      // If node exists (id >= 0) and has original state, revert to original state
      // This overrides any modifications that were made before deletion
      if (this.isPersistedNodeId(item.id) && changedData && this.originalNodeStates.has(item.id)) {
        this.revertNodeToOriginal(changedData, item);
      } else {
        // New node (id < 0) - just restore status
        item.status = this.isPersistedNodeId(item.id) ? constants.entityStatus.modified : constants.entityStatus.pendingCreation;
      }
    });
  }

  /**
   * Restore ancestors (parents, grandparents, etc.) recursively
   * Only restores the ancestor nodes themselves, not their other children (siblings)
   * If ancestor has original state, restores to original state (overriding modifications)
   */
  restoreAncestors(changedData: FileNode[], node: FileNode): void {
    if (!node || node.parent === null || node.parent === undefined) {
      return; // No parent, stop recursion
    }
    
    const parentNode = this.findNodeContext(changedData, node.parent)?.node;
    if (parentNode && parentNode.status === constants.entityStatus.pendingDelete) {
      // If parent exists (id >= 0) and has original state, revert to original state
      // This overrides any modifications that were made before deletion
      if (this.isPersistedNodeId(parentNode.id) && this.originalNodeStates.has(parentNode.id)) {
        this.revertNodeToOriginal(changedData, parentNode);
      } else {
        // New node (id < 0) - just restore status
        parentNode.status = this.isPersistedNodeId(parentNode.id) ? constants.entityStatus.modified : constants.entityStatus.pendingCreation;
      }
      
      // Recursively restore the parent's ancestors
      this.restoreAncestors(changedData, parentNode);
    }
  }

  /**
   * Revert a Modified node to its original state
   */
  revertNodeToOriginal(changedData: FileNode[], node: FileNode): void {
    if (!node || !node.id) {
      return;
    }
    
    const originalState = this.originalNodeStates.get(node.id);
    if (originalState) {
      // Restore original properties, but preserve children and tree structure
      const children = this.getNodeChildren(node);
      const parent = node.parent;
      
      // Copy original state properties
      Object.keys(originalState).forEach(key => {
        if (key !== 'children' && key !== 'parent') {
          node[key] = originalState[key];
        }
      });
      
      // Restore children and parent
      node.children = children;
      node.parent = parent;
      
      // Remove Modified status (node returns to saved state)
      delete node.status;
      
      // Also revert any modified children
      if (children.length > 0) {
        children.forEach((child: FileNode) => {
          if (child.status === constants.entityStatus.modified) {
            this.revertNodeToOriginal(changedData, child);
          }
        });
      }
    }
  }

  /**
   * Remove a pendingCreation node from the tree
   * Also removes all its children recursively
   */
  removePendingCreationNode(changedData: FileNode[], node: FileNode): void {
    if (!node || node.status !== constants.entityStatus.pendingCreation) {
      return;
    }
    
    // Remove all children first (recursively)
    if (this.getNodeChildren(node).length > 0) {
      this.getNodeChildren(node).forEach((child: FileNode) => {
        if (child.status === constants.entityStatus.pendingCreation) {
          this.removePendingCreationNode(changedData, child);
        }
        // Remove from original states map
        if (child.id && this.originalNodeStates.has(child.id)) {
          this.originalNodeStates.delete(child.id);
        }
      });
    }
    
    // Find and remove from parent's children array
    if (node.parent !== null && node.parent !== undefined) {
      const parentNode = this.findNodeContext(changedData, node.parent)?.node;
      if (parentNode?.children) {
        const index = parentNode.children.findIndex((child: FileNode) => this.isSameId(child.id, node.id));
        if (index !== -1) {
          parentNode.children.splice(index, 1);
        }
      }
    } else {
      // Root level - remove from root's children
      const rootChildren = this.getRootChildren(changedData);
      if (rootChildren.length > 0) {
        const index = rootChildren.findIndex((child: FileNode) => this.isSameId(child.id, node.id));
        if (index !== -1) {
          rootChildren.splice(index, 1);
        }
      }
    }
    
    // Remove from original states map if stored
    if (node.id && this.originalNodeStates.has(node.id)) {
      this.originalNodeStates.delete(node.id);
    }
  }

  getAllowedRootTypes(): string[] {
    return this.getAllowedTypesForParent ? this.getAllowedTypesForParent(null) : [];
  }

  getAllowedChildTypes(parentNode: FileNode | undefined): string[] {
    return parentNode && this.getAllowedTypesForParent ? this.getAllowedTypesForParent(parentNode) : [];
  }

  /** Id-first flat->nested resolution for migration away from map identity coupling. */
  private resolveNestedFromFlatIdFirst(node: FileFlatNode | undefined | null): FileNode | undefined {
    if (!node) return undefined;
    return this.findNodeById(node.id) ?? undefined;
  }

  resolveNode(node: FileFlatNode | FileNode | undefined): FileNode | undefined {
    if (!node) return undefined;
    const maybeNested = node as FileNode;
    if (maybeNested.children !== undefined || maybeNested.nodeType !== undefined) {
      return maybeNested;
    }
    return this.resolveNestedFromFlatIdFirst(node as FileFlatNode);
  }

  addRootNode(nodeType: string): void {
    this.addNode.emit({ parent: null, nodeType });
  }

  onAddChildNode(parentNode: FileNode | undefined, nodeType: string): void {
    if (!parentNode) return;
    this.addNode.emit({ parent: parentNode, nodeType });
  }

  getNodeDisplay(node: FileFlatNode | FileNode | undefined): string {
    // Hide root node (has isRoot property or empty name with null id)
    // Use visibility hidden instead of display none to preserve tree structure
    const nestedNode = this.resolveNode(node);
    if (this.isRootNestedNode(nestedNode)) {
      return 'none';
    }
    return 'flex';
  }

  isRootNode(node: FileFlatNode | FileNode | undefined): boolean {
    return this.isRootNestedNode(this.resolveNode(node));
  }

  isRootChild(node: FileFlatNode | FileNode | undefined): boolean {
    // Check if this node is a direct child of the root (level 1)
    return this.getNodeLevel(node) === 1;
  }

  isRootDescendant(node: FileFlatNode | FileNode | undefined): boolean {
    // Check if this node is any descendant of the root (level >= 1)
    // Since root is at level 0 and hidden, all nodes with level >= 1 should be shifted left
    return this.isVisibleRootDescendant(node);
  }

  /**
   * Checks if a node or any of its ancestors are inactive
   * @param node The tree node to check
   * @returns true if the node or any ancestor is inactive
   */
  private isNodeOrAncestorInactiveNested(node: FileNode): boolean {
    if (node.active === false) {
      return true;
    }
    if (node.parent === null || node.parent === undefined) {
      return false;
    }
    const parentNode = this.findNodeById(node.parent);
    return parentNode ? this.isNodeOrAncestorInactiveNested(parentNode) : false;
  }

  isNodeOrAncestorInactive(node: FileFlatNode | FileNode | undefined): boolean {
    if (!node) {
      return false;
    }
    const nestedNode = this.resolveNode(node);
    if (!nestedNode) {
      return false;
    }
    return this.isNodeOrAncestorInactiveNested(nestedNode);
  }

  /**
   * Finds a nested node by its ID in the tree data
   * @param id The node ID to find
   * @returns The found FileNode or null
   */
  private findNodeById(id: string | number): FileNode | null {
    return this.findNodeByIdInTree(this.getTreeData(), id) ?? null;
  }

  getAdjustedPadding(node: FileFlatNode | FileNode | undefined): string | null {
    if (!node) {
      return '13px';
    }
    if (!this.isRootDescendant(node)) {
      return '13px';
    }
    // Custom padding based on 13-35-58 relationship
    // aria-level 2 (first visible) = 13px
    // aria-level 3 (second visible) = 35px (13 + 22)
    // aria-level 4 (third visible) = 58px (35 + 23)
    // Continue with 22px increment
    const level = this.getNodeLevel(node);
    if (level === 1) return '13px'; // First visible
    if (level === 2) return '35px'; // Second visible
    if (level === 3) return '58px'; // Third visible
    // For levels beyond 3, use 22px increment
    return `${58 + (level - 3) * 22}px`;
  }

  expandAll(): void {
    this.expandAllFlatNodes();
    this.syncTreeExpansionFromIdState();
  }

  collapseToFirstLevel(): void {
    this.collapseAllFlatNodes();

    // Expand root only so level-1 nodes appear (root hidden via CSS); do not expand level-1
    const root = this.getTreeData().find((node) => this.isRootNestedNode(node));
    if (root) {
      this.expandedNodeIdsState.add(String(root.id));
    }
    this.syncTreeExpansionFromIdState();
  }

}

/** Whether this node type can have children (container). */
function canNodeTypeHaveChildren(treeType: string, nodeType: string | null): boolean {
  if (!treeType || !nodeType) return false;
  const c = config.treeTypeNodeTypes?.[treeType];
  const nodeTypes = (c as any)?.nodeTypes;
  const allowed = nodeTypes?.[nodeType]?.allowedChildren;
  return Array.isArray(allowed) && allowed.length > 0;
}

/** Icon for a node type from config; fallback by container vs leaf. */
function getNodeTypeIcon(treeType: string, nodeType: string | null): string {
  if (!nodeType) return 'description';
  const c = config.treeTypeNodeTypes?.[treeType];
  const nodeTypes = (c as any)?.nodeTypes;
  const icon = nodeTypes?.[nodeType]?.icon;
  if (icon != null && icon !== '') return icon;
  return canNodeTypeHaveChildren(treeType, nodeType) ? 'folder' : 'description';
}

/** Icon font for a node type from config (e.g. material-symbols-outlined); undefined for default. */
function getNodeTypeIconFont(treeType: string, nodeType: string | null): string | undefined {
  if (!treeType || !nodeType) return undefined;
  const c = config.treeTypeNodeTypes?.[treeType];
  const nodeTypes = (c as any)?.nodeTypes;
  return nodeTypes?.[nodeType]?.iconFont;
}


