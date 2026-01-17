import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { LoginService } from './login.service';
import { Principal } from './principal.service';
import { ExternalConfigurationService } from '../config/external-configuration.service';
import { ExternalService , HalModule , ResourceService } from '../hal';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HalModule
      ],
      providers: [
        AuthService,
        LoginService,
        Principal,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
