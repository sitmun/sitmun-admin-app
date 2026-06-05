import type {Sort} from './rest/sort.model';

/** Maps AG Grid sort model entries to HAL sort parameters */
export function mapAgSortToHal(
  sortModel: Array<{ colId: string; sort: string; sortField?: string; field?: string }> | undefined,
  columnDefs?: Array<{ field?: string; sortField?: string; colId?: string; cellRendererParams?: { sortField?: string } }>,
): Sort[] | undefined {
  if (!sortModel?.length) {
    return undefined;
  }
  const colById = new Map(
    (columnDefs ?? []).map((col) => [col.colId ?? col.field, col]),
  );
  return sortModel.map((entry) => {
    const colDef = colById.get(entry.colId);
    const path = entry.sortField ?? colDef?.cellRendererParams?.sortField ?? colDef?.sortField ?? colDef?.field ?? entry.colId;
    return { path, order: entry.sort?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC' };
  });
}
