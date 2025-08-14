import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import {NotificationComponent, NotificationData} from '@app/components/shared/notification/notification.component';
import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Material Design standard durations
  private readonly DURATION_SHORT = 4000;  // 4 seconds
  private readonly DURATION_LONG = 10000;  // 10 seconds
  private readonly DURATION_INDEFINITE = 0; // Requires user dismissal

  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {
  }

  /**
   * Shows a success notification
   * @param titleKey - Translation key for the title
   * @param messageKey - Translation key for the message
   * @param duration - Duration in milliseconds (default: 5000)
   */
  showSuccess(titleKey: string, messageKey: string, duration: number = this.DURATION_SHORT): void {
    const data: NotificationData = {
      title: this.translateService.instant(titleKey),
      message: this.translateService.instant(messageKey),
      type: 'success',
      duration,
      showAction: false
    };

    this.snackBar.openFromComponent(NotificationComponent, this.getDefaultConfig(data, duration));
  }

  /**
   * Shows an error notification
   * @param titleKey - Translation key for the title
   * @param message - Error message (not translated)
   * @param shouldTranslate - Whether to translate the message (default: false)
   */
  showError(titleKey: string, message: string, shouldTranslate = false): void {
    const data: NotificationData = {
      title: this.translateService.instant(titleKey),
      message: shouldTranslate ? this.translateService.instant(message) : message,
      type: 'error',
      duration: this.DURATION_INDEFINITE,
      showAction: true,
      actionText: this.translateService.instant('common.button.close')
    };

    this.snackBar.openFromComponent(NotificationComponent, this.getDefaultConfig(data, 0));
  }

  /**
   * Shows an info notification
   * @param titleKey - Translation key for the title
   * @param messageKey - Translation key for the message
   * @param duration - Duration in milliseconds (default: 4000)
   */
  showInfo(titleKey: string, messageKey: string, duration: number = this.DURATION_SHORT): void {
    const data: NotificationData = {
      title: this.translateService.instant(titleKey),
      message: this.translateService.instant(messageKey),
      type: 'info',
      duration,
      showAction: false
    };

    this.snackBar.openFromComponent(NotificationComponent, this.getDefaultConfig(data, duration));
  }

  /**
   * Shows a warning notification
   * @param titleKey - Translation key for the title
   * @param messageKey - Translation key for the message
   * @param duration - Duration in milliseconds (default: 6000)
   */
  showWarning(titleKey: string, messageKey: string, duration: number = this.DURATION_LONG): void {
    const data: NotificationData = {
      title: this.translateService.instant(titleKey),
      message: this.translateService.instant(messageKey),
      type: 'warning',
      duration,
      showAction: true,
      actionText: this.translateService.instant('common.button.close')
    };

    this.snackBar.openFromComponent(NotificationComponent, this.getDefaultConfig(data, duration));
  }

  private getDefaultConfig(data: NotificationData, duration: number): MatSnackBarConfig<NotificationData> {
    const panelClass = ['notification'];

    // Add type-specific classes
    switch (data.type) {
      case 'success':
        panelClass.push('notification-success', 'mat-mdc-snack-bar-success');
        break;
      case 'error':
        panelClass.push('notification-error', 'mat-mdc-snack-bar-error');
        break;
    }

    return {
      data,
      duration,
      horizontalPosition: 'center' as MatSnackBarHorizontalPosition,
      verticalPosition: 'bottom' as MatSnackBarVerticalPosition,
      panelClass
    };
  }
}
