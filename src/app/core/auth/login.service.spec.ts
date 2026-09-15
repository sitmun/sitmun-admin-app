import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AccountService } from '@app/core/account/account.service';

import { AuthService } from './auth.service';
import { LoginService } from './login.service';
import { Principal } from './principal.service';
import { ExternalConfigurationService } from '../config/external-configuration.service';
import { ExternalService, HalModule, ResourceService } from '../hal';

describe('LoginService', () => {
  let loginService: LoginService;
  let principal: Principal;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        LoginService,
        AuthService,
        Principal,
        AccountService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
      ],
    });

    loginService = TestBed.inject(LoginService);
    principal = TestBed.inject(Principal);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should clear local state and complete logout even when backend logout fails', (done) => {
    principal.authenticate({ username: 'admin', administrator: true });

    loginService.logout().subscribe({
      complete: () => {
        expect(principal.isAuthenticated()).toBe(false);
        done();
      },
    });

    const req = httpMock.expectOne((request) => request.url.endsWith('/authenticate/logout'));
    req.flush('Server error', { status: 500, statusText: 'Server Error' });
  });

  it('POSTs authenticate/refresh on session keep-alive', fakeAsync(() => {
    loginService.startSessionRefresh();
    tick(0);

    const req = httpMock.expectOne((request) => request.url.endsWith('/authenticate/refresh'));
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    req.flush(null, { status: 200, statusText: 'OK' });
    loginService.clearSession();
  }));
});
