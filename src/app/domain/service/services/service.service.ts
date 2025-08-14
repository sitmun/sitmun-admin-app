import { Service } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { RestService } from '@app/core/hal/rest/rest.service';

/** Service manager service */
@Injectable()
export class ServiceService extends RestService<Service> {

  /** constructor */
  constructor(injector: Injector) {
    super(Service, "services", injector);
  }

}
