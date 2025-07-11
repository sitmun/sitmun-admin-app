import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {SitmunFrontendGuiModule} from '@app/frontend-gui/src/lib/public_api';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material-module';
import {APP_ROUTING} from './app-routes';
import {MAT_TABS_CONFIG} from '@angular/material/tabs';

// Import the Core and Domain modules
import {CoreModule} from '@app/core';
//Services
import {
  ApplicationBackgroundService,
  ApplicationParameterService,
  ApplicationService,
  BackgroundService,
  CapabilitiesService,
  CartographyAvailabilityService,
  CartographyFilterService,
  CartographyGroupService,
  CartographyParameterService,
  CartographyService,
  CartographySpatialSelectionParameterService,
  CartographyStyleService,
  CodeListService,
  ConfigurationParametersService,
  ConnectionService,
  DashboardService,
  DomainModule,
  LanguageService,
  RoleService,
  ServiceParameterService,
  ServiceService,
  TaskAvailabilityService,
  TaskGroupService,
  TaskService,
  TaskTypeService,
  TaskUIService,
  TerritoryService,
  TerritoryTypeService,
  TranslationService,
  TreeNodeService,
  TreeService,
  UserConfigurationService,
  UserPositionService,
  UserService
} from '@app/domain';
import {ServicesModule} from './services/services.module';
import {ExternalService, HalModule, ResourceService} from '@app/core/hal';
import {LoggerService} from './services/logger.service';
import {AppStateService} from './services/app-state.service';

//i18n
import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {CustomMissingTranslationHandler} from './services/missing-translation.handler';
import {TranslationMonitorService} from './services/translation-monitor.service';
import {TranslationDebugComponent} from './components/shared/translation-debug/translation-debug.component';
import {config} from '@config';
//Components
import {ConnectionComponent} from '@app/components/connection/connection.component';
import {ServiceComponent} from '@app/components/service/service.component';
import {LayersComponent} from '@app/components/layers/layers.component';
import {TreesComponent} from '@app/components/trees/trees.component';
import {BackgroundLayersComponent} from '@app/components/background-layers/background-layers.component';
import {LayersPermitsComponent} from '@app/components/layers-permits/layers-permits.component';
import {TerritoryComponent} from '@app/components/territory/territory.component';
import {UserComponent} from '@app/components/user/user.component';
import {ApplicationComponent} from '@app/components/application/application.component';
import {RoleComponent} from '@app/components/role/role.component';
import {ToolbarComponent} from '@app/components/shared/toolbar/toolbar.component';
import {SideMenuComponent} from '@app/components/shared/side-menu/side-menu.component';
import {UserInfoComponent} from '@app/components/shared/user-info/user-info.component';
import {ConnectionFormComponent} from '@app/components/connection/connection-form/connection-form.component';
import {RoleFormComponent} from '@app/components/role/role-form/role-form.component';
import {UserFormComponent} from '@app/components/user/user-form/user-form.component';
import {TerritoryFormComponent} from '@app/components/territory/territory-form/territory-form.component';
import {ServiceFormComponent} from '@app/components/service/service-form/service-form.component';
import {UrlInputDirective} from '@app/components/service/service-form/url-input.directive';
import {ApplicationFormComponent} from '@app/components/application/application-form/application-form.component';
import {TreesFormComponent} from '@app/components/trees/trees-form/trees-form.component';
import {
  BackgroundLayersFormComponent
} from '@app/components/background-layers/background-layers-form/background-layers-form.component';
import {
  LayersPermitsFormComponent
} from '@app/components/layers-permits/layers-permits-form/layers-permits-form.component';
import {LayersFormComponent} from '@app/components/layers/layers-form/layers-form.component';
import {TaskGroupComponent} from '@app/components/task-group/task-group.component';
import {TaskGroupFormComponent} from '@app/components/task-group/task-group-form/task-group-form.component';

