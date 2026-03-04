import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { catchError } from 'rxjs';

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
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatSnackBarModule,
        TranslateModule.forRoot()
      ],
      providers: [
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
});
