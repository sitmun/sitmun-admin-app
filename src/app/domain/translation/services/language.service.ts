import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RestService } from '@app/core/hal/rest/rest.service';
import {SUPPRESS_HTTP_NOTIFICATION} from '@app/core/interceptors/messages.interceptor';
import { filterEnabledLanguages, sortByLanguageOrder } from '@app/services/ui-language.resolver';
import { config } from '@config';

import { Language } from '../models/language.model';

export interface DefaultLanguageChangePreview {
  currentDefault: string;
  requestedDefault: string;
  affectedValues: number;
  backupUpserts: number;
  restoredValues: number;
  missingTranslations: number;
  missing: MissingTranslationDto[];
}

export interface DefaultLanguageChangeRequest {
  from: string;
  to: string;
  continueOnMissingTranslations: boolean;
}

export interface DefaultLanguageChangeResult {
  previousDefault: string;
  currentDefault: string;
  backupUpserts: number;
  restoredValues: number;
  preservedValues: number;
  preservedMissing: MissingTranslationDto[];
}

export interface MissingTranslationDto {
  entity: string;
  element: number;
  column: string;
  currentValue: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService extends RestService<Language> {
  private http: HttpClient;
  private readonly languagesToUseSubject = new BehaviorSubject<Language[]>(
    sortByLanguageOrder(config.languagesToUse || [])
  );

  /** Enabled languages for selectors (toolbar, login, translation dialogs). */
  readonly languagesToUse$ = this.languagesToUseSubject.asObservable();

  /** constructor */
  constructor(injector: Injector) {
    super(Language, "languages", injector);
    this.http = injector.get(HttpClient);
  }

  /**
   * Updates app config, localStorage, and notifies language selectors.
   */
  applyLanguagesToUse(languages: Language[]): Language[] {
    const enabled = filterEnabledLanguages(sortByLanguageOrder(languages));
    config.languagesToUse = enabled;
    config.languagesObjects = {};
    enabled.forEach((language) => {
      config.languagesObjects[language.shortname] = language;
    });
    localStorage.setItem('languages', JSON.stringify(enabled));
    this.languagesToUseSubject.next(enabled);
    return enabled;
  }

  /**
   * Reloads enabled languages into app config / localStorage (used by toolbar and translation dialogs).
   */
  refreshLanguagesToUse(): Observable<Language[]> {
    return this.fetchAllItems().pipe(
      map((languages) => this.applyLanguagesToUse(languages))
    );
  }

  /**
   * Get the current default language shortname from backend configuration
   */
  getCurrentDefaultLanguage(): Observable<string> {
    return new Observable(observer => {
      this.http.get<{ value: string }>(`${this.resourceService.getResourceUrl()}/configuration-parameters/search/findByName?name=language.default`)
        .subscribe({
          next: (config) => {
            observer.next(config.value);
            observer.complete();
          },
          error: (err) => observer.error(err)
        });
    });
  }

  /**
   * Preview the impact of changing the default language
   */
  previewDefaultLanguageChange(from: string, to: string): Observable<DefaultLanguageChangePreview> {
    return this.http.post<DefaultLanguageChangePreview>(
      `${this.resourceService.getResourceUrl()}/language-default/change-preview`,
      { from, to },
      {context: new HttpContext().set(SUPPRESS_HTTP_NOTIFICATION, true)}
    );
  }

  /**
   * Apply a default language change
   */
  applyDefaultLanguageChange(request: DefaultLanguageChangeRequest): Observable<DefaultLanguageChangeResult> {
    return this.http.post<DefaultLanguageChangeResult>(
      `${this.resourceService.getResourceUrl()}/language-default/change`,
      request,
      {context: new HttpContext().set(SUPPRESS_HTTP_NOTIFICATION, true)}
    );
  }
}
