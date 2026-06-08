import {Injector} from '@angular/core';
import {TestBed} from '@angular/core/testing';

import {of} from 'rxjs';

import {RestService} from './rest.service';
import {ResourceArray} from '../resource/resource-array.model';
import {Resource} from '../resource/resource.model';
import {ResourceService} from '../resource/resource.service';

class TestEntity extends Resource {
  name?: string;
}

describe('RestService characterization and paging', () => {
  let resourceService: jest.Mocked<Pick<ResourceService, 'fetch' | 'search'>>;
  let restService: RestService<TestEntity>;

  const sampleArray = (): ResourceArray<TestEntity> => {
    const array = new ResourceArray<TestEntity>();
    array._embedded = '_embedded';
    array.totalElements = 25;
    array.totalPages = 3;
    array.pageNumber = 0;
    array.pageSize = 10;
    array.first_uri = '/api/test?page=0';
    array.result = [{id: 1, name: 'a'} as TestEntity, {id: 2, name: 'b'} as TestEntity];
    return array;
  };

  beforeEach(() => {
    resourceService = {fetch: jest.fn(), search: jest.fn()};
    TestBed.configureTestingModule({
      providers: [{provide: ResourceService, useValue: resourceService}],
    });
    const injector = TestBed.inject(Injector);
    restService = new RestService(TestEntity, 'tests', injector, 'customEmbedded');
  });

  it('fetchAllItems single-shot follows notPaged second request with updated size', (done) => {
    const first = sampleArray();
    resourceService.fetch
      .mockReturnValueOnce(of(first))
      .mockReturnValueOnce(of({
        ...first,
        result: [{id: 1} as TestEntity],
        totalElements: 25,
      } as ResourceArray<TestEntity>));

    restService.fetchAllItems({notPaged: true, chunkedFullFetch: false}).subscribe((rows) => {
      expect(rows.length).toBe(1);
      expect(resourceService.fetch).toHaveBeenCalledTimes(2);
      const secondCall = resourceService.fetch.mock.calls[1][3] as {size: number; notPaged: boolean};
      expect(secondCall.size).toBe(25);
      expect(secondCall.notPaged).toBe(false);
      done();
    });
  });

  it('fetchPage returns hal metadata and rows', (done) => {
    resourceService.fetch.mockReturnValue(of(sampleArray()));

    restService.fetchPage({page: 1, size: 10}).subscribe((page) => {
      expect(page.rows.length).toBe(2);
      expect(page.totalElements).toBe(25);
      expect(page.pageNumber).toBe(0);
      expect(page.pageSize).toBe(10);
      expect(page.totalPages).toBe(3);
      done();
    });
  });

  it('fetchAllItems uses chunked fetch by default', (done) => {
    const page0 = sampleArray();
    const page1 = {...sampleArray(), pageNumber: 1, result: [{id: 3} as TestEntity], totalPages: 2};
    resourceService.fetch
      .mockReturnValueOnce(of(page0))
      .mockReturnValueOnce(of(page1 as ResourceArray<TestEntity>));

    restService.fetchAllItems().subscribe((rows) => {
      expect(rows.map((r) => r.id)).toEqual([1, 2, 3]);
      expect(resourceService.fetch).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('fetchAllItems single-shot when chunkedFullFetch is false', (done) => {
    const singlePage = sampleArray();
    singlePage.first_uri = undefined;
    resourceService.fetch.mockReturnValue(of(singlePage));

    restService.fetchAllItems({chunkedFullFetch: false}).subscribe((rows) => {
      expect(rows.length).toBe(2);
      expect(resourceService.fetch).toHaveBeenCalledTimes(1);
      expect(resourceService.fetch).toHaveBeenCalledWith(
        TestEntity,
        'tests',
        'customEmbedded',
        expect.objectContaining({size: 10000, notPaged: true}),
        undefined,
        undefined,
        undefined,
      );
      done();
    });
  });

  it('fetchAllItems chunked concatenates pages', (done) => {
    const page0 = sampleArray();
    const page1 = {...sampleArray(), pageNumber: 1, result: [{id: 3} as TestEntity], totalPages: 2};
    resourceService.fetch
      .mockReturnValueOnce(of(page0))
      .mockReturnValueOnce(of(page1 as ResourceArray<TestEntity>));

    restService.fetchAllItems({chunkedFullFetch: true, size: 10}).subscribe((rows) => {
      expect(rows.map((r) => r.id)).toEqual([1, 2, 3]);
      done();
    });
  });

  it('searchTextPage calls searchPage with content and q param', (done) => {
    const searchResult = sampleArray();
    resourceService.search.mockReturnValue(of(searchResult));

    restService.searchTextPage('road').subscribe((page) => {
      expect(page.rows.length).toBe(2);
      expect(page.totalElements).toBe(25);
      expect(resourceService.search).toHaveBeenCalledWith(
        TestEntity,
        'content',
        'tests',
        'customEmbedded',
        expect.objectContaining({
          params: expect.arrayContaining([{key: 'q', value: 'road'}]),
        }),
        undefined,
        undefined,
        false,
      );
      done();
    });
  });

  it('searchTextPage merges existing params with q param', (done) => {
    const searchResult = sampleArray();
    resourceService.search.mockReturnValue(of(searchResult));

    restService.searchTextPage('road', {params: [{key: 'typeId', value: 1}], page: 0, size: 50}).subscribe(() => {
      const callArgs = resourceService.search.mock.calls[0];
      const options = callArgs[4];
      expect(options.params).toEqual([{key: 'typeId', value: 1}, {key: 'q', value: 'road'}]);
      expect(options.page).toBe(0);
      expect(options.size).toBe(50);
      done();
    });
  });
});
