import { HttpHandler, HttpRequest } from '@angular/common/http';

import { of } from 'rxjs';

import { environment } from '@environments/environment';

import { AuthInterceptor, isBackendApiUrl } from './auth.interceptor';

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

  it('recognizes absolute same-origin HAL self links with a relative backend base URL', () => {
    expect(isBackendApiUrl(
      'http://localhost:4300/backend/api/roles/4',
      '/backend',
      'http://localhost:4300',
    )).toBe(true);
  });

  describe('isBackendApiUrl', () => {
    it.each([
      ['/backend/api/users', '/backend', 'https://admin.example'],
      ['https://admin.example/backend/api/users', '/backend/', 'https://admin.example'],
      ['https://api.example:443/path/roles/4', 'https://api.example/path', 'https://admin.example'],
      ['https://api.example/path/roles/4', 'api.example/path', 'https://admin.example'],
      ['http://localhost:9000/backend/api/users', 'localhost:9000/backend', 'http://localhost:4300'],
    ])('recognizes backend URL %s for base %s', (url, apiBaseURL, applicationOrigin) => {
      expect(isBackendApiUrl(url, apiBaseURL, applicationOrigin)).toBe(true);
    });

    it.each([
      ['https://evil.example/backend/api/users', '/backend', 'https://admin.example'],
      ['https://admin.example/backend-other', '/backend', 'https://admin.example'],
      ['https://evil.example/path/users', 'https://api.example/path', 'https://admin.example'],
      ['https://api.example:8443/path/users', 'https://api.example/path', 'https://admin.example'],
      ['http://api.example/path/users', 'api.example/path', 'https://admin.example'],
      ['https://admin.example/backend', '', 'https://admin.example'],
      ['https://admin.example/backend', 'http://', 'https://admin.example'],
    ])('rejects non-backend URL %s for base %s', (url, apiBaseURL, applicationOrigin) => {
      expect(isBackendApiUrl(url, apiBaseURL, applicationOrigin)).toBe(false);
    });
  });
});
