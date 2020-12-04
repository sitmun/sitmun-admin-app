import { Component, Input, Output, EventEmitter, NgModule } from '@angular/core';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AngularHalModule, SitmunFrontendCoreModule } from '@sitmun/frontend-core';
import { AgGridModule } from '@ag-grid-community/angular';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as ɵngcc0 from '@angular/core';
import * as ɵngcc1 from '@angular/common';
import * as ɵngcc2 from '@ag-grid-community/angular';
import * as ɵngcc3 from '@angular/material/button';
import * as ɵngcc4 from '@angular/material/icon';
import * as ɵngcc5 from '@ngx-translate/core';
import * as ɵngcc6 from '@angular/forms';

function DataGridComponent_button_1_Template(rf, ctx) { if (rf & 1) {
    const _r9 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 13);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_1_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r9); const ctx_r8 = ɵngcc0.ɵɵnextContext(); return ctx_r8.deleteChanges(); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon", 14);
    ɵngcc0.ɵɵtext(2, " close ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("disabled", ctx_r0.changeCounter <= 0);
} }
function DataGridComponent_button_2_Template(rf, ctx) { if (rf & 1) {
    const _r11 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 15);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_2_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r11); const ctx_r10 = ɵngcc0.ɵɵnextContext(); return ctx_r10.undo(); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon", 14);
    ɵngcc0.ɵɵtext(2, " undo ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("disabled", ctx_r1.changeCounter <= 0);
} }
function DataGridComponent_button_3_Template(rf, ctx) { if (rf & 1) {
    const _r13 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 16);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_3_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r13); const ctx_r12 = ɵngcc0.ɵɵnextContext(); return ctx_r12.redo(); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon", 14);
    ɵngcc0.ɵɵtext(2, " redo ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("disabled", ctx_r2.redoCounter <= 0);
} }
function DataGridComponent_button_4_Template(rf, ctx) { if (rf & 1) {
    const _r15 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 17);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_4_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r15); const ctx_r14 = ɵngcc0.ɵɵnextContext(); return ctx_r14.applyChanges(); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon", 14);
    ɵngcc0.ɵɵtext(2, " check ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r3 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("disabled", ctx_r3.changeCounter <= 0);
} }
function DataGridComponent_label_6_Template(rf, ctx) { if (rf & 1) {
    ɵngcc0.ɵɵelement(0, "label", 18);
} if (rf & 2) {
    ɵngcc0.ɵɵproperty("translate", "Search");
} }
function DataGridComponent_input_7_Template(rf, ctx) { if (rf & 1) {
    const _r17 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "input", 19);
    ɵngcc0.ɵɵlistener("keyup", function DataGridComponent_input_7_Template_input_keyup_0_listener() { ɵngcc0.ɵɵrestoreView(_r17); const ctx_r16 = ɵngcc0.ɵɵnextContext(); return ctx_r16.quickSearch(); })("ngModelChange", function DataGridComponent_input_7_Template_input_ngModelChange_0_listener($event) { ɵngcc0.ɵɵrestoreView(_r17); const ctx_r18 = ɵngcc0.ɵɵnextContext(); return ctx_r18.searchValue = $event; });
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r5 = ɵngcc0.ɵɵnextContext();
    ɵngcc0.ɵɵproperty("ngModel", ctx_r5.searchValue);
} }
function DataGridComponent_button_8_Template(rf, ctx) { if (rf & 1) {
    const _r20 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 20);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_8_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r20); const ctx_r19 = ɵngcc0.ɵɵnextContext(); return ctx_r19.removeData(); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon", 14);
    ɵngcc0.ɵɵtext(2, " delete ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(3, "span", 18);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵproperty("translate", "Remove");
} }
function DataGridComponent_button_9_Template(rf, ctx) { if (rf & 1) {
    const _r22 = ɵngcc0.ɵɵgetCurrentView();
    ɵngcc0.ɵɵelementStart(0, "button", 21);
    ɵngcc0.ɵɵlistener("click", function DataGridComponent_button_9_Template_button_click_0_listener() { ɵngcc0.ɵɵrestoreView(_r22); const ctx_r21 = ɵngcc0.ɵɵnextContext(); return ctx_r21.newData(); });
    ɵngcc0.ɵɵelementStart(1, "mat-icon", 14);
    ɵngcc0.ɵɵtext(2, " add_circle_outline ");
    ɵngcc0.ɵɵelementEnd();
    ɵngcc0.ɵɵelement(3, "span", 18);
    ɵngcc0.ɵɵelementEnd();
} if (rf & 2) {
    ɵngcc0.ɵɵadvance(3);
    ɵngcc0.ɵɵproperty("translate", "New");
} }
class DataGridComponent {
    constructor() {
        this.modules = AllCommunityModules;
        this.statusColumn = false;
        this.changesMap = new Map();
        this.modificationChange = false;
        this.undoNoChanges = false;
        this.remove = new EventEmitter();
        this.new = new EventEmitter();
        this.sendChanges = new EventEmitter();
        this.changeCounter = 0;
        this.previousChangeCounter = 0;
        this.redoCounter = 0;
        this.gridOptions = {
            defaultColDef: {
                sortable: true,
                flex: 1,
                filter: true,
                editable: true,
                cellStyle: { backgroundColor: '#FFFFFF' },
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
        };
    }
    /**
     * @param {?} params
     * @return {?}
     */
    onGridReady(params) {
        this.params = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.getElements();
        this.gridApi.sizeColumnsToFit();
        for (const col of this.columnDefs) {
            if (col.field === 'estat') {
                this.statusColumn = true;
            }
        }
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
            console.log(items);
            this.rowData = items;
            setTimeout(() => { this.gridApi.sizeColumnsToFit(); }, 30);
        });
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
            const selectedRows = selectedNodes.map(node => node.rowIndex);
            for (const id of selectedRows) {
                this.gridApi.getRowNode(id).data.estat = 'Eliminat';
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
        this.params.colDef.cellStyle = { backgroundColor: '#FFFFFF' };
        this.gridApi.redrawRows();
    }
    /**
     * @return {?}
     */
    deleteChanges() {
        for (let i = 0; i < this.changeCounter; i++) {
            this.gridApi.undoCellEditing();
        }
        this.changesMap.clear();
        this.previousChangeCounter = 0;
        this.changeCounter = 0;
        this.redoCounter = 0;
        this.params.colDef.cellStyle = { backgroundColor: '#FFFFFF' };
        this.gridApi.redrawRows();
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
        this.params = params; // Guardaremos los parametros por si hay que hacer un apply changes
        if (this.changeCounter > this.previousChangeCounter) {
            if (params.oldValue !== params.value && !(params.oldValue == null && params.value === '')) {
                if (!this.changesMap.has(params.node.id)) {
                    /** @type {?} */
                    const addMap = new Map();
                    addMap.set(params.colDef.field, 1);
                    this.changesMap.set(params.node.id, addMap);
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
                this.paintCells(params, this.changesMap); // Com ha estado modificada la linia, la pintamos de verde
                this.previousChangeCounter++; //Igualamos el contador de cambios anterior al actual
            }
        }
        else if (this.changeCounter < this.previousChangeCounter) {
            /** @type {?} */
            let currentChanges = -1;
            if (this.changesMap.has(params.node.id)) {
                currentChanges = this.changesMap.get(params.node.id).get(params.colDef.field);
            }
            if (currentChanges === 1) {
                //Al deshacer el cambio, la dejaremos en su estado inicial
                this.changesMap.get(params.node.id).delete(params.colDef.field);
                if (this.changesMap.get(params.node.id).size === 0) {
                    // No hay mas modificaciones en eta fila
                    this.changesMap.delete(params.node.id);
                    /** @type {?} */
                    const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
                    // Si solo tiene una modificacion, quiere decir que la cela está en su estado inicial, por lo que la pintamos de blanco
                    this.gridApi.redrawRows({ rowNodes: [row] });
                }
                else {
                    this.paintCells(params, this.changesMap);
                }
            }
            else if (currentChanges > 1) {
                // No podemos hacer else por si hacemos un undo de una cela sin cambios
                this.changesMap.get(params.node.id).set(params.colDef.field, (currentChanges - 1));
                this.paintCells(params, this.changesMap); // Como aun tiene cambios, el background tiene que seguir verde
            }
            this.previousChangeCounter--; // Com veniem d'undo, hem de decrementar el comptador de canvisAnterior
        }
        else {
            // Control de modificaciones en blanco
            if (params.oldValue !== params.value && !(params.oldValue == null && params.value === '')) {
                this.modificationChange = true;
            }
            else {
                if (this.changesMap.has(params.node.id)) {
                    if (!this.undoNoChanges) {
                        this.gridApi.undoCellEditing(); // Undo para deshacer el cambio sin modificaciones internamente
                        this.undoNoChanges = true;
                        this.paintCells(params, this.changesMap); // Como aun tiene modificaciones, el background sigue siendo verde
                    }
                    else {
                        this.undoNoChanges = false;
                    }
                }
                else {
                    // Como al hacer undo volverá a entrar a esta misma función, hay que enviarlo a su if correspondiente
                    if (!this.undoNoChanges) {
                        this.gridApi.undoCellEditing(); // Undo para deshacer el cambio sin modificaciones internamente
                        this.undoNoChanges = true;
                    }
                    else {
                        this.undoNoChanges = false;
                    }
                }
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
        // Definiremos el cellStyle blanco para futuras modificaciones internas (ej: filtro)
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
DataGridComponent.ɵfac = function DataGridComponent_Factory(t) { return new (t || DataGridComponent)(); };
DataGridComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: DataGridComponent, selectors: [["app-data-grid"]], inputs: { frameworkComponents: "frameworkComponents", columnDefs: "columnDefs", getAll: "getAll", discardChangesButton: "discardChangesButton", undoButton: "undoButton", redoButton: "redoButton", applyChangesButton: "applyChangesButton", deleteButton: "deleteButton", newButton: "newButton", globalSearch: "globalSearch" }, outputs: { remove: "remove", new: "new", sendChanges: "sendChanges" }, decls: 13, vars: 20, consts: [["id", "grup1", 1, "editDivBtns"], ["mat-mini-fab", "", "class", "editBtn", "id", "borrarCanvis", "type", "button", 3, "disabled", "click", 4, "ngIf"], ["mat-mini-fab", "", "class", "editBtn", "id", "undo", 3, "disabled", "click", 4, "ngIf"], ["mat-mini-fab", "", "class", "editBtn", "id", "redo", 3, "disabled", "click", 4, "ngIf"], ["mat-mini-fab", "", "class", "editBtn", "id", "aplicarCanvis", 3, "disabled", "click", 4, "ngIf"], ["id", "grup2", 1, "actionsDivBtns"], [3, "translate", 4, "ngIf"], ["type", "text", "class", "searchGenericInput", "placeholder", "", "ml-2", "", 3, "ngModel", "keyup", "ngModelChange", 4, "ngIf"], ["mat-stroked-button", "", "id", "botoElimina", 3, "click", 4, "ngIf"], ["mat-stroked-button", "", "id", "botoNou", 3, "click", 4, "ngIf"], [1, "row", 2, "height", "100%"], ["id", "myGrid", 1, "ag-theme-alpine", 2, "width", "100%", "height", "100%"], ["rowSelection", "multiple", 1, "ag-theme-alpine", 2, "width", "100%", "height", "100%", 3, "floatingFilter", "rowData", "columnDefs", "gridOptions", "animateRows", "pagination", "modules", "undoRedoCellEditing", "undoRedoCellEditingLimit", "suppressRowClickSelection", "enableCellChangeFlash", "frameworkComponents", "filterModified", "cellEditingStopped", "cellValueChanged", "gridReady"], ["mat-mini-fab", "", "id", "borrarCanvis", "type", "button", 1, "editBtn", 3, "disabled", "click"], ["fontSet", "material-icons-round"], ["mat-mini-fab", "", "id", "undo", 1, "editBtn", 3, "disabled", "click"], ["mat-mini-fab", "", "id", "redo", 1, "editBtn", 3, "disabled", "click"], ["mat-mini-fab", "", "id", "aplicarCanvis", 1, "editBtn", 3, "disabled", "click"], [3, "translate"], ["type", "text", "placeholder", "", "ml-2", "", 1, "searchGenericInput", 3, "ngModel", "keyup", "ngModelChange"], ["mat-stroked-button", "", "id", "botoElimina", 3, "click"], ["mat-stroked-button", "", "id", "botoNou", 3, "click"]], template: function DataGridComponent_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵelementStart(0, "div", 0);
        ɵngcc0.ɵɵtemplate(1, DataGridComponent_button_1_Template, 3, 1, "button", 1);
        ɵngcc0.ɵɵtemplate(2, DataGridComponent_button_2_Template, 3, 1, "button", 2);
        ɵngcc0.ɵɵtemplate(3, DataGridComponent_button_3_Template, 3, 1, "button", 3);
        ɵngcc0.ɵɵtemplate(4, DataGridComponent_button_4_Template, 3, 1, "button", 4);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(5, "div", 5);
        ɵngcc0.ɵɵtemplate(6, DataGridComponent_label_6_Template, 1, 1, "label", 6);
        ɵngcc0.ɵɵtemplate(7, DataGridComponent_input_7_Template, 1, 1, "input", 7);
        ɵngcc0.ɵɵtemplate(8, DataGridComponent_button_8_Template, 4, 1, "button", 8);
        ɵngcc0.ɵɵtemplate(9, DataGridComponent_button_9_Template, 4, 1, "button", 9);
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementStart(10, "div", 10);
        ɵngcc0.ɵɵelementStart(11, "div", 11);
        ɵngcc0.ɵɵelementStart(12, "ag-grid-angular", 12);
        ɵngcc0.ɵɵlistener("filterModified", function DataGridComponent_Template_ag_grid_angular_filterModified_12_listener() { return ctx.onFilterModified(); })("cellEditingStopped", function DataGridComponent_Template_ag_grid_angular_cellEditingStopped_12_listener($event) { return ctx.onCellEditingStopped($event); })("cellValueChanged", function DataGridComponent_Template_ag_grid_angular_cellValueChanged_12_listener($event) { return ctx.onCellValueChanged($event); })("gridReady", function DataGridComponent_Template_ag_grid_angular_gridReady_12_listener($event) { return ctx.onGridReady($event); });
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementEnd();
    } if (rf & 2) {
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.discardChangesButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.undoButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.redoButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.applyChangesButton);
        ɵngcc0.ɵɵadvance(2);
        ɵngcc0.ɵɵproperty("ngIf", ctx.globalSearch);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.globalSearch);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.deleteButton);
        ɵngcc0.ɵɵadvance(1);
        ɵngcc0.ɵɵproperty("ngIf", ctx.newButton);
        ɵngcc0.ɵɵadvance(3);
        ɵngcc0.ɵɵproperty("floatingFilter", true)("rowData", ctx.rowData)("columnDefs", ctx.columnDefs)("gridOptions", ctx.gridOptions)("animateRows", true)("pagination", false)("modules", ctx.modules)("undoRedoCellEditing", true)("undoRedoCellEditingLimit", 200)("suppressRowClickSelection", true)("enableCellChangeFlash", true)("frameworkComponents", ctx.frameworkComponents);
    } }, directives: [ɵngcc1.NgIf, ɵngcc2.AgGridAngular, ɵngcc3.MatButton, ɵngcc4.MatIcon, ɵngcc5.TranslateDirective, ɵngcc6.DefaultValueAccessor, ɵngcc6.NgControlStatus, ɵngcc6.NgModel], styles: ["input[_ngcontent-%COMP%], label[_ngcontent-%COMP%]{display:inline-block;margin:5px 5px 5px 10px}#botoNou[_ngcontent-%COMP%]{color:#fff;background:no-repeat padding-box #68a225;margin-left:3px}#botoElimina[_ngcontent-%COMP%]{background:no-repeat padding-box #fff;margin-left:3px}#aplicarCanvis[_ngcontent-%COMP%]{color:#fff!important;background:no-repeat padding-box #68a225;margin-left:3px}#aplicarCanvis[disabled][_ngcontent-%COMP%]{background:no-repeat padding-box #83976c}#redo[_ngcontent-%COMP%], #undo[_ngcontent-%COMP%]{color:#fff!important;background:#ff9300;margin-left:3px}#redo[disabled][_ngcontent-%COMP%], #undo[disabled][_ngcontent-%COMP%]{background:#ffc97f;margin-left:3px}#borrarCanvis[_ngcontent-%COMP%]{color:#fff!important;background:#df3133}#borrarCanvis[disabled][_ngcontent-%COMP%]{color:#fff!important;background:#da8c8e}.editDivBtns[_ngcontent-%COMP%]{text-align:start;width:20%;height:30px!important;line-height:30px!important}.actionsDivBtns[_ngcontent-%COMP%]{text-align:end;width:80%;height:60px}.actionsDivBtns[_ngcontent-%COMP%], .editDivBtns[_ngcontent-%COMP%]{display:inline-block!important}.actionsDivBtns[_ngcontent-%COMP%]   .mat-stroked-button[_ngcontent-%COMP%]{padding:5px 20px!important}.editDivBtns[_ngcontent-%COMP%]   .mat-mini-fab[_ngcontent-%COMP%]   .mat-button-wrapper[_ngcontent-%COMP%]{padding:inherit!important;display:inherit!important}.editDivBtns[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%]{height:30px!important;bottom:5px;position:relative}.editDivBtns[_ngcontent-%COMP%]   .mat-mini-fab[_ngcontent-%COMP%]{width:30px;height:30px}.actionsDivBtns[_ngcontent-%COMP%]   .searchGenericInput[_ngcontent-%COMP%]{height:45px!important;width:50%!important}.ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#eee}\u200B[_ngcontent-%COMP%]   .ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar{width:2em;height:2em}.ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-button{background:#ccc}.ag-body-viewport.ag-layout-normal[_ngcontent-%COMP%]::-webkit-scrollbar-track-piece{background:#888}"] });
