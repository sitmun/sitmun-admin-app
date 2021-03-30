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
                order: 0,
                children: [],
                id: 0
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
            map['root'].order = 0;
            map['root'].isFolder = true;
            map['root'].isRoot = true;
        }
        return map['root'];
    }
    /**
     * @param {?} node
     * @param {?} changedData
     * @return {?}
     */
    deleteItem(node, changedData) {
        this.deleteNode(changedData.children, node);
        this.dataChange.next(changedData);
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
     * @param {?} changedData
     * @return {?}
     */
    copyPasteItem(from, to, changedData) {
        /** @type {?} */
        const newItem = this.insertItem(to, from, changedData);
        return newItem;
    }
    /**
     * @param {?} from
     * @param {?} to
     * @param {?} changedData
     * @return {?}
     */
    copyPasteItemAbove(from, to, changedData) {
        /** @type {?} */
        const newItem = this.insertItemAbove(to, from, changedData);
        return newItem;
    }
    /**
     * @param {?} from
     * @param {?} to
     * @param {?} changedData
     * @return {?}
     */
    copyPasteItemBelow(from, to, changedData) {
        /** @type {?} */
        const newItem = this.insertItemBelow(to, from, changedData);
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
     * @param {?} changedData
     * @return {?}
     */
    insertItem(parent, node, changedData) {
        if (!parent.children) {
            parent.children = [];
        }
        /** @type {?} */
        const newItem = this.getNewItem(node);
        newItem.parent = parent == null || parent.id == undefined ? null : parent.id;
        parent.children.push(newItem);
        this.dataChange.next(changedData);
        return newItem;
    }
    /**
     * @param {?} node
     * @param {?} nodeDrag
     * @param {?} changedData
     * @return {?}
     */
    insertItemAbove(node, nodeDrag, changedData) {
        /** @type {?} */
        const parentNode = this.getParentFromNodes(node, changedData);
        /** @type {?} */
        const newItem = this.getNewItem(nodeDrag);
        newItem.parent = parentNode == null || parentNode.id == undefined ? null : parentNode.id;
        if (parentNode != null) {
            parentNode.children.splice(parentNode.children.indexOf(node), 0, newItem);
        }
        else {
            changedData.children.splice(changedData.children.indexOf(node), 0, newItem);
        }
        this.dataChange.next(changedData);
        return newItem;
    }
    /**
     * @param {?} node
     * @param {?} nodeDrag
     * @param {?} changedData
     * @return {?}
     */
    insertItemBelow(node, nodeDrag, changedData) {
        /** @type {?} */
        const parentNode = this.getParentFromNodes(node, changedData);
        /** @type {?} */
        const newItem = this.getNewItem(nodeDrag);
        newItem.parent = parentNode == null || parentNode.id == undefined ? null : parentNode.id;
        if (parentNode != null) {
            parentNode.children.splice(parentNode.children.indexOf(node) + 1, 0, newItem);
        }
        else {
            changedData.children.splice(changedData.children.indexOf(node) + 1, 0, newItem);
        }
        this.dataChange.next(changedData);
        return newItem;
    }
    /**
     * @param {?} node
     * @param {?} changedData
     * @return {?}
     */
    getParentFromNodes(node, changedData) {
        for (let i = 0; i < changedData.children.length; ++i) {
            /** @type {?} */
            const currentRoot = changedData.children[i];
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
        const changedData = JSON.parse(JSON.stringify(this.dataSource.data));
        /** @type {?} */
        let toFlatNode = this.findNodeSiblings(changedData[0].children, node.id).find(nodeAct => nodeAct.id === node.id);
        /** @type {?} */
        let fromFlatNode = this.findNodeSiblings(changedData[0].children, this.dragNode.id).find(nodeAct => nodeAct.id === this.dragNode.id);
        if (this.dragNode.status != "pendingDelete" && node !== this.dragNode && (this.dragNodeExpandOverArea !== 'center' || (this.dragNodeExpandOverArea === 'center' && toFlatNode.isFolder))) {
            /** @type {?} */
            let newItem;
            if (this.dragNodeExpandOverArea === 'above') {
                newItem = this.database.copyPasteItemAbove(fromFlatNode, toFlatNode, changedData[0]);
            }
            else if (this.dragNodeExpandOverArea === 'below') {
                newItem = this.database.copyPasteItemBelow(fromFlatNode, toFlatNode, changedData[0]);
            }
            else {
                newItem = this.database.copyPasteItem(fromFlatNode, toFlatNode, changedData[0]);
            }
            /** @type {?} */
            let parentLvl = this.treeControl.dataNodes.find((n) => n.id === fromFlatNode.id).level;
            fromFlatNode.children.forEach(child => {
                this.treeControl.dataNodes.find((n) => n.id === child.id).level = parentLvl + 1;
            });
            this.database.deleteItem(fromFlatNode, changedData[0]);
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
    sortByOrder(data) {
        data.sort((a, b) => a.order.toString().localeCompare(b.order.toString()));
        data.forEach((item) => {
            if (item.children.length > 0) {
                this.sortByOrder(item.children);
            }
        });
    }
    /**
     * @param {?} data
     * @return {?}
     */
    rebuildTreeForData(data) {
        //this.dataSource.data = data;
        this.sortByOrder(data);
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
            newFolder.order = dataToChange[0].children.length;
            dataToChange[0].children.push(newFolder);
        }
        else {
            /** @type {?} */
            const siblings = this.findNodeSiblings(dataToChange, newFolder.parent);
            /** @type {?} */
            let index = siblings.findIndex(node => node.id === newFolder.parent);
            newFolder.order = siblings[index].children.length;
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
            newNode.order = dataToChange[0].children.length;
            dataToChange[0].children.push(newNode);
        }
        else {
            /** @type {?} */
            const siblings = this.findNodeSiblings(dataToChange, newNode.parent);
            /** @type {?} */
            let index = siblings.findIndex(node => node.id === newNode.parent);
            newNode.order = siblings[index].children.length;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS10cmVlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGF0YS10cmVlL2RhdGEtdHJlZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pHLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2pGLE9BQU8sRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLEVBQUUsSUFBSSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFdkUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7OztBQU8xRCxNQUFNLE9BQU8sUUFBUTtDQXNCcEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdELE1BQU0sT0FBTyxZQUFZOzs7Ozs7Ozs7SUFDdkIsWUFDUyxZQUNBLE1BQ0EsT0FDQSxNQUNBLElBQ0E7UUFMQSxlQUFVLEdBQVYsVUFBVTtRQUNWLFNBQUksR0FBSixJQUFJO1FBQ0osVUFBSyxHQUFMLEtBQUs7UUFDTCxTQUFJLEdBQUosSUFBSTtRQUNKLE9BQUUsR0FBRixFQUFFO1FBQ0YsV0FBTSxHQUFOLE1BQU07S0FDVjtDQUNOOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBWUQsTUFBTSxPQUFPLFlBQVk7SUFJdkI7MEJBSGEsSUFBSSxlQUFlLENBQWEsRUFBRSxDQUFDO0tBSy9DOzs7O0lBSkQsSUFBSSxJQUFJLEtBQVUs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QUFDO0tBQ0o7OztZQWxYRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLDQ0SEFBdUM7Z0JBRXZDLFNBQVMsRUFBRSxDQUFDLFlBQVksQ0FBQzs7YUFDMUI7Ozs7WUEyQzhCLFlBQVk7Ozt5QkF6Q3hDLE1BQU07MkJBQ04sTUFBTTt1QkFDTixNQUFNOzJCQUNOLE1BQU07MkNBQ04sS0FBSzswQ0FDTCxLQUFLOzBDQUNMLEtBQUs7dUNBQ0wsS0FBSztxQkFnQkwsS0FBSzt3QkFTTCxTQUFTLFNBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZsYXRUcmVlQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdGFibGUsIElucHV0LCBPdXRwdXQsRWxlbWVudFJlZiwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE1hdFRyZWVGbGF0RGF0YVNvdXJjZSwgTWF0VHJlZUZsYXR0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3RyZWUnO1xyXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIG9mIGFzIG9ic2VydmFibGVPZiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBDZGtEcmFnRHJvcCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9kcmFnLWRyb3AnO1xyXG5pbXBvcnQgeyBTZWxlY3Rpb25Nb2RlbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XHJcbmltcG9ydCB7IGZvckVhY2ggfSBmcm9tICdqc3ppcCc7XHJcblxyXG4vKipcclxuICogRmlsZSBub2RlIGRhdGEgd2l0aCBuZXN0ZWQgc3RydWN0dXJlLlxyXG4gKiBFYWNoIG5vZGUgaGFzIGEgbmFtZSwgYW5kIGEgdHlwZSBvciBhIGxpc3Qgb2YgY2hpbGRyZW4uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRmlsZU5vZGUge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgY2hpbGRyZW46IEZpbGVOb2RlW107XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIHR5cGU6IGFueTtcclxuICBhY3RpdmU6IGFueVxyXG4gIGNhcnRvZ3JhcGh5SWQ6IGFueVxyXG4gIGNhcnRvZ3JhcGh5TmFtZTogYW55XHJcbiAgZGF0YXNldFVSTDogYW55XHJcbiAgZGVzY3JpcHRpb246IGFueVxyXG4gIGZpbHRlckdldEZlYXR1cmVJbmZvOiBhbnlcclxuICBmaWx0ZXJHZXRNYXA6IGFueVxyXG4gIGZpbHRlclNlbGVjdGFibGU6IGFueVxyXG4gIGlzRm9sZGVyOiBhbnlcclxuICBtZXRhZGF0YVVSTDogYW55XHJcbiAgb3JkZXI6IGFueVxyXG4gIHBhcmVudDogYW55XHJcbiAgcXVlcnlhYmxlQWN0aXZlOiBhbnlcclxuICByYWRpbzogYW55XHJcbiAgdG9vbHRpcDogYW55XHJcbiAgX2xpbmtzOiBhbnlcclxuICBzdGF0dXM6IGFueVxyXG59XHJcblxyXG4vKiogRmxhdCBub2RlIHdpdGggZXhwYW5kYWJsZSBhbmQgbGV2ZWwgaW5mb3JtYXRpb24gKi9cclxuZXhwb3J0IGNsYXNzIEZpbGVGbGF0Tm9kZSB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwdWJsaWMgZXhwYW5kYWJsZTogYm9vbGVhbixcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcsXHJcbiAgICBwdWJsaWMgbGV2ZWw6IG51bWJlcixcclxuICAgIHB1YmxpYyB0eXBlOiBhbnksXHJcbiAgICBwdWJsaWMgaWQ6IHN0cmluZyxcclxuICAgIHB1YmxpYyBzdGF0dXM6IHN0cmluZ1xyXG4gICkgeyB9XHJcbn1cclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIEZpbGUgZGF0YWJhc2UsIGl0IGNhbiBidWlsZCBhIHRyZWUgc3RydWN0dXJlZCBKc29uIG9iamVjdCBmcm9tIHN0cmluZy5cclxuICogRWFjaCBub2RlIGluIEpzb24gb2JqZWN0IHJlcHJlc2VudHMgYSBmaWxlIG9yIGEgZGlyZWN0b3J5LiBGb3IgYSBmaWxlLCBpdCBoYXMgbmFtZSBhbmQgdHlwZS5cclxuICogRm9yIGEgZGlyZWN0b3J5LCBpdCBoYXMgbmFtZSBhbmQgY2hpbGRyZW4gKGEgbGlzdCBvZiBmaWxlcyBvciBkaXJlY3RvcmllcykuXHJcbiAqIFRoZSBpbnB1dCB3aWxsIGJlIGEganNvbiBvYmplY3Qgc3RyaW5nLCBhbmQgdGhlIG91dHB1dCBpcyBhIGxpc3Qgb2YgYEZpbGVOb2RlYCB3aXRoIG5lc3RlZFxyXG4gKiBzdHJ1Y3R1cmUuXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBGaWxlRGF0YWJhc2Uge1xyXG4gIGRhdGFDaGFuZ2UgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEZpbGVOb2RlW10+KFtdKTtcclxuICBnZXQgZGF0YSgpOiBhbnkgeyByZXR1cm4gdGhpcy5kYXRhQ2hhbmdlLnZhbHVlOyB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICB9XHJcblxyXG4gIGluaXRpYWxpemUoZGF0YU9iaikge1xyXG5cclxuICAgIC8vIEJ1aWxkIHRoZSB0cmVlIG5vZGVzIGZyb20gSnNvbiBvYmplY3QuIFRoZSByZXN1bHQgaXMgYSBsaXN0IG9mIGBGaWxlTm9kZWAgd2l0aCBuZXN0ZWRcclxuICAgIC8vICAgICBmaWxlIG5vZGUgYXMgY2hpbGRyZW4uXHJcbiAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZEZpbGVUcmVlKGRhdGFPYmosIDApO1xyXG5cclxuICAgIC8vIE5vdGlmeSB0aGUgY2hhbmdlLlxyXG4gICAgdGhpcy5kYXRhQ2hhbmdlLm5leHQoZGF0YSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBCdWlsZCB0aGUgZmlsZSBzdHJ1Y3R1cmUgdHJlZS4gVGhlIGB2YWx1ZWAgaXMgdGhlIEpzb24gb2JqZWN0LCBvciBhIHN1Yi10cmVlIG9mIGEgSnNvbiBvYmplY3QuXHJcbiAgICogVGhlIHJldHVybiB2YWx1ZSBpcyB0aGUgbGlzdCBvZiBgRmlsZU5vZGVgLlxyXG4gICAqL1xyXG4gIGJ1aWxkRmlsZVRyZWUoYXJyYXlUcmVlTm9kZXM6IGFueVtdLCBsZXZlbDogbnVtYmVyKTogYW55IHtcclxuICAgIHZhciBtYXAgPSB7fTtcclxuICAgIGlmKGFycmF5VHJlZU5vZGVzLmxlbmd0aD09PTApXHJcbiAgICB7XHJcbiAgICAgIGxldCByb290ID0ge1xyXG4gICAgICAgIGlzRm9sZGVyOnRydWUsXHJcbiAgICAgICAgbmFtZTonUm9vdCcsXHJcbiAgICAgICAgdHlwZTogJ2ZvbGRlcicsXHJcbiAgICAgICAgaXNSb290OiB0cnVlLFxyXG4gICAgICAgIG9yZGVyOiAwLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXSxcclxuICAgICAgICBpZDowXHJcbiAgICAgIH1cclxuICAgICAgbWFwWydyb290J109cm9vdDtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGFycmF5VHJlZU5vZGVzLmZvckVhY2goKHRyZWVOb2RlKSA9PiB7XHJcbiAgICAgICAgdmFyIG9iaiA9IHRyZWVOb2RlO1xyXG4gICAgICAgIG9iai5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIG9iai50eXBlPSAodHJlZU5vZGUuaXNGb2xkZXIpPyBcImZvbGRlclwiIDogXCJub2RlXCI7XHJcbiAgXHJcbiAgICAgICAgaWYoIW1hcFtvYmouaWRdKSB7bWFwW29iai5pZF0gPSBvYmo7fVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICBsZXQgcHJldmlvdXNDaGlsZHJlbj0gbWFwW29iai5pZF0uY2hpbGRyZW5cclxuICAgICAgICAgIG1hcFtvYmouaWRdID0gb2JqO1xyXG4gICAgICAgICAgbWFwW29iai5pZF0uY2hpbGRyZW49cHJldmlvdXNDaGlsZHJlblxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcGFyZW50ID0gb2JqLnBhcmVudCB8fCAncm9vdCc7XHJcbiAgICAgICAgaWYgKCFtYXBbcGFyZW50XSkge1xyXG4gICAgICAgICAgbWFwW3BhcmVudF0gPSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFwW3BhcmVudF0uY2hpbGRyZW4ucHVzaChvYmopO1xyXG4gICAgICB9KTtcclxuICAgICAgbWFwWydyb290J10udHlwZT0nZm9sZGVyJztcclxuICAgICAgbWFwWydyb290J10ubmFtZT0nUm9vdCc7XHJcbiAgICAgIG1hcFsncm9vdCddLm9yZGVyPTA7XHJcbiAgICAgIG1hcFsncm9vdCddLmlzRm9sZGVyPXRydWU7XHJcbiAgICAgIG1hcFsncm9vdCddLmlzUm9vdD10cnVlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICByZXR1cm4gbWFwWydyb290J107XHJcbiAgfVxyXG4gIFxyXG5cclxuICBkZWxldGVJdGVtKG5vZGU6IEZpbGVOb2RlLCBjaGFuZ2VkRGF0YTphbnkpIHtcclxuICAgIHRoaXMuZGVsZXRlTm9kZShjaGFuZ2VkRGF0YS5jaGlsZHJlbiwgbm9kZSk7XHJcbiAgICB0aGlzLmRhdGFDaGFuZ2UubmV4dChjaGFuZ2VkRGF0YSk7XHJcbiAgfVxyXG5cclxuICBkZWxldGVOb2RlKG5vZGVzOiBGaWxlTm9kZVtdLCBub2RlVG9EZWxldGU6IEZpbGVOb2RlKSB7XHJcbiAgICBjb25zdCBpbmRleCA9IG5vZGVzLmluZGV4T2Yobm9kZVRvRGVsZXRlLCAwKTtcclxuICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgIG5vZGVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgIGlmIChub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5kZWxldGVOb2RlKG5vZGUuY2hpbGRyZW4sIG5vZGVUb0RlbGV0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvcHlQYXN0ZUl0ZW0oZnJvbTogRmlsZU5vZGUsIHRvOiBGaWxlTm9kZSwgY2hhbmdlZERhdGE6YW55KTogRmlsZU5vZGUge1xyXG4gICAgY29uc3QgbmV3SXRlbSA9IHRoaXMuaW5zZXJ0SXRlbSh0bywgZnJvbSxjaGFuZ2VkRGF0YSk7XHJcblxyXG4gICAgcmV0dXJuIG5ld0l0ZW07XHJcbiAgfVxyXG5cclxuICBjb3B5UGFzdGVJdGVtQWJvdmUoZnJvbTogRmlsZU5vZGUsIHRvOiBGaWxlTm9kZSxjaGFuZ2VkRGF0YTphbnkpOiBGaWxlTm9kZSB7XHJcbiAgICBjb25zdCBuZXdJdGVtID0gdGhpcy5pbnNlcnRJdGVtQWJvdmUodG8sIGZyb20sY2hhbmdlZERhdGEpO1xyXG5cclxuICAgIHJldHVybiBuZXdJdGVtO1xyXG4gIH1cclxuXHJcbiAgY29weVBhc3RlSXRlbUJlbG93KGZyb206IEZpbGVOb2RlLCB0bzogRmlsZU5vZGUsY2hhbmdlZERhdGE6YW55KTogRmlsZU5vZGUge1xyXG4gICAgY29uc3QgbmV3SXRlbSA9IHRoaXMuaW5zZXJ0SXRlbUJlbG93KHRvLCBmcm9tLGNoYW5nZWREYXRhKTtcclxuXHJcbiAgICByZXR1cm4gbmV3SXRlbTtcclxuICB9XHJcblxyXG4gIC8qKiBBZGQgYW4gaXRlbSB0byB0by1kbyBsaXN0ICovXHJcbiAgXHJcbiAgZ2V0TmV3SXRlbShub2RlOkZpbGVOb2RlKXtcclxuICAgIGNvbnN0IG5ld0l0ZW0gPSB7XHJcbiAgICAgIG5hbWU6IG5vZGUubmFtZSxcclxuICAgICAgY2hpbGRyZW46IG5vZGUuY2hpbGRyZW4sXHJcbiAgICAgIHR5cGU6IG5vZGUudHlwZSxcclxuICAgICAgaWQ6IG5vZGUuaWQsIFxyXG4gICAgICBhY3RpdmU6IG5vZGUuYWN0aXZlLFxyXG4gICAgICBjYXJ0b2dyYXBoeUlkOiBub2RlLmNhcnRvZ3JhcGh5SWQsXHJcbiAgICAgIGNhcnRvZ3JhcGh5TmFtZTogbm9kZS5jYXJ0b2dyYXBoeU5hbWUsXHJcbiAgICAgIGRhdGFzZXRVUkw6IG5vZGUuZGF0YXNldFVSTCxcclxuICAgICAgZGVzY3JpcHRpb246IG5vZGUuZGVzY3JpcHRpb24sXHJcbiAgICAgIGZpbHRlckdldEZlYXR1cmVJbmZvOiBub2RlLmZpbHRlckdldEZlYXR1cmVJbmZvLFxyXG4gICAgICBmaWx0ZXJHZXRNYXA6IG5vZGUuZmlsdGVyR2V0TWFwLFxyXG4gICAgICBmaWx0ZXJTZWxlY3RhYmxlOiBub2RlLmZpbHRlclNlbGVjdGFibGUsXHJcbiAgICAgIGlzRm9sZGVyOiBub2RlLmlzRm9sZGVyLFxyXG4gICAgICBtZXRhZGF0YVVSTDogbm9kZS5tZXRhZGF0YVVSTCxcclxuICAgICAgb3JkZXI6IG5vZGUub3JkZXIsXHJcbiAgICAgIHF1ZXJ5YWJsZUFjdGl2ZTogbm9kZS5xdWVyeWFibGVBY3RpdmUsXHJcbiAgICAgIHJhZGlvOiBub2RlLnJhZGlvLFxyXG4gICAgICB0b29sdGlwOiBub2RlLnRvb2x0aXAsXHJcbiAgICAgIF9saW5rczogbm9kZS5fbGlua3MgfSBhcyBGaWxlTm9kZTtcclxuXHJcbiAgICByZXR1cm4gbmV3SXRlbTtcclxuICB9XHJcblxyXG4gIGluc2VydEl0ZW0ocGFyZW50OiBGaWxlTm9kZSwgbm9kZTogRmlsZU5vZGUsY2hhbmdlZERhdGE6YW55KTogRmlsZU5vZGUge1xyXG4gICAgaWYgKCFwYXJlbnQuY2hpbGRyZW4pIHtcclxuICAgICAgcGFyZW50LmNoaWxkcmVuID0gW107XHJcbiAgICB9XHJcbiAgICBjb25zdCBuZXdJdGVtID0gdGhpcy5nZXROZXdJdGVtKG5vZGUpXHJcbiAgICBuZXdJdGVtLnBhcmVudCA9IHBhcmVudD09bnVsbCB8fCBwYXJlbnQuaWQ9PXVuZGVmaW5lZD9udWxsOnBhcmVudC5pZDtcclxuXHJcbiAgICBwYXJlbnQuY2hpbGRyZW4ucHVzaChuZXdJdGVtKTtcclxuICAgIHRoaXMuZGF0YUNoYW5nZS5uZXh0KGNoYW5nZWREYXRhKTtcclxuICAgIHJldHVybiBuZXdJdGVtO1xyXG4gIH1cclxuXHJcbiAgaW5zZXJ0SXRlbUFib3ZlKG5vZGU6IEZpbGVOb2RlLCBub2RlRHJhZzogRmlsZU5vZGUsY2hhbmdlZERhdGE6YW55KTogRmlsZU5vZGUge1xyXG4gICAgY29uc3QgcGFyZW50Tm9kZSA9IHRoaXMuZ2V0UGFyZW50RnJvbU5vZGVzKG5vZGUsY2hhbmdlZERhdGEpO1xyXG4gICAgY29uc3QgbmV3SXRlbSA9IHRoaXMuZ2V0TmV3SXRlbShub2RlRHJhZylcclxuICAgIG5ld0l0ZW0ucGFyZW50ID0gcGFyZW50Tm9kZT09bnVsbCB8fCBwYXJlbnROb2RlLmlkPT11bmRlZmluZWQ/bnVsbDpwYXJlbnROb2RlLmlkO1xyXG5cclxuICAgIGlmIChwYXJlbnROb2RlICE9IG51bGwpIHtcclxuICAgICAgcGFyZW50Tm9kZS5jaGlsZHJlbi5zcGxpY2UocGFyZW50Tm9kZS5jaGlsZHJlbi5pbmRleE9mKG5vZGUpLCAwLCBuZXdJdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNoYW5nZWREYXRhLmNoaWxkcmVuLnNwbGljZShjaGFuZ2VkRGF0YS5jaGlsZHJlbi5pbmRleE9mKG5vZGUpLCAwLCBuZXdJdGVtKTtcclxuICAgIH1cclxuICAgIHRoaXMuZGF0YUNoYW5nZS5uZXh0KGNoYW5nZWREYXRhKTtcclxuICAgIHJldHVybiBuZXdJdGVtO1xyXG4gIH1cclxuXHJcbiAgaW5zZXJ0SXRlbUJlbG93KG5vZGU6IEZpbGVOb2RlLCBub2RlRHJhZzogRmlsZU5vZGUsY2hhbmdlZERhdGE6YW55KTogRmlsZU5vZGUge1xyXG4gICAgY29uc3QgcGFyZW50Tm9kZSA9IHRoaXMuZ2V0UGFyZW50RnJvbU5vZGVzKG5vZGUsY2hhbmdlZERhdGEpO1xyXG4gICBcclxuICAgIGNvbnN0IG5ld0l0ZW0gPSB0aGlzLmdldE5ld0l0ZW0obm9kZURyYWcpXHJcbiAgICBuZXdJdGVtLnBhcmVudCA9IHBhcmVudE5vZGU9PW51bGwgfHwgcGFyZW50Tm9kZS5pZD09dW5kZWZpbmVkP251bGw6cGFyZW50Tm9kZS5pZDtcclxuXHJcbiAgICBpZiAocGFyZW50Tm9kZSAhPSBudWxsKSB7XHJcbiAgICAgIHBhcmVudE5vZGUuY2hpbGRyZW4uc3BsaWNlKHBhcmVudE5vZGUuY2hpbGRyZW4uaW5kZXhPZihub2RlKSArIDEsIDAsIG5ld0l0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2hhbmdlZERhdGEuY2hpbGRyZW4uc3BsaWNlKGNoYW5nZWREYXRhLmNoaWxkcmVuLmluZGV4T2Yobm9kZSkgKyAxLCAwLCBuZXdJdGVtKTtcclxuICAgIH1cclxuICAgIHRoaXMuZGF0YUNoYW5nZS5uZXh0KGNoYW5nZWREYXRhKTtcclxuICAgIHJldHVybiBuZXdJdGVtO1xyXG4gIH1cclxuXHJcbiAgXHJcbiAgZ2V0UGFyZW50RnJvbU5vZGVzKG5vZGU6IEZpbGVOb2RlLGNoYW5nZWREYXRhOmFueSk6IEZpbGVOb2RlIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhbmdlZERhdGEuY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgY29uc3QgY3VycmVudFJvb3QgPSAgY2hhbmdlZERhdGEuY2hpbGRyZW5baV07XHJcbiAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50KGN1cnJlbnRSb290LCBub2RlKTtcclxuICAgICAgaWYgKHBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcmVudDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBcclxuICBnZXRQYXJlbnQoY3VycmVudFJvb3Q6IEZpbGVOb2RlLCBub2RlOiBGaWxlTm9kZSk6IEZpbGVOb2RlIHtcclxuICAgIGlmIChjdXJyZW50Um9vdC5jaGlsZHJlbiAmJiBjdXJyZW50Um9vdC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudFJvb3QuY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBjb25zdCBjaGlsZCA9IGN1cnJlbnRSb290LmNoaWxkcmVuW2ldO1xyXG4gICAgICAgIGlmIChjaGlsZCA9PT0gbm9kZSkge1xyXG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnRSb290O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY2hpbGQuY2hpbGRyZW4gJiYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnQoY2hpbGQsIG5vZGUpO1xyXG4gICAgICAgICAgaWYgKHBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG59XHJcblxyXG4vKipcclxuICogQHRpdGxlIFRyZWUgd2l0aCBmbGF0IG5vZGVzXHJcbiAqL1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1kYXRhLXRyZWUnLFxyXG4gIHRlbXBsYXRlVXJsOiAnZGF0YS10cmVlLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnZGF0YS10cmVlLmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgcHJvdmlkZXJzOiBbRmlsZURhdGFiYXNlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGF0YVRyZWVDb21wb25lbnQge1xyXG4gIEBPdXRwdXQoKSBjcmVhdGVOb2RlOiBFdmVudEVtaXR0ZXI8YW55PjtcclxuICBAT3V0cHV0KCkgY3JlYXRlRm9sZGVyOiBFdmVudEVtaXR0ZXI8YW55PjtcclxuICBAT3V0cHV0KCkgZW1pdE5vZGU6IEV2ZW50RW1pdHRlcjxhbnk+O1xyXG4gIEBPdXRwdXQoKSBlbWl0QWxsTm9kZXM6IEV2ZW50RW1pdHRlcjxhbnk+O1xyXG4gIEBJbnB1dCgpIGV2ZW50Tm9kZVVwZGF0ZWRTdWJzY3JpcHRpb246IE9ic2VydmFibGUgPGFueT4gO1xyXG4gIEBJbnB1dCgpIGV2ZW50Q3JlYXRlTm9kZVN1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZSA8YW55PiA7XHJcbiAgQElucHV0KCkgZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlIDxhbnk+IDtcclxuICBASW5wdXQoKSBldmVudFJlZnJlc2hTdWJzY3JpcHRpb246IE9ic2VydmFibGUgPGFueT4gO1xyXG4gIHByaXZhdGUgX2V2ZW50Tm9kZVVwZGF0ZWRTdWJzY3JpcHRpb246IGFueTtcclxuICBwcml2YXRlIF9ldmVudENyZWF0ZU5vZGVTdWJzY3JpcHRpb246IGFueTtcclxuICBwcml2YXRlIF9ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb246IGFueTtcclxuICBwcml2YXRlIF9ldmVudFJlZnJlc2hTdWJzY3JpcHRpb246IGFueTtcclxuICB0cmVlQ29udHJvbDogRmxhdFRyZWVDb250cm9sPEZpbGVGbGF0Tm9kZT47XHJcbiAgdHJlZUZsYXR0ZW5lcjogTWF0VHJlZUZsYXR0ZW5lcjxGaWxlTm9kZSwgRmlsZUZsYXROb2RlPjtcclxuICBkYXRhU291cmNlOiBNYXRUcmVlRmxhdERhdGFTb3VyY2U8RmlsZU5vZGUsIEZpbGVGbGF0Tm9kZT47XHJcbiAgLy8gZXhwYW5zaW9uIG1vZGVsIHRyYWNrcyBleHBhbnNpb24gc3RhdGVcclxuICBleHBhbnNpb25Nb2RlbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxzdHJpbmc+KHRydWUpO1xyXG4gIGRyYWdnaW5nID0gZmFsc2U7XHJcbiAgZXhwYW5kVGltZW91dDogYW55O1xyXG4gIGV4cGFuZERlbGF5ID0gMTAwMDtcclxuICB2YWxpZGF0ZURyb3AgPSBmYWxzZTtcclxuICB0cmVlRGF0YTogYW55O1xyXG5cclxuICBASW5wdXQoKSBnZXRBbGw6ICgpID0+IE9ic2VydmFibGU8YW55PjtcclxuXHJcblxyXG4gIC8qIERyYWcgYW5kIGRyb3AgKi9cclxuICBkcmFnTm9kZTogYW55O1xyXG4gIGRyYWdOb2RlRXhwYW5kT3ZlcldhaXRUaW1lTXMgPSAxNTAwO1xyXG4gIGRyYWdOb2RlRXhwYW5kT3Zlck5vZGU6IGFueTtcclxuICBkcmFnTm9kZUV4cGFuZE92ZXJUaW1lOiBudW1iZXI7XHJcbiAgZHJhZ05vZGVFeHBhbmRPdmVyQXJlYTogc3RyaW5nO1xyXG4gIEBWaWV3Q2hpbGQoJ2VtcHR5SXRlbScpIGVtcHR5SXRlbTogRWxlbWVudFJlZjtcclxuXHJcbiAgICAvKiogTWFwIGZyb20gZmxhdCBub2RlIHRvIG5lc3RlZCBub2RlLiBUaGlzIGhlbHBzIHVzIGZpbmRpbmcgdGhlIG5lc3RlZCBub2RlIHRvIGJlIG1vZGlmaWVkICovXHJcbiAgICBmbGF0Tm9kZU1hcCA9IG5ldyBNYXA8RmlsZUZsYXROb2RlLCBGaWxlTm9kZT4oKTtcclxuXHJcbiAgICAvKiogTWFwIGZyb20gbmVzdGVkIG5vZGUgdG8gZmxhdHRlbmVkIG5vZGUuIFRoaXMgaGVscHMgdXMgdG8ga2VlcCB0aGUgc2FtZSBvYmplY3QgZm9yIHNlbGVjdGlvbiAqL1xyXG4gICAgbmVzdGVkTm9kZU1hcCA9IG5ldyBNYXA8RmlsZU5vZGUsIEZpbGVGbGF0Tm9kZT4oKTtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkYXRhYmFzZTogRmlsZURhdGFiYXNlKSB7XHJcbiAgICB0aGlzLmVtaXROb2RlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5jcmVhdGVOb2RlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5jcmVhdGVGb2xkZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmVtaXRBbGxOb2RlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMudHJlZUZsYXR0ZW5lciA9IG5ldyBNYXRUcmVlRmxhdHRlbmVyKHRoaXMudHJhbnNmb3JtZXIsIHRoaXMuX2dldExldmVsLFxyXG4gICAgICB0aGlzLl9pc0V4cGFuZGFibGUsIHRoaXMuX2dldENoaWxkcmVuKTtcclxuICAgIHRoaXMudHJlZUNvbnRyb2wgPSBuZXcgRmxhdFRyZWVDb250cm9sPEZpbGVGbGF0Tm9kZT4odGhpcy5fZ2V0TGV2ZWwsIHRoaXMuX2lzRXhwYW5kYWJsZSk7XHJcbiAgICB0aGlzLmRhdGFTb3VyY2UgPSBuZXcgTWF0VHJlZUZsYXREYXRhU291cmNlKHRoaXMudHJlZUNvbnRyb2wsIHRoaXMudHJlZUZsYXR0ZW5lcik7XHJcbiBcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCl7XHJcblxyXG4gICAgaWYodGhpcy5ldmVudE5vZGVVcGRhdGVkU3Vic2NyaXB0aW9uKVxyXG4gICAge1xyXG4gICAgICB0aGlzLmV2ZW50Tm9kZVVwZGF0ZWRTdWJzY3JpcHRpb24uc3Vic2NyaWJlKFxyXG4gICAgICAgIChub2RlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZU5vZGUobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmV2ZW50Q3JlYXRlTm9kZVN1YnNjcmlwdGlvbilcclxuICAgIHtcclxuICAgICAgdGhpcy5ldmVudENyZWF0ZU5vZGVTdWJzY3JpcHRpb24uc3Vic2NyaWJlKFxyXG4gICAgICAgIChub2RlKSA9PiB7XHJcbiAgICAgICAgICBpZihub2RlLmlzRm9sZGVyKSB0aGlzLmNyZWF0ZU5ld0ZvbGRlcihub2RlKTtcclxuICAgICAgICAgIGVsc2UgdGhpcy5jcmVhdGVOZXdOb2RlKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmV2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLl9ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbi5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZW1pdEFsbFJvd3MoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50UmVmcmVzaFN1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5nZXRFbGVtZW50cygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdGhpcy5nZXRFbGVtZW50cygpO1xyXG4gIH1cclxuXHJcbiAgZ2V0RWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdldEFsbCgpXHJcbiAgICAuc3Vic2NyaWJlKChpdGVtcykgPT4ge1xyXG4gICAgICB0aGlzLnRyZWVEYXRhID0gaXRlbXM7XHJcbiAgICAgIHRoaXMuZGF0YWJhc2UuaW5pdGlhbGl6ZSh0aGlzLnRyZWVEYXRhKTtcclxuICAgICAgdGhpcy5kYXRhYmFzZS5kYXRhQ2hhbmdlLnN1YnNjcmliZShkYXRhID0+IHRoaXMucmVidWlsZFRyZWVGb3JEYXRhKFtkYXRhXSkpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgdHJhbnNmb3JtZXIgPSAobm9kZTogRmlsZU5vZGUsIGxldmVsOiBudW1iZXIpID0+IHtcclxuICAgIGNvbnN0IGV4aXN0aW5nTm9kZSA9IHRoaXMubmVzdGVkTm9kZU1hcC5nZXQobm9kZSk7XHJcbiAgICBjb25zdCBmbGF0Tm9kZSA9IGV4aXN0aW5nTm9kZSAmJiBleGlzdGluZ05vZGUubmFtZSA9PT0gbm9kZS5uYW1lXHJcbiAgICAgID8gZXhpc3RpbmdOb2RlXHJcbiAgICAgIDogbmV3IEZpbGVGbGF0Tm9kZSgobm9kZS5jaGlsZHJlbiAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApLG5vZGUubmFtZSxsZXZlbCxub2RlLnR5cGUsbm9kZS5pZCxub2RlLnN0YXR1cyk7XHJcblxyXG4gICAgdGhpcy5mbGF0Tm9kZU1hcC5zZXQoZmxhdE5vZGUsIG5vZGUpO1xyXG4gICAgdGhpcy5uZXN0ZWROb2RlTWFwLnNldChub2RlLCBmbGF0Tm9kZSk7XHJcbiAgICByZXR1cm4gZmxhdE5vZGU7XHJcbiAgXHJcbiAgfVxyXG4gIHByaXZhdGUgX2dldExldmVsID0gKG5vZGU6IEZpbGVGbGF0Tm9kZSkgPT4gbm9kZS5sZXZlbDtcclxuICBwcml2YXRlIF9pc0V4cGFuZGFibGUgPSAobm9kZTogRmlsZUZsYXROb2RlKSA9PiBub2RlLmV4cGFuZGFibGU7XHJcbiAgcHJpdmF0ZSBfZ2V0Q2hpbGRyZW4gPSAobm9kZTogRmlsZU5vZGUpOiBPYnNlcnZhYmxlPEZpbGVOb2RlW10+ID0+IG9ic2VydmFibGVPZihub2RlLmNoaWxkcmVuKTtcclxuICBoYXNDaGlsZCA9IChfOiBudW1iZXIsIF9ub2RlRGF0YTogRmlsZUZsYXROb2RlKSA9PiBfbm9kZURhdGEuZXhwYW5kYWJsZTtcclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIFRoaXMgY29uc3RydWN0cyBhbiBhcnJheSBvZiBub2RlcyB0aGF0IG1hdGNoZXMgdGhlIERPTVxyXG4gICAqL1xyXG4gIHZpc2libGVOb2RlcygpOiBGaWxlTm9kZVtdIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFkZEV4cGFuZGVkQ2hpbGRyZW4obm9kZTogRmlsZU5vZGUsIGV4cGFuZGVkOiBzdHJpbmdbXSkge1xyXG4gICAgICByZXN1bHQucHVzaChub2RlKTtcclxuICAgICAgaWYgKGV4cGFuZGVkLmluZGV4T2Yobm9kZS5pZCkgIT0gLTEpIHtcclxuICAgICAgICBub2RlLmNoaWxkcmVuLm1hcCgoY2hpbGQpID0+IGFkZEV4cGFuZGVkQ2hpbGRyZW4oY2hpbGQsIGV4cGFuZGVkKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuZGF0YVNvdXJjZS5kYXRhLmZvckVhY2goKG5vZGUpID0+IHtcclxuICAgICAgYWRkRXhwYW5kZWRDaGlsZHJlbihub2RlLCB0aGlzLmV4cGFuc2lvbk1vZGVsLnNlbGVjdGVkKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG5cclxuICAgZmluZE5vZGVTaWJsaW5ncyhhcnI6IEFycmF5PGFueT4sIGlkOiBzdHJpbmcpOiBBcnJheTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQsIHN1YlJlc3VsdDtcclxuICAgIGFyci5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLmlkID09PSBpZCkge1xyXG4gICAgICAgIHJlc3VsdCA9IGFycjtcclxuICAgICAgfSBlbHNlIGlmIChpdGVtLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgc3ViUmVzdWx0ID0gdGhpcy5maW5kTm9kZVNpYmxpbmdzKGl0ZW0uY2hpbGRyZW4sIGlkKTtcclxuICAgICAgICBpZiAoc3ViUmVzdWx0KSByZXN1bHQgPSBzdWJSZXN1bHQ7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgfVxyXG5cclxuXHJcbiAgaGFuZGxlRHJhZ1N0YXJ0KGV2ZW50LCBub2RlKSB7XHJcbiAgICAvLyBSZXF1aXJlZCBieSBGaXJlZm94IChodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xOTA1NTI2NC93aHktZG9lc250LWh0bWw1LWRyYWctYW5kLWRyb3Atd29yay1pbi1maXJlZm94KVxyXG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ2ZvbycsICdiYXInKTtcclxuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UodGhpcy5lbXB0eUl0ZW0ubmF0aXZlRWxlbWVudCwgMCwgMCk7XHJcbiAgICB0aGlzLmRyYWdOb2RlID0gbm9kZTtcclxuICAgIHRoaXMudHJlZUNvbnRyb2wuY29sbGFwc2Uobm9kZSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVEcmFnT3ZlcihldmVudCwgbm9kZSkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAvLyBIYW5kbGUgbm9kZSBleHBhbmRcclxuICAgIGlmIChub2RlID09PSB0aGlzLmRyYWdOb2RlRXhwYW5kT3Zlck5vZGUpIHtcclxuICAgICAgaWYgKHRoaXMuZHJhZ05vZGUgIT09IG5vZGUgJiYgIXRoaXMudHJlZUNvbnRyb2wuaXNFeHBhbmRlZChub2RlKSkge1xyXG4gICAgICAgIGlmICgobmV3IERhdGUoKS5nZXRUaW1lKCkgLSB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlclRpbWUpID4gdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJXYWl0VGltZU1zKSB7XHJcbiAgICAgICAgICB0aGlzLnRyZWVDb250cm9sLmV4cGFuZChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyTm9kZSA9IG5vZGU7XHJcbiAgICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEhhbmRsZSBkcmFnIGFyZWFcclxuICAgIGNvbnN0IHBlcmNlbnRhZ2VYID0gZXZlbnQub2Zmc2V0WCAvIGV2ZW50LnRhcmdldC5jbGllbnRXaWR0aDtcclxuICAgIGNvbnN0IHBlcmNlbnRhZ2VZID0gZXZlbnQub2Zmc2V0WSAvIGV2ZW50LnRhcmdldC5jbGllbnRIZWlnaHQ7XHJcbiAgICBpZiAocGVyY2VudGFnZVkgPCAwLjI1KSB7XHJcbiAgICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyQXJlYSA9ICdhYm92ZSc7XHJcbiAgICB9IGVsc2UgaWYgKHBlcmNlbnRhZ2VZID4gMC43NSkge1xyXG4gICAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlckFyZWEgPSAnYmVsb3cnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJBcmVhID0gJ2NlbnRlcic7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoYW5kbGVEcm9wKGV2ZW50LCBub2RlKSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29uc3QgY2hhbmdlZERhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YVNvdXJjZS5kYXRhKSlcclxuXHJcblxyXG4gICAgbGV0IHRvRmxhdE5vZGU9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhjaGFuZ2VkRGF0YVswXS5jaGlsZHJlbiwgbm9kZS5pZCkuZmluZChub2RlQWN0ID0+IG5vZGVBY3QuaWQgPT09IG5vZGUuaWQpO1xyXG4gICAgbGV0IGZyb21GbGF0Tm9kZT0gdGhpcy5maW5kTm9kZVNpYmxpbmdzKGNoYW5nZWREYXRhWzBdLmNoaWxkcmVuLCB0aGlzLmRyYWdOb2RlLmlkKS5maW5kKG5vZGVBY3QgPT4gbm9kZUFjdC5pZCA9PT0gdGhpcy5kcmFnTm9kZS5pZCk7XHJcbiAgICBpZiAodGhpcy5kcmFnTm9kZS5zdGF0dXMhPVwicGVuZGluZ0RlbGV0ZVwiICYmIG5vZGUgIT09IHRoaXMuZHJhZ05vZGUgJiYgKHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyQXJlYSAhPT0gJ2NlbnRlcicgfHwgKHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyQXJlYSA9PT0gJ2NlbnRlcicgJiYgdG9GbGF0Tm9kZS5pc0ZvbGRlcikpKSB7XHJcbiAgICAgIGxldCBuZXdJdGVtOiBGaWxlTm9kZTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlckFyZWEgPT09ICdhYm92ZScpIHtcclxuICAgICAgICBuZXdJdGVtID0gdGhpcy5kYXRhYmFzZS5jb3B5UGFzdGVJdGVtQWJvdmUoZnJvbUZsYXROb2RlLHRvRmxhdE5vZGUsY2hhbmdlZERhdGFbMF0pO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyQXJlYSA9PT0gJ2JlbG93Jykge1xyXG4gICAgICAgIG5ld0l0ZW0gPSB0aGlzLmRhdGFiYXNlLmNvcHlQYXN0ZUl0ZW1CZWxvdyhmcm9tRmxhdE5vZGUsdG9GbGF0Tm9kZSxjaGFuZ2VkRGF0YVswXSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbmV3SXRlbSA9IHRoaXMuZGF0YWJhc2UuY29weVBhc3RlSXRlbShmcm9tRmxhdE5vZGUsIHRvRmxhdE5vZGUsY2hhbmdlZERhdGFbMF0pO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBwYXJlbnRMdmw9dGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXMuZmluZCgobikgPT4gbi5pZCA9PT0gZnJvbUZsYXROb2RlLmlkKS5sZXZlbDtcclxuICAgICAgZnJvbUZsYXROb2RlLmNoaWxkcmVuLmZvckVhY2goY2hpbGQ9PntcclxuICAgICAgICB0aGlzLnRyZWVDb250cm9sLmRhdGFOb2Rlcy5maW5kKChuKSA9PiBuLmlkID09PSBjaGlsZC5pZCkubGV2ZWw9cGFyZW50THZsKzFcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuZGF0YWJhc2UuZGVsZXRlSXRlbShmcm9tRmxhdE5vZGUsY2hhbmdlZERhdGFbMF0pO1xyXG4gICAgICB0aGlzLnRyZWVDb250cm9sLmV4cGFuZERlc2NlbmRhbnRzKHRoaXMubmVzdGVkTm9kZU1hcC5nZXQobmV3SXRlbSkpO1xyXG4gICAgfVxyXG4gICBcclxuICAgIHRoaXMuZHJhZ05vZGUgPSBudWxsO1xyXG4gICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJOb2RlID0gbnVsbDtcclxuICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyVGltZSA9IDA7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVEcmFnRW5kKGV2ZW50KSB7XHJcbiAgICB0aGlzLmRyYWdOb2RlID0gbnVsbDtcclxuICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyTm9kZSA9IG51bGw7XHJcbiAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlclRpbWUgPSAwO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGZvbGxvd2luZyBtZXRob2RzIGFyZSBmb3IgcGVyc2lzdGluZyB0aGUgdHJlZSBleHBhbmQgc3RhdGVcclxuICAgKiBhZnRlciBiZWluZyByZWJ1aWx0XHJcbiAgICovXHJcblxyXG4gICBzb3J0QnlPcmRlcihkYXRhOiBhbnlbXSl7XHJcbiAgICBkYXRhLnNvcnQoKGEsYikgPT4gYS5vcmRlci50b1N0cmluZygpLmxvY2FsZUNvbXBhcmUoIGIub3JkZXIudG9TdHJpbmcoKSkpO1xyXG4gICAgZGF0YS5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLmNoaWxkcmVuLmxlbmd0aD4wKSB7XHJcbiAgICAgICAgdGhpcy5zb3J0QnlPcmRlcihpdGVtLmNoaWxkcmVuKTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gICB9XHJcblxyXG4gIHJlYnVpbGRUcmVlRm9yRGF0YShkYXRhOiBhbnlbXSkge1xyXG4gICAgLy90aGlzLmRhdGFTb3VyY2UuZGF0YSA9IGRhdGE7XHJcbiAgICB0aGlzLnNvcnRCeU9yZGVyKGRhdGEpO1xyXG4gICAgdGhpcy5kYXRhU291cmNlLmRhdGEgPSBbXTtcclxuICAgIHRoaXMuZGF0YVNvdXJjZS5kYXRhID0gZGF0YTtcclxuICAgIHRoaXMudHJlZUNvbnRyb2wuZXhwYW5zaW9uTW9kZWwuc2VsZWN0ZWQuZm9yRWFjaCgobm9kZUFjdCkgPT4ge1xyXG4gICAgICBjb25zdCBub2RlID0gdGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXMuZmluZCgobikgPT4gbi5pZCA9PT0gbm9kZUFjdC5pZCk7XHJcbiAgICAgIHRoaXMudHJlZUNvbnRyb2wuZXhwYW5kKG5vZGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFBhcmVudE5vZGUobm9kZTogRmlsZUZsYXROb2RlKTogRmlsZUZsYXROb2RlIHwgbnVsbCB7XHJcbiAgICBjb25zdCBjdXJyZW50TGV2ZWwgPSBub2RlLmxldmVsO1xyXG4gICAgaWYgKGN1cnJlbnRMZXZlbCA8IDEpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzdGFydEluZGV4ID0gdGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXMuaW5kZXhPZihub2RlKSAtIDE7XHJcbiAgICBmb3IgKGxldCBpID0gc3RhcnRJbmRleDsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgY29uc3QgY3VycmVudE5vZGUgPSB0aGlzLnRyZWVDb250cm9sLmRhdGFOb2Rlc1tpXTtcclxuICAgICAgaWYgKGN1cnJlbnROb2RlLmxldmVsIDwgY3VycmVudExldmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHVwZGF0ZU5vZGUobm9kZVVwZGF0ZWQpXHJcbiAge1xyXG4gICAgY29uc3QgZGF0YVRvQ2hhbmdlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGFTb3VyY2UuZGF0YSkpXHJcbiAgICBjb25zdCBzaWJsaW5ncyA9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhkYXRhVG9DaGFuZ2UsIG5vZGVVcGRhdGVkLmlkKTtcclxuICAgIGxldCBpbmRleD0gc2libGluZ3MuZmluZEluZGV4KG5vZGUgPT4gbm9kZS5pZCA9PT0gbm9kZVVwZGF0ZWQuaWQpXHJcbiAgICBzaWJsaW5nc1tpbmRleF09bm9kZVVwZGF0ZWQ7XHJcbiAgICB0aGlzLnJlYnVpbGRUcmVlRm9yRGF0YShkYXRhVG9DaGFuZ2UpO1xyXG5cclxuICB9XHJcblxyXG4gIGNyZWF0ZU5ld0ZvbGRlcihuZXdGb2xkZXIpXHJcbiAge1xyXG4gICAgbmV3Rm9sZGVyLnR5cGU9XCJmb2xkZXJcIjtcclxuICAgIGNvbnN0IGRhdGFUb0NoYW5nZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhU291cmNlLmRhdGEpKVxyXG4gICAgaWYobmV3Rm9sZGVyLnBhcmVudCA9PT0gbnVsbCkge1xyXG4gICAgICBuZXdGb2xkZXIub3JkZXI9ZGF0YVRvQ2hhbmdlWzBdLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgZGF0YVRvQ2hhbmdlWzBdLmNoaWxkcmVuLnB1c2gobmV3Rm9sZGVyKVxyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgY29uc3Qgc2libGluZ3MgPSB0aGlzLmZpbmROb2RlU2libGluZ3MoZGF0YVRvQ2hhbmdlLCBuZXdGb2xkZXIucGFyZW50KTtcclxuICAgICAgbGV0IGluZGV4PSBzaWJsaW5ncy5maW5kSW5kZXgobm9kZSA9PiBub2RlLmlkID09PSBuZXdGb2xkZXIucGFyZW50KTtcclxuICAgICAgbmV3Rm9sZGVyLm9yZGVyPXNpYmxpbmdzW2luZGV4XS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgIHNpYmxpbmdzW2luZGV4XS5jaGlsZHJlbi5wdXNoKG5ld0ZvbGRlcilcclxuICAgIH1cclxuICAgIHRoaXMucmVidWlsZFRyZWVGb3JEYXRhKGRhdGFUb0NoYW5nZSk7XHJcblxyXG4gIH1cclxuXHJcbiAgY3JlYXRlTmV3Tm9kZShuZXdOb2RlKVxyXG4gIHtcclxuICAgIG5ld05vZGUudHlwZT1cIm5vZGVcIjtcclxuICAgIGNvbnN0IGRhdGFUb0NoYW5nZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhU291cmNlLmRhdGEpKVxyXG4gICAgaWYobmV3Tm9kZS5wYXJlbnQgPT09IG51bGwpIHtcclxuICAgICAgbmV3Tm9kZS5vcmRlcj1kYXRhVG9DaGFuZ2VbMF0uY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICBkYXRhVG9DaGFuZ2VbMF0uY2hpbGRyZW4ucHVzaChuZXdOb2RlKVxyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgIGNvbnN0IHNpYmxpbmdzID0gdGhpcy5maW5kTm9kZVNpYmxpbmdzKGRhdGFUb0NoYW5nZSwgbmV3Tm9kZS5wYXJlbnQpO1xyXG4gICAgbGV0IGluZGV4PSBzaWJsaW5ncy5maW5kSW5kZXgobm9kZSA9PiBub2RlLmlkID09PSBuZXdOb2RlLnBhcmVudCk7XHJcbiAgICBuZXdOb2RlLm9yZGVyPXNpYmxpbmdzW2luZGV4XS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICBzaWJsaW5nc1tpbmRleF0uY2hpbGRyZW4ucHVzaChuZXdOb2RlKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVidWlsZFRyZWVGb3JEYXRhKGRhdGFUb0NoYW5nZSk7XHJcblxyXG4gIH1cclxuXHJcblxyXG5cclxuICBvbkJ1dHRvbkNsaWNrZWQoaWQsIGJ1dHRvbjogc3RyaW5nKVxyXG4gIHtcclxuICAgIGNvbnN0IGNoYW5nZWREYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGFTb3VyY2UuZGF0YSkpXHJcbiAgICBjb25zdCBzaWJsaW5ncyA9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhjaGFuZ2VkRGF0YSwgaWQpO1xyXG4gICAgbGV0IG5vZGVDbGlja2VkPSBzaWJsaW5ncy5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gaWQpO1xyXG4gICAgaWYoYnV0dG9uID09PSdlZGl0JykgIHt0aGlzLmVtaXROb2RlLmVtaXQobm9kZUNsaWNrZWQpfVxyXG4gICAgZWxzZSBpZihidXR0b24gPT09ICduZXdGb2xkZXInKSB7dGhpcy5jcmVhdGVGb2xkZXIuZW1pdChub2RlQ2xpY2tlZCl9XHJcbiAgICBlbHNlIGlmKGJ1dHRvbiA9PT0gJ25ld05vZGUnKSB7dGhpcy5jcmVhdGVOb2RlLmVtaXQoIG5vZGVDbGlja2VkKX1cclxuICAgIGVsc2UgaWYoYnV0dG9uID09PSAnZGVsZXRlJykge1xyXG4gICAgICAvLyBsZXQgY2hpbGRyZW49IHRoaXMuZ2V0QWxsQ2hpbGRyZW4obm9kZUNsaWNrZWQuY2hpbGRyZW4pXHJcbiAgICAgIC8vIGNoaWxkcmVuLmZvckVhY2goY2hpbGRyZW4gPT4ge1xyXG4gICAgICAvLyAgIGNoaWxkcmVuLnN0YXR1cz0ncGVuZGluZ0RlbGV0ZSc7XHJcbiAgICAgIC8vIH0pO1xyXG4gICAgICB0aGlzLmRlbGV0ZUNoaWxkcmVuKG5vZGVDbGlja2VkLmNoaWxkcmVuKTtcclxuICAgICAgLy8gbm9kZUNsaWNrZWQuY2hpbGRyZW49Y2hpbGRyZW5cclxuICAgICAgbm9kZUNsaWNrZWQuc3RhdHVzPSdwZW5kaW5nRGVsZXRlJ1xyXG4gICAgICBcclxuICAgICAgdGhpcy5yZWJ1aWxkVHJlZUZvckRhdGEoY2hhbmdlZERhdGEpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGVtaXRBbGxSb3dzKClcclxuICB7XHJcbiAgICBjb25zdCBkYXRhVG9FbWl0ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGFTb3VyY2UuZGF0YSkpXHJcbiAgICBsZXQgYWxsUm93cyA9IHRoaXMuZ2V0QWxsQ2hpbGRyZW4oZGF0YVRvRW1pdCk7IFxyXG4gICAgdGhpcy5lbWl0QWxsTm9kZXMuZW1pdChhbGxSb3dzKTtcclxuICB9XHJcblxyXG4gIGdldEFsbENoaWxkcmVuKGFycilcclxuICB7XHJcbiAgICBsZXQgcmVzdWx0ID0gW107XHJcbiAgICBsZXQgc3ViUmVzdWx0O1xyXG4gICAgYXJyLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4ubGVuZ3RoPjApIHtcclxuICAgICAgICBzdWJSZXN1bHQgPSB0aGlzLmdldEFsbENoaWxkcmVuKGl0ZW0uY2hpbGRyZW4pO1xyXG4gICAgICAgIGlmIChzdWJSZXN1bHQpIHJlc3VsdC5wdXNoKC4uLnN1YlJlc3VsdCk7XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XHJcblxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlQ2hpbGRyZW4oYXJyKVxyXG4gIHtcclxuICAgIGFyci5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLmNoaWxkcmVuLmxlbmd0aD4wKSB7XHJcbiAgICAgICAgdGhpcy5kZWxldGVDaGlsZHJlbihpdGVtLmNoaWxkcmVuKTtcclxuICAgICAgfVxyXG4gICAgICBpdGVtLnN0YXR1cz0ncGVuZGluZ0RlbGV0ZSdcclxuXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59XHJcblxyXG5cclxuIl19