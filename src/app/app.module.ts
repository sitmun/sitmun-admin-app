import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { SitmunFrontendGuiModule, DataGridComponent } from '@app/frontend-gui/src/lib/public_api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { APP_ROUTING } from './app-routes';

// Import the Core and Domain modules
import { CoreModule } from '@app/core';
import { DomainModule } from '@app/domain';
import { ServicesModule } from './services/services.module';
import { HalModule } from '@app/core/hal';

//i18n
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeCa from '@angular/common/locales/ca';
registerLocaleData(localeEs, 'es-ES');
registerLocaleData(localeCa, 'ca-ES');

//Components
import { ConnectionComponent } from '@app/components/connection/connection.component';
import { ServiceComponent } from '@app/components/service/service.component';
import { LayersComponent } from '@app/components/layers/layers.component';
import { TreesComponent } from '@app/components/trees/trees.component';
import { BackgroundLayersComponent } from '@app/components/background-layers/background-layers.component';
import { LayersPermitsComponent } from '@app/components/layers-permits/layers-permits.component';
import { TerritoryComponent } from '@app/components/territory/territory.component';
import { UserComponent } from '@app/components/user/user.component';
import { ApplicationComponent } from '@app/components/application/application.component';
import { RoleComponent } from '@app/components/role/role.component';
import { ToolbarComponent } from '@app/components/shared/toolbar/toolbar.component';
import { SideMenuComponent } from '@app/components/shared/side-menu/side-menu.component';
import { UserInfoComponent } from '@app/components/shared/user-info/user-info.component';
import { TasksDownloadComponent } from '@app/components/tasks-download/tasks-download.component';
import { TasksDocumentComponent } from '@app/components/tasks-document/tasks-document.component';
import { TasksQueryComponent } from '@app/components/tasks-query/tasks-query.component';
import { TasksMoreInfoComponent } from '@app/components/tasks-more-info/tasks-more-info.component';
import { TasksLocatorComponent } from '@app/components/tasks-locator/tasks-locator.component';
import { TasksReportComponent } from '@app/components/tasks-report/tasks-report.component';
import { TasksEditionComponent } from '@app/components/tasks-edition/tasks-edition.component';
import { TasksThematicComponent } from '@app/components/tasks-thematic/tasks-thematic.component';
import { TasksExtractionFmeComponent } from '@app/components/tasks-extraction-fme/tasks-extraction-fme.component';
import { ConnectionFormComponent } from '@app/components/connection/connection-form/connection-form.component';
import { RoleFormComponent } from '@app/components/role/role-form/role-form.component';
import { UserFormComponent } from '@app/components/user/user-form/user-form.component';
import { TerritoryFormComponent } from '@app/components/territory/territory-form/territory-form.component';
import { ServiceFormComponent } from '@app/components/service/service-form/service-form.component';
import { ApplicationFormComponent } from '@app/components/application/application-form/application-form.component';
import { TreesFormComponent } from '@app/components/trees/trees-form/trees-form.component';
import { BackgroundLayersFormComponent } from '@app/components/background-layers/background-layers-form/background-layers-form.component';
import { LayersPermitsFormComponent } from '@app/components/layers-permits/layers-permits-form/layers-permits-form.component';
import { LayersFormComponent } from '@app/components/layers/layers-form/layers-form.component';
import { TaskGroupComponent } from '@app/components/task-group/task-group.component';
import { TaskGroupFormComponent } from '@app/components/task-group/task-group-form/task-group-form.component';
import { TasksComponent } from '@app/components/tasks/tasks.component';
import { LoginComponent } from '@app/components/login/login.component';
import { LogLevelControlComponent } from '@app/components/shared/log-level-control/log-level-control.component';
import { FormToolbarComponent } from '@app/components/shared/form-toolbar/form-toolbar.component';
import { DashboardComponent } from '@app/components/dashboard/dashboard.component';
import { TaskFormComponent } from '@app/components/task-form/task-form.component';
import { NgTemplateNameDirective } from '@app/components/task-form/ng-template-name.directive';
import { TasksEditionCartographyTableComponent } from '@app/components/tasks-edition-cartography-table/tasks-edition-cartography-table.component';
import { TasksEditionDataTableComponent } from '@app/components/tasks-edition-data-table/tasks-edition-data-table.component';
import { TasksEditionRelationTableComponent } from '@app/components/tasks-edition-relation-table/tasks-edition-relation-table.component';
import { TasksEditionSearchViewComponent } from '@app/components/tasks-edition-search-view/tasks-edition-search-view.component';
import { CharacterCountPipe } from '@app/components/shared/character-counter-hint/character-count.pipe';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';

//Services
import {
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
  CodeListService,
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
  CapabilitiesService
} from '@app/domain';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ResourceService, ExternalService } from '@app/core/hal';

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
    LogLevelControlComponent,
    UserInfoComponent,
    FormToolbarComponent,
    CharacterCountPipe
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
    DataGridComponent,
    HalModule.forRoot(),
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
    BrowserAnimationsModule,
    MatTabsModule,
    MatTooltipModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
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
    TaskParameterService,
    ApplicationBackgroundService,
    TreeNodeService,
    UserPositionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
