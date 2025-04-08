/*
 * Public API Surface of domain module
 */

// Export the domain module
export * from './domain.module';

// Export all feature modules
export * from './territory';
export * from './user';
export * from './task';
export * from './service';
export * from './cartography';
export * from './application';
export * from './role';
export * from './connection';
export * from './translation';
export * from './tree';
export * from './dashboard';
export * from './capabilities';
export * from './configuration';
export * from './getInfo';
export * from './map';
export * from './codelist';

// Explicitly export all services to ensure they're available
// Territory
export { TerritoryService } from './territory/services/territory.service';
export { TerritoryTypeService } from './territory/services/territory-type.service';
export { TerritoryGroupTypeService } from './territory/services/territory-group-type.service';

// User
export { UserService } from './user/services/user.service';
export { UserPositionService } from './user/services/user-position.service';
export { UserConfigurationService } from './user/services/user-configuration.service';

// Task
export { TaskService } from './task/services/task.service';
export { TaskTypeService } from './task/services/task-type.service';
export { TaskGroupService } from './task/services/task-group.service';
export { TaskAvailabilityService } from './task/services/task-availability.service';
export { TaskUIService } from './task/services/task-ui.service';

// Service
export { ServiceService } from './service/services/service.service';
export { ServiceParameterService } from './service/services/service-parameter.service';

// Cartography
export { CartographyService } from './cartography/services/cartography.service';
export { CartographyGroupService } from './cartography/services/cartography-group.service';
export { CartographyAvailabilityService } from './cartography/services/cartography-availability.service';
export { CartographyFilterService } from './cartography/services/cartography-filter.service';
export { CartographyParameterService } from './cartography/services/cartography-parameter.service';
export { CartographySpatialSelectionParameterService } from './cartography/services/cartography-spatial-selection-parameter.service';
export { CartographyStyleService } from './cartography/services/cartography-style.service';
export { BackgroundService } from './cartography/services/background.service';

// Application
export { ApplicationService } from './application/services/application.service';
export { ApplicationParameterService } from './application/services/application-parameter.service';
export { ApplicationBackgroundService } from './application/services/application-background.service';

// Role
export { RoleService } from './role/services/role.service';

// Connection
export { ConnectionService } from './connection/services/connection.service';

// Translation
export { TranslationService } from './translation/services/translation.service';
export { LanguageService } from './translation/services/language.service';

// Tree
export { TreeService } from './tree/services/tree.service';
export { TreeNodeService } from './tree/services/tree-node.service';

// Dashboard
export { DashboardService } from './dashboard/services/dashboard.service';

// Capabilities
export { CapabilitiesService } from './capabilities/services/capabilities.service';

// Configuration
export { ConfigurationParametersService } from './configuration/services/configuration-parameters.service';

// GetInfo
export { GetInfoService } from './getInfo/services/getInfo.service';

// Map
export { MapConfigurationManagerService } from './map/services/map-configuration-manager.service';

// CodeList
export { CodeListService } from './codelist/services/codelist.service';
