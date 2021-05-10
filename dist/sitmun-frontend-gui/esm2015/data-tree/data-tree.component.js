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
     * @param {?} data
     * @return {?}
     */
    setOrder(data) {
        for (let i = 0; i < data.length; i++) {
            data[i].order = i;
            if (!data[i].status) {
                data[i].status = "Modified";
            }
        }
        return data;
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
        this.setOrder(parent.children);
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
            this.setOrder(parentNode.children);
        }
        else {
            changedData.children.splice(changedData.children.indexOf(node), 0, newItem);
            this.setOrder(changedData.children);
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
            this.setOrder(parentNode.children);
        }
        else {
            changedData.children.splice(changedData.children.indexOf(node) + 1, 0, newItem);
            this.setOrder(changedData.children);
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
        let toFlatNode;
        if (node.id === undefined) {
            toFlatNode = changedData[0];
        }
        else {
            toFlatNode = this.findNodeSiblings(changedData[0].children, node.id).find(nodeAct => nodeAct.id === node.id);
        }
        /** @type {?} */
        let fromFlatNode;
        if (this.dragNode.id === undefined) {
            fromFlatNode = changedData[0];
        }
        else {
            fromFlatNode = this.findNodeSiblings(changedData[0].children, this.dragNode.id).find(nodeAct => nodeAct.id === this.dragNode.id);
        }
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
        // data.sort((a,b) => a.order.toString().localeCompare( b.order.toString()));
        data.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0));
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
    setOrder(data) {
        for (let i = 0; i < data.length; i++) {
            data[i].order = i;
            if (!data[i].status) {
                data[i].status = "Modified";
            }
        }
        return data;
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
                template: "<button mat-flat-button type=\"button\" (click)=\"treeControl.expandAll()\" title=\"{{ 'expandAll' | translate }}\"  type=\"button\" >\r\n\t<mat-icon fontSet=\"material-icons-round\"> expand_more </mat-icon>\r\n\t{{ \"expandAll\" | translate }}\r\n</button>\r\n<button mat-flat-button type=\"button\" (click)=\"treeControl.collapseAll()\" title=\"{{ 'expandAll' | translate }}\"  type=\"button\" >\r\n\t<mat-icon fontSet=\"material-icons-round\"> expand_less </mat-icon>\r\n\t{{ \"collapseAll\" | translate }}\r\n</button>\r\n<mat-tree [dataSource]=\"dataSource\" [treeControl]=\"treeControl\" >\r\n\t<mat-tree-node *matTreeNodeDef=\"let node\" matTreeNodeToggle matTreeNodePadding  draggable=\"true\"\r\n\t(dragstart)=\"handleDragStart($event, node);\" \t(dragover)=\"handleDragOver($event, node);\"\r\n\t(drop)=\"handleDrop($event, node);\" \t(dragend)=\"handleDragEnd($event);\"                  \r\n\t  [ngClass]=\"{'drop-above': dragNodeExpandOverArea === 'above' && dragNodeExpandOverNode === node,\r\n\t'drop-below': dragNodeExpandOverArea === 'below' && dragNodeExpandOverNode === node,\r\n\t'drop-center': dragNodeExpandOverArea === 'center' && dragNodeExpandOverNode === node,\r\n\t'deletedNode': node.status=='pendingDelete'}\">\r\n\t\t<button mat-icon-button disabled></button>\r\n\t\t<mat-icon *ngIf=\"node.type ==='folder'&& node.status!='pendingDelete'\" class=\"type-icon\" [attr.aria-label]=\"node.type + 'icon'\">\r\n\t\t\tfolder\r\n\t\t</mat-icon>\r\n\t\t<span *ngIf=\"node.status=='pendingDelete'\">({{\"pendingDelete\" | translate}})-</span>\r\n\t\t{{node.name}}\r\n\t\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newFolder')\" mat-icon-button>\r\n\t\t\t<mat-icon>create_new_folder</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newNode')\" mat-icon-button>\r\n\t\t\t<mat-icon>playlist_add</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\" mat-icon-button (click)=\"onButtonClicked(node.id, 'delete')\">\r\n\t\t\t<mat-icon>delete</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\" mat-icon-button (click)=\"onButtonClicked(node.id, 'edit')\">\r\n\t\t\t<mat-icon>edit</mat-icon>\r\n\t\t</button>\r\n\r\n\t</mat-tree-node>\r\n\r\n\t<mat-tree-node *matTreeNodeDef=\"let node;when: hasChild\" matTreeNodePadding  draggable=\"true\"\r\n\t(dragstart)=\"handleDragStart($event, node);\" \t(dragover)=\"handleDragOver($event, node);\"\r\n\t(drop)=\"handleDrop($event, node);\" \t(dragend)=\"handleDragEnd($event);\"                  \r\n\t [ngClass]=\"{'drop-above': dragNodeExpandOverArea === 'above' && dragNodeExpandOverNode === node,\r\n\t'drop-below': dragNodeExpandOverArea === 'below' && dragNodeExpandOverNode === node,\r\n\t'drop-center': dragNodeExpandOverArea === 'center' && dragNodeExpandOverNode === node,\r\n\t'deletedNode': node.status=='pendingDelete'}\">\r\n\t\t<button mat-icon-button matTreeNodeToggle (click)=\"expansionModel.toggle(node.id)\"\r\n\t\t\t[attr.aria-label]=\"'toggle ' + node.name\">\r\n\t\t\t<mat-icon class=\"mat-icon-rtl-mirror\">\r\n\t\t\t\t{{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}\r\n\t\t\t</mat-icon>\r\n\t\t</button>\r\n\t\t<mat-icon class=\"type-icon\" [attr.aria-label]=\"node.type + 'icon'\">\r\n\t\t\tfolder\r\n\t\t</mat-icon>\r\n\t\t<span *ngIf=\"node.status=='pendingDelete'\">({{\"pendingDelete\" | translate}})-</span>\r\n\t\t{{node.name}}\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newFolder')\" mat-icon-button>\r\n\t\t\t<mat-icon>create_new_folder</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newNode')\" mat-icon-button>\r\n\t\t\t<mat-icon>playlist_add</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\" mat-icon-button (click)=\"onButtonClicked(node.id, 'delete')\">\r\n\t\t\t<mat-icon>delete</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\"  mat-icon-button (click)=\"onButtonClicked(node.id, 'edit')\">\r\n\t\t\t<mat-icon>edit</mat-icon>\r\n\t\t</button>\r\n\t\t\r\n\t</mat-tree-node>\r\n</mat-tree>\r\n\r\n<span #emptyItem></span>\r\n",
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS10cmVlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGF0YS10cmVlL2RhdGEtdHJlZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pHLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2pGLE9BQU8sRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLEVBQUUsSUFBSSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFdkUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7OztBQU8xRCxNQUFNLE9BQU8sUUFBUTtDQXNCcEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdELE1BQU0sT0FBTyxZQUFZOzs7Ozs7Ozs7SUFDdkIsWUFDUyxZQUNBLE1BQ0EsT0FDQSxNQUNBLElBQ0E7UUFMQSxlQUFVLEdBQVYsVUFBVTtRQUNWLFNBQUksR0FBSixJQUFJO1FBQ0osVUFBSyxHQUFMLEtBQUs7UUFDTCxTQUFJLEdBQUosSUFBSTtRQUNKLE9BQUUsR0FBRixFQUFFO1FBQ0YsV0FBTSxHQUFOLE1BQU07S0FDVjtDQUNOOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBWUQsTUFBTSxPQUFPLFlBQVk7SUFJdkI7MEJBSGEsSUFBSSxlQUFlLENBQWEsRUFBRSxDQUFDO0tBSy9DOzs7O0lBSkQsSUFBSSxJQUFJLEtBQVUsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFOzs7OztJQU1qRCxVQUFVLENBQUMsT0FBTzs7UUFJaEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7O1FBRzVDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzVCOzs7Ozs7OztJQU1ELGFBQWEsQ0FBQyxjQUFxQixFQUFFLEtBQWE7O1FBQ2hELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUcsY0FBYyxDQUFDLE1BQU0sS0FBRyxDQUFDLEVBQzVCOztZQUNFLElBQUksSUFBSSxHQUFHO2dCQUNULFFBQVEsRUFBQyxJQUFJO2dCQUNiLElBQUksRUFBQyxNQUFNO2dCQUNYLElBQUksRUFBRSxRQUFRO2dCQUNkLE1BQU0sRUFBRSxJQUFJO2dCQUNaLEtBQUssRUFBRSxDQUFDO2dCQUNSLFFBQVEsRUFBRSxFQUFFO2dCQUNaLEVBQUUsRUFBQyxDQUFDO2FBQ0wsQ0FBQTtZQUNELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBQyxJQUFJLENBQUM7U0FDbEI7YUFDRztZQUNGLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTs7Z0JBQ2xDLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQztnQkFDbkIsR0FBRyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7Z0JBQ2xCLEdBQUcsQ0FBQyxJQUFJLEdBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUVqRCxJQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtvQkFBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztpQkFBQztxQkFDakM7O29CQUNGLElBQUksZ0JBQWdCLEdBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUE7b0JBQzFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO29CQUNsQixHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsR0FBQyxnQkFBZ0IsQ0FBQTtpQkFDdEM7O2dCQUNELElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDO2dCQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUNoQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUc7d0JBQ1osUUFBUSxFQUFFLEVBQUU7cUJBQ2IsQ0FBQztpQkFDSDtnQkFDRCxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNoQyxDQUFDLENBQUM7WUFDSCxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxHQUFDLFFBQVEsQ0FBQztZQUMxQixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxHQUFDLE1BQU0sQ0FBQztZQUN4QixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQztZQUNwQixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxHQUFDLElBQUksQ0FBQztZQUMxQixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxHQUFDLElBQUksQ0FBQztTQUN6QjtRQUdELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3BCOzs7Ozs7SUFHRCxVQUFVLENBQUMsSUFBYyxFQUFFLFdBQWU7UUFDeEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ25DOzs7Ozs7SUFFRCxVQUFVLENBQUMsS0FBaUIsRUFBRSxZQUFzQjs7UUFDbEQsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0MsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDZCxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN4QjthQUFNO1lBQ0wsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDbkIsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDN0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO2lCQUM5QzthQUNGLENBQUMsQ0FBQztTQUNKO0tBQ0Y7Ozs7O0lBRUQsUUFBUSxDQUFDLElBQVc7UUFDbEIsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7WUFDL0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBRyxDQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7Z0JBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBQyxVQUFVLENBQUM7YUFBRTtTQUNwRDtRQUNELE9BQU8sSUFBSSxDQUFDO0tBQ1o7Ozs7Ozs7SUFFRixhQUFhLENBQUMsSUFBYyxFQUFFLEVBQVksRUFBRSxXQUFlOztRQUN6RCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUMsV0FBVyxDQUFDLENBQUM7UUFFdEQsT0FBTyxPQUFPLENBQUM7S0FDaEI7Ozs7Ozs7SUFFRCxrQkFBa0IsQ0FBQyxJQUFjLEVBQUUsRUFBWSxFQUFDLFdBQWU7O1FBQzdELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLElBQUksRUFBQyxXQUFXLENBQUMsQ0FBQztRQUUzRCxPQUFPLE9BQU8sQ0FBQztLQUNoQjs7Ozs7OztJQUVELGtCQUFrQixDQUFDLElBQWMsRUFBRSxFQUFZLEVBQUMsV0FBZTs7UUFDN0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTNELE9BQU8sT0FBTyxDQUFDO0tBQ2hCOzs7Ozs7SUFJRCxVQUFVLENBQUMsSUFBYTs7UUFDdEIsTUFBTSxPQUFPLEdBQUc7WUFDZCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ1gsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ25CLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtZQUNqQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWU7WUFDckMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO1lBQzNCLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztZQUM3QixvQkFBb0IsRUFBRSxJQUFJLENBQUMsb0JBQW9CO1lBQy9DLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtZQUMvQixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1lBQ3ZDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDN0IsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFBZTtZQUNyQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtTQUFjLENBQUM7UUFFcEMsT0FBTyxPQUFPLENBQUM7S0FDaEI7Ozs7Ozs7SUFFRCxVQUFVLENBQUMsTUFBZ0IsRUFBRSxJQUFjLEVBQUMsV0FBZTtRQUN6RCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUNwQixNQUFNLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztTQUN0Qjs7UUFDRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3JDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxJQUFFLElBQUksSUFBSSxNQUFNLENBQUMsRUFBRSxJQUFFLFNBQVMsQ0FBQSxDQUFDLENBQUEsSUFBSSxDQUFBLENBQUMsQ0FBQSxNQUFNLENBQUMsRUFBRSxDQUFDO1FBRXJFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQzlCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2xDLE9BQU8sT0FBTyxDQUFDO0tBQ2hCOzs7Ozs7O0lBRUQsZUFBZSxDQUFDLElBQWMsRUFBRSxRQUFrQixFQUFDLFdBQWU7O1FBQ2hFLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUMsV0FBVyxDQUFDLENBQUM7O1FBQzdELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDekMsT0FBTyxDQUFDLE1BQU0sR0FBRyxVQUFVLElBQUUsSUFBSSxJQUFJLFVBQVUsQ0FBQyxFQUFFLElBQUUsU0FBUyxDQUFBLENBQUMsQ0FBQSxJQUFJLENBQUEsQ0FBQyxDQUFBLFVBQVUsQ0FBQyxFQUFFLENBQUM7UUFFakYsSUFBSSxVQUFVLElBQUksSUFBSSxFQUFFO1lBQ3RCLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMxRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUNuQzthQUFNO1lBQ0wsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzVFLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQ3BDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbEMsT0FBTyxPQUFPLENBQUM7S0FDaEI7Ozs7Ozs7SUFFRCxlQUFlLENBQUMsSUFBYyxFQUFFLFFBQWtCLEVBQUMsV0FBZTs7UUFDaEUsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBQyxXQUFXLENBQUMsQ0FBQzs7UUFFN0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN6QyxPQUFPLENBQUMsTUFBTSxHQUFHLFVBQVUsSUFBRSxJQUFJLElBQUksVUFBVSxDQUFDLEVBQUUsSUFBRSxTQUFTLENBQUEsQ0FBQyxDQUFBLElBQUksQ0FBQSxDQUFDLENBQUEsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUVqRixJQUFJLFVBQVUsSUFBSSxJQUFJLEVBQUU7WUFDdEIsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM5RSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUNuQzthQUFNO1lBQ0wsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNoRixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUNwQztRQUNELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2xDLE9BQU8sT0FBTyxDQUFDO0tBQ2hCOzs7Ozs7SUFHRCxrQkFBa0IsQ0FBQyxJQUFjLEVBQUMsV0FBZTtRQUMvQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7O1lBQ3BELE1BQU0sV0FBVyxHQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7O1lBQzdDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2pELElBQUksTUFBTSxJQUFJLElBQUksRUFBRTtnQkFDbEIsT0FBTyxNQUFNLENBQUM7YUFDZjtTQUNGO1FBQ0QsT0FBTyxJQUFJLENBQUM7S0FDYjs7Ozs7O0lBR0QsU0FBUyxDQUFDLFdBQXFCLEVBQUUsSUFBYztRQUM3QyxJQUFJLFdBQVcsQ0FBQyxRQUFRLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTs7Z0JBQ3BELE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtvQkFDbEIsT0FBTyxXQUFXLENBQUM7aUJBQ3BCO3FCQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7O29CQUN0RCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDM0MsSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO3dCQUNsQixPQUFPLE1BQU0sQ0FBQztxQkFDZjtpQkFDRjthQUNGO1NBQ0Y7UUFDRCxPQUFPLElBQUksQ0FBQztLQUNiOzs7WUF2TkYsVUFBVTs7Ozs7Ozs7Ozs7QUFvT1gsTUFBTSxPQUFPLGlCQUFpQjs7OztJQTBDNUIsWUFBbUIsUUFBc0I7UUFBdEIsYUFBUSxHQUFSLFFBQVEsQ0FBYzs7OEJBekJ4QixJQUFJLGNBQWMsQ0FBUyxJQUFJLENBQUM7UUFDakQsZ0JBQVcsS0FBSyxDQUFDO1FBRWpCLG1CQUFjLElBQUksQ0FBQztRQUNuQixvQkFBZSxLQUFLLENBQUM7UUFRckIsb0NBQStCLElBQUksQ0FBQzs7OzsyQkFPcEIsSUFBSSxHQUFHLEVBQTBCOzs7OzZCQUcvQixJQUFJLEdBQUcsRUFBMEI7MkJBNERyQyxDQUFDLElBQWMsRUFBRSxLQUFhLEVBQUUsRUFBRTs7WUFDOUMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7O1lBQ2xELE1BQU0sUUFBUSxHQUFHLFlBQVksSUFBSSxZQUFZLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJO2dCQUM5RCxDQUFDLENBQUMsWUFBWTtnQkFDZCxDQUFDLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxJQUFJLEVBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLEVBQUUsRUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFaEgsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN2QyxPQUFPLFFBQVEsQ0FBQztTQUVqQjt5QkFDbUIsQ0FBQyxJQUFrQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSzs2QkFDOUIsQ0FBQyxJQUFrQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVTs0QkFDeEMsQ0FBQyxJQUFjLEVBQTBCLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQzt3QkFDbkYsQ0FBQyxDQUFTLEVBQUUsU0FBdUIsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQVU7UUF0RXJFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUN4RSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksZUFBZSxDQUFlLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pGLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUVuRjs7OztJQUVELFFBQVE7UUFFTixJQUFHLElBQUksQ0FBQyw0QkFBNEIsRUFDcEM7WUFDRSxJQUFJLENBQUMsNEJBQTRCLENBQUMsU0FBUyxDQUN6QyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNQLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDdkIsQ0FDRixDQUFBO1NBQ0Y7UUFDRCxJQUFHLElBQUksQ0FBQywyQkFBMkIsRUFDbkM7WUFDRSxJQUFJLENBQUMsMkJBQTJCLENBQUMsU0FBUyxDQUN4QyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNQLElBQUcsSUFBSSxDQUFDLFFBQVE7b0JBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7b0JBQ3hDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDL0IsQ0FDRixDQUFBO1NBQ0Y7UUFFRCxJQUFJLElBQUksQ0FBQywyQkFBMkIsRUFBRTtZQUNwQyxJQUFJLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2xGLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUNwQixDQUFDLENBQUM7U0FDSjtRQUVELElBQUksSUFBSSxDQUFDLHdCQUF3QixFQUFFO1lBQ2pDLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDNUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQ3BCLENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ3BCOzs7O0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxNQUFNLEVBQUU7YUFDWixTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzdFLENBQUMsQ0FBQztLQUNKOzs7OztJQXVCRCxZQUFZOztRQUNWLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQzs7Ozs7O1FBRWxCLFNBQVMsbUJBQW1CLENBQUMsSUFBYyxFQUFFLFFBQWtCO1lBQzdELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtnQkFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO2FBQ3BFO1NBQ0Y7UUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNwQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN6RCxDQUFDLENBQUM7UUFDSCxPQUFPLE1BQU0sQ0FBQztLQUNmOzs7Ozs7SUFHQSxnQkFBZ0IsQ0FBQyxHQUFlLEVBQUUsRUFBVTs7UUFDM0MsSUFBSSxNQUFNLENBQVk7O1FBQXRCLElBQVksU0FBUyxDQUFDO1FBQ3RCLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEIsSUFBSSxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDbEIsTUFBTSxHQUFHLEdBQUcsQ0FBQzthQUNkO2lCQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDeEIsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLFNBQVM7b0JBQUUsTUFBTSxHQUFHLFNBQVMsQ0FBQzthQUNuQztTQUNGLENBQUMsQ0FBQztRQUNILE9BQU8sTUFBTSxDQUFDO0tBRWY7Ozs7OztJQUdELGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSTs7UUFFekIsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLEtBQUssQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNqQzs7Ozs7O0lBRUQsY0FBYyxDQUFDLEtBQUssRUFBRSxJQUFJO1FBQ3hCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7UUFHdkIsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLHNCQUFzQixFQUFFO1lBQ3hDLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDaEUsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixFQUFFO29CQUM1RixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDL0I7YUFDRjtTQUNGO2FBQU07WUFDTCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO1lBQ25DLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3BEOztRQUdELE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7O1FBQzdELE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDOUQsSUFBSSxXQUFXLEdBQUcsSUFBSSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxPQUFPLENBQUM7U0FDdkM7YUFBTSxJQUFJLFdBQVcsR0FBRyxJQUFJLEVBQUU7WUFDN0IsSUFBSSxDQUFDLHNCQUFzQixHQUFHLE9BQU8sQ0FBQztTQUN2QzthQUFNO1lBQ0wsSUFBSSxDQUFDLHNCQUFzQixHQUFHLFFBQVEsQ0FBQztTQUN4QztLQUNGOzs7Ozs7SUFFRCxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUk7UUFDcEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDOztRQUN2QixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBOztRQUdwRSxJQUFJLFVBQVUsQ0FBQztRQUNmLElBQUcsSUFBSSxDQUFDLEVBQUUsS0FBSyxTQUFTLEVBQUU7WUFBRSxVQUFVLEdBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQUU7YUFDbkQ7WUFDRixVQUFVLEdBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzdHOztRQUNELElBQUksWUFBWSxDQUFDO1FBQ2pCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssU0FBUyxFQUFFO1lBQUUsWUFBWSxHQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUFFO2FBQy9EO1lBQ0YsWUFBWSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2xJO1FBQ0QsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBRSxlQUFlLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEtBQUssUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixLQUFLLFFBQVEsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTs7WUFDdEwsSUFBSSxPQUFPLENBQVc7WUFFdEIsSUFBSSxJQUFJLENBQUMsc0JBQXNCLEtBQUssT0FBTyxFQUFFO2dCQUMzQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUMsVUFBVSxFQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3BGO2lCQUFNLElBQUksSUFBSSxDQUFDLHNCQUFzQixLQUFLLE9BQU8sRUFBRTtnQkFDbEQsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFDLFVBQVUsRUFBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwRjtpQkFBTTtnQkFDTCxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLFVBQVUsRUFBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNoRjs7WUFDRCxJQUFJLFNBQVMsR0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUNyRixZQUFZLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUEsRUFBRTtnQkFDbkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUMsU0FBUyxHQUFDLENBQUMsQ0FBQTthQUM1RSxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ3JFO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQztRQUNuQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsQ0FBQyxDQUFDO0tBQ2pDOzs7OztJQUVELGFBQWEsQ0FBQyxLQUFLO1FBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUM7UUFDbkMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLENBQUMsQ0FBQztLQUNqQzs7Ozs7OztJQU9BLFdBQVcsQ0FBQyxJQUFXOztRQUV0QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNwQixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFDLENBQUMsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDakM7U0FFRixDQUFDLENBQUM7S0FDSDs7Ozs7SUFFRCxRQUFRLENBQUMsSUFBVztRQUNuQixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztZQUMvQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQztZQUNoQixJQUFHLENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtnQkFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFDLFVBQVUsQ0FBQzthQUFFO1NBQ3BEO1FBQ0QsT0FBTyxJQUFJLENBQUM7S0FDWjs7Ozs7SUFFRixrQkFBa0IsQ0FBQyxJQUFXOztRQUU1QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDNUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFOztZQUMzRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3pFLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQy9CLENBQUMsQ0FBQztLQUNKOzs7OztJQUVPLGFBQWEsQ0FBQyxJQUFrQjs7UUFDdEMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNoQyxJQUFJLFlBQVksR0FBRyxDQUFDLEVBQUU7WUFDcEIsT0FBTyxJQUFJLENBQUM7U0FDYjs7UUFDRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hFLEtBQUssSUFBSSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O1lBQ3BDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELElBQUksV0FBVyxDQUFDLEtBQUssR0FBRyxZQUFZLEVBQUU7Z0JBQ3BDLE9BQU8sV0FBVyxDQUFDO2FBQ3BCO1NBQ0Y7UUFDRCxPQUFPLElBQUksQ0FBQzs7Ozs7O0lBR2QsVUFBVSxDQUFDLFdBQVc7O1FBRXBCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7O1FBQ3JFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDOztRQUNyRSxJQUFJLEtBQUssR0FBRSxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDakUsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFDLFdBQVcsQ0FBQztRQUM1QixJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7S0FFdkM7Ozs7O0lBRUQsZUFBZSxDQUFDLFNBQVM7UUFFdkIsU0FBUyxDQUFDLElBQUksR0FBQyxRQUFRLENBQUM7O1FBQ3hCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7UUFDckUsSUFBRyxTQUFTLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRTtZQUM1QixTQUFTLENBQUMsS0FBSyxHQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ2hELFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQ3pDO2FBQ0c7O1lBQ0YsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7O1lBQ3ZFLElBQUksS0FBSyxHQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwRSxTQUFTLENBQUMsS0FBSyxHQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ2hELFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQ3pDO1FBQ0QsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO0tBRXZDOzs7OztJQUVELGFBQWEsQ0FBQyxPQUFPO1FBRW5CLE9BQU8sQ0FBQyxJQUFJLEdBQUMsTUFBTSxDQUFDOztRQUNwQixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBQ3JFLElBQUcsT0FBTyxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7WUFDMUIsT0FBTyxDQUFDLEtBQUssR0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUM5QyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtTQUN2QzthQUNHOztZQUNKLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztZQUNyRSxJQUFJLEtBQUssR0FBRSxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbEUsT0FBTyxDQUFDLEtBQUssR0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUM5QyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtTQUNyQztRQUVELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUV2Qzs7Ozs7O0lBSUQsZUFBZSxDQUFDLEVBQUUsRUFBRSxNQUFjOztRQUVoQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBOztRQUNwRSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDOztRQUN4RCxJQUFJLFdBQVcsR0FBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUN2RCxJQUFHLE1BQU0sS0FBSSxNQUFNLEVBQUc7WUFBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtTQUFDO2FBQ2xELElBQUcsTUFBTSxLQUFLLFdBQVcsRUFBRTtZQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1NBQUM7YUFDaEUsSUFBRyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsV0FBVyxDQUFDLENBQUE7U0FBQzthQUM3RCxJQUFHLE1BQU0sS0FBSyxRQUFRLEVBQUU7Ozs7O1lBSzNCLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztZQUUxQyxXQUFXLENBQUMsTUFBTSxHQUFDLGVBQWUsQ0FBQTtZQUVsQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDdEM7S0FFRjs7OztJQUVELFdBQVc7O1FBRVQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTs7UUFDbkUsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNqQzs7Ozs7SUFFRCxjQUFjLENBQUMsR0FBRzs7UUFFaEIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDOztRQUNoQixJQUFJLFNBQVMsQ0FBQztRQUNkLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBQyxDQUFDLEVBQUU7Z0JBQzFCLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxTQUFTO29CQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQzthQUMxQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FFbkIsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLENBQUM7S0FDZjs7Ozs7SUFFRCxjQUFjLENBQUMsR0FBRztRQUVoQixHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3RCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxFQUFFO2dCQUMxQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUNwQztZQUNELElBQUksQ0FBQyxNQUFNLEdBQUMsZUFBZSxDQUFBO1NBRTVCLENBQUMsQ0FBQztLQUNKOzs7WUFuWUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxlQUFlO2dCQUN6QiwwNUlBQXVDO2dCQUV2QyxTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUM7O2FBQzFCOzs7O1lBMkM4QixZQUFZOzs7eUJBekN4QyxNQUFNOzJCQUNOLE1BQU07dUJBQ04sTUFBTTsyQkFDTixNQUFNOzJDQUNOLEtBQUs7MENBQ0wsS0FBSzswQ0FDTCxLQUFLO3VDQUNMLEtBQUs7cUJBZ0JMLEtBQUs7d0JBU0wsU0FBUyxTQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGbGF0VHJlZUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9jZGsvdHJlZSc7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3RhYmxlLCBJbnB1dCwgT3V0cHV0LEVsZW1lbnRSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBNYXRUcmVlRmxhdERhdGFTb3VyY2UsIE1hdFRyZWVGbGF0dGVuZXIgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90cmVlJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBvZiBhcyBvYnNlcnZhYmxlT2YgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQ2RrRHJhZ0Ryb3AgfSBmcm9tICdAYW5ndWxhci9jZGsvZHJhZy1kcm9wJztcclxuaW1wb3J0IHsgU2VsZWN0aW9uTW9kZWwgfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xyXG5pbXBvcnQgeyBmb3JFYWNoIH0gZnJvbSAnanN6aXAnO1xyXG5cclxuLyoqXHJcbiAqIEZpbGUgbm9kZSBkYXRhIHdpdGggbmVzdGVkIHN0cnVjdHVyZS5cclxuICogRWFjaCBub2RlIGhhcyBhIG5hbWUsIGFuZCBhIHR5cGUgb3IgYSBsaXN0IG9mIGNoaWxkcmVuLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEZpbGVOb2RlIHtcclxuICBpZDogc3RyaW5nO1xyXG4gIGNoaWxkcmVuOiBGaWxlTm9kZVtdO1xyXG4gIG5hbWU6IHN0cmluZztcclxuICB0eXBlOiBhbnk7XHJcbiAgYWN0aXZlOiBhbnlcclxuICBjYXJ0b2dyYXBoeUlkOiBhbnlcclxuICBjYXJ0b2dyYXBoeU5hbWU6IGFueVxyXG4gIGRhdGFzZXRVUkw6IGFueVxyXG4gIGRlc2NyaXB0aW9uOiBhbnlcclxuICBmaWx0ZXJHZXRGZWF0dXJlSW5mbzogYW55XHJcbiAgZmlsdGVyR2V0TWFwOiBhbnlcclxuICBmaWx0ZXJTZWxlY3RhYmxlOiBhbnlcclxuICBpc0ZvbGRlcjogYW55XHJcbiAgbWV0YWRhdGFVUkw6IGFueVxyXG4gIG9yZGVyOiBhbnlcclxuICBwYXJlbnQ6IGFueVxyXG4gIHF1ZXJ5YWJsZUFjdGl2ZTogYW55XHJcbiAgcmFkaW86IGFueVxyXG4gIHRvb2x0aXA6IGFueVxyXG4gIF9saW5rczogYW55XHJcbiAgc3RhdHVzOiBhbnlcclxufVxyXG5cclxuLyoqIEZsYXQgbm9kZSB3aXRoIGV4cGFuZGFibGUgYW5kIGxldmVsIGluZm9ybWF0aW9uICovXHJcbmV4cG9ydCBjbGFzcyBGaWxlRmxhdE5vZGUge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHVibGljIGV4cGFuZGFibGU6IGJvb2xlYW4sXHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nLFxyXG4gICAgcHVibGljIGxldmVsOiBudW1iZXIsXHJcbiAgICBwdWJsaWMgdHlwZTogYW55LFxyXG4gICAgcHVibGljIGlkOiBzdHJpbmcsXHJcbiAgICBwdWJsaWMgc3RhdHVzOiBzdHJpbmdcclxuICApIHsgfVxyXG59XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBGaWxlIGRhdGFiYXNlLCBpdCBjYW4gYnVpbGQgYSB0cmVlIHN0cnVjdHVyZWQgSnNvbiBvYmplY3QgZnJvbSBzdHJpbmcuXHJcbiAqIEVhY2ggbm9kZSBpbiBKc29uIG9iamVjdCByZXByZXNlbnRzIGEgZmlsZSBvciBhIGRpcmVjdG9yeS4gRm9yIGEgZmlsZSwgaXQgaGFzIG5hbWUgYW5kIHR5cGUuXHJcbiAqIEZvciBhIGRpcmVjdG9yeSwgaXQgaGFzIG5hbWUgYW5kIGNoaWxkcmVuIChhIGxpc3Qgb2YgZmlsZXMgb3IgZGlyZWN0b3JpZXMpLlxyXG4gKiBUaGUgaW5wdXQgd2lsbCBiZSBhIGpzb24gb2JqZWN0IHN0cmluZywgYW5kIHRoZSBvdXRwdXQgaXMgYSBsaXN0IG9mIGBGaWxlTm9kZWAgd2l0aCBuZXN0ZWRcclxuICogc3RydWN0dXJlLlxyXG4gKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgRmlsZURhdGFiYXNlIHtcclxuICBkYXRhQ2hhbmdlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxGaWxlTm9kZVtdPihbXSk7XHJcbiAgZ2V0IGRhdGEoKTogYW55IHsgcmV0dXJuIHRoaXMuZGF0YUNoYW5nZS52YWx1ZTsgfVxyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgfVxyXG5cclxuICBpbml0aWFsaXplKGRhdGFPYmopIHtcclxuXHJcbiAgICAvLyBCdWlsZCB0aGUgdHJlZSBub2RlcyBmcm9tIEpzb24gb2JqZWN0LiBUaGUgcmVzdWx0IGlzIGEgbGlzdCBvZiBgRmlsZU5vZGVgIHdpdGggbmVzdGVkXHJcbiAgICAvLyAgICAgZmlsZSBub2RlIGFzIGNoaWxkcmVuLlxyXG4gICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRGaWxlVHJlZShkYXRhT2JqLCAwKTtcclxuXHJcbiAgICAvLyBOb3RpZnkgdGhlIGNoYW5nZS5cclxuICAgIHRoaXMuZGF0YUNoYW5nZS5uZXh0KGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQnVpbGQgdGhlIGZpbGUgc3RydWN0dXJlIHRyZWUuIFRoZSBgdmFsdWVgIGlzIHRoZSBKc29uIG9iamVjdCwgb3IgYSBzdWItdHJlZSBvZiBhIEpzb24gb2JqZWN0LlxyXG4gICAqIFRoZSByZXR1cm4gdmFsdWUgaXMgdGhlIGxpc3Qgb2YgYEZpbGVOb2RlYC5cclxuICAgKi9cclxuICBidWlsZEZpbGVUcmVlKGFycmF5VHJlZU5vZGVzOiBhbnlbXSwgbGV2ZWw6IG51bWJlcik6IGFueSB7XHJcbiAgICB2YXIgbWFwID0ge307XHJcbiAgICBpZihhcnJheVRyZWVOb2Rlcy5sZW5ndGg9PT0wKVxyXG4gICAge1xyXG4gICAgICBsZXQgcm9vdCA9IHtcclxuICAgICAgICBpc0ZvbGRlcjp0cnVlLFxyXG4gICAgICAgIG5hbWU6J1Jvb3QnLFxyXG4gICAgICAgIHR5cGU6ICdmb2xkZXInLFxyXG4gICAgICAgIGlzUm9vdDogdHJ1ZSxcclxuICAgICAgICBvcmRlcjogMCxcclxuICAgICAgICBjaGlsZHJlbjogW10sXHJcbiAgICAgICAgaWQ6MFxyXG4gICAgICB9XHJcbiAgICAgIG1hcFsncm9vdCddPXJvb3Q7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBhcnJheVRyZWVOb2Rlcy5mb3JFYWNoKCh0cmVlTm9kZSkgPT4ge1xyXG4gICAgICAgIHZhciBvYmogPSB0cmVlTm9kZTtcclxuICAgICAgICBvYmouY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICBvYmoudHlwZT0gKHRyZWVOb2RlLmlzRm9sZGVyKT8gXCJmb2xkZXJcIiA6IFwibm9kZVwiO1xyXG4gIFxyXG4gICAgICAgIGlmKCFtYXBbb2JqLmlkXSkge21hcFtvYmouaWRdID0gb2JqO31cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgbGV0IHByZXZpb3VzQ2hpbGRyZW49IG1hcFtvYmouaWRdLmNoaWxkcmVuXHJcbiAgICAgICAgICBtYXBbb2JqLmlkXSA9IG9iajtcclxuICAgICAgICAgIG1hcFtvYmouaWRdLmNoaWxkcmVuPXByZXZpb3VzQ2hpbGRyZW5cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHBhcmVudCA9IG9iai5wYXJlbnQgfHwgJ3Jvb3QnO1xyXG4gICAgICAgIGlmICghbWFwW3BhcmVudF0pIHtcclxuICAgICAgICAgIG1hcFtwYXJlbnRdID0ge1xyXG4gICAgICAgICAgICBjaGlsZHJlbjogW11cclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1hcFtwYXJlbnRdLmNoaWxkcmVuLnB1c2gob2JqKTtcclxuICAgICAgfSk7XHJcbiAgICAgIG1hcFsncm9vdCddLnR5cGU9J2ZvbGRlcic7XHJcbiAgICAgIG1hcFsncm9vdCddLm5hbWU9J1Jvb3QnO1xyXG4gICAgICBtYXBbJ3Jvb3QnXS5vcmRlcj0wO1xyXG4gICAgICBtYXBbJ3Jvb3QnXS5pc0ZvbGRlcj10cnVlO1xyXG4gICAgICBtYXBbJ3Jvb3QnXS5pc1Jvb3Q9dHJ1ZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmV0dXJuIG1hcFsncm9vdCddO1xyXG4gIH1cclxuICBcclxuXHJcbiAgZGVsZXRlSXRlbShub2RlOiBGaWxlTm9kZSwgY2hhbmdlZERhdGE6YW55KSB7XHJcbiAgICB0aGlzLmRlbGV0ZU5vZGUoY2hhbmdlZERhdGEuY2hpbGRyZW4sIG5vZGUpO1xyXG4gICAgdGhpcy5kYXRhQ2hhbmdlLm5leHQoY2hhbmdlZERhdGEpO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlTm9kZShub2RlczogRmlsZU5vZGVbXSwgbm9kZVRvRGVsZXRlOiBGaWxlTm9kZSkge1xyXG4gICAgY29uc3QgaW5kZXggPSBub2Rlcy5pbmRleE9mKG5vZGVUb0RlbGV0ZSwgMCk7XHJcbiAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICBub2Rlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICBpZiAobm9kZS5jaGlsZHJlbiAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuZGVsZXRlTm9kZShub2RlLmNoaWxkcmVuLCBub2RlVG9EZWxldGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRPcmRlcihkYXRhOiBhbnlbXSl7XHJcbiAgICBmb3IobGV0IGk9MDsgaTwgZGF0YS5sZW5ndGg7IGkrKyl7XHJcbiAgICAgIGRhdGFbaV0ub3JkZXI9aTtcclxuICAgICAgaWYoISBkYXRhW2ldLnN0YXR1cykgeyBkYXRhW2ldLnN0YXR1cz1cIk1vZGlmaWVkXCI7IH0gXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGF0YTtcclxuICAgfVxyXG5cclxuICBjb3B5UGFzdGVJdGVtKGZyb206IEZpbGVOb2RlLCB0bzogRmlsZU5vZGUsIGNoYW5nZWREYXRhOmFueSk6IEZpbGVOb2RlIHtcclxuICAgIGNvbnN0IG5ld0l0ZW0gPSB0aGlzLmluc2VydEl0ZW0odG8sIGZyb20sY2hhbmdlZERhdGEpO1xyXG5cclxuICAgIHJldHVybiBuZXdJdGVtO1xyXG4gIH1cclxuXHJcbiAgY29weVBhc3RlSXRlbUFib3ZlKGZyb206IEZpbGVOb2RlLCB0bzogRmlsZU5vZGUsY2hhbmdlZERhdGE6YW55KTogRmlsZU5vZGUge1xyXG4gICAgY29uc3QgbmV3SXRlbSA9IHRoaXMuaW5zZXJ0SXRlbUFib3ZlKHRvLCBmcm9tLGNoYW5nZWREYXRhKTtcclxuXHJcbiAgICByZXR1cm4gbmV3SXRlbTtcclxuICB9XHJcblxyXG4gIGNvcHlQYXN0ZUl0ZW1CZWxvdyhmcm9tOiBGaWxlTm9kZSwgdG86IEZpbGVOb2RlLGNoYW5nZWREYXRhOmFueSk6IEZpbGVOb2RlIHtcclxuICAgIGNvbnN0IG5ld0l0ZW0gPSB0aGlzLmluc2VydEl0ZW1CZWxvdyh0bywgZnJvbSxjaGFuZ2VkRGF0YSk7XHJcblxyXG4gICAgcmV0dXJuIG5ld0l0ZW07XHJcbiAgfVxyXG5cclxuICAvKiogQWRkIGFuIGl0ZW0gdG8gdG8tZG8gbGlzdCAqL1xyXG4gIFxyXG4gIGdldE5ld0l0ZW0obm9kZTpGaWxlTm9kZSl7XHJcbiAgICBjb25zdCBuZXdJdGVtID0ge1xyXG4gICAgICBuYW1lOiBub2RlLm5hbWUsXHJcbiAgICAgIGNoaWxkcmVuOiBub2RlLmNoaWxkcmVuLFxyXG4gICAgICB0eXBlOiBub2RlLnR5cGUsXHJcbiAgICAgIGlkOiBub2RlLmlkLCBcclxuICAgICAgYWN0aXZlOiBub2RlLmFjdGl2ZSxcclxuICAgICAgY2FydG9ncmFwaHlJZDogbm9kZS5jYXJ0b2dyYXBoeUlkLFxyXG4gICAgICBjYXJ0b2dyYXBoeU5hbWU6IG5vZGUuY2FydG9ncmFwaHlOYW1lLFxyXG4gICAgICBkYXRhc2V0VVJMOiBub2RlLmRhdGFzZXRVUkwsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiBub2RlLmRlc2NyaXB0aW9uLFxyXG4gICAgICBmaWx0ZXJHZXRGZWF0dXJlSW5mbzogbm9kZS5maWx0ZXJHZXRGZWF0dXJlSW5mbyxcclxuICAgICAgZmlsdGVyR2V0TWFwOiBub2RlLmZpbHRlckdldE1hcCxcclxuICAgICAgZmlsdGVyU2VsZWN0YWJsZTogbm9kZS5maWx0ZXJTZWxlY3RhYmxlLFxyXG4gICAgICBpc0ZvbGRlcjogbm9kZS5pc0ZvbGRlcixcclxuICAgICAgbWV0YWRhdGFVUkw6IG5vZGUubWV0YWRhdGFVUkwsXHJcbiAgICAgIG9yZGVyOiBub2RlLm9yZGVyLFxyXG4gICAgICBxdWVyeWFibGVBY3RpdmU6IG5vZGUucXVlcnlhYmxlQWN0aXZlLFxyXG4gICAgICByYWRpbzogbm9kZS5yYWRpbyxcclxuICAgICAgdG9vbHRpcDogbm9kZS50b29sdGlwLFxyXG4gICAgICBfbGlua3M6IG5vZGUuX2xpbmtzIH0gYXMgRmlsZU5vZGU7XHJcblxyXG4gICAgcmV0dXJuIG5ld0l0ZW07XHJcbiAgfVxyXG5cclxuICBpbnNlcnRJdGVtKHBhcmVudDogRmlsZU5vZGUsIG5vZGU6IEZpbGVOb2RlLGNoYW5nZWREYXRhOmFueSk6IEZpbGVOb2RlIHtcclxuICAgIGlmICghcGFyZW50LmNoaWxkcmVuKSB7XHJcbiAgICAgIHBhcmVudC5jaGlsZHJlbiA9IFtdO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbmV3SXRlbSA9IHRoaXMuZ2V0TmV3SXRlbShub2RlKVxyXG4gICAgbmV3SXRlbS5wYXJlbnQgPSBwYXJlbnQ9PW51bGwgfHwgcGFyZW50LmlkPT11bmRlZmluZWQ/bnVsbDpwYXJlbnQuaWQ7XHJcblxyXG4gICAgcGFyZW50LmNoaWxkcmVuLnB1c2gobmV3SXRlbSk7XHJcbiAgICB0aGlzLnNldE9yZGVyKHBhcmVudC5jaGlsZHJlbilcclxuICAgIHRoaXMuZGF0YUNoYW5nZS5uZXh0KGNoYW5nZWREYXRhKTtcclxuICAgIHJldHVybiBuZXdJdGVtO1xyXG4gIH1cclxuXHJcbiAgaW5zZXJ0SXRlbUFib3ZlKG5vZGU6IEZpbGVOb2RlLCBub2RlRHJhZzogRmlsZU5vZGUsY2hhbmdlZERhdGE6YW55KTogRmlsZU5vZGUge1xyXG4gICAgY29uc3QgcGFyZW50Tm9kZSA9IHRoaXMuZ2V0UGFyZW50RnJvbU5vZGVzKG5vZGUsY2hhbmdlZERhdGEpO1xyXG4gICAgY29uc3QgbmV3SXRlbSA9IHRoaXMuZ2V0TmV3SXRlbShub2RlRHJhZylcclxuICAgIG5ld0l0ZW0ucGFyZW50ID0gcGFyZW50Tm9kZT09bnVsbCB8fCBwYXJlbnROb2RlLmlkPT11bmRlZmluZWQ/bnVsbDpwYXJlbnROb2RlLmlkO1xyXG4gIFxyXG4gICAgaWYgKHBhcmVudE5vZGUgIT0gbnVsbCkge1xyXG4gICAgICBwYXJlbnROb2RlLmNoaWxkcmVuLnNwbGljZShwYXJlbnROb2RlLmNoaWxkcmVuLmluZGV4T2Yobm9kZSksIDAsIG5ld0l0ZW0pO1xyXG4gICAgICB0aGlzLnNldE9yZGVyKHBhcmVudE5vZGUuY2hpbGRyZW4pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjaGFuZ2VkRGF0YS5jaGlsZHJlbi5zcGxpY2UoY2hhbmdlZERhdGEuY2hpbGRyZW4uaW5kZXhPZihub2RlKSwgMCwgbmV3SXRlbSk7XHJcbiAgICAgIHRoaXMuc2V0T3JkZXIoY2hhbmdlZERhdGEuY2hpbGRyZW4pXHJcbiAgICB9XHJcbiAgICB0aGlzLmRhdGFDaGFuZ2UubmV4dChjaGFuZ2VkRGF0YSk7XHJcbiAgICByZXR1cm4gbmV3SXRlbTtcclxuICB9XHJcblxyXG4gIGluc2VydEl0ZW1CZWxvdyhub2RlOiBGaWxlTm9kZSwgbm9kZURyYWc6IEZpbGVOb2RlLGNoYW5nZWREYXRhOmFueSk6IEZpbGVOb2RlIHtcclxuICAgIGNvbnN0IHBhcmVudE5vZGUgPSB0aGlzLmdldFBhcmVudEZyb21Ob2Rlcyhub2RlLGNoYW5nZWREYXRhKTtcclxuICAgXHJcbiAgICBjb25zdCBuZXdJdGVtID0gdGhpcy5nZXROZXdJdGVtKG5vZGVEcmFnKVxyXG4gICAgbmV3SXRlbS5wYXJlbnQgPSBwYXJlbnROb2RlPT1udWxsIHx8IHBhcmVudE5vZGUuaWQ9PXVuZGVmaW5lZD9udWxsOnBhcmVudE5vZGUuaWQ7XHJcblxyXG4gICAgaWYgKHBhcmVudE5vZGUgIT0gbnVsbCkge1xyXG4gICAgICBwYXJlbnROb2RlLmNoaWxkcmVuLnNwbGljZShwYXJlbnROb2RlLmNoaWxkcmVuLmluZGV4T2Yobm9kZSkgKyAxLCAwLCBuZXdJdGVtKTtcclxuICAgICAgdGhpcy5zZXRPcmRlcihwYXJlbnROb2RlLmNoaWxkcmVuKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2hhbmdlZERhdGEuY2hpbGRyZW4uc3BsaWNlKGNoYW5nZWREYXRhLmNoaWxkcmVuLmluZGV4T2Yobm9kZSkgKyAxLCAwLCBuZXdJdGVtKTtcclxuICAgICAgdGhpcy5zZXRPcmRlcihjaGFuZ2VkRGF0YS5jaGlsZHJlbilcclxuICAgIH1cclxuICAgIHRoaXMuZGF0YUNoYW5nZS5uZXh0KGNoYW5nZWREYXRhKTtcclxuICAgIHJldHVybiBuZXdJdGVtO1xyXG4gIH1cclxuXHJcbiAgXHJcbiAgZ2V0UGFyZW50RnJvbU5vZGVzKG5vZGU6IEZpbGVOb2RlLGNoYW5nZWREYXRhOmFueSk6IEZpbGVOb2RlIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhbmdlZERhdGEuY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgY29uc3QgY3VycmVudFJvb3QgPSAgY2hhbmdlZERhdGEuY2hpbGRyZW5baV07XHJcbiAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50KGN1cnJlbnRSb290LCBub2RlKTtcclxuICAgICAgaWYgKHBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcmVudDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBcclxuICBnZXRQYXJlbnQoY3VycmVudFJvb3Q6IEZpbGVOb2RlLCBub2RlOiBGaWxlTm9kZSk6IEZpbGVOb2RlIHtcclxuICAgIGlmIChjdXJyZW50Um9vdC5jaGlsZHJlbiAmJiBjdXJyZW50Um9vdC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudFJvb3QuY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBjb25zdCBjaGlsZCA9IGN1cnJlbnRSb290LmNoaWxkcmVuW2ldO1xyXG4gICAgICAgIGlmIChjaGlsZCA9PT0gbm9kZSkge1xyXG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnRSb290O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY2hpbGQuY2hpbGRyZW4gJiYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnQoY2hpbGQsIG5vZGUpO1xyXG4gICAgICAgICAgaWYgKHBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG59XHJcblxyXG4vKipcclxuICogQHRpdGxlIFRyZWUgd2l0aCBmbGF0IG5vZGVzXHJcbiAqL1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1kYXRhLXRyZWUnLFxyXG4gIHRlbXBsYXRlVXJsOiAnZGF0YS10cmVlLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnZGF0YS10cmVlLmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgcHJvdmlkZXJzOiBbRmlsZURhdGFiYXNlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGF0YVRyZWVDb21wb25lbnQge1xyXG4gIEBPdXRwdXQoKSBjcmVhdGVOb2RlOiBFdmVudEVtaXR0ZXI8YW55PjtcclxuICBAT3V0cHV0KCkgY3JlYXRlRm9sZGVyOiBFdmVudEVtaXR0ZXI8YW55PjtcclxuICBAT3V0cHV0KCkgZW1pdE5vZGU6IEV2ZW50RW1pdHRlcjxhbnk+O1xyXG4gIEBPdXRwdXQoKSBlbWl0QWxsTm9kZXM6IEV2ZW50RW1pdHRlcjxhbnk+O1xyXG4gIEBJbnB1dCgpIGV2ZW50Tm9kZVVwZGF0ZWRTdWJzY3JpcHRpb246IE9ic2VydmFibGUgPGFueT4gO1xyXG4gIEBJbnB1dCgpIGV2ZW50Q3JlYXRlTm9kZVN1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZSA8YW55PiA7XHJcbiAgQElucHV0KCkgZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlIDxhbnk+IDtcclxuICBASW5wdXQoKSBldmVudFJlZnJlc2hTdWJzY3JpcHRpb246IE9ic2VydmFibGUgPGFueT4gO1xyXG4gIHByaXZhdGUgX2V2ZW50Tm9kZVVwZGF0ZWRTdWJzY3JpcHRpb246IGFueTtcclxuICBwcml2YXRlIF9ldmVudENyZWF0ZU5vZGVTdWJzY3JpcHRpb246IGFueTtcclxuICBwcml2YXRlIF9ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb246IGFueTtcclxuICBwcml2YXRlIF9ldmVudFJlZnJlc2hTdWJzY3JpcHRpb246IGFueTtcclxuICB0cmVlQ29udHJvbDogRmxhdFRyZWVDb250cm9sPEZpbGVGbGF0Tm9kZT47XHJcbiAgdHJlZUZsYXR0ZW5lcjogTWF0VHJlZUZsYXR0ZW5lcjxGaWxlTm9kZSwgRmlsZUZsYXROb2RlPjtcclxuICBkYXRhU291cmNlOiBNYXRUcmVlRmxhdERhdGFTb3VyY2U8RmlsZU5vZGUsIEZpbGVGbGF0Tm9kZT47XHJcbiAgLy8gZXhwYW5zaW9uIG1vZGVsIHRyYWNrcyBleHBhbnNpb24gc3RhdGVcclxuICBleHBhbnNpb25Nb2RlbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxzdHJpbmc+KHRydWUpO1xyXG4gIGRyYWdnaW5nID0gZmFsc2U7XHJcbiAgZXhwYW5kVGltZW91dDogYW55O1xyXG4gIGV4cGFuZERlbGF5ID0gMTAwMDtcclxuICB2YWxpZGF0ZURyb3AgPSBmYWxzZTtcclxuICB0cmVlRGF0YTogYW55O1xyXG5cclxuICBASW5wdXQoKSBnZXRBbGw6ICgpID0+IE9ic2VydmFibGU8YW55PjtcclxuXHJcblxyXG4gIC8qIERyYWcgYW5kIGRyb3AgKi9cclxuICBkcmFnTm9kZTogYW55O1xyXG4gIGRyYWdOb2RlRXhwYW5kT3ZlcldhaXRUaW1lTXMgPSAxNTAwO1xyXG4gIGRyYWdOb2RlRXhwYW5kT3Zlck5vZGU6IGFueTtcclxuICBkcmFnTm9kZUV4cGFuZE92ZXJUaW1lOiBudW1iZXI7XHJcbiAgZHJhZ05vZGVFeHBhbmRPdmVyQXJlYTogc3RyaW5nO1xyXG4gIEBWaWV3Q2hpbGQoJ2VtcHR5SXRlbScpIGVtcHR5SXRlbTogRWxlbWVudFJlZjtcclxuXHJcbiAgICAvKiogTWFwIGZyb20gZmxhdCBub2RlIHRvIG5lc3RlZCBub2RlLiBUaGlzIGhlbHBzIHVzIGZpbmRpbmcgdGhlIG5lc3RlZCBub2RlIHRvIGJlIG1vZGlmaWVkICovXHJcbiAgICBmbGF0Tm9kZU1hcCA9IG5ldyBNYXA8RmlsZUZsYXROb2RlLCBGaWxlTm9kZT4oKTtcclxuXHJcbiAgICAvKiogTWFwIGZyb20gbmVzdGVkIG5vZGUgdG8gZmxhdHRlbmVkIG5vZGUuIFRoaXMgaGVscHMgdXMgdG8ga2VlcCB0aGUgc2FtZSBvYmplY3QgZm9yIHNlbGVjdGlvbiAqL1xyXG4gICAgbmVzdGVkTm9kZU1hcCA9IG5ldyBNYXA8RmlsZU5vZGUsIEZpbGVGbGF0Tm9kZT4oKTtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkYXRhYmFzZTogRmlsZURhdGFiYXNlKSB7XHJcbiAgICB0aGlzLmVtaXROb2RlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5jcmVhdGVOb2RlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5jcmVhdGVGb2xkZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmVtaXRBbGxOb2RlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMudHJlZUZsYXR0ZW5lciA9IG5ldyBNYXRUcmVlRmxhdHRlbmVyKHRoaXMudHJhbnNmb3JtZXIsIHRoaXMuX2dldExldmVsLFxyXG4gICAgICB0aGlzLl9pc0V4cGFuZGFibGUsIHRoaXMuX2dldENoaWxkcmVuKTtcclxuICAgIHRoaXMudHJlZUNvbnRyb2wgPSBuZXcgRmxhdFRyZWVDb250cm9sPEZpbGVGbGF0Tm9kZT4odGhpcy5fZ2V0TGV2ZWwsIHRoaXMuX2lzRXhwYW5kYWJsZSk7XHJcbiAgICB0aGlzLmRhdGFTb3VyY2UgPSBuZXcgTWF0VHJlZUZsYXREYXRhU291cmNlKHRoaXMudHJlZUNvbnRyb2wsIHRoaXMudHJlZUZsYXR0ZW5lcik7XHJcbiBcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCl7XHJcblxyXG4gICAgaWYodGhpcy5ldmVudE5vZGVVcGRhdGVkU3Vic2NyaXB0aW9uKVxyXG4gICAge1xyXG4gICAgICB0aGlzLmV2ZW50Tm9kZVVwZGF0ZWRTdWJzY3JpcHRpb24uc3Vic2NyaWJlKFxyXG4gICAgICAgIChub2RlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZU5vZGUobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmV2ZW50Q3JlYXRlTm9kZVN1YnNjcmlwdGlvbilcclxuICAgIHtcclxuICAgICAgdGhpcy5ldmVudENyZWF0ZU5vZGVTdWJzY3JpcHRpb24uc3Vic2NyaWJlKFxyXG4gICAgICAgIChub2RlKSA9PiB7XHJcbiAgICAgICAgICBpZihub2RlLmlzRm9sZGVyKSB0aGlzLmNyZWF0ZU5ld0ZvbGRlcihub2RlKTtcclxuICAgICAgICAgIGVsc2UgdGhpcy5jcmVhdGVOZXdOb2RlKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmV2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLl9ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbi5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZW1pdEFsbFJvd3MoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50UmVmcmVzaFN1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5nZXRFbGVtZW50cygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdGhpcy5nZXRFbGVtZW50cygpO1xyXG4gIH1cclxuXHJcbiAgZ2V0RWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdldEFsbCgpXHJcbiAgICAuc3Vic2NyaWJlKChpdGVtcykgPT4ge1xyXG4gICAgICB0aGlzLnRyZWVEYXRhID0gaXRlbXM7XHJcbiAgICAgIHRoaXMuZGF0YWJhc2UuaW5pdGlhbGl6ZSh0aGlzLnRyZWVEYXRhKTtcclxuICAgICAgdGhpcy5kYXRhYmFzZS5kYXRhQ2hhbmdlLnN1YnNjcmliZShkYXRhID0+IHRoaXMucmVidWlsZFRyZWVGb3JEYXRhKFtkYXRhXSkpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgdHJhbnNmb3JtZXIgPSAobm9kZTogRmlsZU5vZGUsIGxldmVsOiBudW1iZXIpID0+IHtcclxuICAgIGNvbnN0IGV4aXN0aW5nTm9kZSA9IHRoaXMubmVzdGVkTm9kZU1hcC5nZXQobm9kZSk7XHJcbiAgICBjb25zdCBmbGF0Tm9kZSA9IGV4aXN0aW5nTm9kZSAmJiBleGlzdGluZ05vZGUubmFtZSA9PT0gbm9kZS5uYW1lXHJcbiAgICAgID8gZXhpc3RpbmdOb2RlXHJcbiAgICAgIDogbmV3IEZpbGVGbGF0Tm9kZSgobm9kZS5jaGlsZHJlbiAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApLG5vZGUubmFtZSxsZXZlbCxub2RlLnR5cGUsbm9kZS5pZCxub2RlLnN0YXR1cyk7XHJcblxyXG4gICAgdGhpcy5mbGF0Tm9kZU1hcC5zZXQoZmxhdE5vZGUsIG5vZGUpO1xyXG4gICAgdGhpcy5uZXN0ZWROb2RlTWFwLnNldChub2RlLCBmbGF0Tm9kZSk7XHJcbiAgICByZXR1cm4gZmxhdE5vZGU7XHJcbiAgXHJcbiAgfVxyXG4gIHByaXZhdGUgX2dldExldmVsID0gKG5vZGU6IEZpbGVGbGF0Tm9kZSkgPT4gbm9kZS5sZXZlbDtcclxuICBwcml2YXRlIF9pc0V4cGFuZGFibGUgPSAobm9kZTogRmlsZUZsYXROb2RlKSA9PiBub2RlLmV4cGFuZGFibGU7XHJcbiAgcHJpdmF0ZSBfZ2V0Q2hpbGRyZW4gPSAobm9kZTogRmlsZU5vZGUpOiBPYnNlcnZhYmxlPEZpbGVOb2RlW10+ID0+IG9ic2VydmFibGVPZihub2RlLmNoaWxkcmVuKTtcclxuICBoYXNDaGlsZCA9IChfOiBudW1iZXIsIF9ub2RlRGF0YTogRmlsZUZsYXROb2RlKSA9PiBfbm9kZURhdGEuZXhwYW5kYWJsZTtcclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIFRoaXMgY29uc3RydWN0cyBhbiBhcnJheSBvZiBub2RlcyB0aGF0IG1hdGNoZXMgdGhlIERPTVxyXG4gICAqL1xyXG4gIHZpc2libGVOb2RlcygpOiBGaWxlTm9kZVtdIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFkZEV4cGFuZGVkQ2hpbGRyZW4obm9kZTogRmlsZU5vZGUsIGV4cGFuZGVkOiBzdHJpbmdbXSkge1xyXG4gICAgICByZXN1bHQucHVzaChub2RlKTtcclxuICAgICAgaWYgKGV4cGFuZGVkLmluZGV4T2Yobm9kZS5pZCkgIT0gLTEpIHtcclxuICAgICAgICBub2RlLmNoaWxkcmVuLm1hcCgoY2hpbGQpID0+IGFkZEV4cGFuZGVkQ2hpbGRyZW4oY2hpbGQsIGV4cGFuZGVkKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuZGF0YVNvdXJjZS5kYXRhLmZvckVhY2goKG5vZGUpID0+IHtcclxuICAgICAgYWRkRXhwYW5kZWRDaGlsZHJlbihub2RlLCB0aGlzLmV4cGFuc2lvbk1vZGVsLnNlbGVjdGVkKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG5cclxuICAgZmluZE5vZGVTaWJsaW5ncyhhcnI6IEFycmF5PGFueT4sIGlkOiBzdHJpbmcpOiBBcnJheTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQsIHN1YlJlc3VsdDtcclxuICAgIGFyci5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLmlkID09PSBpZCkge1xyXG4gICAgICAgIHJlc3VsdCA9IGFycjtcclxuICAgICAgfSBlbHNlIGlmIChpdGVtLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgc3ViUmVzdWx0ID0gdGhpcy5maW5kTm9kZVNpYmxpbmdzKGl0ZW0uY2hpbGRyZW4sIGlkKTtcclxuICAgICAgICBpZiAoc3ViUmVzdWx0KSByZXN1bHQgPSBzdWJSZXN1bHQ7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgfVxyXG5cclxuXHJcbiAgaGFuZGxlRHJhZ1N0YXJ0KGV2ZW50LCBub2RlKSB7XHJcbiAgICAvLyBSZXF1aXJlZCBieSBGaXJlZm94IChodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xOTA1NTI2NC93aHktZG9lc250LWh0bWw1LWRyYWctYW5kLWRyb3Atd29yay1pbi1maXJlZm94KVxyXG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ2ZvbycsICdiYXInKTtcclxuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UodGhpcy5lbXB0eUl0ZW0ubmF0aXZlRWxlbWVudCwgMCwgMCk7XHJcbiAgICB0aGlzLmRyYWdOb2RlID0gbm9kZTtcclxuICAgIHRoaXMudHJlZUNvbnRyb2wuY29sbGFwc2Uobm9kZSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVEcmFnT3ZlcihldmVudCwgbm9kZSkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAvLyBIYW5kbGUgbm9kZSBleHBhbmRcclxuICAgIGlmIChub2RlID09PSB0aGlzLmRyYWdOb2RlRXhwYW5kT3Zlck5vZGUpIHtcclxuICAgICAgaWYgKHRoaXMuZHJhZ05vZGUgIT09IG5vZGUgJiYgIXRoaXMudHJlZUNvbnRyb2wuaXNFeHBhbmRlZChub2RlKSkge1xyXG4gICAgICAgIGlmICgobmV3IERhdGUoKS5nZXRUaW1lKCkgLSB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlclRpbWUpID4gdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJXYWl0VGltZU1zKSB7XHJcbiAgICAgICAgICB0aGlzLnRyZWVDb250cm9sLmV4cGFuZChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyTm9kZSA9IG5vZGU7XHJcbiAgICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEhhbmRsZSBkcmFnIGFyZWFcclxuICAgIGNvbnN0IHBlcmNlbnRhZ2VYID0gZXZlbnQub2Zmc2V0WCAvIGV2ZW50LnRhcmdldC5jbGllbnRXaWR0aDtcclxuICAgIGNvbnN0IHBlcmNlbnRhZ2VZID0gZXZlbnQub2Zmc2V0WSAvIGV2ZW50LnRhcmdldC5jbGllbnRIZWlnaHQ7XHJcbiAgICBpZiAocGVyY2VudGFnZVkgPCAwLjI1KSB7XHJcbiAgICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyQXJlYSA9ICdhYm92ZSc7XHJcbiAgICB9IGVsc2UgaWYgKHBlcmNlbnRhZ2VZID4gMC43NSkge1xyXG4gICAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlckFyZWEgPSAnYmVsb3cnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJBcmVhID0gJ2NlbnRlcic7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoYW5kbGVEcm9wKGV2ZW50LCBub2RlKSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29uc3QgY2hhbmdlZERhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YVNvdXJjZS5kYXRhKSlcclxuXHJcbiAgICBcclxuICAgIGxldCB0b0ZsYXROb2RlO1xyXG4gICAgaWYobm9kZS5pZCA9PT0gdW5kZWZpbmVkKSB7IHRvRmxhdE5vZGU9Y2hhbmdlZERhdGFbMF0gfVxyXG4gICAgZWxzZXtcclxuICAgICAgdG9GbGF0Tm9kZT0gdGhpcy5maW5kTm9kZVNpYmxpbmdzKGNoYW5nZWREYXRhWzBdLmNoaWxkcmVuLCBub2RlLmlkKS5maW5kKG5vZGVBY3QgPT4gbm9kZUFjdC5pZCA9PT0gbm9kZS5pZCk7XHJcbiAgICB9XHJcbiAgICBsZXQgZnJvbUZsYXROb2RlO1xyXG4gICAgaWYoIHRoaXMuZHJhZ05vZGUuaWQgPT09IHVuZGVmaW5lZCkgeyBmcm9tRmxhdE5vZGU9Y2hhbmdlZERhdGFbMF0gfVxyXG4gICAgZWxzZXtcclxuICAgICAgZnJvbUZsYXROb2RlID0gdGhpcy5maW5kTm9kZVNpYmxpbmdzKGNoYW5nZWREYXRhWzBdLmNoaWxkcmVuLCB0aGlzLmRyYWdOb2RlLmlkKS5maW5kKG5vZGVBY3QgPT4gbm9kZUFjdC5pZCA9PT0gdGhpcy5kcmFnTm9kZS5pZCk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5kcmFnTm9kZS5zdGF0dXMhPVwicGVuZGluZ0RlbGV0ZVwiICYmIG5vZGUgIT09IHRoaXMuZHJhZ05vZGUgJiYgKHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyQXJlYSAhPT0gJ2NlbnRlcicgfHwgKHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyQXJlYSA9PT0gJ2NlbnRlcicgJiYgdG9GbGF0Tm9kZS5pc0ZvbGRlcikpKSB7XHJcbiAgICAgIGxldCBuZXdJdGVtOiBGaWxlTm9kZTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlckFyZWEgPT09ICdhYm92ZScpIHtcclxuICAgICAgICBuZXdJdGVtID0gdGhpcy5kYXRhYmFzZS5jb3B5UGFzdGVJdGVtQWJvdmUoZnJvbUZsYXROb2RlLHRvRmxhdE5vZGUsY2hhbmdlZERhdGFbMF0pO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyQXJlYSA9PT0gJ2JlbG93Jykge1xyXG4gICAgICAgIG5ld0l0ZW0gPSB0aGlzLmRhdGFiYXNlLmNvcHlQYXN0ZUl0ZW1CZWxvdyhmcm9tRmxhdE5vZGUsdG9GbGF0Tm9kZSxjaGFuZ2VkRGF0YVswXSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbmV3SXRlbSA9IHRoaXMuZGF0YWJhc2UuY29weVBhc3RlSXRlbShmcm9tRmxhdE5vZGUsIHRvRmxhdE5vZGUsY2hhbmdlZERhdGFbMF0pO1xyXG4gICAgICB9ICAgIFxyXG4gICAgICBsZXQgcGFyZW50THZsPXRoaXMudHJlZUNvbnRyb2wuZGF0YU5vZGVzLmZpbmQoKG4pID0+IG4uaWQgPT09IGZyb21GbGF0Tm9kZS5pZCkubGV2ZWw7XHJcbiAgICAgIGZyb21GbGF0Tm9kZS5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkPT57XHJcbiAgICAgICAgdGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXMuZmluZCgobikgPT4gbi5pZCA9PT0gY2hpbGQuaWQpLmxldmVsPXBhcmVudEx2bCsxXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmRhdGFiYXNlLmRlbGV0ZUl0ZW0oZnJvbUZsYXROb2RlLGNoYW5nZWREYXRhWzBdKTtcclxuICAgICAgdGhpcy50cmVlQ29udHJvbC5leHBhbmREZXNjZW5kYW50cyh0aGlzLm5lc3RlZE5vZGVNYXAuZ2V0KG5ld0l0ZW0pKTtcclxuICAgIH1cclxuICAgXHJcbiAgICB0aGlzLmRyYWdOb2RlID0gbnVsbDtcclxuICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyTm9kZSA9IG51bGw7XHJcbiAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlclRpbWUgPSAwO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlRHJhZ0VuZChldmVudCkge1xyXG4gICAgdGhpcy5kcmFnTm9kZSA9IG51bGw7XHJcbiAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3Zlck5vZGUgPSBudWxsO1xyXG4gICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJUaW1lID0gMDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBmb2xsb3dpbmcgbWV0aG9kcyBhcmUgZm9yIHBlcnNpc3RpbmcgdGhlIHRyZWUgZXhwYW5kIHN0YXRlXHJcbiAgICogYWZ0ZXIgYmVpbmcgcmVidWlsdFxyXG4gICAqL1xyXG5cclxuICAgc29ydEJ5T3JkZXIoZGF0YTogYW55W10pe1xyXG4gICAgLy8gZGF0YS5zb3J0KChhLGIpID0+IGEub3JkZXIudG9TdHJpbmcoKS5sb2NhbGVDb21wYXJlKCBiLm9yZGVyLnRvU3RyaW5nKCkpKTtcclxuICAgIGRhdGEuc29ydCgoYSxiKSA9PiAoYS5vcmRlciA+IGIub3JkZXIpID8gMSA6ICgoYi5vcmRlciA+IGEub3JkZXIpID8gLTEgOiAwKSk7XHJcbiAgICBkYXRhLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4ubGVuZ3RoPjApIHtcclxuICAgICAgICB0aGlzLnNvcnRCeU9yZGVyKGl0ZW0uY2hpbGRyZW4pO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiAgIH1cclxuXHJcbiAgIHNldE9yZGVyKGRhdGE6IGFueVtdKXtcclxuICAgIGZvcihsZXQgaT0wOyBpPCBkYXRhLmxlbmd0aDsgaSsrKXtcclxuICAgICAgZGF0YVtpXS5vcmRlcj1pO1xyXG4gICAgICBpZighIGRhdGFbaV0uc3RhdHVzKSB7IGRhdGFbaV0uc3RhdHVzPVwiTW9kaWZpZWRcIjsgfSBcclxuICAgIH1cclxuICAgIHJldHVybiBkYXRhO1xyXG4gICB9XHJcblxyXG4gIHJlYnVpbGRUcmVlRm9yRGF0YShkYXRhOiBhbnlbXSkge1xyXG4gICAgLy90aGlzLmRhdGFTb3VyY2UuZGF0YSA9IGRhdGE7XHJcbiAgICB0aGlzLnNvcnRCeU9yZGVyKGRhdGEpO1xyXG4gICAgdGhpcy5kYXRhU291cmNlLmRhdGEgPSBbXTtcclxuICAgIHRoaXMuZGF0YVNvdXJjZS5kYXRhID0gZGF0YTtcclxuICAgIHRoaXMudHJlZUNvbnRyb2wuZXhwYW5zaW9uTW9kZWwuc2VsZWN0ZWQuZm9yRWFjaCgobm9kZUFjdCkgPT4ge1xyXG4gICAgICBjb25zdCBub2RlID0gdGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXMuZmluZCgobikgPT4gbi5pZCA9PT0gbm9kZUFjdC5pZCk7XHJcbiAgICAgIHRoaXMudHJlZUNvbnRyb2wuZXhwYW5kKG5vZGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFBhcmVudE5vZGUobm9kZTogRmlsZUZsYXROb2RlKTogRmlsZUZsYXROb2RlIHwgbnVsbCB7XHJcbiAgICBjb25zdCBjdXJyZW50TGV2ZWwgPSBub2RlLmxldmVsO1xyXG4gICAgaWYgKGN1cnJlbnRMZXZlbCA8IDEpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzdGFydEluZGV4ID0gdGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXMuaW5kZXhPZihub2RlKSAtIDE7XHJcbiAgICBmb3IgKGxldCBpID0gc3RhcnRJbmRleDsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgY29uc3QgY3VycmVudE5vZGUgPSB0aGlzLnRyZWVDb250cm9sLmRhdGFOb2Rlc1tpXTtcclxuICAgICAgaWYgKGN1cnJlbnROb2RlLmxldmVsIDwgY3VycmVudExldmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHVwZGF0ZU5vZGUobm9kZVVwZGF0ZWQpXHJcbiAge1xyXG4gICAgY29uc3QgZGF0YVRvQ2hhbmdlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGFTb3VyY2UuZGF0YSkpXHJcbiAgICBjb25zdCBzaWJsaW5ncyA9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhkYXRhVG9DaGFuZ2UsIG5vZGVVcGRhdGVkLmlkKTtcclxuICAgIGxldCBpbmRleD0gc2libGluZ3MuZmluZEluZGV4KG5vZGUgPT4gbm9kZS5pZCA9PT0gbm9kZVVwZGF0ZWQuaWQpXHJcbiAgICBzaWJsaW5nc1tpbmRleF09bm9kZVVwZGF0ZWQ7XHJcbiAgICB0aGlzLnJlYnVpbGRUcmVlRm9yRGF0YShkYXRhVG9DaGFuZ2UpO1xyXG5cclxuICB9XHJcblxyXG4gIGNyZWF0ZU5ld0ZvbGRlcihuZXdGb2xkZXIpXHJcbiAge1xyXG4gICAgbmV3Rm9sZGVyLnR5cGU9XCJmb2xkZXJcIjtcclxuICAgIGNvbnN0IGRhdGFUb0NoYW5nZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhU291cmNlLmRhdGEpKVxyXG4gICAgaWYobmV3Rm9sZGVyLnBhcmVudCA9PT0gbnVsbCkge1xyXG4gICAgICBuZXdGb2xkZXIub3JkZXI9ZGF0YVRvQ2hhbmdlWzBdLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgZGF0YVRvQ2hhbmdlWzBdLmNoaWxkcmVuLnB1c2gobmV3Rm9sZGVyKVxyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgY29uc3Qgc2libGluZ3MgPSB0aGlzLmZpbmROb2RlU2libGluZ3MoZGF0YVRvQ2hhbmdlLCBuZXdGb2xkZXIucGFyZW50KTtcclxuICAgICAgbGV0IGluZGV4PSBzaWJsaW5ncy5maW5kSW5kZXgobm9kZSA9PiBub2RlLmlkID09PSBuZXdGb2xkZXIucGFyZW50KTtcclxuICAgICAgbmV3Rm9sZGVyLm9yZGVyPXNpYmxpbmdzW2luZGV4XS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgIHNpYmxpbmdzW2luZGV4XS5jaGlsZHJlbi5wdXNoKG5ld0ZvbGRlcilcclxuICAgIH1cclxuICAgIHRoaXMucmVidWlsZFRyZWVGb3JEYXRhKGRhdGFUb0NoYW5nZSk7XHJcblxyXG4gIH1cclxuXHJcbiAgY3JlYXRlTmV3Tm9kZShuZXdOb2RlKVxyXG4gIHtcclxuICAgIG5ld05vZGUudHlwZT1cIm5vZGVcIjtcclxuICAgIGNvbnN0IGRhdGFUb0NoYW5nZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhU291cmNlLmRhdGEpKVxyXG4gICAgaWYobmV3Tm9kZS5wYXJlbnQgPT09IG51bGwpIHtcclxuICAgICAgbmV3Tm9kZS5vcmRlcj1kYXRhVG9DaGFuZ2VbMF0uY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICBkYXRhVG9DaGFuZ2VbMF0uY2hpbGRyZW4ucHVzaChuZXdOb2RlKVxyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgIGNvbnN0IHNpYmxpbmdzID0gdGhpcy5maW5kTm9kZVNpYmxpbmdzKGRhdGFUb0NoYW5nZSwgbmV3Tm9kZS5wYXJlbnQpO1xyXG4gICAgbGV0IGluZGV4PSBzaWJsaW5ncy5maW5kSW5kZXgobm9kZSA9PiBub2RlLmlkID09PSBuZXdOb2RlLnBhcmVudCk7XHJcbiAgICBuZXdOb2RlLm9yZGVyPXNpYmxpbmdzW2luZGV4XS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICBzaWJsaW5nc1tpbmRleF0uY2hpbGRyZW4ucHVzaChuZXdOb2RlKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVidWlsZFRyZWVGb3JEYXRhKGRhdGFUb0NoYW5nZSk7XHJcblxyXG4gIH1cclxuXHJcblxyXG5cclxuICBvbkJ1dHRvbkNsaWNrZWQoaWQsIGJ1dHRvbjogc3RyaW5nKVxyXG4gIHtcclxuICAgIGNvbnN0IGNoYW5nZWREYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGFTb3VyY2UuZGF0YSkpXHJcbiAgICBjb25zdCBzaWJsaW5ncyA9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhjaGFuZ2VkRGF0YSwgaWQpO1xyXG4gICAgbGV0IG5vZGVDbGlja2VkPSBzaWJsaW5ncy5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gaWQpO1xyXG4gICAgaWYoYnV0dG9uID09PSdlZGl0JykgIHt0aGlzLmVtaXROb2RlLmVtaXQobm9kZUNsaWNrZWQpfVxyXG4gICAgZWxzZSBpZihidXR0b24gPT09ICduZXdGb2xkZXInKSB7dGhpcy5jcmVhdGVGb2xkZXIuZW1pdChub2RlQ2xpY2tlZCl9XHJcbiAgICBlbHNlIGlmKGJ1dHRvbiA9PT0gJ25ld05vZGUnKSB7dGhpcy5jcmVhdGVOb2RlLmVtaXQoIG5vZGVDbGlja2VkKX1cclxuICAgIGVsc2UgaWYoYnV0dG9uID09PSAnZGVsZXRlJykge1xyXG4gICAgICAvLyBsZXQgY2hpbGRyZW49IHRoaXMuZ2V0QWxsQ2hpbGRyZW4obm9kZUNsaWNrZWQuY2hpbGRyZW4pXHJcbiAgICAgIC8vIGNoaWxkcmVuLmZvckVhY2goY2hpbGRyZW4gPT4ge1xyXG4gICAgICAvLyAgIGNoaWxkcmVuLnN0YXR1cz0ncGVuZGluZ0RlbGV0ZSc7XHJcbiAgICAgIC8vIH0pO1xyXG4gICAgICB0aGlzLmRlbGV0ZUNoaWxkcmVuKG5vZGVDbGlja2VkLmNoaWxkcmVuKTtcclxuICAgICAgLy8gbm9kZUNsaWNrZWQuY2hpbGRyZW49Y2hpbGRyZW5cclxuICAgICAgbm9kZUNsaWNrZWQuc3RhdHVzPSdwZW5kaW5nRGVsZXRlJ1xyXG4gICAgICBcclxuICAgICAgdGhpcy5yZWJ1aWxkVHJlZUZvckRhdGEoY2hhbmdlZERhdGEpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGVtaXRBbGxSb3dzKClcclxuICB7XHJcbiAgICBjb25zdCBkYXRhVG9FbWl0ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGFTb3VyY2UuZGF0YSkpXHJcbiAgICBsZXQgYWxsUm93cyA9IHRoaXMuZ2V0QWxsQ2hpbGRyZW4oZGF0YVRvRW1pdCk7IFxyXG4gICAgdGhpcy5lbWl0QWxsTm9kZXMuZW1pdChhbGxSb3dzKTtcclxuICB9XHJcblxyXG4gIGdldEFsbENoaWxkcmVuKGFycilcclxuICB7XHJcbiAgICBsZXQgcmVzdWx0ID0gW107XHJcbiAgICBsZXQgc3ViUmVzdWx0O1xyXG4gICAgYXJyLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4ubGVuZ3RoPjApIHtcclxuICAgICAgICBzdWJSZXN1bHQgPSB0aGlzLmdldEFsbENoaWxkcmVuKGl0ZW0uY2hpbGRyZW4pO1xyXG4gICAgICAgIGlmIChzdWJSZXN1bHQpIHJlc3VsdC5wdXNoKC4uLnN1YlJlc3VsdCk7XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XHJcblxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlQ2hpbGRyZW4oYXJyKVxyXG4gIHtcclxuICAgIGFyci5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLmNoaWxkcmVuLmxlbmd0aD4wKSB7XHJcbiAgICAgICAgdGhpcy5kZWxldGVDaGlsZHJlbihpdGVtLmNoaWxkcmVuKTtcclxuICAgICAgfVxyXG4gICAgICBpdGVtLnN0YXR1cz0ncGVuZGluZ0RlbGV0ZSdcclxuXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59XHJcblxyXG5cclxuIl19