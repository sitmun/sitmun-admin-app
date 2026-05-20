import { Injectable, Injector } from '@angular/core';

import type {Observable} from 'rxjs';

import type {HalPage} from '@app/core/hal/hal-page';
import { RestService } from '@app/core/hal/rest/rest.service';
import type {HalOptions} from '@app/core/hal/rest/rest.service';

import { Cartography } from '../models/cartography.model';

/** Cartography manager service */
@Injectable()
export class CartographyService extends RestService<Cartography> {

  /** constructor */
  constructor(injector: Injector) {
    super(Cartography, "cartographies", injector);
  }
}
