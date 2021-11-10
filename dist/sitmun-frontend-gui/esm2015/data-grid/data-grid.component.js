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
        this.loadButton = false;
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
        this.load = new EventEmitter();
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
    loadDataButton() {
        this.load.emit();
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
                template: "<div id=grup1 class=\"editDivBtns\">\r\n    <span *ngIf=\"title\" [translate]=\"title\"> </span>\r\n    <button type=\"button\" title=\"{{ 'cancel' | translate }}\" mat-mini-fab class=\"mini-fab mat-red\" *ngIf=\"discardChangesButton\"\r\n        id=\"deleteChangesButton\" type=\"button\" (click)=\"deleteChanges()\" [disabled]=\"changeCounter <= 0 && (!someStatusHasChangedToDelete || discardNonReverseStatus  )\">\r\n        <mat-icon fontSet=\"material-icons-round\"> close </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'undo' | translate }}\" mat-mini-fab class=\"mini-fab mat-orange\" *ngIf=\"undoButton && someColumnIsEditable\"\r\n        id=\"undo\" (click)=\"undo()\" [disabled]=\"changeCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> undo </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'redo' | translate }}\" mat-mini-fab class=\"mini-fab mat-orange\" *ngIf=\"redoButton && someColumnIsEditable\"\r\n        id=\"redo\" (click)=\"redo()\" [disabled]=\"redoCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> redo </mat-icon>\r\n    </button>\r\n    <button type=\"button\" title=\"{{ 'accept' | translate }}\" mat-mini-fab class=\"mini-fab mat-green\"\r\n        *ngIf=\"applyChangesButton\" id=\"applyChangesButton\" (click)=\"applyChanges()\" [disabled]=\"changeCounter <= 0\">\r\n        <mat-icon fontSet=\"material-icons-round\"> check </mat-icon>\r\n    </button>\r\n</div>\r\n\r\n<div id=grup2 class=\"actionsDivBtns\">\r\n    <label *ngIf=\"globalSearch\" [translate]=\"'search'\"> </label>\r\n    <input *ngIf=\"globalSearch\" type=\"text\" class=\"searchGenericInput\" placeholder=\"\" (keyup)=\"quickSearch()\"\r\n        [(ngModel)]=\"searchValue\" ml-2>\r\n    <label *ngIf=\"changeHeightButton\" [translate]=\"'rowsToShow'\"> </label>\r\n    <mat-button-toggle-group *ngIf=\"changeHeightButton\" class=\"toogleButton\" name=\"fontStyle\" aria-label=\"Font Style\"  value=\"10\">\r\n        <mat-button-toggle value=\"10\" (change)=\"changeHeight($event.value)\">10</mat-button-toggle>\r\n        <mat-button-toggle value=\"25\" (change)=\"changeHeight($event.value)\">25</mat-button-toggle>\r\n        <mat-button-toggle value=\"50\" (change)=\"changeHeight($event.value)\">50</mat-button-toggle>\r\n        <mat-button-toggle value=\"100\" (change)=\"changeHeight($event.value)\">100</mat-button-toggle>\r\n        <!-- <mat-button-toggle value=\"max\" (change)=\"changeHeight($event.value)\">{{'ALL' | translate}}</mat-button-toggle> -->\r\n    </mat-button-toggle-group>\r\n    <button type=\"button\"  *ngIf=\"loadButton\"  [disabled]=\"loadButtonDisabled\"  mat-flat-button class=\"loadButton\" (click)=\"loadDataButton()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> file_download </mat-icon>\r\n        <span [translate]=\"'update_layers'\"> </span>\r\n      </button>\r\n    <button type=\"button\" *ngIf=\"deleteButton\" mat-flat-button id=\"deleteButton\" class=\"deleteButton\"\r\n        (click)=\"removeData()\" [disabled]=\"!areRowsSelected()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> delete </mat-icon>\r\n        <span [translate]=\"'remove'\"> </span>\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"actionButton\" mat-flat-button [matMenuTriggerFor]=\"menu\" id=\"actionButton\"\r\n        class=\"actionButton\">\r\n        <span [translate]=\"'actions'\"> </span>\r\n        <mat-icon fontSet=\"material-icons-round\"> keyboard_arrow_down </mat-icon>\r\n    </button>\r\n    <mat-menu #menu=\"matMenu\">\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideExportButton\" [disabled]=\"!areRowsSelected()\" (click)=\"exportData()\"> {{\"export\" | translate}}\r\n        </button>\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideDuplicateButton\" [disabled]=\"!areRowsSelected()\" (click)=\"onDuplicateButtonClicked()\">\r\n            {{\"duplicate\" |\r\n            translate}}</button>\r\n        <button type=\"button\" mat-menu-item *ngIf=\"!hideSearchReplaceButton && false\"> {{\"search/replace\" | translate}}</button>\r\n    </mat-menu>\r\n\r\n    <button type=\"button\" *ngIf=\"newButton\" mat-flat-button class=\"newButton\" (click)=\"newData()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'new'\"> </span>\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"addButton\" mat-flat-button class=\"newButton\" (click)=\"onAddButtonClicked()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'add'\"> </span>\r\n    </button>\r\n    <button type=\"button\" *ngIf=\"registerButton\" mat-flat-button class=\"newButton\" (click)=\"modifyStatusSelected()\">\r\n        <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>\r\n        <span [translate]=\"'register'\"> </span>\r\n    </button>\r\n\r\n</div>\r\n\r\n<div class=\"row\" style=\" height: 100%\">\r\n    <div id=\"myGrid\" style=\" width:100%; height: 100%\">\r\n        <ag-grid-angular style=\"width: 100%; height: 100%;min-height: 200px;\" [class]=\"themeGrid\"\r\n            [floatingFilter]=\"true\" [rowData]=\"rowData\" [columnDefs]=\"columnDefs\" [gridOptions]=\"gridOptions\"\r\n            [animateRows]=\"true\" [pagination]=\"false\"  [domLayout]=\"domLayout\" [modules]=\"modules\" [undoRedoCellEditing]=\"true\"\r\n            [undoRedoCellEditingLimit]=200 [suppressRowClickSelection]=true [frameworkComponents]=\"frameworkComponents\" [components]=\"components\"\r\n            rowSelection=\"multiple\" multiSortKey=\"key\" (filterModified)=\"onFilterModified()\"\r\n            (cellEditingStopped)=\"onCellEditingStopped($event)\" (cellValueChanged)=\"onCellValueChanged($event)\"\r\n            (gridReady)=\"onGridReady($event)\" (firstDataRendered)=\"firstDataRendered()\">\r\n        </ag-grid-angular>\r\n    </div>\r\n</div>",
                styles: ["@charset \"UTF-8\";input,label{display:inline-block;margin:5px 5px 5px 10px}.mat-flat-button.mat-orange,.mat-icon.mat-orange,.mat-mini-fab.mat-orange,.mat-raised-button.mat-orange{background-color:#ff9300!important;color:#fff!important}.mat-flat-button.mat-orange:disabled,.mat-icon.mat-orange:disabled,.mat-mini-fab.mat-orange:disabled,.mat-raised-button.mat-orange:disabled{background:#ffc97f!important;color:#fff!important}.mat-flat-button.mat-green,.mat-icon.mat-green,.mat-mini-fab.mat-green,.mat-raised-button.mat-green{background-color:#68a225!important;color:#fff!important}.mat-flat-button.mat-green:disabled,.mat-icon.mat-green:disabled,.mat-mini-fab.mat-green:disabled,.mat-raised-button.mat-green:disabled{background-color:#83976c!important;color:#fff!important}.mat-flat-button.mat-red,.mat-icon.mat-red,.mat-mini-fab.mat-red,.mat-raised-button.mat-red{background-color:#bf0000!important;color:#fff!important}.mat-flat-button.mat-red:disabled,.mat-icon.mat-red:disabled,.mat-mini-fab.mat-red:disabled,.mat-raised-button.mat-red:disabled{background-color:#da8c8e!important;color:#fff!important}.validateButton{background-color:#ff9300;color:#fff;margin-top:34px!important;min-width:85px}.deleteButton,.validateButton{-ms-grid-column-align:right!important;height:40px;justify-self:right!important}.deleteButton{border:1px solid #bf0000!important;color:#bf0000;float:inherit!important;min-width:85px!important}.deleteButton:disabled{background-color:inherit!important;border:1px solid rgba(0,0,0,.26)!important;color:rgba(0,0,0,.26) solid 1px!important}.loadButton{-ms-grid-column-align:right!important;border:1px solid #ff9300!important;color:#ff9300;float:inherit!important;height:40px;justify-self:right!important;min-width:85px!important}.loadButton:disabled{background-color:inherit!important;border:1px solid rgba(0,0,0,.26)!important;color:rgba(0,0,0,.26) solid 1px!important}.actionButton,.returnButton{border:1px solid #ff9300!important;color:#ff9300}.actionButton,.newButton,.returnButton,.saveButton{-ms-grid-column-align:right!important;float:inherit!important;height:40px;justify-self:right!important;min-width:85px!important}.newButton,.saveButton{background-color:#68a225;color:#fff}.editDivBtns{height:30px!important;line-height:30px!important;margin-left:10px;text-align:start;width:130px}.actionsDivBtns{height:50px;text-align:end;width:calc(100% - 140px)}.actionsDivBtns,.editDivBtns{display:inline-block!important}.actionsDivBtns .searchGenericInput{display:inline-block!important;height:41px!important;margin:0 5px 5px 10px!important;width:35%!important}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-thumb{background:#eee}\u200B .ag-body-viewport.ag-layout-normal ::-webkit-scrollbar{height:2em;width:2em}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-button{background:#ccc}.ag-body-viewport.ag-layout-normal::-webkit-scrollbar-track-piece{background:#888}.mini-fab{height:28px!important;line-height:22px!important;margin-right:3px!important;margin-top:7px!important;width:28px!important}.mini-fab .mat-button-wrapper{height:24px!important;line-height:22px!important;padding:1px 0!important;width:24px!important}.mini-fab .mat-button-wrapper .mat-icon{font-size:20px;line-height:22px;padding-right:0}.toogleButton{align-items:center;height:40px;margin-right:10px;vertical-align:bottom}"]
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
    loadButton: [{ type: Input }],
    loadButtonDisabled: [{ type: Input }],
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
    load: [{ type: Output }],
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
    DataGridComponent.prototype.loadButton;
    /** @type {?} */
    DataGridComponent.prototype.loadButtonDisabled;
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
    DataGridComponent.prototype.load;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1ncmlkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGF0YS1ncmlkL2RhdGEtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQW9CLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVyRyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRWxDLE9BQU8sRUFBRSxtQkFBbUIsRUFBcUIsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN4RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUM1RixPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUN4RyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUNsRyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDckQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFXcEYsTUFBTSxPQUFPLGlCQUFpQjs7Ozs7O0lBc0Y1QixZQUFtQixNQUFpQixFQUMzQixXQUNDO1FBRlMsV0FBTSxHQUFOLE1BQU0sQ0FBVztRQUMzQixjQUFTLEdBQVQsU0FBUztRQUNSLFVBQUssR0FBTCxLQUFLO3VCQWpGSyxtQkFBbUI7UUFPdkMsb0JBQWUsS0FBSyxDQUFDO1FBQ3JCLDRCQUF1QixLQUFLLENBQUM7MEJBQ2tCLElBQUksR0FBRyxFQUErQjtRQU9yRiwwQkFBcUIsS0FBSyxDQUFDO1FBQzNCLHFCQUFnQixLQUFLLENBQUM7UUFFdEIs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QUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUM5Qzs7O1lBbHlCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLHkyTEFBeUM7O2FBRTFDOzs7O1lBWFEsU0FBUztZQUpULGdCQUFnQjtZQUwwQyxVQUFVOzs7dUNBb0QxRSxLQUFLOytDQUNMLEtBQUs7MENBQ0wsS0FBSzsrQ0FDTCxLQUFLOytDQUNMLEtBQUs7d0NBQ0wsS0FBSzsrQ0FDTCxLQUFLO2tDQUNMLEtBQUs7eUJBQ0wsS0FBSzt5QkFDTCxLQUFLO3FCQUNMLEtBQUs7bUNBQ0wsS0FBSztzQ0FDTCxLQUFLO2lCQUNMLEtBQUs7eUJBQ0wsS0FBSzttQ0FDTCxLQUFLO3lCQUNMLEtBQUs7aUNBQ0wsS0FBSzsyQkFDTCxLQUFLO3lCQUNMLEtBQUs7aUNBQ0wsS0FBSzt3QkFDTCxLQUFLOzJCQUNMLEtBQUs7d0JBQ0wsS0FBSzs2QkFDTCxLQUFLO2dDQUNMLEtBQUs7MkJBQ0wsS0FBSztpQ0FDTCxLQUFLOzRCQUNMLEtBQUs7d0JBQ0wsS0FBSzs4QkFDTCxLQUFLOzBCQUNMLEtBQUs7b0JBQ0wsS0FBSzsrQkFDTCxLQUFLO2tDQUNMLEtBQUs7c0NBQ0wsS0FBSztrQ0FDTCxLQUFLOzZCQUNMLEtBQUs7MEJBQ0wsS0FBSztnREFDTCxLQUFLO3FCQUdMLE1BQU07bUJBQ04sTUFBTTtrQkFDTixNQUFNO2tCQUNOLE1BQU07NkJBQ04sTUFBTTswQkFDTixNQUFNO3dCQUNOLE1BQU07OEJBQ04sTUFBTTt5QkFDTixNQUFNOzZCQUNOLE1BQU07MkJBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFnR3JpZE1vZHVsZSB9IGZyb20gJ0BhZy1ncmlkLWNvbW11bml0eS9hbmd1bGFyJztcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIE5nTW9kdWxlLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBBbGxDb21tdW5pdHlNb2R1bGVzLCBDb2x1bW5BcGksIE1vZHVsZSB9IGZyb20gJ0BhZy1ncmlkLWNvbW11bml0eS9hbGwtbW9kdWxlcyc7XHJcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcclxuaW1wb3J0IHsgQnRuRWRpdFJlbmRlcmVkQ29tcG9uZW50IH0gZnJvbSAnLi4vYnRuLWVkaXQtcmVuZGVyZWQvYnRuLWVkaXQtcmVuZGVyZWQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQnRuQ2hlY2tib3hSZW5kZXJlZENvbXBvbmVudCB9IGZyb20gJy4uL2J0bi1jaGVja2JveC1yZW5kZXJlZC9idG4tY2hlY2tib3gtcmVuZGVyZWQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQnRuQ2hlY2tib3hGaWx0ZXJDb21wb25lbnQgfSBmcm9tICcuLi9idG4tY2hlY2tib3gtZmlsdGVyL2J0bi1jaGVja2JveC1maWx0ZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTWF0RGlhbG9nIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcclxuaW1wb3J0IHsgRGlhbG9nTWVzc2FnZUNvbXBvbmVudCB9IGZyb20gJy4uL2RpYWxvZy1tZXNzYWdlL2RpYWxvZy1tZXNzYWdlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IGZvckVhY2ggfSBmcm9tICdqc3ppcCc7XHJcbmRlY2xhcmUgbGV0ICQ6IGFueTtcclxuXHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtZGF0YS1ncmlkJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vZGF0YS1ncmlkLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9kYXRhLWdyaWQuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGF0YUdyaWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBfZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgX2V2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgX2V2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbjogYW55O1xyXG4gIF9ldmVudFNhdmVBZ0dyaWRTdGF0ZVN1YnNjcmlwdGlvbjogYW55O1xyXG4gIF9ldmVudE1vZGlmeVN0YXR1c09mU2VsZWN0ZWRDZWxsczogYW55O1xyXG4gIG1vZHVsZXM6IE1vZHVsZVtdID0gQWxsQ29tbXVuaXR5TW9kdWxlcztcclxuXHJcblxyXG4gIFVuZGVSZWRvQWN0aW9uc1xyXG4gIHNlYXJjaFZhbHVlOiBzdHJpbmc7XHJcbiAgZ3JpZEFwaTogYW55O1xyXG4gIGdyaWRDb2x1bW5BcGk6IGFueTtcclxuICBzdGF0dXNDb2x1bW4gPSBmYWxzZTtcclxuICBzb21lQ29sdW1uSXNFZGl0YWJsZSA9IGZhbHNlO1xyXG4gIGNoYW5nZXNNYXA6IE1hcDxudW1iZXIsIE1hcDxzdHJpbmcsIG51bWJlcj4+ID0gbmV3IE1hcDxudW1iZXIsIE1hcDxzdHJpbmcsIG51bWJlcj4+KCk7XHJcbiAgLy8gV2Ugd2lsbCBzYXZlIHRoZSBpZCBvZiBlZGl0ZWQgY2VsbHMgYW5kIHRoZSBudW1iZXIgb2YgZWRpdGlvbnMgZG9uZS5cclxuICBwYXJhbXM6IGFueTsgLy8gTGFzdCBwYXJhbWV0ZXJzIG9mIHRoZSBncmlkIChpbiBjYXNlIHdlIGRvIGFwcGx5IGNoYW5nZXMgd2Ugd2lsbCBuZWVkIGl0KSBcclxuICByb3dEYXRhOiBhbnlbXTtcclxuICBjaGFuZ2VDb3VudGVyOiBudW1iZXI7IC8vIE51bWJlciBvZiBlZGl0aW9ucyBkb25lIGFib3ZlIGFueSBjZWxsIFxyXG4gIHByZXZpb3VzQ2hhbmdlQ291bnRlcjogbnVtYmVyOyAvLyBOdW1iZXIgb2YgZGl0aW9ucyBkb25lIGFmdGVyIHRoZSBsYXN0IG1vZGlmaWNhdGlvbihjaGFuZ2VDb3VudGVyKVxyXG4gIHJlZG9Db3VudGVyOiBudW1iZXI7IC8vIE51bWJlciBvZiByZWRvIHdlIGNhbiBkb1xyXG4gIG1vZGlmaWNhdGlvbkNoYW5nZSA9IGZhbHNlO1xyXG4gIHVuZG9Ob0NoYW5nZXMgPSBmYWxzZTsgLy8gQm9vbGVhbiB0aGF0IGluZGljYXRlcyBpZiBhbiB1bmRvIGhhc24ndCBtb2RpZmljYXRpb25zXHJcbiAgZ3JpZE9wdGlvbnM7XHJcbiAgc29tZVN0YXR1c0hhc0NoYW5nZWRUb0RlbGV0ZSA9IGZhbHNlO1xyXG5cclxuICBwdWJsaWMgZG9tTGF5b3V0O1xyXG5cclxuXHJcbiAgQElucHV0KCkgZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG4gIEBJbnB1dCgpIGV2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG4gIEBJbnB1dCgpIGV2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZTxzdHJpbmc+O1xyXG4gIEBJbnB1dCgpIGV2ZW50U2F2ZUFnR3JpZFN0YXRlU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG4gIEBJbnB1dCgpIGV2ZW50TW9kaWZ5U3RhdHVzT2ZTZWxlY3RlZENlbGxzOiBPYnNlcnZhYmxlPHN0cmluZz47XHJcbiAgQElucHV0KCkgZXZlbnRBZGRJdGVtc1N1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZTxib29sZWFuPjtcclxuICBASW5wdXQoKSBldmVudFJlcGxhY2VBbGxJdGVtc1N1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZTxib29sZWFuPjtcclxuICBASW5wdXQoKSBmcmFtZXdvcmtDb21wb25lbnRzOiBhbnk7XHJcbiAgQElucHV0KCkgY29tcG9uZW50czogYW55O1xyXG4gIEBJbnB1dCgpIGNvbHVtbkRlZnM6IGFueVtdO1xyXG4gIEBJbnB1dCgpIGdldEFsbDogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+O1xyXG4gIEBJbnB1dCgpIGRpc2NhcmRDaGFuZ2VzQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGRpc2NhcmROb25SZXZlcnNlU3RhdHVzOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGlkOiBhbnk7XHJcbiAgQElucHV0KCkgdW5kb0J1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBkZWZhdWx0Q29sdW1uU29ydGluZzogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHJlZG9CdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYXBwbHlDaGFuZ2VzQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGRlbGV0ZUJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBsb2FkQnV0dG9uOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQElucHV0KCkgbG9hZEJ1dHRvbkRpc2FibGVkOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIG5ld0J1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBhY3Rpb25CdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYWRkQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHJlZ2lzdGVyQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIG5ld1N0YXR1c1JlZ2lzdGVyOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgZ2xvYmFsU2VhcmNoOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGNoYW5nZUhlaWdodEJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBkZWZhdWx0SGVpZ2h0OiBhbnk7XHJcbiAgQElucHV0KCkgdGhlbWVHcmlkOiBhbnk7XHJcbiAgQElucHV0KCkgc2luZ2xlU2VsZWN0aW9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIG5vbkVkaXRhYmxlOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHRpdGxlOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgaGlkZUV4cG9ydEJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBoaWRlRHVwbGljYXRlQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGhpZGVTZWFyY2hSZXBsYWNlQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGFkZEZpZWxkUmVzdHJpY3Rpb246IGFueTtcclxuICBASW5wdXQoKSBhbGxOZXdFbGVtZW50czogYW55O1xyXG4gIEBJbnB1dCgpIGN1cnJlbnREYXRhOiBBcnJheTxhbnk+ID0gbnVsbDtcclxuICBASW5wdXQoKSBmaWVsZFJlc3RyaWN0aW9uV2l0aERpZmZlcmVudE5hbWU6IHN0cmluZztcclxuXHJcblxyXG4gIEBPdXRwdXQoKSByZW1vdmU6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIGxvYWQ6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIG5ldzogRXZlbnRFbWl0dGVyPG51bWJlcj47XHJcbiAgQE91dHB1dCgpIGFkZDogRXZlbnRFbWl0dGVyPGFueVtdPjtcclxuICBAT3V0cHV0KCkgZGlzY2FyZENoYW5nZXM6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIHNlbmRDaGFuZ2VzOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG4gIEBPdXRwdXQoKSBkdXBsaWNhdGU6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIGdldFNlbGVjdGVkUm93czogRXZlbnRFbWl0dGVyPGFueVtdPjtcclxuICBAT3V0cHV0KCkgZ2V0QWxsUm93czogRXZlbnRFbWl0dGVyPHsgZGF0YTogYW55W10sIGV2ZW50OiBzdHJpbmcgfT47XHJcbiAgQE91dHB1dCgpIGdldEFnR3JpZFN0YXRlOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG4gIEBPdXRwdXQoKSBncmlkTW9kaWZpZWQ6IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkaWFsb2c6IE1hdERpYWxvZyxcclxuICAgIHB1YmxpYyB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGVsUmVmOiBFbGVtZW50UmVmKSB7XHJcbiAgICB0aGlzLnRyYW5zbGF0ZSA9IHRyYW5zbGF0ZTtcclxuXHJcbiAgICB0aGlzLmZyYW1ld29ya0NvbXBvbmVudHMgPSB7XHJcbiAgICAgIGJ0bkVkaXRSZW5kZXJlckNvbXBvbmVudDogQnRuRWRpdFJlbmRlcmVkQ29tcG9uZW50LFxyXG4gICAgICBidG5DaGVja2JveFJlbmRlcmVyQ29tcG9uZW50OiBCdG5DaGVja2JveFJlbmRlcmVkQ29tcG9uZW50LFxyXG4gICAgICBidG5DaGVja2JveEZpbHRlckNvbXBvbmVudDogQnRuQ2hlY2tib3hGaWx0ZXJDb21wb25lbnRcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5jb21wb25lbnRzID0ge1xyXG4gICAgICBkYXRlUGlja2VyOiB0aGlzLmdldERhdGVQaWNrZXIoKVxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgdGhpcy5yZW1vdmUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmxvYWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLm5ldyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuYWRkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5kaXNjYXJkQ2hhbmdlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuc2VuZENoYW5nZXMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmdldFNlbGVjdGVkUm93cyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuZHVwbGljYXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5nZXRBbGxSb3dzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5ncmlkTW9kaWZpZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmNoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5yZWRvQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLmdyaWRPcHRpb25zID0ge1xyXG4gICAgICBkZWZhdWx0Q29sRGVmOiB7XHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZmxleDogMSxcclxuICAgICAgICBmaWx0ZXI6IHRydWUsXHJcbiAgICAgICAgZWRpdGFibGU6ICF0aGlzLm5vbkVkaXRhYmxlLFxyXG4gICAgICAgIHN1cHByZXNzTWVudTogdHJ1ZSxcclxuICAgICAgICByZXNpemFibGU6IHRydWUsXHJcbiAgICAgICAgY2VsbFN0eWxlOiAocGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICBpZiAocGFyYW1zLnZhbHVlICYmIHBhcmFtcy5jb2xEZWYuZWRpdGFibGUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hhbmdlc01hcC5oYXMocGFyYW1zLm5vZGUuaWQpICYmIHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmhhcyhwYXJhbXMuY29sRGVmLmZpZWxkKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiB7ICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNFOEYxREUnIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHsgJ2JhY2tncm91bmQtY29sb3InOiAnd2hpdGUnIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4geyAnYmFja2dyb3VuZC1jb2xvcic6ICd3aGl0ZScgfTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICByb3dTZWxlY3Rpb246ICdtdWx0aXBsZScsXHJcbiAgICAgIHNpbmdsZUNsaWNrRWRpdDogdHJ1ZSxcclxuICAgICAgLy8gc3VwcHJlc3NIb3Jpem9udGFsU2Nyb2xsOiB0cnVlLFxyXG4gICAgICBsb2NhbGVUZXh0RnVuYzogKGtleTogc3RyaW5nLCBkZWZhdWx0VmFsdWU6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KGtleSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGEgPT09IGtleSA/IGRlZmF1bHRWYWx1ZSA6IGRhdGE7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICB9XHJcblxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuXHJcbiAgICBpZiAodGhpcy5ldmVudFJlZnJlc2hTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5fZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uID0gdGhpcy5ldmVudFJlZnJlc2hTdWJzY3JpcHRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLmNoYW5nZXNNYXAuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLnNvbWVTdGF0dXNIYXNDaGFuZ2VkVG9EZWxldGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLmdldEVsZW1lbnRzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5fZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbWl0U2VsZWN0ZWRSb3dzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoZXZlbnQ6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHRoaXMuZW1pdEFsbFJvd3MoZXZlbnQpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5ldmVudFNhdmVBZ0dyaWRTdGF0ZVN1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLl9ldmVudFNhdmVBZ0dyaWRTdGF0ZVN1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRTYXZlQWdHcmlkU3RhdGVTdWJzY3JpcHRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLnNhdmVBZ0dyaWRTdGF0ZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5ldmVudE1vZGlmeVN0YXR1c09mU2VsZWN0ZWRDZWxscykge1xyXG4gICAgICB0aGlzLl9ldmVudE1vZGlmeVN0YXR1c09mU2VsZWN0ZWRDZWxscyA9IHRoaXMuZXZlbnRNb2RpZnlTdGF0dXNPZlNlbGVjdGVkQ2VsbHMuc3Vic2NyaWJlKChzdGF0dXM6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHRoaXMubW9kaWZ5U3RhdHVzU2VsZWN0ZWQoc3RhdHVzKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZXZlbnRBZGRJdGVtc1N1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLmV2ZW50QWRkSXRlbXNTdWJzY3JpcHRpb24uc3Vic2NyaWJlKFxyXG4gICAgICAgIChpdGVtczogYW55KSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmFkZEl0ZW1zKGl0ZW1zKTtcclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5ldmVudFJlcGxhY2VBbGxJdGVtc1N1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLmV2ZW50UmVwbGFjZUFsbEl0ZW1zU3Vic2NyaXB0aW9uLnN1YnNjcmliZShcclxuICAgICAgICAoaXRlbXM6IGFueSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5yZXBsYWNlQWxsSXRlbXMoaXRlbXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIGZpcnN0RGF0YVJlbmRlcmVkKCk6IHZvaWQge1xyXG4gICAgaWYgKGxvY2FsU3RvcmFnZS5hZ0dyaWRTdGF0ZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgbGV0IGFnR3JpZFN0YXRlID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuYWdHcmlkU3RhdGUpXHJcbiAgICAgIGlmIChhZ0dyaWRTdGF0ZS5pZEFnR3JpZCAhPSB1bmRlZmluZWQgJiYgYWdHcmlkU3RhdGUuaWRBZ0dyaWQgPT0gdGhpcy5pZCkge1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS5zZXRGaWx0ZXJNb2RlbChhZ0dyaWRTdGF0ZS5maWx0ZXJTdGF0ZSk7XHJcbiAgICAgICAgdGhpcy5ncmlkQ29sdW1uQXBpLnNldENvbHVtblN0YXRlKGFnR3JpZFN0YXRlLmNvbFN0YXRlKTtcclxuICAgICAgICB0aGlzLmdyaWRBcGkuc2V0U29ydE1vZGVsKGFnR3JpZFN0YXRlLnNvcnRTdGF0ZSk7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hWYWx1ZSA9IGFnR3JpZFN0YXRlLnZhbHVlU2VhcmNoR2VuZXJpYztcclxuICAgICAgICB0aGlzLnF1aWNrU2VhcmNoKCk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBZ0dyaWRTdGF0ZSgpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaWQgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBZ0dyaWRTdGF0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkdyaWRSZWFkeShwYXJhbXMpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnNpbmdsZVNlbGVjdGlvbikgeyB0aGlzLmdyaWRPcHRpb25zLnJvd1NlbGVjdGlvbiA9ICdzaW5nbGUnIH1cclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgdGhpcy5ncmlkQXBpID0gcGFyYW1zLmFwaTtcclxuICAgIHRoaXMuZ3JpZENvbHVtbkFwaSA9IHBhcmFtcy5jb2x1bW5BcGk7XHJcbiAgICBmb3IgKGNvbnN0IGNvbCBvZiB0aGlzLmNvbHVtbkRlZnMpIHtcclxuICAgICAgaWYgKCF0aGlzLnNvbWVDb2x1bW5Jc0VkaXRhYmxlICYmIGNvbC5lZGl0YWJsZSkgeyB0aGlzLnNvbWVDb2x1bW5Jc0VkaXRhYmxlID0gdHJ1ZSB9XHJcbiAgICAgIGlmIChjb2wuZmllbGQgPT09ICdzdGF0dXMnKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0dXNDb2x1bW4gPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLmdldEVsZW1lbnRzKCk7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLmNvbHVtbkRlZnMpO1xyXG4gICAgaWYgKHRoaXMuZGVmYXVsdENvbHVtblNvcnRpbmcpIHtcclxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuZGVmYXVsdENvbHVtblNvcnRpbmcpKSB7XHJcbiAgICAgICAgY29uc3Qgc29ydE1vZGVsID0gW1xyXG4gICAgICAgICAgeyBjb2xJZDogdGhpcy5kZWZhdWx0Q29sdW1uU29ydGluZywgc29ydDogJ2FzYycgfVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdGhpcy5ncmlkQXBpLnNldFNvcnRNb2RlbChzb3J0TW9kZWwpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGxldCBzb3J0TW9kZWwgPSBbXTtcclxuICAgICAgICB0aGlzLmRlZmF1bHRDb2x1bW5Tb3J0aW5nLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICBzb3J0TW9kZWwucHVzaCh7IGNvbElkOiBlbGVtZW50LCBzb3J0OiAnYXNjJyB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS5zZXRTb3J0TW9kZWwoc29ydE1vZGVsKTtcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgICAgdGhpcy5jaGFuZ2VIZWlnaHQodGhpcy5kZWZhdWx0SGVpZ2h0KVxyXG4gIH1cclxuXHJcblxyXG4gIGdldERhdGVQaWNrZXIoKSB7XHJcbiAgICBmdW5jdGlvbiBEYXRlcGlja2VyKCkgeyB9XHJcbiAgICBEYXRlcGlja2VyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICB0aGlzLmVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgIHRoaXMuZUlucHV0LnZhbHVlID0gcGFyYW1zLnZhbHVlO1xyXG4gICAgICB0aGlzLmVJbnB1dC5jbGFzc0xpc3QuYWRkKCdhZy1pbnB1dCcpO1xyXG4gICAgICB0aGlzLmVJbnB1dC5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XHJcbiAgICAgICQodGhpcy5lSW5wdXQpLmRhdGVwaWNrZXIoeyBkYXRlRm9ybWF0OiAnbW0vZGQveXknIH0pO1xyXG4gICAgfTtcclxuICAgIERhdGVwaWNrZXIucHJvdG90eXBlLmdldEd1aSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZUlucHV0O1xyXG4gICAgfTtcclxuICAgIERhdGVwaWNrZXIucHJvdG90eXBlLmFmdGVyR3VpQXR0YWNoZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuZUlucHV0LmZvY3VzKCk7XHJcbiAgICAgIHRoaXMuZUlucHV0LnNlbGVjdCgpO1xyXG4gICAgfTtcclxuICAgIERhdGVwaWNrZXIucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5lSW5wdXQudmFsdWU7XHJcbiAgICB9O1xyXG4gICAgRGF0ZXBpY2tlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHsgfTtcclxuICAgIERhdGVwaWNrZXIucHJvdG90eXBlLmlzUG9wdXAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gRGF0ZXBpY2tlcjtcclxuICB9XHJcblxyXG4gIGFyZVJvd3NTZWxlY3RlZCgpOiBCb29sZWFuIHtcclxuICAgIHJldHVybiAodGhpcy5ncmlkQXBpICE9IG51bGwgJiYgdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKS5sZW5ndGggPiAwKSA/IHRydWUgOiBmYWxzZTtcclxuICB9XHJcblxyXG5cclxuICBlbWl0U2VsZWN0ZWRSb3dzKCk6IHZvaWQge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IHRoaXMuZ3JpZEFwaS5nZXRTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICBjb25zdCBzZWxlY3RlZERhdGEgPSBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IG5vZGUuZGF0YSk7XHJcbiAgICB0aGlzLmdldFNlbGVjdGVkUm93cy5lbWl0KHNlbGVjdGVkRGF0YSk7XHJcbiAgfVxyXG5cclxuICBlbWl0QWxsUm93cyhldmVudDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAvLyBsZXQgcm93RGF0YSA9IFtdO1xyXG4gICAgLy8gdGhpcy5ncmlkQXBpLmZvckVhY2hOb2RlKG5vZGUgPT4gcm93RGF0YS5wdXNoKG5vZGUuZGF0YSkpO1xyXG4gICAgdGhpcy5nZXRBbGxSb3dzLmVtaXQoeyBkYXRhOiB0aGlzLmdldEFsbEN1cnJlbnREYXRhKCksIGV2ZW50OiBldmVudCB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0QWxsQ3VycmVudERhdGEoKTogQXJyYXk8YW55PiB7XHJcbiAgICBsZXQgcm93RGF0YSA9IFtdO1xyXG4gICAgdGhpcy5ncmlkQXBpLmZvckVhY2hOb2RlKG5vZGUgPT4gcm93RGF0YS5wdXNoKG5vZGUuZGF0YSkpO1xyXG4gICAgcmV0dXJuIHJvd0RhdGE7XHJcbiAgfVxyXG5cclxuICBtb2RpZnlTdGF0dXNTZWxlY3RlZChzdGF0dXM/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGxldCBuZXdTdGF0dXMgPSBzdGF0dXMgPyBzdGF0dXMgOiB0aGlzLm5ld1N0YXR1c1JlZ2lzdGVyO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IHRoaXMuZ3JpZEFwaS5nZXRTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IHtcclxuICAgICAgbm9kZS5kYXRhLnN0YXR1cyA9IG5ld1N0YXR1cztcclxuICAgICAgbm9kZS5zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLmdyaWRBcGkucmVkcmF3Um93cygpO1xyXG4gIH1cclxuXHJcbiAgc2F2ZUFnR3JpZFN0YXRlKCk6IHZvaWQge1xyXG4gICAgbGV0IGFnR3JpZFN0YXRlID0ge1xyXG4gICAgICBpZEFnR3JpZDogdGhpcy5pZCxcclxuICAgICAgY29sU3RhdGU6IHRoaXMuZ3JpZENvbHVtbkFwaS5nZXRDb2x1bW5TdGF0ZSgpLFxyXG4gICAgICBmaWx0ZXJTdGF0ZTogdGhpcy5ncmlkQXBpLmdldEZpbHRlck1vZGVsKCksXHJcbiAgICAgIHNvcnRTdGF0ZTogdGhpcy5ncmlkQXBpLmdldFNvcnRNb2RlbCgpLFxyXG4gICAgICB2YWx1ZVNlYXJjaEdlbmVyaWM6IHRoaXMuc2VhcmNoVmFsdWVcclxuICAgIH07XHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhZ0dyaWRTdGF0ZVwiLCBKU09OLnN0cmluZ2lmeShhZ0dyaWRTdGF0ZSkpO1xyXG5cclxuICB9XHJcbiAgcmVtb3ZlQWdHcmlkU3RhdGUoKTogdm9pZCB7XHJcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFnR3JpZFN0YXRlXCIpXHJcbiAgfVxyXG5cclxuICBnZXRDb2x1bW5LZXlzQW5kSGVhZGVycyhjb2x1bW5rZXlzOiBBcnJheTxhbnk+KTogU3RyaW5nIHtcclxuICAgIGxldCBoZWFkZXI6IEFycmF5PGFueT4gPSBbXTtcclxuICAgIGlmICh0aGlzLmNvbHVtbkRlZnMubGVuZ3RoID09IDApIHsgcmV0dXJuICcnIH07XHJcblxyXG4gICAgbGV0IGFsbENvbHVtbktleXMgPSB0aGlzLmdyaWRPcHRpb25zLmNvbHVtbkFwaS5nZXRBbGxEaXNwbGF5ZWRDb2x1bW5zKCk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhhbGxDb2x1bW5LZXlzKTtcclxuICAgIGFsbENvbHVtbktleXMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgaWYgKGVsZW1lbnQudXNlclByb3ZpZGVkQ29sRGVmLmhlYWRlck5hbWUgIT09ICcnKSB7XHJcbiAgICAgICAgY29sdW1ua2V5cy5wdXNoKGVsZW1lbnQudXNlclByb3ZpZGVkQ29sRGVmLmZpZWxkKTtcclxuICAgICAgICBoZWFkZXIucHVzaChlbGVtZW50LnVzZXJQcm92aWRlZENvbERlZi5oZWFkZXJOYW1lKTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gaGVhZGVyLmpvaW4oXCIsXCIpO1xyXG4gIH1cclxuXHJcblxyXG4gIGV4cG9ydERhdGEoKTogdm9pZCB7XHJcbiAgICBsZXQgY29sdW1ua2V5czogQXJyYXk8YW55PiA9IFtdO1xyXG4gICAgbGV0IGN1c3RvbUhlYWRlcjogU3RyaW5nID0gJyc7XHJcbiAgICBjdXN0b21IZWFkZXIgPSB0aGlzLmdldENvbHVtbktleXNBbmRIZWFkZXJzKGNvbHVtbmtleXMpXHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICBvbmx5U2VsZWN0ZWQ6IHRydWUsXHJcbiAgICAgIGNvbHVtbktleXM6IGNvbHVtbmtleXMsXHJcbiAgICAgIGN1c3RvbUhlYWRlcjogY3VzdG9tSGVhZGVyLFxyXG4gICAgICBza2lwSGVhZGVyOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgdGhpcy5ncmlkQXBpLmV4cG9ydERhdGFBc0NzdihwYXJhbXMpO1xyXG4gIH1cclxuXHJcbiAgcXVpY2tTZWFyY2goKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc2V0UXVpY2tGaWx0ZXIodGhpcy5zZWFyY2hWYWx1ZSk7XHJcbiAgfVxyXG5cclxuICBnZXRFbGVtZW50cygpOiB2b2lkIHtcclxuICAgIHRoaXMuZ2V0QWxsKClcclxuICAgICAgLnN1YnNjcmliZSgoaXRlbXMpID0+IHtcclxuICAgICAgICBsZXQgc3RhdHVzID0gdGhpcy5hbGxOZXdFbGVtZW50cyA/ICdwZW5kaW5nQ3JlYXRpb24nIDogJ3N0YXR1c09LJ1xyXG4gICAgICAgIGxldCBuZXdJdGVtcyA9IFtdO1xyXG4gICAgICAgIGxldCBjb25kaXRpb24gPSAodGhpcy5hZGRGaWVsZFJlc3RyaWN0aW9uKSA/IHRoaXMuYWRkRmllbGRSZXN0cmljdGlvbiA6ICdpZCc7XHJcbiAgICAgICAgaXRlbXMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgIGlmICh0aGlzLnN0YXR1c0NvbHVtbikge1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5zdGF0dXMgIT0gXCJub3RBdmFpbGFibGVcIiAmJiBlbGVtZW50LnN0YXR1cyAhPSBcInBlbmRpbmdDcmVhdGlvblwiICYmIGVsZW1lbnQuc3RhdHVzICE9IFwicGVuZGluZ1JlZ2lzdHJhdGlvblwiICYmIGVsZW1lbnQuc3RhdHVzICE9IFwidW5yZWdpc3RlcmVkTGF5ZXJcIikge1xyXG4gICAgICAgICAgICAgIGVsZW1lbnQuc3RhdHVzID0gc3RhdHVzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuYWxsTmV3RWxlbWVudHMpIHsgZWxlbWVudC5uZXcgPSB0cnVlOyB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodGhpcy5jdXJyZW50RGF0YSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0VsZW1lbnRBbGxvd2VkVG9BZGQoY29uZGl0aW9uLCBlbGVtZW50LCB0aGlzLmN1cnJlbnREYXRhKSkge1xyXG4gICAgICAgICAgICAgIG5ld0l0ZW1zLnB1c2goZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGlmKHRoaXMuc3RhdHVzQ29sdW1uKXtcclxuICAgICAgICAvLyAgIGxldCBzdGF0dXMgPSB0aGlzLmFsbE5ld0VsZW1lbnRzPydwZW5kaW5nQ3JlYXRpb24nOidzdGF0dXNPSydcclxuICAgICAgICAvLyAgIGl0ZW1zLmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgLy8gICAgIGlmKGVsZW1lbnQuc3RhdHVzICE9IFwibm90QXZhaWxhYmxlXCIgJiYgZWxlbWVudC5zdGF0dXMgIT0gXCJwZW5kaW5nQ3JlYXRpb25cIiAmJiBlbGVtZW50LnN0YXR1cyAhPSBcInBlbmRpbmdSZWdpc3RyYXRpb25cIiAmJiBlbGVtZW50LnN0YXR1cyAhPSBcInVucmVnaXN0ZXJlZExheWVyXCIpe1xyXG4gICAgICAgIC8vICAgICAgIGVsZW1lbnQuc3RhdHVzPXN0YXR1c1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gICAgIGlmKHRoaXMuYWxsTmV3RWxlbWVudHMpIHsgZWxlbWVudC5uZXcgPSB0cnVlOyB9XHJcbiAgICAgICAgLy8gICB9KTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgdGhpcy5yb3dEYXRhID0gdGhpcy5jdXJyZW50RGF0YSA/IG5ld0l0ZW1zIDogaXRlbXM7XHJcbiAgICAgICAgdGhpcy5ncmlkQXBpLnNldFJvd0RhdGEodGhpcy5yb3dEYXRhKTtcclxuICAgICAgICB0aGlzLnNldFNpemUoKVxyXG4gICAgICAgIC8vIHRoaXMuZ3JpZEFwaS5zaXplQ29sdW1uc1RvRml0KClcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnJvd0RhdGEpO1xyXG5cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRTaXplKCkge1xyXG5cclxuICAgIHZhciBhbGxDb2x1bW5JZHMgPSBbXTtcclxuICAgIGxldCBjb2x1bW5zID0gdGhpcy5ncmlkT3B0aW9ucy5jb2x1bW5BcGkuZ2V0QWxsQ29sdW1ucygpO1xyXG4gICAgY29sdW1ucy5mb3JFYWNoKGZ1bmN0aW9uIChjb2x1bW4pIHtcclxuICAgICAgYWxsQ29sdW1uSWRzLnB1c2goY29sdW1uLmNvbElkKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZ3JpZE9wdGlvbnMuY29sdW1uQXBpLmF1dG9TaXplQ29sdW1ucyhhbGxDb2x1bW5JZHMpO1xyXG5cclxuICAgIGxldCBncmlkID0gdGhpcy5ncmlkT3B0aW9ucy5hcGlcclxuICAgIGxldCBhdmFpbGFibGVXaWR0aCA9IGdyaWQuZ3JpZFBhbmVsLmVCb2R5Vmlld3BvcnQuY2xpZW50V2lkdGg7XHJcblxyXG4gICAgbGV0IHVzZWRXaWR0aCA9IGdyaWQuZ3JpZFBhbmVsLmNvbHVtbkNvbnRyb2xsZXIuZ2V0V2lkdGhPZkNvbHNJbkxpc3QoY29sdW1ucyk7XHJcblxyXG4gICAgaWYgKHVzZWRXaWR0aCA8IGF2YWlsYWJsZVdpZHRoKSB7XHJcbiAgICAgIGdyaWQuc2l6ZUNvbHVtbnNUb0ZpdCgpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIHJlcGxhY2VBbGxJdGVtcyhuZXdJdGVtczogYW55W10pOnZvaWQge1xyXG4gICAgdGhpcy5yb3dEYXRhID0gW107XHJcbiAgICB0aGlzLmFkZEl0ZW1zKG5ld0l0ZW1zKTtcclxuICB9XHJcblxyXG4gIGFkZEl0ZW1zKG5ld0l0ZW1zOiBhbnlbXSk6IHZvaWQge1xyXG4gICAgY29uc29sZS5sb2cobmV3SXRlbXMpO1xyXG4gICAgbGV0IGl0ZW1zVG9BZGQ6IEFycmF5PGFueT4gPSBbXTtcclxuICAgIGxldCBjb25kaXRpb24gPSAodGhpcy5hZGRGaWVsZFJlc3RyaWN0aW9uKSA/IHRoaXMuYWRkRmllbGRSZXN0cmljdGlvbiA6ICdpZCc7XHJcblxyXG5cclxuICAgIG5ld0l0ZW1zLmZvckVhY2goaXRlbSA9PiB7XHJcblxyXG4gICAgICBpZiAodGhpcy5jaGVja0VsZW1lbnRBbGxvd2VkVG9BZGQoY29uZGl0aW9uLCBpdGVtLCB0aGlzLnJvd0RhdGEpKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzQ29sdW1uKSB7XHJcbiAgICAgICAgICBpdGVtLnN0YXR1cyA9ICdwZW5kaW5nQ3JlYXRpb24nXHJcbiAgICAgICAgICBpdGVtLm5ld0l0ZW0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpdGVtc1RvQWRkLnB1c2goaXRlbSk7XHJcbiAgICAgICAgdGhpcy5yb3dEYXRhLnB1c2goaXRlbSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYEl0ZW0gYWxyZWFkeSBleGlzdHNgKVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHRoaXMuZ3JpZEFwaS51cGRhdGVSb3dEYXRhKHsgYWRkOiBpdGVtc1RvQWRkIH0pO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKHRoaXMuY29sdW1uRGVmcyk7XHJcbiAgICAvLyBwYXJhbXMub2xkVmFsdWUhPXVuZGVmaW5lZFxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVja0VsZW1lbnRBbGxvd2VkVG9BZGQoY29uZGl0aW9uLCBpdGVtLCBkYXRhKSB7XHJcblxyXG4gICAgbGV0IGZpbmFsQWRkaXRpb24gPSB0cnVlO1xyXG5cclxuICAgIGlmIChBcnJheS5pc0FycmF5KGNvbmRpdGlvbikpIHtcclxuXHJcbiAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgZGF0YSkge1xyXG4gICAgICAgIGxldCBjYW5BZGQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgY3VycmVudENvbmRpdGlvbiBvZiBjb25kaXRpb24pIHtcclxuICAgICAgICAgIGlmIChlbGVtZW50W2N1cnJlbnRDb25kaXRpb25dICE9IGl0ZW1bY3VycmVudENvbmRpdGlvbl0pIHtcclxuICAgICAgICAgICAgY2FuQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghY2FuQWRkKSB7XHJcbiAgICAgICAgICBmaW5hbEFkZGl0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGZpbmFsQWRkaXRpb247XHJcblxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGlmICh0aGlzLmZpZWxkUmVzdHJpY3Rpb25XaXRoRGlmZmVyZW50TmFtZSkge1xyXG4gICAgICAgIHJldHVybiAoaXRlbVtjb25kaXRpb25dID09IHVuZGVmaW5lZCB8fCAoZGF0YS5maW5kKGVsZW1lbnQgPT4gZWxlbWVudFt0aGlzLmZpZWxkUmVzdHJpY3Rpb25XaXRoRGlmZmVyZW50TmFtZV0gPT0gaXRlbVtjb25kaXRpb25dKSkgPT0gdW5kZWZpbmVkKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiAoaXRlbVtjb25kaXRpb25dID09IHVuZGVmaW5lZCB8fCAoZGF0YS5maW5kKGVsZW1lbnQgPT4gZWxlbWVudFtjb25kaXRpb25dID09IGl0ZW1bY29uZGl0aW9uXSkpID09IHVuZGVmaW5lZClcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuXHJcbiAgY2hhbmdlSGVpZ2h0KHZhbHVlKSB7XHJcblxyXG4gICAgICAvLyBpZih2YWx1ZSA9PSBcIm1heFwiKXtcclxuICAgICAgLy8gICB0aGlzLmdyaWRBcGkuc2V0RG9tTGF5b3V0KFwiYXV0b0hlaWdodFwiKTtcclxuICAgICAgLy8gICBsZXQgcGl4ZWxzID0gYCR7ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNteUdyaWRcIikuc2Nyb2xsSGVpZ2h0fXB4YDtcclxuICAgICAgLy8gICB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZS5oZWlnaHQgPSBwaXhlbHM7XHJcbiAgICAgIC8vICAgdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3MoKTtcclxuICAgICAgLy8gfVxyXG4gICAgICAvLyBlbHNle1xyXG4gICAgICAgIC8vIHRoaXMuZ3JpZEFwaS5zZXREb21MYXlvdXQoXCJcIik7IC8vIE5lZWRlZCBpZiB3ZSBoYXZlIHNldCBkb20gdG8gYXV0b0hlaWdodFxyXG5cclxuICAgICAgICBpZih2YWx1ZSAhPSAnZGVmYXVsdCcgKXtcclxuICAgICAgICAgIGxldCBwaXhlbHMgPSBcIlwiO1xyXG4gICAgICAgICAgaWYgKHZhbHVlID09PSAnMTAnKSB7XHJcbiAgICAgICAgICAgIHBpeGVscyA9IFwiMzUwcHhcIlxyXG4gICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJzI1Jykge1xyXG4gICAgICAgICAgICBwaXhlbHMgPSBcIjgwMHB4XCJcclxuICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICc1MCcpIHtcclxuICAgICAgICAgICAgcGl4ZWxzID0gXCIxNDUwcHhcIlxyXG4gICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJzEwMCcpIHtcclxuICAgICAgICAgICAgcGl4ZWxzID0gXCIyODgwcHhcIlxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgcGl4ZWxzID0gXCIzNTBweFwiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LnN0eWxlLmhlaWdodCA9IHBpeGVscztcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgXHJcbiAgfVxyXG5cclxuICByZW1vdmVEYXRhKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSB0aGlzLmdyaWRBcGkuZ2V0U2VsZWN0ZWROb2RlcygpO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWREYXRhID0gc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiBub2RlLmRhdGEpO1xyXG4gICAgdGhpcy5yZW1vdmUuZW1pdChzZWxlY3RlZERhdGEpO1xyXG5cclxuICAgIGlmICh0aGlzLnN0YXR1c0NvbHVtbikge1xyXG4gICAgICBjb25zdCBzZWxlY3RlZFJvd3MgPSBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IG5vZGUuaWQpO1xyXG4gICAgICBpZiAoc2VsZWN0ZWRSb3dzLmxlbmd0aCA+IDApIHsgdGhpcy5zb21lU3RhdHVzSGFzQ2hhbmdlZFRvRGVsZXRlID0gdHJ1ZTsgfVxyXG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIHNlbGVjdGVkUm93cykge1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS5nZXRSb3dOb2RlKGlkKS5kYXRhLnN0YXR1cyA9ICdwZW5kaW5nRGVsZXRlJztcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmdyaWRPcHRpb25zLmFwaS5yZWZyZXNoQ2VsbHMoKTtcclxuICAgIH1cclxuICAgIHRoaXMuZ3JpZE9wdGlvbnMuYXBpLmRlc2VsZWN0QWxsKCk7XHJcbiAgfVxyXG5cclxuICBsb2FkRGF0YUJ1dHRvbigpOnZvaWR7XHJcbiAgICB0aGlzLmxvYWQuZW1pdCgpO1xyXG4gIH1cclxuXHJcbiAgbmV3RGF0YSgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICB0aGlzLm5ldy5lbWl0KC0xKTtcclxuICB9XHJcblxyXG4gIG9uQWRkQnV0dG9uQ2xpY2tlZCgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICB0aGlzLmFkZC5lbWl0KHRoaXMuZ2V0QWxsQ3VycmVudERhdGEoKSk7XHJcbiAgfVxyXG5cclxuICBvbkR1cGxpY2F0ZUJ1dHRvbkNsaWNrZWQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgaWYgKHRoaXMuY2hhbmdlQ291bnRlciA+IDApIHtcclxuICAgICAgY29uc3QgZGlhbG9nUmVmID0gdGhpcy5kaWFsb2cub3BlbihEaWFsb2dNZXNzYWdlQ29tcG9uZW50KTtcclxuICAgICAgZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLnRpdGxlID0gdGhpcy50cmFuc2xhdGUuaW5zdGFudCgnY2F1dGlvbicpXHJcbiAgICAgIGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5tZXNzYWdlID0gdGhpcy50cmFuc2xhdGUuaW5zdGFudCgnZHVwbGljYXRlTWVzc2FnZScpXHJcbiAgICAgIGRpYWxvZ1JlZi5hZnRlckNsb3NlZCgpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgIGlmIChyZXN1bHQuZXZlbnQgPT09ICdBY2NlcHQnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSB0aGlzLmdyaWRBcGkuZ2V0U2VsZWN0ZWROb2RlcygpO1xyXG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZERhdGEgPSBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IG5vZGUuZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuZHVwbGljYXRlLmVtaXQoc2VsZWN0ZWREYXRhKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKTtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWREYXRhID0gc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiBub2RlLmRhdGEpO1xyXG4gICAgICB0aGlzLmR1cGxpY2F0ZS5lbWl0KHNlbGVjdGVkRGF0YSk7XHJcbiAgICAgIHRoaXMuZ3JpZE9wdGlvbnMuYXBpLmRlc2VsZWN0QWxsKCk7XHJcblxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIGFwcGx5Q2hhbmdlcygpOiB2b2lkIHtcclxuICAgIGNvbnN0IGl0ZW1zQ2hhbmdlZDogYW55W10gPSBbXTtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBvZiB0aGlzLmNoYW5nZXNNYXAua2V5cygpKSB7XHJcbiAgICAgIGl0ZW1zQ2hhbmdlZC5wdXNoKHRoaXMuZ3JpZEFwaS5nZXRSb3dOb2RlKGtleSkuZGF0YSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnNlbmRDaGFuZ2VzLmVtaXQoaXRlbXNDaGFuZ2VkKTtcclxuICAgIHRoaXMuZ3JpZE1vZGlmaWVkLmVtaXQoZmFsc2UpO1xyXG4gICAgdGhpcy5jaGFuZ2VzTWFwLmNsZWFyKCk7XHJcbiAgICB0aGlzLmNoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5yZWRvQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnNvbWVTdGF0dXNIYXNDaGFuZ2VkVG9EZWxldGUgPSBmYWxzZTtcclxuICAgIC8vIHRoaXMucGFyYW1zLmNvbERlZi5jZWxsU3R5bGUgPSB7IGJhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnIH07XHJcbiAgICB0aGlzLmdyaWRBcGkucmVkcmF3Um93cygpO1xyXG4gIH1cclxuXHJcblxyXG5cclxuICBkZWxldGVDaGFuZ2VzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIGxldCBuZXdFbGVtZW50c0FjdGl2ZWQgPSB0aGlzLmFsbE5ld0VsZW1lbnRzO1xyXG5cclxuICAgIHdoaWxlICh0aGlzLmNoYW5nZUNvdW50ZXIgPiAwKSB7XHJcbiAgICAgIHRoaXMudW5kbygpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY2hhbmdlc01hcC5jbGVhcigpO1xyXG4gICAgLy90aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuXHJcbiAgICBpZiAodGhpcy5zdGF0dXNDb2x1bW4gJiYgIXRoaXMuZGlzY2FyZE5vblJldmVyc2VTdGF0dXMpIHtcclxuICAgICAgbGV0IHJvd3NXaXRoU3RhdHVzTW9kaWZpZWQgPSBbXTtcclxuICAgICAgdGhpcy5ncmlkQXBpLmZvckVhY2hOb2RlKGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICAgICAgaWYgKG5vZGUuZGF0YS5zdGF0dXMgPT09ICdwZW5kaW5nTW9kaWZ5JyB8fCBub2RlLmRhdGEuc3RhdHVzID09PSAncGVuZGluZ0RlbGV0ZScpIHtcclxuICAgICAgICAgIGlmIChub2RlLmRhdGEuc3RhdHVzID09PSAncGVuZGluZ0RlbGV0ZScpIHtcclxuICAgICAgICAgICAgcm93c1dpdGhTdGF0dXNNb2RpZmllZC5wdXNoKG5vZGUuZGF0YSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAobm9kZS5kYXRhLm5ld0l0ZW0gfHwgbmV3RWxlbWVudHNBY3RpdmVkKSB7XHJcbiAgICAgICAgICAgIG5vZGUuZGF0YS5zdGF0dXMgPSAncGVuZGluZ0NyZWF0aW9uJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG5vZGUuZGF0YS5zdGF0dXMgPSAnc3RhdHVzT0snXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuc29tZVN0YXR1c0hhc0NoYW5nZWRUb0RlbGV0ZSA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmRpc2NhcmRDaGFuZ2VzLmVtaXQocm93c1dpdGhTdGF0dXNNb2RpZmllZCk7XHJcbiAgICAgIHRoaXMuZ3JpZE1vZGlmaWVkLmVtaXQoZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3MoKTtcclxuXHJcbiAgICAvL3RoaXMucGFyYW1zLmNvbERlZi5jZWxsU3R5bGUgPSAge2JhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnfTtcclxuICAgIC8vdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3MoKTtcclxuICB9XHJcblxyXG5cclxuICBvbkZpbHRlck1vZGlmaWVkKCk6IHZvaWQge1xyXG5cclxuICAgIHRoaXMuZGVsZXRlQ2hhbmdlcygpO1xyXG5cclxuICB9XHJcblxyXG5cclxuICB1bmRvKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIHRoaXMuZ3JpZEFwaS51bmRvQ2VsbEVkaXRpbmcoKTtcclxuICAgIHRoaXMuY2hhbmdlQ291bnRlciAtPSAxO1xyXG4gICAgaWYgKHRoaXMuY2hhbmdlQ291bnRlciA9PSAwKSB7IHRoaXMuZ3JpZE1vZGlmaWVkLmVtaXQoZmFsc2UpIH1cclxuICAgIHRoaXMucmVkb0NvdW50ZXIgKz0gMTtcclxuICB9XHJcblxyXG4gIHJlZG8oKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgdGhpcy5ncmlkQXBpLnJlZG9DZWxsRWRpdGluZygpO1xyXG4gICAgdGhpcy5jaGFuZ2VDb3VudGVyICs9IDE7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyIC09IDE7XHJcbiAgfVxyXG5cclxuXHJcbiAgb25DZWxsRWRpdGluZ1N0b3BwZWQoZSkge1xyXG4gICAgaWYgKHRoaXMubW9kaWZpY2F0aW9uQ2hhbmdlKSB7XHJcbiAgICAgIHRoaXMuY2hhbmdlQ291bnRlcisrO1xyXG4gICAgICBpZiAodGhpcy5jaGFuZ2VDb3VudGVyID09IDEpIHsgdGhpcy5ncmlkTW9kaWZpZWQuZW1pdCh0cnVlKSB9XHJcbiAgICAgIHRoaXMucmVkb0NvdW50ZXIgPSAwO1xyXG4gICAgICB0aGlzLm9uQ2VsbFZhbHVlQ2hhbmdlZChlKTtcclxuICAgICAgdGhpcy5tb2RpZmljYXRpb25DaGFuZ2UgPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBvbkNlbGxWYWx1ZUNoYW5nZWQocGFyYW1zKTogdm9pZCB7XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgIGlmICh0aGlzLmNoYW5nZUNvdW50ZXIgPiB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlcilcclxuICAgIC8vIFRydWUgaWYgd2UgaGF2ZSBlZGl0ZWQgc29tZSBjZWxsIG9yIHdlIGhhdmUgZG9uZSBhIHJlZG8gXHJcbiAgICB7XHJcblxyXG4gICAgICBpZiAocGFyYW1zLm9sZFZhbHVlICE9PSBwYXJhbXMudmFsdWUgJiYgIShwYXJhbXMub2xkVmFsdWUgPT0gbnVsbCAmJiBwYXJhbXMudmFsdWUgPT09ICcnKSkge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuY2hhbmdlc01hcC5oYXMocGFyYW1zLm5vZGUuaWQpKSAvLyBJZiBpdCdzIGZpcnRzIGVkaXQgb2YgYSBjZWxsLCB3ZSBhZGQgaXQgdG8gdGhlIG1hcCBhbmQgd2UgcGFpbnQgaXRcclxuICAgICAgICB7XHJcbiAgICAgICAgICBjb25zdCBhZGRNYXA6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xyXG4gICAgICAgICAgYWRkTWFwLnNldChwYXJhbXMuY29sRGVmLmZpZWxkLCAxKVxyXG4gICAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLnNldChwYXJhbXMubm9kZS5pZCwgYWRkTWFwKTtcclxuICAgICAgICAgIGlmICh0aGlzLnN0YXR1c0NvbHVtbikge1xyXG4gICAgICAgICAgICAvLyBpZiAodGhpcy5ncmlkQXBpLmdldFJvd05vZGUocGFyYW1zLm5vZGUuaWQpLmRhdGEuc3RhdHVzICE9PSAncGVuZGluZ0NyZWF0aW9uJykge1xyXG4gICAgICAgICAgICB0aGlzLmdyaWRBcGkuZ2V0Um93Tm9kZShwYXJhbXMubm9kZS5pZCkuZGF0YS5zdGF0dXMgPSAncGVuZGluZ01vZGlmeSdcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGlmICghdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuaGFzKHBhcmFtcy5jb2xEZWYuZmllbGQpKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5zZXQocGFyYW1zLmNvbERlZi5maWVsZCwgMSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFdlIGFscmVhZHkgaGFkIGVkaXRlZCB0aGlzIGNlbGwsIHNvIHdlIG9ubHkgaW5jcmVtZW50IG51bWJlciBvZiBjaGFuZ2VzIG9mIGl0IG9uIHRoZSBtYXAgXHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDaGFuZ2VzID0gdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuZ2V0KHBhcmFtcy5jb2xEZWYuZmllbGQpO1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5zZXQocGFyYW1zLmNvbERlZi5maWVsZCwgKGN1cnJlbnRDaGFuZ2VzICsgMSkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wYWludENlbGxzKHBhcmFtcywgdGhpcy5jaGFuZ2VzTWFwKTsgLy9XZSBwYWludCB0aGUgcm93IG9mIHRoZSBlZGl0ZWQgY2VsbCBcclxuICAgICAgICB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlcisrOyAvL1dlIG1hdGNoIHRoZSBjdXJyZW50IHByZXZpb3VzQ2hhbmdlQ291bnRlciB3aXRoIGNoYW5nZUNvdW50ZXJcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHRoaXMuY2hhbmdlQ291bnRlciA8IHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyKSB7IC8vIFRydWUgaWYgd2UgaGF2ZSBkb25lIGFuIHVuZG9cclxuICAgICAgbGV0IGN1cnJlbnRDaGFuZ2VzID0gLTE7XHJcbiAgICAgIGlmICh0aGlzLmNoYW5nZXNNYXAuaGFzKHBhcmFtcy5ub2RlLmlkKSkgeyBjdXJyZW50Q2hhbmdlcyA9IHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmdldChwYXJhbXMuY29sRGVmLmZpZWxkKTsgfVxyXG5cclxuICAgICAgaWYgKGN1cnJlbnRDaGFuZ2VzID09PSAxKSB7IC8vT25jZSB0aGUgdW5kbyBpdCdzIGRvbmUsIGNlbGwgaXMgaW4gaGlzIGluaXRpYWwgc3RhdHVzXHJcblxyXG4gICAgICAgIHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmRlbGV0ZShwYXJhbXMuY29sRGVmLmZpZWxkKTtcclxuICAgICAgICBpZiAodGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuc2l6ZSA9PT0gMCkgeyAvLyBObyBtb3JlIG1vZGlmaWNhdGlvbnMgaW4gdGhpcyByb3dcclxuICAgICAgICAgIHRoaXMuY2hhbmdlc01hcC5kZWxldGUocGFyYW1zLm5vZGUuaWQpO1xyXG4gICAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5ncmlkQXBpLmdldERpc3BsYXllZFJvd0F0SW5kZXgocGFyYW1zLnJvd0luZGV4KTtcclxuICAgICAgICAgIGlmICh0aGlzLnN0YXR1c0NvbHVtbikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ncmlkQXBpLmdldFJvd05vZGUocGFyYW1zLm5vZGUuaWQpLmRhdGEuc3RhdHVzICE9PSAncGVuZGluZ0NyZWF0aW9uJykge1xyXG4gICAgICAgICAgICAgIHRoaXMuZ3JpZEFwaS5nZXRSb3dOb2RlKHBhcmFtcy5ub2RlLmlkKS5kYXRhLnN0YXR1cyA9ICdzdGF0dXNPSydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIC8vIFdlIHBhaW50IGl0IHdoaXRlXHJcbiAgICAgICAgICB0aGlzLmdyaWRBcGkucmVkcmF3Um93cyh7IHJvd05vZGVzOiBbcm93XSB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5wYWludENlbGxzKHBhcmFtcywgdGhpcy5jaGFuZ2VzTWFwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKGN1cnJlbnRDaGFuZ2VzID4gMSkgLy8gVGhlIGNlbGwgaXNuJ3QgaW4gaGlzIGluaXRpYWwgc3RhdGUgeWV0XHJcbiAgICAgIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1dlIGNhbid0IGRvIGVsc2UgYmVjYXVzZSB3ZSBjYW4gYmUgZG9pbmcgYW4gdW5kbyB3aXRob3V0IGNoYW5nZXMgXHJcbiAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuc2V0KHBhcmFtcy5jb2xEZWYuZmllbGQsIChjdXJyZW50Q2hhbmdlcyAtIDEpKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYWludENlbGxzKHBhcmFtcywgdGhpcy5jaGFuZ2VzTWFwKTsvL05vdCBpbml0aWFsIHN0YXRlIC0+IGdyZWVuIGJhY2tncm91bmRcclxuXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXItLTsgIC8vV2UgZGVjcmVtZW50IHByZXZpb3VzQ2hhbmdlQ291bnRlciBiZWNhdXNlIHdlIGhhdmUgZG9uZSB1bmRvXHJcbiAgICB9XHJcbiAgICBlbHNlIHsgLy8gQ29udHJvbCBvZiBtb2RpZmljYXRpb25zIHdpdGhvdXQgY2hhbmdlc1xyXG4gICAgICBpZiAoIShwYXJhbXMub2xkVmFsdWUgPT0gbnVsbCAmJiBwYXJhbXMudmFsdWUgPT09ICcnKSkge1xyXG4gICAgICAgIGxldCBuZXdWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIGlmIChwYXJhbXMudmFsdWUgPT0gbnVsbCkgeyBuZXdWYWx1ZSA9ICcnIH1cclxuICAgICAgICBlbHNlIHsgbmV3VmFsdWUgPSBwYXJhbXMudmFsdWUudG9TdHJpbmcoKSB9XHJcblxyXG4gICAgICAgIGlmICgocGFyYW1zLm9sZFZhbHVlICE9IHVuZGVmaW5lZCAmJiBwYXJhbXMub2xkVmFsdWUgIT0gbnVsbCAmJiBwYXJhbXMub2xkVmFsdWUudG9TdHJpbmcoKSAhPT0gbmV3VmFsdWUudG9TdHJpbmcoKSlcclxuICAgICAgICAgIHx8ICgocGFyYW1zLm9sZFZhbHVlID09IHVuZGVmaW5lZCB8fCBwYXJhbXMub2xkVmFsdWUgPT0gbnVsbCkgJiYgbmV3VmFsdWUgIT0gbnVsbCkpIHtcclxuXHJcbiAgICAgICAgICB0aGlzLm1vZGlmaWNhdGlvbkNoYW5nZSA9IHRydWU7XHJcbiAgICAgICAgICBpZiAocGFyYW1zLmNvbERlZi5jZWxsUmVuZGVyZXIgPT0gXCJidG5DaGVja2JveFJlbmRlcmVyQ29tcG9uZW50XCIpIHtcclxuICAgICAgICAgICAgdmFyIHVuZG9SZWRvQWN0aW9ucyA9IHtcclxuICAgICAgICAgICAgICBjZWxsVmFsdWVDaGFuZ2VzOiB0aGlzLmdyaWRBcGkudW5kb1JlZG9TZXJ2aWNlLmNlbGxWYWx1ZUNoYW5nZXNcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5ncmlkQXBpLnVuZG9SZWRvU2VydmljZS5wdXNoQWN0aW9uc1RvVW5kb1N0YWNrKHVuZG9SZWRvQWN0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JpZEFwaS51bmRvUmVkb1NlcnZpY2UuaXNGaWxsaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMub25DZWxsRWRpdGluZ1N0b3BwZWQocGFyYW1zKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7IHRoaXMubW9kaWZpY2F0aW9uV2l0aG91dENoYW5nZXMocGFyYW1zKSB9XHJcblxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgeyB0aGlzLm1vZGlmaWNhdGlvbldpdGhvdXRDaGFuZ2VzKHBhcmFtcykgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbW9kaWZpY2F0aW9uV2l0aG91dENoYW5nZXMocGFyYW1zOiBhbnkpIHtcclxuXHJcbiAgICBpZiAodGhpcy5jaGFuZ2VzTWFwLmhhcyhwYXJhbXMubm9kZS5pZCkpIC8vTW9kaWZpY2F0aW9uIHdpdGhvdXQgY2hhbmdlcyBpbiBlbiBlZGl0ZWQgY2VsbFxyXG4gICAge1xyXG4gICAgICBpZiAoIXRoaXMudW5kb05vQ2hhbmdlcykge1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS51bmRvQ2VsbEVkaXRpbmcoKTsgLy8gVW5kbyB0byBkZWxldGUgdGhlIGNoYW5nZSB3aXRob3V0IGNoYW5nZXMgaW50ZXJuYWxseSBcclxuICAgICAgICB0aGlzLnVuZG9Ob0NoYW5nZXMgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucGFpbnRDZWxscyhwYXJhbXMsIHRoaXMuY2hhbmdlc01hcCk7ICAvL1RoZSBjZWxsIGhhcyBtb2RpZmljYXRpb25zIHlldCAtPiBncmVlbiBiYWNrZ3JvdW5kIFxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgeyB0aGlzLnVuZG9Ob0NoYW5nZXMgPSBmYWxzZTsgfVxyXG5cclxuXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgLy9XaXRoIHRoZSBpbnRlcm5hbGx5IHVuZG8gd2lsbCBlbnRlciBhdCB0aGlzIGZ1bmN0aW9uLCBzbyB3ZSBoYXZlIHRvIGNvbnRyb2wgd2hlbiBkb25lIHRoZSB1bmRvIG9yIG5vdCBcclxuICAgICAgaWYgKCF0aGlzLnVuZG9Ob0NoYW5nZXMpIHtcclxuICAgICAgICB0aGlzLmdyaWRBcGkudW5kb0NlbGxFZGl0aW5nKCk7IC8vIFVuZG8gdG8gZGVsZXRlIHRoZSBjaGFuZ2UgaW50ZXJuYWxseVxyXG4gICAgICAgIHRoaXMudW5kb05vQ2hhbmdlcyA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7IHRoaXMudW5kb05vQ2hhbmdlcyA9IGZhbHNlOyB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0Q29sdW1uSW5kZXhCeUNvbElkKGFwaTogQ29sdW1uQXBpLCBjb2xJZDogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBhcGkuZ2V0QWxsQ29sdW1ucygpLmZpbmRJbmRleChjb2wgPT4gY29sLmdldENvbElkKCkgPT09IGNvbElkKTtcclxuICB9XHJcbiAgcGFpbnRDZWxscyhwYXJhbXM6IGFueSwgY2hhbmdlc01hcDogTWFwPG51bWJlciwgTWFwPHN0cmluZywgbnVtYmVyPj4sKSB7XHJcbiAgICBjb25zdCByb3cgPSB0aGlzLmdyaWRBcGkuZ2V0RGlzcGxheWVkUm93QXRJbmRleChwYXJhbXMucm93SW5kZXgpO1xyXG4gICAgdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3MoeyByb3dOb2RlczogW3Jvd10gfSk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=