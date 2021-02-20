/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Injectable, Input, Output, ElementRef, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
/**
 * File node data with nested structure.
 * Each node has a name, and a type or a list of children.
 */
export class FileNode {
}
if (false) {
    /** @type {?} */
    FileNode.prototype.id;
    /** @type {?} */
    FileNode.prototype.children;
    /** @type {?} */
    FileNode.prototype.name;
    /** @type {?} */
    FileNode.prototype.type;
    /** @type {?} */
    FileNode.prototype.active;
    /** @type {?} */
    FileNode.prototype.cartographyId;
    /** @type {?} */
    FileNode.prototype.cartographyName;
    /** @type {?} */
    FileNode.prototype.datasetURL;
    /** @type {?} */
    FileNode.prototype.description;
    /** @type {?} */
    FileNode.prototype.filterGetFeatureInfo;
    /** @type {?} */
    FileNode.prototype.filterGetMap;
    /** @type {?} */
    FileNode.prototype.filterSelectable;
    /** @type {?} */
    FileNode.prototype.isFolder;
    /** @type {?} */
    FileNode.prototype.metadataURL;
    /** @type {?} */
    FileNode.prototype.order;
    /** @type {?} */
    FileNode.prototype.parent;
    /** @type {?} */
    FileNode.prototype.queryableActive;
    /** @type {?} */
    FileNode.prototype.radio;
    /** @type {?} */
    FileNode.prototype.tooltip;
    /** @type {?} */
    FileNode.prototype._links;
    /** @type {?} */
    FileNode.prototype.status;
}
/**
 * Flat node with expandable and level information
 */
