import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ResourceService } from '../hal';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let resourceService: { getResourceUrl: jest.Mock };

  beforeEach(() => {
    resourceService = {
      getResourceUrl: jest.fn((r: string) => 'http://localhost/' + r)
    };
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ResourceService, useValue: resourceService }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getToken and storeAuthenticationToken', () => {
    it('getToken returns null when no token stored', () => {
      expect(service.getToken()).toBeNull();
    });

    it('storeAuthenticationToken writes token; getToken returns it', () => {
      service.storeAuthenticationToken('jwt');
      expect(service.getToken()).toBe('jwt');
    });
  });

  describe('isLoggedIn and isLoggedOut', () => {
    it('isLoggedIn is falsy when no token', () => {
      expect(service.isLoggedIn()).toBeFalsy();
    });

    it('isLoggedIn is truthy after store', () => {
      service.storeAuthenticationToken('jwt');
      expect(service.isLoggedIn()).toBeTruthy();
    });

    it('isLoggedOut is truthy when no token', () => {
      expect(service.isLoggedOut()).toBeTruthy();
    });

    it('isLoggedOut is falsy after store', () => {
      service.storeAuthenticationToken('jwt');
      expect(service.isLoggedOut()).toBeFalsy();
    });
  });

  describe('login', () => {
    it('POSTs to authenticate with username and password, stores token on success', () => {
      const credentials = { username: 'u', password: 'p' };
      service.login(credentials).subscribe((jwt) => {
        expect(jwt).toBe('jwt123');
        expect(service.getToken()).toBe('jwt123');
      });
      const req = httpMock.expectOne('http://localhost/authenticate');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'u', password: 'p' });
      req.flush(
        { id_token: 'jwt123' },
        { status: 200, statusText: 'OK', headers: {} }
      );
    });

    it('does not store token when response is not ok', () => {
      const credentials = { username: 'u', password: 'p' };
      service.login(credentials).subscribe((jwt) => {
        expect(jwt).toBeUndefined();
        expect(service.getToken()).toBeNull();
      });
      const req = httpMock.expectOne('http://localhost/authenticate');
      req.flush(
        { id_token: 'jwt123' },
        { status: 401, statusText: 'Unauthorized', headers: {} }
      );
    });
  });

  describe('loginWithToken', () => {
    it('resolves with jwt and stores token when jwt is truthy', async () => {
      const result = await service.loginWithToken('jwt123');
      expect(result).toBe('jwt123');
      expect(service.getToken()).toBe('jwt123');
    });

    it('rejects when jwt is falsy', async () => {
      await expect(service.loginWithToken('')).rejects.toBe(
        'auth-jwt-service Promise reject'
      );
    });
  });

  describe('logout', () => {
    it('removes token from sessionStorage and completes', () => {
      service.storeAuthenticationToken('jwt');
      let completed = false;
      service.logout().subscribe({
        complete: () => {
          completed = true;
        }
      });
      expect(completed).toBe(true);
      expect(service.getToken()).toBeNull();
    });
  });

  describe('getEnabledAuthMethods', () => {
    it('GETs enabled-methods and returns data', () => {
      const mockMethods = [{ id: 'oidc', providers: [] }];
      service.getEnabledAuthMethods().subscribe((data) => {
        expect(data).toEqual(mockMethods);
      });
      const req = httpMock.expectOne('http://localhost/auth/enabled-methods');
      expect(req.request.method).toBe('GET');
      req.flush(mockMethods);
    });
  });
});
