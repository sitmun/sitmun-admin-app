import {
  applyDataBasedColumnWidths,
  prepareClientSideColumnDefs,
  resolveAutoSizeStrategy,
  usesContentBasedColumnSizing,
  usesFlexColumnLayout,
} from './data-grid-column-layout';

describe('data-grid-column-layout', () => {
  const relationGridSourceDefs = [
    {headerName: '', checkboxSelection: true, headerCheckboxSelection: true},
    {headerName: 'Name', field: 'name'},
    {headerName: 'Task type', field: 'typeName'},
  ];

  it('prepares relation grids with last column flex grow', () => {
    const prepared = prepareClientSideColumnDefs(relationGridSourceDefs);

    expect(prepared[0]).toEqual(expect.objectContaining({checkboxSelection: true, flex: 0, width: 56}));
    expect(prepared[1]).toEqual(expect.objectContaining({field: 'name', flex: 0}));
    expect(prepared[2]).toEqual(expect.objectContaining({field: 'typeName', flex: 1}));
    expect(usesFlexColumnLayout(prepared)).toBe(true);
  });

  it('keeps trailing status fixed and grows the previous data column', () => {
    const prepared = prepareClientSideColumnDefs([
      {headerName: '', checkboxSelection: true, headerCheckboxSelection: true},
      {headerName: 'Title', field: 'name', width: 150},
      {headerName: 'Abstract', field: 'description', width: 150},
      {headerName: 'Status', field: 'status'},
    ]);

    expect(prepared[1]).toEqual(expect.objectContaining({field: 'name', flex: 0}));
    expect(prepared[2]).toEqual(expect.objectContaining({field: 'description', flex: 1}));
    expect(prepared[3]).toEqual(expect.objectContaining({field: 'status', flex: 0, width: 160}));
    expect(usesFlexColumnLayout(prepared)).toBe(true);
  });

  it('does not use content-based sizing for prepared relation grids', () => {
    const prepared = prepareClientSideColumnDefs(relationGridSourceDefs);

    expect(usesContentBasedColumnSizing('clientSide', prepared)).toBe(false);
    expect(resolveAutoSizeStrategy('clientSide', prepared)).toBeUndefined();
  });

  it('uses fitCellContents when no column has flex grow', () => {
    const sourceDefs = [
      {headerName: 'A', field: 'a', flex: 0, width: 120},
      {headerName: 'B', field: 'b', flex: 0, width: 120},
    ];
    const prepared = prepareClientSideColumnDefs(sourceDefs);

    expect(usesFlexColumnLayout(prepared)).toBe(false);
    expect(resolveAutoSizeStrategy('clientSide', prepared)).toEqual({type: 'fitCellContents'});
  });

  it('returns undefined auto-size strategy for infinite mode', () => {
    const prepared = prepareClientSideColumnDefs(relationGridSourceDefs);

    expect(resolveAutoSizeStrategy('infinite', prepared)).toBeUndefined();
  });

  it('sets fixed relation column widths from row values before rendering', () => {
    const prepared = prepareClientSideColumnDefs([
      {headerName: '', checkboxSelection: true, headerCheckboxSelection: true},
      {headerName: 'Title', field: 'name', minWidth: 150},
      {headerName: 'Abstract', field: 'description', minWidth: 150},
      {headerName: 'Status', field: 'status'},
    ]);

    const sized = applyDataBasedColumnWidths(prepared, [
      {name: 'Short', description: 'Description'},
      {name: 'CAE1M (Guia de carrers) - Carrers (fons fosc)', description: 'Long abstract'},
    ], 1000);

    expect(sized[1]).toEqual(expect.objectContaining({field: 'name', flex: 0, width: 416}));
    expect(sized[2]).toEqual(expect.objectContaining({field: 'description', flex: 1}));
    expect(sized[3]).toEqual(expect.objectContaining({field: 'status', width: 160}));
  });

  it('honors explicit maxWidth when estimating data-based widths', () => {
    const prepared = prepareClientSideColumnDefs([
      {headerName: '', checkboxSelection: true, headerCheckboxSelection: true},
      {headerName: 'Title', field: 'name', minWidth: 150, maxWidth: 220},
      {headerName: 'Abstract', field: 'description', minWidth: 150},
    ]);

    const sized = applyDataBasedColumnWidths(prepared, [
      {name: 'This title is intentionally much longer than the column cap', description: 'Abstract'},
    ], 1000);

    expect(sized[1]).toEqual(expect.objectContaining({field: 'name', width: 220, maxWidth: 220}));
  });

  it('uses the default cap when hidden tab grids report no viewport width', () => {
    const prepared = prepareClientSideColumnDefs([
      {headerName: '', checkboxSelection: true, headerCheckboxSelection: true},
      {headerName: 'Name', field: 'name', minWidth: 150},
      {headerName: 'Task type', field: 'typeName', minWidth: 150},
    ]);

    const sized = applyDataBasedColumnWidths(prepared, [
      {name: 'Very long task name that should not be clamped to the minimum width', typeName: 'Query'},
    ], 0);

    expect(sized[1]).toEqual(expect.objectContaining({field: 'name', width: 480}));
  });

  it('explicit grow columns remain flex after prepareClientSideColumnDefs', () => {
    const prepared = prepareClientSideColumnDefs([
      {headerName: '', checkboxSelection: true},
      {headerName: 'Name', field: 'name', flex: 2, minWidth: 160},
      {headerName: 'Type', field: 'type', flex: 0, minWidth: 100},
    ]);
    expect(prepared[1]).toEqual(expect.objectContaining({field: 'name', flex: 2, minWidth: 160}));
    expect(prepared[2]).toEqual(expect.objectContaining({field: 'type', flex: 0}));
  });

  it('checkbox, status and fixed columns do not become the fallback grow column', () => {
    const prepared = prepareClientSideColumnDefs([
      {headerName: '', checkboxSelection: true},
      {headerName: 'Name', field: 'name'},
      {headerName: 'Active', field: 'active', flex: 0, minWidth: 60, maxWidth: 80},
      {headerName: 'Status', field: 'status'},
    ]);
    expect(prepared[0]).toEqual(expect.objectContaining({flex: 0}));
    expect(prepared[2]).toEqual(expect.objectContaining({flex: 0}));
    expect(prepared[3]).toEqual(expect.objectContaining({flex: 0}));
    const growCols = prepared.filter((c: any) => c.flex > 0);
    expect(growCols.length).toBe(1);
    expect(growCols[0].field).toBe('name');
  });

  it('multiple weighted flex columns preserve weights and minimum widths', () => {
    const prepared = prepareClientSideColumnDefs([
      {headerName: '', checkboxSelection: true},
      {headerName: 'Name', field: 'name', flex: 1, minWidth: 140},
      {headerName: 'URL', field: 'url', flex: 2, minWidth: 200},
      {headerName: 'Type', field: 'type', flex: 0, minWidth: 100},
    ]);
    expect(prepared[1]).toEqual(expect.objectContaining({flex: 1, minWidth: 140}));
    expect(prepared[2]).toEqual(expect.objectContaining({flex: 2, minWidth: 200}));
    expect(prepared[3]).toEqual(expect.objectContaining({flex: 0}));
  });

  it('legacy non-flex grid falls back to content-based sizing', () => {
    const sourceDefs = [
      {headerName: 'Name', field: 'name'},
      {headerName: 'Type', field: 'type'},
    ];
    const prepared = prepareClientSideColumnDefs(sourceDefs);
    expect(usesFlexColumnLayout(prepared)).toBe(true);
    expect(resolveAutoSizeStrategy('clientSide', prepared)).toBeUndefined();
  });
});
