import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {firstValueFrom, Observable, Subject} from 'rxjs';

import { AccountService } from '@app/core/account/account.service';

/** Principal service*/
@Injectable()
export class Principal {
  private userIdentity: any;
  private authenticated = false;
  private authenticationState = new Subject<any>();

  /** constructor */
  constructor(
    private account: AccountService
  ) {}

  /** authenticate with given identity*/
  authenticate(identity) {
    this.userIdentity = identity;
    this.authenticated = identity !== null;
    this.authenticationState.next(this.userIdentity);
  }

  /** check user identity*/
  identity(force?: boolean): Promise<any> {
    const cachedIdentity = this.userIdentity;
    if (force === true) {
      this.userIdentity = undefined;
    }

    // check and see if we have retrieved the userIdentity data from the server.
    // if we have, reuse it by immediately resolving
    if (this.userIdentity) {
      return Promise.resolve(this.userIdentity);
    }

    // retrieve the userIdentity data from the server, update the identity object, and then resolve.
    return firstValueFrom(this.account.get()).then((response) => {
      const account = response;
      if (account) {
        this.userIdentity = account;
        this.authenticated = true;
      } else {
        this.userIdentity = null;
        this.authenticated = false;
      }
      this.authenticationState.next(this.userIdentity);
      return this.userIdentity;
    }).catch((err) => {
      const isUnauthorized = err instanceof HttpErrorResponse && err.status === 401;
      if (isUnauthorized) {
        this.userIdentity = null;
        this.authenticated = false;
        this.authenticationState.next(this.userIdentity);
        return null;
      }
      this.userIdentity = cachedIdentity;
      return cachedIdentity ?? null;
    });
  }

  /** check whether current user is authenticated */
  isAuthenticated(): boolean {
    return this.authenticated;
  }

  /** check whether current user identity is resolved */
  isIdentityResolved(): boolean {
    return this.userIdentity !== undefined;
  }

  /** get current user authentication state */
  getAuthenticationState(): Observable<any> {
    return this.authenticationState.asObservable();
  }


}
