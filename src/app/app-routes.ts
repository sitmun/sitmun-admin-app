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

export const APP_ROUTES: Routes = [
    {path: 'index', component: IndexComponent},
    {path: 'connection', component: ConnectionComponent},
    {path: 'service', component: ServiceComponent},
    {path: 'layers', component: LayersComponent},
    {path: 'trees', component: TreesComponent},
    {path: 'backgroundLayers', component: BackgroundLayersComponent},
    {path: 'layersPermits', component: LayersPermitsComponent},
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
    {path: 'role', component: RoleComponent},
    {path: 'user', component: UserComponent},
    {path: 'application', component: ApplicationComponent},
    {path: 'proves', component: ProvesComponent},
    {path: '', pathMatch: 'full', redirectTo: 'proves' },
    {path: '**', pathMatch: 'full', redirectTo: 'proves' }

];

