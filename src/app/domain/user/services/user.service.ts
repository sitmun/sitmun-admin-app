import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import { ResourceHelper } from '@app/core/hal/resource/resource-helper';
import { RestService } from '@app/core/hal/rest/rest.service';

import { User } from '../models/user.model';

/** User manager service */
@Injectable()
export class UserService extends RestService<User> {

  /** API resource path */
  public USER_API = 'users';

  /** constructor */
  constructor(injector: Injector) {
    super(User, "users", injector);
  }

  /** save user*/
  save(item: any): Observable<any> {
    if (ResourceHelper.canBeUpdated(item)) {
      return this.update(item);
    } 
    return this.create(item);
  }
}
