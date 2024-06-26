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
/** Flat node with expandable and level information */
export class FileFlatNode {
    constructor(expandable, name, level, type, id, status) {
        this.expandable = expandable;
        this.name = name;
        this.level = level;
        this.type = type;
        this.id = id;
        this.status = status;
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
    initialize(dataObj, allNewElements) {
        // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
        //     file node as children.
        const data = this.buildFileTree(dataObj, 0, allNewElements);
        // Notify the change.
        this.dataChange.next(data);
    }
    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `FileNode`.
     */
    buildFileTree(arrayTreeNodes, level, allNewElements) {
        var map = {};
        if (arrayTreeNodes.length === 0) {
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
            map['root'].order = 0;
            map['root'].isFolder = true;
            map['root'].isRoot = true;
        }
        return map['root'];
    }
    deleteItem(node, changedData) {
        this.deleteNode(changedData.children, node);
        this.dataChange.next(changedData);
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
    setOrder(data) {
        for (let i = 0; i < data.length; i++) {
            data[i].order = i;
            if (!data[i].status) {
                data[i].status = "Modified";
            }
        }
        return data;
    }
    copyPasteItem(from, to, changedData) {
        const newItem = this.insertItem(to, from, changedData);
        return newItem;
    }
    copyPasteItemAbove(from, to, changedData) {
        const newItem = this.insertItemAbove(to, from, changedData);
        return newItem;
    }
    copyPasteItemBelow(from, to, changedData) {
        const newItem = this.insertItemBelow(to, from, changedData);
        return newItem;
    }
    /** Add an item to to-do list */
    getNewItem(node) {
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
    insertItem(parent, node, changedData) {
        if (!parent.children) {
            parent.children = [];
        }
        const newItem = this.getNewItem(node);
        newItem.parent = parent == null || parent.id == undefined ? null : parent.id;
        parent.children.push(newItem);
        this.setOrder(parent.children);
        this.dataChange.next(changedData);
        return newItem;
    }
    insertItemAbove(node, nodeDrag, changedData) {
        const parentNode = this.getParentFromNodes(node, changedData);
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
    insertItemBelow(node, nodeDrag, changedData) {
        const parentNode = this.getParentFromNodes(node, changedData);
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
    getParentFromNodes(node, changedData) {
        for (let i = 0; i < changedData.children.length; ++i) {
            const currentRoot = changedData.children[i];
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
FileDatabase.decorators = [
    { type: Injectable }
];
/** @nocollapse */
FileDatabase.ctorParameters = () => [];
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
        const changedData = JSON.parse(JSON.stringify(this.dataSource.data));
        let toFlatNode;
        if (node.id === undefined) {
            toFlatNode = changedData[0];
        }
        else {
            toFlatNode = this.findNodeSiblings(changedData[0].children, node.id).find(nodeAct => nodeAct.id === node.id);
        }
        let fromFlatNode;
        if (this.dragNode.id === undefined) {
            fromFlatNode = changedData[0];
        }
        else {
            fromFlatNode = this.findNodeSiblings(changedData[0].children, this.dragNode.id).find(nodeAct => nodeAct.id === this.dragNode.id);
        }
        if (this.dragNode.status != "pendingDelete" && node !== this.dragNode && (this.dragNodeExpandOverArea !== 'center' || (this.dragNodeExpandOverArea === 'center' && toFlatNode.isFolder))) {
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
    handleDragEnd(event) {
        this.dragNode = null;
        this.dragNodeExpandOverNode = null;
        this.dragNodeExpandOverTime = 0;
    }
    /**
     * The following methods are for persisting the tree expand state
     * after being rebuilt
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
    setOrder(data) {
        for (let i = 0; i < data.length; i++) {
            data[i].order = i;
            if (!data[i].status) {
                data[i].status = "Modified";
            }
        }
        return data;
    }
    rebuildTreeForData(data) {
        //this.dataSource.data = data;
        this.sortByOrder(data);
        this.dataSource.data = [];
        this.dataSource.data = data;
        this.treeControl.expansionModel.selected.forEach((nodeAct) => {
            if (nodeAct) {
                const node = this.treeControl.dataNodes.find((n) => n.id === nodeAct.id);
                this.treeControl.expand(node);
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
            newFolder.order = dataToChange[0].children.length;
            dataToChange[0].children.push(newFolder);
        }
        else {
            const siblings = this.findNodeSiblings(dataToChange, newFolder.parent);
            let index = siblings.findIndex(node => node.id === newFolder.parent);
            newFolder.order = siblings[index].children.length;
            siblings[index].children.push(newFolder);
        }
        this.rebuildTreeForData(dataToChange);
    }
    createNewNode(newNode) {
        newNode.type = "node";
        const dataToChange = JSON.parse(JSON.stringify(this.dataSource.data));
        if (newNode.parent === null) {
            newNode.order = dataToChange[0].children.length;
            dataToChange[0].children.push(newNode);
        }
        else {
            const siblings = this.findNodeSiblings(dataToChange, newNode.parent);
            let index = siblings.findIndex(node => node.id === newNode.parent);
            newNode.order = siblings[index].children.length;
            siblings[index].children.push(newNode);
        }
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
                styles: [".mat-tree-node{-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:move}.mat-tree-node.cdk-drag-preview{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-tree-node.cdk-drag-placeholder{opacity:0}.cdk-drop-list-dragging .mat-tree-node:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}.cdk-drag-animating{transition:transform .2s cubic-bezier(0,0,.2,1)}.drop-above{border-top:10px solid #ddd;margin-top:-10px}.drop-below{border-bottom:10px solid #ddd;margin-bottom:-10px}.drop-center{background-color:#ddd}.deletedNode{color:red;font-style:italic}"]
            },] }
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
    allNewElements: [{ type: Input }],
    emptyItem: [{ type: ViewChild, args: ['emptyItem',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS10cmVlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL2FuZ3VsYXItbGlicmFyeS9wcm9qZWN0cy9zaXRtdW4tZnJvbnRlbmQtZ3VpL3NyYy9saWIvZGF0YS10cmVlL2RhdGEtdHJlZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekcsT0FBTyxFQUFFLHFCQUFxQixFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDakYsT0FBTyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsRUFBRSxJQUFJLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUV2RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFHMUQ7OztHQUdHO0FBQ0gsTUFBTSxPQUFPLFFBQVE7Q0FzQnBCO0FBRUQsc0RBQXNEO0FBQ3RELE1BQU0sT0FBTyxZQUFZO0lBQ3ZCLFlBQ1MsVUFBbUIsRUFDbkIsSUFBWSxFQUNaLEtBQWEsRUFDYixJQUFTLEVBQ1QsRUFBVSxFQUNWLE1BQWM7UUFMZCxlQUFVLEdBQVYsVUFBVSxDQUFTO1FBQ25CLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsU0FBSSxHQUFKLElBQUksQ0FBSztRQUNULE9BQUUsR0FBRixFQUFFLENBQVE7UUFDVixXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQ25CLENBQUM7Q0FDTjtBQUlEOzs7Ozs7R0FNRztBQUVILE1BQU0sT0FBTyxZQUFZO0lBSXZCO1FBSEEsZUFBVSxHQUFHLElBQUksZUFBZSxDQUFhLEVB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RUFBRSxFQUFFO1lBQ3RCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxFQUFFO2dCQUMxQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUNwQztZQUNELElBQUksQ0FBQyxNQUFNLEdBQUMsZUFBZSxDQUFBO1FBRTdCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7O1lBdFlGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZUFBZTtnQkFDekIsMDVJQUF1QztnQkFFdkMsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDOzthQUMxQjs7OztZQTRDOEIsWUFBWTs7O3lCQTFDeEMsTUFBTTsyQkFDTixNQUFNO3VCQUNOLE1BQU07MkJBQ04sTUFBTTsyQ0FDTixLQUFLOzBDQUNMLEtBQUs7MENBQ0wsS0FBSzt1Q0FDTCxLQUFLO3FCQWdCTCxLQUFLOzZCQUNMLEtBQUs7d0JBU0wsU0FBUyxTQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGbGF0VHJlZUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9jZGsvdHJlZSc7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3RhYmxlLCBJbnB1dCwgT3V0cHV0LEVsZW1lbnRSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBNYXRUcmVlRmxhdERhdGFTb3VyY2UsIE1hdFRyZWVGbGF0dGVuZXIgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90cmVlJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBvZiBhcyBvYnNlcnZhYmxlT2YgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQ2RrRHJhZ0Ryb3AgfSBmcm9tICdAYW5ndWxhci9jZGsvZHJhZy1kcm9wJztcclxuaW1wb3J0IHsgU2VsZWN0aW9uTW9kZWwgfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xyXG5pbXBvcnQgeyBmb3JFYWNoIH0gZnJvbSAnanN6aXAnO1xyXG5cclxuLyoqXHJcbiAqIEZpbGUgbm9kZSBkYXRhIHdpdGggbmVzdGVkIHN0cnVjdHVyZS5cclxuICogRWFjaCBub2RlIGhhcyBhIG5hbWUsIGFuZCBhIHR5cGUgb3IgYSBsaXN0IG9mIGNoaWxkcmVuLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEZpbGVOb2RlIHtcclxuICBpZDogc3RyaW5nO1xyXG4gIGNoaWxkcmVuOiBGaWxlTm9kZVtdO1xyXG4gIG5hbWU6IHN0cmluZztcclxuICB0eXBlOiBhbnk7XHJcbiAgYWN0aXZlOiBhbnlcclxuICBjYXJ0b2dyYXBoeUlkOiBhbnlcclxuICBjYXJ0b2dyYXBoeU5hbWU6IGFueVxyXG4gIGRhdGFzZXRVUkw6IGFueVxyXG4gIGRlc2NyaXB0aW9uOiBhbnlcclxuICBmaWx0ZXJHZXRGZWF0dXJlSW5mbzogYW55XHJcbiAgZmlsdGVyR2V0TWFwOiBhbnlcclxuICBmaWx0ZXJTZWxlY3RhYmxlOiBhbnlcclxuICBpc0ZvbGRlcjogYW55XHJcbiAgbWV0YWRhdGFVUkw6IGFueVxyXG4gIG9yZGVyOiBhbnlcclxuICBwYXJlbnQ6IGFueVxyXG4gIHF1ZXJ5YWJsZUFjdGl2ZTogYW55XHJcbiAgcmFkaW86IGFueVxyXG4gIHRvb2x0aXA6IGFueVxyXG4gIF9saW5rczogYW55XHJcbiAgc3RhdHVzOiBhbnlcclxufVxyXG5cclxuLyoqIEZsYXQgbm9kZSB3aXRoIGV4cGFuZGFibGUgYW5kIGxldmVsIGluZm9ybWF0aW9uICovXHJcbmV4cG9ydCBjbGFzcyBGaWxlRmxhdE5vZGUge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHVibGljIGV4cGFuZGFibGU6IGJvb2xlYW4sXHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nLFxyXG4gICAgcHVibGljIGxldmVsOiBudW1iZXIsXHJcbiAgICBwdWJsaWMgdHlwZTogYW55LFxyXG4gICAgcHVibGljIGlkOiBzdHJpbmcsXHJcbiAgICBwdWJsaWMgc3RhdHVzOiBzdHJpbmdcclxuICApIHsgfVxyXG59XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBGaWxlIGRhdGFiYXNlLCBpdCBjYW4gYnVpbGQgYSB0cmVlIHN0cnVjdHVyZWQgSnNvbiBvYmplY3QgZnJvbSBzdHJpbmcuXHJcbiAqIEVhY2ggbm9kZSBpbiBKc29uIG9iamVjdCByZXByZXNlbnRzIGEgZmlsZSBvciBhIGRpcmVjdG9yeS4gRm9yIGEgZmlsZSwgaXQgaGFzIG5hbWUgYW5kIHR5cGUuXHJcbiAqIEZvciBhIGRpcmVjdG9yeSwgaXQgaGFzIG5hbWUgYW5kIGNoaWxkcmVuIChhIGxpc3Qgb2YgZmlsZXMgb3IgZGlyZWN0b3JpZXMpLlxyXG4gKiBUaGUgaW5wdXQgd2lsbCBiZSBhIGpzb24gb2JqZWN0IHN0cmluZywgYW5kIHRoZSBvdXRwdXQgaXMgYSBsaXN0IG9mIGBGaWxlTm9kZWAgd2l0aCBuZXN0ZWRcclxuICogc3RydWN0dXJlLlxyXG4gKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgRmlsZURhdGFiYXNlIHtcclxuICBkYXRhQ2hhbmdlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxGaWxlTm9kZVtdPihbXSk7XHJcbiAgZ2V0IGRhdGEoKTogYW55IHsgcmV0dXJuIHRoaXMuZGF0YUNoYW5nZS52YWx1ZTsgfVxyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgfVxyXG5cclxuICBpbml0aWFsaXplKGRhdGFPYmosIGFsbE5ld0VsZW1lbnRzKSB7XHJcblxyXG4gICAgLy8gQnVpbGQgdGhlIHRyZWUgbm9kZXMgZnJvbSBKc29uIG9iamVjdC4gVGhlIHJlc3VsdCBpcyBhIGxpc3Qgb2YgYEZpbGVOb2RlYCB3aXRoIG5lc3RlZFxyXG4gICAgLy8gICAgIGZpbGUgbm9kZSBhcyBjaGlsZHJlbi5cclxuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkRmlsZVRyZWUoZGF0YU9iaiwgMCwgYWxsTmV3RWxlbWVudHMpO1xyXG5cclxuICAgIC8vIE5vdGlmeSB0aGUgY2hhbmdlLlxyXG4gICAgdGhpcy5kYXRhQ2hhbmdlLm5leHQoZGF0YSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBCdWlsZCB0aGUgZmlsZSBzdHJ1Y3R1cmUgdHJlZS4gVGhlIGB2YWx1ZWAgaXMgdGhlIEpzb24gb2JqZWN0LCBvciBhIHN1Yi10cmVlIG9mIGEgSnNvbiBvYmplY3QuXHJcbiAgICogVGhlIHJldHVybiB2YWx1ZSBpcyB0aGUgbGlzdCBvZiBgRmlsZU5vZGVgLlxyXG4gICAqL1xyXG4gIGJ1aWxkRmlsZVRyZWUoYXJyYXlUcmVlTm9kZXM6IGFueVtdLCBsZXZlbDogbnVtYmVyLCBhbGxOZXdFbGVtZW50czogYW55KSB7XHJcbiAgICB2YXIgbWFwID0ge307XHJcbiAgICBpZihhcnJheVRyZWVOb2Rlcy5sZW5ndGg9PT0wKVxyXG4gICAge1xyXG4gICAgICBsZXQgcm9vdCA9IHtcclxuICAgICAgICBpc0ZvbGRlcjp0cnVlLFxyXG4gICAgICAgIG5hbWU6J1Jvb3QnLFxyXG4gICAgICAgIHR5cGU6ICdmb2xkZXInLFxyXG4gICAgICAgIGlzUm9vdDogdHJ1ZSxcclxuICAgICAgICBvcmRlcjogMCxcclxuICAgICAgICBjaGlsZHJlbjogW10sXHJcbiAgICAgICAgaWQ6MFxyXG4gICAgICB9XHJcbiAgICAgIG1hcFsncm9vdCddPXJvb3Q7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBhcnJheVRyZWVOb2Rlcy5mb3JFYWNoKCh0cmVlTm9kZSkgPT4ge1xyXG4gICAgICAgIHZhciBvYmogPSB0cmVlTm9kZTtcclxuICAgICAgICBvYmouY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICBvYmoudHlwZT0gKHRyZWVOb2RlLmlzRm9sZGVyKT8gXCJmb2xkZXJcIiA6IFwibm9kZVwiO1xyXG4gICAgICAgIGlmKGFsbE5ld0VsZW1lbnRzKSB7XHJcbiAgICAgICAgICBvYmouc3RhdHVzPSdwZW5kaW5nQ3JlYXRpb24nO1xyXG4gICAgICAgICAgaWYob2JqLmlkKSB7IG9iai5pZCA9IG9iai5pZCAqIC0xIH1cclxuICAgICAgICAgIGlmKG9iai5wYXJlbnQpIHsgb2JqLnBhcmVudCA9IG9iai5wYXJlbnQgKiAtMSB9XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGlmKCFtYXBbb2JqLmlkXSkge21hcFtvYmouaWRdID0gb2JqO31cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgbGV0IHByZXZpb3VzQ2hpbGRyZW49IG1hcFtvYmouaWRdLmNoaWxkcmVuXHJcbiAgICAgICAgICBtYXBbb2JqLmlkXSA9IG9iajtcclxuICAgICAgICAgIG1hcFtvYmouaWRdLmNoaWxkcmVuPXByZXZpb3VzQ2hpbGRyZW5cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHBhcmVudCA9IG9iai5wYXJlbnQgfHwgJ3Jvb3QnO1xyXG4gICAgICAgIGlmICghbWFwW3BhcmVudF0pIHtcclxuICAgICAgICAgIG1hcFtwYXJlbnRdID0ge1xyXG4gICAgICAgICAgICBjaGlsZHJlbjogW11cclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1hcFtwYXJlbnRdLmNoaWxkcmVuLnB1c2gob2JqKTtcclxuICAgICAgfSk7XHJcbiAgICAgIG1hcFsncm9vdCddLnR5cGU9J2ZvbGRlcic7XHJcbiAgICAgIG1hcFsncm9vdCddLm5hbWU9J1Jvb3QnO1xyXG4gICAgICBtYXBbJ3Jvb3QnXS5vcmRlcj0wO1xyXG4gICAgICBtYXBbJ3Jvb3QnXS5pc0ZvbGRlcj10cnVlO1xyXG4gICAgICBtYXBbJ3Jvb3QnXS5pc1Jvb3Q9dHJ1ZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmV0dXJuIG1hcFsncm9vdCddO1xyXG4gIH1cclxuICBcclxuXHJcbiAgZGVsZXRlSXRlbShub2RlOiBGaWxlTm9kZSwgY2hhbmdlZERhdGE6YW55KSB7XHJcbiAgICB0aGlzLmRlbGV0ZU5vZGUoY2hhbmdlZERhdGEuY2hpbGRyZW4sIG5vZGUpO1xyXG4gICAgdGhpcy5kYXRhQ2hhbmdlLm5leHQoY2hhbmdlZERhdGEpO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlTm9kZShub2RlczogRmlsZU5vZGVbXSwgbm9kZVRvRGVsZXRlOiBGaWxlTm9kZSkge1xyXG4gICAgY29uc3QgaW5kZXggPSBub2Rlcy5pbmRleE9mKG5vZGVUb0RlbGV0ZSwgMCk7XHJcbiAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICBub2Rlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICBpZiAobm9kZS5jaGlsZHJlbiAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuZGVsZXRlTm9kZShub2RlLmNoaWxkcmVuLCBub2RlVG9EZWxldGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRPcmRlcihkYXRhOiBhbnlbXSl7XHJcbiAgICBmb3IobGV0IGk9MDsgaTwgZGF0YS5sZW5ndGg7IGkrKyl7XHJcbiAgICAgIGRhdGFbaV0ub3JkZXI9aTtcclxuICAgICAgaWYoISBkYXRhW2ldLnN0YXR1cykgeyBkYXRhW2ldLnN0YXR1cz1cIk1vZGlmaWVkXCI7IH0gXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGF0YTtcclxuICAgfVxyXG5cclxuICBjb3B5UGFzdGVJdGVtKGZyb206IEZpbGVOb2RlLCB0bzogRmlsZU5vZGUsIGNoYW5nZWREYXRhOmFueSk6IEZpbGVOb2RlIHtcclxuICAgIGNvbnN0IG5ld0l0ZW0gPSB0aGlzLmluc2VydEl0ZW0odG8sIGZyb20sY2hhbmdlZERhdGEpO1xyXG5cclxuICAgIHJldHVybiBuZXdJdGVtO1xyXG4gIH1cclxuXHJcbiAgY29weVBhc3RlSXRlbUFib3ZlKGZyb206IEZpbGVOb2RlLCB0bzogRmlsZU5vZGUsY2hhbmdlZERhdGE6YW55KTogRmlsZU5vZGUge1xyXG4gICAgY29uc3QgbmV3SXRlbSA9IHRoaXMuaW5zZXJ0SXRlbUFib3ZlKHRvLCBmcm9tLGNoYW5nZWREYXRhKTtcclxuXHJcbiAgICByZXR1cm4gbmV3SXRlbTtcclxuICB9XHJcblxyXG4gIGNvcHlQYXN0ZUl0ZW1CZWxvdyhmcm9tOiBGaWxlTm9kZSwgdG86IEZpbGVOb2RlLGNoYW5nZWREYXRhOmFueSk6IEZpbGVOb2RlIHtcclxuICAgIGNvbnN0IG5ld0l0ZW0gPSB0aGlzLmluc2VydEl0ZW1CZWxvdyh0bywgZnJvbSxjaGFuZ2VkRGF0YSk7XHJcblxyXG4gICAgcmV0dXJuIG5ld0l0ZW07XHJcbiAgfVxyXG5cclxuICAvKiogQWRkIGFuIGl0ZW0gdG8gdG8tZG8gbGlzdCAqL1xyXG4gIFxyXG4gIGdldE5ld0l0ZW0obm9kZTpGaWxlTm9kZSl7XHJcbiAgICBjb25zdCBuZXdJdGVtID0ge1xyXG4gICAgICBuYW1lOiBub2RlLm5hbWUsXHJcbiAgICAgIGNoaWxkcmVuOiBub2RlLmNoaWxkcmVuLFxyXG4gICAgICB0eXBlOiBub2RlLnR5cGUsXHJcbiAgICAgIGlkOiBub2RlLmlkLCBcclxuICAgICAgYWN0aXZlOiBub2RlLmFjdGl2ZSxcclxuICAgICAgY2FydG9ncmFwaHlJZDogbm9kZS5jYXJ0b2dyYXBoeUlkLFxyXG4gICAgICBjYXJ0b2dyYXBoeU5hbWU6IG5vZGUuY2FydG9ncmFwaHlOYW1lLFxyXG4gICAgICBkYXRhc2V0VVJMOiBub2RlLmRhdGFzZXRVUkwsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiBub2RlLmRlc2NyaXB0aW9uLFxyXG4gICAgICBmaWx0ZXJHZXRGZWF0dXJlSW5mbzogbm9kZS5maWx0ZXJHZXRGZWF0dXJlSW5mbyxcclxuICAgICAgZmlsdGVyR2V0TWFwOiBub2RlLmZpbHRlckdldE1hcCxcclxuICAgICAgZmlsdGVyU2VsZWN0YWJsZTogbm9kZS5maWx0ZXJTZWxlY3RhYmxlLFxyXG4gICAgICBpc0ZvbGRlcjogbm9kZS5pc0ZvbGRlcixcclxuICAgICAgbWV0YWRhdGFVUkw6IG5vZGUubWV0YWRhdGFVUkwsXHJcbiAgICAgIG9yZGVyOiBub2RlLm9yZGVyLFxyXG4gICAgICBxdWVyeWFibGVBY3RpdmU6IG5vZGUucXVlcnlhYmxlQWN0aXZlLFxyXG4gICAgICByYWRpbzogbm9kZS5yYWRpbyxcclxuICAgICAgdG9vbHRpcDogbm9kZS50b29sdGlwLFxyXG4gICAgICBfbGlua3M6IG5vZGUuX2xpbmtzIH0gYXMgRmlsZU5vZGU7XHJcblxyXG4gICAgcmV0dXJuIG5ld0l0ZW07XHJcbiAgfVxyXG5cclxuICBpbnNlcnRJdGVtKHBhcmVudDogRmlsZU5vZGUsIG5vZGU6IEZpbGVOb2RlLGNoYW5nZWREYXRhOmFueSk6IEZpbGVOb2RlIHtcclxuICAgIGlmICghcGFyZW50LmNoaWxkcmVuKSB7XHJcbiAgICAgIHBhcmVudC5jaGlsZHJlbiA9IFtdO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbmV3SXRlbSA9IHRoaXMuZ2V0TmV3SXRlbShub2RlKVxyXG4gICAgbmV3SXRlbS5wYXJlbnQgPSBwYXJlbnQ9PW51bGwgfHwgcGFyZW50LmlkPT11bmRlZmluZWQ/bnVsbDpwYXJlbnQuaWQ7XHJcblxyXG4gICAgcGFyZW50LmNoaWxkcmVuLnB1c2gobmV3SXRlbSk7XHJcbiAgICB0aGlzLnNldE9yZGVyKHBhcmVudC5jaGlsZHJlbilcclxuICAgIHRoaXMuZGF0YUNoYW5nZS5uZXh0KGNoYW5nZWREYXRhKTtcclxuICAgIHJldHVybiBuZXdJdGVtO1xyXG4gIH1cclxuXHJcbiAgaW5zZXJ0SXRlbUFib3ZlKG5vZGU6IEZpbGVOb2RlLCBub2RlRHJhZzogRmlsZU5vZGUsY2hhbmdlZERhdGE6YW55KTogRmlsZU5vZGUge1xyXG4gICAgY29uc3QgcGFyZW50Tm9kZSA9IHRoaXMuZ2V0UGFyZW50RnJvbU5vZGVzKG5vZGUsY2hhbmdlZERhdGEpO1xyXG4gICAgY29uc3QgbmV3SXRlbSA9IHRoaXMuZ2V0TmV3SXRlbShub2RlRHJhZylcclxuICAgIG5ld0l0ZW0ucGFyZW50ID0gcGFyZW50Tm9kZT09bnVsbCB8fCBwYXJlbnROb2RlLmlkPT11bmRlZmluZWQ/bnVsbDpwYXJlbnROb2RlLmlkO1xyXG4gIFxyXG4gICAgaWYgKHBhcmVudE5vZGUgIT0gbnVsbCkge1xyXG4gICAgICBwYXJlbnROb2RlLmNoaWxkcmVuLnNwbGljZShwYXJlbnROb2RlLmNoaWxkcmVuLmluZGV4T2Yobm9kZSksIDAsIG5ld0l0ZW0pO1xyXG4gICAgICB0aGlzLnNldE9yZGVyKHBhcmVudE5vZGUuY2hpbGRyZW4pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjaGFuZ2VkRGF0YS5jaGlsZHJlbi5zcGxpY2UoY2hhbmdlZERhdGEuY2hpbGRyZW4uaW5kZXhPZihub2RlKSwgMCwgbmV3SXRlbSk7XHJcbiAgICAgIHRoaXMuc2V0T3JkZXIoY2hhbmdlZERhdGEuY2hpbGRyZW4pXHJcbiAgICB9XHJcbiAgICB0aGlzLmRhdGFDaGFuZ2UubmV4dChjaGFuZ2VkRGF0YSk7XHJcbiAgICByZXR1cm4gbmV3SXRlbTtcclxuICB9XHJcblxyXG4gIGluc2VydEl0ZW1CZWxvdyhub2RlOiBGaWxlTm9kZSwgbm9kZURyYWc6IEZpbGVOb2RlLGNoYW5nZWREYXRhOmFueSk6IEZpbGVOb2RlIHtcclxuICAgIGNvbnN0IHBhcmVudE5vZGUgPSB0aGlzLmdldFBhcmVudEZyb21Ob2Rlcyhub2RlLGNoYW5nZWREYXRhKTtcclxuICAgXHJcbiAgICBjb25zdCBuZXdJdGVtID0gdGhpcy5nZXROZXdJdGVtKG5vZGVEcmFnKVxyXG4gICAgbmV3SXRlbS5wYXJlbnQgPSBwYXJlbnROb2RlPT1udWxsIHx8IHBhcmVudE5vZGUuaWQ9PXVuZGVmaW5lZD9udWxsOnBhcmVudE5vZGUuaWQ7XHJcblxyXG4gICAgaWYgKHBhcmVudE5vZGUgIT0gbnVsbCkge1xyXG4gICAgICBwYXJlbnROb2RlLmNoaWxkcmVuLnNwbGljZShwYXJlbnROb2RlLmNoaWxkcmVuLmluZGV4T2Yobm9kZSkgKyAxLCAwLCBuZXdJdGVtKTtcclxuICAgICAgdGhpcy5zZXRPcmRlcihwYXJlbnROb2RlLmNoaWxkcmVuKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2hhbmdlZERhdGEuY2hpbGRyZW4uc3BsaWNlKGNoYW5nZWREYXRhLmNoaWxkcmVuLmluZGV4T2Yobm9kZSkgKyAxLCAwLCBuZXdJdGVtKTtcclxuICAgICAgdGhpcy5zZXRPcmRlcihjaGFuZ2VkRGF0YS5jaGlsZHJlbilcclxuICAgIH1cclxuICAgIHRoaXMuZGF0YUNoYW5nZS5uZXh0KGNoYW5nZWREYXRhKTtcclxuICAgIHJldHVybiBuZXdJdGVtO1xyXG4gIH1cclxuXHJcbiAgXHJcbiAgZ2V0UGFyZW50RnJvbU5vZGVzKG5vZGU6IEZpbGVOb2RlLGNoYW5nZWREYXRhOmFueSk6IEZpbGVOb2RlIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhbmdlZERhdGEuY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgY29uc3QgY3VycmVudFJvb3QgPSAgY2hhbmdlZERhdGEuY2hpbGRyZW5baV07XHJcbiAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50KGN1cnJlbnRSb290LCBub2RlKTtcclxuICAgICAgaWYgKHBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcmVudDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBcclxuICBnZXRQYXJlbnQoY3VycmVudFJvb3Q6IEZpbGVOb2RlLCBub2RlOiBGaWxlTm9kZSk6IEZpbGVOb2RlIHtcclxuICAgIGlmIChjdXJyZW50Um9vdC5jaGlsZHJlbiAmJiBjdXJyZW50Um9vdC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudFJvb3QuY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBjb25zdCBjaGlsZCA9IGN1cnJlbnRSb290LmNoaWxkcmVuW2ldO1xyXG4gICAgICAgIGlmIChjaGlsZCA9PT0gbm9kZSkge1xyXG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnRSb290O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY2hpbGQuY2hpbGRyZW4gJiYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnQoY2hpbGQsIG5vZGUpO1xyXG4gICAgICAgICAgaWYgKHBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG59XHJcblxyXG4vKipcclxuICogQHRpdGxlIFRyZWUgd2l0aCBmbGF0IG5vZGVzXHJcbiAqL1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1kYXRhLXRyZWUnLFxyXG4gIHRlbXBsYXRlVXJsOiAnZGF0YS10cmVlLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnZGF0YS10cmVlLmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgcHJvdmlkZXJzOiBbRmlsZURhdGFiYXNlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGF0YVRyZWVDb21wb25lbnQge1xyXG4gIEBPdXRwdXQoKSBjcmVhdGVOb2RlOiBFdmVudEVtaXR0ZXI8YW55PjtcclxuICBAT3V0cHV0KCkgY3JlYXRlRm9sZGVyOiBFdmVudEVtaXR0ZXI8YW55PjtcclxuICBAT3V0cHV0KCkgZW1pdE5vZGU6IEV2ZW50RW1pdHRlcjxhbnk+O1xyXG4gIEBPdXRwdXQoKSBlbWl0QWxsTm9kZXM6IEV2ZW50RW1pdHRlcjxhbnk+O1xyXG4gIEBJbnB1dCgpIGV2ZW50Tm9kZVVwZGF0ZWRTdWJzY3JpcHRpb246IE9ic2VydmFibGUgPGFueT4gO1xyXG4gIEBJbnB1dCgpIGV2ZW50Q3JlYXRlTm9kZVN1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZSA8YW55PiA7XHJcbiAgQElucHV0KCkgZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlIDxhbnk+IDtcclxuICBASW5wdXQoKSBldmVudFJlZnJlc2hTdWJzY3JpcHRpb246IE9ic2VydmFibGUgPGFueT4gO1xyXG4gIHByaXZhdGUgX2V2ZW50Tm9kZVVwZGF0ZWRTdWJzY3JpcHRpb246IGFueTtcclxuICBwcml2YXRlIF9ldmVudENyZWF0ZU5vZGVTdWJzY3JpcHRpb246IGFueTtcclxuICBwcml2YXRlIF9ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb246IGFueTtcclxuICBwcml2YXRlIF9ldmVudFJlZnJlc2hTdWJzY3JpcHRpb246IGFueTtcclxuICB0cmVlQ29udHJvbDogRmxhdFRyZWVDb250cm9sPEZpbGVGbGF0Tm9kZT47XHJcbiAgdHJlZUZsYXR0ZW5lcjogTWF0VHJlZUZsYXR0ZW5lcjxGaWxlTm9kZSwgRmlsZUZsYXROb2RlPjtcclxuICBkYXRhU291cmNlOiBNYXRUcmVlRmxhdERhdGFTb3VyY2U8RmlsZU5vZGUsIEZpbGVGbGF0Tm9kZT47XHJcbiAgLy8gZXhwYW5zaW9uIG1vZGVsIHRyYWNrcyBleHBhbnNpb24gc3RhdGVcclxuICBleHBhbnNpb25Nb2RlbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxzdHJpbmc+KHRydWUpO1xyXG4gIGRyYWdnaW5nID0gZmFsc2U7XHJcbiAgZXhwYW5kVGltZW91dDogYW55O1xyXG4gIGV4cGFuZERlbGF5ID0gMTAwMDtcclxuICB2YWxpZGF0ZURyb3AgPSBmYWxzZTtcclxuICB0cmVlRGF0YTogYW55O1xyXG5cclxuICBASW5wdXQoKSBnZXRBbGw6ICgpID0+IE9ic2VydmFibGU8YW55PjtcclxuICBASW5wdXQoKSBhbGxOZXdFbGVtZW50czogYW55O1xyXG5cclxuXHJcbiAgLyogRHJhZyBhbmQgZHJvcCAqL1xyXG4gIGRyYWdOb2RlOiBhbnk7XHJcbiAgZHJhZ05vZGVFeHBhbmRPdmVyV2FpdFRpbWVNcyA9IDE1MDA7XHJcbiAgZHJhZ05vZGVFeHBhbmRPdmVyTm9kZTogYW55O1xyXG4gIGRyYWdOb2RlRXhwYW5kT3ZlclRpbWU6IG51bWJlcjtcclxuICBkcmFnTm9kZUV4cGFuZE92ZXJBcmVhOiBzdHJpbmc7XHJcbiAgQFZpZXdDaGlsZCgnZW1wdHlJdGVtJykgZW1wdHlJdGVtOiBFbGVtZW50UmVmO1xyXG5cclxuICAgIC8qKiBNYXAgZnJvbSBmbGF0IG5vZGUgdG8gbmVzdGVkIG5vZGUuIFRoaXMgaGVscHMgdXMgZmluZGluZyB0aGUgbmVzdGVkIG5vZGUgdG8gYmUgbW9kaWZpZWQgKi9cclxuICAgIGZsYXROb2RlTWFwID0gbmV3IE1hcDxGaWxlRmxhdE5vZGUsIEZpbGVOb2RlPigpO1xyXG5cclxuICAgIC8qKiBNYXAgZnJvbSBuZXN0ZWQgbm9kZSB0byBmbGF0dGVuZWQgbm9kZS4gVGhpcyBoZWxwcyB1cyB0byBrZWVwIHRoZSBzYW1lIG9iamVjdCBmb3Igc2VsZWN0aW9uICovXHJcbiAgICBuZXN0ZWROb2RlTWFwID0gbmV3IE1hcDxGaWxlTm9kZSwgRmlsZUZsYXROb2RlPigpO1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIGRhdGFiYXNlOiBGaWxlRGF0YWJhc2UpIHtcclxuICAgIHRoaXMuZW1pdE5vZGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmNyZWF0ZU5vZGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmNyZWF0ZUZvbGRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuZW1pdEFsbE5vZGVzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy50cmVlRmxhdHRlbmVyID0gbmV3IE1hdFRyZWVGbGF0dGVuZXIodGhpcy50cmFuc2Zvcm1lciwgdGhpcy5fZ2V0TGV2ZWwsXHJcbiAgICAgIHRoaXMuX2lzRXhwYW5kYWJsZSwgdGhpcy5fZ2V0Q2hpbGRyZW4pO1xyXG4gICAgdGhpcy50cmVlQ29udHJvbCA9IG5ldyBGbGF0VHJlZUNvbnRyb2w8RmlsZUZsYXROb2RlPih0aGlzLl9nZXRMZXZlbCwgdGhpcy5faXNFeHBhbmRhYmxlKTtcclxuICAgIHRoaXMuZGF0YVNvdXJjZSA9IG5ldyBNYXRUcmVlRmxhdERhdGFTb3VyY2UodGhpcy50cmVlQ29udHJvbCwgdGhpcy50cmVlRmxhdHRlbmVyKTtcclxuIFxyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKXtcclxuXHJcbiAgICBpZih0aGlzLmV2ZW50Tm9kZVVwZGF0ZWRTdWJzY3JpcHRpb24pXHJcbiAgICB7XHJcbiAgICAgIHRoaXMuZXZlbnROb2RlVXBkYXRlZFN1YnNjcmlwdGlvbi5zdWJzY3JpYmUoXHJcbiAgICAgICAgKG5vZGUpID0+IHtcclxuICAgICAgICAgIHRoaXMudXBkYXRlTm9kZShub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIGlmKHRoaXMuZXZlbnRDcmVhdGVOb2RlU3Vic2NyaXB0aW9uKVxyXG4gICAge1xyXG4gICAgICB0aGlzLmV2ZW50Q3JlYXRlTm9kZVN1YnNjcmlwdGlvbi5zdWJzY3JpYmUoXHJcbiAgICAgICAgKG5vZGUpID0+IHtcclxuICAgICAgICAgIGlmKG5vZGUuaXNGb2xkZXIpIHRoaXMuY3JlYXRlTmV3Rm9sZGVyKG5vZGUpO1xyXG4gICAgICAgICAgZWxzZSB0aGlzLmNyZWF0ZU5ld05vZGUobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbWl0QWxsUm93cygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5ldmVudFJlZnJlc2hTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5fZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uID0gdGhpcy5ldmVudFJlZnJlc2hTdWJzY3JpcHRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLmdldEVsZW1lbnRzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB0aGlzLmdldEVsZW1lbnRzKCk7XHJcbiAgfVxyXG5cclxuICBnZXRFbGVtZW50cygpOiB2b2lkIHtcclxuICAgIHRoaXMuZ2V0QWxsKClcclxuICAgIC5zdWJzY3JpYmUoKGl0ZW1zKSA9PiB7XHJcbiAgICAgIHRoaXMudHJlZURhdGEgPSBpdGVtcztcclxuICAgICAgdGhpcy5kYXRhYmFzZS5pbml0aWFsaXplKHRoaXMudHJlZURhdGEsIHRoaXMuYWxsTmV3RWxlbWVudHMpO1xyXG4gICAgICB0aGlzLmRhdGFiYXNlLmRhdGFDaGFuZ2Uuc3Vic2NyaWJlKGRhdGEgPT4gdGhpcy5yZWJ1aWxkVHJlZUZvckRhdGEoW2RhdGFdKSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICB0cmFuc2Zvcm1lciA9IChub2RlOiBGaWxlTm9kZSwgbGV2ZWw6IG51bWJlcikgPT4ge1xyXG4gICAgY29uc3QgZXhpc3RpbmdOb2RlID0gdGhpcy5uZXN0ZWROb2RlTWFwLmdldChub2RlKTtcclxuICAgIGNvbnN0IGZsYXROb2RlID0gZXhpc3RpbmdOb2RlICYmIGV4aXN0aW5nTm9kZS5uYW1lID09PSBub2RlLm5hbWVcclxuICAgICAgPyBleGlzdGluZ05vZGVcclxuICAgICAgOiBuZXcgRmlsZUZsYXROb2RlKChub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMCksbm9kZS5uYW1lLGxldmVsLG5vZGUudHlwZSxub2RlLmlkLG5vZGUuc3RhdHVzKTtcclxuXHJcbiAgICB0aGlzLmZsYXROb2RlTWFwLnNldChmbGF0Tm9kZSwgbm9kZSk7XHJcbiAgICB0aGlzLm5lc3RlZE5vZGVNYXAuc2V0KG5vZGUsIGZsYXROb2RlKTtcclxuICAgIHJldHVybiBmbGF0Tm9kZTtcclxuICBcclxuICB9XHJcbiAgcHJpdmF0ZSBfZ2V0TGV2ZWwgPSAobm9kZTogRmlsZUZsYXROb2RlKSA9PiBub2RlLmxldmVsO1xyXG4gIHByaXZhdGUgX2lzRXhwYW5kYWJsZSA9IChub2RlOiBGaWxlRmxhdE5vZGUpID0+IG5vZGUuZXhwYW5kYWJsZTtcclxuICBwcml2YXRlIF9nZXRDaGlsZHJlbiA9IChub2RlOiBGaWxlTm9kZSk6IE9ic2VydmFibGU8RmlsZU5vZGVbXT4gPT4gb2JzZXJ2YWJsZU9mKG5vZGUuY2hpbGRyZW4pO1xyXG4gIGhhc0NoaWxkID0gKF86IG51bWJlciwgX25vZGVEYXRhOiBGaWxlRmxhdE5vZGUpID0+IF9ub2RlRGF0YS5leHBhbmRhYmxlO1xyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogVGhpcyBjb25zdHJ1Y3RzIGFuIGFycmF5IG9mIG5vZGVzIHRoYXQgbWF0Y2hlcyB0aGUgRE9NXHJcbiAgICovXHJcbiAgdmlzaWJsZU5vZGVzKCk6IEZpbGVOb2RlW10ge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkRXhwYW5kZWRDaGlsZHJlbihub2RlOiBGaWxlTm9kZSwgZXhwYW5kZWQ6IHN0cmluZ1tdKSB7XHJcbiAgICAgIHJlc3VsdC5wdXNoKG5vZGUpO1xyXG4gICAgICBpZiAoZXhwYW5kZWQuaW5kZXhPZihub2RlLmlkKSAhPSAtMSkge1xyXG4gICAgICAgIG5vZGUuY2hpbGRyZW4ubWFwKChjaGlsZCkgPT4gYWRkRXhwYW5kZWRDaGlsZHJlbihjaGlsZCwgZXhwYW5kZWQpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5kYXRhU291cmNlLmRhdGEuZm9yRWFjaCgobm9kZSkgPT4ge1xyXG4gICAgICBhZGRFeHBhbmRlZENoaWxkcmVuKG5vZGUsIHRoaXMuZXhwYW5zaW9uTW9kZWwuc2VsZWN0ZWQpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcblxyXG4gICBmaW5kTm9kZVNpYmxpbmdzKGFycjogQXJyYXk8YW55PiwgaWQ6IHN0cmluZyk6IEFycmF5PGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdCwgc3ViUmVzdWx0O1xyXG4gICAgYXJyLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuICAgICAgaWYgKGl0ZW0uaWQgPT09IGlkKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gYXJyO1xyXG4gICAgICB9IGVsc2UgaWYgKGl0ZW0uY2hpbGRyZW4pIHtcclxuICAgICAgICBzdWJSZXN1bHQgPSB0aGlzLmZpbmROb2RlU2libGluZ3MoaXRlbS5jaGlsZHJlbiwgaWQpO1xyXG4gICAgICAgIGlmIChzdWJSZXN1bHQpIHJlc3VsdCA9IHN1YlJlc3VsdDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG5cclxuICB9XHJcblxyXG5cclxuICBoYW5kbGVEcmFnU3RhcnQoZXZlbnQsIG5vZGUpIHtcclxuICAgIC8vIFJlcXVpcmVkIGJ5IEZpcmVmb3ggKGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE5MDU1MjY0L3doeS1kb2VzbnQtaHRtbDUtZHJhZy1hbmQtZHJvcC13b3JrLWluLWZpcmVmb3gpXHJcbiAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSgnZm9vJywgJ2JhcicpO1xyXG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZSh0aGlzLmVtcHR5SXRlbS5uYXRpdmVFbGVtZW50LCAwLCAwKTtcclxuICAgIHRoaXMuZHJhZ05vZGUgPSBub2RlO1xyXG4gICAgdGhpcy50cmVlQ29udHJvbC5jb2xsYXBzZShub2RlKTtcclxuICB9XHJcblxyXG4gIGhhbmRsZURyYWdPdmVyKGV2ZW50LCBub2RlKSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIC8vIEhhbmRsZSBub2RlIGV4cGFuZFxyXG4gICAgaWYgKG5vZGUgPT09IHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyTm9kZSkge1xyXG4gICAgICBpZiAodGhpcy5kcmFnTm9kZSAhPT0gbm9kZSAmJiAhdGhpcy50cmVlQ29udHJvbC5pc0V4cGFuZGVkKG5vZGUpKSB7XHJcbiAgICAgICAgaWYgKChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyVGltZSkgPiB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlcldhaXRUaW1lTXMpIHtcclxuICAgICAgICAgIHRoaXMudHJlZUNvbnRyb2wuZXhwYW5kKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJOb2RlID0gbm9kZTtcclxuICAgICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGFuZGxlIGRyYWcgYXJlYVxyXG4gICAgY29uc3QgcGVyY2VudGFnZVggPSBldmVudC5vZmZzZXRYIC8gZXZlbnQudGFyZ2V0LmNsaWVudFdpZHRoO1xyXG4gICAgY29uc3QgcGVyY2VudGFnZVkgPSBldmVudC5vZmZzZXRZIC8gZXZlbnQudGFyZ2V0LmNsaWVudEhlaWdodDtcclxuICAgIGlmIChwZXJjZW50YWdlWSA8IDAuMjUpIHtcclxuICAgICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJBcmVhID0gJ2Fib3ZlJztcclxuICAgIH0gZWxzZSBpZiAocGVyY2VudGFnZVkgPiAwLjc1KSB7XHJcbiAgICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyQXJlYSA9ICdiZWxvdyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlckFyZWEgPSAnY2VudGVyJztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhhbmRsZURyb3AoZXZlbnQsIG5vZGUpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBjb25zdCBjaGFuZ2VkRGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhU291cmNlLmRhdGEpKVxyXG5cclxuICAgIFxyXG4gICAgbGV0IHRvRmxhdE5vZGU7XHJcbiAgICBpZihub2RlLmlkID09PSB1bmRlZmluZWQpIHsgdG9GbGF0Tm9kZT1jaGFuZ2VkRGF0YVswXSB9XHJcbiAgICBlbHNle1xyXG4gICAgICB0b0ZsYXROb2RlPSB0aGlzLmZpbmROb2RlU2libGluZ3MoY2hhbmdlZERhdGFbMF0uY2hpbGRyZW4sIG5vZGUuaWQpLmZpbmQobm9kZUFjdCA9PiBub2RlQWN0LmlkID09PSBub2RlLmlkKTtcclxuICAgIH1cclxuICAgIGxldCBmcm9tRmxhdE5vZGU7XHJcbiAgICBpZiggdGhpcy5kcmFnTm9kZS5pZCA9PT0gdW5kZWZpbmVkKSB7IGZyb21GbGF0Tm9kZT1jaGFuZ2VkRGF0YVswXSB9XHJcbiAgICBlbHNle1xyXG4gICAgICBmcm9tRmxhdE5vZGUgPSB0aGlzLmZpbmROb2RlU2libGluZ3MoY2hhbmdlZERhdGFbMF0uY2hpbGRyZW4sIHRoaXMuZHJhZ05vZGUuaWQpLmZpbmQobm9kZUFjdCA9PiBub2RlQWN0LmlkID09PSB0aGlzLmRyYWdOb2RlLmlkKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmRyYWdOb2RlLnN0YXR1cyE9XCJwZW5kaW5nRGVsZXRlXCIgJiYgbm9kZSAhPT0gdGhpcy5kcmFnTm9kZSAmJiAodGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJBcmVhICE9PSAnY2VudGVyJyB8fCAodGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJBcmVhID09PSAnY2VudGVyJyAmJiB0b0ZsYXROb2RlLmlzRm9sZGVyKSkpIHtcclxuICAgICAgbGV0IG5ld0l0ZW06IEZpbGVOb2RlO1xyXG5cclxuICAgICAgaWYgKHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyQXJlYSA9PT0gJ2Fib3ZlJykge1xyXG4gICAgICAgIG5ld0l0ZW0gPSB0aGlzLmRhdGFiYXNlLmNvcHlQYXN0ZUl0ZW1BYm92ZShmcm9tRmxhdE5vZGUsdG9GbGF0Tm9kZSxjaGFuZ2VkRGF0YVswXSk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJBcmVhID09PSAnYmVsb3cnKSB7XHJcbiAgICAgICAgbmV3SXRlbSA9IHRoaXMuZGF0YWJhc2UuY29weVBhc3RlSXRlbUJlbG93KGZyb21GbGF0Tm9kZSx0b0ZsYXROb2RlLGNoYW5nZWREYXRhWzBdKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBuZXdJdGVtID0gdGhpcy5kYXRhYmFzZS5jb3B5UGFzdGVJdGVtKGZyb21GbGF0Tm9kZSwgdG9GbGF0Tm9kZSxjaGFuZ2VkRGF0YVswXSk7XHJcbiAgICAgIH0gICAgXHJcbiAgICAgIGxldCBwYXJlbnRMdmw9dGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXMuZmluZCgobikgPT4gbi5pZCA9PT0gZnJvbUZsYXROb2RlLmlkKS5sZXZlbDtcclxuICAgICAgZnJvbUZsYXROb2RlLmNoaWxkcmVuLmZvckVhY2goY2hpbGQ9PntcclxuICAgICAgICB0aGlzLnRyZWVDb250cm9sLmRhdGFOb2Rlcy5maW5kKChuKSA9PiBuLmlkID09PSBjaGlsZC5pZCkubGV2ZWw9cGFyZW50THZsKzFcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuZGF0YWJhc2UuZGVsZXRlSXRlbShmcm9tRmxhdE5vZGUsY2hhbmdlZERhdGFbMF0pO1xyXG4gICAgICB0aGlzLnRyZWVDb250cm9sLmV4cGFuZERlc2NlbmRhbnRzKHRoaXMubmVzdGVkTm9kZU1hcC5nZXQobmV3SXRlbSkpO1xyXG4gICAgfVxyXG4gICBcclxuICAgIHRoaXMuZHJhZ05vZGUgPSBudWxsO1xyXG4gICAgdGhpcy5kcmFnTm9kZUV4cGFuZE92ZXJOb2RlID0gbnVsbDtcclxuICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyVGltZSA9IDA7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVEcmFnRW5kKGV2ZW50KSB7XHJcbiAgICB0aGlzLmRyYWdOb2RlID0gbnVsbDtcclxuICAgIHRoaXMuZHJhZ05vZGVFeHBhbmRPdmVyTm9kZSA9IG51bGw7XHJcbiAgICB0aGlzLmRyYWdOb2RlRXhwYW5kT3ZlclRpbWUgPSAwO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGZvbGxvd2luZyBtZXRob2RzIGFyZSBmb3IgcGVyc2lzdGluZyB0aGUgdHJlZSBleHBhbmQgc3RhdGVcclxuICAgKiBhZnRlciBiZWluZyByZWJ1aWx0XHJcbiAgICovXHJcblxyXG4gICBzb3J0QnlPcmRlcihkYXRhOiBhbnlbXSl7XHJcbiAgICAvLyBkYXRhLnNvcnQoKGEsYikgPT4gYS5vcmRlci50b1N0cmluZygpLmxvY2FsZUNvbXBhcmUoIGIub3JkZXIudG9TdHJpbmcoKSkpO1xyXG4gICAgZGF0YS5zb3J0KChhLGIpID0+IChhLm9yZGVyID4gYi5vcmRlcikgPyAxIDogKChiLm9yZGVyID4gYS5vcmRlcikgPyAtMSA6IDApKTtcclxuICAgIGRhdGEuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS5jaGlsZHJlbi5sZW5ndGg+MCkge1xyXG4gICAgICAgIHRoaXMuc29ydEJ5T3JkZXIoaXRlbS5jaGlsZHJlbik7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuICAgfVxyXG5cclxuICAgc2V0T3JkZXIoZGF0YTogYW55W10pe1xyXG4gICAgZm9yKGxldCBpPTA7IGk8IGRhdGEubGVuZ3RoOyBpKyspe1xyXG4gICAgICBkYXRhW2ldLm9yZGVyPWk7XHJcbiAgICAgIGlmKCEgZGF0YVtpXS5zdGF0dXMpIHsgZGF0YVtpXS5zdGF0dXM9XCJNb2RpZmllZFwiOyB9IFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgIH1cclxuXHJcbiAgcmVidWlsZFRyZWVGb3JEYXRhKGRhdGE6IGFueVtdKSB7XHJcbiAgICAvL3RoaXMuZGF0YVNvdXJjZS5kYXRhID0gZGF0YTtcclxuICAgIHRoaXMuc29ydEJ5T3JkZXIoZGF0YSk7XHJcbiAgICB0aGlzLmRhdGFTb3VyY2UuZGF0YSA9IFtdO1xyXG4gICAgdGhpcy5kYXRhU291cmNlLmRhdGEgPSBkYXRhO1xyXG4gICAgdGhpcy50cmVlQ29udHJvbC5leHBhbnNpb25Nb2RlbC5zZWxlY3RlZC5mb3JFYWNoKChub2RlQWN0KSA9PiB7XHJcbiAgICAgIGlmKG5vZGVBY3Qpe1xyXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnRyZWVDb250cm9sLmRhdGFOb2Rlcy5maW5kKChuKSA9PiBuLmlkID09PSBub2RlQWN0LmlkKTtcclxuICAgICAgICB0aGlzLnRyZWVDb250cm9sLmV4cGFuZChub2RlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFBhcmVudE5vZGUobm9kZTogRmlsZUZsYXROb2RlKTogRmlsZUZsYXROb2RlIHwgbnVsbCB7XHJcbiAgICBjb25zdCBjdXJyZW50TGV2ZWwgPSBub2RlLmxldmVsO1xyXG4gICAgaWYgKGN1cnJlbnRMZXZlbCA8IDEpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzdGFydEluZGV4ID0gdGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXMuaW5kZXhPZihub2RlKSAtIDE7XHJcbiAgICBmb3IgKGxldCBpID0gc3RhcnRJbmRleDsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgY29uc3QgY3VycmVudE5vZGUgPSB0aGlzLnRyZWVDb250cm9sLmRhdGFOb2Rlc1tpXTtcclxuICAgICAgaWYgKGN1cnJlbnROb2RlLmxldmVsIDwgY3VycmVudExldmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnROb2RlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHVwZGF0ZU5vZGUobm9kZVVwZGF0ZWQpXHJcbiAge1xyXG4gICAgY29uc3QgZGF0YVRvQ2hhbmdlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGFTb3VyY2UuZGF0YSkpXHJcbiAgICBjb25zdCBzaWJsaW5ncyA9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhkYXRhVG9DaGFuZ2UsIG5vZGVVcGRhdGVkLmlkKTtcclxuICAgIGxldCBpbmRleD0gc2libGluZ3MuZmluZEluZGV4KG5vZGUgPT4gbm9kZS5pZCA9PT0gbm9kZVVwZGF0ZWQuaWQpXHJcbiAgICBzaWJsaW5nc1tpbmRleF09bm9kZVVwZGF0ZWQ7XHJcbiAgICB0aGlzLnJlYnVpbGRUcmVlRm9yRGF0YShkYXRhVG9DaGFuZ2UpO1xyXG5cclxuICB9XHJcblxyXG4gIGNyZWF0ZU5ld0ZvbGRlcihuZXdGb2xkZXIpXHJcbiAge1xyXG4gICAgbmV3Rm9sZGVyLnR5cGU9XCJmb2xkZXJcIjtcclxuICAgIGNvbnN0IGRhdGFUb0NoYW5nZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhU291cmNlLmRhdGEpKVxyXG4gICAgaWYobmV3Rm9sZGVyLnBhcmVudCA9PT0gbnVsbCkge1xyXG4gICAgICBuZXdGb2xkZXIub3JkZXI9ZGF0YVRvQ2hhbmdlWzBdLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgZGF0YVRvQ2hhbmdlWzBdLmNoaWxkcmVuLnB1c2gobmV3Rm9sZGVyKVxyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgY29uc3Qgc2libGluZ3MgPSB0aGlzLmZpbmROb2RlU2libGluZ3MoZGF0YVRvQ2hhbmdlLCBuZXdGb2xkZXIucGFyZW50KTtcclxuICAgICAgbGV0IGluZGV4PSBzaWJsaW5ncy5maW5kSW5kZXgobm9kZSA9PiBub2RlLmlkID09PSBuZXdGb2xkZXIucGFyZW50KTtcclxuICAgICAgbmV3Rm9sZGVyLm9yZGVyPXNpYmxpbmdzW2luZGV4XS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgIHNpYmxpbmdzW2luZGV4XS5jaGlsZHJlbi5wdXNoKG5ld0ZvbGRlcilcclxuICAgIH1cclxuICAgIHRoaXMucmVidWlsZFRyZWVGb3JEYXRhKGRhdGFUb0NoYW5nZSk7XHJcblxyXG4gIH1cclxuXHJcbiAgY3JlYXRlTmV3Tm9kZShuZXdOb2RlKVxyXG4gIHtcclxuICAgIG5ld05vZGUudHlwZT1cIm5vZGVcIjtcclxuICAgIGNvbnN0IGRhdGFUb0NoYW5nZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhU291cmNlLmRhdGEpKVxyXG4gICAgaWYobmV3Tm9kZS5wYXJlbnQgPT09IG51bGwpIHtcclxuICAgICAgbmV3Tm9kZS5vcmRlcj1kYXRhVG9DaGFuZ2VbMF0uY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICBkYXRhVG9DaGFuZ2VbMF0uY2hpbGRyZW4ucHVzaChuZXdOb2RlKVxyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgIGNvbnN0IHNpYmxpbmdzID0gdGhpcy5maW5kTm9kZVNpYmxpbmdzKGRhdGFUb0NoYW5nZSwgbmV3Tm9kZS5wYXJlbnQpO1xyXG4gICAgbGV0IGluZGV4PSBzaWJsaW5ncy5maW5kSW5kZXgobm9kZSA9PiBub2RlLmlkID09PSBuZXdOb2RlLnBhcmVudCk7XHJcbiAgICBuZXdOb2RlLm9yZGVyPXNpYmxpbmdzW2luZGV4XS5jaGlsZHJlbi5sZW5ndGg7XHJcbiAgICBzaWJsaW5nc1tpbmRleF0uY2hpbGRyZW4ucHVzaChuZXdOb2RlKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVidWlsZFRyZWVGb3JEYXRhKGRhdGFUb0NoYW5nZSk7XHJcblxyXG4gIH1cclxuXHJcblxyXG5cclxuICBvbkJ1dHRvbkNsaWNrZWQoaWQsIGJ1dHRvbjogc3RyaW5nKVxyXG4gIHtcclxuICAgIGNvbnN0IGNoYW5nZWREYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGFTb3VyY2UuZGF0YSkpXHJcbiAgICBjb25zdCBzaWJsaW5ncyA9IHRoaXMuZmluZE5vZGVTaWJsaW5ncyhjaGFuZ2VkRGF0YSwgaWQpO1xyXG4gICAgbGV0IG5vZGVDbGlja2VkPSBzaWJsaW5ncy5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gaWQpO1xyXG4gICAgaWYoYnV0dG9uID09PSdlZGl0JykgIHt0aGlzLmVtaXROb2RlLmVtaXQobm9kZUNsaWNrZWQpfVxyXG4gICAgZWxzZSBpZihidXR0b24gPT09ICduZXdGb2xkZXInKSB7dGhpcy5jcmVhdGVGb2xkZXIuZW1pdChub2RlQ2xpY2tlZCl9XHJcbiAgICBlbHNlIGlmKGJ1dHRvbiA9PT0gJ25ld05vZGUnKSB7dGhpcy5jcmVhdGVOb2RlLmVtaXQoIG5vZGVDbGlja2VkKX1cclxuICAgIGVsc2UgaWYoYnV0dG9uID09PSAnZGVsZXRlJykge1xyXG4gICAgICAvLyBsZXQgY2hpbGRyZW49IHRoaXMuZ2V0QWxsQ2hpbGRyZW4obm9kZUNsaWNrZWQuY2hpbGRyZW4pXHJcbiAgICAgIC8vIGNoaWxkcmVuLmZvckVhY2goY2hpbGRyZW4gPT4ge1xyXG4gICAgICAvLyAgIGNoaWxkcmVuLnN0YXR1cz0ncGVuZGluZ0RlbGV0ZSc7XHJcbiAgICAgIC8vIH0pO1xyXG4gICAgICB0aGlzLmRlbGV0ZUNoaWxkcmVuKG5vZGVDbGlja2VkLmNoaWxkcmVuKTtcclxuICAgICAgLy8gbm9kZUNsaWNrZWQuY2hpbGRyZW49Y2hpbGRyZW5cclxuICAgICAgbm9kZUNsaWNrZWQuc3RhdHVzPSdwZW5kaW5nRGVsZXRlJ1xyXG4gICAgICBcclxuICAgICAgdGhpcy5yZWJ1aWxkVHJlZUZvckRhdGEoY2hhbmdlZERhdGEpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGVtaXRBbGxSb3dzKClcclxuICB7XHJcbiAgICBjb25zdCBkYXRhVG9FbWl0ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGFTb3VyY2UuZGF0YSkpXHJcbiAgICBsZXQgYWxsUm93cyA9IHRoaXMuZ2V0QWxsQ2hpbGRyZW4oZGF0YVRvRW1pdCk7IFxyXG4gICAgdGhpcy5lbWl0QWxsTm9kZXMuZW1pdChhbGxSb3dzKTtcclxuICB9XHJcblxyXG4gIGdldEFsbENoaWxkcmVuKGFycilcclxuICB7XHJcbiAgICBsZXQgcmVzdWx0ID0gW107XHJcbiAgICBsZXQgc3ViUmVzdWx0O1xyXG4gICAgYXJyLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4ubGVuZ3RoPjApIHtcclxuICAgICAgICBzdWJSZXN1bHQgPSB0aGlzLmdldEFsbENoaWxkcmVuKGl0ZW0uY2hpbGRyZW4pO1xyXG4gICAgICAgIGlmIChzdWJSZXN1bHQpIHJlc3VsdC5wdXNoKC4uLnN1YlJlc3VsdCk7XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XHJcblxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlQ2hpbGRyZW4oYXJyKVxyXG4gIHtcclxuICAgIGFyci5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLmNoaWxkcmVuLmxlbmd0aD4wKSB7XHJcbiAgICAgICAgdGhpcy5kZWxldGVDaGlsZHJlbihpdGVtLmNoaWxkcmVuKTtcclxuICAgICAgfVxyXG4gICAgICBpdGVtLnN0YXR1cz0ncGVuZGluZ0RlbGV0ZSdcclxuXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59XHJcblxyXG5cclxuIl19