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
     * @param {?} allNewElements
     * @return {?}
     */
    initialize(dataObj, allNewElements) {
        /** @type {?} */
        const data = this.buildFileTree(dataObj, 0, allNewElements);
        // Notify the change.
        this.dataChange.next(data);
    }
    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `FileNode`.
     * @param {?} arrayTreeNodes
     * @param {?} level
     * @param {?} allNewElements
     * @return {?}
     */
    buildFileTree(arrayTreeNodes, level, allNewElements) {
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
                if (allNewElements) {
                    obj.status = 'pendingCreation';
                    if (obj.id) {
                        obj.id = obj.id * -1;
                    }
                    if (obj.parent) {
                        obj.parent = obj.parent * -1;
                    }
                }
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
        this.loadButtonClicked = new EventEmitter();
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
            this._eventGetAllRowsSubscription = this.eventGetAllRowsSubscription.subscribe((event) => {
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
    /**
     * @return {?}
     */
    loadDataButtonClicked() {
        /** @type {?} */
        const dataToEmit = JSON.parse(JSON.stringify(this.dataSource.data));
        /** @type {?} */
        let allRows = this.getAllChildren(dataToEmit);
        this.loadButtonClicked.emit(allRows);
    }
    /**
     * @return {?}
     */
    getElements() {
        this.getAll()
            .subscribe((items) => {
            this.treeData = items;
            this.database.initialize(this.treeData, this.allNewElements);
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
            if (item.children && item.children.length > 0) {
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
            if (nodeAct) {
                /** @type {?} */
                const node = this.treeControl.dataNodes.find((n) => n.id === nodeAct.id);
                this.treeControl.expand(node);
            }
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
     * @param {?} event
     * @return {?}
     */
    emitAllRows(event) {
        /** @type {?} */
        const dataToEmit = JSON.parse(JSON.stringify(this.dataSource.data));
        /** @type {?} */
        let allRows = this.getAllChildren(dataToEmit);
        this.emitAllNodes.emit({ event: event, data: allRows });
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
            if (item.children && item.children.length > 0) {
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
            if (item.children && item.children.length > 0) {
                this.deleteChildren(item.children);
            }
            item.status = 'pendingDelete';
        });
    }
}
DataTreeComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-data-tree',
                template: "<button mat-flat-button type=\"button\" (click)=\"treeControl.expandAll()\" title=\"{{ 'expandAll' | translate }}\"  type=\"button\" >\r\n\t<mat-icon fontSet=\"material-icons-round\"> expand_more </mat-icon>\r\n\t{{ \"expandAll\" | translate }}\r\n</button>\r\n<button mat-flat-button type=\"button\" (click)=\"treeControl.collapseAll()\" title=\"{{ 'expandAll' | translate }}\"  type=\"button\" >\r\n\t<mat-icon fontSet=\"material-icons-round\"> expand_less </mat-icon>\r\n\t{{ \"collapseAll\" | translate }}\r\n</button>\r\n<button mat-flat-button type=\"button\" *ngIf=\"loadDataButton\" (click)=\"loadDataButtonClicked()\" title=\"{{ 'loadGroupLayers' | translate }}\"  type=\"button\" >\r\n\t<mat-icon fontSet=\"material-icons-round\"> file_download </mat-icon>\r\n\t{{ \"loadGroupLayers\" | translate }}\r\n</button>\r\n<mat-tree [dataSource]=\"dataSource\" [treeControl]=\"treeControl\" >\r\n\t<mat-tree-node *matTreeNodeDef=\"let node\" matTreeNodeToggle matTreeNodePadding  draggable=\"true\"\r\n\t(dragstart)=\"handleDragStart($event, node);\" \t(dragover)=\"handleDragOver($event, node);\"\r\n\t(drop)=\"handleDrop($event, node);\" \t(dragend)=\"handleDragEnd($event);\"                  \r\n\t  [ngClass]=\"{'drop-above': dragNodeExpandOverArea === 'above' && dragNodeExpandOverNode === node,\r\n\t'drop-below': dragNodeExpandOverArea === 'below' && dragNodeExpandOverNode === node,\r\n\t'drop-center': dragNodeExpandOverArea === 'center' && dragNodeExpandOverNode === node,\r\n\t'deletedNode': node.status=='pendingDelete'}\">\r\n\t\t<button mat-icon-button disabled></button>\r\n\t\t<mat-icon *ngIf=\"node.type ==='folder'&& node.status!='pendingDelete'\" class=\"type-icon\" [attr.aria-label]=\"node.type + 'icon'\">\r\n\t\t\tfolder\r\n\t\t</mat-icon>\r\n\t\t<span *ngIf=\"node.status=='pendingDelete'\">({{\"pendingDelete\" | translate}})-</span>\r\n\t\t{{node.name}}\r\n\t\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newFolder')\" mat-icon-button>\r\n\t\t\t<mat-icon>create_new_folder</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newNode')\" mat-icon-button>\r\n\t\t\t<mat-icon>playlist_add</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\" mat-icon-button (click)=\"onButtonClicked(node.id, 'delete')\">\r\n\t\t\t<mat-icon>delete</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\" mat-icon-button (click)=\"onButtonClicked(node.id, 'edit')\">\r\n\t\t\t<mat-icon>edit</mat-icon>\r\n\t\t</button>\r\n\r\n\t</mat-tree-node>\r\n\r\n\t<mat-tree-node *matTreeNodeDef=\"let node;when: hasChild\" matTreeNodePadding  draggable=\"true\"\r\n\t(dragstart)=\"handleDragStart($event, node);\" \t(dragover)=\"handleDragOver($event, node);\"\r\n\t(drop)=\"handleDrop($event, node);\" \t(dragend)=\"handleDragEnd($event);\"                  \r\n\t [ngClass]=\"{'drop-above': dragNodeExpandOverArea === 'above' && dragNodeExpandOverNode === node,\r\n\t'drop-below': dragNodeExpandOverArea === 'below' && dragNodeExpandOverNode === node,\r\n\t'drop-center': dragNodeExpandOverArea === 'center' && dragNodeExpandOverNode === node,\r\n\t'deletedNode': node.status=='pendingDelete'}\">\r\n\t\t<button mat-icon-button matTreeNodeToggle (click)=\"expansionModel.toggle(node.id)\"\r\n\t\t\t[attr.aria-label]=\"'toggle ' + node.name\">\r\n\t\t\t<mat-icon class=\"mat-icon-rtl-mirror\">\r\n\t\t\t\t{{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}\r\n\t\t\t</mat-icon>\r\n\t\t</button>\r\n\t\t<mat-icon class=\"type-icon\" [attr.aria-label]=\"node.type + 'icon'\">\r\n\t\t\tfolder\r\n\t\t</mat-icon>\r\n\t\t<span *ngIf=\"node.status=='pendingDelete'\">({{\"pendingDelete\" | translate}})-</span>\r\n\t\t{{node.name}}\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newFolder')\" mat-icon-button>\r\n\t\t\t<mat-icon>create_new_folder</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.type ==='folder' && node.status!='pendingDelete'\" (click)=\"onButtonClicked(node.id, 'newNode')\" mat-icon-button>\r\n\t\t\t<mat-icon>playlist_add</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\" mat-icon-button (click)=\"onButtonClicked(node.id, 'delete')\">\r\n\t\t\t<mat-icon>delete</mat-icon>\r\n\t\t</button>\r\n\t\t<button *ngIf=\"node.id !== undefined && node.status!='pendingDelete'\"  mat-icon-button (click)=\"onButtonClicked(node.id, 'edit')\">\r\n\t\t\t<mat-icon>edit</mat-icon>\r\n\t\t</button>\r\n\t\t\r\n\t</mat-tree-node>\r\n</mat-tree>\r\n\r\n<span #emptyItem></span>\r\n",
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
    loadButtonClicked: [{ type: Output }],
    eventNodeUpdatedSubscription: [{ type: Input }],
    eventCreateNodeSubscription: [{ type: Input }],
    eventGetAllRowsSubscription: [{ type: Input }],
    eventRefreshSubscription: [{ type: Input }],
    loadDataButton: [{ type: Input }],
    getAll: [{ type: Input }],
    allNewElements: [{ type: Input }],
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
    DataTreeComponent.prototype.loadButtonClicked;
    /** @type {?} */
    DataTreeComponent.prototype.eventNodeUpdatedSubscription;
    /** @type {?} */
    DataTreeComponent.prototype.eventCreateNodeSubscription;
    /** @type {?} */
    DataTreeComponent.prototype.eventGetAllRowsSubscription;
    /** @type {?} */
    DataTreeComponent.prototype.eventRefreshSubscription;
    /** @type {?} */
    DataTreeComponent.prototype.loadDataButton;
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
    DataTreeComponent.prototype.allNewElements;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS10cmVlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGF0YS10cmVlL2RhdGEtdHJlZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pHLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2pGLE9BQU8sRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLEVBQUUsSUFBSSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFdkUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7OztBQU8xRCxNQUFNLE9BQU8sUUFBUTtDQXNCcEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdELE1BQU0sT0FBTyxZQUFZOzs7Ozs7Ozs7SUFDdkIsWUFDUyxZQUNBLE1BQ0EsT0FDQSxNQUNBLElBQ0E7UUFMQSxlQUFVLEdBQVYsVUFBVTtRQUNWLFNBQUksR0FBSixJQUFJO1FBQ0osVUFBSyxHQUFMLEtBQUs7UUFDTCxTQUFJLEdBQUosSUFBSTtRQUNKLE9BQUUsR0FBRixFQUFFO1FBQ0YsV0FBTSxHQUFOLE1BQU07S0FDVjtDQUNOOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBWUQsTUFBTSxPQUFPLFlBQVk7SUFJdkI7MEJBSGEsSUFBSSxlQUFlLENBQWEsRUFBRSxDQUFDO0tBSy9DOzs7O0lBSkQsSUFBSSxJQUFJLEtBQVUs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QUFRLENBQUMsTUFBTSxHQUFDLENBQUMsRUFBRTtnQkFDM0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDcEM7WUFDRCxJQUFJLENBQUMsTUFBTSxHQUFDLGVBQWUsQ0FBQTtTQUU1QixDQUFDLENBQUM7S0FDSjs7O1lBaFpGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZUFBZTtnQkFDekIsc3NKQUF1QztnQkFFdkMsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDOzthQUMxQjs7OztZQThDOEIsWUFBWTs7O3lCQTVDeEMsTUFBTTsyQkFDTixNQUFNO3VCQUNOLE1BQU07MkJBQ04sTUFBTTtnQ0FDTixNQUFNOzJDQUNOLEtBQUs7MENBQ0wsS0FBSzswQ0FDTCxLQUFLO3VDQUNMLEtBQUs7NkJBQ0wsS0FBSztxQkFnQkwsS0FBSzs2QkFDTCxLQUFLO3dCQVNMLFNBQVMsU0FBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRmxhdFRyZWVDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RyZWUnO1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5qZWN0YWJsZSwgSW5wdXQsIE91dHB1dCxFbGVtZW50UmVmLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTWF0VHJlZUZsYXREYXRhU291cmNlLCBNYXRUcmVlRmxhdHRlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvdHJlZSc7XHJcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgb2YgYXMgb2JzZXJ2YWJsZU9mIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IENka0RyYWdEcm9wIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2RyYWctZHJvcCc7XHJcbmltcG9ydCB7IFNlbGVjdGlvbk1vZGVsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcclxuaW1wb3J0IHsgZm9yRWFjaCB9IGZyb20gJ2pzemlwJztcclxuXHJcbi8qKlxyXG4gKiBGaWxlIG5vZGUgZGF0YSB3aXRoIG5lc3RlZCBzdHJ1Y3R1cmUuXHJcbiAqIEVhY2ggbm9kZSBoYXMgYSBuYW1lLCBhbmQgYSB0eXBlIG9yIGEgbGlzdCBvZiBjaGlsZHJlbi5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBGaWxlTm9kZSB7XHJcbiAgaWQ6IHN0cmluZztcclxuICBjaGlsZHJlbjogRmlsZU5vZGVbXTtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgdHlwZTogYW55O1xyXG4gIGFjdGl2ZTogYW55XHJcbiAgY2FydG9ncmFwaHlJZDogYW55XHJcbiAgY2FydG9ncmFwaHlOYW1lOiBhbnlcclxuICBkYXRhc2V0VVJMOiBhbnlcclxuICBkZXNjcmlwdGlvbjogYW55XHJcbiAgZmlsdGVyR2V0RmVhdHVyZUluZm86IGFueVxyXG4gIGZpbHRlckdldE1hcDogYW55XHJcbiAgZmlsdGVyU2VsZWN0YWJsZTogYW55XHJcbiAgaXNGb2xkZXI6IGFueVxyXG4gIG1ldGFkYXRhVVJMOiBhbnlcclxuICBvcmRlcjogYW55XHJcbiAgcGFyZW50OiBhbnlcclxuICBxdWVyeWFibGVBY3RpdmU6IGFueVxyXG4gIHJhZGlvOiBhbnlcclxuICB0b29sdGlwOiBhbnlcclxuICBfbGlua3M6IGFueVxyXG4gIHN0YXR1czogYW55XHJcbn1cclxuXHJcbi8qKiBGbGF0IG5vZGUgd2l0aCBleHBhbmRhYmxlIGFuZCBsZXZlbCBpbmZvcm1hdGlvbiAqL1xyXG5leHBvcnQgY2xhc3MgRmlsZUZsYXROb2RlIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHB1YmxpYyBleHBhbmRhYmxlOiBib29sZWFuLFxyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZyxcclxuICAgIHB1YmxpYyBsZXZlbDogbnVtYmVyLFxyXG4gICAgcHVibGljIHR5cGU6IGFueSxcclxuICAgIHB1YmxpYyBpZDogc3RyaW5nLFxyXG4gICAgcHVibGljIHN0YXR1czogc3RyaW5nXHJcbiAgKSB7IH1cclxufVxyXG5cclxuXHJcblxyXG4vKipcclxuICogRmlsZSBkYXRhYmFzZSwgaXQgY2FuIGJ1aWxkIGEgdHJlZSBzdHJ1Y3R1cmVkIEpzb24gb2JqZWN0IGZyb20gc3RyaW5nLlxyXG4gKiBFYWNoIG5vZGUgaW4gSnNvbiBvYmplY3QgcmVwcmVzZW50cyBhIGZpbGUgb3IgYSBkaXJlY3RvcnkuIEZvciBhIGZpbGUsIGl0IGhhcyBuYW1lIGFuZCB0eXBlLlxyXG4gKiBGb3IgYSBkaXJlY3RvcnksIGl0IGhhcyBuYW1lIGFuZCBjaGlsZHJlbiAoYSBsaXN0IG9mIGZpbGVzIG9yIGRpcmVjdG9yaWVzKS5cclxuICogVGhlIGlucHV0IHdpbGwgYmUgYSBqc29uIG9iamVjdCBzdHJpbmcsIGFuZCB0aGUgb3V0cHV0IGlzIGEgbGlzdCBvZiBgRmlsZU5vZGVgIHdpdGggbmVzdGVkXHJcbiAqIHN0cnVjdHVyZS5cclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEZpbGVEYXRhYmFzZSB7XHJcbiAgZGF0YUNoYW5nZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8RmlsZU5vZGVbXT4oW10pO1xyXG4gIGdldCBkYXRhKCk6IGFueSB7IHJldHVybiB0aGlzLmRhdGFDaGFuZ2UudmFsdWU7IH1cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gIH1cclxuXHJcbiAgaW5pdGlhbGl6ZShkYXRhT2JqLCBhbGxOZXdFbGVtZW50cykge1xyXG5cclxuICAgIC8vIEJ1aWxkIHRoZSB0cmVlIG5vZGVzIGZyb20gSnNvbiBvYmplY3QuIFRoZSByZXN1bHQgaXMgYSBsaXN0IG9mIGBGaWxlTm9kZWAgd2l0aCBuZXN0ZWRcclxuICAgIC8vICAgICBmaWxlIG5vZGUgYXMgY2hpbGRyZW4uXHJcbiAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZEZpbGVUcmVlKGRhdGFPYmosIDAsIGFsbE5ld0VsZW1lbnRzKTtcclxuXHJcbiAgICAvLyBOb3RpZnkgdGhlIGNoYW5nZS5cclxuICAgIHRoaXMuZGF0YUNoYW5nZS5uZXh0KGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQnVpbGQgdGhlIGZpbGUgc3RydWN0dXJlIHRyZWUuIFRoZSBgdmFsdWVgIGlzIHRoZSBKc29uIG9iamVjdCwgb3IgYSBzdWItdHJlZSBvZiBhIEpzb24gb2JqZWN0LlxyXG4gICAqIFRoZSByZXR1cm4gdmFsdWUgaXMgdGhlIGxpc3Qgb2YgYEZpbGVOb2RlYC5cclxuICAgKi9cclxuICBidWlsZEZpbGVUcmVlKGFycmF5VHJlZU5vZGVzOiBhbnlbXSwgbGV2ZWw6IG51bWJlciwgYWxsTmV3RWxlbWVudHM6IGFueSkge1xyXG4gICAgdmFyIG1hcCA9IHt9O1xyXG4gICAgaWYoYXJyYXlUcmVlTm9kZXMubGVuZ3RoPT09MClcclxuICAgIHtcclxuICAgICAgbGV0IHJvb3QgPSB7XHJcbiAgICAgICAgaXNGb2xkZXI6dHJ1ZSxcclxuICAgICAgICBuYW1lOidSb290JyxcclxuICAgICAgICB0eXBlOiAnZm9sZGVyJyxcclxuICAgICAgICBpc1Jvb3Q6IHRydWUsXHJcbiAgICAgICAgb3JkZXI6IDAsXHJcbiAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgIGlkOjBcclxuICAgICAgfVxyXG4gICAgICBtYXBbJ3Jvb3QnXT1yb290O1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgYXJyYXlUcmVlTm9kZXMuZm9yRWFjaCgodHJlZU5vZGUpID0+IHtcclxuICAgICAgICB2YXIgb2JqID0gdHJlZU5vZGU7XHJcbiAgICAgICAgb2JqLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgb2JqLnR5cGU9ICh0cmVlTm9kZS5pc0ZvbGRlcik/IFwiZm9sZGVyXCIgOiBcIm5vZGVcIjtcclxuICAgICAgICBpZihhbGxOZXdFbGVtZW50cykge1xyXG4gICAgICAgICAgb2JqLnN0YXR1cz0ncGVuZGluZ0NyZWF0aW9uJztcclxuICAgICAgICAgIGlmKG9iai5pZCkgeyBvYmouaWQgPSBvYmouaWQgKiAtMSB9XHJcbiAgICAgICAgICBpZihvYmoucGFyZW50KSB7IG9iai5wYXJlbnQgPSBvYmoucGFyZW50ICogLTEgfVxyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpZighbWFwW29iai5pZF0pIHttYXBbb2JqLmlkXSA9IG9iajt9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIGxldCBwcmV2aW91c0NoaWxkcmVuPSBtYXBbb2JqLmlkXS5jaGlsZHJlblxyXG4gICAgICAgICAgbWFwW29iai5pZF0gPSBvYmo7XHJcbiAgICAgICAgICBtYXBbb2JqLmlkXS5jaGlsZHJlbj1wcmV2aW91c0NoaWxkcmVuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwYXJlbnQgPSBvYmoucGFyZW50IHx8ICdyb290JztcclxuICAgICAgICBpZiAoIW1hcFtwYXJlbnRdKSB7XHJcbiAgICAgICAgICBtYXBbcGFyZW50XSA9IHtcclxuICAgICAgICAgICAgY2hpbGRyZW46IFtdXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBtYXBbcGFyZW50XS5jaGlsZHJlbi5wdXNoKG9iaik7XHJcbiAgICAgIH0pO1xyXG4gICAgICBtYXBbJ3Jvb3QnXS50eXBlPSdmb2xkZXInO1xyXG4gICAgICBtYXBbJ3Jvb3QnXS5uYW1lPSdSb290JztcclxuICAgICAgbWFwWydyb290J10ub3JkZXI9MDtcclxuICAgICAgbWFwWydyb290J10uaXNGb2xkZXI9dHJ1ZTtcclxuICAgICAgbWFwWydyb290J10uaXNSb290PXRydWU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJldHVybiBtYXBbJ3Jvb3QnXTtcclxuICB9XHJcbiAgXHJcblxyXG4gIGRlbGV0ZUl0ZW0obm9kZTogRmlsZU5vZGUsIGNoYW5nZWREYXRhOmFueSkge1xyXG4gICAgdGhpcy5kZWxldGVOb2RlKGNoYW5nZWREYXRhLmNoaWxkcmVuLCBub2RlKTtcclxuICAgIHRoaXMuZGF0YUNoYW5nZS5uZXh0KGNoYW5nZWREYXRhKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZU5vZGUobm9kZXM6IEZpbGVOb2RlW10sIG5vZGVUb0RlbGV0ZTogRmlsZU5vZGUpIHtcclxuICAgIGNvbnN0IGluZGV4ID0gbm9kZXMuaW5kZXhPZihub2RlVG9EZWxldGUsIDApO1xyXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgbm9kZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XHJcbiAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4gJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLmRlbGV0ZU5vZGUobm9kZS5jaGlsZHJlbiwgbm9kZVRvRGVsZXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0T3JkZXIoZGF0YTogYW55W10pe1xyXG4gICAgZm9yKGxldCBpPTA7IGk8IGRhdGEubGVuZ3RoOyBpKyspe1xyXG4gICAgICBkYXRhW2ldLm9yZGVyPWk7XHJcbiAgICAgIGlmKCEgZGF0YVtpXS5zdGF0dXMpIHsgZGF0YVtpXS5zdGF0dXM9XCJNb2RpZmllZFwiOyB9IFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgIH1cclxuXHJcbiAgY29weVBhc3RlSXRlbShmcm9tOiBGaWxlTm9kZSwgdG86IEZpbGVOb2RlLCBjaGFuZ2VkRGF0YTphbnkpOiBGaWxlTm9kZSB7XHJcbiAgICBjb25zdCBuZXdJdGVtID0gdGhpcy5pbnNlcnRJdGVtKHRvLCBmcm9tLGNoYW5nZWREYXRhKTtcclxuXHJcbiAgICByZXR1cm4gbmV3SXRlbTtcclxuICB9XHJcblxyXG4gIGNvcHlQYXN0ZUl0ZW1BYm92ZShmcm9tOiBGaWxlTm9kZSwgdG86IEZpbGVOb2RlLGNoYW5nZWREYXRhOmFueSk6IEZpbGVOb2RlIHtcclxuICAgIGNvbnN0IG5ld0l0ZW0gPSB0aGlzLmluc2VydEl0ZW1BYm92ZSh0bywgZnJvbSxjaGFuZ2VkRGF0YSk7XHJcblxyXG4gICAgcmV0dXJuIG5ld0l0ZW07XHJcbiAgfVxyXG5cclxuICBjb3B5UGFzdGVJdGVtQmVsb3coZnJvbTogRmlsZU5vZGUsIHRvOiBGaWxlTm9kZSxjaGFuZ2VkRGF0YTphbnkpOiBGaWxlTm9kZSB7XHJcbiAgICBjb25zdCBuZXdJdGVtID0gdGhpcy5pbnNlcnRJdGVtQmVsb3codG8sIGZyb20sY2hhbmdlZERhdGEpO1xyXG5cclxuICAgIHJldHVybiBuZXdJdGVtO1xyXG4gIH1cclxuXHJcbiAgLyoqIEFkZCBhbiBpdGVtIHRvIHRvLWRvIGxpc3QgKi9cclxuICBcclxuICBnZXROZXdJdGVtKG5vZGU6RmlsZU5vZGUpe1xyXG4gICAgY29uc3QgbmV3SXRlbSA9IHtcclxuICAgICAgbmFtZTogbm9kZS5uYW1lLFxyXG4gICAgICBjaGlsZHJlbjogbm9kZS5jaGlsZHJlbixcclxuICAgICAgdHlwZTogbm9kZS50eXBlLFxyXG4gICAgICBpZDogbm9kZS5pZCwgXHJcbiAgICAgIGFjdGl2ZTogbm9kZS5hY3RpdmUsXHJcbiAgICAgIGNhcnRvZ3JhcGh5SWQ6IG5vZGUuY2FydG9ncmFwaHlJZCxcclxuICAgICAgY2FydG9ncmFwaHlOYW1lOiBub2RlLmNhcnRvZ3JhcGh5TmFtZSxcclxuICAgICAgZGF0YXNldFVSTDogbm9kZS5kYXRhc2V0VVJMLFxyXG4gICAgICBkZXNjcmlwdGlvbjogbm9kZS5kZXNjcmlwdGlvbixcclxuICAgICAgZmlsdGVyR2V0RmVhdHVyZUluZm86IG5vZGUuZmlsdGVyR2V0RmVhdHVyZUluZm8sXHJcbiAgICAgIGZpbHRlckdldE1hcDogbm9kZS5maWx0ZXJHZXRNYXAsXHJcbiAgICAgIGZpbHRlclNlbGVjdGFibGU6IG5vZGUuZmlsdGVyU2VsZWN0YWJsZSxcclxuICAgICAgaXNGb2xkZXI6IG5vZGUuaXNGb2xkZXIsXHJcbiAgICAgIG1ldGFkYXRhVVJMOiBub2RlLm1ldGFkYXRhVVJMLFxyXG4gICAgICBvcmRlcjogbm9kZS5vcmRlcixcclxuICAgICAgcXVlcnlhYmxlQWN0aXZlOiBub2RlLnF1ZXJ5YWJsZUFjdGl2ZSxcclxuICAgICAgcmFkaW86IG5vZGUucmFkaW8sXHJcbiAgICAgIHRvb2x0aXA6IG5vZGUudG9vbHRpcCxcclxuICAgICAgX2xpbmtzOiBub2RlLl9saW5rcyB9IGFzIEZpbGVOb2RlO1xyXG5cclxuICAgIHJldHVybiBuZXdJdGVtO1xyXG4gIH1cclxuXHJcbiAgaW5zZXJ0SXRlbShwYXJlbnQ6IEZpbGVOb2RlLCBub2RlOiBGaWxlTm9kZSxjaGFuZ2VkRGF0YTphbnkpOiBGaWxlTm9kZSB7XHJcbiAgICBpZiAoIXBhcmVudC5jaGlsZHJlbikge1xyXG4gICAgICBwYXJlbnQuY2hpbGRyZW4gPSBbXTtcclxuICAgIH1cclxuICAgIGNvbnN0IG5ld0l0ZW0gPSB0aGlzLmdldE5ld0l0ZW0obm9kZSlcclxuICAgIG5ld0l0ZW0ucGFyZW50ID0gcGFyZW50PT1udWxsIHx8IHBhcmVudC5pZD09dW5kZWZpbmVkP251bGw6cGFyZW50LmlkO1xyXG5cclxuICAgIHBhcmVudC5jaGlsZHJlbi5wdXNoKG5ld0l0ZW0pO1xyXG4gICAgdGhpcy5zZXRPcmRlcihwYXJlbnQuY2hpbGRyZW4pXHJcbiAgICB0aGlzLmRhdGFDaGFuZ2UubmV4dChjaGFuZ2VkRGF0YSk7XHJcbiAgICByZXR1cm4gbmV3SXRlbTtcclxuICB9XHJcblxyXG4gIGluc2VydEl0ZW1BYm92ZShub2RlOiBGaWxlTm9kZSwgbm9kZURyYWc6IEZpbGVOb2RlLGNoYW5nZWREYXRhOmFueSk6IEZpbGVOb2RlIHtcclxuICAgIGNvbnN0IHBhcmVudE5vZGUgPSB0aGlzLmdldFBhcmVudEZyb21Ob2Rlcyhub2RlLGNoYW5nZWREYXRhKTtcclxuICAgIGNvbnN0IG5ld0l0ZW0gPSB0aGlzLmdldE5ld0l0ZW0obm9kZURyYWcpXHJcbiAgICBuZXdJdGVtLnBhcmVudCA9IHBhcmVudE5vZGU9PW51bGwgfHwgcGFyZW50Tm9kZS5pZD09dW5kZWZpbmVkP251bGw6cGFyZW50Tm9kZS5pZDtcclxuICBcclxuICAgIGlmIChwYXJlbnROb2RlICE9IG51bGwpIHtcclxuICAgICAgcGFyZW50Tm9kZS5jaGlsZHJlbi5zcGxpY2UocGFyZW50Tm9kZS5jaGlsZHJlbi5pbmRleE9mKG5vZGUpLCAwLCBuZXdJdGVtKTtcclxuICAgICAgdGhpcy5zZXRPcmRlcihwYXJlbnROb2RlLmNoaWxkcmVuKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2hhbmdlZERhdGEuY2hpbGRyZW4uc3BsaWNlKGNoYW5nZWREYXRhLmNoaWxkcmVuLmluZGV4T2Yobm9kZSksIDAsIG5ld0l0ZW0pO1xyXG4gICAgICB0aGlzLnNldE9yZGVyKGNoYW5nZWREYXRhLmNoaWxkcmVuKVxyXG4gICAgfVxyXG4gICAgdGhpcy5kYXRhQ2hhbmdlLm5leHQoY2hhbmdlZERhdGEpO1xyXG4gICAgcmV0dXJuIG5ld0l0ZW07XHJcbiAgfVxyXG5cclxuICBpbnNlcnRJdGVtQmVsb3cobm9kZTogRmlsZU5vZGUsIG5vZGVEcmFnOiBGaWxlTm9kZSxjaGFuZ2VkRGF0YTphbnkpOiBGaWxlTm9kZSB7XHJcbiAgICBjb25zdCBwYXJlbnROb2RlID0gdGhpcy5nZXRQYXJlbnRGcm9tTm9kZXMobm9kZSxjaGFuZ2VkRGF0YSk7XHJcbiAgIFxyXG4gICAgY29uc3QgbmV3SXRlbSA9IHRoaXMuZ2V0TmV3SXRlbShub2RlRHJhZylcclxuICAgIG5ld0l0ZW0ucGFyZW50ID0gcGFyZW50Tm9kZT09bnVsbCB8fCBwYXJlbnROb2RlLmlkPT11bmRlZmluZWQ/bnVsbDpwYXJlbnROb2RlLmlkO1xyXG5cclxuICAgIGlmIChwYXJlbnROb2RlICE9IG51bGwpIHtcclxuICAgICAgcGFyZW50Tm9kZS5jaGlsZHJlbi5zcGxpY2UocGFyZW50Tm9kZS5jaGlsZHJlbi5pbmRleE9mKG5vZGUpICsgMSwgMCwgbmV3SXRlbSk7XHJcbiAgICAgIHRoaXMuc2V0T3JkZXIocGFyZW50Tm9kZS5jaGlsZHJlbilcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNoYW5nZWREYXRhLmNoaWxkcmVuLnNwbGljZShjaGFuZ2VkRGF0YS5jaGlsZHJlbi5pbmRleE9mKG5vZGUpICsgMSwgMCwgbmV3SXRlbSk7XHJcbiAgICAgIHRoaXMuc2V0T3JkZXIoY2hhbmdlZERhdGEuY2hpbGRyZW4pXHJcbiAgICB9XHJcbiAgICB0aGlzLmRhdGFDaGFuZ2UubmV4dChjaGFuZ2VkRGF0YSk7XHJcbiAgICByZXR1cm4gbmV3SXRlbTtcclxuICB9XHJcblxyXG4gIFxyXG4gIGdldFBhcmVudEZyb21Ob2Rlcyhub2RlOiBGaWxlTm9kZSxjaGFuZ2VkRGF0YTphbnkpOiBGaWxlTm9kZSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYW5nZWREYXRhLmNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnRSb290ID0gIGNoYW5nZWREYXRhLmNoaWxkcmVuW2ldO1xyXG4gICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmdldFBhcmVudChjdXJyZW50Um9vdCwgbm9kZSk7XHJcbiAgICAgIGlmIChwYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBwYXJlbnQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgXHJcbiAgZ2V0UGFyZW50KGN1cnJlbnRSb290OiBGaWxlTm9kZSwgbm9kZTogRmlsZU5vZGUpOiBGaWxlTm9kZSB7XHJcbiAgICBpZiAoY3VycmVudFJvb3QuY2hpbGRyZW4gJiYgY3VycmVudFJvb3QuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRSb290LmNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgY29uc3QgY2hpbGQgPSBjdXJyZW50Um9vdC5jaGlsZHJlbltpXTtcclxuICAgICAgICBpZiAoY2hpbGQgPT09IG5vZGUpIHtcclxuICAgICAgICAgIHJldHVybiBjdXJyZW50Um9vdDtcclxuICAgICAgICB9IGVsc2UgaWYgKGNoaWxkLmNoaWxkcmVuICYmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50KGNoaWxkLCBub2RlKTtcclxuICAgICAgICAgIGlmIChwYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIEB0aXRsZSBUcmVlIHdpdGggZmxhdCBub2Rlc1xyXG4gKi9cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtZGF0YS10cmVlJyxcclxuICB0ZW1wbGF0ZVVybDogJ2RhdGEtdHJlZS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ2RhdGEtdHJlZS5jb21wb25lbnQuc2NzcyddLFxyXG4gIHByb3ZpZGVyczogW0ZpbGVEYXRhYmFzZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIERhdGFUcmVlQ29tcG9uZW50IHtcclxuICBAT3V0cHV0KCkgY3JlYXRlTm9kZTogRXZlbnRFbWl0dGVyPGFueT47XHJcbiAgQE91dHB1dCgpIGNyZWF0ZUZvbGRlcjogRXZlbnRFbWl0dGVyPGFueT47XHJcbiAgQE91dHB1dCgpIGVtaXROb2RlOiBFdmVudEVtaXR0ZXI8YW55PjtcclxuICBAT3V0cHV0KCkgZW1pdEFsbE5vZGVzOiBFdmVudEVtaXR0ZXI8YW55PjtcclxuICBAT3V0cHV0KCkgbG9hZEJ1dHRvbkNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxhbnk+O1xyXG4gIEBJbnB1dCgpIGV2ZW50Tm9kZVVwZGF0ZWRTdWJzY3JpcHRpb246IE9ic2VydmFibGUgPGFueT4gO1xyXG4gIEBJbnB1dCgpIGV2ZW50Q3JlYXRlTm9kZVN1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZSA8YW55PiA7XHJcbiAgQElucHV0KCkgZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlIDxhbnk+IDtcclxuICBASW5wdXQoKSBldmVudFJlZnJlc2hTdWJzY3JpcHRpb246IE9ic2VydmFibGUgPGFueT4gO1xyXG4gIEBJbnB1dCgpIGxvYWREYXRhQnV0dG9uOiBPYnNlcnZhYmxlIDxhbnk+IDtcclxuICBwcml2YXRlIF9ldmVudE5vZGVVcGRhdGVkU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgcHJpdmF0ZSBfZXZlbnRDcmVhdGVOb2RlU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgcHJpdmF0ZSBfZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgcHJpdmF0ZSBfZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgdHJlZUNvbnRyb2w6IEZsYXRUcmVlQ29udHJvbDxGaWxlRmxhdE5vZGU+O1xyXG4gIHRyZWVGbGF0dGVuZXI6IE1hdFRyZWVGbGF0dGVuZXI8RmlsZU5vZGUsIEZpbGVGbGF0Tm9kZT47XHJcbiAgZGF0YVNvdXJjZTogTWF0VHJlZUZsYXREYXRhU291cmNlPEZpbGVOb2RlLCBGaWxlRmxhdE5vZGU+O1xyXG4gIC8vIGV4cGFuc2lvbiBtb2RlbCB0cmFja3MgZXhwYW5zaW9uIHN0YXRlXHJcbiAgZXhwYW5zaW9uTW9kZWwgPSBuZXcgU2VsZWN0aW9uTW9kZWw8c3RyaW5nPih0cnVlKTtcclxuICBkcmFnZ2luZyA9IGZhbHNlO1xyXG4gIGV4cGFuZFRpbWVvdXQ6IGFueTtcclxuICBleHBhbmREZWxheSA9IDEwMDA7XHJcbiAgdmFsaWRhdGVEcm9wID0gZmFsc2U7XHJcbiAgdHJlZURhdGE6IGFueTtcclxuXHJcbiAgQElucHV0KCkgZ2V0QWxsOiAoKSA9PiBPYnNlcnZhYmxlPGFueT47XHJcbiAgQElucHV0KCkgYWxsTmV3RWxlbWVudHM6IGFueTtcclxuXHJcblxyXG4gIC8qIERyYWcgYW5kIGRyb3AgKi9cclxuICBkcmFnTm9kZTogYW55O1xyXG4gIGRyYWdOb2RlRXhwYW5kT3ZlcldhaXRUaW1lTXMgPSAxNTAwO1xyXG4gIGRyYWdOb2RlRXhwYW5kT3Zlck5vZGU6IGFueTtcclxuICBkcmFnTm9kZUV4cGFuZE92ZXJUaW1lOiBudW1iZXI7XHJcbiAgZHJhZ05vZGVFeHBhbmRPdmVyQXJlYTogc3RyaW5nO1xyXG4gIEBWaWV3Q2hpbGQoJ2VtcHR5SXRlbScpIGVtcHR5SXRlbTogRWxlbWVudFJlZjtcclxuXHJcbiAgICAvKiogTWFwIGZyb20gZmxhdCBub2RlIHRvIG5lc3RlZCBub2RlLiBUaGlzIGhlbHBzIHVzIGZpbmRpbmcgdGhlIG5lc3RlZCBub2RlIHRvIGJlIG1vZGlmaWVkICovXHJcbiAgICBmbGF0Tm9kZU1hcCA9IG5ldyBNYXA8RmlsZUZsYXROb2RlLCBGaWxlTm9kZT4oKTtcclxuXHJcbiAgICAvKiogTWFwIGZyb20gbmVzdGVkIG5vZGUgdG8gZmxhdHRlbmVkIG5vZGUuIFRoaXMgaGVscHMgdXMgdG8ga2VlcCB0aGUgc2FtZSBvYmplY3QgZm9yIHNlbGVjdGlvbiAqL1xyXG4gICAgbmVzdGVkTm9kZU1hcCA9IG5ldyBNYXA8RmlsZU5vZGUsIEZpbGVGbGF0Tm9kZT4oKTtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkYXRhYmFzZTogRmlsZURhdGFiYXNlKSB7XHJcbiAgICB0aGlzLmVtaXROb2RlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5jcmVhdGVOb2RlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5jcmVhdGVGb2xkZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmVtaXRBbGxOb2RlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMubG9hZEJ1dHRvbkNsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLnRyZWVGbGF0dGVuZXIgPSBuZXcgTWF0VHJlZUZsYXR0ZW5lcih0aGlzLnRyYW5zZm9ybWVyLCB0aGlzLl9nZXRMZXZlbCxcclxuICAgICAgdGhpcy5faXNFeHBhbmRhYmxlLCB0aGlzLl9nZXRDaGlsZHJlbik7XHJcbiAgICB0aGlzLnRyZWVDb250cm9sID0gbmV3IEZsYXRUcmVlQ29udHJvbDxGaWxlRmxhdE5vZGU+KHRoaXMuX2dldExldmVsLCB0aGlzLl9pc0V4cGFuZGFibGUpO1xyXG4gICAgdGhpcy5kYXRhU291cmNlID0gbmV3IE1hdFRyZWVGbGF0RGF0YVNvdXJjZSh0aGlzLnRyZWVDb250cm9sLCB0aGlzLnRyZWVGbGF0dGVuZXIpO1xyXG4gXHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpe1xyXG5cclxuICAgIGlmKHRoaXMuZXZlbnROb2RlVXBkYXRlZFN1YnNjcmlwdGlvbilcclxuICAgIHtcclxuICAgICAgdGhpcy5ldmVudE5vZGVVcGRhdGVkU3Vic2NyaXB0aW9uLnN1YnNjcmliZShcclxuICAgICAgICAobm9kZSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy51cGRhdGVOb2RlKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG4gICAgfVxyXG4gICAgaWYodGhpcy5ldmVudENyZWF0ZU5vZGVTdWJzY3JpcHRpb24pXHJcbiAgICB7XHJcbiAgICAgIHRoaXMuZXZlbnRDcmVhdGVOb2RlU3Vic2NyaXB0aW9uLnN1YnNjcmliZShcclxuICAgICAgICAobm9kZSkgPT4ge1xyXG4gICAgICAgICAgaWYobm9kZS5pc0ZvbGRlcikgdGhpcy5jcmVhdGVOZXdGb2xkZXIobm9kZSk7XHJcbiAgICAgICAgICBlbHNlIHRoaXMuY3JlYXRlTmV3Tm9kZShub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcblxyXG4gICAgaWYgKHRoaXMuZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoZXZlbnQ6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHRoaXMuZW1pdEFsbFJvd3MoZXZlbnQpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5ldmVudFJlZnJlc2hTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5fZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uID0gdGhpcy5ldmVudFJlZnJlc2hTdWJzY3JpcHRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLmdldEVsZW1lbnRzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0aGlzLmdldEVsZW1lbnRzKCk7XHJcbiAgfVxyXG5cclxuICBsb2FkRGF0YUJ1dHRvbkNsaWNrZWQoKXtcclxuICAgIGNvbnN0IGRhdGFUb0VtaXQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YVNvdXJjZS5kYXRhKSlcclxuICAgIGxldCBhbGxSb3dzID0gdGhpcy5nZXRBbGxDaGlsZHJlbihkYXRhVG9FbWl0KTsgXHJcbiAgICB0aGlzLmxvYWRCdXR0b25DbGlja2VkLmVtaXQoYWxsUm93cylcclxuICB9XHJcblxyXG4gIGdldEVsZW1lbnRzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5nZXRBbGwoKVxyXG4gICAgLnN1YnNjcmliZSgoaXRlbXMpID0+IHtcclxuICAgICAgdGhpcy50cmVlRGF0YSA9IGl0ZW1zO1xyXG4gICAgICB0aGlzLmRhdGFiYXNlLmluaXRpYWxpemUodGhpcy50cmVlRGF0YSwgdGhpcy5hbGxOZXdFbGVtZW50cyk7XHJcbiAgICAgIHRoaXMuZGF0YWJhc2UuZGF0YUNoYW5nZS5zdWJzY3JpYmUoZGF0YSA9PiB0aGlzLnJlYnVpbGRUcmVlRm9yRGF0YShbZGF0YV0pKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIHRyYW5zZm9ybWVyID0gKG5vZGU6IEZpbGVOb2RlLCBsZXZlbDogbnVtYmVyKSA9PiB7XHJcbiAgICBjb25zdCBleGlzdGluZ05vZGUgPSB0aGlzLm5lc3RlZE5vZGVNYXAuZ2V0KG5vZGUpO1xyXG4gICAgY29uc3QgZmxhdE5vZGUgPSBleGlzdGluZ05vZGUgJiYgZXhpc3RpbmdOb2RlLm5hbWUgPT09IG5vZGUubmFtZVxyXG4gICAgICA/IGV4aXN0aW5nTm9kZVxyXG4gICAgICA6IG5ldyBGaWxlRmxhdE5vZGUoKG5vZGUuY2hpbGRyZW4gJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwKSxub2RlLm5hbWUsbGV2ZWwsbm9kZS50eXBlLG5vZGUuaWQsbm9kZS5zdGF0dXMpO1xyXG5cclxuICAgIHRoaXMuZmxhdE5vZGVNYXAuc2V0KGZsYXROb2RlLCBub2RlKTtcclxuICAgIHRoaXMubmVzdGVkTm9kZU1hcC5zZXQobm9kZSwgZmxhdE5vZGUpO1xyXG4gICAgcmV0dXJuIGZsYXROb2RlO1xyXG4gIFxyXG4gIH1cclxuICBwcml2YXRlIF9nZXRMZXZlbCA9IChub2RlOiBGaWxlRmxhdE5vZGUpID0+IG5vZGUubGV2ZWw7XHJcbiAgcHJpdmF0ZSBfaXNFeHBhbmRhYmxlID0gKG5vZGU6IEZpbGVGbGF0Tm9kZSkgPT4gbm9kZS5leHBhbmRhYmxlO1xyXG4gIHByaXZhdGUgX2dldENoaWxkcmVuID0gKG5vZGU6IEZpbGVOb2RlKTogT2JzZXJ2YWJsZTxGaWxlTm9kZVtdPiA9PiBvYnNlcnZhYmxlT2Yobm9kZS5jaGlsZHJlbik7XHJcbiAgaGFzQ2hpbGQgPSAoXzogbnVtYmVyLCBfbm9kZURhdGE6IEZpbGVGbGF0Tm9kZSkgPT4gX25vZGVEYXRhLmV4cGFuZGFibGU7XHJcblxyXG5cclxuICAvKipcclxuICAgKiBUaGlzIGNvbnN0cnVjdHMgYW4gYXJyYXkgb2Ygbm9kZXMgdGhhdCBtYXRjaGVzIHRoZSBET01cclxuICAgKi9cclxuICB2aXNpYmxlTm9kZXMoKTogRmlsZU5vZGVbXSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICBmdW5jdGlvbiBhZGRFeHBhbmRlZENoaWxkcmVuKG5vZGU6IEZpbGVOb2RlLCBleHBhbmRlZDogc3RyaW5nW10pIHtcclxuICAgICAgcmVzdWx0LnB1c2gobm9kZSk7XHJcbiAgICAgIGlmIChleHBhbmRlZC5pbmRleE9mKG5vZGUuaWQpICE9IC0xKSB7XHJcbiAgICAgICAgbm9kZS5jaGlsZHJlbi5tYXAoKGNoaWxkKSA9PiBhZGRFeHBhbmRlZENoaWxkcmVuKGNoaWxkLCBleHBhbmRlZCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLmRhdGFTb3VyY2UuZGF0YS5mb3JFYWNoKChub2RlKSA9PiB7XHJcbiAgICAgIGFkZEV4cGFuZGVkQ2hpbGRyZW4obm9kZSwgdGhpcy5leHBhbnNpb25Nb2RlbC5zZWxlY3RlZCk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuXHJcbiAgIGZpbmROb2RlU2libGluZ3MoYXJyOiBBcnJheTxhbnk+LCBpZDogc3RyaW5nKTogQXJyYXk8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0LCBzdWJSZXN1bHQ7XHJcbiAgICBhcnIuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS5pZCA9PT0gaWQpIHtcclxuICAgICAgICByZXN1bHQgPSBhcnI7XHJcbiAgICAgIH0gZWxzZSBpZiAoaXRlbS5jaGlsZHJlbikge1xyXG4gICAgICAgIHN1YlJlc3VsdCA9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhpdGVtLmNoaWxkcmVuLCBpZCk7XHJcbiAgICAgICAgaWYgKHN1YlJlc3VsdCkgcmVzdWx0ID0gc3ViUmVzdWx0O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcblxyXG4gIH1cclxuXHJcblxyXG4gIGhhbmRsZURyYWdTdGFydChldmVudCwgbm9kZSkge1xyXG4gICAgLy8gUmVxdWlyZWQgYnkgRmlyZWZveCAoaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTkwNTUyNjQvd2h5LWRvZXNudC1odG1sNS1kcmFnLWFuZC1kcm9wLXdvcmstaW4tZmlyZWZveClcclxuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCdmb28nLCAnYmFyJyk7XHJcbiAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKHRoaXMuZW1wdHlJdGVtLm5hdGl2ZUVsZW1lbnQsIDAsIDApO1xyXG4gICAgdGhpcy5kcmFnTm9kZSA9IG5vZGU7XHJcbiAgICB0aGlzLnRyZWVDb250cm9sLmNvbGxhcHNlKG5vZGUpO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlRHJhZ092ZXIoZXZlbnQsIG5vZGUpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgLy8gSGFuZGxlIG5vZGUgZXhwYW5kXHJcbiAgICBpZiAobm9kZSA9PT0gdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJOb2RlKSB7XHJcbiAgICAgIGlmICh0aGlzLmRyYWdOb2RlICE9PSBub2RlICYmICF0aGlzLnRyZWVDb250cm9sLmlzRXhwYW5kZWQobm9kZSkpIHtcclxuICAgICAgICBpZiAoKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJUaW1lKSA+IHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyV2FpdFRpbWVNcykge1xyXG4gICAgICAgICAgdGhpcy50cmVlQ29udHJvbC5leHBhbmQobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3Zlck5vZGUgPSBub2RlO1xyXG4gICAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBIYW5kbGUgZHJhZyBhcmVhXHJcbiAgICBjb25zdCBwZXJjZW50YWdlWCA9IGV2ZW50Lm9mZnNldFggLyBldmVudC50YXJnZXQuY2xpZW50V2lkdGg7XHJcbiAgICBjb25zdCBwZXJjZW50YWdlWSA9IGV2ZW50Lm9mZnNldFkgLyBldmVudC50YXJnZXQuY2xpZW50SGVpZ2h0O1xyXG4gICAgaWYgKHBlcmNlbnRhZ2VZIDwgMC4yNSkge1xyXG4gICAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlckFyZWEgPSAnYWJvdmUnO1xyXG4gICAgfSBlbHNlIGlmIChwZXJjZW50YWdlWSA+IDAuNzUpIHtcclxuICAgICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJBcmVhID0gJ2JlbG93JztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyQXJlYSA9ICdjZW50ZXInO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlRHJvcChldmVudCwgbm9kZSkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGNvbnN0IGNoYW5nZWREYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGFTb3VyY2UuZGF0YSkpXHJcblxyXG4gICAgXHJcbiAgICBsZXQgdG9GbGF0Tm9kZTtcclxuICAgIGlmKG5vZGUuaWQgPT09IHVuZGVmaW5lZCkgeyB0b0ZsYXROb2RlPWNoYW5nZWREYXRhWzBdIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHRvRmxhdE5vZGU9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhjaGFuZ2VkRGF0YVswXS5jaGlsZHJlbiwgbm9kZS5pZCkuZmluZChub2RlQWN0ID0+IG5vZGVBY3QuaWQgPT09IG5vZGUuaWQpO1xyXG4gICAgfVxyXG4gICAgbGV0IGZyb21GbGF0Tm9kZTtcclxuICAgIGlmKCB0aGlzLmRyYWdOb2RlLmlkID09PSB1bmRlZmluZWQpIHsgZnJvbUZsYXROb2RlPWNoYW5nZWREYXRhWzBdIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGZyb21GbGF0Tm9kZSA9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhjaGFuZ2VkRGF0YVswXS5jaGlsZHJlbiwgdGhpcy5kcmFnTm9kZS5pZCkuZmluZChub2RlQWN0ID0+IG5vZGVBY3QuaWQgPT09IHRoaXMuZHJhZ05vZGUuaWQpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuZHJhZ05vZGUuc3RhdHVzIT1cInBlbmRpbmdEZWxldGVcIiAmJiBub2RlICE9PSB0aGlzLmRyYWdOb2RlICYmICh0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlckFyZWEgIT09ICdjZW50ZXInIHx8ICh0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlckFyZWEgPT09ICdjZW50ZXInICYmIHRvRmxhdE5vZGUuaXNGb2xkZXIpKSkge1xyXG4gICAgICBsZXQgbmV3SXRlbTogRmlsZU5vZGU7XHJcblxyXG4gICAgICBpZiAodGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJBcmVhID09PSAnYWJvdmUnKSB7XHJcbiAgICAgICAgbmV3SXRlbSA9IHRoaXMuZGF0YWJhc2UuY29weVBhc3RlSXRlbUFib3ZlKGZyb21GbGF0Tm9kZSx0b0ZsYXROb2RlLGNoYW5nZWREYXRhWzBdKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlckFyZWEgPT09ICdiZWxvdycpIHtcclxuICAgICAgICBuZXdJdGVtID0gdGhpcy5kYXRhYmFzZS5jb3B5UGFzdGVJdGVtQmVsb3coZnJvbUZsYXROb2RlLHRvRmxhdE5vZGUsY2hhbmdlZERhdGFbMF0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG5ld0l0ZW0gPSB0aGlzLmRhdGFiYXNlLmNvcHlQYXN0ZUl0ZW0oZnJvbUZsYXROb2RlLCB0b0ZsYXROb2RlLGNoYW5nZWREYXRhWzBdKTtcclxuICAgICAgfSAgICBcclxuICAgICAgbGV0IHBhcmVudEx2bD10aGlzLnRyZWVDb250cm9sLmRhdGFOb2Rlcy5maW5kKChuKSA9PiBuLmlkID09PSBmcm9tRmxhdE5vZGUuaWQpLmxldmVsO1xyXG4gICAgICBmcm9tRmxhdE5vZGUuY2hpbGRyZW4uZm9yRWFjaChjaGlsZD0+e1xyXG4gICAgICAgIHRoaXMudHJlZUNvbnRyb2wuZGF0YU5vZGVzLmZpbmQoKG4pID0+IG4uaWQgPT09IGNoaWxkLmlkKS5sZXZlbD1wYXJlbnRMdmwrMVxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5kYXRhYmFzZS5kZWxldGVJdGVtKGZyb21GbGF0Tm9kZSxjaGFuZ2VkRGF0YVswXSk7XHJcbiAgICAgIHRoaXMudHJlZUNvbnRyb2wuZXhwYW5kRGVzY2VuZGFudHModGhpcy5uZXN0ZWROb2RlTWFwLmdldChuZXdJdGVtKSk7XHJcbiAgICB9XHJcbiAgIFxyXG4gICAgdGhpcy5kcmFnTm9kZSA9IG51bGw7XHJcbiAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3Zlck5vZGUgPSBudWxsO1xyXG4gICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJUaW1lID0gMDtcclxuICB9XHJcblxyXG4gIGhhbmRsZURyYWdFbmQoZXZlbnQpIHtcclxuICAgIHRoaXMuZHJhZ05vZGUgPSBudWxsO1xyXG4gICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJOb2RlID0gbnVsbDtcclxuICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyVGltZSA9IDA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGUgZm9sbG93aW5nIG1ldGhvZHMgYXJlIGZvciBwZXJzaXN0aW5nIHRoZSB0cmVlIGV4cGFuZCBzdGF0ZVxyXG4gICAqIGFmdGVyIGJlaW5nIHJlYnVpbHRcclxuICAgKi9cclxuXHJcbiAgIHNvcnRCeU9yZGVyKGRhdGE6IGFueVtdKXtcclxuICAgIC8vIGRhdGEuc29ydCgoYSxiKSA9PiBhLm9yZGVyLnRvU3RyaW5nKCkubG9jYWxlQ29tcGFyZSggYi5vcmRlci50b1N0cmluZygpKSk7XHJcbiAgICBkYXRhLnNvcnQoKGEsYikgPT4gKGEub3JkZXIgPiBiLm9yZGVyKSA/IDEgOiAoKGIub3JkZXIgPiBhLm9yZGVyKSA/IC0xIDogMCkpO1xyXG4gICAgZGF0YS5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLmNoaWxkcmVuICYmIGl0ZW0uY2hpbGRyZW4ubGVuZ3RoPjApIHtcclxuICAgICAgICB0aGlzLnNvcnRCeU9yZGVyKGl0ZW0uY2hpbGRyZW4pO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiAgIH1cclxuXHJcbiAgIHNldE9yZGVyKGRhdGE6IGFueVtdKXtcclxuICAgIGZvcihsZXQgaT0wOyBpPCBkYXRhLmxlbmd0aDsgaSsrKXtcclxuICAgICAgZGF0YVtpXS5vcmRlcj1pO1xyXG4gICAgICBpZighIGRhdGFbaV0uc3RhdHVzKSB7IGRhdGFbaV0uc3RhdHVzPVwiTW9kaWZpZWRcIjsgfSBcclxuICAgIH1cclxuICAgIHJldHVybiBkYXRhO1xyXG4gICB9XHJcblxyXG4gIHJlYnVpbGRUcmVlRm9yRGF0YShkYXRhOiBhbnlbXSkge1xyXG4gICAgLy90aGlzLmRhdGFTb3VyY2UuZGF0YSA9IGRhdGE7XHJcbiAgICB0aGlzLnNvcnRCeU9yZGVyKGRhdGEpO1xyXG4gICAgdGhpcy5kYXRhU291cmNlLmRhdGEgPSBbXTtcclxuICAgIHRoaXMuZGF0YVNvdXJjZS5kYXRhID0gZGF0YTtcclxuICAgIHRoaXMudHJlZUNvbnRyb2wuZXhwYW5zaW9uTW9kZWwuc2VsZWN0ZWQuZm9yRWFjaCgobm9kZUFjdCkgPT4ge1xyXG4gICAgICBpZihub2RlQWN0KXtcclxuICAgICAgICBjb25zdCBub2RlID0gdGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXMuZmluZCgobikgPT4gbi5pZCA9PT0gbm9kZUFjdC5pZCk7XHJcbiAgICAgICAgdGhpcy50cmVlQ29udHJvbC5leHBhbmQobm9kZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRQYXJlbnROb2RlKG5vZGU6IEZpbGVGbGF0Tm9kZSk6IEZpbGVGbGF0Tm9kZSB8IG51bGwge1xyXG4gICAgY29uc3QgY3VycmVudExldmVsID0gbm9kZS5sZXZlbDtcclxuICAgIGlmIChjdXJyZW50TGV2ZWwgPCAxKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgc3RhcnRJbmRleCA9IHRoaXMudHJlZUNvbnRyb2wuZGF0YU5vZGVzLmluZGV4T2Yobm9kZSkgLSAxO1xyXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0SW5kZXg7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnROb2RlID0gdGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXNbaV07XHJcbiAgICAgIGlmIChjdXJyZW50Tm9kZS5sZXZlbCA8IGN1cnJlbnRMZXZlbCkge1xyXG4gICAgICAgIHJldHVybiBjdXJyZW50Tm9kZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVOb2RlKG5vZGVVcGRhdGVkKVxyXG4gIHtcclxuICAgIGNvbnN0IGRhdGFUb0NoYW5nZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhU291cmNlLmRhdGEpKVxyXG4gICAgY29uc3Qgc2libGluZ3MgPSB0aGlzLmZpbmROb2RlU2libGluZ3MoZGF0YVRvQ2hhbmdlLCBub2RlVXBkYXRlZC5pZCk7XHJcbiAgICBsZXQgaW5kZXg9IHNpYmxpbmdzLmZpbmRJbmRleChub2RlID0+IG5vZGUuaWQgPT09IG5vZGVVcGRhdGVkLmlkKVxyXG4gICAgc2libGluZ3NbaW5kZXhdPW5vZGVVcGRhdGVkO1xyXG4gICAgdGhpcy5yZWJ1aWxkVHJlZUZvckRhdGEoZGF0YVRvQ2hhbmdlKTtcclxuXHJcbiAgfVxyXG5cclxuICBjcmVhdGVOZXdGb2xkZXIobmV3Rm9sZGVyKVxyXG4gIHtcclxuICAgIG5ld0ZvbGRlci50eXBlPVwiZm9sZGVyXCI7XHJcbiAgICBjb25zdCBkYXRhVG9DaGFuZ2UgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YVNvdXJjZS5kYXRhKSlcclxuICAgIGlmKG5ld0ZvbGRlci5wYXJlbnQgPT09IG51bGwpIHtcclxuICAgICAgbmV3Rm9sZGVyLm9yZGVyPWRhdGFUb0NoYW5nZVswXS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgIGRhdGFUb0NoYW5nZVswXS5jaGlsZHJlbi5wdXNoKG5ld0ZvbGRlcilcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGNvbnN0IHNpYmxpbmdzID0gdGhpcy5maW5kTm9kZVNpYmxpbmdzKGRhdGFUb0NoYW5nZSwgbmV3Rm9sZGVyLnBhcmVudCk7XHJcbiAgICAgIGxldCBpbmRleD0gc2libGluZ3MuZmluZEluZGV4KG5vZGUgPT4gbm9kZS5pZCA9PT0gbmV3Rm9sZGVyLnBhcmVudCk7XHJcbiAgICAgIG5ld0ZvbGRlci5vcmRlcj1zaWJsaW5nc1tpbmRleF0uY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICBzaWJsaW5nc1tpbmRleF0uY2hpbGRyZW4ucHVzaChuZXdGb2xkZXIpXHJcbiAgICB9XHJcbiAgICB0aGlzLnJlYnVpbGRUcmVlRm9yRGF0YShkYXRhVG9DaGFuZ2UpO1xyXG5cclxuICB9XHJcblxyXG4gIGNyZWF0ZU5ld05vZGUobmV3Tm9kZSlcclxuICB7XHJcbiAgICBuZXdOb2RlLnR5cGU9XCJub2RlXCI7XHJcbiAgICBjb25zdCBkYXRhVG9DaGFuZ2UgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YVNvdXJjZS5kYXRhKSlcclxuICAgIGlmKG5ld05vZGUucGFyZW50ID09PSBudWxsKSB7XHJcbiAgICAgIG5ld05vZGUub3JkZXI9ZGF0YVRvQ2hhbmdlWzBdLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgZGF0YVRvQ2hhbmdlWzBdLmNoaWxkcmVuLnB1c2gobmV3Tm9kZSlcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICBjb25zdCBzaWJsaW5ncyA9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhkYXRhVG9DaGFuZ2UsIG5ld05vZGUucGFyZW50KTtcclxuICAgIGxldCBpbmRleD0gc2libGluZ3MuZmluZEluZGV4KG5vZGUgPT4gbm9kZS5pZCA9PT0gbmV3Tm9kZS5wYXJlbnQpO1xyXG4gICAgbmV3Tm9kZS5vcmRlcj1zaWJsaW5nc1tpbmRleF0uY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgc2libGluZ3NbaW5kZXhdLmNoaWxkcmVuLnB1c2gobmV3Tm9kZSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlYnVpbGRUcmVlRm9yRGF0YShkYXRhVG9DaGFuZ2UpO1xyXG5cclxuICB9XHJcblxyXG5cclxuXHJcbiAgb25CdXR0b25DbGlja2VkKGlkLCBidXR0b246IHN0cmluZylcclxuICB7XHJcbiAgICBjb25zdCBjaGFuZ2VkRGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhU291cmNlLmRhdGEpKVxyXG4gICAgY29uc3Qgc2libGluZ3MgPSB0aGlzLmZpbmROb2RlU2libGluZ3MoY2hhbmdlZERhdGEsIGlkKTtcclxuICAgIGxldCBub2RlQ2xpY2tlZD0gc2libGluZ3MuZmluZChub2RlID0+IG5vZGUuaWQgPT09IGlkKTtcclxuICAgIGlmKGJ1dHRvbiA9PT0nZWRpdCcpICB7dGhpcy5lbWl0Tm9kZS5lbWl0KG5vZGVDbGlja2VkKX1cclxuICAgIGVsc2UgaWYoYnV0dG9uID09PSAnbmV3Rm9sZGVyJykge3RoaXMuY3JlYXRlRm9sZGVyLmVtaXQobm9kZUNsaWNrZWQpfVxyXG4gICAgZWxzZSBpZihidXR0b24gPT09ICduZXdOb2RlJykge3RoaXMuY3JlYXRlTm9kZS5lbWl0KCBub2RlQ2xpY2tlZCl9XHJcbiAgICBlbHNlIGlmKGJ1dHRvbiA9PT0gJ2RlbGV0ZScpIHtcclxuICAgICAgLy8gbGV0IGNoaWxkcmVuPSB0aGlzLmdldEFsbENoaWxkcmVuKG5vZGVDbGlja2VkLmNoaWxkcmVuKVxyXG4gICAgICAvLyBjaGlsZHJlbi5mb3JFYWNoKGNoaWxkcmVuID0+IHtcclxuICAgICAgLy8gICBjaGlsZHJlbi5zdGF0dXM9J3BlbmRpbmdEZWxldGUnO1xyXG4gICAgICAvLyB9KTtcclxuICAgICAgdGhpcy5kZWxldGVDaGlsZHJlbihub2RlQ2xpY2tlZC5jaGlsZHJlbik7XHJcbiAgICAgIC8vIG5vZGVDbGlja2VkLmNoaWxkcmVuPWNoaWxkcmVuXHJcbiAgICAgIG5vZGVDbGlja2VkLnN0YXR1cz0ncGVuZGluZ0RlbGV0ZSdcclxuICAgICAgXHJcbiAgICAgIHRoaXMucmVidWlsZFRyZWVGb3JEYXRhKGNoYW5nZWREYXRhKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBlbWl0QWxsUm93cyhldmVudClcclxuICB7XHJcbiAgICBjb25zdCBkYXRhVG9FbWl0ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGFTb3VyY2UuZGF0YSkpXHJcbiAgICBsZXQgYWxsUm93cyA9IHRoaXMuZ2V0QWxsQ2hpbGRyZW4oZGF0YVRvRW1pdCk7IFxyXG4gICAgdGhpcy5lbWl0QWxsTm9kZXMuZW1pdCh7ZXZlbnQ6ZXZlbnQsIGRhdGE6IGFsbFJvd3N9KTtcclxuICB9XHJcblxyXG4gIGdldEFsbENoaWxkcmVuKGFycilcclxuICB7XHJcbiAgICBsZXQgcmVzdWx0ID0gW107XHJcbiAgICBsZXQgc3ViUmVzdWx0O1xyXG4gICAgYXJyLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4gJiYgaXRlbS5jaGlsZHJlbi5sZW5ndGg+MCkge1xyXG4gICAgICAgIHN1YlJlc3VsdCA9IHRoaXMuZ2V0QWxsQ2hpbGRyZW4oaXRlbS5jaGlsZHJlbik7XHJcbiAgICAgICAgaWYgKHN1YlJlc3VsdCkgcmVzdWx0LnB1c2goLi4uc3ViUmVzdWx0KTtcclxuICAgICAgfVxyXG4gICAgICByZXN1bHQucHVzaChpdGVtKTtcclxuXHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBkZWxldGVDaGlsZHJlbihhcnIpXHJcbiAge1xyXG4gICAgYXJyLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4gJiYgaXRlbS5jaGlsZHJlbi5sZW5ndGg+MCkge1xyXG4gICAgICAgIHRoaXMuZGVsZXRlQ2hpbGRyZW4oaXRlbS5jaGlsZHJlbik7XHJcbiAgICAgIH1cclxuICAgICAgaXRlbS5zdGF0dXM9J3BlbmRpbmdEZWxldGUnXHJcblxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuXHJcbiJdfQ==