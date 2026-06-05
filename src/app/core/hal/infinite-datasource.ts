import type {GridApi, IDatasource, IGetRowsParams} from '@ag-grid-community/core';
import {firstValueFrom, from, Subscription} from 'rxjs';
import type {Observable} from 'rxjs';

import type {HalPage} from './hal-page';
import type {InfiniteBlockRequest} from './infinite-block-request';
import {INFINITE_PAGE_SIZE_DEFAULT} from './infinite-page-size';
import {mapAgSortToHal} from './map-ag-sort-to-hal';


export interface InfiniteDatasourceOptions {
  pageSize?: number;
  columnDefs?: Array<{
    field?: string;
    sortField?: string;
    colId?: string;
    cellRendererParams?: { sortField?: string };
    valueGetter?: (params: { data: unknown }) => unknown;
  }>;
  gridApi?: GridApi;
  getGeneration?: () => number;
  backendSearch?: {
    enabled?: boolean;
    getSearchText?: () => string | undefined;
  };
  progressiveLocalFilter?: {
    enabled?: boolean;
    getSearchText?: () => string | undefined;
    matches?: (row: unknown, searchText: string) => boolean;
  };
}

/** Creates an AG Grid infinite row model datasource backed by HAL paged fetches */
export function createInfiniteDatasource<T>(
  fetch: (request: InfiniteBlockRequest) => Observable<HalPage<T>>,
  options: InfiniteDatasourceOptions = {},
): IDatasource {
  const pageSize = options.pageSize ?? INFINITE_PAGE_SIZE_DEFAULT;
  const active = new Subscription();
  let lastTotalElements: number | undefined;
  let progressiveCache = createProgressiveCache<T>('');

  return {
    getRows: (params: IGetRowsParams) => {
      const page = Math.floor(params.startRow / pageSize);
      const generationAtStart = options.getGeneration?.() ?? 0;
      const sort = mapAgSortToHal(params.sortModel as any, options.columnDefs);
      const request: InfiniteBlockRequest = {
        page,
        size: pageSize,
        sort: appendStableIdSort(sort),
        filterModel: params.filterModel,
      };

      const backendSearchText = (options.backendSearch?.getSearchText?.() ?? '').trim();
      if (options.backendSearch?.enabled && backendSearchText) {
        request.searchText = backendSearchText;
      }

      const searchText = (options.progressiveLocalFilter?.getSearchText?.() ?? '').trim().toLocaleLowerCase();
      if (!options.backendSearch?.enabled && options.progressiveLocalFilter?.enabled && searchText) {
        const cacheKey = JSON.stringify({searchText, sort});
        const sub = from(loadProgressiveRows(params, request, cacheKey, searchText, generationAtStart)).subscribe({
          next: ({rows, lastRow, stale}) => {
            if (stale || (options.getGeneration?.() ?? 0) !== generationAtStart) {
              params.failCallback();
              return;
            }
            params.successCallback(rows, lastRow);
          },
          error: () => params.failCallback(),
        });
        active.add(sub);
        return;
      }

      const sub = fetch(request).subscribe({
        next: ({rows, totalElements}) => {
          if ((options.getGeneration?.() ?? 0) !== generationAtStart) {
            return;
          }
          if (
            options.gridApi &&
            lastTotalElements !== undefined &&
            lastTotalElements !== totalElements
          ) {
            options.gridApi.setRowCount(totalElements, true);
          }
          lastTotalElements = totalElements;
          params.successCallback(rows, totalElements);
        },
        error: () => params.failCallback(),
      });
      active.add(sub);
    },
    destroy: () => active.unsubscribe(),
  };

  async function loadProgressiveRows(
    params: IGetRowsParams,
    request: InfiniteBlockRequest,
    cacheKey: string,
    searchText: string,
    generationAtStart: number,
  ): Promise<{rows: T[]; lastRow?: number; stale?: boolean}> {
    if (progressiveCache.key !== cacheKey) {
      progressiveCache = createProgressiveCache<T>(cacheKey);
    }

    while (progressiveCache.rows.length < params.endRow && !progressiveCache.exhausted) {
      if ((options.getGeneration?.() ?? 0) !== generationAtStart) {
        return {rows: [], stale: true};
      }
      const pageResult = await firstValueFrom(fetch({...request, page: progressiveCache.nextPage}));
      if ((options.getGeneration?.() ?? 0) !== generationAtStart) {
        return {rows: [], stale: true};
      }
      const pageMatches = pageResult.rows.filter((row) => rowMatches(row, searchText));
      progressiveCache.rows.push(
        ...pageMatches,
      );
      progressiveCache.nextPage = pageResult.pageNumber + 1;
      progressiveCache.exhausted = progressiveCache.nextPage >= pageResult.totalPages;
    }

    const returnedRows = progressiveCache.rows.slice(params.startRow, params.endRow);
    const lastRow = progressiveCache.exhausted ? progressiveCache.rows.length : undefined;
    return {
      rows: returnedRows,
      lastRow,
    };
  }

  function rowMatches(row: T, searchText: string): boolean {
    const customMatch = options.progressiveLocalFilter?.matches;
    if (customMatch) {
      return customMatch(row, searchText);
    }

    const columnDefs = options.columnDefs?.filter((col) => col.field || col.valueGetter) ?? [];
    const values = columnDefs.length
      ? columnDefs.map((col) => columnValue(row, col))
      : [row];

    return values.some((value) => stringifySearchValue(value).includes(searchText));
  }

  function columnValue(
    row: T,
    col: {field?: string; valueGetter?: (params: { data: unknown }) => unknown},
  ): unknown {
    if (col.valueGetter) {
      return col.valueGetter({data: row});
    }
    return col.field?.split('.').reduce<unknown>((value, key) => {
      if (value && typeof value === 'object' && key in value) {
        return (value as Record<string, unknown>)[key];
      }
      return undefined;
    }, row);
  }
}

function createProgressiveCache<T>(key: string): {
  key: string;
  rows: T[];
  nextPage: number;
  exhausted: boolean;
} {
  return {key, rows: [], nextPage: 0, exhausted: false};
}

function stringifySearchValue(value: unknown): string {
  if (value == null) {
    return '';
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value).toLocaleLowerCase();
  }
  return JSON.stringify(value).toLocaleLowerCase();
}

function appendStableIdSort(sort: InfiniteBlockRequest['sort']): InfiniteBlockRequest['sort'] {
  if (!sort?.length || sort.some((item) => item.path === 'id')) {
    return sort;
  }
  return [...sort, {path: 'id', order: 'ASC'}];
}
