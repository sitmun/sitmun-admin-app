import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { ResourceArray } from '@app/core/hal/resource/resource-array.model';
import { ResourceService } from '@app/core/hal/resource/resource.service';

import { CartographyService } from './cartography.service';
import { CartographyProjection } from '../models/cartography.model';

describe('CartographyService', () => {
  let service: CartographyService;
  let resourceService: jest.Mocked<Pick<ResourceService, 'search'>>;

  beforeEach(() => {
    resourceService = { search: jest.fn() };
    TestBed.configureTestingModule({
      providers: [{ provide: ResourceService, useValue: resourceService }],
    });
    service = new CartographyService(TestBed.inject(Injector));
  });

  it('fetchProjectionItemsByService uses byService search with serviceId param', (done) => {
    const result = new ResourceArray<CartographyProjection>();
    result.result = [{ id: 4, name: 'Layer A', serviceId: 9, layers: ['layer_a'] } as CartographyProjection];
    resourceService.search.mockReturnValue(of(result));

    service.fetchProjectionItemsByService(9).subscribe((cartographies) => {
      expect(cartographies).toEqual([{ id: 4, name: 'Layer A', serviceId: 9, layers: ['layer_a'] } as CartographyProjection]);
      expect(resourceService.search).toHaveBeenCalledWith(
        CartographyProjection,
        'byService',
        'cartographies',
        '_embedded',
        { notPaged: true, params: [{ key: 'serviceId', value: 9 }] },
        undefined,
        undefined,
        false,
      );
      done();
    });
  });
});
