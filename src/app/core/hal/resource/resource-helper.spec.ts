import {HttpParams} from '@angular/common/http';

import {ResourceHelper} from './resource-helper';
import {Resource} from './resource.model';

class HalItem extends Resource {
  name?: string;
}

describe('ResourceHelper.optionParams', () => {
  it('appends page, size, sort, and custom params when provided', () => {
    const params = ResourceHelper.optionParams(new HttpParams(), {
      page: 2,
      size: 10,
      sort: [{path: 'name', order: 'ASC'}],
      params: [{key: 'type.id', value: 5}],
    });

    expect(params.get('page')).toBe('2');
    expect(params.get('size')).toBe('10');
    expect(params.get('sort')).toBe('name,ASC');
    expect(params.get('type.id')).toBe('5');
  });

  it('does not append absent options', () => {
    const params = ResourceHelper.optionParams(new HttpParams(), undefined);
    expect(params.keys().length).toBe(0);
  });
});

describe('ResourceHelper.instantiateResourceCollection', () => {
  it('keeps an empty HAL page when the embedded collection is omitted', () => {
    const result = ResourceHelper.createEmptyResult<HalItem>('_embedded');

    const page = ResourceHelper.instantiateResourceCollection(HalItem, {
      _links: {self: {href: 'http://localhost/api/services?health=unchecked'}},
      page: {size: 100, totalElements: 0, totalPages: 0, number: 0},
    }, result);

    expect(page.result).toEqual([]);
    expect(page.totalElements).toBe(0);
    expect(page.totalPages).toBe(0);
    expect(page.pageNumber).toBe(0);
  });
});
