import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

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
});
