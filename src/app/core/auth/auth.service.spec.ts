import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginService } from './login.service';
import { Principal } from './principal.service';
import { ResourceService } from '../hal/resource/resource.service';
import { ExternalService } from '../hal/config/external.service';
import { HalModule } from '../hal/hal.module';
import { ExternalConfigurationService } from '../config/external-configuration.service';

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
