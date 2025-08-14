import { Injectable } from '@angular/core';
import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { LoggerService } from './logger.service';

/**
 * Handler for missing translation keys that logs them to the console
 */
@Injectable()
export class CustomMissingTranslationHandler implements MissingTranslationHandler {
  private missingKeys = new Set<string>();

  constructor(private loggerService: LoggerService) {}

  /**
   * Handle missing translation keys
   * @param params - Parameters containing the missing key and other context
   * @returns The key itself as fallback
   */
  handle(params: MissingTranslationHandlerParams): string {
    const key = params.key;
    
    // Only log each missing key once per session
    if (!this.missingKeys.has(key)) {
      this.missingKeys.add(key);
      this.loggerService.warn(`Missing translation key: ${key}`, {
        key: key,
        interpolateParams: params.interpolateParams,
        translateService: params.translateService
      });
    }
    
    // Return the key as fallback
    return key;
  }

  /**
   * Get all missing keys that have been logged
   * @returns Array of missing translation keys
   */
  getMissingKeys(): string[] {
    return Array.from(this.missingKeys);
  }

  /**
   * Clear the list of missing keys
   */
  clearMissingKeys(): void {
    this.missingKeys.clear();
  }
} 