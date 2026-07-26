import {HttpErrorResponse} from '@angular/common/http';

import {of, throwError} from 'rxjs';

import {AccountService} from '@app/core/account/account.service';

import {Principal} from './principal.service';

describe('Principal', () => {
  let account: {get: jest.Mock};
  let principal: Principal;

  beforeEach(() => {
    account = {get: jest.fn()};
    principal = new Principal(account as unknown as AccountService);
  });

  it('replaces the cached identity after a successful forced validation', async () => {
    principal.authenticate({username: 'old', administrator: true});
    account.get.mockReturnValue(of({username: 'admin', administrator: true}));

    await expect(principal.identity(true)).resolves.toEqual({username: 'admin', administrator: true});
    expect(principal.isAuthenticated()).toBe(true);
  });

  it('clears the cached identity only when forced validation returns 401', async () => {
    principal.authenticate({username: 'admin', administrator: true});
    account.get.mockReturnValue(throwError(() => new HttpErrorResponse({status: 401})));

    await expect(principal.identity(true)).resolves.toBeNull();
    expect(principal.isAuthenticated()).toBe(false);
  });

  it.each([0, 403, 500])('preserves the cached identity when forced validation returns %s', async (status) => {
    const identity = {username: 'admin', administrator: true};
    principal.authenticate(identity);
    account.get.mockReturnValue(throwError(() => new HttpErrorResponse({status})));

    await expect(principal.identity(true)).resolves.toBe(identity);
    expect(principal.isAuthenticated()).toBe(true);
  });
});
