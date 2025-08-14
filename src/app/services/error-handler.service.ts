import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private loggerService: LoggerService
  ) {}

  handleError(error: any, defaultMessage = 'common.error.generic') {
    const hasKey = typeof defaultMessage === 'string' && defaultMessage.length > 0;
    const fallbackKey = 'common.error.generic';
    const translationKey = hasKey ? defaultMessage : fallbackKey;

    const message = error?.message || this.safeInstant(translationKey);
    this.loggerService.error(message, error);
    this.snackBar.open(message, 'Close', { duration: 5000 });
    return null;
  }

  private safeInstant(key: string, params?: Record<string, any>): string {
    try {
      if (!key) return 'Unexpected error';
      return this.translateService.instant(key, params);
    } catch {
      // Guard against TranslateService throwing on bad key
      return key;
    }
  }

  handleDataNotFound(entityType: string) {
    const message = this.translateService.instant('common.error.notFound', { entity: entityType });
    this.loggerService.error(message);
    this.snackBar.open(message, 'Close', { duration: 5000 });
    return null;
  }

  missingRequiredFields(entityType: string) {
    const message = this.translateService.instant('common.error.missingFields', { entity: entityType });
    this.loggerService.error(message);
    this.snackBar.open(message, 'Close', { duration: 5000 });
    return null;
  }
}
