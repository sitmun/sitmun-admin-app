import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Injectable, Input, Output, ElementRef, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/tree";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/material/icon";
const _c0 = ["emptyItem"];
function DataTreeComponent_mat_tree_node_1_mat_icon_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-icon", 9);
    i0.ɵɵtext(1, " folder ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const node_r3 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵattribute("aria-label", node_r3.type + "icon");
} }
function DataTreeComponent_mat_tree_node_1_button_4_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 8);
    i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_button_4_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r10); const node_r3 = i0.ɵɵnextContext().$implicit; const ctx_r8 = i0.ɵɵnextContext(); return ctx_r8.onButtonClicked(node_r3.id, "newFolder"); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "create_new_folder");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_1_button_5_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 8);
    i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_button_5_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r13); const node_r3 = i0.ɵɵnextContext().$implicit; const ctx_r11 = i0.ɵɵnextContext(); return ctx_r11.onButtonClicked(node_r3.id, "newNode"); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "playlist_add");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} }
const _c1 = function (a0, a1, a2) { return { "drop-above": a0, "drop-below": a1, "drop-center": a2 }; };
function DataTreeComponent_mat_tree_node_1_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-tree-node", 4);
    i0.ɵɵlistener("dragstart", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_dragstart_0_listener($event) { i0.ɵɵrestoreView(_r15); const node_r3 = ctx.$implicit; const ctx_r14 = i0.ɵɵnextContext(); return ctx_r14.handleDragStart($event, node_r3); })("dragover", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_dragover_0_listener($event) { i0.ɵɵrestoreView(_r15); const node_r3 = ctx.$implicit; const ctx_r16 = i0.ɵɵnextContext(); return ctx_r16.handleDragOver($event, node_r3); })("drop", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_drop_0_listener($event) { i0.ɵɵrestoreView(_r15); const node_r3 = ctx.$implicit; const ctx_r17 = i0.ɵɵnextContext(); return ctx_r17.handleDrop($event, node_r3); })("dragend", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_dragend_0_listener($event) { i0.ɵɵrestoreView(_r15); const ctx_r18 = i0.ɵɵnextContext(); return ctx_r18.handleDragEnd($event); });
    i0.ɵɵelement(1, "button", 5);
    i0.ɵɵtemplate(2, DataTreeComponent_mat_tree_node_1_mat_icon_2_Template, 2, 1, "mat-icon", 6);
    i0.ɵɵtext(3);
    i0.ɵɵtemplate(4, DataTreeComponent_mat_tree_node_1_button_4_Template, 3, 0, "button", 7);
    i0.ɵɵtemplate(5, DataTreeComponent_mat_tree_node_1_button_5_Template, 3, 0, "button", 7);
    i0.ɵɵelementStart(6, "button", 8);
    i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r15); const node_r3 = ctx.$implicit; const ctx_r19 = i0.ɵɵnextContext(); return ctx_r19.onButtonClicked(node_r3.id, "delete"); });
    i0.ɵɵelementStart(7, "mat-icon");
    i0.ɵɵtext(8, "delete");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "button", 8);
    i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r15); const node_r3 = ctx.$implicit; const ctx_r20 = i0.ɵɵnextContext(); return ctx_r20.onButtonClicked(node_r3.id, "edit"); });
    i0.ɵɵelementStart(10, "mat-icon");
    i0.ɵɵtext(11, "edit");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const node_r3 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction3(5, _c1, ctx_r0.dragNodeExpandOverArea === "above" && ctx_r0.dragNodeExpandOverNode === node_r3, ctx_r0.dragNodeExpandOverArea === "below" && ctx_r0.dragNodeExpandOverNode === node_r3, ctx_r0.dragNodeExpandOverArea === "center" && ctx_r0.dragNodeExpandOverNode === node_r3));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", node_r3.type === "folder");
    i0.ɵɵadvance(1);
    i0.ɵɵtextInterpolate1(" ", node_r3.name, " ");
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", node_r3.type === "folder");
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", node_r3.type === "folder");
} }
function DataTreeComponent_mat_tree_node_2_button_7_Template(rf, ctx) { if (rf & 1) {
    const _r26 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 8);
    i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_button_7_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r26); const node_r21 = i0.ɵɵnextContext().$implicit; const ctx_r24 = i0.ɵɵnextContext(); return ctx_r24.onButtonClicked(node_r21.id, "newFolder"); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "create_new_folder");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_2_button_8_Template(rf, ctx) { if (rf & 1) {
    const _r29 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 8);
    i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_button_8_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r29); const node_r21 = i0.ɵɵnextContext().$implicit; const ctx_r27 = i0.ɵɵnextContext(); return ctx_r27.onButtonClicked(node_r21.id, "newNode"); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "playlist_add");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_2_Template(rf, ctx) { if (rf & 1) {
    const _r31 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-tree-node", 10);
    i0.ɵɵlistener("dragstart", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_dragstart_0_listener($event) { i0.ɵɵrestoreView(_r31); const node_r21 = ctx.$implicit; const ctx_r30 = i0.ɵɵnextContext(); return ctx_r30.handleDragStart($event, node_r21); })("dragover", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_dragover_0_listener($event) { i0.ɵɵrestoreView(_r31); const node_r21 = ctx.$implicit; const ctx_r32 = i0.ɵɵnextContext(); return ctx_r32.handleDragOver($event, node_r21); })("drop", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_drop_0_listener($event) { i0.ɵɵrestoreView(_r31); const node_r21 = ctx.$implicit; const ctx_r33 = i0.ɵɵnextContext(); return ctx_r33.handleDrop($event, node_r21); })("dragend", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_dragend_0_listener($event) { i0.ɵɵrestoreView(_r31); const ctx_r34 = i0.ɵɵnextContext(); return ctx_r34.handleDragEnd($event); });
    i0.ɵɵelementStart(1, "button", 11);
    i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r31); const node_r21 = ctx.$implicit; const ctx_r35 = i0.ɵɵnextContext(); return ctx_r35.expansionModel.toggle(node_r21.id); });
    i0.ɵɵelementStart(2, "mat-icon", 12);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "mat-icon", 9);
    i0.ɵɵtext(5, " folder ");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(6);
    i0.ɵɵtemplate(7, DataTreeComponent_mat_tree_node_2_button_7_Template, 3, 0, "button", 7);
    i0.ɵɵtemplate(8, DataTreeComponent_mat_tree_node_2_button_8_Template, 3, 0, "button", 7);
    i0.ɵɵelementStart(9, "button", 8);
    i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r31); const node_r21 = ctx.$implicit; const ctx_r36 = i0.ɵɵnextContext(); return ctx_r36.onButtonClicked(node_r21.id, "delete"); });
    i0.ɵɵelementStart(10, "mat-icon");
    i0.ɵɵtext(11, "delete");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "button", 8);
    i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r31); const node_r21 = ctx.$implicit; const ctx_r37 = i0.ɵɵnextContext(); return ctx_r37.onButtonClicked(node_r21.id, "edit"); });
    i0.ɵɵelementStart(13, "mat-icon");
    i0.ɵɵtext(14, "edit");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const node_r21 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction3(7, _c1, ctx_r1.dragNodeExpandOverArea === "above" && ctx_r1.dragNodeExpandOverNode === node_r21, ctx_r1.dragNodeExpandOverArea === "below" && ctx_r1.dragNodeExpandOverNode === node_r21, ctx_r1.dragNodeExpandOverArea === "center" && ctx_r1.dragNodeExpandOverNode === node_r21));
    i0.ɵɵadvance(1);
    i0.ɵɵattribute("aria-label", "toggle " + node_r21.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.treeControl.isExpanded(node_r21) ? "expand_more" : "chevron_right", " ");
    i0.ɵɵadvance(1);
    i0.ɵɵattribute("aria-label", node_r21.type + "icon");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", node_r21.name, " ");
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", node_r21.type === "folder");
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", node_r21.type === "folder");
} }
/**
 * File node data with nested structure.
 * Each node has a name, and a type or a list of children.
 */
export class FileNode {
}
/** Flat node with expandable and level information */
export class FileFlatNode {
    constructor(expandable, name, level, type, id) {
        this.expandable = expandable;
        this.name = name;
        this.level = level;
        this.type = type;
        this.id = id;
    }
}
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has name and type.
 * For a directory, it has name and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
