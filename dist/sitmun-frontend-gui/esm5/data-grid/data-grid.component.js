/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { TranslateService } from '@ngx-translate/core';
import { BtnEditRenderedComponent } from '../btn-edit-rendered/btn-edit-rendered.component';
var DataGridComponent = /** @class */ (function () {
    function DataGridComponent(translate) {
        var _this = this;
        this.translate = translate;
        this.modules = AllCommunityModules;
        this.statusColumn = false;
        this.changesMap = new Map();
        this.modificationChange = false;
        this.undoNoChanges = false;
        this.translate = translate;
        this.frameworkComponents = {
            btnEditRendererComponent: BtnEditRenderedComponent
        };
        this.remove = new EventEmitter();
        this.new = new EventEmitter();
        this.add = new EventEmitter();
        this.sendChanges = new EventEmitter();
        this.getSelectedRows = new EventEmitter();
        this.duplicate = new EventEmitter();
        this.getAllRows = new EventEmitter();
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
                         */
                        function (filterLocalDateAtMidnight, cellValue) {
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
            for (var _a = tslib_1.__values(this.columnDefs), _b = _a.next(); !_b.done; _b = _a.next()) {
                var col = _b.value;
                if (col.field === 'estat') {
                    this.statusColumn = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
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
        ;
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
                for (var selectedRows_1 = tslib_1.__values(selectedRows), selectedRows_1_1 = selectedRows_1.next(); !selectedRows_1_1.done; selectedRows_1_1 = selectedRows_1.next()) {
                    var id = selectedRows_1_1.value;
                    this.gridApi.getRowNode(id).data.estat = 'Eliminat';
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (selectedRows_1_1 && !selectedRows_1_1.done && (_a = selectedRows_1.return)) _a.call(selectedRows_1);
                }
                finally { if (e_2) throw e_2.error; }
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
            for (var _a = tslib_1.__values(this.changesMap.keys()), _b = _a.next(); !_b.done; _b = _a.next()) {
                var key = _b.value;
                itemsChanged.push(this.gridApi.getRowNode(key).data);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_3) throw e_3.error; }
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
            for (var _a = tslib_1.__values(changesMap.get(params.node.id).keys()), _b = _a.next(); !_b.done; _b = _a.next()) {
                var key = _b.value;
                /** @type {?} */
                var columnNumber = this.getColumnIndexByColId(this.gridColumnApi, key);
                this.gridColumnApi.columnController.gridColumns[columnNumber].colDef.cellStyle = { backgroundColor: color };
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_4) throw e_4.error; }
        }
        var e_4, _c;
    };
    DataGridComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-data-grid',
                    template: "    <div id=grup1 class=\"editDivBtns\">\n        <span *ngIf=\"title\"  [translate]=\"title\"> </span>\n        <button  mat-mini-fab class=\"editBtn\"  *ngIf=\"discardChangesButton\"  id=\"deleteChangesButton\" type=\"button\"  (click)=\"deleteChanges()\" [disabled]=\"changeCounter <= 0\">\n            <mat-icon  fontSet=\"material-icons-round\" > close </mat-icon>\n        </button>\n        <button mat-mini-fab class=\"editBtn\" *ngIf=\"undoButton\"  id=\"undo\"  (click)=\"undo()\" [disabled]=\"changeCounter <= 0\" >\n            <mat-icon fontSet=\"material-icons-round\" > undo </mat-icon>\n        </button>\n        <button mat-mini-fab class=\"editBtn\" *ngIf=\"redoButton\"  id=\"redo\"  (click)=\"redo()\" [disabled]=\"redoCounter <= 0\">\n            <mat-icon fontSet=\"material-icons-round\" > redo </mat-icon>\n        </button>\n        <button mat-mini-fab class=\"editBtn\" *ngIf=\"applyChangesButton\"  id=\"applyChangesButton\"  (click)=\"applyChanges()\" [disabled]=\"changeCounter <= 0\" >\n            <mat-icon fontSet=\"material-icons-round\" > check </mat-icon>\n        </button>\n    </div>\n\n    <div id=grup2 class=\"actionsDivBtns\" >\n        <label *ngIf=\"globalSearch\" [translate]=\"'Search'\"> </label>\n        <input *ngIf=\"globalSearch\"type=\"text\" class=\"searchGenericInput\" placeholder=\"\" (keyup)=\"quickSearch()\" [(ngModel)]=\"searchValue\" ml-2 >\n        <button *ngIf=\"deleteButton\"  mat-stroked-button id=\"deleteButton\"  (click)=\"removeData()\">\n            <mat-icon fontSet=\"material-icons-round\" > delete </mat-icon>\n            <span  [translate]=\"'Remove'\"> </span>\n            \n        </button>\n\n        \n        <button *ngIf=\"actionButton\"  mat-stroked-button [matMenuTriggerFor]=\"menu\" id=\"actionButton\">\n            <span  [translate]=\"'Actions'\"> </span>    \n            <mat-icon fontSet=\"material-icons-round\" > keyboard_arrow_down </mat-icon>     \n        </button>\n        <mat-menu #menu=\"matMenu\">\n            <button mat-menu-item *ngIf=\"!hideExportButton\" (click)=\"exportData()\" > {{\"Export\" | translate}} </button>\n            <button mat-menu-item *ngIf=\"!hideDuplicateButton\" (click)=\"onDuplicateButtonClicked()\"> {{\"Duplicate\" | translate}}</button>\n            <button mat-menu-item *ngIf=\"!hideSearchReplaceButton\"> {{\"Search/Replace\" | translate}}</button>\n        </mat-menu>  \n            \n\n        <button  *ngIf=\"newButton\" mat-stroked-button id=\"newButton\"  (click)=\"newData()\">\n            <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>      \n            <span  [translate]=\"'New'\"> </span>           \n        </button>\n\n        <button  *ngIf=\"addButton\" mat-stroked-button id=\"newButton\"  (click)=\"onAddButtonClicked()\">\n            <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>      \n            <span  [translate]=\"'Add'\"> </span>           \n        </button>\n        \n\n        \n    </div>\n\n\n\n    <div class=\"row\" style=\" height: 100%\">\n        <div id=\"myGrid\" style=\" width:100%; height: 100%\" >\n            <ag-grid-angular\n            style=\" width: 100%; height: 100%;\"\n            [class]=\"themeGrid\"\n            [floatingFilter]=\"true\"\n            [rowData]=\"rowData\"\n            [columnDefs]=\"columnDefs\"\n            [gridOptions]=\"gridOptions\"\n            [animateRows]=\"true\"\n            [pagination]=\"false\"\n            [modules]=\"modules\"     \n            [undoRedoCellEditing]=\"true\"    \n            [undoRedoCellEditingLimit]= 200\n            [suppressRowClickSelection]=true\n            [enableCellChangeFlash]=true\n            [frameworkComponents]=\"frameworkComponents\"\n            rowSelection=\"multiple\"\n            (filterModified)=\"onFilterModified()\"\n            (cellEditingStopped) =\"onCellEditingStopped($event)\"\n            (cellValueChanged)=\"onCellValueChanged($event)\"\n            (gridReady)=\"onGridReady($event)\">\n            \n            </ag-grid-angular>\n        </div>\n    </div>\n\n\n",
                    styles: ["input,label{display:inline-block;margin:5px 5px 5px 10px}#newButton{color:#fff;background:no-repeat padding-box #68a225;margin-left:3px}#deleteButton{background:no-repeat padding-box #fff;margin-left:3px}#actionButton{background:no-repeat padding-box #fff;margin-left:3px;text-align:center!important}#applyChangesButton{color:#fff!important;background:no-repeat padding-box #68a225;margin-left:3px}#applyChangesButton[disabled]{background:no-repeat padding-box #83976c}#redo,#undo{color:#fff!important;background:#ff9300;margin-left:3px}#redo[disabled],#undo[disabled]{background:#ffc97f;margin-left:3px}#deleteChangesButton{color:#fff!important;background:#df3133}#deleteChangesButton[disabled]{color:#fff!important;background:#da8c8e}.editDivBtns{margin-left:10px;text-align:start;width:130px;height:30px!important;line-height:30px!important}.actionsDivBtns{text-align:end;width:calc(100% - 140px);height:60px}.actionsDivBtns,.editDivBtns{display:inline-block!important}.actionsDivBtns .mat-stroked-button{padding:5px 20px!important}.editDivBtns .mat-mini-fab .mat-button-wrapper{padding:inherit!important;display:inherit!important}.editDivBtns .mat-icon{height:30px!important;bottom:5px;position:relative}.editDivBtns .mat-mini-fab{width:30px;height:30px}.actionsDivBtns .searchGenericInput{height:45px!important;width:45%!important}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-thumb{background:#eee}\u200B .ag-body-viewport.ag-layout-normal ::-webkit-scrollbar{width:2em;height:2em}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-button{background:#ccc}.ag-body-viewport.ag-layout-normal::-webkit-scrollbar-track-piece{background:#888}"]
                },] },
    ];
    /** @nocollapse */
    DataGridComponent.ctorParameters = function () { return [
        { type: TranslateService }
    ]; };
    DataGridComponent.propDecorators = {
        eventRefreshSubscription: [{ type: Input }],
        eventGetSelectedRowsSubscription: [{ type: Input }],
        eventGetAllRowsSubscription: [{ type: Input }],
        eventAddItemsSubscription: [{ type: Input }],
        frameworkComponents: [{ type: Input }],
        columnDefs: [{ type: Input }],
        getAll: [{ type: Input }],
        discardChangesButton: [{ type: Input }],
        undoButton: [{ type: Input }],
        redoButton: [{ type: Input }],
        applyChangesButton: [{ type: Input }],
        deleteButton: [{ type: Input }],
        newButton: [{ type: Input }],
        actionButton: [{ type: Input }],
        addButton: [{ type: Input }],
        globalSearch: [{ type: Input }],
        themeGrid: [{ type: Input }],
        singleSelection: [{ type: Input }],
        nonEditable: [{ type: Input }],
        title: [{ type: Input }],
        hideExportButton: [{ type: Input }],
        hideDuplicateButton: [{ type: Input }],
        hideSearchReplaceButton: [{ type: Input }],
        remove: [{ type: Output }],
        new: [{ type: Output }],
        add: [{ type: Output }],
        sendChanges: [{ type: Output }],
        duplicate: [{ type: Output }],
        getSelectedRows: [{ type: Output }],
        getAllRows: [{ type: Output }]
    };
    return DataGridComponent;
}());
export { DataGridComponent };
if (false) {
    /** @type {?} */
    DataGridComponent.prototype._eventRefreshSubscription;
    /** @type {?} */
    DataGridComponent.prototype._eventGetSelectedRowsSubscription;
    /** @type {?} */
    DataGridComponent.prototype._eventGetAllRowsSubscription;
    /** @type {?} */
    DataGridComponent.prototype.modules;
    /** @type {?} */
    DataGridComponent.prototype.searchValue;
    /** @type {?} */
    DataGridComponent.prototype.gridApi;
    /** @type {?} */
    DataGridComponent.prototype.gridColumnApi;
    /** @type {?} */
    DataGridComponent.prototype.statusColumn;
    /** @type {?} */
    DataGridComponent.prototype.changesMap;
    /** @type {?} */
    DataGridComponent.prototype.params;
    /** @type {?} */
    DataGridComponent.prototype.rowData;
    /** @type {?} */
    DataGridComponent.prototype.changeCounter;
    /** @type {?} */
    DataGridComponent.prototype.previousChangeCounter;
    /** @type {?} */
    DataGridComponent.prototype.redoCounter;
    /** @type {?} */
    DataGridComponent.prototype.modificationChange;
    /** @type {?} */
    DataGridComponent.prototype.undoNoChanges;
    /** @type {?} */
    DataGridComponent.prototype.gridOptions;
    /** @type {?} */
    DataGridComponent.prototype.eventRefreshSubscription;
    /** @type {?} */
    DataGridComponent.prototype.eventGetSelectedRowsSubscription;
    /** @type {?} */
    DataGridComponent.prototype.eventGetAllRowsSubscription;
    /** @type {?} */
    DataGridComponent.prototype.eventAddItemsSubscription;
    /** @type {?} */
    DataGridComponent.prototype.frameworkComponents;
    /** @type {?} */
    DataGridComponent.prototype.columnDefs;
    /** @type {?} */
    DataGridComponent.prototype.getAll;
    /** @type {?} */
    DataGridComponent.prototype.discardChangesButton;
    /** @type {?} */
    DataGridComponent.prototype.undoButton;
    /** @type {?} */
    DataGridComponent.prototype.redoButton;
    /** @type {?} */
    DataGridComponent.prototype.applyChangesButton;
    /** @type {?} */
    DataGridComponent.prototype.deleteButton;
    /** @type {?} */
    DataGridComponent.prototype.newButton;
    /** @type {?} */
    DataGridComponent.prototype.actionButton;
    /** @type {?} */
    DataGridComponent.prototype.addButton;
    /** @type {?} */
    DataGridComponent.prototype.globalSearch;
    /** @type {?} */
    DataGridComponent.prototype.themeGrid;
    /** @type {?} */
    DataGridComponent.prototype.singleSelection;
    /** @type {?} */
    DataGridComponent.prototype.nonEditable;
    /** @type {?} */
    DataGridComponent.prototype.title;
    /** @type {?} */
    DataGridComponent.prototype.hideExportButton;
    /** @type {?} */
    DataGridComponent.prototype.hideDuplicateButton;
    /** @type {?} */
    DataGridComponent.prototype.hideSearchReplaceButton;
    /** @type {?} */
    DataGridComponent.prototype.remove;
    /** @type {?} */
    DataGridComponent.prototype.new;
    /** @type {?} */
    DataGridComponent.prototype.add;
    /** @type {?} */
    DataGridComponent.prototype.sendChanges;
    /** @type {?} */
    DataGridComponent.prototype.duplicate;
    /** @type {?} */
    DataGridComponent.prototype.getSelectedRows;
    /** @type {?} */
    DataGridComponent.prototype.getAllRows;
    /** @type {?} */
    DataGridComponent.prototype.translate;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1ncmlkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzaXRtdW4vZnJvbnRlbmQtZ3VpLyIsInNvdXJjZXMiOlsiZGF0YS1ncmlkL2RhdGEtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxPQUFPLEVBQUUsU0FBUyxFQUFvQixLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6RixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRWxDLE9BQU8sRUFBRSxtQkFBbUIsRUFBcUIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN4RixPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxrREFBa0QsQ0FBQzs7SUFnSnhGLDJCQUFtQixTQUEyQjtRQUE5QyxpQkFzREM7UUF0RGtCLGNBQVMsR0FBVCxTQUFTLENBQWtCO3VCQW5EMUIsbUJBQW1COzRCQUl4QixLQUFLOzBCQUMyQixJQUFJLEdBQUcsRUFBK0I7a0NBT2hFLEtBQUs7NkJBQ1YsS0FBSztRQXVDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFFM0IsSUFBSSxDQUFDLG1CQUFtQixHQUFHO1lBQ3pCLHdCQUF3QixFQUFFLHdCQUF3QjtTQUNuRCxDQUFDO1FBRUYsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsU0FBUyxHQUFH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QUNob0Q7Ozs7Z0JBeEZPLGdCQUFnQjs7OzJDQStHckIsS0FBSzttREFDTCxLQUFLOzhDQUNMLEtBQUs7NENBQ0wsS0FBSztzQ0FDTCxLQUFLOzZCQUNMLEtBQUs7eUJBQ0wsS0FBSzt1Q0FDTCxLQUFLOzZCQUNMLEtBQUs7NkJBQ0wsS0FBSztxQ0FDTCxLQUFLOytCQUNMLEtBQUs7NEJBQ0wsS0FBSzsrQkFDTCxLQUFLOzRCQUNMLEtBQUs7K0JBQ0wsS0FBSzs0QkFDTCxLQUFLO2tDQUNMLEtBQUs7OEJBQ0wsS0FBSzt3QkFDTCxLQUFLO21DQUNMLEtBQUs7c0NBQ0wsS0FBSzswQ0FDTCxLQUFLO3lCQUdMLE1BQU07c0JBQ04sTUFBTTtzQkFDTixNQUFNOzhCQUNOLE1BQU07NEJBQ04sTUFBTTtrQ0FDTixNQUFNOzZCQUNOLE1BQU07OzRCQXBKVDs7U0ErRmEsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWdHcmlkTW9kdWxlIH0gZnJvbSAnQGFnLWdyaWQtY29tbXVuaXR5L2FuZ3VsYXInO1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgTmdNb2R1bGUsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IEFsbENvbW11bml0eU1vZHVsZXMsIENvbHVtbkFwaSwgTW9kdWxlIH0gZnJvbSAnQGFnLWdyaWQtY29tbXVuaXR5L2FsbC1tb2R1bGVzJztcclxuaW1wb3J0IHtUcmFuc2xhdGVTZXJ2aWNlfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcclxuaW1wb3J0IHtCdG5FZGl0UmVuZGVyZWRDb21wb25lbnR9IGZyb20gJy4uL2J0bi1lZGl0LXJlbmRlcmVkL2J0bi1lZGl0LXJlbmRlcmVkLmNvbXBvbmVudCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1kYXRhLWdyaWQnLFxyXG4gIHRlbXBsYXRlOiBgICAgIDxkaXYgaWQ9Z3J1cDEgY2xhc3M9XCJlZGl0RGl2QnRuc1wiPlxyXG4gICAgICAgIDxzcGFuICpuZ0lmPVwidGl0bGVcIiAgW3RyYW5zbGF0ZV09XCJ0aXRsZVwiPiA8L3NwYW4+XHJcbiAgICAgICAgPGJ1dHRvbiAgbWF0LW1pbmktZmFiIGNsYXNzPVwiZWRpdEJ0blwiICAqbmdJZj1cImRpc2NhcmRDaGFuZ2VzQnV0dG9uXCIgIGlkPVwiZGVsZXRlQ2hhbmdlc0J1dHRvblwiIHR5cGU9XCJidXR0b25cIiAgKGNsaWNrKT1cImRlbGV0ZUNoYW5nZXMoKVwiIFtkaXNhYmxlZF09XCJjaGFuZ2VDb3VudGVyIDw9IDBcIj5cclxuICAgICAgICAgICAgPG1hdC1pY29uICBmb250U2V0PVwibWF0ZXJpYWwtaWNvbnMtcm91bmRcIiA+IGNsb3NlIDwvbWF0LWljb24+XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPGJ1dHRvbiBtYXQtbWluaS1mYWIgY2xhc3M9XCJlZGl0QnRuXCIgKm5nSWY9XCJ1bmRvQnV0dG9uXCIgIGlkPVwidW5kb1wiICAoY2xpY2spPVwidW5kbygpXCIgW2Rpc2FibGVkXT1cImNoYW5nZUNvdW50ZXIgPD0gMFwiID5cclxuICAgICAgICAgICAgPG1hdC1pY29uIGZvbnRTZXQ9XCJtYXRlcmlhbC1pY29ucy1yb3VuZFwiID4gdW5kbyA8L21hdC1pY29uPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b24gbWF0LW1pbmktZmFiIGNsYXNzPVwiZWRpdEJ0blwiICpuZ0lmPVwicmVkb0J1dHRvblwiICBpZD1cInJlZG9cIiAgKGNsaWNrKT1cInJlZG8oKVwiIFtkaXNhYmxlZF09XCJyZWRvQ291bnRlciA8PSAwXCI+XHJcbiAgICAgICAgICAgIDxtYXQtaWNvbiBmb250U2V0PVwibWF0ZXJpYWwtaWNvbnMtcm91bmRcIiA+IHJlZG8gPC9tYXQtaWNvbj5cclxuICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8YnV0dG9uIG1hdC1taW5pLWZhYiBjbGFzcz1cImVkaXRCdG5cIiAqbmdJZj1cImFwcGx5Q2hhbmdlc0J1dHRvblwiICBpZD1cImFwcGx5Q2hhbmdlc0J1dHRvblwiICAoY2xpY2spPVwiYXBwbHlDaGFuZ2VzKClcIiBbZGlzYWJsZWRdPVwiY2hhbmdlQ291bnRlciA8PSAwXCIgPlxyXG4gICAgICAgICAgICA8bWF0LWljb24gZm9udFNldD1cIm1hdGVyaWFsLWljb25zLXJvdW5kXCIgPiBjaGVjayA8L21hdC1pY29uPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBpZD1ncnVwMiBjbGFzcz1cImFjdGlvbnNEaXZCdG5zXCIgPlxyXG4gICAgICAgIDxsYWJlbCAqbmdJZj1cImdsb2JhbFNlYXJjaFwiIFt0cmFuc2xhdGVdPVwiJ1NlYXJjaCdcIj4gPC9sYWJlbD5cclxuICAgICAgICA8aW5wdXQgKm5nSWY9XCJnbG9iYWxTZWFyY2hcInR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJzZWFyY2hHZW5lcmljSW5wdXRcIiBwbGFjZWhvbGRlcj1cIlwiIChrZXl1cCk9XCJxdWlja1NlYXJjaCgpXCIgWyhuZ01vZGVsKV09XCJzZWFyY2hWYWx1ZVwiIG1sLTIgPlxyXG4gICAgICAgIDxidXR0b24gKm5nSWY9XCJkZWxldGVCdXR0b25cIiAgbWF0LXN0cm9rZWQtYnV0dG9uIGlkPVwiZGVsZXRlQnV0dG9uXCIgIChjbGljayk9XCJyZW1vdmVEYXRhKClcIj5cclxuICAgICAgICAgICAgPG1hdC1pY29uIGZvbnRTZXQ9XCJtYXRlcmlhbC1pY29ucy1yb3VuZFwiID4gZGVsZXRlIDwvbWF0LWljb24+XHJcbiAgICAgICAgICAgIDxzcGFuICBbdHJhbnNsYXRlXT1cIidSZW1vdmUnXCI+IDwvc3Bhbj5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIDxidXR0b24gKm5nSWY9XCJhY3Rpb25CdXR0b25cIiAgbWF0LXN0cm9rZWQtYnV0dG9uIFttYXRNZW51VHJpZ2dlckZvcl09XCJtZW51XCIgaWQ9XCJhY3Rpb25CdXR0b25cIj5cclxuICAgICAgICAgICAgPHNwYW4gIFt0cmFuc2xhdGVdPVwiJ0FjdGlvbnMnXCI+IDwvc3Bhbj4gICAgXHJcbiAgICAgICAgICAgIDxtYXQtaWNvbiBmb250U2V0PVwibWF0ZXJpYWwtaWNvbnMtcm91bmRcIiA+IGtleWJvYXJkX2Fycm93X2Rvd24gPC9tYXQtaWNvbj4gICAgIFxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDxtYXQtbWVudSAjbWVudT1cIm1hdE1lbnVcIj5cclxuICAgICAgICAgICAgPGJ1dHRvbiBtYXQtbWVudS1pdGVtICpuZ0lmPVwiIWhpZGVFeHBvcnRCdXR0b25cIiAoY2xpY2spPVwiZXhwb3J0RGF0YSgpXCIgPiB7e1wiRXhwb3J0XCIgfCB0cmFuc2xhdGV9fSA8L2J1dHRvbj5cclxuICAgICAgICAgICAgPGJ1dHRvbiBtYXQtbWVudS1pdGVtICpuZ0lmPVwiIWhpZGVEdXBsaWNhdGVCdXR0b25cIiAoY2xpY2spPVwib25EdXBsaWNhdGVCdXR0b25DbGlja2VkKClcIj4ge3tcIkR1cGxpY2F0ZVwiIHwgdHJhbnNsYXRlfX08L2J1dHRvbj5cclxuICAgICAgICAgICAgPGJ1dHRvbiBtYXQtbWVudS1pdGVtICpuZ0lmPVwiIWhpZGVTZWFyY2hSZXBsYWNlQnV0dG9uXCI+IHt7XCJTZWFyY2gvUmVwbGFjZVwiIHwgdHJhbnNsYXRlfX08L2J1dHRvbj5cclxuICAgICAgICA8L21hdC1tZW51PiAgXHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICA8YnV0dG9uICAqbmdJZj1cIm5ld0J1dHRvblwiIG1hdC1zdHJva2VkLWJ1dHRvbiBpZD1cIm5ld0J1dHRvblwiICAoY2xpY2spPVwibmV3RGF0YSgpXCI+XHJcbiAgICAgICAgICAgIDxtYXQtaWNvbiBmb250U2V0PVwibWF0ZXJpYWwtaWNvbnMtcm91bmRcIj4gYWRkX2NpcmNsZV9vdXRsaW5lIDwvbWF0LWljb24+ICAgICAgXHJcbiAgICAgICAgICAgIDxzcGFuICBbdHJhbnNsYXRlXT1cIidOZXcnXCI+IDwvc3Bhbj4gICAgICAgICAgIFxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICA8YnV0dG9uICAqbmdJZj1cImFkZEJ1dHRvblwiIG1hdC1zdHJva2VkLWJ1dHRvbiBpZD1cIm5ld0J1dHRvblwiICAoY2xpY2spPVwib25BZGRCdXR0b25DbGlja2VkKClcIj5cclxuICAgICAgICAgICAgPG1hdC1pY29uIGZvbnRTZXQ9XCJtYXRlcmlhbC1pY29ucy1yb3VuZFwiPiBhZGRfY2lyY2xlX291dGxpbmUgPC9tYXQtaWNvbj4gICAgICBcclxuICAgICAgICAgICAgPHNwYW4gIFt0cmFuc2xhdGVdPVwiJ0FkZCdcIj4gPC9zcGFuPiAgICAgICAgICAgXHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIFxyXG4gICAgPC9kaXY+XHJcblxyXG5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCIgaGVpZ2h0OiAxMDAlXCI+XHJcbiAgICAgICAgPGRpdiBpZD1cIm15R3JpZFwiIHN0eWxlPVwiIHdpZHRoOjEwMCU7IGhlaWdodDogMTAwJVwiID5cclxuICAgICAgICAgICAgPGFnLWdyaWQtYW5ndWxhclxyXG4gICAgICAgICAgICBzdHlsZT1cIiB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlO1wiXHJcbiAgICAgICAgICAgIFtjbGFzc109XCJ0aGVtZUdyaWRcIlxyXG4gICAgICAgICAgICBbZmxvYXRpbmdGaWx0ZXJdPVwidHJ1ZVwiXHJcbiAgICAgICAgICAgIFtyb3dEYXRhXT1cInJvd0RhdGFcIlxyXG4gICAgICAgICAgICBbY29sdW1uRGVmc109XCJjb2x1bW5EZWZzXCJcclxuICAgICAgICAgICAgW2dyaWRPcHRpb25zXT1cImdyaWRPcHRpb25zXCJcclxuICAgICAgICAgICAgW2FuaW1hdGVSb3dzXT1cInRydWVcIlxyXG4gICAgICAgICAgICBbcGFnaW5hdGlvbl09XCJmYWxzZVwiXHJcbiAgICAgICAgICAgIFttb2R1bGVzXT1cIm1vZHVsZXNcIiAgICAgXHJcbiAgICAgICAgICAgIFt1bmRvUmVkb0NlbGxFZGl0aW5nXT1cInRydWVcIiAgICBcclxuICAgICAgICAgICAgW3VuZG9SZWRvQ2VsbEVkaXRpbmdMaW1pdF09IDIwMFxyXG4gICAgICAgICAgICBbc3VwcHJlc3NSb3dDbGlja1NlbGVjdGlvbl09dHJ1ZVxyXG4gICAgICAgICAgICBbZW5hYmxlQ2VsbENoYW5nZUZsYXNoXT10cnVlXHJcbiAgICAgICAgICAgIFtmcmFtZXdvcmtDb21wb25lbnRzXT1cImZyYW1ld29ya0NvbXBvbmVudHNcIlxyXG4gICAgICAgICAgICByb3dTZWxlY3Rpb249XCJtdWx0aXBsZVwiXHJcbiAgICAgICAgICAgIChmaWx0ZXJNb2RpZmllZCk9XCJvbkZpbHRlck1vZGlmaWVkKClcIlxyXG4gICAgICAgICAgICAoY2VsbEVkaXRpbmdTdG9wcGVkKSA9XCJvbkNlbGxFZGl0aW5nU3RvcHBlZCgkZXZlbnQpXCJcclxuICAgICAgICAgICAgKGNlbGxWYWx1ZUNoYW5nZWQpPVwib25DZWxsVmFsdWVDaGFuZ2VkKCRldmVudClcIlxyXG4gICAgICAgICAgICAoZ3JpZFJlYWR5KT1cIm9uR3JpZFJlYWR5KCRldmVudClcIj5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIDwvYWctZ3JpZC1hbmd1bGFyPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG5cclxuYCxcclxuICBzdHlsZXM6IFtgaW5wdXQsbGFiZWx7ZGlzcGxheTppbmxpbmUtYmxvY2s7bWFyZ2luOjVweCA1cHggNXB4IDEwcHh9I25ld0J1dHRvbntjb2xvcjojZmZmO2JhY2tncm91bmQ6bm8tcmVwZWF0IHBhZGRpbmctYm94ICM2OGEyMjU7bWFyZ2luLWxlZnQ6M3B4fSNkZWxldGVCdXR0b257YmFja2dyb3VuZDpuby1yZXBlYXQgcGFkZGluZy1ib3ggI2ZmZjttYXJnaW4tbGVmdDozcHh9I2FjdGlvbkJ1dHRvbntiYWNrZ3JvdW5kOm5vLXJlcGVhdCBwYWRkaW5nLWJveCAjZmZmO21hcmdpbi1sZWZ0OjNweDt0ZXh0LWFsaWduOmNlbnRlciFpbXBvcnRhbnR9I2FwcGx5Q2hhbmdlc0J1dHRvbntjb2xvcjojZmZmIWltcG9ydGFudDtiYWNrZ3JvdW5kOm5vLXJlcGVhdCBwYWRkaW5nLWJveCAjNjhhMjI1O21hcmdpbi1sZWZ0OjNweH0jYXBwbHlDaGFuZ2VzQnV0dG9uW2Rpc2FibGVkXXtiYWNrZ3JvdW5kOm5vLXJlcGVhdCBwYWRkaW5nLWJveCAjODM5NzZjfSNyZWRvLCN1bmRve2NvbG9yOiNmZmYhaW1wb3J0YW50O2JhY2tncm91bmQ6I2ZmOTMwMDttYXJnaW4tbGVmdDozcHh9I3JlZG9bZGlzYWJsZWRdLCN1bmRvW2Rpc2FibGVkXXtiYWNrZ3JvdW5kOiNmZmM5N2Y7bWFyZ2luLWxlZnQ6M3B4fSNkZWxldGVDaGFuZ2VzQnV0dG9ue2NvbG9yOiNmZmYhaW1wb3J0YW50O2JhY2tncm91bmQ6I2RmMzEzM30jZGVsZXRlQ2hhbmdlc0J1dHRvbltkaXNhYmxlZF17Y29sb3I6I2ZmZiFpbXBvcnRhbnQ7YmFja2dyb3VuZDojZGE4YzhlfS5lZGl0RGl2QnRuc3ttYXJnaW4tbGVmdDoxMHB4O3RleHQtYWxpZ246c3RhcnQ7d2lkdGg6MTMwcHg7aGVpZ2h0OjMwcHghaW1wb3J0YW50O2xpbmUtaGVpZ2h0OjMwcHghaW1wb3J0YW50fS5hY3Rpb25zRGl2QnRuc3t0ZXh0LWFsaWduOmVuZDt3aWR0aDpjYWxjKDEwMCUgLSAxNDBweCk7aGVpZ2h0OjYwcHh9LmFjdGlvbnNEaXZCdG5zLC5lZGl0RGl2QnRuc3tkaXNwbGF5OmlubGluZS1ibG9jayFpbXBvcnRhbnR9LmFjdGlvbnNEaXZCdG5zIC5tYXQtc3Ryb2tlZC1idXR0b257cGFkZGluZzo1cHggMjBweCFpbXBvcnRhbnR9LmVkaXREaXZCdG5zIC5tYXQtbWluaS1mYWIgLm1hdC1idXR0b24td3JhcHBlcntwYWRkaW5nOmluaGVyaXQhaW1wb3J0YW50O2Rpc3BsYXk6aW5oZXJpdCFpbXBvcnRhbnR9LmVkaXREaXZCdG5zIC5tYXQtaWNvbntoZWlnaHQ6MzBweCFpbXBvcnRhbnQ7Ym90dG9tOjVweDtwb3NpdGlvbjpyZWxhdGl2ZX0uZWRpdERpdkJ0bnMgLm1hdC1taW5pLWZhYnt3aWR0aDozMHB4O2hlaWdodDozMHB4fS5hY3Rpb25zRGl2QnRucyAuc2VhcmNoR2VuZXJpY0lucHV0e2hlaWdodDo0NXB4IWltcG9ydGFudDt3aWR0aDo0NSUhaW1wb3J0YW50fS5hZy1ib2R5LXZpZXdwb3J0LmFnLWxheW91dC1ub3JtYWwgOjotd2Via2l0LXNjcm9sbGJhci10aHVtYntiYWNrZ3JvdW5kOiNlZWV94oCLIC5hZy1ib2R5LXZpZXdwb3J0LmFnLWxheW91dC1ub3JtYWwgOjotd2Via2l0LXNjcm9sbGJhcnt3aWR0aDoyZW07aGVpZ2h0OjJlbX0uYWctYm9keS12aWV3cG9ydC5hZy1sYXlvdXQtbm9ybWFsIDo6LXdlYmtpdC1zY3JvbGxiYXItYnV0dG9ue2JhY2tncm91bmQ6I2NjY30uYWctYm9keS12aWV3cG9ydC5hZy1sYXlvdXQtbm9ybWFsOjotd2Via2l0LXNjcm9sbGJhci10cmFjay1waWVjZXtiYWNrZ3JvdW5kOiM4ODh9YF1cclxufSlcclxuZXhwb3J0IGNsYXNzIERhdGFHcmlkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuIFxyXG4gIHByaXZhdGUgX2V2ZW50UmVmcmVzaFN1YnNjcmlwdGlvbjogYW55O1xyXG4gIHByaXZhdGUgX2V2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgcHJpdmF0ZSBfZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgbW9kdWxlczogTW9kdWxlW10gPSBBbGxDb21tdW5pdHlNb2R1bGVzO1xyXG4gIHNlYXJjaFZhbHVlOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBncmlkQXBpO1xyXG4gIHByaXZhdGUgZ3JpZENvbHVtbkFwaTtcclxuICBzdGF0dXNDb2x1bW4gPSBmYWxzZTtcclxuICBjaGFuZ2VzTWFwOiBNYXA8bnVtYmVyLCBNYXA8c3RyaW5nLCBudW1iZXI+PiA9IG5ldyBNYXA8bnVtYmVyLCBNYXA8c3RyaW5nLCBudW1iZXI+PigpO1xyXG4gICAvLyBXZSB3aWxsIHNhdmUgdGhlIGlkIG9mIGVkaXRlZCBjZWxscyBhbmQgdGhlIG51bWJlciBvZiBlZGl0aW9ucyBkb25lLlxyXG4gIHByaXZhdGUgcGFyYW1zOyAvLyBMYXN0IHBhcmFtZXRlcnMgb2YgdGhlIGdyaWQgKGluIGNhc2Ugd2UgZG8gYXBwbHkgY2hhbmdlcyB3ZSB3aWxsIG5lZWQgaXQpIFxyXG4gIHJvd0RhdGE6IGFueVtdO1xyXG4gIGNoYW5nZUNvdW50ZXI6IG51bWJlcjsgLy8gTnVtYmVyIG9mIGVkaXRpb25zIGRvbmUgYWJvdmUgYW55IGNlbGwgXHJcbiAgcHJldmlvdXNDaGFuZ2VDb3VudGVyOiBudW1iZXI7IC8vIE51bWJlciBvZiBkaXRpb25zIGRvbmUgYWZ0ZXIgdGhlIGxhc3QgbW9kaWZpY2F0aW9uKGNoYW5nZUNvdW50ZXIpXHJcbiAgcmVkb0NvdW50ZXI6IG51bWJlcjsgLy8gTnVtYmVyIG9mIHJlZG8gd2UgY2FuIGRvXHJcbiAgbW9kaWZpY2F0aW9uQ2hhbmdlID0gZmFsc2U7XHJcbiAgdW5kb05vQ2hhbmdlcyA9IGZhbHNlOyAvLyBCb29sZWFuIHRoYXQgaW5kaWNhdGVzIGlmIGFuIHVuZG8gaGFzbid0IG1vZGlmaWNhdGlvbnNcclxuICBncmlkT3B0aW9ucztcclxuXHJcblxyXG4gIEBJbnB1dCgpIGV2ZW50UmVmcmVzaFN1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZSA8Ym9vbGVhbj4gO1xyXG4gIEBJbnB1dCgpIGV2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlIDxib29sZWFuPiA7XHJcbiAgQElucHV0KCkgZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlIDxib29sZWFuPiA7XHJcbiAgQElucHV0KCkgZXZlbnRBZGRJdGVtc1N1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZSA8YW55W10+IDtcclxuICBASW5wdXQoKSBmcmFtZXdvcmtDb21wb25lbnRzOiBhbnk7XHJcbiAgQElucHV0KCkgY29sdW1uRGVmczogYW55W107XHJcbiAgQElucHV0KCkgZ2V0QWxsOiAoKSA9PiBPYnNlcnZhYmxlPGFueT47XHJcbiAgQElucHV0KCkgZGlzY2FyZENoYW5nZXNCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgdW5kb0J1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSByZWRvQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGFwcGx5Q2hhbmdlc0J1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBkZWxldGVCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgbmV3QnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGFjdGlvbkJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBhZGRCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgZ2xvYmFsU2VhcmNoOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHRoZW1lR3JpZDogYW55O1xyXG4gIEBJbnB1dCgpIHNpbmdsZVNlbGVjdGlvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBub25FZGl0YWJsZTogYm9vbGVhbjtcclxuICBASW5wdXQoKSB0aXRsZTogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGhpZGVFeHBvcnRCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgaGlkZUR1cGxpY2F0ZUJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBoaWRlU2VhcmNoUmVwbGFjZUJ1dHRvbjogYm9vbGVhbjtcclxuXHJcblxyXG4gIEBPdXRwdXQoKSByZW1vdmU6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIG5ldzogRXZlbnRFbWl0dGVyPG51bWJlcj47XHJcbiAgQE91dHB1dCgpIGFkZDogRXZlbnRFbWl0dGVyPG51bWJlcj47XHJcbiAgQE91dHB1dCgpIHNlbmRDaGFuZ2VzOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG4gIEBPdXRwdXQoKSBkdXBsaWNhdGU6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIGdldFNlbGVjdGVkUm93czogRXZlbnRFbWl0dGVyPGFueVtdPjtcclxuICBAT3V0cHV0KCkgZ2V0QWxsUm93czogRXZlbnRFbWl0dGVyPGFueVtdPjtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UpIHtcclxuICAgIHRoaXMudHJhbnNsYXRlID0gdHJhbnNsYXRlO1xyXG5cclxuICAgIHRoaXMuZnJhbWV3b3JrQ29tcG9uZW50cyA9IHtcclxuICAgICAgYnRuRWRpdFJlbmRlcmVyQ29tcG9uZW50OiBCdG5FZGl0UmVuZGVyZWRDb21wb25lbnRcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5yZW1vdmUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLm5ldyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuYWRkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5zZW5kQ2hhbmdlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuZ2V0U2VsZWN0ZWRSb3dzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5kdXBsaWNhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmdldEFsbFJvd3MgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmNoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5yZWRvQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLmdyaWRPcHRpb25zID0ge1xyXG4gICAgICBkZWZhdWx0Q29sRGVmOiB7XHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZmxleDogMSxcclxuICAgICAgICBmaWx0ZXI6IHRydWUsXHJcbiAgICAgICAgZWRpdGFibGU6ICF0aGlzLm5vbkVkaXRhYmxlLFxyXG4gICAgICAgIGNlbGxTdHlsZToge2JhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnfSxcclxuICAgICAgfSxcclxuICAgICAgY29sdW1uVHlwZXM6IHtcclxuICAgICAgICBkYXRlQ29sdW1uOiB7XHJcbiAgICAgICAgICAgIGZpbHRlcjogJ2FnRGF0ZUNvbHVtbkZpbHRlcicsXHJcbiAgICAgICAgICAgIGZpbHRlclBhcmFtczoge1xyXG4gICAgICAgICAgICAgIGNvbXBhcmF0b3IoZmlsdGVyTG9jYWxEYXRlQXRNaWRuaWdodCwgY2VsbFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRlQ2VsbFZhbHVlID0gbmV3IERhdGUoY2VsbFZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVGaWx0ZXIgPSBuZXcgRGF0ZShmaWx0ZXJMb2NhbERhdGVBdE1pZG5pZ2h0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0ZUNlbGxWYWx1ZS5nZXRUaW1lKCkgPCBkYXRlRmlsdGVyLmdldFRpbWUoKSkge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGVDZWxsVmFsdWUuZ2V0VGltZSgpICA+IGRhdGVGaWx0ZXIuZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VwcHJlc3NNZW51OiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgICAgcm93U2VsZWN0aW9uOiAnbXVsdGlwbGUnLFxyXG4gICAgICBzaW5nbGVDbGlja0VkaXQ6IHRydWUsXHJcbiAgICAgIC8vIHN1cHByZXNzSG9yaXpvbnRhbFNjcm9sbDogdHJ1ZSxcclxuICAgICAgbG9jYWxlVGV4dEZ1bmM6IChrZXk6IHN0cmluZywgZGVmYXVsdFZhbHVlOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy50cmFuc2xhdGUuaW5zdGFudChrZXkpO1xyXG4gICAgICAgIHJldHVybiBkYXRhID09PSBrZXkgPyBkZWZhdWx0VmFsdWUgOiBkYXRhO1xyXG4gICAgfVxyXG4gICAgfTtcclxuXHJcbiAgfVxyXG5cclxuXHJcbiAgbmdPbkluaXQoKXtcclxuXHJcbiAgICBpZiAodGhpcy5ldmVudFJlZnJlc2hTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5fZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uID0gdGhpcy5ldmVudFJlZnJlc2hTdWJzY3JpcHRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLmdldEVsZW1lbnRzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5fZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbWl0U2VsZWN0ZWRSb3dzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbWl0QWxsUm93cygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZih0aGlzLmV2ZW50QWRkSXRlbXNTdWJzY3JpcHRpb24pXHJcbiAgICB7XHJcbiAgICAgIHRoaXMuZXZlbnRBZGRJdGVtc1N1YnNjcmlwdGlvbi5zdWJzY3JpYmUoXHJcbiAgICAgICAgKGl0ZW1zKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmFkZEl0ZW1zKGl0ZW1zKTtcclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBcclxuXHJcblxyXG4gIH1cclxuXHJcblxyXG5cclxuICBvbkdyaWRSZWFkeShwYXJhbXMpOiB2b2lke1xyXG4gICAgaWYgKHRoaXMuc2luZ2xlU2VsZWN0aW9uKSB7dGhpcy5ncmlkT3B0aW9ucy5yb3dTZWxlY3Rpb24gPSAnc2luZ2xlJ31cclxuICAgIC8vIGlmICh0aGlzLm5vbkVkaXRhYmxlKSB7dGhpcy5ncmlkT3B0aW9ucy5kZWZhdWx0Q29sRGVmLmVkaXRhYmxlID0gZmFsc2V9XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgIHRoaXMuZ3JpZEFwaSA9IHBhcmFtcy5hcGk7XHJcbiAgICB0aGlzLmdyaWRDb2x1bW5BcGkgPSBwYXJhbXMuY29sdW1uQXBpO1xyXG4gICAgdGhpcy5nZXRFbGVtZW50cygpO1xyXG4gICAgdGhpcy5ncmlkQXBpLnNpemVDb2x1bW5zVG9GaXQoKTtcclxuICAgIGZvciAoY29uc3QgY29sIG9mIHRoaXMuY29sdW1uRGVmcykge1xyXG4gICAgICBpZiAoY29sLmZpZWxkID09PSAnZXN0YXQnKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0dXNDb2x1bW4gPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBcclxuICBlbWl0U2VsZWN0ZWRSb3dzKCk6IHZvaWR7XHJcbiAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKTtcclxuICAgIGNvbnN0IHNlbGVjdGVkRGF0YSA9IHNlbGVjdGVkTm9kZXMubWFwKG5vZGUgPT4gbm9kZS5kYXRhKTtcclxuICAgIHRoaXMuZ2V0U2VsZWN0ZWRSb3dzLmVtaXQoc2VsZWN0ZWREYXRhKTtcclxuICB9XHJcblxyXG4gIGVtaXRBbGxSb3dzKCk6IHZvaWR7XHJcbiAgICBsZXQgcm93RGF0YSA9IFtdO1xyXG4gICAgdGhpcy5ncmlkQXBpLmZvckVhY2hOb2RlKG5vZGUgPT4gcm93RGF0YS5wdXNoKG5vZGUuZGF0YSkpO1xyXG4gICAgdGhpcy5nZXRTZWxlY3RlZFJvd3MuZW1pdChyb3dEYXRhKTtcclxuICB9XHJcblxyXG4gIGdldENvbHVtbktleXNBbmRIZWFkZXJzKGNvbHVtbmtleXM6IEFycmF5PGFueT4pOiBTdHJpbmd7ICAgIFxyXG4gICAgbGV0IGhlYWRlcjpBcnJheTxhbnk+ID0gW107XHJcbiAgICBpZiAodGhpcy5jb2x1bW5EZWZzLmxlbmd0aCA9PSAwKSB7cmV0dXJuICcnfTtcclxuXHJcbiAgICBsZXQgYWxsQ29sdW1uS2V5cz10aGlzLmdyaWRPcHRpb25zLmNvbHVtbkFwaS5nZXRBbGxEaXNwbGF5ZWRDb2x1bW5zKCk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhhbGxDb2x1bW5LZXlzKTtcclxuICAgIGFsbENvbHVtbktleXMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICBpZiAoZWxlbWVudC51c2VyUHJvdmlkZWRDb2xEZWYuaGVhZGVyTmFtZSAhPT0gJycpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgY29sdW1ua2V5cy5wdXNoKGVsZW1lbnQudXNlclByb3ZpZGVkQ29sRGVmLmZpZWxkKTtcclxuICAgICAgICAgIGhlYWRlci5wdXNoKGVsZW1lbnQudXNlclByb3ZpZGVkQ29sRGVmLmhlYWRlck5hbWUpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgXHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgcmV0dXJuIGhlYWRlci5qb2luKFwiLFwiKTtcclxuICB9XHJcblxyXG5cclxuICBleHBvcnREYXRhKCk6IHZvaWR7XHJcbiAgICBsZXQgY29sdW1ua2V5czpBcnJheTxhbnk+ID0gW107XHJcbiAgICBsZXQgY3VzdG9tSGVhZGVyOlN0cmluZyA9ICcnO1xyXG4gICAgY3VzdG9tSGVhZGVyID0gdGhpcy5nZXRDb2x1bW5LZXlzQW5kSGVhZGVycyhjb2x1bW5rZXlzKVxyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBvbmx5U2VsZWN0ZWQ6IHRydWUsXHJcbiAgICAgICAgY29sdW1uS2V5czogY29sdW1ua2V5cyxcclxuICAgICAgICBjdXN0b21IZWFkZXI6IGN1c3RvbUhlYWRlcixcclxuICAgICAgICBza2lwSGVhZGVyOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgdGhpcy5ncmlkQXBpLmV4cG9ydERhdGFBc0NzdihwYXJhbXMpO1xyXG4gIH1cclxuXHJcbiAgcXVpY2tTZWFyY2goKTogdm9pZHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zZXRRdWlja0ZpbHRlcih0aGlzLnNlYXJjaFZhbHVlKTtcclxufVxyXG5cclxuICBnZXRFbGVtZW50cygpOiB2b2lkXHJcbiAge1xyXG4gICAgdGhpcy5nZXRBbGwoKVxyXG4gICAgLnN1YnNjcmliZSgoaXRlbXMpID0+IHtcclxuICAgICAgICB0aGlzLnJvd0RhdGEgPSBpdGVtcztcclxuICAgICAgICBzZXRUaW1lb3V0KCgpPT57dGhpcy5ncmlkQXBpLnNpemVDb2x1bW5zVG9GaXQoKX0sIDMwKTtcclxuICAgICAgICB0aGlzLmdyaWRBcGkuc2V0Um93RGF0YSh0aGlzLnJvd0RhdGEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMucm93RGF0YSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gICBhZGRJdGVtcyhuZXdJdGVtczogYW55W10pOiB2b2lkIHtcclxuICAgIGNvbnNvbGUubG9nKG5ld0l0ZW1zKTtcclxuXHJcbiAgICB0aGlzLmdyaWRBcGkudXBkYXRlUm93RGF0YSh7IGFkZDogbmV3SXRlbXMgfSk7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLmNvbHVtbkRlZnMpO1xyXG5cclxuICB9XHJcblxyXG4gIHJlbW92ZURhdGEoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IHRoaXMuZ3JpZEFwaS5nZXRTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICBjb25zdCBzZWxlY3RlZERhdGEgPSBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IG5vZGUuZGF0YSk7XHJcbiAgICB0aGlzLnJlbW92ZS5lbWl0KHNlbGVjdGVkRGF0YSk7XHJcblxyXG4gICAgaWYodGhpcy5zdGF0dXNDb2x1bW4pXHJcbiAgICB7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGVkUm93cyA9IHNlbGVjdGVkTm9kZXMubWFwKG5vZGUgPT4gbm9kZS5yb3dJbmRleCk7XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIHNlbGVjdGVkUm93cyl7XHJcbiAgICAgICAgICB0aGlzLmdyaWRBcGkuZ2V0Um93Tm9kZShpZCkuZGF0YS5lc3RhdCA9J0VsaW1pbmF0JztcclxuICAgICAgICB9XHJcbiAgICAgIHRoaXMuZ3JpZE9wdGlvbnMuYXBpLnJlZnJlc2hDZWxscygpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5ncmlkT3B0aW9ucy5hcGkuZGVzZWxlY3RBbGwoKTtcclxuICB9XHJcblxyXG4gIG5ld0RhdGEoKTogdm9pZFxyXG4gIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICB0aGlzLm5ldy5lbWl0KC0xKTtcclxuICB9XHJcblxyXG4gIG9uQWRkQnV0dG9uQ2xpY2tlZCgpOiB2b2lkXHJcbiAge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIHRoaXMuYWRkLmVtaXQoLTEpO1xyXG4gIH1cclxuXHJcbiAgb25EdXBsaWNhdGVCdXR0b25DbGlja2VkKCk6IHZvaWRcclxuICB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IHRoaXMuZ3JpZEFwaS5nZXRTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICBjb25zdCBzZWxlY3RlZERhdGEgPSBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IG5vZGUuZGF0YSk7XHJcbiAgICB0aGlzLmR1cGxpY2F0ZS5lbWl0KHNlbGVjdGVkRGF0YSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgYXBwbHlDaGFuZ2VzKCk6IHZvaWRcclxuICB7XHJcbiAgICBjb25zdCBpdGVtc0NoYW5nZWQ6IGFueVtdID0gW107XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgZm9yIChjb25zdCBrZXkgb2YgdGhpcy5jaGFuZ2VzTWFwLmtleXMoKSlcclxuICAgIHtcclxuICAgICAgaXRlbXNDaGFuZ2VkLnB1c2godGhpcy5ncmlkQXBpLmdldFJvd05vZGUoa2V5KS5kYXRhKTtcclxuICAgIH1cclxuICAgIHRoaXMuc2VuZENoYW5nZXMuZW1pdChpdGVtc0NoYW5nZWQpO1xyXG4gICAgdGhpcy5jaGFuZ2VzTWFwLmNsZWFyKCk7XHJcbiAgICB0aGlzLmNoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5yZWRvQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnBhcmFtcy5jb2xEZWYuY2VsbFN0eWxlID0gIHtiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGRkZGJ307XHJcbiAgICB0aGlzLmdyaWRBcGkucmVkcmF3Um93cygpO1xyXG4gIH1cclxuXHJcblxyXG5cclxuICBkZWxldGVDaGFuZ2VzKCk6IHZvaWRcclxuICB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hhbmdlQ291bnRlcjsgaSsrKVxyXG4gICAge1xyXG4gICAgICB0aGlzLmdyaWRBcGkudW5kb0NlbGxFZGl0aW5nKCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmNoYW5nZXNNYXAuY2xlYXIoKTtcclxuICAgIHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyID0gMDtcclxuICAgIHRoaXMuY2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuICAgIHRoaXMucGFyYW1zLmNvbERlZi5jZWxsU3R5bGUgPSAge2JhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnfTtcclxuICAgIHRoaXMuZ3JpZEFwaS5yZWRyYXdSb3dzKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgb25GaWx0ZXJNb2RpZmllZCgpOiB2b2lke1xyXG4gICAgdGhpcy5kZWxldGVDaGFuZ2VzKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgdW5kbygpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICB0aGlzLmdyaWRBcGkudW5kb0NlbGxFZGl0aW5nKCk7XHJcbiAgICB0aGlzLmNoYW5nZUNvdW50ZXIgLT0gMTtcclxuICAgIHRoaXMucmVkb0NvdW50ZXIgKz0gMTtcclxuICB9XHJcblxyXG4gIHJlZG8oKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgdGhpcy5ncmlkQXBpLnJlZG9DZWxsRWRpdGluZygpO1xyXG4gICAgdGhpcy5jaGFuZ2VDb3VudGVyICs9IDE7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyIC09IDE7XHJcbiAgfVxyXG5cclxuXHJcbiAgb25DZWxsRWRpdGluZ1N0b3BwZWQoZSlcclxuICB7XHJcbiAgICAgIGlmICh0aGlzLm1vZGlmaWNhdGlvbkNoYW5nZSlcclxuICAgICAge1xyXG4gICAgICAgIHRoaXMuY2hhbmdlQ291bnRlcisrO1xyXG4gICAgICAgIHRoaXMucmVkb0NvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMub25DZWxsVmFsdWVDaGFuZ2VkKGUpO1xyXG4gICAgICAgIHRoaXMubW9kaWZpY2F0aW9uQ2hhbmdlID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG5cclxuICBvbkNlbGxWYWx1ZUNoYW5nZWQocGFyYW1zKTogdm9pZHtcclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zOyBcclxuICAgIGlmICh0aGlzLmNoYW5nZUNvdW50ZXIgPiB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlcilcclxuICAgICAgLy8gVHJ1ZSBpZiB3ZSBoYXZlIGVkaXRlZCBzb21lIGNlbGwgb3Igd2UgaGF2ZSBkb25lIGEgcmVkbyBcclxuICAgICAge1xyXG5cclxuICAgICAgICBpZiAocGFyYW1zLm9sZFZhbHVlICE9PSBwYXJhbXMudmFsdWUgJiYgIShwYXJhbXMub2xkVmFsdWUgPT0gbnVsbCAmJiBwYXJhbXMudmFsdWUgPT09ICcnKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmICghIHRoaXMuY2hhbmdlc01hcC5oYXMocGFyYW1zLm5vZGUuaWQpKSAvLyBJZiBpdCdzIGZpcnRzIGVkaXQgb2YgYSBjZWxsLCB3ZSBhZGQgaXQgdG8gdGhlIG1hcCBhbmQgd2UgcGFpbnQgaXRcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgYWRkTWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcclxuICAgICAgICAgICAgYWRkTWFwLnNldChwYXJhbXMuY29sRGVmLmZpZWxkLCAxKVxyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuc2V0KHBhcmFtcy5ub2RlLmlkLCBhZGRNYXApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgaWYgKCEgdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuaGFzKHBhcmFtcy5jb2xEZWYuZmllbGQpKVxyXG4gICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgIHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLnNldChwYXJhbXMuY29sRGVmLmZpZWxkLCAxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAvLyBXZSBhbHJlYWR5IGhhZCBlZGl0ZWQgdGhpcyBjZWxsLCBzbyB3ZSBvbmx5IGluY3JlbWVudCBudW1iZXIgb2YgY2hhbmdlcyBvZiBpdCBvbiB0aGUgbWFwIFxyXG4gICAgICAgICAgICAgY29uc3QgY3VycmVudENoYW5nZXMgPSB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5nZXQocGFyYW1zLmNvbERlZi5maWVsZCk7XHJcbiAgICAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5zZXQocGFyYW1zLmNvbERlZi5maWVsZCwgKGN1cnJlbnRDaGFuZ2VzICsgMSkpO1xyXG4gICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnBhaW50Q2VsbHMocGFyYW1zLCB0aGlzLmNoYW5nZXNNYXApOyAvL1dlIHBhaW50IHRoZSByb3cgb2YgdGhlIGVkaXRlZCBjZWxsIFxyXG4gICAgICAgICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIrKzsgLy9XZSBtYXRjaCB0aGUgY3VycmVudCBwcmV2aW91c0NoYW5nZUNvdW50ZXIgd2l0aCBjaGFuZ2VDb3VudGVyXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfVxyXG4gICAgZWxzZSBpZiAodGhpcy5jaGFuZ2VDb3VudGVyIDwgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIpeyAvLyBUcnVlIGlmIHdlIGhhdmUgZG9uZSBhbiB1bmRvXHJcbiAgICAgICAgbGV0IGN1cnJlbnRDaGFuZ2VzID0gLTE7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hhbmdlc01hcC5oYXMocGFyYW1zLm5vZGUuaWQpKSB7Y3VycmVudENoYW5nZXMgPSB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5nZXQocGFyYW1zLmNvbERlZi5maWVsZCk7fVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChjdXJyZW50Q2hhbmdlcyA9PT0gMSkgeyAvL09uY2UgdGhlIHVuZG8gaXQncyBkb25lLCBjZWxsIGlzIGluIGhpcyBpbml0aWFsIHN0YXR1c1xyXG5cclxuICAgICAgICAgIHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmRlbGV0ZShwYXJhbXMuY29sRGVmLmZpZWxkKTtcclxuICAgICAgICAgIGlmKHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLnNpemUgPT09IDApIHsgLy8gTm8gbW9yZSBtb2RpZmljYXRpb25zIGluIHRoaXMgcm93XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlc01hcC5kZWxldGUocGFyYW1zLm5vZGUuaWQpO1xyXG4gICAgICAgICAgICBjb25zdCByb3cgPSB0aGlzLmdyaWRBcGkuZ2V0RGlzcGxheWVkUm93QXRJbmRleChwYXJhbXMucm93SW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgLy8gV2UgcGFpbnQgaXQgd2hpdGVcclxuICAgICAgICAgICAgdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3Moe3Jvd05vZGVzOiBbcm93XX0pO1xyXG5cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0aGlzLnBhaW50Q2VsbHMocGFyYW1zLCB0aGlzLmNoYW5nZXNNYXApO1xyXG4gICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGN1cnJlbnRDaGFuZ2VzID4xKSAvLyBUaGUgY2VsbCBpc24ndCBpbiBoaXMgaW5pdGlhbCBzdGF0ZSB5ZXRcclxuICAgICAgICB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9XZSBjYW4ndCBkbyBlbHNlIGJlY2F1c2Ugd2UgY2FuIGJlIGRvaW5nIGFuIHVuZG8gd2l0aG91dCBjaGFuZ2VzIFxyXG4gICAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuc2V0KHBhcmFtcy5jb2xEZWYuZmllbGQsIChjdXJyZW50Q2hhbmdlcyAtIDEpKTtcclxuXHJcbiAgICAgICAgICB0aGlzLnBhaW50Q2VsbHMocGFyYW1zLCB0aGlzLmNoYW5nZXNNYXApOy8vTm90IGluaXRpYWwgc3RhdGUgLT4gZ3JlZW4gYmFja2dyb3VuZFxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXItLTsgIC8vV2UgZGVjcmVtZW50IHByZXZpb3VzQ2hhbmdlQ291bnRlciBiZWNhdXNlIHdlIGhhdmUgZG9uZSB1bmRvXHJcbiAgICB9XHJcbiAgICBlbHNleyAvLyBDb250cm9sIG9mIG1vZGlmaWNhdGlvbnMgd2l0aG91dCBjaGFuZ2VzXHJcbiAgICAgIGlmKCAhKHBhcmFtcy5vbGRWYWx1ZSA9PSBudWxsICYmIHBhcmFtcy52YWx1ZSA9PT0gJycpKVxyXG4gICAgICB7XHJcbiAgICAgICAgbGV0IG5ld1ZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgaWYocGFyYW1zLnZhbHVlID09IG51bGwpIHtuZXdWYWx1ZT0nJ31cclxuICAgICAgICBlbHNleyBuZXdWYWx1ZSA9IHBhcmFtcy52YWx1ZS50b1N0cmluZygpIH1cclxuXHJcblxyXG4gICAgICAgIGlmKHBhcmFtcy5vbGRWYWx1ZSAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlmIChwYXJhbXMub2xkVmFsdWUudG9TdHJpbmcoKSAhPT0gbmV3VmFsdWUudG9TdHJpbmcoKSkgeyB0aGlzLm1vZGlmaWNhdGlvbkNoYW5nZSA9IHRydWU7IH1cclxuICAgICAgICAgIGVsc2Uge3RoaXMubW9kaWZpY2F0aW9uV2l0aG91dENoYW5nZXMocGFyYW1zKX1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYocGFyYW1zLm9sZFZhbHVlID09IG51bGwgKSAgICAgICAgIHtcclxuICAgICAgICAgIGlmIChwYXJhbXMub2xkVmFsdWUgIT09IG5ld1ZhbHVlLnRvU3RyaW5nKCkpIHsgdGhpcy5tb2RpZmljYXRpb25DaGFuZ2UgPSB0cnVlOyB9XHJcbiAgICAgICAgICBlbHNlIHt0aGlzLm1vZGlmaWNhdGlvbldpdGhvdXRDaGFuZ2VzKHBhcmFtcyl9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge3RoaXMubW9kaWZpY2F0aW9uV2l0aG91dENoYW5nZXMocGFyYW1zKX1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIG1vZGlmaWNhdGlvbldpdGhvdXRDaGFuZ2VzKHBhcmFtczogYW55KSB7XHJcblxyXG4gICAgaWYgKCB0aGlzLmNoYW5nZXNNYXAuaGFzKHBhcmFtcy5ub2RlLmlkKSkgLy9Nb2RpZmljYXRpb24gd2l0aG91dCBjaGFuZ2VzIGluIGVuIGVkaXRlZCBjZWxsXHJcbiAgICB7XHJcbiAgICAgIGlmKCF0aGlzLnVuZG9Ob0NoYW5nZXMpXHJcbiAgICAgIHtcclxuICAgICAgICB0aGlzLmdyaWRBcGkudW5kb0NlbGxFZGl0aW5nKCk7IC8vIFVuZG8gdG8gZGVsZXRlIHRoZSBjaGFuZ2Ugd2l0aG91dCBjaGFuZ2VzIGludGVybmFsbHkgXHJcbiAgICAgICAgdGhpcy51bmRvTm9DaGFuZ2VzID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnBhaW50Q2VsbHMocGFyYW1zLCB0aGlzLmNoYW5nZXNNYXApOyAgLy9UaGUgY2VsbCBoYXMgbW9kaWZpY2F0aW9ucyB5ZXQgLT4gZ3JlZW4gYmFja2dyb3VuZCBcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHsgdGhpcy51bmRvTm9DaGFuZ2VzID0gZmFsc2U7IH1cclxuXHJcblxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIC8vV2l0aCB0aGUgaW50ZXJuYWxseSB1bmRvIHdpbGwgZW50ZXIgYXQgdGhpcyBmdW5jdGlvbiwgc28gd2UgaGF2ZSB0byBjb250cm9sIHdoZW4gZG9uZSB0aGUgdW5kbyBvciBub3QgXHJcbiAgICAgIGlmKCF0aGlzLnVuZG9Ob0NoYW5nZXMpXHJcbiAgICAgIHtcclxuICAgICAgICB0aGlzLmdyaWRBcGkudW5kb0NlbGxFZGl0aW5nKCk7IC8vIFVuZG8gdG8gZGVsZXRlIHRoZSBjaGFuZ2UgaW50ZXJuYWxseVxyXG4gICAgICAgIHRoaXMudW5kb05vQ2hhbmdlcyA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7IHRoaXMudW5kb05vQ2hhbmdlcyA9IGZhbHNlOyB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0Q29sdW1uSW5kZXhCeUNvbElkKGFwaTogQ29sdW1uQXBpLCBjb2xJZDogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBhcGkuZ2V0QWxsQ29sdW1ucygpLmZpbmRJbmRleChjb2wgPT4gY29sLmdldENvbElkKCkgPT09IGNvbElkKTtcclxuICB9XHJcbiAgcGFpbnRDZWxscyhwYXJhbXM6IGFueSwgIGNoYW5nZXNNYXA6IE1hcDxudW1iZXIsIE1hcDxzdHJpbmcsIG51bWJlcj4+LCApXHJcbiAge1xyXG4gICAgY29uc3Qgcm93ID0gdGhpcy5ncmlkQXBpLmdldERpc3BsYXllZFJvd0F0SW5kZXgocGFyYW1zLnJvd0luZGV4KTtcclxuXHJcbiAgICB0aGlzLmNoYW5nZUNlbGxTdHlsZUNvbHVtbnMocGFyYW1zLGNoYW5nZXNNYXAsJyNFOEYxREUnKTtcclxuICAgIHRoaXMuZ3JpZEFwaS5yZWRyYXdSb3dzKHtyb3dOb2RlczogW3Jvd119KTtcclxuICAgIHRoaXMuY2hhbmdlQ2VsbFN0eWxlQ29sdW1ucyhwYXJhbXMsY2hhbmdlc01hcCwnI0ZGRkZGRicpOyBcclxuICAgIC8vIFdlIHdpbGwgZGVmaW5lIGNlbGxTdHlsZSB3aGl0ZSB0byBmdXR1cmUgbW9kaWZpY2F0aW9ucyAobGlrZSBmaWx0ZXIpXHJcbiAgfVxyXG5cclxuICBjaGFuZ2VDZWxsU3R5bGVDb2x1bW5zKHBhcmFtczogYW55LCBjaGFuZ2VzTWFwOiBNYXA8bnVtYmVyLCBNYXA8c3RyaW5nLCBudW1iZXI+PiwgY29sb3I6IHN0cmluZyl7XHJcblxyXG4gICAgZm9yIChjb25zdCBrZXkgb2YgY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmtleXMoKSlcclxuICAgIHtcclxuICAgICAgY29uc3QgY29sdW1uTnVtYmVyID0gdGhpcy5nZXRDb2x1bW5JbmRleEJ5Q29sSWQodGhpcy5ncmlkQ29sdW1uQXBpLCBrZXkpO1xyXG4gICAgICB0aGlzLmdyaWRDb2x1bW5BcGkuY29sdW1uQ29udHJvbGxlci5ncmlkQ29sdW1uc1tjb2x1bW5OdW1iZXJdLmNvbERlZi5jZWxsU3R5bGUgPSB7YmFja2dyb3VuZENvbG9yOiBjb2xvcn07XHJcbiAgICB9XHJcblxyXG5cclxuICB9XHJcblxyXG59XHJcbiJdfQ==