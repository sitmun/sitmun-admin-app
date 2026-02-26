import {Component, effect, ElementRef, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {LoginService} from '@app/core/auth/login.service';
import {Language} from '@app/domain';
import {AppConfigService} from '@app/services/app-config.service';
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
    private readonly appConfigService: AppConfigService,
    private readonly elementRef: ElementRef
  ) {
    this.loginService.getEnabledAuthMethods().subscribe((res) => {
      if (Array.isArray(res)) {
        const map = new Map<string, AuthProvider[]>();
        res.forEach((item) => {
          map.set(item.id, item.providers ?? []);
        });
        this.loginMethods.set(map);
      }
    });

    effect(() => {
      this.alternativeLoginMethods = this.loginMethods().get('oidc') ?? [];
    });
  }

  ngOnInit() {
    // Initialize the form with a default language
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      lang: [this.translateService.getDefaultLang(), Validators.required],
    });
    // Sort languages alphabetically by name
    this.languages = (config.languagesToUse || []).sort((a, b) =>
      (a.name || '').localeCompare(b.name || '')
    );
    // Subscribe to language changes to update translations immediately
    this.form.get('lang')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((langCode: string) => {
        if (langCode) {
          this.translateService.use(langCode);
        }
      });
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
        
        // Proactively hide the login component before navigation
        // This ensures the overlay disappears even if ngOnDestroy is delayed
        this.hideComponent();
        
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

  initAuth(provider: string): void {
    this.loginService.initOidcLogin(provider);
  }

  /**
   * Get language icon path from AppConfigService
   */
  getLanguageIcon(shortname: string): string {
    return this.appConfigService.getLanguageIcon(shortname);
  }

  /**
   * Get language icon name for mat-icon svgIcon attribute
   * Converts path like "assets/flags/spain.svg" to "flag-spain"
   */
  getLanguageIconName(shortname: string): string {
    const iconPath = this.appConfigService.getLanguageIcon(shortname);
    if (!iconPath) return '';

    // Extract filename from path: "assets/flags/spain.svg" -> "spain"
    const filename = iconPath.split('/').pop()?.replace('.svg', '') || '';
    return filename ? `flag-${filename}` : '';
  }

  /**
   * Check if language has an icon
   */
  hasLanguageIcon(shortname: string): boolean {
    return !!this.getLanguageIcon(shortname);
  }

  /**
   * Get the selected language object
   */
  getSelectedLanguage(): Language | undefined {
    const selectedLangCode = this.form?.get('lang')?.value;
    return this.languages.find(lang => lang.shortname === selectedLangCode);
  }

  /**
   * Forcefully hide the component by manipulating the host element
   * Called both on successful login and in ngOnDestroy for maximum reliability
   */
  private hideComponent(): void {
    const hostElement = this.elementRef.nativeElement as HTMLElement;
    if (hostElement) {
      hostElement.style.display = 'none';
      hostElement.style.visibility = 'hidden';
      hostElement.style.opacity = '0';
      hostElement.style.pointerEvents = 'none';
      hostElement.style.position = 'absolute';
      hostElement.style.width = '0';
      hostElement.style.height = '0';
      hostElement.style.overflow = 'hidden';
      hostElement.style.zIndex = '-9999';
    }
  }

  /** cleanup subscriptions and forcefully hide component to handle browser extension interference */
  ngOnDestroy(): void {
    // Forcefully hide the component
    this.hideComponent();
    
    this.destroy$.next();
    this.destroy$.complete();
  }
}
