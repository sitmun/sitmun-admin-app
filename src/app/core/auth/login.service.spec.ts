import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { Principal } from './principal.service';
import { AuthService } from './auth.service';
import { ResourceService } from '../hal/resource/resource.service';
import { ExternalService } from '../hal/config/external.service';
import { HalModule } from '../hal/hal.module';
import { AccountService } from '../account/account.service';
import { ExternalConfigurationService } from '../config/external-configuration.service';

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
