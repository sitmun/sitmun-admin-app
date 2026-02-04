import { Injectable } from '@angular/core';

import {CookieService} from "ngx-cookie-service";
import {firstValueFrom, Observable} from 'rxjs';

import {LoginMethod} from "@app/components/login/login.component";
import {environment} from "@environments/environment.prod";

import {AuthService} from './auth.service';
import {Principal} from './principal.service';


/** Login service*/
@Injectable()
export class LoginService {

  public AUTH_OIDC_LOGIN_API = '/oauth2/authorization';

  /** constructor */
  constructor(
    private readonly authServerProvider: AuthService,
    private readonly cookieService: CookieService,
    private readonly principal: Principal
  ) {}

  /**Login operation*/
  async login(credentials, callback?) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const cb = callback || (() => {});

    try {
      const data = await firstValueFrom(this.authServerProvider.login(credentials));
      const _account = await this.principal.identity(true);
      // After the login the language will be changed to
      // the language selected by the user during his registration
      cb();
      return data;
    } catch (err) {
      this.logout();
      cb(err);
      throw err;
    }
  }
  /**login with jwt token */
  loginWithToken(jwt) {
    return this.authServerProvider.loginWithToken(jwt);
  }

  /** logout operation */
  logout() {
    // First clear the authentication state
    this.principal.authenticate(null);

    // Then call the auth service to clear tokens
    this.authServerProvider.logout().subscribe(() => {
      // Additional cleanup if needed
      this.cookieService.delete('oidc_token');
    });
  }

  getEnabledAuthMethods(): Observable<LoginMethod[]> {
    return this.authServerProvider.getEnabledAuthMethods();
  }

  initOidcLogin(providerId: string) {
    globalThis.location.href = `${environment.apiBaseURL}${this.AUTH_OIDC_LOGIN_API}/${providerId}?client_type=admin`
  }
}
