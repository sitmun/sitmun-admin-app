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
        const siblings = this.findNodeSiblings(changedData, node.id);
        /** @type {?} */
        let toFlatNode = siblings.find(nodeAct => nodeAct.id === node.id);
        /** @type {?} */
        let fromFlatNode = siblings.find(nodeAct => nodeAct.id === this.dragNode.id);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS10cmVlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGF0YS10cmVlL2RhdGEtdHJlZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pHLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2pGLE9BQU8sRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLEVBQUUsSUFBSSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFdkUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7OztBQU8xRCxNQUFNLE9BQU8sUUFBUTtDQXNCcEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdELE1BQU0sT0FBTyxZQUFZOzs7Ozs7Ozs7SUFDdkIsWUFDUyxZQUNBLE1BQ0EsT0FDQSxNQUNBLElBQ0E7UUFMQSxlQUFVLEdBQVYsVUFBVTtRQUNWLFNBQUksR0FBSixJQUFJO1FBQ0osVUFBSyxHQUFMLEtBQUs7UUFDTCxTQUFJLEdBQUosSUFBSTtRQUNKLE9BQUUsR0FBRixFQUFFO1FBQ0YsV0FBTSxHQUFOLE1BQU07S0FDVjtDQUNOOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBWUQsTUFBTSxPQUFPLFlBQVk7SUFJdkI7MEJBSGEsSUFBSSxlQUFlLENBQWEsRUFBRSxDQUFDO0tBSy9DOzs7O0lBSkQsSUFBSSxJQUFJLEtBQVUs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YUFDMUI7Ozs7WUEyQzhCLFlBQVk7Ozt5QkF6Q3hDLE1BQU07MkJBQ04sTUFBTTt1QkFDTixNQUFNOzJCQUNOLE1BQU07MkNBQ04sS0FBSzswQ0FDTCxLQUFLOzBDQUNMLEtBQUs7dUNBQ0wsS0FBSztxQkFnQkwsS0FBSzt3QkFTTCxTQUFTLFNBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZsYXRUcmVlQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdGFibGUsIElucHV0LCBPdXRwdXQsRWxlbWVudFJlZiwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE1hdFRyZWVGbGF0RGF0YVNvdXJjZSwgTWF0VHJlZUZsYXR0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3RyZWUnO1xyXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIG9mIGFzIG9ic2VydmFibGVPZiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBDZGtEcmFnRHJvcCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9kcmFnLWRyb3AnO1xyXG5pbXBvcnQgeyBTZWxlY3Rpb25Nb2RlbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XHJcbmltcG9ydCB7IGZvckVhY2ggfSBmcm9tICdqc3ppcCc7XHJcblxyXG4vKipcclxuICogRmlsZSBub2RlIGRhdGEgd2l0aCBuZXN0ZWQgc3RydWN0dXJlLlxyXG4gKiBFYWNoIG5vZGUgaGFzIGEgbmFtZSwgYW5kIGEgdHlwZSBvciBhIGxpc3Qgb2YgY2hpbGRyZW4uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRmlsZU5vZGUge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgY2hpbGRyZW46IEZpbGVOb2RlW107XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIHR5cGU6IGFueTtcclxuICBhY3RpdmU6IGFueVxyXG4gIGNhcnRvZ3JhcGh5SWQ6IGFueVxyXG4gIGNhcnRvZ3JhcGh5TmFtZTogYW55XHJcbiAgZGF0YXNldFVSTDogYW55XHJcbiAgZGVzY3JpcHRpb246IGFueVxyXG4gIGZpbHRlckdldEZlYXR1cmVJbmZvOiBhbnlcclxuICBmaWx0ZXJHZXRNYXA6IGFueVxyXG4gIGZpbHRlclNlbGVjdGFibGU6IGFueVxyXG4gIGlzRm9sZGVyOiBhbnlcclxuICBtZXRhZGF0YVVSTDogYW55XHJcbiAgb3JkZXI6IGFueVxyXG4gIHBhcmVudDogYW55XHJcbiAgcXVlcnlhYmxlQWN0aXZlOiBhbnlcclxuICByYWRpbzogYW55XHJcbiAgdG9vbHRpcDogYW55XHJcbiAgX2xpbmtzOiBhbnlcclxuICBzdGF0dXM6IGFueVxyXG59XHJcblxyXG4vKiogRmxhdCBub2RlIHdpdGggZXhwYW5kYWJsZSBhbmQgbGV2ZWwgaW5mb3JtYXRpb24gKi9cclxuZXhwb3J0IGNsYXNzIEZpbGVGbGF0Tm9kZSB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwdWJsaWMgZXhwYW5kYWJsZTogYm9vbGVhbixcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcsXHJcbiAgICBwdWJsaWMgbGV2ZWw6IG51bWJlcixcclxuICAgIHB1YmxpYyB0eXBlOiBhbnksXHJcbiAgICBwdWJsaWMgaWQ6IHN0cmluZyxcclxuICAgIHB1YmxpYyBzdGF0dXM6IHN0cmluZ1xyXG4gICkgeyB9XHJcbn1cclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIEZpbGUgZGF0YWJhc2UsIGl0IGNhbiBidWlsZCBhIHRyZWUgc3RydWN0dXJlZCBKc29uIG9iamVjdCBmcm9tIHN0cmluZy5cclxuICogRWFjaCBub2RlIGluIEpzb24gb2JqZWN0IHJlcHJlc2VudHMgYSBmaWxlIG9yIGEgZGlyZWN0b3J5LiBGb3IgYSBmaWxlLCBpdCBoYXMgbmFtZSBhbmQgdHlwZS5cclxuICogRm9yIGEgZGlyZWN0b3J5LCBpdCBoYXMgbmFtZSBhbmQgY2hpbGRyZW4gKGEgbGlzdCBvZiBmaWxlcyBvciBkaXJlY3RvcmllcykuXHJcbiAqIFRoZSBpbnB1dCB3aWxsIGJlIGEganNvbiBvYmplY3Qgc3RyaW5nLCBhbmQgdGhlIG91dHB1dCBpcyBhIGxpc3Qgb2YgYEZpbGVOb2RlYCB3aXRoIG5lc3RlZFxyXG4gKiBzdHJ1Y3R1cmUuXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBGaWxlRGF0YWJhc2Uge1xyXG4gIGRhdGFDaGFuZ2UgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEZpbGVOb2RlW10+KFtdKTtcclxuICBnZXQgZGF0YSgpOiBhbnkgeyByZXR1cm4gdGhpcy5kYXRhQ2hhbmdlLnZhbHVlOyB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICB9XHJcblxyXG4gIGluaXRpYWxpemUoZGF0YU9iaikge1xyXG5cclxuICAgIC8vIEJ1aWxkIHRoZSB0cmVlIG5vZGVzIGZyb20gSnNvbiBvYmplY3QuIFRoZSByZXN1bHQgaXMgYSBsaXN0IG9mIGBGaWxlTm9kZWAgd2l0aCBuZXN0ZWRcclxuICAgIC8vICAgICBmaWxlIG5vZGUgYXMgY2hpbGRyZW4uXHJcbiAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZEZpbGVUcmVlKGRhdGFPYmosIDApO1xyXG5cclxuICAgIC8vIE5vdGlmeSB0aGUgY2hhbmdlLlxyXG4gICAgdGhpcy5kYXRhQ2hhbmdlLm5leHQoZGF0YSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBCdWlsZCB0aGUgZmlsZSBzdHJ1Y3R1cmUgdHJlZS4gVGhlIGB2YWx1ZWAgaXMgdGhlIEpzb24gb2JqZWN0LCBvciBhIHN1Yi10cmVlIG9mIGEgSnNvbiBvYmplY3QuXHJcbiAgICogVGhlIHJldHVybiB2YWx1ZSBpcyB0aGUgbGlzdCBvZiBgRmlsZU5vZGVgLlxyXG4gICAqL1xyXG4gIGJ1aWxkRmlsZVRyZWUoYXJyYXlUcmVlTm9kZXM6IGFueVtdLCBsZXZlbDogbnVtYmVyKTogYW55IHtcclxuICAgIHZhciBtYXAgPSB7fTtcclxuICAgIGlmKGFycmF5VHJlZU5vZGVzLmxlbmd0aD09PTApXHJcbiAgICB7XHJcbiAgICAgIGxldCByb290ID0ge1xyXG4gICAgICAgIGlzRm9sZGVyOnRydWUsXHJcbiAgICAgICAgbmFtZTonUm9vdCcsXHJcbiAgICAgICAgdHlwZTogJ2ZvbGRlcicsXHJcbiAgICAgICAgaXNSb290OiB0cnVlLFxyXG4gICAgICAgIG9yZGVyOiAwLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXVxyXG4gICAgICB9XHJcbiAgICAgIG1hcFsncm9vdCddPXJvb3Q7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBhcnJheVRyZWVOb2Rlcy5mb3JFYWNoKCh0cmVlTm9kZSkgPT4ge1xyXG4gICAgICAgIHZhciBvYmogPSB0cmVlTm9kZTtcclxuICAgICAgICBvYmouY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICBvYmoudHlwZT0gKHRyZWVOb2RlLmlzRm9sZGVyKT8gXCJmb2xkZXJcIiA6IFwibm9kZVwiO1xyXG4gIFxyXG4gICAgICAgIGlmKCFtYXBbb2JqLmlkXSkge21hcFtvYmouaWRdID0gb2JqO31cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgbGV0IHByZXZpb3VzQ2hpbGRyZW49IG1hcFtvYmouaWRdLmNoaWxkcmVuXHJcbiAgICAgICAgICBtYXBbb2JqLmlkXSA9IG9iajtcclxuICAgICAgICAgIG1hcFtvYmouaWRdLmNoaWxkcmVuPXByZXZpb3VzQ2hpbGRyZW5cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHBhcmVudCA9IG9iai5wYXJlbnQgfHwgJ3Jvb3QnO1xyXG4gICAgICAgIGlmICghbWFwW3BhcmVudF0pIHtcclxuICAgICAgICAgIG1hcFtwYXJlbnRdID0ge1xyXG4gICAgICAgICAgICBjaGlsZHJlbjogW11cclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1hcFtwYXJlbnRdLmNoaWxkcmVuLnB1c2gob2JqKTtcclxuICAgICAgfSk7XHJcbiAgICAgIG1hcFsncm9vdCddLnR5cGU9J2ZvbGRlcic7XHJcbiAgICAgIG1hcFsncm9vdCddLm5hbWU9J1Jvb3QnO1xyXG4gICAgICBtYXBbJ3Jvb3QnXS5vcmRlcj0wO1xyXG4gICAgICBtYXBbJ3Jvb3QnXS5pc0ZvbGRlcj10cnVlO1xyXG4gICAgICBtYXBbJ3Jvb3QnXS5pc1Jvb3Q9dHJ1ZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmV0dXJuIG1hcFsncm9vdCddO1xyXG4gIH1cclxuICBcclxuXHJcbiAgZGVsZXRlSXRlbShub2RlOiBGaWxlTm9kZSwgY2hhbmdlZERhdGE6YW55KSB7XHJcbiAgICB0aGlzLmRlbGV0ZU5vZGUoY2hhbmdlZERhdGEuY2hpbGRyZW4sIG5vZGUpO1xyXG4gICAgdGhpcy5kYXRhQ2hhbmdlLm5leHQoY2hhbmdlZERhdGEpO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlTm9kZShub2RlczogRmlsZU5vZGVbXSwgbm9kZVRvRGVsZXRlOiBGaWxlTm9kZSkge1xyXG4gICAgY29uc3QgaW5kZXggPSBub2Rlcy5pbmRleE9mKG5vZGVUb0RlbGV0ZSwgMCk7XHJcbiAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICBub2Rlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICBpZiAobm9kZS5jaGlsZHJlbiAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuZGVsZXRlTm9kZShub2RlLmNoaWxkcmVuLCBub2RlVG9EZWxldGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb3B5UGFzdGVJdGVtKGZyb206IEZpbGVOb2RlLCB0bzogRmlsZU5vZGUsIGNoYW5nZWREYXRhOmFueSk6IEZpbGVOb2RlIHtcclxuICAgIGNvbnN0IG5ld0l0ZW0gPSB0aGlzLmluc2VydEl0ZW0odG8sIGZyb20sY2hhbmdlZERhdGEpO1xyXG5cclxuICAgIHJldHVybiBuZXdJdGVtO1xyXG4gIH1cclxuXHJcbiAgY29weVBhc3RlSXRlbUFib3ZlKGZyb206IEZpbGVOb2RlLCB0bzogRmlsZU5vZGUsY2hhbmdlZERhdGE6YW55KTogRmlsZU5vZGUge1xyXG4gICAgY29uc3QgbmV3SXRlbSA9IHRoaXMuaW5zZXJ0SXRlbUFib3ZlKHRvLCBmcm9tLGNoYW5nZWREYXRhKTtcclxuXHJcbiAgICByZXR1cm4gbmV3SXRlbTtcclxuICB9XHJcblxyXG4gIGNvcHlQYXN0ZUl0ZW1CZWxvdyhmcm9tOiBGaWxlTm9kZSwgdG86IEZpbGVOb2RlLGNoYW5nZWREYXRhOmFueSk6IEZpbGVOb2RlIHtcclxuICAgIGNvbnN0IG5ld0l0ZW0gPSB0aGlzLmluc2VydEl0ZW1CZWxvdyh0bywgZnJvbSxjaGFuZ2VkRGF0YSk7XHJcblxyXG4gICAgcmV0dXJuIG5ld0l0ZW07XHJcbiAgfVxyXG5cclxuICAvKiogQWRkIGFuIGl0ZW0gdG8gdG8tZG8gbGlzdCAqL1xyXG4gIFxyXG4gIGdldE5ld0l0ZW0obm9kZTpGaWxlTm9kZSl7XHJcbiAgICBjb25zdCBuZXdJdGVtID0ge1xyXG4gICAgICBuYW1lOiBub2RlLm5hbWUsXHJcbiAgICAgIGNoaWxkcmVuOiBub2RlLmNoaWxkcmVuLFxyXG4gICAgICB0eXBlOiBub2RlLnR5cGUsXHJcbiAgICAgIGlkOiBub2RlLmlkLCBcclxuICAgICAgYWN0aXZlOiBub2RlLmFjdGl2ZSxcclxuICAgICAgY2FydG9ncmFwaHlJZDogbm9kZS5jYXJ0b2dyYXBoeUlkLFxyXG4gICAgICBjYXJ0b2dyYXBoeU5hbWU6IG5vZGUuY2FydG9ncmFwaHlOYW1lLFxyXG4gICAgICBkYXRhc2V0VVJMOiBub2RlLmRhdGFzZXRVUkwsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiBub2RlLmRlc2NyaXB0aW9uLFxyXG4gICAgICBmaWx0ZXJHZXRGZWF0dXJlSW5mbzogbm9kZS5maWx0ZXJHZXRGZWF0dXJlSW5mbyxcclxuICAgICAgZmlsdGVyR2V0TWFwOiBub2RlLmZpbHRlckdldE1hcCxcclxuICAgICAgZmlsdGVyU2VsZWN0YWJsZTogbm9kZS5maWx0ZXJTZWxlY3RhYmxlLFxyXG4gICAgICBpc0ZvbGRlcjogbm9kZS5pc0ZvbGRlcixcclxuICAgICAgbWV0YWRhdGFVUkw6IG5vZGUubWV0YWRhdGFVUkwsXHJcbiAgICAgIG9yZGVyOiBub2RlLm9yZGVyLFxyXG4gICAgICBxdWVyeWFibGVBY3RpdmU6IG5vZGUucXVlcnlhYmxlQWN0aXZlLFxyXG4gICAgICByYWRpbzogbm9kZS5yYWRpbyxcclxuICAgICAgdG9vbHRpcDogbm9kZS50b29sdGlwLFxyXG4gICAgICBfbGlua3M6IG5vZGUuX2xpbmtzIH0gYXMgRmlsZU5vZGU7XHJcblxyXG4gICAgcmV0dXJuIG5ld0l0ZW07XHJcbiAgfVxyXG5cclxuICBpbnNlcnRJdGVtKHBhcmVudDogRmlsZU5vZGUsIG5vZGU6IEZpbGVOb2RlLGNoYW5nZWREYXRhOmFueSk6IEZpbGVOb2RlIHtcclxuICAgIGlmICghcGFyZW50LmNoaWxkcmVuKSB7XHJcbiAgICAgIHBhcmVudC5jaGlsZHJlbiA9IFtdO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbmV3SXRlbSA9IHRoaXMuZ2V0TmV3SXRlbShub2RlKVxyXG4gICAgbmV3SXRlbS5wYXJlbnQgPSBwYXJlbnQ9PW51bGwgfHwgcGFyZW50LmlkPT11bmRlZmluZWQ/bnVsbDpwYXJlbnQuaWQ7XHJcblxyXG4gICAgcGFyZW50LmNoaWxkcmVuLnB1c2gobmV3SXRlbSk7XHJcbiAgICB0aGlzLmRhdGFDaGFuZ2UubmV4dChjaGFuZ2VkRGF0YSk7XHJcbiAgICByZXR1cm4gbmV3SXRlbTtcclxuICB9XHJcblxyXG4gIGluc2VydEl0ZW1BYm92ZShub2RlOiBGaWxlTm9kZSwgbm9kZURyYWc6IEZpbGVOb2RlLGNoYW5nZWREYXRhOmFueSk6IEZpbGVOb2RlIHtcclxuICAgIGNvbnN0IHBhcmVudE5vZGUgPSB0aGlzLmdldFBhcmVudEZyb21Ob2Rlcyhub2RlLGNoYW5nZWREYXRhKTtcclxuICAgIGNvbnN0IG5ld0l0ZW0gPSB0aGlzLmdldE5ld0l0ZW0obm9kZURyYWcpXHJcbiAgICBuZXdJdGVtLnBhcmVudCA9IHBhcmVudE5vZGU9PW51bGwgfHwgcGFyZW50Tm9kZS5pZD09dW5kZWZpbmVkP251bGw6cGFyZW50Tm9kZS5pZDtcclxuXHJcbiAgICBpZiAocGFyZW50Tm9kZSAhPSBudWxsKSB7XHJcbiAgICAgIHBhcmVudE5vZGUuY2hpbGRyZW4uc3BsaWNlKHBhcmVudE5vZGUuY2hpbGRyZW4uaW5kZXhPZihub2RlKSwgMCwgbmV3SXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjaGFuZ2VkRGF0YS5jaGlsZHJlbi5zcGxpY2UoY2hhbmdlZERhdGEuY2hpbGRyZW4uaW5kZXhPZihub2RlKSwgMCwgbmV3SXRlbSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmRhdGFDaGFuZ2UubmV4dChjaGFuZ2VkRGF0YSk7XHJcbiAgICByZXR1cm4gbmV3SXRlbTtcclxuICB9XHJcblxyXG4gIGluc2VydEl0ZW1CZWxvdyhub2RlOiBGaWxlTm9kZSwgbm9kZURyYWc6IEZpbGVOb2RlLGNoYW5nZWREYXRhOmFueSk6IEZpbGVOb2RlIHtcclxuICAgIGNvbnN0IHBhcmVudE5vZGUgPSB0aGlzLmdldFBhcmVudEZyb21Ob2Rlcyhub2RlLGNoYW5nZWREYXRhKTtcclxuICAgXHJcbiAgICBjb25zdCBuZXdJdGVtID0gdGhpcy5nZXROZXdJdGVtKG5vZGVEcmFnKVxyXG4gICAgbmV3SXRlbS5wYXJlbnQgPSBwYXJlbnROb2RlPT1udWxsIHx8IHBhcmVudE5vZGUuaWQ9PXVuZGVmaW5lZD9udWxsOnBhcmVudE5vZGUuaWQ7XHJcblxyXG4gICAgaWYgKHBhcmVudE5vZGUgIT0gbnVsbCkge1xyXG4gICAgICBwYXJlbnROb2RlLmNoaWxkcmVuLnNwbGljZShwYXJlbnROb2RlLmNoaWxkcmVuLmluZGV4T2Yobm9kZSkgKyAxLCAwLCBuZXdJdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNoYW5nZWREYXRhLmNoaWxkcmVuLnNwbGljZShjaGFuZ2VkRGF0YS5jaGlsZHJlbi5pbmRleE9mKG5vZGUpICsgMSwgMCwgbmV3SXRlbSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmRhdGFDaGFuZ2UubmV4dChjaGFuZ2VkRGF0YSk7XHJcbiAgICByZXR1cm4gbmV3SXRlbTtcclxuICB9XHJcblxyXG4gIFxyXG4gIGdldFBhcmVudEZyb21Ob2Rlcyhub2RlOiBGaWxlTm9kZSxjaGFuZ2VkRGF0YTphbnkpOiBGaWxlTm9kZSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYW5nZWREYXRhLmNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnRSb290ID0gIGNoYW5nZWREYXRhLmNoaWxkcmVuW2ldO1xyXG4gICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmdldFBhcmVudChjdXJyZW50Um9vdCwgbm9kZSk7XHJcbiAgICAgIGlmIChwYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBwYXJlbnQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgXHJcbiAgZ2V0UGFyZW50KGN1cnJlbnRSb290OiBGaWxlTm9kZSwgbm9kZTogRmlsZU5vZGUpOiBGaWxlTm9kZSB7XHJcbiAgICBpZiAoY3VycmVudFJvb3QuY2hpbGRyZW4gJiYgY3VycmVudFJvb3QuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRSb290LmNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgY29uc3QgY2hpbGQgPSBjdXJyZW50Um9vdC5jaGlsZHJlbltpXTtcclxuICAgICAgICBpZiAoY2hpbGQgPT09IG5vZGUpIHtcclxuICAgICAgICAgIHJldHVybiBjdXJyZW50Um9vdDtcclxuICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLmNoaWxkcmVuICYmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50KGNoaWxkLCBub2RlKTtcclxuICAgICAgICAgIGlmIChwYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIEB0aXRsZSBUcmVlIHdpdGggZmxhdCBub2Rlc1xyXG4gKi9cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtZGF0YS10cmVlJyxcclxuICB0ZW1wbGF0ZVVybDogJ2RhdGEtdHJlZS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ2RhdGEtdHJlZS5jb21wb25lbnQuc2NzcyddLFxyXG4gIHByb3ZpZGVyczogW0ZpbGVEYXRhYmFzZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIERhdGFUcmVlQ29tcG9uZW50IHtcclxuICBAT3V0cHV0KCkgY3JlYXRlTm9kZTogRXZlbnRFbWl0dGVyPGFueT47XHJcbiAgQE91dHB1dCgpIGNyZWF0ZUZvbGRlcjogRXZlbnRFbWl0dGVyPGFueT47XHJcbiAgQE91dHB1dCgpIGVtaXROb2RlOiBFdmVudEVtaXR0ZXI8YW55PjtcclxuICBAT3V0cHV0KCkgZW1pdEFsbE5vZGVzOiBFdmVudEVtaXR0ZXI8YW55PjtcclxuICBASW5wdXQoKSBldmVudE5vZGVVcGRhdGVkU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlIDxhbnk+IDtcclxuICBASW5wdXQoKSBldmVudENyZWF0ZU5vZGVTdWJzY3JpcHRpb246IE9ic2VydmFibGUgPGFueT4gO1xyXG4gIEBJbnB1dCgpIGV2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZSA8YW55PiA7XHJcbiAgQElucHV0KCkgZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlIDxhbnk+IDtcclxuICBwcml2YXRlIF9ldmVudE5vZGVVcGRhdGVkU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgcHJpdmF0ZSBfZXZlbnRDcmVhdGVOb2RlU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgcHJpdmF0ZSBfZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgcHJpdmF0ZSBfZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgdHJlZUNvbnRyb2w6IEZsYXRUcmVlQ29udHJvbDxGaWxlRmxhdE5vZGU+O1xyXG4gIHRyZWVGbGF0dGVuZXI6IE1hdFRyZWVGbGF0dGVuZXI8RmlsZU5vZGUsIEZpbGVGbGF0Tm9kZT47XHJcbiAgZGF0YVNvdXJjZTogTWF0VHJlZUZsYXREYXRhU291cmNlPEZpbGVOb2RlLCBGaWxlRmxhdE5vZGU+O1xyXG4gIC8vIGV4cGFuc2lvbiBtb2RlbCB0cmFja3MgZXhwYW5zaW9uIHN0YXRlXHJcbiAgZXhwYW5zaW9uTW9kZWwgPSBuZXcgU2VsZWN0aW9uTW9kZWw8c3RyaW5nPih0cnVlKTtcclxuICBkcmFnZ2luZyA9IGZhbHNlO1xyXG4gIGV4cGFuZFRpbWVvdXQ6IGFueTtcclxuICBleHBhbmREZWxheSA9IDEwMDA7XHJcbiAgdmFsaWRhdGVEcm9wID0gZmFsc2U7XHJcbiAgdHJlZURhdGE6IGFueTtcclxuXHJcbiAgQElucHV0KCkgZ2V0QWxsOiAoKSA9PiBPYnNlcnZhYmxlPGFueT47XHJcblxyXG5cclxuICAvKiBEcmFnIGFuZCBkcm9wICovXHJcbiAgZHJhZ05vZGU6IGFueTtcclxuICBkcmFnTm9kZUV4cGFuZE92ZXJXYWl0VGltZU1zID0gMTUwMDtcclxuICBkcmFnTm9kZUV4cGFuZE92ZXJOb2RlOiBhbnk7XHJcbiAgZHJhZ05vZGVFeHBhbmRPdmVyVGltZTogbnVtYmVyO1xyXG4gIGRyYWdOb2RlRXhwYW5kT3ZlckFyZWE6IHN0cmluZztcclxuICBAVmlld0NoaWxkKCdlbXB0eUl0ZW0nKSBlbXB0eUl0ZW06IEVsZW1lbnRSZWY7XHJcblxyXG4gICAgLyoqIE1hcCBmcm9tIGZsYXQgbm9kZSB0byBuZXN0ZWQgbm9kZS4gVGhpcyBoZWxwcyB1cyBmaW5kaW5nIHRoZSBuZXN0ZWQgbm9kZSB0byBiZSBtb2RpZmllZCAqL1xyXG4gICAgZmxhdE5vZGVNYXAgPSBuZXcgTWFwPEZpbGVGbGF0Tm9kZSwgRmlsZU5vZGU+KCk7XHJcblxyXG4gICAgLyoqIE1hcCBmcm9tIG5lc3RlZCBub2RlIHRvIGZsYXR0ZW5lZCBub2RlLiBUaGlzIGhlbHBzIHVzIHRvIGtlZXAgdGhlIHNhbWUgb2JqZWN0IGZvciBzZWxlY3Rpb24gKi9cclxuICAgIG5lc3RlZE5vZGVNYXAgPSBuZXcgTWFwPEZpbGVOb2RlLCBGaWxlRmxhdE5vZGU+KCk7XHJcblxyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGF0YWJhc2U6IEZpbGVEYXRhYmFzZSkge1xyXG4gICAgdGhpcy5lbWl0Tm9kZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuY3JlYXRlTm9kZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuY3JlYXRlRm9sZGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5lbWl0QWxsTm9kZXMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLnRyZWVGbGF0dGVuZXIgPSBuZXcgTWF0VHJlZUZsYXR0ZW5lcih0aGlzLnRyYW5zZm9ybWVyLCB0aGlzLl9nZXRMZXZlbCxcclxuICAgICAgdGhpcy5faXNFeHBhbmRhYmxlLCB0aGlzLl9nZXRDaGlsZHJlbik7XHJcbiAgICB0aGlzLnRyZWVDb250cm9sID0gbmV3IEZsYXRUcmVlQ29udHJvbDxGaWxlRmxhdE5vZGU+KHRoaXMuX2dldExldmVsLCB0aGlzLl9pc0V4cGFuZGFibGUpO1xyXG4gICAgdGhpcy5kYXRhU291cmNlID0gbmV3IE1hdFRyZWVGbGF0RGF0YVNvdXJjZSh0aGlzLnRyZWVDb250cm9sLCB0aGlzLnRyZWVGbGF0dGVuZXIpO1xyXG4gXHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpe1xyXG5cclxuICAgIGlmKHRoaXMuZXZlbnROb2RlVXBkYXRlZFN1YnNjcmlwdGlvbilcclxuICAgIHtcclxuICAgICAgdGhpcy5ldmVudE5vZGVVcGRhdGVkU3Vic2NyaXB0aW9uLnN1YnNjcmliZShcclxuICAgICAgICAobm9kZSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy51cGRhdGVOb2RlKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG4gICAgfVxyXG4gICAgaWYodGhpcy5ldmVudENyZWF0ZU5vZGVTdWJzY3JpcHRpb24pXHJcbiAgICB7XHJcbiAgICAgIHRoaXMuZXZlbnRDcmVhdGVOb2RlU3Vic2NyaXB0aW9uLnN1YnNjcmliZShcclxuICAgICAgICAobm9kZSkgPT4ge1xyXG4gICAgICAgICAgaWYobm9kZS5pc0ZvbGRlcikgdGhpcy5jcmVhdGVOZXdGb2xkZXIobm9kZSk7XHJcbiAgICAgICAgICBlbHNlIHRoaXMuY3JlYXRlTmV3Tm9kZShub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5fZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uID0gdGhpcy5ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLmVtaXRBbGxSb3dzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmV2ZW50UmVmcmVzaFN1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLl9ldmVudFJlZnJlc2hTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50UmVmcmVzaFN1YnNjcmlwdGlvbi5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudHMoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRoaXMuZ2V0RWxlbWVudHMoKTtcclxuICB9XHJcblxyXG4gIGdldEVsZW1lbnRzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5nZXRBbGwoKVxyXG4gICAgLnN1YnNjcmliZSgoaXRlbXMpID0+IHtcclxuICAgICAgdGhpcy50cmVlRGF0YSA9IGl0ZW1zO1xyXG4gICAgICB0aGlzLmRhdGFiYXNlLmluaXRpYWxpemUodGhpcy50cmVlRGF0YSk7XHJcbiAgICAgIHRoaXMuZGF0YWJhc2UuZGF0YUNoYW5nZS5zdWJzY3JpYmUoZGF0YSA9PiB0aGlzLnJlYnVpbGRUcmVlRm9yRGF0YShbZGF0YV0pKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIHRyYW5zZm9ybWVyID0gKG5vZGU6IEZpbGVOb2RlLCBsZXZlbDogbnVtYmVyKSA9PiB7XHJcbiAgICBjb25zdCBleGlzdGluZ05vZGUgPSB0aGlzLm5lc3RlZE5vZGVNYXAuZ2V0KG5vZGUpO1xyXG4gICAgY29uc3QgZmxhdE5vZGUgPSBleGlzdGluZ05vZGUgJiYgZXhpc3RpbmdOb2RlLm5hbWUgPT09IG5vZGUubmFtZVxyXG4gICAgICA/IGV4aXN0aW5nTm9kZVxyXG4gICAgICA6IG5ldyBGaWxlRmxhdE5vZGUoKG5vZGUuY2hpbGRyZW4gJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSxub2RlLm5hbWUsbGV2ZWwsbm9kZS50eXBlLG5vZGUuaWQsbm9kZS5zdGF0dXMpO1xyXG5cclxuICAgIHRoaXMuZmxhdE5vZGVNYXAuc2V0KGZsYXROb2RlLCBub2RlKTtcclxuICAgIHRoaXMubmVzdGVkTm9kZU1hcC5zZXQobm9kZSwgZmxhdE5vZGUpO1xyXG4gICAgcmV0dXJuIGZsYXROb2RlO1xyXG4gIFxyXG4gIH1cclxuICBwcml2YXRlIF9nZXRMZXZlbCA9IChub2RlOiBGaWxlRmxhdE5vZGUpID0+IG5vZGUubGV2ZWw7XHJcbiAgcHJpdmF0ZSBfaXNFeHBhbmRhYmxlID0gKG5vZGU6IEZpbGVGbGF0Tm9kZSkgPT4gbm9kZS5leHBhbmRhYmxlO1xyXG4gIHByaXZhdGUgX2dldENoaWxkcmVuID0gKG5vZGU6IEZpbGVOb2RlKTogT2JzZXJ2YWJsZTxGaWxlTm9kZVtdPiA9PiBvYnNlcnZhYmxlT2Yobm9kZS5jaGlsZHJlbik7XHJcbiAgaGFzQ2hpbGQgPSAoXzogbnVtYmVyLCBfbm9kZURhdGE6IEZpbGVGbGF0Tm9kZSkgPT4gX25vZGVEYXRhLmV4cGFuZGFibGU7XHJcblxyXG5cclxuICAvKipcclxuICAgKiBUaGlzIGNvbnN0cnVjdHMgYW4gYXJyYXkgb2Ygbm9kZXMgdGhhdCBtYXRjaGVzIHRoZSBET01cclxuICAgKi9cclxuICB2aXNpYmxlTm9kZXMoKTogRmlsZU5vZGVbXSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICBmdW5jdGlvbiBhZGRFeHBhbmRlZENoaWxkcmVuKG5vZGU6IEZpbGVOb2RlLCBleHBhbmRlZDogc3RyaW5nW10pIHtcclxuICAgICAgcmVzdWx0LnB1c2gobm9kZSk7XHJcbiAgICAgIGlmIChleHBhbmRlZC5pbmRleE9mKG5vZGUuaWQpICE9IC0xKSB7XHJcbiAgICAgICAgbm9kZS5jaGlsZHJlbi5tYXAoKGNoaWxkKSA9PiBhZGRFeHBhbmRlZENoaWxkcmVuKGNoaWxkLCBleHBhbmRlZCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLmRhdGFTb3VyY2UuZGF0YS5mb3JFYWNoKChub2RlKSA9PiB7XHJcbiAgICAgIGFkZEV4cGFuZGVkQ2hpbGRyZW4obm9kZSwgdGhpcy5leHBhbnNpb25Nb2RlbC5zZWxlY3RlZCk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuXHJcbiAgIGZpbmROb2RlU2libGluZ3MoYXJyOiBBcnJheTxhbnk+LCBpZDogc3RyaW5nKTogQXJyYXk8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0LCBzdWJSZXN1bHQ7XHJcbiAgICBhcnIuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS5pZCA9PT0gaWQpIHtcclxuICAgICAgICByZXN1bHQgPSBhcnI7XHJcbiAgICAgIH0gZWxzZSBpZiAoaXRlbS5jaGlsZHJlbikge1xyXG4gICAgICAgIHN1YlJlc3VsdCA9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhpdGVtLmNoaWxkcmVuLCBpZCk7XHJcbiAgICAgICAgaWYgKHN1YlJlc3VsdCkgcmVzdWx0ID0gc3ViUmVzdWx0O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcblxyXG4gIH1cclxuXHJcblxyXG4gIGhhbmRsZURyYWdTdGFydChldmVudCwgbm9kZSkge1xyXG4gICAgLy8gUmVxdWlyZWQgYnkgRmlyZWZveCAoaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTkwNTUyNjQvd2h5LWRvZXNudC1odG1sNS1kcmFnLWFuZC1kcm9wLXdvcmstaW4tZmlyZWZveClcclxuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCdmb28nLCAnYmFyJyk7XHJcbiAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKHRoaXMuZW1wdHlJdGVtLm5hdGl2ZUVsZW1lbnQsIDAsIDApO1xyXG4gICAgdGhpcy5kcmFnTm9kZSA9IG5vZGU7XHJcbiAgICB0aGlzLnRyZWVDb250cm9sLmNvbGxhcHNlKG5vZGUpO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlRHJhZ092ZXIoZXZlbnQsIG5vZGUpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgLy8gSGFuZGxlIG5vZGUgZXhwYW5kXHJcbiAgICBpZiAobm9kZSA9PT0gdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJOb2RlKSB7XHJcbiAgICAgIGlmICh0aGlzLmRyYWdOb2RlICE9PSBub2RlICYmICF0aGlzLnRyZWVDb250cm9sLmlzRXhwYW5kZWQobm9kZSkpIHtcclxuICAgICAgICBpZiAoKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJUaW1lKSA+IHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyV2FpdFRpbWVNcykge1xyXG4gICAgICAgICAgdGhpcy50cmVlQ29udHJvbC5leHBhbmQobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3Zlck5vZGUgPSBub2RlO1xyXG4gICAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBIYW5kbGUgZHJhZyBhcmVhXHJcbiAgICBjb25zdCBwZXJjZW50YWdlWCA9IGV2ZW50Lm9mZnNldFggLyBldmVudC50YXJnZXQuY2xpZW50V2lkdGg7XHJcbiAgICBjb25zdCBwZXJjZW50YWdlWSA9IGV2ZW50Lm9mZnNldFkgLyBldmVudC50YXJnZXQuY2xpZW50SGVpZ2h0O1xyXG4gICAgaWYgKHBlcmNlbnRhZ2VZIDwgMC4yNSkge1xyXG4gICAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlckFyZWEgPSAnYWJvdmUnO1xyXG4gICAgfSBlbHNlIGlmIChwZXJjZW50YWdlWSA+IDAuNzUpIHtcclxuICAgICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJBcmVhID0gJ2JlbG93JztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyQXJlYSA9ICdjZW50ZXInO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlRHJvcChldmVudCwgbm9kZSkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGNvbnN0IGNoYW5nZWREYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGFTb3VyY2UuZGF0YSkpXHJcbiAgICBjb25zdCBzaWJsaW5ncyA9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhjaGFuZ2VkRGF0YSwgbm9kZS5pZCk7XHJcblxyXG4gICAgbGV0IHRvRmxhdE5vZGU9IHNpYmxpbmdzLmZpbmQobm9kZUFjdCA9PiBub2RlQWN0LmlkID09PSBub2RlLmlkKTtcclxuICAgIGxldCBmcm9tRmxhdE5vZGU9IHNpYmxpbmdzLmZpbmQobm9kZUFjdCA9PiBub2RlQWN0LmlkID09PSB0aGlzLmRyYWdOb2RlLmlkKTtcclxuICAgIGlmICh0aGlzLmRyYWdOb2RlLnN0YXR1cyE9XCJwZW5kaW5nRGVsZXRlXCIgJiYgbm9kZSAhPT0gdGhpcy5kcmFnTm9kZSAmJiAodGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJBcmVhICE9PSAnY2VudGVyJyB8fCAodGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJBcmVhID09PSAnY2VudGVyJyAmJiB0b0ZsYXROb2RlLmlzRm9sZGVyKSkpIHtcclxuICAgICAgbGV0IG5ld0l0ZW06IEZpbGVOb2RlO1xyXG5cclxuICAgICAgaWYgKHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyQXJlYSA9PT0gJ2Fib3ZlJykge1xyXG4gICAgICAgIG5ld0l0ZW0gPSB0aGlzLmRhdGFiYXNlLmNvcHlQYXN0ZUl0ZW1BYm92ZShmcm9tRmxhdE5vZGUsdG9GbGF0Tm9kZSxjaGFuZ2VkRGF0YVswXSk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJBcmVhID09PSAnYmVsb3cnKSB7XHJcbiAgICAgICAgbmV3SXRlbSA9IHRoaXMuZGF0YWJhc2UuY29weVBhc3RlSXRlbUJlbG93KGZyb21GbGF0Tm9kZSx0b0ZsYXROb2RlLGNoYW5nZWREYXRhWzBdKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBuZXdJdGVtID0gdGhpcy5kYXRhYmFzZS5jb3B5UGFzdGVJdGVtKGZyb21GbGF0Tm9kZSwgdG9GbGF0Tm9kZSxjaGFuZ2VkRGF0YVswXSk7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHBhcmVudEx2bD10aGlzLnRyZWVDb250cm9sLmRhdGFOb2Rlcy5maW5kKChuKSA9PiBuLmlkID09PSBmcm9tRmxhdE5vZGUuaWQpLmxldmVsO1xyXG4gICAgICBmcm9tRmxhdE5vZGUuY2hpbGRyZW4uZm9yRWFjaChjaGlsZD0+e1xyXG4gICAgICAgIHRoaXMudHJlZUNvbnRyb2wuZGF0YU5vZGVzLmZpbmQoKG4pID0+IG4uaWQgPT09IGNoaWxkLmlkKS5sZXZlbD1wYXJlbnRMdmwrMVxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5kYXRhYmFzZS5kZWxldGVJdGVtKGZyb21GbGF0Tm9kZSxjaGFuZ2VkRGF0YVswXSk7XHJcbiAgICAgIHRoaXMudHJlZUNvbnRyb2wuZXhwYW5kRGVzY2VuZGFudHModGhpcy5uZXN0ZWROb2RlTWFwLmdldChuZXdJdGVtKSk7XHJcbiAgICB9XHJcbiAgIFxyXG4gICAgdGhpcy5kcmFnTm9kZSA9IG51bGw7XHJcbiAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3Zlck5vZGUgPSBudWxsO1xyXG4gICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJUaW1lID0gMDtcclxuICB9XHJcblxyXG4gIGhhbmRsZURyYWdFbmQoZXZlbnQpIHtcclxuICAgIHRoaXMuZHJhZ05vZGUgPSBudWxsO1xyXG4gICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJOb2RlID0gbnVsbDtcclxuICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyVGltZSA9IDA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGUgZm9sbG93aW5nIG1ldGhvZHMgYXJlIGZvciBwZXJzaXN0aW5nIHRoZSB0cmVlIGV4cGFuZCBzdGF0ZVxyXG4gICAqIGFmdGVyIGJlaW5nIHJlYnVpbHRcclxuICAgKi9cclxuXHJcbiAgIHNvcnRCeU9yZGVyKGRhdGE6IGFueVtdKXtcclxuICAgIGRhdGEuc29ydCgoYSxiKSA9PiBhLm9yZGVyLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZSggYi5vcmRlci50b1N0cmluZygpKSk7XHJcbiAgICBkYXRhLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4ubGVuZ3RoPjApIHtcclxuICAgICAgICB0aGlzLnNvcnRCeU9yZGVyKGl0ZW0uY2hpbGRyZW4pO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiAgIH1cclxuXHJcbiAgcmVidWlsZFRyZWVGb3JEYXRhKGRhdGE6IGFueVtdKSB7XHJcbiAgICAvL3RoaXMuZGF0YVNvdXJjZS5kYXRhID0gZGF0YTtcclxuICAgIHRoaXMuc29ydEJ5T3JkZXIoZGF0YSk7XHJcbiAgICB0aGlzLmRhdGFTb3VyY2UuZGF0YSA9IFtdO1xyXG4gICAgdGhpcy5kYXRhU291cmNlLmRhdGEgPSBkYXRhO1xyXG4gICAgdGhpcy50cmVlQ29udHJvbC5leHBhbnNpb25Nb2RlbC5zZWxlY3RlZC5mb3JFYWNoKChub2RlQWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnRyZWVDb250cm9sLmRhdGFOb2Rlcy5maW5kKChuKSA9PiBuLmlkID09PSBub2RlQWN0LmlkKTtcclxuICAgICAgdGhpcy50cmVlQ29udHJvbC5leHBhbmQobm9kZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0UGFyZW50Tm9kZShub2RlOiBGaWxlRmxhdE5vZGUpOiBGaWxlRmxhdE5vZGUgfCBudWxsIHtcclxuICAgIGNvbnN0IGN1cnJlbnRMZXZlbCA9IG5vZGUubGV2ZWw7XHJcbiAgICBpZiAoY3VycmVudExldmVsIDwgMSkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIGNvbnN0IHN0YXJ0SW5kZXggPSB0aGlzLnRyZWVDb250cm9sLmRhdGFOb2Rlcy5pbmRleE9mKG5vZGUpIC0gMTtcclxuICAgIGZvciAobGV0IGkgPSBzdGFydEluZGV4OyBpID49IDA7IGktLSkge1xyXG4gICAgICBjb25zdCBjdXJyZW50Tm9kZSA9IHRoaXMudHJlZUNvbnRyb2wuZGF0YU5vZGVzW2ldO1xyXG4gICAgICBpZiAoY3VycmVudE5vZGUubGV2ZWwgPCBjdXJyZW50TGV2ZWwpIHtcclxuICAgICAgICByZXR1cm4gY3VycmVudE5vZGU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlTm9kZShub2RlVXBkYXRlZClcclxuICB7XHJcbiAgICBjb25zdCBkYXRhVG9DaGFuZ2UgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YVNvdXJjZS5kYXRhKSlcclxuICAgIGNvbnN0IHNpYmxpbmdzID0gdGhpcy5maW5kTm9kZVNpYmxpbmdzKGRhdGFUb0NoYW5nZSwgbm9kZVVwZGF0ZWQuaWQpO1xyXG4gICAgbGV0IGluZGV4PSBzaWJsaW5ncy5maW5kSW5kZXgobm9kZSA9PiBub2RlLmlkID09PSBub2RlVXBkYXRlZC5pZClcclxuICAgIHNpYmxpbmdzW2luZGV4XT1ub2RlVXBkYXRlZDtcclxuICAgIHRoaXMucmVidWlsZFRyZWVGb3JEYXRhKGRhdGFUb0NoYW5nZSk7XHJcblxyXG4gIH1cclxuXHJcbiAgY3JlYXRlTmV3Rm9sZGVyKG5ld0ZvbGRlcilcclxuICB7XHJcbiAgICBuZXdGb2xkZXIudHlwZT1cImZvbGRlclwiO1xyXG4gICAgY29uc3QgZGF0YVRvQ2hhbmdlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGFTb3VyY2UuZGF0YSkpXHJcbiAgICBpZihuZXdGb2xkZXIucGFyZW50ID09PSBudWxsKSB7XHJcbiAgICAgIG5ld0ZvbGRlci5vcmRlcj1kYXRhVG9DaGFuZ2VbMF0uY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICBkYXRhVG9DaGFuZ2VbMF0uY2hpbGRyZW4ucHVzaChuZXdGb2xkZXIpXHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBjb25zdCBzaWJsaW5ncyA9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhkYXRhVG9DaGFuZ2UsIG5ld0ZvbGRlci5wYXJlbnQpO1xyXG4gICAgICBsZXQgaW5kZXg9IHNpYmxpbmdzLmZpbmRJbmRleChub2RlID0+IG5vZGUuaWQgPT09IG5ld0ZvbGRlci5wYXJlbnQpO1xyXG4gICAgICBuZXdGb2xkZXIub3JkZXI9c2libGluZ3NbaW5kZXhdLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgc2libGluZ3NbaW5kZXhdLmNoaWxkcmVuLnB1c2gobmV3Rm9sZGVyKVxyXG4gICAgfVxyXG4gICAgdGhpcy5yZWJ1aWxkVHJlZUZvckRhdGEoZGF0YVRvQ2hhbmdlKTtcclxuXHJcbiAgfVxyXG5cclxuICBjcmVhdGVOZXdOb2RlKG5ld05vZGUpXHJcbiAge1xyXG4gICAgbmV3Tm9kZS50eXBlPVwibm9kZVwiO1xyXG4gICAgY29uc3QgZGF0YVRvQ2hhbmdlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGFTb3VyY2UuZGF0YSkpXHJcbiAgICBpZihuZXdOb2RlLnBhcmVudCA9PT0gbnVsbCkge1xyXG4gICAgICBuZXdOb2RlLm9yZGVyPWRhdGFUb0NoYW5nZVswXS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgIGRhdGFUb0NoYW5nZVswXS5jaGlsZHJlbi5wdXNoKG5ld05vZGUpXHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgY29uc3Qgc2libGluZ3MgPSB0aGlzLmZpbmROb2RlU2libGluZ3MoZGF0YVRvQ2hhbmdlLCBuZXdOb2RlLnBhcmVudCk7XHJcbiAgICBsZXQgaW5kZXg9IHNpYmxpbmdzLmZpbmRJbmRleChub2RlID0+IG5vZGUuaWQgPT09IG5ld05vZGUucGFyZW50KTtcclxuICAgIG5ld05vZGUub3JkZXI9c2libGluZ3NbaW5kZXhdLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgIHNpYmxpbmdzW2luZGV4XS5jaGlsZHJlbi5wdXNoKG5ld05vZGUpXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZWJ1aWxkVHJlZUZvckRhdGEoZGF0YVRvQ2hhbmdlKTtcclxuXHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIG9uQnV0dG9uQ2xpY2tlZChpZCwgYnV0dG9uOiBzdHJpbmcpXHJcbiAge1xyXG4gICAgY29uc3QgY2hhbmdlZERhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YVNvdXJjZS5kYXRhKSlcclxuICAgIGNvbnN0IHNpYmxpbmdzID0gdGhpcy5maW5kTm9kZVNpYmxpbmdzKGNoYW5nZWREYXRhLCBpZCk7XHJcbiAgICBsZXQgbm9kZUNsaWNrZWQ9IHNpYmxpbmdzLmZpbmQobm9kZSA9PiBub2RlLmlkID09PSBpZCk7XHJcbiAgICBpZihidXR0b24gPT09J2VkaXQnKSAge3RoaXMuZW1pdE5vZGUuZW1pdChub2RlQ2xpY2tlZCl9XHJcbiAgICBlbHNlIGlmKGJ1dHRvbiA9PT0gJ25ld0ZvbGRlcicpIHt0aGlzLmNyZWF0ZUZvbGRlci5lbWl0KG5vZGVDbGlja2VkKX1cclxuICAgIGVsc2UgaWYoYnV0dG9uID09PSAnbmV3Tm9kZScpIHt0aGlzLmNyZWF0ZU5vZGUuZW1pdCggbm9kZUNsaWNrZWQpfVxyXG4gICAgZWxzZSBpZihidXR0b24gPT09ICdkZWxldGUnKSB7XHJcbiAgICAgIC8vIGxldCBjaGlsZHJlbj0gdGhpcy5nZXRBbGxDaGlsZHJlbihub2RlQ2xpY2tlZC5jaGlsZHJlbilcclxuICAgICAgLy8gY2hpbGRyZW4uZm9yRWFjaChjaGlsZHJlbiA9PiB7XHJcbiAgICAgIC8vICAgY2hpbGRyZW4uc3RhdHVzPSdwZW5kaW5nRGVsZXRlJztcclxuICAgICAgLy8gfSk7XHJcbiAgICAgIHRoaXMuZGVsZXRlQ2hpbGRyZW4obm9kZUNsaWNrZWQuY2hpbGRyZW4pO1xyXG4gICAgICAvLyBub2RlQ2xpY2tlZC5jaGlsZHJlbj1jaGlsZHJlblxyXG4gICAgICBub2RlQ2xpY2tlZC5zdGF0dXM9J3BlbmRpbmdEZWxldGUnXHJcbiAgICAgIFxyXG4gICAgICB0aGlzLnJlYnVpbGRUcmVlRm9yRGF0YShjaGFuZ2VkRGF0YSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZW1pdEFsbFJvd3MoKVxyXG4gIHtcclxuICAgIGNvbnN0IGRhdGFUb0VtaXQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YVNvdXJjZS5kYXRhKSlcclxuICAgIGxldCBhbGxSb3dzID0gdGhpcy5nZXRBbGxDaGlsZHJlbihkYXRhVG9FbWl0KTsgXHJcbiAgICB0aGlzLmVtaXRBbGxOb2Rlcy5lbWl0KGFsbFJvd3MpO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWxsQ2hpbGRyZW4oYXJyKVxyXG4gIHtcclxuICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgIGxldCBzdWJSZXN1bHQ7XHJcbiAgICBhcnIuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS5jaGlsZHJlbi5sZW5ndGg+MCkge1xyXG4gICAgICAgIHN1YlJlc3VsdCA9IHRoaXMuZ2V0QWxsQ2hpbGRyZW4oaXRlbS5jaGlsZHJlbik7XHJcbiAgICAgICAgaWYgKHN1YlJlc3VsdCkgcmVzdWx0LnB1c2goLi4uc3ViUmVzdWx0KTtcclxuICAgICAgfVxyXG4gICAgICByZXN1bHQucHVzaChpdGVtKTtcclxuXHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBkZWxldGVDaGlsZHJlbihhcnIpXHJcbiAge1xyXG4gICAgYXJyLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4ubGVuZ3RoPjApIHtcclxuICAgICAgICB0aGlzLmRlbGV0ZUNoaWxkcmVuKGl0ZW0uY2hpbGRyZW4pO1xyXG4gICAgICB9XHJcbiAgICAgIGl0ZW0uc3RhdHVzPSdwZW5kaW5nRGVsZXRlJ1xyXG5cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcblxyXG4iXX0=