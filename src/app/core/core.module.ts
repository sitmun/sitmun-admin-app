import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ConfigModule } from './config/config.module';

// Auth services
import { AuthService } from './auth/auth.service';
import { Principal } from './auth/principal.service';
import { LoginService } from './auth/login.service';

// Account services
import { AccountService } from './account/account.service';

// Directives
import { HasAnyAuthorityDirective } from './directives/has-any-authority.directive';
import { HasAnyAuthorityOnTerritoryDirective } from './directives/has-any-authority-on-territory.directive';

// Guards
import { CanDeactivateGuard } from './guards/can-deactivate-guard.service';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthExpiredInterceptor } from './interceptors/auth-expired.interceptor';
import { MessagesInterceptor } from './interceptors/messages.interceptor';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    ConfigModule.forRoot()
  ],
  declarations: [
    HasAnyAuthorityDirective,
    HasAnyAuthorityOnTerritoryDirective
  ],
  exports: [
    HasAnyAuthorityDirective,
    HasAnyAuthorityOnTerritoryDirective
  ]
})
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

        // Guards
        CanDeactivateGuard,

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
