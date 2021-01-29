import { FlatTreeControl } from '@angular/cdk/tree';
import { EventEmitter, ElementRef } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import * as i0 from "@angular/core";
/**
 * File node data with nested structure.
 * Each node has a name, and a type or a list of children.
 */
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
}
/** Flat node with expandable and level information */
export declare class FileFlatNode {
    expandable: boolean;
    name: string;
    level: number;
    type: any;
    id: string;
    constructor(expandable: boolean, name: string, level: number, type: any, id: string);
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
    initialize(dataObj: any): void;
    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `FileNode`.
     */
    buildFileTree(arrayTreeNodes: any[], level: number, parentId?: string): any;
    deleteItem(node: FileNode): void;
    deleteNode(nodes: FileNode[], nodeToDelete: FileNode): void;
    copyPasteItem(from: FileNode, to: FileNode): FileNode;
    copyPasteItemAbove(from: FileNode, to: FileNode): FileNode;
    copyPasteItemBelow(from: FileNode, to: FileNode): FileNode;
    /** Add an item to to-do list */
    insertItem(parent: FileNode, node: FileNode): FileNode;
    insertItemAbove(node: FileNode, nodeDrag: FileNode): FileNode;
    insertItemBelow(node: FileNode, nodeDrag: FileNode): FileNode;
    getParentFromNodes(node: FileNode): FileNode;
    getParent(currentRoot: FileNode, node: FileNode): FileNode;
    static ɵfac: i0.ɵɵFactoryDef<FileDatabase, never>;
    static ɵprov: i0.ɵɵInjectableDef<FileDatabase>;
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
    private _eventNodeUpdatedSubscription;
    private _eventCreateNodeSubscription;
    private _eventGetAllRowsSubscription;
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
    rebuildTreeForData(data: any): void;
    /**
     * Not used but you might need this to programmatically expand nodes
     * to reveal a particular node
     */
    private expandNodesById;
    private getParentNode;
    updateNode(nodeUpdated: any): void;
    createNewFolder(newFolder: any): void;
    createNewNode(newNode: any): void;
    onButtonClicked(id: any, button: string): void;
    emitAllRows(): void;
    getAllChildren(arr: any): any[];
    static ɵfac: i0.ɵɵFactoryDef<DataTreeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<DataTreeComponent, "app-data-tree", never, { "eventNodeUpdatedSubscription": "eventNodeUpdatedSubscription"; "eventCreateNodeSubscription": "eventCreateNodeSubscription"; "eventGetAllRowsSubscription": "eventGetAllRowsSubscription"; "getAll": "getAll"; }, { "createNode": "createNode"; "createFolder": "createFolder"; "emitNode": "emitNode"; "emitAllNodes": "emitAllNodes"; }, never, never>;
}
