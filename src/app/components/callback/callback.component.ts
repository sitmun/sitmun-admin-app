import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Router} from '@angular/router';

import {TranslateModule, TranslateService} from "@ngx-translate/core";

import {Principal} from "@app/core";
import {NotificationService} from "@app/services/notification.service";

@Component({
  selector: 'app-callback',
  imports: [TranslateModule],
  templateUrl: './callback.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './callback.component.scss'
})
export class CallbackComponent implements OnInit {
  messageKey = 'callback.processing';

  constructor(
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly notificationService: NotificationService,
    private readonly principal: Principal
  ) {}

  ngOnInit(): void {
    this.principal.identity().then(identity => {
      if (identity) {
        this.messageKey = 'callback.redirect';
        this.router.navigate(['dashboard']);
      } else {
        this.router.navigateByUrl('/').then(() => {
          this.notificationService.showError(
            this.translateService.instant('backend.error.general.title'),
            this.translateService.instant('entity.login.bad-credentials')
          );
        });
      }
    });
  }
}
