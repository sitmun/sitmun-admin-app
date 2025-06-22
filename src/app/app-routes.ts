import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '@app/components/login/login.component';
import { ConnectionComponent } from '@app/components/connection/connection.component';
import { ServiceComponent } from '@app/components/service/service.component';
import { LayersComponent } from '@app/components/layers/layers.component';
import { TreesComponent } from '@app/components/trees/trees.component';
import { BackgroundLayersComponent } from '@app/components/background-layers/background-layers.component';
import { LayersPermitsComponent } from '@app/components/layers-permits/layers-permits.component';
import { TerritoryComponent } from '@app/components/territory/territory.component';
import { RoleComponent } from '@app/components/role/role.component';
import { UserComponent } from '@app/components/user/user.component';
import { ApplicationComponent } from '@app/components/application/application.component';
import { TasksQueryComponent } from '@app/components/tasks-query/tasks-query.component';
import { TaskQueryFormComponent } from '@app/components/tasks-query/task-form/task-query-form.component';
import { ConnectionFormComponent } from '@app/components/connection/connection-form/connection-form.component';
import { RoleFormComponent } from '@app/components/role/role-form/role-form.component';
import { UserFormComponent } from '@app/components/user/user-form/user-form.component';
import { TerritoryFormComponent } from '@app/components/territory/territory-form/territory-form.component';
import { ServiceFormComponent } from '@app/components/service/service-form/service-form.component';
import { ApplicationFormComponent } from '@app/components/application/application-form/application-form.component';
import { TreesFormComponent } from '@app/components/trees/trees-form/trees-form.component';
import { BackgroundLayersFormComponent } from '@app/components/background-layers/background-layers-form/background-layers-form.component';
import { LayersPermitsFormComponent } from '@app/components/layers-permits/layers-permits-form/layers-permits-form.component';
import { TaskGroupComponent } from '@app/components/task-group/task-group.component';
import { TaskGroupFormComponent } from '@app/components/task-group/task-group-form/task-group-form.component';
import { LayersFormComponent } from '@app/components/layers/layers-form/layers-form.component';
import { TasksBasicComponent } from '@app/components/tasks-basic/tasks-basic.component';
import { DashboardComponent } from '@app/components/dashboard/dashboard.component';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard.service';

import { TaskBasicFormComponent } from "@app/components/tasks-basic/task-form/task-basic-form.component";

export const APP_ROUTES: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'connection', component: ConnectionComponent, canDeactivate: [CanDeactivateGuard] },
    { path: 'connection/:id/connectionForm', component: ConnectionFormComponent },
    { path: 'connection/:id/connectionForm/:idDuplicate', component: ConnectionFormComponent },
    { path: 'service', component: ServiceComponent, canDeactivate: [CanDeactivateGuard] },
    { path: 'service/:id/serviceForm', component: ServiceFormComponent },
    { path: 'service/:id/serviceForm/:idDuplicate', component: ServiceFormComponent },
    { path: 'layers', component: LayersComponent, canDeactivate: [CanDeactivateGuard] },
    { path: 'layers/:id/layersForm', component: LayersFormComponent },
    { path: 'layers/:id/layersForm/:idDuplicate', component: LayersFormComponent },
    { path: 'trees', component: TreesComponent, canDeactivate: [CanDeactivateGuard] },
    { path: 'trees/:id/treesForm', component: TreesFormComponent },
    { path: 'trees/:id/treesForm/:idDuplicate', component: TreesFormComponent },
    { path: 'backgroundLayers', component: BackgroundLayersComponent, canDeactivate: [CanDeactivateGuard] },
    { path: 'backgroundLayers/:id/backgroundLayersForm', component: BackgroundLayersFormComponent },
    { path: 'backgroundLayers/:id/backgroundLayersForm/:idDuplicate', component: BackgroundLayersFormComponent },
    { path: 'layersPermits', component: LayersPermitsComponent, canDeactivate: [CanDeactivateGuard] },
    { path: 'layersPermits/:id/layersPermitsForm', component: LayersPermitsFormComponent },
    { path: 'layersPermits/:id/layersPermitsForm/:idDuplicate', component: LayersPermitsFormComponent },
    { path: 'tasksBasic', component: TasksBasicComponent, canDeactivate: [CanDeactivateGuard] },
    { path: 'tasks/:id/1', component: TaskBasicFormComponent },
    { path: 'tasks/:id/5', component: TaskQueryFormComponent },
    { path: 'taskBasic/:id/:type', component: TaskBasicFormComponent },
    { path: 'taskBasic/:id/:type/:idDuplicate', component: TaskBasicFormComponent },
    { path: 'taskGroup', component: TaskGroupComponent, canDeactivate: [CanDeactivateGuard] },
    { path: 'taskGroup/:id/taskGroupForm', component: TaskGroupFormComponent },
    { path: 'taskGroup/:id/taskGroupForm/:idDuplicate', component: TaskGroupFormComponent },
    { path: 'tasksQuery', component: TasksQueryComponent, canDeactivate: [CanDeactivateGuard] },
    { path: 'taskQuery/:id/:type', component: TaskQueryFormComponent },
    { path: 'taskQuery/:id/:type/:idDuplicate', component: TaskQueryFormComponent },
    { path: 'territory', component: TerritoryComponent, canDeactivate: [CanDeactivateGuard] },
    { path: 'territory/:id/territoryForm', component: TerritoryFormComponent },
    { path: 'territory/:id/territoryForm/:idDuplicate', component: TerritoryFormComponent },
    { path: 'role', component: RoleComponent, canDeactivate: [CanDeactivateGuard] },
    { path: 'role/:id/roleForm', component: RoleFormComponent },
    { path: 'role/:id/roleForm/:idDuplicate', component: RoleFormComponent },
    { path: 'user', component: UserComponent, canDeactivate: [CanDeactivateGuard] },
    { path: 'user/:id/userForm', component: UserFormComponent },
    { path: 'user/:id/userForm/:idDuplicate', component: UserFormComponent },
    { path: 'application', component: ApplicationComponent },
    { path: 'application/:id/applicationForm', component: ApplicationFormComponent },
    { path: 'application/:id/applicationForm/:idDuplicate', component: ApplicationFormComponent },
    { path: 'login', component: LoginComponent },
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: '**', pathMatch: 'full', redirectTo: 'dashboard' }

];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });
