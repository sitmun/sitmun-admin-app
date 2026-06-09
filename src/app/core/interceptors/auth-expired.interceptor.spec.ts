import {HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';

import {LoginService} from '@app/core/auth/login.service';

import {AuthExpiredInterceptor} from './auth-expired.interceptor';

describe('AuthExpiredInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let loginService: { logout: jest.Mock };
  let router: { url: string; navigate: jest.Mock };

  beforeEach(() => {
    loginService = {
      logout: jest.fn()
    };
    router = {
      url: '/user/2/userForm',
      navigate: jest.fn().mockResolvedValue(true)
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {provide: LoginService, useValue: loginService},
        {provide: Router, useValue: router},
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthExpiredInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('logs out and redirects on non-auth 401 responses', (done) => {
    httpClient.get('/api/account').subscribe({
      error: () => {
        expect(loginService.logout).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        done();
      }
    });

    const req = httpMock.expectOne('/api/account');
    req.flush('Unauthorized', {status: 401, statusText: 'Unauthorized'});
  });

  it('does not log out on 403 permission denials', (done) => {
    httpClient.get('/api/config/client/dashboard/applications').subscribe({
      error: () => {
        expect(loginService.logout).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      }
    });

    const req = httpMock.expectOne('/api/config/client/dashboard/applications');
    req.flush('Forbidden', {status: 403, statusText: 'Forbidden'});
  });
});
