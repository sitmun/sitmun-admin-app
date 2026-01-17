import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';

import { AccountService } from './account.service';
import { LoggerService } from '../../services/logger.service';
import { ExternalConfigurationService } from '../config/external-configuration.service';
import { ExternalService , ResourceService } from '../hal';


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
