import { Injectable, Injector } from '@angular/core';

import { RestService } from '@app/core/hal/rest/rest.service';

import { ApplicationBackground } from '../models/application-background.model';

/** Application background manager service */
@Injectable()
export class ApplicationBackgroundService extends RestService<ApplicationBackground> {

  /** constructor */
  constructor(injector: Injector) {
    super(ApplicationBackground, "application-backgrounds", injector);
  }
}
