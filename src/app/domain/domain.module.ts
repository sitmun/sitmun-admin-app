import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {ModuleWithProviders, NgModule} from '@angular/core';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {ExternalService, ResourceService} from '@app/core/hal';
// Import services from feature folders
import { ApplicationBackgroundService, ApplicationParameterService, ApplicationService } from '@app/domain/application';
import { CapabilitiesService } from '@app/domain/capabilities';
import { BackgroundService , CartographyAvailabilityService , CartographyFilterService , CartographyGroupService , CartographyParameterService , CartographySpatialSelectionParameterService , CartographyStyleService , CartographyService } from '@app/domain/cartography';
import { CodeListService } from '@app/domain/codelist';
import { ConfigurationParametersService } from '@app/domain/configuration';
import { ConnectionService } from '@app/domain/connection';
import { DashboardService } from '@app/domain/dashboard';
import { GetInfoService } from '@app/domain/getInfo';
import { MapConfigurationManagerService } from '@app/domain/map';
import { RoleService } from '@app/domain/role';
import { ServiceParameterService , ServiceService } from '@app/domain/service';
import { TaskAvailabilityService , TaskGroupService , TaskTypeService , TaskUIService , TaskService } from '@app/domain/task';
import { TerritoryGroupTypeService , TerritoryTypeService , TerritoryService } from '@app/domain/territory';
import { LanguageService , TranslationService } from '@app/domain/translation';
import { TreeNodeService , TreeService } from '@app/domain/tree';
import { UserConfigurationService , UserPositionService , UserService } from '@app/domain/user';

/** load i18n assets*/
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/** SITMUN domain module */
@NgModule({
  imports: [
    CommonModule,
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
