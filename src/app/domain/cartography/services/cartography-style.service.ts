import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from '@app/core/hal/rest/rest.service';
import { CartographyStyle } from '@app/domain';
import { LoggerService } from '@app/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class CartographyStyleService extends RestService<CartographyStyle> {

  /** constructor */
  constructor(injector: Injector) {
    super(CartographyStyle, "cartography-styles", injector);
  }

}
