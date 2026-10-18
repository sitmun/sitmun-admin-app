import { Injectable, Injector } from '@angular/core';

import { RestService } from '@app/core/hal/rest/rest.service';

import { CartographyServiceParameter } from '../models/cartography-service-parameter.model';

@Injectable()
export class CartographyServiceParameterService extends RestService<CartographyServiceParameter> {
  constructor(injector: Injector) {
    super(CartographyServiceParameter, 'cartography-service-parameters', injector);
  }
}
