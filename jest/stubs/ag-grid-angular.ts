import {Component, EventEmitter, Input, NgModule, Output} from '@angular/core';

@Component({
  selector: 'ag-grid-angular',
  standalone: false,
  template: ''
})
export class AgGridAngular {
  @Input() rowData: unknown;
  @Input() columnDefs: unknown;
  @Input() gridOptions: unknown;
  @Input() animateRows: unknown;
  @Input() pagination: unknown;
  @Input() undoRedoCellEditing: unknown;
  @Input() undoRedoCellEditingLimit: unknown;
  @Input() suppressRowClickSelection: unknown;
  @Input() rowDragManaged: unknown;
  @Input() components: unknown;
  @Input() rowSelection: unknown;
  @Input() multiSortKey: unknown;
  @Input() domLayout: unknown;
  @Input() rowModelType: unknown;
  @Input() cacheBlockSize: unknown;
  @Input() rowHeight: unknown;
  @Input() maxConcurrentDatasourceRequests: unknown;
  @Input() blockLoadDebounceMillis: unknown;
  @Input() maxBlocksInCache: unknown;
  @Input() getRowId: unknown;
  @Output() filterModified = new EventEmitter<unknown>();
  @Output() cellEditingStopped = new EventEmitter<unknown>();
  @Output() cellValueChanged = new EventEmitter<unknown>();
  @Output() rowDragEnd = new EventEmitter<unknown>();
  @Output() firstDataRendered = new EventEmitter<unknown>();
  @Output() sortChanged = new EventEmitter<unknown>();
  @Output() filterChanged = new EventEmitter<unknown>();
}

@NgModule({declarations: [AgGridAngular], exports: [AgGridAngular]})
export class AgGridModule {}

export interface ICellRendererAngularComp {
  agInit(params: unknown): void;
  refresh?(params: unknown): boolean;
}

export interface IFloatingFilterAngularComp {
  agInit(params: unknown): void;
  onParentModelChanged?(parentModel: unknown): void;
}
