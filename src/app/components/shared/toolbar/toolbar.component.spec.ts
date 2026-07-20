import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideRouter } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';

import { SystemInfoMenuComponent } from '@app/components/shared/system-info-menu/system-info-menu.component';
import { AccountService } from '@app/core/account/account.service';
import { AuthService } from '@app/core/auth/auth.service';
import { LoginService } from '@app/core/auth/login.service';
import { Principal } from '@app/core/auth/principal.service';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal/services';
import { LanguageService, User } from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { config } from '@config';

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

  const mockUser = { id: 1, username: 't', firstName: 'T', lastName: 'U' } as User;
  let authStateSubject: BehaviorSubject<unknown>;

  beforeAll(async () => {
    authStateSubject = new BehaviorSubject<unknown>(null);
    const principalStub = {
      getAuthenticationState: jest.fn(() => authStateSubject.asObservable()),
      identity: jest.fn(() => Promise.resolve(mockUser))
    };

     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [ ToolbarComponent, SystemInfoMenuComponent ],
      imports: [
        MaterialModule,
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
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        LoginService,
        AuthService,
        { provide: Principal, useValue: principalStub },
        AccountService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
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

  afterEach(() => fixture?.destroy());
  afterAll(() => TestBed.resetTestingModule());

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

  it('refreshes language menu when languagesToUse changes', () => {
    const languageService = TestBed.inject(LanguageService);
    const previous = config.languagesToUse;
    config.languagesToUse = [
      { shortname: 'en', name: 'English', enabled: true, order: 0 } as any,
      { shortname: 'ca', name: 'Català', enabled: true, order: 1 } as any,
    ];
    languageService.applyLanguagesToUse([
      { shortname: 'ca', name: 'Català', enabled: true, order: 0 } as any,
      { shortname: 'en', name: 'English', enabled: false, order: 1 } as any,
    ]);

    expect(component.languages.map((l) => l.shortname)).toEqual(['ca']);
    config.languagesToUse = previous;
  });
});
