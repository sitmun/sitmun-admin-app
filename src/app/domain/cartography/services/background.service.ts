import { Injectable, Injector } from '@angular/core';

import { RestService } from '@app/core/hal/rest/rest.service';

import { Background } from '../models/background.model';

/** Background manager service */
@Injectable()
export class BackgroundService extends RestService<Background> {

  /** constructor */
  constructor(injector: Injector) {
    super(Background, "backgrounds", injector);
  }

}
