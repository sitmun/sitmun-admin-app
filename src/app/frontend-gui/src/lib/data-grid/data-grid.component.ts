import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import {firstValueFrom, Observable, Subscription} from 'rxjs';
import {GridOptions, ModuleRegistry,} from '@ag-grid-community/core';
import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';
import {CsvExportModule} from '@ag-grid-community/csv-export';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {BtnEditRenderedComponent} from '@app/frontend-gui/src/lib/btn-edit-rendered/btn-edit-rendered.component';
import {
  BtnCheckboxRenderedComponent
} from '@app/frontend-gui/src/lib/btn-checkbox-rendered/btn-checkbox-rendered.component';
import {BtnCheckboxFilterComponent} from '@app/frontend-gui/src/lib/btn-checkbox-filter/btn-checkbox-filter.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {DialogMessageComponent} from '@app/frontend-gui/src/lib/dialog-message/dialog-message.component';
import {CommonModule} from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';
import {AgGridModule} from '@ag-grid-community/angular';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {UtilsService} from '@app/services/utils.service';
import {LoggerService} from '@app/services/logger.service';
import {RouterLinkRendererComponent} from '../router-link-renderer/router-link-renderer.component';
import {EditableLinkRendererComponent} from '../editable-link-renderer/editable-link-renderer.component';

// Removed jQuery dependency

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule
]);

export type GridEventType = "save"

type StatusType =
  'notAvailable'
  | 'statusOK'
  | 'pendingCreation'
  | 'pendingModify'
  | 'pendingDelete'
  | 'pendingRegistration'
  | 'unregisteredLayer';

export interface Status {
  status: StatusType;

  newItem: boolean;
}

export function isActive(item: Status): boolean {
  return item.status === 'statusOK' || item.status === 'pendingModify' || item.status === 'pendingCreation';
}

export function isRegistered(item: Status): boolean {
  return item.status === 'statusOK' || item.status === 'pendingModify' || item.status === 'pendingDelete';
}

export function canDelete(status: Status): boolean {
  return status.status === 'pendingDelete' && !status.newItem;
}

export interface GridEvent<T> {
  event: string

  data: (T & Status)[]
}

export function isSave<T>(event: GridEvent<T>): boolean {
  return event.event === 'save';
}

export function canUpdate(status: Status): boolean {
  return status.status === 'pendingModify'
}

export function canKeepOrUpdate(status: Status): boolean {
  return status.status !== 'pendingDelete'
}

export function canCreate(status: Status): boolean {
  return status.status === 'pendingCreation'
}

export function canRegistry(status: Status): boolean {
  return status.status === 'pendingRegistration'
}

export function notAvailable(status: Status): boolean {
  return status.status === 'notAvailable'
}

export function onNotAvailable<T>(data: (T & Status)[]): Executor<T> {
  return new Executor(data.filter(notAvailable))
}


export function onCreate<T>(data: (T & Status)[]): Executor<T> {
  return new Executor(data.filter(canCreate))
}

export function onDelete<T>(data: (T & Status)[]): Executor<T> {
  return new Executor(data.filter(canDelete))
}

export function onUpdate<T>(data: (T & Status)[]): Executor<T> {
  return new Executor(data.filter(canUpdate))
}

export function onPendingRegistration<T>(data: (T & Status)[]): Executor<T> {
  return new Executor(data.filter(canRegistry))
}

export function onUpdatedRelation<T>(data: (T & Status)[]): Executor<T> {
  return new Executor(data.filter(canKeepOrUpdate))
}

export class Executor<T> {
  constructor(public readonly data: T[]) {
  }

  async forAll<S>(func: (item: T[]) => Observable<S | Observable<never>>): Promise<S | Observable<never>> {
    return firstValueFrom(func(this.data));
  }

  map<S>(func: (item: T) => S): Executor<S> {
    return new Executor(this.data.map(func));
  }

  async forEach<S>(func: (item: T) => Observable<S | Observable<never>>): Promise<(S | Observable<never>)[]> {
    const results = [];
    for (const item of this.data) {
      results.push(await firstValueFrom(func(item)));
    }
    return results;
  }
}

