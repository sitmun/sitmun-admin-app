import {Component, DestroyRef, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';

import {Language, LanguageService} from '@app/domain';
import {LoggerService} from '@app/services/logger.service';
import {toLanguageIsoCode} from '@app/services/language-iso';
import {resolveUiLanguage} from '@app/services/ui-language.resolver';
import {config} from '@config';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    standalone: false
})
export class ToolbarComponent implements OnInit {
  @Output()
    sidenavEvent: EventEmitter<boolean> = new EventEmitter()

  languages: Language[] = [];
  currentShortname = '';

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly router: Router,
    private readonly loggerService: LoggerService,
    private readonly translateService: TranslateService,
    private readonly languageService: LanguageService,
  ) {
  }

  ngOnInit(): void {
    this.languageService.languagesToUse$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((languages) => this.applyLanguages(languages));

    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        this.currentShortname = event.lang;
      });
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

  clickMenu() {
    this.sidenavEvent.emit(true);
  }

  clickLogo(){
    this.router.navigate(['dashboard']).catch((error) => this.loggerService.error("Cannot navigate to the dashboard", error));
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
}
