import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {LoginMethod} from "@app/components/login/login.component";

import {ResourceService} from '../hal';

/** Authentication service*/
@Injectable()
export class AuthService {

  /** API resource path */
  public AUTH_API = 'authenticate';

  public LOGOUT_API = `${this.AUTH_API}/logout`;

  public AUTH_METHODS_API = 'auth/enabled-methods';

  /** constructor*/
  constructor(
    private readonly http: HttpClient,
    private readonly resourceService: ResourceService,
  ) {
  }

  /** login operation */
  login(credentials): Observable<any> {
    const data = {
      username: credentials.username,
      password: credentials.password
    };

    return this.http.post(
      this.resourceService.getResourceUrl(this.AUTH_API),
      data,
      {observe: 'response', withCredentials: true}
    ).pipe(
      map(resp => resp.ok)
    );
  }

  /** Clears the session cookie on the backend. */
  logout(): Observable<HttpResponse<void>> {
    return this.http.post<void>(
      this.resourceService.getResourceUrl(this.LOGOUT_API),
      null,
      {observe: 'response', withCredentials: true}
    );
  }

  getEnabledAuthMethods(): Observable<LoginMethod[]> {
    return this.http.get<any>(this.resourceService.getResourceUrl(this.AUTH_METHODS_API), { withCredentials: true });
  }

}
