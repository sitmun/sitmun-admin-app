import {Injectable, Injector} from '@angular/core';

import {RestService} from '@app/core/hal/rest/rest.service';

import {Territory} from '../models/territory.model';

/** Territory manager service */
@Injectable()
export class TerritoryService extends RestService<Territory> {

  /** constructor */
  constructor(injector: Injector) {
    super(Territory, "territories", injector);
  }
}
