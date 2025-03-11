import { RestService } from '@app/core/hal';
import { User } from '@app/domain';
import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

/** User manager service */
@Injectable()
export class UserService extends RestService<User> {

  /** API resource path */
  public USER_API ='users';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(User, "users", injector);
  }

  /** remove user*/
  remove(item: User) {
    return this.http.delete(item._links.self.href);

  }

  /** save user*/
  save(item: any): Observable<any> {
    let result: Observable<object>;
    if (item._links!=null) {
      result = this.http.put(item._links.self.href, item);
    } else {
      result = this.http.post(this.resourceService.getResourceUrl(this.USER_API) , item);
    }
    return result;
  }
}