export class FileFlatNode {
    /**
     * @param {?} expandable
     * @param {?} name
     * @param {?} level
     * @param {?} type
     * @param {?} id
     * @param {?} status
     */
    constructor(expandable, name, level, type, id, status) {
        this.expandable = expandable;
        this.name = name;
        this.level = level;
        this.type = type;
        this.id = id;
        this.status = status;
    }
}
if (false) {
    /** @type {?} */
    FileFlatNode.prototype.expandable;
    /** @type {?} */
    FileFlatNode.prototype.name;
    /** @type {?} */
    FileFlatNode.prototype.level;
    /** @type {?} */
    FileFlatNode.prototype.type;
    /** @type {?} */
    FileFlatNode.prototype.id;
    /** @type {?} */
    FileFlatNode.prototype.status;
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
    /**
     * @return {?}
     */
    get data() { return this.dataChange.value; }
    /**
     * @param {?} dataObj
     * @return {?}
     */
    initialize(dataObj) {
        /** @type {?} */
        const data = this.buildFileTree(dataObj, 0);
        // Notify the change.
        this.dataChange.next(data);
    }
    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `FileNode`.
     * @param {?} arrayTreeNodes
     * @param {?} level
     * @return {?}
     */
    buildFileTree(arrayTreeNodes, level) {
        /** @type {?} */
        var map = {};
        if (arrayTreeNodes.length === 0) {
            /** @type {?} */
            let root = {
                isFolder: true,
                name: 'Root',
                type: 'folder',
                isRoot: true,
                children: []
            };
            map['root'] = root;
        }
        else {
            arrayTreeNodes.forEach((treeNode) => {
                /** @type {?} */
                var obj = treeNode;
                obj.children = [];
                obj.type = (treeNode.isFolder) ? "folder" : "node";
                if (!map[obj.id]) {
                    map[obj.id] = obj;
                }
                else {
                    /** @type {?} */
                    let previousChildren = map[obj.id].children;
                    map[obj.id] = obj;
                    map[obj.id].children = previousChildren;
                }
                /** @type {?} */
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
            map['root'].isRoot = true;
        }
        return map['root'];
    }
    /**
     * @param {?} node
     * @return {?}
     */
    deleteItem(node) {
        this.deleteNode(this.data.children, node);
        this.dataChange.next(this.data);
    }
    /**
     * @param {?} nodes
     * @param {?} nodeToDelete
     * @return {?}
     */
    deleteNode(nodes, nodeToDelete) {
        /** @type {?} */
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
    /**
     * @param {?} from
     * @param {?} to
     * @return {?}
     */
    copyPasteItem(from, to) {
        /** @type {?} */
        const newItem = this.insertItem(to, from);
        return newItem;
    }
    /**
     * @param {?} from
     * @param {?} to
     * @return {?}
     */
    copyPasteItemAbove(from, to) {
        /** @type {?} */
        const newItem = this.insertItemAbove(to, from);
        return newItem;
    }
    /**
     * @param {?} from
     * @param {?} to
     * @return {?}
     */
    copyPasteItemBelow(from, to) {
        /** @type {?} */
        const newItem = this.insertItemBelow(to, from);
        return newItem;
    }
    /**
     * Add an item to to-do list
     * @param {?} node
     * @return {?}
     */
    getNewItem(node) {
        /** @type {?} */
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
            queryableActive: node.queryableActive,
            radio: node.radio,
            tooltip: node.tooltip,
            _links: node._links
        };
        return newItem;
    }
    /**
     * @param {?} parent
     * @param {?} node
     * @return {?}
     */
    insertItem(parent, node) {
        if (!parent.children) {
            parent.children = [];
        }
        /** @type {?} */
        const newItem = this.getNewItem(node);
        newItem.parent = parent == null || parent.id == undefined ? null : parent.id;
        parent.children.push(newItem);
        this.dataChange.next(this.data);
        return newItem;
    }
    /**
     * @param {?} node
     * @param {?} nodeDrag
     * @return {?}
     */
    insertItemAbove(node, nodeDrag) {
        /** @type {?} */
        const parentNode = this.getParentFromNodes(node);
        /** @type {?} */
        const newItem = this.getNewItem(nodeDrag);
        newItem.parent = parentNode == null || parentNode.id == undefined ? null : parentNode.id;
        if (parentNode != null) {
            parentNode.children.splice(parentNode.children.indexOf(node), 0, newItem);
        }
        else {
            this.data.children.splice(this.data.children.indexOf(node), 0, newItem);
        }
        this.dataChange.next(this.data);
        return newItem;
    }
    /**
     * @param {?} node
     * @param {?} nodeDrag
     * @return {?}
     */
    insertItemBelow(node, nodeDrag) {
        /** @type {?} */
        const parentNode = this.getParentFromNodes(node);
        /** @type {?} */
        const newItem = this.getNewItem(nodeDrag);
        newItem.parent = parentNode == null || parentNode.id == undefined ? null : parentNode.id;
        if (parentNode != null) {
            parentNode.children.splice(parentNode.children.indexOf(node) + 1, 0, newItem);
        }
        else {
            this.data.children.splice(this.data.children.indexOf(node) + 1, 0, newItem);
        }
        this.dataChange.next(this.data);
        return newItem;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    getParentFromNodes(node) {
        for (let i = 0; i < this.data.children.length; ++i) {
            /** @type {?} */
            const currentRoot = this.data.children[i];
            /** @type {?} */
            const parent = this.getParent(currentRoot, node);
            if (parent != null) {
                return parent;
            }
        }
        return null;
    }
    /**
     * @param {?} currentRoot
     * @param {?} node
     * @return {?}
     */
    getParent(currentRoot, node) {
        if (currentRoot.children && currentRoot.children.length > 0) {
            for (let i = 0; i < currentRoot.children.length; ++i) {
                /** @type {?} */
                const child = currentRoot.children[i];
                if (child === node) {
                    return currentRoot;
                }
                else if (child.children && child.children.length > 0) {
                    /** @type {?} */
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
FileDatabase.decorators = [
    { type: Injectable }
];
/** @nocollapse */
FileDatabase.ctorParameters = () => [];
if (false) {
    /** @type {?} */
    FileDatabase.prototype.dataChange;
}
/**
 * \@title Tree with flat nodes
 */
export class DataTreeComponent {
    /**
     * @param {?} database
     */
    constructor(database) {
        this.database = database;
        // expansion model tracks expansion state
        this.expansionModel = new SelectionModel(true);
        this.dragging = false;
        this.expandDelay = 1000;
        this.validateDrop = false;
        this.dragNodeExpandOverWaitTimeMs = 1500;
        /**
         * Map from flat node to nested node. This helps us finding the nested node to be modified
         */
        this.flatNodeMap = new Map();
        /**
         * Map from nested node to flattened node. This helps us to keep the same object for selection
         */
        this.nestedNodeMap = new Map();
        this.transformer = (node, level) => {
            /** @type {?} */
            const existingNode = this.nestedNodeMap.get(node);
            /** @type {?} */
            const flatNode = existingNode && existingNode.name === node.name
                ? existingNode
                : new FileFlatNode((node.children && node.children.length > 0), node.name, level, node.type, node.id, node.status);
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
    /**
     * @return {?}
     */
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
        if (this.eventRefreshSubscription) {
            this._eventRefreshSubscription = this.eventRefreshSubscription.subscribe(() => {
                this.getElements();
            });
        }
        this.getElements();
    }
    /**
     * @return {?}
     */
    getElements() {
        this.getAll()
            .subscribe((items) => {
            this.treeData = items;
            this.database.initialize(this.treeData);
            this.database.dataChange.subscribe(data => this.rebuildTreeForData([data]));
        });
    }
    /**
     * This constructs an array of nodes that matches the DOM
     * @return {?}
     */
    visibleNodes() {
        /** @type {?} */
        const result = [];
        /**
         * @param {?} node
         * @param {?} expanded
         * @return {?}
         */
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
    /**
     * @param {?} arr
     * @param {?} id
     * @return {?}
     */
    findNodeSiblings(arr, id) {
        /** @type {?} */
        let result;
        /** @type {?} */
        let subResult;
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
     * @param {?} event
     * @param {?} node
     * @return {?}
     */
    handleDragStart(event, node) {
        // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
        event.dataTransfer.setData('foo', 'bar');
        event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
        this.dragNode = node;
        this.treeControl.collapse(node);
    }
    /**
     * @param {?} event
     * @param {?} node
     * @return {?}
     */
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
        /** @type {?} */
        const percentageX = event.offsetX / event.target.clientWidth;
        /** @type {?} */
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
    /**
     * @param {?} event
     * @param {?} node
     * @return {?}
     */
    handleDrop(event, node) {
        event.preventDefault();
        /** @type {?} */
        let toFlatNode = this.flatNodeMap.get(node);
        /** @type {?} */
        let fromFlatNode = this.flatNodeMap.get(this.dragNode);
        if (node !== this.dragNode && (this.dragNodeExpandOverArea !== 'center' || (this.dragNodeExpandOverArea === 'center' && toFlatNode.isFolder))) {
            /** @type {?} */
            let newItem;
            if (this.dragNodeExpandOverArea === 'above') {
                newItem = this.database.copyPasteItemAbove(fromFlatNode, toFlatNode);
            }
            else if (this.dragNodeExpandOverArea === 'below') {
                newItem = this.database.copyPasteItemBelow(fromFlatNode, toFlatNode);
            }
            else {
                newItem = this.database.copyPasteItem(fromFlatNode, toFlatNode);
            }
            /** @type {?} */
            let parentLvl = this.treeControl.dataNodes.find((n) => n.id === fromFlatNode.id).level;
            fromFlatNode.children.forEach(child => {
                this.treeControl.dataNodes.find((n) => n.id === child.id).level = parentLvl + 1;
            });
            this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
            this.treeControl.expandDescendants(this.nestedNodeMap.get(newItem));
        }
        this.dragNode = null;
        this.dragNodeExpandOverNode = null;
        this.dragNodeExpandOverTime = 0;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleDragEnd(event) {
        this.dragNode = null;
        this.dragNodeExpandOverNode = null;
        this.dragNodeExpandOverTime = 0;
    }
    /**
     * The following methods are for persisting the tree expand state
     * after being rebuilt
     * @param {?} data
     * @return {?}
     */
    rebuildTreeForData(data) {
        //this.dataSource.data = data;
        this.dataSource.data = [];
        this.dataSource.data = data;
        this.treeControl.expansionModel.selected.forEach((nodeAct) => {
            /** @type {?} */
            const node = this.treeControl.dataNodes.find((n) => n.id === nodeAct.id);
            this.treeControl.expand(node);
        });
    }
    /**
     * @param {?} node
     * @return {?}
     */
    getParentNode(node) {
        /** @type {?} */
        const currentLevel = node.level;
        if (currentLevel < 1) {
            return null;
        }
        /** @type {?} */
        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
        for (let i = startIndex; i >= 0; i--) {
            /** @type {?} */
            const currentNode = this.treeControl.dataNodes[i];
            if (currentNode.level < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }
    /**
     * @param {?} nodeUpdated
     * @return {?}
     */
    updateNode(nodeUpdated) {
        /** @type {?} */
        const dataToChange = JSON.parse(JSON.stringify(this.dataSource.data));
        /** @type {?} */
        const siblings = this.findNodeSiblings(dataToChange, nodeUpdated.id);
        /** @type {?} */
        let index = siblings.findIndex(node => node.id === nodeUpdated.id);
        siblings[index] = nodeUpdated;
        this.rebuildTreeForData(dataToChange);
    }
    /**
     * @param {?} newFolder
     * @return {?}
     */
    createNewFolder(newFolder) {
        newFolder.type = "folder";
        /** @type {?} */
        const dataToChange = JSON.parse(JSON.stringify(this.dataSource.data));
        if (newFolder.parent === null) {
            dataToChange[0].children.push(newFolder);
        }
        else {
            /** @type {?} */
            const siblings = this.findNodeSiblings(dataToChange, newFolder.parent);
            /** @type {?} */
            let index = siblings.findIndex(node => node.id === newFolder.parent);
            siblings[index].children.push(newFolder);
        }
        this.rebuildTreeForData(dataToChange);
    }
    /**
     * @param {?} newNode
     * @return {?}
     */
    createNewNode(newNode) {
        newNode.type = "node";
        /** @type {?} */
        const dataToChange = JSON.parse(JSON.stringify(this.dataSource.data));
        if (newNode.parent === null) {
            dataToChange[0].children.push(newNode);
        }
        else {
            /** @type {?} */
            const siblings = this.findNodeSiblings(dataToChange, newNode.parent);
            /** @type {?} */
            let index = siblings.findIndex(node => node.id === newNode.parent);
            siblings[index].children.push(newNode);
        }
        this.rebuildTreeForData(dataToChange);
    }
    /**
     * @param {?} id
     * @param {?} button
     * @return {?}
     */
    onButtonClicked(id, button) {
        /** @type {?} */
        const changedData = JSON.parse(JSON.stringify(this.dataSource.data));
        /** @type {?} */
        const siblings = this.findNodeSiblings(changedData, id);
        /** @type {?} */
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
            // let children= this.getAllChildren(nodeClicked.children)
            // children.forEach(children => {
            //   children.status='pendingDelete';
            // });
            this.deleteChildren(nodeClicked.children);
            // nodeClicked.children=children
            nodeClicked.status = 'pendingDelete';
            this.rebuildTreeForData(changedData);
        }
    }
    /**
     * @return {?}
     */
    emitAllRows() {
        /** @type {?} */
        const dataToEmit = JSON.parse(JSON.stringify(this.dataSource.data));
        /** @type {?} */
        let allRows = this.getAllChildren(dataToEmit);
        this.emitAllNodes.emit(allRows);
    }
    /**
     * @param {?} arr
     * @return {?}
     */
    getAllChildren(arr) {
        /** @type {?} */
        let result = [];
        /** @type {?} */
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
    /**
     * @param {?} arr
     * @return {?}
     */
    deleteChildren(arr) {
        arr.forEach((item, i) => {
            if (item.children.length > 0) {
                this.deleteChildren(item.children);
            }
            item.status = 'pendingDelete';
        });
    }
}
DataTreeComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-data-tree',
                template: "<mat-tree [dataSource]=\"dataSource\" [treeControl]=\"treeControl\" >\r\n\t<mat-tree-node *matTreeNodeDef=\"let node\" matTreeNodeToggle matTreeNodePadding  draggable=\"true\"\r\n\t(dragstart)=\"handleDragStart($event, node);\" \t(dragover)=\"handleDragOver($event, node);\"\r\n\t(drop)=\"handleDrop($event, node);\" \t(dragend)=\"handleDragEnd($event);\"                  \r\n\t  [ngClass]=\"{'drop-above': dragNodeExpandOverArea === 'above' && dragNodeExpandOverNode === node,\r\n\t'drop-below': dragNodeExpandOverArea === 'below' && dragNodeExpandOverNode === node,\r\n\t'drop-center': dragNodeExpandOverArea === 'center' && dragNodeExpandOverNode === node,\r\n\t'deletedNode': node.status=='pendingDelete'}\">\r\n\t\t<button mat-icon-button disabled></button>\r\n\t\t<mat-icon *ngIf=\"node.type ==='folder'&& node.status!='pendingDelete'\" class=\"type-icon\" [attr.aria-label]=\"node.type + 'icon'\">\r\n\t\t\tfolder\r\n\t\t</mat-icon>\r\n\t\t<span *ngIf=\"node.status=='pendingDelete'\">({{\"pendingDelete\" | translate}})-</span>\r\n\t\t{{node.name}}\r\n\t\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newFolder')\" mat-icon-button>\r\n\t\t\t<mat-icon>create_new_folder</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newNode')\" mat-icon-button>\r\n\t\t\t<mat-icon>playlist_add</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\" mat-icon-button (click)=\"onButtonClicked(node.id, 'delete')\">\r\n\t\t\t<mat-icon>delete</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\" mat-icon-button (click)=\"onButtonClicked(node.id, 'edit')\">\r\n\t\t\t<mat-icon>edit</mat-icon>\r\n\t\t</button>\r\n\r\n\t</mat-tree-node>\r\n\r\n\t<mat-tree-node *matTreeNodeDef=\"let node;when: hasChild\" matTreeNodePadding  draggable=\"true\"\r\n\t(dragstart)=\"handleDragStart($event, node);\" \t(dragover)=\"handleDragOver($event, node);\"\r\n\t(drop)=\"handleDrop($event, node);\" \t(dragend)=\"handleDragEnd($event);\"                  \r\n\t [ngClass]=\"{'drop-above': dragNodeExpandOverArea === 'above' && dragNodeExpandOverNode === node,\r\n\t'drop-below': dragNodeExpandOverArea === 'below' && dragNodeExpandOverNode === node,\r\n\t'drop-center': dragNodeExpandOverArea === 'center' && dragNodeExpandOverNode === node,\r\n\t'deletedNode': node.status=='pendingDelete'}\">\r\n\t\t<button mat-icon-button matTreeNodeToggle (click)=\"expansionModel.toggle(node.id)\"\r\n\t\t\t[attr.aria-label]=\"'toggle ' + node.name\">\r\n\t\t\t<mat-icon class=\"mat-icon-rtl-mirror\">\r\n\t\t\t\t{{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}\r\n\t\t\t</mat-icon>\r\n\t\t</button>\r\n\t\t<mat-icon class=\"type-icon\" [attr.aria-label]=\"node.type + 'icon'\">\r\n\t\t\tfolder\r\n\t\t</mat-icon>\r\n\t\t<span *ngIf=\"node.status=='pendingDelete'\">({{\"pendingDelete\" | translate}})-</span>\r\n\t\t{{node.name}}\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newFolder')\" mat-icon-button>\r\n\t\t\t<mat-icon>create_new_folder</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newNode')\" mat-icon-button>\r\n\t\t\t<mat-icon>playlist_add</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\" mat-icon-button (click)=\"onButtonClicked(node.id, 'delete')\">\r\n\t\t\t<mat-icon>delete</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\"  mat-icon-button (click)=\"onButtonClicked(node.id, 'edit')\">\r\n\t\t\t<mat-icon>edit</mat-icon>\r\n\t\t</button>\r\n\t\t\r\n\t</mat-tree-node>\r\n</mat-tree>\r\n\r\n<span #emptyItem></span>\r\n",
                providers: [FileDatabase],
                styles: [".mat-tree-node{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;cursor:move;user-select:none}.mat-tree-node.cdk-drag-preview{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-tree-node.cdk-drag-placeholder{opacity:0}.cdk-drop-list-dragging .mat-tree-node:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.cdk-drag-animating{transition:transform .2s cubic-bezier(0,0,.2,1)}.drop-above{border-top:10px solid #ddd;margin-top:-10px}.drop-below{border-bottom:10px solid #ddd;margin-bottom:-10px}.drop-center{background-color:#ddd}.deletedNode{color:red;font-style:italic}"]
            }] }
];
/** @nocollapse */
DataTreeComponent.ctorParameters = () => [
    { type: FileDatabase }
];
DataTreeComponent.propDecorators = {
    createNode: [{ type: Output }],
    createFolder: [{ type: Output }],
    emitNode: [{ type: Output }],
    emitAllNodes: [{ type: Output }],
    eventNodeUpdatedSubscription: [{ type: Input }],
    eventCreateNodeSubscription: [{ type: Input }],
    eventGetAllRowsSubscription: [{ type: Input }],
    eventRefreshSubscription: [{ type: Input }],
    getAll: [{ type: Input }],
    emptyItem: [{ type: ViewChild, args: ['emptyItem',] }]
};
if (false) {
    /** @type {?} */
    DataTreeComponent.prototype.createNode;
    /** @type {?} */
    DataTreeComponent.prototype.createFolder;
    /** @type {?} */
    DataTreeComponent.prototype.emitNode;
    /** @type {?} */
    DataTreeComponent.prototype.emitAllNodes;
    /** @type {?} */
    DataTreeComponent.prototype.eventNodeUpdatedSubscription;
    /** @type {?} */
    DataTreeComponent.prototype.eventCreateNodeSubscription;
    /** @type {?} */
    DataTreeComponent.prototype.eventGetAllRowsSubscription;
    /** @type {?} */
    DataTreeComponent.prototype.eventRefreshSubscription;
    /** @type {?} */
    DataTreeComponent.prototype._eventNodeUpdatedSubscription;
    /** @type {?} */
    DataTreeComponent.prototype._eventCreateNodeSubscription;
    /** @type {?} */
    DataTreeComponent.prototype._eventGetAllRowsSubscription;
    /** @type {?} */
    DataTreeComponent.prototype._eventRefreshSubscription;
    /** @type {?} */
    DataTreeComponent.prototype.treeControl;
    /** @type {?} */
    DataTreeComponent.prototype.treeFlattener;
    /** @type {?} */
    DataTreeComponent.prototype.dataSource;
    /** @type {?} */
    DataTreeComponent.prototype.expansionModel;
    /** @type {?} */
    DataTreeComponent.prototype.dragging;
    /** @type {?} */
    DataTreeComponent.prototype.expandTimeout;
    /** @type {?} */
    DataTreeComponent.prototype.expandDelay;
    /** @type {?} */
    DataTreeComponent.prototype.validateDrop;
    /** @type {?} */
    DataTreeComponent.prototype.treeData;
    /** @type {?} */
    DataTreeComponent.prototype.getAll;
    /** @type {?} */
    DataTreeComponent.prototype.dragNode;
    /** @type {?} */
    DataTreeComponent.prototype.dragNodeExpandOverWaitTimeMs;
    /** @type {?} */
    DataTreeComponent.prototype.dragNodeExpandOverNode;
    /** @type {?} */
    DataTreeComponent.prototype.dragNodeExpandOverTime;
    /** @type {?} */
    DataTreeComponent.prototype.dragNodeExpandOverArea;
    /** @type {?} */
    DataTreeComponent.prototype.emptyItem;
    /**
     * Map from flat node to nested node. This helps us finding the nested node to be modified
     * @type {?}
     */
    DataTreeComponent.prototype.flatNodeMap;
    /**
     * Map from nested node to flattened node. This helps us to keep the same object for selection
     * @type {?}
     */
    DataTreeComponent.prototype.nestedNodeMap;
    /** @type {?} */
    DataTreeComponent.prototype.transformer;
    /** @type {?} */
    DataTreeComponent.prototype._getLevel;
    /** @type {?} */
    DataTreeComponent.prototype._isExpandable;
    /** @type {?} */
    DataTreeComponent.prototype._getChildren;
    /** @type {?} */
    DataTreeComponent.prototype.hasChild;
    /** @type {?} */
    DataTreeComponent.prototype.database;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS10cmVlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGF0YS10cmVlL2RhdGEtdHJlZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pHLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2pGLE9BQU8sRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLEVBQUUsSUFBSSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFdkUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7OztBQU8xRCxNQUFNLE9BQU8sUUFBUTtDQXNCcEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdELE1BQU0sT0FBTyxZQUFZOzs7Ozs7Ozs7SUFDdkIsWUFDUyxZQUNBLE1BQ0EsT0FDQSxNQUNBLElBQ0E7UUFMQSxlQUFVLEdBQVYsVUFBVTtRQUNWLFNBQUksR0FBSixJQUFJO1FBQ0osVUFBSyxHQUFMLEtBQUs7UUFDTCxTQUFJLEdBQUosSUFBSTtRQUNKLE9BQUUsR0FBRixFQUFFO1FBQ0YsV0FBTSxHQUFOLE1BQU07S0FDVjtDQUNOOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBWUQsTUFBTSxPQUFPLFlBQVk7SUFJdkI7MEJBSGEsSUFBSSxlQUFlLENBQWEsRUFBRSxDQUFDO0tBSy9DOzs7O0lBSkQsSUFBSSxJQUFJLEtBQVUs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QixJQUFJLFNBQVMsQ0FBQztRQUNkLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBQyxDQUFDLEVBQUU7Z0JBQzFCLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxTQUFTO29CQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQzthQUMxQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FFbkIsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLENBQUM7S0FDZjs7Ozs7SUFFRCxjQUFjLENBQUMsR0FBRztRQUVoQixHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3RCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxFQUFFO2dCQUMxQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUNwQztZQUNELElBQUksQ0FBQyxNQUFNLEdBQUMsZUFBZSxDQUFBO1NBRTVCLENBQUMsQ0FBQztLQUNKOzs7WUE3VkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxlQUFlO2dCQUN6Qiw0NEhBQXVDO2dCQUV2QyxTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUM7O2FBQzFCOzs7O1lBMkM4QixZQUFZOzs7eUJBekN4QyxNQUFNOzJCQUNOLE1BQU07dUJBQ04sTUFBTTsyQkFDTixNQUFNOzJDQUNOLEtBQUs7MENBQ0wsS0FBSzswQ0FDTCxLQUFLO3VDQUNMLEtBQUs7cUJBZ0JMLEtBQUs7d0JBU0wsU0FBUyxTQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGbGF0VHJlZUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9jZGsvdHJlZSc7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3RhYmxlLCBJbnB1dCwgT3V0cHV0LEVsZW1lbnRSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBNYXRUcmVlRmxhdERhdGFTb3VyY2UsIE1hdFRyZWVGbGF0dGVuZXIgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90cmVlJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBvZiBhcyBvYnNlcnZhYmxlT2YgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQ2RrRHJhZ0Ryb3AgfSBmcm9tICdAYW5ndWxhci9jZGsvZHJhZy1kcm9wJztcclxuaW1wb3J0IHsgU2VsZWN0aW9uTW9kZWwgfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xyXG5pbXBvcnQgeyBmb3JFYWNoIH0gZnJvbSAnanN6aXAnO1xyXG5cclxuLyoqXHJcbiAqIEZpbGUgbm9kZSBkYXRhIHdpdGggbmVzdGVkIHN0cnVjdHVyZS5cclxuICogRWFjaCBub2RlIGhhcyBhIG5hbWUsIGFuZCBhIHR5cGUgb3IgYSBsaXN0IG9mIGNoaWxkcmVuLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEZpbGVOb2RlIHtcclxuICBpZDogc3RyaW5nO1xyXG4gIGNoaWxkcmVuOiBGaWxlTm9kZVtdO1xyXG4gIG5hbWU6IHN0cmluZztcclxuICB0eXBlOiBhbnk7XHJcbiAgYWN0aXZlOiBhbnlcclxuICBjYXJ0b2dyYXBoeUlkOiBhbnlcclxuICBjYXJ0b2dyYXBoeU5hbWU6IGFueVxyXG4gIGRhdGFzZXRVUkw6IGFueVxyXG4gIGRlc2NyaXB0aW9uOiBhbnlcclxuICBmaWx0ZXJHZXRGZWF0dXJlSW5mbzogYW55XHJcbiAgZmlsdGVyR2V0TWFwOiBhbnlcclxuICBmaWx0ZXJTZWxlY3RhYmxlOiBhbnlcclxuICBpc0ZvbGRlcjogYW55XHJcbiAgbWV0YWRhdGFVUkw6IGFueVxyXG4gIG9yZGVyOiBhbnlcclxuICBwYXJlbnQ6IGFueVxyXG4gIHF1ZXJ5YWJsZUFjdGl2ZTogYW55XHJcbiAgcmFkaW86IGFueVxyXG4gIHRvb2x0aXA6IGFueVxyXG4gIF9saW5rczogYW55XHJcbiAgc3RhdHVzOiBhbnlcclxufVxyXG5cclxuLyoqIEZsYXQgbm9kZSB3aXRoIGV4cGFuZGFibGUgYW5kIGxldmVsIGluZm9ybWF0aW9uICovXHJcbmV4cG9ydCBjbGFzcyBGaWxlRmxhdE5vZGUge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHVibGljIGV4cGFuZGFibGU6IGJvb2xlYW4sXHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nLFxyXG4gICAgcHVibGljIGxldmVsOiBudW1iZXIsXHJcbiAgICBwdWJsaWMgdHlwZTogYW55LFxyXG4gICAgcHVibGljIGlkOiBzdHJpbmcsXHJcbiAgICBwdWJsaWMgc3RhdHVzOiBzdHJpbmdcclxuICApIHsgfVxyXG59XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBGaWxlIGRhdGFiYXNlLCBpdCBjYW4gYnVpbGQgYSB0cmVlIHN0cnVjdHVyZWQgSnNvbiBvYmplY3QgZnJvbSBzdHJpbmcuXHJcbiAqIEVhY2ggbm9kZSBpbiBKc29uIG9iamVjdCByZXByZXNlbnRzIGEgZmlsZSBvciBhIGRpcmVjdG9yeS4gRm9yIGEgZmlsZSwgaXQgaGFzIG5hbWUgYW5kIHR5cGUuXHJcbiAqIEZvciBhIGRpcmVjdG9yeSwgaXQgaGFzIG5hbWUgYW5kIGNoaWxkcmVuIChhIGxpc3Qgb2YgZmlsZXMgb3IgZGlyZWN0b3JpZXMpLlxyXG4gKiBUaGUgaW5wdXQgd2lsbCBiZSBhIGpzb24gb2JqZWN0IHN0cmluZywgYW5kIHRoZSBvdXRwdXQgaXMgYSBsaXN0IG9mIGBGaWxlTm9kZWAgd2l0aCBuZXN0ZWRcclxuICogc3RydWN0dXJlLlxyXG4gKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgRmlsZURhdGFiYXNlIHtcclxuICBkYXRhQ2hhbmdlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxGaWxlTm9kZVtdPihbXSk7XHJcbiAgZ2V0IGRhdGEoKTogYW55IHsgcmV0dXJuIHRoaXMuZGF0YUNoYW5nZS52YWx1ZTsgfVxyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgfVxyXG5cclxuICBpbml0aWFsaXplKGRhdGFPYmopIHtcclxuXHJcbiAgICAvLyBCdWlsZCB0aGUgdHJlZSBub2RlcyBmcm9tIEpzb24gb2JqZWN0LiBUaGUgcmVzdWx0IGlzIGEgbGlzdCBvZiBgRmlsZU5vZGVgIHdpdGggbmVzdGVkXHJcbiAgICAvLyAgICAgZmlsZSBub2RlIGFzIGNoaWxkcmVuLlxyXG4gICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRGaWxlVHJlZShkYXRhT2JqLCAwKTtcclxuXHJcbiAgICAvLyBOb3RpZnkgdGhlIGNoYW5nZS5cclxuICAgIHRoaXMuZGF0YUNoYW5nZS5uZXh0KGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQnVpbGQgdGhlIGZpbGUgc3RydWN0dXJlIHRyZWUuIFRoZSBgdmFsdWVgIGlzIHRoZSBKc29uIG9iamVjdCwgb3IgYSBzdWItdHJlZSBvZiBhIEpzb24gb2JqZWN0LlxyXG4gICAqIFRoZSByZXR1cm4gdmFsdWUgaXMgdGhlIGxpc3Qgb2YgYEZpbGVOb2RlYC5cclxuICAgKi9cclxuICBidWlsZEZpbGVUcmVlKGFycmF5VHJlZU5vZGVzOiBhbnlbXSwgbGV2ZWw6IG51bWJlcik6IGFueSB7XHJcbiAgICB2YXIgbWFwID0ge307XHJcbiAgICBpZihhcnJheVRyZWVOb2Rlcy5sZW5ndGg9PT0wKVxyXG4gICAge1xyXG4gICAgICBsZXQgcm9vdCA9IHtcclxuICAgICAgICBpc0ZvbGRlcjp0cnVlLFxyXG4gICAgICAgIG5hbWU6J1Jvb3QnLFxyXG4gICAgICAgIHR5cGU6ICdmb2xkZXInLFxyXG4gICAgICAgIGlzUm9vdDogdHJ1ZSxcclxuICAgICAgICBjaGlsZHJlbjogW11cclxuICAgICAgfVxyXG4gICAgICBtYXBbJ3Jvb3QnXT1yb290O1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgYXJyYXlUcmVlTm9kZXMuZm9yRWFjaCgodHJlZU5vZGUpID0+IHtcclxuICAgICAgICB2YXIgb2JqID0gdHJlZU5vZGU7XHJcbiAgICAgICAgb2JqLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgb2JqLnR5cGU9ICh0cmVlTm9kZS5pc0ZvbGRlcik/IFwiZm9sZGVyXCIgOiBcIm5vZGVcIjtcclxuICBcclxuICAgICAgICBpZighbWFwW29iai5pZF0pIHttYXBbb2JqLmlkXSA9IG9iajt9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIGxldCBwcmV2aW91c0NoaWxkcmVuPSBtYXBbb2JqLmlkXS5jaGlsZHJlblxyXG4gICAgICAgICAgbWFwW29iai5pZF0gPSBvYmo7XHJcbiAgICAgICAgICBtYXBbb2JqLmlkXS5jaGlsZHJlbj1wcmV2aW91c0NoaWxkcmVuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwYXJlbnQgPSBvYmoucGFyZW50IHx8ICdyb290JztcclxuICAgICAgICBpZiAoIW1hcFtwYXJlbnRdKSB7XHJcbiAgICAgICAgICBtYXBbcGFyZW50XSA9IHtcclxuICAgICAgICAgICAgY2hpbGRyZW46IFtdXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBtYXBbcGFyZW50XS5jaGlsZHJlbi5wdXNoKG9iaik7XHJcbiAgICAgIH0pO1xyXG4gICAgICBtYXBbJ3Jvb3QnXS50eXBlPSdmb2xkZXInO1xyXG4gICAgICBtYXBbJ3Jvb3QnXS5uYW1lPSdSb290JztcclxuICAgICAgbWFwWydyb290J10uaXNGb2xkZXI9dHJ1ZTtcclxuICAgICAgbWFwWydyb290J10uaXNSb290PXRydWU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJldHVybiBtYXBbJ3Jvb3QnXTtcclxuICB9XHJcbiAgXHJcblxyXG4gIGRlbGV0ZUl0ZW0obm9kZTogRmlsZU5vZGUpIHtcclxuICAgIHRoaXMuZGVsZXRlTm9kZSh0aGlzLmRhdGEuY2hpbGRyZW4sIG5vZGUpO1xyXG4gICAgdGhpcy5kYXRhQ2hhbmdlLm5leHQodGhpcy5kYXRhKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZU5vZGUobm9kZXM6IEZpbGVOb2RlW10sIG5vZGVUb0RlbGV0ZTogRmlsZU5vZGUpIHtcclxuICAgIGNvbnN0IGluZGV4ID0gbm9kZXMuaW5kZXhPZihub2RlVG9EZWxldGUsIDApO1xyXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgbm9kZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XHJcbiAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4gJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLmRlbGV0ZU5vZGUobm9kZS5jaGlsZHJlbiwgbm9kZVRvRGVsZXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29weVBhc3RlSXRlbShmcm9tOiBGaWxlTm9kZSwgdG86IEZpbGVOb2RlKTogRmlsZU5vZGUge1xyXG4gICAgY29uc3QgbmV3SXRlbSA9IHRoaXMuaW5zZXJ0SXRlbSh0bywgZnJvbSk7XHJcblxyXG4gICAgcmV0dXJuIG5ld0l0ZW07XHJcbiAgfVxyXG5cclxuICBjb3B5UGFzdGVJdGVtQWJvdmUoZnJvbTogRmlsZU5vZGUsIHRvOiBGaWxlTm9kZSk6IEZpbGVOb2RlIHtcclxuICAgIGNvbnN0IG5ld0l0ZW0gPSB0aGlzLmluc2VydEl0ZW1BYm92ZSh0bywgZnJvbSk7XHJcblxyXG4gICAgcmV0dXJuIG5ld0l0ZW07XHJcbiAgfVxyXG5cclxuICBjb3B5UGFzdGVJdGVtQmVsb3coZnJvbTogRmlsZU5vZGUsIHRvOiBGaWxlTm9kZSk6IEZpbGVOb2RlIHtcclxuICAgIGNvbnN0IG5ld0l0ZW0gPSB0aGlzLmluc2VydEl0ZW1CZWxvdyh0bywgZnJvbSk7XHJcblxyXG4gICAgcmV0dXJuIG5ld0l0ZW07XHJcbiAgfVxyXG5cclxuICAvKiogQWRkIGFuIGl0ZW0gdG8gdG8tZG8gbGlzdCAqL1xyXG4gIFxyXG4gIGdldE5ld0l0ZW0obm9kZTpGaWxlTm9kZSl7XHJcbiAgICBjb25zdCBuZXdJdGVtID0ge1xyXG4gICAgICBuYW1lOiBub2RlLm5hbWUsXHJcbiAgICAgIGNoaWxkcmVuOiBub2RlLmNoaWxkcmVuLFxyXG4gICAgICB0eXBlOiBub2RlLnR5cGUsXHJcbiAgICAgIGlkOiBub2RlLmlkLCBcclxuICAgICAgYWN0aXZlOiBub2RlLmFjdGl2ZSxcclxuICAgICAgY2FydG9ncmFwaHlJZDogbm9kZS5jYXJ0b2dyYXBoeUlkLFxyXG4gICAgICBjYXJ0b2dyYXBoeU5hbWU6IG5vZGUuY2FydG9ncmFwaHlOYW1lLFxyXG4gICAgICBkYXRhc2V0VVJMOiBub2RlLmRhdGFzZXRVUkwsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiBub2RlLmRlc2NyaXB0aW9uLFxyXG4gICAgICBmaWx0ZXJHZXRGZWF0dXJlSW5mbzogbm9kZS5maWx0ZXJHZXRGZWF0dXJlSW5mbyxcclxuICAgICAgZmlsdGVyR2V0TWFwOiBub2RlLmZpbHRlckdldE1hcCxcclxuICAgICAgZmlsdGVyU2VsZWN0YWJsZTogbm9kZS5maWx0ZXJTZWxlY3RhYmxlLFxyXG4gICAgICBpc0ZvbGRlcjogbm9kZS5pc0ZvbGRlcixcclxuICAgICAgbWV0YWRhdGFVUkw6IG5vZGUubWV0YWRhdGFVUkwsXHJcbiAgICAgIG9yZGVyOiBub2RlLm9yZGVyLFxyXG4gICAgICBxdWVyeWFibGVBY3RpdmU6IG5vZGUucXVlcnlhYmxlQWN0aXZlLFxyXG4gICAgICByYWRpbzogbm9kZS5yYWRpbyxcclxuICAgICAgdG9vbHRpcDogbm9kZS50b29sdGlwLFxyXG4gICAgICBfbGlua3M6IG5vZGUuX2xpbmtzIH0gYXMgRmlsZU5vZGU7XHJcblxyXG4gICAgcmV0dXJuIG5ld0l0ZW07XHJcbiAgfVxyXG5cclxuICBpbnNlcnRJdGVtKHBhcmVudDogRmlsZU5vZGUsIG5vZGU6IEZpbGVOb2RlKTogRmlsZU5vZGUge1xyXG4gICAgaWYgKCFwYXJlbnQuY2hpbGRyZW4pIHtcclxuICAgICAgcGFyZW50LmNoaWxkcmVuID0gW107XHJcbiAgICB9XHJcbiAgICBjb25zdCBuZXdJdGVtID0gdGhpcy5nZXROZXdJdGVtKG5vZGUpXHJcbiAgICBuZXdJdGVtLnBhcmVudCA9IHBhcmVudD09bnVsbCB8fCBwYXJlbnQuaWQ9PXVuZGVmaW5lZD9udWxsOnBhcmVudC5pZDtcclxuXHJcbiAgICBwYXJlbnQuY2hpbGRyZW4ucHVzaChuZXdJdGVtKTtcclxuICAgIHRoaXMuZGF0YUNoYW5nZS5uZXh0KHRoaXMuZGF0YSk7XHJcbiAgICByZXR1cm4gbmV3SXRlbTtcclxuICB9XHJcblxyXG4gIGluc2VydEl0ZW1BYm92ZShub2RlOiBGaWxlTm9kZSwgbm9kZURyYWc6IEZpbGVOb2RlKTogRmlsZU5vZGUge1xyXG4gICAgY29uc3QgcGFyZW50Tm9kZSA9IHRoaXMuZ2V0UGFyZW50RnJvbU5vZGVzKG5vZGUpO1xyXG4gICAgY29uc3QgbmV3SXRlbSA9IHRoaXMuZ2V0TmV3SXRlbShub2RlRHJhZylcclxuICAgIG5ld0l0ZW0ucGFyZW50ID0gcGFyZW50Tm9kZT09bnVsbCB8fCBwYXJlbnROb2RlLmlkPT11bmRlZmluZWQ/bnVsbDpwYXJlbnROb2RlLmlkO1xyXG5cclxuICAgIGlmIChwYXJlbnROb2RlICE9IG51bGwpIHtcclxuICAgICAgcGFyZW50Tm9kZS5jaGlsZHJlbi5zcGxpY2UocGFyZW50Tm9kZS5jaGlsZHJlbi5pbmRleE9mKG5vZGUpLCAwLCBuZXdJdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZGF0YS5jaGlsZHJlbi5zcGxpY2UodGhpcy5kYXRhLmNoaWxkcmVuLmluZGV4T2Yobm9kZSksIDAsIG5ld0l0ZW0pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5kYXRhQ2hhbmdlLm5leHQodGhpcy5kYXRhKTtcclxuICAgIHJldHVybiBuZXdJdGVtO1xyXG4gIH1cclxuXHJcbiAgaW5zZXJ0SXRlbUJlbG93KG5vZGU6IEZpbGVOb2RlLCBub2RlRHJhZzogRmlsZU5vZGUpOiBGaWxlTm9kZSB7XHJcbiAgICBjb25zdCBwYXJlbnROb2RlID0gdGhpcy5nZXRQYXJlbnRGcm9tTm9kZXMobm9kZSk7XHJcbiAgIFxyXG4gICAgY29uc3QgbmV3SXRlbSA9IHRoaXMuZ2V0TmV3SXRlbShub2RlRHJhZylcclxuICAgIG5ld0l0ZW0ucGFyZW50ID0gcGFyZW50Tm9kZT09bnVsbCB8fCBwYXJlbnROb2RlLmlkPT11bmRlZmluZWQ/bnVsbDpwYXJlbnROb2RlLmlkO1xyXG5cclxuICAgIGlmIChwYXJlbnROb2RlICE9IG51bGwpIHtcclxuICAgICAgcGFyZW50Tm9kZS5jaGlsZHJlbi5zcGxpY2UocGFyZW50Tm9kZS5jaGlsZHJlbi5pbmRleE9mKG5vZGUpICsgMSwgMCwgbmV3SXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmRhdGEuY2hpbGRyZW4uc3BsaWNlKHRoaXMuZGF0YS5jaGlsZHJlbi5pbmRleE9mKG5vZGUpICsgMSwgMCwgbmV3SXRlbSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmRhdGFDaGFuZ2UubmV4dCh0aGlzLmRhdGEpO1xyXG4gICAgcmV0dXJuIG5ld0l0ZW07XHJcbiAgfVxyXG5cclxuICBcclxuICBnZXRQYXJlbnRGcm9tTm9kZXMobm9kZTogRmlsZU5vZGUpOiBGaWxlTm9kZSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZGF0YS5jaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG4gICAgICBjb25zdCBjdXJyZW50Um9vdCA9IHRoaXMuZGF0YS5jaGlsZHJlbltpXTtcclxuICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnQoY3VycmVudFJvb3QsIG5vZGUpO1xyXG4gICAgICBpZiAocGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gcGFyZW50O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIFxyXG4gIGdldFBhcmVudChjdXJyZW50Um9vdDogRmlsZU5vZGUsIG5vZGU6IEZpbGVOb2RlKTogRmlsZU5vZGUge1xyXG4gICAgaWYgKGN1cnJlbnRSb290LmNoaWxkcmVuICYmIGN1cnJlbnRSb290LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Um9vdC5jaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkID0gY3VycmVudFJvb3QuY2hpbGRyZW5baV07XHJcbiAgICAgICAgaWYgKGNoaWxkID09PSBub2RlKSB7XHJcbiAgICAgICAgICByZXR1cm4gY3VycmVudFJvb3Q7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjaGlsZC5jaGlsZHJlbiAmJiBjaGlsZC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmdldFBhcmVudChjaGlsZCwgbm9kZSk7XHJcbiAgICAgICAgICBpZiAocGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAdGl0bGUgVHJlZSB3aXRoIGZsYXQgbm9kZXNcclxuICovXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWRhdGEtdHJlZScsXHJcbiAgdGVtcGxhdGVVcmw6ICdkYXRhLXRyZWUuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydkYXRhLXRyZWUuY29tcG9uZW50LnNjc3MnXSxcclxuICBwcm92aWRlcnM6IFtGaWxlRGF0YWJhc2VdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEYXRhVHJlZUNvbXBvbmVudCB7XHJcbiAgQE91dHB1dCgpIGNyZWF0ZU5vZGU6IEV2ZW50RW1pdHRlcjxhbnk+O1xyXG4gIEBPdXRwdXQoKSBjcmVhdGVGb2xkZXI6IEV2ZW50RW1pdHRlcjxhbnk+O1xyXG4gIEBPdXRwdXQoKSBlbWl0Tm9kZTogRXZlbnRFbWl0dGVyPGFueT47XHJcbiAgQE91dHB1dCgpIGVtaXRBbGxOb2RlczogRXZlbnRFbWl0dGVyPGFueT47XHJcbiAgQElucHV0KCkgZXZlbnROb2RlVXBkYXRlZFN1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZSA8YW55PiA7XHJcbiAgQElucHV0KCkgZXZlbnRDcmVhdGVOb2RlU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlIDxhbnk+IDtcclxuICBASW5wdXQoKSBldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb246IE9ic2VydmFibGUgPGFueT4gO1xyXG4gIEBJbnB1dCgpIGV2ZW50UmVmcmVzaFN1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZSA8YW55PiA7XHJcbiAgcHJpdmF0ZSBfZXZlbnROb2RlVXBkYXRlZFN1YnNjcmlwdGlvbjogYW55O1xyXG4gIHByaXZhdGUgX2V2ZW50Q3JlYXRlTm9kZVN1YnNjcmlwdGlvbjogYW55O1xyXG4gIHByaXZhdGUgX2V2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbjogYW55O1xyXG4gIHByaXZhdGUgX2V2ZW50UmVmcmVzaFN1YnNjcmlwdGlvbjogYW55O1xyXG4gIHRyZWVDb250cm9sOiBGbGF0VHJlZUNvbnRyb2w8RmlsZUZsYXROb2RlPjtcclxuICB0cmVlRmxhdHRlbmVyOiBNYXRUcmVlRmxhdHRlbmVyPEZpbGVOb2RlLCBGaWxlRmxhdE5vZGU+O1xyXG4gIGRhdGFTb3VyY2U6IE1hdFRyZWVGbGF0RGF0YVNvdXJjZTxGaWxlTm9kZSwgRmlsZUZsYXROb2RlPjtcclxuICAvLyBleHBhbnNpb24gbW9kZWwgdHJhY2tzIGV4cGFuc2lvbiBzdGF0ZVxyXG4gIGV4cGFuc2lvbk1vZGVsID0gbmV3IFNlbGVjdGlvbk1vZGVsPHN0cmluZz4odHJ1ZSk7XHJcbiAgZHJhZ2dpbmcgPSBmYWxzZTtcclxuICBleHBhbmRUaW1lb3V0OiBhbnk7XHJcbiAgZXhwYW5kRGVsYXkgPSAxMDAwO1xyXG4gIHZhbGlkYXRlRHJvcCA9IGZhbHNlO1xyXG4gIHRyZWVEYXRhOiBhbnk7XHJcblxyXG4gIEBJbnB1dCgpIGdldEFsbDogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+O1xyXG5cclxuXHJcbiAgLyogRHJhZyBhbmQgZHJvcCAqL1xyXG4gIGRyYWdOb2RlOiBhbnk7XHJcbiAgZHJhZ05vZGVFeHBhbmRPdmVyV2FpdFRpbWVNcyA9IDE1MDA7XHJcbiAgZHJhZ05vZGVFeHBhbmRPdmVyTm9kZTogYW55O1xyXG4gIGRyYWdOb2RlRXhwYW5kT3ZlclRpbWU6IG51bWJlcjtcclxuICBkcmFnTm9kZUV4cGFuZE92ZXJBcmVhOiBzdHJpbmc7XHJcbiAgQFZpZXdDaGlsZCgnZW1wdHlJdGVtJykgZW1wdHlJdGVtOiBFbGVtZW50UmVmO1xyXG5cclxuICAgIC8qKiBNYXAgZnJvbSBmbGF0IG5vZGUgdG8gbmVzdGVkIG5vZGUuIFRoaXMgaGVscHMgdXMgZmluZGluZyB0aGUgbmVzdGVkIG5vZGUgdG8gYmUgbW9kaWZpZWQgKi9cclxuICAgIGZsYXROb2RlTWFwID0gbmV3IE1hcDxGaWxlRmxhdE5vZGUsIEZpbGVOb2RlPigpO1xyXG5cclxuICAgIC8qKiBNYXAgZnJvbSBuZXN0ZWQgbm9kZSB0byBmbGF0dGVuZWQgbm9kZS4gVGhpcyBoZWxwcyB1cyB0byBrZWVwIHRoZSBzYW1lIG9iamVjdCBmb3Igc2VsZWN0aW9uICovXHJcbiAgICBuZXN0ZWROb2RlTWFwID0gbmV3IE1hcDxGaWxlTm9kZSwgRmlsZUZsYXROb2RlPigpO1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIGRhdGFiYXNlOiBGaWxlRGF0YWJhc2UpIHtcclxuICAgIHRoaXMuZW1pdE5vZGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmNyZWF0ZU5vZGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmNyZWF0ZUZvbGRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuZW1pdEFsbE5vZGVzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy50cmVlRmxhdHRlbmVyID0gbmV3IE1hdFRyZWVGbGF0dGVuZXIodGhpcy50cmFuc2Zvcm1lciwgdGhpcy5fZ2V0TGV2ZWwsXHJcbiAgICAgIHRoaXMuX2lzRXhwYW5kYWJsZSwgdGhpcy5fZ2V0Q2hpbGRyZW4pO1xyXG4gICAgdGhpcy50cmVlQ29udHJvbCA9IG5ldyBGbGF0VHJlZUNvbnRyb2w8RmlsZUZsYXROb2RlPih0aGlzLl9nZXRMZXZlbCwgdGhpcy5faXNFeHBhbmRhYmxlKTtcclxuICAgIHRoaXMuZGF0YVNvdXJjZSA9IG5ldyBNYXRUcmVlRmxhdERhdGFTb3VyY2UodGhpcy50cmVlQ29udHJvbCwgdGhpcy50cmVlRmxhdHRlbmVyKTtcclxuIFxyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKXtcclxuXHJcbiAgICBpZih0aGlzLmV2ZW50Tm9kZVVwZGF0ZWRTdWJzY3JpcHRpb24pXHJcbiAgICB7XHJcbiAgICAgIHRoaXMuZXZlbnROb2RlVXBkYXRlZFN1YnNjcmlwdGlvbi5zdWJzY3JpYmUoXHJcbiAgICAgICAgKG5vZGUpID0+IHtcclxuICAgICAgICAgIHRoaXMudXBkYXRlTm9kZShub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIGlmKHRoaXMuZXZlbnRDcmVhdGVOb2RlU3Vic2NyaXB0aW9uKVxyXG4gICAge1xyXG4gICAgICB0aGlzLmV2ZW50Q3JlYXRlTm9kZVN1YnNjcmlwdGlvbi5zdWJzY3JpYmUoXHJcbiAgICAgICAgKG5vZGUpID0+IHtcclxuICAgICAgICAgIGlmKG5vZGUuaXNGb2xkZXIpIHRoaXMuY3JlYXRlTmV3Rm9sZGVyKG5vZGUpO1xyXG4gICAgICAgICAgZWxzZSB0aGlzLmNyZWF0ZU5ld05vZGUobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbWl0QWxsUm93cygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5ldmVudFJlZnJlc2hTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5fZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uID0gdGhpcy5ldmVudFJlZnJlc2hTdWJzY3JpcHRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLmdldEVsZW1lbnRzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0aGlzLmdldEVsZW1lbnRzKCk7XHJcbiAgfVxyXG5cclxuICBnZXRFbGVtZW50cygpOiB2b2lkIHtcclxuICAgIHRoaXMuZ2V0QWxsKClcclxuICAgIC5zdWJzY3JpYmUoKGl0ZW1zKSA9PiB7XHJcbiAgICAgIHRoaXMudHJlZURhdGEgPSBpdGVtcztcclxuICAgICAgdGhpcy5kYXRhYmFzZS5pbml0aWFsaXplKHRoaXMudHJlZURhdGEpO1xyXG4gICAgICB0aGlzLmRhdGFiYXNlLmRhdGFDaGFuZ2Uuc3Vic2NyaWJlKGRhdGEgPT4gdGhpcy5yZWJ1aWxkVHJlZUZvckRhdGEoW2RhdGFdKSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICB0cmFuc2Zvcm1lciA9IChub2RlOiBGaWxlTm9kZSwgbGV2ZWw6IG51bWJlcikgPT4ge1xyXG4gICAgY29uc3QgZXhpc3RpbmdOb2RlID0gdGhpcy5uZXN0ZWROb2RlTWFwLmdldChub2RlKTtcclxuICAgIGNvbnN0IGZsYXROb2RlID0gZXhpc3RpbmdOb2RlICYmIGV4aXN0aW5nTm9kZS5uYW1lID09PSBub2RlLm5hbWVcclxuICAgICAgPyBleGlzdGluZ05vZGVcclxuICAgICAgOiBuZXcgRmlsZUZsYXROb2RlKChub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCksbm9kZS5uYW1lLGxldmVsLG5vZGUudHlwZSxub2RlLmlkLG5vZGUuc3RhdHVzKTtcclxuXHJcbiAgICB0aGlzLmZsYXROb2RlTWFwLnNldChmbGF0Tm9kZSwgbm9kZSk7XHJcbiAgICB0aGlzLm5lc3RlZE5vZGVNYXAuc2V0KG5vZGUsIGZsYXROb2RlKTtcclxuICAgIHJldHVybiBmbGF0Tm9kZTtcclxuICBcclxuICB9XHJcbiAgcHJpdmF0ZSBfZ2V0TGV2ZWwgPSAobm9kZTogRmlsZUZsYXROb2RlKSA9PiBub2RlLmxldmVsO1xyXG4gIHByaXZhdGUgX2lzRXhwYW5kYWJsZSA9IChub2RlOiBGaWxlRmxhdE5vZGUpID0+IG5vZGUuZXhwYW5kYWJsZTtcclxuICBwcml2YXRlIF9nZXRDaGlsZHJlbiA9IChub2RlOiBGaWxlTm9kZSk6IE9ic2VydmFibGU8RmlsZU5vZGVbXT4gPT4gb2JzZXJ2YWJsZU9mKG5vZGUuY2hpbGRyZW4pO1xyXG4gIGhhc0NoaWxkID0gKF86IG51bWJlciwgX25vZGVEYXRhOiBGaWxlRmxhdE5vZGUpID0+IF9ub2RlRGF0YS5leHBhbmRhYmxlO1xyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogVGhpcyBjb25zdHJ1Y3RzIGFuIGFycmF5IG9mIG5vZGVzIHRoYXQgbWF0Y2hlcyB0aGUgRE9NXHJcbiAgICovXHJcbiAgdmlzaWJsZU5vZGVzKCk6IEZpbGVOb2RlW10ge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkRXhwYW5kZWRDaGlsZHJlbihub2RlOiBGaWxlTm9kZSwgZXhwYW5kZWQ6IHN0cmluZ1tdKSB7XHJcbiAgICAgIHJlc3VsdC5wdXNoKG5vZGUpO1xyXG4gICAgICBpZiAoZXhwYW5kZWQuaW5kZXhPZihub2RlLmlkKSAhPSAtMSkge1xyXG4gICAgICAgIG5vZGUuY2hpbGRyZW4ubWFwKChjaGlsZCkgPT4gYWRkRXhwYW5kZWRDaGlsZHJlbihjaGlsZCwgZXhwYW5kZWQpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5kYXRhU291cmNlLmRhdGEuZm9yRWFjaCgobm9kZSkgPT4ge1xyXG4gICAgICBhZGRFeHBhbmRlZENoaWxkcmVuKG5vZGUsIHRoaXMuZXhwYW5zaW9uTW9kZWwuc2VsZWN0ZWQpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcblxyXG4gICBmaW5kTm9kZVNpYmxpbmdzKGFycjogQXJyYXk8YW55PiwgaWQ6IHN0cmluZyk6IEFycmF5PGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdCwgc3ViUmVzdWx0O1xyXG4gICAgYXJyLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuICAgICAgaWYgKGl0ZW0uaWQgPT09IGlkKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gYXJyO1xyXG4gICAgICB9IGVsc2UgaWYgKGl0ZW0uY2hpbGRyZW4pIHtcclxuICAgICAgICBzdWJSZXN1bHQgPSB0aGlzLmZpbmROb2RlU2libGluZ3MoaXRlbS5jaGlsZHJlbiwgaWQpO1xyXG4gICAgICAgIGlmIChzdWJSZXN1bHQpIHJlc3VsdCA9IHN1YlJlc3VsdDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG5cclxuICB9XHJcblxyXG5cclxuICBoYW5kbGVEcmFnU3RhcnQoZXZlbnQsIG5vZGUpIHtcclxuICAgIC8vIFJlcXVpcmVkIGJ5IEZpcmVmb3ggKGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE5MDU1MjY0L3doeS1kb2VzbnQtaHRtbDUtZHJhZy1hbmQtZHJvcC13b3JrLWluLWZpcmVmb3gpXHJcbiAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSgnZm9vJywgJ2JhcicpO1xyXG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZSh0aGlzLmVtcHR5SXRlbS5uYXRpdmVFbGVtZW50LCAwLCAwKTtcclxuICAgIHRoaXMuZHJhZ05vZGUgPSBub2RlO1xyXG4gICAgdGhpcy50cmVlQ29udHJvbC5jb2xsYXBzZShub2RlKTtcclxuICB9XHJcblxyXG4gIGhhbmRsZURyYWdPdmVyKGV2ZW50LCBub2RlKSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIC8vIEhhbmRsZSBub2RlIGV4cGFuZFxyXG4gICAgaWYgKG5vZGUgPT09IHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyTm9kZSkge1xyXG4gICAgICBpZiAodGhpcy5kcmFnTm9kZSAhPT0gbm9kZSAmJiAhdGhpcy50cmVlQ29udHJvbC5pc0V4cGFuZGVkKG5vZGUpKSB7XHJcbiAgICAgICAgaWYgKChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyVGltZSkgPiB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlcldhaXRUaW1lTXMpIHtcclxuICAgICAgICAgIHRoaXMudHJlZUNvbnRyb2wuZXhwYW5kKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJOb2RlID0gbm9kZTtcclxuICAgICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGFuZGxlIGRyYWcgYXJlYVxyXG4gICAgY29uc3QgcGVyY2VudGFnZVggPSBldmVudC5vZmZzZXRYIC8gZXZlbnQudGFyZ2V0LmNsaWVudFdpZHRoO1xyXG4gICAgY29uc3QgcGVyY2VudGFnZVkgPSBldmVudC5vZmZzZXRZIC8gZXZlbnQudGFyZ2V0LmNsaWVudEhlaWdodDtcclxuICAgIGlmIChwZXJjZW50YWdlWSA8IDAuMjUpIHtcclxuICAgICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJBcmVhID0gJ2Fib3ZlJztcclxuICAgIH0gZWxzZSBpZiAocGVyY2VudGFnZVkgPiAwLjc1KSB7XHJcbiAgICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyQXJlYSA9ICdiZWxvdyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlckFyZWEgPSAnY2VudGVyJztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhhbmRsZURyb3AoZXZlbnQsIG5vZGUpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBsZXQgdG9GbGF0Tm9kZT10aGlzLmZsYXROb2RlTWFwLmdldChub2RlKTtcclxuICAgIGxldCBmcm9tRmxhdE5vZGU9dGhpcy5mbGF0Tm9kZU1hcC5nZXQodGhpcy5kcmFnTm9kZSlcclxuICAgIGlmIChub2RlICE9PSB0aGlzLmRyYWdOb2RlICYmICh0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlckFyZWEgIT09ICdjZW50ZXInIHx8ICh0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlckFyZWEgPT09ICdjZW50ZXInICYmIHRvRmxhdE5vZGUuaXNGb2xkZXIpKSkge1xyXG4gICAgICBsZXQgbmV3SXRlbTogRmlsZU5vZGU7XHJcblxyXG4gICAgICBpZiAodGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJBcmVhID09PSAnYWJvdmUnKSB7XHJcbiAgICAgICAgbmV3SXRlbSA9IHRoaXMuZGF0YWJhc2UuY29weVBhc3RlSXRlbUFib3ZlKGZyb21GbGF0Tm9kZSx0b0ZsYXROb2RlKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlckFyZWEgPT09ICdiZWxvdycpIHtcclxuICAgICAgICBuZXdJdGVtID0gdGhpcy5kYXRhYmFzZS5jb3B5UGFzdGVJdGVtQmVsb3coZnJvbUZsYXROb2RlLHRvRmxhdE5vZGUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG5ld0l0ZW0gPSB0aGlzLmRhdGFiYXNlLmNvcHlQYXN0ZUl0ZW0oZnJvbUZsYXROb2RlLCB0b0ZsYXROb2RlKTtcclxuICAgICAgfVxyXG4gICAgICBsZXQgcGFyZW50THZsPXRoaXMudHJlZUNvbnRyb2wuZGF0YU5vZGVzLmZpbmQoKG4pID0+IG4uaWQgPT09IGZyb21GbGF0Tm9kZS5pZCkubGV2ZWw7XHJcbiAgICAgIGZyb21GbGF0Tm9kZS5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkPT57XHJcbiAgICAgICAgdGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXMuZmluZCgobikgPT4gbi5pZCA9PT0gY2hpbGQuaWQpLmxldmVsPXBhcmVudEx2bCsxXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmRhdGFiYXNlLmRlbGV0ZUl0ZW0odGhpcy5mbGF0Tm9kZU1hcC5nZXQodGhpcy5kcmFnTm9kZSkpO1xyXG4gICAgICB0aGlzLnRyZWVDb250cm9sLmV4cGFuZERlc2NlbmRhbnRzKHRoaXMubmVzdGVkTm9kZU1hcC5nZXQobmV3SXRlbSkpO1xyXG4gICAgfVxyXG4gICBcclxuICAgIHRoaXMuZHJhZ05vZGUgPSBudWxsO1xyXG4gICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJOb2RlID0gbnVsbDtcclxuICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyVGltZSA9IDA7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVEcmFnRW5kKGV2ZW50KSB7XHJcbiAgICB0aGlzLmRyYWdOb2RlID0gbnVsbDtcclxuICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyTm9kZSA9IG51bGw7XHJcbiAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlclRpbWUgPSAwO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGZvbGxvd2luZyBtZXRob2RzIGFyZSBmb3IgcGVyc2lzdGluZyB0aGUgdHJlZSBleHBhbmQgc3RhdGVcclxuICAgKiBhZnRlciBiZWluZyByZWJ1aWx0XHJcbiAgICovXHJcblxyXG4gIHJlYnVpbGRUcmVlRm9yRGF0YShkYXRhOiBhbnlbXSkge1xyXG4gICAgLy90aGlzLmRhdGFTb3VyY2UuZGF0YSA9IGRhdGE7XHJcblxyXG4gICAgdGhpcy5kYXRhU291cmNlLmRhdGEgPSBbXTtcclxuICAgIHRoaXMuZGF0YVNvdXJjZS5kYXRhID0gZGF0YTtcclxuICAgIHRoaXMudHJlZUNvbnRyb2wuZXhwYW5zaW9uTW9kZWwuc2VsZWN0ZWQuZm9yRWFjaCgobm9kZUFjdCkgPT4ge1xyXG4gICAgICBjb25zdCBub2RlID0gdGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXMuZmluZCgobikgPT4gbi5pZCA9PT0gbm9kZUFjdC5pZCk7XHJcbiAgICAgIHRoaXMudHJlZUNvbnRyb2wuZXhwYW5kKG5vZGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFBhcmVudE5vZGUobm9kZTogRmlsZUZsYXROb2RlKTogRmlsZUZsYXROb2RlIHwgbnVsbCB7XHJcbiAgICBjb25zdCBjdXJyZW50TGV2ZWwgPSBub2RlLmxldmVsO1xyXG4gICAgaWYgKGN1cnJlbnRMZXZlbCA8IDEpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzdGFydEluZGV4ID0gdGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXMuaW5kZXhPZihub2RlKSAtIDE7XHJcbiAgICBmb3IgKGxldCBpID0gc3RhcnRJbmRleDsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgY29uc3QgY3VycmVudE5vZGUgPSB0aGlzLnRyZWVDb250cm9sLmRhdGFOb2Rlc1tpXTtcclxuICAgICAgaWYgKGN1cnJlbnROb2RlLmxldmVsIDwgY3VycmVudExldmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHVwZGF0ZU5vZGUobm9kZVVwZGF0ZWQpXHJcbiAge1xyXG4gICAgY29uc3QgZGF0YVRvQ2hhbmdlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGFTb3VyY2UuZGF0YSkpXHJcbiAgICBjb25zdCBzaWJsaW5ncyA9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhkYXRhVG9DaGFuZ2UsIG5vZGVVcGRhdGVkLmlkKTtcclxuICAgIGxldCBpbmRleD0gc2libGluZ3MuZmluZEluZGV4KG5vZGUgPT4gbm9kZS5pZCA9PT0gbm9kZVVwZGF0ZWQuaWQpXHJcbiAgICBzaWJsaW5nc1tpbmRleF09bm9kZVVwZGF0ZWQ7XHJcbiAgICB0aGlzLnJlYnVpbGRUcmVlRm9yRGF0YShkYXRhVG9DaGFuZ2UpO1xyXG5cclxuICB9XHJcblxyXG4gIGNyZWF0ZU5ld0ZvbGRlcihuZXdGb2xkZXIpXHJcbiAge1xyXG4gICAgbmV3Rm9sZGVyLnR5cGU9XCJmb2xkZXJcIjtcclxuICAgIGNvbnN0IGRhdGFUb0NoYW5nZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhU291cmNlLmRhdGEpKVxyXG4gICAgaWYobmV3Rm9sZGVyLnBhcmVudCA9PT0gbnVsbCkge2RhdGFUb0NoYW5nZVswXS5jaGlsZHJlbi5wdXNoKG5ld0ZvbGRlcil9XHJcbiAgICBlbHNle1xyXG4gICAgICBjb25zdCBzaWJsaW5ncyA9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhkYXRhVG9DaGFuZ2UsIG5ld0ZvbGRlci5wYXJlbnQpO1xyXG4gICAgICBsZXQgaW5kZXg9IHNpYmxpbmdzLmZpbmRJbmRleChub2RlID0+IG5vZGUuaWQgPT09IG5ld0ZvbGRlci5wYXJlbnQpO1xyXG4gICAgICBzaWJsaW5nc1tpbmRleF0uY2hpbGRyZW4ucHVzaChuZXdGb2xkZXIpXHJcbiAgICB9XHJcbiAgICB0aGlzLnJlYnVpbGRUcmVlRm9yRGF0YShkYXRhVG9DaGFuZ2UpO1xyXG5cclxuICB9XHJcblxyXG4gIGNyZWF0ZU5ld05vZGUobmV3Tm9kZSlcclxuICB7XHJcbiAgICBuZXdOb2RlLnR5cGU9XCJub2RlXCI7XHJcbiAgICBjb25zdCBkYXRhVG9DaGFuZ2UgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YVNvdXJjZS5kYXRhKSlcclxuICAgIGlmKG5ld05vZGUucGFyZW50ID09PSBudWxsKSB7ZGF0YVRvQ2hhbmdlWzBdLmNoaWxkcmVuLnB1c2gobmV3Tm9kZSl9XHJcbiAgICBlbHNle1xyXG4gICAgY29uc3Qgc2libGluZ3MgPSB0aGlzLmZpbmROb2RlU2libGluZ3MoZGF0YVRvQ2hhbmdlLCBuZXdOb2RlLnBhcmVudCk7XHJcbiAgICBsZXQgaW5kZXg9IHNpYmxpbmdzLmZpbmRJbmRleChub2RlID0+IG5vZGUuaWQgPT09IG5ld05vZGUucGFyZW50KTtcclxuICAgIHNpYmxpbmdzW2luZGV4XS5jaGlsZHJlbi5wdXNoKG5ld05vZGUpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZWJ1aWxkVHJlZUZvckRhdGEoZGF0YVRvQ2hhbmdlKTtcclxuXHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIG9uQnV0dG9uQ2xpY2tlZChpZCwgYnV0dG9uOiBzdHJpbmcpXHJcbiAge1xyXG4gICAgY29uc3QgY2hhbmdlZERhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YVNvdXJjZS5kYXRhKSlcclxuICAgIGNvbnN0IHNpYmxpbmdzID0gdGhpcy5maW5kTm9kZVNpYmxpbmdzKGNoYW5nZWREYXRhLCBpZCk7XHJcbiAgICBsZXQgbm9kZUNsaWNrZWQ9IHNpYmxpbmdzLmZpbmQobm9kZSA9PiBub2RlLmlkID09PSBpZCk7XHJcbiAgICBpZihidXR0b24gPT09J2VkaXQnKSAge3RoaXMuZW1pdE5vZGUuZW1pdChub2RlQ2xpY2tlZCl9XHJcbiAgICBlbHNlIGlmKGJ1dHRvbiA9PT0gJ25ld0ZvbGRlcicpIHt0aGlzLmNyZWF0ZUZvbGRlci5lbWl0KG5vZGVDbGlja2VkKX1cclxuICAgIGVsc2UgaWYoYnV0dG9uID09PSAnbmV3Tm9kZScpIHt0aGlzLmNyZWF0ZU5vZGUuZW1pdCggbm9kZUNsaWNrZWQpfVxyXG4gICAgZWxzZSBpZihidXR0b24gPT09ICdkZWxldGUnKSB7XHJcbiAgICAgIC8vIGxldCBjaGlsZHJlbj0gdGhpcy5nZXRBbGxDaGlsZHJlbihub2RlQ2xpY2tlZC5jaGlsZHJlbilcclxuICAgICAgLy8gY2hpbGRyZW4uZm9yRWFjaChjaGlsZHJlbiA9PiB7XHJcbiAgICAgIC8vICAgY2hpbGRyZW4uc3RhdHVzPSdwZW5kaW5nRGVsZXRlJztcclxuICAgICAgLy8gfSk7XHJcbiAgICAgIHRoaXMuZGVsZXRlQ2hpbGRyZW4obm9kZUNsaWNrZWQuY2hpbGRyZW4pO1xyXG4gICAgICAvLyBub2RlQ2xpY2tlZC5jaGlsZHJlbj1jaGlsZHJlblxyXG4gICAgICBub2RlQ2xpY2tlZC5zdGF0dXM9J3BlbmRpbmdEZWxldGUnXHJcbiAgICAgIFxyXG4gICAgICB0aGlzLnJlYnVpbGRUcmVlRm9yRGF0YShjaGFuZ2VkRGF0YSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZW1pdEFsbFJvd3MoKVxyXG4gIHtcclxuICAgIGNvbnN0IGRhdGFUb0VtaXQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YVNvdXJjZS5kYXRhKSlcclxuICAgIGxldCBhbGxSb3dzID0gdGhpcy5nZXRBbGxDaGlsZHJlbihkYXRhVG9FbWl0KTsgXHJcbiAgICB0aGlzLmVtaXRBbGxOb2Rlcy5lbWl0KGFsbFJvd3MpO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWxsQ2hpbGRyZW4oYXJyKVxyXG4gIHtcclxuICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgIGxldCBzdWJSZXN1bHQ7XHJcbiAgICBhcnIuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS5jaGlsZHJlbi5sZW5ndGg+MCkge1xyXG4gICAgICAgIHN1YlJlc3VsdCA9IHRoaXMuZ2V0QWxsQ2hpbGRyZW4oaXRlbS5jaGlsZHJlbik7XHJcbiAgICAgICAgaWYgKHN1YlJlc3VsdCkgcmVzdWx0LnB1c2goLi4uc3ViUmVzdWx0KTtcclxuICAgICAgfVxyXG4gICAgICByZXN1bHQucHVzaChpdGVtKTtcclxuXHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBkZWxldGVDaGlsZHJlbihhcnIpXHJcbiAge1xyXG4gICAgYXJyLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4ubGVuZ3RoPjApIHtcclxuICAgICAgICB0aGlzLmRlbGV0ZUNoaWxkcmVuKGl0ZW0uY2hpbGRyZW4pO1xyXG4gICAgICB9XHJcbiAgICAgIGl0ZW0uc3RhdHVzPSdwZW5kaW5nRGVsZXRlJ1xyXG5cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcblxyXG4iXX0=