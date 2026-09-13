import { Injectable, Injector } from '@angular/core';

import { map, Observable } from 'rxjs';

import { RestService } from '@app/core/hal/rest/rest.service';

import { Cartography, CartographyProjection } from '../models/cartography.model';

/** Cartography manager service */
@Injectable()
export class CartographyService extends RestService<Cartography> {

  /** constructor */
  constructor(injector: Injector) {
    super(Cartography, "cartographies", injector);
  }

  fetchProjectionItemsByService(serviceId: number): Observable<CartographyProjection[]> {
    return this.resourceService
      .search(
        CartographyProjection,
        'byService',
        'cartographies',
        '_embedded',
        { notPaged: true, params: [{ key: 'serviceId', value: serviceId }] },
        undefined,
        undefined,
        false,
      )
      .pipe(map((resourceArray) => resourceArray.result));
  }
}
