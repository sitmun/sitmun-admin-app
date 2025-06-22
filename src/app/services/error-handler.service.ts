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
    const message = error?.message || this.translateService.instant(defaultMessage);
    this.loggerService.error(message, error);
    this.snackBar.open(message, 'Close', { duration: 5000 });
    return null;
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
