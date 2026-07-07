import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { LoginService } from './login.service';
import { Principal } from './principal.service';
import { ExternalConfigurationService } from '../config/external-configuration.service';
import { ExternalService , HalModule , ResourceService } from '../hal';

describe('AuthService', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HalModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        LoginService,
        Principal,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  it('should POST logout with credentials and return the HTTP response', inject([AuthService], (service: AuthService) => {
    let completed = false;

    service.logout().subscribe({
      next: (response) => {
        expect(response.status).toBe(200);
        completed = true;
      },
    });

    const req = httpMock.expectOne((request) => request.url.endsWith('/authenticate/logout'));
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    req.flush(null, { status: 200, statusText: 'OK' });

    expect(completed).toBe(true);
  }));
});
