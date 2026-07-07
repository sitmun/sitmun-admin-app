import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AccountService } from './account.service';
import { LoggerService } from '../../services/logger.service';
import { configureLoggerForTests } from '../../testing/test-helpers';
import { ExternalConfigurationService } from '../config/external-configuration.service';
import { ExternalService , ResourceService } from '../hal';

describe('AccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AccountService,
        ResourceService,
        ExternalService,
        LoggerService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    });
    
    // Suppress debug logs in tests to reduce console noise
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
  });

  it('should be created', inject([AccountService], (service: AccountService) => {
    expect(service).toBeTruthy();
  }));

  it('should request the account with credentials so the auth cookie is sent cross-origin', inject(
    [AccountService, HttpTestingController],
    (service: AccountService, httpMock: HttpTestingController) => {
      service.get().subscribe();

      const req = httpMock.expectOne((request) => request.url.endsWith('/account'));
      expect(req.request.withCredentials).toBe(true);
      req.flush({});
      httpMock.verify();
    }
  ));
});
