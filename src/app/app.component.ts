import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Principal } from '@app/core/auth/principal.service';
import { LoginService } from '@app/core/auth/login.service';
import { AuthService } from '@app/core/auth/auth.service';
import { config } from '@config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  title = 'admin-app';

  /** translate service*/
  translate;

  /** current logged in user account*/
  currentAccount: any;

  isOpen: boolean;
  
  constructor(
    /** Translate service */public trans: TranslateService, 
    /** Identity service */public principal: Principal,
    /** Login service */public loginService: LoginService,
    /** Auth service */public authService: AuthService
  ) {
    this.translate = trans;
  }

  /** On component init, get logged user account*/
  ngOnInit() {
    // Verify that languages are loaded
    if (!config.languagesToUse || config.languagesToUse.length === 0) {
      console.warn('Languages not loaded - APP_INITIALIZER may have failed');
    } else {
      console.log(`App component initialized with ${config.languagesToUse.length} languages available`);
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
      )?.shortname || config.defaultLang || 'en';
      
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

