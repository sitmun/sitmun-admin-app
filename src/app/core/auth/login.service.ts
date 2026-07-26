import { Injectable } from '@angular/core';

import {firstValueFrom, Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {LoginMethod} from "@app/components/login/login.component";
import {environment} from "@environments/environment";

import {AuthService} from './auth.service';
import {Principal} from './principal.service';


/** Login service*/
@Injectable()
export class LoginService {

  public AUTH_OIDC_LOGIN_API = '/oauth2/authorization';

  /** constructor */
  constructor(
    private readonly authServerProvider: AuthService,
    private readonly principal: Principal
  ) {}

  /**Login operation*/
  async login(credentials, callback?) {

    const cb = callback || (() => {});

    try {
      const data = await firstValueFrom(this.authServerProvider.login(credentials));
      // Identity is resolved by the route guard on the subsequent navigation,
      // so we avoid a duplicate /api/account request right after login.
      cb();
      return data;
    } catch (err) {
      this.principal.authenticate(null);
      cb(err);
      throw err;
    }
  }

  /** Clears local state and requests backend cookie removal. */
  logout(): Observable<void> {
    this.principal.authenticate(null);

    return this.authServerProvider.logout().pipe(
      map(() => undefined),
      catchError(() => of(undefined))
    );
  }

  /**
   * Clear only the local authentication state without contacting the backend.
   *
   * Used when a request is rejected as unauthenticated (401): the shared
   * `access_token` cookie must not be deleted, since it may still be valid for
   * other tabs and destroying it turns a single stray 401 into a cross-tab
   * logout cascade. Explicit user logout still uses {@link logout}.
   */
  clearSession() {
    this.principal.authenticate(null);
  }

  getEnabledAuthMethods(): Observable<LoginMethod[]> {
    return this.authServerProvider.getEnabledAuthMethods();
  }

  initOidcLogin(providerId: string) {
    globalThis.location.href = `${environment.apiBaseURL}${this.AUTH_OIDC_LOGIN_API}/${providerId}?client_type=admin`
  }
}
