import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import {AuthService} from './auth.service';
import {Principal} from './principal.service';

/** Login service*/
@Injectable()
export class LoginService {

  /** constructor */
  constructor(
    private authServerProvider: AuthService,
    private principal: Principal
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
    });
  }
}
