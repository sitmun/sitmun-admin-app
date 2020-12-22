import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { ExternalConfigurationService } from './ExternalConfigurationService';
import { AngularHalModule, BackgroundService, CartographyGroupService, CartographyService,
   ConnectionService, TaskGroupService, TaskService, TerritoryService, UserConfigurationService } from 'dist/sitmun-frontend-core/';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { APP_ROUTING } from './app-routes';

import { MessagesInterceptor } from './interceptors/messages.interceptor';
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
import { IndexComponent } from './components/index/index.component';
import { RoleComponent } from './components/role/role.component';
import { ToolbarComponent } from './components/shared/toolbar/toolbar.component';
import { SideMenuComponent } from './components/shared/side-menu/side-menu.component';
import { TasksDownloadComponent } from './components/tasks-download/tasks-download.component';
import { TasksDocumentComponent } from './components/tasks-document/tasks-document.component';
import { TasksConsultationComponent } from './components/tasks-consultation/tasks-consultation.component';
import { TasksMoreInfoComponent } from './components/tasks-more-info/tasks-more-info.component';
import { TasksLocatorComponent } from './components/tasks-locator/tasks-locator.component';
import { TasksReportComponent } from './components/tasks-report/tasks-report.component';
import { TasksEditionComponent } from './components/tasks-edition/tasks-edition.component';
import { TasksThematicComponent } from './components/tasks-thematic/tasks-thematic.component';
import { TasksExtractionFmeComponent } from './components/tasks-extraction-fme/tasks-extraction-fme.component';

//Services 
import { SidenavService } from './services/sidenav.service';
import { RoleService } from 'dist/sitmun-frontend-core/';
import { UserService } from 'dist/sitmun-frontend-core/';
import { TreeService } from 'dist/sitmun-frontend-core/';
import { CodeListService } from 'dist/sitmun-frontend-core/';
import { UtilsService } from './services/utils.service';
import { ServiceService } from 'dist/sitmun-frontend-core/';
import { ApplicationService } from 'dist/sitmun-frontend-core/';
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
import { ProvaDialogComponent } from './components/prova-dialog/prova-dialog.component';

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
    IndexComponent,
    SideMenuComponent,
    RoleComponent,
    ToolbarComponent,
    TasksDownloadComponent,
    TasksDocumentComponent,
    TasksConsultationComponent,
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
    ProvaDialogComponent
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
  providers: [SidenavService, UtilsService,
     { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
     { provide: LOCALE_ID, useValue: 'es-ES' },
    RoleService, ConnectionService, UserService, TerritoryService, ServiceService, ApplicationService, TreeService,
    BackgroundService, CartographyService, CartographyGroupService, TaskGroupService, TaskService,UserConfigurationService,CodeListService,
    { provide: HTTP_INTERCEPTORS, useClass: MessagesInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
