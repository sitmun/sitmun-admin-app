import { Injectable, Injector } from '@angular/core';
import { ConfigurationParameter } from '@app/domain';
import { HttpClient } from '@angular/common/http';
import { RestService } from '@app/core/hal';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationParametersService extends RestService<ConfigurationParameter> {

  /** API resource path */
  public CONFIGURATION_PARAMETERS_API = 'configuration-parameters';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(ConfigurationParameter, "configuration-parameters", injector);
  }


}
