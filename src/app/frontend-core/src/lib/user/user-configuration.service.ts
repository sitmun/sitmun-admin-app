import { RestService } from '../angular-hal/src/lib/rest.service';
import { UserConfiguration } from './user-configuration.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

/** User configuration manager service */
@Injectable()
export class UserConfigurationService extends RestService<UserConfiguration> {

  /** API resource path */
  public USER_CONFIGURATION_API = 'user-configurations';

  /** constructor */
  constructor(injector: Injector, private http: HttpClient) {
    super(UserConfiguration, "user-configurations", injector);
  }

  /** remove user configuration*/
  remove(item: UserConfiguration) {
    return this.http.delete(item._links.self.href);

  }

  /** save user configuration*/
  save(item: any): Observable<any> {
    let result: Observable<Object>;
    if (item._links != null) {
      result = this.http.put(item._links.self.href, item);
    } else {
      item.territory = item.territory._links.self.href;
      item.role = item.role!=null?item.role._links.self.href:null;
      item.user = item.user._links.self.href;
      item.roleChildren = item.roleChildren!=null?item.roleChildren._links.self.href:null;
      result = this.http.post(this.resourceService.getResourceUrl(this.USER_CONFIGURATION_API), item);
    }
    return result;
  }

}
