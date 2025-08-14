import { CartographyGroup } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { RestService } from '@app/core/hal/rest/rest.service';

/** CartographyGroup manager service */
@Injectable()
export class CartographyGroupService extends RestService<CartographyGroup> {

  /** constructor */
  constructor(injector: Injector) {
    super(CartographyGroup, "cartography-groups", injector);
  }

}
