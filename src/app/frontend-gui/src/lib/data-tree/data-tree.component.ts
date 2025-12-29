import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import {Component, ElementRef, EventEmitter, Injectable, Input, Output, ViewChild} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import {SelectionModel} from '@angular/cdk/collections';

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
  cartographyId: any
  cartographyName: any
  datasetURL: any
  description: any
  filterGetFeatureInfo: any
  filterGetMap: any
  filterSelectable: any
  isFolder: any
  isRoot: any
  metadataURL: any
  order: any
  parent: any
  queryableActive: any
  radio: any
  tooltip: any
  image: any
  taskName: any
  viewMode: any
  filterable: any
  _links: any
  status: any
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
  get data(): any { return this.dataChange.value; }

  initialize(dataObj, allNewElements) {

    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    const data = this.buildFileTree(dataObj, 0, allNewElements);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(arrayTreeNodes: any[], level: number, allNewElements: any) {
    const map = {};
    if(arrayTreeNodes.length===0)
    {
      map['root'] = {
        isFolder: true,
        name: '',
        type: 'folder',
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
        obj.type= (treeNode.isFolder) ? "folder" : "node";
        obj.nodeType = treeNode.nodeType;
        if(allNewElements) {
          obj.status='pendingCreation';
          if(obj.id) { obj.id = obj.id * -1 }
          if(obj.parent) { obj.parent = obj.parent * -1 }
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
      map['root'].type='folder';
      map['root'].name='';
      map['root'].order=0;
      map['root'].isFolder=true;
      map['root'].isRoot=true;
      map['root'].id=null;
    }


    return map['root'];
  }


  deleteItem(node: FileNode, changedData:any) {
    this.deleteNode(changedData.children, node);
    this.dataChange.next(changedData);
  }

  deleteNode(nodes: FileNode[], nodeToDelete: FileNode) {
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

  setOrder(data: any[]){
    for(let i=0; i< data.length; i++){
      data[i].order=i;
      if(data[i].id && Number(data[i].id) < 0){
        data[i].status="pendingCreation";
      }
      if(!data[i].status && !data[i]['status']) {
        data[i].status="Modified";
      }
    }
    return data;
   }

  copyPasteItem(from: FileNode, to: FileNode, changedData:any): FileNode {
    return this.insertItem(to, from, changedData);
  }

  copyPasteItemAbove(from: FileNode, to: FileNode,changedData:any): FileNode {
    return this.insertItemAbove(to, from, changedData);
  }

  copyPasteItemBelow(from: FileNode, to: FileNode,changedData:any): FileNode {
    return this.insertItemBelow(to, from, changedData);
  }

  /** Add an item to to-do list */

  getNewItem(node:FileNode){
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
      isFolder: node.isFolder,
      metadataURL: node.metadataURL,
      order: node.order,
      queryableActive: node.queryableActive,
      radio: node.radio,
      tooltip: node.tooltip,
      image: node.image,
      taskName: node.taskName,
      viewMode: node.viewMode,
      filterable: node.filterable,
      _links: node._links
    } as FileNode;
  }

  insertItem(parent: FileNode, node: FileNode,changedData:any): FileNode {
    if (!parent.children) {
      parent.children = [];
    }
    const newItem = this.getNewItem(node)
    newItem.parent = parent.id == undefined ? null : parent.id;
    parent.children.push(newItem);
    this.setOrder(parent.children)
    this.dataChange.next(changedData);
    return newItem;
  }

  insertItemAbove(node: FileNode, nodeDrag: FileNode,changedData:any): FileNode {
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
    this.dataChange.next(changedData);
    return newItem;
  }

  insertItemBelow(node: FileNode, nodeDrag: FileNode,changedData:any): FileNode {
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
    this.dataChange.next(changedData);
    return newItem;
  }


  getParentFromNodes(node: FileNode,changedData:any): FileNode {
    for (let i = 0; i < changedData.children.length; ++i) {
      const currentRoot =  changedData.children[i];
      const parent = this.getParent(currentRoot, node);
      if (parent != null) {
        return parent;
      }
    }
    return null;
  }


  getParent(currentRoot: FileNode, node: FileNode): FileNode {
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

/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'app-data-tree',
  templateUrl: 'data-tree.component.html',
  styleUrls: ['data-tree.component.scss'],
  providers: [FileDatabase]
})
export class DataTreeComponent {
  @Output() createNode: EventEmitter<any>;
  @Output() createFolder: EventEmitter<any>;
  @Output() emitNode: EventEmitter<any>;
  @Output() emitAllNodes: EventEmitter<any>;
  @Output() loadButtonClicked: EventEmitter<any>;
  @Input() eventNodeUpdatedSubscription: Observable <any> ;
  @Input() eventCreateNodeSubscription: Observable <any> ;
  @Input() eventGetAllRowsSubscription: Observable <any> ;
  @Input() eventRefreshSubscription: Observable <any> ;
  @Input() loadDataButton: Observable <any> ;
  private _eventNodeUpdatedSubscription: any;
  private _eventCreateNodeSubscription: any;
  private _eventGetAllRowsSubscription: any;
  private _eventRefreshSubscription: any;
  treeControl: FlatTreeControl<FileFlatNode>;
  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
  // expansion model tracks expansion state
  expansionModel = new SelectionModel<string>(true);
  dragging = false;
  expandTimeout: any;
  expandDelay = 1000;
  validateDrop = false;
  treeData: any;
  filterValue: string = '';
  originalData: FileNode[] = [];
  selectedNodeId: string | null = null;

  @Input() getAll: () => Observable<any>;
  @Input() allNewElements: any;


  /* Drag and drop */
  dragNode: any;
  dragNodeExpandOverWaitTimeMs = 1500;
  dragNodeExpandOverNode: any;
  dragNodeExpandOverTime: number;
  dragNodeExpandOverArea: string;
  @ViewChild('emptyItem') emptyItem: ElementRef;

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<FileFlatNode, FileNode>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<FileNode, FileFlatNode>();
    
    /** Map to store original node states for revert functionality */
    originalNodeStates = new Map<string | number, any>();


  constructor(public database: FileDatabase) {
    this.emitNode = new EventEmitter();
    this.createNode = new EventEmitter();
    this.createFolder = new EventEmitter();
    this.emitAllNodes = new EventEmitter();
    this.loadButtonClicked = new EventEmitter();
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  }

  ngOnInit(){
    if(this.eventNodeUpdatedSubscription)
    {
      this.eventNodeUpdatedSubscription.subscribe(
        (node) => {
          this.updateNode(node);
        }
      )
    }
    if(this.eventCreateNodeSubscription)
    {
      this.eventCreateNodeSubscription.subscribe(
        (node) => {
          if(node.isFolder) this.createNewFolder(node);
          else this.createNewNode(node);
        }
      )
    }


    if (this.eventGetAllRowsSubscription) {
      this._eventGetAllRowsSubscription = this.eventGetAllRowsSubscription.subscribe((event: string) => {
        this.emitAllRows(event);
      });
    }

    if (this.eventRefreshSubscription) {
      this._eventRefreshSubscription = this.eventRefreshSubscription.subscribe(() => {
        this.getElements();
      });
    }

    this.getElements();
  }

  loadDataButtonClicked(){
    const dataToEmit = JSON.parse(JSON.stringify(this.dataSource.data))
    const allRows = this.getAllChildren(dataToEmit);
    this.loadButtonClicked.emit(allRows)
  }

  getElements(): void {
    this.getAll()
    .subscribe((items) => {
      this.treeData = items;
      this.database.initialize(this.treeData, this.allNewElements);
      this.database.dataChange.subscribe(data => this.rebuildTreeForData([data]));
    });
  }


  transformer = (node: FileNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.name === node.name
      ? existingNode
      : new FileFlatNode((node.children && node.children.length > 0),node.name,level,node.type,node.id,node.status, node.nodeType);

    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;

  }
  private _getLevel = (node: FileFlatNode) => node.level;
  private _isExpandable = (node: FileFlatNode) => node.expandable;
  private _getChildren = (node: FileNode): Observable<FileNode[]> => observableOf(node.children);
  hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;


  /**
   * This constructs an array of nodes that matches the DOM
   */
  visibleNodes(): FileNode[] {
    const result = [];

    function addExpandedChildren(node: FileNode, expanded: string[]) {
      result.push(node);
      if (expanded.indexOf(node.id) != -1) {
        node.children.map((child) => addExpandedChildren(child, expanded));
      }
    }
    this.dataSource.data.forEach((node) => {
      addExpandedChildren(node, this.expansionModel.selected);
    });
    return result;
  }


   findNodeSiblings(arr: Array<any>, id: string | number): Array<any> {
    let result, subResult;
    const idStr = String(id);
    arr.forEach((item, i) => {
      if (String(item.id) === idStr) {
        result = arr;
      } else if (item.children) {
        subResult = this.findNodeSiblings(item.children, id);
        if (subResult) result = subResult;
      }
    });
    return result;

  }


  handleDragStart(event, node) {
    // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
    event.dataTransfer.setData('foo', 'bar');
    event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
    this.dragNode = node;
    this.treeControl.collapse(node);
  }

  handleDragOver(event, node) {
    event.preventDefault();

    // Handle node expand
    if (node === this.dragNodeExpandOverNode) {
      if (this.dragNode !== node && !this.treeControl.isExpanded(node)) {
        if ((new Date().getTime() - this.dragNodeExpandOverTime) > this.dragNodeExpandOverWaitTimeMs) {
          this.treeControl.expand(node);
        }
      }
    } else {
      this.dragNodeExpandOverNode = node;
      this.dragNodeExpandOverTime = new Date().getTime();
    }

    // Handle drag area
    const percentageX = event.offsetX / event.target.clientWidth;
    const percentageY = event.offsetY / event.target.clientHeight;
    if (percentageY < 0.25) {
      this.dragNodeExpandOverArea = 'above';
    } else if (percentageY > 0.75) {
      this.dragNodeExpandOverArea = 'below';
    } else {
      this.dragNodeExpandOverArea = 'center';
    }
  }

  handleDrop(event, node) {
    event.preventDefault();
    const changedData = JSON.parse(JSON.stringify(this.dataSource.data))
    let toFlatNode;
    if(node.id === undefined) {
      toFlatNode=changedData[0]
    } else {
      toFlatNode= this.findNodeSiblings(changedData[0].children, node.id).find(nodeAct => nodeAct.id === node.id);
    }
    let fromFlatNode;
    if( this.dragNode.id === undefined) {
      fromFlatNode=changedData[0]
    } else {
      fromFlatNode = this.findNodeSiblings(changedData[0].children, this.dragNode.id).find(nodeAct => nodeAct.id === this.dragNode.id);
    }
    if (this.dragNode.status!="pendingDelete" && node !== this.dragNode && (this.dragNodeExpandOverArea !== 'center' || (this.dragNodeExpandOverArea === 'center' && toFlatNode.isFolder))) {
      let newItem: FileNode;

      if (this.dragNodeExpandOverArea === 'above') {
        newItem = this.database.copyPasteItemAbove(fromFlatNode,toFlatNode,changedData[0]);
      } else if (this.dragNodeExpandOverArea === 'below') {
        newItem = this.database.copyPasteItemBelow(fromFlatNode,toFlatNode,changedData[0]);
      } else {
        newItem = this.database.copyPasteItem(fromFlatNode, toFlatNode,changedData[0]);
      }
      const parentLvl = this.treeControl.dataNodes.find((n) => n.id === fromFlatNode.id).level;
      fromFlatNode.children.forEach(child=>{
        this.treeControl.dataNodes.find((n) => n.id === child.id).level=parentLvl+1
      });
      this.database.deleteItem(fromFlatNode,changedData[0]);
      this.treeControl.expandDescendants(this.nestedNodeMap.get(newItem));
    }

    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
  }

  handleDragEnd(event) {
    this.dragNode = null;
    this.dragNodeExpandOverNode = null;
    this.dragNodeExpandOverTime = 0;
  }

  /**
   * The following methods are for persisting the tree expand state
   * after being rebuilt
   */

   sortByOrder(data: any[]){
    // data.sort((a,b) => a.order.toString().localeCompare( b.order.toString()));
    data.sort((a,b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0));
    data.forEach((item) => {
      if (item.children && item.children.length>0) {
        this.sortByOrder(item.children);
      }

    });
   }

   setOrder(data: any[]){
    for(let i=0; i< data.length; i++){
      data[i].order=i;
      if(! data[i].status) {
        data[i].status="Modified";
      }
    }
    return data;
   }

  rebuildTreeForData(data: any[]) {
    //this.dataSource.data = data;
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
  private storeOriginalStates(nodes: any[]): void {
    if (!nodes || nodes.length === 0) {
      return;
    }
    nodes.forEach(node => {
      if (node.id !== null && node.id !== undefined && node.id >= 0) {
        // Only store original state if:
        // 1. Not already stored (to preserve original state)
        // 2. Node doesn't have Modified or pendingCreation status (it's in saved state)
        if (!this.originalNodeStates.has(node.id) && 
            node.status !== 'Modified' && 
            node.status !== 'pendingCreation') {
          // Deep clone to store original state
          const originalState = JSON.parse(JSON.stringify(node));
          // Remove status from original state so we can restore to clean state
          delete originalState.status;
          this.originalNodeStates.set(node.id, originalState);
        }
      }
      // Recursively store children
      if (node.children && node.children.length > 0) {
        this.storeOriginalStates(node.children);
      }
    });
  }

  applyFilter() {
    let filteredData = this.originalData;
    
    if (this.filterValue && this.filterValue.trim() !== '') {
      const filter = this.filterValue.toLowerCase().trim();
      filteredData = this.filterTree(this.originalData, filter);
    }
    
    this.dataSource.data = [];
    this.dataSource.data = filteredData;
    
    // Auto-expand only root node (first level) - do not expand nested children
    setTimeout(() => {
      if (filteredData.length === 1 && (filteredData[0] as any).isRoot === true && filteredData[0].children) {
        const rootFlatNode = this.treeControl.dataNodes.find((n) => {
          const nested = this.flatNodeMap.get(n);
          return nested && (nested as any).isRoot === true;
        });
        if (rootFlatNode) {
          // Only expand the root node, not its descendants
          this.treeControl.expand(rootFlatNode);
          this.expansionModel.select(rootFlatNode.id);
        }
      }
      // Restore previously expanded nodes (but not auto-expand them if they're nested)
      this.treeControl.expansionModel.selected.forEach((nodeAct) => {
        if(nodeAct){
          const node = this.treeControl.dataNodes.find((n) => n.id === nodeAct.id);
          if (node) {
            // Only restore expansion if it was manually expanded before
            // Don't auto-expand nested nodes
            const nested = this.flatNodeMap.get(node);
            const isRoot = nested && (nested as any).isRoot === true;
            if (!isRoot) {
              // Only restore expansion for non-root nodes that were previously expanded
              this.treeControl.expand(node);
            }
          }
        }
      });
    }, 0);
  }

  filterTree(nodes: FileNode[], filter: string): FileNode[] {
    if (!nodes || nodes.length === 0) {
      return [];
    }

    return nodes.map(node => {
      const nodeMatches = node.name && node.name.toLowerCase().includes(filter);
      const filteredChildren = node.children ? this.filterTree(node.children, filter) : [];
      const hasMatchingChildren = filteredChildren.length > 0;

      // Include node if it matches or has matching children
      if (nodeMatches || hasMatchingChildren) {
        const filteredNode = { ...node };
        filteredNode.children = filteredChildren;
        return filteredNode;
      }
      return null;
    }).filter(node => node !== null) as FileNode[];
  }

  onFilterChange(filterValue: string) {
    this.filterValue = filterValue;
    this.applyFilter();
  }

  onFilterKeyup(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    this.filterValue = input.value;
    this.applyFilter();
  }

  private getParentNode(node: FileFlatNode): FileFlatNode | null {
    const currentLevel = node.level;
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  updateNode(nodeUpdated)
  {
    console.log('DataTreeComponent.updateNode - Received node update', {
      nodeId: nodeUpdated.id,
      nodeName: nodeUpdated.name,
      nodeType: nodeUpdated.nodeType,
      hasChildren: !!nodeUpdated.children
    });
    const dataToChange = JSON.parse(JSON.stringify(this.dataSource.data))
    const siblings = this.findNodeSiblings(dataToChange, String(nodeUpdated.id));
    if (!siblings) {
      console.warn('DataTreeComponent.updateNode - Node not found in tree', {
        nodeId: nodeUpdated.id
      });
      return;
    }
    const index = siblings.findIndex(node => String(node.id) === String(nodeUpdated.id));
    if (index === -1) {
      console.warn('DataTreeComponent.updateNode - Node index not found', {
        nodeId: nodeUpdated.id,
        siblingsCount: siblings.length
      });
      return;
    }
    // Preserve children if they exist in the original node
    const originalNode = siblings[index];
    console.log('DataTreeComponent.updateNode - Original node before update', {
      nodeId: originalNode.id,
      originalName: originalNode.name,
      originalNodeType: originalNode.nodeType,
      hasChildren: !!originalNode.children
    });
    const updatedNode = {
      ...originalNode,
      ...nodeUpdated,
      children: nodeUpdated.children || originalNode.children,
      id: originalNode.id // Preserve original ID type
    };
    console.log('DataTreeComponent.updateNode - Updated node after merge', {
      nodeId: updatedNode.id,
      updatedName: updatedNode.name,
      updatedNodeType: updatedNode.nodeType,
      hasChildren: !!updatedNode.children
    });
    siblings[index] = updatedNode;
    this.rebuildTreeForData(dataToChange);
    console.log('DataTreeComponent.updateNode - Node update completed', {
      nodeId: updatedNode.id,
      nodeName: updatedNode.name
    });

  }

  createNewFolder(newFolder)
  {
    newFolder.type="folder";
    const dataToChange = JSON.parse(JSON.stringify(this.dataSource.data))
    if(newFolder.parent === null) {
      newFolder.order=dataToChange[0].children.length;
      dataToChange[0].children.push(newFolder)
    }
    else{
      const siblings = this.findNodeSiblings(dataToChange, newFolder.parent);
      const index = siblings.findIndex(node => node.id === newFolder.parent);
      newFolder.order=siblings[index].children.length;
      siblings[index].children.push(newFolder)
    }
    this.rebuildTreeForData(dataToChange);

  }

  createNewNode(newNode)
  {
    newNode.type="node";
    const dataToChange = JSON.parse(JSON.stringify(this.dataSource.data))
    if(newNode.parent === null) {
      newNode.order=dataToChange[0].children.length;
      dataToChange[0].children.push(newNode)
    }
    else{
    const siblings = this.findNodeSiblings(dataToChange, newNode.parent);
      const index = siblings.findIndex(node => node.id === newNode.parent);
    newNode.order=siblings[index].children.length;
    siblings[index].children.push(newNode)
    }

    this.rebuildTreeForData(dataToChange);

  }



  onButtonClicked(id, button: string)
  {
    const changedData = JSON.parse(JSON.stringify(this.dataSource.data))
    const siblings = this.findNodeSiblings(changedData, id);
    const nodeClicked = siblings.find(node => node.id === id);
    // Track selected node for styling
    if(button === 'edit') {
      this.selectedNodeId = id;
    }
    if(button ==='edit')  {
      const nodeParent = nodeClicked.parent ?
        this.findNodeSiblings(changedData, nodeClicked.parent).find(node => node.id === nodeClicked.parent) : null;
      const emitedObj = {
        nodeClicked,
        nodeParent,
      };
      this.emitNode.emit(emitedObj);
    } else if(button === 'newFolder') {
      this.createFolder.emit(nodeClicked);
    } else if(button === 'newNode') {
      this.createNode.emit( nodeClicked);
    } else if(button === 'delete') {
      // let children= this.getAllChildren(nodeClicked.children)
      // children.forEach(children => {
      //   children.status='pendingDelete';
      // });
      this.deleteChildren(nodeClicked.children);
      // nodeClicked.children=children
      nodeClicked.status='pendingDelete'

      this.rebuildTreeForData(changedData);
    } else if(button === 'restore') {
      // Revert delete decision - restore the node and its descendants
      this.restoreChildren(nodeClicked.children, changedData);
      
      // If node exists (id >= 0) and has original state, revert to original state
      // This overrides any modifications that were made before deletion
      if (nodeClicked.id >= 0 && this.originalNodeStates.has(nodeClicked.id)) {
        // Restore to original state, overriding any modifications
        this.revertNodeToOriginal(changedData, nodeClicked);
      } else {
        // New node (id < 0) - just restore status
        nodeClicked.status = 'pendingCreation';
      }
      
      // Restore ancestors only (parents, grandparents, etc.) - not siblings
      this.restoreAncestors(changedData, nodeClicked);
      
      this.rebuildTreeForData(changedData);
    } else if(button === 'revert') {
      // Revert Modified node to its original state
      this.revertNodeToOriginal(changedData, nodeClicked);
      this.rebuildTreeForData(changedData);
      
      // If this node is currently selected (form is visible), emit it to update the form
      if (this.selectedNodeId === id) {
        const nodeParent = nodeClicked.parent ?
          this.findNodeSiblings(changedData, nodeClicked.parent).find(node => node.id === nodeClicked.parent) : null;
        const emitedObj = {
          nodeClicked,
          nodeParent,
        };
        this.emitNode.emit(emitedObj);
      }
    } else if(button === 'remove') {
      // Remove pendingCreation node (unsaved new node) from tree
      this.removePendingCreationNode(changedData, nodeClicked);
      this.rebuildTreeForData(changedData);
    }

  }

  emitAllRows(event)
  {
    const dataToEmit = JSON.parse(JSON.stringify(this.dataSource.data))
    const allRows = this.getAllChildren(dataToEmit);
    this.emitAllNodes.emit({event:event, data: allRows});
  }

  getAllChildren(arr)
  {
    const result = [];
    let subResult;
    arr.forEach((item, i) => {
      if (item.children && item.children.length>0) {
        subResult = this.getAllChildren(item.children);
        if (subResult) result.push(...subResult);
      }
      result.push(item);

    });
    return result;
  }

  deleteChildren(arr)
  {
    arr.forEach((item, i) => {
      if (item.children && item.children.length>0) {
        this.deleteChildren(item.children);
      }
      item.status='pendingDelete'

    });
  }

  restoreChildren(arr, changedData?: any)
  {
    arr.forEach((item, i) => {
      if (item.children && item.children.length>0) {
        this.restoreChildren(item.children, changedData);
      }
      
      // If node exists (id >= 0) and has original state, revert to original state
      // This overrides any modifications that were made before deletion
      if (item.id >= 0 && changedData && this.originalNodeStates.has(item.id)) {
        this.revertNodeToOriginal(changedData, item);
      } else {
        // New node (id < 0) - just restore status
        item.status = item.id < 0 ? 'pendingCreation' : 'Modified';
      }
    });
  }

  /**
   * Restore ancestors (parents, grandparents, etc.) recursively
   * Only restores the ancestor nodes themselves, not their other children (siblings)
   * If ancestor has original state, restores to original state (overriding modifications)
   */
  restoreAncestors(changedData: any, node: any) {
    if (!node || node.parent === null || node.parent === undefined) {
      return; // No parent, stop recursion
    }
    
    const parentNode = this.findNodeSiblings(changedData, node.parent).find(n => n.id === node.parent);
    if (parentNode && parentNode.status === 'pendingDelete') {
      // If parent exists (id >= 0) and has original state, revert to original state
      // This overrides any modifications that were made before deletion
      if (parentNode.id >= 0 && this.originalNodeStates.has(parentNode.id)) {
        this.revertNodeToOriginal(changedData, parentNode);
      } else {
        // New node (id < 0) - just restore status
        parentNode.status = parentNode.id < 0 ? 'pendingCreation' : 'Modified';
      }
      
      // Recursively restore the parent's ancestors
      this.restoreAncestors(changedData, parentNode);
    }
  }

  /**
   * Revert a Modified node to its original state
   */
  revertNodeToOriginal(changedData: any, node: any) {
    if (!node || !node.id) {
      return;
    }
    
    const originalState = this.originalNodeStates.get(node.id);
    if (originalState) {
      // Restore original properties, but preserve children and tree structure
      const children = node.children || [];
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
      if (children && children.length > 0) {
        children.forEach((child: any) => {
          if (child.status === 'Modified') {
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
  removePendingCreationNode(changedData: any, node: any) {
    if (!node || node.status !== 'pendingCreation') {
      return;
    }
    
    // Remove all children first (recursively)
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) => {
        if (child.status === 'pendingCreation') {
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
      const siblings = this.findNodeSiblings(changedData, node.parent);
      const parentNode = siblings.find(n => n.id === node.parent);
      if (parentNode && parentNode.children) {
        const index = parentNode.children.findIndex((child: any) => child.id === node.id);
        if (index !== -1) {
          parentNode.children.splice(index, 1);
        }
      }
    } else {
      // Root level - remove from root's children
      if (changedData && changedData.length > 0 && changedData[0].children) {
        const index = changedData[0].children.findIndex((child: any) => child.id === node.id);
        if (index !== -1) {
          changedData[0].children.splice(index, 1);
        }
      }
    }
    
    // Remove from original states map if stored
    if (node.id && this.originalNodeStates.has(node.id)) {
      this.originalNodeStates.delete(node.id);
    }
  }

  createRootFolder()
  {
    const rootNode = {
      id: null,
      name: '',
      isFolder: true,
      parent: null
    };
    this.createFolder.emit(rootNode);
  }

  getNodeDisplay(node: any): string {
    // Hide root node (has isRoot property or empty name with null id)
    // Use visibility hidden instead of display none to preserve tree structure
    const nestedNode = this.flatNodeMap.get(node);
    if (nestedNode && (nestedNode.isRoot === true || (nestedNode.name === '' && nestedNode.id === null))) {
      return 'none';
    }
    return 'flex';
  }

  isRootNode(node: any): boolean {
    const nestedNode = this.flatNodeMap.get(node);
    return nestedNode && ((nestedNode as any).isRoot === true || (nestedNode.name === '' && nestedNode.id === null));
  }

  isRootChild(node: any): boolean {
    // Check if this node is a direct child of the root (level 1)
    return node && node.level === 1;
  }

  isRootDescendant(node: any): boolean {
    // Check if this node is any descendant of the root (level >= 1)
    // Since root is at level 0 and hidden, all nodes with level >= 1 should be shifted left
    return node && node.level >= 1;
  }

  /**
   * Calculate adjusted padding for root descendants
   * Formula: 13px base + ~22px per level (13, 35, 58, 80...)
   * Pattern matches the relationship 13-35-58
   */
  /**
   * Checks if a node or any of its ancestors are inactive
   * @param node The flat node to check
   * @returns true if the node or any ancestor is inactive
   */
  isNodeOrAncestorInactive(node: FileFlatNode): boolean {
    if (!node) {
      return false;
    }
    const nestedNode = this.flatNodeMap.get(node);
    if (!nestedNode) {
      return false;
    }
    // Check if current node is inactive
    if (nestedNode.active === false) {
      return true;
    }
    // If node has a parent, check parent recursively
    if (nestedNode.parent !== null && nestedNode.parent !== undefined) {
      const parentNode = this.findNodeById(nestedNode.parent);
      if (parentNode) {
        const parentFlatNode = this.nestedNodeMap.get(parentNode);
        if (parentFlatNode) {
          return this.isNodeOrAncestorInactive(parentFlatNode);
        }
      }
    }
    return false;
  }

  /**
   * Finds a nested node by its ID in the tree data
   * @param id The node ID to find
   * @returns The found FileNode or null
   */
  private findNodeById(id: string | number): FileNode | null {
    if (!this.dataSource.data || this.dataSource.data.length === 0) {
      return null;
    }
    const searchInNodes = (nodes: FileNode[]): FileNode | null => {
      for (const node of nodes) {
        if (String(node.id) === String(id)) {
          return node;
        }
        if (node.children && node.children.length > 0) {
          const found = searchInNodes(node.children);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };
    return searchInNodes(this.dataSource.data);
  }

  getAdjustedPadding(node: any): string | null {
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
    const level = node.level;
    if (level === 1) return '13px'; // First visible
    if (level === 2) return '35px'; // Second visible
    if (level === 3) return '58px'; // Third visible
    // For levels beyond 3, use 22px increment
    return `${58 + (level - 3) * 22}px`;
  }

  collapseToFirstLevel(): void {
    // Collapse all nodes first
    this.treeControl.collapseAll();
    
    // Then expand only first level nodes (level 1) - direct children of root
    this.treeControl.dataNodes.forEach(node => {
      if (node.level === 1 && node.expandable) {
        this.treeControl.expand(node);
        this.expansionModel.select(node.id);
      }
    });
  }

}


