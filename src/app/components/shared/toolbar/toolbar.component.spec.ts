import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AccountService } from '@app/core/account/account.service';
import { AuthService } from '@app/core/auth/auth.service';
import { LoginService } from '@app/core/auth/login.service';
import { Principal } from '@app/core/auth/principal.service';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal/services';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';

import { ToolbarComponent } from './toolbar.component';


describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let loginService: LoginService;
  let authService: AuthService;
  let accountService: AccountService;
  let principal: Principal;
  let resourceService: ResourceService;
  let externalService: ExternalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarComponent ],
      imports: [
        MaterialModule,
        HttpClientTestingModule,
        HttpClientModule,
        RouterTestingModule,
        SitmunFrontendGuiModule,
        MatIconTestingModule,
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
        LoginService,
        AuthService,
        Principal,
        AccountService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    loginService= TestBed.inject(LoginService);
    authService= TestBed.inject(AuthService);
    accountService= TestBed.inject(AccountService);
    principal= TestBed.inject(Principal);
    resourceService= TestBed.inject(ResourceService);
    externalService= TestBed.inject(ExternalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should instantiate loginService', () => {
    expect(loginService).toBeTruthy();
  });

  it('should instantiate authService', () => {
    expect(authService).toBeTruthy();
  });

  it('should instantiate accountService', () => {
    expect(accountService).toBeTruthy();
  });

  it('should instantiate principal', () => {
    expect(principal).toBeTruthy();
  });

  it('should instantiate resourceService', () => {
    expect(resourceService).toBeTruthy();
  });

  it('should instantiate externalService', () => {
    expect(externalService).toBeTruthy();
  });
});
