import type {Sort} from './rest/sort.model';

/** Request passed from AG Grid infinite datasource to HAL block fetchers */
export interface InfiniteBlockRequest {
  page: number;
  size: number;
  sort?: Sort[];
  filterModel?: unknown;
  searchText?: string;
}
