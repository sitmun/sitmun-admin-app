import {TestBed} from '@angular/core/testing';
import {Router, UrlTree} from '@angular/router';

import {Principal} from '@app/core/auth/principal.service';
import {NotificationService} from '@app/services/notification.service';

import {authGuard} from './auth.guard';

describe('authGuard', () => {
  let principal: {identity: jest.Mock; isAuthenticated: jest.Mock};
  let notificationService: {showWarning: jest.Mock};
  let router: {createUrlTree: jest.Mock};

  beforeEach(() => {
    principal = {
      identity: jest.fn(),
      isAuthenticated: jest.fn().mockReturnValue(false),
    };
    notificationService = {showWarning: jest.fn()};
    router = {createUrlTree: jest.fn().mockReturnValue({redirect: '/login'} as unknown as UrlTree)};

    TestBed.configureTestingModule({
      providers: [
        {provide: Principal, useValue: principal},
        {provide: NotificationService, useValue: notificationService},
        {provide: Router, useValue: router},
      ],
    });
  });

  it('allows a valid administrator without warning', async () => {
    principal.identity.mockResolvedValue({username: 'admin', administrator: true});

    await expect(TestBed.runInInjectionContext(() => authGuard({} as never, {} as never))).resolves.toBe(true);
    expect(notificationService.showWarning).not.toHaveBeenCalled();
  });

  it('redirects a valid non-admin with a translated rights warning', async () => {
    principal.identity.mockResolvedValue({username: 'user', administrator: false});

    const result = await TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(result).toEqual({redirect: '/login'});
    expect(notificationService.showWarning).toHaveBeenCalledWith(
      'auth.accessDenied.title',
      'auth.accessDenied.adminRequired'
    );
  });

  it('redirects an anonymous user without showing the rights warning', async () => {
    principal.identity.mockResolvedValue(null);

    await TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(notificationService.showWarning).not.toHaveBeenCalled();
  });

  it('preserves an authenticated session when forced account refresh fails transiently', async () => {
    principal.identity.mockResolvedValue(null);
    principal.isAuthenticated.mockReturnValue(true);

    await expect(TestBed.runInInjectionContext(() => authGuard({} as never, {} as never))).resolves.toBe(true);

    expect(principal.identity).toHaveBeenCalledWith(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
    expect(notificationService.showWarning).not.toHaveBeenCalled();
  });
});
