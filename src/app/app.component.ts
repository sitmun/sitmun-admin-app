import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService, ConfigurationParametersService } from '@app/domain';
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
    /** Auth service */public authService: AuthService,
    /** Language service */public languageService: LanguageService,
    /** Configuration parameters service */public configurationParametersService: ConfigurationParametersService
    ) {
    this.translate = trans;

    if(localStorage.getItem('lang') != undefined)
    {
      this.translate.setDefaultLang(localStorage.getItem('lang'));
      this.translate.use(localStorage.getItem('lang'));
    }

    // Listen for browser language changes
    window.addEventListener('languagechange', () => {
      const navigatorLang = window.navigator.language.toLowerCase();
      const baseLang = navigatorLang.replace(/-[A-Z]+$/, '');
      const defaultLang = config.languagesToUse.find(lang => 
        lang.shortname.toLowerCase() === baseLang
      )?.shortname || config.defaultLang;
      
      this.translate.use(defaultLang);
      this.translate.setDefaultLang(defaultLang);
      localStorage.setItem('lang', defaultLang);
    });
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

  /** On component init, get logged user account*/
  ngOnInit() {

    if(this.authService.getToken()){
      this.principal.identity().then((account) => {
        this.currentAccount = account;
      });
    }
    this.loadConfiguration();
    this.loadLanguages();
  }

     //Load from server all languages that we will use
     async loadLanguages(){
      await this.languageService.getAll().subscribe(
        async result => {
          result.sort((a,b) => a.shortname.localeCompare(b.shortname));
          result.forEach(language => {
            config.languagesObjects[language.shortname]=language;
          });
          if(! localStorage.getItem(('languages'))){
            localStorage.setItem('languages', JSON.stringify(result));
          }

          config.languagesToUse = result;
        }
      )
    }

    async loadConfiguration(){

        this.configurationParametersService.getAll().subscribe(
          async result => {
              let defaultLang = result.find(element => element.name == 'language.default' )
              if(defaultLang){
                config.defaultLang = defaultLang.value;

                if(!localStorage.getItem('lang')){
                  this.translate.setDefaultLang(defaultLang.value);
                  this.translate.use(defaultLang.value);
                }

              }

            
          }
        )
    }

}

