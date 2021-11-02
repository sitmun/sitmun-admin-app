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
        this.currentData = null;
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
        if (this.eventReplaceAllItemsSubscription) {
            this.eventReplaceAllItemsSubscription.subscribe((items) => {
                this.replaceAllItems(items);
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
        this.changeHeight(this.defaultHeight);
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
    replaceAllItems(newItems) {
        this.rowData = [];
        this.addItems(newItems);
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
        // if(value == "max"){
        //   this.gridApi.setDomLayout("autoHeight");
        //   let pixels = `${document.querySelector("#myGrid").scrollHeight}px`;
        //   this.elRef.nativeElement.parentElement.style.height = pixels;
        //   this.gridApi.redrawRows();
        // }
        // else{
        // this.gridApi.setDomLayout(""); // Needed if we have set dom to autoHeight
        if (value != 'default') {
            /** @type {?} */
            let pixels = "";
            if (value === '10') {
                pixels = "350px";
            }
            else if (value === '25') {
                pixels = "800px";
            }
            else if (value === '50') {
                pixels = "1450px";
            }
            else if (value === '100') {
                pixels = "2880px";
            }
            else {
                pixels = "350px";
            }
            this.elRef.nativeElement.parentElement.style.height = pixels;
        }
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
        this.gridApi.redrawRows({ rowNodes: [row] });
    }
}
DataGridComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-data-grid',
                template: "<div id=grup1 class=\"editDivBtns\">\r\n    <span *ngIf=\"title\" [translate]=\"title\"> </span>\r\n    <button type=\"button\" title=\"{{ 'cancel' | translate }}\" mat-mini-fab class=\"mini-fab mat-red\" *ngIf=\"discardChangesButton\"\r\n        id=\"deleteChangesButton\" type=\"button\" (click)=\"deleteChanges()\" [disabled]=\"changeCounter <= 0 && (!someStatusHasChangedToDelete || discardNonReverseStatus  )\">\r\n        <mat-icon fontSet=\"material-icons-round\"> close </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'undo' | translate }}\" mat-mini-fab class=\"mini-fab mat-orange\" *ngIf=\"undoButton && someColumnIsEditable\"\r\n        id=\"undo\" (click)=\"undo()\" [disabled]=\"changeCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> undo </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'redo' | translate }}\" mat-mini-fab class=\"mini-fab mat-orange\" *ngIf=\"redoButton && someColumnIsEditable\"\r\n        id=\"redo\" (click)=\"redo()\" [disabled]=\"redoCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> redo </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'accept' | translate }}\" mat-mini-fab class=\"mini-fab mat-green\"\r\n        *ngIf=\"applyChangesButton\" id=\"applyChangesButton\" (click)=\"applyChanges()\" [disabled]=\"changeCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> check </mat-icon>\r\n    </button>\r\n</div>\r\n\r\n<div id=grup2 class=\"actionsDivBtns\">\r\n    <label *ngIf=\"globalSearch\" [translate]=\"'search'\"> </label>\r\n    <input *ngIf=\"globalSearch\" type=\"text\" class=\"searchGenericInput\" placeholder=\"\" (keyup)=\"quickSearch()\"\r\n        [(ngModel)]=\"searchValue\" ml-2>\r\n    <label *ngIf=\"changeHeightButton\" [translate]=\"'rowsToShow'\"> </label>\r\n    <mat-button-toggle-group *ngIf=\"changeHeightButton\" class=\"toogleButton\" name=\"fontStyle\" aria-label=\"Font Style\"  value=\"10\">\r\n        <mat-button-toggle value=\"10\" (change)=\"changeHeight($event.value)\">10</mat-button-toggle>\r\n        <mat-button-toggle value=\"25\" (change)=\"changeHeight($event.value)\">25</mat-button-toggle>\r\n        <mat-button-toggle value=\"50\" (change)=\"changeHeight($event.value)\">50</mat-button-toggle>\r\n        <mat-button-toggle value=\"100\" (change)=\"changeHeight($event.value)\">100</mat-button-toggle>\r\n        <!-- <mat-button-toggle value=\"max\" (change)=\"changeHeight($event.value)\">{{'ALL' | translate}}</mat-button-toggle> -->\r\n    </mat-button-toggle-group>\r\n\r\n    <button type=\"button\" *ngIf=\"deleteButton\" mat-flat-button id=\"deleteButton\" class=\"deleteButton\"\r\n        (click)=\"removeData()\" [disabled]=\"!areRowsSelected()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> delete </mat-icon>\r\n        <span [translate]=\"'remove'\"> </span>\r\n\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"actionButton\" mat-flat-button [matMenuTriggerFor]=\"menu\" id=\"actionButton\"\r\n        class=\"actionButton\">\r\n        <span [translate]=\"'actions'\"> </span>\r\n        <mat-icon fontSet=\"material-icons-round\"> keyboard_arrow_down </mat-icon>\r\n    </button>\r\n    <mat-menu #menu=\"matMenu\">\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideExportButton\" [disabled]=\"!areRowsSelected()\" (click)=\"exportData()\"> {{\"export\" | translate}}\r\n        </button>\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideDuplicateButton\" [disabled]=\"!areRowsSelected()\" (click)=\"onDuplicateButtonClicked()\">\r\n            {{\"duplicate\" |\r\n            translate}}</button>\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideSearchReplaceButton && false\"> {{\"search/replace\" | translate}}</button>\r\n    </mat-menu>\r\n\r\n    <button type=\"button\" *ngIf=\"newButton\" mat-flat-button class=\"newButton\" (click)=\"newData()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'new'\"> </span>\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"addButton\" mat-flat-button class=\"newButton\" (click)=\"onAddButtonClicked()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'add'\"> </span>\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"registerButton\" mat-flat-button class=\"newButton\" (click)=\"modifyStatusSelected()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'register'\"> </span>\r\n    </button>\r\n\r\n</div>\r\n\r\n<div class=\"row\" style=\" height: 100%\">\r\n    <div id=\"myGrid\" style=\" width:100%; height: 100%\">\r\n        <ag-grid-angular style=\"width: 100%; height: 100%;min-height: 200px;\" [class]=\"themeGrid\"\r\n            [floatingFilter]=\"true\" [rowData]=\"rowData\" [columnDefs]=\"columnDefs\" [gridOptions]=\"gridOptions\"\r\n            [animateRows]=\"true\" [pagination]=\"false\"  [domLayout]=\"domLayout\" [modules]=\"modules\" [undoRedoCellEditing]=\"true\"\r\n            [undoRedoCellEditingLimit]=200 [suppressRowClickSelection]=true [frameworkComponents]=\"frameworkComponents\" [components]=\"components\"\r\n            rowSelection=\"multiple\" multiSortKey=\"key\" (filterModified)=\"onFilterModified()\"\r\n            (cellEditingStopped)=\"onCellEditingStopped($event)\" (cellValueChanged)=\"onCellValueChanged($event)\"\r\n            (gridReady)=\"onGridReady($event)\" (firstDataRendered)=\"firstDataRendered()\">\r\n        </ag-grid-angular>\r\n    </div>\r\n</div>",
                styles: ["@charset \"UTF-8\";input,label{display:inline-block;margin:5px 5px 5px 10px}.mat-flat-button.mat-orange,.mat-icon.mat-orange,.mat-mini-fab.mat-orange,.mat-raised-button.mat-orange{background-color:#ff9300!important;color:#fff!important}.mat-flat-button.mat-orange:disabled,.mat-icon.mat-orange:disabled,.mat-mini-fab.mat-orange:disabled,.mat-raised-button.mat-orange:disabled{background:#ffc97f!important;color:#fff!important}.mat-flat-button.mat-green,.mat-icon.mat-green,.mat-mini-fab.mat-green,.mat-raised-button.mat-green{background-color:#68a225!important;color:#fff!important}.mat-flat-button.mat-green:disabled,.mat-icon.mat-green:disabled,.mat-mini-fab.mat-green:disabled,.mat-raised-button.mat-green:disabled{background-color:#83976c!important;color:#fff!important}.mat-flat-button.mat-red,.mat-icon.mat-red,.mat-mini-fab.mat-red,.mat-raised-button.mat-red{background-color:#bf0000!important;color:#fff!important}.mat-flat-button.mat-red:disabled,.mat-icon.mat-red:disabled,.mat-mini-fab.mat-red:disabled,.mat-raised-button.mat-red:disabled{background-color:#da8c8e!important;color:#fff!important}.validateButton{background-color:#ff9300;color:#fff;margin-top:34px!important;min-width:85px}.deleteButton,.validateButton{-ms-grid-column-align:right!important;height:40px;justify-self:right!important}.deleteButton{border:1px solid #bf0000!important;color:#bf0000;float:inherit!important;min-width:85px!important}.deleteButton:disabled{background-color:inherit!important;border:1px solid rgba(0,0,0,.26)!important;color:rgba(0,0,0,.26) solid 1px!important}.actionButton,.returnButton{border:1px solid #ff9300!important;color:#ff9300}.actionButton,.newButton,.returnButton,.saveButton{-ms-grid-column-align:right!important;float:inherit!important;height:40px;justify-self:right!important;min-width:85px!important}.newButton,.saveButton{background-color:#68a225;color:#fff}.editDivBtns{height:30px!important;line-height:30px!important;margin-left:10px;text-align:start;width:130px}.actionsDivBtns{height:50px;text-align:end;width:calc(100% - 140px)}.actionsDivBtns,.editDivBtns{display:inline-block!important}.actionsDivBtns .searchGenericInput{display:inline-block!important;height:41px!important;margin:0 5px 5px 10px!important;width:35%!important}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-thumb{background:#eee}\u200B .ag-body-viewport.ag-layout-normal ::-webkit-scrollbar{height:2em;width:2em}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-button{background:#ccc}.ag-body-viewport.ag-layout-normal::-webkit-scrollbar-track-piece{background:#888}.mini-fab{height:28px!important;line-height:22px!important;margin-right:3px!important;margin-top:7px!important;width:28px!important}.mini-fab .mat-button-wrapper{height:24px!important;line-height:22px!important;padding:1px 0!important;width:24px!important}.mini-fab .mat-button-wrapper .mat-icon{font-size:20px;line-height:22px;padding-right:0}.toogleButton{align-items:center;height:40px;margin-right:10px;vertical-align:bottom}"]
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
    eventReplaceAllItemsSubscription: [{ type: Input }],
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
    DataGridComponent.prototype.domLayout;
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
    DataGridComponent.prototype.eventReplaceAllItemsSubscription;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1ncmlkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGF0YS1ncmlkL2RhdGEtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQW9CLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVyRyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRWxDLE9BQU8sRUFBRSxtQkFBbUIsRUFBcUIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN4RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUM1RixPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUN4RyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUNsRyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDckQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFXcEYsTUFBTSxPQUFPLGlCQUFpQjs7Ozs7O0lBbUY1QixZQUFtQixNQUFpQixFQUMzQixXQUNDO1FBRlMsV0FBTSxHQUFOLE1BQU0sQ0FBVztRQUMzQixjQUFTLEdBQVQsU0FBUztRQUNSLFVBQUssR0FBTCxLQUFLO3VCQTlFSyxtQkFBbUI7UUFPdkMsb0JBQWUsS0FBSyxDQUFDO1FBQ3JCLDRCQUF1QixLQUFLLENBQUM7MEJBQ2tCLElBQUksR0FBRyxFQUErQjtRQU9yRiwwQkFBcUIsS0FBSyxDQUFDO1FBQzNCLHFCQUFnQixLQUFLLENBQUM7UUFFdEIs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O1lBMXhCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLHVqTEFBeUM7O2FBRTFDOzs7O1lBWFEsU0FBUztZQUpULGdCQUFnQjtZQUwwQyxVQUFVOzs7dUNBb0QxRSxLQUFLOytDQUNMLEtBQUs7MENBQ0wsS0FBSzsrQ0FDTCxLQUFLOytDQUNMLEtBQUs7d0NBQ0wsS0FBSzsrQ0FDTCxLQUFLO2tDQUNMLEtBQUs7eUJBQ0wsS0FBSzt5QkFDTCxLQUFLO3FCQUNMLEtBQUs7bUNBQ0wsS0FBSztzQ0FDTCxLQUFLO2lCQUNMLEtBQUs7eUJBQ0wsS0FBSzttQ0FDTCxLQUFLO3lCQUNMLEtBQUs7aUNBQ0wsS0FBSzsyQkFDTCxLQUFLO3dCQUNMLEtBQUs7MkJBQ0wsS0FBSzt3QkFDTCxLQUFLOzZCQUNMLEtBQUs7Z0NBQ0wsS0FBSzsyQkFDTCxLQUFLO2lDQUNMLEtBQUs7NEJBQ0wsS0FBSzt3QkFDTCxLQUFLOzhCQUNMLEtBQUs7MEJBQ0wsS0FBSztvQkFDTCxLQUFLOytCQUNMLEtBQUs7a0NBQ0wsS0FBSztzQ0FDTCxLQUFLO2tDQUNMLEtBQUs7NkJBQ0wsS0FBSzswQkFDTCxLQUFLO2dEQUNMLEtBQUs7cUJBR0wsTUFBTTtrQkFDTixNQUFNO2tCQUNOLE1BQU07NkJBQ04sTUFBTTswQkFDTixNQUFNO3dCQUNOLE1BQU07OEJBQ04sTUFBTTt5QkFDTixNQUFNOzZCQUNOLE1BQU07MkJBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFnR3JpZE1vZHVsZSB9IGZyb20gJ0BhZy1ncmlkLWNvbW11bml0eS9hbmd1bGFyJztcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIE5nTW9kdWxlLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBBbGxDb21tdW5pdHlNb2R1bGVzLCBDb2x1bW5BcGksIE1vZHVsZSB9IGZyb20gJ0BhZy1ncmlkLWNvbW11bml0eS9hbGwtbW9kdWxlcyc7XHJcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcclxuaW1wb3J0IHsgQnRuRWRpdFJlbmRlcmVkQ29tcG9uZW50IH0gZnJvbSAnLi4vYnRuLWVkaXQtcmVuZGVyZWQvYnRuLWVkaXQtcmVuZGVyZWQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQnRuQ2hlY2tib3hSZW5kZXJlZENvbXBvbmVudCB9IGZyb20gJy4uL2J0bi1jaGVja2JveC1yZW5kZXJlZC9idG4tY2hlY2tib3gtcmVuZGVyZWQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQnRuQ2hlY2tib3hGaWx0ZXJDb21wb25lbnQgfSBmcm9tICcuLi9idG4tY2hlY2tib3gtZmlsdGVyL2J0bi1jaGVja2JveC1maWx0ZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTWF0RGlhbG9nIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcclxuaW1wb3J0IHsgRGlhbG9nTWVzc2FnZUNvbXBvbmVudCB9IGZyb20gJy4uL2RpYWxvZy1tZXNzYWdlL2RpYWxvZy1tZXNzYWdlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IGZvckVhY2ggfSBmcm9tICdqc3ppcCc7XHJcbmRlY2xhcmUgbGV0ICQ6IGFueTtcclxuXHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtZGF0YS1ncmlkJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vZGF0YS1ncmlkLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9kYXRhLWdyaWQuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGF0YUdyaWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBfZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgX2V2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgX2V2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbjogYW55O1xyXG4gIF9ldmVudFNhdmVBZ0dyaWRTdGF0ZVN1YnNjcmlwdGlvbjogYW55O1xyXG4gIF9ldmVudE1vZGlmeVN0YXR1c09mU2VsZWN0ZWRDZWxsczogYW55O1xyXG4gIG1vZHVsZXM6IE1vZHVsZVtdID0gQWxsQ29tbXVuaXR5TW9kdWxlcztcclxuXHJcblxyXG4gIFVuZGVSZWRvQWN0aW9uc1xyXG4gIHNlYXJjaFZhbHVlOiBzdHJpbmc7XHJcbiAgZ3JpZEFwaTogYW55O1xyXG4gIGdyaWRDb2x1bW5BcGk6IGFueTtcclxuICBzdGF0dXNDb2x1bW4gPSBmYWxzZTtcclxuICBzb21lQ29sdW1uSXNFZGl0YWJsZSA9IGZhbHNlO1xyXG4gIGNoYW5nZXNNYXA6IE1hcDxudW1iZXIsIE1hcDxzdHJpbmcsIG51bWJlcj4+ID0gbmV3IE1hcDxudW1iZXIsIE1hcDxzdHJpbmcsIG51bWJlcj4+KCk7XHJcbiAgLy8gV2Ugd2lsbCBzYXZlIHRoZSBpZCBvZiBlZGl0ZWQgY2VsbHMgYW5kIHRoZSBudW1iZXIgb2YgZWRpdGlvbnMgZG9uZS5cclxuICBwYXJhbXM6IGFueTsgLy8gTGFzdCBwYXJhbWV0ZXJzIG9mIHRoZSBncmlkIChpbiBjYXNlIHdlIGRvIGFwcGx5IGNoYW5nZXMgd2Ugd2lsbCBuZWVkIGl0KSBcclxuICByb3dEYXRhOiBhbnlbXTtcclxuICBjaGFuZ2VDb3VudGVyOiBudW1iZXI7IC8vIE51bWJlciBvZiBlZGl0aW9ucyBkb25lIGFib3ZlIGFueSBjZWxsIFxyXG4gIHByZXZpb3VzQ2hhbmdlQ291bnRlcjogbnVtYmVyOyAvLyBOdW1iZXIgb2YgZGl0aW9ucyBkb25lIGFmdGVyIHRoZSBsYXN0IG1vZGlmaWNhdGlvbihjaGFuZ2VDb3VudGVyKVxyXG4gIHJlZG9Db3VudGVyOiBudW1iZXI7IC8vIE51bWJlciBvZiByZWRvIHdlIGNhbiBkb1xyXG4gIG1vZGlmaWNhdGlvbkNoYW5nZSA9IGZhbHNlO1xyXG4gIHVuZG9Ob0NoYW5nZXMgPSBmYWxzZTsgLy8gQm9vbGVhbiB0aGF0IGluZGljYXRlcyBpZiBhbiB1bmRvIGhhc24ndCBtb2RpZmljYXRpb25zXHJcbiAgZ3JpZE9wdGlvbnM7XHJcbiAgc29tZVN0YXR1c0hhc0NoYW5nZWRUb0RlbGV0ZSA9IGZhbHNlO1xyXG5cclxuICBwdWJsaWMgZG9tTGF5b3V0O1xyXG5cclxuXHJcbiAgQElucHV0KCkgZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG4gIEBJbnB1dCgpIGV2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG4gIEBJbnB1dCgpIGV2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZTxzdHJpbmc+O1xyXG4gIEBJbnB1dCgpIGV2ZW50U2F2ZUFnR3JpZFN0YXRlU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG4gIEBJbnB1dCgpIGV2ZW50TW9kaWZ5U3RhdHVzT2ZTZWxlY3RlZENlbGxzOiBPYnNlcnZhYmxlPHN0cmluZz47XHJcbiAgQElucHV0KCkgZXZlbnRBZGRJdGVtc1N1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZTxib29sZWFuPjtcclxuICBASW5wdXQoKSBldmVudFJlcGxhY2VBbGxJdGVtc1N1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZTxib29sZWFuPjtcclxuICBASW5wdXQoKSBmcmFtZXdvcmtDb21wb25lbnRzOiBhbnk7XHJcbiAgQElucHV0KCkgY29tcG9uZW50czogYW55O1xyXG4gIEBJbnB1dCgpIGNvbHVtbkRlZnM6IGFueVtdO1xyXG4gIEBJbnB1dCgpIGdldEFsbDogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+O1xyXG4gIEBJbnB1dCgpIGRpc2NhcmRDaGFuZ2VzQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGRpc2NhcmROb25SZXZlcnNlU3RhdHVzOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGlkOiBhbnk7XHJcbiAgQElucHV0KCkgdW5kb0J1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBkZWZhdWx0Q29sdW1uU29ydGluZzogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHJlZG9CdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYXBwbHlDaGFuZ2VzQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGRlbGV0ZUJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBuZXdCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYWN0aW9uQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGFkZEJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSByZWdpc3RlckJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBuZXdTdGF0dXNSZWdpc3Rlcjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGdsb2JhbFNlYXJjaDogYm9vbGVhbjtcclxuICBASW5wdXQoKSBjaGFuZ2VIZWlnaHRCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgZGVmYXVsdEhlaWdodDogYW55O1xyXG4gIEBJbnB1dCgpIHRoZW1lR3JpZDogYW55O1xyXG4gIEBJbnB1dCgpIHNpbmdsZVNlbGVjdGlvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBub25FZGl0YWJsZTogYm9vbGVhbjtcclxuICBASW5wdXQoKSB0aXRsZTogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGhpZGVFeHBvcnRCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgaGlkZUR1cGxpY2F0ZUJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBoaWRlU2VhcmNoUmVwbGFjZUJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBhZGRGaWVsZFJlc3RyaWN0aW9uOiBhbnk7XHJcbiAgQElucHV0KCkgYWxsTmV3RWxlbWVudHM6IGFueTtcclxuICBASW5wdXQoKSBjdXJyZW50RGF0YTogQXJyYXk8YW55PiA9IG51bGw7XHJcbiAgQElucHV0KCkgZmllbGRSZXN0cmljdGlvbldpdGhEaWZmZXJlbnROYW1lOiBzdHJpbmc7XHJcblxyXG5cclxuICBAT3V0cHV0KCkgcmVtb3ZlOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG4gIEBPdXRwdXQoKSBuZXc6IEV2ZW50RW1pdHRlcjxudW1iZXI+O1xyXG4gIEBPdXRwdXQoKSBhZGQ6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIGRpc2NhcmRDaGFuZ2VzOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG4gIEBPdXRwdXQoKSBzZW5kQ2hhbmdlczogRXZlbnRFbWl0dGVyPGFueVtdPjtcclxuICBAT3V0cHV0KCkgZHVwbGljYXRlOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG4gIEBPdXRwdXQoKSBnZXRTZWxlY3RlZFJvd3M6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIGdldEFsbFJvd3M6IEV2ZW50RW1pdHRlcjx7IGRhdGE6IGFueVtdLCBldmVudDogc3RyaW5nIH0+O1xyXG4gIEBPdXRwdXQoKSBnZXRBZ0dyaWRTdGF0ZTogRXZlbnRFbWl0dGVyPGFueVtdPjtcclxuICBAT3V0cHV0KCkgZ3JpZE1vZGlmaWVkOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj47XHJcblxyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGlhbG9nOiBNYXREaWFsb2csXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBlbFJlZjogRWxlbWVudFJlZikge1xyXG4gICAgdGhpcy50cmFuc2xhdGUgPSB0cmFuc2xhdGU7XHJcblxyXG4gICAgdGhpcy5mcmFtZXdvcmtDb21wb25lbnRzID0ge1xyXG4gICAgICBidG5FZGl0UmVuZGVyZXJDb21wb25lbnQ6IEJ0bkVkaXRSZW5kZXJlZENvbXBvbmVudCxcclxuICAgICAgYnRuQ2hlY2tib3hSZW5kZXJlckNvbXBvbmVudDogQnRuQ2hlY2tib3hSZW5kZXJlZENvbXBvbmVudCxcclxuICAgICAgYnRuQ2hlY2tib3hGaWx0ZXJDb21wb25lbnQ6IEJ0bkNoZWNrYm94RmlsdGVyQ29tcG9uZW50XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuY29tcG9uZW50cyA9IHtcclxuICAgICAgZGF0ZVBpY2tlcjogdGhpcy5nZXREYXRlUGlja2VyKClcclxuICAgIH07XHJcblxyXG5cclxuICAgIHRoaXMucmVtb3ZlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5uZXcgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmFkZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuZGlzY2FyZENoYW5nZXMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLnNlbmRDaGFuZ2VzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5nZXRTZWxlY3RlZFJvd3MgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmR1cGxpY2F0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuZ2V0QWxsUm93cyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuZ3JpZE1vZGlmaWVkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5jaGFuZ2VDb3VudGVyID0gMDtcclxuICAgIHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyID0gMDtcclxuICAgIHRoaXMucmVkb0NvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5ncmlkT3B0aW9ucyA9IHtcclxuICAgICAgZGVmYXVsdENvbERlZjoge1xyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGZsZXg6IDEsXHJcbiAgICAgICAgZmlsdGVyOiB0cnVlLFxyXG4gICAgICAgIGVkaXRhYmxlOiAhdGhpcy5ub25FZGl0YWJsZSxcclxuICAgICAgICBzdXBwcmVzc01lbnU6IHRydWUsXHJcbiAgICAgICAgcmVzaXphYmxlOiB0cnVlLFxyXG4gICAgICAgIGNlbGxTdHlsZTogKHBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgaWYgKHBhcmFtcy52YWx1ZSAmJiBwYXJhbXMuY29sRGVmLmVkaXRhYmxlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoYW5nZXNNYXAuaGFzKHBhcmFtcy5ub2RlLmlkKSAmJiB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5oYXMocGFyYW1zLmNvbERlZi5maWVsZCkpIHtcclxuICAgICAgICAgICAgICByZXR1cm4geyAnYmFja2dyb3VuZC1jb2xvcic6ICcjRThGMURFJyB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJldHVybiB7ICdiYWNrZ3JvdW5kLWNvbG9yJzogJ3doaXRlJyB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgJ2JhY2tncm91bmQtY29sb3InOiAnd2hpdGUnIH07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAgcm93U2VsZWN0aW9uOiAnbXVsdGlwbGUnLFxyXG4gICAgICBzaW5nbGVDbGlja0VkaXQ6IHRydWUsXHJcbiAgICAgIC8vIHN1cHByZXNzSG9yaXpvbnRhbFNjcm9sbDogdHJ1ZSxcclxuICAgICAgbG9jYWxlVGV4dEZ1bmM6IChrZXk6IHN0cmluZywgZGVmYXVsdFZhbHVlOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy50cmFuc2xhdGUuaW5zdGFudChrZXkpO1xyXG4gICAgICAgIHJldHVybiBkYXRhID09PSBrZXkgPyBkZWZhdWx0VmFsdWUgOiBkYXRhO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgfVxyXG5cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcblxyXG4gICAgaWYgKHRoaXMuZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50UmVmcmVzaFN1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5zb21lU3RhdHVzSGFzQ2hhbmdlZFRvRGVsZXRlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VDb3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICAgICAgdGhpcy5yZWRvQ291bnRlciA9IDA7XHJcbiAgICAgICAgdGhpcy5nZXRFbGVtZW50cygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmV2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uID0gdGhpcy5ldmVudEdldFNlbGVjdGVkUm93c1N1YnNjcmlwdGlvbi5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZW1pdFNlbGVjdGVkUm93cygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmV2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLl9ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbi5zdWJzY3JpYmUoKGV2ZW50OiBzdHJpbmcpID0+IHtcclxuICAgICAgICB0aGlzLmVtaXRBbGxSb3dzKGV2ZW50KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZXZlbnRTYXZlQWdHcmlkU3RhdGVTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5fZXZlbnRTYXZlQWdHcmlkU3RhdGVTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50U2F2ZUFnR3JpZFN0YXRlU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zYXZlQWdHcmlkU3RhdGUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZXZlbnRNb2RpZnlTdGF0dXNPZlNlbGVjdGVkQ2VsbHMpIHtcclxuICAgICAgdGhpcy5fZXZlbnRNb2RpZnlTdGF0dXNPZlNlbGVjdGVkQ2VsbHMgPSB0aGlzLmV2ZW50TW9kaWZ5U3RhdHVzT2ZTZWxlY3RlZENlbGxzLnN1YnNjcmliZSgoc3RhdHVzOiBzdHJpbmcpID0+IHtcclxuICAgICAgICB0aGlzLm1vZGlmeVN0YXR1c1NlbGVjdGVkKHN0YXR1cyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmV2ZW50QWRkSXRlbXNTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5ldmVudEFkZEl0ZW1zU3Vic2NyaXB0aW9uLnN1YnNjcmliZShcclxuICAgICAgICAoaXRlbXM6IGFueSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5hZGRJdGVtcyhpdGVtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZXZlbnRSZXBsYWNlQWxsSXRlbXNTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5ldmVudFJlcGxhY2VBbGxJdGVtc1N1YnNjcmlwdGlvbi5zdWJzY3JpYmUoXHJcbiAgICAgICAgKGl0ZW1zOiBhbnkpID0+IHtcclxuICAgICAgICAgIHRoaXMucmVwbGFjZUFsbEl0ZW1zKGl0ZW1zKTtcclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBmaXJzdERhdGFSZW5kZXJlZCgpOiB2b2lkIHtcclxuICAgIGlmIChsb2NhbFN0b3JhZ2UuYWdHcmlkU3RhdGUgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGxldCBhZ0dyaWRTdGF0ZSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmFnR3JpZFN0YXRlKVxyXG4gICAgICBpZiAoYWdHcmlkU3RhdGUuaWRBZ0dyaWQgIT0gdW5kZWZpbmVkICYmIGFnR3JpZFN0YXRlLmlkQWdHcmlkID09IHRoaXMuaWQpIHtcclxuICAgICAgICB0aGlzLmdyaWRBcGkuc2V0RmlsdGVyTW9kZWwoYWdHcmlkU3RhdGUuZmlsdGVyU3RhdGUpO1xyXG4gICAgICAgIHRoaXMuZ3JpZENvbHVtbkFwaS5zZXRDb2x1bW5TdGF0ZShhZ0dyaWRTdGF0ZS5jb2xTdGF0ZSk7XHJcbiAgICAgICAgdGhpcy5ncmlkQXBpLnNldFNvcnRNb2RlbChhZ0dyaWRTdGF0ZS5zb3J0U3RhdGUpO1xyXG4gICAgICAgIHRoaXMuc2VhcmNoVmFsdWUgPSBhZ0dyaWRTdGF0ZS52YWx1ZVNlYXJjaEdlbmVyaWM7XHJcbiAgICAgICAgdGhpcy5xdWlja1NlYXJjaCgpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQWdHcmlkU3RhdGUoKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlkICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQWdHcmlkU3RhdGUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25HcmlkUmVhZHkocGFyYW1zKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5zaW5nbGVTZWxlY3Rpb24pIHsgdGhpcy5ncmlkT3B0aW9ucy5yb3dTZWxlY3Rpb24gPSAnc2luZ2xlJyB9XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgIHRoaXMuZ3JpZEFwaSA9IHBhcmFtcy5hcGk7XHJcbiAgICB0aGlzLmdyaWRDb2x1bW5BcGkgPSBwYXJhbXMuY29sdW1uQXBpO1xyXG4gICAgZm9yIChjb25zdCBjb2wgb2YgdGhpcy5jb2x1bW5EZWZzKSB7XHJcbiAgICAgIGlmICghdGhpcy5zb21lQ29sdW1uSXNFZGl0YWJsZSAmJiBjb2wuZWRpdGFibGUpIHsgdGhpcy5zb21lQ29sdW1uSXNFZGl0YWJsZSA9IHRydWUgfVxyXG4gICAgICBpZiAoY29sLmZpZWxkID09PSAnc3RhdHVzJykge1xyXG4gICAgICAgIHRoaXMuc3RhdHVzQ29sdW1uID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5nZXRFbGVtZW50cygpO1xyXG4gICAgY29uc29sZS5sb2codGhpcy5jb2x1bW5EZWZzKTtcclxuICAgIGlmICh0aGlzLmRlZmF1bHRDb2x1bW5Tb3J0aW5nKSB7XHJcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLmRlZmF1bHRDb2x1bW5Tb3J0aW5nKSkge1xyXG4gICAgICAgIGNvbnN0IHNvcnRNb2RlbCA9IFtcclxuICAgICAgICAgIHsgY29sSWQ6IHRoaXMuZGVmYXVsdENvbHVtblNvcnRpbmcsIHNvcnQ6ICdhc2MnIH1cclxuICAgICAgICBdO1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS5zZXRTb3J0TW9kZWwoc29ydE1vZGVsKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBsZXQgc29ydE1vZGVsID0gW107XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0Q29sdW1uU29ydGluZy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgc29ydE1vZGVsLnB1c2goeyBjb2xJZDogZWxlbWVudCwgc29ydDogJ2FzYycgfSlcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdyaWRBcGkuc2V0U29ydE1vZGVsKHNvcnRNb2RlbCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICAgIHRoaXMuY2hhbmdlSGVpZ2h0KHRoaXMuZGVmYXVsdEhlaWdodClcclxuICB9XHJcblxyXG5cclxuICBnZXREYXRlUGlja2VyKCkge1xyXG4gICAgZnVuY3Rpb24gRGF0ZXBpY2tlcigpIHsgfVxyXG4gICAgRGF0ZXBpY2tlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgdGhpcy5lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICB0aGlzLmVJbnB1dC52YWx1ZSA9IHBhcmFtcy52YWx1ZTtcclxuICAgICAgdGhpcy5lSW5wdXQuY2xhc3NMaXN0LmFkZCgnYWctaW5wdXQnKTtcclxuICAgICAgdGhpcy5lSW5wdXQuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xyXG4gICAgICAkKHRoaXMuZUlucHV0KS5kYXRlcGlja2VyKHsgZGF0ZUZvcm1hdDogJ21tL2RkL3l5JyB9KTtcclxuICAgIH07XHJcbiAgICBEYXRlcGlja2VyLnByb3RvdHlwZS5nZXRHdWkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmVJbnB1dDtcclxuICAgIH07XHJcbiAgICBEYXRlcGlja2VyLnByb3RvdHlwZS5hZnRlckd1aUF0dGFjaGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLmVJbnB1dC5mb2N1cygpO1xyXG4gICAgICB0aGlzLmVJbnB1dC5zZWxlY3QoKTtcclxuICAgIH07XHJcbiAgICBEYXRlcGlja2VyLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZUlucHV0LnZhbHVlO1xyXG4gICAgfTtcclxuICAgIERhdGVwaWNrZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7IH07XHJcbiAgICBEYXRlcGlja2VyLnByb3RvdHlwZS5pc1BvcHVwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIERhdGVwaWNrZXI7XHJcbiAgfVxyXG5cclxuICBhcmVSb3dzU2VsZWN0ZWQoKTogQm9vbGVhbiB7XHJcbiAgICByZXR1cm4gKHRoaXMuZ3JpZEFwaSAhPSBudWxsICYmIHRoaXMuZ3JpZEFwaS5nZXRTZWxlY3RlZE5vZGVzKCkubGVuZ3RoID4gMCkgPyB0cnVlIDogZmFsc2U7XHJcbiAgfVxyXG5cclxuXHJcbiAgZW1pdFNlbGVjdGVkUm93cygpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSB0aGlzLmdyaWRBcGkuZ2V0U2VsZWN0ZWROb2RlcygpO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWREYXRhID0gc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiBub2RlLmRhdGEpO1xyXG4gICAgdGhpcy5nZXRTZWxlY3RlZFJvd3MuZW1pdChzZWxlY3RlZERhdGEpO1xyXG4gIH1cclxuXHJcbiAgZW1pdEFsbFJvd3MoZXZlbnQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgLy8gbGV0IHJvd0RhdGEgPSBbXTtcclxuICAgIC8vIHRoaXMuZ3JpZEFwaS5mb3JFYWNoTm9kZShub2RlID0+IHJvd0RhdGEucHVzaChub2RlLmRhdGEpKTtcclxuICAgIHRoaXMuZ2V0QWxsUm93cy5lbWl0KHsgZGF0YTogdGhpcy5nZXRBbGxDdXJyZW50RGF0YSgpLCBldmVudDogZXZlbnQgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldEFsbEN1cnJlbnREYXRhKCk6IEFycmF5PGFueT4ge1xyXG4gICAgbGV0IHJvd0RhdGEgPSBbXTtcclxuICAgIHRoaXMuZ3JpZEFwaS5mb3JFYWNoTm9kZShub2RlID0+IHJvd0RhdGEucHVzaChub2RlLmRhdGEpKTtcclxuICAgIHJldHVybiByb3dEYXRhO1xyXG4gIH1cclxuXHJcbiAgbW9kaWZ5U3RhdHVzU2VsZWN0ZWQoc3RhdHVzPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBsZXQgbmV3U3RhdHVzID0gc3RhdHVzID8gc3RhdHVzIDogdGhpcy5uZXdTdGF0dXNSZWdpc3RlcjtcclxuICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSB0aGlzLmdyaWRBcGkuZ2V0U2VsZWN0ZWROb2RlcygpO1xyXG4gICAgc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiB7XHJcbiAgICAgIG5vZGUuZGF0YS5zdGF0dXMgPSBuZXdTdGF0dXM7XHJcbiAgICAgIG5vZGUuc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3MoKTtcclxuICB9XHJcblxyXG4gIHNhdmVBZ0dyaWRTdGF0ZSgpOiB2b2lkIHtcclxuICAgIGxldCBhZ0dyaWRTdGF0ZSA9IHtcclxuICAgICAgaWRBZ0dyaWQ6IHRoaXMuaWQsXHJcbiAgICAgIGNvbFN0YXRlOiB0aGlzLmdyaWRDb2x1bW5BcGkuZ2V0Q29sdW1uU3RhdGUoKSxcclxuICAgICAgZmlsdGVyU3RhdGU6IHRoaXMuZ3JpZEFwaS5nZXRGaWx0ZXJNb2RlbCgpLFxyXG4gICAgICBzb3J0U3RhdGU6IHRoaXMuZ3JpZEFwaS5nZXRTb3J0TW9kZWwoKSxcclxuICAgICAgdmFsdWVTZWFyY2hHZW5lcmljOiB0aGlzLnNlYXJjaFZhbHVlXHJcbiAgICB9O1xyXG5cclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWdHcmlkU3RhdGVcIiwgSlNPTi5zdHJpbmdpZnkoYWdHcmlkU3RhdGUpKTtcclxuXHJcbiAgfVxyXG4gIHJlbW92ZUFnR3JpZFN0YXRlKCk6IHZvaWQge1xyXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhZ0dyaWRTdGF0ZVwiKVxyXG4gIH1cclxuXHJcbiAgZ2V0Q29sdW1uS2V5c0FuZEhlYWRlcnMoY29sdW1ua2V5czogQXJyYXk8YW55Pik6IFN0cmluZyB7XHJcbiAgICBsZXQgaGVhZGVyOiBBcnJheTxhbnk+ID0gW107XHJcbiAgICBpZiAodGhpcy5jb2x1bW5EZWZzLmxlbmd0aCA9PSAwKSB7IHJldHVybiAnJyB9O1xyXG5cclxuICAgIGxldCBhbGxDb2x1bW5LZXlzID0gdGhpcy5ncmlkT3B0aW9ucy5jb2x1bW5BcGkuZ2V0QWxsRGlzcGxheWVkQ29sdW1ucygpO1xyXG4gICAgLy8gY29uc29sZS5sb2coYWxsQ29sdW1uS2V5cyk7XHJcbiAgICBhbGxDb2x1bW5LZXlzLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgIGlmIChlbGVtZW50LnVzZXJQcm92aWRlZENvbERlZi5oZWFkZXJOYW1lICE9PSAnJykge1xyXG4gICAgICAgIGNvbHVtbmtleXMucHVzaChlbGVtZW50LnVzZXJQcm92aWRlZENvbERlZi5maWVsZCk7XHJcbiAgICAgICAgaGVhZGVyLnB1c2goZWxlbWVudC51c2VyUHJvdmlkZWRDb2xEZWYuaGVhZGVyTmFtZSk7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGhlYWRlci5qb2luKFwiLFwiKTtcclxuICB9XHJcblxyXG5cclxuICBleHBvcnREYXRhKCk6IHZvaWQge1xyXG4gICAgbGV0IGNvbHVtbmtleXM6IEFycmF5PGFueT4gPSBbXTtcclxuICAgIGxldCBjdXN0b21IZWFkZXI6IFN0cmluZyA9ICcnO1xyXG4gICAgY3VzdG9tSGVhZGVyID0gdGhpcy5nZXRDb2x1bW5LZXlzQW5kSGVhZGVycyhjb2x1bW5rZXlzKVxyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgb25seVNlbGVjdGVkOiB0cnVlLFxyXG4gICAgICBjb2x1bW5LZXlzOiBjb2x1bW5rZXlzLFxyXG4gICAgICBjdXN0b21IZWFkZXI6IGN1c3RvbUhlYWRlcixcclxuICAgICAgc2tpcEhlYWRlcjogdHJ1ZVxyXG4gICAgfTtcclxuICAgIHRoaXMuZ3JpZEFwaS5leHBvcnREYXRhQXNDc3YocGFyYW1zKTtcclxuICB9XHJcblxyXG4gIHF1aWNrU2VhcmNoKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnNldFF1aWNrRmlsdGVyKHRoaXMuc2VhcmNoVmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgZ2V0RWxlbWVudHMoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdldEFsbCgpXHJcbiAgICAgIC5zdWJzY3JpYmUoKGl0ZW1zKSA9PiB7XHJcbiAgICAgICAgbGV0IHN0YXR1cyA9IHRoaXMuYWxsTmV3RWxlbWVudHMgPyAncGVuZGluZ0NyZWF0aW9uJyA6ICdzdGF0dXNPSydcclxuICAgICAgICBsZXQgbmV3SXRlbXMgPSBbXTtcclxuICAgICAgICBsZXQgY29uZGl0aW9uID0gKHRoaXMuYWRkRmllbGRSZXN0cmljdGlvbikgPyB0aGlzLmFkZEZpZWxkUmVzdHJpY3Rpb24gOiAnaWQnO1xyXG4gICAgICAgIGl0ZW1zLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICBpZiAodGhpcy5zdGF0dXNDb2x1bW4pIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuc3RhdHVzICE9IFwibm90QXZhaWxhYmxlXCIgJiYgZWxlbWVudC5zdGF0dXMgIT0gXCJwZW5kaW5nQ3JlYXRpb25cIiAmJiBlbGVtZW50LnN0YXR1cyAhPSBcInBlbmRpbmdSZWdpc3RyYXRpb25cIiAmJiBlbGVtZW50LnN0YXR1cyAhPSBcInVucmVnaXN0ZXJlZExheWVyXCIpIHtcclxuICAgICAgICAgICAgICBlbGVtZW50LnN0YXR1cyA9IHN0YXR1c1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFsbE5ld0VsZW1lbnRzKSB7IGVsZW1lbnQubmV3ID0gdHJ1ZTsgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHRoaXMuY3VycmVudERhdGEpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tFbGVtZW50QWxsb3dlZFRvQWRkKGNvbmRpdGlvbiwgZWxlbWVudCwgdGhpcy5jdXJyZW50RGF0YSkpIHtcclxuICAgICAgICAgICAgICBuZXdJdGVtcy5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBpZih0aGlzLnN0YXR1c0NvbHVtbil7XHJcbiAgICAgICAgLy8gICBsZXQgc3RhdHVzID0gdGhpcy5hbGxOZXdFbGVtZW50cz8ncGVuZGluZ0NyZWF0aW9uJzonc3RhdHVzT0snXHJcbiAgICAgICAgLy8gICBpdGVtcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgIC8vICAgICBpZihlbGVtZW50LnN0YXR1cyAhPSBcIm5vdEF2YWlsYWJsZVwiICYmIGVsZW1lbnQuc3RhdHVzICE9IFwicGVuZGluZ0NyZWF0aW9uXCIgJiYgZWxlbWVudC5zdGF0dXMgIT0gXCJwZW5kaW5nUmVnaXN0cmF0aW9uXCIgJiYgZWxlbWVudC5zdGF0dXMgIT0gXCJ1bnJlZ2lzdGVyZWRMYXllclwiKXtcclxuICAgICAgICAvLyAgICAgICBlbGVtZW50LnN0YXR1cz1zdGF0dXNcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vICAgICBpZih0aGlzLmFsbE5ld0VsZW1lbnRzKSB7IGVsZW1lbnQubmV3ID0gdHJ1ZTsgfVxyXG4gICAgICAgIC8vICAgfSk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIHRoaXMucm93RGF0YSA9IHRoaXMuY3VycmVudERhdGEgPyBuZXdJdGVtcyA6IGl0ZW1zO1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS5zZXRSb3dEYXRhKHRoaXMucm93RGF0YSk7XHJcbiAgICAgICAgdGhpcy5zZXRTaXplKClcclxuICAgICAgICAvLyB0aGlzLmdyaWRBcGkuc2l6ZUNvbHVtbnNUb0ZpdCgpXHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5yb3dEYXRhKTtcclxuXHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0U2l6ZSgpIHtcclxuXHJcbiAgICB2YXIgYWxsQ29sdW1uSWRzID0gW107XHJcbiAgICBsZXQgY29sdW1ucyA9IHRoaXMuZ3JpZE9wdGlvbnMuY29sdW1uQXBpLmdldEFsbENvbHVtbnMoKTtcclxuICAgIGNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbiAoY29sdW1uKSB7XHJcbiAgICAgIGFsbENvbHVtbklkcy5wdXNoKGNvbHVtbi5jb2xJZCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmdyaWRPcHRpb25zLmNvbHVtbkFwaS5hdXRvU2l6ZUNvbHVtbnMoYWxsQ29sdW1uSWRzKTtcclxuXHJcbiAgICBsZXQgZ3JpZCA9IHRoaXMuZ3JpZE9wdGlvbnMuYXBpXHJcbiAgICBsZXQgYXZhaWxhYmxlV2lkdGggPSBncmlkLmdyaWRQYW5lbC5lQm9keVZpZXdwb3J0LmNsaWVudFdpZHRoO1xyXG5cclxuICAgIGxldCB1c2VkV2lkdGggPSBncmlkLmdyaWRQYW5lbC5jb2x1bW5Db250cm9sbGVyLmdldFdpZHRoT2ZDb2xzSW5MaXN0KGNvbHVtbnMpO1xyXG5cclxuICAgIGlmICh1c2VkV2lkdGggPCBhdmFpbGFibGVXaWR0aCkge1xyXG4gICAgICBncmlkLnNpemVDb2x1bW5zVG9GaXQoKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICByZXBsYWNlQWxsSXRlbXMobmV3SXRlbXM6IGFueVtdKTp2b2lkIHtcclxuICAgIHRoaXMucm93RGF0YSA9IFtdO1xyXG4gICAgdGhpcy5hZGRJdGVtcyhuZXdJdGVtcyk7XHJcbiAgfVxyXG5cclxuICBhZGRJdGVtcyhuZXdJdGVtczogYW55W10pOiB2b2lkIHtcclxuICAgIGNvbnNvbGUubG9nKG5ld0l0ZW1zKTtcclxuICAgIGxldCBpdGVtc1RvQWRkOiBBcnJheTxhbnk+ID0gW107XHJcbiAgICBsZXQgY29uZGl0aW9uID0gKHRoaXMuYWRkRmllbGRSZXN0cmljdGlvbikgPyB0aGlzLmFkZEZpZWxkUmVzdHJpY3Rpb24gOiAnaWQnO1xyXG5cclxuXHJcbiAgICBuZXdJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cclxuICAgICAgaWYgKHRoaXMuY2hlY2tFbGVtZW50QWxsb3dlZFRvQWRkKGNvbmRpdGlvbiwgaXRlbSwgdGhpcy5yb3dEYXRhKSkge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXR1c0NvbHVtbikge1xyXG4gICAgICAgICAgaXRlbS5zdGF0dXMgPSAncGVuZGluZ0NyZWF0aW9uJ1xyXG4gICAgICAgICAgaXRlbS5uZXdJdGVtID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaXRlbXNUb0FkZC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIHRoaXMucm93RGF0YS5wdXNoKGl0ZW0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBJdGVtIGFscmVhZHkgZXhpc3RzYClcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmdyaWRBcGkudXBkYXRlUm93RGF0YSh7IGFkZDogaXRlbXNUb0FkZCB9KTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLmNvbHVtbkRlZnMpO1xyXG4gICAgLy8gcGFyYW1zLm9sZFZhbHVlIT11bmRlZmluZWRcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2hlY2tFbGVtZW50QWxsb3dlZFRvQWRkKGNvbmRpdGlvbiwgaXRlbSwgZGF0YSkge1xyXG5cclxuICAgIGxldCBmaW5hbEFkZGl0aW9uID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjb25kaXRpb24pKSB7XHJcblxyXG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIGRhdGEpIHtcclxuICAgICAgICBsZXQgY2FuQWRkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGN1cnJlbnRDb25kaXRpb24gb2YgY29uZGl0aW9uKSB7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudFtjdXJyZW50Q29uZGl0aW9uXSAhPSBpdGVtW2N1cnJlbnRDb25kaXRpb25dKSB7XHJcbiAgICAgICAgICAgIGNhbkFkZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWNhbkFkZCkge1xyXG4gICAgICAgICAgZmluYWxBZGRpdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBmaW5hbEFkZGl0aW9uO1xyXG5cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBpZiAodGhpcy5maWVsZFJlc3RyaWN0aW9uV2l0aERpZmZlcmVudE5hbWUpIHtcclxuICAgICAgICByZXR1cm4gKGl0ZW1bY29uZGl0aW9uXSA9PSB1bmRlZmluZWQgfHwgKGRhdGEuZmluZChlbGVtZW50ID0+IGVsZW1lbnRbdGhpcy5maWVsZFJlc3RyaWN0aW9uV2l0aERpZmZlcmVudE5hbWVdID09IGl0ZW1bY29uZGl0aW9uXSkpID09IHVuZGVmaW5lZClcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gKGl0ZW1bY29uZGl0aW9uXSA9PSB1bmRlZmluZWQgfHwgKGRhdGEuZmluZChlbGVtZW50ID0+IGVsZW1lbnRbY29uZGl0aW9uXSA9PSBpdGVtW2NvbmRpdGlvbl0pKSA9PSB1bmRlZmluZWQpXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcblxyXG4gIGNoYW5nZUhlaWdodCh2YWx1ZSkge1xyXG5cclxuICAgICAgLy8gaWYodmFsdWUgPT0gXCJtYXhcIil7XHJcbiAgICAgIC8vICAgdGhpcy5ncmlkQXBpLnNldERvbUxheW91dChcImF1dG9IZWlnaHRcIik7XHJcbiAgICAgIC8vICAgbGV0IHBpeGVscyA9IGAke2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbXlHcmlkXCIpLnNjcm9sbEhlaWdodH1weGA7XHJcbiAgICAgIC8vICAgdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gcGl4ZWxzO1xyXG4gICAgICAvLyAgIHRoaXMuZ3JpZEFwaS5yZWRyYXdSb3dzKCk7XHJcbiAgICAgIC8vIH1cclxuICAgICAgLy8gZWxzZXtcclxuICAgICAgICAvLyB0aGlzLmdyaWRBcGkuc2V0RG9tTGF5b3V0KFwiXCIpOyAvLyBOZWVkZWQgaWYgd2UgaGF2ZSBzZXQgZG9tIHRvIGF1dG9IZWlnaHRcclxuXHJcbiAgICAgICAgaWYodmFsdWUgIT0gJ2RlZmF1bHQnICl7XHJcbiAgICAgICAgICBsZXQgcGl4ZWxzID0gXCJcIjtcclxuICAgICAgICAgIGlmICh2YWx1ZSA9PT0gJzEwJykge1xyXG4gICAgICAgICAgICBwaXhlbHMgPSBcIjM1MHB4XCJcclxuICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICcyNScpIHtcclxuICAgICAgICAgICAgcGl4ZWxzID0gXCI4MDBweFwiXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnNTAnKSB7XHJcbiAgICAgICAgICAgIHBpeGVscyA9IFwiMTQ1MHB4XCJcclxuICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICcxMDAnKSB7XHJcbiAgICAgICAgICAgIHBpeGVscyA9IFwiMjg4MHB4XCJcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIHBpeGVscyA9IFwiMzUwcHhcIlxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZS5oZWlnaHQgPSBwaXhlbHM7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgIFxyXG4gIH1cclxuXHJcbiAgcmVtb3ZlRGF0YSgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKTtcclxuICAgIGNvbnN0IHNlbGVjdGVkRGF0YSA9IHNlbGVjdGVkTm9kZXMubWFwKG5vZGUgPT4gbm9kZS5kYXRhKTtcclxuICAgIHRoaXMucmVtb3ZlLmVtaXQoc2VsZWN0ZWREYXRhKTtcclxuXHJcbiAgICBpZiAodGhpcy5zdGF0dXNDb2x1bW4pIHtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRSb3dzID0gc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiBub2RlLmlkKTtcclxuICAgICAgaWYgKHNlbGVjdGVkUm93cy5sZW5ndGggPiAwKSB7IHRoaXMuc29tZVN0YXR1c0hhc0NoYW5nZWRUb0RlbGV0ZSA9IHRydWU7IH1cclxuICAgICAgZm9yIChjb25zdCBpZCBvZiBzZWxlY3RlZFJvd3MpIHtcclxuICAgICAgICB0aGlzLmdyaWRBcGkuZ2V0Um93Tm9kZShpZCkuZGF0YS5zdGF0dXMgPSAncGVuZGluZ0RlbGV0ZSc7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5ncmlkT3B0aW9ucy5hcGkucmVmcmVzaENlbGxzKCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmdyaWRPcHRpb25zLmFwaS5kZXNlbGVjdEFsbCgpO1xyXG4gIH1cclxuXHJcbiAgbmV3RGF0YSgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICB0aGlzLm5ldy5lbWl0KC0xKTtcclxuICB9XHJcblxyXG4gIG9uQWRkQnV0dG9uQ2xpY2tlZCgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICB0aGlzLmFkZC5lbWl0KHRoaXMuZ2V0QWxsQ3VycmVudERhdGEoKSk7XHJcbiAgfVxyXG5cclxuICBvbkR1cGxpY2F0ZUJ1dHRvbkNsaWNrZWQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgaWYgKHRoaXMuY2hhbmdlQ291bnRlciA+IDApIHtcclxuICAgICAgY29uc3QgZGlhbG9nUmVmID0gdGhpcy5kaWFsb2cub3BlbihEaWFsb2dNZXNzYWdlQ29tcG9uZW50KTtcclxuICAgICAgZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLnRpdGxlID0gdGhpcy50cmFuc2xhdGUuaW5zdGFudCgnY2F1dGlvbicpXHJcbiAgICAgIGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5tZXNzYWdlID0gdGhpcy50cmFuc2xhdGUuaW5zdGFudCgnZHVwbGljYXRlTWVzc2FnZScpXHJcbiAgICAgIGRpYWxvZ1JlZi5hZnRlckNsb3NlZCgpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgIGlmIChyZXN1bHQuZXZlbnQgPT09ICdBY2NlcHQnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSB0aGlzLmdyaWRBcGkuZ2V0U2VsZWN0ZWROb2RlcygpO1xyXG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZERhdGEgPSBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IG5vZGUuZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuZHVwbGljYXRlLmVtaXQoc2VsZWN0ZWREYXRhKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKTtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWREYXRhID0gc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiBub2RlLmRhdGEpO1xyXG4gICAgICB0aGlzLmR1cGxpY2F0ZS5lbWl0KHNlbGVjdGVkRGF0YSk7XHJcbiAgICAgIHRoaXMuZ3JpZE9wdGlvbnMuYXBpLmRlc2VsZWN0QWxsKCk7XHJcblxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIGFwcGx5Q2hhbmdlcygpOiB2b2lkIHtcclxuICAgIGNvbnN0IGl0ZW1zQ2hhbmdlZDogYW55W10gPSBbXTtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBvZiB0aGlzLmNoYW5nZXNNYXAua2V5cygpKSB7XHJcbiAgICAgIGl0ZW1zQ2hhbmdlZC5wdXNoKHRoaXMuZ3JpZEFwaS5nZXRSb3dOb2RlKGtleSkuZGF0YSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnNlbmRDaGFuZ2VzLmVtaXQoaXRlbXNDaGFuZ2VkKTtcclxuICAgIHRoaXMuZ3JpZE1vZGlmaWVkLmVtaXQoZmFsc2UpO1xyXG4gICAgdGhpcy5jaGFuZ2VzTWFwLmNsZWFyKCk7XHJcbiAgICB0aGlzLmNoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5yZWRvQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnNvbWVTdGF0dXNIYXNDaGFuZ2VkVG9EZWxldGUgPSBmYWxzZTtcclxuICAgIC8vIHRoaXMucGFyYW1zLmNvbERlZi5jZWxsU3R5bGUgPSB7IGJhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnIH07XHJcbiAgICB0aGlzLmdyaWRBcGkucmVkcmF3Um93cygpO1xyXG4gIH1cclxuXHJcblxyXG5cclxuICBkZWxldGVDaGFuZ2VzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIGxldCBuZXdFbGVtZW50c0FjdGl2ZWQgPSB0aGlzLmFsbE5ld0VsZW1lbnRzO1xyXG5cclxuICAgIHdoaWxlICh0aGlzLmNoYW5nZUNvdW50ZXIgPiAwKSB7XHJcbiAgICAgIHRoaXMudW5kbygpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY2hhbmdlc01hcC5jbGVhcigpO1xyXG4gICAgLy90aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuXHJcbiAgICBpZiAodGhpcy5zdGF0dXNDb2x1bW4gJiYgIXRoaXMuZGlzY2FyZE5vblJldmVyc2VTdGF0dXMpIHtcclxuICAgICAgbGV0IHJvd3NXaXRoU3RhdHVzTW9kaWZpZWQgPSBbXTtcclxuICAgICAgdGhpcy5ncmlkQXBpLmZvckVhY2hOb2RlKGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICAgICAgaWYgKG5vZGUuZGF0YS5zdGF0dXMgPT09ICdwZW5kaW5nTW9kaWZ5JyB8fCBub2RlLmRhdGEuc3RhdHVzID09PSAncGVuZGluZ0RlbGV0ZScpIHtcclxuICAgICAgICAgIGlmIChub2RlLmRhdGEuc3RhdHVzID09PSAncGVuZGluZ0RlbGV0ZScpIHtcclxuICAgICAgICAgICAgcm93c1dpdGhTdGF0dXNNb2RpZmllZC5wdXNoKG5vZGUuZGF0YSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAobm9kZS5kYXRhLm5ld0l0ZW0gfHwgbmV3RWxlbWVudHNBY3RpdmVkKSB7XHJcbiAgICAgICAgICAgIG5vZGUuZGF0YS5zdGF0dXMgPSAncGVuZGluZ0NyZWF0aW9uJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG5vZGUuZGF0YS5zdGF0dXMgPSAnc3RhdHVzT0snXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuc29tZVN0YXR1c0hhc0NoYW5nZWRUb0RlbGV0ZSA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmRpc2NhcmRDaGFuZ2VzLmVtaXQocm93c1dpdGhTdGF0dXNNb2RpZmllZCk7XHJcbiAgICAgIHRoaXMuZ3JpZE1vZGlmaWVkLmVtaXQoZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3MoKTtcclxuXHJcbiAgICAvL3RoaXMucGFyYW1zLmNvbERlZi5jZWxsU3R5bGUgPSAge2JhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnfTtcclxuICAgIC8vdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3MoKTtcclxuICB9XHJcblxyXG5cclxuICBvbkZpbHRlck1vZGlmaWVkKCk6IHZvaWQge1xyXG5cclxuICAgIHRoaXMuZGVsZXRlQ2hhbmdlcygpO1xyXG5cclxuICB9XHJcblxyXG5cclxuICB1bmRvKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIHRoaXMuZ3JpZEFwaS51bmRvQ2VsbEVkaXRpbmcoKTtcclxuICAgIHRoaXMuY2hhbmdlQ291bnRlciAtPSAxO1xyXG4gICAgaWYgKHRoaXMuY2hhbmdlQ291bnRlciA9PSAwKSB7IHRoaXMuZ3JpZE1vZGlmaWVkLmVtaXQoZmFsc2UpIH1cclxuICAgIHRoaXMucmVkb0NvdW50ZXIgKz0gMTtcclxuICB9XHJcblxyXG4gIHJlZG8oKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgdGhpcy5ncmlkQXBpLnJlZG9DZWxsRWRpdGluZygpO1xyXG4gICAgdGhpcy5jaGFuZ2VDb3VudGVyICs9IDE7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyIC09IDE7XHJcbiAgfVxyXG5cclxuXHJcbiAgb25DZWxsRWRpdGluZ1N0b3BwZWQoZSkge1xyXG4gICAgaWYgKHRoaXMubW9kaWZpY2F0aW9uQ2hhbmdlKSB7XHJcbiAgICAgIHRoaXMuY2hhbmdlQ291bnRlcisrO1xyXG4gICAgICBpZiAodGhpcy5jaGFuZ2VDb3VudGVyID09IDEpIHsgdGhpcy5ncmlkTW9kaWZpZWQuZW1pdCh0cnVlKSB9XHJcbiAgICAgIHRoaXMucmVkb0NvdW50ZXIgPSAwO1xyXG4gICAgICB0aGlzLm9uQ2VsbFZhbHVlQ2hhbmdlZChlKTtcclxuICAgICAgdGhpcy5tb2RpZmljYXRpb25DaGFuZ2UgPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBvbkNlbGxWYWx1ZUNoYW5nZWQocGFyYW1zKTogdm9pZCB7XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgIGlmICh0aGlzLmNoYW5nZUNvdW50ZXIgPiB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlcilcclxuICAgIC8vIFRydWUgaWYgd2UgaGF2ZSBlZGl0ZWQgc29tZSBjZWxsIG9yIHdlIGhhdmUgZG9uZSBhIHJlZG8gXHJcbiAgICB7XHJcblxyXG4gICAgICBpZiAocGFyYW1zLm9sZFZhbHVlICE9PSBwYXJhbXMudmFsdWUgJiYgIShwYXJhbXMub2xkVmFsdWUgPT0gbnVsbCAmJiBwYXJhbXMudmFsdWUgPT09ICcnKSkge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuY2hhbmdlc01hcC5oYXMocGFyYW1zLm5vZGUuaWQpKSAvLyBJZiBpdCdzIGZpcnRzIGVkaXQgb2YgYSBjZWxsLCB3ZSBhZGQgaXQgdG8gdGhlIG1hcCBhbmQgd2UgcGFpbnQgaXRcclxuICAgICAgICB7XHJcbiAgICAgICAgICBjb25zdCBhZGRNYXA6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xyXG4gICAgICAgICAgYWRkTWFwLnNldChwYXJhbXMuY29sRGVmLmZpZWxkLCAxKVxyXG4gICAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLnNldChwYXJhbXMubm9kZS5pZCwgYWRkTWFwKTtcclxuICAgICAgICAgIGlmICh0aGlzLnN0YXR1c0NvbHVtbikge1xyXG4gICAgICAgICAgICAvLyBpZiAodGhpcy5ncmlkQXBpLmdldFJvd05vZGUocGFyYW1zLm5vZGUuaWQpLmRhdGEuc3RhdHVzICE9PSAncGVuZGluZ0NyZWF0aW9uJykge1xyXG4gICAgICAgICAgICB0aGlzLmdyaWRBcGkuZ2V0Um93Tm9kZShwYXJhbXMubm9kZS5pZCkuZGF0YS5zdGF0dXMgPSAncGVuZGluZ01vZGlmeSdcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGlmICghdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuaGFzKHBhcmFtcy5jb2xEZWYuZmllbGQpKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5zZXQocGFyYW1zLmNvbERlZi5maWVsZCwgMSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFdlIGFscmVhZHkgaGFkIGVkaXRlZCB0aGlzIGNlbGwsIHNvIHdlIG9ubHkgaW5jcmVtZW50IG51bWJlciBvZiBjaGFuZ2VzIG9mIGl0IG9uIHRoZSBtYXAgXHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDaGFuZ2VzID0gdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuZ2V0KHBhcmFtcy5jb2xEZWYuZmllbGQpO1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5zZXQocGFyYW1zLmNvbERlZi5maWVsZCwgKGN1cnJlbnRDaGFuZ2VzICsgMSkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wYWludENlbGxzKHBhcmFtcywgdGhpcy5jaGFuZ2VzTWFwKTsgLy9XZSBwYWludCB0aGUgcm93IG9mIHRoZSBlZGl0ZWQgY2VsbCBcclxuICAgICAgICB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlcisrOyAvL1dlIG1hdGNoIHRoZSBjdXJyZW50IHByZXZpb3VzQ2hhbmdlQ291bnRlciB3aXRoIGNoYW5nZUNvdW50ZXJcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHRoaXMuY2hhbmdlQ291bnRlciA8IHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyKSB7IC8vIFRydWUgaWYgd2UgaGF2ZSBkb25lIGFuIHVuZG9cclxuICAgICAgbGV0IGN1cnJlbnRDaGFuZ2VzID0gLTE7XHJcbiAgICAgIGlmICh0aGlzLmNoYW5nZXNNYXAuaGFzKHBhcmFtcy5ub2RlLmlkKSkgeyBjdXJyZW50Q2hhbmdlcyA9IHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmdldChwYXJhbXMuY29sRGVmLmZpZWxkKTsgfVxyXG5cclxuICAgICAgaWYgKGN1cnJlbnRDaGFuZ2VzID09PSAxKSB7IC8vT25jZSB0aGUgdW5kbyBpdCdzIGRvbmUsIGNlbGwgaXMgaW4gaGlzIGluaXRpYWwgc3RhdHVzXHJcblxyXG4gICAgICAgIHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmRlbGV0ZShwYXJhbXMuY29sRGVmLmZpZWxkKTtcclxuICAgICAgICBpZiAodGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuc2l6ZSA9PT0gMCkgeyAvLyBObyBtb3JlIG1vZGlmaWNhdGlvbnMgaW4gdGhpcyByb3dcclxuICAgICAgICAgIHRoaXMuY2hhbmdlc01hcC5kZWxldGUocGFyYW1zLm5vZGUuaWQpO1xyXG4gICAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5ncmlkQXBpLmdldERpc3BsYXllZFJvd0F0SW5kZXgocGFyYW1zLnJvd0luZGV4KTtcclxuICAgICAgICAgIGlmICh0aGlzLnN0YXR1c0NvbHVtbikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ncmlkQXBpLmdldFJvd05vZGUocGFyYW1zLm5vZGUuaWQpLmRhdGEuc3RhdHVzICE9PSAncGVuZGluZ0NyZWF0aW9uJykge1xyXG4gICAgICAgICAgICAgIHRoaXMuZ3JpZEFwaS5nZXRSb3dOb2RlKHBhcmFtcy5ub2RlLmlkKS5kYXRhLnN0YXR1cyA9ICdzdGF0dXNPSydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIC8vIFdlIHBhaW50IGl0IHdoaXRlXHJcbiAgICAgICAgICB0aGlzLmdyaWRBcGkucmVkcmF3Um93cyh7IHJvd05vZGVzOiBbcm93XSB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5wYWludENlbGxzKHBhcmFtcywgdGhpcy5jaGFuZ2VzTWFwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKGN1cnJlbnRDaGFuZ2VzID4gMSkgLy8gVGhlIGNlbGwgaXNuJ3QgaW4gaGlzIGluaXRpYWwgc3RhdGUgeWV0XHJcbiAgICAgIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1dlIGNhbid0IGRvIGVsc2UgYmVjYXVzZSB3ZSBjYW4gYmUgZG9pbmcgYW4gdW5kbyB3aXRob3V0IGNoYW5nZXMgXHJcbiAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuc2V0KHBhcmFtcy5jb2xEZWYuZmllbGQsIChjdXJyZW50Q2hhbmdlcyAtIDEpKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYWludENlbGxzKHBhcmFtcywgdGhpcy5jaGFuZ2VzTWFwKTsvL05vdCBpbml0aWFsIHN0YXRlIC0+IGdyZWVuIGJhY2tncm91bmRcclxuXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXItLTsgIC8vV2UgZGVjcmVtZW50IHByZXZpb3VzQ2hhbmdlQ291bnRlciBiZWNhdXNlIHdlIGhhdmUgZG9uZSB1bmRvXHJcbiAgICB9XHJcbiAgICBlbHNlIHsgLy8gQ29udHJvbCBvZiBtb2RpZmljYXRpb25zIHdpdGhvdXQgY2hhbmdlc1xyXG4gICAgICBpZiAoIShwYXJhbXMub2xkVmFsdWUgPT0gbnVsbCAmJiBwYXJhbXMudmFsdWUgPT09ICcnKSkge1xyXG4gICAgICAgIGxldCBuZXdWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIGlmIChwYXJhbXMudmFsdWUgPT0gbnVsbCkgeyBuZXdWYWx1ZSA9ICcnIH1cclxuICAgICAgICBlbHNlIHsgbmV3VmFsdWUgPSBwYXJhbXMudmFsdWUudG9TdHJpbmcoKSB9XHJcblxyXG4gICAgICAgIGlmICgocGFyYW1zLm9sZFZhbHVlICE9IHVuZGVmaW5lZCAmJiBwYXJhbXMub2xkVmFsdWUgIT0gbnVsbCAmJiBwYXJhbXMub2xkVmFsdWUudG9TdHJpbmcoKSAhPT0gbmV3VmFsdWUudG9TdHJpbmcoKSlcclxuICAgICAgICAgIHx8ICgocGFyYW1zLm9sZFZhbHVlID09IHVuZGVmaW5lZCB8fCBwYXJhbXMub2xkVmFsdWUgPT0gbnVsbCkgJiYgbmV3VmFsdWUgIT0gbnVsbCkpIHtcclxuXHJcbiAgICAgICAgICB0aGlzLm1vZGlmaWNhdGlvbkNoYW5nZSA9IHRydWU7XHJcbiAgICAgICAgICBpZiAocGFyYW1zLmNvbERlZi5jZWxsUmVuZGVyZXIgPT0gXCJidG5DaGVja2JveFJlbmRlcmVyQ29tcG9uZW50XCIpIHtcclxuICAgICAgICAgICAgdmFyIHVuZG9SZWRvQWN0aW9ucyA9IHtcclxuICAgICAgICAgICAgICBjZWxsVmFsdWVDaGFuZ2VzOiB0aGlzLmdyaWRBcGkudW5kb1JlZG9TZXJ2aWNlLmNlbGxWYWx1ZUNoYW5nZXNcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5ncmlkQXBpLnVuZG9SZWRvU2VydmljZS5wdXNoQWN0aW9uc1RvVW5kb1N0YWNrKHVuZG9SZWRvQWN0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JpZEFwaS51bmRvUmVkb1NlcnZpY2UuaXNGaWxsaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMub25DZWxsRWRpdGluZ1N0b3BwZWQocGFyYW1zKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7IHRoaXMubW9kaWZpY2F0aW9uV2l0aG91dENoYW5nZXMocGFyYW1zKSB9XHJcblxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgeyB0aGlzLm1vZGlmaWNhdGlvbldpdGhvdXRDaGFuZ2VzKHBhcmFtcykgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbW9kaWZpY2F0aW9uV2l0aG91dENoYW5nZXMocGFyYW1zOiBhbnkpIHtcclxuXHJcbiAgICBpZiAodGhpcy5jaGFuZ2VzTWFwLmhhcyhwYXJhbXMubm9kZS5pZCkpIC8vTW9kaWZpY2F0aW9uIHdpdGhvdXQgY2hhbmdlcyBpbiBlbiBlZGl0ZWQgY2VsbFxyXG4gICAge1xyXG4gICAgICBpZiAoIXRoaXMudW5kb05vQ2hhbmdlcykge1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS51bmRvQ2VsbEVkaXRpbmcoKTsgLy8gVW5kbyB0byBkZWxldGUgdGhlIGNoYW5nZSB3aXRob3V0IGNoYW5nZXMgaW50ZXJuYWxseSBcclxuICAgICAgICB0aGlzLnVuZG9Ob0NoYW5nZXMgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucGFpbnRDZWxscyhwYXJhbXMsIHRoaXMuY2hhbmdlc01hcCk7ICAvL1RoZSBjZWxsIGhhcyBtb2RpZmljYXRpb25zIHlldCAtPiBncmVlbiBiYWNrZ3JvdW5kIFxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgeyB0aGlzLnVuZG9Ob0NoYW5nZXMgPSBmYWxzZTsgfVxyXG5cclxuXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgLy9XaXRoIHRoZSBpbnRlcm5hbGx5IHVuZG8gd2lsbCBlbnRlciBhdCB0aGlzIGZ1bmN0aW9uLCBzbyB3ZSBoYXZlIHRvIGNvbnRyb2wgd2hlbiBkb25lIHRoZSB1bmRvIG9yIG5vdCBcclxuICAgICAgaWYgKCF0aGlzLnVuZG9Ob0NoYW5nZXMpIHtcclxuICAgICAgICB0aGlzLmdyaWRBcGkudW5kb0NlbGxFZGl0aW5nKCk7IC8vIFVuZG8gdG8gZGVsZXRlIHRoZSBjaGFuZ2UgaW50ZXJuYWxseVxyXG4gICAgICAgIHRoaXMudW5kb05vQ2hhbmdlcyA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7IHRoaXMudW5kb05vQ2hhbmdlcyA9IGZhbHNlOyB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0Q29sdW1uSW5kZXhCeUNvbElkKGFwaTogQ29sdW1uQXBpLCBjb2xJZDogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBhcGkuZ2V0QWxsQ29sdW1ucygpLmZpbmRJbmRleChjb2wgPT4gY29sLmdldENvbElkKCkgPT09IGNvbElkKTtcclxuICB9XHJcbiAgcGFpbnRDZWxscyhwYXJhbXM6IGFueSwgY2hhbmdlc01hcDogTWFwPG51bWJlciwgTWFwPHN0cmluZywgbnVtYmVyPj4sKSB7XHJcbiAgICBjb25zdCByb3cgPSB0aGlzLmdyaWRBcGkuZ2V0RGlzcGxheWVkUm93QXRJbmRleChwYXJhbXMucm93SW5kZXgpO1xyXG4gICAgdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3MoeyByb3dOb2RlczogW3Jvd10gfSk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=