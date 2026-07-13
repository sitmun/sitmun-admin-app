import { HttpHandler, HttpRequest } from '@angular/common/http';

import { of } from 'rxjs';

import { environment } from '@environments/environment';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let next: { handle: jest.Mock };

  beforeEach(() => {
    interceptor = new AuthInterceptor();
    next = { handle: jest.fn().mockReturnValue(of(null)) };
  });

  it('adds withCredentials and X-SITMUN-Client: admin to backend requests', () => {
    const req = new HttpRequest('GET', `${environment.apiBaseURL}/api/users`);
    interceptor.intercept(req, next as unknown as HttpHandler).subscribe();

    const forwarded: HttpRequest<unknown> = next.handle.mock.calls[0][0];
    expect(forwarded.withCredentials).toBe(true);
    expect(forwarded.headers.get('X-SITMUN-Client')).toBe('admin');
  });

  it('adds withCredentials but no X-SITMUN-Client to non-backend requests', () => {
    const req = new HttpRequest('GET', 'https://tiles.example.com/layer');
    interceptor.intercept(req, next as unknown as HttpHandler).subscribe();

    const forwarded: HttpRequest<unknown> = next.handle.mock.calls[0][0];
    expect(forwarded.withCredentials).toBe(true);
    expect(forwarded.headers.get('X-SITMUN-Client')).toBeNull();
  });

  it('includes X-SITMUN-Client on the admin login request', () => {
    const req = new HttpRequest('POST', `${environment.apiBaseURL}/api/authenticate/admin`, {});
    interceptor.intercept(req, next as unknown as HttpHandler).subscribe();

    const forwarded: HttpRequest<unknown> = next.handle.mock.calls[0][0];
    expect(forwarded.headers.get('X-SITMUN-Client')).toBe('admin');
  });

  it('includes X-SITMUN-Client on the logout request so the backend clears admin_access_token', () => {
    const req = new HttpRequest('POST', `${environment.apiBaseURL}/api/authenticate/logout`, {});
    interceptor.intercept(req, next as unknown as HttpHandler).subscribe();

    const forwarded: HttpRequest<unknown> = next.handle.mock.calls[0][0];
    expect(forwarded.headers.get('X-SITMUN-Client')).toBe('admin');
  });
});
