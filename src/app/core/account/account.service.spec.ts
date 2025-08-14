import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AccountService } from './account.service';
import { ResourceService } from '../hal/resource/resource.service';
import { ExternalService } from '../hal/config/external.service';
import { LoggerService } from '../../services/logger.service';
import { ExternalConfigurationService } from '../config/external-configuration.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AccountService,
        ResourceService,
        ExternalService,
        LoggerService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  it('should be created', inject([AccountService], (service: AccountService) => {
    expect(service).toBeTruthy();
  }));
});
