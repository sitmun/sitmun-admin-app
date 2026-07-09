import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { Observable, of, Subject } from 'rxjs';

import { Resource } from '@app/core';
import type {HalPage} from '@app/core/hal/hal-page';
import type {InfiniteBlockRequest} from '@app/core/hal/infinite-block-request';
import type {DataGridRowModelMode} from '@app/frontend-gui/src/lib/data-grid/data-grid.component';

export interface EntityListConfig<T> {
  /** Translation key for the entity label */
  entityLabel: string;

  font: string;
  /** Icon name for the entity */
  iconName: string;
  /** Column definitions for the data grid */
  columnDefs: any[];
  /** Function to fetch all data */
  dataFetchFn: () => Observable<T[]>;
  /** AG Grid row model mode */
  rowModelMode?: DataGridRowModelMode;
  /** Block size for infinite mode */
  pageSize?: number;
  /** Infinite block fetcher */
  infiniteBlockFetcher?: (request: InfiniteBlockRequest) => Observable<HalPage<T>>;
  /** Fixed height for infinite grid viewport */
  infiniteGridHeight?: string;
  /** Enables local search that progressively scans server pages in infinite mode */
  progressiveLocalFilter?: boolean;
  /** Enables backend text search in infinite mode */
  backendSearch?: boolean;
  /** Default column sorting */
  defaultColumnSorting?: string[];
  /** Enables row drag ordering in client-side mode */
  rowDragManaged?: boolean;
  /** Grid configuration options */
  gridOptions?: {
    globalSearch?: boolean;
    discardChangesButton?: boolean;
    redoButton?: boolean;
    undoButton?: boolean;
    applyChangesButton?: boolean;
    deleteButton?: boolean;
    newButton?: boolean;
    actionButton?: boolean;
    hideReplaceButton?: boolean;
    hideDuplicateButton?: boolean;
  };
}

@Component({
    selector: 'app-entity-list',
    templateUrl: './entity-list.component.html',
    styles: [],
    standalone: false
})
export class EntityListComponent<T extends Resource> implements OnInit, OnChanges {
  @Input() config!: EntityListConfig<T>;
  @Input() isDataLoaded = false;
  @Input() refreshCommandEvent$?: Subject<boolean>;
  @Input() saveAgGridStateEvent?: Subject<boolean>;

  @Output() removeData = new EventEmitter<T[]>();
  @Output() newDataEvent = new EventEmitter<number>();
  @Output() duplicateData = new EventEmitter<T[]>();
  @Output() sendChangesEvent = new EventEmitter<T[]>();
  @Output() gridModifiedEvent = new EventEmitter<boolean>();
  @Output() rowOrderChangedEvent = new EventEmitter<T[]>();

  private _refreshCommandEvent$: Subject<boolean> = new Subject<boolean>();
  private _saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataLoaded = false;

  ngOnInit(): void {
    this.checkAndSetDataLoaded();
    // If parent provides refresh event, use it; otherwise use local one
    if (!this.refreshCommandEvent$) {
      this.refreshCommandEvent$ = this._refreshCommandEvent$;
    }
    if (!this.saveAgGridStateEvent) {
      this.saveAgGridStateEvent = this._saveAgGridStateEvent;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.config) {
      this.checkAndSetDataLoaded();
    }
    if (changes['isDataLoaded']) {
      this.dataLoaded = this.isDataLoaded;
    }
    // Update refresh event if provided by parent
    if (changes['refreshCommandEvent$'] && this.refreshCommandEvent$) {
      // Parent provided refresh event, use it
    } else if (!this.refreshCommandEvent$) {
      this.refreshCommandEvent$ = this._refreshCommandEvent$;
    }
    // Update save state event if provided by parent
    if (changes['saveAgGridStateEvent'] && this.saveAgGridStateEvent) {
      // Parent provided save state event, use it
    } else if (!this.saveAgGridStateEvent) {
      this.saveAgGridStateEvent = this._saveAgGridStateEvent;
    }
  }

  /**
   * Public method to trigger data loaded check
   * Can be called by parent components when column definitions are updated
   */
  refreshDataLoaded(): void {
    this.checkAndSetDataLoaded();
  }

  private checkAndSetDataLoaded(): void {
    // Set dataLoaded to true if we have column definitions
    // This allows the grid to render
    if (this.config?.columnDefs && this.config.columnDefs.length > 0) {
      this.dataLoaded = true;
    }
  }

  get columnDefs(): any[] {
    return this.config?.columnDefs || [];
  }

  get dataFetchFn(): () => Observable<T[]> {
    return this.config?.dataFetchFn || (() => of([]));
  }

  get defaultColumnSorting(): string[] {
    return this.config?.defaultColumnSorting || [];
  }

  get rowDragManaged(): boolean {
    return this.config?.rowDragManaged ?? false;
  }

  get gridOptions() {
    return {
      globalSearch: true,
      discardChangesButton: false,
      redoButton: false,
      undoButton: false,
      applyChangesButton: false,
      deleteButton: true,
      newButton: true,
      actionButton: true,
      hideReplaceButton: true,
      hideDuplicateButton: false,
      ...this.config?.gridOptions
    };
  }

  onRemove(data: T[]): void {
    this.removeData.emit(data);
  }

  onNew(event: number): void {
    this.newDataEvent.emit(event);
  }

  onDuplicate(data: T[]): void {
    this.duplicateData.emit(data);
  }

  onSendChanges(data: T[]): void {
    this.sendChangesEvent.emit(data);
  }

  onGridModified(value: boolean): void {
    this.gridModifiedEvent.emit(value);
  }

  onRowOrderChanged(data: T[]): void {
    this.rowOrderChangedEvent.emit(data);
  }
}
