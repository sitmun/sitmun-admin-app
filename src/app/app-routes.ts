import {RouterModule, Routes} from '@angular/router';

import {ApplicationFormComponent} from '@app/components/application/application-form/application-form.component';
import {ApplicationComponent} from '@app/components/application/application.component';
import {
  BackgroundLayersFormComponent
} from '@app/components/background-layers/background-layers-form/background-layers-form.component';
import {BackgroundLayersComponent} from '@app/components/background-layers/background-layers.component';
import {CallbackComponent} from "@app/components/callback/callback.component";
import {CodelistValueFormComponent} from '@app/components/codelist-value/codelist-value-form/codelist-value-form.component';
import {CodelistValueComponent} from '@app/components/codelist-value/codelist-value.component';
import {ConfigurationParameterFormComponent} from '@app/components/configuration-parameter/configuration-parameter-form/configuration-parameter-form.component';
import {ConfigurationParameterComponent} from '@app/components/configuration-parameter/configuration-parameter.component';
import {ConnectionFormComponent} from '@app/components/connection/connection-form/connection-form.component';
import {ConnectionComponent} from '@app/components/connection/connection.component';
import {DashboardComponent} from '@app/components/dashboard/dashboard.component';
import {ErrorPageComponent} from '@app/components/error-page/error-page.component';
import {LanguageFormComponent} from '@app/components/language/language-form/language-form.component';
import {LanguageComponent} from '@app/components/language/language.component';
import {LiteralTranslationsComponent} from '@app/components/literal-translations/literal-translations.component';
import {LayersFormComponent} from '@app/components/layers/layers-form/layers-form.component';
import {LayersComponent} from '@app/components/layers/layers.component';
import {
  LayersPermitsFormComponent
} from '@app/components/layers-permits/layers-permits-form/layers-permits-form.component';
import {LayersPermitsComponent} from '@app/components/layers-permits/layers-permits.component';
import {LoginComponent} from '@app/components/login/login.component';
import {RoleFormComponent} from '@app/components/role/role-form/role-form.component';
import {RoleComponent} from '@app/components/role/role.component';
import {ServiceFormComponent} from '@app/components/service/service-form/service-form.component';
import {ServiceComponent} from '@app/components/service/service.component';
import {AuthenticatedLayoutComponent} from '@app/components/shared/authenticated-layout/authenticated-layout.component';
import {TaskGroupFormComponent} from '@app/components/task-group/task-group-form/task-group-form.component';
import {TaskGroupComponent} from '@app/components/task-group/task-group.component';
import {TaskTypeFormComponent} from '@app/components/task-type/task-type-form/task-type-form.component';
import {TaskTypeComponent} from '@app/components/task-type/task-type.component';
import {TaskUIFormComponent} from '@app/components/task-ui/task-ui-form/task-ui-form.component';
import {TaskUIComponent} from '@app/components/task-ui/task-ui.component';
import {TaskBasicFormComponent} from "@app/components/tasks-basic/task-form/task-basic-form.component";
import {TasksBasicComponent} from '@app/components/tasks-basic/tasks-basic.component';
import {TaskEditFormComponent} from '@app/components/tasks-edit/task-form/task-edit-form.component';
import {TasksEditComponent} from '@app/components/tasks-edit/tasks-edit.component';
import {TaskLocatorFormComponent} from '@app/components/tasks-locator/task-form/task-locator-form.component';
import {TasksLocatorComponent} from '@app/components/tasks-locator/tasks-locator.component';
import {TaskMoreInfoFormComponent} from '@app/components/tasks-more-info/task-form/task-more-info-form.component';
import {TaskMoreInfoAdvancedFormComponent} from '@app/components/tasks-more-info-advanced/task-form/task-more-info-advanced-form.component';
import {TasksMoreInfoComponent} from '@app/components/tasks-more-info/tasks-more-info.component';
import { TaskTemplateFormComponent } from '@app/components/tasks-template/task-form/task-template-form.component';
import { TasksTemplateComponent } from '@app/components/tasks-template/tasks-template.component';
import {TasksMoreInfoAdvancedComponent} from '@app/components/tasks-more-info-advanced/tasks-more-info-advanced.component';
import {TaskQueryFormComponent} from '@app/components/tasks-query/task-form/task-query-form.component';
import {TasksQueryComponent} from '@app/components/tasks-query/tasks-query.component';
import {TerritoryFormComponent} from '@app/components/territory/territory-form/territory-form.component';
import {TerritoryComponent} from '@app/components/territory/territory.component';
import {TerritoryTypeFormComponent} from '@app/components/territory-type/territory-type-form/territory-type-form.component';
import {TerritoryTypeComponent} from '@app/components/territory-type/territory-type.component';
import {TreesFormComponent} from '@app/components/trees/trees-form/trees-form.component';
import {TreesComponent} from '@app/components/trees/trees.component';
import {UserFormComponent} from '@app/components/user/user-form/user-form.component';
import {UserComponent} from '@app/components/user/user.component';
import {authGuard} from '@app/core/guards/auth.guard';
import {CanDeactivateGuard} from '@app/core/guards/can-deactivate-guard.service';
import {magic} from "@environments/constants";

