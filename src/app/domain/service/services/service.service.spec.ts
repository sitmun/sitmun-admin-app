import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { ResourceArray } from '@app/core/hal/resource/resource-array.model';
import { ResourceService } from '@app/core/hal/resource/resource.service';

import { ServiceService } from './service.service';
import { Service } from '../models/service.model';

describe('ServiceService', () => {
  let service: ServiceService;
  let resourceService: jest.Mocked<Pick<ResourceService, 'search'>>;

  beforeEach(() => {
    resourceService = { search: jest.fn() };
    TestBed.configureTestingModule({
      providers: [{ provide: ResourceService, useValue: resourceService }],
    });
    service = new ServiceService(TestBed.inject(Injector));
  });

  it('fetchWmsItems uses wms search with view projection', (done) => {
    const result = new ResourceArray<Service>();
    result.result = [{ id: 1, name: 'WMS A', type: 'WMS' } as Service];
    resourceService.search.mockReturnValue(of(result));

    service.fetchWmsItems().subscribe((services) => {
      expect(services).toEqual([{ id: 1, name: 'WMS A', type: 'WMS' } as Service]);
      expect(resourceService.search).toHaveBeenCalledWith(
        Service,
        'wms',
        'services',
        '_embedded',
        { notPaged: true },
        undefined,
        undefined,
        false,
      );
      done();
    });
  });
});
