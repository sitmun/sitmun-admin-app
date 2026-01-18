import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import { ResourceHelper } from '@app/core/hal/resource/resource-helper';
import { RestService } from '@app/core/hal/rest/rest.service';
import { LoggerService } from '@app/services/logger.service';

import { UserConfiguration } from '../models/user-configuration.model';

/** User configuration manager service */
@Injectable()
export class UserConfigurationService extends RestService<UserConfiguration> {

  /** API resource path */
  public USER_CONFIGURATION_API = 'user-configurations';

  /** constructor */
  constructor(injector: Injector, private loggerService: LoggerService) {
    super(UserConfiguration, "user-configurations", injector);
  }

  /** save user configuration*/
  save(item: any): Observable<any> {
    let result: Observable<object>;
    this.loggerService.info('Saving user configuration', item);
    if (ResourceHelper.canBeUpdated(item)) {
      result = this.update(item);
    } else {
      item.territory = ResourceHelper.getSelfHref(item.territory);
      item.role = ResourceHelper.getSelfHref(item.role);
      item.user = ResourceHelper.getSelfHref(item.user);
      item.roleChildren = ResourceHelper.getSelfHref(item.roleChildren);
      result = this.create(item);
    }
    return result;
  }

}
