import {CommonModule} from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';

import {AccountService} from './account/account.service';
import {AuthService} from './auth/auth.service';
import {LoginService} from './auth/login.service';
import {Principal} from './auth/principal.service';
import {ConfigModule} from './config/config.module';
import {ConfigurationService} from './config/configuration.service';
import {HasAnyAuthorityOnTerritoryDirective} from './directives/has-any-authority-on-territory.directive';
import {HasAnyAuthorityDirective} from './directives/has-any-authority.directive';
import {FeatureFlagComponent} from './features/feature-flag.component';
import {FeatureFlagDirective} from './features/feature-flag.directive';
import {FeatureFlagPipe} from './features/feature-flag.pipe';
import {FeatureFlagService} from './features/feature-flag.service';
import {CanDeactivateGuard} from './guards/can-deactivate-guard.service';
import {AuthExpiredInterceptor} from './interceptors/auth-expired.interceptor';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {MessagesInterceptor} from './interceptors/messages.interceptor';

// SITMUN configuration services

@NgModule({ declarations: [
        HasAnyAuthorityDirective,
        HasAnyAuthorityOnTerritoryDirective,
        FeatureFlagDirective,
        FeatureFlagPipe,
        FeatureFlagComponent
    ],
    exports: [
        HasAnyAuthorityDirective,
        HasAnyAuthorityOnTerritoryDirective,
        FeatureFlagDirective,
        FeatureFlagPipe,
        FeatureFlagComponent
    ], imports: [CommonModule,
        RouterModule,
        MatIconModule,
        ConfigModule.forRoot()], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only.');
    }
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        // Auth services
        AuthService,
        Principal,
        LoginService,

        // Account services
        AccountService,

        // Feature services
        FeatureFlagService,

        // Guards
        CanDeactivateGuard,

        // SITMUN configuration services
        ConfigurationService,

        // Interceptors
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthExpiredInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MessagesInterceptor,
          multi: true
        }
      ]
    };
  }
}
