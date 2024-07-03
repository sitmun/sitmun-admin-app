import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { ExternalConfigurationService } from './ExternalConfigurationService';

import { SitmunFrontendGuiModule } from './frontend-gui/src/lib/public_api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { APP_ROUTING } from './app-routes';


//interceptors
import { MessagesInterceptor } from './interceptors/messages.interceptor';
import { AuthInterceptor, AuthExpiredInterceptor, CapabilitiesService } from './frontend-core/src/lib/public_api';

//i18n
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeCa from '@angular/common/locales/ca';
registerLocaleData(localeEs, 'es-ES');
registerLocaleData(localeCa, 'ca-ES');

//Rutes
import { APP_ROUTES } from './app-routes';

//Components
import { ConnectionComponent } from './components/connection/connection.component';
import { ServiceComponent } from './components/service/service.component';
import { LayersComponent } from './components/layers/layers.component';
import { TreesComponent } from './components/trees/trees.component';
import { BackgroundLayersComponent } from './components/background-layers/background-layers.component';
import { LayersPermitsComponent } from './components/layers-permits/layers-permits.component';
import { TerritoryComponent } from './components/territory/territory.component';
import { UserComponent } from './components/user/user.component';
import { ApplicationComponent } from './components/application/application.component';
import { RoleComponent } from './components/role/role.component';
import { ToolbarComponent } from './components/shared/toolbar/toolbar.component';
import { SideMenuComponent } from './components/shared/side-menu/side-menu.component';
import { TasksDownloadComponent } from './components/tasks-download/tasks-download.component';
import { TasksDocumentComponent } from './components/tasks-document/tasks-document.component';
import { TasksQueryComponent } from './components/tasks-query/tasks-query.component';
import { TasksMoreInfoComponent } from './components/tasks-more-info/tasks-more-info.component';
import { TasksLocatorComponent } from './components/tasks-locator/tasks-locator.component';
import { TasksReportComponent } from './components/tasks-report/tasks-report.component';
import { TasksEditionComponent } from './components/tasks-edition/tasks-edition.component';
import { TasksThematicComponent } from './components/tasks-thematic/tasks-thematic.component';
import { TasksExtractionFmeComponent } from './components/tasks-extraction-fme/tasks-extraction-fme.component';
import { ConnectionFormComponent } from './components/connection/connection-form/connection-form.component';
import { RoleFormComponent } from './components/role/role-form/role-form.component';
import { UserFormComponent } from './components/user/user-form/user-form.component';
import { TerritoryFormComponent } from './components/territory/territory-form/territory-form.component';
import { ServiceFormComponent } from './components/service/service-form/service-form.component';
import { ApplicationFormComponent } from './components/application/application-form/application-form.component';
import { TreesFormComponent } from './components/trees/trees-form/trees-form.component';
import { BackgroundLayersFormComponent } from './components/background-layers/background-layers-form/background-layers-form.component';
import { LayersPermitsFormComponent } from './components/layers-permits/layers-permits-form/layers-permits-form.component';
import { LayersFormComponent } from './components/layers/layers-form/layers-form.component';
import { TaskGroupComponent } from './components/task-group/task-group.component';
import { TaskGroupFormComponent } from './components/task-group/task-group-form/task-group-form.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { LoginComponent } from './components/login/login.component';

//Services 
import {
  AngularHalModule,
  BackgroundService,
  CartographyGroupService,
  CartographyService,
  ConnectionService,
  TaskGroupService,
  TaskService,
  TranslationService,
  LanguageService,
  TerritoryService,
  UserConfigurationService,
  RoleService,
  UserService,
  TreeService,
  LoginService,
  CodeListService,
  AuthService,
  AccountService,
  Principal,
  ServiceService,
  ApplicationService,
  CartographyAvailabilityService,
  ServiceParameterService,
  TaskUIService,
  ApplicationParameterService,
  CartographyParameterService,
  CartographySpatialSelectionParameterService,
  CartographyStyleService,
  TaskAvailabilityService,
  UserPositionService,
  ApplicationBackgroundService,
  TaskParameterService,
  TerritoryTypeService,
  CartographyFilterService,
  ConfigurationParametersService,
  DashboardService,
  TreeNodeService,
  TaskTypeService,
} from './frontend-core/src/lib/public_api';
import { UtilsService } from './services/utils.service';
import { SidenavService } from './services/sidenav.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { NgTemplateNameDirective } from './components/task-form/ng-template-name.directive';
import { TasksEditionCartographyTableComponent } from './components/tasks-edition-cartography-table/tasks-edition-cartography-table.component';
import { TasksEditionDataTableComponent } from './components/tasks-edition-data-table/tasks-edition-data-table.component';
import { TasksEditionRelationTableComponent } from './components/tasks-edition-relation-table/tasks-edition-relation-table.component';
import { TasksEditionSearchViewComponent } from './components/tasks-edition-search-view/tasks-edition-search-view.component';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';



@NgModule({
  declarations: [
    AppComponent,
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
    TasksDownloadComponent,
    TasksDocumentComponent,
    TasksQueryComponent,
    TasksMoreInfoComponent,
    TasksLocatorComponent,
    TasksReportComponent,
    TasksEditionComponent,
    TasksThematicComponent,
    TasksExtractionFmeComponent,
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
    TasksComponent,
    LoginComponent,
    DashboardComponent,
    TaskFormComponent,
    NgTemplateNameDirective,
    TasksEditionCartographyTableComponent,
    TasksEditionDataTableComponent,
    TasksEditionRelationTableComponent,
    TasksEditionSearchViewComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AngularHalModule,
    SitmunFrontendGuiModule,
    MaterialModule,
    RouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http, './assets/i18n/', '.json');
        },
        deps: [HttpClient]
      }
    }),
    APP_ROUTING,
    BrowserAnimationsModule
  ],
  providers: [SidenavService, UtilsService, CanDeactivateGuard,
    { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
    { provide: LOCALE_ID, useValue: 'es-ES' },
    RoleService, ConnectionService, UserService, TerritoryService, ServiceService,
    ApplicationService, TreeService, TranslationService, TerritoryTypeService, TaskAvailabilityService, BackgroundService, CartographyService, CartographyGroupService,
    TaskGroupService, DashboardService, TaskService, UserConfigurationService, CodeListService, LoginService, AuthService, ConfigurationParametersService,
    Principal, UserPositionService, AccountService,CartographyAvailabilityService,ServiceParameterService,ApplicationParameterService,
    CartographyParameterService, CartographySpatialSelectionParameterService, CartographyStyleService, CapabilitiesService, TaskTypeService, LanguageService, CartographyFilterService,  TaskUIService, TaskParameterService, ApplicationBackgroundService, TreeNodeService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MessagesInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthExpiredInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
