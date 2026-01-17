import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { firstValueFrom } from 'rxjs';

/**
 * Interface for a language item in the configuration (icon mapping only)
 */
export interface LanguageItem {
  shortname: string;
  icon?: string;  // Icon path (e.g., "assets/img/flag_es.svg")
}

/**
 * Interface for application configuration
 */
export interface AppConfig {
  defaultLanguage?: string;  // Fallback default language
  languages?: LanguageItem[];  // Icon mapping only (shortname and icon)
}

/**
 * Service to load and manage application configuration from JSON file
 * Configuration is loaded during app initialization and cached
 * This config is ONLY for icon paths and default language fallback.
 * Language definitions come from backend API.
 */
@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private readonly http = inject(HttpClient);
  private config: AppConfig | null = null;
  private readonly DEFAULT_CONFIG: AppConfig = {
    defaultLanguage: 'ca',
    languages: []
  };

  /**
   * Load configuration from JSON file
   * Should be called during app initialization (APP_INITIALIZER)
   * Falls back to default config if loading fails
   */
  async loadConfig(): Promise<void> {
    try {
      this.config = await firstValueFrom(
        this.http.get<AppConfig>('assets/config/app-config.json')
      );
    } catch (error: unknown) {
      // Use console directly here as this is bootstrap code before Angular services are fully available
      // eslint-disable-next-line no-console
      console.warn(
        'Failed to load app configuration, using defaults. Error:',
        error
      );
      this.config = this.DEFAULT_CONFIG;
    }
  }

  /**
   * Get the default language fallback from app-config.json
   * Returns the configured default language or 'ca' as fallback
   * This is used as the final fallback in the language determination chain
   */
  getDefaultLanguageFallback(): string {
    return this.config?.defaultLanguage ?? 'ca';
  }

  /**
   * Get the icon/flag path for a language by its shortname
   * @param shortname Language shortname (e.g., 'es', 'en', 'oc-aranes')
   * @returns Icon path string or empty string if not found
   */
  getLanguageIcon(shortname: string): string {
    const languages = this.config?.languages;
    if (Array.isArray(languages)) {
      const language = languages.find(lang => lang.shortname === shortname);
      return language?.icon || '';
    }
    return '';
  }

  /**
   * Check if the icon for a language is an image path (not an emoji)
   * @param shortname Language shortname
   * @returns true if icon exists and is an image path (contains '/' or ends with image extension)
   */
  isImageIcon(shortname: string): boolean {
    const icon = this.getLanguageIcon(shortname);
    if (!icon) return false;
    // Check if it's an image path (contains path separator or image extension)
    return icon.includes('/') || /\.(svg|png|jpg|jpeg|gif|webp)$/i.test(icon);
  }
}

/**
 * Factory function for APP_INITIALIZER to load config before app starts
 */
export function initializeAppConfig(
  configService: AppConfigService
): () => Promise<void> {
  return () => configService.loadConfig();
}




