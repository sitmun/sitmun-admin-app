import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import {NotificationComponent, NotificationData} from '@app/components/shared/notification/notification.component';
import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

interface QueuedError {
  titleKey: string;
  message: string;
  shouldTranslate: boolean;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Material Design standard durations
  private readonly DURATION_SHORT = 4000;  // 4 seconds
  private readonly DURATION_LONG = 10000;  // 10 seconds
  private readonly DURATION_INDEFINITE = 0; // Requires user dismissal

  // Error debouncing configuration
  private readonly ERROR_DEBOUNCE_TIME = 500; // 500ms window to group errors
  private readonly MAX_ERRORS_TO_SHOW = 5; // Maximum number of individual errors to show before summarizing

  private errorQueue: QueuedError[] = [];
  private errorQueueTimer: ReturnType<typeof setTimeout> | null = null;
  private currentErrorRef: ReturnType<typeof this.snackBar.openFromComponent> | null = null;

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
   * Shows an error notification with debouncing to handle multiple rapid errors
   * @param titleKey - Translation key for the title
   * @param message - Error message (not translated)
   * @param shouldTranslate - Whether to translate the message (default: false)
   */
  showError(titleKey: string, message: string, shouldTranslate = false): void {
    const now = Date.now();
    
    // Add error to queue
    this.errorQueue.push({
      titleKey,
      message,
      shouldTranslate,
      timestamp: now
    });

    // Clear existing timer
    if (this.errorQueueTimer) {
      clearTimeout(this.errorQueueTimer);
    }

    // Set new timer to process queue after debounce period
    this.errorQueueTimer = setTimeout(() => {
      this.processErrorQueue();
    }, this.ERROR_DEBOUNCE_TIME);
  }

  /**
   * Processes the queued errors and displays them appropriately
   */
  private processErrorQueue(): void {
    if (this.errorQueue.length === 0) {
      return;
    }

    // Dismiss current error if showing
    if (this.currentErrorRef) {
      this.currentErrorRef.dismiss();
      this.currentErrorRef = null;
    }

    // If only one error, show it directly
    if (this.errorQueue.length === 1) {
      const error = this.errorQueue[0];
      this.displayError(error.titleKey, error.message, error.shouldTranslate);
      this.errorQueue = [];
      return;
    }

    // Multiple errors: show summary with details option
    const errorCount = this.errorQueue.length;
    const titleKey = 'common.error.multipleErrors.title';
    let summaryMessage: string;
    let detailsMessage: string;

    // Build detailed message for dialog (all errors)
    const allErrorMessages = this.errorQueue.map((e, index) => {
      const msg = e.shouldTranslate 
        ? this.translateService.instant(e.message) 
        : e.message;
      return `${index + 1}. ${msg}`;
    }).join('\n\n');
    detailsMessage = allErrorMessages;

    if (errorCount <= this.MAX_ERRORS_TO_SHOW) {
      // Show individual errors (up to MAX_ERRORS_TO_SHOW)
      const errorMessages = this.errorQueue
        .slice(0, this.MAX_ERRORS_TO_SHOW)
        .map(e => {
          const msg = e.shouldTranslate 
            ? this.translateService.instant(e.message) 
            : e.message;
          return `• ${msg}`;
        })
        .join('\n');
      
      if (errorCount > this.MAX_ERRORS_TO_SHOW) {
        const remaining = errorCount - this.MAX_ERRORS_TO_SHOW;
        summaryMessage = `${errorMessages}\n${this.translateService.instant('common.error.multipleErrors.andMore', { count: remaining })}`;
      } else {
        summaryMessage = errorMessages;
      }
    } else {
      // Too many errors: show count summary
      summaryMessage = this.translateService.instant('common.error.multipleErrors.summary', { count: errorCount });
    }

    this.displayError(titleKey, summaryMessage, false, detailsMessage);
    this.errorQueue = [];
  }

  /**
   * Displays a single error notification
   */
  private displayError(titleKey: string, message: string, shouldTranslate: boolean, detailsMessage?: string): void {
    const hasMultipleErrors = !!detailsMessage;
    const data: NotificationData = {
      title: this.translateService.instant(titleKey),
      message: shouldTranslate ? this.translateService.instant(message) : message,
      type: 'error',
      duration: this.DURATION_INDEFINITE,
      showAction: true,
      actionText: this.translateService.instant('common.button.close'),
      showDetailsButton: hasMultipleErrors,
      detailsTitle: hasMultipleErrors ? this.translateService.instant('common.error.multipleErrors.detailsTitle') : undefined,
      detailsMessage: detailsMessage
    };

    this.currentErrorRef = this.snackBar.openFromComponent(
      NotificationComponent, 
      this.getDefaultConfig(data, 0)
    );

    // Clear reference when dismissed
    if (this.currentErrorRef) {
      this.currentErrorRef.afterDismissed().subscribe(() => {
        this.currentErrorRef = null;
      });
    }
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
