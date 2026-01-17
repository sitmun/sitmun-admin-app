import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { LoginService } from './login.service';
import { Principal } from './principal.service';
import { AccountService } from '../account/account.service';
import { ExternalConfigurationService } from '../config/external-configuration.service';
import { ExternalService , HalModule , ResourceService } from '../hal';

describe('LoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HalModule
      ],
      providers: [
        LoginService,
        Principal,
        AuthService,
        ResourceService,
        ExternalService,
        AccountService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    });
  });

  it('should be created', inject([LoginService], (service: LoginService) => {
    expect(service).toBeTruthy();
  }));
});
