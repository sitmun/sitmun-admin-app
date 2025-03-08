import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, SimpleChanges, OnChanges} from '@angular/core';

import {Observable, Subscription} from 'rxjs';
import {
  GridOptions,
  ModuleRegistry,
} from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { CsvExportModule } from '@ag-grid-community/csv-export';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import { BtnEditRenderedComponent } from '../btn-edit-rendered/btn-edit-rendered.component';
import { BtnCheckboxRenderedComponent } from '../btn-checkbox-rendered/btn-checkbox-rendered.component';
import { BtnCheckboxFilterComponent } from '../btn-checkbox-filter/btn-checkbox-filter.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogMessageComponent } from '../dialog-message/dialog-message.component';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import {AgGridModule} from '@ag-grid-community/angular';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {UtilsService} from '../../../../services/utils.service';

declare let $: any;

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule
]);

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styles: [],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    TranslateModule,
    AgGridModule,
    MatButtonToggleModule,
    MatCardModule,
  ]
})
export class DataGridComponent implements OnInit, OnDestroy, OnChanges {

  isFirstLoad = true;
  dataSubscription!: Subscription;

  _eventRefreshSubscription: any;
  _eventGetSelectedRowsSubscription: any;
  _eventGetAllRowsSubscription: any;
  _eventSaveAgGridStateSubscription: any;
  _eventModifyStatusOfSelectedCells: any;

  searchValue: string;
  gridApi: any;
  gridColumnApi: any;
  statusColumn = false;
  someColumnIsEditable = false;
  changesMap: Map<string, Map<string, number>> = new Map<string, Map<string, number>>();

  // We will save the id of edited cells and the number of editions done.
  params: any; // Last parameters of the grid (in case we do apply changes we will need it)
  rowData: any[];
  changeCounter: number; // Number of editions done above any cell
  previousChangeCounter: number; // Number of ditions done after the last modification(changeCounter)
  redoCounter: number; // Number of redo we can do
  modificationChange = false;
  undoNoChanges = false; // Boolean that indicates if an undo hasn't modifications
  gridOptions: GridOptions;
  someStatusHasChangedToDelete = false;

  @Input() eventRefreshSubscription: Observable<boolean>;
  @Input() eventGetSelectedRowsSubscription: Observable<boolean>;
  @Input() eventGetAllRowsSubscription: Observable<string>;
  @Input() eventSaveAgGridStateSubscription: Observable<boolean>;
  @Input() eventModifyStatusOfSelectedCells: Observable<string>;
  @Input() eventAddItemsSubscription: Observable<any[]>;
  @Input() frameworkComponents: any;
  @Input() components: any;
  @Input() columnDefs: any[];
  @Input() getAll: () => Observable<any>;
  @Input() discardChangesButton: boolean;
  @Input() discardNonReverseStatus: boolean;
  @Input() id: any;
  @Input() undoButton: boolean;
  @Input() defaultColumnSorting: string[];
  @Input() redoButton: boolean;
  @Input() applyChangesButton: boolean;
  @Input() deleteButton: boolean;
  @Input() newButton: boolean;
  @Input() actionButton: boolean;
  @Input() addButton: boolean;
  @Input() registerButton: boolean;
  @Input() newStatusRegister: string;
  @Input() globalSearch: boolean;
  @Input() changeHeightButton: boolean;
  @Input() defaultHeight: any;
  @Input() singleSelection: boolean;
  @Input() nonEditable: boolean;
  @Input() title: string;
  @Input() hideExportButton: boolean;
  @Input() hideDuplicateButton: boolean;
  @Input() hideSearchReplaceButton: boolean;
  @Input() addFieldRestriction: any;
  @Input() allNewElements: any;
  @Input() currentData: any[] = null;
  @Input() fieldRestrictionWithDifferentName: string;


