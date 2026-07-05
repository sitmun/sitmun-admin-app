import {
  clampFlexLayoutFixedColumnWidth,
  FLEX_LAYOUT_FIXED_COLUMN_MAX_PX,
  isFixedDisplayColumn,
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

  it('identifies fixed display columns for one-shot content sizing', () => {
    const prepared = prepareClientSideColumnDefs(relationGridSourceDefs);

    expect(isFixedDisplayColumn(prepared[0])).toBe(false);
    expect(isFixedDisplayColumn(prepared[1])).toBe(true);
    expect(isFixedDisplayColumn(prepared[2])).toBe(false);
    expect(isFixedDisplayColumn({field: 'status', flex: 0, minWidth: 160, maxWidth: 160})).toBe(false);
  });

  it('clamps fixed column width using minWidth and viewport cap', () => {
    expect(clampFlexLayoutFixedColumnWidth(400, 116, 971)).toBe(FLEX_LAYOUT_FIXED_COLUMN_MAX_PX);
    expect(clampFlexLayoutFixedColumnWidth(200, 116, 971)).toBe(200);
    expect(clampFlexLayoutFixedColumnWidth(80, 116, 971)).toBe(116);
  });
});
