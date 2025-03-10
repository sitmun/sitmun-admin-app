import { NgModule, ModuleWithProviders } from '@angular/core';
import { HalModule, ResourceService, ExternalService } from '@app/core/hal';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Import services from feature folders
import { CodeListService } from './codelist/services/codelist.service';
import { TerritoryService } from './territory/services/territory.service';
import { TerritoryTypeService } from './territory/services/territory-type.service';
import { TerritoryGroupTypeService } from './territory/services/territory-group-type.service';
import { UserPositionService } from './user/services/user-position.service';
import { UserConfigurationService } from './user/services/user-configuration.service';
import { RoleService } from './role/services/role.service';
import { UserService } from './user/services/user.service';
import { ConnectionService } from './connection/services/connection.service';
import { TaskService } from './task/services/task.service';
import { TaskTypeService } from './task/services/task-type.service';
import { TaskGroupService } from './task/services/task-group.service';
import { TaskParameterService } from './task/services/task-parameter.service';
import { TaskAvailabilityService } from './task/services/task-availability.service';
import { TaskUIService } from './task/services/task-ui.service';
import { ServiceService } from './service/services/service.service';
import { ServiceParameterService } from './service/services/service-parameter.service';
import { CartographyService } from './cartography/services/cartography.service';
import { CartographyAvailabilityService } from './cartography/services/cartography-availability.service';
import { CartographyFilterService } from './cartography/services/cartography-filter.service';
import { CartographyGroupService } from './cartography/services/cartography-group.service';
import { CartographyParameterService } from './cartography/services/cartography-parameter.service';
import { BackgroundService } from './cartography/services/background.service';
import { TreeService } from './tree/services/tree.service';
import { TreeNodeService } from './tree/services/tree-node.service';
import { ApplicationService } from './application/services/application.service';
import { ApplicationParameterService } from './application/services/application-parameter.service';
import { ApplicationBackgroundService } from './application/services/application-background.service';
import { MapConfigurationManagerService } from './map/services/map-configuration-manager.service';
import { TranslationService } from './translation/services/translation.service';
import { LanguageService } from './translation/services/language.service';
import { DashboardService } from './dashboard/services/dashboard.service';
import { CapabilitiesService } from './capabilities/services/capabilities.service';
import { ConfigurationParametersService } from './configuration/services/configuration-parameters.service';
import { CartographyStyleService } from './cartography/services/cartography-style.service';
import { CartographySpatialSelectionParameterService } from './cartography/services/cartography-spatial-selection-parameter.service';
import { GetInfoService } from './getInfo/services/getInfo.service';

/** load i18n assets*/
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/** SITMUN domain module */
@NgModule({
  imports: [
    CommonModule,
    HalModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
  ],
  exports: [
    TranslateModule
  ]
})
export class DomainModule {
  static forRoot(): ModuleWithProviders<DomainModule> {
    return {
      ngModule: DomainModule,
      providers: [
        ResourceService,
        ExternalService,
        CodeListService,
        TerritoryService,
        TerritoryTypeService,
        TerritoryGroupTypeService,
        RoleService,
        UserService,
        ConnectionService,
        TaskService,
        TaskTypeService,
        TaskUIService,
        TaskGroupService,
        TaskParameterService,
        TaskAvailabilityService,
        ServiceService,
        ConfigurationParametersService,
        CapabilitiesService,
        GetInfoService,
        ServiceParameterService,
        CartographyService,
        CartographyGroupService,
        CartographyAvailabilityService,
        CartographyParameterService,
        CartographySpatialSelectionParameterService,
        CartographyStyleService,
        CartographyFilterService,
        BackgroundService,
        TreeService,
        TreeNodeService,
        ApplicationService,
        ApplicationParameterService,
        ApplicationBackgroundService,
        UserPositionService,
        UserConfigurationService,
        TranslationService,
        LanguageService,
        DashboardService,
        MapConfigurationManagerService,
      ]
    };
  }
} 