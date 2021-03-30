/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ExternalService } from './external.service';
import { ResourceService } from './resource.service';
import 'rxjs';
export { ExternalService } from './external.service';
export { RestService } from './rest.service';
export { Resource } from './resource';
export { ResourceArray } from './resource-array';
export { ResourceService } from './resource.service';
export { ResourceHelper } from './resource-helper';
/**
 * Angular HAL module
 */
var AngularHalModule = /** @class */ (function () {
    function AngularHalModule() {
    }
    /**
     * @return {?}
     */
    AngularHalModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: AngularHalModule,
            providers: [
                ExternalService,
                HttpClient,
                {
                    provide: ResourceService,
                    useClass: ResourceService,
                    deps: [ExternalService]
                }
            ]
        };
    };
    AngularHalModule.decorators = [
        { type: NgModule, args: [{
                    imports: [HttpClientModule],
                    declarations: [],
                    exports: [HttpClientModule],
                    providers: [
                        ExternalService,
                        HttpClient,
                        {
                            provide: ResourceService,
                            useClass: ResourceService,
                            deps: [ExternalService]
                        }
                    ]
                },] },
    ];
    return AngularHalModule;
}());
export { AngularHalModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1oYWwubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlL3NyYy9saWIvYW5ndWxhci1oYWwvIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1oYWwubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQXNCLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1RCxPQUFPLEVBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFbEUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUduRCxPQUFPLE1BQU0sQ0FBQztBQUlkLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNuRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNwQyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDL0MsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQzs7Ozs7Ozs7OztJQXNCdEMsd0JBQU87OztJQUFkO1FBQ0ksTUFBTSxDQUFDO1lBQ0gsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQixTQUFTLEVBQUU7Z0JBQ1AsZUFBZTtnQkFDZixVQUFVO2dCQUNWO29CQUNJLE9BQU8sRUFBRSxlQUFlO29CQUN4QixRQUFRLEVBQUUsZUFBZTtvQkFDekIsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDO2lCQUMxQjthQUNKO1NBQ0osQ0FBQztLQUNMOztnQkEzQkosUUFBUSxTQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixDQUFDO29CQUMzQixZQUFZLEVBQUUsRUFBRTtvQkFDaEIsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7b0JBQzNCLFNBQVMsRUFBRTt3QkFDUCxlQUFlO3dCQUNmLFVBQVU7d0JBQ1Y7NEJBQ0ksT0FBTyxFQUFFLGVBQWU7NEJBQ3hCLFFBQVEsRUFBRSxlQUFlOzRCQUN6QixJQUFJLEVBQUUsQ0FBQyxlQUFlLENBQUM7eUJBQzFCO3FCQUFDO2lCQUNUOzsyQkFyQ0Q7O1NBc0NhLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBDbGllbnRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtIYWxQYXJhbSwgUmVzdFNlcnZpY2V9IGZyb20gJy4vcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHtFeHRlcm5hbFNlcnZpY2V9IGZyb20gJy4vZXh0ZXJuYWwuc2VydmljZSc7XHJcbmltcG9ydCB7UmVzb3VyY2VTZXJ2aWNlfSBmcm9tICcuL3Jlc291cmNlLnNlcnZpY2UnO1xyXG5pbXBvcnQge0V4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2V9IGZyb20gJy4vZXh0ZXJuYWwtY29uZmlndXJhdGlvbi5oYW5kbGVyJztcclxuXHJcbmltcG9ydCAncnhqcyc7XHJcblxyXG5pbXBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcblxyXG5leHBvcnQge0V4dGVybmFsU2VydmljZX0gZnJvbSAnLi9leHRlcm5hbC5zZXJ2aWNlJztcclxuZXhwb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5leHBvcnQge1Jlc291cmNlfSBmcm9tICcuL3Jlc291cmNlJztcclxuZXhwb3J0IHtSZXNvdXJjZUFycmF5fSBmcm9tICcuL3Jlc291cmNlLWFycmF5JztcclxuZXhwb3J0IHtSZXNvdXJjZVNlcnZpY2V9IGZyb20gJy4vcmVzb3VyY2Uuc2VydmljZSc7XHJcbmV4cG9ydCB7U29ydH0gZnJvbSAnLi9zb3J0JztcclxuZXhwb3J0IHtSZXNvdXJjZUhlbHBlcn0gZnJvbSAnLi9yZXNvdXJjZS1oZWxwZXInO1xyXG5leHBvcnQge0V4dGVybmFsQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9FeHRlcm5hbENvbmZpZ3VyYXRpb24nO1xyXG5leHBvcnQge0V4dGVybmFsQ29uZmlndXJhdGlvbkhhbmRsZXJJbnRlcmZhY2V9IGZyb20gJy4vZXh0ZXJuYWwtY29uZmlndXJhdGlvbi5oYW5kbGVyJztcclxuZXhwb3J0IHtIYWxPcHRpb25zLCBIYWxQYXJhbX0gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5leHBvcnQge1N1YlR5cGVCdWlsZGVyfSBmcm9tICcuL3N1YnR5cGUtYnVpbGRlcic7XHJcblxyXG5cclxuLyoqIEFuZ3VsYXIgSEFMIG1vZHVsZSAqL1xyXG5ATmdNb2R1bGUoe1xyXG4gICAgaW1wb3J0czogW0h0dHBDbGllbnRNb2R1bGVdLFxyXG4gICAgZGVjbGFyYXRpb25zOiBbXSxcclxuICAgIGV4cG9ydHM6IFtIdHRwQ2xpZW50TW9kdWxlXSxcclxuICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIEV4dGVybmFsU2VydmljZSxcclxuICAgICAgICBIdHRwQ2xpZW50LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHJvdmlkZTogUmVzb3VyY2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICB1c2VDbGFzczogUmVzb3VyY2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICBkZXBzOiBbRXh0ZXJuYWxTZXJ2aWNlXVxyXG4gICAgICAgIH1dXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBbmd1bGFySGFsTW9kdWxlIHtcclxuICAgIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5nTW9kdWxlOiBBbmd1bGFySGFsTW9kdWxlLFxyXG4gICAgICAgICAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICAgICAgICAgIEV4dGVybmFsU2VydmljZSxcclxuICAgICAgICAgICAgICAgIEh0dHBDbGllbnQsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZTogUmVzb3VyY2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZUNsYXNzOiBSZXNvdXJjZVNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVwczogW0V4dGVybmFsU2VydmljZV1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0iXX0=