import {Injectable, Injector} from '@angular/core';
import {CartographyAvailability} from '@app/domain';
import {RestService} from '@app/core/hal/rest/rest.service';

/** CartographyAvailability manager service */
@Injectable()
export class CartographyAvailabilityService extends RestService<CartographyAvailability> {

  /** constructor */
  constructor(injector: Injector) {
    super(CartographyAvailability, "cartography-availabilities", injector);
  }
}