import {TasksBasicComponent} from '@app/components/tasks-basic/tasks-basic.component';
import {TaskBasicFormComponent} from '@app/components/tasks-basic/task-form/task-basic-form.component';
import {TasksQueryComponent} from "@app/components/tasks-query/tasks-query.component";
import {TaskQueryFormComponent} from "@app/components/tasks-query/task-form/task-query-form.component";
import {TaskEditFormComponent} from '@app/components/tasks-edit/task-form/task-edit-form.component';
import {TasksEditComponent} from '@app/components/tasks-edit/tasks-edit.component';

import {LoginComponent} from '@app/components/login/login.component';
import {LogLevelControlComponent} from '@app/components/shared/log-level-control/log-level-control.component';
import {FormToolbarComponent} from '@app/components/shared/form-toolbar/form-toolbar.component';
import {DashboardComponent} from '@app/components/dashboard/dashboard.component';

import {CharacterCountPipe} from '@app/components/shared/character-counter-hint/character-count.pipe';
import {ExternalConfigurationService} from '@app/core/config/external-configuration.service';
import {EntityListComponent} from '@app/components/shared/entity-list';

import {BaseFormComponent} from "@app/components/base-form.component";
import {DataTablesRegistry} from "@app/components/data-tables.util";
import {Resource} from "@app/core/hal/resource/resource.model";
import {ErrorPageComponent} from "@app/components/error-page/error-page.component";
import {MessagesInterceptorStateService} from './core/interceptors/messages.interceptor';


// APP_INITIALIZER factory functions
export function initializeLanguages(
  languageService: LanguageService,
  translateService: TranslateService,
  loggerService: LoggerService,
  appStateService: AppStateService,
  messagesInterceptorState: MessagesInterceptorStateService
) {
  return () => {
    // Initialize static logger services

    messagesInterceptorState.disable();
    DataTablesRegistry.setLoggerService(loggerService);
    Resource.setLoggerService(loggerService);

    return firstValueFrom(languageService.getAll()).then(languages => {
      // Sort languages
      languages.sort((a, b) => a.shortname.localeCompare(b.shortname));

      // Store in config
      config.languagesToUse = languages;
      languages.forEach(language => {
        config.languagesObjects[language.shortname] = language;
      });

      // Store in localStorage if not exists
      if (!localStorage.getItem('languages')) {
        localStorage.setItem('languages', JSON.stringify(languages));
      }

      // Set default language
      const defaultLang = getDefaultLanguage(languages);
      translateService.setDefaultLang(defaultLang);
      messagesInterceptorState.enable();

      // Load translations for the default language
      return firstValueFrom(translateService.use(defaultLang));
    }).catch(error => {
      // Create a proper error object for initialization errors
      const initError = {
        message: 'Failed to initialize languages',
        originalError: error,
        source: 'languages',
        timestamp: new Date().toISOString()
      };
      appStateService.setInitializationError(initError, 'languages');
      messagesInterceptorState.enable();

      const browserLang = translateService.getBrowserLang();
      translateService.setDefaultLang(browserLang);
      return firstValueFrom(translateService.use(browserLang));
    });
  };
}

export function initializeConfiguration(
  configurationService: ConfigurationParametersService,
  translateService: TranslateService,
  loggerService: LoggerService,
  appStateService: AppStateService,
  messagesInterceptorState: MessagesInterceptorStateService
) {
  return () => {
    messagesInterceptorState.disable();
    return firstValueFrom(configurationService.getAll()).then(configParams => {
      const defaultLang = configParams.find(element => element.name === 'language.default');

      if (defaultLang) {
        config.defaultLang = defaultLang.value;

        // Set language if not already set in localStorage
        if (!localStorage.getItem('lang')) {
          translateService.setDefaultLang(defaultLang.value);
          translateService.use(defaultLang.value);
        }
      }

      loggerService.info(`Configuration initialized: ${configParams.length} parameters loaded`);
      messagesInterceptorState.enable();
    }).catch(error => {
      // Create a proper error object for initialization errors
      const initError = {
        message: 'Failed to initialize configuration',
        originalError: error,
        source: 'configuration',
        timestamp: new Date().toISOString()
      };
      appStateService.setInitializationError(initError, 'configuration');
      messagesInterceptorState.enable();
    });
  };
}

