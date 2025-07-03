import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Language, LanguageService} from '@app/domain';
import {LoginService} from '@app/core/auth/login.service';

import {config} from '@config';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {UtilsService} from '@app/services/utils.service';
import {LoggerService} from '@app/services/logger.service';
import {firstValueFrom} from "rxjs";

/** Login component*/
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  langs: Language[] = [];

  /** bad credentials message*/
  badCredentials: string;

  /** translate service*/
  translate;

  loadedData = false;

  /** form */
  form: UntypedFormGroup;

  /** constructor */
  constructor(private fb: UntypedFormBuilder,
              private loginService: LoginService,
              private languageService: LanguageService,
              private router: Router,
              private utils: UtilsService,
              private trans: TranslateService,
              private changeDetectorRef: ChangeDetectorRef,
              private loggerService: LoggerService) {
    this.translate = trans;
  }

  ngOnInit(): void {
    this.loadLanguages().then((langs : Language[]) => {
      this.langs = langs;

      // Get stored language or browser language
      const storedLang = localStorage.getItem('lang');

      let defaultLang: Language;

      if (storedLang) {
        defaultLang = this.langs.find(lang => lang.shortname === storedLang);
      }

      if (!defaultLang) {
        defaultLang = this.identifyDefaultLanguage();
      }

      // Ensure we have a valid language
      if (!defaultLang && this.langs.length > 0) {
        defaultLang = this.langs[0];
      }

      if (defaultLang) {
        // Set the language in the translation service
        this.translate.use(defaultLang.shortname).subscribe(() => {
          this.translate.setDefaultLang(defaultLang.shortname);

          // Initialize form with default language
          this.form = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            lang: [defaultLang.shortname, Validators.required],
          });

          // Mark data as loaded
          this.loadedData = true;
        });
      } else {
        this.loggerService.error('No valid language found!');
      }
    }).catch((err) => {
      this.utils.showErrorMessage(err);
    });
  }

  private loadLanguages(): Promise<Language[]> {
    return firstValueFrom(this.languageService.getAll()).then((langs) => {
      if (!langs || langs.length === 0) {
        throw new Error('No languages available');
      }

      // Sort languages by name
      return langs.sort((a, b) => {
        try {
          const nameA = this.trans.instant('lang.' + a.shortname);
          const nameB = this.trans.instant('lang.' + b.shortname);
          return nameA.localeCompare(nameB);
        } catch (e) {
          return a.shortname.localeCompare(b.shortname);
        }
      });
    });
  }

  /** login action */
  login() {
    const val = this.form.value;
    if (val.username && val.password) {
      this.loginService.login(val).then(() => {
        const langCode = val.lang;
        this.translate.use(langCode);
        this.translate.setDefaultLang(langCode);
        localStorage.setItem('lang', langCode);
        void this.router.navigateByUrl('/');
      }, () => {
        const langCode = val.lang;
        this.translate.use(langCode);
        this.translate.setDefaultLang(langCode);
        localStorage.setItem('lang', langCode);
        this.badCredentials = 'ERROR';
      });
    }
  }

  identifyDefaultLanguage(): Language {
    if (!this.langs || this.langs.length === 0) {
      this.loggerService.warn('No languages available for identification');
      return null;
    }

    const navigatorLang = window.navigator.language.toLowerCase();

    // Remove region codes (e.g., 'en-US' -> 'en', 'oc-aranes' -> 'oc-aranes')
    const baseLang = navigatorLang.replace(/-[A-Z]+$/, '');

    // Try to find exact match first
    let defaultLang = this.langs.find((lang: Language) =>
      lang.shortname.toLowerCase() === baseLang
    );

    // If no exact match, try to find partial match
    if (!defaultLang) {
      defaultLang = this.langs.find((lang: Language) =>
        lang.shortname.toLowerCase().startsWith(baseLang)
      );
    }

    // If still no match, use config default
    if (!defaultLang && config.defaultLang) {
      defaultLang = this.langs.find((lang: Language) =>
        lang.shortname === config.defaultLang
      );
    }

    // If all else fails, use first language
    return defaultLang ?? this.langs[0];
  }

  compareLang(o1: string, o2: string): boolean {
    if (!o1 || !o2) return false;
    return o1 === o2;
  }
}
