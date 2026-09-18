import { Injectable, Injector } from '@angular/core';

import { map, Observable } from 'rxjs';

import { RestService } from '@app/core/hal/rest/rest.service';

import { Service } from '../models/service.model';

/** Service manager service */
@Injectable()
export class ServiceService extends RestService<Service> {

  /** constructor */
  constructor(injector: Injector) {
    super(Service, "services", injector);
  }

  fetchWmsItems(): Observable<Service[]> {
    return this.resourceService
      .search(Service, 'wms', 'services', '_embedded', { notPaged: true }, undefined, undefined, false)
      .pipe(map((resourceArray) => resourceArray.result));
  }

}
