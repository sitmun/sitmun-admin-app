import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
//import { AngularHalModule } from '../../lib/angular-hal';
import { CodeListService } from './codelist/codelist.service';
import { TerritoryService } from './territory/territory.service';
import { TerritoryTypeService } from './territory/territory-type.service';
import { TerritoryGroupTypeService } from './territory/territory-group-type.service';
import { UserPositionService } from './user/user-position.service';
import { UserConfigurationService } from './user/user-configuration.service';
import { RoleService } from './role/role.service';
import { UserService } from './user/user.service';
import { ConnectionService } from './connection/connection.service';
import { TaskService } from './task/task.service';
import { TaskTypeService } from './task/task-type.service';
import { TaskGroupService } from './task/task-group.service';
import { TaskParameterService } from './task/task-parameter.service';
import { TaskAvailabilityService } from './task/task-availability.service';
import { TaskUIService } from './task/task-ui.service';
import { ServiceService } from './service/service.service';
import { ServiceParameterService } from './service/service-parameter.service';
import { CartographyService } from './cartography/cartography.service';
import { CartographyAvailabilityService } from './cartography/cartography-availability.service';
import { CartographyFilterService } from './cartography/cartography-filter.service';
import { CartographyGroupService } from './cartography/cartography-group.service';
import { CartographyParameterService } from './cartography/cartography-parameter.service';
import { BackgroundService } from './cartography/background.service';
import { TreeService } from './tree/tree.service';
import { TreeNodeService } from './tree/tree-node.service';
import { ApplicationService } from './application/application.service';
import { ApplicationParameterService } from './application/application-parameter.service';
import { ApplicationBackgroundService } from './application/application-background.service';
import { MapConfigurationManagerService } from './map/map-configuration-manager.service';
import { AuthService } from './auth/auth.service';
import { Principal } from './auth/principal.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthExpiredInterceptor } from './auth/auth-expired.interceptor';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { HasAnyAuthorityOnTerritoryDirective } from './auth/has-any-authority-on-territory.directive';
import { LoginService } from './auth/login.service';
import { AccountService } from './account/account.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslationService } from './translation/translation.service';
import { LanguageService } from './translation/language.service';
import { DashboardService } from './dashboard/dashboard.service';
import { CapabilitiesService } from './capabilities/capabilities.service';
import { ConfigurationParametersService } from './configuration/configuration-parameters.service';
import { CartographyStyleService } from './cartography/cartography-style.service';
import { CartographySpatialSelectionParameterService } from './cartography/cartography-spatial-selection-parameter.service';
import { GetInfoService } from './getInfo/getInfo.service';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
/** load i18n assets*/
export function createTranslateLoader(http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
/** SITMUN frontend core module */
export class SitmunFrontendCoreModule {
    static forRoot() {
        return {
            ngModule: SitmunFrontendCoreModule,
            providers: [
                CodeListService,
                TerritoryService,
                TerritoryTypeService,
                TerritoryGroupTypeService,
                RoleService,
                AccountService,
                AuthService,
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
                AuthInterceptor,
                AuthExpiredInterceptor,
                Principal,
                UserPositionService,
                UserConfigurationService,
                LoginService,
                TranslationService,
                LanguageService,
                DashboardService,
                MapConfigurationManagerService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                    multi: true
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthExpiredInterceptor,
                    multi: true
                }
            ]
        };
    }
}
SitmunFrontendCoreModule.ɵmod = i0.ɵɵdefineNgModule({ type: SitmunFrontendCoreModule });
SitmunFrontendCoreModule.ɵinj = i0.ɵɵdefineInjector({ factory: function SitmunFrontendCoreModule_Factory(t) { return new (t || SitmunFrontendCoreModule)(); }, imports: [[
            /*RouterModule,
            HttpClientModule,
            CommonModule,
            AngularHalModule,*/
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: (createTranslateLoader),
                    deps: [HttpClient]
                }
            }),
        ], TranslateModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(SitmunFrontendCoreModule, { declarations: [HasAnyAuthorityDirective,
        HasAnyAuthorityOnTerritoryDirective], imports: [i1.TranslateModule], exports: [HasAnyAuthorityDirective,
        HasAnyAuthorityOnTerritoryDirective,
        TranslateModule] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(SitmunFrontendCoreModule, [{
        type: NgModule,
        args: [{
                imports: [
                    /*RouterModule,
                    HttpClientModule,
                    CommonModule,
                    AngularHalModule,*/
                    TranslateModule.forRoot({
                        loader: {
                            provide: TranslateLoader,
                            useFactory: (createTranslateLoader),
                            deps: [HttpClient]
                        }
                    }),
                ],
                declarations: [
                    HasAnyAuthorityDirective,
                    HasAnyAuthorityOnTerritoryDirective,
                ],
                exports: [
                    HasAnyAuthorityDirective,
                    HasAnyAuthorityOnTerritoryDirective,
                    TranslateModule
                ]
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0bXVuLWZyb250ZW5kLWNvcmUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL2Fjb3JvbWluYXMvRGVza3RvcC9OZXh1cy9TaXRtdW4zL3NpdG11bi1mcm9udGVuZC1jb3JlL3Byb2plY3RzL3NpdG11bi1mcm9udGVuZC1jb3JlL3NyYy9saWIvIiwic291cmNlcyI6WyJzaXRtdW4tZnJvbnRlbmQtY29yZS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBdUIsTUFBTSxlQUFlLENBQUM7QUFHOUQsT0FBTyxFQUFtQixpQkFBaUIsRUFBRSxVQUFVLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUVyRiwyREFBMkQ7QUFDM0QsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQzVELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQy9ELE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQ3hFLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLDBDQUEwQyxDQUFDO0FBQ25GLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQ2pFLE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDaEQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFDbEUsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUN6RCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsb0JBQW9C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LENBQUM7U0FDSCxFQVFDLGVBQWU7d0ZBR04sd0JBQXdCLG1CQVRqQyx3QkFBd0I7UUFDeEIsbUNBQW1DLDRDQUduQyx3QkFBd0I7UUFDeEIsbUNBQW1DO1FBQ25DLGVBQWU7a0RBR04sd0JBQXdCO2NBeEJwQyxRQUFRO2VBQUM7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQOzs7dUNBR21CO29CQUNuQixlQUFlLENBQUMsT0FBTyxDQUFDO3dCQUN0QixNQUFNLEVBQUU7NEJBQ04sT0FBTyxFQUFFLGVBQWU7NEJBQ3hCLFVBQVUsRUFBRSxDQUFDLHFCQUFxQixDQUFDOzRCQUNuQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7eUJBQ25CO3FCQUNGLENBQUM7aUJBQ0g7Z0JBQ0QsWUFBWSxFQUFFO29CQUNaLHdCQUF3QjtvQkFDeEIsbUNBQW1DO2lCQUNwQztnQkFDRCxPQUFPLEVBQUU7b0JBQ1Asd0JBQXdCO29CQUN4QixtQ0FBbUM7b0JBQ25DLGVBQWU7aUJBQ2hCO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50TW9kdWxlLCBIVFRQX0lOVEVSQ0VQVE9SUywgSHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG4vL2ltcG9ydCB7IEFuZ3VsYXJIYWxNb2R1bGUgfSBmcm9tICcuLi8uLi9saWIvYW5ndWxhci1oYWwnO1xyXG5pbXBvcnQge0NvZGVMaXN0U2VydmljZX0gZnJvbSAnLi9jb2RlbGlzdC9jb2RlbGlzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHtUZXJyaXRvcnlTZXJ2aWNlfSBmcm9tICcuL3RlcnJpdG9yeS90ZXJyaXRvcnkuc2VydmljZSc7XHJcbmltcG9ydCB7VGVycml0b3J5VHlwZVNlcnZpY2V9IGZyb20gJy4vdGVycml0b3J5L3RlcnJpdG9yeS10eXBlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1RlcnJpdG9yeUdyb3VwVHlwZVNlcnZpY2V9IGZyb20gJy4vdGVycml0b3J5L3RlcnJpdG9yeS1ncm91cC10eXBlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1VzZXJQb3NpdGlvblNlcnZpY2V9IGZyb20gJy4vdXNlci91c2VyLXBvc2l0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQge1VzZXJDb25maWd1cmF0aW9uU2VydmljZX0gZnJvbSAnLi91c2VyL3VzZXItY29uZmlndXJhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHtSb2xlU2VydmljZX0gZnJvbSAnLi9yb2xlL3JvbGUuc2VydmljZSc7XHJcbmltcG9ydCB7VXNlclNlcnZpY2V9IGZyb20gJy4vdXNlci91c2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQge0Nvbm5lY3Rpb25TZXJ2aWNlfSBmcm9tICcuL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrU2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2suc2VydmljZSc7XHJcbmltcG9ydCB7VGFza1R5cGVTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay10eXBlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tHcm91cFNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLWdyb3VwLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tQYXJhbWV0ZXJTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay1wYXJhbWV0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7VGFza0F2YWlsYWJpbGl0eVNlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLWF2YWlsYWJpbGl0eS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrVUlTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay11aS5zZXJ2aWNlJztcclxuaW1wb3J0IHtTZXJ2aWNlU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlL3NlcnZpY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7U2VydmljZVBhcmFtZXRlclNlcnZpY2V9IGZyb20gJy4vc2VydmljZS9zZXJ2aWNlLXBhcmFtZXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeVNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHkuc2VydmljZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlBdmFpbGFiaWxpdHlTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWF2YWlsYWJpbGl0eS5zZXJ2aWNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUZpbHRlclNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktZmlsdGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5R3JvdXBTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWdyb3VwLnNlcnZpY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5UGFyYW1ldGVyU2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1wYXJhbWV0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7QmFja2dyb3VuZFNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvYmFja2dyb3VuZC5zZXJ2aWNlJztcclxuaW1wb3J0IHtUcmVlU2VydmljZX0gZnJvbSAnLi90cmVlL3RyZWUuc2VydmljZSc7XHJcbmltcG9ydCB7VHJlZU5vZGVTZXJ2aWNlfSBmcm9tICcuL3RyZWUvdHJlZS1ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge0FwcGxpY2F0aW9uU2VydmljZX0gZnJvbSAnLi9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvblBhcmFtZXRlclNlcnZpY2V9IGZyb20gJy4vYXBwbGljYXRpb24vYXBwbGljYXRpb24tcGFyYW1ldGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge0FwcGxpY2F0aW9uQmFja2dyb3VuZFNlcnZpY2V9IGZyb20gJy4vYXBwbGljYXRpb24vYXBwbGljYXRpb24tYmFja2dyb3VuZC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTWFwQ29uZmlndXJhdGlvbk1hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi9tYXAvbWFwLWNvbmZpZ3VyYXRpb24tbWFuYWdlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGgvYXV0aC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUHJpbmNpcGFsIH0gZnJvbSAnLi9hdXRoL3ByaW5jaXBhbC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXV0aEludGVyY2VwdG9yIH0gZnJvbSAnLi9hdXRoL2F1dGguaW50ZXJjZXB0b3InO1xyXG5pbXBvcnQgeyBBdXRoRXhwaXJlZEludGVyY2VwdG9yIH0gZnJvbSAnLi9hdXRoL2F1dGgtZXhwaXJlZC5pbnRlcmNlcHRvcic7XHJcbmltcG9ydCB7IEhhc0FueUF1dGhvcml0eURpcmVjdGl2ZSB9IGZyb20gJy4vYXV0aC9oYXMtYW55LWF1dGhvcml0eS5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBIYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeURpcmVjdGl2ZSB9IGZyb20gJy4vYXV0aC9oYXMtYW55LWF1dGhvcml0eS1vbi10ZXJyaXRvcnkuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgTG9naW5TZXJ2aWNlIH0gZnJvbSAnLi9hdXRoL2xvZ2luLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBY2NvdW50U2VydmljZSB9IGZyb20gJy4vYWNjb3VudC9hY2NvdW50LnNlcnZpY2UnO1xyXG5pbXBvcnQge1RyYW5zbGF0ZUh0dHBMb2FkZXJ9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2h0dHAtbG9hZGVyJztcclxuaW1wb3J0IHtUcmFuc2xhdGVMb2FkZXIsIFRyYW5zbGF0ZU1vZHVsZX0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XHJcbmltcG9ydCB7IFRyYW5zbGF0aW9uU2VydmljZSB9IGZyb20gJy4vdHJhbnNsYXRpb24vdHJhbnNsYXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7IExhbmd1YWdlU2VydmljZSB9IGZyb20gJy4vdHJhbnNsYXRpb24vbGFuZ3VhZ2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IERhc2hib2FyZFNlcnZpY2UgfSBmcm9tICcuL2Rhc2hib2FyZC9kYXNoYm9hcmQuc2VydmljZSc7XHJcbmltcG9ydCB7IENhcGFiaWxpdGllc1NlcnZpY2UgfSBmcm9tICcuL2NhcGFiaWxpdGllcy9jYXBhYmlsaXRpZXMuc2VydmljZSc7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25QYXJhbWV0ZXJzU2VydmljZSB9IGZyb20gJy4vY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uLXBhcmFtZXRlcnMuc2VydmljZSc7XHJcbmltcG9ydCB7IENhcnRvZ3JhcGh5U3R5bGVTZXJ2aWNlIH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1zdHlsZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2FydG9ncmFwaHlTcGF0aWFsU2VsZWN0aW9uUGFyYW1ldGVyU2VydmljZSB9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktc3BhdGlhbC1zZWxlY3Rpb24tcGFyYW1ldGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBHZXRJbmZvU2VydmljZSB9IGZyb20gJy4vZ2V0SW5mby9nZXRJbmZvLnNlcnZpY2UnO1xyXG4vKiogbG9hZCBpMThuIGFzc2V0cyovXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcmFuc2xhdGVMb2FkZXIoaHR0cDogSHR0cENsaWVudCkge1xyXG4gIHJldHVybiBuZXcgVHJhbnNsYXRlSHR0cExvYWRlcihodHRwLCAnLi9hc3NldHMvaTE4bi8nLCAnLmpzb24nKTtcclxufVxyXG5cclxuXHJcbi8qKiBTSVRNVU4gZnJvbnRlbmQgY29yZSBtb2R1bGUgKi9cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICAvKlJvdXRlck1vZHVsZSxcclxuICAgIEh0dHBDbGllbnRNb2R1bGUsXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBBbmd1bGFySGFsTW9kdWxlLCovXHJcbiAgICBUcmFuc2xhdGVNb2R1bGUuZm9yUm9vdCh7XHJcbiAgICAgIGxvYWRlcjoge1xyXG4gICAgICAgIHByb3ZpZGU6IFRyYW5zbGF0ZUxvYWRlcixcclxuICAgICAgICB1c2VGYWN0b3J5OiAoY3JlYXRlVHJhbnNsYXRlTG9hZGVyKSxcclxuICAgICAgICBkZXBzOiBbSHR0cENsaWVudF1cclxuICAgICAgfVxyXG4gICAgfSksXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIEhhc0FueUF1dGhvcml0eURpcmVjdGl2ZSxcclxuICAgIEhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5RGlyZWN0aXZlLFxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgSGFzQW55QXV0aG9yaXR5RGlyZWN0aXZlLFxyXG4gICAgSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnlEaXJlY3RpdmUsXHJcbiAgICBUcmFuc2xhdGVNb2R1bGVcclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTaXRtdW5Gcm9udGVuZENvcmVNb2R1bGUge1xyXG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnM8U2l0bXVuRnJvbnRlbmRDb3JlTW9kdWxlPiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBuZ01vZHVsZTogU2l0bXVuRnJvbnRlbmRDb3JlTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICBDb2RlTGlzdFNlcnZpY2UsXHJcbiAgICAgICAgVGVycml0b3J5U2VydmljZSxcclxuICAgICAgICBUZXJyaXRvcnlUeXBlU2VydmljZSxcclxuICAgICAgICBUZXJyaXRvcnlHcm91cFR5cGVTZXJ2aWNlLFxyXG4gICAgICAgIFJvbGVTZXJ2aWNlLFxyXG4gICAgICAgIEFjY291bnRTZXJ2aWNlLFxyXG4gICAgICAgIEF1dGhTZXJ2aWNlLFxyXG4gICAgICAgIFVzZXJTZXJ2aWNlLFxyXG4gICAgICAgIENvbm5lY3Rpb25TZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tTZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tUeXBlU2VydmljZSxcclxuICAgICAgICBUYXNrVUlTZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tHcm91cFNlcnZpY2UsXHJcbiAgICAgICAgVGFza1BhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgVGFza0F2YWlsYWJpbGl0eVNlcnZpY2UsXHJcbiAgICAgICAgU2VydmljZVNlcnZpY2UsXHJcbiAgICAgICAgQ29uZmlndXJhdGlvblBhcmFtZXRlcnNTZXJ2aWNlLFxyXG4gICAgICAgIENhcGFiaWxpdGllc1NlcnZpY2UsXHJcbiAgICAgICAgR2V0SW5mb1NlcnZpY2UsXHJcbiAgICAgICAgU2VydmljZVBhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5R3JvdXBTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5U2VydmljZSxcclxuICAgICAgICBDYXJ0b2dyYXBoeVBhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlTcGF0aWFsU2VsZWN0aW9uUGFyYW1ldGVyU2VydmljZSxcclxuICAgICAgICBDYXJ0b2dyYXBoeVN0eWxlU2VydmljZSxcclxuICAgICAgICBDYXJ0b2dyYXBoeUZpbHRlclNlcnZpY2UsXHJcbiAgICAgICAgQmFja2dyb3VuZFNlcnZpY2UsXHJcbiAgICAgICAgVHJlZVNlcnZpY2UsXHJcbiAgICAgICAgVHJlZU5vZGVTZXJ2aWNlLFxyXG4gICAgICAgIEFwcGxpY2F0aW9uU2VydmljZSxcclxuICAgICAgICBBcHBsaWNhdGlvblBhcmFtZXRlclNlcnZpY2UsXHJcbiAgICAgICAgQXBwbGljYXRpb25CYWNrZ3JvdW5kU2VydmljZSxcclxuICAgICAgICBBdXRoSW50ZXJjZXB0b3IsXHJcbiAgICAgICAgQXV0aEV4cGlyZWRJbnRlcmNlcHRvcixcclxuICAgICAgICBQcmluY2lwYWwsXHJcbiAgICAgICAgVXNlclBvc2l0aW9uU2VydmljZSxcclxuICAgICAgICBVc2VyQ29uZmlndXJhdGlvblNlcnZpY2UsXHJcbiAgICAgICAgTG9naW5TZXJ2aWNlLFxyXG4gICAgICAgIFRyYW5zbGF0aW9uU2VydmljZSxcclxuICAgICAgICBMYW5ndWFnZVNlcnZpY2UsXHJcbiAgICAgICAgRGFzaGJvYXJkU2VydmljZSxcclxuICAgICAgICBNYXBDb25maWd1cmF0aW9uTWFuYWdlclNlcnZpY2UsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgcHJvdmlkZTogSFRUUF9JTlRFUkNFUFRPUlMsXHJcbiAgICAgICAgICB1c2VDbGFzczogQXV0aEludGVyY2VwdG9yLFxyXG4gICAgICAgICAgbXVsdGk6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgLCB7XHJcbiAgICAgICAgICBwcm92aWRlOiBIVFRQX0lOVEVSQ0VQVE9SUyxcclxuICAgICAgICAgIHVzZUNsYXNzOiBBdXRoRXhwaXJlZEludGVyY2VwdG9yLFxyXG4gICAgICAgICAgbXVsdGk6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG4iXX0=