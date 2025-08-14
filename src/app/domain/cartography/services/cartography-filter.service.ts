import { CartographyFilter } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { RestService } from '@app/core/hal/rest/rest.service';

/** CartographyFilter manager service */
@Injectable()
export class CartographyFilterService extends RestService<CartographyFilter> {

  /** constructor */
  constructor(injector: Injector) {
    super(CartographyFilter, "cartography-filters", injector);
  }
}