/**
 * A feature-rich Angular wrapper around AG Grid providing advanced data grid functionality.
 * Supports CRUD operations, state management, undo/redo, search/replace, and more.
 *
 * @example
 * ```typescript
 * <app-data-grid
 *   [columnDefs]="columnDefinitions"
 *   [getAll]="fetchDataFunction"
 *   [undoButton]="true"
 *   [redoButton]="true"
 *   [globalSearch]="true"
 *   (sendChanges)="onChangesSaved($event)"
 *   (gridModified)="onGridModified($event)">
 * </app-data-grid>
 * ```
 */
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
    FormsModule,
  ]
})
export class DataGridComponent implements OnInit, OnDestroy, OnChanges {
  /** Tracks if this is the first time loading data */
  isFirstLoad = true;

  /** Subscription for data loading */
  dataSubscription!: Subscription;

  /** Subscription for grid refresh events */
  _eventRefreshSubscription: any;

  /** Subscription for getting selected rows */
  _eventGetSelectedRowsSubscription: any;

  /** Subscription for getting all rows */
  _eventGetAllRowsSubscription: any;

  /** Subscription for saving grid state */
  _eventSaveAgGridStateSubscription: any;

  /** Subscription for modifying status of selected cells */
  _eventModifyStatusOfSelectedCells: any;

  /** Current search value for quick search */
  searchValue: string;

  /** Reference to AG Grid API */
  gridApi: any;

  /** Reference to AG Grid Column API */
  gridColumnApi: any;

  /** Flag indicating if status column is present */
  statusColumn = false;

  /** Flag indicating if any column is editable */
  someColumnIsEditable = false;

  /** Map tracking changes to cells */
  changesMap: Map<string, Map<string, number>> = new Map<string, Map<string, number>>();

  /** Last parameters of the grid */
  params: any;

  /** Current row data */
  rowData: any[];

  /** Number of editions done above any cell */
  changeCounter: number;

  /** Number of editions done after the last modification */
  previousChangeCounter: number;

  /** Number of redo operations available */
  redoCounter: number;

  /** Flag indicating if a modification change occurred */
  modificationChange = false;

  /** Flag indicating if an undo has no modifications */
  undoNoChanges = false;

  /** AG Grid options configuration */
  gridOptions: GridOptions;

  /** Flag indicating if any status has changed to delete */
  someStatusHasChangedToDelete = false;

  /** Observable triggering grid refresh */
  @Input() eventRefreshSubscription: Observable<boolean>;

  /** Observable triggering selected rows emission */
  @Input() eventGetSelectedRowsSubscription: Observable<boolean>;

  /** Observable triggering all rows emission */
  @Input() eventGetAllRowsSubscription: Observable<GridEventType>;

  /** Observable triggering grid state save */
  @Input() eventSaveAgGridStateSubscription: Observable<boolean>;

  /** Observable triggering status modification of selected cells */
  @Input() eventModifyStatusOfSelectedCells: Observable<string>;

  /** Observable for adding new items */
  @Input() eventAddItemsSubscription: Observable<any[]>;

  /** Custom framework components */
  @Input() frameworkComponents: any;

  /** Grid components */
  @Input() components: any;

  /** Column definitions */
  @Input() columnDefs: any[];

  /** Function to fetch all data */
  @Input() getAll: () => Observable<any>;

  /** Flag to show/hide discard changes button */
  @Input() discardChangesButton: boolean;

  /** Flag to discard non-reverse status */
  @Input() discardNonReverseStatus: boolean;

  /** Grid identifier */
  @Input() id: any;

  /** Flag to show/hide undo button */
  @Input() undoButton: boolean;

  /** Default column sorting configuration */
  @Input() defaultColumnSorting: string[];

  /** Flag to show/hide redo button */
  @Input() redoButton: boolean;

  /** Flag to show/hide apply changes button */
  @Input() applyChangesButton: boolean;

  /** Flag to show/hide delete button */
  @Input() deleteButton: boolean;

  /** Flag to show/hide new button */
  @Input() newButton: boolean;

  /** Flag to show/hide action button */
  @Input() actionButton: boolean;

  /** Flag to show/hide add button */
  @Input() addButton: boolean;

  /** Flag to show/hide register button */
  @Input() registerButton: boolean;

  /** New status for registration */
  @Input() newStatusRegister: string;

  /** Flag to enable/disable global search */
  @Input() globalSearch: boolean;

