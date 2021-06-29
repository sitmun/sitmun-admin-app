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
        this.someColumnIsEditable = false;
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
        this.components = {
            datePicker: this.getDatePicker()
        };
        this.remove = new EventEmitter();
        this.new = new EventEmitter();
        this.add = new EventEmitter();
        this.discardChanges = new EventEmitter();
        this.sendChanges = new EventEmitter();
        this.getSelectedRows = new EventEmitter();
        this.duplicate = new EventEmitter();
        this.getAllRows = new EventEmitter();
        this.gridModified = new EventEmitter();
        this.changeCounter = 0;
        this.previousChangeCounter = 0;
        this.redoCounter = 0;
        this.gridOptions = {
            defaultColDef: {
                sortable: true,
                flex: 1,
                filter: true,
                editable: !this.nonEditable,
                suppressMenu: true,
                resizable: true,
                cellStyle: (params) => {
                    if (params.value && params.colDef.editable) {
                        if (this.changesMap.has(params.node.id) && this.changesMap.get(params.node.id).has(params.colDef.field)) {
                            return { 'background-color': '#E8F1DE' };
                        }
                        else {
                            return { 'background-color': 'white' };
                        }
                    }
                    else {
                        return { 'background-color': 'white' };
                    }
                },
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
        if (this.eventModifyStatusOfSelectedCells) {
            this._eventModifyStatusOfSelectedCells = this.eventModifyStatusOfSelectedCells.subscribe((status) => {
                this.modifyStatusSelected(status);
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
        for (const col of this.columnDefs) {
            if (!this.someColumnIsEditable && col.editable) {
                this.someColumnIsEditable = true;
            }
            if (col.field === 'status') {
                this.statusColumn = true;
            }
        }
        this.getElements();
        console.log(this.columnDefs);
        if (this.defaultColumnSorting) {
            if (!Array.isArray(this.defaultColumnSorting)) {
                /** @type {?} */
                const sortModel = [
                    { colId: this.defaultColumnSorting, sort: 'asc' }
                ];
                this.gridApi.setSortModel(sortModel);
            }
            else {
                /** @type {?} */
                let sortModel = [];
                this.defaultColumnSorting.forEach(element => {
                    sortModel.push({ colId: element, sort: 'asc' });
                });
                this.gridApi.setSortModel(sortModel);
            }
        }
        if (this.defaultHeight != null && this.defaultHeight != undefined) {
            this.changeHeight(this.defaultHeight);
        }
    }
    /**
     * @return {?}
     */
    getDatePicker() {
        /**
         * @return {?}
         */
        function Datepicker() { }
        Datepicker.prototype.init = function (params) {
            this.eInput = document.createElement('input');
            this.eInput.value = params.value;
            this.eInput.classList.add('ag-input');
            this.eInput.style.height = '100%';
            $(this.eInput).datepicker({ dateFormat: 'mm/dd/yy' });
        };
        Datepicker.prototype.getGui = function () {
            return this.eInput;
        };
        Datepicker.prototype.afterGuiAttached = function () {
            this.eInput.focus();
            this.eInput.select();
        };
        Datepicker.prototype.getValue = function () {
            return this.eInput.value;
        };
        Datepicker.prototype.destroy = function () { };
        Datepicker.prototype.isPopup = function () {
            return false;
        };
        return Datepicker;
    }
    /**
     * @return {?}
     */
    areRowsSelected() {
        return (this.gridApi != null && this.gridApi.getSelectedNodes().length > 0) ? true : false;
        // if (this.gridApi != null && this.gridApi.getSelectedNodes().length > 0) {
        //   return true
        // } else {
        //   return false
        // }
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
     * @param {?=} status
     * @return {?}
     */
    modifyStatusSelected(status) {
        /** @type {?} */
        let newStatus = status ? status : this.newStatusRegister;
        /** @type {?} */
        const selectedNodes = this.gridApi.getSelectedNodes();
        selectedNodes.map(node => {
            node.data.status = newStatus;
            node.selected = false;
        });
        this.gridApi.redrawRows();
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
            if (this.statusColumn) {
                /** @type {?} */
                let status = this.allNewElements ? 'pendingCreation' : 'statusOK';
                items.forEach(element => {
                    if (element.status != "notAvailable" && element.status != "pendingCreation" && element.status != "pendingRegistration" && element.status != "unregisteredLayer") {
                        element.status = status;
                    }
                    if (this.allNewElements) {
                        element.new = true;
                    }
                });
            }
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
        /** @type {?} */
        let condition = (this.addFieldRestriction) ? this.addFieldRestriction : 'id';
        newItems.forEach(item => {
            if (this.checkElementAllowedToAdd(condition, item)) {
                if (this.statusColumn) {
                    item.status = 'pendingCreation';
                    item.newItem = true;
                }
                itemsToAdd.push(item);
                this.rowData.push(item);
            }
            else {
                console.log(`Item already exists`);
            }
        });
        this.gridApi.updateRowData({ add: itemsToAdd });
        console.log(this.columnDefs);
        // params.oldValue!=undefined
    }
    /**
     * @param {?} condition
     * @param {?} item
     * @return {?}
     */
    checkElementAllowedToAdd(condition, item) {
        /** @type {?} */
        let finalAddition = true;
        if (Array.isArray(condition)) {
            for (let element of this.rowData) {
                /** @type {?} */
                let canAdd = false;
                for (let currentCondition of condition) {
                    if (element[currentCondition] != item[currentCondition]) {
                        canAdd = true;
                        break;
                    }
                }
                if (!canAdd) {
                    finalAddition = false;
                    break;
                }
            }
            return finalAddition;
        }
        else {
            return (item[condition] == undefined || (this.rowData.find(element => element[condition] == item[condition])) == undefined);
        }
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
        this.gridModified.emit(false);
        this.changesMap.clear();
        this.changeCounter = 0;
        this.previousChangeCounter = 0;
        this.redoCounter = 0;
        this.someStatusHasChangedToDelete = false;
        // this.params.colDef.cellStyle = { backgroundColor: '#FFFFFF' };
        this.gridApi.redrawRows();
    }
    /**
     * @return {?}
     */
    deleteChanges() {
        this.gridApi.stopEditing(false);
        /** @type {?} */
        let newElementsActived = this.allNewElements;
        while (this.changeCounter > 0) {
            this.undo();
        }
        this.changesMap.clear();
        //this.previousChangeCounter = 0;
        this.redoCounter = 0;
        if (this.statusColumn && !this.discardNonReverseStatus) {
            /** @type {?} */
            let rowsWithStatusModified = [];
            this.gridApi.forEachNode(function (node) {
                if (node.data.status === 'pendingModify' || node.data.status === 'pendingDelete') {
                    if (node.data.status === 'pendingDelete') {
                        rowsWithStatusModified.push(node.data);
                    }
                    if (node.data.newItem || newElementsActived) {
                        node.data.status = 'pendingCreation';
                    }
                    else {
                        node.data.status = 'statusOK';
                    }
                }
            });
            this.someStatusHasChangedToDelete = false;
            this.discardChanges.emit(rowsWithStatusModified);
            this.gridModified.emit(false);
        }
        this.gridApi.redrawRows();
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
        if (this.changeCounter == 0) {
            this.gridModified.emit(false);
        }
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
            if (this.changeCounter == 1) {
                this.gridModified.emit(true);
            }
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
                        // if (this.gridApi.getRowNode(params.node.id).data.status !== 'pendingCreation') {
                        this.gridApi.getRowNode(params.node.id).data.status = 'pendingModify';
                        // }
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
                            this.gridApi.getRowNode(params.node.id).data.status = 'statusOK';
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
        // this.changeCellStyleColumns(params, changesMap, '#E8F1DE');
        this.gridApi.redrawRows({ rowNodes: [row] });
        // this.changeCellStyleColumns(params, changesMap, '#FFFFFF');
        // We will define cellStyle white to future modifications (like filter)
    }
}
DataGridComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-data-grid',
                template: "<div id=grup1 class=\"editDivBtns\">\r\n    <span *ngIf=\"title\" [translate]=\"title\"> </span>\r\n    <button type=\"button\" title=\"{{ 'cancel' | translate }}\" mat-mini-fab class=\"mini-fab mat-red\" *ngIf=\"discardChangesButton\"\r\n        id=\"deleteChangesButton\" type=\"button\" (click)=\"deleteChanges()\" [disabled]=\"changeCounter <= 0 && (!someStatusHasChangedToDelete || discardNonReverseStatus  )\">\r\n        <mat-icon fontSet=\"material-icons-round\"> close </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'undo' | translate }}\" mat-mini-fab class=\"mini-fab mat-orange\" *ngIf=\"undoButton && someColumnIsEditable\"\r\n        id=\"undo\" (click)=\"undo()\" [disabled]=\"changeCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> undo </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'redo' | translate }}\" mat-mini-fab class=\"mini-fab mat-orange\" *ngIf=\"redoButton && someColumnIsEditable\"\r\n        id=\"redo\" (click)=\"redo()\" [disabled]=\"redoCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> redo </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'accept' | translate }}\" mat-mini-fab class=\"mini-fab mat-green\"\r\n        *ngIf=\"applyChangesButton\" id=\"applyChangesButton\" (click)=\"applyChanges()\" [disabled]=\"changeCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> check </mat-icon>\r\n    </button>\r\n</div>\r\n\r\n<div id=grup2 class=\"actionsDivBtns\">\r\n    <label *ngIf=\"globalSearch\" [translate]=\"'search'\"> </label>\r\n    <input *ngIf=\"globalSearch\" type=\"text\" class=\"searchGenericInput\" placeholder=\"\" (keyup)=\"quickSearch()\"\r\n        [(ngModel)]=\"searchValue\" ml-2>\r\n    <label *ngIf=\"changeHeightButton\" [translate]=\"'rowsToShow'\"> </label>\r\n    <mat-button-toggle-group *ngIf=\"changeHeightButton\" class=\"toogleButton\" name=\"fontStyle\" aria-label=\"Font Style\"  value=\"5\">\r\n        <mat-button-toggle value=\"5\" (change)=\"changeHeight($event.value)\">5</mat-button-toggle>\r\n        <mat-button-toggle value=\"20\" (change)=\"changeHeight($event.value)\">20</mat-button-toggle>\r\n        <mat-button-toggle value=\"50\" (change)=\"changeHeight($event.value)\">50</mat-button-toggle>\r\n    </mat-button-toggle-group>\r\n\r\n    <button type=\"button\" *ngIf=\"deleteButton\" mat-flat-button id=\"deleteButton\" class=\"deleteButton\"\r\n        (click)=\"removeData()\" [disabled]=\"!areRowsSelected()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> delete </mat-icon>\r\n        <span [translate]=\"'remove'\"> </span>\r\n\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"actionButton\" mat-flat-button [matMenuTriggerFor]=\"menu\" id=\"actionButton\"\r\n        class=\"actionButton\">\r\n        <span [translate]=\"'actions'\"> </span>\r\n        <mat-icon fontSet=\"material-icons-round\"> keyboard_arrow_down </mat-icon>\r\n    </button>\r\n    <mat-menu #menu=\"matMenu\">\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideExportButton\" [disabled]=\"!areRowsSelected()\" (click)=\"exportData()\"> {{\"export\" | translate}}\r\n        </button>\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideDuplicateButton\" [disabled]=\"!areRowsSelected()\" (click)=\"onDuplicateButtonClicked()\">\r\n            {{\"duplicate\" |\r\n            translate}}</button>\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideSearchReplaceButton && false\"> {{\"search/replace\" | translate}}</button>\r\n    </mat-menu>\r\n\r\n    <button type=\"button\" *ngIf=\"newButton\" mat-flat-button class=\"newButton\" (click)=\"newData()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'new'\"> </span>\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"addButton\" mat-flat-button class=\"newButton\" (click)=\"onAddButtonClicked()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'add'\"> </span>\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"registerButton\" mat-flat-button class=\"newButton\" (click)=\"modifyStatusSelected()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'register'\"> </span>\r\n    </button>\r\n\r\n</div>\r\n\r\n<div class=\"row\" style=\" height: 100%\">\r\n    <div id=\"myGrid\" style=\" width:100%; height: 100%\">\r\n        <ag-grid-angular style=\"width: 100%; height: 100%;min-height: 200px;\" [class]=\"themeGrid\"\r\n            [floatingFilter]=\"true\" [rowData]=\"rowData\" [columnDefs]=\"columnDefs\" [gridOptions]=\"gridOptions\"\r\n            [animateRows]=\"true\" [pagination]=\"false\" [modules]=\"modules\" [undoRedoCellEditing]=\"true\"\r\n            [undoRedoCellEditingLimit]=200 [suppressRowClickSelection]=true [frameworkComponents]=\"frameworkComponents\" [components]=\"components\"\r\n            rowSelection=\"multiple\" multiSortKey=\"key\" (filterModified)=\"onFilterModified()\"\r\n            (cellEditingStopped)=\"onCellEditingStopped($event)\" (cellValueChanged)=\"onCellValueChanged($event)\"\r\n            (gridReady)=\"onGridReady($event)\" (firstDataRendered)=\"firstDataRendered()\">\r\n        </ag-grid-angular>\r\n    </div>\r\n</div>",
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
    eventModifyStatusOfSelectedCells: [{ type: Input }],
    eventAddItemsSubscription: [{ type: Input }],
    frameworkComponents: [{ type: Input }],
    components: [{ type: Input }],
    columnDefs: [{ type: Input }],
    getAll: [{ type: Input }],
    discardChangesButton: [{ type: Input }],
    discardNonReverseStatus: [{ type: Input }],
    id: [{ type: Input }],
    undoButton: [{ type: Input }],
    defaultColumnSorting: [{ type: Input }],
    redoButton: [{ type: Input }],
    applyChangesButton: [{ type: Input }],
    deleteButton: [{ type: Input }],
    newButton: [{ type: Input }],
    actionButton: [{ type: Input }],
    addButton: [{ type: Input }],
    registerButton: [{ type: Input }],
    newStatusRegister: [{ type: Input }],
    globalSearch: [{ type: Input }],
    changeHeightButton: [{ type: Input }],
    defaultHeight: [{ type: Input }],
    themeGrid: [{ type: Input }],
    singleSelection: [{ type: Input }],
    nonEditable: [{ type: Input }],
    title: [{ type: Input }],
    hideExportButton: [{ type: Input }],
    hideDuplicateButton: [{ type: Input }],
    hideSearchReplaceButton: [{ type: Input }],
    addFieldRestriction: [{ type: Input }],
    allNewElements: [{ type: Input }],
    remove: [{ type: Output }],
    new: [{ type: Output }],
    add: [{ type: Output }],
    discardChanges: [{ type: Output }],
    sendChanges: [{ type: Output }],
    duplicate: [{ type: Output }],
    getSelectedRows: [{ type: Output }],
    getAllRows: [{ type: Output }],
    getAgGridState: [{ type: Output }],
    gridModified: [{ type: Output }]
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
    DataGridComponent.prototype._eventModifyStatusOfSelectedCells;
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
    DataGridComponent.prototype.someColumnIsEditable;
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
    DataGridComponent.prototype.eventModifyStatusOfSelectedCells;
    /** @type {?} */
    DataGridComponent.prototype.eventAddItemsSubscription;
    /** @type {?} */
    DataGridComponent.prototype.frameworkComponents;
    /** @type {?} */
    DataGridComponent.prototype.components;
    /** @type {?} */
    DataGridComponent.prototype.columnDefs;
    /** @type {?} */
    DataGridComponent.prototype.getAll;
    /** @type {?} */
    DataGridComponent.prototype.discardChangesButton;
    /** @type {?} */
    DataGridComponent.prototype.discardNonReverseStatus;
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
    DataGridComponent.prototype.registerButton;
    /** @type {?} */
    DataGridComponent.prototype.newStatusRegister;
    /** @type {?} */
    DataGridComponent.prototype.globalSearch;
    /** @type {?} */
    DataGridComponent.prototype.changeHeightButton;
    /** @type {?} */
    DataGridComponent.prototype.defaultHeight;
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
    DataGridComponent.prototype.addFieldRestriction;
    /** @type {?} */
    DataGridComponent.prototype.allNewElements;
    /** @type {?} */
    DataGridComponent.prototype.remove;
    /** @type {?} */
    DataGridComponent.prototype.new;
    /** @type {?} */
    DataGridComponent.prototype.add;
    /** @type {?} */
    DataGridComponent.prototype.discardChanges;
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
    DataGridComponent.prototype.gridModified;
    /** @type {?} */
    DataGridComponent.prototype.dialog;
    /** @type {?} */
    DataGridComponent.prototype.translate;
    /** @type {?} */
    DataGridComponent.prototype.elRef;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1ncmlkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGF0YS1ncmlkL2RhdGEtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQW9CLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVyRyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRWxDLE9BQU8sRUFBRSxtQkFBbUIsRUFBcUIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN4RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUM1RixPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUN4RyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUNsRyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDckQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFXcEYsTUFBTSxPQUFPLGlCQUFpQjs7Ozs7O0lBOEU1QixZQUFtQixNQUFpQixFQUMzQixXQUNDO1FBRlMsV0FBTSxHQUFOLE1BQU0sQ0FBVztRQUMzQixjQUFTLEdBQVQsU0FBUztRQUNSLFVBQUssR0FBTCxLQUFLO3VCQXpFSyxtQkFBbUI7UUFPdkMsb0JBQWUsS0FBSyxDQUFDO1FBQ3JCLDRCQUF1QixLQUFLLENBQUM7MEJBQ2tCLElBQUksR0FBRyxFQUErQjtRQU9yRiwwQkFBcUIsS0FBSyxDQUFDO1FBQzNCLHFCQUFnQixLQUFLLENBQUM7UUFFdEIs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Szt5QkFDTCxLQUFLO3FCQUNMLEtBQUs7bUNBQ0wsS0FBSztzQ0FDTCxLQUFLO2lCQUNMLEtBQUs7eUJBQ0wsS0FBSzttQ0FDTCxLQUFLO3lCQUNMLEtBQUs7aUNBQ0wsS0FBSzsyQkFDTCxLQUFLO3dCQUNMLEtBQUs7MkJBQ0wsS0FBSzt3QkFDTCxLQUFLOzZCQUNMLEtBQUs7Z0NBQ0wsS0FBSzsyQkFDTCxLQUFLO2lDQUNMLEtBQUs7NEJBQ0wsS0FBSzt3QkFDTCxLQUFLOzhCQUNMLEtBQUs7MEJBQ0wsS0FBSztvQkFDTCxLQUFLOytCQUNMLEtBQUs7a0NBQ0wsS0FBSztzQ0FDTCxLQUFLO2tDQUNMLEtBQUs7NkJBQ0wsS0FBSztxQkFHTCxNQUFNO2tCQUNOLE1BQU07a0JBQ04sTUFBTTs2QkFDTixNQUFNOzBCQUNOLE1BQU07d0JBQ04sTUFBTTs4QkFDTixNQUFNO3lCQUNOLE1BQU07NkJBQ04sTUFBTTsyQkFDTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWdHcmlkTW9kdWxlIH0gZnJvbSAnQGFnLWdyaWQtY29tbXVuaXR5L2FuZ3VsYXInO1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgTmdNb2R1bGUsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IEFsbENvbW11bml0eU1vZHVsZXMsIENvbHVtbkFwaSwgTW9kdWxlIH0gZnJvbSAnQGFnLWdyaWQtY29tbXVuaXR5L2FsbC1tb2R1bGVzJztcclxuaW1wb3J0IHsgVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xyXG5pbXBvcnQgeyBCdG5FZGl0UmVuZGVyZWRDb21wb25lbnQgfSBmcm9tICcuLi9idG4tZWRpdC1yZW5kZXJlZC9idG4tZWRpdC1yZW5kZXJlZC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBCdG5DaGVja2JveFJlbmRlcmVkQ29tcG9uZW50IH0gZnJvbSAnLi4vYnRuLWNoZWNrYm94LXJlbmRlcmVkL2J0bi1jaGVja2JveC1yZW5kZXJlZC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBCdG5DaGVja2JveEZpbHRlckNvbXBvbmVudCB9IGZyb20gJy4uL2J0bi1jaGVja2JveC1maWx0ZXIvYnRuLWNoZWNrYm94LWZpbHRlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNYXREaWFsb2cgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xyXG5pbXBvcnQgeyBEaWFsb2dNZXNzYWdlQ29tcG9uZW50IH0gZnJvbSAnLi4vZGlhbG9nLW1lc3NhZ2UvZGlhbG9nLW1lc3NhZ2UuY29tcG9uZW50JztcclxuaW1wb3J0IHsgZm9yRWFjaCB9IGZyb20gJ2pzemlwJztcclxuZGVjbGFyZSBsZXQgJDogYW55O1xyXG5cclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1kYXRhLWdyaWQnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9kYXRhLWdyaWQuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL2RhdGEtZ3JpZC5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEYXRhR3JpZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIF9ldmVudFJlZnJlc2hTdWJzY3JpcHRpb246IGFueTtcclxuICBfZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb246IGFueTtcclxuICBfZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgX2V2ZW50U2F2ZUFnR3JpZFN0YXRlU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgX2V2ZW50TW9kaWZ5U3RhdHVzT2ZTZWxlY3RlZENlbGxzOiBhbnk7XHJcbiAgbW9kdWxlczogTW9kdWxlW10gPSBBbGxDb21tdW5pdHlNb2R1bGVzO1xyXG5cclxuXHJcbiAgVW5kZVJlZG9BY3Rpb25zXHJcbiAgc2VhcmNoVmFsdWU6IHN0cmluZztcclxuICBncmlkQXBpOiBhbnk7XHJcbiAgZ3JpZENvbHVtbkFwaTogYW55O1xyXG4gIHN0YXR1c0NvbHVtbiA9IGZhbHNlO1xyXG4gIHNvbWVDb2x1bW5Jc0VkaXRhYmxlID0gZmFsc2U7XHJcbiAgY2hhbmdlc01hcDogTWFwPG51bWJlciwgTWFwPHN0cmluZywgbnVtYmVyPj4gPSBuZXcgTWFwPG51bWJlciwgTWFwPHN0cmluZywgbnVtYmVyPj4oKTtcclxuICAvLyBXZSB3aWxsIHNhdmUgdGhlIGlkIG9mIGVkaXRlZCBjZWxscyBhbmQgdGhlIG51bWJlciBvZiBlZGl0aW9ucyBkb25lLlxyXG4gIHBhcmFtczogYW55OyAvLyBMYXN0IHBhcmFtZXRlcnMgb2YgdGhlIGdyaWQgKGluIGNhc2Ugd2UgZG8gYXBwbHkgY2hhbmdlcyB3ZSB3aWxsIG5lZWQgaXQpIFxyXG4gIHJvd0RhdGE6IGFueVtdO1xyXG4gIGNoYW5nZUNvdW50ZXI6IG51bWJlcjsgLy8gTnVtYmVyIG9mIGVkaXRpb25zIGRvbmUgYWJvdmUgYW55IGNlbGwgXHJcbiAgcHJldmlvdXNDaGFuZ2VDb3VudGVyOiBudW1iZXI7IC8vIE51bWJlciBvZiBkaXRpb25zIGRvbmUgYWZ0ZXIgdGhlIGxhc3QgbW9kaWZpY2F0aW9uKGNoYW5nZUNvdW50ZXIpXHJcbiAgcmVkb0NvdW50ZXI6IG51bWJlcjsgLy8gTnVtYmVyIG9mIHJlZG8gd2UgY2FuIGRvXHJcbiAgbW9kaWZpY2F0aW9uQ2hhbmdlID0gZmFsc2U7XHJcbiAgdW5kb05vQ2hhbmdlcyA9IGZhbHNlOyAvLyBCb29sZWFuIHRoYXQgaW5kaWNhdGVzIGlmIGFuIHVuZG8gaGFzbid0IG1vZGlmaWNhdGlvbnNcclxuICBncmlkT3B0aW9ucztcclxuICBzb21lU3RhdHVzSGFzQ2hhbmdlZFRvRGVsZXRlID0gZmFsc2U7XHJcblxyXG5cclxuICBASW5wdXQoKSBldmVudFJlZnJlc2hTdWJzY3JpcHRpb246IE9ic2VydmFibGU8Ym9vbGVhbj47XHJcbiAgQElucHV0KCkgZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb246IE9ic2VydmFibGU8Ym9vbGVhbj47XHJcbiAgQElucHV0KCkgZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG4gIEBJbnB1dCgpIGV2ZW50U2F2ZUFnR3JpZFN0YXRlU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG4gIEBJbnB1dCgpIGV2ZW50TW9kaWZ5U3RhdHVzT2ZTZWxlY3RlZENlbGxzOiBPYnNlcnZhYmxlPHN0cmluZz47XHJcbiAgQElucHV0KCkgZXZlbnRBZGRJdGVtc1N1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZTxib29sZWFuPjtcclxuICBASW5wdXQoKSBmcmFtZXdvcmtDb21wb25lbnRzOiBhbnk7XHJcbiAgQElucHV0KCkgY29tcG9uZW50czogYW55O1xyXG4gIEBJbnB1dCgpIGNvbHVtbkRlZnM6IGFueVtdO1xyXG4gIEBJbnB1dCgpIGdldEFsbDogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+O1xyXG4gIEBJbnB1dCgpIGRpc2NhcmRDaGFuZ2VzQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGRpc2NhcmROb25SZXZlcnNlU3RhdHVzOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGlkOiBhbnk7XHJcbiAgQElucHV0KCkgdW5kb0J1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBkZWZhdWx0Q29sdW1uU29ydGluZzogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHJlZG9CdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYXBwbHlDaGFuZ2VzQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGRlbGV0ZUJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBuZXdCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYWN0aW9uQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGFkZEJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSByZWdpc3RlckJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBuZXdTdGF0dXNSZWdpc3Rlcjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGdsb2JhbFNlYXJjaDogYm9vbGVhbjtcclxuICBASW5wdXQoKSBjaGFuZ2VIZWlnaHRCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgZGVmYXVsdEhlaWdodDogYW55O1xyXG4gIEBJbnB1dCgpIHRoZW1lR3JpZDogYW55O1xyXG4gIEBJbnB1dCgpIHNpbmdsZVNlbGVjdGlvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBub25FZGl0YWJsZTogYm9vbGVhbjtcclxuICBASW5wdXQoKSB0aXRsZTogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGhpZGVFeHBvcnRCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgaGlkZUR1cGxpY2F0ZUJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBoaWRlU2VhcmNoUmVwbGFjZUJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBhZGRGaWVsZFJlc3RyaWN0aW9uOiBhbnk7XHJcbiAgQElucHV0KCkgYWxsTmV3RWxlbWVudHM6IGFueTtcclxuXHJcblxyXG4gIEBPdXRwdXQoKSByZW1vdmU6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIG5ldzogRXZlbnRFbWl0dGVyPG51bWJlcj47XHJcbiAgQE91dHB1dCgpIGFkZDogRXZlbnRFbWl0dGVyPG51bWJlcj47XHJcbiAgQE91dHB1dCgpIGRpc2NhcmRDaGFuZ2VzOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG4gIEBPdXRwdXQoKSBzZW5kQ2hhbmdlczogRXZlbnRFbWl0dGVyPGFueVtdPjtcclxuICBAT3V0cHV0KCkgZHVwbGljYXRlOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG4gIEBPdXRwdXQoKSBnZXRTZWxlY3RlZFJvd3M6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIGdldEFsbFJvd3M6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIGdldEFnR3JpZFN0YXRlOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG4gIEBPdXRwdXQoKSBncmlkTW9kaWZpZWQ6IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkaWFsb2c6IE1hdERpYWxvZyxcclxuICAgIHB1YmxpYyB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGVsUmVmOiBFbGVtZW50UmVmKSB7XHJcbiAgICB0aGlzLnRyYW5zbGF0ZSA9IHRyYW5zbGF0ZTtcclxuXHJcbiAgICB0aGlzLmZyYW1ld29ya0NvbXBvbmVudHMgPSB7XHJcbiAgICAgIGJ0bkVkaXRSZW5kZXJlckNvbXBvbmVudDogQnRuRWRpdFJlbmRlcmVkQ29tcG9uZW50LFxyXG4gICAgICBidG5DaGVja2JveFJlbmRlcmVyQ29tcG9uZW50OiBCdG5DaGVja2JveFJlbmRlcmVkQ29tcG9uZW50LFxyXG4gICAgICBidG5DaGVja2JveEZpbHRlckNvbXBvbmVudDogQnRuQ2hlY2tib3hGaWx0ZXJDb21wb25lbnRcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5jb21wb25lbnRzID0ge1xyXG4gICAgICBkYXRlUGlja2VyOiB0aGlzLmdldERhdGVQaWNrZXIoKVxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgdGhpcy5yZW1vdmUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLm5ldyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuYWRkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5kaXNjYXJkQ2hhbmdlcz0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5zZW5kQ2hhbmdlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuZ2V0U2VsZWN0ZWRSb3dzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5kdXBsaWNhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmdldEFsbFJvd3MgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmdyaWRNb2RpZmllZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuY2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuICAgIHRoaXMuZ3JpZE9wdGlvbnMgPSB7XHJcbiAgICAgIGRlZmF1bHRDb2xEZWY6IHtcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmbGV4OiAxLFxyXG4gICAgICAgIGZpbHRlcjogdHJ1ZSxcclxuICAgICAgICBlZGl0YWJsZTogIXRoaXMubm9uRWRpdGFibGUsXHJcbiAgICAgICAgc3VwcHJlc3NNZW51OiB0cnVlLFxyXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcclxuICAgICAgICBjZWxsU3R5bGU6IChwYXJhbXMpID0+IHtcclxuICAgICAgICAgIGlmKHBhcmFtcy52YWx1ZSAmJiBwYXJhbXMuY29sRGVmLmVkaXRhYmxlKXtcclxuICAgICAgICAgICAgaWYodGhpcy5jaGFuZ2VzTWFwLmhhcyhwYXJhbXMubm9kZS5pZCkgJiYgdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuaGFzKHBhcmFtcy5jb2xEZWYuZmllbGQpKXtcclxuICAgICAgICAgICAgICByZXR1cm4geydiYWNrZ3JvdW5kLWNvbG9yJzogJyNFOEYxREUnfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgIHJldHVybiB7J2JhY2tncm91bmQtY29sb3InOiAnd2hpdGUnfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7J2JhY2tncm91bmQtY29sb3InOiAnd2hpdGUnfTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9ICxcclxuICAgICAgfSxcclxuICAgICAgcm93U2VsZWN0aW9uOiAnbXVsdGlwbGUnLFxyXG4gICAgICBzaW5nbGVDbGlja0VkaXQ6IHRydWUsXHJcbiAgICAgIC8vIHN1cHByZXNzSG9yaXpvbnRhbFNjcm9sbDogdHJ1ZSxcclxuICAgICAgbG9jYWxlVGV4dEZ1bmM6IChrZXk6IHN0cmluZywgZGVmYXVsdFZhbHVlOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy50cmFuc2xhdGUuaW5zdGFudChrZXkpO1xyXG4gICAgICAgIHJldHVybiBkYXRhID09PSBrZXkgPyBkZWZhdWx0VmFsdWUgOiBkYXRhO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgfVxyXG5cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcblxyXG4gICAgaWYgKHRoaXMuZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50UmVmcmVzaFN1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5zb21lU3RhdHVzSGFzQ2hhbmdlZFRvRGVsZXRlPWZhbHNlO1xyXG4gICAgICAgIHRoaXMuY2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICAgICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMucmVkb0NvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudHMoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5ldmVudEdldFNlbGVjdGVkUm93c1N1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLl9ldmVudEdldFNlbGVjdGVkUm93c1N1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLmVtaXRTZWxlY3RlZFJvd3MoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5fZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uID0gdGhpcy5ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLmVtaXRBbGxSb3dzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmV2ZW50U2F2ZUFnR3JpZFN0YXRlU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50U2F2ZUFnR3JpZFN0YXRlU3Vic2NyaXB0aW9uID0gdGhpcy5ldmVudFNhdmVBZ0dyaWRTdGF0ZVN1YnNjcmlwdGlvbi5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2F2ZUFnR3JpZFN0YXRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmV2ZW50TW9kaWZ5U3RhdHVzT2ZTZWxlY3RlZENlbGxzKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50TW9kaWZ5U3RhdHVzT2ZTZWxlY3RlZENlbGxzID0gdGhpcy5ldmVudE1vZGlmeVN0YXR1c09mU2VsZWN0ZWRDZWxscy5zdWJzY3JpYmUoKHN0YXR1czogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgdGhpcy5tb2RpZnlTdGF0dXNTZWxlY3RlZChzdGF0dXMpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5ldmVudEFkZEl0ZW1zU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuZXZlbnRBZGRJdGVtc1N1YnNjcmlwdGlvbi5zdWJzY3JpYmUoXHJcbiAgICAgICAgKGl0ZW1zOiBhbnkpID0+IHtcclxuICAgICAgICAgIHRoaXMuYWRkSXRlbXMoaXRlbXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIGZpcnN0RGF0YVJlbmRlcmVkKCk6IHZvaWQge1xyXG4gICAgaWYgKGxvY2FsU3RvcmFnZS5hZ0dyaWRTdGF0ZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgbGV0IGFnR3JpZFN0YXRlID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuYWdHcmlkU3RhdGUpXHJcbiAgICAgIGlmIChhZ0dyaWRTdGF0ZS5pZEFnR3JpZCAhPSB1bmRlZmluZWQgJiYgYWdHcmlkU3RhdGUuaWRBZ0dyaWQgPT0gdGhpcy5pZCkge1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS5zZXRGaWx0ZXJNb2RlbChhZ0dyaWRTdGF0ZS5maWx0ZXJTdGF0ZSk7XHJcbiAgICAgICAgdGhpcy5ncmlkQ29sdW1uQXBpLnNldENvbHVtblN0YXRlKGFnR3JpZFN0YXRlLmNvbFN0YXRlKTtcclxuICAgICAgICB0aGlzLmdyaWRBcGkuc2V0U29ydE1vZGVsKGFnR3JpZFN0YXRlLnNvcnRTdGF0ZSk7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hWYWx1ZSA9IGFnR3JpZFN0YXRlLnZhbHVlU2VhcmNoR2VuZXJpYztcclxuICAgICAgICB0aGlzLnF1aWNrU2VhcmNoKCk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBZ0dyaWRTdGF0ZSgpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaWQgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBZ0dyaWRTdGF0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkdyaWRSZWFkeShwYXJhbXMpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnNpbmdsZVNlbGVjdGlvbikgeyB0aGlzLmdyaWRPcHRpb25zLnJvd1NlbGVjdGlvbiA9ICdzaW5nbGUnIH1cclxuICAgIC8vIGlmICh0aGlzLm5vbkVkaXRhYmxlKSB7dGhpcy5ncmlkT3B0aW9ucy5kZWZhdWx0Q29sRGVmLmVkaXRhYmxlID0gZmFsc2V9XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgIHRoaXMuZ3JpZEFwaSA9IHBhcmFtcy5hcGk7XHJcbiAgICB0aGlzLmdyaWRDb2x1bW5BcGkgPSBwYXJhbXMuY29sdW1uQXBpO1xyXG4gICAgZm9yIChjb25zdCBjb2wgb2YgdGhpcy5jb2x1bW5EZWZzKSB7XHJcbiAgICAgIGlmKCF0aGlzLnNvbWVDb2x1bW5Jc0VkaXRhYmxlICYmIGNvbC5lZGl0YWJsZSkgeyB0aGlzLnNvbWVDb2x1bW5Jc0VkaXRhYmxlID0gdHJ1ZX1cclxuICAgICAgaWYgKGNvbC5maWVsZCA9PT0gJ3N0YXR1cycpIHtcclxuICAgICAgICB0aGlzLnN0YXR1c0NvbHVtbiA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuZ2V0RWxlbWVudHMoKTtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuY29sdW1uRGVmcyk7XHJcbiAgICBpZiAodGhpcy5kZWZhdWx0Q29sdW1uU29ydGluZykge1xyXG4gICAgICBpZighQXJyYXkuaXNBcnJheSh0aGlzLmRlZmF1bHRDb2x1bW5Tb3J0aW5nKSlcclxuICAgICAge1xyXG4gICAgICAgIGNvbnN0IHNvcnRNb2RlbCA9IFtcclxuICAgICAgICAgIHsgY29sSWQ6IHRoaXMuZGVmYXVsdENvbHVtblNvcnRpbmcsIHNvcnQ6ICdhc2MnIH1cclxuICAgICAgICBdO1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS5zZXRTb3J0TW9kZWwoc29ydE1vZGVsKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNle1xyXG4gICAgICAgIGxldCBzb3J0TW9kZWwgPSBbXTtcclxuICAgICAgICB0aGlzLmRlZmF1bHRDb2x1bW5Tb3J0aW5nLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICBzb3J0TW9kZWwucHVzaCh7IGNvbElkOiBlbGVtZW50LCBzb3J0OiAnYXNjJyB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS5zZXRTb3J0TW9kZWwoc29ydE1vZGVsKTtcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIGlmKHRoaXMuZGVmYXVsdEhlaWdodCAhPSBudWxsICYmIHRoaXMuZGVmYXVsdEhlaWdodCAhPSB1bmRlZmluZWQpe1xyXG4gICAgICB0aGlzLmNoYW5nZUhlaWdodCh0aGlzLmRlZmF1bHRIZWlnaHQpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgZ2V0RGF0ZVBpY2tlcigpIHtcclxuICAgIGZ1bmN0aW9uIERhdGVwaWNrZXIoKSB7fVxyXG4gICAgRGF0ZXBpY2tlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgdGhpcy5lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICB0aGlzLmVJbnB1dC52YWx1ZSA9IHBhcmFtcy52YWx1ZTtcclxuICAgICAgdGhpcy5lSW5wdXQuY2xhc3NMaXN0LmFkZCgnYWctaW5wdXQnKTtcclxuICAgICAgdGhpcy5lSW5wdXQuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xyXG4gICAgICAkKHRoaXMuZUlucHV0KS5kYXRlcGlja2VyKHsgZGF0ZUZvcm1hdDogJ21tL2RkL3l5JyB9KTtcclxuICAgIH07XHJcbiAgICBEYXRlcGlja2VyLnByb3RvdHlwZS5nZXRHdWkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmVJbnB1dDtcclxuICAgIH07XHJcbiAgICBEYXRlcGlja2VyLnByb3RvdHlwZS5hZnRlckd1aUF0dGFjaGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLmVJbnB1dC5mb2N1cygpO1xyXG4gICAgICB0aGlzLmVJbnB1dC5zZWxlY3QoKTtcclxuICAgIH07XHJcbiAgICBEYXRlcGlja2VyLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZUlucHV0LnZhbHVlO1xyXG4gICAgfTtcclxuICAgIERhdGVwaWNrZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7fTtcclxuICAgIERhdGVwaWNrZXIucHJvdG90eXBlLmlzUG9wdXAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gRGF0ZXBpY2tlcjtcclxuICB9XHJcblxyXG4gIGFyZVJvd3NTZWxlY3RlZCgpOiBCb29sZWFuIHtcclxuICAgIHJldHVybiAodGhpcy5ncmlkQXBpICE9IG51bGwgJiYgdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKS5sZW5ndGggPiAwKT8gdHJ1ZTogZmFsc2U7XHJcbiAgICAvLyBpZiAodGhpcy5ncmlkQXBpICE9IG51bGwgJiYgdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKS5sZW5ndGggPiAwKSB7XHJcbiAgICAvLyAgIHJldHVybiB0cnVlXHJcbiAgICAvLyB9IGVsc2Uge1xyXG4gICAgLy8gICByZXR1cm4gZmFsc2VcclxuICAgIC8vIH1cclxuICB9XHJcblxyXG5cclxuICBlbWl0U2VsZWN0ZWRSb3dzKCk6IHZvaWQge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IHRoaXMuZ3JpZEFwaS5nZXRTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICBjb25zdCBzZWxlY3RlZERhdGEgPSBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IG5vZGUuZGF0YSk7XHJcbiAgICB0aGlzLmdldFNlbGVjdGVkUm93cy5lbWl0KHNlbGVjdGVkRGF0YSk7XHJcbiAgfVxyXG5cclxuICBlbWl0QWxsUm93cygpOiB2b2lkIHtcclxuICAgIGxldCByb3dEYXRhID0gW107XHJcbiAgICB0aGlzLmdyaWRBcGkuZm9yRWFjaE5vZGUobm9kZSA9PiByb3dEYXRhLnB1c2gobm9kZS5kYXRhKSk7XHJcbiAgICB0aGlzLmdldEFsbFJvd3MuZW1pdChyb3dEYXRhKTtcclxuICB9XHJcblxyXG4gIG1vZGlmeVN0YXR1c1NlbGVjdGVkKHN0YXR1cz86IHN0cmluZyk6IHZvaWR7XHJcbiAgICBsZXQgbmV3U3RhdHVzPXN0YXR1cz9zdGF0dXM6dGhpcy5uZXdTdGF0dXNSZWdpc3RlcjtcclxuICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSB0aGlzLmdyaWRBcGkuZ2V0U2VsZWN0ZWROb2RlcygpO1xyXG4gICAgc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiB7XHJcbiAgICAgIG5vZGUuZGF0YS5zdGF0dXM9bmV3U3RhdHVzO1xyXG4gICAgICBub2RlLnNlbGVjdGVkPWZhbHNlO1xyXG4gICAgfSApO1xyXG4gICAgdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3MoKTtcclxuICB9XHJcblxyXG4gIHNhdmVBZ0dyaWRTdGF0ZSgpOiB2b2lkIHtcclxuICAgIGxldCBhZ0dyaWRTdGF0ZSA9IHtcclxuICAgICAgaWRBZ0dyaWQ6IHRoaXMuaWQsXHJcbiAgICAgIGNvbFN0YXRlOiB0aGlzLmdyaWRDb2x1bW5BcGkuZ2V0Q29sdW1uU3RhdGUoKSxcclxuICAgICAgZmlsdGVyU3RhdGU6IHRoaXMuZ3JpZEFwaS5nZXRGaWx0ZXJNb2RlbCgpLFxyXG4gICAgICBzb3J0U3RhdGU6IHRoaXMuZ3JpZEFwaS5nZXRTb3J0TW9kZWwoKSxcclxuICAgICAgdmFsdWVTZWFyY2hHZW5lcmljOiB0aGlzLnNlYXJjaFZhbHVlXHJcbiAgICB9O1xyXG5cclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWdHcmlkU3RhdGVcIiwgSlNPTi5zdHJpbmdpZnkoYWdHcmlkU3RhdGUpKTtcclxuXHJcbiAgfVxyXG4gIHJlbW92ZUFnR3JpZFN0YXRlKCk6IHZvaWQge1xyXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhZ0dyaWRTdGF0ZVwiKVxyXG4gIH1cclxuXHJcbiAgZ2V0Q29sdW1uS2V5c0FuZEhlYWRlcnMoY29sdW1ua2V5czogQXJyYXk8YW55Pik6IFN0cmluZyB7XHJcbiAgICBsZXQgaGVhZGVyOiBBcnJheTxhbnk+ID0gW107XHJcbiAgICBpZiAodGhpcy5jb2x1bW5EZWZzLmxlbmd0aCA9PSAwKSB7IHJldHVybiAnJyB9O1xyXG5cclxuICAgIGxldCBhbGxDb2x1bW5LZXlzID0gdGhpcy5ncmlkT3B0aW9ucy5jb2x1bW5BcGkuZ2V0QWxsRGlzcGxheWVkQ29sdW1ucygpO1xyXG4gICAgLy8gY29uc29sZS5sb2coYWxsQ29sdW1uS2V5cyk7XHJcbiAgICBhbGxDb2x1bW5LZXlzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgIGlmIChlbGVtZW50LnVzZXJQcm92aWRlZENvbERlZi5oZWFkZXJOYW1lICE9PSAnJykge1xyXG4gICAgICAgIGNvbHVtbmtleXMucHVzaChlbGVtZW50LnVzZXJQcm92aWRlZENvbERlZi5maWVsZCk7XHJcbiAgICAgICAgaGVhZGVyLnB1c2goZWxlbWVudC51c2VyUHJvdmlkZWRDb2xEZWYuaGVhZGVyTmFtZSk7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGhlYWRlci5qb2luKFwiLFwiKTtcclxuICB9XHJcblxyXG5cclxuICBleHBvcnREYXRhKCk6IHZvaWQge1xyXG4gICAgbGV0IGNvbHVtbmtleXM6IEFycmF5PGFueT4gPSBbXTtcclxuICAgIGxldCBjdXN0b21IZWFkZXI6IFN0cmluZyA9ICcnO1xyXG4gICAgY3VzdG9tSGVhZGVyID0gdGhpcy5nZXRDb2x1bW5LZXlzQW5kSGVhZGVycyhjb2x1bW5rZXlzKVxyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgb25seVNlbGVjdGVkOiB0cnVlLFxyXG4gICAgICBjb2x1bW5LZXlzOiBjb2x1bW5rZXlzLFxyXG4gICAgICBjdXN0b21IZWFkZXI6IGN1c3RvbUhlYWRlcixcclxuICAgICAgc2tpcEhlYWRlcjogdHJ1ZVxyXG4gICAgfTtcclxuICAgIHRoaXMuZ3JpZEFwaS5leHBvcnREYXRhQXNDc3YocGFyYW1zKTtcclxuICB9XHJcblxyXG4gIHF1aWNrU2VhcmNoKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnNldFF1aWNrRmlsdGVyKHRoaXMuc2VhcmNoVmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgZ2V0RWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdldEFsbCgpXHJcbiAgICAgIC5zdWJzY3JpYmUoKGl0ZW1zKSA9PiB7XHJcbiAgICAgICAgaWYodGhpcy5zdGF0dXNDb2x1bW4pe1xyXG4gICAgICAgICAgbGV0IHN0YXR1cyA9IHRoaXMuYWxsTmV3RWxlbWVudHM/J3BlbmRpbmdDcmVhdGlvbic6J3N0YXR1c09LJ1xyXG4gICAgICAgICAgaXRlbXMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgaWYoZWxlbWVudC5zdGF0dXMgIT0gXCJub3RBdmFpbGFibGVcIiAmJiBlbGVtZW50LnN0YXR1cyAhPSBcInBlbmRpbmdDcmVhdGlvblwiICYmIGVsZW1lbnQuc3RhdHVzICE9IFwicGVuZGluZ1JlZ2lzdHJhdGlvblwiICYmIGVsZW1lbnQuc3RhdHVzICE9IFwidW5yZWdpc3RlcmVkTGF5ZXJcIil7XHJcbiAgICAgICAgICAgICAgZWxlbWVudC5zdGF0dXM9c3RhdHVzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodGhpcy5hbGxOZXdFbGVtZW50cykgeyBlbGVtZW50Lm5ldyA9IHRydWU7IH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJvd0RhdGEgPSBpdGVtcztcclxuICAgICAgICB0aGlzLmdyaWRBcGkuc2V0Um93RGF0YSh0aGlzLnJvd0RhdGEpO1xyXG4gICAgICAgIHRoaXMuc2V0U2l6ZSgpXHJcbiAgICAgICAgLy8gdGhpcy5ncmlkQXBpLnNpemVDb2x1bW5zVG9GaXQoKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMucm93RGF0YSk7XHJcblxyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldFNpemUoKSB7XHJcblxyXG4gICAgdmFyIGFsbENvbHVtbklkcyA9IFtdO1xyXG4gICAgbGV0IGNvbHVtbnMgPSB0aGlzLmdyaWRPcHRpb25zLmNvbHVtbkFwaS5nZXRBbGxDb2x1bW5zKCk7XHJcbiAgICBjb2x1bW5zLmZvckVhY2goZnVuY3Rpb24gKGNvbHVtbikge1xyXG4gICAgICBhbGxDb2x1bW5JZHMucHVzaChjb2x1bW4uY29sSWQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5ncmlkT3B0aW9ucy5jb2x1bW5BcGkuYXV0b1NpemVDb2x1bW5zKGFsbENvbHVtbklkcyk7XHJcblxyXG4gICAgbGV0IGdyaWQgPSB0aGlzLmdyaWRPcHRpb25zLmFwaVxyXG4gICAgbGV0IGF2YWlsYWJsZVdpZHRoID0gZ3JpZC5ncmlkUGFuZWwuZUJvZHlWaWV3cG9ydC5jbGllbnRXaWR0aDtcclxuXHJcbiAgICBsZXQgdXNlZFdpZHRoID0gZ3JpZC5ncmlkUGFuZWwuY29sdW1uQ29udHJvbGxlci5nZXRXaWR0aE9mQ29sc0luTGlzdChjb2x1bW5zKTtcclxuXHJcbiAgICBpZiAodXNlZFdpZHRoIDwgYXZhaWxhYmxlV2lkdGgpIHtcclxuICAgICAgZ3JpZC5zaXplQ29sdW1uc1RvRml0KCk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgYWRkSXRlbXMobmV3SXRlbXM6IGFueVtdKTogdm9pZCB7XHJcbiAgICBjb25zb2xlLmxvZyhuZXdJdGVtcyk7XHJcbiAgICBsZXQgaXRlbXNUb0FkZDogQXJyYXk8YW55PiA9IFtdO1xyXG4gICAgbGV0IGNvbmRpdGlvbiA9ICh0aGlzLmFkZEZpZWxkUmVzdHJpY3Rpb24pPyB0aGlzLmFkZEZpZWxkUmVzdHJpY3Rpb246ICdpZCc7XHJcbiAgICBcclxuXHJcbiAgICBuZXdJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cclxuICAgICAgaWYgKHRoaXMuY2hlY2tFbGVtZW50QWxsb3dlZFRvQWRkKGNvbmRpdGlvbixpdGVtKSkge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1c0NvbHVtbikge1xyXG4gICAgICAgICAgaXRlbS5zdGF0dXMgPSAncGVuZGluZ0NyZWF0aW9uJ1xyXG4gICAgICAgICAgaXRlbS5uZXdJdGVtID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaXRlbXNUb0FkZC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIHRoaXMucm93RGF0YS5wdXNoKGl0ZW0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBJdGVtIGFscmVhZHkgZXhpc3RzYClcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmdyaWRBcGkudXBkYXRlUm93RGF0YSh7IGFkZDogaXRlbXNUb0FkZCB9KTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLmNvbHVtbkRlZnMpO1xyXG4gICAgLy8gcGFyYW1zLm9sZFZhbHVlIT11bmRlZmluZWRcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2hlY2tFbGVtZW50QWxsb3dlZFRvQWRkKGNvbmRpdGlvbiwgaXRlbSl7XHJcblxyXG4gICAgbGV0IGZpbmFsQWRkaXRpb24gPSB0cnVlO1xyXG5cclxuICAgIGlmKEFycmF5LmlzQXJyYXkoY29uZGl0aW9uKSl7XHJcblxyXG4gICAgICBmb3IobGV0IGVsZW1lbnQgb2YgdGhpcy5yb3dEYXRhKXtcclxuICAgICAgICBsZXQgY2FuQWRkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvcihsZXQgY3VycmVudENvbmRpdGlvbiBvZiBjb25kaXRpb24pe1xyXG4gICAgICAgICAgaWYoZWxlbWVudFtjdXJyZW50Q29uZGl0aW9uXSAhPSBpdGVtW2N1cnJlbnRDb25kaXRpb25dKXtcclxuICAgICAgICAgICAgY2FuQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFjYW5BZGQpIHtcclxuICAgICAgICAgICBmaW5hbEFkZGl0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGZpbmFsQWRkaXRpb247XHJcblxyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgcmV0dXJuIChpdGVtW2NvbmRpdGlvbl0gPT0gdW5kZWZpbmVkIHx8ICh0aGlzLnJvd0RhdGEuZmluZChlbGVtZW50ID0+IGVsZW1lbnRbY29uZGl0aW9uXSA9PSBpdGVtW2NvbmRpdGlvbl0pKSA9PSB1bmRlZmluZWQpXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcblxyXG4gIGNoYW5nZUhlaWdodCh2YWx1ZSkge1xyXG4gICAgbGV0IHBpeGVscyA9IFwiXCI7XHJcbiAgICBpZiAodmFsdWUgPT09ICc1Jykge1xyXG4gICAgICBwaXhlbHMgPSBcIjIwMHB4XCJcclxuICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICcxMCcpIHtcclxuICAgICAgcGl4ZWxzID0gXCIzMTVweFwiXHJcbiAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnMjAnKSB7XHJcbiAgICAgIHBpeGVscyA9IFwiNjMwcHhcIlxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcGl4ZWxzID0gXCIxNTUwcHhcIlxyXG4gICAgfVxyXG4gICAgdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gcGl4ZWxzO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlRGF0YSgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKTtcclxuICAgIGNvbnN0IHNlbGVjdGVkRGF0YSA9IHNlbGVjdGVkTm9kZXMubWFwKG5vZGUgPT4gbm9kZS5kYXRhKTtcclxuICAgIHRoaXMucmVtb3ZlLmVtaXQoc2VsZWN0ZWREYXRhKTtcclxuXHJcbiAgICBpZiAodGhpcy5zdGF0dXNDb2x1bW4pIHtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRSb3dzID0gc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiBub2RlLmlkKTtcclxuICAgICAgaWYoc2VsZWN0ZWRSb3dzLmxlbmd0aD4wKSB7dGhpcy5zb21lU3RhdHVzSGFzQ2hhbmdlZFRvRGVsZXRlPXRydWU7fVxyXG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIHNlbGVjdGVkUm93cykge1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS5nZXRSb3dOb2RlKGlkKS5kYXRhLnN0YXR1cyA9ICdwZW5kaW5nRGVsZXRlJztcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmdyaWRPcHRpb25zLmFwaS5yZWZyZXNoQ2VsbHMoKTtcclxuICAgIH1cclxuICAgIHRoaXMuZ3JpZE9wdGlvbnMuYXBpLmRlc2VsZWN0QWxsKCk7XHJcbiAgfVxyXG5cclxuICBuZXdEYXRhKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIHRoaXMubmV3LmVtaXQoLTEpO1xyXG4gIH1cclxuXHJcbiAgb25BZGRCdXR0b25DbGlja2VkKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIHRoaXMuYWRkLmVtaXQoLTEpO1xyXG4gIH1cclxuXHJcbiAgb25EdXBsaWNhdGVCdXR0b25DbGlja2VkKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIGlmICh0aGlzLmNoYW5nZUNvdW50ZXIgPiAwKSB7XHJcbiAgICAgIGNvbnN0IGRpYWxvZ1JlZiA9IHRoaXMuZGlhbG9nLm9wZW4oRGlhbG9nTWVzc2FnZUNvbXBvbmVudCk7XHJcbiAgICAgIGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS50aXRsZSA9IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoJ2NhdXRpb24nKVxyXG4gICAgICBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UubWVzc2FnZSA9IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoJ2R1cGxpY2F0ZU1lc3NhZ2UnKVxyXG4gICAgICBkaWFsb2dSZWYuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICBpZiAocmVzdWx0LmV2ZW50ID09PSAnQWNjZXB0Jykge1xyXG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKTtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWREYXRhID0gc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiBub2RlLmRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLmR1cGxpY2F0ZS5lbWl0KHNlbGVjdGVkRGF0YSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IHRoaXMuZ3JpZEFwaS5nZXRTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGVkRGF0YSA9IHNlbGVjdGVkTm9kZXMubWFwKG5vZGUgPT4gbm9kZS5kYXRhKTtcclxuICAgICAgdGhpcy5kdXBsaWNhdGUuZW1pdChzZWxlY3RlZERhdGEpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIGFwcGx5Q2hhbmdlcygpOiB2b2lkIHtcclxuICAgIGNvbnN0IGl0ZW1zQ2hhbmdlZDogYW55W10gPSBbXTtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBvZiB0aGlzLmNoYW5nZXNNYXAua2V5cygpKSB7XHJcbiAgICAgIGl0ZW1zQ2hhbmdlZC5wdXNoKHRoaXMuZ3JpZEFwaS5nZXRSb3dOb2RlKGtleSkuZGF0YSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnNlbmRDaGFuZ2VzLmVtaXQoaXRlbXNDaGFuZ2VkKTtcclxuICAgIHRoaXMuZ3JpZE1vZGlmaWVkLmVtaXQoZmFsc2UpO1xyXG4gICAgdGhpcy5jaGFuZ2VzTWFwLmNsZWFyKCk7XHJcbiAgICB0aGlzLmNoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5yZWRvQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnNvbWVTdGF0dXNIYXNDaGFuZ2VkVG9EZWxldGU9ZmFsc2U7XHJcbiAgICAvLyB0aGlzLnBhcmFtcy5jb2xEZWYuY2VsbFN0eWxlID0geyBiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGRkZGJyB9O1xyXG4gICAgdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3MoKTtcclxuICB9XHJcblxyXG5cclxuXHJcbiAgZGVsZXRlQ2hhbmdlcygpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICBsZXQgbmV3RWxlbWVudHNBY3RpdmVkPSB0aGlzLmFsbE5ld0VsZW1lbnRzO1xyXG5cclxuICAgIHdoaWxlICh0aGlzLmNoYW5nZUNvdW50ZXIgPiAwKSB7XHJcbiAgICAgIHRoaXMudW5kbygpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY2hhbmdlc01hcC5jbGVhcigpO1xyXG4gICAgLy90aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuXHJcbiAgICBpZih0aGlzLnN0YXR1c0NvbHVtbiAmJiAhdGhpcy5kaXNjYXJkTm9uUmV2ZXJzZVN0YXR1cylcclxuICAgIHtcclxuICAgICAgbGV0IHJvd3NXaXRoU3RhdHVzTW9kaWZpZWQgPSBbXTtcclxuICAgICAgdGhpcy5ncmlkQXBpLmZvckVhY2hOb2RlKGZ1bmN0aW9uKG5vZGUpIHsgXHJcbiAgICAgICAgaWYobm9kZS5kYXRhLnN0YXR1cyA9PT0gJ3BlbmRpbmdNb2RpZnknIHx8IG5vZGUuZGF0YS5zdGF0dXMgPT09ICdwZW5kaW5nRGVsZXRlJykge1xyXG4gICAgICAgICAgaWYobm9kZS5kYXRhLnN0YXR1cyA9PT0gJ3BlbmRpbmdEZWxldGUnKXtcclxuICAgICAgICAgICAgcm93c1dpdGhTdGF0dXNNb2RpZmllZC5wdXNoKG5vZGUuZGF0YSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZihub2RlLmRhdGEubmV3SXRlbSB8fCBuZXdFbGVtZW50c0FjdGl2ZWQpe1xyXG4gICAgICAgICAgICBub2RlLmRhdGEuc3RhdHVzPSdwZW5kaW5nQ3JlYXRpb24nXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBub2RlLmRhdGEuc3RhdHVzPSdzdGF0dXNPSydcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc29tZVN0YXR1c0hhc0NoYW5nZWRUb0RlbGV0ZT1mYWxzZTtcclxuICAgIHRoaXMuZGlzY2FyZENoYW5nZXMuZW1pdChyb3dzV2l0aFN0YXR1c01vZGlmaWVkKTtcclxuICAgIHRoaXMuZ3JpZE1vZGlmaWVkLmVtaXQoZmFsc2UpO1xyXG4gIH1cclxuICB0aGlzLmdyaWRBcGkucmVkcmF3Um93cygpO1xyXG5cclxuICAgIC8vdGhpcy5wYXJhbXMuY29sRGVmLmNlbGxTdHlsZSA9ICB7YmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRid9O1xyXG4gICAgLy90aGlzLmdyaWRBcGkucmVkcmF3Um93cygpO1xyXG4gIH1cclxuXHJcblxyXG4gIG9uRmlsdGVyTW9kaWZpZWQoKTogdm9pZCB7XHJcblxyXG4gICAgdGhpcy5kZWxldGVDaGFuZ2VzKCk7XHJcblxyXG4gIH1cclxuXHJcblxyXG4gIHVuZG8oKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgdGhpcy5ncmlkQXBpLnVuZG9DZWxsRWRpdGluZygpO1xyXG4gICAgdGhpcy5jaGFuZ2VDb3VudGVyIC09IDE7XHJcbiAgICBpZih0aGlzLmNoYW5nZUNvdW50ZXIgPT0gMCkgeyB0aGlzLmdyaWRNb2RpZmllZC5lbWl0KGZhbHNlKX1cclxuICAgIHRoaXMucmVkb0NvdW50ZXIgKz0gMTtcclxuICB9XHJcblxyXG4gIHJlZG8oKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgdGhpcy5ncmlkQXBpLnJlZG9DZWxsRWRpdGluZygpO1xyXG4gICAgdGhpcy5jaGFuZ2VDb3VudGVyICs9IDE7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyIC09IDE7XHJcbiAgfVxyXG5cclxuXHJcbiAgb25DZWxsRWRpdGluZ1N0b3BwZWQoZSkge1xyXG4gICAgaWYgKHRoaXMubW9kaWZpY2F0aW9uQ2hhbmdlKSB7XHJcbiAgICAgIHRoaXMuY2hhbmdlQ291bnRlcisrO1xyXG4gICAgICBpZih0aGlzLmNoYW5nZUNvdW50ZXIgPT0gMSkgeyB0aGlzLmdyaWRNb2RpZmllZC5lbWl0KHRydWUpfVxyXG4gICAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuICAgICAgdGhpcy5vbkNlbGxWYWx1ZUNoYW5nZWQoZSk7XHJcbiAgICAgIHRoaXMubW9kaWZpY2F0aW9uQ2hhbmdlID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgb25DZWxsVmFsdWVDaGFuZ2VkKHBhcmFtcyk6IHZvaWQge1xyXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcbiAgICBpZiAodGhpcy5jaGFuZ2VDb3VudGVyID4gdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIpXHJcbiAgICAvLyBUcnVlIGlmIHdlIGhhdmUgZWRpdGVkIHNvbWUgY2VsbCBvciB3ZSBoYXZlIGRvbmUgYSByZWRvIFxyXG4gICAge1xyXG5cclxuICAgICAgaWYgKHBhcmFtcy5vbGRWYWx1ZSAhPT0gcGFyYW1zLnZhbHVlICYmICEocGFyYW1zLm9sZFZhbHVlID09IG51bGwgJiYgcGFyYW1zLnZhbHVlID09PSAnJykpIHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmNoYW5nZXNNYXAuaGFzKHBhcmFtcy5ub2RlLmlkKSkgLy8gSWYgaXQncyBmaXJ0cyBlZGl0IG9mIGEgY2VsbCwgd2UgYWRkIGl0IHRvIHRoZSBtYXAgYW5kIHdlIHBhaW50IGl0XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgY29uc3QgYWRkTWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcclxuICAgICAgICAgIGFkZE1hcC5zZXQocGFyYW1zLmNvbERlZi5maWVsZCwgMSlcclxuICAgICAgICAgIHRoaXMuY2hhbmdlc01hcC5zZXQocGFyYW1zLm5vZGUuaWQsIGFkZE1hcCk7XHJcbiAgICAgICAgICBpZiAodGhpcy5zdGF0dXNDb2x1bW4pIHtcclxuICAgICAgICAgICAgLy8gaWYgKHRoaXMuZ3JpZEFwaS5nZXRSb3dOb2RlKHBhcmFtcy5ub2RlLmlkKS5kYXRhLnN0YXR1cyAhPT0gJ3BlbmRpbmdDcmVhdGlvbicpIHtcclxuICAgICAgICAgICAgICB0aGlzLmdyaWRBcGkuZ2V0Um93Tm9kZShwYXJhbXMubm9kZS5pZCkuZGF0YS5zdGF0dXMgPSAncGVuZGluZ01vZGlmeSdcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGlmICghdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuaGFzKHBhcmFtcy5jb2xEZWYuZmllbGQpKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5zZXQocGFyYW1zLmNvbERlZi5maWVsZCwgMSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFdlIGFscmVhZHkgaGFkIGVkaXRlZCB0aGlzIGNlbGwsIHNvIHdlIG9ubHkgaW5jcmVtZW50IG51bWJlciBvZiBjaGFuZ2VzIG9mIGl0IG9uIHRoZSBtYXAgXHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDaGFuZ2VzID0gdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuZ2V0KHBhcmFtcy5jb2xEZWYuZmllbGQpO1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5zZXQocGFyYW1zLmNvbERlZi5maWVsZCwgKGN1cnJlbnRDaGFuZ2VzICsgMSkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wYWludENlbGxzKHBhcmFtcywgdGhpcy5jaGFuZ2VzTWFwKTsgLy9XZSBwYWludCB0aGUgcm93IG9mIHRoZSBlZGl0ZWQgY2VsbCBcclxuICAgICAgICB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlcisrOyAvL1dlIG1hdGNoIHRoZSBjdXJyZW50IHByZXZpb3VzQ2hhbmdlQ291bnRlciB3aXRoIGNoYW5nZUNvdW50ZXJcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHRoaXMuY2hhbmdlQ291bnRlciA8IHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyKSB7IC8vIFRydWUgaWYgd2UgaGF2ZSBkb25lIGFuIHVuZG9cclxuICAgICAgbGV0IGN1cnJlbnRDaGFuZ2VzID0gLTE7XHJcbiAgICAgIGlmICh0aGlzLmNoYW5nZXNNYXAuaGFzKHBhcmFtcy5ub2RlLmlkKSkgeyBjdXJyZW50Q2hhbmdlcyA9IHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmdldChwYXJhbXMuY29sRGVmLmZpZWxkKTsgfVxyXG5cclxuICAgICAgaWYgKGN1cnJlbnRDaGFuZ2VzID09PSAxKSB7IC8vT25jZSB0aGUgdW5kbyBpdCdzIGRvbmUsIGNlbGwgaXMgaW4gaGlzIGluaXRpYWwgc3RhdHVzXHJcblxyXG4gICAgICAgIHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmRlbGV0ZShwYXJhbXMuY29sRGVmLmZpZWxkKTtcclxuICAgICAgICBpZiAodGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuc2l6ZSA9PT0gMCkgeyAvLyBObyBtb3JlIG1vZGlmaWNhdGlvbnMgaW4gdGhpcyByb3dcclxuICAgICAgICAgIHRoaXMuY2hhbmdlc01hcC5kZWxldGUocGFyYW1zLm5vZGUuaWQpO1xyXG4gICAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5ncmlkQXBpLmdldERpc3BsYXllZFJvd0F0SW5kZXgocGFyYW1zLnJvd0luZGV4KTtcclxuICAgICAgICAgIGlmICh0aGlzLnN0YXR1c0NvbHVtbikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ncmlkQXBpLmdldFJvd05vZGUocGFyYW1zLm5vZGUuaWQpLmRhdGEuc3RhdHVzICE9PSAncGVuZGluZ0NyZWF0aW9uJykge1xyXG4gICAgICAgICAgICAgIHRoaXMuZ3JpZEFwaS5nZXRSb3dOb2RlKHBhcmFtcy5ub2RlLmlkKS5kYXRhLnN0YXR1cyA9J3N0YXR1c09LJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgLy8gV2UgcGFpbnQgaXQgd2hpdGVcclxuICAgICAgICAgIHRoaXMuZ3JpZEFwaS5yZWRyYXdSb3dzKHsgcm93Tm9kZXM6IFtyb3ddIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnBhaW50Q2VsbHMocGFyYW1zLCB0aGlzLmNoYW5nZXNNYXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAoY3VycmVudENoYW5nZXMgPiAxKSAvLyBUaGUgY2VsbCBpc24ndCBpbiBoaXMgaW5pdGlhbCBzdGF0ZSB5ZXRcclxuICAgICAgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vV2UgY2FuJ3QgZG8gZWxzZSBiZWNhdXNlIHdlIGNhbiBiZSBkb2luZyBhbiB1bmRvIHdpdGhvdXQgY2hhbmdlcyBcclxuICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5zZXQocGFyYW1zLmNvbERlZi5maWVsZCwgKGN1cnJlbnRDaGFuZ2VzIC0gMSkpO1xyXG5cclxuICAgICAgICB0aGlzLnBhaW50Q2VsbHMocGFyYW1zLCB0aGlzLmNoYW5nZXNNYXApOy8vTm90IGluaXRpYWwgc3RhdGUgLT4gZ3JlZW4gYmFja2dyb3VuZFxyXG5cclxuICAgICAgfVxyXG4gICAgICB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlci0tOyAgLy9XZSBkZWNyZW1lbnQgcHJldmlvdXNDaGFuZ2VDb3VudGVyIGJlY2F1c2Ugd2UgaGF2ZSBkb25lIHVuZG9cclxuICAgIH1cclxuICAgIGVsc2UgeyAvLyBDb250cm9sIG9mIG1vZGlmaWNhdGlvbnMgd2l0aG91dCBjaGFuZ2VzXHJcbiAgICAgIGlmICghKHBhcmFtcy5vbGRWYWx1ZSA9PSBudWxsICYmIHBhcmFtcy52YWx1ZSA9PT0gJycpKSB7XHJcbiAgICAgICAgbGV0IG5ld1ZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgaWYgKHBhcmFtcy52YWx1ZSA9PSBudWxsKSB7IG5ld1ZhbHVlID0gJycgfVxyXG4gICAgICAgIGVsc2UgeyBuZXdWYWx1ZSA9IHBhcmFtcy52YWx1ZS50b1N0cmluZygpIH1cclxuXHJcbiAgICAgICAgaWYgKChwYXJhbXMub2xkVmFsdWUgIT0gdW5kZWZpbmVkICYmIHBhcmFtcy5vbGRWYWx1ZSAhPSBudWxsICYmIHBhcmFtcy5vbGRWYWx1ZS50b1N0cmluZygpICE9PSBuZXdWYWx1ZS50b1N0cmluZygpKVxyXG4gICAgICAgICAgfHwgKChwYXJhbXMub2xkVmFsdWUgPT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5vbGRWYWx1ZSA9PSBudWxsKSAmJiBuZXdWYWx1ZSAhPSBudWxsKSkge1xyXG5cclxuICAgICAgICAgIHRoaXMubW9kaWZpY2F0aW9uQ2hhbmdlID0gdHJ1ZTtcclxuICAgICAgICAgIGlmIChwYXJhbXMuY29sRGVmLmNlbGxSZW5kZXJlciA9PSBcImJ0bkNoZWNrYm94UmVuZGVyZXJDb21wb25lbnRcIikge1xyXG4gICAgICAgICAgICB2YXIgdW5kb1JlZG9BY3Rpb25zID0ge1xyXG4gICAgICAgICAgICAgIGNlbGxWYWx1ZUNoYW5nZXM6IHRoaXMuZ3JpZEFwaS51bmRvUmVkb1NlcnZpY2UuY2VsbFZhbHVlQ2hhbmdlc1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLmdyaWRBcGkudW5kb1JlZG9TZXJ2aWNlLnB1c2hBY3Rpb25zVG9VbmRvU3RhY2sodW5kb1JlZG9BY3Rpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5ncmlkQXBpLnVuZG9SZWRvU2VydmljZS5pc0ZpbGxpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5vbkNlbGxFZGl0aW5nU3RvcHBlZChwYXJhbXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgdGhpcy5tb2RpZmljYXRpb25XaXRob3V0Q2hhbmdlcyhwYXJhbXMpIH1cclxuXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7IHRoaXMubW9kaWZpY2F0aW9uV2l0aG91dENoYW5nZXMocGFyYW1zKSB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBtb2RpZmljYXRpb25XaXRob3V0Q2hhbmdlcyhwYXJhbXM6IGFueSkge1xyXG5cclxuICAgIGlmICh0aGlzLmNoYW5nZXNNYXAuaGFzKHBhcmFtcy5ub2RlLmlkKSkgLy9Nb2RpZmljYXRpb24gd2l0aG91dCBjaGFuZ2VzIGluIGVuIGVkaXRlZCBjZWxsXHJcbiAgICB7XHJcbiAgICAgIGlmICghdGhpcy51bmRvTm9DaGFuZ2VzKSB7XHJcbiAgICAgICAgdGhpcy5ncmlkQXBpLnVuZG9DZWxsRWRpdGluZygpOyAvLyBVbmRvIHRvIGRlbGV0ZSB0aGUgY2hhbmdlIHdpdGhvdXQgY2hhbmdlcyBpbnRlcm5hbGx5IFxyXG4gICAgICAgIHRoaXMudW5kb05vQ2hhbmdlcyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5wYWludENlbGxzKHBhcmFtcywgdGhpcy5jaGFuZ2VzTWFwKTsgIC8vVGhlIGNlbGwgaGFzIG1vZGlmaWNhdGlvbnMgeWV0IC0+IGdyZWVuIGJhY2tncm91bmQgXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7IHRoaXMudW5kb05vQ2hhbmdlcyA9IGZhbHNlOyB9XHJcblxyXG5cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAvL1dpdGggdGhlIGludGVybmFsbHkgdW5kbyB3aWxsIGVudGVyIGF0IHRoaXMgZnVuY3Rpb24sIHNvIHdlIGhhdmUgdG8gY29udHJvbCB3aGVuIGRvbmUgdGhlIHVuZG8gb3Igbm90IFxyXG4gICAgICBpZiAoIXRoaXMudW5kb05vQ2hhbmdlcykge1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS51bmRvQ2VsbEVkaXRpbmcoKTsgLy8gVW5kbyB0byBkZWxldGUgdGhlIGNoYW5nZSBpbnRlcm5hbGx5XHJcbiAgICAgICAgdGhpcy51bmRvTm9DaGFuZ2VzID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHsgdGhpcy51bmRvTm9DaGFuZ2VzID0gZmFsc2U7IH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBnZXRDb2x1bW5JbmRleEJ5Q29sSWQoYXBpOiBDb2x1bW5BcGksIGNvbElkOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIGFwaS5nZXRBbGxDb2x1bW5zKCkuZmluZEluZGV4KGNvbCA9PiBjb2wuZ2V0Q29sSWQoKSA9PT0gY29sSWQpO1xyXG4gIH1cclxuICBwYWludENlbGxzKHBhcmFtczogYW55LCBjaGFuZ2VzTWFwOiBNYXA8bnVtYmVyLCBNYXA8c3RyaW5nLCBudW1iZXI+PiwpIHtcclxuICAgIGNvbnN0IHJvdyA9IHRoaXMuZ3JpZEFwaS5nZXREaXNwbGF5ZWRSb3dBdEluZGV4KHBhcmFtcy5yb3dJbmRleCk7XHJcblxyXG4gICAgLy8gdGhpcy5jaGFuZ2VDZWxsU3R5bGVDb2x1bW5zKHBhcmFtcywgY2hhbmdlc01hcCwgJyNFOEYxREUnKTtcclxuICAgIHRoaXMuZ3JpZEFwaS5yZWRyYXdSb3dzKHsgcm93Tm9kZXM6IFtyb3ddIH0pO1xyXG4gICAgLy8gdGhpcy5jaGFuZ2VDZWxsU3R5bGVDb2x1bW5zKHBhcmFtcywgY2hhbmdlc01hcCwgJyNGRkZGRkYnKTtcclxuICAgIC8vIFdlIHdpbGwgZGVmaW5lIGNlbGxTdHlsZSB3aGl0ZSB0byBmdXR1cmUgbW9kaWZpY2F0aW9ucyAobGlrZSBmaWx0ZXIpXHJcbiAgfVxyXG5cclxuICAvLyBjaGFuZ2VDZWxsU3R5bGVDb2x1bW5zKHBhcmFtczogYW55LCBjaGFuZ2VzTWFwOiBNYXA8bnVtYmVyLCBNYXA8c3RyaW5nLCBudW1iZXI+PiwgY29sb3I6IHN0cmluZykge1xyXG5cclxuICAvLyAgIGZvciAoY29uc3Qga2V5IG9mIGNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5rZXlzKCkpIHtcclxuICAvLyAgICAgY29uc3QgY29sdW1uTnVtYmVyID0gdGhpcy5nZXRDb2x1bW5JbmRleEJ5Q29sSWQodGhpcy5ncmlkQ29sdW1uQXBpLCBrZXkpO1xyXG4gIC8vICAgICB0aGlzLmdyaWRDb2x1bW5BcGkuY29sdW1uQ29udHJvbGxlci5ncmlkQ29sdW1uc1tjb2x1bW5OdW1iZXJdLmNvbERlZi5jZWxsU3R5bGUgPSB7IGJhY2tncm91bmRDb2xvcjogY29sb3IgfTtcclxuICAvLyAgIH1cclxuXHJcblxyXG4gIC8vIH1cclxuXHJcbn1cclxuIl19