/** @nocollapse */
DataGridComponent.ctorParameters = () => [];
DataGridComponent.propDecorators = {
    frameworkComponents: [{ type: Input }],
    columnDefs: [{ type: Input }],
    getAll: [{ type: Input }],
    discardChangesButton: [{ type: Input }],
    undoButton: [{ type: Input }],
    redoButton: [{ type: Input }],
    applyChangesButton: [{ type: Input }],
    deleteButton: [{ type: Input }],
    newButton: [{ type: Input }],
    globalSearch: [{ type: Input }],
    remove: [{ type: Output }],
    new: [{ type: Output }],
    sendChanges: [{ type: Output }]
};
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(DataGridComponent, [{
        type: Component,
        args: [{
                selector: 'app-data-grid',
                template: `    <div id=grup1 class="editDivBtns">
        <button  mat-mini-fab class="editBtn"  *ngIf="discardChangesButton"  id="borrarCanvis" type="button"  (click)="deleteChanges()" [disabled]="changeCounter <= 0">
            <mat-icon  fontSet="material-icons-round" > close </mat-icon>
        </button>
        <button mat-mini-fab class="editBtn" *ngIf="undoButton"  id="undo"  (click)="undo()" [disabled]="changeCounter <= 0" >
            <mat-icon fontSet="material-icons-round" > undo </mat-icon>
        </button>
        <button mat-mini-fab class="editBtn" *ngIf="redoButton"  id="redo"  (click)="redo()" [disabled]="redoCounter <= 0">
            <mat-icon fontSet="material-icons-round" > redo </mat-icon>
        </button>
        <button mat-mini-fab class="editBtn" *ngIf="applyChangesButton"  id="aplicarCanvis"  (click)="applyChanges()" [disabled]="changeCounter <= 0" >
            <mat-icon fontSet="material-icons-round" > check </mat-icon>
        </button>
    </div>

    <div id=grup2 class="actionsDivBtns" >
        <label *ngIf="globalSearch" [translate]="'Search'"> </label>
        <input *ngIf="globalSearch"type="text" class="searchGenericInput" placeholder="" (keyup)="quickSearch()" [(ngModel)]="searchValue" ml-2 >
        <button *ngIf="deleteButton"  mat-stroked-button id="botoElimina"  (click)="removeData()">
            <mat-icon fontSet="material-icons-round" > delete </mat-icon>
            <span  [translate]="'Remove'"> </span>
            
        </button>
        <button  *ngIf="newButton" mat-stroked-button id="botoNou"  (click)="newData()">
            <mat-icon fontSet="material-icons-round"> add_circle_outline </mat-icon>      
            <span  [translate]="'New'"> </span>           
        </button>


        
    </div>



    <div class="row" style=" height: 100%">
        <div class="ag-theme-alpine" id="myGrid" style=" width:100%; height: 100%" >
            <ag-grid-angular
            style=" width: 100%; height: 100%;"
            class="ag-theme-alpine"
            [floatingFilter]="true"
            [rowData]="rowData"
            [columnDefs]="columnDefs"
            [gridOptions]="gridOptions"
            [animateRows]="true"
            [pagination]="false"
            [modules]="modules"     
            [undoRedoCellEditing]="true"    
            [undoRedoCellEditingLimit]= 200
            [suppressRowClickSelection]=true
            [enableCellChangeFlash]=true
            [frameworkComponents]="frameworkComponents"
            rowSelection="multiple"
            (filterModified)="onFilterModified()"
            (cellEditingStopped) ="onCellEditingStopped($event)"
            (cellValueChanged)="onCellValueChanged($event)"
            (gridReady)="onGridReady($event)">
            
            </ag-grid-angular>
        </div>
    </div>


`,
                styles: [`input,label{display:inline-block;margin:5px 5px 5px 10px}#botoNou{color:#fff;background:no-repeat padding-box #68a225;margin-left:3px}#botoElimina{background:no-repeat padding-box #fff;margin-left:3px}#aplicarCanvis{color:#fff!important;background:no-repeat padding-box #68a225;margin-left:3px}#aplicarCanvis[disabled]{background:no-repeat padding-box #83976c}#redo,#undo{color:#fff!important;background:#ff9300;margin-left:3px}#redo[disabled],#undo[disabled]{background:#ffc97f;margin-left:3px}#borrarCanvis{color:#fff!important;background:#df3133}#borrarCanvis[disabled]{color:#fff!important;background:#da8c8e}.editDivBtns{text-align:start;width:20%;height:30px!important;line-height:30px!important}.actionsDivBtns{text-align:end;width:80%;height:60px}.actionsDivBtns,.editDivBtns{display:inline-block!important}.actionsDivBtns .mat-stroked-button{padding:5px 20px!important}.editDivBtns .mat-mini-fab .mat-button-wrapper{padding:inherit!important;display:inherit!important}.editDivBtns .mat-icon{height:30px!important;bottom:5px;position:relative}.editDivBtns .mat-mini-fab{width:30px;height:30px}.actionsDivBtns .searchGenericInput{height:45px!important;width:50%!important}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-thumb{background:#eee}​ .ag-body-viewport.ag-layout-normal ::-webkit-scrollbar{width:2em;height:2em}.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-button{background:#ccc}.ag-body-viewport.ag-layout-normal::-webkit-scrollbar-track-piece{background:#888}`]
            }]
    }], function () { return []; }, { remove: [{
            type: Output
        }], new: [{
            type: Output
        }], sendChanges: [{
            type: Output
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
        }], globalSearch: [{
            type: Input
        }] }); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class BtnEditRenderedComponent {
    /**
     * @param {?} params
     * @return {?}
     */
    agInit(params) {
        this.params = params;
    }
    /**
     * @param {?} params
     * @return {?}
     */
    refresh(params) {
        return true;
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    btnClickedHandler($event) {
        this.params.clicked(this.params.value);
    }
    /**
     * @return {?}
     */
    getParams() {
        return this.params;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        // no need to remove the button click handler
    }
}
BtnEditRenderedComponent.ɵfac = function BtnEditRenderedComponent_Factory(t) { return new (t || BtnEditRenderedComponent)(); };
BtnEditRenderedComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: BtnEditRenderedComponent, selectors: [["app-btn-edit-rendered"]], decls: 3, vars: 0, consts: [["mat-mini-fab", "", "type", "button", 1, "buttonEdit", 3, "click"], ["fontSet", "material-icons-round", 1, "iconEdit"]], template: function BtnEditRenderedComponent_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵelementStart(0, "button", 0);
        ɵngcc0.ɵɵlistener("click", function BtnEditRenderedComponent_Template_button_click_0_listener($event) { return ctx.btnClickedHandler($event); });
        ɵngcc0.ɵɵelementStart(1, "mat-icon", 1);
        ɵngcc0.ɵɵtext(2, " edit ");
        ɵngcc0.ɵɵelementEnd();
        ɵngcc0.ɵɵelementEnd();
    } }, directives: [ɵngcc3.MatButton, ɵngcc4.MatIcon], styles: [".buttonEdit[_ngcontent-%COMP%]{color:#000;background-color:#ddd;width:24px;height:24px}.iconEdit[_ngcontent-%COMP%]{font-size:16px;margin-top:-8px}"] });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(BtnEditRenderedComponent, [{
        type: Component,
        args: [{
                selector: 'app-btn-edit-rendered',
                template: `<button mat-mini-fab class="buttonEdit"  type="button"  (click)="btnClickedHandler($event)" >
  <mat-icon class="iconEdit"   fontSet="material-icons-round" > edit </mat-icon>
</button> `,
                styles: [`.buttonEdit{color:#000;background-color:#ddd;width:24px;height:24px}.iconEdit{font-size:16px;margin-top:-8px}`]
            }]
    }], null, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * SITMUN plugin core module
 */
class SitmunFrontendGuiModule {
}
SitmunFrontendGuiModule.ɵmod = ɵngcc0.ɵɵdefineNgModule({ type: SitmunFrontendGuiModule });
SitmunFrontendGuiModule.ɵinj = ɵngcc0.ɵɵdefineInjector({ factory: function SitmunFrontendGuiModule_Factory(t) { return new (t || SitmunFrontendGuiModule)(); }, providers: [], imports: [[
            RouterModule,
            HttpClientModule,
            CommonModule,
            FormsModule,
            NoopAnimationsModule,
            AngularHalModule,
            ReactiveFormsModule,
            BrowserAnimationsModule,
            AgGridModule.withComponents([]),
            SitmunFrontendCoreModule,
            MatButtonModule,
            MatIconModule,
        ], HttpClientModule,
        CommonModule,
        FormsModule,
        NoopAnimationsModule,
        AngularHalModule,
        TranslateModule,
        ReactiveFormsModule,
        SitmunFrontendCoreModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵngcc0.ɵɵsetNgModuleScope(SitmunFrontendGuiModule, { declarations: function () { return [DataGridComponent, BtnEditRenderedComponent]; }, imports: function () { return [RouterModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        NoopAnimationsModule,
        AngularHalModule,
        ReactiveFormsModule,
        BrowserAnimationsModule, ɵngcc2.AgGridModule, SitmunFrontendCoreModule,
        MatButtonModule,
        MatIconModule]; }, exports: function () { return [HttpClientModule,
        CommonModule,
        FormsModule,
        NoopAnimationsModule,
        AngularHalModule,
        TranslateModule,
        ReactiveFormsModule, DataGridComponent, SitmunFrontendCoreModule]; } }); })();
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(SitmunFrontendGuiModule, [{
        type: NgModule,
        args: [{
                imports: [
                    RouterModule,
                    HttpClientModule,
                    CommonModule,
                    FormsModule,
                    NoopAnimationsModule,
                    AngularHalModule,
                    ReactiveFormsModule,
                    BrowserAnimationsModule,
                    AgGridModule.withComponents([]),
                    SitmunFrontendCoreModule,
                    MatButtonModule,
                    MatIconModule,
                ],
                declarations: [
                    DataGridComponent,
                    BtnEditRenderedComponent,
                ],
                entryComponents: [],
                providers: [],
                exports: [
                    HttpClientModule,
                    CommonModule,
                    FormsModule,
                    NoopAnimationsModule,
                    AngularHalModule,
                    TranslateModule,
                    ReactiveFormsModule,
                    DataGridComponent,
                    SitmunFrontendCoreModule
                ]
            }]
    }], null, null); })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { DataGridComponent, SitmunFrontendGuiModule, BtnEditRenderedComponent };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0bXVuLWZyb250ZW5kLWd1aS5qcyIsInNvdXJjZXMiOlsiQHNpdG11bi9mcm9udGVuZC1ndWkvZGF0YS1ncmlkL2RhdGEtZ3JpZC5jb21wb25lbnQudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWd1aS9idG4tZWRpdC1yZW5kZXJlZC9idG4tZWRpdC1yZW5kZXJlZC5jb21wb25lbnQudHMiLCJAc2l0bXVuL2Zyb250ZW5kLWd1aS9zaXRtdW4tZnJvbnRlbmQtZ3VpLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDhCQTZHRTs0QkFqQ29CO0lBQW1CLDhCQUl4QixLQUFLO2FBQzJCLElBQUksR0FBRyxFQUErQjtNQU9oRSxLQUFLLCtCQUNWLEtBQUs7T0FzQm5CLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztFQUNqQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUMsU0FDOUI7O0VBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQyxTQUN0QyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztPQUN2QixJQUFJLENBQUMscUJBQXFCLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLFNBQ3JCLElBQUksQ0FBQztNQUFXLEdBQUcsY0FDakIsYUFBYSxFQUFFLGtCQUNiLFFBQVEsRUFBRSxJQUFJLGtCQUNkLElBQUksRUFBRSxDQUFDLGtCQUNQLE1BQU0sRUFBRSxJQUFJLGtCQUNaLFFBQVEsRUFBRSxJQUFJLGtCQUNkLFNBQVMsRUFBRSxFQUFDLGVBQWU7QUFBRSxTQUFTLEVBQUMsZUFDeEMsY0FDRDtLQUFXLEVBQUUsa0JBQ1g7RUFBVSxFQUFFLHNCQUNSO0tBQU0sRUFBRTtBQUFvQjtNQUM1QixZQUFZLEVBQUU7Ozs7OzhCQUNaLFVBQVUsQ0FBQztzQkFBeUIsRUFBRSxTQUFTLDZFQUM3QyxNQUFN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QUFBZ0M7bURBcEMvQixRQUFRLFNBQUMsa0JBQ1I7RUFBTyxFQUFFLHNCQUNQLFlBQVksc0JBQ1osZ0JBQWdCLHNCQUNoQixZQUFZLHNCQUNaLFdBQVcsc0JBQ1gsb0JBQW9CO29CQUNwQjtVQUFnQjtFQUNoQixtQkFBbUI7aUJBQ25CO2VBQXVCO0dBQ3ZCLFlBQVksQ0FBQztBQUFjLENBQUMsRUFBRSxDQUFDLHNCQUMvQjtpQkFBd0I7RUFDeEIsZUFBZSxzQkFDZjtPQUFhLG1CQUVkO01BQ0QsWUFBWSxFQUFFO2FBQ1o7R0FBaUIsc0JBQ2pCO29CQUF3QjtpQkFDekI7Y0FDRCxlQUFlO0NBQUUsRUFDaEIsa0JBQ0Q7SUFBUyxFQUFFLEVBQ1Y7Q0FDRCxPQUFPLEVBQUU7R0FDUCxnQkFBZ0I7R0FDaEIsWUFBWSxzQkFDWixXQUFXLHNCQUNYLG9CQUFvQixzQkFDcEIsZ0JBQWdCLHNCQUNoQixlQUFlLHNCQUNmLG1CQUFtQixzQkFDbkIsaUJBQWlCO2tCQUNqQjtnQkFBd0I7WUFDekI7S0FDRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBQ0s7QUFBQztBQUFDO0FBQUk7QUFFUDtBQUFrRTtBQUFJO0FBQUM7QUFBSTtBQUFrQztBQUFrRTtBQUFJO0FBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZ0dyaWRNb2R1bGUgfSBmcm9tICdAYWctZ3JpZC1jb21tdW5pdHkvYW5ndWxhcic7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBOZ01vZHVsZSwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgQWxsQ29tbXVuaXR5TW9kdWxlcywgQ29sdW1uQXBpLCBNb2R1bGUgfSBmcm9tICdAYWctZ3JpZC1jb21tdW5pdHkvYWxsLW1vZHVsZXMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtZGF0YS1ncmlkJyxcclxuICB0ZW1wbGF0ZTogYCAgICA8ZGl2IGlkPWdydXAxIGNsYXNzPVwiZWRpdERpdkJ0bnNcIj5cclxuICAgICAgICA8YnV0dG9uICBtYXQtbWluaS1mYWIgY2xhc3M9XCJlZGl0QnRuXCIgICpuZ0lmPVwiZGlzY2FyZENoYW5nZXNCdXR0b25cIiAgaWQ9XCJib3JyYXJDYW52aXNcIiB0eXBlPVwiYnV0dG9uXCIgIChjbGljayk9XCJkZWxldGVDaGFuZ2VzKClcIiBbZGlzYWJsZWRdPVwiY2hhbmdlQ291bnRlciA8PSAwXCI+XHJcbiAgICAgICAgICAgIDxtYXQtaWNvbiAgZm9udFNldD1cIm1hdGVyaWFsLWljb25zLXJvdW5kXCIgPiBjbG9zZSA8L21hdC1pY29uPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b24gbWF0LW1pbmktZmFiIGNsYXNzPVwiZWRpdEJ0blwiICpuZ0lmPVwidW5kb0J1dHRvblwiICBpZD1cInVuZG9cIiAgKGNsaWNrKT1cInVuZG8oKVwiIFtkaXNhYmxlZF09XCJjaGFuZ2VDb3VudGVyIDw9IDBcIiA+XHJcbiAgICAgICAgICAgIDxtYXQtaWNvbiBmb250U2V0PVwibWF0ZXJpYWwtaWNvbnMtcm91bmRcIiA+IHVuZG8gPC9tYXQtaWNvbj5cclxuICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8YnV0dG9uIG1hdC1taW5pLWZhYiBjbGFzcz1cImVkaXRCdG5cIiAqbmdJZj1cInJlZG9CdXR0b25cIiAgaWQ9XCJyZWRvXCIgIChjbGljayk9XCJyZWRvKClcIiBbZGlzYWJsZWRdPVwicmVkb0NvdW50ZXIgPD0gMFwiPlxyXG4gICAgICAgICAgICA8bWF0LWljb24gZm9udFNldD1cIm1hdGVyaWFsLWljb25zLXJvdW5kXCIgPiByZWRvIDwvbWF0LWljb24+XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPGJ1dHRvbiBtYXQtbWluaS1mYWIgY2xhc3M9XCJlZGl0QnRuXCIgKm5nSWY9XCJhcHBseUNoYW5nZXNCdXR0b25cIiAgaWQ9XCJhcGxpY2FyQ2FudmlzXCIgIChjbGljayk9XCJhcHBseUNoYW5nZXMoKVwiIFtkaXNhYmxlZF09XCJjaGFuZ2VDb3VudGVyIDw9IDBcIiA+XHJcbiAgICAgICAgICAgIDxtYXQtaWNvbiBmb250U2V0PVwibWF0ZXJpYWwtaWNvbnMtcm91bmRcIiA+IGNoZWNrIDwvbWF0LWljb24+XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGlkPWdydXAyIGNsYXNzPVwiYWN0aW9uc0RpdkJ0bnNcIiA+XHJcbiAgICAgICAgPGxhYmVsICpuZ0lmPVwiZ2xvYmFsU2VhcmNoXCIgW3RyYW5zbGF0ZV09XCInU2VhcmNoJ1wiPiA8L2xhYmVsPlxyXG4gICAgICAgIDxpbnB1dCAqbmdJZj1cImdsb2JhbFNlYXJjaFwidHlwZT1cInRleHRcIiBjbGFzcz1cInNlYXJjaEdlbmVyaWNJbnB1dFwiIHBsYWNlaG9sZGVyPVwiXCIgKGtleXVwKT1cInF1aWNrU2VhcmNoKClcIiBbKG5nTW9kZWwpXT1cInNlYXJjaFZhbHVlXCIgbWwtMiA+XHJcbiAgICAgICAgPGJ1dHRvbiAqbmdJZj1cImRlbGV0ZUJ1dHRvblwiICBtYXQtc3Ryb2tlZC1idXR0b24gaWQ9XCJib3RvRWxpbWluYVwiICAoY2xpY2spPVwicmVtb3ZlRGF0YSgpXCI+XHJcbiAgICAgICAgICAgIDxtYXQtaWNvbiBmb250U2V0PVwibWF0ZXJpYWwtaWNvbnMtcm91bmRcIiA+IGRlbGV0ZSA8L21hdC1pY29uPlxyXG4gICAgICAgICAgICA8c3BhbiAgW3RyYW5zbGF0ZV09XCInUmVtb3ZlJ1wiPiA8L3NwYW4+XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b24gICpuZ0lmPVwibmV3QnV0dG9uXCIgbWF0LXN0cm9rZWQtYnV0dG9uIGlkPVwiYm90b05vdVwiICAoY2xpY2spPVwibmV3RGF0YSgpXCI+XHJcbiAgICAgICAgICAgIDxtYXQtaWNvbiBmb250U2V0PVwibWF0ZXJpYWwtaWNvbnMtcm91bmRcIj4gYWRkX2NpcmNsZV9vdXRsaW5lIDwvbWF0LWljb24+ICAgICAgXHJcbiAgICAgICAgICAgIDxzcGFuICBbdHJhbnNsYXRlXT1cIidOZXcnXCI+IDwvc3Bhbj4gICAgICAgICAgIFxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG5cclxuXHJcbiAgICAgICAgXHJcbiAgICA8L2Rpdj5cclxuXHJcblxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBzdHlsZT1cIiBoZWlnaHQ6IDEwMCVcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiYWctdGhlbWUtYWxwaW5lXCIgaWQ9XCJteUdyaWRcIiBzdHlsZT1cIiB3aWR0aDoxMDAlOyBoZWlnaHQ6IDEwMCVcIiA+XHJcbiAgICAgICAgICAgIDxhZy1ncmlkLWFuZ3VsYXJcclxuICAgICAgICAgICAgc3R5bGU9XCIgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTtcIlxyXG4gICAgICAgICAgICBjbGFzcz1cImFnLXRoZW1lLWFscGluZVwiXHJcbiAgICAgICAgICAgIFtmbG9hdGluZ0ZpbHRlcl09XCJ0cnVlXCJcclxuICAgICAgICAgICAgW3Jvd0RhdGFdPVwicm93RGF0YVwiXHJcbiAgICAgICAgICAgIFtjb2x1bW5EZWZzXT1cImNvbHVtbkRlZnNcIlxyXG4gICAgICAgICAgICBbZ3JpZE9wdGlvbnNdPVwiZ3JpZE9wdGlvbnNcIlxyXG4gICAgICAgICAgICBbYW5pbWF0ZVJvd3NdPVwidHJ1ZVwiXHJcbiAgICAgICAgICAgIFtwYWdpbmF0aW9uXT1cImZhbHNlXCJcclxuICAgICAgICAgICAgW21vZHVsZXNdPVwibW9kdWxlc1wiICAgICBcclxuICAgICAgICAgICAgW3VuZG9SZWRvQ2VsbEVkaXRpbmddPVwidHJ1ZVwiICAgIFxyXG4gICAgICAgICAgICBbdW5kb1JlZG9DZWxsRWRpdGluZ0xpbWl0XT0gMjAwXHJcbiAgICAgICAgICAgIFtzdXBwcmVzc1Jvd0NsaWNrU2VsZWN0aW9uXT10cnVlXHJcbiAgICAgICAgICAgIFtlbmFibGVDZWxsQ2hhbmdlRmxhc2hdPXRydWVcclxuICAgICAgICAgICAgW2ZyYW1ld29ya0NvbXBvbmVudHNdPVwiZnJhbWV3b3JrQ29tcG9uZW50c1wiXHJcbiAgICAgICAgICAgIHJvd1NlbGVjdGlvbj1cIm11bHRpcGxlXCJcclxuICAgICAgICAgICAgKGZpbHRlck1vZGlmaWVkKT1cIm9uRmlsdGVyTW9kaWZpZWQoKVwiXHJcbiAgICAgICAgICAgIChjZWxsRWRpdGluZ1N0b3BwZWQpID1cIm9uQ2VsbEVkaXRpbmdTdG9wcGVkKCRldmVudClcIlxyXG4gICAgICAgICAgICAoY2VsbFZhbHVlQ2hhbmdlZCk9XCJvbkNlbGxWYWx1ZUNoYW5nZWQoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgIChncmlkUmVhZHkpPVwib25HcmlkUmVhZHkoJGV2ZW50KVwiPlxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgPC9hZy1ncmlkLWFuZ3VsYXI+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcblxyXG5gLFxyXG4gIHN0eWxlczogW2BpbnB1dCxsYWJlbHtkaXNwbGF5OmlubGluZS1ibG9jazttYXJnaW46NXB4IDVweCA1cHggMTBweH0jYm90b05vdXtjb2xvcjojZmZmO2JhY2tncm91bmQ6bm8tcmVwZWF0IHBhZGRpbmctYm94ICM2OGEyMjU7bWFyZ2luLWxlZnQ6M3B4fSNib3RvRWxpbWluYXtiYWNrZ3JvdW5kOm5vLXJlcGVhdCBwYWRkaW5nLWJveCAjZmZmO21hcmdpbi1sZWZ0OjNweH0jYXBsaWNhckNhbnZpc3tjb2xvcjojZmZmIWltcG9ydGFudDtiYWNrZ3JvdW5kOm5vLXJlcGVhdCBwYWRkaW5nLWJveCAjNjhhMjI1O21hcmdpbi1sZWZ0OjNweH0jYXBsaWNhckNhbnZpc1tkaXNhYmxlZF17YmFja2dyb3VuZDpuby1yZXBlYXQgcGFkZGluZy1ib3ggIzgzOTc2Y30jcmVkbywjdW5kb3tjb2xvcjojZmZmIWltcG9ydGFudDtiYWNrZ3JvdW5kOiNmZjkzMDA7bWFyZ2luLWxlZnQ6M3B4fSNyZWRvW2Rpc2FibGVkXSwjdW5kb1tkaXNhYmxlZF17YmFja2dyb3VuZDojZmZjOTdmO21hcmdpbi1sZWZ0OjNweH0jYm9ycmFyQ2Fudmlze2NvbG9yOiNmZmYhaW1wb3J0YW50O2JhY2tncm91bmQ6I2RmMzEzM30jYm9ycmFyQ2FudmlzW2Rpc2FibGVkXXtjb2xvcjojZmZmIWltcG9ydGFudDtiYWNrZ3JvdW5kOiNkYThjOGV9LmVkaXREaXZCdG5ze3RleHQtYWxpZ246c3RhcnQ7d2lkdGg6MjAlO2hlaWdodDozMHB4IWltcG9ydGFudDtsaW5lLWhlaWdodDozMHB4IWltcG9ydGFudH0uYWN0aW9uc0RpdkJ0bnN7dGV4dC1hbGlnbjplbmQ7d2lkdGg6ODAlO2hlaWdodDo2MHB4fS5hY3Rpb25zRGl2QnRucywuZWRpdERpdkJ0bnN7ZGlzcGxheTppbmxpbmUtYmxvY2shaW1wb3J0YW50fS5hY3Rpb25zRGl2QnRucyAubWF0LXN0cm9rZWQtYnV0dG9ue3BhZGRpbmc6NXB4IDIwcHghaW1wb3J0YW50fS5lZGl0RGl2QnRucyAubWF0LW1pbmktZmFiIC5tYXQtYnV0dG9uLXdyYXBwZXJ7cGFkZGluZzppbmhlcml0IWltcG9ydGFudDtkaXNwbGF5OmluaGVyaXQhaW1wb3J0YW50fS5lZGl0RGl2QnRucyAubWF0LWljb257aGVpZ2h0OjMwcHghaW1wb3J0YW50O2JvdHRvbTo1cHg7cG9zaXRpb246cmVsYXRpdmV9LmVkaXREaXZCdG5zIC5tYXQtbWluaS1mYWJ7d2lkdGg6MzBweDtoZWlnaHQ6MzBweH0uYWN0aW9uc0RpdkJ0bnMgLnNlYXJjaEdlbmVyaWNJbnB1dHtoZWlnaHQ6NDVweCFpbXBvcnRhbnQ7d2lkdGg6NTAlIWltcG9ydGFudH0uYWctYm9keS12aWV3cG9ydC5hZy1sYXlvdXQtbm9ybWFsIDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWJ7YmFja2dyb3VuZDojZWVlfcOiwoDCiyAuYWctYm9keS12aWV3cG9ydC5hZy1sYXlvdXQtbm9ybWFsIDo6LXdlYmtpdC1zY3JvbGxiYXJ7d2lkdGg6MmVtO2hlaWdodDoyZW19LmFnLWJvZHktdmlld3BvcnQuYWctbGF5b3V0LW5vcm1hbCA6Oi13ZWJraXQtc2Nyb2xsYmFyLWJ1dHRvbntiYWNrZ3JvdW5kOiNjY2N9LmFnLWJvZHktdmlld3BvcnQuYWctbGF5b3V0LW5vcm1hbDo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2stcGllY2V7YmFja2dyb3VuZDojODg4fWBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEYXRhR3JpZENvbXBvbmVudCB7XHJcbiBcclxuXHJcbiAgbW9kdWxlczogTW9kdWxlW10gPSBBbGxDb21tdW5pdHlNb2R1bGVzO1xyXG4gIHNlYXJjaFZhbHVlOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBncmlkQXBpO1xyXG4gIHByaXZhdGUgZ3JpZENvbHVtbkFwaTtcclxuICBzdGF0dXNDb2x1bW4gPSBmYWxzZTtcclxuICBjaGFuZ2VzTWFwOiBNYXA8bnVtYmVyLCBNYXA8c3RyaW5nLCBudW1iZXI+PiA9IG5ldyBNYXA8bnVtYmVyLCBNYXA8c3RyaW5nLCBudW1iZXI+PigpO1xyXG4gICAvLyBHdWFyZGFyZW1vcyBpZCBkZSBsYXMgY2VsYXMgbW9kaWZpY2FkYXMgaSBlbCBuw4LCuiBkZSBlZGljaW9uZXMgaGVjaGFzIHNvYnJlIGVzdGFzXHJcbiAgcHJpdmF0ZSBwYXJhbXM7IC8vIFBhcmFtZXRyb3MgZGVsIGdyaWQgZW4gbGEgdWx0aW1hIG1vZGlmaWNhY2lvbiBoZWNoYSAocG9yIHNpIGhhY2Vtb3MgYXBwbHkgY2hhbmdlcylcclxuICByb3dEYXRhOiBhbnlbXTtcclxuICBjaGFuZ2VDb3VudGVyOiBudW1iZXI7IC8vIE51bWVybyBkZSBlZGljaW9uZXMgaGVjaGFzIHNvYnJlIGxhcyBjZWxhc1xyXG4gIHByZXZpb3VzQ2hhbmdlQ291bnRlcjogbnVtYmVyOyAvLyAgTnVtZXJvIGRlIGVkaWNpb25lcyBxdWUgaGFiaWEgYW50ZXMgZGUgaGFjZXIgbGEgdWx0aW1hIG1vZGlmaWNhY2lvbiAoY2hhbmdlQ291bnRlcilcclxuICByZWRvQ291bnRlcjogbnVtYmVyOyAvLyBOdW1lcm8gZGUgcmVkbyBxdWUgcG9kZW1vcyBoYWNlclxyXG4gIG1vZGlmaWNhdGlvbkNoYW5nZSA9IGZhbHNlO1xyXG4gIHVuZG9Ob0NoYW5nZXMgPSBmYWxzZTsgLy8gQm9vbGVhbm8gcGFyYSBzYWJlciBzaSBlcyB1biB1bmRvIHByb3ZvY2FkbyBwb3IgdW4gY2FtYmlvIHNpbiBtb2RpZmljYWNpb25lc1xyXG4gIGdyaWRPcHRpb25zO1xyXG4gIEBJbnB1dCgpIGZyYW1ld29ya0NvbXBvbmVudHM6IGFueTtcclxuICBASW5wdXQoKSBjb2x1bW5EZWZzOiBhbnlbXTtcclxuICBASW5wdXQoKSBnZXRBbGw6ICgpID0+IE9ic2VydmFibGU8YW55PjtcclxuICBASW5wdXQoKSBkaXNjYXJkQ2hhbmdlc0J1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSB1bmRvQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHJlZG9CdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYXBwbHlDaGFuZ2VzQnV0dG9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGRlbGV0ZUJ1dHRvbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBuZXdCdXR0b246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgZ2xvYmFsU2VhcmNoOiBib29sZWFuO1xyXG5cclxuXHJcblxyXG4gIEBPdXRwdXQoKSByZW1vdmU6IEV2ZW50RW1pdHRlcjxhbnlbXT47XHJcbiAgQE91dHB1dCgpIG5ldzogRXZlbnRFbWl0dGVyPG51bWJlcj47XHJcbiAgQE91dHB1dCgpIHNlbmRDaGFuZ2VzOiBFdmVudEVtaXR0ZXI8YW55W10+O1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgdGhpcy5yZW1vdmUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLm5ldyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuc2VuZENoYW5nZXMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmNoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5wcmV2aW91c0NoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5yZWRvQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLmdyaWRPcHRpb25zID0ge1xyXG4gICAgICBkZWZhdWx0Q29sRGVmOiB7XHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZmxleDogMSxcclxuICAgICAgICBmaWx0ZXI6IHRydWUsXHJcbiAgICAgICAgZWRpdGFibGU6IHRydWUsXHJcbiAgICAgICAgY2VsbFN0eWxlOiB7YmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRid9LFxyXG4gICAgICB9LFxyXG4gICAgICBjb2x1bW5UeXBlczoge1xyXG4gICAgICAgIGRhdGVDb2x1bW46IHtcclxuICAgICAgICAgICAgZmlsdGVyOiAnYWdEYXRlQ29sdW1uRmlsdGVyJyxcclxuICAgICAgICAgICAgZmlsdGVyUGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgY29tcGFyYXRvcihmaWx0ZXJMb2NhbERhdGVBdE1pZG5pZ2h0LCBjZWxsVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVDZWxsVmFsdWUgPSBuZXcgRGF0ZShjZWxsVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0ZUZpbHRlciA9IG5ldyBEYXRlKGZpbHRlckxvY2FsRGF0ZUF0TWlkbmlnaHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkYXRlQ2VsbFZhbHVlLmdldFRpbWUoKSA8IGRhdGVGaWx0ZXIuZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0ZUNlbGxWYWx1ZS5nZXRUaW1lKCkgID4gZGF0ZUZpbHRlci5nZXRUaW1lKCkpIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdXBwcmVzc01lbnU6IHRydWVcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgICByb3dTZWxlY3Rpb246ICdtdWx0aXBsZScsXHJcbiAgICAgIHNpbmdsZUNsaWNrRWRpdDogdHJ1ZSxcclxuICAgICAgLy8gc3VwcHJlc3NIb3Jpem9udGFsU2Nyb2xsOiB0cnVlLFxyXG5cclxuICAgIH07XHJcblxyXG4gIH1cclxuXHJcblxyXG5cclxuICBvbkdyaWRSZWFkeShwYXJhbXMpOiB2b2lke1xyXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcbiAgICB0aGlzLmdyaWRBcGkgPSBwYXJhbXMuYXBpO1xyXG4gICAgdGhpcy5ncmlkQ29sdW1uQXBpID0gcGFyYW1zLmNvbHVtbkFwaTtcclxuICAgIHRoaXMuZ2V0RWxlbWVudHMoKTtcclxuICAgIHRoaXMuZ3JpZEFwaS5zaXplQ29sdW1uc1RvRml0KCk7XHJcbiAgICBmb3IgKGNvbnN0IGNvbCBvZiB0aGlzLmNvbHVtbkRlZnMpIHtcclxuICAgICAgaWYgKGNvbC5maWVsZCA9PT0gJ2VzdGF0Jykge1xyXG4gICAgICAgIHRoaXMuc3RhdHVzQ29sdW1uID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gXHJcbiAgIFxyXG5cclxuICB9XHJcblxyXG4gIHF1aWNrU2VhcmNoKCk6IHZvaWR7XHJcbiAgICAgIHRoaXMuZ3JpZEFwaS5zZXRRdWlja0ZpbHRlcih0aGlzLnNlYXJjaFZhbHVlKTtcclxuICB9XHJcblxyXG4gIGdldEVsZW1lbnRzKCk6IHZvaWRcclxuICB7XHJcbiAgICB0aGlzLmdldEFsbCgpXHJcbiAgICAuc3Vic2NyaWJlKChpdGVtcykgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGl0ZW1zKTtcclxuICAgICAgICB0aGlzLnJvd0RhdGEgPSBpdGVtcztcclxuICAgICAgICBzZXRUaW1lb3V0KCgpPT57dGhpcy5ncmlkQXBpLnNpemVDb2x1bW5zVG9GaXQoKX0sIDMwKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlRGF0YSgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ3JpZEFwaS5zdG9wRWRpdGluZyhmYWxzZSk7XHJcbiAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gdGhpcy5ncmlkQXBpLmdldFNlbGVjdGVkTm9kZXMoKTtcclxuICAgIGNvbnN0IHNlbGVjdGVkRGF0YSA9IHNlbGVjdGVkTm9kZXMubWFwKG5vZGUgPT4gbm9kZS5kYXRhKTtcclxuICAgIHRoaXMucmVtb3ZlLmVtaXQoc2VsZWN0ZWREYXRhKTtcclxuXHJcbiAgICBpZih0aGlzLnN0YXR1c0NvbHVtbilcclxuICAgIHtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRSb3dzID0gc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiBub2RlLnJvd0luZGV4KTtcclxuXHJcbiAgICAgIGZvciAoY29uc3QgaWQgb2Ygc2VsZWN0ZWRSb3dzKXtcclxuICAgICAgICAgIHRoaXMuZ3JpZEFwaS5nZXRSb3dOb2RlKGlkKS5kYXRhLmVzdGF0ID0nRWxpbWluYXQnO1xyXG4gICAgICAgIH1cclxuICAgICAgdGhpcy5ncmlkT3B0aW9ucy5hcGkucmVmcmVzaENlbGxzKCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmdyaWRPcHRpb25zLmFwaS5kZXNlbGVjdEFsbCgpO1xyXG4gIH1cclxuXHJcbiAgbmV3RGF0YSgpOiB2b2lkXHJcbiAge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIHRoaXMubmV3LmVtaXQoLTEpO1xyXG4gIH1cclxuXHJcblxyXG4gIGFwcGx5Q2hhbmdlcygpOiB2b2lkXHJcbiAge1xyXG4gICAgY29uc3QgaXRlbXNDaGFuZ2VkOiBhbnlbXSA9IFtdO1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIGZvciAoY29uc3Qga2V5IG9mIHRoaXMuY2hhbmdlc01hcC5rZXlzKCkpXHJcbiAgICB7XHJcbiAgICAgIGl0ZW1zQ2hhbmdlZC5wdXNoKHRoaXMuZ3JpZEFwaS5nZXRSb3dOb2RlKGtleSkuZGF0YSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnNlbmRDaGFuZ2VzLmVtaXQoaXRlbXNDaGFuZ2VkKTtcclxuICAgIHRoaXMuY2hhbmdlc01hcC5jbGVhcigpO1xyXG4gICAgdGhpcy5jaGFuZ2VDb3VudGVyID0gMDtcclxuICAgIHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyID0gMDtcclxuICAgIHRoaXMucmVkb0NvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5wYXJhbXMuY29sRGVmLmNlbGxTdHlsZSA9ICB7YmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRid9O1xyXG4gICAgdGhpcy5ncmlkQXBpLnJlZHJhd1Jvd3MoKTtcclxuICB9XHJcblxyXG5cclxuXHJcbiAgZGVsZXRlQ2hhbmdlcygpOiB2b2lkXHJcbiAge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoYW5nZUNvdW50ZXI7IGkrKylcclxuICAgIHtcclxuICAgICAgdGhpcy5ncmlkQXBpLnVuZG9DZWxsRWRpdGluZygpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jaGFuZ2VzTWFwLmNsZWFyKCk7XHJcbiAgICB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLmNoYW5nZUNvdW50ZXIgPSAwO1xyXG4gICAgdGhpcy5yZWRvQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLnBhcmFtcy5jb2xEZWYuY2VsbFN0eWxlID0gIHtiYWNrZ3JvdW5kQ29sb3I6ICcjRkZGRkZGJ307XHJcbiAgICB0aGlzLmdyaWRBcGkucmVkcmF3Um93cygpO1xyXG4gIH1cclxuXHJcblxyXG4gIG9uRmlsdGVyTW9kaWZpZWQoKTogdm9pZHtcclxuICAgIHRoaXMuZGVsZXRlQ2hhbmdlcygpO1xyXG4gIH1cclxuXHJcblxyXG4gIHVuZG8oKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyaWRBcGkuc3RvcEVkaXRpbmcoZmFsc2UpO1xyXG4gICAgdGhpcy5ncmlkQXBpLnVuZG9DZWxsRWRpdGluZygpO1xyXG4gICAgdGhpcy5jaGFuZ2VDb3VudGVyIC09IDE7XHJcbiAgICB0aGlzLnJlZG9Db3VudGVyICs9IDE7XHJcbiAgfVxyXG5cclxuICByZWRvKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkQXBpLnN0b3BFZGl0aW5nKGZhbHNlKTtcclxuICAgIHRoaXMuZ3JpZEFwaS5yZWRvQ2VsbEVkaXRpbmcoKTtcclxuICAgIHRoaXMuY2hhbmdlQ291bnRlciArPSAxO1xyXG4gICAgdGhpcy5yZWRvQ291bnRlciAtPSAxO1xyXG4gIH1cclxuXHJcblxyXG4gIG9uQ2VsbEVkaXRpbmdTdG9wcGVkKGUpXHJcbiAge1xyXG4gICAgICBpZiAodGhpcy5tb2RpZmljYXRpb25DaGFuZ2UpXHJcbiAgICAgIHtcclxuICAgICAgICB0aGlzLmNoYW5nZUNvdW50ZXIrKztcclxuICAgICAgICB0aGlzLnJlZG9Db3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLm9uQ2VsbFZhbHVlQ2hhbmdlZChlKTtcclxuICAgICAgICB0aGlzLm1vZGlmaWNhdGlvbkNoYW5nZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgb25DZWxsVmFsdWVDaGFuZ2VkKHBhcmFtcyk6IHZvaWR7XHJcblxyXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7IC8vIEd1YXJkYXJlbW9zIGxvcyBwYXJhbWV0cm9zIHBvciBzaSBoYXkgcXVlIGhhY2VyIHVuIGFwcGx5IGNoYW5nZXNcclxuICAgIGlmICh0aGlzLmNoYW5nZUNvdW50ZXIgPiB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlcilcclxuICAgICAgLy8gRXN0YSBjb25kaWNpw4PCs24gc2Vyw4PCoSBjaWVydGEgc2kgdmVuaW1vcyBkZSBlZGl0YXIgbGEgY2VsYSBvIGRlIGhhY2VyIHVuIHJlZG9cclxuICAgICAge1xyXG5cclxuICAgICAgICBpZiAocGFyYW1zLm9sZFZhbHVlICE9PSBwYXJhbXMudmFsdWUgJiYgIShwYXJhbXMub2xkVmFsdWUgPT0gbnVsbCAmJiBwYXJhbXMudmFsdWUgPT09ICcnKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmICghIHRoaXMuY2hhbmdlc01hcC5oYXMocGFyYW1zLm5vZGUuaWQpKSAvLyBTaSBubyBoYWJpYW1vcyBlZGl0YWRvIGxhIGNlbGEgY29uIGFudGVyaW9yaWRhZCwgbGEgYcODwrFhZGltb3MgYWwgbWFwIHkgbGEgcGludGFtb3MgZGUgdmVyZGVcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgYWRkTWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcclxuICAgICAgICAgICAgYWRkTWFwLnNldChwYXJhbXMuY29sRGVmLmZpZWxkLCAxKVxyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuc2V0KHBhcmFtcy5ub2RlLmlkLCBhZGRNYXApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgaWYgKCEgdGhpcy5jaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkuaGFzKHBhcmFtcy5jb2xEZWYuZmllbGQpKVxyXG4gICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAgIHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLnNldChwYXJhbXMuY29sRGVmLmZpZWxkLCAxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAvLyBTaSB5YSBoYWLDg8KtYW1vcyBtb2RpZmljYWRvIGxhIGNlbGEsIGF1bWVudGFtb3MgZWwgbnVtZXJvIGRlIGNhbWJpb3MgZW4gZXN0YVxyXG4gICAgICAgICAgICAgY29uc3QgY3VycmVudENoYW5nZXMgPSB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5nZXQocGFyYW1zLmNvbERlZi5maWVsZCk7XHJcbiAgICAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5zZXQocGFyYW1zLmNvbERlZi5maWVsZCwgKGN1cnJlbnRDaGFuZ2VzICsgMSkpO1xyXG4gICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnBhaW50Q2VsbHMocGFyYW1zLCB0aGlzLmNoYW5nZXNNYXApOyAvLyBDb20gaGEgZXN0YWRvIG1vZGlmaWNhZGEgbGEgbGluaWEsIGxhIHBpbnRhbW9zIGRlIHZlcmRlXHJcbiAgICAgICAgICB0aGlzLnByZXZpb3VzQ2hhbmdlQ291bnRlcisrOyAvL0lndWFsYW1vcyBlbCBjb250YWRvciBkZSBjYW1iaW9zIGFudGVyaW9yIGFsIGFjdHVhbFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH1cclxuICAgIGVsc2UgaWYgKHRoaXMuY2hhbmdlQ291bnRlciA8IHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyKXsgLy8gRW50cmFyw4PCoSBhcXXDg8KtIHNpIGhlbW9zIGhlY2hvIHVuIHVuZG9cclxuICAgICAgICBsZXQgY3VycmVudENoYW5nZXMgPSAtMTtcclxuICAgICAgICBpZiAodGhpcy5jaGFuZ2VzTWFwLmhhcyhwYXJhbXMubm9kZS5pZCkpIHtjdXJyZW50Q2hhbmdlcyA9IHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLmdldChwYXJhbXMuY29sRGVmLmZpZWxkKTt9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGN1cnJlbnRDaGFuZ2VzID09PSAxKSB7IC8vQWwgZGVzaGFjZXIgZWwgY2FtYmlvLCBsYSBkZWphcmVtb3MgZW4gc3UgZXN0YWRvIGluaWNpYWxcclxuXHJcbiAgICAgICAgICB0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5kZWxldGUocGFyYW1zLmNvbERlZi5maWVsZCk7XHJcbiAgICAgICAgICBpZih0aGlzLmNoYW5nZXNNYXAuZ2V0KHBhcmFtcy5ub2RlLmlkKS5zaXplID09PSAwKSB7IC8vIE5vIGhheSBtYXMgbW9kaWZpY2FjaW9uZXMgZW4gZXRhIGZpbGFcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VzTWFwLmRlbGV0ZShwYXJhbXMubm9kZS5pZCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuZ3JpZEFwaS5nZXREaXNwbGF5ZWRSb3dBdEluZGV4KHBhcmFtcy5yb3dJbmRleCk7XHJcblxyXG4gICAgICAgICAgICAvLyBTaSBzb2xvIHRpZW5lIHVuYSBtb2RpZmljYWNpb24sIHF1aWVyZSBkZWNpciBxdWUgbGEgY2VsYSBlc3TDg8KhIGVuIHN1IGVzdGFkbyBpbmljaWFsLCBwb3IgbG8gcXVlIGxhIHBpbnRhbW9zIGRlIGJsYW5jb1xyXG4gICAgICAgICAgICB0aGlzLmdyaWRBcGkucmVkcmF3Um93cyh7cm93Tm9kZXM6IFtyb3ddfSk7XHJcblxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRoaXMucGFpbnRDZWxscyhwYXJhbXMsIHRoaXMuY2hhbmdlc01hcCk7XHJcbiAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY3VycmVudENoYW5nZXMgPjEpIC8vIExhIGNlbGEgYcODwrpuIG5vIGVzdMODwqEgZW4gc3UgZXN0YWRvIGluaWNpYWwsIHBvciBsbyBxdWUgc2VnZ3VpcsODwqEgdmVyZGVcclxuICAgICAgICB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm8gcG9kZW1vcyBoYWNlciBlbHNlIHBvciBzaSBoYWNlbW9zIHVuIHVuZG8gZGUgdW5hIGNlbGEgc2luIGNhbWJpb3NcclxuICAgICAgICAgIHRoaXMuY2hhbmdlc01hcC5nZXQocGFyYW1zLm5vZGUuaWQpLnNldChwYXJhbXMuY29sRGVmLmZpZWxkLCAoY3VycmVudENoYW5nZXMgLSAxKSk7XHJcblxyXG4gICAgICAgICAgdGhpcy5wYWludENlbGxzKHBhcmFtcywgdGhpcy5jaGFuZ2VzTWFwKTsvLyBDb21vIGF1biB0aWVuZSBjYW1iaW9zLCBlbCBiYWNrZ3JvdW5kIHRpZW5lIHF1ZSBzZWd1aXIgdmVyZGVcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucHJldmlvdXNDaGFuZ2VDb3VudGVyLS07ICAvLyBDb20gdmVuaWVtIGQndW5kbywgaGVtIGRlIGRlY3JlbWVudGFyIGVsIGNvbXB0YWRvciBkZSBjYW52aXNBbnRlcmlvclxyXG4gICAgfVxyXG4gICAgZWxzZXsgLy8gQ29udHJvbCBkZSBtb2RpZmljYWNpb25lcyBlbiBibGFuY29cclxuICAgICAgaWYocGFyYW1zLm9sZFZhbHVlICE9PSBwYXJhbXMudmFsdWUgJiYgIShwYXJhbXMub2xkVmFsdWUgPT0gbnVsbCAmJiBwYXJhbXMudmFsdWUgPT09ICcnKSApIC8vIE5vIGVzIG1vZGlmaWNhY2lvbiBlbiBibGFuY29cclxuICAgICAge1xyXG4gICAgICAgIHRoaXMubW9kaWZpY2F0aW9uQ2hhbmdlID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBlbHNleyBcclxuICAgICAgICBpZiAoIHRoaXMuY2hhbmdlc01hcC5oYXMocGFyYW1zLm5vZGUuaWQpKSAvLyBNb2RpZmljYWNpb24gZW4gYmxhbmNvIHNvYnJlIHVuYSBjZWxhIG1vZGlmaWNhZGFcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZighdGhpcy51bmRvTm9DaGFuZ2VzKVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmdyaWRBcGkudW5kb0NlbGxFZGl0aW5nKCk7IC8vIFVuZG8gcGFyYSBkZXNoYWNlciBlbCBjYW1iaW8gc2luIG1vZGlmaWNhY2lvbmVzIGludGVybmFtZW50ZVxyXG4gICAgICAgICAgICB0aGlzLnVuZG9Ob0NoYW5nZXMgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnBhaW50Q2VsbHMocGFyYW1zLCB0aGlzLmNoYW5nZXNNYXApOyAgLy8gQ29tbyBhdW4gdGllbmUgbW9kaWZpY2FjaW9uZXMsIGVsIGJhY2tncm91bmQgc2lndWUgc2llbmRvIHZlcmRlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHsgdGhpcy51bmRvTm9DaGFuZ2VzID0gZmFsc2U7IH1cclxuXHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIC8vIENvbW8gYWwgaGFjZXIgdW5kbyB2b2x2ZXLDg8KhIGEgZW50cmFyIGEgZXN0YSBtaXNtYSBmdW5jacODwrNuLCBoYXkgcXVlIGVudmlhcmxvIGEgc3UgaWYgY29ycmVzcG9uZGllbnRlXHJcbiAgICAgICAgICBpZighdGhpcy51bmRvTm9DaGFuZ2VzKVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmdyaWRBcGkudW5kb0NlbGxFZGl0aW5nKCk7IC8vIFVuZG8gcGFyYSBkZXNoYWNlciBlbCBjYW1iaW8gc2luIG1vZGlmaWNhY2lvbmVzIGludGVybmFtZW50ZVxyXG4gICAgICAgICAgICB0aGlzLnVuZG9Ob0NoYW5nZXMgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7IHRoaXMudW5kb05vQ2hhbmdlcyA9IGZhbHNlOyB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldENvbHVtbkluZGV4QnlDb2xJZChhcGk6IENvbHVtbkFwaSwgY29sSWQ6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gYXBpLmdldEFsbENvbHVtbnMoKS5maW5kSW5kZXgoY29sID0+IGNvbC5nZXRDb2xJZCgpID09PSBjb2xJZCk7XHJcbiAgfVxyXG4gIHBhaW50Q2VsbHMocGFyYW1zOiBhbnksICBjaGFuZ2VzTWFwOiBNYXA8bnVtYmVyLCBNYXA8c3RyaW5nLCBudW1iZXI+PiwgKVxyXG4gIHtcclxuICAgIGNvbnN0IHJvdyA9IHRoaXMuZ3JpZEFwaS5nZXREaXNwbGF5ZWRSb3dBdEluZGV4KHBhcmFtcy5yb3dJbmRleCk7XHJcblxyXG4gICAgdGhpcy5jaGFuZ2VDZWxsU3R5bGVDb2x1bW5zKHBhcmFtcyxjaGFuZ2VzTWFwLCcjRThGMURFJyk7XHJcbiAgICB0aGlzLmdyaWRBcGkucmVkcmF3Um93cyh7cm93Tm9kZXM6IFtyb3ddfSk7XHJcbiAgICB0aGlzLmNoYW5nZUNlbGxTdHlsZUNvbHVtbnMocGFyYW1zLGNoYW5nZXNNYXAsJyNGRkZGRkYnKTsgXHJcbiAgICAvLyBEZWZpbmlyZW1vcyBlbCBjZWxsU3R5bGUgYmxhbmNvIHBhcmEgZnV0dXJhcyBtb2RpZmljYWNpb25lcyBpbnRlcm5hcyAoZWo6IGZpbHRybylcclxuICB9XHJcblxyXG4gIGNoYW5nZUNlbGxTdHlsZUNvbHVtbnMocGFyYW1zOiBhbnksIGNoYW5nZXNNYXA6IE1hcDxudW1iZXIsIE1hcDxzdHJpbmcsIG51bWJlcj4+LCBjb2xvcjogc3RyaW5nKXtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBjaGFuZ2VzTWFwLmdldChwYXJhbXMubm9kZS5pZCkua2V5cygpKVxyXG4gICAge1xyXG4gICAgICBjb25zdCBjb2x1bW5OdW1iZXIgPSB0aGlzLmdldENvbHVtbkluZGV4QnlDb2xJZCh0aGlzLmdyaWRDb2x1bW5BcGksIGtleSk7XHJcbiAgICAgIHRoaXMuZ3JpZENvbHVtbkFwaS5jb2x1bW5Db250cm9sbGVyLmdyaWRDb2x1bW5zW2NvbHVtbk51bWJlcl0uY29sRGVmLmNlbGxTdHlsZSA9IHtiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yfTtcclxuICAgIH1cclxuXHJcblxyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgSUNlbGxSZW5kZXJlckFuZ3VsYXJDb21wIH0gZnJvbSAnQGFnLWdyaWQtY29tbXVuaXR5L2FuZ3VsYXInO1xuaW1wb3J0IHsgQ29tcG9uZW50LCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLWJ0bi1lZGl0LXJlbmRlcmVkJyxcbiAgdGVtcGxhdGU6IGA8YnV0dG9uIG1hdC1taW5pLWZhYiBjbGFzcz1cImJ1dHRvbkVkaXRcIiAgdHlwZT1cImJ1dHRvblwiICAoY2xpY2spPVwiYnRuQ2xpY2tlZEhhbmRsZXIoJGV2ZW50KVwiID5cbiAgPG1hdC1pY29uIGNsYXNzPVwiaWNvbkVkaXRcIiAgIGZvbnRTZXQ9XCJtYXRlcmlhbC1pY29ucy1yb3VuZFwiID4gZWRpdCA8L21hdC1pY29uPlxuPC9idXR0b24+IGAsXG4gIHN0eWxlczogW2AuYnV0dG9uRWRpdHtjb2xvcjojMDAwO2JhY2tncm91bmQtY29sb3I6I2RkZDt3aWR0aDoyNHB4O2hlaWdodDoyNHB4fS5pY29uRWRpdHtmb250LXNpemU6MTZweDttYXJnaW4tdG9wOi04cHh9YF1cbn0pXG5leHBvcnQgY2xhc3MgQnRuRWRpdFJlbmRlcmVkQ29tcG9uZW50IGltcGxlbWVudHMgSUNlbGxSZW5kZXJlckFuZ3VsYXJDb21wLCBPbkRlc3Ryb3kge1xuXG4gIHB1YmxpYyBwYXJhbXM6IGFueTtcblxuICBhZ0luaXQocGFyYW1zOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgfVxuXG4gIHJlZnJlc2gocGFyYW1zOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGJ0bkNsaWNrZWRIYW5kbGVyKCRldmVudCkge1xuICAgIHRoaXMucGFyYW1zLmNsaWNrZWQodGhpcy5wYXJhbXMudmFsdWUpO1xuICB9XG5cbiAgZ2V0UGFyYW1zKCl7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgLy8gbm8gbmVlZCB0byByZW1vdmUgdGhlIGJ1dHRvbiBjbGljayBoYW5kbGVyIFxuICB9XG5cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50TW9kdWxlLCBIdHRwQ2xpZW50LCBIVFRQX0lOVEVSQ0VQVE9SU30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSwgTm9vcEFuaW1hdGlvbnNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xyXG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUsIFJvdXRlcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcblxyXG4vL2ltcG9ydCAqIGFzIG9sIGZyb20gJ29wZW5sYXllcnMnO1xyXG5pbXBvcnQge1RyYW5zbGF0ZU1vZHVsZSwgVHJhbnNsYXRlTG9hZGVyLFRyYW5zbGF0ZVNlcnZpY2V9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xyXG5cclxuXHJcbmltcG9ydCB7IEFuZ3VsYXJIYWxNb2R1bGUgfSBmcm9tICdAc2l0bXVuL2Zyb250ZW5kLWNvcmUnO1xyXG5cclxuXHJcbmltcG9ydCB7IFJlYWN0aXZlRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcblxyXG5pbXBvcnQge1NpdG11bkZyb250ZW5kQ29yZU1vZHVsZX0gZnJvbSAnQHNpdG11bi9mcm9udGVuZC1jb3JlJztcclxuaW1wb3J0IHsgRGF0YUdyaWRDb21wb25lbnQgfSBmcm9tICcuL2RhdGEtZ3JpZC9kYXRhLWdyaWQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQWdHcmlkTW9kdWxlIH0gZnJvbSAnQGFnLWdyaWQtY29tbXVuaXR5L2FuZ3VsYXInO1xyXG5pbXBvcnQgeyBNYXRCdXR0b25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24nO1xyXG5pbXBvcnQge01hdEljb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xyXG5pbXBvcnQgeyBCdG5FZGl0UmVuZGVyZWRDb21wb25lbnQgfSBmcm9tICcuL2J0bi1lZGl0LXJlbmRlcmVkL2J0bi1lZGl0LXJlbmRlcmVkLmNvbXBvbmVudCc7XHJcblxyXG5cclxuXHJcblxyXG4vKiogU0lUTVVOIHBsdWdpbiBjb3JlIG1vZHVsZSAqL1xyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIFJvdXRlck1vZHVsZSxcclxuICAgIEh0dHBDbGllbnRNb2R1bGUsXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBGb3Jtc01vZHVsZSxcclxuICAgIE5vb3BBbmltYXRpb25zTW9kdWxlLFxyXG4gICAgQW5ndWxhckhhbE1vZHVsZSxcclxuICAgIFJlYWN0aXZlRm9ybXNNb2R1bGUsXHJcbiAgICBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSxcclxuICAgIEFnR3JpZE1vZHVsZS53aXRoQ29tcG9uZW50cyhbXSksXHJcbiAgICBTaXRtdW5Gcm9udGVuZENvcmVNb2R1bGUsXHJcbiAgICBNYXRCdXR0b25Nb2R1bGUsXHJcbiAgICBNYXRJY29uTW9kdWxlLFxyXG4gXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIERhdGFHcmlkQ29tcG9uZW50LFxyXG4gICAgQnRuRWRpdFJlbmRlcmVkQ29tcG9uZW50LFxyXG4gIF0sXHJcbiAgZW50cnlDb21wb25lbnRzOiBbXHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIEh0dHBDbGllbnRNb2R1bGUsXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBGb3Jtc01vZHVsZSxcclxuICAgIE5vb3BBbmltYXRpb25zTW9kdWxlLFxyXG4gICAgQW5ndWxhckhhbE1vZHVsZSxcclxuICAgIFRyYW5zbGF0ZU1vZHVsZSxcclxuICAgIFJlYWN0aXZlRm9ybXNNb2R1bGUsXHJcbiAgICBEYXRhR3JpZENvbXBvbmVudCxcclxuICAgIFNpdG11bkZyb250ZW5kQ29yZU1vZHVsZVxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFNpdG11bkZyb250ZW5kR3VpTW9kdWxlIHtcclxufVxyXG4iXX0=