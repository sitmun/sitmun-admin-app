(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/btn-edit-rendered/btn-edit-rendered.component.css":
/*!*************************************************************************************************************************!*\
  !*** ./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/btn-edit-rendered/btn-edit-rendered.component.css ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".buttonEdit {\r\n    color: #000000;\r\n    background-color: #DDDDDD;\r\n    width: 24px;\r\n    height: 24px;\r\n}\r\n.iconEdit {\r\n    font-size: 16px;\r\n    margin-top: -8px;\r\n}"

/***/ }),

/***/ "./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/btn-edit-rendered/btn-edit-rendered.component.html":
/*!**************************************************************************************************************************!*\
  !*** ./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/btn-edit-rendered/btn-edit-rendered.component.html ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<button mat-mini-fab class=\"buttonEdit\"  type=\"button\"  (click)=\"btnClickedHandler($event)\" >\n  <mat-icon class=\"iconEdit\"   fontSet=\"material-icons-round\" > edit </mat-icon>\n</button> "

/***/ }),

/***/ "./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/btn-edit-rendered/btn-edit-rendered.component.ts":
/*!************************************************************************************************************************!*\
  !*** ./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/btn-edit-rendered/btn-edit-rendered.component.ts ***!
  \************************************************************************************************************************/
/*! exports provided: BtnEditRenderedComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BtnEditRenderedComponent", function() { return BtnEditRenderedComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var BtnEditRenderedComponent = /** @class */ (function () {
    function BtnEditRenderedComponent() {
    }
    BtnEditRenderedComponent.prototype.agInit = function (params) {
        this.params = params;
    };
    BtnEditRenderedComponent.prototype.refresh = function (params) {
        return true;
    };
    BtnEditRenderedComponent.prototype.btnClickedHandler = function ($event) {
        this.params.clicked(this.params.value);
    };
    BtnEditRenderedComponent.prototype.getParams = function () {
        return this.params;
    };
    BtnEditRenderedComponent.prototype.ngOnDestroy = function () {
        // no need to remove the button click handler 
    };
    BtnEditRenderedComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-btn-edit-rendered',
            template: __webpack_require__(/*! ./btn-edit-rendered.component.html */ "./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/btn-edit-rendered/btn-edit-rendered.component.html"),
            styles: [__webpack_require__(/*! ./btn-edit-rendered.component.css */ "./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/btn-edit-rendered/btn-edit-rendered.component.css")]
        })
    ], BtnEditRenderedComponent);
    return BtnEditRenderedComponent;
}());



/***/ }),

/***/ "./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/data-grid/data-grid.component.css":
/*!*********************************************************************************************************!*\
  !*** ./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/data-grid/data-grid.component.css ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "label,\r\ninput {\r\n  display: inline-block;\r\n  margin-right: 5px;\r\n  margin-left: 10px;\r\n  margin-top: 5px;\r\n  margin-bottom: 5px;\r\n}\r\n\r\n#botoNou {\r\n  color: white;\r\n  background: #68a225 0% 0% no-repeat padding-box;\r\n  margin-left: 3px;\r\n}\r\n\r\n#botoElimina {\r\n  background: #ffffff 0% 0% no-repeat padding-box;\r\n  margin-left: 3px;\r\n}\r\n\r\n#aplicarCanvis {\r\n  color: white !important;\r\n  background: #68a225 0% 0% no-repeat padding-box;\r\n  margin-left: 3px;\r\n}\r\n\r\n#aplicarCanvis[disabled]\r\n{\r\n  background: #83976c 0% 0% no-repeat padding-box;\r\n}\r\n\r\n#redo {\r\n  color: white !important;\r\n  background: #ff9300;\r\n  margin-left: 3px;\r\n}\r\n\r\n#redo[disabled] {\r\n  background: #ffc97f;\r\n  margin-left: 3px;\r\n}\r\n\r\n#undo {\r\n  color: white !important;\r\n  background: #ff9300;\r\n  margin-left: 3px;\r\n}\r\n\r\n#undo[disabled] {\r\n  background: #ffc97f;\r\n  margin-left: 3px;\r\n}\r\n\r\n#borrarCanvis {\r\n  color: white !important;\r\n  background: #df3133;\r\n}\r\n\r\n#borrarCanvis[disabled] {\r\n  color: white !important;\r\n  background: #da8c8e;\r\n}\r\n\r\n.editDivBtns {\r\n  text-align: start;\r\n  display: inline-block;\r\n  width: 20%;\r\n  height: 30px !important;\r\n  line-height: 30px !important;\r\n}\r\n\r\n.actionsDivBtns {\r\n  text-align: end;\r\n  width:80%;\r\n  height: 60px;\r\n}\r\n\r\n.actionsDivBtns,\r\n.editDivBtns {\r\n  display: inline-block !important;\r\n}\r\n\r\n.actionsDivBtns .mat-stroked-button{\r\n padding: 5px 20px!important;\r\n}\r\n\r\n.editDivBtns .mat-mini-fab .mat-button-wrapper {\r\n  padding: inherit !important;\r\n  display: inherit !important;\r\n}\r\n\r\n.editDivBtns .mat-icon{\r\n  height: 30px !important;\r\n  bottom: 5px;\r\n  position: relative;\r\n}\r\n\r\n.editDivBtns .mat-mini-fab {\r\n  width: 30px;\r\n  height: 30px;\r\n}\r\n\r\n.actionsDivBtns .searchGenericInput{\r\n  height: 45px!important;\r\n  width: 50% !important;\r\n}\r\n\r\n.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-thumb {\r\n  background: #eee;\r\n}\r\n\r\n​\r\n.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar {\r\n  width: 2em;\r\n  height: 2em;\r\n}\r\n\r\n.ag-body-viewport.ag-layout-normal ::-webkit-scrollbar-button {\r\n  background: #ccc;\r\n}\r\n\r\n.ag-body-viewport.ag-layout-normal::-webkit-scrollbar-track-piece {\r\n  background: #888;\r\n}\r\n"

/***/ }),

/***/ "./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/data-grid/data-grid.component.html":
/*!**********************************************************************************************************!*\
  !*** ./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/data-grid/data-grid.component.html ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "    <div id=grup1 class=\"editDivBtns\">\r\n        <button  mat-mini-fab class=\"editBtn\"  *ngIf=\"discardChangesButton\"  id=\"borrarCanvis\" type=\"button\"  (click)=\"deleteChanges()\" [disabled]=\"changeCounter <= 0\">\r\n            <mat-icon  fontSet=\"material-icons-round\" > close </mat-icon>\r\n        </button>\r\n        <button mat-mini-fab class=\"editBtn\" *ngIf=\"undoButton\"  id=\"undo\"  (click)=\"undo()\" [disabled]=\"changeCounter <= 0\" >\r\n            <mat-icon fontSet=\"material-icons-round\" > undo </mat-icon>\r\n        </button>\r\n        <button mat-mini-fab class=\"editBtn\" *ngIf=\"redoButton\"  id=\"redo\"  (click)=\"redo()\" [disabled]=\"redoCounter <= 0\">\r\n            <mat-icon fontSet=\"material-icons-round\" > redo </mat-icon>\r\n        </button>\r\n        <button mat-mini-fab class=\"editBtn\" *ngIf=\"applyChangesButton\"  id=\"aplicarCanvis\"  (click)=\"applyChanges()\" [disabled]=\"changeCounter <= 0\" >\r\n            <mat-icon fontSet=\"material-icons-round\" > check </mat-icon>\r\n        </button>\r\n    </div>\r\n\r\n    <div id=grup2 class=\"actionsDivBtns\" >\r\n        <label *ngIf=\"globalSearch\" [translate]=\"'Search'\"> </label>\r\n        <input *ngIf=\"globalSearch\"type=\"text\" class=\"searchGenericInput\" placeholder=\"\" (keyup)=\"quickSearch()\" [(ngModel)]=\"searchValue\" ml-2 >\r\n        <button *ngIf=\"deleteButton\"  mat-stroked-button id=\"botoElimina\"  (click)=\"removeData()\">\r\n            <mat-icon fontSet=\"material-icons-round\" > delete </mat-icon>\r\n            <span  [translate]=\"'Remove'\"> </span>\r\n            \r\n        </button>\r\n        <button  *ngIf=\"newButton\" mat-stroked-button id=\"botoNou\"  (click)=\"newData()\">\r\n            <mat-icon fontSet=\"material-icons-round\"> add_circle_outline </mat-icon>      \r\n            <span  [translate]=\"'New'\"> </span>           \r\n        </button>\r\n\r\n\r\n        \r\n    </div>\r\n\r\n\r\n\r\n    <div class=\"row\" style=\" height: 100%\">\r\n        <div class=\"ag-theme-alpine\" id=\"myGrid\" style=\" width:100%; height: 100%\" >\r\n            <ag-grid-angular\r\n            style=\" width: 100%; height: 100%;\"\r\n            class=\"ag-theme-alpine\"\r\n            [floatingFilter]=\"true\"\r\n            [rowData]=\"rowData\"\r\n            [columnDefs]=\"columnDefs\"\r\n            [gridOptions]=\"gridOptions\"\r\n            [animateRows]=\"true\"\r\n            [pagination]=\"false\"\r\n            [modules]=\"modules\"     \r\n            [undoRedoCellEditing]=\"true\"    \r\n            [undoRedoCellEditingLimit]= 200\r\n            [suppressRowClickSelection]=true\r\n            [enableCellChangeFlash]=true\r\n            [frameworkComponents]=\"frameworkComponents\"\r\n            rowSelection=\"multiple\"\r\n            (filterModified)=\"onFilterModified()\"\r\n            (cellEditingStopped) =\"onCellEditingStopped($event)\"\r\n            (cellValueChanged)=\"onCellValueChanged($event)\"\r\n            (gridReady)=\"onGridReady($event)\">\r\n            \r\n            </ag-grid-angular>\r\n        </div>\r\n    </div>\r\n\r\n\r\n"

/***/ }),

/***/ "./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/data-grid/data-grid.component.ts":
/*!********************************************************************************************************!*\
  !*** ./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/data-grid/data-grid.component.ts ***!
  \********************************************************************************************************/
/*! exports provided: DataGridComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataGridComponent", function() { return DataGridComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ag_grid_community_all_modules__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ag-grid-community/all-modules */ "./node_modules/@ag-grid-community/all-modules/dist/es6/main.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __values = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};


var DataGridComponent = /** @class */ (function () {
    function DataGridComponent() {
        this.modules = _ag_grid_community_all_modules__WEBPACK_IMPORTED_MODULE_1__["AllCommunityModules"];
        this.statusColumn = false;
        this.changesMap = new Map();
        this.modificationChange = false;
        this.undoNoChanges = false; // Booleano para saber si es un undo provocado por un cambio sin modificaciones
        this.remove = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.new = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.sendChanges = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
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
                        comparator: function (filterLocalDateAtMidnight, cellValue) {
                            var dateCellValue = new Date(cellValue);
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
        };
    }
    DataGridComponent.prototype.onGridReady = function (params) {
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
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _c;
    };
    DataGridComponent.prototype.quickSearch = function () {
        this.gridApi.setQuickFilter(this.searchValue);
    };
    DataGridComponent.prototype.getElements = function () {
        var _this = this;
        this.getAll()
            .subscribe(function (items) {
            console.log(items);
            _this.rowData = items;
            setTimeout(function () { _this.gridApi.sizeColumnsToFit(); }, 30);
        });
    };
    DataGridComponent.prototype.removeData = function () {
        this.gridApi.stopEditing(false);
        var selectedNodes = this.gridApi.getSelectedNodes();
        var selectedData = selectedNodes.map(function (node) { return node.data; });
        this.remove.emit(selectedData);
        if (this.statusColumn) {
            var selectedRows = selectedNodes.map(function (node) { return node.rowIndex; });
            try {
                for (var selectedRows_1 = __values(selectedRows), selectedRows_1_1 = selectedRows_1.next(); !selectedRows_1_1.done; selectedRows_1_1 = selectedRows_1.next()) {
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
    DataGridComponent.prototype.newData = function () {
        this.gridApi.stopEditing(false);
        this.new.emit(-1);
    };
    DataGridComponent.prototype.applyChanges = function () {
        var itemsChanged = [];
        this.gridApi.stopEditing(false);
        try {
            for (var _a = __values(this.changesMap.keys()), _b = _a.next(); !_b.done; _b = _a.next()) {
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
    DataGridComponent.prototype.deleteChanges = function () {
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
    DataGridComponent.prototype.onFilterModified = function () {
        this.deleteChanges();
    };
    DataGridComponent.prototype.undo = function () {
        this.gridApi.stopEditing(false);
        this.gridApi.undoCellEditing();
        this.changeCounter -= 1;
        this.redoCounter += 1;
    };
    DataGridComponent.prototype.redo = function () {
        this.gridApi.stopEditing(false);
        this.gridApi.redoCellEditing();
        this.changeCounter += 1;
        this.redoCounter -= 1;
    };
    DataGridComponent.prototype.onCellEditingStopped = function (e) {
        if (this.modificationChange) {
            this.changeCounter++;
            this.redoCounter = 0;
            this.onCellValueChanged(e);
            this.modificationChange = false;
        }
    };
    DataGridComponent.prototype.onCellValueChanged = function (params) {
        this.params = params; // Guardaremos los parametros por si hay que hacer un apply changes
        if (this.changeCounter > this.previousChangeCounter) 
        // Esta condición será cierta si venimos de editar la cela o de hacer un redo
        {
            if (params.oldValue !== params.value && !(params.oldValue == null && params.value === '')) {
                if (!this.changesMap.has(params.node.id)) {
                    var addMap = new Map();
                    addMap.set(params.colDef.field, 1);
                    this.changesMap.set(params.node.id, addMap);
                }
                else {
                    if (!this.changesMap.get(params.node.id).has(params.colDef.field)) {
                        this.changesMap.get(params.node.id).set(params.colDef.field, 1);
                    }
                    else {
                        // Si ya habíamos modificado la cela, aumentamos el numero de cambios en esta
                        var currentChanges = this.changesMap.get(params.node.id).get(params.colDef.field);
                        this.changesMap.get(params.node.id).set(params.colDef.field, (currentChanges + 1));
                    }
                }
                this.paintCells(params, this.changesMap); // Com ha estado modificada la linia, la pintamos de verde
                this.previousChangeCounter++; //Igualamos el contador de cambios anterior al actual
            }
        }
        else if (this.changeCounter < this.previousChangeCounter) {
            var currentChanges = -1;
            if (this.changesMap.has(params.node.id)) {
                currentChanges = this.changesMap.get(params.node.id).get(params.colDef.field);
            }
            if (currentChanges === 1) {
                this.changesMap.get(params.node.id).delete(params.colDef.field);
                if (this.changesMap.get(params.node.id).size === 0) {
                    this.changesMap.delete(params.node.id);
                    var row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
                    // Si solo tiene una modificacion, quiere decir que la cela está en su estado inicial, por lo que la pintamos de blanco
                    this.gridApi.redrawRows({ rowNodes: [row] });
                }
                else {
                    this.paintCells(params, this.changesMap);
                }
            }
            else if (currentChanges > 1) {
                this.changesMap.get(params.node.id).set(params.colDef.field, (currentChanges - 1));
                this.paintCells(params, this.changesMap); // Como aun tiene cambios, el background tiene que seguir verde
            }
            this.previousChangeCounter--; // Com veniem d'undo, hem de decrementar el comptador de canvisAnterior
        }
        else {
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
    };
    DataGridComponent.prototype.getColumnIndexByColId = function (api, colId) {
        return api.getAllColumns().findIndex(function (col) { return col.getColId() === colId; });
    };
    DataGridComponent.prototype.paintCells = function (params, changesMap) {
        var row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
        this.changeCellStyleColumns(params, changesMap, '#E8F1DE');
        this.gridApi.redrawRows({ rowNodes: [row] });
        this.changeCellStyleColumns(params, changesMap, '#FFFFFF');
        // Definiremos el cellStyle blanco para futuras modificaciones internas (ej: filtro)
    };
    DataGridComponent.prototype.changeCellStyleColumns = function (params, changesMap, color) {
        try {
            for (var _a = __values(changesMap.get(params.node.id).keys()), _b = _a.next(); !_b.done; _b = _a.next()) {
                var key = _b.value;
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
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DataGridComponent.prototype, "frameworkComponents", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], DataGridComponent.prototype, "columnDefs", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Function)
    ], DataGridComponent.prototype, "getAll", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], DataGridComponent.prototype, "discardChangesButton", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], DataGridComponent.prototype, "undoButton", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], DataGridComponent.prototype, "redoButton", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], DataGridComponent.prototype, "applyChangesButton", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], DataGridComponent.prototype, "deleteButton", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], DataGridComponent.prototype, "newButton", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], DataGridComponent.prototype, "globalSearch", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"])
    ], DataGridComponent.prototype, "remove", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"])
    ], DataGridComponent.prototype, "new", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"])
    ], DataGridComponent.prototype, "sendChanges", void 0);
    DataGridComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-data-grid',
            template: __webpack_require__(/*! ./data-grid.component.html */ "./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/data-grid/data-grid.component.html"),
            styles: [__webpack_require__(/*! ./data-grid.component.css */ "./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/data-grid/data-grid.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], DataGridComponent);
    return DataGridComponent;
}());



/***/ }),

/***/ "./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/public_api.ts":
/*!*************************************************************************************!*\
  !*** ./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/public_api.ts ***!
  \*************************************************************************************/
/*! exports provided: DataGridComponent, SitmunFrontendGuiModule, BtnEditRenderedComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _data_grid_data_grid_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data-grid/data-grid.component */ "./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/data-grid/data-grid.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DataGridComponent", function() { return _data_grid_data_grid_component__WEBPACK_IMPORTED_MODULE_0__["DataGridComponent"]; });

/* harmony import */ var _sitmun_frontend_gui_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sitmun-frontend-gui.module */ "./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/sitmun-frontend-gui.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SitmunFrontendGuiModule", function() { return _sitmun_frontend_gui_module__WEBPACK_IMPORTED_MODULE_1__["SitmunFrontendGuiModule"]; });

/* harmony import */ var _btn_edit_rendered_btn_edit_rendered_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./btn-edit-rendered/btn-edit-rendered.component */ "./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/btn-edit-rendered/btn-edit-rendered.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BtnEditRenderedComponent", function() { return _btn_edit_rendered_btn_edit_rendered_component__WEBPACK_IMPORTED_MODULE_2__["BtnEditRenderedComponent"]; });

/*
 * Public API Surface of sitmun-frontend-gui
 */





/***/ }),

/***/ "./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/sitmun-frontend-gui.module.ts":
/*!*****************************************************************************************************!*\
  !*** ./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/sitmun-frontend-gui.module.ts ***!
  \*****************************************************************************************************/
/*! exports provided: SitmunFrontendGuiModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SitmunFrontendGuiModule", function() { return SitmunFrontendGuiModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var _sitmun_frontend_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @sitmun/frontend-core */ "./node_modules/@sitmun/frontend-core/fesm5/sitmun-frontend-core.js");
/* harmony import */ var _data_grid_data_grid_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./data-grid/data-grid.component */ "./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/data-grid/data-grid.component.ts");
/* harmony import */ var _ag_grid_community_angular__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ag-grid-community/angular */ "./node_modules/@ag-grid-community/angular/main.js");
/* harmony import */ var _ag_grid_community_angular__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_ag_grid_community_angular__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/esm5/button.es5.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/icon */ "./node_modules/@angular/material/esm5/icon.es5.js");
/* harmony import */ var _btn_edit_rendered_btn_edit_rendered_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./btn-edit-rendered/btn-edit-rendered.component */ "./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/btn-edit-rendered/btn-edit-rendered.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






//import * as ol from 'openlayers';









/** SITMUN plugin core module */
var SitmunFrontendGuiModule = /** @class */ (function () {
    function SitmunFrontendGuiModule() {
    }
    SitmunFrontendGuiModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormsModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__["NoopAnimationsModule"],
                _sitmun_frontend_core__WEBPACK_IMPORTED_MODULE_7__["AngularHalModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ReactiveFormsModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__["BrowserAnimationsModule"],
                _ag_grid_community_angular__WEBPACK_IMPORTED_MODULE_9__["AgGridModule"].withComponents([]),
                _sitmun_frontend_core__WEBPACK_IMPORTED_MODULE_7__["SitmunFrontendCoreModule"],
                _angular_material_button__WEBPACK_IMPORTED_MODULE_10__["MatButtonModule"],
                _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__["MatIconModule"],
            ],
            declarations: [
                _data_grid_data_grid_component__WEBPACK_IMPORTED_MODULE_8__["DataGridComponent"],
                _btn_edit_rendered_btn_edit_rendered_component__WEBPACK_IMPORTED_MODULE_12__["BtnEditRenderedComponent"],
            ],
            entryComponents: [],
            providers: [],
            exports: [
                _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormsModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__["NoopAnimationsModule"],
                _sitmun_frontend_core__WEBPACK_IMPORTED_MODULE_7__["AngularHalModule"],
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__["TranslateModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ReactiveFormsModule"],
                _data_grid_data_grid_component__WEBPACK_IMPORTED_MODULE_8__["DataGridComponent"],
                _sitmun_frontend_core__WEBPACK_IMPORTED_MODULE_7__["SitmunFrontendCoreModule"]
            ]
        })
    ], SitmunFrontendGuiModule);
    return SitmunFrontendGuiModule;
}());



/***/ }),

/***/ "./src/main/angular-library/src/$$_lazy_route_resource lazy recursive":
/*!***********************************************************************************!*\
  !*** ./src/main/angular-library/src/$$_lazy_route_resource lazy namespace object ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/main/angular-library/src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/main/angular-library/src/app/ExternalConfigurationService.ts":
/*!**************************************************************************!*\
  !*** ./src/main/angular-library/src/app/ExternalConfigurationService.ts ***!
  \**************************************************************************/
/*! exports provided: ExternalConfigurationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExternalConfigurationService", function() { return ExternalConfigurationService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/** REST API access configuration service*/
var ExternalConfigurationService = /** @class */ (function () {
    /** Constructor*/
    function ExternalConfigurationService(http) {
        this.http = http;
    }
    /** deperecated*/
    ExternalConfigurationService.prototype.deserialize = function () {
        throw new Error('Method not implemented.');
    };
    /** deperecated*/
    ExternalConfigurationService.prototype.serialize = function () {
        throw new Error('Method not implemented.');
    };
    /** get proxy uri*/
    ExternalConfigurationService.prototype.getProxyUri = function () {
        return "/api/";
    };
    /** get REST API root uri*/
    ExternalConfigurationService.prototype.getRootUri = function () {
        return "/api/";
    };
    /** get HttpClient*/
    ExternalConfigurationService.prototype.getHttp = function () {
        return this.http;
    };
    /**deprecated*/
    ExternalConfigurationService.prototype.getExternalConfiguration = function () {
        return null;
    };
    /**deprecated*/
    ExternalConfigurationService.prototype.setExternalConfiguration = function (externalConfiguration) {
    };
    ExternalConfigurationService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], ExternalConfigurationService);
    return ExternalConfigurationService;
}());



/***/ }),

/***/ "./src/main/angular-library/src/app/app.component.css":
/*!************************************************************!*\
  !*** ./src/main/angular-library/src/app/app.component.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/main/angular-library/src/app/app.component.html":
/*!*************************************************************!*\
  !*** ./src/main/angular-library/src/app/app.component.html ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-toolbar color=\"primary\">\r\n  <button mat-button [routerLink]=\"['']\">\r\n    <img height=\"50px;\" src=\"https://avatars0.githubusercontent.com/u/24718368?s=200&v=4\">\r\n    <span>  Sitmun Admin App</span>\r\n  </button>\r\n  \r\n   <span class=\"toolbar-spacer\"></span>\r\n    <span *ngIf=\"isLoggedIn()\" >\r\n    <!-- \r\n   <button mat-button *sitmunHasAnyAuthority=\"['ADMIN SITMUN','ADMIN ORGANIZACION']\"\r\n            [routerLink]=\"['/territory-list']\"><span [translate]=\"'menu.territories'\">Territories</span>\r\n    </button>\r\n     <button mat-button *sitmunHasAnyAuthority=\"'ADMIN SITMUN'\"\r\n            [routerLink]=\"['/territory-type-list']\"><span [translate]=\"'menu.territoriesTypes'\">Territory types</span>\r\n    </button>\r\n    <button mat-button  *sitmunHasAnyAuthority=\"['ADMIN SITMUN','ADMIN ORGANIZACION']\"\r\n            [routerLink]=\"['/user-list']\"><span [translate]=\"'menu.users'\">Users</span>\r\n    </button>\r\n    <button mat-button *sitmunHasAnyAuthority=\"'ADMIN SITMUN'\"\r\n            [routerLink]=\"['/role-list']\"><span [translate]=\"'menu.roles'\">Roles</span>\r\n    </button>\r\n    \r\n    <button mat-button *sitmunHasAnyAuthority=\"'ADMIN SITMUN'\"\r\n            [routerLink]=\"['/connection-list']\"><span [translate]=\"'menu.connection'\">Connections</span>\r\n    </button>\r\n     \r\n    <button mat-button *sitmunHasAnyAuthority=\"'ADMIN SITMUN'\"\r\n            [routerLink]=\"['/task-type-list']\"><span [translate]=\"'menu.taskType'\">Task Types</span>\r\n    </button>\r\n    <button mat-button *sitmunHasAnyAuthority=\"'ADMIN SITMUN'\"\r\n            [routerLink]=\"['/task-group-list']\"><span [translate]=\"'menu.taskGroup'\">Task Groups</span>\r\n    </button>\r\n    -->\r\n    <button mat-button *sitmunHasAnyAuthority=\"'ADMIN SITMUN'\"\r\n            [routerLink]=\"['/task-list']\"><span [translate]=\"'menu.taskList'\">Tasks</span>\r\n    </button>\r\n     \r\n    <button mat-button *sitmunHasAnyAuthority=\"'ADMIN SITMUN'\"\r\n            [routerLink]=\"['/task-ui-list']\"><span [translate]=\"'menu.taskUIList'\">Task UIs</span>\r\n    </button>\r\n    <button mat-button *sitmunHasAnyAuthority=\"'ADMIN SITMUN'\"\r\n            [routerLink]=\"['/service-list']\"><span [translate]=\"'menu.serviceList'\">Services</span>\r\n    </button>\r\n    <button mat-button *sitmunHasAnyAuthority=\"'ADMIN SITMUN'\"\r\n            [routerLink]=\"['/cartography-list']\"><span [translate]=\"'menu.cartographyList'\">Cartographies</span>\r\n    </button>\r\n    <button mat-button *sitmunHasAnyAuthority=\"'ADMIN SITMUN'\"\r\n            [routerLink]=\"['/cartography-group-list']\"><span [translate]=\"'menu.cartographyGroupList'\">Cartography Groups</span>\r\n    </button>\r\n    <button mat-button *sitmunHasAnyAuthority=\"'ADMIN SITMUN'\"\r\n            [routerLink]=\"['/background-list']\"><span [translate]=\"'menu.backgroundList'\">backgrounds</span>\r\n    </button>\r\n    <button mat-button *sitmunHasAnyAuthority=\"'ADMIN SITMUN'\"\r\n            [routerLink]=\"['/tree-list']\"><span [translate]=\"'menu.treeList'\">trees</span>\r\n    </button>\r\n    <button mat-button *sitmunHasAnyAuthority=\"'ADMIN SITMUN'\"\r\n            [routerLink]=\"['/application-list']\"><span [translate]=\"'menu.applicationList'\">applications</span>\r\n    </button>\r\n  </span>\r\n    <span (click)=\"changeLanguage('ca')\"> CA </span> | <span  (click)=\"changeLanguage('es')\"> ES </span>| <span  (click)=\"changeLanguage('en')\"> EN </span>\r\n    <span *ngIf=\"isLoggedIn()\" ><a href=\"\" [routerLink]=\"['/account']\" [translate]=\"'menu.account'\">Account</a> <a href=\"\" [routerLink]=\"['/change-password']\" [translate]=\"'account.change-password'\">Change password</a><a href=\"\" (click)=\"logout()\" [translate]=\"'account.closeSession'\">Close session</a> </span> \r\n</mat-toolbar>\r\n<router-outlet></router-outlet>\r\n<!-- test map-->\r\n\r\n        <sitmun-map-viewer-map [extent]=\"[256901.08041000657, 4544669.980255321, 554715.9195899934, 4703023.019744679]\" \r\n                       [initialProjection]=\"'EPSG:25831'\" \r\n                       [loadDefaults]=\"true\"></sitmun-map-viewer-map>                       \r\n                      \r\n\r\n"

/***/ }),

/***/ "./src/main/angular-library/src/app/app.component.ts":
/*!***********************************************************!*\
  !*** ./src/main/angular-library/src/app/app.component.ts ***!
  \***********************************************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var _sitmun_frontend_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sitmun/frontend-core */ "./node_modules/@sitmun/frontend-core/fesm5/sitmun-frontend-core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/** Demo app component*/
var AppComponent = /** @class */ (function () {
    /** Component constructor*/
    function AppComponent(/** Translate service */ trans, /** Identity service */ principal, /** Login service */ loginService) {
        this.trans = trans;
        this.principal = principal;
        this.loginService = loginService;
        /** app title*/
        this.title = 'app';
        /** app param*/
        this.param = { value: 'world' };
        this.translate = trans;
        this.translate.addLangs(['es', 'ca']);
        this.translate.setDefaultLang('ca');
        //const browserLang = translate.getBrowserLang();
        //translate.use(browserLang.match(/es|ca/) ? browserLang : 'ca');
        this.translate.use('ca');
    }
    /** Change app language*/
    AppComponent.prototype.changeLanguage = function (locale) {
        this.translate.use(locale);
    };
    /** User log out*/
    AppComponent.prototype.logout = function () {
        this.loginService.logout();
    };
    /** Whether user is logged in */
    AppComponent.prototype.isLoggedIn = function () {
        return this.principal.isAuthenticated();
    };
    /** On component init, get logged user account*/
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.principal.identity().then(function (account) {
            _this.currentAccount = account;
        });
    };
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/main/angular-library/src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/main/angular-library/src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__["TranslateService"], _sitmun_frontend_core__WEBPACK_IMPORTED_MODULE_2__["Principal"], _sitmun_frontend_core__WEBPACK_IMPORTED_MODULE_2__["LoginService"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/main/angular-library/src/app/app.module.ts":
/*!********************************************************!*\
  !*** ./src/main/angular-library/src/app/app.module.ts ***!
  \********************************************************/
/*! exports provided: createTranslateLoader, AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createTranslateLoader", function() { return createTranslateLoader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "./src/main/angular-library/src/app/app.component.ts");
/* harmony import */ var _ExternalConfigurationService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ExternalConfigurationService */ "./src/main/angular-library/src/app/ExternalConfigurationService.ts");
/* harmony import */ var _sitmun_frontend_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sitmun/frontend-core */ "./node_modules/@sitmun/frontend-core/fesm5/sitmun-frontend-core.js");
/* harmony import */ var _home_home_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./home/home.component */ "./src/main/angular-library/src/app/home/home.component.ts");
/* harmony import */ var sitmun_frontend_gui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! sitmun-frontend-gui */ "./src/main/angular-library/projects/sitmun-frontend-gui/src/lib/public_api.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_common_locales_ca__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common/locales/ca */ "./node_modules/@angular/common/locales/ca.js");
/* harmony import */ var _angular_common_locales_ca__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_angular_common_locales_ca__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _angular_common_locales_es__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common/locales/es */ "./node_modules/@angular/common/locales/es.js");
/* harmony import */ var _angular_common_locales_es__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_angular_common_locales_es__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ngx-translate/http-loader */ "./node_modules/@ngx-translate/http-loader/esm5/ngx-translate-http-loader.js");
/* harmony import */ var _ag_grid_community_angular__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @ag-grid-community/angular */ "./node_modules/@ag-grid-community/angular/main.js");
/* harmony import */ var _ag_grid_community_angular__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_ag_grid_community_angular__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/button */ "./node_modules/@angular/material/esm5/button.es5.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/icon */ "./node_modules/@angular/material/esm5/icon.es5.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



















Object(_angular_common__WEBPACK_IMPORTED_MODULE_8__["registerLocaleData"])(_angular_common_locales_ca__WEBPACK_IMPORTED_MODULE_9___default.a, 'ca');
Object(_angular_common__WEBPACK_IMPORTED_MODULE_8__["registerLocaleData"])(_angular_common_locales_es__WEBPACK_IMPORTED_MODULE_10___default.a, 'es');
/** Load translation assets */
function createTranslateLoader(http) {
    return new _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_13__["TranslateHttpLoader"](http, './assets/i18n/', '.json');
}
/** Demo app routes configuration*/
var appRoutes = [
    {
        path: '',
        component: _home_home_component__WEBPACK_IMPORTED_MODULE_6__["HomeComponent"]
    }
];
var AppModule = /** @class */ (function () {
    /** Demo app module*/
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
                _home_home_component__WEBPACK_IMPORTED_MODULE_6__["HomeComponent"],
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_17__["BrowserAnimationsModule"],
                _sitmun_frontend_core__WEBPACK_IMPORTED_MODULE_5__["SitmunFrontendCoreModule"].forRoot(),
                sitmun_frontend_gui__WEBPACK_IMPORTED_MODULE_7__["SitmunFrontendGuiModule"],
                _ag_grid_community_angular__WEBPACK_IMPORTED_MODULE_14__["AgGridModule"].withComponents([]),
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_12__["TranslateModule"].forRoot({
                    loader: {
                        provide: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_12__["TranslateLoader"],
                        useFactory: (createTranslateLoader),
                        deps: [_angular_common_http__WEBPACK_IMPORTED_MODULE_11__["HttpClient"]]
                    }
                }),
                _angular_material_button__WEBPACK_IMPORTED_MODULE_15__["MatButtonModule"],
                _angular_material_icon__WEBPACK_IMPORTED_MODULE_16__["MatIconModule"],
                _sitmun_frontend_core__WEBPACK_IMPORTED_MODULE_5__["AngularHalModule"].forRoot(),
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(appRoutes)
            ],
            entryComponents: [],
            providers: [
                { provide: 'ExternalConfigurationService', useClass: _ExternalConfigurationService__WEBPACK_IMPORTED_MODULE_4__["ExternalConfigurationService"] },
                {
                    provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_11__["HTTP_INTERCEPTORS"],
                    useClass: _sitmun_frontend_core__WEBPACK_IMPORTED_MODULE_5__["AuthInterceptor"],
                    multi: true
                },
                {
                    provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_11__["HTTP_INTERCEPTORS"],
                    useClass: _sitmun_frontend_core__WEBPACK_IMPORTED_MODULE_5__["AuthExpiredInterceptor"],
                    multi: true
                }
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
        })
        /** Demo app module*/
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/main/angular-library/src/app/home/home.component.css":
/*!******************************************************************!*\
  !*** ./src/main/angular-library/src/app/home/home.component.css ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/main/angular-library/src/app/home/home.component.html":
/*!*******************************************************************!*\
  !*** ./src/main/angular-library/src/app/home/home.component.html ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--\r\n<sitmun-map-viewer-map [initialLon]=\"360498.62863399717\" [initialLat]=\"4630983.631562616\" [initialProjection]=\"'EPSG:25831'\" [initialZoom]=\"2\"></sitmun-map-viewer-map>\r\n-->\r\n\r\n\r\n <span *ngIf=\"isLoggedIn()\" > Youre logged in <a href=\"\" (click)=\"logout()\">Close Session</a> </span> \r\n  <a *ngIf=\"!isLoggedIn()\"  href=\"\" [routerLink]=\"['/login']\"> Login </a> \r\n"

/***/ }),

