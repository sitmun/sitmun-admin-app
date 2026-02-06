import { CommonModule, NgOptimizedImage } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { Router } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { LoginService } from '@app/core/auth/login.service';
import { AppConfigService } from '@app/services/app-config.service';
import { MaterialModule } from '../../material-module';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockLoginService: {
    getEnabledAuthMethods: jest.Mock;
    login: jest.Mock;
    initOidcLogin: jest.Mock;
  };
  let mockRouter: { navigateByUrl: jest.Mock };
  let mockAppConfigService: { getLanguageIcon: jest.Mock };

  beforeEach(async () => {
    mockLoginService = {
      getEnabledAuthMethods: jest.fn(() => of([])),
      login: jest.fn(() => Promise.resolve()),
      initOidcLogin: jest.fn()
    };
    mockRouter = {
      navigateByUrl: jest.fn().mockResolvedValue(true)
    };
    mockAppConfigService = {
      getLanguageIcon: jest.fn(() => '')
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        CommonModule,
        NgOptimizedImage,
        FormsModule,
        ReactiveFormsModule,
        MatIconTestingModule,
        MaterialModule,
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
        { provide: LoginService, useValue: mockLoginService },
        { provide: Router, useValue: mockRouter },
        { provide: AppConfigService, useValue: mockAppConfigService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('form invalid when mid-empty', () => {
    component.form.patchValue({
      password: 'password',
      lang: 'en'
    });
    expect(component.form.valid).toBeFalsy();
  });

  it('form valid', () => {
    component.form.patchValue({
      username: 'username',
      password: 'password',
      lang: 'en'
    });
    expect(component.form.valid).toBeTruthy();
  });

  describe('getEnabledAuthMethods and alternativeLoginMethods', () => {
    it('should set alternativeLoginMethods when getEnabledAuthMethods returns OIDC providers', () => {
      const oidcProviders = [
        { providerName: 'google', displayName: 'Google', imagePath: '' }
      ];
      mockLoginService.getEnabledAuthMethods.mockReturnValue(
        of([{ id: 'oidc', providers: oidcProviders }])
      );
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.alternativeLoginMethods).toEqual(oidcProviders);
    });

    it('should keep alternativeLoginMethods empty when getEnabledAuthMethods returns non-array', () => {
      mockLoginService.getEnabledAuthMethods.mockReturnValue(of(null));
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.alternativeLoginMethods).toEqual([]);
    });

    it('should keep alternativeLoginMethods empty when getEnabledAuthMethods returns array without oidc', () => {
      mockLoginService.getEnabledAuthMethods.mockReturnValue(
        of([{ id: 'other', providers: [] }])
      );
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.alternativeLoginMethods).toEqual([]);
    });
  });

  describe('initAuth', () => {
    it('should call loginService.initOidcLogin with provider id', () => {
      component.initAuth('google');
      expect(mockLoginService.initOidcLogin).toHaveBeenCalledWith('google');
    });
  });

  describe('login', () => {
    it('should not call loginService.login when username is empty', () => {
      component.form.patchValue({ username: '', password: 'p', lang: 'en' });
      component.login();
      expect(mockLoginService.login).not.toHaveBeenCalled();
    });

    it('should not call loginService.login when password is empty', () => {
      component.form.patchValue({ username: 'u', password: '', lang: 'en' });
      component.login();
      expect(mockLoginService.login).not.toHaveBeenCalled();
    });

    it('should navigate to dashboard on successful login', fakeAsync(() => {
      mockLoginService.login.mockResolvedValue(undefined);
      component.form.patchValue({
        username: 'u',
        password: 'p',
        lang: 'en'
      });
      component.login();
      tick();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    }));

    it('should set badCredentials on login failure', fakeAsync(() => {
      mockLoginService.login.mockRejectedValue(undefined);
      component.form.patchValue({
        username: 'u',
        password: 'p',
        lang: 'en'
      });
      component.login();
      tick();
      expect(component.badCredentials).toBe('ERROR');
    }));
  });
});
