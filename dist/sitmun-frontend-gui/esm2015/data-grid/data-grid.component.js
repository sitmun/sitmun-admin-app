/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { TranslateService } from '@ngx-translate/core';
import { BtnEditRenderedComponent } from '../btn-edit-rendered/btn-edit-rendered.component';
import { BtnCheckboxRenderedComponent } from '../btn-checkbox-rendered/btn-checkbox-rendered.component';
import { BtnCheckboxFilterComponent } from '../btn-checkbox-filter/btn-checkbox-filter.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from '../dialog-message/dialog-message.component';
export class DataGridComponent {
    /**
     * @param {?} dialog
     * @param {?} translate
     * @param {?} elRef
     */
    constructor(dialog, translate, elRef) {
        this.dialog = dialog;
        this.translate = translate;
        this.elRef = elRef;
        this.modules = AllCommunityModules;
        this.statusColumn = false;
        this.changesMap = new Map();
        this.modificationChange = false;
        this.undoNoChanges = false; // Boolean that indicates if an undo hasn't modifications
        this.someStatusHasChangedToDelete = false;
        this.translate = translate;
        this.frameworkComponents = {
            btnEditRendererComponent: BtnEditRenderedComponent,
            btnCheckboxRendererComponent: BtnCheckboxRenderedComponent,
            btnCheckboxFilterComponent: BtnCheckboxFilterComponent
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
                suppressMenu: true,
                resizable: true
            },
            columnTypes: {
                dateColumn: {
                    filter: 'agDateColumnFilter',
                    filterParams: {
                        /**
                         * @param {?} filterLocalDateAtMidnight
                         * @param {?} cellValue
                         * @return {?}
                         */
                        comparator(filterLocalDateAtMidnight, cellValue) {
                            /** @type {?} */
                            const dateCellValue = new Date(cellValue);
                            /** @type {?} */
                            const dateFilter = new Date(filterLocalDateAtMidnight);
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
            localeTextFunc: (key, defaultValue) => {
                /** @type {?} */
                const data = this.translate.instant(key);
                return data === key ? defaultValue : data;
            }
        };
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.eventRefreshSubscription) {
            this._eventRefreshSubscription = this.eventRefreshSubscription.subscribe(() => {
                this.changesMap.clear();
                this.someStatusHasChangedToDelete = false;
                this.changeCounter = 0;
                this.previousChangeCounter = 0;
                this.redoCounter = 0;
                this.getElements();
            });
        }
        if (this.eventGetSelectedRowsSubscription) {
            this._eventGetSelectedRowsSubscription = this.eventGetSelectedRowsSubscription.subscribe(() => {
                this.emitSelectedRows();
            });
        }
        if (this.eventGetAllRowsSubscription) {
            this._eventGetAllRowsSubscription = this.eventGetAllRowsSubscription.subscribe(() => {
                this.emitAllRows();
            });
        }
        if (this.eventSaveAgGridStateSubscription) {
            this._eventSaveAgGridStateSubscription = this.eventSaveAgGridStateSubscription.subscribe(() => {
                this.saveAgGridState();
            });
        }
        if (this.eventAddItemsSubscription) {
            this.eventAddItemsSubscription.subscribe((items) => {
                this.addItems(items);
            });
        }
    }
    /**
     * @return {?}
     */
    firstDataRendered() {
        if (localStorage["agGridState"] != undefined) {
            /** @type {?} */
            let agGridState = JSON.parse(localStorage["agGridState"]);
            if (agGridState.idAgGrid != undefined && agGridState.idAgGrid == this.id) {
                this.gridApi.setFilterModel(agGridState.filterState);
                this.gridColumnApi.setColumnState(agGridState.colState);
                this.gridApi.setSortModel(agGridState.sortState);
                this.searchValue = agGridState.valueSearchGeneric;
                this.quickSearch();
                this.removeAgGridState();
            }
            else if (this.id != undefined) {
                this.removeAgGridState();
            }
        }
    }
    /**
     * @param {?} params
     * @return {?}
     */
    onGridReady(params) {
        if (this.singleSelection) {
            this.gridOptions.rowSelection = 'single';
        }
        // if (this.nonEditable) {this.gridOptions.defaultColDef.editable = false}
        this.params = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.getElements();
        console.log(this.columnDefs);
        for (const col of this.columnDefs) {
            if (col.field === 'status') {
                console.log("status column true");
                this.statusColumn = true;
            }
        }
        if (this.defaultColumnSorting) {
            /** @type {?} */
            const sortModel = [
                { colId: this.defaultColumnSorting, sort: 'asc' }
            ];
            this.gridApi.setSortModel(sortModel);
        }
    }
    /**
     * @return {?}
     */
    areRowsSelected() {
        if (this.gridApi != null && this.gridApi.getSelectedNodes().length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * @return {?}
     */
    emitSelectedRows() {
        /** @type {?} */
        const selectedNodes = this.gridApi.getSelectedNodes();
        /** @type {?} */
        const selectedData = selectedNodes.map(node => node.data);
        this.getSelectedRows.emit(selectedData);
    }
    /**
     * @return {?}
     */
    emitAllRows() {
        /** @type {?} */
        let rowData = [];
        this.gridApi.forEachNode(node => rowData.push(node.data));
        this.getAllRows.emit(rowData);
    }
    /**
     * @return {?}
     */
    saveAgGridState() {
        /** @type {?} */
        let agGridState = {
            idAgGrid: this.id,
            colState: this.gridColumnApi.getColumnState(),
            filterState: this.gridApi.getFilterModel(),
            sortState: this.gridApi.getSortModel(),
            valueSearchGeneric: this.searchValue
        };
        localStorage.setItem("agGridState", JSON.stringify(agGridState));
    }
    /**
     * @return {?}
     */
    removeAgGridState() {
        localStorage.removeItem("agGridState");
    }
    /**
     * @param {?} columnkeys
     * @return {?}
     */
    getColumnKeysAndHeaders(columnkeys) {
        /** @type {?} */
        let header = [];
        if (this.columnDefs.length == 0) {
            return '';
        }
        ;
        /** @type {?} */
        let allColumnKeys = this.gridOptions.columnApi.getAllDisplayedColumns();
        // console.log(allColumnKeys);
        allColumnKeys.forEach(element => {
            if (element.userProvidedColDef.headerName !== '') {
                columnkeys.push(element.userProvidedColDef.field);
                header.push(element.userProvidedColDef.headerName);
            }
        });
        return header.join(",");
    }
    /**
     * @return {?}
     */
    exportData() {
        /** @type {?} */
        let columnkeys = [];
        /** @type {?} */
        let customHeader = '';
        customHeader = this.getColumnKeysAndHeaders(columnkeys);
        /** @type {?} */
        let params = {
            onlySelected: true,
            columnKeys: columnkeys,
            customHeader: customHeader,
            skipHeader: true
        };
        this.gridApi.exportDataAsCsv(params);
    }
    /**
     * @return {?}
     */
    quickSearch() {
        this.gridApi.setQuickFilter(this.searchValue);
    }
    /**
     * @return {?}
     */
    getElements() {
        this.getAll()
            .subscribe((items) => {
            this.rowData = items;
            this.gridApi.setRowData(this.rowData);
            this.setSize();
            // this.gridApi.sizeColumnsToFit()
            console.log(this.rowData);
        });
    }
    /**
     * @return {?}
     */
    setSize() {
        /** @type {?} */
        var allColumnIds = [];
        /** @type {?} */
        let columns = this.gridOptions.columnApi.getAllColumns();
        columns.forEach(function (column) {
            allColumnIds.push(column.colId);
        });
        this.gridOptions.columnApi.autoSizeColumns(allColumnIds);
        /** @type {?} */
        let grid = this.gridOptions.api;
        /** @type {?} */
        let availableWidth = grid.gridPanel.eBodyViewport.clientWidth;
        /** @type {?} */
        let usedWidth = grid.gridPanel.columnController.getWidthOfColsInList(columns);
        if (usedWidth < availableWidth) {
            grid.sizeColumnsToFit();
        }
    }
    /**
     * @param {?} newItems
     * @return {?}
     */
    addItems(newItems) {
        console.log(newItems);
        /** @type {?} */
        let itemsToAdd = [];
        newItems.forEach(item => {
            if (item.id == undefined || (this.rowData.find(element => element.id === item.id)) == undefined) {
                if (this.statusColumn) {
                    item.status = 'pendingCreation';
                }
                itemsToAdd.push(item);
                this.rowData.push(item);
            }
            else {
                console.log(`Item with the ID ${item.id} already exists`);
            }
        });
        this.gridApi.updateRowData({ add: itemsToAdd });
        console.log(this.columnDefs);
        // params.oldValue!=undefined
    }
    /**
     * @param {?} value
     * @return {?}
     */
    changeHeight(value) {
        /** @type {?} */
        let pixels = "";
        if (value === '5') {
            pixels = "200px";
        }
        else if (value === '10') {
            pixels = "315px";
        }
        else if (value === '20') {
            pixels = "630px";
        }
        else {
            pixels = "1550px";
        }
        this.elRef.nativeElement.parentElement.style.height = pixels;
    }
    /**
     * @return {?}
     */
    removeData() {
        this.gridApi.stopEditing(false);
        /** @type {?} */
        const selectedNodes = this.gridApi.getSelectedNodes();
        /** @type {?} */
        const selectedData = selectedNodes.map(node => node.data);
        this.remove.emit(selectedData);
        if (this.statusColumn) {
            /** @type {?} */
            const selectedRows = selectedNodes.map(node => node.id);
            if (selectedRows.length > 0) {
                this.someStatusHasChangedToDelete = true;
            }
            for (const id of selectedRows) {
                this.gridApi.getRowNode(id).data.status = 'pendingDelete';
            }
            this.gridOptions.api.refreshCells();
        }
        this.gridOptions.api.deselectAll();
    }
    /**
     * @return {?}
     */
    newData() {
        this.gridApi.stopEditing(false);
        this.new.emit(-1);
    }
    /**
     * @return {?}
     */
    onAddButtonClicked() {
        this.gridApi.stopEditing(false);
        this.add.emit(-1);
    }
    /**
     * @return {?}
     */
    onDuplicateButtonClicked() {
        this.gridApi.stopEditing(false);
        console.log(this.changeCounter);
        if (this.changeCounter > 0) {
            /** @type {?} */
            const dialogRef = this.dialog.open(DialogMessageComponent);
            dialogRef.componentInstance.title = this.translate.instant('caution');
            dialogRef.componentInstance.message = this.translate.instant('duplicateMessage');
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (result.event === 'Accept') {
                        /** @type {?} */
                        const selectedNodes = this.gridApi.getSelectedNodes();
                        /** @type {?} */
                        const selectedData = selectedNodes.map(node => node.data);
                        this.duplicate.emit(selectedData);
                    }
                }
            });
        }
        else {
            /** @type {?} */
            const selectedNodes = this.gridApi.getSelectedNodes();
            /** @type {?} */
            const selectedData = selectedNodes.map(node => node.data);
            this.duplicate.emit(selectedData);
        }
    }
    /**
     * @return {?}
     */
    applyChanges() {
        /** @type {?} */
        const itemsChanged = [];
        this.gridApi.stopEditing(false);
        for (const key of this.changesMap.keys()) {
            itemsChanged.push(this.gridApi.getRowNode(key).data);
        }
        this.sendChanges.emit(itemsChanged);
        this.changesMap.clear();
        this.changeCounter = 0;
        this.previousChangeCounter = 0;
        this.redoCounter = 0;
        this.someStatusHasChangedToDelete = false;
        this.params.colDef.cellStyle = { backgroundColor: '#FFFFFF' };
        this.gridApi.redrawRows();
    }
    /**
     * @return {?}
     */
    deleteChanges() {
        this.gridApi.stopEditing(false);
        while (this.changeCounter > 0) {
            this.undo();
        }
        this.changesMap.clear();
        //this.previousChangeCounter = 0;
        this.redoCounter = 0;
        if (this.statusColumn) {
            this.gridApi.forEachNode(function (node) {
                if (node.data.status === 'pendingModify' || node.data.status === 'pendingDelete') {
                    node.data.status = '';
                }
                console.log(node);
            });
            this.gridApi.refreshCells();
            this.someStatusHasChangedToDelete = false;
        }
        //this.params.colDef.cellStyle =  {backgroundColor: '#FFFFFF'};
        //this.gridApi.redrawRows();
    }
    /**
     * @return {?}
     */
    onFilterModified() {
        this.deleteChanges();
    }
    /**
     * @return {?}
     */
    undo() {
        this.gridApi.stopEditing(false);
        this.gridApi.undoCellEditing();
        this.changeCounter -= 1;
        this.redoCounter += 1;
    }
    /**
     * @return {?}
     */
    redo() {
        this.gridApi.stopEditing(false);
        this.gridApi.redoCellEditing();
        this.changeCounter += 1;
        this.redoCounter -= 1;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    onCellEditingStopped(e) {
        if (this.modificationChange) {
            this.changeCounter++;
            this.redoCounter = 0;
            this.onCellValueChanged(e);
            this.modificationChange = false;
        }
    }
    /**
     * @param {?} params
     * @return {?}
     */
    onCellValueChanged(params) {
        console.log("value Change");
        this.params = params;
        if (this.changeCounter > this.previousChangeCounter) {
            if (params.oldValue !== params.value && !(params.oldValue == null && params.value === '')) {
                if (!this.changesMap.has(params.node.id)) // If it's firts edit of a cell, we add it to the map and we paint it
                 {
                    /** @type {?} */
                    const addMap = new Map();
                    addMap.set(params.colDef.field, 1);
                    this.changesMap.set(params.node.id, addMap);
                    if (this.statusColumn) {
                        if (this.gridApi.getRowNode(params.node.id).data.status !== 'pendingCreation') {
                            this.gridApi.getRowNode(params.node.id).data.status = 'pendingModify';
                        }
                    }
                }
                else {
                    if (!this.changesMap.get(params.node.id).has(params.colDef.field)) {
                        this.changesMap.get(params.node.id).set(params.colDef.field, 1);
                    }
                    else {
                        /** @type {?} */
                        const currentChanges = this.changesMap.get(params.node.id).get(params.colDef.field);
                        this.changesMap.get(params.node.id).set(params.colDef.field, (currentChanges + 1));
                    }
                }
                this.paintCells(params, this.changesMap); //We paint the row of the edited cell
                this.previousChangeCounter++; //We match the current previousChangeCounter with changeCounter
            }
        }
        else if (this.changeCounter < this.previousChangeCounter) { // True if we have done an undo
            /** @type {?} */
            let currentChanges = -1;
            if (this.changesMap.has(params.node.id)) {
                currentChanges = this.changesMap.get(params.node.id).get(params.colDef.field);
            }
            if (currentChanges === 1) { //Once the undo it's done, cell is in his initial status
                //Once the undo it's done, cell is in his initial status
                this.changesMap.get(params.node.id).delete(params.colDef.field);
                if (this.changesMap.get(params.node.id).size === 0) { // No more modifications in this row
                    // No more modifications in this row
                    this.changesMap.delete(params.node.id);
                    /** @type {?} */
                    const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
                    if (this.statusColumn) {
                        if (this.gridApi.getRowNode(params.node.id).data.status !== 'pendingCreation') {
                            this.gridApi.getRowNode(params.node.id).data.status = '';
                        }
                    }
                    ;
                    // We paint it white
                    this.gridApi.redrawRows({ rowNodes: [row] });
                }
                else {
                    this.paintCells(params, this.changesMap);
                }
            }
            else if (currentChanges > 1) // The cell isn't in his initial state yet
             { //We can't do else because we can be doing an undo without changes 
                //We can't do else because we can be doing an undo without changes
                this.changesMap.get(params.node.id).set(params.colDef.field, (currentChanges - 1));
                this.paintCells(params, this.changesMap); //Not initial state -> green background
            }
            this.previousChangeCounter--; //We decrement previousChangeCounter because we have done undo
        }
        else { // Control of modifications without changes
            // Control of modifications without changes
            if (!(params.oldValue == null && params.value === '')) {
                /** @type {?} */
                let newValue;
                if (params.value == null) {
                    newValue = '';
                }
                else {
                    newValue = params.value.toString();
                }
                if ((params.oldValue != undefined && params.oldValue != null && params.oldValue.toString() !== newValue.toString())
                    || ((params.oldValue == undefined || params.oldValue == null) && newValue != null)) {
                    this.modificationChange = true;
                    if (params.colDef.cellRenderer == "btnCheckboxRendererComponent") {
                        /** @type {?} */
                        var undoRedoActions = {
                            cellValueChanges: this.gridApi.undoRedoService.cellValueChanges
                        };
                        this.gridApi.undoRedoService.pushActionsToUndoStack(undoRedoActions);
                        this.gridApi.undoRedoService.isFilling = false;
                        this.onCellEditingStopped(params);
                    }
                }
                else {
                    this.modificationWithoutChanges(params);
                }
            }
            else {
                this.modificationWithoutChanges(params);
            }
        }
    }
    /**
     * @param {?} params
     * @return {?}
     */
    modificationWithoutChanges(params) {
        if (this.changesMap.has(params.node.id)) //Modification without changes in en edited cell
         {
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
    }
    /**
     * @param {?} api
     * @param {?} colId
     * @return {?}
     */
    getColumnIndexByColId(api, colId) {
        return api.getAllColumns().findIndex(col => col.getColId() === colId);
    }
    /**
     * @param {?} params
     * @param {?} changesMap
     * @return {?}
     */
    paintCells(params, changesMap) {
        /** @type {?} */
        const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
        this.changeCellStyleColumns(params, changesMap, '#E8F1DE');
        this.gridApi.redrawRows({ rowNodes: [row] });
        this.changeCellStyleColumns(params, changesMap, '#FFFFFF');
        // We will define cellStyle white to future modifications (like filter)
    }
    /**
     * @param {?} params
     * @param {?} changesMap
     * @param {?} color
     * @return {?}
     */
    changeCellStyleColumns(params, changesMap, color) {
        for (const key of changesMap.get(params.node.id).keys()) {
            /** @type {?} */
            const columnNumber = this.getColumnIndexByColId(this.gridColumnApi, key);
            this.gridColumnApi.columnController.gridColumns[columnNumber].colDef.cellStyle = { backgroundColor: color };
        }
    }
}
DataGridComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-data-grid',
                template: "<div id=grup1 class=\"editDivBtns\">\r\n    <span *ngIf=\"title\" [translate]=\"title\"> </span>\r\n    <button type=\"button\" title=\"{{ 'cancel' | translate }}\" mat-mini-fab class=\"mini-fab mat-red\" *ngIf=\"discardChangesButton\"\r\n        id=\"deleteChangesButton\" type=\"button\" (click)=\"deleteChanges()\" [disabled]=\"changeCounter <= 0 && !someStatusHasChangedToDelete\">\r\n        <mat-icon fontSet=\"material-icons-round\"> close </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'undo' | translate }}\" mat-mini-fab class=\"mini-fab mat-orange\" *ngIf=\"undoButton\"\r\n        id=\"undo\" (click)=\"undo()\" [disabled]=\"changeCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> undo </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'redo' | translate }}\" mat-mini-fab class=\"mini-fab mat-orange\" *ngIf=\"redoButton\"\r\n        id=\"redo\" (click)=\"redo()\" [disabled]=\"redoCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> redo </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'accept' | translate }}\" mat-mini-fab class=\"mini-fab mat-green\"\r\n        *ngIf=\"applyChangesButton\" id=\"applyChangesButton\" (click)=\"applyChanges()\" [disabled]=\"changeCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> check </mat-icon>\r\n    </button>\r\n</div>\r\n\r\n<div id=grup2 class=\"actionsDivBtns\">\r\n    <label *ngIf=\"globalSearch\" [translate]=\"'search'\"> </label>\r\n    <input *ngIf=\"globalSearch\" type=\"text\" class=\"searchGenericInput\" placeholder=\"\" (keyup)=\"quickSearch()\"\r\n        [(ngModel)]=\"searchValue\" ml-2>\r\n    <label *ngIf=\"changeHeightButton\" [translate]=\"'rowsToShow'\"> </label>\r\n    <mat-button-toggle-group *ngIf=\"changeHeightButton\" class=\"toogleButton\" name=\"fontStyle\" aria-label=\"Font Style\"  value=\"5\">\r\n        <mat-button-toggle value=\"5\" (change)=\"changeHeight($event.value)\">5</mat-button-toggle>\r\n        <mat-button-toggle value=\"20\" (change)=\"changeHeight($event.value)\">20</mat-button-toggle>\r\n        <mat-button-toggle value=\"50\" (change)=\"changeHeight($event.value)\">50</mat-button-toggle>\r\n    </mat-button-toggle-group>\r\n\r\n    <button type=\"button\" *ngIf=\"deleteButton\" mat-flat-button id=\"deleteButton\" class=\"deleteButton\"\r\n        (click)=\"removeData()\" [disabled]=\"!areRowsSelected()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> delete </mat-icon>\r\n        <span [translate]=\"'remove'\"> </span>\r\n\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"actionButton\" mat-flat-button [matMenuTriggerFor]=\"menu\" id=\"actionButton\"\r\n        class=\"actionButton\">\r\n        <span [translate]=\"'actions'\"> </span>\r\n        <mat-icon fontSet=\"material-icons-round\"> keyboard_arrow_down </mat-icon>\r\n    </button>\r\n    <mat-menu #menu=\"matMenu\">\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideExportButton\" (click)=\"exportData()\"> {{\"export\" | translate}}\r\n        </button>\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideDuplicateButton\" (click)=\"onDuplicateButtonClicked()\">\r\n            {{\"duplicate\" |\r\n            translate}}</button>\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideSearchReplaceButton && false\"> {{\"search/replace\" | translate}}</button>\r\n    </mat-menu>\r\n\r\n    <button type=\"button\" *ngIf=\"newButton\" mat-flat-button class=\"newButton\" (click)=\"newData()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'new'\"> </span>\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"addButton\" mat-flat-button class=\"newButton\" (click)=\"onAddButtonClicked()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'add'\"> </span>\r\n    </button>\r\n\r\n</div>\r\n\r\n<div class=\"row\" style=\" height: 100%\">\r\n    <div id=\"myGrid\" style=\" width:100%; height: 100%\">\r\n        <ag-grid-angular style=\"width: 100%; height: 100%;min-height: 200px;\" [class]=\"themeGrid\"\r\n            [floatingFilter]=\"true\" [rowData]=\"rowData\" [columnDefs]=\"columnDefs\" [gridOptions]=\"gridOptions\"\r\n            [animateRows]=\"true\" [pagination]=\"false\" [modules]=\"modules\" [undoRedoCellEditing]=\"true\"\r\n            [undoRedoCellEditingLimit]=200 [suppressRowClickSelection]=true [frameworkComponents]=\"frameworkComponents\"\r\n            rowSelection=\"multiple\" multiSortKey=\"key\" (filterModified)=\"onFilterModified()\"\r\n            (cellEditingStopped)=\"onCellEditingStopped($event)\" (cellValueChanged)=\"onCellValueChanged($event)\"\r\n            (gridReady)=\"onGridReady($event)\" (firstDataRendered)=\"firstDataRendered()\">\r\n        </ag-grid-angular>\r\n    </div>\r\n</div>",
                styles: ["@charset \"UTF-8\";input,label{display:inline-block;margin:5px 5px 5px 10px}.mat-flat-button.mat-orange,.mat-icon.mat-orange,.mat-mini-fab.mat-orange,.mat-raised-button.mat-orange{background-color:#ff9300!important;color:#fff!important}.mat-flat-button.mat-orange:disabled,.mat-icon.mat-orange:disabled,.mat-mini-fab.mat-orange:disabled,.mat-raised-button.mat-orange:disabled{background:#ffc97f!important;color:#fff!important}.mat-flat-button.mat-green,.mat-icon.mat-green,.mat-mini-fab.mat-green,.mat-raised-button.mat-green{background-color:#68a225!important;color:#fff!important}.mat-flat-button.mat-green:disabled,.mat-icon.mat-green:disabled,.mat-mini-fab.mat-green:disabled,.mat-raised-button.mat-green:disabled{background-color:#83976c!important;color:#fff!important}.mat-flat-button.mat-red,.mat-icon.mat-red,.mat-mini-fab.mat-red,.mat-raised-button.mat-red{background-color:#bf0000!important;color:#fff!important}.mat-flat-button.mat-red:disabled,.mat-icon.mat-red:disabled,.mat-mini-fab.mat-red:disabled,.mat-raised-button.mat-red:disabled{background-color:#da8c8e!important;color:#fff!important}.validateButton{background-color:#ff9300;color:#fff;margin-top:34px!important;min-width:85px}.deleteButton,.validateButton{-ms-grid-column-align:right!important;height:40px;justify-self:right!important}.deleteButton{border:1px solid #bf0000!important;color:#bf0000;float:inherit!important;min-width:85px!important}.deleteButton:disabled{background-color:inherit!important;border:1px solid rgba(0,0,0,.26)!important;color:rgba(0,0,0,.26) solid 1px!important}.actionButton,.returnButton{border:1px solid #ff9300!important;color:#ff9300}.actionButton,.newButton,.returnButton,.saveButton{-ms-grid-column-align:right!important;float:inherit!important;height:40px;justify-self:right!important;min-width:85px!important}.newButton,.saveButton{background-color:#68a225;color:#fff}.editDivBtns{height:30px!important;line-height:30px!important;margin-left:10px;text-align:start;width:130px}.actionsDivBtns{height:50px;text-align:end;width:calc(100% - 140px)}.actionsDivBtns,.editDivBtns{display:inline-block!important}.actionsDivBtns .searchGenericInput{display:inline-block!important;height:41px!important;margin:0 5px 5px 10px!important;width:45%!important}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-thumb{background:#eee}\u200B .ag-body-viewport.ag-layout-normal ::-webkit-scrollbar{height:2em;width:2em}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-button{background:#ccc}.ag-body-viewport.ag-layout-normal::-webkit-scrollbar-track-piece{background:#888}.mini-fab{height:28px!important;line-height:22px!important;margin-right:3px!important;margin-top:7px!important;width:28px!important}.mini-fab .mat-button-wrapper{height:24px!important;line-height:22px!important;padding:1px 0!important;width:24px!important}.mini-fab .mat-button-wrapper .mat-icon{font-size:20px;line-height:22px;padding-right:0}.toogleButton{align-items:center;height:40px;margin-right:10px;vertical-align:bottom}"]
            }] }
];
/** @nocollapse */
DataGridComponent.ctorParameters = () => [
    { type: MatDialog },
    { type: TranslateService },
    { type: ElementRef }
];
DataGridComponent.propDecorators = {
    eventRefreshSubscription: [{ type: Input }],
    eventGetSelectedRowsSubscription: [{ type: Input }],
    eventGetAllRowsSubscription: [{ type: Input }],
    eventSaveAgGridStateSubscription: [{ type: Input }],
    eventAddItemsSubscription: [{ type: Input }],
    frameworkComponents: [{ type: Input }],
    columnDefs: [{ type: Input }],
    getAll: [{ type: Input }],
    discardChangesButton: [{ type: Input }],
    id: [{ type: Input }],
    undoButton: [{ type: Input }],
    defaultColumnSorting: [{ type: Input }],
    redoButton: [{ type: Input }],
    applyChangesButton: [{ type: Input }],
    deleteButton: [{ type: Input }],
    newButton: [{ type: Input }],
    actionButton: [{ type: Input }],
    addButton: [{ type: Input }],
    globalSearch: [{ type: Input }],
    changeHeightButton: [{ type: Input }],
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
    getAllRows: [{ type: Output }],
    getAgGridState: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    DataGridComponent.prototype._eventRefreshSubscription;
    /** @type {?} */
    DataGridComponent.prototype._eventGetSelectedRowsSubscription;
    /** @type {?} */
    DataGridComponent.prototype._eventGetAllRowsSubscription;
    /** @type {?} */
    DataGridComponent.prototype._eventSaveAgGridStateSubscription;
    /** @type {?} */
    DataGridComponent.prototype.modules;
    /** @type {?} */
    DataGridComponent.prototype.UndeRedoActions;
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
    DataGridComponent.prototype.someStatusHasChangedToDelete;
    /** @type {?} */
    DataGridComponent.prototype.eventRefreshSubscription;
    /** @type {?} */
    DataGridComponent.prototype.eventGetSelectedRowsSubscription;
    /** @type {?} */
    DataGridComponent.prototype.eventGetAllRowsSubscription;
    /** @type {?} */
    DataGridComponent.prototype.eventSaveAgGridStateSubscription;
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
    DataGridComponent.prototype.id;
    /** @type {?} */
    DataGridComponent.prototype.undoButton;
    /** @type {?} */
    DataGridComponent.prototype.defaultColumnSorting;
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
    DataGridComponent.prototype.changeHeightButton;
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
    DataGridComponent.prototype.getAgGridState;
    /** @type {?} */
    DataGridComponent.prototype.dialog;
    /** @type {?} */
    DataGridComponent.prototype.translate;
    /** @type {?} */
    DataGridComponent.prototype.elRef;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1ncmlkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGF0YS1ncmlkL2RhdGEtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQW9CLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVyRyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRWxDLE9BQU8sRUFBRSxtQkFBbUIsRUFBcUIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUV4RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUM1RixPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUN4RyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUNsRyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDckQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFVcEYsTUFBTSxPQUFPLGlCQUFpQjs7Ozs7O0lBa0U1QixZQUFtQixNQUFpQixFQUMzQixXQUNDO1FBRlMsV0FBTSxHQUFOLE1BQU0sQ0FBVztRQUMzQixjQUFTLEdBQVQsU0FBUztRQUNSLFVBQUssR0FBTCxLQUFLO3VCQTlESyxtQkFBbUI7UUFPdkMsb0JBQWUsS0FBSyxDQUFDOzBCQUMwQixJQUFJLEdBQUcsRUFBK0I7UUFPckYsMEJBQXFCLEtBQUssQ0FBQztRQUMzQixxQkFBZ0IsS0FBSyxDQUFDO1FBRXRCLG9DQUErQixLQUFLLENBQUM7UUE2Q25D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QU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZ0dyaWRNb2R1bGUgfSBmcm9tICdAYWctZ3JpZC1jb21tdW5pdHkvYW5ndWxhcic7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBOZ01vZHVsZSwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBFbGVtZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgQWxsQ29tbXVuaXR5TW9kdWxlcywgQ29sdW1uQXBpLCBNb2R1bGUgfSBmcm9tICdAYWctZ3JpZC1jb21tdW5pdHkvYWxsLW1vZHVsZXMnO1xyXG5cclxuaW1wb3J0IHsgVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xyXG5pbXBvcnQgeyBCdG5FZGl0UmVuZGVyZWRDb21wb25lbnQgfSBmcm9tICcuLi9idG4tZWRpdC1yZW5kZXJlZC9idG4tZWRpdC1yZW5kZXJlZC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBCdG5DaGVja2JveFJlbmRlcmVkQ29tcG9uZW50IH0gZnJvbSAnLi4vYnRuLWNoZWNrYm94LXJlbmRlcmVkL2J0bi1jaGVja2JveC1yZW5kZXJlZC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBCdG5DaGVja2JveEZpbHRlckNvbXBvbmVudCB9IGZyb20gJy4uL2J0bi1jaGVja2JveC1maWx0ZXIvYnRuLWNoZWNrYm94LWZpbHRlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNYXREaWFsb2cgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xyXG5pbXBvcnQgeyBEaWFsb2dNZXNzYWdlQ29tcG9uZW50IH0gZnJvbSAnLi4vZGlhbG9nLW1lc3NhZ2UvZGlhbG9nLW1lc3NhZ2UuY29tcG9uZW50JztcclxuXHJcblxyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWRhdGEtZ3JpZCcsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2RhdGEtZ3JpZC5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vZGF0YS1ncmlkLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIERhdGFHcmlkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgX2V2ZW50UmVmcmVzaFN1YnNjcmlwdGlvbjogYW55O1xyXG4gIF9ldmVudEdldFNlbGVjdGVkUm93c1N1YnNjcmlwdGlvbjogYW55O1xyXG4gIF9ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb246IGFueTtcclxuICBfZXZlbnRTYXZlQWdHcmlkU3RhdGVTdWJzY3JpcHRpb246IGFueTtcclxuICBtb2R1bGVzOiBNb2R1bGVbXSA9IEFsbENvbW11bml0eU1vZHVsZXM7XHJcblxyXG5cclxuICBVbmRlUmVkb0FjdGlvbnNcclxuICBzZWFyY2hWYWx1ZTogc3RyaW5nO1xyXG4gIGdyaWRBcGk6IGFueTtcclxuICBncmlkQ29sdW1uQXBpOiBhbnk7XHJcbiAgc3RhdHVzQ29sdW1uID0gZmFsc2U7XHJcbiAgY2hhbmdlc01hcDogTWFwPG51bWJlciwgTWFwPHN0cmluZywgbnVtYmVyPj4gPSBuZXcgTWFwPG51bWJlciwgTWFwPHN0cmluZywgbnVtYmVyPj4oKTtcclxuICAvLyBXZSB3aWxsIHNhdmUgdGhlIGlkIG9mIGVkaXRlZCBjZWxscyBhbmQgdGhlIG51bWJlciBvZiBlZGl0aW9ucyBkb25lLlxyXG4gIHBhcmFtczogYW55OyAvLyBMYXN0IHBhcmFtZXRlcnMgb2YgdGhlIGdyaWQgKGluIGNhc2Ugd2UgZG8gYXBwbHkgY2hhbmdlcyB3ZSB3aWxsIG5lZWQgaXQpIFxyXG4gIHJvd0RhdGE6IGFueVtdO1xyXG4gIGNoYW5nZUNvdW50ZXI6IG51bWJlcjsgLy8gTnVtYmVyIG9mIGVkaXRpb25zIGRvbmUgYWJvdmUgYW55IGNlbGwgXHJcbiAgcHJldmlvdXNDaGFuZ2VDb3VudGVyOiBudW1iZXI7IC8vIE51bWJlciBvZiBkaXRpb25zIGRvbmUgYWZ0ZXIgdGhlIGxhc3QgbW9kaWZpY2F0aW9uKGNoYW5nZUNvdW50ZXIpXHJcbiAgcmVkb0NvdW50ZXI6IG51bWJlcjsgLy8gTnVtYmVyIG9mIHJlZG8gd2UgY2FuIGRvXHJcbiAgbW9kaWZpY2F0aW9uQ2hhbmdlID0gZmFsc2U7XHJcbiAgdW5kb05vQ2hhbmdlcyA9IGZhbHNlOyAvLyBCb29sZWFuIHRoYXQgaW5kaWNhdGVzIGlmIGFuIHVuZG8gaGFzbid0IG1vZGlmaWNhdGlvbnNcclxuICBncmlkT3B0aW9ucztcclxuICBzb21lU3RhdHVzSGFzQ2hhbmdlZFRvRGVsZXRlID0gZmFsc2U7XHJcblxyXG5cclxuICBASW5wdXQoKSBldmVudFJlZnJlc2hTdWJzY3JpcHRpb246IE9ic2VydmFibGU8Ym9vbGVhbj47XHJcbiAgQElucHV0KCkgZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb246IE9ic2VydmFibGU8Ym9vbGVhbj47XHJcbiAgQElucHV0KCkgZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG4gIEBJbnB1dCgpIGV2ZW50U2F2ZUFnR3JpZFN0YXRlU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG4gIEBJbnB1dCgpIGV2ZW50QWRkSXRlbXNTdWJzY3JpcHRpb246IE9ic2VydmFibGU8Ym9vbGVhbj47XHJcbiAgQElucHV0KCkgZnJhbWV3b3JrQ29tcG9uZW50czogYW55O1xyXG4gIEBJbnB1dCgpIGNvbHVtbkRlZnM6IGFueVtdO1xyXG4gIEBJbnB1dCgpIGdldEFsbDogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+O1xyXG4gIEBJbnB1dCgpIGRpc2NhcmRDaGFuZ2VzQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGlkOiBhbnk7XHJcbiAgQElucHV0KCkgdW5kb0J1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBkZWZhdWx0Q29sdW1uU29ydGluZzogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHJlZG9CdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYXBwbHlDaGFuZ2VzQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGRlbGV0ZUJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBuZXdCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYWN0aW9uQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGFkZEJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBnbG9iYWxTZWFyY2g6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgY2hhbmdlSGVpZ2h0QnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHRoZW1lR3JpZDogYW55O1xyXG4gIEBJbnB1dCgpIHNpbmdsZVNlbGVjdGlvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBub25FZGl0YWJsZTogYm9vbGVhbjtcclxuICBASW5wdXQoKSB0aXRsZTogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGhpZGVFeHBvcnRCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgaGlkZUR1cGxpY2F0ZUJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBoaWRlU2VhcmNoUmVwbGFjZUJ1dHRvbjogYm9vbGVhbjtcclxuXHJcblxyXG4gIEBPdXRwdXQoKSByZW1vdmU6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIG5ldzogRXZlbnRFbWl0dGVyPG51bWJlcj47XHJcbiAgQE91dHB1dCgpIGFkZDogRXZlbnRFbWl0dGVyPG51bWJlcj47XHJcbiAgQE91dHB1dCgpIHNlbmRDaGFuZ2VzOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG4gIEBPdXRwdXQoKSBkdXBsaWNhdGU6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIGdldFNlbGVjdGVkUm93czogRXZlbnRFbWl0dGVyPGFueVtdPjtcclxuICBAT3V0cHV0KCkgZ2V0QWxsUm93czogRXZlbnRFbWl0dGVyPGFueVtdPjtcclxuICBAT3V0cHV0KCkgZ2V0QWdHcmlkU3RhdGU6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcblxyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGlhbG9nOiBNYXREaWFsb2csXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBlbFJlZjogRWxlbWVudFJlZikge1xyXG4gICAgdGhpcy50cmFuc2xhdGUgPSB0cmFuc2xhdGU7XHJcblxyXG4gICAgdGhpcy5mcmFtZXdvcmtDb21wb25lbnRzID0ge1xyXG4gICAgICBidG5FZGl0UmVuZGVyZXJDb21wb25lbnQ6IEJ0bkVkaXRSZW5kZXJlZENvbXBvbmVudCxcclxuICAgICAgYnRuQ2hlY2tib3hSZW5kZXJlckNvbXBvbmVudDogQnRuQ2hlY2tib3hSZW5kZXJlZENvbXBvbmVudCxcclxuICAgICAgYnRuQ2hlY2tib3hGaWx0ZXJDb21wb25lbnQ6IEJ0bkNoZWNrYm94RmlsdGVyQ29tcG9uZW50XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucmVtb3ZlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5uZXcgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmFkZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuc2VuZENoYW5nZXMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmdldFNlbGVjdGVkUm93cyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuZHVwbGljYXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5nZXRBbGxSb3dzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5jaGFuZ2VDb3VudGVyID0gMDtcclxuICAgIHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyID0gMDtcclxuICAgIHRoaXMucmVkb0NvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5ncmlkT3B0aW9ucyA9IHtcclxuICAgICAgZGVmYXVsdENvbERlZjoge1xyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGZsZXg6IDEsXHJcbiAgICAgICAgZmlsdGVyOiB0cnVlLFxyXG4gICAgICAgIGVkaXRhYmxlOiAhdGhpcy5ub25FZGl0YWJsZSxcclxuICAgICAgICBjZWxsU3R5bGU6IHsgYmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRicgfSxcclxuICAgICAgICBzdXBwcmVzc01lbnU6IHRydWUsXHJcbiAgICAgICAgcmVzaXphYmxlOiB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbHVtblR5cGVzOiB7XHJcbiAgICAgICAgZGF0ZUNvbHVtbjoge1xyXG4gICAgICAgICAgZmlsdGVyOiAnYWdEYXRlQ29sdW1uRmlsdGVyJyxcclxuICAgICAgICAgIGZpbHRlclBhcmFtczoge1xyXG4gICAgICAgICAgICBjb21wYXJhdG9yKGZpbHRlckxvY2FsRGF0ZUF0TWlkbmlnaHQsIGNlbGxWYWx1ZSkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IGRhdGVDZWxsVmFsdWUgPSBuZXcgRGF0ZShjZWxsVmFsdWUpO1xyXG4gICAgICAgICAgICAgIGNvbnN0IGRhdGVGaWx0ZXIgPSBuZXcgRGF0ZShmaWx0ZXJMb2NhbERhdGVBdE1pZG5pZ2h0KTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGRhdGVDZWxsVmFsdWUuZ2V0VGltZSgpIDwgZGF0ZUZpbHRlci5nZXRUaW1lKCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGVDZWxsVmFsdWUuZ2V0VGltZSgpID4gZGF0ZUZpbHRlci5nZXRUaW1lKCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc3VwcHJlc3NNZW51OiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICByb3dTZWxlY3Rpb246ICdtdWx0aXBsZScsXHJcbiAgICAgIHNpbmdsZUNsaWNrRWRpdDogdHJ1ZSxcclxuICAgICAgLy8gc3VwcHJlc3NIb3Jpem9udGFsU2Nyb2xsOiB0cnVlLFxyXG4gICAgICBsb2NhbGVUZXh0RnVuYzogKGtleTogc3RyaW5nLCBkZWZhdWx0VmFsdWU6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KGtleSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGEgPT09IGtleSA/IGRlZmF1bHRWYWx1ZSA6IGRhdGE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gIH1cclxuXHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG5cclxuICAgIGlmICh0aGlzLmV2ZW50UmVmcmVzaFN1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLl9ldmVudFJlZnJlc2hTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50UmVmcmVzaFN1YnNjcmlwdGlvbi5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuY2hhbmdlc01hcC5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuc29tZVN0YXR1c0hhc0NoYW5nZWRUb0RlbGV0ZT1mYWxzZTtcclxuICAgICAgICB0aGlzLmNoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLmdldEVsZW1lbnRzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5fZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbWl0U2VsZWN0ZWRSb3dzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbWl0QWxsUm93cygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5ldmVudFNhdmVBZ0dyaWRTdGF0ZVN1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLl9ldmVudFNhdmVBZ0dyaWRTdGF0ZVN1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRTYXZlQWdHcmlkU3RhdGVTdWJzY3JpcHRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLnNhdmVBZ0dyaWRTdGF0ZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5ldmVudEFkZEl0ZW1zU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuZXZlbnRBZGRJdGVtc1N1YnNjcmlwdGlvbi5zdWJzY3JpYmUoXHJcbiAgICAgICAgKGl0ZW1zOiBhbnkpID0+IHtcclxuICAgICAgICAgIHRoaXMuYWRkSXRlbXMoaXRlbXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIGZpcnN0RGF0YVJlbmRlcmVkKCk6IHZvaWQge1xyXG4gICAgaWYgKGxvY2FsU3RvcmFnZS5hZ0dyaWRTdGF0ZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgbGV0IGFnR3JpZFN0YXRlID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuYWdHcmlkU3RhdGUpXHJcbiAgICAgIGlmIChhZ0dyaWRTdGF0ZS5pZEFnR3JpZCAhPSB1bmRlZmluZWQgJiYgYWdHcmlkU3RhdGUuaWRBZ0dyaWQgPT0gdGhpcy5pZCkge1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS5zZXRGaWx0ZXJNb2RlbChhZ0dyaWRTdGF0ZS5maWx0ZXJTdGF0ZSk7XHJcbiAgICAgICAgdGhpcy5ncmlkQ29sdW1uQXBpLnNldENvbHVtblN0YXRlKGFnR3JpZFN0YXRlLmNvbFN0YXRlKTtcclxuICAgICAgICB0aGlzLmdyaWRBcGkuc2V0U29ydE1vZGVsKGFnR3JpZFN0YXRlLnNvcnRTdGF0ZSk7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hWYWx1ZSA9IGFnR3JpZFN0YXRlLnZhbHVlU2VhcmNoR2VuZXJpYztcclxuICAgICAgICB0aGlzLnF1aWNrU2VhcmNoKCk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBZ0dyaWRTdGF0ZSgpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaWQgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBZ0dyaWRTdGF0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkdyaWRSZWFkeShwYXJhbXMpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnNpbmdsZVNlbGVjdGlvbikgeyB0aGlzLmdyaWRPcHRpb25zLnJvd1NlbGVjdGlvbiA9ICdzaW5nbGUnIH1cclxuICAgIC8vIGlmICh0aGlzLm5vbkVkaXRhYmxlKSB7dGhpcy5ncmlkT3B0aW9ucy5kZWZhdWx0Q29sRGVmLmVkaXRhYmxlID0gZmFsc2V9XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgIHRoaXMuZ3JpZEFwaSA9IHBhcmFtcy5hcGk7XHJcbiAgICB0aGlzLmdyaWRDb2x1bW5BcGkgPSBwYXJhbXMuY29sdW1uQXBpO1xyXG4gICAgdGhpcy5nZXRFbGVtZW50cygpO1xyXG4gICAgY29uc29sZS5sb2codGhpcy5jb2x1bW5EZWZzKTtcclxuICAgIGZvciAoY29uc3QgY29sIG9mIHRoaXMuY29sdW1uRGVmcykge1xyXG4gICAgICBpZiAoY29sLmZpZWxkID09PSAnc3RhdHVzJykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwic3RhdHVzIGNvbHVtbiB0cnVlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXR1c0NvbHVtbiA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh0aGlzLmRlZmF1bHRDb2x1bW5Tb3J0aW5nKSB7XHJcbiAgICAgIGNvbnN0IHNvcnRNb2RlbCA9IFtcclxuICAgICAgICB7IGNvbElkOiB0aGlzLmRlZmF1bHRDb2x1bW5Tb3J0aW5nLCBzb3J0OiAnYXNjJyB9XHJcbiAgICAgIF07XHJcbiAgICAgIHRoaXMuZ3JpZEFwaS5zZXRTb3J0TW9kZWwoc29ydE1vZGVsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBhcmVSb3dzU2VsZWN0ZWQoKTogQm9vbGVhbiB7XHJcbiAgICBpZiAodGhpcy5ncmlkQXBpICE9IG51bGwgJiYgdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBlbWl0U2VsZWN0ZWRSb3dzKCk6IHZvaWQge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IHRoaXMuZ3JpZEFwaS5nZXRTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICBjb25zdCBzZWxlY3RlZERhdGEgPSBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IG5vZGUuZGF0YSk7XHJcbiAgICB0aGlzLmdldFNlbGVjdGVkUm93cy5lbWl0KHNlbGVjdGVkRGF0YSk7XHJcbiAgfVxyXG5cclxuICBlbWl0QWxsUm93cygpOiB2b2lkIHtcclxuICAgIGxldCByb3dEYXRhID0gW107XHJcbiAgICB0aGlzLmdyaWRBcGkuZm9yRWFjaE5vZGUobm9kZSA9PiByb3dEYXRhLnB1c2gobm9kZS5kYXRhKSk7XHJcbiAgICB0aGlzLmdldEFsbFJvd3MuZW1pdChyb3dEYXRhKTtcclxuICB9XHJcblxyXG4gIHNhdmVBZ0dyaWRTdGF0ZSgpOiB2b2lkIHtcclxuICAgIGxldCBhZ0dyaWRTdGF0ZSA9IHtcclxuICAgICAgaWRBZ0dyaWQ6IHRoaXMuaWQsXHJcbiAgICAgIGNvbFN0YXRlOiB0aGlzLmdyaWRDb2x1bW5BcGkuZ2V0Q29sdW1uU3RhdGUoKSxcclxuICAgICAgZmlsdGVyU3RhdGU6IHRoaXMuZ3JpZEFwaS5nZXRGaWx0ZXJNb2RlbCgpLFxyXG4gICAgICBzb3J0U3RhdGU6IHRoaXMuZ3JpZEFwaS5nZXRTb3J0TW9kZWwoKSxcclxuICAgICAgdmFsdWVTZWFyY2hHZW5lcmljOiB0aGlzLnNlYXJjaFZhbHVlXHJcbiAgICB9O1xyXG5cclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWdHcmlkU3RhdGVcIiwgSlNPTi5zdHJpbmdpZnkoYWdHcmlkU3RhdGUpKTtcclxuXHJcbiAgfVxyXG4gIHJlbW92ZUFnR3JpZFN0YXRlKCk6IHZvaWQge1xyXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhZ0dyaWRTdGF0ZVwiKVxyXG4gIH1cclxuXHJcbiAgZ2V0Q29sdW1uS2V5c0FuZEhlYWRlcnMoY29sdW1ua2V5czogQXJyYXk8YW55Pik6IFN0cmluZyB7XHJcbiAgICBsZXQgaGVhZGVyOiBBcnJheTxhbnk+ID0gW107XHJcbiAgICBpZiAodGhpcy5jb2x1bW5EZWZzLmxlbmd0aCA9PSAwKSB7IHJldHVybiAnJyB9O1xyXG5cclxuICAgIGxldCBhbGxDb2x1bW5LZXlzID0gdGhpcy5ncmlkT3B0aW9ucy5jb2x1bW5BcGkuZ2V0QWxsRGlzcGxheWVkQ29sdW1ucygpO1xyXG4gICAgLy8gY29uc29sZS5sb2coYWxsQ29sdW1uS2V5cyk7XHJcbiAgICBhbGxDb2x1bW5LZXlzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgIGlmIChlbGVtZW50LnVzZXJQcm92aWRlZENvbERlZi5oZWFkZXJOYW1lICE9PSAnJykge1xyXG4gICAgICAgIGNvbHVtbmtleXMucHVzaChlbGVtZW50LnVzZXJQcm92aWRlZENvbERlZi5maWVsZCk7XHJcbiAgICAgICAgaGVhZGVyLnB1c2goZWxlbWVudC51c2VyUHJvdmlkZWRDb2xEZWYuaGVhZGVyTmFtZSk7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGhlYWRlci5qb2luKFwiLFwiKTtcclxuICB9XHJcblxyXG5cclxuICBleHBvcnREYXRhKCk6IHZvaWQge1xyXG4gICAgbGV0IGNvbHVtbmtleXM6IEFycmF5PGFueT4gPSBbXTtcclxuICAgIGxldCBjdXN0b21IZWFkZXI6IFN0cmluZyA9ICcnO1xyXG4gICAgY3VzdG9tSGVhZGVyID0gdGhpcy5nZXRDb2x1bW5LZXlzQW5kSGVhZGVycyhjb2x1bW5rZXlzKVxyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgb25seVNlbGVjdGVkOiB0cnVlLFxyXG4gICAgICBjb2x1bW5LZXlzOiBjb2x1bW5rZXlzLFxyXG4gICAgICBjdXN0b21IZWFkZXI6IGN1c3RvbUhlYWRlcixcclxuICAgICAgc2tpcEhlYWRlcjogdHJ1ZVxyXG4gICAgfTtcclxuICAgIHRoaXMuZ3JpZEFwaS5leHBvcnREYXRhQXNDc3YocGFyYW1zKTtcclxuICB9XHJcblxyXG4gIHF1aWNrU2VhcmNoKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnNldFF1aWNrRmlsdGVyKHRoaXMuc2VhcmNoVmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgZ2V0RWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdldEFsbCgpXHJcbiAgICAgIC5zdWJzY3JpYmUoKGl0ZW1zKSA9PiB7XHJcbiAgICAgICAgdGhpcy5yb3dEYXRhID0gaXRlbXM7XHJcbiAgICAgICAgdGhpcy5ncmlkQXBpLnNldFJvd0RhdGEodGhpcy5yb3dEYXRhKTtcclxuICAgICAgICB0aGlzLnNldFNpemUoKVxyXG4gICAgICAgIC8vIHRoaXMuZ3JpZEFwaS5zaXplQ29sdW1uc1RvRml0KClcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnJvd0RhdGEpO1xyXG5cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRTaXplKCkge1xyXG5cclxuICAgIHZhciBhbGxDb2x1bW5JZHMgPSBbXTtcclxuICAgIGxldCBjb2x1bW5zID0gdGhpcy5ncmlkT3B0aW9ucy5jb2x1bW5BcGkuZ2V0QWxsQ29sdW1ucygpO1xyXG4gICAgY29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uIChjb2x1bW4pIHtcclxuICAgICAgYWxsQ29sdW1uSWRzLnB1c2goY29sdW1uLmNvbElkKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZ3JpZE9wdGlvbnMuY29sdW1uQXBpLmF1dG9TaXplQ29sdW1ucyhhbGxDb2x1bW5JZHMpO1xyXG5cclxuICAgIGxldCBncmlkID0gdGhpcy5ncmlkT3B0aW9ucy5hcGlcclxuICAgIGxldCBhdmFpbGFibGVXaWR0aCA9IGdyaWQuZ3JpZFBhbmVsLmVCb2R5Vmlld3BvcnQuY2xpZW50V2lkdGg7XHJcblxyXG4gICAgbGV0IHVzZWRXaWR0aCA9IGdyaWQuZ3JpZFBhbmVsLmNvbHVtbkNvbnRyb2xsZXIuZ2V0V2lkdGhPZkNvbHNJbkxpc3QoY29sdW1ucyk7XHJcblxyXG4gICAgaWYgKHVzZWRXaWR0aCA8IGF2YWlsYWJsZVdpZHRoKSB7XHJcbiAgICAgIGdyaWQuc2l6ZUNvbHVtbnNUb0ZpdCgpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGFkZEl0ZW1zKG5ld0l0ZW1zOiBhbnlbXSk6IHZvaWQge1xyXG4gICAgY29uc29sZS5sb2cobmV3SXRlbXMpO1xyXG4gICAgbGV0IGl0ZW1zVG9BZGQ6IEFycmF5PGFueT4gPSBbXTtcclxuXHJcbiAgICBuZXdJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cclxuICAgICAgaWYgKGl0ZW0uaWQgPT0gdW5kZWZpbmVkIHx8ICh0aGlzLnJvd0RhdGEuZmluZChlbGVtZW50ID0+IGVsZW1lbnQuaWQgPT09IGl0ZW0uaWQpKSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0dXNDb2x1bW4pIHtcclxuICAgICAgICAgIGl0ZW0uc3RhdHVzID0gJ3BlbmRpbmdDcmVhdGlvbidcclxuICAgICAgICB9XHJcbiAgICAgICAgaXRlbXNUb0FkZC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIHRoaXMucm93RGF0YS5wdXNoKGl0ZW0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBJdGVtIHdpdGggdGhlIElEICR7aXRlbS5pZH0gYWxyZWFkeSBleGlzdHNgKVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHRoaXMuZ3JpZEFwaS51cGRhdGVSb3dEYXRhKHsgYWRkOiBpdGVtc1RvQWRkIH0pO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKHRoaXMuY29sdW1uRGVmcyk7XHJcbiAgICAvLyBwYXJhbXMub2xkVmFsdWUhPXVuZGVmaW5lZFxyXG4gIH1cclxuXHJcblxyXG4gIGNoYW5nZUhlaWdodCh2YWx1ZSkge1xyXG4gICAgbGV0IHBpeGVscyA9IFwiXCI7XHJcbiAgICBpZiAodmFsdWUgPT09ICc1Jykge1xyXG4gICAgICBwaXhlbHMgPSBcIjIwMHB4XCJcclxuICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICcxMCcpIHtcclxuICAgICAgcGl4ZWxzID0gXCIzMTVweFwiXHJcbiAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnMjAnKSB7XHJcbiAgICAgIHBpeGVscyA9IFwiNjMwcHhcIlxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcGl4ZWxzID0gXCIxNTUwcHhcIlxyXG4gICAgfVxyXG4gICAgdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gcGl4ZWxzO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlRGF0YSgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKTtcclxuICAgIGNvbnN0IHNlbGVjdGVkRGF0YSA9IHNlbGVjdGVkTm9kZXMubWFwKG5vZGUgPT4gbm9kZS5kYXRhKTtcclxuICAgIHRoaXMucmVtb3ZlLmVtaXQoc2VsZWN0ZWREYXRhKTtcclxuXHJcbiAgICBpZiAodGhpcy5zdGF0dXNDb2x1bW4pIHtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRSb3dzID0gc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiBub2RlLmlkKTtcclxuICAgICAgaWYoc2VsZWN0ZWRSb3dzLmxlbmd0aD4wKSB7dGhpcy5zb21lU3RhdHVzSGFzQ2hhbmdlZFRvRGVsZXRlPXRydWU7fVxyXG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIHNlbGVjdGVkUm93cykge1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS5nZXRSb3dOb2RlKGlkKS5kYXRhLnN0YXR1cyA9ICdwZW5kaW5nRGVsZXRlJztcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmdyaWRPcHRpb25zLmFwaS5yZWZyZXNoQ2VsbHMoKTtcclxuICAgIH1cclxuICAgIHRoaXMuZ3JpZE9wdGlvbnMuYXBpLmRlc2VsZWN0QWxsKCk7XHJcbiAgfVxyXG5cclxuICBuZXdEYXRhKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIHRoaXMubmV3LmVtaXQoLTEpO1xyXG4gIH1cclxuXHJcbiAgb25BZGRCdXR0b25DbGlja2VkKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIHRoaXMuYWRkLmVtaXQoLTEpO1xyXG4gIH1cclxuXHJcbiAgb25EdXBsaWNhdGVCdXR0b25DbGlja2VkKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuY2hhbmdlQ291bnRlcik7XHJcbiAgICBpZiAodGhpcy5jaGFuZ2VDb3VudGVyID4gMCkge1xyXG4gICAgICBjb25zdCBkaWFsb2dSZWYgPSB0aGlzLmRpYWxvZy5vcGVuKERpYWxvZ01lc3NhZ2VDb21wb25lbnQpO1xyXG4gICAgICBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UudGl0bGUgPSB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KCdjYXV0aW9uJylcclxuICAgICAgZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLm1lc3NhZ2UgPSB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KCdkdXBsaWNhdGVNZXNzYWdlJylcclxuICAgICAgZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgaWYgKHJlc3VsdC5ldmVudCA9PT0gJ0FjY2VwdCcpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IHRoaXMuZ3JpZEFwaS5nZXRTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkRGF0YSA9IHNlbGVjdGVkTm9kZXMubWFwKG5vZGUgPT4gbm9kZS5kYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5kdXBsaWNhdGUuZW1pdChzZWxlY3RlZERhdGEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSB0aGlzLmdyaWRBcGkuZ2V0U2VsZWN0ZWROb2RlcygpO1xyXG4gICAgICBjb25zdCBzZWxlY3RlZERhdGEgPSBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IG5vZGUuZGF0YSk7XHJcbiAgICAgIHRoaXMuZHVwbGljYXRlLmVtaXQoc2VsZWN0ZWREYXRhKTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBhcHBseUNoYW5nZXMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBpdGVtc0NoYW5nZWQ6IGFueVtdID0gW107XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgZm9yIChjb25zdCBrZXkgb2YgdGhpcy5jaGFuZ2VzTWFwLmtleXMoKSkge1xyXG4gICAgICBpdGVtc0NoYW5nZWQucHVzaCh0aGlzLmdyaWRBcGkuZ2V0Um93Tm9kZShrZXkpLmRhdGEpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zZW5kQ2hhbmdlcy5lbWl0KGl0ZW1zQ2hhbmdlZCk7XHJcbiAgICB0aGlzLmNoYW5nZXNNYXAuY2xlYXIoKTtcclxuICAgIHRoaXMuY2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuICAgIHRoaXMuc29tZVN0YXR1c0hhc0NoYW5nZWRUb0RlbGV0ZT1mYWxzZTtcclxuICAgIHRoaXMucGFyYW1zLmNvbERlZi5jZWxsU3R5bGUgPSB7IGJhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnIH07XHJcbiAgICB0aGlzLmdyaWRBcGkucmVkcmF3Um93cygpO1xyXG4gIH1cclxuXHJcblxyXG5cclxuICBkZWxldGVDaGFuZ2VzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuXHJcbiAgICB3aGlsZSAodGhpcy5jaGFuZ2VDb3VudGVyID4gMCkge1xyXG4gICAgICB0aGlzLnVuZG8oKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNoYW5nZXNNYXAuY2xlYXIoKTtcclxuICAgIC8vdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5yZWRvQ291bnRlciA9IDA7XHJcblxyXG4gICAgaWYodGhpcy5zdGF0dXNDb2x1bW4pXHJcbiAgICB7XHJcbiAgICAgIHRoaXMuZ3JpZEFwaS5mb3JFYWNoTm9kZShmdW5jdGlvbihub2RlKSB7IFxyXG4gICAgICAgIGlmKG5vZGUuZGF0YS5zdGF0dXMgPT09ICdwZW5kaW5nTW9kaWZ5JyB8fCBub2RlLmRhdGEuc3RhdHVzID09PSAncGVuZGluZ0RlbGV0ZScpIHtub2RlLmRhdGEuc3RhdHVzPScnfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKG5vZGUpXHJcbiAgICB9KTtcclxuICAgIHRoaXMuZ3JpZEFwaS5yZWZyZXNoQ2VsbHMoKTtcclxuICAgIHRoaXMuc29tZVN0YXR1c0hhc0NoYW5nZWRUb0RlbGV0ZT1mYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvL3RoaXMucGFyYW1zLmNvbERlZi5jZWxsU3R5bGUgPSAge2JhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnfTtcclxuICAgIC8vdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3MoKTtcclxuICB9XHJcblxyXG5cclxuICBvbkZpbHRlck1vZGlmaWVkKCk6IHZvaWQge1xyXG4gICAgdGhpcy5kZWxldGVDaGFuZ2VzKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgdW5kbygpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICB0aGlzLmdyaWRBcGkudW5kb0NlbGxFZGl0aW5nKCk7XHJcbiAgICB0aGlzLmNoYW5nZUNvdW50ZXIgLT0gMTtcclxuICAgIHRoaXMucmVkb0NvdW50ZXIgKz0gMTtcclxuICB9XHJcblxyXG4gIHJlZG8oKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgdGhpcy5ncmlkQXBpLnJlZG9DZWxsRWRpdGluZygpO1xyXG4gICAgdGhpcy5jaGFuZ2VDb3VudGVyICs9IDE7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyIC09IDE7XHJcbiAgfVxyXG5cclxuXHJcbiAgb25DZWxsRWRpdGluZ1N0b3BwZWQoZSkge1xyXG4gICAgaWYgKHRoaXMubW9kaWZpY2F0aW9uQ2hhbmdlKSB7XHJcbiAgICAgIHRoaXMuY2hhbmdlQ291bnRlcisrO1xyXG4gICAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuICAgICAgdGhpcy5vbkNlbGxWYWx1ZUNoYW5nZWQoZSk7XHJcbiAgICAgIHRoaXMubW9kaWZpY2F0aW9uQ2hhbmdlID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgb25DZWxsVmFsdWVDaGFuZ2VkKHBhcmFtcyk6IHZvaWQge1xyXG4gICAgY29uc29sZS5sb2coXCJ2YWx1ZSBDaGFuZ2VcIilcclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgaWYgKHRoaXMuY2hhbmdlQ291bnRlciA+IHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyKVxyXG4gICAgLy8gVHJ1ZSBpZiB3ZSBoYXZlIGVkaXRlZCBzb21lIGNlbGwgb3Igd2UgaGF2ZSBkb25lIGEgcmVkbyBcclxuICAgIHtcclxuXHJcbiAgICAgIGlmIChwYXJhbXMub2xkVmFsdWUgIT09IHBhcmFtcy52YWx1ZSAmJiAhKHBhcmFtcy5vbGRWYWx1ZSA9PSBudWxsICYmIHBhcmFtcy52YWx1ZSA9PT0gJycpKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5jaGFuZ2VzTWFwLmhhcyhwYXJhbXMubm9kZS5pZCkpIC8vIElmIGl0J3MgZmlydHMgZWRpdCBvZiBhIGNlbGwsIHdlIGFkZCBpdCB0byB0aGUgbWFwIGFuZCB3ZSBwYWludCBpdFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGNvbnN0IGFkZE1hcDogTWFwPHN0cmluZywgbnVtYmVyPiA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XHJcbiAgICAgICAgICBhZGRNYXAuc2V0KHBhcmFtcy5jb2xEZWYuZmllbGQsIDEpXHJcbiAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuc2V0KHBhcmFtcy5ub2RlLmlkLCBhZGRNYXApO1xyXG4gICAgICAgICAgaWYgKHRoaXMuc3RhdHVzQ29sdW1uKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdyaWRBcGkuZ2V0Um93Tm9kZShwYXJhbXMubm9kZS5pZCkuZGF0YS5zdGF0dXMgIT09ICdwZW5kaW5nQ3JlYXRpb24nKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5ncmlkQXBpLmdldFJvd05vZGUocGFyYW1zLm5vZGUuaWQpLmRhdGEuc3RhdHVzID0gJ3BlbmRpbmdNb2RpZnknXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmhhcyhwYXJhbXMuY29sRGVmLmZpZWxkKSkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuc2V0KHBhcmFtcy5jb2xEZWYuZmllbGQsIDEpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBXZSBhbHJlYWR5IGhhZCBlZGl0ZWQgdGhpcyBjZWxsLCBzbyB3ZSBvbmx5IGluY3JlbWVudCBudW1iZXIgb2YgY2hhbmdlcyBvZiBpdCBvbiB0aGUgbWFwIFxyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2hhbmdlcyA9IHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmdldChwYXJhbXMuY29sRGVmLmZpZWxkKTtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuc2V0KHBhcmFtcy5jb2xEZWYuZmllbGQsIChjdXJyZW50Q2hhbmdlcyArIDEpKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGFpbnRDZWxscyhwYXJhbXMsIHRoaXMuY2hhbmdlc01hcCk7IC8vV2UgcGFpbnQgdGhlIHJvdyBvZiB0aGUgZWRpdGVkIGNlbGwgXHJcbiAgICAgICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIrKzsgLy9XZSBtYXRjaCB0aGUgY3VycmVudCBwcmV2aW91c0NoYW5nZUNvdW50ZXIgd2l0aCBjaGFuZ2VDb3VudGVyXHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0aGlzLmNoYW5nZUNvdW50ZXIgPCB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlcikgeyAvLyBUcnVlIGlmIHdlIGhhdmUgZG9uZSBhbiB1bmRvXHJcbiAgICAgIGxldCBjdXJyZW50Q2hhbmdlcyA9IC0xO1xyXG4gICAgICBpZiAodGhpcy5jaGFuZ2VzTWFwLmhhcyhwYXJhbXMubm9kZS5pZCkpIHsgY3VycmVudENoYW5nZXMgPSB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5nZXQocGFyYW1zLmNvbERlZi5maWVsZCk7IH1cclxuXHJcbiAgICAgIGlmIChjdXJyZW50Q2hhbmdlcyA9PT0gMSkgeyAvL09uY2UgdGhlIHVuZG8gaXQncyBkb25lLCBjZWxsIGlzIGluIGhpcyBpbml0aWFsIHN0YXR1c1xyXG5cclxuICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5kZWxldGUocGFyYW1zLmNvbERlZi5maWVsZCk7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLnNpemUgPT09IDApIHsgLy8gTm8gbW9yZSBtb2RpZmljYXRpb25zIGluIHRoaXMgcm93XHJcbiAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZGVsZXRlKHBhcmFtcy5ub2RlLmlkKTtcclxuICAgICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuZ3JpZEFwaS5nZXREaXNwbGF5ZWRSb3dBdEluZGV4KHBhcmFtcy5yb3dJbmRleCk7XHJcbiAgICAgICAgICBpZiAodGhpcy5zdGF0dXNDb2x1bW4pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZEFwaS5nZXRSb3dOb2RlKHBhcmFtcy5ub2RlLmlkKS5kYXRhLnN0YXR1cyAhPT0gJ3BlbmRpbmdDcmVhdGlvbicpIHtcclxuICAgICAgICAgICAgICB0aGlzLmdyaWRBcGkuZ2V0Um93Tm9kZShwYXJhbXMubm9kZS5pZCkuZGF0YS5zdGF0dXMgPSAnJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgLy8gV2UgcGFpbnQgaXQgd2hpdGVcclxuICAgICAgICAgIHRoaXMuZ3JpZEFwaS5yZWRyYXdSb3dzKHsgcm93Tm9kZXM6IFtyb3ddIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnBhaW50Q2VsbHMocGFyYW1zLCB0aGlzLmNoYW5nZXNNYXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAoY3VycmVudENoYW5nZXMgPiAxKSAvLyBUaGUgY2VsbCBpc24ndCBpbiBoaXMgaW5pdGlhbCBzdGF0ZSB5ZXRcclxuICAgICAgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vV2UgY2FuJ3QgZG8gZWxzZSBiZWNhdXNlIHdlIGNhbiBiZSBkb2luZyBhbiB1bmRvIHdpdGhvdXQgY2hhbmdlcyBcclxuICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5zZXQocGFyYW1zLmNvbERlZi5maWVsZCwgKGN1cnJlbnRDaGFuZ2VzIC0gMSkpO1xyXG5cclxuICAgICAgICB0aGlzLnBhaW50Q2VsbHMocGFyYW1zLCB0aGlzLmNoYW5nZXNNYXApOy8vTm90IGluaXRpYWwgc3RhdGUgLT4gZ3JlZW4gYmFja2dyb3VuZFxyXG5cclxuICAgICAgfVxyXG4gICAgICB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlci0tOyAgLy9XZSBkZWNyZW1lbnQgcHJldmlvdXNDaGFuZ2VDb3VudGVyIGJlY2F1c2Ugd2UgaGF2ZSBkb25lIHVuZG9cclxuICAgIH1cclxuICAgIGVsc2UgeyAvLyBDb250cm9sIG9mIG1vZGlmaWNhdGlvbnMgd2l0aG91dCBjaGFuZ2VzXHJcbiAgICAgIGlmICghKHBhcmFtcy5vbGRWYWx1ZSA9PSBudWxsICYmIHBhcmFtcy52YWx1ZSA9PT0gJycpKSB7XHJcbiAgICAgICAgbGV0IG5ld1ZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgaWYgKHBhcmFtcy52YWx1ZSA9PSBudWxsKSB7IG5ld1ZhbHVlID0gJycgfVxyXG4gICAgICAgIGVsc2UgeyBuZXdWYWx1ZSA9IHBhcmFtcy52YWx1ZS50b1N0cmluZygpIH1cclxuXHJcbiAgICAgICAgaWYgKChwYXJhbXMub2xkVmFsdWUgIT0gdW5kZWZpbmVkICYmIHBhcmFtcy5vbGRWYWx1ZSAhPSBudWxsICYmIHBhcmFtcy5vbGRWYWx1ZS50b1N0cmluZygpICE9PSBuZXdWYWx1ZS50b1N0cmluZygpKVxyXG4gICAgICAgICAgfHwgKChwYXJhbXMub2xkVmFsdWUgPT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5vbGRWYWx1ZSA9PSBudWxsKSAmJiBuZXdWYWx1ZSAhPSBudWxsKSkge1xyXG5cclxuICAgICAgICAgIHRoaXMubW9kaWZpY2F0aW9uQ2hhbmdlID0gdHJ1ZTtcclxuICAgICAgICAgIGlmIChwYXJhbXMuY29sRGVmLmNlbGxSZW5kZXJlciA9PSBcImJ0bkNoZWNrYm94UmVuZGVyZXJDb21wb25lbnRcIikge1xyXG4gICAgICAgICAgICB2YXIgdW5kb1JlZG9BY3Rpb25zID0ge1xyXG4gICAgICAgICAgICAgIGNlbGxWYWx1ZUNoYW5nZXM6IHRoaXMuZ3JpZEFwaS51bmRvUmVkb1NlcnZpY2UuY2VsbFZhbHVlQ2hhbmdlc1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLmdyaWRBcGkudW5kb1JlZG9TZXJ2aWNlLnB1c2hBY3Rpb25zVG9VbmRvU3RhY2sodW5kb1JlZG9BY3Rpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5ncmlkQXBpLnVuZG9SZWRvU2VydmljZS5pc0ZpbGxpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5vbkNlbGxFZGl0aW5nU3RvcHBlZChwYXJhbXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgdGhpcy5tb2RpZmljYXRpb25XaXRob3V0Q2hhbmdlcyhwYXJhbXMpIH1cclxuXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7IHRoaXMubW9kaWZpY2F0aW9uV2l0aG91dENoYW5nZXMocGFyYW1zKSB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBtb2RpZmljYXRpb25XaXRob3V0Q2hhbmdlcyhwYXJhbXM6IGFueSkge1xyXG5cclxuICAgIGlmICh0aGlzLmNoYW5nZXNNYXAuaGFzKHBhcmFtcy5ub2RlLmlkKSkgLy9Nb2RpZmljYXRpb24gd2l0aG91dCBjaGFuZ2VzIGluIGVuIGVkaXRlZCBjZWxsXHJcbiAgICB7XHJcbiAgICAgIGlmICghdGhpcy51bmRvTm9DaGFuZ2VzKSB7XHJcbiAgICAgICAgdGhpcy5ncmlkQXBpLnVuZG9DZWxsRWRpdGluZygpOyAvLyBVbmRvIHRvIGRlbGV0ZSB0aGUgY2hhbmdlIHdpdGhvdXQgY2hhbmdlcyBpbnRlcm5hbGx5IFxyXG4gICAgICAgIHRoaXMudW5kb05vQ2hhbmdlcyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5wYWludENlbGxzKHBhcmFtcywgdGhpcy5jaGFuZ2VzTWFwKTsgIC8vVGhlIGNlbGwgaGFzIG1vZGlmaWNhdGlvbnMgeWV0IC0+IGdyZWVuIGJhY2tncm91bmQgXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7IHRoaXMudW5kb05vQ2hhbmdlcyA9IGZhbHNlOyB9XHJcblxyXG5cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAvL1dpdGggdGhlIGludGVybmFsbHkgdW5kbyB3aWxsIGVudGVyIGF0IHRoaXMgZnVuY3Rpb24sIHNvIHdlIGhhdmUgdG8gY29udHJvbCB3aGVuIGRvbmUgdGhlIHVuZG8gb3Igbm90IFxyXG4gICAgICBpZiAoIXRoaXMudW5kb05vQ2hhbmdlcykge1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS51bmRvQ2VsbEVkaXRpbmcoKTsgLy8gVW5kbyB0byBkZWxldGUgdGhlIGNoYW5nZSBpbnRlcm5hbGx5XHJcbiAgICAgICAgdGhpcy51bmRvTm9DaGFuZ2VzID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHsgdGhpcy51bmRvTm9DaGFuZ2VzID0gZmFsc2U7IH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBnZXRDb2x1bW5JbmRleEJ5Q29sSWQoYXBpOiBDb2x1bW5BcGksIGNvbElkOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIGFwaS5nZXRBbGxDb2x1bW5zKCkuZmluZEluZGV4KGNvbCA9PiBjb2wuZ2V0Q29sSWQoKSA9PT0gY29sSWQpO1xyXG4gIH1cclxuICBwYWludENlbGxzKHBhcmFtczogYW55LCBjaGFuZ2VzTWFwOiBNYXA8bnVtYmVyLCBNYXA8c3RyaW5nLCBudW1iZXI+PiwpIHtcclxuICAgIGNvbnN0IHJvdyA9IHRoaXMuZ3JpZEFwaS5nZXREaXNwbGF5ZWRSb3dBdEluZGV4KHBhcmFtcy5yb3dJbmRleCk7XHJcblxyXG4gICAgdGhpcy5jaGFuZ2VDZWxsU3R5bGVDb2x1bW5zKHBhcmFtcywgY2hhbmdlc01hcCwgJyNFOEYxREUnKTtcclxuICAgIHRoaXMuZ3JpZEFwaS5yZWRyYXdSb3dzKHsgcm93Tm9kZXM6IFtyb3ddIH0pO1xyXG4gICAgdGhpcy5jaGFuZ2VDZWxsU3R5bGVDb2x1bW5zKHBhcmFtcywgY2hhbmdlc01hcCwgJyNGRkZGRkYnKTtcclxuICAgIC8vIFdlIHdpbGwgZGVmaW5lIGNlbGxTdHlsZSB3aGl0ZSB0byBmdXR1cmUgbW9kaWZpY2F0aW9ucyAobGlrZSBmaWx0ZXIpXHJcbiAgfVxyXG5cclxuICBjaGFuZ2VDZWxsU3R5bGVDb2x1bW5zKHBhcmFtczogYW55LCBjaGFuZ2VzTWFwOiBNYXA8bnVtYmVyLCBNYXA8c3RyaW5nLCBudW1iZXI+PiwgY29sb3I6IHN0cmluZykge1xyXG5cclxuICAgIGZvciAoY29uc3Qga2V5IG9mIGNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5rZXlzKCkpIHtcclxuICAgICAgY29uc3QgY29sdW1uTnVtYmVyID0gdGhpcy5nZXRDb2x1bW5JbmRleEJ5Q29sSWQodGhpcy5ncmlkQ29sdW1uQXBpLCBrZXkpO1xyXG4gICAgICB0aGlzLmdyaWRDb2x1bW5BcGkuY29sdW1uQ29udHJvbGxlci5ncmlkQ29sdW1uc1tjb2x1bW5OdW1iZXJdLmNvbERlZi5jZWxsU3R5bGUgPSB7IGJhY2tncm91bmRDb2xvcjogY29sb3IgfTtcclxuICAgIH1cclxuXHJcblxyXG4gIH1cclxuXHJcbn1cclxuIl19