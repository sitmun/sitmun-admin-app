import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CookieService} from "ngx-cookie-service";

import {AuthService} from "@app/core";
import {OIDC_TOKEN_COOKIE} from "@app/core/auth/auth.constants";
import {NotificationService} from "@app/services/notification.service";

@Component({
  selector: 'app-callback',
  imports: [MatProgressSpinnerModule, TranslateModule],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss'
})
export class CallbackComponent implements OnInit {
  messageKey = 'callback.processing';

  constructor(
    private readonly router: Router,
    private readonly cookieService: CookieService,
    private readonly translateService: TranslateService,
    private readonly notificationService: NotificationService,
    private readonly authenticationService: AuthService
  ) {
  }

  ngOnInit(): void {
    const token = this.cookieService.get(OIDC_TOKEN_COOKIE);
    if (token) {
      this.messageKey = 'callback.redirect';
      this.authenticationService.loginWithToken(token).then(() => {
        this.router.navigate(['dashboard']);
      });
    } else {
      this.router.navigateByUrl('/').then(() => {
        this.notificationService.showError(
          this.translateService.instant('error.general.title'),
          this.translateService.instant('loginEntity.bad-credentials')
        );
      });
    }
  }
}
