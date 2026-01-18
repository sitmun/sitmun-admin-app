import { HttpClientTestingModule } from '@angular/common/http/testing';
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
        HttpClientTestingModule,
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
});