  /** Flag to show/hide change height button */
  @Input() changeHeightButton: boolean;

  /** Default height configuration */
  @Input() defaultHeight: any;

  /** Flag for single selection mode */
  @Input() singleSelection: boolean;

  /** Flag for non-editable mode */
  @Input() nonEditable: boolean;

  /** Grid title */
  @Input() title: string;

  /** Flag to hide export button */
  @Input() hideExportButton: boolean;

  /** Flag to hide duplicate button */
  @Input() hideDuplicateButton: boolean;

  /** Flag to hide search/replace button */
  @Input() hideSearchReplaceButton: boolean;

  /** Flag to hide replace button */
  @Input() hideReplaceButton = false;

  /** Field restriction configuration */
  @Input() addFieldRestriction: any;

  /** Configuration for all new elements */
  @Input() allNewElements: any;

  /** Current data array */
  @Input() currentData: any[] = null;

  /** Field restriction with different name */
  @Input() fieldRestrictionWithDifferentName: string;

  /** Event emitter for remove operation */
  @Output() remove: EventEmitter<any[]>;

  /** Event emitter for new operation */
  @Output() new: EventEmitter<number>;

  /** Event emitter for add operation */
  @Output() add: EventEmitter<any[]>;

  /** Event emitter for discard changes */
  @Output() discardChanges: EventEmitter<any[]>;

  /** Event emitter for sending changes */
  @Output() sendChanges: EventEmitter<any[]>;

  /** Event emitter for duplicate operation */
  @Output() duplicate: EventEmitter<any[]>;

  /** Event emitter for selected rows */
  @Output() getSelectedRows: EventEmitter<any[]>;

  /** Event emitter for all rows */
  @Output() getAllRows: EventEmitter<{ data: any[], event: string }>;

  /** Event emitter for grid modified state */
  @Output() gridModified: EventEmitter<boolean>;

  /** Event emitter for visibility state */
  @Output() visible = new EventEmitter<HTMLElement>();

  /** Reference to the data grid element */
  @ViewChild('dataGrid', {static: true}) dataGrid: ElementRef;

  /** Intersection observer for grid visibility */
  private observer: IntersectionObserver;

  /** Current replace value for search/replace operation */
  replaceValue = '';

  constructor(public dialog: MatDialog,
              public translate: TranslateService,
              public utils: UtilsService,
              private loggerService: LoggerService,
  ) {

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
      onGridReady: this.onGridReady.bind(this),
      autoSizeStrategy: {
        type: 'fitCellContents'
      },
      defaultColDef: {
        filter: true,
        sortable: true,
        editable: !this.nonEditable,
        resizable: true,
        minWidth: 100,
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
      suppressHorizontalScroll: false,
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
      btnCheckboxFilterComponent: BtnCheckboxFilterComponent,
      routerLinkRenderer: RouterLinkRendererComponent,
      editableLinkRenderer: EditableLinkRendererComponent
    };
  }

