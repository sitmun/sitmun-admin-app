/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/**
 * load i18n assets
 * @param {?} http
 * @return {?}
 */
export function createTranslateLoader(http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
const ɵ0 = (createTranslateLoader);
/**
 * SITMUN frontend core module
 */
export class SitmunFrontendCoreModule {
    /**
     * @return {?}
     */
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
SitmunFrontendCoreModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    /*RouterModule,
                    HttpClientModule,
                    CommonModule,
                    AngularHalModule,*/
                    TranslateModule.forRoot({
                        loader: {
                            provide: TranslateLoader,
                            useFactory: ɵ0,
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
            },] }
];
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0bXVuLWZyb250ZW5kLWNvcmUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlLyIsInNvdXJjZXMiOlsic2l0bXVuLWZyb250ZW5kLWNvcmUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLGVBQWUsQ0FBQztBQUc5RCxPQUFPLEVBQW1CLGlCQUFpQixFQUFFLFVBQVUsRUFBQyxNQUFNLHNCQUFzQixDQUFDOztBQUdyRixPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDL0QsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDeEUsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFDbkYsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDakUsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFDM0UsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUNsRSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDaEQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQzNELE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQ25FLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQ3pFLE9BQU8sRUFB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QkFDeEIsbUNBQW1DO29CQUNuQyxlQUFlO2lCQUNoQjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7SHR0cENsaWVudE1vZHVsZSwgSFRUUF9JTlRFUkNFUFRPUlMsIEh0dHBDbGllbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuLy9pbXBvcnQgeyBBbmd1bGFySGFsTW9kdWxlIH0gZnJvbSAnLi4vLi4vbGliL2FuZ3VsYXItaGFsJztcclxuaW1wb3J0IHtDb2RlTGlzdFNlcnZpY2V9IGZyb20gJy4vY29kZWxpc3QvY29kZWxpc3Quc2VydmljZSc7XHJcbmltcG9ydCB7VGVycml0b3J5U2VydmljZX0gZnJvbSAnLi90ZXJyaXRvcnkvdGVycml0b3J5LnNlcnZpY2UnO1xyXG5pbXBvcnQge1RlcnJpdG9yeVR5cGVTZXJ2aWNlfSBmcm9tICcuL3RlcnJpdG9yeS90ZXJyaXRvcnktdHlwZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUZXJyaXRvcnlHcm91cFR5cGVTZXJ2aWNlfSBmcm9tICcuL3RlcnJpdG9yeS90ZXJyaXRvcnktZ3JvdXAtdHlwZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtVc2VyUG9zaXRpb25TZXJ2aWNlfSBmcm9tICcuL3VzZXIvdXNlci1wb3NpdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHtVc2VyQ29uZmlndXJhdGlvblNlcnZpY2V9IGZyb20gJy4vdXNlci91c2VyLWNvbmZpZ3VyYXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7Um9sZVNlcnZpY2V9IGZyb20gJy4vcm9sZS9yb2xlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1VzZXJTZXJ2aWNlfSBmcm9tICcuL3VzZXIvdXNlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtDb25uZWN0aW9uU2VydmljZX0gZnJvbSAnLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb24uc2VydmljZSc7XHJcbmltcG9ydCB7VGFza1NlcnZpY2V9IGZyb20gJy4vdGFzay90YXNrLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tUeXBlU2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2stdHlwZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrR3JvdXBTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay1ncm91cC5zZXJ2aWNlJztcclxuaW1wb3J0IHtUYXNrUGFyYW1ldGVyU2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2stcGFyYW1ldGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge1Rhc2tBdmFpbGFiaWxpdHlTZXJ2aWNlfSBmcm9tICcuL3Rhc2svdGFzay1hdmFpbGFiaWxpdHkuc2VydmljZSc7XHJcbmltcG9ydCB7VGFza1VJU2VydmljZX0gZnJvbSAnLi90YXNrL3Rhc2stdWkuc2VydmljZSc7XHJcbmltcG9ydCB7U2VydmljZVNlcnZpY2V9IGZyb20gJy4vc2VydmljZS9zZXJ2aWNlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1NlcnZpY2VQYXJhbWV0ZXJTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2Uvc2VydmljZS1wYXJhbWV0ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LnNlcnZpY2UnO1xyXG5pbXBvcnQge0NhcnRvZ3JhcGh5QXZhaWxhYmlsaXR5U2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1hdmFpbGFiaWxpdHkuc2VydmljZSc7XHJcbmltcG9ydCB7Q2FydG9ncmFwaHlGaWx0ZXJTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LWZpbHRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeUdyb3VwU2VydmljZX0gZnJvbSAnLi9jYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1ncm91cC5zZXJ2aWNlJztcclxuaW1wb3J0IHtDYXJ0b2dyYXBoeVBhcmFtZXRlclNlcnZpY2V9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktcGFyYW1ldGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge0JhY2tncm91bmRTZXJ2aWNlfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2JhY2tncm91bmQuc2VydmljZSc7XHJcbmltcG9ydCB7VHJlZVNlcnZpY2V9IGZyb20gJy4vdHJlZS90cmVlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1RyZWVOb2RlU2VydmljZX0gZnJvbSAnLi90cmVlL3RyZWUtbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvblNlcnZpY2V9IGZyb20gJy4vYXBwbGljYXRpb24vYXBwbGljYXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7QXBwbGljYXRpb25QYXJhbWV0ZXJTZXJ2aWNlfSBmcm9tICcuL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLXBhcmFtZXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtBcHBsaWNhdGlvbkJhY2tncm91bmRTZXJ2aWNlfSBmcm9tICcuL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLWJhY2tncm91bmQuc2VydmljZSc7XHJcbmltcG9ydCB7IE1hcENvbmZpZ3VyYXRpb25NYW5hZ2VyU2VydmljZSB9IGZyb20gJy4vbWFwL21hcC1jb25maWd1cmF0aW9uLW1hbmFnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoL2F1dGguc2VydmljZSc7XHJcbmltcG9ydCB7IFByaW5jaXBhbCB9IGZyb20gJy4vYXV0aC9wcmluY2lwYWwuc2VydmljZSc7XHJcbmltcG9ydCB7IEF1dGhJbnRlcmNlcHRvciB9IGZyb20gJy4vYXV0aC9hdXRoLmludGVyY2VwdG9yJztcclxuaW1wb3J0IHsgQXV0aEV4cGlyZWRJbnRlcmNlcHRvciB9IGZyb20gJy4vYXV0aC9hdXRoLWV4cGlyZWQuaW50ZXJjZXB0b3InO1xyXG5pbXBvcnQgeyBIYXNBbnlBdXRob3JpdHlEaXJlY3RpdmUgfSBmcm9tICcuL2F1dGgvaGFzLWFueS1hdXRob3JpdHkuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgSGFzQW55QXV0aG9yaXR5T25UZXJyaXRvcnlEaXJlY3RpdmUgfSBmcm9tICcuL2F1dGgvaGFzLWFueS1hdXRob3JpdHktb24tdGVycml0b3J5LmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IExvZ2luU2VydmljZSB9IGZyb20gJy4vYXV0aC9sb2dpbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQWNjb3VudFNlcnZpY2UgfSBmcm9tICcuL2FjY291bnQvYWNjb3VudC5zZXJ2aWNlJztcclxuaW1wb3J0IHtUcmFuc2xhdGVIdHRwTG9hZGVyfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9odHRwLWxvYWRlcic7XHJcbmltcG9ydCB7VHJhbnNsYXRlTG9hZGVyLCBUcmFuc2xhdGVNb2R1bGV9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGlvblNlcnZpY2UgfSBmcm9tICcuL3RyYW5zbGF0aW9uL3RyYW5zbGF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMYW5ndWFnZVNlcnZpY2UgfSBmcm9tICcuL3RyYW5zbGF0aW9uL2xhbmd1YWdlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmRTZXJ2aWNlIH0gZnJvbSAnLi9kYXNoYm9hcmQvZGFzaGJvYXJkLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDYXBhYmlsaXRpZXNTZXJ2aWNlIH0gZnJvbSAnLi9jYXBhYmlsaXRpZXMvY2FwYWJpbGl0aWVzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUGFyYW1ldGVyc1NlcnZpY2UgfSBmcm9tICcuL2NvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvbi1wYXJhbWV0ZXJzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDYXJ0b2dyYXBoeVN0eWxlU2VydmljZSB9IGZyb20gJy4vY2FydG9ncmFwaHkvY2FydG9ncmFwaHktc3R5bGUuc2VydmljZSc7XHJcbmltcG9ydCB7IENhcnRvZ3JhcGh5U3BhdGlhbFNlbGVjdGlvblBhcmFtZXRlclNlcnZpY2UgfSBmcm9tICcuL2NhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LXNwYXRpYWwtc2VsZWN0aW9uLXBhcmFtZXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgR2V0SW5mb1NlcnZpY2UgfSBmcm9tICcuL2dldEluZm8vZ2V0SW5mby5zZXJ2aWNlJztcclxuLyoqIGxvYWQgaTE4biBhc3NldHMqL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhbnNsYXRlTG9hZGVyKGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICByZXR1cm4gbmV3IFRyYW5zbGF0ZUh0dHBMb2FkZXIoaHR0cCwgJy4vYXNzZXRzL2kxOG4vJywgJy5qc29uJyk7XHJcbn1cclxuXHJcblxyXG4vKiogU0lUTVVOIGZyb250ZW5kIGNvcmUgbW9kdWxlICovXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgLypSb3V0ZXJNb2R1bGUsXHJcbiAgICBIdHRwQ2xpZW50TW9kdWxlLFxyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgQW5ndWxhckhhbE1vZHVsZSwqL1xyXG4gICAgVHJhbnNsYXRlTW9kdWxlLmZvclJvb3Qoe1xyXG4gICAgICBsb2FkZXI6IHtcclxuICAgICAgICBwcm92aWRlOiBUcmFuc2xhdGVMb2FkZXIsXHJcbiAgICAgICAgdXNlRmFjdG9yeTogKGNyZWF0ZVRyYW5zbGF0ZUxvYWRlciksXHJcbiAgICAgICAgZGVwczogW0h0dHBDbGllbnRdXHJcbiAgICAgIH1cclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBIYXNBbnlBdXRob3JpdHlEaXJlY3RpdmUsXHJcbiAgICBIYXNBbnlBdXRob3JpdHlPblRlcnJpdG9yeURpcmVjdGl2ZSxcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIEhhc0FueUF1dGhvcml0eURpcmVjdGl2ZSxcclxuICAgIEhhc0FueUF1dGhvcml0eU9uVGVycml0b3J5RGlyZWN0aXZlLFxyXG4gICAgVHJhbnNsYXRlTW9kdWxlXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2l0bXVuRnJvbnRlbmRDb3JlTW9kdWxlIHtcclxuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5nTW9kdWxlOiBTaXRtdW5Gcm9udGVuZENvcmVNb2R1bGUsXHJcbiAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIENvZGVMaXN0U2VydmljZSxcclxuICAgICAgICBUZXJyaXRvcnlTZXJ2aWNlLFxyXG4gICAgICAgIFRlcnJpdG9yeVR5cGVTZXJ2aWNlLFxyXG4gICAgICAgIFRlcnJpdG9yeUdyb3VwVHlwZVNlcnZpY2UsXHJcbiAgICAgICAgUm9sZVNlcnZpY2UsXHJcbiAgICAgICAgQWNjb3VudFNlcnZpY2UsXHJcbiAgICAgICAgQXV0aFNlcnZpY2UsXHJcbiAgICAgICAgVXNlclNlcnZpY2UsXHJcbiAgICAgICAgQ29ubmVjdGlvblNlcnZpY2UsXHJcbiAgICAgICAgVGFza1NlcnZpY2UsXHJcbiAgICAgICAgVGFza1R5cGVTZXJ2aWNlLFxyXG4gICAgICAgIFRhc2tVSVNlcnZpY2UsXHJcbiAgICAgICAgVGFza0dyb3VwU2VydmljZSxcclxuICAgICAgICBUYXNrUGFyYW1ldGVyU2VydmljZSxcclxuICAgICAgICBUYXNrQXZhaWxhYmlsaXR5U2VydmljZSxcclxuICAgICAgICBTZXJ2aWNlU2VydmljZSxcclxuICAgICAgICBDb25maWd1cmF0aW9uUGFyYW1ldGVyc1NlcnZpY2UsXHJcbiAgICAgICAgQ2FwYWJpbGl0aWVzU2VydmljZSxcclxuICAgICAgICBHZXRJbmZvU2VydmljZSxcclxuICAgICAgICBTZXJ2aWNlUGFyYW1ldGVyU2VydmljZSxcclxuICAgICAgICBDYXJ0b2dyYXBoeVNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlHcm91cFNlcnZpY2UsXHJcbiAgICAgICAgQ2FydG9ncmFwaHlBdmFpbGFiaWxpdHlTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5UGFyYW1ldGVyU2VydmljZSxcclxuICAgICAgICBDYXJ0b2dyYXBoeVNwYXRpYWxTZWxlY3Rpb25QYXJhbWV0ZXJTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5U3R5bGVTZXJ2aWNlLFxyXG4gICAgICAgIENhcnRvZ3JhcGh5RmlsdGVyU2VydmljZSxcclxuICAgICAgICBCYWNrZ3JvdW5kU2VydmljZSxcclxuICAgICAgICBUcmVlU2VydmljZSxcclxuICAgICAgICBUcmVlTm9kZVNlcnZpY2UsXHJcbiAgICAgICAgQXBwbGljYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIEFwcGxpY2F0aW9uUGFyYW1ldGVyU2VydmljZSxcclxuICAgICAgICBBcHBsaWNhdGlvbkJhY2tncm91bmRTZXJ2aWNlLFxyXG4gICAgICAgIEF1dGhJbnRlcmNlcHRvcixcclxuICAgICAgICBBdXRoRXhwaXJlZEludGVyY2VwdG9yLFxyXG4gICAgICAgIFByaW5jaXBhbCxcclxuICAgICAgICBVc2VyUG9zaXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIFVzZXJDb25maWd1cmF0aW9uU2VydmljZSxcclxuICAgICAgICBMb2dpblNlcnZpY2UsXHJcbiAgICAgICAgVHJhbnNsYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIExhbmd1YWdlU2VydmljZSxcclxuICAgICAgICBEYXNoYm9hcmRTZXJ2aWNlLFxyXG4gICAgICAgIE1hcENvbmZpZ3VyYXRpb25NYW5hZ2VyU2VydmljZSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwcm92aWRlOiBIVFRQX0lOVEVSQ0VQVE9SUyxcclxuICAgICAgICAgIHVzZUNsYXNzOiBBdXRoSW50ZXJjZXB0b3IsXHJcbiAgICAgICAgICBtdWx0aTogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICAsIHtcclxuICAgICAgICAgIHByb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLFxyXG4gICAgICAgICAgdXNlQ2xhc3M6IEF1dGhFeHBpcmVkSW50ZXJjZXB0b3IsXHJcbiAgICAgICAgICBtdWx0aTogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbiJdfQ==