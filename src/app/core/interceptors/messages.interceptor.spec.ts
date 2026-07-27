import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpContext,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { catchError } from 'rxjs';

import { ENTITY_NAME_KEY, ENTITY_TYPE_KEY } from '@app/core/hal/resource/resource.service';
import { ErrorTrackingService } from '@app/services/error-tracking.service';
import { NotificationService } from '@app/services/notification.service';
import { UtilsService } from '@app/services/utils.service';

import { MessagesInterceptor, MessagesInterceptorStateService } from './messages.interceptor';

describe('MessagesInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let interceptor: MessagesInterceptor;
  let stateService: MessagesInterceptorStateService;

  beforeEach(() => {
    const mockUtilsService = {
      enableLoading: jest.fn(),
      disableLoading: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatSnackBarModule,
        TranslateModule.forRoot()
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        MessagesInterceptor,
        MessagesInterceptorStateService,
        NotificationService,
        { provide: UtilsService, useValue: mockUtilsService },
        TranslateService,
        ErrorTrackingService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MessagesInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    interceptor = TestBed.inject(MessagesInterceptor);
    stateService = TestBed.inject(MessagesInterceptorStateService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('404 error handling', () => {
    beforeEach(() => {
      httpClient = TestBed.inject(HttpClient);
      httpMock = TestBed.inject(HttpTestingController);
      stateService = TestBed.inject(MessagesInterceptorStateService);
      stateService.enable();
    });

    it('should return EMPTY observable for 404 errors', (done) => {
      const url = '/api/test';
      
      let emitted = false;
      
      httpClient.get(url).subscribe({
        next: () => { emitted = true; },
        error: () => { fail('Should not emit error'); },
        complete: () => {
          expect(emitted).toBe(false);
          done();
        }
      });

      const req = httpMock.expectOne(url);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should complete immediately without emitting for 404 errors', (done) => {
      const url = '/api/test';
      
      httpClient.get(url).pipe(
        catchError(() => {
          fail('Should not catch error - EMPTY completes normally');
          return [];
        })
      ).subscribe({
        next: () => { fail('Should not emit'); },
        complete: () => { done(); }
      });

      const req = httpMock.expectOne(url);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should throw error for non-404 errors', (done) => {
      const url = '/api/test';
      
      httpClient.get(url).subscribe({
        next: () => { fail('Should not emit'); },
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        }
      });

      const req = httpMock.expectOne(url);
      req.flush('Server Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('401 error handling', () => {
    let notificationService: NotificationService;

    beforeEach(() => {
      stateService = TestBed.inject(MessagesInterceptorStateService);
      stateService.enable();
      notificationService = TestBed.inject(NotificationService);
    });

    it('should propagate 401 without showing an error notification', (done) => {
      const showErrorSpy = jest.spyOn(notificationService, 'showError');
      const url = '/api/backgrounds/8?projection=view';

      httpClient.get(url).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
          expect(showErrorSpy).not.toHaveBeenCalled();
          done();
        },
      });

      const req = httpMock.expectOne(url);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('403 error handling', () => {
    it('should preserve the response and show exactly one error notification', (done) => {
      const notificationService = TestBed.inject(NotificationService);
      const showErrorSpy = jest.spyOn(notificationService, 'showError');
      const url = '/api/backgrounds/8?projection=view';

      httpClient.get(url).subscribe({
        error: (error) => {
          expect(error.status).toBe(403);
          expect(showErrorSpy).toHaveBeenCalledTimes(1);
          done();
        },
      });

      const req = httpMock.expectOne(url);
      req.flush({message: 'backend.error.forbidden'}, {status: 403, statusText: 'Forbidden'});
    });
  });

  describe('validation error handling', () => {
    let notificationService: NotificationService;

    beforeEach(() => {
      stateService = TestBed.inject(MessagesInterceptorStateService);
      stateService.enable();
      notificationService = TestBed.inject(NotificationService);
    });

    it('should show field-level validation errors in notification message', (done) => {
      const showErrorSpy = jest.spyOn(notificationService, 'showError');
      const url = '/api/territories/6';
      const errorBody = {
        type: 'https://sitmun.org/problems/validation-error',
        status: 400,
        title: 'Validation Failed',
        detail: 'Request validation failed. Please check the errors field for details.',
        instance: '/api/territories/6',
        errors: [{ field: 'extent', message: 'maxY must be greater than minY' }]
      };

      httpClient.put(url, {}).subscribe({
        error: () => {
          expect(showErrorSpy).toHaveBeenCalled();
          const message = showErrorSpy.mock.calls[0][1];
          expect(message).toContain('maxY must be greater than minY');
          expect(message).toContain('extent');
          done();
        }
      });

      const req = httpMock.expectOne(url);
      req.flush(errorBody, { status: 400, statusText: 'Bad Request' });
    });

    it('should use translated messageCode when available', (done) => {
      const showErrorSpy = jest.spyOn(notificationService, 'showError');
      const translateService = TestBed.inject(TranslateService);
      translateService.setTranslation('en', {
        'validation.NotBlank': 'Must not be blank',
        'error.validation-error.detailWithErrors': 'Validation failed:'
      });
      translateService.use('en');

      const url = '/api/territories/6';
      const errorBody = {
        type: 'https://sitmun.org/problems/validation-error',
        status: 400,
        title: 'Validation Failed',
        detail: 'Request validation failed.',
        instance: '/api/territories/6',
        errors: [{ field: 'name', message: 'must not be blank', messageCode: 'NotBlank' }]
      };

      httpClient.put(url, {}).subscribe({
        error: () => {
          expect(showErrorSpy).toHaveBeenCalled();
          const message = showErrorSpy.mock.calls[0][1];
          expect(message).toContain('Must not be blank');
          expect(message).toContain('Validation failed:');
          done();
        }
      });

      const req = httpMock.expectOne(url);
      req.flush(errorBody, { status: 400, statusText: 'Bad Request' });
    });

    it('should fall back to generic message when no errors array', (done) => {
      const showErrorSpy = jest.spyOn(notificationService, 'showError');
      const url = '/api/territories/6';
      const errorBody = {
        type: 'https://sitmun.org/problems/validation-error',
        status: 400,
        title: 'Validation Failed',
        detail: 'Request validation failed.',
        instance: '/api/territories/6'
      };

      httpClient.put(url, {}).subscribe({
        error: () => {
          expect(showErrorSpy).toHaveBeenCalled();
          const message = showErrorSpy.mock.calls[0][1];
          expect(message).not.toContain('\u2022');
          done();
        }
      });

      const req = httpMock.expectOne(url);
      req.flush(errorBody, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('data-integrity-violation handling', () => {
    let notificationService: NotificationService;
    let translateService: TranslateService;

    beforeEach(() => {
      stateService = TestBed.inject(MessagesInterceptorStateService);
      stateService.enable();
      notificationService = TestBed.inject(NotificationService);
      translateService = TestBed.inject(TranslateService);
      translateService.setTranslation('en', {
        'operation.delete': 'delete',
        'entity.cartography.plural': 'Layers',
        'entity.tree-node.plural': 'Tree nodes',
        'backend.error.data-integrity-violation.constraint.full':
          'Cannot {{operation}} {{entityType}} "{{entityName}}" because it is being used by {{referencingEntityName}}',
        'backend.error.data-integrity-violation.conflict':
          'A resource with this value already exists',
      });
      translateService.use('en');
    });

    it('should toast 422 constraint.full when referencing entity is present', (done) => {
      const showErrorSpy = jest.spyOn(notificationService, 'showError');
      const url = '/api/cartographies/14';
      const context = new HttpContext()
        .set(ENTITY_TYPE_KEY, 'entity.cartography.plural')
        .set(ENTITY_NAME_KEY, 'e2e-layer');
      const errorBody = {
        type: 'https://sitmun.org/problems/data-integrity-violation',
        status: 422,
        title: 'Unprocessable Entity',
        detail: 'Cartography is in use by tree nodes and cannot be deleted',
        instance: '/api/cartographies/14',
        properties: {
          referencingEntityTranslationKey: 'entity.tree-node.plural',
        },
      };

      httpClient.delete(url, { context }).subscribe({
        error: () => {
          expect(showErrorSpy).toHaveBeenCalled();
          const message = showErrorSpy.mock.calls[0][1] as string;
          expect(message).toContain('Cannot delete Layers "e2e-layer"');
          expect(message).toContain('Tree nodes');
          done();
        },
      });

      const req = httpMock.expectOne(url);
      req.flush(errorBody, { status: 422, statusText: 'Unprocessable Entity' });
    });

    it('should toast 409 conflict for data-integrity-violation duplicates', (done) => {
      const showErrorSpy = jest.spyOn(notificationService, 'showError');
      const url = '/api/cartographies';
      const errorBody = {
        type: 'https://sitmun.org/problems/data-integrity-violation',
        status: 409,
        title: 'Conflict',
        detail: 'Duplicate key',
        instance: '/api/cartographies',
        properties: {},
      };

      httpClient.post(url, {}).subscribe({
        error: () => {
          expect(showErrorSpy).toHaveBeenCalled();
          const message = showErrorSpy.mock.calls[0][1] as string;
          expect(message).toBe('A resource with this value already exists');
          done();
        },
      });

      const req = httpMock.expectOne(url);
      req.flush(errorBody, { status: 409, statusText: 'Conflict' });
    });
  });
});
