import {Injectable, Injector} from '@angular/core';

import {RestService} from '@app/core/hal/rest/rest.service';

import {CartographyAvailability} from '../models/cartography-availability.model';

/** CartographyAvailability manager service */
@Injectable()
export class CartographyAvailabilityService extends RestService<CartographyAvailability> {

  /** constructor */
  constructor(injector: Injector) {
    super(CartographyAvailability, "cartography-availabilities", injector);
  }
}
