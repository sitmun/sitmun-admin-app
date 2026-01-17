import { Injectable, Injector } from '@angular/core';

import { RestService } from '@app/core/hal/rest/rest.service';

import { ApplicationParameter } from '../models/application-parameter.model';

/** Application parameter manager service */
@Injectable()
export class ApplicationParameterService extends RestService<ApplicationParameter> {

  /** constructor */
  constructor(injector: Injector) {
    super(ApplicationParameter, "application-parameters", injector);
  }
}
