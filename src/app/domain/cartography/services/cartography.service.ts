import { Cartography } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { RestService } from '@app/core/hal/rest/rest.service';

/** Cartography manager service */
@Injectable()
export class CartographyService extends RestService<Cartography> {

  /** constructor */
  constructor(injector: Injector) {
    super(Cartography, "cartographies", injector);
  }
}
