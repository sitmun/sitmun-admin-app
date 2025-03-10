import { User } from '@app/frontend-core/src/lib/public_api';
import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { RestService } from '@app/frontend-core/src/lib/angular-hal/src/lib/rest.service';
import { ResourceService } from '@app/frontend-core/src/lib/angular-hal/src/lib/resource.service';

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
  override get(): Observable<User> {
    return this.http.get<User>(this.resourceService.getResourceUrl(this.ACCOUNT_API));
  }
  
  /** save account*/
  save(item: Partial<User>): Observable<User> {
    return this.http.post<User>(this.resourceService.getResourceUrl(this.ACCOUNT_API), item);
  }

  /** change logged in user account password */  
  changePassword(passwordData: { currentPassword: string; newPassword: string }): Observable<void> {
    return this.http.post<void>(
      this.resourceService.getResourceUrl(this.ACCOUNT_API + "/change-password"),
      passwordData
    );
  }
} 