  @Output() remove: EventEmitter<any[]>;
  @Output() new: EventEmitter<number>;
  @Output() add: EventEmitter<any[]>;
  @Output() discardChanges: EventEmitter<any[]>;
  @Output() sendChanges: EventEmitter<any[]>;
  @Output() duplicate: EventEmitter<any[]>;
  @Output() getSelectedRows: EventEmitter<any[]>;
  @Output() getAllRows: EventEmitter<{data: any[], event:string}>;
  @Output() getAgGridState: EventEmitter<any[]>;
  @Output() gridModified: EventEmitter<boolean>;

  @Output() visible = new EventEmitter<HTMLElement>();

  @ViewChild('dataGrid', { static: true }) dataGrid: ElementRef;
  private observer: IntersectionObserver;

  constructor(public dialog: MatDialog,
    public translate: TranslateService,
    public utils: UtilsService,
  ) {

    this.remove = new EventEmitter();
    this.new = new EventEmitter();
    this.add = new EventEmitter();
    this.discardChanges= new EventEmitter();
    this.sendChanges = new EventEmitter();
    this.getSelectedRows = new EventEmitter();
    this.duplicate = new EventEmitter();
    this.getAllRows = new EventEmitter();
    this.gridModified = new EventEmitter();
    this.changeCounter = 0;
    this.previousChangeCounter = 0;
    this.redoCounter = 0;
    this.gridOptions = {
      onGridReady: this.onGridReady.bind(this),
      autoSizeStrategy: {
        type: 'fitCellContents',
      },
      defaultColDef: {
        filter: true,
        // floatingFilter: true,
        sortable: true,
        editable: !this.nonEditable,
        resizable: true,
        cellStyle: (params) => {
          if (params.value && params.colDef.editable) {
            if (this.changesMap.has(params.node.id) && this.changesMap.get(params.node.id).has(params.colDef.field)) {
              return {
                'background-color': '#E8F1DE',
              };
            } else {
              return {
                'background-color': 'white',
              };
            }
          } else {
            return {
              'background-color': 'white',
            };
          }
        },
      },
      rowSelection: 'multiple',
      singleClickEdit: true,
      suppressHorizontalScroll: false,
      getLocaleText: ({key, defaultValue}) => {
        const data = this.translate.instant(key);
        return data === key ? defaultValue : data;
      },
    }

    this.translate = translate;

    this.frameworkComponents = {
      btnEditRendererComponent: BtnEditRenderedComponent,
      btnCheckboxRendererComponent: BtnCheckboxRenderedComponent,
      btnCheckboxFilterComponent: BtnCheckboxFilterComponent
    };

    this.components = {
      datePicker: this.getDatePicker(),
      btnEditRendererComponent: BtnEditRenderedComponent,
      btnCheckboxRendererComponent: BtnCheckboxRenderedComponent,
      btnCheckboxFilterComponent: BtnCheckboxFilterComponent
    };
  }


