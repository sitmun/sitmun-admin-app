import {HttpContext, HttpErrorResponse, HttpHandler, HttpRequest} from '@angular/common/http';

import {Subject, firstValueFrom, of, throwError} from 'rxjs';

import {AccountService} from '@app/core/account/account.service';
import {LoginService} from '@app/core/auth/login.service';
import {NotificationService} from '@app/services/notification.service';
import {environment} from '@environments/environment';

import {
  AuthExpiredInterceptor,
  isProtectedBackendRequest,
  SUPPRESS_SESSION_VALIDATION
} from './auth-expired.interceptor';

describe('AuthExpiredInterceptor', () => {
  const backendBaseUrl = environment.apiBaseURL;
  let account: { get: jest.Mock };
  let loginService: { clearSession: jest.Mock; logout: jest.Mock };
  let notificationService: { showWarning: jest.Mock };
  let router: { url: string; navigate: jest.Mock };
  let interceptor: AuthExpiredInterceptor;

  beforeEach(() => {
    account = {get: jest.fn()};
    loginService = {clearSession: jest.fn(), logout: jest.fn()};
    notificationService = {showWarning: jest.fn()};
    router = {url: '/users', navigate: jest.fn().mockResolvedValue(true)};
    interceptor = new AuthExpiredInterceptor(
      account as unknown as AccountService,
      loginService as unknown as LoginService,
      notificationService as unknown as NotificationService,
      router as never
    );
  });

  it('classifies only exact configured backend API URLs and excludes session endpoints', () => {
    const configuredBaseUrl = 'https://admin.example.test/backend';
    expect(isProtectedBackendRequest(
      'https://admin.example.test/backend/api/users',
      configuredBaseUrl,
      'https://admin.example.test'
    )).toBe(true);
    expect(isProtectedBackendRequest(
      'https://admin.example.test/backend/api/accounting',
      configuredBaseUrl,
      'https://admin.example.test'
    )).toBe(true);

    for (const url of [
      'https://admin.example.test/backend/api/account',
      'https://admin.example.test/backend/api/authenticate',
      'https://admin.example.test/backend/api/authenticate/logout',
      'https://admin.example.test/backend/api/auth/enabled-methods',
      'https://admin.example.test/backend/api/login',
      'https://admin.example.test/backend-lookalike/api/users',
      'https://admin.example.test/backend/apiary/users',
      'https://admin.example.test.evil/backend/api/users',
    ]) {
      expect(isProtectedBackendRequest(url, configuredBaseUrl, 'https://admin.example.test')).toBe(false);
    }
  });

  it('keeps the first protected 401 non-destructive when the account probe succeeds', async () => {
    account.get.mockReturnValue(of({username: 'admin', administrator: true}));
    const error = new HttpErrorResponse({status: 401});
    const next = {handle: () => throwError(() => error)} as HttpHandler;

    await expect(firstValueFrom(interceptor.intercept(
      new HttpRequest('GET', `${backendBaseUrl}/api/users`),
      next
    ))).rejects.toBe(error);

    expect(account.get).toHaveBeenCalledTimes(1);
    expect(loginService.clearSession).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('preserves the session for a protected resource 403 without probing the account', async () => {
    const error = new HttpErrorResponse({status: 403});
    const next = {handle: () => throwError(() => error)} as HttpHandler;

    await expect(firstValueFrom(interceptor.intercept(
      new HttpRequest('GET', `${backendBaseUrl}/api/users/1`),
      next
    ))).rejects.toBe(error);

    expect(account.get).not.toHaveBeenCalled();
    expect(loginService.clearSession).not.toHaveBeenCalled();
    expect(loginService.logout).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('marks the account probe to suppress recursive session validation', async () => {
    account.get.mockReturnValue(of({username: 'admin', administrator: true}));
    const error = new HttpErrorResponse({status: 401});
    const next = {handle: () => throwError(() => error)} as HttpHandler;

    await expect(firstValueFrom(interceptor.intercept(
      new HttpRequest('GET', `${backendBaseUrl}/api/users`),
      next
    ))).rejects.toBe(error);

    const context = account.get.mock.calls[0][0] as HttpContext;
    expect(context.get(SUPPRESS_SESSION_VALIDATION)).toBe(true);
  });

  it('shares one account probe across concurrent protected 401 responses', () => {
    const probe = new Subject<unknown>();
    account.get.mockReturnValue(probe);
    const error = new HttpErrorResponse({status: 401});
    const next = {handle: () => throwError(() => error)} as HttpHandler;

    interceptor.intercept(new HttpRequest('GET', `${backendBaseUrl}/api/users`), next).subscribe({error: () => undefined});
    interceptor.intercept(new HttpRequest('GET', `${backendBaseUrl}/api/roles`), next).subscribe({error: () => undefined});

    expect(account.get).toHaveBeenCalledTimes(1);
    probe.next({username: 'admin'});
    probe.complete();
  });

  it('clears only local state and redirects when the account probe returns 401', () => {
    account.get.mockReturnValue(throwError(() => new HttpErrorResponse({status: 401})));
    const next = {
      handle: () => throwError(() => new HttpErrorResponse({status: 401}))
    } as HttpHandler;

    interceptor.intercept(new HttpRequest('GET', `${backendBaseUrl}/api/users`), next).subscribe({error: () => undefined});

    expect(loginService.clearSession).toHaveBeenCalledTimes(1);
    expect(loginService.logout).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it.each([0, 403, 500])('preserves the session and shows one bounded warning when the probe returns %s', (status) => {
    account.get.mockReturnValue(throwError(() => new HttpErrorResponse({status})));
    const next = {
      handle: () => throwError(() => new HttpErrorResponse({status: 401}))
    } as HttpHandler;

    interceptor.intercept(new HttpRequest('GET', `${backendBaseUrl}/api/users`), next).subscribe({error: () => undefined});

    expect(loginService.clearSession).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(notificationService.showWarning).toHaveBeenCalledTimes(1);
  });

  it('shows one warning when a shared probe fails transiently', () => {
    const probe = new Subject<unknown>();
    account.get.mockReturnValue(probe);
    const error = new HttpErrorResponse({status: 401});
    const next = {handle: () => throwError(() => error)} as HttpHandler;

    interceptor.intercept(new HttpRequest('GET', `${backendBaseUrl}/api/users`), next).subscribe({error: () => undefined});
    interceptor.intercept(new HttpRequest('GET', `${backendBaseUrl}/api/roles`), next).subscribe({error: () => undefined});
    probe.error(new HttpErrorResponse({status: 500}));

    expect(notificationService.showWarning).toHaveBeenCalledTimes(1);
    expect(loginService.clearSession).not.toHaveBeenCalled();
  });

  it('deduplicates warnings across sequential transiently failed probes', () => {
    account.get.mockReturnValue(throwError(() => new HttpErrorResponse({status: 500})));
    const error = new HttpErrorResponse({status: 401});
    const next = {handle: () => throwError(() => error)} as HttpHandler;

    interceptor.intercept(new HttpRequest('GET', `${backendBaseUrl}/api/users`), next).subscribe({error: () => undefined});
    interceptor.intercept(new HttpRequest('GET', `${backendBaseUrl}/api/roles`), next).subscribe({error: () => undefined});

    expect(account.get).toHaveBeenCalledTimes(2);
    expect(notificationService.showWarning).toHaveBeenCalledTimes(1);
    expect(loginService.clearSession).not.toHaveBeenCalled();
  });

  it('shows a new warning after a successful probe resets transient warning deduplication', () => {
    account.get
      .mockReturnValueOnce(throwError(() => new HttpErrorResponse({status: 500})))
      .mockReturnValueOnce(of({username: 'admin', administrator: true}))
      .mockReturnValueOnce(throwError(() => new HttpErrorResponse({status: 500})));
    const error = new HttpErrorResponse({status: 401});
    const next = {handle: () => throwError(() => error)} as HttpHandler;

    interceptor.intercept(new HttpRequest('GET', `${backendBaseUrl}/api/users`), next).subscribe({error: () => undefined});
    interceptor.intercept(new HttpRequest('GET', `${backendBaseUrl}/api/roles`), next).subscribe({error: () => undefined});
    interceptor.intercept(new HttpRequest('GET', `${backendBaseUrl}/api/configuration`), next)
      .subscribe({error: () => undefined});

    expect(notificationService.showWarning).toHaveBeenCalledTimes(2);
  });

  it('does not probe for 401 responses from excluded or lookalike URLs', async () => {
    const error = new HttpErrorResponse({status: 401});
    const next = {handle: () => throwError(() => error)} as HttpHandler;

    await expect(firstValueFrom(interceptor.intercept(
      new HttpRequest('GET', `${backendBaseUrl}/api/account`),
      next
    ))).rejects.toBe(error);

    expect(account.get).not.toHaveBeenCalled();
  });

  it('does not probe when session validation is suppressed by request context', async () => {
    const error = new HttpErrorResponse({status: 401});
    const next = {handle: () => throwError(() => error)} as HttpHandler;
    const request = new HttpRequest(
      'GET',
      `${backendBaseUrl}/api/users`,
      {context: new HttpContext().set(SUPPRESS_SESSION_VALIDATION, true)}
    );

    await expect(firstValueFrom(interceptor.intercept(request, next))).rejects.toBe(error);
    expect(account.get).not.toHaveBeenCalled();
  });

  it.each(['/login', '/login?expired=true', '/login/help'])(
    'does not probe protected 401 responses while on login route %s',
    async (route) => {
      router.url = route;
      const error = new HttpErrorResponse({status: 401});
      const next = {handle: () => throwError(() => error)} as HttpHandler;

      await expect(firstValueFrom(interceptor.intercept(
        new HttpRequest('GET', `${backendBaseUrl}/api/users`),
        next
      ))).rejects.toBe(error);

      expect(account.get).not.toHaveBeenCalled();
      expect(loginService.clearSession).not.toHaveBeenCalled();
      expect(loginService.logout).not.toHaveBeenCalled();
    }
  );
});
