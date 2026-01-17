import { Injectable, Injector } from '@angular/core';

import { RestService } from '@app/core/hal/rest/rest.service';

import { CartographyParameter } from '../models/cartography-parameter.model';

/** Service parameter manager service */
@Injectable()
export class CartographySpatialSelectionParameterService extends RestService<CartographyParameter> {

  /** constructor */
  constructor(injector: Injector) {
    super(CartographyParameter, "cartography-spatial-selection-parameters", injector);
  }
}
