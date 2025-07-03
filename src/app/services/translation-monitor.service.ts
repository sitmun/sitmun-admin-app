import { Injectable, Injector } from '@angular/core';
import { MissingTranslationHandler } from '@ngx-translate/core';
import { CustomMissingTranslationHandler } from './missing-translation.handler';

/**
 * Service to monitor and access missing translation information
 */
@Injectable({
  providedIn: 'root'
})
export class TranslationMonitorService {
  private missingTranslationHandler: CustomMissingTranslationHandler;

  constructor(private injector: Injector) {
    // Get the missing translation handler instance
    this.missingTranslationHandler = this.injector.get(MissingTranslationHandler) as CustomMissingTranslationHandler;
  }

  /**
   * Get all missing keys that have been logged
   * @returns Array of missing translation keys
   */
  getMissingKeys(): string[] {
    return this.missingTranslationHandler.getMissingKeys();
  }

  /**
   * Clear the list of missing keys
   */
  clearMissingKeys(): void {
    this.missingTranslationHandler.clearMissingKeys();
  }

  /**
   * Get a summary of missing translations
   * @returns Object with count and keys
   */
  getMissingKeysSummary(): { count: number; keys: string[] } {
    const keys = this.getMissingKeys();
    return {
      count: keys.length,
      keys: keys
    };
  }
} 