import { Injectable, Injector } from '@angular/core';
import { ConfigurationParameter } from '@app/domain';
import { RestService } from '@app/core/hal/rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationParametersService extends RestService<ConfigurationParameter> {

  /** constructor */
  constructor(injector: Injector) {
    super(ConfigurationParameter, "configuration-parameters", injector);
  }
}
