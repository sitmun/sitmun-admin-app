import { Injectable, Injector } from '@angular/core';

import { RestService } from '@app/core/hal/rest/rest.service';

import { ServiceParameter } from '../models/service-parameter.model';

/** Service parameter manager service */
@Injectable()
export class ServiceParameterService extends RestService<ServiceParameter> {

  /** constructor */
  constructor(injector: Injector) {
    super(ServiceParameter, "service-parameters", injector);
  }

}
