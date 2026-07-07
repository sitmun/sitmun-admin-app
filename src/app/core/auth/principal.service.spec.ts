import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { throwError } from 'rxjs';

import { AccountService } from '@app/core/account/account.service';

import { Principal } from './principal.service';

describe('Principal', () => {
  let principal: Principal;
  let accountService: jest.Mocked<Pick<AccountService, 'get'>>;

  beforeEach(() => {
    accountService = {
      get: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        Principal,
        { provide: AccountService, useValue: accountService },
      ],
    });

    principal = TestBed.inject(Principal);
  });

  it('should clear authentication state only on 401 identity failures', async () => {
    principal.authenticate({ username: 'admin', administrator: true });
    accountService.get.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

    const identity = await principal.identity(true);

    expect(identity).toBeNull();
    expect(principal.isAuthenticated()).toBe(false);
  });

  it('should keep authentication state on non-401 identity failures', async () => {
    principal.authenticate({ username: 'admin', administrator: true });
    accountService.get.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    const identity = await principal.identity(true);

    expect(identity).toBeNull();
    expect(principal.isAuthenticated()).toBe(true);
  });
});
