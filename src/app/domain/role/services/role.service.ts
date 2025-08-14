import { Role } from '@app/domain';
import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { RestService } from '@app/core/hal/rest/rest.service';

/** Role manager service */
@Injectable()
export class RoleService extends RestService<Role> {

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(Role, "roles", injector);
  }

}
