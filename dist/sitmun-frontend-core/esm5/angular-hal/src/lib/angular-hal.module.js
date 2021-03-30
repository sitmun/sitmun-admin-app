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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1oYWwubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlLyIsInNvdXJjZXMiOlsiYW5ndWxhci1oYWwvc3JjL2xpYi9hbmd1bGFyLWhhbC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBc0IsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVELE9BQU8sRUFBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUVsRSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBR25ELE9BQU8sTUFBTSxDQUFDO0FBSWQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUMvQyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFbkQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDOzs7Ozs7Ozs7O0lBc0J0Qyx3QkFBTzs7O0lBQWQ7UUFDSSxNQUFNLENBQUM7WUFDSCxRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLFNBQVMsRUFBRTtnQkFDUCxlQUFlO2dCQUNmLFVBQVU7Z0JBQ1Y7b0JBQ0ksT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFFBQVEsRUFBRSxlQUFlO29CQUN6QixJQUFJLEVBQUUsQ0FBQyxlQUFlLENBQUM7aUJBQzFCO2FBQ0o7U0FDSixDQUFDO0tBQ0w7O2dCQTNCSixRQUFRLFNBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7b0JBQzNCLFlBQVksRUFBRSxFQUFFO29CQUNoQixPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDM0IsU0FBUyxFQUFFO3dCQUNQLGVBQWU7d0JBQ2YsVUFBVTt3QkFDVjs0QkFDSSxPQUFPLEVBQUUsZUFBZTs0QkFDeEIsUUFBUSxFQUFFLGVBQWU7NEJBQ3pCLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQzt5QkFDMUI7cUJBQUM7aUJBQ1Q7OzJCQXJDRDs7U0FzQ2EsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cENsaWVudE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge0hhbFBhcmFtLCBSZXN0U2VydmljZX0gZnJvbSAnLi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQge0V4dGVybmFsU2VydmljZX0gZnJvbSAnLi9leHRlcm5hbC5zZXJ2aWNlJztcclxuaW1wb3J0IHtSZXNvdXJjZVNlcnZpY2V9IGZyb20gJy4vcmVzb3VyY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZX0gZnJvbSAnLi9leHRlcm5hbC1jb25maWd1cmF0aW9uLmhhbmRsZXInO1xyXG5cclxuaW1wb3J0ICdyeGpzJztcclxuXHJcbmltcG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuXHJcbmV4cG9ydCB7RXh0ZXJuYWxTZXJ2aWNlfSBmcm9tICcuL2V4dGVybmFsLnNlcnZpY2UnO1xyXG5leHBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmV4cG9ydCB7UmVzb3VyY2V9IGZyb20gJy4vcmVzb3VyY2UnO1xyXG5leHBvcnQge1Jlc291cmNlQXJyYXl9IGZyb20gJy4vcmVzb3VyY2UtYXJyYXknO1xyXG5leHBvcnQge1Jlc291cmNlU2VydmljZX0gZnJvbSAnLi9yZXNvdXJjZS5zZXJ2aWNlJztcclxuZXhwb3J0IHtTb3J0fSBmcm9tICcuL3NvcnQnO1xyXG5leHBvcnQge1Jlc291cmNlSGVscGVyfSBmcm9tICcuL3Jlc291cmNlLWhlbHBlcic7XHJcbmV4cG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9ufSBmcm9tICcuL0V4dGVybmFsQ29uZmlndXJhdGlvbic7XHJcbmV4cG9ydCB7RXh0ZXJuYWxDb25maWd1cmF0aW9uSGFuZGxlckludGVyZmFjZX0gZnJvbSAnLi9leHRlcm5hbC1jb25maWd1cmF0aW9uLmhhbmRsZXInO1xyXG5leHBvcnQge0hhbE9wdGlvbnMsIEhhbFBhcmFtfSBmcm9tICcuL3Jlc3Quc2VydmljZSc7XHJcbmV4cG9ydCB7U3ViVHlwZUJ1aWxkZXJ9IGZyb20gJy4vc3VidHlwZS1idWlsZGVyJztcclxuXHJcblxyXG4vKiogQW5ndWxhciBIQUwgbW9kdWxlICovXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbSHR0cENsaWVudE1vZHVsZV0sXHJcbiAgICBkZWNsYXJhdGlvbnM6IFtdLFxyXG4gICAgZXhwb3J0czogW0h0dHBDbGllbnRNb2R1bGVdLFxyXG4gICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgRXh0ZXJuYWxTZXJ2aWNlLFxyXG4gICAgICAgIEh0dHBDbGllbnQsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwcm92aWRlOiBSZXNvdXJjZVNlcnZpY2UsXHJcbiAgICAgICAgICAgIHVzZUNsYXNzOiBSZXNvdXJjZVNlcnZpY2UsXHJcbiAgICAgICAgICAgIGRlcHM6IFtFeHRlcm5hbFNlcnZpY2VdXHJcbiAgICAgICAgfV1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJIYWxNb2R1bGUge1xyXG4gICAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmdNb2R1bGU6IEFuZ3VsYXJIYWxNb2R1bGUsXHJcbiAgICAgICAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgICAgICAgICAgRXh0ZXJuYWxTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgSHR0cENsaWVudCxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlOiBSZXNvdXJjZVNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlQ2xhc3M6IFJlc291cmNlU2VydmljZSxcclxuICAgICAgICAgICAgICAgICAgICBkZXBzOiBbRXh0ZXJuYWxTZXJ2aWNlXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSJdfQ==