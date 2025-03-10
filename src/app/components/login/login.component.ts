import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Language, LanguageService, LoginService} from '@app/frontend-core/src/lib/public_api';

import {config} from '@config';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {UntypedFormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import {UtilsService} from '@app/services/utils.service';

/** Login component*/
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  langs: any[] = [];

  /** bad credentials message*/
  badCredentials: string;

  /** translate service*/
  translate;

  languagesLoaded = false;

  /** form */
  form: UntypedFormGroup;
  lang: Language;

  /** constructor */
  constructor(private fb: UntypedFormBuilder,
              private loginService: LoginService,
              private languageService: LanguageService,
              private router: Router,
              private utils: UtilsService,
              private trans: TranslateService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.translate = trans;
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      lang: ['', Validators.required],
    });
  }

  identifyDefaultLanguage(): Language {
    const navigatorLang = window.navigator.language.toLowerCase();
    const defaultLang : string = this.langs.find((lang: Language) =>
      lang.shortname.toLowerCase() === navigatorLang
      ||
      navigatorLang.startsWith(lang.shortname.toLowerCase()+"-")
    )?.shortname || config.defaultLang;
    return this.langs.find((lang: Language) => lang.shortname === defaultLang)
  }

  ngOnInit(): void {
    this.loadLanguages().then((langs : Language[]) => {
      this.langs = langs;
      this.languagesLoaded = true;
    }).then(() => {
      const defaultLang = this.identifyDefaultLanguage();
      this.translate.use(defaultLang.shortname);
      this.lang = defaultLang;
      this.form.patchValue({lang: defaultLang});
      this.changeDetectorRef.detectChanges();
    }).catch((err) => {
      const defaultLang = this.identifyDefaultLanguage();
      this.translate.use(defaultLang.shortname);
      this.utils.showErrorMessage(err);
    });
  }

  /** login action */
  login() {
    const val = this.form.value;
    if (val.username && val.password) {
      this.loginService.login(val).then(() => {
        const langCode = this.form.value.lang.shortname;
        this.translate.use(langCode);
        this.translate.setDefaultLang(langCode);
        localStorage.setItem('lang', langCode);
        void this.router.navigateByUrl('/');
      }, () => {
        const langCode = this.form.value.lang.shortname;
        this.translate.use(langCode);
        this.translate.setDefaultLang(langCode);
        localStorage.setItem('lang', langCode);
        this.badCredentials = 'ERROR';
      });

    }
  }

  private loadLanguages(): Promise<Language[]> {
    return this.languageService.getAll().toPromise().then((langs) => {
      if (this.trans.currentLang) {
        return langs.sort((a, b) => this.trans.instant('lang.' + a.name).localeCompare(this.trans.instant('lang.' + b.name)));
      } else {
        return langs.sort((a, b) => a.name.localeCompare(b.name));
      }
    })
  }

  compareLang(o1: Language, o2: Language) {
    console.log("compare lang", o1.shortname === o2.shortname)
    return o1 && o2 && o1.shortname === o2.shortname
  };
}
