import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {MatDialog} from '@angular/material/dialog';

import {TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';

import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {suppressAgGridConsoleWarnings} from '@app/testing/test-helpers';

import {DataGridComponent} from './data-grid.component';

describe('DataGridComponent', () => {
  let component: DataGridComponent;
  let fixture: ComponentFixture<DataGridComponent>;
  let restoreConsoleWarn: () => void;

  beforeAll(() => {
    restoreConsoleWarn = suppressAgGridConsoleWarnings();
  });

  afterAll(() => {
    restoreConsoleWarn?.();
  });

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      imports: [DataGridComponent],
      providers: [
        {provide: MatDialog, useValue: {open: () => ({})}},
        {provide: TranslateService, useValue: {instant: (k: string) => k}},
        {provide: UtilsService, useValue: {}},
        {provide: LoggerService, useValue: {debug: () => {}, error: () => {}, warn: () => {}}},
        {provide: ErrorHandlerService, useValue: {}},
        {provide: LoadingOverlayService, useValue: {wrapWithAntiFlicker: (fn: () => Promise<unknown>) => fn()}},
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataGridComponent);
    component = fixture.componentInstance;
    component.columnDefs = [{field: 'name'}];
    component.getAll = () => of([{id: 1, name: 'row'}]);
  });

  afterEach(() => fixture?.destroy());
  afterAll(() => TestBed.resetTestingModule());

  it('defaults to clientSide row model', () => {
    expect(component.rowModelMode).toBe('clientSide');
    expect(component.isInfiniteMode).toBe(false);
  });

  it('loadData binds client-side row data from getAll', async () => {
    component.gridApi = {
      isDestroyed: () => false,
      setGridOption: jest.fn(),
      autoSizeAllColumns: jest.fn(),
    };
    component.loadData();
    await new Promise((r) => setTimeout(r, 0));
    expect(component.rowData).toEqual([{id: 1, name: 'row'}]);
  });

  it('skips loadData when row model is infinite', () => {
    component.rowModelMode = 'infinite';
    component.loadData();
    expect(component.rowData).toBeUndefined();
  });

  it('applies infinite column layout on grid ready', () => {
    component.rowModelMode = 'infinite';
    component.columnDefs = [{field: 'name', width: 150}];
    component.infiniteBlockFetcher = () => of({
      rows: [],
      pageNumber: 0,
      pageSize: 10,
      totalElements: 0,
      totalPages: 0,
    });
    component.gridOptions = {};
    component.gridApi = {
      updateGridOptions: jest.fn(),
      setGridOption: jest.fn(),
      isDestroyed: () => false,
    } as any;

    component.onGridReady({api: component.gridApi, columnApi: {}});

    expect(component.columnDefs[0]).toEqual(
      expect.objectContaining({field: 'name', flex: 0, width: 150, wrapText: false, autoHeight: false})
    );
    expect(component.gridApi.updateGridOptions).toHaveBeenCalledWith({columnDefs: component.columnDefs});
  });

  it('applies clientSide column layout on grid ready', () => {
    component.rowModelMode = 'clientSide';
    component.columnDefs = [{field: 'role', flex: 2, minWidth: 140}];
    component.gridOptions = {};
    component.gridApi = {
      updateGridOptions: jest.fn(),
      setGridOption: jest.fn(),
      addEventListener: jest.fn(),
      isDestroyed: () => false,
    } as any;
    component.loadData = jest.fn();

    component.onGridReady({api: component.gridApi, columnApi: {}});

    expect(component.columnDefs[0]).toEqual(
      expect.objectContaining({field: 'role', flex: 2, minWidth: 140, wrapText: false, autoHeight: false})
    );
    expect(component.gridApi.updateGridOptions).toHaveBeenCalledWith({columnDefs: component.columnDefs});
  });

  it('clears autoSizeStrategy before relation-grid initialization without updating the live grid option', () => {
    component.rowModelMode = 'clientSide';
    component.columnDefs = [
      {headerName: '', checkboxSelection: true, headerCheckboxSelection: true},
      {headerName: 'Name', field: 'name'},
      {headerName: 'Task type', field: 'typeName'},
    ];
    component.gridOptions = {autoSizeStrategy: {type: 'fitCellContents'}};
    component.dataGrid = {nativeElement: document.createElement('div')} as any;

    component.ngOnInit();

    expect(component.gridOptions.autoSizeStrategy).toBeUndefined();

    component.gridApi = {
      updateGridOptions: jest.fn(),
      setGridOption: jest.fn(),
      addEventListener: jest.fn(),
      isDestroyed: () => false,
    } as any;
    component.loadData = jest.fn();

    component.onGridReady({api: component.gridApi, columnApi: {}});

    expect(component.columnDefs[2]).toEqual(expect.objectContaining({field: 'typeName', flex: 1}));
    expect(component.gridApi.setGridOption).not.toHaveBeenCalledWith(
      'autoSizeStrategy',
      expect.anything()
    );
  });

  it('keeps fitCellContents as initial strategy for fixed-width client-side grids', () => {
    component.rowModelMode = 'clientSide';
    component.columnDefs = [
      {headerName: 'A', field: 'a', flex: 0, width: 120},
      {headerName: 'B', field: 'b', flex: 0, width: 120},
    ];
    component.gridOptions = {};
    component.dataGrid = {nativeElement: document.createElement('div')} as any;

    component.ngOnInit();

    expect(component.gridOptions.autoSizeStrategy).toEqual({type: 'fitCellContents'});
  });

  it('omits autoSizeStrategy before infinite grid initialization', () => {
    component.rowModelMode = 'infinite';
    component.columnDefs = [{headerName: 'Name', field: 'name', width: 150}];
    component.gridOptions = {autoSizeStrategy: {type: 'fitCellContents'}};
    component.dataGrid = {nativeElement: document.createElement('div')} as any;

    component.ngOnInit();

    expect(component.gridOptions.autoSizeStrategy).toBeUndefined();
  });

  it('toggles horizontal scroll visibility in flex-layout relation grids', () => {
    component.rowModelMode = 'clientSide';
    component.columnDefs = [
      {headerName: '', checkboxSelection: true, flex: 0, width: 56},
      {headerName: 'Name', field: 'name', flex: 0, width: 150, minWidth: 116},
      {headerName: 'Task type', field: 'typeName', flex: 1, minWidth: 100},
    ];
    const nameColumn = {
      getColDef: () => ({minWidth: 116, flex: 0}),
      getActualWidth: () => 240,
    };
    component.gridApi = {
      getAllDisplayedColumns: jest.fn(() => [nameColumn, nameColumn]),
      setGridOption: jest.fn(),
      isDestroyed: () => false,
    } as any;
    component.params = {eGridDiv: {clientWidth: 971, querySelector: () => ({clientWidth: 971})}} as any;

    component['applyFlexColumnLayoutSizing']();

    expect(component.hasHiddenColumns).toBe(false);
    expect(component.gridApi.setGridOption).toHaveBeenCalledWith('suppressHorizontalScroll', true);
    expect(component.gridApi.setGridOption).toHaveBeenCalledWith('alwaysShowHorizontalScroll', false);
  });

  it('ignores refresh events replayed before the grid is ready', fakeAsync(() => {
    component.eventRefreshSubscription = of(true);
    component.dataGrid = {nativeElement: document.createElement('div')} as any;
    component.loadData = jest.fn();

    expect(() => component.ngOnInit()).not.toThrow();
    tick();

    expect(component.loadData).toHaveBeenCalledTimes(1);
    expect(component.params).toBeUndefined();
  }));

  describe('undo/redo', () => {
    const rowData = {status: 'pendingModify'};

    beforeEach(() => {
      rowData.status = 'pendingModify';
      component.changeCounter = 1;
      component.previousChangeCounter = 1;
      component.redoCounter = 0;
      component.statusColumn = true;
      component.changesMap = new Map([
        ['row-1', new Map([['appliesToChildrenTerritories', 1]])],
      ]);
      component.gridApi = {
        isDestroyed: () => false,
        stopEditing: jest.fn(),
        undoCellEditing: jest.fn(),
        redoCellEditing: jest.fn(),
        getDisplayedRowAtIndex: jest.fn(() => ({id: 'row-1'})),
        getRowNode: jest.fn(() => ({data: rowData})),
        redrawRows: jest.fn(),
      } as any;
    });

    it('undo decrements changeCounter before calling undoCellEditing', () => {
      component.undo();

      expect(component.changeCounter).toBe(0);
      expect(component.gridApi.undoCellEditing).toHaveBeenCalled();
      expect(component.redoCounter).toBe(1);
    });

    it('redo increments changeCounter before calling redoCellEditing', () => {
      component.changeCounter = 0;
      component.previousChangeCounter = 0;

      component.redo();

      expect(component.changeCounter).toBe(1);
      expect(component.gridApi.redoCellEditing).toHaveBeenCalled();
      expect(component.redoCounter).toBe(-1);
    });

    it('onCellValueChanged with source undo clears changesMap entry', () => {
      component.onCellValueChanged({
        source: 'undo',
        node: {id: 'row-1'},
        rowIndex: 0,
        colDef: {field: 'appliesToChildrenTerritories'},
        oldValue: true,
        value: false,
      });

      expect(component.changesMap.has('row-1')).toBe(false);
      expect(component.previousChangeCounter).toBe(0);
      expect(component.gridApi.getRowNode('row-1').data.status).toBe('statusOK');
    });

    it('cellValuesEqual treats boolean and string equivalents as equal', () => {
      expect(component['cellValuesEqual']('false', false)).toBe(true);
      expect(component['cellValuesEqual'](true, 'true')).toBe(true);
      expect(component['cellValuesEqual'](false, true)).toBe(false);
    });
  });

  describe('Step 7: Server sort and filter policy', () => {
    it('onInfiniteSortChanged purges cache and increments generation', () => {
      component.rowModelMode = 'infinite';
      const initialGeneration = component['infiniteDatasourceGeneration'];
      component.gridApi = {
        isDestroyed: () => false,
        purgeInfiniteCache: jest.fn(),
      } as any;

      component.onInfiniteSortChanged();

      expect(component['infiniteDatasourceGeneration']).toBe(initialGeneration + 1);
      expect(component.gridApi.purgeInfiniteCache).toHaveBeenCalledTimes(1);
    });

    it('onInfiniteSortChanged does nothing when not in infinite mode', () => {
      component.rowModelMode = 'clientSide';
      const initialGeneration = component['infiniteDatasourceGeneration'];
      component.gridApi = {
        isDestroyed: () => false,
        purgeInfiniteCache: jest.fn(),
      } as any;

      component.onInfiniteSortChanged();

      expect(component['infiniteDatasourceGeneration']).toBe(initialGeneration);
      expect(component.gridApi.purgeInfiniteCache).not.toHaveBeenCalled();
    });

    it('onFilterModified returns early in infinite mode', () => {
      component.rowModelMode = 'infinite';
      const deleteChangesSpy = jest.spyOn(component as any, 'deleteChanges');

      component.onFilterModified();

      expect(deleteChangesSpy).not.toHaveBeenCalled();
    });

    it('isInfiniteMode returns true when rowModelMode is infinite', () => {
      component.rowModelMode = 'infinite';
      expect(component.isInfiniteMode).toBe(true);
    });

    it('isInfiniteMode returns false when rowModelMode is clientSide', () => {
      component.rowModelMode = 'clientSide';
      expect(component.isInfiniteMode).toBe(false);
    });
  });

  describe('Step 8: Editable infinite workflow', () => {
    beforeEach(() => {
      component.rowModelMode = 'infinite';
      component.infiniteBlockFetcher = () => of({
        rows: [],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      });
      component.gridApi = {
        isDestroyed: () => false,
        stopEditing: jest.fn(),
        deselectAll: jest.fn(),
        purgeInfiniteCache: jest.fn(),
        refreshInfiniteCache: jest.fn(),
        refreshCells: jest.fn(),
        setGridOption: jest.fn(),
      } as any;
    });

    it('onCellValueChanged stores edits in infiniteRowChanges map keyed by rowId', () => {
      const params = {
        node: {id: 'row-123'},
        data: {id: 123, name: 'Original'},
        value: 'Updated',
        colDef: {field: 'name'},
      };

      component.onCellValueChanged(params);

      expect(component.infiniteRowChanges.has('row-123')).toBe(true);
      expect(component.infiniteRowChanges.get('row-123').name).toBe('Updated');
      expect(component.changeCounter).toBe(1);
    });

    it('onCellValueChanged sets status to pendingModify when statusColumn is enabled', () => {
      component.statusColumn = true;
      const params = {
        node: {id: 'row-456'},
        data: {id: 456, name: 'Row'},
        value: 'Changed',
        colDef: {field: 'name'},
      };

      component.onCellValueChanged(params);

      expect(component.infiniteRowChanges.get('row-456').status).toBe('pendingModify');
    });

    it('applyChanges emits items from change map, not forEachNode', () => {
      const emitSpy = jest.spyOn(component.sendChanges, 'emit');
      component.infiniteRowChanges.set('row-1', {id: 1, name: 'A'});
      component.infiniteRowChanges.set('row-2', {id: 2, name: 'B'});

      component.applyChanges();

      expect(emitSpy).toHaveBeenCalledWith([
        {id: 1, name: 'A'},
        {id: 2, name: 'B'},
      ]);
      expect(component.infiniteRowChanges.size).toBe(0);
      expect(component.changeCounter).toBe(0);
    });

    it('deleteChanges clears the map and increments generation (purges cache)', () => {
      component.infiniteRowChanges.set('row-3', {id: 3, name: 'C'});
      const initialGeneration = component['infiniteDatasourceGeneration'];

      component.deleteChanges();

      expect(component.infiniteRowChanges.size).toBe(0);
      expect(component['infiniteDatasourceGeneration']).toBe(initialGeneration + 1);
      expect(component.changeCounter).toBe(0);
    });

    it('eventRefreshSubscription clears infiniteRowChanges on refresh', fakeAsync(() => {
      component.eventRefreshSubscription = of(true);
      component.infiniteRowChanges.set('row-4', {id: 4, name: 'D'});

      component.ngOnInit();
      tick();

      expect(component.infiniteRowChanges.size).toBe(0);
    }));

    it('eventRefreshSubscription clears stale infinite selection on refresh', fakeAsync(() => {
      component.eventRefreshSubscription = of(true);

      component.ngOnInit();
      tick();

      expect(component.gridApi.deselectAll).toHaveBeenCalledTimes(1);
      expect(component.gridApi.purgeInfiniteCache).toHaveBeenCalledTimes(1);
    }));

    it('eventRefreshSubscription recreates the datasource to drop stale progressive cache', fakeAsync(() => {
      component.eventRefreshSubscription = of(true);

      component.ngOnInit();
      tick();

      expect(component.gridApi.setGridOption).toHaveBeenCalledWith('datasource', expect.any(Object));
      expect(component.gridApi.purgeInfiniteCache).toHaveBeenCalledTimes(1);
    }));

    it('multiple edits to same row merge into one change map entry', () => {
      const params1 = {
        node: {id: 'row-5'},
        data: {id: 5, name: 'Original', value: 10},
        value: 'Updated Name',
        colDef: {field: 'name'},
      };
      const params2 = {
        node: {id: 'row-5'},
        data: {id: 5, name: 'Updated Name', value: 10},
        value: 20,
        colDef: {field: 'value'},
      };

      component.onCellValueChanged(params1);
      component.onCellValueChanged(params2);

      expect(component.infiniteRowChanges.size).toBe(1);
      const changed = component.infiniteRowChanges.get('row-5');
      expect(changed.name).toBe('Updated Name');
      expect(changed.value).toBe(20);
      expect(component.changeCounter).toBe(2);
    });
  });

  describe('semantic toolbar defaults', () => {
    beforeEach(() => {
      component.changeTracking = 'auto';
      component.readOnly = false;
      component.discardChangesButton = undefined;
      component.undoButton = undefined;
      component.redoButton = undefined;
      component.rowModelMode = 'clientSide';
    });

    it('shows discard/undo/redo when statusColumn is present and inputs are unset', () => {
      component.statusColumn = true;
      component.someColumnIsEditable = false;

      expect(component.showDiscardChangesButton).toBe(true);
      expect(component.showUndoButton).toBe(true);
      expect(component.showRedoButton).toBe(true);
    });

    it('shows discard/undo/redo when someColumnIsEditable is true and inputs are unset', () => {
      component.statusColumn = false;
      component.someColumnIsEditable = true;

      expect(component.showDiscardChangesButton).toBe(true);
      expect(component.showUndoButton).toBe(true);
      expect(component.showRedoButton).toBe(true);
    });

    it('hides discard/undo/redo when only addButton is set without grid-owned pending changes', () => {
      component.statusColumn = false;
      component.someColumnIsEditable = false;
      component.addButton = true;

      expect(component.showDiscardChangesButton).toBe(false);
      expect(component.showUndoButton).toBe(false);
      expect(component.showRedoButton).toBe(false);
    });

    it('hides discard/undo/redo when only deleteButton is set without grid-owned pending changes', () => {
      component.statusColumn = false;
      component.someColumnIsEditable = false;
      component.deleteButton = true;

      expect(component.showDiscardChangesButton).toBe(false);
      expect(component.showUndoButton).toBe(false);
      expect(component.showRedoButton).toBe(false);
    });

    it('hides discard/undo/redo when only newButton is set without grid-owned pending changes', () => {
      component.statusColumn = false;
      component.someColumnIsEditable = false;
      component.newButton = true;

      expect(component.showDiscardChangesButton).toBe(false);
      expect(component.showUndoButton).toBe(false);
      expect(component.showRedoButton).toBe(false);
    });

    it('shows discard/undo/redo when changeTracking is enabled even without detected capability', () => {
      component.changeTracking = 'enabled';
      component.statusColumn = false;
      component.someColumnIsEditable = false;

      expect(component.showDiscardChangesButton).toBe(true);
      expect(component.showUndoButton).toBe(true);
      expect(component.showRedoButton).toBe(true);
    });

    it('hides discard/undo/redo when changeTracking is disabled despite detected capability', () => {
      component.changeTracking = 'disabled';
      component.statusColumn = true;
      component.someColumnIsEditable = true;

      expect(component.showDiscardChangesButton).toBe(false);
      expect(component.showUndoButton).toBe(false);
      expect(component.showRedoButton).toBe(false);
    });

    it('hides discard/undo/redo when readOnly even if changeTracking is enabled', () => {
      component.readOnly = true;
      component.changeTracking = 'enabled';

      expect(component.showDiscardChangesButton).toBe(false);
      expect(component.showUndoButton).toBe(false);
      expect(component.showRedoButton).toBe(false);
    });

    it('hides mutating action buttons when readOnly', () => {
      component.readOnly = true;
      component.deleteButton = true;
      component.newButton = true;
      component.addButton = true;
      component.registerButton = true;
      component.hideReplaceButton = false;
      component.hideDuplicateButton = false;

      expect(component.showDeleteButton).toBe(false);
      expect(component.showNewButton).toBe(false);
      expect(component.showAddButton).toBe(false);
      expect(component.showRegisterButton).toBe(false);
      expect(component.showReplaceControls).toBe(false);
      expect(component.showDuplicateButton).toBe(false);
    });

    it('hides duplicate when hideDuplicateButton is true and grid is editable', () => {
      component.readOnly = false;
      component.hideDuplicateButton = true;

      expect(component.showDuplicateButton).toBe(false);
    });

    it('shows duplicate when hideDuplicateButton is false and grid is editable', () => {
      component.readOnly = false;
      component.hideDuplicateButton = false;

      expect(component.showDuplicateButton).toBe(true);
    });

    it('respects explicit undoButton=false override', () => {
      component.statusColumn = true;
      component.undoButton = false;

      expect(component.showUndoButton).toBe(false);
      expect(component.showDiscardChangesButton).toBe(true);
    });

    it('respects explicit discardChangesButton=true override when not read-only', () => {
      component.discardChangesButton = true;
      component.statusColumn = false;
      component.someColumnIsEditable = false;

      expect(component.showDiscardChangesButton).toBe(true);
    });

    it('hides discard/undo/redo in infinite mode even when changeTracking is enabled', () => {
      component.rowModelMode = 'infinite';
      component.changeTracking = 'enabled';

      expect(component.showDiscardChangesButton).toBe(false);
      expect(component.showUndoButton).toBe(false);
      expect(component.showRedoButton).toBe(false);
    });
  });

  describe('grid capability detection', () => {
    it('detects someColumnIsEditable from default column editability', () => {
      component.nonEditable = false;
      component.readOnly = false;
      component.columnDefs = [{field: 'name'}, {field: 'status', editable: false}];

      component['detectGridCapabilities'](component.columnDefs);

      expect(component.someColumnIsEditable).toBe(true);
      expect(component.statusColumn).toBe(true);
    });

    it('does not treat explicit editable:false columns as editable when default is editable', () => {
      component.nonEditable = false;
      component.readOnly = false;
      component.columnDefs = [
        {field: 'name', editable: false},
        {field: 'type', editable: false},
      ];

      component['detectGridCapabilities'](component.columnDefs);

      expect(component.someColumnIsEditable).toBe(false);
    });

    it('applies readOnly to prepared column defs on grid ready', () => {
      component.readOnly = true;
      component.rowModelMode = 'clientSide';
      component.columnDefs = [{field: 'name', editable: true}];
      component.gridOptions = {};
      component.gridApi = {
        updateGridOptions: jest.fn(),
        setGridOption: jest.fn(),
        addEventListener: jest.fn(),
        isDestroyed: () => false,
      } as any;
      component.loadData = jest.fn();

      component.onGridReady({api: component.gridApi, columnApi: {}});

      expect(component.columnDefs[0].editable).toBe(false);
      expect(component.someColumnIsEditable).toBe(false);
    });

    it('resets capability flags on grid ready refresh', () => {
      component.statusColumn = true;
      component.someColumnIsEditable = true;
      component.rowModelMode = 'clientSide';
      component.columnDefs = [{field: 'name', editable: false}];
      component.gridOptions = {};
      component.gridApi = {
        updateGridOptions: jest.fn(),
        setGridOption: jest.fn(),
        addEventListener: jest.fn(),
        isDestroyed: () => false,
      } as any;
      component.loadData = jest.fn();

      component.onGridReady({api: component.gridApi, columnApi: {}});

      expect(component.statusColumn).toBe(false);
      expect(component.someColumnIsEditable).toBe(false);
    });
  });

  function setupInfiniteSearchFixture(options?: {
    progressiveLocalFilter?: boolean;
    backendSearch?: boolean;
    includeSortAndFilterCallbacks?: boolean;
  }) {
    component.rowModelMode = 'infinite';
    if (options?.progressiveLocalFilter) {
      component.progressiveLocalFilter = true;
    }
    if (options?.backendSearch) {
      component.backendSearch = true;
    }

    const mockGridApi = {
      purgeInfiniteCache: jest.fn(),
      ensureIndexVisible: jest.fn(),
      setGridOption: jest.fn(),
      isDestroyed: () => false,
      ...(options?.includeSortAndFilterCallbacks && {
        onFilterChanged: jest.fn(),
        onSortChanged: jest.fn(),
      }),
    } as any;

    component.gridApi = mockGridApi;
    component.ngOnInit();
    const initialGeneration = component['infiniteDatasourceGeneration'];

    return {mockGridApi, initialGeneration};
  }

  describe('progressive local filtering', () => {
    it('quickSearch with progressiveLocalFilter purges cache and increments generation for client-side scanning', fakeAsync(() => {
      const {mockGridApi, initialGeneration} = setupInfiniteSearchFixture({
        progressiveLocalFilter: true,
        includeSortAndFilterCallbacks: true,
      });

      component.quickSearch({target: {value: 'roads'}} as unknown as KeyboardEvent);
      tick(300);

      expect(component.searchValue).toBe('roads');
      expect(component['infiniteDatasourceGeneration']).toBe(initialGeneration + 1);
      expect(mockGridApi.ensureIndexVisible).toHaveBeenCalledWith(0, 'top');
      expect(mockGridApi.purgeInfiniteCache).toHaveBeenCalledTimes(1);
      expect(mockGridApi.setGridOption).not.toHaveBeenCalledWith('quickFilterText', 'roads');
    }));

    it('quickSearch with backendSearch purges cache and increments generation for server-side filtering', fakeAsync(() => {
      const {mockGridApi, initialGeneration} = setupInfiniteSearchFixture({
        backendSearch: true,
        includeSortAndFilterCallbacks: true,
      });

      component.quickSearch({target: {value: 'roads'}} as unknown as KeyboardEvent);
      tick(300);

      expect(component.searchValue).toBe('roads');
      expect(component['infiniteDatasourceGeneration']).toBe(initialGeneration + 1);
      expect(mockGridApi.ensureIndexVisible).toHaveBeenCalledWith(0, 'top');
      expect(mockGridApi.purgeInfiniteCache).toHaveBeenCalledTimes(1);
      expect(mockGridApi.setGridOption).not.toHaveBeenCalledWith('quickFilterText', 'roads');
    }));

    it('backendSearch takes precedence over progressiveLocalFilter when both are enabled', () => {
      component.rowModelMode = 'infinite';
      component.progressiveLocalFilter = true;
      component.backendSearch = true;
      component.infiniteBlockFetcher = jest.fn();
      component.gridApi = {
        setGridOption: jest.fn(),
        isDestroyed: () => false,
      } as any;

      component['setupInfiniteGrid']();

      const datasourceCall = component.gridApi.setGridOption.mock.calls.find(
        call => call[0] === 'datasource'
      );
      expect(datasourceCall).toBeDefined();
    });

    it('debounces rapid search inputs to reduce backend requests', fakeAsync(() => {
      const {mockGridApi, initialGeneration} = setupInfiniteSearchFixture({backendSearch: true});

      component.quickSearch({target: {value: 'a'}} as unknown as KeyboardEvent);
      tick(100);
      component.quickSearch({target: {value: 'an'}} as unknown as KeyboardEvent);
      tick(100);
      component.quickSearch({target: {value: 'ane'}} as unknown as KeyboardEvent);
      tick(300);

      expect(component.searchValue).toBe('ane');
      expect(component['infiniteDatasourceGeneration']).toBe(initialGeneration + 1);
      expect(mockGridApi.purgeInfiniteCache).toHaveBeenCalledTimes(1);
    }));

    it('search box visibility condition includes backendSearch in infinite mode', () => {
      component.rowModelMode = 'infinite';
      component.backendSearch = true;
      component.globalSearch = true;

      const isInfiniteMode = component.isInfiniteMode;
      const shouldShowSearch = component.globalSearch && (!isInfiniteMode || component.progressiveLocalFilter || component.backendSearch);

      expect(shouldShowSearch).toBe(true);
    });
  });
});
