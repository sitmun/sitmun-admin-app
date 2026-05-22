
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {Router} from '@angular/router';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';

import {AuthService, ResourceService, ExternalService, ExternalConfigurationService} from '@app/core';
import {Principal} from '@app/core/auth/principal.service';
import {NotificationService} from '@app/services/notification.service';

import {CallbackComponent} from './callback.component';

class PrincipalMock {
  identity = jest.fn();
  authenticate = jest.fn();
}

describe('CallbackComponent', () => {
  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;
  let router: Router;
  let notificationService: NotificationService;
  let principal: Principal;

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
        AuthService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
        {
          provide: Principal,
          useClass: PrincipalMock
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn(), navigateByUrl: jest.fn() }
        },
        {
          provide: NotificationService,
          useValue: { showError: jest.fn() }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CallbackComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    notificationService = TestBed.inject(NotificationService);
    principal = TestBed.inject(Principal);
  });

  it('should create', async () => {
    (principal.identity as jest.Mock) = jest.fn().mockResolvedValue({ username: 'user' });
    await fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should navigate to dashboard if user is authenticated', async () => {
    (principal.identity as jest.Mock) = jest.fn().mockResolvedValue({ username: 'user' });
    const navSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true as any);
    await fixture.detectChanges();
    await component.ngOnInit();
    expect(component.messageKey).toBe('callback.redirect');
    expect(navSpy).toHaveBeenCalledWith(['dashboard']);
  });

  it('should navigate to root and show error if user is not authenticated', async () => {
    (principal.identity as jest.Mock) = jest.fn().mockResolvedValue(null);
    const navByUrlSpy = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true as any);
    const showErrorSpy = jest.spyOn(notificationService, 'showError');
    await fixture.detectChanges();
    await component.ngOnInit();
    expect(navByUrlSpy).toHaveBeenCalledWith('/');
    expect(showErrorSpy).toHaveBeenCalled();
  });
});
