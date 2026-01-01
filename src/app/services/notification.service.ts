import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import {NotificationComponent, NotificationData} from '@app/components/shared/notification/notification.component';
import {Injectable, NgZone} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

interface QueuedError {
  titleKey: string;
  message: string;
  shouldTranslate: boolean;
  timestamp: number;
}

interface QueuedSuccess {
  titleKey: string;
  messageKey: string;
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

  // Success debouncing configuration
  private readonly SUCCESS_DEBOUNCE_TIME = 500; // 500ms window to group success messages

  private errorQueue: QueuedError[] = [];
  private errorQueueTimer: ReturnType<typeof setTimeout> | null = null;
  private currentErrorRef: ReturnType<typeof this.snackBar.openFromComponent> | null = null;

  private successQueue: QueuedSuccess[] = [];
  private successQueueTimer: ReturnType<typeof setTimeout> | null = null;
  private currentSuccessRefs: ReturnType<typeof this.snackBar.openFromComponent>[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private ngZone: NgZone
  ) {
  }

  /**
   * Shows a success notification with debouncing to handle multiple rapid success messages
   * @param titleKey - Translation key for the title
   * @param messageKey - Translation key for the message
   * @param duration - Duration in milliseconds (default: 4000)
   */
  showSuccess(titleKey: string, messageKey: string, duration: number = this.DURATION_SHORT): void {
    const now = Date.now();
    
    // Add success to queue
    this.successQueue.push({
      titleKey,
      messageKey,
      timestamp: now
    });

    // Clear existing timer
    if (this.successQueueTimer) {
      clearTimeout(this.successQueueTimer);
    }

    // Set new timer to process queue after debounce period
    // Use requestAnimationFrame to avoid setTimeout violations
    this.successQueueTimer = setTimeout(() => {
      this.ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          this.ngZone.run(() => {
            this.processSuccessQueue();
          });
        });
      });
    }, this.SUCCESS_DEBOUNCE_TIME);
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
    // Use requestAnimationFrame to avoid setTimeout violations
    this.errorQueueTimer = setTimeout(() => {
      this.ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          this.ngZone.run(() => {
            this.processErrorQueue();
          });
        });
      });
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

    // Clear success queue timer - we'll process success queue after error is dismissed
    if (this.successQueueTimer) {
      clearTimeout(this.successQueueTimer);
      this.successQueueTimer = null;
    }

    // Dismiss any success toasts when error arrives (errors take priority)
    this.dismissAllSuccesses();

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

    // Clear reference when dismissed and show any queued successes
    if (this.currentErrorRef) {
      this.currentErrorRef.afterDismissed().subscribe(() => {
        this.currentErrorRef = null;
        // Clear any pending success queue timer - we'll process immediately
        if (this.successQueueTimer) {
          clearTimeout(this.successQueueTimer);
          this.successQueueTimer = null;
        }
        // After error is dismissed, process any queued successes immediately
        if (this.successQueue.length > 0) {
          this.processSuccessQueue();
        }
      });
    }
  }

  /**
   * Dismisses all currently showing success toasts
   */
  private dismissAllSuccesses(): void {
    for (const ref of this.currentSuccessRefs) {
      if (ref) {
        ref.dismiss();
      }
    }
    this.currentSuccessRefs = [];
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
   * Processes the queued success messages and displays them appropriately
   */
  private processSuccessQueue(): void {
    if (this.successQueue.length === 0) {
      return;
    }

    // Don't process queue if an error is currently showing
    // Wait until the error is dismissed
    if (this.currentErrorRef) {
      return;
    }

    // Group successes by titleKey + messageKey combination
    const grouped = new Map<string, QueuedSuccess[]>();
    
    for (const success of this.successQueue) {
      const key = `${success.titleKey}|${success.messageKey}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(success);
    }

    // Process each group
    for (const [groupKey, successes] of grouped.entries()) {
      const [titleKey, messageKey] = groupKey.split('|');
      const count = successes.length;

      if (count === 1) {
        // Single message: show as-is
        this.displaySuccess(titleKey, messageKey, this.DURATION_SHORT);
      } else {
        // Multiple identical messages: show combined message with count
        const pluralMessageKey = this.getPluralMessageKey(messageKey);
        this.displaySuccess(titleKey, pluralMessageKey, this.DURATION_SHORT, count);
      }
    }

    // Clear queue
    this.successQueue = [];
  }

  /**
   * Gets the plural translation key for a message key
   * @param messageKey - The base message key (e.g., "backend.operation.deleted")
   * @returns The plural key (e.g., "backend.operation.deleted.multiple")
   */
  private getPluralMessageKey(messageKey: string): string {
    // Map base keys to plural keys
    const pluralMap: Record<string, string> = {
      'backend.operation.created': 'backend.operation.created.multiple',
      'backend.operation.updated': 'backend.operation.updated.multiple',
      'backend.operation.deleted': 'backend.operation.deleted.multiple'
    };

    return pluralMap[messageKey] || messageKey;
  }

  /**
   * Displays a single success notification
   */
  private displaySuccess(titleKey: string, messageKey: string, duration: number, count?: number): void {
    // Don't show success if an error is currently displayed (queue it instead)
    if (this.currentErrorRef) {
      // Re-queue this success to show after error is dismissed
      this.successQueue.push({
        titleKey,
        messageKey,
        timestamp: Date.now()
      });
      return;
    }

    let message: string;
    
    if (count !== undefined) {
      // Use plural form with count parameter
      message = this.translateService.instant(messageKey, { count });
    } else {
      // Single message
      message = this.translateService.instant(messageKey);
    }

    const data: NotificationData = {
      title: this.translateService.instant(titleKey),
      message,
      type: 'success',
      duration,
      showAction: false
    };

    const ref = this.snackBar.openFromComponent(NotificationComponent, this.getDefaultConfig(data, duration));
    
    // Track success reference
    this.currentSuccessRefs.push(ref);
    
    // Remove from tracking when dismissed
    ref.afterDismissed().subscribe(() => {
      const index = this.currentSuccessRefs.indexOf(ref);
      if (index > -1) {
        this.currentSuccessRefs.splice(index, 1);
      }
    });
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
