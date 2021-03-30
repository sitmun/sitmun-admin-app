import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Principal, LoginService, AuthService, LanguageService } from 'dist/sitmun-frontend-core/';
import { config } from 'src/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
    /** Language service */public languageService: LanguageService
    ) {
    this.translate = trans;

    this.translate.addLangs(['es', 'ca', 'es']);
    let navigatorLang = config.languages.find(element => element.id === window.navigator.language);
    let defaultLang = config.defaultLang;
    if (navigatorLang != undefined) {
      defaultLang = window.navigator.language
    }
    if(localStorage.lang != undefined)
    {
      this.translate.setDefaultLang(localStorage.lang);
      this.translate.use(localStorage.lang);
    }
    else{
      this.translate.setDefaultLang(defaultLang);
      this.translate.use(defaultLang);
    }
    
  }

  /** Change app language*/
  changeLanguage(locale: string) {
    this.translate.use(locale);
  }

  navOpen($event): void {
    // toggle condition here
    this.isOpen = !this.isOpen;
    console.log('$navOpen');
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
    this.loadLanguages();
  }

     //Load from server all languages that we will use
     async loadLanguages(){
      let catalanLanguage = null;
      let spanishLanguage = null;
      let englishLanguage = null;
      this.languageService.getAll().subscribe(
        async result => {
          console.log(result);
          result.forEach(language => {
            if(language.shortname == 'ca')  { config.languagesObjects.catalan=language; }
            if(language.shortname == 'es') { config.languagesObjects.spanish= language }
            if(language.shortname == 'en') { config.languagesObjects.english= language }
            if(language.shortname == 'oc-aranese') { config.languagesObjects.aranese= language }
          });
  
        }
      )
    }

}

