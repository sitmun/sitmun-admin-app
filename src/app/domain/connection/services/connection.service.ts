import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import { RestService } from '@app/core/hal/rest/rest.service';

import { Connection } from '../models/connection.model';

/** Connection test payload for POST /connections/test */
export interface ConnectionTestPayload {
  driver: string;
  url: string;
  user?: string;
  password?: string;
}

/** Connection manager service */
@Injectable()
export class ConnectionService extends RestService<Connection> {

  /** API resource path */
  public CONNECTION_API = 'connections';

  /** constructor */
  constructor(injector: Injector, private http: HttpClient) {
    super(Connection, "connections", injector);
  }

  /** Tests a potential connection from form values. */
  testConnection(item: ConnectionTestPayload): Observable<unknown> {
    return this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API) + "/test", item);
  }

  /** Tests a stored connection by id using server-side credentials. */
  testStoredConnection(id: number): Observable<unknown> {
    return this.http.get(this.resourceService.getResourceUrl(this.CONNECTION_API) + `/${id}/test`);
  }
}