export class FileDatabase {
    constructor() {
        this.dataChange = new BehaviorSubject([]);
    }
    get data() { return this.dataChange.value; }
    initialize(dataObj) {
        // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
        //     file node as children.
        const data = this.buildFileTree(dataObj, 0);
        // Notify the change.
        this.dataChange.next(data);
    }
    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `FileNode`.
     */
    buildFileTree(arrayTreeNodes, level, parentId = '0') {
        var map = {};
        arrayTreeNodes.forEach((treeNode) => {
            var obj = treeNode;
            obj.children = [];
            obj.type = (treeNode.isFolder) ? "folder" : "node";
            if (!map[obj.id]) {
                map[obj.id] = obj;
            }
            else {
                let previousChildren = map[obj.id].children;
                map[obj.id] = obj;
                map[obj.id].children = previousChildren;
            }
            var parent = obj.parent || 'root';
            if (!map[parent]) {
                map[parent] = {
                    children: []
                };
            }
            map[parent].children.push(obj);
        });
        map['root'].type = 'folder';
        map['root'].name = 'Root';
        map['root'].isFolder = true;
        return map['root'];
    }
    deleteItem(node) {
        this.deleteNode(this.data.children, node);
        this.dataChange.next(this.data);
    }
    deleteNode(nodes, nodeToDelete) {
        const index = nodes.indexOf(nodeToDelete, 0);
        if (index > -1) {
            nodes.splice(index, 1);
        }
        else {
            nodes.forEach(node => {
                if (node.children && node.children.length > 0) {
                    this.deleteNode(node.children, nodeToDelete);
                }
            });
        }
    }
    copyPasteItem(from, to) {
        const newItem = this.insertItem(to, from);
        return newItem;
    }
    copyPasteItemAbove(from, to) {
        const newItem = this.insertItemAbove(to, from);
        return newItem;
    }
    copyPasteItemBelow(from, to) {
        const newItem = this.insertItemBelow(to, from);
        return newItem;
    }
    /** Add an item to to-do list */
    insertItem(parent, node) {
        if (!parent.children) {
            parent.children = [];
        }
        const newItem = {
            name: node.name,
            children: node.children,
            type: node.type,
            id: node.id,
            active: node.active,
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
            parent: parent.id == undefined ? null : parent.id,
            queryableActive: node.queryableActive,
            radio: node.radio,
            tooltip: node.tooltip,
            _links: node._links
        };
        parent.children.push(newItem);
        this.dataChange.next(this.data);
        return newItem;
    }
    insertItemAbove(node, nodeDrag) {
        const parentNode = this.getParentFromNodes(node);
        const newItem = {
            name: nodeDrag.name,
            children: nodeDrag.children,
            type: nodeDrag.type,
            id: nodeDrag.id,
            active: nodeDrag.active,
            cartographyId: nodeDrag.cartographyId,
            cartographyName: nodeDrag.cartographyName,
            datasetURL: nodeDrag.datasetURL,
            description: nodeDrag.description,
            filterGetFeatureInfo: nodeDrag.filterGetFeatureInfo,
            filterGetMap: nodeDrag.filterGetMap,
            filterSelectable: nodeDrag.filterSelectable,
            isFolder: nodeDrag.isFolder,
            metadataURL: nodeDrag.metadataURL,
            order: nodeDrag.order,
            parent: parentNode.id == undefined ? null : parentNode.id,
            queryableActive: nodeDrag.queryableActive,
            radio: nodeDrag.radio,
            tooltip: nodeDrag.tooltip,
            _links: nodeDrag._links
        };
        if (parentNode != null) {
            parentNode.children.splice(parentNode.children.indexOf(node), 0, newItem);
        }
        else {
            this.data.children.splice(this.data.children.indexOf(node), 0, newItem);
        }
        this.dataChange.next(this.data);
        return newItem;
    }
    insertItemBelow(node, nodeDrag) {
        const parentNode = this.getParentFromNodes(node);
        const newItem = {
            name: nodeDrag.name,
            children: nodeDrag.children,
            type: nodeDrag.type,
            id: nodeDrag.id,
            active: nodeDrag.active,
            cartographyId: nodeDrag.cartographyId,
            cartographyName: nodeDrag.cartographyName,
            datasetURL: nodeDrag.datasetURL,
            description: nodeDrag.description,
            filterGetFeatureInfo: nodeDrag.filterGetFeatureInfo,
            filterGetMap: nodeDrag.filterGetMap,
            filterSelectable: nodeDrag.filterSelectable,
            isFolder: nodeDrag.isFolder,
            metadataURL: nodeDrag.metadataURL,
            order: nodeDrag.order,
            parent: parentNode.id == undefined ? null : parentNode.id,
            queryableActive: nodeDrag.queryableActive,
            radio: nodeDrag.radio,
            tooltip: nodeDrag.tooltip,
            _links: nodeDrag._links
        };
        if (parentNode != null) {
            parentNode.children.splice(parentNode.children.indexOf(node) + 1, 0, newItem);
        }
        else {
            this.data.children.splice(this.data.children.indexOf(node) + 1, 0, newItem);
        }
        this.dataChange.next(this.data);
        return newItem;
    }
    getParentFromNodes(node) {
        for (let i = 0; i < this.data.children.length; ++i) {
            const currentRoot = this.data.children[i];
            const parent = this.getParent(currentRoot, node);
            if (parent != null) {
                return parent;
            }
        }
        return null;
    }
    getParent(currentRoot, node) {
        if (currentRoot.children && currentRoot.children.length > 0) {
            for (let i = 0; i < currentRoot.children.length; ++i) {
                const child = currentRoot.children[i];
                if (child === node) {
                    return currentRoot;
                }
                else if (child.children && child.children.length > 0) {
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
/** @nocollapse */ FileDatabase.ɵfac = function FileDatabase_Factory(t) { return new (t || FileDatabase)(); };
/** @nocollapse */ FileDatabase.ɵprov = i0.ɵɵdefineInjectable({ token: FileDatabase, factory: FileDatabase.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(FileDatabase, [{
        type: Injectable
    }], function () { return []; }, null); })();
/**
 * @title Tree with flat nodes
 */
export class DataTreeComponent {
    constructor(database) {
        this.database = database;
        // expansion model tracks expansion state
        this.expansionModel = new SelectionModel(true);
        this.dragging = false;
        this.expandDelay = 1000;
        this.validateDrop = false;
        this.dragNodeExpandOverWaitTimeMs = 1500;
        /** Map from flat node to nested node. This helps us finding the nested node to be modified */
        this.flatNodeMap = new Map();
        /** Map from nested node to flattened node. This helps us to keep the same object for selection */
        this.nestedNodeMap = new Map();
        this.transformer = (node, level) => {
            const existingNode = this.nestedNodeMap.get(node);
            const flatNode = existingNode && existingNode.name === node.name
                ? existingNode
                : new FileFlatNode((node.children && node.children.length > 0), node.name, level, node.type, node.id);
            this.flatNodeMap.set(flatNode, node);
            this.nestedNodeMap.set(node, flatNode);
            return flatNode;
        };
        this._getLevel = (node) => node.level;
        this._isExpandable = (node) => node.expandable;
        this._getChildren = (node) => observableOf(node.children);
        this.hasChild = (_, _nodeData) => _nodeData.expandable;
        this.emitNode = new EventEmitter();
        this.createNode = new EventEmitter();
        this.createFolder = new EventEmitter();
        this.emitAllNodes = new EventEmitter();
        this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel, this._isExpandable, this._getChildren);
        this.treeControl = new FlatTreeControl(this._getLevel, this._isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    }
    ngOnInit() {
        if (this.eventNodeUpdatedSubscription) {
            this.eventNodeUpdatedSubscription.subscribe((node) => {
                this.updateNode(node);
            });
        }
        if (this.eventCreateNodeSubscription) {
            this.eventCreateNodeSubscription.subscribe((node) => {
                if (node.isFolder)
                    this.createNewFolder(node);
                else
                    this.createNewNode(node);
            });
        }
        if (this.eventGetAllRowsSubscription) {
            this._eventGetAllRowsSubscription = this.eventGetAllRowsSubscription.subscribe(() => {
                this.emitAllRows();
            });
        }
        this.getAll()
            .subscribe((items) => {
            this.treeData = items;
            this.database.initialize(this.treeData);
            this.database.dataChange.subscribe(data => this.rebuildTreeForData([data]));
        });
    }
    /**
     * This constructs an array of nodes that matches the DOM
     */
    visibleNodes() {
        const result = [];
        function addExpandedChildren(node, expanded) {
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
    findNodeSiblings(arr, id) {
        let result, subResult;
        arr.forEach((item, i) => {
            if (item.id === id) {
                result = arr;
            }
            else if (item.children) {
                subResult = this.findNodeSiblings(item.children, id);
                if (subResult)
                    result = subResult;
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
        }
        else {
            this.dragNodeExpandOverNode = node;
            this.dragNodeExpandOverTime = new Date().getTime();
        }
        // Handle drag area
        const percentageX = event.offsetX / event.target.clientWidth;
        const percentageY = event.offsetY / event.target.clientHeight;
        if (percentageY < 0.25) {
            this.dragNodeExpandOverArea = 'above';
        }
        else if (percentageY > 0.75) {
            this.dragNodeExpandOverArea = 'below';
        }
        else {
            this.dragNodeExpandOverArea = 'center';
        }
    }
    handleDrop(event, node) {
        event.preventDefault();
        if (node !== this.dragNode) {
            let newItem;
            if (this.dragNodeExpandOverArea === 'above') {
                newItem = this.database.copyPasteItemAbove(this.flatNodeMap.get(this.dragNode), this.flatNodeMap.get(node));
            }
            else if (this.dragNodeExpandOverArea === 'below') {
                newItem = this.database.copyPasteItemBelow(this.flatNodeMap.get(this.dragNode), this.flatNodeMap.get(node));
            }
            else {
                newItem = this.database.copyPasteItem(this.flatNodeMap.get(this.dragNode), this.flatNodeMap.get(node));
            }
            this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
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
    rebuildTreeForData(data) {
        this.dataSource.data = data;
        this.expansionModel.selected.forEach((id) => {
            const node = this.treeControl.dataNodes.find((n) => n.id === id);
            this.treeControl.expand(node);
        });
    }
    /**
     * Not used but you might need this to programmatically expand nodes
     * to reveal a particular node
     */
    expandNodesById(flatNodes, ids) {
        if (!flatNodes || flatNodes.length === 0)
            return;
        const idSet = new Set(ids);
        return flatNodes.forEach((node) => {
            if (idSet.has(node.id)) {
                this.treeControl.expand(node);
                let parent = this.getParentNode(node);
                while (parent) {
                    this.treeControl.expand(parent);
                    parent = this.getParentNode(parent);
                }
            }
        });
    }
    getParentNode(node) {
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
    updateNode(nodeUpdated) {
        const dataToChange = JSON.parse(JSON.stringify(this.dataSource.data));
        const siblings = this.findNodeSiblings(dataToChange, nodeUpdated.id);
        let index = siblings.findIndex(node => node.id === nodeUpdated.id);
        siblings[index] = nodeUpdated;
        this.rebuildTreeForData(dataToChange);
    }
    createNewFolder(newFolder) {
        newFolder.type = "folder";
        const dataToChange = JSON.parse(JSON.stringify(this.dataSource.data));
        if (newFolder.parent === null) {
            dataToChange.push(newFolder);
        }
        else {
            const siblings = this.findNodeSiblings(dataToChange, newFolder.parent);
            let index = siblings.findIndex(node => node.id === newFolder.parent);
            siblings[index].children.push(newFolder);
        }
        this.rebuildTreeForData(dataToChange);
    }
    createNewNode(newNode) {
        newNode.type = "node";
        const dataToChange = JSON.parse(JSON.stringify(this.dataSource.data));
        const siblings = this.findNodeSiblings(dataToChange, newNode.parent);
        let index = siblings.findIndex(node => node.id === newNode.parent);
        siblings[index].children.push(newNode);
        this.rebuildTreeForData(dataToChange);
    }
    onButtonClicked(id, button) {
        const changedData = JSON.parse(JSON.stringify(this.dataSource.data));
        const siblings = this.findNodeSiblings(changedData, id);
        let nodeClicked = siblings.find(node => node.id === id);
        if (button === 'edit') {
            this.emitNode.emit(nodeClicked);
        }
        else if (button === 'newFolder') {
            this.createFolder.emit(nodeClicked);
        }
        else if (button === 'newNode') {
            this.createNode.emit(nodeClicked);
        }
        else if (button === 'delete') {
            let children = this.getAllChildren(nodeClicked.children);
            children.forEach(children => {
                children.status = 'Deleted';
            });
            nodeClicked.children = children;
            nodeClicked.status = 'Deleted';
            this.rebuildTreeForData(changedData);
        }
    }
    emitAllRows() {
        const dataToEmit = JSON.parse(JSON.stringify(this.dataSource.data));
        let allRows = this.getAllChildren(dataToEmit);
        this.emitAllNodes.emit(allRows);
    }
    getAllChildren(arr) {
        let result = [];
        let subResult;
        arr.forEach((item, i) => {
            if (item.children.length > 0) {
                subResult = this.getAllChildren(item.children);
                if (subResult)
                    result.push(...subResult);
            }
            result.push(item);
        });
        return result;
    }
}
/** @nocollapse */ DataTreeComponent.ɵfac = function DataTreeComponent_Factory(t) { return new (t || DataTreeComponent)(i0.ɵɵdirectiveInject(FileDatabase)); };
/** @nocollapse */ DataTreeComponent.ɵcmp = i0.ɵɵdefineComponent({ type: DataTreeComponent, selectors: [["app-data-tree"]], viewQuery: function DataTreeComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, true);
    } if (rf & 2) {
        var _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.emptyItem = _t.first);
    } }, inputs: { eventNodeUpdatedSubscription: "eventNodeUpdatedSubscription", eventCreateNodeSubscription: "eventCreateNodeSubscription", eventGetAllRowsSubscription: "eventGetAllRowsSubscription", getAll: "getAll" }, outputs: { createNode: "createNode", createFolder: "createFolder", emitNode: "emitNode", emitAllNodes: "emitAllNodes" }, features: [i0.ɵɵProvidersFeature([FileDatabase])], decls: 5, vars: 3, consts: [[3, "dataSource", "treeControl"], ["matTreeNodeToggle", "", "matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend", 4, "matTreeNodeDef"], ["matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend", 4, "matTreeNodeDef", "matTreeNodeDefWhen"], ["emptyItem", ""], ["matTreeNodeToggle", "", "matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend"], ["mat-icon-button", "", "disabled", ""], ["class", "type-icon", 4, "ngIf"], ["mat-icon-button", "", 3, "click", 4, "ngIf"], ["mat-icon-button", "", 3, "click"], [1, "type-icon"], ["matTreeNodePadding", "", "draggable", "true", 3, "ngClass", "dragstart", "dragover", "drop", "dragend"], ["mat-icon-button", "", "matTreeNodeToggle", "", 3, "click"], [1, "mat-icon-rtl-mirror"]], template: function DataTreeComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "mat-tree", 0);
        i0.ɵɵtemplate(1, DataTreeComponent_mat_tree_node_1_Template, 12, 9, "mat-tree-node", 1);
        i0.ɵɵtemplate(2, DataTreeComponent_mat_tree_node_2_Template, 15, 11, "mat-tree-node", 2);
        i0.ɵɵelementEnd();
        i0.ɵɵelement(3, "span", null, 3);
    } if (rf & 2) {
        i0.ɵɵproperty("dataSource", ctx.dataSource)("treeControl", ctx.treeControl);
        i0.ɵɵadvance(2);
        i0.ɵɵproperty("matTreeNodeDefWhen", ctx.hasChild);
    } }, directives: [i1.MatTree, i1.MatTreeNodeDef, i1.MatTreeNode, i1.MatTreeNodeToggle, i1.MatTreeNodePadding, i2.NgClass, i3.MatButton, i2.NgIf, i4.MatIcon], styles: [".mat-tree-node[_ngcontent-%COMP%]{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;cursor:move;user-select:none}.mat-tree-node.cdk-drag-preview[_ngcontent-%COMP%]{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-tree-node.cdk-drag-placeholder[_ngcontent-%COMP%]{opacity:0}.cdk-drop-list-dragging[_ngcontent-%COMP%]   .mat-tree-node[_ngcontent-%COMP%]:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.cdk-drag-animating[_ngcontent-%COMP%]{transition:transform .2s cubic-bezier(0,0,.2,1)}.drop-above[_ngcontent-%COMP%]{border-top:10px solid #ddd;margin-top:-10px}.drop-below[_ngcontent-%COMP%]{border-bottom:10px solid #ddd;margin-bottom:-10px}.drop-center[_ngcontent-%COMP%]{background-color:#ddd}"] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(DataTreeComponent, [{
        type: Component,
        args: [{
                selector: 'app-data-tree',
                templateUrl: 'data-tree.component.html',
                styleUrls: ['data-tree.component.scss'],
                providers: [FileDatabase]
            }]
    }], function () { return [{ type: FileDatabase }]; }, { createNode: [{
            type: Output
        }], createFolder: [{
            type: Output
        }], emitNode: [{
            type: Output
        }], emitAllNodes: [{
            type: Output
        }], eventNodeUpdatedSubscription: [{
            type: Input
        }], eventCreateNodeSubscription: [{
            type: Input
        }], eventGetAllRowsSubscription: [{
            type: Input
        }], getAll: [{
            type: Input
        }], emptyItem: [{
            type: ViewChild,
            args: ['emptyItem']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS10cmVlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGF0YS10cmVlL2RhdGEtdHJlZS5jb21wb25lbnQudHMiLCJkYXRhLXRyZWUvZGF0YS10cmVlLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pHLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2pGLE9BQU8sRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLEVBQUUsSUFBSSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFdkUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7Ozs7OztJQ0d4RCxtQ0FDQztJQUFBLHdCQUNEO0lBQUEsaUJBQVc7OztJQUYrQyxtREFBc0M7Ozs7SUFJaEcsaUNBQ0M7SUFEcUMsbVFBQWtDLFdBQVcsS0FBRTtJQUNwRixnQ0FBVTtJQUFBLGlDQUFpQjtJQUFBLGlCQUFXO0lBQ3ZDLGlCQUFTOzs7O0lBQ1QsaUNBQ0M7SUFEcUMscVFBQWtDLFNBQVMsS0FBRTtJQUNsRixnQ0FBVTtJQUFBLDRCQUFZO0lBQUEsaUJBQVc7SUFDbEMsaUJBQVM7Ozs7O0lBaEJWLHdDQU1DO0lBTEQsMFFBQTRDLDBQQUFBLDhPQUFBLCtNQUFBO0lBSzNDLDRCQUEwQztJQUMxQyw0RkFDQztJQUVELFlBQ0E7SUFBQSx3RkFDQztJQUVELHdGQUNDO0lBRUQsaUNBQ0M7SUFEdUIsNk9B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QTNEZCwyQ0FBeUIsZ0NBQUE7UUEyQm5CLGVBQXlDO1FBQXpDLGlEQUF5Qzs7a0REMlA1QyxpQkFBaUI7Y0FON0IsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSxlQUFlO2dCQUN6QixXQUFXLEVBQUUsMEJBQTBCO2dCQUN2QyxTQUFTLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQztnQkFDdkMsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDO2FBQzFCO3NDQXlDOEIsWUFBWSxVQXZDL0IsVUFBVTtrQkFBbkIsTUFBTTtZQUNHLFlBQVk7a0JBQXJCLE1BQU07WUFDRyxRQUFRO2tCQUFqQixNQUFNO1lBQ0csWUFBWTtrQkFBckIsTUFBTTtZQUNFLDRCQUE0QjtrQkFBcEMsS0FBSztZQUNHLDJCQUEyQjtrQkFBbkMsS0FBSztZQUNHLDJCQUEyQjtrQkFBbkMsS0FBSztZQWVHLE1BQU07a0JBQWQsS0FBSztZQVNrQixTQUFTO2tCQUFoQyxTQUFTO21CQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGbGF0VHJlZUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9jZGsvdHJlZSc7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3RhYmxlLCBJbnB1dCwgT3V0cHV0LEVsZW1lbnRSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBNYXRUcmVlRmxhdERhdGFTb3VyY2UsIE1hdFRyZWVGbGF0dGVuZXIgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90cmVlJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBvZiBhcyBvYnNlcnZhYmxlT2YgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQ2RrRHJhZ0Ryb3AgfSBmcm9tICdAYW5ndWxhci9jZGsvZHJhZy1kcm9wJztcclxuaW1wb3J0IHsgU2VsZWN0aW9uTW9kZWwgfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xyXG5pbXBvcnQgeyBmb3JFYWNoIH0gZnJvbSAnanN6aXAnO1xyXG5cclxuLyoqXHJcbiAqIEZpbGUgbm9kZSBkYXRhIHdpdGggbmVzdGVkIHN0cnVjdHVyZS5cclxuICogRWFjaCBub2RlIGhhcyBhIG5hbWUsIGFuZCBhIHR5cGUgb3IgYSBsaXN0IG9mIGNoaWxkcmVuLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEZpbGVOb2RlIHtcclxuICBpZDogc3RyaW5nO1xyXG4gIGNoaWxkcmVuOiBGaWxlTm9kZVtdO1xyXG4gIG5hbWU6IHN0cmluZztcclxuICB0eXBlOiBhbnk7XHJcbiAgYWN0aXZlOiBhbnlcclxuICBjYXJ0b2dyYXBoeUlkOiBhbnlcclxuICBjYXJ0b2dyYXBoeU5hbWU6IGFueVxyXG4gIGRhdGFzZXRVUkw6IGFueVxyXG4gIGRlc2NyaXB0aW9uOiBhbnlcclxuICBmaWx0ZXJHZXRGZWF0dXJlSW5mbzogYW55XHJcbiAgZmlsdGVyR2V0TWFwOiBhbnlcclxuICBmaWx0ZXJTZWxlY3RhYmxlOiBhbnlcclxuICBpc0ZvbGRlcjogYW55XHJcbiAgbWV0YWRhdGFVUkw6IGFueVxyXG4gIG9yZGVyOiBhbnlcclxuICBwYXJlbnQ6IGFueVxyXG4gIHF1ZXJ5YWJsZUFjdGl2ZTogYW55XHJcbiAgcmFkaW86IGFueVxyXG4gIHRvb2x0aXA6IGFueVxyXG4gIF9saW5rczogYW55XHJcbn1cclxuXHJcbi8qKiBGbGF0IG5vZGUgd2l0aCBleHBhbmRhYmxlIGFuZCBsZXZlbCBpbmZvcm1hdGlvbiAqL1xyXG5leHBvcnQgY2xhc3MgRmlsZUZsYXROb2RlIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHB1YmxpYyBleHBhbmRhYmxlOiBib29sZWFuLFxyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZyxcclxuICAgIHB1YmxpYyBsZXZlbDogbnVtYmVyLFxyXG4gICAgcHVibGljIHR5cGU6IGFueSxcclxuICAgIHB1YmxpYyBpZDogc3RyaW5nXHJcbiAgKSB7IH1cclxufVxyXG5cclxuXHJcblxyXG4vKipcclxuICogRmlsZSBkYXRhYmFzZSwgaXQgY2FuIGJ1aWxkIGEgdHJlZSBzdHJ1Y3R1cmVkIEpzb24gb2JqZWN0IGZyb20gc3RyaW5nLlxyXG4gKiBFYWNoIG5vZGUgaW4gSnNvbiBvYmplY3QgcmVwcmVzZW50cyBhIGZpbGUgb3IgYSBkaXJlY3RvcnkuIEZvciBhIGZpbGUsIGl0IGhhcyBuYW1lIGFuZCB0eXBlLlxyXG4gKiBGb3IgYSBkaXJlY3RvcnksIGl0IGhhcyBuYW1lIGFuZCBjaGlsZHJlbiAoYSBsaXN0IG9mIGZpbGVzIG9yIGRpcmVjdG9yaWVzKS5cclxuICogVGhlIGlucHV0IHdpbGwgYmUgYSBqc29uIG9iamVjdCBzdHJpbmcsIGFuZCB0aGUgb3V0cHV0IGlzIGEgbGlzdCBvZiBgRmlsZU5vZGVgIHdpdGggbmVzdGVkXHJcbiAqIHN0cnVjdHVyZS5cclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEZpbGVEYXRhYmFzZSB7XHJcbiAgZGF0YUNoYW5nZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8RmlsZU5vZGVbXT4oW10pO1xyXG4gIGdldCBkYXRhKCk6IGFueSB7IHJldHVybiB0aGlzLmRhdGFDaGFuZ2UudmFsdWU7IH1cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gIH1cclxuXHJcbiAgaW5pdGlhbGl6ZShkYXRhT2JqKSB7XHJcblxyXG4gICAgLy8gQnVpbGQgdGhlIHRyZWUgbm9kZXMgZnJvbSBKc29uIG9iamVjdC4gVGhlIHJlc3VsdCBpcyBhIGxpc3Qgb2YgYEZpbGVOb2RlYCB3aXRoIG5lc3RlZFxyXG4gICAgLy8gICAgIGZpbGUgbm9kZSBhcyBjaGlsZHJlbi5cclxuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkRmlsZVRyZWUoZGF0YU9iaiwgMCk7XHJcblxyXG4gICAgLy8gTm90aWZ5IHRoZSBjaGFuZ2UuXHJcbiAgICB0aGlzLmRhdGFDaGFuZ2UubmV4dChkYXRhKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEJ1aWxkIHRoZSBmaWxlIHN0cnVjdHVyZSB0cmVlLiBUaGUgYHZhbHVlYCBpcyB0aGUgSnNvbiBvYmplY3QsIG9yIGEgc3ViLXRyZWUgb2YgYSBKc29uIG9iamVjdC5cclxuICAgKiBUaGUgcmV0dXJuIHZhbHVlIGlzIHRoZSBsaXN0IG9mIGBGaWxlTm9kZWAuXHJcbiAgICovXHJcbiAgYnVpbGRGaWxlVHJlZShhcnJheVRyZWVOb2RlczogYW55W10sIGxldmVsOiBudW1iZXIsIHBhcmVudElkOiBzdHJpbmcgPSAnMCcpOiBhbnkge1xyXG4gICAgdmFyIG1hcCA9IHt9O1xyXG4gICAgYXJyYXlUcmVlTm9kZXMuZm9yRWFjaCgodHJlZU5vZGUpID0+IHtcclxuICAgICAgdmFyIG9iaiA9IHRyZWVOb2RlO1xyXG4gICAgICBvYmouY2hpbGRyZW4gPSBbXTtcclxuICAgICAgb2JqLnR5cGU9ICh0cmVlTm9kZS5pc0ZvbGRlcik/IFwiZm9sZGVyXCIgOiBcIm5vZGVcIjtcclxuXHJcbiAgICAgIGlmKCFtYXBbb2JqLmlkXSkge21hcFtvYmouaWRdID0gb2JqO31cclxuICAgICAgZWxzZXtcclxuICAgICAgICBsZXQgcHJldmlvdXNDaGlsZHJlbj0gbWFwW29iai5pZF0uY2hpbGRyZW5cclxuICAgICAgICBtYXBbb2JqLmlkXSA9IG9iajtcclxuICAgICAgICBtYXBbb2JqLmlkXS5jaGlsZHJlbj1wcmV2aW91c0NoaWxkcmVuXHJcbiAgICAgIH1cclxuICAgICAgdmFyIHBhcmVudCA9IG9iai5wYXJlbnQgfHwgJ3Jvb3QnO1xyXG4gICAgICBpZiAoIW1hcFtwYXJlbnRdKSB7XHJcbiAgICAgICAgbWFwW3BhcmVudF0gPSB7XHJcbiAgICAgICAgICBjaGlsZHJlbjogW11cclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICAgIG1hcFtwYXJlbnRdLmNoaWxkcmVuLnB1c2gob2JqKTtcclxuICAgIH0pO1xyXG4gICAgbWFwWydyb290J10udHlwZT0nZm9sZGVyJztcclxuICAgIG1hcFsncm9vdCddLm5hbWU9J1Jvb3QnO1xyXG4gICAgbWFwWydyb290J10uaXNGb2xkZXI9dHJ1ZTtcclxuXHJcbiAgICByZXR1cm4gbWFwWydyb290J107XHJcbiAgfVxyXG5cclxuICBkZWxldGVJdGVtKG5vZGU6IEZpbGVOb2RlKSB7XHJcbiAgICB0aGlzLmRlbGV0ZU5vZGUodGhpcy5kYXRhLmNoaWxkcmVuLCBub2RlKTtcclxuICAgIHRoaXMuZGF0YUNoYW5nZS5uZXh0KHRoaXMuZGF0YSk7XHJcbiAgfVxyXG5cclxuICBkZWxldGVOb2RlKG5vZGVzOiBGaWxlTm9kZVtdLCBub2RlVG9EZWxldGU6IEZpbGVOb2RlKSB7XHJcbiAgICBjb25zdCBpbmRleCA9IG5vZGVzLmluZGV4T2Yobm9kZVRvRGVsZXRlLCAwKTtcclxuICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgIG5vZGVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgIGlmIChub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5kZWxldGVOb2RlKG5vZGUuY2hpbGRyZW4sIG5vZGVUb0RlbGV0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvcHlQYXN0ZUl0ZW0oZnJvbTogRmlsZU5vZGUsIHRvOiBGaWxlTm9kZSk6IEZpbGVOb2RlIHtcclxuICAgIGNvbnN0IG5ld0l0ZW0gPSB0aGlzLmluc2VydEl0ZW0odG8sIGZyb20pO1xyXG5cclxuICAgIHJldHVybiBuZXdJdGVtO1xyXG4gIH1cclxuXHJcbiAgY29weVBhc3RlSXRlbUFib3ZlKGZyb206IEZpbGVOb2RlLCB0bzogRmlsZU5vZGUpOiBGaWxlTm9kZSB7XHJcbiAgICBjb25zdCBuZXdJdGVtID0gdGhpcy5pbnNlcnRJdGVtQWJvdmUodG8sIGZyb20pO1xyXG5cclxuICAgIHJldHVybiBuZXdJdGVtO1xyXG4gIH1cclxuXHJcbiAgY29weVBhc3RlSXRlbUJlbG93KGZyb206IEZpbGVOb2RlLCB0bzogRmlsZU5vZGUpOiBGaWxlTm9kZSB7XHJcbiAgICBjb25zdCBuZXdJdGVtID0gdGhpcy5pbnNlcnRJdGVtQmVsb3codG8sIGZyb20pO1xyXG5cclxuICAgIHJldHVybiBuZXdJdGVtO1xyXG4gIH1cclxuXHJcbiAgLyoqIEFkZCBhbiBpdGVtIHRvIHRvLWRvIGxpc3QgKi9cclxuICBpbnNlcnRJdGVtKHBhcmVudDogRmlsZU5vZGUsIG5vZGU6IEZpbGVOb2RlKTogRmlsZU5vZGUge1xyXG4gICAgaWYgKCFwYXJlbnQuY2hpbGRyZW4pIHtcclxuICAgICAgcGFyZW50LmNoaWxkcmVuID0gW107XHJcbiAgICB9XHJcbiAgICBjb25zdCBuZXdJdGVtID0ge1xyXG4gICAgICBuYW1lOiBub2RlLm5hbWUsXHJcbiAgICAgIGNoaWxkcmVuOiBub2RlLmNoaWxkcmVuLFxyXG4gICAgICB0eXBlOiBub2RlLnR5cGUsXHJcbiAgICAgIGlkOiBub2RlLmlkLCBcclxuICAgICAgYWN0aXZlOiBub2RlLmFjdGl2ZSxcclxuICAgICAgY2FydG9ncmFwaHlJZDogbm9kZS5jYXJ0b2dyYXBoeUlkLFxyXG4gICAgICBjYXJ0b2dyYXBoeU5hbWU6IG5vZGUuY2FydG9ncmFwaHlOYW1lLFxyXG4gICAgICBkYXRhc2V0VVJMOiBub2RlLmRhdGFzZXRVUkwsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiBub2RlLmRlc2NyaXB0aW9uLFxyXG4gICAgICBmaWx0ZXJHZXRGZWF0dXJlSW5mbzogbm9kZS5maWx0ZXJHZXRGZWF0dXJlSW5mbyxcclxuICAgICAgZmlsdGVyR2V0TWFwOiBub2RlLmZpbHRlckdldE1hcCxcclxuICAgICAgZmlsdGVyU2VsZWN0YWJsZTogbm9kZS5maWx0ZXJTZWxlY3RhYmxlLFxyXG4gICAgICBpc0ZvbGRlcjogbm9kZS5pc0ZvbGRlcixcclxuICAgICAgbWV0YWRhdGFVUkw6IG5vZGUubWV0YWRhdGFVUkwsXHJcbiAgICAgIG9yZGVyOiBub2RlLm9yZGVyLFxyXG4gICAgICBwYXJlbnQ6IHBhcmVudC5pZD09dW5kZWZpbmVkP251bGw6cGFyZW50LmlkICxcclxuICAgICAgcXVlcnlhYmxlQWN0aXZlOiBub2RlLnF1ZXJ5YWJsZUFjdGl2ZSxcclxuICAgICAgcmFkaW86IG5vZGUucmFkaW8sXHJcbiAgICAgIHRvb2x0aXA6IG5vZGUudG9vbHRpcCxcclxuICAgICAgX2xpbmtzOiBub2RlLl9saW5rcyB9IGFzIEZpbGVOb2RlO1xyXG4gICAgcGFyZW50LmNoaWxkcmVuLnB1c2gobmV3SXRlbSk7XHJcbiAgICB0aGlzLmRhdGFDaGFuZ2UubmV4dCh0aGlzLmRhdGEpO1xyXG4gICAgcmV0dXJuIG5ld0l0ZW07XHJcbiAgfVxyXG5cclxuICBpbnNlcnRJdGVtQWJvdmUobm9kZTogRmlsZU5vZGUsIG5vZGVEcmFnOiBGaWxlTm9kZSk6IEZpbGVOb2RlIHtcclxuICAgIGNvbnN0IHBhcmVudE5vZGUgPSB0aGlzLmdldFBhcmVudEZyb21Ob2Rlcyhub2RlKTtcclxuICAgIGNvbnN0IG5ld0l0ZW0gPSB7XHJcbiAgICAgIG5hbWU6IG5vZGVEcmFnLm5hbWUsXHJcbiAgICAgIGNoaWxkcmVuOiBub2RlRHJhZy5jaGlsZHJlbixcclxuICAgICAgdHlwZTogbm9kZURyYWcudHlwZSxcclxuICAgICAgaWQ6IG5vZGVEcmFnLmlkLCBcclxuICAgICAgYWN0aXZlOiBub2RlRHJhZy5hY3RpdmUsXHJcbiAgICAgIGNhcnRvZ3JhcGh5SWQ6IG5vZGVEcmFnLmNhcnRvZ3JhcGh5SWQsXHJcbiAgICAgIGNhcnRvZ3JhcGh5TmFtZTogbm9kZURyYWcuY2FydG9ncmFwaHlOYW1lLFxyXG4gICAgICBkYXRhc2V0VVJMOiBub2RlRHJhZy5kYXRhc2V0VVJMLFxyXG4gICAgICBkZXNjcmlwdGlvbjogbm9kZURyYWcuZGVzY3JpcHRpb24sXHJcbiAgICAgIGZpbHRlckdldEZlYXR1cmVJbmZvOiBub2RlRHJhZy5maWx0ZXJHZXRGZWF0dXJlSW5mbyxcclxuICAgICAgZmlsdGVyR2V0TWFwOiBub2RlRHJhZy5maWx0ZXJHZXRNYXAsXHJcbiAgICAgIGZpbHRlclNlbGVjdGFibGU6IG5vZGVEcmFnLmZpbHRlclNlbGVjdGFibGUsXHJcbiAgICAgIGlzRm9sZGVyOiBub2RlRHJhZy5pc0ZvbGRlcixcclxuICAgICAgbWV0YWRhdGFVUkw6IG5vZGVEcmFnLm1ldGFkYXRhVVJMLFxyXG4gICAgICBvcmRlcjogbm9kZURyYWcub3JkZXIsXHJcbiAgICAgIHBhcmVudDogcGFyZW50Tm9kZS5pZD09dW5kZWZpbmVkP251bGw6cGFyZW50Tm9kZS5pZCAsXHJcbiAgICAgIHF1ZXJ5YWJsZUFjdGl2ZTogbm9kZURyYWcucXVlcnlhYmxlQWN0aXZlLFxyXG4gICAgICByYWRpbzogbm9kZURyYWcucmFkaW8sXHJcbiAgICAgIHRvb2x0aXA6IG5vZGVEcmFnLnRvb2x0aXAsXHJcbiAgICAgIF9saW5rczogbm9kZURyYWcuX2xpbmtzIH0gYXMgRmlsZU5vZGU7XHJcbiAgICBpZiAocGFyZW50Tm9kZSAhPSBudWxsKSB7XHJcbiAgICAgIHBhcmVudE5vZGUuY2hpbGRyZW4uc3BsaWNlKHBhcmVudE5vZGUuY2hpbGRyZW4uaW5kZXhPZihub2RlKSwgMCwgbmV3SXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmRhdGEuY2hpbGRyZW4uc3BsaWNlKHRoaXMuZGF0YS5jaGlsZHJlbi5pbmRleE9mKG5vZGUpLCAwLCBuZXdJdGVtKTtcclxuICAgIH1cclxuICAgIHRoaXMuZGF0YUNoYW5nZS5uZXh0KHRoaXMuZGF0YSk7XHJcbiAgICByZXR1cm4gbmV3SXRlbTtcclxuICB9XHJcblxyXG4gIGluc2VydEl0ZW1CZWxvdyhub2RlOiBGaWxlTm9kZSwgbm9kZURyYWc6IEZpbGVOb2RlKTogRmlsZU5vZGUge1xyXG4gICAgY29uc3QgcGFyZW50Tm9kZSA9IHRoaXMuZ2V0UGFyZW50RnJvbU5vZGVzKG5vZGUpO1xyXG4gICAgY29uc3QgbmV3SXRlbSA9IHtcclxuICAgICAgbmFtZTogbm9kZURyYWcubmFtZSxcclxuICAgICAgY2hpbGRyZW46IG5vZGVEcmFnLmNoaWxkcmVuLFxyXG4gICAgICB0eXBlOiBub2RlRHJhZy50eXBlLFxyXG4gICAgICBpZDogbm9kZURyYWcuaWQsIFxyXG4gICAgICBhY3RpdmU6IG5vZGVEcmFnLmFjdGl2ZSxcclxuICAgICAgY2FydG9ncmFwaHlJZDogbm9kZURyYWcuY2FydG9ncmFwaHlJZCxcclxuICAgICAgY2FydG9ncmFwaHlOYW1lOiBub2RlRHJhZy5jYXJ0b2dyYXBoeU5hbWUsXHJcbiAgICAgIGRhdGFzZXRVUkw6IG5vZGVEcmFnLmRhdGFzZXRVUkwsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiBub2RlRHJhZy5kZXNjcmlwdGlvbixcclxuICAgICAgZmlsdGVyR2V0RmVhdHVyZUluZm86IG5vZGVEcmFnLmZpbHRlckdldEZlYXR1cmVJbmZvLFxyXG4gICAgICBmaWx0ZXJHZXRNYXA6IG5vZGVEcmFnLmZpbHRlckdldE1hcCxcclxuICAgICAgZmlsdGVyU2VsZWN0YWJsZTogbm9kZURyYWcuZmlsdGVyU2VsZWN0YWJsZSxcclxuICAgICAgaXNGb2xkZXI6IG5vZGVEcmFnLmlzRm9sZGVyLFxyXG4gICAgICBtZXRhZGF0YVVSTDogbm9kZURyYWcubWV0YWRhdGFVUkwsXHJcbiAgICAgIG9yZGVyOiBub2RlRHJhZy5vcmRlcixcclxuICAgICAgcGFyZW50OiBwYXJlbnROb2RlLmlkPT11bmRlZmluZWQ/bnVsbDpwYXJlbnROb2RlLmlkICxcclxuICAgICAgcXVlcnlhYmxlQWN0aXZlOiBub2RlRHJhZy5xdWVyeWFibGVBY3RpdmUsXHJcbiAgICAgIHJhZGlvOiBub2RlRHJhZy5yYWRpbyxcclxuICAgICAgdG9vbHRpcDogbm9kZURyYWcudG9vbHRpcCxcclxuICAgICAgX2xpbmtzOiBub2RlRHJhZy5fbGlua3MgfSBhcyBGaWxlTm9kZTtcclxuICAgIGlmIChwYXJlbnROb2RlICE9IG51bGwpIHtcclxuICAgICAgcGFyZW50Tm9kZS5jaGlsZHJlbi5zcGxpY2UocGFyZW50Tm9kZS5jaGlsZHJlbi5pbmRleE9mKG5vZGUpICsgMSwgMCwgbmV3SXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmRhdGEuY2hpbGRyZW4uc3BsaWNlKHRoaXMuZGF0YS5jaGlsZHJlbi5pbmRleE9mKG5vZGUpICsgMSwgMCwgbmV3SXRlbSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmRhdGFDaGFuZ2UubmV4dCh0aGlzLmRhdGEpO1xyXG4gICAgcmV0dXJuIG5ld0l0ZW07XHJcbiAgfVxyXG5cclxuICBcclxuICBnZXRQYXJlbnRGcm9tTm9kZXMobm9kZTogRmlsZU5vZGUpOiBGaWxlTm9kZSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZGF0YS5jaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG4gICAgICBjb25zdCBjdXJyZW50Um9vdCA9IHRoaXMuZGF0YS5jaGlsZHJlbltpXTtcclxuICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnQoY3VycmVudFJvb3QsIG5vZGUpO1xyXG4gICAgICBpZiAocGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gcGFyZW50O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIFxyXG4gIGdldFBhcmVudChjdXJyZW50Um9vdDogRmlsZU5vZGUsIG5vZGU6IEZpbGVOb2RlKTogRmlsZU5vZGUge1xyXG4gICAgaWYgKGN1cnJlbnRSb290LmNoaWxkcmVuICYmIGN1cnJlbnRSb290LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Um9vdC5jaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkID0gY3VycmVudFJvb3QuY2hpbGRyZW5baV07XHJcbiAgICAgICAgaWYgKGNoaWxkID09PSBub2RlKSB7XHJcbiAgICAgICAgICByZXR1cm4gY3VycmVudFJvb3Q7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjaGlsZC5jaGlsZHJlbiAmJiBjaGlsZC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmdldFBhcmVudChjaGlsZCwgbm9kZSk7XHJcbiAgICAgICAgICBpZiAocGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAdGl0bGUgVHJlZSB3aXRoIGZsYXQgbm9kZXNcclxuICovXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWRhdGEtdHJlZScsXHJcbiAgdGVtcGxhdGVVcmw6ICdkYXRhLXRyZWUuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydkYXRhLXRyZWUuY29tcG9uZW50LnNjc3MnXSxcclxuICBwcm92aWRlcnM6IFtGaWxlRGF0YWJhc2VdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEYXRhVHJlZUNvbXBvbmVudCB7XHJcbiAgQE91dHB1dCgpIGNyZWF0ZU5vZGU6IEV2ZW50RW1pdHRlcjxhbnk+O1xyXG4gIEBPdXRwdXQoKSBjcmVhdGVGb2xkZXI6IEV2ZW50RW1pdHRlcjxhbnk+O1xyXG4gIEBPdXRwdXQoKSBlbWl0Tm9kZTogRXZlbnRFbWl0dGVyPGFueT47XHJcbiAgQE91dHB1dCgpIGVtaXRBbGxOb2RlczogRXZlbnRFbWl0dGVyPGFueT47XHJcbiAgQElucHV0KCkgZXZlbnROb2RlVXBkYXRlZFN1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZSA8YW55PiA7XHJcbiAgQElucHV0KCkgZXZlbnRDcmVhdGVOb2RlU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlIDxhbnk+IDtcclxuICBASW5wdXQoKSBldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb246IE9ic2VydmFibGUgPGFueT4gO1xyXG4gIHByaXZhdGUgX2V2ZW50Tm9kZVVwZGF0ZWRTdWJzY3JpcHRpb246IGFueTtcclxuICBwcml2YXRlIF9ldmVudENyZWF0ZU5vZGVTdWJzY3JpcHRpb246IGFueTtcclxuICBwcml2YXRlIF9ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb246IGFueTtcclxuICB0cmVlQ29udHJvbDogRmxhdFRyZWVDb250cm9sPEZpbGVGbGF0Tm9kZT47XHJcbiAgdHJlZUZsYXR0ZW5lcjogTWF0VHJlZUZsYXR0ZW5lcjxGaWxlTm9kZSwgRmlsZUZsYXROb2RlPjtcclxuICBkYXRhU291cmNlOiBNYXRUcmVlRmxhdERhdGFTb3VyY2U8RmlsZU5vZGUsIEZpbGVGbGF0Tm9kZT47XHJcbiAgLy8gZXhwYW5zaW9uIG1vZGVsIHRyYWNrcyBleHBhbnNpb24gc3RhdGVcclxuICBleHBhbnNpb25Nb2RlbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxzdHJpbmc+KHRydWUpO1xyXG4gIGRyYWdnaW5nID0gZmFsc2U7XHJcbiAgZXhwYW5kVGltZW91dDogYW55O1xyXG4gIGV4cGFuZERlbGF5ID0gMTAwMDtcclxuICB2YWxpZGF0ZURyb3AgPSBmYWxzZTtcclxuICB0cmVlRGF0YTogYW55O1xyXG5cclxuICBASW5wdXQoKSBnZXRBbGw6ICgpID0+IE9ic2VydmFibGU8YW55PjtcclxuXHJcblxyXG4gIC8qIERyYWcgYW5kIGRyb3AgKi9cclxuICBkcmFnTm9kZTogYW55O1xyXG4gIGRyYWdOb2RlRXhwYW5kT3ZlcldhaXRUaW1lTXMgPSAxNTAwO1xyXG4gIGRyYWdOb2RlRXhwYW5kT3Zlck5vZGU6IGFueTtcclxuICBkcmFnTm9kZUV4cGFuZE92ZXJUaW1lOiBudW1iZXI7XHJcbiAgZHJhZ05vZGVFeHBhbmRPdmVyQXJlYTogc3RyaW5nO1xyXG4gIEBWaWV3Q2hpbGQoJ2VtcHR5SXRlbScpIGVtcHR5SXRlbTogRWxlbWVudFJlZjtcclxuXHJcbiAgICAvKiogTWFwIGZyb20gZmxhdCBub2RlIHRvIG5lc3RlZCBub2RlLiBUaGlzIGhlbHBzIHVzIGZpbmRpbmcgdGhlIG5lc3RlZCBub2RlIHRvIGJlIG1vZGlmaWVkICovXHJcbiAgICBmbGF0Tm9kZU1hcCA9IG5ldyBNYXA8RmlsZUZsYXROb2RlLCBGaWxlTm9kZT4oKTtcclxuXHJcbiAgICAvKiogTWFwIGZyb20gbmVzdGVkIG5vZGUgdG8gZmxhdHRlbmVkIG5vZGUuIFRoaXMgaGVscHMgdXMgdG8ga2VlcCB0aGUgc2FtZSBvYmplY3QgZm9yIHNlbGVjdGlvbiAqL1xyXG4gICAgbmVzdGVkTm9kZU1hcCA9IG5ldyBNYXA8RmlsZU5vZGUsIEZpbGVGbGF0Tm9kZT4oKTtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkYXRhYmFzZTogRmlsZURhdGFiYXNlKSB7XHJcbiAgICB0aGlzLmVtaXROb2RlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5jcmVhdGVOb2RlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5jcmVhdGVGb2xkZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmVtaXRBbGxOb2RlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMudHJlZUZsYXR0ZW5lciA9IG5ldyBNYXRUcmVlRmxhdHRlbmVyKHRoaXMudHJhbnNmb3JtZXIsIHRoaXMuX2dldExldmVsLFxyXG4gICAgICB0aGlzLl9pc0V4cGFuZGFibGUsIHRoaXMuX2dldENoaWxkcmVuKTtcclxuICAgIHRoaXMudHJlZUNvbnRyb2wgPSBuZXcgRmxhdFRyZWVDb250cm9sPEZpbGVGbGF0Tm9kZT4odGhpcy5fZ2V0TGV2ZWwsIHRoaXMuX2lzRXhwYW5kYWJsZSk7XHJcbiAgICB0aGlzLmRhdGFTb3VyY2UgPSBuZXcgTWF0VHJlZUZsYXREYXRhU291cmNlKHRoaXMudHJlZUNvbnRyb2wsIHRoaXMudHJlZUZsYXR0ZW5lcik7XHJcbiBcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCl7XHJcblxyXG4gICAgaWYodGhpcy5ldmVudE5vZGVVcGRhdGVkU3Vic2NyaXB0aW9uKVxyXG4gICAge1xyXG4gICAgICB0aGlzLmV2ZW50Tm9kZVVwZGF0ZWRTdWJzY3JpcHRpb24uc3Vic2NyaWJlKFxyXG4gICAgICAgIChub2RlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZU5vZGUobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmV2ZW50Q3JlYXRlTm9kZVN1YnNjcmlwdGlvbilcclxuICAgIHtcclxuICAgICAgdGhpcy5ldmVudENyZWF0ZU5vZGVTdWJzY3JpcHRpb24uc3Vic2NyaWJlKFxyXG4gICAgICAgIChub2RlKSA9PiB7XHJcbiAgICAgICAgICBpZihub2RlLmlzRm9sZGVyKSB0aGlzLmNyZWF0ZU5ld0ZvbGRlcihub2RlKTtcclxuICAgICAgICAgIGVsc2UgdGhpcy5jcmVhdGVOZXdOb2RlKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmV2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLl9ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbi5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZW1pdEFsbFJvd3MoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRoaXMuZ2V0QWxsKClcclxuICAgIC5zdWJzY3JpYmUoKGl0ZW1zKSA9PiB7XHJcbiAgICAgIHRoaXMudHJlZURhdGEgPSBpdGVtcztcclxuICAgICAgdGhpcy5kYXRhYmFzZS5pbml0aWFsaXplKHRoaXMudHJlZURhdGEpO1xyXG4gICAgICB0aGlzLmRhdGFiYXNlLmRhdGFDaGFuZ2Uuc3Vic2NyaWJlKGRhdGEgPT4gdGhpcy5yZWJ1aWxkVHJlZUZvckRhdGEoW2RhdGFdKSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICB0cmFuc2Zvcm1lciA9IChub2RlOiBGaWxlTm9kZSwgbGV2ZWw6IG51bWJlcikgPT4ge1xyXG4gICAgY29uc3QgZXhpc3RpbmdOb2RlID0gdGhpcy5uZXN0ZWROb2RlTWFwLmdldChub2RlKTtcclxuICAgIGNvbnN0IGZsYXROb2RlID0gZXhpc3RpbmdOb2RlICYmIGV4aXN0aW5nTm9kZS5uYW1lID09PSBub2RlLm5hbWVcclxuICAgICAgPyBleGlzdGluZ05vZGVcclxuICAgICAgOiBuZXcgRmlsZUZsYXROb2RlKChub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCksbm9kZS5uYW1lLGxldmVsLG5vZGUudHlwZSxub2RlLmlkKTtcclxuXHJcbiAgICB0aGlzLmZsYXROb2RlTWFwLnNldChmbGF0Tm9kZSwgbm9kZSk7XHJcbiAgICB0aGlzLm5lc3RlZE5vZGVNYXAuc2V0KG5vZGUsIGZsYXROb2RlKTtcclxuICAgIHJldHVybiBmbGF0Tm9kZTtcclxuICBcclxuICB9XHJcbiAgcHJpdmF0ZSBfZ2V0TGV2ZWwgPSAobm9kZTogRmlsZUZsYXROb2RlKSA9PiBub2RlLmxldmVsO1xyXG4gIHByaXZhdGUgX2lzRXhwYW5kYWJsZSA9IChub2RlOiBGaWxlRmxhdE5vZGUpID0+IG5vZGUuZXhwYW5kYWJsZTtcclxuICBwcml2YXRlIF9nZXRDaGlsZHJlbiA9IChub2RlOiBGaWxlTm9kZSk6IE9ic2VydmFibGU8RmlsZU5vZGVbXT4gPT4gb2JzZXJ2YWJsZU9mKG5vZGUuY2hpbGRyZW4pO1xyXG4gIGhhc0NoaWxkID0gKF86IG51bWJlciwgX25vZGVEYXRhOiBGaWxlRmxhdE5vZGUpID0+IF9ub2RlRGF0YS5leHBhbmRhYmxlO1xyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogVGhpcyBjb25zdHJ1Y3RzIGFuIGFycmF5IG9mIG5vZGVzIHRoYXQgbWF0Y2hlcyB0aGUgRE9NXHJcbiAgICovXHJcbiAgdmlzaWJsZU5vZGVzKCk6IEZpbGVOb2RlW10ge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkRXhwYW5kZWRDaGlsZHJlbihub2RlOiBGaWxlTm9kZSwgZXhwYW5kZWQ6IHN0cmluZ1tdKSB7XHJcbiAgICAgIHJlc3VsdC5wdXNoKG5vZGUpO1xyXG4gICAgICBpZiAoZXhwYW5kZWQuaW5kZXhPZihub2RlLmlkKSAhPSAtMSkge1xyXG4gICAgICAgIG5vZGUuY2hpbGRyZW4ubWFwKChjaGlsZCkgPT4gYWRkRXhwYW5kZWRDaGlsZHJlbihjaGlsZCwgZXhwYW5kZWQpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5kYXRhU291cmNlLmRhdGEuZm9yRWFjaCgobm9kZSkgPT4ge1xyXG4gICAgICBhZGRFeHBhbmRlZENoaWxkcmVuKG5vZGUsIHRoaXMuZXhwYW5zaW9uTW9kZWwuc2VsZWN0ZWQpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcblxyXG4gICBmaW5kTm9kZVNpYmxpbmdzKGFycjogQXJyYXk8YW55PiwgaWQ6IHN0cmluZyk6IEFycmF5PGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdCwgc3ViUmVzdWx0O1xyXG4gICAgYXJyLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuICAgICAgaWYgKGl0ZW0uaWQgPT09IGlkKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gYXJyO1xyXG4gICAgICB9IGVsc2UgaWYgKGl0ZW0uY2hpbGRyZW4pIHtcclxuICAgICAgICBzdWJSZXN1bHQgPSB0aGlzLmZpbmROb2RlU2libGluZ3MoaXRlbS5jaGlsZHJlbiwgaWQpO1xyXG4gICAgICAgIGlmIChzdWJSZXN1bHQpIHJlc3VsdCA9IHN1YlJlc3VsdDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG5cclxuICB9XHJcblxyXG5cclxuICBoYW5kbGVEcmFnU3RhcnQoZXZlbnQsIG5vZGUpIHtcclxuICAgIC8vIFJlcXVpcmVkIGJ5IEZpcmVmb3ggKGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE5MDU1MjY0L3doeS1kb2VzbnQtaHRtbDUtZHJhZy1hbmQtZHJvcC13b3JrLWluLWZpcmVmb3gpXHJcbiAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSgnZm9vJywgJ2JhcicpO1xyXG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZSh0aGlzLmVtcHR5SXRlbS5uYXRpdmVFbGVtZW50LCAwLCAwKTtcclxuICAgIHRoaXMuZHJhZ05vZGUgPSBub2RlO1xyXG4gICAgdGhpcy50cmVlQ29udHJvbC5jb2xsYXBzZShub2RlKTtcclxuICB9XHJcblxyXG4gIGhhbmRsZURyYWdPdmVyKGV2ZW50LCBub2RlKSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIC8vIEhhbmRsZSBub2RlIGV4cGFuZFxyXG4gICAgaWYgKG5vZGUgPT09IHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyTm9kZSkge1xyXG4gICAgICBpZiAodGhpcy5kcmFnTm9kZSAhPT0gbm9kZSAmJiAhdGhpcy50cmVlQ29udHJvbC5pc0V4cGFuZGVkKG5vZGUpKSB7XHJcbiAgICAgICAgaWYgKChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyVGltZSkgPiB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlcldhaXRUaW1lTXMpIHtcclxuICAgICAgICAgIHRoaXMudHJlZUNvbnRyb2wuZXhwYW5kKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJOb2RlID0gbm9kZTtcclxuICAgICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGFuZGxlIGRyYWcgYXJlYVxyXG4gICAgY29uc3QgcGVyY2VudGFnZVggPSBldmVudC5vZmZzZXRYIC8gZXZlbnQudGFyZ2V0LmNsaWVudFdpZHRoO1xyXG4gICAgY29uc3QgcGVyY2VudGFnZVkgPSBldmVudC5vZmZzZXRZIC8gZXZlbnQudGFyZ2V0LmNsaWVudEhlaWdodDtcclxuICAgIGlmIChwZXJjZW50YWdlWSA8IDAuMjUpIHtcclxuICAgICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJBcmVhID0gJ2Fib3ZlJztcclxuICAgIH0gZWxzZSBpZiAocGVyY2VudGFnZVkgPiAwLjc1KSB7XHJcbiAgICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyQXJlYSA9ICdiZWxvdyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlckFyZWEgPSAnY2VudGVyJztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhhbmRsZURyb3AoZXZlbnQsIG5vZGUpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpZiAobm9kZSAhPT0gdGhpcy5kcmFnTm9kZSkge1xyXG4gICAgICBsZXQgbmV3SXRlbTogRmlsZU5vZGU7XHJcbiAgICAgIGlmICh0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlckFyZWEgPT09ICdhYm92ZScpIHtcclxuICAgICAgICBuZXdJdGVtID0gdGhpcy5kYXRhYmFzZS5jb3B5UGFzdGVJdGVtQWJvdmUodGhpcy5mbGF0Tm9kZU1hcC5nZXQodGhpcy5kcmFnTm9kZSksIHRoaXMuZmxhdE5vZGVNYXAuZ2V0KG5vZGUpKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlckFyZWEgPT09ICdiZWxvdycpIHtcclxuICAgICAgICBuZXdJdGVtID0gdGhpcy5kYXRhYmFzZS5jb3B5UGFzdGVJdGVtQmVsb3codGhpcy5mbGF0Tm9kZU1hcC5nZXQodGhpcy5kcmFnTm9kZSksIHRoaXMuZmxhdE5vZGVNYXAuZ2V0KG5vZGUpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBuZXdJdGVtID0gdGhpcy5kYXRhYmFzZS5jb3B5UGFzdGVJdGVtKHRoaXMuZmxhdE5vZGVNYXAuZ2V0KHRoaXMuZHJhZ05vZGUpLCB0aGlzLmZsYXROb2RlTWFwLmdldChub2RlKSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5kYXRhYmFzZS5kZWxldGVJdGVtKHRoaXMuZmxhdE5vZGVNYXAuZ2V0KHRoaXMuZHJhZ05vZGUpKTtcclxuICAgICAgdGhpcy50cmVlQ29udHJvbC5leHBhbmREZXNjZW5kYW50cyh0aGlzLm5lc3RlZE5vZGVNYXAuZ2V0KG5ld0l0ZW0pKTtcclxuICAgIH1cclxuICAgIHRoaXMuZHJhZ05vZGUgPSBudWxsO1xyXG4gICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJOb2RlID0gbnVsbDtcclxuICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyVGltZSA9IDA7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVEcmFnRW5kKGV2ZW50KSB7XHJcbiAgICB0aGlzLmRyYWdOb2RlID0gbnVsbDtcclxuICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyTm9kZSA9IG51bGw7XHJcbiAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlclRpbWUgPSAwO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGZvbGxvd2luZyBtZXRob2RzIGFyZSBmb3IgcGVyc2lzdGluZyB0aGUgdHJlZSBleHBhbmQgc3RhdGVcclxuICAgKiBhZnRlciBiZWluZyByZWJ1aWx0XHJcbiAgICovXHJcblxyXG4gIHJlYnVpbGRUcmVlRm9yRGF0YShkYXRhOiBhbnkpIHtcclxuICAgIHRoaXMuZGF0YVNvdXJjZS5kYXRhID0gZGF0YTtcclxuICAgIHRoaXMuZXhwYW5zaW9uTW9kZWwuc2VsZWN0ZWQuZm9yRWFjaCgoaWQpID0+IHtcclxuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMudHJlZUNvbnRyb2wuZGF0YU5vZGVzLmZpbmQoKG4pID0+IG4uaWQgPT09IGlkKTtcclxuICAgICAgdGhpcy50cmVlQ29udHJvbC5leHBhbmQobm9kZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE5vdCB1c2VkIGJ1dCB5b3UgbWlnaHQgbmVlZCB0aGlzIHRvIHByb2dyYW1tYXRpY2FsbHkgZXhwYW5kIG5vZGVzXHJcbiAgICogdG8gcmV2ZWFsIGEgcGFydGljdWxhciBub2RlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBleHBhbmROb2Rlc0J5SWQoZmxhdE5vZGVzOiBGaWxlRmxhdE5vZGVbXSwgaWRzOiBzdHJpbmdbXSkge1xyXG4gICAgaWYgKCFmbGF0Tm9kZXMgfHwgZmxhdE5vZGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG4gICAgY29uc3QgaWRTZXQgPSBuZXcgU2V0KGlkcyk7XHJcbiAgICByZXR1cm4gZmxhdE5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcclxuICAgICAgaWYgKGlkU2V0Lmhhcyhub2RlLmlkKSkge1xyXG4gICAgICAgIHRoaXMudHJlZUNvbnRyb2wuZXhwYW5kKG5vZGUpO1xyXG4gICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLmdldFBhcmVudE5vZGUobm9kZSk7XHJcbiAgICAgICAgd2hpbGUgKHBhcmVudCkge1xyXG4gICAgICAgICAgdGhpcy50cmVlQ29udHJvbC5leHBhbmQocGFyZW50KTtcclxuICAgICAgICAgIHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50Tm9kZShwYXJlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFBhcmVudE5vZGUobm9kZTogRmlsZUZsYXROb2RlKTogRmlsZUZsYXROb2RlIHwgbnVsbCB7XHJcbiAgICBjb25zdCBjdXJyZW50TGV2ZWwgPSBub2RlLmxldmVsO1xyXG4gICAgaWYgKGN1cnJlbnRMZXZlbCA8IDEpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzdGFydEluZGV4ID0gdGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXMuaW5kZXhPZihub2RlKSAtIDE7XHJcbiAgICBmb3IgKGxldCBpID0gc3RhcnRJbmRleDsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgY29uc3QgY3VycmVudE5vZGUgPSB0aGlzLnRyZWVDb250cm9sLmRhdGFOb2Rlc1tpXTtcclxuICAgICAgaWYgKGN1cnJlbnROb2RlLmxldmVsIDwgY3VycmVudExldmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHVwZGF0ZU5vZGUobm9kZVVwZGF0ZWQpXHJcbiAge1xyXG4gICAgY29uc3QgZGF0YVRvQ2hhbmdlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGFTb3VyY2UuZGF0YSkpXHJcbiAgICBjb25zdCBzaWJsaW5ncyA9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhkYXRhVG9DaGFuZ2UsIG5vZGVVcGRhdGVkLmlkKTtcclxuICAgIGxldCBpbmRleD0gc2libGluZ3MuZmluZEluZGV4KG5vZGUgPT4gbm9kZS5pZCA9PT0gbm9kZVVwZGF0ZWQuaWQpXHJcbiAgICBzaWJsaW5nc1tpbmRleF09bm9kZVVwZGF0ZWQ7XHJcbiAgICB0aGlzLnJlYnVpbGRUcmVlRm9yRGF0YShkYXRhVG9DaGFuZ2UpO1xyXG5cclxuICB9XHJcblxyXG4gIGNyZWF0ZU5ld0ZvbGRlcihuZXdGb2xkZXIpXHJcbiAge1xyXG4gICAgbmV3Rm9sZGVyLnR5cGU9XCJmb2xkZXJcIjtcclxuICAgIGNvbnN0IGRhdGFUb0NoYW5nZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhU291cmNlLmRhdGEpKVxyXG4gICAgaWYobmV3Rm9sZGVyLnBhcmVudCA9PT0gbnVsbCkge2RhdGFUb0NoYW5nZS5wdXNoKG5ld0ZvbGRlcil9XHJcbiAgICBlbHNle1xyXG4gICAgICBjb25zdCBzaWJsaW5ncyA9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhkYXRhVG9DaGFuZ2UsIG5ld0ZvbGRlci5wYXJlbnQpO1xyXG4gICAgICBsZXQgaW5kZXg9IHNpYmxpbmdzLmZpbmRJbmRleChub2RlID0+IG5vZGUuaWQgPT09IG5ld0ZvbGRlci5wYXJlbnQpO1xyXG4gICAgICBzaWJsaW5nc1tpbmRleF0uY2hpbGRyZW4ucHVzaChuZXdGb2xkZXIpXHJcbiAgICB9XHJcbiAgICB0aGlzLnJlYnVpbGRUcmVlRm9yRGF0YShkYXRhVG9DaGFuZ2UpO1xyXG5cclxuICB9XHJcblxyXG4gIGNyZWF0ZU5ld05vZGUobmV3Tm9kZSlcclxuICB7XHJcbiAgICBuZXdOb2RlLnR5cGU9XCJub2RlXCI7XHJcbiAgICBjb25zdCBkYXRhVG9DaGFuZ2UgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YVNvdXJjZS5kYXRhKSlcclxuICAgIGNvbnN0IHNpYmxpbmdzID0gdGhpcy5maW5kTm9kZVNpYmxpbmdzKGRhdGFUb0NoYW5nZSwgbmV3Tm9kZS5wYXJlbnQpO1xyXG4gICAgbGV0IGluZGV4PSBzaWJsaW5ncy5maW5kSW5kZXgobm9kZSA9PiBub2RlLmlkID09PSBuZXdOb2RlLnBhcmVudCk7XHJcbiAgICBzaWJsaW5nc1tpbmRleF0uY2hpbGRyZW4ucHVzaChuZXdOb2RlKVxyXG4gICAgXHJcblxyXG4gICAgdGhpcy5yZWJ1aWxkVHJlZUZvckRhdGEoZGF0YVRvQ2hhbmdlKTtcclxuXHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIG9uQnV0dG9uQ2xpY2tlZChpZCwgYnV0dG9uOiBzdHJpbmcpXHJcbiAge1xyXG4gICAgY29uc3QgY2hhbmdlZERhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YVNvdXJjZS5kYXRhKSlcclxuICAgIGNvbnN0IHNpYmxpbmdzID0gdGhpcy5maW5kTm9kZVNpYmxpbmdzKGNoYW5nZWREYXRhLCBpZCk7XHJcbiAgICBsZXQgbm9kZUNsaWNrZWQ9IHNpYmxpbmdzLmZpbmQobm9kZSA9PiBub2RlLmlkID09PSBpZCk7XHJcbiAgICBpZihidXR0b24gPT09J2VkaXQnKSAge3RoaXMuZW1pdE5vZGUuZW1pdChub2RlQ2xpY2tlZCl9XHJcbiAgICBlbHNlIGlmKGJ1dHRvbiA9PT0gJ25ld0ZvbGRlcicpIHt0aGlzLmNyZWF0ZUZvbGRlci5lbWl0KG5vZGVDbGlja2VkKX1cclxuICAgIGVsc2UgaWYoYnV0dG9uID09PSAnbmV3Tm9kZScpIHt0aGlzLmNyZWF0ZU5vZGUuZW1pdCggbm9kZUNsaWNrZWQpfVxyXG4gICAgZWxzZSBpZihidXR0b24gPT09ICdkZWxldGUnKSB7XHJcbiAgICAgIGxldCBjaGlsZHJlbj0gdGhpcy5nZXRBbGxDaGlsZHJlbihub2RlQ2xpY2tlZC5jaGlsZHJlbilcclxuICAgICAgY2hpbGRyZW4uZm9yRWFjaChjaGlsZHJlbiA9PiB7XHJcbiAgICAgICAgY2hpbGRyZW4uc3RhdHVzPSdEZWxldGVkJztcclxuICAgICAgfSk7XHJcbiAgICAgIG5vZGVDbGlja2VkLmNoaWxkcmVuPWNoaWxkcmVuXHJcbiAgICAgIG5vZGVDbGlja2VkLnN0YXR1cz0nRGVsZXRlZCdcclxuICAgICAgdGhpcy5yZWJ1aWxkVHJlZUZvckRhdGEoY2hhbmdlZERhdGEpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGVtaXRBbGxSb3dzKClcclxuICB7XHJcbiAgICBjb25zdCBkYXRhVG9FbWl0ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGFTb3VyY2UuZGF0YSkpXHJcbiAgICBsZXQgYWxsUm93cyA9IHRoaXMuZ2V0QWxsQ2hpbGRyZW4oZGF0YVRvRW1pdCk7IFxyXG4gICAgdGhpcy5lbWl0QWxsTm9kZXMuZW1pdChhbGxSb3dzKTtcclxuICB9XHJcblxyXG4gIGdldEFsbENoaWxkcmVuKGFycilcclxuICB7XHJcbiAgICBsZXQgcmVzdWx0ID0gW107XHJcbiAgICBsZXQgc3ViUmVzdWx0O1xyXG4gICAgYXJyLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4ubGVuZ3RoPjApIHtcclxuICAgICAgICBzdWJSZXN1bHQgPSB0aGlzLmdldEFsbENoaWxkcmVuKGl0ZW0uY2hpbGRyZW4pO1xyXG4gICAgICAgIGlmIChzdWJSZXN1bHQpIHJlc3VsdC5wdXNoKC4uLnN1YlJlc3VsdCk7XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XHJcblxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbn1cclxuXHJcblxyXG4iLCI8bWF0LXRyZWUgW2RhdGFTb3VyY2VdPVwiZGF0YVNvdXJjZVwiIFt0cmVlQ29udHJvbF09XCJ0cmVlQ29udHJvbFwiID5cclxuXHQ8bWF0LXRyZWUtbm9kZSAqbWF0VHJlZU5vZGVEZWY9XCJsZXQgbm9kZVwiIG1hdFRyZWVOb2RlVG9nZ2xlIG1hdFRyZWVOb2RlUGFkZGluZyAgZHJhZ2dhYmxlPVwidHJ1ZVwiXHJcblx0KGRyYWdzdGFydCk9XCJoYW5kbGVEcmFnU3RhcnQoJGV2ZW50LCBub2RlKTtcIiBcdChkcmFnb3Zlcik9XCJoYW5kbGVEcmFnT3ZlcigkZXZlbnQsIG5vZGUpO1wiXHJcblx0KGRyb3ApPVwiaGFuZGxlRHJvcCgkZXZlbnQsIG5vZGUpO1wiIFx0KGRyYWdlbmQpPVwiaGFuZGxlRHJhZ0VuZCgkZXZlbnQpO1wiICAgICAgICAgICAgICAgICAgXHJcblx0ICBbbmdDbGFzc109XCJ7J2Ryb3AtYWJvdmUnOiBkcmFnTm9kZUV4cGFuZE92ZXJBcmVhID09PSAnYWJvdmUnICYmIGRyYWdOb2RlRXhwYW5kT3Zlck5vZGUgPT09IG5vZGUsXHJcblx0J2Ryb3AtYmVsb3cnOiBkcmFnTm9kZUV4cGFuZE92ZXJBcmVhID09PSAnYmVsb3cnICYmIGRyYWdOb2RlRXhwYW5kT3Zlck5vZGUgPT09IG5vZGUsXHJcblx0J2Ryb3AtY2VudGVyJzogZHJhZ05vZGVFeHBhbmRPdmVyQXJlYSA9PT0gJ2NlbnRlcicgJiYgZHJhZ05vZGVFeHBhbmRPdmVyTm9kZSA9PT0gbm9kZX1cIj5cclxuXHRcdDxidXR0b24gbWF0LWljb24tYnV0dG9uIGRpc2FibGVkPjwvYnV0dG9uPlxyXG5cdFx0PG1hdC1pY29uICpuZ0lmPVwibm9kZS50eXBlID09PSdmb2xkZXInXCIgY2xhc3M9XCJ0eXBlLWljb25cIiBbYXR0ci5hcmlhLWxhYmVsXT1cIm5vZGUudHlwZSArICdpY29uJ1wiPlxyXG5cdFx0XHRmb2xkZXJcclxuXHRcdDwvbWF0LWljb24+XHJcblx0XHR7e25vZGUubmFtZX19XHJcblx0XHQ8YnV0dG9uICpuZ0lmPVwibm9kZS50eXBlID09PSdmb2xkZXInXCIgKGNsaWNrKT1cIm9uQnV0dG9uQ2xpY2tlZChub2RlLmlkLCAnbmV3Rm9sZGVyJylcIiBtYXQtaWNvbi1idXR0b24+XHJcblx0XHRcdDxtYXQtaWNvbj5jcmVhdGVfbmV3X2ZvbGRlcjwvbWF0LWljb24+XHJcblx0XHQ8L2J1dHRvbj5cclxuXHRcdDxidXR0b24gKm5nSWY9XCJub2RlLnR5cGUgPT09J2ZvbGRlcidcIiAoY2xpY2spPVwib25CdXR0b25DbGlja2VkKG5vZGUuaWQsICduZXdOb2RlJylcIiBtYXQtaWNvbi1idXR0b24+XHJcblx0XHRcdDxtYXQtaWNvbj5wbGF5bGlzdF9hZGQ8L21hdC1pY29uPlxyXG5cdFx0PC9idXR0b24+XHJcblx0XHQ8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiAoY2xpY2spPVwib25CdXR0b25DbGlja2VkKG5vZGUuaWQsICdkZWxldGUnKVwiPlxyXG5cdFx0XHQ8bWF0LWljb24+ZGVsZXRlPC9tYXQtaWNvbj5cclxuXHRcdDwvYnV0dG9uPlxyXG5cdFx0PGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gKGNsaWNrKT1cIm9uQnV0dG9uQ2xpY2tlZChub2RlLmlkLCAnZWRpdCcpXCI+XHJcblx0XHRcdDxtYXQtaWNvbj5lZGl0PC9tYXQtaWNvbj5cclxuXHRcdDwvYnV0dG9uPlxyXG5cclxuXHQ8L21hdC10cmVlLW5vZGU+XHJcblxyXG5cdDxtYXQtdHJlZS1ub2RlICptYXRUcmVlTm9kZURlZj1cImxldCBub2RlO3doZW46IGhhc0NoaWxkXCIgbWF0VHJlZU5vZGVQYWRkaW5nICBkcmFnZ2FibGU9XCJ0cnVlXCJcclxuXHQoZHJhZ3N0YXJ0KT1cImhhbmRsZURyYWdTdGFydCgkZXZlbnQsIG5vZGUpO1wiIFx0KGRyYWdvdmVyKT1cImhhbmRsZURyYWdPdmVyKCRldmVudCwgbm9kZSk7XCJcclxuXHQoZHJvcCk9XCJoYW5kbGVEcm9wKCRldmVudCwgbm9kZSk7XCIgXHQoZHJhZ2VuZCk9XCJoYW5kbGVEcmFnRW5kKCRldmVudCk7XCIgICAgICAgICAgICAgICAgICBcclxuXHQgW25nQ2xhc3NdPVwieydkcm9wLWFib3ZlJzogZHJhZ05vZGVFeHBhbmRPdmVyQXJlYSA9PT0gJ2Fib3ZlJyAmJiBkcmFnTm9kZUV4cGFuZE92ZXJOb2RlID09PSBub2RlLFxyXG5cdCdkcm9wLWJlbG93JzogZHJhZ05vZGVFeHBhbmRPdmVyQXJlYSA9PT0gJ2JlbG93JyAmJiBkcmFnTm9kZUV4cGFuZE92ZXJOb2RlID09PSBub2RlLFxyXG5cdCdkcm9wLWNlbnRlcic6IGRyYWdOb2RlRXhwYW5kT3ZlckFyZWEgPT09ICdjZW50ZXInICYmIGRyYWdOb2RlRXhwYW5kT3Zlck5vZGUgPT09IG5vZGV9XCI+XHJcblx0XHQ8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiBtYXRUcmVlTm9kZVRvZ2dsZSAoY2xpY2spPVwiZXhwYW5zaW9uTW9kZWwudG9nZ2xlKG5vZGUuaWQpXCJcclxuXHRcdFx0W2F0dHIuYXJpYS1sYWJlbF09XCIndG9nZ2xlICcgKyBub2RlLm5hbWVcIj5cclxuXHRcdFx0PG1hdC1pY29uIGNsYXNzPVwibWF0LWljb24tcnRsLW1pcnJvclwiPlxyXG5cdFx0XHRcdHt7dHJlZUNvbnRyb2wuaXNFeHBhbmRlZChub2RlKSA/ICdleHBhbmRfbW9yZScgOiAnY2hldnJvbl9yaWdodCd9fVxyXG5cdFx0XHQ8L21hdC1pY29uPlxyXG5cdFx0PC9idXR0b24+XHJcblx0XHQ8bWF0LWljb24gY2xhc3M9XCJ0eXBlLWljb25cIiBbYXR0ci5hcmlhLWxhYmVsXT1cIm5vZGUudHlwZSArICdpY29uJ1wiPlxyXG5cdFx0XHRmb2xkZXJcclxuXHRcdDwvbWF0LWljb24+XHJcblx0XHR7e25vZGUubmFtZX19XHJcblx0XHQ8YnV0dG9uICpuZ0lmPVwibm9kZS50eXBlID09PSdmb2xkZXInXCIgKGNsaWNrKT1cIm9uQnV0dG9uQ2xpY2tlZChub2RlLmlkLCAnbmV3Rm9sZGVyJylcIiBtYXQtaWNvbi1idXR0b24+XHJcblx0XHRcdDxtYXQtaWNvbj5jcmVhdGVfbmV3X2ZvbGRlcjwvbWF0LWljb24+XHJcblx0XHQ8L2J1dHRvbj5cclxuXHRcdDxidXR0b24gKm5nSWY9XCJub2RlLnR5cGUgPT09J2ZvbGRlcidcIiAoY2xpY2spPVwib25CdXR0b25DbGlja2VkKG5vZGUuaWQsICduZXdOb2RlJylcIiBtYXQtaWNvbi1idXR0b24+XHJcblx0XHRcdDxtYXQtaWNvbj5wbGF5bGlzdF9hZGQ8L21hdC1pY29uPlxyXG5cdFx0PC9idXR0b24+XHJcblx0XHQ8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiAoY2xpY2spPVwib25CdXR0b25DbGlja2VkKG5vZGUuaWQsICdkZWxldGUnKVwiPlxyXG5cdFx0XHQ8bWF0LWljb24+ZGVsZXRlPC9tYXQtaWNvbj5cclxuXHRcdDwvYnV0dG9uPlxyXG5cdFx0PGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gKGNsaWNrKT1cIm9uQnV0dG9uQ2xpY2tlZChub2RlLmlkLCAnZWRpdCcpXCI+XHJcblx0XHRcdDxtYXQtaWNvbj5lZGl0PC9tYXQtaWNvbj5cclxuXHRcdDwvYnV0dG9uPlxyXG5cdFx0XHJcblx0PC9tYXQtdHJlZS1ub2RlPlxyXG48L21hdC10cmVlPlxyXG5cclxuPHNwYW4gI2VtcHR5SXRlbT48L3NwYW4+XHJcbiJdfQ==