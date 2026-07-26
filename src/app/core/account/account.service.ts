import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';


import { User } from '@app/domain/user/models/user.model';

import {ResourceService} from '../hal/resource/resource.service';
import {RestService} from '../hal/rest/rest.service';

/** Account manager service */
@Injectable()
export class AccountService extends RestService<User> {
  /** API resource path */
  public ACCOUNT_API = 'account';

  /** Constructor */
  constructor(
    injector: Injector,
    private http: HttpClient,
    public override resourceService: ResourceService
  ) {
    super(User, "account", injector);
  }

  /** get logged in user account*/
  override get(context = new HttpContext()): Observable<User> {
    return this.http.get<User>(
      this.resourceService.getResourceUrl(this.ACCOUNT_API),
      {context, withCredentials: true}
    );
  }

  /** save account*/
  save(item: Partial<User>): Observable<User> {
    return this.http.post<User>(this.resourceService.getResourceUrl(this.ACCOUNT_API), item, { withCredentials: true });
  }

  /** change logged in user account password */
  changePassword(passwordData: { currentPassword: string; newPassword: string }): Observable<void> {
    return this.http.post<void>(
      this.resourceService.getResourceUrl(this.ACCOUNT_API + "/change-password"),
      passwordData,
      { withCredentials: true }
    );
  }
}
