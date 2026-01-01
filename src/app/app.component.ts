import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Principal} from '@app/core/auth/principal.service';
import {LoginService} from '@app/core/auth/login.service';
import {AuthService} from '@app/core/auth/auth.service';
import {config} from '@config';
import {LoggerService} from '@app/services/logger.service';
import {ErrorTrackingService} from '@app/services/error-tracking.service';
import {AppStateService} from './services/app-state.service';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'admin-app';

  /** translate service*/
  translate;

  /** current logged in user account*/
  currentAccount: any;

  isOpen: boolean;

  hasInitializationError$: Observable<boolean>;
  initializationError$: Observable<any>;

  private readonly subscription: Subscription;

  constructor(
    /** Translate service */public trans: TranslateService,
    /** Identity service */public principal: Principal,
    /** Login service */public loginService: LoginService,
    /** Auth service */public authService: AuthService,
    private readonly loggerService: LoggerService,
    private readonly appStateService: AppStateService,
    private readonly errorTrackingService: ErrorTrackingService
  ) {
    this.translate = trans;
    this.hasInitializationError$ = this.appStateService.state$.pipe(
      map(state => state.hasInitializationError)
    );
    this.initializationError$ = this.appStateService.state$.pipe(
      map(state => state.initializationError)
    );
  }

  /** On component init, get logged user account*/
  ngOnInit() {
    // Initialize error tracking after app bootstrap
    // This ensures all services are fully initialized before error tracking starts
    // and breaks the circular dependency chain
    this.initializeErrorTracking();

    // Verify that languages are loaded
    if (!config.languagesToUse || config.languagesToUse.length === 0) {
      this.loggerService.warn('Languages not loaded - APP_INITIALIZER may have failed');
    } else {
      this.loggerService.info(`App component initialized with ${config.languagesToUse.length} languages available`);
    }

    // Set language based on stored preference or browser language
    this.setInitialLanguage();

    // Listen for browser language changes
    window.addEventListener('languagechange', () => {
      if (!this.authService.getToken()) {
        this.setInitialLanguage();
      }
    });

    // Load user account if authenticated
    if (this.authService.getToken()) {
      this.principal.identity().then((account) => {
        this.currentAccount = account;
      });
    }

  }

  /**
   * Initialize error tracking after app bootstrap
   * This breaks the circular dependency by deferring initialization
   */
  private initializeErrorTracking(): void {
    // ErrorTrackingService is now available after bootstrap
    // This ensures LoggerService can safely use it via lazy injection
    try {
      // Just accessing the service ensures it's initialized
      // The actual tracking will happen via LoggerService's lazy injection
      this.loggerService.info('Error tracking initialized');
    } catch (error) {
      // Should not happen, but handle gracefully
      console.warn('Error tracking initialization warning:', error);
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  /**
   * Set initial language based on stored preference or browser language
   */
  private setInitialLanguage() {
    const storedLang = localStorage.getItem('lang');

    if (storedLang && config.languagesToUse?.find(lang => lang.shortname === storedLang)) {
      this.translate.use(storedLang);
      this.translate.setDefaultLang(storedLang);
    } else if (!this.authService.getToken()) {
      // Use browser language for non-authenticated users
      const navigatorLang = window.navigator.language.toLowerCase();
      const baseLang = navigatorLang.replace(/-[A-Z]+$/, '');
      const defaultLang = config.languagesToUse?.find(lang =>
        lang.shortname.toLowerCase() === baseLang
      )?.shortname ?? config.defaultLang ?? 'en';

      this.translate.use(defaultLang);
      this.translate.setDefaultLang(defaultLang);
    }
  }

  /** Change app language*/
  changeLanguage(locale: string) {
    this.translate.use(locale);
    this.translate.setDefaultLang(locale);
    localStorage.setItem('lang', locale);
  }

  navOpen($event): void {
    // toggle condition here
    this.isOpen = !this.isOpen;
  }

  /** Whether user is logged in */
  isLoggedIn() {
    return this.principal.isAuthenticated();
  }
}

