import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ConnectionComponent } from './components/connection/connection.component';
import { ServiceComponent } from './components/service/service.component';
import { LayersComponent } from './components/layers/layers.component';
import { TreesComponent } from './components/trees/trees.component';
import { BackgroundLayersComponent } from './components/background-layers/background-layers.component';
import { LayersPermitsComponent } from './components/layers-permits/layers-permits.component';
import { TerritoryComponent } from './components/territory/territory.component';
import { RoleComponent } from './components/role/role.component';
import { UserComponent } from './components/user/user.component';
import { ApplicationComponent } from './components/application/application.component';
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
import { TaskGroupComponent } from './components/task-group/task-group.component';
import { TaskGroupFormComponent } from './components/task-group/task-group-form/task-group-form.component';
import { LayersFormComponent } from './components/layers/layers-form/layers-form.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TasksEditionCartographyTableComponent } from './components/tasks-edition-cartography-table/tasks-edition-cartography-table.component';
import { TasksEditionDataTableComponent } from './components/tasks-edition-data-table/tasks-edition-data-table.component';
import { TasksEditionRelationTableComponent } from './components/tasks-edition-relation-table/tasks-edition-relation-table.component';
import { TasksEditionSearchViewComponent } from './components/tasks-edition-search-view/tasks-edition-search-view.component';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';

export const APP_ROUTES: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'connection', component: ConnectionComponent, canDeactivate: [CanDeactivateGuard]},
    {path: 'connection/:id/connectionForm', component: ConnectionFormComponent},
    {path: 'connection/:id/connectionForm/:idDuplicate', component: ConnectionFormComponent},
    {path: 'service', component: ServiceComponent, canDeactivate: [CanDeactivateGuard]},
    {path: 'service/:id/serviceForm', component: ServiceFormComponent},
    {path: 'service/:id/serviceForm/:idDuplicate', component: ServiceFormComponent},
    {path: 'layers', component: LayersComponent, canDeactivate: [CanDeactivateGuard]},
    {path: 'layers/:id/layersForm', component: LayersFormComponent},
    {path: 'layers/:id/layersForm/:idDuplicate', component: LayersFormComponent},
    {path: 'trees', component: TreesComponent, canDeactivate: [CanDeactivateGuard]},
    {path: 'trees/:id/treesForm', component: TreesFormComponent},
    {path: 'trees/:id/treesForm/:idDuplicate', component: TreesFormComponent},
    {path: 'backgroundLayers', component: BackgroundLayersComponent, canDeactivate: [CanDeactivateGuard]},
    {path: 'backgroundLayers/:id/backgroundLayersForm', component: BackgroundLayersFormComponent},
    {path: 'backgroundLayers/:id/backgroundLayersForm/:idDuplicate', component: BackgroundLayersFormComponent},
    {path: 'layersPermits', component: LayersPermitsComponent, canDeactivate: [CanDeactivateGuard]},
    {path: 'layersPermits/:id/layersPermitsForm', component: LayersPermitsFormComponent},
    {path: 'layersPermits/:id/layersPermitsForm/:idDuplicate', component: LayersPermitsFormComponent},
    {path: 'tasks', component: TasksComponent, canDeactivate: [CanDeactivateGuard]},
    {path: 'taskForm/:id/:type', component: TaskFormComponent},
    {path: 'taskForm/:id/:type/:idDuplicate', component: TaskFormComponent},
    {path: 'taskGroup', component: TaskGroupComponent, canDeactivate: [CanDeactivateGuard]},
    {path: 'taskGroup/:id/taskGroupForm', component: TaskGroupFormComponent},
    {path: 'taskGroup/:id/taskGroupForm/:idDuplicate', component: TaskGroupFormComponent},
    {path: 'tasksDownload', component: TasksDownloadComponent, canDeactivate: [CanDeactivateGuard]},
    {path: 'tasksDocument', component: TasksDocumentComponent, canDeactivate: [CanDeactivateGuard]},
    {path: 'tasksQuery', component: TasksQueryComponent, canDeactivate: [CanDeactivateGuard]},
    {path: 'tasksMoreInformation', component: TasksMoreInfoComponent, canDeactivate: [CanDeactivateGuard]},
    {path: 'tasksLocator', component: TasksLocatorComponent, canDeactivate: [CanDeactivateGuard]},
    {path: 'tasksReport', component: TasksReportComponent, canDeactivate: [CanDeactivateGuard]},
    {path: 'tasksEdition', component: TasksEditionComponent , canDeactivate: [CanDeactivateGuard]},
    {path: 'tasksEditionCartographyTable', component: TasksEditionCartographyTableComponent, canDeactivate: [CanDeactivateGuard] },
    {path: 'tasksEditionDataTable', component: TasksEditionDataTableComponent , canDeactivate: [CanDeactivateGuard]},
    {path: 'tasksEditionRelationTable', component: TasksEditionRelationTableComponent, canDeactivate: [CanDeactivateGuard] },
    {path: 'tasksEditionSearchView', component: TasksEditionSearchViewComponent , canDeactivate: [CanDeactivateGuard]},
    {path: 'tasksThematic', component: TasksThematicComponent , canDeactivate: [CanDeactivateGuard]},
    {path: 'tasksExtractionFME', component: TasksExtractionFmeComponent , canDeactivate: [CanDeactivateGuard]},
    {path: 'territory', component: TerritoryComponent, canDeactivate: [CanDeactivateGuard]},
    {path: 'territory/:id/territoryForm', component: TerritoryFormComponent},
    {path: 'territory/:id/territoryForm/:idDuplicate', component: TerritoryFormComponent},
    {path: 'role', component: RoleComponent, canDeactivate: [CanDeactivateGuard]},
    {path: 'role/:id/roleForm', component: RoleFormComponent},
    {path: 'role/:id/roleForm/:idDuplicate', component: RoleFormComponent},
    {path: 'user', component: UserComponent, canDeactivate: [CanDeactivateGuard]},
    {path: 'user/:id/userForm', component: UserFormComponent},
    {path: 'user/:id/userForm/:idDuplicate', component: UserFormComponent},
    {path: 'application', component: ApplicationComponent},
    {path: 'application/:id/applicationForm', component: ApplicationFormComponent},
    {path: 'application/:id/applicationForm/:idDuplicate', component: ApplicationFormComponent},
    {path: 'login', component: LoginComponent},
    {path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    {path: '**', pathMatch: 'full', redirectTo: 'dashboard' }

];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });
