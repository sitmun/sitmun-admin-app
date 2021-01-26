import { FlatTreeControl } from '@angular/cdk/tree';
import { EventEmitter } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
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
    get data(): FileNode[];
    constructor();
    initialize(dataObj: any): void;
    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `FileNode`.
     */
    buildFileTree(arrayTreeNodes: any[], level: number, parentId?: string): FileNode[];
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
    /**
     * Handle the drop - here we rearrange the data based on the drop event,
     * then rebuild the tree.
     * */
    drop(event: CdkDragDrop<string[]>): void;
    /**
     * Experimental - opening tree nodes as you drag over them
     */
    dragStart(): void;
    dragEnd(): void;
    dragHover(node: FileFlatNode): void;
    dragHoverEnd(): void;
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
    getChildren(arr: any): any[];
    static ɵfac: i0.ɵɵFactoryDef<DataTreeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<DataTreeComponent, "app-data-tree", never, { "eventNodeUpdatedSubscription": "eventNodeUpdatedSubscription"; "eventCreateNodeSubscription": "eventCreateNodeSubscription"; "eventGetAllRowsSubscription": "eventGetAllRowsSubscription"; "getAll": "getAll"; }, { "createNode": "createNode"; "createFolder": "createFolder"; "emitNode": "emitNode"; "emitAllNodes": "emitAllNodes"; }, never, never>;
}
