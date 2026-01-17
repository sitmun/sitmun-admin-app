import { Injectable, Injector } from '@angular/core';

import { RestService } from '@app/core/hal/rest/rest.service';

import { ConfigurationParameter } from '../models/configuration-parameters.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationParametersService extends RestService<ConfigurationParameter> {

  /** constructor */
  constructor(injector: Injector) {
    super(ConfigurationParameter, "configuration-parameters", injector);
  }
}
