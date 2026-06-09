import {HttpParams} from '@angular/common/http';

import {ResourceHelper} from './resource-helper';

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
