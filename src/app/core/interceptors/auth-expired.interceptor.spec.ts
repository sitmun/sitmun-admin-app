import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { LoginService } from '@app/core/auth/login.service';

import { AuthExpiredInterceptor } from './auth-expired.interceptor';

describe('AuthExpiredInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let loginService: jest.Mocked<Pick<LoginService, 'logout' | 'clearSession'>>;
  let router: jest.Mocked<Pick<Router, 'navigate'>> & { url: string };

  beforeEach(() => {
    loginService = {
      logout: jest.fn(),
      clearSession: jest.fn(),
    };
    router = {
      navigate: jest.fn().mockResolvedValue(true),
      url: '/backgroundLayers/8/backgroundLayersForm',
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: LoginService, useValue: loginService },
        { provide: Router, useValue: router },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthExpiredInterceptor,
          multi: true,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should clear the local session and redirect once on a non-authenticate 401 without POSTing logout', (done) => {
    httpClient.get('/api/backgrounds/8?projection=view').subscribe({
      error: () => {
        expect(loginService.clearSession).toHaveBeenCalledTimes(1);
        expect(loginService.logout).not.toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        done();
      },
    });

    const req = httpMock.expectOne('/api/backgrounds/8?projection=view');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should not clear the session again for repeated 401 responses while redirecting', (done) => {
    let completed = 0;

    const assertDone = () => {
      completed += 1;
      if (completed === 2) {
        expect(loginService.clearSession).toHaveBeenCalledTimes(1);
        expect(loginService.logout).not.toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledTimes(1);
        done();
      }
    };

    httpClient.get('/api/backgrounds/8?projection=view').subscribe({
      error: () => assertDone(),
    });
    httpClient.get('/api/backgrounds/9?projection=view').subscribe({
      error: () => assertDone(),
    });

    httpMock.match('/api/backgrounds/8?projection=view').forEach((req) =>
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' })
    );
    httpMock.match('/api/backgrounds/9?projection=view').forEach((req) =>
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' })
    );
  });

  it('should ignore 401 responses from authenticate endpoints', (done) => {
    httpClient.post('/api/authenticate', {}).subscribe({
      error: (error) => {
        expect(error.status).toBe(401);
        expect(loginService.clearSession).not.toHaveBeenCalled();
        expect(loginService.logout).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      },
    });

    const req = httpMock.expectOne('/api/authenticate');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should reset the unauthorized handling flag after navigation timeout', (done) => {
    jest.useFakeTimers();
    router.navigate.mockReturnValue(new Promise(() => undefined));

    httpClient.get('/api/backgrounds/8?projection=view').subscribe({
      error: () => {
        expect(loginService.clearSession).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(3000);
        expect(loginService.clearSession).toHaveBeenCalledTimes(1);

        httpClient.get('/api/backgrounds/9?projection=view').subscribe({
          error: () => {
            expect(loginService.clearSession).toHaveBeenCalledTimes(2);
            jest.useRealTimers();
            done();
          },
        });

        const secondReq = httpMock.expectOne('/api/backgrounds/9?projection=view');
        secondReq.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      },
    });

    const req = httpMock.expectOne('/api/backgrounds/8?projection=view');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });
});
