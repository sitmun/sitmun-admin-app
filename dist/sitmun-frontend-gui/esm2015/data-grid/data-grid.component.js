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
                const data = this.translate.instant(key);
                return data === key ? defaultValue : data;
            }
        };
    }
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
    firstDataRendered() {
        if (localStorage.agGridState != undefined) {
            let agGridState = JSON.parse(localStorage.agGridState);
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
                const sortModel = [
                    { colId: this.defaultColumnSorting, sort: 'asc' }
                ];
                this.gridApi.setSortModel(sortModel);
            }
            else {
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
    getDatePicker() {
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
    areRowsSelected() {
        return (this.gridApi != null && this.gridApi.getSelectedNodes().length > 0) ? true : false;
        // if (this.gridApi != null && this.gridApi.getSelectedNodes().length > 0) {
        //   return true
        // } else {
        //   return false
        // }
    }
    emitSelectedRows() {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        this.getSelectedRows.emit(selectedData);
    }
    emitAllRows(event) {
        // let rowData = [];
        // this.gridApi.forEachNode(node => rowData.push(node.data));
        this.getAllRows.emit({ data: this.getAllCurrentData(), event: event });
    }
    getAllCurrentData() {
        let rowData = [];
        this.gridApi.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    modifyStatusSelected(status) {
        let newStatus = status ? status : this.newStatusRegister;
        const selectedNodes = this.gridApi.getSelectedNodes();
        selectedNodes.map(node => {
            node.data.status = newStatus;
            node.selected = false;
        });
        this.gridApi.redrawRows();
    }
    saveAgGridState() {
        let agGridState = {
            idAgGrid: this.id,
            colState: this.gridColumnApi.getColumnState(),
            filterState: this.gridApi.getFilterModel(),
            sortState: this.gridApi.getSortModel(),
            valueSearchGeneric: this.searchValue
        };
        localStorage.setItem("agGridState", JSON.stringify(agGridState));
    }
    removeAgGridState() {
        localStorage.removeItem("agGridState");
    }
    getColumnKeysAndHeaders(columnkeys) {
        let header = [];
        if (this.columnDefs.length == 0) {
            return '';
        }
        ;
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
    exportData() {
        let columnkeys = [];
        let customHeader = '';
        customHeader = this.getColumnKeysAndHeaders(columnkeys);
        let params = {
            onlySelected: true,
            columnKeys: columnkeys,
            customHeader: customHeader,
            skipHeader: true
        };
        this.gridApi.exportDataAsCsv(params);
    }
    quickSearch() {
        this.gridApi.setQuickFilter(this.searchValue);
    }
    getElements() {
        this.getAll()
            .subscribe((items) => {
            let status = this.allNewElements ? 'pendingCreation' : 'statusOK';
            let newItems = [];
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
    setSize() {
        var allColumnIds = [];
        let columns = this.gridOptions.columnApi.getAllColumns();
        columns.forEach(function (column) {
            allColumnIds.push(column.colId);
        });
        this.gridOptions.columnApi.autoSizeColumns(allColumnIds);
        let grid = this.gridOptions.api;
        let availableWidth = grid.gridPanel.eBodyViewport.clientWidth;
        let usedWidth = grid.gridPanel.columnController.getWidthOfColsInList(columns);
        if (usedWidth < availableWidth) {
            grid.sizeColumnsToFit();
        }
    }
    addItems(newItems) {
        console.log(newItems);
        let itemsToAdd = [];
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
    checkElementAllowedToAdd(condition, item, data) {
        let finalAddition = true;
        if (Array.isArray(condition)) {
            for (let element of data) {
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
    changeHeight(value) {
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
    removeData() {
        this.gridApi.stopEditing(false);
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        this.remove.emit(selectedData);
        if (this.statusColumn) {
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
    newData() {
        this.gridApi.stopEditing(false);
        this.new.emit(-1);
    }
    onAddButtonClicked() {
        this.gridApi.stopEditing(false);
        this.add.emit(this.getAllCurrentData());
    }
    onDuplicateButtonClicked() {
        this.gridApi.stopEditing(false);
        if (this.changeCounter > 0) {
            const dialogRef = this.dialog.open(DialogMessageComponent);
            dialogRef.componentInstance.title = this.translate.instant('caution');
            dialogRef.componentInstance.message = this.translate.instant('duplicateMessage');
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    if (result.event === 'Accept') {
                        const selectedNodes = this.gridApi.getSelectedNodes();
                        const selectedData = selectedNodes.map(node => node.data);
                        this.duplicate.emit(selectedData);
                    }
                }
            });
        }
        else {
            const selectedNodes = this.gridApi.getSelectedNodes();
            const selectedData = selectedNodes.map(node => node.data);
            this.duplicate.emit(selectedData);
            this.gridOptions.api.deselectAll();
        }
    }
    applyChanges() {
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
    deleteChanges() {
        this.gridApi.stopEditing(false);
        let newElementsActived = this.allNewElements;
        while (this.changeCounter > 0) {
            this.undo();
        }
        this.changesMap.clear();
        //this.previousChangeCounter = 0;
        this.redoCounter = 0;
        if (this.statusColumn && !this.discardNonReverseStatus) {
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
    onFilterModified() {
        this.deleteChanges();
    }
    undo() {
        this.gridApi.stopEditing(false);
        this.gridApi.undoCellEditing();
        this.changeCounter -= 1;
        if (this.changeCounter == 0) {
            this.gridModified.emit(false);
        }
        this.redoCounter += 1;
    }
    redo() {
        this.gridApi.stopEditing(false);
        this.gridApi.redoCellEditing();
        this.changeCounter += 1;
        this.redoCounter -= 1;
    }
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
    onCellValueChanged(params) {
        this.params = params;
        if (this.changeCounter > this.previousChangeCounter) 
        // True if we have edited some cell or we have done a redo 
        {
            if (params.oldValue !== params.value && !(params.oldValue == null && params.value === '')) {
                if (!this.changesMap.has(params.node.id)) // If it's firts edit of a cell, we add it to the map and we paint it
                 {
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
                        // We already had edited this cell, so we only increment number of changes of it on the map 
                        const currentChanges = this.changesMap.get(params.node.id).get(params.colDef.field);
                        this.changesMap.get(params.node.id).set(params.colDef.field, (currentChanges + 1));
                    }
                }
                this.paintCells(params, this.changesMap); //We paint the row of the edited cell 
                this.previousChangeCounter++; //We match the current previousChangeCounter with changeCounter
            }
        }
        else if (this.changeCounter < this.previousChangeCounter) { // True if we have done an undo
            let currentChanges = -1;
            if (this.changesMap.has(params.node.id)) {
                currentChanges = this.changesMap.get(params.node.id).get(params.colDef.field);
            }
            if (currentChanges === 1) { //Once the undo it's done, cell is in his initial status
                this.changesMap.get(params.node.id).delete(params.colDef.field);
                if (this.changesMap.get(params.node.id).size === 0) { // No more modifications in this row
                    this.changesMap.delete(params.node.id);
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
                this.changesMap.get(params.node.id).set(params.colDef.field, (currentChanges - 1));
                this.paintCells(params, this.changesMap); //Not initial state -> green background
            }
            this.previousChangeCounter--; //We decrement previousChangeCounter because we have done undo
        }
        else { // Control of modifications without changes
            if (!(params.oldValue == null && params.value === '')) {
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
    getColumnIndexByColId(api, colId) {
        return api.getAllColumns().findIndex(col => col.getColId() === colId);
    }
    paintCells(params, changesMap) {
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
                styles: ["@charset \"UTF-8\";input,label{display:inline-block;margin:5px 5px 5px 10px}.mat-flat-button.mat-orange,.mat-icon.mat-orange,.mat-mini-fab.mat-orange,.mat-raised-button.mat-orange{background-color:#ff9300!important;color:#fff!important}.mat-flat-button.mat-orange:disabled,.mat-icon.mat-orange:disabled,.mat-mini-fab.mat-orange:disabled,.mat-raised-button.mat-orange:disabled{background:#ffc97f!important;color:#fff!important}.mat-flat-button.mat-green,.mat-icon.mat-green,.mat-mini-fab.mat-green,.mat-raised-button.mat-green{background-color:#68a225!important;color:#fff!important}.mat-flat-button.mat-green:disabled,.mat-icon.mat-green:disabled,.mat-mini-fab.mat-green:disabled,.mat-raised-button.mat-green:disabled{background-color:#83976c!important;color:#fff!important}.mat-flat-button.mat-red,.mat-icon.mat-red,.mat-mini-fab.mat-red,.mat-raised-button.mat-red{background-color:#bf0000!important;color:#fff!important}.mat-flat-button.mat-red:disabled,.mat-icon.mat-red:disabled,.mat-mini-fab.mat-red:disabled,.mat-raised-button.mat-red:disabled{background-color:#da8c8e!important;color:#fff!important}.validateButton{background-color:#ff9300;color:#fff;min-width:85px;margin-top:34px!important}.deleteButton,.validateButton{height:40px;justify-self:right!important}.deleteButton{color:#bf0000;border:1px solid #bf0000!important;min-width:85px!important;float:inherit!important}.deleteButton:disabled{background-color:inherit!important;border:1px solid rgba(0,0,0,.26)!important;color:rgba(0,0,0,.26) solid 1px!important}.actionButton,.returnButton{color:#ff9300;border:1px solid #ff9300!important}.actionButton,.newButton,.returnButton,.saveButton{min-width:85px!important;height:40px;justify-self:right!important;float:inherit!important}.newButton,.saveButton{background-color:#68a225;color:#fff}.editDivBtns{margin-left:10px;text-align:start;width:130px;height:30px!important;line-height:30px!important}.actionsDivBtns{text-align:end;width:calc(100% - 140px);height:50px}.actionsDivBtns,.editDivBtns{display:inline-block!important}.actionsDivBtns .searchGenericInput{height:41px!important;width:45%!important;display:inline-block!important;margin:0 5px 5px 10px!important}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-thumb{background:#eee}\u200B .ag-body-viewport.ag-layout-normal ::-webkit-scrollbar{width:2em;height:2em}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-button{background:#ccc}.ag-body-viewport.ag-layout-normal::-webkit-scrollbar-track-piece{background:#888}.mini-fab{width:28px!important;height:28px!important;line-height:22px!important;margin-top:7px!important;margin-right:3px!important}.mini-fab .mat-button-wrapper{padding:1px 0!important;line-height:22px!important;width:24px!important;height:24px!important}.mini-fab .mat-button-wrapper .mat-icon{font-size:20px;padding-right:0;line-height:22px}.toogleButton{height:40px;margin-right:10px;vertical-align:bottom;align-items:center}"]
            },] }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1ncmlkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL2FuZ3VsYXItbGlicmFyeS9wcm9qZWN0cy9zaXRtdW4tZnJvbnRlbmQtZ3VpL3NyYy9saWIvZGF0YS1ncmlkL2RhdGEtZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFNBQVMsRUFBb0IsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXJHLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFbEMsT0FBTyxFQUFFLG1CQUFtQixFQUFxQixNQUFNLGdDQUFnQyxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQzVGLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLDBEQUEwRCxDQUFDO0FBQ3hHLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBQ2xHLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQVdwRixNQUFNLE9BQU8saUJBQWlCO0lBZ0Y1QixZQUFtQixNQUFpQixFQUMzQixTQUEyQixFQUMxQixLQUFpQjtRQUZSLFdBQU0sR0FBTixNQUFNLENBQVc7UUFDM0IsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDMUIsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQTNFM0IsWUFBTyxHQUFhLG1CQUFtQixDQUFDO1FBT3hDLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLHlCQUFvQixHQUFHLEtBQUssQ0FBQztRQUM3QixlQUFVLEdBQXFDLElBQUksR0FBRyxFQUEr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QUFLO2tDQUNMLEtBQUs7NkJBQ0wsS0FBSzswQkFDTCxLQUFLO2dEQUNMLEtBQUs7cUJBR0wsTUFBTTtrQkFDTixNQUFNO2tCQUNOLE1BQU07NkJBQ04sTUFBTTswQkFDTixNQUFNO3dCQUNOLE1BQU07OEJBQ04sTUFBTTt5QkFDTixNQUFNOzZCQUNOLE1BQU07MkJBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFnR3JpZE1vZHVsZSB9IGZyb20gJ0BhZy1ncmlkLWNvbW11bml0eS9hbmd1bGFyJztcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIE5nTW9kdWxlLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBBbGxDb21tdW5pdHlNb2R1bGVzLCBDb2x1bW5BcGksIE1vZHVsZSB9IGZyb20gJ0BhZy1ncmlkLWNvbW11bml0eS9hbGwtbW9kdWxlcyc7XHJcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcclxuaW1wb3J0IHsgQnRuRWRpdFJlbmRlcmVkQ29tcG9uZW50IH0gZnJvbSAnLi4vYnRuLWVkaXQtcmVuZGVyZWQvYnRuLWVkaXQtcmVuZGVyZWQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQnRuQ2hlY2tib3hSZW5kZXJlZENvbXBvbmVudCB9IGZyb20gJy4uL2J0bi1jaGVja2JveC1yZW5kZXJlZC9idG4tY2hlY2tib3gtcmVuZGVyZWQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQnRuQ2hlY2tib3hGaWx0ZXJDb21wb25lbnQgfSBmcm9tICcuLi9idG4tY2hlY2tib3gtZmlsdGVyL2J0bi1jaGVja2JveC1maWx0ZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTWF0RGlhbG9nIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcclxuaW1wb3J0IHsgRGlhbG9nTWVzc2FnZUNvbXBvbmVudCB9IGZyb20gJy4uL2RpYWxvZy1tZXNzYWdlL2RpYWxvZy1tZXNzYWdlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IGZvckVhY2ggfSBmcm9tICdqc3ppcCc7XHJcbmRlY2xhcmUgbGV0ICQ6IGFueTtcclxuXHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtZGF0YS1ncmlkJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vZGF0YS1ncmlkLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9kYXRhLWdyaWQuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGF0YUdyaWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBfZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgX2V2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgX2V2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbjogYW55O1xyXG4gIF9ldmVudFNhdmVBZ0dyaWRTdGF0ZVN1YnNjcmlwdGlvbjogYW55O1xyXG4gIF9ldmVudE1vZGlmeVN0YXR1c09mU2VsZWN0ZWRDZWxsczogYW55O1xyXG4gIG1vZHVsZXM6IE1vZHVsZVtdID0gQWxsQ29tbXVuaXR5TW9kdWxlcztcclxuXHJcblxyXG4gIFVuZGVSZWRvQWN0aW9uc1xyXG4gIHNlYXJjaFZhbHVlOiBzdHJpbmc7XHJcbiAgZ3JpZEFwaTogYW55O1xyXG4gIGdyaWRDb2x1bW5BcGk6IGFueTtcclxuICBzdGF0dXNDb2x1bW4gPSBmYWxzZTtcclxuICBzb21lQ29sdW1uSXNFZGl0YWJsZSA9IGZhbHNlO1xyXG4gIGNoYW5nZXNNYXA6IE1hcDxudW1iZXIsIE1hcDxzdHJpbmcsIG51bWJlcj4+ID0gbmV3IE1hcDxudW1iZXIsIE1hcDxzdHJpbmcsIG51bWJlcj4+KCk7XHJcbiAgLy8gV2Ugd2lsbCBzYXZlIHRoZSBpZCBvZiBlZGl0ZWQgY2VsbHMgYW5kIHRoZSBudW1iZXIgb2YgZWRpdGlvbnMgZG9uZS5cclxuICBwYXJhbXM6IGFueTsgLy8gTGFzdCBwYXJhbWV0ZXJzIG9mIHRoZSBncmlkIChpbiBjYXNlIHdlIGRvIGFwcGx5IGNoYW5nZXMgd2Ugd2lsbCBuZWVkIGl0KSBcclxuICByb3dEYXRhOiBhbnlbXTtcclxuICBjaGFuZ2VDb3VudGVyOiBudW1iZXI7IC8vIE51bWJlciBvZiBlZGl0aW9ucyBkb25lIGFib3ZlIGFueSBjZWxsIFxyXG4gIHByZXZpb3VzQ2hhbmdlQ291bnRlcjogbnVtYmVyOyAvLyBOdW1iZXIgb2YgZGl0aW9ucyBkb25lIGFmdGVyIHRoZSBsYXN0IG1vZGlmaWNhdGlvbihjaGFuZ2VDb3VudGVyKVxyXG4gIHJlZG9Db3VudGVyOiBudW1iZXI7IC8vIE51bWJlciBvZiByZWRvIHdlIGNhbiBkb1xyXG4gIG1vZGlmaWNhdGlvbkNoYW5nZSA9IGZhbHNlO1xyXG4gIHVuZG9Ob0NoYW5nZXMgPSBmYWxzZTsgLy8gQm9vbGVhbiB0aGF0IGluZGljYXRlcyBpZiBhbiB1bmRvIGhhc24ndCBtb2RpZmljYXRpb25zXHJcbiAgZ3JpZE9wdGlvbnM7XHJcbiAgc29tZVN0YXR1c0hhc0NoYW5nZWRUb0RlbGV0ZSA9IGZhbHNlO1xyXG5cclxuXHJcbiAgQElucHV0KCkgZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG4gIEBJbnB1dCgpIGV2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG4gIEBJbnB1dCgpIGV2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZTxzdHJpbmc+O1xyXG4gIEBJbnB1dCgpIGV2ZW50U2F2ZUFnR3JpZFN0YXRlU3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG4gIEBJbnB1dCgpIGV2ZW50TW9kaWZ5U3RhdHVzT2ZTZWxlY3RlZENlbGxzOiBPYnNlcnZhYmxlPHN0cmluZz47XHJcbiAgQElucHV0KCkgZXZlbnRBZGRJdGVtc1N1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZTxib29sZWFuPjtcclxuICBASW5wdXQoKSBmcmFtZXdvcmtDb21wb25lbnRzOiBhbnk7XHJcbiAgQElucHV0KCkgY29tcG9uZW50czogYW55O1xyXG4gIEBJbnB1dCgpIGNvbHVtbkRlZnM6IGFueVtdO1xyXG4gIEBJbnB1dCgpIGdldEFsbDogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+O1xyXG4gIEBJbnB1dCgpIGRpc2NhcmRDaGFuZ2VzQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGRpc2NhcmROb25SZXZlcnNlU3RhdHVzOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGlkOiBhbnk7XHJcbiAgQElucHV0KCkgdW5kb0J1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBkZWZhdWx0Q29sdW1uU29ydGluZzogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHJlZG9CdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYXBwbHlDaGFuZ2VzQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGRlbGV0ZUJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBuZXdCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYWN0aW9uQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGFkZEJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSByZWdpc3RlckJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBuZXdTdGF0dXNSZWdpc3Rlcjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGdsb2JhbFNlYXJjaDogYm9vbGVhbjtcclxuICBASW5wdXQoKSBjaGFuZ2VIZWlnaHRCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgZGVmYXVsdEhlaWdodDogYW55O1xyXG4gIEBJbnB1dCgpIHRoZW1lR3JpZDogYW55O1xyXG4gIEBJbnB1dCgpIHNpbmdsZVNlbGVjdGlvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBub25FZGl0YWJsZTogYm9vbGVhbjtcclxuICBASW5wdXQoKSB0aXRsZTogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGhpZGVFeHBvcnRCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgaGlkZUR1cGxpY2F0ZUJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBoaWRlU2VhcmNoUmVwbGFjZUJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBhZGRGaWVsZFJlc3RyaWN0aW9uOiBhbnk7XHJcbiAgQElucHV0KCkgYWxsTmV3RWxlbWVudHM6IGFueTtcclxuICBASW5wdXQoKSBjdXJyZW50RGF0YTogQXJyYXk8YW55PiA9IG51bGw7XHJcbiAgQElucHV0KCkgZmllbGRSZXN0cmljdGlvbldpdGhEaWZmZXJlbnROYW1lOiBzdHJpbmc7XHJcblxyXG5cclxuICBAT3V0cHV0KCkgcmVtb3ZlOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG4gIEBPdXRwdXQoKSBuZXc6IEV2ZW50RW1pdHRlcjxudW1iZXI+O1xyXG4gIEBPdXRwdXQoKSBhZGQ6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIGRpc2NhcmRDaGFuZ2VzOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG4gIEBPdXRwdXQoKSBzZW5kQ2hhbmdlczogRXZlbnRFbWl0dGVyPGFueVtdPjtcclxuICBAT3V0cHV0KCkgZHVwbGljYXRlOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG4gIEBPdXRwdXQoKSBnZXRTZWxlY3RlZFJvd3M6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIGdldEFsbFJvd3M6IEV2ZW50RW1pdHRlcjx7ZGF0YTogYW55W10sIGV2ZW50OnN0cmluZ30+O1xyXG4gIEBPdXRwdXQoKSBnZXRBZ0dyaWRTdGF0ZTogRXZlbnRFbWl0dGVyPGFueVtdPjtcclxuICBAT3V0cHV0KCkgZ3JpZE1vZGlmaWVkOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj47XHJcblxyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGlhbG9nOiBNYXREaWFsb2csXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBlbFJlZjogRWxlbWVudFJlZikge1xyXG4gICAgdGhpcy50cmFuc2xhdGUgPSB0cmFuc2xhdGU7XHJcblxyXG4gICAgdGhpcy5mcmFtZXdvcmtDb21wb25lbnRzID0ge1xyXG4gICAgICBidG5FZGl0UmVuZGVyZXJDb21wb25lbnQ6IEJ0bkVkaXRSZW5kZXJlZENvbXBvbmVudCxcclxuICAgICAgYnRuQ2hlY2tib3hSZW5kZXJlckNvbXBvbmVudDogQnRuQ2hlY2tib3hSZW5kZXJlZENvbXBvbmVudCxcclxuICAgICAgYnRuQ2hlY2tib3hGaWx0ZXJDb21wb25lbnQ6IEJ0bkNoZWNrYm94RmlsdGVyQ29tcG9uZW50XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuY29tcG9uZW50cyA9IHtcclxuICAgICAgZGF0ZVBpY2tlcjogdGhpcy5nZXREYXRlUGlja2VyKClcclxuICAgIH07XHJcblxyXG5cclxuICAgIHRoaXMucmVtb3ZlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5uZXcgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmFkZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuZGlzY2FyZENoYW5nZXM9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuc2VuZENoYW5nZXMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmdldFNlbGVjdGVkUm93cyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuZHVwbGljYXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5nZXRBbGxSb3dzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5ncmlkTW9kaWZpZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmNoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5yZWRvQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLmdyaWRPcHRpb25zID0ge1xyXG4gICAgICBkZWZhdWx0Q29sRGVmOiB7XHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZmxleDogMSxcclxuICAgICAgICBmaWx0ZXI6IHRydWUsXHJcbiAgICAgICAgZWRpdGFibGU6ICF0aGlzLm5vbkVkaXRhYmxlLFxyXG4gICAgICAgIHN1cHByZXNzTWVudTogdHJ1ZSxcclxuICAgICAgICByZXNpemFibGU6IHRydWUsXHJcbiAgICAgICAgY2VsbFN0eWxlOiAocGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICBpZihwYXJhbXMudmFsdWUgJiYgcGFyYW1zLmNvbERlZi5lZGl0YWJsZSl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY2hhbmdlc01hcC5oYXMocGFyYW1zLm5vZGUuaWQpICYmIHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmhhcyhwYXJhbXMuY29sRGVmLmZpZWxkKSl7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHsnYmFja2dyb3VuZC1jb2xvcic6ICcjRThGMURFJ307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICByZXR1cm4geydiYWNrZ3JvdW5kLWNvbG9yJzogJ3doaXRlJ307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4geydiYWNrZ3JvdW5kLWNvbG9yJzogJ3doaXRlJ307XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSAsXHJcbiAgICAgIH0sXHJcbiAgICAgIHJvd1NlbGVjdGlvbjogJ211bHRpcGxlJyxcclxuICAgICAgc2luZ2xlQ2xpY2tFZGl0OiB0cnVlLFxyXG4gICAgICAvLyBzdXBwcmVzc0hvcml6b250YWxTY3JvbGw6IHRydWUsXHJcbiAgICAgIGxvY2FsZVRleHRGdW5jOiAoa2V5OiBzdHJpbmcsIGRlZmF1bHRWYWx1ZTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoa2V5KTtcclxuICAgICAgICByZXR1cm4gZGF0YSA9PT0ga2V5ID8gZGVmYXVsdFZhbHVlIDogZGF0YTtcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gIH1cclxuXHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG5cclxuICAgIGlmICh0aGlzLmV2ZW50UmVmcmVzaFN1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLl9ldmVudFJlZnJlc2hTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50UmVmcmVzaFN1YnNjcmlwdGlvbi5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuY2hhbmdlc01hcC5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuc29tZVN0YXR1c0hhc0NoYW5nZWRUb0RlbGV0ZT1mYWxzZTtcclxuICAgICAgICB0aGlzLmNoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLmdldEVsZW1lbnRzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5fZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbWl0U2VsZWN0ZWRSb3dzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoZXZlbnQ6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHRoaXMuZW1pdEFsbFJvd3MoZXZlbnQpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5ldmVudFNhdmVBZ0dyaWRTdGF0ZVN1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLl9ldmVudFNhdmVBZ0dyaWRTdGF0ZVN1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRTYXZlQWdHcmlkU3RhdGVTdWJzY3JpcHRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLnNhdmVBZ0dyaWRTdGF0ZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5ldmVudE1vZGlmeVN0YXR1c09mU2VsZWN0ZWRDZWxscykge1xyXG4gICAgICB0aGlzLl9ldmVudE1vZGlmeVN0YXR1c09mU2VsZWN0ZWRDZWxscyA9IHRoaXMuZXZlbnRNb2RpZnlTdGF0dXNPZlNlbGVjdGVkQ2VsbHMuc3Vic2NyaWJlKChzdGF0dXM6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHRoaXMubW9kaWZ5U3RhdHVzU2VsZWN0ZWQoc3RhdHVzKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZXZlbnRBZGRJdGVtc1N1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLmV2ZW50QWRkSXRlbXNTdWJzY3JpcHRpb24uc3Vic2NyaWJlKFxyXG4gICAgICAgIChpdGVtczogYW55KSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmFkZEl0ZW1zKGl0ZW1zKTtcclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBmaXJzdERhdGFSZW5kZXJlZCgpOiB2b2lkIHtcclxuICAgIGlmIChsb2NhbFN0b3JhZ2UuYWdHcmlkU3RhdGUgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGxldCBhZ0dyaWRTdGF0ZSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmFnR3JpZFN0YXRlKVxyXG4gICAgICBpZiAoYWdHcmlkU3RhdGUuaWRBZ0dyaWQgIT0gdW5kZWZpbmVkICYmIGFnR3JpZFN0YXRlLmlkQWdHcmlkID09IHRoaXMuaWQpIHtcclxuICAgICAgICB0aGlzLmdyaWRBcGkuc2V0RmlsdGVyTW9kZWwoYWdHcmlkU3RhdGUuZmlsdGVyU3RhdGUpO1xyXG4gICAgICAgIHRoaXMuZ3JpZENvbHVtbkFwaS5zZXRDb2x1bW5TdGF0ZShhZ0dyaWRTdGF0ZS5jb2xTdGF0ZSk7XHJcbiAgICAgICAgdGhpcy5ncmlkQXBpLnNldFNvcnRNb2RlbChhZ0dyaWRTdGF0ZS5zb3J0U3RhdGUpO1xyXG4gICAgICAgIHRoaXMuc2VhcmNoVmFsdWUgPSBhZ0dyaWRTdGF0ZS52YWx1ZVNlYXJjaEdlbmVyaWM7XHJcbiAgICAgICAgdGhpcy5xdWlja1NlYXJjaCgpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQWdHcmlkU3RhdGUoKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlkICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQWdHcmlkU3RhdGUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25HcmlkUmVhZHkocGFyYW1zKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5zaW5nbGVTZWxlY3Rpb24pIHsgdGhpcy5ncmlkT3B0aW9ucy5yb3dTZWxlY3Rpb24gPSAnc2luZ2xlJyB9XHJcbiAgICAvLyBpZiAodGhpcy5ub25FZGl0YWJsZSkge3RoaXMuZ3JpZE9wdGlvbnMuZGVmYXVsdENvbERlZi5lZGl0YWJsZSA9IGZhbHNlfVxyXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcbiAgICB0aGlzLmdyaWRBcGkgPSBwYXJhbXMuYXBpO1xyXG4gICAgdGhpcy5ncmlkQ29sdW1uQXBpID0gcGFyYW1zLmNvbHVtbkFwaTtcclxuICAgIGZvciAoY29uc3QgY29sIG9mIHRoaXMuY29sdW1uRGVmcykge1xyXG4gICAgICBpZighdGhpcy5zb21lQ29sdW1uSXNFZGl0YWJsZSAmJiBjb2wuZWRpdGFibGUpIHsgdGhpcy5zb21lQ29sdW1uSXNFZGl0YWJsZSA9IHRydWV9XHJcbiAgICAgIGlmIChjb2wuZmllbGQgPT09ICdzdGF0dXMnKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0dXNDb2x1bW4gPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLmdldEVsZW1lbnRzKCk7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLmNvbHVtbkRlZnMpO1xyXG4gICAgaWYgKHRoaXMuZGVmYXVsdENvbHVtblNvcnRpbmcpIHtcclxuICAgICAgaWYoIUFycmF5LmlzQXJyYXkodGhpcy5kZWZhdWx0Q29sdW1uU29ydGluZykpXHJcbiAgICAgIHtcclxuICAgICAgICBjb25zdCBzb3J0TW9kZWwgPSBbXHJcbiAgICAgICAgICB7IGNvbElkOiB0aGlzLmRlZmF1bHRDb2x1bW5Tb3J0aW5nLCBzb3J0OiAnYXNjJyB9XHJcbiAgICAgICAgXTtcclxuICAgICAgICB0aGlzLmdyaWRBcGkuc2V0U29ydE1vZGVsKHNvcnRNb2RlbCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICBsZXQgc29ydE1vZGVsID0gW107XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0Q29sdW1uU29ydGluZy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgc29ydE1vZGVsLnB1c2goeyBjb2xJZDogZWxlbWVudCwgc29ydDogJ2FzYycgfSlcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdyaWRBcGkuc2V0U29ydE1vZGVsKHNvcnRNb2RlbCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmRlZmF1bHRIZWlnaHQgIT0gbnVsbCAmJiB0aGlzLmRlZmF1bHRIZWlnaHQgIT0gdW5kZWZpbmVkKXtcclxuICAgICAgdGhpcy5jaGFuZ2VIZWlnaHQodGhpcy5kZWZhdWx0SGVpZ2h0KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIGdldERhdGVQaWNrZXIoKSB7XHJcbiAgICBmdW5jdGlvbiBEYXRlcGlja2VyKCkge31cclxuICAgIERhdGVwaWNrZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgIHRoaXMuZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgdGhpcy5lSW5wdXQudmFsdWUgPSBwYXJhbXMudmFsdWU7XHJcbiAgICAgIHRoaXMuZUlucHV0LmNsYXNzTGlzdC5hZGQoJ2FnLWlucHV0Jyk7XHJcbiAgICAgIHRoaXMuZUlucHV0LnN0eWxlLmhlaWdodCA9ICcxMDAlJztcclxuICAgICAgJCh0aGlzLmVJbnB1dCkuZGF0ZXBpY2tlcih7IGRhdGVGb3JtYXQ6ICdtbS9kZC95eScgfSk7XHJcbiAgICB9O1xyXG4gICAgRGF0ZXBpY2tlci5wcm90b3R5cGUuZ2V0R3VpID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5lSW5wdXQ7XHJcbiAgICB9O1xyXG4gICAgRGF0ZXBpY2tlci5wcm90b3R5cGUuYWZ0ZXJHdWlBdHRhY2hlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5lSW5wdXQuZm9jdXMoKTtcclxuICAgICAgdGhpcy5lSW5wdXQuc2VsZWN0KCk7XHJcbiAgICB9O1xyXG4gICAgRGF0ZXBpY2tlci5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmVJbnB1dC52YWx1ZTtcclxuICAgIH07XHJcbiAgICBEYXRlcGlja2VyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge307XHJcbiAgICBEYXRlcGlja2VyLnByb3RvdHlwZS5pc1BvcHVwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIERhdGVwaWNrZXI7XHJcbiAgfVxyXG5cclxuICBhcmVSb3dzU2VsZWN0ZWQoKTogQm9vbGVhbiB7XHJcbiAgICByZXR1cm4gKHRoaXMuZ3JpZEFwaSAhPSBudWxsICYmIHRoaXMuZ3JpZEFwaS5nZXRTZWxlY3RlZE5vZGVzKCkubGVuZ3RoID4gMCk/IHRydWU6IGZhbHNlO1xyXG4gICAgLy8gaWYgKHRoaXMuZ3JpZEFwaSAhPSBudWxsICYmIHRoaXMuZ3JpZEFwaS5nZXRTZWxlY3RlZE5vZGVzKCkubGVuZ3RoID4gMCkge1xyXG4gICAgLy8gICByZXR1cm4gdHJ1ZVxyXG4gICAgLy8gfSBlbHNlIHtcclxuICAgIC8vICAgcmV0dXJuIGZhbHNlXHJcbiAgICAvLyB9XHJcbiAgfVxyXG5cclxuXHJcbiAgZW1pdFNlbGVjdGVkUm93cygpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSB0aGlzLmdyaWRBcGkuZ2V0U2VsZWN0ZWROb2RlcygpO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWREYXRhID0gc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiBub2RlLmRhdGEpO1xyXG4gICAgdGhpcy5nZXRTZWxlY3RlZFJvd3MuZW1pdChzZWxlY3RlZERhdGEpO1xyXG4gIH1cclxuXHJcbiAgZW1pdEFsbFJvd3MoZXZlbnQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgLy8gbGV0IHJvd0RhdGEgPSBbXTtcclxuICAgIC8vIHRoaXMuZ3JpZEFwaS5mb3JFYWNoTm9kZShub2RlID0+IHJvd0RhdGEucHVzaChub2RlLmRhdGEpKTtcclxuICAgIHRoaXMuZ2V0QWxsUm93cy5lbWl0KHtkYXRhOiB0aGlzLmdldEFsbEN1cnJlbnREYXRhKCksIGV2ZW50OiBldmVudH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRBbGxDdXJyZW50RGF0YSgpOiBBcnJheTxhbnk+e1xyXG4gICAgbGV0IHJvd0RhdGEgPSBbXTtcclxuICAgIHRoaXMuZ3JpZEFwaS5mb3JFYWNoTm9kZShub2RlID0+IHJvd0RhdGEucHVzaChub2RlLmRhdGEpKTtcclxuICAgIHJldHVybiByb3dEYXRhO1xyXG4gIH1cclxuXHJcbiAgbW9kaWZ5U3RhdHVzU2VsZWN0ZWQoc3RhdHVzPzogc3RyaW5nKTogdm9pZHtcclxuICAgIGxldCBuZXdTdGF0dXM9c3RhdHVzP3N0YXR1czp0aGlzLm5ld1N0YXR1c1JlZ2lzdGVyO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IHRoaXMuZ3JpZEFwaS5nZXRTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IHtcclxuICAgICAgbm9kZS5kYXRhLnN0YXR1cz1uZXdTdGF0dXM7XHJcbiAgICAgIG5vZGUuc2VsZWN0ZWQ9ZmFsc2U7XHJcbiAgICB9ICk7XHJcbiAgICB0aGlzLmdyaWRBcGkucmVkcmF3Um93cygpO1xyXG4gIH1cclxuXHJcbiAgc2F2ZUFnR3JpZFN0YXRlKCk6IHZvaWQge1xyXG4gICAgbGV0IGFnR3JpZFN0YXRlID0ge1xyXG4gICAgICBpZEFnR3JpZDogdGhpcy5pZCxcclxuICAgICAgY29sU3RhdGU6IHRoaXMuZ3JpZENvbHVtbkFwaS5nZXRDb2x1bW5TdGF0ZSgpLFxyXG4gICAgICBmaWx0ZXJTdGF0ZTogdGhpcy5ncmlkQXBpLmdldEZpbHRlck1vZGVsKCksXHJcbiAgICAgIHNvcnRTdGF0ZTogdGhpcy5ncmlkQXBpLmdldFNvcnRNb2RlbCgpLFxyXG4gICAgICB2YWx1ZVNlYXJjaEdlbmVyaWM6IHRoaXMuc2VhcmNoVmFsdWVcclxuICAgIH07XHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhZ0dyaWRTdGF0ZVwiLCBKU09OLnN0cmluZ2lmeShhZ0dyaWRTdGF0ZSkpO1xyXG5cclxuICB9XHJcbiAgcmVtb3ZlQWdHcmlkU3RhdGUoKTogdm9pZCB7XHJcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFnR3JpZFN0YXRlXCIpXHJcbiAgfVxyXG5cclxuICBnZXRDb2x1bW5LZXlzQW5kSGVhZGVycyhjb2x1bW5rZXlzOiBBcnJheTxhbnk+KTogU3RyaW5nIHtcclxuICAgIGxldCBoZWFkZXI6IEFycmF5PGFueT4gPSBbXTtcclxuICAgIGlmICh0aGlzLmNvbHVtbkRlZnMubGVuZ3RoID09IDApIHsgcmV0dXJuICcnIH07XHJcblxyXG4gICAgbGV0IGFsbENvbHVtbktleXMgPSB0aGlzLmdyaWRPcHRpb25zLmNvbHVtbkFwaS5nZXRBbGxEaXNwbGF5ZWRDb2x1bW5zKCk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhhbGxDb2x1bW5LZXlzKTtcclxuICAgIGFsbENvbHVtbktleXMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgaWYgKGVsZW1lbnQudXNlclByb3ZpZGVkQ29sRGVmLmhlYWRlck5hbWUgIT09ICcnKSB7XHJcbiAgICAgICAgY29sdW1ua2V5cy5wdXNoKGVsZW1lbnQudXNlclByb3ZpZGVkQ29sRGVmLmZpZWxkKTtcclxuICAgICAgICBoZWFkZXIucHVzaChlbGVtZW50LnVzZXJQcm92aWRlZENvbERlZi5oZWFkZXJOYW1lKTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gaGVhZGVyLmpvaW4oXCIsXCIpO1xyXG4gIH1cclxuXHJcblxyXG4gIGV4cG9ydERhdGEoKTogdm9pZCB7XHJcbiAgICBsZXQgY29sdW1ua2V5czogQXJyYXk8YW55PiA9IFtdO1xyXG4gICAgbGV0IGN1c3RvbUhlYWRlcjogU3RyaW5nID0gJyc7XHJcbiAgICBjdXN0b21IZWFkZXIgPSB0aGlzLmdldENvbHVtbktleXNBbmRIZWFkZXJzKGNvbHVtbmtleXMpXHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICBvbmx5U2VsZWN0ZWQ6IHRydWUsXHJcbiAgICAgIGNvbHVtbktleXM6IGNvbHVtbmtleXMsXHJcbiAgICAgIGN1c3RvbUhlYWRlcjogY3VzdG9tSGVhZGVyLFxyXG4gICAgICBza2lwSGVhZGVyOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgdGhpcy5ncmlkQXBpLmV4cG9ydERhdGFBc0NzdihwYXJhbXMpO1xyXG4gIH1cclxuXHJcbiAgcXVpY2tTZWFyY2goKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc2V0UXVpY2tGaWx0ZXIodGhpcy5zZWFyY2hWYWx1ZSk7XHJcbiAgfVxyXG5cclxuICBnZXRFbGVtZW50cygpOiB2b2lkIHtcclxuICAgIHRoaXMuZ2V0QWxsKClcclxuICAgICAgLnN1YnNjcmliZSgoaXRlbXMpID0+IHtcclxuICAgICAgICBsZXQgc3RhdHVzID0gdGhpcy5hbGxOZXdFbGVtZW50cz8ncGVuZGluZ0NyZWF0aW9uJzonc3RhdHVzT0snXHJcbiAgICAgICAgbGV0IG5ld0l0ZW1zID0gW107XHJcbiAgICAgICAgbGV0IGNvbmRpdGlvbiA9ICh0aGlzLmFkZEZpZWxkUmVzdHJpY3Rpb24pPyB0aGlzLmFkZEZpZWxkUmVzdHJpY3Rpb246ICdpZCc7XHJcbiAgICAgICAgaXRlbXMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgIGlmKHRoaXMuc3RhdHVzQ29sdW1uKXtcclxuICAgICAgICAgICAgaWYoZWxlbWVudC5zdGF0dXMgIT0gXCJub3RBdmFpbGFibGVcIiAmJiBlbGVtZW50LnN0YXR1cyAhPSBcInBlbmRpbmdDcmVhdGlvblwiICYmIGVsZW1lbnQuc3RhdHVzICE9IFwicGVuZGluZ1JlZ2lzdHJhdGlvblwiICYmIGVsZW1lbnQuc3RhdHVzICE9IFwidW5yZWdpc3RlcmVkTGF5ZXJcIil7XHJcbiAgICAgICAgICAgICAgZWxlbWVudC5zdGF0dXM9c3RhdHVzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodGhpcy5hbGxOZXdFbGVtZW50cykgeyBlbGVtZW50Lm5ldyA9IHRydWU7IH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmKHRoaXMuY3VycmVudERhdGEpe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0VsZW1lbnRBbGxvd2VkVG9BZGQoY29uZGl0aW9uLGVsZW1lbnQsIHRoaXMuY3VycmVudERhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdJdGVtcy5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gaWYodGhpcy5zdGF0dXNDb2x1bW4pe1xyXG4gICAgICAgIC8vICAgbGV0IHN0YXR1cyA9IHRoaXMuYWxsTmV3RWxlbWVudHM/J3BlbmRpbmdDcmVhdGlvbic6J3N0YXR1c09LJ1xyXG4gICAgICAgIC8vICAgaXRlbXMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAvLyAgICAgaWYoZWxlbWVudC5zdGF0dXMgIT0gXCJub3RBdmFpbGFibGVcIiAmJiBlbGVtZW50LnN0YXR1cyAhPSBcInBlbmRpbmdDcmVhdGlvblwiICYmIGVsZW1lbnQuc3RhdHVzICE9IFwicGVuZGluZ1JlZ2lzdHJhdGlvblwiICYmIGVsZW1lbnQuc3RhdHVzICE9IFwidW5yZWdpc3RlcmVkTGF5ZXJcIil7XHJcbiAgICAgICAgLy8gICAgICAgZWxlbWVudC5zdGF0dXM9c3RhdHVzXHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyAgICAgaWYodGhpcy5hbGxOZXdFbGVtZW50cykgeyBlbGVtZW50Lm5ldyA9IHRydWU7IH1cclxuICAgICAgICAvLyAgIH0pO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICB0aGlzLnJvd0RhdGEgPSB0aGlzLmN1cnJlbnREYXRhP25ld0l0ZW1zOiBpdGVtcztcclxuICAgICAgICB0aGlzLmdyaWRBcGkuc2V0Um93RGF0YSh0aGlzLnJvd0RhdGEpO1xyXG4gICAgICAgIHRoaXMuc2V0U2l6ZSgpXHJcbiAgICAgICAgLy8gdGhpcy5ncmlkQXBpLnNpemVDb2x1bW5zVG9GaXQoKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMucm93RGF0YSk7XHJcblxyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldFNpemUoKSB7XHJcblxyXG4gICAgdmFyIGFsbENvbHVtbklkcyA9IFtdO1xyXG4gICAgbGV0IGNvbHVtbnMgPSB0aGlzLmdyaWRPcHRpb25zLmNvbHVtbkFwaS5nZXRBbGxDb2x1bW5zKCk7XHJcbiAgICBjb2x1bW5zLmZvckVhY2goZnVuY3Rpb24gKGNvbHVtbikge1xyXG4gICAgICBhbGxDb2x1bW5JZHMucHVzaChjb2x1bW4uY29sSWQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5ncmlkT3B0aW9ucy5jb2x1bW5BcGkuYXV0b1NpemVDb2x1bW5zKGFsbENvbHVtbklkcyk7XHJcblxyXG4gICAgbGV0IGdyaWQgPSB0aGlzLmdyaWRPcHRpb25zLmFwaVxyXG4gICAgbGV0IGF2YWlsYWJsZVdpZHRoID0gZ3JpZC5ncmlkUGFuZWwuZUJvZHlWaWV3cG9ydC5jbGllbnRXaWR0aDtcclxuXHJcbiAgICBsZXQgdXNlZFdpZHRoID0gZ3JpZC5ncmlkUGFuZWwuY29sdW1uQ29udHJvbGxlci5nZXRXaWR0aE9mQ29sc0luTGlzdChjb2x1bW5zKTtcclxuXHJcbiAgICBpZiAodXNlZFdpZHRoIDwgYXZhaWxhYmxlV2lkdGgpIHtcclxuICAgICAgZ3JpZC5zaXplQ29sdW1uc1RvRml0KCk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgYWRkSXRlbXMobmV3SXRlbXM6IGFueVtdKTogdm9pZCB7XHJcbiAgICBjb25zb2xlLmxvZyhuZXdJdGVtcyk7XHJcbiAgICBsZXQgaXRlbXNUb0FkZDogQXJyYXk8YW55PiA9IFtdO1xyXG4gICAgbGV0IGNvbmRpdGlvbiA9ICh0aGlzLmFkZEZpZWxkUmVzdHJpY3Rpb24pPyB0aGlzLmFkZEZpZWxkUmVzdHJpY3Rpb246ICdpZCc7XHJcbiAgICBcclxuXHJcbiAgICBuZXdJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG5cclxuICAgICAgaWYgKHRoaXMuY2hlY2tFbGVtZW50QWxsb3dlZFRvQWRkKGNvbmRpdGlvbixpdGVtLCB0aGlzLnJvd0RhdGEpKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzQ29sdW1uKSB7XHJcbiAgICAgICAgICBpdGVtLnN0YXR1cyA9ICdwZW5kaW5nQ3JlYXRpb24nXHJcbiAgICAgICAgICBpdGVtLm5ld0l0ZW0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpdGVtc1RvQWRkLnB1c2goaXRlbSk7XHJcbiAgICAgICAgdGhpcy5yb3dEYXRhLnB1c2goaXRlbSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYEl0ZW0gYWxyZWFkeSBleGlzdHNgKVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHRoaXMuZ3JpZEFwaS51cGRhdGVSb3dEYXRhKHsgYWRkOiBpdGVtc1RvQWRkIH0pO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKHRoaXMuY29sdW1uRGVmcyk7XHJcbiAgICAvLyBwYXJhbXMub2xkVmFsdWUhPXVuZGVmaW5lZFxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVja0VsZW1lbnRBbGxvd2VkVG9BZGQoY29uZGl0aW9uLCBpdGVtLCBkYXRhKXtcclxuXHJcbiAgICBsZXQgZmluYWxBZGRpdGlvbiA9IHRydWU7XHJcblxyXG4gICAgaWYoQXJyYXkuaXNBcnJheShjb25kaXRpb24pKXtcclxuXHJcbiAgICAgIGZvcihsZXQgZWxlbWVudCBvZiBkYXRhKXtcclxuICAgICAgICBsZXQgY2FuQWRkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvcihsZXQgY3VycmVudENvbmRpdGlvbiBvZiBjb25kaXRpb24pe1xyXG4gICAgICAgICAgaWYoZWxlbWVudFtjdXJyZW50Q29uZGl0aW9uXSAhPSBpdGVtW2N1cnJlbnRDb25kaXRpb25dKXtcclxuICAgICAgICAgICAgY2FuQWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFjYW5BZGQpIHtcclxuICAgICAgICAgICBmaW5hbEFkZGl0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGZpbmFsQWRkaXRpb247XHJcblxyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgaWYodGhpcy5maWVsZFJlc3RyaWN0aW9uV2l0aERpZmZlcmVudE5hbWUpe1xyXG4gICAgICAgIHJldHVybiAoaXRlbVtjb25kaXRpb25dID09IHVuZGVmaW5lZCB8fCAoZGF0YS5maW5kKGVsZW1lbnQgPT4gZWxlbWVudFt0aGlzLmZpZWxkUmVzdHJpY3Rpb25XaXRoRGlmZmVyZW50TmFtZV0gPT0gaXRlbVtjb25kaXRpb25dKSkgPT0gdW5kZWZpbmVkKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiAoaXRlbVtjb25kaXRpb25dID09IHVuZGVmaW5lZCB8fCAoZGF0YS5maW5kKGVsZW1lbnQgPT4gZWxlbWVudFtjb25kaXRpb25dID09IGl0ZW1bY29uZGl0aW9uXSkpID09IHVuZGVmaW5lZClcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuXHJcbiAgY2hhbmdlSGVpZ2h0KHZhbHVlKSB7XHJcbiAgICBsZXQgcGl4ZWxzID0gXCJcIjtcclxuICAgIGlmICh2YWx1ZSA9PT0gJzUnKSB7XHJcbiAgICAgIHBpeGVscyA9IFwiMjAwcHhcIlxyXG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJzEwJykge1xyXG4gICAgICBwaXhlbHMgPSBcIjMxNXB4XCJcclxuICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICcyMCcpIHtcclxuICAgICAgcGl4ZWxzID0gXCI2MzBweFwiXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwaXhlbHMgPSBcIjE1NTBweFwiXHJcbiAgICB9XHJcbiAgICB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZS5oZWlnaHQgPSBwaXhlbHM7XHJcbiAgfVxyXG5cclxuICByZW1vdmVEYXRhKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSB0aGlzLmdyaWRBcGkuZ2V0U2VsZWN0ZWROb2RlcygpO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWREYXRhID0gc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiBub2RlLmRhdGEpO1xyXG4gICAgdGhpcy5yZW1vdmUuZW1pdChzZWxlY3RlZERhdGEpO1xyXG5cclxuICAgIGlmICh0aGlzLnN0YXR1c0NvbHVtbikge1xyXG4gICAgICBjb25zdCBzZWxlY3RlZFJvd3MgPSBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IG5vZGUuaWQpO1xyXG4gICAgICBpZihzZWxlY3RlZFJvd3MubGVuZ3RoPjApIHt0aGlzLnNvbWVTdGF0dXNIYXNDaGFuZ2VkVG9EZWxldGU9dHJ1ZTt9XHJcbiAgICAgIGZvciAoY29uc3QgaWQgb2Ygc2VsZWN0ZWRSb3dzKSB7XHJcbiAgICAgICAgdGhpcy5ncmlkQXBpLmdldFJvd05vZGUoaWQpLmRhdGEuc3RhdHVzID0gJ3BlbmRpbmdEZWxldGUnO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZ3JpZE9wdGlvbnMuYXBpLnJlZnJlc2hDZWxscygpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5ncmlkT3B0aW9ucy5hcGkuZGVzZWxlY3RBbGwoKTtcclxuICB9XHJcblxyXG4gIG5ld0RhdGEoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgdGhpcy5uZXcuZW1pdCgtMSk7XHJcbiAgfVxyXG5cclxuICBvbkFkZEJ1dHRvbkNsaWNrZWQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgdGhpcy5hZGQuZW1pdCh0aGlzLmdldEFsbEN1cnJlbnREYXRhKCkpO1xyXG4gIH1cclxuXHJcbiAgb25EdXBsaWNhdGVCdXR0b25DbGlja2VkKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIGlmICh0aGlzLmNoYW5nZUNvdW50ZXIgPiAwKSB7XHJcbiAgICAgIGNvbnN0IGRpYWxvZ1JlZiA9IHRoaXMuZGlhbG9nLm9wZW4oRGlhbG9nTWVzc2FnZUNvbXBvbmVudCk7XHJcbiAgICAgIGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS50aXRsZSA9IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoJ2NhdXRpb24nKVxyXG4gICAgICBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UubWVzc2FnZSA9IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoJ2R1cGxpY2F0ZU1lc3NhZ2UnKVxyXG4gICAgICBkaWFsb2dSZWYuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICBpZiAocmVzdWx0LmV2ZW50ID09PSAnQWNjZXB0Jykge1xyXG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKTtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWREYXRhID0gc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiBub2RlLmRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLmR1cGxpY2F0ZS5lbWl0KHNlbGVjdGVkRGF0YSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IHRoaXMuZ3JpZEFwaS5nZXRTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGVkRGF0YSA9IHNlbGVjdGVkTm9kZXMubWFwKG5vZGUgPT4gbm9kZS5kYXRhKTtcclxuICAgICAgdGhpcy5kdXBsaWNhdGUuZW1pdChzZWxlY3RlZERhdGEpO1xyXG4gICAgICB0aGlzLmdyaWRPcHRpb25zLmFwaS5kZXNlbGVjdEFsbCgpO1xyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBhcHBseUNoYW5nZXMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBpdGVtc0NoYW5nZWQ6IGFueVtdID0gW107XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgZm9yIChjb25zdCBrZXkgb2YgdGhpcy5jaGFuZ2VzTWFwLmtleXMoKSkge1xyXG4gICAgICBpdGVtc0NoYW5nZWQucHVzaCh0aGlzLmdyaWRBcGkuZ2V0Um93Tm9kZShrZXkpLmRhdGEpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zZW5kQ2hhbmdlcy5lbWl0KGl0ZW1zQ2hhbmdlZCk7XHJcbiAgICB0aGlzLmdyaWRNb2RpZmllZC5lbWl0KGZhbHNlKTtcclxuICAgIHRoaXMuY2hhbmdlc01hcC5jbGVhcigpO1xyXG4gICAgdGhpcy5jaGFuZ2VDb3VudGVyID0gMDtcclxuICAgIHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyID0gMDtcclxuICAgIHRoaXMucmVkb0NvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5zb21lU3RhdHVzSGFzQ2hhbmdlZFRvRGVsZXRlPWZhbHNlO1xyXG4gICAgLy8gdGhpcy5wYXJhbXMuY29sRGVmLmNlbGxTdHlsZSA9IHsgYmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRicgfTtcclxuICAgIHRoaXMuZ3JpZEFwaS5yZWRyYXdSb3dzKCk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIGRlbGV0ZUNoYW5nZXMoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgbGV0IG5ld0VsZW1lbnRzQWN0aXZlZD0gdGhpcy5hbGxOZXdFbGVtZW50cztcclxuXHJcbiAgICB3aGlsZSAodGhpcy5jaGFuZ2VDb3VudGVyID4gMCkge1xyXG4gICAgICB0aGlzLnVuZG8oKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNoYW5nZXNNYXAuY2xlYXIoKTtcclxuICAgIC8vdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5yZWRvQ291bnRlciA9IDA7XHJcblxyXG4gICAgaWYodGhpcy5zdGF0dXNDb2x1bW4gJiYgIXRoaXMuZGlzY2FyZE5vblJldmVyc2VTdGF0dXMpXHJcbiAgICB7XHJcbiAgICAgIGxldCByb3dzV2l0aFN0YXR1c01vZGlmaWVkID0gW107XHJcbiAgICAgIHRoaXMuZ3JpZEFwaS5mb3JFYWNoTm9kZShmdW5jdGlvbihub2RlKSB7IFxyXG4gICAgICAgIGlmKG5vZGUuZGF0YS5zdGF0dXMgPT09ICdwZW5kaW5nTW9kaWZ5JyB8fCBub2RlLmRhdGEuc3RhdHVzID09PSAncGVuZGluZ0RlbGV0ZScpIHtcclxuICAgICAgICAgIGlmKG5vZGUuZGF0YS5zdGF0dXMgPT09ICdwZW5kaW5nRGVsZXRlJyl7XHJcbiAgICAgICAgICAgIHJvd3NXaXRoU3RhdHVzTW9kaWZpZWQucHVzaChub2RlLmRhdGEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYobm9kZS5kYXRhLm5ld0l0ZW0gfHwgbmV3RWxlbWVudHNBY3RpdmVkKXtcclxuICAgICAgICAgICAgbm9kZS5kYXRhLnN0YXR1cz0ncGVuZGluZ0NyZWF0aW9uJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgbm9kZS5kYXRhLnN0YXR1cz0nc3RhdHVzT0snXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnNvbWVTdGF0dXNIYXNDaGFuZ2VkVG9EZWxldGU9ZmFsc2U7XHJcbiAgICB0aGlzLmRpc2NhcmRDaGFuZ2VzLmVtaXQocm93c1dpdGhTdGF0dXNNb2RpZmllZCk7XHJcbiAgICB0aGlzLmdyaWRNb2RpZmllZC5lbWl0KGZhbHNlKTtcclxuICB9XHJcbiAgdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3MoKTtcclxuXHJcbiAgICAvL3RoaXMucGFyYW1zLmNvbERlZi5jZWxsU3R5bGUgPSAge2JhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnfTtcclxuICAgIC8vdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3MoKTtcclxuICB9XHJcblxyXG5cclxuICBvbkZpbHRlck1vZGlmaWVkKCk6IHZvaWQge1xyXG5cclxuICAgIHRoaXMuZGVsZXRlQ2hhbmdlcygpO1xyXG5cclxuICB9XHJcblxyXG5cclxuICB1bmRvKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIHRoaXMuZ3JpZEFwaS51bmRvQ2VsbEVkaXRpbmcoKTtcclxuICAgIHRoaXMuY2hhbmdlQ291bnRlciAtPSAxO1xyXG4gICAgaWYodGhpcy5jaGFuZ2VDb3VudGVyID09IDApIHsgdGhpcy5ncmlkTW9kaWZpZWQuZW1pdChmYWxzZSl9XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyICs9IDE7XHJcbiAgfVxyXG5cclxuICByZWRvKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIHRoaXMuZ3JpZEFwaS5yZWRvQ2VsbEVkaXRpbmcoKTtcclxuICAgIHRoaXMuY2hhbmdlQ291bnRlciArPSAxO1xyXG4gICAgdGhpcy5yZWRvQ291bnRlciAtPSAxO1xyXG4gIH1cclxuXHJcblxyXG4gIG9uQ2VsbEVkaXRpbmdTdG9wcGVkKGUpIHtcclxuICAgIGlmICh0aGlzLm1vZGlmaWNhdGlvbkNoYW5nZSkge1xyXG4gICAgICB0aGlzLmNoYW5nZUNvdW50ZXIrKztcclxuICAgICAgaWYodGhpcy5jaGFuZ2VDb3VudGVyID09IDEpIHsgdGhpcy5ncmlkTW9kaWZpZWQuZW1pdCh0cnVlKX1cclxuICAgICAgdGhpcy5yZWRvQ291bnRlciA9IDA7XHJcbiAgICAgIHRoaXMub25DZWxsVmFsdWVDaGFuZ2VkKGUpO1xyXG4gICAgICB0aGlzLm1vZGlmaWNhdGlvbkNoYW5nZSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIG9uQ2VsbFZhbHVlQ2hhbmdlZChwYXJhbXMpOiB2b2lkIHtcclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgaWYgKHRoaXMuY2hhbmdlQ291bnRlciA+IHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyKVxyXG4gICAgLy8gVHJ1ZSBpZiB3ZSBoYXZlIGVkaXRlZCBzb21lIGNlbGwgb3Igd2UgaGF2ZSBkb25lIGEgcmVkbyBcclxuICAgIHtcclxuXHJcbiAgICAgIGlmIChwYXJhbXMub2xkVmFsdWUgIT09IHBhcmFtcy52YWx1ZSAmJiAhKHBhcmFtcy5vbGRWYWx1ZSA9PSBudWxsICYmIHBhcmFtcy52YWx1ZSA9PT0gJycpKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5jaGFuZ2VzTWFwLmhhcyhwYXJhbXMubm9kZS5pZCkpIC8vIElmIGl0J3MgZmlydHMgZWRpdCBvZiBhIGNlbGwsIHdlIGFkZCBpdCB0byB0aGUgbWFwIGFuZCB3ZSBwYWludCBpdFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGNvbnN0IGFkZE1hcDogTWFwPHN0cmluZywgbnVtYmVyPiA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XHJcbiAgICAgICAgICBhZGRNYXAuc2V0KHBhcmFtcy5jb2xEZWYuZmllbGQsIDEpXHJcbiAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuc2V0KHBhcmFtcy5ub2RlLmlkLCBhZGRNYXApO1xyXG4gICAgICAgICAgaWYgKHRoaXMuc3RhdHVzQ29sdW1uKSB7XHJcbiAgICAgICAgICAgIC8vIGlmICh0aGlzLmdyaWRBcGkuZ2V0Um93Tm9kZShwYXJhbXMubm9kZS5pZCkuZGF0YS5zdGF0dXMgIT09ICdwZW5kaW5nQ3JlYXRpb24nKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5ncmlkQXBpLmdldFJvd05vZGUocGFyYW1zLm5vZGUuaWQpLmRhdGEuc3RhdHVzID0gJ3BlbmRpbmdNb2RpZnknXHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmhhcyhwYXJhbXMuY29sRGVmLmZpZWxkKSkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuc2V0KHBhcmFtcy5jb2xEZWYuZmllbGQsIDEpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBXZSBhbHJlYWR5IGhhZCBlZGl0ZWQgdGhpcyBjZWxsLCBzbyB3ZSBvbmx5IGluY3JlbWVudCBudW1iZXIgb2YgY2hhbmdlcyBvZiBpdCBvbiB0aGUgbWFwIFxyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2hhbmdlcyA9IHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmdldChwYXJhbXMuY29sRGVmLmZpZWxkKTtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuc2V0KHBhcmFtcy5jb2xEZWYuZmllbGQsIChjdXJyZW50Q2hhbmdlcyArIDEpKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGFpbnRDZWxscyhwYXJhbXMsIHRoaXMuY2hhbmdlc01hcCk7IC8vV2UgcGFpbnQgdGhlIHJvdyBvZiB0aGUgZWRpdGVkIGNlbGwgXHJcbiAgICAgICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIrKzsgLy9XZSBtYXRjaCB0aGUgY3VycmVudCBwcmV2aW91c0NoYW5nZUNvdW50ZXIgd2l0aCBjaGFuZ2VDb3VudGVyXHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0aGlzLmNoYW5nZUNvdW50ZXIgPCB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlcikgeyAvLyBUcnVlIGlmIHdlIGhhdmUgZG9uZSBhbiB1bmRvXHJcbiAgICAgIGxldCBjdXJyZW50Q2hhbmdlcyA9IC0xO1xyXG4gICAgICBpZiAodGhpcy5jaGFuZ2VzTWFwLmhhcyhwYXJhbXMubm9kZS5pZCkpIHsgY3VycmVudENoYW5nZXMgPSB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5nZXQocGFyYW1zLmNvbERlZi5maWVsZCk7IH1cclxuXHJcbiAgICAgIGlmIChjdXJyZW50Q2hhbmdlcyA9PT0gMSkgeyAvL09uY2UgdGhlIHVuZG8gaXQncyBkb25lLCBjZWxsIGlzIGluIGhpcyBpbml0aWFsIHN0YXR1c1xyXG5cclxuICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5kZWxldGUocGFyYW1zLmNvbERlZi5maWVsZCk7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLnNpemUgPT09IDApIHsgLy8gTm8gbW9yZSBtb2RpZmljYXRpb25zIGluIHRoaXMgcm93XHJcbiAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZGVsZXRlKHBhcmFtcy5ub2RlLmlkKTtcclxuICAgICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuZ3JpZEFwaS5nZXREaXNwbGF5ZWRSb3dBdEluZGV4KHBhcmFtcy5yb3dJbmRleCk7XHJcbiAgICAgICAgICBpZiAodGhpcy5zdGF0dXNDb2x1bW4pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZEFwaS5nZXRSb3dOb2RlKHBhcmFtcy5ub2RlLmlkKS5kYXRhLnN0YXR1cyAhPT0gJ3BlbmRpbmdDcmVhdGlvbicpIHtcclxuICAgICAgICAgICAgICB0aGlzLmdyaWRBcGkuZ2V0Um93Tm9kZShwYXJhbXMubm9kZS5pZCkuZGF0YS5zdGF0dXMgPSdzdGF0dXNPSydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIC8vIFdlIHBhaW50IGl0IHdoaXRlXHJcbiAgICAgICAgICB0aGlzLmdyaWRBcGkucmVkcmF3Um93cyh7IHJvd05vZGVzOiBbcm93XSB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5wYWludENlbGxzKHBhcmFtcywgdGhpcy5jaGFuZ2VzTWFwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKGN1cnJlbnRDaGFuZ2VzID4gMSkgLy8gVGhlIGNlbGwgaXNuJ3QgaW4gaGlzIGluaXRpYWwgc3RhdGUgeWV0XHJcbiAgICAgIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1dlIGNhbid0IGRvIGVsc2UgYmVjYXVzZSB3ZSBjYW4gYmUgZG9pbmcgYW4gdW5kbyB3aXRob3V0IGNoYW5nZXMgXHJcbiAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuc2V0KHBhcmFtcy5jb2xEZWYuZmllbGQsIChjdXJyZW50Q2hhbmdlcyAtIDEpKTtcclxuXHJcbiAgICAgICAgdGhpcy5wYWludENlbGxzKHBhcmFtcywgdGhpcy5jaGFuZ2VzTWFwKTsvL05vdCBpbml0aWFsIHN0YXRlIC0+IGdyZWVuIGJhY2tncm91bmRcclxuXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXItLTsgIC8vV2UgZGVjcmVtZW50IHByZXZpb3VzQ2hhbmdlQ291bnRlciBiZWNhdXNlIHdlIGhhdmUgZG9uZSB1bmRvXHJcbiAgICB9XHJcbiAgICBlbHNlIHsgLy8gQ29udHJvbCBvZiBtb2RpZmljYXRpb25zIHdpdGhvdXQgY2hhbmdlc1xyXG4gICAgICBpZiAoIShwYXJhbXMub2xkVmFsdWUgPT0gbnVsbCAmJiBwYXJhbXMudmFsdWUgPT09ICcnKSkge1xyXG4gICAgICAgIGxldCBuZXdWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIGlmIChwYXJhbXMudmFsdWUgPT0gbnVsbCkgeyBuZXdWYWx1ZSA9ICcnIH1cclxuICAgICAgICBlbHNlIHsgbmV3VmFsdWUgPSBwYXJhbXMudmFsdWUudG9TdHJpbmcoKSB9XHJcblxyXG4gICAgICAgIGlmICgocGFyYW1zLm9sZFZhbHVlICE9IHVuZGVmaW5lZCAmJiBwYXJhbXMub2xkVmFsdWUgIT0gbnVsbCAmJiBwYXJhbXMub2xkVmFsdWUudG9TdHJpbmcoKSAhPT0gbmV3VmFsdWUudG9TdHJpbmcoKSlcclxuICAgICAgICAgIHx8ICgocGFyYW1zLm9sZFZhbHVlID09IHVuZGVmaW5lZCB8fCBwYXJhbXMub2xkVmFsdWUgPT0gbnVsbCkgJiYgbmV3VmFsdWUgIT0gbnVsbCkpIHtcclxuXHJcbiAgICAgICAgICB0aGlzLm1vZGlmaWNhdGlvbkNoYW5nZSA9IHRydWU7XHJcbiAgICAgICAgICBpZiAocGFyYW1zLmNvbERlZi5jZWxsUmVuZGVyZXIgPT0gXCJidG5DaGVja2JveFJlbmRlcmVyQ29tcG9uZW50XCIpIHtcclxuICAgICAgICAgICAgdmFyIHVuZG9SZWRvQWN0aW9ucyA9IHtcclxuICAgICAgICAgICAgICBjZWxsVmFsdWVDaGFuZ2VzOiB0aGlzLmdyaWRBcGkudW5kb1JlZG9TZXJ2aWNlLmNlbGxWYWx1ZUNoYW5nZXNcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5ncmlkQXBpLnVuZG9SZWRvU2VydmljZS5wdXNoQWN0aW9uc1RvVW5kb1N0YWNrKHVuZG9SZWRvQWN0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JpZEFwaS51bmRvUmVkb1NlcnZpY2UuaXNGaWxsaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMub25DZWxsRWRpdGluZ1N0b3BwZWQocGFyYW1zKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7IHRoaXMubW9kaWZpY2F0aW9uV2l0aG91dENoYW5nZXMocGFyYW1zKSB9XHJcblxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgeyB0aGlzLm1vZGlmaWNhdGlvbldpdGhvdXRDaGFuZ2VzKHBhcmFtcykgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbW9kaWZpY2F0aW9uV2l0aG91dENoYW5nZXMocGFyYW1zOiBhbnkpIHtcclxuXHJcbiAgICBpZiAodGhpcy5jaGFuZ2VzTWFwLmhhcyhwYXJhbXMubm9kZS5pZCkpIC8vTW9kaWZpY2F0aW9uIHdpdGhvdXQgY2hhbmdlcyBpbiBlbiBlZGl0ZWQgY2VsbFxyXG4gICAge1xyXG4gICAgICBpZiAoIXRoaXMudW5kb05vQ2hhbmdlcykge1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS51bmRvQ2VsbEVkaXRpbmcoKTsgLy8gVW5kbyB0byBkZWxldGUgdGhlIGNoYW5nZSB3aXRob3V0IGNoYW5nZXMgaW50ZXJuYWxseSBcclxuICAgICAgICB0aGlzLnVuZG9Ob0NoYW5nZXMgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucGFpbnRDZWxscyhwYXJhbXMsIHRoaXMuY2hhbmdlc01hcCk7ICAvL1RoZSBjZWxsIGhhcyBtb2RpZmljYXRpb25zIHlldCAtPiBncmVlbiBiYWNrZ3JvdW5kIFxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgeyB0aGlzLnVuZG9Ob0NoYW5nZXMgPSBmYWxzZTsgfVxyXG5cclxuXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgLy9XaXRoIHRoZSBpbnRlcm5hbGx5IHVuZG8gd2lsbCBlbnRlciBhdCB0aGlzIGZ1bmN0aW9uLCBzbyB3ZSBoYXZlIHRvIGNvbnRyb2wgd2hlbiBkb25lIHRoZSB1bmRvIG9yIG5vdCBcclxuICAgICAgaWYgKCF0aGlzLnVuZG9Ob0NoYW5nZXMpIHtcclxuICAgICAgICB0aGlzLmdyaWRBcGkudW5kb0NlbGxFZGl0aW5nKCk7IC8vIFVuZG8gdG8gZGVsZXRlIHRoZSBjaGFuZ2UgaW50ZXJuYWxseVxyXG4gICAgICAgIHRoaXMudW5kb05vQ2hhbmdlcyA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7IHRoaXMudW5kb05vQ2hhbmdlcyA9IGZhbHNlOyB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0Q29sdW1uSW5kZXhCeUNvbElkKGFwaTogQ29sdW1uQXBpLCBjb2xJZDogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBhcGkuZ2V0QWxsQ29sdW1ucygpLmZpbmRJbmRleChjb2wgPT4gY29sLmdldENvbElkKCkgPT09IGNvbElkKTtcclxuICB9XHJcbiAgcGFpbnRDZWxscyhwYXJhbXM6IGFueSwgY2hhbmdlc01hcDogTWFwPG51bWJlciwgTWFwPHN0cmluZywgbnVtYmVyPj4sKSB7XHJcbiAgICBjb25zdCByb3cgPSB0aGlzLmdyaWRBcGkuZ2V0RGlzcGxheWVkUm93QXRJbmRleChwYXJhbXMucm93SW5kZXgpO1xyXG5cclxuICAgIC8vIHRoaXMuY2hhbmdlQ2VsbFN0eWxlQ29sdW1ucyhwYXJhbXMsIGNoYW5nZXNNYXAsICcjRThGMURFJyk7XHJcbiAgICB0aGlzLmdyaWRBcGkucmVkcmF3Um93cyh7IHJvd05vZGVzOiBbcm93XSB9KTtcclxuICAgIC8vIHRoaXMuY2hhbmdlQ2VsbFN0eWxlQ29sdW1ucyhwYXJhbXMsIGNoYW5nZXNNYXAsICcjRkZGRkZGJyk7XHJcbiAgICAvLyBXZSB3aWxsIGRlZmluZSBjZWxsU3R5bGUgd2hpdGUgdG8gZnV0dXJlIG1vZGlmaWNhdGlvbnMgKGxpa2UgZmlsdGVyKVxyXG4gIH1cclxuXHJcbiAgLy8gY2hhbmdlQ2VsbFN0eWxlQ29sdW1ucyhwYXJhbXM6IGFueSwgY2hhbmdlc01hcDogTWFwPG51bWJlciwgTWFwPHN0cmluZywgbnVtYmVyPj4sIGNvbG9yOiBzdHJpbmcpIHtcclxuXHJcbiAgLy8gICBmb3IgKGNvbnN0IGtleSBvZiBjaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkua2V5cygpKSB7XHJcbiAgLy8gICAgIGNvbnN0IGNvbHVtbk51bWJlciA9IHRoaXMuZ2V0Q29sdW1uSW5kZXhCeUNvbElkKHRoaXMuZ3JpZENvbHVtbkFwaSwga2V5KTtcclxuICAvLyAgICAgdGhpcy5ncmlkQ29sdW1uQXBpLmNvbHVtbkNvbnRyb2xsZXIuZ3JpZENvbHVtbnNbY29sdW1uTnVtYmVyXS5jb2xEZWYuY2VsbFN0eWxlID0geyBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yIH07XHJcbiAgLy8gICB9XHJcblxyXG5cclxuICAvLyB9XHJcblxyXG59XHJcbiJdfQ==