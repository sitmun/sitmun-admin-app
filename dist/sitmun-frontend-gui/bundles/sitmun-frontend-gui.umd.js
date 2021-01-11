(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@ag-grid-community/all-modules'), require('@ngx-translate/core'), require('rxjs'), require('@angular/material/dialog'), require('@angular/forms'), require('@angular/common'), require('@angular/common/http'), require('@angular/platform-browser/animations'), require('@angular/router'), require('@sitmun/frontend-core'), require('@angular/common/locales/ca'), require('@angular/common/locales/es'), require('@ag-grid-community/angular'), require('@angular/material/button'), require('@angular/material/icon'), require('@angular/material/menu'), require('@ngx-translate/http-loader')) :
    typeof define === 'function' && define.amd ? define('@sitmun/frontend-gui', ['exports', '@angular/core', '@ag-grid-community/all-modules', '@ngx-translate/core', 'rxjs', '@angular/material/dialog', '@angular/forms', '@angular/common', '@angular/common/http', '@angular/platform-browser/animations', '@angular/router', '@sitmun/frontend-core', '@angular/common/locales/ca', '@angular/common/locales/es', '@ag-grid-community/angular', '@angular/material/button', '@angular/material/icon', '@angular/material/menu', '@ngx-translate/http-loader'], factory) :
    (factory((global.sitmun = global.sitmun || {}, global.sitmun['frontend-gui'] = {}),global.ng.core,null,null,global.rxjs,global.ng.material.dialog,global.ng.forms,global.ng.common,global.ng.common.http,global.ng.platformBrowser.animations,global.ng.router,null,global.ng.common.locales.ca,global.ng.common.locales.es,null,global.ng.material.button,global.ng.material.icon,global.ng.material.menu,null));
}(this, (function (exports,core,allModules,core$1,rxjs,dialog,forms,common,http,animations,router,frontendCore,localeCa,localeEs,angular,button,icon,menu,httpLoader) { 'use strict';

    localeCa = localeCa && localeCa.hasOwnProperty('default') ? localeCa['default'] : localeCa;
    localeEs = localeEs && localeEs.hasOwnProperty('default') ? localeEs['default'] : localeEs;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var BtnEditRenderedComponent = (function () {
        function BtnEditRenderedComponent() {
        }
        /**
         * @param {?} params
         * @return {?}
         */
        BtnEditRenderedComponent.prototype.agInit = /**
         * @param {?} params
         * @return {?}
         */
            function (params) {
                this.params = params;
            };
        /**
         * @param {?} params
         * @return {?}
         */
        BtnEditRenderedComponent.prototype.refresh = /**
         * @param {?} params
         * @return {?}
         */
            function (params) {
                return true;
            };
        /**
         * @param {?} $event
         * @return {?}
         */
        BtnEditRenderedComponent.prototype.btnClickedHandler = /**
         * @param {?} $event
         * @return {?}
         */
            function ($event) {
                this.params.clicked(this.params.value);
            };
        /**
         * @return {?}
         */
        BtnEditRenderedComponent.prototype.getParams = /**
         * @return {?}
         */
            function () {
                return this.params;
            };
        /**
         * @return {?}
         */
        BtnEditRenderedComponent.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                // no need to remove the button click handler
            };
        BtnEditRenderedComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'app-btn-edit-rendered',
                        template: "<button mat-mini-fab class=\"buttonEdit\"  type=\"button\"  (click)=\"btnClickedHandler($event)\" >\n  <mat-icon class=\"iconEdit\"   fontSet=\"material-icons-round\" > edit </mat-icon>\n</button> ",
                        styles: [".buttonEdit{color:#000;background-color:#ddd;width:20px;margin-top:3px;height:20px;box-shadow:none}.iconEdit{font-size:13px;margin-top:-10px;margin-left:-2px}"]
                    },] },
        ];
        return BtnEditRenderedComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var DataGridComponent = (function () {
        function DataGridComponent(translate) {
            var _this = this;
            this.translate = translate;
            this.modules = allModules.AllCommunityModules;
            this.statusColumn = false;
            this.changesMap = new Map();
            this.modificationChange = false;
            this.undoNoChanges = false;
            this.translate = translate;
            this.frameworkComponents = {
                btnEditRendererComponent: BtnEditRenderedComponent
            };
            this.remove = new core.EventEmitter();
            this.new = new core.EventEmitter();
            this.add = new core.EventEmitter();
            this.sendChanges = new core.EventEmitter();
            this.getSelectedRows = new core.EventEmitter();
            this.duplicate = new core.EventEmitter();
            this.getAllRows = new core.EventEmitter();
            this.changeCounter = 0;
            this.previousChangeCounter = 0;
            this.redoCounter = 0;
            this.gridOptions = {
                defaultColDef: {
                    sortable: true,
                    flex: 1,
                    filter: true,
                    editable: !this.nonEditable,
                    cellStyle: { backgroundColor: '#FFFFFF' },
                },
                columnTypes: {
                    dateColumn: {
                        filter: 'agDateColumnFilter',
                        filterParams: {
                            comparator: /**
                             * @param {?} filterLocalDateAtMidnight
                             * @param {?} cellValue
                             * @return {?}
                             */ function (filterLocalDateAtMidnight, cellValue) {
                                /** @type {?} */
                                var dateCellValue = new Date(cellValue);
                                /** @type {?} */
                                var dateFilter = new Date(filterLocalDateAtMidnight);
                                if (dateCellValue.getTime() < dateFilter.getTime()) {
                                    return -1;
                                }
                                else if (dateCellValue.getTime() > dateFilter.getTime()) {
                                    return 1;
                                }
                                else {
                                    return 0;
                                }
                            },
                        },
                        suppressMenu: true
                    }
                },
                rowSelection: 'multiple',
                singleClickEdit: true,
                // suppressHorizontalScroll: true,
                localeTextFunc: function (key, defaultValue) {
                    /** @type {?} */
                    var data = _this.translate.instant(key);
                    return data === key ? defaultValue : data;
                }
            };
        }
        /**
         * @return {?}
         */
        DataGridComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                if (this.eventRefreshSubscription) {
                    this._eventRefreshSubscription = this.eventRefreshSubscription.subscribe(function () {
                        _this.getElements();
                    });
                }
                if (this.eventGetSelectedRowsSubscription) {
                    this._eventGetSelectedRowsSubscription = this.eventGetSelectedRowsSubscription.subscribe(function () {
                        _this.emitSelectedRows();
                    });
                }
                if (this.eventGetAllRowsSubscription) {
                    this._eventGetAllRowsSubscription = this.eventGetAllRowsSubscription.subscribe(function () {
                        _this.emitAllRows();
                    });
                }
                if (this.eventAddItemsSubscription) {
                    this.eventAddItemsSubscription.subscribe(function (items) {
                        _this.addItems(items);
                    });
                }
            };
        /**
         * @param {?} params
         * @return {?}
         */
        DataGridComponent.prototype.onGridReady = /**
         * @param {?} params
         * @return {?}
         */
            function (params) {
                if (this.singleSelection) {
                    this.gridOptions.rowSelection = 'single';
                }
                // if (this.nonEditable) {this.gridOptions.defaultColDef.editable = false}
                this.params = params;
                this.gridApi = params.api;
                this.gridColumnApi = params.columnApi;
                this.getElements();
                this.gridApi.sizeColumnsToFit();
                try {
                    for (var _a = __values(this.columnDefs), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var col = _b.value;
                        if (col.field === 'estat') {
                            this.statusColumn = true;
                        }
                    }
                }
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return))
                            _c.call(_a);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
                }
                var e_1, _c;
            };
        /**
         * @return {?}
         */
        DataGridComponent.prototype.emitSelectedRows = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var selectedNodes = this.gridApi.getSelectedNodes();
                /** @type {?} */
                var selectedData = selectedNodes.map(function (node) { return node.data; });
                this.getSelectedRows.emit(selectedData);
            };
        /**
         * @return {?}
         */
        DataGridComponent.prototype.emitAllRows = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var rowData = [];
                this.gridApi.forEachNode(function (node) { return rowData.push(node.data); });
                this.getSelectedRows.emit(rowData);
            };
        /**
         * @param {?} columnkeys
         * @return {?}
         */
        DataGridComponent.prototype.getColumnKeysAndHeaders = /**
         * @param {?} columnkeys
         * @return {?}
         */
            function (columnkeys) {
                /** @type {?} */
                var header = [];
                if (this.columnDefs.length == 0) {
                    return '';
                }
                /** @type {?} */
                var allColumnKeys = this.gridOptions.columnApi.getAllDisplayedColumns();
                // console.log(allColumnKeys);
                allColumnKeys.forEach(function (element) {
                    if (element.userProvidedColDef.headerName !== '') {
                        columnkeys.push(element.userProvidedColDef.field);
                        header.push(element.userProvidedColDef.headerName);
                    }
                });
                return header.join(",");
            };
        /**
         * @return {?}
         */
        DataGridComponent.prototype.exportData = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var columnkeys = [];
                /** @type {?} */
                var customHeader = '';
                customHeader = this.getColumnKeysAndHeaders(columnkeys);
                /** @type {?} */
                var params = {
                    onlySelected: true,
                    columnKeys: columnkeys,
                    customHeader: customHeader,
                    skipHeader: true
                };
                this.gridApi.exportDataAsCsv(params);
            };
        /**
         * @return {?}
         */
        DataGridComponent.prototype.quickSearch = /**
         * @return {?}
         */
            function () {
                this.gridApi.setQuickFilter(this.searchValue);
            };
        /**
         * @return {?}
         */
        DataGridComponent.prototype.getElements = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.getAll()
                    .subscribe(function (items) {
                    _this.rowData = items;
                    setTimeout(function () { _this.gridApi.sizeColumnsToFit(); }, 30);
                    _this.gridApi.setRowData(_this.rowData);
                    console.log(_this.rowData);
                });
            };
        /**
         * @param {?} newItems
         * @return {?}
         */
        DataGridComponent.prototype.addItems = /**
         * @param {?} newItems
         * @return {?}
         */
            function (newItems) {
                console.log(newItems);
                this.gridApi.updateRowData({ add: newItems });
                console.log(this.columnDefs);
            };
        /**
         * @return {?}
         */
        DataGridComponent.prototype.removeData = /**
         * @return {?}
         */
            function () {
                this.gridApi.stopEditing(false);
                /** @type {?} */
                var selectedNodes = this.gridApi.getSelectedNodes();
                /** @type {?} */
                var selectedData = selectedNodes.map(function (node) { return node.data; });
                this.remove.emit(selectedData);
                if (this.statusColumn) {
                    /** @type {?} */
                    var selectedRows = selectedNodes.map(function (node) { return node.rowIndex; });
                    try {
                        for (var selectedRows_1 = __values(selectedRows), selectedRows_1_1 = selectedRows_1.next(); !selectedRows_1_1.done; selectedRows_1_1 = selectedRows_1.next()) {
                            var id = selectedRows_1_1.value;
                            this.gridApi.getRowNode(id).data.estat = 'Eliminat';
                        }
                    }
                    catch (e_2_1) {
                        e_2 = { error: e_2_1 };
                    }
                    finally {
                        try {
                            if (selectedRows_1_1 && !selectedRows_1_1.done && (_a = selectedRows_1.return))
                                _a.call(selectedRows_1);
                        }
                        finally {
                            if (e_2)
                                throw e_2.error;
                        }
                    }
                    this.gridOptions.api.refreshCells();
                }
                this.gridOptions.api.deselectAll();
                var e_2, _a;
            };
        /**
         * @return {?}
         */
        DataGridComponent.prototype.newData = /**
         * @return {?}
         */
            function () {
                this.gridApi.stopEditing(false);
                this.new.emit(-1);
            };
        /**
         * @return {?}
         */
        DataGridComponent.prototype.onAddButtonClicked = /**
         * @return {?}
         */
            function () {
                this.gridApi.stopEditing(false);
                this.add.emit(-1);
            };
        /**
         * @return {?}
         */
        DataGridComponent.prototype.onDuplicateButtonClicked = /**
         * @return {?}
         */
            function () {
                this.gridApi.stopEditing(false);
                /** @type {?} */
                var selectedNodes = this.gridApi.getSelectedNodes();
                /** @type {?} */
                var selectedData = selectedNodes.map(function (node) { return node.data; });
                this.duplicate.emit(selectedData);
            };
        /**
         * @return {?}
         */
        DataGridComponent.prototype.applyChanges = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var itemsChanged = [];
                this.gridApi.stopEditing(false);
                try {
                    for (var _a = __values(this.changesMap.keys()), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var key = _b.value;
                        itemsChanged.push(this.gridApi.getRowNode(key).data);
                    }
                }
                catch (e_3_1) {
                    e_3 = { error: e_3_1 };
                }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return))
                            _c.call(_a);
                    }
                    finally {
                        if (e_3)
                            throw e_3.error;
                    }
                }
                this.sendChanges.emit(itemsChanged);
                this.changesMap.clear();
                this.changeCounter = 0;
                this.previousChangeCounter = 0;
                this.redoCounter = 0;
                this.params.colDef.cellStyle = { backgroundColor: '#FFFFFF' };
                this.gridApi.redrawRows();
                var e_3, _c;
            };
        /**
         * @return {?}
         */
        DataGridComponent.prototype.deleteChanges = /**
         * @return {?}
         */
            function () {
                for (var i = 0; i < this.changeCounter; i++) {
                    this.gridApi.undoCellEditing();
                }
                this.changesMap.clear();
                this.previousChangeCounter = 0;
                this.changeCounter = 0;
                this.redoCounter = 0;
                this.params.colDef.cellStyle = { backgroundColor: '#FFFFFF' };
                this.gridApi.redrawRows();
            };
        /**
         * @return {?}
         */
        DataGridComponent.prototype.onFilterModified = /**
         * @return {?}
         */
            function () {
                this.deleteChanges();
            };
        /**
         * @return {?}
         */
        DataGridComponent.prototype.undo = /**
         * @return {?}
         */
            function () {
                this.gridApi.stopEditing(false);
                this.gridApi.undoCellEditing();
                this.changeCounter -= 1;
                this.redoCounter += 1;
            };
        /**
         * @return {?}
         */
        DataGridComponent.prototype.redo = /**
         * @return {?}
         */
            function () {
                this.gridApi.stopEditing(false);
                this.gridApi.redoCellEditing();
                this.changeCounter += 1;
                this.redoCounter -= 1;
            };
        /**
         * @param {?} e
         * @return {?}
         */
        DataGridComponent.prototype.onCellEditingStopped = /**
         * @param {?} e
         * @return {?}
         */
            function (e) {
                if (this.modificationChange) {
                    this.changeCounter++;
                    this.redoCounter = 0;
                    this.onCellValueChanged(e);
                    this.modificationChange = false;
                }
            };
        /**
         * @param {?} params
         * @return {?}
         */
        DataGridComponent.prototype.onCellValueChanged = /**
         * @param {?} params
         * @return {?}
         */
            function (params) {
                this.params = params;
                if (this.changeCounter > this.previousChangeCounter) {
                    if (params.oldValue !== params.value && !(params.oldValue == null && params.value === '')) {
                        if (!this.changesMap.has(params.node.id)) {
                            /** @type {?} */
                            var addMap = new Map();
                            addMap.set(params.colDef.field, 1);
                            this.changesMap.set(params.node.id, addMap);
                        }
                        else {
                            if (!this.changesMap.get(params.node.id).has(params.colDef.field)) {
                                this.changesMap.get(params.node.id).set(params.colDef.field, 1);
                            }
                            else {
                                /** @type {?} */
                                var currentChanges = this.changesMap.get(params.node.id).get(params.colDef.field);
                                this.changesMap.get(params.node.id).set(params.colDef.field, (currentChanges + 1));
                            }
                        }
                        this.paintCells(params, this.changesMap); //We paint the row of the edited cell
                        this.previousChangeCounter++; //We match the current previousChangeCounter with changeCounter
                    }
                }
                else if (this.changeCounter < this.previousChangeCounter) {
                    /** @type {?} */
                    var currentChanges = -1;
                    if (this.changesMap.has(params.node.id)) {
                        currentChanges = this.changesMap.get(params.node.id).get(params.colDef.field);
                    }
                    if (currentChanges === 1) {
                        //Once the undo it's done, cell is in his initial status
                        this.changesMap.get(params.node.id).delete(params.colDef.field);
                        if (this.changesMap.get(params.node.id).size === 0) {
                            // No more modifications in this row
                            this.changesMap.delete(params.node.id);
                            /** @type {?} */
                            var row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
                            // We paint it white
                            this.gridApi.redrawRows({ rowNodes: [row] });
                        }
                        else {
                            this.paintCells(params, this.changesMap);
                        }
                    }
                    else if (currentChanges > 1) {
                        //We can't do else because we can be doing an undo without changes
                        this.changesMap.get(params.node.id).set(params.colDef.field, (currentChanges - 1));
                        this.paintCells(params, this.changesMap); //Not initial state -> green background
                    }
                    this.previousChangeCounter--; //We decrement previousChangeCounter because we have done undo
                }
                else {
                    // Control of modifications without changes
                    if (!(params.oldValue == null && params.value === '')) {
                        /** @type {?} */
                        var newValue = void 0;
                        if (params.value == null) {
                            newValue = '';
                        }
                        else {
                            newValue = params.value.toString();
                        }
                        if (params.oldValue != null) {
                            if (params.oldValue.toString() !== newValue.toString()) {
                                this.modificationChange = true;
                            }
                            else {
                                this.modificationWithoutChanges(params);
                            }
                        }
                        if (params.oldValue == null) {
                            if (params.oldValue !== newValue.toString()) {
                                this.modificationChange = true;
                            }
                            else {
                                this.modificationWithoutChanges(params);
                            }
                        }
                    }
                    else {
                        this.modificationWithoutChanges(params);
                    }
                }
            };
        /**
         * @param {?} params
         * @return {?}
         */
        DataGridComponent.prototype.modificationWithoutChanges = /**
         * @param {?} params
         * @return {?}
         */
            function (params) {
                if (this.changesMap.has(params.node.id)) {
                    if (!this.undoNoChanges) {
                        this.gridApi.undoCellEditing(); // Undo to delete the change without changes internally
                        this.undoNoChanges = true;
                        this.paintCells(params, this.changesMap); //The cell has modifications yet -> green background
                    }
                    else {
                        this.undoNoChanges = false;
                    }
                }
                else {
                    //With the internally undo will enter at this function, so we have to control when done the undo or not
                    if (!this.undoNoChanges) {
                        this.gridApi.undoCellEditing(); // Undo to delete the change internally
                        this.undoNoChanges = true;
                    }
                    else {
                        this.undoNoChanges = false;
                    }
                }
            };
        /**
         * @param {?} api
         * @param {?} colId
         * @return {?}
         */
        DataGridComponent.prototype.getColumnIndexByColId = /**
         * @param {?} api
         * @param {?} colId
         * @return {?}
         */
            function (api, colId) {
                return api.getAllColumns().findIndex(function (col) { return col.getColId() === colId; });
            };
        /**
         * @param {?} params
         * @param {?} changesMap
         * @return {?}
         */
        DataGridComponent.prototype.paintCells = /**
         * @param {?} params
         * @param {?} changesMap
         * @return {?}
         */
            function (params, changesMap) {
                /** @type {?} */
                var row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
                this.changeCellStyleColumns(params, changesMap, '#E8F1DE');
                this.gridApi.redrawRows({ rowNodes: [row] });
                this.changeCellStyleColumns(params, changesMap, '#FFFFFF');
                // We will define cellStyle white to future modifications (like filter)
            };
        /**
         * @param {?} params
         * @param {?} changesMap
         * @param {?} color
         * @return {?}
         */
        DataGridComponent.prototype.changeCellStyleColumns = /**
         * @param {?} params
         * @param {?} changesMap
         * @param {?} color
         * @return {?}
         */
            function (params, changesMap, color) {
                try {
                    for (var _a = __values(changesMap.get(params.node.id).keys()), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var key = _b.value;
                        /** @type {?} */
                        var columnNumber = this.getColumnIndexByColId(this.gridColumnApi, key);
                        this.gridColumnApi.columnController.gridColumns[columnNumber].colDef.cellStyle = { backgroundColor: color };
                    }
                }
                catch (e_4_1) {
                    e_4 = { error: e_4_1 };
                }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return))
                            _c.call(_a);
                    }
                    finally {
                        if (e_4)
                            throw e_4.error;
                    }
                }
                var e_4, _c;
            };
        DataGridComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'app-data-grid',
                        template: "    <div id=grup1 class=\"editDivBtns\">\n        <span *ngIf=\"title\"  [translate]=\"title\"> </span>\n        <button  mat-mini-fab class=\"editBtn\"  *ngIf=\"discardChangesButton\"  id=\"deleteChangesButton\" type=\"button\"  (click)=\"deleteChanges()\" [disabled]=\"changeCounter <= 0\">\n            <mat-icon  fontSet=\"material-icons-round\" > close </mat-icon>\n        </button>\n        <button mat-mini-fab class=\"editBtn\" *ngIf=\"undoButton\"  id=\"undo\"  (click)=\"undo()\" [disabled]=\"changeCounter <= 0\" >\n            <mat-icon fontSet=\"material-icons-round\" > undo </mat-icon>\n        </button>\n        <button mat-mini-fab class=\"editBtn\" *ngIf=\"redoButton\"  id=\"redo\"  (click)=\"redo()\" [disabled]=\"redoCounter <= 0\">\n            <mat-icon fontSet=\"material-icons-round\" > redo </mat-icon>\n        </button>\n        <button mat-mini-fab class=\"editBtn\" *ngIf=\"applyChangesButton\"  id=\"applyChangesButton\"  (click)=\"applyChanges()\" [disabled]=\"changeCounter <= 0\" >\n            <mat-icon fontSet=\"material-icons-round\" > check </mat-icon>\n        </button>\n    </div>\n\n    <div id=grup2 class=\"actionsDivBtns\" >\n        <label *ngIf=\"globalSearch\" [translate]=\"'Search'\"> </label>\n        <input *ngIf=\"globalSearch\"type=\"text\" class=\"searchGenericInput\" placeholder=\"\" (keyup)=\"quickSearch()\" [(ngModel)]=\"searchValue\" ml-2 >\n        <button *ngIf=\"deleteButton\"  mat-stroked-button id=\"deleteButton\"  (click)=\"removeData()\">\n            <mat-icon fontSet=\"material-icons-round\" > delete </mat-icon>\n            <span  [translate]=\"'Remove'\"> </span>\n            \n        </button>\n\n        \n        <button *ngIf=\"actionButton\"  mat-stroked-button [matMenuTriggerFor]=\"menu\" id=\"actionButton\">\n            <span  [translate]=\"'Actions'\"> </span>    \n            <mat-icon fontSet=\"material-icons-round\" > keyboard_arrow_down </mat-icon>     \n        </button>\n        <mat-menu #menu=\"matMenu\">\n            <button mat-menu-item *ngIf=\"!hideExportButton\" (click)=\"exportData()\" > {{\"Export\" | translate}} </button>\n            <button mat-menu-item *ngIf=\"!hideDuplicateButton\" (click)=\"onDuplicateButtonClicked()\"> {{\"Duplicate\" | translate}}</button>\n            <button mat-menu-item *ngIf=\"!hideSearchReplaceButton\"> {{\"Search/Replace\" | translate}}</button>\n        </mat-menu>  \n            \n\n        <button  *ngIf=\"newButton\" mat-stroked-button id=\"newButton\"  (click)=\"newData()\">\n            <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>      \n            <span  [translate]=\"'New'\"> </span>           \n        </button>\n\n        <button  *ngIf=\"addButton\" mat-stroked-button id=\"newButton\"  (click)=\"onAddButtonClicked()\">\n            <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>      \n            <span  [translate]=\"'Add'\"> </span>           \n        </button>\n        \n\n        \n    </div>\n\n\n\n    <div class=\"row\" style=\" height: 100%\">\n        <div id=\"myGrid\" style=\" width:100%; height: 100%\" >\n            <ag-grid-angular\n            style=\" width: 100%; height: 100%;\"\n            [class]=\"themeGrid\"\n            [floatingFilter]=\"true\"\n            [rowData]=\"rowData\"\n            [columnDefs]=\"columnDefs\"\n            [gridOptions]=\"gridOptions\"\n            [animateRows]=\"true\"\n            [pagination]=\"false\"\n            [modules]=\"modules\"     \n            [undoRedoCellEditing]=\"true\"    \n            [undoRedoCellEditingLimit]= 200\n            [suppressRowClickSelection]=true\n            [enableCellChangeFlash]=true\n            [frameworkComponents]=\"frameworkComponents\"\n            rowSelection=\"multiple\"\n            (filterModified)=\"onFilterModified()\"\n            (cellEditingStopped) =\"onCellEditingStopped($event)\"\n            (cellValueChanged)=\"onCellValueChanged($event)\"\n            (gridReady)=\"onGridReady($event)\">\n            \n            </ag-grid-angular>\n        </div>\n    </div>\n\n\n",
                        styles: ["input,label{display:inline-block;margin:5px 5px 5px 10px}#newButton{color:#fff;background:no-repeat padding-box #68a225;margin-left:3px}#deleteButton{background:no-repeat padding-box #fff;margin-left:3px}#actionButton{background:no-repeat padding-box #fff;margin-left:3px;text-align:center!important}#applyChangesButton{color:#fff!important;background:no-repeat padding-box #68a225;margin-left:3px}#applyChangesButton[disabled]{background:no-repeat padding-box #83976c}#redo,#undo{color:#fff!important;background:#ff9300;margin-left:3px}#redo[disabled],#undo[disabled]{background:#ffc97f;margin-left:3px}#deleteChangesButton{color:#fff!important;background:#df3133}#deleteChangesButton[disabled]{color:#fff!important;background:#da8c8e}.editDivBtns{margin-left:10px;text-align:start;width:130px;height:30px!important;line-height:30px!important}.actionsDivBtns{text-align:end;width:calc(100% - 140px);height:60px}.actionsDivBtns,.editDivBtns{display:inline-block!important}.actionsDivBtns .mat-stroked-button{padding:5px 20px!important}.editDivBtns .mat-mini-fab .mat-button-wrapper{padding:inherit!important;display:inherit!important}.editDivBtns .mat-icon{height:30px!important;bottom:5px;position:relative}.editDivBtns .mat-mini-fab{width:30px;height:30px}.actionsDivBtns .searchGenericInput{height:45px!important;width:45%!important}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-thumb{background:#eee}\u200B .ag-body-viewport.ag-layout-normal ::-webkit-scrollbar{width:2em;height:2em}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-button{background:#ccc}.ag-body-viewport.ag-layout-normal::-webkit-scrollbar-track-piece{background:#888}"]
                    },] },
        ];
        /** @nocollapse */
        DataGridComponent.ctorParameters = function () {
            return [
                { type: core$1.TranslateService }
            ];
        };
        DataGridComponent.propDecorators = {
            eventRefreshSubscription: [{ type: core.Input }],
            eventGetSelectedRowsSubscription: [{ type: core.Input }],
            eventGetAllRowsSubscription: [{ type: core.Input }],
            eventAddItemsSubscription: [{ type: core.Input }],
            frameworkComponents: [{ type: core.Input }],
            columnDefs: [{ type: core.Input }],
            getAll: [{ type: core.Input }],
            discardChangesButton: [{ type: core.Input }],
            undoButton: [{ type: core.Input }],
            redoButton: [{ type: core.Input }],
            applyChangesButton: [{ type: core.Input }],
            deleteButton: [{ type: core.Input }],
            newButton: [{ type: core.Input }],
            actionButton: [{ type: core.Input }],
            addButton: [{ type: core.Input }],
            globalSearch: [{ type: core.Input }],
            themeGrid: [{ type: core.Input }],
            singleSelection: [{ type: core.Input }],
            nonEditable: [{ type: core.Input }],
            title: [{ type: core.Input }],
            hideExportButton: [{ type: core.Input }],
            hideDuplicateButton: [{ type: core.Input }],
            hideSearchReplaceButton: [{ type: core.Input }],
            remove: [{ type: core.Output }],
            new: [{ type: core.Output }],
            add: [{ type: core.Output }],
            sendChanges: [{ type: core.Output }],
            duplicate: [{ type: core.Output }],
            getSelectedRows: [{ type: core.Output }],
            getAllRows: [{ type: core.Output }]
        };
        return DataGridComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var DialogGridComponent = (function () {
        function DialogGridComponent(dialogRef) {
            this.dialogRef = dialogRef;
            this.getAllRows = new rxjs.Subject();
            this.allRowsReceived = [];
            this.joinTables = new core.EventEmitter();
            // this.nonEditable = true;
            this.tablesReceivedCounter = 0;
        }
        /**
         * @return {?}
         */
        DialogGridComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                if (this.addButtonClickedSubscription) {
                    this._addButtonClickedSubscription = this.addButtonClickedSubscription.subscribe(function () {
                        _this.getAllSelectedRows();
                    });
                }
            };
        /**
         * @return {?}
         */
        DialogGridComponent.prototype.getAllSelectedRows = /**
         * @return {?}
         */
            function () {
                this.getAllRows.next(true);
            };
        /**
         * @param {?} data
         * @return {?}
         */
        DialogGridComponent.prototype.joinRowsReceived = /**
         * @param {?} data
         * @return {?}
         */
            function (data) {
                this.allRowsReceived.push(data);
                this.tablesReceivedCounter++;
                if (this.tablesReceivedCounter === this.getAllsTable.length) {
                    this.doAdd(this.allRowsReceived);
                    console.log(this.allRowsReceived);
                }
            };
        /**
         * @param {?} rowsToAdd
         * @return {?}
         */
        DialogGridComponent.prototype.doAdd = /**
         * @param {?} rowsToAdd
         * @return {?}
         */
            function (rowsToAdd) {
                this.dialogRef.close({ event: 'Add', data: rowsToAdd });
            };
        /**
         * @return {?}
         */
        DialogGridComponent.prototype.closeDialog = /**
         * @return {?}
         */
            function () {
                this.dialogRef.close({ event: 'Cancel' });
            };
        DialogGridComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'app-dialog-grid',
                        template: "<h3 mat-dialog-title>{{title}}</h3>\n<mat-dialog-content class=\"dialogConent\">\n  <div *ngFor=\"let getAll of getAllsTable; let i = index\" class=\"appDialogDataGridDiv\">\n    <app-data-grid \n    [columnDefs]=\"columnDefsTable[i]\" [themeGrid]='themeGrid'  [getAll]='getAll' [globalSearch]=true [singleSelection]=\"singleSelectionTable[i]\"\n    [title]=\"titlesTable[i]\" [nonEditable]='nonEditable' [eventGetSelectedRowsSubscription]=\"getAllRows.asObservable()\" (getSelectedRows)='joinRowsReceived($event)' >\n    </app-data-grid>\n  </div>\n</mat-dialog-content>\n<div mat-dialog-actions align=\"end\">\n  <button mat-button  (click)=\"closeDialog()\">{{\"Cancel\" | translate}}</button>\n  <button mat-button  (click)=\"getAllSelectedRows()\" cdkFocusInitial>{{\"Add\" | translate}}</button>\n</div>\n",
                        styles: [".dialogConent{margin:inherit!important;padding:inherit!important;max-height:60vh!important;height:100%;width:100%;overflow:auto}"]
                    },] },
        ];
        /** @nocollapse */
        DialogGridComponent.ctorParameters = function () {
            return [
                { type: dialog.MatDialogRef }
            ];
        };
        DialogGridComponent.propDecorators = {
            joinTables: [{ type: core.Output }]
        };
        return DialogGridComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    common.registerLocaleData(localeCa, 'ca');
    common.registerLocaleData(localeEs, 'es');
    /**
     * Load translation assets
     * @param {?} http
     * @return {?}
     */
    function createTranslateLoader(http$$1) {
        return new httpLoader.TranslateHttpLoader(http$$1, '../assets/i18n/', '.json');
    }
    var ɵ0 = (createTranslateLoader);
    /**
     * SITMUN plugin core module
     */
    var SitmunFrontendGuiModule = (function () {
        function SitmunFrontendGuiModule() {
        }
        SitmunFrontendGuiModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            router.RouterModule,
                            http.HttpClientModule,
                            common.CommonModule,
                            forms.FormsModule,
                            animations.NoopAnimationsModule,
                            frontendCore.AngularHalModule,
                            forms.ReactiveFormsModule,
                            animations.BrowserAnimationsModule,
                            angular.AgGridModule.withComponents([]),
                            frontendCore.SitmunFrontendCoreModule,
                            button.MatButtonModule,
                            icon.MatIconModule,
                            menu.MatMenuModule,
                            dialog.MatDialogModule,
                            core$1.TranslateModule.forRoot({
                                loader: {
                                    provide: core$1.TranslateLoader,
                                    useFactory: ɵ0,
                                    deps: [http.HttpClient]
                                }
                            })
                        ],
                        declarations: [
                            DataGridComponent,
                            BtnEditRenderedComponent,
                            DialogGridComponent,
                        ],
                        entryComponents: [],
                        providers: [],
                        exports: [
                            http.HttpClientModule,
                            common.CommonModule,
                            forms.FormsModule,
                            animations.NoopAnimationsModule,
                            frontendCore.AngularHalModule,
                            core$1.TranslateModule,
                            forms.ReactiveFormsModule,
                            DataGridComponent,
                            DialogGridComponent,
                            frontendCore.SitmunFrontendCoreModule
                        ]
                    },] },
        ];
        return SitmunFrontendGuiModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.DataGridComponent = DataGridComponent;
    exports.createTranslateLoader = createTranslateLoader;
    exports.SitmunFrontendGuiModule = SitmunFrontendGuiModule;
    exports.BtnEditRenderedComponent = BtnEditRenderedComponent;
    exports.DialogGridComponent = DialogGridComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0bXVuLWZyb250ZW5kLWd1aS51bWQuanMubWFwIiwic291cmNlcyI6W251bGwsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1ndWkvYnRuLWVkaXQtcmVuZGVyZWQvYnRuLWVkaXQtcmVuZGVyZWQuY29tcG9uZW50LnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWd1aS9kYXRhLWdyaWQvZGF0YS1ncmlkLmNvbXBvbmVudC50cyIsIm5nOi8vQHNpdG11bi9mcm9udGVuZC1ndWkvZGlhbG9nLWdyaWQvZGlhbG9nLWdyaWQuY29tcG9uZW50LnRzIiwibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWd1aS9zaXRtdW4tZnJvbnRlbmQtZ3VpLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLnRocm93KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSB5W29wWzBdICYgMiA/IFwicmV0dXJuXCIgOiBvcFswXSA/IFwidGhyb3dcIiA6IFwibmV4dFwiXSkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbMCwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgIH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlmIChvW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9OyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCk7XHJcbn0iLCJpbXBvcnQgeyBJQ2VsbFJlbmRlcmVyQW5ndWxhckNvbXAgfSBmcm9tICdAYWctZ3JpZC1jb21tdW5pdHkvYW5ndWxhcic7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1idG4tZWRpdC1yZW5kZXJlZCcsXHJcbiAgdGVtcGxhdGU6IGA8YnV0dG9uIG1hdC1taW5pLWZhYiBjbGFzcz1cImJ1dHRvbkVkaXRcIiAgdHlwZT1cImJ1dHRvblwiICAoY2xpY2spPVwiYnRuQ2xpY2tlZEhhbmRsZXIoJGV2ZW50KVwiID5cclxuICA8bWF0LWljb24gY2xhc3M9XCJpY29uRWRpdFwiICAgZm9udFNldD1cIm1hdGVyaWFsLWljb25zLXJvdW5kXCIgPiBlZGl0IDwvbWF0LWljb24+XHJcbjwvYnV0dG9uPiBgLFxyXG4gIHN0eWxlczogW2AuYnV0dG9uRWRpdHtjb2xvcjojMDAwO2JhY2tncm91bmQtY29sb3I6I2RkZDt3aWR0aDoyMHB4O21hcmdpbi10b3A6M3B4O2hlaWdodDoyMHB4O2JveC1zaGFkb3c6bm9uZX0uaWNvbkVkaXR7Zm9udC1zaXplOjEzcHg7bWFyZ2luLXRvcDotMTBweDttYXJnaW4tbGVmdDotMnB4fWBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBCdG5FZGl0UmVuZGVyZWRDb21wb25lbnQgaW1wbGVtZW50cyBJQ2VsbFJlbmRlcmVyQW5ndWxhckNvbXAsIE9uRGVzdHJveSB7XHJcblxyXG4gIHB1YmxpYyBwYXJhbXM6IGFueTtcclxuXHJcbiAgYWdJbml0KHBhcmFtczogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICB9XHJcblxyXG4gIHJlZnJlc2gocGFyYW1zOiBhbnkpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgYnRuQ2xpY2tlZEhhbmRsZXIoJGV2ZW50KSB7XHJcbiAgICB0aGlzLnBhcmFtcy5jbGlja2VkKHRoaXMucGFyYW1zLnZhbHVlKTtcclxuICB9XHJcblxyXG4gIGdldFBhcmFtcygpe1xyXG4gICAgcmV0dXJuIHRoaXMucGFyYW1zO1xyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICAvLyBubyBuZWVkIHRvIHJlbW92ZSB0aGUgYnV0dG9uIGNsaWNrIGhhbmRsZXIgXHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBBZ0dyaWRNb2R1bGUgfSBmcm9tICdAYWctZ3JpZC1jb21tdW5pdHkvYW5ndWxhcic7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBOZ01vZHVsZSwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgQWxsQ29tbXVuaXR5TW9kdWxlcywgQ29sdW1uQXBpLCBNb2R1bGUgfSBmcm9tICdAYWctZ3JpZC1jb21tdW5pdHkvYWxsLW1vZHVsZXMnO1xyXG5pbXBvcnQge1RyYW5zbGF0ZVNlcnZpY2V9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xyXG5pbXBvcnQge0J0bkVkaXRSZW5kZXJlZENvbXBvbmVudH0gZnJvbSAnLi4vYnRuLWVkaXQtcmVuZGVyZWQvYnRuLWVkaXQtcmVuZGVyZWQuY29tcG9uZW50JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWRhdGEtZ3JpZCcsXHJcbiAgdGVtcGxhdGU6IGAgICAgPGRpdiBpZD1ncnVwMSBjbGFzcz1cImVkaXREaXZCdG5zXCI+XHJcbiAgICAgICAgPHNwYW4gKm5nSWY9XCJ0aXRsZVwiICBbdHJhbnNsYXRlXT1cInRpdGxlXCI+IDwvc3Bhbj5cclxuICAgICAgICA8YnV0dG9uICBtYXQtbWluaS1mYWIgY2xhc3M9XCJlZGl0QnRuXCIgICpuZ0lmPVwiZGlzY2FyZENoYW5nZXNCdXR0b25cIiAgaWQ9XCJkZWxldGVDaGFuZ2VzQnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiICAoY2xpY2spPVwiZGVsZXRlQ2hhbmdlcygpXCIgW2Rpc2FibGVkXT1cImNoYW5nZUNvdW50ZXIgPD0gMFwiPlxyXG4gICAgICAgICAgICA8bWF0LWljb24gIGZvbnRTZXQ9XCJtYXRlcmlhbC1pY29ucy1yb3VuZFwiID4gY2xvc2UgPC9tYXQtaWNvbj5cclxuICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8YnV0dG9uIG1hdC1taW5pLWZhYiBjbGFzcz1cImVkaXRCdG5cIiAqbmdJZj1cInVuZG9CdXR0b25cIiAgaWQ9XCJ1bmRvXCIgIChjbGljayk9XCJ1bmRvKClcIiBbZGlzYWJsZWRdPVwiY2hhbmdlQ291bnRlciA8PSAwXCIgPlxyXG4gICAgICAgICAgICA8bWF0LWljb24gZm9udFNldD1cIm1hdGVyaWFsLWljb25zLXJvdW5kXCIgPiB1bmRvIDwvbWF0LWljb24+XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPGJ1dHRvbiBtYXQtbWluaS1mYWIgY2xhc3M9XCJlZGl0QnRuXCIgKm5nSWY9XCJyZWRvQnV0dG9uXCIgIGlkPVwicmVkb1wiICAoY2xpY2spPVwicmVkbygpXCIgW2Rpc2FibGVkXT1cInJlZG9Db3VudGVyIDw9IDBcIj5cclxuICAgICAgICAgICAgPG1hdC1pY29uIGZvbnRTZXQ9XCJtYXRlcmlhbC1pY29ucy1yb3VuZFwiID4gcmVkbyA8L21hdC1pY29uPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b24gbWF0LW1pbmktZmFiIGNsYXNzPVwiZWRpdEJ0blwiICpuZ0lmPVwiYXBwbHlDaGFuZ2VzQnV0dG9uXCIgIGlkPVwiYXBwbHlDaGFuZ2VzQnV0dG9uXCIgIChjbGljayk9XCJhcHBseUNoYW5nZXMoKVwiIFtkaXNhYmxlZF09XCJjaGFuZ2VDb3VudGVyIDw9IDBcIiA+XHJcbiAgICAgICAgICAgIDxtYXQtaWNvbiBmb250U2V0PVwibWF0ZXJpYWwtaWNvbnMtcm91bmRcIiA+IGNoZWNrIDwvbWF0LWljb24+XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGlkPWdydXAyIGNsYXNzPVwiYWN0aW9uc0RpdkJ0bnNcIiA+XHJcbiAgICAgICAgPGxhYmVsICpuZ0lmPVwiZ2xvYmFsU2VhcmNoXCIgW3RyYW5zbGF0ZV09XCInU2VhcmNoJ1wiPiA8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCAqbmdJZj1cImdsb2JhbFNlYXJjaFwidHlwZT1cInRleHRcIiBjbGFzcz1cInNlYXJjaEdlbmVyaWNJbnB1dFwiIHBsYWNlaG9sZGVyPVwiXCIgKGtleXVwKT1cInF1aWNrU2VhcmNoKClcIiBbKG5nTW9kZWwpXT1cInNlYXJjaFZhbHVlXCIgbWwtMiA+XHJcbiAgICAgICAgPGJ1dHRvbiAqbmdJZj1cImRlbGV0ZUJ1dHRvblwiICBtYXQtc3Ryb2tlZC1idXR0b24gaWQ9XCJkZWxldGVCdXR0b25cIiAgKGNsaWNrKT1cInJlbW92ZURhdGEoKVwiPlxyXG4gICAgICAgICAgICA8bWF0LWljb24gZm9udFNldD1cIm1hdGVyaWFsLWljb25zLXJvdW5kXCIgPiBkZWxldGUgPC9tYXQtaWNvbj5cclxuICAgICAgICAgICAgPHNwYW4gIFt0cmFuc2xhdGVdPVwiJ1JlbW92ZSdcIj4gPC9zcGFuPlxyXG4gICAgICAgICAgICBcclxuICAgICAgICA8L2J1dHRvbj5cclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgPGJ1dHRvbiAqbmdJZj1cImFjdGlvbkJ1dHRvblwiICBtYXQtc3Ryb2tlZC1idXR0b24gW21hdE1lbnVUcmlnZ2VyRm9yXT1cIm1lbnVcIiBpZD1cImFjdGlvbkJ1dHRvblwiPlxyXG4gICAgICAgICAgICA8c3BhbiAgW3RyYW5zbGF0ZV09XCInQWN0aW9ucydcIj4gPC9zcGFuPiAgICBcclxuICAgICAgICAgICAgPG1hdC1pY29uIGZvbnRTZXQ9XCJtYXRlcmlhbC1pY29ucy1yb3VuZFwiID4ga2V5Ym9hcmRfYXJyb3dfZG93biA8L21hdC1pY29uPiAgICAgXHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPG1hdC1tZW51ICNtZW51PVwibWF0TWVudVwiPlxyXG4gICAgICAgICAgICA8YnV0dG9uIG1hdC1tZW51LWl0ZW0gKm5nSWY9XCIhaGlkZUV4cG9ydEJ1dHRvblwiIChjbGljayk9XCJleHBvcnREYXRhKClcIiA+IHt7XCJFeHBvcnRcIiB8IHRyYW5zbGF0ZX19IDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8YnV0dG9uIG1hdC1tZW51LWl0ZW0gKm5nSWY9XCIhaGlkZUR1cGxpY2F0ZUJ1dHRvblwiIChjbGljayk9XCJvbkR1cGxpY2F0ZUJ1dHRvbkNsaWNrZWQoKVwiPiB7e1wiRHVwbGljYXRlXCIgfCB0cmFuc2xhdGV9fTwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8YnV0dG9uIG1hdC1tZW51LWl0ZW0gKm5nSWY9XCIhaGlkZVNlYXJjaFJlcGxhY2VCdXR0b25cIj4ge3tcIlNlYXJjaC9SZXBsYWNlXCIgfCB0cmFuc2xhdGV9fTwvYnV0dG9uPlxyXG4gICAgICAgIDwvbWF0LW1lbnU+ICBcclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgIDxidXR0b24gICpuZ0lmPVwibmV3QnV0dG9uXCIgbWF0LXN0cm9rZWQtYnV0dG9uIGlkPVwibmV3QnV0dG9uXCIgIChjbGljayk9XCJuZXdEYXRhKClcIj5cclxuICAgICAgICAgICAgPG1hdC1pY29uIGZvbnRTZXQ9XCJtYXRlcmlhbC1pY29ucy1yb3VuZFwiPiBhZGRfY2lyY2xlX291dGxpbmUgPC9tYXQtaWNvbj4gICAgICBcclxuICAgICAgICAgICAgPHNwYW4gIFt0cmFuc2xhdGVdPVwiJ05ldydcIj4gPC9zcGFuPiAgICAgICAgICAgXHJcbiAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgIDxidXR0b24gICpuZ0lmPVwiYWRkQnV0dG9uXCIgbWF0LXN0cm9rZWQtYnV0dG9uIGlkPVwibmV3QnV0dG9uXCIgIChjbGljayk9XCJvbkFkZEJ1dHRvbkNsaWNrZWQoKVwiPlxyXG4gICAgICAgICAgICA8bWF0LWljb24gZm9udFNldD1cIm1hdGVyaWFsLWljb25zLXJvdW5kXCI+IGFkZF9jaXJjbGVfb3V0bGluZSA8L21hdC1pY29uPiAgICAgIFxyXG4gICAgICAgICAgICA8c3BhbiAgW3RyYW5zbGF0ZV09XCInQWRkJ1wiPiA8L3NwYW4+ICAgICAgICAgICBcclxuICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgXHJcbiAgICA8L2Rpdj5cclxuXHJcblxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cIiBoZWlnaHQ6IDEwMCVcIj5cclxuICAgICAgICA8ZGl2IGlkPVwibXlHcmlkXCIgc3R5bGU9XCIgd2lkdGg6MTAwJTsgaGVpZ2h0OiAxMDAlXCIgPlxyXG4gICAgICAgICAgICA8YWctZ3JpZC1hbmd1bGFyXHJcbiAgICAgICAgICAgIHN0eWxlPVwiIHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7XCJcclxuICAgICAgICAgICAgW2NsYXNzXT1cInRoZW1lR3JpZFwiXHJcbiAgICAgICAgICAgIFtmbG9hdGluZ0ZpbHRlcl09XCJ0cnVlXCJcclxuICAgICAgICAgICAgW3Jvd0RhdGFdPVwicm93RGF0YVwiXHJcbiAgICAgICAgICAgIFtjb2x1bW5EZWZzXT1cImNvbHVtbkRlZnNcIlxyXG4gICAgICAgICAgICBbZ3JpZE9wdGlvbnNdPVwiZ3JpZE9wdGlvbnNcIlxyXG4gICAgICAgICAgICBbYW5pbWF0ZVJvd3NdPVwidHJ1ZVwiXHJcbiAgICAgICAgICAgIFtwYWdpbmF0aW9uXT1cImZhbHNlXCJcclxuICAgICAgICAgICAgW21vZHVsZXNdPVwibW9kdWxlc1wiICAgICBcclxuICAgICAgICAgICAgW3VuZG9SZWRvQ2VsbEVkaXRpbmddPVwidHJ1ZVwiICAgIFxyXG4gICAgICAgICAgICBbdW5kb1JlZG9DZWxsRWRpdGluZ0xpbWl0XT0gMjAwXHJcbiAgICAgICAgICAgIFtzdXBwcmVzc1Jvd0NsaWNrU2VsZWN0aW9uXT10cnVlXHJcbiAgICAgICAgICAgIFtlbmFibGVDZWxsQ2hhbmdlRmxhc2hdPXRydWVcclxuICAgICAgICAgICAgW2ZyYW1ld29ya0NvbXBvbmVudHNdPVwiZnJhbWV3b3JrQ29tcG9uZW50c1wiXHJcbiAgICAgICAgICAgIHJvd1NlbGVjdGlvbj1cIm11bHRpcGxlXCJcclxuICAgICAgICAgICAgKGZpbHRlck1vZGlmaWVkKT1cIm9uRmlsdGVyTW9kaWZpZWQoKVwiXHJcbiAgICAgICAgICAgIChjZWxsRWRpdGluZ1N0b3BwZWQpID1cIm9uQ2VsbEVkaXRpbmdTdG9wcGVkKCRldmVudClcIlxyXG4gICAgICAgICAgICAoY2VsbFZhbHVlQ2hhbmdlZCk9XCJvbkNlbGxWYWx1ZUNoYW5nZWQoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgIChncmlkUmVhZHkpPVwib25HcmlkUmVhZHkoJGV2ZW50KVwiPlxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgPC9hZy1ncmlkLWFuZ3VsYXI+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcblxyXG5gLFxyXG4gIHN0eWxlczogW2BpbnB1dCxsYWJlbHtkaXNwbGF5OmlubGluZS1ibG9jazttYXJnaW46NXB4IDVweCA1cHggMTBweH0jbmV3QnV0dG9ue2NvbG9yOiNmZmY7YmFja2dyb3VuZDpuby1yZXBlYXQgcGFkZGluZy1ib3ggIzY4YTIyNTttYXJnaW4tbGVmdDozcHh9I2RlbGV0ZUJ1dHRvbntiYWNrZ3JvdW5kOm5vLXJlcGVhdCBwYWRkaW5nLWJveCAjZmZmO21hcmdpbi1sZWZ0OjNweH0jYWN0aW9uQnV0dG9ue2JhY2tncm91bmQ6bm8tcmVwZWF0IHBhZGRpbmctYm94ICNmZmY7bWFyZ2luLWxlZnQ6M3B4O3RleHQtYWxpZ246Y2VudGVyIWltcG9ydGFudH0jYXBwbHlDaGFuZ2VzQnV0dG9ue2NvbG9yOiNmZmYhaW1wb3J0YW50O2JhY2tncm91bmQ6bm8tcmVwZWF0IHBhZGRpbmctYm94ICM2OGEyMjU7bWFyZ2luLWxlZnQ6M3B4fSNhcHBseUNoYW5nZXNCdXR0b25bZGlzYWJsZWRde2JhY2tncm91bmQ6bm8tcmVwZWF0IHBhZGRpbmctYm94ICM4Mzk3NmN9I3JlZG8sI3VuZG97Y29sb3I6I2ZmZiFpbXBvcnRhbnQ7YmFja2dyb3VuZDojZmY5MzAwO21hcmdpbi1sZWZ0OjNweH0jcmVkb1tkaXNhYmxlZF0sI3VuZG9bZGlzYWJsZWRde2JhY2tncm91bmQ6I2ZmYzk3ZjttYXJnaW4tbGVmdDozcHh9I2RlbGV0ZUNoYW5nZXNCdXR0b257Y29sb3I6I2ZmZiFpbXBvcnRhbnQ7YmFja2dyb3VuZDojZGYzMTMzfSNkZWxldGVDaGFuZ2VzQnV0dG9uW2Rpc2FibGVkXXtjb2xvcjojZmZmIWltcG9ydGFudDtiYWNrZ3JvdW5kOiNkYThjOGV9LmVkaXREaXZCdG5ze21hcmdpbi1sZWZ0OjEwcHg7dGV4dC1hbGlnbjpzdGFydDt3aWR0aDoxMzBweDtoZWlnaHQ6MzBweCFpbXBvcnRhbnQ7bGluZS1oZWlnaHQ6MzBweCFpbXBvcnRhbnR9LmFjdGlvbnNEaXZCdG5ze3RleHQtYWxpZ246ZW5kO3dpZHRoOmNhbGMoMTAwJSAtIDE0MHB4KTtoZWlnaHQ6NjBweH0uYWN0aW9uc0RpdkJ0bnMsLmVkaXREaXZCdG5ze2Rpc3BsYXk6aW5saW5lLWJsb2NrIWltcG9ydGFudH0uYWN0aW9uc0RpdkJ0bnMgLm1hdC1zdHJva2VkLWJ1dHRvbntwYWRkaW5nOjVweCAyMHB4IWltcG9ydGFudH0uZWRpdERpdkJ0bnMgLm1hdC1taW5pLWZhYiAubWF0LWJ1dHRvbi13cmFwcGVye3BhZGRpbmc6aW5oZXJpdCFpbXBvcnRhbnQ7ZGlzcGxheTppbmhlcml0IWltcG9ydGFudH0uZWRpdERpdkJ0bnMgLm1hdC1pY29ue2hlaWdodDozMHB4IWltcG9ydGFudDtib3R0b206NXB4O3Bvc2l0aW9uOnJlbGF0aXZlfS5lZGl0RGl2QnRucyAubWF0LW1pbmktZmFie3dpZHRoOjMwcHg7aGVpZ2h0OjMwcHh9LmFjdGlvbnNEaXZCdG5zIC5zZWFyY2hHZW5lcmljSW5wdXR7aGVpZ2h0OjQ1cHghaW1wb3J0YW50O3dpZHRoOjQ1JSFpbXBvcnRhbnR9LmFnLWJvZHktdmlld3BvcnQuYWctbGF5b3V0LW5vcm1hbCA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1ie2JhY2tncm91bmQ6I2VlZX3DosKAwosgLmFnLWJvZHktdmlld3BvcnQuYWctbGF5b3V0LW5vcm1hbCA6Oi13ZWJraXQtc2Nyb2xsYmFye3dpZHRoOjJlbTtoZWlnaHQ6MmVtfS5hZy1ib2R5LXZpZXdwb3J0LmFnLWxheW91dC1ub3JtYWwgOjotd2Via2l0LXNjcm9sbGJhci1idXR0b257YmFja2dyb3VuZDojY2NjfS5hZy1ib2R5LXZpZXdwb3J0LmFnLWxheW91dC1ub3JtYWw6Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNrLXBpZWNle2JhY2tncm91bmQ6Izg4OH1gXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGF0YUdyaWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gXHJcbiAgcHJpdmF0ZSBfZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgcHJpdmF0ZSBfZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb246IGFueTtcclxuICBwcml2YXRlIF9ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb246IGFueTtcclxuICBtb2R1bGVzOiBNb2R1bGVbXSA9IEFsbENvbW11bml0eU1vZHVsZXM7XHJcbiAgc2VhcmNoVmFsdWU6IHN0cmluZztcclxuICBwcml2YXRlIGdyaWRBcGk7XHJcbiAgcHJpdmF0ZSBncmlkQ29sdW1uQXBpO1xyXG4gIHN0YXR1c0NvbHVtbiA9IGZhbHNlO1xyXG4gIGNoYW5nZXNNYXA6IE1hcDxudW1iZXIsIE1hcDxzdHJpbmcsIG51bWJlcj4+ID0gbmV3IE1hcDxudW1iZXIsIE1hcDxzdHJpbmcsIG51bWJlcj4+KCk7XHJcbiAgIC8vIFdlIHdpbGwgc2F2ZSB0aGUgaWQgb2YgZWRpdGVkIGNlbGxzIGFuZCB0aGUgbnVtYmVyIG9mIGVkaXRpb25zIGRvbmUuXHJcbiAgcHJpdmF0ZSBwYXJhbXM7IC8vIExhc3QgcGFyYW1ldGVycyBvZiB0aGUgZ3JpZCAoaW4gY2FzZSB3ZSBkbyBhcHBseSBjaGFuZ2VzIHdlIHdpbGwgbmVlZCBpdCkgXHJcbiAgcm93RGF0YTogYW55W107XHJcbiAgY2hhbmdlQ291bnRlcjogbnVtYmVyOyAvLyBOdW1iZXIgb2YgZWRpdGlvbnMgZG9uZSBhYm92ZSBhbnkgY2VsbCBcclxuICBwcmV2aW91c0NoYW5nZUNvdW50ZXI6IG51bWJlcjsgLy8gTnVtYmVyIG9mIGRpdGlvbnMgZG9uZSBhZnRlciB0aGUgbGFzdCBtb2RpZmljYXRpb24oY2hhbmdlQ291bnRlcilcclxuICByZWRvQ291bnRlcjogbnVtYmVyOyAvLyBOdW1iZXIgb2YgcmVkbyB3ZSBjYW4gZG9cclxuICBtb2RpZmljYXRpb25DaGFuZ2UgPSBmYWxzZTtcclxuICB1bmRvTm9DaGFuZ2VzID0gZmFsc2U7IC8vIEJvb2xlYW4gdGhhdCBpbmRpY2F0ZXMgaWYgYW4gdW5kbyBoYXNuJ3QgbW9kaWZpY2F0aW9uc1xyXG4gIGdyaWRPcHRpb25zO1xyXG5cclxuXHJcbiAgQElucHV0KCkgZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlIDxib29sZWFuPiA7XHJcbiAgQElucHV0KCkgZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb246IE9ic2VydmFibGUgPGJvb2xlYW4+IDtcclxuICBASW5wdXQoKSBldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb246IE9ic2VydmFibGUgPGJvb2xlYW4+IDtcclxuICBASW5wdXQoKSBldmVudEFkZEl0ZW1zU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlIDxhbnlbXT4gO1xyXG4gIEBJbnB1dCgpIGZyYW1ld29ya0NvbXBvbmVudHM6IGFueTtcclxuICBASW5wdXQoKSBjb2x1bW5EZWZzOiBhbnlbXTtcclxuICBASW5wdXQoKSBnZXRBbGw6ICgpID0+IE9ic2VydmFibGU8YW55PjtcclxuICBASW5wdXQoKSBkaXNjYXJkQ2hhbmdlc0J1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSB1bmRvQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHJlZG9CdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYXBwbHlDaGFuZ2VzQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGRlbGV0ZUJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBuZXdCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYWN0aW9uQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGFkZEJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBnbG9iYWxTZWFyY2g6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgdGhlbWVHcmlkOiBhbnk7XHJcbiAgQElucHV0KCkgc2luZ2xlU2VsZWN0aW9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIG5vbkVkaXRhYmxlOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHRpdGxlOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgaGlkZUV4cG9ydEJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBoaWRlRHVwbGljYXRlQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGhpZGVTZWFyY2hSZXBsYWNlQnV0dG9uOiBib29sZWFuO1xyXG5cclxuXHJcbiAgQE91dHB1dCgpIHJlbW92ZTogRXZlbnRFbWl0dGVyPGFueVtdPjtcclxuICBAT3V0cHV0KCkgbmV3OiBFdmVudEVtaXR0ZXI8bnVtYmVyPjtcclxuICBAT3V0cHV0KCkgYWRkOiBFdmVudEVtaXR0ZXI8bnVtYmVyPjtcclxuICBAT3V0cHV0KCkgc2VuZENoYW5nZXM6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIGR1cGxpY2F0ZTogRXZlbnRFbWl0dGVyPGFueVtdPjtcclxuICBAT3V0cHV0KCkgZ2V0U2VsZWN0ZWRSb3dzOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG4gIEBPdXRwdXQoKSBnZXRBbGxSb3dzOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSkge1xyXG4gICAgdGhpcy50cmFuc2xhdGUgPSB0cmFuc2xhdGU7XHJcblxyXG4gICAgdGhpcy5mcmFtZXdvcmtDb21wb25lbnRzID0ge1xyXG4gICAgICBidG5FZGl0UmVuZGVyZXJDb21wb25lbnQ6IEJ0bkVkaXRSZW5kZXJlZENvbXBvbmVudFxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnJlbW92ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMubmV3ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5hZGQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLnNlbmRDaGFuZ2VzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5nZXRTZWxlY3RlZFJvd3MgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmR1cGxpY2F0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuZ2V0QWxsUm93cyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuY2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuICAgIHRoaXMuZ3JpZE9wdGlvbnMgPSB7XHJcbiAgICAgIGRlZmF1bHRDb2xEZWY6IHtcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmbGV4OiAxLFxyXG4gICAgICAgIGZpbHRlcjogdHJ1ZSxcclxuICAgICAgICBlZGl0YWJsZTogIXRoaXMubm9uRWRpdGFibGUsXHJcbiAgICAgICAgY2VsbFN0eWxlOiB7YmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRid9LFxyXG4gICAgICB9LFxyXG4gICAgICBjb2x1bW5UeXBlczoge1xyXG4gICAgICAgIGRhdGVDb2x1bW46IHtcclxuICAgICAgICAgICAgZmlsdGVyOiAnYWdEYXRlQ29sdW1uRmlsdGVyJyxcclxuICAgICAgICAgICAgZmlsdGVyUGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgY29tcGFyYXRvcihmaWx0ZXJMb2NhbERhdGVBdE1pZG5pZ2h0LCBjZWxsVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVDZWxsVmFsdWUgPSBuZXcgRGF0ZShjZWxsVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0ZUZpbHRlciA9IG5ldyBEYXRlKGZpbHRlckxvY2FsRGF0ZUF0TWlkbmlnaHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkYXRlQ2VsbFZhbHVlLmdldFRpbWUoKSA8IGRhdGVGaWx0ZXIuZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0ZUNlbGxWYWx1ZS5nZXRUaW1lKCkgID4gZGF0ZUZpbHRlci5nZXRUaW1lKCkpIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdXBwcmVzc01lbnU6IHRydWVcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgICByb3dTZWxlY3Rpb246ICdtdWx0aXBsZScsXHJcbiAgICAgIHNpbmdsZUNsaWNrRWRpdDogdHJ1ZSxcclxuICAgICAgLy8gc3VwcHJlc3NIb3Jpem9udGFsU2Nyb2xsOiB0cnVlLFxyXG4gICAgICBsb2NhbGVUZXh0RnVuYzogKGtleTogc3RyaW5nLCBkZWZhdWx0VmFsdWU6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KGtleSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGEgPT09IGtleSA/IGRlZmF1bHRWYWx1ZSA6IGRhdGE7XHJcbiAgICB9XHJcbiAgICB9O1xyXG5cclxuICB9XHJcblxyXG5cclxuICBuZ09uSW5pdCgpe1xyXG5cclxuICAgIGlmICh0aGlzLmV2ZW50UmVmcmVzaFN1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLl9ldmVudFJlZnJlc2hTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50UmVmcmVzaFN1YnNjcmlwdGlvbi5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudHMoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5ldmVudEdldFNlbGVjdGVkUm93c1N1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLl9ldmVudEdldFNlbGVjdGVkUm93c1N1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLmVtaXRTZWxlY3RlZFJvd3MoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5fZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uID0gdGhpcy5ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLmVtaXRBbGxSb3dzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKHRoaXMuZXZlbnRBZGRJdGVtc1N1YnNjcmlwdGlvbilcclxuICAgIHtcclxuICAgICAgdGhpcy5ldmVudEFkZEl0ZW1zU3Vic2NyaXB0aW9uLnN1YnNjcmliZShcclxuICAgICAgICAoaXRlbXMpID0+IHtcclxuICAgICAgICAgIHRoaXMuYWRkSXRlbXMoaXRlbXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG5cclxuXHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIG9uR3JpZFJlYWR5KHBhcmFtcyk6IHZvaWR7XHJcbiAgICBpZiAodGhpcy5zaW5nbGVTZWxlY3Rpb24pIHt0aGlzLmdyaWRPcHRpb25zLnJvd1NlbGVjdGlvbiA9ICdzaW5nbGUnfVxyXG4gICAgLy8gaWYgKHRoaXMubm9uRWRpdGFibGUpIHt0aGlzLmdyaWRPcHRpb25zLmRlZmF1bHRDb2xEZWYuZWRpdGFibGUgPSBmYWxzZX1cclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgdGhpcy5ncmlkQXBpID0gcGFyYW1zLmFwaTtcclxuICAgIHRoaXMuZ3JpZENvbHVtbkFwaSA9IHBhcmFtcy5jb2x1bW5BcGk7XHJcbiAgICB0aGlzLmdldEVsZW1lbnRzKCk7XHJcbiAgICB0aGlzLmdyaWRBcGkuc2l6ZUNvbHVtbnNUb0ZpdCgpO1xyXG4gICAgZm9yIChjb25zdCBjb2wgb2YgdGhpcy5jb2x1bW5EZWZzKSB7XHJcbiAgICAgIGlmIChjb2wuZmllbGQgPT09ICdlc3RhdCcpIHtcclxuICAgICAgICB0aGlzLnN0YXR1c0NvbHVtbiA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIFxyXG4gIGVtaXRTZWxlY3RlZFJvd3MoKTogdm9pZHtcclxuICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSB0aGlzLmdyaWRBcGkuZ2V0U2VsZWN0ZWROb2RlcygpO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWREYXRhID0gc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiBub2RlLmRhdGEpO1xyXG4gICAgdGhpcy5nZXRTZWxlY3RlZFJvd3MuZW1pdChzZWxlY3RlZERhdGEpO1xyXG4gIH1cclxuXHJcbiAgZW1pdEFsbFJvd3MoKTogdm9pZHtcclxuICAgIGxldCByb3dEYXRhID0gW107XHJcbiAgICB0aGlzLmdyaWRBcGkuZm9yRWFjaE5vZGUobm9kZSA9PiByb3dEYXRhLnB1c2gobm9kZS5kYXRhKSk7XHJcbiAgICB0aGlzLmdldFNlbGVjdGVkUm93cy5lbWl0KHJvd0RhdGEpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29sdW1uS2V5c0FuZEhlYWRlcnMoY29sdW1ua2V5czogQXJyYXk8YW55Pik6IFN0cmluZ3sgICAgXHJcbiAgICBsZXQgaGVhZGVyOkFycmF5PGFueT4gPSBbXTtcclxuICAgIGlmICh0aGlzLmNvbHVtbkRlZnMubGVuZ3RoID09IDApIHtyZXR1cm4gJyd9O1xyXG5cclxuICAgIGxldCBhbGxDb2x1bW5LZXlzPXRoaXMuZ3JpZE9wdGlvbnMuY29sdW1uQXBpLmdldEFsbERpc3BsYXllZENvbHVtbnMoKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKGFsbENvbHVtbktleXMpO1xyXG4gICAgYWxsQ29sdW1uS2V5cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgIGlmIChlbGVtZW50LnVzZXJQcm92aWRlZENvbERlZi5oZWFkZXJOYW1lICE9PSAnJylcclxuICAgICAgICB7XHJcbiAgICAgICAgICBjb2x1bW5rZXlzLnB1c2goZWxlbWVudC51c2VyUHJvdmlkZWRDb2xEZWYuZmllbGQpO1xyXG4gICAgICAgICAgaGVhZGVyLnB1c2goZWxlbWVudC51c2VyUHJvdmlkZWRDb2xEZWYuaGVhZGVyTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICBcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICByZXR1cm4gaGVhZGVyLmpvaW4oXCIsXCIpO1xyXG4gIH1cclxuXHJcblxyXG4gIGV4cG9ydERhdGEoKTogdm9pZHtcclxuICAgIGxldCBjb2x1bW5rZXlzOkFycmF5PGFueT4gPSBbXTtcclxuICAgIGxldCBjdXN0b21IZWFkZXI6U3RyaW5nID0gJyc7XHJcbiAgICBjdXN0b21IZWFkZXIgPSB0aGlzLmdldENvbHVtbktleXNBbmRIZWFkZXJzKGNvbHVtbmtleXMpXHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG9ubHlTZWxlY3RlZDogdHJ1ZSxcclxuICAgICAgICBjb2x1bW5LZXlzOiBjb2x1bW5rZXlzLFxyXG4gICAgICAgIGN1c3RvbUhlYWRlcjogY3VzdG9tSGVhZGVyLFxyXG4gICAgICAgIHNraXBIZWFkZXI6IHRydWVcclxuICAgIH07XHJcbiAgICB0aGlzLmdyaWRBcGkuZXhwb3J0RGF0YUFzQ3N2KHBhcmFtcyk7XHJcbiAgfVxyXG5cclxuICBxdWlja1NlYXJjaCgpOiB2b2lke1xyXG4gICAgdGhpcy5ncmlkQXBpLnNldFF1aWNrRmlsdGVyKHRoaXMuc2VhcmNoVmFsdWUpO1xyXG59XHJcblxyXG4gIGdldEVsZW1lbnRzKCk6IHZvaWRcclxuICB7XHJcbiAgICB0aGlzLmdldEFsbCgpXHJcbiAgICAuc3Vic2NyaWJlKChpdGVtcykgPT4ge1xyXG4gICAgICAgIHRoaXMucm93RGF0YSA9IGl0ZW1zO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCk9Pnt0aGlzLmdyaWRBcGkuc2l6ZUNvbHVtbnNUb0ZpdCgpfSwgMzApO1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS5zZXRSb3dEYXRhKHRoaXMucm93RGF0YSk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5yb3dEYXRhKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgIGFkZEl0ZW1zKG5ld0l0ZW1zOiBhbnlbXSk6IHZvaWQge1xyXG4gICAgY29uc29sZS5sb2cobmV3SXRlbXMpO1xyXG5cclxuICAgIHRoaXMuZ3JpZEFwaS51cGRhdGVSb3dEYXRhKHsgYWRkOiBuZXdJdGVtcyB9KTtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuY29sdW1uRGVmcyk7XHJcblxyXG4gIH1cclxuXHJcbiAgcmVtb3ZlRGF0YSgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKTtcclxuICAgIGNvbnN0IHNlbGVjdGVkRGF0YSA9IHNlbGVjdGVkTm9kZXMubWFwKG5vZGUgPT4gbm9kZS5kYXRhKTtcclxuICAgIHRoaXMucmVtb3ZlLmVtaXQoc2VsZWN0ZWREYXRhKTtcclxuXHJcbiAgICBpZih0aGlzLnN0YXR1c0NvbHVtbilcclxuICAgIHtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRSb3dzID0gc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiBub2RlLnJvd0luZGV4KTtcclxuXHJcbiAgICAgIGZvciAoY29uc3QgaWQgb2Ygc2VsZWN0ZWRSb3dzKXtcclxuICAgICAgICAgIHRoaXMuZ3JpZEFwaS5nZXRSb3dOb2RlKGlkKS5kYXRhLmVzdGF0ID0nRWxpbWluYXQnO1xyXG4gICAgICAgIH1cclxuICAgICAgdGhpcy5ncmlkT3B0aW9ucy5hcGkucmVmcmVzaENlbGxzKCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmdyaWRPcHRpb25zLmFwaS5kZXNlbGVjdEFsbCgpO1xyXG4gIH1cclxuXHJcbiAgbmV3RGF0YSgpOiB2b2lkXHJcbiAge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIHRoaXMubmV3LmVtaXQoLTEpO1xyXG4gIH1cclxuXHJcbiAgb25BZGRCdXR0b25DbGlja2VkKCk6IHZvaWRcclxuICB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgdGhpcy5hZGQuZW1pdCgtMSk7XHJcbiAgfVxyXG5cclxuICBvbkR1cGxpY2F0ZUJ1dHRvbkNsaWNrZWQoKTogdm9pZFxyXG4gIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKTtcclxuICAgIGNvbnN0IHNlbGVjdGVkRGF0YSA9IHNlbGVjdGVkTm9kZXMubWFwKG5vZGUgPT4gbm9kZS5kYXRhKTtcclxuICAgIHRoaXMuZHVwbGljYXRlLmVtaXQoc2VsZWN0ZWREYXRhKTtcclxuICB9XHJcblxyXG5cclxuICBhcHBseUNoYW5nZXMoKTogdm9pZFxyXG4gIHtcclxuICAgIGNvbnN0IGl0ZW1zQ2hhbmdlZDogYW55W10gPSBbXTtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBvZiB0aGlzLmNoYW5nZXNNYXAua2V5cygpKVxyXG4gICAge1xyXG4gICAgICBpdGVtc0NoYW5nZWQucHVzaCh0aGlzLmdyaWRBcGkuZ2V0Um93Tm9kZShrZXkpLmRhdGEpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zZW5kQ2hhbmdlcy5lbWl0KGl0ZW1zQ2hhbmdlZCk7XHJcbiAgICB0aGlzLmNoYW5nZXNNYXAuY2xlYXIoKTtcclxuICAgIHRoaXMuY2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuICAgIHRoaXMucGFyYW1zLmNvbERlZi5jZWxsU3R5bGUgPSAge2JhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnfTtcclxuICAgIHRoaXMuZ3JpZEFwaS5yZWRyYXdSb3dzKCk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIGRlbGV0ZUNoYW5nZXMoKTogdm9pZFxyXG4gIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGFuZ2VDb3VudGVyOyBpKyspXHJcbiAgICB7XHJcbiAgICAgIHRoaXMuZ3JpZEFwaS51bmRvQ2VsbEVkaXRpbmcoKTtcclxuICAgIH1cclxuICAgIHRoaXMuY2hhbmdlc01hcC5jbGVhcigpO1xyXG4gICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5jaGFuZ2VDb3VudGVyID0gMDtcclxuICAgIHRoaXMucmVkb0NvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5wYXJhbXMuY29sRGVmLmNlbGxTdHlsZSA9ICB7YmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRid9O1xyXG4gICAgdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3MoKTtcclxuICB9XHJcblxyXG5cclxuICBvbkZpbHRlck1vZGlmaWVkKCk6IHZvaWR7XHJcbiAgICB0aGlzLmRlbGV0ZUNoYW5nZXMoKTtcclxuICB9XHJcblxyXG5cclxuICB1bmRvKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIHRoaXMuZ3JpZEFwaS51bmRvQ2VsbEVkaXRpbmcoKTtcclxuICAgIHRoaXMuY2hhbmdlQ291bnRlciAtPSAxO1xyXG4gICAgdGhpcy5yZWRvQ291bnRlciArPSAxO1xyXG4gIH1cclxuXHJcbiAgcmVkbygpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICB0aGlzLmdyaWRBcGkucmVkb0NlbGxFZGl0aW5nKCk7XHJcbiAgICB0aGlzLmNoYW5nZUNvdW50ZXIgKz0gMTtcclxuICAgIHRoaXMucmVkb0NvdW50ZXIgLT0gMTtcclxuICB9XHJcblxyXG5cclxuICBvbkNlbGxFZGl0aW5nU3RvcHBlZChlKVxyXG4gIHtcclxuICAgICAgaWYgKHRoaXMubW9kaWZpY2F0aW9uQ2hhbmdlKVxyXG4gICAgICB7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VDb3VudGVyKys7XHJcbiAgICAgICAgdGhpcy5yZWRvQ291bnRlciA9IDA7XHJcbiAgICAgICAgdGhpcy5vbkNlbGxWYWx1ZUNoYW5nZWQoZSk7XHJcbiAgICAgICAgdGhpcy5tb2RpZmljYXRpb25DaGFuZ2UgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIG9uQ2VsbFZhbHVlQ2hhbmdlZChwYXJhbXMpOiB2b2lke1xyXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7IFxyXG4gICAgaWYgKHRoaXMuY2hhbmdlQ291bnRlciA+IHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyKVxyXG4gICAgICAvLyBUcnVlIGlmIHdlIGhhdmUgZWRpdGVkIHNvbWUgY2VsbCBvciB3ZSBoYXZlIGRvbmUgYSByZWRvIFxyXG4gICAgICB7XHJcblxyXG4gICAgICAgIGlmIChwYXJhbXMub2xkVmFsdWUgIT09IHBhcmFtcy52YWx1ZSAmJiAhKHBhcmFtcy5vbGRWYWx1ZSA9PSBudWxsICYmIHBhcmFtcy52YWx1ZSA9PT0gJycpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgaWYgKCEgdGhpcy5jaGFuZ2VzTWFwLmhhcyhwYXJhbXMubm9kZS5pZCkpIC8vIElmIGl0J3MgZmlydHMgZWRpdCBvZiBhIGNlbGwsIHdlIGFkZCBpdCB0byB0aGUgbWFwIGFuZCB3ZSBwYWludCBpdFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBhZGRNYXA6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xyXG4gICAgICAgICAgICBhZGRNYXAuc2V0KHBhcmFtcy5jb2xEZWYuZmllbGQsIDEpXHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlc01hcC5zZXQocGFyYW1zLm5vZGUuaWQsIGFkZE1hcCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBpZiAoISB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5oYXMocGFyYW1zLmNvbERlZi5maWVsZCkpXHJcbiAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuc2V0KHBhcmFtcy5jb2xEZWYuZmllbGQsIDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgIC8vIFdlIGFscmVhZHkgaGFkIGVkaXRlZCB0aGlzIGNlbGwsIHNvIHdlIG9ubHkgaW5jcmVtZW50IG51bWJlciBvZiBjaGFuZ2VzIG9mIGl0IG9uIHRoZSBtYXAgXHJcbiAgICAgICAgICAgICBjb25zdCBjdXJyZW50Q2hhbmdlcyA9IHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmdldChwYXJhbXMuY29sRGVmLmZpZWxkKTtcclxuICAgICAgICAgICAgIHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLnNldChwYXJhbXMuY29sRGVmLmZpZWxkLCAoY3VycmVudENoYW5nZXMgKyAxKSk7XHJcbiAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMucGFpbnRDZWxscyhwYXJhbXMsIHRoaXMuY2hhbmdlc01hcCk7IC8vV2UgcGFpbnQgdGhlIHJvdyBvZiB0aGUgZWRpdGVkIGNlbGwgXHJcbiAgICAgICAgICB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlcisrOyAvL1dlIG1hdGNoIHRoZSBjdXJyZW50IHByZXZpb3VzQ2hhbmdlQ291bnRlciB3aXRoIGNoYW5nZUNvdW50ZXJcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9XHJcbiAgICBlbHNlIGlmICh0aGlzLmNoYW5nZUNvdW50ZXIgPCB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlcil7IC8vIFRydWUgaWYgd2UgaGF2ZSBkb25lIGFuIHVuZG9cclxuICAgICAgICBsZXQgY3VycmVudENoYW5nZXMgPSAtMTtcclxuICAgICAgICBpZiAodGhpcy5jaGFuZ2VzTWFwLmhhcyhwYXJhbXMubm9kZS5pZCkpIHtjdXJyZW50Q2hhbmdlcyA9IHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmdldChwYXJhbXMuY29sRGVmLmZpZWxkKTt9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGN1cnJlbnRDaGFuZ2VzID09PSAxKSB7IC8vT25jZSB0aGUgdW5kbyBpdCdzIGRvbmUsIGNlbGwgaXMgaW4gaGlzIGluaXRpYWwgc3RhdHVzXHJcblxyXG4gICAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuZGVsZXRlKHBhcmFtcy5jb2xEZWYuZmllbGQpO1xyXG4gICAgICAgICAgaWYodGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuc2l6ZSA9PT0gMCkgeyAvLyBObyBtb3JlIG1vZGlmaWNhdGlvbnMgaW4gdGhpcyByb3dcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLmRlbGV0ZShwYXJhbXMubm9kZS5pZCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuZ3JpZEFwaS5nZXREaXNwbGF5ZWRSb3dBdEluZGV4KHBhcmFtcy5yb3dJbmRleCk7XHJcblxyXG4gICAgICAgICAgICAvLyBXZSBwYWludCBpdCB3aGl0ZVxyXG4gICAgICAgICAgICB0aGlzLmdyaWRBcGkucmVkcmF3Um93cyh7cm93Tm9kZXM6IFtyb3ddfSk7XHJcblxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRoaXMucGFpbnRDZWxscyhwYXJhbXMsIHRoaXMuY2hhbmdlc01hcCk7XHJcbiAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY3VycmVudENoYW5nZXMgPjEpIC8vIFRoZSBjZWxsIGlzbid0IGluIGhpcyBpbml0aWFsIHN0YXRlIHlldFxyXG4gICAgICAgIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1dlIGNhbid0IGRvIGVsc2UgYmVjYXVzZSB3ZSBjYW4gYmUgZG9pbmcgYW4gdW5kbyB3aXRob3V0IGNoYW5nZXMgXHJcbiAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5zZXQocGFyYW1zLmNvbERlZi5maWVsZCwgKGN1cnJlbnRDaGFuZ2VzIC0gMSkpO1xyXG5cclxuICAgICAgICAgIHRoaXMucGFpbnRDZWxscyhwYXJhbXMsIHRoaXMuY2hhbmdlc01hcCk7Ly9Ob3QgaW5pdGlhbCBzdGF0ZSAtPiBncmVlbiBiYWNrZ3JvdW5kXHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlci0tOyAgLy9XZSBkZWNyZW1lbnQgcHJldmlvdXNDaGFuZ2VDb3VudGVyIGJlY2F1c2Ugd2UgaGF2ZSBkb25lIHVuZG9cclxuICAgIH1cclxuICAgIGVsc2V7IC8vIENvbnRyb2wgb2YgbW9kaWZpY2F0aW9ucyB3aXRob3V0IGNoYW5nZXNcclxuICAgICAgaWYoICEocGFyYW1zLm9sZFZhbHVlID09IG51bGwgJiYgcGFyYW1zLnZhbHVlID09PSAnJykpXHJcbiAgICAgIHtcclxuICAgICAgICBsZXQgbmV3VmFsdWU6IHN0cmluZztcclxuICAgICAgICBpZihwYXJhbXMudmFsdWUgPT0gbnVsbCkge25ld1ZhbHVlPScnfVxyXG4gICAgICAgIGVsc2V7IG5ld1ZhbHVlID0gcGFyYW1zLnZhbHVlLnRvU3RyaW5nKCkgfVxyXG5cclxuXHJcbiAgICAgICAgaWYocGFyYW1zLm9sZFZhbHVlICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWYgKHBhcmFtcy5vbGRWYWx1ZS50b1N0cmluZygpICE9PSBuZXdWYWx1ZS50b1N0cmluZygpKSB7IHRoaXMubW9kaWZpY2F0aW9uQ2hhbmdlID0gdHJ1ZTsgfVxyXG4gICAgICAgICAgZWxzZSB7dGhpcy5tb2RpZmljYXRpb25XaXRob3V0Q2hhbmdlcyhwYXJhbXMpfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihwYXJhbXMub2xkVmFsdWUgPT0gbnVsbCApICAgICAgICAge1xyXG4gICAgICAgICAgaWYgKHBhcmFtcy5vbGRWYWx1ZSAhPT0gbmV3VmFsdWUudG9TdHJpbmcoKSkgeyB0aGlzLm1vZGlmaWNhdGlvbkNoYW5nZSA9IHRydWU7IH1cclxuICAgICAgICAgIGVsc2Uge3RoaXMubW9kaWZpY2F0aW9uV2l0aG91dENoYW5nZXMocGFyYW1zKX1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7dGhpcy5tb2RpZmljYXRpb25XaXRob3V0Q2hhbmdlcyhwYXJhbXMpfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbW9kaWZpY2F0aW9uV2l0aG91dENoYW5nZXMocGFyYW1zOiBhbnkpIHtcclxuXHJcbiAgICBpZiAoIHRoaXMuY2hhbmdlc01hcC5oYXMocGFyYW1zLm5vZGUuaWQpKSAvL01vZGlmaWNhdGlvbiB3aXRob3V0IGNoYW5nZXMgaW4gZW4gZWRpdGVkIGNlbGxcclxuICAgIHtcclxuICAgICAgaWYoIXRoaXMudW5kb05vQ2hhbmdlcylcclxuICAgICAge1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS51bmRvQ2VsbEVkaXRpbmcoKTsgLy8gVW5kbyB0byBkZWxldGUgdGhlIGNoYW5nZSB3aXRob3V0IGNoYW5nZXMgaW50ZXJuYWxseSBcclxuICAgICAgICB0aGlzLnVuZG9Ob0NoYW5nZXMgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucGFpbnRDZWxscyhwYXJhbXMsIHRoaXMuY2hhbmdlc01hcCk7ICAvL1RoZSBjZWxsIGhhcyBtb2RpZmljYXRpb25zIHlldCAtPiBncmVlbiBiYWNrZ3JvdW5kIFxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgeyB0aGlzLnVuZG9Ob0NoYW5nZXMgPSBmYWxzZTsgfVxyXG5cclxuXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgLy9XaXRoIHRoZSBpbnRlcm5hbGx5IHVuZG8gd2lsbCBlbnRlciBhdCB0aGlzIGZ1bmN0aW9uLCBzbyB3ZSBoYXZlIHRvIGNvbnRyb2wgd2hlbiBkb25lIHRoZSB1bmRvIG9yIG5vdCBcclxuICAgICAgaWYoIXRoaXMudW5kb05vQ2hhbmdlcylcclxuICAgICAge1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS51bmRvQ2VsbEVkaXRpbmcoKTsgLy8gVW5kbyB0byBkZWxldGUgdGhlIGNoYW5nZSBpbnRlcm5hbGx5XHJcbiAgICAgICAgdGhpcy51bmRvTm9DaGFuZ2VzID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHsgdGhpcy51bmRvTm9DaGFuZ2VzID0gZmFsc2U7IH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBnZXRDb2x1bW5JbmRleEJ5Q29sSWQoYXBpOiBDb2x1bW5BcGksIGNvbElkOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIGFwaS5nZXRBbGxDb2x1bW5zKCkuZmluZEluZGV4KGNvbCA9PiBjb2wuZ2V0Q29sSWQoKSA9PT0gY29sSWQpO1xyXG4gIH1cclxuICBwYWludENlbGxzKHBhcmFtczogYW55LCAgY2hhbmdlc01hcDogTWFwPG51bWJlciwgTWFwPHN0cmluZywgbnVtYmVyPj4sIClcclxuICB7XHJcbiAgICBjb25zdCByb3cgPSB0aGlzLmdyaWRBcGkuZ2V0RGlzcGxheWVkUm93QXRJbmRleChwYXJhbXMucm93SW5kZXgpO1xyXG5cclxuICAgIHRoaXMuY2hhbmdlQ2VsbFN0eWxlQ29sdW1ucyhwYXJhbXMsY2hhbmdlc01hcCwnI0U4RjFERScpO1xyXG4gICAgdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3Moe3Jvd05vZGVzOiBbcm93XX0pO1xyXG4gICAgdGhpcy5jaGFuZ2VDZWxsU3R5bGVDb2x1bW5zKHBhcmFtcyxjaGFuZ2VzTWFwLCcjRkZGRkZGJyk7IFxyXG4gICAgLy8gV2Ugd2lsbCBkZWZpbmUgY2VsbFN0eWxlIHdoaXRlIHRvIGZ1dHVyZSBtb2RpZmljYXRpb25zIChsaWtlIGZpbHRlcilcclxuICB9XHJcblxyXG4gIGNoYW5nZUNlbGxTdHlsZUNvbHVtbnMocGFyYW1zOiBhbnksIGNoYW5nZXNNYXA6IE1hcDxudW1iZXIsIE1hcDxzdHJpbmcsIG51bWJlcj4+LCBjb2xvcjogc3RyaW5nKXtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBjaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkua2V5cygpKVxyXG4gICAge1xyXG4gICAgICBjb25zdCBjb2x1bW5OdW1iZXIgPSB0aGlzLmdldENvbHVtbkluZGV4QnlDb2xJZCh0aGlzLmdyaWRDb2x1bW5BcGksIGtleSk7XHJcbiAgICAgIHRoaXMuZ3JpZENvbHVtbkFwaS5jb2x1bW5Db250cm9sbGVyLmdyaWRDb2x1bW5zW2NvbHVtbk51bWJlcl0uY29sRGVmLmNlbGxTdHlsZSA9IHtiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yfTtcclxuICAgIH1cclxuXHJcblxyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgTWF0RGlhbG9nUmVmIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGlhbG9nRGF0YSB7XHJcbiAgX0dldEFsbHNUYWJsZTogIEFycmF5PCgpID0+IE9ic2VydmFibGU8YW55Pj47XHJcbiAgX2NvbHVtbkRlZnNUYWJsZTogQXJyYXk8YW55W10+O1xyXG4gIF9zaW5nbGVTZWxlY3Rpb25UYWJsZTogQXJyYXk8Ym9vbGVhbj47XHJcbn1cclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1kaWFsb2ctZ3JpZCcsXHJcbiAgdGVtcGxhdGU6IGA8aDMgbWF0LWRpYWxvZy10aXRsZT57e3RpdGxlfX08L2gzPlxyXG48bWF0LWRpYWxvZy1jb250ZW50IGNsYXNzPVwiZGlhbG9nQ29uZW50XCI+XHJcbiAgPGRpdiAqbmdGb3I9XCJsZXQgZ2V0QWxsIG9mIGdldEFsbHNUYWJsZTsgbGV0IGkgPSBpbmRleFwiIGNsYXNzPVwiYXBwRGlhbG9nRGF0YUdyaWREaXZcIj5cclxuICAgIDxhcHAtZGF0YS1ncmlkIFxyXG4gICAgW2NvbHVtbkRlZnNdPVwiY29sdW1uRGVmc1RhYmxlW2ldXCIgW3RoZW1lR3JpZF09J3RoZW1lR3JpZCcgIFtnZXRBbGxdPSdnZXRBbGwnIFtnbG9iYWxTZWFyY2hdPXRydWUgW3NpbmdsZVNlbGVjdGlvbl09XCJzaW5nbGVTZWxlY3Rpb25UYWJsZVtpXVwiXHJcbiAgICBbdGl0bGVdPVwidGl0bGVzVGFibGVbaV1cIiBbbm9uRWRpdGFibGVdPSdub25FZGl0YWJsZScgW2V2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uXT1cImdldEFsbFJvd3MuYXNPYnNlcnZhYmxlKClcIiAoZ2V0U2VsZWN0ZWRSb3dzKT0nam9pblJvd3NSZWNlaXZlZCgkZXZlbnQpJyA+XHJcbiAgICA8L2FwcC1kYXRhLWdyaWQ+XHJcbiAgPC9kaXY+XHJcbjwvbWF0LWRpYWxvZy1jb250ZW50PlxyXG48ZGl2IG1hdC1kaWFsb2ctYWN0aW9ucyBhbGlnbj1cImVuZFwiPlxyXG4gIDxidXR0b24gbWF0LWJ1dHRvbiAgKGNsaWNrKT1cImNsb3NlRGlhbG9nKClcIj57e1wiQ2FuY2VsXCIgfCB0cmFuc2xhdGV9fTwvYnV0dG9uPlxyXG4gIDxidXR0b24gbWF0LWJ1dHRvbiAgKGNsaWNrKT1cImdldEFsbFNlbGVjdGVkUm93cygpXCIgY2RrRm9jdXNJbml0aWFsPnt7XCJBZGRcIiB8IHRyYW5zbGF0ZX19PC9idXR0b24+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2AuZGlhbG9nQ29uZW50e21hcmdpbjppbmhlcml0IWltcG9ydGFudDtwYWRkaW5nOmluaGVyaXQhaW1wb3J0YW50O21heC1oZWlnaHQ6NjB2aCFpbXBvcnRhbnQ7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzphdXRvfWBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEaWFsb2dHcmlkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgdGl0bGU6IHN0cmluZztcclxuICBnZXRBbGxSb3dzOiBTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IFN1YmplY3QgPGJvb2xlYW4+KCk7XHJcbiAgcHJpdmF0ZSBfYWRkQnV0dG9uQ2xpY2tlZFN1YnNjcmlwdGlvbjogYW55O1xyXG4gIHRhYmxlc1JlY2VpdmVkQ291bnRlcjogbnVtYmVyO1xyXG4gIGFsbFJvd3NSZWNlaXZlZDogQXJyYXk8YW55W10+ID0gW107XHJcblxyXG4gIC8vSW5wdXRzXHJcbiAgdGhlbWVHcmlkOiBhbnk7XHJcbiAgZ2V0QWxsc1RhYmxlOiBBcnJheTwoKSA9PiBPYnNlcnZhYmxlPGFueT4+O1xyXG4gIGNvbHVtbkRlZnNUYWJsZTogQXJyYXk8YW55W10+O1xyXG4gIHNpbmdsZVNlbGVjdGlvblRhYmxlOiBBcnJheTxib29sZWFuPjtcclxuICB0aXRsZXNUYWJsZTogQXJyYXk8c3RyaW5nPjtcclxuICBhZGRCdXR0b25DbGlja2VkU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlIDxib29sZWFuPiA7XHJcbiAgbm9uRWRpdGFibGU6IGJvb2xlYW47XHJcblxyXG4gIC8vT3V0cHV0c1xyXG4gIEBPdXRwdXQoKSBqb2luVGFibGVzIDogRXZlbnRFbWl0dGVyPEFycmF5PGFueVtdPj47XHJcblxyXG4gIFxyXG5cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxEaWFsb2dHcmlkQ29tcG9uZW50Pikge1xyXG4gICAgXHJcbiAgICB0aGlzLmpvaW5UYWJsZXMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICAvLyB0aGlzLm5vbkVkaXRhYmxlID0gdHJ1ZTtcclxuICAgIHRoaXMudGFibGVzUmVjZWl2ZWRDb3VudGVyID0gMDtcclxuICAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuXHJcbiAgICBpZiAodGhpcy5hZGRCdXR0b25DbGlja2VkU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuX2FkZEJ1dHRvbkNsaWNrZWRTdWJzY3JpcHRpb24gPSB0aGlzLmFkZEJ1dHRvbkNsaWNrZWRTdWJzY3JpcHRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLmdldEFsbFNlbGVjdGVkUm93cygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBnZXRBbGxTZWxlY3RlZFJvd3MoKSB7XHJcbiAgICB0aGlzLmdldEFsbFJvd3MubmV4dCh0cnVlKTtcclxuICB9XHJcblxyXG4gIGpvaW5Sb3dzUmVjZWl2ZWQoZGF0YTogYW55W10pXHJcbiAge1xyXG4gICAgICB0aGlzLmFsbFJvd3NSZWNlaXZlZC5wdXNoKGRhdGEpO1xyXG4gICAgICB0aGlzLnRhYmxlc1JlY2VpdmVkQ291bnRlcisrO1xyXG4gICAgICBpZih0aGlzLnRhYmxlc1JlY2VpdmVkQ291bnRlciA9PT0gdGhpcy5nZXRBbGxzVGFibGUubGVuZ3RoKVxyXG4gICAgICB7XHJcbiAgICAgICAgdGhpcy5kb0FkZCh0aGlzLmFsbFJvd3NSZWNlaXZlZCk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5hbGxSb3dzUmVjZWl2ZWQpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBkb0FkZChyb3dzVG9BZGQpe1xyXG4gICAgdGhpcy5kaWFsb2dSZWYuY2xvc2Uoe2V2ZW50OidBZGQnLGRhdGE6IHJvd3NUb0FkZH0pO1xyXG4gIH1cclxuXHJcbiAgY2xvc2VEaWFsb2coKXtcclxuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHtldmVudDonQ2FuY2VsJ30pO1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50TW9kdWxlLCBIdHRwQ2xpZW50LCBIVFRQX0lOVEVSQ0VQVE9SUyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUsIE5vb3BBbmltYXRpb25zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcclxuaW1wb3J0IHsgUm91dGVyTW9kdWxlLCBSb3V0ZXMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5cclxuLy9pbXBvcnQgKiBhcyBvbCBmcm9tICdvcGVubGF5ZXJzJztcclxuaW1wb3J0IHsgVHJhbnNsYXRlTW9kdWxlLCBUcmFuc2xhdGVMb2FkZXIsIFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcclxuaW1wb3J0IHsgcmVnaXN0ZXJMb2NhbGVEYXRhIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgQW5ndWxhckhhbE1vZHVsZSB9IGZyb20gJ0BzaXRtdW4vZnJvbnRlbmQtY29yZSc7XHJcblxyXG5cclxuaW1wb3J0IHsgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IGxvY2FsZUNhIGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9sb2NhbGVzL2NhJztcclxuaW1wb3J0IGxvY2FsZUVzIGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9sb2NhbGVzL2VzJztcclxuaW1wb3J0IHsgU2l0bXVuRnJvbnRlbmRDb3JlTW9kdWxlIH0gZnJvbSAnQHNpdG11bi9mcm9udGVuZC1jb3JlJztcclxuaW1wb3J0IHsgRGF0YUdyaWRDb21wb25lbnQgfSBmcm9tICcuL2RhdGEtZ3JpZC9kYXRhLWdyaWQuY29tcG9uZW50JztcclxuXHJcbmltcG9ydCB7IEFnR3JpZE1vZHVsZSB9IGZyb20gJ0BhZy1ncmlkLWNvbW11bml0eS9hbmd1bGFyJztcclxuaW1wb3J0IHsgTWF0QnV0dG9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uJztcclxuaW1wb3J0IHsgTWF0SWNvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xyXG5pbXBvcnQgeyBNYXRNZW51TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbWVudSc7XHJcbmltcG9ydCB7IE1hdERpYWxvZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XHJcbmltcG9ydCB7IEJ0bkVkaXRSZW5kZXJlZENvbXBvbmVudCB9IGZyb20gJy4vYnRuLWVkaXQtcmVuZGVyZWQvYnRuLWVkaXQtcmVuZGVyZWQuY29tcG9uZW50JztcclxuXHJcbmltcG9ydCB7IFRyYW5zbGF0ZUh0dHBMb2FkZXIgfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9odHRwLWxvYWRlcic7XHJcbmltcG9ydCB7IERpYWxvZ0dyaWRDb21wb25lbnQgfSBmcm9tICcuL2RpYWxvZy1ncmlkL2RpYWxvZy1ncmlkLmNvbXBvbmVudCc7XHJcblxyXG5cclxucmVnaXN0ZXJMb2NhbGVEYXRhKGxvY2FsZUNhLCAnY2EnKTtcclxucmVnaXN0ZXJMb2NhbGVEYXRhKGxvY2FsZUVzLCAnZXMnKTtcclxuXHJcbi8qKiBMb2FkIHRyYW5zbGF0aW9uIGFzc2V0cyAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhbnNsYXRlTG9hZGVyKGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICByZXR1cm4gbmV3IFRyYW5zbGF0ZUh0dHBMb2FkZXIoaHR0cCwgJy4uL2Fzc2V0cy9pMThuLycsICcuanNvbicpO1xyXG59XHJcblxyXG5cclxuLyoqIFNJVE1VTiBwbHVnaW4gY29yZSBtb2R1bGUgKi9cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBSb3V0ZXJNb2R1bGUsXHJcbiAgICBIdHRwQ2xpZW50TW9kdWxlLFxyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgRm9ybXNNb2R1bGUsXHJcbiAgICBOb29wQW5pbWF0aW9uc01vZHVsZSxcclxuICAgIEFuZ3VsYXJIYWxNb2R1bGUsXHJcbiAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxyXG4gICAgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUsXHJcbiAgICBBZ0dyaWRNb2R1bGUud2l0aENvbXBvbmVudHMoW10pLFxyXG4gICAgU2l0bXVuRnJvbnRlbmRDb3JlTW9kdWxlLFxyXG4gICAgTWF0QnV0dG9uTW9kdWxlLFxyXG4gICAgTWF0SWNvbk1vZHVsZSxcclxuICAgIE1hdE1lbnVNb2R1bGUsXHJcbiAgICBNYXREaWFsb2dNb2R1bGUsXHJcbiAgICBUcmFuc2xhdGVNb2R1bGUuZm9yUm9vdCh7XHJcbiAgICAgIGxvYWRlcjoge1xyXG4gICAgICAgIHByb3ZpZGU6IFRyYW5zbGF0ZUxvYWRlcixcclxuICAgICAgICB1c2VGYWN0b3J5OiAoY3JlYXRlVHJhbnNsYXRlTG9hZGVyKSxcclxuICAgICAgICBkZXBzOiBbSHR0cENsaWVudF1cclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIERhdGFHcmlkQ29tcG9uZW50LFxyXG4gICAgQnRuRWRpdFJlbmRlcmVkQ29tcG9uZW50LFxyXG4gICAgRGlhbG9nR3JpZENvbXBvbmVudCxcclxuICBdLFxyXG4gIGVudHJ5Q29tcG9uZW50czogW1xyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBIdHRwQ2xpZW50TW9kdWxlLFxyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgRm9ybXNNb2R1bGUsXHJcbiAgICBOb29wQW5pbWF0aW9uc01vZHVsZSxcclxuICAgIEFuZ3VsYXJIYWxNb2R1bGUsXHJcbiAgICBUcmFuc2xhdGVNb2R1bGUsXHJcbiAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxyXG4gICAgRGF0YUdyaWRDb21wb25lbnQsXHJcbiAgICBEaWFsb2dHcmlkQ29tcG9uZW50LFxyXG4gICAgU2l0bXVuRnJvbnRlbmRDb3JlTW9kdWxlXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2l0bXVuRnJvbnRlbmRHdWlNb2R1bGUge1xyXG59XHJcbiJdLCJuYW1lcyI6WyJDb21wb25lbnQiLCJBbGxDb21tdW5pdHlNb2R1bGVzIiwiRXZlbnRFbWl0dGVyIiwidHNsaWJfMS5fX3ZhbHVlcyIsIlRyYW5zbGF0ZVNlcnZpY2UiLCJJbnB1dCIsIk91dHB1dCIsIlN1YmplY3QiLCJNYXREaWFsb2dSZWYiLCJyZWdpc3RlckxvY2FsZURhdGEiLCJodHRwIiwiVHJhbnNsYXRlSHR0cExvYWRlciIsIk5nTW9kdWxlIiwiUm91dGVyTW9kdWxlIiwiSHR0cENsaWVudE1vZHVsZSIsIkNvbW1vbk1vZHVsZSIsIkZvcm1zTW9kdWxlIiwiTm9vcEFuaW1hdGlvbnNNb2R1bGUiLCJBbmd1bGFySGFsTW9kdWxlIiwiUmVhY3RpdmVGb3Jtc01vZHVsZSIsIkJyb3dzZXJBbmltYXRpb25zTW9kdWxlIiwiQWdHcmlkTW9kdWxlIiwiU2l0bXVuRnJvbnRlbmRDb3JlTW9kdWxlIiwiTWF0QnV0dG9uTW9kdWxlIiwiTWF0SWNvbk1vZHVsZSIsIk1hdE1lbnVNb2R1bGUiLCJNYXREaWFsb2dNb2R1bGUiLCJUcmFuc2xhdGVNb2R1bGUiLCJUcmFuc2xh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