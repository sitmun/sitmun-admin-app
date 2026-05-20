import {of} from 'rxjs';

import type {HalPage} from './hal-page';
import type {InfiniteBlockRequest} from './infinite-block-request';
import {createPagedInfiniteFetcher} from './infinite-block-fetcher';
import type {RestService} from './rest/rest.service';
import {Resource} from './resource/resource.model';

class MockEntity extends Resource {
  name?: string;
}

describe('createPagedInfiniteFetcher', () => {
  let mockService: jest.Mocked<Pick<RestService<MockEntity>, 'fetchPage' | 'searchTextPage'>>;

  beforeEach(() => {
    mockService = {
      fetchPage: jest.fn(),
      searchTextPage: jest.fn(),
    };
  });

  it('calls fetchPage when searchText is empty', (done) => {
    const mockPage: HalPage<MockEntity> = {
      rows: [{id: 1, name: 'test'} as MockEntity],
      pageNumber: 0,
      pageSize: 100,
      totalElements: 1,
      totalPages: 1,
    };
    mockService.fetchPage.mockReturnValue(of(mockPage));

    const fetcher = createPagedInfiniteFetcher(mockService);
    const request: InfiniteBlockRequest = {
      page: 0,
      size: 100,
      sort: [{path: 'name', order: 'ASC'}],
    };

    fetcher(request).subscribe((page) => {
      expect(mockService.fetchPage).toHaveBeenCalledWith({
        page: 0,
        size: 100,
        sort: [{path: 'name', order: 'ASC'}],
      });
      expect(mockService.searchTextPage).not.toHaveBeenCalled();
      expect(page.rows.length).toBe(1);
      done();
    });
  });

  it('calls searchTextPage when searchText is provided', (done) => {
    const mockPage: HalPage<MockEntity> = {
      rows: [{id: 1, name: 'road'} as MockEntity],
      pageNumber: 0,
      pageSize: 100,
      totalElements: 1,
      totalPages: 1,
    };
    mockService.searchTextPage.mockReturnValue(of(mockPage));

    const fetcher = createPagedInfiniteFetcher(mockService);
    const request: InfiniteBlockRequest = {
      page: 0,
      size: 100,
      sort: [{path: 'name', order: 'ASC'}],
      searchText: 'road',
    };

    fetcher(request).subscribe((page) => {
      expect(mockService.searchTextPage).toHaveBeenCalledWith('road', {
        page: 0,
        size: 100,
        sort: [{path: 'name', order: 'ASC'}],
      });
      expect(mockService.fetchPage).not.toHaveBeenCalled();
      expect(page.rows[0].name).toBe('road');
      done();
    });
  });

  it('merges static params with fetchPage', (done) => {
    const mockPage: HalPage<MockEntity> = {
      rows: [],
      pageNumber: 0,
      pageSize: 100,
      totalElements: 0,
      totalPages: 0,
    };
    mockService.fetchPage.mockReturnValue(of(mockPage));

    const fetcher = createPagedInfiniteFetcher(mockService, {
      params: [{key: 'typeId', value: 1}],
    });
    const request: InfiniteBlockRequest = {
      page: 0,
      size: 100,
      sort: [],
    };

    fetcher(request).subscribe(() => {
      expect(mockService.fetchPage).toHaveBeenCalledWith({
        page: 0,
        size: 100,
        sort: [],
        params: [{key: 'typeId', value: 1}],
      });
      done();
    });
  });

  it('merges static params with searchTextPage', (done) => {
    const mockPage: HalPage<MockEntity> = {
      rows: [],
      pageNumber: 0,
      pageSize: 100,
      totalElements: 0,
      totalPages: 0,
    };
    mockService.searchTextPage.mockReturnValue(of(mockPage));

    const fetcher = createPagedInfiniteFetcher(mockService, {
      params: [{key: 'typeId', value: 1}],
    });
    const request: InfiniteBlockRequest = {
      page: 0,
      size: 100,
      sort: [],
      searchText: 'test',
    };

    fetcher(request).subscribe(() => {
      expect(mockService.searchTextPage).toHaveBeenCalledWith('test', {
        page: 0,
        size: 100,
        sort: [],
        params: [{key: 'typeId', value: 1}],
      });
      done();
    });
  });

  it('applies optional mapRow transformation', (done) => {
    const mockPage: HalPage<MockEntity> = {
      rows: [{id: 1, name: 'raw'} as MockEntity],
      pageNumber: 0,
      pageSize: 100,
      totalElements: 1,
      totalPages: 1,
    };
    mockService.fetchPage.mockReturnValue(of(mockPage));

    const fetcher = createPagedInfiniteFetcher(mockService, {
      mapRow: (row) => ({...row, name: row.name?.toUpperCase()}),
    });
    const request: InfiniteBlockRequest = {
      page: 0,
      size: 100,
      sort: [],
    };

    fetcher(request).subscribe((page) => {
      expect(page.rows[0].name).toBe('RAW');
      done();
    });
  });
});
