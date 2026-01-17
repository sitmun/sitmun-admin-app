import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TranslateService } from '@ngx-translate/core';

import { isProblemDetail, getProblemTranslationKey, getErrorMessage } from '@app/utils/problem-detail.utils';

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
    let translationKey = defaultMessage;
    const params: Record<string, any> = {};
    
    // Try to get RFC 9457 problem type first
    if (isProblemDetail(error)) {
      translationKey = getProblemTranslationKey(error);
      
      // Extract and translate entity name if present
      if (error.error?.properties?.referencingEntityTranslationKey) {
        const entityTranslationKey = error.error.properties.referencingEntityTranslationKey;
        const translatedEntityName = this.getTranslatedEntityName(entityTranslationKey);
        if (translatedEntityName) {
          params['entityName'] = translatedEntityName;
        }
      }
    }
    
    // Try to translate with parameters, fallback to detail or original message
    let message: string;
    if (Object.keys(params).length > 0) {
      // Try translation with parameters first
      message = this.safeInstant(translationKey, params);
      if (!message) {
        // Translation not found, use RFC 9457 detail or legacy message and replace placeholders
        const detailMessage = getErrorMessage(error) || this.safeInstant('common.error.generic') || 'An error occurred';
        message = this.replacePlaceholders(detailMessage, params);
      } else {
        // Translation found, but ensure placeholders are replaced (in case translateService didn't handle it)
        message = this.replacePlaceholders(message, params);
      }
    } else {
      // No parameters, just translate normally
      message = this.safeInstant(translationKey);
      if (!message) {
        message = getErrorMessage(error) || this.safeInstant('common.error.generic') || 'An error occurred';
      }
    }
    
    this.loggerService.error(message, error);
    const closeText = this.safeInstant('common.button.close') || 'Close';
    this.snackBar.open(message, closeText, { duration: 5000 });
    return null;
  }

  /**
   * Translates an entity translation key to the current language.
   * 
   * @param translationKey the translation key (e.g., "entity.task.plural")
   * @returns the translated entity name (e.g., "Tasks", "Tareas", "Tasques"), or null if translation fails
   */
  private getTranslatedEntityName(translationKey: string): string | null {
    if (!translationKey) {
      return null;
    }
    
    try {
      const translated = this.translateService.instant(translationKey);
      // If translation returns the key itself, translation failed
      return (translated && translated !== translationKey) ? translated : null;
    } catch {
      return null;
    }
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

  /**
   * Replaces placeholders in a message string with parameter values.
   * 
   * @param message the message with placeholders (e.g., "Hello {{name}}")
   * @param params the parameters to replace (e.g., { name: "World" })
   * @returns the message with placeholders replaced (e.g., "Hello World")
   */
  private replacePlaceholders(message: string, params: Record<string, any>): string {
    if (!message || !params || Object.keys(params).length === 0) {
      return message;
    }
    
    let result = message;
    for (const [key, value] of Object.entries(params)) {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value));
    }
    
    return result;
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
