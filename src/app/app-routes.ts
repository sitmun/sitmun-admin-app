import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
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
import { ProvesComponent } from './components/proves/proves.component';
import { TasksDownloadComponent } from './components/tasks-download/tasks-download.component';
import { TasksDocumentComponent } from './components/tasks-document/tasks-document.component';
import { TasksConsultationComponent } from './components/tasks-consultation/tasks-consultation.component';
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

export const APP_ROUTES: Routes = [
    {path: 'index', component: IndexComponent},
    {path: 'connection', component: ConnectionComponent},
    {path: 'connection/:id/connectionForm', component: ConnectionFormComponent},
    {path: 'service', component: ServiceComponent},
    {path: 'service/:id/serviceForm', component: ServiceFormComponent},
    {path: 'layers', component: LayersComponent},
    {path: 'layers/:id/layersForm', component: LayersFormComponent},
    {path: 'trees', component: TreesComponent},
    {path: 'trees/:id/treesForm', component: TreesFormComponent},
    {path: 'backgroundLayers', component: BackgroundLayersComponent},
    {path: 'backgroundLayers/:id/backgroundLayersForm', component: BackgroundLayersFormComponent},
    {path: 'layersPermits', component: LayersPermitsComponent},
    {path: 'layersPermits/:id/layersPermitsForm', component: LayersPermitsFormComponent},
    {path: 'taskGroup', component: TaskGroupComponent},
    {path: 'taskGroup/:id/taskGroupForm', component: TaskGroupFormComponent},
    {path: 'tasksDownload', component: TasksDownloadComponent},
    {path: 'tasksDocument', component: TasksDocumentComponent},
    {path: 'tasksConsultation', component: TasksConsultationComponent},
    {path: 'tasksMoreInformation', component: TasksMoreInfoComponent},
    {path: 'tasksLocator', component: TasksLocatorComponent},
    {path: 'tasksReport', component: TasksReportComponent},
    {path: 'tasksEdition', component: TasksEditionComponent },
    {path: 'tasksThematic', component: TasksThematicComponent },
    {path: 'tasksExtractionFME', component: TasksExtractionFmeComponent },
    {path: 'territory', component: TerritoryComponent},
    {path: 'territory/:id/territoryForm', component: TerritoryFormComponent},
    {path: 'role', component: RoleComponent},
    {path: 'role/:id/roleForm', component: RoleFormComponent},
    {path: 'user', component: UserComponent},
    {path: 'user/:id/userForm', component: UserFormComponent},
    {path: 'application', component: ApplicationComponent},
    {path: 'application/:id/applicationForm', component: ApplicationFormComponent},
    {path: 'proves', component: ProvesComponent},
    {path: '', pathMatch: 'full', redirectTo: 'proves' },
    {path: '**', pathMatch: 'full', redirectTo: 'proves' }

];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });
