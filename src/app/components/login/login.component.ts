import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Language} from '@app/domain';
import {LoginService} from '@app/core/auth/login.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {config} from '@config';

/** Login component*/
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  languages: Language[] = [];

  /** bad credentials message*/
  badCredentials: string;

  loadedData = false;

  /** form */
  form: UntypedFormGroup;

  /** default route after successful login */
  private readonly defaultRoute: string = '/dashboard';

  /** constructor */
  constructor(private fb: UntypedFormBuilder,
              private loginService: LoginService,
              private translateService: TranslateService,
              private router: Router,
)
{

}
  ngOnInit() {
    // Initialize the form with a default language
          this.form = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            lang: [this.translateService.getDefaultLang(), Validators.required],
          });
    this.languages = config.languagesToUse;
    console.log("LoginComponent initializeLanguages", this.languages);
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
        void this.router.navigateByUrl(this.defaultRoute);
      }, () => {
        const langCode = val.lang;
        this.translateService.use(langCode);
        this.translateService.setDefaultLang(langCode);
        localStorage.setItem('lang', langCode);
        this.badCredentials = 'ERROR';
      });
    }
  }
}
