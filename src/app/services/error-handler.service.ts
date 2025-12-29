import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { LoggerService } from './logger.service';
import { isProblemDetail, getProblemTranslationKey, getErrorMessage } from '@app/utils/problem-detail.utils';

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
    let translationKey = defaultMessage;
    
    // Try to get RFC 9457 problem type first
    if (isProblemDetail(error)) {
      translationKey = getProblemTranslationKey(error);
    }
    
    // Try to translate, fallback to detail or original message
    let message = this.safeInstant(translationKey);
    if (!message) {
      // Translation not found, use RFC 9457 detail or legacy message
      message = getErrorMessage(error) || this.safeInstant('common.error.generic') || 'An error occurred';
    }
    
    this.loggerService.error(message, error);
    const closeText = this.safeInstant('common.button.close') || 'Close';
    this.snackBar.open(message, closeText, { duration: 5000 });
    return null;
  }

  private safeInstant(key: string, params?: Record<string, any>): string {
    try {
      if (!key) return '';
      
      // Check if translation exists to avoid warnings
      const translations = this.translateService.translations[this.translateService.currentLang];
      if (!translations) {
        return ''; // Translations not loaded yet
      }
      
      const translated = this.translateService.instant(key, params);
      // If translation returns the key itself, translation failed
      return (translated && translated !== key) ? translated : '';
    } catch {
      // Guard against TranslateService throwing on bad key
      return '';
    }
  }

  handleDataNotFound(entityType: string) {
    const message = this.safeInstant('common.error.notFound', { entity: entityType }) || `${entityType} not found`;
    this.loggerService.error(message);
    const closeText = this.safeInstant('common.button.close') || 'Close';
    this.snackBar.open(message, closeText, { duration: 5000 });
    return null;
  }

  missingRequiredFields(entityType: string) {
    const message = this.safeInstant('common.error.missingFields', { entity: entityType }) || `Missing required fields for ${entityType}`;
    this.loggerService.error(message);
    const closeText = this.safeInstant('common.button.close') || 'Close';
    this.snackBar.open(message, closeText, { duration: 5000 });
    return null;
  }
}