// Helper function to get default language
function getDefaultLanguage(languages: any[]): string {
  // Check localStorage first
  const storedLang = localStorage.getItem('lang');
  if (storedLang && languages.find(lang => lang.shortname === storedLang)) {
    return storedLang;
  }

  // Check browser language
  const navigatorLang = window.navigator.language.toLowerCase();
  const baseLang = navigatorLang.replace(/-[A-Z]+$/, '');
  const browserLang = languages.find(lang =>
    lang.shortname.toLowerCase() === baseLang
  );

  if (browserLang) {
    return browserLang.shortname;
  }

  // Fallback to config default or first language
  return config.defaultLang || (languages.length > 0 ? languages[0].shortname : 'en');
}

@NgModule({
  declarations: [
    BaseFormComponent,
    AppComponent,
    EntityListComponent,
    ErrorPageComponent,
    ConnectionComponent,
    ServiceComponent,
    LayersComponent,
    TreesComponent,
    BackgroundLayersComponent,
    LayersPermitsComponent,
    TerritoryComponent,
    UserComponent,
    ApplicationComponent,
    SideMenuComponent,
    RoleComponent,
    ToolbarComponent,
    TasksBasicComponent,
    TaskBasicFormComponent,
    TasksQueryComponent,
    TaskQueryFormComponent,
    ConnectionFormComponent,
    RoleFormComponent,
    UserFormComponent,
    TerritoryFormComponent,
    ServiceFormComponent,
    ApplicationFormComponent,
    TreesFormComponent,
    BackgroundLayersFormComponent,
    LayersPermitsFormComponent,
    LayersFormComponent,
    TaskGroupComponent,
    TaskGroupFormComponent,
    LoginComponent,
    DashboardComponent,
    LogLevelControlComponent,
    UserInfoComponent,
    FormToolbarComponent,
    CharacterCountPipe,
    TranslationDebugComponent,
    UrlInputDirective,
    TaskEditFormComponent,
    TasksEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule.forRoot(),
    DomainModule.forRoot(),
    ServicesModule,
    SitmunFrontendGuiModule,
    MaterialModule,
    RouterModule,
    HalModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http, './assets/i18n/', '.json');
        },
        deps: [HttpClient]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: CustomMissingTranslationHandler
      }
    }),
    APP_ROUTING,
    BrowserAnimationsModule,
    CoreModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
    { provide: MAT_TABS_CONFIG, useValue: { animationDuration: '0ms' } },

    // APP_INITIALIZER providers
    {
      provide: APP_INITIALIZER,
      useFactory: initializeLanguages,
      deps: [LanguageService, TranslateService, LoggerService, AppStateService, MessagesInterceptorStateService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeConfiguration,
      deps: [ConfigurationParametersService, TranslateService, LoggerService, AppStateService, MessagesInterceptorStateService],
      multi: true
    },
    ResourceService,
    ExternalService,
    RoleService,
    ConnectionService,
    UserService,
    TerritoryService,
    ServiceService,
    ApplicationService,
    TreeService,
    TranslationService,
    TerritoryTypeService,
    TaskAvailabilityService,
    BackgroundService,
    CartographyService,
    CartographyGroupService,
    TaskGroupService,
    DashboardService,
    TaskService,
    UserConfigurationService,
    CodeListService,
    ConfigurationParametersService,
    CartographyAvailabilityService,
    ServiceParameterService,
    ApplicationParameterService,
    CartographyParameterService,
    CartographySpatialSelectionParameterService,
    CartographyStyleService,
    CapabilitiesService,
    TaskTypeService,
    LanguageService,
    CartographyFilterService,
    TaskUIService,
    ApplicationBackgroundService,
    TreeNodeService,
    UserPositionService,
    CustomMissingTranslationHandler,
    TranslationMonitorService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
