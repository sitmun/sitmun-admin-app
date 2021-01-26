import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Injectable, Input, Output } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/tree";
import * as i2 from "@angular/cdk/drag-drop";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/common";
import * as i5 from "@angular/material/icon";
function DataTreeComponent_mat_tree_node_1_mat_icon_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-icon", 8);
    i0.ɵɵtext(1, " folder ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const node_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵattribute("aria-label", node_r2.type + "icon");
} }
function DataTreeComponent_mat_tree_node_1_button_4_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 7);
    i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_button_4_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r9); const node_r2 = i0.ɵɵnextContext().$implicit; const ctx_r7 = i0.ɵɵnextContext(); return ctx_r7.onButtonClicked(node_r2.id, "newFolder"); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "create_new_folder");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_1_button_5_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 7);
    i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_button_5_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r12); const node_r2 = i0.ɵɵnextContext().$implicit; const ctx_r10 = i0.ɵɵnextContext(); return ctx_r10.onButtonClicked(node_r2.id, "newNode"); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "playlist_add");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_1_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-tree-node", 3);
    i0.ɵɵlistener("mouseenter", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_mouseenter_0_listener() { i0.ɵɵrestoreView(_r14); const node_r2 = ctx.$implicit; const ctx_r13 = i0.ɵɵnextContext(); return ctx_r13.dragHover(node_r2); })("mouseleave", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_mouseleave_0_listener() { i0.ɵɵrestoreView(_r14); const ctx_r15 = i0.ɵɵnextContext(); return ctx_r15.dragHoverEnd(); })("cdkDragStarted", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_cdkDragStarted_0_listener() { i0.ɵɵrestoreView(_r14); const ctx_r16 = i0.ɵɵnextContext(); return ctx_r16.dragStart(); })("cdkDragReleased", function DataTreeComponent_mat_tree_node_1_Template_mat_tree_node_cdkDragReleased_0_listener() { i0.ɵɵrestoreView(_r14); const ctx_r17 = i0.ɵɵnextContext(); return ctx_r17.dragEnd(); });
    i0.ɵɵelement(1, "button", 4);
    i0.ɵɵtemplate(2, DataTreeComponent_mat_tree_node_1_mat_icon_2_Template, 2, 1, "mat-icon", 5);
    i0.ɵɵtext(3);
    i0.ɵɵtemplate(4, DataTreeComponent_mat_tree_node_1_button_4_Template, 3, 0, "button", 6);
    i0.ɵɵtemplate(5, DataTreeComponent_mat_tree_node_1_button_5_Template, 3, 0, "button", 6);
    i0.ɵɵelementStart(6, "button", 7);
    i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_1_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r14); const node_r2 = ctx.$implicit; const ctx_r18 = i0.ɵɵnextContext(); return ctx_r18.onButtonClicked(node_r2.id, "edit"); });
    i0.ɵɵelementStart(7, "mat-icon");
    i0.ɵɵtext(8, "edit");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const node_r2 = ctx.$implicit;
    i0.ɵɵproperty("cdkDragData", node_r2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", node_r2.type === "folder");
    i0.ɵɵadvance(1);
    i0.ɵɵtextInterpolate1(" ", node_r2.name, " ");
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", node_r2.type === "folder");
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", node_r2.type === "folder");
} }
function DataTreeComponent_mat_tree_node_2_button_7_Template(rf, ctx) { if (rf & 1) {
    const _r24 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 7);
    i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_button_7_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r24); const node_r19 = i0.ɵɵnextContext().$implicit; const ctx_r22 = i0.ɵɵnextContext(); return ctx_r22.onButtonClicked(node_r19.id, "newFolder"); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "create_new_folder");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_2_button_8_Template(rf, ctx) { if (rf & 1) {
    const _r27 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 7);
    i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_button_8_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r27); const node_r19 = i0.ɵɵnextContext().$implicit; const ctx_r25 = i0.ɵɵnextContext(); return ctx_r25.onButtonClicked(node_r19.id, "newNode"); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "playlist_add");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} }
function DataTreeComponent_mat_tree_node_2_Template(rf, ctx) { if (rf & 1) {
    const _r29 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-tree-node", 9);
    i0.ɵɵlistener("mouseenter", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_mouseenter_0_listener() { i0.ɵɵrestoreView(_r29); const node_r19 = ctx.$implicit; const ctx_r28 = i0.ɵɵnextContext(); return ctx_r28.dragHover(node_r19); })("mouseleave", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_mouseleave_0_listener() { i0.ɵɵrestoreView(_r29); const ctx_r30 = i0.ɵɵnextContext(); return ctx_r30.dragHoverEnd(); })("cdkDragStarted", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_cdkDragStarted_0_listener() { i0.ɵɵrestoreView(_r29); const ctx_r31 = i0.ɵɵnextContext(); return ctx_r31.dragStart(); })("cdkDragReleased", function DataTreeComponent_mat_tree_node_2_Template_mat_tree_node_cdkDragReleased_0_listener() { i0.ɵɵrestoreView(_r29); const ctx_r32 = i0.ɵɵnextContext(); return ctx_r32.dragEnd(); });
    i0.ɵɵelementStart(1, "button", 10);
    i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r29); const node_r19 = ctx.$implicit; const ctx_r33 = i0.ɵɵnextContext(); return ctx_r33.expansionModel.toggle(node_r19.id); });
    i0.ɵɵelementStart(2, "mat-icon", 11);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "mat-icon", 8);
    i0.ɵɵtext(5, " folder ");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(6);
    i0.ɵɵtemplate(7, DataTreeComponent_mat_tree_node_2_button_7_Template, 3, 0, "button", 6);
    i0.ɵɵtemplate(8, DataTreeComponent_mat_tree_node_2_button_8_Template, 3, 0, "button", 6);
    i0.ɵɵelementStart(9, "button", 7);
    i0.ɵɵlistener("click", function DataTreeComponent_mat_tree_node_2_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r29); const node_r19 = ctx.$implicit; const ctx_r34 = i0.ɵɵnextContext(); return ctx_r34.onButtonClicked(node_r19.id, "edit"); });
    i0.ɵɵelementStart(10, "mat-icon");
    i0.ɵɵtext(11, "edit");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const node_r19 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("cdkDragData", node_r19);
    i0.ɵɵadvance(1);
    i0.ɵɵattribute("aria-label", "toggle " + node_r19.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.treeControl.isExpanded(node_r19) ? "expand_more" : "chevron_right", " ");
    i0.ɵɵadvance(1);
    i0.ɵɵattribute("aria-label", node_r19.type + "icon");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", node_r19.name, " ");
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", node_r19.type === "folder");
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("ngIf", node_r19.type === "folder");
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
        this.transformer = (node, level) => {
            if (node.children.length != 0) {
                return new FileFlatNode(!!node.children, node.name, level, node.type, node.id);
            }
            else {
                return new FileFlatNode(!!undefined, node.name, level, node.type, node.id);
            }
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
    /**
     * Handle the drop - here we rearrange the data based on the drop event,
     * then rebuild the tree.
     * */
    drop(event) {
        // console.log('origin/destination', event.previousIndex, event.currentIndex);
        // ignore drops outside of the tree
        if (!event.isPointerOverContainer)
            return;
        // construct a list of visible nodes, this will match the DOM.
        // the cdkDragDrop event.currentIndex jives with visible nodes.
        // it calls rememberExpandedTreeNodes to persist expand state
        const visibleNodes = this.visibleNodes();
        // deep clone the data source so we can mutate it
        const changedData = JSON.parse(JSON.stringify(this.dataSource.data));
        // recursive find function to find siblings of node
        // determine where to insert the node
        const nodeAtDest = visibleNodes[event.currentIndex];
        const newSiblings = this.findNodeSiblings(changedData[0].children, nodeAtDest.id);
        if (!newSiblings)
            return;
        const insertIndex = newSiblings.findIndex(s => s.id === nodeAtDest.id) - 1;
        // remove the node from its old place
        const node = event.item.data;
        const siblings = this.findNodeSiblings(changedData[0].children, node.id);
        const siblingIndex = siblings.findIndex(n => n.id === node.id) - 1;
        const nodeToInsertObj = siblings.splice(siblingIndex, 1)[0];
        nodeToInsertObj.status = "Modified";
        const nodeToInsert = siblings.splice(siblingIndex, 1)[0];
        if (nodeAtDest.id === nodeToInsert.id)
            return;
        // ensure validity of drop - must be same level
        const nodeAtDestFlatNode = this.treeControl.dataNodes.find((n) => nodeAtDest.id === n.id);
        if (this.validateDrop && nodeAtDestFlatNode.level !== node.level) {
            alert('Items can only be moved within the same level.');
            return;
        }
        // insert node 
        newSiblings.splice(insertIndex, 0, nodeToInsert);
        // rebuild tree with mutated data
        this.rebuildTreeForData(changedData);
    }
    /**
     * Experimental - opening tree nodes as you drag over them
     */
    dragStart() {
        this.dragging = true;
    }
    dragEnd() {
        this.dragging = false;
    }
    dragHover(node) {
        if (this.dragging) {
            clearTimeout(this.expandTimeout);
            this.expandTimeout = setTimeout(() => {
                this.treeControl.expand(node);
            }, this.expandDelay);
        }
    }
    dragHoverEnd() {
        if (this.dragging) {
            clearTimeout(this.expandTimeout);
        }
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
        if (button === 'edit') {
            this.emitNode.emit(siblings.find(node => node.id === id));
        }
        else if (button === 'newFolder') {
            this.createFolder.emit(siblings.find(node => node.id === id));
        }
        else if (button === 'newNode') {
            this.createNode.emit(siblings.find(node => node.id === id));
        }
    }
    emitAllRows() {
        const dataToEmit = JSON.parse(JSON.stringify(this.dataSource.data));
        let allRows = this.getChildren(dataToEmit);
        this.emitAllNodes.emit(allRows);
    }
    getChildren(arr) {
        let result = [];
        let subResult;
        arr.forEach((item, i) => {
            if (item.children.length > 0) {
                subResult = this.getChildren(item.children);
                if (subResult)
                    result.push(...subResult);
            }
            result.push(item);
        });
        return result;
    }
}
/** @nocollapse */ DataTreeComponent.ɵfac = function DataTreeComponent_Factory(t) { return new (t || DataTreeComponent)(i0.ɵɵdirectiveInject(FileDatabase)); };
/** @nocollapse */ DataTreeComponent.ɵcmp = i0.ɵɵdefineComponent({ type: DataTreeComponent, selectors: [["app-data-tree"]], inputs: { eventNodeUpdatedSubscription: "eventNodeUpdatedSubscription", eventCreateNodeSubscription: "eventCreateNodeSubscription", eventGetAllRowsSubscription: "eventGetAllRowsSubscription", getAll: "getAll" }, outputs: { createNode: "createNode", createFolder: "createFolder", emitNode: "emitNode", emitAllNodes: "emitAllNodes" }, features: [i0.ɵɵProvidersFeature([FileDatabase])], decls: 3, vars: 3, consts: [["cdkDropList", "", 3, "dataSource", "treeControl", "cdkDropListDropped"], ["matTreeNodeToggle", "", "matTreeNodePadding", "", "cdkDrag", "", 3, "cdkDragData", "mouseenter", "mouseleave", "cdkDragStarted", "cdkDragReleased", 4, "matTreeNodeDef"], ["matTreeNodePadding", "", "cdkDrag", "", 3, "cdkDragData", "mouseenter", "mouseleave", "cdkDragStarted", "cdkDragReleased", 4, "matTreeNodeDef", "matTreeNodeDefWhen"], ["matTreeNodeToggle", "", "matTreeNodePadding", "", "cdkDrag", "", 3, "cdkDragData", "mouseenter", "mouseleave", "cdkDragStarted", "cdkDragReleased"], ["mat-icon-button", "", "disabled", ""], ["class", "type-icon", 4, "ngIf"], ["mat-icon-button", "", 3, "click", 4, "ngIf"], ["mat-icon-button", "", 3, "click"], [1, "type-icon"], ["matTreeNodePadding", "", "cdkDrag", "", 3, "cdkDragData", "mouseenter", "mouseleave", "cdkDragStarted", "cdkDragReleased"], ["mat-icon-button", "", "matTreeNodeToggle", "", 3, "click"], [1, "mat-icon-rtl-mirror"]], template: function DataTreeComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "mat-tree", 0);
        i0.ɵɵlistener("cdkDropListDropped", function DataTreeComponent_Template_mat_tree_cdkDropListDropped_0_listener($event) { return ctx.drop($event); });
        i0.ɵɵtemplate(1, DataTreeComponent_mat_tree_node_1_Template, 9, 5, "mat-tree-node", 1);
        i0.ɵɵtemplate(2, DataTreeComponent_mat_tree_node_2_Template, 12, 7, "mat-tree-node", 2);
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵproperty("dataSource", ctx.dataSource)("treeControl", ctx.treeControl);
        i0.ɵɵadvance(2);
        i0.ɵɵproperty("matTreeNodeDefWhen", ctx.hasChild);
    } }, directives: [i1.MatTree, i2.CdkDropList, i1.MatTreeNodeDef, i1.MatTreeNode, i1.MatTreeNodeToggle, i1.MatTreeNodePadding, i2.CdkDrag, i3.MatButton, i4.NgIf, i5.MatIcon], styles: [".mat-tree-node[_ngcontent-%COMP%]{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;cursor:move;user-select:none}.mat-tree-node.cdk-drag-preview[_ngcontent-%COMP%]{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-tree-node.cdk-drag-placeholder[_ngcontent-%COMP%]{opacity:0}.cdk-drop-list-dragging[_ngcontent-%COMP%]   .mat-tree-node[_ngcontent-%COMP%]:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.cdk-drag-animating[_ngcontent-%COMP%]{transition:transform .2s cubic-bezier(0,0,.2,1)}"] });
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
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS10cmVlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGF0YS10cmVlL2RhdGEtdHJlZS5jb21wb25lbnQudHMiLCJkYXRhLXRyZWUvZGF0YS10cmVlLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRixPQUFPLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBRSxFQUFFLElBQUksWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRXZFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7Ozs7Ozs7SUNBeEQsbUNBQ0M7SUFBQSx3QkFDRDtJQUFBLGlCQUFXOzs7SUFGK0MsbURBQXNDOzs7O0lBSWhHLGlDQUNDO0lBRHFDLGtRQUFrQyxXQUFXLEtBQUU7SUFDcEYsZ0NBQVU7SUFBQSxpQ0FBaUI7SUFBQSxpQkFBVztJQUN2QyxpQkFBUzs7OztJQUNULGlDQUNDO0lBRHFDLHFRQUFrQyxTQUFTLEtBQUU7SUFDbEYsZ0NBQVU7SUFBQSw0QkFBWTtJQUFBLGlCQUFXO0lBQ2xDLGlCQUFTOzs7O0lBYlYsd0NBR0M7SUFGQSx3UEFBOEIsd01BQUEsNk1BQUEsNk1BQUE7SUFFOUIsNEJBQTBDO0lBQzFDLDRGQUNDO0lBRUQsWUFDQTtJQUFBLHdGQUNDO0lBRUQsd0ZBQ0M7SUFFRCxpQ0FDQztJQUR1Qiw2T0FBa0MsTUFBTSxLQUFFO0lBQ2pFLGdD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TyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7cUdBdFRVLGlCQUFpQix1QkF3QkMsWUFBWTt5RUF4QjlCLGlCQUFpQixnWkFGakIsQ0FBQyxZQUFZLENBQUM7UUNqRzNCLG1DQUNDO1FBRDJFLGdJQUFzQixnQkFBWSxJQUFDO1FBQzlHLHNGQUdDO1FBZ0JELHVGQUdDO1FBb0JGLGlCQUFXOztRQTNDRCwyQ0FBeUIsZ0NBQUE7UUFvQm5CLGVBQXlDO1FBQXpDLGlEQUF5Qzs7a0REK0U1QyxpQkFBaUI7Y0FON0IsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSxlQUFlO2dCQUN6QixXQUFXLEVBQUUsMEJBQTBCO2dCQUN2QyxTQUFTLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQztnQkFDdkMsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDO2FBQzFCO3NDQXlCOEIsWUFBWSxVQXZCL0IsVUFBVTtrQkFBbkIsTUFBTTtZQUNHLFlBQVk7a0JBQXJCLE1BQU07WUFDRyxRQUFRO2tCQUFqQixNQUFNO1lBQ0csWUFBWTtrQkFBckIsTUFBTTtZQUNFLDRCQUE0QjtrQkFBcEMsS0FBSztZQUNHLDJCQUEyQjtrQkFBbkMsS0FBSztZQUNHLDJCQUEyQjtrQkFBbkMsS0FBSztZQWVHLE1BQU07a0JBQWQsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZsYXRUcmVlQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdGFibGUsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTWF0VHJlZUZsYXREYXRhU291cmNlLCBNYXRUcmVlRmxhdHRlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvdHJlZSc7XHJcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgb2YgYXMgb2JzZXJ2YWJsZU9mIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IENka0RyYWdEcm9wIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2RyYWctZHJvcCc7XHJcbmltcG9ydCB7IFNlbGVjdGlvbk1vZGVsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcclxuXHJcbi8qKlxyXG4gKiBGaWxlIG5vZGUgZGF0YSB3aXRoIG5lc3RlZCBzdHJ1Y3R1cmUuXHJcbiAqIEVhY2ggbm9kZSBoYXMgYSBuYW1lLCBhbmQgYSB0eXBlIG9yIGEgbGlzdCBvZiBjaGlsZHJlbi5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBGaWxlTm9kZSB7XHJcbiAgaWQ6IHN0cmluZztcclxuICBjaGlsZHJlbjogRmlsZU5vZGVbXTtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgdHlwZTogYW55O1xyXG59XHJcblxyXG4vKiogRmxhdCBub2RlIHdpdGggZXhwYW5kYWJsZSBhbmQgbGV2ZWwgaW5mb3JtYXRpb24gKi9cclxuZXhwb3J0IGNsYXNzIEZpbGVGbGF0Tm9kZSB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwdWJsaWMgZXhwYW5kYWJsZTogYm9vbGVhbixcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcsXHJcbiAgICBwdWJsaWMgbGV2ZWw6IG51bWJlcixcclxuICAgIHB1YmxpYyB0eXBlOiBhbnksXHJcbiAgICBwdWJsaWMgaWQ6IHN0cmluZ1xyXG4gICkgeyB9XHJcbn1cclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIEZpbGUgZGF0YWJhc2UsIGl0IGNhbiBidWlsZCBhIHRyZWUgc3RydWN0dXJlZCBKc29uIG9iamVjdCBmcm9tIHN0cmluZy5cclxuICogRWFjaCBub2RlIGluIEpzb24gb2JqZWN0IHJlcHJlc2VudHMgYSBmaWxlIG9yIGEgZGlyZWN0b3J5LiBGb3IgYSBmaWxlLCBpdCBoYXMgbmFtZSBhbmQgdHlwZS5cclxuICogRm9yIGEgZGlyZWN0b3J5LCBpdCBoYXMgbmFtZSBhbmQgY2hpbGRyZW4gKGEgbGlzdCBvZiBmaWxlcyBvciBkaXJlY3RvcmllcykuXHJcbiAqIFRoZSBpbnB1dCB3aWxsIGJlIGEganNvbiBvYmplY3Qgc3RyaW5nLCBhbmQgdGhlIG91dHB1dCBpcyBhIGxpc3Qgb2YgYEZpbGVOb2RlYCB3aXRoIG5lc3RlZFxyXG4gKiBzdHJ1Y3R1cmUuXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBGaWxlRGF0YWJhc2Uge1xyXG4gIGRhdGFDaGFuZ2UgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEZpbGVOb2RlW10+KFtdKTtcclxuICBnZXQgZGF0YSgpOiBGaWxlTm9kZVtdIHsgcmV0dXJuIHRoaXMuZGF0YUNoYW5nZS52YWx1ZTsgfVxyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgfVxyXG5cclxuICBpbml0aWFsaXplKGRhdGFPYmopIHtcclxuXHJcbiAgICAvLyBCdWlsZCB0aGUgdHJlZSBub2RlcyBmcm9tIEpzb24gb2JqZWN0LiBUaGUgcmVzdWx0IGlzIGEgbGlzdCBvZiBgRmlsZU5vZGVgIHdpdGggbmVzdGVkXHJcbiAgICAvLyAgICAgZmlsZSBub2RlIGFzIGNoaWxkcmVuLlxyXG4gICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRGaWxlVHJlZShkYXRhT2JqLCAwKTtcclxuXHJcbiAgICAvLyBOb3RpZnkgdGhlIGNoYW5nZS5cclxuICAgIHRoaXMuZGF0YUNoYW5nZS5uZXh0KGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQnVpbGQgdGhlIGZpbGUgc3RydWN0dXJlIHRyZWUuIFRoZSBgdmFsdWVgIGlzIHRoZSBKc29uIG9iamVjdCwgb3IgYSBzdWItdHJlZSBvZiBhIEpzb24gb2JqZWN0LlxyXG4gICAqIFRoZSByZXR1cm4gdmFsdWUgaXMgdGhlIGxpc3Qgb2YgYEZpbGVOb2RlYC5cclxuICAgKi9cclxuICBidWlsZEZpbGVUcmVlKGFycmF5VHJlZU5vZGVzOiBhbnlbXSwgbGV2ZWw6IG51bWJlciwgcGFyZW50SWQ6IHN0cmluZyA9ICcwJyk6IEZpbGVOb2RlW10ge1xyXG4gICAgdmFyIG1hcCA9IHt9O1xyXG4gICAgYXJyYXlUcmVlTm9kZXMuZm9yRWFjaCgodHJlZU5vZGUpID0+IHtcclxuICAgICAgdmFyIG9iaiA9IHRyZWVOb2RlO1xyXG4gICAgICBvYmouY2hpbGRyZW4gPSBbXTtcclxuICAgICAgb2JqLnR5cGU9ICh0cmVlTm9kZS5pc0ZvbGRlcik/IFwiZm9sZGVyXCIgOiBcIm5vZGVcIjtcclxuXHJcbiAgICAgIGlmKCFtYXBbb2JqLmlkXSkge21hcFtvYmouaWRdID0gb2JqO31cclxuICAgICAgZWxzZXtcclxuICAgICAgICBsZXQgcHJldmlvdXNDaGlsZHJlbj0gbWFwW29iai5pZF0uY2hpbGRyZW5cclxuICAgICAgICBtYXBbb2JqLmlkXSA9IG9iajtcclxuICAgICAgICBtYXBbb2JqLmlkXS5jaGlsZHJlbj1wcmV2aW91c0NoaWxkcmVuXHJcbiAgICAgIH1cclxuICAgICAgdmFyIHBhcmVudCA9IG9iai5wYXJlbnQgfHwgJ3Jvb3QnO1xyXG4gICAgICBpZiAoIW1hcFtwYXJlbnRdKSB7XHJcbiAgICAgICAgbWFwW3BhcmVudF0gPSB7XHJcbiAgICAgICAgICBjaGlsZHJlbjogW11cclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICAgIG1hcFtwYXJlbnRdLmNoaWxkcmVuLnB1c2gob2JqKTtcclxuICAgIH0pO1xyXG4gICAgbWFwWydyb290J10udHlwZT0nZm9sZGVyJztcclxuICAgIG1hcFsncm9vdCddLm5hbWU9J1Jvb3QnO1xyXG4gICAgbWFwWydyb290J10uaXNGb2xkZXI9dHJ1ZTtcclxuXHJcbiAgICByZXR1cm4gbWFwWydyb290J107XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQHRpdGxlIFRyZWUgd2l0aCBmbGF0IG5vZGVzXHJcbiAqL1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1kYXRhLXRyZWUnLFxyXG4gIHRlbXBsYXRlVXJsOiAnZGF0YS10cmVlLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnZGF0YS10cmVlLmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgcHJvdmlkZXJzOiBbRmlsZURhdGFiYXNlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGF0YVRyZWVDb21wb25lbnQge1xyXG4gIEBPdXRwdXQoKSBjcmVhdGVOb2RlOiBFdmVudEVtaXR0ZXI8YW55PjtcclxuICBAT3V0cHV0KCkgY3JlYXRlRm9sZGVyOiBFdmVudEVtaXR0ZXI8YW55PjtcclxuICBAT3V0cHV0KCkgZW1pdE5vZGU6IEV2ZW50RW1pdHRlcjxhbnk+O1xyXG4gIEBPdXRwdXQoKSBlbWl0QWxsTm9kZXM6IEV2ZW50RW1pdHRlcjxhbnk+O1xyXG4gIEBJbnB1dCgpIGV2ZW50Tm9kZVVwZGF0ZWRTdWJzY3JpcHRpb246IE9ic2VydmFibGUgPGFueT4gO1xyXG4gIEBJbnB1dCgpIGV2ZW50Q3JlYXRlTm9kZVN1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZSA8YW55PiA7XHJcbiAgQElucHV0KCkgZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlIDxhbnk+IDtcclxuICBwcml2YXRlIF9ldmVudE5vZGVVcGRhdGVkU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgcHJpdmF0ZSBfZXZlbnRDcmVhdGVOb2RlU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgcHJpdmF0ZSBfZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgdHJlZUNvbnRyb2w6IEZsYXRUcmVlQ29udHJvbDxGaWxlRmxhdE5vZGU+O1xyXG4gIHRyZWVGbGF0dGVuZXI6IE1hdFRyZWVGbGF0dGVuZXI8RmlsZU5vZGUsIEZpbGVGbGF0Tm9kZT47XHJcbiAgZGF0YVNvdXJjZTogTWF0VHJlZUZsYXREYXRhU291cmNlPEZpbGVOb2RlLCBGaWxlRmxhdE5vZGU+O1xyXG4gIC8vIGV4cGFuc2lvbiBtb2RlbCB0cmFja3MgZXhwYW5zaW9uIHN0YXRlXHJcbiAgZXhwYW5zaW9uTW9kZWwgPSBuZXcgU2VsZWN0aW9uTW9kZWw8c3RyaW5nPih0cnVlKTtcclxuICBkcmFnZ2luZyA9IGZhbHNlO1xyXG4gIGV4cGFuZFRpbWVvdXQ6IGFueTtcclxuICBleHBhbmREZWxheSA9IDEwMDA7XHJcbiAgdmFsaWRhdGVEcm9wID0gZmFsc2U7XHJcbiAgdHJlZURhdGE6IGFueTtcclxuXHJcbiAgQElucHV0KCkgZ2V0QWxsOiAoKSA9PiBPYnNlcnZhYmxlPGFueT47XHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkYXRhYmFzZTogRmlsZURhdGFiYXNlKSB7XHJcbiAgICB0aGlzLmVtaXROb2RlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5jcmVhdGVOb2RlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5jcmVhdGVGb2xkZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmVtaXRBbGxOb2RlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMudHJlZUZsYXR0ZW5lciA9IG5ldyBNYXRUcmVlRmxhdHRlbmVyKHRoaXMudHJhbnNmb3JtZXIsIHRoaXMuX2dldExldmVsLFxyXG4gICAgICB0aGlzLl9pc0V4cGFuZGFibGUsIHRoaXMuX2dldENoaWxkcmVuKTtcclxuICAgIHRoaXMudHJlZUNvbnRyb2wgPSBuZXcgRmxhdFRyZWVDb250cm9sPEZpbGVGbGF0Tm9kZT4odGhpcy5fZ2V0TGV2ZWwsIHRoaXMuX2lzRXhwYW5kYWJsZSk7XHJcbiAgICB0aGlzLmRhdGFTb3VyY2UgPSBuZXcgTWF0VHJlZUZsYXREYXRhU291cmNlKHRoaXMudHJlZUNvbnRyb2wsIHRoaXMudHJlZUZsYXR0ZW5lcik7XHJcbiBcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCl7XHJcblxyXG4gICAgaWYodGhpcy5ldmVudE5vZGVVcGRhdGVkU3Vic2NyaXB0aW9uKVxyXG4gICAge1xyXG4gICAgICB0aGlzLmV2ZW50Tm9kZVVwZGF0ZWRTdWJzY3JpcHRpb24uc3Vic2NyaWJlKFxyXG4gICAgICAgIChub2RlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZU5vZGUobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmV2ZW50Q3JlYXRlTm9kZVN1YnNjcmlwdGlvbilcclxuICAgIHtcclxuICAgICAgdGhpcy5ldmVudENyZWF0ZU5vZGVTdWJzY3JpcHRpb24uc3Vic2NyaWJlKFxyXG4gICAgICAgIChub2RlKSA9PiB7XHJcbiAgICAgICAgICBpZihub2RlLmlzRm9sZGVyKSB0aGlzLmNyZWF0ZU5ld0ZvbGRlcihub2RlKTtcclxuICAgICAgICAgIGVsc2UgdGhpcy5jcmVhdGVOZXdOb2RlKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmV2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLl9ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbi5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZW1pdEFsbFJvd3MoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRoaXMuZ2V0QWxsKClcclxuICAgIC5zdWJzY3JpYmUoKGl0ZW1zKSA9PiB7XHJcbiAgICAgIHRoaXMudHJlZURhdGEgPSBpdGVtcztcclxuICAgICAgdGhpcy5kYXRhYmFzZS5pbml0aWFsaXplKHRoaXMudHJlZURhdGEpO1xyXG4gICAgICB0aGlzLmRhdGFiYXNlLmRhdGFDaGFuZ2Uuc3Vic2NyaWJlKGRhdGEgPT4gdGhpcy5yZWJ1aWxkVHJlZUZvckRhdGEoW2RhdGFdKSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICB0cmFuc2Zvcm1lciA9IChub2RlOiBGaWxlTm9kZSwgbGV2ZWw6IG51bWJlcikgPT4ge1xyXG4gICAgaWYobm9kZS5jaGlsZHJlbi5sZW5ndGghPTApe1xyXG4gICAgICByZXR1cm4gbmV3IEZpbGVGbGF0Tm9kZSghIW5vZGUuY2hpbGRyZW4sIG5vZGUubmFtZSwgbGV2ZWwsIG5vZGUudHlwZSwgbm9kZS5pZCk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgcmV0dXJuIG5ldyBGaWxlRmxhdE5vZGUoISF1bmRlZmluZWQsIG5vZGUubmFtZSwgbGV2ZWwsIG5vZGUudHlwZSwgbm9kZS5pZCk7XHJcbiAgICB9XHJcbiAgXHJcbiAgfVxyXG4gIHByaXZhdGUgX2dldExldmVsID0gKG5vZGU6IEZpbGVGbGF0Tm9kZSkgPT4gbm9kZS5sZXZlbDtcclxuICBwcml2YXRlIF9pc0V4cGFuZGFibGUgPSAobm9kZTogRmlsZUZsYXROb2RlKSA9PiBub2RlLmV4cGFuZGFibGU7XHJcbiAgcHJpdmF0ZSBfZ2V0Q2hpbGRyZW4gPSAobm9kZTogRmlsZU5vZGUpOiBPYnNlcnZhYmxlPEZpbGVOb2RlW10+ID0+IG9ic2VydmFibGVPZihub2RlLmNoaWxkcmVuKTtcclxuICBoYXNDaGlsZCA9IChfOiBudW1iZXIsIF9ub2RlRGF0YTogRmlsZUZsYXROb2RlKSA9PiBfbm9kZURhdGEuZXhwYW5kYWJsZTtcclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIFRoaXMgY29uc3RydWN0cyBhbiBhcnJheSBvZiBub2RlcyB0aGF0IG1hdGNoZXMgdGhlIERPTVxyXG4gICAqL1xyXG4gIHZpc2libGVOb2RlcygpOiBGaWxlTm9kZVtdIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFkZEV4cGFuZGVkQ2hpbGRyZW4obm9kZTogRmlsZU5vZGUsIGV4cGFuZGVkOiBzdHJpbmdbXSkge1xyXG4gICAgICByZXN1bHQucHVzaChub2RlKTtcclxuICAgICAgaWYgKGV4cGFuZGVkLmluZGV4T2Yobm9kZS5pZCkgIT0gLTEpIHtcclxuICAgICAgICBub2RlLmNoaWxkcmVuLm1hcCgoY2hpbGQpID0+IGFkZEV4cGFuZGVkQ2hpbGRyZW4oY2hpbGQsIGV4cGFuZGVkKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuZGF0YVNvdXJjZS5kYXRhLmZvckVhY2goKG5vZGUpID0+IHtcclxuICAgICAgYWRkRXhwYW5kZWRDaGlsZHJlbihub2RlLCB0aGlzLmV4cGFuc2lvbk1vZGVsLnNlbGVjdGVkKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG5cclxuICAgZmluZE5vZGVTaWJsaW5ncyhhcnI6IEFycmF5PGFueT4sIGlkOiBzdHJpbmcpOiBBcnJheTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQsIHN1YlJlc3VsdDtcclxuICAgIGFyci5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLmlkID09PSBpZCkge1xyXG4gICAgICAgIHJlc3VsdCA9IGFycjtcclxuICAgICAgfSBlbHNlIGlmIChpdGVtLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgc3ViUmVzdWx0ID0gdGhpcy5maW5kTm9kZVNpYmxpbmdzKGl0ZW0uY2hpbGRyZW4sIGlkKTtcclxuICAgICAgICBpZiAoc3ViUmVzdWx0KSByZXN1bHQgPSBzdWJSZXN1bHQ7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlIHRoZSBkcm9wIC0gaGVyZSB3ZSByZWFycmFuZ2UgdGhlIGRhdGEgYmFzZWQgb24gdGhlIGRyb3AgZXZlbnQsXHJcbiAgICogdGhlbiByZWJ1aWxkIHRoZSB0cmVlLlxyXG4gICAqICovXHJcbiAgZHJvcChldmVudDogQ2RrRHJhZ0Ryb3A8c3RyaW5nW10+KSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnb3JpZ2luL2Rlc3RpbmF0aW9uJywgZXZlbnQucHJldmlvdXNJbmRleCwgZXZlbnQuY3VycmVudEluZGV4KTtcclxuXHJcbiAgICAvLyBpZ25vcmUgZHJvcHMgb3V0c2lkZSBvZiB0aGUgdHJlZVxyXG4gICAgaWYgKCFldmVudC5pc1BvaW50ZXJPdmVyQ29udGFpbmVyKSByZXR1cm47XHJcblxyXG4gICAgLy8gY29uc3RydWN0IGEgbGlzdCBvZiB2aXNpYmxlIG5vZGVzLCB0aGlzIHdpbGwgbWF0Y2ggdGhlIERPTS5cclxuICAgIC8vIHRoZSBjZGtEcmFnRHJvcCBldmVudC5jdXJyZW50SW5kZXggaml2ZXMgd2l0aCB2aXNpYmxlIG5vZGVzLlxyXG4gICAgLy8gaXQgY2FsbHMgcmVtZW1iZXJFeHBhbmRlZFRyZWVOb2RlcyB0byBwZXJzaXN0IGV4cGFuZCBzdGF0ZVxyXG4gICAgY29uc3QgdmlzaWJsZU5vZGVzID0gdGhpcy52aXNpYmxlTm9kZXMoKTtcclxuXHJcbiAgICAvLyBkZWVwIGNsb25lIHRoZSBkYXRhIHNvdXJjZSBzbyB3ZSBjYW4gbXV0YXRlIGl0XHJcbiAgICBjb25zdCBjaGFuZ2VkRGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhU291cmNlLmRhdGEpKTtcclxuXHJcbiAgICAvLyByZWN1cnNpdmUgZmluZCBmdW5jdGlvbiB0byBmaW5kIHNpYmxpbmdzIG9mIG5vZGVcclxuXHJcblxyXG4gICAgLy8gZGV0ZXJtaW5lIHdoZXJlIHRvIGluc2VydCB0aGUgbm9kZVxyXG4gICAgY29uc3Qgbm9kZUF0RGVzdCA9IHZpc2libGVOb2Rlc1tldmVudC5jdXJyZW50SW5kZXhdO1xyXG4gICAgY29uc3QgbmV3U2libGluZ3MgPSB0aGlzLmZpbmROb2RlU2libGluZ3MoY2hhbmdlZERhdGFbMF0uY2hpbGRyZW4sIG5vZGVBdERlc3QuaWQpO1xyXG4gICAgaWYgKCFuZXdTaWJsaW5ncykgcmV0dXJuO1xyXG4gICAgY29uc3QgaW5zZXJ0SW5kZXggPSBuZXdTaWJsaW5ncy5maW5kSW5kZXgocyA9PiBzLmlkID09PSBub2RlQXREZXN0LmlkKS0xO1xyXG5cclxuICAgIC8vIHJlbW92ZSB0aGUgbm9kZSBmcm9tIGl0cyBvbGQgcGxhY2VcclxuICAgIGNvbnN0IG5vZGUgPSBldmVudC5pdGVtLmRhdGE7XHJcbiAgICBjb25zdCBzaWJsaW5ncyA9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhjaGFuZ2VkRGF0YVswXS5jaGlsZHJlbiwgbm9kZS5pZCk7XHJcbiAgICBjb25zdCBzaWJsaW5nSW5kZXggPSBzaWJsaW5ncy5maW5kSW5kZXgobiA9PiBuLmlkID09PSBub2RlLmlkKS0xO1xyXG4gICAgY29uc3Qgbm9kZVRvSW5zZXJ0T2JqOiBhbnkgPSBzaWJsaW5ncy5zcGxpY2Uoc2libGluZ0luZGV4LCAxKVswXTtcclxuICAgIG5vZGVUb0luc2VydE9iai5zdGF0dXM9IFwiTW9kaWZpZWRcIjtcclxuXHJcbiAgICBjb25zdCBub2RlVG9JbnNlcnQ6IEZpbGVOb2RlID0gc2libGluZ3Muc3BsaWNlKHNpYmxpbmdJbmRleCwgMSlbMF07XHJcbiAgICBcclxuICAgIGlmIChub2RlQXREZXN0LmlkID09PSBub2RlVG9JbnNlcnQuaWQpIHJldHVybjtcclxuXHJcbiAgICAvLyBlbnN1cmUgdmFsaWRpdHkgb2YgZHJvcCAtIG11c3QgYmUgc2FtZSBsZXZlbFxyXG4gICAgY29uc3Qgbm9kZUF0RGVzdEZsYXROb2RlID0gdGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXMuZmluZCgobikgPT4gbm9kZUF0RGVzdC5pZCA9PT0gbi5pZCk7XHJcbiAgICBpZiAodGhpcy52YWxpZGF0ZURyb3AgJiYgbm9kZUF0RGVzdEZsYXROb2RlLmxldmVsICE9PSBub2RlLmxldmVsKSB7XHJcbiAgICAgIGFsZXJ0KCdJdGVtcyBjYW4gb25seSBiZSBtb3ZlZCB3aXRoaW4gdGhlIHNhbWUgbGV2ZWwuJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpbnNlcnQgbm9kZSBcclxuICAgIG5ld1NpYmxpbmdzLnNwbGljZShpbnNlcnRJbmRleCwgMCwgbm9kZVRvSW5zZXJ0KTtcclxuXHJcbiAgICAvLyByZWJ1aWxkIHRyZWUgd2l0aCBtdXRhdGVkIGRhdGFcclxuICAgIHRoaXMucmVidWlsZFRyZWVGb3JEYXRhKGNoYW5nZWREYXRhKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4cGVyaW1lbnRhbCAtIG9wZW5pbmcgdHJlZSBub2RlcyBhcyB5b3UgZHJhZyBvdmVyIHRoZW1cclxuICAgKi9cclxuICBkcmFnU3RhcnQoKSB7XHJcbiAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcclxuICB9XHJcbiAgZHJhZ0VuZCgpIHtcclxuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcclxuICB9XHJcbiAgZHJhZ0hvdmVyKG5vZGU6IEZpbGVGbGF0Tm9kZSkge1xyXG4gICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZXhwYW5kVGltZW91dCk7XHJcbiAgICAgIHRoaXMuZXhwYW5kVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMudHJlZUNvbnRyb2wuZXhwYW5kKG5vZGUpO1xyXG4gICAgICB9LCB0aGlzLmV4cGFuZERlbGF5KTtcclxuICAgIH1cclxuICB9XHJcbiAgZHJhZ0hvdmVyRW5kKCkge1xyXG4gICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZXhwYW5kVGltZW91dCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGUgZm9sbG93aW5nIG1ldGhvZHMgYXJlIGZvciBwZXJzaXN0aW5nIHRoZSB0cmVlIGV4cGFuZCBzdGF0ZVxyXG4gICAqIGFmdGVyIGJlaW5nIHJlYnVpbHRcclxuICAgKi9cclxuXHJcbiAgcmVidWlsZFRyZWVGb3JEYXRhKGRhdGE6IGFueSkge1xyXG4gICAgdGhpcy5kYXRhU291cmNlLmRhdGEgPSBkYXRhO1xyXG4gICAgdGhpcy5leHBhbnNpb25Nb2RlbC5zZWxlY3RlZC5mb3JFYWNoKChpZCkgPT4ge1xyXG4gICAgICBjb25zdCBub2RlID0gdGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXMuZmluZCgobikgPT4gbi5pZCA9PT0gaWQpO1xyXG4gICAgICB0aGlzLnRyZWVDb250cm9sLmV4cGFuZChub2RlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTm90IHVzZWQgYnV0IHlvdSBtaWdodCBuZWVkIHRoaXMgdG8gcHJvZ3JhbW1hdGljYWxseSBleHBhbmQgbm9kZXNcclxuICAgKiB0byByZXZlYWwgYSBwYXJ0aWN1bGFyIG5vZGVcclxuICAgKi9cclxuICBwcml2YXRlIGV4cGFuZE5vZGVzQnlJZChmbGF0Tm9kZXM6IEZpbGVGbGF0Tm9kZVtdLCBpZHM6IHN0cmluZ1tdKSB7XHJcbiAgICBpZiAoIWZsYXROb2RlcyB8fCBmbGF0Tm9kZXMubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICBjb25zdCBpZFNldCA9IG5ldyBTZXQoaWRzKTtcclxuICAgIHJldHVybiBmbGF0Tm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xyXG4gICAgICBpZiAoaWRTZXQuaGFzKG5vZGUuaWQpKSB7XHJcbiAgICAgICAgdGhpcy50cmVlQ29udHJvbC5leHBhbmQobm9kZSk7XHJcbiAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50Tm9kZShub2RlKTtcclxuICAgICAgICB3aGlsZSAocGFyZW50KSB7XHJcbiAgICAgICAgICB0aGlzLnRyZWVDb250cm9sLmV4cGFuZChwYXJlbnQpO1xyXG4gICAgICAgICAgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnROb2RlKHBhcmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0UGFyZW50Tm9kZShub2RlOiBGaWxlRmxhdE5vZGUpOiBGaWxlRmxhdE5vZGUgfCBudWxsIHtcclxuICAgIGNvbnN0IGN1cnJlbnRMZXZlbCA9IG5vZGUubGV2ZWw7XHJcbiAgICBpZiAoY3VycmVudExldmVsIDwgMSkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIGNvbnN0IHN0YXJ0SW5kZXggPSB0aGlzLnRyZWVDb250cm9sLmRhdGFOb2Rlcy5pbmRleE9mKG5vZGUpIC0gMTtcclxuICAgIGZvciAobGV0IGkgPSBzdGFydEluZGV4OyBpID49IDA7IGktLSkge1xyXG4gICAgICBjb25zdCBjdXJyZW50Tm9kZSA9IHRoaXMudHJlZUNvbnRyb2wuZGF0YU5vZGVzW2ldO1xyXG4gICAgICBpZiAoY3VycmVudE5vZGUubGV2ZWwgPCBjdXJyZW50TGV2ZWwpIHtcclxuICAgICAgICByZXR1cm4gY3VycmVudE5vZGU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlTm9kZShub2RlVXBkYXRlZClcclxuICB7XHJcbiAgICBjb25zdCBkYXRhVG9DaGFuZ2UgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YVNvdXJjZS5kYXRhKSlcclxuICAgIGNvbnN0IHNpYmxpbmdzID0gdGhpcy5maW5kTm9kZVNpYmxpbmdzKGRhdGFUb0NoYW5nZSwgbm9kZVVwZGF0ZWQuaWQpO1xyXG4gICAgbGV0IGluZGV4PSBzaWJsaW5ncy5maW5kSW5kZXgobm9kZSA9PiBub2RlLmlkID09PSBub2RlVXBkYXRlZC5pZClcclxuICAgIHNpYmxpbmdzW2luZGV4XT1ub2RlVXBkYXRlZDtcclxuICAgIHRoaXMucmVidWlsZFRyZWVGb3JEYXRhKGRhdGFUb0NoYW5nZSk7XHJcblxyXG4gIH1cclxuXHJcbiAgY3JlYXRlTmV3Rm9sZGVyKG5ld0ZvbGRlcilcclxuICB7XHJcbiAgICBuZXdGb2xkZXIudHlwZT1cImZvbGRlclwiO1xyXG4gICAgY29uc3QgZGF0YVRvQ2hhbmdlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGFTb3VyY2UuZGF0YSkpXHJcbiAgICBpZihuZXdGb2xkZXIucGFyZW50ID09PSBudWxsKSB7ZGF0YVRvQ2hhbmdlLnB1c2gobmV3Rm9sZGVyKX1cclxuICAgIGVsc2V7XHJcbiAgICAgIGNvbnN0IHNpYmxpbmdzID0gdGhpcy5maW5kTm9kZVNpYmxpbmdzKGRhdGFUb0NoYW5nZSwgbmV3Rm9sZGVyLnBhcmVudCk7XHJcbiAgICAgIGxldCBpbmRleD0gc2libGluZ3MuZmluZEluZGV4KG5vZGUgPT4gbm9kZS5pZCA9PT0gbmV3Rm9sZGVyLnBhcmVudCk7XHJcbiAgICAgIHNpYmxpbmdzW2luZGV4XS5jaGlsZHJlbi5wdXNoKG5ld0ZvbGRlcilcclxuICAgIH1cclxuICAgIHRoaXMucmVidWlsZFRyZWVGb3JEYXRhKGRhdGFUb0NoYW5nZSk7XHJcblxyXG4gIH1cclxuXHJcbiAgY3JlYXRlTmV3Tm9kZShuZXdOb2RlKVxyXG4gIHtcclxuICAgIG5ld05vZGUudHlwZT1cIm5vZGVcIjtcclxuICAgIGNvbnN0IGRhdGFUb0NoYW5nZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhU291cmNlLmRhdGEpKVxyXG4gICAgY29uc3Qgc2libGluZ3MgPSB0aGlzLmZpbmROb2RlU2libGluZ3MoZGF0YVRvQ2hhbmdlLCBuZXdOb2RlLnBhcmVudCk7XHJcbiAgICBsZXQgaW5kZXg9IHNpYmxpbmdzLmZpbmRJbmRleChub2RlID0+IG5vZGUuaWQgPT09IG5ld05vZGUucGFyZW50KTtcclxuICAgIHNpYmxpbmdzW2luZGV4XS5jaGlsZHJlbi5wdXNoKG5ld05vZGUpXHJcbiAgICBcclxuXHJcbiAgICB0aGlzLnJlYnVpbGRUcmVlRm9yRGF0YShkYXRhVG9DaGFuZ2UpO1xyXG5cclxuICB9XHJcblxyXG5cclxuXHJcbiAgb25CdXR0b25DbGlja2VkKGlkLCBidXR0b246IHN0cmluZylcclxuICB7XHJcbiAgICBjb25zdCBjaGFuZ2VkRGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhU291cmNlLmRhdGEpKVxyXG4gICAgY29uc3Qgc2libGluZ3MgPSB0aGlzLmZpbmROb2RlU2libGluZ3MoY2hhbmdlZERhdGEsIGlkKTtcclxuICAgIGlmKGJ1dHRvbiA9PT0nZWRpdCcpICB7dGhpcy5lbWl0Tm9kZS5lbWl0KCBzaWJsaW5ncy5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gaWQpKTt9XHJcbiAgICBlbHNlIGlmKGJ1dHRvbiA9PT0gJ25ld0ZvbGRlcicpIHt0aGlzLmNyZWF0ZUZvbGRlci5lbWl0KCBzaWJsaW5ncy5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gaWQpKTt9XHJcbiAgICBlbHNlIGlmKGJ1dHRvbiA9PT0gJ25ld05vZGUnKSB7dGhpcy5jcmVhdGVOb2RlLmVtaXQoIHNpYmxpbmdzLmZpbmQobm9kZSA9PiBub2RlLmlkID09PSBpZCkpO31cclxuXHJcbiAgfVxyXG5cclxuICBlbWl0QWxsUm93cygpXHJcbiAge1xyXG4gICAgY29uc3QgZGF0YVRvRW1pdCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhU291cmNlLmRhdGEpKVxyXG4gICAgbGV0IGFsbFJvd3MgPSB0aGlzLmdldENoaWxkcmVuKGRhdGFUb0VtaXQpOyBcclxuICAgIHRoaXMuZW1pdEFsbE5vZGVzLmVtaXQoYWxsUm93cyk7XHJcbiAgfVxyXG5cclxuICBnZXRDaGlsZHJlbihhcnIpXHJcbiAge1xyXG4gICAgbGV0IHJlc3VsdCA9IFtdO1xyXG4gICAgbGV0IHN1YlJlc3VsdDtcclxuICAgIGFyci5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLmNoaWxkcmVuLmxlbmd0aD4wKSB7XHJcbiAgICAgICAgc3ViUmVzdWx0ID0gdGhpcy5nZXRDaGlsZHJlbihpdGVtLmNoaWxkcmVuKTtcclxuICAgICAgICBpZiAoc3ViUmVzdWx0KSByZXN1bHQucHVzaCguLi5zdWJSZXN1bHQpO1xyXG4gICAgICB9XHJcbiAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xyXG5cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbn1cclxuXHJcblxyXG4iLCI8bWF0LXRyZWUgW2RhdGFTb3VyY2VdPVwiZGF0YVNvdXJjZVwiIFt0cmVlQ29udHJvbF09XCJ0cmVlQ29udHJvbFwiIGNka0Ryb3BMaXN0IChjZGtEcm9wTGlzdERyb3BwZWQpPVwiZHJvcCgkZXZlbnQpXCI+XHJcblx0PG1hdC10cmVlLW5vZGUgKm1hdFRyZWVOb2RlRGVmPVwibGV0IG5vZGVcIiBtYXRUcmVlTm9kZVRvZ2dsZSBtYXRUcmVlTm9kZVBhZGRpbmcgY2RrRHJhZyBbY2RrRHJhZ0RhdGFdPVwibm9kZVwiXHJcblx0XHQobW91c2VlbnRlcik9XCJkcmFnSG92ZXIobm9kZSlcIiAobW91c2VsZWF2ZSk9XCJkcmFnSG92ZXJFbmQoKVwiIChjZGtEcmFnU3RhcnRlZCk9XCJkcmFnU3RhcnQoKVwiXHJcblx0XHQoY2RrRHJhZ1JlbGVhc2VkKT1cImRyYWdFbmQoKVwiPlxyXG5cdFx0PGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gZGlzYWJsZWQ+PC9idXR0b24+XHJcblx0XHQ8bWF0LWljb24gKm5nSWY9XCJub2RlLnR5cGUgPT09J2ZvbGRlcidcIiBjbGFzcz1cInR5cGUtaWNvblwiIFthdHRyLmFyaWEtbGFiZWxdPVwibm9kZS50eXBlICsgJ2ljb24nXCI+XHJcblx0XHRcdGZvbGRlclxyXG5cdFx0PC9tYXQtaWNvbj5cclxuXHRcdHt7bm9kZS5uYW1lfX1cclxuXHRcdDxidXR0b24gKm5nSWY9XCJub2RlLnR5cGUgPT09J2ZvbGRlcidcIiAoY2xpY2spPVwib25CdXR0b25DbGlja2VkKG5vZGUuaWQsICduZXdGb2xkZXInKVwiIG1hdC1pY29uLWJ1dHRvbj5cclxuXHRcdFx0PG1hdC1pY29uPmNyZWF0ZV9uZXdfZm9sZGVyPC9tYXQtaWNvbj5cclxuXHRcdDwvYnV0dG9uPlxyXG5cdFx0PGJ1dHRvbiAqbmdJZj1cIm5vZGUudHlwZSA9PT0nZm9sZGVyJ1wiIChjbGljayk9XCJvbkJ1dHRvbkNsaWNrZWQobm9kZS5pZCwgJ25ld05vZGUnKVwiIG1hdC1pY29uLWJ1dHRvbj5cclxuXHRcdFx0PG1hdC1pY29uPnBsYXlsaXN0X2FkZDwvbWF0LWljb24+XHJcblx0XHQ8L2J1dHRvbj5cclxuXHRcdDxidXR0b24gbWF0LWljb24tYnV0dG9uIChjbGljayk9XCJvbkJ1dHRvbkNsaWNrZWQobm9kZS5pZCwgJ2VkaXQnKVwiPlxyXG5cdFx0XHQ8bWF0LWljb24+ZWRpdDwvbWF0LWljb24+XHJcblx0XHQ8L2J1dHRvbj5cclxuXHQ8L21hdC10cmVlLW5vZGU+XHJcblxyXG5cdDxtYXQtdHJlZS1ub2RlICptYXRUcmVlTm9kZURlZj1cImxldCBub2RlO3doZW46IGhhc0NoaWxkXCIgbWF0VHJlZU5vZGVQYWRkaW5nIGNka0RyYWcgW2Nka0RyYWdEYXRhXT1cIm5vZGVcIlxyXG5cdFx0KG1vdXNlZW50ZXIpPVwiZHJhZ0hvdmVyKG5vZGUpXCIgKG1vdXNlbGVhdmUpPVwiZHJhZ0hvdmVyRW5kKClcIiAoY2RrRHJhZ1N0YXJ0ZWQpPVwiZHJhZ1N0YXJ0KClcIlxyXG5cdFx0KGNka0RyYWdSZWxlYXNlZCk9XCJkcmFnRW5kKClcIj5cclxuXHRcdDxidXR0b24gbWF0LWljb24tYnV0dG9uIG1hdFRyZWVOb2RlVG9nZ2xlIChjbGljayk9XCJleHBhbnNpb25Nb2RlbC50b2dnbGUobm9kZS5pZClcIlxyXG5cdFx0XHRbYXR0ci5hcmlhLWxhYmVsXT1cIid0b2dnbGUgJyArIG5vZGUubmFtZVwiPlxyXG5cdFx0XHQ8bWF0LWljb24gY2xhc3M9XCJtYXQtaWNvbi1ydGwtbWlycm9yXCI+XHJcblx0XHRcdFx0e3t0cmVlQ29udHJvbC5pc0V4cGFuZGVkKG5vZGUpID8gJ2V4cGFuZF9tb3JlJyA6ICdjaGV2cm9uX3JpZ2h0J319XHJcblx0XHRcdDwvbWF0LWljb24+XHJcblx0XHQ8L2J1dHRvbj5cclxuXHRcdDxtYXQtaWNvbiBjbGFzcz1cInR5cGUtaWNvblwiIFthdHRyLmFyaWEtbGFiZWxdPVwibm9kZS50eXBlICsgJ2ljb24nXCI+XHJcblx0XHRcdGZvbGRlclxyXG5cdFx0PC9tYXQtaWNvbj5cclxuXHRcdHt7bm9kZS5uYW1lfX1cclxuXHRcdDxidXR0b24gKm5nSWY9XCJub2RlLnR5cGUgPT09J2ZvbGRlcidcIiAoY2xpY2spPVwib25CdXR0b25DbGlja2VkKG5vZGUuaWQsICduZXdGb2xkZXInKVwiIG1hdC1pY29uLWJ1dHRvbj5cclxuXHRcdFx0PG1hdC1pY29uPmNyZWF0ZV9uZXdfZm9sZGVyPC9tYXQtaWNvbj5cclxuXHRcdDwvYnV0dG9uPlxyXG5cdFx0PGJ1dHRvbiAqbmdJZj1cIm5vZGUudHlwZSA9PT0nZm9sZGVyJ1wiIChjbGljayk9XCJvbkJ1dHRvbkNsaWNrZWQobm9kZS5pZCwgJ25ld05vZGUnKVwiIG1hdC1pY29uLWJ1dHRvbj5cclxuXHRcdFx0PG1hdC1pY29uPnBsYXlsaXN0X2FkZDwvbWF0LWljb24+XHJcblx0XHQ8L2J1dHRvbj5cclxuXHRcdDxidXR0b24gbWF0LWljb24tYnV0dG9uIChjbGljayk9XCJvbkJ1dHRvbkNsaWNrZWQobm9kZS5pZCwgJ2VkaXQnKVwiPlxyXG5cdFx0XHQ8bWF0LWljb24+ZWRpdDwvbWF0LWljb24+XHJcblx0XHQ8L2J1dHRvbj5cclxuXHQ8L21hdC10cmVlLW5vZGU+XHJcbjwvbWF0LXRyZWU+Il19