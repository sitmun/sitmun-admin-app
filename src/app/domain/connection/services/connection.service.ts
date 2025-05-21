import { Connection } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '@app/core/hal/rest/rest.service';

/** Connection manager service */
@Injectable()
export class ConnectionService extends RestService<Connection> {

  /** API resource path */
  public CONNECTION_API = 'connections';

  /** constructor */
  constructor(injector: Injector, private http: HttpClient) {
    super(Connection, "connections", injector);
  }

  /** test connection*/
  testConnection(item:any): Observable<any> {
    let result: Observable<Object>;
    result=this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API)+"/test" , item);
    return result;
  }
}
