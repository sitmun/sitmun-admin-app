import { ServiceParameter } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { RestService } from '@app/core/hal/rest/rest.service';

/** Service parameter manager service */
@Injectable()
export class ServiceParameterService extends RestService<ServiceParameter> {

  /** constructor */
  constructor(injector: Injector) {
    super(ServiceParameter, "service-parameters", injector);
  }

}
