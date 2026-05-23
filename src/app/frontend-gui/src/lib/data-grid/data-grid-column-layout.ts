/**
 * Column layout for {@link DataGridComponent} — separate strategies for infinite (paged lists)
 * and clientSide (form relation grids, dialogs).
 */

 
export type DataGridColumnDef = Record<string, any>;

function narrowCheckboxColumn(col: DataGridColumnDef): DataGridColumnDef {
  return {
    ...col,
    flex: 0,
    width: 56,
    minWidth: 56,
    maxWidth: 56,
    filter: false,
    autoHeight: false,
    wrapText: false,
    cellStyle: {padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'},
  };
}

function withoutWrapAutoHeight(col: DataGridColumnDef): DataGridColumnDef {
  return {
    ...col,
    autoHeight: false,
    wrapText: false,
  };
}

/**
 * Infinite row model: fixed row height, flex columns fill the viewport; explicit width/flex:0 stay fixed.
 */
export function prepareInfiniteColumnDefs(columnDefs: DataGridColumnDef[]): DataGridColumnDef[] {
  return columnDefs.map((col) => {
    if (col.checkboxSelection) {
      return narrowCheckboxColumn(col);
    }

    const flex = resolveInfiniteFlex(col);
    const processed: DataGridColumnDef = {
      ...withoutWrapAutoHeight(col),
      filter: false,
      flex,
      resizable: true,
    };

    if (flex !== 0) {
      delete processed.width;
      delete processed.maxWidth;
    }

    return processed;
  });
}

function resolveInfiniteFlex(col: DataGridColumnDef): number {
  if (typeof col.flex === 'number') {
    return col.flex;
  }
  return col.width !== undefined ? 0 : 1;
}

/** Estimated minimum width so column headers are not ellipsized on first paint. */
export function estimateHeaderMinWidth(headerName: string): number {
  const trimmed = headerName.trim();
  if (!trimmed) {
    return 0;
  }
  const HEADER_CHROME_PX = 52;
  return Math.ceil(trimmed.length * 8) + HEADER_CHROME_PX;
}

function applyHeaderMinWidth(source: DataGridColumnDef, processed: DataGridColumnDef): void {
  const headerName = source.headerName;
  if (!headerName) {
    return;
  }
  const sortExtra = source.sortable !== false ? 32 : 0;
  const floor = estimateHeaderMinWidth(headerName) + sortExtra;
  processed.minWidth = Math.max(processed.minWidth ?? 100, floor);
  if (processed.flex === 0) {
    processed.width = Math.max(processed.width ?? processed.minWidth, processed.minWidth);
    if (processed.maxWidth !== undefined) {
      processed.maxWidth = Math.max(processed.maxWidth, processed.minWidth);
    }
  }
}

/**
 * Client-side row model: relation grids may declare multiple flex columns; legacy grids keep last-column flex.
 */
export function prepareClientSideColumnDefs(columnDefs: DataGridColumnDef[]): DataGridColumnDef[] {
  const hasFlexGrow = columnDefs.some(
    (col) => !col.checkboxSelection && typeof col.flex === 'number' && col.flex > 0
  );

  return columnDefs.map((col, index) => {
    if (col.checkboxSelection) {
      return narrowCheckboxColumn(col);
    }

    const processed: DataGridColumnDef = {
      ...withoutWrapAutoHeight(col),
      resizable: col.resizable !== false,
    };

    if (col.field === 'status') {
      processed.flex = typeof col.flex === 'number' ? col.flex : 0;
      processed.minWidth = col.minWidth ?? 160;
      processed.maxWidth = col.maxWidth ?? 160;
      processed.width = col.width ?? processed.maxWidth;
      return processed;
    }

    if (typeof col.flex === 'number') {
      processed.flex = col.flex;
      if (col.flex > 0) {
        processed.minWidth = col.minWidth ?? 100;
        delete processed.width;
        if (col.maxWidth !== undefined) {
          processed.maxWidth = col.maxWidth;
        } else {
          delete processed.maxWidth;
        }
      } else {
        processed.width = col.width ?? col.minWidth ?? 150;
        processed.minWidth = col.minWidth ?? processed.width;
      }
      applyHeaderMinWidth(col, processed);
      return processed;
    }

    if (hasFlexGrow) {
      processed.flex = 0;
      processed.width = col.width ?? col.minWidth ?? 150;
      processed.minWidth = col.minWidth ?? processed.width;
      applyHeaderMinWidth(col, processed);
      return processed;
    }

    if (index === columnDefs.length - 1) {
      processed.flex = 1;
      processed.minWidth = col.minWidth ?? 100;
      delete processed.width;
      delete processed.maxWidth;
    } else {
      processed.flex = 0;
      processed.width = col.width ?? 150;
      processed.minWidth = col.minWidth ?? 100;
    }
    applyHeaderMinWidth(col, processed);
    return processed;
  });
}

/** True when at least one column uses flex grow (clientSide grids that should not auto-size to content). */
export function usesFlexColumnLayout(columnDefs: DataGridColumnDef[]): boolean {
  return columnDefs.some((col) => typeof col.flex === 'number' && col.flex > 0);
}

/**
 * Whether AG Grid should auto-size columns from cell content (clientSide legacy grids only).
 */
export function usesContentBasedColumnSizing(
  rowModelMode: 'infinite' | 'clientSide',
  columnDefs: DataGridColumnDef[]
): boolean {
  if (rowModelMode === 'infinite') {
    return false;
  }
  return !usesFlexColumnLayout(columnDefs);
}
