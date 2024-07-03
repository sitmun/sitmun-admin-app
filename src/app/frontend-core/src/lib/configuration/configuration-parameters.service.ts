import { Injectable, Injector } from '@angular/core';
import { ConfigurationParameter } from './configuration-parameters.model';
import { HttpClient } from '@angular/common/http';
import {RestService} from '../angular-hal/src/lib/rest.service';

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
