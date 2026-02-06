import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

import {Observable, of, Subject} from 'rxjs';

import {Resource} from '@app/core';

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
  /** Default column sorting */
  defaultColumnSorting?: string[];
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
}
