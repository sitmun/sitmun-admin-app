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
            this._eventGetAllRowsSubscription = this.eventGetAllRowsSubscription.subscribe((event) => {
                this.emitAllRows(event);
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
     * @param {?} event
     * @return {?}
     */
    emitAllRows(event) {
        // let rowData = [];
        // this.gridApi.forEachNode(node => rowData.push(node.data));
        this.getAllRows.emit({ data: this.getAllCurrentData(), event: event });
    }
    /**
     * @return {?}
     */
    getAllCurrentData() {
        /** @type {?} */
        let rowData = [];
        this.gridApi.forEachNode(node => rowData.push(node.data));
        return rowData;
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
            /** @type {?} */
            let status = this.allNewElements ? 'pendingCreation' : 'statusOK';
            /** @type {?} */
            let newItems = [];
            /** @type {?} */
            let condition = (this.addFieldRestriction) ? this.addFieldRestriction : 'id';
            items.forEach(element => {
                if (this.statusColumn) {
                    if (element.status != "notAvailable" && element.status != "pendingCreation" && element.status != "pendingRegistration" && element.status != "unregisteredLayer") {
                        element.status = status;
                    }
                    if (this.allNewElements) {
                        element.new = true;
                    }
                }
                if (this.currentData) {
                    if (this.checkElementAllowedToAdd(condition, element, this.currentData)) {
                        newItems.push(element);
                    }
                }
            });
            // if(this.statusColumn){
            //   let status = this.allNewElements?'pendingCreation':'statusOK'
            //   items.forEach(element => {
            //     if(element.status != "notAvailable" && element.status != "pendingCreation" && element.status != "pendingRegistration" && element.status != "unregisteredLayer"){
            //       element.status=status
            //     }
            //     if(this.allNewElements) { element.new = true; }
            //   });
            // }
            this.rowData = this.currentData ? newItems : items;
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
            if (this.checkElementAllowedToAdd(condition, item, this.rowData)) {
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
     * @param {?} data
     * @return {?}
     */
    checkElementAllowedToAdd(condition, item, data) {
        /** @type {?} */
        let finalAddition = true;
        if (Array.isArray(condition)) {
            for (let element of data) {
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
            if (this.fieldRestrictionWithDifferentName) {
                return (item[condition] == undefined || (data.find(element => element[this.fieldRestrictionWithDifferentName] == item[condition])) == undefined);
            }
            return (item[condition] == undefined || (data.find(element => element[condition] == item[condition])) == undefined);
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
        this.add.emit(this.getAllCurrentData());
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
            this.gridOptions.api.deselectAll();
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
    currentData: [{ type: Input }],
    fieldRestrictionWithDifferentName: [{ type: Input }],
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
    DataGridComponent.prototype.currentData;
    /** @type {?} */
    DataGridComponent.prototype.fieldRestrictionWithDifferentName;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1ncmlkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGF0YS1ncmlkL2RhdGEtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQW9CLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVyRyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRWxDLE9BQU8sRUFBRSxtQkFBbUIsRUFBcUIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN4RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUM1RixPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUN4RyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUNsRyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDckQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFXcEYsTUFBTSxPQUFPLGlCQUFpQjs7Ozs7O0lBZ0Y1QixZQUFtQixNQUFpQixFQUMzQixXQUNDO1FBRlMsV0FBTSxHQUFOLE1BQU0sQ0FBVztRQUMzQixjQUFTLEdBQVQsU0FBUztRQUNSLFVBQUssR0FBTCxLQUFLO3VCQTNFSyxtQkFBbUI7UUFPdkMsb0JBQWUsS0FBSyxDQUFDO1FBQ3JCLDRCQUF1QixLQUFLLENBQUM7MEJBQ2tCLElBQUksR0FBRyxFQUErQjtRQU9yRiwwQkFBcUIsS0FBSyxDQUFDO1FBQzNCLHFCQUFnQixLQUFLLENBQUM7UUFFdEIs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QUNMLEtBQUs7MkJBQ0wsS0FBSzt3QkFDTCxLQUFLOzZCQUNMLEtBQUs7Z0NBQ0wsS0FBSzsyQkFDTCxLQUFLO2lDQUNMLEtBQUs7NEJBQ0wsS0FBSzt3QkFDTCxLQUFLOzhCQUNMLEtBQUs7MEJBQ0wsS0FBSztvQkFDTCxLQUFLOytCQUNMLEtBQUs7a0NBQ0wsS0FBSztzQ0FDTCxLQUFLO2tDQUNMLEtBQUs7NkJBQ0wsS0FBSzswQkFDTCxLQUFLO2dEQUNMLEtBQUs7cUJBR0wsTUFBTTtrQkFDTixNQUFNO2tCQUNOLE1BQU07NkJBQ04sTUFBTTswQkFDTixNQUFNO3dCQUNOLE1BQU07OEJBQ04sTUFBTTt5QkFDTixNQUFNOzZCQUNOLE1BQU07MkJBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFnR3JpZE1vZHVsZSB9IGZyb20gJ0BhZy1ncmlkLWNvbW11bml0eS9hbmd1bGFyJztcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIE5nTW9kdWxlLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBBbGxDb21tdW5pdHlNb2R1bGVzLCBDb2x1bW5BcGksIE1vZHVsZSB9IGZyb20gJ0BhZy1ncmlkLWNvbW11bml0eS9hbGwtbW9kdWxlcyc7XHJcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcclxuaW1wb3J0IHsgQnRuRWRpdFJlbmRlcmVkQ29tcG9uZW50IH0gZnJvbSAnLi4vYnRuLWVkaXQtcmVuZGVyZWQvYnRuLWVkaXQtcmVuZGVyZWQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQnRuQ2hlY2tib3hSZW5kZXJlZENvbXBvbmVudCB9IGZyb20gJy4uL2J0bi1jaGVja2JveC1yZW5kZXJlZC9idG4tY2hlY2tib3gtcmVuZGVyZWQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQnRuQ2hlY2tib3hGaWx0ZXJDb21wb25lbnQgfSBmcm9tICcuLi9idG4tY2hlY2tib3gtZmlsdGVyL2J0bi1jaGVja2JveC1maWx0ZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTWF0RGlhbG9nIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcclxuaW1wb3J0IHsgRGlhbG9nTWVzc2FnZUNvbXBvbmVudCB9IGZyb20gJy4uL2RpYWxvZy1tZXNzYWdlL2RpYWxvZy1tZXNzYWdlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IGZvckVhY2ggfSBmcm9tICdqc3ppcCc7XHJcbmRlY2xhcmUgbGV0ICQ6IGFueTtcclxuXHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtZGF0YS1ncmlkJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vZGF0YS1ncmlkLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9kYXRhLWdyaWQuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGF0YUdyaWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBfZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgX2V2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgX2V2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbjogYW55O1xyXG4gIF9ldmVudFNhdmVBZ0dyaWRTdGF0ZVN1YnNjcmlwdGlvbjogYW55O1xyXG4gIF9ldmVudE1vZGlmeVN0YXR1c09mU2VsZWN0ZWRDZWxsczogYW55O1xyXG4gIG1vZHVsZXM6IE1vZHVsZVtdID0gQWxsQ29tbXVuaXR5TW9kdWxlcztcclxuXHJcblxyXG4gIFVuZGVSZWRvQWN0aW9uc1xyXG4gIHNlYXJjaFZhbHVlOiBzdHJpbmc7XHJcbiAgZ3JpZEFwaTogYW55O1xyXG4gIGdyaWRDb2x1bW5BcGk6IGFueTtcclxuICBzdGF0dXNDb2x1bW4gPSBmYWxzZTtcclxuICBzb21lQ29sdW1uSXNFZGl0YWJsZSA9IGZhbHNlO1xyXG4gIGNoYW5nZXNNYXA6IE1hcDxudW1iZXIsIE1hcDxzdHJpbmcsIG51bWJlcj4+ID0gbmV3IE1hcDxudW1iZXIsIE1hcDxzdHJpbmcsIG51bWJlcj4+KCk7XHJcbiAgLy8gV2Ugd2lsbCBzYXZlIHRoZSBpZCBvZiBlZGl0ZWQgY2VsbHMgYW5kIHRoZSBudW1iZXIgb2YgZWRpdGlvbnMgZG9uZS5cclxuICBwYXJhbXM6IGFueTsgLy8gTGFzdCBwYXJhbWV0ZXJzIG9mIHRoZSBncmlkIChpbiBjYXNlIHdlIGRvIGFwcGx5IGNoYW5nZXMgd2Ugd2lsbCBuZWVkIGl0KSBcclxuICByb3dEYXRhOiBhbnlbXTtcclxuICBjaGFuZ2VDb3VudGVyOiBudW1iZXI7IC8vIE51bWJlciBvZiBlZGl0aW9ucyBkb25lIGFib3ZlIGFueSBjZWxsIFxyXG4gIHByZXZpb3VzQ2hhbmdlQ291bnRlcjogbnVtYmVyOyAvLyBOdW1iZXIgb2YgZGl0aW9ucyBkb25lIGFmdGVyIHRoZSBsYXN0IG1vZGlmaWNhdGlvbihjaGFuZ2VDb3VudGVyKVxyXG4gIHJlZG9Db3VudGVyOiBudW1iZXI7IC8vIE51bWJlciBvZiByZWRvIHdlIGNhbiBkb1xyXG4gIG1vZGlmaWNhdGlvbkNoYW5nZSA9IGZhbHNlO1xyXG4gIHVuZG9Ob0NoYW5nZXMgPSBmYWxzZTsgLy8gQm9vbGVhbiB0aGF0IGluZGljYXRlcyBpZiBhbiB1bmRvIGhhc24ndCBtb2RpZmljYXRpb25zXHJcbiAgZ3JpZE9wdGlvbnM7XHJcbiAgc29tZVN0YXR1c0hhc0NoYW5nZWRUb0RlbGV0ZSA9IGZhbHNlO1xyXG5cclxuXHJcbiAgQElucHV0KCkgZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG4gIEBJbnB1dCgpIGV2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG4gIEBJbnB1dCgpIGV2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZTxzdHJpbmc+O1xyXG4gIEBJbnB1dCgpIGV2ZW50U2F2ZUFnR3JpZFN0YXRlU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG4gIEBJbnB1dCgpIGV2ZW50TW9kaWZ5U3RhdHVzT2ZTZWxlY3RlZENlbGxzOiBPYnNlcnZhYmxlPHN0cmluZz47XHJcbiAgQElucHV0KCkgZXZlbnRBZGRJdGVtc1N1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZTxib29sZWFuPjtcclxuICBASW5wdXQoKSBmcmFtZXdvcmtDb21wb25lbnRzOiBhbnk7XHJcbiAgQElucHV0KCkgY29tcG9uZW50czogYW55O1xyXG4gIEBJbnB1dCgpIGNvbHVtbkRlZnM6IGFueVtdO1xyXG4gIEBJbnB1dCgpIGdldEFsbDogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+O1xyXG4gIEBJbnB1dCgpIGRpc2NhcmRDaGFuZ2VzQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGRpc2NhcmROb25SZXZlcnNlU3RhdHVzOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGlkOiBhbnk7XHJcbiAgQElucHV0KCkgdW5kb0J1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBkZWZhdWx0Q29sdW1uU29ydGluZzogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHJlZG9CdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYXBwbHlDaGFuZ2VzQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGRlbGV0ZUJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBuZXdCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYWN0aW9uQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGFkZEJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSByZWdpc3RlckJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBuZXdTdGF0dXNSZWdpc3Rlcjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGdsb2JhbFNlYXJjaDogYm9vbGVhbjtcclxuICBASW5wdXQoKSBjaGFuZ2VIZWlnaHRCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgZGVmYXVsdEhlaWdodDogYW55O1xyXG4gIEBJbnB1dCgpIHRoZW1lR3JpZDogYW55O1xyXG4gIEBJbnB1dCgpIHNpbmdsZVNlbGVjdGlvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBub25FZGl0YWJsZTogYm9vbGVhbjtcclxuICBASW5wdXQoKSB0aXRsZTogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGhpZGVFeHBvcnRCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgaGlkZUR1cGxpY2F0ZUJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBoaWRlU2VhcmNoUmVwbGFjZUJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBhZGRGaWVsZFJlc3RyaWN0aW9uOiBhbnk7XHJcbiAgQElucHV0KCkgYWxsTmV3RWxlbWVudHM6IGFueTtcclxuICBASW5wdXQoKSBjdXJyZW50RGF0YTogQXJyYXk8YW55PjtcclxuICBASW5wdXQoKSBmaWVsZFJlc3RyaWN0aW9uV2l0aERpZmZlcmVudE5hbWU6IHN0cmluZztcclxuXHJcblxyXG4gIEBPdXRwdXQoKSByZW1vdmU6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIG5ldzogRXZlbnRFbWl0dGVyPG51bWJlcj47XHJcbiAgQE91dHB1dCgpIGFkZDogRXZlbnRFbWl0dGVyPGFueVtdPjtcclxuICBAT3V0cHV0KCkgZGlzY2FyZENoYW5nZXM6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIHNlbmRDaGFuZ2VzOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG4gIEBPdXRwdXQoKSBkdXBsaWNhdGU6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIGdldFNlbGVjdGVkUm93czogRXZlbnRFbWl0dGVyPGFueVtdPjtcclxuICBAT3V0cHV0KCkgZ2V0QWxsUm93czogRXZlbnRFbWl0dGVyPHtkYXRhOiBhbnlbXSwgZXZlbnQ6c3RyaW5nfT47XHJcbiAgQE91dHB1dCgpIGdldEFnR3JpZFN0YXRlOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG4gIEBPdXRwdXQoKSBncmlkTW9kaWZpZWQ6IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkaWFsb2c6IE1hdERpYWxvZyxcclxuICAgIHB1YmxpYyB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGVsUmVmOiBFbGVtZW50UmVmKSB7XHJcbiAgICB0aGlzLnRyYW5zbGF0ZSA9IHRyYW5zbGF0ZTtcclxuXHJcbiAgICB0aGlzLmZyYW1ld29ya0NvbXBvbmVudHMgPSB7XHJcbiAgICAgIGJ0bkVkaXRSZW5kZXJlckNvbXBvbmVudDogQnRuRWRpdFJlbmRlcmVkQ29tcG9uZW50LFxyXG4gICAgICBidG5DaGVja2JveFJlbmRlcmVyQ29tcG9uZW50OiBCdG5DaGVja2JveFJlbmRlcmVkQ29tcG9uZW50LFxyXG4gICAgICBidG5DaGVja2JveEZpbHRlckNvbXBvbmVudDogQnRuQ2hlY2tib3hGaWx0ZXJDb21wb25lbnRcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5jb21wb25lbnRzID0ge1xyXG4gICAgICBkYXRlUGlja2VyOiB0aGlzLmdldERhdGVQaWNrZXIoKVxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgdGhpcy5yZW1vdmUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLm5ldyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuYWRkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5kaXNjYXJkQ2hhbmdlcz0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5zZW5kQ2hhbmdlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuZ2V0U2VsZWN0ZWRSb3dzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5kdXBsaWNhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmdldEFsbFJvd3MgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmdyaWRNb2RpZmllZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuY2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuICAgIHRoaXMuZ3JpZE9wdGlvbnMgPSB7XHJcbiAgICAgIGRlZmF1bHRDb2xEZWY6IHtcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmbGV4OiAxLFxyXG4gICAgICAgIGZpbHRlcjogdHJ1ZSxcclxuICAgICAgICBlZGl0YWJsZTogIXRoaXMubm9uRWRpdGFibGUsXHJcbiAgICAgICAgc3VwcHJlc3NNZW51OiB0cnVlLFxyXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcclxuICAgICAgICBjZWxsU3R5bGU6IChwYXJhbXMpID0+IHtcclxuICAgICAgICAgIGlmKHBhcmFtcy52YWx1ZSAmJiBwYXJhbXMuY29sRGVmLmVkaXRhYmxlKXtcclxuICAgICAgICAgICAgaWYodGhpcy5jaGFuZ2VzTWFwLmhhcyhwYXJhbXMubm9kZS5pZCkgJiYgdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuaGFzKHBhcmFtcy5jb2xEZWYuZmllbGQpKXtcclxuICAgICAgICAgICAgICByZXR1cm4geydiYWNrZ3JvdW5kLWNvbG9yJzogJyNFOEYxREUnfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgIHJldHVybiB7J2JhY2tncm91bmQtY29sb3InOiAnd2hpdGUnfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7J2JhY2tncm91bmQtY29sb3InOiAnd2hpdGUnfTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9ICxcclxuICAgICAgfSxcclxuICAgICAgcm93U2VsZWN0aW9uOiAnbXVsdGlwbGUnLFxyXG4gICAgICBzaW5nbGVDbGlja0VkaXQ6IHRydWUsXHJcbiAgICAgIC8vIHN1cHByZXNzSG9yaXpvbnRhbFNjcm9sbDogdHJ1ZSxcclxuICAgICAgbG9jYWxlVGV4dEZ1bmM6IChrZXk6IHN0cmluZywgZGVmYXVsdFZhbHVlOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy50cmFuc2xhdGUuaW5zdGFudChrZXkpO1xyXG4gICAgICAgIHJldHVybiBkYXRhID09PSBrZXkgPyBkZWZhdWx0VmFsdWUgOiBkYXRhO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgfVxyXG5cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcblxyXG4gICAgaWYgKHRoaXMuZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50UmVmcmVzaFN1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5zb21lU3RhdHVzSGFzQ2hhbmdlZFRvRGVsZXRlPWZhbHNlO1xyXG4gICAgICAgIHRoaXMuY2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICAgICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMucmVkb0NvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudHMoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5ldmVudEdldFNlbGVjdGVkUm93c1N1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLl9ldmVudEdldFNlbGVjdGVkUm93c1N1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLmVtaXRTZWxlY3RlZFJvd3MoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5fZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uID0gdGhpcy5ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb24uc3Vic2NyaWJlKChldmVudDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbWl0QWxsUm93cyhldmVudCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmV2ZW50U2F2ZUFnR3JpZFN0YXRlU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50U2F2ZUFnR3JpZFN0YXRlU3Vic2NyaXB0aW9uID0gdGhpcy5ldmVudFNhdmVBZ0dyaWRTdGF0ZVN1YnNjcmlwdGlvbi5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2F2ZUFnR3JpZFN0YXRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmV2ZW50TW9kaWZ5U3RhdHVzT2ZTZWxlY3RlZENlbGxzKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50TW9kaWZ5U3RhdHVzT2ZTZWxlY3RlZENlbGxzID0gdGhpcy5ldmVudE1vZGlmeVN0YXR1c09mU2VsZWN0ZWRDZWxscy5zdWJzY3JpYmUoKHN0YXR1czogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgdGhpcy5tb2RpZnlTdGF0dXNTZWxlY3RlZChzdGF0dXMpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5ldmVudEFkZEl0ZW1zU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuZXZlbnRBZGRJdGVtc1N1YnNjcmlwdGlvbi5zdWJzY3JpYmUoXHJcbiAgICAgICAgKGl0ZW1zOiBhbnkpID0+IHtcclxuICAgICAgICAgIHRoaXMuYWRkSXRlbXMoaXRlbXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIGZpcnN0RGF0YVJlbmRlcmVkKCk6IHZvaWQge1xyXG4gICAgaWYgKGxvY2FsU3RvcmFnZS5hZ0dyaWRTdGF0ZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgbGV0IGFnR3JpZFN0YXRlID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuYWdHcmlkU3RhdGUpXHJcbiAgICAgIGlmIChhZ0dyaWRTdGF0ZS5pZEFnR3JpZCAhPSB1bmRlZmluZWQgJiYgYWdHcmlkU3RhdGUuaWRBZ0dyaWQgPT0gdGhpcy5pZCkge1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS5zZXRGaWx0ZXJNb2RlbChhZ0dyaWRTdGF0ZS5maWx0ZXJTdGF0ZSk7XHJcbiAgICAgICAgdGhpcy5ncmlkQ29sdW1uQXBpLnNldENvbHVtblN0YXRlKGFnR3JpZFN0YXRlLmNvbFN0YXRlKTtcclxuICAgICAgICB0aGlzLmdyaWRBcGkuc2V0U29ydE1vZGVsKGFnR3JpZFN0YXRlLnNvcnRTdGF0ZSk7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hWYWx1ZSA9IGFnR3JpZFN0YXRlLnZhbHVlU2VhcmNoR2VuZXJpYztcclxuICAgICAgICB0aGlzLnF1aWNrU2VhcmNoKCk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBZ0dyaWRTdGF0ZSgpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaWQgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBZ0dyaWRTdGF0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkdyaWRSZWFkeShwYXJhbXMpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnNpbmdsZVNlbGVjdGlvbikgeyB0aGlzLmdyaWRPcHRpb25zLnJvd1NlbGVjdGlvbiA9ICdzaW5nbGUnIH1cclxuICAgIC8vIGlmICh0aGlzLm5vbkVkaXRhYmxlKSB7dGhpcy5ncmlkT3B0aW9ucy5kZWZhdWx0Q29sRGVmLmVkaXRhYmxlID0gZmFsc2V9XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgIHRoaXMuZ3JpZEFwaSA9IHBhcmFtcy5hcGk7XHJcbiAgICB0aGlzLmdyaWRDb2x1bW5BcGkgPSBwYXJhbXMuY29sdW1uQXBpO1xyXG4gICAgZm9yIChjb25zdCBjb2wgb2YgdGhpcy5jb2x1bW5EZWZzKSB7XHJcbiAgICAgIGlmKCF0aGlzLnNvbWVDb2x1bW5Jc0VkaXRhYmxlICYmIGNvbC5lZGl0YWJsZSkgeyB0aGlzLnNvbWVDb2x1bW5Jc0VkaXRhYmxlID0gdHJ1ZX1cclxuICAgICAgaWYgKGNvbC5maWVsZCA9PT0gJ3N0YXR1cycpIHtcclxuICAgICAgICB0aGlzLnN0YXR1c0NvbHVtbiA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuZ2V0RWxlbWVudHMoKTtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuY29sdW1uRGVmcyk7XHJcbiAgICBpZiAodGhpcy5kZWZhdWx0Q29sdW1uU29ydGluZykge1xyXG4gICAgICBpZighQXJyYXkuaXNBcnJheSh0aGlzLmRlZmF1bHRDb2x1bW5Tb3J0aW5nKSlcclxuICAgICAge1xyXG4gICAgICAgIGNvbnN0IHNvcnRNb2RlbCA9IFtcclxuICAgICAgICAgIHsgY29sSWQ6IHRoaXMuZGVmYXVsdENvbHVtblNvcnRpbmcsIHNvcnQ6ICdhc2MnIH1cclxuICAgICAgICBdO1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS5zZXRTb3J0TW9kZWwoc29ydE1vZGVsKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNle1xyXG4gICAgICAgIGxldCBzb3J0TW9kZWwgPSBbXTtcclxuICAgICAgICB0aGlzLmRlZmF1bHRDb2x1bW5Tb3J0aW5nLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICBzb3J0TW9kZWwucHVzaCh7IGNvbElkOiBlbGVtZW50LCBzb3J0OiAnYXNjJyB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS5zZXRTb3J0TW9kZWwoc29ydE1vZGVsKTtcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIGlmKHRoaXMuZGVmYXVsdEhlaWdodCAhPSBudWxsICYmIHRoaXMuZGVmYXVsdEhlaWdodCAhPSB1bmRlZmluZWQpe1xyXG4gICAgICB0aGlzLmNoYW5nZUhlaWdodCh0aGlzLmRlZmF1bHRIZWlnaHQpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgZ2V0RGF0ZVBpY2tlcigpIHtcclxuICAgIGZ1bmN0aW9uIERhdGVwaWNrZXIoKSB7fVxyXG4gICAgRGF0ZXBpY2tlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgdGhpcy5lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICB0aGlzLmVJbnB1dC52YWx1ZSA9IHBhcmFtcy52YWx1ZTtcclxuICAgICAgdGhpcy5lSW5wdXQuY2xhc3NMaXN0LmFkZCgnYWctaW5wdXQnKTtcclxuICAgICAgdGhpcy5lSW5wdXQuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xyXG4gICAgICAkKHRoaXMuZUlucHV0KS5kYXRlcGlja2VyKHsgZGF0ZUZvcm1hdDogJ21tL2RkL3l5JyB9KTtcclxuICAgIH07XHJcbiAgICBEYXRlcGlja2VyLnByb3RvdHlwZS5nZXRHdWkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmVJbnB1dDtcclxuICAgIH07XHJcbiAgICBEYXRlcGlja2VyLnByb3RvdHlwZS5hZnRlckd1aUF0dGFjaGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLmVJbnB1dC5mb2N1cygpO1xyXG4gICAgICB0aGlzLmVJbnB1dC5zZWxlY3QoKTtcclxuICAgIH07XHJcbiAgICBEYXRlcGlja2VyLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZUlucHV0LnZhbHVlO1xyXG4gICAgfTtcclxuICAgIERhdGVwaWNrZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7fTtcclxuICAgIERhdGVwaWNrZXIucHJvdG90eXBlLmlzUG9wdXAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gRGF0ZXBpY2tlcjtcclxuICB9XHJcblxyXG4gIGFyZVJvd3NTZWxlY3RlZCgpOiBCb29sZWFuIHtcclxuICAgIHJldHVybiAodGhpcy5ncmlkQXBpICE9IG51bGwgJiYgdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKS5sZW5ndGggPiAwKT8gdHJ1ZTogZmFsc2U7XHJcbiAgICAvLyBpZiAodGhpcy5ncmlkQXBpICE9IG51bGwgJiYgdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKS5sZW5ndGggPiAwKSB7XHJcbiAgICAvLyAgIHJldHVybiB0cnVlXHJcbiAgICAvLyB9IGVsc2Uge1xyXG4gICAgLy8gICByZXR1cm4gZmFsc2VcclxuICAgIC8vIH1cclxuICB9XHJcblxyXG5cclxuICBlbWl0U2VsZWN0ZWRSb3dzKCk6IHZvaWQge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IHRoaXMuZ3JpZEFwaS5nZXRTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICBjb25zdCBzZWxlY3RlZERhdGEgPSBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IG5vZGUuZGF0YSk7XHJcbiAgICB0aGlzLmdldFNlbGVjdGVkUm93cy5lbWl0KHNlbGVjdGVkRGF0YSk7XHJcbiAgfVxyXG5cclxuICBlbWl0QWxsUm93cyhldmVudDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAvLyBsZXQgcm93RGF0YSA9IFtdO1xyXG4gICAgLy8gdGhpcy5ncmlkQXBpLmZvckVhY2hOb2RlKG5vZGUgPT4gcm93RGF0YS5wdXNoKG5vZGUuZGF0YSkpO1xyXG4gICAgdGhpcy5nZXRBbGxSb3dzLmVtaXQoe2RhdGE6IHRoaXMuZ2V0QWxsQ3VycmVudERhdGEoKSwgZXZlbnQ6IGV2ZW50fSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldEFsbEN1cnJlbnREYXRhKCk6IEFycmF5PGFueT57XHJcbiAgICBsZXQgcm93RGF0YSA9IFtdO1xyXG4gICAgdGhpcy5ncmlkQXBpLmZvckVhY2hOb2RlKG5vZGUgPT4gcm93RGF0YS5wdXNoKG5vZGUuZGF0YSkpO1xyXG4gICAgcmV0dXJuIHJvd0RhdGE7XHJcbiAgfVxyXG5cclxuICBtb2RpZnlTdGF0dXNTZWxlY3RlZChzdGF0dXM/OiBzdHJpbmcpOiB2b2lke1xyXG4gICAgbGV0IG5ld1N0YXR1cz1zdGF0dXM/c3RhdHVzOnRoaXMubmV3U3RhdHVzUmVnaXN0ZXI7XHJcbiAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKTtcclxuICAgIHNlbGVjdGVkTm9kZXMubWFwKG5vZGUgPT4ge1xyXG4gICAgICBub2RlLmRhdGEuc3RhdHVzPW5ld1N0YXR1cztcclxuICAgICAgbm9kZS5zZWxlY3RlZD1mYWxzZTtcclxuICAgIH0gKTtcclxuICAgIHRoaXMuZ3JpZEFwaS5yZWRyYXdSb3dzKCk7XHJcbiAgfVxyXG5cclxuICBzYXZlQWdHcmlkU3RhdGUoKTogdm9pZCB7XHJcbiAgICBsZXQgYWdHcmlkU3RhdGUgPSB7XHJcbiAgICAgIGlkQWdHcmlkOiB0aGlzLmlkLFxyXG4gICAgICBjb2xTdGF0ZTogdGhpcy5ncmlkQ29sdW1uQXBpLmdldENvbHVtblN0YXRlKCksXHJcbiAgICAgIGZpbHRlclN0YXRlOiB0aGlzLmdyaWRBcGkuZ2V0RmlsdGVyTW9kZWwoKSxcclxuICAgICAgc29ydFN0YXRlOiB0aGlzLmdyaWRBcGkuZ2V0U29ydE1vZGVsKCksXHJcbiAgICAgIHZhbHVlU2VhcmNoR2VuZXJpYzogdGhpcy5zZWFyY2hWYWx1ZVxyXG4gICAgfTtcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFnR3JpZFN0YXRlXCIsIEpTT04uc3RyaW5naWZ5KGFnR3JpZFN0YXRlKSk7XHJcblxyXG4gIH1cclxuICByZW1vdmVBZ0dyaWRTdGF0ZSgpOiB2b2lkIHtcclxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWdHcmlkU3RhdGVcIilcclxuICB9XHJcblxyXG4gIGdldENvbHVtbktleXNBbmRIZWFkZXJzKGNvbHVtbmtleXM6IEFycmF5PGFueT4pOiBTdHJpbmcge1xyXG4gICAgbGV0IGhlYWRlcjogQXJyYXk8YW55PiA9IFtdO1xyXG4gICAgaWYgKHRoaXMuY29sdW1uRGVmcy5sZW5ndGggPT0gMCkgeyByZXR1cm4gJycgfTtcclxuXHJcbiAgICBsZXQgYWxsQ29sdW1uS2V5cyA9IHRoaXMuZ3JpZE9wdGlvbnMuY29sdW1uQXBpLmdldEFsbERpc3BsYXllZENvbHVtbnMoKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKGFsbENvbHVtbktleXMpO1xyXG4gICAgYWxsQ29sdW1uS2V5cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICBpZiAoZWxlbWVudC51c2VyUHJvdmlkZWRDb2xEZWYuaGVhZGVyTmFtZSAhPT0gJycpIHtcclxuICAgICAgICBjb2x1bW5rZXlzLnB1c2goZWxlbWVudC51c2VyUHJvdmlkZWRDb2xEZWYuZmllbGQpO1xyXG4gICAgICAgIGhlYWRlci5wdXNoKGVsZW1lbnQudXNlclByb3ZpZGVkQ29sRGVmLmhlYWRlck5hbWUpO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBoZWFkZXIuam9pbihcIixcIik7XHJcbiAgfVxyXG5cclxuXHJcbiAgZXhwb3J0RGF0YSgpOiB2b2lkIHtcclxuICAgIGxldCBjb2x1bW5rZXlzOiBBcnJheTxhbnk+ID0gW107XHJcbiAgICBsZXQgY3VzdG9tSGVhZGVyOiBTdHJpbmcgPSAnJztcclxuICAgIGN1c3RvbUhlYWRlciA9IHRoaXMuZ2V0Q29sdW1uS2V5c0FuZEhlYWRlcnMoY29sdW1ua2V5cylcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgIG9ubHlTZWxlY3RlZDogdHJ1ZSxcclxuICAgICAgY29sdW1uS2V5czogY29sdW1ua2V5cyxcclxuICAgICAgY3VzdG9tSGVhZGVyOiBjdXN0b21IZWFkZXIsXHJcbiAgICAgIHNraXBIZWFkZXI6IHRydWVcclxuICAgIH07XHJcbiAgICB0aGlzLmdyaWRBcGkuZXhwb3J0RGF0YUFzQ3N2KHBhcmFtcyk7XHJcbiAgfVxyXG5cclxuICBxdWlja1NlYXJjaCgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zZXRRdWlja0ZpbHRlcih0aGlzLnNlYXJjaFZhbHVlKTtcclxuICB9XHJcblxyXG4gIGdldEVsZW1lbnRzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5nZXRBbGwoKVxyXG4gICAgICAuc3Vic2NyaWJlKChpdGVtcykgPT4ge1xyXG4gICAgICAgIGxldCBzdGF0dXMgPSB0aGlzLmFsbE5ld0VsZW1lbnRzPydwZW5kaW5nQ3JlYXRpb24nOidzdGF0dXNPSydcclxuICAgICAgICBsZXQgbmV3SXRlbXMgPSBbXTtcclxuICAgICAgICBsZXQgY29uZGl0aW9uID0gKHRoaXMuYWRkRmllbGRSZXN0cmljdGlvbik/IHRoaXMuYWRkRmllbGRSZXN0cmljdGlvbjogJ2lkJztcclxuICAgICAgICBpdGVtcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgaWYodGhpcy5zdGF0dXNDb2x1bW4pe1xyXG4gICAgICAgICAgICBpZihlbGVtZW50LnN0YXR1cyAhPSBcIm5vdEF2YWlsYWJsZVwiICYmIGVsZW1lbnQuc3RhdHVzICE9IFwicGVuZGluZ0NyZWF0aW9uXCIgJiYgZWxlbWVudC5zdGF0dXMgIT0gXCJwZW5kaW5nUmVnaXN0cmF0aW9uXCIgJiYgZWxlbWVudC5zdGF0dXMgIT0gXCJ1bnJlZ2lzdGVyZWRMYXllclwiKXtcclxuICAgICAgICAgICAgICBlbGVtZW50LnN0YXR1cz1zdGF0dXNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih0aGlzLmFsbE5ld0VsZW1lbnRzKSB7IGVsZW1lbnQubmV3ID0gdHJ1ZTsgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYodGhpcy5jdXJyZW50RGF0YSl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrRWxlbWVudEFsbG93ZWRUb0FkZChjb25kaXRpb24sZWxlbWVudCwgdGhpcy5jdXJyZW50RGF0YSkpIHtcclxuICAgICAgICAgICAgICAgIG5ld0l0ZW1zLnB1c2goZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBpZih0aGlzLnN0YXR1c0NvbHVtbil7XHJcbiAgICAgICAgLy8gICBsZXQgc3RhdHVzID0gdGhpcy5hbGxOZXdFbGVtZW50cz8ncGVuZGluZ0NyZWF0aW9uJzonc3RhdHVzT0snXHJcbiAgICAgICAgLy8gICBpdGVtcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgIC8vICAgICBpZihlbGVtZW50LnN0YXR1cyAhPSBcIm5vdEF2YWlsYWJsZVwiICYmIGVsZW1lbnQuc3RhdHVzICE9IFwicGVuZGluZ0NyZWF0aW9uXCIgJiYgZWxlbWVudC5zdGF0dXMgIT0gXCJwZW5kaW5nUmVnaXN0cmF0aW9uXCIgJiYgZWxlbWVudC5zdGF0dXMgIT0gXCJ1bnJlZ2lzdGVyZWRMYXllclwiKXtcclxuICAgICAgICAvLyAgICAgICBlbGVtZW50LnN0YXR1cz1zdGF0dXNcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vICAgICBpZih0aGlzLmFsbE5ld0VsZW1lbnRzKSB7IGVsZW1lbnQubmV3ID0gdHJ1ZTsgfVxyXG4gICAgICAgIC8vICAgfSk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIHRoaXMucm93RGF0YSA9IHRoaXMuY3VycmVudERhdGE/bmV3SXRlbXM6IGl0ZW1zO1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS5zZXRSb3dEYXRhKHRoaXMucm93RGF0YSk7XHJcbiAgICAgICAgdGhpcy5zZXRTaXplKClcclxuICAgICAgICAvLyB0aGlzLmdyaWRBcGkuc2l6ZUNvbHVtbnNUb0ZpdCgpXHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5yb3dEYXRhKTtcclxuXHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0U2l6ZSgpIHtcclxuXHJcbiAgICB2YXIgYWxsQ29sdW1uSWRzID0gW107XHJcbiAgICBsZXQgY29sdW1ucyA9IHRoaXMuZ3JpZE9wdGlvbnMuY29sdW1uQXBpLmdldEFsbENvbHVtbnMoKTtcclxuICAgIGNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbiAoY29sdW1uKSB7XHJcbiAgICAgIGFsbENvbHVtbklkcy5wdXNoKGNvbHVtbi5jb2xJZCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmdyaWRPcHRpb25zLmNvbHVtbkFwaS5hdXRvU2l6ZUNvbHVtbnMoYWxsQ29sdW1uSWRzKTtcclxuXHJcbiAgICBsZXQgZ3JpZCA9IHRoaXMuZ3JpZE9wdGlvbnMuYXBpXHJcbiAgICBsZXQgYXZhaWxhYmxlV2lkdGggPSBncmlkLmdyaWRQYW5lbC5lQm9keVZpZXdwb3J0LmNsaWVudFdpZHRoO1xyXG5cclxuICAgIGxldCB1c2VkV2lkdGggPSBncmlkLmdyaWRQYW5lbC5jb2x1bW5Db250cm9sbGVyLmdldFdpZHRoT2ZDb2xzSW5MaXN0KGNvbHVtbnMpO1xyXG5cclxuICAgIGlmICh1c2VkV2lkdGggPCBhdmFpbGFibGVXaWR0aCkge1xyXG4gICAgICBncmlkLnNpemVDb2x1bW5zVG9GaXQoKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBhZGRJdGVtcyhuZXdJdGVtczogYW55W10pOiB2b2lkIHtcclxuICAgIGNvbnNvbGUubG9nKG5ld0l0ZW1zKTtcclxuICAgIGxldCBpdGVtc1RvQWRkOiBBcnJheTxhbnk+ID0gW107XHJcbiAgICBsZXQgY29uZGl0aW9uID0gKHRoaXMuYWRkRmllbGRSZXN0cmljdGlvbik/IHRoaXMuYWRkRmllbGRSZXN0cmljdGlvbjogJ2lkJztcclxuICAgIFxyXG5cclxuICAgIG5ld0l0ZW1zLmZvckVhY2goaXRlbSA9PiB7XHJcblxyXG4gICAgICBpZiAodGhpcy5jaGVja0VsZW1lbnRBbGxvd2VkVG9BZGQoY29uZGl0aW9uLGl0ZW0sIHRoaXMucm93RGF0YSkpIHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0dXNDb2x1bW4pIHtcclxuICAgICAgICAgIGl0ZW0uc3RhdHVzID0gJ3BlbmRpbmdDcmVhdGlvbidcclxuICAgICAgICAgIGl0ZW0ubmV3SXRlbSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGl0ZW1zVG9BZGQucHVzaChpdGVtKTtcclxuICAgICAgICB0aGlzLnJvd0RhdGEucHVzaChpdGVtKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgSXRlbSBhbHJlYWR5IGV4aXN0c2ApXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgdGhpcy5ncmlkQXBpLnVwZGF0ZVJvd0RhdGEoeyBhZGQ6IGl0ZW1zVG9BZGQgfSk7XHJcblxyXG4gICAgY29uc29sZS5sb2codGhpcy5jb2x1bW5EZWZzKTtcclxuICAgIC8vIHBhcmFtcy5vbGRWYWx1ZSE9dW5kZWZpbmVkXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNoZWNrRWxlbWVudEFsbG93ZWRUb0FkZChjb25kaXRpb24sIGl0ZW0sIGRhdGEpe1xyXG5cclxuICAgIGxldCBmaW5hbEFkZGl0aW9uID0gdHJ1ZTtcclxuXHJcbiAgICBpZihBcnJheS5pc0FycmF5KGNvbmRpdGlvbikpe1xyXG5cclxuICAgICAgZm9yKGxldCBlbGVtZW50IG9mIGRhdGEpe1xyXG4gICAgICAgIGxldCBjYW5BZGQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBjdXJyZW50Q29uZGl0aW9uIG9mIGNvbmRpdGlvbil7XHJcbiAgICAgICAgICBpZihlbGVtZW50W2N1cnJlbnRDb25kaXRpb25dICE9IGl0ZW1bY3VycmVudENvbmRpdGlvbl0pe1xyXG4gICAgICAgICAgICBjYW5BZGQgPSB0cnVlO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIWNhbkFkZCkge1xyXG4gICAgICAgICAgIGZpbmFsQWRkaXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZmluYWxBZGRpdGlvbjtcclxuXHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBpZih0aGlzLmZpZWxkUmVzdHJpY3Rpb25XaXRoRGlmZmVyZW50TmFtZSl7XHJcbiAgICAgICAgcmV0dXJuIChpdGVtW2NvbmRpdGlvbl0gPT0gdW5kZWZpbmVkIHx8IChkYXRhLmZpbmQoZWxlbWVudCA9PiBlbGVtZW50W3RoaXMuZmllbGRSZXN0cmljdGlvbldpdGhEaWZmZXJlbnROYW1lXSA9PSBpdGVtW2NvbmRpdGlvbl0pKSA9PSB1bmRlZmluZWQpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIChpdGVtW2NvbmRpdGlvbl0gPT0gdW5kZWZpbmVkIHx8IChkYXRhLmZpbmQoZWxlbWVudCA9PiBlbGVtZW50W2NvbmRpdGlvbl0gPT0gaXRlbVtjb25kaXRpb25dKSkgPT0gdW5kZWZpbmVkKVxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG5cclxuICBjaGFuZ2VIZWlnaHQodmFsdWUpIHtcclxuICAgIGxldCBwaXhlbHMgPSBcIlwiO1xyXG4gICAgaWYgKHZhbHVlID09PSAnNScpIHtcclxuICAgICAgcGl4ZWxzID0gXCIyMDBweFwiXHJcbiAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnMTAnKSB7XHJcbiAgICAgIHBpeGVscyA9IFwiMzE1cHhcIlxyXG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJzIwJykge1xyXG4gICAgICBwaXhlbHMgPSBcIjYzMHB4XCJcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHBpeGVscyA9IFwiMTU1MHB4XCJcclxuICAgIH1cclxuICAgIHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LnN0eWxlLmhlaWdodCA9IHBpeGVscztcclxuICB9XHJcblxyXG4gIHJlbW92ZURhdGEoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IHRoaXMuZ3JpZEFwaS5nZXRTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICBjb25zdCBzZWxlY3RlZERhdGEgPSBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IG5vZGUuZGF0YSk7XHJcbiAgICB0aGlzLnJlbW92ZS5lbWl0KHNlbGVjdGVkRGF0YSk7XHJcblxyXG4gICAgaWYgKHRoaXMuc3RhdHVzQ29sdW1uKSB7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGVkUm93cyA9IHNlbGVjdGVkTm9kZXMubWFwKG5vZGUgPT4gbm9kZS5pZCk7XHJcbiAgICAgIGlmKHNlbGVjdGVkUm93cy5sZW5ndGg+MCkge3RoaXMuc29tZVN0YXR1c0hhc0NoYW5nZWRUb0RlbGV0ZT10cnVlO31cclxuICAgICAgZm9yIChjb25zdCBpZCBvZiBzZWxlY3RlZFJvd3MpIHtcclxuICAgICAgICB0aGlzLmdyaWRBcGkuZ2V0Um93Tm9kZShpZCkuZGF0YS5zdGF0dXMgPSAncGVuZGluZ0RlbGV0ZSc7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5ncmlkT3B0aW9ucy5hcGkucmVmcmVzaENlbGxzKCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmdyaWRPcHRpb25zLmFwaS5kZXNlbGVjdEFsbCgpO1xyXG4gIH1cclxuXHJcbiAgbmV3RGF0YSgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICB0aGlzLm5ldy5lbWl0KC0xKTtcclxuICB9XHJcblxyXG4gIG9uQWRkQnV0dG9uQ2xpY2tlZCgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICB0aGlzLmFkZC5lbWl0KHRoaXMuZ2V0QWxsQ3VycmVudERhdGEoKSk7XHJcbiAgfVxyXG5cclxuICBvbkR1cGxpY2F0ZUJ1dHRvbkNsaWNrZWQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgaWYgKHRoaXMuY2hhbmdlQ291bnRlciA+IDApIHtcclxuICAgICAgY29uc3QgZGlhbG9nUmVmID0gdGhpcy5kaWFsb2cub3BlbihEaWFsb2dNZXNzYWdlQ29tcG9uZW50KTtcclxuICAgICAgZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLnRpdGxlID0gdGhpcy50cmFuc2xhdGUuaW5zdGFudCgnY2F1dGlvbicpXHJcbiAgICAgIGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5tZXNzYWdlID0gdGhpcy50cmFuc2xhdGUuaW5zdGFudCgnZHVwbGljYXRlTWVzc2FnZScpXHJcbiAgICAgIGRpYWxvZ1JlZi5hZnRlckNsb3NlZCgpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgIGlmIChyZXN1bHQuZXZlbnQgPT09ICdBY2NlcHQnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSB0aGlzLmdyaWRBcGkuZ2V0U2VsZWN0ZWROb2RlcygpO1xyXG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZERhdGEgPSBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IG5vZGUuZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuZHVwbGljYXRlLmVtaXQoc2VsZWN0ZWREYXRhKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKTtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWREYXRhID0gc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiBub2RlLmRhdGEpO1xyXG4gICAgICB0aGlzLmR1cGxpY2F0ZS5lbWl0KHNlbGVjdGVkRGF0YSk7XHJcbiAgICAgIHRoaXMuZ3JpZE9wdGlvbnMuYXBpLmRlc2VsZWN0QWxsKCk7XHJcblxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIGFwcGx5Q2hhbmdlcygpOiB2b2lkIHtcclxuICAgIGNvbnN0IGl0ZW1zQ2hhbmdlZDogYW55W10gPSBbXTtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBvZiB0aGlzLmNoYW5nZXNNYXAua2V5cygpKSB7XHJcbiAgICAgIGl0ZW1zQ2hhbmdlZC5wdXNoKHRoaXMuZ3JpZEFwaS5nZXRSb3dOb2RlKGtleSkuZGF0YSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnNlbmRDaGFuZ2VzLmVtaXQoaXRlbXNDaGFuZ2VkKTtcclxuICAgIHRoaXMuZ3JpZE1vZGlmaWVkLmVtaXQoZmFsc2UpO1xyXG4gICAgdGhpcy5jaGFuZ2VzTWFwLmNsZWFyKCk7XHJcbiAgICB0aGlzLmNoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5yZWRvQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnNvbWVTdGF0dXNIYXNDaGFuZ2VkVG9EZWxldGU9ZmFsc2U7XHJcbiAgICAvLyB0aGlzLnBhcmFtcy5jb2xEZWYuY2VsbFN0eWxlID0geyBiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGRkZGJyB9O1xyXG4gICAgdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3MoKTtcclxuICB9XHJcblxyXG5cclxuXHJcbiAgZGVsZXRlQ2hhbmdlcygpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICBsZXQgbmV3RWxlbWVudHNBY3RpdmVkPSB0aGlzLmFsbE5ld0VsZW1lbnRzO1xyXG5cclxuICAgIHdoaWxlICh0aGlzLmNoYW5nZUNvdW50ZXIgPiAwKSB7XHJcbiAgICAgIHRoaXMudW5kbygpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY2hhbmdlc01hcC5jbGVhcigpO1xyXG4gICAgLy90aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuXHJcbiAgICBpZih0aGlzLnN0YXR1c0NvbHVtbiAmJiAhdGhpcy5kaXNjYXJkTm9uUmV2ZXJzZVN0YXR1cylcclxuICAgIHtcclxuICAgICAgbGV0IHJvd3NXaXRoU3RhdHVzTW9kaWZpZWQgPSBbXTtcclxuICAgICAgdGhpcy5ncmlkQXBpLmZvckVhY2hOb2RlKGZ1bmN0aW9uKG5vZGUpIHsgXHJcbiAgICAgICAgaWYobm9kZS5kYXRhLnN0YXR1cyA9PT0gJ3BlbmRpbmdNb2RpZnknIHx8IG5vZGUuZGF0YS5zdGF0dXMgPT09ICdwZW5kaW5nRGVsZXRlJykge1xyXG4gICAgICAgICAgaWYobm9kZS5kYXRhLnN0YXR1cyA9PT0gJ3BlbmRpbmdEZWxldGUnKXtcclxuICAgICAgICAgICAgcm93c1dpdGhTdGF0dXNNb2RpZmllZC5wdXNoKG5vZGUuZGF0YSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZihub2RlLmRhdGEubmV3SXRlbSB8fCBuZXdFbGVtZW50c0FjdGl2ZWQpe1xyXG4gICAgICAgICAgICBub2RlLmRhdGEuc3RhdHVzPSdwZW5kaW5nQ3JlYXRpb24nXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBub2RlLmRhdGEuc3RhdHVzPSdzdGF0dXNPSydcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc29tZVN0YXR1c0hhc0NoYW5nZWRUb0RlbGV0ZT1mYWxzZTtcclxuICAgIHRoaXMuZGlzY2FyZENoYW5nZXMuZW1pdChyb3dzV2l0aFN0YXR1c01vZGlmaWVkKTtcclxuICAgIHRoaXMuZ3JpZE1vZGlmaWVkLmVtaXQoZmFsc2UpO1xyXG4gIH1cclxuICB0aGlzLmdyaWRBcGkucmVkcmF3Um93cygpO1xyXG5cclxuICAgIC8vdGhpcy5wYXJhbXMuY29sRGVmLmNlbGxTdHlsZSA9ICB7YmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRid9O1xyXG4gICAgLy90aGlzLmdyaWRBcGkucmVkcmF3Um93cygpO1xyXG4gIH1cclxuXHJcblxyXG4gIG9uRmlsdGVyTW9kaWZpZWQoKTogdm9pZCB7XHJcblxyXG4gICAgdGhpcy5kZWxldGVDaGFuZ2VzKCk7XHJcblxyXG4gIH1cclxuXHJcblxyXG4gIHVuZG8oKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgdGhpcy5ncmlkQXBpLnVuZG9DZWxsRWRpdGluZygpO1xyXG4gICAgdGhpcy5jaGFuZ2VDb3VudGVyIC09IDE7XHJcbiAgICBpZih0aGlzLmNoYW5nZUNvdW50ZXIgPT0gMCkgeyB0aGlzLmdyaWRNb2RpZmllZC5lbWl0KGZhbHNlKX1cclxuICAgIHRoaXMucmVkb0NvdW50ZXIgKz0gMTtcclxuICB9XHJcblxyXG4gIHJlZG8oKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgdGhpcy5ncmlkQXBpLnJlZG9DZWxsRWRpdGluZygpO1xyXG4gICAgdGhpcy5jaGFuZ2VDb3VudGVyICs9IDE7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyIC09IDE7XHJcbiAgfVxyXG5cclxuXHJcbiAgb25DZWxsRWRpdGluZ1N0b3BwZWQoZSkge1xyXG4gICAgaWYgKHRoaXMubW9kaWZpY2F0aW9uQ2hhbmdlKSB7XHJcbiAgICAgIHRoaXMuY2hhbmdlQ291bnRlcisrO1xyXG4gICAgICBpZih0aGlzLmNoYW5nZUNvdW50ZXIgPT0gMSkgeyB0aGlzLmdyaWRNb2RpZmllZC5lbWl0KHRydWUpfVxyXG4gICAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuICAgICAgdGhpcy5vbkNlbGxWYWx1ZUNoYW5nZWQoZSk7XHJcbiAgICAgIHRoaXMubW9kaWZpY2F0aW9uQ2hhbmdlID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgb25DZWxsVmFsdWVDaGFuZ2VkKHBhcmFtcyk6IHZvaWQge1xyXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcbiAgICBpZiAodGhpcy5jaGFuZ2VDb3VudGVyID4gdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIpXHJcbiAgICAvLyBUcnVlIGlmIHdlIGhhdmUgZWRpdGVkIHNvbWUgY2VsbCBvciB3ZSBoYXZlIGRvbmUgYSByZWRvIFxyXG4gICAge1xyXG5cclxuICAgICAgaWYgKHBhcmFtcy5vbGRWYWx1ZSAhPT0gcGFyYW1zLnZhbHVlICYmICEocGFyYW1zLm9sZFZhbHVlID09IG51bGwgJiYgcGFyYW1zLnZhbHVlID09PSAnJykpIHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmNoYW5nZXNNYXAuaGFzKHBhcmFtcy5ub2RlLmlkKSkgLy8gSWYgaXQncyBmaXJ0cyBlZGl0IG9mIGEgY2VsbCwgd2UgYWRkIGl0IHRvIHRoZSBtYXAgYW5kIHdlIHBhaW50IGl0XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgY29uc3QgYWRkTWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcclxuICAgICAgICAgIGFkZE1hcC5zZXQocGFyYW1zLmNvbERlZi5maWVsZCwgMSlcclxuICAgICAgICAgIHRoaXMuY2hhbmdlc01hcC5zZXQocGFyYW1zLm5vZGUuaWQsIGFkZE1hcCk7XHJcbiAgICAgICAgICBpZiAodGhpcy5zdGF0dXNDb2x1bW4pIHtcclxuICAgICAgICAgICAgLy8gaWYgKHRoaXMuZ3JpZEFwaS5nZXRSb3dOb2RlKHBhcmFtcy5ub2RlLmlkKS5kYXRhLnN0YXR1cyAhPT0gJ3BlbmRpbmdDcmVhdGlvbicpIHtcclxuICAgICAgICAgICAgICB0aGlzLmdyaWRBcGkuZ2V0Um93Tm9kZShwYXJhbXMubm9kZS5pZCkuZGF0YS5zdGF0dXMgPSAncGVuZGluZ01vZGlmeSdcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGlmICghdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuaGFzKHBhcmFtcy5jb2xEZWYuZmllbGQpKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5zZXQocGFyYW1zLmNvbERlZi5maWVsZCwgMSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFdlIGFscmVhZHkgaGFkIGVkaXRlZCB0aGlzIGNlbGwsIHNvIHdlIG9ubHkgaW5jcmVtZW50IG51bWJlciBvZiBjaGFuZ2VzIG9mIGl0IG9uIHRoZSBtYXAgXHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDaGFuZ2VzID0gdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuZ2V0KHBhcmFtcy5jb2xEZWYuZmllbGQpO1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5zZXQocGFyYW1zLmNvbERlZi5maWVsZCwgKGN1cnJlbnRDaGFuZ2VzICsgMSkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wYWludENlbGxzKHBhcmFtcywgdGhpcy5jaGFuZ2VzTWFwKTsgLy9XZSBwYWludCB0aGUgcm93IG9mIHRoZSBlZGl0ZWQgY2VsbCBcclxuICAgICAgICB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlcisrOyAvL1dlIG1hdGNoIHRoZSBjdXJyZW50IHByZXZpb3VzQ2hhbmdlQ291bnRlciB3aXRoIGNoYW5nZUNvdW50ZXJcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHRoaXMuY2hhbmdlQ291bnRlciA8IHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyKSB7IC8vIFRydWUgaWYgd2UgaGF2ZSBkb25lIGFuIHVuZG9cclxuICAgICAgbGV0IGN1cnJlbnRDaGFuZ2VzID0gLTE7XHJcbiAgICAgIGlmICh0aGlzLmNoYW5nZXNNYXAuaGFzKHBhcmFtcy5ub2RlLmlkKSkgeyBjdXJyZW50Q2hhbmdlcyA9IHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmdldChwYXJhbXMuY29sRGVmLmZpZWxkKTsgfVxyXG5cclxuICAgICAgaWYgKGN1cnJlbnRDaGFuZ2VzID09PSAxKSB7IC8vT25jZSB0aGUgdW5kbyBpdCdzIGRvbmUsIGNlbGwgaXMgaW4gaGlzIGluaXRpYWwgc3RhdHVzXHJcblxyXG4gICAgICAgIHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmRlbGV0ZShwYXJhbXMuY29sRGVmLmZpZWxkKTtcclxuICAgICAgICBpZiAodGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuc2l6ZSA9PT0gMCkgeyAvLyBObyBtb3JlIG1vZGlmaWNhdGlvbnMgaW4gdGhpcyByb3dcclxuICAgICAgICAgIHRoaXMuY2hhbmdlc01hcC5kZWxldGUocGFyYW1zLm5vZGUuaWQpO1xyXG4gICAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5ncmlkQXBpLmdldERpc3BsYXllZFJvd0F0SW5kZXgocGFyYW1zLnJvd0luZGV4KTtcclxuICAgICAgICAgIGlmICh0aGlzLnN0YXR1c0NvbHVtbikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ncmlkQXBpLmdldFJvd05vZGUocGFyYW1zLm5vZGUuaWQpLmRhdGEuc3RhdHVzICE9PSAncGVuZGluZ0NyZWF0aW9uJykge1xyXG4gICAgICAgICAgICAgIHRoaXMuZ3JpZEFwaS5nZXRSb3dOb2RlKHBhcmFtcy5ub2RlLmlkKS5kYXRhLnN0YXR1cyA9J3N0YXR1c09LJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgLy8gV2UgcGFpbnQgaXQgd2hpdGVcclxuICAgICAgICAgIHRoaXMuZ3JpZEFwaS5yZWRyYXdSb3dzKHsgcm93Tm9kZXM6IFtyb3ddIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnBhaW50Q2VsbHMocGFyYW1zLCB0aGlzLmNoYW5nZXNNYXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAoY3VycmVudENoYW5nZXMgPiAxKSAvLyBUaGUgY2VsbCBpc24ndCBpbiBoaXMgaW5pdGlhbCBzdGF0ZSB5ZXRcclxuICAgICAgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vV2UgY2FuJ3QgZG8gZWxzZSBiZWNhdXNlIHdlIGNhbiBiZSBkb2luZyBhbiB1bmRvIHdpdGhvdXQgY2hhbmdlcyBcclxuICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5zZXQocGFyYW1zLmNvbERlZi5maWVsZCwgKGN1cnJlbnRDaGFuZ2VzIC0gMSkpO1xyXG5cclxuICAgICAgICB0aGlzLnBhaW50Q2VsbHMocGFyYW1zLCB0aGlzLmNoYW5nZXNNYXApOy8vTm90IGluaXRpYWwgc3RhdGUgLT4gZ3JlZW4gYmFja2dyb3VuZFxyXG5cclxuICAgICAgfVxyXG4gICAgICB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlci0tOyAgLy9XZSBkZWNyZW1lbnQgcHJldmlvdXNDaGFuZ2VDb3VudGVyIGJlY2F1c2Ugd2UgaGF2ZSBkb25lIHVuZG9cclxuICAgIH1cclxuICAgIGVsc2UgeyAvLyBDb250cm9sIG9mIG1vZGlmaWNhdGlvbnMgd2l0aG91dCBjaGFuZ2VzXHJcbiAgICAgIGlmICghKHBhcmFtcy5vbGRWYWx1ZSA9PSBudWxsICYmIHBhcmFtcy52YWx1ZSA9PT0gJycpKSB7XHJcbiAgICAgICAgbGV0IG5ld1ZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgaWYgKHBhcmFtcy52YWx1ZSA9PSBudWxsKSB7IG5ld1ZhbHVlID0gJycgfVxyXG4gICAgICAgIGVsc2UgeyBuZXdWYWx1ZSA9IHBhcmFtcy52YWx1ZS50b1N0cmluZygpIH1cclxuXHJcbiAgICAgICAgaWYgKChwYXJhbXMub2xkVmFsdWUgIT0gdW5kZWZpbmVkICYmIHBhcmFtcy5vbGRWYWx1ZSAhPSBudWxsICYmIHBhcmFtcy5vbGRWYWx1ZS50b1N0cmluZygpICE9PSBuZXdWYWx1ZS50b1N0cmluZygpKVxyXG4gICAgICAgICAgfHwgKChwYXJhbXMub2xkVmFsdWUgPT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5vbGRWYWx1ZSA9PSBudWxsKSAmJiBuZXdWYWx1ZSAhPSBudWxsKSkge1xyXG5cclxuICAgICAgICAgIHRoaXMubW9kaWZpY2F0aW9uQ2hhbmdlID0gdHJ1ZTtcclxuICAgICAgICAgIGlmIChwYXJhbXMuY29sRGVmLmNlbGxSZW5kZXJlciA9PSBcImJ0bkNoZWNrYm94UmVuZGVyZXJDb21wb25lbnRcIikge1xyXG4gICAgICAgICAgICB2YXIgdW5kb1JlZG9BY3Rpb25zID0ge1xyXG4gICAgICAgICAgICAgIGNlbGxWYWx1ZUNoYW5nZXM6IHRoaXMuZ3JpZEFwaS51bmRvUmVkb1NlcnZpY2UuY2VsbFZhbHVlQ2hhbmdlc1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLmdyaWRBcGkudW5kb1JlZG9TZXJ2aWNlLnB1c2hBY3Rpb25zVG9VbmRvU3RhY2sodW5kb1JlZG9BY3Rpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5ncmlkQXBpLnVuZG9SZWRvU2VydmljZS5pc0ZpbGxpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5vbkNlbGxFZGl0aW5nU3RvcHBlZChwYXJhbXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgdGhpcy5tb2RpZmljYXRpb25XaXRob3V0Q2hhbmdlcyhwYXJhbXMpIH1cclxuXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7IHRoaXMubW9kaWZpY2F0aW9uV2l0aG91dENoYW5nZXMocGFyYW1zKSB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBtb2RpZmljYXRpb25XaXRob3V0Q2hhbmdlcyhwYXJhbXM6IGFueSkge1xyXG5cclxuICAgIGlmICh0aGlzLmNoYW5nZXNNYXAuaGFzKHBhcmFtcy5ub2RlLmlkKSkgLy9Nb2RpZmljYXRpb24gd2l0aG91dCBjaGFuZ2VzIGluIGVuIGVkaXRlZCBjZWxsXHJcbiAgICB7XHJcbiAgICAgIGlmICghdGhpcy51bmRvTm9DaGFuZ2VzKSB7XHJcbiAgICAgICAgdGhpcy5ncmlkQXBpLnVuZG9DZWxsRWRpdGluZygpOyAvLyBVbmRvIHRvIGRlbGV0ZSB0aGUgY2hhbmdlIHdpdGhvdXQgY2hhbmdlcyBpbnRlcm5hbGx5IFxyXG4gICAgICAgIHRoaXMudW5kb05vQ2hhbmdlcyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5wYWludENlbGxzKHBhcmFtcywgdGhpcy5jaGFuZ2VzTWFwKTsgIC8vVGhlIGNlbGwgaGFzIG1vZGlmaWNhdGlvbnMgeWV0IC0+IGdyZWVuIGJhY2tncm91bmQgXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7IHRoaXMudW5kb05vQ2hhbmdlcyA9IGZhbHNlOyB9XHJcblxyXG5cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAvL1dpdGggdGhlIGludGVybmFsbHkgdW5kbyB3aWxsIGVudGVyIGF0IHRoaXMgZnVuY3Rpb24sIHNvIHdlIGhhdmUgdG8gY29udHJvbCB3aGVuIGRvbmUgdGhlIHVuZG8gb3Igbm90IFxyXG4gICAgICBpZiAoIXRoaXMudW5kb05vQ2hhbmdlcykge1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS51bmRvQ2VsbEVkaXRpbmcoKTsgLy8gVW5kbyB0byBkZWxldGUgdGhlIGNoYW5nZSBpbnRlcm5hbGx5XHJcbiAgICAgICAgdGhpcy51bmRvTm9DaGFuZ2VzID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHsgdGhpcy51bmRvTm9DaGFuZ2VzID0gZmFsc2U7IH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBnZXRDb2x1bW5JbmRleEJ5Q29sSWQoYXBpOiBDb2x1bW5BcGksIGNvbElkOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIGFwaS5nZXRBbGxDb2x1bW5zKCkuZmluZEluZGV4KGNvbCA9PiBjb2wuZ2V0Q29sSWQoKSA9PT0gY29sSWQpO1xyXG4gIH1cclxuICBwYWludENlbGxzKHBhcmFtczogYW55LCBjaGFuZ2VzTWFwOiBNYXA8bnVtYmVyLCBNYXA8c3RyaW5nLCBudW1iZXI+PiwpIHtcclxuICAgIGNvbnN0IHJvdyA9IHRoaXMuZ3JpZEFwaS5nZXREaXNwbGF5ZWRSb3dBdEluZGV4KHBhcmFtcy5yb3dJbmRleCk7XHJcblxyXG4gICAgLy8gdGhpcy5jaGFuZ2VDZWxsU3R5bGVDb2x1bW5zKHBhcmFtcywgY2hhbmdlc01hcCwgJyNFOEYxREUnKTtcclxuICAgIHRoaXMuZ3JpZEFwaS5yZWRyYXdSb3dzKHsgcm93Tm9kZXM6IFtyb3ddIH0pO1xyXG4gICAgLy8gdGhpcy5jaGFuZ2VDZWxsU3R5bGVDb2x1bW5zKHBhcmFtcywgY2hhbmdlc01hcCwgJyNGRkZGRkYnKTtcclxuICAgIC8vIFdlIHdpbGwgZGVmaW5lIGNlbGxTdHlsZSB3aGl0ZSB0byBmdXR1cmUgbW9kaWZpY2F0aW9ucyAobGlrZSBmaWx0ZXIpXHJcbiAgfVxyXG5cclxuICAvLyBjaGFuZ2VDZWxsU3R5bGVDb2x1bW5zKHBhcmFtczogYW55LCBjaGFuZ2VzTWFwOiBNYXA8bnVtYmVyLCBNYXA8c3RyaW5nLCBudW1iZXI+PiwgY29sb3I6IHN0cmluZykge1xyXG5cclxuICAvLyAgIGZvciAoY29uc3Qga2V5IG9mIGNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5rZXlzKCkpIHtcclxuICAvLyAgICAgY29uc3QgY29sdW1uTnVtYmVyID0gdGhpcy5nZXRDb2x1bW5JbmRleEJ5Q29sSWQodGhpcy5ncmlkQ29sdW1uQXBpLCBrZXkpO1xyXG4gIC8vICAgICB0aGlzLmdyaWRDb2x1bW5BcGkuY29sdW1uQ29udHJvbGxlci5ncmlkQ29sdW1uc1tjb2x1bW5OdW1iZXJdLmNvbERlZi5jZWxsU3R5bGUgPSB7IGJhY2tncm91bmRDb2xvcjogY29sb3IgfTtcclxuICAvLyAgIH1cclxuXHJcblxyXG4gIC8vIH1cclxuXHJcbn1cclxuIl19