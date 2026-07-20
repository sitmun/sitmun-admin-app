import {Component, effect, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {LoginService} from '@app/core/auth/login.service';
import {Language, LanguageService} from '@app/domain';
import {toLanguageIsoCode} from '@app/services/language-iso';
import {resolveUiLanguage} from '@app/services/ui-language.resolver';
import {config} from '@config';

export interface LoginMethod {
  id: string;
  providers: AuthProvider[];
}

export interface AuthProvider {
  providerName: string;
  displayName: string;
  imagePath: string;
}

/** Login component*/
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent implements OnInit, OnDestroy {

  languages: Language[] = [];
  currentShortname = '';

  /** bad credentials message*/
  badCredentials: string;

  loginMethods: WritableSignal<Map<string, AuthProvider[]>> = signal(
    new Map<string, AuthProvider[]>()
  );

  alternativeLoginMethods: AuthProvider[] = [];

  /** form */
  form: UntypedFormGroup;

  /** default route after successful login */
  private readonly defaultRoute: string = '/dashboard';

  /** destroy subject for cleanup */
  private readonly destroy$ = new Subject<void>();

  /** constructor */
  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly loginService: LoginService,
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly languageService: LanguageService,
  ) {
    effect(() => {
      this.alternativeLoginMethods = this.loginMethods().get('oidc') ?? [];
    });
  }

  ngOnInit() {
    this.loginService.getEnabledAuthMethods()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (Array.isArray(res)) {
          const map = new Map<string, AuthProvider[]>();
          res.forEach((item) => {
            map.set(item.id, item.providers ?? []);
          });
          this.loginMethods.set(map);
        }
      });

    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.languageService.languagesToUse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((languages) => this.applyLanguages(languages));
  }

  isoCode(shortname: string): string {
    return toLanguageIsoCode(shortname || '');
  }

  changeLanguage(shortname: string): void {
    this.currentShortname = shortname;
    this.translateService.use(shortname);
    this.translateService.setDefaultLang(shortname);
    localStorage.setItem('lang', shortname);
  }

  private applyLanguages(languages: Language[]): void {
    this.languages = languages;
    const chosen = resolveUiLanguage({
      stored: this.translateService.currentLang || localStorage.getItem('lang'),
      backendDefault: config.defaultLang,
      availableShortnames: languages.map((language) => language.shortname),
      staticFallback: config.defaultLang || languages[0]?.shortname || 'en',
    });
    if (chosen !== this.currentShortname) {
      this.changeLanguage(chosen);
    } else {
      this.currentShortname = chosen;
    }
  }

  /** login action */
  login() {
    const val = this.form.value;
    if (val.username && val.password) {
      const langCode =
        this.translateService.currentLang ||
        localStorage.getItem('lang') ||
        this.currentShortname;
      this.loginService.login(val).then(() => {
        this.translateService.use(langCode);
        this.translateService.setDefaultLang(langCode);
        localStorage.setItem('lang', langCode);

        void this.router.navigateByUrl(this.defaultRoute);
      }, () => {
        this.translateService.use(langCode);
        this.translateService.setDefaultLang(langCode);
        localStorage.setItem('lang', langCode);
        this.badCredentials = 'ERROR';
      });
    }
  }

  initAuth(provider: string): void {
    this.loginService.initOidcLogin(provider);
  }

  /** cleanup subscriptions */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
