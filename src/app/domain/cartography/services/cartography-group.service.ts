import { Injectable, Injector } from '@angular/core';

import { RestService } from '@app/core/hal/rest/rest.service';

import { CartographyGroup } from '../models/cartography-group.model';

/** CartographyGroup manager service */
@Injectable()
export class CartographyGroupService extends RestService<CartographyGroup> {

  /** constructor */
  constructor(injector: Injector) {
    super(CartographyGroup, "cartography-groups", injector);
  }

}
