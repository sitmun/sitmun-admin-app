import type {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import type {HalPage} from './hal-page';
import type {InfiniteBlockRequest} from './infinite-block-request';
import type {HalOptions, HalParam} from './rest/rest.service';
import type {RestService} from './rest/rest.service';
import type {Resource} from './resource/resource.model';

export interface InfiniteBlockFetcherOptions<T> {
  /** Static params to merge with every request (e.g., type.id filter) */
  params?: HalParam[];
  /** Optional row mapper (e.g., CartographyProjection.fromObject) */
  mapRow?: (row: any) => T;
}

/**
 * Creates an infinite block fetcher function for AG Grid infinite row model.
 * Branches between searchTextPage and fetchPage based on request.searchText.
 *
 * @param service - The RestService instance to use for fetching
 * @param options - Optional configuration (params, mapRow)
 * @returns A function that fetches a block of rows for the infinite row model
 */
export function createPagedInfiniteFetcher<T extends Resource>(
  service: Pick<RestService<T>, 'fetchPage' | 'searchTextPage'>,
  options?: InfiniteBlockFetcherOptions<T>,
): (request: InfiniteBlockRequest) => Observable<HalPage<T>> {
  return (request: InfiniteBlockRequest) => {
    const halOptions: HalOptions = {
      page: request.page,
      size: request.size,
      sort: request.sort,
      params: options?.params,
    };

    const page$ = request.searchText
      ? service.searchTextPage(request.searchText, halOptions)
      : service.fetchPage(halOptions);

    if (options?.mapRow) {
      return page$.pipe(
        map((page) => ({
          ...page,
          rows: page.rows.map(options.mapRow!),
        })),
      );
    }

    return page$;
  };
}
