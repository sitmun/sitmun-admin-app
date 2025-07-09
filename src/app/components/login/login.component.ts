import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Language, LanguageService} from '@app/domain';
import {LoginService} from '@app/core/auth/login.service';

import {config} from '@config';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {UtilsService} from '@app/services/utils.service';
import {LoggerService} from '@app/services/logger.service';
import { firstValueFrom } from 'rxjs';

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

  loadedData = false;

  /** form */
  form: UntypedFormGroup;

  /** constructor */
  constructor(private fb: UntypedFormBuilder,
              private loginService: LoginService,
              private translateService: TranslateService,
              private router: Router,
)
{

}
  ngOnInit() {
          // Initialize form with default language
          this.form = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            lang: [this.translateService.getDefaultLang(), Validators.required],
          });
          this.langs = config.languagesToUse;
          console.log("LoginComponent initializeLanguages", this.langs);
          console.log("LoginComponent initializeLanguages", this.translateService.getDefaultLang());
          this.loadedData = true;
  }

  /** login action */
  login() {
    const val = this.form.value;
    if (val.username && val.password) {
      this.loginService.login(val).then(() => {
        const langCode = val.lang;
        this.translateService.use(langCode);
        this.translateService.setDefaultLang(langCode);
        localStorage.setItem('lang', langCode);
        void this.router.navigateByUrl('/');
      }, () => {
        const langCode = val.lang;
        this.translateService.use(langCode);
        this.translateService.setDefaultLang(langCode);
        localStorage.setItem('lang', langCode);
        this.badCredentials = 'ERROR';
      });
    }
  }

  compareLang(o1: string, o2: string): boolean {
    if (!o1 || !o2) return false;
    return o1 === o2;
  }
}