export const APP_ROUTES: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'error', component: ErrorPageComponent},
  {path: 'callback', component: CallbackComponent},
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    canActivate: [authGuard],
    children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'connection', component: ConnectionComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'connection/:id/connectionForm', component: ConnectionFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'connection/:id/connectionForm/:idDuplicate', component: ConnectionFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'service', component: ServiceComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'service/:id/serviceForm', component: ServiceFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'service/:id/serviceForm/:idDuplicate', component: ServiceFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'layers', component: LayersComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'layers/:id/layersForm', component: LayersFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'layers/:id/layersForm/:idDuplicate', component: LayersFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'trees', component: TreesComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'trees/:id/treesForm', component: TreesFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'trees/:id/treesForm/:idDuplicate', component: TreesFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'backgroundLayers', component: BackgroundLayersComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'backgroundLayers/:id/backgroundLayersForm', component: BackgroundLayersFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'backgroundLayers/:id/backgroundLayersForm/:idDuplicate', component: BackgroundLayersFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'layersPermits', component: LayersPermitsComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'layersPermits/:id/layersPermitsForm', component: LayersPermitsFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'layersPermits/:id/layersPermitsForm/:idDuplicate', component: LayersPermitsFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: `tasks/:id/${magic.taskEditTypeId}`, component: TaskEditFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: `tasks/:id/${magic.taskBasicTypeId}`, component: TaskBasicFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: `tasks/:id/${magic.taskQueryTypeId}`, component: TaskQueryFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: `tasks/:id/${magic.taskTemplateTypeId}`, component: TaskTemplateFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'tasksEdit', component: TasksEditComponent},
      {path: 'taskEdit/:id/:type', component: TaskEditFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'taskEdit/:id/:type/:idDuplicate', component: TaskEditFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'tasksBasic', component: TasksBasicComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'taskBasic/:id/:type', component: TaskBasicFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'taskBasic/:id/:type/:idDuplicate', component: TaskBasicFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'taskGroup', component: TaskGroupComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'taskGroup/:id/taskGroupForm', component: TaskGroupFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'taskGroup/:id/taskGroupForm/:idDuplicate', component: TaskGroupFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'task-ui', component: TaskUIComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'task-ui/:id/taskUIForm', component: TaskUIFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'task-ui/:id/taskUIForm/:idDuplicate', component: TaskUIFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'tasksQuery', component: TasksQueryComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'taskQuery/:id/:type', component: TaskQueryFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'taskQuery/:id/:type/:idDuplicate', component: TaskQueryFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'tasksLocator', component: TasksLocatorComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'tasksLocator/:id/:type', component: TaskLocatorFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'tasksLocator/:id/:type/:idDuplicate', component: TaskLocatorFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'tasksTemplate', component: TasksTemplateComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'taskTemplate/:id/:type', component: TaskTemplateFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'taskTemplate/:id/:type/:idDuplicate', component: TaskTemplateFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'tasksMoreInfo', component: TasksMoreInfoComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'tasksMoreInfo/:id/:type', component: TaskMoreInfoFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'tasksMoreInfo/:id/:type/:idDuplicate', component: TaskMoreInfoFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'tasksMoreInfoAdvanced', component: TasksMoreInfoAdvancedComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'tasksMoreInfoAdvanced/:id/:type', component: TaskMoreInfoAdvancedFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'tasksMoreInfoAdvanced/:id/:type/:idDuplicate', component: TaskMoreInfoAdvancedFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'territory', component: TerritoryComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'territory/:id/territoryForm', component: TerritoryFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'territory/:id/territoryForm/:idDuplicate', component: TerritoryFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'role', component: RoleComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'role/:id/roleForm', component: RoleFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'role/:id/roleForm/:idDuplicate', component: RoleFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'user', component: UserComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'user/:id/userForm', component: UserFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'user/:id/userForm/:idDuplicate', component: UserFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'application', component: ApplicationComponent},
      {path: 'application/:id/applicationForm', component: ApplicationFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'application/:id/applicationForm/:idDuplicate', component: ApplicationFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'language', component: LanguageComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'language/:id/languageForm', component: LanguageFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'language/:id/languageForm/:idDuplicate', component: LanguageFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'literalTranslations', component: LiteralTranslationsComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'language/:id/languageForm', component: LanguageFormComponent},
      {path: 'language/:id/languageForm/:idDuplicate', component: LanguageFormComponent},
      {path: 'territoryType', component: TerritoryTypeComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'territoryType/:id/territoryTypeForm', component: TerritoryTypeFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'territoryType/:id/territoryTypeForm/:idDuplicate', component: TerritoryTypeFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'taskType', component: TaskTypeComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'taskType/:id/taskTypeForm', component: TaskTypeFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'codelistValue', component: CodelistValueComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'codelistValue/:id/codelistValueForm', component: CodelistValueFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'codelistValue/:id/codelistValueForm/:idDuplicate', component: CodelistValueFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'configurationParameter', component: ConfigurationParameterComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'configurationParameter/:id/configurationParameterForm', component: ConfigurationParameterFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'configurationParameter/:id/configurationParameterForm/:idDuplicate', component: ConfigurationParameterFormComponent, canDeactivate: [CanDeactivateGuard]},
      {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
    ]
  },
  {path: '**', pathMatch: 'full', redirectTo: ''}
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });
