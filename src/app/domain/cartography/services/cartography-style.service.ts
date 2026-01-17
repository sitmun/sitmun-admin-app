import { Injectable, Injector } from '@angular/core';

import { RestService } from '@app/core/hal/rest/rest.service';

import { CartographyStyle } from '../models/cartography-style.model';

@Injectable({
  providedIn: 'root'
})
export class CartographyStyleService extends RestService<CartographyStyle> {

  /** constructor */
  constructor(injector: Injector) {
    super(CartographyStyle, "cartography-styles", injector);
  }

}
