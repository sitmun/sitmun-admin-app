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
import {TaskFormComponent} from '@app/components/task-form/task-form.component';
import {TasksEditionComponent} from '@app/components/tasks-edition/tasks-edition.component';
import {
  TasksEditionRelationTableComponent
} from '@app/components/tasks-edition-relation-table/tasks-edition-relation-table.component';
import {TasksDocumentComponent} from '@app/components/tasks-document/tasks-document.component';
import {TasksExtractionFmeComponent} from '@app/components/tasks-extraction-fme/tasks-extraction-fme.component';
import {TasksLocatorComponent} from '@app/components/tasks-locator/tasks-locator.component';
import {
  TasksEditionDataTableComponent
} from '@app/components/tasks-edition-data-table/tasks-edition-data-table.component';
import {
  TasksEditionCartographyTableComponent
} from '@app/components/tasks-edition-cartography-table/tasks-edition-cartography-table.component';
import {TasksThematicComponent} from '@app/components/tasks-thematic/tasks-thematic.component';
import {
  TasksEditionSearchViewComponent
} from '@app/components/tasks-edition-search-view/tasks-edition-search-view.component';
import {TasksDownloadComponent} from '@app/components/tasks-download/tasks-download.component';
import {TasksReportComponent} from '@app/components/tasks-report/tasks-report.component';
import {TasksMoreInfoComponent} from '@app/components/tasks-more-info/tasks-more-info.component';

import {LoginComponent} from '@app/components/login/login.component';
import {LogLevelControlComponent} from '@app/components/shared/log-level-control/log-level-control.component';
import {FormToolbarComponent} from '@app/components/shared/form-toolbar/form-toolbar.component';
import {DashboardComponent} from '@app/components/dashboard/dashboard.component';
import {NgTemplateNameDirective} from '@app/components/task-form/ng-template-name.directive';
import {CharacterCountPipe} from '@app/components/shared/character-counter-hint/character-count.pipe';
import {ExternalConfigurationService} from '@app/core/config/external-configuration.service';
import {EntityListComponent} from '@app/components/shared/entity-list';

import {BaseFormComponent} from "@app/components/base-form.component";
import {DataTablesRegistry} from "@app/components/data-tables.util";
import {Resource} from "@app/core/hal/resource/resource.model";


// APP_INITIALIZER factory functions
export function initializeLanguages(
  languageService: LanguageService,
  translateService: TranslateService,
  loggerService: LoggerService
) {
  return () => {
    // Initialize static logger services
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
      translateService.use(defaultLang);

      loggerService.info(`Languages initialized: ${languages.length} languages loaded, default: ${defaultLang}`);
      return languages;
    }).catch(error => {
      loggerService.error('Failed to initialize languages:', error);
      // Fallback to basic configuration
      config.languagesToUse = [];
      config.languagesObjects = {};
      translateService.setDefaultLang('en');
      translateService.use('en');
      throw error;
    });
  };
}

export function initializeConfiguration(
  configurationService: ConfigurationParametersService,
  translateService: TranslateService,
  loggerService: LoggerService
) {
  return () => {
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
      return configParams;
    }).catch(error => {
      loggerService.error('Failed to initialize configuration:', error);
      // Continue without configuration
      return [];
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
    NgTemplateNameDirective,
    LogLevelControlComponent,
    UserInfoComponent,
    FormToolbarComponent,
    CharacterCountPipe,
    TaskFormComponent,
    TasksEditionComponent,
    TasksEditionRelationTableComponent,
    TasksDocumentComponent,
    TasksExtractionFmeComponent,
    TasksLocatorComponent,
    TasksEditionDataTableComponent,
    TasksEditionCartographyTableComponent,
    TasksThematicComponent,
    TasksEditionSearchViewComponent,
    TasksDownloadComponent,
    TasksReportComponent,
    TasksMoreInfoComponent,
    TranslationDebugComponent,
    UrlInputDirective
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
    BrowserAnimationsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
    { provide: MAT_TABS_CONFIG, useValue: { animationDuration: '0ms' } },

    // APP_INITIALIZER providers
    {
      provide: APP_INITIALIZER,
      useFactory: initializeLanguages,
      deps: [LanguageService, TranslateService, LoggerService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeConfiguration,
      deps: [ConfigurationParametersService, TranslateService, LoggerService],
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
    TranslationMonitorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
