import { FlatTreeControl } from '@angular/cdk/tree';
import { EventEmitter, ElementRef } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
/**
 * File node data with nested structure.
 * Each node has a name, and a type or a list of children.
 */
import * as ɵngcc0 from '@angular/core';
export declare class FileNode {
    id: string;
    children: FileNode[];
    name: string;
    type: any;
    active: any;
    cartographyId: any;
    cartographyName: any;
    datasetURL: any;
    description: any;
    filterGetFeatureInfo: any;
    filterGetMap: any;
    filterSelectable: any;
    isFolder: any;
    metadataURL: any;
    order: any;
    parent: any;
    queryableActive: any;
    radio: any;
    tooltip: any;
    _links: any;
    status: any;
}
/** Flat node with expandable and level information */
export declare class FileFlatNode {
    expandable: boolean;
    name: string;
    level: number;
    type: any;
    id: string;
    status: string;
    constructor(expandable: boolean, name: string, level: number, type: any, id: string, status: string);
}
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has name and type.
 * For a directory, it has name and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
export declare class FileDatabase {
    dataChange: BehaviorSubject<FileNode[]>;
    get data(): any;
    constructor();
    initialize(dataObj: any, allNewElements: any): void;
    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `FileNode`.
     */
    buildFileTree(arrayTreeNodes: any[], level: number, allNewElements: any): any;
    deleteItem(node: FileNode, changedData: any): void;
    deleteNode(nodes: FileNode[], nodeToDelete: FileNode): void;
    setOrder(data: any[]): any[];
    copyPasteItem(from: FileNode, to: FileNode, changedData: any): FileNode;
    copyPasteItemAbove(from: FileNode, to: FileNode, changedData: any): FileNode;
    copyPasteItemBelow(from: FileNode, to: FileNode, changedData: any): FileNode;
    /** Add an item to to-do list */
    getNewItem(node: FileNode): FileNode;
    insertItem(parent: FileNode, node: FileNode, changedData: any): FileNode;
    insertItemAbove(node: FileNode, nodeDrag: FileNode, changedData: any): FileNode;
    insertItemBelow(node: FileNode, nodeDrag: FileNode, changedData: any): FileNode;
    getParentFromNodes(node: FileNode, changedData: any): FileNode;
    getParent(currentRoot: FileNode, node: FileNode): FileNode;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<FileDatabase, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<FileDatabase>;
}
/**
 * @title Tree with flat nodes
 */
export declare class DataTreeComponent {
    database: FileDatabase;
    createNode: EventEmitter<any>;
    createFolder: EventEmitter<any>;
    emitNode: EventEmitter<any>;
    emitAllNodes: EventEmitter<any>;
    eventNodeUpdatedSubscription: Observable<any>;
    eventCreateNodeSubscription: Observable<any>;
    eventGetAllRowsSubscription: Observable<any>;
    eventRefreshSubscription: Observable<any>;
    private _eventNodeUpdatedSubscription;
    private _eventCreateNodeSubscription;
    private _eventGetAllRowsSubscription;
    private _eventRefreshSubscription;
    treeControl: FlatTreeControl<FileFlatNode>;
    treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
    dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
    expansionModel: SelectionModel<string>;
    dragging: boolean;
    expandTimeout: any;
    expandDelay: number;
    validateDrop: boolean;
    treeData: any;
    getAll: () => Observable<any>;
    allNewElements: any;
    dragNode: any;
    dragNodeExpandOverWaitTimeMs: number;
    dragNodeExpandOverNode: any;
    dragNodeExpandOverTime: number;
    dragNodeExpandOverArea: string;
    emptyItem: ElementRef;
    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap: Map<FileFlatNode, FileNode>;
    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap: Map<FileNode, FileFlatNode>;
    constructor(database: FileDatabase);
    ngOnInit(): void;
    getElements(): void;
    transformer: (node: FileNode, level: number) => FileFlatNode;
    private _getLevel;
    private _isExpandable;
    private _getChildren;
    hasChild: (_: number, _nodeData: FileFlatNode) => boolean;
    /**
     * This constructs an array of nodes that matches the DOM
     */
    visibleNodes(): FileNode[];
    findNodeSiblings(arr: Array<any>, id: string): Array<any>;
    handleDragStart(event: any, node: any): void;
    handleDragOver(event: any, node: any): void;
    handleDrop(event: any, node: any): void;
    handleDragEnd(event: any): void;
    /**
     * The following methods are for persisting the tree expand state
     * after being rebuilt
     */
    sortByOrder(data: any[]): void;
    setOrder(data: any[]): any[];
    rebuildTreeForData(data: any[]): void;
    private getParentNode;
    updateNode(nodeUpdated: any): void;
    createNewFolder(newFolder: any): void;
    createNewNode(newNode: any): void;
    onButtonClicked(id: any, button: string): void;
    emitAllRows(): void;
    getAllChildren(arr: any): any[];
    deleteChildren(arr: any): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<DataTreeComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<DataTreeComponent, "app-data-tree", never, { "eventNodeUpdatedSubscription": "eventNodeUpdatedSubscription"; "eventCreateNodeSubscription": "eventCreateNodeSubscription"; "eventGetAllRowsSubscription": "eventGetAllRowsSubscription"; "eventRefreshSubscription": "eventRefreshSubscription"; "getAll": "getAll"; "allNewElements": "allNewElements"; }, { "emitNode": "emitNode"; "createNode": "createNode"; "createFolder": "createFolder"; "emitAllNodes": "emitAllNodes"; }, never, never>;
}

//# sourceMappingURL=data-tree.component.d.ts.map