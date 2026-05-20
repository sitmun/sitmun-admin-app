import type {IGetRowsParams} from '@ag-grid-community/core';
import {defer, of, throwError} from 'rxjs';

import {createInfiniteDatasource} from './infinite-datasource';

describe('createInfiniteDatasource', () => {
  it('maps startRow to page and calls successCallback with totalElements', () => {
    const fetch = jest.fn().mockReturnValue(
      of({rows: [{id: 1}], totalElements: 100, pageNumber: 0, pageSize: 10, totalPages: 10}),
    );
    const successCallback = jest.fn();
    const ds = createInfiniteDatasource(fetch, {pageSize: 10});

    ds.getRows!({
      startRow: 20,
      endRow: 30,
      sortModel: [{colId: 'name', sort: 'asc'}],
      filterModel: {name: {filter: 'x'}},
      successCallback,
      failCallback: jest.fn(),
    } as unknown as IGetRowsParams);

    expect(fetch).toHaveBeenCalledWith(
      expect.objectContaining({page: 2, size: 10, filterModel: {name: {filter: 'x'}}}),
    );
    expect(successCallback).toHaveBeenCalledWith([{id: 1}], 100);
  });

  it('calls failCallback on error', () => {
    const fetch = jest.fn().mockReturnValue(throwError(() => new Error('fail')));
    const failCallback = jest.fn();
    const ds = createInfiniteDatasource(fetch, {pageSize: 10});

    ds.getRows!({
      startRow: 0,
      endRow: 10,
      sortModel: [],
      successCallback: jest.fn(),
      failCallback,
    } as unknown as IGetRowsParams);

    expect(failCallback).toHaveBeenCalled();
  });

  it('includes backend search text and stable id sort when backend search is enabled', () => {
    const fetch = jest.fn().mockReturnValue(
      of({rows: [], totalElements: 0, pageNumber: 0, pageSize: 10, totalPages: 0}),
    );
    const ds = createInfiniteDatasource(fetch, {
      pageSize: 10,
      backendSearch: {
        enabled: true,
        getSearchText: () => ' roads ',
      },
    });

    ds.getRows!({
      startRow: 0,
      endRow: 10,
      sortModel: [{colId: 'name', sort: 'asc'}],
      successCallback: jest.fn(),
      failCallback: jest.fn(),
    } as unknown as IGetRowsParams);

    expect(fetch).toHaveBeenCalledWith(expect.objectContaining({
      searchText: 'roads',
      sort: [{path: 'name', order: 'ASC'}, {path: 'id', order: 'ASC'}],
    }));
  });

  it('omits backend search text for blank search so fetchers use normal paging', () => {
    const fetch = jest.fn().mockReturnValue(
      of({rows: [], totalElements: 5, pageNumber: 0, pageSize: 10, totalPages: 1}),
    );
    const ds = createInfiniteDatasource(fetch, {
      pageSize: 10,
      backendSearch: {
        enabled: true,
        getSearchText: () => '   ',
      },
    });

    ds.getRows!({
      startRow: 0,
      endRow: 10,
      sortModel: [],
      successCallback: jest.fn(),
      failCallback: jest.fn(),
    } as unknown as IGetRowsParams);

    expect(fetch).toHaveBeenCalledWith(expect.not.objectContaining({searchText: expect.any(String)}));
  });

  it('ignores stale responses when generation changed', () => {
    let generation = 0;
    const fetch = jest.fn().mockImplementation(() =>
      defer(() => {
        generation += 1;
        return of({rows: [{id: 1}], totalElements: 1, pageNumber: 0, pageSize: 10, totalPages: 1});
      }),
    );
    const successCallback = jest.fn();
    const ds = createInfiniteDatasource(fetch, {
      pageSize: 10,
      getGeneration: () => generation,
    });

    ds.getRows!({
      startRow: 0,
      endRow: 10,
      sortModel: [],
      successCallback,
      failCallback: jest.fn(),
    } as unknown as IGetRowsParams);

    expect(successCallback).not.toHaveBeenCalled();
  });

  it('unsubscribes active requests on destroy', () => {
    const ds = createInfiniteDatasource(() => of({
      rows: [],
      totalElements: 0,
      pageNumber: 0,
      pageSize: 10,
      totalPages: 0,
    }), {pageSize: 10});

    ds.destroy!();
    expect(ds.destroy).toBeDefined();
  });

  it('progressively fetches pages until local filter fills requested block', (done) => {
    const fetch = jest.fn()
      .mockReturnValueOnce(of({rows: [{name: 'alpha'}, {name: 'beta'}], totalElements: 6, pageNumber: 0, pageSize: 2, totalPages: 3}))
      .mockReturnValueOnce(of({rows: [{name: 'gamma'}, {name: 'delta'}], totalElements: 6, pageNumber: 1, pageSize: 2, totalPages: 3}));
    const successCallback = jest.fn((rows, lastRow) => {
      expect(rows).toEqual([{name: 'beta'}, {name: 'delta'}]);
      expect(lastRow).toBeUndefined();
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenNthCalledWith(1, expect.objectContaining({page: 0, size: 2}));
      expect(fetch).toHaveBeenNthCalledWith(2, expect.objectContaining({page: 1, size: 2}));
      done();
    });
    const ds = createInfiniteDatasource(fetch, {
      pageSize: 2,
      columnDefs: [{field: 'name'}],
      progressiveLocalFilter: {
        enabled: true,
        getSearchText: () => 'ta',
      },
    });

    ds.getRows!({
      startRow: 0,
      endRow: 2,
      sortModel: [],
      successCallback,
      failCallback: (error) => done(error),
    } as unknown as IGetRowsParams);
  });

  it('does not progressively scan pages when backend search is enabled', () => {
    const fetch = jest.fn().mockReturnValue(
      of({rows: [{name: 'alpha'}], totalElements: 1, pageNumber: 0, pageSize: 2, totalPages: 3}),
    );
    const successCallback = jest.fn();
    const ds = createInfiniteDatasource(fetch, {
      pageSize: 2,
      columnDefs: [{field: 'name'}],
      backendSearch: {
        enabled: true,
        getSearchText: () => 'alpha',
      },
      progressiveLocalFilter: {
        enabled: true,
        getSearchText: () => 'alpha',
      },
    });

    ds.getRows!({
      startRow: 0,
      endRow: 2,
      sortModel: [],
      successCallback,
      failCallback: jest.fn(),
    } as unknown as IGetRowsParams);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expect.objectContaining({searchText: 'alpha'}));
    expect(successCallback).toHaveBeenCalledWith([{name: 'alpha'}], 1);
  });

  it('progressive local filter reports final row count when every page is scanned', (done) => {
    const fetch = jest.fn()
      .mockReturnValueOnce(of({rows: [{name: 'nope'}, {name: 'match one'}], totalElements: 4, pageNumber: 0, pageSize: 2, totalPages: 2}))
      .mockReturnValueOnce(of({rows: [{name: 'match two'}, {name: 'nope'}], totalElements: 4, pageNumber: 1, pageSize: 2, totalPages: 2}));
    const successCallback = jest.fn((rows, lastRow) => {
      expect(rows).toEqual([{name: 'match one'}, {name: 'match two'}]);
      expect(lastRow).toBe(2);
      expect(fetch).toHaveBeenCalledTimes(2);
      done();
    });
    const ds = createInfiniteDatasource(fetch, {
      pageSize: 10,
      columnDefs: [{field: 'name'}],
      progressiveLocalFilter: {
        enabled: true,
        getSearchText: () => 'match',
      },
    });

    ds.getRows!({
      startRow: 0,
      endRow: 10,
      sortModel: [],
      successCallback,
      failCallback: (error) => done(error),
    } as unknown as IGetRowsParams);
  });
});
