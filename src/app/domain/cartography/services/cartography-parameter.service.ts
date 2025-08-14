import { CartographyParameter } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { RestService } from '@app/core/hal/rest/rest.service';

/** Service parameter manager service */
@Injectable()
export class CartographyParameterService extends RestService<CartographyParameter> {

  /** constructor */
  constructor(injector: Injector) {
    super(CartographyParameter, "cartography-parameters", injector);
  }

}
