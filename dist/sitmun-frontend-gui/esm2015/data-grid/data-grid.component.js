import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { TranslateService } from '@ngx-translate/core';
import { BtnEditRenderedComponent } from '../btn-edit-rendered/btn-edit-rendered.component';
import { BtnCheckboxRenderedComponent } from '../btn-checkbox-rendered/btn-checkbox-rendered.component';
import { BtnCheckboxFilterComponent } from '../btn-checkbox-filter/btn-checkbox-filter.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from '../dialog-message/dialog-message.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/dialog";
import * as i2 from "@ngx-translate/core";
import * as i3 from "@angular/common";
import * as i4 from "@angular/material/menu";
import * as i5 from "@ag-grid-community/angular";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/icon";
import * as i8 from "@angular/forms";
function DataGridComponent_span_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 17);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("translate", ctx_r0.title);
} }
function DataGridComponent_button_2_Template(rf, ctx) { if (rf & 1) {
    const _r16 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 18);
    i0.ɵɵlistener("click", function DataGridComponent_button_2_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r16); const ctx_r15 = i0.ɵɵnextContext(); return ctx_r15.deleteChanges(); });
    i0.ɵɵpipe(1, "translate");
    i0.ɵɵelementStart(2, "mat-icon", 19);
    i0.ɵɵtext(3, " close ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵpropertyInterpolate("title", i0.ɵɵpipeBind1(1, 2, "cancel"));
    i0.ɵɵproperty("disabled", ctx_r1.changeCounter <= 0);
} }
function DataGridComponent_button_3_Template(rf, ctx) { if (rf & 1) {
    const _r18 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 20);
    i0.ɵɵlistener("click", function DataGridComponent_button_3_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r18); const ctx_r17 = i0.ɵɵnextContext(); return ctx_r17.undo(); });
    i0.ɵɵpipe(1, "translate");
    i0.ɵɵelementStart(2, "mat-icon", 19);
    i0.ɵɵtext(3, " undo ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵpropertyInterpolate("title", i0.ɵɵpipeBind1(1, 2, "undo"));
    i0.ɵɵproperty("disabled", ctx_r2.changeCounter <= 0);
} }
function DataGridComponent_button_4_Template(rf, ctx) { if (rf & 1) {
    const _r20 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 21);
    i0.ɵɵlistener("click", function DataGridComponent_button_4_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r20); const ctx_r19 = i0.ɵɵnextContext(); return ctx_r19.redo(); });
    i0.ɵɵpipe(1, "translate");
    i0.ɵɵelementStart(2, "mat-icon", 19);
    i0.ɵɵtext(3, " redo ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵpropertyInterpolate("title", i0.ɵɵpipeBind1(1, 2, "redo"));
    i0.ɵɵproperty("disabled", ctx_r3.redoCounter <= 0);
} }
function DataGridComponent_button_5_Template(rf, ctx) { if (rf & 1) {
    const _r22 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 22);
    i0.ɵɵlistener("click", function DataGridComponent_button_5_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r22); const ctx_r21 = i0.ɵɵnextContext(); return ctx_r21.applyChanges(); });
    i0.ɵɵpipe(1, "translate");
    i0.ɵɵelementStart(2, "mat-icon", 19);
    i0.ɵɵtext(3, " check ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r4 = i0.ɵɵnextContext();
    i0.ɵɵpropertyInterpolate("title", i0.ɵɵpipeBind1(1, 2, "accept"));
    i0.ɵɵproperty("disabled", ctx_r4.changeCounter <= 0);
} }
function DataGridComponent_label_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "label", 17);
} if (rf & 2) {
    i0.ɵɵproperty("translate", "search");
} }
function DataGridComponent_input_8_Template(rf, ctx) { if (rf & 1) {
    const _r24 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "input", 23);
    i0.ɵɵlistener("keyup", function DataGridComponent_input_8_Template_input_keyup_0_listener() { i0.ɵɵrestoreView(_r24); const ctx_r23 = i0.ɵɵnextContext(); return ctx_r23.quickSearch(); })("ngModelChange", function DataGridComponent_input_8_Template_input_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r24); const ctx_r25 = i0.ɵɵnextContext(); return ctx_r25.searchValue = $event; });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r6 = i0.ɵɵnextContext();
    i0.ɵɵproperty("ngModel", ctx_r6.searchValue);
} }
function DataGridComponent_button_9_Template(rf, ctx) { if (rf & 1) {
    const _r27 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 24);
    i0.ɵɵlistener("click", function DataGridComponent_button_9_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r27); const ctx_r26 = i0.ɵɵnextContext(); return ctx_r26.removeData(); });
    i0.ɵɵelementStart(1, "mat-icon", 19);
    i0.ɵɵtext(2, " delete ");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "span", 17);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("translate", "remove");
} }
function DataGridComponent_button_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 25);
    i0.ɵɵelement(1, "span", 17);
    i0.ɵɵelementStart(2, "mat-icon", 19);
    i0.ɵɵtext(3, " keyboard_arrow_down ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵnextContext();
    const _r9 = i0.ɵɵreference(12);
    i0.ɵɵproperty("matMenuTriggerFor", _r9);
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("translate", "actions");
} }
function DataGridComponent_button_13_Template(rf, ctx) { if (rf & 1) {
    const _r29 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 26);
    i0.ɵɵlistener("click", function DataGridComponent_button_13_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r29); const ctx_r28 = i0.ɵɵnextContext(); return ctx_r28.exportData(); });
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "translate");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance(1);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(2, 1, "export"), " ");
} }
function DataGridComponent_button_14_Template(rf, ctx) { if (rf & 1) {
    const _r31 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 26);
    i0.ɵɵlistener("click", function DataGridComponent_button_14_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r31); const ctx_r30 = i0.ɵɵnextContext(); return ctx_r30.onDuplicateButtonClicked(); });
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "translate");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance(1);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(2, 1, "duplicate"), "");
} }
function DataGridComponent_button_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 27);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "translate");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance(1);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(2, 1, "search/replace"), "");
} }
function DataGridComponent_button_16_Template(rf, ctx) { if (rf & 1) {
    const _r33 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 28);
    i0.ɵɵlistener("click", function DataGridComponent_button_16_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r33); const ctx_r32 = i0.ɵɵnextContext(); return ctx_r32.newData(); });
    i0.ɵɵelementStart(1, "mat-icon", 19);
    i0.ɵɵtext(2, " add_circle_outline ");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "span", 17);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("translate", "new");
} }
function DataGridComponent_button_17_Template(rf, ctx) { if (rf & 1) {
    const _r35 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 28);
    i0.ɵɵlistener("click", function DataGridComponent_button_17_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r35); const ctx_r34 = i0.ɵɵnextContext(); return ctx_r34.onAddButtonClicked(); });
    i0.ɵɵelementStart(1, "mat-icon", 19);
    i0.ɵɵtext(2, " add_circle_outline ");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "span", 17);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("translate", "add");
} }
export class DataGridComponent {
    constructor(dialog, translate) {
        this.dialog = dialog;
        this.translate = translate;
        this.modules = AllCommunityModules;
        this.statusColumn = false;
        this.changesMap = new Map();
        this.modificationChange = false;
        this.undoNoChanges = false; // Boolean that indicates if an undo hasn't modifications
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
                        comparator(filterLocalDateAtMidnight, cellValue) {
                            const dateCellValue = new Date(cellValue);
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
                const data = this.translate.instant(key);
                return data === key ? defaultValue : data;
            }
        };
    }
    ngOnInit() {
        if (this.eventRefreshSubscription) {
            this._eventRefreshSubscription = this.eventRefreshSubscription.subscribe(() => {
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
        if (this.eventAddItemsSubscription) {
            this.eventAddItemsSubscription.subscribe((items) => {
                this.addItems(items);
            });
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
        this.getElements();
        this.gridApi.sizeColumnsToFit();
        console.log(this.columnDefs);
        for (const col of this.columnDefs) {
            if (col.field === 'status') {
                console.log("status column true");
                this.statusColumn = true;
            }
        }
    }
    emitSelectedRows() {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        this.getSelectedRows.emit(selectedData);
    }
    emitAllRows() {
        let rowData = [];
        this.gridApi.forEachNode(node => rowData.push(node.data));
        this.getAllRows.emit(rowData);
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
            this.rowData = items;
            setTimeout(() => { this.gridApi.sizeColumnsToFit(); }, 30);
            this.gridApi.setRowData(this.rowData);
            console.log(this.rowData);
        });
    }
    addItems(newItems) {
        console.log(newItems);
        let itemsToAdd = [];
        newItems.forEach(item => {
            if (item.id == undefined || (this.rowData.find(element => element.id === item.id)) == undefined) {
                if (this.statusColumn) {
                    item.status = 'Pending creation';
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
    removeData() {
        this.gridApi.stopEditing(false);
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        this.remove.emit(selectedData);
        if (this.statusColumn) {
            const selectedRows = selectedNodes.map(node => node.rowIndex);
            for (const id of selectedRows) {
                this.gridApi.getRowNode(id).data.status = 'Deleted';
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
        this.add.emit(-1);
    }
    onDuplicateButtonClicked() {
        this.gridApi.stopEditing(false);
        console.log(this.changeCounter);
        if (this.changeCounter > 0) {
            const dialogRef = this.dialog.open(DialogMessageComponent);
            dialogRef.componentInstance.title = 'Caution';
            dialogRef.componentInstance.message = 'If you duplicate rows without apply changes, your modifications will be overwritted, do you want to continue?';
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
        }
    }
    applyChanges() {
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
        this.params.colDef.cellStyle = { backgroundColor: '#FFFFFF' };
        this.gridApi.redrawRows();
    }
    deleteChanges() {
        this.gridApi.stopEditing(false);
        while (this.changeCounter > 0) {
            this.undo();
        }
        this.changesMap.clear();
        //this.previousChangeCounter = 0;
        this.redoCounter = 0;
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
            this.redoCounter = 0;
            this.onCellValueChanged(e);
            this.modificationChange = false;
        }
    }
    onCellValueChanged(params) {
        console.log("value Change");
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
                        this.gridApi.getRowNode(params.node.id).data.status = 'Modified';
                    }
                    ;
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
                        this.gridApi.getRowNode(params.node.id).data.status = '';
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
        this.changeCellStyleColumns(params, changesMap, '#E8F1DE');
        this.gridApi.redrawRows({ rowNodes: [row] });
        this.changeCellStyleColumns(params, changesMap, '#FFFFFF');
        // We will define cellStyle white to future modifications (like filter)
    }
    changeCellStyleColumns(params, changesMap, color) {
        for (const key of changesMap.get(params.node.id).keys()) {
            const columnNumber = this.getColumnIndexByColId(this.gridColumnApi, key);
            this.gridColumnApi.columnController.gridColumns[columnNumber].colDef.cellStyle = { backgroundColor: color };
        }
    }
}
/** @nocollapse */ DataGridComponent.ɵfac = function DataGridComponent_Factory(t) { return new (t || DataGridComponent)(i0.ɵɵdirectiveInject(i1.MatDialog), i0.ɵɵdirectiveInject(i2.TranslateService)); };
/** @nocollapse */ DataGridComponent.ɵcmp = i0.ɵɵdefineComponent({ type: DataGridComponent, selectors: [["app-data-grid"]], inputs: { eventRefreshSubscription: "eventRefreshSubscription", eventGetSelectedRowsSubscription: "eventGetSelectedRowsSubscription", eventGetAllRowsSubscription: "eventGetAllRowsSubscription", eventAddItemsSubscription: "eventAddItemsSubscription", frameworkComponents: "frameworkComponents", columnDefs: "columnDefs", getAll: "getAll", discardChangesButton: "discardChangesButton", undoButton: "undoButton", redoButton: "redoButton", applyChangesButton: "applyChangesButton", deleteButton: "deleteButton", newButton: "newButton", actionButton: "actionButton", addButton: "addButton", globalSearch: "globalSearch", themeGrid: "themeGrid", singleSelection: "singleSelection", nonEditable: "nonEditable", title: "title", hideExportButton: "hideExportButton", hideDuplicateButton: "hideDuplicateButton", hideSearchReplaceButton: "hideSearchReplaceButton" }, outputs: { remove: "remove", new: "new", add: "add", sendChanges: "sendChanges", duplicate: "duplicate", getSelectedRows: "getSelectedRows", getAllRows: "getAllRows" }, decls: 21, vars: 27, consts: [["id", "grup1", 1, "editDivBtns"], [3, "translate", 4, "ngIf"], ["mat-mini-fab", "", "class", "editBtn", "id", "deleteChangesButton", "type", "button", 3, "title", "disabled", "click", 4, "ngIf"], ["mat-mini-fab", "", "class", "editBtn", "id", "undo", 3, "title", "disabled", "click", 4, "ngIf"], ["mat-mini-fab", "", "class", "editBtn", "id", "redo", 3, "title", "disabled", "click", 4, "ngIf"], ["mat-mini-fab", "", "class", "editBtn", "id", "applyChangesButton", 3, "title", "disabled", "click", 4, "ngIf"], ["id", "grup2", 1, "actionsDivBtns"], ["type", "text", "class", "searchGenericInput", "placeholder", "", "ml-2", "", 3, "ngModel", "keyup", "ngModelChange", 4, "ngIf"], ["mat-stroked-button", "", "id", "deleteButton", 3, "click", 4, "ngIf"], ["mat-stroked-button", "", "id", "actionButton", 3, "matMenuTriggerFor", 4, "ngIf"], ["menu", "matMenu"], ["mat-menu-item", "", 3, "click", 4, "ngIf"], ["mat-menu-item", "", 4, "ngIf"], ["mat-stroked-button", "", "id", "newButton", 3, "click", 4, "ngIf"], [1, "row", 2, "height", "100%"], ["id", "myGrid", 2, "width", "100%", "height", "100%"], ["rowSelection", "multiple", "multiSortKey", "key", 2, "width", "100%", "height", "100%", 3, "floatingFilter", "rowData", "columnDefs", "gridOptions", "animateRows", "pagination", "modules", "undoRedoCellEditing", "undoRedoCellEditingLimit", "suppressRowClickSelection", "frameworkComponents", "filterModified", "cellEditingStopped", "cellValueChanged", "gridReady"], [3, "translate"], ["mat-mini-fab", "", "id", "deleteChangesButton", "type", "button", 1, "editBtn", 3, "title", "disabled", "click"], ["fontSet", "material-icons-round"], ["mat-mini-fab", "", "id", "undo", 1, "editBtn", 3, "title", "disabled", "click"], ["mat-mini-fab", "", "id", "redo", 1, "editBtn", 3, "title", "disabled", "click"], ["mat-mini-fab", "", "id", "applyChangesButton", 1, "editBtn", 3, "title", "disabled", "click"], ["type", "text", "placeholder", "", "ml-2", "", 1, "searchGenericInput", 3, "ngModel", "keyup", "ngModelChange"], ["mat-stroked-button", "", "id", "deleteButton", 3, "click"], ["mat-stroked-button", "", "id", "actionButton", 3, "matMenuTriggerFor"], ["mat-menu-item", "", 3, "click"], ["mat-menu-item", ""], ["mat-stroked-button", "", "id", "newButton", 3, "click"]], template: function DataGridComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0);
        i0.ɵɵtemplate(1, DataGridComponent_span_1_Template, 1, 1, "span", 1);
        i0.ɵɵtemplate(2, DataGridComponent_button_2_Template, 4, 4, "button", 2);
        i0.ɵɵtemplate(3, DataGridComponent_button_3_Template, 4, 4, "button", 3);
        i0.ɵɵtemplate(4, DataGridComponent_button_4_Template, 4, 4, "button", 4);
        i0.ɵɵtemplate(5, DataGridComponent_button_5_Template, 4, 4, "button", 5);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(6, "div", 6);
        i0.ɵɵtemplate(7, DataGridComponent_label_7_Template, 1, 1, "label", 1);
        i0.ɵɵtemplate(8, DataGridComponent_input_8_Template, 1, 1, "input", 7);
        i0.ɵɵtemplate(9, DataGridComponent_button_9_Template, 4, 1, "button", 8);
        i0.ɵɵtemplate(10, DataGridComponent_button_10_Template, 4, 2, "button", 9);
        i0.ɵɵelementStart(11, "mat-menu", null, 10);
        i0.ɵɵtemplate(13, DataGridComponent_button_13_Template, 3, 3, "button", 11);
        i0.ɵɵtemplate(14, DataGridComponent_button_14_Template, 3, 3, "button", 11);
        i0.ɵɵtemplate(15, DataGridComponent_button_15_Template, 3, 3, "button", 12);
        i0.ɵɵelementEnd();
        i0.ɵɵtemplate(16, DataGridComponent_button_16_Template, 4, 1, "button", 13);
        i0.ɵɵtemplate(17, DataGridComponent_button_17_Template, 4, 1, "button", 13);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(18, "div", 14);
        i0.ɵɵelementStart(19, "div", 15);
        i0.ɵɵelementStart(20, "ag-grid-angular", 16);
        i0.ɵɵlistener("filterModified", function DataGridComponent_Template_ag_grid_angular_filterModified_20_listener() { return ctx.onFilterModified(); })("cellEditingStopped", function DataGridComponent_Template_ag_grid_angular_cellEditingStopped_20_listener($event) { return ctx.onCellEditingStopped($event); })("cellValueChanged", function DataGridComponent_Template_ag_grid_angular_cellValueChanged_20_listener($event) { return ctx.onCellValueChanged($event); })("gridReady", function DataGridComponent_Template_ag_grid_angular_gridReady_20_listener($event) { return ctx.onGridReady($event); });
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", ctx.title);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", ctx.discardChangesButton);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", ctx.undoButton);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", ctx.redoButton);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", ctx.applyChangesButton);
        i0.ɵɵadvance(2);
        i0.ɵɵproperty("ngIf", ctx.globalSearch);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", ctx.globalSearch);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", ctx.deleteButton);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", ctx.actionButton);
        i0.ɵɵadvance(3);
        i0.ɵɵproperty("ngIf", !ctx.hideExportButton);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", !ctx.hideDuplicateButton);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", !ctx.hideSearchReplaceButton);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", ctx.newButton);
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", ctx.addButton);
        i0.ɵɵadvance(3);
        i0.ɵɵclassMap(ctx.themeGrid);
        i0.ɵɵproperty("floatingFilter", true)("rowData", ctx.rowData)("columnDefs", ctx.columnDefs)("gridOptions", ctx.gridOptions)("animateRows", true)("pagination", false)("modules", ctx.modules)("undoRedoCellEditing", true)("undoRedoCellEditingLimit", 200)("suppressRowClickSelection", true)("frameworkComponents", ctx.frameworkComponents);
    } }, directives: [i3.NgIf, i4._MatMenu, i5.AgGridAngular, i2.TranslateDirective, i6.MatButton, i7.MatIcon, i8.DefaultValueAccessor, i8.NgControlStatus, i8.NgModel, i4.MatMenuTrigger, i4.MatMenuItem], pipes: [i2.TranslatePipe], styles: ["input[_ngcontent-%COMP%], label[_ngcontent-%COMP%]{display:inline-block;margin:5px 5px 5px 10px}#newButton[_ngcontent-%COMP%]{background:#68a225 0 0 no-repeat padding-box;color:#fff;margin-left:3px}#actionButton[_ngcontent-%COMP%], #deleteButton[_ngcontent-%COMP%]{background:#fff 0 0 no-repeat padding-box;margin-left:3px}#actionButton[_ngcontent-%COMP%]{text-align:center!important}#applyChangesButton[_ngcontent-%COMP%]{background:#68a225 0 0 no-repeat padding-box;color:#fff!important;margin-left:3px}#applyChangesButton[disabled][_ngcontent-%COMP%]{background:#83976c 0 0 no-repeat padding-box}#redo[_ngcontent-%COMP%]{background:#ff9300;color:#fff!important;margin-left:3px}#redo[disabled][_ngcontent-%COMP%]{background:#ffc97f;margin-left:3px}#undo[_ngcontent-%COMP%]{background:#ff9300;color:#fff!important;margin-left:3px}#undo[disabled][_ngcontent-%COMP%]{background:#ffc97f;margin-left:3px}#deleteChangesButton[_ngcontent-%COMP%]{background:#df3133;color:#fff!important}#deleteChangesButton[disabled][_ngcontent-%COMP%]{background:#da8c8e;color:#fff!important}.editDivBtns[_ngcontent-%COMP%]{height:30px!important;line-height:30px!important;margin-left:10px;text-align:start;width:130px}.actionsDivBtns[_ngcontent-%COMP%]{height:60px;text-align:end;width:calc(100% - 140px)}.actionsDivBtns[_ngcontent-%COMP%], .editDivBtns[_ngcontent-%COMP%]{display:inline-block!important}.actionsDivBtns[_ngcontent-%COMP%]   .mat-stroked-button[_ngcontent-%COMP%]{padding:5px 20px!important}.editDivBtns[_ngcontent-%COMP%]   .mat-mini-fab[_ngcontent-%COMP%]   .mat-button-wrapper[_ngcontent-%COMP%]{display:inherit!important;padding:inherit!important}.editDivBtns[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%]{bottom:5px;height:30px!important;position:relative}.editDivBtns[_ngcontent-%COMP%]   .mat-mini-fab[_ngcontent-%COMP%]{height:30px;width:30px}.actionsDivBtns[_ngcontent-%COMP%]   .searchGenericInput[_ngcontent-%COMP%]{height:45px!important;width:45%!important}.ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#eee}\u200B[_ngcontent-%COMP%]   .ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar{height:2em;width:2em}.ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-button{background:#ccc}.ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]::-webkit-scrollbar-track-piece{background:#888}"] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(DataGridComponent, [{
        type: Component,
        args: [{
                selector: 'app-data-grid',
                templateUrl: './data-grid.component.html',
                styleUrls: ['./data-grid.component.css']
            }]
    }], function () { return [{ type: i1.MatDialog }, { type: i2.TranslateService }]; }, { eventRefreshSubscription: [{
            type: Input
        }], eventGetSelectedRowsSubscription: [{
            type: Input
        }], eventGetAllRowsSubscription: [{
            type: Input
        }], eventAddItemsSubscription: [{
            type: Input
        }], frameworkComponents: [{
            type: Input
        }], columnDefs: [{
            type: Input
        }], getAll: [{
            type: Input
        }], discardChangesButton: [{
            type: Input
        }], undoButton: [{
            type: Input
        }], redoButton: [{
            type: Input
        }], applyChangesButton: [{
            type: Input
        }], deleteButton: [{
            type: Input
        }], newButton: [{
            type: Input
        }], actionButton: [{
            type: Input
        }], addButton: [{
            type: Input
        }], globalSearch: [{
            type: Input
        }], themeGrid: [{
            type: Input
        }], singleSelection: [{
            type: Input
        }], nonEditable: [{
            type: Input
        }], title: [{
            type: Input
        }], hideExportButton: [{
            type: Input
        }], hideDuplicateButton: [{
            type: Input
        }], hideSearchReplaceButton: [{
            type: Input
        }], remove: [{
            type: Output
        }], new: [{
            type: Output
        }], add: [{
            type: Output
        }], sendChanges: [{
            type: Output
        }], duplicate: [{
            type: Output
        }], getSelectedRows: [{
            type: Output
        }], getAllRows: [{
            type: Output
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1ncmlkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGF0YS1ncmlkL2RhdGEtZ3JpZC5jb21wb25lbnQudHMiLCJkYXRhLWdyaWQvZGF0YS1ncmlkLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQW9CLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFbEMsT0FBTyxFQUFFLG1CQUFtQixFQUFvQixNQUFNLGdDQUFnQyxDQUFDO0FBRXZGLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3JELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLGtEQUFrRCxDQUFDO0FBQzFGLE9BQU8sRUFBQyw0QkFBNEIsRUFBQyxNQUFNLDBEQUEwRCxDQUFDO0FBQ3RHLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLHNEQUFzRCxDQUFDO0FBQ2hHLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQzs7Ozs7Ozs7Ozs7SUNYNUUsMkJBQWlEOzs7SUFBNUIsd0NBQW1COzs7O0lBQ3hDLGtDQUNJO0lBRDJJLDhMQUF5Qjs7SUFDcEssb0NBQTRDO0lBQUEsdUJBQU07SUFBQSxpQkFBVztJQUNqRSxpQkFBUzs7O0lBRkQsaUVBQWtDO0lBQStILG9EQUErQjs7OztJQUd4TSxrQ0FDSTtJQURpRyxxTEFBZ0I7O0lBQ2pILG9DQUEyQztJQUFBLHNCQUFLO0lBQUEsaUJBQVc7SUFDL0QsaUJBQVM7OztJQUZELCtEQUFnQztJQUE4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QXBCLEtBQUs7WUFDRyxTQUFTO2tCQUFqQixLQUFLO1lBQ0csWUFBWTtrQkFBcEIsS0FBSztZQUNHLFNBQVM7a0JBQWpCLEtBQUs7WUFDRyxlQUFlO2tCQUF2QixLQUFLO1lBQ0csV0FBVztrQkFBbkIsS0FBSztZQUNHLEtBQUs7a0JBQWIsS0FBSztZQUNHLGdCQUFnQjtrQkFBeEIsS0FBSztZQUNHLG1CQUFtQjtrQkFBM0IsS0FBSztZQUNHLHVCQUF1QjtrQkFBL0IsS0FBSztZQUdJLE1BQU07a0JBQWYsTUFBTTtZQUNHLEdBQUc7a0JBQVosTUFBTTtZQUNHLEdBQUc7a0JBQVosTUFBTTtZQUNHLFdBQVc7a0JBQXBCLE1BQU07WUFDRyxTQUFTO2tCQUFsQixNQUFNO1lBQ0csZUFBZTtrQkFBeEIsTUFBTTtZQUNHLFVBQVU7a0JBQW5CLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZ0dyaWRNb2R1bGUgfSBmcm9tICdAYWctZ3JpZC1jb21tdW5pdHkvYW5ndWxhcic7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBOZ01vZHVsZSwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgQWxsQ29tbXVuaXR5TW9kdWxlcywgQ29sdW1uQXBpLCBNb2R1bGV9IGZyb20gJ0BhZy1ncmlkLWNvbW11bml0eS9hbGwtbW9kdWxlcyc7XHJcblxyXG5pbXBvcnQge1RyYW5zbGF0ZVNlcnZpY2V9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xyXG5pbXBvcnQge0J0bkVkaXRSZW5kZXJlZENvbXBvbmVudH0gZnJvbSAnLi4vYnRuLWVkaXQtcmVuZGVyZWQvYnRuLWVkaXQtcmVuZGVyZWQuY29tcG9uZW50JztcclxuaW1wb3J0IHtCdG5DaGVja2JveFJlbmRlcmVkQ29tcG9uZW50fSBmcm9tICcuLi9idG4tY2hlY2tib3gtcmVuZGVyZWQvYnRuLWNoZWNrYm94LXJlbmRlcmVkLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7QnRuQ2hlY2tib3hGaWx0ZXJDb21wb25lbnR9IGZyb20gJy4uL2J0bi1jaGVja2JveC1maWx0ZXIvYnRuLWNoZWNrYm94LWZpbHRlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNYXREaWFsb2cgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xyXG5pbXBvcnQgeyBEaWFsb2dNZXNzYWdlQ29tcG9uZW50IH0gZnJvbSAnLi4vZGlhbG9nLW1lc3NhZ2UvZGlhbG9nLW1lc3NhZ2UuY29tcG9uZW50JztcclxuaW1wb3J0IHsgaXNSb3RhdGVkUmVjdEludGVyc2VjdCB9IGZyb20gJ0BzeW5jZnVzaW9uL2VqMi1hbmd1bGFyLWNoYXJ0cyc7XHJcblxyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWRhdGEtZ3JpZCcsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2RhdGEtZ3JpZC5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vZGF0YS1ncmlkLmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGF0YUdyaWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gXHJcbiAgcHJpdmF0ZSBfZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgcHJpdmF0ZSBfZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb246IGFueTtcclxuICBwcml2YXRlIF9ldmVudEdldEFsbFJvd3NTdWJzY3JpcHRpb246IGFueTtcclxuICBtb2R1bGVzOiBNb2R1bGVbXSA9IEFsbENvbW11bml0eU1vZHVsZXM7XHJcblxyXG5cclxuICBVbmRlUmVkb0FjdGlvbnNcclxuICBzZWFyY2hWYWx1ZTogc3RyaW5nO1xyXG4gIHByaXZhdGUgZ3JpZEFwaTtcclxuICBwcml2YXRlIGdyaWRDb2x1bW5BcGk7XHJcbiAgc3RhdHVzQ29sdW1uID0gZmFsc2U7XHJcbiAgY2hhbmdlc01hcDogTWFwPG51bWJlciwgTWFwPHN0cmluZywgbnVtYmVyPj4gPSBuZXcgTWFwPG51bWJlciwgTWFwPHN0cmluZywgbnVtYmVyPj4oKTtcclxuICAgLy8gV2Ugd2lsbCBzYXZlIHRoZSBpZCBvZiBlZGl0ZWQgY2VsbHMgYW5kIHRoZSBudW1iZXIgb2YgZWRpdGlvbnMgZG9uZS5cclxuICBwcml2YXRlIHBhcmFtczsgLy8gTGFzdCBwYXJhbWV0ZXJzIG9mIHRoZSBncmlkIChpbiBjYXNlIHdlIGRvIGFwcGx5IGNoYW5nZXMgd2Ugd2lsbCBuZWVkIGl0KSBcclxuICByb3dEYXRhOiBhbnlbXTtcclxuICBjaGFuZ2VDb3VudGVyOiBudW1iZXI7IC8vIE51bWJlciBvZiBlZGl0aW9ucyBkb25lIGFib3ZlIGFueSBjZWxsIFxyXG4gIHByZXZpb3VzQ2hhbmdlQ291bnRlcjogbnVtYmVyOyAvLyBOdW1iZXIgb2YgZGl0aW9ucyBkb25lIGFmdGVyIHRoZSBsYXN0IG1vZGlmaWNhdGlvbihjaGFuZ2VDb3VudGVyKVxyXG4gIHJlZG9Db3VudGVyOiBudW1iZXI7IC8vIE51bWJlciBvZiByZWRvIHdlIGNhbiBkb1xyXG4gIG1vZGlmaWNhdGlvbkNoYW5nZSA9IGZhbHNlO1xyXG4gIHVuZG9Ob0NoYW5nZXMgPSBmYWxzZTsgLy8gQm9vbGVhbiB0aGF0IGluZGljYXRlcyBpZiBhbiB1bmRvIGhhc24ndCBtb2RpZmljYXRpb25zXHJcbiAgZ3JpZE9wdGlvbnM7XHJcblxyXG5cclxuICBASW5wdXQoKSBldmVudFJlZnJlc2hTdWJzY3JpcHRpb246IE9ic2VydmFibGUgPGJvb2xlYW4+IDtcclxuICBASW5wdXQoKSBldmVudEdldFNlbGVjdGVkUm93c1N1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZSA8Ym9vbGVhbj4gO1xyXG4gIEBJbnB1dCgpIGV2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZSA8Ym9vbGVhbj4gO1xyXG4gIEBJbnB1dCgpIGV2ZW50QWRkSXRlbXNTdWJzY3JpcHRpb246IE9ic2VydmFibGUgPGFueVtdPiA7XHJcbiAgQElucHV0KCkgZnJhbWV3b3JrQ29tcG9uZW50czogYW55O1xyXG4gIEBJbnB1dCgpIGNvbHVtbkRlZnM6IGFueVtdO1xyXG4gIEBJbnB1dCgpIGdldEFsbDogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+O1xyXG4gIEBJbnB1dCgpIGRpc2NhcmRDaGFuZ2VzQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHVuZG9CdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgcmVkb0J1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBhcHBseUNoYW5nZXNCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgZGVsZXRlQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIG5ld0J1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBhY3Rpb25CdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYWRkQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGdsb2JhbFNlYXJjaDogYm9vbGVhbjtcclxuICBASW5wdXQoKSB0aGVtZUdyaWQ6IGFueTtcclxuICBASW5wdXQoKSBzaW5nbGVTZWxlY3Rpb246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgbm9uRWRpdGFibGU6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgdGl0bGU6IHN0cmluZztcclxuICBASW5wdXQoKSBoaWRlRXhwb3J0QnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGhpZGVEdXBsaWNhdGVCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgaGlkZVNlYXJjaFJlcGxhY2VCdXR0b246IGJvb2xlYW47XHJcblxyXG5cclxuICBAT3V0cHV0KCkgcmVtb3ZlOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG4gIEBPdXRwdXQoKSBuZXc6IEV2ZW50RW1pdHRlcjxudW1iZXI+O1xyXG4gIEBPdXRwdXQoKSBhZGQ6IEV2ZW50RW1pdHRlcjxudW1iZXI+O1xyXG4gIEBPdXRwdXQoKSBzZW5kQ2hhbmdlczogRXZlbnRFbWl0dGVyPGFueVtdPjtcclxuICBAT3V0cHV0KCkgZHVwbGljYXRlOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG4gIEBPdXRwdXQoKSBnZXRTZWxlY3RlZFJvd3M6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIGdldEFsbFJvd3M6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcblxyXG5cclxuICBjb25zdHJ1Y3RvciggICAgcHVibGljIGRpYWxvZzogTWF0RGlhbG9nLFxyXG4gICAgcHVibGljIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSkge1xyXG4gICAgdGhpcy50cmFuc2xhdGUgPSB0cmFuc2xhdGU7XHJcblxyXG4gICAgdGhpcy5mcmFtZXdvcmtDb21wb25lbnRzID0ge1xyXG4gICAgICBidG5FZGl0UmVuZGVyZXJDb21wb25lbnQ6IEJ0bkVkaXRSZW5kZXJlZENvbXBvbmVudCxcclxuICAgICAgYnRuQ2hlY2tib3hSZW5kZXJlckNvbXBvbmVudDogQnRuQ2hlY2tib3hSZW5kZXJlZENvbXBvbmVudCxcclxuICAgICAgYnRuQ2hlY2tib3hGaWx0ZXJDb21wb25lbnQ6IEJ0bkNoZWNrYm94RmlsdGVyQ29tcG9uZW50XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucmVtb3ZlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5uZXcgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmFkZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuc2VuZENoYW5nZXMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmdldFNlbGVjdGVkUm93cyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuZHVwbGljYXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5nZXRBbGxSb3dzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5jaGFuZ2VDb3VudGVyID0gMDtcclxuICAgIHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyID0gMDtcclxuICAgIHRoaXMucmVkb0NvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5ncmlkT3B0aW9ucyA9IHtcclxuICAgICAgZGVmYXVsdENvbERlZjoge1xyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGZsZXg6IDEsXHJcbiAgICAgICAgZmlsdGVyOiB0cnVlLFxyXG4gICAgICAgIGVkaXRhYmxlOiAhdGhpcy5ub25FZGl0YWJsZSxcclxuICAgICAgICBjZWxsU3R5bGU6IHtiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGRkZGJ30sXHJcbiAgICAgICAgc3VwcHJlc3NNZW51IDogdHJ1ZSxcclxuICAgICAgICByZXNpemFibGU6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgY29sdW1uVHlwZXM6IHtcclxuICAgICAgICBkYXRlQ29sdW1uOiB7XHJcbiAgICAgICAgICAgIGZpbHRlcjogJ2FnRGF0ZUNvbHVtbkZpbHRlcicsXHJcbiAgICAgICAgICAgIGZpbHRlclBhcmFtczoge1xyXG4gICAgICAgICAgICAgIGNvbXBhcmF0b3IoZmlsdGVyTG9jYWxEYXRlQXRNaWRuaWdodCwgY2VsbFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRlQ2VsbFZhbHVlID0gbmV3IERhdGUoY2VsbFZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVGaWx0ZXIgPSBuZXcgRGF0ZShmaWx0ZXJMb2NhbERhdGVBdE1pZG5pZ2h0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0ZUNlbGxWYWx1ZS5nZXRUaW1lKCkgPCBkYXRlRmlsdGVyLmdldFRpbWUoKSkge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGVDZWxsVmFsdWUuZ2V0VGltZSgpICA+IGRhdGVGaWx0ZXIuZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VwcHJlc3NNZW51OiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgICAgcm93U2VsZWN0aW9uOiAnbXVsdGlwbGUnLFxyXG4gICAgICBzaW5nbGVDbGlja0VkaXQ6IHRydWUsXHJcbiAgICAgIC8vIHN1cHByZXNzSG9yaXpvbnRhbFNjcm9sbDogdHJ1ZSxcclxuICAgICAgbG9jYWxlVGV4dEZ1bmM6IChrZXk6IHN0cmluZywgZGVmYXVsdFZhbHVlOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy50cmFuc2xhdGUuaW5zdGFudChrZXkpO1xyXG4gICAgICAgIHJldHVybiBkYXRhID09PSBrZXkgPyBkZWZhdWx0VmFsdWUgOiBkYXRhO1xyXG4gICAgfVxyXG4gICAgfTtcclxuXHJcbiAgfVxyXG5cclxuXHJcbiAgbmdPbkluaXQoKXtcclxuXHJcbiAgICBpZiAodGhpcy5ldmVudFJlZnJlc2hTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5fZXZlbnRSZWZyZXNoU3Vic2NyaXB0aW9uID0gdGhpcy5ldmVudFJlZnJlc2hTdWJzY3JpcHRpb24uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICB0aGlzLmdldEVsZW1lbnRzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5fZXZlbnRHZXRTZWxlY3RlZFJvd3NTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50R2V0U2VsZWN0ZWRSb3dzU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbWl0U2VsZWN0ZWRSb3dzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50R2V0QWxsUm93c1N1YnNjcmlwdGlvbiA9IHRoaXMuZXZlbnRHZXRBbGxSb3dzU3Vic2NyaXB0aW9uLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbWl0QWxsUm93cygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZih0aGlzLmV2ZW50QWRkSXRlbXNTdWJzY3JpcHRpb24pXHJcbiAgICB7XHJcbiAgICAgIHRoaXMuZXZlbnRBZGRJdGVtc1N1YnNjcmlwdGlvbi5zdWJzY3JpYmUoXHJcbiAgICAgICAgKGl0ZW1zKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmFkZEl0ZW1zKGl0ZW1zKTtcclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuXHJcbiAgb25HcmlkUmVhZHkocGFyYW1zKTogdm9pZHtcclxuICAgIGlmICh0aGlzLnNpbmdsZVNlbGVjdGlvbikge3RoaXMuZ3JpZE9wdGlvbnMucm93U2VsZWN0aW9uID0gJ3NpbmdsZSd9XHJcbiAgICAvLyBpZiAodGhpcy5ub25FZGl0YWJsZSkge3RoaXMuZ3JpZE9wdGlvbnMuZGVmYXVsdENvbERlZi5lZGl0YWJsZSA9IGZhbHNlfVxyXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcbiAgICB0aGlzLmdyaWRBcGkgPSBwYXJhbXMuYXBpO1xyXG4gICAgdGhpcy5ncmlkQ29sdW1uQXBpID0gcGFyYW1zLmNvbHVtbkFwaTtcclxuICAgIHRoaXMuZ2V0RWxlbWVudHMoKTtcclxuICAgIHRoaXMuZ3JpZEFwaS5zaXplQ29sdW1uc1RvRml0KCk7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLmNvbHVtbkRlZnMpO1xyXG4gICAgZm9yIChjb25zdCBjb2wgb2YgdGhpcy5jb2x1bW5EZWZzKSB7XHJcbiAgICAgIGlmIChjb2wuZmllbGQgPT09ICdzdGF0dXMnKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJzdGF0dXMgY29sdW1uIHRydWVcIik7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdHVzQ29sdW1uID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXHJcbiAgZW1pdFNlbGVjdGVkUm93cygpOiB2b2lke1xyXG4gICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IHRoaXMuZ3JpZEFwaS5nZXRTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICBjb25zdCBzZWxlY3RlZERhdGEgPSBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IG5vZGUuZGF0YSk7XHJcbiAgICB0aGlzLmdldFNlbGVjdGVkUm93cy5lbWl0KHNlbGVjdGVkRGF0YSk7XHJcbiAgfVxyXG5cclxuICBlbWl0QWxsUm93cygpOiB2b2lke1xyXG4gICAgbGV0IHJvd0RhdGEgPSBbXTtcclxuICAgIHRoaXMuZ3JpZEFwaS5mb3JFYWNoTm9kZShub2RlID0+IHJvd0RhdGEucHVzaChub2RlLmRhdGEpKTtcclxuICAgIHRoaXMuZ2V0QWxsUm93cy5lbWl0KHJvd0RhdGEpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29sdW1uS2V5c0FuZEhlYWRlcnMoY29sdW1ua2V5czogQXJyYXk8YW55Pik6IFN0cmluZ3sgICAgXHJcbiAgICBsZXQgaGVhZGVyOkFycmF5PGFueT4gPSBbXTtcclxuICAgIGlmICh0aGlzLmNvbHVtbkRlZnMubGVuZ3RoID09IDApIHtyZXR1cm4gJyd9O1xyXG5cclxuICAgIGxldCBhbGxDb2x1bW5LZXlzPXRoaXMuZ3JpZE9wdGlvbnMuY29sdW1uQXBpLmdldEFsbERpc3BsYXllZENvbHVtbnMoKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKGFsbENvbHVtbktleXMpO1xyXG4gICAgYWxsQ29sdW1uS2V5cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgIGlmIChlbGVtZW50LnVzZXJQcm92aWRlZENvbERlZi5oZWFkZXJOYW1lICE9PSAnJylcclxuICAgICAgICB7XHJcbiAgICAgICAgICBjb2x1bW5rZXlzLnB1c2goZWxlbWVudC51c2VyUHJvdmlkZWRDb2xEZWYuZmllbGQpO1xyXG4gICAgICAgICAgaGVhZGVyLnB1c2goZWxlbWVudC51c2VyUHJvdmlkZWRDb2xEZWYuaGVhZGVyTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICBcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICByZXR1cm4gaGVhZGVyLmpvaW4oXCIsXCIpO1xyXG4gIH1cclxuXHJcblxyXG4gIGV4cG9ydERhdGEoKTogdm9pZHtcclxuICAgIGxldCBjb2x1bW5rZXlzOkFycmF5PGFueT4gPSBbXTtcclxuICAgIGxldCBjdXN0b21IZWFkZXI6U3RyaW5nID0gJyc7XHJcbiAgICBjdXN0b21IZWFkZXIgPSB0aGlzLmdldENvbHVtbktleXNBbmRIZWFkZXJzKGNvbHVtbmtleXMpXHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG9ubHlTZWxlY3RlZDogdHJ1ZSxcclxuICAgICAgICBjb2x1bW5LZXlzOiBjb2x1bW5rZXlzLFxyXG4gICAgICAgIGN1c3RvbUhlYWRlcjogY3VzdG9tSGVhZGVyLFxyXG4gICAgICAgIHNraXBIZWFkZXI6IHRydWVcclxuICAgIH07XHJcbiAgICB0aGlzLmdyaWRBcGkuZXhwb3J0RGF0YUFzQ3N2KHBhcmFtcyk7XHJcbiAgfVxyXG5cclxuICBxdWlja1NlYXJjaCgpOiB2b2lke1xyXG4gICAgdGhpcy5ncmlkQXBpLnNldFF1aWNrRmlsdGVyKHRoaXMuc2VhcmNoVmFsdWUpO1xyXG59XHJcblxyXG4gIGdldEVsZW1lbnRzKCk6IHZvaWRcclxuICB7XHJcbiAgICB0aGlzLmdldEFsbCgpXHJcbiAgICAuc3Vic2NyaWJlKChpdGVtcykgPT4ge1xyXG4gICAgICAgIHRoaXMucm93RGF0YSA9IGl0ZW1zO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCk9Pnt0aGlzLmdyaWRBcGkuc2l6ZUNvbHVtbnNUb0ZpdCgpfSwgMzApO1xyXG4gICAgICAgIHRoaXMuZ3JpZEFwaS5zZXRSb3dEYXRhKHRoaXMucm93RGF0YSk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5yb3dEYXRhKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgIGFkZEl0ZW1zKG5ld0l0ZW1zOiBhbnlbXSk6IHZvaWQge1xyXG4gICAgY29uc29sZS5sb2cobmV3SXRlbXMpO1xyXG4gICAgbGV0IGl0ZW1zVG9BZGQ6IEFycmF5PGFueT4gPSBbXTtcclxuICAgIFxyXG4gICAgbmV3SXRlbXMuZm9yRWFjaChpdGVtID0+IHtcclxuXHJcbiAgICBpZiggaXRlbS5pZD09dW5kZWZpbmVkIHx8ICh0aGlzLnJvd0RhdGEuZmluZChlbGVtZW50ID0+IGVsZW1lbnQuaWQgPT09IGl0ZW0uaWQpKSA9PSB1bmRlZmluZWQgKVxyXG4gICAge1xyXG4gICAgICBpZih0aGlzLnN0YXR1c0NvbHVtbilcclxuICAgICAge1xyXG4gICAgICAgIGl0ZW0uc3RhdHVzPSdQZW5kaW5nIGNyZWF0aW9uJ1xyXG4gICAgICB9XHJcbiAgICAgIGl0ZW1zVG9BZGQucHVzaChpdGVtKTtcclxuICAgICAgdGhpcy5yb3dEYXRhLnB1c2goaXRlbSk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBjb25zb2xlLmxvZyhgSXRlbSB3aXRoIHRoZSBJRCAke2l0ZW0uaWR9IGFscmVhZHkgZXhpc3RzYClcclxuICAgIH1cclxuICAgIH0pO1xyXG4gICAgdGhpcy5ncmlkQXBpLnVwZGF0ZVJvd0RhdGEoeyBhZGQ6IGl0ZW1zVG9BZGQgfSk7XHJcblxyXG4gICAgY29uc29sZS5sb2codGhpcy5jb2x1bW5EZWZzKTtcclxuICAgIC8vIHBhcmFtcy5vbGRWYWx1ZSE9dW5kZWZpbmVkXHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuICByZW1vdmVEYXRhKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSB0aGlzLmdyaWRBcGkuZ2V0U2VsZWN0ZWROb2RlcygpO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWREYXRhID0gc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiBub2RlLmRhdGEpO1xyXG4gICAgdGhpcy5yZW1vdmUuZW1pdChzZWxlY3RlZERhdGEpO1xyXG5cclxuICAgIGlmKHRoaXMuc3RhdHVzQ29sdW1uKVxyXG4gICAge1xyXG4gICAgICBjb25zdCBzZWxlY3RlZFJvd3MgPSBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IG5vZGUucm93SW5kZXgpO1xyXG5cclxuICAgICAgZm9yIChjb25zdCBpZCBvZiBzZWxlY3RlZFJvd3Mpe1xyXG4gICAgICAgICAgdGhpcy5ncmlkQXBpLmdldFJvd05vZGUoaWQpLmRhdGEuc3RhdHVzID0nRGVsZXRlZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICB0aGlzLmdyaWRPcHRpb25zLmFwaS5yZWZyZXNoQ2VsbHMoKTtcclxuICAgIH1cclxuICAgIHRoaXMuZ3JpZE9wdGlvbnMuYXBpLmRlc2VsZWN0QWxsKCk7XHJcbiAgfVxyXG5cclxuICBuZXdEYXRhKCk6IHZvaWRcclxuICB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgdGhpcy5uZXcuZW1pdCgtMSk7XHJcbiAgfVxyXG5cclxuICBvbkFkZEJ1dHRvbkNsaWNrZWQoKTogdm9pZFxyXG4gIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICB0aGlzLmFkZC5lbWl0KC0xKTtcclxuICB9XHJcblxyXG4gIG9uRHVwbGljYXRlQnV0dG9uQ2xpY2tlZCgpOiB2b2lkXHJcbiAge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuY2hhbmdlQ291bnRlcik7XHJcbiAgICBpZiAodGhpcy5jaGFuZ2VDb3VudGVyPjApXHJcbiAgICB7XHJcbiAgICAgIGNvbnN0IGRpYWxvZ1JlZiA9IHRoaXMuZGlhbG9nLm9wZW4oRGlhbG9nTWVzc2FnZUNvbXBvbmVudCk7XHJcbiAgICAgIGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS50aXRsZT0nQ2F1dGlvbidcclxuICAgICAgZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLm1lc3NhZ2U9J0lmIHlvdSBkdXBsaWNhdGUgcm93cyB3aXRob3V0IGFwcGx5IGNoYW5nZXMsIHlvdXIgbW9kaWZpY2F0aW9ucyB3aWxsIGJlIG92ZXJ3cml0dGVkLCBkbyB5b3Ugd2FudCB0byBjb250aW51ZT8nXHJcbiAgICAgIGRpYWxvZ1JlZi5hZnRlckNsb3NlZCgpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIGlmKHJlc3VsdCl7XHJcbiAgICAgICAgICBpZihyZXN1bHQuZXZlbnQ9PT0nQWNjZXB0JykgeyAgXHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSB0aGlzLmdyaWRBcGkuZ2V0U2VsZWN0ZWROb2RlcygpO1xyXG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZERhdGEgPSBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IG5vZGUuZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuZHVwbGljYXRlLmVtaXQoc2VsZWN0ZWREYXRhKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gIH1cclxuICBlbHNle1xyXG4gICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IHRoaXMuZ3JpZEFwaS5nZXRTZWxlY3RlZE5vZGVzKCk7XHJcbiAgICBjb25zdCBzZWxlY3RlZERhdGEgPSBzZWxlY3RlZE5vZGVzLm1hcChub2RlID0+IG5vZGUuZGF0YSk7XHJcbiAgICB0aGlzLmR1cGxpY2F0ZS5lbWl0KHNlbGVjdGVkRGF0YSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuICBhcHBseUNoYW5nZXMoKTogdm9pZFxyXG4gIHtcclxuICAgIGNvbnN0IGl0ZW1zQ2hhbmdlZDogYW55W10gPSBbXTtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBvZiB0aGlzLmNoYW5nZXNNYXAua2V5cygpKVxyXG4gICAge1xyXG4gICAgICBpdGVtc0NoYW5nZWQucHVzaCh0aGlzLmdyaWRBcGkuZ2V0Um93Tm9kZShrZXkpLmRhdGEpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zZW5kQ2hhbmdlcy5lbWl0KGl0ZW1zQ2hhbmdlZCk7XHJcbiAgICB0aGlzLmNoYW5nZXNNYXAuY2xlYXIoKTtcclxuICAgIHRoaXMuY2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuICAgIHRoaXMucGFyYW1zLmNvbERlZi5jZWxsU3R5bGUgPSAge2JhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnfTtcclxuICAgIHRoaXMuZ3JpZEFwaS5yZWRyYXdSb3dzKCk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIGRlbGV0ZUNoYW5nZXMoKTogdm9pZFxyXG4gIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcblxyXG4gICAgd2hpbGUodGhpcy5jaGFuZ2VDb3VudGVyPjApXHJcbiAgICB7XHJcbiAgICAgIHRoaXMudW5kbygpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAgIHRoaXMuY2hhbmdlc01hcC5jbGVhcigpO1xyXG4gICAgICAvL3RoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuICAgIFxyXG5cclxuICAgIC8vdGhpcy5wYXJhbXMuY29sRGVmLmNlbGxTdHlsZSA9ICB7YmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRid9O1xyXG4gICAgLy90aGlzLmdyaWRBcGkucmVkcmF3Um93cygpO1xyXG4gIH1cclxuXHJcblxyXG4gIG9uRmlsdGVyTW9kaWZpZWQoKTogdm9pZHtcclxuICAgIHRoaXMuZGVsZXRlQ2hhbmdlcygpO1xyXG4gIH1cclxuXHJcblxyXG4gIHVuZG8oKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgdGhpcy5ncmlkQXBpLnVuZG9DZWxsRWRpdGluZygpO1xyXG4gICAgdGhpcy5jaGFuZ2VDb3VudGVyIC09IDE7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyICs9IDE7XHJcbiAgfVxyXG5cclxuICByZWRvKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIHRoaXMuZ3JpZEFwaS5yZWRvQ2VsbEVkaXRpbmcoKTtcclxuICAgIHRoaXMuY2hhbmdlQ291bnRlciArPSAxO1xyXG4gICAgdGhpcy5yZWRvQ291bnRlciAtPSAxO1xyXG4gIH1cclxuXHJcblxyXG4gIG9uQ2VsbEVkaXRpbmdTdG9wcGVkKGUpXHJcbiAge1xyXG4gICAgICBpZiAodGhpcy5tb2RpZmljYXRpb25DaGFuZ2UpXHJcbiAgICAgIHtcclxuICAgICAgICB0aGlzLmNoYW5nZUNvdW50ZXIrKztcclxuICAgICAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLm9uQ2VsbFZhbHVlQ2hhbmdlZChlKTtcclxuICAgICAgICB0aGlzLm1vZGlmaWNhdGlvbkNoYW5nZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgb25DZWxsVmFsdWVDaGFuZ2VkKHBhcmFtcyk6IHZvaWR7XHJcbiAgICBjb25zb2xlLmxvZyhcInZhbHVlIENoYW5nZVwiKVxyXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7IFxyXG4gICAgaWYgKHRoaXMuY2hhbmdlQ291bnRlciA+IHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyKVxyXG4gICAgICAvLyBUcnVlIGlmIHdlIGhhdmUgZWRpdGVkIHNvbWUgY2VsbCBvciB3ZSBoYXZlIGRvbmUgYSByZWRvIFxyXG4gICAgICB7XHJcblxyXG4gICAgICAgIGlmIChwYXJhbXMub2xkVmFsdWUgIT09IHBhcmFtcy52YWx1ZSAmJiAhKHBhcmFtcy5vbGRWYWx1ZSA9PSBudWxsICYmIHBhcmFtcy52YWx1ZSA9PT0gJycpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgaWYgKCEgdGhpcy5jaGFuZ2VzTWFwLmhhcyhwYXJhbXMubm9kZS5pZCkpIC8vIElmIGl0J3MgZmlydHMgZWRpdCBvZiBhIGNlbGwsIHdlIGFkZCBpdCB0byB0aGUgbWFwIGFuZCB3ZSBwYWludCBpdFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBhZGRNYXA6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xyXG4gICAgICAgICAgICBhZGRNYXAuc2V0KHBhcmFtcy5jb2xEZWYuZmllbGQsIDEpXHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlc01hcC5zZXQocGFyYW1zLm5vZGUuaWQsIGFkZE1hcCk7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuc3RhdHVzQ29sdW1uKSB7dGhpcy5ncmlkQXBpLmdldFJvd05vZGUocGFyYW1zLm5vZGUuaWQpLmRhdGEuc3RhdHVzID0nTW9kaWZpZWQnfTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIGlmICghIHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmhhcyhwYXJhbXMuY29sRGVmLmZpZWxkKSlcclxuICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5zZXQocGFyYW1zLmNvbERlZi5maWVsZCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgLy8gV2UgYWxyZWFkeSBoYWQgZWRpdGVkIHRoaXMgY2VsbCwgc28gd2Ugb25seSBpbmNyZW1lbnQgbnVtYmVyIG9mIGNoYW5nZXMgb2YgaXQgb24gdGhlIG1hcCBcclxuICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDaGFuZ2VzID0gdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuZ2V0KHBhcmFtcy5jb2xEZWYuZmllbGQpO1xyXG4gICAgICAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuc2V0KHBhcmFtcy5jb2xEZWYuZmllbGQsIChjdXJyZW50Q2hhbmdlcyArIDEpKTtcclxuICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5wYWludENlbGxzKHBhcmFtcywgdGhpcy5jaGFuZ2VzTWFwKTsgLy9XZSBwYWludCB0aGUgcm93IG9mIHRoZSBlZGl0ZWQgY2VsbCBcclxuICAgICAgICAgIHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyKys7IC8vV2UgbWF0Y2ggdGhlIGN1cnJlbnQgcHJldmlvdXNDaGFuZ2VDb3VudGVyIHdpdGggY2hhbmdlQ291bnRlclxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH1cclxuICAgIGVsc2UgaWYgKHRoaXMuY2hhbmdlQ291bnRlciA8IHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyKXsgLy8gVHJ1ZSBpZiB3ZSBoYXZlIGRvbmUgYW4gdW5kb1xyXG4gICAgICAgIGxldCBjdXJyZW50Q2hhbmdlcyA9IC0xO1xyXG4gICAgICAgIGlmICh0aGlzLmNoYW5nZXNNYXAuaGFzKHBhcmFtcy5ub2RlLmlkKSkge2N1cnJlbnRDaGFuZ2VzID0gdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuZ2V0KHBhcmFtcy5jb2xEZWYuZmllbGQpO31cclxuICAgICAgICBcclxuICAgICAgICBpZiAoY3VycmVudENoYW5nZXMgPT09IDEpIHsgLy9PbmNlIHRoZSB1bmRvIGl0J3MgZG9uZSwgY2VsbCBpcyBpbiBoaXMgaW5pdGlhbCBzdGF0dXNcclxuXHJcbiAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5kZWxldGUocGFyYW1zLmNvbERlZi5maWVsZCk7XHJcbiAgICAgICAgICBpZih0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5zaXplID09PSAwKSB7IC8vIE5vIG1vcmUgbW9kaWZpY2F0aW9ucyBpbiB0aGlzIHJvd1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZGVsZXRlKHBhcmFtcy5ub2RlLmlkKTtcclxuICAgICAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5ncmlkQXBpLmdldERpc3BsYXllZFJvd0F0SW5kZXgocGFyYW1zLnJvd0luZGV4KTtcclxuICAgICAgICAgICAgaWYodGhpcy5zdGF0dXNDb2x1bW4pIHt0aGlzLmdyaWRBcGkuZ2V0Um93Tm9kZShwYXJhbXMubm9kZS5pZCkuZGF0YS5zdGF0dXMgPScnfTtcclxuICAgICAgICAgICAgLy8gV2UgcGFpbnQgaXQgd2hpdGVcclxuICAgICAgICAgICAgdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3Moe3Jvd05vZGVzOiBbcm93XX0pO1xyXG5cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0aGlzLnBhaW50Q2VsbHMocGFyYW1zLCB0aGlzLmNoYW5nZXNNYXApO1xyXG4gICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGN1cnJlbnRDaGFuZ2VzID4xKSAvLyBUaGUgY2VsbCBpc24ndCBpbiBoaXMgaW5pdGlhbCBzdGF0ZSB5ZXRcclxuICAgICAgICB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9XZSBjYW4ndCBkbyBlbHNlIGJlY2F1c2Ugd2UgY2FuIGJlIGRvaW5nIGFuIHVuZG8gd2l0aG91dCBjaGFuZ2VzIFxyXG4gICAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuc2V0KHBhcmFtcy5jb2xEZWYuZmllbGQsIChjdXJyZW50Q2hhbmdlcyAtIDEpKTtcclxuXHJcbiAgICAgICAgICB0aGlzLnBhaW50Q2VsbHMocGFyYW1zLCB0aGlzLmNoYW5nZXNNYXApOy8vTm90IGluaXRpYWwgc3RhdGUgLT4gZ3JlZW4gYmFja2dyb3VuZFxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXItLTsgIC8vV2UgZGVjcmVtZW50IHByZXZpb3VzQ2hhbmdlQ291bnRlciBiZWNhdXNlIHdlIGhhdmUgZG9uZSB1bmRvXHJcbiAgICB9XHJcbiAgICBlbHNleyAvLyBDb250cm9sIG9mIG1vZGlmaWNhdGlvbnMgd2l0aG91dCBjaGFuZ2VzXHJcbiAgICAgIGlmKCAhKHBhcmFtcy5vbGRWYWx1ZSA9PSBudWxsICYmIHBhcmFtcy52YWx1ZSA9PT0gJycpKVxyXG4gICAgICB7XHJcbiAgICAgICAgbGV0IG5ld1ZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgaWYocGFyYW1zLnZhbHVlID09IG51bGwpIHtuZXdWYWx1ZT0nJ31cclxuICAgICAgICBlbHNleyBuZXdWYWx1ZSA9IHBhcmFtcy52YWx1ZS50b1N0cmluZygpIH1cclxuXHJcbiAgICAgICAgICBpZiAoKHBhcmFtcy5vbGRWYWx1ZSE9dW5kZWZpbmVkICYmIHBhcmFtcy5vbGRWYWx1ZSE9bnVsbCAmJiBwYXJhbXMub2xkVmFsdWUudG9TdHJpbmcoKSAhPT0gbmV3VmFsdWUudG9TdHJpbmcoKSkgXHJcbiAgICAgICAgICAgICAgfHwgKChwYXJhbXMub2xkVmFsdWU9PXVuZGVmaW5lZCB8fCBwYXJhbXMub2xkVmFsdWUgPT0gbnVsbCkgJiYgbmV3VmFsdWUhPW51bGwpKSB7IFxyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMubW9kaWZpY2F0aW9uQ2hhbmdlID0gdHJ1ZTsgXHJcbiAgICAgICAgICAgIGlmKHBhcmFtcy5jb2xEZWYuY2VsbFJlbmRlcmVyPT1cImJ0bkNoZWNrYm94UmVuZGVyZXJDb21wb25lbnRcIil7XHJcbiAgICAgICAgICAgICAgdmFyIHVuZG9SZWRvQWN0aW9ucz17XHJcbiAgICAgICAgICAgICAgICBjZWxsVmFsdWVDaGFuZ2VzOiB0aGlzLmdyaWRBcGkudW5kb1JlZG9TZXJ2aWNlLmNlbGxWYWx1ZUNoYW5nZXNcclxuICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgIHRoaXMuZ3JpZEFwaS51bmRvUmVkb1NlcnZpY2UucHVzaEFjdGlvbnNUb1VuZG9TdGFjayh1bmRvUmVkb0FjdGlvbnMpO1xyXG4gICAgICAgICAgICAgIHRoaXMuZ3JpZEFwaS51bmRvUmVkb1NlcnZpY2UuaXNGaWxsaW5nPWZhbHNlO1xyXG4gICAgICAgICAgICAgIHRoaXMub25DZWxsRWRpdGluZ1N0b3BwZWQocGFyYW1zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7dGhpcy5tb2RpZmljYXRpb25XaXRob3V0Q2hhbmdlcyhwYXJhbXMpfVxyXG4gICAgICAgIFxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge3RoaXMubW9kaWZpY2F0aW9uV2l0aG91dENoYW5nZXMocGFyYW1zKX1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIG1vZGlmaWNhdGlvbldpdGhvdXRDaGFuZ2VzKHBhcmFtczogYW55KSB7XHJcblxyXG4gICAgaWYgKCB0aGlzLmNoYW5nZXNNYXAuaGFzKHBhcmFtcy5ub2RlLmlkKSkgLy9Nb2RpZmljYXRpb24gd2l0aG91dCBjaGFuZ2VzIGluIGVuIGVkaXRlZCBjZWxsXHJcbiAgICB7XHJcbiAgICAgIGlmKCF0aGlzLnVuZG9Ob0NoYW5nZXMpXHJcbiAgICAgIHtcclxuICAgICAgICB0aGlzLmdyaWRBcGkudW5kb0NlbGxFZGl0aW5nKCk7IC8vIFVuZG8gdG8gZGVsZXRlIHRoZSBjaGFuZ2Ugd2l0aG91dCBjaGFuZ2VzIGludGVybmFsbHkgXHJcbiAgICAgICAgdGhpcy51bmRvTm9DaGFuZ2VzID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnBhaW50Q2VsbHMocGFyYW1zLCB0aGlzLmNoYW5nZXNNYXApOyAgLy9UaGUgY2VsbCBoYXMgbW9kaWZpY2F0aW9ucyB5ZXQgLT4gZ3JlZW4gYmFja2dyb3VuZCBcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHsgdGhpcy51bmRvTm9DaGFuZ2VzID0gZmFsc2U7IH1cclxuXHJcblxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIC8vV2l0aCB0aGUgaW50ZXJuYWxseSB1bmRvIHdpbGwgZW50ZXIgYXQgdGhpcyBmdW5jdGlvbiwgc28gd2UgaGF2ZSB0byBjb250cm9sIHdoZW4gZG9uZSB0aGUgdW5kbyBvciBub3QgXHJcbiAgICAgIGlmKCF0aGlzLnVuZG9Ob0NoYW5nZXMpXHJcbiAgICAgIHtcclxuICAgICAgICB0aGlzLmdyaWRBcGkudW5kb0NlbGxFZGl0aW5nKCk7IC8vIFVuZG8gdG8gZGVsZXRlIHRoZSBjaGFuZ2UgaW50ZXJuYWxseVxyXG4gICAgICAgIHRoaXMudW5kb05vQ2hhbmdlcyA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7IHRoaXMudW5kb05vQ2hhbmdlcyA9IGZhbHNlOyB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0Q29sdW1uSW5kZXhCeUNvbElkKGFwaTogQ29sdW1uQXBpLCBjb2xJZDogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBhcGkuZ2V0QWxsQ29sdW1ucygpLmZpbmRJbmRleChjb2wgPT4gY29sLmdldENvbElkKCkgPT09IGNvbElkKTtcclxuICB9XHJcbiAgcGFpbnRDZWxscyhwYXJhbXM6IGFueSwgIGNoYW5nZXNNYXA6IE1hcDxudW1iZXIsIE1hcDxzdHJpbmcsIG51bWJlcj4+LCApXHJcbiAge1xyXG4gICAgY29uc3Qgcm93ID0gdGhpcy5ncmlkQXBpLmdldERpc3BsYXllZFJvd0F0SW5kZXgocGFyYW1zLnJvd0luZGV4KTtcclxuXHJcbiAgICB0aGlzLmNoYW5nZUNlbGxTdHlsZUNvbHVtbnMocGFyYW1zLGNoYW5nZXNNYXAsJyNFOEYxREUnKTtcclxuICAgIHRoaXMuZ3JpZEFwaS5yZWRyYXdSb3dzKHtyb3dOb2RlczogW3Jvd119KTtcclxuICAgIHRoaXMuY2hhbmdlQ2VsbFN0eWxlQ29sdW1ucyhwYXJhbXMsY2hhbmdlc01hcCwnI0ZGRkZGRicpOyBcclxuICAgIC8vIFdlIHdpbGwgZGVmaW5lIGNlbGxTdHlsZSB3aGl0ZSB0byBmdXR1cmUgbW9kaWZpY2F0aW9ucyAobGlrZSBmaWx0ZXIpXHJcbiAgfVxyXG5cclxuICBjaGFuZ2VDZWxsU3R5bGVDb2x1bW5zKHBhcmFtczogYW55LCBjaGFuZ2VzTWFwOiBNYXA8bnVtYmVyLCBNYXA8c3RyaW5nLCBudW1iZXI+PiwgY29sb3I6IHN0cmluZyl7XHJcblxyXG4gICAgZm9yIChjb25zdCBrZXkgb2YgY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmtleXMoKSlcclxuICAgIHtcclxuICAgICAgY29uc3QgY29sdW1uTnVtYmVyID0gdGhpcy5nZXRDb2x1bW5JbmRleEJ5Q29sSWQodGhpcy5ncmlkQ29sdW1uQXBpLCBrZXkpO1xyXG4gICAgICB0aGlzLmdyaWRDb2x1bW5BcGkuY29sdW1uQ29udHJvbGxlci5ncmlkQ29sdW1uc1tjb2x1bW5OdW1iZXJdLmNvbERlZi5jZWxsU3R5bGUgPSB7YmFja2dyb3VuZENvbG9yOiBjb2xvcn07XHJcbiAgICB9XHJcblxyXG5cclxuICB9XHJcblxyXG59XHJcbiIsIiAgICA8ZGl2IGlkPWdydXAxIGNsYXNzPVwiZWRpdERpdkJ0bnNcIj5cclxuICAgICAgICA8c3BhbiAqbmdJZj1cInRpdGxlXCIgIFt0cmFuc2xhdGVdPVwidGl0bGVcIj4gPC9zcGFuPlxyXG4gICAgICAgIDxidXR0b24gdGl0bGU9XCJ7eyAnY2FuY2VsJyB8IHRyYW5zbGF0ZSB9fVwiIG1hdC1taW5pLWZhYiBjbGFzcz1cImVkaXRCdG5cIiAgKm5nSWY9XCJkaXNjYXJkQ2hhbmdlc0J1dHRvblwiICBpZD1cImRlbGV0ZUNoYW5nZXNCdXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgIChjbGljayk9XCJkZWxldGVDaGFuZ2VzKClcIiBbZGlzYWJsZWRdPVwiY2hhbmdlQ291bnRlciA8PSAwXCI+XHJcbiAgICAgICAgICAgIDxtYXQtaWNvbiAgZm9udFNldD1cIm1hdGVyaWFsLWljb25zLXJvdW5kXCIgPiBjbG9zZSA8L21hdC1pY29uPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b24gdGl0bGU9XCJ7eyAndW5kbycgfCB0cmFuc2xhdGUgfX1cIiBtYXQtbWluaS1mYWIgY2xhc3M9XCJlZGl0QnRuXCIgKm5nSWY9XCJ1bmRvQnV0dG9uXCIgIGlkPVwidW5kb1wiICAoY2xpY2spPVwidW5kbygpXCIgW2Rpc2FibGVkXT1cImNoYW5nZUNvdW50ZXIgPD0gMFwiID5cclxuICAgICAgICAgICAgPG1hdC1pY29uIGZvbnRTZXQ9XCJtYXRlcmlhbC1pY29ucy1yb3VuZFwiID4gdW5kbyA8L21hdC1pY29uPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b24gdGl0bGU9XCJ7eyAncmVkbycgfCB0cmFuc2xhdGUgfX1cIiBtYXQtbWluaS1mYWIgY2xhc3M9XCJlZGl0QnRuXCIgKm5nSWY9XCJyZWRvQnV0dG9uXCIgIGlkPVwicmVkb1wiICAoY2xpY2spPVwicmVkbygpXCIgW2Rpc2FibGVkXT1cInJlZG9Db3VudGVyIDw9IDBcIj5cclxuICAgICAgICAgICAgPG1hdC1pY29uIGZvbnRTZXQ9XCJtYXRlcmlhbC1pY29ucy1yb3VuZFwiID4gcmVkbyA8L21hdC1pY29uPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b24gdGl0bGU9XCJ7eyAnYWNjZXB0JyB8IHRyYW5zbGF0ZSB9fVwiIG1hdC1taW5pLWZhYiBjbGFzcz1cImVkaXRCdG5cIiAqbmdJZj1cImFwcGx5Q2hhbmdlc0J1dHRvblwiICBpZD1cImFwcGx5Q2hhbmdlc0J1dHRvblwiICAoY2xpY2spPVwiYXBwbHlDaGFuZ2VzKClcIiBbZGlzYWJsZWRdPVwiY2hhbmdlQ291bnRlciA8PSAwXCIgPlxyXG4gICAgICAgICAgICA8bWF0LWljb24gZm9udFNldD1cIm1hdGVyaWFsLWljb25zLXJvdW5kXCIgPiBjaGVjayA8L21hdC1pY29uPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBpZD1ncnVwMiBjbGFzcz1cImFjdGlvbnNEaXZCdG5zXCIgPlxyXG4gICAgICAgIDxsYWJlbCAqbmdJZj1cImdsb2JhbFNlYXJjaFwiIFt0cmFuc2xhdGVdPVwiJ3NlYXJjaCdcIj4gPC9sYWJlbD5cclxuICAgICAgICA8aW5wdXQgKm5nSWY9XCJnbG9iYWxTZWFyY2hcInR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJzZWFyY2hHZW5lcmljSW5wdXRcIiBwbGFjZWhvbGRlcj1cIlwiIChrZXl1cCk9XCJxdWlja1NlYXJjaCgpXCIgWyhuZ01vZGVsKV09XCJzZWFyY2hWYWx1ZVwiIG1sLTIgPlxyXG4gICAgICAgIDxidXR0b24gKm5nSWY9XCJkZWxldGVCdXR0b25cIiAgbWF0LXN0cm9rZWQtYnV0dG9uIGlkPVwiZGVsZXRlQnV0dG9uXCIgIChjbGljayk9XCJyZW1vdmVEYXRhKClcIj5cclxuICAgICAgICAgICAgPG1hdC1pY29uIGZvbnRTZXQ9XCJtYXRlcmlhbC1pY29ucy1yb3VuZFwiID4gZGVsZXRlIDwvbWF0LWljb24+XHJcbiAgICAgICAgICAgIDxzcGFuICBbdHJhbnNsYXRlXT1cIidyZW1vdmUnXCI+IDwvc3Bhbj5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIDxidXR0b24gKm5nSWY9XCJhY3Rpb25CdXR0b25cIiAgbWF0LXN0cm9rZWQtYnV0dG9uIFttYXRNZW51VHJpZ2dlckZvcl09XCJtZW51XCIgaWQ9XCJhY3Rpb25CdXR0b25cIj5cclxuICAgICAgICAgICAgPHNwYW4gIFt0cmFuc2xhdGVdPVwiJ2FjdGlvbnMnXCI+IDwvc3Bhbj4gICAgXHJcbiAgICAgICAgICAgIDxtYXQtaWNvbiBmb250U2V0PVwibWF0ZXJpYWwtaWNvbnMtcm91bmRcIiA+IGtleWJvYXJkX2Fycm93X2Rvd24gPC9tYXQtaWNvbj4gICAgIFxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDxtYXQtbWVudSAjbWVudT1cIm1hdE1lbnVcIj5cclxuICAgICAgICAgICAgPGJ1dHRvbiBtYXQtbWVudS1pdGVtICpuZ0lmPVwiIWhpZGVFeHBvcnRCdXR0b25cIiAoY2xpY2spPVwiZXhwb3J0RGF0YSgpXCIgPiB7e1wiZXhwb3J0XCIgfCB0cmFuc2xhdGV9fSA8L2J1dHRvbj5cclxuICAgICAgICAgICAgPGJ1dHRvbiBtYXQtbWVudS1pdGVtICpuZ0lmPVwiIWhpZGVEdXBsaWNhdGVCdXR0b25cIiAoY2xpY2spPVwib25EdXBsaWNhdGVCdXR0b25DbGlja2VkKClcIj4ge3tcImR1cGxpY2F0ZVwiIHwgdHJhbnNsYXRlfX08L2J1dHRvbj5cclxuICAgICAgICAgICAgPGJ1dHRvbiBtYXQtbWVudS1pdGVtICpuZ0lmPVwiIWhpZGVTZWFyY2hSZXBsYWNlQnV0dG9uXCI+IHt7XCJzZWFyY2gvcmVwbGFjZVwiIHwgdHJhbnNsYXRlfX08L2J1dHRvbj5cclxuICAgICAgICA8L21hdC1tZW51PiAgXHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICA8YnV0dG9uICAqbmdJZj1cIm5ld0J1dHRvblwiIG1hdC1zdHJva2VkLWJ1dHRvbiBpZD1cIm5ld0J1dHRvblwiICAoY2xpY2spPVwibmV3RGF0YSgpXCI+XHJcbiAgICAgICAgICAgIDxtYXQtaWNvbiBmb250U2V0PVwibWF0ZXJpYWwtaWNvbnMtcm91bmRcIj4gYWRkX2NpcmNsZV9vdXRsaW5lIDwvbWF0LWljb24+ICAgICAgXHJcbiAgICAgICAgICAgIDxzcGFuICBbdHJhbnNsYXRlXT1cIiduZXcnXCI+IDwvc3Bhbj4gICAgICAgICAgIFxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICA8YnV0dG9uICAqbmdJZj1cImFkZEJ1dHRvblwiIG1hdC1zdHJva2VkLWJ1dHRvbiBpZD1cIm5ld0J1dHRvblwiICAoY2xpY2spPVwib25BZGRCdXR0b25DbGlja2VkKClcIj5cclxuICAgICAgICAgICAgPG1hdC1pY29uIGZvbnRTZXQ9XCJtYXRlcmlhbC1pY29ucy1yb3VuZFwiPiBhZGRfY2lyY2xlX291dGxpbmUgPC9tYXQtaWNvbj4gICAgICBcclxuICAgICAgICAgICAgPHNwYW4gIFt0cmFuc2xhdGVdPVwiJ2FkZCdcIj4gPC9zcGFuPiAgICAgICAgICAgXHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIFxyXG4gICAgPC9kaXY+XHJcblxyXG5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCIgaGVpZ2h0OiAxMDAlXCI+XHJcbiAgICAgICAgPGRpdiBpZD1cIm15R3JpZFwiIHN0eWxlPVwiIHdpZHRoOjEwMCU7IGhlaWdodDogMTAwJVwiID5cclxuICAgICAgICAgICAgPGFnLWdyaWQtYW5ndWxhclxyXG4gICAgICAgICAgICBzdHlsZT1cIiB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlO1wiXHJcbiAgICAgICAgICAgIFtjbGFzc109XCJ0aGVtZUdyaWRcIlxyXG4gICAgICAgICAgICBbZmxvYXRpbmdGaWx0ZXJdPVwidHJ1ZVwiXHJcbiAgICAgICAgICAgIFtyb3dEYXRhXT1cInJvd0RhdGFcIlxyXG4gICAgICAgICAgICBbY29sdW1uRGVmc109XCJjb2x1bW5EZWZzXCJcclxuICAgICAgICAgICAgW2dyaWRPcHRpb25zXT1cImdyaWRPcHRpb25zXCJcclxuICAgICAgICAgICAgW2FuaW1hdGVSb3dzXT1cInRydWVcIlxyXG4gICAgICAgICAgICBbcGFnaW5hdGlvbl09XCJmYWxzZVwiXHJcbiAgICAgICAgICAgIFttb2R1bGVzXT1cIm1vZHVsZXNcIiAgICAgXHJcbiAgICAgICAgICAgIFt1bmRvUmVkb0NlbGxFZGl0aW5nXT1cInRydWVcIiAgICBcclxuICAgICAgICAgICAgW3VuZG9SZWRvQ2VsbEVkaXRpbmdMaW1pdF09IDIwMFxyXG4gICAgICAgICAgICBbc3VwcHJlc3NSb3dDbGlja1NlbGVjdGlvbl09dHJ1ZVxyXG4gICAgICAgICAgICBbZnJhbWV3b3JrQ29tcG9uZW50c109XCJmcmFtZXdvcmtDb21wb25lbnRzXCJcclxuICAgICAgICAgICAgcm93U2VsZWN0aW9uPVwibXVsdGlwbGVcIlxyXG4gICAgICAgICAgICBtdWx0aVNvcnRLZXk9XCJrZXlcIlxyXG4gICAgICAgICAgICAoZmlsdGVyTW9kaWZpZWQpPVwib25GaWx0ZXJNb2RpZmllZCgpXCJcclxuICAgICAgICAgICAgKGNlbGxFZGl0aW5nU3RvcHBlZCkgPVwib25DZWxsRWRpdGluZ1N0b3BwZWQoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgIChjZWxsVmFsdWVDaGFuZ2VkKT1cIm9uQ2VsbFZhbHVlQ2hhbmdlZCgkZXZlbnQpXCJcclxuICAgICAgICAgICAgKGdyaWRSZWFkeSk9XCJvbkdyaWRSZWFkeSgkZXZlbnQpXCI+XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8L2FnLWdyaWQtYW5ndWxhcj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuXHJcbiJdfQ==