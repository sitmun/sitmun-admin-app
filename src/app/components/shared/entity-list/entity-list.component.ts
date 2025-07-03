import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Resource } from '@app/core';

export interface EntityListConfig<T> {
  /** Translation key for the entity label */
  entityLabel: string;
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
})
export class EntityListComponent<T extends Resource> implements OnInit, OnChanges {
  @Input() config!: EntityListConfig<T>;
  @Input() isDataLoaded = false;
  
  @Output() removeData = new EventEmitter<T[]>();
  @Output() newDataEvent = new EventEmitter<number>();
  @Output() duplicateData = new EventEmitter<T[]>();
  @Output() sendChangesEvent = new EventEmitter<T[]>();
  @Output() gridModifiedEvent = new EventEmitter<boolean>();

  refreshCommandEvent$: Subject<boolean> = new Subject<boolean>();
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataLoaded = false;

  ngOnInit(): void {
    this.checkAndSetDataLoaded();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.config) {
      this.checkAndSetDataLoaded();
    }
    if (changes['isDataLoaded']) {
      this.dataLoaded = this.isDataLoaded;
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
    return this.config?.dataFetchFn || (() => new Observable());
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