  /**
   * Handles component initialization
   */
  ngOnInit(): void {

    // Ensure that the grid is visible before autosizing columns.
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // The grid is visible, autosize all columns.
          this.gridApi?.autoSizeAllColumns();
        }
      });
    }, {threshold: 0.1});
    this.observer.observe(this.dataGrid.nativeElement);

    if (this.eventRefreshSubscription) {
      this._eventRefreshSubscription = this.eventRefreshSubscription.subscribe(() => {
        this.changesMap.clear();
        this.someStatusHasChangedToDelete = false;
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
      this._eventGetAllRowsSubscription = this.eventGetAllRowsSubscription.subscribe((event: GridEventType) => {
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

  /**
   * Sets the loading state of the grid
   * @param value - True to show loading overlay, false to hide
   */
  setLoading(value: boolean) {
    if (value) {
      this.gridApi?.showLoadingOverlay();
    } else {
      this.gridApi?.hideOverlay();
    }
  }

  /**
   * Loads data into the grid
   */
  loadData(): void {
    this.setLoading(true);
    this.dataSubscription = this.getAll().subscribe({
      next: (data: Status[]) => {
        const status = this.allNewElements ? 'pendingCreation' : 'statusOK';
        const newItems = [];
        const condition = (this.addFieldRestriction) ? this.addFieldRestriction : 'id';

        data.forEach(element => {
          if (this.statusColumn) {
            if (isRegistered(element)) {
              element.status = status;
            }
            if (this.allNewElements) {
              element.status = 'pendingCreation'
              element.newItem = true;
            }
          }
          if (this.currentData) {
            if (this.checkElementAllowedToAdd(condition, element, this.currentData)) {
              newItems.push(element);
            }
          }
        });

        this.rowData = this.currentData ? newItems : data;

        if (this.gridApi && !this.gridApi.isDestroyed()) {
          // Set the data
          this.gridApi.setGridOption('rowData', this.rowData);

          // Wait for next frame to ensure DOM is updated
          requestAnimationFrame(() => {
            if (this.gridApi && !this.gridApi.isDestroyed()) {
              // Ensure columns are sized properly
              this.gridApi.autoSizeAllColumns();
            }
          });
        }

        this.isFirstLoad = false;
        this.setLoading(false);
      },
      error: (error) => {
        this.loggerService.error('Error loading data:', error);
        this.setLoading(false);
      }
    });
  }

  /**
   * Handles component destruction
   * Cleans up subscriptions and observers
   */
  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  /**
   * Handles first data rendered event
   * Restores saved grid state if available
   */
  firstDataRendered(): void {
    // First handle saved grid state if it exists
    if (localStorage.agGridState != undefined) {
      const agGridState = JSON.parse(localStorage.agGridState)
      if (agGridState.idAgGrid != undefined && agGridState.idAgGrid == this.id) {
        this.gridApi.setFilterModel(agGridState.filterState);
        this.gridApi.applyColumnState({
          state: agGridState.colState,
          applyOrder: true
        });
        this.searchValue = agGridState.valueSearchGeneric;
        this.removeAgGridState();
      } else if (this.id != undefined) {
        this.removeAgGridState();
      }
    }

    // Ensure columns are sized properly after data is rendered
    if (this.gridApi && !this.gridApi.isDestroyed()) {
      this.safeSizeColumnsToFit();
    }
  }

  /**
   * Handles grid ready event
   * Initializes grid API and loads initial data
   * @param params - Grid ready event parameters
   */
  onGridReady(params): void {
    this.params = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    if (this.singleSelection) {
      this.gridOptions.rowSelection = 'single'
    }

    // Configure column sizes and flex
    this.columnDefs.forEach((col, index) => {
      // Ensure each column has minimum width
      col.minWidth = col.minWidth ?? 100;

      // Special handling for specific columns
      if (col.field === 'status') {
        this.statusColumn = true;
        col.minWidth = 200; // Status needs more space
      }

      // Set flex based on column position
      if (index === this.columnDefs.length - 1) {
        // Last column gets flex to fill remaining space
        col.flex = 1;
      } else {
        // Other columns don't flex
        col.flex = 0;
        // Use width instead of flex for non-last columns
        col.width = col.width ?? 150; // Default width for non-flex columns
      }

      if (col.editable) {
        this.someColumnIsEditable = true;
      }
    });

    // Apply the updated column definitions
    this.gridApi.updateGridOptions({columnDefs: this.columnDefs});

    // Set initial column state before loading data
    if (this.defaultColumnSorting) {
      if (!Array.isArray(this.defaultColumnSorting)) {
        const sortModel = [
          {colId: this.defaultColumnSorting, sort: 'asc'}
        ];
        this.gridApi.applyColumnState({
          state: sortModel,
          applyOrder: true
        });
      } else {
        const sortModel = [];
        this.defaultColumnSorting.forEach(element => {
          sortModel.push({colId: element, sort: 'asc'})
        });
        this.gridApi?.applyColumnState({
          state: sortModel,
          applyOrder: true
        });
      }
    }

    // Load data after grid is ready
    this.loadData();
  }

  /**
   * Safely sizes columns to fit with proper checks for grid width
   */
  private safeSizeColumnsToFit(): void {
    if (!this.gridApi || this.gridApi.isDestroyed()) {
      return;
    }

    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      if (this.gridApi && !this.gridApi.isDestroyed()) {
        try {
          // Only use autoSizeAllColumns to avoid the width warning
          this.gridApi.autoSizeAllColumns();
        } catch (error) {
          // If autoSizeAllColumns fails, try again after a delay
          setTimeout(() => {
            if (this.gridApi && !this.gridApi.isDestroyed()) {
              try {
                this.gridApi.autoSizeAllColumns();
              } catch (retryError) {
                // Final fallback - do nothing if all else fails
                console.warn(`AG Grid: Could not auto-size columns: first fail ${error}, next ${retryError}`);
              }
            }
          }, 200);
        }
      }
    });
  }

  /**
   * Creates a date picker component for the grid
   * @returns Date picker component instance
   */
  getDatePicker() {
    function toInputDate(value: any): string {
      if (!value) return '';
      try {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return '';
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      } catch {
        return '';
      }
    }

    // Simple native date input editor (no jQuery)
    function NativeDatepicker(this: any) {
    }

    NativeDatepicker.prototype.init = function (params: any) {
      this.eInput = document.createElement('input');
      this.eInput.type = 'date';
      this.eInput.classList.add('ag-input');
      this.eInput.style.height = '100%';
      this.eInput.value = toInputDate(params.value);
    };

    NativeDatepicker.prototype.getGui = function () {
      return this.eInput;
    };

    NativeDatepicker.prototype.afterGuiAttached = function () {
      this.eInput.focus();
      this.eInput.select();
    };

    NativeDatepicker.prototype.getValue = function () {
      return this.eInput.value;
    };

    NativeDatepicker.prototype.destroy = function () {
    };

    NativeDatepicker.prototype.isPopup = function () {
      return false;
    };

    return NativeDatepicker;
  }

  /**
   * Checks if rows are selected in the grid
   * @returns True if any rows are selected, false otherwise
   */
  areRowsSelected(): boolean {
    return (this.gridApi != null && this.gridApi?.getSelectedNodes().length > 0);
    // if (this.gridApi != null && this.gridApi.getSelectedNodes().length > 0) {
    //   return true
    // } else {
    //   return false
    // }
  }

  /**
   * Checks if rows are selected in the grid
   * @returns True if any rows are selected, false otherwise
   */
  oneRowSelected(): boolean {
    return (this.gridApi != null && this.gridApi?.getSelectedNodes().length == 1);
  }


  /**
   * Emits currently selected rows
   */
  emitSelectedRows(): void {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    this.getSelectedRows.emit(selectedData);
  }

  /**
   * Emits all rows with specified event type
   * @param event - The grid event type
   */
  emitAllRows(event: GridEventType): void {
    if (event === "save") {
      this.applyChanges();
    }
    this.getAllRows.emit({data: this.getAllCurrentData(), event: event});
  }

  /**
   * Gets all current data from the grid
   * @returns Array of all current row data
   * @private
   */
  private getAllCurrentData(): any[] {
    const rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  /**
   * Modifies the status of selected cells
   * @param status - Optional status to set
   */
  modifyStatusSelected(status?: string): void {
    const newStatus = status ? status : this.newStatusRegister;
    const selectedNodes = this.gridApi.getSelectedNodes();
    selectedNodes.map(node => {
      node.data.status = newStatus;
      node.selected = false;
    });
    this.gridApi.redrawRows();
  }

  /**
   * Saves the current grid state to localStorage
   */
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

  /**
   * Removes the saved grid state from localStorage
   */
  removeAgGridState(): void {
    localStorage.removeItem("agGridState")
  }

  /**
   * Gets column keys and headers
   * @param columnkeys - Array to store column keys
   * @returns Comma-separated string of headers
   */
  getColumnKeysAndHeaders(columnkeys: any[]): string {
    const header: any[] = [];
    if (this.columnDefs.length == 0) {
      return ''
    }

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


  /**
   * Exports grid data to CSV
   */
  exportData(): void {
    const columnkeys: any[] = [];
    const customHeader = this.getColumnKeysAndHeaders(columnkeys)
    const params = {
      onlySelected: true,
      columnKeys: columnkeys,
      customHeader: customHeader,
      skipHeader: true
    };
    this.gridApi.exportDataAsCsv(params);
  }

  /**
   * Applies all pending changes in the grid
   * Updates the grid state, saves changes, and refreshes the display
   */
  applyChanges(): void {
    this.loggerService.debug('DataGridComponent applyChanges - Starting');

    if (!this.gridApi) {
      this.loggerService.warn('Grid API is not available');
      return;
    }

    // Store current grid state
    const currentFilterModel = this.gridApi.getFilterModel();
    const currentQuickFilter = this.searchValue;
    const currentSortModel = this.gridApi.getColumnState();

    this.loggerService.debug('Current grid state:', {
      filterModel: currentFilterModel,
      quickFilter: currentQuickFilter,
      sortModel: currentSortModel
    });

    // Collect changed items
    const itemsChanged: any[] = [];
    this.gridApi.stopEditing(false);
    for (const key of this.changesMap.keys()) {
      itemsChanged.push(this.gridApi.getRowNode(key).data);
    }

    this.loggerService.debug('Items to be saved:', itemsChanged);

    // Emit changes and reset change tracking
    this.sendChanges.emit(itemsChanged);
    this.gridModified.emit(false);
    this.changesMap.clear();
    this.changeCounter = 0;
    this.previousChangeCounter = 0;
    this.redoCounter = 0;
    this.someStatusHasChangedToDelete = false;

    // Get current data
    const currentData = this.getAllCurrentData();
    this.loggerService.debug('Current data count:', currentData.length);

    // Store reference to gridApi to ensure it's available in requestAnimationFrame
    const api = this.gridApi;

    // Update the grid data
    api.setGridOption('rowData', currentData);

    // Use requestAnimationFrame to ensure UI is updated properly
    requestAnimationFrame(() => {
      if (api && !api.isDestroyed()) {
        // Restore grid state
        if (currentQuickFilter) {
          api.setGridOption('quickFilterText', currentQuickFilter);
          this.searchValue = currentQuickFilter;
        }

        if (Object.keys(currentFilterModel).length > 0) {
          api.setFilterModel(currentFilterModel);
        }

        if (currentSortModel) {
          api.applyColumnState({
            state: currentSortModel,
            applyOrder: true
          });
        }

        api.redrawRows();

        this.loggerService.debug('Grid state after update:', {
          rowCount: api.getDisplayedRowCount(),
          filterModel: api.getFilterModel(),
          quickFilter: this.searchValue,
          sortModel: api.getColumnState()
        });
      } else {
        this.loggerService.warn('Grid API was destroyed during update');
      }
    });
  }

  /**
   * Performs quick search across all grid columns
   * @param event - Keyboard event containing search input
   */
  quickSearch(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    this.searchValue = input.value;
    if (this.gridApi) {
      // Set quickFilterText to empty string when search is cleared
      this.gridApi.setGridOption('quickFilterText', this.searchValue || '');
      // Ensure the grid is properly refreshed
      this.gridApi.onFilterChanged();
      this.gridApi.onSortChanged();
    }
  }

  /**
   * Adds new items to the grid
   * @param newItems - Array of items to add
   */
  addItems(newItems: any[]): void {

    const itemsToAdd: any[] = [];
    const condition = (this.addFieldRestriction) ? this.addFieldRestriction : 'id';


    newItems.forEach(item => {

      if (this.checkElementAllowedToAdd(condition, item, this.rowData)) {
        if (this.statusColumn) {
          item.status = 'pendingCreation'
          item.newItem = true;
        }
        itemsToAdd.push(item);
        this.rowData.push(item);
      } else {
        this.utils.showErrorMessage({message: `Item already exists`})
      }
    });
    if (!this.gridApi?.isDestroyed()) {
      this.gridApi.applyTransaction({add: itemsToAdd});
    }
  }

  /**
   * Checks if an element is allowed to be added based on specified conditions
   * @param condition - The condition to check against
   * @param item - The item to check
   * @param data - The existing data to compare against
   * @returns boolean indicating if the element can be added
   * @private
   */
  private checkElementAllowedToAdd(condition, item, data) {

    let finalAddition = true;

    if (Array.isArray(condition)) {

      for (const element of data) {
        let canAdd = false;

        for (const currentCondition of condition) {
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

    } else {
      if (this.fieldRestrictionWithDifferentName) {
        return (item[condition] == undefined || (data.find(element => element[this.fieldRestrictionWithDifferentName] == item[condition])) == undefined)
      }
      return (item[condition] == undefined || (data.find(element => element[condition] == item[condition])) == undefined)
    }

  }

  /**
   * Removes selected data from the grid
   */
  removeData(): void {
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
      this.gridApi.refreshCells();
    }
    this.gridApi.deselectAll();
  }

  /**
   * Triggers creation of new data
   */
  newData(): void {
    this.gridApi.stopEditing(false);
    this.new.emit(-1);
  }

  /**
   * Handles add button click event
   */
  onAddButtonClicked(): void {
    this.gridApi.stopEditing(false);
    this.add.emit(this.getAllCurrentData());
  }

  /**
   * Handles duplicate button click event
   * Shows confirmation dialog if there are pending changes
   */
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

    } else {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      this.duplicate.emit(selectedData);
      //this.gridOptions.api.deselectAll();
      console.log("emited event of duplication")
      this.gridApi.deselectAll()
    }
  }


  /**
   * Deletes all pending changes and reverts the grid to its original state
   */
  deleteChanges(): void {
    this.gridApi.stopEditing(false);
    const newElementsActived = this.allNewElements;

    while (this.changeCounter > 0) {
      this.undo();
    }

    this.changesMap.clear();
    //this.previousChangeCounter = 0;
    this.redoCounter = 0;

    if (this.statusColumn && !this.discardNonReverseStatus) {
      const rowsWithStatusModified = [];
      this.gridApi.forEachNode(function (node) {
        if (node.data.status === 'pendingModify' || node.data.status === 'pendingDelete') {
          if (node.data.status === 'pendingDelete') {
            rowsWithStatusModified.push(node.data);
          }
          if (node.data.newItem || newElementsActived) {
            node.data.status = 'pendingCreation'
          } else {
            node.data.status = 'statusOK'
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
   * Handles filter modification events
   */
  onFilterModified(): void {

    this.deleteChanges();

  }


  /**
   * Performs undo operation on the last cell edit
   */
  undo(): void {
    this.gridApi.stopEditing(false);
    this.gridApi.undoCellEditing();
    this.changeCounter -= 1;
    if (this.changeCounter == 0) {
      this.gridModified.emit(false)
    }
    this.redoCounter += 1;
  }

  /**
   * Performs redo operation on the last undone edit
   */
  redo(): void {
    this.gridApi.stopEditing(false);
    this.gridApi.redoCellEditing();
    this.changeCounter += 1;
    this.redoCounter -= 1;
  }


  /**
   * Handles cell editing stopped event
   * @param params - Cell editing parameters
   */
  onCellEditingStopped(params) {
    if (this.modificationChange) {
      this.changeCounter++;
      if (this.changeCounter == 1) {
        this.gridModified.emit(true)
      }
      this.redoCounter = 0;
      this.onCellValueChanged(params);
      this.modificationChange = false;
    }
  }


  /**
   * Handles cell value changed event
   * Updates change tracking and cell styling
   * @param params - Cell value change parameters
   */
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
        } else {
          if (!this.changesMap.get(params.node.id).has(params.colDef.field)) {

            this.changesMap.get(params.node.id).set(params.colDef.field, 1);
          } else {
            // We already had edited this cell, so we only increment number of changes of it on the map
            const currentChanges = this.changesMap.get(params.node.id).get(params.colDef.field);
            this.changesMap.get(params.node.id).set(params.colDef.field, (currentChanges + 1));
          }

        }
        this.paintCells(params, this.changesMap); //We paint the row of the edited cell
        this.previousChangeCounter++; //We match the current previousChangeCounter with changeCounter
      }

    } else if (this.changeCounter < this.previousChangeCounter) { // True if we have done an undo
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
              this.gridApi.getRowNode(params.node.id).data.status = 'statusOK'
            }
          }
          // We paint it white
          this.gridApi.redrawRows({rowNodes: [row]});

        } else {
          this.paintCells(params, this.changesMap);
        }

      } else if (currentChanges > 1) // The cell isn't in his initial state yet
      {                                 //We can't do else because we can be doing an undo without changes
        this.changesMap.get(params.node.id).set(params.colDef.field, (currentChanges - 1));

        this.paintCells(params, this.changesMap);//Not initial state -> green background

      }
      this.previousChangeCounter--;  //We decrement previousChangeCounter because we have done undo
    } else { // Control of modifications without changes
      if (!(params.oldValue == null && params.value === '')) {
        let newValue: string;
        if (params.value == null) {
          newValue = ''
        } else {
          newValue = params.value.toString()
        }

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
        } else {
          this.modificationWithoutChanges(params)
        }

      } else {
        this.modificationWithoutChanges(params)
      }
    }
  }

  /**
   * Handles modifications that don't result in actual changes
   * @param params - Cell parameters
   * @private
   */
  private modificationWithoutChanges(params: any) {

    if (this.changesMap.has(params.node.id)) //Modification without changes in en edited cell
    {
      if (!this.undoNoChanges) {
        this.gridApi.undoCellEditing(); // Undo to delete the change without changes internally
        this.undoNoChanges = true;
        this.paintCells(params, this.changesMap);  //The cell has modifications yet -> green background
      } else {
        this.undoNoChanges = false;
      }


    } else {
      //With the internally undo will enter at this function, so we have to control when done the undo or not
      if (!this.undoNoChanges) {
        this.gridApi.undoCellEditing(); // Undo to delete the change internally
        this.undoNoChanges = true;
      } else {
        this.undoNoChanges = false;
      }
    }

  }

  /**
   * Updates cell styling based on changes
   * @param params - Cell parameters
   * @param changesMap - Map of changes to apply
   */
  paintCells(params: any, changesMap: Map<string, Map<string, number>>,) {
    this.changesMap = changesMap;
    const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);

    // this.changeCellStyleColumns(params, changesMap, '#E8F1DE');
    this.gridApi.redrawRows({rowNodes: [row]});
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

  /**
   * Handles changes to component inputs
   * @param changes - SimpleChanges object containing changed properties
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rowData && !changes.rowData.firstChange) {
      this.updateGridData(changes.rowData.currentValue);
    }
    if (changes.redraw?.currentValue && this.gridApi) {
      this.gridApi.autoSizeAllColumns();
      // this.gridApi.sizeColumnsToFit();
    }
  }

  /**
   * Updates the grid data
   * @param newData - New data to display in the grid
   */
  updateGridData(newData: any[]): void {
    if (this.gridApi && !this.gridApi.isDestroyed()) {
      this.gridApi.setGridOption('rowData', newData);
    }
  }

  /**
   * Replaces text in selected rows
   * Performs a global search and replace operation on all editable string fields
   */
  replaceSelected(): void {
    this.loggerService.debug('Starting replace operation', {
      searchValue: this.searchValue,
      replaceValue: this.replaceValue
    });

    if (!this.gridApi || !this.replaceValue) {
      this.loggerService.warn('Cannot replace: missing grid API or replace value');
      return;
    }

    const selectedNodes = this.gridApi.getSelectedNodes();
    if (!selectedNodes.length) {
      this.loggerService.warn('No rows selected for replace operation');
      return;
    }

    const searchValue = this.searchValue;
    if (!searchValue) {
      this.loggerService.warn('No search value provided for replace operation');
      return;
    }

    let hasChanges = false;
    selectedNodes.forEach(node => {
      const row = node.data;
      Object.keys(row).forEach(key => {
        const column = this.gridApi.getColumn(key);
        if (column && column.getColDef().editable !== false && typeof row[key] === 'string') {
          const searchRegex = new RegExp(searchValue, 'gi');
          const originalValue = row[key];

          if (searchRegex.test(originalValue)) {
            const newValue = originalValue.replace(searchRegex, this.replaceValue);

            if (originalValue !== newValue) {
              hasChanges = true;
              row[key] = newValue;

              if (this.statusColumn && row.status !== 'pendingDelete' && row.status !== 'pendingCreation') {
                row.status = 'pendingModify';
              }

              if (!this.changesMap.has(node.id)) {
                const addMap = new Map<string, number>();
                addMap.set(key, 1);
                this.changesMap.set(node.id, addMap);
              } else if (!this.changesMap.get(node.id).has(key)) {
                this.changesMap.get(node.id).set(key, 1);
              } else {
                const currentChanges = this.changesMap.get(node.id).get(key);
                this.changesMap.get(node.id).set(key, currentChanges + 1);
              }

              this.changeCounter++;
              if (this.changeCounter === 1) {
                this.gridModified.emit(true);
              }
            }
          }
        }
      });
    });

    if (hasChanges) {
      this.loggerService.debug('Replace operation completed with changes');
      this.gridApi.refreshCells({
        force: true,
        rowNodes: selectedNodes
      });
    } else {
      this.loggerService.debug('Replace operation completed with no changes');
    }
  }
}