  ngOnInit() : void {

    // Ensure that the grid is visible before autosizing columns.
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // The grid is visible, autosize all columns.
          this.gridApi?.autoSizeAllColumns();
        }
      });
    }, { threshold: 0.1 });
    this.observer.observe(this.dataGrid.nativeElement);

    if (this.eventRefreshSubscription) {
      this._eventRefreshSubscription = this.eventRefreshSubscription.subscribe(() => {
        this.changesMap.clear();
        this.someStatusHasChangedToDelete=false;
        this.changeCounter = 0;
        this.previousChangeCounter = 0;
        this.redoCounter = 0;
        this.onGridReady(this.params);
      });
    }
    if (this.eventGetSelectedRowsSubscription) {
      this._eventGetSelectedRowsSubscription = this.eventGetSelectedRowsSubscription.subscribe(() => {
        this.emitSelectedRows();
      });
    }
    if (this.eventGetAllRowsSubscription) {
      this._eventGetAllRowsSubscription = this.eventGetAllRowsSubscription.subscribe((event: string) => {
        this.emitAllRows(event);
      });
    }

    if (this.eventSaveAgGridStateSubscription) {
      this._eventSaveAgGridStateSubscription = this.eventSaveAgGridStateSubscription.subscribe(() => {
        this.saveAgGridState();
      });
    }

    if (this.eventModifyStatusOfSelectedCells) {
      this._eventModifyStatusOfSelectedCells = this.eventModifyStatusOfSelectedCells.subscribe((status: string) => {
        this.modifyStatusSelected(status);
      });
    }

    if (this.eventAddItemsSubscription) {
      this.eventAddItemsSubscription.subscribe(
        (items: any[]) => {
          this.addItems(items);
        });
    }
    this.loadData()
  }

  setLoading(value: boolean) {
    if (value) {
      this.gridApi?.showLoadingOverlay();
    } else {
      this.gridApi?.hideOverlay();
    }
  }

  loadData(): void {
    this.setLoading(true);
    this.dataSubscription = this.getAll().subscribe((data: any[]) => {
      const status = this.allNewElements?'pendingCreation':'statusOK'
      const newItems = [];
      const condition = (this.addFieldRestriction)? this.addFieldRestriction: 'id';
      data.forEach(element => {
        if(this.statusColumn){
          if(element.status != "notAvailable" && element.status != "pendingCreation" && element.status != "pendingRegistration" && element.status != "unregisteredLayer"){
            element.status=status
          }
          if(this.allNewElements) { element.new = true; }
        }
        if(this.currentData){
          if (this.checkElementAllowedToAdd(condition,element, this.currentData)) {
            newItems.push(element);
          }
        }

      });
      this.rowData = this.currentData?newItems: data;
      if(!this.gridApi?.isDestroyed()) {
        this.gridApi?.applyTransaction({ add: this.rowData });
      }
      this.isFirstLoad = false;
      this.setLoading(false);
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  firstDataRendered(): void {
    if (localStorage.agGridState != undefined) {
      const agGridState = JSON.parse(localStorage.agGridState)
      if (agGridState.idAgGrid != undefined && agGridState.idAgGrid == this.id) {
        this.gridApi.setFilterModel(agGridState.filterState);
        //this.gridApi.setColumnState(agGridState.colState);
        //this.gridApi.setSortModel(agGridState.sortState);
        this.gridApi.applyColumnState({
          state:agGridState.colState,
          applyOrder: true
        });
        this.searchValue = agGridState.valueSearchGeneric;
        this.removeAgGridState();
      } else if (this.id != undefined) {
        this.removeAgGridState();
      }
    }
  }

  onGridReady(params): void {
    this.params = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    if (this.singleSelection) { this.gridOptions.rowSelection = 'single' }
    // if (this.nonEditable) {this.gridOptions.defaultColDef.editable = false}
    for (const col of this.columnDefs) {
      if(!this.someColumnIsEditable && col.editable) { this.someColumnIsEditable = true}
      if (col.field === 'status') {
        this.statusColumn = true;
      }
    }
    this.loadData();

    if (this.defaultColumnSorting) {
      if(!Array.isArray(this.defaultColumnSorting))
      {
        const sortModel = [
          { colId: this.defaultColumnSorting, sort: 'asc' }
        ];
        //this.gridApi.setSortModel(sortModel);
        this.gridApi.applyColumnState({
          state:sortModel,
          applyOrder: true
        });
      }
      else{
        const sortModel = [];
        this.defaultColumnSorting.forEach(element => {
          sortModel.push({ colId: element, sort: 'asc' })
        });
        //this.gridApi.setSortModel(sortModel);
        this.gridApi?.applyColumnState({
          state:sortModel,
          applyOrder: true
        });
      }

    }
  }

  getDatePicker() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function Datepicker() {
    }
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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    Datepicker.prototype.destroy = function () {};
    Datepicker.prototype.isPopup = function () {
      return false;
    };
    return Datepicker;
  }

  areRowsSelected(): boolean {
    return (this.gridApi != null && this.gridApi?.getSelectedNodes().length > 0);
    // if (this.gridApi != null && this.gridApi.getSelectedNodes().length > 0) {
    //   return true
    // } else {
    //   return false
    // }
  }


  emitSelectedRows(): void {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    this.getSelectedRows.emit(selectedData);
  }

  emitAllRows(event: string): void {
    // let rowData = [];
    // this.gridApi.forEachNode(node => rowData.push(node.data));
    this.getAllRows.emit({data: this.getAllCurrentData(), event: event});
  }

  private getAllCurrentData(): any[]{
    const rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  modifyStatusSelected(status?: string): void{
    const newStatus=status?status:this.newStatusRegister;
    const selectedNodes = this.gridApi.getSelectedNodes();
    selectedNodes.map(node => {
      node.data.status=newStatus;
      node.selected=false;
    } );
    this.gridApi.redrawRows();
  }

  saveAgGridState(): void {
    const agGridState = {
      idAgGrid: this.id,
      colState: this.gridApi.getColumnState(),
      filterState: this.gridApi.getFilterModel(),
      //sortState: this.gridApi.getSortModel(),
      valueSearchGeneric: this.searchValue
    };

    localStorage.setItem("agGridState", JSON.stringify(agGridState));

  }
  removeAgGridState(): void {
    localStorage.removeItem("agGridState")
  }

  getColumnKeysAndHeaders(columnkeys: any[]): string {
    const header: any[] = [];
    if (this.columnDefs.length == 0) { return '' }

    //let allColumnKeys = this.gridOptions.columnApi.getAllDisplayedColumns();
    const allColumnKeys = this.gridApi.getAllDisplayedColumns()

    allColumnKeys.forEach(element => {
      if (element.userProvidedColDef.headerName !== '') {
        columnkeys.push(element.userProvidedColDef.field);
        header.push(element.userProvidedColDef.headerName);
      }


    });

    return header.join(",");
  }


  exportData(): void {
    const columnkeys: any[] = [];
    const customHeader= this.getColumnKeysAndHeaders(columnkeys)
    const params = {
      onlySelected: true,
      columnKeys: columnkeys,
      customHeader: customHeader,
      skipHeader: true
    };
    this.gridApi.exportDataAsCsv(params);
  }

  quickSearch(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const searchValue = input.value;
    this.gridApi.setGridOption('quickFilterText', searchValue);
  }

  addItems(newItems: any[]): void {

    const itemsToAdd: any[] = [];
    const condition = (this.addFieldRestriction)? this.addFieldRestriction: 'id';


    newItems.forEach(item => {

      if (this.checkElementAllowedToAdd(condition,item, this.rowData)) {
        if (this.statusColumn) {
          item.status = 'pendingCreation'
          item.newItem = true;
        }
        itemsToAdd.push(item);
        this.rowData.push(item);
      }
      else {
        this.utils.showErrorMessage({message: `Item already exists`})
      }
    });
    if(!this.gridApi?.isDestroyed()) {
      this.gridApi.applyTransaction({ add: itemsToAdd });
    }
  }

  private checkElementAllowedToAdd(condition, item, data){

    let finalAddition = true;

    if(Array.isArray(condition)){

      for(const element of data){
        let canAdd = false;

        for(const currentCondition of condition){
          if(element[currentCondition] != item[currentCondition]){
            canAdd = true;
            break;
          }
        }
        if(!canAdd) {
           finalAddition = false;
           break;
          }
      }
      return finalAddition;

    }
    else{
      if(this.fieldRestrictionWithDifferentName){
        return (item[condition] == undefined || (data.find(element => element[this.fieldRestrictionWithDifferentName] == item[condition])) == undefined)
      }
      return (item[condition] == undefined || (data.find(element => element[condition] == item[condition])) == undefined)
    }

  }

  removeData(): void {
    this.gridApi.stopEditing(false);
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    this.remove.emit(selectedData);

    if (this.statusColumn) {
      const selectedRows = selectedNodes.map(node => node.id);
      if(selectedRows.length>0) {this.someStatusHasChangedToDelete=true;}
      for (const id of selectedRows) {
        this.gridApi.getRowNode(id).data.status = 'pendingDelete';
      }
      this.gridApi.refreshCells();
    }
    this.gridApi.deselectAll();
  }

  newData(): void {
    this.gridApi.stopEditing(false);
    this.new.emit(-1);
  }

  onAddButtonClicked(): void {
    this.gridApi.stopEditing(false);
    this.add.emit(this.getAllCurrentData());
  }

  onDuplicateButtonClicked(): void {
    this.gridApi.stopEditing(false);
    if (this.changeCounter > 0) {
      const dialogRef = this.dialog.open(DialogMessageComponent);
      dialogRef.componentInstance.title = this.translate.instant('caution')
      dialogRef.componentInstance.message = this.translate.instant('duplicateMessage')
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
      //this.gridOptions.api.deselectAll();
      this.gridApi.deselectAll()
    }
  }


  applyChanges(): void {
    const itemsChanged: any[] = [];
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
    this.someStatusHasChangedToDelete=false;
    // this.params.colDef.cellStyle = { backgroundColor: '#FFFFFF' };
    this.gridApi.redrawRows();
  }



  deleteChanges(): void {
    this.gridApi.stopEditing(false);
    const newElementsActived= this.allNewElements;

    while (this.changeCounter > 0) {
      this.undo();
    }

    this.changesMap.clear();
    //this.previousChangeCounter = 0;
    this.redoCounter = 0;

    if(this.statusColumn && !this.discardNonReverseStatus)
    {
      const rowsWithStatusModified = [];
      this.gridApi.forEachNode(function(node) {
        if(node.data.status === 'pendingModify' || node.data.status === 'pendingDelete') {
          if(node.data.status === 'pendingDelete'){
            rowsWithStatusModified.push(node.data);
          }
          if(node.data.newItem || newElementsActived){
            node.data.status='pendingCreation'
          }
          else{
            node.data.status='statusOK'
          }
        }

    });
    this.someStatusHasChangedToDelete=false;
    this.discardChanges.emit(rowsWithStatusModified);
    this.gridModified.emit(false);
  }
  this.gridApi.redrawRows();

    //this.params.colDef.cellStyle =  {backgroundColor: '#FFFFFF'};
    //this.gridApi.redrawRows();
  }


  onFilterModified(): void {

    this.deleteChanges();

  }


  undo(): void {
    this.gridApi.stopEditing(false);
    this.gridApi.undoCellEditing();
    this.changeCounter -= 1;
    if(this.changeCounter == 0) { this.gridModified.emit(false)}
    this.redoCounter += 1;
  }

  redo(): void {
    this.gridApi.stopEditing(false);
    this.gridApi.redoCellEditing();
    this.changeCounter += 1;
    this.redoCounter -= 1;
  }


  onCellEditingStopped(params) {
    if (this.modificationChange) {
      this.changeCounter++;
      if(this.changeCounter == 1) { this.gridModified.emit(true)}
      this.redoCounter = 0;
      this.onCellValueChanged(params);
      this.modificationChange = false;
    }
  }


  onCellValueChanged(params): void {
    this.params = params;
    if (this.changeCounter > this.previousChangeCounter)
    // True if we have edited some cell or we have done a redo
    {

      if (params.oldValue !== params.value && !(params.oldValue == null && params.value === '')) {

        if (!this.changesMap.has(params.node.id)) // If it's first edit of a cell, we add it to the map and we paint it
        {
          const addMap: Map<string, number> = new Map<string, number>();
          addMap.set(params.colDef.field, 1)
          this.changesMap.set(params.node.id, addMap);
          if (this.statusColumn) {
            // if (this.gridApi.getRowNode(params.node.id).data.status !== 'pendingCreation') {
              this.gridApi.getRowNode(params.node.id).data.status = 'pendingModify'
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
      if (this.changesMap.has(params.node.id)) { currentChanges = this.changesMap.get(params.node.id).get(params.colDef.field); }

      if (currentChanges === 1) { //Once the undo it's done, cell is in his initial status

        this.changesMap.get(params.node.id).delete(params.colDef.field);
        if (this.changesMap.get(params.node.id).size === 0) { // No more modifications in this row
          this.changesMap.delete(params.node.id);
          const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
          if (this.statusColumn) {
            if (this.gridApi.getRowNode(params.node.id).data.status !== 'pendingCreation') {
              this.gridApi.getRowNode(params.node.id).data.status ='statusOK'
            }
          }
          // We paint it white
          this.gridApi.redrawRows({ rowNodes: [row] });

        }
        else {
          this.paintCells(params, this.changesMap);
        }

      }
      else if (currentChanges > 1) // The cell isn't in his initial state yet
      {                                 //We can't do else because we can be doing an undo without changes
        this.changesMap.get(params.node.id).set(params.colDef.field, (currentChanges - 1));

        this.paintCells(params, this.changesMap);//Not initial state -> green background

      }
      this.previousChangeCounter--;  //We decrement previousChangeCounter because we have done undo
    }
    else { // Control of modifications without changes
      if (!(params.oldValue == null && params.value === '')) {
        let newValue: string;
        if (params.value == null) { newValue = '' }
        else { newValue = params.value.toString() }

        if ((params.oldValue != undefined && params.oldValue.toString() !== newValue.toString()) || ((params.oldValue == undefined) && newValue != null)) {

          this.modificationChange = true;
          if (params.colDef.cellRenderer == "btnCheckboxRendererComponent") {
            const undoRedoActions = {
              cellValueChanges: this.gridApi.undoRedoService.cellValueChanges
            };
            this.gridApi.undoRedoService.pushActionsToUndoStack(undoRedoActions);
            this.gridApi.undoRedoService.isFilling = false;
            this.onCellEditingStopped(params);
          }
        }
        else { this.modificationWithoutChanges(params) }

      }
      else { this.modificationWithoutChanges(params) }
    }
  }

  modificationWithoutChanges(params: any) {

    if (this.changesMap.has(params.node.id)) //Modification without changes in en edited cell
    {
      if (!this.undoNoChanges) {
        this.gridApi.undoCellEditing(); // Undo to delete the change without changes internally
        this.undoNoChanges = true;
        this.paintCells(params, this.changesMap);  //The cell has modifications yet -> green background
      }
      else { this.undoNoChanges = false; }


    }
    else {
      //With the internally undo will enter at this function, so we have to control when done the undo or not
      if (!this.undoNoChanges) {
        this.gridApi.undoCellEditing(); // Undo to delete the change internally
        this.undoNoChanges = true;
      }
      else { this.undoNoChanges = false; }
    }

  }

  paintCells(params: any, changesMap: Map<string, Map<string, number>>,) {
    this.changesMap = changesMap;
    const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);

    // this.changeCellStyleColumns(params, changesMap, '#E8F1DE');
    this.gridApi.redrawRows({ rowNodes: [row] });
    // this.changeCellStyleColumns(params, changesMap, '#FFFFFF');
    // We will define cellStyle white to future modifications (like filter)
  }

  // changeCellStyleColumns(params: any, changesMap: Map<number, Map<string, number>>, color: string) {

  //   for (const key of changesMap.get(params.node.id).keys()) {
  //     const columnNumber = this.getColumnIndexByColId(this.gridColumnApi, key);
  //     this.gridColumnApi.columnController.gridColumns[columnNumber].colDef.cellStyle = { backgroundColor: color };
  //   }


  // }

  @Input() redraw!: boolean;
  @Input() eventReplaceAllItemsSubscription!: Observable<any>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rowData && !changes.rowData.firstChange) {
      this.updateGridData(changes.rowData.currentValue);
    }
    if (changes.redraw?.currentValue && this.gridApi) {
      this.gridApi.autoSizeAllColumns();
      // this.gridApi.sizeColumnsToFit();
    }
  }

  updateGridData(newData: any[]): void {
    if (this.gridApi) {
      this.gridApi.setRowData(newData);
    }
  }
}
