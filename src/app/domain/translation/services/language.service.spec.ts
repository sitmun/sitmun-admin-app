import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ResourceService } from '@app/core/hal/resource/resource.service';

import { LanguageService, DefaultLanguageChangePreview, DefaultLanguageChangeResult } from './language.service';


describe('LanguageService', () => {
  let service: LanguageService;
  let httpMock: HttpTestingController;
  let mockResourceService: jest.Mocked<ResourceService>;

  beforeEach(() => {
    mockResourceService = {
      getResourceUrl: jest.fn()
    } as any;
    mockResourceService.getResourceUrl.mockReturnValue('http://localhost:8080/api');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LanguageService,
        { provide: ResourceService, useValue: mockResourceService }
      ]
    });

    service = TestBed.inject(LanguageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCurrentDefaultLanguage', () => {
    it('should return the current default language', (done) => {
      const mockResponse = { value: 'en' };

      service.getCurrentDefaultLanguage().subscribe({
        next: (defaultLang) => {
          expect(defaultLang).toBe('en');
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/configuration-parameters/search/findByName?name=language.default');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle errors when fetching default language', (done) => {
      service.getCurrentDefaultLanguage().subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/configuration-parameters/search/findByName?name=language.default');
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('previewDefaultLanguageChange', () => {
    it('should preview language change with no missing translations', (done) => {
      const mockPreview: DefaultLanguageChangePreview = {
        currentDefault: 'en',
        requestedDefault: 'ca',
        affectedValues: 100,
        backupUpserts: 100,
        restoredValues: 100,
        missingTranslations: 0,
        missing: []
      };

      service.previewDefaultLanguageChange('en', 'ca').subscribe({
        next: (preview) => {
          expect(preview.currentDefault).toBe('en');
          expect(preview.requestedDefault).toBe('ca');
          expect(preview.missingTranslations).toBe(0);
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/language-default/change-preview');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ from: 'en', to: 'ca' });
      req.flush(mockPreview);
    });

    it('should preview language change with missing translations', (done) => {
      const mockPreview: DefaultLanguageChangePreview = {
        currentDefault: 'en',
        requestedDefault: 'ca',
        affectedValues: 100,
        backupUpserts: 100,
        restoredValues: 80,
        missingTranslations: 20,
        missing: [
          { entity: 'Application', element: 1, column: 'Application.name', currentValue: 'Test App' }
        ]
      };

      service.previewDefaultLanguageChange('en', 'ca').subscribe({
        next: (preview) => {
          expect(preview.missingTranslations).toBe(20);
          expect(preview.missing.length).toBe(1);
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/language-default/change-preview');
      req.flush(mockPreview);
    });
  });

  describe('applyDefaultLanguageChange', () => {
    it('should apply language change without missing translations', (done) => {
      const mockResult: DefaultLanguageChangeResult = {
        previousDefault: 'en',
        currentDefault: 'ca',
        backupUpserts: 100,
        restoredValues: 100,
        preservedValues: 0,
        preservedMissing: []
      };

      const request = {
        from: 'en',
        to: 'ca',
        continueOnMissingTranslations: false
      };

      service.applyDefaultLanguageChange(request).subscribe({
        next: (result) => {
          expect(result.currentDefault).toBe('ca');
          expect(result.preservedValues).toBe(0);
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/language-default/change');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResult);
    });

    it('should apply language change with preserved values', (done) => {
      const mockResult: DefaultLanguageChangeResult = {
        previousDefault: 'en',
        currentDefault: 'ca',
        backupUpserts: 100,
        restoredValues: 80,
        preservedValues: 20,
        preservedMissing: [
          { entity: 'Application', element: 1, column: 'Application.name', currentValue: 'Test App' }
        ]
      };

      const request = {
        from: 'en',
        to: 'ca',
        continueOnMissingTranslations: true
      };

      service.applyDefaultLanguageChange(request).subscribe({
        next: (result) => {
          expect(result.currentDefault).toBe('ca');
          expect(result.preservedValues).toBe(20);
          expect(result.preservedMissing.length).toBe(1);
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/language-default/change');
      req.flush(mockResult);
    });

    it('should handle errors when applying change', (done) => {
      const request = {
        from: 'en',
        to: 'invalid',
        continueOnMissingTranslations: false
      };

      service.applyDefaultLanguageChange(request).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/language-default/change');
      req.error(new ErrorEvent('Invalid language'));
    });
  });

  describe('dead language admin APIs (must stay absent)', () => {
    it('does not expose reorder or setDefault helpers', () => {
      expect(service).not.toHaveProperty('reorder');
      expect(service).not.toHaveProperty('setDefault');
      expect(typeof (service as any).reorder).toBe('undefined');
      expect(typeof (service as any).setDefault).toBe('undefined');
    });
  });
});
