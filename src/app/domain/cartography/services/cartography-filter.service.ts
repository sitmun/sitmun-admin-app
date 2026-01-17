import { Injectable, Injector } from '@angular/core';

import { RestService } from '@app/core/hal/rest/rest.service';

import { CartographyFilter } from '../models/cartography-filter.model';

/** CartographyFilter manager service */
@Injectable()
export class CartographyFilterService extends RestService<CartographyFilter> {

  /** constructor */
  constructor(injector: Injector) {
    super(CartographyFilter, "cartography-filters", injector);
  }
}
