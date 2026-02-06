import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed, ComponentFixture, fakeAsync, tick} from '@angular/core/testing';
import {Router} from '@angular/router';

import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {CookieService} from 'ngx-cookie-service';
import {of} from 'rxjs';

import {AuthService, ResourceService, ExternalService, ExternalConfigurationService} from '@app/core';
import {NotificationService} from '@app/services/notification.service';

import {CallbackComponent} from './callback.component';

describe('CallbackComponent', () => {
  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;
  let router: Router;
  let cookieService: CookieService;
  let notificationService: NotificationService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CallbackComponent,
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
        Router,
        CookieService,
        TranslateService,
        NotificationService,
        AuthService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CallbackComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    cookieService = TestBed.inject(CookieService);
    notificationService = TestBed.inject(NotificationService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should access dashboard if token exists', fakeAsync(() => {
    jest.spyOn(cookieService, 'get').mockReturnValue('token123');
    const loginSpy = jest.spyOn(authService, 'loginWithToken').mockResolvedValue(undefined);
    const navSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true as any);
    component.ngOnInit();
    tick();
    expect(component.messageKey).toBe('callback.redirect');
    expect(loginSpy).toHaveBeenCalledWith('token123');
    expect(navSpy).toHaveBeenCalledWith(['dashboard']);
  }));

  it('should navigate to root and show error if token does not exist', fakeAsync(() => {
    jest.spyOn(cookieService, 'get').mockReturnValue('');
    const navByUrlSpy = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true as any);
    const showErrorSpy = jest.spyOn(notificationService, 'showError');
    component.ngOnInit();
    tick();
    expect(navByUrlSpy).toHaveBeenCalledWith('/');
    expect(showErrorSpy).toHaveBeenCalled();
  }));
});