/***/ "./src/main/angular-library/src/app/home/home.component.ts":
/*!*****************************************************************!*\
  !*** ./src/main/angular-library/src/app/home/home.component.ts ***!
  \*****************************************************************/
/*! exports provided: HomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomeComponent", function() { return HomeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _sitmun_frontend_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sitmun/frontend-core */ "./node_modules/@sitmun/frontend-core/fesm5/sitmun-frontend-core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/** Demo app Home component*/
var HomeComponent = /** @class */ (function () {
    /** Component constructor */
    function HomeComponent(
    /** Login service */ loginService, 
    /** Identity service */ principal) {
        this.loginService = loginService;
        this.principal = principal;
    }
    /** Logout user */
    HomeComponent.prototype.logout = function () {
        this.loginService.logout();
    };
    /** Whether the user is logged in*/
    HomeComponent.prototype.isLoggedIn = function () {
        return this.principal.isAuthenticated();
    };
    HomeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-home',
            template: __webpack_require__(/*! ./home.component.html */ "./src/main/angular-library/src/app/home/home.component.html"),
            styles: [__webpack_require__(/*! ./home.component.css */ "./src/main/angular-library/src/app/home/home.component.css")]
        }),
        __metadata("design:paramtypes", [_sitmun_frontend_core__WEBPACK_IMPORTED_MODULE_1__["LoginService"],
            _sitmun_frontend_core__WEBPACK_IMPORTED_MODULE_1__["Principal"]])
    ], HomeComponent);
    return HomeComponent;
}());



/***/ }),

/***/ "./src/main/angular-library/src/environments/environment.ts":
/*!******************************************************************!*\
  !*** ./src/main/angular-library/src/environments/environment.ts ***!
  \******************************************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
/** This file can be replaced during build by using the `fileReplacements` array.
    `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
 The list of file replacements can be found in `angular.json`.
 */
var environment = {
    production: false,
    api_url: 'http://localhost:8080/api'
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main/angular-library/src/main.ts":
/*!**********************************************!*\
  !*** ./src/main/angular-library/src/main.ts ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/main/angular-library/src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/main/angular-library/src/environments/environment.ts");
/* harmony import */ var _ag_grid_community_all_modules__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ag-grid-community/all-modules */ "./node_modules/@ag-grid-community/all-modules/dist/es6/main.js");





if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
/** we use the webpack raw-loader to return the content as a string */
//const translations = require(`raw-loader!./locale/messages.ca.xlf`);
_ag_grid_community_all_modules__WEBPACK_IMPORTED_MODULE_4__["ModuleRegistry"].registerModules(_ag_grid_community_all_modules__WEBPACK_IMPORTED_MODULE_4__["AllCommunityModules"]);
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"], {
    providers: [
        //{provide: TRANSLATIONS, useValue: translations},
        { provide: _angular_core__WEBPACK_IMPORTED_MODULE_0__["TRANSLATIONS_FORMAT"], useValue: 'xlf' }
    ]
})
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!****************************************************!*\
  !*** multi ./src/main/angular-library/src/main.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\ggaliano\Desktop\Sitmun3\sitmun3-frontend-gui\src\main\angular-library\src\main.ts */"./src/main/angular-library/src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map