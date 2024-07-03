import { Role } from './role.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';

/** Role manager service */
@Injectable()
export class RoleService extends RestService<Role> {
  
  /** API resource path */
  public ROLE_API = 'roles';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(Role, "roles", injector);
  }
  
  /** remove role*/
  remove(item: Role) {
    return this.http.delete(item._links.self.href);
   
  }
  
  /** save role*/
  save(item: any): Observable<any> {
    let result: Observable<Object>;
    if (item._links!=null) {
      result = this.http.put(item._links.self.href, item);
    } else {
      result = this.http.post(this.resourceService.getResourceUrl(this.ROLE_API) , item);
    }
    return result;
  }
  
}
